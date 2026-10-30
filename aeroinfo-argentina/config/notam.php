<?php

return [
    'enabled' =>
        env(
            'NOTAM_ENABLED',
            true
        ),

    'cache_minutes' =>
        env(
            'NOTAM_CACHE_MINUTES',
            5
        ),
];
