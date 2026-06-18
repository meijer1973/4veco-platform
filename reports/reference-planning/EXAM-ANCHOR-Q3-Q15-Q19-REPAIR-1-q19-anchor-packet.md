# EXAM-ANCHOR-Q3-Q15-Q19-REPAIR-1 Q19 Anchor Packet

Status: focused Q19 blocked-anchor packet

## Product End-State And Original Specs

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`

Original sprint/gate/source specs:

- `reports/sprints/EXAM-ANCHOR-Q3-Q15-Q19-REPAIR-1-plan.md`
- `reports/reference-planning/EXAM-OPERATION-SPINE-ANCHOR-1-anchor-matrix.md`
- `reports/reference-planning/EX-1-exam-ingestion-pilot.md`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.json`

## Exam Item

Exam item: `vw-1022-a-25-1-o:opgave-4:question-19`

Primary files:

- `references/external/exam-questions.json`
- `references/data/exam-ingestion/exam-item-overlays.json`
- `references/data/exam-ingestion/exam-answer-model-overlays.json`
- `references/data/exam-ingestion/exam-source-annex-overlays.json`
- `references/data/exam-ingestion/source-annex-extraction-overlays.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.json`
- `reports/json/exam-ingestion-coverage.json`
- `reports/json/exam-question-extraction-gaps.json`
- `reports/mtu-hardening/mtu-h5-q19-source-graph-reasoning-package-1.md`

## Evidence Summary

| Evidence surface | Status | Evidence |
|---|---|---|
| Prompt | extracted | The external record contains the 2025 VWO tv1 Curacao/Aruba three-market drawing prompt with 2 points and question type `bron`. |
| Source annex | partially extracted | Source refs include `figuur-1-factoren-curacao-arubaanse-economie` and `uitwerkbijlage-vraag-19`. |
| Correction model | extracted pending review | `q19-step-1`, `q19-step-2`, and `q19-step-3` represent the three rightward demand shifts and rising-equilibrium-price conclusions. |
| Blocking source/model gaps | open | `q19-source-annex-gap` and `q19-graph-object-gap` remain blocking. |
| Future source/graph storage | blocked candidate only | `source-annex-extraction-overlays.json` exists as `future_candidate_storage`; `source_annex_extraction_execution_authorized` is false and every Q19 graph/source record remains `partial_with_blocking_gap` and `blocked`. |
| Extraction metadata gap | open | `reports/json/exam-question-extraction-gaps.json` lists `vw-1022-a-25-1-o:q19` as missing required skills and exam codes. |
| Routing gaps | open | `q19-graph-op-1` remains a held graph/PV route candidate; `q19-reason-1` remains a provisional operation design candidate blocked by the source/graph gaps. |

## Anchor Consequence

Q19 remains blocked for:

- `OP-G3` Shift versus movement and before-after graph state.
- `OP-LT1` Labour and trade market application.
- `OP-MP1` Monetary transmission and open-economy channels.
- `OP-ANS3` Source-supported explanation and evaluation answer.

It does not close any row:

- `OP-G3` still cannot rely on Q19 while graph geometry and worksheet evidence
  are not reconstructable.
- `OP-LT1` still has target-review blockers and Q19 source/graph blockers.
- `OP-MP1` still lacks a Book 10 target anchor and has Q19 source/graph
  blockers.
- `OP-ANS3` still lacks constructed-response and source-supported answer proof.

## Non-Negotiable Requirements

1. Treat the official PDF and mirrored external question record as source
   authority.
2. Keep Q19 blocked until source-annex and graph-object extraction gaps close.
3. Do not treat A42/D10/D13 as production closure; they are partial candidates.
4. Keep A45 as weak/prerequisite support only.
5. Keep the missing-required-skills and missing-exam-codes extraction gaps
   visible.
6. Do not mutate external, machine, authored, target, or lesson files.

## Core-Requirement Checklist

| Requirement | Status | Evidence | Consequence |
|---|---|---|---|
| Product end-state cited | met | this packet | REV-STD-1 citation requirement met |
| Original specs cited | met | this packet | Scope tied to EX-1/EX-2 and operation-spine matrix |
| Prompt evidence named | met | `exam-questions.json`, `exam-item-overlays.json` | Q19 prompt is visible |
| Source-annex blockers named | met | `q19-source-annex-gap`, `q19-graph-object-gap` | Q19 remains blocked |
| Correction model named | met | `q19-step-1`, `q19-step-2`, `q19-step-3` | Answer-model extraction remains planning evidence only |
| Extraction metadata gaps carried | met | `vw-1022-a-25-1-o:q19` | Required-skill/exam-code metadata remains unclosed |
| No product authority claimed | met | authority boundaries false | Student/product use remains blocked |

## Findings

| ID | Classification | Severity | Finding | blocks | does_not_block | proof_required_to_close |
|---|---|---:|---|---|---|---|
| Q19-001 | core_requirement_met | high | Q19 prompt and correction-model evidence are represented. | Nothing for evidence visibility | Full reconstruction or official operation closure | Human review plus source/graph reconstruction. |
| Q19-002 | blocking_gap | critical | `q19-source-annex-gap` blocks full worksheet/source reconstruction. | Full mapping, lesson handoff, `OP-G3`, `OP-LT1`, `OP-MP1`, `OP-ANS3` production reliance | Visible blocker routing | Reconstructable official source figure and worksheet evidence, or later human gate accepting a visible limitation. |
| Q19-003 | blocking_gap | critical | `q19-graph-object-gap` blocks graph/PV projection and market-diagram operation closure. | Graph/PV route adoption and source-supported task use | Planning with blocker labels | Graph axes, units, line geometry, source locators, and worksheet context. |
| Q19-004 | carried_gap | medium | `vw-1022-a-25-1-o:q19` remains in the extraction-gap queue for missing required skills and exam codes. | Metadata closure | Evidence classification | Manual required-skill and exam-code review. |
| Q19-005 | checker_authority_gap | high | Future source-annex extraction storage exists, but execution authority is false; legacy checkers around that storage cannot be treated as clean closure proof. | Source/graph closure and checker-backed authority claims | Carrying the blocked storage as visible evidence | Reconciled checker/gate authority or a later reviewed source-annex extraction execution gate. |
| Q19-006 | downstream_blocker | critical | Product, Scale, diagnostics, mastery, PV, summative, and student-use authority remain false. | Downstream product gates | Evidence packet review | Separate product-proof and Scale/CP gates. |

## Decision

Decision status: Q19 remains blocked.

Allowed next use:

- Use Q19 as explicit blocked evidence for later source-annex/graph extraction
  planning.
- Carry A42/D10/D13 as partial routing candidates only.
- Carry the future source-annex extraction storage only as blocked candidate
  evidence until execution authority is reviewed.

Not allowed:

- Claim official operation closure, graph/PV route closure, or production
  readiness.
- Promote Q19 into lesson handoff or student/product use.
- Mutate protected references or generated lessons.
