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

        return Inertia::render(
            'Aerodromos/Index',
            [
                'aerodromos' =>
                    $service->search($filters),

                'filters' =>
                    $filters,
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
                'aerodromo' =>
                    $aerodromo,

                'meteorologia' =>
                    $meteorologia,
            ]
        );
    }
}