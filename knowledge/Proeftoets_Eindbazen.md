# Plan — module 3 Proeftoets "Eindbazen" (120 min)

## Context

Students have completed the full curriculum of module 3 and unlocked all 37 skills in the skill-tree game (`engines/skilltree/base-elements.js`). Layer 5 ("Eindbazen") holds the five hardest economics skills — each a capstone integration that only appears after the game's prerequisite skills have been mastered. No current proeftoets deliberately targets all five together in exam format.

This plan designs the module 3 cross-book practice test  so that:
- Each of the five Layer-5 skill-tree skills is tested at full exam difficulty.
- Lower-layer prerequisites appear as explicit warm-up questions — the test mirrors the skill-tree dependency graph.
- All question types and answer-model conventions follow the canonical consolidation / proeftoets specs (`references/authored/vraagtypen-en-opgaveontwerp.md`, `skills/econ-testprep-builder.md` Part 5).

Outcome: a 120-min, 4-opgave, ~32-point proeftoets that certifies a student can independently execute the hardest skills of the skill-tree under exam conditions, using real VWO question types.

## Scope summary (from user answers)

| Dimension | Choice |
|---|---|
| Placement | module 3 — end-of-year cross-book proeftoets |
| Skill breadth | Layer-5 core + explicit prereq warm-ups |
| Coverage | All 5 Eindbazen across 4 opgaven (E7+E8 share a monopolist context) |
| Duration | 120 minutes |

## Layer-5 skills to cover (from `engines/skilltree/base-elements.js`)

| ID | Skill | Prereqs | Core task |
|---|---|---|---|
| E4 | Welvaartsverlies belasting | S1, S5 | DWL = ½ × ΔQ × tax |
| E6 | Effecten invoerrecht | S1, S5, B1 | Tariff: binnenlandse Q, consumptie, import, overheidsopbrengst, welvaartsverlies |
| E7 | Max. winst monopolist | S2, S3, F4 | MO = MK → Q* → P* → W = TO − TK |
| E8 | Prijsdiscriminatie | S2, S3 | MO = MK per deelmarkt; som van deelwinsten |
| E9 | Lange-termijnevenwicht VM | S10 | MK = GTK; P = MK = GTK; economische winst = 0 |

## Test blueprint — 4 opgaven, ~18 sub-questions, 32 points

Each opgave follows the proeftoets progression (`econ-testprep-builder.md` §5.3): Q1 Begrijpen → Q_n Evalueren, ~80% 2p, source-referenced answer models. Question-type mix targets the seven VWO patterns (`vraagtypen-en-opgaveontwerp.md` §1.1).

### Opgave 1 — E4: Welvaartsverlies van accijns (8 p, ~30 min)
**Context:** ~200 woorden over accijnsverhoging op frisdrank. Overheid wil consumptie remmen.
**Bron:** lineaire Qv- en Qa-functies + graaf met beide lijnen.

| # | Type | Punten | Bloom | Skill |
|---|---|---|---|---|
| 1 | Is X een Y? Motiveer (specifieke belasting vs. ad valorem) | 2p | Begrijpen | Prereq S5 |
| 2 | Bereken oud evenwicht | 2p | Toepassen | Prereq S1 |
| 3 | Arceer consumenten- en producentenlast op figuur | 2p | Toepassen | Prereq + E4 |
| 4 | Bereken welvaartsverlies | 2p | Analyseren | **E4** |

### Opgave 2 — E6: EU-invoerrecht op staal (8 p, ~30 min)
**Context:** ~220 woorden over EU-tarief op geïmporteerd staal. Wereldprijs gegeven.
**Bron:** tabel met binnenlandse Qv, Qa bij drie prijzen; graaf met wereldprijs en tariefprijs ingetekend.

| # | Type | Punten | Bloom | Skill |
|---|---|---|---|---|
| 5 | Bereken omvang van de import zonder tarief | 2p | Toepassen | Prereq B1 |
| 6 | Bereken overheidsopbrengst uit tarief | 2p | Toepassen | **E6** |
| 7 | Arceer het welvaartsverlies in de figuur en bereken de grootte | 2p | Analyseren | **E6** |
| 8 | Beoordeel of een quotum hetzelfde welvaartsverlies oplevert (standpuntbepaling) | 2p | Evalueren | **E6** |

### Opgave 3 — E7 + E8: Monopolie waterbedrijf met prijsdiscriminatie (10 p, ~35 min)
**Context:** ~230 woorden: enig drinkwaterbedrijf in een regio dat apart kan prijzen voor huishoudens (vraaglijn 1) en bedrijven (vraaglijn 2). TK-functie gegeven.
**Bron:** twee vraagfuncties + TK-functie + graaf met beide MO-lijnen en één MK-lijn.

| # | Type | Punten | Bloom | Skill |
|---|---|---|---|---|
| 9 | Is dit een natuurlijk monopolie? Motiveer | 1p | Begrijpen | Prereq F4 |
| 10 | Bereken Q\* en P\* bij één uniforme prijs (ongedifferentieerd) | 3p | Toepassen | **E7** |
| 11 | Bereken Q₁, P₁, Q₂, P₂ en de totale winst onder prijsdiscriminatie | 4p | Analyseren | **E8** |
| 12 | Leg uit dat prijsdiscriminatie in dit geval de totale welvaart kan verhogen | 2p | Evalueren | **E8** |

