# Micro-teaching Units — Canonical Registry

**Do not hand-edit this file.** All changes flow through `build-scripts/references/unit-*.js`. Hand-edits are flagged and reverted by the next script run. See `knowledge/micro-teaching-units-plan.md` for the architecture.

---

## What this is

A registry of every discrete teaching chunk (roughly 3–7 minutes of instruction) across the platform:
- Mathematical skills used in economic work (domain `A`, from CvTE Vaardigheden)
- Economic concepts, procedures, and reasoning skills (domains `B`–`K`, from CvTE content domains)

Each unit *can carry* a stable permanent ID, prerequisite links (forming a DAG when present), a mastery target (Bloom ceiling), training aspects (`verbaal` / `grafisch` / `rekenen`), a canonical procedure when applicable, links to the exam program, and links to canonical terminology. Current coverage of the optional cross-links is printed in `reports/needs-coverage.md`, `reports/terms-coverage.md`, and `reports/procedure-coverage.md` — treat those as the backlog. The exercise-first principle says cross-links get filled in as paragraph plans and exercises cite units, not via bulk backfill.

---

## ID scheme

`<DomainLetter><2-digit number>`, sequential within domain. Example: `A01`, `D05`, `H12`.

The first eleven domain prefixes match the CvTE examenprogramma exactly. `L` is a platform-added prefix — see the note below the table.

| Prefix | Domain | Scope |
|---|---|---|
| `A` | Vaardigheden | Math, graph reading, calculation, reasoning — minted lazily as exercises demand |
| `B` | Schaarste | School exam |
| `C` | Ruil | School exam |
| `D` | Markt | Central exam |
| `E` | Ruilen over tijd | Central exam |
| `F` | Samenwerken en onderhandelen | Central exam |
| `G` | Risico en informatie | Central exam |
| `H` | Welvaart en groei | Central exam (macro) |
| `I` | Goede en slechte tijden | Central exam (conjunctuur) |
| `J` | Onderzoek en experiment | School exam |
| `K` | Keuzeonderwerpen | School exam |
| `L` | Arbeidsmarkt | **Platform-added point of attention.** CvTE places arbeidsmarkt content under H5, but its volume in real central-exam questions (heavy — see audit) justifies a distinct catalog prefix so the domain stays visible in coverage reports. `exam_codes` on L-units still reference `H5.x` / `A2.x` / `D3.10` per CvTE. |

IDs are **permanent once minted**. Renames change only the display name. Splits/merges mint new IDs and deprecate the old with pointers. Renumbering is forbidden.

---

## Unit schema

Each unit entry uses this format. Fields marked *optional* are omitted when empty; fields marked *A-only* only appear on domain `A` units.

```markdown
### <ID> <Name with optional (mode) suffix>
- layer: <integer>                                    # A-only (seeded from skilltree); optional elsewhere
- duration_min: <3-7>                                 # A-only (seeded); optional elsewhere
- kern: "<one-sentence mastery statement; imperative for apply+, declarative allowed for remember/understand>"
- needs: [<prerequisite unit IDs>]                    # required (may be empty)
- exam_codes: [<CvTE eindterm codes, e.g. D3.2, A2.10>]  # optional; A + D-I
- mastery_target: <remember | understand | apply | analyze | evaluate>
- prior_learning: <previously_taught | new_this_year | review_and_extend>
- aspects: [<verbaal | grafisch | rekenen>]           # required, non-empty subset
- terms: [<canonical Dutch terms>]                    # required (may be empty)
- procedure:                                          # optional; warn (not fail) for apply+ units without one
  1. <step>
  2. <step>
- pitfalls:                                           # optional, 1-2 bullets
  - <common misconception>
- generator: <GEN_* function name>                    # A-only; required for A-units
- deprecated: <true | false>                          # optional
- deprecated_in_favor_of: [<replacement IDs>]         # optional
```

**Validation rules enforced by the build CLI:**

1. `needs` entries must all resolve to existing unit IDs.
2. The `needs` graph must be acyclic.
3. `layer` is *stored* (not purely derived): the validator enforces `layer >= max(needs.layer) + 1`, so curated tier placements (e.g. the math skilltree's "Eindbazen" layer) survive rebuilds. Units without a stored `layer` get the derived minimum in the emitted JSON.
4. `exam_codes` entries must resolve to real eindtermen in `references/external/syllabus-eindtermen.json`.
5. `terms` entries must resolve to canonical terms in `economie-terminologie.md`.
6. `procedure` is *recommended* for `mastery_target` `apply` / `analyze` / `evaluate` — missing ones are warned and tracked in `reports/procedure-coverage.md`, not hard-failed.
7. `kern` style: imperative (`Bereken …`, `Leg uit …`) for `apply` / `analyze` / `evaluate`; declarative (`Het X geeft aan dat …`, `Constante kosten beïnvloeden …`) allowed for `remember` / `understand` where the mastery goal is to *know that* a relation holds rather than *do* a move. Style is not validator-enforced — rely on the next per-domain pass to normalize.
8. `generator` is only valid for `id.startsWith('A')`, and *required* for non-deprecated A-units.
9. `aspects` must be a non-empty subset of `[verbaal, grafisch, rekenen]`. Captures whether mastery requires verbal reasoning, graphical interpretation, mathematical calculation, or a combination — feeds downstream game / exercise routing.
10. `duration_min` outside 3–7 triggers a validator warning.

**Derived in JSON only (not human-authored in the markdown):**
- `category`: derived from ID prefix (`D05` → `markt`).

**Not stored on the unit (by design):**
- `used_in` paragraph / exercise back-references (lives in reports, regenerated each build).
- Per-exercise Bloom tags or question types (property of exercises).

---

## How to change a unit

Humans propose changes; CLI executes and validates.

| Operation | Command |
|---|---|
| Create a new unit | `node build-scripts/references/unit-add.js --spec '<JSON>'` |
| Rename (display only) | `node build-scripts/references/unit-rename.js --id <ID> --name "<new name>"` |
| Update a field | `node build-scripts/references/unit-update.js --id <ID> --spec '<JSON>'` |
| Add a prerequisite edge | `node build-scripts/references/unit-add-dep.js --from <ID> --to <prereq>` |
| Remove a prerequisite edge | `node build-scripts/references/unit-remove-dep.js --from <ID> --to <prereq>` |
| Deprecate with replacement | `node build-scripts/references/unit-deprecate.js --id <ID> --replaced-by <IDs>` |
| Split one into several | `node build-scripts/references/unit-split.js --from <ID> --into <IDs> --spec '<JSON>'` |
| Merge several into one | `node build-scripts/references/unit-merge.js --from <IDs> --into <ID>` |

A future `/unit` skill will accept Dutch natural language ("maak nieuwe unit D12 voor prijsdiscriminatie berekenen, volgt op D06 en A15, mastery apply"), echo the generated CLI call for confirmation, and execute it. Skill calls CLI — never the other way around.

---

## Units

<!-- STATS BELOW — regenerated by build-scripts/references/build-unit-index.js on each save -->
<!-- STATS LINE -->
*225 live units as of 2026-05-01 — A=76, B=2, D=39, E=7, F=18, G=12, H=30, I=20, L=21.*
<!-- STATS END -->

*B/C/J/K are still empty by design — they cover school-exam domains that no exercise has yet driven a unit mint for. Units appear when exercises demand them (see `knowledge/micro-teaching-units-plan.md` §9).*

<!-- UNIT ENTRIES BELOW THIS LINE — managed by build-scripts/references/unit-*.js -->

### A01 Lineaire functie opstellen
- layer: 0
- duration_min: 5
- kern: "Stel een lineaire functie op (y = ax + b) vanuit een economische context, zoals een vraag- of aanbodfunctie."
- needs: []
- exam_codes: [A2.9, A2.10]
- mastery_target: apply
- prior_learning: previously_taught
- aspects: [rekenen]
- terms: []
- assumed_prior_knowledge: [linear functions and coordinate-plane basics from lower-secondary mathematics]
- zero_needs_status: underbouw_assumed
- zero_needs_review: {"reviewed_on":"2026-04-26","reviewer":"human mutation review R2.4","rationale":"A01 accepted as foundational underbouw-assumed prior knowledge for R3.2; do not add artificial internal prerequisites.","recommended_needs":[],"severity":"low"}
- procedure:
  1. Noteer twee punten (P₁, Q₁) en (P₂, Q₂) uit de opgave.
  2. Bereken de richtingscoëfficiënt a = (Q₂ − Q₁) / (P₂ − P₁).
  3. Vul één punt in Q = aP + b en los op voor b.
  4. Controleer het teken: vraagfunctie heeft a < 0, aanbodfunctie heeft a > 0.
  5. Verifieer door het tweede punt in te vullen — de uitkomst moet kloppen.
- pitfalls:
  - Let op de volgorde: als je Qv als functie van P opstelt, dan is P de x en Q de y.
- generator: GEN_A01

### A02 Vergelijking oplossen
- layer: 0
- duration_min: 5
- kern: "Los een vergelijking met één onbekende op, bijvoorbeeld door twee functies aan elkaar gelijk te stellen."
- needs: []
- exam_codes: [A2.10, A2.12]
- mastery_target: apply
- prior_learning: previously_taught
- aspects: [rekenen, verbaal]
- terms: []
- assumed_prior_knowledge: [basic equation solving from lower-secondary mathematics]
- zero_needs_status: underbouw_assumed
- zero_needs_review: {"reviewed_on":"2026-04-26","reviewer":"human mutation review R2.4","rationale":"A02 accepted as foundational underbouw-assumed prior knowledge for R3.2; do not add artificial internal prerequisites.","recommended_needs":[],"severity":"low"}
- procedure:
  1. Breng alle termen met de onbekende naar één kant
  2. Breng alle getallen naar de andere kant
  3. Deel door het getal vóór de onbekende
- pitfalls:
  - Als je een term naar de andere kant verplaatst, vergeet dan niet het teken om te draaien.
- generator: GEN_A02

### A03 Functie omschrijven (P↔Q)
- layer: 0
- duration_min: 5
- kern: "Schrijf een functie om van P als functie van Q naar Q als functie van P, of andersom."
- needs: []
- exam_codes: [A2.10]
- mastery_target: apply
- prior_learning: previously_taught
- aspects: [rekenen]
- terms: []
- assumed_prior_knowledge: [formula rearranging and inverse notation from lower-secondary mathematics; diagnostic-sensitive skill]
- zero_needs_status: underbouw_assumed
- zero_needs_review: {"reviewed_on":"2026-04-26","reviewer":"human mutation review R2.4","rationale":"A03 accepted as foundational underbouw-assumed prior knowledge for R3.2; do not add artificial internal prerequisites.","recommended_needs":[],"severity":"medium"}
- procedure:
  1. Trek b af: Q − b = aP
  2. Deel door a: P = (Q − b) / a
- pitfalls:
  - Bij Qv = 100 − 2P is het verleidelijk om te delen door 2 en dan te schrijven P = 50 − Qv.
- generator: GEN_A03

### A04 Substitueren
- layer: 0
- duration_min: 5
- kern: "Vul een waarde in een functie in en bereken het resultaat."
- needs: []
- exam_codes: [A2.12]
- mastery_target: apply
- prior_learning: previously_taught
- aspects: [rekenen, verbaal]
- terms: []
- assumed_prior_knowledge: [substitution into formulas from lower-secondary mathematics]
- zero_needs_status: underbouw_assumed
- zero_needs_review: {"reviewed_on":"2026-04-26","reviewer":"human mutation review R2.4","rationale":"A04 accepted as foundational underbouw-assumed prior knowledge for R3.2; do not add artificial internal prerequisites.","recommended_needs":[],"severity":"low"}
- procedure:
  1. Identificeer in de formule elke plek waar de variabele voorkomt.
  2. Vervang die variabele consequent door de gegeven waarde, inclusief haakjes bij negatieve getallen.
  3. Reken in de volgorde haakjes → machten → vermenigvuldigen/delen → optellen/aftrekken.
  4. Noteer tussenresultaten per term om optelfouten te voorkomen.
  5. Controleer de eenheid van het eindantwoord (€, stuks, %).
- pitfalls:
  - Bij 0,5Q² moet je eerst Q kwadrateren en dan pas vermenigvuldigen met 0,5.
- generator: GEN_A04

### A05 Snijpunt met P-as berekenen
- layer: 0
- duration_min: 5
- kern: "Bereken het snijpunt van een functie met de verticale as (P-as) door Q = 0 in te vullen."
- needs: []
- exam_codes: [A2.13, A2.14]
- mastery_target: apply
- prior_learning: previously_taught
- aspects: [grafisch, rekenen]
- terms: []
- assumed_prior_knowledge: [axis intercept reasoning and solving for zero from lower-secondary mathematics; diagnostic-sensitive skill]
- zero_needs_status: underbouw_assumed
- zero_needs_review: {"reviewed_on":"2026-04-26","reviewer":"human mutation review R2.4","rationale":"A05 accepted as foundational underbouw-assumed prior knowledge for R3.2; do not add artificial internal prerequisites.","recommended_needs":[],"severity":"medium"}
- procedure:
  1. Zorg dat de functie in de vorm P = f(Q) staat; zo niet, schrijf eerst om (zoals in A03).
  2. Vul Q = 0 in de functie P = f(Q).
  3. Lees de uitkomst af: dit is Pmax bij een vraagfunctie of Pmin bij een aanbodfunctie.
  4. Controleer: bij een vraagfunctie Q = a − bP vind je het snijpunt ook als a/b.
- pitfalls:
  - Verwar het snijpunt met de P-as niet met het snijpunt met de Q-as.
- generator: GEN_A05

### A06 Evenwichtsprijs & -hoeveelheid
- layer: 1
- duration_min: 5
- kern: "Bereken de evenwichtsprijs en -hoeveelheid door vraag en aanbod aan elkaar gelijk te stellen."
- needs: [A01, A02]
- exam_codes: [A2.10, A2.12, A2.15]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [evenwichtshoeveelheid, evenwichtsprijs]
- procedure:
  1. Stel de twee functies aan elkaar gelijk
  2. Los op naar P → evenwichtsprijs (P*)
  3. Vul P* in een van de functies → evenwichtshoeveelheid (Q*)
- pitfalls:
  - Vergeet niet de evenwichtshoeveelheid te berekenen!
- generator: GEN_A06

### A07 TO-functie opstellen
- layer: 1
- duration_min: 5
- kern: "Stel de totale opbrengstfunctie op: TO = P × Q. Schrijf de vraagfunctie om zodat P in Q is uitgedrukt."
- needs: [A01, A03]
- exam_codes: [A2.10, A2.15]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen, verbaal]
- terms: []
- procedure:
  1. Zorg dat P als functie van Q beschikbaar is; schrijf zo nodig om (zoals in A03).
  2. Vermenigvuldig TO = P × Q met haakjes om elke term van P mee te nemen.
  3. Werk uit tot een nette TO-functie in Q (lineair bij volkomen concurrentie, kwadratisch bij een monopolie).
  4. Controleer door een willekeurige Q in te vullen: TO moet gelijk zijn aan P(Q) × Q.
- pitfalls:
  - Vergeet niet de haakjes als je P × Q uitrekent!
- generator: GEN_A07

### A08 TK-functie herkennen
- layer: 1
- duration_min: 5
- kern: "Herken en werk met de totale kostenfunctie (TK), vaak gegeven als TK = vaste kosten + variabele kosten × Q."
- needs: [A01]
- exam_codes: [A2.10, A2.15]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [variabele-kosten]
- procedure:
  1. Splits de TK-functie in een term zonder Q (= TCK) en termen met Q (= TVK).
  2. Controleer door Q = 0 in te vullen: de uitkomst is de TCK.
  3. Benoem de lineaire variabele kosten per stuk (coëfficiënt vóór Q) en eventuele kwadratische term.
  4. Bereken TK bij de gevraagde Q door substitutie (zoals in A04).
- pitfalls:
  - Bij TK = 12Q + 0,3Q² denken leerlingen soms dat er geen vaste kosten zijn.
- generator: GEN_A08

### A09 Collectief aanbod
- layer: 1
- duration_min: 5
- kern: "Tel individuele aanbodfuncties op tot een collectieve aanbodfunctie."
- needs: [A03]
- exam_codes: [A2.9]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: []
- procedure:
  1. Zorg dat de individuele aanbodfunctie in de vorm qa = f(P) staat; schrijf zo nodig om (zoals in A03).
  2. Bij n identieke aanbieders: vermenigvuldig de hele functie met n (beide termen!).
  3. Bij verschillende aanbieders: tel de individuele Q-functies op bij dezelfde P.
  4. Bepaal per aanbieder de minimumprijs (qa = 0) en neem alleen aanbieders mee waarvoor qa ≥ 0.
  5. Controleer met één prijs: n × individuele qa moet gelijk zijn aan de collectieve Qa.
- pitfalls:
  - Als je Qa = 50 × (−5 + 2P) uitwerkt, vergeet dan niet BEIDE termen te vermenigvuldigen: 50 × −5 = −250 en 50 × 2P = 100P.
- generator: GEN_A09

### A10 Oppervlakte driehoek
- layer: 1
- duration_min: 5
- kern: "Bereken de oppervlakte van een driehoek in een grafiek: ½ × basis × hoogte."
- needs: [A04]
- exam_codes: [A2.17]
- mastery_target: apply
- prior_learning: previously_taught
- aspects: [grafisch, rekenen]
- terms: []
- procedure:
  1. Identificeer de drie hoekpunten van de driehoek in de grafiek.
  2. Kies een basis en een hoogte die loodrecht op elkaar staan.
  3. Bepaal de basis als een horizontale afstand (ΔQ) of de hoogte als een verticale afstand (ΔP).
  4. Bereken de oppervlakte = ½ × basis × hoogte.
  5. Controleer: basis en hoogte zijn beide positieve afstanden, geen losse coördinaten.
- pitfalls:
  - Verwar de hoogte niet met de P-waarde zelf.
- generator: GEN_A10

### A11 Afgeleide bepalen
- layer: 1
- duration_min: 5
- kern: "Bepaal de afgeleide van een functie. Bijvoorbeeld: als TO = 5Q², dan is MO = 10Q."
- needs: [A01]
- exam_codes: [A2.11]
- mastery_target: apply
- prior_learning: previously_taught
- aspects: [rekenen]
- terms: []
- procedure:
  1. Schrijf de functie als som van termen van de vorm aQⁿ.
  2. Pas per term de regel toe: aQⁿ → n·a·Qⁿ⁻¹.
  3. Laat constante termen verdwijnen (afgeleide = 0).
  4. Tel de afgeleide termen op tot één nette functie (MO of MK).
  5. Controleer: de afgeleide van een lineaire term aQ is a; de afgeleide van aQ² is 2aQ.
- pitfalls:
  - Een veelgemaakte fout: de constante vergeten te schrappen.
- generator: GEN_A11

### A12 MO bepalen
- layer: 2
- duration_min: 5
- kern: "Bepaal de marginale opbrengst (MO) door de afgeleide van de TO-functie te nemen."
- needs: [A11, A07]
- exam_codes: [A2.11]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen]
- terms: []
- procedure:
  1. Stel de TO-functie op via TO = P × Q (zoals in A07).
  2. Bepaal MO als afgeleide van TO naar Q (zoals in A11).
  3. Controleer het type: bij volkomen concurrentie is MO = P (constant); bij een monopolie met P = a − bQ is MO = a − 2bQ.
  4. Bereken MO bij de gevraagde Q door substitutie.
- pitfalls:
  - MO is niet hetzelfde als de prijs!
- generator: GEN_A12

### A13 MK bepalen
- layer: 2
- duration_min: 5
- kern: "Bepaal de marginale kosten (MK) door de afgeleide van de TK-functie te nemen."
- needs: [A11, A08]
- exam_codes: [A2.11]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [marginale-kosten]
- procedure:
  1. Identificeer de TK-functie en haar termen.
  2. Bepaal MK als afgeleide van TK naar Q (zoals in A11); de vaste kosten vallen weg.
  3. Controleer: bij lineaire TK is MK constant, bij kwadratische TK stijgt MK met Q.
  4. Bereken MK bij de gevraagde Q door substitutie.
- pitfalls:
  - Verwar MK niet met GTK (gemiddelde totale kosten).
- generator: GEN_A13

### A14 GTK bepalen
- layer: 2
- duration_min: 5
- kern: "Bereken de gemiddelde totale kosten: GTK = TK / Q."
- needs: [A08]
- exam_codes: [A2.11]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [gemiddelde-totale-kosten]
- procedure:
  1. Noteer de TK-functie.
  2. Deel elke term afzonderlijk door Q: TCK/Q + v + cQ.
  3. Vereenvoudig (Q² / Q = Q, constante/Q blijft staan als TCK/Q).
  4. Bereken GTK bij de gevraagde Q door substitutie.
  5. Interpreteer: TCK/Q daalt met Q (schaalvoordeel), cQ stijgt — samen geven ze de U-vorm.
