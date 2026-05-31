# Sprint LEAD-REVIEW-2: Diff Summary

Generated: 2026-05-31

## Summary

The diff hardens lead-review validation so future sprint bundles cannot bypass
review through backdated metadata, human-gate exemptions, thin lead-review
files, or untracked PASS WITH FLAGS dispositions.

## Process changes

- `check-sprint-bundle.js` now loads an explicit legacy-grandfather list.
- Future non-grandfathered sprint IDs require `lead_review_schema_version: 2`
  and strict lead-review handling even if `created` is backdated.
- Human-review gates cannot use `lead_review_exemption`.
- Strict complete-bundle validation checks lead-review report structure,
  evidence references, verdicts, blocking-finding statements, and next action.
- `PASS WITH FLAGS` now requires structured `lead_review.flags` metadata with
  non-blocking disposition, owner, and next action.
- `check-lead-review-strict-fixtures.js` proves the rejection and acceptance
  paths.

## Protected surfaces

No protected reference data changed:

- no hand edits to `references/machine/`;
- no hand edits to `references/external/`;
- no writes to `references/authored/course-target-exercises.json`;
- no `references/data/exam-ingestion/answer-skill-candidates.json`;
- no candidate writes;
- no unit minting, update, split, or deprecation.

No generated lesson output under `../4veco-lessen/Boek *` changed.

## Carried flags

- `S7` and `PV-G4` are legacy compatibility entries with plan metadata but no
  result JSON. The grandfather file preserves old planned/intake checks; it
  does not authorize future closure without lead review.
- `knowledge/exit-ticket-game-1.1.1.zip` is unrelated, untracked, and excluded
  from this sprint commit.

## Product authority

This sprint authorizes no target-equivalent completion language, diagnostics,
adaptive routing, mastery/sequencing, student-facing AI, summative use, PV
projection, PV machine promotion, Scale Gate 1, or student/product use.

## Next action

After final validation, map refresh, fetch/prune, commit, and push, resume
`GRAPH-UX-2`.
