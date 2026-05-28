# Solo q1-q3 CLI Execution Gate Packet

Sprint: `MTU-H2B`

Generated: 2026-05-28

Status: execution-gate packet ready, no mutation authorized.

No protected reference mutation, external-source mutation, machine-reference
mutation, unit minting, unit update execution, unit split execution, candidate
storage, candidate writes, lesson-output mutation, CP-6/Year-1 closure, or
student/product use is authorized by this packet.

## Source Authority

This packet follows GATE-MTU-H2A, which closed as PASS WITH CONDITIONS for
execution-gate planning only. H2B translates that reviewed plan into an
execution-review packet. It does not execute the commands.

Source plan:

- `reports/mtu-hardening/solo-q1-q3-cli-mutation-plan.json`

## Registry State Proof

- Source commit at packet start:
  `5f34a79cb532de62d1f05e732cf532b2566396be`
- Proposed new IDs checked absent: `F19`, `F20`, `A85`, `A86`, `A87`, `A88`,
  `A89`, `A90`, `A91`, `A92`, `A93`.
- Live update targets checked present: `A12`, `A20`.
- Proposed term slugs validated: `variabele-kosten`, `winst`,
  `marginale-kosten`.
- Proposed A-domain units carry generator fields: `GEN_A85` through
  `GEN_A93`.

## A20 Usage Impact Audit

Direct `A20` narrowing is **not execution-ready**.

Active uses found:

| Source | Record | Classification | Evidence |
|---|---|---|---|
| `references/authored/course-target-exercises.json` | `3.2.2` | derived-MK required | TK is quadratic; students derive MK and set MO = MK. |
| `references/authored/course-target-exercises.json` | `3.3.3` | derived-MK required | Students derive TO/MO and TK/MK, then set MO = MK. |
| `references/authored/course-target-exercises.json` | `4.1.2` | given-MK required | The target gives `MK = EUR10` constant and asks students to set MO = MK. |
| `engines/skilltree/generators.js` | `GEN_A20` | generator review required | A20 has a live generator; narrowing needs generator review. |
| `references/data/procedure-visual/inventory.json` | A20 entries | derived-MK support context | PV evidence supports derived-MK handling but still needs review before live change. |

Conclusion: execute no direct `A20` update from this packet. Route A20 to a
later split/deprecate/replacement lane or require a packet that also handles
affected mappings.

## Execution-Ready Command Set For Review

The exact JSON specs live in the H2A source plan. The commands below extract
those reviewed specs by lane ID. They are not authorized now.

| Lane | Unit | Action | Command form |
|---|---|---|---|
| `MTUH2B-F19-VERBAL-EXTERNAL-COST` | `F19` | `unit-add` | `$plan = Get-Content -Raw reports\mtu-hardening\solo-q1-q3-cli-mutation-plan.json \| ConvertFrom-Json; $spec = ($plan.mutation_lanes \| Where-Object lane_id -eq 'MTUH2A-Q1-F19-VERBAL-EXTERNAL-COST').proposed_spec \| ConvertTo-Json -Depth 20 -Compress; node build-scripts\references\unit-add.js --spec $spec` |
| `MTUH2B-F20-EXTERNAL-COST-EXAMPLE` | `F20` | `unit-add` | Extract source lane `MTUH2A-Q1-F20-EXTERNAL-COST-EXAMPLE` and run `unit-add`. |
| `MTUH2B-A85-TO-POINT-CALCULATION` | `A85` | `unit-add` | Extract source lane `MTUH2A-Q2-A85-TO-POINT-CALCULATION` and run `unit-add`. |
| `MTUH2B-A86-TVK-CONSTANT-VARIABLE-COST` | `A86` | `unit-add` | Extract source lane `MTUH2A-Q2-A86-TVK-CONSTANT-VARIABLE-COST` and run `unit-add`. |
| `MTUH2B-A87-UNKNOWN-FIXED-COST-FROM-PROFIT` | `A87` | `unit-add` | Extract source lane `MTUH2A-Q2-A87-UNKNOWN-FIXED-COST-FROM-PROFIT` and run `unit-add`. |
| `MTUH2B-A88-SCALE-FACTOR-HANDLING` | `A88` | `unit-add` | Extract source lane `MTUH2A-Q2-A88-SCALE-FACTOR-HANDLING` and run `unit-add`. |
| `MTUH2B-A89-GO-AS-PRICE-RELATION` | `A89` | `unit-add` | Extract source lane `MTUH2A-Q3-A89-GO-AS-PRICE-RELATION` and run `unit-add`. |
| `MTUH2B-A90-MO-WITHOUT-DERIVATIVES` | `A90` | `unit-add` | Extract source lane `MTUH2A-Q3-A90-MO-WITHOUT-DERIVATIVES` and run `unit-add`. |
| `MTUH2B-A12-DERIVATIVE-MO-UPDATE` | `A12` | `unit-update` | First run the listed `--dry-run` command, then run `unit-update` only if the gate authorizes execution. |
| `MTUH2B-A91-MO-EQUALS-GIVEN-MK` | `A91` | `unit-add` | Extract source lane `MTUH2A-Q3-A91-MO-EQUALS-GIVEN-MK` and run `unit-add`. |
| `MTUH2B-A92-NEW-PRICE-AFTER-Q` | `A92` | `unit-add` | Extract source lane `MTUH2A-Q3-A92-NEW-PRICE-AFTER-Q` and run `unit-add`. |
| `MTUH2B-A93-PERCENTAGE-PRICE-CHANGE-AFTER-COST-CHANGE` | `A93` | `unit-add` | Extract source lane `MTUH2A-Q3-A93-PERCENTAGE-PRICE-CHANGE-AFTER-COST-CHANGE` and run `unit-add`. |

Held lane:

- `A20` update/split is not execution-ready from this packet.

## Expected Diff Scope If Later Authorized

Direct CLI writes should touch only:

- `references/machine/micro-teaching-units.md`
- `references/machine/micro-teaching-units.json`

Post-execution generated reports and indexes may refresh. The execution sprint
must prove that `references/external/`, candidate storage, lesson output,
target-exercise promotion records, and product-use flags do not change.

## Required Post-Execution Validation If A Later Gate Authorizes Execution

```powershell
node build-scripts/references/build-unit-index.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/references/check-mtu-h2b-cli-execution-gate-packet.js
node build-scripts/references/check-mtu-h2a-cli-mutation-plan.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd test -- --runInBand
git diff --check
```

## Review Recommendation

GATE-MTU-H2B should consider PASS WITH CONDITIONS for unblocked execution only,
or require a dry-run wrapper before `unit-add` execution. It should not
authorize direct `A20` update/split execution from this packet.
