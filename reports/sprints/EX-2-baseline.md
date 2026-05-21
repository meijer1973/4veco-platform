# Sprint EX-2: Baseline

## Plan reference

Plan: `reports/sprints/EX-2-plan.md`

## Current state

EX-1 is completed and pushed. It created the three pilot overlay families required for EX-2:

- `references/data/exam-ingestion/exam-item-overlays.json`
- `references/data/exam-ingestion/exam-answer-model-overlays.json`
- `references/data/exam-ingestion/exam-source-annex-overlays.json`

`references/reference-team-roadmap.md` version `v2.63-ex1-exam-ingestion-pilot` lists EX-2 as the active next human-review gate.

No `GATE-EX2-exam-to-mtu-mapping` review packet exists at baseline.

## Gate inputs

The EX-2 evidence base is:

- EX-1 pilot overlay records;
- EX-1 pilot validator;
- current live MTU registry projection;
- CP.6c classification precedent for Year-1 MTU backfill;
- GATE-EX0 no-mutation/product-boundary conditions.

## Data integrity notes

No protected reference data has changed at baseline. EX-2 must not edit `references/external/`, `references/machine/`, `references/authored/course-target-exercises.json`, or `references/owned/course-blueprint-v5.md`.

No lesson output, lesson review file, or lesson quality-ref has changed at baseline.

EX-2 may prepare review artifacts only. It may not treat any mapping classification as accepted until the human interview and closure record are complete.

## Initial risks

- q19 has blocking graph/source reconstruction gaps; EX-2 must not hide those gaps behind a premature MTU mapping.
- q3 carries a questionable A15 source mapping; EX-2 must classify whether this is a weak existing route, an operation-registry need, a missing MTU, or defer.
- q15 likely maps to D27/F03/F09 for content, but the correction-model wording may still require a separate answer-skill decision.
