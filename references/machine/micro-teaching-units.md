# Micro-teaching Units — Canonical Registry

**Do not hand-edit this file.** All changes flow through `build-scripts/references/unit-*.js`. Hand-edits are flagged and reverted by the next script run. See `knowledge/micro-teaching-units-plan.md` for the architecture.

---

## What this is

A registry of every discrete teaching chunk (roughly 3–7 minutes of instruction) across the platform:
- Mathematical skills used in economic work (domain `A`, from CvTE Vaardigheden)
- Economic concepts, procedures, and reasoning skills (domains `B`–`K`, from CvTE content domains)

Each unit has a stable permanent ID, prerequisite links forming a DAG, a mastery target (Bloom ceiling), a canonical procedure when applicable, links to the exam program, and links to canonical terminology.

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

Each unit entry uses this format:

```markdown
### <ID> <Name with optional (mode) suffix>
- layer: <derived integer>
- duration_min: <3-7>
- kern: "<one-sentence mastery statement>"
- needs: [<prerequisite unit IDs>]
- exam_codes: [<CvTE eindterm codes, e.g. D3.2, A4.1>]
- mastery_target: <remember | understand | apply | analyze | evaluate>
- prior_learning: <previously_taught | new_this_year | review_and_extend>
- terms: [<canonical Dutch terms from economie-terminologie.md>]
- procedure:  # mandatory for mastery_target >= apply
  1. <step>
  2. <step>
  ...
- pitfalls:   # optional, 1-2 bullets
  - <common misconception>
- generator: <GEN_* function name, A-domain only>
- deprecated: <true | false>
- deprecated_in_favor_of: [<replacement IDs>]
```

**Validation rules enforced by the build CLI:**

1. `needs` entries must all resolve to existing unit IDs.
2. The `needs` graph must be acyclic.
3. `layer` is derived: `max(needs.layer) + 1`. Not human-set.
4. `exam_codes` entries must resolve to real eindtermen in `references/external/syllabus-eindtermen.json`.
5. `terms` entries must resolve to canonical terms in `economie-terminologie.md`.
6. `procedure` is mandatory when `mastery_target` is `apply`, `analyze`, or `evaluate`.
7. `generator` is only valid for `id.startsWith('A')`.
8. `duration_min` outside 3–7 triggers a validator warning.

**Derived in JSON only (not human-authored in the markdown):**
- `category`: derived from ID prefix (`D05` → `markt`).
- `aspects`: set of verbs from cited eindtermen (`["berekenen", "uitleggen"]`).

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

*The registry is currently empty. The math migration (see `knowledge/micro-teaching-units-plan.md` §6) will populate `A01`–`A37` from `engines/skilltree/base-elements.js`. The exam audit pass will then add D/E/H/etc. units as demanded by real havo/vwo 2025 questions.*

<!-- UNIT ENTRIES BELOW THIS LINE — managed by build-scripts/references/unit-*.js -->
### A01 Lineaire functie opstellen
- duration_min: 5
- kern: "Stel een lineaire functie op (y = ax + b) vanuit een economische context, zoals een vraag- of aanbodfunctie."
- needs: []
- mastery_target: apply
- prior_learning: previously_taught
- terms: []
- procedure:
  1. Stel een lineaire functie op (y = ax + b) vanuit een economische context, zoals een vraag- of aanbodfunctie.
- generator: GEN_A01

### A02 Vergelijking oplossen
- duration_min: 5
- kern: "Los een vergelijking met één onbekende op, bijvoorbeeld door twee functies aan elkaar gelijk te stellen."
- needs: []
- mastery_target: apply
- prior_learning: previously_taught
- terms: []
- procedure:
  1. Los een vergelijking met één onbekende op, bijvoorbeeld door twee functies aan elkaar gelijk te stellen.
- generator: GEN_A02

### A03 Functie omschrijven (P↔Q)
- duration_min: 5
- kern: "Schrijf een functie om van P als functie van Q naar Q als functie van P, of andersom."
- needs: []
- mastery_target: apply
- prior_learning: previously_taught
- terms: []
- procedure:
  1. Schrijf een functie om van P als functie van Q naar Q als functie van P, of andersom.
