# Implementatie (Informatief)

### Voorbereiding van de API

DD API V4 is primair een OData query service.

OData vereist een definitie van de entiteiten en relaties in de API. Dit wordt gedaan met CSDL (Common Schema Definition Language), een XML-gebaseerde taal.
Een [basis CSDL](https://github.com/DigitaleDeltaOrg/DD-API-V4-ReSpec/tree/main/definitions/v4.0/csdl-base.xml) is beschikbaar als onderdeel van de specificatie. Via comment is aangegeven waar aanpassingen gemaakt mogen worden.

Het `semantics.csv` bestand beschrijft met welke semantische eigenschappen de entiteiten in de API mogen worden uitgebreidt.
De gekozen domein/versie van dat bestand bepaalt dus welke semantische eigenschappen beschikbaar zijn.

Een OData API heeft een aantal vaste onderdelen:

- een $metadata (`/v4/odata/$metadata`) endpoint dat de [[CSDL]] (Common Schema Definition Language) beschrijft
- een of meer entiteiten (entity sets) die de data representeren
- een aantal standaard query-opties voor zoeken en filteren

Omdat de API een REST API is, is er ook een OpenAPI Specificatie (OAS).

De [OAS] (OpenAPI Specification), is afgeleid van de CSDL (Common Schema Definition Language) die de entiteiten en relaties in de API beschrijft.

Een [basis OAS](https://github.com/DigitaleDeltaOrg/DD-API-V4-ReSpec/tree/main/definitions/v4.0/oas3.1-base.yaml) is beschikbaar als onderdeel van de specificatie. 

YAML is gebruikt, omdat het daarmee via comments aan te geven is waar aanpassingen gemaakt mogen worden, wat niet in standaard JSON kan.

Boven beschreven wijzigingen aan parameter, metadata en referentie-entiteiten moeten ook in de OAS worden doorgevoerd.

Daarnaast kunnen er aanpassingen worden gedaan in de OAS voor zaken die niet in de CSDL staan, zoals:

- titel
- logo (gebruik als basis [het logo van DD API V4](https://github.com/DigitaleDeltaOrg/DD-API-V4-ReSpec/tree/main/media/DigitaleDelta-Basis.svg))
- server URL's
- beveiliging (mTLS, OAuth2, OpenID Connect, API Keys)
- contactinformatie
- licentie-informatie
- beschrijvingen

_Tip: het logo is in SVG-formaat. De tekst in het logo kan via een text-editor gewijzigd worden._

Zodra de CSDL en de OAS klaar zijn, is de basis voor het implementeren van de API gelegd.

### Implementatie van de API

Er kan op twee manieren begonnen worden met het implementeren van de DD API V4 specificatie:

- gebruik de OData libraries van het betreffende platform
- gebruik een eigen OData parser

Het gebruik van een platform-eigen OData library ligt voor de hand, maar houdt rekening met de 'opinies' van de 
implementaties voor typed-talen (zoals Java en C#).

Het alternatief van een eigen parser 'maken' op basis van de ANTLR-definitie van de DD API OData subset.

### Optioneel: eigen OData parser

Voor DD API V4 is er een ANTLR definitie van OData beschikbaar die precies de subset van OData implementeert zoals in 
DD API V4 gebruikt wordt.

ANTLR staat voor 'Abstract Syntax Tree Recognizer' en is een parser/tokenizer *generator*. 
Een ANTLR-definitie is een YAML-bestand dat de grammatica van een parser beschrijft.

De ANTLR-definitie van DD API V4 kan worden gebruikt om een parser te genereren in verschillende programmeertalen, 
zoals Java, C#, Python, JavaScript. 

Er zijn nog meer tools beschikbaar hetzelfde doen voor andere programmeertalen, zoals C, C++ en Rust.

Dit is de **optionele code-generatie fase**.

[Voor C# is er een open source library gemaakt voor DD API V3](https://github.com/DigitaleDeltaOrg/ODataLib-CSharp) die geen afhankelijkheden van de Microsoft OData libraries.
Deze zijn ook beschikbaar als NuGet pakketten. Deze zijn nog steeds geldig voor DD API V4.

Dynamische talen hebben voor OData een voordeel, omdat er al veel libraries beschikbaar zijn, maar ook omdat de CSDL dynamisch is.

### Runtime van de API

Tijdens runtime (opvragen van data) zijn er een aantal stappen die doorlopen moeten worden:

1. **Ontvangen van de HTTP request**: De API ontvangt een HTTPS request met een URL die de entiteit en eventuele query-opties bevat.
2. **Valideren/parsen van de request**: De API valideert en parsed de request, gebruikmakend van een OData parser. 
3. **Parsen van de OData query**: De API gebruikt de OData parser (of de gegenereerde parser) om de query-opties te parsen en om te zetten in een interne representatie.
4. **Opvragen van de data**: De API gebruikt de interne representatie van de query om de data op te vragen uit de onderliggende database of datastore.  
   Dit kan een SQL-database, een NoSQL-database, of een andere datastore zijn. **Houdt rekening met toegangsrechten!**
5. **Formatteren van de response**: De API formatteert de opgevraagde data in het juiste formaat JSON volgens de OData specificatie én de DD API V4 specificatie.
6. **Terugsturen van de response**: De API stuurt de geformatteerde data terug naar de client als een HTTPS-response.
7. **Foutafhandeling**: De API moet in staat zijn om fouten af te handelen, zoals ongeldige requests, ontbrekende data, of interne serverfouten. 
   Fouten moeten worden gerapporteerd aan de client met de juiste HTTP-statuscodes en foutberichten.

## Foutmeldingen

Ook de foutmeldingen van de API worden gestandaardiseerd.

| HTTP statuscode           | Foutmelding                                             |
|---------------------------|---------------------------------------------------------|
| 400 Bad Request           | Ongeldige request                                       |
| 401 Unauthorized          | Onbevoegde toegang                                      |
| 403 Forbidden             | Onbevoegde toegang                                      |
| 404 Not Found             | Onbekende resource                                      |
| 429 Too Many Requests     | RateLimit (te veel bevragingen in een bepaalde periode) |
| 500 Internal Server Error | Interne serverfout                                      |
| 503 Service Unavailable   | Service niet beschikbaar                                |

## RateLimit

Een API-implementatie kan ervoor kiezen om het aantal aanvragen per tijdseenheid te beperken.

Indien rate limiting wordt toegepast, moeten de volgende headers worden toegevoegd aan de response:

- RateLimit-Limit
- RateLimit-Remaining
- RateLimit-Reset

De headers geven inzicht in hoe lang er gewacht moet worden voordat de volgende aanvraag kan worden verzonden.

Indien er teveel requests tegelijk worden verzonden, moet de API een 503 (Service Unavailable) response terugsturen.

## Tips

Performance is een zeer belangrijk aspect bij DD API V4, die potentieel veel data kan bevatten. 

## API Design Rules
Zorg ervoor dat de API voldoet aan de relevante [API Design Rules](https://gitdocumentatie.logius.nl/publicatie/api/adr/2.0.0/).

### Algemeen
`$count` is standaard niet ingeschakeld. Reden: bij grote datasets kan het zeer vertragend zijn.

Wanneer '$count' is ingeschakeld, dan is het aan te bevelen het resultaat van de count te cachen, 
zodat bij herhaalde requests de count niet steeds opnieuw berekend hoeft te worden. 

Gebruik daarbij zowel `$filter` als (eventueel) de gebruikeridentificatie in de cache-key.

### `$skiptoken`
`$skiptoken` is een query-optie die gebruikt wordt voor paginering van grote datasets.
Het werkt door een token terug te geven in de response die de client kan gebruiken om de volgende pagina op te vragen.

Dit werkt sneller dan `$skip`, omdat het niet nodig is om de volledige dataset door te lopen.

Het volgende blok data kan dan worden bepaald door in het filter op de opslaglaag een '> Id' toe te voegen.

`$skip` wordt _sterk ontraden_, doordat het vertragend is voor systemen met grote datasets, door de werking van databases.

_Id is hier een unieke identifier van het record, bijvoorbeeld een auto-increment integer of een UUID._

#### Produceren

- Bepaal de request-URL zonder het eventuele opgegeven `$skiptoken` (baseRequestURL)
- Bepaal de Id van de laatste record voor de response
- Voeg Id en de baseRequestURL toe aan de request-URL
- Voeg een tijdstempel toe aan de request-URL
- Base64-encode het resultaat
- Voeg een HMAC om het resultaat te ondertekenen (HHACSHA256 of HMACSHA512)
- Voeg het resultaat toe aan het `$skiptoken`

Dit maakt het `$skiptoken` redelijk veilig tegen misbruik.

Tip: sorteer altijd de records op Id.

#### Valideren
- Base64-decode het `$skiptoken`
- Controleer of de URL van de aanvrager (zonder het `$skiptoken`) overeenkomen met die in het `$skiptoken` is opgegeven.
- Controleer of de tijdstempel in het `$skiptoken` niet meer dan x minuten geleden is.
- Extraheer het laatst gebruikte Id
- Valideer de HMAC-handtekening
- Voeg '> Id' toe aan het filter

###  Componenten
Er zijn voor C# een aantal open source componenten beschikbaar die kunnen helpen bij de implementatie van een DD API V4: https://github.com/DigitaleDeltaOrg/ODataLib-CSharp. 

Deze zijn ook beschikbaar als NuGet pakketten door te zoeken op `DigitaleDelta`.

Deze componenten zorgen voor het ontleden van de OData query, vertalen naar database queries en formatteren van de response. Hierbij zijn geen Microsoft OData libraries nodig.

Voor V4 is een toolkit in ontwikkeling.

## Conformiteit Checklist — DD API V4 Core

Onderstaande tabel vat de normatieve eisen samen waaraan een implementatie moet voldoen om als DD API V4 Core-conform te worden beschouwd.

## Conformiteit Checklist — DD API V4 Core

| ID          | Onderwerp           | Eis                                                                                                     |
|:------------|:--------------------|:--------------------------------------------------------------------------------------------------------|
| **CORE-01** | API-versie          | De implementatie MOET DD API V4 als ondersteunde API-versie declareren.                                 |
| **CORE-02** | Read-only           | De API MOET read-only zijn voor DD API V4-resources.                                                    |
| **CORE-03** | HTTPS               | De API MOET via HTTPS beschikbaar zijn.                                                                 |
| **CORE-04** | Discovery           | De API MOET een manifest aanbieden.                                                                     |
| **CORE-05** | OpenAPI             | De API MOET een machineleesbare OpenAPI 3.1-beschrijving aanbieden of daarnaar verwijzen.               |
| **CORE-06** | OData metadata      | De API MOET een OData `$metadata` document aanbieden voor OData-endpoints.                              |
| **CORE-07** | Semantiek           | Iedere dataset MOET verwijzen naar een actieve definitie-set.                                           |
| **CORE-08** | SemanticPropertyBag | Eigenschappen in semantic property bags MOETEN voldoen aan de actieve definitie-set, profiles en rules. |
| **CORE-09** | Result types        | Iedere dataset MOET aangeven welke result types worden ondersteund.                                     |
| **CORE-10** | Endpoints           | De beschikbare endpoints MOETEN in het manifest en/of de OpenAPI-specificatie zijn beschreven.          |
| **CORE-11** | OData subset        | OData-endpoints MOETEN de verplichte DD API V4 OData subset ondersteunen.                               |
| **CORE-12** | Paginering          | Endpoints die collecties teruggeven MOETEN paginering ondersteunen.                                     |
| **CORE-13** | Datamodellen        | Responses MOETEN voldoen aan de relevante V4-datamodellen en JSON Schema’s.                             |
| **CORE-14** | Foutafhandeling     | Fouten MOETEN met passende HTTP-statuscodes worden gerapporteerd.                                       |
| **CORE-15** | Optionele modules   | Gedeclareerde optionele modules MOETEN voldoen aan de ReSpec van die module.                            |
| **CORE-16** | Manifest publiseren | Een geldig manifest moet worden gepubliseerd.                                                           |

## Conformiteit Checklist — Definitie-set

## Checklist definitie-sets

Deze checklist is bedoeld voor het beheer van officiële DD API V4 definitie-sets.
De checklist is primair bedoeld voor de Architecture Board of een door de Architecture Board aangewezen 
beheerorganisatie.

API-implementatoren gebruiken een gepubliceerde definitie-set en mogen deze niet wijzigen binnen de 
context van DD API V4-conformiteit.
Een implementatie is conform wanneer zij verwijst naar een geldige, gepubliceerde definitie-set en de 
daarin opgenomen semantiek, profiles en rules correct toepast.

| ID         | Onderwerp               | Eis                                                                                                               |
|:-----------|:------------------------|:------------------------------------------------------------------------------------------------------------------|
| **DEF-01** | Publicatie              | Een definitie-set MOET via een stabiele URI beschikbaar zijn.                                                     |
| **DEF-02** | Machineleesbaarheid     | Een definitie-set MOET machineleesbaar zijn, bijvoorbeeld via CSV-bestanden en/of `definition-set.json`.          |
| **DEF-03** | Semantics               | Een definitie-set MOET de toegestane semantische eigenschappen beschrijven.                                       |
| **DEF-04** | Groups                  | Iedere semantische eigenschap MOET aan een semantische groep zijn gekoppeld.                                      |
| **DEF-05** | Datatype                | Iedere semantische eigenschap MOET een datatype hebben.                                                           |
| **DEF-06** | Profiles/rules          | Indien profiles of rules worden gebruikt, MOETEN deze machineleesbaar onderdeel zijn van de definitie-set.        |
| **DEF-07** | Extensions              | Eigenschappen die alleen voor extensies gelden, MOETEN dat aangeven via `extensions`.                             |
| **DEF-08** | Backwards compatibility | Binnen een gepubliceerde definitie-set MOGEN bestaande definities niet worden verwijderd of semantisch gewijzigd. |
