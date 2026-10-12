# Gebruiksscenario's (Informatief)

Onderstaande scenario's laten zien hoe de DD API V3 direct waarde levert voor de dagelijkse praktijk van waterprofessionals.

## Scenario: De Hydroloog (Real-time monitoring)
*   **Vraag**: "Ik wil een dashboard bouwen dat de actuele waterstand toont van alle meetpunten rondom Amsterdam, ongeacht wie de beheerder is."
*   **De DD API-oplossing**: Dankzij de verplichte koppeling met **[[Aquo]]** kan de hydroloog blind varen op de code `WATHTE`. De API levert via de OData-interface direct de gewenste data.
*   **Technisch (V4.0)**: Hij bevraagt `/v4/odata/observations` met `$filter=Parameter/Quantity eq 'WATHTE'`. De server levert de data in CoverageJSON (tijdreeks), wat direct in grafieken kan worden getoond.

## Scenario: De Data-analist (Integrale rapportages)
*   **Vraag**: "Ik moet KRW-rapportages maken waarbij ik lab-gehaltes correleer met debietgegevens van stuwen."
*   **De DD API-oplossing**: Door de **virtuele datamodellen** zien lab-data en sensor-data er qua metadata exact hetzelfde uit. De analist kan beide bronnen via hetzelfde protocol benaderen.
*   **Technisch (V4.0)**: In **Microsoft Excel** (via OData) combineert hij queries. De `modifiedOn` metadata wordt gebruikt om alleen de meest recent gevalideerde resultaten mee te nemen.

## Scenario: De Data-analist (Engelse termen zijn lastig)
*   **Vraag**: "Nederlandse termen zijn eenvoudiger te begrijpen."
*   **De DD API-oplossing**: Geef als extra parameter aan de URL door: &lang=nl. Engelse termen in Parameter en Metadata worden omgezet naar de Nederlandse vertalingen.
*   **Technisch (V4.0)**: De semantische woordenboeken van DD API kunnen gebruikt worden voor de vertalingen.

## Scenario: Slim Watermanagement (Operationele sturing)
*   **Vraag**: "Hoe kunnen we sneller reageren op dreigende wateroverlast door data van verschillende beheerders te combineren?"
*   **De DD API-oplossing**: De API biedt een uniforme 'taal' voor alle beheerders. In crisissituaties kunnen kritieke drempelwaarden direct worden bewaakt via de API.
*   **Technisch (V4.0)**: Het SWM-dashboard bevraagt de API met filters op kritieke drempels (`Result/Value gt [DREMPEL]`). De **V3.1 extensies** (zoals `pubsub` en `searchprofiles`) kunnen dit proces in de toekomst verder automatiseren, maar de benodigde data is nu al via V3.0 beschikbaar. Zoekprofielen kunnen ook dienen om de DD API installatie te optimaliseren.

## Scenario: Het Laboratorium (Ketenautomatisering)
*   **Vraag**: "Hoe kunnen wij resultaten van duizenden analyses efficiënt overdragen aan waterbeheerders?"
*   **De DD API-oplossing**: Het lab ontsluit data via de DD API V3 interface op hun eigen LIMS. De waterbeheerder 'oogst' de data op het moment dat het hen uitkomt.
*   **Technisch (V4.0)**: De waterbeheerder gebruikt een script dat dagelijks nieuwe records ophaalt via `$filter=ResultTime ge [DATUM]`. Het **ECO-profiel** zorgt dat complexe biologische kenmerken gestandaardiseerd worden overgedragen.

## Scenario: Informatiehuis Water (Centrale kwaliteitsborging)
*   **Vraag**: "Hoe kan IHW de data verzamelen van alle beheerders voor controles in de Aquo-Kit?"
*   **De DD API-oplossing**: De Aquo-Kit kan als 'smart consumer' zelf de data ophalen bij de bronhouders via een gestandaardiseerde interface.
*   **Technisch (V4.0)**: De Aquo-Kit bevraagt de `/v3/odata/observations` endpoints van de diverse beheerders. De data wordt direct getoetst aan de centrale Aquo-definities.

## Scenario: De GIS-specialist (Ruimtelijke analyse)
*   **Vraag**: "Ik wil meetlocaties direct visualiseren in QGIS."
*   **De DD API-oplossing**: QGIS kan live verbinding maken met het OData-protocol van de DD API.
*   **Technisch (V4.0)**: De specialist voegt een vectorlaag toe op basis van `/v4/odata/geo`. De geografische informatie (`Geography` in `Foi`) wordt direct op de kaart getoond.

## Scenario: De Modellenbouwer (Integratie met Delft-FEWS)
*   **Vraag**: "Ik wil live sensordata inlezen in Delft-FEWS voor hoogwatervoorspellingen."
*   **De DD API-oplossing**: Delft-FEWS kan via de OData-client direct data ophalen bij conforme sensorplatformen.
*   **Technisch (V3.0)**: Delft-FEWS bevraagt de `/v4/odata/observations` endpoints en gaat uit van het **CoverageJSON** formaat. De Aquo domeintabel **'Waarnemingssoort'** zorgt voor de juiste interpretatie van de aard van de tijdreeks.

## Scenario: De Data Scientist (AI en Trends)
*   **Vraag**: "Ik wil een model trainen om trends te voorspellen."
*   **De DD API-oplossing**: De API levert machine-readable data. De tijd die normaal naar 'data wrangling' gaat, wordt geminimaliseerd door de uniforme structuur.
*   **Technisch (V4.0)**: De scientist laadt data rechtstreeks in Python (Pandas) dataframe. Hoewel **V3.1** (Resultaatprofielen) dit kan vereenvoudigen, biedt de huidige V3.0 structuur al alle noodzakelijke trainingsdata. 
