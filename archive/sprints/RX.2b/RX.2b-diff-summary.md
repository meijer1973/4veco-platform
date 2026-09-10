# Sprint RX.2b: Diff Summary

## Summary

RX.2b closes the graphical-foundation mutation-review gate and applies the seven authorized representation-sensitive A-domain units through `unit-add.js`.

## Added

- `GATE-RX2b-graphical-foundation` human interview files
- `GATE-RX2b-graphical-foundation` gate closure files
- RX.2b CLI mutation log
- RX.2b generator-blocked/non-interactive tracking
- RX.2b gate closure and mutation execution helper
- RX.2b post-mutation checker
- graphical-foundation coverage report
- seven new machine-unit entries:
  - `A62` Waarden aflezen uit staafdiagram
  - `A63` Waarden aflezen uit lijngrafiek
  - `A64` Aandelen aflezen uit cirkeldiagram
  - `A65` Absolute hoeveelheid berekenen uit aandeel en totaal
  - `A68` Procentuele verandering berekenen vanuit staafdiagram
  - `A69` Procentuele verandering berekenen vanuit lijngrafiek
  - `A73` Indexverandering aflezen uit lijngrafiek

## Updated

- RX.2b sprint plan now reflects gate closure plus authorized CLI execution.
- RX.2b sprint result/result JSON records protected reference data changed through CLI only.
- `references/machine/micro-teaching-units.md` and `.json` were updated by `unit-add.js`.
- Graphical-foundation coverage now marks the approved lane as live and generator-blocked.
- `A71` is explicitly held/high-risk rather than silently dropped.
- The live roadmap moves from RX.2b planned state to RX.2b completed state and sets Sprint 6 as the next sprint.
- Roadmap version index adds an archived v2.15 snapshot and points the active roadmap to v2.16.
- Generated reports, RAG chunks/evals, source manifest, document inventory, gate bundle URLs, and global URL index were refreshed.

## Protected surfaces

Protected reference data changed only through the approved CLI:

- `references/machine/micro-teaching-units.md`
- `references/machine/micro-teaching-units.json`

No hand edits were made to protected reference surfaces.

RX.2b did not modify:

- `references/external/`
- authored source data
- RAG chunks by hand

## Human review state

`GATE-RX2b-graphical-foundation` is closed as `pass_with_conditions`.

The gate authorizes only the seven-unit graphical foundation lane. It keeps `A71`, producer candidates, elasticity candidates, and held duplicate/overlap records blocked.

## Generator state

All seven new units remain blocked for student-facing skill-tree use until their generators are implemented and validated:

- `GEN_A62`
- `GEN_A63`
- `GEN_A64`
- `GEN_A65`
- `GEN_A68`
- `GEN_A69`
- `GEN_A73`
