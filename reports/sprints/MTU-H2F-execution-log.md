# Sprint MTU-H2F: Execution Log

Generated: 2026-05-28

Status: passed

Reviewed remote commit: `52ffc484b270182964283e20cd696aca6ce5f9e6`

## Preflight

- closure: passed
  - reports/review-gates/GATE-MTU-H2E-conditional-lane-execution/gate-closure.json
- reviewed_packet_match: passed
  - reports/mtu-hardening/solo-q1-q3-conditional-lane-execution-packet.json
- git_status: passed
  - ?? knowledge/exit-ticket-game-1.1.1.zip
- id_presence_absence: passed
  - A12/A20 present; A88/A89/A90/A92/A93 absent
- a20_absent_from_commands: passed
- extracted_specs_logged: passed
- post_execution_catalog_shape: passed
  - A12/A88/A89/A90/A92/A93 present and A12 retains A2.11

## Extracted Specs

### A12

```json
{
  "name": "MO bepalen met afgeleide",
  "kern": "Bepaal marginale opbrengst door eerst TO op te stellen en daarvan de afgeleide naar Q te nemen.",
  "needs": [
    "A11",
    "A07"
  ],
  "exam_codes": [
    "A2.11",
    "A2.10",
    "A2.12"
  ],
  "mastery_target": "apply",
  "prior_learning": "new_this_year",
  "aspects": [
    "grafisch",
    "rekenen"
  ],
  "terms": [],
  "procedure": [
    "Stel de TO-functie op via TO = P x Q.",
    "Bepaal MO als afgeleide van TO naar Q.",
    "Controleer het type: bij volkomen concurrentie is MO = P; bij een lineaire monopolieprijsfunctie P = a - bQ is MO = a - 2bQ.",
    "Gebruik deze MO-functie later in de passende MO = MK-route."
  ],
  "pitfalls": [
    "Deze afgeleide route gebruiken als een niet-calculus MO-route genoeg is.",
    "De MO-functie later als prijsfunctie gebruiken."
  ],
  "generator": "GEN_A12"
}
```

### A88

```json
{
  "id": "A88",
  "name": "Schaalfactoren in examencijfers toepassen",
  "kern": "Gebruik schaalvermeldingen zoals x 1.000 correct in formules, tabellen, grafieklabels en eindantwoorden.",
  "needs": [],
  "exam_codes": [
    "A2.1",
    "A2.4"
  ],
  "mastery_target": "apply",
  "prior_learning": "new_this_year",
  "aspects": [
    "rekenen",
    "verbaal",
    "grafisch"
  ],
  "terms": [],
  "zero_needs_status": "true_zero",
  "zero_needs_review": {
    "reviewed_on": "2026-05-28",
    "reviewer": "MTU-H2D resolution packet",
    "rationale": "Scale labels can appear in formulas, tables, graphs, and final answer units; requiring A61 would over-trigger table-value selection.",
    "recommended_needs": [],
    "severity": "medium"
  },
  "procedure": [
    "Zoek of waarden een schaalvermelding hebben, zoals x 1.000 of mln.",
    "Noteer of je rekent in weergegeven eenheden of werkelijke eenheden.",
    "Pas de schaalfactor consequent toe in formules en tussenstappen.",
    "Geef het eindantwoord met de juiste eenheid en eventuele vermenigvuldigingsfactor."
  ],
  "pitfalls": [
    "Een waarde in duizenden als losse eenheden behandelen.",
    "Tijdens de berekening van schaal wisselen zonder dat te noteren."
  ],
  "generator": "GEN_A88"
}
```

### A89

```json
{
  "id": "A89",
  "name": "GO herkennen als prijsfunctie van de monopolist",
  "kern": "Herken dat de GO- of vraagfunctie bij een monopolist de prijsfunctie P(Q) geeft die later met Q* moet worden gebruikt.",
  "needs": [],
  "exam_codes": [
    "A2.10"
  ],
  "mastery_target": "understand",
  "prior_learning": "new_this_year",
  "aspects": [
    "verbaal",
    "rekenen"
  ],
  "terms": [],
  "zero_needs_status": "true_zero",
  "zero_needs_review": {
    "reviewed_on": "2026-05-28",
    "reviewer": "MTU-H2D resolution packet",
    "rationale": "Recognition that GO is the monopoly price relation should not force substitution; substitution is handled by A92.",
    "recommended_needs": [],
    "severity": "medium"
  },
  "procedure": [
    "Zoek in de opgave de GO-, vraag-, of prijsfunctie.",
    "Benoem dat deze functie de prijs P bij hoeveelheid Q geeft.",
    "Houd MO apart: MO bepaalt de winstmaximaliserende hoeveelheid, niet de verkoopprijs."
  ],
  "pitfalls": [
    "MO gebruiken als prijsfunctie.",
    "Een herkenningsstap behandelen alsof al een berekening met Q* nodig is."
  ],
  "generator": "GEN_A89"
}
```

