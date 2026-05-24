# Sprint EX-5: Baseline

## Plan reference

`reports/sprints/EX-5-plan.md`

## Current state

EX-5 is the active row in `references/reference-team-roadmap.md`.
GATE-EX4 closed as `pass_with_conditions` and authorized EX-5 as a bounded
tooling/design sprint only.

Current upstream evidence:

- `reports/review-gates/GATE-EX4-mutation-planning/gate-closure.json`
- `reports/review-gates/GATE-EX4-mutation-planning/cli-readiness-plan.json`
- `reports/review-gates/GATE-EX4-mutation-planning/mutation-candidates.json`
- `reports/json/exam-ingestion-coverage.json`
- `references/data/skill-operation-registry.json`

## Baseline findings

- Operation-registry CLI does not exist.
- Answer-skill registry CLI does not exist.
- q19 source-annex extraction validator does not exist.
- q19 has blocking `q19-source-annex-gap` and `q19-graph-object-gap`.
- q3/q15 answer-skill needs are still visible and not authorized for mutation.
- Existing `references/data/skill-operation-registry.json` is a governed data
  overlay prepared for CP4 review; it is not a machine registry.

## Data integrity notes

No protected reference data has been changed at baseline. EX-5 must not
hand-edit `references/machine/` or `references/external/`, must not mutate
`references/data/skill-operation-registry.json`, and must not touch lesson
output. The unrelated `knowledge/exit-ticket-game-1.1.1.zip` is present as an
untracked local file and must remain unstaged and untouched.

## Stop conditions checked

- Stop if EX-5 is not the active roadmap row.
- Stop if GATE-EX4 closure is missing or no longer authorizes EX-5.
- Stop if q19 gaps are not carried as blocking.
- Stop if any contract would write candidate records or execute extraction.
- Stop if product-use boundaries become true.
