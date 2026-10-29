<?php
namespace App\Http\Controllers;use App\Http\Requests\AerodromoIndexRequest;use App\Models\Aerodromo;use App\Services\Aerodromos\AerodromoQueryService;use Inertia\Inertia;use Inertia\Response;
class AerodromoController extends Controller {
 public function index(AerodromoIndexRequest $r,AerodromoQueryService $s):Response{$filters=$r->validated();return Inertia::render('Aerodromos/Index',['aerodromos'=>$s->paginate($filters),'filters'=>$filters,'provincias'=>Aerodromo::whereNotNull('provincia')->distinct()->orderBy('provincia')->pluck('provincia'),'tipos'=>Aerodromo::whereNotNull('tipo')->distinct()->orderBy('tipo')->pluck('tipo')]);}
 public function show(Aerodromo $aerodromo):Response{return Inertia::render('Aerodromos/Show',['aerodromo'=>$aerodromo->load(['referencias.fuente','pistas'])]);}
}
