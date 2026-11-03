import {
    Head,
    usePage,
} from '@inertiajs/react';

import {
    ExternalLink,
    Info,
    Wind,
} from 'lucide-react';

import { useTranslation } from 'react-i18next';

import AppLayout from '../Layouts/AppLayout';

export default function Meteorologia() {
    const { t } = useTranslation();

    const { url } = usePage();

    const queryString =
        url.includes('?')
            ? url.split('?')[1]
            : '';

    const query =
        new URLSearchParams(
            queryString
        );

    const queryLat =
        Number(
            query.get('lat')
        );

    const queryLon =
        Number(
            query.get('lon')
        );

    const queryZoom =
        Number(
            query.get('zoom')
        );

    const hasCoordinates =
        Number.isFinite(queryLat) &&
        Number.isFinite(queryLon) &&
        queryLat >= -90 &&
        queryLat <= 90 &&
        queryLon >= -180 &&
        queryLon <= 180;

    const latitude =
        hasCoordinates
            ? queryLat
            : -38.4;

    const longitude =
        hasCoordinates
            ? queryLon
            : -63.6;

    const zoom =
        Number.isFinite(queryZoom) &&
        queryZoom >= 3 &&
        queryZoom <= 12
            ? queryZoom
            : hasCoordinates
                ? 8
                : 4;

    const windyUrl =
    'https://embed.windy.com/embed.html?' +
    new URLSearchParams({
        type: 'map',
        location: 'coordinates',
        metricRain: 'mm',
        metricTemp: '°C',
        metricWind: 'kt',

        zoom:
            String(zoom),

        overlay: 'wind',
        product: 'ecmwf',
        level: 'surface',

        lat:
            String(latitude),

        lon:
            String(longitude),

        detail:
            hasCoordinates
                ? 'true'
                : '',

        detailLat:
            String(latitude),

        detailLon:
            String(longitude),

        marker:
            hasCoordinates
                ? 'true'
                : '',

        message: 'true',
        pressure: 'true',
    }).toString();

    return (
        <AppLayout>
            <Head title={t('weatherMap.pageTitle')} />

            <section className="border-b border-border bg-background">
                <div className="mx-auto max-w-[86rem] px-4 py-8 sm:px-6 md:py-10 lg:px-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <div className="mb-3 flex items-center gap-2">
                                <Wind
                                    size={17}
                                    className="text-primary"
                                    aria-hidden="true"
                                />

                                <p className="section-eyebrow">
                                    {t('weatherMap.eyebrow')}
                                </p>
                            </div>

                            <h1 className="text-balance text-3xl font-semibold tracking-[-0.035em] text-foreground sm:text-4xl md:text-[2.8rem]">
                                {t('weatherMap.title')}
                            </h1>

                            <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-muted">
                                {t('weatherMap.description')}
                            </p>
                        </div>

                        <a
                            href="https://www.windy.com/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex w-fit items-center gap-2 rounded-lg border border-primary/20 bg-primary/[0.06] px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/[0.1]"
                        >
                            {t('weatherMap.openInteractive')}

                            <ExternalLink
                                size={15}
                                aria-hidden="true"
                            />
                        </a>
                    </div>
                </div>
            </section>

            <section className="bg-background">
                <div className="mx-auto max-w-[86rem] px-4 py-5 sm:px-6 md:py-7 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                        <div className="flex flex-col gap-2 border-b border-border px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                            <div>
                                <p className="text-sm font-semibold text-foreground">
                                    {t('weatherMap.mapTitle')}
                                </p>

                                <p className="mt-1 text-xs text-muted">
                                    {t('weatherMap.mapSubtitle')}
                                </p>
                            </div>

                            <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary/[0.06] px-3 py-1.5 text-xs font-medium text-primary">
                                <Wind
                                    size={14}
                                    aria-hidden="true"
                                />

                                {t('weatherMap.surfaceWind')}
                            </div>
                        </div>

                        <div className="relative h-[58vh] min-h-[430px] w-full sm:h-[66vh] sm:min-h-[520px] lg:h-[74vh] lg:min-h-[620px]">
                            <iframe
                                title={t('weatherMap.iframeTitle')}
                                src={windyUrl}
                                className="absolute inset-0 h-full w-full border-0"
                                loading="lazy"
                                allowFullScreen
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex items-start gap-3 rounded-xl border border-border bg-surface/75 p-4">
                        <Info
                            size={17}
                            className="mt-0.5 shrink-0 text-primary"
                            aria-hidden="true"
                        />

                        <div className="text-xs leading-5 text-muted sm:text-[0.8rem]">
                            <p>
                                {t('weatherMap.disclaimer')}
                            </p>

                            <p className="mt-1">
                                {t('weatherMap.source')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}