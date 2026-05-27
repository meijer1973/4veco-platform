# Solo q1-q3 CLI-Mutation Planning Packet

Sprint: `MTU-H2A`

Generated: 2026-05-27

Status: planning packet ready, no mutation authorized.

No protected reference mutation, external-source mutation, machine-reference
mutation, unit minting, unit update execution, unit split execution, candidate
storage, candidate writes, lesson-output mutation, CP-6/Year-1 closure, or
student/product use is authorized by this packet.

## Source Authority

This packet follows `GATE-MTU-H2`, which closed as `pass_with_conditions` for
routing only. Candidate lane IDs from MTU-H2 remain review IDs, not live unit
IDs. The proposed IDs below are exact planning proposals for a later human
gate; they are not live registry changes.

## CLI Surface Finding

- `unit-update.js` supports `--dry-run`.
- `unit-add-dep.js` supports `--dry-run`.
- `unit-add.js` does not currently expose `--dry-run`.
- `unit-split.js` does not currently expose `--dry-run`.

Later review must decide whether direct CLI execution is acceptable after
reviewing exact specs, or whether a dry-run wrapper is required before any
write lane.

## Proposed New Unit IDs

| Proposed ID | Proposed label | Source question | Route |
|---|---|---|---|
| `F19` | Maatschappelijke kosten verbaal herkennen | q1 | new content unit |
| `F20` | Maatschappelijke kosten uitleggen met voorbeeld | q1 | new content/reasoning unit |
| `A85` | Totale opbrengst puntberekening: TO = P x Q | q2 | new calculation unit |
| `A86` | TVK berekenen uit constante variabele kosten | q2 | new calculation unit |
| `A87` | Onbekende vaste kosten berekenen uit winstvergelijking | q2 | new calculation unit |
| `A88` | Schaalfactoren in examencijfers toepassen | q2 | new calculation-reliability unit |
| `A89` | GO herkennen als prijsfunctie van de monopolist | q3 | new calculation/recognition unit |
| `A90` | MO bepalen zonder afgeleiden | q3 | new non-calculus MO route |
| `A91` | MO = gegeven MK oplossen | q3 | new given-MK route |
| `A92` | Nieuwe prijs bepalen na winstmaximaliserende Q | q3 | new price-after-Q route |
| `A93` | Procentuele prijsverandering na kostenverandering | q3 | new price-change route |

## Proposed Live Updates

| Live ID | Proposed route | Reason |
|---|---|---|
| `A12` | clarify as `MO bepalen met afgeleide` | preserve derivative MO route without making it the only MO route |
| `A20` | clarify as `MO = afgeleide MK oplossen` | separate derived-MK route from new `A91` given-MK route |

## Command Sequence For Later Review

These commands are not authorized now. The exact specs live in
`reports/mtu-hardening/solo-q1-q3-cli-mutation-plan.json`.

1. `node build-scripts/references/unit-add.js --spec '<F19 spec>'`
2. `node build-scripts/references/unit-add.js --spec '<F20 spec>'`
3. `node build-scripts/references/unit-add.js --spec '<A85 spec>'`
4. `node build-scripts/references/unit-add.js --spec '<A86 spec>'`
5. `node build-scripts/references/unit-add.js --spec '<A87 spec>'`
6. `node build-scripts/references/unit-add.js --spec '<A88 spec>'`
7. `node build-scripts/references/unit-add.js --spec '<A89 spec>'`
8. `node build-scripts/references/unit-add.js --spec '<A90 spec>'`
9. `node build-scripts/references/unit-update.js --id A12 --spec '<A12 update spec>'`
10. `node build-scripts/references/unit-add.js --spec '<A91 spec>'`
11. `node build-scripts/references/unit-update.js --id A20 --spec '<A20 update spec>'`
12. `node build-scripts/references/unit-add.js --spec '<A92 spec>'`
13. `node build-scripts/references/unit-add.js --spec '<A93 spec>'`

## Deferred But Visible

- `MTUH2-Q1-A-LEG-UIT-WITH-EXAMPLE` remains routed to MTU-H4.
- `MTUH2-Q2-A-BEREKEN-ANSWER-FORM` remains routed to MTU-H4.
- `MTUH2-Q3-D07-PASS-THROUGH-DEPENDENCY` remains routed to MTU-H3.

## Guardrails

- `F16` may support q1, but q1 must not require full MPC/MSC machinery.
- q2 must not require full TO-function construction through `A07`.
- q2 must not treat `A21` alone as sufficient for reverse fixed-cost
  calculation.
- q3 must not require MK derivation when MK is given.
- q3 must not make the derivative MO route the only route.
- q3 must not confuse percentage price rise with pass-through share.
- D07 broader incidence/pass-through work remains MTU-H3.
- q1 and q2 answer-form needs remain visible for MTU-H4.

## Required Later Execution Proof

If a later gate authorizes execution, the execution sprint must record:

- exact CLI commands run;
- mutation/audit log evidence;
- rollback instructions;
- before/after git diff for `references/machine/micro-teaching-units.*`;
- validation output for unit index, schemas, reports, reference health, and
  Jest;
- explicit confirmation that no lesson output or student/product use was
  authorized.
