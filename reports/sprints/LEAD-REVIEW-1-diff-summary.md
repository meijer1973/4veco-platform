# Sprint LEAD-REVIEW-1: Diff Summary

Generated: 2026-05-31

## Summary

The diff repairs the lead-review process and records real lead-review audits for
recent non-MTU, non-human-gated sprints.

## Process changes

- `build-scripts/sprints/check-sprint-bundle.js` now applies a lead-review
  policy for sprints created on or after 2026-05-31.
- New sprints must either set `lead_review_required: true` or record an
  explicit `lead_review_exemption`.
- Future human-review sprint plans must set `lead_review_phase:
  before_human_gate`.
- Platform and lesson `AGENTS.md` now state that lead review is required before
  closing non-trivial roadmap sprints and before future human gates.

## Lead-review evidence

Added structural lead-review artifacts for:

- `SPEC-ET-1`
- `EX-LESSON-1`
- `GAME-UX-3A`
- `ENGINE-OP-1`
- `SKILLMAP-OP-1`

The lead reviewer returned PASS WITH FLAGS for all five after correction.
SKILLMAP-OP-1 required and received focused student-experience and accessibility
specialist review before round 2.

## Excluded surfaces

MTU-H4A, MTU-H4B, MTU-H4C, and their human-review gates were not re-reviewed.
The user explicitly stated that MTU sprints with human gate artifacts do not
need retroactive lead review. Future human gates still require lead review
before the human interview starts.

## Protected surfaces

No protected reference data changed:

- no hand edits to `references/machine/`;
- no hand edits to `references/external/`;
- no writes to `references/authored/course-target-exercises.json`;
- no `references/data/exam-ingestion/answer-skill-candidates.json`;
- no candidate writes;
- no unit minting, update, split, or deprecation.

No generated lesson output under `../4veco-lessen/Boek *` changed.

## Product authority

This sprint authorizes no target-equivalent completion language, diagnostics,
adaptive routing, mastery/sequencing, student-facing AI, summative use, PV
projection, PV machine promotion, Scale Gate 1, or student/product use.

## Next action

After LEAD-REVIEW-1 round-2 recheck and final validation pass, resume
`GRAPH-UX-2`.
