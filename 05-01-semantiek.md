# Semantiek

In V4 is de semantiek explicieter en gestructureerder vastgelegd dan in V3.  
De semantiek bestaat uit meerdere componenten die samen bepalen welke gegevens binnen een DD API-implementatie mogen 
worden aangeboden en hoe deze moeten worden geïnterpreteerd.

Deze componenten worden altijd vastgesteld per domein en versie. Samen vormen zij een definitie-set. 
Een definitie-set beschrijft voor één domein, bijvoorbeeld `water`, en één referentiedatum, bijvoorbeeld `20261101`, 
welke profielen, attributen, capabilities en regels van toepassing zijn.

Een definitie-set bestaat ten minste uit:

- `profiles.csv`: de beschikbare profielen
- `semantics.csv`: de beschikbare semantische attributen
- `rule-types.csv`: de betekenis van de gebruikte regeltypen
- `rules.csv`: de concrete regels die binnen de definitie-set gelden

Iedere response **MOET** de header `DD-V4-Semantics` meesturen. De waarde van deze header is een URL naar de definitie-set die voor de response is gebruikt, bijvoorbeeld:

```http 
https://digitaledeltaorg.github.io/DD-API-V4-ReSpec/definitions/water/20261101
```

Clients, validators en andere tooling kunnen deze header gebruiken om te bepalen welke semantiek, profielen en regels van toepassing zijn op de response.

## De rol van profielen

De basis van de semantiek wordt gevormd door profielen. In `profiles.csv` staat welke profielen binnen een definitie-set beschikbaar zijn.

Een profiel beschrijft de semantische toepassingscontext waarin gegevens worden aangeboden.
Profielen bepalen welke semantische eigenschappen uit `semantics.csv` binnen een `SemanticPropertyBag`, 
zoals `parameter` of `metadata`, beschikbaar zijn.

Een profiel bepaalt niet het resultaattype van een observatie. 
Het resultaattype wordt bepaald door de eigenschap `type` op observation-niveau, met waarden 
zoals `measure`, `count`, `category`, `truth` of `coverage`.

Een profiel bepaalt ook niet de interne structuur van een CoverageJSON-resultaat.
Wanneer type de waarde coverage heeft, wordt de concrete coverage-structuur bepaald door
de CoverageJSON-inhoud en eventuele coverage-specifieke afspraken of extensies.

Profielen kunnen worden gecombineerd. Een observatie of dataset kan bijvoorbeeld zowel het 
profiel `TimeSeries` als `WaterQuantity` gebruiken. De toegestane eigenschappen in `parameter` en `metadata` 
zijn dan de eigenschappen die volgens de actieve definitie-set bij die profielen horen, aangevuld of beperkt door de regels in `rules.csv`.

## Semantische attributen

In `semantics.csv` staat welke semantische attributen binnen een definitie-set beschikbaar zijn.

Per attribuut wordt onder andere vastgelegd:

- de identifier van het attribuut
- het OData datatype
- een Engelstalige en Nederlandstalige naam of identifier
- een Engelstalige en Nederlandstalige beschrijving
- een eventuele verwijzing naar een externe definitie
- de bron van de definitie
- de profielen waarvoor het attribuut beschikbaar en relevant is.

De kolom `Profiles` in `semantics.csv` beschrijft de toepassingsscope van een attribuut. 
Deze kolom geeft aan binnen welke profielen een attribuut onderdeel is van het beschikbare vocabulaire.

Deze profielkoppeling is geen verplichtingsregel. 
Een attribuut dat aan een profiel is gekoppeld, **MAG** binnen dat profiel worden gebruikt, 
maar is daardoor niet automatisch verplicht.

Bijvoorbeeld: als een attribuut in `semantics.csv` is gekoppeld aan het profiel `Ecology`, betekent dit dat 
het attribuut beschikbaar en betekenisvol is voor ecologische observaties. 
Óf het attribuut ook verplicht is, wordt bepaald door de regels in `rules.csv`.

## Rules

De regels in `rules.csv` leggen aanvullende constraints vast op het gebruik van semantische attributen.

Rules kunnen bijvoorbeeld bepalen:

- dat een attribuut verplicht is
- dat een attribuut onder bepaalde omstandigheden verplicht is
- dat een attribuut onder bepaalde omstandigheden niet mag voorkomen
- dat een attribuut alleen mag voorkomen in combinatie met een ander attribuut
- dat precies één attribuut of waarde uit een set gekozen moet worden
- dat een attribuut alleen voor bepaalde profielen geldt.

De betekenis van de gebruikte regeltypen ligt vast in `rule-types.csv`. Daarmee vormen `rules.csv` en `rule-types.csv` 
samen een beperkte, domeinspecifieke regeltaal voor DD API V4.

DD API V4 introduceert hiermee geen algemene programmeer- of rule-engine-taal. De regelset is bewust beperkt gehouden, 
zodat regels zowel leesbaar blijven voor implementerende partijen als bruikbaar zijn voor validatietooling.

