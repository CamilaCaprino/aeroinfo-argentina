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
                    className="airport-ambient argentina-hero-ambient"
                    aria-hidden="true"
                >
                    <div className="aeroinfo-grid absolute inset-0 opacity-30" />

                    <div className="argentina-band argentina-band-top" />
                    <div className="argentina-band argentina-band-middle" />
                    <div className="argentina-band argentina-band-bottom" />

                    <div className="airport-glow airport-glow-a" />
                    <div className="airport-glow airport-glow-b" />

                    <ArgentinaHeroGraphic />

                    <div className="airport-radar argentina-radar-secondary">
                        <span className="airport-radar-ring airport-radar-ring-1" />
                        <span className="airport-radar-ring airport-radar-ring-2" />
                        <span className="airport-radar-ring airport-radar-ring-3" />
                        <span className="airport-radar-sweep" />
                        <span className="airport-radar-core" />
                    </div>
                </div>

                <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 sm:pb-14 sm:pt-16 md:pb-16 md:pt-[5rem] lg:px-8 lg:pb-20 lg:pt-[5.5rem]">
                    <div className="relative z-10 mx-auto max-w-[64rem] text-center">
                        <p className="section-eyebrow argentina-eyebrow">
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

                    <div className="search-panel relative z-10 mx-auto mt-8 max-w-[56rem] sm:mt-9">
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
                        <div className="status-panel relative z-10 mx-auto mt-4 max-w-[56rem]">
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

                    <div className="relative z-10 mx-auto mt-5 grid max-w-[56rem] gap-3 sm:grid-cols-2">
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

