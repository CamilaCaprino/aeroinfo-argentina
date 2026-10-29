<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Aerodromo extends Model {
    use HasFactory;
    protected $fillable=['slug','nombre','designador_local','designador_oaci','designador_iata','tipo','localidad','provincia','elevacion_m','latitud','longitud','uso','estado_validacion','source_record_json'];
    protected $casts=['elevacion_m'=>'float','latitud'=>'float','longitud'=>'float','source_record_json'=>'array'];
    public function referencias(): HasMany { return $this->hasMany(ReferenciaAerodromo::class); }
    public function pistas(): HasMany { return $this->hasMany(Pista::class); }
}
