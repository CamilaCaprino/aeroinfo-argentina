<?php

namespace App\Services\Importaciones;

use App\Models\Aerodromo;
use App\Models\FuenteDato;
use App\Models\Importacion;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class AnacGeoJsonImporter
{
    public function import(string $path): Importacion
    {
        if (! is_file($path)) {
            throw new RuntimeException(
                "No existe el archivo: {$path}"
            );
        }

        $data = json_decode(
            file_get_contents($path),
            true,
            512,
            JSON_THROW_ON_ERROR
        );

        if (($data['type'] ?? null) !== 'FeatureCollection') {
            throw new RuntimeException(
                'Se esperaba GeoJSON FeatureCollection.'
            );
        }

        $features = $data['features'] ?? [];
        $total = count($features);

        echo "Archivo leído correctamente." . PHP_EOL;
        echo "Registros a procesar: {$total}" . PHP_EOL;

        /*
         * Nos aseguramos de arrancar con una conexión PostgreSQL
         * limpia. Esto es especialmente importante usando Neon
         * y conexiones pooled.
         */
        DB::disconnect();
        DB::reconnect();

        $fuente = FuenteDato::firstOrCreate(
            [
                'url_referencia' => config(
                    'aeroinfo.sources.dataset.url'
                ),
            ],
            [
                'nombre' => config(
                    'aeroinfo.sources.dataset.name'
                ),
                'organismo' =>
                    'ANAC / Secretaría de Transporte',
                'tipo_recurso' =>
                    'SHP normalizado a GeoJSON',
                'condiciones_acceso' =>
                    'Dataset público; verificar licencia vigente en la fuente.',
                'frecuencia_actualizacion' =>
                    'Eventual',
                'fecha_ultima_consulta' =>
                    now()->toDateString(),
                'estado' =>
                    'activa',
            ]
        );

        echo "Fuente de datos: {$fuente->id}" . PHP_EOL;

        $run = Importacion::create([
            'fuente_dato_id' => $fuente->id,
            'inicio' => now(),
            'resultado' => 'en_proceso',
        ]);

        echo "Importación creada: {$run->id}" . PHP_EOL;

        $stats = [
            'read' => 0,
            'created' => 0,
            'updated' => 0,
            'errors' => 0,
            'review' => 0,
        ];

        /*
         * IMPORTANTE:
         *
         * No usamos una única transacción para los 588 registros.
         *
         * En PostgreSQL, si una sentencia falla dentro de una
         * transacción, toda la transacción queda abortada hasta
         * realizar ROLLBACK.
         *
         * Como queremos poder registrar errores individuales y
         * continuar, procesamos cada registro directamente.
         */
        foreach ($features as $feature) {
            $stats['read']++;

            $nombre = 'SIN NOMBRE';

            if (
                $stats['read'] === 1
                || $stats['read'] % 50 === 0
                || $stats['read'] === $total
            ) {
                echo
                    "Procesando {$stats['read']} / {$total}"
                    . PHP_EOL;
            }

            try {
                $properties = $feature['properties'] ?? [];

                $nombre = trim(
                    (string) (
                        $properties['nombre']
                        ?? ''
                    )
                );

                if ($nombre === '') {
                    throw new RuntimeException(
                        'Registro sin nombre normalizado'
                    );
                }

                /*
                 * Coordenadas GeoJSON:
                 *
                 * [longitud, latitud]
                 */
                $coords =
                    $feature['geometry']['coordinates']
                    ?? [null, null];

                $lon = is_numeric(
                    $coords[0] ?? null
                )
                    ? (float) $coords[0]
                    : null;

                $lat = is_numeric(
                    $coords[1] ?? null
                )
                    ? (float) $coords[1]
                    : null;

                if (
                    $lat !== null
                    && ($lat < -90 || $lat > 90)
                ) {
                    throw new RuntimeException(
                        'Latitud fuera de rango'
                    );
                }

                if (
                    $lon !== null
                    && ($lon < -180 || $lon > 180)
                ) {
                    throw new RuntimeException(
                        'Longitud fuera de rango'
                    );
                }

                /*
                 * Identificador estable del registro.
                 */
                $identity =
                    $properties['source_id']
                    ?? $properties['designador_oaci']
                    ?? $properties['designador_local']
                    ?? sha1(
                        $nombre
                        . '|'
                        . (
                            $properties['provincia']
                            ?? ''
                        )
                        . '|'
                        . $lat
                        . '|'
                        . $lon
                    );

                /*
                 * Slug estable.
                 */
                $slug = Str::slug(
                    (
                        $properties['designador_oaci']
                        ?? $properties['designador_local']
                        ?? $nombre
                    )
                    . '-'
                    . substr(
                        sha1((string) $identity),
                        0,
                        7
                    )
                );

                /*
                 * Buscamos primero por source_id original
                 * conservado dentro del JSON.
                 */
                $aerodromo = Aerodromo::where(
                    'source_record_json->source_id',
                    (string) $identity
                )->first();

                $values = [
                    'slug' => $slug,
                    'nombre' => $nombre,

                    'designador_local' =>
                        $properties['designador_local']
                        ?? null,

                    'designador_oaci' =>
                        $properties['designador_oaci']
                        ?? null,

                    'designador_iata' =>
                        $properties['designador_iata']
                        ?? null,

                    'tipo' =>
                        $properties['tipo']
                        ?? null,

                    'localidad' =>
                        $properties['localidad']
                        ?? null,

                    'provincia' =>
                        $properties['provincia']
                        ?? null,

                    'elevacion_m' =>
                        $properties['elevacion_m']
                        ?? null,

                    'latitud' => $lat,
                    'longitud' => $lon,

                    'uso' =>
                        $properties['uso']
                        ?? null,

                    'estado_validacion' =>
                        'pendiente',

                    'source_record_json' =>
                        $properties,
                ];

                /*
                 * UPDATE
                 */
                if ($aerodromo) {
                    /*
                     * En registros existentes evitamos borrar
                     * información útil si el nuevo dataset trae
                     * null o cadena vacía.
                     */
                    $safeValues = array_filter(
                        $values,
                        fn ($value) =>
                            $value !== null
                            && $value !== ''
                    );

                    $aerodromo->fill(
                        $safeValues
                    );

                    $aerodromo->save();

                    $stats['updated']++;
                }

                /*
                 * CREATE
                 */
                else {
                    $aerodromo = Aerodromo::create(
                        $values
                    );

                    $stats['created']++;
                }

                /*
                 * Referencia a la fuente.
                 */
                $aerodromo
                    ->referencias()
                    ->updateOrCreate(
                        [
                            'fuente_dato_id' =>
                                $fuente->id,

                            'documento' =>
                                config(
                                    'aeroinfo.sources.dataset.label'
                                ),
                        ],
                        [
                            'url' =>
                                config(
                                    'aeroinfo.sources.dataset.url'
                                ),

                            'fecha_consulta' =>
                                now(),

                            'fecha_importacion' =>
                                now(),

                            'estado_validacion' =>
                                'pendiente',

                            'metadatos' => [
                                'source_id' =>
                                    $identity,
                            ],
                        ]
                    );

                /*
                 * PostGIS.
                 *
                 * aerodromos.ubicacion es geography,
                 * por eso hacemos ::geography.
                 */
                if (
                    $lat !== null
                    && $lon !== null
                ) {
                    DB::statement(
                        '
                            UPDATE aerodromos
                            SET ubicacion =
                                ST_SetSRID(
                                    ST_MakePoint(?, ?),
                                    4326
                                )::geography
                            WHERE id = ?
                        ',
                        [
                            $lon,
                            $lat,
                            $aerodromo->id,
                        ]
                    );
                } else {
                    $stats['review']++;
                }
            } catch (\Throwable $e) {
                $stats['errors']++;

                echo PHP_EOL;
                echo
                    "ERROR en registro "
                    . $stats['read']
                    . " ({$nombre}): "
                    . $e->getMessage()
                    . PHP_EOL;

                /*
                 * PostgreSQL puede dejar una conexión en estado
                 * abortado luego de una sentencia fallida.
                 *
                 * Eliminamos la conexión y pedimos una nueva
                 * antes de continuar con el registro siguiente.
                 */
                DB::disconnect();
                DB::reconnect();
            }
        }

        echo PHP_EOL;
        echo "Procesamiento completo." . PHP_EOL;

        /*
         * Actualizamos el registro de importación usando una
         * conexión limpia.
         */
        DB::disconnect();
        DB::reconnect();

        $run = Importacion::findOrFail(
            $run->id
        );

        $run->update([
            'fin' => now(),

            'resultado' =>
                $stats['errors']
                    ? 'completado_con_errores'
                    : 'completado',

            'registros_leidos' =>
                $stats['read'],

            'registros_creados' =>
                $stats['created'],

            'registros_actualizados' =>
                $stats['updated'],

            'errores' =>
                $stats['errors'],

            'pendientes_revision' =>
                $stats['review'],

            'resumen' =>
                $stats,
        ]);

        echo PHP_EOL;
        echo "Resumen:" . PHP_EOL;

        echo
            "  Leídos: "
            . $stats['read']
            . PHP_EOL;

        echo
            "  Creados: "
            . $stats['created']
            . PHP_EOL;

        echo
            "  Actualizados: "
            . $stats['updated']
            . PHP_EOL;

        echo
            "  Errores: "
            . $stats['errors']
            . PHP_EOL;

        echo
            "  Revisión: "
            . $stats['review']
            . PHP_EOL;

        return $run;
    }
}