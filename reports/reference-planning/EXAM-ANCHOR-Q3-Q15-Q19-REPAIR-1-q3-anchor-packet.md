# EXAM-ANCHOR-Q3-Q15-Q19-REPAIR-1 Q3 Anchor Packet

Status: focused Q3 evidence-routing packet

## Product End-State And Original Specs

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`

Original sprint/gate/source specs:

- `reports/sprints/EXAM-ANCHOR-Q3-Q15-Q19-REPAIR-1-plan.md`
- `reports/reference-planning/EXAM-OPERATION-SPINE-ANCHOR-1-anchor-matrix.md`
- `reports/reference-planning/EX-1-exam-ingestion-pilot.md`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.json`

## Exam Item

Exam item: `vw-1022-a-25-1-o:opgave-1:question-3`

Primary files:

- `references/external/exam-questions.json`
- `references/data/exam-ingestion/exam-item-overlays.json`
- `references/data/exam-ingestion/exam-answer-model-overlays.json`
- `references/data/exam-ingestion/exam-source-annex-overlays.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.json`
- `reports/json/exam-ingestion-coverage.json`
- `reports/json/exam-source-authority1-contract.json`
- `reports/json/task-ingest-transform2-actual-exam.json`
- `reports/json/task-ingest-transform2-actual-exam-proof.json`
- `reports/json/mtu-ans-proof-impl1-a96-proof.json`

## Evidence Summary

| Evidence surface | Status | Evidence |
|---|---|---|
| Prompt | extracted | The external record contains the 2025 VWO tv1 health-insurance calculation prompt with 2 points, question type `berekenen`, and exam codes `A2.4`, `A2.5`. |
| Source annex | extracted pending review | `table-1-zoohee-zorgverzekering` gives statutory and enhanced deductible/premium values: `385`/`108.25` and `885`/`86.25`. |
| Correction model | extracted pending review | Two correction steps and two point rules are represented; the required threshold conclusion is `EUR 649 per year`. |
| Blocking source/model gaps | none recorded | Source-annex and answer-model overlays carry empty blocking-gap lists for Q3. |
| Routing gaps | open | `q3-calc-1` remains an operation-registry design candidate; `q3-answer-1` remains an answer-skill design candidate. |

## Anchor Consequence

Q3 improves the evidence detail for:

- `OP-R1` Risk, insurance, and asymmetric information.
- `OP-ANS2` Calculation-answer formatting.
- `OP-ANS1` Command-word handling and point allocation.

It does not close any row:

- `OP-R1` remains missing a Book 7 target anchor and is broader than this
  annual deductible/premium threshold task.
- `OP-ANS2` remains useful design input only; the A96 proof is route-specific
  and product-route adoption is false.
- `OP-ANS1` still lacks a dedicated target and governed point-allocation MTU.

## Non-Negotiable Requirements

1. Treat the official PDF and mirrored external question record as source
   authority.
2. Keep Q3 extraction evidence as pending review, not production closure.
3. Keep stale `A15` as weak/incorrect for the annual-cost threshold operation.
4. Keep `A61` as source-reading support only.
5. Keep `q3-calc-1` and `q3-answer-1` open until a later governed review closes
   them.
6. Do not mutate external, machine, authored, target, or lesson files.

## Core-Requirement Checklist

| Requirement | Status | Evidence | Consequence |
|---|---|---|---|
| Product end-state cited | met | this packet | REV-STD-1 citation requirement met |
| Original specs cited | met | this packet | Scope tied to EX-1/EX-2 and operation-spine matrix |
| Prompt evidence named | met | `exam-questions.json`, `exam-item-overlays.json` | Q3 prompt is usable as extracted evidence |
| Source-annex evidence named | met | `table-1-zoohee-zorgverzekering` | Table values can support planning |
| Correction model named | met | `q3-step-1`, `q3-step-2`, `q3-pr-1`, `q3-pr-2` | Answer model can support planning |
| Blocking gaps carried | met | `q3-calc-1`, `q3-answer-1` | Official closure remains blocked |
| No product authority claimed | met | authority boundaries false | Student/product use remains blocked |

## Findings

| ID | Classification | Severity | Finding | blocks | does_not_block | proof_required_to_close |
|---|---|---:|---|---|---|---|
| Q3-001 | core_requirement_met | high | Prompt, table source, and answer-model evidence are represented. | Nothing for Q3 evidence visibility | Official operation closure | Human review of the extracted evidence and later operation route decision. |
| Q3-002 | carried_gap | high | `q3-calc-1` remains an operation-registry design candidate; stale `A15` cannot close the annual-cost threshold operation. | `OP-R1` and `OP-ANS2` production reliance | Planning and dry-run coordination with visible gaps | Governed operation/procedure review deciding whether to mint, map, or strengthen the annual threshold operation. |
| Q3-003 | carried_gap | medium | `q3-answer-1` remains an answer-skill design candidate. | Calculation-answer production adoption | Answer-form design input | Reviewed answer-skill route for threshold conclusion with unit and direction. |
| Q3-004 | downstream_blocker | critical | Product, Scale, diagnostics, mastery, PV, summative, and student-use authority remain false. | Downstream product gates | Evidence packet review | Separate product-proof and Scale/CP gates. |

## Decision

Decision status: Q3 anchor routing improved, not closed.

Allowed next use:

- Use Q3 as partial official-exam evidence for later `OP-R1`, `OP-ANS2`, and
  `OP-ANS1` planning.
- Use Q3 to plan the future annual cost-threshold operation and threshold
  conclusion answer-skill review.

Not allowed:

- Claim official operation closure or production readiness.
- Promote Q3 into student/product use.
- Mutate protected references or generated lessons.
