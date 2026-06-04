# Sprint TASK-INGEST-TRANSFORM-3-TEXTBOOK: Baseline

Sprint: `TASK-INGEST-TRANSFORM-3-TEXTBOOK`
Date: 2026-06-04

## Plan reference

Plan: `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-plan.md`

## Roadmap Position

Current open roadmap row:

`TASK-INGEST-TRANSFORM-3-TEXTBOOK | Textbook Source Exercise Transformation | no | Prepare the textbook-style source-context transformation only after the actual-exam path has proved the source-authority and context contracts. Must use governed source maps, visual variants, operation traces, and task-family maps without weakening the real-exam evidence standard.`

Previous sprint evidence:

- `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM` is done.
- It produced a playable actual-exam transformation lab, proof JSON, screenshots, source reconstruction map, operation/answer-form traces, task-family map, and lead-review PASS.
- Platform commit: `69671c4219f0718c4cf631e85a57d8e2bd9f2cc7`.
- Lesson commit: `3415fd2142bfee56afd454ab0c93d8645ec3a34c`.

Next planned gate:

- `GATE-SHARED-TASK-INGEST-REPAIR-1` requires both actual-exam and textbook labs plus source maps, task-family maps, proof JSON, screenshots, validators, lead review, direct human comments, resolution log, closure proposal, and closure JSON.

## Source Candidate

Selected owned textbook source:

- Paragraph: `1.1.3 Grafieken en tabellen`
- Source file: `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen - paragraaf.md`
- Primary table source: ice-cream price/quantity table
- Primary visual sources:
  - `_assets/1.1.3_fig_1.svg`
  - `_assets/1.1.3_fig_3.svg`
- Target registry context: `references/authored/course-target-exercises.json`, paragraph `1.1.3`
- Existing review: `1.1.3-review.md` has PASS WITH FLAGS and marks figure geometry and answer model as acceptable with minor flags.

## Source Facts To Preserve

Ice-cream table:

| Price | Quantity sold |
|---:|---:|
| EUR 1.00 | 500 |
| EUR 1.50 | 400 |
| EUR 2.00 | 300 |
| EUR 2.50 | 200 |
| EUR 3.00 | 100 |

Graph convention:

- P-Q diagram uses quantity on the horizontal axis.
- P-Q diagram uses price on the vertical axis.
- The graph is descending in this source.

Interpolation:

- At price EUR 1.75, quantity is approximately 350.
- The interpolation sits between EUR 1.50 / 400 and EUR 2.00 / 300.

Claim evaluation:

- The target exercise asks which two prices could support the statement "sales dropped by 50%" and asks for an explanation.
- The paragraph text explicitly teaches EUR 1.50 to EUR 2.50 as 400 to 200, a 50 percent drop.
- The source table also contains an adjacent interval EUR 2.50 to EUR 3.00 as 200 to 100, also a 50 percent drop.
- The transformation must record this as a textbook-source ambiguity and require source values plus calculation rather than silently presenting a single unsupported answer.

## Existing Engine Capabilities

`engines/task-shell-engine.js` supports the families needed for this sprint:

- `table_value_selection`
- `source_value_selection`
- `structured_short_response`
- `point_placement`
- `graph_reading`
- `calculation_work_capture`
- `source_chain_builder`
- `step_ordering`

Context block validation supports:

- markdown/context text
- source excerpts
- tables
- graphs
- formulas
- flowcharts

## Baseline Constraints

- This is owned textbook evidence, not official exam evidence.
- No source authority field may use `external_primary`.
- No official CvTE/exam wording may be applied to the textbook task set.
- No protected references or generated lesson outputs may be edited.
- The output remains review-only until the later human gate.

## Data integrity notes

- Protected reference data in `references/machine/` and `references/external/` is read-only for this sprint.
- `source-data/` remains read-only for this sprint.
- The owned target registry in `references/authored/course-target-exercises.json` may be read as contextual evidence but must not be edited.
- Book 1 paragraph output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/` may be read as the textbook source but must not be edited.
- The sprint writes only review-only reports, JSON evidence, and sprint checker scripts until roadmap closure.

## Known Risks

- The target registry has `record_status: migrated_from_v4_needs_v5_review`; this means the exercise is usable as owned controlled source evidence but not as externally authoritative exam evidence.
- The 50 percent interval has multiple source-valid interpretations; the sprint must surface this as a review note.
- Task-shell graph construction is still represented through review-only task families, not a full production graph-drawing engine.
