# AGENTS-MD-ENTRYPOINT-CLEANUP-1 Implementation Correction Log

## Round 1 Corrections

- Added platform `RESEARCH_AGENT_PROMPT.md` and lesson
  `../4veco-lessen/RESEARCH_AGENT_PROMPT.md` to the active governance wording
  checker roots.
- Added a regression proving stale `CLAUDE.md`/`.claude/commands` guidance in
  research prompt files fails the checker.
- Replaced the single-file PPTX mirror guard with a retired-directory guard for
  any present or tracked file under `.claude/commands`.
- Added Jest coverage for a non-PPTX retired command file and for a tracked
  retired command file.
- Made the plan's generated-index active-surface sweep PowerShell-safe by
  listing the generated index filenames explicitly.
- Excluded the retired-directory guard and its test fixtures from the active
  wording scanner so the scanner does not flag its own intentional negative
  examples.

## Revalidation

- `npm.cmd run check:active-governance-wording`: PASS
- `npx.cmd jest build-scripts/review-gates/check-active-governance-wording.test.js build-scripts/sprints/check-pptx-skill-mirror.test.js --runInBand`: PASS
- `npm.cmd run check:pr-readiness`: PASS, 92 tests
- `npm.cmd run check:pptx-skill-mirror`: PASS
- `node build-scripts/sprints/emit-url-index.js --check`: PASS
- `git diff --check`: PASS in both repositories
