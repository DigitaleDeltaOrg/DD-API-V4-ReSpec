# Gebruik

<aside class="advisement" title="Work-in-progress">
De specificatie is nog in ontwikkeling. Tot deze finaal is, zal de specificatie nog kunnen veranderen.
De principes staan echter vast. 

Specificaties van de onderliggende semantiek (eigenschappen die mogen worden gebruikt in de API)
kunnen los van deze (technische) specificatie veranderen. Die informatie is te vinden in de folders /definitions/<domein>/<yyyyMMdd>.
</aside>

----
In de templates van V4 is PropertyRef vervangen van Id met id. Dan is het consistent met OM&S.
----

Een DD API V4 heeft meer endpoints van V3. /v3/odata/references is gesplitst in:
- /v4/odata/parameters (alle eigenschappen die in het parameter-blok mogen terugkomen)
- /v4/odata/metadata (eigenschappen die in het metadata-blok mogen terugkomen)
- /v4/odata/measurementobjects (alle meetobjecten)
- /v4/odata/networks (optioneel, alle meetnetten)

Bovengenoemde endpoints filteren via OData en de responses zijn ook OData,

Daarnaast zijn er specifieke endpoints die geo-formaten genereren voor meetobjecten en meetnetten:
- /v4/geo/measurementobjects
- /v4/geo/measurementobjects/{id}
- /v4/geo/networks (optioneel)
- /v4/geo/networks/{id} (optioneel)

De geo-endpoints gebruiken geen OData filtering, maar 'reguliere' geo-functies als bbox (Bounding Box). 

*De naamgeving van de endpoints is strikt: hier mag niet van worden afgeweken.*

## Endpoint /v4/odata/observations

