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
- layer: 0
- duration_min: 5
- kern: "Stel een lineaire functie op (y = ax + b) vanuit een economische context, zoals een vraag- of aanbodfunctie."
- needs: []
- mastery_target: apply
- prior_learning: previously_taught
- terms: []
- procedure:
  1. Stel een lineaire functie op (y = ax + b) vanuit een economische context, zoals een vraag- of aanbodfunctie.
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
- terms: []
- procedure:
  1. Vul een waarde in een functie in en bereken het resultaat.
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
- terms: []
- procedure:
  1. Bereken het snijpunt van een functie met de verticale as (P-as) door Q = 0 in te vullen.
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
- terms: []
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
- terms: []
- procedure:
  1. Stel de totale opbrengstfunctie op: TO = P × Q. Schrijf de vraagfunctie om zodat P in Q is uitgedrukt.
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
- terms: []
- procedure:
  1. Herken en werk met de totale kostenfunctie (TK), vaak gegeven als TK = vaste kosten + variabele kosten × Q.
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
- terms: []
- procedure:
  1. Tel individuele aanbodfuncties op tot een collectieve aanbodfunctie.
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
- terms: []
- procedure:
  1. Bereken de oppervlakte van een driehoek in een grafiek: ½ × basis × hoogte.
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
- terms: []
- procedure:
  1. Bepaal de afgeleide van een functie. Bijvoorbeeld: als TO = 5Q², dan is MO = 10Q.
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
- terms: []
- procedure:
  1. Bepaal de marginale opbrengst (MO) door de afgeleide van de TO-functie te nemen.
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
- terms: []
- procedure:
  1. Bepaal de marginale kosten (MK) door de afgeleide van de TK-functie te nemen.
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
- terms: []
- procedure:
  1. Bereken de gemiddelde totale kosten: GTK = TK / Q.
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
- terms: []
- procedure:
  1. Bereken de prijselasticiteit: Ev = %ΔQv / %ΔP. Bepaal of de vraag elastisch of inelastisch is.
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
- terms: []
- procedure:
  1. Bereken de kruiselasticiteit: Ekr = %ΔQa / %ΔPb. Bepaal of goederen substituten of complementen zijn.
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
- terms: []
- procedure:
  1. Bereken de inkomenselasticiteit: Ei = %ΔQ / %ΔY. Bepaal of een goed normaal, inferieur of luxe is.
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
- terms: []
- procedure:
  1. Vergelijk de alternatieve kosten van twee producenten om te bepalen wie een comparatief voordeel heeft.
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
- terms: []
- procedure:
  1. Bereken het consumenten- of producentensurplus als driehoeksoppervlakte in de vraag-/aanbodgrafiek.
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
- terms: []
- procedure:
  1. Vind de winstmaximaliserende hoeveelheid door MO gelijk te stellen aan MK en op te lossen.
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
- terms: []
- procedure:
  1. Bereken de winst door de totale opbrengst min de totale kosten: W = TO − TK.
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
- terms: []
- procedure:
  1. Vind de break-evenhoeveelheid door TO = TK op te lossen. Bij dit punt is de winst nul.
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
- terms: []
- procedure:
  1. Bereken het nieuwe marktevenwicht nadat de overheid een heffing (accijns) heeft opgelegd.
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
- terms: []
- procedure:
  1. Bepaal het collectieve aanbod vanuit meerdere individuele aanbieders en bereken het marktevenwicht.
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
- terms: []
- procedure:
  1. Analyseer het effect van een minimumprijs: bereken het vraagoverschot en het welvaartsverlies.
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
- terms: []
- procedure:
  1. Analyseer het effect van een maximumprijs: bereken het vraagoverschot en de gevolgen voor consumenten.
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
- terms: []
- procedure:
  1. Bereken het effect van een subsidie op het marktevenwicht, de prijs en de verdeling van het voordeel.
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
- terms: []
- procedure:
  1. Vind de hoeveelheid waar MK = GTK. Dit is het minimum van de GTK-curve (efficiënte schaal).
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
- terms: []
- procedure:
  1. Voer een volledige break-evenanalyse uit: vind de break-evenhoeveelheid en bepaal winst/verlies bij een gegeven Q.
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
- terms: []
- procedure:
  1. Bereken het consumentensurplus voor en na een beleidsverandering en bepaal het verschil.
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
- terms: []
- procedure:
  1. Ga van individuele aanbodcurves naar de collectieve aanbodcurve en bereken het marktevenwicht.
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
- terms: []
- procedure:
  1. Bereken het welvaartsverlies (deadweight loss) dat ontstaat door een belasting als driehoeksoppervlakte.
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
- terms: []
- procedure:
  1. Bepaal de optimale productie bij volkomen mededinging: produceer waar P = MK en bereken de winst.
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
- terms: []
- procedure:
  1. Analyseer de effecten van een invoerrecht op binnenlandse productie, consumptie, import en welvaart.
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
- terms: []
- procedure:
  1. Bereken de maximale winst van een monopolist: vind Q waar MO = MK, bepaal P en reken W = TO − TK uit.
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
- terms: []
- procedure:
  1. Bereken de winst bij prijsdiscriminatie: de monopolist rekent verschillende prijzen in verschillende markten.
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
- terms: []
- procedure:
  1. Bepaal het lange-termijnevenwicht bij volkomen mededinging: P = MK = GTK (minimale GTK).
