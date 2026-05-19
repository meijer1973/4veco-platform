# Sprint GATE-CP6: Diff Summary

## Summary

GATE-CP6 records the CP-6 human answer set and turns the review packet into a formal non-closing routing decision.

It creates:

- a human interview record
- a machine-readable interview record
- a gate routing decision
- five remediation-lane records
- a read-only routing validator
- sprint plan, baseline, result, metadata, and lead-review scaffolding

## Added gate artifacts

- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/human-interview.md`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/human-interview.json`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/gate-routing-decision.md`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/gate-routing-decision.json`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/remediation-lanes.md`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/remediation-lanes.json`

## Added script

- `build-scripts/review-gates/check-gate-cp6-routing-decision.js`

The script is read-only. It fails if a CP-6 closure record exists, if fewer than nine answers are recorded, if fewer than five lanes are opened, or if mutation/closure boundaries are missing.

## Protected surfaces

No changes are authorized or expected under:

- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `references/owned/course-blueprint-v5.md`
- `../4veco-lessen`

GATE-CP6 does not authorize CP-6 closure, Year-1 closure, target-exercise promotion, placeholder finalization, unit minting, protected reference mutation, lesson-output mutation, diagnostics, adaptive routing, mastery decisions, student-facing AI, summative use, PV projection, or student-facing output.

## Routing decision

The recorded gate status is `routing_decision_recorded_not_closed`.

Authorized next lanes:

- `CP.6a` Book 1 Chapter 1.3 Lesson-Side Alignment
- `CP.6b` Year-1 Target-Exercise Review
- `CP.6c` Year-1 MTU Backfill Classification
- `CP.6d` Book 1 Graph-Heavy Evidence Upgrade
- `CP.6e` Focused `1.1.3` Part A Re-Review

## Roadmap update

The references roadmap is updated to `v2.52-gate-cp6-routing-decision`.

`GATE-CP6` moves to Closed Sprints as a non-closing routing gate. `CP.6a` becomes the active top Sprint Ledger row, followed by `CP.6b` through `CP.6e`.

The prior live roadmap is archived at `docs/roadmaps/outdated/reference-team-roadmap-v2.51-ref-cp6-remediation-readiness.md`.

## Map refresh

Generated report, source-manifest, document-inventory, GitHub-agent-index, and URL-index surfaces are refreshed by normal tooling before sprint closure.
