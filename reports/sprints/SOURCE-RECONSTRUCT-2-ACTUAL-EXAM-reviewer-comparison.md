# SOURCE-RECONSTRUCT-2-ACTUAL-EXAM Reviewer Comparison

## Review Purpose

This packet lets a reviewer compare the reconstructed source blocks with the
authorized prompt PDF and correction PDF before later task-ingestion work uses
them.

## Prompt PDF Comparison

| Check | Prompt PDF evidence | Reconstruction evidence |
|---|---|---|
| Selected item | Opgave 1, vraag 3 in `vw-1022-a-25-1-o.pdf`. | `sourceAuthority.exam_item_id` is `vw-1022-a-25-1-o:opgave-1:question-3`. |
| Source table | Tabel 1 names the Zoohee health insurance table. | `sourceMaterials[0].caption` is `Tabel 1: Zoohee! zorgverzekering`. |
| Standard deductible row | Variant has deductible 385 and monthly premium 108,25. | Row 1 contains `wettelijk eigen risico`, `385`, `108,25`. |
| Increased deductible row | Variant has deductible 885 and monthly premium 86,25. | Row 2 contains `verhoogd eigen risico`, `885`, `86,25`. |
| Prompt intent | Calculate the yearly care-cost threshold where the increased deductible is cheaper. | `normalizedSource.student_prompt` preserves that calculation request. |

## Correction PDF Comparison

| Check | Correction PDF evidence | Reconstruction evidence |
|---|---|---|
| Step `q3-step-1` | Annualize 108,25 and add the standard deductible. | `correctionModelComparison.operationIds` includes annualizing monthly premium and comparing deductible exposure. |
| Step `q3-step-2` | Annualize 86,25 and derive the yearly threshold. | `correctionModelComparison.operationIds` includes deriving and stating the threshold with direction. |
| Threshold evidence | The model records threshold `EUR 649`. | Stored as comparison evidence only; hidden from rendered lab. |

## Rendered Proof To Inspect

- Lab: `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-rendered-lab.html`
- Screenshot manifest: `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-screenshot-manifest.md`
- Proof JSON: `reports/json/source-reconstruct2-actual-exam-proof.json`

## Reviewer Stop Conditions

Stop before closure if any table value, unit, label, row order, caption, source
reference, answer-model comparison, rendered screenshot, protected-reference
boundary, source-data boundary, or generated-output boundary is missing or
contradicts the authorized PDFs.
