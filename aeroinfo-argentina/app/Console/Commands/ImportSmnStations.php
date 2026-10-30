<?php

namespace App\Console\Commands;

use App\Models\EstacionMeteorologica;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ImportSmnStations extends Command
{
    protected $signature = 'aeroinfo:import-smn-stations
                            {path : Archivo JSON normalizado de estaciones SMN}';

    protected $description = 'Importa estaciones meteorológicas del SMN';

    public function handle(): int
    {
        $path = $this->argument('path');

        if (! file_exists($path)) {
            $this->error("No existe el archivo: {$path}");

            return self::FAILURE;
        }

        $data = json_decode(
            file_get_contents($path),
            true
        );

        if (! is_array($data)) {
            $this->error('El archivo no contiene JSON válido.');

            return self::FAILURE;
        }

        /*
         * Forzamos una conexión limpia.
         */
        DB::disconnect();
        DB::reconnect();

        $created = 0;
        $updated = 0;
        $errors = 0;

        foreach ($data as $index => $row) {
            try {
                $lat = isset($row['latitud'])
                    ? (float) $row['latitud']
                    : null;

                $lon = isset($row['longitud'])
                    ? (float) $row['longitud']
                    : null;

                if ($lat === null || $lon === null) {
                    $errors++;

                    $this->warn(
                        'Fila '.($index + 1).': coordenadas faltantes'
                    );

                    continue;
                }

                $station = EstacionMeteorologica::query()
                    ->where('fuente', 'SMN')
                    ->where(
                        'numero_estacion',
                        $row['numero_estacion'] ?? null
                    )
                    ->first();

                $values = [
                    'fuente' => 'SMN',
                    'nombre' => $row['nombre'],
                    'provincia' => $row['provincia'] ?? null,
                    'codigo_oaci' => $row['codigo_oaci'] ?? null,
                    'numero_estacion' =>
                        $row['numero_estacion'] ?? null,
                    'latitud' => $lat,
                    'longitud' => $lon,
                    'altura_m' => $row['altura_m'] ?? null,
                    'activa' => true,
                ];

                if ($station) {
                    $station->update($values);
                    $updated++;
                } else {
                    $station = EstacionMeteorologica::create(
                        $values
                    );

                    $created++;
                }

                DB::statement(
                    '
                    UPDATE estaciones_meteorologicas
                    SET ubicacion = ST_SetSRID(
                        ST_MakePoint(?, ?),
                        4326
                    )
                    WHERE id = ?
                    ',
                    [
                        $lon,
                        $lat,
                        $station->id,
                    ]
                );

                if (
                    ($index + 1) % 20 === 0 ||
                    ($index + 1) === count($data)
                ) {
                    $this->line(
                        'Procesando '.($index + 1).
                        ' / '.count($data)
                    );
                }

            } catch (\Throwable $e) {
                $errors++;

                $this->warn(
                    'Fila '.($index + 1).': '.
                    $e->getMessage()
                );

                /*
                 * Si una consulta deja una conexión en mal estado,
                 * obtenemos una nueva antes de continuar.
                 */
                DB::disconnect();
                DB::reconnect();
            }
        }

        $this->newLine();

        $this->info('Importación SMN finalizada.');

        $this->line(
            json_encode(
                [
                    'read' => count($data),
                    'created' => $created,
                    'updated' => $updated,
                    'errors' => $errors,
                ],
                JSON_PRETTY_PRINT |
                JSON_UNESCAPED_UNICODE
            )
        );

        return $errors === 0
            ? self::SUCCESS
            : self::FAILURE;
    }
}
