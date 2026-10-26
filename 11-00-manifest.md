# Manifest

Naast discovery via individuele response headers moet een implementatie een manifest publiceren.
Het manifest beschrijft de API-implementatie en het beschikbare data-aanbod in één machineleesbaar document.

Het manifest is bedoeld voor clients, catalogi, validatietools en generatoren die vooraf willen bepalen:

- welke API-versie wordt aangeboden;
- welke organisatie of dienst de API aanbiedt;
- welke data-aanbiedingen beschikbaar zijn;
- welke definitie-set of semantiek per data-aanbieding geldt;
- welke profiles (`DD-V4-Profiles`), capabilities (`DD-V4-Capabilities`) en result types (`DD-V4-ResultTypes`) worden ondersteund;
- welke endpoints beschikbaar zijn;
- welke temporele en ruimtelijke dekking van toepassing is;
- welke toegangsvoorwaarden, licenties en contactgegevens van toepassing zijn.

Een template voor het manifest is beschikbaar in deze specificatie onder [`/definitions/v4.0/manifest.json`](/definitions/v4.0/manifest.json).

De service **MOET** via de `DD-V4-Manifest` header verwijzen naar het manifest:

```http
DD-V4-Manifest: https://api.example.org/v4/manifest.json
```

Het manifest **KAN** worden gepubliceerd op `/v4/manifest.json`. Dit pad wordt aanbevolen voor implementaties die geen andere discovery-URL nodig hebben. Wanneer een implementatie een andere locatie gebruikt, **MOET** de `DD-V4-Manifest` header naar die locatie verwijzen.

## Relatie met response headers

De response headers geven per response of endpoint aan welke semantiek, profielen, capabilities en result types van toepassing zijn. Het manifest biedt een overkoepelend discovery-document voor de gehele implementatie of voor één of meer data-aanbiedingen binnen die implementatie.

De informatie in het manifest en de response headers **MOET** inhoudelijk consistent zijn. Wanneer een manifest bijvoorbeeld aangeeft dat een data-aanbieding een bepaald profiel of result type ondersteunt, moeten responses voor die data-aanbieding daarmee in overeenstemming zijn.

De volgende headers hebben een directe relatie met het manifest:

| Header               | Relatie met manifest                                                                  |
|----------------------|---------------------------------------------------------------------------------------|
| `DD-V4-Manifest`     | Verwijst naar het manifest zelf.                                                      |
| `DD-V4-Semantics`    | Verwijst naar de actieve definitie-set die ook in het manifest kan worden beschreven. |
| `DD-V4-Profiles`     | Geeft de ondersteunde profielen aan die ook in het manifest kunnen worden opgenomen.  |
| `DD-V4-Capabilities` | Geeft optionele functionaliteit aan die ook in het manifest kan worden opgenomen.     |
| `DD-V4-ResultTypes`  | Geeft ondersteunde result types aan die ook in het manifest kunnen worden opgenomen.  |

## Relatie met definitie-sets

Een manifest beschrijft welke definitie-set of definitie-sets door een implementatie worden gebruikt.
Een definitie-set bevat onder andere `semantics.csv`, `profiles.csv`, `rules.csv` en `rule-types.csv`.

Het manifest definieert de semantiek niet zelf opnieuw, maar verwijst naar de gebruikte definitie-set.
De definitie-set blijft de normatieve bron voor toegestane semantische eigenschappen, profielen en regels.

## Relatie met DCAT-AP-NL en data.overheid.nl

Het DD API V4 manifest kan metadata bevatten die aansluit op DCAT-AP-NL en publicatie via data.overheid.nl. Het manifest is echter geen vervanging van een formeel DCAT-AP-NL record. Het is een DD API-specifiek discovery document dat voldoende informatie kan bevatten om een DCAT-AP-NL datasetbeschrijving, distributie en dataservice af te leiden.

Een manifest **KAN** DCAT-achtige eigenschappen opnemen, zoals:

| Eigenschap           | Betekenis                                           |
|----------------------|-----------------------------------------------------|
| `description`        | Beschrijving van de data-aanbieding.                |
| `publisher`          | Publicerende organisatie.                           |
| `creator`            | Maker of bronhouder van de data.                    |
| `contactPoint`       | Contactpunt voor de data-aanbieding.                |
| `landingPage`        | Webpagina met menselijke toelichting op de dataset. |
| `license`            | Licentie waaronder de data beschikbaar is.          |
| `accessRights`       | Toegangsregime, bijvoorbeeld publiek of beperkt.    |
| `language`           | Taal van de metadata of data-aanbieding.            |
| `themes`             | Thema's waaronder de dataset valt.                  |
| `keywords`           | Zoekwoorden voor vindbaarheid.                      |
| `issued`             | Publicatiedatum.                                    |
| `modified`           | Laatste wijzigingsdatum.                            |
| `accrualPeriodicity` | Actualisatiefrequentie.                             |
| `distributions`      | Beschikbare distributies of toegangsvormen.         |
| `dataService`        | Beschrijving van de API als dataservice.            |

Catalogusprocessen die uitsluitend DCAT-AP-NL metadata verwerken, **MOGEN** DD API-specifieke eigenschappen zoals `semantics`, `profiles`, `capabilities` en `resultTypes` negeren. Deze eigenschappen blijven echter normatief relevant voor DD API-clients en validatietools.

Wanneer een manifest wordt gebruikt als bron voor DCAT-AP-NL metadata, **MOETEN** de DCAT-relevante eigenschappen zelfstandig voldoende informatie bevatten. DD API-specifieke extensies mogen niet noodzakelijk zijn om de dataset als catalogusrecord te begrijpen.