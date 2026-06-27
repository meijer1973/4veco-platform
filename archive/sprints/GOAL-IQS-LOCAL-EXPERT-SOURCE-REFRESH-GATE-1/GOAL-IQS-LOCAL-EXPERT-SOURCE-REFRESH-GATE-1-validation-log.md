# GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1 Validation Log

Status: validated_for_human_review

Validation run:

| Command | Result |
| --- | --- |
| `node build-scripts/inspection/build-local-expert-source-refresh-gate.js --check` | PASS |
| `node build-scripts/inspection/check-local-expert-source-refresh-gate.js` | PASS |
| `npx.cmd jest build-scripts/inspection/check-local-expert-source-refresh-gate.test.js --runInBand` | PASS |
| `node build-scripts/references/check-roadmap-version-index.js` | PASS |
| `npm.cmd run check:scope-language` | PASS |
| `npm.cmd run check:active-governance-wording` | PASS |
| `node build-scripts/reports/validate-report-json.js` | PASS |
| `git diff --check origin/main..HEAD` | PASS |
| `npm.cmd run check:platform` | PASS after `npm.cmd ci` installed locked dependencies |

Generated report groups: 5
Negative fixtures: 19
Simulation cases: 16
