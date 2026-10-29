<?php
namespace App\Console\Commands;use App\Services\Importaciones\AnacGeoJsonImporter;use Illuminate\Console\Command;
class ImportAnacAerodromos extends Command { protected $signature='aeroinfo:import-anac {path : GeoJSON normalizado generado por tools/inspect_anac_shapefile.py}'; protected $description='Importa idempotentemente el inventario ANAC/Transporte septiembre 2026'; public function handle(AnacGeoJsonImporter $i):int{$run=$i->import($this->argument('path'));$this->info(json_encode($run->resumen,JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));return self::SUCCESS;}}
