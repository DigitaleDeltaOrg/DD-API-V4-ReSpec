# Conformiteit en implementatiecontract

Dit hoofdstuk beschrijft waaraan een implementatie minimaal moet voldoen om DD API V4 Core-conform te zijn.

DD API V4 schrijft niet voor welke programmeertaal, operating system, framework, database, database-architectuur of interne database-layout een implementatie moet gebruiken. Een implementatie is vrij in de interne technische inrichting, zolang het externe API-contract voldoet aan deze specificatie.

Een DD API V4-implementatie is daarmee een mapping van een willekeurig intern opslagmodel naar het virtuele DD API V4-uitwisselingsmodel.

## Uitgangspunten

Voor DD API V4 Core gelden de volgende uitgangspunten:

- De API is read-only.
- De API is gebaseerd op HTTPS.
- De API publiceert een manifest.
- De API biedt OData-endpoints voor zoeken en ophalen.
- De API biedt geo-endpoints voor meetobjecten.
- De API gebruikt een actieve definitie-set voor semantiek, profielen en regels.
- De API publiceert machineleesbare metadata via OData `$metadata` en OpenAPI.
- De API gebruikt response headers voor discovery en validatie.
- De API ondersteunt paginering voor collectie-endpoints.
- De API gebruikt gestandaardiseerde fout-responses.

## DD API V4 Core-conformiteit

Een implementatie is DD API V4 Core-conform wanneer ten minste aan de onderstaande eisen wordt voldaan.

| Onderdeel          | Eis                                                                                                      |
|--------------------|----------------------------------------------------------------------------------------------------------|
| Protocol           | De API **MOET** via HTTPS beschikbaar zijn.                                                              |
| Read-only          | Core-endpoints **MOGEN GEEN** data aanmaken, wijzigen of verwijderen.                                    |
| Manifest           | De implementatie **MOET** een manifest publiceren en daarnaar verwijzen met `DD-V4-Manifest`.            |
| OpenAPI            | De implementatie **MOET** een OpenAPI 3.1-beschrijving aanbieden of daarnaar verwijzen.                  |
| OData metadata     | De implementatie **MOET** `/v4/odata/$metadata` aanbieden.                                               |
| OData observations | De implementatie **MOET** `/v4/odata/observations` aanbieden.                                            |
| OData parameters   | De implementatie **MOET** `/v4/odata/parameters` aanbieden.                                              |
| OData foi          | De implementatie **MOET** `/v4/odata/foi` aanbieden.                                                     |
| Geo collectie      | De implementatie **MOET** `/v4/geo/measurementobjects` aanbieden.                                        |
| Geo item           | De implementatie **MOET** `/v4/geo/measurementobjects/{id}` aanbieden.                                   |
| Semantiek          | Iedere response **MOET** verwijzen naar de gebruikte definitie-set.                                      |
| Result types       | De implementatie **MOET** aangeven welke result types worden ondersteund.                                |
| Profielen          | De implementatie **MOET** aangeven welke profielen worden ondersteund.                                   |
| Paginering         | Collectie-endpoints **MOETEN** paginering ondersteunen.                                                  |
| OData subset       | OData-endpoints **MOETEN** de DD API V4 OData-subset ondersteunen.                                       |
| Foutafhandeling    | Fouten **MOETEN** met passende HTTP-statuscodes en een gestandaardiseerde foutbody worden gerapporteerd. |
| Semantiekvalidatie | SemanticPropertyBag-velden **MOETEN** voldoen aan de actieve definitie-set, profielen en rules.          |

## Verplichte endpoints

Een Core-conforme implementatie biedt minimaal de volgende endpoints aan.

| Endpoint                          | Type    | Verplicht | Doel                                                               |
|-----------------------------------|---------|----------:|--------------------------------------------------------------------|
| `/v4/odata/$metadata`             | OData   |        Ja | CSDL metadata van de OData-service.                                |
| `/v4/odata/observations`          | OData   |        Ja | Zoeken en ophalen van observaties.                                 |
| `/v4/odata/parameters`            | OData   |        Ja | Zoeken en ophalen van begrippen en domeinwaarden voor `parameter`. |
| `/v4/odata/foi`                   | OData   |        Ja | Zoeken en ophalen van meetobjecten.                                |
| `/v4/geo/measurementobjects`      | JSON-FG |        Ja | Zoeken en ophalen van meetobjecten als FeatureCollection.          |
| `/v4/geo/measurementobjects/{id}` | JSON-FG |        Ja | Ophalen van één meetobject als Feature.                            |

