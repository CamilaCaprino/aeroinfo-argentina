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
    notams?: any;
};

export default function Show({
    aerodromo: a,
    meteorologia,
    notams,
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
                            eyebrow="Información operacional"
                            title="NOTAM activos"
                        >
                            <NotamPanel notams={notams} />
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


function NotamPanel({
    notams,
}: {
    notams?: any;
}) {
    if (notams === undefined) {
        return (
            <div className="space-y-4">
                <div className="h-4 w-40 animate-pulse rounded bg-border" />
                <div className="h-24 animate-pulse rounded-xl border border-border bg-background/40" />
            </div>
        );
    }

    if (!notams) {
        return (
            <EmptyState>
                No hay información NOTAM disponible.
            </EmptyState>
        );
    }

    if (notams.status === 'no_indicator') {
        return (
            <EmptyState>
                Este registro no tiene un indicador local asociado para consultar NOTAM en AIS ANAC.
            </EmptyState>
        );
    }

    if (notams.status === 'disabled') {
        return (
            <EmptyState>
                La consulta NOTAM está deshabilitada temporalmente.
            </EmptyState>
        );
    }

    if (notams.status === 'error') {
        return (
            <EmptyState>
                No fue posible consultar los NOTAM de AIS ANAC en este momento.
            </EmptyState>
        );
    }

    const rows =
        Array.isArray(notams.data)
            ? notams.data
            : [];

    if (notams.status !== 'ok') {
        return (
            <EmptyState>
                No hay información NOTAM disponible para este aeródromo.
            </EmptyState>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="text-sm font-semibold">
                        {rows.length
                            ? `${rows.length} NOTAM activo${rows.length === 1 ? '' : 's'}`
                            : 'Sin NOTAM activos'}
                    </div>

                    <p className="mt-1 max-w-3xl text-sm leading-6 text-muted">
                        Avisos publicados en AIS ANAC para el indicador{' '}
                        <span className="font-mono font-medium text-foreground">
                            {notams.indicator || '—'}
                        </span>
                        . Se muestra primero la versión en español cuando está disponible y se conserva el texto original.
                    </p>
                </div>

                <span className="w-fit rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-500">
                    AIS ANAC
                </span>
            </div>

            {rows.length ? (
                <div className="space-y-3">
                    {rows.map(
                        (
                            notam: any,
                            index: number
                        ) => (
                            <NotamCard
                                key={`${notam.number || 'notam'}-${index}`}
                                notam={notam}
                            />
                        )
                    )}
                </div>
            ) : (
                <EmptyState>
                    AIS ANAC no informa NOTAM activos para este indicador en este momento.
                </EmptyState>
            )}

            <div className="flex flex-col gap-2 border-t border-border pt-4 text-xs leading-5 text-muted sm:flex-row sm:items-center sm:justify-between">
                <span>
                    Fuente: AIS ANAC · Información de referencia. No reemplaza el PIB ni la información previa al vuelo obtenida por los canales oficiales.
                </span>

                <a
                    href="https://ais.anac.gob.ar/notam"
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 font-medium text-primary hover:underline"
                >
                    Abrir AIS ANAC →
                </a>
            </div>
        </div>
    );
}

function NotamCard({
    notam,
}: {
    notam: any;
}) {
    const spanish =
        notam?.text?.spanish;

    const original =
        notam?.text?.original;

    return (
        <article className="rounded-xl border border-border bg-background/40 p-4 md:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <span className="rounded-md border border-border bg-surface px-2 py-1 font-mono text-xs font-semibold">
                        {notam.number || 'NOTAM'}
                    </span>

                    <span
                        className={[
                            'rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]',
                            notamCategoryClass(
                                notam.category
                            ),
                        ].join(' ')}
                    >
                        {formatNotamCategory(
                            notam.category
                        )}
                    </span>

                    {notam.permanent && (
                        <span className="rounded-md border border-violet-500/25 bg-violet-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-violet-500">
                            PERM
                        </span>
                    )}
                </div>

                <div className="text-xs text-muted">
                    {notam.location_name ||
                        notam.indicator ||
                        'Lugar no informado'}
                </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-surface/40 px-3 py-2.5">
                    <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted">
                        Desde
                    </div>

                    <div className="mt-1 text-sm font-medium">
                        {formatNotamTime(
                            notam.starts_at
                        )}
                    </div>
                </div>

                <div className="rounded-lg border border-border bg-surface/40 px-3 py-2.5">
                    <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted">
                        Hasta
                    </div>

                    <div className="mt-1 text-sm font-medium">
                        {notam.permanent
                            ? 'Permanente'
                            : formatNotamTime(
                                  notam.ends_at
                              )}
                    </div>
                </div>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-background/65 p-4">
                <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                    Información
                </div>

                <p className="mt-2 text-sm font-medium leading-6 text-foreground">
                    {spanish ||
                        original ||
                        'Texto no informado'}
                </p>
            </div>

            {original &&
                spanish &&
                original.trim() !==
                    spanish.trim() && (
                    <details className="mt-3 rounded-lg border border-border bg-background/35">
                        <summary className="cursor-pointer px-3 py-2.5 text-xs font-medium text-primary">
                            Ver texto original
                        </summary>

                        <div className="border-t border-border px-3 py-3 font-mono text-xs leading-5 text-muted">
                            {original}
                        </div>
                    </details>
                )}
        </article>
    );
}

function formatNotamCategory(
    category?: string
) {
    const labels: Record<
        string,
        string
    > = {
        runway: 'Pista',
        taxiway: 'Taxiway',
        approach_aid:
            'Ayuda de aproximación',
        navigation_aid:
            'Radioayuda',
        apron: 'Plataforma',
        obstacle: 'Obstáculo',
        procedure:
            'Procedimiento',
        other: 'Otro',
    };

    return (
        labels[
            String(
                category || 'other'
            ).toLowerCase()
        ] || 'Otro'
    );
}

function notamCategoryClass(
    category?: string
) {
    const value =
        String(
            category || 'other'
        ).toLowerCase();

    if (
        value === 'runway' ||
        value === 'taxiway'
    ) {
        return 'border-amber-500/25 bg-amber-500/10 text-amber-500';
    }

    if (
        value === 'approach_aid' ||
        value === 'navigation_aid'
    ) {
        return 'border-blue-500/25 bg-blue-500/10 text-blue-500';
    }

    if (value === 'obstacle') {
        return 'border-red-500/25 bg-red-500/10 text-red-500';
    }

    if (value === 'procedure') {
        return 'border-violet-500/25 bg-violet-500/10 text-violet-500';
    }

    if (value === 'apron') {
        return 'border-cyan-500/25 bg-cyan-500/10 text-cyan-500';
    }

    return 'border-border bg-surface text-muted';
}

function formatNotamTime(
    value?: string
) {
    if (!value) {
        return 'No informado';
    }

    return formatZuluTime(
        value
    );
}


function MeteorologiaPanel({
    meteorologia,
}: {
    meteorologia?: any;
}) {
    if (meteorologia === undefined) {
        return <MeteorologiaLoading />;
    }

    if (!meteorologia) {
        return (
            <EmptyState>
                No hay información meteorológica disponible.
            </EmptyState>
        );
    }

    const metar =
        meteorologia.metar;

    const taf =
        meteorologia.taf;

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

    const metarStale =
        metar?.data?.observed_at
            ? isMetarStale(
                  metar.data.observed_at
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
                <div className="mb-4">
                    <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
                        Información meteorológica aeronáutica
                    </div>

                    <h3 className="mt-1 text-lg font-semibold">
                        METAR / SPECI y TAF
                    </h3>

                    <p className="mt-1 max-w-3xl text-sm leading-6 text-muted">
                        Productos meteorológicos aeronáuticos
                        asociados al designador OACI del
                        aeródromo. Se conserva siempre el
                        mensaje original junto con una lectura
                        estructurada.
                    </p>
                </div>

                <div className="space-y-6">
                    <MetarPanel
                        metar={metar}
                        stale={metarStale}
                    />

                    <TafPanel taf={taf} />
                </div>
            </div>

            <div className="border-t border-border pt-7">
                <div className="mb-5">
                    <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
                        Información complementaria
                    </div>

                    <h3 className="mt-1 text-lg font-semibold">
                        Observación SMN y tendencia ECMWF
                    </h3>

                    <p className="mt-1 max-w-3xl text-sm leading-6 text-muted">
                        Datos complementarios para ampliar el
                        contexto meteorológico. No reemplazan
                        los productos aeronáuticos aplicables.
                    </p>
                </div>

                <div>
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h4 className="text-base font-semibold">
                                Observación SMN
                            </h4>

                            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
                                Condiciones observadas mediante
                                estaciones del Servicio
                                Meteorológico Nacional.
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

                <div className="mt-7 border-t border-border pt-7">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h4 className="text-base font-semibold">
                                Pronóstico horario ECMWF
                            </h4>

                            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
                                Pronóstico numérico calculado
                                para las coordenadas específicas
                                del aeródromo.
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
            </div>

            <div className="border-t border-border pt-4 text-xs leading-5 text-muted">
                AeroInfo organiza estos datos para facilitar
                su consulta. Verificá siempre METAR/SPECI,
                TAF, NOTAM, SIGMET y demás información
                aeronáutica aplicable mediante las fuentes y
                servicios oficiales correspondientes antes
                de la operación. Esta vista no constituye un
                PIB ni un briefing oficial.
            </div>
        </div>
    );
}

function MetarPanel({
    metar,
    stale,
}: {
    metar: any;
    stale: boolean;
}) {
    if (metar?.status === 'no_icao') {
        return (
            <AviationProductShell
                title="METAR / SPECI"
                description="Observación meteorológica aeronáutica."
                status="no_icao"
            >
                <EmptyState>
                    Este registro no tiene designador OACI,
                    por lo que no es posible consultar
                    METAR/SPECI por código de aeródromo.
                </EmptyState>
            </AviationProductShell>
        );
    }

    if (metar?.status === 'error') {
        return (
            <AviationProductShell
                title="METAR / SPECI"
                description="Observación meteorológica aeronáutica."
                status="error"
            >
                <EmptyState>
                    No fue posible consultar METAR/SPECI en
                    este momento.
                </EmptyState>
            </AviationProductShell>
        );
    }

    if (
        metar?.status !== 'ok' ||
        !metar?.data
    ) {
        return (
            <AviationProductShell
                title="METAR / SPECI"
                description="Observación meteorológica aeronáutica."
                status={metar?.status}
            >
                <EmptyState>
                    No hay un METAR/SPECI disponible para
                    este aeródromo.
                </EmptyState>
            </AviationProductShell>
        );
    }

    const data = metar.data;

    return (
        <AviationProductShell
            title={`${data.type || 'METAR'} ${data.icao || ''}`.trim()}
            description="Último reporte meteorológico aeronáutico disponible."
            status={metar.status}
            stale={stale}
            right={
                <FlightCategoryBadge
                    category={data.flight_category}
                />
            }
        >
            <RawAviationMessage
                label="Mensaje original"
                value={data.raw}
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <WeatherMetric
                    label="Viento"
                    value={formatAviationWind(
                        data.wind
                    )}
                    emphasis
                />

                <WeatherMetric
                    label="Visibilidad"
                    value={formatAviationVisibility(
                        data.visibility
                    )}
                />

                <WeatherMetric
                    label="QNH"
                    value={formatUnit(
                        data.pressure_hpa,
                        'hPa',
                        0
                    )}
                />

                <WeatherMetric
                    label="Temperatura"
                    value={formatUnit(
                        data.temperature_c,
                        '°C',
                        0
                    )}
                />

                <WeatherMetric
                    label="Punto de rocío"
                    value={formatUnit(
                        data.dewpoint_c,
                        '°C',
                        0
                    )}
                />

                <WeatherMetric
                    label="Nubosidad"
                    value={
                        data.clouds?.length
                            ? formatCloudLayers(
                                  data.clouds
                              )
                            : data.cloud_cover ||
                              'Sin capas informadas'
                    }
                />

                <WeatherMetric
                    label="Categoría"
                    value={
                        data.flight_category ||
                        'No informada'
                    }
                />

                <WeatherMetric
                    label="Observado"
                    value={formatZuluTime(
                        data.observed_at
                    )}
                />
            </div>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                <span>
                    Fuente: {data.source || 'AviationWeather.gov'}
                </span>

                <span>·</span>

                <span>
                    Recibido: {formatZuluTime(data.received_at)}
                </span>

                {stale && (
                    <>
                        <span>·</span>
                        <span className="font-medium text-amber-500">
                            Reporte con más de 2 horas
                        </span>
                    </>
                )}
            </div>
        </AviationProductShell>
    );
}

function TafPanel({
    taf,
}: {
    taf: any;
}) {
    if (taf?.status === 'no_icao') {
        return (
            <AviationProductShell
                title="TAF"
                description="Pronóstico meteorológico aeronáutico."
                status="no_icao"
            >
                <EmptyState>
                    Este registro no tiene designador OACI,
                    por lo que no es posible consultar TAF
                    por código de aeródromo.
                </EmptyState>
            </AviationProductShell>
        );
    }

    if (taf?.status === 'error') {
        return (
            <AviationProductShell
                title="TAF"
                description="Pronóstico meteorológico aeronáutico."
                status="error"
            >
                <EmptyState>
                    No fue posible consultar el TAF en este
                    momento.
                </EmptyState>
            </AviationProductShell>
        );
    }

    if (
        taf?.status !== 'ok' ||
        !taf?.data
    ) {
        return (
            <AviationProductShell
                title="TAF"
                description="Pronóstico meteorológico aeronáutico."
                status={taf?.status}
            >
                <EmptyState>
                    No hay un TAF disponible para este
                    aeródromo.
                </EmptyState>
            </AviationProductShell>
        );
    }

    const data = taf.data;

    return (
        <AviationProductShell
            title={`TAF ${data.icao || ''}`.trim()}
            description="Pronóstico de aeródromo y cambios previstos durante su período de validez."
            status={taf.status}
        >
            <RawAviationMessage
                label="Mensaje original"
                value={data.raw}
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <WeatherMetric
                    label="Emitido"
                    value={formatZuluTime(
                        data.issued_at
                    )}
                />

                <WeatherMetric
                    label="Válido desde"
                    value={formatZuluTime(
                        data.valid_from
                    )}
                />

                <WeatherMetric
                    label="Válido hasta"
                    value={formatZuluTime(
                        data.valid_to
                    )}
                />
            </div>

            {Array.isArray(data.segments) &&
            data.segments.length ? (
                <div className="mt-5 space-y-3">
                    <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                        Evolución prevista
                    </div>

                    {data.segments.map(
                        (
                            segment: any,
                            index: number
                        ) => (
                            <TafSegment
                                key={`${segment.from}-${segment.to}-${index}`}
                                segment={segment}
                                index={index}
                            />
                        )
                    )}
                </div>
            ) : (
                <div className="mt-4">
                    <EmptyState>
                        El TAF no contiene segmentos
                        decodificados disponibles.
                    </EmptyState>
                </div>
            )}

            <div className="mt-4 text-xs text-muted">
                Fuente: {data.source || 'AviationWeather.gov'}
            </div>
        </AviationProductShell>
    );
}

function TafSegment({
    segment,
    index,
}: {
    segment: any;
    index: number;
}) {
    const change =
        segment.change || 'BASE';

    const hazardous =
        isTafSegmentOperationallyRelevant(
            segment
        );

    return (
        <div
            className={[
                'rounded-xl border p-4',
                hazardous
                    ? 'border-amber-500/25 bg-amber-500/[0.06]'
                    : 'border-border bg-background/40',
            ].join(' ')}
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className={[
                            'rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em]',
                            tafChangeClass(change),
                        ].join(' ')}
                    >
                        {formatTafChange(change)}
                    </span>

                    {segment.probability_pct !== null &&
                        segment.probability_pct !== undefined && (
                            <span className="rounded-md border border-border bg-surface px-2 py-1 text-[10px] font-semibold">
                                PROB {segment.probability_pct}%
                            </span>
                        )}

                    {hazardous && (
                        <span className="text-xs font-medium text-amber-500">
                            Condición a revisar
                        </span>
                    )}
                </div>

                <div className="text-xs text-muted">
                    {formatTafPeriod(
                        segment.from,
                        segment.to
                    )}
                </div>
            </div>

            {segment.became_at && (
                <div className="mt-2 text-xs text-muted">
                    Cambio previsto hacia{' '}
                    <span className="font-medium text-foreground">
                        {formatZuluTime(
                            segment.became_at
                        )}
                    </span>
                </div>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <WeatherMetric
                    label="Viento"
                    value={formatAviationWind(
                        segment.wind
                    )}
                />

                <WeatherMetric
                    label="Visibilidad"
                    value={formatAviationVisibility(
                        segment.visibility
                    )}
                />

                <WeatherMetric
                    label="Fenómeno"
                    value={formatAviationWeather(
                        segment.weather
                    )}
                />

                <WeatherMetric
                    label="Nubes"
                    value={
                        segment.clouds?.length
                            ? formatCloudLayers(
                                  segment.clouds
                              )
                            : 'Sin capas informadas'
                    }
                />
            </div>

            {segment.temperatures?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {segment.temperatures.map(
                        (
                            temp: any,
                            tempIndex: number
                        ) => (
                            <span
                                key={`${temp.time}-${tempIndex}`}
                                className="rounded-lg border border-border bg-surface px-3 py-2 text-xs"
                            >
                                {temp.type === 'MAX'
                                    ? 'Máx.'
                                    : temp.type === 'MIN'
                                      ? 'Mín.'
                                      : 'Temp.'}{' '}
                                <strong>
                                    {formatUnit(
                                        temp.temperature_c,
                                        '°C',
                                        0
                                    )}
                                </strong>{' '}
                                · {formatZuluTime(temp.time)}
                            </span>
                        )
                    )}
                </div>
            )}

            {segment.wind_shear?.height_ft && (
                <div className="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-3 py-2 text-xs">
                    Wind shear informado a{' '}
                    {segment.wind_shear.height_ft} ft
                    {segment.wind_shear.direction_deg
                        ? ` · ${segment.wind_shear.direction_deg}°`
                        : ''}
                    {segment.wind_shear.speed_kt
                        ? ` · ${segment.wind_shear.speed_kt} kt`
                        : ''}
                </div>
            )}

            {segment.not_decoded && (
                <div className="mt-3 text-xs text-muted">
                    No decodificado: {segment.not_decoded}
                </div>
            )}

            {index === 0 && change === 'BASE' && (
                <div className="mt-3 text-[11px] text-muted">
                    Condiciones predominantes iniciales del TAF.
                </div>
            )}
        </div>
    );
}

function AviationProductShell({
    title,
    description,
    status,
    stale = false,
    right,
    children,
}: {
    title: string;
    description: string;
    status?: string;
    stale?: boolean;
    right?: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-border bg-background/25 p-4 md:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h4 className="font-semibold">
                        {title}
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-muted">
                        {description}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {right}

                    <MeteorologiaStatus
                        status={status}
                        stale={stale}
                    />
                </div>
            </div>

            {children}
        </div>
    );
}

function RawAviationMessage({
    label,
    value,
}: {
    label: string;
    value?: string;
}) {
    return (
        <div className="rounded-xl border border-border bg-background/70 p-4">
            <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                {label}
            </div>

            <div className="mt-2 break-words font-mono text-sm font-medium leading-6 text-foreground">
                {value || 'No informado'}
            </div>
        </div>
    );
}

function FlightCategoryBadge({
    category,
}: {
    category?: string;
}) {
    if (!category) {
        return null;
    }

    const value =
        category.toUpperCase();

    const classes: Record<string, string> = {
        VFR:
            'border-emerald-500/25 bg-emerald-500/10 text-emerald-500',
        MVFR:
            'border-blue-500/25 bg-blue-500/10 text-blue-500',
        IFR:
            'border-red-500/25 bg-red-500/10 text-red-500',
        LIFR:
            'border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-500',
    };

    return (
        <span
            className={[
                'rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]',
                classes[value] ||
                    'border-border bg-background/55 text-muted',
            ].join(' ')}
        >
            {value}
        </span>
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

function isMetarStale(
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

    return (
        Date.now() -
            observed.getTime() >
        2 * 60 * 60 * 1000
    );
}

function formatZuluTime(
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

    const day =
        new Intl.DateTimeFormat(
            'es-AR',
            {
                day: '2-digit',
                month: 'short',
                timeZone: 'UTC',
            }
        )
            .format(date)
            .replace('.', '')
            .toUpperCase();

    const time =
        new Intl.DateTimeFormat(
            'es-AR',
            {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'UTC',
            }
        ).format(date);

    return `${day} ${time}Z`;
}

function formatAviationWind(
    wind: any
) {
    if (!wind) {
        return 'No informado';
    }

    const direction =
        wind.direction_deg;

    const speed =
        wind.speed_kt;

    const gust =
        wind.gust_kt;

    if (
        (direction === null ||
            direction === undefined ||
            direction === '') &&
        (speed === null ||
            speed === undefined ||
            speed === '')
    ) {
        return 'No informado';
    }

    const directionLabel =
        String(direction).toUpperCase() === 'VRB'
            ? 'VRB'
            : formatDirection(direction);

    const speedLabel =
        speed !== null &&
        speed !== undefined &&
        speed !== ''
            ? `${formatNumber(speed, 0)} kt`
            : '—';

    const gustLabel =
        gust !== null &&
        gust !== undefined &&
        gust !== ''
            ? ` G${formatNumber(gust, 0)}`
            : '';

    return `${directionLabel} · ${speedLabel}${gustLabel}`;
}

function formatAviationVisibility(
    value: any
) {
    if (
        value === null ||
        value === undefined ||
        value === ''
    ) {
        return 'No informada';
    }

    if (
        typeof value === 'string' &&
        value.includes('+')
    ) {
        return '≥ 10 km';
    }

    const statuteMiles =
        Number(value);

    if (
        Number.isNaN(statuteMiles)
    ) {
        return String(value);
    }

    const meters =
        statuteMiles * 1609.344;

    if (meters >= 9500) {
        return '≥ 10 km';
    }

    if (meters >= 1000) {
        const km =
            meters / 1000;

        return `${km >= 5 ? km.toFixed(0) : km.toFixed(1)} km`;
    }

    return `${Math.round(
        meters / 100
    ) * 100} m`;
}

function formatCloudLayers(
    clouds: any[]
) {
    if (!Array.isArray(clouds) || !clouds.length) {
        return 'Sin capas informadas';
    }

    return clouds
        .map((cloud) => {
            const cover =
                cloud?.cover || '—';

            const base =
                cloud?.base_ft !== null &&
                cloud?.base_ft !== undefined
                    ? `${cloud.base_ft} ft`
                    : '';

            const type =
                cloud?.type
                    ? ` ${cloud.type}`
                    : '';

            return `${cover}${type}${base ? ` ${base}` : ''}`;
        })
        .join(' · ');
}

function formatAviationWeather(
    value?: string
) {
    if (!value) {
        return 'Sin fenómeno informado';
    }

    const translations: Record<string, string> = {
        TSRA: 'Tormenta con lluvia',
        '-TSRA': 'Tormenta débil con lluvia',
        '+TSRA': 'Tormenta fuerte con lluvia',
        RA: 'Lluvia',
        '-RA': 'Lluvia débil',
        '+RA': 'Lluvia fuerte',
        DZ: 'Llovizna',
        '-DZ': 'Llovizna débil',
        '+DZ': 'Llovizna fuerte',
        BR: 'Neblina',
        FG: 'Niebla',
        HZ: 'Bruma',
        SHRA: 'Chaparrones de lluvia',
        '-SHRA': 'Chaparrones débiles',
        '+SHRA': 'Chaparrones fuertes',
        SN: 'Nieve',
        '-SN': 'Nieve débil',
        '+SN': 'Nieve fuerte',
        TS: 'Tormenta',
    };

    const normalized =
        value.trim().toUpperCase();

    return (
        translations[normalized] ||
        normalized
    );
}

function formatTafChange(
    change?: string
) {
    const value =
        (change || 'BASE').toUpperCase();

    const labels: Record<string, string> = {
        BASE: 'Base',
        TEMPO: 'TEMPO',
        BECMG: 'BECMG',
        FM: 'FM',
    };

    return labels[value] || value;
}

function tafChangeClass(
    change?: string
) {
    const value =
        (change || 'BASE').toUpperCase();

    if (value === 'TEMPO') {
        return 'border-amber-500/25 bg-amber-500/10 text-amber-500';
    }

    if (value === 'BECMG') {
        return 'border-blue-500/25 bg-blue-500/10 text-blue-500';
    }

    if (value === 'FM') {
        return 'border-violet-500/25 bg-violet-500/10 text-violet-500';
    }

    return 'border-border bg-surface text-muted';
}

function formatTafPeriod(
    from?: string,
    to?: string
) {
    if (!from && !to) {
        return 'Período no informado';
    }

    if (from && to) {
        return `${formatZuluTime(from)} → ${formatZuluTime(to)}`;
    }

    return formatZuluTime(
        from || to
    );
}

function isTafSegmentOperationallyRelevant(
    segment: any
) {
    const weather =
        String(
            segment?.weather || ''
        ).toUpperCase();

    const visibility =
        segment?.visibility;

    const visibilityMiles =
        visibility === null ||
        visibility === undefined ||
        visibility === '' ||
        String(visibility).includes('+')
            ? null
            : Number(visibility);

    const lowVisibility =
        visibilityMiles !== null &&
        !Number.isNaN(visibilityMiles) &&
        visibilityMiles <
            3.2;

    const gust =
        Number(
            segment?.wind?.gust_kt
        );

    const strongGust =
        !Number.isNaN(gust) &&
        gust >= 20;

    const significantWeather =
        /TS|FG|FZ|SN|GR|GS|SQ/.test(
            weather
        );

    const lowCloud =
        Array.isArray(
            segment?.clouds
        ) &&
        segment.clouds.some(
            (cloud: any) =>
                ['BKN', 'OVC', 'VV'].includes(
                    String(
                        cloud?.cover || ''
                    ).toUpperCase()
                ) &&
                Number(
                    cloud?.base_ft
                ) <= 1000
        );

    return (
        lowVisibility ||
        strongGust ||
        significantWeather ||
        lowCloud
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