import { Link } from '@inertiajs/react';
import ThemeSelector from '../Components/ThemeSelector';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="sticky top-0 z-50 border-b border-border/85 bg-surface/94 backdrop-blur-xl">
                <div className="mx-auto flex h-[64px] max-w-[86rem] items-center justify-between gap-5 px-5 sm:px-6 lg:px-8">
                    <Link href="/" className="group flex items-center gap-3" aria-label="Aeroinfo Argentina - Inicio">
                        <span className="brand-mark">AR</span>
                        <span className="text-[14px] font-semibold tracking-[-0.012em] text-foreground sm:text-[14.5px]">
                            AEROINFO <span className="text-primary">ARGENTINA</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-4 sm:gap-5">
                        <nav className="hidden items-center gap-7 text-[13px] font-medium text-muted md:flex" aria-label="Navegación principal">
                            <Link className="nav-link" href="/aerodromos">Aeródromos</Link>
                            <Link className="nav-link" href="/mapa">Mapa</Link>
                            <Link className="nav-link" href="/fuentes">Fuentes</Link>
                        </nav>
                        <div className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
                        <ThemeSelector />
                    </div>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-border bg-surface/72">
                <div className="mx-auto grid max-w-[86rem] gap-8 px-5 py-7 text-[0.8rem] sm:px-6 md:grid-cols-[1.55fr_0.9fr_1fr] lg:px-8">
                    <div>
                        <p className="text-[0.82rem] font-semibold text-foreground">Aeroinfo Argentina</p>
                        <p className="mt-1.5 max-w-md leading-[1.55] text-muted">
                            Proyecto independiente de consulta y organización de información aeronáutica pública de Argentina.
                        </p>
                    </div>

                    <div>
                        <p className="footer-label">Datos</p>
                        <p className="mt-1.5 leading-[1.55] text-muted">ANAC / Secretaría de Transporte</p>
                        <p className="text-muted">Septiembre 2026</p>
                    </div>

                    <div>
                        <p className="footer-label">Aviso</p>
                        <p className="mt-1.5 max-w-sm leading-[1.55] text-muted">
                            No sustituye publicaciones aeronáuticas oficiales ni información previa al vuelo.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
