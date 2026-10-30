<?php

namespace App\Services\Aerodromos;

use App\Models\Aerodromo;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class AerodromoQueryService
{
    public function query(array $filters): Builder
    {
        $query = Aerodromo::query();

        $term = trim((string) ($filters['q'] ?? ''));

        if ($term !== '') {
            $like = '%' . mb_strtolower($term) . '%';

            $query->where(function (Builder $builder) use ($like) {
                $builder
                    ->whereRaw('LOWER(nombre) LIKE ?', [$like])
                    ->orWhereRaw(
                        "LOWER(COALESCE(designador_oaci, '')) LIKE ?",
                        [$like]
                    )
                    ->orWhereRaw(
                        "LOWER(COALESCE(designador_local, '')) LIKE ?",
                        [$like]
                    )
                    ->orWhereRaw(
                        "LOWER(COALESCE(designador_iata, '')) LIKE ?",
                        [$like]
                    );
            });
        }

        if (! empty($filters['provincia'])) {
            $query->where(
                'provincia',
                $filters['provincia']
            );
        }

        if (! empty($filters['tipo'])) {
            $query->where(
                'tipo',
                $filters['tipo']
            );
        }

        $sort = $filters['sort'] ?? 'nombre';
        $direction = $filters['direction'] ?? 'asc';

        return $query
            ->orderBy($sort, $direction)
            ->orderBy('id');
    }

    public function paginate(array $filters): LengthAwarePaginator
    {
        $perPage = (int) (
            $filters['per_page']
            ?? config('aeroinfo.pagination.per_page', 20)
        );

        $maxPerPage = (int) config(
            'aeroinfo.pagination.max_per_page',
            100
        );

        $perPage = max(
            1,
            min($perPage, $maxPerPage)
        );

        return $this
            ->query($filters)
            ->paginate($perPage)
            ->withQueryString();
    }

    public function map(array $filters)
    {
        return $this
            ->query($filters)
            ->whereNotNull('latitud')
            ->whereNotNull('longitud')
            ->limit(2000)
            ->get([
                'id',
                'slug',
                'nombre',
                'designador_oaci',
                'designador_local',
                'tipo',
                'provincia',
                'latitud',
                'longitud',
            ]);
    }
}