- generator: GEN_A03

### A04 Substitueren
- duration_min: 5
- kern: "Vul een waarde in een functie in en bereken het resultaat."
- needs: []
- mastery_target: apply
- prior_learning: previously_taught
- terms: []
- procedure:
  1. Vul een waarde in een functie in en bereken het resultaat.
- generator: GEN_A04

### A05 Snijpunt met P-as berekenen
- duration_min: 5
- kern: "Bereken het snijpunt van een functie met de verticale as (P-as) door Q = 0 in te vullen."
- needs: []
- mastery_target: apply
- prior_learning: previously_taught
- terms: []
- procedure:
  1. Bereken het snijpunt van een functie met de verticale as (P-as) door Q = 0 in te vullen.
- generator: GEN_A05

### A06 Evenwichtsprijs & -hoeveelheid
- duration_min: 5
- kern: "Bereken de evenwichtsprijs en -hoeveelheid door vraag en aanbod aan elkaar gelijk te stellen."
- needs: [A01, A02]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Bereken de evenwichtsprijs en -hoeveelheid door vraag en aanbod aan elkaar gelijk te stellen.
- generator: GEN_A06

### A07 TO-functie opstellen
- duration_min: 5
- kern: "Stel de totale opbrengstfunctie op: TO = P × Q. Schrijf de vraagfunctie om zodat P in Q is uitgedrukt."
- needs: [A01, A03]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Stel de totale opbrengstfunctie op: TO = P × Q. Schrijf de vraagfunctie om zodat P in Q is uitgedrukt.
- generator: GEN_A07

### A08 TK-functie herkennen
- duration_min: 5
- kern: "Herken en werk met de totale kostenfunctie (TK), vaak gegeven als TK = vaste kosten + variabele kosten × Q."
- needs: [A01]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Herken en werk met de totale kostenfunctie (TK), vaak gegeven als TK = vaste kosten + variabele kosten × Q.
- generator: GEN_A08

### A09 Collectief aanbod
- duration_min: 5
- kern: "Tel individuele aanbodfuncties op tot een collectieve aanbodfunctie."
- needs: [A03]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Tel individuele aanbodfuncties op tot een collectieve aanbodfunctie.
- generator: GEN_A09

### A10 Oppervlakte driehoek
- duration_min: 5
- kern: "Bereken de oppervlakte van een driehoek in een grafiek: ½ × basis × hoogte."
- needs: [A04]
- mastery_target: apply
- prior_learning: previously_taught
- terms: []
- procedure:
  1. Bereken de oppervlakte van een driehoek in een grafiek: ½ × basis × hoogte.
- generator: GEN_A10

### A11 Afgeleide bepalen
- duration_min: 5
- kern: "Bepaal de afgeleide van een functie. Bijvoorbeeld: als TO = 5Q², dan is MO = 10Q."
- needs: [A01]
- mastery_target: apply
- prior_learning: previously_taught
- terms: []
- procedure:
  1. Bepaal de afgeleide van een functie. Bijvoorbeeld: als TO = 5Q², dan is MO = 10Q.
- generator: GEN_A11

### A12 MO bepalen
- duration_min: 5
- kern: "Bepaal de marginale opbrengst (MO) door de afgeleide van de TO-functie te nemen."
- needs: [A11, A07]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Bepaal de marginale opbrengst (MO) door de afgeleide van de TO-functie te nemen.
- generator: GEN_A12

### A13 MK bepalen
- duration_min: 5
- kern: "Bepaal de marginale kosten (MK) door de afgeleide van de TK-functie te nemen."
- needs: [A11, A08]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Bepaal de marginale kosten (MK) door de afgeleide van de TK-functie te nemen.
- generator: GEN_A13

### A14 GTK bepalen
- duration_min: 5
- kern: "Bereken de gemiddelde totale kosten: GTK = TK / Q."
- needs: [A08]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Bereken de gemiddelde totale kosten: GTK = TK / Q.
- generator: GEN_A14

