# GOLDEN-GRAPH-ADVISORY-113-BUNDLE-1 Plan

Date: 2026-06-20
Status: implementation bundle plan

## Product End-State And Original Specs

Product end-state refs:

- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `references/ui/exercise-workbench-policy.md`
- `references/ui/interaction-policy.md`
- `references/ui/layout-registry.md`

Original sprint and gate refs:

- `reports/sprints/GATE-PRODUCT-3P-CLOSURE-AND-SCALE-GATE-1-READINESS-BUNDLE-1-result.md`
- `reports/sprints/GATE-PRODUCT-3P-CLOSURE-AND-SCALE-GATE-1-READINESS-BUNDLE-1-golden-route-disposition.md`
- `reports/sprints/GATE-PRODUCT-3P-CLOSURE-AND-SCALE-GATE-1-READINESS-BUNDLE-1-blocker-log.md`
- `docs/roadmaps/golden-workbench/golden-workbench-rollout-roadmap.md`
- `source-data/book-1/exit-ticket/1.1.3-exit-ticket.json`

This sprint migrates only `1.1.3-korte-check` from the legacy task shell to a governed Golden graph-advisory route. It does not change `1.1.3-exit-ticket` readiness flags and does not close Scale Gate 1.

## Non-Negotiable Requirements

- Migrate only `1.1.3-korte-check` to a direct Golden Exercise Workbench shell.
- Preserve `surface:"advisory_short_check"`.
- Preserve `targetEquivalent.candidate:false`, `targetEquivalent.gateApproved:false`, `targetEquivalent.completionLanguageEligible:false`, and `metadataAlignment.targetReadinessEvidence:false`.
- Use real graph/table actions: axis choice, point placement, automatic line after two source-table points, interval-first graph reading, and neutral route advice.
- Reject fake slope, line-shape, line-confirmation, completed-graph-recognition, answer-giving placeholder, and correct-only selector patterns.
- Keep source/context-first layout and local after-attempt feedback.
- Keep dependent locking only where a real dependency exists.
- Regenerate lesson output through platform deploy only; do not hand-edit generated lesson output.
- Provide rendered desktop/mobile/dark/after-interaction proof, source/generated parity proof, route/link proof, regression proof for existing Golden routes, and REV-STD-1 review packet.
- Do not authorize completion language, product-route adoption, diagnostics, mastery/sequencing, PV, summative use, Scale Gate 1, broad product use, or student/product use.

## Architecture Plan

The existing variants are intentionally narrow:

- `golden_graph_reading_claim_v1` is target-exit shaped and requires graph construction, graph reading, and calculation/claim control.
- `golden_advisory_short_check_v1` is advisory-choice shaped and rejects task-shell graph actions.

The `1.1.3` short check is neither of those. Forcing it into the target-exit variant would create a fake claim task. Forcing it into the choice-only advisory variant would remove the required graph/table operation. This sprint therefore adds a narrow `golden_graph_advisory_v1` renderer variant.

The new variant reuses the existing graph primitives and Golden shell:

- `Graph.buildGraphSpec`
- axis-option controls with plausible distractors
- magnetic table-point snapping
- automatic line drawing after the second point
- interval-first graph reading
- existing neutral completion panel behavior
- existing Golden shell and asset selection

It adds only the route-choice advisory step needed for `1.1.3-korte-check`, with local repair feedback and no target-equivalent authority.

## Implementation Steps

1. Record architecture disposition and get sub-agent architecture lead review.
2. Patch `source-data/book-1/exit-ticket/1.1.3-korte-check.json` to declare `golden_graph_advisory_v1`, false authority flags, advisory metadata, clean graph copy, interval-first graph reading, and route-choice feedback.
3. Patch `engines/golden-ticket-layout.js` to support `golden_graph_advisory_v1`.
4. Add renderer-selection and layout tests for the new variant and negative checks for fake graph controls.
5. Add a sprint checker and capture script for source/generated parity, no-legacy shell proof, graph-advisory data policy, screenshots, route/link proof, authority boundary, and regression state for `1.1.1`, `1.1.2`, and `1.1.3` existing Golden routes.
6. Regenerate Book 1 lesson output through platform deploy.
7. Capture required screenshots and proof JSON.
8. Run specialist reviews and lead review.
9. Run validation and open paired platform/lesson PRs if lead review returns `READY_FOR_HUMAN_GOLDEN_GRAPH_ADVISORY_113_REVIEW`.

## Acceptance Checks

- `node build-scripts/sprints/capture-golden-graph-advisory-113-bundle-1.js`
- `node build-scripts/sprints/check-golden-graph-advisory-113-bundle-1.js`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `npm.cmd run check:scope-language`
- `npm.cmd run check:platform`
- `git diff --check`
- `git -C <lesson repo> diff --check`

## Stop Conditions

Stop and return a blocker bundle if the route cannot render as Golden without fake graph controls, if source/generated parity fails, if rendered graph interaction cannot be captured, if authority flags become true, if lesson output requires hand editing, or if lead review returns a hold verdict.
