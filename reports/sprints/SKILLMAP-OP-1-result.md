# Sprint SKILLMAP-OP-1: Result

Generated: 2026-05-31

Status: completed.

## Plan reference

Plan: `reports/sprints/SKILLMAP-OP-1-plan.md`

## Summary

SKILLMAP-OP-1 completed the student-visible skill-map route sprint. The
platform now exposes a separate `ROUTE_SKILLS` display catalog so conceptual
MTUs such as schaarste can appear in route panels without becoming runnable
skill-tree exercises. Book 1 route scopes now drive reasoning, calculation,
graph/table, and checkpoint route previews for `1.1.1`, `1.1.2`, and `1.1.3`.

Controlled Book 1 output was regenerated through `scripts/deploy.js`. The live
route panels now show paragraph target, recommended focus, local progress, and
practice action without visible MTU IDs. This closes route visibility only.
The next operational action is `GRAPH-UX-2`.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/SKILLMAP-OP-1-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js SKILLMAP-OP-1` | passed |
| `node .\node_modules\jest\bin\jest.js --testPathPatterns "engines/tests/(skill-map-engine\|skill-map-route-ui\|skilltree-engine)\.test\.js"` | passed |
| `npm.cmd run check:platform` | passed |
| `node scripts\deploy.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `node build-scripts\sprints\check-skillmap-op1-route-output.js "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `Browser DOM inspection for six desktop/mobile route cases` | passed |
| `node build-scripts\sprints\capture-skillmap-op1-screenshots.js` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js SKILLMAP-OP-1 --complete` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `npm.cmd run check:scope-language` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `Get-ChildItem reports/sprints/SKILLMAP-OP-1-screenshots -File \| Measure-Object` | passed |
| `git diff --name-only -- references/machine references/external references/authored/course-target-exercises.json references/data/exam-ingestion/answer-skill-candidates.json` | passed |
| `git diff --check` | passed |
| `git -C ../4veco-lessen diff --check` | passed |

## Changed files

Platform route runtime and generators:

- `engines/skill-map-engine.js`
- `engines/skill-map-route-ui.js`
- `engines/skill-map-route.css`
- `engines/skilltree/base-elements.js`
- `engines/skilltree-ui.js`
- `engines/skilltree.css`
- `engines/reasoning-ui.js`
- `engines/graphical-ui.js`
- `engines/procedure-ui.js`
- `build-scripts/platform/build-skilltree-shells.js`

Tests and sprint checks:

- `engines/tests/skill-map-engine.test.js`
- `engines/tests/skill-map-route-ui.test.js`
- `build-scripts/sprints/check-skillmap-op1-route-output.js`
- `build-scripts/sprints/capture-skillmap-op1-screenshots.js`

Sprint evidence:

- `reports/sprints/SKILLMAP-OP-1-plan.md`
- `reports/sprints/SKILLMAP-OP-1-baseline.md`
- `reports/sprints/SKILLMAP-OP-1-planning-review.md`
- `reports/sprints/SKILLMAP-OP-1-student-route-proof.md`
- `reports/sprints/SKILLMAP-OP-1-screenshot-manifest.md`
- `reports/sprints/SKILLMAP-OP-1-result.md`
- `reports/sprints/SKILLMAP-OP-1-diff-summary.md`
- `reports/sprints/SKILLMAP-OP-1-screenshots/*.png`
- `references/data/sprints/SKILLMAP-OP-1.plan.json`
- `references/data/sprints/SKILLMAP-OP-1.result.json`

Roadmaps and indexes:

- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v3.21-engine-op1-operational-proof-audit.md`
- generated repository maps and URL indexes after final refresh

Lesson-side source configuration and generated output:

- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/deploy-config.json`
- generated automated Book 1 route output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/archive/sprints/SKILLMAP-OP-1/*`

## Data integrity notes

No protected reference data changed. `references/machine/` and
`references/external/` were not edited by hand or by mutation script.
`references/authored/course-target-exercises.json` did not receive
`question_type`, `answer_form`, or mapping fields.

No `references/data/exam-ingestion/answer-skill-candidates.json` file was
created, and no candidate writes occurred. No `source-data/book-*/exit-ticket/`
files changed. Generated Book 1 output changed only through the platform
deploy/build command. No target-equivalent proof, diagnostics, adaptive
routing, mastery/sequencing, student-facing AI, summative use, PV projection,
PV machine promotion, Scale Gate 1, or student/product use was authorized.

The pre-existing untracked `knowledge/exit-ticket-game-1.1.1.zip` file remained
untouched and uncommitted.

## Open follow-ups

- Proceed to `GRAPH-UX-2` to integrate the shared task shell into graph/table
  practice and checkpoint-style graph/table tasks.
- Keep `MATH-UX-2` and `REASON-UX-2` as separate follow-ups after graph route
  integration proves the task shell in generated output.
- Keep `L1.7B-Q2` and `GATE-L1.7B-Q2` blocked until target-equivalent
  checkpoint proof exists for a complete operation and answer-form chain.
- Keep `GATE-ENGINE-1` and Scale Gate 1 blocked until graph/math/reasoning and
  checkpoint routes operate as one coherent live student route.

## Rollback instructions

If SKILLMAP-OP-1 must be reverted, roll back the route runtime/generator
changes, Book 1 deploy-manifest route scopes, generated automated output from
the matching deploy, sprint evidence, screenshots, roadmap/archive records,
and generated maps/indexes. Do not hand-edit `references/machine/`,
`references/external/`, target-exercise mappings, answer-skill candidate
storage, or generated lesson output as part of rollback.