### A15 Prijselasticiteit van de vraag
- duration_min: 5
- kern: "Bereken de prijselasticiteit: Ev = %ΔQv / %ΔP. Bepaal of de vraag elastisch of inelastisch is."
- needs: [A04]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Bereken de prijselasticiteit: Ev = %ΔQv / %ΔP. Bepaal of de vraag elastisch of inelastisch is.
- generator: GEN_A15

### A16 Kruiselasticiteit
- duration_min: 5
- kern: "Bereken de kruiselasticiteit: Ekr = %ΔQa / %ΔPb. Bepaal of goederen substituten of complementen zijn."
- needs: []
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Bereken de kruiselasticiteit: Ekr = %ΔQa / %ΔPb. Bepaal of goederen substituten of complementen zijn.
- generator: GEN_A16

### A17 Inkomenselasticiteit
- duration_min: 5
- kern: "Bereken de inkomenselasticiteit: Ei = %ΔQ / %ΔY. Bepaal of een goed normaal, inferieur of luxe is."
- needs: []
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Bereken de inkomenselasticiteit: Ei = %ΔQ / %ΔY. Bepaal of een goed normaal, inferieur of luxe is.
- generator: GEN_A17

### A18 Comparatief voordeel bepalen
- duration_min: 5
- kern: "Vergelijk de alternatieve kosten van twee producenten om te bepalen wie een comparatief voordeel heeft."
- needs: []
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Vergelijk de alternatieve kosten van twee producenten om te bepalen wie een comparatief voordeel heeft.
- generator: GEN_A18

### A19 Surplus berekenen (CS/PS)
- duration_min: 5
- kern: "Bereken het consumenten- of producentensurplus als driehoeksoppervlakte in de vraag-/aanbodgrafiek."
- needs: [A06, A10]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Bereken het consumenten- of producentensurplus als driehoeksoppervlakte in de vraag-/aanbodgrafiek.
- generator: GEN_A19

### A20 MO = MK oplossen
- duration_min: 5
- kern: "Vind de winstmaximaliserende hoeveelheid door MO gelijk te stellen aan MK en op te lossen."
- needs: [A12, A13, A02]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Vind de winstmaximaliserende hoeveelheid door MO gelijk te stellen aan MK en op te lossen.
- generator: GEN_A20

### A21 Winst = TO − TK
- duration_min: 5
- kern: "Bereken de winst door de totale opbrengst min de totale kosten: W = TO − TK."
- needs: [A07, A08, A04]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Bereken de winst door de totale opbrengst min de totale kosten: W = TO − TK.
- generator: GEN_A21

### A22 Break-even (TO = TK)
- duration_min: 5
- kern: "Vind de break-evenhoeveelheid door TO = TK op te lossen. Bij dit punt is de winst nul."
- needs: [A07, A08, A02]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Vind de break-evenhoeveelheid door TO = TK op te lossen. Bij dit punt is de winst nul.
- generator: GEN_A22

### A23 Evenwicht met heffing
- duration_min: 5
- kern: "Bereken het nieuwe marktevenwicht nadat de overheid een heffing (accijns) heeft opgelegd."
- needs: [A06, A01]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Bereken het nieuwe marktevenwicht nadat de overheid een heffing (accijns) heeft opgelegd.
- generator: GEN_A23

### A24 Collectief aanbod bepalen
- duration_min: 5
- kern: "Bepaal het collectieve aanbod vanuit meerdere individuele aanbieders en bereken het marktevenwicht."
- needs: [A09, A03]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Bepaal het collectieve aanbod vanuit meerdere individuele aanbieders en bereken het marktevenwicht.
- generator: GEN_A24

### A25 Minimumprijs analyseren
- duration_min: 5
- kern: "Analyseer het effect van een minimumprijs: bereken het vraagoverschot en het welvaartsverlies."
- needs: [A06]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Analyseer het effect van een minimumprijs: bereken het vraagoverschot en het welvaartsverlies.
- generator: GEN_A25