- pitfalls:
  - Deel ELKE term apart door Q!
- generator: GEN_A14

### A15 Prijselasticiteit van de vraag
- layer: 1
- duration_min: 5
- kern: "Bereken de prijselasticiteit: Ev = %ΔQv / %ΔP. Bepaal of de vraag elastisch of inelastisch is."
- needs: [A04, A38]
- exam_codes: [A2.4, A2.5]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [prijselasticiteit-van-de-vraag]
- procedure:
  1. Noteer de oude en nieuwe waarden van P en Q.
  2. Bereken %ΔQv = (ΔQv / Qv_oud) × 100% en %ΔP = (ΔP / P_oud) × 100% met correct teken.
  3. Bereken Ev = %ΔQv / %ΔP.
  4. Interpreteer: |Ev| > 1 = elastisch, |Ev| < 1 = inelastisch, |Ev| = 1 = unitair.
  5. Controleer het teken: Ev is bij een normale vraag altijd negatief.
- pitfalls:
  - Vergeet het minteken niet!
- generator: GEN_A15

### A16 Kruiselasticiteit
- layer: 2
- duration_min: 5
- kern: "Bereken de kruiselasticiteit: Ekr = %ΔQa / %ΔPb. Bepaal of goederen substituten of complementen zijn."
- needs: [A15]
- exam_codes: [A2.4, A2.5]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: []
- procedure:
  1. Identificeer welk product de Q levert (product A) en welk product de P (product B).
  2. Bereken %ΔQa van product A en %ΔPb van product B met correct teken.
  3. Bereken Ekr = %ΔQa / %ΔPb.
  4. Interpreteer het teken: Ekr > 0 = substituten, Ekr < 0 = complementen, Ekr ≈ 0 = geen verband.
- pitfalls:
  - Let goed op welk product de Q is en welk product de P.
- generator: GEN_A16

### A17 Inkomenselasticiteit
- layer: 2
- duration_min: 5
- kern: "Bereken de inkomenselasticiteit: Ei = %ΔQ / %ΔY. Bepaal of een goed normaal, inferieur of luxe is."
- needs: [A15]
- exam_codes: [A2.4, A2.5]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [inkomenselasticiteit]
- procedure:
  1. Bereken %ΔQ van het product en %ΔY van het inkomen met correct teken.
  2. Bereken Ei = %ΔQ / %ΔY.
  3. Interpreteer: Ei < 0 = inferieur goed, 0 < Ei < 1 = noodzakelijk goed, Ei > 1 = luxegoed.
  4. Controleer: noemer is %ΔY (inkomen), niet %ΔP — verwar niet met Ev.
- pitfalls:
  - Verwar inkomenselasticiteit niet met prijselasticiteit!
- generator: GEN_A17

### A18 Comparatief voordeel bepalen
- layer: 3
- duration_min: 5
- kern: "Vergelijk de alternatieve kosten van twee producenten om te bepalen wie een comparatief voordeel heeft."
- needs: [B02]
- exam_codes: [A2.6, A4.3]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: []
- procedure:
  1. Noteer per land de maximale productie van beide goederen per periode.
  2. Bereken per land de alternatieve kosten van product X (= hoeveelheid Y opgegeven / hoeveelheid X gewonnen).
  3. Vergelijk de alternatieve kosten: het land met de laagste alternatieve kosten heeft het comparatief voordeel in dat product.
  4. Controleer: de alternatieve kosten van het andere product zijn het omgekeerde van de eerste berekening.
  5. Concludeer welk land in welk product moet specialiseren.
- pitfalls:
  - Verwar absoluut en comparatief voordeel niet!
- generator: GEN_A18

### A19 Surplus berekenen (CS/PS)
- layer: 3
- duration_min: 5
- kern: "Bereken het consumenten- of producentensurplus als driehoeksoppervlakte in de vraag-/aanbodgrafiek."
- needs: [A06, A10]
- exam_codes: [A2.16, A2.17]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen, verbaal]
- terms: [producentensurplus]
- procedure:
  1. Bereken het marktevenwicht P* en Q* (zoals in A06).
  2. Bepaal Pmax (snijpunt vraaglijn met P-as, zoals in A05) en Pmin (snijpunt aanbodlijn met P-as).
  3. Bereken CS = ½ × Q* × (Pmax − P*) als driehoeksoppervlakte (zoals in A10).
  4. Bereken PS = ½ × Q* × (P* − Pmin) op dezelfde manier.
  5. Controleer: CS en PS zijn beide positieve bedragen.
- pitfalls:
  - Vergeet niet om de vraaglijn om te schrijven naar P als functie van Q voordat je Pmax bepaalt.
- generator: GEN_A19

### A20 MO = MK oplossen
- layer: 3
- duration_min: 5
- kern: "Vind de winstmaximaliserende hoeveelheid door MO gelijk te stellen aan MK en op te lossen."
- needs: [A12, A13, A02]
- exam_codes: [A2.10, A2.12]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: []
- procedure:
  1. Stel de MO-functie op (afgeleide van TO, zoals in A12).
  2. Stel de MK-functie op (afgeleide van TK, zoals in A13).
  3. Stel MO = MK en los op voor Q* (zoals in A02).
  4. Controleer dat bij deze Q* geldt MO > MK voor kleinere Q en MO < MK voor grotere Q.
  5. Gebruik Q* later om P* (via de vraaglijn) en de winst te bepalen.
- pitfalls:
  - Verwar MO niet met de prijs!
- generator: GEN_A20

### A21 Winst = TO − TK
- layer: 3
- duration_min: 5
- kern: "Bereken de winst door de totale opbrengst min de totale kosten: W = TO − TK."
- needs: [A07, A08, A04]
- exam_codes: [A2.1, A2.11]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [totale-kosten, totale-opbrengst, winst]
- procedure:
  1. Bereken TO bij de gegeven Q door substitutie in de TO-functie (zoals in A04).
  2. Bereken TK bij dezelfde Q door substitutie in de TK-functie.
  3. Bereken winst = TO − TK.
  4. Interpreteer: een negatieve uitkomst is verlies.
  5. Controleer of de vaste kosten meegenomen zijn in TK.
- pitfalls:
  - Vergeet de constante kosten niet!
- generator: GEN_A21

### A22 Break-even (TO = TK)
- layer: 3
- duration_min: 5
- kern: "Vind de break-evenhoeveelheid door TO = TK op te lossen. Bij dit punt is de winst nul."
- needs: [A07, A08, A02]
- exam_codes: [A2.10, A2.12]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [winst]
- procedure:
  1. Stel TO = TK.
  2. Herschrijf naar de standaardvorm aQ² + bQ + c = 0 (alles naar één kant, tekens omdraaien).
  3. Los op met de abc-formule of via ontbinden in factoren — je vindt twee break-evenpunten Q₁ en Q₂.
  4. Concludeer: tussen Q₁ en Q₂ maakt het bedrijf winst; erbuiten verlies.
  5. Controleer door Q₁ en Q₂ terug te vullen: TO en TK moeten gelijk zijn.
- pitfalls:
  - Bij het herschrijven naar de standaardvorm verplaats je alle termen naar één kant.
- generator: GEN_A22

### A23 Evenwicht met heffing
- layer: 3
- duration_min: 5
- kern: "Bereken het nieuwe marktevenwicht nadat de overheid een heffing (accijns) heeft opgelegd, en analyseer hoe de heffing verdeeld wordt tussen consument en producent."
- needs: [A06, A01, A15]
- exam_codes: [A2.10, A2.14]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [marktevenwicht]
- procedure:
  1. Vervang in de aanbodfunctie P door (P − t) — de producent ontvangt minder door de heffing.
  2. Werk de nieuwe aanbodfunctie uit (let op haakjes: beide termen vermenigvuldigen).
  3. Stel de nieuwe Qa gelijk aan Qv en los op naar P* (zoals in A06).
  4. Bereken Q*_nieuw door P*_nieuw in te vullen.
  5. Analyseer de verdeling: consumentenprijs − P*_oud + P*_oud − producentenprijs = heffing.
- pitfalls:
  - De heffing t aftrekken van P in de aanbodfunctie, niet van de vraagfunctie — de producent ontvangt minder per eenheid.
  - Haakjes rond (P − t) vergeten: beide termen moeten met de aanbodhelling vermenigvuldigd worden.
  - De verdeling consument/producent hangt af van relatieve elasticiteiten — de meest inelastische partij draagt het grootste deel van de heffing.
- generator: GEN_A23

### A24 Collectief aanbod bepalen
- layer: 3
- duration_min: 5
- kern: "Bepaal het collectieve aanbod vanuit meerdere individuele aanbieders en bereken het marktevenwicht."
- needs: [A09, A03]
- exam_codes: [A2.9, A2.12]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [marktevenwicht]
- procedure:
  1. Schrijf elke individuele aanbodfunctie om naar qi als functie van P (zoals in A03).
  2. Bepaal per groep de minimumprijs via qi = 0.
  3. Vermenigvuldig per groep qi met het aantal bedrijven in die groep.
  4. Tel de groepen op bij dezelfde P, maar alleen waar qi > 0 geldt.
  5. Geef de knikpunten aan: op elke minimumprijs treedt een nieuwe groep toe en verandert de helling.
- pitfalls:
  - Als bedrijven een verschillende minimumprijs hebben, biedt het ene bedrijf al aan terwijl het andere nog niet produceert.
- generator: GEN_A24

### A25 Minimumprijs analyseren
- layer: 3
- duration_min: 5
- kern: "Analyseer het effect van een minimumprijs: bereken het vraagoverschot en het welvaartsverlies."
- needs: [A06]
- exam_codes: [A2.15, A2.16, A4.5]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen, verbaal]
- terms: []
- procedure:
  1. Bereken het marktevenwicht P* en Q* zonder ingrijpen (zoals in A06).
  2. Controleer: Pmin > P*? Zo niet, dan heeft de minimumprijs geen effect.
  3. Bereken Qv(Pmin) en Qa(Pmin) via substitutie.
  4. Bereken aanbodoverschot = Qa(Pmin) − Qv(Pmin).
  5. Concludeer: er wordt Qv(Pmin) verhandeld — de vraag is de korte zijde van de markt.
- pitfalls:
  - Bij een minimumprijs bepaalt de vraagzijde hoeveel er verhandeld wordt, niet het aanbod.
- generator: GEN_A25

### A26 Maximumprijs analyseren
- layer: 3
- duration_min: 5
- kern: "Analyseer het effect van een maximumprijs: bereken het vraagoverschot en de gevolgen voor consumenten."
- needs: [A06]
- exam_codes: [A2.15, A2.16, A4.5]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen, verbaal]
- terms: []
- procedure:
  1. Bereken het marktevenwicht P* en Q* zonder ingrijpen (zoals in A06).
  2. Controleer: Pmax < P*? Zo niet, dan heeft de maximumprijs geen effect.
  3. Bereken Qv(Pmax) en Qa(Pmax) via substitutie.
  4. Bereken vraagoverschot (tekort) = Qv(Pmax) − Qa(Pmax).
  5. Concludeer: er wordt Qa(Pmax) verhandeld — het aanbod is de korte zijde van de markt.
- pitfalls:
  - Bij een maximumprijs bepaalt de aanbodzijde hoeveel er verhandeld wordt.
- generator: GEN_A26

### A27 Subsidie analyseren
- layer: 3
- duration_min: 5
- kern: "Bereken het effect van een subsidie op het marktevenwicht, de prijs en de verdeling van het voordeel."
- needs: [A06, A01]
- exam_codes: [A2.15, A2.16]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen, verbaal]
- terms: [marktevenwicht]
- procedure:
  1. Vervang in de aanbodfunctie P door (P + s) — de producent ontvangt meer door de subsidie.
  2. Werk de nieuwe aanbodfunctie uit (beide termen vermenigvuldigen).
  3. Stel de nieuwe Qa gelijk aan Qv en los op naar P*_nieuw en Q*_nieuw (zoals in A06).
  4. Bereken de totale subsidiekosten = s × Q*_nieuw.
  5. Analyseer: consumentenprijs daalt, producentenprijs (P + s) stijgt; samen is het verschil de subsidie.
- pitfalls:
  - Bij een subsidie ontvangt de producent P + s, niet P − s.
- generator: GEN_A27

### A28 MK = GTK oplossen
- layer: 3
- duration_min: 5
- kern: "Vind de hoeveelheid waar MK = GTK. Dit is het minimum van de GTK-curve (efficiënte schaal)."
- needs: [A13, A14]
- exam_codes: [A2.10, A2.11]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen]
- terms: []
- procedure:
  1. Stel MK op als afgeleide van TK (zoals in A13).
  2. Stel GTK op als TK / Q (zoals in A14).
  3. Stel MK = GTK en vereenvoudig (de lineaire term valt links en rechts weg).
  4. Los op: meestal Q² = TCK / a, dus Q = √(TCK / a).
  5. Controleer: GTK(Q*) = MK(Q*). Dit punt is het minimum van de GTK-curve (efficiënte schaal).
- pitfalls:
  - GTK is niet de afgeleide van TK!
- generator: GEN_A28

### A29 Break-even analyse
- layer: 4
- duration_min: 5
- kern: "Voer een volledige break-evenanalyse uit: vind de break-evenhoeveelheid en bepaal winst/verlies bij een gegeven Q."
- needs: [A22]
- exam_codes: [A2.10, A2.15]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [winst]
- procedure:
  1. Stel TO = TK en herschrijf naar standaardvorm aQ² + bQ + c = 0.
  2. Los op met de abc-formule voor Q₁ en Q₂ (zoals in A22).
  3. Bepaal het winstgebied: Q₁ < Q < Q₂.
  4. Bereken bij een specifieke Q de winst als W = TO − TK (zoals in A21).
  5. Optioneel: bereken de maximale winst via MO = MK (zoals in A20) en evalueer W op dat punt.
- pitfalls:
  - Bij het herschrijven naar de standaardvorm verandert het teken van de Q-term.
- generator: GEN_A29

### A30 Consumentensurplus
- layer: 4
- duration_min: 5
- kern: "Bereken het consumentensurplus voor en na een beleidsverandering en bepaal het verschil."
- needs: [A19]
- exam_codes: [A2.16, A2.17]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [consumentensurplus]
- procedure:
  1. Bereken P* door Qv = Qa te stellen en op te lossen (zoals in A06).
  2. Bereken Q* door P* in te vullen in de vraag- of aanbodfunctie.
  3. Bepaal Pmax door Q = 0 in de vraagfunctie te zetten (zoals in A05).
  4. Bereken CS = ½ × Q* × (Pmax − P*) als driehoeksoppervlakte (zoals in A10).
  5. Controleer op schets: de driehoek ligt tussen vraaglijn, verticale as en de horizontale lijn op P*.
- pitfalls:
  - Pmax is niet de coëfficiënt vóór P in de vraaglijn.
- generator: GEN_A30

### A31 Individueel → collectief aanbod
- layer: 4
- duration_min: 5
- kern: "Ga van individuele aanbodcurves naar de collectieve aanbodcurve en bereken het marktevenwicht."
- needs: [A24]
- exam_codes: [A2.9, A2.14]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [marktevenwicht]
- procedure:
  1. Schrijf elke individuele aanbodlijn om naar qi = f(P) (zoals in A03).
  2. Bepaal per groep de minimumprijs (qi = 0) en orden de groepen van lage naar hoge minimumprijs.
  3. Vermenigvuldig per groep qi met het aantal bedrijven en schakel bij prijzen onder Pmin de groep op 0.
  4. Tel de groepsbijdragen op bij de gevraagde P — enkel positieve termen tellen mee.
  5. Geef in het antwoord de knikpunten aan (op elke minimumprijs verandert de helling).
- pitfalls:
  - Als groep B een minimumprijs van €8 heeft en je rekent bij P = 6, dan is Qi_B = (6−8)/2 = −1.
- generator: GEN_A31

### A32 Welvaartsverlies belasting
- layer: 5
- duration_min: 5
- kern: "Bereken het welvaartsverlies (deadweight loss) dat ontstaat door een belasting als driehoeksoppervlakte."
- needs: [A19, A23]
- exam_codes: [A2.16, A2.17]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen]
- terms: []
- procedure:
  1. Bereken Q*_oud uit het evenwicht zonder heffing (zoals in A06).
  2. Bereken Q*_nieuw uit het evenwicht met heffing (zoals in A23).
  3. Bepaal ΔQ = Q*_oud − Q*_nieuw (positief).
  4. Bereken DWL = ½ × ΔQ × t als driehoeksoppervlakte.
  5. Onderscheid duidelijk van de belastingopbrengst (t × Q*_nieuw): die is een herverdeling, geen verlies.
- pitfalls:
  - Verwar het welvaartsverlies niet met de totale belastingopbrengst.
- generator: GEN_A32

### A33 Optimale productie bij VM
- layer: 4
- duration_min: 5
- kern: "Bepaal de optimale productie bij volkomen mededinging: produceer waar P = MK en bereken de winst."
- needs: [A13, A14, A04]
- exam_codes: [A2.10, A2.12]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [winst]
- procedure:
  1. Stel MK op als afgeleide van TK (zoals in A13).
  2. Stel P = MK en los op voor Q* (het bedrijf is prijsnemer).
  3. Bereken TK(Q*) en daaruit GTK = TK / Q*.
  4. Bereken winst per stuk = P − GTK.
  5. Bereken totale winst = (P − GTK) × Q*. Bij P < GTK maakt het bedrijf verlies.
- pitfalls:
  - Winst is niet P × Q!
- generator: GEN_A33

### A34 Effecten invoerrecht
- layer: 5
- duration_min: 5
- kern: "Analyseer de effecten van een invoerrecht op binnenlandse productie, consumptie, import en welvaart."
- needs: [A19, A23, A06]
- exam_codes: [A2.16, A4.3]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: []
- procedure:
  1. Bereken zonder invoerrecht Qv en Qa bij Pw en bepaal de import = Qv − Qa.
  2. Bepaal de nieuwe binnenlandse prijs P_nieuw = Pw + t.
  3. Bereken Qv(P_nieuw) en Qa(P_nieuw) via substitutie en daaruit de nieuwe import.
  4. Bereken de overheidsinkomsten = t × nieuwe import.
  5. Vergelijk de vier effecten: binnenlandse productie stijgt, consumptie daalt, import daalt, overheidsinkomsten nieuw.
- pitfalls:
  - Het invoerrecht verandert niet de binnenlandse vraag- of aanbodfuncties zelf.
- generator: GEN_A34

### A35 Max. winst monopolist
- layer: 5
- duration_min: 5
- kern: "Bereken de maximale winst van een monopolist: vind Q waar MO = MK, bepaal P en reken W = TO − TK uit."
- needs: [A20, A21, A04]
- exam_codes: [A2.10, A2.11, A2.12]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [winst]
- procedure:
  1. Stel MO op uit de vraaglijn P = a − bQ: MO = a − 2bQ.
  2. Stel MK op als afgeleide van TK.
  3. Stel MO = MK en los op voor Q* (zoals in A20).
  4. Bepaal P* door Q* in te vullen in de vraaglijn (niet in MO!).
  5. Bereken winst = P* × Q* − TK(Q*) (zoals in A21).
- pitfalls:
  - Gebruik niet MO als prijs!
- generator: GEN_A35

### A36 Prijsdiscriminatie
- layer: 5
- duration_min: 5
- kern: "Bereken de winst bij prijsdiscriminatie: de monopolist rekent verschillende prijzen in verschillende markten."
- needs: [A20, A21]
- exam_codes: [A2.10, A2.11]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [prijsdiscriminatie, winst]
- procedure:
  1. Bepaal MK (gelijk voor beide markten, zoals in A13).
  2. Stel per markt MO_i op uit de eigen vraaglijn (MO_i = a_i − 2b_iQ_i).
  3. Los per markt MO_i = MK op voor Q_i*.
  4. Lees per markt P_i* af uit de eigen vraaglijn bij Q_i*.
  5. Bereken de totale winst = Σ (P_i* − MK) × Q_i* — de markt met de inelastischere vraag krijgt de hogere prijs.
- pitfalls:
  - Gebruik niet dezelfde Q voor beide markten!
- generator: GEN_A36

### A37 Lange-termijnevenwicht VM
- layer: 5
- duration_min: 5
- kern: "Bepaal het lange-termijnevenwicht bij volkomen mededinging: P = MK = GTK (minimale GTK)."
- needs: [A28]
- exam_codes: [A2.10, A4.5]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: []
- procedure:
  1. Stel MK op (afgeleide van TK) en GTK op (TK / Q).
  2. Los MK = GTK op voor Q* (zoals in A28) — dit is het minimum van de GTK-curve.
  3. Bereken P_LT = MK(Q*) = GTK(Q*): dit is de lange-termijnprijs.
  4. Verifieer dat winst per stuk = P_LT − GTK = 0 (economische winst = 0).
  5. Concludeer: toetreding/uittreding is beëindigd, want bedrijven verdienen precies het normale ondernemersinkomen.