- pitfalls:
  - Winst = 0 betekent niet dat het bedrijf geen geld verdient!
- generator: GEN_A37

### D01 Accijnsopbrengst uit grafiek
- kern: "Bepaal accijnsopbrengst door verhandelde hoeveelheid na belasting met belastingbedrag te vermenigvuldigen."
- needs: []
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Bepaal accijnsopbrengst door verhandelde hoeveelheid na belasting met belastingbedrag te vermenigvuldigen.

### D02 Constante kosten en winst
- kern: "Constante kosten beinvloeden break-even analyse maar niet het MO = MK optimum."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### D03 Consumentensurplus en accijns
- kern: "Accijns verhoogt prijs, consumers betalen meer, consumentensurplus daalt."
- needs: []
- exam_codes: [D3.1]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Accijns verhoogt prijs, consumers betalen meer, consumentensurplus daalt.

### D04 Elasticiteit en goederenclassificatie
- kern: "Gebruik inkomenselasticiteit om goederen te classificeren als inferieur, normaal of luxe."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### D05 Heffing tegen overconsumptie
- kern: "Student analyseert of een heffing overconsumptie tegengaat via veranderde vraag."
- needs: []
- exam_codes: [D1.4a]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### D06 Homogene en heterogene goederen
- kern: "Homogene goederen zijn identiek; heterogene goederen verschillen in kwaliteit of kenmerken."
- needs: []
- exam_codes: [D2.1]
- mastery_target: understand
- prior_learning: previously_taught
- terms: []

### D07 Marktfalen in watervoorziening
- kern: "Student bepaalt wanneer marktwerking doelen bereikt of overheidsinterventie nodig is."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### D08 Marktvormen classificeren
- kern: "Classificeer markten aan hand van aantal aanbieders, aard van goederen en toetreding."
- needs: []
- exam_codes: [D2.1]
- mastery_target: understand
- prior_learning: previously_taught
- terms: []

