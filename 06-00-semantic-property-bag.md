# SemanticPropertyBag

Een `SemanticPropertyBag(group)` is een semantisch begrensde verzameling eigenschappen binnen het virtuele uitwisselingsmodel.

De exacte eigenschappen die binnen een `SemanticPropertyBag` mogen voorkomen, worden niet volledig in deze specificatie opgesomd, maar zijn normatief begrensd door de actieve semantiekset. De parameter `group` bepaalt welke groep in de semantiekset van toepassing is.

De waarde van `group` verwijst naar de kolom `group` in `semantics.csv`. Alle semantische attributen binnen de actieve semantiekset met dezelfde `group` vormen samen de toegestane eigenschappen van de betreffende `SemanticPropertyBag`.

Een `SemanticPropertyBag(group)` wordt in implementatie-specifieke CSDL en OpenAPI uitgewerkt als een concreet container-type. De eigenschappen van dat container-type worden bepaald door de semantische attributen in de opgegeven groep. De algemene DD API-specificatie beschrijft de container op hoofdlijnen; de actieve semantiekset bepaalt de concrete eigenschappen.

Voor een `SemanticPropertyBag(group)` geldt:

- Alleen eigenschappen uit de actieve semantiekset zijn toegestaan.
- Alleen semantische keys in de opgegeven `group` zijn van toepassing.
- Iedere toegestane eigenschap wordt als concrete property opgenomen in de CSDL en OpenAPI-specificatie van de implementatie.
- Het datatype van iedere eigenschap wordt bepaald door de actieve semantiekset.
- Profielen en rules kunnen bepalen of een eigenschap verplicht, optioneel, toegestaan of verboden is.
- Eigenschappen die niet voorkomen in de actieve semantiekset, of niet passen bij de opgegeven `group`, zijn niet toegestaan.
- De algemene API-specificatie hoeft niet te worden aangepast wanneer een semantiekset wordt uitgebreid met nieuwe eigenschappen; de implementatiespecifieke CSDL en OpenAPI-specificatie kunnen wel wijzigen.

### Extensie-gebonden semantische eigenschappen

De kolom `extensions` in `semantics.csv` kan worden gebruikt om een semantische eigenschap te beperken tot 
één of meer optionele extensies.

Wanneer `extensions` leeg is, behoort de eigenschap tot de basis-semantiek van de definitie-set en kan zij 
worden gebruikt zonder aanvullende extensie, mits de eigenschap ook door de toepasselijke profiles en rules is toegestaan.

Wanneer `extensions` gevuld is, MAG de eigenschap alleen worden gebruikt wanneer de implementatie de 
genoemde extensie expliciet ondersteunt en declareert.

Niet iedere extensie hoeft in `semantics.csv` voor te komen. Alleen extensies die invloed hebben op de 
toegestane semantische eigenschappen hoeven via de kolom `extensions` te worden gekoppeld aan semantische eigenschappen.

Wanneer meerdere extensies worden opgenomen, worden deze als komma-gescheiden lijst geschreven. 
In dat geval geldt dat de eigenschap mag worden gebruikt wanneer ten minste één van de genoemde extensies actief is.