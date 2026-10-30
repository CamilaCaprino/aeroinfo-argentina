<?php

use Illuminate\Support\Str;

$databaseUrl = env('DATABASE_URL');

$parsedDatabaseUrl = $databaseUrl
    ? parse_url($databaseUrl)
    : [];

$queryParams = [];

if (! empty($parsedDatabaseUrl['query'])) {
    parse_str($parsedDatabaseUrl['query'], $queryParams);
}

return [

    'default' => env('DB_CONNECTION', 'pgsql'),

    'connections' => [

        'pgsql' => [
            'driver' => 'pgsql',

            // Evitamos que Laravel intente reinterpretar DATABASE_URL
            'url' => null,

            'host' => $parsedDatabaseUrl['host']
                ?? env('DB_HOST', '127.0.0.1'),

            'port' => $parsedDatabaseUrl['port']
                ?? env('DB_PORT', '5432'),

            'database' => isset($parsedDatabaseUrl['path'])
                ? ltrim($parsedDatabaseUrl['path'], '/')
                : env('DB_DATABASE', 'laravel'),

            'username' => isset($parsedDatabaseUrl['user'])
                ? urldecode($parsedDatabaseUrl['user'])
                : env('DB_USERNAME', 'root'),

            'password' => isset($parsedDatabaseUrl['pass'])
                ? urldecode($parsedDatabaseUrl['pass'])
                : env('DB_PASSWORD', ''),

            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'search_path' => 'public',

            'sslmode' => $queryParams['sslmode']
                ?? env('DB_SSLMODE', 'require'),
        ],

    ],

    'migrations' => [
        'table' => 'migrations',
        'update_date_on_publish' => true,
    ],

    'redis' => [
        'client' => env('REDIS_CLIENT', 'phpredis'),

        'options' => [
            'cluster' => env('REDIS_CLUSTER', 'redis'),

            'prefix' => env(
                'REDIS_PREFIX',
                Str::slug(env('APP_NAME', 'laravel'), '_') . '_database_'
            ),
        ],
    ],

];