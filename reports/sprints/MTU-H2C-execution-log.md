# MTU-H2C Execution Log

Generated: 2026-05-28

Status: reduced clean-lane CLI execution completed.

## Scope Executed

Executed only the clean lanes authorized by GATE-MTU-H2B and confirmed by
`reports/sprints/MTU-H2C-preflight.md`:

- `F19`
- `F20`
- `A85`
- `A86`
- `A87`
- `A91`

No `A12`, `A20`, `A88`, `A89`, `A90`, `A92`, or `A93` command was executed.

## Initial Quoting Failure

An initial PowerShell loop printed the intended JSON specs, but passed them to
Node with JSON quotes stripped. `unit-add.js` rejected those malformed specs
before any write. A follow-up live-registry check confirmed `F19`, `F20`,
`A85`, `A86`, `A87`, and `A91` were still absent before retrying execution.

This did not mutate the registry.

## Successful Command Method

Execution was retried through a Node wrapper using argument-array spawning:

```js
spawnSync(process.execPath, [
  'build-scripts/references/unit-add.js',
  '--spec',
  JSON.stringify(lane.proposed_spec)
])
```

This preserved JSON quoting and printed each extracted spec immediately before
running the CLI command.

## Echoed Specs And CLI Results

### F19

```json
{"id":"F19","name":"Maatschappelijke kosten verbaal herkennen","kern":"Herken dat een keuze, productie of consumptie kosten veroorzaakt die niet door de directe gebruiker of producent worden gedragen.","needs":[],"exam_codes":["F2.4"],"mastery_target":"understand","prior_learning":"new_this_year","aspects":["verbaal"],"terms":[],"zero_needs_status":"true_zero","zero_needs_review":{"reviewed_on":"2026-05-27","reviewer":"GATE-MTU-H2 routing review","rationale":"This is the first verbal external-cost recognition unit and must not depend on full MPC/MSC machinery.","recommended_needs":[],"severity":"medium"}}
```

Result:

```text
OK  minted F19 "Maatschappelijke kosten verbaal herkennen" (catalog now 233 units)
```

### F20

```json
{"id":"F20","name":"Maatschappelijke kosten uitleggen met voorbeeld","kern":"Geef een contextspecifiek voorbeeld van maatschappelijke of externe kosten en leg uit waarom die kosten bij anderen of de samenleving terechtkomen.","needs":["F19"],"exam_codes":["F2.4"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["verbaal"],"terms":[],"procedure":["Noem het concrete nadeel of de concrete schade uit de context.","Benoem wie de schade of kosten draagt.","Leg uit dat de directe gebruiker of producent deze kosten niet volledig betaalt.","Sluit af waarom dit maatschappelijke of externe kosten zijn."],"pitfalls":["Alleen een voorbeeld noemen zonder uit te leggen waarom het extern is.","De schade behandelen als gewone private kosten voor de gebruiker."]}
```

Result:

```text
OK  minted F20 "Maatschappelijke kosten uitleggen met voorbeeld" (catalog now 234 units)
```

### A85

```json
{"id":"A85","name":"Totale opbrengst puntberekening: TO = P x Q","kern":"Bereken totale opbrengst uit een enkele prijs en hoeveelheid zonder eerst een volledige TO-functie op te stellen.","needs":["A04"],"exam_codes":["A2.1"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal"],"terms":[],"procedure":["Bepaal de prijs P en hoeveelheid Q die bij dezelfde situatie horen.","Noteer TO = P x Q.","Vul P en Q in en bereken de totale opbrengst.","Controleer of aantallen, geldbedragen en schaalfactoren bij elkaar passen."],"pitfalls":["Een volledige TO-functie opstellen terwijl alleen een puntberekening nodig is.","P en Q uit verschillende situaties combineren."],"generator":"GEN_A85"}
```

Result:

```text
OK  minted A85 "Totale opbrengst puntberekening: TO = P x Q" (catalog now 235 units)
```

### A86

```json
{"id":"A86","name":"TVK berekenen uit constante variabele kosten","kern":"Bereken totale variabele kosten door constante variabele kosten per stuk met de hoeveelheid te vermenigvuldigen.","needs":["A04"],"exam_codes":["A2.1","A2.11"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal"],"terms":["variabele-kosten"],"procedure":["Bepaal de variabele kosten per stuk of constante MK uit de opgave.","Bepaal de hoeveelheid Q.","Noteer TVK = variabele kosten per stuk x Q.","Bereken TVK en controleer schaal en eenheid."],"pitfalls":["Variabele kosten per stuk behandelen als totale variabele kosten.","Constante kosten optellen voordat de vraag daarom vraagt."],"generator":"GEN_A86"}
```

Result:

```text
OK  minted A86 "TVK berekenen uit constante variabele kosten" (catalog now 236 units)
```

### A87

```json
{"id":"A87","name":"Onbekende vaste kosten berekenen uit winstvergelijking","kern":"Los W = TO - (TVK + TCK) op naar de onbekende vaste kosten wanneer winst, opbrengst en variabele kosten bekend zijn.","needs":["A02","A85","A86"],"exam_codes":["A2.1","A2.11"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal"],"terms":["winst"],"procedure":["Noteer de winstvergelijking W = TO - (TVK + TCK).","Vul W, TO en TVK in met dezelfde schaal en periode.","Herschrijf de vergelijking zodat TCK alleen staat.","Bereken TCK en geef de uitkomst met geldbedrag en schaalfactor."],"pitfalls":["A21 als volledige route behandelen zonder de onbekende TCK te isoleren.","TVK en TCK verwisselen.","De schaalfactor pas na de laatste stap vergeten."],"generator":"GEN_A87"}
```

Result:

```text
OK  minted A87 "Onbekende vaste kosten berekenen uit winstvergelijking" (catalog now 237 units)
```

### A91

```json
{"id":"A91","name":"MO = gegeven MK oplossen","kern":"Los MO = MK op wanneer de marginale kosten als constante of gegeven waarde in de opgave staan.","needs":["A02"],"exam_codes":["A2.10","A2.12"],"mastery_target":"apply","prior_learning":"new_this_year","aspects":["rekenen","verbaal"],"terms":["marginale-kosten"],"procedure":["Neem de MO-functie uit de voorafgaande stap.","Neem de gegeven MK-waarde uit de opgave.","Stel MO = gegeven MK.","Los de vergelijking op naar Q*.","Controleer dat je geen MK-functie afleidt als MK al gegeven is."],"pitfalls":["Een MK-functie afleiden terwijl MK direct gegeven is.","De gegeven kostenstijging verwarren met de nieuwe MK.","MO = MK oplossen zonder daarna de prijs uit GO/P(Q) te halen."],"generator":"GEN_A91"}
```

Result:

```text
OK  minted A91 "MO = gegeven MK oplossen" (catalog now 238 units)
```

## Warning Observed

After successful writes, Node printed:

```text
Warning: Accessing non-existent property 'formatEntry' of module exports inside circular dependency
```

The warning did not stop execution and the CLI returned exit code 0 for all
six lanes. Post-execution validators must determine whether this warning needs
separate follow-up.
