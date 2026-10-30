<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /*
     * Ejecutamos esta migración fuera de una transacción global.
     * Esto evita problemas con DDL/PostGIS sobre PostgreSQL/Neon.
     */
    public $withinTransaction = false;

    public function up(): void
    {
        DB::statement("
            CREATE TABLE estaciones_meteorologicas (
                id bigserial PRIMARY KEY,

                fuente varchar(255) NOT NULL DEFAULT 'SMN',

                nombre varchar(255) NOT NULL,
                provincia varchar(255),

                codigo_oaci varchar(10),
                numero_estacion varchar(30),

                latitud decimal(10,7) NOT NULL,
                longitud decimal(10,7) NOT NULL,

                altura_m decimal(8,2),

                activa boolean NOT NULL DEFAULT true,

                created_at timestamp(0) without time zone,
                updated_at timestamp(0) without time zone,

                CONSTRAINT estaciones_meteorologicas_fuente_numero_unique
                    UNIQUE (fuente, numero_estacion)
            )
        ");

        DB::statement("
            ALTER TABLE estaciones_meteorologicas
            ADD COLUMN ubicacion geometry(Point, 4326)
        ");

        DB::statement("
            CREATE INDEX estaciones_meteorologicas_codigo_oaci_idx
            ON estaciones_meteorologicas (codigo_oaci)
        ");

        DB::statement("
            CREATE INDEX estaciones_meteorologicas_numero_estacion_idx
            ON estaciones_meteorologicas (numero_estacion)
        ");

        DB::statement("
            CREATE INDEX estaciones_meteorologicas_ubicacion_gist
            ON estaciones_meteorologicas
            USING GIST (ubicacion)
        ");
    }

    public function down(): void
    {
        DB::statement(
            'DROP TABLE IF EXISTS estaciones_meteorologicas CASCADE'
        );
    }
};
