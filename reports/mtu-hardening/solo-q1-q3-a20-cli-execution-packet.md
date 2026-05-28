# MTU-H2I A20/A94/A95 CLI Execution Packet

Generated: 2026-05-28

Status: packet ready, no mutation authorized.

This packet prepares a later bounded execution sprint for review only.
It does not authorize `A20` mutation, `A94`/`A95` minting, target-exercise mapping writes, generator changes, projection refresh, PV projection, lesson output, or student/product use.

## Source Gate

GATE-MTU-H2H closed as PASS WITH CONDITIONS at reviewed remote commit `d806903cb0072c38c265974642c1bc38fd1c0c69`.

## Planned Execution Lanes

| Unit/surface | Action | Execution condition |
|---|---|---|
| `A20` | `unit-update` | dry-run first, retain `A2.11`, execute only with mapping/generator route |
| `A94` | `unit-add` | exact spec printed; unit-add dry-run limitation visible; generator-blocked unless `GEN.A94` is implemented |
| `A95` | `unit-add` | exact spec printed; preferred destination for current `GEN.A20` behavior |
| target mappings | authored-source update | exact before/after arrays only; no target-exercise promotion |
| generator route | generator code update/block | current `GEN.A20` behavior moves to `GEN.A95`; `GEN.A20` blocked until narrowed generator exists |

## Exact Unit Specs

### A20

```json
{
  "name": "Winstmaximum oplossen met afgeleide MO en MK",
  "kern": "Los de winstmaximaliserende hoeveelheid op nadat MO uit TO en MK uit TK zijn afgeleid.",
  "needs": [
    "A12",
    "A13",
    "A02"
  ],
  "exam_codes": [
    "A2.10",
    "A2.11",
    "A2.12"
  ],
  "mastery_target": "apply",
  "prior_learning": "new_this_year",
  "aspects": [
    "rekenen",
    "verbaal"
  ],
  "terms": [
    "marginale-kosten"
  ],
  "procedure": [
    "Bepaal MO via de afgeleide route uit TO.",
    "Bepaal MK via de afgeleide route uit TK.",
    "Stel MO = MK.",
    "Los op naar Q*.",
    "Gebruik Q* daarna in de passende prijs-, opbrengst- of winstroute."
  ],
  "pitfalls": [
    "Deze route gebruiken wanneer MK al als constante of functie is gegeven.",
    "Deze route gebruiken wanneer MO bij volkomen concurrentie direct gelijk is aan P.",
    "De MO- of MK-uitkomst als verkoopprijs behandelen."
  ],
  "generator": "GEN_A20"
}
```

### A94

```json
{
  "id": "A94",
  "name": "MO = P en afgeleide MK oplossen",
  "kern": "Los de winstmaximaliserende hoeveelheid op wanneer MO bij een prijsnemer gelijk is aan P en MK eerst uit TK moet worden afgeleid.",
  "needs": [
    "A13",
    "A02"
  ],
  "exam_codes": [
    "A2.10",
    "A2.11",
    "A2.12"
  ],
  "mastery_target": "apply",
  "prior_learning": "new_this_year",
  "aspects": [
    "rekenen",
    "verbaal"
  ],
  "terms": [
    "marginale-kosten"
  ],
  "procedure": [
    "Herken dat de aanbieder een prijsnemer is bij volkomen concurrentie.",
    "Gebruik de regel: bij een prijsnemer geldt MO = marktprijs P.",
    "Bepaal MK als afgeleide van TK.",
    "Stel P = MK.",
    "Los op naar Q*."
  ],
  "pitfalls": [
    "A12 verplicht maken terwijl MO bij de prijsnemer direct gelijk is aan P.",
    "MK overslaan terwijl TK moet worden gedifferentieerd.",
    "De gevonden Q* verwarren met prijs of winst."
  ],
  "generator": "GEN_A94"
}
```

### A95

