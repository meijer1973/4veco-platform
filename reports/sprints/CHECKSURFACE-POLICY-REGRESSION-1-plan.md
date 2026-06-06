# CHECKSURFACE-POLICY-REGRESSION-1 Policy And Regression Plan

Generated: 2026-06-06

## Status

Active inserted sprint before any renewed `GATE-CHECK-SHORT-EXIT-2-RETRY`
human-review packet.

## Context

The previous retry packet is superseded. Human review of the prepared retry
evidence found that accepted shared-task decisions were not carried into the
check-surface implementation: `1.1.3` still explained the graph procedure,
short check and exit ticket overlapped too closely, answer-giving controls
remained possible, and the interval selector could be correct-only.

This sprint makes the lost decisions durable policy and adds a regression
checker. The policy is not sprint-local; it belongs in the stable companion
specification and, where needed, the canonical product end-state. Prior repair
artifacts are baseline evidence only, not closure evidence for the renewed
gate.

## Authorized Scope

This sprint may:

- update stable specifications with shared-task/check-surface integrity rules;
- update platform and lesson roadmaps so the old retry packet is paused;
- add negative fixtures for the exact failure modes named by the reviewer;
- add a deterministic checker that rejects those failures and verifies the
  current first-three check-surface sources;
- harden shared runtime validation when a policy rule is directly enforceable;
- record planning, review, command, and result artifacts.

This sprint may not:

- send, close, or claim the retry human-review gate;
- authorize new target-equivalent completion language;
- broaden the reviewed `1.1.2` completion-language authority;
- authorize product-route adoption, diagnostics, mastery/sequencing, PV,
  Scale Gate 1, or student/product use;
- hand-patch generated lesson output.

## Quality Floor

The sprint is not complete unless the checker would have failed the exact
reviewed regressions:

1. short check and exit ticket are identical or near-identical;
2. an exit ticket teaches the procedure before the attempt;
3. graph/table controls reveal the answer before student action;
4. selector controls contain only correct choices;
5. interval-halving controls contain only correct intervals or conclusions;
6. a generic choice task substitutes for a graph/table/calculation action;
7. graph drawing is not in the active workspace;
8. feedback or next action is absent;
9. completion or product-authority language is enabled without review;
10. the reviewed `1.1.2` authority is weakened or broadened.

## Specification Requirements Fulfilled

- Product end-state: short checks are advisory and separate from
  target-equivalent exit tickets.
- Product end-state: graph/table skills require graph/table actions, not
  choice-only stand-ins.
- Companion core: exit tickets may not expose hints, answer-revealing
  scaffolds, or teaching-mode feedback before the attempt.
- Companion core: shared task families must be strong enough for their own
  student-facing use.
- Human-review proof: gates must use checkable evidence and cannot rely on
  memory of prior decisions.

## Evidence Needed

- updated `../4veco-lessen/specifications/companion-core-specifications.md`
- updated `../4veco-lessen/specifications/product-end-state.md` if the
  canonical north star needs the same policy pointer
- updated platform and lesson roadmap rows
- `reports/fixtures/checksurface-policy-regression1/negative-fixtures.json`
- `build-scripts/sprints/check-checksurface-policy-regression1.js`
- `reports/json/checksurface-policy-regression1-proof.json`
- sprint baseline, planning review, command log, verification review, result,
  lead-review assignment, round 1, corrections, and round 2

## Procedure

1. Record the baseline and planning review.
2. Insert the policy into stable specifications with change-control notes.
3. Reorder the roadmaps so policy/regression and excellence work happen before
   a renewed retry packet.
4. Add negative fixtures for every failure mode in the quality floor.
5. Add the regression checker and proof output.
6. Run the checker against negative fixtures and current first-three sources.
7. Run scoped tests and prior checkers that the new policy affects.
8. Record verification and lead-review artifacts.
9. Continue only to the redesign sprint if all policy/regression checks pass.

## Acceptance Tests

```text
node build-scripts/sprints/check-checksurface-policy-regression1.js
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js
node build-scripts/sprints/check-check-short-exit2.js
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run check:scope-language
```

## Stop Conditions

Stop instead of proceeding if:

- the stable policy cannot be added without contradicting the product
  end-state;
- a negative fixture passes unnoticed;
- the checker relies only on artifact existence rather than student-facing
  product properties;
- roadmap text still sends the old retry packet directly for comments;
- any artifact claims new completion language or product authority.

## Review Gate

Lead review must inspect this sprint before the renewed human-review packet.
The later human gate judges the repaired check surfaces, but this sprint
judges whether the missing policy and regression memory now exist.

## Higher-Quality Improvements In Scope

- Make the checker emit human-readable proof JSON so gate packets can cite
  the policy status.
- Guard both source data and rendered/runtime affordances where possible.

## Omitted Follow-Up Work

- Surface redesign belongs to `CHECKSURFACE-EXCELLENCE-REDESIGN-1`.
- Three-paragraph product comparison belongs to
  `CHECKSURFACE-EXCELLENCE-AUDIT-3P`.
- Human-review packet preparation belongs to
  `CHECKSURFACE-GATE-RETRY-EXCELLENT-1`.
