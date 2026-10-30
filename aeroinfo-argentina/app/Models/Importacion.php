<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Importacion extends Model
{
    protected $table = 'importaciones';

    protected $guarded = [];

    protected $casts = [
        'inicio' => 'datetime',
        'fin' => 'datetime',
        'resumen' => 'array',
    ];
}