<?php
namespace App\Http\Controllers;use App\Services\Aerodromos\AerodromoQueryService;use Illuminate\Http\Request;use Inertia\Inertia;use Inertia\Response;
class MapController extends Controller { public function __invoke(Request $r,AerodromoQueryService $s):Response{$f=$r->only(['q','provincia','tipo']);return Inertia::render('Map',['points'=>$s->map($f),'filters'=>$f,'tileUrl'=>config('aeroinfo.map.tile_url'),'attribution'=>config('aeroinfo.map.attribution')]);}}