Een implementatie die één of meer van deze endpoints niet aanbiedt, is niet DD API V4 Core-conform.

## HTTP-methoden

### GET

Alle Core-endpoints **MOETEN** `GET` ondersteunen.

`GET` is de aanbevolen methode voor alle reguliere zoek- en opvraagverzoeken.

### POST als GET-met-body

DD API V4 Core is read-only. Binnen Core **MAG** `POST` uitsluitend worden gebruikt als `GET`-met-body voor zoekvragen met lange query strings.

Dit gebruik van `POST` is semantisch gelijk aan `GET` en **MAG GEEN** data aanmaken, wijzigen of verwijderen.

Wanneer `POST` als `GET`-met-body wordt gebruikt:

- de request body **MOET** de volledige query string bevatten
- de inhoud van de body is alles wat normaal na de `?` in de URL zou staan
- de response **MOET** gelijkwaardig zijn aan de overeenkomstige `GET` response
- de operatie **MOET** idempotent en read-only zijn.

Voorbeeld:

```http POST /v4/odata/observations HTTP/1.1 Content-Type: text/plain
filter=parameter/quantity eq 'WATHTE'&top=1000
```

## Verplichte response headers

Een implementatie **MOET** de relevante DD API V4 headers meesturen zodat clients responses kunnen interpreteren en valideren.

| Header                |    Verplicht | Scope                        | Voorbeeld                                                                        | Betekenis                                          |
|-----------------------|-------------:|------------------------------|----------------------------------------------------------------------------------|----------------------------------------------------|
| `DD-V4-Manifest`      |           Ja | Service / response           | `https://api.example.org/v4/manifest.json`                                       | Verwijst naar het manifest.                        |
| `DD-V4-Semantics`     |           Ja | Dataset / response           | `https://digitaledeltaorg.github.io/DD-API-V4-ReSpec/definitions/water/20261101` | Verwijst naar de actieve definitie-set.            |
| `DD-V4-ResultTypes`   |           Ja | Dataset / response           | `measure,coverage`                                                               | Geeft ondersteunde result types aan.               |
| `DD-V4-Profiles`      |           Ja | Dataset / response           | `TimeSeries,WaterQuantity`                                                       | Geeft ondersteunde profielen aan.                  |
| `DD-V4-Capabilities`  |          Nee | Service / dataset / response | `CoverageFunctions,Write`                                                        | Geeft optionele modules of functionaliteiten aan.  |
| `Content-Crs`         | Conditioneel | Geo-response                 | `EPSG:4258`                                                                      | Geeft het CRS van de geometrie in de response aan. |
| `RateLimit-Limit`     | Conditioneel | Response                     | `1000`                                                                           | Maximum aantal requests in de rate-limitperiode.   |
| `RateLimit-Remaining` | Conditioneel | Response                     | `998`                                                                            | Resterend aantal requests in de rate-limitperiode. |
| `RateLimit-Reset`     | Conditioneel | Response                     | `60`                                                                             | Tijd tot reset van de rate limit.                  |

Wanneer een implementatie rate limiting toepast, **MOETEN** de `RateLimit-*` headers worden opgenomen bij responses waarvoor de limiet relevant is.

## Result types

`Observation.type` bepaalt de result-variant van een observatie.

De toegestane Core result types zijn:

| Waarde     | Betekenis                                                                      |
|------------|--------------------------------------------------------------------------------|
| `measure`  | Numerieke waarde met eenheid.                                                  |
| `truth`    | Waar/onwaar of booleaanse status.                                              |
| `count`    | Telling zonder eenheid.                                                        |
| `category` | Categorie of domeinwaarde.                                                     |
| `coverage` | CoverageJSON-resultaat, bijvoorbeeld tijdreeks, verwachting, ensemble of grid. |

Een implementatie **MOET** met de header `DD-V4-ResultTypes` aangeven welke result types worden ondersteund.

Voorbeeld:

```http 
DD-V4-ResultTypes: measure,count,coverage
```

Profielen bepalen niet het result type. Profielen bepalen de semantische scope van de gegevens.

