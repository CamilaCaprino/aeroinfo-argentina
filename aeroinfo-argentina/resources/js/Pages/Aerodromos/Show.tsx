import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';

import AppLayout from '../../Layouts/AppLayout';

const detailMarkerIcon = L.divIcon({
    className: '',
    html: `
        <div style="
            width:14px;
            height:14px;
            background:#2563eb;
            border:3px solid white;
            border-radius:9999px;
            box-shadow:
                0 0 0 5px rgba(37,99,235,.16),
                0 5px 16px rgba(0,0,0,.35);
        "></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
});

type ShowProps = {
    aerodromo: any;
    meteorologia?: any;
};

export default function Show({
    aerodromo: a,
    meteorologia,
}: ShowProps) {
    const primaryCode =
        a.designador_oaci ||
        a.designador_local ||
        a.designador_iata ||
        'SIN CÓDIGO PUBLICADO';

    const coordinatesAvailable =
        a.latitud !== null &&
        a.latitud !== undefined &&
        a.longitud !== null &&
        a.longitud !== undefined;

    return (
        <AppLayout>
            <Head title={a.nombre} />

            <div className="mx-auto max-w-[86rem] px-5 pb-12 pt-10 sm:px-6 md:pt-12 lg:px-8">
                <div className="mb-6">
                    <Link
                        href="/aerodromos"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-foreground"
                    >
                        ← Volver al listado
                    </Link>
                </div>

                <header className="border-b border-border pb-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-sm font-medium">
                                    {primaryCode}
                                </span>

                                {a.tipo && (
                                    <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-muted">
                                        {a.tipo}
                                    </span>
                                )}
                            </div>

                            <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
                                {a.nombre}
                            </h1>

                            <p className="mt-3 text-sm text-muted md:text-base">
                                {[a.localidad, a.provincia]
                                    .filter(Boolean)
                                    .join(' · ') ||
                                    'Ubicación no informada'}
                            </p>
                        </div>

                        {coordinatesAvailable && (
                            <div className="flex flex-wrap gap-2">
                                <Link
                                    href={`/mapa?lat=${a.latitud}&lon=${a.longitud}&zoom=11&selected=${a.slug}`}
                                    className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium transition hover:bg-background"
                                >
                                    Ver mapa nacional
                                </Link>
                            </div>
                        )}
                    </div>
                </header>

                <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
                    <div className="space-y-6">
                        <Section
                            eyebrow="Información principal"
                            title="Identificación"
                        >
                            <div className="grid gap-x-8 md:grid-cols-2">
                                <Field
                                    label="Código OACI"
                                    value={a.designador_oaci}
                                    mono
                                />

                                <Field
                                    label="Código IATA"
                                    value={a.designador_iata}
                                    mono
                                />

                                <Field
                                    label="Código local"
                                    value={a.designador_local}
                                    mono
                                />

                                <Field
                                    label="Tipo"
                                    value={a.tipo}
                                />

                                <Field
                                    label="Uso / tráfico"
                                    value={a.uso}
                                />

                                <Field
                                    label="Provincia"
                                    value={a.provincia}
                                />
                            </div>
                        </Section>

                        <Section
                            eyebrow="Meteorología"
                            title="Condiciones y pronóstico"
                        >
                            <MeteorologiaPanel
                                meteorologia={meteorologia}
                            />
                        </Section>

                        <Section
                            eyebrow="Infraestructura"
                            title="Pistas"
                        >
                            {a.pistas?.length ? (
                                <div className="divide-y divide-border">
                                    {a.pistas.map(
                                        (pista: any) => (
                                            <div
                                                key={pista.id}
                                                className="grid gap-4 py-4 first:pt-0 last:pb-0 md:grid-cols-3"
                                            >
                                                <div>
                                                    <div className="text-xs uppercase tracking-[0.1em] text-muted">
                                                        Designación
                                                    </div>

                                                    <div className="mt-1 font-medium">
                                                        {pista.designacion ||
                                                            'No informada'}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="text-xs uppercase tracking-[0.1em] text-muted">
                                                        Superficie
                                                    </div>

                                                    <div className="mt-1 font-medium">
                                                        {pista.superficie ||
                                                            'No informada'}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="text-xs uppercase tracking-[0.1em] text-muted">
                                                        Longitud
                                                    </div>

                                                    <div className="mt-1 font-medium">
                                                        {pista.largo_m
                                                            ? `${pista.largo_m} m`
                                                            : 'No informada'}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <EmptyState>
                                    No hay información de pistas
                                    validada asociada a este
                                    registro.
                                </EmptyState>
                            )}
                        </Section>

                        <Section
                            eyebrow="Trazabilidad"
                            title="Fuentes"
                        >
                            {a.referencias?.length ? (
                                <div className="space-y-4">
                                    {a.referencias.map(
                                        (referencia: any) => (
                                            <div
                                                key={referencia.id}
                                                className="rounded-xl border border-border bg-background/45 p-4"
                                            >
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                    <div>
                                                        <div className="font-medium">
                                                            {referencia
                                                                .fuente
                                                                ?.nombre ||
                                                                referencia.documento ||
                                                                'Fuente sin identificar'}
                                                        </div>

                                                        <div className="mt-1 text-sm leading-6 text-muted">
                                                            Consultado:{' '}
                                                            {referencia.fecha_consulta ||
                                                                'No informado'}
                                                        </div>
                                                    </div>

                                                    {referencia.estado_validacion && (
                                                        <span className="w-fit rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                                                            {
                                                                referencia.estado_validacion
                                                            }
                                                        </span>
                                                    )}
                                                </div>

                                                {referencia.url && (
                                                    <a
                                                        href={
                                                            referencia.url
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
                                                    >
                                                        Abrir fuente →
                                                    </a>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <EmptyState>
                                    No hay referencias asociadas a
                                    este registro.
                                </EmptyState>
                            )}
                        </Section>
                    </div>

                    <aside className="space-y-6">
                        <Section
                            eyebrow="Georreferencia"
                            title="Ubicación"
                        >
                            <Field
                                label="Latitud"
                                value={a.latitud}
                                mono
                            />

                            <Field
                                label="Longitud"
                                value={a.longitud}
                                mono
                            />

                            <Field
                                label="Elevación"
                                value={
                                    a.elevacion_m !== null &&
                                    a.elevacion_m !== undefined
                                        ? `${a.elevacion_m} m`
                                        : null
                                }
                            />

                            <Field
                                label="Estado de validación"
                                value={a.estado_validacion}
                            />

                            {coordinatesAvailable && (
                                <>
                                    <div className="mt-5 overflow-hidden rounded-xl border border-border">
                                        <div className="h-[280px]">
                                            <MapContainer
                                                center={[
                                                    Number(
                                                        a.latitud
                                                    ),
                                                    Number(
                                                        a.longitud
                                                    ),
                                                ]}
                                                zoom={11}
                                                scrollWheelZoom={
                                                    false
                                                }
                                                dragging
                                                zoomControl
                                                className="h-full w-full"
                                            >
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    attribution="&copy; OpenStreetMap contributors"
                                                />

                                                <Marker
                                                    position={[
                                                        Number(
                                                            a.latitud
                                                        ),
                                                        Number(
                                                            a.longitud
                                                        ),
                                                    ]}
                                                    icon={
                                                        detailMarkerIcon
                                                    }
                                                >
                                                    <Popup>
                                                        <div className="min-w-[170px]">
                                                            <div className="text-sm font-semibold text-slate-900">
                                                                {
                                                                    a.nombre
                                                                }
                                                            </div>

                                                            <div className="mt-1 font-mono text-xs text-slate-500">
                                                                {a.designador_oaci ||
                                                                    a.designador_local ||
                                                                    a.designador_iata ||
                                                                    'Sin código publicado'}
                                                            </div>
                                                        </div>
                                                    </Popup>
                                                </Marker>
                                            </MapContainer>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                                        <a
                                            href={`https://www.openstreetmap.org/?mlat=${a.latitud}&mlon=${a.longitud}#map=12/${a.latitud}/${a.longitud}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Abrir en OpenStreetMap →
                                        </a>

                                        <Link
                                            href={`/mapa?lat=${a.latitud}&lon=${a.longitud}&zoom=11&selected=${a.slug}`}
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Ver mapa nacional →
                                        </Link>
                                    </div>
                                </>
                            )}
                        </Section>

                        <div className="rounded-2xl border border-border bg-surface p-5">
                            <div className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
                                Aviso
                            </div>

                            <p className="mt-3 text-sm leading-6 text-muted">
                                Esta ficha organiza información
                                aeronáutica pública para consulta.
                                No sustituye publicaciones
                                aeronáuticas aplicables ni
                                información previa al vuelo.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}

