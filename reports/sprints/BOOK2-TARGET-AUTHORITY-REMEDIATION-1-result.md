# Sprint BOOK2-TARGET-AUTHORITY-REMEDIATION-1: Result

## Plan reference

Plan: `reports/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1-plan.md`

## Summary

Issue #229 Phase A is complete as a platform-only, independently reviewed
candidate. All twelve Book 2 records (§2.1.1–§2.3.4) were repaired as exact
package
`914d1a39f18f8f9b7cf7fad938d2c42f9c2bc19671d94c24be151b1da0371310`.
The package has renewed teacher, economics, student-language, finished-artifact,
and structural lead review. Lead round 2 returned `PASS WITH FLAGS`; the only
carried quality flag is unobserved classroom timing for the densest items.

The owner approved the frozen content and three-way Ei semantics on 2026-09-05,
and requested lifecycle/evidence corrections to PR #230. The record bytes and
`candidate_review_ready` statuses remain frozen; explicit package-bound owner
evidence, not that status alone, establishes content approval. The twelve target
holds remain open. Only `H-229-EI-SUPERSESSION` is released. Integration,
lesson authoring, Phase B, and merge remain unauthorized.

Correction plan: `reports/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1-owner-corrections-plan.md`.
The test counts below describe the original Phase A; renewed correction proof
is recorded in the correction-resolution report and command log.

## Acceptance test results

Passed locally and recorded in
`reports/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1-command-log.jsonl`:

- sprint plan/bundle, target v5, outline currentness, durable candidate, and
  approval-block contracts;
- 116/116 focused/currentness tests;
- Part A, blueprint, scope, shared-lane, protected-reference CLI, roadmap,
  current MTU-H7 Bundle 4 derivative, report, agent-index, URL-index,
  evidence-line-ending, and review-throughput checks;
- full platform validation: 109 suites and 1,769 tests passed, with 6 suites
  and 8 tests skipped;
- clean unchanged lesson repository at
  `f09fd6e88edc5049b026b16b0158e7e188091d2d`.

The first hosted run on `eade17cb…` failed three tests and is preserved as
honest correction history. A later run on `808eb5eb…` passed the Book 2, full
Jest, and presentation checks but exposed that the existing MTU-H7 Bundle 4
packet still pinned the pre-A17 registry hash. That derivative packet was
regenerated from the governed live registry and revalidated. Historical exact-head CI passed on `b614577f19c6e8a95c9981256aa125e56d26cd79`:
[run 33917295567](https://github.com/meijer1973/4veco-platform/actions/runs/33917295567).
Fresh correction-head CI and PR readiness remain required; that historical run
does not prove the new lifecycle code.

## Changed files

The exact inventory is in
`reports/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1-diff-summary.md` and the L4
review packet. It covers the twelve-record registry/package, Book 2 outline
candidate lifecycle, the A17 terminology projection, focused checkers/tests,
CI wiring, sprint/review evidence, roadmap bookkeeping, and deterministic
indexes/dashboard. It also includes the mechanically regenerated MTU-H7 Bundle
4 derivative packet required by the authorized A17 change.

## Data integrity notes

Protected reference data changed only for MTU `A17`, using the governed unit
update route, to restore the canonical `inferieur`/`normaal`/`luxe` Ei
classification. All other machine units, external reference mirrors, owned
blueprints, and non-Book-2 target records remain unchanged.

No file in `../4veco-lessen` changed and no student-facing lesson, HTML, PDF,
image, chapter, book, or other generated lesson output was produced.

## Open follow-ups

- Complete the owner's four lifecycle/evidence findings and renewed independent
  review, fresh CI, and PR Readiness Reviewer evidence.
- A later governed integration must record approval and release evidence before
  Phase B may begin.
- Phase B must empirically time §2.1.1e, §2.2.3d, and §2.3.3 and perform lesson,
  rendered, visual, and student-experience review.

## Rollback instructions

Close draft PR #230 or revert the Issue #229 platform commits in reverse order.
Rollback must restore the target registry, outline/meta candidate bindings,
A17 through its governed projection route, CI/checker wiring, and sprint
evidence together. No lesson rollback is needed because the lesson repository
was not changed. Do not hand-edit protected machine data or discard unrelated
work.
