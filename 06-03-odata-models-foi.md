# **Virtuele** Datamodellen (FoI, Feature of Interest)

<aside class="advisement" title="Virtueel model">
De modellen in dit hoofdstuk zijn virtueel. 
Ze beschrijven uitsluitend de structuur van de data zoals deze door de API wordt uitgewisseld. 
Een implementatie hoeft deze structuur intern niet als opslagmodel te gebruiken; de aanbieder is vrij in de keuze van database-technologie en mapt de eigen bronnen on-the-fly naar dit virtuele model.
</aside>

Het eindpunt /v4/odata/foi bevat de meetobjecten die de service kent.
Het model hiervoor is hieronder beschreven.

Vet is verplicht.

## Feature Of Interest

Verplichte eigenschappen zijn vetgedrukt. De rest is alleen nodig wanneer het onderliggende systeem die eigenschappen werkelijk gebruikt.

| Eigenschap       | Type                                                                              | Omschrijving                                |
|------------------|-----------------------------------------------------------------------------------|---------------------------------------------|
| **id**           | Edm.String                                                                        | Id van de referentie.                       |
| **organisation** | Edm.String                                                                        | Afkorting van de bronhouder.                |
| namespace        | Edm.String                                                                        | Namespace van de bronhouder.                |
| **code**         | Edm.String                                                                        | Code van het geo-object.                    |
| **description**  | Edm.String                                                                        | Omschrijving van het geo-object.            |
| **geometry**     | Edm.Geometry                                                                      | Geometrie van het geo-object.               |  
| identities       | [SemanticPropertyBag("foiIdentitiesForFoi")](06-00-semantic-property-bag.md)      | Identiteiten in andere systemen, optioneel. |   
| classifications  | [SemanticPropertyBag("foiClassificationsForFoi")](06-00-semantic-property-bag.md) | Classificaties, optioneel.                  |   
| networks         | Collection(Edm.String)                                                            | Netwerken waar het meetobject bij hoort.    |
