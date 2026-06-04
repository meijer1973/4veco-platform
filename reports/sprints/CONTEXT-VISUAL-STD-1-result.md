# Sprint CONTEXT-VISUAL-STD-1: Result

## Plan reference

- Plan: `reports/sprints/CONTEXT-VISUAL-STD-1-plan.md`
- Baseline: `reports/sprints/CONTEXT-VISUAL-STD-1-baseline.md`
- Plan data: `references/data/sprints/CONTEXT-VISUAL-STD-1.plan.json`
- Result data: `references/data/sprints/CONTEXT-VISUAL-STD-1.result.json`

## Summary

Closed the source context visual standard as a standard/checker sprint. The
standard defines the student-facing visual rules future source-reconstruction
work must satisfy for semantic tables, reconstructed SVG graphs/figures/
flowcharts, formula boxes, source cards, captions, labels, color tokens,
typography, spacing, mobile behavior, dark mode, axis/legend conventions, SVG
sizing, alt text, source-label rules, source-output parity, and reviewer proof.

The machine-readable contract covers all eight `TASK-CONTEXT-SPEC-1` block
types and the checker cross-checks the standard against the prior context
contract, prior runtime proof, current task-shell selector baseline, proof
profiles, mobile/dark requirements, dual-coding absorption, and product
boundaries.

This sprint proves standard coverage only. It does not ingest exams or
textbooks, reconstruct official sources, transform tasks, change generated
lesson output, mutate protected references, change runtime CSS/UI, adopt a
product route, claim target-equivalent proof, or authorize PV, diagnostics,
mastery/sequencing, Scale Gate, or student/product use.

## Acceptance test results

Passed commands are recorded in
`reports/sprints/CONTEXT-VISUAL-STD-1-command-log.jsonl` and summarized in
`references/data/sprints/CONTEXT-VISUAL-STD-1.result.json`.

Key proof commands:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/CONTEXT-VISUAL-STD-1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js CONTEXT-VISUAL-STD-1`
- `node build-scripts/sprints/check-context-visual-std1.js`
- `npm.cmd run check:platform`
- `npm.cmd run check:scope-language`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `npm.cmd run agent:index`
- `node build-scripts/sprints/emit-url-index.js`
- `npm.cmd run dashboard:internal`

Final closure commands are run after this result file exists:

- `node build-scripts/sprints/check-lead-review-substance.js CONTEXT-VISUAL-STD-1`
- `node build-scripts/sprints/check-sprint-result.js reports/sprints/CONTEXT-VISUAL-STD-1-result.md`
- `node build-scripts/sprints/check-sprint-bundle.js CONTEXT-VISUAL-STD-1 --complete`
- `node build-scripts/sprints/emit-url-index.js --check`
- `git diff --check`
- `git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check`

## Changed files

Sprint artifacts and checker:

- `reports/sprints/CONTEXT-VISUAL-STD-1-plan.md`
- `reports/sprints/CONTEXT-VISUAL-STD-1-baseline.md`
- `reports/sprints/CONTEXT-VISUAL-STD-1-planning-review.md`
- `reports/sprints/CONTEXT-VISUAL-STD-1-visual-standard.md`
- `reports/json/context-visual-std1-contract.json`
- `build-scripts/sprints/check-context-visual-std1.js`
- `reports/sprints/CONTEXT-VISUAL-STD-1-*`
- `references/data/sprints/CONTEXT-VISUAL-STD-1.plan.json`
- `references/data/sprints/CONTEXT-VISUAL-STD-1.result.json`

Roadmaps, maps, and dashboard:

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- GitHub-facing maps, URL index, and dashboard files refreshed during closure.

## Data integrity notes

No protected reference data under `references/machine/` or
`references/external/` changed. No `source-data/` files changed. No generated
Book 1 lesson output changed. The visual contract and checker explicitly keep
source reconstruction, generated lesson output, protected reference mutation,
source-data mutation, product-route adoption, target-equivalent proof, PV,
diagnostics, mastery/sequencing, Scale Gate, and student/product use
unauthorized.

## Open follow-ups

- `SOURCE-RECONSTRUCT-2-ACTUAL-EXAM`: reconstruct the authorized official exam
  source using this standard, with source maps, semantic tables or
  reconstructed SVG/graph/flow blocks, visual-fidelity notes, and reviewer
  comparison artifacts.
- `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM`: bind reconstructed source context to
  task-family compositions with operation-chain and answer-form traces.
- `DUAL-CODING-STD-1`: only residual task-selection policy remains, if needed;
  the source-context visual-source policy is absorbed here.
- `ENGINE-UNIFY-1`: may implement richer renderers, especially true SVG graph
  rendering, if future source-output parity requires it.

## Rollback instructions

Revert the `CONTEXT-VISUAL-STD-1` sprint artifacts and checker, restore the
roadmap row to open, and rerun the sprint validators. Do not mutate protected
references, source-data, or generated lesson output as a rollback shortcut.
