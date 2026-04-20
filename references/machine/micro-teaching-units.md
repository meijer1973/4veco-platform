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

Eleven domain prefixes match the CvTE examenprogramma exactly:

| Prefix | CvTE domain | Scope |
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
- exam_codes: [<CvTE eindterm codes, e.g. D3.2, A4.1>]  # optional
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
*144 live units as of 2026-04-20 — A=37, D=30, E=6, F=15, G=11, H=26, I=19.*

*144 live units as of 2026-04-20 — A=37, D=30, E=6, F=15, G=11, H=26, I=19.*


*B/C/J/K are still empty by design — they cover school-exam domains that no exercise has yet driven a unit mint for. Units appear when exercises demand them (see `knowledge/micro-teaching-units-plan.md` §9).*

<!-- UNIT ENTRIES BELOW THIS LINE — managed by build-scripts/references/unit-*.js -->

### A01 Lineaire functie opstellen
- layer: 0
- duration_min: 5
- kern: "Stel een lineaire functie op (y = ax + b) vanuit een economische context, zoals een vraag- of aanbodfunctie."
- needs: []
- mastery_target: apply
- prior_learning: previously_taught
- aspects: [rekenen]
- terms: []
- pitfalls:
  - Let op de volgorde: als je Qv als functie van P opstelt, dan is P de x en Q de y.
- generator: GEN_A01

### A02 Vergelijking oplossen
- layer: 0
- duration_min: 5
- kern: "Los een vergelijking met één onbekende op, bijvoorbeeld door twee functies aan elkaar gelijk te stellen."
- needs: []
- mastery_target: apply
- prior_learning: previously_taught
- aspects: [rekenen, verbaal]
- terms: []
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
- mastery_target: apply
- prior_learning: previously_taught
- aspects: [rekenen]
- terms: []
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
- mastery_target: apply
- prior_learning: previously_taught
- aspects: [rekenen, verbaal]
- terms: []
- pitfalls:
  - Bij 0,5Q² moet je eerst Q kwadrateren en dan pas vermenigvuldigen met 0,5.
- generator: GEN_A04

### A05 Snijpunt met P-as berekenen
- layer: 0
- duration_min: 5
- kern: "Bereken het snijpunt van een functie met de verticale as (P-as) door Q = 0 in te vullen."
- needs: []
- mastery_target: apply
- prior_learning: previously_taught
- aspects: [grafisch, rekenen]
- terms: []
- pitfalls:
  - Verwar het snijpunt met de P-as niet met het snijpunt met de Q-as.
- generator: GEN_A05

### A06 Evenwichtsprijs & -hoeveelheid
- layer: 1
- duration_min: 5
- kern: "Bereken de evenwichtsprijs en -hoeveelheid door vraag en aanbod aan elkaar gelijk te stellen."
- needs: [A01, A02]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [evenwichtsprijs]
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
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen, verbaal]
- terms: []
- pitfalls:
  - Vergeet niet de haakjes als je P × Q uitrekent!
- generator: GEN_A07

### A08 TK-functie herkennen
- layer: 1
- duration_min: 5
- kern: "Herken en werk met de totale kostenfunctie (TK), vaak gegeven als TK = vaste kosten + variabele kosten × Q."
- needs: [A01]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [variabele kosten]
- pitfalls:
  - Bij TK = 12Q + 0,3Q² denken leerlingen soms dat er geen vaste kosten zijn.
- generator: GEN_A08

### A09 Collectief aanbod
- layer: 1
- duration_min: 5
- kern: "Tel individuele aanbodfuncties op tot een collectieve aanbodfunctie."
- needs: [A03]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: []
- pitfalls:
  - Als je Qa = 50 × (−5 + 2P) uitwerkt, vergeet dan niet BEIDE termen te vermenigvuldigen: 50 × −5 = −250 en 50 × 2P = 100P.
- generator: GEN_A09

### A10 Oppervlakte driehoek
- layer: 1
- duration_min: 5
- kern: "Bereken de oppervlakte van een driehoek in een grafiek: ½ × basis × hoogte."
- needs: [A04]
- mastery_target: apply
- prior_learning: previously_taught
- aspects: [grafisch, rekenen]
- terms: []
- pitfalls:
  - Verwar de hoogte niet met de P-waarde zelf.
- generator: GEN_A10

### A11 Afgeleide bepalen
- layer: 1
- duration_min: 5
- kern: "Bepaal de afgeleide van een functie. Bijvoorbeeld: als TO = 5Q², dan is MO = 10Q."
- needs: [A01]
- mastery_target: apply
- prior_learning: previously_taught
- aspects: [rekenen]
- terms: []
- pitfalls:
  - Een veelgemaakte fout: de constante vergeten te schrappen.
- generator: GEN_A11

### A12 MO bepalen
- layer: 2
- duration_min: 5
- kern: "Bepaal de marginale opbrengst (MO) door de afgeleide van de TO-functie te nemen."
- needs: [A11, A07]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen]
- terms: []
- pitfalls:
  - MO is niet hetzelfde als de prijs!
- generator: GEN_A12