```json
{
  "id": "A95",
  "name": "MO = gegeven MK-functie oplossen",
  "kern": "Los MO = MK op wanneer de MK-functie in de opgave staat en niet uit TK hoeft te worden afgeleid.",
  "needs": [
    "A02"
  ],
  "exam_codes": [
    "A2.10",
    "A2.12"
  ],
  "mastery_target": "apply",
  "prior_learning": "new_this_year",
  "aspects": [
    "rekenen",
    "verbaal"
  ],
  "terms": [
    "marginale-kosten"
  ],
  "procedure": [
    "Neem de beschikbare MO-functie uit de voorafgaande stap of uit de opgave.",
    "Neem de gegeven MK-functie uit de opgave.",
    "Stel MO = MK.",
    "Los de vergelijking op naar Q*.",
    "Controleer dat je geen MK-functie afleidt als MK al gegeven is."
  ],
  "pitfalls": [
    "De gegeven MK-functie opnieuw afleiden.",
    "A91 gebruiken terwijl MK geen constante maar een functie is.",
    "De gevonden Q* als prijs behandelen."
  ],
  "generator": "GEN_A95"
}
```

## Exact Command Set

### A20

Dry-run:

```bash
node build-scripts/references/unit-update.js --id A20 --spec '{"name":"Winstmaximum oplossen met afgeleide MO en MK","kern":"Los de winstmaximaliserende hoeveelheid op nadat MO uit TO en MK uit TK zijn afgeleid.","needs":["A12","A13","A02"],"exam_codes":["A2.10","A2.11","A2.12"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal"],"terms":["marginale-kosten"],"procedure":["Bepaal MO via de afgeleide route uit TO.","Bepaal MK via de afgeleide route uit TK.","Stel MO = MK.","Los op naar Q*.","Gebruik Q* daarna in de passende prijs-, opbrengst- of winstroute."],"pitfalls":["Deze route gebruiken wanneer MK al als constante of functie is gegeven.","Deze route gebruiken wanneer MO bij volkomen concurrentie direct gelijk is aan P.","De MO- of MK-uitkomst als verkoopprijs behandelen."],"generator":"GEN_A20"}' --dry-run
```

Execution command, not authorized by this packet:

```bash
node build-scripts/references/unit-update.js --id A20 --spec '{"name":"Winstmaximum oplossen met afgeleide MO en MK","kern":"Los de winstmaximaliserende hoeveelheid op nadat MO uit TO en MK uit TK zijn afgeleid.","needs":["A12","A13","A02"],"exam_codes":["A2.10","A2.11","A2.12"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal"],"terms":["marginale-kosten"],"procedure":["Bepaal MO via de afgeleide route uit TO.","Bepaal MK via de afgeleide route uit TK.","Stel MO = MK.","Los op naar Q*.","Gebruik Q* daarna in de passende prijs-, opbrengst- of winstroute."],"pitfalls":["Deze route gebruiken wanneer MK al als constante of functie is gegeven.","Deze route gebruiken wanneer MO bij volkomen concurrentie direct gelijk is aan P.","De MO- of MK-uitkomst als verkoopprijs behandelen."],"generator":"GEN_A20"}'
```

### A94

Dry-run limitation: unit-add has no dry-run mode in the current CLI

Execution command, not authorized by this packet:

```bash
node build-scripts/references/unit-add.js --spec '{"id":"A94","name":"MO = P en afgeleide MK oplossen","kern":"Los de winstmaximaliserende hoeveelheid op wanneer MO bij een prijsnemer gelijk is aan P en MK eerst uit TK moet worden afgeleid.","needs":["A13","A02"],"exam_codes":["A2.10","A2.11","A2.12"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal"],"terms":["marginale-kosten"],"procedure":["Herken dat de aanbieder een prijsnemer is bij volkomen concurrentie.","Gebruik de regel: bij een prijsnemer geldt MO = marktprijs P.","Bepaal MK als afgeleide van TK.","Stel P = MK.","Los op naar Q*."],"pitfalls":["A12 verplicht maken terwijl MO bij de prijsnemer direct gelijk is aan P.","MK overslaan terwijl TK moet worden gedifferentieerd.","De gevonden Q* verwarren met prijs of winst."],"generator":"GEN_A94"}'
```

