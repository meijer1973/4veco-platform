# INSPECT-11C Authorisation Note

Status: recorded authority input
Date: 2026-06-18
Sprint: `INSPECT-11C`

## Source

This note records the user-provided PR #105 review verdict that authorised the
next substantial sprint after PR #105 merged.

The decision source is the PR #105 review verdict supplied to Codex on
2026-06-18. PR #105 then merged through the normal PR path as merge commit
`3264be6c2d881b879acc05fcb351fa9a9c290d07`.

## Authorised Sprint

```text
INSPECT-11C Chapter 1.3 Lesson-Side Reconciliation And Proof Remediation
```

## Authorised Goal

Move Chapter 1.3 to one of three explicit states:

```text
A. ready for a later internal diagnostic report implementation plan;
B. still blocked, but with all blockers precisely narrowed and assigned;
C. rejected as the next diagnostic candidate because lesson-side divergence is too large.
```

## Required Workstreams

- Reconcile Chapter 1.3 quality-ref/review state for `1.3.1` through `1.3.4`.
- Resolve or formally carry the `1.3.4` lesson-output / registry divergence.
- Create proof-record candidates with operation-chain match, answer-form match,
  scaffold/no-answer-before-attempt boundary, answer/model separation, line
  ranges or exercise IDs, local-only diagnostic authority, and carried blockers.
- Produce accessibility/support evidence records.
- Preserve forbidden authority boundaries.

## Required Outputs

```text
reports/inspection-standards/chapter-1-3-reconciliation-and-proof-remediation.md
reports/inspection-standards/chapter-1-3-reconciliation-and-proof-remediation.json

archive/sprints/INSPECT-11C/INSPECT-11C-sprint-plan.md
archive/sprints/INSPECT-11C/INSPECT-11C-validation-log.md
archive/sprints/INSPECT-11C/INSPECT-11C-correction-log.md
archive/sprints/INSPECT-11C/INSPECT-11C-lead-review-round1.md
archive/sprints/INSPECT-11C/INSPECT-11C-lead-review-round2.md
archive/sprints/INSPECT-11C/INSPECT-11C-specialist-gate-results.md
archive/sprints/INSPECT-11C/INSPECT-11C-closure-log.md
```

## Forbidden Authority

INSPECT-11C does not authorise:

- Chapter 1.3 diagnostic report generation;
- evidence-pack generation;
- teacher/school-facing output;
- public/external output;
- dashboard gate creation;
- quality-ref integration as authority;
- Scale Gate integration;
- product-route adoption;
- diagnostics/mastery/PV work;
- student/product-use authority;
- compliance or inspection-ready claims.

## Review Protocol

Use lead review, teacher/usefulness review, Dutch quality-inspection review,
legal/privacy/claims review, and final lead review before human review.

Human review may occur only after the full packet exists, local validation has
passed, CI is backed by the final PR-visible commit, and subagent review is
recorded.
