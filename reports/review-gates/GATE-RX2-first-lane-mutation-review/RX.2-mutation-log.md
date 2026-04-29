# RX.2 Mutation Log

Status: `completed`  
Generated on: 2026-04-29T21:43:27.667Z  
Decision source: `reports/review-gates/GATE-RX2-first-lane-mutation-review/gate-closure.json`

## Pre-Execution Check

- Live A-domain max before mutation: `A60`
- Authorized IDs available: yes
- Dependency check: passed

## Commands

| Unit | Status | Command output |
|---|---|---|
| A61 | passed | OK  minted A61 "Tabelwaarden selecteren voor berekening" (catalog now 212 units) |
| A66 | passed | OK  minted A66 "Basiswaarde en vergelijkingswaarde in bron bepalen" (catalog now 213 units) |
| A67 | passed | OK  minted A67 "Procentuele verandering berekenen vanuit tabel" (catalog now 214 units) |
| A70 | passed | OK  minted A70 "Percentagepuntverandering in aandeel herkennen" (catalog now 215 units) |
| A72 | passed | OK  minted A72 "Indexcijfer berekenen vanuit tabel" (catalog now 216 units) |
| A74 | passed | OK  minted A74 "Procentuele verandering berekenen vanuit indexcijfers" (catalog now 217 units) |

## Applied

- Units added: `A61`, `A66`, `A67`, `A70`, `A72`, `A74`
- A61 rationale: A61 is an underbouw-assumed root for economic source-value selection for a calculation, not generic table reading.
- A70 decision: A70 depends on A38 because A64 is a deferred chart-only candidate; pie-chart share reading remains in the A64/A71 lane.

## Generator Block

Tracked in: `references/data/sprints/RX.2-generator-blocked-units.json`

All six units remain blocked for student-facing skill-tree use until generator implementation and validation.

## Blocked Scope

- A62
- A63
- A64
- A68
- A69
- A71
- A73
- A82
- A83
- A84
- producer candidates A75-A81
- held duplicate/overlap records
- student diagnostics
- adaptive routing
- student-facing AI
- automatic sequencing
- mastery decisions
- summative decisions
