<?php
namespace App\Http\Controllers;use App\Models\FuenteDato;use Inertia\Inertia;use Inertia\Response;
class SourceController extends Controller { public function __invoke():Response{return Inertia::render('Sources',['sources'=>FuenteDato::orderBy('nombre')->get(),'configuredSources'=>config('aeroinfo.sources')]);}}
