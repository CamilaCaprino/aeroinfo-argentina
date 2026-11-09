import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, ChevronDown, ChevronUp, CloudSun, MapPin, Plane, Route, Wind } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleMarker, MapContainer, Polyline, Popup, useMap } from 'react-leaflet';
import { latLngBounds } from 'leaflet';
import ArgentinaTileLayer from '../../Components/Map/ArgentinaTileLayer';
import AppLayout from '../../Layouts/AppLayout';

type Aerodromo = {
    id: number;
    slug: string;
    nombre: string;
    tipo?: string | null;
    provincia?: string | null;
    localidad?: string | null;
    designador_oaci?: string | null;
    designador_local?: string | null;
    designador_iata?: string | null;
    latitud?: number | null;
    longitud?: number | null;
    pistas?: Array<{ id: number; designacion?: string | null; superficie?: string | null; largo_m?: number | null }>;
};

type Product = { status?: string; data?: any } | null;
type Notam = {
    number?: string | null;
    indicator?: string | null;
    location_name?: string | null;
    category?: string | null;
    starts_at?: string | null;
    ends_at?: string | null;
    permanent?: boolean;
    text?: { spanish?: string | null; original?: string | null } | null;
};
type AerodromoBriefing = {
    aerodromo: Aerodromo;
    meteorologia?: {
        metar?: Product;
        taf?: Product;
        observacion?: Product;
        pronostico?: Product;
    };
    notams?: { status?: string; data?: Notam[] | null } | null;
};
type Briefing = {
    generated_at: string;
    origin: AerodromoBriefing | null;
    destination: AerodromoBriefing | null;
    alternate: AerodromoBriefing | null;
};
type Role = 'origin' | 'destination' | 'alternate';
type Props = {
    aerodromos: Aerodromo[];
    filters: Record<Role, string>;
    briefing: Briefing | null;
};

function label(a: Aerodromo) {
    const code = a.designador_oaci || a.designador_local || a.designador_iata;
    return `${code ? `${code} · ` : ''}${a.nombre}${a.provincia ? ` · ${a.provincia}` : ''}`;
}

