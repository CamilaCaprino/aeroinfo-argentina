<?php

namespace App\Http\Controllers;

use App\Http\Requests\AerodromoIndexRequest;
use App\Models\Aerodromo;
use App\Services\Aerodromos\AerodromoQueryService;
use App\Services\Meteorologia\MeteorologiaService;
use Inertia\Inertia;
use Inertia\Response;

class AerodromoController extends Controller
{
    public function index(
        AerodromoIndexRequest $request,
        AerodromoQueryService $service
    ): Response {
        $filters = $request->validated();

        $provincias = Aerodromo::query()
            ->whereNotNull('provincia')
            ->where('provincia', '<>', '')
            ->distinct()
            ->orderBy('provincia')
            ->pluck('provincia')
            ->values();

        $tipos = Aerodromo::query()
            ->whereNotNull('tipo')
            ->where('tipo', '<>', '')
            ->distinct()
            ->orderBy('tipo')
            ->pluck('tipo')
            ->values();

        return Inertia::render(
            'Aerodromos/Index',
            [
                'aerodromos' => $service->paginate($filters),
                'filters' => $filters,
                'provincias' => $provincias,
                'tipos' => $tipos,
            ]
        );
    }

    public function show(
        Aerodromo $aerodromo,
        MeteorologiaService $meteorologiaService
    ): Response {
        $aerodromo->load([
            'referencias.fuente',
            'pistas',
        ]);

        $meteorologia =
            $meteorologiaService->forAerodromo(
                $aerodromo
            );

        return Inertia::render(
            'Aerodromos/Show',
            [
                'aerodromo' => $aerodromo,
                'meteorologia' => $meteorologia,
            ]
        );
    }
}