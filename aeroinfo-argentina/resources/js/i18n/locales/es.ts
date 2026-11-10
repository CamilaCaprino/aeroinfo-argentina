const es = {
    language: {
        selector: 'Idioma',
        spanish: 'Español',
        english: 'English',
        portuguese: 'Português',
        german: 'Deutsch',
    },

    nav: {
        aerodromes: 'Aeródromos',
        map: 'Mapa',
        weather: 'Meteorología',
        sources: 'Fuentes',

        mainNavigation:
            'Navegación principal',

        mobileNavigation:
            'Navegación móvil',

        openMenu:
            'Abrir menú',

        closeMenu:
            'Cerrar menú',
        briefing: 'Briefing',
    },

    common: {
        backToList: 'Volver al listado',
        notReported: 'No informado',
        unavailable: 'No disponible',
        available: 'Disponible',
        source: 'Fuente',
        from: 'Desde',
        until: 'Hasta',
        permanent: 'Permanente',
        location: 'Ubicación',
    },

    aerodrome: {
        mainInformation:
            'Información principal',
        identification:
            'Identificación',
        icaoCode:
            'Código OACI',
        iataCode:
            'Código IATA',
        localCode:
            'Código local',
        type: 'Tipo',
        useTraffic:
            'Uso / tráfico',
        province: 'Provincia',
        infrastructure:
            'Infraestructura',
        runways: 'Pistas',
        runwayDesignation:
            'Designación',
        surface: 'Superficie',
        length: 'Longitud',
    },

    weather: {
        section: 'Meteorología',
        conditionsForecast:
            'Condiciones y pronóstico',
        temperature:
            'Temperatura',
        dewpoint:
            'Punto de rocío',
        humidity: 'Humedad',
        pressure: 'Presión',
        visibility:
            'Visibilidad',
        wind: 'Viento',
        cloud:
            'Nubosidad',
        observed:
            'Observado',
        forecast:
            'Pronóstico',
    },

    notam: {
        section:
            'Información operacional',
        title: 'NOTAM activos',
        active_one:
            '{{count}} NOTAM activo',
        active_other:
            '{{count}} NOTAM activos',
        information:
            'Información',
        original:
            'Ver texto original',
        spanishVersion:
            'Versión en español',
        runway: 'Pista',
        taxiway: 'Taxiway',
        approachAid:
            'Ayuda de aproximación',
        navigationAid:
            'Radioayuda',
        apron: 'Plataforma',
        obstacle: 'Obstáculo',
        procedure:
            'Procedimiento',
        other: 'Otro',
    },

    footer: {
        reference:
            'Información aeronáutica de referencia. No sustituye publicaciones oficiales.',
        data: 'Datos',
        dataDate: 'Septiembre 2026',
        independentProject:
            'Proyecto independiente',
        designDevelopment:
            'Diseño y desarrollo',
    },

    aerodromeIndex: {
        pageTitle:
            'Aeródromos y helipuertos',

        eyebrow:
            'Inventario nacional',

        title:
            'Aeródromos y helipuertos',

        description:
            'Explorá el inventario cargado desde ANAC / Secretaría de Transporte mediante nombre, códigos y filtros territoriales.',

        records:
            'Registros',

        searchPlaceholder:
            'Nombre, OACI, IATA o código local',

        filters:
            'Filtros',

        allProvinces:
            'Todas las provincias',

        allTypes:
            'Todos los tipos',

        apply:
            'Aplicar',

        clear:
            'Limpiar',

        searchAction:
            'Aplicar búsqueda',

        activeFilters:
            'Filtros activos',

        showing:
            'Mostrando {{from}} – {{to}} de {{total}} registros',

        installation:
            'Instalación',

        code:
            'Código',

        type:
            'Tipo',

        province:
            'Provincia',

        detail:
            'Detalle',

        viewDetails:
            'Ver ficha',

        noResults:
            'No encontramos resultados',

        noResultsHelp:
            'Probá con otro nombre, código o combinación de filtros.',
    },

    show: {
        viewWindMap: 'Ver viento en mapa',
        longitude: 'Longitud',
        noPublishedCode: 'SIN CÓDIGO PUBLICADO',
        locationNotReported: 'Ubicación no informada',
        viewNationalMap: 'Ver mapa nacional',
        noRunwayData: 'No hay información de pistas validada asociada a este registro.',
        traceability: 'Trazabilidad',
        unidentifiedSource: 'Fuente sin identificar',
        consulted: 'Consultado',
        openSource: 'Abrir fuente',
        noReferences: 'No hay referencias asociadas a este registro.',
        georeference: 'Georreferencia',
        latitude: 'Latitud',
        elevation: 'Elevación',
        validationStatus: 'Estado de validación',
        openOpenStreetMap: 'Abrir en OpenStreetMap',
        notice: 'Aviso',
        noticeText: 'Esta ficha organiza información aeronáutica pública para consulta. No sustituye publicaciones aeronáuticas aplicables ni información previa al vuelo.',

        notam: {
            noData: 'No hay información NOTAM disponible.',
            noIndicator: 'Este registro no tiene un indicador local asociado para consultar NOTAM en AIS ANAC.',
            disabled: 'La consulta NOTAM está deshabilitada temporalmente.',
            error: 'No fue posible consultar los NOTAM de AIS ANAC en este momento.',
            noAerodromeData: 'No hay información NOTAM disponible para este aeródromo.',
            noneActive: 'Sin NOTAM activos',
            descriptionStart: 'Avisos publicados en AIS ANAC para el indicador',
            descriptionEnd: 'Se muestra primero la versión en español cuando está disponible y se conserva el texto original.',
            noneForIndicator: 'AIS ANAC no informa NOTAM activos para este indicador en este momento.',
            referenceDisclaimer: 'Fuente: AIS ANAC · Información de referencia. No reemplaza el PIB ni la información previa al vuelo obtenida por los canales oficiales.',
            openAnac: 'Abrir AIS ANAC',
            textNotReported: 'Texto no informado',
        },

        status: {
            noData: 'Sin datos',
            outdated: 'Desactualizado',
            error: 'Error',
            noLocalObservation: 'Sin observación local',
            disabled: 'Deshabilitado',
        },

        weather: {
            noData: 'No hay información meteorológica disponible.',
            aeronauticalInformation: 'Información meteorológica aeronáutica',
            metarTafTitle: 'METAR / SPECI y TAF',
            metarTafDescription: 'Productos meteorológicos aeronáuticos asociados al designador OACI del aeródromo. Se conserva siempre el mensaje original junto con una lectura estructurada.',
            complementaryInformation: 'Información complementaria',
            smnEcmwfTitle: 'Observación SMN y tendencia ECMWF',
            smnEcmwfDescription: 'Datos complementarios para ampliar el contexto meteorológico. No reemplazan los productos aeronáuticos aplicables.',
            smnObservation: 'Observación SMN',
            smnDescription: 'Condiciones observadas mediante estaciones del Servicio Meteorológico Nacional.',
            smnError: 'No fue posible consultar las observaciones del SMN en este momento.',
            smnUnavailable: 'No hay una observación SMN representativa disponible para este aeródromo.',
            ecmwfHourly: 'Pronóstico horario ECMWF',
            ecmwfDescription: 'Pronóstico numérico calculado para las coordenadas específicas del aeródromo.',
            forecastError: 'No fue posible consultar el pronóstico meteorológico en este momento.',
            forecastUnavailable: 'No hay pronóstico meteorológico disponible para esta ubicación.',
            disclaimer: 'AeroInfo organiza estos datos para facilitar su consulta. Verificá siempre METAR/SPECI, TAF, NOTAM, SIGMET y demás información aeronáutica aplicable mediante las fuentes y servicios oficiales correspondientes antes de la operación. Esta vista no constituye un PIB ni un briefing oficial.',
            metarDescription: 'Observación meteorológica aeronáutica.',
            metarNoIcao: 'Este registro no tiene designador OACI, por lo que no es posible consultar METAR/SPECI por código de aeródromo.',
            metarError: 'No fue posible consultar METAR/SPECI en este momento.',
            metarUnavailable: 'No hay un METAR/SPECI disponible para este aeródromo.',
            metarLatest: 'Último reporte meteorológico aeronáutico disponible.',
            originalMessage: 'Mensaje original',
            category: 'Categoría',
            received: 'Recibido',
            reportOlderThanTwoHours: 'Reporte con más de 2 horas',
            tafDescription: 'Pronóstico meteorológico aeronáutico.',
            tafNoIcao: 'Este registro no tiene designador OACI, por lo que no es posible consultar TAF por código de aeródromo.',
            tafError: 'No fue posible consultar el TAF en este momento.',
            tafUnavailable: 'No hay un TAF disponible para este aeródromo.',
            tafLatest: 'Pronóstico de aeródromo y cambios previstos durante su período de validez.',
            issued: 'Emitido',
            validFrom: 'Válido desde',
            validUntil: 'Válido hasta',
            expectedEvolution: 'Evolución prevista',
            noDecodedSegments: 'El TAF no contiene segmentos decodificados disponibles.',
            conditionToReview: 'Condición a revisar',
            changeExpectedToward: 'Cambio previsto hacia',
            phenomenon: 'Fenómeno',
            clouds: 'Nubes',
            max: 'Máx.',
            min: 'Mín.',
            temp: 'Temp.',
            windShearAt: 'Wind shear informado a',
            notDecoded: 'No decodificado',
            initialTafConditions: 'Condiciones predominantes iniciales del TAF.',
            stationUsed: 'Estación utilizada',
            representativeness: 'Representatividad',
            stationDistance: 'Distancia a la estación',
            outdatedData: 'Dato desactualizado',
            noRepresentativeLocalObservation: 'Sin observación local representativa',
            nearestStationPrefix: 'La estación meteorológica disponible más cercana se encuentra a',
            nearestStationSuffix: 'Por esa distancia, AeroInfo no presenta sus mediciones como condiciones locales de este aeródromo.',
            nearestReferenceStation: 'Estación de referencia más cercana',
            presentWeather: 'Tiempo presente',
            time: 'Hora',
            condition: 'Condición',
            gust: 'Ráfaga',
            precipitation: 'Precip.',
            model: 'Modelo',
            horizon12h: 'Horizonte mostrado: próximas 12 horas',
            noCloudLayers: 'Sin capas informadas',
            noPhenomenon: 'Sin fenómeno informado',
            periodNotReported: 'Período no informado',
            noDescription: 'Sin descripción',
            tafBase: 'Base',
            phenomena: {
                mist: 'Neblina', fog: 'Niebla', rain: 'Lluvia', drizzle: 'Llovizna', snow: 'Nieve', thunderstorm: 'Tormenta',
            },
            wx: {
                tsra: 'Tormenta con lluvia', minusTsra: 'Tormenta débil con lluvia', plusTsra: 'Tormenta fuerte con lluvia',
                ra: 'Lluvia', minusRa: 'Lluvia débil', plusRa: 'Lluvia fuerte',
                dz: 'Llovizna', minusDz: 'Llovizna débil', plusDz: 'Llovizna fuerte',
                br: 'Neblina', fg: 'Niebla', hz: 'Bruma',
                shra: 'Chaparrones de lluvia', minusShra: 'Chaparrones débiles', plusShra: 'Chaparrones fuertes',
                sn: 'Nieve', minusSn: 'Nieve débil', plusSn: 'Nieve fuerte', ts: 'Tormenta',
            },
            codes: {
                clear: 'Despejado', mostlyClear: 'Mayormente despejado', partlyCloudy: 'Parcialmente nublado', overcast: 'Cubierto', fog: 'Niebla', rimeFog: 'Niebla con escarcha', lightDrizzle: 'Llovizna débil', moderateDrizzle: 'Llovizna moderada', heavyDrizzle: 'Llovizna intensa', lightFreezingDrizzle: 'Llovizna helada débil', heavyFreezingDrizzle: 'Llovizna helada intensa', lightRain: 'Lluvia débil', moderateRain: 'Lluvia moderada', heavyRain: 'Lluvia intensa', lightFreezingRain: 'Lluvia helada débil', heavyFreezingRain: 'Lluvia helada intensa', lightSnow: 'Nieve débil', moderateSnow: 'Nieve moderada', heavySnow: 'Nieve intensa', snowGrains: 'Granos de nieve', lightShowers: 'Chaparrones débiles', moderateShowers: 'Chaparrones moderados', heavyShowers: 'Chaparrones intensos', lightSnowShowers: 'Nevadas débiles', heavySnowShowers: 'Nevadas intensas', thunderstorm: 'Tormenta', thunderstormHail: 'Tormenta con granizo', severeThunderstormHail: 'Tormenta fuerte con granizo',
            },
        },
    },

    home: {
        weather: 'Meteorología',
        openWeather: 'Viento y pronóstico',
        dataProvider:
        'ANAC / Secretaría de Transporte',
        pageTitle: 'Inicio',
        eyebrow:'Información aeronáutica trazable · República Argentina',
        title: 'Encontrá aeródromos y helipuertos de Argentina',
        description:
            'Inventario basado en ANAC / Secretaría de Transporte, con referencias documentales y mapa interactivo.',
        searchLabel: 'Buscar aeródromo o helipuerto',
        searchPlaceholder:
            'Nombre, OACI, IATA o código local',
        search: 'Buscar',
        dataUpdate:
            'Actualización de datos · Septiembre 2026',
        databasePending:
            'Base de datos pendiente de importación',
        databasePendingDescription:
            'La interfaz ya está disponible. Falta ejecutar el proceso documentado de importación ANAC correspondiente a septiembre de 2026.',
        directory: 'Directorio',
        exploreAerodromes:
            'Explorar aeródromos',
        territorialView:
            'Visualización territorial',
        openMap:
            'Abrir mapa interactivo',
        briefing: 'Briefing de vuelo',
        openBriefing: 'Planificar recorrido',
    },

    map: {
        pageTitle: 'Mapa nacional',
        eyebrow: 'Inventario georreferenciado',
        title: 'Mapa nacional',
        description:
            'Explorá aeródromos y helipuertos registrados en la base mediante su ubicación geográfica.',
        viewList: 'Ver listado completo',
        facilities: 'Instalaciones',
        aerodromes: 'Aeródromos',
        heliports: 'Helipuertos',
        aerodrome: 'Aeródromo',
        heliport: 'Helipuerto',
        facility: 'Instalación',
        filters: 'Filtros',
        filtersActive: 'Filtros activos',
        showFilters: 'Mostrar',
        hideFilters: 'Ocultar',
        allFacilities: 'Todas las instalaciones',
        allProvinces: 'Todas las provincias',
        clearFilters: 'Limpiar filtros',
        argentina: 'República Argentina',
        visibleCount_one:
            '{{count}} instalación visible',
        visibleCount_other:
            '{{count}} instalaciones visibles',
        cluster: 'Agrupación',
        localCodeShort: 'Local',
        viewFullDetails:
            'Ver ficha completa',
        currentView: 'Vista actual',
        records: 'registros',
        noMatches:
            'No hay instalaciones que coincidan con los filtros seleccionados.',
        dataSource:
            'Datos: ANAC / Secretaría de Transporte · Septiembre 2026',
        mapDisclaimer:
            'La representación cartográfica es orientativa.',
    },

    sources: {
        defaultOrganization:
            'ANAC / Secretaría de Transporte',
        pageTitle: 'Fuentes',
        eyebrow: 'Transparencia y procedencia',
        title: 'Fuentes y metodología',
        description:
            'Aeroinfo conserva la procedencia de los datos y distingue entre inventario geográfico y documentación aeronáutica operativa.',
        openSource:
            'Abrir fuente original',
        publicationCriteria:
            'Criterio de publicación',
        publicationCriteriaText:
            'Un registro presente en el inventario no implica por sí mismo habilitación u operatividad. Los datos faltantes se muestran como no informados y las discrepancias quedan pendientes de revisión.',
        traceability:
            'Trazabilidad',
        traceabilityText:
            'Los datos relevantes conservan su procedencia para poder identificar la fuente utilizada y revisar futuras actualizaciones.',
        operationalUse:
            'Uso operacional',
        operationalUseText:
            'Aeroinfo es una herramienta de referencia y no sustituye publicaciones aeronáuticas oficiales, información previa al vuelo ni documentación operacional aplicable.',
    },

    theme: {
        selector: 'Tema visual',
        light: 'Claro',
        dark: 'Oscuro',
        system: 'Sistema',
    },

    weatherMap: {
        pageTitle: 'Meteorología',
        eyebrow: 'Meteorología aeronáutica',
        title: 'Viento sobre Argentina',
        source:
        'Visualización: Windy · Modelo seleccionado: ECMWF.',
        description:
            'Explorá la evolución del viento y las condiciones meteorológicas sobre el territorio argentino mediante un mapa interactivo.',
        surfaceWind: 'Viento en superficie',
        mapTitle: 'Mapa de viento',
        mapSubtitle: 'Modelo ECMWF · Viento en superficie',
        openInteractive: 'Abrir en Windy',
        iframeTitle: 'Mapa interactivo de viento sobre Argentina',
        disclaimer:
            'Información meteorológica de referencia. Para planificación operacional y previa al vuelo, verificá siempre las fuentes aeronáuticas y meteorológicas aplicables.',
    },

    briefing: {
        eyebrow: 'Planificación previa al vuelo',
        title: 'Briefing de vuelo',
        description: 'Consultá METAR, TAF, NOTAM, viento observado y datos de aeródromos para origen, destino y un alternativo opcional.',
        origin: 'Origen',
        destination: 'Destino',
        alternate: 'Alternativo',
        optional: 'opcional',
        none: 'Sin alternativo',
        searchPlaceholder: 'Nombre, OACI, IATA o código local',
        noMatches: 'Sin coincidencias',
        generate: 'Generar briefing',
        generating: 'Consultando fuentes…',
        result: 'Resumen de consulta',
        disclaimer: 'Información de referencia. No constituye un PIB ni reemplaza las publicaciones y procedimientos oficiales de planificación previa al vuelo. Verificá vigencia y disponibilidad de cada fuente.',
        openAerodrome: 'Ver ficha completa',
        unavailable: 'No disponible / sin datos confirmados',
        notamCount_one: '{{count}} NOTAM activo',
        notamCount_other: '{{count}} NOTAM activos',
        observedWind: 'Viento observado',
        runways: 'Pistas',
        map: 'Ubicación',
        windMap: 'Mapa de viento',
        showNotams: 'Ver detalle de NOTAM',
        hideNotams: 'Ocultar detalle de NOTAM',
        notamDetails: 'Detalle de NOTAM activos',
        notamReference: 'Información de referencia · Horarios UTC',
        checkNotamsAtSource: 'Verificar NOTAM en AIS ANAC',
        notamFrom: 'Desde',
        notamUntil: 'Hasta',
        notamPermanent: 'Permanente',
        notamTextUnavailable: 'Texto no disponible',
        notamOriginalText: 'Ver texto original',
        notamSpanishText: 'Ver versión en español',
        routeOverview: 'Resumen del recorrido',
        directDistance: 'Distancia directa origen–destino',
        destinationToAlternate: 'Destino–alternativo',
        directSegment: 'Segmento directo',
        alternateSegment: 'Tramo al alternativo',
        routeNoCoordinates: 'No hay coordenadas suficientes para representar el recorrido.',
        routeDisclaimer: 'Líneas esquemáticas entre aeródromos y distancias ortodrómicas aproximadas. No representan aerovías, una ruta autorizada ni un plan de vuelo. Verificá información operacional oficial.',
        metarSummary: 'Resumen de la última observación METAR',
        observationTime: 'Observado',
        observationTimeUnknown: 'Hora de observación no disponible',
        metarOlderThanTwoHours: 'La observación METAR tiene más de 2 horas. Verificá la información actualizada en la fuente oficial.',
        metarSummaryUnavailable: 'Sin METAR disponible para mostrar un resumen.',
        summary_wind: 'Viento METAR',
        summary_visibility: 'Visibilidad',
        summary_temperature: 'Temperatura',
        summary_qnh: 'QNH',
        categoryReported: 'Categoría de vuelo informada por la fuente',
        categoryNotReported: 'Categoría de vuelo no informada por la fuente',
        metarSummaryReference: 'Lectura rápida de referencia; consultá el METAR original.',
        enRouteTitle: 'Meteorología en ruta',
        enRouteDescription: 'Pronóstico ECMWF en tres puntos intermedios del tramo directo entre origen y destino (25 %, 50 % y 75 %).',
        enRouteDeparture: 'Salida estimada (UTC)',
        enRouteSpeed: 'Velocidad estimada sobre el suelo (kt)',
        enRouteConsult: 'Consultar pronóstico',
        enRouteLoading: 'Consultando…',
        enRouteGroundSpeedNote: 'La hora de paso es aproximada: se calcula con distancia directa y velocidad constante sobre el suelo; no considera viento, ascenso, descenso ni ruta publicada.',
        enRouteDateRange: 'Seleccioná una salida desde ahora y dentro de los próximos nueve días. Verificá la hora UTC.',
        enRouteNoData: 'La fuente no devolvió datos para las horas estimadas.',
        enRouteError: 'No fue posible consultar Open-Meteo. Comprobá la conexión y volvé a intentar.',
        enRoutePoint: 'Punto {{percent}} %',
        enRouteEta: 'Paso estimado',
        enRouteModelHour: 'Hora del pronóstico',
        enRouteTemperature: 'Temperatura a 2 m',
        enRouteCloud: 'Nubosidad total',
        enRouteWind: 'Viento a 10 m',
        enRouteNoPointData: 'Sin pronóstico disponible para este punto y hora.',
        enRouteWarning: 'Valores de pronóstico cerca de la superficie (temperatura a 2 m y viento a 10 m), NO meteorología a altitud de crucero ni un pronóstico aeronáutico certificado. Los puntos siguen el tramo geodésico esquemático, no aerovías.',
        enRouteSource: 'Fuente: Open-Meteo / ECMWF IFS. Corroborá con los productos meteorológicos y publicaciones aeronáuticas oficiales antes de volar.',
        enRouteLevel: 'Nivel de referencia',
        enRouteSurface: 'Superficie (2 m / 10 m)',
        enRouteTemperatureLevel: 'Temperatura en nivel',
        enRouteWindLevel: 'Viento en nivel',
        enRouteGeopotential: 'Altura geopotencial del nivel',
        enRoutePressureWarning: 'Los niveles de presión no equivalen a una altitud fija ni a un nivel de vuelo; la altura geopotencial es aproximada. El ECMWF IFS 0,25° tiene resolución limitada y no reemplaza productos meteorológicos aeronáuticos oficiales.',
    },
};

export default es;
