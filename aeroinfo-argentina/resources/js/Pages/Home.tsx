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
                <div className="aeroinfo-grid absolute inset-0 opacity-45" aria-hidden="true" />
                <div className="absolute left-1/2 top-[-7rem] h-[30rem] w-[52rem] -translate-x-1/2 rounded-full bg-primary/[0.045] blur-3xl" aria-hidden="true" />

                <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-14 sm:px-6 md:pb-14 md:pt-[4.35rem] lg:px-8">
                    <div className="mx-auto max-w-[64rem] text-center">
                        <p className="section-eyebrow">Información aeronáutica trazable</p>

                        <h1 className="mx-auto mt-4 max-w-[59rem] text-balance text-[2.7rem] font-semibold leading-[1.06] tracking-[-0.038em] text-foreground sm:text-[3.25rem] md:text-[3.8rem] lg:text-[4.15rem]">
                            Encontrá aeródromos y helipuertos de Argentina
                        </h1>

                        <p className="mx-auto mt-5 max-w-[46rem] text-pretty text-[0.98rem] leading-7 text-muted sm:text-[1.05rem]">
                            Inventario basado en ANAC / Secretaría de Transporte, con referencias documentales y mapa interactivo.
                        </p>
                    </div>

                    <div className="search-panel mx-auto mt-9 max-w-[56rem]">
                        <form
                            className="flex flex-col gap-2.5 sm:flex-row"
                            onSubmit={(e) => {
                                e.preventDefault();
                                router.get('/aerodromos', { q });
                            }}
                        >
                            <label className="sr-only" htmlFor="q">
                                Buscar aeródromo o helipuerto
                            </label>

                            <div className="relative min-w-0 flex-1">
                                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} aria-hidden="true" />
                                <input
                                    id="q"
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    className="h-[52px] w-full rounded-[0.8rem] border border-border bg-background/75 pl-11 pr-4 text-[0.95rem] text-foreground transition placeholder:text-muted/75 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                    placeholder="Nombre, OACI, IATA o código local"
                                />
                            </div>

                            <button className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[0.8rem] bg-primary px-6 text-[0.92rem] font-semibold text-primary-foreground shadow-sm transition hover:brightness-95 focus-visible:ring-4 focus-visible:ring-primary/20">
                                Buscar
                                <ArrowRight size={17} aria-hidden="true" />
                            </button>
                        </form>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-5 gap-y-1 border-t border-border/70 pt-3 text-[0.75rem] text-muted sm:text-[0.79rem]">
                            <span>ANAC / Secretaría de Transporte</span>
                            <span>Actualización de datos · Septiembre 2026</span>
                        </div>
                    </div>

                    {!hasData && (
                        <div className="status-panel mx-auto mt-4 max-w-[56rem]">
                            <div className="flex items-start gap-3.5">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.7rem] border border-primary/10 bg-primary/[0.07] text-primary">
                                    <Database size={18} aria-hidden="true" />
                                </div>
                                <div className="min-w-0 pt-0.5">
                                    <p className="text-[0.92rem] font-semibold text-foreground">Base de datos pendiente de importación</p>
                                    <p className="mt-1 text-[0.82rem] leading-[1.55] text-muted sm:text-[0.84rem]">
                                        La interfaz ya está disponible. Falta ejecutar el proceso documentado de importación ANAC correspondiente a septiembre de 2026.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mx-auto mt-5 grid max-w-[56rem] gap-3 sm:grid-cols-2">
                        <Link href="/aerodromos" className="action-card group">
                            <div className="min-w-0">
                                <p className="action-kicker">Directorio</p>
                                <p className="mt-1 text-[1rem] font-semibold tracking-[-0.012em] text-foreground">Explorar aeródromos</p>
                            </div>
                            <span className="action-icon">
                                <ArrowRight className="transition-transform group-hover:translate-x-0.5" size={18} aria-hidden="true" />
                            </span>
                        </Link>

                        <Link href="/mapa" className="action-card group">
                            <div className="min-w-0">
                                <p className="action-kicker">Visualización territorial</p>
                                <p className="mt-1 text-[1rem] font-semibold tracking-[-0.012em] text-foreground">Abrir mapa interactivo</p>
                            </div>
                            <span className="action-icon">
                                <Map className="transition-transform group-hover:scale-105" size={18} aria-hidden="true" />
                            </span>
                        </Link>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
