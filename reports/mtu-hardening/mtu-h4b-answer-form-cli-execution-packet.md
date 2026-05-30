# MTU-H4B Answer-Form CLI Execution Packet

Generated: 2026-05-30

Status: execution packet ready, no mutation authorized.

## Authority Boundary

This packet prepares a later bounded execution review only. It does not authorize unit minting, protected reference mutation, target-exercise field writes, candidate storage creation, candidate writes, generated projection refresh, lesson output, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, Scale Gate 1, or student/product use.

## Exact Unit Specs

### A96 Bereken-vraag beantwoorden

- Lane: `ANS_BEREKEN`
- Action: `unit-add`
- Execution authorized by this packet: `false`

```json
{
  "id": "A96",
  "name": "Bereken-vraag beantwoorden",
  "kern": "Beantwoord een bereken-vraag controleerbaar door formule, invulling, tussenstappen, eindantwoord, eenheid of notatie en korte conclusie te tonen.",
  "needs": [],
  "exam_codes": [
    "A2.1",
    "A1.7"
  ],
  "mastery_target": "apply",
  "prior_learning": "new_this_year",
  "aspects": [
    "rekenen",
    "verbaal"
  ],
  "terms": [],
  "procedure": [
    "Lees welke grootheid, periode en eenheid de vraag vraagt.",
    "Noteer de formule of rekenregel die past bij de onderliggende vaardigheid.",
    "Vul de gegevens zichtbaar in met labels.",
    "Werk de tussenstappen uit en rond pas af aan het einde of zoals de vraag vraagt.",
    "Geef het eindantwoord met eenheid of notatie en sluit af met een korte conclusie in de context."
  ],
  "pitfalls": [
    "Alleen een los getal opschrijven zonder controleerbare berekening.",
    "Eenheid, procentteken, indexnotatie of schaalfactor vergeten.",
    "Tussentijds afronden waardoor het eindantwoord afwijkt."
  ],
  "generator": "GEN_A96",
  "zero_needs_status": "true_zero",
  "zero_needs_review": {
    "reviewed_on": "2026-05-29",
    "reviewer": "GATE-MTU-H4A planning review",
    "rationale": "Answer-form wrapper combines with underlying calculation/content units in target mappings; no stable content prerequisite is encoded as needs.",
    "recommended_needs": [],
    "severity": "low"
  }
}
```

### A97 Leg-uit-dat antwoord opbouwen

- Lane: `ANS_LEG_UIT_DAT`
- Action: `unit-add`
- Execution authorized by this packet: `false`

```json
{
  "id": "A97",
  "name": "Leg-uit-dat antwoord opbouwen",
  "kern": "Bouw bij een gegeven conclusie een causaleketen op met voldoende schakels en keer expliciet terug naar de gevraagde conclusie.",
  "needs": [],
  "exam_codes": [
    "A1.7",
    "A4.2"
  ],
  "mastery_target": "apply",
  "prior_learning": "new_this_year",
  "aspects": [
    "verbaal"
  ],
  "terms": [],
  "procedure": [
    "Neem de conclusie uit de vraag over als eindpunt van je antwoord.",
    "Bepaal welke economische oorzaak of gegeven in de context het startpunt is.",
    "Schrijf de eerste causale schakel met het juiste begrip of mechanisme.",
    "Schrijf de tweede schakel of het verdere effect dat naar de gegeven conclusie leidt.",
    "Sluit af door de gegeven conclusie expliciet te koppelen aan je redenering."
  ],
  "pitfalls": [
    "Een mening geven in plaats van de gevraagde conclusie onderbouwen.",
    "Een tussenstap overslaan waardoor de causale keten niet controleerbaar is.",
    "De conclusie veranderen terwijl die in de vraag al gegeven is."
  ],
  "generator": "GEN_A97",
  "zero_needs_status": "true_zero",
  "zero_needs_review": {
    "reviewed_on": "2026-05-29",
    "reviewer": "GATE-MTU-H4A planning review",
    "rationale": "Answer-form wrapper; content prerequisites remain in the underlying target mapping rather than in the answer-form needs list.",
    "recommended_needs": [],
    "severity": "low"
  }
}
```

