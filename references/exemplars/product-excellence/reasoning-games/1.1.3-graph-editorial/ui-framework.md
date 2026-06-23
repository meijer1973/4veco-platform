# Reasoning-game UI framework — graph reasoning (§1.1.3) — v2

## 1. Preserve the product grammar; derive the reasoning grammar

Preserve across paragraph reasoning games:

- source-left / task-right on desktop;
- source before tasks on mobile;
- three short tasks with a visible route;
- one click per normal action;
- immediate selection state;
- local repair;
- stable card positions;
- feedback after checking;
- visible construction of an exam-usable answer.

For §1.1.3, derive a new reasoning grammar:

```text
graph evidence → observation versus estimate → scope of conclusion
```


## 2. Put task-defining source information before the evidence display

A headline, claim, instruction or question that determines what the student must inspect is not supplementary metadata. Place it in the first source viewport, after the shortest necessary context and before the graph/table used to test it.

Good source order:

```text
goal → concise context → claim/headline → graph → table
```

Bad source order:

```text
goal → context → graph → table → hidden claim at the bottom
```

The source pane may be long, but the student must know what they are looking for before scanning it.

## 3. Use independent desktop scrolling when both panes are long

For a source-heavy reasoning surface, desktop source and task panes must be independent scroll containers. This lets the student keep the current question fixed while retrieving evidence, or keep evidence fixed while moving between questions.

Required behavior:

- bounded desktop workspace height;
- `overflow-y: auto` on both panes;
- `min-height: 0` for grid/flex children;
- `overscroll-behavior-y: contain` to prevent scroll chaining;
- stable, visible scrollbar space;
- focus-visible treatment on each pane;
- source and task `scrollTop` values remain independent;
- mobile uses a single natural page flow without nested vertical scrolling.

This is functional learning design, not decoration: it reduces memory load when students compare a question with distributed source evidence.

## 4. The graph must be evidence, not decoration

At least one core task must require direct graph interaction. Students may use the accompanying table for accessibility and exact values, but they must still select evidence in the graph.

Do not turn the reasoning game into graph drawing. Construction belongs in graph practice or an exit ticket. Here the graph is a source used to justify claims.

## 5. Keep three epistemic levels distinct

The interface must distinguish:

1. **observed point** — directly present in the source;
2. **interpolated estimate** — between observed points under a stated line assumption;
3. **unsupported generalisation** — goes beyond the compared points or asserts a universal/causal rule not shown by the source.

Do not accept exact wording for an interpolated value.

## 6. Spatial data stay stable

Graph points, axes, scales and line positions may never be randomized. Randomize only textual distractor order, once per session. The graph must not move or rescale after a click.

## 7. Graph interaction must not test motor precision

- clickable point target: at least 44 × 44 px;
- visible selected state;
- keyboard activation with Enter and Space;
- selected points listed textually outside the graph;
- one-click toggle;
- individual removal;
- a third selection may replace the oldest only when this is stated explicitly.

## 8. One task, one reasoning purpose

- Task 1: identify the source evidence relevant to the claim.
- Task 2: choose the correct strength of language for an interpolated value.
- Task 3: build a claim with evidence, interpretation and scope.

Do not combine point selection, interpolation, percentage calculation and final writing into one crowded interaction.

## 9. Distractors represent real graph-reading errors

Use errors such as:

- wrong endpoints;
- exact language for an estimate;
- refusing all interpolation;
- nearest-point substitution;
- treating an absolute difference as a percentage;
- generalising one interval into a universal rule;
- claiming causality from a descriptive graph.

Do not use random nonsense distractors.

## 10. Make answer functions visible

The final answer structure is:

```text
source evidence → interpretation → bounded conclusion
```

Show the assembled answer. Do not hide graph reasoning inside one generic textarea.

## 11. Goal copy orients without answering

Good:

> Bepaal wat een grafiek rechtstreeks ondersteunt, wat alleen een schatting is en hoe precies je een conclusie mag formuleren.

Bad:

> Kies €2 en €8, bereken 50% en schrijf dat de claim alleen voor deze punten geldt.

## 12. The UI challenge stays below the graph-reasoning challenge

Students should think about which observations matter, whether a value is observed or estimated, and how far a conclusion may go. They should not struggle with tiny targets, hidden IDs, shifting graph positions, select-then-place interactions, clear-all-only repair or multiple unrelated game modes.

## 13. Feedback follows the broken operation

After an attempt, identify wrong evidence, observation/estimate confusion, overgeneralisation or missing source support. Feedback may clarify after an attempt but may not reveal the answer before selection.

## 14. Reuse at the correct abstraction level

Reusable patterns:

- `graph_evidence_pair_selector`;
- `graph_claim_strength_choice`;
- `graph_evidence_answer_builder`;
- stable once-per-session text randomization;
- accessible interactive graph points;
- answer preview by reasoning function.

Do not encode the museum context or specific values into the shared engine.
