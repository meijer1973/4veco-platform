# Herstelrapport integratiepakket Boeken 3–4 v3

**Datum:** 16 september 2026.  
**Levering:** `book34-v3-r1-r5-20260916`.  
**Curriculumrevisie:** `book34-lesson-balance-v3-20260915` (ongewijzigd).

## Uitkomst

De pakketgebonden fouten R1, R2 en R4 zijn hersteld, R5 is verduidelijkt en technisch begrensd, en R3 is zowel in het registerhulpmiddel als in de volledige integratieopdracht verwerkt. Het pakket kan als één zelfstandige levering naar de lokale coding agent. De daadwerkelijke repositorymigratie blijft zijn opdracht; dit rapport beweert niet dat de live repositories al naar v3 zijn omgezet.

De eerdere aanvullende herstelopdracht hoeft niet te worden meegestuurd. De actuele [HANDOFF.md](../HANDOFF.md) beschrijft de resterende integratie, niet een nieuwe opdracht om de reeds gerepareerde figuren/context nogmaals te herstellen.

## Ontvangst en scope

Ontvangen ZIP: `Boek_3_4_v3_Integratiepakket.zip`. SHA-256:

`fbb6c9702d7fbd57867d751a545f2e3205c045f65258e259537bf5ff7cd63516`

Alle **728 manifestbestanden** zijn vóór bewerking gecontroleerd; nul afwijkingen. Het ZIP bevatte daarnaast het manifest zelf. Het oorspronkelijke manifest en de oorspronkelijke bewijsbestanden zijn apart bewaard onder `provenance/`; zij zijn niet vernieuwd om gewijzigde bestanden als oorspronkelijk te presenteren. De aangeleverde review is daar eveneens opgenomen.

Geen curriculumherziening: de 14/17-verdeling, nieuwe §3.2.2/§3.2.3, verplaatste langetermijnles, handelsreparatie en uitgestelde cao-/vakbondsles blijven zoals aangeleverd. Geen Boek 1/2- of live repositorywijzigingen.

## R1 — zichtbare antwoordfiguurnummers

| Actuele paragraaf | SVG (bestaande bestandsnaam) | Oud → nieuw | Complete antwoorden Boek 4 |
|---|---|---:|---:|
| 4.1.2 | `4.1.1_ans_8.svg` | 8 → 18 | p. 10 |
| 4.1.3 | `4.1.2_ans_18.svg` | 18 → 28 | p. 15 |
| 4.1.4 | `4.1.3_ans_28.svg` | 28 → 38 | p. 22 |
| 4.1.4 | `4.1.3_ans_28_profit.svg` | 28 → 38 | p. 22 |
| 4.1.5 | `4.1.4_ans_35.svg` | 35 → 45 | p. 26 |

Alle vijf SVG-titels en de zichtbare tekst zijn aangepast. Bijbehorende PNGs behouden hun dimensies en zijn uit de huidige SVG opnieuw opgebouwd. Afhankelijke hoofdstuk-/boek-HTML/PDF en antwoordfiguur-/targethashes zijn vernieuwd.

Een nieuwe controle vergelijkt titelnummers met het **daadwerkelijke huidige targetrecord**, controleert de PNG tegen een nieuwe SVG-render en controleert de titel in de uiteindelijke antwoord-PDF. De negatieve regressietest verwerpt het oude nummer. Bronvergelijking bevestigt dat uitsluitend de titelteksten zijn veranderd; de grafische geometrie is gelijk gebleven. De vier pagina’s zijn visueel bekeken, pagina 22 ook met Poppler.

Bewijs: [figuurcontract](figure-label-contract.json), [gerichte controles](repair-verification.json), [visuele controle](VISUAL_REVIEW.md).

## R2 — context uit de echte opgave behouden

`build/records.py` verwijdert niet langer de gehele `.exercise`-container. Alleen de herkenbare deelvraagalinea’s worden uitgesloten. Inleiding, numerieke voorwaarden, tabellen, formules, tijdseenheden en overige broninformatie binnen die container blijven behouden. Ook de oorspronkelijke onvolledig gesloten alinea met geneste tabel/vragen in §4.3.1 is als expliciet regressiegeval afgedekt; de tabel wordt niet weggelaten om die structuur te ontwijken.