### A98 Leg-uit-of antwoord opbouwen

- Lane: `ANS_LEG_UIT_OF`
- Action: `unit-add`
- Execution authorized by this packet: `false`

```json
{
  "id": "A98",
  "name": "Leg-uit-of antwoord opbouwen",
  "kern": "Beantwoord een leg-uit-of vraag door eerst de richting of keuze te bepalen en daarna de redenering te geven die die richting verklaart.",
  "needs": [],
  "exam_codes": [
    "A1.7",
    "A4.2"
  ],
  "mastery_target": "apply",
  "prior_learning": "new_this_year",
  "aspects": [
    "verbaal"
  ],
  "terms": [],
  "procedure": [
    "Bepaal eerst de richting, keuze of ja/nee-uitkomst die de vraag open laat.",
    "Zet die richting expliciet in de eerste zin.",
    "Gebruik het relevante economische mechanisme uit de onderliggende vaardigheid.",
    "Werk de causale schakels uit die laten zien waarom deze richting volgt.",
    "Controleer dat je antwoord niet beide kanten open laat."
  ],
  "pitfalls": [
    "Beginnen met uitleg zonder de richting te kiezen.",
    "Alleen stijgt/daalt noemen zonder economische oorzaak.",
    "De richting laten afhangen van een niet-genoemde aanname."
  ],
  "generator": "GEN_A98",
  "zero_needs_status": "true_zero",
  "zero_needs_review": {
    "reviewed_on": "2026-05-29",
    "reviewer": "GATE-MTU-H4A planning review",
    "rationale": "Answer-form wrapper; underlying content or graph units carry the substantive prerequisite route.",
    "recommended_needs": [],
    "severity": "low"
  }
}
```

### A99 Leg uit met voorbeeld beantwoorden

- Lane: `ANS_LEG_UIT_MET_VOORBEELD`
- Action: `unit-add`
- Execution authorized by this packet: `false`

```json
{
  "id": "A99",
  "name": "Leg uit met voorbeeld beantwoorden",
  "kern": "Geef een passend voorbeeld, leg uit waarom het voorbeeld bij het gevraagde begrip of mechanisme hoort, en verbind het voorbeeld met de context.",
  "needs": [],
  "exam_codes": [
    "A1.3",
    "A1.9"
  ],
  "mastery_target": "apply",
  "prior_learning": "new_this_year",
  "aspects": [
    "verbaal"
  ],
  "terms": [],
  "procedure": [
    "Lees welk begrip, mechanisme of effect met een voorbeeld moet worden toegelicht.",
    "Kies een concreet voorbeeld dat binnen de context past.",
    "Benoem welk kenmerk van het voorbeeld relevant is.",
    "Leg uit waarom dat kenmerk bij het begrip of mechanisme hoort.",
    "Koppel het voorbeeld terug aan de vraag of context."
  ],
  "pitfalls": [
    "Een voorbeeld noemen zonder uitleg waarom het past.",
    "Een voorbeeld kiezen dat buiten de economische context valt.",
    "Alleen de definitie geven terwijl de vraag om een voorbeeld vraagt."
  ],
  "generator": "GEN_A99",
  "zero_needs_status": "true_zero",
  "zero_needs_review": {
    "reviewed_on": "2026-05-29",
    "reviewer": "GATE-MTU-H4A planning review",
    "rationale": "Answer-form wrapper for example-answer structure; domain concepts remain separate prerequisites in target mappings.",
    "recommended_needs": [],
    "severity": "low"
  }
}
```

### A80 Noem of geef-aan antwoord geven

- Lane: `ANS_NOEM_GEEF_AAN`
- Action: `unit-add`
- Execution authorized by this packet: `false`
- Condition: Split noem and geef-aan into separate lanes if reviewed evidence shows different answer-construction behavior.

