# SOURCE-RECONSTRUCT-2-ACTUAL-EXAM Normalized Source

## Authority

- Sprint: `SOURCE-RECONSTRUCT-2-ACTUAL-EXAM`
- Exam item: `vw-1022-a-25-1-o:opgave-1:question-3`
- Prompt PDF: `references/external/exams/vw-1022-a-25-1-o.pdf#question-3`
- Correction PDF: `references/external/exams/vw-1022-a-25-1-c.pdf#question-3`
- Source material: `table-1-zoohee-zorgverzekering`

## Normalized Prompt

Vraag 3 asks the student to calculate up to which yearly care-cost amount the
increased deductible is cheaper.

Student-facing prompt:

```text
Bereken tot welk bedrag aan zorgkosten per jaar het voor een jongere voordeliger is om een verhoogd eigen risico te nemen.
```

## Source Context

Bron 1 introduces a comparison between two variants of the same health
insurance. The values the student needs are in Tabel 1: yearly deductible and
monthly premium for each variant.

## Semantic Source Table

| Variant | Eigen risico per jaar (euro) | Premie per maand (euro) |
|---|---:|---:|
| wettelijk eigen risico | 385 | 108,25 |
| verhoogd eigen risico | 885 | 86,25 |

Table reconstruction status:

- Semantic table, not a copied image.
- Row order preserved: wettelijk eigen risico, then verhoogd eigen risico.
- Units preserved in headers: per year for deductible, per month for premium.
- Caption: `Tabel 1: Zoohee! zorgverzekering`.
- Source label: `Tabel 1`.

## Operation Notes From Correction Model

The correction model confirms two calculation moves that later task-ingestion
work must preserve:

- Annualize the monthly premium before comparing yearly costs.
- Compare yearly cost exposure between the standard deductible variant and the
  increased deductible variant, with answer threshold evidence `EUR 649`.

The rendered review lab for this sprint must not show the answer threshold or
worked answer amounts. Those values are comparison evidence only.

## Product Boundary

This artifact authorizes source reconstruction only. It does not authorize task
transformation, generated lesson output, protected reference mutation,
source-data mutation, product-route adoption, target-equivalent proof,
diagnostics, adaptive routing, mastery/sequencing, PV, Scale Gate 1, or
student/product use.
