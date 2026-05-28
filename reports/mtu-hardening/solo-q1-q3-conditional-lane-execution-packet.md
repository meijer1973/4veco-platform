# MTU-H2E Solo q1-q3 Conditional Lane Execution Packet

Generated: 2026-05-28

Status: execution packet ready, no mutation authorized.

Source gate: `GATE-MTU-H2D` closed as `pass_with_conditions`.

Remote publication requirement: this packet and all cited evidence must be
committed and pushed before human review starts.

## Scope

This packet prepares a later reviewable CLI execution set for `A12`, `A88`, `A89`, `A90`, `A92`, `A93`.
`A20` is held out of scope for a separate split/deprecate/replacement and
affected-mapping packet.

No protected reference mutation, external-source mutation, machine-reference
mutation, unit minting, unit update execution, unit split execution, candidate
writes, lesson-output mutation, target-exercise promotion, CP-6/Year-1 closure,
diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, or student/product use is
authorized by this packet.

## Lane Summary

| Unit | Action | Name | Needs | Generator handling |
| --- | --- | --- | --- | --- |
| `A12` | `unit-update` | MO bepalen met afgeleide | `A11`, `A07` | existing GEN.A12 implementation requires impact review; no new generator work in H2E |
| `A88` | `unit-add` | Schaalfactoren in examencijfers toepassen | none | planned generator-blocked/not-yet-interactive until GEN implementation and later exposure approval |
| `A89` | `unit-add` | GO herkennen als prijsfunctie van de monopolist | none | planned generator-blocked/not-yet-interactive until GEN implementation and later exposure approval |
| `A90` | `unit-add` | MO bepalen uit lineaire GO-regel zonder afgeleiden | `A89` | planned generator-blocked/not-yet-interactive until GEN implementation and later exposure approval |
| `A92` | `unit-add` | Nieuwe prijs bepalen na winstmaximaliserende Q | `A04`, `A89` | planned generator-blocked/not-yet-interactive until GEN implementation and later exposure approval |
| `A93` | `unit-add` | Procentuele prijsverandering na kostenverandering | `A38`, `A92` | planned generator-blocked/not-yet-interactive until GEN implementation and later exposure approval |

## Exact Command Set

These commands are for later review only. They are not authorized by MTU-H2E.

