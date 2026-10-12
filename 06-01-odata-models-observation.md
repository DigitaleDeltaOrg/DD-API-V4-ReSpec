# **Virtuele** Datamodellen (Observation)

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

Dit hoofdstuk beschrijft het datamodel van DD API V4, gebaseerd op een subset van de OGC [[OM&S]] standaard.
Casing van de eigenschappen volgen in V4 de JSON-camelCase conventie.

Dit beschrijft de JSON-representatie van een observatie.

Het formaat dat DD API V4 gebruikt is een **technisch uitwisselingsformaat** in JSON encoding, met JSON Schema als normatieve specificatie. 
Dit betreft niveau 4 (fysiek/technisch datamodel) volgens het MIM-lagenmodel, wat expliciet buiten de scope van MIM valt. 
MIM is bedoeld voor conceptuele en logische informatiemodellen (niveau 1-3), niet voor REST API-berichtformaten.

Vet is verplicht.

Een JSON-schema voor het observation type is [hier](https://github.com/DigitaleDeltaOrg/DD-API-V3-ReSpec/raw/refs/heads/main/main/definitions/v3.0/json-schema/observation.schema.json) beschikbaar.

Het gehele OData response in JSON-schema voor het `/v3/odata/observations` endpoint is [hier](https://github.com/DigitaleDeltaOrg/DD-API-V3-ReSpec/tree/main/definitions/v3.0/json-schema/odata.observation.schema.json) beschikbaar.

## Observation
Observation beschrijft de omstandigheden en de resultaten van een observatie.

| Eigenschap         | Type                                                             | Omschrijving                                                                                                                                        |
|--------------------|------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| **id**             | string                                                           | Unieke id van de observatie. Aangepast met casing t.o.v. V3                                                                                         |
| **resultTime**     | string                                                           | Datum en tijd waarop het resultaat beschikbaar is gekomen, in ISO8601 formaat. Het geeft aan wanneer het resultaat is opgenomen in het bronsysteem. |
| **phenomenonTime** | [Tm_Period](#Tm_Period_Closed)                                   | Periode waarin is gemeten/bemonsterd. Begin- en EndPosition zijn in ISO8601 formaat.                                                                |
| validTime          | [Tm_Period](#Tm_Period_OpenEnd)                                  | Geldigheidsperiode van de data.                                                                                                                     |
| **foi**            | [FoI](#FoI)                                                      | Feature of Interest: in DD API V3 altijd geolocatie van de observatie. Geeft aan _waar_ gemeten is.                                                 |
| **parameter**      | [SemanticPropertyBag("parameter/")](06-semantic-property-bag.md) | Beschrijft de omstandigheden van de observatie: _wat_ en _waarmee_ er gemeten is.                                                                   |
| metadata           | [SemanticPropertyBag("metadata/")](06-semantic-property-bag.md)  | Extra informatie over de observatie, ongeklassificeerd, zoals ordernummer.                                                                          |
| **result**         | [Result](#result)                                                | Resultaat: de _uitkomst_ van de observatie.                                                                                                         |
| **modifiedOn**     | string                                                           | Datum creatie of laatste wijziging in ISO8601 date-time formaat.                                                                                    | ISO8601 formaat. | 

## Tm_Period_Closed

Beschrijft een periode met begin- en einddatum. Beide waarden zijn verplicht. De naamgeving is aangepast t.o.v. V4 en is meer in lijn met SensorThings API.

| Eigenschap | Type   | Omschrijving                                       |
|------------|--------|----------------------------------------------------|
| **begin**  | string | Begin van de periode in ISO8601 date-time formaat. |
| **end**    | string | Eind van de periode in ISO8601 date-time formaat.  |

## Tm_Period_OpenEnd

Beschrijft een periode met begin- en einddatum. Einddatum is niet verplicht. De naamgeving is aangepast t.o.v. V4 en is meer in lijn met SensorThings API.

| Eigenschap | Type   | Omschrijving                                       |
|------------|--------|----------------------------------------------------|
| **begin**  | string | Begin van de periode in ISO8601 date-time formaat. |
| **end**    | string | Eind van de periode in ISO8601 date-time formaat.  |

## FoI

In DD API V3 is FoI (Feature of Interest) altijd een geolocatie.

| Eigenschap      | Type                                                                        | Omschrijving                                                  |
|-----------------|-----------------------------------------------------------------------------|---------------------------------------------------------------|
| **id**          | string                                                                      | Uniek id van de meetlocatie. Aangepast met casing t.o.v. V3   |
| **code**        | string                                                                      | Code van de meetlocatie.                                      |
| **description** | string                                                                      | Beschrijving van de meetlocatie.                              |
| **geometry**    | GeoJSON                                                                     | GeoJSON behorende bij de meetlocatie. Hernoemd naar geometry. |
| identities      | [SemanticPropertyBag("FoIIdentities")](06-00-semantic-property-bag.md)      | Identities van het meetobject in andere systemen.             |
| classifications | [SemanticPropertyBag("FoIClassifications")](06-00-semantic-property-bag.md) | Classificaties van het meetobject in andere systemen.         |

## Parameter

Parameter volgens [[OM&S]] is een dictionary van key/value pairs.

In DD API V3 is value altijd een string, waarbij geldt dat de combinatie van key en value uniek is per observatie,
maar ook dat die combinatie **zoveel mogelijk** overeenkomt met de Aquo-termen, maar die combinatie moet ook voorkomen 
in de data van het referentie-endpoint.

De keys moeten altijd conform de specifieke semantiek (semantics.csv) zijn en beginnen met `parameter/`.

## Metadata

Metadata bevat alle extra informatie over de observatie, die niet gestandaardiseerd is, zoals ordernummer van een opdracht.

De keys moeten altijd conform de specifieke semantiek (semantics.csv) zijn en beginnen met `metadata/`.

## Result

Result is het resultaat van een observatie.

Het formaat van Result is afhankelijk van het type van de observatie.  

| Eigenschap | Type                | Omschrijving                                                                              |
|------------|---------------------|-------------------------------------------------------------------------------------------|
| **id**     | Edm.String          | Uniek Id van het resultaat (_mag_ gelijk zijn aan het Id van de observatie).              |
| _truth_    | Edm.String          | Wanneer het resultaat een waarheid representeerd (waar/onwaar, true/false).               |
| _vocab_    | [Vocab](#vocab)     | Wanneer het een `typering` volgens Aquo betreft.                                          |
| _count_    | Edm.Int64           | Pure 'telling', bijvoorbeeld onder een microscoop, altijd een heel getal, zonder eenheid. |
| _coverage_ | [[CoverageJSON]]    | Tijdreeksen of verwachtingen.                                                             |
| _measure_  | [Measure](#measure) | Waarde/eenheid combinatie.                                                                |

#### Hulp bij interpretatie voor IM Metingen

IM Metingen hanteert een andere terminologie dan [[OM&S]]. Waar IM Metingen specifieke velden heeft voor typering en 
grootheid (en alfanumerieke waarde), zijn dat in [[OM&S]] verschillende soorten Result.  

##### Wanneer het een Aquo `Typering` betreft

Gebruik type [Vocab](#vocab). De `Vocabulary` (woordenlijst) daarin wordt dan gelijk aan de code van de typering 
en `Term` (woord) wordt gelijk aan de alfanumerieke waarde die binnen die typering gebruikt kan worden.
Indien deze definitie van Aquo afkomstig is, dan _mag_ de namespace leeg blijven. 
Anders moet die gevuld worden met de code voor het bronsysteem die de typering definiëert.

##### Wanneer het een Aquo `Grootheid` betreft

- Wanneer het een fysieke telling betreft (dus gehele getallen), dan _mag_ het type `Count` worden gebruikt. Dit impliceert dat de eenheid volgens Aquo termen `N` (Aantal) is.
- Gebruik anders type [Measure](#measure).

## Measure

Gemeten waarde met eenheid.

| Eigenschap  | Type       | Omschrijving                                                |
|-------------|------------|-------------------------------------------------------------|
| **unit**    | Edm.String | Eenheid van de observatie. Waar mogelijk, een Aquo eenheid. |
| **value**   | Edm.Double | Waarde van de observatie.                                   |
| namespace   | Edm.String | Bron voor de definitie. Indien leeg, Aquo.                  |
| limitSymbol | Edm.String | Limietsymbool.                                              |

## Vocab

Onderwerp/waarde combinatie (classificatie).

| Eigenschap     | Type       | Omschrijving                                               |
|----------------|------------|------------------------------------------------------------|
| **vocabulary** | Edm.String | Woordenboek (naam van de Aquo domeintabel).                |
| **term**       | Edm.String | Woord/term (definitie) binnen de vocabulary (domeintabel). |
| namespace      | Edm.String | Bron voor de definitie. Indien leeg, Aquo.                 |

## CoverageJSON

Voor tijdreeksen wordt gebruik gemaakt van [[CoverageJSON]] formaat.
Voor DD API V4 zijn er aan implementeren van een correcte CoverageJSON een aantal eisen gesteld:

- Voor sensoren wordt aangeraden om een tijdreeks te hebben met de naam van een Aquo waarnemingssoort.
  Dit zorgt ervoor dat eenvoudig een selectie kan plaatsvinden.
- phenomenonTime/begin en phenomenonTime/end moeten overeenkomen met het datum-bereik van tenminste één van de tijdreeksen.
- modifiedOn **moet** overeenkomen met de laatste wijzigingsdatum van de data.

## DD API V4 Observation UML

![Class diagram Observations](media/DD-API-V4-observations-model.svg)
<figure>
<figcaption>DD API V4 Observation Model - Illustratief diagram</figcaption>
</figure>

