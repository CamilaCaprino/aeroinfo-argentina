import { Head } from '@inertiajs/react';
import {
    ExternalLink,
    FileSearch,
    ShieldCheck,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import AppLayout from '../Layouts/AppLayout';

export default function Sources({
    sources,
    configuredSources,
}: any) {
    const { t } = useTranslation();

    const list =
        sources.length
            ? sources
            : Object.values(
                  configuredSources
              );

    return (
        <AppLayout>
            <Head
                title={t(
                    'sources.pageTitle'
                )}
            />

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
                <header>
                    <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                        {t(
                            'sources.eyebrow'
                        )}
                    </div>

                    <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                        {t(
                            'sources.title'
                        )}
                    </h1>

                    <p className="mt-4 max-w-3xl text-sm leading-7 text-muted md:text-base">
                        {t(
                            'sources.description'
                        )}
                    </p>
                </header>

                <section className="mt-8 grid gap-4 md:grid-cols-2">
                    {list.map(
                        (
                            source: any,
                            index: number
                        ) => (
                            <article
                                key={
                                    source.id ||
                                    index
                                }
                                className="flex min-w-0 flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/[0.06] text-primary">
                                        <FileSearch
                                            size={
                                                19
                                            }
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <h2 className="break-words text-lg font-semibold leading-snug sm:text-xl">
                                            {source.nombre ||
                                                source.name}
                                        </h2>

                                        <p className="mt-1.5 text-sm leading-6 text-muted">
                                            {source.organismo ||
                                                t('sources.defaultOrganization')}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-auto pt-5">
                                    <a
                                        href={
                                            source.url_referencia ||
                                            source.url
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                                    >
                                        {t(
                                            'sources.openSource'
                                        )}

                                        <ExternalLink
                                            size={
                                                14
                                            }
                                            aria-hidden="true"
                                        />
                                    </a>
                                </div>
                            </article>
                        )
                    )}
                </section>

                <section className="mt-8 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/[0.06] text-primary">
                            <ShieldCheck
                                size={19}
                                aria-hidden="true"
                            />
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-lg font-semibold">
                                {t(
                                    'sources.publicationCriteria'
                                )}
                            </h2>

                            <p className="mt-2 text-sm leading-7 text-muted md:text-base">
                                {t(
                                    'sources.publicationCriteriaText'
                                )}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mt-4 grid gap-4 md:grid-cols-2">
                    <InfoCard
                        title={t(
                            'sources.traceability'
                        )}
                        text={t(
                            'sources.traceabilityText'
                        )}
                    />

                    <InfoCard
                        title={t(
                            'sources.operationalUse'
                        )}
                        text={t(
                            'sources.operationalUseText'
                        )}
                    />
                </section>
            </div>
        </AppLayout>
    );
}

function InfoCard({
    title,
    text,
}: {
    title: string;
    text: string;
}) {
    return (
        <article className="rounded-2xl border border-border bg-surface/65 p-5">
            <h2 className="font-semibold">
                {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
                {text}
            </p>
        </article>
    );
}