Dit endpoint wordt gebruikt om de observaties op te halen. Het [observatiemodel](#virtuele-datamodellen-observation) beschrijft de structuur en eigenschappen.
Voorbeelden van het gebruik van dit endpoint zijn te vinden in de [profielen](#observation-zoekvoorbeelden).

## Endpoint /v4/odata/parameters

Dit endpoint wordt gebruikt om de referenties (kennis van het systeem, zoals parameters, grootheden, compartimenten, meetobjecten) op te halen die gebruikt mogen worden in de OM&S parameter-dictionary.
In praktijk zullen dit domeintabellen en -waarden zijn.

05-parameter-structure.md
Het [referentiemodel](#virtuele-datamodellen-reference) beschrijft de structuur en eigenschappen.
Voorbeelden van het gebruik van dit endpoint zijn te vinden in de [profielen](#reference-zoekvoorbeelden). Dit endpoint is *deprecated* en wordt vervangen door hieronder benoemde endpoints.

## Endpoint /v4/odata/metadata

Dit endpoint wordt gebruikt om de referenties (kennis van het systeem, zoals parameters, grootheden, compartimenten, meetobjecten) op te halen die gebruikt mogen worden in de OM&S metadata-dictionary.
Dit zijn in praktijk begrippen, die geen standaard waarden hebben, dus niet in een domeintabel thuis horen.
Denk aan iets als ordernummer of monternummer, waar geen standaardwaarden voor bestaan, maar wél van belang zijn voor uitwisseling tussen bepaalde partijen/

## Endpoint /v4/odata/parameters

Dit endpoint wordt gebruikt om de referenties (kennis van het systeem, zoals parameters, grootheden, compartimenten, meetobjecten) op te halen.
Het [parameter-referentiemodel](#virtuele-datamodellen-reference) beschrijft de structuur en eigenschappen.

## Endpoint /v4/geo/measurementobjects

Dit eindpunt is bedoeld voor geo-systemen om in JSON-FG-formaat (FeatureCollection) de informatie van meetobjecten te halen.
Indien het achterliggende systeem een geen JSON-FG-eigenschappen toevoegd, **KAN** dit response GeoJSON (FeatureCollection) zijn.
De filtering is beperkter dan bij de OData-endpoints.

- bbox
- name
- name
- datetime
- distance + distanceFrom
- intersects
- limit + offset

CRS kan worden opgegeven met de Accept-Crs header.
Het achterliggende systeem **MOET** een eigen, vaste sorteervolgorde bepalen zodat limit/offset betrouwbaar werken.

## Endpoint /v4/geo/measurementobjects/{id}

Dit eindpunt is bedoeld voor geo-systemen om in JSON-FG-formaat (Feature) de informatie van een meetobject te halen.
Indien het achterliggende systeem _geen_ JSON-FG-eigenschappen toevoegd, **KAN** dit response GeoJSON (Feature) zijn.

## Endpoint /v4/geo/monitoringnetworks

Systemen die geen meetnetten kennen, hoeven deze niet te implementeren.
Meetnetten in DD API V4 bestaan uit een set meetobjecten, die een geometrie hebben en een naam.
Dit eindpunt is bedoeld voor geo-systemen om in JSON-FG-formaat (FeatureCollection) de informatie van meetnetten te halen.
De filtering is beperkter dan bij de OData-endpoints.

Het eindpunt moet de volgende zoekparameters ondersteunen:

- bbox
- name
- name
- datetime
- distance + distanceFrom
- intersects
- limit + offset

CRS kan worden opgegeven met de Accept-Crs header.
Het achterliggende systeem **MOET** een eigen, vaste sorteervolgorde bepalen zodat limit/offset betrouwbaar werken.

## Endpoint /v4/geo/monitoringnetworks/{id}

Systemen die geen meetnetten kennen, hoeven deze niet te implementeren.
Dit eindpunt is bedoeld voor geo-systemen om in JSON-FG-formaat (Feature) de informatie van een meetnet te halen.
Indien het achterliggende systeem een geen JSON-FG-eigenschappen toevoegt, **KAN** dit response GeoJSON (Feature) zijn.

## GET en POST

De endpoints **MOETEN** `GET` ondersteunen.

`POST` is optioneel en **mag** alleen worden gebruikt voor zoeken met lange filters. 

De body van het `POST` request **MOET** de volledige query string bevatten, dus alles na de `?` in de URL.

`GET` is de aanbevolen methode.

## Paginering

Data wordt in pagina's teruggegeven. Een pagina bestaat uit de volgende onderdelen:

- Een header (`@odata.count`)
- Een array van entiteiten (`value`)
- Een link naar de volgende pagina (`@odata.nextLink`)

Paginagrootte beschrijft het aantal entiteiten dat in de `value` array wordt teruggegeven. Met andere woorden: dit zijn de aantal observaties in de `value` array.

De pagina grootte wordt bepaald door de implementatie. De specificatie _adviseert_ minimaal 1000 items per pagina met een maximale grootte van 10000.
De pagina grootte kan worden aangepast via de query parameter `$top`. 
Indien de pagina grootte groter is dan de maximale grootte die de server accepteert, dan zal de server de pagina grootte automatisch verkleinen.

Omdat DD API V3 gebruik maakt van `$skiptoken`, is de volgende pagina niet direct op te vragen: de URL achter de `@odata.nextLink` moet worden gebruikt om de volgende pagina op te vragen.

De parameter `$top` geeft het aantal te retourneren entiteiten binnen de value array aan. Let op: bij tijdreeksen wordt de volledige tijdreeks als één item beschouwd, ongeacht het aantal individuele meetpunten in de CoverageJSON.

## Geografie

Standaard geeft DD API V3 alle responses terug in ETRS89 ([[EPSG]]:4258).

Een ander coördinatenstelsel **kan** worden gevraagd via de Accept-Crs header. 
De server **MOET** de data dan converteren naar het gevraagde CRS _(indien de server het coördinatenstelsel ondersteund)_ 
en in de response header Content-Crs opnemen in welk CRS de data is teruggegeven.

Tenminste de volgende CRS's worden ondersteund:

* ETRS89 ([[EPSG]]:4258) in graden
* WGS84 ([[EPSG]]:4326) in graden
* ETRS89/31N ([[EPSG]]:25831) in meters
* RD New ([[EPSG]]:28992) in meters

De waarde van Accept-Crs (en de Content-Crs in de response) **MOET** `[[EPSG]]:xxxx` zijn, waarbij `xxxx` de [[EPSG]]-code is.

## Beveiliging

Welke authenticatiemethoden de API ondersteunt, is afhankelijk van de implementatie.

De volgende methoden zijn toegestaan:

| Methoden           | Beschrijving                                                                                              |
|--------------------|-----------------------------------------------------------------------------------------------------------|
| [[mTLS]]           | Mutual TLS (certificaten)                                                                                 |
| [[API Key]]        | Via X-API-KEY header, alleen in opvraag scenario's waarbij de identiteit van de gebruiker niet vereist is |
| [[OAuth2]]         | OAuth2                                                                                                    |
| [[OpenID Connect]] | OpenID Connect                                                                                            |

Authenticatie hoeft niet altijd vereist te worden: diensten die uitsluitend publieke data leveren, 
kunnen zonder authenticatie worden gebruikt.

## Versiebeheer en Capabilities

Om clients te helpen bij het ontdekken van ondersteunde functionaliteiten, **MOET** een server bij elke response de header `API-Version` meesturen.

### X-DD-Capabilities
Voor implementaties die de optionele V3.1 extensies ondersteunen, **MOET** de server de header `X-DD-Capabilities` meesturen. Deze header bevat een door komma's gescheiden lijst van actieve extensies.

Mogelijke waarden:
- `subscriptions`: Ondersteuning voor het `/subscriptions` endpoint.
- `searchprofiles`: Ondersteuning voor zoekprofielen via `/searchprofiles`.
- `resultprofiles`: Ondersteuning voor resultaatprofielen via `/resultprofiles`.

**Voorbeeld:**
`X-DD-Capabilities: searchprofiles, resultprofiles, subscriptions`