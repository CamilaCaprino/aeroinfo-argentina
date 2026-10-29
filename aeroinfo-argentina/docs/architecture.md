# Arquitectura

Laravel + Inertia mantiene backend y React en una sola aplicación. Las búsquedas y filtros se ejecutan en PostgreSQL. PostGIS almacena `ubicacion geography(Point,4326)` e índice GIST. Los datos del SHP pasan por una etapa explícita de inspección/normalización en Python para evitar acoplar el importador a encabezados no verificados. La API v1 reutiliza el mismo servicio de consultas que las páginas Inertia.
