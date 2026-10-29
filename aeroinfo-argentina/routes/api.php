<?php
use App\Http\Controllers\Api\V1\AerodromoApiController;
use Illuminate\Support\Facades\Route;
Route::prefix('v1')->middleware('throttle:api')->group(function () {
    Route::get('/aerodromos', [AerodromoApiController::class, 'index']);
    Route::get('/aerodromos/{aerodromo}', [AerodromoApiController::class, 'show']);
    Route::get('/aerodromos/{aerodromo}/fuentes', [AerodromoApiController::class, 'sources']);
    Route::get('/mapa/aerodromos', [AerodromoApiController::class, 'map']);
});
