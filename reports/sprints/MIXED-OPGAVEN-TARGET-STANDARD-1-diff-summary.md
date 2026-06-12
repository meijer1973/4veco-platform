# Sprint MIXED-OPGAVEN-TARGET-STANDARD-1: Diff Summary

## Scope

The diff implements the planned mixed-exercise target-standard sprint for 2.1.4.
It does not start Chapter 2.2, does not rewrite 2.1.4 as theory, and does not
authorize any companion/product-scaling surface.

## Platform Changes

- Added `references/authored/gemengde-opgaven-target-standard.md` as the reusable
  standard for reviewed-final `gemengde_opgaven` records.
- Replaced the 2.1.4 placeholder target in
  `references/authored/course-target-exercises.json` with a non-placeholder
  SmoothBox mixed transfer target and `mixed_target_profile`.
- Updated `scripts/check-course-target-exercises-v5.js` so reviewed-final mixed
  records are accepted only when they carry the non-placeholder target/profile
  evidence required by the standard.
- Added validator tests for accepted reviewed-final mixed targets, hidden final
  placeholders, and missing profile proof.
- Updated the platform blueprint and textbook roadmap/ledger to mark the sprint
  and 2.1.4 target state complete.

## Lesson Changes

- Mirrored the 2.1.4 reviewed-final status into
  `../4veco-lessen/course_blueprint_v5.md`.
- Added compact answer-construction guidance to the 2.1.4 opgaven source.
- Updated 2.1.4 quality/review metadata to remove the old placeholder carry
  flag and record the target-standard sprint.
- Regenerated the 2.1.4 paragraph output and Chapter 2.1 aggregate output.

## Protected Surfaces

Protected reference data changed only where the plan allowed it:
`references/authored/course-target-exercises.json`,
`references/authored/gemengde-opgaven-target-standard.md`, and
`references/owned/course-blueprint-v5.md`. No files under `references/machine/`
or `references/external/` changed.

## Review Classification

- blocks: none.
- does_not_block: existing Chapter 2.1 PDF-size warning remains for later print
  assembly monitoring.
- proof_required_to_close: command-log evidence for target validation, Jest,
  paragraph/chapter/book validators, diff checks, lead review, result check, and
  complete bundle check.