### A90

```json
{
  "id": "A90",
  "name": "MO bepalen uit lineaire GO-regel zonder afgeleiden",
  "kern": "Bepaal bij een lineaire monopolistische prijsfunctie de MO-regel zonder de afgeleide route verplicht te maken.",
  "needs": [
    "A89"
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
  "terms": [],
  "procedure": [
    "Herken de lineaire prijsfunctie P = a - bQ.",
    "Gebruik de lineaire MO-regel: MO = a - 2bQ.",
    "Controleer dat deze MO-regel alleen de hoeveelheidstap ondersteunt.",
    "Gebruik later de GO- of prijsfunctie om de verkoopprijs te bepalen."
  ],
  "pitfalls": [
    "De afgeleide route verplicht maken voordat die route nodig is.",
    "De GO-functie zelf als MO gebruiken.",
    "De MO-uitkomst als verkoopprijs behandelen."
  ],
  "generator": "GEN_A90"
}
```

### A92

```json
{
  "id": "A92",
  "name": "Nieuwe prijs bepalen na winstmaximaliserende Q",
  "kern": "Bepaal na Q* de prijs door Q* in de GO- of prijsfunctie P(Q) in te vullen.",
  "needs": [
    "A04",
    "A89"
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
  "terms": [],
  "procedure": [
    "Neem de gevonden winstmaximaliserende hoeveelheid Q*.",
    "Zoek de GO- of prijsfunctie P(Q), niet de MO-functie.",
    "Vul Q* in de prijsfunctie in.",
    "Bereken de prijs en controleer de eenheid."
  ],
  "pitfalls": [
    "Q* in MO invullen en die uitkomst als prijs gebruiken.",
    "De oude prijs gebruiken nadat de kosten of MK zijn veranderd."
  ],
  "generator": "GEN_A92"
}
```

### A93

```json
{
  "id": "A93",
  "name": "Procentuele prijsverandering na kostenverandering",
  "kern": "Bereken de procentuele verandering van de prijs na een kostenverandering met de oude prijs als noemer en onderscheid dit van pass-through.",
  "needs": [
    "A38",
    "A92"
  ],
  "exam_codes": [
    "A2.4",
    "A2.10",
    "A2.12"
  ],
  "mastery_target": "apply",
  "prior_learning": "new_this_year",
  "aspects": [
    "rekenen",
    "verbaal"
  ],
  "terms": [],
  "procedure": [
    "Bepaal de oude prijs en nieuwe prijs.",
    "Bereken de prijsverandering: nieuwe prijs min oude prijs.",
    "Deel door de oude prijs en vermenigvuldig met 100 procent.",
    "Controleer dat je de prijsverandering berekent, niet het doorberekende deel van de kostenstijging."
  ],
  "pitfalls": [
    "De kostenstijging als noemer gebruiken in plaats van de oude prijs.",
    "Procentuele prijsverandering verwarren met incidence of pass-through share.",
    "De procentuele prijsstijging is niet hetzelfde als het percentage van de kostenstijging dat wordt doorberekend.",
    "De nieuwe prijs als basiswaarde gebruiken."
  ],
  "generator": "GEN_A93"
}
```

## Command Log

### A12

Command: `C:\Program Files\nodejs\node.exe build-scripts\references\unit-update.js --id A12 --spec {"name":"MO bepalen met afgeleide","kern":"Bepaal marginale opbrengst door eerst TO op te stellen en daarvan de afgeleide naar Q te nemen.","needs":["A11","A07"],"exam_codes":["A2.11","A2.10","A2.12"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["grafisch","rekenen"],"terms":[],"procedure":["Stel de TO-functie op via TO = P x Q.","Bepaal MO als afgeleide van TO naar Q.","Controleer het type: bij volkomen concurrentie is MO = P; bij een lineaire monopolieprijsfunctie P = a - bQ is MO = a - 2bQ.","Gebruik deze MO-functie later in de passende MO = MK-route."],"pitfalls":["Deze afgeleide route gebruiken als een niet-calculus MO-route genoeg is.","De MO-functie later als prijsfunctie gebruiken."],"generator":"GEN_A12"} --dry-run`

