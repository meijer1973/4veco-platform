# Sprint MTU-H2J: Result

Generated: 2026-05-28

Status: completed.

## Plan reference

Plan: `reports/sprints/MTU-H2J-plan.md`

## Summary

MTU-H2J executed the GATE-MTU-H2I authorized bounded scope:

- updated `A20` through `unit-update.js` to `Winstmaximum oplossen met afgeleide MO en MK`, retaining `A2.11`;
- added `A94` and `A95` through `unit-add.js`;
- applied the exact authored target-exercise mapping changes for `3.2.2` and `4.1.2`;
- verified `3.3.3` remains on the narrowed `A20` route;
- moved current `GEN.A20` behavior to `GEN.A95`;
- left `GEN.A20` and `GEN.A94` without implementations so narrowed `A20` and `A94` remain generator-blocked / not-yet-interactive;
- refreshed generator-readiness, owned-content graph, RAG chunks, and procedure/PV reports only after source mutations.

The execution log records preflight, extracted specs, A20 dry-run, command output,
mapping before/after arrays, and generator route.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/references/check-mtu-h2j-a20-a94-a95-execution.js` | passed |
| `node build-scripts/references/check-mtu-h2i-a20-cli-execution-packet.js` | passed |
| `node build-scripts/references/check-mtu-h2h-a20-cli-mutation-plan.js` | passed |
| `node build-scripts/references/check-mtu-h2g-a20-split-packet.js` | passed |
| `node build-scripts/references/check-mtu-h2e-conditional-lane-execution-packet.js` | passed |
| `node build-scripts/references/check-mtu-h2d-held-conditional-resolution.js` | passed |
| `node build-scripts/references/check-mtu-h2b-cli-execution-gate-packet.js` | passed |
| `node build-scripts/references/check-mtu-h2a-cli-mutation-plan.js` | passed |
| `node build-scripts/references/check-mtu-h2-solo-cases.js` | passed |
| `node build-scripts/references/build-unit-index.js` | passed |
| `node build-scripts/references/validate-core-schemas.js` | passed |
| `node scripts/check-course-target-exercises-v5.js` | passed |
| `node build-scripts/references/build-skilltree-generator-readiness.js` | passed |
| `node build-scripts/references/check-skilltree-generator-readiness.js` | passed |
| `node build-scripts/references/build-owned-content-graph.js` | passed |
| `node build-scripts/references/check-owned-content-graph.js` | passed |
| `node build-scripts/rag/build-chunks.js` | passed |
| `node build-scripts/rag/validate-chunks.js` | passed |
| `node build-scripts/references/build-procedure-visual-inventory.js` | passed |
| `node build-scripts/references/check-procedure-visual-inventory.js` | passed |
| `node build-scripts/references/build-procedure-visual-coverage.js` | passed |
| `node build-scripts/references/check-procedure-visual-coverage.js` | passed |
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H2J-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js MTU-H2J --complete` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `node build-scripts/references/check-source-document-registry.js` | passed |
| `node build-scripts/references/check-source-manifest.js` | passed |
| `node build-scripts/references/check-document-inventory.js` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `npm.cmd test -- --runInBand` | passed |
| `git diff --check` | passed |

## Changed files

Protected machine references changed through the reference CLI:

- `references/machine/micro-teaching-units.md`
- `references/machine/micro-teaching-units.json`

Authored reference and generator source changed in the reviewed coupled lane:

- `references/authored/course-target-exercises.json`
- `engines/skilltree/generators.js`

Execution and sprint records:

- `build-scripts/references/execute-mtu-h2j-a20-a94-a95.js`
- `build-scripts/references/check-mtu-h2j-a20-a94-a95-execution.js`
- `reports/sprints/MTU-H2J-plan.md`
- `reports/sprints/MTU-H2J-baseline.md`
- `reports/sprints/MTU-H2J-execution-log.md`
- `reports/sprints/MTU-H2J-execution-log.json`
- `reports/sprints/MTU-H2J-result.md`
- `reports/sprints/MTU-H2J-diff-summary.md`
- `references/data/sprints/MTU-H2J.plan.json`
- `references/data/sprints/MTU-H2J.result.json`

Lifecycle and projection validators were refreshed where needed:

- `build-scripts/references/check-procedure-visual-inventory.js`
- H2 lifecycle checkers for post-H2J roadmap and registry state

Generated projection reports were refreshed:

- generator-readiness reports and `RX.6` blocked-unit records;
- owned-content graph and coverage report;
- RAG chunk index;
- procedure-visual inventory and coverage reports;
- roadmap, roadmap version index, source registries, URL index, and GitHub indexes.

## Data integrity notes

Protected reference data changed only through reference CLI execution and
generated projections. `references/external/` did not change. Target-exercise
mapping changes were authored-reference mutations with exact before/after
arrays; no target-exercise promotion fields changed.

`A20` is now narrowed to the derived-MO plus derived-MK route. `3.2.2` routes
to `A94`; `4.1.2` routes to `A91`; `3.3.3` remains on `A20`.
`GEN.A95` carries the old given-MO/given-MK-function generator behavior.
`A20` and `A94` are generator-blocked / not-yet-interactive until matching
generators are separately implemented and reviewed.

No candidate storage was created, no candidate writes occurred, no lesson
output was mutated, no PV projection or PV machine promotion occurred, and no
student/product use was authorized. The pre-existing untracked
`knowledge/exit-ticket-game-1.1.1.zip` file remained untouched and uncommitted.

## Open follow-ups

- Proceed to `MTU-H3` incidence/pass-through skill-family review as the next
  reference-team operational lane.
- Implement or separately review `GEN.A20` for the narrowed derive-both route
  before any narrowed `A20` skill-tree exposure.
- Implement or separately review `GEN.A94` before any `A94` skill-tree
  exposure.
- Keep blocked units out of student-facing skill-tree/PV routes until
  generator-readiness validation proves safe exposure.

## Rollback instructions

If this execution must be reverted before commit, restore only the H2J-affected
CLI-generated, authored, generator, and projection diffs from the
pre-execution commit. Do not hand-edit `references/machine/`. If a newly minted
unit must be removed after commit, use a reviewed `unit-deprecate` or revert
lane.
