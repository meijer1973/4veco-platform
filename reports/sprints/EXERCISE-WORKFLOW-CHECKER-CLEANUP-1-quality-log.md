# Sprint EXERCISE-WORKFLOW-CHECKER-CLEANUP-1: Quality Log

Generated: 2026-06-29

## Quality checks

| Check | Result | Evidence |
|---|---|---|
| Plan validation | passed | `node build-scripts/sprints/check-sprint-plan.js reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-plan.md` |
| Planned bundle validation | passed | `node build-scripts/sprints/check-sprint-bundle.js EXERCISE-WORKFLOW-CHECKER-CLEANUP-1` |
| Stale-path sweep | passed | `node build-scripts/sprints/check-exercise-workflow-checker-cleanup.js` |
| Focused exercise workflow checks | passed | Command-log entries for standard, task-shell, L1.7B-Q2, short/exit inventory, route-output, and gate-packet checks |
| Report/index hygiene | passed | Report JSON, roadmap index, URL index, scope-language |
| Full platform test suite | passed | `npm.cmd run check:platform` |
| Platform diff hygiene | passed | `git diff --check` |
| Lesson diff hygiene | passed | `git -C ../4veco-lessen diff --check` |

## Implementation notes

- The first full platform run failed because local `node_modules` did not
  contain declared dependencies `jsdom` and `jszip`.
- `npm.cmd ci` restored dependencies from `package-lock.json`; package files
  were not edited.
- The first command-log attempt exposed a Windows shell quoting issue for a
  lesson path with spaces. The plan now uses the route checkers' default lesson
  path, which points to the same Book 1 generated output.
- `git diff --check` initially caught mechanical line-ending/trailing-space
  drift in changed text files. The changed JS/JSON/Markdown files were
  normalized before final validation.

## Boundary checks

- Source-data files were read only.
- Generated lesson files were read only.
- Engine implementation files were not changed.
- Protected reference data was not changed.
- No product authority or student-use claim was added.

## Follow-up log

- Reusable DOCX template dependency cleanup remains outside this sprint.
- Historical records may still mention old unsuffixed files as archive prose;
  active evidence and live checkers now use current split paths.
