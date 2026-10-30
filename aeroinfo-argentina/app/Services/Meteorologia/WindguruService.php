<?php

namespace App\Services\Meteorologia;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Throwable;

class WindguruService
{
    private const BASE_URL = 'https://api.windguru.cz';

    public function forecast(
        float $latitude,
        float $longitude
    ): array {
        if (! config('meteorologia.windguru.enabled', false)) {
            return [
                'status' => 'disabled',
                'data' => null,
                'error' => null,
            ];
        }

        $apiKey = config(
            'meteorologia.windguru.api_key'
        );

        if (! $apiKey) {
            return [
                'status' => 'not_configured',
                'data' => null,
                'error' => null,
            ];
        }

        $model = config(
            'meteorologia.windguru.model',
            'gfs'
        );

        $cacheMinutes = (int) config(
            'meteorologia.windguru.cache_minutes',
            60
        );

        $cacheKey = sprintf(
            'meteorologia:windguru:forecast:%s:%.4f:%.4f',
            $model,
            $latitude,
            $longitude
        );

        try {
            $data = Cache::remember(
                $cacheKey,
                now()->addMinutes($cacheMinutes),
                function () use (
                    $latitude,
                    $longitude,
                    $apiKey,
                    $model
                ) {
                    return $this->fetchForecast(
                        $latitude,
                        $longitude,
                        $apiKey,
                        $model
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

    private function fetchForecast(
        float $latitude,
        float $longitude,
        string $apiKey,
        string $model
    ): ?array {
        /*
         * Todavía no conectamos el endpoint final.
         *
         * Primero vamos a crear/probar la API key
         * oficial de Windguru y verificar la respuesta
         * real del endpoint.
         */

        return [
            'source' => 'Windguru',
            'model' => $model,

            'location' => [
                'lat' => $latitude,
                'lon' => $longitude,
            ],

            'forecast' => [],
        ];
    }
}
