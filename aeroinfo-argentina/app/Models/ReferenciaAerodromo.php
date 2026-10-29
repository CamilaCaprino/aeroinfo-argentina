<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class ReferenciaAerodromo extends Model {
 protected $table='referencias_aerodromo';
 protected $fillable=['aerodromo_id','fuente_dato_id','documento','url','fecha_publicacion','fecha_vigencia','fecha_consulta','fecha_importacion','estado_validacion','metadatos'];
 protected $casts=['fecha_publicacion'=>'date','fecha_vigencia'=>'date','fecha_consulta'=>'datetime','fecha_importacion'=>'datetime','metadatos'=>'array'];
 public function aerodromo(): BelongsTo { return $this->belongsTo(Aerodromo::class); }
 public function fuente(): BelongsTo { return $this->belongsTo(FuenteDato::class,'fuente_dato_id'); }
}
