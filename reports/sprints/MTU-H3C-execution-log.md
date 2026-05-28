# Sprint MTU-H3C: Execution Log

Generated: 2026-05-28

Status: passed

Reviewed remote commit: `ad7d69c3836176a10111384aeb640d49e93b705d`

## Preflight

- closure: passed
  - reports/review-gates/GATE-MTU-H3B-incidence-cli-execution/gate-closure.json
- reviewed_packet_match: passed
  - reports/mtu-hardening/mtu-h3b-incidence-cli-execution-packet.json
- git_status: passed
  - ?? knowledge/exit-ticket-game-1.1.1.zip
- unit_id_presence_absence: passed
  - D07/D05/A38/A41/A93/A15 present; D41/D42/D43/D44/D45/D46 absent

## Extracted Unit Specs

### D41

```json
{
  "id": "D41",
  "name": "Belastingwig en Pc/Pp grafisch labelen",
  "kern": "Label in een P-Q diagram de consumentenprijs Pc, producentenprijs Pp, belastingwig t = Pc - Pp en de verhandelde hoeveelheid Qt na een heffing.",
  "needs": [
    "D05"
  ],
  "exam_codes": [
    "D1.13",
    "D1.24"
  ],
  "mastery_target": "apply",
  "prior_learning": "new_this_year",
  "aspects": [
    "grafisch",
    "verbaal"
  ],
  "terms": [
    "heffingen",
    "evenwichtsprijs"
  ],
  "procedure": [
    "Bepaal of gebruik het nieuwe evenwicht na heffing: consumentenprijs Pc en hoeveelheid Qt.",
    "Bepaal de producentenprijs Pp als Pc - t.",
    "Teken of label bij Qt de verticale afstand tussen Pc en Pp als belastingwig t.",
    "Label Pc, Pp, Qt en de wig zonder welfare-gebieden te arceren.",
    "Controleer dat Pc - Pp gelijk is aan het heffingsbedrag."
  ],
  "pitfalls": [
    "De wig tekenen tussen vraag en aanbod bij de oude hoeveelheid in plaats van bij Qt.",
    "Pp verwarren met de consumentenprijs Pc.",
    "Welfare-gebieden arceren terwijl alleen de wig of prijzen gevraagd worden."
  ]
}
```

### D42

```json
{
  "id": "D42",
  "name": "Belastingdruk in eurobedragen berekenen",
  "kern": "Bereken in euro per eenheid welk deel van een heffing door consument en producent wordt gedragen.",
  "needs": [],
  "exam_codes": [
    "D1.4a"
  ],
  "mastery_target": "apply",
  "prior_learning": "new_this_year",
  "aspects": [
    "rekenen",
    "verbaal"
  ],
  "terms": [
    "heffingen",
    "evenwichtsprijs"
  ],
  "assumed_prior_knowledge": [
    "P0, Pc, Pp en heffing t zijn gegeven, eerder berekend, of apart gemapt via D41/D05 wanneer de context dat vraagt."
  ],
  "zero_needs_status": "true_zero",
  "zero_needs_review": {
    "reviewed_on": "2026-05-28",
    "reviewer": "GATE-MTU-H3B",
    "rationale": "D42 is an economics-specific root operation from available P0/Pc/Pp/t values. It must not force graphical D41; graph contexts map D41 separately and calculation contexts can supply prices directly.",
    "recommended_needs": [],
    "severity": "medium",
    "h3c_execution_decision": "fixed from underbouw_assumed to true_zero per GATE-MTU-H3B condition"
  },
  "procedure": [
    "Neem de oude evenwichtsprijs P0, de consumentenprijs Pc en de producentenprijs Pp na heffing.",
    "Bereken consumentendruk = Pc - P0.",
    "Bereken producentendruk = P0 - Pp.",
    "Controleer dat consumentendruk + producentendruk gelijk is aan de heffing t.",
    "Benoem de bedragen per eenheid en rond af zoals de vraag vraagt."
  ],
  "pitfalls": [
    "Meteen percentages berekenen voordat de euro-bedragen duidelijk zijn.",
    "Pc en Pp omwisselen.",
    "Belastingopbrengst t x Q verwarren met belastingdruk per eenheid."
  ]
}
```