### D09 Minimumprijs en werkloosheid
- kern: "Minimumloon boven marktloon veroorzaakt vraagoverschot van arbeid en werkloosheid."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### D10 Subsidie en Pareto-efficientie
- kern: "Student legt uit of een subsidie-evenwicht Pareto-efficient is."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### D11 Pareto-efficientie in marktevenwicht
- kern: "Student legt uit wanneer een marktevenwicht Pareto-efficient is."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### D12 Prijsdiscriminatie en subsidies
- kern: "Student herkent of subsidies prijsdiscriminatie veroorzaken en analyseert gevolgen."
- needs: []
- exam_codes: [D2.3]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### D13 Voorwaarden voor prijsdiscriminatie
- kern: "Prijsdiscriminatie vereist marktscheiding en verschillende betalingsbereidheid."
- needs: []
- exam_codes: [D2.3]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### D14 Soorten variabele kosten classificeren
- kern: "Student onderscheidt tussen degressief, progressief en proportioneel variabele kosten."
- needs: []
- mastery_target: understand
- prior_learning: previously_taught
- terms: []

### D15 Substituten en complementen
- kern: "Substituten vervangen elkaar; complementen worden samen gebruikt."
- needs: []
- mastery_target: understand
- prior_learning: previously_taught
- terms: []

### D16 Welvaart en surplus-effect
- kern: "Prijsverlaging verhoogt consumentensurplus; effect op producentensurplus verschilt per geval."
- needs: []
- exam_codes: [D3.1]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### D17 Winstmaximalisatie MO = MK
- kern: "Winstmaximale hoeveelheid vind je waar marginale opbrengst gelijk is aan marginale kosten."
- needs: []
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Winstmaximale hoeveelheid vind je waar marginale opbrengst gelijk is aan marginale kosten.

### E01 Intergenerationele ruil
- kern: "Student analyseert hoe pensioenstelsels intergenerationele ruil faciliteren."
- needs: []
- exam_codes: [E2.1]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### E02 Intertemporele ruil in pensioenstelsels
- kern: "Student legt uit hoe pensioenen ruil over tijd vertegenwoordigen."
- needs: []
- exam_codes: [E1.1]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### E03 Omslagstelsel (AOW)
- kern: "Omslagstelsel: werkenden betalen premie voor huidige uitkeringen; gevoelig voor vergrijzing."
- needs: []
- exam_codes: [E2.1]
- mastery_target: understand
- prior_learning: previously_taught
- terms: []

### E04 Voorraad- en stroomgrootheden onderscheiden
- kern: "Student onderscheidt tussen voorraad- en stroomgrootheden."
- needs: []
- mastery_target: understand
- prior_learning: previously_taught
- terms: []

### F01 Collectief goed classificeren
- kern: "Student herkent collectieve goederen aan hand van excludeerbaarheid en rivaliteit."
- needs: []
- exam_codes: [F2.2]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### F02 Dominante strategie
- kern: "Dominante strategie is de beste keuze voor een speler ongeacht wat de ander doet."
- needs: []
- exam_codes: [F1.5]
- mastery_target: understand
- prior_learning: previously_taught
- terms: []

### F03 Emissierechten als prikkel
- kern: "Emissierechten geven bedrijven een prikkel om te verduurzamen door kosten van vervuiling."
- needs: []
- exam_codes: [F2.4]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### F04 Externe effecten in marktbeslissingen
- kern: "Student erkent dat negatieve externe effecten leiden tot overproductie vanuit maatschappelijk perspectief."
- needs: []
- exam_codes: [F2.4]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### F05 Negatieve externe effecten
- kern: "Overmatige consumptie met negatieve externe effecten leidt tot maatschappelijk welvaartsverlies."
- needs: []
- exam_codes: [F2.4]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### F06 Gevangenendilemma
- kern: "Situatie waarbij dominante strategie leidt tot suboptimale uitkomst voor beide spelers."
- needs: []
- exam_codes: [F1.5]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### F07 Internalisatie van externe effecten
- kern: "Prijs gelijk aan maatschappelijke kosten zorgt ervoor dat externe effecten geinternaliseerd worden."
- needs: []
- exam_codes: [F2.4]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### F08 Lumpsum-financiering en externe effecten
- kern: "Student legt uit hoe een lumpsum-financiering positieve externe effecten internaliseert."
- needs: []
- exam_codes: [F2.4]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### F09 Nash-evenwicht identificeren
- kern: "Student bepaalt het Nash-evenwicht uit een pay-off matrix met twee spelers."
- needs: []
- exam_codes: [F1.4]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Student bepaalt het Nash-evenwicht uit een pay-off matrix met twee spelers.

