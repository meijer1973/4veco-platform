# Sprint GAME-UX-1: Result

Date: 2026-05-23

Status: completed.

## Plan reference

`reports/sprints/GAME-UX-1-plan.md`

## Summary

GAME-UX-1 implemented the platform shared skill-map runtime support requested
by lesson `L1.7C-0`.

Completed platform changes:

- added `engines/skill-map-engine.js`, a shared request/response view-model
  engine for `compact`, `route`, and restricted `full` display modes;
- exposed MTU `aspects` from the read-only MTU catalog through source
  `base-elements` and deploy-time skill-tree bundle data;
- added scoped skill-map request hooks to reasoning, calculation/procedure, and
  graphical practice engines;
- added exit-ticket checkpoint and landing-preview request support through the
  shared engine;
- changed future generated skill-tree data to carry compact `skillMapDefaults`,
  so `activeSkills: null` remains a full-catalog source but is not the default
  student route;
- adjusted visible skill-tree copy from mastery language to local
  practice-progress language.

No lesson output was generated or deployed.

## Acceptance test results

Passed:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/GAME-UX-1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js GAME-UX-1`
- `npm.cmd test -- --runInBand engines/tests/skill-map-engine.test.js engines/tests/skilltree-visible-copy.test.js engines/tests/skilltree-engine.test.js engines/tests/skilltree-data.test.js`
- `npm.cmd test -- --runInBand engines/tests/reasoning-engine.test.js engines/tests/procedure-engine.test.js engines/tests/graphical-engine.test.js`
- `npm.cmd test -- --runInBand engines/tests/skill-map-engine.test.js engines/tests/skilltree-engine.test.js engines/tests/skilltree-data.test.js engines/tests/reasoning-engine.test.js engines/tests/procedure-engine.test.js engines/tests/graphical-engine.test.js`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/reports/generate-all.js`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/reports/generate-reference-health.js`
- `node build-scripts/reports/check-reference-health.js`
- `npm.cmd run dashboard:internal`
- `npm.cmd run agent:index`
- `node build-scripts/sprints/emit-url-index.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `node build-scripts/references/build-source-document-registry.js`
- `node build-scripts/references/build-reference-inventory.js`
- `node build-scripts/references/check-source-document-registry.js`
- `node build-scripts/references/check-source-manifest.js`
- `node build-scripts/references/check-document-inventory.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `npm.cmd test`

Full Jest result: 32 suites passed, 6 skipped; 535 tests passed, 8 skipped.

Final closure check after result JSON is recorded:

- `node build-scripts/sprints/check-sprint-bundle.js GAME-UX-1 --complete`

## Changed files

Primary implementation surfaces:

- `engines/skill-map-engine.js`
- `engines/skilltree/base-elements.js`
- `engines/skilltree-engine.js`
- `engines/skilltree-ui.js`
- `engines/reasoning-engine.js`
- `engines/procedure-engine.js`
- `engines/graphical-engine.js`
- `scripts/deploy.js`
- `build-scripts/platform/build-skilltree-shells.js`
- `build-scripts/sprints/check-sprint-bundle.js`
- `engines/tests/skill-map-engine.test.js`
- `engines/tests/skilltree-visible-copy.test.js`
- `engines/tests/skilltree-data.test.js`
- `engines/tests/skilltree-engine.test.js`
- `reports/sprints/GAME-UX-1-*`
- `references/data/sprints/GAME-UX-1.plan.json`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.*`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.72-l17c0-skill-map-contract.md`
- generated reports, dashboards, source-document registry, source manifest,
  document inventory, and GitHub agent indexes refreshed through normal scripts

## Data integrity notes

No protected reference data was changed. GAME-UX-1 did not hand-edit
`references/machine/` or `references/external/`, did not mint units, did not
promote target exercises, and did not mutate lesson output. The MTU catalog was
read only to expose existing `aspects` through runtime data.

The unrelated untracked `knowledge/exit-ticket-game-1.1.1.zip` remained
unstaged and untouched.

## Open follow-ups

Lesson L1.7C can inspect the game row against the accepted shared skill-map
contract. If L1.7C needs deployed lesson output changes, that must happen in a
lesson-side authorized sprint, not from this platform sprint.

Mobile, dark-mode, screenshot, and keyboard focus-order checks are deliberately
deferred to lesson L1.7C or the first lesson-side regeneration/inspection sprint
that consumes this platform runtime. GAME-UX-1 changed platform runtime code
and did not deploy or mutate student-facing lesson output.

The exit-ticket prototype remains design evidence only. Importing or shipping
it requires a separate boundary-safe sprint.

## Rollback instructions

Revert the GAME-UX-1 implementation commit. Rollback removes the shared
skill-map engine, request hooks, visible label adjustments, tests, generated
index/report refreshes, sprint logs, and roadmap bookkeeping. Do not hand-edit
`references/machine/`, `references/external/`, lesson output, or the unrelated
`knowledge/exit-ticket-game-1.1.1.zip`.

## Next Action

Proceed to lesson L1.7C game-row quality review using the shared skill-map
contract, while the platform reference roadmap returns to EX-5 as the next
bounded tooling/design sprint.
