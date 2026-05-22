# Sprint EX-4: Baseline

## Plan reference

Plan: `reports/sprints/EX-4-plan.md`

## Current state

EX-4 is the active roadmap row in `references/reference-team-roadmap.md`.

EX-3 is closed as a reporting-only sprint. Its coverage report exists at:

- `reports/json/exam-ingestion-coverage.json`
- `reports/markdown/exam-ingestion-coverage.md`

The coverage report records three pilot items and eight reviewed EX-2
classifications. It keeps q19 blocked by source/graph gaps and keeps q3/q15
answer-skill needs visible.

The current platform workspace contains one unrelated pre-existing untracked
file: `knowledge/exit-ticket-game-1.1.1.zip`. This file is outside EX-4 scope
and must not be staged or modified.

## Data integrity notes

No protected reference data is changed at baseline. EX-4 must not edit
`references/machine/`, `references/external/`, authored target exercises, owned
blueprints, or lesson output.

## Baseline risks

- The existing skill-operation registry is a governed `references/data/`
  overlay, not a machine registry, and operation/answer-skill mutation CLI
  support is not established for the EX candidates.
- q19 source/graph gaps block any responsible graph/PV or lesson handoff route.
- q3 and q15 answer-skill needs need policy/registry decisions before mutation.
- EX-4 can prepare a review packet, but it cannot authorize or execute mutation.
