# Abstract

<aside class="advisement" title="Work-in-progress">
De specificatie is nog in ontwikkeling. Tot deze finaal is, zal de specificatie nog kunnen veranderen.
De principes staan echter vast. 

Specificaties van de onderliggende semantiek (eigenschappen die mogen worden gebruikt in de API)
kunnen los van deze (technische) specificatie veranderen. Die informatie is te vinden in de folders /definitions/<domein>/<yyyyMMdd>.
</aside>

Digitale Delta API V4 is een *READ-ONLY* RESTful API die toegang biedt tot water-gerelateerde [[Observatie]]s in Nederland.

Doel van deze specificatie is het vereenvoudigen van het uitwisselen van water-gerelateerde
gegevens tussen verschillende partijen door een gestandaardiseerd contract dat de zoekmogelijkheden, gedrag en de uitvoer definiëert
die door meerdere organisaties kan worden geïmplementeerd.

// ... existing code ...

Digitale Delta API V4 is een *READ-ONLY* RESTful API die toegang biedt tot water-gerelateerde [[Observatie]]s in Nederland. 

Doel van deze specificatie is het vereenvoudigen van het uitwisselen van water-gerelateerde
gegevens tussen verschillende partijen door een gestandaardiseerd contract dat de zoekmogelijkheden, gedrag en de uitvoer definiëert
die door meerdere organisaties kan worden geïmplementeerd.

Denk aan:

- Waterschappen/Hoogheemraadschappen
- Rijkswaterstaat
- Informatiehuis Water
- Waterzuiveringsorganisaties
- Gemeenten
- Provincies
- Laboratoria
- Adviesbureaus
- Wetenschappelijke instellingen
- Sensorplatform-providers

De specificatie verenigt de [[OM&S]] standaard voor het modelleren en uitwisselen van observatiegegevens
en een subset van [[OData]] voor het zoeken.

Zowel observaties vanuit waterstanden, stromingen, neerslag, grondwaterstanden en boeien (als tijdreeksen),
als ecologische observaties vanuit visvangst, tellingen en laboratoria (als losse observaties)
kunnen beschikbaar worden gesteld.

Deze specificatie is primair gericht op waterbeheer.
Echter, door de semantiek uit te wisselen met die voor een ander domein zoals energie of automotive, is deze API generiek toepasbaar voor alles wat meting-gerelateerd is.

Deze documentatie is ontworpen om ontwikkelaars te helpen bij het integreren van deze gegevens in hun toepassingen en diensten.
Het is derhalve een _blauwdruk_ voor de implementatie van een DD API.