### Opgave 4 — E9: Lange-termijnevenwicht melkveehouderij (6 p, ~25 min)
**Context:** ~180 woorden over toetreding in de biologische melksector; volledige mededinging verondersteld.
**Bron:** GTK- en MK-functie van een representatief bedrijf + marktvraaglijn.

| # | Type | Punten | Bloom | Skill |
|---|---|---|---|---|
| 13 | Leg uit dat op de korte termijn overwinst mogelijk is (gegeven de huidige prijs) | 2p | Begrijpen | Prereq S10 |
| 14 | Bereken het lange-termijnevenwicht (Q per bedrijf, P, aantal bedrijven) | 3p | Analyseren | **E9** |
| 15 | Leg uit met behulp van de figuur waarom de LT-prijs gelijk is aan de minimum GTK | 1p | Analyseren | **E9** |

**Totaal:** 15 sub-vragen • 32 punten • ~120 min.

**Bloomverdeling (doel vs. ontwerp):**
- Onthouden/Begrijpen: 25 % doel → 7 p (22 %) ✓
- Toepassen: 40 % doel → 12 p (38 %) ✓
- Analyseren/Evalueren: 35 % doel → 13 p (41 %) ✓

**Puntverdeling:** 1p×2, 2p×10, 3p×2, 4p×1 — 67 % bij 2p (nabij ~70 % target).

**Vraagtypes:** Type 1 "Leg uit dat" ×3; Type 2 "Bereken" ×5; Type 3 "Leg uit of" ×0 (vervangen door Beoordeel); Type 4 "Is/Motiveer" ×2; Type 5 "Teken/Arceer" ×2; Type 6 "Leg uit m.b.v." ×2; Type 7 "Noem" ×0; Beoordeel ×1. Mix blijft binnen consolidation/proeftoets norm.

**Bronmateriaal-dekking (§5.6 eis):** graaf als bron (opg 1, 2, 3, 4) ✓; datatabel (opg 2) ✓; langere tekstcontext (alle 4) ✓.



## Bestaande code/skills om te hergebruiken (niet opnieuw schrijven)

| Wat | Waar |
|---|---|
| Layer-5 skill-definities + prereqs | `engines/skilltree/base-elements.js` |
| Paragraaf-gebonden skill-map (Book 4 unlockt alle skills) | `source-data/module-3/skilltree/3.5.2.js` (referentie voor scope-check) |
| Vraagtype-taxonomie, scoring, Bloom-target | `references/authored/vraagtypen-en-opgaveontwerp.md` |
| Economische precisieregels | `references/authored/economic_mathematical_precision_reference.md` |
| Nederlandse terminologie | `references/authored/economie-terminologie.md` |
| PDF-bouwrecept | `skills/econ-pdf-builder/` + bestaande `build_pdf.py` in een andere proeftoets |
| Proeftoets-template §5.4 | `skills/econ-testprep-builder.md` regel 305–440 |
| Reeds gebouwde proeftoetsen (patronen) | bestaande `X.5.4 Proeftoets/` mappen in `output/` (kopieer naming/styling) |

## Kritieke bestanden om voor-te-lezen vóór te bouwen

- `skills/econ-testprep-builder.md` (Part 5 — proeftoets specs)
- `references/authored/vraagtypen-en-opgaveontwerp.md` (volledig — één source of truth)
- `references/authored/economic_mathematical_precision_reference.md` (beperkingen op domein, richtingen)
- `knowledge/course_blueprint_v4.md` Boek 4 hoofdstuk 5 specificatie
- `engines/skilltree/base-elements.js` definities van E4/E6/E7/E8/E9 met prereqs
- `skills/economic-graph/` voor grafiek-specificaties

## Verificatie / QC

1. **Toetsmatrijs-gate:** alle 5 Eindbazen verschijnen minimaal één keer in de matrix; elke prereq (S1, S5, S2, S3, F4, B1, S10) ook.
2. **Onafhankelijke review** via `econ-paragraph-review` skill (Pass 0: assets; Pass 1: didactiek; Pass 2: wiskundige/economische precisie).
3. **Puntensom check:** Σpunten = 32; Bloomverdeling binnen ±5 % van target.
4. **End-to-end PDF-build:** `python build_pdf.py` genereert alle drie PDF's zonder asset-fouten.
5. **Handmatige oplossing door auteur:** elk opgave binnen tijdsbudget uitwerken (opg 1: 30 min, opg 2: 30 min, opg 3: 35 min, opg 4: 25 min = 120 min). Tijden > 15 % overschrijding → vraag vereenvoudigen of punten bijstellen.
6. **`econ-quality-control` quality_ref:** genereren na review; append aan bestand voor inspectieverantwoording.
7. **Cross-book eis Boek 4:** bevestig dat context opg 1 (accijns, Boek 2 DWL) en opg 2 (tarief, Boek 2 internationale handel) terugkomen bij skills uit Boeken 1–3 — voldoet aan "cumulatief" regel (`econ-testprep-builder.md` §5.6).

## Wat expliciet NIET in deze test zit

- Geen meerkeuzevragen 
- Geen vaardigheidstips of scaffolding (proeftoets = niveau 0, `vraagtypen` §7.1 regulier).
- Geen nieuwe theorie.
- Geen tekenen van grafieken vanuit niets (alle grafische taken: modify/arceer op bestaande basis, §5.7).
