# Gemengde-opgaven Target Standard

Status: active standard from `MIXED-OPGAVEN-TARGET-STANDARD-1`.

## Definition

A `gemengde_opgaven` paragraph introduces no new economic theory. Its target is
transfer: students use skills from the preceding theory paragraphs in longer,
less signposted, source-heavy contexts.

The paragraph deepens the chapter by requiring students to select relevant
source information, choose the correct operation family, combine procedures,
interpret tables or graphs, and write structured economic conclusions.

## What Mixed Sections May Do

- Consolidate skills from the preceding theory paragraphs.
- Use longer text sources than starter exercises.
- Use tables, graphs, formulas, or multi-source business cases.
- Require students to decide which information and formula family apply.
- Ask calculation, interpretation, explanation, and decision questions in one
  context.
- Teach compact answer-construction routines such as formula, substitution,
  result, unit, and conclusion.

## What Mixed Sections May Not Do

- Introduce a new economic concept or rule that belongs in a theory paragraph.
- Present a placeholder target as reviewed-final evidence.
- Tell students step by step which operation to use in every subquestion.
- Promote a mixed target without explicit target-acceptance evidence.
- Authorize companion/product scaling, diagnostics, adaptive routing, mastery,
  sequencing, summative use, or student-facing AI.

## Required Target-Record Fields

A reviewed-final mixed target must satisfy these fields:

```text
paragraph_kind: gemengde_opgaven
introduces_new_theory: false
record_status: reviewed_final
target_exercise.placeholder: absent or false
target_exercise.context: multi-source, context-heavy transfer case
target_exercise.subquestions: source selection + calculation + table/graph interpretation + economic conclusion
v5_migration.review_required_before_final: false
```

The target should include a `mixed_target_profile` when the registry validator
supports it:

```json
{
  "integrates_paragraphs": ["2.1.1", "2.1.2", "2.1.3"],
  "source_selection_required": true,
  "answer_construction_required": true,
  "table_or_graph_interpretation_required": true,
  "no_new_theory": true
}
```

## Required Source Complexity

A reviewed mixed target must include:

- at least one context text source;
- at least one table or graph source;
- at least one source-selection demand where students must decide which data
  matter;
- no source that pre-sorts every number by operation.

Not every mixed paragraph needs both a table and a graph in the same target, but
the course should expose students to both across mixed sections. If a preceding
theory paragraph explicitly taught graph interpretation, the mixed section
should include table or graph transfer evidence and explain any absence.

## Required Skill Integration

The target must combine skills from at least two preceding theory paragraphs.
For `2.1.4`, the expected integration is:

- `2.1.1`: `TCK`, `TVK`, `TK`, `GCK`, `GVK`, `GTK`;
- `2.1.2`: `TO`, `GO`, winst, break-even, `TK`/`TO` graph interpretation;
- `2.1.3`: `MK`, `MO`, `Delta TK / Delta Q`, `Delta TO / Delta Q`.

The main difficulty is operation selection, not simply larger numbers.

## Required Answering-Skill Evidence

A mixed section must give students a compact answer route for context-heavy
questions. It may be short, but it must be visible before or near the mixed
tasks:

- calculation: formula -> substitution -> result -> unit -> conclusion;
- table interpretation: change -> per-step calculation -> comparison ->
  conclusion;
- graph interpretation: point/line -> values -> comparison -> meaning;
- explanation: position -> because/reasoning -> source or calculation link.

This is exam literacy, not new economic theory.

## Required Table/Graph Interpretation Evidence

The target or exercise route must ask students to interpret table or graph
evidence, not only calculate from it. A passing mixed target includes at least
one subquestion where the answer must name a pattern, compare values, or explain
what a point/step means economically.

## Review Checklist

Use this checklist before promoting a `gemengde_opgaven` target:

| Criterion | Pass condition |
|---|---|
| No new theory | The section uses earlier theory only. |
| Skill integration | At least two preceding theory paragraphs are integrated. |
| Source selection | Students decide which source data matter. |
| Context depth | Context is richer than starter exercises. |
| Answer structure | Structured calculation and explanation guidance is present. |
| Table/graph transfer | Table or graph interpretation is required. |
| Target visibility | A clear doeloefening or equivalent target represents the end state. |
| Registry clarity | The target is non-placeholder before reviewed-final status. |
| Status clarity | `paragraph_kind` remains `gemengde_opgaven` and `introduces_new_theory` remains false. |

## Promotion Rule

A `gemengde_opgaven` target may move to `reviewed_final` only when:

1. the target record is no longer placeholder-backed;
2. the mixed-target review checklist passes;
3. validator support rejects reviewed-final mixed placeholders;
4. review evidence explicitly says this is the intended target form for a
   mixed-exercise section.

PASS WITH FLAGS may not carry a missing core requirement.

## Reusable Target Template

```text
Students use a multi-source context to combine the skills from the preceding
theory paragraphs. They identify relevant source information, select the
correct operation family, calculate required values, interpret a table or graph,
and write a structured economic conclusion. The target introduces no new
economic theory.
```

## 2.1.4 Application Notes

For `2.1.4 Gemengde opgaven: kosten en opbrengsten`, the SmoothBox
doeloefening is the representative mixed target after the sprint adds compact
answer-structure guidance. It combines normal production formulas, break-even
interpretation, table-based marginal reasoning, and an economic conclusion
about extra production. It remains a consolidation and transfer section, not a
new theory paragraph.
