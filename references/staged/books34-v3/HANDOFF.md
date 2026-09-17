# Integratieopdracht — Boeken 3–4 v3, herstelde levering

**Levering:** `book34-v3-r1-r5-20260916`  
**Curriculumrevisie:** `book34-lesson-balance-v3-20260915`

## Opdracht

Integreer deze aangeleverde v3-editie en de aangenomen outlines in de twee repositories. Dit is het **vervangende pakket na herstel van R1–R5**. De aanvullende instructies uit de externe review zijn hierin verwerkt; de vijf figuurfouten en de onvolledige context-export zijn al gerepareerd. Gebruik niet daarnaast het oude ZIP-bestand of de vroegere herstelopdracht als actuele werkinstructie.

Behoud de leerstof, oefenvragen, antwoorden en gekozen indeling. Een brede inhoudsreview of herbouw vanaf nul is niet gevraagd. Alleen een werkelijk aangetroffen substantieel defect rechtvaardigt een gerichte reparatie met de noodzakelijke afhankelijke controle. Boeken 1–2 blijven ongewijzigd; publiceer Boek 1 tweede editie niet.

Deze opdracht verleent **geen merge-, deploy- of publicatiebevoegdheid**.

## Leesvolgorde

1. `README.md`: volledige levering en PDF-links.
2. Dit `HANDOFF.md` en **`integration/V3_MIGRATION.md`**: de concrete repositoryovergang, schema's, controles en afnemers.
3. `outlines/paragraph-migration-v2-to-v3.csv`, de aangenomen outlines en `curriculum/structure-v3.json` voor IDs en afbakening.
4. `SOURCE_OWNERSHIP.md` en `BUILD_ENVIRONMENT.md` wanneer je bouwt of technische paden aanpast.
5. `checks/REPAIR_REPORT.md`: uitgevoerde reparaties, bewijs en beperkingen.

## De aangenomen inhoud blijft vaststaan

Boek 3 telt **14 paragrafen: 6+4+4**; Boek 4 telt **17: 5+7+5**. Het jaartotaal blijft **12+12+14+17=55**.

- §3.2.2 behandelt de beperkte afgeleide; §3.2.3 de winstkeuze. Iedere les heeft een eigen doelopgave.
- Oud §3.2.3 langetermijnevenwicht staat als **nieuw §4.1.1** vóór monopolie. Hoofdstuk 4.1 heet **Van concurrentie naar monopolie**.
- Boek 3's gemengde concurrentieopgave vraagt geen langetermijnaanpassing. Handelsopgave 38b en de vooruitwijzing zijn aangepast.
- Oud §4.3.5 cao/vakbonden/overeenkomstbeleid is uitgesteld. **Nieuw §4.3.5 is de gemengde arbeidsmarktparagraaf**, zonder verborgen afhankelijkheid van de uitgestelde les.
- De hoofdstukplafonds blijven Boek 3 **50/40/40** en Boek 4 **50/60/50** leerlingpagina's. De levering gebruikt **48/34/38** en **48/60/44**; antwoorden staan apart.

Gebruik de revisie plus het ID als identiteit. Een gelijk nummer, bijvoorbeeld 3.2.3 of 4.3.5, bewijst geen gelijke les of overgenomen goedkeuring.

## Wat al is hersteld

R1: de vijf antwoordfiguren in hoofdstuk 4.1 hebben nu de juiste zichtbare doelnummers **18, 28, 38, 38 en 45**. SVG, PNG, afhankelijke HTML/PDF-uitvoer en doel-/assethashes zijn bijgewerkt. De betreffende pagina's van het complete antwoordenboek zijn **10, 15, 22 en 26**. Een gerichte concordantiecontrole is toegevoegd.

R2: de extractor verwijdert alleen deelvraagalinea's, niet meer het omringende opgave-element met de brongegevens. Alle 31 losse en gecombineerde records zijn opnieuw gemaakt. `context` bewaart de tekst, getallen en eenheden; `context_html` bewaart ook tabellen/figuren. De formule en capaciteit van 3.2.2 en de populatiegegevens/functies van 4.3.2 worden expliciet getest. Een controleweergave gebruikt alleen JSON, zonder manuscriptfallback.

R3, pakketkant: alle 31 `source_ref`-velden wijzen canoniek naar de v5-blueprint. Concrete manuscriptpaden staan apart in `source_pin`. Het verbeterde registerhulpmiddel synchroniseert ook de actieve registerrevisie en vraagt de definitieve lessons-pakketroot voor concrete locators. De **repositorycode** heeft nog de expliciete v3-migratie nodig; zie het meegeleverde migratieplan, niet een latere aanvullende opdracht.

R4: tekst-I/O is expliciet UTF-8. De gebruikte Python-/render-/fontomgeving, gepinde pakketten en Windows-instructies zijn vastgelegd. Een native Windows-build is niet geclaimd.

