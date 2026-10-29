<?php
namespace App\Http\Controllers\Api\V1;use App\Http\Controllers\Controller;use App\Http\Requests\AerodromoIndexRequest;use App\Models\Aerodromo;use App\Services\Aerodromos\AerodromoQueryService;use Illuminate\Http\JsonResponse;
class AerodromoApiController extends Controller {
 public function index(AerodromoIndexRequest $r,AerodromoQueryService $s):JsonResponse{return response()->json($s->paginate($r->validated()));}
 public function show(Aerodromo $aerodromo):JsonResponse{return response()->json($aerodromo->load(['referencias.fuente','pistas']));}
 public function sources(Aerodromo $aerodromo):JsonResponse{return response()->json($aerodromo->referencias()->with('fuente')->get());}
 public function map(AerodromoIndexRequest $r,AerodromoQueryService $s):JsonResponse{return response()->json(['data'=>$s->map($r->validated())]);}
}
