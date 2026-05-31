# Sprint GAME-ARCH-2: Target-Operation Coverage Model

Generated: 2026-05-31

## Purpose

Define how target-exercise operation chains should drive route, practice, and
checkpoint composition for the first Book 1 paragraph types.

This is not target-equivalent proof. It is the architecture model that future
implementation and `GATE-ENGINE-1` should inspect.

## Paragraph Coverage

| Paragraph | Target-operation chain | Current practice coverage | Advisory short-check role | Missing before target-equivalent proof |
|---|---|---|---|---|
| `1.1.1` Schaarste en economisch denken | Calculate revenue; identify opportunity costs; calculate mixed profit; compare choices; explain better choice using scarcity | Reasoning route supports scarcity and opportunity-cost reasoning; procedure/math support can cover calculations; current check samples local understanding | Useful as in-between advice: practise scarcity, opportunity costs, or calculation support before exit ticket | A full same-level task must combine calculation, opportunity-cost identification, comparison, and scarcity explanation |
| `1.1.2` Percentages en indexcijfers | Calculate percentage change; calculate price index; calculate percentage change from index values; explain why index-point change differs from percentage change | Math route covers `A38`/`A39` through numeric input, calculation/work capture, final answer, and notation fields; reasoning route can practise explanation | May advise practice on percentage change, price index, or explanation before thorough checkpoint | A complete checkpoint must compose numeric work, notation/unit checks, final answer, and short explanation of the index-point trap |
| `1.1.3` Grafieken en tabellen | Draw P-Q graph from table; place price on vertical axis and quantity on horizontal axis; read/interpolate sales; identify 50 percent drop and explain with table evidence | Graph route covers table selection, graph reading, axis convention, interpolation, point placement, graph-construction substitute, calculation/work capture, and less-labelled variant | May advise graph/table practice before checkpoint | A complete checkpoint must compose graph/table operations, source use, calculation evidence, and short explanation |

## Coverage By Task Family

| Operation need | Task-shell family | Current proof status | Future checkpoint use |
|---|---|---|---|
| Numeric calculation | `numeric_input` | live math/graph practice | Required for `1.1.1`, `1.1.2`, and some `1.1.3` tasks |
| Work capture | `calculation_work_capture` | live math/graph practice | Required where answer form needs visible work |
| Final answer | `final_answer_entry` | live math practice | Required for calculation exit-ticket answers |
| Unit/notation | `unit_notation_field` | live math practice | Required for percent, index, unit, and notation checks |
| Table lookup | `table_value_selection` | live graph practice | Required for graph/table target chains |
| Graph reading | `graph_reading` | live graph practice | Required for read/interpolate tasks |
| Point placement | `point_placement` | live graph practice | Substitute for graph construction until drawing is reviewed |
| Graph construction steps | `graph_construction_substitute` | live graph practice | Required when drawing cannot be rendered as exact freehand graphing |
| Short explanation | `short_constructed_response` or `structured_reasoning` | live reasoning self-check, not evaluated proof | Required for target-equivalent answer-form quality later |
| Source use | `table_value_selection` plus underlying answer form | live graph practice as local source use | Must combine source observation with explanation/calculation/classification/graph form |

## Coverage Rules

1. Practice coverage can be narrower than target-equivalent proof, but it must
   name which operation it prepares.
2. Advisory short checks may sample local evidence and give advice, but cannot
   claim complete operation-chain coverage.
3. Target-equivalent checkpoint composition must cover every reviewed
   operation needed by the paragraph target exercise.
4. Graph/table and calculation operations can use deterministic families.
5. Explanation, reasoning, source use, and answer construction need
   answer-form standards before proof language.
6. `bron`/source-use behavior must be treated as a modifier plus underlying
   answer form, not a complete task by itself.

## Architecture Handoff

Future implementation should attach operation-chain coverage to route and task
data as reviewed metadata, for example:

```json
{
  "operationChain": {
    "paragraph": "1.1.3",
    "targetExercise": "graph_table_target",
    "operations": [
      "table_value_selection",
      "axis_convention",
      "graph_reading",
      "interpolation",
      "point_placement",
      "calculation_work_capture",
      "short_explanation_with_source"
    ],
    "targetEquivalent": false
  }
}
```

The `targetEquivalent` field remains false until the separate target-equivalent
exit-ticket implementation and review gate approve a specific output.
