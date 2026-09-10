# Sprint SPRINT-PROTOCOL-HARDEN-2: Sprint Protocol Evidence Hardening

Generated: 2026-06-03

## Goal

Harden the roadmap sprint protocol so a sprint cannot be closed by plausible
markdown and JSON alone.

This sprint adds command-log evidence, command-log validation, lead-review
substance validation, and batch-closure checks before the shared task context
and real exam ingestion repair lane proceeds. It is protocol infrastructure
only. It does not implement shared task context rendering, source
reconstruction, exam task transformation, generated lesson output, product
route adoption, target-equivalent proof, diagnostics, adaptive routing,
mastery, sequencing, student-facing AI, summative use, PV, Scale Gate 1, or
student/product use.

## Context

The new-team handoff says the previous shared task context ingestion attempt
was rolled back by commit `99f2f5fb15bf24ea08c533eb62c412b976544c27`, which
reverted `c21cbac71ba90f2e10c5cd6d4af8b61a08a5a7ad`.

Phase 0 checks already confirmed:

- `git fetch --prune origin` completed.
- current `git log -5 --oneline` starts with `99f2f5f Revert "Add shared task context ingestion gate proof"`;
- all invalid gate-proof paths named in the handoff are absent from current
  HEAD;
- the active roadmap still leaves `SYNC-TASK-CONTEXT-INGEST-1` through
  `GATE-SHARED-TASK-INGEST-1` open.

The failure mode to prevent is evidence-system failure: result JSON can claim
acceptance tests passed without a corresponding executed command log, and
lead-review files can satisfy headings without proving that actual outputs and
test evidence were inspected.

This sprint is the mandatory first repair step before `TASK-CONTEXT-SPEC-1`,
`TASK-CONTEXT-RUNTIME-1`, actual exam reconstruction, actual exam task
transformation, or a new human ingestion gate packet.

## Quality Standard

The quality floor is a specification-accurate evidence protocol: every
completed sprint acceptance-test pass must be backed by a command-log record
with exit code `0`, every lead review must inspect actual implementation or
proof output artifacts and command-log evidence, and batch sprint closure must
be blocked unless an explicit human waiver exists.

Passing the existing bundle checker alone is insufficient. The sprint must
prove rendered output and student-facing output are unchanged, protected surfaces are
unchanged, command logging captures real process evidence, validators reject
negative fixtures, and follow-up work is named before any shared task context
or exam-ingestion implementation begins.

The review gate for this sprint is structural lead review before closure.
Human review is not required for this protocol-only sprint, but later human
gate packets must be blocked unless pre-gate lead review and direct comment
evidence exist.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Completed sprint test claims require command evidence. | `build-scripts/sprints/run-sprint-command.js` writes JSONL and markdown command logs; `check-sprint-command-log.js`, `check-sprint-result.js`, and `check-sprint-bundle.js --complete` require matching passed command entries. | Negative fixtures for missing log entry and non-zero exit code; wrapped acceptance tests. | planned |
| Lead review must inspect actual outputs, not only plan/baseline/roadmap. | `check-lead-review-substance.js` requires cited output artifacts and command-log evidence for lead-review reports. | Negative fixtures for headings-only review and plan/baseline/roadmap-only review. | planned |
| Batch sprint closure requires human authorization. | `check-batch-sprint-closure.js` detects more than one completed sprint result in one closure set and requires `BATCH-CLOSURE-WAIVER.md`. | Negative fixture for two completed sprints without waiver. | planned |
| Human gates remain separated from prerequisite implementation sprints. | Batch checker and bundle/result validation reject human gate closure without required gate evidence and reviewed remote commit/hash. | Checker tests and lead review. | planned |
| Gate packets cannot precede pre-gate lead review. | Bundle/result validation keeps human gate lead-review phase and required direct-comment closure evidence explicit. | Checker tests and lead review. | planned |
| Protocol hardening does not mutate protected references or generated lessons. | Diff summary and boundary checks show no edits under `references/machine/`, `references/external/`, or generated Book 1 lesson output. | Bundle checker, diff review, lead review, and git status evidence. | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Record stdout/stderr full text in logs. | reject_scope_creep | The sprint needs durable evidence without creating large noisy artifacts; hashes plus bounded excerpts are the authorized format. |
| Add replayable stored stdout/stderr artifact files. | defer_named_follow_up | Useful later for high-stakes gates, but the handoff requires hashes and bounded excerpts now. |
| Validate command-log timestamps, duration, hashes, cwd, and exit code. | include_now | These fields are part of the required command-log schema and make the evidence auditable. |
| Add negative fixtures for missing logs, non-zero logs, weak lead review, and batch closure. | include_now | The handoff explicitly requires these failure proofs before closure. |
| Require every historical closed sprint to gain command logs. | reject_scope_creep | This sprint hardens the protocol forward. Retrofitting old sprints would create noisy historical churn and cannot recreate missing execution evidence honestly. |
| Implement shared task context runtime in the same commit. | reject_scope_creep | The repair sequence forbids context or exam-ingestion work before protocol hardening closes. |

