# CHECK-SURFACE-PREGATE-1 Command Log

Generated: 2026-06-05

## Commands And Inspections

| Step | Command / inspection | Result |
|---|---|---|
| 1 | `git status --short --branch` in platform repo | clean on `codex/check-short-exit-2` |
| 2 | `git status --short --branch` in lesson repo | clean on `main` |
| 3 | `Get-ChildItem reports/sprints -Filter CHECK-SURFACE-PREGATE-1*` | no prior pregate artifacts |
| 4 | `Get-Content reports/sprints/VISUAL-QA-HARDEN-2-product-qa-report.md` | pregate must perform student-experience judgement |
| 5 | `Get-Content reports/json/visual-qa-harden2-proof.json` | hard-fail checks pass and reset findings are guarded |
| 6 | `Get-Content reports/json/graph-check-ux1-proof.json` | short-check graph/table proof exists |
| 7 | `Get-Content reports/json/graph-exit-ux1-proof.json` | exit-ticket source/task proof exists |
| 8 | `Get-Content reports/json/check-route-copy1-proof.json` | route-copy proof exists |
| 9 | screenshot inspection: `CHECK-ROUTE-COPY-1-screenshots/desktop-113-check.png` | route cards are distinct and readable |
| 10 | screenshot inspection: `GRAPH-CHECK-UX-1-screenshots/desktop-initial.png` and `desktop-route-advice.png` | short check uses graph/table action and route advice |
| 11 | screenshot inspection: `GRAPH-EXIT-UX-1-screenshots/desktop-initial.png`, `desktop-source-scrolled.png`, `desktop-line-confirmed.png` | exit ticket uses readable source/task graph workspace |
| 12 | screenshot inspection: mobile dark short-check and exit-ticket screenshots | mobile/dark states are reviewable |
| 13 | `node build-scripts\sprints\emit-check-surface-pregate1-proof.js` | passed; proof and readiness report emitted |
| 14 | `node build-scripts\sprints\check-check-surface-pregate1.js` | passed |
| 15 | `node build-scripts\sprints\check-visual-qa-harden2.js` | passed |
| 16 | `node build-scripts\sprints\check-graph-check-ux1.js` | passed |
| 17 | `node build-scripts\sprints\check-graph-exit-ux1.js` | passed |
| 18 | `node build-scripts\sprints\check-check-route-copy1.js` | passed |
| 19 | `node build-scripts\sprints\check-check-short-exit2.js` | passed |
| 20 | `node build-scripts\reports\validate-report-json.js` | passed |
| 21 | `node build-scripts\references\check-roadmap-version-index.js` | passed |
| 22 | `npm.cmd run check:scope-language` | passed |
| 23 | `npm.cmd run check:platform` | passed; printed known fixture warnings |
| 24 | `npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"` | passed 26/26 |
| 25 | `npm.cmd run agent:index` | refreshed GitHub-facing maps |
| 26 | `node build-scripts\sprints\emit-url-index.js` | refreshed URL index |
| 27 | `npm.cmd run dashboard:internal` | refreshed internal dashboard |
| 28 | post-refresh lightweight validators | passed |

## Final Validation

Final validation commands and results are recorded in
`CHECK-SURFACE-PREGATE-1-result.md`.
