# CP.6c Year-1 MTU Backfill Classification

Generated: 2026-05-20

Status: mtu_backfill_classification_recorded_not_mutating

CP-6 not closed. Year 1 not closed. No protected reference mutation, unit minting, target-exercise promotion, placeholder finalization, lesson-output mutation, or student-facing/product authorization occurred.

## Summary

| Metric | Count |
|---|---:|
| REF-CT1 Year-1 backfill candidates classified | 9 |
| Existing-unit mappings | 6 |
| True missing units | 1 |
| Merge candidates | 1 |
| Defer candidates | 1 |
| Mutations authorized now | 0 |

## Classification Table

| Candidate | Paragraph | Classification | Mapped units | Supporting units | Later CLI candidate |
|---|---|---|---|---|---|
| missing_flag:1.1.3:1 | 1.1.3 | existing_unit_mapping | A45 | A38 | no |
| missing_flag:1.1.3:2 | 1.1.3 | existing_unit_mapping | A46 | A45, A38 | no |
| missing_flag:1.2.2:1 | 1.2.2 | merge_candidate | none | A17, D11, D33 | no |
| missing_flag:1.2.3:1 | 1.2.3 | existing_unit_mapping | A47 | A46 | no |
| missing_flag:1.2.3:2 | 1.2.3 | existing_unit_mapping | A48 | A03, A47 | no |
| missing_flag:1.2.3:3 | 1.2.3 | defer_candidate | none | A47, A48 | no |
| missing_flag:1.3.1:1 | 1.3.1 | existing_unit_mapping | A49 | A45 | no |
| missing_flag:1.3.2:1 | 1.3.2 | existing_unit_mapping | A51 | A06 | no |
| missing_flag:1.3.3:1 | 1.3.3 | true_missing_unit | none | A06, A42, D10, D13, D32, D33 | yes, later review only |

## Decision

CP.6c classifies the nine REF-CT1 backfill candidates against the current live MTU registry. Six candidates already map to explicit live units, one is a merge/design candidate around the retired D04 successor cluster, one is deferred until target-exercise review decides whether the kink remains required, and one is a true missing simultaneous-shift reasoning operation for later review.

This sprint does not authorize mutation. The next operational sprint remains `CP.6d`.

## Detailed Classifications

### missing_flag:1.1.3:1 - 1.1.3 Grafieken en tabellen

Source flag: Draw a (P,Q) graph from a table with the economist's axis convention (P vertical, Q horizontal) (A-domain candidate)

Classification: `existing_unit_mapping`

Mapped units:

- A45 P-Q grafiek tekenen uit tabel: Teken een prijs-hoeveelheidsgrafiek uit tabelwaarden met prijs op de verticale as en hoeveelheid op de horizontale as.

Supporting units:

- A38 Procentuele verandering berekenen: Bereken de procentuele verandering met %Δ = (nieuw − oud) / oud × 100, en pas dit toe op prijzen, hoeveelheden, indexcijfers en reële variabelen.
Rationale: The live registry already contains A45, whose kern and procedure exactly cover drawing a P-Q graph from table values with P vertical and Q horizontal.

Next action: Use A45 as the mapping during later target-exercise review. CP.6d/CP.6e still need graph-heavy evidence and Part A closure before CP-6 closure.

Mutation authorized now: no

### missing_flag:1.1.3:2 - 1.1.3 Grafieken en tabellen

Source flag: Read values from a (P,Q) graph; interpolate between data points (A-domain candidate)

Classification: `existing_unit_mapping`

Mapped units:

- A46 Waarden aflezen en interpoleren in P-Q grafiek: Lees prijs- en hoeveelheidswaarden af uit een P-Q grafiek en schat tussenliggende waarden door interpolatie.

Supporting units:

- A45 P-Q grafiek tekenen uit tabel: Teken een prijs-hoeveelheidsgrafiek uit tabelwaarden met prijs op de verticale as en hoeveelheid op de horizontale as.
- A38 Procentuele verandering berekenen: Bereken de procentuele verandering met %Δ = (nieuw − oud) / oud × 100, en pas dit toe op prijzen, hoeveelheden, indexcijfers en reële variabelen.
Rationale: The live registry already contains A46 for reading values and interpolating in a P-Q graph, with A45 as the graph-construction prerequisite.

Next action: Use A46 as the mapping during later target-exercise review. CP.6e still needs to clear or explicitly fail the 1.1.3 Part A flag.

Mutation authorized now: no

### missing_flag:1.2.2:1 - 1.2.2 Vraagfactoren

Source flag: Classify a normal vs inferior good response to an income change (concept-level, prerequisite for D11 inkomenselasticiteit)

