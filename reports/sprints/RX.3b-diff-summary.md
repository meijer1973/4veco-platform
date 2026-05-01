# Sprint RX.3b: Diff Summary

RX.3b closed `GATE-RX3b-producer-graph-lane-review` and applied the approved producer TO-TK graph lane.

## Protected surfaces

`references/machine/micro-teaching-units.md` and `references/machine/micro-teaching-units.json` changed only through `build-scripts/references/unit-add.js`.

`references/external/` was not changed. Authored source files and RAG chunks were not hand-patched.

## Catalog changes

Added through CLI:

- `A77` Break-even aflezen uit TO-TK-grafiek, needs `A63`, `A29`
- `A78` Winst of verlies aflezen uit TO-TK-grafiek, needs `A63`, `A75`, `A77`

Still outside scope:

- `A80`, `A81`
- `HOLD_GRAPHICAL_MO_MK_OPTIMUM`
- real PV producer-graph templates
- held duplicate/overlap records

## Governance artifacts

Added or updated:

- RX.3b human interview and gate closure files
- RX.3b mutation log
- RX.3b generator-blocked tracking
- RX.3b result and sprint metadata
- roadmap version `v2.28-rx3b-graph-lane-applied`
- outdated roadmap snapshot for `v2.27-rx3b-graph-lane-review-prepared`

## Validation impact

Reference reports and RAG surfaces were regenerated after the catalog mutation. The new units remain generator-blocked/non-interactive, so they are not authorized for student-facing skill-tree or PV projection use.
