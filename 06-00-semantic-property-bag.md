# SemanticPropertyBag

Een `SemanticPropertyBag(group)` is een semantisch begrensde verzameling eigenschappen binnen het virtuele uitwisselingsmodel.

De exacte eigenschappen die binnen een `SemanticPropertyBag` mogen voorkomen, worden niet volledig in deze specificatie opgesomd, maar zijn normatief begrensd door de actieve semantiekset. De parameter `group` bepaalt welke groep in de semantiekset van toepassing is.

De waarde van `group` verwijst naar de kolom `group` in `semantics.csv`. Alle semantische attributen binnen de actieve semantiekset met dezelfde `group` vormen samen de toegestane eigenschappen van de betreffende `SemanticPropertyBag`.

Een `SemanticPropertyBag(group)` wordt in implementatiespecifieke CSDL en OpenAPI uitgewerkt als een concreet container-type. De eigenschappen van dat container-type worden bepaald door de semantische attributen in de opgegeven groep. De algemene DD API-specificatie beschrijft de container op hoofdlijnen; de actieve semantiekset bepaalt de concrete eigenschappen.

Voor een `SemanticPropertyBag(group)` geldt:

- Alleen eigenschappen uit de actieve semantiekset zijn toegestaan.
- Alleen semantische keys in de opgegeven `group` zijn van toepassing.
- Iedere toegestane eigenschap wordt als concrete property opgenomen in de CSDL en OpenAPI-specificatie van de implementatie.
- Het datatype van iedere eigenschap wordt bepaald door de actieve semantiekset.
- Profielen en rules kunnen bepalen of een eigenschap verplicht, optioneel, toegestaan of verboden is.
- Eigenschappen die niet voorkomen in de actieve semantiekset, of niet passen bij de opgegeven `group`, zijn niet toegestaan.
- De algemene API-specificatie hoeft niet te worden aangepast wanneer een semantiekset wordt uitgebreid met nieuwe eigenschappen; de implementatiespecifieke CSDL en OpenAPI-specificatie kunnen wel wijzigen.
