<?php

namespace App\Services\Meteorologia;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Throwable;

class MetarService
{
    private const BASE_URL =
        'https://aviationweather.gov/api/data/metar';

    public function current(string $icao): array
    {
        $icao = strtoupper(trim($icao));

        if ($icao === '') {
            return [
                'status' => 'invalid_icao',
                'data' => null,
                'error' => null,
            ];
        }

        if (! config('meteorologia.metar.enabled', true)) {
            return [
                'status' => 'disabled',
                'data' => null,
                'error' => null,
            ];
        }

        $cacheMinutes = (int) config(
            'meteorologia.metar.cache_minutes',
            5
        );

        $cacheKey =
            'meteorologia:metar:' . $icao;

        try {
            $data = Cache::remember(
                $cacheKey,
                now()->addMinutes($cacheMinutes),
                fn () => $this->fetchMetar($icao)
            );

            return [
                'status' => $data ? 'ok' : 'no_data',
                'data' => $data,
                'error' => null,
            ];
        } catch (Throwable $e) {
            report($e);

            return [
                'status' => 'error',
                'data' => null,
                'error' => $e->getMessage(),
            ];
        }
    }

    private function fetchMetar(string $icao): ?array
    {
        $response = Http::timeout(15)
            ->retry(2, 300)
            ->acceptJson()
            ->get(
                self::BASE_URL,
                [
                    'ids' => $icao,
                    'format' => 'json',
                ]
            );

        $response->throw();

        $json = $response->json();

        if (
            ! is_array($json)
            || count($json) === 0
        ) {
            return null;
        }

        $row = $json[0];

        return [
            'source' =>
                'AviationWeather.gov',

            'icao' =>
                $row['icaoId']
                ?? $icao,

            'type' =>
                $row['metarType']
                ?? null,

            'raw' =>
                $row['rawOb']
                ?? null,

            'observed_at' =>
                $row['reportTime']
                ?? null,

            'received_at' =>
                $row['receiptTime']
                ?? null,

            'flight_category' =>
                $row['fltCat']
                ?? null,

            'temperature_c' =>
                $row['temp']
                ?? null,

            'dewpoint_c' =>
                $row['dewp']
                ?? null,

            'pressure_hpa' =>
                $row['altim']
                ?? null,

            'visibility' =>
                $row['visib']
                ?? null,

            'wind' => [
                'direction_deg' =>
                    $row['wdir']
                    ?? null,

                'speed_kt' =>
                    $row['wspd']
                    ?? null,

                'gust_kt' =>
                    $row['wgst']
                    ?? null,
            ],

            'cloud_cover' =>
                $row['cover']
                ?? null,

            'clouds' =>
                $this->normalizeClouds(
                    $row['clouds']
                    ?? []
                ),

            'location' => [
                'lat' =>
                    $row['lat']
                    ?? null,

                'lon' =>
                    $row['lon']
                    ?? null,

                'elevation_m' =>
                    $row['elev']
                    ?? null,

                'name' =>
                    $row['name']
                    ?? null,
            ],
        ];
    }

    private function normalizeClouds(array $clouds): array
    {
        return array_values(
            array_map(
                fn ($cloud) => [
                    'cover' =>
                        $cloud['cover']
                        ?? null,

                    'base_ft' =>
                        $cloud['base']
                        ?? null,
                ],
                $clouds
            )
        );
    }
}