### D43

```json
{
  "id": "D43",
  "name": "Subsidie-evenwicht en effectieve prijzen bepalen",
  "kern": "Bepaal na een subsidie de consumentenprijs Pc, de effectieve producentenontvangst Pp en de nieuwe hoeveelheid.",
  "needs": [
    "A41"
  ],
  "exam_codes": [
    "A2.15",
    "D3.5"
  ],
  "mastery_target": "apply",
  "prior_learning": "new_this_year",
  "aspects": [
    "rekenen",
    "verbaal"
  ],
  "terms": [
    "subsidies",
    "evenwichtsprijs"
  ],
  "procedure": [
    "Leid met A41 de aanbodfunctie na subsidie af of gebruik de gegeven na-subsidie aanbodlijn.",
    "Los het nieuwe evenwicht op en bepaal consumentenprijs Pc en hoeveelheid Qs.",
    "Bereken de producentenontvangst Pp als Pc + subsidie s.",
    "Controleer dat Pp - Pc gelijk is aan het subsidiebedrag.",
    "Benoem Pc, Pp en Qs expliciet."
  ],
  "pitfalls": [
    "De subsidie optellen bij de consumentenprijs in plaats van bij de producentenontvangst.",
    "De aanbodlijn in de verkeerde richting verschuiven.",
    "Subsidiekosten of surplus berekenen terwijl alleen effectieve prijzen gevraagd zijn."
  ]
}
```

### D45

```json
{
  "id": "D45",
  "name": "Incidentie verklaren met relatieve elasticiteiten",
  "kern": "Leg uit dat de relatief minder elastische kant van de markt meer belastingdruk draagt of meer subsidievoordeel ontvangt.",
  "needs": [
    "A15"
  ],
  "exam_codes": [
    "D1.4a",
    "D3.5"
  ],
  "mastery_target": "understand",
  "prior_learning": "new_this_year",
  "aspects": [
    "verbaal",
    "grafisch"
  ],
  "terms": [
    "heffingen",
    "subsidies",
    "prijselasticiteit-van-de-vraag"
  ],
  "assumed_prior_knowledge": [
    "Aanbodelasticiteit wordt kwalitatief binnen deze unit behandeld via helling of context; er is geen aparte numerieke aanbodelasticiteitsberekening nodig."
  ],
  "procedure": [
    "Bepaal uit context of grafiek welke kant relatief minder elastisch reageert: vraag of aanbod.",
    "Gebruik A15 voor vraagelasticiteit en benoem aanbodelasticiteit kwalitatief via helling of context wanneer geen aanbodelasticiteitsunit beschikbaar is.",
    "Leg bij een heffing uit dat de relatief minder elastische kant meer belastingdruk draagt.",
    "Leg bij een subsidie uit dat de relatief minder elastische kant relatief meer voordeel ontvangt.",
    "Koppel de uitleg aan de berekende of getekende Pc/Pp-verdeling."
  ],
  "pitfalls": [
    "Alleen vraagelasticiteit noemen terwijl aanbodelasticiteit ook bepalend is.",
    "Steile lijn automatisch verwarren met inelastisch zonder op asdefinitie en context te letten.",
    "Een percentageberekening geven terwijl de vraag om een verklaring vraagt."
  ]
}
```

### D46