- pitfalls:
  - Winst = 0 betekent niet dat het bedrijf geen geld verdient!
- generator: GEN_A37

### A38 Procentuele verandering berekenen
- kern: "Bereken de procentuele verandering met %Δ = (nieuw − oud) / oud × 100, en pas dit toe op prijzen, hoeveelheden, indexcijfers en reële variabelen."
- needs: []
- exam_codes: [A2.4, A2.5]
- mastery_target: apply
- prior_learning: previously_taught
- aspects: [rekenen]
- terms: []
- assumed_prior_knowledge: [percentage-change calculation from lower-secondary mathematics]
- zero_needs_status: underbouw_assumed
- zero_needs_review: {"reviewed_on":"2026-04-26","reviewer":"human mutation review R2.4","rationale":"A38 accepted as foundational underbouw-assumed prior knowledge for R3.2; do not add artificial internal prerequisites.","recommended_needs":[],"severity":"low"}
- procedure:
  1. Identificeer de oude en nieuwe waarde — let op welke het basisjaar / uitgangspunt is.
  2. Bereken het absolute verschil (nieuw − oud).
  3. Deel door de oude waarde en vermenigvuldig met 100.
  4. Controleer het teken: stijging positief, daling negatief.
- pitfalls:
  - De nieuwe waarde als basis gebruiken — leidt tot een andere uitkomst; het basisjaar hoort in de noemer.
  - Verwarring met procentpunt-verandering (zie D31) — een CPI-sprong van 108 → 112 is 4 punten maar slechts (4/108)·100 ≈ 3,7 % inflatie.
- generator: GEN_A38

### A39 Prijsindex (CPI) berekenen
- kern: "Bereken een prijsindex als mandprijs-jaar-t / mandprijs-basisjaar × 100, en interpreteer het getal als relatieve prijsverandering ten opzichte van basisjaar = 100."
- needs: [A38]
- exam_codes: [A2.4, A2.5]
- mastery_target: apply
- prior_learning: previously_taught
- aspects: [rekenen]
- terms: []
- procedure:
  1. Kies het basisjaar (index = 100).
  2. Bereken de mandprijs in het doeljaar met dezelfde samenstelling.
  3. Index = mandprijs(t) / mandprijs(basisjaar) × 100.
  4. Inflatie tussen twee jaren = (index_t − index_{t-1}) / index_{t-1} × 100 (gebruik A38 op de indexwaarden).
- pitfalls:
  - Basisjaar vergeten of verkeerd kiezen — het jaar dat op 100 gezet is moet expliciet zijn.
  - Index-verschil met inflatie verwarren (zie D31).
- generator: GEN_A39

### A40 Welvaartsgebied op P–Q diagram arceren
- kern: "Identificeer en arceer de juiste welvaartsregio op een P–Q diagram: consumentensurplus, producentensurplus, belastingopbrengst-rechthoek, welvaartsverlies-driehoek, subsidie-rechthoek, monopoliewinst-rechthoek, of tarief-DWL."
- needs: [A10]
- exam_codes: [A2.16, A2.17]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch]
- terms: []
- procedure:
  1. Identificeer welke grootheid gevraagd wordt (CS, PS, TS, DWL, belastingopbrengst, subsidiekosten, monopoliewinst, Harberger-driehoek).
  2. Lokaliseer de grenzen: welke curve zit boven, welke onder, op welke Q-interval.
  3. Teken de gesloten figuur met duidelijk gemarkeerde hoekpunten en label het gebied (CS / PS / DWL / ...).
  4. Controleer: past de figuur bij de definitie? (CS ligt tussen vraag en prijs; PS tussen prijs en aanbod; DWL tussen Q_oud en Q_nieuw).
- pitfalls:
  - Het verkeerde gebied arceren — veel students arceren CS onder de prijslijn in plaats van erboven.
  - Rechthoeken en driehoeken verwisselen: belastingopbrengst is een rechthoek (tax × Qt), welvaartsverlies is een driehoek.
- generator: GEN_A40

### A41 Na-belasting of na-subsidie aanbodfunctie afleiden
- kern: "Leid de na-belasting aanbodfunctie af door de heffing per eenheid bij de inverse aanbodfunctie op te tellen; bij een subsidie trek je de subsidie per eenheid af. Vervolgens los je Qa_nieuw = Qv op voor het nieuwe evenwicht."
- needs: [A03]
- exam_codes: [A2.10, A2.14]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: []
- procedure:
  1. Schrijf de oorspronkelijke aanbodfunctie in inverse vorm: P = f(Q).
  2. Bij een heffing t: voeg t toe aan de inverse (P_nieuw = f(Q) + t), of equivalent: verschuif Qa met -t·a (horizontale vorm).
  3. Bij een subsidie s: trek s af van de inverse (P_nieuw = f(Q) − s).
  4. Los Qa_nieuw = Qv op voor het nieuwe evenwicht; bepaal consumentenprijs Pc en producentenprijs Pp.
- pitfalls:
  - De verschuiving in de verkeerde richting zetten — heffing schuift supply OMHOOG in P, subsidie OMLAAG.
  - Qa-vorm (Q als functie van P) en P-vorm door elkaar halen — de heffing-verschuiving is +t in P-vorm, -b·t in Qa-vorm met Qa = aP + b.
- generator: GEN_A41

### A42 Grafische verschuiving met voor-en-na pijlen
- layer: 1
- kern: "Teken een grafische verschuiving (vraag- of aanbodcurve) met zowel de oude als de nieuwe curve, gelabeld D / D' of S / S', en geef de richting aan met pijlen tussen de oude en nieuwe positie."
- needs: []
- exam_codes: [A2.15]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch]
- terms: []
- procedure:
  1. Teken de oorspronkelijke curve, label duidelijk (D of S).
  2. Teken de verschoven curve in een andere kleur of stippellijn, label als D' of S'.
  3. Plaats pijlen bij twee representatieve punten op de oude curve die naar de nieuwe curve wijzen — pijlen horizontaal, want hoeveelheid bij gelijke prijs verandert.
  4. Geef het oude en nieuwe evenwichtspunt aan (E en E').
- pitfalls:
  - Verticale pijlen gebruiken — verschuiving is een hoeveelheidsverandering bij gelijke prijs, dus horizontaal.
  - Alleen de nieuwe curve tekenen zonder de oude — een verschuivingsbeeld vereist beide.
- generator: GEN_A42

### A43 Totale winst uit gemengde allocatie berekenen
- kern: "Bereken de totale winst van een verdeling van beperkte middelen over meerdere activiteiten door per activiteit (hoeveelheid × winst/eenheid) te berekenen en op te tellen."
- needs: [B02]
- exam_codes: [A2.1]
- mastery_target: apply
- prior_learning: previously_taught
- aspects: [rekenen]
- terms: []
- procedure:
  1. Lees per activiteit de hoeveelheid middelen en de winst per eenheid af.
  2. Bereken voor elke activiteit: hoeveelheid × winst per eenheid.
  3. Tel de uitkomsten op voor de totale winst.
  4. Vergelijk met andere verdelingen om de beste keuze te bepalen.
- pitfalls:
  - Winst per eenheid verwarren met totale opbrengst — winst is opbrengst minus kosten.
  - De som van niet-gekozen alternatieven optellen — alleen de daadwerkelijk gekozen activiteiten tellen voor de totale winst.
- generator: GEN_A43

### A44 Individuele stapfunctie-vraagcurve tekenen uit betalingsbereidheid
- kern: "Teken de individuele vraagcurve van één consument als een stapfunctie: voor elke eenheid een horizontale stap op de hoogte van de betalingsbereidheid voor die eenheid."
- needs: [D35]
- exam_codes: [A2.14, D1.2]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch]
- terms: [betalingsbereidheid]
- procedure:
  1. Zet prijs P op de verticale as en hoeveelheid Q op de horizontale as.
  2. Teken voor elke eenheid (1e, 2e, ...) een horizontale streep ter hoogte van de bijbehorende betalingsbereidheid.
  3. De stappen dalen van links naar rechts als de betalingsbereidheid per extra eenheid afneemt.
  4. De resulterende trapsgewijze lijn is de individuele vraagcurve.
- pitfalls:
  - Een rechte (lineaire) vraagcurve tekenen — bij individuele, per-eenheid-gedefinieerde betalingsbereidheid is de curve trapsgewijs.
  - Assen verwisselen (P op horizontale as) tegen de economische conventie.
- generator: GEN_A44

### A45 P-Q grafiek tekenen uit tabel
- kern: "Teken een prijs-hoeveelheidsgrafiek uit tabelwaarden met prijs op de verticale as en hoeveelheid op de horizontale as."
- needs: []
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch]
- terms: []
- assumed_prior_knowledge: [Coordinatenstelsel uit de onderbouw]
- zero_needs_status: underbouw_assumed
- zero_needs_review: {"reviewed_on":"2026-04-28","reviewer":"human R4.4 review","rationale":"Approved as a missing graph-instrument root before analytical demand/supply graph work.","recommended_needs":[],"severity":"low"}
- procedure:
  1. Zet prijs op de verticale as en hoeveelheid op de horizontale as.
  2. Kies een passende schaal op beide assen.
  3. Plaats elk punt uit de tabel in de grafiek.
  4. Verbind de punten alleen als de context een lijn of curve ondersteunt.
- pitfalls:
  - Assen omdraaien: in economie staat P meestal verticaal en Q horizontaal.
- generator: GEN_A45

### A46 Waarden aflezen en interpoleren in P-Q grafiek
- kern: "Lees prijs- en hoeveelheidswaarden af uit een P-Q grafiek en schat tussenliggende waarden door interpolatie."
- needs: [A45]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen]
- terms: []
- procedure:
  1. Zoek de gegeven prijs of hoeveelheid op de juiste as.
  2. Ga horizontaal of verticaal naar de grafiek.
  3. Lees de bijbehorende waarde op de andere as af.
  4. Schat tussen twee bekende punten lineair als de opdracht om een benadering vraagt.
- generator: GEN_A46

### A47 Collectieve vraag uit tabellen optellen
- kern: "Bereken collectieve vraag door individuele gevraagde hoeveelheden bij dezelfde prijs op te tellen."
- needs: [A46]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, grafisch]
- terms: []
- procedure:
  1. Neem een prijsniveau dat in alle individuele vraagtabellen voorkomt.
  2. Lees per vrager de gevraagde hoeveelheid af.
  3. Tel de hoeveelheden horizontaal op tot de collectieve vraag.
  4. Herhaal dit voor meerdere prijzen om een collectieve vraagtabel of grafiek te maken.
- generator: GEN_A47

### A48 Collectieve vraagfunctie algebraisch optellen
- kern: "Tel lineaire individuele vraagfuncties horizontaal op door bij dezelfde prijs de gevraagde hoeveelheden te sommeren."
- needs: [A03, A47]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, grafisch]
- terms: []
- procedure:
  1. Schrijf elke individuele vraagfunctie als Q in termen van P.
  2. Tel de Q-termen bij elkaar op.
  3. Vereenvoudig de uitdrukking tot een collectieve vraagfunctie.
  4. Controleer of het prijsbereik van de individuele functies geldig blijft.
- generator: GEN_A48

### A49 Aanbodcurve tekenen met economenassen
- kern: "Teken een stijgende aanbodcurve met prijs op de verticale as en aangeboden hoeveelheid op de horizontale as."
- needs: [A45]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch]
- terms: []
- procedure:
  1. Zet P op de verticale as en Qa op de horizontale as.
  2. Plaats de aanbodpunten uit tabel of functie.
  3. Teken de aanbodcurve stijgend als hogere prijzen tot meer aanbod leiden.
  4. Label de curve als aanbod of S.
- generator: GEN_A49

### A50 GVK en GCK berekenen
- kern: "Bereken gemiddelde variabele kosten en gemiddelde constante kosten uit totale kosten en productiehoeveelheid."
- needs: [A08]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: []
- procedure:
  1. Splits totale kosten in constante kosten en variabele kosten.
  2. Bereken GCK = TCK / Q.
  3. Bereken GVK = TVK / Q.
  4. Controleer dat GTK = GCK + GVK.
- generator: GEN_A50

### A51 Overschot en tekort bij niet-evenwichtsprijs berekenen
- kern: "Bepaal bij een opgelegde prijs of er een overschot of tekort ontstaat en bereken de omvang als verschil tussen Qa en Qv."
- needs: [A06]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen]
- terms: []
- procedure:
  1. Lees bij de opgelegde prijs de gevraagde hoeveelheid af.
  2. Lees bij dezelfde prijs de aangeboden hoeveelheid af.
  3. Vergelijk Qa en Qv.
  4. Bereken het verschil en benoem overschot als Qa groter is dan Qv en tekort als Qv groter is dan Qa.
- generator: GEN_A51

### A52 MK en MO uit tabelverschillen berekenen
- kern: "Bereken marginale kosten en marginale opbrengsten uit opeenvolgende verschillen in een tabel."
- needs: [A08]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: []
- procedure:
  1. Neem twee opeenvolgende productiehoeveelheden.
  2. Bereken de verandering in totale kosten of totale opbrengsten.
  3. Deel door de verandering in Q.
  4. Noteer de uitkomst als MK of MO bij het bijbehorende productie-interval.
- generator: GEN_A52

### A53 MK benaderen uit kwadratische TK-functie
- kern: "Gebruik de precalculus-regel dat bij TK = a + bQ² de marginale kosten ongeveer gelijk zijn aan 2bQ."
- needs: [A52]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: []
- procedure:
  1. Herken de kwadratische term bQ² in de TK-functie.
  2. Neem twee keer de coefficient b.
  3. Vermenigvuldig met Q.
  4. Gebruik de uitkomst als benadering van MK bij die hoeveelheid.
- generator: GEN_A53

### A54 Winstoptimum controleren met Q-1, Q en Q+1
- kern: "Controleer een voorgesteld winstoptimum door totale winst bij de naburige hoeveelheden Q-1 en Q+1 te vergelijken."
- needs: [A52]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: []
- procedure:
  1. Bereken totale winst bij Q.
  2. Bereken totale winst bij Q-1.
  3. Bereken totale winst bij Q+1.
  4. Kies de hoeveelheid met de hoogste totale winst.
- generator: GEN_A54

### A55 Gevraagde hoeveelheid voorspellen met elasticiteit
- kern: "Bereken de procentuele verandering van de gevraagde hoeveelheid met prijselasticiteit en zet die om naar een nieuwe hoeveelheid."
- needs: [A15, A38]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: []
- procedure:
  1. Bepaal de procentuele verandering van de prijs of andere driver.
  2. Vermenigvuldig met de relevante elasticiteit.
  3. Pas de procentuele verandering toe op de beginsituatie van Qv.
  4. Controleer het teken: bij prijselasticiteit bewegen prijs en Qv meestal tegengesteld.
- generator: GEN_A55

### A56 Korte zijde bepalen bij bindende prijs
- kern: "Bepaal bij een bindende minimum- of maximumprijs welke marktzijde de verhandelde hoeveelheid beperkt."
- needs: [A51, D34]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen]
- terms: []
- procedure:
  1. Controleer of de opgelegde prijs bindend is.
  2. Lees Qv en Qa af bij de opgelegde prijs.
  3. Neem de kleinste van Qv en Qa als verhandelde hoeveelheid.
  4. Benoem welke zijde de korte zijde is.
- generator: GEN_A56

### A57 Afwentelingspercentage berekenen
- kern: "Bereken welk percentage van een heffing of kostenstijging wordt doorberekend in de prijs."
- needs: [A38, D34]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: []
- procedure:
  1. Bepaal de prijsstijging voor consumenten.
  2. Bepaal de heffing of kostenstijging per eenheid.
  3. Deel de prijsstijging door de heffing of kostenstijging.
  4. Vermenigvuldig met 100 procent.
- generator: GEN_A57

### A58 Subsidie-uitgaven berekenen
- kern: "Bereken totale subsidie-uitgaven als subsidie per eenheid maal de nieuwe verhandelde hoeveelheid."
- needs: [A04]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: []
- procedure:
  1. Bepaal de subsidie per eenheid.
  2. Bepaal de nieuwe verhandelde hoeveelheid.
  3. Vermenigvuldig subsidie per eenheid met Q nieuw.
  4. Noteer de totale overheidsuitgaven met juiste eenheid.
- generator: GEN_A58

### A59 Opkoopkosten bij minimumprijs berekenen
- kern: "Bereken wat de overheid betaalt als zij het overschot bij een minimumprijs opkoopt."
- needs: [A51, A56]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen]
- terms: []
- procedure:
  1. Bepaal het overschot bij de minimumprijs.
  2. Bepaal de prijs waartegen de overheid opkoopt.
  3. Vermenigvuldig overschot met opkoopprijs.
  4. Controleer of de vraagzijde niet als opkoophoeveelheid is gebruikt.
- generator: GEN_A59

### A60 Vraagfunctie inverteren bij quotumhoeveelheid
- kern: "Bereken welke prijs hoort bij een gegeven quotumhoeveelheid door de vraagfunctie om te schrijven."
- needs: [A03]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, grafisch]
- terms: []
- procedure:
  1. Neem de gevraagde hoeveelheid uit het quotum.
  2. Vul deze hoeveelheid in de vraagfunctie in.
  3. Los de vergelijking op naar P.
  4. Interpreteer P als de maximale prijs die bij het quotum past.
- generator: GEN_A60

### A61 Tabelwaarden selecteren voor berekening
- kern: "Selecteer in een economische tabel de waarden die nodig zijn voor een berekening: juiste rij, kolom, periode en oude/nieuwe waarde."
- needs: []
- mastery_target: apply
- prior_learning: review_and_extend
- aspects: [rekenen, verbaal]
- terms: []
- assumed_prior_knowledge: [basisvaardigheid tabel lezen uit de onderbouw]
- zero_needs_status: underbouw_assumed
- zero_needs_review: {"reviewed_on":"2026-04-29","reviewer":"Head of Content Strategy RX.2 gate","rationale":"Approved as an underbouw-assumed root because this is economic source-value selection for a calculation, not generic table reading.","recommended_needs":[],"severity":"low"}
- procedure:
  1. Lees eerst de vraag: welke grootheid, periode, rij of kolom heb je nodig?
  2. Zoek de juiste bron, tabelkop en eenheid.
  3. Selecteer de oude waarde, nieuwe waarde of gevraagde waarde voordat je rekent.
  4. Controleer of je totaal, gemiddelde, percentage of indexwaarde gebruikt.
  5. Noteer de gekozen waarden met label zodat de berekening controleerbaar is.
- pitfalls:
  - Een zichtbaar getal kiezen zonder te controleren of het bij de juiste rij of kolom hoort.
  - Totaalwaarden, gemiddelde waarden en procentwaarden door elkaar halen.
- generator: GEN_A61

### A62 Waarden aflezen uit staafdiagram
- kern: "Lees een waarde af uit een staafdiagram door context, labels, eenheid en schaal te controleren voordat je de staafhoogte gebruikt."
- needs: []
- mastery_target: apply
- prior_learning: review_and_extend
- aspects: [grafisch]
- terms: []
- assumed_prior_knowledge: [basisvaardigheid grafieken lezen uit de onderbouw]
- zero_needs_status: underbouw_assumed
- zero_needs_review: {"reviewed_on":"2026-04-30","reviewer":"Head of Content Strategy RX.2b gate","rationale":"Approved as an underbouw-assumed graphical-reading foundation only because the unit procedure explicitly teaches context/title, axis or legend labels, units, scale, exact versus estimated reading, and interpolation where relevant.","recommended_needs":[],"severity":"medium"}
- procedure:
  1. Lees de titel en bepaal de economische context van het staafdiagram.
  2. Bepaal welke variabele wordt weergegeven en in welke eenheid die staat.
  3. Controleer de categorie- of legendalabels zodat je de juiste staaf kiest.
  4. Controleer de schaal van de as, inclusief sprongen en of de as bij nul begint.
  5. Lees de hoogte van de gevraagde staaf af.
  6. Bepaal of de waarde exact kan worden afgelezen of dat je moet schatten tussen schaalstrepen.
- pitfalls:
  - Staven visueel vergelijken zonder de schaal of asbreuk te controleren.
  - Een staaf bij de verkeerde categorie of legenda aflezen.
- generator: GEN_A62

