import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';

import AppLayout from '../../Layouts/AppLayout';
import i18n from '../../i18n';

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
    const { t } = useTranslation();

    const primaryCode =
        a.designador_oaci ||
        a.designador_local ||
        a.designador_iata ||
        t('show.noPublishedCode');

    const coordinatesAvailable =
        a.latitud !== null &&
        a.latitud !== undefined &&
        a.longitud !== null &&
        a.longitud !== undefined;

    return (
        <AppLayout>
            <Head title={a.nombre} />

            <div className="mx-auto max-w-[86rem] px-4 pb-10 pt-7 sm:px-6 md:pb-12 md:pt-10 lg:px-8">
                <div className="mb-6">
                    <Link
                        href="/aerodromos"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-foreground"
                    >
                        ← {t('common.backToList')}
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
                                    t('show.locationNotReported')}
                            </p>
                        </div>

                        {coordinatesAvailable && (
                            <div className="flex flex-wrap gap-2">
                                <Link
                                    href={`/mapa?lat=${a.latitud}&lon=${a.longitud}&zoom=11&selected=${a.slug}`}
                                    className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium transition hover:bg-background"
                                >
                                    {t('show.viewNationalMap')}
                                </Link>
                            </div>
                        )}
                    </div>
                </header>

                <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
                    <div className="space-y-6">
                        <Section
                            eyebrow={t('aerodrome.mainInformation')}
                            title={t('aerodrome.identification')}
                        >
                            <div className="grid gap-x-8 md:grid-cols-2">
                                <Field
                                    label={t('aerodrome.icaoCode')}
                                    value={a.designador_oaci}
                                    mono
                                />

                                <Field
                                    label={t('aerodrome.iataCode')}
                                    value={a.designador_iata}
                                    mono
                                />

                                <Field
                                    label={t('aerodrome.localCode')}
                                    value={a.designador_local}
                                    mono
                                />

                                <Field
                                    label={t('aerodrome.type')}
                                    value={a.tipo}
                                />

                                <Field
                                    label={t('aerodrome.useTraffic')}
                                    value={a.uso}
                                />

                                <Field
                                    label={t('aerodrome.province')}
                                    value={a.provincia}
                                />
                            </div>
                        </Section>

                        <Section
                            eyebrow={t('weather.section')}
                            title={t('weather.conditionsForecast')}
                        >
                            <MeteorologiaPanel
                                meteorologia={meteorologia}
                            />
                        </Section>

                        <Section
                            eyebrow={t('notam.section')}
                            title={t('notam.title')}
                        >
                            <NotamPanel notams={notams} />
                        </Section>

                        <Section
                            eyebrow={t('aerodrome.infrastructure')}
                            title={t('aerodrome.runways')}
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
                                                        {t('aerodrome.runwayDesignation')}
                                                    </div>

                                                    <div className="mt-1 font-medium">
                                                        {pista.designacion ||
                                                            i18n.t('common.notReported')}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="text-xs uppercase tracking-[0.1em] text-muted">
                                                        {t('aerodrome.surface')}
                                                    </div>

                                                    <div className="mt-1 font-medium">
                                                        {pista.superficie ||
                                                            i18n.t('common.notReported')}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="text-xs uppercase tracking-[0.1em] text-muted">
                                                        {t('aerodrome.length')}
                                                    </div>

                                                    <div className="mt-1 font-medium">
                                                        {pista.largo_m
                                                            ? `${pista.largo_m} m`
                                                            : i18n.t('common.notReported')}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <EmptyState>
                                    {t('show.noRunwayData')}
                                </EmptyState>
                            )}
                        </Section>

                        <Section
                            eyebrow={t('show.traceability')}
                            title={t('nav.sources')}
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
                                                                i18n.t('show.unidentifiedSource')}
                                                        </div>

                                                        <div className="mt-1 text-sm leading-6 text-muted">
                                                            {t('show.consulted')}: {' '}
                                                            {referencia.fecha_consulta ||
                                                                i18n.t('common.notReported')}
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
                                                        {t('show.openSource')} →
                                                    </a>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <EmptyState>
                                    {t('show.noReferences')}
                                </EmptyState>
                            )}
                        </Section>
                    </div>

                    <aside className="space-y-6">
                        <Section
                            eyebrow={t('show.georeference')}
                            title={t('common.location')}
                        >
                            <Field
                                label={t('show.latitude')}
                                value={a.latitud}
                                mono
                            />

                            <Field
                                label={t('show.longitude')}
                                value={a.longitud}
                                mono
                            />

                            <Field
                                label={t('show.elevation')}
                                value={
                                    a.elevacion_m !== null &&
                                    a.elevacion_m !== undefined
                                        ? `${a.elevacion_m} m`
                                        : null
                                }
                            />

                            <Field
                                label={t('show.validationStatus')}
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
                                                                    i18n.t('show.noPublishedCode')}
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
                                            {t('show.openOpenStreetMap')} →
                                        </a>

                                        <Link
                                            href={`/mapa?lat=${a.latitud}&lon=${a.longitud}&zoom=11&selected=${a.slug}`}
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            {t('show.viewNationalMap')} →
                                        </Link>
                                    </div>
                                </>
                            )}
                        </Section>

                        <div className="rounded-2xl border border-border bg-surface p-5">
                            <div className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
                                {t('show.notice')}
                            </div>

                            <p className="mt-3 text-sm leading-6 text-muted">
                                {t('show.noticeText')}
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
                {i18n.t('show.notam.noData')}
            </EmptyState>
        );
    }

    if (notams.status === 'no_indicator') {
        return (
            <EmptyState>
                {i18n.t('show.notam.noIndicator')}
            </EmptyState>
        );
    }

    if (notams.status === 'disabled') {
        return (
            <EmptyState>
                {i18n.t('show.notam.disabled')}
            </EmptyState>
        );
    }

    if (notams.status === 'error') {
        return (
            <EmptyState>
                {i18n.t('show.notam.error')}
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
                {i18n.t('show.notam.noAerodromeData')}
            </EmptyState>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="text-sm font-semibold">
                        {rows.length
                            ? i18n.t('notam.active', { count: rows.length })
                            : i18n.t('show.notam.noneActive')}
                    </div>

                    <p className="mt-1 max-w-3xl text-sm leading-6 text-muted">
                        {i18n.t('show.notam.descriptionStart')}{' '}
                        <span className="font-mono font-medium text-foreground">
                            {notams.indicator || '—'}
                        </span>
                        . {i18n.t('show.notam.descriptionEnd')}
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
                    {i18n.t('show.notam.noneForIndicator')}
                </EmptyState>
            )}

            <div className="flex flex-col gap-2 border-t border-border pt-4 text-xs leading-5 text-muted sm:flex-row sm:items-center sm:justify-between">
                <span>
                    {i18n.t('show.notam.referenceDisclaimer')}
                </span>

                <a
                    href="https://ais.anac.gob.ar/notam"
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 font-medium text-primary hover:underline"
                >
                    {i18n.t('show.notam.openAnac')} →
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
                        i18n.t('show.notam.locationNotReported')}
                </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-surface/40 px-3 py-2.5">
                    <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted">
                        {i18n.t('common.from')}
                    </div>

                    <div className="mt-1 text-sm font-medium">
                        {formatNotamTime(
                            notam.starts_at
                        )}
                    </div>
                </div>

                <div className="rounded-lg border border-border bg-surface/40 px-3 py-2.5">
                    <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted">
                        {i18n.t('common.until')}
                    </div>

                    <div className="mt-1 text-sm font-medium">
                        {notam.permanent
                            ? i18n.t('common.permanent')
                            : formatNotamTime(
                                  notam.ends_at
                              )}
                    </div>
                </div>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-background/65 p-4">
                <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                    {i18n.t('notam.information')}
                </div>

                <p className="mt-2 text-sm font-medium leading-6 text-foreground">
                    {spanish ||
                        original ||
                        i18n.t('show.notam.textNotReported')}
                </p>
            </div>

            {original &&
                spanish &&
                original.trim() !==
                    spanish.trim() && (
                    <details className="mt-3 rounded-lg border border-border bg-background/35">
                        <summary className="cursor-pointer px-3 py-2.5 text-xs font-medium text-primary">
                            {i18n.t('notam.original')}
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
        runway: i18n.t('notam.runway'),
        taxiway: i18n.t('notam.taxiway'),
        approach_aid:
            i18n.t('notam.approachAid'),
        navigation_aid:
            i18n.t('notam.navigationAid'),
        apron: i18n.t('notam.apron'),
        obstacle: i18n.t('notam.obstacle'),
        procedure:
            i18n.t('notam.procedure'),
        other: i18n.t('notam.other'),
    };

    return (
        labels[
            String(
                category || 'other'
            ).toLowerCase()
        ] || i18n.t('notam.other')
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
        return i18n.t('common.notReported');
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
                {i18n.t('show.weather.noData')}
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
                        {i18n.t('show.weather.aeronauticalInformation')}
                    </div>

                    <h3 className="mt-1 text-lg font-semibold">
                        {i18n.t('show.weather.metarTafTitle')}
                    </h3>

                    <p className="mt-1 max-w-3xl text-sm leading-6 text-muted">
                        {i18n.t('show.weather.metarTafDescription')}
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
                        {i18n.t('show.weather.complementaryInformation')}
                    </div>

                    <h3 className="mt-1 text-lg font-semibold">
                        {i18n.t('show.weather.smnEcmwfTitle')}
                    </h3>

                    <p className="mt-1 max-w-3xl text-sm leading-6 text-muted">
                        {i18n.t('show.weather.smnEcmwfDescription')}
                    </p>
                </div>

                <div>
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h4 className="text-base font-semibold">
                                {i18n.t('show.weather.smnObservation')}
                            </h4>

                            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
                                {i18n.t('show.weather.smnDescription')}
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
                            {i18n.t('show.weather.smnError')}
                        </EmptyState>
                    ) : (
                        <EmptyState>
                            {i18n.t('show.weather.smnUnavailable')}
                        </EmptyState>
                    )}
                </div>

                <div className="mt-7 border-t border-border pt-7">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h4 className="text-base font-semibold">
                                {i18n.t('show.weather.ecmwfHourly')}
                            </h4>

                            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
                                {i18n.t('show.weather.ecmwfDescription')}
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
                            {i18n.t('show.weather.forecastError')}
                        </EmptyState>
                    ) : (
                        <EmptyState>
                            {i18n.t('show.weather.forecastUnavailable')}
                        </EmptyState>
                    )}
                </div>
            </div>

            <div className="border-t border-border pt-4 text-xs leading-5 text-muted">
                {i18n.t('show.weather.disclaimer')}
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
                description={i18n.t('show.weather.metarDescription')}
                status="no_icao"
            >
                <EmptyState>
                    {i18n.t('show.weather.metarNoIcao')}
                </EmptyState>
            </AviationProductShell>
        );
    }

    if (metar?.status === 'error') {
        return (
            <AviationProductShell
                title="METAR / SPECI"
                description={i18n.t('show.weather.metarDescription')}
                status="error"
            >
                <EmptyState>
                    {i18n.t('show.weather.metarError')}
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
                description={i18n.t('show.weather.metarDescription')}
                status={metar?.status}
            >
                <EmptyState>
                    {i18n.t('show.weather.metarUnavailable')}
                </EmptyState>
            </AviationProductShell>
        );
    }

    const data = metar.data;

    return (
        <AviationProductShell
            title={`${data.type || 'METAR'} ${data.icao || ''}`.trim()}
            description={i18n.t('show.weather.metarLatest')}
            status={metar.status}
            stale={stale}
            right={
                <FlightCategoryBadge
                    category={data.flight_category}
                />
            }
        >
            <RawAviationMessage
                label={i18n.t('show.weather.originalMessage')}
                value={data.raw}
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <WeatherMetric
                    label={i18n.t('weather.wind')}
                    value={formatAviationWind(
                        data.wind
                    )}
                    emphasis
                />

                <WeatherMetric
                    label={i18n.t('weather.visibility')}
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
                    label={i18n.t('weather.temperature')}
                    value={formatUnit(
                        data.temperature_c,
                        '°C',
                        0
                    )}
                />

                <WeatherMetric
                    label={i18n.t('weather.dewpoint')}
                    value={formatUnit(
                        data.dewpoint_c,
                        '°C',
                        0
                    )}
                />

                <WeatherMetric
                    label={i18n.t('weather.cloud')}
                    value={
                        data.clouds?.length
                            ? formatCloudLayers(
                                  data.clouds
                              )
                            : data.cloud_cover ||
                              i18n.t('show.weather.noCloudLayers')
                    }
                />

                <WeatherMetric
                    label={i18n.t('show.weather.category')}
                    value={
                        data.flight_category ||
                        i18n.t('common.notReported')
                    }
                />

                <WeatherMetric
                    label={i18n.t('weather.observed')}
                    value={formatZuluTime(
                        data.observed_at
                    )}
                />
            </div>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                <span>
                    {i18n.t('common.source')}: {data.source || 'AviationWeather.gov'}
                </span>

                <span>·</span>

                <span>
                    {i18n.t('show.weather.received')}: {formatZuluTime(data.received_at)}
                </span>

                {stale && (
                    <>
                        <span>·</span>
                        <span className="font-medium text-amber-500">
                            {i18n.t('show.weather.reportOlderThanTwoHours')}
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
                description={i18n.t('show.weather.tafDescription')}
                status="no_icao"
            >
                <EmptyState>
                    {i18n.t('show.weather.tafNoIcao')}
                </EmptyState>
            </AviationProductShell>
        );
    }

    if (taf?.status === 'error') {
        return (
            <AviationProductShell
                title="TAF"
                description={i18n.t('show.weather.tafDescription')}
                status="error"
            >
                <EmptyState>
                    {i18n.t('show.weather.tafError')}
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
                description={i18n.t('show.weather.tafDescription')}
                status={taf?.status}
            >
                <EmptyState>
                    {i18n.t('show.weather.tafUnavailable')}
                </EmptyState>
            </AviationProductShell>
        );
    }

    const data = taf.data;

    return (
        <AviationProductShell
            title={`TAF ${data.icao || ''}`.trim()}
            description={i18n.t('show.weather.tafLatest')}
            status={taf.status}
        >
            <RawAviationMessage
                label={i18n.t('show.weather.originalMessage')}
                value={data.raw}
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <WeatherMetric
                    label={i18n.t('show.weather.issued')}
                    value={formatZuluTime(
                        data.issued_at
                    )}
                />

                <WeatherMetric
                    label={i18n.t('show.weather.validFrom')}
                    value={formatZuluTime(
                        data.valid_from
                    )}
                />

                <WeatherMetric
                    label={i18n.t('show.weather.validUntil')}
                    value={formatZuluTime(
                        data.valid_to
                    )}
                />
            </div>

            {Array.isArray(data.segments) &&
            data.segments.length ? (
                <div className="mt-5 space-y-3">
                    <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                        {i18n.t('show.weather.expectedEvolution')}
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
                        {i18n.t('show.weather.noDecodedSegments')}
                    </EmptyState>
                </div>
            )}

            <div className="mt-4 text-xs text-muted">
                {i18n.t('common.source')}: {data.source || 'AviationWeather.gov'}
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
                            {i18n.t('show.weather.conditionToReview')}
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
                    {i18n.t('show.weather.changeExpectedToward')}{' '}
                    <span className="font-medium text-foreground">
                        {formatZuluTime(
                            segment.became_at
                        )}
                    </span>
                </div>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <WeatherMetric
                    label={i18n.t('weather.wind')}
                    value={formatAviationWind(
                        segment.wind
                    )}
                />

                <WeatherMetric
                    label={i18n.t('weather.visibility')}
                    value={formatAviationVisibility(
                        segment.visibility
                    )}
                />

                <WeatherMetric
                    label={i18n.t('show.weather.phenomenon')}
                    value={formatAviationWeather(
                        segment.weather
                    )}
                />

                <WeatherMetric
                    label={i18n.t('show.weather.clouds')}
                    value={
                        segment.clouds?.length
                            ? formatCloudLayers(
                                  segment.clouds
                              )
                            : i18n.t('show.weather.noCloudLayers')
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
                                    ? i18n.t('show.weather.max')
                                    : temp.type === 'MIN'
                                      ? i18n.t('show.weather.min')
                                      : i18n.t('show.weather.temp')}{' '}
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
                    {i18n.t('show.weather.windShearAt')}{' '}
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
                    {i18n.t('show.weather.notDecoded')}: {segment.not_decoded}
                </div>
            )}

            {index === 0 && change === 'BASE' && (
                <div className="mt-3 text-[11px] text-muted">
                    {i18n.t('show.weather.initialTafConditions')}
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
                {value || i18n.t('common.notReported')}
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
                    label={i18n.t('weather.temperature')}
                    value={formatUnit(
                        data.temperature_c,
                        '°C',
                        1
                    )}
                    emphasis
                />

                <WeatherMetric
                    label={i18n.t('weather.humidity')}
                    value={formatUnit(
                        data.humidity_pct,
                        '%',
                        0
                    )}
                />

                <WeatherMetric
                    label={i18n.t('weather.pressure')}
                    value={formatUnit(
                        data.pressure_hpa,
                        'hPa',
                        1
                    )}
                />

                <WeatherMetric
                    label={i18n.t('weather.visibility')}
                    value={formatVisibility(
                        data.visibility_m
                    )}
                />

                <WeatherMetric
                    label={i18n.t('weather.wind')}
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
                            : i18n.t('common.notReported')
                    }
                />

                <WeatherMetric
                    label={i18n.t('weather.dewpoint')}
                    value={formatUnit(
                        data.dewpoint_c,
                        '°C',
                        1
                    )}
                />

                <WeatherMetric
                    label={i18n.t('weather.cloud')}
                    value={formatUnit(
                        data.cloud_cover_pct,
                        '%',
                        0
                    )}
                />

                <WeatherMetric
                    label={i18n.t('show.weather.presentWeather')}
                    value={formatPresentWeather(
                        data.weather?.description
                    )}
                />
            </div>

            <div className="mt-5 rounded-xl border border-border bg-background/45 p-4">
                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <div className="text-[11px] uppercase tracking-[0.1em] text-muted">
                            {i18n.t('show.weather.stationUsed')}
                        </div>

                        <div className="mt-1.5 font-medium">
                            {data.station?.name ||
                                i18n.t('common.notReported')}
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
                            {i18n.t('show.weather.representativeness')}
                        </div>

                        <div className="mt-1.5 font-medium">
                            {association?.label ||
                                i18n.t('common.notReported')}
                        </div>

                        {association?.distance_km !==
                            null &&
                            association?.distance_km !==
                                undefined && (
                                <div className="mt-1 text-xs text-muted">
                                    {i18n.t('show.weather.stationDistance')}: {' '}
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
                        {i18n.t('common.source')}: SMN / WIS2
                    </span>

                    <span>·</span>

                    <span>
                        {i18n.t('weather.observed')}: {' '}
                        {formatObservationTime(
                            data.observed_at
                        )}
                    </span>

                    {stale && (
                        <>
                            <span>·</span>

                            <span className="font-medium text-amber-500">
                                {i18n.t('show.weather.outdatedData')}
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
                {i18n.t('show.weather.noRepresentativeLocalObservation')}
            </div>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                {i18n.t('show.weather.nearestStationPrefix')} {' '}
                <strong className="font-medium text-foreground">
                    {formatNumber(
                        association?.distance_km,
                        1
                    )}{' '}
                    km
                </strong>
                . {i18n.t('show.weather.nearestStationSuffix')}
            </p>

            {association?.station?.name && (
                <div className="mt-4 border-t border-border pt-3 text-xs text-muted">
                    {i18n.t('show.weather.nearestReferenceStation')}: {' '}
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
            <div className="grid gap-3 md:hidden">
                {rows.map((row: any, index: number) => (
                    <div
                        key={`mobile-${row.time}-${index}`}
                        className="rounded-xl border border-border bg-background/40 p-4"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="text-xs uppercase tracking-[0.1em] text-muted">
                                    {i18n.t('show.weather.time')}
                                </div>
                                <div className="mt-1 font-semibold">
                                    {formatForecastTime(row.time)}
                                </div>
                            </div>
                            <div className="text-right text-sm font-medium">
                                {formatWeatherCode(row.weather_code)}
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <WeatherMetric label={i18n.t('weather.temperature')} value={formatUnit(row.temperature_c, '°C', 1)} />
                            <WeatherMetric label={i18n.t('weather.humidity')} value={formatUnit(row.humidity_pct, '%', 0)} />
                            <WeatherMetric label={i18n.t('weather.wind')} value={`${formatDirection(row.wind_direction_deg)} · ${formatUnit(row.wind_speed_kt, 'kt', 1)}`} />
                            <WeatherMetric label={i18n.t('show.weather.gust')} value={formatUnit(row.wind_gust_kt, 'kt', 1)} />
                            <WeatherMetric label={i18n.t('weather.visibility')} value={formatVisibility(row.visibility_m)} />
                            <WeatherMetric label={i18n.t('show.weather.precipitation')} value={formatUnit(row.precipitation_mm, 'mm', 1)} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="hidden overflow-hidden rounded-xl border border-border md:block">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[940px] text-sm">
                        <thead className="bg-background/55">
                            <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.08em] text-muted">
                                <th className="px-4 py-3 font-medium">
                                    {i18n.t('show.weather.time')}
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    {i18n.t('show.weather.condition')}
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    Temp.
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    Hum.
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    {i18n.t('weather.wind')}
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    {i18n.t('show.weather.gust')}
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    {i18n.t('weather.pressure')}
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    {i18n.t('weather.visibility')}
                                </th>

                                <th className="px-4 py-3 font-medium">
                                    {i18n.t('show.weather.precipitation')}
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
                    {i18n.t('common.source')}: Open-Meteo
                </span>

                <span>
                    {i18n.t('show.weather.model')}: {' '}
                    {formatModelName(model)}
                </span>

                <span>
                    {i18n.t('show.weather.horizon12h')}
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
        i18n.t('show.status.noData');

    let className =
        'border-border bg-background/55 text-muted';

    if (stale) {
        text =
            i18n.t('show.status.outdated');

        className =
            'border-amber-500/25 bg-amber-500/10 text-amber-500';
    } else if (status === 'ok') {
        text =
            i18n.t('common.available');

        className =
            'border-emerald-500/25 bg-emerald-500/10 text-emerald-500';
    } else if (status === 'error') {
        text =
            i18n.t('show.status.error');

        className =
            'border-red-500/25 bg-red-500/10 text-red-500';
    } else if (status === 'too_far') {
        text =
            i18n.t('show.status.noLocalObservation');

        className =
            'border-amber-500/25 bg-amber-500/10 text-amber-500';
    } else if (status === 'disabled') {
        text =
            i18n.t('show.status.disabled');
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
        <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5 md:p-6">
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
            : i18n.t('common.notReported')

    return (
        <div className="grid gap-1 border-b border-border py-3 last:border-b-0 sm:grid-cols-[1fr_auto] sm:gap-4">
            <span className="text-sm text-muted">
                {label}
            </span>

            <span
                className={[
                    'text-left text-sm font-medium text-foreground sm:text-right',
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
        return i18n.t('common.notReported');
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
    getIntlLocale(),
        
        {
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone:
                'America/Argentina/Buenos_Aires',
        }
    ).format(date);
}

function getIntlLocale(): string {
    const language =
        i18n.resolvedLanguage ||
        i18n.language ||
        'es';

    if (language.startsWith('de')) {
        return 'de-DE';
    }

    if (language.startsWith('pt')) {
        return 'pt-BR';
    }

    if (language.startsWith('en')) {
        return 'en-US';
    }

    return 'es-AR';
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
    getIntlLocale(),
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
        return i18n.t('common.notReported');
    }

    const number =
        Number(value);

    if (
        Number.isNaN(number)
    ) {
        return i18n.t('common.notReported');
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
        return i18n.t('common.notReported');
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
        i18n.t('common.notReported')
    );
}

function formatPresentWeather(
    value?: string
) {
    if (!value) {
        return i18n.t('common.notReported');
    }

    const translations: Record<
        string,
        string
    > = {
        MIST: i18n.t('show.weather.phenomena.mist'),
        FOG: i18n.t('show.weather.phenomena.fog'),
        RAIN: i18n.t('show.weather.phenomena.rain'),
        DRIZZLE: i18n.t('show.weather.phenomena.drizzle'),
        SNOW: i18n.t('show.weather.phenomena.snow'),
        THUNDERSTORM: i18n.t('show.weather.phenomena.thunderstorm'),
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
        return i18n.t('common.notReported');
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
    getIntlLocale(),
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
        getIntlLocale(),
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
        return i18n.t('common.notReported');
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
        return i18n.t('common.notReported');
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
        return i18n.t('common.notReported');
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
        return i18n.t('show.weather.noCloudLayers');
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
        return i18n.t('show.weather.noPhenomenon');
    }

    const translations: Record<string, string> = {
        TSRA: i18n.t('show.weather.wx.tsra'),
        '-TSRA': i18n.t('show.weather.wx.minusTsra'),
        '+TSRA': i18n.t('show.weather.wx.plusTsra'),
        RA: i18n.t('show.weather.wx.ra'),
        '-RA': i18n.t('show.weather.wx.minusRa'),
        '+RA': i18n.t('show.weather.wx.plusRa'),
        DZ: i18n.t('show.weather.wx.dz'),
        '-DZ': i18n.t('show.weather.wx.minusDz'),
        '+DZ': i18n.t('show.weather.wx.plusDz'),
        BR: i18n.t('show.weather.wx.br'),
        FG: i18n.t('show.weather.wx.fg'),
        HZ: i18n.t('show.weather.wx.hz'),
        SHRA: i18n.t('show.weather.wx.shra'),
        '-SHRA': i18n.t('show.weather.wx.minusShra'),
        '+SHRA': i18n.t('show.weather.wx.plusShra'),
        SN: i18n.t('show.weather.wx.sn'),
        '-SN': i18n.t('show.weather.wx.minusSn'),
        '+SN': i18n.t('show.weather.wx.plusSn'),
        TS: i18n.t('show.weather.wx.ts'),
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
        BASE: i18n.t('show.weather.tafBase'),
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
        return i18n.t('show.weather.periodNotReported');
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
        0: i18n.t('show.weather.codes.clear'),
        1: i18n.t('show.weather.codes.mostlyClear'),
        2: i18n.t('show.weather.codes.partlyCloudy'),
        3: i18n.t('show.weather.codes.overcast'),
        45: i18n.t('show.weather.codes.fog'),
        48: i18n.t('show.weather.codes.rimeFog'),
        51: i18n.t('show.weather.codes.lightDrizzle'),
        53: i18n.t('show.weather.codes.moderateDrizzle'),
        55: i18n.t('show.weather.codes.heavyDrizzle'),
        56: i18n.t('show.weather.codes.lightFreezingDrizzle'),
        57: i18n.t('show.weather.codes.heavyFreezingDrizzle'),
        61: i18n.t('show.weather.codes.lightRain'),
        63: i18n.t('show.weather.codes.moderateRain'),
        65: i18n.t('show.weather.codes.heavyRain'),
        66: i18n.t('show.weather.codes.lightFreezingRain'),
        67: i18n.t('show.weather.codes.heavyFreezingRain'),
        71: i18n.t('show.weather.codes.lightSnow'),
        73: i18n.t('show.weather.codes.moderateSnow'),
        75: i18n.t('show.weather.codes.heavySnow'),
        77: i18n.t('show.weather.codes.snowGrains'),
        80: i18n.t('show.weather.codes.lightShowers'),
        81: i18n.t('show.weather.codes.moderateShowers'),
        82: i18n.t('show.weather.codes.heavyShowers'),
        85: i18n.t('show.weather.codes.lightSnowShowers'),
        86: i18n.t('show.weather.codes.heavySnowShowers'),
        95: i18n.t('show.weather.codes.thunderstorm'),
        96: i18n.t('show.weather.codes.thunderstormHail'),
        99: i18n.t('show.weather.codes.severeThunderstormHail'),
    };

    return (
        labels[value] ||
        i18n.t('show.weather.noDescription')
    );
}