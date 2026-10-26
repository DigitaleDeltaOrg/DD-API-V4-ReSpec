# Wijzigingen

<aside class="advisement" title="Work-in-progress">
De specificatie is nog in ontwikkeling. Tot deze finaal is, zal de specificatie nog kunnen veranderen.
De principes staan echter vast. 

Specificaties van de onderliggende semantiek (eigenschappen die mogen worden gebruikt in de API)
kunnen los van deze (technische) specificatie veranderen. Die informatie is te vinden in de folders /definitions/<domein>/<yyyyMMdd>.
</aside>

In grote lijnen blijft V4 gelijk aan V3: 

- REST-gebaseerd
- _READ/ONLY_ API
- JSON als primair response formaat.
- OData als zoekmechanisme
- OM&S/CoverageJSON als standaard formaten binnen de OData responses.

Er zijn een aantal wijzigingen ten opzichte van DD API V3. Op hoofdlijnen zijn dat:

- JSON-FG wordt het standaardformaat voor geo-gerelateerde responses, met GeoJSON als fallback indien ondersteund/aangegeven.
- Naamgeving: camelCase wordt de basis voor property-namen.
- Taalondersteuning: bepaalde begrippen/eigenschappen kunnen in het Engels en Nederlands worden aangeboden.
- Splitsing van `/v3/references` in logischere blokken voor `parameters` en `foi` (meetobjecten/locaties).
- Specifieke endpoints voor geo-specifieke responses, met name voor meetobjecten.
- Feature of Interest/FoI verandert van Entity naar ComplexType; identifiers worden hernoemd voor consistentie.
- Strakkere semantiek: responses bevatten informatie over de gebruikte semantiek/definitie-set en versie. Deze informatie komt ook terug in `$metadata` en de OpenAPI-specificatie.
- `modifiedOn` wordt verplaatst van metadata naar de observatie zelf.
- De OpenAPI Specification gaat van versie 3.0.x naar 3.1.x. Hiermee wordt mTLS een `first-class citizen`.
- Via headers wordt informatie gedeeld over de gebruikte semantiek, ondersteunde responseformaten, bekende profielen en beschikbare capabilities.
- Optionele functionaliteit wordt toegevoegd voor selectie, paginering en aggregatie binnen coverages.
- Profielen geven informatie over verplichte- en mogelijke aanwezigheid van eigenschappen binnen observaties.
- `Rules` beschrijven ook welke eigenschappen wanneer vereist, toegestaan of verboden zijn, maar ook of ze gecombineerd moeten of kunnen worden.
- De OpenAPI-specificatie van V4 wordt gepubliceerd als machineleesbare endpoint-beschrijving, bijvoorbeeld op `https://.../v4/openapi.json`.
- ADR 2.0 vraagt om een mensleesbare landing page. DD API V4 adviseert Scalar als interactieve documentatie-UI voor de OpenAPI-specificatie. De landing page bevat daarnaast relevante informatie uit het discovery document en links naar de machine-leesbare OpenAPI-specificatie.
- Discovery beschrijft welke datasets/data-aanbiedingen, endpoints, profielen, capabilities en semantiek beschikbaar zijn. Dit wordt vastgelegd in een formaat dat compatibel is met DCAT-NL. In DD API V4 heet dat een manifest.
- Nieuwe OData Custom functies ('has')
- Vocab of VocabTerm wordt Category, wat een correcte term is volgens OM&S. De elementen zijn: namespace en code, waarbij namespace wordt geïnterpreteerd als domeintabel en code als de domeinwaarde.

## Discovery (manifest)

DD API V4 gebruikt een manifest document dat aangeeft welke versie, semantiek en schemaversie van de specificatie wordt gebruikt. 
Het manifest heeft een vast formaat, deels gebaseerd op DCAT-NL. 

Het manifest beschrijft naast bovengenoemde ook de datasets, eigenaarschap, toegangvereisten, etc.
Het kan gebruikt worden om een mensleesbare landing page te genereren.
Een bestand dat als template kan dienen hiervoor staat [hier](/definitions/v4.0/manifest.json).

## Naamgeving

Alle eigenschappen worden in camelCase geschreven, tenzij een specifiek binnen DD API gebruikt formaat, zoals JSON-FG of 
CoverageJSON, een andere schrijfwijze voorschrijft.

Een aantal eigenschappen in DD API V4 een krijgt andere naam.
De naamswijzigingen zijn beschreven in het bestand `/definitions/v3-to-v4.csv`, los van deze specificatie.

## Toevoegingen

`result/measure` wordt uitgebreid met twee optionele eigenschappen:

- 'namespace' (result/measure/namespace) 
- result/measure/limitSymbol.

In namespace kan worden aangegeven dat de eenheid in een niet-standaard domein vastligt.

