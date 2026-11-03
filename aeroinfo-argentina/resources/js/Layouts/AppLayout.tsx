import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import LanguageSelector from '../Components/LanguageSelector';
import ThemeSelector from '../Components/ThemeSelector';

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { t } = useTranslation();

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);

    function closeMobileMenu() {
        setMobileMenuOpen(false);
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="sticky top-0 z-50 border-b border-border/85 bg-surface/94 backdrop-blur-xl">
                <div className="mx-auto flex h-[64px] max-w-[86rem] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        onClick={closeMobileMenu}
                        className="group flex min-w-0 items-center gap-2.5 sm:gap-3"
                        aria-label="Aeroinfo Argentina"
                    >
                        <span className="brand-mark shrink-0">
                            AR
                        </span>

                        <div className="flex min-w-0 items-center gap-2.5">
                            <div className="min-w-0">
                                <div className="truncate text-[13px] font-semibold tracking-[-0.012em] text-foreground sm:text-[14.5px]">
                                    AEROINFO{' '}
                                    <span className="text-primary">
                                        ARGENTINA
                                    </span>
                                </div>

                                <div
                                    className="mt-1 flex h-[2px] w-full min-w-[94px] overflow-hidden rounded-full opacity-90"
                                    aria-hidden="true"
                                >
                                    <span className="flex-1 bg-[#74acdf]" />
                                    <span className="flex-1 bg-white/80" />
                                    <span className="flex-1 bg-[#74acdf]" />
                                </div>
                            </div>

                            <ArgentinaFlag />
                        </div>
                    </Link>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        <nav
                            className="hidden items-center gap-7 text-[13px] font-medium text-muted lg:flex"
                            aria-label={t(
                                'nav.mainNavigation'
                            )}
                        >
                            <Link
                                className="nav-link"
                                href="/aerodromos"
                            >
                                {t(
                                    'nav.aerodromes'
                                )}
                            </Link>

                            <Link
                                className="nav-link"
                                href="/mapa"
                            >
                                {t('nav.map')}
                            </Link>

                            <Link
                                href="/meteorologia"
                                className="nav-link"
                            >
                                {t('nav.weather')}
                            </Link>

                            <Link
                                className="nav-link"
                                href="/fuentes"
                            >
                                {t(
                                    'nav.sources'
                                )}
                            </Link>
                        </nav>

                        <div
                            className="hidden h-5 w-px bg-border lg:block"
                            aria-hidden="true"
                        />

                        <LanguageSelector />

                        <ThemeSelector />

                        <button
                            type="button"
                            onClick={() =>
                                setMobileMenuOpen(
                                    (value) =>
                                        !value
                                )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/45 text-foreground transition hover:bg-background lg:hidden"
                            aria-label={
                                mobileMenuOpen
                                    ? t(
                                          'nav.closeMenu'
                                      )
                                    : t(
                                          'nav.openMenu'
                                      )
                            }
                            aria-expanded={
                                mobileMenuOpen
                            }
                        >
                            {mobileMenuOpen ? (
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M6 6L18 18M18 6L6 18"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M4 7H20M4 12H20M4 17H20"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="border-t border-border bg-surface lg:hidden">
                        <nav
                            className="mx-auto flex max-w-[86rem] flex-col px-4 py-3 sm:px-6"
                            aria-label={t(
                                'nav.mobileNavigation'
                            )}
                        >
                            <MobileNavLink
                                href="/aerodromos"
                                onClick={
                                    closeMobileMenu
                                }
                            >
                                {t(
                                    'nav.aerodromes'
                                )}
                            </MobileNavLink>

                            <MobileNavLink
                                href="/mapa"
                                onClick={
                                    closeMobileMenu
                                }
                            >
                                {t('nav.map')}
                            </MobileNavLink>

                            <MobileNavLink
                                href="/meteorologia"
                                onClick={() =>
                                    setMobileMenuOpen(false)
                                }
                            >
                                {t('nav.weather')}
                            </MobileNavLink>

                            <MobileNavLink
                                href="/fuentes"
                                onClick={
                                    closeMobileMenu
                                }
                            >
                                {t(
                                    'nav.sources'
                                )}
                            </MobileNavLink>
                        </nav>
                    </div>
                )}
            </header>

            <main className="min-w-0 flex-1">
                {children}
            </main>

            <footer className="border-t border-border bg-surface/72">
                <div className="mx-auto grid max-w-[86rem] gap-7 px-4 py-7 text-[0.8rem] sm:px-6 md:grid-cols-2 lg:grid-cols-[1.55fr_0.9fr_1fr] lg:px-8">
                    <div className="md:col-span-2 lg:col-span-1">
                        <p className="text-[0.82rem] font-semibold text-foreground">
                            Aeroinfo Argentina · 2026
                        </p>

                        <p className="mt-1.5 max-w-md leading-[1.55] text-muted">
                            {t(
                                'footer.reference'
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="footer-label">
                            {t(
                                'footer.data'
                            )}
                        </p>

                        <p className="mt-1.5 leading-[1.55] text-muted">
                            ANAC / Secretaría de
                            Transporte
                        </p>

                        <p className="text-muted">
                            {t(
                                'footer.dataDate'
                            )}
                        </p>
                    </div>

                    <div className="text-xs text-slate-500 lg:text-right">
                        <p className="leading-5">
                            {t(
                                'footer.independentProject'
                            )}
                            {' · '}
                            {t(
                                'footer.designDevelopment'
                            )}
                            :
                            <span className="ml-1 font-medium text-slate-300">
                                Camila Caprino
                            </span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function ArgentinaFlag() {
    return (
        <span
            className="relative hidden h-[18px] w-[28px] shrink-0 overflow-hidden rounded-[3px] border border-border/70 shadow-sm sm:inline-flex"
            aria-hidden="true"
        >
            <span className="absolute inset-x-0 top-0 h-1/3 bg-[#74acdf]" />
            <span className="absolute inset-x-0 top-1/3 h-1/3 bg-white" />
            <span className="absolute inset-x-0 bottom-0 h-1/3 bg-[#74acdf]" />

            <span className="absolute left-1/2 top-1/2 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f6b40e] shadow-[0_0_3px_rgba(246,180,14,.45)]" />
        </span>
    );
}

function MobileNavLink({
    href,
    children,
    onClick,
}: {
    href: string;
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="border-b border-border/70 px-1 py-3.5 text-sm font-medium text-foreground transition last:border-b-0 hover:text-primary"
        >
            {children}
        </Link>
    );
}