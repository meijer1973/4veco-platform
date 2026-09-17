# Oplevering — R1–R5 verwerkt in het v3-pakket

**16 september 2026 · `book34-v3-r1-r5-20260916`**

Het pakketherstel is uitgevoerd. Deze levering vervangt het vorige v3-ZIP. De lokale coding agent krijgt via [HANDOFF.md](HANDOFF.md) één complete integratieopdracht, inclusief de expliciete technische v2→v3-overgang. Geen extra losse instructie is nodig.

| Punt | Afhandeling |
|---|---|
| R1 | Vijf zichtbare antwoordfiguurtitels aangepast; SVG/PNG/afhankelijke uitvoer en hashes vernieuwd; figuurnummerconcordantie getest. |
| R2 | Context blijft behouden binnen het opgave-element; alle 31 records en het gecombineerde bestand vernieuwd; HTML bewaart ook tabellen en figuren. |
| R3 | Canonieke `source_ref`, uniforme v3-registerrevisie en expliciete bronlocators in het registerhulpmiddel. Werkelijke repositorymigratie, metadata/lookup/checks en CI zijn volledig opgenomen als integratietaak. |
| R4 | Actuele tekst-I/O expliciet UTF-8; bouwomgeving, fontidentiteiten en Windows-route vastgelegd; geen Windows-buildclaim. |
| R5 | Bronbestanden versus gegenereerd voorwerk vastgelegd; de assembler schrijft bewerkbaar `back.md` niet meer terug. |

## Behoud en controle

De 31 leerlingmanuscripten, zes antwoordbronnen, zes docentbronnen en twee gedrukte achterwerkbronnen zijn bytegelijk aan de ontvangen v3-versie. De gekozen 14/17-structuur, vragen, antwoorden, pagina-aantallen en covers blijven behouden. Alleen de vijf figuurtitels en hun rasters veranderen binnen de hoofdstukassets; de geometrie blijft gelijk.

**Geslaagd:** 598 bestaande editiecontroles, 99 geselecteerde rekencontroles, 320 gerichte herstelcontroles en 24 regressietests. Een schone herbouw leverde dezelfde tekst en pixels voor alle 490 pagina’s van de zes complete volumes, in dezelfde vastgelegde omgeving. Alle 32 recordbestanden zijn ook bytegelijk gereproduceerd. Visueel gecontroleerd: de vier betrokken antwoordpagina’s, met een tweede-renderercontrole van pagina 22.

Deze resultaten zijn geen volledige onafhankelijke inhoudsbeoordeling, geen native Windows-test en geen gekoppelde repository-CI. Het registerhulpmiddel is met schemafixtures en de 31 echte pakketkandidaten getest; de agent moet het tegen het dan actuele live register controleren.

De vijf bekende lestijdproblemen, latere cao-/vakbondsplaatsing en onafhankelijke targetgoedkeuring blijven afzonderlijke open punten. Integratie is nog niet uitgevoerd; merge/publicatie zijn niet geautoriseerd.

Details en bewijs: [herstelrapport](checks/REPAIR_REPORT.md), [bouwomgeving](BUILD_ENVIRONMENT.md), [migratieplan](integration/V3_MIGRATION.md).