## Allowed paths

Allowed sprint protocol implementation paths:

- `build-scripts/sprints/run-sprint-command.js`
- `build-scripts/sprints/check-sprint-command-log.js`
- `build-scripts/sprints/check-lead-review-substance.js`
- `build-scripts/sprints/check-batch-sprint-closure.js`
- `build-scripts/sprints/check-sprint-bundle.js`
- `build-scripts/sprints/check-sprint-result.js`
- focused sprint-protocol fixture or checker files under `build-scripts/sprints/`

Allowed sprint evidence paths:

- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-*`
- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-command-log.jsonl`
- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-command-log.md`
- `references/data/sprints/SPRINT-PROTOCOL-HARDEN-2.plan.json`
- `references/data/sprints/SPRINT-PROTOCOL-HARDEN-2.result.json`

Allowed closure/index paths:

- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/outdated/reference-team-roadmap-*.md`
- `RESEARCH_AGENT_MAP.md`
- `RESEARCH_AGENT_MAP_REFERENCES.md`
- `AGENT_GITHUB_ENTRY.md`
- `reports/url-index.md`
- `reports/github-agent-index-*.md`
- `reports/github-agent-index-*.json`
- `reports/internal-dashboard/*`

## Forbidden paths

Forbidden paths and surfaces:

- `references/machine/`
- `references/external/`
- `source-data/book-1/exit-ticket/`
- `source-data/book-1/reasoning/`
- generated Book 1 lesson output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`
- `knowledge/exit-ticket-game-1.1.1.zip`
- target-exercise registry records
- candidate-storage files
- PV projection or PV machine-promotion outputs

No protected reference mutation, machine reference mutation, external-source
mutation, unit minting, unit update, unit split, unit deprecation, diagnostics,
adaptive routing, mastery, sequencing, student-facing AI, summative use, PV,
Scale Gate 1, or student/product use is authorized.

## Inputs

Required inputs:

- `AGENTS.md`
- `../CLAUDE.md`
- `RESEARCH_AGENT_MAP.md`
- `../4veco-lessen/RESEARCH_AGENT_MAP.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `build-scripts/README.md`
- `build-scripts/sprints/check-sprint-plan.js`
- `build-scripts/sprints/check-sprint-bundle.js`
- `build-scripts/sprints/check-sprint-result.js`
- `references/data/exam-ingestion/exam-item-overlays.json`
- `references/external/exam-questions.json`
- recent strict sprint artifacts such as `TASK-FAMILY-ASSERTION-1`

## Outputs

Required generated output statement:

- no student-facing or generated lesson output is generated or changed by this
  sprint.

Required protocol outputs:

- command-runner wrapper;
- command-log validator;
- lead-review substance validator;
- batch-closure validator;
- updates to existing sprint bundle/result validation;
- negative fixture proof for missing command logs, non-zero command logs,
  weak lead review, plan/baseline/roadmap-only lead review, and unwaived batch
  closure;
- sprint planning review record;
- sprint result markdown and JSON;
- sprint diff summary;
- structural lead-review assignment, round 1, correction log, and round 2;
- refreshed repository maps/index/dashboard artifacts at closure.

## Operationalized sprint procedure

1. Validate this plan, baseline, and plan JSON with the raw sprint-plan and
   planned bundle checkers. This is a bootstrap step because the command
   wrapper does not exist yet. Stop if the plan does not pass.