```json
{
  "id": "A80",
  "name": "Noem of geef-aan antwoord geven",
  "kern": "Geef bij noem/geef-aan vragen precies de gevraagde identificatie of lijst, zonder onnodige berekening of redenering.",
  "needs": [],
  "exam_codes": [
    "A1.1"
  ],
  "mastery_target": "apply",
  "prior_learning": "new_this_year",
  "aspects": [
    "verbaal"
  ],
  "terms": [],
  "procedure": [
    "Onderstreep wat precies genoemd of aangewezen moet worden.",
    "Bepaal hoeveel items of welk soort kenmerk de vraag vraagt.",
    "Geef alleen de gevraagde items, termen, actoren, brongegevens of richtingen.",
    "Gebruik dezelfde taal of labels als de vraag of bron wanneer dat controleerbaar is.",
    "Voeg geen extra redenering toe tenzij de vraag daar apart om vraagt."
  ],
  "pitfalls": [
    "Meer antwoorden geven dan gevraagd, waardoor een fout antwoord mee kan tellen.",
    "Een uitleg schrijven terwijl alleen identificatie gevraagd is.",
    "Een bronlabel of eenheid weglaten wanneer die nodig is om het item herkenbaar te maken."
  ],
  "generator": "GEN_A80",
  "zero_needs_status": "true_zero",
  "zero_needs_review": {
    "reviewed_on": "2026-05-29",
    "reviewer": "GATE-MTU-H4A planning review",
    "rationale": "Answer-form wrapper for concise identification; it combines with whichever content/source unit supplies the item.",
    "recommended_needs": [],
    "severity": "low"
  }
}
```

### A81 Bron gebruiken in een antwoord

- Lane: `ANS_BRON_GEBRUIKEN`
- Action: `unit-add`
- Execution authorized by this packet: `false`
- Boundary: source-use modifier only; not a standalone complete answer form.
- Compatible underlying forms: `ANS_BEREKEN`, `ANS_LEG_UIT_DAT`, `ANS_LEG_UIT_OF`, `ANS_LEG_UIT_MET_VOORBEELD`, `ANS_NOEM_GEEF_AAN`, `ANS_MOTIVEER_CLASSIFICATIE`, `ANS_GRAFISCH_ARCEER_TEKEN`

```json
{
  "id": "A81",
  "name": "Bron gebruiken in een antwoord",
  "kern": "Gebruik een brongegeven expliciet als bewijs of startpunt en maak daarna de onderliggende uitleg-, bereken-, classificatie- of grafische antwoordvorm af.",
  "needs": [],
  "exam_codes": [
    "A1.1",
    "A1.5"
  ],
  "mastery_target": "apply",
  "prior_learning": "new_this_year",
  "aspects": [
    "verbaal",
    "grafisch"
  ],
  "terms": [],
  "procedure": [
    "Lees welke bron, tabel, figuur of tekstregel de vraag aanwijst.",
    "Noteer de relevante bronobservatie met label, periode, eenheid of richting.",
    "Zeg wat die observatie economisch betekent.",
    "Verbind de bronobservatie met de onderliggende antwoordvorm, zoals uitleg, berekening, classificatie of grafiek.",
    "Controleer dat het antwoord niet stopt bij alleen citeren of aflezen."
  ],
  "pitfalls": [
    "Een bron noemen zonder te gebruiken in de redenering.",
    "Een getal of figuur aflezen zonder eenheid, periode of label.",
    "Brongebruik behandelen als volledig antwoord terwijl de vraag ook uitleg, berekening of conclusie vraagt."
  ],
  "generator": "GEN_A81",
  "zero_needs_status": "true_zero",
  "zero_needs_review": {
    "reviewed_on": "2026-05-29",
    "reviewer": "GATE-MTU-H4A planning review",
    "rationale": "Answer-form modifier for source use, not a standalone complete answer form; underlying answer-form and content units remain mapped separately.",
    "recommended_needs": [],
    "severity": "low"
  }
}
```

## Exact Command Set

