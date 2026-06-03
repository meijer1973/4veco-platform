# Sprint SPRINT-PROTOCOL-HARDEN-2: Result

Generated: 2026-06-03

## Plan reference

Plan: `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-plan.md`

Plan JSON: `references/data/sprints/SPRINT-PROTOCOL-HARDEN-2.plan.json`

## Summary

Closed the sprint protocol evidence hardening sprint.

Implemented:

- `build-scripts/sprints/run-sprint-command.js`, a wrapper that records JSONL
  and markdown command evidence;
- `build-scripts/sprints/check-sprint-command-log.js`, validating command-log
  schema and passed-command evidence;
- `build-scripts/sprints/check-lead-review-substance.js`, requiring lead
  reviews to cite real implementation/proof artifacts and command evidence;
- `build-scripts/sprints/check-batch-sprint-closure.js`, blocking unwaived
  multi-sprint closure and human-gate batching;
- `build-scripts/sprints/check-sprint-protocol-harden2.js`, deterministic
  negative fixtures for the new protocol rules;
- result/bundle validator integration for command-log enforcement on sprints
  created on or after 2026-06-03.

Round-1 lead review returned REVISE. The correction pass added direct result
and complete-bundle negative fixtures, tightened lead-review artifact
existence checks, and narrowed the currently-running-command skip so env
spoofing does not satisfy command evidence. Round-2 lead review passed.

No generated lesson output, source exercise data, protected references,
target-exercise registry records, candidate storage, PV outputs, or student
product surfaces were changed.

## Acceptance test results

Passed through `run-sprint-command.js`:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/SPRINT-PROTOCOL-HARDEN-2-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js SPRINT-PROTOCOL-HARDEN-2`
- `node build-scripts/sprints/check-sprint-command-log.js SPRINT-PROTOCOL-HARDEN-2`
- `node build-scripts/sprints/check-batch-sprint-closure.js --working-tree`
- `node build-scripts/sprints/check-sprint-protocol-harden2.js`
- `npm.cmd run check:platform`
- `npm.cmd run check:scope-language`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `npm.cmd run agent:index`
- `node build-scripts/sprints/emit-url-index.js`
- `npm.cmd run dashboard:internal`
- `node build-scripts/sprints/check-lead-review-substance.js SPRINT-PROTOCOL-HARDEN-2`

The command log also records the deliberately failed pre-correction fixture
run and the failed lead-review-substance run caused by a prose placeholder
path in the round-1 report; both were corrected and rerun successfully.

## Changed files

Implemented or changed:

- `build-scripts/sprints/run-sprint-command.js`
- `build-scripts/sprints/check-sprint-command-log.js`
- `build-scripts/sprints/check-lead-review-substance.js`
- `build-scripts/sprints/check-batch-sprint-closure.js`
- `build-scripts/sprints/check-sprint-protocol-harden2.js`
- `build-scripts/sprints/check-sprint-result.js`
- `build-scripts/sprints/check-sprint-bundle.js`

Sprint evidence and metadata:

- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-plan.md`
- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-baseline.md`
- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-planning-review.md`
- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-command-log.jsonl`
- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-command-log.md`
- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-lead-review-assignment.md`
- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-lead-review-round1.md`
- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-lead-review-corrections.md`
- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-lead-review-round2.md`
- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-result.md`
- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-diff-summary.md`
- `references/data/sprints/SPRINT-PROTOCOL-HARDEN-2.plan.json`
- `references/data/sprints/SPRINT-PROTOCOL-HARDEN-2.result.json`

Repository maps/indexes:

- `references/reference-team-roadmap.md`
- `reports/url-index.md`
- `reports/github-agent-index-platform.md`
- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-lessen.md`
- `reports/github-agent-index-lessen.json`
- `reports/internal-dashboard/index.html`
- `reports/internal-dashboard/dashboard-data.json`

## Data integrity notes

No protected reference data changed. The sprint did not mutate:

- `references/machine/`
- `references/external/`
- `source-data/book-1/exit-ticket/`
- `source-data/book-1/reasoning/`
- generated Book 1 lesson output
- target-exercise registry records
- candidate-storage files
- `knowledge/exit-ticket-game-1.1.1.zip`
- PV projection or PV machine-promotion outputs

`references/data/sprints/SPRINT-PROTOCOL-HARDEN-2.plan.json` and
`references/data/sprints/SPRINT-PROTOCOL-HARDEN-2.result.json` are sprint
metadata, not protected reference data.

## Open follow-ups

- `EXAM-SOURCE-AUTH-1` remains the next repair-track sprint from the handoff
  unless a roadmap synchronization sprint is inserted first to rename the
  downstream source-reconstruction and task-transform rows to the actual-exam
  repair sequence.
- Shared task context/runtime, source reconstruction, and exam task
  transformation remain blocked until this sprint is committed and pushed.
- Human gate work remains blocked until the relevant pre-gate lead review,
  pushed packet, direct comments, comment-resolution log, closure proposal,
  closure JSON, and reviewed remote commit/hash exist.

## Rollback instructions

Rollback by reverting the `SPRINT-PROTOCOL-HARDEN-2` commit. Because this
sprint does not change protected references, source exercise data, generated
lesson output, target registries, candidate storage, or PV outputs, rollback
does not require generated-output cleanup.
