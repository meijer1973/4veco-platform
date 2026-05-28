# MTU-H2H A20/A94/A95 CLI-Mutation Planning Packet

Generated: 2026-05-28

Status: packet ready, no mutation authorized.

This packet implements the GATE-MTU-H2G planning conditions. It prepares exact
later specs and mapping diffs for review only. It does not authorize `A20`
mutation, `A94`/`A95` minting, target-exercise mapping writes, generator
changes, generated projection refresh, PV projection, lesson output, or
student/product use.

## Source Gate

GATE-MTU-H2G closed as PASS WITH CONDITIONS for planning only. Reviewed remote
commit:

```text
f925da5ed7521c3052c60668599c5a97d99aaf7a
```

## Corrected Unit Route

| Unit | Action | Route | Key correction |
|---|---|---|---|
| `A20` | `unit-update` later | derived MO plus derived MK | keeps `A2.11`; renamed to `Winstmaximum oplossen met afgeleide MO en MK` |
| `A94` | `unit-add` later | price-taker `MO = P` plus derived MK | explicitly teaches the price-taker rule |
| `A95` | `unit-add` later | given MK-function | distinct from `A91` given constant/value MK |

## A20 Reviewed Spec

```json
{
  "name": "Winstmaximum oplossen met afgeleide MO en MK",
  "needs": ["A12", "A13", "A02"],
  "exam_codes": ["A2.10", "A2.11", "A2.12"],
  "terms": ["marginale-kosten"],
  "generator": "GEN_A20"
}
```

Execution condition: only after affected mappings and `GEN.A20` route are
approved in the same or prior reviewed packet.

## A94 Reviewed Spec

```json
{
  "id": "A94",
  "name": "MO = P en afgeleide MK oplossen",
  "needs": ["A13", "A02"],
  "exam_codes": ["A2.10", "A2.11", "A2.12"],
  "generator": "GEN_A94"
}
```

Required procedure step:

```text
Gebruik de regel: bij een prijsnemer geldt MO = marktprijs P.
```

## A95 Reviewed Spec

```json
{
  "id": "A95",
  "name": "MO = gegeven MK-functie oplossen",
  "needs": ["A02"],
  "exam_codes": ["A2.10", "A2.12"],
  "generator": "GEN_A95"
}
```

A95 is the preferred home for the current `GEN.A20` behavior if that behavior
is preserved, because current `GEN.A20` gives both MO and MK functions
directly.

## Target-Exercise Mapping Plan

| Record | Before | After | Reason |
|---|---|---|---|
| `3.2.2` required skills | `A11`, `A13`, `A20`, `A21`, `A33`, `D30` | `A11`, `A13`, `A94`, `A21`, `A33`, `D30` | price-taker `MO = P`, not derivative MO |
| `3.2.2` prior | `A20`, `A21`, `D30` | `A21`, `D30` | A94 becomes introduced/required, not hidden prior |
| `3.2.2` new | `A11`, `A13`, `A33` | `A11`, `A13`, `A94`, `A33` | make the route visible |
| `3.3.3` | keep `A20` | keep `A20` | canonical derived-MO plus derived-MK route |
| `4.1.2` required skills | `A11`, `A20`, `A35`, `A36`, `D18`, `D21`, `D22`, `D24` | `A11`, `A91`, `A35`, `A36`, `D18`, `D21`, `D22`, `D24` | given constant MK |
| `4.1.2` prior | `A11`, `A20`, `A35` | `A11`, `A91`, `A35` | avoid derived-MK false prerequisite |

These are authored-reference mapping changes. They are not generated
projection refreshes and they do not imply target-exercise promotion.

## Generator Plan

Preferred route:

```text
Current GEN.A20 behavior -> GEN_A95 or equivalent
New/revised GEN.A20 -> derive MO from TO and MK from TK
```

If that route is not implemented, later execution must block student-facing
A20/A95 skill-tree exposure and prove no stale generator route is reachable.

## Later Command Plan

```bash
node build-scripts/references/unit-update.js --id A20 --spec '<reviewed A20 JSON>'
node build-scripts/references/unit-add.js --spec '<reviewed A94 JSON>'
node build-scripts/references/unit-add.js --spec '<reviewed A95 JSON>'
```

No command is authorized by this packet. `unit-add` has no dry-run; a later
execution gate must either accept that limitation with exact extracted-spec
logging or provide a wrapper.

## Projection Guardrails

Refresh generated projections only after authorized unit and mapping
mutations:

- `references/data/owned-content-graph.json`
- `references/data/rag/chunk_index.jsonl`
- `reports/json/blueprint-flag-triage.json`
- procedure-visual reports
- generator-readiness reports

No PV projection or PV machine promotion is authorized.

## Recommended Next Action

Commit and push this packet and cited evidence, then run
`GATE-MTU-H2H-a20-cli-mutation-plan` before any execution packet or mutation.
