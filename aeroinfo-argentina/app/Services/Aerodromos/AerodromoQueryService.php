<?php
namespace App\Services\Aerodromos;
use App\Models\Aerodromo;use Illuminate\Contracts\Pagination\LengthAwarePaginator;use Illuminate\Database\Eloquent\Builder;
class AerodromoQueryService {
 public function query(array $filters): Builder {
  $q=Aerodromo::query();
  if($term=trim((string)($filters['q']??''))){$like='%'.mb_strtolower($term).'%';$q->where(function(Builder $b)use($like){$b->whereRaw('lower(nombre) like ?',[$like])->orWhereRaw('lower(coalesce(designador_oaci,\'\')) like ?',[$like])->orWhereRaw('lower(coalesce(designador_local,\'\')) like ?',[$like])->orWhereRaw('lower(coalesce(designador_iata,\'\')) like ?',[$like]);});}
  if($v=$filters['provincia']??null)$q->where('provincia',$v);
  if($v=$filters['tipo']??null)$q->where('tipo',$v);
  $sort=$filters['sort']??'nombre';$dir=$filters['direction']??'asc';
  return $q->orderBy($sort,$dir)->orderBy('id');
 }
 public function paginate(array $filters):LengthAwarePaginator{return $this->query($filters)->paginate((int)($filters['per_page']??config('aeroinfo.pagination.per_page',20)))->withQueryString();}
 public function map(array $filters){return $this->query($filters)->whereNotNull('latitud')->whereNotNull('longitud')->limit(2000)->get(['id','slug','nombre','designador_oaci','designador_local','tipo','provincia','latitud','longitud']);}
}
