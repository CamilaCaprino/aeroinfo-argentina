<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class FuenteDato extends Model {
 protected $table='fuentes_datos';
 protected $fillable=['nombre','organismo','url_referencia','tipo_recurso','condiciones_acceso','frecuencia_actualizacion','fecha_ultima_consulta','estado'];
 protected $casts=['fecha_ultima_consulta'=>'date'];
 public function referencias(): HasMany { return $this->hasMany(ReferenciaAerodromo::class,'fuente_dato_id'); }
}
