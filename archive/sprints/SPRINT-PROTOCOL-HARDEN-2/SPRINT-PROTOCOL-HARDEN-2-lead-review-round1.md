# Lead Review Summary

Sprint: `SPRINT-PROTOCOL-HARDEN-2`

Round: lead review round 1

## Scope

Evidence inspected: `reports/sprints/SPRINT-PROTOCOL-HARDEN-2-lead-review-assignment.md`,
`reports/sprints/SPRINT-PROTOCOL-HARDEN-2-plan.md`,
`reports/sprints/SPRINT-PROTOCOL-HARDEN-2-baseline.md`,
`reports/sprints/SPRINT-PROTOCOL-HARDEN-2-planning-review.md`,
`references/data/sprints/SPRINT-PROTOCOL-HARDEN-2.plan.json`,
`reports/sprints/SPRINT-PROTOCOL-HARDEN-2-command-log.jsonl`,
`build-scripts/sprints/run-sprint-command.js`,
`build-scripts/sprints/check-sprint-command-log.js`,
`build-scripts/sprints/check-sprint-result.js`,
`build-scripts/sprints/check-sprint-bundle.js`,
`build-scripts/sprints/check-lead-review-substance.js`,
`build-scripts/sprints/check-batch-sprint-closure.js`,
`build-scripts/sprints/check-sprint-protocol-harden2.js`, and
`references/reference-team-roadmap.md`.

This was a read-only structural lead review. No files were edited by the
reviewer.

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Command-log schema | lead reviewer | JSONL fields for command, cwd, timestamps, duration, exit code, stdout/stderr hashes and excerpts | PASS |
| Result/bundle enforcement | lead reviewer | Passed acceptance tests require matching command-log `exit_code: 0` evidence | REVISE |
| Currently-running-command exception | lead reviewer | Narrow bootstrap exception with no post-completion loophole | REVISE |
| Lead-review substance validation | lead reviewer | Actual implementation/proof artifacts separate from plan/baseline/roadmap and command logs | REVISE |
| Batch closure validation | lead reviewer | Multiple completed sprints require human waiver; human gates cannot batch-close with other sprints | PASS |
| Negative fixture proof | lead reviewer | Deterministic failing fixtures for required bad cases | REVISE |
| Protected surfaces | lead reviewer plus git status/diff | No protected reference, source-data, zip, or generated lesson output mutation | PASS |
| Product authority | lead reviewer | No unauthorized product-route, target-equivalent, diagnostics, mastery, sequencing, PV, Scale Gate, or student/product claims | PASS |

## Consolidated Verdict

Verdict: REVISE

The sprint is directionally correct and the core implementation is close, but
round 1 cannot pass because the proof does not yet cover the exact validators
being hardened, and the lead-review/current-command checks leave avoidable
loopholes.

## Blocking Findings

Blocking findings exist:

1. Negative fixture proof does not exercise `check-sprint-result.js` or
   `check-sprint-bundle.js --complete`, even though the plan requires those
   validators to reject passed tests without command-log evidence. The current
   fixture checker only proves this through `check-sprint-command-log.js`,
   while the result and bundle validators contain separate enforcement logic.

2. `check-lead-review-substance.js` can count any non-planning-looking
   backticked path as an output artifact without verifying that the path exists
   or is one of the actual implementation/proof artifacts. This means a review
   can pass substance validation by citing a bogus build-scripts path
   plus command-log text.

3. The currently-running-command exception is too broad as implemented.
   `SPRINT_COMMAND_UNDER_RUN` causes `check-sprint-command-log.js`,
   `check-sprint-result.js`, and `check-sprint-bundle.js` to skip evidence for
   any passed command string equal to that environment variable. There is no
   fixture proving that direct env spoofing cannot satisfy a completed result
   after command completion.

## Specialist Findings

Command logging itself is strong enough for round 1: the wrapper writes
schema-valid JSONL and markdown with bounded excerpts and hashes.

Batch closure validation meets the stated floor: it detects more than one
completed result JSON in the closure set, requires a waiver, and blocks
batching a `GATE-*` sprint with other closures.

Protected-surface boundaries hold in the current worktree. The reviewer found
no diffs under `references/machine`, `references/external`,
`source-data/book-1/exit-ticket`, `source-data/book-1/reasoning`,
`knowledge/exit-ticket-game-1.1.1.zip`, or generated Book 1 lesson output.

## Test Evidence

Read-only checks run during review:

```text
node build-scripts/sprints/check-sprint-bundle.js SPRINT-PROTOCOL-HARDEN-2
node build-scripts/sprints/check-sprint-command-log.js SPRINT-PROTOCOL-HARDEN-2
node build-scripts/sprints/check-sprint-protocol-harden2.js
node build-scripts/sprints/check-batch-sprint-closure.js --working-tree
```

All passed in the reviewer's read-only run. The command log includes one
earlier failed `check-sprint-protocol-harden2.js` run followed by a passing
rerun; the reviewer accepted that as audit history.

Closure evidence is still incomplete: several planned acceptance commands,
result files, complete-bundle validation, index/dashboard refreshes, diff
checks, fetch/commit/push, and round-2 lead review are not yet present.

## Learning Quality Evidence

No learning material, paragraph content, generated lessons, exercises,
companion artifacts, or assessment surfaces were changed. Learning-quality
review is therefore limited to confirming that no product-learning claim was
made by this protocol sprint.

## Student Experience Evidence

No student-facing output was generated or modified. The plan, plan JSON, and
roadmap row explicitly block product-route adoption, target-equivalent proof,
diagnostics, mastery/sequencing, PV, Scale Gate 1, and student/product use.

## Ownership and Handoff

Main sprint owner should correct the validator proof gaps before requesting
round-2 lead review. This round-1 report is a blocking correction record input,
not closure approval.

## Required Next Action

Revise the sprint by adding direct negative fixtures for
`check-sprint-result.js` and `check-sprint-bundle.js --complete`, tightening
lead-review substance validation to require existing actual
implementation/proof artifact paths, and narrowing or proving the
currently-running-command exception. Then rerun the wrapped acceptance stack,
record the correction log, and request lead-review round 2.
