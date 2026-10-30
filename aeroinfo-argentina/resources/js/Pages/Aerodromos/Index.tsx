import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';

type Item = {
    id: number;
    slug: string;
    nombre: string;
    designador_oaci?: string;
    designador_local?: string;
    designador_iata?: string;
    tipo?: string;
    localidad?: string;
    provincia?: string;
};

export default function Index({
    aerodromos,
    filters,
    provincias,
    tipos,
}: any) {
    const [form, setForm] = useState({
        q: filters?.q || '',
        provincia: filters?.provincia || '',
        tipo: filters?.tipo || '',
    });

    const apply = () => {
        router.get(
            '/aerodromos',
            form,
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const clear = () => {
        const empty = {
            q: '',
            provincia: '',
            tipo: '',
        };

        setForm(empty);

        router.get(
            '/aerodromos',
            empty,
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <AppLayout>
            <Head title="Aeródromos y helipuertos" />

            <div className="mx-auto max-w-[86rem] px-5 py-8 sm:px-6 md:py-10 lg:px-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                            Inventario nacional
                        </div>

                        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                            Aeródromos y helipuertos
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted md:text-base">
                            Explorá el inventario cargado desde ANAC / Secretaría de Transporte
                            mediante nombre, códigos y filtros territoriales.
                        </p>
                    </div>

                    <div className="rounded-xl border border-border bg-surface px-4 py-3 text-right">
                        <div className="text-xs uppercase tracking-[0.12em] text-muted">
                            Registros
                        </div>
                        <div className="mt-1 text-2xl font-semibold">
                            {aerodromos.total}
                        </div>
                    </div>
                </div>

                <section className="mt-7 rounded-2xl border border-border bg-surface p-4 shadow-sm md:p-5">
                    <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr_auto_auto]">
                        <input
                            className="rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary"
                            placeholder="Nombre, OACI, IATA o código local"
                            value={form.q}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    q: event.target.value,
                                })
                            }
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    apply();
                                }
                            }}
                        />

                        <select
                            className="rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none"
                            value={form.provincia}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    provincia: event.target.value,
                                })
                            }
                        >
                            <option value="">
                                Todas las provincias
                            </option>

                            {provincias.map((province: string) => (
                                <option
                                    key={province}
                                    value={province}
                                >
                                    {province}
                                </option>
                            ))}
                        </select>

                        <select
                            className="rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none"
                            value={form.tipo}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    tipo: event.target.value,
                                })
                            }
                        >
                            <option value="">
                                Todos los tipos
                            </option>

                            {tipos.map((type: string) => (
                                <option
                                    key={type}
                                    value={type}
                                >
                                    {type}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={apply}
                            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                        >
                            Aplicar
                        </button>

                        <button
                            type="button"
                            onClick={clear}
                            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-surface"
                        >
                            Limpiar
                        </button>
                    </div>
                </section>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted">
                        Mostrando{' '}
                        <span className="font-medium text-foreground">
                            {aerodromos.from || 0}
                        </span>
                        {' – '}
                        <span className="font-medium text-foreground">
                            {aerodromos.to || 0}
                        </span>
                        {' de '}
                        <span className="font-medium text-foreground">
                            {aerodromos.total}
                        </span>
                        {' registros'}
                    </div>

                    {(filters?.q || filters?.provincia || filters?.tipo) && (
                        <div className="text-xs uppercase tracking-[0.12em] text-primary">
                            Filtros activos
                        </div>
                    )}
                </div>

                <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-border bg-background/55 text-xs uppercase tracking-[0.08em] text-muted">
                                <tr>
                                    <th className="px-5 py-3.5">
                                        Instalación
                                    </th>

                                    <th className="px-5 py-3.5">
                                        Código
                                    </th>

                                    <th className="px-5 py-3.5">
                                        Tipo
                                    </th>

                                    <th className="px-5 py-3.5">
                                        Provincia
                                    </th>

                                    <th className="px-5 py-3.5 text-right">
                                        Detalle
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {aerodromos.data.map((item: Item) => {
                                    const primaryCode =
                                        item.designador_oaci
                                        || item.designador_local
                                        || item.designador_iata
                                        || '—';

                                    return (
                                        <tr
                                            key={item.id}
                                            className="border-b border-border last:border-0 transition hover:bg-background/45"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="font-medium text-foreground">
                                                    {item.nombre}
                                                </div>

                                                {(item.designador_oaci
                                                    || item.designador_iata
                                                    || item.designador_local) && (
                                                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted">
                                                        {item.designador_oaci && (
                                                            <span>
                                                                OACI {item.designador_oaci}
                                                            </span>
                                                        )}

                                                        {item.designador_iata && (
                                                            <span>
                                                                IATA {item.designador_iata}
                                                            </span>
                                                        )}

                                                        {item.designador_local && (
                                                            <span>
                                                                Local {item.designador_local}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="rounded-md bg-background px-2 py-1 font-mono text-sm">
                                                    {primaryCode}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-sm">
                                                {item.tipo || 'No informado'}
                                            </td>

                                            <td className="px-5 py-4 text-sm">
                                                {item.provincia || 'No informado'}
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                <Link
                                                    href={`/aerodromos/${item.slug}`}
                                                    className="text-sm font-medium text-primary hover:underline"
                                                >
                                                    Ver ficha →
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {aerodromos.data.length === 0 && (
                        <div className="px-6 py-12 text-center">
                            <div className="text-base font-medium">
                                No encontramos resultados
                            </div>

                            <div className="mt-2 text-sm text-muted">
                                Probá con otro nombre, código o combinación de filtros.
                            </div>
                        </div>
                    )}
                </div>

                {aerodromos.links.length > 3 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                        {aerodromos.links.map(
                            (link: any, index: number) => (
                                <button
                                    key={index}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url
                                        && router.visit(link.url, {
                                            preserveScroll: true,
                                        })
                                    }
                                    className={[
                                        'min-w-10 rounded-lg border px-3 py-2 text-sm transition',
                                        link.active
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border bg-surface hover:bg-background',
                                        !link.url
                                            ? 'cursor-not-allowed opacity-40'
                                            : '',
                                    ].join(' ')}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            )
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}