### A63 Waarden aflezen uit lijngrafiek
- kern: "Lees een punt of periode af uit een lijngrafiek door context, aslabels, eenheden, schaal en eventuele interpolatie expliciet te controleren."
- needs: []
- mastery_target: apply
- prior_learning: review_and_extend
- aspects: [grafisch]
- terms: []
- assumed_prior_knowledge: [basisvaardigheid grafieken lezen uit de onderbouw]
- zero_needs_status: underbouw_assumed
- zero_needs_review: {"reviewed_on":"2026-04-30","reviewer":"Head of Content Strategy RX.2b gate","rationale":"Approved as an underbouw-assumed graphical-reading foundation only because the unit procedure explicitly teaches context/title, axis or legend labels, units, scale, exact versus estimated reading, and interpolation where relevant.","recommended_needs":[],"severity":"medium"}
- procedure:
  1. Lees de titel en bepaal welke ontwikkeling of context de lijngrafiek toont.
  2. Bepaal welke variabelen op de horizontale en verticale as staan en noteer de eenheden.
  3. Controleer de labels, jaartallen of meetpunten die bij de vraag horen.
  4. Controleer de schaal op beide assen en let op ongelijke stappen of asbreuken.
  5. Lees het gevraagde punt of de gevraagde punten af.
  6. Bepaal of je exact afleest, schat tussen schaalstrepen, of interpoleert tussen twee punten.
- pitfalls:
  - Het verkeerde jaar of meetpunt gebruiken.
  - Een lijnstuk behandelen als totaal over een periode in plaats van als waarden op meetpunten.
- generator: GEN_A63

### A64 Aandelen aflezen uit cirkeldiagram
- kern: "Lees een aandeel uit een cirkeldiagram door context, categorie, legenda, totaal en de betekenis van procenten of delen te controleren."
- needs: []
- mastery_target: apply
- prior_learning: review_and_extend
- aspects: [grafisch, rekenen]
- terms: []
- assumed_prior_knowledge: [basisvaardigheid diagrammen lezen uit de onderbouw]
- zero_needs_status: underbouw_assumed
- zero_needs_review: {"reviewed_on":"2026-04-30","reviewer":"Head of Content Strategy RX.2b gate","rationale":"Approved as an underbouw-assumed graphical-reading foundation only because the unit procedure explicitly teaches context/title, axis or legend labels, units, scale, exact versus estimated reading, and interpolation where relevant.","recommended_needs":[],"severity":"medium"}
- procedure:
  1. Lees de titel en bepaal welk totaal het cirkeldiagram verdeelt.
  2. Bepaal welke categorie of legenda bij het gevraagde deel hoort.
  3. Controleer welke variabele, eenheid of meetgroep het diagram gebruikt.
  4. Controleer de schaal of verdeling van de sectoren: percentages, graden, breuken of alleen visuele delen.
  5. Controleer of er een totaalbedrag of totale hoeveelheid bij de bron hoort.
  6. Lees het aandeel van de gevraagde categorie af.
  7. Bepaal of het aandeel exact is gegeven of dat je het moet schatten uit de sector of legenda.
- pitfalls:
  - Een aandeel uit het cirkeldiagram behandelen als een absolute hoeveelheid.
  - Aandelen uit twee cirkeldiagrammen vergelijken zonder te controleren of de totalen gelijk zijn.
- generator: GEN_A64

### A65 Absolute hoeveelheid berekenen uit aandeel en totaal
- kern: "Bereken een absolute hoeveelheid door een aandeel uit een bron te vermenigvuldigen met het totale aantal, bedrag of volume."
- needs: [A64, A04]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen]
- terms: []
- procedure:
  1. Lees het aandeel uit de bron en zet het om naar een decimaal of breuk.
  2. Bepaal het totale aantal, bedrag of volume waarop het aandeel slaat.
  3. Controleer of aandeel en totaal bij dezelfde periode, groep en eenheid horen.
  4. Bereken absolute hoeveelheid = aandeel x totaal.
  5. Rond af op de manier die bij de context of vraag past.
- pitfalls:
  - Het percentage als geheel getal gebruiken, bijvoorbeeld 25 x totaal in plaats van 0,25 x totaal.
  - Een aandeel gebruiken dat bij een ander totaal of andere periode hoort.
- generator: GEN_A65

### A66 Basiswaarde en vergelijkingswaarde in bron bepalen
- kern: "Bepaal in een bron welke waarde de basiswaarde is en welke waarde de vergelijkingswaarde is voordat je een procentuele verandering berekent."
- needs: [A61]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: []
- procedure:
  1. Bepaal welke situatie eerder, oorspronkelijk of als basis geldt.
  2. Bepaal welke situatie nieuw, later of vergelijkend is.
  3. Label de basiswaarde als oud of basis en de vergelijkingswaarde als nieuw.
  4. Controleer of de vraag om stijging, daling of vergelijking vraagt.
  5. Gebruik de basiswaarde als noemer bij een procentuele verandering.
- pitfalls:
  - De nieuwe waarde als basiswaarde gebruiken.
  - De volgorde in de tekst volgen zonder te kijken welke situatie de basis is.
- generator: GEN_A66

### A67 Procentuele verandering berekenen vanuit tabel
- kern: "Bereken een procentuele verandering nadat je de oude en nieuwe waarde uit een tabel hebt geselecteerd."
- needs: [A38, A61, A66]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: []
- procedure:
  1. Selecteer in de tabel de oude waarde en de nieuwe waarde.
  2. Controleer de eenheid en of beide waarden dezelfde grootheid meten.
  3. Bereken de verandering: nieuwe waarde min oude waarde.
  4. Deel de verandering door de oude waarde.
  5. Vermenigvuldig met 100 procent en controleer teken en context.
- pitfalls:
  - De verkeerde tabelrij vergelijken.
  - Het absolute verschil als procentuele verandering noteren.
- generator: GEN_A67

### A68 Procentuele verandering berekenen vanuit staafdiagram
- kern: "Bereken een procentuele verandering nadat je de oude en nieuwe waarde uit een staafdiagram hebt afgelezen met de juiste basiswaarde."
- needs: [A38, A62, A66]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen]
- terms: []
- procedure:
  1. Lees de titel, variabele, eenheid, labels en schaal van het staafdiagram.
  2. Bepaal welke staaf de oude waarde is en welke staaf de nieuwe waarde is.
  3. Lees beide staafwaarden zo nauwkeurig mogelijk af.
  4. Controleer of beide waarden dezelfde grootheid en eenheid hebben.
  5. Bereken de verandering: nieuwe waarde min oude waarde.
  6. Deel de verandering door de oude waarde en vermenigvuldig met 100 procent.
- pitfalls:
  - De nieuwe waarde als noemer gebruiken.
  - Staafhoogtes visueel vergelijken zonder de as-schaal te gebruiken.
- generator: GEN_A68

### A69 Procentuele verandering berekenen vanuit lijngrafiek
- kern: "Bereken een procentuele verandering nadat je de oude en nieuwe waarde uit een lijngrafiek of tijdreeks hebt afgelezen."
- needs: [A38, A63, A66]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen]
- terms: []
- procedure:
  1. Lees de titel, assen, eenheden en schaal van de lijngrafiek.
  2. Bepaal welk punt de oude waarde is en welk punt de nieuwe waarde is.
  3. Lees beide waarden exact af, schat tussen schaalstrepen, of interpoleer als dat nodig is.
  4. Controleer of de periode en grootheid overeenkomen met de vraag.
  5. Bereken de verandering: nieuwe waarde min oude waarde.
  6. Deel door de oude waarde en vermenigvuldig met 100 procent.
- pitfalls:
  - Het verkeerde begin- of eindjaar nemen.
  - Indexpunten, absolute verandering en procentuele verandering door elkaar halen.
- generator: GEN_A69

### A70 Percentagepuntverandering in aandeel herkennen
- kern: "Herken een verandering in procentpunten tussen twee percentagewaarden en onderscheid die van een procentuele verandering."
- needs: [A38]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: []
- procedure:
  1. Lees de oude en nieuwe percentagewaarde.
  2. Bereken het verschil in procentpunten: nieuw percentage min oud percentage.
  3. Benoem de uitkomst als procentpunt of procentpunten.
  4. Controleer of de vraag toch een procentuele verandering vraagt.
  5. Gebruik A38 alleen wanneer de relatieve verandering van het percentage zelf gevraagd wordt.
- pitfalls:
  - Een stijging van 20% naar 25% als 5% benoemen in plaats van 5 procentpunt.
  - Procentpunten en procentuele veranderingen door elkaar gebruiken.
- generator: GEN_A70

### A72 Indexcijfer berekenen vanuit tabel
- kern: "Bereken een indexcijfer vanuit tabelwaarden door het doeljaar te delen door het basisjaar en te vermenigvuldigen met 100."
- needs: [A39, A61]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: []
- procedure:
  1. Selecteer in de tabel de waarde van het basisjaar.
  2. Selecteer de waarde van het doeljaar.
  3. Controleer dat beide waarden dezelfde mand, prijs of grootheid meten.
  4. Bereken index = waarde doeljaar / waarde basisjaar x 100.
  5. Controleer of het basisjaar op 100 staat.
- pitfalls:
  - Het doeljaar als basisjaar nemen.
  - Indexpunten verwarren met procentuele verandering.
- generator: GEN_A72

### A73 Indexverandering aflezen uit lijngrafiek
- kern: "Lees indexcijfers uit een lijngrafiek af en onderscheid een verandering in indexpunten van een procentuele verandering."
- needs: [A39, A63]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen]
- terms: []
- procedure:
  1. Lees de titel, assen, eenheden en schaal van de indexgrafiek.
  2. Bepaal het basisjaar en controleer dat dit op 100 staat of als basis wordt genoemd.
  3. Lees het oude en nieuwe indexcijfer uit de lijngrafiek af.
  4. Bereken de verandering in indexpunten door oud van nieuw af te trekken.
  5. Controleer of de vraag indexpunten of een procentuele verandering vraagt.
  6. Gebruik A74 als de vraag een procentuele verandering tussen indexcijfers vraagt.
- pitfalls:
  - Een indexpuntverandering direct als procentuele verandering benoemen.
  - Een indexgrafiek behandelen alsof de verticale as absolute eurobedragen toont.
- generator: GEN_A73

### A74 Procentuele verandering berekenen vanuit indexcijfers
- kern: "Bereken een procentuele verandering tussen twee indexcijfers door de verandering te delen door het oude indexcijfer."
- needs: [A38, A39, A66]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: []
- procedure:
  1. Bepaal welk indexcijfer de oude waarde is.
  2. Bepaal welk indexcijfer de nieuwe waarde is.
  3. Bereken het verschil tussen de indexcijfers.
  4. Deel het verschil door het oude indexcijfer.
  5. Vermenigvuldig met 100 procent en benoem het als procentuele verandering.
- pitfalls:
  - Alleen indexpunten aftrekken en dat percentage noemen.
  - Delen door 100 in plaats van door het oude indexcijfer.
- generator: GEN_A74

### A75 Totale winst berekenen uit opbrengsten- en kostentabel
- kern: "Bereken totale winst door TO en TK uit een opbrengsten- en kostentabel te selecteren en TO - TK toe te passen."
- needs: [A04, A61]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: []
- procedure:
  1. Lees welke hoeveelheid, periode of situatie de vraag bedoelt.
  2. Selecteer in de tabel de bijbehorende totale opbrengst TO.
  3. Selecteer in dezelfde rij of situatie de totale kosten TK.
  4. Bereken totale winst: TO min TK.
  5. Controleer of de uitkomst positief, nul of negatief is.
- pitfalls:
  - De hoogste opbrengst kiezen in plaats van de winst te berekenen.
  - Totale kosten verwarren met gemiddelde kosten.
  - TO en TK uit verschillende rijen vergelijken.
- generator: GEN_A75

### A76 Totale winst berekenen uit P, GTK en Q
- kern: "Bereken totale winst met TW = (P - GTK) x Q nadat je P, GTK en Q uit de producentengegevens hebt geselecteerd."
- needs: [A14, A04, A61]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: []
- procedure:
  1. Selecteer P, GTK en Q uit de bron, tabel, grafieklabels of casusgegevens.
  2. Controleer dat P en GTK bij dezelfde hoeveelheid Q horen.
  3. Bereken de winst per product: P min GTK.
  4. Vermenigvuldig de winst per product met Q.
  5. Controleer of P boven, gelijk aan of onder GTK ligt.
- pitfalls:
  - TK gebruiken in plaats van GTK.
  - De winstmarge P - GTK niet met Q vermenigvuldigen.
  - P, GTK en Q uit verschillende situaties combineren.
- generator: GEN_A76

### A79 Maximale winst bepalen uit TO-TK-tabel
- kern: "Bepaal de maximale winst door per hoeveelheid de winst uit een TO-TK-tabel te vergelijken."
- needs: [A75, A61]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: []
- procedure:
  1. Lees per hoeveelheid Q de totale opbrengst TO en totale kosten TK.
  2. Bereken of controleer per Q de winst: TO min TK.
  3. Vergelijk de winstwaarden per hoeveelheid.
  4. Kies de hoeveelheid met de hoogste winst.
  5. Controleer dat je niet de hoogste omzet of laagste kosten hebt gekozen.
- pitfalls:
  - De hoeveelheid met de hoogste TO kiezen in plaats van de hoogste winst.
  - Alleen naar kosten kijken en opbrengsten negeren.
  - Een negatieve winst als hoogste waarde verkeerd interpreteren.
- generator: GEN_A79

### B01 Schaarste als kerneconomisch probleem
- layer: 1
- kern: "Herken schaarste als de basisvoorwaarde van alle economische keuzes: middelen (tijd, geld, grondstoffen) zijn beperkt terwijl wensen onbeperkt zijn, waardoor keuzes onvermijdelijk zijn."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [schaarste]
- pitfalls:
  - Schaarste gelijkstellen aan "weinig" — lucht is weinig schaars, zand op het strand is plaatselijk niet schaars; wat telt is "beperkt ten opzichte van de vraag".
  - Schaarste alleen op geld betrekken — tijd, ruimte en grondstoffen zijn evengoed schaars en leiden tot alternatieve kosten.

### B02 Alternatieve kosten in een keuze-situatie
- kern: "Identificeer de alternatieve kosten van een keuze als de opbrengst van het beste niet-gekozen alternatief, en bereken deze expliciet wanneer de cijfers gegeven zijn."
- needs: [B01]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [verbaal, rekenen]
- terms: [alternatieve-kosten]
- procedure:
  1. Benoem alle beschikbare alternatieven voor de middelen (tijd, geld, grondstoffen).
  2. Bereken voor elk alternatief de opbrengst (of verwachte opbrengst).
  3. Rangschik de alternatieven; het niet-gekozen alternatief met de hoogste opbrengst zijn de alternatieve kosten.
  4. Vergelijk de opbrengst van de daadwerkelijke keuze met deze alternatieve kosten om de nettowaarde van de keuze te beoordelen.
- pitfalls:
  - Alle niet-gekozen alternatieven optellen — alternatieve kosten zijn alléén het beste niet-gekozen alternatief.
  - Engelse "opportunity costs" of "opportuniteitskosten" gebruiken in Nederlandse teksten — de canonical term is "alternatieve kosten".

### D01 Accijnsopbrengst uit grafiek
- kern: "Bepaal accijnsopbrengst door verhandelde hoeveelheid na belasting met belastingbedrag te vermenigvuldigen."
- needs: [D05]
- exam_codes: [D1.13, D3.9]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen, verbaal]
- terms: [heffingen]
- procedure:
  1. Lees de verhandelde hoeveelheid na heffing (Q_na) af op de horizontale as
  2. Lees het belastingbedrag per eenheid (t) af als verticale afstand tussen aanbod-met-heffing en oorspronkelijk aanbod
  3. Bereken accijnsopbrengst = t × Q_na
  4. Controleer de eenheid (bijvoorbeeld euro's per periode)

### D02 Constante kosten en winst
- layer: 1
- kern: "Constante kosten beïnvloeden break-even analyse maar niet het MO = MK optimum."
- needs: []
- exam_codes: [D1.16, D1.21]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [constante-kosten, winst]

### D03 Consumentensurplus en accijns
- kern: "Accijns verhoogt prijs, consumenten betalen meer, consumentensurplus daalt."
- needs: [D05, A30]
- exam_codes: [D3.1]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen, verbaal]
- terms: [consumentensurplus, marktevenwicht]
- procedure:
  1. Bepaal het oorspronkelijke consumentensurplus (CS_voor) als driehoek boven P* tot Pmax (zoals in A30)
  2. Bereken het nieuwe marktevenwicht na heffing (zoals in D05): nieuwe prijs P_na
  3. Bepaal het nieuwe consumentensurplus (CS_na) boven P_na
  4. Bereken de afname: ΔCS = CS_voor − CS_na
  5. Interpreteer wie het surplusverlies draagt

### D04 Elasticiteit en goederenclassificatie
- layer: 1
- kern: "Gebruik inkomenselasticiteit om goederen te classificeren als inferieur, normaal of luxe."
- needs: []
- exam_codes: [D1.7, D1.8]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [inkomenselasticiteit]

### D05 Evenwicht bij accijns
- kern: "Bereken nieuw evenwicht en accijnsopbrengst na invoering van een heffing."
- needs: [A23]
- exam_codes: [D1.13, D1.24]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [evenwichtshoeveelheid, evenwichtsprijs, heffingen, marktevenwicht]
- procedure:
  1. Schrijf de aanbodfunctie om naar P als functie van Q
  2. Verhoog de prijsterm met het heffingsbedrag t: P_aanbod_nieuw = P_aanbod_oud + t
  3. Schrijf terug naar Q als functie van P en stel gelijk aan de vraagfunctie (zoals in A06)
  4. Los op naar P* (nieuwe evenwichtsprijs) en bereken Q* (nieuwe evenwichtshoeveelheid)
  5. Bereken accijnsopbrengst = t × Q*

### D06 Vraagreactie via prijselasticiteit interpreteren
- layer: 2
- kern: "Gebruik de prijselasticiteit van de vraag (Ev) om te voorspellen hoe Qv reageert op een prijsverandering en verklaar het resultaat in context."
- needs: [A15]
- exam_codes: [D1.3]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [prijselasticiteit-van-de-vraag]

### D07 Heffing doorberekenen in prijs
- kern: "Bereken welk percentage van een heffing wordt doorberekend in de consumentenprijs via evenwichtsanalyse."
- needs: [D05, A15]
- exam_codes: [D1.4a]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [evenwichtsprijs, heffingen]
- procedure:
  1. Bepaal de evenwichtsprijs zonder heffing (P0)
  2. Bereken het nieuwe evenwicht met heffing t (zoals in D05): consumentenprijs Pc en producentenprijs Pp = Pc − t
  3. Bereken doorberekening aan consument = (Pc − P0) / t × 100%
  4. Het restant (100% − dit percentage) komt ten laste van de producent
  5. Leg uit hoe de elasticiteit van vraag en aanbod de verdeling bepaalt

### D08 Heffing tegen overconsumptie
- kern: "Analyseer of een heffing overconsumptie tegengaat via veranderde vraag."
- needs: [A15]
- exam_codes: [D1.4a]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [heffingen]
- procedure:
  1. Identificeer het overconsumptieprobleem: benoem het externe effect en waarom de marktuitkomst te hoog ligt
  2. Bepaal het nieuwe evenwicht met heffing t zoals in D05 (nieuwe Pc, Pp en Q*)
  3. Bereken de procentuele vraagreductie ΔQ/Q0 en vergelijk die met de prijselasticiteit Ev uit A15
  4. Beoordeel of de vraagreductie groot genoeg is om de gewenste afname van overconsumptie te halen
  5. Verwoord een conclusie: werkt de heffing voldoende, en welke rol speelt de (in)elasticiteit van de vraag

### D09 Homogene en heterogene goederen
- layer: 1
- kern: "Homogene goederen zijn identiek; heterogene goederen verschillen in kwaliteit of kenmerken."
- needs: []
- exam_codes: [D2.1]
- mastery_target: understand
- prior_learning: previously_taught
- aspects: [verbaal]
- terms: [homogeen-goed, heterogene-goederen]

### D10 Vraag/aanbod-verschuiving bij conjunctuurschok
- layer: 3
- kern: "Analyseer hoe een conjunctuurschok de collectieve vraaglijn of aanbodlijn verschuift en wat dit doet met evenwichtsprijs en -hoeveelheid."
- needs: [A06, D33]
- exam_codes: [D1.24, D1.4b]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [collectieve-aanbodlijn, collectieve-vraaglijn, evenwichtsprijs]
- procedure:
  1. Identificeer de schok en benoem welk kanaal loopt: beïnvloedt die de collectieve vraaglijn of de collectieve aanbodlijn
  2. Beredeneer de richting van de verschuiving (naar links of naar rechts) en onderbouw met het onderliggende gedrag van consumenten of producenten
  3. Teken de verschuiving in het P-Q-diagram en lees de nieuwe evenwichtsprijs en evenwichtshoeveelheid af (methode uit A06)
  4. Vergelijk oud en nieuw evenwicht: benoem de verandering in P* en Q* in tekens en orde van grootte
  5. Verklaar het resultaat in de context van de conjunctuurschok (hoogconjunctuur of laagconjunctuur)