Exit status: 0

Stdout:
```text
DRY RUN  would update A12: name, kern, needs, exam_codes, mastery_target, prior_learning, aspects, terms, procedure, pitfalls, generator
```

### A12

Command: `C:\Program Files\nodejs\node.exe build-scripts\references\unit-update.js --id A12 --spec {"name":"MO bepalen met afgeleide","kern":"Bepaal marginale opbrengst door eerst TO op te stellen en daarvan de afgeleide naar Q te nemen.","needs":["A11","A07"],"exam_codes":["A2.11","A2.10","A2.12"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["grafisch","rekenen"],"terms":[],"procedure":["Stel de TO-functie op via TO = P x Q.","Bepaal MO als afgeleide van TO naar Q.","Controleer het type: bij volkomen concurrentie is MO = P; bij een lineaire monopolieprijsfunctie P = a - bQ is MO = a - 2bQ.","Gebruik deze MO-functie later in de passende MO = MK-route."],"pitfalls":["Deze afgeleide route gebruiken als een niet-calculus MO-route genoeg is.","De MO-functie later als prijsfunctie gebruiken."],"generator":"GEN_A12"}`

Exit status: 0

Stdout:
```text
OK  updated A12: name, kern, needs, exam_codes, mastery_target, prior_learning, aspects, terms, procedure, pitfalls, generator
```

### A88

Command: `C:\Program Files\nodejs\node.exe build-scripts\references\unit-add.js --spec {"id":"A88","name":"Schaalfactoren in examencijfers toepassen","kern":"Gebruik schaalvermeldingen zoals x 1.000 correct in formules, tabellen, grafieklabels en eindantwoorden.","needs":[],"exam_codes":["A2.1","A2.4"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal","grafisch"],"terms":[],"zero_needs_status":"true_zero","zero_needs_review":{"reviewed_on":"2026-05-28","reviewer":"MTU-H2D resolution packet","rationale":"Scale labels can appear in formulas, tables, graphs, and final answer units; requiring A61 would over-trigger table-value selection.","recommended_needs":[],"severity":"medium"},"procedure":["Zoek of waarden een schaalvermelding hebben, zoals x 1.000 of mln.","Noteer of je rekent in weergegeven eenheden of werkelijke eenheden.","Pas de schaalfactor consequent toe in formules en tussenstappen.","Geef het eindantwoord met de juiste eenheid en eventuele vermenigvuldigingsfactor."],"pitfalls":["Een waarde in duizenden als losse eenheden behandelen.","Tijdens de berekening van schaal wisselen zonder dat te noteren."],"generator":"GEN_A88"}`

Exit status: 0

Stdout:
```text
OK  minted A88 "Schaalfactoren in examencijfers toepassen" (catalog now 239 units)
```

Stderr:
```text
(node:43936) Warning: Accessing non-existent property 'formatEntry' of module exports inside circular dependency
(Use `node --trace-warnings ...` to show where the warning was created)
```

### A89

Command: `C:\Program Files\nodejs\node.exe build-scripts\references\unit-add.js --spec {"id":"A89","name":"GO herkennen als prijsfunctie van de monopolist","kern":"Herken dat de GO- of vraagfunctie bij een monopolist de prijsfunctie P(Q) geeft die later met Q* moet worden gebruikt.","needs":[],"exam_codes":["A2.10"],"mastery_target":"understand","prior_learning":"new_this_year","aspects":["verbaal","rekenen"],"terms":[],"zero_needs_status":"true_zero","zero_needs_review":{"reviewed_on":"2026-05-28","reviewer":"MTU-H2D resolution packet","rationale":"Recognition that GO is the monopoly price relation should not force substitution; substitution is handled by A92.","recommended_needs":[],"severity":"medium"},"procedure":["Zoek in de opgave de GO-, vraag-, of prijsfunctie.","Benoem dat deze functie de prijs P bij hoeveelheid Q geeft.","Houd MO apart: MO bepaalt de winstmaximaliserende hoeveelheid, niet de verkoopprijs."],"pitfalls":["MO gebruiken als prijsfunctie.","Een herkenningsstap behandelen alsof al een berekening met Q* nodig is."],"generator":"GEN_A89"}`

