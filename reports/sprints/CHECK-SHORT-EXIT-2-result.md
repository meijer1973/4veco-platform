# Sprint CHECK-SHORT-EXIT-2: Result

Generated: 2026-06-05

Verdict: READY FOR HUMAN REVIEW PACKET.

## Plan reference

Plan: `reports/sprints/CHECK-SHORT-EXIT-2-plan.md`

## Summary

`CHECK-SHORT-EXIT-2` implemented the split check-surface route for Book 1
paragraphs `1.1.1`, `1.1.2`, and `1.1.3`.

The implementation now supports separate `Korte check` and `Exit ticket`
surfaces per paragraph, distinct landing-page Check cards, exit-ticket
task-shell context blocks, and shared graph-construction substitute controls
for the `1.1.3` graph/table exit-ticket candidate. New `1.1.1` and `1.1.3`
exit-ticket candidates keep completion language held. The reviewed `1.1.2`
exit-ticket authority is preserved.

The sprint implementation and rendered evidence are ready for the direct
human-review packet. The screenshot blocker was repaired by switching the
capture harness to a Chrome-first Chromium path with file-stability polling;
the refreshed proof records 10 captured screenshots and 0 blocked cases.
During screenshot diagnosis, the `1.1.3` source/table context labels were also
cleaned so each context block renders one visible identifier only. No new
target-equivalent completion language, product-route adoption, diagnostics,
mastery/sequencing, PV, Scale Gate 1, or student/product use is authorized.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/CHECK-SHORT-EXIT-2-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js CHECK-SHORT-EXIT-2` | passed |
| `npx.cmd jest --runInBand engines/tests/exit-ticket-engine.test.js engines/tests/exit-ticket-ui.test.js engines/tests/exit-ticket-metadata-alignment.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/graphical-ui.test.js engines/tests/skilltree-ui.test.js` | passed |
| `node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `npx.cmd jest --runInBand engines/tests/task-shell-ui.test.js` | passed |
| `node build-scripts/sprints/capture-check-short-exit2-screenshots.js` | passed: recorded 10 captured screenshots and 0 blockers |
| `node build-scripts/sprints/check-check-short-exit2.js` | passed |
| `npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `npx.cmd jest --runInBand scripts/tests/build-landing-page.test.js` | passed |
| `npx.cmd jest --runInBand engines/tests/converter-error-exit.test.js` | passed |
| `npm.cmd run check:platform` | passed |
| `npm.cmd run check:scope-language` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |

## Changed files

Platform implementation:

- `build-scripts/platform/build-exit-ticket-shells.js`
- `build-scripts/platform/build-landing-page.js`
- `build-scripts/content/book-1/b1-113-graphical-data.js`
- `build-scripts/lib/convert_samenvatting.py`
- `build-scripts/lib/convert_nieuws.py`
- `engines/exit-ticket-engine.js`
- `engines/exit-ticket-ui.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/graphical-ui.js`
- `engines/skilltree-ui.js`
- focused tests under `engines/tests/` and `scripts/tests/`

Source data:

- `source-data/book-1/exit-ticket/1.1.1-korte-check.json`
- `source-data/book-1/exit-ticket/1.1.1-exit-ticket.json`
- `source-data/book-1/exit-ticket/1.1.2-korte-check.json`
- `source-data/book-1/exit-ticket/1.1.2-exit-ticket.json`
- `source-data/book-1/exit-ticket/1.1.3-korte-check.json`
- `source-data/book-1/exit-ticket/1.1.3-exit-ticket.json`

Sprint evidence:

- `build-scripts/sprints/capture-check-short-exit2-screenshots.js`
- `build-scripts/sprints/check-check-short-exit2.js`
- `reports/json/check-short-exit2-proof.json`
- `reports/sprints/CHECK-SHORT-EXIT-2-screenshot-manifest.md`
- `reports/sprints/CHECK-SHORT-EXIT-2-screenshots/manifest.json`
- `reports/sprints/CHECK-SHORT-EXIT-2-*`
- `references/data/sprints/CHECK-SHORT-EXIT-2.plan.json`
- `references/data/sprints/CHECK-SHORT-EXIT-2.result.json`

Generated lesson output:

- Book 1 generated output under
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`, produced by
  `node scripts/deploy.js`.

## Data integrity notes

No protected reference data changed. `references/machine/` and
`references/external/` remain untouched.

No target-exercise registry field was written. No candidate storage was
created or written. No reasoning CSV was changed. No unit minting, update,
split, or deprecation was executed.

Generated Book 1 output was regenerated through `node scripts/deploy.js`.
No generated lesson output was hand-edited.

## Open follow-ups

- Prepare the `GATE-CHECK-SHORT-EXIT-2-first-three-check-surfaces-review`
  direct human-review packet and publish the packet plus every cited evidence
  artifact before asking for reviewer comments.
- Keep `SCALE-PROOF-3P`, `GATE-PRODUCT-3P`, and Scale Gate 1 blocked.

## Rollback instructions

Before commit, revert only the `CHECK-SHORT-EXIT-2` implementation, source
data, tests, checker/capture script, sprint artifacts, generated maps/indexes,
and deployed Book 1 generated output from this sprint.

Do not revert prior gate closure artifacts, protected references, unrelated
branches/worktrees, target-exercise records, candidate storage, or user files.
