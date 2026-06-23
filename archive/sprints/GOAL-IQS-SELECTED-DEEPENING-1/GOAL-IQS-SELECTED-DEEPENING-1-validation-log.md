# GOAL-IQS-SELECTED-DEEPENING-1 Validation Log

Status: PASS locally after specialist corrections
Date: 2026-06-22

## Product End-State And Original Sprint/Gate Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-SELECTED-DEEPENING-1/GOAL-IQS-SELECTED-DEEPENING-1-sprint-plan.md`
- Controlling roadmap: `docs/roadmaps/quality-standards/international-quality-standards-roadmap.md`

## Initial Focused Validation

These checks were run after generating the first local packet and before final review/archive refresh:

| Command | Result |
|---|---|
| `node build-scripts/inspection/check-selected-jurisdiction-deepening.js` | PASS: descriptors=2, schema_fixtures=8, crosswalk_rows=20, refusal_cases=30, decision=`PROCEED_TO_INTERNAL_OVERLAY_PROTOTYPE_PLANNING` |
| `npx.cmd jest build-scripts/inspection/check-selected-jurisdiction-deepening.test.js --runInBand` | PASS: 1 suite, 2 tests |
| `git diff --check` | PASS |
| `node build-scripts/reports/validate-report-json.js` | PASS |
| `npm.cmd run check:scope-language` | PASS |
| `node build-scripts/references/check-roadmap-version-index.js` | PASS before roadmap version update |
| `node build-scripts/sprints/emit-url-index.js --check` | PASS |

## Final Validation Matrix

| Command | Result | Blocks |
|---|---|---|
| `node build-scripts/inspection/build-selected-jurisdiction-deepening.js --check` | PASS: selected-jurisdiction deepening output is current | no |
| `node build-scripts/inspection/check-selected-jurisdiction-deepening.js` | PASS: descriptors=2, schema_fixtures=8, crosswalk_rows=20, refusal_cases=31, decision=`PROCEED_TO_INTERNAL_OVERLAY_PROTOTYPE_PLANNING` | no |
| `npx.cmd jest build-scripts/inspection/check-selected-jurisdiction-deepening.test.js --runInBand` | PASS: 1 suite, 2 tests | no |
| `node build-scripts/inspection/check-international-overlay-architecture.js` | PASS: descriptors=4, archetypes=4, crosswalk_rows=10, refusal_cases=31, decision=`PROCEED_TO_SELECTED_JURISDICTION_DEEPENING` | no |
| `node build-scripts/reports/validate-report-json.js` | PASS: 14 report(s) | no |
| `npm.cmd run check:scope-language` | PASS: active surfaces | no |
| `node build-scripts/references/check-roadmap-version-index.js` | PASS: 152 entries | no |
| `node build-scripts/sprints/emit-url-index.js --check` | PASS: `reports/url-index.md` current | no |
| `node build-scripts/ci/check-evidence-line-endings.js` | PASS: scanned 87 text files, CRLF 0 | no |
| `git diff --check` | PASS | no |
| `npm.cmd run check:platform` | PASS after rebase and sibling lesson refresh: 59 suites passed, 822 tests passed, 6 suites/8 tests skipped; existing fixture-warning output only, exit code 0 | no |

## Carried Issues

| Issue | Classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| Future prototype planning authority remains human-gated | does_not_block | false | Current deepening packet review | Human acceptance of this packet before any prototype-planning sprint |
| Local expert validation remains required before local implementation | does_not_block | false | Internal readiness decision only | Later local subject/inspection/legal review gate |
| School-owned evidence remains unavailable | does_not_block | false | Internal report-only readiness comparison | Separate school-owned evidence flow and human approval |
| `npm.cmd ci` reports existing package audit/deprecation warnings | does_not_block | false | Current selected-deepening implementation | Separate dependency-maintenance work; no dependency changes made in this sprint |
| First post-rebase `npm.cmd run check:platform` saw stale sibling lesson output | does_not_block | false | Current selected-deepening implementation | Refreshed sibling `4veco-lessen` detached checkout to `origin/main`; rerun platform check passed |