2. Ask the planning/review subagent to inspect the plan, baseline, plan JSON,
   handoff constraints, current validators, and recent strict sprint patterns.
   Stop and revise if the planning review returns blockers.
3. Implement `run-sprint-command.js` and use it for all subsequent sprint
   commands. The wrapper must append JSONL and markdown evidence with command,
   cwd, timestamps, duration, exit code, stdout/stderr hashes, and bounded
   excerpts.
4. Implement `check-sprint-command-log.js`; update
   `check-sprint-result.js` and `check-sprint-bundle.js --complete` so a
   passed acceptance test must match a command-log entry with exit code `0`.
5. Implement `check-lead-review-substance.js` so lead review cannot pass by
   citing only plan, baseline, and roadmap, and so claimed tests must cite
   command-log evidence.
6. Implement `check-batch-sprint-closure.js` so multiple completed sprint
   results in one closure set require `BATCH-CLOSURE-WAIVER.md`; human gates
   may not be batch-closed with prerequisite implementation sprints.
7. Add deterministic negative fixture proof. Stop if any negative fixture
   unexpectedly passes.
8. Run the wrapped acceptance stack and record command logs.
9. Assign structural lead review, record round 1, make a correction pass and
   correction log, and record round 2. Do not close if round 2 is not PASS or
   PASS WITH FLAGS.
10. Create result markdown, result JSON, and diff summary. Refresh roadmap,
    version index, URL index, GitHub-facing maps, and internal dashboard only
    after implementation and lead review are accepted.
11. Run final wrapped validation, `git diff --check`, fetch/prune, resolve any
    behind/diverged state, commit, push, and report commit hash and push
    status.

## Acceptance tests

Bootstrap validation before the wrapper exists:

```text
node build-scripts/sprints/check-sprint-plan.js reports/sprints/SPRINT-PROTOCOL-HARDEN-2-plan.md
node build-scripts/sprints/check-sprint-bundle.js SPRINT-PROTOCOL-HARDEN-2
```

Planned wrapped validation stack after the wrapper exists:

```text
node build-scripts/sprints/run-sprint-command.js SPRINT-PROTOCOL-HARDEN-2 -- node build-scripts/sprints/check-sprint-plan.js reports/sprints/SPRINT-PROTOCOL-HARDEN-2-plan.md
node build-scripts/sprints/run-sprint-command.js SPRINT-PROTOCOL-HARDEN-2 -- node build-scripts/sprints/check-sprint-bundle.js SPRINT-PROTOCOL-HARDEN-2
node build-scripts/sprints/run-sprint-command.js SPRINT-PROTOCOL-HARDEN-2 -- node build-scripts/sprints/check-sprint-command-log.js SPRINT-PROTOCOL-HARDEN-2
node build-scripts/sprints/run-sprint-command.js SPRINT-PROTOCOL-HARDEN-2 -- node build-scripts/sprints/check-lead-review-substance.js SPRINT-PROTOCOL-HARDEN-2
node build-scripts/sprints/run-sprint-command.js SPRINT-PROTOCOL-HARDEN-2 -- node build-scripts/sprints/check-batch-sprint-closure.js --working-tree
node build-scripts/sprints/run-sprint-command.js SPRINT-PROTOCOL-HARDEN-2 -- node build-scripts/sprints/check-sprint-protocol-harden2.js
node build-scripts/sprints/run-sprint-command.js SPRINT-PROTOCOL-HARDEN-2 -- npm.cmd run check:platform
node build-scripts/sprints/run-sprint-command.js SPRINT-PROTOCOL-HARDEN-2 -- npm.cmd run check:scope-language
node build-scripts/sprints/run-sprint-command.js SPRINT-PROTOCOL-HARDEN-2 -- node build-scripts/reports/validate-report-json.js
node build-scripts/sprints/run-sprint-command.js SPRINT-PROTOCOL-HARDEN-2 -- node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/run-sprint-command.js SPRINT-PROTOCOL-HARDEN-2 -- npm.cmd run agent:index
node build-scripts/sprints/run-sprint-command.js SPRINT-PROTOCOL-HARDEN-2 -- node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/run-sprint-command.js SPRINT-PROTOCOL-HARDEN-2 -- npm.cmd run dashboard:internal
node build-scripts/sprints/run-sprint-command.js SPRINT-PROTOCOL-HARDEN-2 -- node build-scripts/sprints/check-sprint-result.js reports/sprints/SPRINT-PROTOCOL-HARDEN-2-result.md
node build-scripts/sprints/run-sprint-command.js SPRINT-PROTOCOL-HARDEN-2 -- node build-scripts/sprints/check-sprint-bundle.js SPRINT-PROTOCOL-HARDEN-2 --complete
node build-scripts/sprints/run-sprint-command.js SPRINT-PROTOCOL-HARDEN-2 -- node build-scripts/sprints/emit-url-index.js --check
node build-scripts/sprints/run-sprint-command.js SPRINT-PROTOCOL-HARDEN-2 -- git diff --check
node build-scripts/sprints/run-sprint-command.js SPRINT-PROTOCOL-HARDEN-2 -- git -C ../4veco-lessen diff --check
```

