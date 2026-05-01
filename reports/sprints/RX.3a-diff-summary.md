# Sprint RX.3a: Diff Summary

RX.3a closed `GATE-RX3a-first-lane-mutation-review` and applied the approved producer table/data first lane.

## Protected surfaces

`references/machine/micro-teaching-units.md` and `references/machine/micro-teaching-units.json` changed only through `build-scripts/references/unit-add.js`.

`references/external/` was not changed. Authored source files and RAG chunks were not hand-patched.

## Catalog changes

Added through CLI:

- `A75` Totale winst berekenen uit opbrengsten- en kostentabel, needs `A04`, `A61`
- `A76` Totale winst berekenen uit P, GTK en Q, needs `A14`, `A04`, `A61`
- `A79` Maximale winst bepalen uit TO-TK-tabel, needs `A75`, `A61`

Still outside scope:

- `A77`, `A78`
- `A80`, `A81`
- `HOLD_GRAPHICAL_MO_MK_OPTIMUM`
- held duplicate/overlap records

## Governance artifacts

Added or updated:

- RX.3a human interview and gate closure files
- RX.3a mutation log
- RX.3a generator-blocked tracking
- RX.3a result and sprint metadata
- roadmap version `v2.26-rx3a-first-lane-applied`
- outdated roadmap snapshot for `v2.25-rx3a-first-lane-review-prepared`

## Validation impact

Reference reports and RAG surfaces were regenerated after the catalog mutation. The new units remain generator-blocked/non-interactive, so they are not authorized for student-facing skill-tree or PV projection use.