```json
{
  "id": "D46",
  "name": "Kostenstijging doorberekenen als pass-through share",
  "kern": "Bereken welk percentage van een kostenstijging in de prijs wordt doorberekend en houd dit gescheiden van de procentuele prijsverandering in A93.",
  "needs": [
    "A93"
  ],
  "exam_codes": [
    "A2.4",
    "A2.10"
  ],
  "mastery_target": "apply",
  "prior_learning": "new_this_year",
  "aspects": [
    "rekenen",
    "verbaal"
  ],
  "terms": [],
  "procedure": [
    "Bepaal de oude prijs en nieuwe prijs zoals in A93.",
    "Bereken de prijsstijging in euro: nieuwe prijs - oude prijs.",
    "Bepaal de kostenstijging per eenheid die als schok wordt gegeven.",
    "Bereken pass-through share = prijsstijging / kostenstijging x 100 procent.",
    "Controleer dat de noemer de kostenstijging is, niet de oude prijs."
  ],
  "pitfalls": [
    "De oude prijs als noemer gebruiken; dat is A93 prijspercentage, geen pass-through share.",
    "De volledige kostenstijging als doorberekend aannemen zonder de prijsverandering te berekenen.",
    "Pass-through share verwarren met tax incidence zonder belastingwig of Pc/Pp."
  ]
}
```

### D07

```json
{
  "name": "Heffing afwentelingspercentage berekenen",
  "kern": "Bereken welk percentage van een heffing bij consumenten en producenten terechtkomt nadat de euro-bedragen van de belastingdruk bekend zijn.",
  "needs": [
    "D42",
    "A38"
  ],
  "exam_codes": [
    "D1.4a"
  ],
  "mastery_target": "apply",
  "prior_learning": "new_this_year",
  "aspects": [
    "rekenen",
    "verbaal"
  ],
  "terms": [
    "heffingen"
  ],
  "procedure": [
    "Gebruik de belastingdruk in euros: consumentenbedrag = Pc - P0 en producentenbedrag = P0 - Pp.",
    "Deel het consumentenbedrag door de heffing t en vermenigvuldig met 100 procent.",
    "Deel het producentenbedrag door t en vermenigvuldig met 100 procent, of gebruik 100 procent minus consumentenpercentage.",
    "Controleer dat beide percentages samen 100 procent zijn.",
    "Rond af zoals de vraag vraagt en benoem wie welk percentage draagt."
  ],
  "pitfalls": [
    "De prijsverandering delen door de nieuwe prijs in plaats van door de heffing.",
    "Alleen het consumentenpercentage geven wanneer de vraag beide partijen vraagt.",
    "Elasticiteit uitleggen terwijl de vraag alleen om percentageberekening vraagt."
  ]
}
```

## Mapping Patches

### 3.1.1

```json
{
  "before": {
    "required_skills": [
      "A06",
      "A23",
      "A41",
      "D05",
      "D07"
    ],
    "prior_knowledge_assumed": [
      "A06"
    ],
    "new_skills_introduced": [
      "A23",
      "A41",
      "D05",
      "D07"
    ],
    "missing_units_flagged": [
      "Distinguish consumer price Pc vs producer price Pp and the tax wedge = Pc − Pp (concept-level + grafisch)"
    ]
  },
  "after": {
    "required_skills": [
      "A06",
      "A23",
      "A41",
      "D05",
      "D41"
    ],
    "prior_knowledge_assumed": [
      "A06"
    ],
    "new_skills_introduced": [
      "A23",
      "A41",
      "D05",
      "D41"
    ],
    "missing_units_flagged": []
  }
}
```

### 3.1.2

