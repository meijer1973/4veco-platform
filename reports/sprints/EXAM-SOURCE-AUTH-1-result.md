# Sprint EXAM-SOURCE-AUTH-1: Result

Generated: 2026-06-03

## Plan reference

Plan: `reports/sprints/EXAM-SOURCE-AUTH-1-plan.md`

## Summary

Closed PASS WITH FLAGS after planning review and lead-review round 1/round 2.

This sprint added an authority contract and deterministic checker for
`vw-1022-a-25-1-o:opgave-1:question-3`. The contract requires
`sourceAuthority.kind: external_primary`, official exam item ID, overlay path,
prompt PDF, correction PDF, source material ID, table-only source-material
matching, Zoohee table value matching, answer-model references, EUR 649
threshold evidence, exact forbidden-term rejection, and full boundary flags set
to false.

No source reconstruction, task-shell context rendering, task transformation,
generated lesson output, protected reference mutation, source-data mutation,
product-route adoption, target-equivalent proof, diagnostics,
mastery/sequencing, PV, Scale Gate 1, or student/product use was authorized.

## Acceptance test results

Passed:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/EXAM-SOURCE-AUTH-1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js EXAM-SOURCE-AUTH-1`
- `node build-scripts/sprints/check-exam-source-authority1.js`
- `npm.cmd run check:platform`
- `npm.cmd run check:scope-language`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `npm.cmd run agent:index`
- `node build-scripts/sprints/emit-url-index.js`
- `npm.cmd run dashboard:internal`
- `node build-scripts/sprints/check-lead-review-substance.js EXAM-SOURCE-AUTH-1`
- `node build-scripts/sprints/check-sprint-result.js reports/sprints/EXAM-SOURCE-AUTH-1-result.md`
- `node build-scripts/sprints/emit-url-index.js --check`
- `git diff --check`
- `git -C ../4veco-lessen diff --check`

Expected during development:

- Scope-language initially rejected restricted wording in the plan; wording was
  corrected.
- Round 1 returned REVISE for negative fixtures that did not prove exact
  forbidden-term rejection and for incomplete boundary-key enforcement. Both
  were corrected before round 2.

## Changed files

Platform repo:

- `build-scripts/sprints/check-exam-source-authority1.js`
- `reports/json/exam-source-authority1-contract.json`
- `reports/sprints/EXAM-SOURCE-AUTH-1-*`
- `references/data/sprints/EXAM-SOURCE-AUTH-1.plan.json`
- `references/data/sprints/EXAM-SOURCE-AUTH-1.result.json`
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

The checker reads `references/data/exam-ingestion/exam-item-overlays.json`,
`references/external/exam-questions.json`, and the two official PDFs as
read-only inputs.

## Open follow-ups

- `TASK-CONTEXT-SPEC-1` is the next authorized sprint.
- `TASK-CONTEXT-RUNTIME-1`, `CONTEXT-VISUAL-STD-1`,
  `SOURCE-RECONSTRUCT-2-ACTUAL-EXAM`,
  `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM`,
  `TASK-INGEST-TRANSFORM-3-TEXTBOOK`, and
  `GATE-SHARED-TASK-INGEST-REPAIR-1` remain open.
- Lead-review flag: closure commands, commit, and push were pending at round 2.

## Rollback instructions

Revert this sprint's contract, checker, sprint artifacts, result JSON, roadmap
closure row, and refreshed index/dashboard outputs. If the lesson roadmap
mirror commit has already been pushed separately, revert it with a normal
follow-up commit in `../4veco-lessen`; do not rewrite history. Do not touch
`references/machine/`, `references/external/`, source data, or generated lesson
output during rollback.