### A13 MK bepalen
- layer: 2
- duration_min: 5
- kern: "Bepaal de marginale kosten (MK) door de afgeleide van de TK-functie te nemen."
- needs: [A11, A08]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [marginale kosten]
- pitfalls:
  - Verwar MK niet met GTK (gemiddelde totale kosten).
- generator: GEN_A13

### A14 GTK bepalen
- layer: 2
- duration_min: 5
- kern: "Bereken de gemiddelde totale kosten: GTK = TK / Q."
- needs: [A08]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [gemiddelde totale kosten]
- pitfalls:
  - Deel ELKE term apart door Q!
- generator: GEN_A14

### A15 Prijselasticiteit van de vraag
- layer: 1
- duration_min: 5
- kern: "Bereken de prijselasticiteit: Ev = %ΔQv / %ΔP. Bepaal of de vraag elastisch of inelastisch is."
- needs: [A04]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [prijselasticiteit van de vraag]
- pitfalls:
  - Vergeet het minteken niet!
- generator: GEN_A15

### A16 Kruiselasticiteit
- layer: 1
- duration_min: 5
- kern: "Bereken de kruiselasticiteit: Ekr = %ΔQa / %ΔPb. Bepaal of goederen substituten of complementen zijn."
- needs: []
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: []
- pitfalls:
  - Let goed op welk product de Q is en welk product de P.
- generator: GEN_A16

### A17 Inkomenselasticiteit
- layer: 1
- duration_min: 5
- kern: "Bereken de inkomenselasticiteit: Ei = %ΔQ / %ΔY. Bepaal of een goed normaal, inferieur of luxe is."
- needs: []
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [inkomenselasticiteit]
- pitfalls:
  - Verwar inkomenselasticiteit niet met prijselasticiteit!
- generator: GEN_A17

### A18 Comparatief voordeel bepalen
- layer: 1
- duration_min: 5
- kern: "Vergelijk de alternatieve kosten van twee producenten om te bepalen wie een comparatief voordeel heeft."
- needs: []
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: []
- pitfalls:
  - Verwar absoluut en comparatief voordeel niet!
- generator: GEN_A18

### A19 Surplus berekenen (CS/PS)
- layer: 3
- duration_min: 5
- kern: "Bereken het consumenten- of producentensurplus als driehoeksoppervlakte in de vraag-/aanbodgrafiek."
- needs: [A06, A10]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen, verbaal]
- terms: [producentensurplus]
- pitfalls:
  - Vergeet niet om de vraaglijn om te schrijven naar P als functie van Q voordat je Pmax bepaalt.
- generator: GEN_A19

### A20 MO = MK oplossen
- layer: 3
- duration_min: 5
- kern: "Vind de winstmaximaliserende hoeveelheid door MO gelijk te stellen aan MK en op te lossen."
- needs: [A12, A13, A02]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: []
- pitfalls:
  - Verwar MO niet met de prijs!
- generator: GEN_A20

### A21 Winst = TO − TK
- layer: 3
- duration_min: 5
- kern: "Bereken de winst door de totale opbrengst min de totale kosten: W = TO − TK."
- needs: [A07, A08, A04]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [totale kosten, totale opbrengst, winst]
- pitfalls:
  - Vergeet de constante kosten niet!
- generator: GEN_A21

### A22 Break-even (TO = TK)
- layer: 3
- duration_min: 5
- kern: "Vind de break-evenhoeveelheid door TO = TK op te lossen. Bij dit punt is de winst nul."
- needs: [A07, A08, A02]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [winst]
- pitfalls:
  - Bij het herschrijven naar de standaardvorm verplaats je alle termen naar één kant.
- generator: GEN_A22

### A23 Evenwicht met heffing
- layer: 3
- duration_min: 5
- kern: "Bereken het nieuwe marktevenwicht nadat de overheid een heffing (accijns) heeft opgelegd."
- needs: [A06, A01]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [marktevenwicht]
- pitfalls:
  - Let op het teken!
- generator: GEN_A23

### A24 Collectief aanbod bepalen
- layer: 3
- duration_min: 5
- kern: "Bepaal het collectieve aanbod vanuit meerdere individuele aanbieders en bereken het marktevenwicht."
- needs: [A09, A03]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [marktevenwicht]
- pitfalls:
  - Als bedrijven een verschillende minimumprijs hebben, biedt het ene bedrijf al aan terwijl het andere nog niet produceert.
- generator: GEN_A24

### A25 Minimumprijs analyseren
- layer: 3
- duration_min: 5
- kern: "Analyseer het effect van een minimumprijs: bereken het vraagoverschot en het welvaartsverlies."
- needs: [A06]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []
- pitfalls:
  - Bij een minimumprijs bepaalt de vraagzijde hoeveel er verhandeld wordt, niet het aanbod.
- generator: GEN_A25

### A26 Maximumprijs analyseren
- layer: 3
- duration_min: 5
- kern: "Analyseer het effect van een maximumprijs: bereken het vraagoverschot en de gevolgen voor consumenten."
- needs: [A06]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []
- pitfalls:
  - Bij een maximumprijs bepaalt de aanbodzijde hoeveel er verhandeld wordt.
