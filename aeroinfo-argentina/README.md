# Aeroinfo Argentina

MVP público para consultar aeródromos y helipuertos argentinos. **No es un sistema oficial de ANAC y no sustituye AIP, NOTAM, MADHEL ni briefing previo al vuelo.**

## Fuentes priorizadas

1. Inventario inicial: **Aeródromos y helipuertos de la República Argentina — ANAC septiembre 2026**, publicado en Datos Abiertos de la Secretaría de Transporte.
2. Validación/documentación: **AIP Argentina — ANAC**, incluyendo Parte AD y enmiendas aplicables.

La fuente de Transporte figura actualizada el 2/10/2026. La descarga WFS puede estar temporalmente indisponible; por eso el proceso admite un ZIP SHP descargado manualmente y conserva el registro crudo de cada fila.

## Requisitos

- PHP 8.3+
- Composer 2
- Node 20+
- PostgreSQL 15+ con PostGIS 3+
- Python 3 con `pyshp` para inspeccionar el SHP oficial (solo herramienta de importación, no segundo backend)

## Instalación

```bash
cp .env.example .env
composer install
npm install
php artisan key:generate
docker compose up -d db
php artisan migrate --seed
npm run build
php artisan serve
```

## Importación ANAC septiembre 2026

1. Descargar el recurso oficial desde https://datos.transporte.gob.ar/dataset/aerodromos
2. Guardarlo fuera de `public/`, por ejemplo `storage/app/imports/anac-septiembre-2026.zip`.
3. Inspeccionar y normalizar los encabezados reales:

```bash
python tools/inspect_anac_shapefile.py storage/app/imports/anac-septiembre-2026.zip storage/app/imports/anac-septiembre-2026.geojson
```

El script imprime todos los encabezados detectados y el mapeo seleccionado. Si no identifica `nombre`, **se detiene**: no inventa una columna.

4. Importar:

```bash
php artisan aeroinfo:import-anac storage/app/imports/anac-septiembre-2026.geojson
```

La importación conserva propiedades crudas, registra fuente y fechas, evita reemplazar valores existentes con vacíos y actualiza la geometría PostGIS.

## Rutas

- `/` inicio
- `/aerodromos` listado, búsqueda, filtros, paginación
- `/aerodromos/{slug}` ficha y fuentes
- `/mapa` mapa nacional Leaflet
- `/fuentes` transparencia y metodología
- `/api/v1/aerodromos`
- `/api/v1/mapa/aerodromos`

## Tema

Claro / Oscuro / Sistema, persistido en `localStorage` y aplicado antes de hidratar la aplicación para reducir destellos.

## Pruebas

```bash
composer test
npm run typecheck
```

Los fixtures de prueba están identificados como **NO OFICIALES** y nunca deben importarse a producción.

## Producción

Ver `docs/deployment.md`. El document root del servidor debe ser `public/`, `APP_DEBUG=false`, HTTPS obligatorio, backups de PostgreSQL y prueba de humo posterior al despliegue.