function ArgentinaHeroGraphic() {
    const waypoints = [
        {
            x: 1045,
            y: 151,
            code: 'SASA',
        },
        {
            x: 1064,
            y: 235,
            code: 'SACO',
        },
        {
            x: 1014,
            y: 292,
            code: 'SAME',
        },
        {
            x: 1118,
            y: 315,
            code: 'SAEZ',
        },
        {
            x: 1043,
            y: 410,
            code: 'SAZS',
        },
        {
            x: 1035,
            y: 520,
            code: 'SAWH',
        },
    ];

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <svg
                viewBox="0 0 1440 720"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 h-full w-full"
            >
                <defs>
                    <linearGradient
                        id="argentinaFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="0%"
                            stopColor="#9bd7f4"
                            stopOpacity=".22"
                        />

                        <stop
                            offset="55%"
                            stopColor="#74acdf"
                            stopOpacity=".12"
                        />

                        <stop
                            offset="100%"
                            stopColor="#3a88b8"
                            stopOpacity=".04"
                        />
                    </linearGradient>

                    <linearGradient
                        id="argentinaRoute"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                    >
                        <stop
                            offset="0%"
                            stopColor="#74acdf"
                            stopOpacity="0"
                        />

                        <stop
                            offset="45%"
                            stopColor="#9ed8f7"
                            stopOpacity=".8"
                        />

                        <stop
                            offset="100%"
                            stopColor="#74acdf"
                            stopOpacity=".05"
                        />
                    </linearGradient>

                    <radialGradient id="sunGlow">
                        <stop
                            offset="0%"
                            stopColor="#f6b40e"
                            stopOpacity=".18"
                        />

                        <stop
                            offset="45%"
                            stopColor="#f6b40e"
                            stopOpacity=".06"
                        />

                        <stop
                            offset="100%"
                            stopColor="#f6b40e"
                            stopOpacity="0"
                        />
                    </radialGradient>

                    <filter id="argentinaGlow">
                        <feGaussianBlur
                            stdDeviation="6"
                            result="blur"
                        />

                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Sol de Mayo abstracto */}
                <g
                    transform="translate(1090 330)"
                    opacity=".55"
                >
                    <circle
                        r="155"
                        fill="url(#sunGlow)"
                    />

                    {Array.from({
                        length: 24,
                    }).map(
                        (
                            _,
                            index
                        ) => {
                            const angle =
                                index *
                                15;

                            return (
                                <line
                                    key={
                                        index
                                    }
                                    x1="0"
                                    y1="-88"
                                    x2="0"
                                    y2="-132"
                                    stroke="#f6b40e"
                                    strokeOpacity={
                                        index %
                                            2 ===
                                        0
                                            ? '.16'
                                            : '.08'
                                    }
                                    strokeWidth={
                                        index %
                                            2 ===
                                        0
                                            ? 1.4
                                            : 1
                                    }
                                    transform={`rotate(${angle})`}
                                />
                            );
                        }
                    )}

                    <circle
                        r="25"
                        fill="#f6b40e"
                        fillOpacity=".08"
                        stroke="#f6b40e"
                        strokeOpacity=".17"
                    />
                </g>

                {/* Silueta Argentina */}
                <g
                    className="argentina-map-shape"
                    transform="translate(982 75) scale(.78)"
                >
                    <path
                        d="
                            M116 4
                            L143 20
                            L155 48
                            L149 74
                            L166 104
                            L158 134
                            L172 166
                            L158 199
                            L169 230
                            L153 264
                            L159 301
                            L146 337
                            L151 373
                            L134 411
                            L139 451
                            L121 491
                            L116 529
                            L99 568
                            L93 607
                            L76 650
                            L63 689
                            L49 668
                            L43 632
                            L30 594
                            L34 558
                            L23 520
                            L30 485
                            L21 448
                            L32 412
                            L27 376
                            L40 340
                            L36 305
                            L49 270
                            L45 235
                            L59 201
                            L55 169
                            L70 138
                            L69 108
                            L83 80
                            L87 53
                            L102 27
                            Z
                        "
                        fill="url(#argentinaFill)"
                        stroke="#8fd1f2"
                        strokeWidth="2"
                        strokeOpacity=".7"
                        filter="url(#argentinaGlow)"
                    />

                    <path
                        d="M79 135 C108 150 125 164 157 176"
                        fill="none"
                        stroke="#9ed8f7"
                        strokeOpacity=".12"
                    />

                    <path
                        d="M52 270 C89 280 115 290 157 303"
                        fill="none"
                        stroke="#9ed8f7"
                        strokeOpacity=".12"
                    />

                    <path
                        d="M39 403 C78 414 100 420 139 433"
                        fill="none"
                        stroke="#9ed8f7"
                        strokeOpacity=".12"
                    />
                </g>

                {/* Rutas desde el exterior */}
                <path
                    d="M80 560 C330 430 520 330 720 275 C850 238 950 220 1118 315"
                    fill="none"
                    stroke="url(#argentinaRoute)"
                    strokeWidth="1.4"
                    strokeDasharray="8 10"
                />

                <path
                    d="M210 130 C440 185 690 235 1118 315"
                    fill="none"
                    stroke="url(#argentinaRoute)"
                    strokeWidth="1.1"
                    strokeDasharray="5 9"
                />

                <path
                    d="M380 680 C600 520 780 435 1043 410"
                    fill="none"
                    stroke="url(#argentinaRoute)"
                    strokeWidth="1.1"
                />

                {/* Red aérea decorativa interna */}
                <path
                    d="
                        M1045 151
                        C1070 180 1075 205 1064 235
                        C1090 260 1105 285 1118 315
                        C1085 340 1050 370 1043 410
                        C1025 448 1022 485 1035 520
                    "
                    fill="none"
                    stroke="#9ddaf8"
                    strokeOpacity=".55"
                    strokeWidth="1.3"
                    strokeDasharray="6 8"
                />

                <path
                    d="M1014 292 C1060 288 1088 300 1118 315"
                    fill="none"
                    stroke="#9ddaf8"
                    strokeOpacity=".45"
                    strokeWidth="1.2"
                />

                {/* Aeródromos / waypoints decorativos */}
                {waypoints.map(
                    (
                        point
                    ) => (
                        <g
                            key={
                                point.code
                            }
                            transform={`translate(${point.x} ${point.y})`}
                        >
                            <circle
                                r="4"
                                fill="#dff4ff"
                            />

                            <circle
                                r="10"
                                fill="none"
                                stroke="#74acdf"
                                strokeOpacity=".26"
                            />

                            <text
                                x="13"
                                y="4"
                                fill="#9ed8f7"
                                fillOpacity=".55"
                                fontSize="9"
                                fontFamily="monospace"
                                letterSpacing="1"
                            >
                                {
                                    point.code
                                }
                            </text>
                        </g>
                    )
                )}

                {/* Coordenadas gráficas */}
                <text
                    x="60"
                    y="115"
                    fill="#74acdf"
                    fillOpacity=".18"
                    fontSize="10"
                    fontFamily="monospace"
                    letterSpacing="2"
                >
                    34°36&apos;S
                    58°22&apos;W
                </text>

                <text
                    x="1175"
                    y="620"
                    fill="#74acdf"
                    fillOpacity=".18"
                    fontSize="10"
                    fontFamily="monospace"
                    letterSpacing="2"
                >
                    REPÚBLICA ARGENTINA
                </text>
            </svg>
        </div>
    );
}