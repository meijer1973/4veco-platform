# EXAM-ANCHOR-Q3-Q15-Q19-REPAIR-1 Q15 Anchor Packet

Status: focused Q15 evidence-routing packet

## Product End-State And Original Specs

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`

Original sprint/gate/source specs:

- `reports/sprints/EXAM-ANCHOR-Q3-Q15-Q19-REPAIR-1-plan.md`
- `reports/reference-planning/EXAM-OPERATION-SPINE-ANCHOR-1-anchor-matrix.md`
- `reports/reference-planning/EX-1-exam-ingestion-pilot.md`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.json`

## Exam Item

Exam item: `vw-1022-a-25-1-o:opgave-3:question-15`

Primary files:

- `references/external/exam-questions.json`
- `references/data/exam-ingestion/exam-item-overlays.json`
- `references/data/exam-ingestion/exam-answer-model-overlays.json`
- `references/data/exam-ingestion/exam-source-annex-overlays.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.json`
- `reports/json/exam-ingestion-coverage.json`
- `reports/json/exam-question-extraction-gaps.json`

## Evidence Summary

| Evidence surface | Status | Evidence |
|---|---|---|
| Prompt | extracted | The external record contains the 2025 VWO tv1 ice-cream/prisoner's-dilemma explanation prompt with 2 points, question type `uitleg_dat`, and exam code `D1.9`. |
| Source annex | extracted pending review | `question-context-page-7` carries the relevant perfect-substitutes and competitive-price context. |
| Correction model | extracted pending review | `q15-step-1` covers dominant undercut/lower-price reasoning; `q15-step-2` covers mutually worse revenue/profit outcome and prisoner's dilemma. |
| Blocking source/model gaps | none recorded | Source-annex and answer-model overlays carry empty blocking-gap lists for Q15. |
| Extraction metadata gap | open | `reports/json/exam-question-extraction-gaps.json` lists `vw-1022-a-25-1-o:q15` as missing required skills. |
| Routing gap | open | `q15-answer-1` remains an answer-skill design candidate. |

## Anchor Consequence

Q15 improves the evidence detail for:

- `OP-S1` Game-theory and collective-action reasoning.
- `OP-ANS3` Source-supported explanation and evaluation answer.
- `OP-ANS1` Command-word handling and point allocation.

It does not close any row:

- `OP-S1` remains missing a Book 8 target anchor and constructed-response
  production proof.
- `OP-ANS3` remains partial because the two-step correction-model explanation
  is an answer-skill need.
- `OP-ANS1` still lacks a dedicated target and point-allocation MTU.

## Non-Negotiable Requirements

1. Treat the official PDF and mirrored external question record as source
   authority.
2. Keep Q15 extraction evidence as pending review, not production closure.
3. Keep D27/F03/F09 as content coverage only.
4. Keep `q15-answer-1` open as an answer-skill design candidate.
5. Keep the missing-required-skills extraction gap visible.
6. Do not mutate external, machine, authored, target, or lesson files.

## Core-Requirement Checklist

| Requirement | Status | Evidence | Consequence |
|---|---|---|---|
| Product end-state cited | met | this packet | REV-STD-1 citation requirement met |
| Original specs cited | met | this packet | Scope tied to EX-1/EX-2 and operation-spine matrix |
| Prompt evidence named | met | `exam-questions.json`, `exam-item-overlays.json` | Q15 prompt is usable as extracted evidence |
| Source-annex evidence named | met | `question-context-page-7` | Context can support planning |
| Correction model named | met | `q15-step-1`, `q15-step-2`, `q15-pr-1`, `q15-pr-2` | Answer model can support planning |
| Extraction metadata gap carried | met | `vw-1022-a-25-1-o:q15` | Required-skill metadata remains unclosed |
| No product authority claimed | met | authority boundaries false | Student/product use remains blocked |

## Findings

| ID | Classification | Severity | Finding | blocks | does_not_block | proof_required_to_close |
|---|---|---:|---|---|---|---|
| Q15-001 | core_requirement_met | high | Prompt, context source, and answer-model evidence are represented. | Nothing for Q15 evidence visibility | Official operation closure | Human review of extracted evidence and answer-skill route. |
| Q15-002 | carried_gap | high | `q15-answer-1` remains an answer-skill design candidate. | `OP-S1` and `OP-ANS3` production reliance | Planning and dry-run coordination with visible gaps | Reviewed answer-skill route for two-step correction-model explanations. |
| Q15-003 | carried_gap | medium | `vw-1022-a-25-1-o:q15` remains in the extraction-gap queue for missing required skills. | Required-skill metadata closure | Evidence classification | Manual required-skill review or governed metadata repair. |
| Q15-004 | downstream_blocker | critical | Product, Scale, diagnostics, mastery, PV, summative, and student-use authority remain false. | Downstream product gates | Evidence packet review | Separate product-proof and Scale/CP gates. |

## Decision

Decision status: Q15 anchor routing improved, not closed.

Allowed next use:

- Use Q15 as partial official-exam evidence for later `OP-S1`, `OP-ANS3`, and
  `OP-ANS1` planning.
- Use Q15 to plan the future source-supported explanation answer-skill review.

Not allowed:

- Claim official operation closure or production readiness.
- Promote Q15 into student/product use.
- Mutate protected references or generated lessons.
