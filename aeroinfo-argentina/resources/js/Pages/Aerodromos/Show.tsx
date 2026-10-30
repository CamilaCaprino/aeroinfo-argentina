import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';

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

export default function Show({ aerodromo: a }: any) {
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
                                    .join(' · ') || 'Ubicación no informada'}
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
                            eyebrow="Infraestructura"
                            title="Pistas"
                        >
                            {a.pistas?.length ? (
                                <div className="divide-y divide-border">
                                    {a.pistas.map((pista: any) => (
                                        <div
                                            key={pista.id}
                                            className="grid gap-4 py-4 first:pt-0 last:pb-0 md:grid-cols-[1fr_1fr_1fr]"
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
                                    ))}
                                </div>
                            ) : (
                                <EmptyState>
                                    No hay información de pistas validada asociada
                                    a este registro.
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
                                                            {referencia.fuente
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
                                                        href={referencia.url}
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
                                    No hay referencias asociadas a este registro.
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
                                                    Number(a.latitud),
                                                    Number(a.longitud),
                                                ]}
                                                zoom={11}
                                                scrollWheelZoom={false}
                                                dragging={true}
                                                zoomControl={true}
                                                className="h-full w-full"
                                            >
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    attribution="&copy; OpenStreetMap contributors"
                                                />

                                                <Marker
                                                    position={[
                                                        Number(a.latitud),
                                                        Number(a.longitud),
                                                    ]}
                                                    icon={detailMarkerIcon}
                                                >
                                                    <Popup>
                                                        <div className="min-w-[170px]">
                                                            <div className="text-sm font-semibold text-slate-900">
                                                                {a.nombre}
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
                                Esta ficha organiza información aeronáutica
                                pública para consulta. No sustituye publicaciones
                                aeronáuticas aplicables ni información previa al
                                vuelo.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}

function Section({
    eyebrow,
    title,
    children,
}: {
    eyebrow?: string;
    title: string;
    children: React.ReactNode;
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
                    mono ? 'font-mono' : '',
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
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-dashed border-border bg-background/35 px-4 py-5 text-sm leading-6 text-muted">
            {children}
        </div>
    );
}