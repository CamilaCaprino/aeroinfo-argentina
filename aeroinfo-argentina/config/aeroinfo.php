<?php
return [
    'map' => ['tile_url' => env('AEROINFO_MAP_TILE_URL'), 'attribution' => env('AEROINFO_MAP_ATTRIBUTION')],
    'sources' => [
        'dataset' => ['name' => 'Aeródromos y helipuertos - ANAC septiembre 2026', 'url' => env('AEROINFO_SOURCE_DATASET_URL'), 'label' => env('AEROINFO_SOURCE_LABEL')],
        'aip' => ['name' => 'Publicación de Información Aeronáutica (AIP) - ANAC', 'url' => env('AEROINFO_SOURCE_AIP_URL')],
    ],
    'pagination' => ['per_page' => 20, 'max_per_page' => 100],
];
