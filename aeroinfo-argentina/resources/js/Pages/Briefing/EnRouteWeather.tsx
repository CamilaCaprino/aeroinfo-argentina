import { CloudSun, RefreshCw, Wind } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Point = [number, number];
type Aerodrome = { nombre: string; latitud?: number | null; longitud?: number | null };
type Entry = { aerodromo: Aerodrome } | null;
type PressureLevel = 'surface' | '925' | '850' | '700' | '500' | '300';
type Hourly = { time?: number[]; [variable: string]: number[] | (number | null)[] | undefined };
type ResponsePoint = { hourly?: Hourly; error?: boolean; reason?: string };
type Weather = { temperature: number | null; cloud: number | null; windSpeed: number | null; windDirection: number | null; geopotentialHeight: number | null; forecastTime: number };
type Sample = { fraction: number; coordinate: Point; eta: number; kmFromOrigin: number };
type WeatherData = { samples: Sample[]; weather: (Weather | null)[]; level: PressureLevel };

const FACTORS = [0.25, 0.5, 0.75];
const RADIUS_KM = 6371.0088;
const LEVELS: { value: PressureLevel; approximate: string }[] = [
    { value: 'surface', approximate: '' },
    { value: '925', approximate: '≈ 2.600 ft' },
    { value: '850', approximate: '≈ 5.000 ft' },
    { value: '700', approximate: '≈ 10.000 ft' },
    { value: '500', approximate: '≈ 18.000 ft' },
    { value: '300', approximate: '≈ 30.000 ft' },
];

