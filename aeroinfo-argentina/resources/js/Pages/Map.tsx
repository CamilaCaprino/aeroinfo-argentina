import { Head, Link } from '@inertiajs/react';
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
import { useTranslation } from 'react-i18next';

import AppLayout from '../Layouts/AppLayout';

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
            padding: [40, 40],
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
    const { t, i18n } = useTranslation();

    const [tipo, setTipo] = useState('');
    const [provincia, setProvincia] = useState('');
    const [filtersOpen, setFiltersOpen] =
        useState(false);

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
        queryLat !== null &&
        !Number.isNaN(Number(queryLat))
            ? Number(queryLat)
            : null;

    const initialLon =
        queryLon !== null &&
        !Number.isNaN(Number(queryLon))
            ? Number(queryLon)
            : null;

    const initialZoom =
        queryZoom !== null &&
        !Number.isNaN(Number(queryZoom))
            ? Number(queryZoom)
            : 11;

    const openedFromAerodromo =
        initialLat !== null &&
        initialLon !== null;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const locale =
        i18n.resolvedLanguage === 'de'
            ? 'de'
            : i18n.resolvedLanguage === 'pt'
              ? 'pt'
              : i18n.resolvedLanguage === 'en'
                ? 'en'
                : 'es';

    const provincias = useMemo(() => {
        return Array.from(
            new Set(
                points
                    .map(
                        (point: any) =>
                            point.provincia
                    )
                    .filter(Boolean)
            )
        ).sort((a: any, b: any) =>
            String(a).localeCompare(
                String(b),
                locale
            )
        );
    }, [points, locale]);

    const filteredPoints = useMemo(() => {
        return points.filter(
            (point: any) => {
                const pointTipo = String(
                    point.tipo || ''
                ).toLowerCase();

                const matchesTipo =
                    !tipo ||
                    pointTipo ===
                        tipo.toLowerCase();

                const matchesProvincia =
                    !provincia ||
                    point.provincia ===
                        provincia;

                return (
                    matchesTipo &&
                    matchesProvincia
                );
            }
        );
    }, [
        points,
        tipo,
        provincia,
    ]);

    const totalAerodromos =
        points.filter((point: any) => {
            const value = String(
                point.tipo || ''
            ).toLowerCase();

            return (
                value === 'aeródromo' ||
                value === 'aerodromo'
            );
        }).length;

    const totalHelipuertos =
        points.filter(
            (point: any) =>
                String(
                    point.tipo || ''
                ).toLowerCase() ===
                'helipuerto'
        ).length;

    const filtersActive =
        Boolean(tipo || provincia);

    function clearFilters() {
        setTipo('');
        setProvincia('');
        setFiltersOpen(false);
    }

    function facilityType(
        value?: string
    ) {
        const normalized = String(
            value || ''
        )
            .toLowerCase()
            .normalize('NFD')
            .replace(
                /[\u0300-\u036f]/g,
                ''
            );

        if (
            normalized === 'aerodromo'
        ) {
            return t(
                'map.aerodrome'
            );
        }

        if (
            normalized ===
            'helipuerto'
        ) {
            return t(
                'map.heliport'
            );
        }

        return (
            value ||
            t(
                'map.facility'
            )
        );
    }

    return (
        <AppLayout>
            <Head
                title={t(
                    'map.pageTitle'
                )}
            />

            <div className="mx-auto max-w-[86rem] px-4 pb-8 pt-7 sm:px-6 md:pb-10 md:pt-12 lg:px-8">
                <header>
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                                {t(
                                    'map.eyebrow'
                                )}
                            </div>

                            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                                {t(
                                    'map.title'
                                )}
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted md:text-base">
                                {t(
                                    'map.description'
                                )}
                            </p>
                        </div>

                        <Link
                            href="/aerodromos"
                            className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium transition hover:bg-background sm:w-fit"
                        >
                            {t(
                                'map.viewList'
                            )}
                        </Link>
                    </div>
                </header>

                <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-3">
                    <Stat
                        label={t(
                            'map.facilities'
                        )}
                        value={
                            points.length
                        }
                    />

                    <Stat
                        label={t(
                            'map.aerodromes'
                        )}
                        value={
                            totalAerodromos
                        }
                    />

                    <Stat
                        label={t(
                            'map.heliports'
                        )}
                        value={
                            totalHelipuertos
                        }
                    />
                </div>

                <section className="mt-5 rounded-2xl border border-border bg-surface p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3 md:hidden">
                        <div>
                            <div className="text-sm font-medium">
                                {t(
                                    'map.filters'
                                )}
                            </div>

                            {filtersActive && (
                                <div className="mt-0.5 text-xs text-primary">
                                    {t(
                                        'map.filtersActive'
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setFiltersOpen(
                                    (
                                        value
                                    ) =>
                                        !value
                                )
                            }
                            className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium"
                        >
                            {filtersOpen
                                ? t(
                                      'map.hideFilters'
                                  )
                                : t(
                                      'map.showFilters'
                                  )}
                        </button>
                    </div>

                    <div
                        className={[
                            'gap-3',
                            filtersOpen
                                ? 'mt-4 grid'
                                : 'hidden',
                            'md:grid md:grid-cols-[1fr_1fr_auto]',
                        ].join(' ')}
                    >
                        <select
                            value={tipo}
                            onChange={(
                                event
                            ) =>
                                setTipo(
                                    event
                                        .target
                                        .value
                                )
                            }
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary"
                        >
                            <option value="">
                                {t(
                                    'map.allFacilities'
                                )}
                            </option>

                            <option value="Aeródromo">
                                {t(
                                    'map.aerodromes'
                                )}
                            </option>

                            <option value="Helipuerto">
                                {t(
                                    'map.heliports'
                                )}
                            </option>
                        </select>

                        <select
                            value={
                                provincia
                            }
                            onChange={(
                                event
                            ) =>
                                setProvincia(
                                    event
                                        .target
                                        .value
                                )
                            }
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary"
                        >
                            <option value="">
                                {t(
                                    'map.allProvinces'
                                )}
                            </option>

                            {provincias.map(
                                (
                                    item: any
                                ) => (
                                    <option
                                        key={
                                            item
                                        }
                                        value={
                                            item
                                        }
                                    >
                                        {
                                            item
                                        }
                                    </option>
                                )
                            )}
                        </select>

                        <button
                            type="button"
                            disabled={
                                !filtersActive
                            }
                            onClick={
                                clearFilters
                            }
                            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-surface disabled:cursor-default disabled:opacity-40"
                        >
                            {t(
                                'map.clearFilters'
                            )}
                        </button>
                    </div>
                </section>

                <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="text-sm font-medium">
                                {t(
                                    'map.argentina'
                                )}
                            </div>

                            <div className="mt-0.5 text-xs text-muted">
                                {t(
                                    'map.visibleCount',
                                    {
                                        count:
                                            filteredPoints.length,
                                    }
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
                            <Legend
                                shape="circle"
                                label={t(
                                    'map.aerodrome'
                                )}
                            />

                            <Legend
                                shape="diamond"
                                label={t(
                                    'map.heliport'
                                )}
                            />

                            <div className="hidden h-4 w-px bg-border sm:block" />

                            <div className="flex items-center gap-2">
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-800 px-1 text-[9px] font-bold text-white">
                                    12
                                </span>

                                <span>
                                    {t(
                                        'map.cluster'
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative h-[62vh] min-h-[430px] sm:h-[68vh] sm:min-h-[520px] lg:h-[72vh] lg:min-h-[560px]">
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
                                    lat={
                                        initialLat
                                    }
                                    lon={
                                        initialLon
                                    }
                                    zoom={
                                        initialZoom
                                    }
                                />
                            )}

                            <FitFilteredPoints
                                points={
                                    filteredPoints
                                }
                                active={
                                    filtersActive &&
                                    !openedFromAerodromo
                                }
                            />

                            <MarkerClusterGroup
                                chunkedLoading
                                maxClusterRadius={
                                    48
                                }
                                disableClusteringAtZoom={
                                    11
                                }
                                spiderfyOnMaxZoom
                                showCoverageOnHover={
                                    false
                                }
                                iconCreateFunction={
                                    createClusterIcon
                                }
                            >
                                {filteredPoints.map(
                                    (
                                        point: any
                                    ) => {
                                        const isHelipuerto =
                                            String(
                                                point.tipo ||
                                                    ''
                                            ).toLowerCase() ===
                                            'helipuerto';

                                        const isSelected =
                                            selectedSlug &&
                                            point.slug ===
                                                selectedSlug;

                                        const icon =
                                            isSelected
                                                ? selectedIcon
                                                : isHelipuerto
                                                  ? helipuertoIcon
                                                  : aerodromoIcon;

                                        return (
                                            <Marker
                                                key={
                                                    point.id
                                                }
                                                position={[
                                                    Number(
                                                        point.latitud
                                                    ),
                                                    Number(
                                                        point.longitud
                                                    ),
                                                ]}
                                                icon={
                                                    icon
                                                }
                                            >
                                                <Popup>
                                                    <div className="min-w-[205px] max-w-[250px]">
                                                        <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                                                            {facilityType(
                                                                point.tipo
                                                            )}
                                                        </div>

                                                        <div className="mt-1 text-base font-semibold leading-snug text-slate-900">
                                                            {
                                                                point.nombre
                                                            }
                                                        </div>

                                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                                            {point.designador_oaci && (
                                                                <CodeBadge>
                                                                    ICAO{' '}
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
                                                                    {
                                                                        t(
                                                                            'map.localCodeShort'
                                                                        )
                                                                    }{' '}
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
                                                            {t(
                                                                'map.viewFullDetails'
                                                            )}{' '}
                                                            →
                                                        </Link>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        );
                                    }
                                )}
                            </MarkerClusterGroup>
                        </MapContainer>

                        <div className="pointer-events-none absolute bottom-5 left-5 z-[500] hidden rounded-xl border border-white/15 bg-slate-950/85 px-4 py-3 text-white shadow-xl backdrop-blur-md md:block">
                            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-300">
                                {t(
                                    'map.currentView'
                                )}
                            </div>

                            <div className="mt-1 text-xl font-semibold">
                                {
                                    filteredPoints.length
                                }
                            </div>

                            <div className="text-xs text-slate-300">
                                {t(
                                    'map.records'
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {filteredPoints.length ===
                    0 && (
                    <div className="mt-5 rounded-xl border border-border bg-surface p-5 text-sm text-muted">
                        {t(
                            'map.noMatches'
                        )}
                    </div>
                )}

                <div className="mt-5 flex flex-col gap-2 text-xs leading-5 text-muted md:flex-row md:items-center md:justify-between">
                    <span>
                        {t(
                            'map.dataSource'
                        )}
                    </span>

                    <span>
                        {t(
                            'map.mapDisclaimer'
                        )}
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
        <div className="min-w-0 rounded-xl border border-border bg-surface px-3 py-3 sm:px-4">
            <div className="truncate text-[9px] uppercase tracking-[0.08em] text-muted sm:text-xs sm:tracking-[0.12em]">
                {label}
            </div>

            <div className="mt-1 text-xl font-semibold sm:text-2xl">
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
                    'inline-block h-2.5 w-2.5 shrink-0',
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