export default function BriefingIndex({ aerodromos, filters, briefing }: Props) {
    const { t, i18n } = useTranslation();
    const [form, setForm] = useState<Record<Role, string>>({
        origin: filters.origin || '',
        destination: filters.destination || '',
        alternate: filters.alternate || '',
    });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        setForm({
            origin: filters.origin || '',
            destination: filters.destination || '',
            alternate: filters.alternate || '',
        });
    }, [filters.origin, filters.destination, filters.alternate]);

    const submit = () => {
        if (!form.origin || !form.destination || processing) return;
        router.get('/briefing', form, {
            preserveState: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AppLayout>
            <Head title={t('briefing.title')} />
            <section className="border-b border-border bg-background">
                <div className="mx-auto max-w-[86rem] px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 text-primary">
                        <Route size={17} aria-hidden="true" />
                        <p className="section-eyebrow">{t('briefing.eyebrow')}</p>
                    </div>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                        {t('briefing.title')}
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-base">
                        {t('briefing.description')}
                    </p>
                </div>
            </section>

            <div className="mx-auto w-full max-w-[86rem] px-4 py-6 sm:px-6 lg:px-8">
                <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-6">
                    <div className="grid gap-4 lg:grid-cols-3">
                        {(['origin', 'destination', 'alternate'] as Role[]).map((role) => (
                            <AerodromoPicker
                                key={role}
                                role={role}
                                optional={role === 'alternate'}
                                value={form[role]}
                                options={aerodromos}
                                onChange={(slug) => setForm((prev) => ({ ...prev, [role]: slug }))}
                            />
                        ))}
                    </div>
                    <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="max-w-3xl text-xs leading-5 text-muted">{t('briefing.disclaimer')}</p>
                        <button
                            type="button"
                            onClick={submit}
                            disabled={!form.origin || !form.destination || processing}
                            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Plane size={16} aria-hidden="true" />
                            {processing ? t('briefing.generating') : t('briefing.generate')}
                            <ArrowRight size={15} aria-hidden="true" />
                        </button>
                    </div>
                </section>

                {briefing && (
                    <section className="mt-7 space-y-5" aria-label={t('briefing.result')}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-2xl font-semibold text-foreground">{t('briefing.result')}</h2>
                            <span className="text-xs text-muted">
                                {new Date(briefing.generated_at).toLocaleString(i18n.language)}
                            </span>
                        </div>
                        <RouteOverview briefing={briefing} />
                        {(['origin', 'destination', 'alternate'] as Role[]).map((role) =>
                            briefing[role] ? (
                                <BriefingCard key={role} role={role} data={briefing[role]!} />
                            ) : null
                        )}
                        <p className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-4 text-xs leading-6 text-muted">
                            {t('briefing.disclaimer')}
                        </p>
                    </section>
                )}
            </div>
        </AppLayout>
    );
}

type RoutePoint = {
    role: Role;
    name: string;
    code: string;
    position: [number, number];
};

/** This is a geodesic estimate between two points, NOT a proposed flight route. */
function greatCircleKm(a: [number, number], b: [number, number]): number {
    const radiusKm = 6371.0088;
    const radians = (degrees: number) => degrees * Math.PI / 180;
    const latitudeDifference = radians(b[0] - a[0]);
    const longitudeDifference = radians(b[1] - a[1]);
    const value = Math.sin(latitudeDifference / 2) ** 2 +
        Math.cos(radians(a[0])) * Math.cos(radians(b[0])) *
        Math.sin(longitudeDifference / 2) ** 2;
    return 2 * radiusKm * Math.asin(Math.min(1, Math.sqrt(value)));
}

function toRoutePoint(role: Role, entry: AerodromoBriefing | null): RoutePoint | null {
    if (!entry?.aerodromo) return null;
    const a = entry.aerodromo;
    if (a.latitud == null || a.longitud == null) return null;
    const latitude = Number(a.latitud);
    const longitude = Number(a.longitud);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
        latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;
    return {
        role,
        name: a.nombre,
        code: a.designador_oaci || a.designador_local || a.designador_iata || a.nombre,
        position: [latitude, longitude],
    };
}

function FitRouteBounds({ points }: { points: RoutePoint[] }) {
    const map = useMap();
    useEffect(() => {
        if (points.length < 2) return;
        const bounds = latLngBounds(points.map((point) => point.position));
        map.fitBounds(bounds, { padding: [36, 36], maxZoom: 8, animate: false });
    }, [map, points]);
    return null;
}

function RouteOverview({ briefing }: { briefing: Briefing }) {
    const { t, i18n } = useTranslation();
    const origin = toRoutePoint('origin', briefing.origin);
    const destination = toRoutePoint('destination', briefing.destination);
    const alternate = toRoutePoint('alternate', briefing.alternate);
    const points = useMemo(() => [origin, destination, alternate].filter((p): p is RoutePoint => p !== null),
        [origin?.code, origin?.position[0], origin?.position[1], destination?.code,
            destination?.position[0], destination?.position[1], alternate?.code,
            alternate?.position[0], alternate?.position[1]]);

    const mainDistance = origin && destination
        ? greatCircleKm(origin.position, destination.position) : null;
    const alternateDistance = destination && alternate
        ? greatCircleKm(destination.position, alternate.position) : null;
    const formattedDistance = (km: number) =>
        `${km.toLocaleString(i18n.language, { maximumFractionDigits: 0 })} km · ${(km / 1.852).toLocaleString(i18n.language, { maximumFractionDigits: 0 })} NM`;

    return (
        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <div className="border-b border-border p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="section-eyebrow">{t('briefing.routeOverview')}</p>
                        <h3 className="mt-1 text-lg font-semibold text-foreground">
                            {briefing.origin?.aerodromo?.nombre || '—'}
                            <span className="mx-2 text-primary" aria-hidden="true">→</span>
                            {briefing.destination?.aerodromo?.nombre || '—'}
                        </h3>
                        {briefing.alternate && (
                            <p className="mt-1 text-sm text-muted">
                                {t('briefing.alternate')}: {briefing.alternate.aerodromo.nombre}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {mainDistance !== null && (
                            <span className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground">
                                {t('briefing.directDistance')}: {formattedDistance(mainDistance)}
                            </span>
                        )}
                        {alternateDistance !== null && (
                            <span className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground">
                                {t('briefing.destinationToAlternate')}: {formattedDistance(alternateDistance)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {origin && destination ? (
                <div className="relative h-[330px] w-full sm:h-[420px] lg:h-[480px]">
                    <MapContainer
                        center={origin.position}
                        zoom={5}
                        scrollWheelZoom={false}
                        className="h-full w-full"
                    >
                        <ArgentinaTileLayer variant="color" />
                        <FitRouteBounds points={points} />
                        <Polyline positions={[origin.position, destination.position]} pathOptions={{ color: '#2563eb', weight: 3, opacity: 0.85 }} />
                        {alternate && (
                            <Polyline
                                positions={[destination.position, alternate.position]}
                                pathOptions={{ color: '#d97706', weight: 2.5, opacity: 0.9, dashArray: '7 8' }}
                            />
                        )}
                        {points.map((point) => (
                            <CircleMarker
                                key={point.role}
                                center={point.position}
                                radius={8}
                                pathOptions={{
                                    color: '#ffffff',
                                    weight: 2,
                                    fillOpacity: 1,
                                    fillColor: point.role === 'alternate' ? '#d97706' : '#2563eb',
                                }}
                            >
                                <Popup>
                                    <div className="text-sm">
                                        <strong>{t(`briefing.${point.role}`)} · {point.code}</strong>
                                        <div>{point.name}</div>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                </div>
            ) : (
                <div className="p-5 text-sm text-muted">{t('briefing.routeNoCoordinates')}</div>
            )}

            <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border px-4 py-3 text-xs text-muted sm:px-5">
                <span><span className="mr-1 inline-block h-2 w-5 rounded bg-blue-600" />{t('briefing.directSegment')}</span>
                {alternate && <span><span className="mr-1 inline-block h-2 w-5 rounded bg-amber-600" />{t('briefing.alternateSegment')}</span>}
                <span className="w-full leading-5">{t('briefing.routeDisclaimer')}</span>
            </div>
        </section>
    );
}

function AerodromoPicker({ role, value, options, onChange, optional }: {
    role: Role;
    value: string;
    options: Aerodromo[];
    onChange: (slug: string) => void;
    optional: boolean;
}) {
    const { t } = useTranslation();
    const selected = useMemo(() => options.find((a) => a.slug === value), [options, value]);
    const [input, setInput] = useState(selected ? label(selected) : '');
    const [focused, setFocused] = useState(false);
    useEffect(() => setInput(selected ? label(selected) : ''), [selected]);

    const matching = useMemo(() => {
        const q = input.trim().toLocaleLowerCase();
        if (!q) return options.slice(0, 8);
        return options.filter((a) => [a.nombre, a.provincia, a.localidad,
            a.designador_oaci, a.designador_local, a.designador_iata]
            .some((part) => String(part || '').toLocaleLowerCase().includes(q)))
            .slice(0, 10);
    }, [input, options]);

    return (
        <div className="relative min-w-0">
            <label htmlFor={`briefing-${role}`} className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                {t(`briefing.${role}`)}{optional ? ` · ${t('briefing.optional')}` : ''}
            </label>
            <input
                id={`briefing-${role}`}
                type="search"
                autoComplete="off"
                value={input}
                placeholder={t('briefing.searchPlaceholder')}
                role="combobox"
                aria-expanded={focused}
                aria-controls={`briefing-${role}-options`}
                onFocus={() => setFocused(true)}
                onBlur={() => window.setTimeout(() => setFocused(false), 120)}
                onChange={(e) => { setInput(e.target.value); onChange(''); setFocused(true); }}
                className="h-12 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            {focused && (
                <div id={`briefing-${role}-options`} role="listbox" className="absolute z-40 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-surface p-1 shadow-xl">
                    {optional && (
                        <button type="button" onMouseDown={(e) => e.preventDefault()}
                            onClick={() => { onChange(''); setInput(''); setFocused(false); }}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted hover:bg-background">
                            {t('briefing.none')}
                        </button>
                    )}
                    {matching.length ? matching.map((a) => (
                        <button key={a.id} type="button" role="option" aria-selected={value === a.slug}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => { onChange(a.slug); setInput(label(a)); setFocused(false); }}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-background">
                            {label(a)}
                        </button>
                    )) : (
                        <p className="px-3 py-3 text-xs text-muted">{t('briefing.noMatches')}</p>
                    )}
                </div>
            )}
        </div>
    );
}

function BriefingCard({ role, data }: { role: Role; data: AerodromoBriefing }) {
    const { t } = useTranslation();
    const a = data.aerodromo;
    const metar = data.meteorologia?.metar;
    const taf = data.meteorologia?.taf;
    const wind = data.meteorologia?.observacion?.data?.wind;
    const n = data.notams;
    const [notamsOpen, setNotamsOpen] = useState(false);
    const notamCount = Array.isArray(n?.data) ? n.data.length : null;
    const hasCoordinates = a.latitud != null && a.longitud != null;

    return (
        <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border bg-background/35 p-4 sm:p-5">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">{t(`briefing.${role}`)}</span>
                        <span className="rounded border border-border px-2 py-0.5 font-mono text-xs text-muted">
                            {a.designador_oaci || a.designador_local || a.designador_iata || '—'}
                        </span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{a.nombre}</h3>
                    <p className="mt-1 text-sm text-muted">{[a.localidad, a.provincia].filter(Boolean).join(' · ')}</p>
                </div>
                <Link href={`/aerodromos/${a.slug}`} className="text-sm font-medium text-primary hover:underline">
                    {t('briefing.openAerodrome')} →
                </Link>
            </header>
            <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-4 sm:p-5">
                <Metric icon={CloudSun} title="METAR" value={productText(metar, t('briefing.unavailable'))} mono />
                <Metric icon={CloudSun} title="TAF" value={productText(taf, t('briefing.unavailable'))} mono />
                <div className="min-w-0 rounded-xl border border-border bg-background/40 p-4">
                    <div className="flex items-center gap-2 text-muted">
                        <Plane size={15} aria-hidden="true" />
                        <span className="text-[11px] font-semibold uppercase tracking-wider">NOTAM</span>
                    </div>
                    <p className="mt-3 text-sm font-medium leading-6 text-foreground">
                        {n?.status === 'ok' && notamCount != null
                            ? t('briefing.notamCount', { count: notamCount })
                            : t('briefing.unavailable')}
                    </p>
                    {n?.status === 'ok' && notamCount !== null && notamCount > 0 && (
                        <button
                            type="button"
                            onClick={() => setNotamsOpen((open) => !open)}
                            aria-expanded={notamsOpen}
                            aria-controls={`briefing-notams-${role}`}
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                        >
                            {notamsOpen ? t('briefing.hideNotams') : t('briefing.showNotams')}
                            {notamsOpen ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
                        </button>
                    )}
                </div>
                <Metric icon={Wind} title={t('briefing.observedWind')} value={wind && data.meteorologia?.observacion?.status === 'ok'
                    ? `${wind.direction_deg == null ? 'VRB' : `${Math.round(Number(wind.direction_deg))}°`} · ${wind.speed_kt == null ? '—' : `${Math.round(Number(wind.speed_kt))} kt`}`
                    : t('briefing.unavailable')} />
            </div>
            {n?.status === 'ok' && notamCount !== null && notamCount > 0 && notamsOpen && (
                <div id={`briefing-notams-${role}`} className="border-t border-border bg-background/20 px-4 py-5 sm:px-5">
                    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <h4 className="text-sm font-semibold text-foreground">{t('briefing.notamDetails')}</h4>
                        <span className="text-xs text-muted">{t('briefing.notamReference')}</span>
                    </div>
                    <div className="grid gap-3 lg:grid-cols-2">
                        {n.data!.map((notam, index) => (
                            <NotamDetail
                                key={`${notam.number || 'notam'}-${index}`}
                                notam={notam}
                            />
                        ))}
                    </div>
                    <a
                        href="https://ais.anac.gob.ar/notam"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex text-xs font-semibold text-primary hover:underline"
                    >
                        {t('briefing.checkNotamsAtSource')} ↗
                    </a>
                </div>
            )}
            {(a.pistas?.length || hasCoordinates) ? (
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border px-4 py-3 text-xs sm:px-5">
                    {!!a.pistas?.length && <span className="text-muted">{t('briefing.runways')}: {a.pistas.map((p) => p.designacion).filter(Boolean).join(', ') || '—'}</span>}
                    {hasCoordinates && (
                        <>
                            <Link href={`/mapa?lat=${a.latitud}&lon=${a.longitud}&zoom=11&selected=${a.slug}`} className="inline-flex items-center gap-1 text-primary hover:underline">
                                <MapPin size={14} aria-hidden="true" /> {t('briefing.map')}
                            </Link>
                            <Link href={`/meteorologia?lat=${a.latitud}&lon=${a.longitud}&zoom=8`} className="inline-flex items-center gap-1 text-primary hover:underline">
                                <Wind size={14} aria-hidden="true" /> {t('briefing.windMap')}
                            </Link>
                        </>
                    )}
                </div>
            ) : null}
        </article>
    );
}

function NotamDetail({ notam }: { notam: Notam }) {
    const { t, i18n } = useTranslation();
    const original = notam.text?.original?.trim() || '';
    const spanish = notam.text?.spanish?.trim() || '';
    const isSpanish = i18n.language.toLowerCase().startsWith('es');
    const primaryText = (isSpanish ? spanish || original : original || spanish);
    const secondaryText = isSpanish ? original : spanish;
    const showSecondary = Boolean(secondaryText && secondaryText !== primaryText);

    return (
        <article className="min-w-0 rounded-xl border border-border bg-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-md border border-border bg-background px-2 py-1 font-mono text-xs font-semibold text-foreground">
                    {notam.number || 'NOTAM'}
                </span>
                {notam.category && (
                    <span className="rounded-md border border-border bg-background/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
                        {t(`notam.${notamCategoryKey(notam.category)}`, { defaultValue: notam.category })}
                    </span>
                )}
            </div>
            {(notam.location_name || notam.indicator) && (
                <p className="mt-2 text-xs text-muted">{notam.location_name || notam.indicator}</p>
            )}
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-border/70 bg-background/40 px-3 py-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted">{t('briefing.notamFrom')}</div>
                    <div className="mt-1 text-xs font-medium text-foreground">{formatNotamDate(notam.starts_at, i18n.language)}</div>
                </div>
                <div className="rounded-lg border border-border/70 bg-background/40 px-3 py-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted">{t('briefing.notamUntil')}</div>
                    <div className="mt-1 text-xs font-medium text-foreground">
                        {notam.permanent ? t('briefing.notamPermanent') : formatNotamDate(notam.ends_at, i18n.language)}
                    </div>
                </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
                {primaryText || t('briefing.notamTextUnavailable')}
            </p>
            {showSecondary && (
                <details className="mt-3 rounded-lg border border-border/70 bg-background/30">
                    <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-primary">
                        {isSpanish ? t('briefing.notamOriginalText') : t('briefing.notamSpanishText')}
                    </summary>
                    <p className="whitespace-pre-wrap break-words border-t border-border/70 px-3 py-3 font-mono text-xs leading-5 text-muted">
                        {secondaryText}
                    </p>
                </details>
            )}
        </article>
    );
}

function notamCategoryKey(category: string): string {
    const keys: Record<string, string> = {
        runway: 'runway', taxiway: 'taxiway', approach_aid: 'approachAid',
        navigation_aid: 'navigationAid', apron: 'apron', obstacle: 'obstacle',
        procedure: 'procedure', other: 'other',
    };
    return keys[category.toLowerCase()] || 'other';
}

function formatNotamDate(value: string | null | undefined, language: string): string {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    const locale = language.startsWith('pt') ? 'pt-BR'
        : language.startsWith('de') ? 'de-DE'
        : language.startsWith('en') ? 'en-US' : 'es-AR';
    return `${new Intl.DateTimeFormat(locale, {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC',
    }).format(date)} UTC`;
}

function productText(product: Product | undefined, fallback: string): string {
    return product?.status === 'ok' ? (product?.data?.raw || fallback) : fallback;
}

function Metric({ icon: Icon, title, value, mono = false }: {
    icon: typeof Wind;
    title: string;
    value: string;
    mono?: boolean;
}) {
    return (
        <div className="min-w-0 rounded-xl border border-border bg-background/40 p-4">
            <div className="flex items-center gap-2 text-muted">
                <Icon size={15} aria-hidden="true" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">{title}</span>
            </div>
            <p className={`mt-3 break-words text-sm leading-6 text-foreground ${mono ? 'font-mono text-xs' : 'font-medium'}`}>
                {value}
            </p>
        </div>
    );
}
