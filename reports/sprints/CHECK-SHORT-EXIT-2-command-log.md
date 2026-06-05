# CHECK-SHORT-EXIT-2 Command Log

Generated: 2026-06-05

The command log records implementation, deployment, validation, and evidence
capture attempts for `CHECK-SHORT-EXIT-2`.

## Passed Commands

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/CHECK-SHORT-EXIT-2-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js CHECK-SHORT-EXIT-2`
- `npx.cmd jest --runInBand engines/tests/exit-ticket-engine.test.js engines/tests/exit-ticket-ui.test.js engines/tests/exit-ticket-metadata-alignment.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/graphical-ui.test.js engines/tests/skilltree-ui.test.js`
- `node build-scripts/content/book-1/b1-113-graphical-data.js`
- `node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"`
- `npx.cmd jest --runInBand engines/tests/task-shell-ui.test.js`
- `node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` after context-label cleanup
- `node build-scripts/sprints/capture-check-short-exit2-screenshots.js`
- `node build-scripts/sprints/check-check-short-exit2.js`
- `npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"`
- `node build-scripts/sprints/check-sprint-result.js reports/sprints/CHECK-SHORT-EXIT-2-result.md`
- `node build-scripts/sprints/check-lead-review-substance.js CHECK-SHORT-EXIT-2`
- `node build-scripts/sprints/check-sprint-bundle.js CHECK-SHORT-EXIT-2`
- `npx.cmd jest --runInBand scripts/tests/build-landing-page.test.js`
- `npx.cmd jest --runInBand engines/tests/converter-error-exit.test.js`
- `npm.cmd run check:platform`
- `npm.cmd run check:scope-language`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `git diff --check`
- `git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ..\4veco-lessen diff --check`

## Evidence Repair

The initial `node build-scripts/sprints/capture-check-short-exit2-screenshots.js`
run exited successfully as an evidence recorder, but the proof recorded
`screenshot_capture_blocked: true`. The problem was the capture harness rather
than the rendered pages: direct Chrome smoke tests wrote PNGs after the script
had already decided the file was missing.

The capture harness now uses a Chrome-first Chromium executable search, simpler
headless flags, a longer timeout, and a post-process file-stability poll. The
refreshed run captured all 10 required screenshots with 0 blockers, and the
proof now records `screenshot_capture_blocked: false`.

During screenshot diagnosis, the in-app browser confirmed a visible duplicate
context-label issue on the `1.1.3` exit-ticket surface. The renderer now emits
one visible identifier per context block, for example
`Bron 1 - IJskraam op het strand` and
`Tabel 1 - Prijs en verkochte ijsjes`; the checker fails if those identifiers
repeat inside the rendered source/table block.
