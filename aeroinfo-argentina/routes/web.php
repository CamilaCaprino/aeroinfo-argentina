<?php
use App\Http\Controllers\AerodromoController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\SourceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BriefingController;
Route::get('/', HomeController::class)->name('home');
Route::get('/aerodromos', [AerodromoController::class, 'index'])->name('aerodromos.index');
Route::get('/aerodromos/{aerodromo:slug}', [AerodromoController::class, 'show'])->name('aerodromos.show');
Route::get('/mapa', MapController::class)->name('mapa');
Route::get('/fuentes', SourceController::class)->name('fuentes');
Route::get('/meteorologia', function () {
    return Inertia::render('Meteorologia');
})->name('meteorologia');
Route::get(
    '/briefing',
    [BriefingController::class, 'index']
)->name('briefing');