Classification: `merge_candidate`

Mapped units:

- none

Supporting units:

- A17 Inkomenselasticiteit: Bereken de inkomenselasticiteit: Ei = %ΔQ / %ΔY. Bepaal of een goed normaal, inferieur of luxe is.
- D11 Inkomenselasticiteit berekenen en interpreteren: Bereken Ei uit twee waarnemingen en interpreteer de uitkomst in de context van het goed.
- D33 Vraag- en aanbodverschuivingsfactoren benoemen: Noem en herken de standaard verschuivingsfactoren: voor vraag (inkomen, voorkeuren, prijzen substituten/complementen, verwachtingen) en voor aanbod (inputprijzen, technologie, aantal aanbieders, verwachtingen, overheidsbeleid).
Deprecated context:

- D04 Elasticiteit en goederenclassificatie: deprecated=true; replacements=A15, D06, A17, D11, A16, D12, D27

Rationale: The concept is present in successor income-elasticity units A17 and D11, while D33 covers demand-shift factors. The old standalone D04 record is deprecated and must not be revived. A later design review should decide whether the Year-1 pre-elasticity version is handled by successor-unit wording, a paragraph-level note, or a governed split.

Next action: Route to target-exercise and unit-design review if final Year-1 coverage keeps normal/inferior goods before formal income elasticity. Do not add a D04 edge or revive D04.

Mutation authorized now: no

### missing_flag:1.2.3:1 - 1.2.3 Van individuele naar collectieve vraag

Source flag: Horizontal sum: aggregate individual demand tables into collective demand (A-domain candidate, mirror of A31 for aanbod)

Classification: `existing_unit_mapping`

Mapped units:

- A47 Collectieve vraag uit tabellen optellen: Bereken collectieve vraag door individuele gevraagde hoeveelheden bij dezelfde prijs op te tellen.

Supporting units:

- A46 Waarden aflezen en interpoleren in P-Q grafiek: Lees prijs- en hoeveelheidswaarden af uit een P-Q grafiek en schat tussenliggende waarden door interpolatie.
Rationale: The live registry already contains A47 for calculating collective demand by adding individual demanded quantities at the same price.

Next action: Use A47 as the mapping during later target-exercise review and CP.6d graph-heavy evidence upgrade.

Mutation authorized now: no

### missing_flag:1.2.3:2 - 1.2.3 Van individuele naar collectieve vraag

Source flag: Algebraic horizontal sum of linear demand functions (A-domain candidate, Q-at-equal-P)

Classification: `existing_unit_mapping`

Mapped units:

- A48 Collectieve vraagfunctie algebraisch optellen: Tel lineaire individuele vraagfuncties horizontaal op door bij dezelfde prijs de gevraagde hoeveelheden te sommeren.

Supporting units:

- A03 Functie omschrijven (P↔Q): Schrijf een functie om van P als functie van Q naar Q als functie van P, of andersom.
- A47 Collectieve vraag uit tabellen optellen: Bereken collectieve vraag door individuele gevraagde hoeveelheden bij dezelfde prijs op te tellen.
Rationale: The live registry already contains A48 for algebraic horizontal summation of linear individual demand functions at equal price.

Next action: Use A48 as the mapping during later target-exercise review and CP.6d graph-heavy evidence upgrade.

Mutation authorized now: no

### missing_flag:1.2.3:3 - 1.2.3 Van individuele naar collectieve vraag

Source flag: Recognise the kink in collective demand when one consumer exits (concept-level)

Classification: `defer_candidate`

Mapped units:

- none

Supporting units:

- A47 Collectieve vraag uit tabellen optellen: Bereken collectieve vraag door individuele gevraagde hoeveelheden bij dezelfde prijs op te tellen.
- A48 Collectieve vraagfunctie algebraisch optellen: Tel lineaire individuele vraagfuncties horizontaal op door bij dezelfde prijs de gevraagde hoeveelheden te sommeren.
Rationale: The active target-exercise difficulty note says the kink can be mentioned but is not essential. A47/A48 cover the main horizontal-sum operation; the kink/price-range edge case should not force immediate unit mutation before a final target-exercise review decides whether to retain it.

Next action: Defer. If later reviewed target exercises retain the kink as required performance, review whether A48 needs a governed procedure refinement for valid price ranges or piecewise demand.

Mutation authorized now: no

### missing_flag:1.3.1:1 - 1.3.1 Aanbod

Source flag: Draw an upward-sloping supply curve with correct economist axes (A-domain candidate)

Classification: `existing_unit_mapping`

Mapped units:

- A49 Aanbodcurve tekenen met economenassen: Teken een stijgende aanbodcurve met prijs op de verticale as en aangeboden hoeveelheid op de horizontale as.

Supporting units:

- A45 P-Q grafiek tekenen uit tabel: Teken een prijs-hoeveelheidsgrafiek uit tabelwaarden met prijs op de verticale as en hoeveelheid op de horizontale as.
Rationale: The live registry already contains A49 for drawing an upward-sloping supply curve with economist axes and a supply/S label.

Next action: Use A49 as the mapping during later target-exercise review and CP.6d graph-heavy evidence upgrade.

Mutation authorized now: no

### missing_flag:1.3.2:1 - 1.3.2 Marktevenwicht

Source flag: Determine surplus (aanbodoverschot) vs shortage (vraagoverschot) at a non-equilibrium price and calculate its size (A-domain candidate, prerequisite for government price interventions in §2.4)

Classification: `existing_unit_mapping`

Mapped units:

- A51 Overschot en tekort bij niet-evenwichtsprijs berekenen: Bepaal bij een opgelegde prijs of er een overschot of tekort ontstaat en bereken de omvang als verschil tussen Qa en Qv.

Supporting units:

- A06 Evenwichtsprijs & -hoeveelheid: Bereken de evenwichtsprijs en -hoeveelheid door vraag en aanbod aan elkaar gelijk te stellen.
Rationale: The live registry already contains A51 for determining overschot/tekort at a non-equilibrium price and calculating the difference between Qa and Qv.

Next action: Use A51 as the mapping during later target-exercise review and CP.6d graph-heavy evidence upgrade.

Mutation authorized now: no

### missing_flag:1.3.3:1 - 1.3.3 Verschuivingen en nieuw evenwicht

Source flag: Reason about simultaneous supply+demand shifts: determinate Q-direction but ambiguous P-direction (concept-level, diagnostic checkpoint)

Classification: `true_missing_unit`

Mapped units:

- none

Supporting units:

- A06 Evenwichtsprijs & -hoeveelheid: Bereken de evenwichtsprijs en -hoeveelheid door vraag en aanbod aan elkaar gelijk te stellen.
- A42 Grafische verschuiving met voor-en-na pijlen: Teken een grafische verschuiving (vraag- of aanbodcurve) met zowel de oude als de nieuwe curve, gelabeld D / D' of S / S', en geef de richting aan met pijlen tussen de oude en nieuwe positie.
- D10 Vraag/aanbod-verschuiving bij conjunctuurschok: Analyseer hoe een conjunctuurschok de collectieve vraaglijn of aanbodlijn verschuift en wat dit doet met evenwichtsprijs en -hoeveelheid.
- D13 Kostenstijging en aanbodverschuiving: Analyseer hoe een stijging van productiekosten (zoals loon per eenheid product) de collectieve aanbodlijn verschuift en doorwerkt in evenwichtsprijs.
- D32 Verschuiving versus beweging langs de curve: Onderscheid een beweging langs de vraag- of aanbodcurve (veroorzaakt door eigen-prijsverandering) van een verschuiving van de curve (veroorzaakt door een andere factor dan eigen prijs).
- D33 Vraag- en aanbodverschuivingsfactoren benoemen: Noem en herken de standaard verschuivingsfactoren: voor vraag (inkomen, voorkeuren, prijzen substituten/complementen, verwachtingen) en voor aanbod (inputprijzen, technologie, aantal aanbieders, verwachtingen, overheidsbeleid).
Candidate future unit concept: Reason about simultaneous demand and supply shifts, distinguishing determinate and ambiguous effects on equilibrium price and quantity.

Rationale: Existing units cover equilibrium solving, single-curve shifts, and specific supply/demand shock reasoning, but no live unit explicitly teaches the simultaneous-shift answer operation where one equilibrium direction is determinate and the other is ambiguous without magnitudes.

Next action: Prepare a later bounded review before any CLI mutation. If confirmed, mint or adjust the operation through governed scripts only; CP.6c does not authorize that mutation.

Mutation authorized now: no


## Blocked Outcomes

- protected reference mutation
- lesson output mutation
- target-exercise promotion
- placeholder replacement
- placeholder finalization
- unit minting
- machine registry mutation
- CLI mutation authorization
- CP-6 closure
- Year-1 closure
- student diagnostics
- adaptive routing
- mastery decisions
- automatic sequencing
- student-facing AI
- summative use
- PV projection
- PV machine promotion
- student-facing generated output

## Next Operational Step

Proceed to `CP.6d Book 1 Graph-Heavy Evidence Upgrade`. Do not draft a CP-6 closure proposal yet.
