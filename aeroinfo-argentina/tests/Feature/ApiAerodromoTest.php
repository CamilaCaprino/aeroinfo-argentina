<?php
namespace Tests\Feature;use App\Models\Aerodromo;use Illuminate\Foundation\Testing\RefreshDatabase;use Tests\TestCase;class ApiAerodromoTest extends TestCase{use RefreshDatabase;public function test_api_pagina_resultados():void{Aerodromo::create(['slug'=>'uno','nombre'=>'Uno']);$this->getJson('/api/v1/aerodromos')->assertOk()->assertJsonPath('total',1);}}
