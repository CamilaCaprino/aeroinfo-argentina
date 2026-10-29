# Despliegue

## Arquitectura recomendada
Nginx -> PHP-FPM 8.3+ -> Laravel 13 -> PostgreSQL/PostGIS. Vite se compila en CI/servidor de build.

## Checklist
1. Crear DB y `CREATE EXTENSION postgis` (la migración también lo intenta).
2. Configurar `.env` de producción fuera del repositorio.
3. `composer install --no-dev --optimize-autoloader`.
4. `npm ci && npm run build`.
5. `php artisan migrate --force`.
6. `php artisan config:cache && php artisan route:cache && php artisan view:cache`.
7. Servir exclusivamente `public/`.
8. HTTPS, `APP_DEBUG=false`, cookies seguras, logs y rate limiting.
9. Importar el archivo ANAC validado.
10. Smoke test: `/up`, `/`, `/aerodromos`, `/mapa`, `/api/v1/aerodromos`.

## Backup
`pg_dump -Fc aeroinfo > aeroinfo-$(date +%F).dump`

## Rollback
Mantener release anterior, backup previo a migraciones y aplicar rollback solo si la migración lo admite sin pérdida de datos. Para cambios destructivos, restaurar backup en instancia separada y promover luego de verificar.
