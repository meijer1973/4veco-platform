# Sprint MTU-H3C: Diff Summary

Generated: 2026-05-28

## Authorized source changes

- `D41` was minted for tax wedge and `Pc`/`Pp` graphical labeling.
- `D42` was minted for euro tax-burden calculation with `needs: []` and
  `zero_needs_status: true_zero`.
- `D43` was minted for subsidy effective prices.
- `D45` was minted for qualitative incidence explanation with relative
  elasticities.
- `D46` was minted for cost-shock pass-through share, distinct from `A93`.
- `D07` was narrowed to `Heffing afwentelingspercentage berekenen`, with
  `needs: ["D42", "A38"]` and no `A15` dependency.

## Authored mapping changes

- `3.1.1`: replaced the over-triggered `D07` route with `D41` and cleared the
  tax-wedge missing-unit flag.
- `3.1.2`: added graph-context `D41`, euro-burden `D42`, and narrowed `D07`;
  retained the surplus-accounting missing-unit flag.
- `3.1.3`: added `D43` for subsidy effective prices; kept `D44` unmapped.

## Boundaries preserved

- `D44` was not minted or mapped.
- `A93` was not changed or generalized into pass-through share.
- No `references/external/` files changed.
- No target-exercise promotion/status/source/placeholder/paragraph metadata
  changes were authorized.
- No lesson output, PV projection, PV machine promotion, diagnostics,
  adaptive routing, mastery/sequencing, student-facing AI, summative use, or
  student/product use was authorized.

## Generated projections refreshed

After the source mutations, the sprint refreshed owned-content graph, RAG
chunks, procedure/PV reports, source registries, URL index, GitHub indexes,
roadmap files, and sprint-bundle records.
