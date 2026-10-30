<?php

return [

    'smn' => [
        'enabled' => env('SMN_ENABLED', true),

        'current_cache_minutes' => env(
            'SMN_CURRENT_CACHE_MINUTES',
            10
        ),

        'stations_cache_hours' => env(
            'SMN_STATIONS_CACHE_HOURS',
            24
        ),
    ],

    'windguru' => [
        'enabled' => env('WINDGURU_ENABLED', false),

        'api_key' => env('WINDGURU_API_KEY'),

        'model' => env(
            'WINDGURU_MODEL',
            'gfs'
        ),

        'cache_minutes' => env(
            'WINDGURU_CACHE_MINUTES',
            60
        ),
    ],

    'open_meteo' => [
        'enabled' => env(
            'OPEN_METEO_ENABLED',
            true
        ),

        'model' => env(
            'OPEN_METEO_MODEL',
            'ecmwf_ifs'
        ),

        'cache_minutes' => env(
            'OPEN_METEO_CACHE_MINUTES',
            60
        ),
    ],

];
