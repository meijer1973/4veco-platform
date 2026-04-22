# QC prompt — foundation audit (bottom-up)

**Test ID:** foundation-audit
**Subagent role:** VWO economie docent (10+ jaar ervaring) die onderbouw-curriculum, tweedegraadse voorkennis en VWO 4-instapniveau kent.
**Catches:** Units mis-marked as L0 foundation (layer 0 with empty `needs`) that actually assume prereq concepts VWO 4 students do NOT bring from the onderbouw. The inverse of `tree-integrity-audit`: bottom-up rather than top-down.

This test was added after H15 ("Nominale rente op staatsobligaties verklaren") was found sitting at L0 with no prereqs, while its kern silently assumed three different advanced concepts (obligatiemarkt-mechaniek, inverse koers-yield, risicoperceptie). The skill-tree viewer made the bug visible; this test catches the same class systematically.

---

## Prompt (verbatim — runner pastes this into the Agent call, with `<UNIT-DUMPS>` and `<OUTPUT-PATH>` substituted)

Je bent een VWO economie docent met 10+ jaar ervaring. Je kent de onderbouw-economie in Nederland (HAVO/VWO 2-3 curriculum) en weet exact wat een gemiddelde VWO 4-leerling bij binnenkomst meebrengt aan economische kennis: basis vraag/aanbod op goederenmarkten, schaarste, keuzes, eenvoudige prijs-hoeveelheid-intuïtie. Géén financiële instrumenten, géén macro-variabelen, géén marktfalen-theorie, géén welvaartsanalyse.

**Jouw taak:** beoordeel 5 aangereikte catalogus-units die momenteel op **layer 0** staan (de absolute basis van de skill-tree). Bepaal per unit of die L0-positionering klopt.

**Layer-semantiek waar je tegen toetst:**
- **layer 0 betekent**: leerling brengt deze kennis zelf mee; geen enkele andere catalogus-unit hoeft vooraf te zijn behandeld. De unit is zelfstandig begrijpelijk op het eerste moment van VWO 4.
- Als een unit impliciet concept X of Y veronderstelt die een VWO 4-leerling *niet* meeneemt van onderbouw, dan is L0 onjuist en ontbreekt er een voorwaarde in de catalogus.

Je ontvangt per unit het volledige tekstblok (id, name, kern, mastery_target, exam_codes, aspects, terms, eventuele procedure en pitfalls). Je ontvangt **geen toegang tot andere catalogus-units of de syllabus** — gebruik je eigen didactische kennis.

**Voor elke unit beoordeel je:**

1. **Layer-verdict**:
   - **GREEN** — terecht L0: VWO 4-leerling brengt dit echt mee (onderbouw of algemene kennis), of de kern is volledig zelfstandig begrijpelijk zonder impliciete aannames.
   - **YELLOW** — grensgeval: sommige leerlingen brengen het mee, anderen niet; afhankelijk van school/onderbouw-docent. De les kan zonder prereq, maar het wringt.
   - **RED** — ten onrechte L0: de kern veronderstelt concept(en) die een VWO 4-leerling *niet* standaard meebrengt. Er ontbreekt een prereq-unit in de catalogus.

2. **Bij YELLOW of RED: welk ontbrekend concept**? Benoem in één zin welke voorkennis de kern stilzwijgend veronderstelt. Geef ook een voorstel-titel voor een eventueel te minten prereq-unit (bijv. "Obligatie als verhandelbaar schuldpapier").

3. **Kern-zelfcontainment**: kan een docent deze kern in 15–20 minuten uitleggen zonder eerst iets anders erbij te halen? (Ja/Nee/Deels.)

**Belangrijk:**
- Wees streng op RED. Het is ernstiger als we een unit ten onrechte L0 laten (leerlingen vallen uit) dan als we een YELLOW als RED markeren (gewoon extra scaffolding).
- Onderbouw-kennis die je wél mag veronderstellen: basis vraag/aanbod op goederenmarkt (S/V-curves, evenwicht), schaarste, keuze, geld/prijs-intuïtie, eenvoudige percentages, grafieken lezen.
- Onderbouw-kennis die je **niet** mag veronderstellen: elasticiteit, welvaartssurplus, marktvormen, externe effecten, marktfalen, macro-variabelen (bbp/rente/wisselkoers/inflatie), financiële instrumenten (obligaties/aandelen), verzekeringsconcepten, speltheorie.

**Units te beoordelen:**
<UNIT-DUMPS>

**Outputformat:** schrijf naar `<OUTPUT-PATH>`. Gebruik deze Markdown-structuur, één sectie per unit:

```markdown
## <unit-id> — <unit-name>

- **Layer-verdict:** GREEN / YELLOW / RED
- **Toelichting:** <1–2 zinnen waarom, met expliciete verwijzing naar wat een VWO 4-leerling wel/niet meeneemt>
- **Ontbrekende voorkennis (YELLOW/RED):** <concept(en), of "N/A" bij GREEN>
- **Mint-voorstel (RED):** <voorgestelde unit-titel, of "N/A">
- **Kern-zelfcontainment:** Ja / Nee / Deels — <korte reden>
- **Confidence:** high / medium / low
```

Sluit af met een `## Samenvatting` sectie met de telling per verdict (bijv. "2 GREEN, 2 YELLOW, 1 RED") en een korte lijst van alle RED units met hun mint-voorstel.

Rapporteer terug in minder dan 60 woorden: hoeveel units beoordeeld, hoeveel RED/YELLOW/GREEN, en het test-ID `foundation-audit`.

---

## Runner notes

- Sampling strategie: kies 5 L0-units (`layer: 0` en `needs: []` en `deprecated !== true`) uit `references/machine/micro-teaching-units.json`.
  - **3 "high-risk" slots**: sorteer L0-units op aantal directe dependents (fan-out). Bij hoge fan-out is een foundation-fout duur, want alle dependents erven het gat. Kies 3 uit de top-decile.
  - **2 "random" slots**: uniform-random uit de overige L0-units, om blinde vlekken te vermijden en over tijd alle L0-units te dekken.
  - Als de prior-run hetzelfde unit-ID aansprak, geef die een lagere weight (niet 0, niet uitsluiten — herhaling over tijd is nuttig).
- Vul `<UNIT-DUMPS>` met geformatteerde tekstblokken voor de 5 gekozen units (zelfde format als tree-integrity-audit).
- Substitueer `<OUTPUT-PATH>`.

## What good looks like

- 5 units audited, verdict-verdeling varieert per run. Gezond patroon: meerderheid GREEN, af en toe YELLOW, RED als echte uitzondering.
- Wanneer RED: agent benoemt concreet welk concept ontbreekt en een plausibele mint-titel die past in het catalogus-naamgevingspatroon.

## Failure signals

- ≥2 RED in één run → herziening van de layer-conventie nodig, of er is een systematische extractie-fout. Loop de recente mints na.
- Herhaald YELLOW op dezelfde unit over meerdere runs → promoveer tot RED bij volgende review, of accepteer expliciet en documenteer in `skills/manage-references.md`.
- Low-confidence verdicts → prompt herzien, misschien extra context geven (bijv. voorbeelden van onderbouw-curriculum).

## Related tests

- **Complement to `tree-integrity-audit`**: dat is top-down per unit; dit is bottom-up per layer. Samen dekken ze "wiring binnen een unit" én "wiring aan de onderkant van de boom".
- **Future**: een middle-layer-audit test dat L2–L4 units pressure-test op of hun layer klopt gegeven de needs-diepte. Nog niet geïmplementeerd.
