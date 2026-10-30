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

        'username' => env('WINDGURU_USERNAME'),
        'secondary_password' => env(
            'WINDGURU_SECONDARY_PASSWORD'
        ),

        'model' => env('WINDGURU_MODEL', 'swrfar'),

        'cache_minutes' => env(
            'WINDGURU_CACHE_MINUTES',
            60
        ),
    ],

];
