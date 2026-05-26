# Sprint EX-6: Baseline

## Plan reference

`reports/sprints/EX-6-plan.md`

## Current state

EX-6 is the active row in `references/reference-team-roadmap.md`.
GATE-EX5 closed as `pass_with_conditions` and authorized EX-6 as a bounded
validator/CLI implementation planning sprint only.

Current upstream evidence:

- `reports/review-gates/GATE-EX5-operation-answer-skill-contract/gate-closure.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.md`
- `references/schemas/operation-answer-skill-contract.schema.json`
- `reports/json/exam-ingestion-coverage.json`

## Baseline findings

- `references/data/exam-ingestion/operation-candidates.json` does not exist.
- `references/data/exam-ingestion/answer-skill-candidates.json` does not exist.
- `references/data/exam-ingestion/source-annex-extraction-overlays.json` does
  not exist.
- `build-scripts/references/operation-candidate-add.js` does not exist.
- `build-scripts/references/answer-skill-candidate-add.js` does not exist.
- `build-scripts/references/source-annex-extraction-add.js` does not exist.
- q19 has blocking `q19-source-annex-gap` and `q19-graph-object-gap`.
- q3/q15 answer-skill needs are still visible and not authorized for mutation.
- Existing `references/data/skill-operation-registry.json` is a governed data
  overlay prepared for CP4 review; it is not a machine registry.

## Data integrity notes

No protected reference data has been changed at baseline. EX-6 must not
hand-edit `references/machine/` or `references/external/`, must not mutate
`references/data/skill-operation-registry.json`, and must not touch lesson
output. The unrelated `knowledge/exit-ticket-game-1.1.1.zip` is present as an
untracked local file and must remain unstaged and untouched.

## Stop conditions checked

- Stop if EX-6 is not the active roadmap row.
- Stop if GATE-EX5 closure is missing or no longer authorizes EX-6.
- Stop if q19 gaps are not carried as blocking.
- Stop if any EX-6 artifact would write candidate records or execute
  extraction.
- Stop if product-use boundaries become true.
