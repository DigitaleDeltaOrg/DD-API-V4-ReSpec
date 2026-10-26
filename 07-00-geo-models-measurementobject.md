# **Virtuele** Datamodellen (Measurement object, geo-formaat)

<aside class="advisement" title="Work-in-progress">
De specificatie is nog in ontwikkeling. Tot deze finaal is, zal de specificatie nog kunnen veranderen.
De principes staan echter vast. 

Specificaties van de onderliggende semantiek (eigenschappen die mogen worden gebruikt in de API)
kunnen los van deze (technische) specificatie veranderen. Die informatie is te vinden in de folders /definitions/<domein>/<yyyyMMdd>.
</aside>

<aside class="advisement" title="Virtueel model">
De modellen in dit hoofdstuk zijn virtueel. 
Ze beschrijven uitsluitend de structuur van de data zoals deze door de API wordt uitgewisseld. 
Een implementatie hoeft deze structuur intern niet als opslagmodel te gebruiken; de aanbieder is vrij in de keuze van database-technologie en mapt de eigen bronnen on-the-fly naar dit virtuele model.
</aside>

Het geo-formaat is een nieuw formaat voor DD API V4. Doel is om uitwisseling met geografische systemen te vereenvoudigen.
Met dit formaat wordt *alleen* meetobjecten uitgewisseld, geen metingen. Het kan gebruikt worden voor het maken van kaartlagen of objecten die op een kaart moeten worden getoond.

## MeasurementObject

Verplichte eigenschappen zijn vetgedrukt. Eigenschappen binnen `properties` kunnen door de actieve semantiekset worden uitgebreid of beperkt.

| Eigenschap      | Type             | Verplicht    | Omschrijving                                                                                                                                     |
|-----------------|------------------|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| **id**          | string           | Ja           | Stabiele URI of identifier van het meetobject.                                                                                                   |
| **type**        | string           | Ja           | Moet de waarde `Feature` hebben.                                                                                                                 |
| conformsTo      | array[string]    | Nee          | Lijst van JSON-FG-conformance classes waaraan de response voldoet. Bij een `FeatureCollection` staat deze eigenschap op collection-niveau.       |
| **featureType** | string           | Ja           | Type van de feature. De waarde moet voorkomen in de actieve feature type-definitie.                                                              |
| **geometry**    | GeoJSON Geometry | Ja           | Primaire geometrie van de feature. Wordt teruggegeven in het CRS zoals bepaald door `Accept-Crs` of het standaard-CRS van het endpoint.          |
| place           | JSON-FG Place    | Nee          | Aanvullende geometrische representatie, bijvoorbeeld oorspronkelijke geometrie of alternatieve representatie.                                    |
| coordRefSys     | string           | Conditioneel | CRS-identifier voor de gebruikte geometrische representatie wanneer dit nodig is volgens JSON-FG of wanneer het gebruikte CRS niet impliciet is. |
| **properties**  | object           | Ja           | Eigenschappen van het meetobject. De toegestane inhoud wordt bepaald door het vaste model en de actieve semantiekset.                            |


## MeasurementObject properties

De onderstaande tabel beschrijft de generieke structuur van `properties`. De concrete toegestane semantische eigenschappen worden bepaald door de actieve semantiekset. Eigenschappen die niet in de actieve semantiekset voorkomen, of niet behoren tot een actieve extensie, zijn niet toegestaan.

| Eigenschap         | Type                                     | Verplicht | Omschrijving                                                                                                                                                 |
|--------------------|------------------------------------------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| description        | string                                   | Ja        | Mensleesbare beschrijving van het meetobject.                                                                                                                |
| identities         | array[[identity](#identity)]             | Nee       | Identificaties van het meetobject in andere registraties of bronsystemen. De concrete toegestane waarden kunnen door de actieve semantiekset worden beperkt. |
| classifications    | array[[classification](#classification)] | Nee       | Classificaties van het meetobject volgens externe classificatiestelsels. De concrete toegestane waarden kunnen door de actieve semantiekset worden beperkt.  |
| networks           | array[string]                            | Nee       | Verwijzingen naar meetnetten waarvan het meetobject onderdeel is. Alleen van toepassing wanneer de relevante extensie wordt ondersteund.                     |
| overige properties | afhankelijk van semantiekset             | Nee       | Aanvullende properties zijn alleen toegestaan wanneer zij in de actieve semantiekset voor de juiste groep zijn opgenomen.                                    |


## Identity

| Eigenschap   | Type   | Verplicht | Omschrijving                                                                       |
|--------------|--------|-----------|------------------------------------------------------------------------------------|
| **identity** | string | Ja        | Identifier van het meetobject binnen het genoemde domein of bronsysteem.           |
| **domain**   | string | Ja        | URI of code van het domein, register of bronsysteem waarin de identificatie geldt. |


## Classification

| Eigenschap | Type   | Verplicht | Omschrijving                                  |
|------------|--------|-----------|-----------------------------------------------|
| **system** | string | Ja        | URI of code van het classificatiekader.       |
| **value**  | string | Ja        | Code of waarde binnen het classificatiekader. |
| label      | string | Nee       | Mensleesbaar label van de classificatie.      |


Dit profiel gebruikt JSON-FG als basis, maar stelt `geometry` altijd verplicht om interoperabiliteit met bestaande GIS-systemen en clients die JSON-FG niet of slechts gedeeltelijk ondersteunen te verbeteren.

`geometry` bevat de primaire geometrie van de feature. 
Wanneer de request-header `Accept-Crs` wordt gebruikt, bepaalt deze header het CRS waarin `geometry` 
wordt teruggegeven. De server vermeldt het daadwerkelijk gebruikte CRS in de response-header `Content-Crs`.

Wanneer `Accept-Crs` niet wordt gebruikt, geeft de server `geometry` terug in het standaard-CRS van de API, 
dataset of het endpoint.

De JSON-FG member `place` is optioneel. `place` kan worden gebruikt wanneer een aanvullende geometrische 
representatie nodig is, bijvoorbeeld als oorspronkelijke geometrie of als alternatieve representatie. 
Wanneer `place` geen extra informatie toevoegt ten opzichte van `geometry`, wordt aanbevolen `place` weg te laten.

Note: hier is gebruik gemaakt van het formaat JSONC (JSON with Comments).
De commentaarregels mogen niet gebruikt worden in de responses. Dat geldt dus voor regels die beginnen met '//'.

De uitvoer van een enkele geo-object is in de vorm van een Feature, zoals hier aangegeven.

`conformsTo` is bedoeld voor JSON-FG-clients. 
GeoJSON-clients die deze member niet kennen, negeren deze en verwerken uitsluitend de GeoJSON-compatibele members.
Het moet op document-niveau staan. Als het een `Feature` is, dan op dat niveau. Als het een `FeatureCollection` is, 
dan op `FeatureCollection`-niveau.

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