## Profielen

Profielen beschrijven de semantische toepassingscontext waarin gegevens worden aangeboden.

Profielen bepalen welke eigenschappen uit de actieve definitie-set binnen `SemanticPropertyBag`-velden zoals `parameter`, `metadata`, `identities`, `classifications` of `details` beschikbaar zijn.

Een implementatie **MOET** met de header `DD-V4-Profiles` aangeven welke profielen worden ondersteund.

Voorbeeld:

```http 
DD-V4-Profiles: TimeSeries,WaterQuantity
```

Bij meerdere profielen geldt:

- het beschikbare vocabulaire is de unie van eigenschappen die aan ten minste één actief profiel zijn gekoppeld
- eigenschappen die aan `All` zijn gekoppeld, zijn beschikbaar voor alle profielen
- rules kunnen het gebruik vervolgens verplichten, beperken of verbieden
- verbiedende rules hebben voorrang op algemene toestemmingen.

Profielen zijn case-sensitive en **MOETEN** overeenkomen met waarden uit `profiles.csv`.

## OData-query-opties

DD API V4 ondersteunt een beperkte subset van OData-query-opties.

De volgende query-opties **MOETEN** worden ondersteund op OData-collectie-endpoints:

| Queryoptie   | Verplicht | Betekenis                                  |
|--------------|----------:|--------------------------------------------|
| `$filter`    |        Ja | Filteren van resultaten.                   |
| `$top`       |        Ja | Maximum aantal entiteiten in de response.  |
| `$skiptoken` |        Ja | Servergedefinieerde pagineringstoken.      |
| `$select`    |        Ja | Selecteren van terug te geven properties.  |
| `$count`     |        Ja | Opvragen van het totaal aantal resultaten. |

De volgende query-opties zijn binnen DD API V4 Core niet toegestaan:

| Queryoptie     | Status                                                          |
|----------------|-----------------------------------------------------------------|
| `$skip`        | Niet toegestaan.                                                |
| `$expand`      | Niet toegestaan.                                                |
| `$compute`     | Niet toegestaan.                                                |
| `$inlinecount` | Niet toegestaan.                                                |
| `$orderby`     | Afgeraden, tenzij een implementatie dit expliciet documenteert. |

Wanneer een niet-ondersteunde query-optie wordt gebruikt, **MOET** de server een `400 Bad Request` response teruggeven.

## OData-filterexpressies

Een implementatie **MOET** ten minste de volgende filter-operators ondersteunen:

| Operator | Betekenis                  |
|----------|----------------------------|
| `eq`     | Gelijk aan.                |
| `ne`     | Niet gelijk aan.           |
| `lt`     | Kleiner dan.               |
| `le`     | Kleiner dan of gelijk aan. |
| `gt`     | Groter dan.                |
| `ge`     | Groter dan of gelijk aan.  |
| `and`    | Logische AND.              |
| `or`     | Logische OR.               |
| `not`    | Logische NOT.              |

Een implementatie **MOET** ten minste de volgende literal-typen ondersteunen:

| Literal   | Voorbeeld              |
|-----------|------------------------|
| string    | `'WATHTE'`             |
| number    | `12.34`                |
| integer   | `42`                   |
| boolean   | `true`                 |
| date-time | `2026-01-01T00:00:00Z` |

Property-paden gebruiken slash-notatie.

Voorbeelden:

```text 
parameter/quantity result/measure/value foi/id foi/geometry
```

Property-namen zijn case-sensitive en volgen de JSON-camelCase-conventie van het DD API V4-model.

## OData-functies

Een implementatie **MOET** ten minste de volgende OData-functies ondersteunen:

| Functie      | Betekenis                                  |
|--------------|--------------------------------------------|
| `startswith` | Test of een string begint met een waarde.  |
| `contains`   | Test of een string een waarde bevat.       |
| `endswith`   | Test of een string eindigt met een waarde. |
| `length`     | Lengte van een string.                     |
| `year`       | Jaarcomponent van een datum/tijd.          |
| `month`      | Maandcomponent van een datum/tijd.         |
| `day`        | Dagcomponent van een datum/tijd.           |
| `hour`       | Uurcomponent van een datum/tijd.           |
| `minute`     | Minuutcomponent van een datum/tijd.        |
| `second`     | Secondecomponent van een datum/tijd.       |