## Verhouding tussen `semantics.csv` en `rules.csv`

`semantics.csv` en `rules.csv` hebben verschillende rollen.

`semantics.csv` beschrijft het beschikbare vocabulaire per profiel. Het bestand geeft aan welke attributen bestaan, 
wat ze betekenen, welk datatype ze hebben en binnen welke profielen ze relevant zijn.

`rules.csv` beschrijft de afdwingbare regels binnen dat vocabulaire. 
Het bestand bepaalt wanneer attributen verplicht zijn, verboden zijn of afhankelijk zijn van andere attributen of 
condities.

De verhouding is als volgt:

| Bestand          | Vraag die het beantwoordt                                          |
|------------------|--------------------------------------------------------------------|
| `profiles.csv`   | Welke profielen bestaan binnen deze definitie-set?                 |
| `semantics.csv`  | Welke attributen bestaan en voor welke profielen zijn ze relevant? |
| `rule-types.csv` | Welke soorten regels bestaan en wat betekenen ze?                  |
| `rules.csv`      | Welke verplichtingen, verboden en afhankelijkheden gelden er?      |

Deze scheiding voorkomt dat `rules.csv` alle profieltoepasbaarheid per attribuut als afzonderlijke regels moet herhalen. 
Zonder deze scheiding zou het aantal regels sterk toenemen en zouden de regels minder leesbaar worden.

Een attribuut dat in `semantics.csv` aan een profiel is gekoppeld, behoort tot het vocabulaire van dat profiel. 
Een regel in `rules.csv` kan vervolgens bepalen dat dit attribuut in een specifieke situatie verplicht, verboden of conditioneel toegestaan is.

## Interpretatie voor validatie

Voor validatie geldt de volgende volgorde:

1. Bepaal de gebruikte definitie-set op basis van de header `DD-V4-Semantics`.
2. Bepaal welke profielen van toepassing zijn op de implementatie of response.
3. Controleer of gebruikte attributen bekend zijn in `semantics.csv`.
4. Controleer of gebruikte attributen beschikbaar zijn voor de toepasselijke profielen.
5. Pas de regels uit `rules.csv` toe die gelden voor de toepasselijke profielen.

Een attribuut dat niet voorkomt in `semantics.csv` is onbekend binnen de definitie-set.

Een attribuut dat wel voorkomt in `semantics.csv`, maar niet gekoppeld is aan het toepasselijke profiel, 
behoort niet tot het vocabulaire van dat profiel. 
Implementaties **MOGEN NIET** zulke attributen aanbieden binnen dat profiel. 
Een validator **MOET** dit als fout rapporteren wanneer strikte profielvalidatie wordt toegepast.

Een attribuut dat voorkomt in `semantics.csv` en gekoppeld is aan het toepasselijke profiel, 
mag binnen dat profiel worden gebruikt, tenzij een regel in `rules.csv` dit onder specifieke omstandigheden verbiedt.

Een attribuut is alleen verplicht wanneer dit expliciet volgt uit `rules.csv`.

## Condities in rules

Sommige regels zijn afhankelijk van een conditie. De kolom `Condition` in `rules.csv` gebruikt daarvoor een beperkte 
expressiesyntaxis, gebaseerd op de DD API OData `$filter`-subset.

Deze syntaxis is bedoeld voor eenvoudige vergelijkingen en logische combinaties, bijvoorbeeld:

```text 
type ne 'category'
```

```text 
type eq 'measure' and parameter/quantity eq 'WATHTE'
```

Aanwezigheid van andere attributen wordt bij voorkeur niet als vrije conditietekst uitgedrukt, maar via regeltypen zoals `requires` of `requiredWhenPresent`. Daarmee blijft de betekenis van regels eenduidig en machineleesbaar.

## Voorbeeld

Stel dat `result/measure/uom` in `semantics.csv` is gekoppeld aan de 
profielen `Ecology`, `WaterQuality` en `WaterQuantity`.

Dat betekent dat `result/measure/uom` binnen deze profielen een bekend en toegestaan attribuut is.

In `rules.csv` kan vervolgens een regel staan die bepaalt dat dit attribuut verplicht is 
wanneer het resultaattype `Measure` is:

```csv 
RuleId,RuleType,Properties,Target,Condition,Message,Message_nl,ForProfiles 
result_measure_uom.requiredWhen.typeEqMeasure,requiredWhen,result/measure/uom,,type eq 'measure',Property result/measure/uom is required when result type is 'measure'.,Eigenschap result/measure/uom is verplicht wanneer resultaattype 'measure' is.,Ecology|WaterQuality|WaterQuantity
```

De combinatie betekent:

- `semantics.csv`: `result/measure/uom` is beschikbaar binnen de genoemde profielen
- `rules.csv`: `result/measure/uom` is verplicht wanneer `type eq 'measure'`.

Zonder de regel in `rules.csv` zou het attribuut dus wel toegestaan zijn, maar niet verplicht. 