| Order | Unit | Command | Dry-run status |
|---|---|---|---|
| 1 | `A96` | `node build-scripts/references/unit-add.js --spec '{"id":"A96","name":"Bereken-vraag beantwoorden","kern":"Beantwoord een bereken-vraag controleerbaar door formule, invulling, tussenstappen, eindantwoord, eenheid of notatie en korte conclusie te tonen.","needs":[],"exam_codes":["A2.1","A1.7"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal"],"terms":[],"procedure":["Lees welke grootheid, periode en eenheid de vraag vraagt.","Noteer de formule of rekenregel die past bij de onderliggende vaardigheid.","Vul de gegevens zichtbaar in met labels.","Werk de tussenstappen uit en rond pas af aan het einde of zoals de vraag vraagt.","Geef het eindantwoord met eenheid of notatie en sluit af met een korte conclusie in de context."],"pitfalls":["Alleen een los getal opschrijven zonder controleerbare berekening.","Eenheid, procentteken, indexnotatie of schaalfactor vergeten.","Tussentijds afronden waardoor het eindantwoord afwijkt."],"generator":"GEN_A96","zero_needs_status":"true_zero","zero_needs_review":{"reviewed_on":"2026-05-29","reviewer":"GATE-MTU-H4A planning review","rationale":"Answer-form wrapper combines with underlying calculation/content units in target mappings; no stable content prerequisite is encoded as needs.","recommended_needs":[],"severity":"low"}}'` | unit-add has no dry-run mode in the current CLI; H4B therefore uses simulated catalog validation and exact command review instead. |
| 2 | `A97` | `node build-scripts/references/unit-add.js --spec '{"id":"A97","name":"Leg-uit-dat antwoord opbouwen","kern":"Bouw bij een gegeven conclusie een causaleketen op met voldoende schakels en keer expliciet terug naar de gevraagde conclusie.","needs":[],"exam_codes":["A1.7","A4.2"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["verbaal"],"terms":[],"procedure":["Neem de conclusie uit de vraag over als eindpunt van je antwoord.","Bepaal welke economische oorzaak of gegeven in de context het startpunt is.","Schrijf de eerste causale schakel met het juiste begrip of mechanisme.","Schrijf de tweede schakel of het verdere effect dat naar de gegeven conclusie leidt.","Sluit af door de gegeven conclusie expliciet te koppelen aan je redenering."],"pitfalls":["Een mening geven in plaats van de gevraagde conclusie onderbouwen.","Een tussenstap overslaan waardoor de causale keten niet controleerbaar is.","De conclusie veranderen terwijl die in de vraag al gegeven is."],"generator":"GEN_A97","zero_needs_status":"true_zero","zero_needs_review":{"reviewed_on":"2026-05-29","reviewer":"GATE-MTU-H4A planning review","rationale":"Answer-form wrapper; content prerequisites remain in the underlying target mapping rather than in the answer-form needs list.","recommended_needs":[],"severity":"low"}}'` | unit-add has no dry-run mode in the current CLI; H4B therefore uses simulated catalog validation and exact command review instead. |
| 3 | `A98` | `node build-scripts/references/unit-add.js --spec '{"id":"A98","name":"Leg-uit-of antwoord opbouwen","kern":"Beantwoord een leg-uit-of vraag door eerst de richting of keuze te bepalen en daarna de redenering te geven die die richting verklaart.","needs":[],"exam_codes":["A1.7","A4.2"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["verbaal"],"terms":[],"procedure":["Bepaal eerst de richting, keuze of ja/nee-uitkomst die de vraag open laat.","Zet die richting expliciet in de eerste zin.","Gebruik het relevante economische mechanisme uit de onderliggende vaardigheid.","Werk de causale schakels uit die laten zien waarom deze richting volgt.","Controleer dat je antwoord niet beide kanten open laat."],"pitfalls":["Beginnen met uitleg zonder de richting te kiezen.","Alleen stijgt/daalt noemen zonder economische oorzaak.","De richting laten afhangen van een niet-genoemde aanname."],"generator":"GEN_A98","zero_needs_status":"true_zero","zero_needs_review":{"reviewed_on":"2026-05-29","reviewer":"GATE-MTU-H4A planning review","rationale":"Answer-form wrapper; underlying content or graph units carry the substantive prerequisite route.","recommended_needs":[],"severity":"low"}}'` | unit-add has no dry-run mode in the current CLI; H4B therefore uses simulated catalog validation and exact command review instead. |
| 4 | `A99` | `node build-scripts/references/unit-add.js --spec '{"id":"A99","name":"Leg uit met voorbeeld beantwoorden","kern":"Geef een passend voorbeeld, leg uit waarom het voorbeeld bij het gevraagde begrip of mechanisme hoort, en verbind het voorbeeld met de context.","needs":[],"exam_codes":["A1.3","A1.9"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["verbaal"],"terms":[],"procedure":["Lees welk begrip, mechanisme of effect met een voorbeeld moet worden toegelicht.","Kies een concreet voorbeeld dat binnen de context past.","Benoem welk kenmerk van het voorbeeld relevant is.","Leg uit waarom dat kenmerk bij het begrip of mechanisme hoort.","Koppel het voorbeeld terug aan de vraag of context."],"pitfalls":["Een voorbeeld noemen zonder uitleg waarom het past.","Een voorbeeld kiezen dat buiten de economische context valt.","Alleen de definitie geven terwijl de vraag om een voorbeeld vraagt."],"generator":"GEN_A99","zero_needs_status":"true_zero","zero_needs_review":{"reviewed_on":"2026-05-29","reviewer":"GATE-MTU-H4A planning review","rationale":"Answer-form wrapper for example-answer structure; domain concepts remain separate prerequisites in target mappings.","recommended_needs":[],"severity":"low"}}'` | unit-add has no dry-run mode in the current CLI; H4B therefore uses simulated catalog validation and exact command review instead. |
| 5 | `A80` | `node build-scripts/references/unit-add.js --spec '{"id":"A80","name":"Noem of geef-aan antwoord geven","kern":"Geef bij noem/geef-aan vragen precies de gevraagde identificatie of lijst, zonder onnodige berekening of redenering.","needs":[],"exam_codes":["A1.1"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["verbaal"],"terms":[],"procedure":["Onderstreep wat precies genoemd of aangewezen moet worden.","Bepaal hoeveel items of welk soort kenmerk de vraag vraagt.","Geef alleen de gevraagde items, termen, actoren, brongegevens of richtingen.","Gebruik dezelfde taal of labels als de vraag of bron wanneer dat controleerbaar is.","Voeg geen extra redenering toe tenzij de vraag daar apart om vraagt."],"pitfalls":["Meer antwoorden geven dan gevraagd, waardoor een fout antwoord mee kan tellen.","Een uitleg schrijven terwijl alleen identificatie gevraagd is.","Een bronlabel of eenheid weglaten wanneer die nodig is om het item herkenbaar te maken."],"generator":"GEN_A80","zero_needs_status":"true_zero","zero_needs_review":{"reviewed_on":"2026-05-29","reviewer":"GATE-MTU-H4A planning review","rationale":"Answer-form wrapper for concise identification; it combines with whichever content/source unit supplies the item.","recommended_needs":[],"severity":"low"}}'` | unit-add has no dry-run mode in the current CLI; H4B therefore uses simulated catalog validation and exact command review instead. |
| 6 | `A81` | `node build-scripts/references/unit-add.js --spec '{"id":"A81","name":"Bron gebruiken in een antwoord","kern":"Gebruik een brongegeven expliciet als bewijs of startpunt en maak daarna de onderliggende uitleg-, bereken-, classificatie- of grafische antwoordvorm af.","needs":[],"exam_codes":["A1.1","A1.5"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["verbaal","grafisch"],"terms":[],"procedure":["Lees welke bron, tabel, figuur of tekstregel de vraag aanwijst.","Noteer de relevante bronobservatie met label, periode, eenheid of richting.","Zeg wat die observatie economisch betekent.","Verbind de bronobservatie met de onderliggende antwoordvorm, zoals uitleg, berekening, classificatie of grafiek.","Controleer dat het antwoord niet stopt bij alleen citeren of aflezen."],"pitfalls":["Een bron noemen zonder te gebruiken in de redenering.","Een getal of figuur aflezen zonder eenheid, periode of label.","Brongebruik behandelen als volledig antwoord terwijl de vraag ook uitleg, berekening of conclusie vraagt."],"generator":"GEN_A81","zero_needs_status":"true_zero","zero_needs_review":{"reviewed_on":"2026-05-29","reviewer":"GATE-MTU-H4A planning review","rationale":"Answer-form modifier for source use, not a standalone complete answer form; underlying answer-form and content units remain mapped separately.","recommended_needs":[],"severity":"low"}}'` | unit-add has no dry-run mode in the current CLI; H4B therefore uses simulated catalog validation and exact command review instead. |

