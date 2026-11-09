import { TileLayer } from 'react-leaflet';

type ArgentinaTileLayerProps = {
    variant?: 'color' | 'gray' | 'dark' | 'topographic';
};

const tileUrls = {
    color:
        'https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png',

    gray:
        'https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_gris@EPSG%3A3857@png/{z}/{x}/{-y}.png',

    dark:
        'https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/argenmap_oscuro@EPSG%3A3857@png/{z}/{x}/{-y}.png',

    topographic:
        'https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_topo@EPSG%3A3857@png/{z}/{x}/{-y}.png',
};

export default function ArgentinaTileLayer({
    variant = 'color',
}: ArgentinaTileLayerProps) {
    return (
        <TileLayer
            url={tileUrls[variant]}
            attribution='&copy; <a href="https://www.ign.gob.ar/" target="_blank">Instituto Geográfico Nacional</a> + <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
            minZoom={3}
            maxZoom={18}
        />
    );
}
