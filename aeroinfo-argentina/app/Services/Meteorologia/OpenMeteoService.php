<?php

namespace App\Services\Meteorologia;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Throwable;

class OpenMeteoService
{
    private const BASE_URL =
        'https://api.open-meteo.com/v1/forecast';

    public function forecast(
        float $latitude,
        float $longitude
    ): array {
        if (! config(
            'meteorologia.open_meteo.enabled',
            true
        )) {
            return [
                'status' => 'disabled',
                'data' => null,
                'error' => null,
            ];
        }

        $model = config(
            'meteorologia.open_meteo.model',
            'ecmwf_ifs025'
        );

        $cacheMinutes = (int) config(
            'meteorologia.open_meteo.cache_minutes',
            60
        );

        $cacheKey = sprintf(
            'meteorologia:openmeteo:%s:%.4f:%.4f',
            $model,
            $latitude,
            $longitude
        );

        try {
            $data = Cache::remember(
                $cacheKey,
                now()->addMinutes($cacheMinutes),
                fn () => $this->fetchForecast(
                    $latitude,
                    $longitude,
                    $model
                )
            );

            return [
                'status' => $data
                    ? 'ok'
                    : 'no_data',

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

    private function fetchForecast(
        float $latitude,
        float $longitude,
        string $model
    ): ?array {
        $response = Http::timeout(15)
            ->retry(2, 300)
            ->get(
                self::BASE_URL,
                [
                    'latitude' =>
                        $latitude,

                    'longitude' =>
                        $longitude,

                    'models' =>
                        $model,

                    'timezone' =>
                        'America/Argentina/Buenos_Aires',

                    'forecast_days' =>
                        7,

                    'wind_speed_unit' =>
                        'kn',

                    'hourly' =>
                        implode(',', [
                            'temperature_2m',
                            'relative_humidity_2m',
                            'dew_point_2m',
                            'precipitation_probability',
                            'precipitation',
                            'weather_code',
                            'cloud_cover',
                            'visibility',
                            'pressure_msl',
                            'wind_speed_10m',
                            'wind_direction_10m',
                            'wind_gusts_10m',
                        ]),
                ]
            );

        $response->throw();

        $json = $response->json();

        if (
            ! isset($json['hourly'])
            || ! isset($json['hourly']['time'])
        ) {
            return null;
        }

        return [
            'source' =>
                'Open-Meteo',

            'model' =>
                $model,

            'location' => [
                'lat' =>
                    $json['latitude']
                    ?? $latitude,

                'lon' =>
                    $json['longitude']
                    ?? $longitude,

                'elevation_m' =>
                    $json['elevation']
                    ?? null,
            ],

            'timezone' =>
                $json['timezone']
                ?? 'America/Argentina/Buenos_Aires',

            'hourly_units' =>
                $json['hourly_units']
                ?? [],

            'hourly' =>
                $this->normalizeHourly(
                    $json['hourly']
                ),
        ];
    }

    private function normalizeHourly(
        array $hourly
    ): array {
        $times =
            $hourly['time']
            ?? [];

        $rows = [];

        foreach (
            $times as $index => $time
        ) {
            $rows[] = [
                'time' =>
                    $time,

                'temperature_c' =>
                    $hourly[
                        'temperature_2m'
                    ][$index]
                    ?? null,

                'humidity_pct' =>
                    $hourly[
                        'relative_humidity_2m'
                    ][$index]
                    ?? null,

                'dewpoint_c' =>
                    $hourly[
                        'dew_point_2m'
                    ][$index]
                    ?? null,

                'precipitation_probability_pct' =>
                    $hourly[
                        'precipitation_probability'
                    ][$index]
                    ?? null,

                'precipitation_mm' =>
                    $hourly[
                        'precipitation'
                    ][$index]
                    ?? null,

                'weather_code' =>
                    $hourly[
                        'weather_code'
                    ][$index]
                    ?? null,

                'cloud_cover_pct' =>
                    $hourly[
                        'cloud_cover'
                    ][$index]
                    ?? null,

                'visibility_m' =>
                    $hourly[
                        'visibility'
                    ][$index]
                    ?? null,

                'pressure_hpa' =>
                    $hourly[
                        'pressure_msl'
                    ][$index]
                    ?? null,

                'wind_speed_kt' =>
                    $hourly[
                        'wind_speed_10m'
                    ][$index]
                    ?? null,

                'wind_direction_deg' =>
                    $hourly[
                        'wind_direction_10m'
                    ][$index]
                    ?? null,

                'wind_gust_kt' =>
                    $hourly[
                        'wind_gusts_10m'
                    ][$index]
                    ?? null,
            ];
        }

        return $rows;
    }
}
