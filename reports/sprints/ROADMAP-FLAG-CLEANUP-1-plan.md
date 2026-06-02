# ROADMAP-FLAG-CLEANUP-1 Plan

Generated: 2026-06-02

Status: execution plan for bounded roadmap flag cleanup.

## Purpose

Clean up active roadmap flag language after the task-family gate closure so
non-blocking carried flags do not accidentally freeze downstream planning.

This sprint changes roadmap/status language only. It does not authorize engine
implementation, generated lesson output, source-data mutation, product-route
adoption, target-equivalent claims, diagnostics, adaptive routing, mastery,
sequencing, summative use, PV, Scale Gate 1, or student/product use.

## Quality Floor

- A flag blocks only the claim or authority it names.
- Product-route screenshot proof blocks product-route adoption, not planning.
- Target-equivalence boundaries block target-equivalence claims, not
  task-family acceptance or adoption-preparation.
- Conditional capability limits, such as many-to-one matching, are not broad
  adoption blockers for use cases that do not need that capability.
- Historical archive no-change evidence is recorded as a read-only invariant,
  not an active product-quality blocker.

## Scope

Update:

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- sprint evidence under `reports/sprints/`
- checker under `build-scripts/sprints/`

Do not edit generated lesson output or machine references.

## Procedure

1. Read the flag-audit report and current roadmap rows.
2. Add a flag semantics note to active roadmap context.
3. Mark lesson-side `GATE-TASK-FAMILY-1` closed and remove it from open
   Product Proof Track lists.
4. Rephrase task-family carried flags so they are typed as adoption blockers,
   semantic target-proof boundaries, conditional capability notes, or
   read-only historical invariants.
5. Add deterministic checks for the cleanup.
6. Run validation and record the result.

## Stop Conditions

- Stop if any cleanup text weakens the hard boundaries around product-route
  adoption, target-equivalent proof, diagnostics, mastery/sequencing,
  summative use, PV, Scale Gate 1, or product-wide use.
- Stop if the lesson roadmap still lists `GATE-TASK-FAMILY-1` as open.
- Stop if many-to-one matching is still phrased as a general blocker instead
  of a conditional capability note.
- Stop if historical archive evidence is still phrased as an active blocker.

## Acceptance Criteria

- Both roadmaps distinguish active blockers from non-blocking carried flags.
- Lesson roadmap records `GATE-TASK-FAMILY-1` as closed PASS WITH FLAGS.
- Open Product Proof Track lists no longer include `GATE-TASK-FAMILY-1`.
- Matching-pairs many-to-one status is conditional.
- Old exit-ticket archive language is a read-only invariant, not an active
  blocker.
- Checker passes.