DD API V4 gebruikt daarnaast de volgende custom functies:

| Functie                      | Return type   | Betekenis                                                                   |
|------------------------------|---------------|-----------------------------------------------------------------------------|
| `distance(wkt='...')`        | `Edm.Double`  | Afstand tot de geometrie van de entiteit.                                   |
| `intersects(wkt='...')`      | `Edm.Boolean` | Test of de opgegeven WKT-geometrie snijdt met de geometrie van de entiteit. |
| `has(collectionPath, value)` | `Edm.Boolean` | Test of een collectie een waarde bevat.                                     |

Voorbeelden:


```text 
$filter=distance(wkt='POINT(5.387 52.156)') lt 1000
```

```text 
$filter=intersects(wkt='POLYGON((5.0 52.0,5.1 52.0,5.1 52.1,5.0 52.1,5.0 52.0))') eq true
```

```text 
$filter=has(foi/networks, 'KRW') eq true
```

## `$select`

`$select` bepaalt welke properties in de response worden opgenomen.

Een implementatie **MOET** `$select` ondersteunen voor top-level properties.

Voorbeeld:


```text
 $select=id,parameter/quantity,result/measure/value
```
## `$count`

Wanneer `$count=true` wordt gebruikt, **MOET** de response `@odata.count` bevatten.

Wanneer `$count` niet wordt gebruikt, **MAG** `@odata.count` ontbreken.

Omdat tellen bij grote datasets kostbaar kan zijn, **MAG** een implementatie het berekenen van counts optimaliseren of cachen. De count **MOET** echter overeenkomen met de filter-context waarvoor deze wordt gerapporteerd.

## Paginering

Collectie-endpoints **MOETEN** paginering ondersteunen.

Paginering gebeurt met `$top` en `$skiptoken`.

`$skip` is niet toegestaan.

Een response met meer resultaten dan in de huidige pagina passen, **MOET** een `@odata.nextLink` bevatten. De `@odata.nextLink` bevat de URL waarmee de volgende pagina kan worden opgevraagd.

Op de laatste pagina **MOET** `@odata.nextLink` ontbreken.

De waarde van `$skiptoken` is server-gedefinieerd en opaque. Clients **MOGEN NIET** proberen de inhoud van `$skiptoken` te interpreteren, wijzigen of zelf te construeren.

Een implementatie **MOET** een stabiele sorteervolgorde gebruiken zodat paginering geen resultaten overslaat of dubbel teruggeeft.

Wanneer een client een `$top` vraagt die groter is dan het server-maximum, **MAG** de server de paginagrootte verlagen tot het server-maximum.

## Content negotiation

### OData-endpoints

OData-endpoints retourneren JSON volgens de OData JSON-conventies.

Een client **MAG** `Accept: application/json` meesturen.

### Geo-endpoints

Geo-endpoints retourneren standaard JSON-FG.

GeoJSON kan expliciet worden gevraagd via:

```http 
Accept-GeoFormat: geojson
```


Wanneer GeoJSON expliciet wordt gevraagd, **MOET** de `geometry` in CRS84 worden teruggegeven met coördinatenvolgorde longitude, latitude.

Wanneer een client GeoJSON vraagt in combinatie met een niet-CRS84 `Accept-Crs`, **MOET** de server reageren met `400 Bad Request` of `406 Not Acceptable`.

JSON-FG responses **MOGEN** geometrie in een ander CRS dan CRS84 leveren, mits het gebruikte CRS duidelijk wordt aangegeven met `Content-Crs` en, waar van toepassing, `coordRefSys`.

## CRS

De standaard CRS voor DD API V4 is ETRS89 (`EPSG:4258`), tenzij een endpoint of response-formaat anders voorschrijft.

Een client **MAG** een CRS vragen met de header:

```http
Accept-Crs: EPSG:28992 
```

Wanneer de server het gevraagde CRS ondersteunt, **MOET** de response de header `Content-Crs` bevatten:

```http
Content-Crs: EPSG:28992
```

Wanneer de server het gevraagde CRS niet ondersteunt, **MOET** de server reageren met `400 Bad Request` of `406 Not Acceptable`.

De volgende CRS'en **MOETEN** minimaal worden ondersteund:

| CRS                   | EPSG-code    | Eenheid |
|-----------------------|--------------|---------|
| ETRS89                | `EPSG:4258`  | graden  |
| WGS84                 | `EPSG:4326`  | graden  |
| ETRS89 / UTM zone 31N | `EPSG:25831` | meters  |
| RD New                | `EPSG:28992` | meters  |

De waarden van `Accept-Crs` en `Content-Crs` gebruiken de korte vorm `EPSG:xxxx`.

In JSON-FG **MAG** `coordRefSys` een URI-vorm gebruiken, bijvoorbeeld:

```http request
https://www.opengis.net/def/crs/EPSG/0/28992
```


## Geo-query-parameters

Het endpoint `/v4/geo/measurementobjects` ondersteunt ten minste de volgende query-parameters:

| Parameter     | Type    | Betekenis                                                     |
|---------------|---------|---------------------------------------------------------------|
| `bbox`        | string  | Bounding box in het gebruikte CRS, als `minx,miny,maxx,maxy`. |
| `featureType` | string  | Filter op feature type uit de actieve feature type-definitie. |
| `limit`       | integer | Maximum aantal features in de response.                       |

Voorbeeld:

```text
/v4/geo/measurementobjects?bbox=5.0,52.0,5.2,52.2&featureType=Inlaat&limit=100
```


## Foutafhandeling

Een implementatie **MOET** fouten rapporteren met passende HTTP-statuscodes.

| Situatie                               |                       Status |
|----------------------------------------|-----------------------------:|
| Ongeldige query of parameter           |            `400 Bad Request` |
| Ongeldige of ontbrekende authenticatie |           `401 Unauthorized` |
| Onvoldoende rechten                    |              `403 Forbidden` |
| Resource niet gevonden                 |              `404 Not Found` |
| Niet ondersteund responseformaat       |         `406 Not Acceptable` |
| Niet ondersteund requestformaat        | `415 Unsupported Media Type` |
| Rate limit overschreden                |      `429 Too Many Requests` |
| Interne serverfout                     |  `500 Internal Server Error` |
| Tijdelijk niet beschikbaar             |    `503 Service Unavailable` |

Foutresponsen **MOETEN** een JSON-body bevatten met een OData-compatible error-object.

Voorbeeld:

```json 
{ "error": { "code": "InvalidFilter", "message": "The filter expression is invalid.", "target": "$filter" } }
```

`code` **MOET** een machineleesbare foutcode bevatten.  
`message` **MOET** een mensleesbare foutmelding bevatten.  
`target` **MAG** verwijzen naar het veld, de query-parameter of het onderdeel waarop de fout betrekking heeft.

Een foutresponse **MAG** aanvullende details bevatten:

```json
{ 
  "error": { 
    "code": "ValidationError", 
    "message": "The request contains invalid semantic properties.", 
    "details": {} 
  } 
}
```


## Semantiek-validatie

Een implementatie **MOET** SemanticPropertyBag-velden valideren tegen de actieve definitie-set.

De validatie-volgorde is:

1. Bepaal de actieve definitie-set op basis van `DD-V4-Semantics`.
2. Bepaal de actieve profielen op basis van `DD-V4-Profiles`, het manifest of de dataset-context.
3. Lees `semantics.csv`, `profiles.csv`, `rules.csv` en `rule-types.csv`.
4. Bepaal voor iedere `SemanticPropertyBag` de bijbehorende `group`.
5. Controleer of iedere gebruikte property voorkomt in `semantics.csv`.
6. Controleer of iedere gebruikte property behoort tot de juiste `group`.
7. Controleer of iedere gebruikte property beschikbaar is voor ten minste één actief profiel of voor `All`.
8. Controleer of eventuele extensie-gebonden properties alleen worden gebruikt wanneer de betreffende capability actief is.
9. Controleer het datatype van iedere property.
10. Pas de rules uit `rules.csv` toe.
11. Rapporteer overtredingen als validatiefout.

Wanneer meerdere profielen actief zijn, bestaat het beschikbare vocabulaire uit de unie van eigenschappen die aan één van de actieve profielen of aan `All` zijn gekoppeld.

Rules kunnen het gebruik vervolgens beperken, verplichten of verbieden.

Wanneer rules conflicteren, heeft een verbod voorrang op een algemene toestemming.