Alle 31 individuele doelrecords, het gecombineerde doelbestand, de targetcatalogus en bronuittreksels zijn opnieuw gemaakt. `context` is bruikbare platte tekst met tabelrijgrenzen. `context_html` bewaart de bronstructuur en figuren. De veldbasis is expliciet `package_root`; alle 26 bronfiguurverwijzingen zijn aan echte meegeleverde bestanden en hashes gekoppeld. De volledige oorspronkelijke bron blijft daarnaast in `sources[0].content` beschikbaar.

De controlerende weergave [target-consumer-preview.html](target-consumer-preview.html) gebruikt alleen **JSON-context, deelvragen en geregistreerde figuren**. Zij leest niet stilzwijgend de manuscripten terug. Tests verwerpen ontbrekende en onjuist gehashte figuren. De echte repository-afnemer moet na integratie eveneens aantoonbaar alle noodzakelijke velden gebruiken; die verplichting staat in de handoff.

De formule `TK = 0,04q² + 4q + 400`, de capaciteit en eenheden van §3.2.2 staan nu in `context`. Bij §4.3.2 staan alle populatiecijfers en beide arbeidsmarktfuncties er ook. Alle records zijn op behouden context, tabellen, bronfiguren, vraagscheiding en nieuwe payloadhash gecontroleerd.

Bewijs: [afnemercontrole](target-consumer-check.json), [regressietestlog](repair-unit-tests.log), [recordherbouw](record-rebuild-comparison.json).

## R3 — consistente kandidaatvoorbereiding en expliciete integratie

De 31 records gebruiken canonieke `source_ref`-verwijzingen naar `references/owned/course-blueprint-v5.md §X.Y.Z`. Concrete manuscript-/antwoordpaden en hashes blijven afzonderlijk beschikbaar in `source_pin`. De outlineverwijzing is canoniek; de lokale outlinebron is apart benoemd.

Het verbeterde `prepare_registry_update.py` synchroniseert topniveau en alle nieuwe records naar de v3-revisie, controleert de exacte 12/12/14/17-verdeling en vereist een expliciete repositoryrelatieve lessons-pakketroot. Het voegt concrete bronlocators toe zonder de targetinhoud of portable assetpaden te veranderen. Het schrijft uitsluitend een **nieuw** kandidaatbestand, nooit over de invoer. Onbekende revisies, ontbrekende/duplicerende records, onveilige paden, niet-canonieke refs, lege placeholders en ongefundeerde eindgoedkeuring worden geweigerd.

Behoud van alle 24 Boeken 1–2-records is getest met schemafixtures plus de 31 echte pakketkandidaten. Dit is **geen proef met het volledige huidige live register**; die controle moet de lokale agent uitvoeren tegen zijn vastgelegde basiscommit. De 31 records blijven `candidate_review_ready`, met reviewplicht vóór finaliteit.

[integration/V3_MIGRATION.md](../integration/V3_MIGRATION.md) benoemt de vier concrete v2-gebonden repositoryonderdelen en de noodzakelijke v3-route, lookup, metadata, blueprintprojecties, bronlocators, actuele controles en gekoppelde CI. De historische v2-migratie en bewijzen blijven bewaard. Er is geen blanket-vrijstelling voor editiemappen of verwijdering van tests gevraagd.

## R4 — expliciete UTF-8 en reproduceerbare omgeving

Alle actuele tekst-I/O in bouw-, export-, integratiehulp- en verificatiescripts noemt de codering expliciet. Schrijfacties gebruiken passende newline-afhandeling. Document-/beeld-API’s zoals `fitz.open` en `Image.open` zijn geen tekst-I/O en ontvangen geen foutieve encodingparameters.

[BUILD_ENVIRONMENT.md](../BUILD_ENVIRONMENT.md), het [omgevingsoverzicht](render-environment.json) en `requirements-render-lock.txt` leggen de werkende Python-/render-/native-libraryversies en de werkelijk gebruikte fontidentiteiten vast. Er worden **geen fontbestanden** meegeleverd.

De recordexport en 24 regressietests zijn bovendien uitgevoerd onder een C/ASCII-locale met `PYTHONUTF8=0`. Alle 32 recordbestanden bleven bytegelijk. Dit toetst afhankelijkheid van impliciete tekstcodering; het is **geen native Windows-build**. De Windows-/PowerShellroute en native afhankelijkheden zijn gedocumenteerd voor de lokale agent.