function MeteorologiaPanel({
    meteorologia,
}: {
    meteorologia?: any;
}) {
    if (meteorologia === undefined) {
        return (
            <MeteorologiaLoading />
        );
    }

    if (!meteorologia) {
        return (
            <EmptyState>
                No hay información meteorológica disponible.
            </EmptyState>
        );
    }

    if (meteorologia.status === 'no_location') {
        return (
            <EmptyState>
                No se puede obtener información meteorológica
                porque este aeródromo no tiene coordenadas
                disponibles.
            </EmptyState>
        );
    }

    const observacion =
        meteorologia.observacion;

    const pronostico =
        meteorologia.pronostico;

    const stale =
        observacion?.data?.observed_at
            ? isObservationStale(
                  observacion.data.observed_at
              )
            : false;

    const forecastRows =
        pronostico?.status === 'ok'
            ? getUpcomingForecast(
                  pronostico?.data?.hourly || [],
                  12
              )
            : [];

    return (
        <div className="space-y-8">
            <div>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h3 className="text-base font-semibold">
                            Observación
                        </h3>

                        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
                            Condiciones observadas mediante
                            estaciones del Servicio Meteorológico
                            Nacional.
                        </p>
                    </div>

                    <MeteorologiaStatus
                        status={observacion?.status}
                        stale={stale}
                    />
                </div>

                {observacion?.status === 'ok' &&
                observacion?.data ? (
                    <ObservacionSmn
                        observacion={observacion}
                        stale={stale}
                    />
                ) : observacion?.status ===
                  'too_far' ? (
                    <ObservationTooFar
                        observacion={observacion}
                    />
                ) : observacion?.status ===
                  'error' ? (
                    <EmptyState>
                        No fue posible consultar las
                        observaciones del SMN en este
                        momento.
                    </EmptyState>
                ) : (
                    <EmptyState>
                        No hay una observación SMN
                        representativa disponible para
                        este aeródromo.
                    </EmptyState>
                )}
            </div>

            <div className="border-t border-border pt-7">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h3 className="text-base font-semibold">
                            Pronóstico horario
                        </h3>

                        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
                            Pronóstico calculado para las
                            coordenadas específicas del
                            aeródromo.
                        </p>
                    </div>

                    <MeteorologiaStatus
                        status={pronostico?.status}
                    />
                </div>

                {pronostico?.status === 'ok' &&
                forecastRows.length ? (
                    <ForecastTable
                        rows={forecastRows}
                        model={
                            pronostico?.data?.model
                        }
                    />
                ) : pronostico?.status ===
                  'error' ? (
                    <EmptyState>
                        No fue posible consultar el
                        pronóstico meteorológico en este
                        momento.
                    </EmptyState>
                ) : (
                    <EmptyState>
                        No hay pronóstico meteorológico
                        disponible para esta ubicación.
                    </EmptyState>
                )}
            </div>

            <div className="border-t border-border pt-4 text-xs leading-5 text-muted">
                Las observaciones y pronósticos se
                presentan como información complementaria.
                No sustituyen METAR, TAF, avisos ni
                documentación meteorológica aeronáutica
                aplicable.
            </div>
        </div>
    );
}

