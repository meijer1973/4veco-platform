# EXAM-SOURCE-AUTH-1 Source Authority Contract

Generated: 2026-06-03

## Purpose

This report defines the minimum authority required before later sprints may
claim real exam evidence for source reconstruction or transformed shared-task
proof.

The contract is intentionally narrow. It covers only
`vw-1022-a-25-1-o:opgave-1:question-3` and does not reconstruct the source,
render task context, or create transformed tasks.

## Canonical sourceAuthority

```json
{
  "kind": "external_primary",
  "exam_item_id": "vw-1022-a-25-1-o:opgave-1:question-3",
  "overlay_path": "references/data/exam-ingestion/exam-item-overlays.json",
  "prompt_pdf": "references/external/exams/vw-1022-a-25-1-o.pdf#question-3",
  "correction_pdf": "references/external/exams/vw-1022-a-25-1-c.pdf#question-3",
  "source_material_id": "table-1-zoohee-zorgverzekering"
}
```

## Source material requirements

The source material is the overlay table
`table-1-zoohee-zorgverzekering`.

Required values:

| variant | eigen_risico_per_jaar_eur | premie_per_maand_eur |
|---|---:|---:|
| wettelijk eigen risico | 385 | 108.25 |
| verhoogd eigen risico | 885 | 86.25 |

Later reconstruction must preserve these source values and cite the same
source material ID. If a later graph/table/SVG differs, it must be flagged as a
reconstruction error rather than treated as a new source.

## Answer-model requirements

The correction-model authority is
`references/external/exams/vw-1022-a-25-1-c.pdf#question-3`.

Later transformed tasks must cite answer-model references for:

- `q3-step-1`
- `q3-step-2`
- `q3-pr-1`
- `q3-pr-2`

The required threshold claim is `EUR 649`; later tasks may teach or check the
calculation only when the operation trace remains tied to the official answer
model.

## Forbidden proof forms

The following are not exam proof:

- `official-style`
- `exam-style`
- `local review data`
- `local official-style source`
- `reconstructed local source`

A local reconstruction may become a reviewed representation only after a later
source-reconstruction sprint, and only while retaining the external-primary
sourceAuthority above. It cannot replace the official prompt/correction PDFs
as proof.

## Boundary

This sprint authorizes no source reconstruction, task-shell context rendering,
task transformation, generated lesson output, protected reference mutation,
source-data mutation, product-route adoption, target-equivalent proof,
diagnostics, adaptive routing, mastery/sequencing, PV, Scale Gate 1, or
student/product use.

## Validation

The deterministic checker is
`build-scripts/sprints/check-exam-source-authority1.js`.

It verifies the contract against the selected overlay record, external question
mirror, official PDF paths, source table values, answer-model references,
future transformed-task authority shape, and negative fixtures for forbidden
proof forms.
