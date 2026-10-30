import { Head, Link } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMap,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { useEffect, useMemo, useState } from 'react';

const ARGENTINA_CENTER: [number, number] = [-38.4, -64.2];

const aerodromoIcon = L.divIcon({
    className: '',
    html: `
        <div style="
            width:12px;
            height:12px;
            background:#2563eb;
            border:2px solid white;
            border-radius:9999px;
            box-shadow:
                0 0 0 4px rgba(37,99,235,.16),
                0 4px 12px rgba(0,0,0,.35);
        "></div>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
});

const helipuertoIcon = L.divIcon({
    className: '',
    html: `
        <div style="
            width:12px;
            height:12px;
            background:#14b8a6;
            border:2px solid white;
            border-radius:3px;
            transform:rotate(45deg);
            box-shadow:
                0 0 0 4px rgba(20,184,166,.14),
                0 4px 12px rgba(0,0,0,.35);
        "></div>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
});

const selectedIcon = L.divIcon({
    className: '',
    html: `
        <div style="
            width:18px;
            height:18px;
            background:#f59e0b;
            border:3px solid white;
            border-radius:9999px;
            box-shadow:
                0 0 0 6px rgba(245,158,11,.22),
                0 5px 18px rgba(0,0,0,.45);
        "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
});

function createClusterIcon(cluster: any) {
    const count = cluster.getChildCount();

    let size = 40;

    if (count >= 100) {
        size = 52;
    } else if (count >= 30) {
        size = 46;
    }

    return L.divIcon({
        html: `
            <div style="
                width:${size}px;
                height:${size}px;
                border-radius:9999px;
                display:flex;
                align-items:center;
                justify-content:center;
                background:rgba(8,32,60,.92);
                border:2px solid rgba(255,255,255,.92);
                color:white;
                font-size:12px;
                font-weight:700;
                box-shadow:
                    0 0 0 5px rgba(37,99,235,.18),
                    0 6px 20px rgba(0,0,0,.32);
                backdrop-filter:blur(8px);
            ">
                ${count}
            </div>
        `,
        className: '',
        iconSize: L.point(size, size, true),
    });
}

function FitFilteredPoints({
    points,
    active,
}: {
    points: any[];
    active: boolean;
}) {
    const map = useMap();

    useEffect(() => {
        if (!active || !points.length) {
            return;
        }

        if (points.length === 1) {
            map.flyTo(
                [
                    Number(points[0].latitud),
                    Number(points[0].longitud),
                ],
                11,
                {
                    duration: 0.7,
                }
            );

            return;
        }

        const bounds = L.latLngBounds(
            points.map((point: any) => [
                Number(point.latitud),
                Number(point.longitud),
            ])
        );

        map.fitBounds(bounds, {
            padding: [60, 60],
            maxZoom: 10,
        });
    }, [points, active, map]);

    return null;
}

function InitialLocation({
    lat,
    lon,
    zoom,
}: {
    lat: number | null;
    lon: number | null;
    zoom: number;
}) {
    const map = useMap();

    useEffect(() => {
        if (lat === null || lon === null) {
            return;
        }

        map.setView([lat, lon], zoom, {
            animate: true,
        });
    }, [lat, lon, zoom, map]);

    return null;
}

export default function MapPage({
    points = [],
    tileUrl,
    attribution,
}: any) {
    const [tipo, setTipo] = useState('');
    const [provincia, setProvincia] = useState('');

    const query = new URLSearchParams(
        typeof window !== 'undefined'
            ? window.location.search
            : ''
    );

    const queryLat = query.get('lat');
    const queryLon = query.get('lon');
    const queryZoom = query.get('zoom');
    const selectedSlug = query.get('selected');

    const initialLat =
        queryLat !== null && !Number.isNaN(Number(queryLat))
            ? Number(queryLat)
            : null;

    const initialLon =
        queryLon !== null && !Number.isNaN(Number(queryLon))
            ? Number(queryLon)
            : null;

    const initialZoom =
        queryZoom !== null && !Number.isNaN(Number(queryZoom))
            ? Number(queryZoom)
            : 11;

    const openedFromAerodromo =
        initialLat !== null &&
        initialLon !== null;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const provincias = useMemo(() => {
        return Array.from(
            new Set(
                points
                    .map((point: any) => point.provincia)
                    .filter(Boolean)
            )
        ).sort((a: any, b: any) =>
            String(a).localeCompare(String(b), 'es')
        );
    }, [points]);

    const filteredPoints = useMemo(() => {
        return points.filter((point: any) => {
            const pointTipo = String(point.tipo || '').toLowerCase();

            const matchesTipo =
                !tipo ||
                pointTipo === tipo.toLowerCase();

            const matchesProvincia =
                !provincia ||
                point.provincia === provincia;

            return matchesTipo && matchesProvincia;
        });
    }, [points, tipo, provincia]);

    const totalAerodromos = points.filter((point: any) => {
        const value = String(point.tipo || '').toLowerCase();

        return value === 'aeródromo' || value === 'aerodromo';
    }).length;

    const totalHelipuertos = points.filter(
        (point: any) =>
            String(point.tipo || '').toLowerCase() === 'helipuerto'
    ).length;

    const filtersActive = Boolean(tipo || provincia);

    return (
        <AppLayout>
            <Head title="Mapa nacional" />

            <div className="mx-auto max-w-[86rem] px-5 pb-10 pt-10 sm:px-6 md:pt-12 lg:px-8">
                <header>
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                                Inventario georreferenciado
                            </div>

                            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                                Mapa nacional
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted md:text-base">
                                Explorá aeródromos y helipuertos registrados
                                en la base mediante su ubicación geográfica.
                            </p>
                        </div>

                        <Link
                            href="/aerodromos"
                            className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium transition hover:bg-background"
                        >
                            Ver listado completo
                        </Link>
                    </div>
                </header>

                <div className="mt-7 grid gap-3 md:grid-cols-3">
                    <Stat
                        label="Instalaciones"
                        value={points.length}
                    />

                    <Stat
                        label="Aeródromos"
                        value={totalAerodromos}
                    />

                    <Stat
                        label="Helipuertos"
                        value={totalHelipuertos}
                    />
                </div>

                <section className="mt-5 rounded-2xl border border-border bg-surface p-4 shadow-sm">
                    <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                        <select
                            value={tipo}
                            onChange={(event) =>
                                setTipo(event.target.value)
                            }
                            className="rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary"
                        >
                            <option value="">
                                Todas las instalaciones
                            </option>

                            <option value="Aeródromo">
                                Aeródromos
                            </option>

                            <option value="Helipuerto">
                                Helipuertos
                            </option>
                        </select>

                        <select
                            value={provincia}
                            onChange={(event) =>
                                setProvincia(event.target.value)
                            }
                            className="rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary"
                        >
                            <option value="">
                                Todas las provincias
                            </option>

                            {provincias.map((item: any) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            disabled={!filtersActive}
                            onClick={() => {
                                setTipo('');
                                setProvincia('');
                            }}
                            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-surface disabled:cursor-default disabled:opacity-40"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </section>

                <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-border px-4 py-3 md:flex-row md:items-center md:justify-between md:px-5">
                        <div>
                            <div className="text-sm font-medium">
                                República Argentina
                            </div>

                            <div className="mt-0.5 text-xs text-muted">
                                {filteredPoints.length}{' '}
                                {filteredPoints.length === 1
                                    ? 'instalación visible'
                                    : 'instalaciones visibles'}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                            <Legend
                                shape="circle"
                                label="Aeródromo"
                            />

                            <Legend
                                shape="diamond"
                                label="Helipuerto"
                            />

                            <div className="hidden h-4 w-px bg-border sm:block" />

                            <div className="flex items-center gap-2">
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-800 px-1 text-[9px] font-bold text-white">
                                    12
                                </span>
                                <span>Agrupación</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative h-[72vh] min-h-[560px]">
                        <MapContainer
                            center={
                                openedFromAerodromo
                                    ? [
                                          initialLat as number,
                                          initialLon as number,
                                      ]
                                    : ARGENTINA_CENTER
                            }
                            zoom={
                                openedFromAerodromo
                                    ? initialZoom
                                    : 4
                            }
                            minZoom={3}
                            maxZoom={18}
                            scrollWheelZoom
                            className="h-full w-full"
                        >
                            <TileLayer
                                url={
                                    tileUrl ||
                                    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                                }
                                attribution={
                                    attribution ||
                                    '&copy; OpenStreetMap contributors'
                                }
                            />

                            {openedFromAerodromo && (
                                <InitialLocation
                                    lat={initialLat}
                                    lon={initialLon}
                                    zoom={initialZoom}
                                />
                            )}

                            <FitFilteredPoints
                                points={filteredPoints}
                                active={
                                    filtersActive &&
                                    !openedFromAerodromo
                                }
                            />

                            <MarkerClusterGroup
                                chunkedLoading
                                maxClusterRadius={48}
                                disableClusteringAtZoom={11}
                                spiderfyOnMaxZoom
                                showCoverageOnHover={false}
                                iconCreateFunction={createClusterIcon}
                            >
                                {filteredPoints.map((point: any) => {
                                    const isHelipuerto =
                                        String(
                                            point.tipo || ''
                                        ).toLowerCase() === 'helipuerto';

                                    const isSelected =
                                        selectedSlug &&
                                        point.slug === selectedSlug;

                                    const icon = isSelected
                                        ? selectedIcon
                                        : isHelipuerto
                                            ? helipuertoIcon
                                            : aerodromoIcon;

                                    return (
                                        <Marker
                                            key={point.id}
                                            position={[
                                                Number(point.latitud),
                                                Number(point.longitud),
                                            ]}
                                            icon={icon}
                                        >
                                            <Popup>
                                                <div className="min-w-[215px]">
                                                    <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                                                        {point.tipo ||
                                                            'Instalación'}
                                                    </div>

                                                    <div className="mt-1 text-base font-semibold leading-snug text-slate-900">
                                                        {point.nombre}
                                                    </div>

                                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                                        {point.designador_oaci && (
                                                            <CodeBadge>
                                                                OACI{' '}
                                                                {
                                                                    point.designador_oaci
                                                                }
                                                            </CodeBadge>
                                                        )}

                                                        {point.designador_iata && (
                                                            <CodeBadge>
                                                                IATA{' '}
                                                                {
                                                                    point.designador_iata
                                                                }
                                                            </CodeBadge>
                                                        )}

                                                        {point.designador_local && (
                                                            <CodeBadge>
                                                                Local{' '}
                                                                {
                                                                    point.designador_local
                                                                }
                                                            </CodeBadge>
                                                        )}
                                                    </div>

                                                    {point.provincia && (
                                                        <div className="mt-3 text-xs text-slate-500">
                                                            {
                                                                point.provincia
                                                            }
                                                        </div>
                                                    )}

                                                    <Link
                                                        href={`/aerodromos/${point.slug}`}
                                                        className="mt-3 inline-flex text-sm font-medium text-blue-600 hover:underline"
                                                    >
                                                        Ver ficha completa →
                                                    </Link>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    );
                                })}
                            </MarkerClusterGroup>
                        </MapContainer>

                        <div className="pointer-events-none absolute bottom-5 left-5 z-[500] hidden rounded-xl border border-white/15 bg-slate-950/85 px-4 py-3 text-white shadow-xl backdrop-blur-md md:block">
                            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-300">
                                Vista actual
                            </div>

                            <div className="mt-1 text-xl font-semibold">
                                {filteredPoints.length}
                            </div>

                            <div className="text-xs text-slate-300">
                                registros
                            </div>
                        </div>
                    </div>
                </div>

                {filteredPoints.length === 0 && (
                    <div className="mt-5 rounded-xl border border-border bg-surface p-5 text-sm text-muted">
                        No hay instalaciones que coincidan con los filtros
                        seleccionados.
                    </div>
                )}

                <div className="mt-5 flex flex-col gap-2 text-xs leading-5 text-muted md:flex-row md:items-center md:justify-between">
                    <span>
                        Datos: ANAC / Secretaría de Transporte · Septiembre 2026
                    </span>

                    <span>
                        La representación cartográfica es orientativa.
                    </span>
                </div>
            </div>
        </AppLayout>
    );
}

function Stat({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <div className="text-xs uppercase tracking-[0.12em] text-muted">
                {label}
            </div>

            <div className="mt-1 text-2xl font-semibold">
                {value}
            </div>
        </div>
    );
}

function Legend({
    shape,
    label,
}: {
    shape: 'circle' | 'diamond';
    label: string;
}) {
    return (
        <div className="flex items-center gap-2">
            <span
                className={[
                    'inline-block h-2.5 w-2.5',
                    shape === 'circle'
                        ? 'rounded-full bg-blue-600'
                        : 'rotate-45 rounded-[2px] bg-teal-500',
                ].join(' ')}
            />

            <span>{label}</span>
        </div>
    );
}

function CodeBadge({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-700">
            {children}
        </span>
    );
}