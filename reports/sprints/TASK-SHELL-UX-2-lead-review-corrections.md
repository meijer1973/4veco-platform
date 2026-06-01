# TASK-SHELL-UX-2 Lead Review Corrections

Generated: 2026-06-01

Sprint: `TASK-SHELL-UX-2`

Round 1 verdict: REVISE.

Round 2 status: ready for recheck after corrections.

## Round 1 Findings

The lead reviewer found two blockers:

1. The rendered `1.1.2` target-equivalent exit ticket still exposed
   answer-revealing placeholders before attempt, including `Bijvoorbeeld 15`,
   `Bijvoorbeeld 108`, `Bijvoorbeeld 3,7`, and
   `Bijvoorbeeld 4 indexpunten`.
2. `reports/sprints/TASK-SHELL-UX-2-screenshots/manifest.json` recorded empty
   `proof` objects for the screenshot cases.

## Corrections Applied

| Finding | Correction | Evidence |
|---|---|---|
| Answer-revealing placeholders visible in exit-ticket rendering | `engines/exit-ticket-ui.js` now renders exit-ticket task-shell display copies with neutral placeholders: `Schrijf hier je uitwerking.`, `Vul je eindantwoord in`, `Vul de notatie in`, and `Vul je antwoord in`. Source placeholders remain in `source-data/book-1/exit-ticket/1.1.2.json` for authoring/review only. | `engines/tests/exit-ticket-ui.test.js`, `build-scripts/sprints/check-task-shell-ux2.js`, refreshed screenshots |
| Tests did not catch placeholder leak | Added focused assertions that rendered 1.1.2 exit-ticket HTML does not contain `Bijvoorbeeld 15`, `Bijvoorbeeld 108`, `Bijvoorbeeld 3,7`, or `Bijvoorbeeld 4 indexpunten`, and that neutral placeholders are present. | `engines/tests/exit-ticket-ui.test.js` |
| Checker did not catch placeholder leak | `check-task-shell-ux2.js` now renders the exit-ticket UI through `ExitTicketUI.renderStaticHtml` and fails on answer-revealing placeholders or pre-attempt criteria. | `build-scripts/sprints/check-task-shell-ux2.js` |
| Screenshot manifest proof objects empty | `capture-task-shell-ux2-screenshots.js` now records non-empty machine-readable proof fields for every screenshot case, including viewport, theme, expected task-shell state, exit-ticket hint/criteria/placeholder boundaries, and proof source. | `reports/sprints/TASK-SHELL-UX-2-screenshots/manifest.json` |
| Contract did not explicitly name placeholder boundary | UI contract and screenshot manifest now record that exit-ticket placeholders must be neutral and must not reveal answer examples. | `reports/sprints/TASK-SHELL-UX-2-ui-contract.md`, `reports/sprints/TASK-SHELL-UX-2-screenshot-manifest.md`, `reports/json/task-shell-ux2-proof.json` |

## Validation After Correction

Passed after corrections:

```bash
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-engine.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js engines/tests/reasoning-ui.test.js
node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/capture-task-shell-ux2-screenshots.js
node build-scripts/sprints/check-task-shell-ux2.js
```

Deploy regenerated the affected Book 1 shared runtime and exit-ticket data
through the platform pipeline. No generated lesson output was hand-edited.

## Remaining Boundaries

- `1.1.1` remains advisory/local only.
- `1.1.3` target-equivalent exit-ticket source remains absent.
- No protected references, target-exercise registry fields, candidate storage,
  candidate writes, PV, CP-6/Year-1 promotion, Scale Gate 1, or product-wide
  use are authorized.

## Round 2 Request

Lead reviewer should recheck the corrected implementation, regenerated output,
screenshot proof, and validators before sprint closure.