```json
{
  "before": {
    "required_skills": [
      "A10",
      "A19",
      "A23",
      "A32",
      "A40",
      "D03",
      "D07"
    ],
    "prior_knowledge_assumed": [
      "A10",
      "A19",
      "A23",
      "A40",
      "D07"
    ],
    "new_skills_introduced": [
      "A32",
      "D03"
    ],
    "missing_units_flagged": [
      "Compute afwentelingspercentage = (Pc − P*) / tax × 100 and interpret it (A-domain candidate; the consumer-burden metric)",
      "Apply the surplus-accounting identity: old TS = new CS + new PS + tax revenue + DWL (concept-level, completeness check)"
    ]
  },
  "after": {
    "required_skills": [
      "A10",
      "A19",
      "A23",
      "A32",
      "A40",
      "D03",
      "D41",
      "D42",
      "D07"
    ],
    "prior_knowledge_assumed": [
      "A10",
      "A19",
      "A23",
      "A40",
      "D41"
    ],
    "new_skills_introduced": [
      "A32",
      "D03",
      "D42",
      "D07"
    ],
    "missing_units_flagged": [
      "Apply the surplus-accounting identity: old TS = new CS + new PS + tax revenue + DWL (concept-level, completeness check)"
    ]
  }
}
```

### 3.1.3

```json
{
  "before": {
    "required_skills": [
      "A06",
      "A10",
      "A19",
      "A27",
      "A41",
      "D19",
      "D29"
    ],
    "prior_knowledge_assumed": [
      "A06",
      "A10",
      "A19",
      "A41"
    ],
    "new_skills_introduced": [
      "A27",
      "D19",
      "D29"
    ],
    "missing_units_flagged": [
      "Explain that subsidies cause DWL via overproduction beyond the Pareto-efficient quantity (concept-level, counterintuitive to students)",
      "Compute government subsidy expenditure = subsidy × Q_new (reken skill, A-domain candidate)"
    ]
  },
  "after": {
    "required_skills": [
      "A06",
      "A10",
      "A19",
      "A27",
      "A41",
      "D19",
      "D29",
      "D43"
    ],
    "prior_knowledge_assumed": [
      "A06",
      "A10",
      "A19",
      "A41"
    ],
    "new_skills_introduced": [
      "A27",
      "D19",
      "D29",
      "D43"
    ],
    "missing_units_flagged": [
      "Explain that subsidies cause DWL via overproduction beyond the Pareto-efficient quantity (concept-level, counterintuitive to students)",
      "Compute government subsidy expenditure = subsidy × Q_new (reken skill, A-domain candidate)"
    ]
  }
}
```

## Command Log

### D41

Command: `C:\Program Files\nodejs\node.exe build-scripts/references/unit-add.js --spec "{\"id\":\"D41\",\"name\":\"Belastingwig en Pc/Pp grafisch labelen\",\"kern\":\"Label in een P-Q diagram de consumentenprijs Pc, producentenprijs Pp, belastingwig t = Pc - Pp en de verhandelde hoeveelheid Qt na een heffing.\",\"needs\":[\"D05\"],\"exam_codes\":[\"D1.13\",\"D1.24\"],\"mastery_target\":\"apply\",\"prior_learning\":\"new_this_year\",\"aspects\":[\"grafisch\",\"verbaal\"],\"terms\":[\"heffingen\",\"evenwichtsprijs\"],\"procedure\":[\"Bepaal of gebruik het nieuwe evenwicht na heffing: consumentenprijs Pc en hoeveelheid Qt.\",\"Bepaal de producentenprijs Pp als Pc - t.\",\"Teken of label bij Qt de verticale afstand tussen Pc en Pp als belastingwig t.\",\"Label Pc, Pp, Qt en de wig zonder welfare-gebieden te arceren.\",\"Controleer dat Pc - Pp gelijk is aan het heffingsbedrag.\"],\"pitfalls\":[\"De wig tekenen tussen vraag en aanbod bij de oude hoeveelheid in plaats van bij Qt.\",\"Pp verwarren met de consumentenprijs Pc.\",\"Welfare-gebieden arceren terwijl alleen de wig of prijzen gevraagd worden.\"]}"`

Exit status: 0

Stdout:
```text
OK  minted D41 "Belastingwig en Pc/Pp grafisch labelen" (catalog now 246 units)
```

Stderr:
```text
(node:37008) Warning: Accessing non-existent property 'formatEntry' of module exports inside circular dependency
(Use `node --trace-warnings ...` to show where the warning was created)
```

### D42

