const de = {
    language: {
        selector: 'Sprache',
        spanish: 'Español',
        english: 'English',
        portuguese: 'Português',
        german: 'Deutsch',
    },
    
    nav: {
        aerodromes: 'Flugplätze',
        map: 'Karte',
        sources: 'Quellen',

        mainNavigation:
            'Hauptnavigation',

        mobileNavigation:
            'Mobile Navigation',

        openMenu:
            'Menü öffnen',

        closeMenu:
            'Menü schließen',
    },

    common: {
        backToList:
            'Zurück zur Liste',
        notReported:
            'Nicht angegeben',
        unavailable:
            'Nicht verfügbar',
        available:
            'Verfügbar',
        source: 'Quelle',
        from: 'Von',
        until: 'Bis',
        permanent:
            'Dauerhaft',
        location:
            'Standort',
    },

    aerodrome: {
        mainInformation:
            'Hauptinformationen',
        identification:
            'Identifikation',
        icaoCode:
            'ICAO-Code',
        iataCode:
            'IATA-Code',
        localCode:
            'Lokaler Code',
        type: 'Typ',
        useTraffic:
            'Nutzung / Verkehr',
        province:
            'Provinz',
        infrastructure:
            'Infrastruktur',
        runways:
            'Start- und Landebahnen',
        runwayDesignation:
            'Bezeichnung',
        surface:
            'Oberfläche',
        length: 'Länge',
    },

    weather: {
        section: 'Wetter',
        conditionsForecast:
            'Bedingungen und Vorhersage',
        temperature:
            'Temperatur',
        dewpoint:
            'Taupunkt',
        humidity:
            'Luftfeuchtigkeit',
        pressure:
            'Luftdruck',
        visibility:
            'Sichtweite',
        wind: 'Wind',
        cloud:
            'Bewölkung',
        observed:
            'Beobachtet',
        forecast:
            'Vorhersage',
    },

    notam: {
        section:
            'Betriebliche Informationen',
        title: 'Aktive NOTAMs',
        active_one:
            '{{count}} aktives NOTAM',
        active_other:
            '{{count}} aktive NOTAMs',
        information:
            'Information',
        original:
            'Originaltext anzeigen',
        spanishVersion:
            'Spanische Version anzeigen',
        runway:
            'Start-/Landebahn',
        taxiway:
            'Rollweg',
        approachAid:
            'Anflughilfe',
        navigationAid:
            'Navigationshilfe',
        apron:
            'Vorfeld',
        obstacle:
            'Hindernis',
        procedure:
            'Verfahren',
        other: 'Sonstiges',
    },

    footer: {
        reference:
            'Luftfahrtinformationen zu Referenzzwecken. Sie ersetzen keine offiziellen Veröffentlichungen.',
        data: 'Daten',
        dataDate: 'September 2026',
        independentProject:
            'Unabhängiges Projekt',
        designDevelopment:
            'Design und Entwicklung',
    },

    aerodromeIndex: {
        pageTitle:
            'Flugplätze und Hubschrauberlandeplätze',

        eyebrow:
            'Nationales Verzeichnis',

        title:
            'Flugplätze und Hubschrauberlandeplätze',

        description:
            'Durchsuchen Sie das von ANAC / Verkehrssekretariat bereitgestellte Verzeichnis nach Namen, Codes und regionalen Filtern.',

        records:
            'Einträge',

        searchPlaceholder:
            'Name, ICAO, IATA oder lokaler Code',

        filters:
            'Filter',

        allProvinces:
            'Alle Provinzen',

        allTypes:
            'Alle Typen',

        apply:
            'Anwenden',

        clear:
            'Zurücksetzen',

        searchAction:
            'Suche anwenden',

        activeFilters:
            'Aktive Filter',

        showing:
            '{{from}} – {{to}} von {{total}} Einträgen',

        installation:
            'Flugplatz',

        code:
            'Code',

        type:
            'Typ',

        province:
            'Provinz',

        detail:
            'Details',

        viewDetails:
            'Details anzeigen',

        noResults:
            'Keine Ergebnisse gefunden',

        noResultsHelp:
            'Versuchen Sie einen anderen Namen, Code oder eine andere Filterkombination.',
    },

    show: {
        noPublishedCode: 'KEIN VERÖFFENTLICHTER CODE', locationNotReported: 'Standort nicht angegeben', viewNationalMap: 'Nationale Karte anzeigen', noRunwayData: 'Für diesen Eintrag sind keine validierten Start- und Landebahndaten hinterlegt.', traceability: 'Nachverfolgbarkeit', unidentifiedSource: 'Nicht identifizierte Quelle', consulted: 'Abgerufen', openSource: 'Quelle öffnen', noReferences: 'Für diesen Eintrag sind keine Referenzen hinterlegt.', georeference: 'Georeferenz', latitude: 'Breitengrad', longitude: 'Längengrad', elevation: 'Höhe', validationStatus: 'Validierungsstatus', openOpenStreetMap: 'In OpenStreetMap öffnen', notice: 'Hinweis', noticeText: 'Diese Seite strukturiert öffentliche Luftfahrtinformationen zur Referenz. Sie ersetzt keine anwendbaren Luftfahrtveröffentlichungen oder Vorfluginformationen.',
        notam: { noData: 'Keine NOTAM-Informationen verfügbar.', noIndicator: 'Für diesen Eintrag ist kein lokaler Indikator für AIS-ANAC-NOTAM-Abfragen hinterlegt.', disabled: 'Die NOTAM-Abfrage ist vorübergehend deaktiviert.', error: 'Die NOTAMs von AIS ANAC konnten derzeit nicht abgerufen werden.', noAerodromeData: 'Für diesen Flugplatz sind keine NOTAM-Informationen verfügbar.', noneActive: 'Keine aktiven NOTAMs', descriptionStart: 'Von AIS ANAC veröffentlichte Hinweise für den Indikator', descriptionEnd: 'Der Originaltext wird immer beibehalten; eine spanische Version wird angezeigt, wenn sie verfügbar ist.', noneForIndicator: 'AIS ANAC meldet derzeit keine aktiven NOTAMs für diesen Indikator.', referenceDisclaimer: 'Quelle: AIS ANAC · Nur Referenzinformation. Sie ersetzt weder das PIB noch offizielle Vorfluginformationskanäle.', openAnac: 'AIS ANAC öffnen', textNotReported: 'Text nicht angegeben' },
        status: { noData: 'Keine Daten', outdated: 'Veraltet', error: 'Fehler', noLocalObservation: 'Keine lokale Beobachtung', disabled: 'Deaktiviert' },
        weather: {
            noData: 'Keine Wetterinformationen verfügbar.', aeronauticalInformation: 'Flugmeteorologische Informationen', metarTafTitle: 'METAR / SPECI und TAF', metarTafDescription: 'Flugmeteorologische Produkte zum ICAO-Kennzeichen des Flugplatzes. Die Originalmeldung bleibt stets erhalten und wird durch eine strukturierte Darstellung ergänzt.', complementaryInformation: 'Ergänzende Informationen', smnEcmwfTitle: 'SMN-Beobachtung und ECMWF-Trend', smnEcmwfDescription: 'Ergänzende Daten zur Erweiterung des meteorologischen Kontexts. Sie ersetzen keine anwendbaren flugmeteorologischen Produkte.', smnObservation: 'SMN-Beobachtung', smnDescription: 'Beobachtete Bedingungen von Stationen des argentinischen Wetterdienstes.', smnError: 'Die SMN-Beobachtungen konnten derzeit nicht abgerufen werden.', smnUnavailable: 'Für diesen Flugplatz ist keine repräsentative SMN-Beobachtung verfügbar.', ecmwfHourly: 'ECMWF-Stundenprognose', ecmwfDescription: 'Numerische Prognose für die genauen Koordinaten des Flugplatzes.', forecastError: 'Die Wetterprognose konnte derzeit nicht abgerufen werden.', forecastUnavailable: 'Für diesen Standort ist keine Wetterprognose verfügbar.', disclaimer: 'AeroInfo strukturiert diese Daten zur leichteren Nutzung. Prüfen Sie vor dem Betrieb stets METAR/SPECI, TAF, NOTAM, SIGMET und alle weiteren anwendbaren Luftfahrtinformationen über die entsprechenden offiziellen Quellen und Dienste. Diese Ansicht ist weder ein PIB noch ein offizielles Briefing.', metarDescription: 'Flugmeteorologische Beobachtung.', metarNoIcao: 'Dieser Eintrag besitzt kein ICAO-Kennzeichen; daher kann METAR/SPECI nicht über einen Flugplatzcode abgefragt werden.', metarError: 'METAR/SPECI konnte derzeit nicht abgerufen werden.', metarUnavailable: 'Für diesen Flugplatz ist kein METAR/SPECI verfügbar.', metarLatest: 'Neuester verfügbarer flugmeteorologischer Bericht.', originalMessage: 'Originalmeldung', category: 'Kategorie', received: 'Empfangen', reportOlderThanTwoHours: 'Bericht älter als 2 Stunden', tafDescription: 'Flugplatzwettervorhersage.', tafNoIcao: 'Dieser Eintrag besitzt kein ICAO-Kennzeichen; daher kann kein TAF über einen Flugplatzcode abgefragt werden.', tafError: 'Der TAF konnte derzeit nicht abgerufen werden.', tafUnavailable: 'Für diesen Flugplatz ist kein TAF verfügbar.', tafLatest: 'Flugplatzvorhersage und erwartete Änderungen während des Gültigkeitszeitraums.', issued: 'Ausgegeben', validFrom: 'Gültig ab', validUntil: 'Gültig bis', expectedEvolution: 'Erwartete Entwicklung', noDecodedSegments: 'Es sind keine dekodierten TAF-Segmente verfügbar.', conditionToReview: 'Zu prüfende Bedingung', changeExpectedToward: 'Erwartete Änderung gegen', phenomenon: 'Phänomen', clouds: 'Wolken', max: 'Max.', min: 'Min.', temp: 'Temp.', windShearAt: 'Windscherung gemeldet in', notDecoded: 'Nicht dekodiert', initialTafConditions: 'Anfängliche vorherrschende TAF-Bedingungen.', stationUsed: 'Verwendete Station', representativeness: 'Repräsentativität', stationDistance: 'Entfernung zur Station', outdatedData: 'Veraltete Daten', noRepresentativeLocalObservation: 'Keine repräsentative lokale Beobachtung', nearestStationPrefix: 'Die nächstgelegene verfügbare Wetterstation befindet sich in', nearestStationSuffix: 'Aufgrund dieser Entfernung stellt AeroInfo deren Messwerte nicht als lokale Bedingungen dieses Flugplatzes dar.', nearestReferenceStation: 'Nächstgelegene Referenzstation', presentWeather: 'Aktuelles Wetter', time: 'Zeit', condition: 'Bedingung', gust: 'Böe', precipitation: 'Niederschlag', model: 'Modell', horizon12h: 'Angezeigter Zeitraum: nächste 12 Stunden', noCloudLayers: 'Keine Wolkenschichten gemeldet', noPhenomenon: 'Kein Phänomen gemeldet', periodNotReported: 'Zeitraum nicht angegeben', noDescription: 'Keine Beschreibung', tafBase: 'Basis',
            phenomena: { mist: 'Dunst', fog: 'Nebel', rain: 'Regen', drizzle: 'Nieselregen', snow: 'Schnee', thunderstorm: 'Gewitter' },
            wx: { tsra: 'Gewitter mit Regen', minusTsra: 'Leichtes Gewitter mit Regen', plusTsra: 'Starkes Gewitter mit Regen', ra: 'Regen', minusRa: 'Leichter Regen', plusRa: 'Starker Regen', dz: 'Nieselregen', minusDz: 'Leichter Nieselregen', plusDz: 'Starker Nieselregen', br: 'Dunst', fg: 'Nebel', hz: 'Dunst', shra: 'Regenschauer', minusShra: 'Leichte Regenschauer', plusShra: 'Starke Regenschauer', sn: 'Schnee', minusSn: 'Leichter Schnee', plusSn: 'Starker Schnee', ts: 'Gewitter' },
            codes: { clear: 'Klar', mostlyClear: 'Überwiegend klar', partlyCloudy: 'Teilweise bewölkt', overcast: 'Bedeckt', fog: 'Nebel', rimeFog: 'Reifnebel', lightDrizzle: 'Leichter Nieselregen', moderateDrizzle: 'Mäßiger Nieselregen', heavyDrizzle: 'Starker Nieselregen', lightFreezingDrizzle: 'Leichter gefrierender Nieselregen', heavyFreezingDrizzle: 'Starker gefrierender Nieselregen', lightRain: 'Leichter Regen', moderateRain: 'Mäßiger Regen', heavyRain: 'Starker Regen', lightFreezingRain: 'Leichter gefrierender Regen', heavyFreezingRain: 'Starker gefrierender Regen', lightSnow: 'Leichter Schnee', moderateSnow: 'Mäßiger Schnee', heavySnow: 'Starker Schnee', snowGrains: 'Schneegriesel', lightShowers: 'Leichte Schauer', moderateShowers: 'Mäßige Schauer', heavyShowers: 'Starke Schauer', lightSnowShowers: 'Leichte Schneeschauer', heavySnowShowers: 'Starke Schneeschauer', thunderstorm: 'Gewitter', thunderstormHail: 'Gewitter mit Hagel', severeThunderstormHail: 'Starkes Gewitter mit Hagel' },
        },
    },

    home: {
        dataProvider:
        'ANAC / Secretaría de Transporte',
        pageTitle: 'Startseite',
        eyebrow: 'Nachvollziehbare Luftfahrtinformationen',
        title: 'Flugplätze und Hubschrauberlandeplätze in Argentinien finden',
        description:
            'Verzeichnis auf Grundlage von Daten der ANAC / Verkehrsbehörde mit Dokumentenverweisen und interaktiver Karte.',
        searchLabel: 'Flugplatz oder Hubschrauberlandeplatz suchen',
        searchPlaceholder:
            'Name, ICAO, IATA oder lokaler Code',
        search: 'Suchen',
        dataUpdate:
            'Datenstand · September 2026',
        databasePending:
            'Datenbankimport ausstehend',
        databasePendingDescription:
            'Die Benutzeroberfläche ist bereits verfügbar. Der dokumentierte ANAC-Import für September 2026 muss noch ausgeführt werden.',
        directory: 'Verzeichnis',
        exploreAerodromes:
            'Flugplätze erkunden',
        territorialView:
            'Geografische Ansicht',
        openMap:
            'Interaktive Karte öffnen',
    },

    map: {
        pageTitle: 'Landeskarte',
        eyebrow: 'Georeferenziertes Verzeichnis',
        title: 'Landeskarte',
        description:
            'Erkunden Sie die in der Datenbank erfassten Flugplätze und Hubschrauberlandeplätze anhand ihrer geografischen Lage.',
        viewList: 'Vollständige Liste anzeigen',
        facilities: 'Standorte',
        aerodromes: 'Flugplätze',
        heliports: 'Hubschrauberlandeplätze',
        aerodrome: 'Flugplatz',
        heliport: 'Hubschrauberlandeplatz',
        facility: 'Standort',
        filters: 'Filter',
        filtersActive: 'Aktive Filter',
        showFilters: 'Anzeigen',
        hideFilters: 'Ausblenden',
        allFacilities: 'Alle Standorte',
        allProvinces: 'Alle Provinzen',
        clearFilters: 'Filter zurücksetzen',
        argentina: 'Argentinien',
        visibleCount_one:
            '{{count}} sichtbarer Standort',
        visibleCount_other:
            '{{count}} sichtbare Standorte',
        cluster: 'Gruppierung',
        localCodeShort: 'Lokal',
        viewFullDetails:
            'Alle Details anzeigen',
        currentView: 'Aktuelle Ansicht',
        records: 'Einträge',
        noMatches:
            'Keine Standorte entsprechen den ausgewählten Filtern.',
        dataSource:
            'Daten: ANAC / Verkehrsbehörde · September 2026',
        mapDisclaimer:
            'Die Kartendarstellung dient ausschließlich zur Orientierung.',
    },

    sources: {
        defaultOrganization:
        'ANAC / Secretaría de Transporte',
        pageTitle: 'Quellen',
        eyebrow: 'Transparenz und Herkunft',
        title: 'Quellen und Methodik',
        description:
            'Aeroinfo dokumentiert die Herkunft der Daten und unterscheidet zwischen dem geografischen Verzeichnis und operationeller Luftfahrtdokumentation.',
        openSource:
            'Originalquelle öffnen',
        publicationCriteria:
            'Veröffentlichungskriterien',
        publicationCriteriaText:
            'Ein Eintrag im Verzeichnis bedeutet nicht automatisch, dass ein Standort zugelassen oder betriebsbereit ist. Fehlende Angaben werden als nicht verfügbar angezeigt und Abweichungen bleiben bis zur Prüfung offen.',
        traceability:
            'Nachvollziehbarkeit',
        traceabilityText:
            'Relevante Daten behalten ihre Herkunftsinformationen, damit die verwendete Quelle identifiziert und zukünftige Aktualisierungen überprüft werden können.',
        operationalUse:
            'Operationelle Nutzung',
        operationalUseText:
            'Aeroinfo ist ein Referenzwerkzeug und ersetzt keine offiziellen Luftfahrtveröffentlichungen, Vorfluginformationen oder anwendbare operationelle Dokumentation.',
    },

    theme: {
        selector: 'Darstellung',
        light: 'Hell',
        dark: 'Dunkel',
        system: 'System',
    },
};

export default de;
