const pt = {
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
        sources: 'Fontes',

        mainNavigation:
            'Navegação principal',

        mobileNavigation:
            'Navegação móvel',

        openMenu:
            'Abrir menu',

        closeMenu:
            'Fechar menu',
    },

    common: {
        backToList:
            'Voltar à lista',
        notReported:
            'Não informado',
        unavailable:
            'Indisponível',
        available:
            'Disponível',
        source: 'Fonte',
        from: 'Desde',
        until: 'Até',
        permanent:
            'Permanente',
        location:
            'Localização',
    },

    aerodrome: {
        mainInformation:
            'Informações principais',
        identification:
            'Identificação',
        icaoCode:
            'Código ICAO',
        iataCode:
            'Código IATA',
        localCode:
            'Código local',
        type: 'Tipo',
        useTraffic:
            'Uso / tráfego',
        province:
            'Província',
        infrastructure:
            'Infraestrutura',
        runways: 'Pistas',
        runwayDesignation:
            'Designação',
        surface:
            'Superfície',
        length:
            'Comprimento',
    },

    weather: {
        section:
            'Meteorologia',
        conditionsForecast:
            'Condições e previsão',
        temperature:
            'Temperatura',
        dewpoint:
            'Ponto de orvalho',
        humidity:
            'Umidade',
        pressure:
            'Pressão',
        visibility:
            'Visibilidade',
        wind: 'Vento',
        cloud:
            'Nebulosidade',
        observed:
            'Observado',
        forecast:
            'Previsão',
    },

    notam: {
        section:
            'Informações operacionais',
        title: 'NOTAM ativos',
        active_one:
            '{{count}} NOTAM ativo',
        active_other:
            '{{count}} NOTAM ativos',
        information:
            'Informação',
        original:
            'Ver texto original',
        spanishVersion:
            'Ver versão em espanhol',
        runway: 'Pista',
        taxiway:
            'Taxiway',
        approachAid:
            'Auxílio de aproximação',
        navigationAid:
            'Auxílio à navegação',
        apron:
            'Pátio',
        obstacle:
            'Obstáculo',
        procedure:
            'Procedimento',
        other: 'Outro',
    },

    footer: {
        reference:
            'Informações aeronáuticas para referência. Não substituem publicações oficiais.',
        data: 'Dados',
        dataDate: 'Setembro de 2026',
        independentProject:
            'Projeto independente',
        designDevelopment:
            'Design e desenvolvimento',
    },

    aerodromeIndex: {
        pageTitle:
            'Aeródromos e helipontos',

        eyebrow:
            'Inventário nacional',

        title:
            'Aeródromos e helipontos',

        description:
            'Explore o inventário carregado a partir da ANAC / Secretaria de Transporte usando nomes, códigos e filtros regionais.',

        records:
            'Registros',

        searchPlaceholder:
            'Nome, ICAO, IATA ou código local',

        filters:
            'Filtros',

        allProvinces:
            'Todas as províncias',

        allTypes:
            'Todos os tipos',

        apply:
            'Aplicar',

        clear:
            'Limpar',

        searchAction:
            'Aplicar pesquisa',

        activeFilters:
            'Filtros ativos',

        showing:
            'Mostrando {{from}} – {{to}} de {{total}} registros',

        installation:
            'Instalação',

        code:
            'Código',

        type:
            'Tipo',

        province:
            'Província',

        detail:
            'Detalhes',

        viewDetails:
            'Ver detalhes',

        noResults:
            'Nenhum resultado encontrado',

        noResultsHelp:
            'Tente outro nome, código ou combinação de filtros.',
    },

    show: {
        noPublishedCode: 'SEM CÓDIGO PUBLICADO', locationNotReported: 'Localização não informada', viewNationalMap: 'Ver mapa nacional', noRunwayData: 'Não há informações validadas de pistas associadas a este registro.', traceability: 'Rastreabilidade', unidentifiedSource: 'Fonte não identificada', consulted: 'Consultado', openSource: 'Abrir fonte', noReferences: 'Não há referências associadas a este registro.', georeference: 'Georreferência', latitude: 'Latitude', longitude: 'Longitude', elevation: 'Elevação', validationStatus: 'Estado de validação', openOpenStreetMap: 'Abrir no OpenStreetMap', notice: 'Aviso', noticeText: 'Esta ficha organiza informações aeronáuticas públicas para consulta. Não substitui publicações aeronáuticas aplicáveis nem informações pré-voo.',
        notam: { noData: 'Não há informações NOTAM disponíveis.', noIndicator: 'Este registro não possui um indicador local associado para consultar NOTAM no AIS ANAC.', disabled: 'A consulta NOTAM está temporariamente desativada.', error: 'Não foi possível consultar os NOTAM do AIS ANAC neste momento.', noAerodromeData: 'Não há informações NOTAM disponíveis para este aeródromo.', noneActive: 'Sem NOTAM ativos', descriptionStart: 'Avisos publicados no AIS ANAC para o indicador', descriptionEnd: 'O texto original é sempre preservado e a versão em espanhol é exibida quando disponível.', noneForIndicator: 'O AIS ANAC não informa NOTAM ativos para este indicador neste momento.', referenceDisclaimer: 'Fonte: AIS ANAC · Informação de referência. Não substitui o PIB nem as informações pré-voo obtidas pelos canais oficiais.', openAnac: 'Abrir AIS ANAC', textNotReported: 'Texto não informado' },
        status: { noData: 'Sem dados', outdated: 'Desatualizado', error: 'Erro', noLocalObservation: 'Sem observação local', disabled: 'Desativado' },
        weather: {
            noData: 'Não há informações meteorológicas disponíveis.', aeronauticalInformation: 'Informações meteorológicas aeronáuticas', metarTafTitle: 'METAR / SPECI e TAF', metarTafDescription: 'Produtos meteorológicos aeronáuticos associados ao designador ICAO do aeródromo. A mensagem original é sempre preservada junto com uma leitura estruturada.', complementaryInformation: 'Informações complementares', smnEcmwfTitle: 'Observação SMN e tendência ECMWF', smnEcmwfDescription: 'Dados complementares para ampliar o contexto meteorológico. Não substituem os produtos meteorológicos aeronáuticos aplicáveis.', smnObservation: 'Observação SMN', smnDescription: 'Condições observadas por estações do Serviço Meteorológico Nacional.', smnError: 'Não foi possível consultar as observações do SMN neste momento.', smnUnavailable: 'Não há uma observação SMN representativa disponível para este aeródromo.', ecmwfHourly: 'Previsão horária ECMWF', ecmwfDescription: 'Previsão numérica calculada para as coordenadas específicas do aeródromo.', forecastError: 'Não foi possível consultar a previsão meteorológica neste momento.', forecastUnavailable: 'Não há previsão meteorológica disponível para esta localização.', disclaimer: 'AeroInfo organiza estes dados para facilitar a consulta. Verifique sempre METAR/SPECI, TAF, NOTAM, SIGMET e demais informações aeronáuticas aplicáveis nas fontes e serviços oficiais correspondentes antes da operação. Esta visualização não constitui um PIB nem um briefing oficial.', metarDescription: 'Observação meteorológica aeronáutica.', metarNoIcao: 'Este registro não possui designador ICAO, portanto não é possível consultar METAR/SPECI pelo código do aeródromo.', metarError: 'Não foi possível consultar METAR/SPECI neste momento.', metarUnavailable: 'Não há METAR/SPECI disponível para este aeródromo.', metarLatest: 'Último informe meteorológico aeronáutico disponível.', originalMessage: 'Mensagem original', category: 'Categoria', received: 'Recebido', reportOlderThanTwoHours: 'Informe com mais de 2 horas', tafDescription: 'Previsão meteorológica de aeródromo.', tafNoIcao: 'Este registro não possui designador ICAO, portanto não é possível consultar TAF pelo código do aeródromo.', tafError: 'Não foi possível consultar o TAF neste momento.', tafUnavailable: 'Não há TAF disponível para este aeródromo.', tafLatest: 'Previsão de aeródromo e mudanças previstas durante seu período de validade.', issued: 'Emitido', validFrom: 'Válido desde', validUntil: 'Válido até', expectedEvolution: 'Evolução prevista', noDecodedSegments: 'O TAF não contém segmentos decodificados disponíveis.', conditionToReview: 'Condição a revisar', changeExpectedToward: 'Mudança prevista para', phenomenon: 'Fenômeno', clouds: 'Nuvens', max: 'Máx.', min: 'Mín.', temp: 'Temp.', windShearAt: 'Wind shear informado a', notDecoded: 'Não decodificado', initialTafConditions: 'Condições predominantes iniciais do TAF.', stationUsed: 'Estação utilizada', representativeness: 'Representatividade', stationDistance: 'Distância até a estação', outdatedData: 'Dado desatualizado', noRepresentativeLocalObservation: 'Sem observação local representativa', nearestStationPrefix: 'A estação meteorológica disponível mais próxima encontra-se a', nearestStationSuffix: 'Por essa distância, o AeroInfo não apresenta suas medições como condições locais deste aeródromo.', nearestReferenceStation: 'Estação de referência mais próxima', presentWeather: 'Tempo presente', time: 'Hora', condition: 'Condição', gust: 'Rajada', precipitation: 'Precip.', model: 'Modelo', horizon12h: 'Horizonte exibido: próximas 12 horas', noCloudLayers: 'Sem camadas informadas', noPhenomenon: 'Sem fenômeno informado', periodNotReported: 'Período não informado', noDescription: 'Sem descrição', tafBase: 'Base',
            phenomena: { mist: 'Névoa', fog: 'Nevoeiro', rain: 'Chuva', drizzle: 'Garoa', snow: 'Neve', thunderstorm: 'Trovoada' },
            wx: { tsra: 'Trovoada com chuva', minusTsra: 'Trovoada fraca com chuva', plusTsra: 'Trovoada forte com chuva', ra: 'Chuva', minusRa: 'Chuva fraca', plusRa: 'Chuva forte', dz: 'Garoa', minusDz: 'Garoa fraca', plusDz: 'Garoa forte', br: 'Névoa', fg: 'Nevoeiro', hz: 'Bruma', shra: 'Pancadas de chuva', minusShra: 'Pancadas fracas', plusShra: 'Pancadas fortes', sn: 'Neve', minusSn: 'Neve fraca', plusSn: 'Neve forte', ts: 'Trovoada' },
            codes: { clear: 'Céu limpo', mostlyClear: 'Predominantemente limpo', partlyCloudy: 'Parcialmente nublado', overcast: 'Encoberto', fog: 'Nevoeiro', rimeFog: 'Nevoeiro com geada', lightDrizzle: 'Garoa fraca', moderateDrizzle: 'Garoa moderada', heavyDrizzle: 'Garoa forte', lightFreezingDrizzle: 'Garoa congelante fraca', heavyFreezingDrizzle: 'Garoa congelante forte', lightRain: 'Chuva fraca', moderateRain: 'Chuva moderada', heavyRain: 'Chuva forte', lightFreezingRain: 'Chuva congelante fraca', heavyFreezingRain: 'Chuva congelante forte', lightSnow: 'Neve fraca', moderateSnow: 'Neve moderada', heavySnow: 'Neve forte', snowGrains: 'Grãos de neve', lightShowers: 'Pancadas fracas', moderateShowers: 'Pancadas moderadas', heavyShowers: 'Pancadas fortes', lightSnowShowers: 'Pancadas fracas de neve', heavySnowShowers: 'Pancadas fortes de neve', thunderstorm: 'Trovoada', thunderstormHail: 'Trovoada com granizo', severeThunderstormHail: 'Trovoada forte com granizo' },
        },
    },

    home: {
        dataProvider:
        'ANAC / Secretaría de Transporte',
        pageTitle: 'Início',
        eyebrow: 'Informação aeronáutica · Argentina',
        title: 'Encontre aeródromos e helipontos na Argentina',
        description:
            'Inventário baseado em dados da ANAC / Secretaria de Transporte, com referências documentais e mapa interativo.',
        searchLabel: 'Buscar aeródromo ou heliponto',
        searchPlaceholder:
            'Nome, ICAO, IATA ou código local',
        search: 'Buscar',
        dataUpdate:
            'Atualização dos dados · Setembro de 2026',
        databasePending:
            'Importação da base de dados pendente',
        databasePendingDescription:
            'A interface já está disponível. Ainda é necessário executar o processo documentado de importação da ANAC correspondente a setembro de 2026.',
        directory: 'Diretório',
        exploreAerodromes:
            'Explorar aeródromos',
        territorialView:
            'Visualização territorial',
        openMap:
            'Abrir mapa interativo',
    },

    map: {
        pageTitle: 'Mapa nacional',
        eyebrow: 'Inventário georreferenciado',
        title: 'Mapa nacional',
        description:
            'Explore aeródromos e helipontos registrados na base por meio de sua localização geográfica.',
        viewList: 'Ver lista completa',
        facilities: 'Instalações',
        aerodromes: 'Aeródromos',
        heliports: 'Helipontos',
        aerodrome: 'Aeródromo',
        heliport: 'Heliponto',
        facility: 'Instalação',
        filters: 'Filtros',
        filtersActive: 'Filtros ativos',
        showFilters: 'Mostrar',
        hideFilters: 'Ocultar',
        allFacilities: 'Todas as instalações',
        allProvinces: 'Todas as províncias',
        clearFilters: 'Limpar filtros',
        argentina: 'República Argentina',
        visibleCount_one:
            '{{count}} instalação visível',
        visibleCount_other:
            '{{count}} instalações visíveis',
        cluster: 'Agrupamento',
        localCodeShort: 'Local',
        viewFullDetails:
            'Ver detalhes completos',
        currentView: 'Vista atual',
        records: 'registros',
        noMatches:
            'Nenhuma instalação corresponde aos filtros selecionados.',
        dataSource:
            'Dados: ANAC / Secretaria de Transporte · Setembro de 2026',
        mapDisclaimer:
            'A representação cartográfica é apenas orientativa.',
    },

    sources: {
        defaultOrganization:
        'ANAC / Secretaría de Transporte',
        pageTitle: 'Fontes',
        eyebrow: 'Transparência e procedência',
        title: 'Fontes e metodologia',
        description:
            'Aeroinfo preserva a procedência dos dados e distingue entre inventário geográfico e documentação aeronáutica operacional.',
        openSource:
            'Abrir fonte original',
        publicationCriteria:
            'Critério de publicação',
        publicationCriteriaText:
            'A presença de um registro no inventário não implica, por si só, autorização ou condição operacional. Dados ausentes são indicados como não informados e discrepâncias permanecem pendentes de revisão.',
        traceability:
            'Rastreabilidade',
        traceabilityText:
            'Os dados relevantes mantêm sua procedência para permitir a identificação da fonte utilizada e a revisão de futuras atualizações.',
        operationalUse:
            'Uso operacional',
        operationalUseText:
            'Aeroinfo é uma ferramenta de referência e não substitui publicações aeronáuticas oficiais, informações pré-voo ou documentação operacional aplicável.',
    },

    theme: {
        selector: 'Tema visual',
        light: 'Claro',
        dark: 'Escuro',
        system: 'Sistema',
    },
};

export default pt;
