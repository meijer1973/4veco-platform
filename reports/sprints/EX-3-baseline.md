# Sprint EX-3: Baseline

## Plan reference

Plan: `reports/sprints/EX-3-plan.md`

## Current state

EX-3 is the active roadmap row in `references/reference-team-roadmap.md`.

GATE-EX2 is closed as `pass_with_conditions` for classification and routing
only. Its closure authorizes EX-3 dashboard/reporting work and nothing else.

EX-1 pilot overlay families exist for three official VWO 2025 tijdvak 1 items:

- q3 calculation-heavy;
- q19 graph/source-heavy;
- q15 reasoning/answer-model-heavy.

Existing generated reports do not yet include:

- `reports/json/exam-ingestion-coverage.json`;
- `reports/markdown/exam-ingestion-coverage.md`.

## Data integrity notes

No protected reference data is changed at baseline. EX-3 must not edit
`references/machine/`, `references/external/`, authored target exercises, owned
blueprints, or lesson output.

The current platform workspace contains one unrelated pre-existing untracked
file: `knowledge/exit-ticket-game-1.1.1.zip`. This file is outside EX-3 scope
and must not be staged or modified.

## Baseline risks

- q19 is not fully reconstructable from the current overlay and must remain
  blocked in EX-3 reporting.
- q3 and q15 expose answer-skill needs that must remain visible downstream.
- EX-3 can make reporting clearer, but it cannot authorize mutation or lesson
  production.
