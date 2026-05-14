# GATE-PV-G4 Lesson Regression Proof: Gate Closure

Sprint: `PV-G4`
Status: `pass_with_conditions`
Closed on: 2026-05-14

## Decision

PV-G4 is closed as `pass_with_conditions`.

Two lesson-owned PV regression proofs are recorded and reconciled. The platform
proof intake now cites lesson commit
`7ab984512178249fe39e0c7ade56da0b8acc212f` with
`lesson_worktree_dirty_at_generation: false`, and the proof-intake checker
passes.

This closure does not authorize PV machine promotion, student-facing PV
projection, diagnostics, adaptive use, mastery, sequencing, AI, or summative
use.

## Accepted Outcomes

- Proof 001 validates the `1.1.1` four-step opportunity-cost procedure across
  lesson surfaces and formal PV step mapping.
- Proof 002 validates a different PV template through a bounded A61 table-trace
  pilot.
- The HCS evidence-freshness condition was reconciled by regenerating lesson
  proof records and platform intake from current authoritative artifacts.
- The platform proof-intake checker passes.

## Conditions

- Proof 002 is accepted only as bounded proof diversity.
- Proof 002 is not a completed student-facing paragraph, published `1.1.3`
  surface, or classroom-ready A61 route.
- PV records remain under `references/data/procedure-visual/` unless a later
  promotion gate explicitly authorizes otherwise.
- PV-G4 does not authorize student-facing PV projection.
- PV-G4 does not authorize diagnostics, adaptive routing, mastery, sequencing,
  AI, or summative use.
- Future PV-dependent lesson sprints may not use generated-output hand patches
  as proof.

## Blocked Outcomes

- `references/machine` Procedure-Visual registry creation.
- Student-facing PV projection.
- Adaptive or diagnostic PV use.
- Mastery, sequencing, AI, or summative PV use.
- Claiming the A61 pilot is a student-ready route.

## Evidence

| Evidence | Path |
|---|---|
| HCS lead review | `../4veco-lessen/pv-g4-proof-records/HCS-PV-G4-lead-review-record.md` |
| HCS verification | `../4veco-lessen/pv-g4-proof-records/HCS-PV-G4-lead-review-verification.md` |
| Lesson sync log | `../4veco-lessen/L-PV5-roadmap-sync-log.md` |
| Platform proof intake | `reports/json/procedure-visual-lesson-regression-proof-intake.json` |
| Gate review packet | `reports/review-gates/GATE-PV-G4-lesson-regression/review-packet.md` |

## Next Allowed Scope

Reference Sprint 8 may proceed only as an internal diagnostic-overlay sprint if
it does not assume PV machine promotion or student-facing PV projection.

Lesson L1.5B may proceed under the PV-G4 condition boundary. Lesson L1.5G and
L1.6 may use the L-PV contract/proof machinery where PV semantics are involved.
