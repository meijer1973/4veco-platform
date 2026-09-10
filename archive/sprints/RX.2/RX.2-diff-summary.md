# Sprint RX.2: Diff Summary

## Summary

RX.2 now closes the first-lane mutation-review gate and applies the six authorized representation-sensitive A-domain units through `unit-add.js`.

## Added

- `GATE-RX2-first-lane-mutation-review` human interview files
- `GATE-RX2-first-lane-mutation-review` gate closure files
- RX.2 CLI mutation log
- RX.2 generator-blocked/non-interactive tracking
- RX.2 gate closure and mutation execution helper
- RX.2 post-mutation checker
- six new machine-unit entries:
  - `A61` Tabelwaarden selecteren voor berekening
  - `A66` Basiswaarde en vergelijkingswaarde in bron bepalen
  - `A67` Procentuele verandering berekenen vanuit tabel
  - `A70` Percentagepuntverandering in aandeel herkennen
  - `A72` Indexcijfer berekenen vanuit tabel
  - `A74` Procentuele verandering berekenen vanuit indexcijfers

## Updated

- RX.2 sprint plan now reflects gate closure plus authorized CLI execution.
- RX.2 sprint result/result JSON now records protected reference data changed through CLI only.
- `references/machine/micro-teaching-units.md` and `.json` were updated by `unit-add.js`.
- Live roadmap moves from review-prepared state to RX.2 first-lane applied state.
- Roadmap version index adds an archived v2.11 snapshot and points the active roadmap to v2.12.
- Generated reports, RAG chunks/evals, source manifest, document inventory, gate bundle URLs, and global URL index were refreshed.

## Protected surfaces

Protected reference data changed only through the approved CLI:

- `references/machine/micro-teaching-units.md`
- `references/machine/micro-teaching-units.json`

No hand edits were made to protected reference surfaces.

RX.2 did not modify:

- `references/external/`
- authored source data
- RAG chunks by hand

## Human review state

`GATE-RX2-first-lane-mutation-review` is closed as `pass_with_conditions`.

The gate authorizes only the six-unit first lane. It keeps chart-only, line-graph, elasticity, producer, and held duplicate/overlap candidates blocked.

## Generator state

All six new units remain blocked for student-facing skill-tree use until their generators are implemented and validated:

- `GEN_A61`
- `GEN_A66`
- `GEN_A67`
- `GEN_A70`
- `GEN_A72`
- `GEN_A74`