### D11 Inkomenselasticiteit berekenen en interpreteren
- kern: "Bereken Ei uit twee waarnemingen en interpreteer de uitkomst in de context van het goed."
- needs: [A17]
- exam_codes: [D1.7, D1.8]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [inkomenselasticiteit]
- procedure:
  1. Bepaal Q voor en na de inkomensverandering (Q1, Q2) en het inkomen (Y1, Y2)
  2. Bereken %ΔQ = (Q2 − Q1) / Q1 × 100% en %ΔY = (Y2 − Y1) / Y1 × 100%
  3. Bereken Ei = %ΔQ / %ΔY
  4. Classificeer: Ei < 0 inferieur, 0 < Ei < 1 normaal, Ei > 1 luxe
  5. Verwoord de interpretatie voor de context (bijvoorbeeld huurwoningen)

### D12 Kruiselasticiteit en substituten
- kern: "Bepaal uit kruiselasticiteit of goederen substituten zijn en analyseer vraagverschuivingen."
- needs: [A16]
- exam_codes: [D1.9]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [substitueerbaarheid]
- procedure:
  1. Bepaal Qa van goed A voor en na de prijsverandering van goed B en de prijzen Pb1, Pb2
  2. Bereken %ΔQa en %ΔPb
  3. Bereken Ekr = %ΔQa / %ΔPb
  4. Classificeer: Ekr > 0 substituten, Ekr < 0 complementen, Ekr ≈ 0 ongerelateerd
  5. Leg uit in welke richting de vraaglijn van A verschuift bij een prijsverandering van B

### D13 Kostenstijging en aanbodverschuiving
- layer: 3
- kern: "Analyseer hoe een stijging van productiekosten (zoals loon per eenheid product) de collectieve aanbodlijn verschuift en doorwerkt in evenwichtsprijs."
- needs: [A06, D33]
- exam_codes: [D1.12, D1.24]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [collectieve-aanbodlijn, evenwichtsprijs]
- procedure:
  1. Identificeer de kostenstijging en benoem of die per eenheid product is (bv. loon per eenheid) of een vaste component
  2. Beredeneer dat hogere variabele kosten de collectieve aanbodlijn verticaal omhoog en dus naar links verschuiven
  3. Teken de verschuiving en bepaal het nieuwe evenwicht (zoals in A06): lees P* en Q* af
  4. Vergelijk oud en nieuw evenwicht: prijs stijgt, hoeveelheid daalt; bereken de procentuele veranderingen
  5. Beoordeel de doorwerking: welk deel van de kostenstijging wordt doorberekend aan consumenten en welk deel drukt op de producent

### D14 Marktfalen en overheidsinterventie beoordelen
- layer: 6
- kern: "Beoordeel of marktwerking tot een doelmatige uitkomst leidt en of overheidsinterventie gerechtvaardigd is."
- needs: [F18, F02, G02, A35, D28]
- exam_codes: [D3.4, D3.9]
- mastery_target: evaluate
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [marktmacht]
- procedure:
  1. Identificeer het type marktfalen (externe effecten, marktmacht, collectief goed of informatieasymmetrie) en beschrijf het mechanisme
  2. Benoem de beoordelingscriteria: economische doelmatigheid (efficiëntie), rechtvaardigheid (verdeling) en mate van externe effecten
  3. Toets de huidige marktuitkomst aan elk criterium: bereken of beredeneer het welvaartsverlies en de verdelingseffecten
  4. Beoordeel het voorgestelde overheidsinstrument (heffing, subsidie, regulering) aan dezelfde criteria en betrek uitvoeringskosten en neveneffecten
  5. Vergelijk de situatie met en zonder ingrijpen en formuleer een onderbouwd verdict: is ingrijpen gerechtvaardigd, en zo ja welke vorm heeft de voorkeur

### D15 Marktvormen classificeren
- layer: 1
- kern: "Classificeer markten aan hand van aantal aanbieders, aard van goederen en toetreding."
- needs: []
- exam_codes: [D2.1]
- mastery_target: understand
- prior_learning: previously_taught
- aspects: [verbaal]
- terms: [marktvormen]

### D16 Minimumprijs en werkloosheid
- layer: 3
- kern: "Minimumloon boven marktloon veroorzaakt vraagoverschot van arbeid en werkloosheid."
- needs: [D34, L10]
- exam_codes: [D3.10, H5.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [minimumprijzen]

### D17 Monopolie minimaal verlies
- kern: "Onderneming met alleen vaste kosten heeft MK = 0, dus MK = GVK. Minimaal verlies waar prijs totale opbrengst dekt."
- needs: [A14]
- exam_codes: [D2.2, D1.19]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [marginale-kosten, totale-opbrengst]

### D18 Monopolie met prijsdiscriminatie
- kern: "Bepaal hoe monopolist winst behaalt via prijsdiscriminatie over verschillende markten."
- needs: [D24, A36]
- exam_codes: [D2.3]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [prijsdiscriminatie, winst]
- procedure:
  1. Stel de twee deelmarkten op met eigen vraagfuncties en gemeenschappelijke MK
  2. Bepaal MO per deelmarkt en los MO1 = MK en MO2 = MK op (zoals in A36)
  3. Bepaal per deelmarkt de prijs Pi via de eigen vraagfunctie
  4. Bereken TO = P1·Q1 + P2·Q2 en W = TO − TK
  5. Vergelijk met de winst zonder prijsdiscriminatie om de meerwinst te laten zien

### D19 Subsidie en Pareto-efficiëntie
- kern: "Leg uit of een subsidie-evenwicht Pareto-efficiënt is."
- needs: [D20, A27]
- exam_codes: [D3.5, D3.9]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [pareto-efficient, subsidies]

### D20 Pareto-efficiëntie in marktevenwicht
- kern: "Leg uit wanneer een marktevenwicht Pareto-efficiënt is."
- needs: [A19]
- exam_codes: [D3.5]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [pareto-efficient, marktevenwicht]

### D21 Prijsdiscriminatie over inkomensgroepen
- kern: "Analyseer hoe bedrijven prijzen differentieren en welvaartsgevolgen per inkomensgroep."
- needs: [D18, D28]
- exam_codes: [D2.3]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [prijsdiscriminatie, totale-surplus]
- procedure:
  1. Identificeer de inkomensgroepen en hun vraagfuncties (lage vs. hoge Ev)
  2. Bereken prijs en hoeveelheid per groep bij prijsdiscriminatie (zoals in D18)
  3. Bepaal CS per groep en vergelijk met de situatie zonder prijsdiscriminatie
  4. Benoem welke groep welvaartswinst of -verlies ondervindt
  5. Beoordeel de herverdelende gevolgen in termen van totale surplus

### D22 Prijsdiscriminatie en subsidies
- kern: "Herken of subsidies prijsdiscriminatie veroorzaken en analyseer gevolgen."
- needs: [D24, A27]
- exam_codes: [D2.3]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [prijsdiscriminatie, subsidies]

### D23 Voorwaarden voor prijsdiscriminatie
- kern: "Prijsdiscriminatie vereist marktscheiding en verschillende betalingsbereidheid."
- needs: []
- exam_codes: [D2.3]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [betalingsbereidheid, prijsdiscriminatie]
- deprecated: true
- deprecated_in_favor_of: [D24]

### D24 Drie voorwaarden prijsdiscriminatie
- layer: 2
- kern: "Leg uit de drie voorwaarden voor prijsdiscriminatie: voldoende marktmacht, scheidbare deelmarkten met verschillende prijselasticiteiten en betalingsbereidheid."
- needs: [D35, D15]
- exam_codes: [D2.3]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [betalingsbereidheid, marktmacht, prijsdiscriminatie]

### D25 Prijselasticiteit en omzet
- kern: "Bij inelastische vraag leidt grotere hoeveelheid tot lagere prijs; totale omzet kan dalen."
- needs: [A15]
- exam_codes: [D1.15]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [prijselasticiteit-van-de-vraag, totale-opbrengst]

### D26 Soorten variabele kosten classificeren
- kern: "Onderscheid tussen degressief, progressief en proportioneel variabele kosten."
- needs: [A08]
- exam_codes: [D1.17]
- mastery_target: understand
- prior_learning: previously_taught
- aspects: [verbaal]
- terms: [variabele-kosten]

### D27 Substituten en complementen
- layer: 1
- kern: "Substituten vervangen elkaar; complementen worden samen gebruikt."
- needs: []
- exam_codes: [D1.9]
- mastery_target: understand
- prior_learning: previously_taught
- aspects: [verbaal]
- terms: [complementariteit, substitueerbaarheid]

### D28 Welvaart en surplus-effect
- kern: "Prijsverlaging verhoogt consumentensurplus; effect op producentensurplus verschilt per geval."
- needs: [A19, A30]
- exam_codes: [D3.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [consumentensurplus, producentensurplus]

### D29 Welvaartsverlies bij subsidie
- kern: "Bepaal en arceer het deadweight loss ontstaan door subsidies als gevolg van allocatieve inefficientie."
- needs: [A32]
- exam_codes: [D3.1]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen]
- terms: [subsidies, verloren-surplus]
- procedure:
  1. Teken vraag- en aanbodlijn en markeer het oorspronkelijke evenwicht (P*, Q*)
  2. Verschuif de aanbodlijn omlaag met het subsidiebedrag s en bepaal Q_na
  3. Identificeer de welvaartsverliesdriehoek: hoekpunten bij Q*, Q_na en de twee curves
  4. Arceer het driehoekje tussen vraag en oorspronkelijk aanbod, tussen Q* en Q_na
  5. Bereken de oppervlakte = ½ × (Q_na − Q*) × s

### D30 Winstmaximalisatie MO = MK
- kern: "Winstmaximale hoeveelheid vind je waar marginale opbrengst gelijk is aan marginale kosten."
- needs: [A12, A13, A20]
- exam_codes: [D1.21]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [marginale-kosten, marginale-opbrengsten, winst]
- procedure:
  1. Bepaal MO uit de TO-functie (zoals in A12)
  2. Bepaal MK uit de TK-functie (zoals in A13)
  3. Stel MO = MK en los op naar Q (zoals in A20)
  4. Vul Q in de vraagfunctie (of GO-functie) om de prijs P te bepalen
  5. Bereken de winst W = TO − TK bij deze Q

### D31 Indexpunt versus procentuele verandering
- kern: "Onderscheid een indexpunt-verandering (absoluut verschil tussen twee indexcijfers) van een procentuele verandering (relatief verschil); beide kunnen leiden tot totaal andere conclusies bij hoge indexwaarden."
- needs: [A38, A39]
- exam_codes: [A2.5]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal, rekenen]
- terms: []
- pitfalls:
  - Indexpunten als procenten interpreteren: "CPI steeg van 108 naar 112, dus 4 % inflatie" is fout — het is (4/108)·100 ≈ 3,7 %.
  - Bij inflatievragen altijd A38 toepassen op de indexwaarden, niet het verschil gebruiken.

### D32 Verschuiving versus beweging langs de curve
- layer: 1
- kern: "Onderscheid een beweging langs de vraag- of aanbodcurve (veroorzaakt door eigen-prijsverandering) van een verschuiving van de curve (veroorzaakt door een andere factor dan eigen prijs)."
- needs: []
- exam_codes: [D1.4a, D1.4b]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal, grafisch]
- terms: []
- pitfalls:
  - De prijs van het goed zelf noemen als verschuivingsfactor — eigen prijs is altijd een BEWEGING langs, nooit een verschuiving.
  - Verschuiving en beweging door elkaar halen in grafiek: bij een verschuiving verplaatst de hele curve; bij een beweging blijft de curve staan.

### D33 Vraag- en aanbodverschuivingsfactoren benoemen
- kern: "Noem en herken de standaard verschuivingsfactoren: voor vraag (inkomen, voorkeuren, prijzen substituten/complementen, verwachtingen) en voor aanbod (inputprijzen, technologie, aantal aanbieders, verwachtingen, overheidsbeleid)."
- needs: [D32]
- exam_codes: [D1.4b]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []
- pitfalls:
  - De eigen prijs als verschuivingsfactor opschrijven (zie D32 — diagnostiek voor het verschil).
  - Substituten en complementen verwisselen: als de prijs van een substituut stijgt, stijgt de vraag naar dit goed (rechtswaartse verschuiving); bij complementen is het omgekeerd.

### D34 Bindende prijsregulering: voorwaarde voor effect
- kern: "Herken dat een maximumprijs alleen effect heeft als deze onder het evenwicht ligt, en een minimumprijs alleen als deze erboven ligt; anders is de regulering niet-bindend en heeft geen invloed op uitkomst."
- needs: [A06]
- exam_codes: [D3.10, D3.9]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal, grafisch]
- terms: []
- pitfalls:
  - Een niet-bindende prijsregulering als bindend behandelen en toch tekorten / overschotten berekenen — als max boven of min onder het evenwicht ligt, is er niets aan de hand.
  - Vergeten te controleren of de regulering bindend is voordat je welvaartsberekeningen start.

### D35 Betalingsbereidheid definiëren
- layer: 1
- kern: "Definieer betalingsbereidheid als de maximale prijs die een consument bereid is te betalen voor één extra eenheid van een goed; deze kan dalen naarmate meer eenheden al gekocht zijn."
- needs: []
- exam_codes: [D1.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [betalingsbereidheid]
- pitfalls:
  - Betalingsbereidheid gelijkstellen aan "wat iemand gewoonlijk betaalt" — het is de maximale prijs, niet de marktprijs.
  - Vergeten dat betalingsbereidheid per eenheid kan verschillen — de eerste eenheid heeft vaak een hogere betalingsbereidheid dan de derde.

### D36 Beslisregel: koop als P ≤ betalingsbereidheid
- kern: "Pas de consumentenbeslissingsregel toe: een consument koopt een extra eenheid precies dan wanneer zijn betalingsbereidheid voor die eenheid ≥ de marktprijs P; gebruik dit om de individuele vraag bij een gegeven P te bepalen."
- needs: [D35]
- exam_codes: [D1.1, D1.2]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [verbaal, rekenen]
- terms: [betalingsbereidheid]
- procedure:
  1. Lees de betalingsbereidheid per eenheid af uit de gegevens.
  2. Vergelijk elke betalingsbereidheid met de gegeven marktprijs P.
  3. Tel het aantal eenheden waarvoor betalingsbereidheid ≥ P — dat is de gevraagde hoeveelheid van deze consument bij prijs P.
  4. Controleer: daalt P, dan stijgt (of blijft gelijk) de gevraagde hoeveelheid.
- pitfalls:
  - Alleen de eerste eenheid checken — de regel moet op elke eenheid apart worden toegepast.
  - De consument koopt niet als P = betalingsbereidheid: hij is dan precies indifferent; de regel is P ≤ betalingsbereidheid (gelijkheid telt mee).

### D37 Wet van de vraag verbaal uitleggen
- kern: "Leg uit waarom de vraagcurve dalend is: bij een lagere prijs vinden meer consumenten het waardevol om te kopen (hun betalingsbereidheid overschrijdt de prijs), en individuele consumenten zijn bereid meer eenheden te kopen doordat hun dalende betalingsbereidheid dan nog steeds boven P ligt."
- needs: [D35, D36]
- exam_codes: [D1.2, D1.4a]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []
- pitfalls:
  - De wet van de vraag alleen als "regel" leren zonder uitleg — een goed antwoord legt uit WAAROM, via betalingsbereidheid of afnemend grensnut.
  - Verwarren met een verschuiving: de wet van de vraag betreft een beweging langs de curve (eigen-prijseffect), niet een verschuiving.

### D38 GCK daalt door spreiding van constante kosten
- kern: "Leg uit dat gemiddelde constante kosten dalen wanneer dezelfde constante kosten over meer producten worden verdeeld."
- needs: [D02, A50]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal, rekenen]
- terms: []
- pitfalls:
  - GCK verwarren met totale constante kosten: TCK blijven gelijk, GCK dalen bij hogere Q.

### D39 Totale surplus als CS plus PS
- kern: "Bereken totale surplus als de som van consumentensurplus en producentensurplus."
- needs: [D28]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen]
- terms: []
- procedure:
  1. Bepaal consumentensurplus.
  2. Bepaal producentensurplus.
  3. Tel beide bedragen op.
  4. Controleer of beide surplusdelen dezelfde eenheid hebben.

### D40 Surplusrekening bij marktinterventie controleren
- kern: "Controleer of de veranderingen in surplus, overheidsinkomsten of -uitgaven en verloren surplus samen consistent zijn."
- needs: [D39]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [grafisch, rekenen]
- terms: []
- procedure:
  1. Noteer de beginsituatie voor consumentensurplus en producentensurplus.
  2. Noteer de nieuwe surplusdelen na de interventie.
  3. Voeg overheidsinkomsten of overheidsuitgaven toe.
  4. Controleer of het verschil overeenkomt met het verloren of gewonnen surplus.

### E01 Intergenerationele ruil
- kern: "Analyseer hoe pensioenstelsels intergenerationele ruil faciliteren."
- needs: [E02]
- exam_codes: [E2.1]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [intertemporele-ruil]
- procedure:
  1. Benoem de twee generaties in het stelsel: de huidige premiebetalers (werkenden) en de huidige uitkeringsontvangers (gepensioneerden)
  2. Beschrijf de geldstroom: wie betaalt premie, wie ontvangt pensioen, en op welk moment
  3. Leg uit hoe deze betaling later wordt teruggeruild: de huidige werkenden verwachten zelf een uitkering van de volgende generatie
  4. Analyseer de voorwaarden waaronder de ruil in evenwicht blijft (demografie, loonontwikkeling, rendement) — koppel aan intertemporele ruil uit E02
  5. Verwoord welke generatie voor- of nadeel heeft bij een schok (bv. vergrijzing of recessie)

