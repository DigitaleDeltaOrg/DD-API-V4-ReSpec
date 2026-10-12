# Ontwerpconcepten

De DD API V4 specificatie is ontworpen met een aantal kernconcepten in gedachten om interoperabiliteit, flexibiliteit en gebruiksgemak te waarborgen.
Hieronder worden de belangrijkste ontwerpconcepten toegelicht.

- Eenvoudig, gestandaardiseerd, virtueel datamodel
- Subset van [[OM&S]] via profielen
- Subset van de [[OData]] V4 standaard met vereenvoudigde geografische uitbreidingen
- [[OpenAPI 3.1]] beschrijft de API
- Semantische interoperabiliteit via gestandaardiseerde vocabularia ('Water-taal' van [[Aquo]]), _maar vocabulaire is aan te passen voor andere domeinen_.
- Profielen voor het beschrijven van de data
- Eenvoudig en toegankelijk

## Virtueel Datamodel

Onderdeel van de OData standaard is het [[EDM]] beschreven in de CSDL-standaard. 

Dit is een abstracte representatie van de data die wordt aangeboden via de API.

Door die representatie is het mogelijk om data uit verschillende bronnen op een uniforme manier te benaderen.

De specificatie kiest daarbij bewust voor een pragmatische benadering: open standaarden worden gevolgd waar dat de 
interoperabiliteit vergroot, maar waar nodig worden profielen, subsets en aanvullende afspraken gebruikt om 
implementatie eenvoudig en voorspelbaar te houden.

Het EDM is zo plat mogelijk, waardoor het gemakkelijk te begrijpen en te implementeren is. 
Daarom zijn complexe OData-zoekopdrachten die gebruik maken van `$expand` en lambda-expressies niet nodig.

## Subset van [[OM&S]]

De specificatie gebruikt een subset van de [[OM&S]] standaard.

De standaard zelf is zeer uitgebreid en flexibel, maar daardoor ook complex en door verschillende uitbreidingen en interpretaties, moeilijk uitwisselbaar.

Door gebruik te maken van een subset en profielen, wordt de complexiteit verminderd en wordt interoperabiliteit vergroot.
In V4 zijn er kleine uitbreidingen aan de subset van OM&S. Zo is result/measure uitgebreid met nameSpace en limitSymbol.
Namespace is erbij gekomen, omdat een aantal eenheden domein-specifiek zijn. LimitSymbol is erbij gekomen, omdat dit een veelgebruikte eigenschap is o.a. voor laboratoriummetingen.

Omdat DD API primair een uitwisselprotocol is, en meetinformatie kan wijzigen, is het belangrijk om te communiceren dat een meting veranderd is.
Daarom is modifiedOn van metadata verhuisd naar observation-niveau zelf, dus ook een uitbreiding.

[[OM&S]] staat deze uitbreidingen toe, maar ons doel is het om het model zo minimalistisch mogelijk te houden.

## Subset van [[OData]] V4

De specificatie beschrijft een standaard subset van [[OData]] die gebruikt moet worden, met een aantal uitbreidingen specifiek voor waterdata in Nederland.

Deze subset is gekozen om de implementatie eenvoudiger te maken en om ruimte voor interpretatieverschillen tussen verschillende implementaties te verminderen.

Voor meer details, zie [OData subset](07-odata-subset).

## Semantische Uitwisselbaarheid

Semantische uitwisselbaarheid is cruciaal voor het uitwisselen van data tussen verschillende systemen. 

Omdat DD API V4 zich primair richt op het waterdomein, 
ligt het voor de hand om de [[Aquo]]-definities te gebruiken voor het beschrijven van de data.

[[Aquo]] is een initiatief van verschillende Nederlandse waterbeheerders 
en biedt een gestandaardiseerde set van vocabularia voor het waterdomein.

V4 gaat hierin verder door in de responses óók het gerefereerde semantische vocabulaire toe te voegen, zodat het mogelijk wordt om een andere semantische context toe te voegen.
Daardoor kan V4 ook buiten het waterdomein worden gebruikt.

