# CP.6e Validation Log

Generated: 2026-05-21

## Scope

This log records the concrete validation evidence for the CP.6e failed-clearance bundle.

## Commands Passed

| Command | Status | Key output |
|---|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/CP.6e-plan.md` | passed | `OK sprint plan: reports\sprints\CP.6e-plan.md` |
| `node build-scripts/sprints/check-sprint-bundle.js CP.6e` | passed | `OK sprint bundle: CP.6e planned/active` |
| `node build-scripts/references/build-cp6e-113-part-a-rereview.js` | passed | wrote CP.6e JSON/Markdown evidence artifacts |
| `node build-scripts/review-gates/check-cp6e-113-part-a-rereview.js` | passed | `CP.6e 1.1.3 Part A re-review artifacts validated.` |
| `node scripts/check-book.js --paragraph-mode part-a --paragraph-profile publisher-print "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed | `BOOK HEALTH CHECK PASSED: 26/26 checks passed.` |
| `node scripts/check-course-target-exercises-v5.js` | passed | `OK target exercises v5: total=54, books=1:12, 2:12, 3:14, 4:16` |
| `node build-scripts/references/validate-core-schemas.js` | passed | `OK core schemas: 17 files` |
| `node build-scripts/reports/validate-report-json.js` | passed | `OK report JSON contract: 13 report(s)` |
| `node build-scripts/reports/generate-all.js` | passed | `OK generated 13 JSON-first report(s). Manifest: reports/json/report-manifest.json` |
| `node build-scripts/reports/generate-reference-health.js` | passed | `OK reference health: reports/json/reference-health.json` |
| `node build-scripts/reports/check-reference-health.js` | passed | `OK reference health contract` |
| `npm.cmd run dashboard:internal` | passed | internal dashboard and data written |
| `npm.cmd run agent:index` | passed | platform and lesson GitHub-agent indexes written |
| `node build-scripts/sprints/emit-url-index.js` | passed | `wrote reports/url-index.md` |
| `node build-scripts/sprints/emit-url-index.js --check` | passed | `OK url-index: reports/url-index.md is current` |
| `node build-scripts/references/build-reference-inventory.js` | passed | source manifest and document inventory written |
| `node build-scripts/references/check-roadmap-version-index.js` | passed | roadmap version index valid after transition |
| `node build-scripts/references/check-source-manifest.js` | passed | source manifest valid |
| `node build-scripts/references/check-document-inventory.js` | passed | document inventory valid |
| `node build-scripts/references/build-source-document-registry.js` | passed | source-document registry written |
| `node build-scripts/references/check-source-document-registry.js` | passed | source-document registry valid |
| `node build-scripts/sprints/check-sprint-result.js reports/sprints/CP.6e-result.md` | passed | sprint result valid |
| `node build-scripts/sprints/check-sprint-bundle.js CP.6e --complete` | passed | complete sprint bundle valid |
| `npm.cmd test` | passed | Jest exits 0; 515 passed / 8 skipped |

## Notes

The CP.6e focused validator passes by confirming `failed_clearance`. This is intentional: the live lesson files still introduce figures in the order `1 -> 3 -> 2`, so CP.6e records failed clearance and routes lesson-side remediation.

`npm.cmd test` prints expected validator-fixture warnings/errors for synthetic `9.x` fixtures during the passing test suite.
