# SOURCE-RECONSTRUCT-2-ACTUAL-EXAM Source Map

## PDF Evidence

| Reconstruction field | External PDF reference | Evidence anchor |
|---|---|---|
| Exam item authority | `references/external/exams/vw-1022-a-25-1-o.pdf#question-3` | `Opgave 1` and `vraag 3` on prompt page 2 |
| Source table title | `references/external/exams/vw-1022-a-25-1-o.pdf#page=2` | `Tabel 1 Zoohee! zorgverzekering` |
| Student prompt | `references/external/exams/vw-1022-a-25-1-o.pdf#page=2` | `Bereken tot welk bedrag` |
| Correction-model steps | `references/external/exams/vw-1022-a-25-1-c.pdf#page=6` | `12 x 108,25`, `12 x 86,25`, and threshold `649` |

## Table Value Map

| Source value | Reconstructed location | Unit | External PDF reference |
|---|---|---|---|
| wettelijk eigen risico | `sourceMaterials[0].rows[0].variant` | variant label | prompt PDF page 2 |
| 385 | `sourceMaterials[0].rows[0].eigen_risico_per_jaar_eur` | euro per year | prompt PDF page 2 |
| 108,25 | `sourceMaterials[0].rows[0].premie_per_maand_eur` | euro per month | prompt PDF page 2 |
| verhoogd eigen risico | `sourceMaterials[0].rows[1].variant` | variant label | prompt PDF page 2 |
| 885 | `sourceMaterials[0].rows[1].eigen_risico_per_jaar_eur` | euro per year | prompt PDF page 2 |
| 86,25 | `sourceMaterials[0].rows[1].premie_per_maand_eur` | euro per month | prompt PDF page 2 |

## Context Block Map

| Context block | Type | Source authority | Review note |
|---|---|---|---|
| `ctx-zoohee-prompt` | `markdown` | prompt PDF question 3 | Carries the prompt only; no answer amount. |
| `ctx-zoohee-source` | `source_excerpt` | prompt PDF source context | Paraphrases the table context for orientation. |
| `ctx-zoohee-table` | `table` | prompt PDF table 1 | Semantic table with exact values and units. |
| `ctx-zoohee-formula` | `formula` | correction PDF question 3 | Operation note for annualizing premium; comparison only. |

## Boundary Map

The source map covers only source reconstruction and correction-model
comparison evidence. It does not map to task-family exercises, generated
lesson output, protected reference writes, source-data writes, product routes,
diagnostics, adaptive routing, mastery/sequencing, PV, Scale Gate 1, or
student/product use.