| Unit | Action | Dry-run | Execution command |
| --- | --- | --- | --- |
| `A12` | `unit-update` | `node build-scripts/references/unit-update.js --id A12 --spec '{"name":"MO bepalen met afgeleide","kern":"Bepaal marginale opbrengst door eerst TO op te stellen en daarvan de afgeleide naar Q te nemen.","needs":["A11","A07"],"exam_codes":["A2.11","A2.10","A2.12"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["grafisch","rekenen"],"terms":[],"procedure":["Stel de TO-functie op via TO = P x Q.","Bepaal MO als afgeleide van TO naar Q.","Controleer het type: bij volkomen concurrentie is MO = P; bij een lineaire monopolieprijsfunctie P = a - bQ is MO = a - 2bQ.","Gebruik deze MO-functie later in de passende MO = MK-route."],"pitfalls":["Deze afgeleide route gebruiken als een niet-calculus MO-route genoeg is.","De MO-functie later als prijsfunctie gebruiken."],"generator":"GEN_A12"}' --dry-run` | `node build-scripts/references/unit-update.js --id A12 --spec '{"name":"MO bepalen met afgeleide","kern":"Bepaal marginale opbrengst door eerst TO op te stellen en daarvan de afgeleide naar Q te nemen.","needs":["A11","A07"],"exam_codes":["A2.11","A2.10","A2.12"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["grafisch","rekenen"],"terms":[],"procedure":["Stel de TO-functie op via TO = P x Q.","Bepaal MO als afgeleide van TO naar Q.","Controleer het type: bij volkomen concurrentie is MO = P; bij een lineaire monopolieprijsfunctie P = a - bQ is MO = a - 2bQ.","Gebruik deze MO-functie later in de passende MO = MK-route."],"pitfalls":["Deze afgeleide route gebruiken als een niet-calculus MO-route genoeg is.","De MO-functie later als prijsfunctie gebruiken."],"generator":"GEN_A12"}'` |
| `A88` | `unit-add` | unit-add has no dry-run mode in the current CLI | `node build-scripts/references/unit-add.js --spec '{"id":"A88","name":"Schaalfactoren in examencijfers toepassen","kern":"Gebruik schaalvermeldingen zoals x 1.000 correct in formules, tabellen, grafieklabels en eindantwoorden.","needs":[],"exam_codes":["A2.1","A2.4"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal","grafisch"],"terms":[],"zero_needs_status":"true_zero","zero_needs_review":{"reviewed_on":"2026-05-28","reviewer":"MTU-H2D resolution packet","rationale":"Scale labels can appear in formulas, tables, graphs, and final answer units; requiring A61 would over-trigger table-value selection.","recommended_needs":[],"severity":"medium"},"procedure":["Zoek of waarden een schaalvermelding hebben, zoals x 1.000 of mln.","Noteer of je rekent in weergegeven eenheden of werkelijke eenheden.","Pas de schaalfactor consequent toe in formules en tussenstappen.","Geef het eindantwoord met de juiste eenheid en eventuele vermenigvuldigingsfactor."],"pitfalls":["Een waarde in duizenden als losse eenheden behandelen.","Tijdens de berekening van schaal wisselen zonder dat te noteren."],"generator":"GEN_A88"}'` |
| `A89` | `unit-add` | unit-add has no dry-run mode in the current CLI | `node build-scripts/references/unit-add.js --spec '{"id":"A89","name":"GO herkennen als prijsfunctie van de monopolist","kern":"Herken dat de GO- of vraagfunctie bij een monopolist de prijsfunctie P(Q) geeft die later met Q* moet worden gebruikt.","needs":[],"exam_codes":["A2.10"],"mastery_target":"understand","prior_learning":"new_this_year","aspects":["verbaal","rekenen"],"terms":[],"zero_needs_status":"true_zero","zero_needs_review":{"reviewed_on":"2026-05-28","reviewer":"MTU-H2D resolution packet","rationale":"Recognition that GO is the monopoly price relation should not force substitution; substitution is handled by A92.","recommended_needs":[],"severity":"medium"},"procedure":["Zoek in de opgave de GO-, vraag-, of prijsfunctie.","Benoem dat deze functie de prijs P bij hoeveelheid Q geeft.","Houd MO apart: MO bepaalt de winstmaximaliserende hoeveelheid, niet de verkoopprijs."],"pitfalls":["MO gebruiken als prijsfunctie.","Een herkenningsstap behandelen alsof al een berekening met Q* nodig is."],"generator":"GEN_A89"}'` |
| `A90` | `unit-add` | unit-add has no dry-run mode in the current CLI | `node build-scripts/references/unit-add.js --spec '{"id":"A90","name":"MO bepalen uit lineaire GO-regel zonder afgeleiden","kern":"Bepaal bij een lineaire monopolistische prijsfunctie de MO-regel zonder de afgeleide route verplicht te maken.","needs":["A89"],"exam_codes":["A2.10","A2.12"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal"],"terms":[],"procedure":["Herken de lineaire prijsfunctie P = a - bQ.","Gebruik de lineaire MO-regel: MO = a - 2bQ.","Controleer dat deze MO-regel alleen de hoeveelheidstap ondersteunt.","Gebruik later de GO- of prijsfunctie om de verkoopprijs te bepalen."],"pitfalls":["De afgeleide route verplicht maken voordat die route nodig is.","De GO-functie zelf als MO gebruiken.","De MO-uitkomst als verkoopprijs behandelen."],"generator":"GEN_A90"}'` |
| `A92` | `unit-add` | unit-add has no dry-run mode in the current CLI | `node build-scripts/references/unit-add.js --spec '{"id":"A92","name":"Nieuwe prijs bepalen na winstmaximaliserende Q","kern":"Bepaal na Q* de prijs door Q* in de GO- of prijsfunctie P(Q) in te vullen.","needs":["A04","A89"],"exam_codes":["A2.10","A2.12"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal"],"terms":[],"procedure":["Neem de gevonden winstmaximaliserende hoeveelheid Q*.","Zoek de GO- of prijsfunctie P(Q), niet de MO-functie.","Vul Q* in de prijsfunctie in.","Bereken de prijs en controleer de eenheid."],"pitfalls":["Q* in MO invullen en die uitkomst als prijs gebruiken.","De oude prijs gebruiken nadat de kosten of MK zijn veranderd."],"generator":"GEN_A92"}'` |
| `A93` | `unit-add` | unit-add has no dry-run mode in the current CLI | `node build-scripts/references/unit-add.js --spec '{"id":"A93","name":"Procentuele prijsverandering na kostenverandering","kern":"Bereken de procentuele verandering van de prijs na een kostenverandering met de oude prijs als noemer en onderscheid dit van pass-through.","needs":["A38","A92"],"exam_codes":["A2.4","A2.10","A2.12"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal"],"terms":[],"procedure":["Bepaal de oude prijs en nieuwe prijs.","Bereken de prijsverandering: nieuwe prijs min oude prijs.","Deel door de oude prijs en vermenigvuldig met 100 procent.","Controleer dat je de prijsverandering berekent, niet het doorberekende deel van de kostenstijging."],"pitfalls":["De kostenstijging als noemer gebruiken in plaats van de oude prijs.","Procentuele prijsverandering verwarren met incidence of pass-through share.","De procentuele prijsstijging is niet hetzelfde als het percentage van de kostenstijging dat wordt doorberekend.","De nieuwe prijs als basiswaarde gebruiken."],"generator":"GEN_A93"}'` |