R5: de bron-/generatorverdeling is expliciet. `book-matter/front.md` en `book-matter/print.css` worden uit `build/assemble.py` gegenereerd en zijn geen plaats voor handmatige inhoudswijzigingen. `back.md` blijft bewerkbare bron en wordt niet meer door de assembler teruggeschreven.

## Uitvoering in de repositories

Fetch beide actuele repositories, lees de geldende AGENTS-instructies en leg de gebruikte basiscommits vast. Gebruik eigen gekoppelde werkbomen. Controleer de ongewijzigde ontvangst eerst met:

```text
python verify_manifest.py
```

De oude ontvangstidentiteit is apart bewaard in `provenance/`. Het oude manifest is herkomstbewijs, niet het manifest waarmee deze gerepareerde levering hoort te slagen.

Bewaar de bestaande v2-editie, hashes, migratie en reviewgeschiedenis. Importeer de uitgepakte levering in een expliciete nieuwe editiemap. Behoud waar mogelijk de relatieve pakketstructuur, zodat alle bronnen en bouwscripts direct werken. Maak de nieuwe editie via de Book 3/4-README's en actuele navigatie primair vindbaar; label v2 als historisch. Een opgeslagen ZIP zonder doorzoekbare bronnen is onvoldoende.

Voer vervolgens de afgebakende migratie in **`integration/V3_MIGRATION.md`** uit: actuele outlines/metadata, registermetadata, v5/v6-/lesprojecties, source locators, structurele lookup en import-/validatiecontrole moeten samen naar v3. De oude v2-controle mag niet worden verzwakt of als v3-goedkeuring worden voorgesteld. Gevulde kandidaten zijn niet langer lege placeholders, maar blijven **`candidate_review_ready`** zolang de vereiste onafhankelijke beoordeling ontbreekt.

Het hulpmiddel maakt alleen een nieuw registerkandidaatbestand en verandert nooit de invoer:

```text
python build/prepare_registry_update.py CURRENT_REGISTRY.json NEW_CANDIDATE.json --lesson-package-root edities/books34-v3
```

Vervang de voorbeeldroot door de werkelijke repositoryrelatieve bestemming. Controleer alle 24 Boeken 1–2-records op ongewijzigde inhoud. De uitvoer vervangt geen repositorymigratie, schemacontrole, broncontrole of doelgoedkeuring.

Controleer ook de **echte repository-afnemer** van `context`, `context_html`, `sources` en `figures`; enkel controleren dat JSON velden bevat is niet genoeg. Het pakket levert hiervoor een record-only controleweergave en tests, geen nieuwe companiontoepassing.

## Herbouw en verificatie

Gebruik de vastgelegde afhankelijkheden/fonts in `BUILD_ENVIRONMENT.md`. Werk in een kopie wanneer je de ontvangst wilt vergelijken met een schone herbouw:

```text
python -m unittest discover -s tests -v
python build/build_all.py
```

De bouw voert ook de oorspronkelijke 598 controles, 99 geselecteerde numerieke controles, de nieuwe gerichte pakketcontroles en de regressietests uit. Gebruik `build/compare_rebuild.py` voor de tekst-/pixelvergelijking van de zes complete volumes in dezelfde omgeving. De afleveringsmanifesten worden niet automatisch “goedgekeurd” of vernieuwd door een build.

Controleer na een technische herplaatsing bron-/asset-/doelidentiteiten, links, actuele PDF-pagina's en de vereiste CI op de **daadwerkelijke voorgestelde platform/lessons-combinatie**. Volg de bestaande gekoppelde compatibiliteitsprocedure indien die op deze wijziging van toepassing is. Geef geen blanket-uitzondering voor onbekende editiemappen.

## Open punten en eindrapportage

Behoud de vijf bekende lestijdproblemen **3.1.2, 3.1.3, 3.1.5, 4.2.4 en 4.2.5** als afzonderlijke open punten. De uitgestelde cao-/vakbondsdoelen hebben nog een concrete latere plaatsing mét tijd nodig. Een import lost die ontwerpvragen niet op. Andere lestijden zijn ontwerpschattingen, geen gemeten klassentijden.

Werk de roadmap bij: **v3 schrijven, lokale samenstelling en R1–R5-pakketherstel gereed; repository-integratie in deze PR totdat daadwerkelijk gemerged**. Houd onafhankelijke doelreview, resterende lestijdkeuzes, latere plaatsing en companion-/publicatiebesluiten apart. Het is geen opdracht om de al afgeleverde hoofdstukken opnieuw te schrijven.

Lever een korte eindrapportage met gewijzigde repositorypaden, bewezen behoud van Boeken 1–2/v2, bron- en leveringsidentiteiten, schema-/afnemer-/PDF-/CI-resultaten, echte PR-heads en resterende punten. Open de nodige PR(s) ter review. Geen merge zonder afzonderlijke toepasselijke eigenaarstoestemming.