### A95

Dry-run limitation: unit-add has no dry-run mode in the current CLI

Execution command, not authorized by this packet:

```bash
node build-scripts/references/unit-add.js --spec '{"id":"A95","name":"MO = gegeven MK-functie oplossen","kern":"Los MO = MK op wanneer de MK-functie in de opgave staat en niet uit TK hoeft te worden afgeleid.","needs":["A02"],"exam_codes":["A2.10","A2.12"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal"],"terms":["marginale-kosten"],"procedure":["Neem de beschikbare MO-functie uit de voorafgaande stap of uit de opgave.","Neem de gegeven MK-functie uit de opgave.","Stel MO = MK.","Los de vergelijking op naar Q*.","Controleer dat je geen MK-functie afleidt als MK al gegeven is."],"pitfalls":["De gegeven MK-functie opnieuw afleiden.","A91 gebruiken terwijl MK geen constante maar een functie is.","De gevonden Q* als prijs behandelen."],"generator":"GEN_A95"}'
```

## Target-Exercise Mapping Patch

### 3.2.2

Classification: `price_taker_mo_equals_p_plus_derived_mk`

```json
{
  "before": {
    "required_skills": [
      "A11",
      "A13",
      "A20",
      "A21",
      "A33",
      "D30"
    ],
    "prior_knowledge_assumed": [
      "A20",
      "A21",
      "D30"
    ],
    "new_skills_introduced": [
      "A11",
      "A13",
      "A33"
    ]
  },
  "after": {
    "required_skills": [
      "A11",
      "A13",
      "A94",
      "A21",
      "A33",
      "D30"
    ],
    "prior_knowledge_assumed": [
      "A21",
      "D30"
    ],
    "new_skills_introduced": [
      "A11",
      "A13",
      "A94",
      "A33"
    ]
  }
}
```

Apply exactly these array changes and do not change record_status, target_exercise, source_ref, paragraph metadata, or promotion fields.

### 3.3.3

Classification: `derived_mo_plus_derived_mk`

```json
{
  "before": {
    "required_skills": [
      "A03",
      "A07",
      "A11",
      "A12",
      "A13",
      "A20",
      "A21",
      "A35",
      "A40",
      "D30"
    ],
    "prior_knowledge_assumed": [
      "A03",
      "A07",
      "A11",
      "A12",
      "A13",
      "A20",
      "A21",
      "A40",
      "D30"
    ],
    "new_skills_introduced": [
      "A35"
    ]
  },
  "after": {
    "required_skills": [
      "A03",
      "A07",
      "A11",
      "A12",
      "A13",
      "A20",
      "A21",
      "A35",
      "A40",
      "D30"
    ],
    "prior_knowledge_assumed": [
      "A03",
      "A07",
      "A11",
      "A12",
      "A13",
      "A20",
      "A21",
      "A40",
      "D30"
    ],
    "new_skills_introduced": [
      "A35"
    ]
  }
}
```

No authored mapping write expected; verify it remains the narrowed A20 canonical derived route.

### 4.1.2

Classification: `given_constant_mk`

```json
{
  "before": {
    "required_skills": [
      "A11",
      "A20",
      "A35",
      "A36",
      "D18",
      "D21",
      "D22",
      "D24"
    ],
    "prior_knowledge_assumed": [
      "A11",
      "A20",
      "A35"
    ],
    "new_skills_introduced": [
      "A36",
      "D18",
      "D21",
      "D22",
      "D24"
    ]
  },
  "after": {
    "required_skills": [
      "A11",
      "A91",
      "A35",
      "A36",
      "D18",
      "D21",
      "D22",
      "D24"
    ],
    "prior_knowledge_assumed": [
      "A11",
      "A91",
      "A35"
    ],
    "new_skills_introduced": [
      "A36",
      "D18",
      "D21",
      "D22",
      "D24"
    ]
  }
}
```

