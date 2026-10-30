<?php

namespace App\Services\Meteorologia;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Throwable;

class TafService
{
    private const BASE_URL =
        'https://aviationweather.gov/api/data/taf';

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

        if (! config('meteorologia.taf.enabled', true)) {
            return [
                'status' => 'disabled',
                'data' => null,
                'error' => null,
            ];
        }

        $cacheMinutes = (int) config(
            'meteorologia.taf.cache_minutes',
            10
        );

        $cacheKey =
            'meteorologia:taf:' . $icao;

        try {
            $data = Cache::remember(
                $cacheKey,
                now()->addMinutes($cacheMinutes),
                fn () => $this->fetchTaf($icao)
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

    private function fetchTaf(string $icao): ?array
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

            'raw' =>
                $row['rawTAF']
                ?? null,

            'issued_at' =>
                $row['issueTime']
                ?? null,

            'bulletin_at' =>
                $row['bulletinTime']
                ?? null,

            'valid_from' =>
                $this->timestampToIso(
                    $row['validTimeFrom']
                    ?? null
                ),

            'valid_to' =>
                $this->timestampToIso(
                    $row['validTimeTo']
                    ?? null
                ),

            'most_recent' =>
                (bool) (
                    $row['mostRecent']
                    ?? false
                ),

            'remarks' =>
                $row['remarks']
                ?? null,

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

            'segments' =>
                $this->normalizeSegments(
                    $row['fcsts']
                    ?? []
                ),
        ];
    }

    private function normalizeSegments(array $segments): array
    {
        return array_values(
            array_map(
                function ($segment) {
                    return [
                        'from' =>
                            $this->timestampToIso(
                                $segment['timeFrom']
                                ?? null
                            ),

                        'to' =>
                            $this->timestampToIso(
                                $segment['timeTo']
                                ?? null
                            ),

                        'became_at' =>
                            $this->timestampToIso(
                                $segment['timeBec']
                                ?? null
                            ),

                        'change' =>
                            $segment['fcstChange']
                            ?? 'BASE',

                        'probability_pct' =>
                            $segment['probability']
                            ?? null,

                        'wind' => [
                            'direction_deg' =>
                                $segment['wdir']
                                ?? null,

                            'speed_kt' =>
                                $segment['wspd']
                                ?? null,

                            'gust_kt' =>
                                $segment['wgst']
                                ?? null,
                        ],

                        'visibility' =>
                            $segment['visib']
                            ?? null,

                        'weather' =>
                            $segment['wxString']
                            ?? null,

                        'vertical_visibility_ft' =>
                            $segment['vertVis']
                            ?? null,

                        'wind_shear' => [
                            'height_ft' =>
                                $segment['wshearHgt']
                                ?? null,

                            'direction_deg' =>
                                $segment['wshearDir']
                                ?? null,

                            'speed_kt' =>
                                $segment['wshearSpd']
                                ?? null,
                        ],

                        'clouds' =>
                            $this->normalizeClouds(
                                $segment['clouds']
                                ?? []
                            ),

                        'temperatures' =>
                            $this->normalizeTemperatures(
                                $segment['temp']
                                ?? []
                            ),

                        'not_decoded' =>
                            $segment['notDecoded']
                            ?? null,
                    ];
                },
                $segments
            )
        );
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

                    'type' =>
                        $cloud['type']
                        ?? null,
                ],
                $clouds
            )
        );
    }

    private function normalizeTemperatures(
        array $temperatures
    ): array {
        return array_values(
            array_map(
                fn ($temperature) => [
                    'time' =>
                        $this->timestampToIso(
                            $temperature['validTime']
                            ?? null
                        ),

                    'temperature_c' =>
                        $temperature['surfaceTemp']
                        ?? null,

                    'type' =>
                        $temperature['maxOrMin']
                        ?? null,
                ],
                $temperatures
            )
        );
    }

    private function timestampToIso(
        mixed $timestamp
    ): ?string {
        if (
            $timestamp === null
            || $timestamp === ''
        ) {
            return null;
        }

        return gmdate(
            'Y-m-d\TH:i:s\Z',
            (int) $timestamp
        );
    }
}