- generator: GEN_A26

### A27 Subsidie analyseren
- layer: 3
- duration_min: 5
- kern: "Bereken het effect van een subsidie op het marktevenwicht, de prijs en de verdeling van het voordeel."
- needs: [A06, A01]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen, verbaal]
- terms: [marktevenwicht]
- pitfalls:
  - Bij een subsidie ontvangt de producent P + s, niet P − s.
- generator: GEN_A27

### A28 MK = GTK oplossen
- layer: 3
- duration_min: 5
- kern: "Vind de hoeveelheid waar MK = GTK. Dit is het minimum van de GTK-curve (efficiënte schaal)."
- needs: [A13, A14]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen]
- terms: []
- pitfalls:
  - GTK is niet de afgeleide van TK!
- generator: GEN_A28

### A29 Break-even analyse
- layer: 4
- duration_min: 5
- kern: "Voer een volledige break-evenanalyse uit: vind de break-evenhoeveelheid en bepaal winst/verlies bij een gegeven Q."
- needs: [A22]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [winst]
- pitfalls:
  - Bij het herschrijven naar de standaardvorm verandert het teken van de Q-term.
- generator: GEN_A29

### A30 Consumentensurplus
- layer: 4
- duration_min: 5
- kern: "Bereken het consumentensurplus voor en na een beleidsverandering en bepaal het verschil."
- needs: [A19]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [consumentensurplus]
- pitfalls:
  - Pmax is niet de coëfficiënt vóór P in de vraaglijn.
- generator: GEN_A30

### A31 Individueel → collectief aanbod
- layer: 4
- duration_min: 5
- kern: "Ga van individuele aanbodcurves naar de collectieve aanbodcurve en bereken het marktevenwicht."
- needs: [A24]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [marktevenwicht]
- pitfalls:
  - Als groep B een minimumprijs van €8 heeft en je rekent bij P = 6, dan is Qi_B = (6−8)/2 = −1.
- generator: GEN_A31

### A32 Welvaartsverlies belasting
- layer: 5
- duration_min: 5
- kern: "Bereken het welvaartsverlies (deadweight loss) dat ontstaat door een belasting als driehoeksoppervlakte."
- needs: [A19, A23]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, rekenen]
- terms: []
- pitfalls:
  - Verwar het welvaartsverlies niet met de totale belastingopbrengst.
- generator: GEN_A32

### A33 Optimale productie bij VM
- layer: 4
- duration_min: 5
- kern: "Bepaal de optimale productie bij volkomen mededinging: produceer waar P = MK en bereken de winst."
- needs: [A13, A14, A04]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [winst]
- pitfalls:
  - Winst is niet P × Q!
- generator: GEN_A33

### A34 Effecten invoerrecht
- layer: 5
- duration_min: 5
- kern: "Analyseer de effecten van een invoerrecht op binnenlandse productie, consumptie, import en welvaart."
- needs: [A19, A23, A06]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: []
- pitfalls:
  - Het invoerrecht verandert niet de binnenlandse vraag- of aanbodfuncties zelf.
- generator: GEN_A34

### A35 Max. winst monopolist
- layer: 5
- duration_min: 5
- kern: "Bereken de maximale winst van een monopolist: vind Q waar MO = MK, bepaal P en reken W = TO − TK uit."
- needs: [A20, A21, A04]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [winst]
- pitfalls:
  - Gebruik niet MO als prijs!
- generator: GEN_A35

### A36 Prijsdiscriminatie
- layer: 5
- duration_min: 5
- kern: "Bereken de winst bij prijsdiscriminatie: de monopolist rekent verschillende prijzen in verschillende markten."
- needs: [A20, A21]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [prijsdiscriminatie, winst]
- pitfalls:
  - Gebruik niet dezelfde Q voor beide markten!
- generator: GEN_A36

### A37 Lange-termijnevenwicht VM
- layer: 5
- duration_min: 5
- kern: "Bepaal het lange-termijnevenwicht bij volkomen mededinging: P = MK = GTK (minimale GTK)."
- needs: [A28]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: []
- pitfalls:
  - Winst = 0 betekent niet dat het bedrijf geen geld verdient!
- generator: GEN_A37

