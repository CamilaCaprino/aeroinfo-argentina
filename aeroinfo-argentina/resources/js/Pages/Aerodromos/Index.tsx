import {
    Head,
    Link,
    router,
} from '@inertiajs/react';

import {
    useMemo,
    useState,
} from 'react';

import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();

    const [filtersOpen, setFiltersOpen] =
        useState(false);

    const [form, setForm] = useState({
        q: filters?.q || '',
        provincia:
            filters?.provincia || '',
        tipo:
            filters?.tipo || '',
    });

    const activeFilterCount =
        useMemo(() => {
            return [
                form.provincia,
                form.tipo,
            ].filter(Boolean).length;
        }, [
            form.provincia,
            form.tipo,
        ]);

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

        setFiltersOpen(false);
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

        setFiltersOpen(false);
    };

    return (
        <AppLayout>
            <Head
                title={t(
                    'aerodromeIndex.pageTitle'
                )}
            />

            <div className="mx-auto max-w-[86rem] px-4 py-7 sm:px-6 md:py-10 lg:px-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                            {t(
                                'aerodromeIndex.eyebrow'
                            )}
                        </div>

                        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                            {t(
                                'aerodromeIndex.title'
                            )}
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted md:text-base">
                            {t(
                                'aerodromeIndex.description'
                            )}
                        </p>
                    </div>

                    <div className="w-fit rounded-xl border border-border bg-surface px-4 py-3 md:text-right">
                        <div className="text-xs uppercase tracking-[0.12em] text-muted">
                            {t(
                                'aerodromeIndex.records'
                            )}
                        </div>

                        <div className="mt-1 text-2xl font-semibold">
                            {aerodromos.total}
                        </div>
                    </div>
                </div>

                <section className="mt-7 rounded-2xl border border-border bg-surface p-4 shadow-sm md:p-5">
                    <div className="flex gap-2">
                        <input
                            className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary"
                            placeholder={t(
                                'aerodromeIndex.searchPlaceholder'
                            )}
                            value={form.q}
                            onChange={(
                                event
                            ) =>
                                setForm({
                                    ...form,
                                    q:
                                        event
                                            .target
                                            .value,
                                })
                            }
                            onKeyDown={(
                                event
                            ) => {
                                if (
                                    event.key ===
                                    'Enter'
                                ) {
                                    apply();
                                }
                            }}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setFiltersOpen(
                                    (
                                        value
                                    ) =>
                                        !value
                                )
                            }
                            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm font-medium transition hover:bg-surface lg:hidden"
                        >
                            {t(
                                'aerodromeIndex.filters'
                            )}

                            {activeFilterCount >
                                0 && (
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                                    {
                                        activeFilterCount
                                    }
                                </span>
                            )}
                        </button>
                    </div>

                    <div
                        className={[
                            'mt-3 gap-3',
                            filtersOpen
                                ? 'grid'
                                : 'hidden',
                            'lg:grid lg:grid-cols-[1fr_1fr_auto_auto]',
                        ].join(' ')}
                    >
                        <select
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none"
                            value={
                                form.provincia
                            }
                            onChange={(
                                event
                            ) =>
                                setForm({
                                    ...form,
                                    provincia:
                                        event
                                            .target
                                            .value,
                                })
                            }
                        >
                            <option value="">
                                {t(
                                    'aerodromeIndex.allProvinces'
                                )}
                            </option>

                            {provincias.map(
                                (
                                    province: string
                                ) => (
                                    <option
                                        key={
                                            province
                                        }
                                        value={
                                            province
                                        }
                                    >
                                        {
                                            province
                                        }
                                    </option>
                                )
                            )}
                        </select>

                        <select
                            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none"
                            value={
                                form.tipo
                            }
                            onChange={(
                                event
                            ) =>
                                setForm({
                                    ...form,
                                    tipo:
                                        event
                                            .target
                                            .value,
                                })
                            }
                        >
                            <option value="">
                                {t(
                                    'aerodromeIndex.allTypes'
                                )}
                            </option>

                            {tipos.map(
                                (
                                    type: string
                                ) => (
                                    <option
                                        key={
                                            type
                                        }
                                        value={
                                            type
                                        }
                                    >
                                        {type}
                                    </option>
                                )
                            )}
                        </select>

                        <button
                            type="button"
                            onClick={apply}
                            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                        >
                            {t(
                                'aerodromeIndex.apply'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={clear}
                            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-surface"
                        >
                            {t(
                                'aerodromeIndex.clear'
                            )}
                        </button>
                    </div>

                    <div className="mt-3 hidden justify-end lg:flex">
                        <button
                            type="button"
                            onClick={apply}
                            className="text-xs font-medium text-primary hover:underline"
                        >
                            {t(
                                'aerodromeIndex.searchAction'
                            )}
                        </button>
                    </div>
                </section>

                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted">
                        {t(
                            'aerodromeIndex.showing',
                            {
                                from:
                                    aerodromos.from ||
                                    0,
                                to:
                                    aerodromos.to ||
                                    0,
                                total:
                                    aerodromos.total,
                            }
                        )}
                    </div>

                    {(filters?.q ||
                        filters?.provincia ||
                        filters?.tipo) && (
                        <div className="text-xs uppercase tracking-[0.12em] text-primary">
                            {t(
                                'aerodromeIndex.activeFilters'
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-4 hidden overflow-hidden rounded-2xl border border-border bg-surface shadow-sm md:block">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left">
                            <thead className="border-b border-border bg-background/55 text-xs uppercase tracking-[0.08em] text-muted">
                                <tr>
                                    <th className="px-5 py-3.5">
                                        {t(
                                            'aerodromeIndex.installation'
                                        )}
                                    </th>

                                    <th className="px-5 py-3.5">
                                        {t(
                                            'aerodromeIndex.code'
                                        )}
                                    </th>

                                    <th className="px-5 py-3.5">
                                        {t(
                                            'aerodromeIndex.type'
                                        )}
                                    </th>

                                    <th className="px-5 py-3.5">
                                        {t(
                                            'aerodromeIndex.province'
                                        )}
                                    </th>

                                    <th className="px-5 py-3.5 text-right">
                                        {t(
                                            'aerodromeIndex.detail'
                                        )}
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {aerodromos.data.map(
                                    (
                                        item: Item
                                    ) => {
                                        const primaryCode =
                                            item.designador_oaci ||
                                            item.designador_local ||
                                            item.designador_iata ||
                                            '—';

                                        return (
                                            <tr
                                                key={
                                                    item.id
                                                }
                                                className="border-b border-border last:border-0 transition hover:bg-background/45"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="font-medium text-foreground">
                                                        {
                                                            item.nombre
                                                        }
                                                    </div>

                                                    <CodeList
                                                        item={
                                                            item
                                                        }
                                                    />
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="rounded-md bg-background px-2 py-1 font-mono text-sm">
                                                        {
                                                            primaryCode
                                                        }
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 text-sm">
                                                    {item.tipo ||
                                                        t(
                                                            'common.notReported'
                                                        )}
                                                </td>

                                                <td className="px-5 py-4 text-sm">
                                                    {item.provincia ||
                                                        t(
                                                            'common.notReported'
                                                        )}
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    <Link
                                                        href={`/aerodromos/${item.slug}`}
                                                        className="text-sm font-medium text-primary hover:underline"
                                                    >
                                                        {t(
                                                            'aerodromeIndex.viewDetails'
                                                        )}{' '}
                                                        →
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-4 grid gap-3 md:hidden">
                    {aerodromos.data.map(
                        (item: Item) => {
                            const primaryCode =
                                item.designador_oaci ||
                                item.designador_local ||
                                item.designador_iata ||
                                '—';

                            return (
                                <Link
                                    key={
                                        item.id
                                    }
                                    href={`/aerodromos/${item.slug}`}
                                    className="rounded-2xl border border-border bg-surface p-4 shadow-sm transition active:scale-[0.995]"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="font-medium leading-5 text-foreground">
                                                {
                                                    item.nombre
                                                }
                                            </div>

                                            <div className="mt-2">
                                                <span className="rounded-md bg-background px-2 py-1 font-mono text-xs font-medium">
                                                    {
                                                        primaryCode
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        <span className="text-lg text-primary">
                                            →
                                        </span>
                                    </div>

                                    <CodeList
                                        item={
                                            item
                                        }
                                    />

                                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3">
                                        <MobileField
                                            label={t(
                                                'aerodromeIndex.type'
                                            )}
                                            value={
                                                item.tipo
                                            }
                                        />

                                        <MobileField
                                            label={t(
                                                'aerodromeIndex.province'
                                            )}
                                            value={
                                                item.provincia
                                            }
                                        />
                                    </div>
                                </Link>
                            );
                        }
                    )}
                </div>

                {aerodromos.data.length ===
                    0 && (
                    <div className="mt-4 rounded-2xl border border-border bg-surface px-6 py-12 text-center">
                        <div className="text-base font-medium">
                            {t(
                                'aerodromeIndex.noResults'
                            )}
                        </div>

                        <div className="mt-2 text-sm text-muted">
                            {t(
                                'aerodromeIndex.noResultsHelp'
                            )}
                        </div>
                    </div>
                )}

                {aerodromos.links.length >
                    3 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                        {aerodromos.links.map(
                            (
                                link: any,
                                index: number
                            ) => (
                                <button
                                    key={
                                        index
                                    }
                                    type="button"
                                    disabled={
                                        !link.url
                                    }
                                    onClick={() =>
                                        link.url &&
                                        router.visit(
                                            link.url,
                                            {
                                                preserveScroll:
                                                    true,
                                            }
                                        )
                                    }
                                    className={[
                                        'min-w-10 rounded-lg border px-3 py-2 text-sm transition',
                                        link.active
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border bg-surface hover:bg-background',
                                        !link.url
                                            ? 'cursor-not-allowed opacity-40'
                                            : '',
                                    ].join(
                                        ' '
                                    )}
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            link.label,
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

function CodeList({
    item,
}: {
    item: Item;
}) {
    return (
        <>
            {(item.designador_oaci ||
                item.designador_iata ||
                item.designador_local) && (
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
                    {item.designador_oaci && (
                        <span>
                            ICAO{' '}
                            {
                                item.designador_oaci
                            }
                        </span>
                    )}

                    {item.designador_iata && (
                        <span>
                            IATA{' '}
                            {
                                item.designador_iata
                            }
                        </span>
                    )}

                    {item.designador_local && (
                        <span>
                            Local{' '}
                            {
                                item.designador_local
                            }
                        </span>
                    )}
                </div>
            )}
        </>
    );
}

function MobileField({
    label,
    value,
}: {
    label: string;
    value?: string;
}) {
    const { t } = useTranslation();

    return (
        <div>
            <div className="text-[10px] uppercase tracking-[0.1em] text-muted">
                {label}
            </div>

            <div className="mt-1 text-sm font-medium">
                {value ||
                    t(
                        'common.notReported'
                    )}
            </div>
        </div>
    );
}