Before any later execution, print and log each extracted spec and compare its SHA-256 hash with the packet value.

## ID Allocation Proof

- Accepted bounded IDs: `A96`, `A97`, `A98`, `A99`, `A80`, `A81`.
- Held ID not consumed: `A71`.
- Invalid IDs rejected: `A100`.
- Future A-domain growth: ID-policy or namespace decision before any further A-domain answer-form planning.

## Simulated Catalog Validation

Status: `passed`

| Unit | validateSpec errors |
|---|---|
| `A96` | none |
| `A97` | none |
| `A98` | none |
| `A99` | none |
| `A80` | none |
| `A81` | none |

Catalog validation errors: none.

## Exam-Code Validation

| Code | Present in syllabus registry |
|---|---|
| `A1.1` | yes |
| `A1.3` | yes |
| `A1.5` | yes |
| `A1.7` | yes |
| `A1.9` | yes |
| `A2.1` | yes |
| `A4.2` | yes |

## Generator And Exposure Guardrails

The planned answer-form units declare generators, but this sprint does not implement generators or expose student-facing routes. Later execution must prove generator implementation or generator-blocked/non-interactive status before any student-facing route can expose these units.

| Unit | Generator | Implemented now | Exposure now |
|---|---|---|---|
| `A96` | `GEN_A96` | no | not_live_no_student_route |
| `A97` | `GEN_A97` | no | not_live_no_student_route |
| `A98` | `GEN_A98` | no | not_live_no_student_route |
| `A99` | `GEN_A99` | no | not_live_no_student_route |
| `A80` | `GEN_A80` | no | not_live_no_student_route |
| `A81` | `GEN_A81` | no | not_live_no_student_route |

