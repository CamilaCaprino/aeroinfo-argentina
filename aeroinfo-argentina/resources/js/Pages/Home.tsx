import {
    Head,
    Link,
    router,
} from '@inertiajs/react';

import {
    ArrowRight,
    Database,
    Map,
    Search,
} from 'lucide-react';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import AppLayout from '../Layouts/AppLayout';

export default function Home({
    hasData,
}: {
    hasData: boolean;
}) {
    const { t } = useTranslation();

    const [q, setQ] =
        useState('');

    return (
        <AppLayout>
            <Head
                title={t(
                    'home.pageTitle'
                )}
            />

            <section className="argentina-home-hero">
                {/* Imagen de Argentina */}
                <div
                    className="argentina-home-photo"
                    aria-hidden="true"
                />

                {/* Velos para legibilidad */}
                <div
                    className="argentina-home-overlay"
                    aria-hidden="true"
                />

                <div
                    className="argentina-home-center-glow"
                    aria-hidden="true"
                />

                {/* Cartografía decorativa */}
                <div
                    className="argentina-home-grid"
                    aria-hidden="true"
                />

                <div
                    className="argentina-home-route argentina-home-route-a"
                    aria-hidden="true"
                />

                <div
                    className="argentina-home-route argentina-home-route-b"
                    aria-hidden="true"
                />

                <div
                    className="argentina-home-route argentina-home-route-c"
                    aria-hidden="true"
                />

                {/* Contenido */}
                <div className="relative z-10 mx-auto flex min-h-[580px] max-w-7xl items-center px-4 py-12 sm:px-6 sm:py-16 lg:min-h-[640px] lg:px-8 lg:py-20">
                    <div className="w-full">
                        <div className="argentina-home-content mx-auto max-w-[58rem] text-center">
                            <p className="argentina-home-kicker">
                                {t(
                                    'home.eyebrow'
                                )}
                            </p>

                            <h1 className="argentina-home-title">
                                {t(
                                    'home.title'
                                )}
                            </h1>

                            <p className="argentina-home-description">
                                {t(
                                    'home.description'
                                )}
                            </p>

                            {/* Buscador */}
                            <div className="argentina-search-panel">
                                <form
                                    className="flex flex-col gap-2.5 sm:flex-row"
                                    onSubmit={(
                                        event
                                    ) => {
                                        event.preventDefault();

                                        router.get(
                                            '/aerodromos',
                                            {
                                                q,
                                            }
                                        );
                                    }}
                                >
                                    <label
                                        className="sr-only"
                                        htmlFor="q"
                                    >
                                        {t(
                                            'home.searchLabel'
                                        )}
                                    </label>

                                    <div className="relative min-w-0 flex-1">
                                        <Search
                                            size={
                                                18
                                            }
                                            aria-hidden="true"
                                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                        />

                                        <input
                                            id="q"
                                            value={
                                                q
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setQ(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder={t(
                                                'home.searchPlaceholder'
                                            )}
                                            className="h-[54px] w-full rounded-[0.85rem] border border-slate-300/80 bg-white/90 pl-11 pr-4 text-[0.95rem] text-slate-900 shadow-sm outline-none backdrop-blur-md transition placeholder:text-slate-500 focus:border-[#0b4a8b] focus:ring-4 focus:ring-[#0b4a8b]/10"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-[0.85rem] bg-[#073d72] px-7 text-[0.92rem] font-semibold text-white shadow-[0_8px_24px_rgba(7,61,114,.22)] transition hover:bg-[#0b4a8b] focus-visible:ring-4 focus-visible:ring-[#0b4a8b]/20 sm:w-auto"
                                    >
                                        {t(
                                            'home.search'
                                        )}

                                        <ArrowRight
                                            size={
                                                17
                                            }
                                            aria-hidden="true"
                                        />
                                    </button>
                                </form>

                                <div className="mt-3 flex flex-col gap-1 border-t border-slate-300/60 pt-3 text-[0.72rem] text-slate-600 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-5 sm:text-[0.78rem]">
                                    <span>
                                        {t(
                                            'home.dataProvider'
                                        )}
                                    </span>

                                    <span>
                                        {t(
                                            'home.dataUpdate'
                                        )}
                                    </span>
                                </div>
                            </div>

                            {!hasData && (
                                <div className="argentina-status-panel">
                                    <div className="flex items-start gap-3.5">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.7rem] bg-[#74acdf]/15 text-[#0b4a8b]">
                                            <Database
                                                size={
                                                    18
                                                }
                                                aria-hidden="true"
                                            />
                                        </div>

                                        <div className="min-w-0 pt-0.5 text-left">
                                            <p className="text-[0.92rem] font-semibold text-slate-900">
                                                {t(
                                                    'home.databasePending'
                                                )}
                                            </p>

                                            <p className="mt-1 text-[0.82rem] leading-[1.55] text-slate-600">
                                                {t(
                                                    'home.databasePendingDescription'
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Accesos rápidos */}
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <Link
                                    href="/aerodromos"
                                    className="argentina-quick-card group"
                                >
                                    <div className="min-w-0 text-left">
                                        <p className="argentina-quick-kicker">
                                            {t(
                                                'home.directory'
                                            )}
                                        </p>

                                        <p className="mt-1 text-[0.96rem] font-semibold tracking-[-0.012em] text-slate-900">
                                            {t(
                                                'home.exploreAerodromes'
                                            )}
                                        </p>
                                    </div>

                                    <span className="argentina-quick-icon">
                                        <ArrowRight
                                            size={
                                                17
                                            }
                                            aria-hidden="true"
                                            className="transition-transform group-hover:translate-x-0.5"
                                        />
                                    </span>
                                </Link>

                                <Link
                                    href="/mapa"
                                    className="argentina-quick-card group"
                                >
                                    <div className="min-w-0 text-left">
                                        <p className="argentina-quick-kicker">
                                            {t(
                                                'home.territorialView'
                                            )}
                                        </p>

                                        <p className="mt-1 text-[0.96rem] font-semibold tracking-[-0.012em] text-slate-900">
                                            {t(
                                                'home.openMap'
                                            )}
                                        </p>
                                    </div>

                                    <span className="argentina-quick-icon">
                                        <Map
                                            size={
                                                17
                                            }
                                            aria-hidden="true"
                                            className="transition-transform group-hover:scale-105"
                                        />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Franja inferior inspirada en bandera */}
                <div
                    className="argentina-hero-flagline"
                    aria-hidden="true"
                >
                    <span />
                    <span />
                    <span />
                </div>
            </section>
        </AppLayout>
    );
}