Command: `C:\Program Files\nodejs\node.exe build-scripts/references/unit-add.js --spec "{\"id\":\"D42\",\"name\":\"Belastingdruk in eurobedragen berekenen\",\"kern\":\"Bereken in euro per eenheid welk deel van een heffing door consument en producent wordt gedragen.\",\"needs\":[],\"exam_codes\":[\"D1.4a\"],\"mastery_target\":\"apply\",\"prior_learning\":\"new_this_year\",\"aspects\":[\"rekenen\",\"verbaal\"],\"terms\":[\"heffingen\",\"evenwichtsprijs\"],\"assumed_prior_knowledge\":[\"P0, Pc, Pp en heffing t zijn gegeven, eerder berekend, of apart gemapt via D41/D05 wanneer de context dat vraagt.\"],\"zero_needs_status\":\"true_zero\",\"zero_needs_review\":{\"reviewed_on\":\"2026-05-28\",\"reviewer\":\"GATE-MTU-H3B\",\"rationale\":\"D42 is an economics-specific root operation from available P0/Pc/Pp/t values. It must not force graphical D41; graph contexts map D41 separately and calculation contexts can supply prices directly.\",\"recommended_needs\":[],\"severity\":\"medium\",\"h3c_execution_decision\":\"fixed from underbouw_assumed to true_zero per GATE-MTU-H3B condition\"},\"procedure\":[\"Neem de oude evenwichtsprijs P0, de consumentenprijs Pc en de producentenprijs Pp na heffing.\",\"Bereken consumentendruk = Pc - P0.\",\"Bereken producentendruk = P0 - Pp.\",\"Controleer dat consumentendruk + producentendruk gelijk is aan de heffing t.\",\"Benoem de bedragen per eenheid en rond af zoals de vraag vraagt.\"],\"pitfalls\":[\"Meteen percentages berekenen voordat de euro-bedragen duidelijk zijn.\",\"Pc en Pp omwisselen.\",\"Belastingopbrengst t x Q verwarren met belastingdruk per eenheid.\"]}"`

Exit status: 0

Stdout:
```text
OK  minted D42 "Belastingdruk in eurobedragen berekenen" (catalog now 247 units)
```

Stderr:
```text
(node:25772) Warning: Accessing non-existent property 'formatEntry' of module exports inside circular dependency
(Use `node --trace-warnings ...` to show where the warning was created)
```

### D43

Command: `C:\Program Files\nodejs\node.exe build-scripts/references/unit-add.js --spec "{\"id\":\"D43\",\"name\":\"Subsidie-evenwicht en effectieve prijzen bepalen\",\"kern\":\"Bepaal na een subsidie de consumentenprijs Pc, de effectieve producentenontvangst Pp en de nieuwe hoeveelheid.\",\"needs\":[\"A41\"],\"exam_codes\":[\"A2.15\",\"D3.5\"],\"mastery_target\":\"apply\",\"prior_learning\":\"new_this_year\",\"aspects\":[\"rekenen\",\"verbaal\"],\"terms\":[\"subsidies\",\"evenwichtsprijs\"],\"procedure\":[\"Leid met A41 de aanbodfunctie na subsidie af of gebruik de gegeven na-subsidie aanbodlijn.\",\"Los het nieuwe evenwicht op en bepaal consumentenprijs Pc en hoeveelheid Qs.\",\"Bereken de producentenontvangst Pp als Pc + subsidie s.\",\"Controleer dat Pp - Pc gelijk is aan het subsidiebedrag.\",\"Benoem Pc, Pp en Qs expliciet.\"],\"pitfalls\":[\"De subsidie optellen bij de consumentenprijs in plaats van bij de producentenontvangst.\",\"De aanbodlijn in de verkeerde richting verschuiven.\",\"Subsidiekosten of surplus berekenen terwijl alleen effectieve prijzen gevraagd zijn.\"]}"`

Exit status: 0

