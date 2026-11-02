const en = {
    language: {
        selector: 'Language',
        spanish: 'Español',
        english: 'English',
        portuguese: 'Português',
        german: 'Deutsch',
    },

    nav: {
        aerodromes: 'Aerodromes',
        map: 'Map',
        sources: 'Sources',

        mainNavigation:
            'Main navigation',

        mobileNavigation:
            'Mobile navigation',

        openMenu:
            'Open menu',

        closeMenu:
            'Close menu',
    },

    common: {
        backToList: 'Back to list',
        notReported: 'Not reported',
        unavailable: 'Unavailable',
        available: 'Available',
        source: 'Source',
        from: 'From',
        until: 'Until',
        permanent: 'Permanent',
        location: 'Location',
    },

    aerodrome: {
        mainInformation:
            'Main information',
        identification:
            'Identification',
        icaoCode:
            'ICAO code',
        iataCode:
            'IATA code',
        localCode:
            'Local code',
        type: 'Type',
        useTraffic:
            'Use / traffic',
        province: 'Province',
        infrastructure:
            'Infrastructure',
        runways: 'Runways',
        runwayDesignation:
            'Designation',
        surface: 'Surface',
        length: 'Length',
    },

    weather: {
        section: 'Weather',
        conditionsForecast:
            'Conditions and forecast',
        temperature:
            'Temperature',
        dewpoint:
            'Dew point',
        humidity: 'Humidity',
        pressure: 'Pressure',
        visibility:
            'Visibility',
        wind: 'Wind',
        cloud: 'Cloud cover',
        observed: 'Observed',
        forecast: 'Forecast',
    },

    notam: {
        section:
            'Operational information',
        title: 'Active NOTAMs',
        active_one:
            '{{count}} active NOTAM',
        active_other:
            '{{count}} active NOTAMs',
        information:
            'Information',
        original:
            'View original text',
        spanishVersion:
            'View Spanish version',
        runway: 'Runway',
        taxiway: 'Taxiway',
        approachAid:
            'Approach aid',
        navigationAid:
            'Navigation aid',
        apron: 'Apron',
        obstacle: 'Obstacle',
        procedure:
            'Procedure',
        other: 'Other',
    },

    footer: {
        reference:
            'Aeronautical information for reference purposes. It does not replace official publications.',
        data: 'Data',
        dataDate: 'September 2026',
        independentProject:
            'Independent project',
        designDevelopment:
            'Design and development',
    },

    aerodromeIndex: {
        pageTitle:
            'Aerodromes and heliports',

        eyebrow:
            'National inventory',

        title:
            'Aerodromes and heliports',

        description:
            'Explore the inventory loaded from ANAC / Secretariat of Transportation using names, codes and regional filters.',

        records:
            'Records',

        searchPlaceholder:
            'Name, ICAO, IATA or local code',

        filters:
            'Filters',

        allProvinces:
            'All provinces',

        allTypes:
            'All types',

        apply:
            'Apply',

        clear:
            'Clear',

        searchAction:
            'Apply search',

        activeFilters:
            'Active filters',

        showing:
            'Showing {{from}} – {{to}} of {{total}} records',

        installation:
            'Facility',

        code:
            'Code',

        type:
            'Type',

        province:
            'Province',

        detail:
            'Details',

        viewDetails:
            'View details',

        noResults:
            'No results found',

        noResultsHelp:
            'Try another name, code or filter combination.',
    },

    show: {
        noPublishedCode: 'NO PUBLISHED CODE', locationNotReported: 'Location not reported', viewNationalMap: 'View national map', noRunwayData: 'No validated runway information is associated with this record.', traceability: 'Traceability', unidentifiedSource: 'Unidentified source', consulted: 'Consulted', openSource: 'Open source', noReferences: 'No references are associated with this record.', georeference: 'Georeference', latitude: 'Latitude', longitude: 'Longitude', elevation: 'Elevation', validationStatus: 'Validation status', openOpenStreetMap: 'Open in OpenStreetMap', notice: 'Notice', noticeText: 'This page organizes public aeronautical information for reference. It does not replace applicable aeronautical publications or pre-flight information.',
        notam: { noData: 'No NOTAM information is available.', noIndicator: 'This record has no local indicator associated with AIS ANAC NOTAM queries.', disabled: 'NOTAM queries are temporarily disabled.', error: 'AIS ANAC NOTAMs could not be retrieved at this time.', noAerodromeData: 'No NOTAM information is available for this aerodrome.', noneActive: 'No active NOTAMs', descriptionStart: 'Notices published by AIS ANAC for indicator', descriptionEnd: 'The original text is preserved. When a Spanish version is available it may also be shown.', noneForIndicator: 'AIS ANAC currently reports no active NOTAMs for this indicator.', referenceDisclaimer: 'Source: AIS ANAC · Reference information only. It does not replace the PIB or official pre-flight information channels.', openAnac: 'Open AIS ANAC', textNotReported: 'Text not reported' },
        status: { noData: 'No data', outdated: 'Outdated', error: 'Error', noLocalObservation: 'No local observation', disabled: 'Disabled' },
        weather: {
            noData: 'No weather information is available.', aeronauticalInformation: 'Aeronautical meteorological information', metarTafTitle: 'METAR / SPECI and TAF', metarTafDescription: 'Aeronautical meteorological products associated with the aerodrome ICAO designator. The original message is always preserved together with a structured reading.', complementaryInformation: 'Complementary information', smnEcmwfTitle: 'SMN observation and ECMWF trend', smnEcmwfDescription: 'Complementary data to provide additional meteorological context. They do not replace applicable aeronautical weather products.', smnObservation: 'SMN observation', smnDescription: 'Observed conditions from National Meteorological Service stations.', smnError: 'SMN observations could not be retrieved at this time.', smnUnavailable: 'No representative SMN observation is available for this aerodrome.', ecmwfHourly: 'ECMWF hourly forecast', ecmwfDescription: 'Numerical forecast calculated for the aerodrome coordinates.', forecastError: 'The weather forecast could not be retrieved at this time.', forecastUnavailable: 'No weather forecast is available for this location.', disclaimer: 'AeroInfo organizes these data for easier consultation. Always verify METAR/SPECI, TAF, NOTAM, SIGMET and all other applicable aeronautical information through the corresponding official sources and services before operation. This view is not a PIB or an official briefing.', metarDescription: 'Aeronautical meteorological observation.', metarNoIcao: 'This record has no ICAO designator, so METAR/SPECI cannot be queried by aerodrome code.', metarError: 'METAR/SPECI could not be retrieved at this time.', metarUnavailable: 'No METAR/SPECI is available for this aerodrome.', metarLatest: 'Latest available aeronautical weather report.', originalMessage: 'Original message', category: 'Category', received: 'Received', reportOlderThanTwoHours: 'Report older than 2 hours', tafDescription: 'Aerodrome weather forecast.', tafNoIcao: 'This record has no ICAO designator, so a TAF cannot be queried by aerodrome code.', tafError: 'The TAF could not be retrieved at this time.', tafUnavailable: 'No TAF is available for this aerodrome.', tafLatest: 'Aerodrome forecast and expected changes during its validity period.', issued: 'Issued', validFrom: 'Valid from', validUntil: 'Valid until', expectedEvolution: 'Expected evolution', noDecodedSegments: 'No decoded TAF segments are available.', conditionToReview: 'Condition to review', changeExpectedToward: 'Expected change toward', phenomenon: 'Phenomenon', clouds: 'Clouds', max: 'Max.', min: 'Min.', temp: 'Temp.', windShearAt: 'Wind shear reported at', notDecoded: 'Not decoded', initialTafConditions: 'Initial prevailing TAF conditions.', stationUsed: 'Station used', representativeness: 'Representativeness', stationDistance: 'Distance to station', outdatedData: 'Outdated data', noRepresentativeLocalObservation: 'No representative local observation', nearestStationPrefix: 'The nearest available weather station is', nearestStationSuffix: 'At this distance, AeroInfo does not present its measurements as local conditions for this aerodrome.', nearestReferenceStation: 'Nearest reference station', presentWeather: 'Present weather', time: 'Time', condition: 'Condition', gust: 'Gust', precipitation: 'Precip.', model: 'Model', horizon12h: 'Displayed horizon: next 12 hours', noCloudLayers: 'No cloud layers reported', noPhenomenon: 'No phenomenon reported', periodNotReported: 'Period not reported', noDescription: 'No description', tafBase: 'Base',
            phenomena: { mist: 'Mist', fog: 'Fog', rain: 'Rain', drizzle: 'Drizzle', snow: 'Snow', thunderstorm: 'Thunderstorm' },
            wx: { tsra: 'Thunderstorm with rain', minusTsra: 'Light thunderstorm with rain', plusTsra: 'Heavy thunderstorm with rain', ra: 'Rain', minusRa: 'Light rain', plusRa: 'Heavy rain', dz: 'Drizzle', minusDz: 'Light drizzle', plusDz: 'Heavy drizzle', br: 'Mist', fg: 'Fog', hz: 'Haze', shra: 'Rain showers', minusShra: 'Light rain showers', plusShra: 'Heavy rain showers', sn: 'Snow', minusSn: 'Light snow', plusSn: 'Heavy snow', ts: 'Thunderstorm' },
            codes: { clear: 'Clear', mostlyClear: 'Mostly clear', partlyCloudy: 'Partly cloudy', overcast: 'Overcast', fog: 'Fog', rimeFog: 'Rime fog', lightDrizzle: 'Light drizzle', moderateDrizzle: 'Moderate drizzle', heavyDrizzle: 'Heavy drizzle', lightFreezingDrizzle: 'Light freezing drizzle', heavyFreezingDrizzle: 'Heavy freezing drizzle', lightRain: 'Light rain', moderateRain: 'Moderate rain', heavyRain: 'Heavy rain', lightFreezingRain: 'Light freezing rain', heavyFreezingRain: 'Heavy freezing rain', lightSnow: 'Light snow', moderateSnow: 'Moderate snow', heavySnow: 'Heavy snow', snowGrains: 'Snow grains', lightShowers: 'Light showers', moderateShowers: 'Moderate showers', heavyShowers: 'Heavy showers', lightSnowShowers: 'Light snow showers', heavySnowShowers: 'Heavy snow showers', thunderstorm: 'Thunderstorm', thunderstormHail: 'Thunderstorm with hail', severeThunderstormHail: 'Severe thunderstorm with hail' },
        },
    },

    home: {
        dataProvider:
        'ANAC / Secretaría de Transporte',
        pageTitle: 'Home',
        eyebrow:'Aeronautical information · Argentina',
        title: 'Find aerodromes and heliports across Argentina',
        description:
            'Inventory based on ANAC / Secretariat of Transportation data, with documentary references and an interactive map.',
        searchLabel: 'Search for an aerodrome or heliport',
        searchPlaceholder:
            'Name, ICAO, IATA or local code',
        search: 'Search',
        dataUpdate:
            'Data update · September 2026',
        databasePending:
            'Database import pending',
        databasePendingDescription:
            'The interface is already available. The documented ANAC import process for September 2026 still needs to be run.',
        directory: 'Directory',
        exploreAerodromes:
            'Explore aerodromes',
        territorialView:
            'Geographic view',
        openMap:
            'Open interactive map',
    },

    map: {
        pageTitle: 'National map',
        eyebrow: 'Georeferenced inventory',
        title: 'National map',
        description:
            'Explore aerodromes and heliports registered in the database through their geographic locations.',
        viewList: 'View full list',
        facilities: 'Facilities',
        aerodromes: 'Aerodromes',
        heliports: 'Heliports',
        aerodrome: 'Aerodrome',
        heliport: 'Heliport',
        facility: 'Facility',
        filters: 'Filters',
        filtersActive: 'Active filters',
        showFilters: 'Show',
        hideFilters: 'Hide',
        allFacilities: 'All facilities',
        allProvinces: 'All provinces',
        clearFilters: 'Clear filters',
        argentina: 'Argentina',
        visibleCount_one:
            '{{count}} visible facility',
        visibleCount_other:
            '{{count}} visible facilities',
        cluster: 'Cluster',
        localCodeShort: 'Local',
        viewFullDetails:
            'View full details',
        currentView: 'Current view',
        records: 'records',
        noMatches:
            'No facilities match the selected filters.',
        dataSource:
            'Data: ANAC / Secretariat of Transportation · September 2026',
        mapDisclaimer:
            'The map representation is for reference purposes only.',
    },

    sources: {
        defaultOrganization:
        'ANAC / Secretaría de Transporte',
        pageTitle: 'Sources',
        eyebrow: 'Transparency and provenance',
        title: 'Sources and methodology',
        description:
            'Aeroinfo preserves data provenance and distinguishes between the geographic inventory and operational aeronautical documentation.',
        openSource:
            'Open original source',
        publicationCriteria:
            'Publication criteria',
        publicationCriteriaText:
            'A record appearing in the inventory does not by itself imply authorization or operational status. Missing data is shown as unavailable and discrepancies remain pending review.',
        traceability:
            'Traceability',
        traceabilityText:
            'Relevant data retains its provenance so the source can be identified and future updates can be reviewed.',
        operationalUse:
            'Operational use',
        operationalUseText:
            'Aeroinfo is a reference tool and does not replace official aeronautical publications, preflight information or applicable operational documentation.',
    },

    theme: {
        selector: 'Appearance',
        light: 'Light',
        dark: 'Dark',
        system: 'System',
    },
};

export default en;
