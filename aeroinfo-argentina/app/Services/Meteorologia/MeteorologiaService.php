<?php

namespace App\Services\Meteorologia;

use App\Models\Aerodromo;
use App\Models\EstacionMeteorologica;
use Illuminate\Support\Facades\DB;
use Throwable;

class MeteorologiaService
{
    public function __construct(
        private SmnService $smnService,
        private OpenMeteoService $openMeteoService,
    ) {
    }

    public function forAerodromo(
        Aerodromo $aerodromo
    ): array {
        $latitude = $this->number(
            $aerodromo->latitud
        );

        $longitude = $this->number(
            $aerodromo->longitud
        );

        if (
            $latitude === null
            || $longitude === null
        ) {
            return [
                'status' => 'no_location',

                'observacion' => [
                    'status' => 'no_location',
                    'data' => null,
                ],

                'pronostico' => [
                    'status' => 'no_location',
                    'data' => null,
                ],
            ];
        }

        /*
         * OBSERVACIÓN SMN
         */
        $observacion = $this->observacionSmn(
            $aerodromo
        );

        /*
         * PRONÓSTICO
         *
         * Se consulta directamente para las coordenadas
         * del aeródromo, no para la estación SMN.
         */
        $pronostico =
            $this->openMeteoService->forecast(
                $latitude,
                $longitude
            );

        return [
            'status' => 'ok',

            'location' => [
                'lat' => $latitude,
                'lon' => $longitude,
            ],

            'observacion' =>
                $observacion,

            'pronostico' =>
                $pronostico,
        ];
    }

    private function observacionSmn(
        Aerodromo $aerodromo
    ): array {
        try {
            /*
             * PRIMERA PRIORIDAD:
             * coincidencia exacta por OACI.
             */
            $exacta =
                $this->estacionExactaPorOaci(
                    $aerodromo
                );

            if ($exacta) {
                $resultado =
                    $this->smnService->current(
                        $exacta
                    );

                return [
                    ...$resultado,

                    'association' => [
                        'type' =>
                            'exact_oaci',

                        'confidence' =>
                            'maximum',

                        'label' =>
                            'Estación meteorológica del aeródromo',

                        'distance_km' =>
                            $this->distanceBetween(
                                $aerodromo,
                                $exacta
                            ),
                    ],
                ];
            }

            /*
             * SEGUNDA PRIORIDAD:
             * estación SMN geográficamente más cercana.
             */
            $nearest =
                $this->estacionMasCercana(
                    $aerodromo
                );

            if (! $nearest) {
                return [
                    'status' =>
                        'no_station',

                    'data' =>
                        null,

                    'error' =>
                        null,

                    'association' => [
                        'type' =>
                            'none',

                        'confidence' =>
                            'none',

                        'label' =>
                            'Sin estación SMN disponible',

                        'distance_km' =>
                            null,
                    ],
                ];
            }

            $distanceKm =
                (float) $nearest->distance_km;

            $association =
                $this->classifyDistance(
                    $distanceKm
                );

            /*
             * Más de 100 km:
             *
             * No mostramos esta observación como si
             * representara condiciones locales del
             * aeródromo.
             */
            if ($distanceKm > 100) {
                return [
                    'status' =>
                        'too_far',

                    'data' =>
                        null,

                    'error' =>
                        null,

                    'association' => [
                        ...$association,

                        'station' => [
                            'id' =>
                                $nearest->id,

                            'name' =>
                                $nearest->nombre,

                            'oaci' =>
                                $nearest->codigo_oaci,

                            'number' =>
                                $nearest->numero_estacion,
                        ],
                    ],
                ];
            }

            $resultado =
                $this->smnService->current(
                    $nearest
                );

            return [
                ...$resultado,

                'association' => [
                    ...$association,

                    'station' => [
                        'id' =>
                            $nearest->id,

                        'name' =>
                            $nearest->nombre,

                        'oaci' =>
                            $nearest->codigo_oaci,

                        'number' =>
                            $nearest->numero_estacion,
                    ],
                ],
            ];
        } catch (Throwable $e) {
            report($e);

            return [
                'status' =>
                    'error',

                'data' =>
                    null,

                'error' =>
                    $e->getMessage(),

                'association' =>
                    null,
            ];
        }
    }

