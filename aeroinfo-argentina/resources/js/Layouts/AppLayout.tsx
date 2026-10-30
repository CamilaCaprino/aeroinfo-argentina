import { Link } from '@inertiajs/react';
import ThemeSelector from '../Components/ThemeSelector';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="sticky top-0 z-50 border-b border-border/85 bg-surface/92 backdrop-blur-xl">
                <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-3" aria-label="Aeroinfo Argentina - Inicio">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-xs font-bold tracking-[0.08em] text-primary">
                            AR
                        </span>
                        <span className="text-[15px] font-semibold tracking-[-0.015em] text-foreground sm:text-base">
                            AEROINFO <span className="text-primary">ARGENTINA</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex" aria-label="Navegación principal">
                            <Link className="nav-link" href="/aerodromos">Aeródromos</Link>
                            <Link className="nav-link" href="/mapa">Mapa</Link>
                            <Link className="nav-link" href="/fuentes">Fuentes</Link>
                        </nav>
                        <div className="h-6 w-px bg-border" aria-hidden="true" />
                        <ThemeSelector />
                    </div>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-border bg-surface/70">
                <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 text-sm sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
                    <div>
                        <p className="font-semibold text-foreground">Aeroinfo Argentina</p>
                        <p className="mt-2 max-w-lg leading-6 text-muted">
                            Proyecto independiente de consulta y organización de información aeronáutica pública de Argentina.
                        </p>
                    </div>

                    <div>
                        <p className="footer-label">Datos</p>
                        <p className="mt-2 leading-6 text-muted">ANAC / Secretaría de Transporte</p>
                        <p className="text-muted">Septiembre 2026</p>
                    </div>

                    <div>
                        <p className="footer-label">Aviso</p>
                        <p className="mt-2 leading-6 text-muted">
                            No sustituye publicaciones aeronáuticas oficiales ni información previa al vuelo.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
