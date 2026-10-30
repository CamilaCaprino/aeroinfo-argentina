<?php

namespace App\Services\Notam;

use App\Models\Aerodromo;

class AerodromoNotamService
{
    public function __construct(
        private NotamService $notamService,
    ) {
    }

    public function forAerodromo(
        Aerodromo $aerodromo
    ): array {
        $indicator = strtoupper(
            trim(
                (string)
                $aerodromo->designador_local
            )
        );

        if ($indicator === '') {
            return [
                'status' => 'no_indicator',
                'indicator' => null,
                'count' => 0,
                'data' => [],
                'error' => null,
            ];
        }

        return $this->notamService->current(
            $indicator
        );
    }
}