### F10 Opzegtermijn en loonkosten
- kern: "Student legt uit hoe kortere opzegtermijnen via berovingsprobleem tot hogere loonkosten leiden."
- needs: []
- exam_codes: [F2.1]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### F11 Verzonken kosten en beslissingen
- kern: "Hoge verzonken kosten kunnen bedrijven aanmoedigen andere markten te zoeken."
- needs: []
- exam_codes: [F2.1]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### G01 AI en risicoinschatting
- kern: "Betere risicoinschatting met AI kan averechtse selectie verminderen."
- needs: []
- exam_codes: [G3.2]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### G02 Averechtse selectie herkennen
- kern: "Student herkent averechtse selectie als gevolg van informatieasymmetrie op markten."
- needs: []
- exam_codes: [G3.2]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### G03 Eigen risico en moral hazard
- kern: "Eigen risico geeft verzekerden een prikkel om voorzichtiger te handelen."
- needs: []
- exam_codes: [G4.5]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### G04 Principaal-agentprobleem identificeren
- kern: "Student identificeert principaal-agentrelaties en de problemen die daaruit voortvloeien."
- needs: []
- exam_codes: [G3.2]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### G05 Transactiekosten
- kern: "Student berekent en interpreteert transactiekosten bij ruil."
- needs: []
- exam_codes: [G2.1]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Student berekent en interpreteert transactiekosten bij ruil.

### G06 Vereveningsfonds voor risicodeling
- kern: "Gemeenschappelijk fonds kan risico's uitvlakken en kostenverschillen compenseren."
- needs: []
- exam_codes: [G3.3]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### G07 Solidariteit in verzekeringen
- kern: "Gepersonaliseerde premies op basis van individueel risicoprofiel ondermijnen solidariteit."
- needs: []
- exam_codes: [G3.2]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### G08 Informatieasymmetrie verzekeringsmarkt
- kern: "Informatieongelijkheid tussen verzekeraar en klant kan selectie- en moraalrisicoproblemen veroorzaken."
- needs: []
- exam_codes: [G2.2]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### H01 AOW-betaalbaarheid en vergrijzing
- kern: "Verhogen AOW-leeftijd verbetert betaalbaarheid bij vergrijzing."
- needs: []
- exam_codes: [H5.1]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### H02 AIQ (arbeidsinkomenquote) berekenen
- kern: "Student berekent de arbeidsinkomenquote: (arbeidsinkomen / nationaal inkomen) x 100%."
- needs: []
- exam_codes: [H1.1]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Student berekent de arbeidsinkomenquote: (arbeidsinkomen / nationaal inkomen) x 100%.

### H03 Belastingschijven berekening
- kern: "Belastingdruk bepaald aan hand van marginaal tarief en betreffende schijven."
- needs: []
- exam_codes: [H4.6]
- mastery_target: apply
- prior_learning: previously_taught
- terms: []
- procedure:
  1. Belastingdruk bepaald aan hand van marginaal tarief en betreffende schijven.

### H04 Exportsubsidie als protectie
- kern: "Toewijzing van emissierechten aan exporteurs verlaagt kosten en werkt protectionistisch."
- needs: []
- exam_codes: [H1.1]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### H05 Groen bbp en CO2
- kern: "Lagere CO2-uitstoot vergroot groen bbp; minder productie wegens minder emissierechten verkleint het."
- needs: []
- exam_codes: [H3.4]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### H06 Minimumuurloon en internationale concurrentie
- kern: "Hoger minimumuurloon verhoogt bedrijfskosten, wat de internationale concurrentiepositie kan verslechteren."
- needs: []
- exam_codes: [H1.1]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### H07 Minimumuurloon en economische groei
- kern: "Verhogen van het minimumuurloon kan via hogere consumptie tot economische groei leiden."
- needs: []
- exam_codes: [H1.1]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### H08 Ontslagrecht en werkgeverrisico
- kern: "Student legt uit hoe versoepeling van ontslagrecht risico voor werkgevers vermindert."
- needs: []
- exam_codes: [H5.1]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### H09 Progressief tarief berekenen
- kern: "Student berekent totale belasting bij progressieve tarieven en analyseert stimulansen."
- needs: []
- exam_codes: [H4.6]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Student berekent totale belasting bij progressieve tarieven en analyseert stimulansen.