## Proof Required to Close

The sprint may close only after producing proof to close:

- command-runner wrapper exists and logs schema-valid JSONL plus markdown;
- command-log validator rejects missing, malformed, and non-zero evidence;
- result and complete bundle validation reject passed tests without matching
  command-log entries;
- lead-review substance validator rejects headings-only and
  plan/baseline/roadmap-only reviews;
- batch-closure validator rejects multiple completed sprints without waiver;
- all negative fixtures fail for the intended reason;
- all acceptance tests are run through the command wrapper after it exists;
- planning review exists;
- lead-review assignment, round 1, correction log, and round 2 exist;
- result markdown, result JSON, and diff summary exist;
- roadmap/index/dashboard artifacts are refreshed when required;
- protected surfaces and generated lesson output remain unchanged;
- commit is pushed and reported.

## Rollback plan

Rollback by reverting the `SPRINT-PROTOCOL-HARDEN-2` commit. Because the
sprint does not change protected references, external sources, source exercise
data, generated lesson output, target registries, candidate storage, or PV
outputs, rollback does not require generated-output cleanup.

## Human review required

No human review is required for this protocol-only sprint.

Human review remains required for later shared task context and exam-ingestion
gate work. Later human gates must include pushed packet evidence, pre-gate
lead review, direct comments, comment-resolution logs, closure proposal,
closure JSON, and reviewed remote commit/hash.

## Lead Review Required

Lead review is required before sprint closure.

Lead review artifacts:

- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-lead-review-assignment.md`
- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-lead-review-round1.md`
- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-lead-review-corrections.md`
- `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-lead-review-round2.md`

Round 1 must inspect the command runner, command-log schema, validator
integration points, negative fixture behavior, lead-review substance checks,
batch-closure checks, command-log evidence, and forbidden-surface boundaries.

Round 2 must recheck corrections or confirm no blocking corrections were
required before final sprint closure.

## Stop Conditions

Stop and revise before implementation or closure if:

- the plan fails sprint-plan or planned bundle validation;
- the planning/review subagent returns blockers;
- the current branch no longer includes the rollback of `c21cbac71ba90f2e10c5cd6d4af8b61a08a5a7ad`;
- any invalid rolled-back gate-proof artifact reappears;
- a result JSON can claim `passed` without command-log evidence;
- a non-zero command-log entry can satisfy a passed test claim;
- lead-review files can pass while inspecting only plan, baseline, or roadmap;
- more than one sprint can close in one commit without a waiver;
- a human gate can close without direct comments, resolution log, closure
  proposal, closure JSON, and reviewed remote commit/hash;
- any artifact implies product-route adoption, target-equivalent proof,
  diagnostics, mastery, sequencing, Scale Gate 1, or student/product use.

## Next Authorized Work After Closure

If this sprint closes PASS or PASS WITH FLAGS, the next authorized work is
`EXAM-SOURCE-AUTH-1` from the repair handoff, or a roadmap synchronization
step if the active roadmap must first rename `SOURCE-RECONSTRUCT-1`,
`TASK-INGEST-TRANSFORM-1`, and `GATE-SHARED-TASK-INGEST-1` to the repaired
actual-exam sequence.

Do not start `TASK-CONTEXT-SPEC-1`, `TASK-CONTEXT-RUNTIME-1`, source
reconstruction, task transformation, or a human gate packet before protocol
hardening is complete.
