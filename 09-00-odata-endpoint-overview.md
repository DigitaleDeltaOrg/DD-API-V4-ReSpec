# OData endpoints overzicht

De volgende endpoints en hun resultaten zijn vereist.

| Endpoint               | Stijl | Core/module | Doel                           | Input                                    | Output                                                                               |
|------------------------|-------|-------------|--------------------------------|------------------------------------------|--------------------------------------------------------------------------------------|
| /v4/odata/$metadata    | OData | Core        | CSDL metadata                  | geen of standaard OData metadata request | CSDL                                                                                 |
| /v4/odata/observations | OData | Core        | Observaties zoeken en ophalen  | OData query-opties                       | OData collection van [Observation](06-01-odata-models-observation)                   |
| /v4/odata/parameters   | OData | Core        | Parameters zoeken en ophalen   | OData query-opties                       | OData collection van [Parameter](06-02-odata-models-parameter)                       |
| /v4/odata/foi          | OData | Core        | Meetobjecten zoeken en ophalen | OData query-opties                       | OData collection van [Foi (Feature of Interest, meetobject)](06-03-odata-models-foi) |

Een implementatie die één of meer van deze endpoints niet aanbiedt, is niet DD API V4-conform.

Het eerste endpoint moet de CSDL-metadata van de OData service retourneren. 
Deze moet de metadata van de OData service bevatten:

- Entiteiten en hun eigenschappen
- Custom functies, zoals gedefinieerd in de specificatie.

De volgende OData-parameters **moeten** geïmplementeerd zijn:

- $filter
- $top
- $skiptoken
- $select
- $count

__Niet__ toegestaan:

- $skip
- $expand
- $compute

_Afgeraden_:

$orderby

De volgende OData functies **moeten** geïmplementeerd zijn:

- startswith
- contains
- endswith
- length
- year
- month
- day
- hour
- minute
- second

De volgende OData custom functies **moeten** geïmplementeerd zijn:

- distance(wkt=<geo-in-wkt>)
- intersects(wkt=<geo-in-wkt>)
- has(naam-van-de-collectie, value)

## Geografische filter

Voor geografische filtering kan gebruik worden gemaakt van de specifieke DD API V4 geografische functies: `distance` en `intersects`.
Een opmerking over coördinatenstelsels:

- Standaard worden alle coördinaten in ETRS89 (longitude latitude) gebruikt, in booggraden, dus.
- De gebruiker kan middels `Accept-Crs` header aangeven in welk CRS (coördinatenstelsel) de data teruggegeven moet worden en de vergelijking moet worden uitgevoerd. Daarvoor de EPSG-code uit onderstaande lijst gebruiken, bijvoorbeeld `Accept-Crs: EPSG:28992` voor RD New.
- Wanneer de gebruiker geen `Accept-Crs` header heeft opgegeven, wordt de data teruggegeven in ETRS89.
- Wanneer de gebruiker een `Accept-Crs` header heeft opgegeven, moet de server de data converteren naar het gevraagde CRS en als response header `Content-Crs` toevoegen aan de response met daarin het gebruikte CRS.
- Het is aan de implementatie om de conversie van en naar ETRS89 te doen. Programmabibliotheken zoals NetTopologySuite (voor .NET) en JTS (voor Java) kunnen hierbij helpen.

>Note: geografisch zoeken werkt voor entiteiten met een geografisch attribuut, zoals observations en foi. Bij observations wordt de geografische selectie toegepast op de geometrie van de FoI.

De volgende lijst toont de minimaal ondersteunde coördinatenstelsels met hun EPSG-codes en eenheden:

| Coordinatenstelsel | EPSG-code  | Eenheid |
|--------------------|------------|---------|
| ETRS89             | EPSG:4258  | Graden  |
| WGS84              | EPSG:4326  | Graden  |
| ETRS89/31N         | EPSG:25831 | Meters  |
| RD New             | EPSG:28992 | Meters  |

## /v4/odata/observations

| Aspect         | Waarde                                                                                                            |
|----------------|-------------------------------------------------------------------------------------------------------------------|
| Entity set     | `observations`                                                                                                    |
| Model          | [Observation](06-01-odata-models-observation.md)                                                                  |
| Verplicht      | Ja, Core                                                                                                          |
| Doel           | Zoeken en ophalen van observaties.                                                                                |
| Query          | Algemene OData Core-queryopties zijn van toepassing.                                                              |
| Response       | OData collection van [Observation](06-01-odata-models-observation.md)  .                                          |
| Semantiek      | `parameter`, `metadata` en `foi` worden bepaald door de actieve semantiekset.                                     |
| Bijzonderheden | Iedere observatie MOET `modifiedOn` bevatten. Resultaatvormen moeten passen binnen de gedeclareerde result types. |

## /v4/odata/parameters

| Aspect         | Waarde                                                                                                          |
|----------------|-----------------------------------------------------------------------------------------------------------------|
| Entity set     | `parameters`                                                                                                    |
| Model          | [Parameter](06-02-odata-models-parameter.md)                                                                    |
| Verplicht      | Ja, Core                                                                                                        |
| Doel           | Zoeken en ophalen van begrippen en domeinwaarden die in het `parameter`-blok van observations kunnen voorkomen. |
| Query          | Algemene OData Core-queryopties zijn van toepassing.                                                            |
| Response       | OData collection van [Parameter](06-02-odata-models-parameter.md).                                              |
| Semantiek      | `details` wordt bepaald door `SemanticPropertyBag("ParameterDetails")`.                                         |
| Bijzonderheden | `type` identificeert de domeintabel of het begrippentype.                                                       |

## /v4/odata/foi

| Aspect     | Waarde                                                                                                         |
|------------|----------------------------------------------------------------------------------------------------------------|
| Entity set | `foi`                                                                                                          |
| Model      | [FoI](06-03-odata-models-foi)                                                                                  |
| Verplicht  | Ja, Core                                                                                                       |
| Doel       | Zoeken en ophalen van meetobjecten die als Feature of Interest in observations kunnen voorkomen.               |
| Query      | Algemene OData Core-queryopties zijn van toepassing.                                                           |
| Response   | OData collection van [FoI](06-03-odata-models-foi).                                                            |
| Semantiek  | Identiteiten, classificaties en overige semantische eigenschappen worden bepaald door de actieve semantiekset. |

> De FoI binnen een Observation wordt als ComplexType opgenomen; `/v4/odata/foi` is de OData-collectie voor meetobjecten.