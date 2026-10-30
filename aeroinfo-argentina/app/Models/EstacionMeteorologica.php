<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EstacionMeteorologica extends Model
{
    protected $table = 'estaciones_meteorologicas';

    protected $guarded = [];

    protected $casts = [
        'latitud' => 'float',
        'longitud' => 'float',
        'altura_m' => 'float',
        'activa' => 'boolean',
    ];
}
