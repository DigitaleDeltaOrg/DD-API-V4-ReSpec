# OData Subset

DD API V4 gebruikt een subset van [[OData]].

De gedachte erachter is dat DD API V4 niet gebruikt moet worden voor data beheer of data transformatie, 
maar puur voor het opvragen van data.
Omdat de datasets potentieel erg groot kunnen zijn, is het belangrijk dat de zoekmogelijkheden krachtig, 
maar ook efficiënt zijn.

De subset bevat:

* `$filter`
* `$top`
* `$skiptoken` (_in plaats van `$skip`_)
* `$select` (`$expand` is overbodig in het model)
* `$count`
* Alle OData functies, zoals `year()`, `month()`, `startswith()`, `endswith()`, **behalve** de geografische functies.
* Een tweetal vereenvoudigde, vervangende geografische functies: `intersects()` en `distance()`. Deze vervangen de OData geo.* functies.
* Een vereenvoudigde functie voor zoeken binnen lijsten: `has()`

Andere OData functionaliteit wordt niet ondersteund, dus ook niet:

* `$orderby`
* `$expand`
* `$compute`
* `$inlinecount`
* `$skip`
* De 'standaard' OData geografische functies `geo.distance()`, `geo.intersects()`.

## Gebruik `$skiptoken`, _niet_ `$skip`

DD API V4 gebruikt `$skiptoken` voor paginering. `$skip` wordt niet ondersteund.

`$skip` en `$skiptoken` zijn wederzijds uitsluitend. Een request **MAG NIET** beide queryopties bevatten.
Omdat `$skip` binnen DD API V4 niet is toegestaan, **MOET** een request met `$skip` worden afgewezen met `400 Bad Request`, ook wanneer daarnaast `$skiptoken` aanwezig is.

Reden is dat `$skip` inefficiënt is bij grote datasets (en naarmate grotere pagina's worden gekozen), omdat de server alle records moet doorlopen om de juiste records te vinden.

Met `$skiptoken` kan de server direct naar de juiste plek in de dataset springen. Het wordt via de `@odata.nextLink` property in de response doorgegeven.
In `$skiptoken` wordt meestal het laatste Id van de vorige response gebruikt, maar het kan ook een andere waarde zijn die de server gebruikt om de juiste plek in de dataset te vinden.
Dit moet uiteraard in combinatie met `$filter` gebruikt worden, zodat de server weet of de zoekopdracht hetzelfde blijft.

`$skiptoken` heeft enige limieten:

- Pagina's kunnen niet worden overgeslagen, dus springen naar pagina X kan niet.
- Er kan niet naar een vorige pagina terug worden gegaan.

Dit zorgt er echter voor dat de data consistent is: er worden geen resultaten overgeslagen of dubbel teruggegeven.

`$top` bepaalt het maximum aantal OData entiteiten (zoals Observations) in de `value` array van de response.
Bij een tijdreeks (CoverageJSON) telt de gehele tijdreeks als één enkel item, ongeacht het aantal meetwaarden daarin.

## Extra functies

Sommige eigenschappen in de response kunnen een Collection terug geven, een array dus.
In plaats van complexe lambda's (zoals `any` en `all`) wordt er gebruik gemaakt van de `has` functie.
Er kan dus bepaald worden of een bepaalde waarde voorkomt in een array.

Voorbeeld: `$filter=has(foi/networks, 'KRW-Monitoring') eq true`

## Geografische functies

In plaats van de 'standaard' OData geografische functies, zijn er twee nieuwe functies:

- `$filter=distance(wkt='POINT(5.387 52.156)') lt 1000`
- `$filter=intersects(wkt='POINT(5.387 52.156)') eq true`

Omdat de geografie in de dataset ook een gebied kan zijn, wordt de afstand tussen het punt en het gebied berekend. 
Als het punt binnen het gebied ligt, is de afstand 0. Ditzelfde geldt ook wanneer de geografie een enkel punt of een lijn is.

De logica hiervan is:

- Argument is altijd WKT (Well-Known Text) representatie van een punt, lijn of polygoon.
- Er kan slechts één geografisch attribuut worden gebruikt in een entiteit, want die liggen in de DD API V4 definitie altijd vast.

Standaard staan alle coördinaten in ETRS89, dus in graden (longitude latitude). Er kan altijd slechts één coördinatenstelsel worden gebruikt.

De gebruiker kan middels `Accept-Crs` header aangeven in welk CRS (coördinatenstelsel) de data teruggegeven moet worden en de vergelijking moet worden uitgevoerd.

Wanneer de gebruiker geen `Accept-Crs` header heeft opgegeven, wordt de data teruggegeven in ETRS89.

Wanneer de gebruiker een `Accept-Crs` header heeft opgegeven, moet de server de data converteren naar het gevraagde CRS en als response header `Content-Crs` toevoegen aan de response met daarin het gebruikte CRS.

Het is aan de implementatie om de conversie van en naar ETRS89 te doen. Programmabibliotheken zoals NetTopologySuite (voor .NET) en JTS (voor Java) kunnen hierbij helpen.

