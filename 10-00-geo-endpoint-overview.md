# Geo endpoints overzicht

De volgende geo-endpoints en hun resultaten zijn vereist voor DD API V4 Core.

| Endpoint                          | Stijl                     | Core/module | Doel                         | Input                             | Output                                                     |
|-----------------------------------|---------------------------|-------------|------------------------------|-----------------------------------|------------------------------------------------------------|
| `/v4/geo/measurementobjects`      | JSON-FG FeatureCollection | Core        | Meetobjecten zoeken          | Geo-queryparameters, zoals `bbox` | JSON-FG `FeatureCollection` van MeasurementObject features |
| `/v4/geo/measurementobjects/{id}` | JSON-FG Feature           | Core        | Specifiek meetobject ophalen | `{id}`                            | JSON-FG `Feature` van één MeasurementObject                |

Een implementatie die één of meer van deze endpoints niet aanbiedt, is niet DD API V4-conform.

Het collectie-endpoint `/v4/geo/measurementobjects` ondersteunt geo-specifieke query-parameters. Deze query-parameters zijn bedoeld voor kaart- en GIS-toepassingen en gebruiken geen OData-query-syntaxis.

De volgende query-parameters MOETEN worden ondersteund:

| Parameter     | Type    | Verplicht | Omschrijving                                                                                              |
|---------------|---------|-----------|-----------------------------------------------------------------------------------------------------------|
| `bbox`        | string  | Nee       | Bounding box voor ruimtelijke selectie. De waarde bestaat uit `minx,miny,maxx,maxy` in het gebruikte CRS. |
| `featureType` | string  | Nee       | Filtert op feature type uit de actieve feature type-definitie.                                            |
| `limit`       | integer | Nee       | Maximaal aantal features in de response.                                                                  |

De geo-endpoints gebruiken JSON-FG als primair uitwisselingsformaat.

Om compatibiliteit met bestaande GeoJSON-clients, GIS-systemen en de Nederlandse API Design Rules Geo-module te vergroten, 
is de GeoJSON-compatible member `geometry` altijd verplicht.

Clients die JSON-FG niet of slechts gedeeltelijk ondersteunen, kunnen de response verwerken als een GeoJSON-achtige `Feature` 
of `FeatureCollection` door onbekende members zoals `featureType`, `place`, `coordRefSys` en `conformsTo` te negeren.

Wanneer `Accept-Crs` wordt gebruikt, wordt `geometry` teruggegeven in het gevraagde CRS en vermeldt de server het gebruikte 
CRS in de response-header `Content-Crs`. Hierdoor kan een response JSON-FG-conform en GeoJSON-compatible van structuur zijn, 
zonder noodzakelijkerwijs strikt GeoJSON in CRS84 te zijn.

De volgende lijst toont de minimaal ondersteunde coördinatenstelsels met hun EPSG-codes en eenheden, dus bij `Accept-Crs` en `Content-Crs`:

| Coördinatenstelsel | EPSG-code  | Eenheid |
|--------------------|------------|---------|
| ETRS89             | EPSG:4258  | Graden  |
| WGS84              | EPSG:4326  | Graden  |
| ETRS89/31N         | EPSG:25831 | Meters  |
| RD New             | EPSG:28992 | Meters  |