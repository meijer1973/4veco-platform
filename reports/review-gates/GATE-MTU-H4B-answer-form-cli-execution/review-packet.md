# GATE-MTU-H4B Answer-Form CLI Execution Review Packet

Generated: 2026-05-30

Status: review packet ready, no mutation authorized.

## Review Scope

Review the MTU-H4B answer-form CLI execution packet only. Decide whether a later bounded execution sprint may execute the accepted A80, A81, and A96-A99 unit-add commands.

Remote evidence prerequisite: this review packet, the H4B execution packet, sprint logs, checker, and cited evidence must be committed and pushed to the normal remote branch before human review starts. The gate closure must record the reviewed remote commit/hash.

## Evidence Base

- `reports/mtu-hardening/mtu-h4b-answer-form-cli-execution-packet.json`
- `reports/mtu-hardening/mtu-h4b-answer-form-cli-execution-packet.md`
- `reports/sprints/MTU-H4B-plan.md`
- `reports/sprints/MTU-H4B-baseline.md`
- `reports/review-gates/GATE-MTU-H4A-answer-form-cli-mutation-plan/gate-closure.json`
- `reports/mtu-hardening/mtu-h4a-answer-form-cli-mutation-plan.json`
- `references/machine/micro-teaching-units.json`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.json`
- `reports/json/skilltree-generator-readiness.json`
- `build-scripts/references/unit-add.js`
- `build-scripts/references/build-unit-index.js`
- `build-scripts/references/check-mtu-h4b-answer-form-cli-execution-packet.js`

## Calibration Questions

1. Confirm this gate reviews the H4B execution packet only and does not itself authorize protected reference mutation, unit minting, candidate storage, target-exercise mutation, projection refresh, lesson output, or student/product use.
2. Confirm the H4B packet, review packet, sprint logs, checker, and cited evidence have been pushed to the normal remote branch before review starts.
3. Confirm A100 remains invalid, A71 remains held, candidate storage remains absent, and no proposed answer-form ID is live until a later exact execution gate authorizes it.

If any answer is no, stop and revise the packet or route a governance pause.

## Full Planned Review Questions

The human review must show this complete list before starting, then ask one question at a time.

### MTUH4B-Q1: remote evidence and baseline

Is the H4B baseline sufficient: H4A closed, A80/A81/A96-A99 are absent, A100 is invalid, A71 is held, target fields are absent, and candidate storage is absent?

Options:
- Yes, accept the baseline for execution-packet review.
- Add more source evidence before execution authority can be considered.
- Hold until the remote publication or baseline issue is resolved.
- Open answer / other, with rationale.

### MTUH4B-Q2: ID allocation and future policy

Is bounded use of A80, A81, and A96-A99 acceptable for a later execution sprint, with A100 rejected, A71 held, and future A-domain growth requiring ID-policy or namespace review?

Options:
- Yes, approve this bounded ID allocation for later execution.
- Require an ID-policy sprint before any answer-form execution.
- Revise one or more IDs; name the replacement route.
- Open answer / other, with rationale.

### MTUH4B-Q3: A96 bereken command

Is the exact A96 unit-add command acceptable for ANS_BEREKEN, with formula, substitution, intermediate steps, unit/notation, and conclusion?

Options:
- Yes, approve A96 for later execution.
- Revise the A96 spec or command before execution.
- Hold A96 until more correction-model evidence is read.
- Open answer / other, with rationale.

### MTUH4B-Q4: explanation commands

Are the exact A97, A98, and A99 unit-add commands acceptable as separate later execution lanes for uitleg_dat, uitleg_of, and leg uit met voorbeeld?

Options:
- Yes, approve all three separate commands for later execution.
- Merge or revise one of the lanes; name the change.
- Hold explanation answer-form execution until more evidence is read.
- Open answer / other, with rationale.

### MTUH4B-Q5: A80 noem/geef aan

Is the exact A80 command acceptable for the combined noem/geef-aan answer-form unit, with a future split required if evidence shows geef aan behaves differently?

Options:
- Yes, approve A80 with the split-if-needed condition.
- Split noem and geef aan before execution.
- Hold concise-identification answer forms until more examples are audited.
- Open answer / other, with rationale.

### MTUH4B-Q6: A81 bron modifier

Is the exact A81 command acceptable only as a source-use modifier plus underlying answer form, not as a standalone complete answer form?

Options:
- Yes, approve A81 as modifier plus underlying answer form.
- Revise A81 so source-use stays entirely in task UI rather than an MTU.
- Hold bron until source-annex extraction is reviewed more broadly.
- Open answer / other, with rationale.

### MTUH4B-Q7: generator exposure

Are the generator and exposure guardrails sufficient: planned generators may be missing, so later execution must prove implemented or generator-blocked/non-interactive status and no student-facing exposure?

Options:
- Yes, accept the generator/exposure guardrails.
- Require generator implementations before unit execution.
- Allow unit minting but require generator-blocked proof before any exposure.
- Open answer / other, with rationale.

### MTUH4B-Q8: held lanes and EX overlays

Should graph/draw/shade, Type 4 motiveer/classificatie, and analysis/evaluation remain held, while q3/q15 EX overlays remain visible with no candidate storage or writes?

Options:
- Yes, keep held lanes and EX overlays exactly as written.
- Move one held lane into execution; name it and the evidence.
- Hold all downstream work until candidate storage is authorized.
- Open answer / other, with rationale.

### MTUH4B-Q9: validation and rollback

Are the command logging, no-dry-run disclosure, simulated catalog validation, exam-code validation, expected diff, validation stack, and rollback route sufficient for a later execution sprint?

Options:
- Yes, accept the command, validation, and rollback standard.
- Add more proof requirements before execution.
- Hold until unit-add has a dry-run mode.
- Open answer / other, with rationale.

### MTUH4B-Q10: next sprint and authority

If GATE-MTU-H4B closes, what is authorized next, and does this packet authorize any mutation or product use now?

Options:
- Authorize only a later bounded execution sprint for accepted H4B commands; no execution or product use now.
- Authorize direct execution only if exact commands and final preflight are included in closure.
- Hold all downstream answer-form work and revise the H4B packet.
- Open answer / other, with rationale.

## Exact Command Summary

- `A96`: `node build-scripts/references/unit-add.js --spec '{"id":"A96","name":"Bereken-vraag beantwoorden","kern":"Beantwoord een bereken-vraag controleerbaar door formule, invulling, tussenstappen, eindantwoord, eenheid of notatie en korte conclusie te tonen.","needs":[],"exam_codes":["A2.1","A1.7"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal"],"terms":[],"procedure":["Lees welke grootheid, periode en eenheid de vraag vraagt.","Noteer de formule of rekenregel die past bij de onderliggende vaardigheid.","Vul de gegevens zichtbaar in met labels.","Werk de tussenstappen uit en rond pas af aan het einde of zoals de vraag vraagt.","Geef het eindantwoord met eenheid of notatie en sluit af met een korte conclusie in de context."],"pitfalls":["Alleen een los getal opschrijven zonder controleerbare berekening.","Eenheid, procentteken, indexnotatie of schaalfactor vergeten.","Tussentijds afronden waardoor het eindantwoord afwijkt."],"generator":"GEN_A96","zero_needs_status":"true_zero","zero_needs_review":{"reviewed_on":"2026-05-29","reviewer":"GATE-MTU-H4A planning review","rationale":"Answer-form wrapper combines with underlying calculation/content units in target mappings; no stable content prerequisite is encoded as needs.","recommended_needs":[],"severity":"low"}}'`
- `A97`: `node build-scripts/references/unit-add.js --spec '{"id":"A97","name":"Leg-uit-dat antwoord opbouwen","kern":"Bouw bij een gegeven conclusie een causaleketen op met voldoende schakels en keer expliciet terug naar de gevraagde conclusie.","needs":[],"exam_codes":["A1.7","A4.2"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["verbaal"],"terms":[],"procedure":["Neem de conclusie uit de vraag over als eindpunt van je antwoord.","Bepaal welke economische oorzaak of gegeven in de context het startpunt is.","Schrijf de eerste causale schakel met het juiste begrip of mechanisme.","Schrijf de tweede schakel of het verdere effect dat naar de gegeven conclusie leidt.","Sluit af door de gegeven conclusie expliciet te koppelen aan je redenering."],"pitfalls":["Een mening geven in plaats van de gevraagde conclusie onderbouwen.","Een tussenstap overslaan waardoor de causale keten niet controleerbaar is.","De conclusie veranderen terwijl die in de vraag al gegeven is."],"generator":"GEN_A97","zero_needs_status":"true_zero","zero_needs_review":{"reviewed_on":"2026-05-29","reviewer":"GATE-MTU-H4A planning review","rationale":"Answer-form wrapper; content prerequisites remain in the underlying target mapping rather than in the answer-form needs list.","recommended_needs":[],"severity":"low"}}'`
- `A98`: `node build-scripts/references/unit-add.js --spec '{"id":"A98","name":"Leg-uit-of antwoord opbouwen","kern":"Beantwoord een leg-uit-of vraag door eerst de richting of keuze te bepalen en daarna de redenering te geven die die richting verklaart.","needs":[],"exam_codes":["A1.7","A4.2"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["verbaal"],"terms":[],"procedure":["Bepaal eerst de richting, keuze of ja/nee-uitkomst die de vraag open laat.","Zet die richting expliciet in de eerste zin.","Gebruik het relevante economische mechanisme uit de onderliggende vaardigheid.","Werk de causale schakels uit die laten zien waarom deze richting volgt.","Controleer dat je antwoord niet beide kanten open laat."],"pitfalls":["Beginnen met uitleg zonder de richting te kiezen.","Alleen stijgt/daalt noemen zonder economische oorzaak.","De richting laten afhangen van een niet-genoemde aanname."],"generator":"GEN_A98","zero_needs_status":"true_zero","zero_needs_review":{"reviewed_on":"2026-05-29","reviewer":"GATE-MTU-H4A planning review","rationale":"Answer-form wrapper; underlying content or graph units carry the substantive prerequisite route.","recommended_needs":[],"severity":"low"}}'`
- `A99`: `node build-scripts/references/unit-add.js --spec '{"id":"A99","name":"Leg uit met voorbeeld beantwoorden","kern":"Geef een passend voorbeeld, leg uit waarom het voorbeeld bij het gevraagde begrip of mechanisme hoort, en verbind het voorbeeld met de context.","needs":[],"exam_codes":["A1.3","A1.9"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["verbaal"],"terms":[],"procedure":["Lees welk begrip, mechanisme of effect met een voorbeeld moet worden toegelicht.","Kies een concreet voorbeeld dat binnen de context past.","Benoem welk kenmerk van het voorbeeld relevant is.","Leg uit waarom dat kenmerk bij het begrip of mechanisme hoort.","Koppel het voorbeeld terug aan de vraag of context."],"pitfalls":["Een voorbeeld noemen zonder uitleg waarom het past.","Een voorbeeld kiezen dat buiten de economische context valt.","Alleen de definitie geven terwijl de vraag om een voorbeeld vraagt."],"generator":"GEN_A99","zero_needs_status":"true_zero","zero_needs_review":{"reviewed_on":"2026-05-29","reviewer":"GATE-MTU-H4A planning review","rationale":"Answer-form wrapper for example-answer structure; domain concepts remain separate prerequisites in target mappings.","recommended_needs":[],"severity":"low"}}'`
- `A80`: `node build-scripts/references/unit-add.js --spec '{"id":"A80","name":"Noem of geef-aan antwoord geven","kern":"Geef bij noem/geef-aan vragen precies de gevraagde identificatie of lijst, zonder onnodige berekening of redenering.","needs":[],"exam_codes":["A1.1"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["verbaal"],"terms":[],"procedure":["Onderstreep wat precies genoemd of aangewezen moet worden.","Bepaal hoeveel items of welk soort kenmerk de vraag vraagt.","Geef alleen de gevraagde items, termen, actoren, brongegevens of richtingen.","Gebruik dezelfde taal of labels als de vraag of bron wanneer dat controleerbaar is.","Voeg geen extra redenering toe tenzij de vraag daar apart om vraagt."],"pitfalls":["Meer antwoorden geven dan gevraagd, waardoor een fout antwoord mee kan tellen.","Een uitleg schrijven terwijl alleen identificatie gevraagd is.","Een bronlabel of eenheid weglaten wanneer die nodig is om het item herkenbaar te maken."],"generator":"GEN_A80","zero_needs_status":"true_zero","zero_needs_review":{"reviewed_on":"2026-05-29","reviewer":"GATE-MTU-H4A planning review","rationale":"Answer-form wrapper for concise identification; it combines with whichever content/source unit supplies the item.","recommended_needs":[],"severity":"low"}}'`
- `A81`: `node build-scripts/references/unit-add.js --spec '{"id":"A81","name":"Bron gebruiken in een antwoord","kern":"Gebruik een brongegeven expliciet als bewijs of startpunt en maak daarna de onderliggende uitleg-, bereken-, classificatie- of grafische antwoordvorm af.","needs":[],"exam_codes":["A1.1","A1.5"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["verbaal","grafisch"],"terms":[],"procedure":["Lees welke bron, tabel, figuur of tekstregel de vraag aanwijst.","Noteer de relevante bronobservatie met label, periode, eenheid of richting.","Zeg wat die observatie economisch betekent.","Verbind de bronobservatie met de onderliggende antwoordvorm, zoals uitleg, berekening, classificatie of grafiek.","Controleer dat het antwoord niet stopt bij alleen citeren of aflezen."],"pitfalls":["Een bron noemen zonder te gebruiken in de redenering.","Een getal of figuur aflezen zonder eenheid, periode of label.","Brongebruik behandelen als volledig antwoord terwijl de vraag ook uitleg, berekening of conclusie vraagt."],"generator":"GEN_A81","zero_needs_status":"true_zero","zero_needs_review":{"reviewed_on":"2026-05-29","reviewer":"GATE-MTU-H4A planning review","rationale":"Answer-form modifier for source use, not a standalone complete answer form; underlying answer-form and content units remain mapped separately.","recommended_needs":[],"severity":"low"}}'`

## Stop Conditions

- Stop if the packet/evidence has not been pushed before review.
- Stop if any answer authorizes hand edits to references/machine or references/external.
- Stop if any answer authorizes unit minting, target-exercise writes, candidate storage, candidate writes, projection refresh, lesson output, or product use from this gate.
- Stop if A100 or any invalid ID is treated as usable.
- Stop if A71 is consumed without explicit reviewer decision.
- Stop if bron is treated as a standalone complete answer form.
- Stop if graph, Type 4, or analysis/evaluation are minted without stronger evidence.
- Stop if q3/q15 EX overlay needs are hidden inside broad MTUs.
- Stop if student-facing exposure is authorized without generator implementation or generator-blocked/non-interactive proof.

## Future Interview Protocol

- Show the full question list before starting.
- Ask calibration questions before binding answers.
- Ask one question at a time.
- Record each answer before asking the next question.
- Run pattern analysis after initial answers.
- Ask targeted follow-ups for ambiguity or conflicting authority.
- Draft a closure proposal only after evidence is complete.
- Require explicit human confirmation before writing a closure record or authorizing downstream execution scope.

## Recommended Next Action

Commit and push this packet and cited evidence, then run GATE-MTU-H4B before any answer-form MTU minting or downstream exposure.