Stdout:
```text
OK  minted D43 "Subsidie-evenwicht en effectieve prijzen bepalen" (catalog now 248 units)
```

Stderr:
```text
(node:51372) Warning: Accessing non-existent property 'formatEntry' of module exports inside circular dependency
(Use `node --trace-warnings ...` to show where the warning was created)
```

### D45

Command: `C:\Program Files\nodejs\node.exe build-scripts/references/unit-add.js --spec "{\"id\":\"D45\",\"name\":\"Incidentie verklaren met relatieve elasticiteiten\",\"kern\":\"Leg uit dat de relatief minder elastische kant van de markt meer belastingdruk draagt of meer subsidievoordeel ontvangt.\",\"needs\":[\"A15\"],\"exam_codes\":[\"D1.4a\",\"D3.5\"],\"mastery_target\":\"understand\",\"prior_learning\":\"new_this_year\",\"aspects\":[\"verbaal\",\"grafisch\"],\"terms\":[\"heffingen\",\"subsidies\",\"prijselasticiteit-van-de-vraag\"],\"assumed_prior_knowledge\":[\"Aanbodelasticiteit wordt kwalitatief binnen deze unit behandeld via helling of context; er is geen aparte numerieke aanbodelasticiteitsberekening nodig.\"],\"procedure\":[\"Bepaal uit context of grafiek welke kant relatief minder elastisch reageert: vraag of aanbod.\",\"Gebruik A15 voor vraagelasticiteit en benoem aanbodelasticiteit kwalitatief via helling of context wanneer geen aanbodelasticiteitsunit beschikbaar is.\",\"Leg bij een heffing uit dat de relatief minder elastische kant meer belastingdruk draagt.\",\"Leg bij een subsidie uit dat de relatief minder elastische kant relatief meer voordeel ontvangt.\",\"Koppel de uitleg aan de berekende of getekende Pc/Pp-verdeling.\"],\"pitfalls\":[\"Alleen vraagelasticiteit noemen terwijl aanbodelasticiteit ook bepalend is.\",\"Steile lijn automatisch verwarren met inelastisch zonder op asdefinitie en context te letten.\",\"Een percentageberekening geven terwijl de vraag om een verklaring vraagt.\"]}"`

Exit status: 0

Stdout:
```text
OK  minted D45 "Incidentie verklaren met relatieve elasticiteiten" (catalog now 249 units)
```

Stderr:
```text
(node:50652) Warning: Accessing non-existent property 'formatEntry' of module exports inside circular dependency
(Use `node --trace-warnings ...` to show where the warning was created)
```

### D46

Command: `C:\Program Files\nodejs\node.exe build-scripts/references/unit-add.js --spec "{\"id\":\"D46\",\"name\":\"Kostenstijging doorberekenen als pass-through share\",\"kern\":\"Bereken welk percentage van een kostenstijging in de prijs wordt doorberekend en houd dit gescheiden van de procentuele prijsverandering in A93.\",\"needs\":[\"A93\"],\"exam_codes\":[\"A2.4\",\"A2.10\"],\"mastery_target\":\"apply\",\"prior_learning\":\"new_this_year\",\"aspects\":[\"rekenen\",\"verbaal\"],\"terms\":[],\"procedure\":[\"Bepaal de oude prijs en nieuwe prijs zoals in A93.\",\"Bereken de prijsstijging in euro: nieuwe prijs - oude prijs.\",\"Bepaal de kostenstijging per eenheid die als schok wordt gegeven.\",\"Bereken pass-through share = prijsstijging / kostenstijging x 100 procent.\",\"Controleer dat de noemer de kostenstijging is, niet de oude prijs.\"],\"pitfalls\":[\"De oude prijs als noemer gebruiken; dat is A93 prijspercentage, geen pass-through share.\",\"De volledige kostenstijging als doorberekend aannemen zonder de prijsverandering te berekenen.\",\"Pass-through share verwarren met tax incidence zonder belastingwig of Pc/Pp.\"]}"`