function ObservacionSmn({
    observacion,
    stale,
}: {
    observacion: any;
    stale: boolean;
}) {
    const data =
        observacion.data;

    const association =
        observacion.association;

    return (
        <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <WeatherMetric
                    label="Temperatura"
                    value={formatUnit(
                        data.temperature_c,
                        '°C',
                        1
                    )}
                    emphasis
                />

                <WeatherMetric
                    label="Humedad"
                    value={formatUnit(
                        data.humidity_pct,
                        '%',
                        0
                    )}
                />

                <WeatherMetric
                    label="Presión"
                    value={formatUnit(
                        data.pressure_hpa,
                        'hPa',
                        1
                    )}
                />

                <WeatherMetric
                    label="Visibilidad"
                    value={formatVisibility(
                        data.visibility_m
                    )}
                />

                <WeatherMetric
                    label="Viento"
                    value={
                        data.wind
                            ? `${formatDirection(
                                  data.wind
                                      .direction_deg
                              )} · ${formatUnit(
                                  data.wind.speed_kt,
                                  'kt',
                                  1
                              )}`
                            : 'No informado'
                    }
                />

                <WeatherMetric
                    label="Punto de rocío"
                    value={formatUnit(
                        data.dewpoint_c,
                        '°C',
                        1
                    )}
                />

                <WeatherMetric
                    label="Nubosidad"
                    value={formatUnit(
                        data.cloud_cover_pct,
                        '%',
                        0
                    )}
                />

                <WeatherMetric
                    label="Tiempo presente"
                    value={formatPresentWeather(
                        data.weather?.description
                    )}
                />
            </div>

            <div className="mt-5 rounded-xl border border-border bg-background/45 p-4">
                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <div className="text-[11px] uppercase tracking-[0.1em] text-muted">
                            Estación utilizada
                        </div>

                        <div className="mt-1.5 font-medium">
                            {data.station?.name ||
                                'No informada'}
                        </div>

                        <div className="mt-1 font-mono text-xs text-muted">
                            {data.station?.oaci
                                ? `${data.station.oaci} · `
                                : ''}
                            {data.station?.wigos ||
                                ''}
                        </div>
                    </div>

                    <div>
                        <div className="text-[11px] uppercase tracking-[0.1em] text-muted">
                            Representatividad
                        </div>

                        <div className="mt-1.5 font-medium">
                            {association?.label ||
                                'No informada'}
                        </div>

                        {association?.distance_km !==
                            null &&
                            association?.distance_km !==
                                undefined && (
                                <div className="mt-1 text-xs text-muted">
                                    Distancia a la
                                    estación:{' '}
                                    {formatNumber(
                                        association.distance_km,
                                        1
                                    )}{' '}
                                    km
                                </div>
                            )}
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-3 text-xs text-muted">
                    <span>
                        Fuente: SMN / WIS2
                    </span>

                    <span>·</span>

                    <span>
                        Observado:{' '}
                        {formatObservationTime(
                            data.observed_at
                        )}
                    </span>

                    {stale && (
                        <>
                            <span>·</span>

                            <span className="font-medium text-amber-500">
                                Dato desactualizado
                            </span>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

function ObservationTooFar({
    observacion,
}: {
    observacion: any;
}) {
    const association =
        observacion?.association;

    return (
        <div className="rounded-xl border border-border bg-background/45 p-5">
            <div className="font-medium">
                Sin observación local representativa
            </div>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                La estación meteorológica disponible más
                cercana se encuentra a{' '}
                <strong className="font-medium text-foreground">
                    {formatNumber(
                        association?.distance_km,
                        1
                    )}{' '}
                    km
                </strong>
                . Por esa distancia, AeroInfo no presenta
                sus mediciones como condiciones locales de
                este aeródromo.
            </p>

            {association?.station?.name && (
                <div className="mt-4 border-t border-border pt-3 text-xs text-muted">
                    Estación de referencia más cercana:{' '}
                    <span className="font-medium text-foreground">
                        {
                            association.station
                                .name
                        }
                        {association.station.oaci
                            ? ` (${association.station.oaci})`
                            : ''}
                    </span>
                </div>
            )}
        </div>
    );
}

function ForecastTable({
    rows,
    model,
}: {
    rows: any[];
    model?: string;
}) {
    return (
        <>
            <div className="overflow-hidden rounded-xl border border-border">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[940px] text-sm">
                        <thead className="bg-background/55">
                            <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.08em] text-muted">
                                <th className="px-4 py-3 font-medium">
                                    Hora
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    Condición
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    Temp.
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    Hum.
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    Viento
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    Ráfaga
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    Presión
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    Visibilidad
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    Precip.
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {rows.map(
                                (
                                    row: any,
                                    index: number
                                ) => (
                                    <tr
                                        key={`${row.time}-${index}`}
                                        className="border-b border-border/70 last:border-b-0"
                                    >
                                        <td className="whitespace-nowrap px-4 py-3 font-medium">
                                            {formatForecastTime(
                                                row.time
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            {formatWeatherCode(
                                                row.weather_code
                                            )}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3">
                                            {formatUnit(
                                                row.temperature_c,
                                                '°C',
                                                1
                                            )}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3">
                                            {formatUnit(
                                                row.humidity_pct,
                                                '%',
                                                0
                                            )}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3">
                                            {formatDirection(
                                                row.wind_direction_deg
                                            )}{' '}
                                            ·{' '}
                                            {formatUnit(
                                                row.wind_speed_kt,
                                                'kt',
                                                1
                                            )}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3">
                                            {formatUnit(
                                                row.wind_gust_kt,
                                                'kt',
                                                1
                                            )}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3">
                                            {formatUnit(
                                                row.pressure_hpa,
                                                'hPa',
                                                0
                                            )}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3">
                                            {formatVisibility(
                                                row.visibility_m
                                            )}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3">
                                            {formatUnit(
                                                row.precipitation_mm,
                                                'mm',
                                                1
                                            )}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
                <span>
                    Fuente: Open-Meteo
                </span>

                <span>
                    Modelo:{' '}
                    {formatModelName(model)}
                </span>

                <span>
                    Horizonte mostrado: próximas 12 horas
                </span>
            </div>
        </>
    );
}

function WeatherMetric({
    label,
    value,
    emphasis = false,
}: {
    label: string;
    value: string;
    emphasis?: boolean;
}) {
    return (
        <div className="rounded-xl border border-border bg-background/40 px-4 py-3.5">
            <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                {label}
            </div>

            <div
                className={[
                    'mt-1.5',
                    emphasis
                        ? 'text-xl font-semibold tracking-tight'
                        : 'text-sm font-semibold',
                ].join(' ')}
            >
                {value}
            </div>
        </div>
    );
}

function MeteorologiaStatus({
    status,
    stale = false,
}: {
    status?: string;
    stale?: boolean;
}) {
    let text =
        'Sin datos';

    let className =
        'border-border bg-background/55 text-muted';

    if (stale) {
        text =
            'Desactualizado';

        className =
            'border-amber-500/25 bg-amber-500/10 text-amber-500';
    } else if (status === 'ok') {
        text =
            'Disponible';

        className =
            'border-emerald-500/25 bg-emerald-500/10 text-emerald-500';
    } else if (status === 'error') {
        text =
            'Error';

        className =
            'border-red-500/25 bg-red-500/10 text-red-500';
    } else if (status === 'too_far') {
        text =
            'Sin observación local';

        className =
            'border-amber-500/25 bg-amber-500/10 text-amber-500';
    } else if (status === 'disabled') {
        text =
            'Deshabilitado';
    }

    return (
        <span
            className={[
                'w-fit rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]',
                className,
            ].join(' ')}
        >
            {text}
        </span>
    );
}

function MeteorologiaLoading() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <div className="h-4 w-28 animate-pulse rounded bg-border" />
                    <div className="mt-2 h-3 w-64 max-w-full animate-pulse rounded bg-border/70" />
                </div>

                <div className="h-6 w-24 animate-pulse rounded-full bg-border" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({
                    length: 4,
                }).map((_, index) => (
                    <div
                        key={index}
                        className="h-20 animate-pulse rounded-xl border border-border bg-background/40"
                    />
                ))}
            </div>
        </div>
    );
}

function Section({
    eyebrow,
    title,
    children,
}: {
    eyebrow?: string;
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm md:p-6">
            {eyebrow && (
                <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
                    {eyebrow}
                </div>
            )}

            <h2 className="mt-1 text-xl font-semibold tracking-tight">
                {title}
            </h2>

            <div className="mt-5">
                {children}
            </div>
        </section>
    );
}

function Field({
    label,
    value,
    mono = false,
}: {
    label: string;
    value: any;
    mono?: boolean;
}) {
    const display =
        value !== null &&
        value !== undefined &&
        value !== ''
            ? value
            : 'No informado';

    return (
        <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-border py-3 last:border-b-0">
            <span className="text-sm text-muted">
                {label}
            </span>

            <span
                className={[
                    'text-right text-sm font-medium text-foreground',
                    mono
                        ? 'font-mono'
                        : '',
                ].join(' ')}
            >
                {display}
            </span>
        </div>
    );
}

function EmptyState({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="rounded-xl border border-dashed border-border bg-background/35 px-4 py-5 text-sm leading-6 text-muted">
            {children}
        </div>
    );
}

function getUpcomingForecast(
    rows: any[],
    limit: number
) {
    if (!Array.isArray(rows)) {
        return [];
    }

    const now =
        new Date();

    const future =
        rows.filter((row) => {
            if (!row?.time) {
                return false;
            }

            const time =
                parseBuenosAiresForecastTime(
                    row.time
                );

            return (
                time.getTime() >=
                now.getTime() -
                    60 * 60 * 1000
            );
        });

    return future.slice(
        0,
        limit
    );
}

function parseBuenosAiresForecastTime(
    value: string
) {
    /*
     * Open-Meteo devuelve hora local porque solicitamos
     * America/Argentina/Buenos_Aires.
     *
     * Agregamos explícitamente -03:00 para evitar que
     * el navegador interprete el string en otra zona.
     */
    if (
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(
            value
        )
    ) {
        return new Date(
            `${value}:00-03:00`
        );
    }

    return new Date(value);
}

function isObservationStale(
    observedAt: string
) {
    const observed =
        new Date(observedAt);

    if (
        Number.isNaN(
            observed.getTime()
        )
    ) {
        return false;
    }

    const age =
        Date.now() -
        observed.getTime();

    return (
        age >
        3 * 60 * 60 * 1000
    );
}

function formatObservationTime(
    value?: string
) {
    if (!value) {
        return 'No informado';
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return value;
    }

    return new Intl.DateTimeFormat(
        'es-AR',
        {
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone:
                'America/Argentina/Buenos_Aires',
        }
    ).format(date);
}

function formatForecastTime(
    value?: string
) {
    if (!value) {
        return '—';
    }

    const date =
        parseBuenosAiresForecastTime(
            value
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return value;
    }

    return new Intl.DateTimeFormat(
        'es-AR',
        {
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
            timeZone:
                'America/Argentina/Buenos_Aires',
        }
    ).format(date);
}

function formatUnit(
    value: any,
    unit: string,
    decimals = 0
) {
    if (
        value === null ||
        value === undefined ||
        value === ''
    ) {
        return 'No informado';
    }

    const number =
        Number(value);

    if (
        Number.isNaN(number)
    ) {
        return 'No informado';
    }

    return `${number.toFixed(
        decimals
    )} ${unit}`;
}

function formatNumber(
    value: any,
    decimals = 0
) {
    const number =
        Number(value);

    if (
        Number.isNaN(number)
    ) {
        return '—';
    }

    return number.toFixed(
        decimals
    );
}

function formatVisibility(
    value: any
) {
    const meters =
        Number(value);

    if (
        Number.isNaN(meters)
    ) {
        return 'No informada';
    }

    if (meters >= 10000) {
        return `${(
            meters / 1000
        ).toFixed(0)} km`;
    }

    if (meters >= 1000) {
        return `${(
            meters / 1000
        ).toFixed(1)} km`;
    }

    return `${Math.round(
        meters
    )} m`;
}

function formatDirection(
    value: any
) {
    const degrees =
        Number(value);

    if (
        Number.isNaN(degrees)
    ) {
        return '—';
    }

    const normalized =
        ((Math.round(degrees) %
            360) +
            360) %
        360;

    const display =
        normalized === 0
            ? 360
            : normalized;

    return `${display
        .toString()
        .padStart(3, '0')}°`;
}

function formatModelName(
    model?: string
) {
    if (
        model === 'ecmwf_ifs'
    ) {
        return 'ECMWF IFS';
    }

    if (
        model === 'ecmwf_ifs025'
    ) {
        return 'ECMWF IFS 0.25°';
    }

    return (
        model ||
        'No informado'
    );
}

function formatPresentWeather(
    value?: string
) {
    if (!value) {
        return 'No informado';
    }

    const translations: Record<
        string,
        string
    > = {
        MIST: 'Neblina',
        FOG: 'Niebla',
        RAIN: 'Lluvia',
        DRIZZLE: 'Llovizna',
        SNOW: 'Nieve',
        THUNDERSTORM:
            'Tormenta',
    };

    return (
        translations[
            value.toUpperCase()
        ] || value
    );
}

function formatWeatherCode(
    code: any
) {
    const value =
        Number(code);

    const labels: Record<
        number,
        string
    > = {
        0: 'Despejado',
        1: 'Mayormente despejado',
        2: 'Parcialmente nublado',
        3: 'Cubierto',
        45: 'Niebla',
        48: 'Niebla con escarcha',
        51: 'Llovizna débil',
        53: 'Llovizna moderada',
        55: 'Llovizna intensa',
        56: 'Llovizna helada débil',
        57: 'Llovizna helada intensa',
        61: 'Lluvia débil',
        63: 'Lluvia moderada',
        65: 'Lluvia intensa',
        66: 'Lluvia helada débil',
        67: 'Lluvia helada intensa',
        71: 'Nieve débil',
        73: 'Nieve moderada',
        75: 'Nieve intensa',
        77: 'Granos de nieve',
        80: 'Chaparrones débiles',
        81: 'Chaparrones moderados',
        82: 'Chaparrones intensos',
        85: 'Nevadas débiles',
        86: 'Nevadas intensas',
        95: 'Tormenta',
        96: 'Tormenta con granizo',
        99: 'Tormenta fuerte con granizo',
    };

    return (
        labels[value] ||
        'Sin descripción'
    );
}