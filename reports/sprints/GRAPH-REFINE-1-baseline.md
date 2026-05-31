# Sprint GRAPH-REFINE-1: Baseline

Generated: 2026-05-31

## Scope

Baseline for `GRAPH-REFINE-1`, the graph route operation-chain hardening
planning sprint authorized by `GATE-ENGINE-1`.

This baseline is read-only evidence. No implementation, generated output,
protected reference mutation, target-exercise field write, source exit-ticket
write, candidate storage, target-equivalent claim, Scale Gate 1 reliance, or
student/product use is authorized.

## Plan reference

- Plan: `reports/sprints/GRAPH-REFINE-1-plan.md`
- Plan metadata: `references/data/sprints/GRAPH-REFINE-1.plan.json`

## Governing Evidence

| Evidence | Baseline finding |
|---|---|
| `../4veco-lessen/specifications/product-end-state.md` | The end state requires a visible route to local target-equivalent proof. Graph/table, calculation, constructed-response, and checkpoint interactions use the shared task shell where actions overlap. |
| `../4veco-lessen/specifications/companion-core-specifications.md` | Advisory short checks are separate from target-equivalent exit tickets. Target-equivalent proof must cover the complete reviewed operation chain at the same level with matching answer forms. |
| `reports/review-gates/GATE-ENGINE-1-four-engine-operational-integration/gate-closure.md` | GATE-ENGINE-1 accepted graph/table as the reference pattern but carried a flag that graph needs target-operation validation before target-equivalent use. |
| `reports/sprints/GAME-ARCH-2-target-operation-coverage.md` | The `1.1.3` target chain is table/graph handling, axis convention, graph drawing or point-placement substitute, interpolation, calculation/work capture, and short explanation. |
| `reports/sprints/GRAPH-UX-2-student-route-proof.md` | Current graph route renders through shared route/task-shell and covers useful graph/table task families as local practice only. |

## Target Exercise Baseline

Read-only target exercise source:
`references/authored/course-target-exercises.json`.

`1.1.3 Grafieken en tabellen` target exercise:

- context: ice-cream sales table with prices and quantities;
- subquestion `a`: draw the graph with price on the vertical axis and
  quantity on the horizontal axis;
- subquestion `b`: read/interpolate how many ice creams are sold at EUR 1.75;
- subquestion `c`: identify between which two prices a 50 percent sales drop
  could have happened and explain using the table.

The same record names the main pitfall: putting axes wrong, specifically price
on the horizontal axis instead of vertical.

## Current Graph Route Evidence

Current source/data evidence:

- `build-scripts/content/book-1/b1-113-graphical-data.js`
- `engines/graphical-engine.js`
- `engines/graphical-ui.js`
- `build-scripts/sprints/check-graph-ux2-route-output.js`

Current generated-route proof:

- seven graph tasks;
- shared route panel visible;
- shared task-shell families present:
  - `table_value_selection`;
  - `graph_reading`;
  - `graph_construction_substitute`;
  - `point_placement`;
  - `calculation_work_capture`;
- less-labelled line graph variant present;
- no `1.1.3` exit-ticket page published;
- checkpoint-style graph fixture keeps `targetReadinessEvidence: false`.

## Baseline Gap: Axis Convention

Current `1.1.3` target exercise and specification require:

```text
price on the vertical axis
quantity on the horizontal axis
```

Current graph-route data includes task copy that says:

```text
Prijs staat op de horizontale as.
Hoeveelheid of aantal staat op de verticale as.
Prijs is de x-waarde; aantal kaartjes is de y-waarde.
```

This is a target-chain mismatch. It does not invalidate GRAPH-UX-2 as local
practice proof, but it blocks target-equivalent graph reliance until repaired
and reviewed.

## Other Coverage Gaps Before Target-Equivalent Use

| Operation | Current state | Gap |
|---|---|---|
| Draw graph from table | Point-placement and graph-construction substitutes exist | Need target-aligned P vertical / Q horizontal graph-construction sequence |
| Interpolate EUR 1.75 | Interpolation exists in a different bread-roll context | Need ice-cream table/graph interpolation aligned to target exercise |
| Identify 50 percent drop | Percentage-change calculation exists from EUR 1.00 to EUR 2.00 | Need task that identifies possible price interval from table evidence and explains it |
| Source-use explanation | Source/table values are used locally | Need explicit source observation plus underlying explanation answer form |
| Target-equivalent proof | No published `1.1.3` exit ticket | Held for `L1.7B-Q2` and `GATE-L1.7B-Q2` |

## Protected Surface Baseline

No change is authorized to:

- `references/machine/`;
- `references/external/`;
- `references/authored/course-target-exercises.json`;
- `references/data/exam-ingestion/answer-skill-candidates.json`;
- `source-data/book-*/exit-ticket/*.json`;
- generated Book 1 output;
- graph engine/source implementation files.

## Data integrity notes

No protected reference data may change during GRAPH-REFINE-1.
`references/machine/`, `references/external/`,
`references/authored/course-target-exercises.json`, and
`references/data/exam-ingestion/answer-skill-candidates.json` are read-only or
forbidden for this sprint. `source-data/book-*/exit-ticket/*.json` is also
forbidden. The sprint may inspect current graph route source and generated
output as evidence only.

## Baseline Stop Conditions

Stop GRAPH-REFINE-1 if the sprint attempts to:

- repair graph implementation directly;
- regenerate lesson output;
- create a `1.1.3` exit ticket;
- treat current graph practice as target-equivalent proof;
- hide the axis-convention mismatch;
- authorize diagnostics, adaptive routing, mastery, sequencing, summative use,
  PV, Scale Gate 1, or product use.
