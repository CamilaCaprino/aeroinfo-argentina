<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Importacion extends Model {
 protected $fillable=['fuente_dato_id','inicio','fin','resultado','registros_leidos','registros_creados','registros_actualizados','errores','pendientes_revision','resumen'];
 protected $casts=['inicio'=>'datetime','fin'=>'datetime','resumen'=>'array'];
}