    private function estacionExactaPorOaci(
        Aerodromo $aerodromo
    ): ?EstacionMeteorologica {
        $oaci = trim(
            (string) $aerodromo->designador_oaci
        );

        if ($oaci === '') {
            return null;
        }

        return EstacionMeteorologica::query()
            ->where('activa', true)
            ->whereRaw(
                'UPPER(TRIM(codigo_oaci)) = ?',
                [
                    strtoupper($oaci),
                ]
            )
            ->first();
    }

    private function estacionMasCercana(
        Aerodromo $aerodromo
    ): ?EstacionMeteorologica {
        if (! $aerodromo->ubicacion) {
            return null;
        }

        $row = DB::selectOne(
            '
            SELECT
                e.id,
                ST_Distance(
                    a.ubicacion,
                    e.ubicacion::geography
                ) / 1000.0 AS distance_km
            FROM aerodromos a
            CROSS JOIN estaciones_meteorologicas e
            WHERE a.id = ?
            AND e.activa = true
            AND e.ubicacion IS NOT NULL
            ORDER BY
                ST_Distance(
                    a.ubicacion,
                    e.ubicacion::geography
                )
            LIMIT 1
            ',
            [
                $aerodromo->id,
            ]
        );

        if (! $row) {
            return null;
        }

        $estacion =
            EstacionMeteorologica::find(
                $row->id
            );

        if (! $estacion) {
            return null;
        }

        $estacion->distance_km =
            (float) $row->distance_km;

        return $estacion;
    }

    private function distanceBetween(
        Aerodromo $aerodromo,
        EstacionMeteorologica $estacion
    ): ?float {
        if (
            ! $aerodromo->ubicacion
            || ! $estacion->ubicacion
        ) {
            return null;
        }

        $result = DB::selectOne(
            '
            SELECT
                ST_Distance(
                    a.ubicacion,
                    e.ubicacion::geography
                ) / 1000.0
                AS distance_km
            FROM aerodromos a
            CROSS JOIN estaciones_meteorologicas e
            WHERE a.id = ?
              AND e.id = ?
            LIMIT 1
            ',
            [
                $aerodromo->id,
                $estacion->id,
            ]
        );

        if (
            ! $result
            || $result->distance_km === null
        ) {
            return null;
        }

        return round(
            (float) $result->distance_km,
            1
        );
    }

    private function classifyDistance(
        float $distanceKm
    ): array {
        $distanceKm =
            round(
                $distanceKm,
                1
            );

        if ($distanceKm <= 25) {
            return [
                'type' =>
                    'nearest',

                'confidence' =>
                    'high',

                'label' =>
                    'Observación cercana',

                'distance_km' =>
                    $distanceKm,
            ];
        }

        if ($distanceKm <= 50) {
            return [
                'type' =>
                    'nearest',

                'confidence' =>
                    'medium',

                'label' =>
                    'Observación de referencia',

                'distance_km' =>
                    $distanceKm,
            ];
        }

        if ($distanceKm <= 100) {
            return [
                'type' =>
                    'nearest',

                'confidence' =>
                    'regional',

                'label' =>
                    'Referencia meteorológica regional',

                'distance_km' =>
                    $distanceKm,
            ];
        }

        return [
            'type' =>
                'nearest',

            'confidence' =>
                'too_far',

            'label' =>
                'Estación demasiado distante',

            'distance_km' =>
                $distanceKm,
        ];
    }

    private function number(
        mixed $value
    ): ?float {
        if (! is_numeric($value)) {
            return null;
        }

        return (float) $value;
    }
}