Bewijs: [UTF-8-inventaris](utf8-repairs.json), [encodingtest](encoding-smoke.json).

## R5 — bewerkbare bron tegenover gegenereerd voorwerk

[SOURCE_OWNERSHIP.md](../SOURCE_OWNERSHIP.md) benoemt de juiste wijzigingsplaats. De boekbestanden `front.md` en `print.css` worden vanuit `assemble.py` en hoofdstukstijl gegenereerd; handmatige wijzigingen horen daar niet. De inhoudsopgave blijft automatisch. Het werkelijk bewerkbare `back.md` wordt niet meer teruggeschreven door de assembler; een eventuele opmaakomsluiting ontstaat alleen in het geheugen. Geen nieuw algemeen bouwsysteem is ingevoerd.

## Uitgevoerde controles

| Controle | Resultaat / begrenzing |
|---|---|
| Ontvangen manifest | 728 bestanden; 0 afwijkingen vóór bewerking. |
| Oorspronkelijke editiecontrole | 598 controles; 0 fouten; 276 opgaven, 734 vragen en 734 antwoordlabels. |
| Geselecteerde rekencontroles | 99 geslaagd; geen claim dat alle 734 antwoorden onafhankelijk zijn herberekend. |
| Gerichte herstelcontroles | 320 geslaagd; figuur-/context-/hash-/bron-/UTF-8-controles. |
| Nieuwe regressietests | 24 geslaagd, inclusief negatieve foutgevallen. |
| Schone volledige herbouw | Alle hoofdstukken, boeken, 31 paragraaf-PDFs, records en drie outline-PDFs gebouwd; controles opnieuw geslaagd. |
| Zes complete volumes | Alle 490 pagina’s: gelijke tekst, paginatallen en RGB-pixels bij 79,2 dpi in PyMuPDF, binnen dezelfde vastgelegde omgeving. |
| Recordherbouw | Alle 32 JSON-bestanden bytegelijk. |
| Ontvangen versus herstelde complete PDFs | Alle paginatallen gelijk. Tekst verandert alleen op antwoordpagina’s 10, 15, 22 en 26 van Boek 4, door de vijf juiste titels. |
| Bewerkbare boekinhoud | 31 manuscripten + 6 antwoordbronnen + 6 docentbronnen + 2 achterwerkbronnen = 45 bestanden bytegelijk. |
| Figuren en covers | 439 hoofdstukassets; 429 bytegelijk, 10 gewijzigde titel-SVG/PNG-bestanden. Beide covers rastergelijk. |
| Visuele controle | De vier gewijzigde antwoordpagina’s bekeken; pagina 22 ook met Poppler. Geen nieuwe paginering of overlap vastgesteld. |

Bewijs: [schone bouwlog](clean-build.log), [alle paginavergelijkingen](rebuild-comparison.json), [tekstverschillen vóór/na](received-to-repaired-pdf-text.json), [bronbehoud](source-preservation.json).

De nieuwe aflevering krijgt een eigen manifest. Het oude ontvangstmanifest blijft ongewijzigd. Het eindmanifest controleert de verstrekte bytes; een herbouw vernieuwt het niet automatisch.

## Wat nog bij integratie of vervolgbesluiten hoort

De agent voert de werkelijke v3-migratie, actuele schema-/afnemerchecks, navigatie en CI op de voorgestelde platform/lessons-combinatie uit. Dat is normale repository-integratie, geen nog open pakketgebonden R1/R2-herstelopdracht. Onafhankelijke targetgoedkeuring is niet door deze auteurstest vervangen. Merge, deploy en publicatie zijn niet geautoriseerd.

De bekende lestijdproblemen **§§3.1.2, 3.1.3, 3.1.5, 4.2.4 en 4.2.5** blijven open. Voor de uitgestelde cao-/vakbondsdoelen ontbreekt nog een concrete latere plaatsing met tijd. Deze punten mogen niet verdwijnen achter een status “integratie afgerond”. Ze worden niet uitgebreid of opgelost door deze beperkte reparatie.

Dit rapport is geen volledige nieuwe inhoudsreview, geen visuele controle op ware grootte van alle 490 pagina’s, geen native Windows-build en geen uitvoering van de volledige gekoppelde repository-CI. De beperkingen zijn onderdeel van de oplevering, niet verborgen uitzonderingen.