function coordinates(entry: Entry): Point | null {
    const lat = entry?.aerodromo?.latitud;
    const lon = entry?.aerodromo?.longitud;
    if (lat == null || lon == null || !Number.isFinite(Number(lat)) || !Number.isFinite(Number(lon))) return null;
    const point: Point = [Number(lat), Number(lon)];
    return Math.abs(point[0]) <= 90 && Math.abs(point[1]) <= 180 ? point : null;
}
const radians = (angle: number) => angle * Math.PI / 180;
const degrees = (angle: number) => angle * 180 / Math.PI;
function vector(p: Point) {
    const phi = radians(p[0]), lambda = radians(p[1]);
    return [Math.cos(phi) * Math.cos(lambda), Math.cos(phi) * Math.sin(lambda), Math.sin(phi)];
}
function arc(a: Point, b: Point) {
    const x = vector(a), y = vector(b);
    return Math.acos(Math.min(1, Math.max(-1, x[0] * y[0] + x[1] * y[1] + x[2] * y[2])));
}
function interpolate(a: Point, b: Point, fraction: number): Point {
    const theta = arc(a, b);
    if (theta < 1e-10) return a;
    const x = vector(a), y = vector(b);
    const ca = Math.sin((1 - fraction) * theta) / Math.sin(theta);
    const cb = Math.sin(fraction * theta) / Math.sin(theta);
    const v = x.map((component, i) => component * ca + y[i] * cb);
    return [degrees(Math.atan2(v[2], Math.hypot(v[0], v[1]))), degrees(Math.atan2(v[1], v[0]))];
}
function nullableNumber(value: unknown): number | null {
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
}
function nearestWeather(point: ResponsePoint, eta: number, level: PressureLevel): Weather | null {
    const hourly = point?.hourly;
    if (point?.error || !hourly?.time?.length) return null;
    let index = -1;
    let delta = Infinity;
    hourly.time.forEach((time, i) => {
        const difference = Math.abs(time - eta);
        if (Number.isFinite(time) && difference < delta) { delta = difference; index = i; }
    });
    if (index < 0 || delta > 5400) return null;
    const suffix = level === 'surface' ? '' : `_${level}hPa`;
    const tempKey = level === 'surface' ? 'temperature_2m' : `temperature${suffix}`;
    const speedKey = level === 'surface' ? 'wind_speed_10m' : `wind_speed${suffix}`;
    const directionKey = level === 'surface' ? 'wind_direction_10m' : `wind_direction${suffix}`;
    const result: Weather = {
        temperature: nullableNumber(hourly[tempKey]?.[index]),
        cloud: nullableNumber(hourly.cloud_cover?.[index]),
        windSpeed: nullableNumber(hourly[speedKey]?.[index]),
        windDirection: nullableNumber(hourly[directionKey]?.[index]),
        geopotentialHeight: level === 'surface' ? null : nullableNumber(hourly[`geopotential_height${suffix}`]?.[index]),
        forecastTime: hourly.time[index],
    };
    // No presentar un punto vacío como pronóstico disponible.
    return result.temperature === null && result.windSpeed === null ? null : result;
}
function utcTime(epoch: number, locale: string): string {
    return new Intl.DateTimeFormat(locale, { timeZone: 'UTC', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(epoch * 1000) + ' UTC';
}
function defaultUtcValue(): string {
    const time = new Date(Date.now() + 2 * 60 * 60 * 1000);
    time.setUTCMinutes(0, 0, 0);
    return time.toISOString().slice(0, 16);
}

export default function EnRouteWeather({ origin, destination }: { origin: Entry; destination: Entry }) {
    const { t, i18n } = useTranslation();
    const [departure, setDeparture] = useState(defaultUtcValue);
    const [speed, setSpeed] = useState('120');
    const [level, setLevel] = useState<PressureLevel>('surface');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [data, setData] = useState<WeatherData | null>(null);
    const controllerRef = useRef<AbortController | null>(null);
    const originPoint = coordinates(origin);
    const destinationPoint = coordinates(destination);
    const distanceNm = originPoint && destinationPoint ? arc(originPoint, destinationPoint) * RADIUS_KM / 1.852 : null;
    const samples = useMemo(() => {
        const departureEpoch = Date.parse(`${departure}:00Z`) / 1000;
        const knots = Number(speed);
        if (!originPoint || !destinationPoint || !distanceNm || !Number.isFinite(departureEpoch) || !Number.isFinite(knots) || knots < 60 || knots > 650) return null;
        return FACTORS.map((fraction) => ({
            fraction,
            coordinate: interpolate(originPoint, destinationPoint, fraction),
            eta: departureEpoch + fraction * distanceNm / knots * 3600,
            kmFromOrigin: fraction * distanceNm * 1.852,
        }));
    }, [originPoint?.[0], originPoint?.[1], destinationPoint?.[0], destinationPoint?.[1], departure, speed, distanceNm]);

    useEffect(() => {
        setData(null);
        setMessage(null);
        controllerRef.current?.abort();
        setLoading(false);
    }, [originPoint?.[0], originPoint?.[1], destinationPoint?.[0], destinationPoint?.[1], departure, speed, level]);
    useEffect(() => () => controllerRef.current?.abort(), []);

    async function consult() {
        if (!samples || !distanceNm) return;
        const now = Date.now() / 1000;
        if (samples[0].eta < now - 3600 || samples[samples.length - 1].eta > now + 9 * 86400) {
            setMessage(t('briefing.enRouteDateRange')); return;
        }
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;
        setLoading(true);
        setMessage(null);
        setData(null);
        try {
            const hourly = level === 'surface'
                ? 'temperature_2m,cloud_cover,wind_speed_10m,wind_direction_10m'
                : `temperature_${level}hPa,cloud_cover,wind_speed_${level}hPa,wind_direction_${level}hPa,geopotential_height_${level}hPa`;
            const params = new URLSearchParams({
                latitude: samples.map((p) => p.coordinate[0].toFixed(5)).join(','),
                longitude: samples.map((p) => p.coordinate[1].toFixed(5)).join(','),
                hourly,
                wind_speed_unit: 'kn',
                timeformat: 'unixtime',
                timezone: 'GMT',
                forecast_days: '10',
            });
            // Los niveles de presión están disponibles en ECMWF IFS 0.25°, no en HRES 9 km.
            if (level !== 'surface') params.set('models', 'ecmwf_ifs025');
            const response = await fetch(`https://api.open-meteo.com/v1/ecmwf?${params.toString()}`, { signal: controller.signal });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const json: unknown = await response.json();
            const points: ResponsePoint[] = Array.isArray(json) ? json : [json as ResponsePoint];
            if (points.length !== samples.length || points.some((point) => point.error)) throw new Error('Invalid API response');
            const weather = samples.map((sample, index) => nearestWeather(points[index], sample.eta, level));
            if (controller.signal.aborted) return;
            setData({ samples, weather, level });
            if (weather.every((item) => item === null)) setMessage(t('briefing.enRouteNoData'));
        } catch (error) {
            if (!controller.signal.aborted) setMessage(t('briefing.enRouteError'));
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    }

    return (
        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <div className="border-b border-border p-4 sm:p-5">
                <div className="flex items-center gap-2 text-primary">
                    <CloudSun size={17} aria-hidden="true" />
                    <p className="section-eyebrow">{t('briefing.enRouteTitle')}</p>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{t('briefing.enRouteDescription')}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
                    <label className="block text-xs font-semibold text-muted">
                        {t('briefing.enRouteDeparture')}
                        <input type="datetime-local" value={departure} step={3600} onChange={(event) => setDeparture(event.target.value)}
                            className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground" />
                    </label>
                    <label className="block text-xs font-semibold text-muted">
                        {t('briefing.enRouteSpeed')}
                        <input type="number" value={speed} min={60} max={650} step={5} onChange={(event) => setSpeed(event.target.value)}
                            className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground" />
                    </label>
                    <label className="block text-xs font-semibold text-muted">
                        {t('briefing.enRouteLevel')}
                        <select value={level} onChange={(event) => setLevel(event.target.value as PressureLevel)}
                            className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground">
                            {LEVELS.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.value === 'surface' ? t('briefing.enRouteSurface') : `${item.value} hPa (${item.approximate})`}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button type="button" onClick={consult} disabled={!samples || loading}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">
                        <RefreshCw size={15} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
                        {loading ? t('briefing.enRouteLoading') : t('briefing.enRouteConsult')}
                    </button>
                </div>
                <p className="mt-3 text-xs leading-5 text-muted">{t('briefing.enRouteGroundSpeedNote')}</p>
                {message && <p role="status" className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-foreground">{message}</p>}
            </div>
            {data && <div className="grid gap-3 p-4 sm:p-5 lg:grid-cols-3">
                {data.samples.map((sample, index) => {
                    const weather = data.weather[index];
                    return (
                        <article key={sample.fraction} className="min-w-0 rounded-xl border border-border bg-background/40 p-4">
                            <div className="flex items-center justify-between gap-2">
                                <h4 className="font-semibold text-foreground">{t('briefing.enRoutePoint', { percent: Math.round(sample.fraction * 100) })}</h4>
                                <span className="text-xs text-muted">{Math.round(sample.kmFromOrigin)} km</span>
                            </div>
                            <p className="mt-2 text-xs text-muted">{t('briefing.enRouteEta')}: {utcTime(sample.eta, i18n.language)}</p>
                            {weather ? <>
                                <p className="mt-1 text-xs text-muted">{t('briefing.enRouteModelHour')}: {utcTime(weather.forecastTime, i18n.language)}</p>
                                <p className="mt-1 text-xs font-medium text-primary">
                                    {data.level === 'surface' ? t('briefing.enRouteSurface') : `${data.level} hPa`}
                                </p>
                                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="block text-xs text-muted">{data.level === 'surface' ? t('briefing.enRouteTemperature') : t('briefing.enRouteTemperatureLevel')}</span>
                                        <strong className="text-foreground">{weather.temperature == null ? '—' : `${Math.round(weather.temperature)} °C`}</strong>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-muted">{t('briefing.enRouteCloud')}</span>
                                        <strong className="text-foreground">{weather.cloud == null ? '—' : `${Math.round(weather.cloud)} %`}</strong>
                                    </div>
                                    <div className="col-span-2 flex items-start gap-2">
                                        <Wind size={16} className="text-primary" aria-hidden="true" />
                                        <div>
                                            <span className="block text-xs text-muted">{data.level === 'surface' ? t('briefing.enRouteWind') : t('briefing.enRouteWindLevel')}</span>
                                            <strong className="text-foreground">{weather.windSpeed == null ? '—' : `${weather.windDirection == null ? '—' : `${Math.round(weather.windDirection)}°`} / ${Math.round(weather.windSpeed)} kt`}</strong>
                                        </div>
                                    </div>
                                    {data.level !== 'surface' && <div className="col-span-2">
                                        <span className="block text-xs text-muted">{t('briefing.enRouteGeopotential')}</span>
                                        <strong className="text-foreground">{weather.geopotentialHeight == null ? '—' : `${Math.round(weather.geopotentialHeight)} m MSL (≈ ${Math.round(weather.geopotentialHeight * 3.28084)} ft)`}</strong>
                                    </div>}
                                </div>
                            </> : <p className="mt-4 text-sm text-muted">{t('briefing.enRouteNoPointData')}</p>}
                        </article>
                    );
                })}
            </div>}
            <div className="border-t border-border px-4 py-3 text-xs leading-6 text-muted sm:px-5">
                {t('briefing.enRouteWarning')}
                {data?.level !== undefined && data.level !== 'surface' && <><br />{t('briefing.enRoutePressureWarning')}</>}
                <br />{t('briefing.enRouteSource')}
            </div>
        </section>
    );
}
