# CHECKSURFACE-113-EXEMPLAR-EXIT-1 Command Log

Generated: 2026-06-07

## Commands

| Command | Result |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/CHECKSURFACE-113-EXEMPLAR-EXIT-1-plan.md` | PASS |
| `node build-scripts/sprints/check-sprint-bundle.js CHECKSURFACE-113-EXEMPLAR-EXIT-1` | PASS |
| `node -e "const data=require('./source-data/book-1/exit-ticket/1.1.3-exit-ticket.json'); const E=require('./engines/exit-ticket-engine'); E.validateData(data)"` | PASS |
| `node -e "const E=require('./engines/task-shell-engine'); console.log(E.cleanNumber('-50%'), E.cleanNumber('-50 procent'), E.cleanNumber('50% daling'), E.cleanNumber('Q daalt met 50 procent'))"` | PASS: `-50 -50 -50 -50` |
| `npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-engine.test.js engines/tests/exit-ticket-ui.test.js engines/tests/exit-ticket-metadata-alignment.test.js` | PASS: 5 suites, 97 tests |
| `git fetch --prune origin` in `../4veco-lessen` | PASS |
| `git switch -c codex/task-improvement origin/main` in `../4veco-lessen` | PASS |
| `node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | PASS: deploy, link checker, data tests |
| `node build-scripts/sprints/check-checksurface-113-exemplar-exit1.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | PASS |
| `node build-scripts/sprints/check-checksurface-policy-regression1.js` | PASS |
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/CHECKSURFACE-113-EXEMPLAR-EXIT-1-plan.md` | PASS |
| `node build-scripts/sprints/check-sprint-bundle.js CHECKSURFACE-113-EXEMPLAR-EXIT-1` | PASS |
| `npm.cmd run check:platform` | PASS: exit code 0; 47 suites passed, 6 skipped, 729 tests passed, 8 skipped; known fixture warnings printed |
| `npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"` | PASS: 26/26 checks |
| Browser verification via local `127.0.0.1:8173` static server | PASS: observed graph workspace, 4 interval options, magnetic snapping, formula builder, no formula context |

## Notes

- `npx` was rerun as `npx.cmd` because Windows PowerShell blocks `npx.ps1` under the current execution policy.
- Specialist human reviews were not performed. Review placeholders remain `PENDING_REVIEW`.
- Direct `file://` browser navigation was blocked by policy; local static serving was used and stopped after verification.