Apply exactly these array changes and do not change record_status, target_exercise, source_ref, paragraph metadata, or promotion fields.

## Generator Route

Preferred route: `move_current_GEN_A20_behavior_to_GEN_A95_and_block_GEN_A20_until_narrowed_generator_exists`

- Copy the current GEN.A20 function body to GEN.A95 so given MO and given MK-function solving remains available under A95.
- Remove or disable GEN.A20 so narrowed A20 is generator-blocked/non-interactive until a derive-both generator is implemented.
- Do not add GEN.A94 in this packet unless a later reviewer explicitly approves implementation; A94 may be minted as generator-blocked/not-yet-interactive.
- Refresh skill-tree generator readiness after execution and prove no missing/stale generator leaks into interactive exports.

Expected generator status after later execution:

| Unit | Expected status | Reason |
|---|---|---|
| `A20` | `generator_blocked_not_yet_interactive_until_narrowed_GEN_A20_exists` | The existing GEN.A20 behavior does not match the narrowed derived-MO plus derived-MK A20 route. |
| `A94` | `generator_blocked_not_yet_interactive_unless_GEN_A94_is_separately_implemented` | The A94 price-taker plus derived-MK route has no current generator implementation. |
| `A95` | `interactive_only_if_current_GEN_A20_behavior_is_moved_to_GEN_A95` | Current GEN.A20 gives MO and MK functions directly, matching A95 better than narrowed A20. |

## Rollback Route

- Before execution, capture git status and exact pre-execution commit.
- If a command fails before commit, restore only the affected CLI-generated and authored/generator diffs from the pre-execution commit.
- If A20 update is rejected, rerun unit-update with the previous A20 JSON patch or revert the execution commit.
- If A94 or A95 is rejected after minting, use a later reviewed unit-deprecate or revert lane rather than hand-editing references/machine.
- Restore target-exercise arrays to the recorded before values for 3.2.2 and 4.1.2.
- Restore the previous GEN.A20 body and remove GEN.A95 if the generator move is rejected before commit.
- Never hand-edit references/machine or references/external as rollback.

## Validation Required

- `node build-scripts/references/check-mtu-h2i-a20-cli-execution-packet.js`
- `node build-scripts/references/check-mtu-h2h-a20-cli-mutation-plan.js`
- `node build-scripts/references/build-unit-index.js`
- `node build-scripts/references/validate-core-schemas.js`
- `node scripts/check-course-target-exercises-v5.js`
- `node build-scripts/references/build-skilltree-generator-readiness.js after generator changes or new generator-blocked units`
- `node build-scripts/references/check-skilltree-generator-readiness.js after generator-readiness rebuild`
- `node build-scripts/references/build-owned-content-graph.js after authorized mapping mutation if projection refresh is included`
- `node build-scripts/rag/build-chunks.js after authorized mapping mutation if RAG refresh is included`
- `node build-scripts/reports/validate-report-json.js`
- `npm.cmd test -- --runInBand`
- `git diff --check`

## Projection Guardrails

references/authored/course-target-exercises.json is authored source; owned-content graph, RAG chunks, PV/procedure reports, and generator-readiness reports are generated projections.

- `references/data/owned-content-graph.json`
- `references/data/rag/chunk_index.jsonl`
- `reports/json/blueprint-flag-triage.json`
- `reports/json/procedure-visual-inventory.json`
- `reports/markdown/procedure-visual-inventory.md`
- `reports/json/skilltree-generator-readiness.json`
- `reports/markdown/skilltree-generator-readiness.md`

No PV projection or PV machine promotion is authorized.

## Recommended Next Action

Commit and push this packet and cited evidence, then run `GATE-MTU-H2I-a20-cli-execution` before any execution.