Exit status: 0

Stdout:
```text
OK  minted A89 "GO herkennen als prijsfunctie van de monopolist" (catalog now 240 units)
```

Stderr:
```text
(node:6104) Warning: Accessing non-existent property 'formatEntry' of module exports inside circular dependency
(Use `node --trace-warnings ...` to show where the warning was created)
```

### A90

Command: `C:\Program Files\nodejs\node.exe build-scripts\references\unit-add.js --spec {"id":"A90","name":"MO bepalen uit lineaire GO-regel zonder afgeleiden","kern":"Bepaal bij een lineaire monopolistische prijsfunctie de MO-regel zonder de afgeleide route verplicht te maken.","needs":["A89"],"exam_codes":["A2.10","A2.12"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal"],"terms":[],"procedure":["Herken de lineaire prijsfunctie P = a - bQ.","Gebruik de lineaire MO-regel: MO = a - 2bQ.","Controleer dat deze MO-regel alleen de hoeveelheidstap ondersteunt.","Gebruik later de GO- of prijsfunctie om de verkoopprijs te bepalen."],"pitfalls":["De afgeleide route verplicht maken voordat die route nodig is.","De GO-functie zelf als MO gebruiken.","De MO-uitkomst als verkoopprijs behandelen."],"generator":"GEN_A90"}`

Exit status: 0

Stdout:
```text
OK  minted A90 "MO bepalen uit lineaire GO-regel zonder afgeleiden" (catalog now 241 units)
```

Stderr:
```text
(node:47636) Warning: Accessing non-existent property 'formatEntry' of module exports inside circular dependency
(Use `node --trace-warnings ...` to show where the warning was created)
```

### A92

Command: `C:\Program Files\nodejs\node.exe build-scripts\references\unit-add.js --spec {"id":"A92","name":"Nieuwe prijs bepalen na winstmaximaliserende Q","kern":"Bepaal na Q* de prijs door Q* in de GO- of prijsfunctie P(Q) in te vullen.","needs":["A04","A89"],"exam_codes":["A2.10","A2.12"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal"],"terms":[],"procedure":["Neem de gevonden winstmaximaliserende hoeveelheid Q*.","Zoek de GO- of prijsfunctie P(Q), niet de MO-functie.","Vul Q* in de prijsfunctie in.","Bereken de prijs en controleer de eenheid."],"pitfalls":["Q* in MO invullen en die uitkomst als prijs gebruiken.","De oude prijs gebruiken nadat de kosten of MK zijn veranderd."],"generator":"GEN_A92"}`

Exit status: 0

Stdout:
```text
OK  minted A92 "Nieuwe prijs bepalen na winstmaximaliserende Q" (catalog now 242 units)
```

Stderr:
```text
(node:44868) Warning: Accessing non-existent property 'formatEntry' of module exports inside circular dependency
(Use `node --trace-warnings ...` to show where the warning was created)
```

### A93

Command: `C:\Program Files\nodejs\node.exe build-scripts\references\unit-add.js --spec {"id":"A93","name":"Procentuele prijsverandering na kostenverandering","kern":"Bereken de procentuele verandering van de prijs na een kostenverandering met de oude prijs als noemer en onderscheid dit van pass-through.","needs":["A38","A92"],"exam_codes":["A2.4","A2.10","A2.12"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal"],"terms":[],"procedure":["Bepaal de oude prijs en nieuwe prijs.","Bereken de prijsverandering: nieuwe prijs min oude prijs.","Deel door de oude prijs en vermenigvuldig met 100 procent.","Controleer dat je de prijsverandering berekent, niet het doorberekende deel van de kostenstijging."],"pitfalls":["De kostenstijging als noemer gebruiken in plaats van de oude prijs.","Procentuele prijsverandering verwarren met incidence of pass-through share.","De procentuele prijsstijging is niet hetzelfde als het percentage van de kostenstijging dat wordt doorberekend.","De nieuwe prijs als basiswaarde gebruiken."],"generator":"GEN_A93"}`

Exit status: 0

Stdout:
```text
OK  minted A93 "Procentuele prijsverandering na kostenverandering" (catalog now 243 units)
```

Stderr:
```text
(node:6668) Warning: Accessing non-existent property 'formatEntry' of module exports inside circular dependency
(Use `node --trace-warnings ...` to show where the warning was created)
```

