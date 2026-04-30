# Graphical Foundation Coverage

Generated on: 2026-04-30T08:58:25.930Z

This report distinguishes live units, candidate units, held/high-risk units, missing but not-yet-scoped items, and generator-blocked units for the RX graphical foundation layer.

## Summary

- live units: 15
- candidate units: 0
- held/high-risk units: 1
- missing/not-yet-scoped items: 1
- generator-blocked live units: 15

## Coverage Matrix

| Coverage ID | Label | Unit | Status | RX.2b role | Risk | Evidence | Generator |
| --- | --- | --- | --- | --- | --- | --- | --- |
| table_value_selection | Tabelwaarde selecteren voor berekening | A61 | live_unit | baseline_live_dependency | low | target_exercise_evidence | missing_generator_implementation |
| pq_graph_drawing | P-Q grafiek tekenen uit tabel | A45 | live_unit | baseline_live_dependency |  |  | missing_generator_implementation |
| pq_graph_value_reading | Waarden aflezen en interpoleren in P-Q grafiek | A46 | live_unit | baseline_live_dependency |  |  | missing_generator_implementation |
| bar_chart_value_reading | Waarden aflezen uit staafdiagram | A62 | live_unit | approved_mutated_unit_generator_blocked | medium | didactic_prior_rationale | missing_generator_implementation |
| line_graph_value_reading | Waarden aflezen uit lijngrafiek | A63 | live_unit | approved_mutated_unit_generator_blocked | medium | target_exercise_evidence | missing_generator_implementation |
| pie_chart_share_reading | Aandelen aflezen uit cirkeldiagram | A64 | live_unit | approved_mutated_unit_generator_blocked | medium | didactic_prior_rationale | missing_generator_implementation |
| share_times_total | Absolute hoeveelheid berekenen uit aandeel en totaal | A65 | live_unit | approved_mutated_unit_generator_blocked | medium | exam_question_evidence | missing_generator_implementation |
| base_comparison_value_selection | Basiswaarde en vergelijkingswaarde in bron bepalen | A66 | live_unit | baseline_live_dependency | low | target_exercise_evidence | missing_generator_implementation |
| percentage_change_table | Procentuele verandering berekenen vanuit tabel | A67 | live_unit | baseline_live_dependency | low | target_exercise_evidence | missing_generator_implementation |
| percentage_point_distinction | Percentagepuntverandering in aandeel herkennen | A70 | live_unit | baseline_live_dependency | low | target_exercise_evidence | missing_generator_implementation |
| percentage_change_bar_chart | Procentuele verandering berekenen vanuit staafdiagram | A68 | live_unit | approved_mutated_unit_generator_blocked | medium | didactic_prior_rationale | missing_generator_implementation |
| percentage_change_line_graph | Procentuele verandering berekenen vanuit lijngrafiek | A69 | live_unit | approved_mutated_unit_generator_blocked | medium | target_exercise_evidence | missing_generator_implementation |
| percentage_change_pie_chart | Procentuele verandering berekenen vanuit cirkeldiagram | A71 | held_high_risk_unit | held_high_risk_for_later_focused_review | high | didactic_prior_rationale | not_applicable_until_mutated |
| index_from_table | Indexcijfer berekenen vanuit tabel | A72 | live_unit | baseline_live_dependency | low | target_exercise_evidence | missing_generator_implementation |
| index_change_line_graph | Indexverandering aflezen uit lijngrafiek | A73 | live_unit | approved_mutated_unit_generator_blocked | medium | target_exercise_evidence | missing_generator_implementation |
| percentage_change_index_values | Procentuele verandering berekenen vanuit indexcijfers | A74 | live_unit | baseline_live_dependency | low | target_exercise_evidence | missing_generator_implementation |
| producer_graph_foundation | Producentengrafiek en TO-TK grafiek lezen | A77/A78/A80/A81 | deferred_not_rx2b_scope | deferred_to_later_rx_sprint |  |  | not_applicable |
| elasticity_graph_foundation | Elasticiteit vanuit bron of vraaggrafiek | A82/A83/A84 | deferred_not_rx2b_scope | deferred_to_later_rx_sprint |  |  | not_applicable |
| other_chart_forms | Andere diagramtypen zoals spreidingsdiagram of gestapelde staaf |  | missing_not_yet_scoped | missing_but_not_yet_scoped |  |  | not_applicable |

## Generator-Blocked Live Units

| Unit | Generator | Status |
| --- | --- | --- |
| A61 | GEN_A61 | missing_generator_implementation |
| A45 | GEN_A45 | missing_generator_implementation |
| A46 | GEN_A46 | missing_generator_implementation |
| A62 | GEN_A62 | missing_generator_implementation |
| A63 | GEN_A63 | missing_generator_implementation |
| A64 | GEN_A64 | missing_generator_implementation |
| A65 | GEN_A65 | missing_generator_implementation |
| A66 | GEN_A66 | missing_generator_implementation |
| A67 | GEN_A67 | missing_generator_implementation |
| A70 | GEN_A70 | missing_generator_implementation |
| A68 | GEN_A68 | missing_generator_implementation |
| A69 | GEN_A69 | missing_generator_implementation |
| A72 | GEN_A72 | missing_generator_implementation |
| A73 | GEN_A73 | missing_generator_implementation |
| A74 | GEN_A74 | missing_generator_implementation |

## Backlog

### other_chart_forms

- status: missing_not_yet_scoped
- next_action: Do not mint from abstract possibility. Add only if target exercises or exam evidence show scatterplots, stacked bars, or other chart forms requiring explicit representation-reading units.
- proof_required_to_close: Evidence-backed row exists in a later representation-operation inventory or the item is explicitly closed as out of current course scope.
### A71

- status: held_high_risk
- next_action: Run a later focused review for pie-chart percentage-change composition.
- proof_required_to_close: Procedure and evidence show how to handle share versus absolute quantity, changing totals, percentage-point versus percentage change, and reconstruction before calculation.

## Interpretation

- RX.2b has not mutated the live unit catalog.
- A62, A63, and A64 are the missing representation-reading foundation candidates and require explicit human review before CLI mutation.
- A71 remains high risk and can be held while the lower-risk graphical foundation queue proceeds.
- Student-facing skill-tree exposure remains blocked until generators are implemented and validated in a later sprint.
