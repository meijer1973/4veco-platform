# Sprint MTU-H2J: Diff Summary

Generated: 2026-05-28

## Summary

MTU-H2J executed the coupled A20/A94/A95 lane authorized by GATE-MTU-H2I.
The diff narrows `A20`, mints `A94` and `A95`, updates the two affected
authored target-exercise mappings, moves the old `GEN.A20` interaction to
`GEN.A95`, and refreshes downstream reports.

## Protected surfaces

`references/machine/micro-teaching-units.*` changed through the reference CLI
only. `references/external/` did not change. `references/authored/` changed
only for the reviewed target-exercise mapping arrays. No target-exercise
promotion, candidate write, lesson output, PV projection, PV machine promotion,
or student/product use occurred.

## Unit changes

- `A20` was updated to `Winstmaximum oplossen met afgeleide MO en MK`.
- `A20` retains `needs: [A12, A13, A02]` and exam codes
  `[A2.10, A2.11, A2.12]`.
- `A94` was added for price-taker `MO = marktprijs P` plus derived MK.
- `A95` was added for given MK-function solving, distinct from `A91` given
  constant/value MK.

## Mapping changes

- `3.2.2`: `A20` was replaced by `A94`; `A20` was removed from prior knowledge;
  `A94` was introduced.
- `3.3.3`: unchanged and still uses `A20` for the derived-MO plus derived-MK
  route.
- `4.1.2`: `A20` was replaced by `A91` in required skills and prior knowledge.

## Generator route

- Current `GEN.A20` behavior was moved to `GEN.A95`.
- `GEN.A20` is absent/blocked until a narrowed derive-both generator exists.
- `GEN.A94` remains absent/blocked unless separately implemented.

## Projection refresh

After source mutation, the sprint refreshed generator readiness, owned-content
graph, RAG chunks, procedure-visual inventory/coverage, roadmap indexes, source
registries, URL index, and GitHub agent indexes. These are generated
projections; they are not independent source authority.

## Residual risk

The main residual risk is student-facing exposure before generator work is
complete. `A20` and `A94` must remain generator-blocked / not-yet-interactive
until matching generator implementations and exposure gates pass.