### D01 Accijnsopbrengst uit grafiek
- kern: "Bepaal accijnsopbrengst door verhandelde hoeveelheid na belasting met belastingbedrag te vermenigvuldigen."
- needs: [D05]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [grafisch, verbaal]
- terms: [heffingen]
- procedure:
  1. Lees de verhandelde hoeveelheid na heffing (Q_na) af op de horizontale as
  2. Lees het belastingbedrag per eenheid (t) af als verticale afstand tussen aanbod-met-heffing en oorspronkelijk aanbod
  3. Bereken accijnsopbrengst = t × Q_na
  4. Controleer de eenheid (bijvoorbeeld euro's per periode)

### D02 Constante kosten en winst
- kern: "Constante kosten beïnvloeden break-even analyse maar niet het MO = MK optimum."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [constante kosten, winst]

### D03 Consumentensurplus en accijns
- kern: "Accijns verhoogt prijs, consumenten betalen meer, consumentensurplus daalt."
- needs: [D05, A30]
- exam_codes: [D3.1]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [consumentensurplus]
- procedure:
  1. Bepaal het oorspronkelijke consumentensurplus (CS_voor) als driehoek boven P* tot Pmax (zoals in A30)
  2. Bereken het nieuwe marktevenwicht na heffing (zoals in D05): nieuwe prijs P_na
  3. Bepaal het nieuwe consumentensurplus (CS_na) boven P_na
  4. Bereken de afname: ΔCS = CS_voor − CS_na
  5. Interpreteer wie het surplusverlies draagt

### D04 Elasticiteit en goederenclassificatie
- kern: "Gebruik inkomenselasticiteit om goederen te classificeren als inferieur, normaal of luxe."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [inkomenselasticiteit]

### D05 Evenwicht bij accijns
- kern: "Bereken nieuw evenwicht en accijnsopbrengst na invoering van een heffing."
- needs: [A23]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [marktevenwicht, heffingen]
- procedure:
  1. Schrijf de aanbodfunctie om naar P als functie van Q
  2. Verhoog de prijsterm met het heffingsbedrag t: P_aanbod_nieuw = P_aanbod_oud + t
  3. Schrijf terug naar Q als functie van P en stel gelijk aan de vraagfunctie (zoals in A06)
  4. Los op naar P* (nieuwe evenwichtsprijs) en bereken Q* (nieuwe evenwichtshoeveelheid)
  5. Bereken accijnsopbrengst = t × Q*

### D06 Vraagreactie via prijselasticiteit interpreteren
- kern: "Gebruik de prijselasticiteit van de vraag (Ev) om te voorspellen hoe Qv reageert op een prijsverandering en verklaar het resultaat in context."
- needs: []
- exam_codes: [D1.3]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [prijselasticiteit van de vraag]

### D07 Heffing doorberekenen in prijs
- kern: "Bereken welk percentage van een heffing wordt doorberekend in de consumentenprijs via evenwichtsanalyse."
- needs: [D05, A15]
- exam_codes: [D1.4a]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [heffingen, evenwichtsprijs]
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
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [heffingen]

### D09 Homogene en heterogene goederen
- kern: "Homogene goederen zijn identiek; heterogene goederen verschillen in kwaliteit of kenmerken."
- needs: []
- exam_codes: [D2.1]
- mastery_target: understand
- prior_learning: previously_taught
- aspects: [verbaal]
- terms: []

### D10 Vraag/aanbod-verschuiving bij conjunctuurschok
- kern: "Analyseer hoe een conjunctuurschok de collectieve vraaglijn of aanbodlijn verschuift en wat dit doet met evenwichtsprijs en -hoeveelheid."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [collectieve vraaglijn, collectieve aanbodlijn]

### D11 Inkomenselasticiteit berekenen en interpreteren
- kern: "Bereken Ei uit twee waarnemingen en interpreteer de uitkomst in de context van het goed."
- needs: [A17]
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
- kern: "Analyseer hoe een stijging van productiekosten (zoals loon per eenheid product) de collectieve aanbodlijn verschuift en doorwerkt in evenwichtsprijs."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [collectieve aanbodlijn]

### D14 Marktfalen en overheidsinterventie beoordelen
- kern: "Beoordeel of marktwerking tot een doelmatige uitkomst leidt en of overheidsinterventie gerechtvaardigd is."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [marktmacht]

### D15 Marktvormen classificeren
- kern: "Classificeer markten aan hand van aantal aanbieders, aard van goederen en toetreding."
- needs: []
- exam_codes: [D2.1]
- mastery_target: understand
- prior_learning: previously_taught
- aspects: [verbaal]
- terms: [marktvormen]

### D16 Minimumprijs en werkloosheid
- kern: "Minimumloon boven marktloon veroorzaakt vraagoverschot van arbeid en werkloosheid."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [minimumprijzen]

### D17 Monopolie minimaal verlies
- kern: "Onderneming met alleen vaste kosten heeft MK = 0, dus MK = GVK. Minimaal verlies waar prijs totale opbrengst dekt."
- needs: [A14]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [marginale kosten, totale opbrengst]

### D18 Monopolie met prijsdiscriminatie
- kern: "Bepaal hoe monopolist winst behaalt via prijsdiscriminatie over verschillende markten."
- needs: [D23, A36]
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
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [subsidies, Pareto efficient]

### D20 Pareto-efficiëntie in marktevenwicht
- kern: "Leg uit wanneer een marktevenwicht Pareto-efficiënt is."
- needs: [A19]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [marktevenwicht, Pareto efficient]

### D21 Prijsdiscriminatie over inkomensgroepen
- kern: "Analyseer hoe bedrijven prijzen differentieren en welvaartsgevolgen per inkomensgroep."
- needs: [D18, D28]
- exam_codes: [D2.3]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [prijsdiscriminatie]
- procedure:
  1. Identificeer de inkomensgroepen en hun vraagfuncties (lage vs. hoge Ev)
  2. Bereken prijs en hoeveelheid per groep bij prijsdiscriminatie (zoals in D18)
  3. Bepaal CS per groep en vergelijk met de situatie zonder prijsdiscriminatie
  4. Benoem welke groep welvaartswinst of -verlies ondervindt
  5. Beoordeel de herverdelende gevolgen in termen van totale surplus

### D22 Prijsdiscriminatie en subsidies
- kern: "Herken of subsidies prijsdiscriminatie veroorzaken en analyseer gevolgen."
- needs: [D23, A27]
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

### D24 Drie voorwaarden prijsdiscriminatie
- kern: "Leg uit drie voorwaarden: voldoende marktmacht, markten scheiden, verschillende prijselasticiteiten."
- needs: [D23]
- exam_codes: [D2.3]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [marktmacht, prijsdiscriminatie]

### D25 Prijselasticiteit en omzet
- kern: "Bij inelastische vraag leidt grotere hoeveelheid tot lagere prijs; totale omzet kan dalen."
- needs: [A15]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [prijselasticiteit van de vraag, totale opbrengst]

### D26 Soorten variabele kosten classificeren
- kern: "Onderscheid tussen degressief, progressief en proportioneel variabele kosten."
- needs: [A08]
- mastery_target: understand
- prior_learning: previously_taught
- aspects: [verbaal]
- terms: [variabele kosten]

### D27 Substituten en complementen
- kern: "Substituten vervangen elkaar; complementen worden samen gebruikt."
- needs: []
- mastery_target: understand
- prior_learning: previously_taught
- aspects: [verbaal]
- terms: [substitueerbaarheid, complementariteit]

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
- aspects: [grafisch]
- terms: [subsidies, verloren surplus]
- procedure:
  1. Teken vraag- en aanbodlijn en markeer het oorspronkelijke evenwicht (P*, Q*)
  2. Verschuif de aanbodlijn omlaag met het subsidiebedrag s en bepaal Q_na
  3. Identificeer de welvaartsverliesdriehoek: hoekpunten bij Q*, Q_na en de twee curves
  4. Arceer het driehoekje tussen vraag en oorspronkelijk aanbod, tussen Q* en Q_na
  5. Bereken de oppervlakte = ½ × (Q_na − Q*) × s

### D30 Winstmaximalisatie MO = MK
- kern: "Winstmaximale hoeveelheid vind je waar marginale opbrengst gelijk is aan marginale kosten."
- needs: [A12, A13, A20]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [marginale kosten, marginale opbrengsten, winst]
- procedure:
  1. Bepaal MO uit de TO-functie (zoals in A12)
  2. Bepaal MK uit de TK-functie (zoals in A13)
  3. Stel MO = MK en los op naar Q (zoals in A20)
  4. Vul Q in de vraagfunctie (of GO-functie) om de prijs P te bepalen
  5. Bereken de winst W = TO − TK bij deze Q

### E01 Intergenerationele ruil
- kern: "Analyseer hoe pensioenstelsels intergenerationele ruil faciliteren."
- needs: []
- exam_codes: [E2.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []

### E02 Intertemporele ruil in pensioenstelsels
- kern: "Leg uit hoe pensioenen ruil over tijd vertegenwoordigen."
- needs: []
- exam_codes: [E1.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [intertemporele ruil]

### E03 Kapitaaldekking en renteeffecten
- kern: "Analyseer hoe rentes de betaalbaarheid van kapitaalgedekte pensioenen onder druk zetten."
- needs: []
- exam_codes: [E1.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []

### E04 Omslagstelsel (AOW)
- kern: "Omslagstelsel: werkenden betalen premie voor huidige uitkeringen; gevoelig voor vergrijzing."
- needs: []
- exam_codes: [E2.1]
- mastery_target: understand
- prior_learning: previously_taught
- aspects: [verbaal]
- terms: []

### E05 Verlaging pensioenuitkeringen en solidariteit
- kern: "Analyseer hoe verlaging van pensioenuitkeringen de solidariteit tussen generaties beïnvloedt."
- needs: []
- exam_codes: [E2.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []

### E06 Voorraad- en stroomgrootheden onderscheiden
- kern: "Onderscheid tussen voorraad- en stroomgrootheden."
- needs: []
- mastery_target: understand
- prior_learning: previously_taught
- aspects: [verbaal]
- terms: [voorraad- en stroomgrootheden]

### F01 Berovingsprobleem
- kern: "Bedrijf investeert in specifieke technologie; het loopt risico dat partner contract breekt na de investering."
- needs: []
- exam_codes: [F2.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [berovingsprobleem, risico]

### F02 Collectief goed classificeren
- kern: "Herken collectieve goederen aan hand van excludeerbaarheid en rivaliteit."
- needs: []
- exam_codes: [F2.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [collectieve goederen]

### F03 Dominante strategie
- kern: "Dominante strategie is de beste keuze voor een speler ongeacht wat de ander doet."
- needs: []
- exam_codes: [F1.5]
- mastery_target: understand
- prior_learning: previously_taught
- aspects: [verbaal]
- terms: [dominante strategie]

### F04 Duopolie en spelmatrixanalyse
- kern: "Analyseer dominante strategieën en winstmaximalisatie in een duopol via pay-off matrix."
- needs: []
- exam_codes: [F1.4]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [dominante strategie, pay-off matrix]

### F05 Emissierechten als prikkel
- kern: "Emissierechten geven bedrijven een prikkel om te verduurzamen door kosten van vervuiling."
- needs: []
- exam_codes: [F2.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []

### F06 Externe effecten en innovatieprikkel
- kern: "Belastingen op negatieve externe effecten creeren een prikkel voor innovatie in schonere technologie."
- needs: []
- exam_codes: [F2.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [externe effecten]

### F07 Externe effecten in marktbeslissingen
- kern: "Erken dat negatieve externe effecten leiden tot overproductie vanuit maatschappelijk perspectief."
- needs: []
- exam_codes: [F2.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [externe effecten]

### F08 Negatieve externe effecten
- kern: "Overmatige consumptie met negatieve externe effecten leidt tot maatschappelijk welvaartsverlies."
- needs: []
- exam_codes: [F2.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [externe effecten]

### F09 Gevangenendilemma
- kern: "Situatie waarbij dominante strategie leidt tot suboptimale uitkomst voor beide spelers."
- needs: []
- exam_codes: [F1.5]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [dominante strategie, gevangenendilemma]

### F10 Internalisatie van externe effecten
- kern: "Prijs gelijk aan maatschappelijke kosten zorgt ervoor dat externe effecten geinternaliseerd worden."
- needs: []
- exam_codes: [F2.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [externe effecten]

### F11 Lumpsum-financiering en externe effecten
- kern: "Leg uit hoe een lumpsum-financiering positieve externe effecten internaliseert."
- needs: []
- exam_codes: [F2.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [externe effecten]

### F12 Nash-evenwicht identificeren
- kern: "Bepaal het Nash-evenwicht uit een pay-off matrix met twee spelers."
- needs: []
- exam_codes: [F1.4]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [Nash-evenwicht, pay-off matrix]

### F13 Opzegtermijn en loonkosten
- kern: "Leg uit hoe kortere opzegtermijnen via berovingsprobleem tot hogere loonkosten leiden."
- needs: []
- exam_codes: [F2.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [berovingsprobleem]

### F14 Toerismeconcentratie en externe effecten
- kern: "Analyseer hoe concentratie van toerisme negatieve externe effecten veroorzaakt."
- needs: []
- exam_codes: [F2.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [externe effecten]

### F15 Verzonken kosten en beslissingen
- kern: "Hoge verzonken kosten kunnen bedrijven aanmoedigen andere markten te zoeken."
- needs: []
- exam_codes: [F2.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [verzonken kosten]

### G01 AI en risicoinschatting
- kern: "Betere risicoinschatting met AI kan averechtse selectie verminderen."
- needs: []
- exam_codes: [G3.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []

### G02 Averechtse selectie herkennen
- kern: "Herken averechtse selectie als gevolg van informatieasymmetrie op markten."
- needs: []
- exam_codes: [G3.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [informatieasymmetrie]

### G03 Broodfonds: informatie en risicovermindering
- kern: "In een broodfonds is er geen asymmetrische informatie omdat deelnemers elkaar goed kennen en vertrouwen."
- needs: []
- exam_codes: [G3.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []

### G04 Eigen risico en moral hazard
- kern: "Eigen risico geeft verzekerden een prikkel om voorzichtiger te handelen."
- needs: []
- exam_codes: [G4.5]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [eigen risico]

### G05 Principaal-agent overheid en markt
- kern: "Beschrijf hoe mededingingsautoriteit en manager belangen verschillen."
- needs: []
- exam_codes: [G3.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []

### G06 Principaal-agentprobleem identificeren
- kern: "Identificeer principaal-agentrelaties en de problemen die daaruit voortvloeien."
- needs: []
- exam_codes: [G3.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []

### G07 Transactiekosten
- kern: "Bereken en interpreteer transactiekosten bij ruil."
- needs: []
- exam_codes: [G2.1]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [transactiekosten]

### G08 Vereveningsfonds voor risicodeling
- kern: "Gemeenschappelijk fonds kan risico's uitvlakken en kostenverschillen compenseren."
- needs: []
- exam_codes: [G3.3]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [risico]

### G09 Solidariteit in verzekeringen
- kern: "Gepersonaliseerde premies op basis van individueel risicoprofiel ondermijnen solidariteit."
- needs: []
- exam_codes: [G3.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []

### G10 Informatieasymmetrie verzekeringsmarkt
- kern: "Informatieongelijkheid tussen verzekeraar en klant kan selectie- en moraalrisicoproblemen veroorzaken."
- needs: []
- exam_codes: [G2.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [informatieasymmetrie]

### G11 Wisselkoersrisico bij valutabetaling
- kern: "Leg uit hoe appreciatie van de euro de werkelijke opbrengsten van exporteurs nadelig beïnvloedt."
- needs: []
- exam_codes: [G2.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []

### H01 AOW-leeftijd als houdbaarheidsinstrument
- kern: "Leg uit hoe een hogere AOW-leeftijd via premiegrondslag en uitkeringsduur de houdbaarheid van het AOW-stelsel verbetert bij vergrijzing."
- needs: []
- exam_codes: [H5.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [welvaartsvaste pensioenen, waardevaste pensioenen]

### H02 AIQ (arbeidsinkomenquote) berekenen
- kern: "Bereken de arbeidsinkomenquote: (arbeidsinkomen / nationaal inkomen) x 100%."
- needs: [A02]
- exam_codes: [H1.1]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [primair inkomen]
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
- terms: [prijselasticiteit van de vraag]
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
- terms: [marginaal tarief, gemiddeld tarief]
- procedure:
  1. Noteer per schijf het marginale tarief en de bovengrens
  2. Bepaal in welke schijf het belastbaar inkomen valt
  3. Bereken per volledig gevulde schijf: (bovengrens − ondergrens) × marginaal tarief
  4. Bereken voor de laatste schijf: (belastbaar inkomen − ondergrens schijf) × marginaal tarief
  5. Tel de schijfbedragen op tot totale inkomstenbelasting
  6. Bereken eventueel gemiddeld tarief = totale belasting / belastbaar inkomen × 100%

### H05 Circulaire economie in groen bbp
- kern: "Leg uit hoe circulaire productie via minder milieuschade en minder grondstofgebruik het groen bbp per hoofd verhoogt."
- needs: []
- exam_codes: [H3.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [groen bbp per hoofd]

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
- terms: [denivelleren, marginaal tarief]

### H09 Kostenvoordeel exporteurs als protectionisme
- kern: "Beargumenteer wanneer een kostenvoordeel voor binnenlandse exporteurs (bv. gratis toegewezen emissierechten) feitelijk werkt als protectionisme tegen buitenlandse concurrenten."
- needs: [H03]
- exam_codes: [H1.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [subsidies, heffingen]

### H10 Gini-coefficient bij recessie
- kern: "Gini-coefficient stijgt tijdens recessie door werkloosheidsconcentratie en toename inkomensongelijkheid."
- needs: []
- exam_codes: [H4.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [Gini-coefficient, conjuncturele werkloosheid]

### H11 Groen bbp en CO2
- kern: "Lagere CO2-uitstoot vergroot groen bbp; minder productie wegens minder emissierechten verkleint het."
- needs: [H05, H06]
- exam_codes: [H3.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [groen bbp per hoofd]

### H12 Houdbaarheidssaldo
- kern: "Het houdbaarheidssaldo geeft aan of overheidsvoorzieningen op lange termijn betaalbaar blijven; stijgende grijze druk verslechtert het saldo."
- needs: [H01]
- exam_codes: [H5.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [staatsschuld]

### H13 Minimumuurloon: kostenkanaal naar concurrentiepositie
- kern: "Redeneer via het kostenkanaal hoe een hoger minimumuurloon de internationale concurrentiepositie kan verslechteren."
- needs: []
- exam_codes: [H1.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [wisselkoers]

### H14 Minimumuurloon: vraagkanaal naar bbp-groei
- kern: "Redeneer via het bestedingskanaal hoe een hoger minimumuurloon de consumptie en daarmee de bbp-groei kan verhogen."
- needs: []
- exam_codes: [H1.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [koopkracht, bbp-groei]

### H15 Nominale rente op staatsobligaties verklaren
- kern: "Verklaar bewegingen in de nominale rente op staatsobligaties vanuit vraag-en-aanbod op de obligatiemarkt en risicoperceptie."
- needs: [H21]
- exam_codes: [H5.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [rente, obligaties, risico]

### H16 Soepeler ontslagrecht en werkgeversrisico
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
- terms: [marginaal tarief, gemiddeld tarief]
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
- terms: [primair inkomen]

### H21 Staatsschuldquote berekenen
- kern: "Bereken staatsschuldquote = staatsschuld / bbp x 100% en bepaal drempels voor duurzaamheid."
- needs: []
- exam_codes: [H5.1]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [staatsschuld, bbp-niveau]
- procedure:
  1. Bepaal de staatsschuld in euro's (stand aan het einde van het jaar)
  2. Bepaal het bbp in euro's over hetzelfde jaar
  3. Bereken staatsschuldquote = staatsschuld / bbp × 100%
  4. Vergelijk met de 60%-drempel uit het Stabiliteits- en Groeipact
  5. Analyseer dynamiek: quote daalt als bbp-groei groter is dan de groei van de staatsschuld

### H22 Belastingtariefaanpassing en secundaire inkomenseffecten
- kern: "Analyseer hoe een wijziging in belastingtarieven via veranderd besteedbaar inkomen de vraag en daarmee secundaire inkomenseffecten oproept."
- needs: [H04, H08]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [secundair inkomen, marginaal tarief]

### H23 Belastingwig en uitverdieneffect op arbeidsaanbod
- kern: "Leg uit hoe een hogere belastingwig via het substitutie-effect het arbeidsaanbod verkleint (uitverdieneffect)."
- needs: [H18]
- exam_codes: [H4.6]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [marginaal tarief, uitverdieneffecten, arbeidsaanbod (= beroepsbevolking)]

### H24 Wisselkoers en depreciatie
- kern: "Bereken wisselkoerseffecten van depreciatie en leg uit hoe deze reële inkomens beïnvloeden."
- needs: []
- exam_codes: [H1.1]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [wisselkoers, koopkracht]
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
- terms: [wisselkoers, bbp-groei]

### H26 Koop- versus huurlasten vergelijken
- kern: "Vergelijk netto woonlasten van kopen en huren door rente, aflossing, onderhoud en huurprijs systematisch tegen elkaar af te zetten."
- needs: [H15]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [rente]

### I01 Anticyclisch begrotingsbeleid
- kern: "In laagconjunctuur verhoogt overheid uitgaven of verlaagt belastingen om economie te stimuleren."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [anticyclisch]

### I02 Anticyclische inkomensoverdrachten
- kern: "Leg uit hoe inkomensoverdrachten anticyclisch werken tijdens laagconjunctuur."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [anticyclisch]

### I03 Bedrijfsinvesteringen in laagconjunctuur
- kern: "In laagconjunctuur reageren bedrijfsinvesteringen beperkt op renteverlagingen vanwege lage vraag."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []

### I04 CAO-looptijd en arbeidsmarktrigiditeit
- kern: "Leg uit hoe langere CAO-looptijden arbeidsmarktflexibiliteit en beleid beïnvloeden."
- needs: []
- exam_codes: [I4.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []

### I05 Centrale bank rentebeleid
- kern: "Bepaal wanneer centrale banken rentes verhogen of verlagen."
- needs: []
- mastery_target: apply
- prior_learning: previously_taught
- aspects: [verbaal]
- terms: []

### I06 Deflatie in laagconjunctuur
- kern: "Deflatie versterkt laagconjunctuur doordat consumenten en bedrijven bestedingen uitstellen."
- needs: []
- exam_codes: [I1.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []

### I07 IS-MB-GA-model met outputgap
- kern: "Analyseer relatie tussen outputgap, nominale rente, inflatie en curveverschuivingen in laagconjunctuur."
- needs: []
- exam_codes: [I4.1]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [grafisch, verbaal]
- terms: [rente]

### I08 Keynesiaanse kruis verschuivingen analyseren
- kern: "Analyseer hoe verschuivingen in IS en LM het evenwicht en effectiviteit van beleid beïnvloeden."
- needs: []
- exam_codes: [I4.1, I4.2]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [grafisch, verbaal]
- terms: [Keynesiaanse kruis]

### I09 Koopkracht behouden bij inflatie
- kern: "Bereken nieuwe loon of uitkering om koopkracht gelijk te houden bij inflatie."
- needs: []
- exam_codes: [I1.4]
- mastery_target: apply
- prior_learning: new_this_year
- aspects: [rekenen]
- terms: [koopkracht]

### I10 Loonrigiditeit en GA-curve helling
- kern: "Leg uit hoe loonflexibiliteit de helling van de GA-curve beïnvloedt."
- needs: []
- exam_codes: [I4.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [grafisch, verbaal]
- terms: [GA-curve]

### I11 Monetair beleid bij starre vs flexibele arbeidsmarkt
- kern: "Vergelijk effectiviteit van renteverlagingen onder starre versus flexibele arbeidsmarktomstandigheden."
- needs: []
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []

### I12 Monetair beleid en wisselkoers
- kern: "Renteverlaging verlaagt rente en veroorzaakt depreciatie van de valuta, wat exportcompetitiviteit verbetert."
- needs: []
- exam_codes: [I1.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [rente, wisselkoers]

### I13 Monetair trilemma
- kern: "Analyseer beleidsopties (vast wisselkoers, onafhankelijk beleid, kapitaalverkeer) in multinationale context."
- needs: []
- exam_codes: [I1.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [wisselkoers]

### I14 Multiplier en lekkages
- kern: "Begrijp hoe autonome bestedingen via de multiplier en lekkages het inkomen beïnvloeden."
- needs: []
- exam_codes: [I4.1]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []

### I15 Output gap en economische schokken
- kern: "Analyseer hoe schokken een negatieve of positieve output gap veroorzaken."
- needs: []
- exam_codes: [I4.2]
- mastery_target: analyze
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []

### I16 Overheidssaldo verandering
- kern: "Overheidssaldo kan veranderen door belasting- of uitgavenveranderingen."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []

### I17 Rentebeleid en economische gevolgen
- kern: "Renteverhoging verkrapt de economie; renteverlaging stimuleert."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: []

### I18 Werkelijk versus nominaal eigen risico
- kern: "Analyseer hoe inflatie het werkelijk draagvermogen van een nominaal vast eigen risico beïnvloedt."
- needs: []
- exam_codes: [I1.4]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [verbaal]
- terms: [eigen risico]

### I19 Wisselkoerseffect van monetair beleid
- kern: "Leg uit hoe monetaire beleidsmaatregelen via de wisselkoers de conjunctuur beïnvloeden."
- needs: []
- exam_codes: [I1.2]
- mastery_target: understand
- prior_learning: new_this_year
- aspects: [rekenen, verbaal]
- terms: [wisselkoers]
