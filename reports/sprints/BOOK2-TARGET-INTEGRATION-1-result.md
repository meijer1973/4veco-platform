# Sprint BOOK2-TARGET-INTEGRATION-1: Result

## Plan reference

`reports/sprints/BOOK2-TARGET-INTEGRATION-1-plan.md`.

## Summary

Implementation and independent structural review are complete. Round2 is PASS
WITH FLAGS at 469e605fb5cd722816b0fa3f3b12af63b423efe5, with green CI run
33959681780. This result closes the implementation/evidence bundle, not main
integration, human authorization or student production. Final publication-delta
review, final-head CI and actual applied readiness are recorded on PR #231;
they must succeed before owner handoff. The checked-in snapshot does not claim
success for a future descendant.

Separate owner evidence is immutable at 6e35f4fe0aeaa448da9476469294ccd45775232d.
Activation commit 206c018478654db781cc879e7ea36adcd9ef600c contains the new grant
while preserving all open candidate holds. The release state pins that exact
ancestor and authorization reference for all twelve targets. All consumers
share the durable frozen-package/lifecycle contract, including scoped actions.

## Acceptance test results

See `reports/sprints/BOOK2-TARGET-INTEGRATION-1-command-log.jsonl` for actual
exit codes, timestamps and output hashes, including honest initial failures.
The original 146 regressions and first 35 new pending tests passed together.
Expanded activation suite independently passed 69 tests. Main check:platform
passed 110 suites / 1,868 tests; 6 suites / 8 tests were skipped (491.102 seconds).
Durable, approval-block retirement and live approved-use/§2.1.1 CLI checks pass.
Structural lead round1 requested closure evidence only. Round2 independently
confirmed the full log, current-head hosted CI and unchanged source. The complete
bundle is validated after recording that issued report. Final result/packet/plan/
ledger edits receive an actual independent published-delta review, whose PR
comment is the operative final-head lead evidence. Readiness uses that URL and
SHA; no edits follow the final reviewed head. Full CI and readiness are never
inferred from this earlier green checkpoint.

## Changed files

New immutable integration helper and tests; currentness, durable and approval
consumers/tests; outline metadata and lifecycle-only Markdown projection;
sprint/review evidence, textbook roadmap/ledger and deterministic repository maps.

## Data integrity notes

No protected reference data changes in references/machine/ or references/external/.
The frozen registry/candidate package, alignment, historical content-only approval,
Ei semantics and H-211 releases remain unchanged. Semantic outline hash remains
919c39f64dd212dba37b62902a5bb2e2ce6388c6020a0491e1621017ae2192a1.
The lesson worktree remains clean at f09fd6e88edc5049b026b16b0158e7e188091d2d.

## Open follow-ups

Required next gate: exact reviewed governance payload authorization, serialized
merge commit without admin bypass, then green main CI. Only then begin the
combined Part A continuation, including the missing root/Chapter 2.3 plans and
reviewed retrieval/elastic contrast prerequisites. All five independent holds
are retained. Classroom timing remains open, especially §2.3.3; no student output
or classroom-observation claim has been made.

## Rollback instructions

Use additive task-branch corrections before merge or a separately reviewed
revert PR after merge. Do not reset shared/dirty worktrees, rewrite historical
approvals, change frozen target content or bypass integration policy.