Exit status: 0

Stdout:
```text
OK  minted D46 "Kostenstijging doorberekenen als pass-through share" (catalog now 250 units)
```

Stderr:
```text
(node:38752) Warning: Accessing non-existent property 'formatEntry' of module exports inside circular dependency
(Use `node --trace-warnings ...` to show where the warning was created)
```

### D07-dry-run

Command: `C:\Program Files\nodejs\node.exe build-scripts/references/unit-update.js --id D07 --spec "{\"name\":\"Heffing afwentelingspercentage berekenen\",\"kern\":\"Bereken welk percentage van een heffing bij consumenten en producenten terechtkomt nadat de euro-bedragen van de belastingdruk bekend zijn.\",\"needs\":[\"D42\",\"A38\"],\"exam_codes\":[\"D1.4a\"],\"mastery_target\":\"apply\",\"prior_learning\":\"new_this_year\",\"aspects\":[\"rekenen\",\"verbaal\"],\"terms\":[\"heffingen\"],\"procedure\":[\"Gebruik de belastingdruk in euros: consumentenbedrag = Pc - P0 en producentenbedrag = P0 - Pp.\",\"Deel het consumentenbedrag door de heffing t en vermenigvuldig met 100 procent.\",\"Deel het producentenbedrag door t en vermenigvuldig met 100 procent, of gebruik 100 procent minus consumentenpercentage.\",\"Controleer dat beide percentages samen 100 procent zijn.\",\"Rond af zoals de vraag vraagt en benoem wie welk percentage draagt.\"],\"pitfalls\":[\"De prijsverandering delen door de nieuwe prijs in plaats van door de heffing.\",\"Alleen het consumentenpercentage geven wanneer de vraag beide partijen vraagt.\",\"Elasticiteit uitleggen terwijl de vraag alleen om percentageberekening vraagt.\"]}" --dry-run`

Exit status: 0

Stdout:
```text
DRY RUN  would update D07: name, kern, needs, exam_codes, mastery_target, prior_learning, aspects, terms, procedure, pitfalls
```

### D07

Command: `C:\Program Files\nodejs\node.exe build-scripts/references/unit-update.js --id D07 --spec "{\"name\":\"Heffing afwentelingspercentage berekenen\",\"kern\":\"Bereken welk percentage van een heffing bij consumenten en producenten terechtkomt nadat de euro-bedragen van de belastingdruk bekend zijn.\",\"needs\":[\"D42\",\"A38\"],\"exam_codes\":[\"D1.4a\"],\"mastery_target\":\"apply\",\"prior_learning\":\"new_this_year\",\"aspects\":[\"rekenen\",\"verbaal\"],\"terms\":[\"heffingen\"],\"procedure\":[\"Gebruik de belastingdruk in euros: consumentenbedrag = Pc - P0 en producentenbedrag = P0 - Pp.\",\"Deel het consumentenbedrag door de heffing t en vermenigvuldig met 100 procent.\",\"Deel het producentenbedrag door t en vermenigvuldig met 100 procent, of gebruik 100 procent minus consumentenpercentage.\",\"Controleer dat beide percentages samen 100 procent zijn.\",\"Rond af zoals de vraag vraagt en benoem wie welk percentage draagt.\"],\"pitfalls\":[\"De prijsverandering delen door de nieuwe prijs in plaats van door de heffing.\",\"Alleen het consumentenpercentage geven wanneer de vraag beide partijen vraagt.\",\"Elasticiteit uitleggen terwijl de vraag alleen om percentageberekening vraagt.\"]}"`

Exit status: 0

Stdout:
```text
OK  updated D07: name, kern, needs, exam_codes, mastery_target, prior_learning, aspects, terms, procedure, pitfalls
```

## File Writes

- references/authored/course-target-exercises.json: applied reviewed mapping array patches for 3.1.1, 3.1.2, and 3.1.3