### A26 Maximumprijs analyseren
- duration_min: 5
- kern: "Analyseer het effect van een maximumprijs: bereken het vraagoverschot en de gevolgen voor consumenten."
- needs: [A06]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Analyseer het effect van een maximumprijs: bereken het vraagoverschot en de gevolgen voor consumenten.
- generator: GEN_A26

### A27 Subsidie analyseren
- duration_min: 5
- kern: "Bereken het effect van een subsidie op het marktevenwicht, de prijs en de verdeling van het voordeel."
- needs: [A06, A01]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Bereken het effect van een subsidie op het marktevenwicht, de prijs en de verdeling van het voordeel.
- generator: GEN_A27

### A28 MK = GTK oplossen
- duration_min: 5
- kern: "Vind de hoeveelheid waar MK = GTK. Dit is het minimum van de GTK-curve (efficiënte schaal)."
- needs: [A13, A14]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Vind de hoeveelheid waar MK = GTK. Dit is het minimum van de GTK-curve (efficiënte schaal).
- generator: GEN_A28

### A29 Break-even analyse
- duration_min: 5
- kern: "Voer een volledige break-evenanalyse uit: vind de break-evenhoeveelheid en bepaal winst/verlies bij een gegeven Q."
- needs: [A22]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Voer een volledige break-evenanalyse uit: vind de break-evenhoeveelheid en bepaal winst/verlies bij een gegeven Q.
- generator: GEN_A29

### A30 Consumentensurplus
- duration_min: 5
- kern: "Bereken het consumentensurplus voor en na een beleidsverandering en bepaal het verschil."
- needs: [A19]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Bereken het consumentensurplus voor en na een beleidsverandering en bepaal het verschil.
- generator: GEN_A30

### A31 Individueel → collectief aanbod
- duration_min: 5
- kern: "Ga van individuele aanbodcurves naar de collectieve aanbodcurve en bereken het marktevenwicht."
- needs: [A24]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Ga van individuele aanbodcurves naar de collectieve aanbodcurve en bereken het marktevenwicht.
- generator: GEN_A31

### A32 Welvaartsverlies belasting
- duration_min: 5
- kern: "Bereken het welvaartsverlies (deadweight loss) dat ontstaat door een belasting als driehoeksoppervlakte."
- needs: [A19, A23]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Bereken het welvaartsverlies (deadweight loss) dat ontstaat door een belasting als driehoeksoppervlakte.
- generator: GEN_A32

### A33 Optimale productie bij VM
- duration_min: 5
- kern: "Bepaal de optimale productie bij volkomen mededinging: produceer waar P = MK en bereken de winst."
- needs: [A13, A14, A04]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Bepaal de optimale productie bij volkomen mededinging: produceer waar P = MK en bereken de winst.
- generator: GEN_A33

### A34 Effecten invoerrecht
- duration_min: 5
- kern: "Analyseer de effecten van een invoerrecht op binnenlandse productie, consumptie, import en welvaart."
- needs: [A19, A23, A06]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Analyseer de effecten van een invoerrecht op binnenlandse productie, consumptie, import en welvaart.
- generator: GEN_A34

### A35 Max. winst monopolist
- duration_min: 5
- kern: "Bereken de maximale winst van een monopolist: vind Q waar MO = MK, bepaal P en reken W = TO − TK uit."
- needs: [A20, A21, A04]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Bereken de maximale winst van een monopolist: vind Q waar MO = MK, bepaal P en reken W = TO − TK uit.
- generator: GEN_A35

### A36 Prijsdiscriminatie
- duration_min: 5
- kern: "Bereken de winst bij prijsdiscriminatie: de monopolist rekent verschillende prijzen in verschillende markten."
- needs: [A20, A21]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Bereken de winst bij prijsdiscriminatie: de monopolist rekent verschillende prijzen in verschillende markten.
- generator: GEN_A36

### A37 Lange-termijnevenwicht VM
- duration_min: 5
- kern: "Bepaal het lange-termijnevenwicht bij volkomen mededinging: P = MK = GTK (minimale GTK)."
- needs: [A28]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Bepaal het lange-termijnevenwicht bij volkomen mededinging: P = MK = GTK (minimale GTK).
- generator: GEN_A37