### H10 Spaarsaldo en betalingsbalans
- kern: "Student interpreteert positieve en negatieve particuliere spaarsalda."
- needs: []
- exam_codes: [H1.2]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### H11 Wisselkoers en economische groei
- kern: "Student legt uit hoe wisselkoerseffecten tot groei kunnen leiden."
- needs: []
- exam_codes: [H1.1]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### I01 Anticyclisch begrotingsbeleid
- kern: "In laagconjunctuur verhoogt overheid uitgaven of verlaagt belastingen om economie te stimuleren."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### I02 Anticyclische inkomensoverdrachten
- kern: "Student legt uit hoe inkomensoverdrachten anticyclisch werken tijdens laagconjunctuur."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### I03 Centrale bank rentebeleid
- kern: "Student bepaalt wanneer centrale banken rentes verhogen of verlagen."
- needs: []
- mastery_target: apply
- prior_learning: previously_taught
- terms: []
- procedure:
  1. Student bepaalt wanneer centrale banken rentes verhogen of verlagen.

### I04 Keynesiaanse kruis verschuivingen analyseren
- kern: "Student analyseert hoe verschuivingen in IS en LM het evenwicht en effectiviteit van beleid beinvloeden."
- needs: []
- exam_codes: [I4.1, I4.2]
- mastery_target: analyze
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Student analyseert hoe verschuivingen in IS en LM het evenwicht en effectiviteit van beleid beinvloeden.

### I05 Koopkracht behouden bij inflatie
- kern: "Bereken nieuwe loon of uitkering om koopkracht gelijk te houden bij inflatie."
- needs: []
- exam_codes: [I1.4]
- mastery_target: apply
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Bereken nieuwe loon of uitkering om koopkracht gelijk te houden bij inflatie.

### I06 Loonrigiditeit en GA-curve helling
- kern: "Student legt uit hoe loonflexibiliteit de helling van de GA-curve beinvloedt."
- needs: []
- exam_codes: [I4.4]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### I07 Monetair beleid bij starre vs flexibele arbeidsmarkt
- kern: "Student vergelijkt effectiviteit van renteverlagingen onder starre versus flexibele arbeidsmarktomstandigheden."
- needs: []
- mastery_target: analyze
- prior_learning: new_this_year
- terms: []
- procedure:
  1. Student vergelijkt effectiviteit van renteverlagingen onder starre versus flexibele arbeidsmarktomstandigheden.

### I08 Overheidssaldo verandering
- kern: "Overheidssaldo kan veranderen door belasting- of uitgavenveranderingen."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### I09 Rentebeleid en economische gevolgen
- kern: "Renteverhoging verkrapt de economie; renteverlaging stimuleert."
- needs: []
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### I10 Werkelijk versus nominaal eigen risico
- kern: "Student analyseert hoe inflatie het werkelijk draagvermogen van een nominaal vast eigen risico beinvloedt."
- needs: []
- exam_codes: [I1.4]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []

### I11 Wisselkoerseffect van monetair beleid
- kern: "Student legt uit hoe monetaire beleidsmaatregelen via de wisselkoers de conjunctuur beinvloeden."
- needs: []
- exam_codes: [I1.2]
- mastery_target: understand
- prior_learning: new_this_year
- terms: []
