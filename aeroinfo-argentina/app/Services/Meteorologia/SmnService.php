<?php

namespace App\Services\Meteorologia;

use App\Models\EstacionMeteorologica;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Throwable;

class SmnService
{
    private const BASE_URL =
        'https://w2b.smn.gov.ar/oapi/collections/urn:wmo:md:ar-smn:slt0ci/items';

    public function current(
        EstacionMeteorologica $estacion
    ): array {
        if (! config('meteorologia.smn.enabled', true)) {
            return [
                'status' => 'disabled',
                'data' => null,
                'error' => null,
            ];
        }

        $wigos = $this->wigosFromStation(
            $estacion
        );

        if (! $wigos) {
            return [
                'status' => 'no_wigos',
                'data' => null,
                'error' => null,
            ];
        }

        $cacheMinutes = (int) config(
            'meteorologia.smn.current_cache_minutes',
            10
        );

        $cacheKey =
            'meteorologia:smn:current:'
            . $wigos;

        try {
            $data = Cache::remember(
                $cacheKey,
                now()->addMinutes($cacheMinutes),
                function () use ($wigos, $estacion) {
                    return $this->fetchCurrent(
                        $wigos,
                        $estacion
                    );
                }
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

    private function fetchCurrent(
        string $wigos,
        EstacionMeteorologica $estacion
    ): ?array {
        $response = Http::timeout(12)
            ->retry(2, 300)
            ->get(
                self::BASE_URL,
                [
                    'wigos_station_identifier' =>
                        $wigos,

                    'sortby' =>
                        '-reportTime',

                    'limit' =>
                        60,

                    'f' =>
                        'json',
                ]
            );

        $response->throw();

        $features = $response->json(
            'features',
            []
        );

        if (! is_array($features)
            || count($features) === 0) {
            return null;
        }

        /*
         * Como precaución, filtramos nosotros también
         * por WIGOS. Así no dependemos de que el backend
         * OGC aplique correctamente el filtro.
         */
        $features = array_values(
            array_filter(
                $features,
                fn (array $feature) =>
                    data_get(
                        $feature,
                        'properties.wigos_station_identifier'
                    ) === $wigos
            )
        );

        if (count($features) === 0) {
            return null;
        }

        /*
         * Buscamos el reportTime más reciente.
         */
        $latestReportTime = collect(
            $features
        )
            ->pluck(
                'properties.reportTime'
            )
            ->filter()
            ->sortDesc()
            ->first();

        if (! $latestReportTime) {
            return null;
        }

        /*
         * Usamos únicamente variables pertenecientes
         * a la última observación.
         */
        $latest = array_values(
            array_filter(
                $features,
                fn (array $feature) =>
                    data_get(
                        $feature,
                        'properties.reportTime'
                    ) === $latestReportTime
            )
        );

        $values = [];

        foreach ($latest as $feature) {
            $properties =
                $feature['properties']
                ?? [];

            $name =
                $properties['name']
                ?? null;

            if (! $name) {
                continue;
            }

            /*
             * Algunas variables pueden repetirse
             * (nubes, tipos, etc.).
             *
             * Para variables meteorológicas simples
             * nos alcanza con la primera aparición.
             */
            if (! array_key_exists(
                $name,
                $values
            )) {
                $values[$name] = [
                    'value' =>
                        $properties['value']
                        ?? null,

                    'units' =>
                        $properties['units']
                        ?? null,

                    'description' =>
                        $properties['description']
                        ?? null,

                    'phenomenon_time' =>
                        $properties['phenomenonTime']
                        ?? null,
                ];
            }
        }

        $temperature = $this->number(
            $values['air_temperature']['value']
            ?? null
        );

        $dewpoint = $this->number(
            $values['dewpoint_temperature']['value']
            ?? null
        );

        $windSpeedMs = $this->number(
            $values['wind_speed']['value']
            ?? null
        );

        $windDirection = $this->number(
            $values['wind_direction']['value']
            ?? null
        );

        $pressure = $this->number(
            $values[
                'pressure_reduced_to_mean_sea_level'
            ]['value']
            ?? null
        );

        $visibility = $this->number(
            $values[
                'horizontal_visibility'
            ]['value']
            ?? null
        );

        $cloudCover = $this->number(
            $values[
                'cloud_cover_total'
            ]['value']
            ?? null
        );

        $humidity = (
            $temperature !== null
            && $dewpoint !== null
        )
            ? $this->relativeHumidity(
                $temperature,
                $dewpoint
            )
            : null;

        return [
            'source' => 'SMN / WIS2',

            'station' => [
                'id' =>
                    $estacion->id,

                'name' =>
                    $estacion->nombre,

                'oaci' =>
                    $estacion->codigo_oaci,

                'number' =>
                    $estacion->numero_estacion,

                'wigos' =>
                    $wigos,

                'lat' =>
                    $estacion->latitud,

                'lon' =>
                    $estacion->longitud,
            ],

            'observed_at' =>
                $latestReportTime,

            'temperature_c' =>
                $temperature,

            'dewpoint_c' =>
                $dewpoint,

            'humidity_pct' =>
                $humidity,

            'pressure_hpa' =>
                $pressure,

            'visibility_m' =>
                $visibility,

            'cloud_cover_pct' =>
                $cloudCover,

            'wind' => [
                'direction_deg' =>
                    $windDirection,

                'speed_ms' =>
                    $windSpeedMs,

                'speed_kt' =>
                    $windSpeedMs !== null
                        ? round(
                            $windSpeedMs
                            * 1.943844,
                            1
                        )
                        : null,
            ],

            'weather' => [
                'description' =>
                    $values[
                        'present_weather'
                    ]['description']
                    ?? null,
            ],
        ];
    }

    private function wigosFromStation(
        EstacionMeteorologica $estacion
    ): ?string {
        $number = trim(
            (string) $estacion->numero_estacion
        );

        if ($number === '') {
            return null;
        }

        /*
         * Para las estaciones convencionales SMN que
         * importamos desde el listado, el WIGOS utiliza:
         *
         * 0-20000-0-{numero_estacion}
         */
        return '0-20000-0-' . $number;
    }

    private function number(
        mixed $value
    ): ?float {
        if (! is_numeric($value)) {
            return null;
        }

        return (float) $value;
    }

    private function relativeHumidity(
        float $temperature,
        float $dewpoint
    ): int {
        /*
         * Aproximación de Magnus.
         */
        $a = 17.625;
        $b = 243.04;

        $rh =
            100
            * exp(
                ($a * $dewpoint)
                / ($b + $dewpoint)
            )
            / exp(
                ($a * $temperature)
                / ($b + $temperature)
            );

        return (int) round(
            max(
                0,
                min(100, $rh)
            )
        );
    }
}
