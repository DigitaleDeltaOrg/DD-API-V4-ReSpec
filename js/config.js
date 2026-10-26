// Minimale ReSpec configuratie met localBiblio
var respecConfig = {
    specStatus: "wv",        // Werkversie, kan ook "ED", "WD", etc.
    shortName: "dd-api-v4",
    pubDomain: "api",
    title: "Digitale Delta API v4 Specificatie",
    nl_organisationName: "DigitaleDelta",
    latestVersion: ["nl_organisationPublishURL", "pubDomain", "/", "shortName", "/"],
    thisVersion: ["nl_organisationPublishURL", "pubDomain", "/", "specStatus", "-", "specType", "-", "shortName", "-", "publishDate"],
    prevVersion: ["nl_organisationPublishURL", "pubDomain", "/", "previousMaturity", "-", "specType", "-", "shortName", "-", "previousPublishDate"],
    useLogo: true,
    useLabel: true,
    addSectionLinks: true,
    specType: "Standaard",
    license: "cc-by",
    publishDate: "2026-11-01T00:00:00.000Z",
    version: "0.1.0",
    typeText: "DD API V4 specificatie",
    statusText: "Werkversie",
    language: "nl",
    editors: [ { name: "Jeroen Gerrits", company: "Vortech", companyURL: "https://vortech.nl" } ],
    authors: [ { name: "Geri Wolters", company: "EcoSys", companyURL: "https://ecosys.nl" } ],
    logos: [
        {
            src: "https://digitaledeltaorg.github.io/DigitalDeltaLogoOptimized.svg",
            alt: "Digitale Delta",
            height: 200,
            width: 100,
            url: "https://digitaledeltaorg.github.io/",
            id: "DigitaleDeltaLogo"
        }
    ],
    sotdText: {
        nl: {
            sotd: "Status van dit document",
            def: `Dit is de definitieve versie van dit document. Wijzigingen naar aanleiding van consultaties zijn doorgevoerd.`,
            wv: `Dit is een werkversie die op elk moment kan worden gewijzigd, verwijderd of vervangen door andere documenten. Het is geen stabiel document.`,
            cv: `Dit is een consultatieversie. Commentaar over dit document kan gestuurd worden naar `,
            vv: `Dit is de definitieve conceptversie van dit document. Wijzigingen naar aanleiding van consultaties zijn doorgevoerd.`,
            basis: "Dit is een document zonder officiÃ«le status.",
            ld: "Dit is een levend document dat regelmatig gewijzigd wordt."
        },
        en: {
            sotd: "Status of this document",
            def: `This is the definitive version of this document. Edits resulting from consultations have been applied.`,
            wv: `This is a working draft that can be changed, removed or replaced by other documents at any time. It is not a stable document.`,
            cv: `This is a stable draft, published for public comment. Comments regarding this document may be sent to `,
            vv: `This is the final draft of this document. Edits resulting from consultations have been applied.`,
            basis: "This document has no official standing.",
            ld: "This is a living document, which is updated regularly."
        },
    },
    licenses: {
        cc0: {
            name: "Creative Commons 0 Public Domain Dedication",
            short: "CC0",
            url: "https://creativecommons.org/publicdomain/zero/1.0/",
            image:
                "https://tools.geostandaarden.nl/respec/style/logos/CC-Licentie.svg",
        },
        "cc-by": {
            name: "Creative Commons Attribution 4.0 International Public License",
            short: "CC-BY",
            url: "https://creativecommons.org/licenses/by/4.0/legalcode",
            image: "https://tools.geostandaarden.nl/respec/style/logos/cc-by.svg",
        }
    },
    labelColor: {
        def: "#045D9F",
        wv: "#FF0000",
        cv: "#045D9F",
        vv: "#045D9F",
        basis: "#80CC28",
        ld: "#80CC28"
    },
    // Local bibliography
    localBiblio: {
        "CoverageJSON": {
            href: "https://covjson.org/",
            publisher: "CoverageJSON",
            title: "CoverageJSON"
        },
        "OpenAPI 3.1": {
            href: "https://spec.openapis.org/oas/v3.0.0.html",
            publisher: "OpenAPI Initiative",
            title: "OpenAPI Specification 3.1.0"
        },
        "JWT": {
            authors: ["M. Jones, J. Bradley, N. Sakimura"],
            date: "may 2015",
            href: "https://tools.ietf.org/html/rfc7519",
            publisher: "IETF",
            title: "JSON Web Token (JWT)"
        },
        "NEN3610": {
            authors: [""],
            date: "Maart 2011",
            href: "https://www.nen.nl/nen-3610-2011-a1-2016-nl-217738",
            publisher: "Nederlands Normalisatie-instituut",
            title: "Basismodel Geo-informatie - Termen, definities, relaties en algemene regels voor de uitwisseling van informatie over aan de aarde gerelateerde ruimtelijke objecten"
        },
        "SemVer": {
            authors: ["T. Preston-Werner"],
            date: "June 2013",
            href: "https://semver.org",
            title: "Semantic Versioning 2.0.0"
        },
        "UUID": {
            authors: ["P. Leach", "M. Mealling", "R. Salz"],
            date: "July 2005",
            href: "https://tools.ietf.org/html/rfc4122",
            publisher: "The Internet Engineering Task Force",
            title: "A Universally Unique IDentifier (UUID) URN Namespace"
        },
        "API": { title: "Application Programming Interface, een set van regels en protocollen voor het bouwen en integreren van softwaretoepassingen." },
        "RESTful": { title: "Representational State Transfer, een architecturale stijl voor gedistribueerde systemen die gebruik maakt van standaard HTTP-methoden." },
        "IHW": { title: "Informatiehuis Water](https://ihw.nl) is een samenwerkingsverband van Nederlandse waterbeheerders dat zich richt op het verbeteren van informatie-uitwisseling en -beheer in het waterdomein.", href: "https://ihw.nl"},
        "Digitale Delta": { title: "Een initiatief van Nederlandse waterbeheerders gericht op het verbeteren van de digitale gegevensuitwisseling in het waterdomein, beheerd door Informatiehuis Water.", href: "https://digitaledeltaorg.github.io" },
        "Observatie": { title: "Een meting of waarneming van een bepaald fenomeen op een specifieke locatie en tijd. De context van de observatie wordt beschreven met behulp van gestandaardiseerde vocabularia." },
        "Aquo": { title: "Een initiatief van Nederlandse waterbeheerders dat gestandaardiseerde vocabularia biedt voor het waterdomein, beheerd door [Informatiehuis Water](#dnf-ihw), de Aquo standaard.", href: "https://aquo.nl" },
        "OM&S": { title: "Observations, Measurements & Samples, een standaard van het Open Geospatial Consortium (OGC) voor het modelleren en uitwisselen van observatiegegevens.", href: "https://www.ogc.org/standards/om/" },
        "OData": { title: "OData, Open Data Protocol, is een standaard voor het bouwen en consumeren van RESTful API`s die gegevens modelleert en -toegang biedt via webprotocollen zoals HTTP.", href: "https://www.odata.org" },
        "EDM": { title: "Entity Data Model, een abstracte representatie van de data die wordt aangeboden via een API, beschreven in CSDL.", href: "https://www.odata.org" },
        "CSDL": { title: "Een XML-gebaseerde taal voor het beschrijven van het Entity Data Model in OData.", href: "https://www.odata.org" },
        "ANTLR": { title: "Abstract Syntax Tree Recognizer, een parser/tokenizer generator die grammatica's beschrijft in een specifieke taal.", href: "https://www.antlr.org" },
        "CRS": { title: "Coordinate Reference System, een systeem voor het definiëren van locaties op de aarde." },
        "ETRS89": { title: "European Terrestrial Reference System 1989, een geografisch coördinatenstelsel dat wordt gebruikt in Europa." },
        "EPSG": { title: "European Petroleum Survey Group, een organisatie die standaarden ontwikkelt voor geografische coördinatenstelsel en kaartprojecties. EPSG-codes worden gebruikt om een specifiek coördinatenstelsel te identificeren.", href: "https://epsg.org" },
        "WGS84": { title: "World Geodetic System 1984, een wereldwijd coördinatenstelsel dat wordt gebruikt voor gps." },
        "RD New": { title: "Rijksdriehoeksmeting, een coördinatenstelsel dat wordt gebruikt in Nederland." },
        "mTLS": { title: "Mutual Transport Layer, Security, een beveiligingsprotocol dat gebruikmaakt van certificaten voor wederzijdse authenticatie." },
        "OAuth2": { title: "Een autorisatieprotocol dat veilige toegang tot bronnen op een server mogelijk maakt zonder dat gebruikers hun wachtwoorden hoeven te delen.", href: "https://tools.ietf.org/html/rfc6749" },
        "OpenID Connect": { title: "Een authenticatielaag bovenop OAuth2 die gebruikersidentiteit verifieert en basisprofielinformatie verstrekt." },
        "API Key": { title: "Een unieke sleutel die wordt gebruikt om toegang te krijgen tot een API." },
        "Paginering": { title: "Het proces van het opdelen van een grote dataset in kleinere, beheersbare pagina's voor efficiëntere verwerking en weergave." },
        "Query-opties": { title: "Parameters die worden gebruikt om zoekopdrachten te verfijnen en filteren in een API." },
        "OGC": { title: "Open Geospatial Consortium, een internationale organisatie die standaarden ontwikkelt", href: "https://www.ogc.org" },
        "JSON": { title: "JavaScript Object Notation, een lichtgewicht data-uitwisselingsformaat dat gemakkelijk leesbaar is voor mensen en machines.", href: "https://json.org"  },
        "JSON Schema": { title: "Een vocabulaire voor het annoteren en valideren van de structuur van JSON-documenten.", href: "https://json.org" },
        "Profiel": { title: "Een specifieke configuratie of subset van een standaard die is afgestemd op een bepaald gebruiksgebied of toepassing." },
        "WebSub": { title: "Een webprotocol voor het publiceren en abonneren op berichten in real-time.", href: "https://www.w3.org/TR/websub/" }
    },
    plugins: {
        "core/data-include": {}
    }
};

// Zorg dat ReSpec de configuratie ziet
//globalThis.respecConfig = respecConfig;
