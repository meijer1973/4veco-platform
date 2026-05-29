# MTU-H4A Answer-Form CLI-Mutation Planning Packet

Generated: 2026-05-29

Status: CLI-mutation plan ready, no mutation authorized.

## Scope

This packet prepares GATE-MTU-H4A. It proposes exact answer-form MTU specs for
the accepted H4 lanes only, while keeping held lanes and EX answer-skill
overlays visible.

This packet does not authorize unit-add execution, unit minting, candidate
storage creation, candidate writes, target-exercise mutation, generated
projection refresh, lesson output, diagnostics, adaptive routing, mastery,
sequencing, student-facing AI, summative use, PV projection, PV machine
promotion, Scale Gate 1, or student/product use.

## Source Gate

GATE-MTU-H4 closed PASS WITH CONDITIONS for routing only at reviewed remote
commit:

```text
38a032346db9a6a1dcb247d52afce745c48863f7
```

H4 authorized only this bounded planning packet.

## Baseline

Target exercises still have no `question_type`, `question_types`,
`answer_form`, or `answer_forms` fields. `answer-skill-candidates.json` remains
absent. Current extracted `question_type` values remain planning evidence only:

| question_type | Count |
|---|---:|
| `uitleg_dat` | 32 |
| `uitleg_of` | 10 |
| `bron` | 8 |
| `berekenen` | 2 |
| `noem` | 2 |

## ID-Space Finding

The MTU ID regex is two digits: `[A-L]\d\d`. That means `A100` is invalid.
The open A-domain slots are:

```text
A71, A80, A81, A96, A97, A98, A99
```

`A71` remains held/high-risk from prior graphical foundation work and is not
used by this packet. H4A therefore proposes `A80`, `A81`, and `A96`-`A99`.
This consumes the remaining non-held A-domain slots and must be reviewed before
any execution packet.

## Proposed Unit-Add Specs

These are exact later-planning specs only. None are live IDs yet.

| Lane | Proposed ID | Core |
|---|---|---|
| `ANS_BEREKEN` | `A96` | formula, substitution, intermediate steps, unit/notation, conclusion |
| `ANS_LEG_UIT_DAT` | `A97` | given conclusion, causal links, return to conclusion |
| `ANS_LEG_UIT_OF` | `A98` | determine direction first, then explain why |
| `ANS_LEG_UIT_MET_VOORBEELD` | `A99` | example, fit explanation, context link |
| `ANS_NOEM_GEEF_AAN` | `A80` | concise identification or list; split later if evidence requires |
| `ANS_BRON_GEBRUIKEN` | `A81` | source-use modifier plus underlying answer form |

All six specs use `zero_needs_status: true_zero` because they are answer-form
wrappers. Underlying content, calculation, graph, or reasoning units remain in
the target mapping rather than becoming stable `needs` edges on the answer-form
unit itself.

Each A-domain spec includes a `GEN_Axx` generator field, but later execution
must either implement and validate the generator or explicitly keep the unit
blocked from student-facing skill-tree/PV exposure.

## Held Lanes

| Lane | Status | Reason |
|---|---|---|
| `ANS_GRAFISCH_ARCEER_TEKEN` | held planning candidate | H4 requires stronger mapping evidence before minting. |
| `ANS_MOTIVEER_CLASSIFICATIE` | held Type 4 lane | Taxonomy requires it, but current extraction evidence does not support minting. |
| `ANS_ANALYSEER_BEOORDEEL` | held | Analysis/evaluation boundaries need stronger evidence. |

No held lane has a proposed unit-add command in this packet.

## Bron Boundary

`ANS_BRON_GEBRUIKEN` is not a complete standalone answer form. It must combine
with an underlying answer form such as calculation, explanation, concise
identification, classification, or graph/draw/shade.

Future target mapping must therefore not map `bron` alone as if it completes
the answer.

## EX Overlay Boundary

These remain EX answer-skill overlay needs with no candidate writes:

| Answer-skill ID | Route |
|---|---|
| `EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION` | q3 threshold conclusion with unit and direction |
| `EX_ANS_TWO_STEP_CORRECTION_MODEL_EXPLANATION` | q15 two-step correction-model explanation |

Persistent storage remains absent:

```text
references/data/exam-ingestion/answer-skill-candidates.json
```

## Later Command Plan

No execution is authorized now. A later execution packet, if authorized by
GATE-MTU-H4A, must prepare commands in this form:

```bash
node build-scripts/references/unit-add.js --spec '<reviewed A96 spec>'
node build-scripts/references/unit-add.js --spec '<reviewed A97 spec>'
node build-scripts/references/unit-add.js --spec '<reviewed A98 spec>'
node build-scripts/references/unit-add.js --spec '<reviewed A99 spec>'
node build-scripts/references/unit-add.js --spec '<reviewed A80 spec>'
node build-scripts/references/unit-add.js --spec '<reviewed A81 spec>'
```

The later packet must disclose that `unit-add` has no dry-run support, print
each extracted spec before execution, run simulated catalog validation before
mutation, and verify generators or exposure blocks before any student-facing
use.

## Rollback And Validation Requirements

Later rollback requirements:

- record pre-execution catalog state and exact commands;
- remove any newly minted answer-form units only through an authorized
  machine-reference rollback route;
- do not hand-edit `references/machine` or `references/external`;
- keep target-exercise mapping rollback separate from machine-reference
  rollback;
- do not expose generator-blocked answer-form units in student-facing routes.

Later validation stack:

```bash
node build-scripts/references/build-unit-index.js
node build-scripts/references/validate-core-schemas.js
node scripts/check-course-target-exercises-v5.js
node build-scripts/references/check-operation-answer-skill-candidates.js
node build-scripts/reports/validate-report-json.js
npm.cmd test -- --runInBand
git diff --check
```

## Recommended Next Gate

Run GATE-MTU-H4A to decide whether a later bounded execution packet may be
prepared for accepted lanes. No mutation or product use is authorized by this
packet.
