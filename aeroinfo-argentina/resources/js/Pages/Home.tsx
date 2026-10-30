import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Database, Map, Search } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '../Layouts/AppLayout';

export default function Home({ hasData }: { hasData: boolean }) {
    const [q, setQ] = useState('');

    return (
        <AppLayout>
            <Head title="Inicio" />

            <section className="relative overflow-hidden border-b border-border/80 bg-background">
                <div className="aeroinfo-grid absolute inset-0 opacity-55" aria-hidden="true" />
                <div className="absolute left-1/2 top-0 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />

                <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-24 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <p className="section-eyebrow">Información aeronáutica trazable</p>

                        <h1 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.035em] text-foreground sm:text-5xl md:text-6xl lg:text-[4.25rem] lg:leading-[1.04]">
                            Encontrá aeródromos y helipuertos de Argentina
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-muted sm:text-lg">
                            Inventario basado en ANAC / Secretaría de Transporte, con referencias documentales y mapa interactivo.
                        </p>
                    </div>

                    <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-border bg-surface/95 p-3 shadow-[0_18px_60px_rgba(23,32,51,0.08)] backdrop-blur sm:p-4">
                        <form
                            className="flex flex-col gap-3 sm:flex-row"
                            onSubmit={(e) => {
                                e.preventDefault();
                                router.get('/aerodromos', { q });
                            }}
                        >
                            <label className="sr-only" htmlFor="q">
                                Buscar aeródromo o helipuerto
                            </label>

                            <div className="relative min-w-0 flex-1">
                                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={19} aria-hidden="true" />
                                <input
                                    id="q"
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    className="h-14 w-full rounded-xl border border-border bg-background/70 pl-12 pr-4 text-base text-foreground transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                                    placeholder="Nombre, OACI, IATA o código local"
                                />
                            </div>

                            <button className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-primary px-7 font-medium text-primary-foreground shadow-sm transition hover:brightness-95 focus-visible:ring-4 focus-visible:ring-primary/20">
                                Buscar
                                <ArrowRight size={18} aria-hidden="true" />
                            </button>
                        </form>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-muted sm:text-sm">
                            <span>ANAC / Secretaría de Transporte</span>
                            <span>Datos de septiembre 2026</span>
                        </div>
                    </div>

                    {!hasData && (
                        <div className="mx-auto mt-6 max-w-4xl rounded-2xl border border-border bg-surface p-5 sm:p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Database size={20} aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">Base de datos pendiente de importación</p>
                                    <p className="mt-1 text-sm leading-6 text-muted">
                                        La interfaz ya está disponible. Falta ejecutar el proceso documentado de importación ANAC correspondiente a septiembre de 2026.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
                        <Link href="/aerodromos" className="action-card group">
                            <div>
                                <p className="text-sm font-medium text-muted">Directorio</p>
                                <p className="mt-1 text-lg font-semibold text-foreground">Explorar aeródromos</p>
                            </div>
                            <ArrowRight className="text-primary transition-transform group-hover:translate-x-1" size={20} aria-hidden="true" />
                        </Link>

                        <Link href="/mapa" className="action-card group">
                            <div>
                                <p className="text-sm font-medium text-muted">Visualización territorial</p>
                                <p className="mt-1 text-lg font-semibold text-foreground">Abrir mapa interactivo</p>
                            </div>
                            <Map className="text-primary transition-transform group-hover:scale-105" size={21} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
