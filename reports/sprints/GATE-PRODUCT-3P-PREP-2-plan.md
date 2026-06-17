# GATE-PRODUCT-3P-PREP-2 Plan

Date: 2026-06-17

Status: prep sprint for first-three product-proof inventory; no product gate
closure

## Product End-State And Source Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Companion core spec:
  `../4veco-lessen/specifications/companion-core-specifications.md`
- Original prep packet: `reports/sprints/SCALE-PROOF-3P-PREP-1-result.md`
- Original prep evidence map:
  `reports/sprints/SCALE-PROOF-3P-PREP-1-evidence-map.md`
- Original prep blocker log:
  `reports/sprints/SCALE-PROOF-3P-PREP-1-blocker-log.md`
- Current `1.1.3` closure decision:
  `reports/sprints/B1-GRAPH-EVIDENCE-113-CLOSURE-RETRY-1-result.md`
- Current `1.1.3` flag implementation:
  `reports/sprints/B1-GRAPH-EVIDENCE-113-FLAG-IMPLEMENTATION-1-result.md`
- Machine review packet:
  `reports/review-gates/B1-GRAPH-EVIDENCE-113-FLAG-IMPLEMENTATION-1/review-packet.json`
- Current source data:
  `source-data/book-1/exit-ticket/1.1.1-exit-ticket.json`,
  `source-data/book-1/exit-ticket/1.1.2-exit-ticket.json`,
  `source-data/book-1/exit-ticket/1.1.3-exit-ticket.json`,
  `source-data/book-1/exit-ticket/1.1.1-korte-check.json`,
  `source-data/book-1/exit-ticket/1.1.2-korte-check.json`,
  `source-data/book-1/exit-ticket/1.1.3-korte-check.json`

## Objective

Refresh the first-three product-proof readiness inventory after the `1.1.3`
graph/table readiness flag implementation landed on platform and lesson main.
This sprint decides the next blocker before a later `GATE-PRODUCT-3P` review.

## Non-Negotiable Requirements

- Do not authorize product-route adoption.
- Do not authorize Scale Gate 1.
- Do not authorize diagnostics, mastery/sequencing, PV, broad product use, or
  student/product use.
- Do not enable completion language.
- Do not mutate generated lesson output unless a strict source/output mismatch
  is found.
- Do not migrate routes.
- Keep REV-STD-1 review packet structure for findings and carried issues:
  classification, blocks, does_not_block, and proof_required_to_close.
- PASS WITH FLAGS may not carry a missing core requirement.

## Work

1. Confirm platform and lesson `1.1.3-exit-ticket` agree on
   `gateApproved:true`, `targetReadinessEvidence:true`, and
   `completionLanguageEligible:false`.
2. Confirm `1.1.3-korte-check` remains advisory and non-readiness.
3. Refresh the first-three evidence map:
   - `1.1.1` remains held.
   - `1.1.2` Golden transfer remains held unless current evidence proves
     otherwise.
   - `1.1.3` graph/table readiness is implemented.
   - full rendered product-path proof remains missing unless captured in this
     sprint.
4. Identify the next blocker before `GATE-PRODUCT-3P`.
5. Recommend the next sprint from current evidence.

## Required Outputs

- `reports/sprints/GATE-PRODUCT-3P-PREP-2-plan.md`
- `reports/sprints/GATE-PRODUCT-3P-PREP-2-evidence-map.md`
- `reports/sprints/GATE-PRODUCT-3P-PREP-2-blocker-log.md`
- `reports/sprints/GATE-PRODUCT-3P-PREP-2-result.md`
- `reports/json/gate-product-3p-prep-2-proof.json`

## Validation

- `node build-scripts/sprints/check-checksurface-113-exemplar-exit1.js`
- `node build-scripts/sprints/check-graph-exit-ux1.js`
- `node build-scripts/sprints/check-graph-check-ux1.js`
- `node build-scripts/sprints/check-golden-exercise-workbench.js`
- `node build-scripts/sprints/check-checksurface-policy-regression1.js`
- `node scripts/check-course-target-exercises-v5.js`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `npm.cmd run check:scope-language`
- `npm.cmd run check:platform`
- `git diff --check`
- `git -C C:\Projects\4veco\4veco-lessen diff --check`

## Decision Target

- evidence-map completeness >= 9
- authority-boundary clarity >= 9
- next-blocker specificity >= 9
- no category below 8
