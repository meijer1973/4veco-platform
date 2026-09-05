# Independent production planning review

Date: 2026-09-05. Reviewer: correction_plan_review (independent, read-only).
Accountable recorder: codex-root. Scope: production plan, plan JSON, baseline,
command log in the dedicated production pair; no student content authored yet.

## Round 1: REVISE — narrow planning corrections

The reviewer found the scope, 41-PDF manifest, dependency sequence, quality
floor and authority boundaries sound. No additional owner decision is needed
for §2.1.1 after its ordinary plan review. The reviewer independently verified
successful post-merge run 33963305398 for merge SHA
96416b6b5bd57094576e9aba0a42d682584ec479.

Required corrections:

1. Operationalize separate paragraph builders, each in isolated owned worktrees,
   with codex-root coordinator/sole integrator. Paragraph/QC/quality-ref reviewers
   must not author the content they independently accept.
2. Explicitly require publisher-print paragraph validation before chapter/book
   handoff, while retaining student-web validation for required HTML outputs.

Stage requirements: define the new root-plan contract before creating it;
record the proposed 12pt body/table floor and treatment of the legacy 11pt
chapter-front rule. Do not shrink text to fit. These do not block §2.1.1.

Confirmed: 27 theory + six mixed + six chapter + two book PDFs; filesystem-safe
names; no consolidation paragraaf output; no exercise duplication or answers
inside the student book; frozen semantics and companion ownership protected;
all-page rendered proof; later owner-decision gates remain action-specific.

## Corrections submitted

The production plan now names builder/reviewer ownership, isolated paired
worktrees, separate author/acceptance duties, both paragraph profiles and the
root-plan contract. Body/table text is at least 12pt, including chapter fronts.
Normal-scale review remains required. An additional protected-reference
freshness disposition omits optional Inspectie mapping, not product QA.
No implementation or product PASS is inferred.

## Round 2: PASS — foundation and paragraph planning may proceed

The same independent reviewer re-inspected the corrected plan, plan JSON and
round 1 record and closed both required corrections. Isolated paragraph
builders, distinct review/QC ownership, independent plan approval, both HTML
and print validation, root-plan minimum contract and 12pt readability floor
are now explicit. No planning blocker prevents Chapter 2.1 foundations or
§2.1.1 planning. Later action-specific holds retain their scopes.

The reviewer accepted the bounded freshness disposition without independently
verifying the external framework. This does not waive economics, pedagogy,
student-facing or rendered-output QA. Verdict is planning acceptance only,
not product QC, future paragraph approval, release readiness or owner decision.