## Generator Handling

- `GEN_A12` exists as `GEN.A12`; the later execution gate must review impact
  if A12 wording or semantics changes.
- `GEN_A20` exists as `GEN.A20`, but `A20` remains held outside this packet.
- `GEN_A88`, `GEN_A89`, `GEN_A90`, `GEN_A92`, and `GEN_A93` are not
  implemented. If their units are minted later without generator work, they
  must be generator-blocked/not-yet-interactive and the skill-tree generator
  readiness block record must be refreshed.

## Required Preflight

- git status --short
- fresh ID absence check for A88, A89, A90, A92, and A93
- fresh confirmation that A12 and A20 exist
- print each extracted JSON spec before running its CLI command
- run A12 unit-update --dry-run and prove A2.11 remains
- confirm A20 command is absent from the execution set
- confirm review packet and cited evidence were pushed before review

## Required Post-Execution Validation If A Later Gate Authorizes Execution

- `node build-scripts/references/build-unit-index.js`
- `node build-scripts/references/validate-core-schemas.js`
- `node build-scripts/references/build-skilltree-generator-readiness.js`
- `node build-scripts/references/check-skilltree-generator-readiness.js`
- `node build-scripts/references/check-mtu-h2e-conditional-lane-execution-packet.js`
- `git diff --check`

## Rollback Route

- Before execution, capture git status and exact pre-execution commit.
- If a command fails before commit, restore only the affected CLI-generated diffs from the pre-execution commit.
- If A12 update is rejected, rerun unit-update with the previous A12 JSON patch or revert the execution commit.
- If any new A-unit is rejected after minting, use a later reviewed unit-deprecate/revert lane rather than hand-editing references/machine.
- Never hand-edit references/machine or references/external as rollback.

## Not Authorized

- A20 execution
- hand edits to references/machine or references/external
- unit minting from this packet alone
- unit update execution from this packet alone
- candidate storage or writes
- lesson output mutation
- target-exercise promotion
- student/product use

## Recommended Next Action

Commit and push this packet and evidence, then run `GATE-MTU-H2E-conditional-lane-execution` as a formal
human review before any CLI execution.
