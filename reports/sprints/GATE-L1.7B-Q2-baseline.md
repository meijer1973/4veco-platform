# Sprint GATE-L1.7B-Q2: Baseline

Generated: 2026-06-01

## Plan reference

`reports/sprints/GATE-L1.7B-Q2-plan.md`

## Current state

`L1.7B-Q2` is closed and pushed as PASS WITH FLAGS.

Remote implementation evidence:

- platform commit `31e035aaab656f8f64722ac62d26108f829d0f60`;
- lesson output commit `971bf68402e6071804c44d3aa67c67320a987e33`.

The implemented `1.1.2` exit-ticket source exists at
`source-data/book-1/exit-ticket/1.1.2.json` with:

- `surface: target_equivalent_exit_ticket`;
- `targetEquivalent.candidate: true`;
- `targetEquivalent.gateApproved: false`;
- `targetEquivalent.completionLanguageEligible: false`;
- target and scope skills `A38`, `A39`, and `D31`;
- four tasks covering the reviewed operation chain.

The generated lesson output contains the `1.1.2` exit-ticket page and landing
card, but only local checkpoint completion copy. No target-equivalent
paragraph-completion language is enabled.

## Data integrity notes

No protected reference data may change in this gate-prep sprint.
`references/machine/`, `references/external/`,
`references/authored/course-target-exercises.json`, and
`references/data/exam-ingestion/answer-skill-candidates.json` are forbidden
surfaces.

No source exit-ticket data, generated Book 1 output, engine implementation,
target-exercise fields, candidate storage, or completion-language flag may be
created or modified during packet preparation.

The unrelated untracked `knowledge/exit-ticket-game-1.1.1.zip` remains outside
scope and must not be staged.

## Baseline risks

- The human gate may approve copy without explicitly reviewing the
  deterministic matcher limitation.
- A target-equivalent local claim may be confused with mastery, diagnostics,
  sequencing, or Scale Gate 1.
- The advisory `1.1.1` short check may be confused with target-equivalent proof.
- Completion-language enablement may be treated as automatic mutation instead
  of a later exact implementation step.

## Closure condition for packet-prep stage

Packet preparation is complete only after the packet, evidence, checker,
pre-gate lead-review artifacts, bundle URLs, maps/indexes, and result metadata
are committed and pushed. The human interview must not start from local-only
evidence.