## OpenAPI en CSDL

Een implementatie **MOET** een OData `$metadata` document aanbieden op:

```http
/v4/odata/$metadata
```

Dit document **MOET** de entity sets, complex types, properties en custom functions beschrijven die door de implementatie worden ondersteund.

Een implementatie **MOET** daarnaast een OpenAPI 3.1-beschrijving aanbieden of daarnaar verwijzen.

De CSDL en OpenAPI-specificatie **MOETEN** consistent zijn met:

- de actieve definitie-set
- de ondersteunde profielen
- de ondersteunde result types
- de ondersteunde capabilities
- de daadwerkelijke endpoints en response-modellen van de implementatie.

`SemanticPropertyBag`-velden **MOETEN** in implementatie-specifieke CSDL en OpenAPI worden uitgewerkt als concrete properties op basis van de actieve definitie-set.

Wanneer de actieve definitie-set wijzigt, **KAN** het nodig zijn om de CSDL en OpenAPI-specificatie opnieuw te genereren of aan te passen.

## Manifest

Een implementatie **MOET** een manifest publiceren.

De service **MOET** via de `DD-V4-Manifest` header verwijzen naar het manifest.

Het manifest **KAN** worden gepubliceerd op:

```text
 /v4/manifest.json
```


Dit pad wordt aanbevolen voor implementaties die geen andere discovery-URL nodig hebben.

Het manifest **MOET** inhoudelijk consistent zijn met:

- de response headers
- de beschikbare endpoints
- de actieve definitie-set
- de ondersteunde profielen
- de ondersteunde result types
- de ondersteunde capabilities
- de OpenAPI-specificatie.

## Beveiliging

Een implementatie **MOET** via HTTPS beschikbaar zijn.

Authenticatie is afhankelijk van de implementatie en de aangeboden data. Publieke data **MAG** zonder authenticatie worden aangeboden.

De volgende authenticatiemethoden zijn toegestaan:

| Methode        | Toelichting                                     |
|----------------|-------------------------------------------------|
| mTLS           | Wederzijdse TLS-authenticatie met certificaten. |
| API key        | API key via header, bijvoorbeeld `X-API-KEY`.   |
| OAuth2         | OAuth2-autorisatie.                             |
| OpenID Connect | Authenticatie op basis van OpenID Connect.      |

Wanneer authenticatie vereist is en ontbreekt of ongeldig is, **MOET** de server `401 Unauthorized` retourneren.

Wanneer authenticatie geldig is maar de client onvoldoende rechten heeft, **MOET** de server `403 Forbidden` retourneren.

## Rate limiting

Een implementatie **MAG** rate limiting toepassen.

Wanneer rate limiting wordt toegepast, **MOETEN** de relevante `RateLimit-*` headers worden opgenomen.

Wanneer een client de limiet overschrijdt, **MOET** de server reageren met:

```text
 429 Too Many Requests
```


## Minimale response-voorbeelden

### Observation met `measure`

```json
{ 
  "id": "obs-1", 
  "resultTime": "2026-01-01T12:00:00Z", 
  "type": "measure", 
  "phenomenonTime": { 
    "begin": "2026-01-01T11:55:00Z", 
    "end": "2026-01-01T12:00:00Z" 
  }, 
  "foi": { 
    "id": "foi-1", 
    "code": "MP-001", 
    "description": "Meetpunt 001", 
    "geometry": { 
      "type": "Point", 
      "coordinates": [5.12, 52.09] 
    } 
  }, 
  "parameter": { 
    "quantity": "WATHTE" 
  }, 
  "result": { 
    "id": "res-1", 
    "measure": { 
      "value": 1.23, 
      "unit": "m" 
    } 
  }, 
  "modifiedOn": "2026-01-01T12:05:00Z" 
}
```

### OData collection response

```json
 { 
  "@odata.context": "https://api.example.org/v4/odata/$metadata#observations", 
  "@odata.count": 1, "value": []
}
```

### JSON-FG FeatureCollection

```json
 { 
  "type": "FeatureCollection", 
  "conformsTo": "", 
  "features": ""
}
```

## Minimale conformiteitstests

Een Core-conforme implementatie moet minimaal slagen voor de volgende tests:

| Test                   | Verwachting                                                            |
|------------------------|------------------------------------------------------------------------|
| Manifest bereikbaar    | `DD-V4-Manifest` verwijst naar een geldig manifest.                    |
| `$metadata` bereikbaar | `/v4/odata/$metadata` retourneert CSDL.                                |
| OpenAPI beschikbaar    | OpenAPI 3.1-beschrijving is beschikbaar.                               |
| Observations endpoint  | `/v4/odata/observations` retourneert OData JSON.                       |
| Parameters endpoint    | `/v4/odata/parameters` retourneert OData JSON.                         |
| FoI endpoint           | `/v4/odata/foi` retourneert OData JSON.                                |
| Geo collectie          | `/v4/geo/measurementobjects` retourneert JSON-FG FeatureCollection.    |
| Geo item               | `/v4/geo/measurementobjects/{id}` retourneert JSON-FG Feature.         |
| Headers                | Verplichte DD-V4 headers zijn aanwezig.                                |
| `$filter`              | Geldige filterexpressies worden correct toegepast.                     |
| Ongeldige `$filter`    | Ongeldige filters geven `400 Bad Request`.                             |
| `$top`                 | Paginagrootte wordt toegepast.                                         |
| `$skiptoken`           | Volgende pagina kan via `@odata.nextLink` worden opgehaald.            |
| `$skip`                | Gebruik van `$skip` geeft `400 Bad Request`.                           |
| Semantiek              | SemanticPropertyBag-properties voldoen aan definitie-set en profielen. |
| CRS                    | `Accept-Crs` geeft correcte `Content-Crs` of passende fout.            |
| GeoJSON                | Expliciet gevraagde GeoJSON-response gebruikt CRS84.                   |
| Foutmodel              | Fouten worden als JSON error-object geretourneerd.                     |

## Niet-voorgeschreven onderdelen

DD API V4 schrijft niet voor:

- welke programmeertaal wordt gebruikt
- welk framework wordt gebruikt
- welk operating system wordt gebruikt
- welke database wordt gebruikt
- hoe tabellen, collecties of indices intern zijn ingericht
- of data vooraf wordt gematerialiseerd of on-the-fly wordt gemapt
- hoe autorisatie intern wordt ingericht
- hoe caching intern wordt uitgevoerd
- licentievoorwaarden van de implementatie
- hoe CRS-transformaties technisch worden geïmplementeerd.

Deze keuzes zijn aan de implementatie, zolang het externe gedrag voldoet aan deze specificatie.

## Aanbeveling: stack-onafhankelijke OData-verwerking

DD API V4 gebruikt een beperkte en expliciet gedefinieerde subset van OData.
Implementaties **MOGEN** bestaande OData-libraries gebruiken, maar moeten controleren of deze libraries de DD API V4 OData-subset correct en zonder ongewenste neveneffecten ondersteunen.

Sommige OData-libraries zijn sterk gekoppeld aan een specifiek framework, objectmodel, ORM, databaseprovider of conventies voor entity-relaties. Zulke libraries kunnen aannames doen die niet passen bij het virtuele DD API V4-uitwisselingsmodel, bijvoorbeeld over `$expand`, navigatieproperties, entity-relaties, EDM-generatie, queryvertaling of databasebinding.

Implementaties worden aanbevolen OData-verwerking te gebruiken die:

- niet vereist dat het interne opslagmodel gelijk is aan het externe OData-model;
- geen verplichte koppeling oplegt aan een specifieke ORM, database of frameworkconventie.

Wanneer een bestaande OData-library deze eigenschappen niet biedt, wordt aanbevolen om alleen de parserfunctionaliteit te gebruiken of een eigen parser/adapterlaag te implementeren voor de DD API V4 OData-subset.

Wanneer een OData-library functionaliteit accepteert die buiten de DD API V4 OData-subset valt, blijft de implementatie verantwoordelijk voor het correct afwijzen daarvan.

Het interne datamodel van een implementatie hoeft niet overeen te komen met het virtuele DD API V4-model. De implementatie is verantwoordelijk voor de mapping van het eigen opslagmodel naar het DD API V4-uitwisselingsmodel.

Ongeacht de gekozen library of implementatieaanpak blijft de implementatie verantwoordelijk voor het correct ondersteunen van de DD API V4 OData-subset en het correct afwijzen van functionaliteit die daarbuiten valt.
