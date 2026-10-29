<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class Pista extends Model {
 protected $fillable=['aerodromo_id','designacion','superficie','largo_m','ancho_m','orientacion','estado_validacion','source_record_json'];
 protected $casts=['largo_m'=>'float','ancho_m'=>'float','source_record_json'=>'array'];
 public function aerodromo(): BelongsTo { return $this->belongsTo(Aerodromo::class); }
}
