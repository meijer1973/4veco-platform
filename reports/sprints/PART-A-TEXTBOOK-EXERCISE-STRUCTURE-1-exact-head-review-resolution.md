# Exact-Head Review Resolution

Sprint: `PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1`

Generated: 2026-08-31

Reviewed head: `15106b64b7b80d1e9c048870da0de9943d6460fd`

Controlling verdict: **CHANGES REQUIRED**

## Preserved findings

The exact-head review accepted current-main integration, mergeability,
paper-only routing, pre-Start summary placement, exact heading hierarchy,
backward design, and the Book 1/lesson boundary. It identified four blockers:

1. two active inherited instructions still imposed unconditional visual
   removal;
2. printed-template no-device enforcement omitted likely Dutch wording;
3. renewed lead closure was incomplete; and
4. PR description/readiness metadata remained stale.

This record does not overwrite the earlier planning, teacher, lead, or
exact-head review history.

## Source and checker corrections

- `skills/econ-didactiek.md` no longer prescribes a fixed
  visual-to-text-only progression. It now fades scaffolding toward the actual
  target representation and answer form, retains target-supplied graphs,
  tables, and sources, and introduces production only for a production target.
- `skills/econ-textbook-paragraph.md` carries the same target-aligned rule in
  its production checklist and clarifies that Begeleide inoefening is always
  authored/printed while only student use is optional.
- The paragraph checklist is continuously numbered from 1 through 36.
- The checker now bounds and inspects all five active visual-fading sections.
  It rejects both target-absent graph/table production and unconditional
  removal of a target-supplied visual.
- Printed-template checks now reject English and Dutch device/digital-support
  wording, including telefoon, smartphone, computer, internet, app,
  hyphenated `QR-code`, digitale uitleg, digitaal hulpmiddel, and `scan de
  code`. The restriction remains confined to printed template copy; internal
  architecture discussion remains allowed.
- Focused mutations retain the correct positive text while reintroducing the
  contradictory fading rule in every one of the five bounded sections. Nine
  Dutch printed-copy mutations and an internal-document allowance probe are
  also covered.

## Validation and review disposition

The contract checker passes across all 10 active surfaces. The combined
contract/lane suites pass 64/64 tests. The complete local platform suite passes
106 suites and 1,621 tests, with 6 suites and 8 tests skipped.

Because active guidance and checker behavior changed, the earlier teacher PASS
and the bounded lead evidence-recheck path are not reused. A new substantive
teacher review and a new substantive lead review must inspect the immutable
repair payload. Final result/PR metadata, exact-final-head CI, and readiness
routing remain intentionally blocked until both reviews pass. Merge and Book 2
production remain unauthorized.
