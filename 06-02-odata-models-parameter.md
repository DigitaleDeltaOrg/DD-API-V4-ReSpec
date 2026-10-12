# **Virtuele** Datamodellen (Parameter)

<aside class="advisement" title="Virtueel model">
De modellen in dit hoofdstuk zijn virtueel. 
Ze beschrijven uitsluitend de structuur van de data zoals deze door de API wordt uitgewisseld. 
Een implementatie hoeft deze structuur intern niet als opslagmodel te gebruiken; de aanbieder is vrij in de keuze van database-technologie en mapt de eigen bronnen on-the-fly naar dit virtuele model.
</aside>

Het eindpunt /v4/odata/parameters beschrijven alle entiteiten die de service kent en die gebruikt kunnen worden in het V4 observation parameter blok.
Deze beschrijven in wezen domeintabellen/domeinwaarden.
Het model hiervoor is hieronder beschreven.

Vet is verplicht.

## Parameter

Verplichte eigenschappen zijn vetgedrukt. De rest is alleen nodig wanneer het onderliggende systeem die eigenschappen werkelijk gebruiken.

| Eigenschap             | Type                                                                   | Omschrijving                                                                    |
|------------------------|------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| **id**                 | Edm.String                                                             | Id van de referentie.                                                           |
| **type**               | Edm.String                                                             | Soort referentie. Gebruik de naam van de domeintabel volgens de taalschakelaar. |
| **sourceOrganisation** | Edm.String                                                             | Afkorting van de bronhouder.                                                    |
| sourceNamespace        | Edm.String                                                             | Namespace van de bronhouder.                                                    |
| **code**               | Edm.String                                                             | Code van de entiteit (domeinwaarde).                                            |
| **description**        | Edm.String                                                             | Omschrijving van de entiteit (domeinwaarde).                                    |
| reference              | Edm.String                                                             | Referentie naar de definitie in het bronsysteem.                                |  
| details                | [SemanticPropertyBag("ParameterDetails")](06-00-semantic-property-bag) | Relevante details, optioneel.                                                   |   

`type` moet de naam van de domeintabel zijn, afhankelijk van de taalschakelaar, Engels of Nederlands. 