Foi (Feature of Interest) wordt uitgebreid met de secties `identifications` en `classifications`.
Hierin kunnen respectievelijk identiteiten en classificaties voor systematieken worden vastgelegd:

Identities/identiteiten:

`foi/identities/stowa` (Stichting Toegepast Onderzoek Waterbeheer)
`foi/identities/bro` (BasisRegistratie Ondergrond)
`foi/identities/wkp` (Waterkwaliteitsportaal)
`foi/identities/lmw` (Landelijk Meetnet Water)

Classifications/classificaties:

`foi/classifications/kwrWaterType` (Kader Richtlijn Water)
`foi/classifications/krwMonitoringType` (Kader Richtlijn Water)
`foi/classifications/krwStatus` (Kader Richtlijn Water)
`foi/classifications/stowa` (Stichting Toegepast Onderzoek Waterbeheer)
`foi/classifications/ecotopeNL` (Nederlands sectorenstelsel, o.a. ZES.1, RES, BES, MES, KES)

Deze identiteiten en classificaties zijn via de semantiek uit te breiden, ook naar andere domeinen.

### Profiles

Een systeem kan aangeven welke profielen het ondersteunt. Profielen beschrijven de semantische toepassingscontext waarin gegevens worden aangeboden.

Profielen bepalen welke semantische eigenschappen uit de actieve definitie-set binnen `SemanticPropertyBag`-velden zoals `parameter` en `metadata` beschikbaar zijn. Rules kunnen daarbinnen bepalen of eigenschappen verplicht, optioneel, toegestaan of verboden zijn.

Profielen bepalen niet het resultaattype van een observatie. Het resultaattype wordt bepaald door `Observation.type` en gedeclareerd via `DD-V4-ResultTypes`.

De initiële profielen zijn:

- `Observations`: losse waarnemingen
- `TimeSeries`: tijdreeksen
- `Expectations`: verwachtingen
- `Ensembles`: ensembles of meerdere realisaties
- `Ecology`: ecologische observaties
- `WaterQuality`: observaties voor waterkwaliteit
- `WaterQuantity`: observaties voor waterkwantiteit
- `All`: geldt voor alle profielen

## Headers

V4-implementaties kunnen de volgende headers meesturen:

### Header DD-V4-Manifest (verplicht)

De inhoud van deze header is een link naar de hierboven beschreven manifest.

### Header DD-V4-Semantics (verplicht).

De inhoud van deze header is een URL naar een folder waarin beschreven staat wat geaccepteerde informatie is voor DD API V4.
Die folder bevat:

`semantics.csv`: beschrijft de mogelijke waarden voor de semantiek. Het bestand naam (Engels en Nederlands), data type en beschrijving (Engels en Nederlands).
`profiles.csv`: beschrijft de mogelijke profielen. (alleen voor degenen die DD API service gaan aanbieden)
`rules.csv`: beschrijft de mogelijke spelregels: wat wanneer verplicht of acceptabel is en voor welke profielen de eigenschappen gelden. (alleen voor degenen die DD API service gaan aanbieden)
`capabilities.csv`: beschrijft de mogelijke functionaliteiten die de implementatie kan aanbieden. (alleen voor degenen die DD API service gaan aanbieden)

Het volgende schema toont de verbanden tussen de headers en de definition-set.json/CSV-bestanden):

![DD API architectuur](media/DD-API-V4-definition-relations.svg)

### Header DD-V4-ResultTypes (verplicht).

Dit beschrijft welke resultaattypes de implementatie ondersteunt. Het is een komma-gescheiden lijst van resultaattypes die de implementatie ondersteunt.
Mogelijke waarden zijn: measure, truth, count, category, coverage

### Header DD-V4-Capabilities (optioneel).

Een komma-gescheiden lijst met functionaliteiten die de implementatie ondersteunt. De toegestane waarden staan in bestand capabilities.csv in de folder waarin beschreven staat wat geaccepteerde informatie is voor DD API V4.

### Header DD-V4-Profiles (verplicht).

Dit beschrijft welke profielen de implementatie ondersteunt. Het is een komma-gescheiden lijst van profielen die de implementatie ondersteunt. 
De toegestane waarden staan in bestand profiles.csv in de folder waarin beschreven staat wat geaccepteerde informatie is voor DD API V4.

## Taalschakelaar (optioneel)

V4 krijgt een taalschakelaar voor de responses die via de API wordt verkregen. Daarmee kunnen Engelse termen vertaald worden naar Nederlandse.
Dit is beperkt tot elementen in de gegevensblokken Parameter en Metadata. 
Ook zal de taalschakelaar de termen daar voor vertalen in de /v4/odata/$metadata en de OAS-definities.
Zelf vertalen is niet nodig, omdat de vertalingen gebruikt moeten worden die afkomstig zijn van de officiële gegevenslijsten van DD API.

