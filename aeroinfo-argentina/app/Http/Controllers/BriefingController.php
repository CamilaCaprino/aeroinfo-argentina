<?php

namespace App\Http\Controllers;

use App\Models\Aerodromo;
use App\Services\Meteorologia\MeteorologiaService;
use App\Services\Notam\AerodromoNotamService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BriefingController extends Controller
{
    public function index(
        Request $request,
        MeteorologiaService $meteorologiaService,
        AerodromoNotamService $notamService
    ): Response {
        $options = Aerodromo::query()
            ->select([
                'id', 'slug', 'nombre', 'tipo', 'localidad', 'provincia',
                'designador_oaci', 'designador_local', 'designador_iata',
            ])
            ->orderBy('nombre')
            ->get();

        $input = $request->validate([
            'origin' => ['nullable', 'string', 'max:255', 'exists:aerodromos,slug'],
            'destination' => ['nullable', 'string', 'max:255', 'exists:aerodromos,slug'],
            'alternate' => ['nullable', 'string', 'max:255', 'exists:aerodromos,slug'],
        ]);

        $filters = [
            'origin' => $input['origin'] ?? '',
            'destination' => $input['destination'] ?? '',
            'alternate' => $input['alternate'] ?? '',
        ];

        $briefing = null;

        if ($filters['origin'] !== '' && $filters['destination'] !== '') {
            $slugs = array_values(array_unique(array_filter($filters)));
            $aerodromos = Aerodromo::query()
                ->with('pistas')
                ->whereIn('slug', $slugs)
                ->get()
                ->keyBy('slug');

            $computed = [];
            foreach ($slugs as $slug) {
                $aerodromo = $aerodromos->get($slug);
                if ($aerodromo !== null) {
                    $computed[$slug] = $this->buildAerodromeBriefing(
                        $aerodromo,
                        $meteorologiaService,
                        $notamService
                    );
                }
            }

            $briefing = [
                'generated_at' => now()->toIso8601String(),
                'origin' => $computed[$filters['origin']] ?? null,
                'destination' => $computed[$filters['destination']] ?? null,
                'alternate' => $filters['alternate'] !== ''
                    ? ($computed[$filters['alternate']] ?? null)
                    : null,
            ];
        }

        return Inertia::render('Briefing/Index', [
            'aerodromos' => $options,
            'filters' => $filters,
            'briefing' => $briefing,
        ]);
    }

    private function buildAerodromeBriefing(
        Aerodromo $aerodromo,
        MeteorologiaService $meteorologiaService,
        AerodromoNotamService $notamService
    ): array {
        return [
            'aerodromo' => $aerodromo->only([
                'id', 'slug', 'nombre', 'tipo', 'localidad', 'provincia',
                'designador_oaci', 'designador_local', 'designador_iata',
                'latitud', 'longitud', 'elevacion_m',
            ]) + ['pistas' => $aerodromo->pistas],
            'meteorologia' => $meteorologiaService->forAerodromo($aerodromo),
            'notams' => $notamService->forAerodromo($aerodromo),
        ];
    }
}
