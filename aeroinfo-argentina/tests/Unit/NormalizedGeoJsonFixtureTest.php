<?php
namespace Tests\Unit;use PHPUnit\Framework\TestCase;class NormalizedGeoJsonFixtureTest extends TestCase{public function test_fixture_is_feature_collection():void{$p=base_path('tests/fixtures/anac-normalized.geojson');$d=json_decode(file_get_contents($p),true);$this->assertSame('FeatureCollection',$d['type']);$this->assertArrayHasKey('features',$d);}}
