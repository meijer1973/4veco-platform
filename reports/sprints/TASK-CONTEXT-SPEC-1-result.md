# Sprint TASK-CONTEXT-SPEC-1: Result

Generated: 2026-06-03

## Plan reference

Plan: `reports/sprints/TASK-CONTEXT-SPEC-1-plan.md`

## Summary

Closed PASS after planning review and lead-review round 1/round 2.

This sprint added the shared task-context authoring/interchange contract and
deterministic checker. The contract defines a `contextBundle` with
`contextBlocks` and task `contextRefs`, supports markdown, source excerpts,
tables, reconstructed SVG/figures, graphs, flowcharts, formula blocks, and
info boxes, and carries source authority/provenance from
`EXAM-SOURCE-AUTH-1` for the authorized Zoohee exam item.

The checker proves positive fixture coverage for every block type and rejects
missing alt text or accessibility summaries, missing or unknown refs,
unreferenced context blocks, answer-hint leakage across context/task text,
hint, and feedback fields, raw copied images where reconstruction is required,
inconsistent captions, internal-code exposure, and source-provenance mismatch.

No runtime context rendering, source reconstruction, task transformation,
generated lesson output, protected reference mutation, source-data mutation,
product-route adoption, target-equivalent proof, diagnostics,
mastery/sequencing, PV, Scale Gate 1, or student/product use was authorized.

## Acceptance test results

Passed:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-CONTEXT-SPEC-1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js TASK-CONTEXT-SPEC-1`
- `node build-scripts/sprints/check-task-context-spec1.js`
- `npm.cmd run check:platform`
- `npm.cmd run check:scope-language`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `npm.cmd run agent:index`
- `node build-scripts/sprints/emit-url-index.js`
- `npm.cmd run dashboard:internal`
- `node build-scripts/sprints/check-lead-review-substance.js TASK-CONTEXT-SPEC-1`
- `node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-CONTEXT-SPEC-1-result.md`
- `node build-scripts/sprints/emit-url-index.js --check`
- `git diff --check`
- `git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check`

Expected during development:

- The initial plan validation rejected the quality-floor wording until rendered
  output and proof were stated explicitly.
- The first `check:platform` run failed because the active Python interpreter
  did not have `python-docx`. A temporary ignored workspace venv under `tmp/`
  was created, `python-docx` was installed there, and `check:platform` passed
  with `PYTHON=tmp\task-context-spec1-py\Scripts\python.exe`.
- Lead review round 1 returned REVISE for incomplete SVG provenance
  enforcement and the failed platform-validation record. Both were corrected
  before the final round-2 PASS.

Final closure also runs
`node build-scripts/sprints/check-sprint-bundle.js TASK-CONTEXT-SPEC-1 --complete`
after result metadata and roadmap sync.

## Changed files

Platform repo:

- `build-scripts/sprints/check-task-context-spec1.js`
- `reports/json/task-context-spec1-contract.json`
- `reports/sprints/TASK-CONTEXT-SPEC-1-*`
- `references/data/sprints/TASK-CONTEXT-SPEC-1.plan.json`
- `references/data/sprints/TASK-CONTEXT-SPEC-1.result.json`
- `references/reference-team-roadmap.md`
- `reports/github-agent-index-platform.md`
- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-lessen.md`
- `reports/github-agent-index-lessen.json`
- `reports/url-index.md`
- `reports/internal-dashboard/index.html`
- `reports/internal-dashboard/dashboard-data.json`

Lesson repo:

- `../4veco-lessen/lessen-team-roadmap.md`

## Data integrity notes

No protected reference data changed. No files under `references/machine/` or
`references/external/` were edited.

No source data, generated Book 1 lesson output, target-exercise registry,
candidate storage, PV projection, or PV machine-promotion output changed.

The checker reads `reports/json/exam-source-authority1-contract.json` as
read-only source-authority evidence and does not write any protected reference
surface.

## Open follow-ups

- `TASK-CONTEXT-RUNTIME-1` is the next authorized sprint.
- `CONTEXT-VISUAL-STD-1`, `SOURCE-RECONSTRUCT-2-ACTUAL-EXAM`,
  `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM`,
  `TASK-INGEST-TRANSFORM-3-TEXTBOOK`, and
  `GATE-SHARED-TASK-INGEST-REPAIR-1` remain open.
- The temporary ignored venv under `tmp/task-context-spec1-py` is validation
  support only and is not part of the committed sprint output.

## Rollback instructions

Revert this sprint's contract, checker, sprint artifacts, result JSON, roadmap
closure row, and refreshed index/dashboard outputs. If the lesson roadmap
mirror commit has already been pushed separately, revert it with a normal
follow-up commit in `../4veco-lessen`; do not rewrite history. Do not touch
`references/machine/`, `references/external/`, source data, or generated lesson
output during rollback.
