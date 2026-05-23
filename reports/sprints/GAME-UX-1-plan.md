# Sprint GAME-UX-1: Shared Skill-Map Engine Architecture

## Goal

Implement the platform side of lesson `L1.7C-0`: one shared skill-map route
engine that can be consumed by the reasoning, calculation/procedure, and
graphical practice surfaces, later exit-ticket compact checkpoint mode, and
landing-page route previews.

The sprint must expose MTU aspects in skill-tree base data; support aspect
filters `reasoning`, `calculation`, `graphical`, and explicit `mixed`; support
display modes `compact`, `route`, and restricted `full`; keep full/all-skill
catalog view out of the default student route; and return a request/response
view model with non-mastery language and product-use boundary flags fixed
false.

GAME-UX-1 does not authorize protected reference mutation, machine-reference
mutation, unit minting, lesson-output mutation, exit-ticket prototype import,
target-exercise promotion, diagnostics, adaptive routing, mastery/sequencing,
student-facing AI, summative use, PV projection, or PV machine promotion.

## Context

Lesson `L1.7C-0` closed the shared skill-map contract and handed platform
implementation to `GAME-UX-1`. The lesson-side contract is in
`../4veco-lessen/archive/sprints/L1.7C-0/L1.7C-0-shared-skill-map-contract.md`;
the current-state audit is in
`../4veco-lessen/archive/sprints/L1.7C-0/L1.7C-0-current-state-audit.md`.

Current platform findings:

- existing skill-tree view modes are `paragraph`, `chapter`, and `module`;
- `module` is effectively the current all-skill catalog;
- generated paragraph skill-tree data can use `activeSkills: null`, which the
  current engine treats as all skills visible;
- MTU records already carry Dutch aspects `verbaal`, `rekenen`, and
  `grafisch`;
- `engines/skilltree/base-elements.js` is the MTU-backed source adapter, but it
  does not yet expose those aspects;
- existing practice engines do not yet share a route-view request/response
  contract.

The current workspace has one unrelated pre-existing untracked file:
`knowledge/exit-ticket-game-1.1.1.zip`. GAME-UX-1 must not stage, edit, move,
import, or delete that file.

## Allowed paths

- `reports/sprints/GAME-UX-1-plan.md`
- `references/data/sprints/GAME-UX-1.plan.json`
- `reports/sprints/GAME-UX-1-baseline.md`
- `reports/sprints/GAME-UX-1-planning-review.md`
- `engines/skill-map-engine.js`
- `engines/skilltree/base-elements.js`
- `engines/skilltree-engine.js`
- `engines/skilltree-ui.js`
- `scripts/deploy.js`
- `build-scripts/platform/build-skilltree-shells.js`
- `build-scripts/sprints/check-sprint-bundle.js`
- focused tests under `engines/tests/`
- `reports/sprints/GAME-UX-1-result.md`
- `reports/sprints/GAME-UX-1-diff-summary.md`
- `reports/sprints/GAME-UX-1-lead-review-assignment.md`
- `reports/sprints/GAME-UX-1-lead-review-round1.md`
- `reports/sprints/GAME-UX-1-lead-review-corrections.md`
- `reports/sprints/GAME-UX-1-lead-review-round2.md`
- `references/data/sprints/GAME-UX-1.result.json`
- generated reports, maps, inventories, source-document registry, GitHub-agent
  indexes, and URL indexes refreshed through normal scripts