## Strakkere semantiek

Hiermee wordt ook een beperking uit DD API V3 ondervangen. In V3 is de gebruikte semantiek grotendeels impliciet onderdeel van de CSDL. 
Gegenereerde clients en andere tooling kunnen daardoor afhankelijk worden van een specifieke set definities, zonder dat expliciet zichtbaar is 
voor welke semantiek zij zijn gegenereerd.

Door de gebruikte semantiek expliciet te vermelden in de `DD-V4-Semantics` header, kunnen clients, generatoren en andere tooling bepalen of de response 
aansluit bij de definities waarvoor zij zijn ingericht. Dit maakt uitbreidingen van definities beter beheersbaar en verkleint de kans op onbedoelde incompatibiliteit.

De waarde bestaat uit een semantisch domein (bijvoorbeeld water) en een referentiedatum (bijvoorbeeld 20261101). 
Ze staan op een vaste plek: [https://digitaledeltaorg.github.io/definitions/](https://digitaledeltaorg.github.io/DD-API-V4-ReSpec/definitions/). 
Samen is dat dan [https://digitaledeltaorg.github.io/definitions/v4/water/20261101](https://digitaledeltaorg.github.io/DD-API-V4-ReSpec/definitions/water/20261101).
Hiermee kunnen toevoegingen aan de definities plaatsvinden zonder neveneffecten: ook generatoren die gebruik maken van de CSDL kunnen dan zien of de definitie voor die implementatie opnieuw moet worden gegenereerd.

Aan versies in de semantiek mogen alleen toevoegingen worden gemaakt. Wijzigingen of verwijderingen zijn niet toegestaan.

## Functionaliteit

### Profiles

Een systeem kan aangeven welke soorten resultaten het kent voor observations.

- Values: losse meetwaarden zonder tijdreeks-structuur
- Series: meetwaarden geordend langs een tijdas
- Grids: meetwaarden geordend langs twee of meer assen, zonder dat de assen binnen deze capability als geometrie worden geïnterpreteerd
- Expectations: verwachte of voorspelde meetwaarden
- Ensembles: meerdere leden of realisaties van dezelfde verwachting, simulatie of dataset
- Collections: technische bundeling van meerdere zelfstandige coverages in één response
- Ecology: ecologische observatie  
- WaterQuality: observatie voor waterkwaliteit
- WaterQuantity: observatie voor waterkwantiteit

Profielen kunnen overlappen. Zo is veel WaterQuality ook voor Ecology relevant.
Het speciale profiel 'All' geeft aan dat eigenschappen uit de semantiek voor alle profielen gelden.

### Capabilities

Geeft aan welke optionele functionaliteit wordt geleverd door het systeem.
De mogelijke opties staan [hier](/definitions/capabilities.csv) beschreven. 

Voorbeeld: `CoverageFunctions, Profiles`

## Nieuwe eindpunten en aanpassing van bestaande

De nieuwe eindpunten komen _naast_ /v3 te staan en zullen de aanduiding /v4 krijgen. Hierdoor kunnen V3 en V4 naast elkaar staan in dezelfde service.

v3 maakte gebruik van /v3/reference voor ophalen van kennis van het systeem: de referenties.
In v4 wordt dit vervangen door meer gespecialiseerde eindpunten:

- /v4/odata/parameters voor *begrippen en waarden* binnen het gegevensblok _parameter_. De taalschakelaar wordt hier toegepast. Uitvoer is in OData.
- /v4/odata/foi voor meetobjecten via OData. Uitvoer is volgens OData. De geometrie is in GeoJSON/JSON-FG uitgedrukt. 
- /v4/geo/measurementobjects voor meetobjecten in geo-formaten (JSON-FG). Filtering gaat via specifieke parameters, niet via OData. Uitvoer is in JSON-FG FeatureCollection.
- /v4/geo/measurementobjects/{id} voor een meetobject in geo-formaat (JSON-FG). Filtering is er niet: het meetobject heeft als identificatie 'id'. Uitvoer is in JSON-FG Feature.

## Standaarden

De JSON-eigenschappen volgen de camelCasing schrijfwijze. Dit heeft impact op (nagenoeg) alle eigenschappen.
 
### OpenAPI 3.1

OpenAPI 3.1 is de nieuwste versie van de OpenAPI-specificatie, die wordt gebruikt om de DD API V4 te documenteren.

### JSON-FG

JSON-FG is een uitbreiding op GeoJSON voor het uitwisselen van geografische features met aanvullende ondersteuning voor 
onder andere coördinatenreferentiesystemen (CRS), feature types en temporele eigenschappen.

JSON-FG en GeoJSON worden binnen deze API als afzonderlijke representaties aangeboden:

- Bij JSON-FG volgt de geometrie-representatie de JSON-FG-specificatie. De `place` member kan worden gebruikt voor geometrieën in een ander coördinatenreferentiesysteem dan CRS84. De `geometry` member kan worden opgenomen als GeoJSON-compatible fallback, maar is binnen de JSON-FG-representatie niet verplicht.
- Bij GeoJSON MOET iedere `Feature` een niet-null `geometry` member bevatten met een geldige GeoJSON Geometry in CRS84, met coördinaten-volgorde longitude, latitude.

Wanneer `place` in een JSON-FG-response aanwezig is en niet in CRS84 is uitgedrukt, MOET `coordRefSys` aanwezig zijn.

Algemeen geldt:

- GeoJSON is geldige JSON-FG.
- JSON-FG kan eigenschappen bevatten die niet door alle GeoJSON-clients worden geïnterpreteerd.
- JSON-FG heeft eigenschappen die mogen ontbreken, maar die verplicht zijn in GeoJSON, zoals `geometry`.
  JSON-FG is het standaard uitvoerformaat voor de geo-eindpunten van deze API.

Wanneer maximale compatibiliteit met bestaande GeoJSON-clients gewenst is, kan GeoJSON expliciet worden gevraagd via
de `Accept-GeoFormat` header en waarde `geojson` of via query-parameter `geoformat=geojson`.

Via JSON-FG kunnen ook optionele koppelingen worden opgenomen die verwijzen naar andere systemen.

> Binnen het DD API V4 geo-profiel is `geometry` echter wel verplicht, ook wanneer JSON-FG als primair formaat 
> wordt gebruikt.

> De JSON-voorbeelden hieronder bevatten opmerkingen en zijn daarom JSONC. Verwijder de opmerkingen (`//`) om geldige JSON te produceren.

```jsonc
{
	"id": "https://example.nl/id/geoobject/4711",
	"type": "Feature",

    // Voor JSON-FG: geeft aan waaraan de response voldoet
	"conformsTo" : [
		"https://www.opengis.net/spec/json-fg-1/1.0/conf/core",
		"https://www.opengis.net/spec/json-fg-1/1.0/conf/polyhedra"
	],

	"featureType": "Inlaat", // Moet voorkomen in feature-types.csv voor semantiek/versie.  

    // Altijd nodig
    "geometry": {
        "type": "Point",
        "coordinates": [5.90, 52.25]
    },
    
    // Geometrie uitgedrukt in de CRS zoals aangegeven met Accept-CRS
    "place": {
        "type": "Point",
        "coordinates": [190017.8, 473674.3]
    },
    
    // Verplicht wanneer Accept-Crs niet CRS84 (WGS84 lon lat) is. De hele dataset gebruikt dit stelsel. Omdat DD API standaard ETRS89 doet, is dit verplicht.
    "coordRefSys": "https://www.opengis.net/def/crs/EPSG/0/28992",
    
    // Eigenschappen van het domeinobject.
    // Deze kunnen verwijzen naar externe registraties,
    // classificatiestelsels en andere objecten.
	"properties": {
		"description": "Waterkering Ijssel",

        // Identificaties in andere systemen. Optioneel.
		"identities": [
			{ "identity": "WK12345",    "domain": "https://example.nl/id/waterschap" },
			{ "identity": "98765",      "domain": "https://example.nl/id/damo" },
			{ "identity": "RWS-112233", "domain": "https://example.nl/id/wrd" },
			{ "identity": "IMWA-4455",  "domain": "https://example.nl/id/imwa" }
		],

        // Classificaties in andere systemen. Optioneel.
		"classifications": [
			{
				"system": "https://example.nl/id/begrippenkader/krw",
				"value": "M14",
				"label": "KRW-waterlichaam type M14"
			},
			{
				"system": "https://example.nl/id/begrippenkader/stowa",
				"value": "WK123",
				"label": "Waterkerende functie"
			}
		],

        // Onderdeel van meetnetten, optioneel.
		"networks": [
			"https://example.nl/id/monitoringnet/krw-rivierengebied",
			"https://example.nl/id/monitoringnet/hoofdwatergangen-oost"
		]
	}
}

```

### Nieuwe OData Custom functies

Omdat soms gezocht moet worden in data die alleen als een array kan worden uitgedrukt en om te voorkomen dat lambda's gebruikt moeten worden,
is er een nieuwe functie bijgekomen in de set van ondersteunde OData functies: has().

Deze functie heeft twee parameters: de eerste is de naam van de eigenschap dat een array is (`Collection(Edm.String)`) en de tweede is een waarde die gezocht moet worden in de array.

