# VISUAL-QA-HARDEN-2 Product QA Rubric

Generated: 2026-06-05

## Purpose

This rubric defines the visual/product QA floor for the repaired
first-three-paragraph Check surfaces before `CHECK-SURFACE-PREGATE-1`.

It is intentionally stricter than a screenshot-presence check. A surface passes
only when the proof shows the right student action, context visibility,
feedback state, next action, and authority boundary.

## Rubric

| Area | Required proof | Hard fail if |
|---|---|---|
| `1.1.3` advisory short check | Source/table context blocks, task-shell tasks, `graph_construction_substitute`, `graph_reading`, `table_value_selection`, visible graph grid, targeted retry feedback, route advice, mobile proof, dark proof | The short check is ordinary choice-only, has no graph/table interaction, has no context blocks, has no graph workspace, or gives no route advice |
| `1.1.3` exit ticket | Source/task split workspace, constrained scrollable source pane, sticky question strip, visible graph workspace and grid, same-workspace graph line, targeted feedback, all tasks matched, completion language held, mobile proof, dark proof | Source context appears only as a block above tasks, the source pane is not scrollable, graph line is outside the workspace, or completion language becomes visible before review authority |
| Route copy | Landing pages distinguish `Korte check` as local advisory advice and `Exit ticket` as end check, with different badges, purposes, action text, and data attributes | Landing pages use generic check copy, hide the route difference, or imply the short check is a target-equivalent proof |
| Screenshot evidence | Manifests/proof contain DOM inspection objects and state facts such as task counts, context counts, graph workspace, grid lines, feedback, source-pane metrics, viewport, and theme | The proof only lists image files or page existence |
| Student experience | A pre-gate artifact must explicitly judge whether a typical 4 vwo student can orient, act, receive feedback, and know the next action | Lead review passes from validators/screenshots alone without product-end-state judgement |
| Authority boundary | All proof keeps product-route adoption, new completion language, diagnostics, mastery/sequencing, PV, Scale Gate 1, and student/product use false | Any proof or report broadens authority |

## Regression Mapping

| Reset finding | Required hard-fail guard |
|---|---|
| `CSR1-F1` short check lacks graph/table interaction | Check source data and rendered proof for graph/table task-shell families and graph workspace |
| `CSR1-F2` no context/task shell | Check context block count and task-shell count from source data and proof |
| `CSR1-F3` exit ticket lacks split graph workspace | Check source-task workspace DOM/proof, source-pane metrics, sticky question strip, graph workspace, and source-scroll visibility |
| `CSR1-F4` weak visual QA | Require consolidated proof with inspection objects and product checks beyond screenshots |
| `CSR1-F5` lead review missed product defects | Require future `CHECK-SURFACE-PREGATE-1` to include student-experience/product-end-state judgement |

## Boundary

This rubric prepares review evidence only. It does not authorize a retry gate,
gate closure, generated-output changes, product use, broad route adoption, new
completion language, diagnostics, mastery/sequencing, PV, or Scale Gate 1.