- `references/reference-team-roadmap.md` for sprint bookkeeping after
  completion
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.72-l17c0-skill-map-contract.md`

## Forbidden paths

- hand edits to `../4veco-lessen/`
- generated lesson-output mutation or deploy output mutation
- import, staging, or modification of `knowledge/exit-ticket-game-1.1.1.zip`
- hand edits to `references/machine/`
- hand edits to `references/external/`
- unit minting or machine registry mutation
- protected reference mutation
- direct target-exercise promotion or placeholder finalization
- CP-6 closure or Year-1 closure
- diagnostics
- adaptive routing
- mastery decisions
- automatic sequencing
- student-facing AI
- summative use
- PV projection or PV machine promotion
- student-facing product-use claim

## Inputs

- `../4veco-lessen/archive/sprints/L1.7C-0/L1.7C-0-shared-skill-map-contract.md`
- `../4veco-lessen/archive/sprints/L1.7C-0/L1.7C-0-current-state-audit.md`
- `references/reference-team-roadmap.md`
- `engines/skilltree/base-elements.js`
- `engines/skilltree-engine.js`
- `engines/reasoning-engine.js`
- `engines/procedure-engine.js`
- `engines/graphical-engine.js`
- `build-scripts/platform/build-skilltree-shells.js`
- `scripts/deploy.js`
- `references/machine/micro-teaching-units.json` as read-only input only

## Outputs

- A sprint bundle under `reports/sprints/`: plan, baseline, planning review,
  result, diff summary, lead-review assignment, round-1 lead-review log,
  correction log, round-2 recheck log, plus metadata under
  `references/data/sprints/`.
- A shared `engines/skill-map-engine.js` that exposes request/response view
  models for compact, route, and restricted full display modes.
- Skill-tree base data and deploy bundle data that expose MTU aspects without
  editing `references/machine/`.
- Existing skill-tree engine integration that delegates shared route view
  generation to the shared skill-map engine while preserving legacy exercise
  behavior.
- Focused Jest tests for aspect filtering, compact mode, route mode, full-view
  restrictions, product-boundary flags, and consumer requests from reasoning,
  calculation/procedure, graphical, exit-ticket checkpoint, and landing preview
  surfaces.

Generated output statement: GAME-UX-1 generates platform code, platform tests,
internal sprint logs, maps, and indexes only. It generates no student-facing
lesson output and does not deploy to `../4veco-lessen/`.

## Operationalized sprint procedure

1. Record this plan, plan JSON, baseline, and planning-review log. Stop if the
   plan lacks a generated-output statement or if the unrelated exit-ticket zip
   would need to be staged.
2. Read the lesson L1.7C-0 contract and current platform skill-tree/generator
   architecture. Stop if implementation would require lesson-output mutation or
   machine-reference edits.
3. Add the shared skill-map engine as a platform runtime module. It must accept
   a request object, normalize aspect filters, coerce product-use boundary flags
   to false, and return a view model with `visibleSkills`, collapsed counts,
   primary action, recommendation, and full-view availability.
4. Expose MTU aspects through source base-elements and deploy bundle data. Stop
   if this requires hand editing `references/machine/`.
5. Integrate the existing skill-tree engine with the shared view-model API while
   preserving legacy `paragraph`, `chapter`, and explicit `module` behavior.
   Default student route calls must not show an unfiltered full catalog.
6. Add focused tests for aspect filtering, compact mode, route mode,
   restricted full mode, consumer request shape, boundary flags, and deploy
   bundle aspect parity.
7. Run the acceptance tests. Stop if any test fails or if generated indexes
   would include untracked prototype content.
8. Assign the completed bundle to lead review, record round 1, record a
   correction pass, run one recheck, and stop if the final recheck is not
   `PASS` or `PASS WITH FLAGS`.
9. Update roadmap/version-index bookkeeping, rerun complete-bundle validation,
   fetch/prune remote, commit, tag, and push.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/GAME-UX-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js GAME-UX-1
npm.cmd test -- --runInBand engines/tests/skill-map-engine.test.js engines/tests/skilltree-visible-copy.test.js engines/tests/skilltree-engine.test.js engines/tests/skilltree-data.test.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run dashboard:internal
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-source-document-registry.js
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd test
node build-scripts/sprints/check-sprint-bundle.js GAME-UX-1 --complete
```

## Rollback plan

Revert the GAME-UX-1 implementation commit. Rollback removes the shared
skill-map engine, focused tests, sprint logs, and roadmap/index bookkeeping
only. It does not touch lesson output, the untracked exit-ticket prototype zip,
`references/machine/`, or `references/external/`.

## Human review required

No separate human-review gate is required for GAME-UX-1 because it implements
the already-closed lesson `L1.7C-0` platform handoff and does not authorize
product use. Lead review is required before closure. Any request to import the
exit-ticket prototype, mutate lesson output, make adaptive/mastery claims, or
use the shared route for student diagnostics must stop and go through a later
explicit human gate.
