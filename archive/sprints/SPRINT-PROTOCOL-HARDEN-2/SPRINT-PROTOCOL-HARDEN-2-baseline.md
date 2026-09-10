# Sprint SPRINT-PROTOCOL-HARDEN-2: Baseline

Generated: 2026-06-03

Status: baseline before implementation; no sprint protocol mutation
authorized by this file.

## Plan reference

Plan: `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-plan.md`

Plan JSON: `references/data/sprints/SPRINT-PROTOCOL-HARDEN-2.plan.json`

## Baseline Summary

The current branch includes the rollback commit required by the handoff:

```text
99f2f5f Revert "Add shared task context ingestion gate proof"
```

The rolled-back commit remains visible below it in local history:

```text
c21cbac Add shared task context ingestion gate proof
```

The six invalid proof paths named in the handoff were checked with
`Test-Path` and are absent from current HEAD:

- `reports/review-gates/GATE-SHARED-TASK-INGEST-1-shared-task-context-and-ingestion-review/`
- `reports/json/source-reconstruct1-exam-context.blocks.json`
- `reports/json/task-ingest-transform1-exam-task-set.json`
- `build-scripts/review-gates/check-gate-shared-task-ingest1-review-packet.js`
- `build-scripts/review-gates/capture-gate-shared-task-ingest1-playable-proof.js`
- `build-scripts/sprints/check-task-context-runtime1.js`

The active roadmap still lists `SYNC-TASK-CONTEXT-INGEST-1`,
`TASK-CONTEXT-SPEC-1`, `TASK-CONTEXT-RUNTIME-1`,
`CONTEXT-VISUAL-STD-1`, `SOURCE-RECONSTRUCT-1`,
`TASK-INGEST-TRANSFORM-1`, and `GATE-SHARED-TASK-INGEST-1` as open.

## Baseline Gaps

- `build-scripts/sprints/run-sprint-command.js` does not exist.
- `reports/sprints/<SPRINT-ID>-command-log.jsonl` and
  `reports/sprints/<SPRINT-ID>-command-log.md` are not required by current
  sprint closure validation.
- `build-scripts/sprints/check-sprint-result.js` validates result markdown
  shape but does not require command-log evidence for passed acceptance tests.
- `build-scripts/sprints/check-sprint-bundle.js --complete` validates result
  JSON structure but does not currently require every passed acceptance test to
  match a command-log entry with exit code `0`.
- `check-sprint-bundle.js` validates lead-review headings and path count, but
  not enough to prove that actual output artifacts and command-log evidence
  were inspected.
- `build-scripts/sprints/check-lead-review-substance.js` does not exist.
- `build-scripts/sprints/check-batch-sprint-closure.js` does not exist.
- Negative fixtures for missing command logs, non-zero command logs,
  headings-only lead review, plan/baseline/roadmap-only lead review, and
  unwaived batch closure do not exist.

## Data integrity notes

This sprint must not mutate protected reference data:

- `references/machine/`
- `references/external/`

It also must not mutate source exercise data, generated Book 1 lesson output,
target-exercise registry records, candidate-storage files, PV projection
outputs, or PV machine-promotion outputs.

`references/data/sprints/SPRINT-PROTOCOL-HARDEN-2.plan.json` and later
`references/data/sprints/SPRINT-PROTOCOL-HARDEN-2.result.json` are sprint
metadata, not protected reference data.

## Product-authority baseline

No generated lesson output, shared task context runtime, source
reconstruction, exam task transformation, product-route adoption,
target-equivalent reliance, diagnostics, adaptive routing, mastery,
sequencing, student-facing AI, summative use, PV, Scale Gate 1, or
student/product use is currently authorized.

## Planned Evidence

Implementation may proceed only after plan validation and planning review.

Closure requires:

- command runner;
- command-log validator;
- result and complete-bundle command-log integration;
- lead-review substance validator;
- batch-closure validator;
- negative fixture proof;
- wrapped command logs for the acceptance stack;
- structural lead review round 1, correction log, and round 2;
- result markdown/JSON and diff summary;
- roadmap/index/dashboard refresh;
- final commit and push.
