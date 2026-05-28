# Sprint MTU-H2J: Execution Log

Generated: 2026-05-28

Status: passed

Reviewed remote commit: `1fb0b95fc6b031f37ff780fb3db063dd9deb7d25`

## Preflight

- closure: passed
  - reports/review-gates/GATE-MTU-H2I-a20-cli-execution/gate-closure.json
- reviewed_packet_match: passed
  - reports/mtu-hardening/solo-q1-q3-a20-cli-execution-packet.json
- git_status: passed
  - ?? knowledge/exit-ticket-game-1.1.1.zip
- unit_id_presence_absence: passed
  - A20/A91/A12/A13/A02 present; A94/A95 absent
- generator_presence_absence: passed
  - GEN.A20 present; GEN.A94/GEN.A95 absent
- extracted_specs_logged: passed
- post_execution_shape: passed
  - A20/A94/A95 catalog shape, mapping patch, and generator route applied

## Extracted Unit Specs

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

## Mapping Patches

### 3.2.2

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

### 4.1.2

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

### 3.3.3

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

## Generator Patch Summary

```json
{
  "source": "engines/skilltree/generators.js",
  "route": "move_current_GEN_A20_behavior_to_GEN_A95_and_block_GEN_A20",
  "removed_or_disabled": [
    "GEN.A20"
  ],
  "added_or_moved": [
    "GEN.A95"
  ],
  "intentionally_absent": [
    "GEN.A94"
  ],
  "note": "GEN.A95 receives the current GEN.A20 given-MO/given-MK-function body. GEN.A20 is absent so narrowed A20 is generator-blocked until a matching derive-both generator exists."
}
```

## Command Log

### A20

Command: `C:\Program Files\nodejs\node.exe build-scripts\references\unit-update.js --id A20 --spec {"name":"Winstmaximum oplossen met afgeleide MO en MK","kern":"Los de winstmaximaliserende hoeveelheid op nadat MO uit TO en MK uit TK zijn afgeleid.","needs":["A12","A13","A02"],"exam_codes":["A2.10","A2.11","A2.12"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal"],"terms":["marginale-kosten"],"procedure":["Bepaal MO via de afgeleide route uit TO.","Bepaal MK via de afgeleide route uit TK.","Stel MO = MK.","Los op naar Q*.","Gebruik Q* daarna in de passende prijs-, opbrengst- of winstroute."],"pitfalls":["Deze route gebruiken wanneer MK al als constante of functie is gegeven.","Deze route gebruiken wanneer MO bij volkomen concurrentie direct gelijk is aan P.","De MO- of MK-uitkomst als verkoopprijs behandelen."],"generator":"GEN_A20"} --dry-run`

Exit status: 0

Stdout:
```text
DRY RUN  would update A20: name, kern, needs, exam_codes, mastery_target, prior_learning, aspects, terms, procedure, pitfalls, generator
```

### A20

Command: `C:\Program Files\nodejs\node.exe build-scripts\references\unit-update.js --id A20 --spec {"name":"Winstmaximum oplossen met afgeleide MO en MK","kern":"Los de winstmaximaliserende hoeveelheid op nadat MO uit TO en MK uit TK zijn afgeleid.","needs":["A12","A13","A02"],"exam_codes":["A2.10","A2.11","A2.12"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal"],"terms":["marginale-kosten"],"procedure":["Bepaal MO via de afgeleide route uit TO.","Bepaal MK via de afgeleide route uit TK.","Stel MO = MK.","Los op naar Q*.","Gebruik Q* daarna in de passende prijs-, opbrengst- of winstroute."],"pitfalls":["Deze route gebruiken wanneer MK al als constante of functie is gegeven.","Deze route gebruiken wanneer MO bij volkomen concurrentie direct gelijk is aan P.","De MO- of MK-uitkomst als verkoopprijs behandelen."],"generator":"GEN_A20"}`

Exit status: 0

Stdout:
```text
OK  updated A20: name, kern, needs, exam_codes, mastery_target, prior_learning, aspects, terms, procedure, pitfalls, generator
```

### A94

Command: `C:\Program Files\nodejs\node.exe build-scripts\references\unit-add.js --spec {"id":"A94","name":"MO = P en afgeleide MK oplossen","kern":"Los de winstmaximaliserende hoeveelheid op wanneer MO bij een prijsnemer gelijk is aan P en MK eerst uit TK moet worden afgeleid.","needs":["A13","A02"],"exam_codes":["A2.10","A2.11","A2.12"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal"],"terms":["marginale-kosten"],"procedure":["Herken dat de aanbieder een prijsnemer is bij volkomen concurrentie.","Gebruik de regel: bij een prijsnemer geldt MO = marktprijs P.","Bepaal MK als afgeleide van TK.","Stel P = MK.","Los op naar Q*."],"pitfalls":["A12 verplicht maken terwijl MO bij de prijsnemer direct gelijk is aan P.","MK overslaan terwijl TK moet worden gedifferentieerd.","De gevonden Q* verwarren met prijs of winst."],"generator":"GEN_A94"}`

Exit status: 0

Stdout:
```text
OK  minted A94 "MO = P en afgeleide MK oplossen" (catalog now 244 units)
```

Stderr:
```text
(node:42308) Warning: Accessing non-existent property 'formatEntry' of module exports inside circular dependency
(Use `node --trace-warnings ...` to show where the warning was created)
```

### A95

Command: `C:\Program Files\nodejs\node.exe build-scripts\references\unit-add.js --spec {"id":"A95","name":"MO = gegeven MK-functie oplossen","kern":"Los MO = MK op wanneer de MK-functie in de opgave staat en niet uit TK hoeft te worden afgeleid.","needs":["A02"],"exam_codes":["A2.10","A2.12"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal"],"terms":["marginale-kosten"],"procedure":["Neem de beschikbare MO-functie uit de voorafgaande stap of uit de opgave.","Neem de gegeven MK-functie uit de opgave.","Stel MO = MK.","Los de vergelijking op naar Q*.","Controleer dat je geen MK-functie afleidt als MK al gegeven is."],"pitfalls":["De gegeven MK-functie opnieuw afleiden.","A91 gebruiken terwijl MK geen constante maar een functie is.","De gevonden Q* als prijs behandelen."],"generator":"GEN_A95"}`

Exit status: 0

Stdout:
```text
OK  minted A95 "MO = gegeven MK-functie oplossen" (catalog now 245 units)
```

Stderr:
```text
(node:12564) Warning: Accessing non-existent property 'formatEntry' of module exports inside circular dependency
(Use `node --trace-warnings ...` to show where the warning was created)
```

## File Writes

- references/authored/course-target-exercises.json: applied reviewed array-only mapping patches for 3.2.2 and 4.1.2; verified 3.3.3 unchanged
- engines/skilltree/generators.js: moved current GEN.A20 body to GEN.A95 and left GEN.A20/GEN.A94 without implementations

