# **Virtuele** Datamodellen (FoI, Feature of Interest)

<aside class="advisement" title="Virtueel model">
De modellen in dit hoofdstuk zijn virtueel. 
Ze beschrijven uitsluitend de structuur van de data zoals deze door de API wordt uitgewisseld. 
Een implementatie hoeft deze structuur intern niet als opslagmodel te gebruiken; de aanbieder is vrij in de keuze van database-technologie en mapt de eigen bronnen on-the-fly naar dit virtuele model.
</aside>

Het eindpunt /v4/odata/foi bevatten de meetobjecten die de service kent.
Het model hiervoor is hieronder beschreven.

Vet is verplicht.

## Feature Of Interest

Verplichte eigenschappen zijn vetgedrukt. De rest is alleen nodig wanneer het onderliggende systeem die eigenschappen werkelijk gebruiken.

| Eigenschap             | Type                                                                     | Omschrijving                                |
|------------------------|--------------------------------------------------------------------------|---------------------------------------------|
| **id**                 | Edm.String                                                               | Id van de referentie.                       |
| **sourceOrganisation** | Edm.String                                                               | Afkorting van de bronhouder.                |
| sourceNamespace        | Edm.String                                                               | Namespace van de bronhouder.                |
| **code**               | Edm.String                                                               | Code van het geo-object.                    |
| **description**        | Edm.String                                                               | Omschrijving van het geo-object.            |
| geometry               | Edm.Geometry                                                             | Geometrie van het geo-object.               |  
| identities             | [SemanticPropertyBag("FoiIdentities")](06-00-semantic-property-bag)      | Identiteiten in andere systemen, optioneel. |   
| classifications        | [SemanticPropertyBag("FoiClassifications")](06-00-semantic-property-bag) | Classificaties, optioneel.                  |   

`type` moet de naam van de domeintabel zijn, afhankelijk van de taalschakelaar, Engels of Nederlands. 