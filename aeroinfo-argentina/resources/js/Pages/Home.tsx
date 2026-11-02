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

            <section className="aeroinfo-hero relative overflow-hidden border-b border-border/80 bg-background">
                <div
                    className="airport-ambient"
                    aria-hidden="true"
                >
                    <div className="aeroinfo-grid absolute inset-0 opacity-45" />
                    <div className="airport-glow airport-glow-a" />
                    <div className="airport-glow airport-glow-b" />
                    <div className="airport-runway airport-runway-main" />
                    <div className="airport-runway airport-runway-secondary" />
                    <div className="airport-taxiway airport-taxiway-a" />
                    <div className="airport-taxiway airport-taxiway-b" />
                    <div className="airport-route airport-route-a" />
                    <div className="airport-route airport-route-b" />

                    <div className="airport-radar">
                        <span className="airport-radar-ring airport-radar-ring-1" />
                        <span className="airport-radar-ring airport-radar-ring-2" />
                        <span className="airport-radar-ring airport-radar-ring-3" />
                        <span className="airport-radar-sweep" />
                        <span className="airport-radar-core" />
                    </div>

                    <span className="airport-flight-dot airport-flight-dot-1" />
                    <span className="airport-flight-dot airport-flight-dot-2" />
                    <span className="airport-flight-dot airport-flight-dot-3" />
                    <span className="airport-flight-dot airport-flight-dot-4" />

                    <span className="airport-beacon airport-beacon-1" />
                    <span className="airport-beacon airport-beacon-2" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14 md:pb-14 md:pt-[4.35rem] lg:px-8">
                    <div className="mx-auto max-w-[64rem] text-center">
                        <p className="section-eyebrow">
                            {t(
                                'home.eyebrow'
                            )}
                        </p>

                        <h1 className="mx-auto mt-4 max-w-[59rem] text-balance text-[2.15rem] font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-[3.25rem] md:text-[3.8rem] lg:text-[4.15rem]">
                            {t(
                                'home.title'
                            )}
                        </h1>

                        <p className="mx-auto mt-5 max-w-[46rem] text-pretty text-[0.95rem] leading-7 text-muted sm:text-[1.05rem]">
                            {t(
                                'home.description'
                            )}
                        </p>
                    </div>

                    <div className="search-panel mx-auto mt-8 max-w-[56rem] sm:mt-9">
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
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                                    size={18}
                                    aria-hidden="true"
                                />

                                <input
                                    id="q"
                                    value={q}
                                    onChange={(
                                        event
                                    ) =>
                                        setQ(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="h-[52px] w-full rounded-[0.8rem] border border-border bg-background/75 pl-11 pr-4 text-[0.95rem] text-foreground transition placeholder:text-muted/75 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                    placeholder={t(
                                        'home.searchPlaceholder'
                                    )}
                                />
                            </div>

                            <button className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[0.8rem] bg-primary px-6 text-[0.92rem] font-semibold text-primary-foreground shadow-sm transition hover:brightness-95 focus-visible:ring-4 focus-visible:ring-primary/20 sm:w-auto">
                                {t(
                                    'home.search'
                                )}

                                <ArrowRight
                                    size={17}
                                    aria-hidden="true"
                                />
                            </button>
                        </form>

                        <div className="mt-3 flex flex-col gap-1 border-t border-border/70 pt-3 text-[0.75rem] text-muted sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-5 sm:text-[0.79rem]">
                            <span>
                                    {t('home.dataProvider')}
                            </span>

                            <span>
                                {t(
                                    'home.dataUpdate'
                                )}
                            </span>
                        </div>
                    </div>

                    {!hasData && (
                        <div className="status-panel mx-auto mt-4 max-w-[56rem]">
                            <div className="flex items-start gap-3.5">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.7rem] border border-primary/10 bg-primary/[0.07] text-primary">
                                    <Database
                                        size={
                                            18
                                        }
                                        aria-hidden="true"
                                    />
                                </div>

                                <div className="min-w-0 pt-0.5">
                                    <p className="text-[0.92rem] font-semibold text-foreground">
                                        {t(
                                            'home.databasePending'
                                        )}
                                    </p>

                                    <p className="mt-1 text-[0.82rem] leading-[1.55] text-muted sm:text-[0.84rem]">
                                        {t(
                                            'home.databasePendingDescription'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mx-auto mt-5 grid max-w-[56rem] gap-3 sm:grid-cols-2">
                        <Link
                            href="/aerodromos"
                            className="action-card group"
                        >
                            <div className="min-w-0">
                                <p className="action-kicker">
                                    {t(
                                        'home.directory'
                                    )}
                                </p>

                                <p className="mt-1 text-[1rem] font-semibold tracking-[-0.012em] text-foreground">
                                    {t(
                                        'home.exploreAerodromes'
                                    )}
                                </p>
                            </div>

                            <span className="action-icon">
                                <ArrowRight
                                    className="transition-transform group-hover:translate-x-0.5"
                                    size={
                                        18
                                    }
                                    aria-hidden="true"
                                />
                            </span>
                        </Link>

                        <Link
                            href="/mapa"
                            className="action-card group"
                        >
                            <div className="min-w-0">
                                <p className="action-kicker">
                                    {t(
                                        'home.territorialView'
                                    )}
                                </p>

                                <p className="mt-1 text-[1rem] font-semibold tracking-[-0.012em] text-foreground">
                                    {t(
                                        'home.openMap'
                                    )}
                                </p>
                            </div>

                            <span className="action-icon">
                                <Map
                                    className="transition-transform group-hover:scale-105"
                                    size={
                                        18
                                    }
                                    aria-hidden="true"
                                />
                            </span>
                        </Link>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}