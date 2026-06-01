# Sprint CHECK-SHORT-EXIT-1: Baseline

Generated: 2026-06-01

## Plan reference

Plan: `reports/sprints/CHECK-SHORT-EXIT-1-plan.md`

## Current source-data state

`source-data/book-1/exit-ticket/` currently contains:

- `1.1.1.json`
- `1.1.2.json`

There is no `source-data/book-1/exit-ticket/1.1.3.json`.

Current known source roles:

- `1.1.1` is titled `Korte check`, has `metadataAlignment.targetReadinessEvidence: false`,
  and records `targetExerciseSkillIds` including `A43`, so it is not a
  target-equivalent exit ticket.
- `1.1.2` has `surface: target_equivalent_exit_ticket`,
  `targetEquivalent.gateApproved: true`, and
  `completionLanguageEligible: true` for reviewed local non-summative proof
  only.
- `1.1.3` has no exit-ticket source data.

## Current generated-output state

Generated Book 1 output currently includes:

- `1.1.1 Schaarste en economisch denken – exit-ticket.html`
- `1.1.2 Percentages en indexcijfers – exit-ticket.html`

Generated Book 1 output currently does not include a `1.1.3` exit-ticket page.

This sprint may inspect generated output as read-only evidence. It must not
regenerate or edit lesson output.

## Current roadmap/spec state

`SYNC-PRODUCT-1` closed PASS and inserted the Product Proof Track before Scale
Gate 1. The next Product Proof Track steps are:

- `CHECK-SHORT-EXIT-1`
- `STANDARD-EXERCISES-1`

The stable specs now require advisory short checks and target-equivalent exit
tickets to remain visually and semantically distinct. Missing surfaces must be
recorded as follow-up work or blockers.

## Data integrity notes

This is an audit/contract sprint. No protected reference data under
`references/machine/` or `references/external/` should change. No generated
lesson output, engine code, source exit-ticket data, reasoning CSV,
candidate storage, target-exercise fields, PV projection, diagnostics,
adaptive routing, mastery/sequencing, Scale Gate 1, or product-wide use is in
scope.

The unrelated untracked `knowledge/exit-ticket-game-1.1.1.zip` remains present
and must not be touched.