## Held Lanes

- `ANS_GRAFISCH_ARCEER_TEKEN`: held_pending_stronger_evidence_or_separate_gate; execution command present = `false`.
- `ANS_MOTIVEER_CLASSIFICATIE`: held_pending_stronger_evidence_or_separate_gate; execution command present = `false`.
- `ANS_ANALYSEER_BEOORDEEL`: held_pending_stronger_evidence_or_separate_gate; execution command present = `false`.

## EX Overlay Boundary

q3 threshold conclusion/unit-direction and q15 two-step correction-model explanation remain visible as EX answer-skill overlays. Candidate storage remains absent and no candidate writes are authorized.

## Target-Exercise Mapping Boundary

Current question-type mappings remain planning input only. No `question_type`, `answer_form`, or other target-exercise fields are written by this packet or by the later answer-form unit execution lane.

## Rollback Route

- Capture git status and current commit before execution.
- Run exact commands only after a later gate authorizes execution.
- If any command fails before commit, revert the execution sprint changes as a whole; do not hand-edit references/machine.
- If execution is committed and later rejected, route a reviewed revert or deprecation sprint; do not use silent hand edits.
- Never create answer-skill candidate storage, target-exercise fields, generated projections, or lesson output as rollback side effects.

## Validation Required

- `node build-scripts/references/check-mtu-h4b-answer-form-cli-execution-packet.js`
- `node build-scripts/references/build-unit-index.js`
- `node build-scripts/references/validate-core-schemas.js`
- `node scripts/check-course-target-exercises-v5.js`
- `node build-scripts/references/build-skilltree-generator-readiness.js`
- `node build-scripts/references/check-skilltree-generator-readiness.js`
- `node build-scripts/reports/validate-report-json.js`
- `npm.cmd test -- --runInBand`
- `git diff --check`

## Recommended Next Action

Commit and push this H4B packet and cited evidence, then run GATE-MTU-H4B before any answer-form unit minting or downstream exposure.