### E02 Intertemporele ruil in pensioenstelsels
- layer: 1
- kern: "Leg uit hoe pensioenen ruil over tijd vertegenwoordigen."
- needs: []
- exam_codes: [E1.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [intertemporele-ruil]

### E03 Kapitaaldekking en renteeffecten
- kern: "Analyseer hoe rentes de betaalbaarheid van kapitaalgedekte pensioenen onder druk zetten."
- needs: [E02, H15]
- exam_codes: [E1.1]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [rente, waardevaste-pensioenen, welvaartsvaste-pensioenen]
- procedure:
  1. Beschrijf kort het kapitaaldekkingsstelsel: premies worden belegd en het rendement betaalt de latere uitkering
  2. Identificeer de rol van de rente: bepaal hoe lagere rentes de verdisconteerde waarde van toekomstige verplichtingen verhogen (zie H15)
  3. Analyseer het effect op de dekkingsgraad: bij lagere rente stijgen de verplichtingen terwijl het vermogen niet meestijgt
  4. Beoordeel de gevolgen voor premiebetalers (hogere premie nodig) en uitkeringsontvangers (risico op niet-indexeren van waardevaste of welvaartsvaste pensioenen)
  5. Concludeer of het stelsel betaalbaar blijft of dat aanpassing nodig is

### E04 Omslagstelsel (AOW)
- kern: "Omslagstelsel: werkenden betalen premie voor huidige uitkeringen; gevoelig voor vergrijzing."
- needs: [E01, E02]
- exam_codes: [E2.1]
- mastery_target: understand
- prior_learning: previously_taught
- aspects: [verbaal]
- terms: [welvaartsvaste-pensioenen]

### E05 Pensioenkorting en intergenerationele solidariteit
- kern: "Analyseer hoe een korting op pensioenuitkeringen de solidariteit tussen jongere premiebetalers en oudere ontvangers beïnvloedt."
- needs: [E04, H01]
- exam_codes: [E2.1]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [waardevaste-pensioenen, welvaartsvaste-pensioenen]
- procedure:
  1. Identificeer de twee groepen: jongere premiebetalers en oudere uitkeringsontvangers in het omslagstelsel
  2. Beschrijf de pensioenkorting: met hoeveel procent daalt de nominale uitkering, en hoe werkt dat op de koopkracht via de inflatie
  3. Analyseer het effect op de ontvangers: daling van besteedbaar inkomen en reële uitkering (waardevast/welvaartsvast wordt losgelaten)
  4. Analyseer het effect op de premiebetalers: blijft de premie stabiel of daalt die mee, en wat betekent dat voor de intergenerationele lastenverdeling
  5. Beoordeel of de korting de solidariteit tussen generaties versterkt of ondermijnt en onderbouw de conclusie

### E06 Voorraad- en stroomgrootheden onderscheiden
- layer: 1
- kern: "Onderscheid tussen voorraad- en stroomgrootheden."
- needs: []
- exam_codes: [E1.8]
- mastery_target: understand
- prior_learning: previously_taught
- aspects: [verbaal]
- terms: [voorraad-en-stroomgrootheden]

### E07 Koop- versus huurlasten vergelijken
- kern: "Vergelijk netto woonlasten van kopen en huren door rente, aflossing, onderhoud en huurprijs systematisch tegen elkaar af te zetten."
- needs: [E02, H15]
- exam_codes: [E1.1, E1.3]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [rente]
- procedure:
  1. Inventariseer per optie de kostencategorieën: bij kopen (hypotheekrente, aflossing, onderhoud, eigenaarslasten) en bij huren (kale huur, servicekosten)
  2. Bereken voor beide opties de netto maandlasten over een vaste periode (bv. 1 jaar), inclusief fiscale effecten
  3. Corrigeer voor vermogensopbouw bij kopen (aflossingsdeel is geen kostenpost maar besparing) en voor verwachte waardegroei van de woning
  4. Voer gevoeligheidsanalyse uit op de rente (zie H15) en de huurontwikkeling: welke aanname verschuift de uitkomst
  5. Vergelijk de netto woonlasten systematisch per categorie en concludeer onder welke voorwaarden kopen goedkoper is dan huren

### F01 Berovingsprobleem herkennen
- layer: 1
- kern: "Bij relatiespecifieke investeringen loopt de investerende partij het risico dat de ander na de investering het contract heronderhandelt of verbreekt."
- needs: []
- exam_codes: [F2.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [berovingsprobleem, contracten-en-prikkels, investeringen, risico]

### F02 Collectief goed classificeren
- layer: 1
- kern: "Herken collectieve goederen aan hand van excludeerbaarheid en rivaliteit."
- needs: []
- exam_codes: [F2.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [collectieve-goederen]

### F03 Dominante strategie
- layer: 1
- kern: "Dominante strategie is de beste keuze voor een speler ongeacht wat de ander doet."
- needs: []
- exam_codes: [F1.5]
- mastery_target: understand
- prior_learning: previously_taught
- aspects: [verbaal]
- terms: [dominante-strategie]

### F04 Dominante strategieën in pay-off matrix
- kern: "Identificeer dominante strategieën van beide spelers in een pay-off matrix en bepaal de uitkomst waarbij elke speler zijn dominante strategie kiest."
- needs: [F03]
- exam_codes: [F1.4]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [dominante-strategie, pay-off-matrix, winst]
- procedure:
  1. Noteer voor elke speler de uitbetalingen bij elke combinatie van strategieen uit de pay-off matrix
  2. Vergelijk per speler de uitbetalingen per kolom (speler 1) of rij (speler 2) en onderstreep de hoogste per strategie van de tegenspeler
  3. Controleer of er een strategie is die voor een speler altijd de hoogste uitbetaling geeft: dat is zijn dominante strategie
  4. Herhaal voor de tegenspeler en benoem de uitkomstcel waar beide dominante strategieen samenkomen
  5. Interpreteer de uitkomst economisch: welke winst behaalt elke speler en is dit gezamenlijk optimaal?

### F05 Emissierechten als prikkel
- kern: "Verhandelbare emissierechten zetten een prijs op vervuiling, waardoor bedrijven een prikkel krijgen om uitstoot te verminderen of schoner te produceren."
- needs: [F07, F10]
- exam_codes: [F2.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [externe-effecten]

### F06 Heffing op externe effecten als innovatieprikkel
- kern: "Een heffing op negatieve externe effecten verhoogt de private kosten van vervuilen en geeft bedrijven daarmee een prikkel om te investeren in schonere technologie."
- needs: [F07]
- exam_codes: [F2.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [externe-effecten, heffingen]

### F07 Overproductie bij negatieve externe effecten
- layer: 2
- kern: "Bij negatieve externe effecten liggen de maatschappelijke kosten hoger dan de private kosten, waardoor de markt meer produceert dan maatschappelijk optimaal is."
- needs: [F16]
- exam_codes: [F2.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [externe-effecten, marktevenwicht]

### F08 Verloren surplus door negatieve externe effecten
- kern: "Productie of consumptie voorbij het maatschappelijk optimum leidt tot verloren surplus: het verschil tussen maatschappelijke kosten en baten op de extra eenheden."
- needs: [F07]
- exam_codes: [F2.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [externe-effecten, maatschappelijke-welvaart, verloren-surplus]

### F09 Gevangenendilemma
- kern: "Situatie waarbij dominante strategie leidt tot suboptimale uitkomst voor beide spelers."
- needs: [F03]
- exam_codes: [F1.5]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [dominante-strategie, gevangenendilemma]

### F10 Internalisatie van externe effecten
- kern: "Door de externe kosten of baten via heffing, subsidie of rechten in de prijs op te nemen, komt de marktuitkomst dichter bij het maatschappelijk optimum."
- needs: [F07, F08]
- exam_codes: [F2.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [externe-effecten, heffingen, subsidies]

### F11 Lumpsum-subsidie bij positieve externe effecten
- kern: "Een lumpsum-subsidie vergoedt de producent voor positieve externe effecten zonder de marginale beslissing te verstoren, zodat een maatschappelijk gewenste activiteit rendabel wordt."
- needs: [F10]
- exam_codes: [F2.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [externe-effecten, subsidies]

### F12 Nash-evenwicht in pay-off matrix
- kern: "Bepaal het Nash-evenwicht in een pay-off matrix: de uitkomst waarbij geen van beide spelers zijn strategie wil veranderen gegeven de keuze van de ander."
- needs: [F03]
- exam_codes: [F1.4]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [nash-evenwicht, dominante-strategie, pay-off-matrix]
- procedure:
  1. Markeer voor speler 1 per kolom (strategie van speler 2) de hoogste uitbetaling
  2. Markeer voor speler 2 per rij (strategie van speler 1) de hoogste uitbetaling
  3. Zoek de cel(len) waarin beide uitbetalingen gemarkeerd zijn: dit is het Nash-evenwicht
  4. Controleer of er meerdere Nash-evenwichten zijn of geen in zuivere strategieen
  5. Beschrijf in woorden waarom geen van beide spelers eenzijdig wil afwijken

### F13 Berovingsprobleem op de arbeidsmarkt
- kern: "Pas het berovingsprobleem toe op de arbeidsmarkt: kortere opzegtermijnen verhogen het risico voor werkgevers op relatiespecifieke scholingsinvesteringen, wat loonkosten en investeringsbereidheid beïnvloedt."
- needs: [F01]
- exam_codes: [F2.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [berovingsprobleem, contracten-en-prikkels, risico]

### F14 Concentratie-externaliteiten analyseren
- kern: "Analyseer hoe ruimtelijke of sectorale concentratie van economische activiteit negatieve externe effecten versterkt en wanneer ingrijpen maatschappelijk gewenst is."
- needs: [F08]
- exam_codes: [F2.4]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [externe-effecten]
- procedure:
  1. Identificeer het externe effect dat door concentratie ontstaat (bv. files, luchtvervuiling, overbelaste infrastructuur)
  2. Beredeneer waarom de schade meer dan evenredig toeneemt met het aantal activiteiten op dezelfde plek (niet-lineaire effecten)
  3. Vergelijk privaatkosten en maatschappelijke kosten: laat zien dat er verloren surplus ontstaat (zoals in F08)
  4. Analyseer welke ingreep het effect zou internaliseren (heffingen, vergunningen, ruimtelijke spreiding) en hoe dit de prikkel voor producenten verandert
  5. Beoordeel wanneer ingrijpen maatschappelijk gewenst is: weeg de vermeden externe schade af tegen de kosten van de interventie

### F15 Verzonken kosten negeren in beslissingen
- layer: 1
- kern: "Verzonken kosten zijn niet terugvorderbare uitgaven uit het verleden en horen geen rol te spelen in toekomstgerichte beslissingen; alleen toekomstige opbrengsten en kosten tellen mee."
- needs: []
- exam_codes: [F2.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [verzonken-kosten]

### F16 MPC–MSC en MPB–MSB onderscheiden
- layer: 1
- kern: "Onderscheid private van sociale marginale kosten/opbrengsten: bij een negatief extern effect is MSC = MPC + externe kost/eenheid, bij een positief extern effect is MSB = MPB + externe baat/eenheid."
- needs: []
- exam_codes: [F2.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal, grafisch]
- terms: []
- pitfalls:
  - MPC en MSC als gelijk behandelen wanneer een externaliteit speelt — dat is precies het marktfalen.
  - Positieve en negatieve externaliteiten in dezelfde grafiek door elkaar halen: bij negatief ligt MSC boven MPC, bij positief ligt MSB boven MPB.

### F17 Over- en onderproductiegap bij externaliteiten
- kern: "Bereken de productie-gap tussen marktuitkomst en sociaal optimum: bij negatieve externaliteiten produceert de markt Q_markt > Q_sociaal (overproductie); bij positieve externaliteiten Q_markt < Q_sociaal (onderproductie)."
- needs: [A06, F16]
- exam_codes: [F2.4]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, grafisch]
- terms: []
- procedure:
  1. Bereken het marktevenwicht: vraag = MPC (negatief) of aanbod = MPB (positief).
  2. Bereken het sociaal optimum: vraag = MSC (negatief) of aanbod = MSB (positief).
  3. Gap = Q_markt − Q_sociaal (positief bij overproductie, negatief bij onderproductie).
  4. Welvaartsverlies = driehoek tussen MSC/MSB en de relevante tegenovergestelde curve over de gap.
- pitfalls:
  - De gap meten op de verkeerde as — het gaat om het Q-verschil, niet het P-verschil.
  - Bij positieve externaliteiten vergeten dat de markt te WEINIG produceert (intuïtief "positief = goed" misleidt).

### F18 Pigou-heffing en corrigerende subsidie bepalen
- kern: "Bepaal de omvang van de corrigerende overheidsinstrument: een Pigou-heffing gelijk aan de externe kost per eenheid (bij negatieve externaliteiten) of een subsidie gelijk aan de externe baat per eenheid (bij positieve externaliteiten) laat de marktuitkomst samenvallen met het sociaal optimum."
- needs: [F16, F17, A41]
- exam_codes: [F2.4, D3.4]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: []
- procedure:
  1. Meet de externe kost of baat per eenheid output.
  2. Bij negatief effect: leg een heffing op ter grootte van de externe kost (Pigou-heffing); de aanbodcurve schuift omhoog naar MSC.
  3. Bij positief effect: geef een subsidie ter grootte van de externe baat; de vraagcurve schuift omhoog naar MSB (of de aanbodcurve omlaag).
  4. Controleer: de post-corrigerende marktuitkomst moet samenvallen met het sociaal optimum uit F17.
- pitfalls:
  - De heffing of subsidie niet gelijk aan de externaliteit zetten — over- of ondercorrigeren leidt tot residueel welvaartsverlies.
  - Pigou-heffing verwarren met een gewone accijns — bij Pigou is het tarief bewust gelijk aan de externe kost, niet vrij gekozen voor opbrengst.

### G01 Risicoinschatting en averechtse selectie
- kern: "Betere risicoinschatting door verzekeraars vermindert informatieasymmetrie en verkleint daardoor averechtse selectie op de verzekeringsmarkt."
- needs: [G10, G02]
- exam_codes: [G3.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [informatieasymmetrie, risico]

### G02 Averechtse selectie herkennen
- kern: "Herken averechtse selectie als gevolg van informatieasymmetrie op markten."
- needs: [G10]
- exam_codes: [G3.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [informatieasymmetrie]

### G03 Onderlinge risicopool zonder informatieasymmetrie
- kern: "In een kleine, vertrouwde risicopool ontbreekt informatieasymmetrie omdat deelnemers elkaars risicoprofiel kennen, waardoor averechtse selectie en moreel wangedrag beperkt blijven."
- needs: [G10]
- exam_codes: [G3.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [collectieve-verzekering, informatieasymmetrie, risico]

### G04 Eigen risico en moral hazard
- kern: "Eigen risico geeft verzekerden een prikkel om voorzichtiger te handelen."
- needs: [G10]
- exam_codes: [G4.5]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [contracten-en-prikkels, eigen-risico]

### G05 Belangentegenstelling in principaal-agentrelatie
- kern: "In een principaal-agentrelatie verschillen de belangen van principaal en agent, waardoor de agent keuzes kan maken die ten koste gaan van de principaal."
- needs: [G06]
- exam_codes: [G3.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [contracten-en-prikkels, principaal-agentrelatie]

### G06 Principaal-agentprobleem identificeren
- layer: 1
- kern: "Identificeer principaal-agentrelaties en de problemen die daaruit voortvloeien."
- needs: []
- exam_codes: [G3.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [contracten-en-prikkels, principaal-agentrelatie]

### G07 Transactiekosten berekenen en interpreteren
- layer: 1
- kern: "Bereken de totale transactiekosten van een ruil door zoek-, onderhandel- en controlekosten bij elkaar op te tellen en beoordeel of de ruil na aftrek nog rendabel is."
- needs: []
- exam_codes: [G2.1]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [transactiekosten]
- procedure:
  1. Inventariseer alle transactiekostenposten (zoekkosten, onderhandelkosten, controle- en handhavingskosten)
  2. Tel de bedragen per post op tot de totale transactiekosten van de ruil
  3. Bereken het netto voordeel = bruto ruilvoordeel − totale transactiekosten
  4. Concludeer of de ruil rendabel is (netto voordeel > 0) en benoem welke kostenpost doorslaggevend is

### G08 Risicodeling via gemeenschappelijk fonds
- layer: 1
- kern: "Een gemeenschappelijk fonds vlakt individuele risico's uit door premies te bundelen en kostenverschillen tussen deelnemers te compenseren."
- needs: []
- exam_codes: [G3.3]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [collectieve-verzekering, risico]

### G09 Gepersonaliseerde premies ondermijnen solidariteit
- kern: "Premies gebaseerd op individuele risicoprofielen verkleinen de herverdeling tussen lage- en hogerrisicogroepen en ondermijnen zo de solidariteit in een collectieve verzekering."
- needs: [G08]
- exam_codes: [G3.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [bonus-malussysteem, collectieve-verzekering, risico]

### G10 Informatieasymmetrie verzekeringsmarkt
- layer: 1
- kern: "Informatieongelijkheid tussen verzekeraar en klant kan selectie- en moraalrisicoproblemen veroorzaken."
- needs: []
- exam_codes: [G2.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [informatieasymmetrie]

### G11 Wisselkoersrisico bij internationale handel
- layer: 1
- kern: "Bij betalingen in vreemde valuta leidt een ongunstige wisselkoersverandering tussen contractmoment en betalingsmoment tot lagere reële opbrengsten voor de exporteur of hogere kosten voor de importeur."
- needs: []
- exam_codes: [G2.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [financieel-risico, onzekerheid, wisselkoers]

### G12 Verzekeringspremie berekenen uit verwachte schade
- kern: "Bereken een verzekeringspremie als verwachte schade (kans × schadebedrag) plus opslag voor administratiekosten en risico-/winstmarge; interpreteer verschillen in premie tussen risicogroepen."
- needs: [A38]
- exam_codes: [G1.1, G2.1]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: []
- procedure:
  1. Bepaal de kans p op schade (per verzekerde per periode).
  2. Bepaal het te verzekeren schadebedrag S (vaste claim of gemiddelde claim).
  3. Bereken de verwachte schade = p × S.
  4. Voeg de opslag toe (administratiekosten, risico-marge, winst) om de premie te krijgen.
  5. Controleer: bij een homogene risicogroep moet de totaalpremie de totale verwachte schade plus opslag dekken; bij een gemengde groep leidt één uniforme premie tot solidariteit tussen hoge- en lage-risicoverzekerden.
- pitfalls:
  - Alleen schadebedrag rekenen zonder kans — dat overschat de verwachte schade.
  - Opslag vergeten — zonder opslag dekt de premie alleen de actuariële verwachting, niet de bedrijfskosten.

### H01 AOW-leeftijd als houdbaarheidsinstrument
- layer: 4
- kern: "Leg uit hoe een hogere AOW-leeftijd via premiegrondslag en uitkeringsduur de houdbaarheid van het AOW-stelsel verbetert bij vergrijzing."
- needs: [E04]
- exam_codes: [H5.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [waardevaste-pensioenen, welvaartsvaste-pensioenen]

### H02 AIQ (arbeidsinkomenquote) berekenen
- kern: "Bereken de arbeidsinkomenquote: (arbeidsinkomen / nationaal inkomen) x 100%."
- needs: [A02]
- exam_codes: [H1.1]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [primair-inkomen]
- procedure:
  1. Bepaal het totale arbeidsinkomen (loonsom incl. toegerekend loon zelfstandigen)
  2. Bepaal het nationaal inkomen (of bbp tegen factorkosten, afhankelijk van definitie in de bron)
  3. Bereken AIQ = arbeidsinkomen / nationaal inkomen × 100%
  4. Controleer eenheden: teller en noemer in dezelfde valuta en hetzelfde jaar
  5. Interpreteer: AIQ stijgt als lonen sneller groeien dan winsten, en omgekeerd

### H03 Armington-elasticiteit en importbeleid
- kern: "Bereken de Armington-elasticiteit en beoordeel daarmee hoe sterk importvraag reageert op een prijsverandering van binnenlandse versus buitenlandse varianten."
- needs: [A15]
- exam_codes: [H1.1]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [prijselasticiteit-van-de-vraag]
- procedure:
  1. Noteer de procentuele verandering in de relatieve prijs van buitenlands versus binnenlands goed (%ΔP)
  2. Noteer de procentuele verandering in de relatieve importvraag (%ΔQ)
  3. Bereken de Armington-elasticiteit = %ΔQ / %ΔP
  4. Beoordeel de absolute waarde: > 1 betekent sterke substitutie tussen binnenlands en buitenlands; < 1 zwakke
  5. Koppel aan beleidsvraag: hoe effectiever importbelemmerend beleid is, hoe hoger de Armington-elasticiteit

### H04 Belastingschijven berekening
- kern: "Belastingdruk bepaald aan hand van marginaal tarief en betreffende schijven."
- needs: [A02]
- exam_codes: [H4.6]
- mastery_target: apply
- prior_learning: previously_taught
- aspects: [rekenen, verbaal]
- terms: [gemiddeld-tarief, marginaal-tarief]
- procedure:
  1. Noteer per schijf het marginale tarief en de bovengrens
  2. Bepaal in welke schijf het belastbaar inkomen valt
  3. Bereken per volledig gevulde schijf: (bovengrens − ondergrens) × marginaal tarief
  4. Bereken voor de laatste schijf: (belastbaar inkomen − ondergrens schijf) × marginaal tarief
  5. Tel de schijfbedragen op tot totale inkomstenbelasting
  6. Bereken eventueel gemiddeld tarief = totale belasting / belastbaar inkomen × 100%

### H05 Circulaire economie in groen bbp
- layer: 1
- kern: "Leg uit hoe circulaire productie via minder milieuschade en minder grondstofgebruik het groen bbp per hoofd verhoogt."
- needs: []
- exam_codes: [H3.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [groen-bbp-per-hoofd]

### H06 Totale CO2-uitstoot berekenen
- kern: "Bereken totale milieueffect van marktveranderingen door per-eenheid emissie met hoeveelheid te vermenigvuldigen."
- needs: [A06]
- exam_codes: [H3.4]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [marktevenwicht]
- procedure:
  1. Bepaal de verkochte hoeveelheid Q (bv. aantal eenheden, liters, km)
  2. Bepaal de CO2-uitstoot per eenheid e (kg of ton per eenheid)
  3. Bereken totale CO2-uitstoot = Q × e
  4. Werk bij marktveranderingen de nieuwe Q uit (zoals in A06 voor een nieuw evenwicht) en herbereken
  5. Interpreteer: een maatregel die Q laat dalen verlaagt de totale uitstoot evenredig bij gelijke e

### H07 Vergrijzing, spaarquote en rente
- kern: "Hogere sparende populatie vergroot kapitaalaanbod, wat de evenwichtsrente drukt."
- needs: [H01]
- exam_codes: [H5.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [rente]

### H08 Denivellering en progressieve belasting
- kern: "Denivellering treedt op wanneer belastingveranderingen het verschil in netto-inkomsten tussen inkomensgroepen verkleinen."
- needs: [H04]
- exam_codes: [H4.6]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [denivelleren, marginaal-tarief]

### H09 Kostenvoordeel exporteurs als protectionisme
- kern: "Beargumenteer wanneer een kostenvoordeel voor binnenlandse exporteurs (bv. gratis toegewezen emissierechten) feitelijk werkt als protectionisme tegen buitenlandse concurrenten."
- needs: [H03]
- exam_codes: [H1.1]
- mastery_target: evaluate
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [heffingen, subsidies]
- procedure:
  1. Identificeer het kostenvoordeel: welk instrument (bv. gratis emissierechten, subsidie, belastingvrijstelling) verlaagt de kostprijs van binnenlandse exporteurs
  2. Bereken of beredeneer hoe het voordeel de relatieve prijs van binnenlandse versus buitenlandse goederen wijzigt (gebruik Armington-logica uit H03)
  3. Benoem de beoordelingscriteria: werkt het als protectionisme (nadeel voor buitenlandse concurrenten), treedt er vrijhandelsverstoring op, en hoe zit het met milieudoelen
  4. Weeg voor- en nadelen af: binnenlandse werkgelegenheid en exportpositie tegenover verstoorde concurrentie en mogelijke WTO-conflicten
  5. Concludeer of het instrument feitelijk protectionistisch werkt en onder welke voorwaarden dat gerechtvaardigd is

### H10 Gini-coefficient bij recessie
- layer: 1
- kern: "Gini-coefficient stijgt tijdens recessie door werkloosheidsconcentratie en toename inkomensongelijkheid."
- needs: []
- exam_codes: [H4.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [gini-coefficient, conjuncturele-werkloosheid]

### H11 Groen bbp en CO2
- kern: "Lagere CO2-uitstoot vergroot groen bbp; minder productie wegens minder emissierechten verkleint het."
- needs: [H05, H06]
- exam_codes: [H3.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [groen-bbp-per-hoofd]

### H12 Houdbaarheidssaldo
- kern: "Het houdbaarheidssaldo geeft aan of overheidsvoorzieningen op lange termijn betaalbaar blijven; stijgende grijze druk verslechtert het saldo."
- needs: [H01]
- exam_codes: [H5.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [staatsschuld]

### H13 Minimumuurloon: kostenkanaal naar concurrentiepositie
- layer: 4
- kern: "Redeneer via het kostenkanaal hoe een hoger minimumuurloon de internationale concurrentiepositie kan verslechteren."
- needs: [D13]
- exam_codes: [H1.1]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [wisselkoers]
- procedure:
  1. Identificeer het kostenkanaal: een hoger minimumuurloon verhoogt de loonkosten per eenheid product voor arbeidsintensieve sectoren
  2. Beredeneer de doorwerking op de prijzen: hogere kostprijs leidt tot hogere afzetprijzen van Nederlandse exportgoederen
  3. Vergelijk met buitenlandse concurrenten: bij gelijke wisselkoers worden Nederlandse goederen relatief duurder en daalt de exportvraag
  4. Analyseer of wisselkoersaanpassing (depreciatie) dit effect deels kan compenseren en onder welke voorwaarden
  5. Concludeer met een verdict over de internationale concurrentiepositie, met een expliciete ceteris-paribus-aanname

### H14 Minimumuurloon: vraagkanaal naar bbp-groei
- layer: 2
- kern: "Redeneer via het bestedingskanaal hoe een hoger minimumuurloon de consumptie en daarmee de bbp-groei kan verhogen."
- needs: [I14]
- exam_codes: [H1.1]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [bbp-groei, koopkracht]
- procedure:
  1. Identificeer het bestedingskanaal: een hoger minimumuurloon verhoogt het besteedbaar inkomen van lagere inkomensgroepen
  2. Beredeneer waarom juist deze groep een hoge consumptiequote heeft, zodat een groot deel van de extra koopkracht wordt besteed
  3. Analyseer de doorwerking via de multiplier (zie I14): extra consumptie stuwt Y omhoog in meerdere bestedingsrondes
  4. Weeg de bbp-groei af tegen mogelijke lekkages (import, sparen, belasting) die de multiplier verkleinen
  5. Concludeer of en onder welke voorwaarden het vraagkanaal tot hogere bbp-groei leidt

### H15 Nominale rente op staatsobligaties verklaren
- layer: 4
- kern: "Verklaar bewegingen in de nominale rente op staatsobligaties vanuit vraag-en-aanbod op de obligatiemarkt en risicoperceptie."
- needs: [H30, H31]
- exam_codes: [H1.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [obligaties, rente, risico]

### H16 Soepeler ontslagrecht en werkgeversrisico
- layer: 1
- kern: "Leg uit hoe versoepeling van ontslagrecht het aannamerisico voor werkgevers verlaagt en het effect op werkgelegenheid beredeneer."
- needs: []
- exam_codes: [H5.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [risico]

### H17 Arbeidsproductiviteit, werkgelegenheid en lange termijn
- kern: "Onderscheid het korte-termijn werkgelegenheidseffect van productiviteitsverhogende investeringen van het lange-termijn concurrentie-effect."
- needs: [H13]
- exam_codes: [H1.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [investeringen]

### H18 Progressief tarief berekenen
- kern: "Bereken totale belasting bij progressieve tarieven en analyseer stimulansen."
- needs: [H04]
- exam_codes: [H4.6]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [gemiddeld-tarief, marginaal-tarief]
- procedure:
  1. Noteer per schijf het marginale tarief
  2. Voer de stapsgewijze berekening uit zoals in H04 (totale inkomstenbelasting)
  3. Bereken het gemiddelde tarief = totale belasting / belastbaar inkomen × 100%
  4. Bereken het marginale tarief op het inkomen: het tarief van de hoogst bereikte schijf
  5. Analyseer de prikkel: een hoger marginaal tarief verkleint de beloning van een extra verdiende euro en kan arbeidsaanbod drukken

### H19 Publiek kapitaal en staatsschuldquote
- kern: "Leg uit hoe investeringen in publiek kapitaal op lange termijn staatsschuldquote kunnen verlagen."
- needs: [H21]
- exam_codes: [H5.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [investeringen, staatsschuld]

### H20 Spaarsaldo en betalingsbalans
- kern: "Interpreteer positieve en negatieve particuliere spaarsalda."
- needs: [H21]
- exam_codes: [H1.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [primair-inkomen]

### H21 Staatsschuldquote berekenen
- layer: 1
- kern: "Bereken staatsschuldquote = staatsschuld / bbp x 100% en bepaal drempels voor duurzaamheid."
- needs: []
- exam_codes: [H5.1]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [bbp-groei, bbp-niveau, staatsschuld]
- procedure:
  1. Bepaal de staatsschuld in euro's (stand aan het einde van het jaar)
  2. Bepaal het bbp in euro's over hetzelfde jaar
  3. Bereken staatsschuldquote = staatsschuld / bbp × 100%
  4. Vergelijk met de 60%-drempel uit het Stabiliteits- en Groeipact
  5. Analyseer dynamiek: quote daalt als bbp-groei groter is dan de groei van de staatsschuld

### H22 Belastingtariefaanpassing en secundaire inkomenseffecten
- kern: "Analyseer hoe een wijziging in belastingtarieven via veranderd besteedbaar inkomen de vraag en daarmee secundaire inkomenseffecten oproept."
- needs: [H04, H08]
- exam_codes: [H4.6]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [marginaal-tarief, secundair-inkomen]
- procedure:
  1. Bepaal de verandering in het marginaal tarief en bereken het effect op het besteedbaar inkomen van een representatief huishouden (methode uit H04)
  2. Identificeer hoeveel extra (of minder) consumptie hieruit volgt: koppel de inkomensverandering aan de marginale consumptiequote c
  3. Analyseer de multiplier-werking: de eerste bestedingsronde genereert nieuwe inkomens voor andere huishoudens (secundair inkomen)
  4. Tel de rondes op via ΔY = multiplier × ΔA (zie I14) en let op lekkages (import, sparen, belasting)
  5. Beoordeel het netto-effect op bbp en inkomensverdeling; vergelijk met denivellering of nivellering uit H08

### H23 Belastingwig en uitverdieneffect op arbeidsaanbod
- kern: "Leg uit hoe een hogere belastingwig via het substitutie-effect het arbeidsaanbod verkleint (uitverdieneffect)."
- needs: [H18]
- exam_codes: [H4.6]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [arbeidsaanbod, marginaal-tarief, uitverdieneffecten]

### H24 Wisselkoers en depreciatie
- layer: 1
- kern: "Bereken wisselkoerseffecten van depreciatie en leg uit hoe deze reële inkomens beïnvloeden."
- needs: [A38]
- exam_codes: [H1.1]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [koopkracht, wisselkoers]
- procedure:
  1. Noteer de oude wisselkoers (prijs buitenlandse valuta in binnenlandse, bv. €/$)
  2. Noteer de nieuwe wisselkoers na depreciatie
  3. Bereken procentuele depreciatie = (nieuw − oud) / oud × 100%
  4. Reken een importprijs of exportopbrengst om naar binnenlandse valuta bij beide koersen
  5. Interpreteer: depreciatie maakt import duurder (reële koopkracht daalt) en export goedkoper voor buitenlandse kopers

### H25 Wisselkoers, export en bbp-groei
- kern: "Leg uit hoe een depreciatie van de wisselkoers via goedkopere export tot hogere bbp-groei kan leiden."
- needs: [H24]
- exam_codes: [H1.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [bbp-groei, wisselkoers]

### H26 Koop- versus huurlasten vergelijken
- kern: "Vergelijk netto woonlasten van kopen en huren door rente, aflossing, onderhoud en huurprijs systematisch tegen elkaar af te zetten."
- needs: [H15]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [rente]
- procedure:
  1. Inventariseer per optie de kostencategorieën: bij kopen (hypotheekrente, aflossing, onderhoud, eigenaarslasten) en bij huren (kale huur, servicekosten)
  2. Bereken voor beide opties de netto maandlasten over een vaste periode (bv. 1 jaar), inclusief fiscale effecten
  3. Corrigeer voor vermogensopbouw bij kopen (aflossingsdeel is geen kostenpost maar besparing) en voor verwachte waardegroei van de woning
  4. Voer gevoeligheidsanalyse uit op de rente (zie H15) en de huurontwikkeling: welke aanname verschuift de uitkomst
  5. Vergelijk de netto woonlasten systematisch per categorie en concludeer onder welke voorwaarden kopen goedkoper is dan huren
- deprecated: true
- deprecated_in_favor_of: [E07]

### H27 Productiefunctie Y = A·f(K, L) toepassen
- layer: 6
- kern: "Pas de productiefunctie Y = A·f(K, L) toe: verklaar hoe groei in kapitaal K, arbeid L en totale factorproductiviteit A bijdraagt aan lange-termijn productie; herken afnemend grensproduct wanneer K óf L alleen toeneemt."
- needs: [H17]
- exam_codes: [H2.1, H2.2, H2.3]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [productiefunctie]
- procedure:
  1. Lees de beschikbare factoren af: K (kapitaalvoorraad), L (arbeidsvolume), A (totale factorproductiviteit).
  2. Bereken Y uit de gegeven vorm van f(·) — vaak proportioneel in K en L (of Cobb-Douglas-achtig).
  3. Onderscheid een stijging in A (productiviteitstoename) van een stijging in K of L (factoraccumulatie) — het effect op Y verschilt.
  4. Herken afnemend grensproduct: extra K bij gelijke L (of extra L bij gelijke K) levert steeds minder Y op.
  5. Koppel aan beleid: structureel groeibeleid richt zich op A, K óf L — afhankelijk van welke factor knellend is.
- pitfalls:
  - Y-groei alleen aan inzet toeschrijven — productiviteitsgroei via A is cruciaal maar onzichtbaar in K en L.
  - Afnemend grensproduct betekent niet dat Y daalt: Y blijft stijgen, maar steeds langzamer.

### H28 Betalingsbalans: saldo lopende rekening
- kern: "Bereken het saldo op de lopende rekening van de betalingsbalans uit netto-export (goederen + diensten), primair inkomen (netto-factorinkomen uit buitenland) en secundair inkomen (overdrachten); interpreteer een overschot als binnenlandse besparingen > investeringen."
- needs: [H24]
- exam_codes: [H1.1, H1.2]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [betalingsbalans]
- procedure:
  1. Identificeer de vier componenten: saldo goederenhandel, saldo dienstenhandel, primair inkomen, secundair inkomen.
  2. Bereken per component ontvangsten − uitgaven.
  3. Tel de vier componentsaldi op voor het saldo op de lopende rekening.
  4. Interpreteer: positief saldo = binnenlandse besparingen > investeringen (netto-crediteur positie); negatief saldo = omgekeerd.
- pitfalls:
  - Alleen goederenhandel meenemen — diensten, inkomen en overdrachten horen volledig bij de lopende rekening.
  - Lopende rekening verwarren met financiële rekening — financiële rekening registreert vermogensstromen, niet reële stromen.

### H29 Obligatie als verhandelbaar schuldpapier
- layer: 1
- kern: "Benoem wat een obligatie is — een verhandelbaar schuldpapier met vaste nominale waarde, couponrente en looptijd — en onderscheid de primaire markt (emissie/veiling door de uitgever) van de secundaire markt (handel tussen beleggers)."
- needs: []
- exam_codes: [H1.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [obligaties]
- pitfalls:
  - Obligatie verwarren met aandeel: een obligatie is schuld (uitgever moet nominale waarde terugbetalen), een aandeel is eigendom.
  - Emittent-perspectief (overheid of bedrijf leent door uitgifte) verwarren met beleggers-perspectief (belegger koopt schuldpapier) — op de secundaire markt staan twee beleggers tegenover elkaar, niet de uitgever.

### H30 Vraag en aanbod op de obligatiemarkt
- layer: 2
- kern: "Leg uit hoe vraag en aanbod op de secundaire obligatiemarkt samen de obligatiekoers bepalen. Noem de drie belangrijkste demand-shifters (risicoperceptie, alternatieve rendementen, inflatieverwachting) en de belangrijkste supply-shifter (nieuwe uitgiften door overheid of bedrijven)."
- needs: [H29, D32]
- exam_codes: [H1.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [obligaties, rendement]
- pitfalls:
  - Denken dat meer vraag naar obligaties de rente omhoog stuwt (intuitie vanuit spaarrente) — het is precies omgekeerd: meer vraag duwt de koers omhoog en daarmee het rendement omlaag.
  - Verwarren van de obligatiekoers (marktprijs) met de nominale waarde — de koers beweegt mee met vraag en aanbod, de nominale waarde staat vast bij uitgifte.
  - Denken dat de overheid de rente op haar obligaties direct vaststelt — de effectieve rente volgt uit de veilingkoers die beleggers bereid zijn te bieden.

### H31 Inverse relatie obligatiekoers en rente
- layer: 3
- kern: "Leg uit dat obligatiekoers en effectief rendement omgekeerd bewegen: bij gelijke couponstroom betekent een hogere aankoopkoers een lager effectief rendement, en omgekeerd."
- needs: [H29, H30]
- exam_codes: [H1.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal, rekenen]
- terms: [obligaties, rendement, rente]
- pitfalls:
  - Denken dat een hogere koers hetzelfde is als een hogere rente — het is precies omgekeerd, omdat de couponstroom per obligatie vastligt.
  - De inverse relatie doortrekken naar de couponrente: die staat vast bij uitgifte; alleen het effectief rendement beweegt met de marktkoers.
  - Aannemen dat het koerseffect voor elke obligatie even groot is — bij langlopend papier is het rendementseffect van een koersschommeling veel groter dan bij kortlopend papier.

### I01 Anticyclisch begrotingsbeleid
- layer: 1
- kern: "Beschrijf hoe de overheid in laagconjunctuur bestedingen verhoogt of belastingen verlaagt en in hoogconjunctuur het omgekeerde doet om de conjunctuurcyclus af te vlakken."
- needs: []
- exam_codes: [I2.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [anticyclisch, conjunctuurpolitiek, hoogconjunctuur, overheidstekort]

### I02 Automatische stabilisatoren via inkomensoverdrachten
- kern: "Leg uit hoe inkomensoverdrachten zoals WW en bijstand automatisch meebewegen met de conjunctuur en zo de bestedingen stabiliseren zonder nieuw beleid."
- needs: [I01]
- exam_codes: [I2.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [anticyclisch, automatische-stabilisatoren, secundair-inkomen]

### I03 Renteongevoeligheid van investeringen bij ondergrens
- kern: "Leg uit waarom bedrijfsinvesteringen beperkt reageren op renteverlagingen als de vraag laag is of de effectieve ondergrens nominale rente nadert."
- needs: [I17]
- exam_codes: [I3.6, I4.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [effectieve-ondergrens-nominale-rente, investeringen]

### I04 CAO-looptijd en loonrigiditeit
- layer: 4
- kern: "Leg uit hoe langere CAO-looptijden loonaanpassingen vertragen en daarmee de flexibiliteit van de arbeidsmarkt en de effectiviteit van conjunctuurbeleid beïnvloeden."
- needs: [L19]
- exam_codes: [I4.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [arbeidsaanbod]

### I05 Rentebesluit van centrale bank
- kern: "Bepaal op basis van inflatie, outputgap en duaal mandaat of een centrale bank de beleidsrente verhoogt, verlaagt of constant houdt."
- needs: [I17, I07]
- exam_codes: [I3.3, I3.5]
- mastery_target: apply
- prior_learning: previously_taught
- aspects: [rekenen, verbaal]
- terms: [duaal-mandaat, effectieve-ondergrens-nominale-rente, hoogconjunctuur]
- procedure:
  1. Noteer het mandaat van de centrale bank (enkelvoudig: alleen inflatiedoel; duaal: inflatie én outputgap).
  2. Kwantificeer de afwijkingen: inflatie π versus doel, en outputgap Y − Y* (zie I15 voor outputgap-berekening).
  3. Kies: π boven doel of positieve outputgap → renteverhoging (verkrappen); π onder doel of negatieve outputgap → renteverlaging (verruimen). Controleer de effectieve ondergrens nominale rente.
  4. Verwoord het besluit met verwijzing naar het mandaat en de waargenomen afwijkingen.

### I06 Deflatiespiraal
- layer: 1
- kern: "Leg uit hoe dalende prijzen consumenten en bedrijven aanzetten tot uitstel van bestedingen en investeringen, waardoor de laagconjunctuur zichzelf versterkt."
- needs: []
- exam_codes: [I1.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [hoogconjunctuur, investeringen, koopkracht]

### I07 IS-MB-GA-model: outputgap en inflatie
- kern: "Analyseer met het IS-MB-GA-model hoe een schok via outputgap en inflatie doorwerkt op rente, bbp en prijsniveau."
- needs: [I10, I14]
- exam_codes: [I4.1]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [grafisch, verbaal]
- terms: [ga-curve, is-curve, mb-curve, hoogconjunctuur, rente]
- procedure:
  1. Teken IS-curve (Y dalend in reële rente r), MB-curve (beleidsregel) en GA-curve (π stijgend in outputgap Y − Y*). Label assen: r verticaal voor IS-MB, π verticaal voor GA.
  2. Identificeer het beginevenwicht: snijpunt IS-MB bepaalt Y en r; GA bepaalt π bij die Y.
  3. Bepaal welke curve verschuift door de schok (vraagschok → IS, aanbodschok → GA) en teken de verschuiving.
  4. Lees het nieuwe snijpunt af: nieuwe Y, outputgap Y − Y*, nieuwe r en nieuwe π via de GA-curve.
  5. Beschrijf de reactie van de centrale bank volgens de MB-regel (zie I05) en de terugkeer naar Y*.

### I08 Keynesiaans kruis: verschuivingen analyseren
- kern: "Analyseer hoe een verandering in autonome bestedingen (C, I, G of X−M) de geplande bestedingen verschuift en via de multiplier een nieuw evenwicht op Y = bestedingen oplevert."
- needs: [I14]
- exam_codes: [I4.1, I4.2]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [grafisch, rekenen, verbaal]
- terms: [keynesiaanse-kruis, investeringen]
- procedure:
  1. Teken het Keynesiaans kruis: 45°-lijn (Y = EB) naast de bestedingenlijn EB = C + I + G + (X − M) met autonome component A en helling gelijk aan de marginale bestedingsquote c.
  2. Lees het beginevenwicht af als snijpunt van EB met de 45°-lijn (Y = EB).
  3. Bepaal welke autonome component verandert (ΔC, ΔI, ΔG of Δ(X − M)) en met welk bedrag ΔA.
  4. Schuif EB verticaal met ΔA en lees het nieuwe evenwicht op de 45°-lijn af.
  5. Bereken ΔY = multiplier × ΔA (zie I14) en verwoord het uitgavenrondes-effect.

### I09 Koopkrachtbehoud bij inflatie berekenen
- kern: "Bereken de nominale loon- of uitkeringsstijging die nodig is om de koopkracht gelijk te houden bij een gegeven inflatiepercentage."
- needs: [A02]
- exam_codes: [I1.4]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [koopkracht, nominale-en-reele-grootheden]
- procedure:
  1. Noteer het oude nominale loon of uitkering L0 en het inflatiepercentage π over de periode
  2. Bereken het nieuwe nominale bedrag L1 = L0 × (1 + π/100) om exact mee te stijgen met de prijzen
  3. Controleer: de procentuele loonstijging = π, dus koopkracht blijft gelijk (reële stijging = 0%)
  4. Bij gegeven nominale stijging g: bereken de reële stijging = ((1 + g/100) / (1 + π/100) − 1) × 100%
  5. Interpreteer: reëel > 0 betekent koopkrachtwinst, reëel < 0 betekent koopkrachtverlies
  6. Let op eenheden en periode: gebruik jaar-op-jaar percentages en consistente valuta

### I10 Loonrigiditeit en helling GA-curve
- layer: 4
- kern: "Leg uit hoe starre lonen leiden tot een vlakkere GA-curve op korte termijn en hoe flexibele lonen de curve steiler maken."
- needs: [L19]
- exam_codes: [I4.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [grafisch, verbaal]
- terms: [ga-curve]

### I11 Monetair beleid: starre versus flexibele arbeidsmarkt
- kern: "Vergelijk het effect van een renteverlaging op bbp en prijsniveau tussen een starre en een flexibele arbeidsmarkt en verklaar het verschil via de helling van de GA-curve."
- needs: [I10, I05]
- exam_codes: [I4.4]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [grafisch, verbaal]
- terms: [ga-curve, mb-curve, arbeidsaanbod, rente]
- procedure:
  1. Teken het IS-MB-GA-diagram (zie I07) voor een economie met starre lonen: vlakke GA-curve op korte termijn
  2. Pas een renteverlaging toe: MB-curve schuift omlaag, IS-evenwicht verschuift naar hogere Y
  3. Lees af: groot effect op Y (bbp), klein effect op π (prijsniveau) door vlakke GA
  4. Teken hetzelfde diagram voor een flexibele arbeidsmarkt: steile GA-curve
  5. Pas dezelfde renteverlaging toe: klein effect op Y, groot effect op π
  6. Vergelijk beide uitkomsten en concludeer dat monetair beleid krachtiger is bij loonrigiditeit op korte termijn en vooral prijseffecten heeft bij loonflexibiliteit
  7. Verwoord het verband met I10 (helling GA-curve volgt uit loonflexibiliteit)

### I12 Wisselkoerskanaal van rentebeleid
- kern: "Leg uit hoe een renteverlaging via kapitaaluitstroom leidt tot depreciatie van de valuta en daarmee de exportcompetitiviteit vergroot."
- needs: [I17, I20]
- exam_codes: [I3.8]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [monetair-beleid, wisselkoers]

### I13 Monetair trilemma
- kern: "Analyseer waarom een land hooguit twee van de drie doelen — vaste wisselkoers, vrij kapitaalverkeer en zelfstandig rentebeleid — tegelijk kan bereiken."
- needs: [I12]
- exam_codes: [I1.2]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [monetair-beleid, muntunie, wisselkoers]
- procedure:
  1. Benoem de drie doelen van het trilemma: vaste wisselkoers, vrij kapitaalverkeer, zelfstandig rentebeleid
  2. Analyseer paar 1 (vaste wisselkoers + vrij kapitaalverkeer): toon dat de centrale bank de rente moet aanpassen aan het buitenland, dus geen zelfstandig rentebeleid
  3. Analyseer paar 2 (vaste wisselkoers + zelfstandig rentebeleid): toon dat kapitaalcontroles nodig zijn om uitstroom bij rentegap te voorkomen
  4. Analyseer paar 3 (vrij kapitaalverkeer + zelfstandig rentebeleid): toon dat de wisselkoers dan moet kunnen zweven (zie I12)
  5. Concludeer dat elke keuze van twee doelen het derde uitsluit en plaats een concreet land in het schema (bv. Nederland binnen de muntunie)

### I14 Multiplier en lekkages
- layer: 1
- kern: "Leg uit hoe een toename van autonome bestedingen via de multiplier een groter inkomenseffect oproept en hoe belastingen, spaarneiging en import als lekkages de multiplier verkleinen."
- needs: []
- exam_codes: [I4.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [inverdieneffecten, investeringen, uitverdieneffecten]

### I15 Outputgap bij vraag- en aanbodschokken
- kern: "Analyseer hoe een positieve of negatieve vraag- of aanbodschok de feitelijke productie ten opzichte van het potentieel bbp verschuift en een output gap veroorzaakt."
- needs: [I07, I14]
- exam_codes: [I4.2]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [grafisch, rekenen, verbaal]
- terms: [ga-curve, is-curve, automatische-stabilisatoren, conjuncturele-werkloosheid, hoogconjunctuur]
- procedure:
  1. Bepaal het potentieel bbp Y* (structurele productiecapaciteit) en het feitelijke bbp Y
  2. Bereken de outputgap = (Y − Y*) / Y* × 100%
  3. Classificeer de schok: vraagschok (verschuift IS-curve, bijvoorbeeld exportdaling) of aanbodschok (verschuift GA-curve, bijvoorbeeld olieprijsstijging)
  4. Teken de verschuiving in het IS-MB-GA-diagram en bepaal de richting: negatieve schok → Y daalt → negatieve outputgap; positieve schok → Y stijgt → positieve outputgap
  5. Analyseer het gevolg voor inflatie via de GA-curve: negatieve outputgap drukt π, positieve outputgap stuwt π op
  6. Beschrijf het verwachte hersteltraject: via rentebeleid (MB-regel) of automatische stabilisatoren keert Y terug naar Y*

### I16 Overheidssaldo en conjunctuur
- kern: "Leg uit hoe belastingontvangsten en overheidsuitgaven samen het overheidssaldo bepalen en hoe dit saldo met de conjunctuur meebeweegt."
- needs: [H21]
- exam_codes: [E2.2, I2.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [automatische-stabilisatoren, overheidstekort, staatsschuld]

### I17 Rentebeleid en transmissiemechanisme
- kern: "Leg uit hoe een renteverhoging via duurder krediet consumptie en investeringen afremt en hoe een renteverlaging deze bestedingen stimuleert."
- needs: [H15]
- exam_codes: [I3.5, I1.5]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [investeringen, monetair-beleid]

### I18 Reële waarde van nominaal eigen risico
- kern: "Leg uit hoe inflatie de reële last van een nominaal vast eigen risico verlaagt en waarom herziening nodig is om het beleidsdoel vast te houden."
- needs: [I09]
- exam_codes: [I1.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [eigen-risico, koopkracht, nominale-en-reele-grootheden]

### I19 Wisselkoerseffect van monetair beleid op conjunctuur
- kern: "Leg uit hoe rentebeleid via de wisselkoers de netto export verandert en zo de binnenlandse conjunctuur beïnvloedt."
- needs: [I12, H24]
- exam_codes: [I1.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [bbp-groei, monetair-beleid, wisselkoers]

### I20 Internationale kapitaalmobiliteit en rentepariteit
- kern: "Leg uit waarom een relatief hogere binnenlandse rente buitenlands kapitaal aantrekt en een relatieve renteverlaging kapitaal doet wegvloeien; deze kapitaalbewegingen drijven via vraag en aanbod op de valutamarkt de wisselkoers."
- needs: [H24]
- exam_codes: [I3.8]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [wisselkoers]
- pitfalls:
  - Denken dat kapitaal uitsluitend op absoluut rentepeil reageert — het gaat om het RELATIEVE rente-verschil met buitenland.
  - De causaliteit omkeren: rente → kapitaalstromen → wisselkoers, niet andersom in deze eerste-orde redenering.

### L01 Waarde marginaal product (VMP)
- layer: 1
- kern: "Bereken VMP = marginaal product × prijs per eenheid output uit een tabel met aflopende marginale productiviteit, en gebruik VMP als grens voor de individuele arbeidsvraag."
- needs: []
- exam_codes: [H5.1]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [arbeidsvraag]
- procedure:
  1. Lees marginaal product per werkende af uit de tabel.
  2. Vermenigvuldig met de prijs per eenheid output om VMP te krijgen.
  3. Interpreteer VMP als maximale loonbereidheid van de werkgever voor die werknemer.
- pitfalls:
  - Marginaal product verwarren met totaal product — het gaat om de extra bijdrage per additionele werkende.

### L02 Inhuurregel VMP ≥ W
- kern: "Bepaal hoeveel werkenden een werkgever aanneemt door VMP per werkende met het loon W te vergelijken: neem aan zolang VMP ≥ W, stop zodra VMP < W."
- needs: [L01]
- exam_codes: [H5.1]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: []
- procedure:
  1. Bereken VMP per werknemer (zie L01).
  2. Vergelijk VMP met W voor elke werknemer in volgorde.
  3. Tel mee zolang VMP ≥ W; het laatste aangenomen nummer is de arbeidsvraag bij loon W.
- pitfalls:
  - Vergeten dat VMP afneemt: de eerste werkende verdient wel boven W, de vijfde misschien niet.

### L03 Afgeleide vraag (derived demand)
- layer: 1
- kern: "Leg uit waarom de vraag naar arbeid een afgeleide vraag is: werkgevers vragen arbeid omdat consumenten de eindproducten willen kopen, niet omdat arbeid zelf gewenst is."
- needs: []
- exam_codes: [H5.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [arbeidsvraag]
- pitfalls:
  - Denken dat arbeidsvraag alleen door loon bepaald wordt — bij dalende productvraag daalt arbeidsvraag zelfs bij ongewijzigd loon.

### L04 Arbeidsvraagcurve tekenen uit VMP
- kern: "Teken de individuele arbeidsvraagcurve van een werkgever door VMP per werkende op de verticale as en de werknemersrij op de horizontale as uit te zetten; het resultaat is de dalende VMP-curve."
- needs: [L01]
- exam_codes: [H5.1]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch]
- terms: []
- procedure:
  1. Zet loon W op de verticale as en aantal werkenden op de horizontale as.
  2. Plot VMP-waarden uit de tabel als punten: werkende-nummer op de horizontale as, VMP op de verticale as.
  3. Verbind de punten tot een dalende arbeidsvraagcurve; lees bij elke W af hoeveel werkenden aangenomen worden.
- pitfalls:
  - Assen omwisselen of loon op de horizontale as plaatsen — economische conventie is W verticaal.

### L05 Beroepsbevolking, niet-beroepsbevolking, werkloze beroepsbevolking
- layer: 1
- kern: "Definieer beroepsbevolking (iedereen van 15–75 die werkt of werk zoekt), niet-beroepsbevolking (wel die leeftijd maar werkt niet en zoekt geen werk) en werkloze beroepsbevolking (zoekt werk, heeft nog geen baan)."
- needs: []
- exam_codes: [H5.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [arbeidsaanbod, werkloosheid]
- pitfalls:
  - "Niet-werkend" verwarren met "werkloos" — scholieren/gepensioneerden zitten in de niet-beroepsbevolking, niet in de werkloze beroepsbevolking.

### L06 Bruto participatiegraad berekenen
- kern: "Bereken de bruto participatiegraad = beroepsbevolking / bevolking 15–75 × 100, en interpreteer het resultaat als het percentage dat actief is op de arbeidsmarkt."
- needs: [L05]
- exam_codes: [H5.1, A2.4]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: []
- procedure:
  1. Vul in: teller = beroepsbevolking (werkenden + werkloze beroepsbevolking).
  2. Vul in: noemer = bevolking tussen 15 en 75 jaar (NIET de totale bevolking).
  3. Deel en vermenigvuldig met 100 om het percentage te krijgen.
- pitfalls:
  - Totale bevolking gebruiken als noemer in plaats van de 15–75-leeftijdsgroep.

### L07 Werkloosheidspercentage berekenen
- kern: "Bereken het werkloosheidspercentage = werkloze beroepsbevolking / beroepsbevolking × 100; de noemer is de beroepsbevolking, niet de totale bevolking."
- needs: [L05]
- exam_codes: [H5.1, A2.4]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [werkloosheid]
- procedure:
  1. Vul in: teller = werkloze beroepsbevolking (zoekt werk, heeft geen baan).
  2. Vul in: noemer = beroepsbevolking (werkenden + werklozen).
  3. Deel en vermenigvuldig met 100.
- pitfalls:
  - De niet-beroepsbevolking meetellen als werkloos (scholieren/gepensioneerden zijn geen werklozen).

### L08 Effect van loonstijging op participatiegraad
- kern: "Leg uit dat een aanhoudende loonstijging mensen uit de niet-beroepsbevolking kan trekken naar de beroepsbevolking, waardoor de participatiegraad stijgt."
- needs: [L05, L06]
- exam_codes: [H5.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [loonontwikkeling]
- pitfalls:
  - Denken dat participatiegraad alleen van demografie afhangt — lonen en beleid verplaatsen mensen tussen beroepsbevolking en niet-beroepsbevolking.

### L09 Krappe versus ruime arbeidsmarkt
- layer: 2
- kern: "Herken een krappe arbeidsmarkt (arbeidsvraag > arbeidsaanbod, oplopende lonen) versus een ruime arbeidsmarkt (arbeidsaanbod > arbeidsvraag, dalende lonen en oplopende werkloosheid)."
- needs: [L05]
- exam_codes: [H5.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []
- pitfalls:
  - "Krap" klinkt negatief, maar krappe arbeidsmarkt is vanuit werkenden gunstig — drukt lonen op.

### L10 Arbeidsmarktevenwicht als transfer van goederenmarkt
- kern: "Pas het goederenmarkt-evenwichtsraamwerk toe op de arbeidsmarkt door W voor P en werkenden voor Q te substitueren; los Qa = Qv op voor W* en bereken de evenwichtswerkgelegenheid."
- needs: [A02, A04, A06]
- exam_codes: [H5.1, A2.10, A2.12, A2.15]
- mastery_target: apply
- prior_learning: review_and_extend
- aspects: [rekenen, grafisch]
- terms: [arbeidsaanbod, arbeidsvraag]
- procedure:
  1. Identificeer W als prijs en aantal werkenden als hoeveelheid op de assen.
  2. Stel Qa = Qv en los op voor W* (zelfde rekenwerk als §1.4.1).
  3. Substitueer W* terug in een van beide vergelijkingen voor de evenwichtswerkgelegenheid Q*.
  4. Controleer: bij W* is arbeidsvraag = arbeidsaanbod; bij W > W* ontstaat werkloosheid; bij W < W* ontstaat tekort (krapte).
- pitfalls:
  - Vergeten dat op de arbeidsmarkt werkenden aanbod leveren en bedrijven vraag hebben — de namen zijn omgekeerd aan de goederenmarkt.

### L11 Conjuncturele werkloosheid
- layer: 2
- kern: "Definieer conjuncturele werkloosheid als werkloosheid door tekortschietende bestedingen tijdens laagconjunctuur; verdwijnt als de economie herstelt."
- needs: [L05]
- exam_codes: [H5.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [conjuncturele-werkloosheid]
- pitfalls:
  - Conjuncturele werkloosheid verwarren met structurele — conjunctureel is tijdelijk en keert om bij herstel.

### L12 Structurele werkloosheid
- layer: 2
- kern: "Definieer structurele werkloosheid als werkloosheid door blijvende mismatch tussen vaardigheden en vraag (bijvoorbeeld door automatisering of sectorverschuiving); blijft bestaan zonder gericht beleid."
- needs: [L05]
- exam_codes: [H5.2, H5.3]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [structurele-werkloosheid]
- pitfalls:
  - Denken dat conjunctuurherstel structurele werkloosheid oplost — zonder herscholing blijft de mismatch bestaan.

### L13 Frictiewerkloosheid
- layer: 2
- kern: "Definieer frictiewerkloosheid als kortdurende werkloosheid tijdens het zoeken naar een nieuwe baan; is normaal en zelfs gezond op een dynamische arbeidsmarkt."
- needs: [L05]
- exam_codes: [H5.2, H5.3]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [frictiewerkloosheid]
- pitfalls:
  - Frictiewerkloosheid als probleem zien — een kleine fractie frictiewerkloosheid betekent dat de arbeidsmarkt werkt, niet dat hij hapert.

### L14 Werkloosheid classificeren uit context
- kern: "Classificeer een werkloosheidssituatie als conjunctureel, structureel of frictioneel op basis van de oorzaak (bestedingstekort, skills-mismatch, of tussen-banen-zoektijd)."
- needs: [L11, L12, L13]
- exam_codes: [H5.2]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []
- procedure:
  1. Lees de context: wat is de oorzaak van het banenverlies?
  2. Als de oorzaak een recessie/bestedingsdaling is → conjunctureel.
  3. Als de oorzaak een blijvende sector-/skills-verschuiving is (automatisering, sectorverandering) → structureel.
  4. Als de persoon zelf ontslag neemt en rondkijkt → frictioneel.
- pitfalls:
  - Niet-evidente gevallen (mijnwerker na mijnsluiting) vereisen judgement: blijvende mismatch = structureel, korte overbrugging = frictioneel.

### L15 Beleidsinstrument koppelen aan type werkloosheid
- kern: "Koppel het juiste beleidsinstrument aan elk type werkloosheid: fiscale stimulus voor conjunctureel, herscholing/onderwijs voor structureel, vacaturebemiddeling voor frictioneel."
- needs: [L14]
- exam_codes: [H5.3]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []
- pitfalls:
  - Fiscale stimulus inzetten tegen structurele werkloosheid — werkt niet, want het probleem is mismatch, geen vraag-tekort.

### L16 Werknemers- en werkgeverssurplus bij minimumloon
- kern: "Bereken werknemerssurplus (arbeidsmarkt-CS) en werkgeverssurplus (arbeidsmarkt-PS) voor en na invoering van een minimumloon; identificeer welvaartsverlies als de \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"verloren driehoek\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\" bij W_min > W*."
- needs: [A02, A04, A06, A10, A19, L10]
- exam_codes: [A2.16, D3.10, H5.2]
- mastery_target: apply
- prior_learning: review_and_extend
- aspects: [rekenen, grafisch]
- terms: []
- procedure:
  1. Bereken W* en Q* zonder ingrijpen (zie L10).
  2. Bij W_min > W*: bereken Qd en Qa bij W_min; werkgelegenheid = min(Qd, Qa) = Qd.
  3. Werknemerssurplus = driehoek boven de arbeidsaanbodcurve tot W_min over Qd werkenden.
  4. Werkgeverssurplus = driehoek tussen W_min en de arbeidsvraagcurve over Qd werkenden.
  5. Welvaartsverlies = driehoek tussen W_min en W* over het verschil Qv(W_min) – Q*.
- pitfalls:
  - Qa gebruiken als daadwerkelijke werkgelegenheid bij W_min > W* — de korte zijde (Qd) bepaalt hoeveel banen er zijn.

### L17 CAO als bindende loonafspraak
- layer: 4
- kern: "Leg uit dat een CAO (collectieve arbeidsovereenkomst) dat lonen boven het evenwichtsloon afspreekt werkt als een bindend minimumloon voor de gehele sector, met werkloosheid als gevolg."
- needs: [D16]
- exam_codes: [H5.1, D3.10]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [loonontwikkeling]
- pitfalls:
  - Denken dat CAO alleen loonhoogte betreft — CAO legt ook arbeidsvoorwaarden vast, maar het economische effect is vooral de loonvloer.

### L18 Voordelen en nadelen van vakbonden
- layer: 5
- kern: "Noem voordelen van vakbonden voor werkenden (hogere lonen, betere voorwaarden, collectieve onderhandelingsmacht) en nadelen (hogere loonkosten voor werkgevers, lagere werkgelegenheid, insiders vs outsiders)."
- needs: [L17]
- exam_codes: [H5.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []
- pitfalls:
  - Alleen voor- of alleen nadelen noemen — het is een trade-off; goede antwoorden benoemen beide kanten.

### L19 Loonstarheid
- layer: 3
- kern: "Definieer loonstarheid als de neiging van lonen om traag (vooral omlaag) aan te passen aan veranderingen in arbeidsmarkt-omstandigheden, met als gevolg persistente werkloosheid na een negatieve schok."
- needs: [L09]
- exam_codes: [H5.3, A4.5]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [loonontwikkeling]
- pitfalls:
  - Loonstarheid verwarren met CAO — loonstarheid kan ook zonder CAO bestaan (contracten, psychologische weerstand), CAO is één institutionele oorzaak.

### L20 Loonflexibiliteit versus actief arbeidsmarktbeleid
- kern: "Vergelijk twee beleidsreacties op werkloosheid: verlagen van de loonvloer (wacht op loondaling) versus actief arbeidsmarktbeleid (herscholing, bemiddeling); beoordeel op effectiviteit per type werkloosheid."
- needs: [L19]
- exam_codes: [H5.3]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []
- procedure:
  1. Identificeer het dominante type werkloosheid (conjunctureel/structureel/frictie).
  2. Redeneer wat loonverlaging zou doen: effectief bij CAO-loonvloer, ineffectief bij structurele mismatch.
  3. Redeneer wat actief beleid zou doen: effectief bij structurele mismatch, overbodig bij simpele frictie.
  4. Concludeer welke combinatie past bij de case.
- pitfalls:
  - Één maatregel als "beste" bestempelen zonder de oorzaak van de werkloosheid te benoemen.

### L21 Standpuntbepaling minimumloon
- kern: "Schrijf een beoordeel-antwoord over het minimumloon dat beide kanten benoemt: hogere lonen voor wie nog werk heeft versus werkloosheid voor wie uitgeprijsd wordt; onderbouw met surplus-berekeningen."
- needs: [L16]
- exam_codes: [A4.1, A4.5, H5.2]
- mastery_target: evaluate
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []
- procedure:
  1. Noem het argument voor: werknemerssurplus stijgt per nog-werkende; bereken hoeveel.
  2. Noem het argument tegen: werkgelegenheid daalt; bereken hoeveel banen verloren gaan en welvaartsverlies.
  3. Benoem wie wint (insiders) en wie verliest (outsiders, werkgevers).
  4. Trek een conclusie die beide kanten weegt — geen one-sided standpunt.
- pitfalls:
  - Alleen de winnaars benoemen (eenzijdige standpuntbepaling levert nooit volle punten op).
