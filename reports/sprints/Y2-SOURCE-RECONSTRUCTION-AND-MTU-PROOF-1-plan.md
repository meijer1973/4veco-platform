# Y2-SOURCE-RECONSTRUCTION-AND-MTU-PROOF-1 Plan

Status: implementation lane opened after PR #139 merge.

## Goal

Complete the next protected proof lane required by the PR #139 merge boundary:
rendered source reconstruction and governed MTU/task-family proof for the four
Year 2/v6 target-foundation families.

## Product End-State And Original Specs

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`

Original sprint/gate/source specs:

- `references/owned/course-blueprint-v6-three-year.md`
- `reports/review-gates/Y2-TARGET-REGISTRY-AND-TASK-FOUNDATION-IMPLEMENTATION-1/review-packet.json`
- `reports/reference-planning/Y2-TARGET-REGISTRY-AND-TASK-FOUNDATION-IMPLEMENTATION-1-mtu-task-family-review.json`
- `references/data/year2-target-foundation/source-reconstruction-foundation.json`
- `references/data/year2-target-foundation/answer-contracts.json`

## Non-Negotiable Requirements

- Render source reconstruction evidence for Books 5, 6, 7, and 8 target families.
- Create governed MTU/task-family proof for every OP row.
- Tie the proof to answer contracts and source artifacts.
- Keep Book 8 derived representation labelled derived and non-official.
- Do not mutate external sources, MTUs, operations, answer skills, lessons, or product routes.
- Route final PR through READY_FOR_HUMAN_REVIEW with exact-head proof.

## Planned Outputs

- `build-scripts/references/build-y2-source-reconstruction-and-mtu-proof-1.js`
- `build-scripts/references/check-y2-source-reconstruction-and-mtu-proof-1.js`
- `references/data/year2-target-foundation/source-reconstruction-foundation.json`
- `reports/review-gates/Y2-SOURCE-RECONSTRUCTION-AND-MTU-PROOF-1/source-reconstruction-gallery.html`
- `reports/review-gates/Y2-SOURCE-RECONSTRUCTION-AND-MTU-PROOF-1/source-reconstruction-proof.json`
- `reports/review-gates/Y2-SOURCE-RECONSTRUCTION-AND-MTU-PROOF-1/source-reconstruction-proof.md`
- `reports/review-gates/Y2-SOURCE-RECONSTRUCTION-AND-MTU-PROOF-1/mtu-task-family-governed-proof.json`
- `reports/review-gates/Y2-SOURCE-RECONSTRUCTION-AND-MTU-PROOF-1/mtu-task-family-governed-proof.md`
- `reports/review-gates/Y2-SOURCE-RECONSTRUCTION-AND-MTU-PROOF-1/review-packet.json`
- `reports/reference-planning/Y2-SOURCE-RECONSTRUCTION-AND-MTU-PROOF-1-review-packet.md`
- `reports/sprints/Y2-SOURCE-RECONSTRUCTION-AND-MTU-PROOF-1-plan.md`
- `reports/sprints/Y2-SOURCE-RECONSTRUCTION-AND-MTU-PROOF-1-result.md`

## Verification Plan

- `node --check build-scripts/references/build-y2-source-reconstruction-and-mtu-proof-1.js`
- `node build-scripts/references/build-y2-source-reconstruction-and-mtu-proof-1.js`
- `node --check build-scripts/references/check-y2-source-reconstruction-and-mtu-proof-1.js`
- `node build-scripts/references/check-y2-source-reconstruction-and-mtu-proof-1.js`
- `npm.cmd run check:review-throughput -- reports/review-gates/Y2-SOURCE-RECONSTRUCTION-AND-MTU-PROOF-1/review-packet.json`
- `npm.cmd run check:platform`
- After PR open: branch-protection checker, lead review, PR Readiness Reviewer, and review-thread proof.
