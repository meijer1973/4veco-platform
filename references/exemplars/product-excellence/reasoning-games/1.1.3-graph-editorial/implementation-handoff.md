# §1.1.3 reasoning-game golden exemplar — implementation handoff

## Purpose

Use this package as the product target for a new reasoning game for `1.1.3 Grafieken en tabellen`.

The transfer lesson is now supported across three paragraph types:

```text
§1.1.1: scarcity / opportunity-cost reasoning
§1.1.2: reference-value / index reasoning
§1.1.3: graph-evidence / claim-strength reasoning
```

The product grammar should remain recognisable. The reasoning mechanic must change to fit the paragraph.

## Product concept

Name: `Grafiekredactie: wat mag in de kop?`

Source:

| Prijs P | Tickets Q |
|---:|---:|
| €2 | 600 |
| €4 | 500 |
| €6 | 400 |
| €8 | 300 |
| €10 | 200 |

The values are shown in an economics P-Q graph with price vertical and quantity horizontal.

Editorial claim:

> Bij een prijs van €8 is het aantal verkochte tickets 50% lager dan bij €2.

The game checks three reasoning operations:

1. select the two graph observations relevant to the claim;
2. distinguish an interpolated estimate from an exact observation;
3. build a conclusion with evidence, interpretation and appropriate scope.

## Information priority and independent panes

The editorial headline is task-defining information. It must appear near the top of the source pane, directly after the short source introduction and before the graph/table. A student should not have to scroll through the graph and table to discover what is being checked.

On desktop, the source pane and task pane must be independently scrollable:

- each pane has its own vertical scroll container;
- scrolling the source does not move the questions;
- scrolling the questions does not move the source;
- reaching the end of one pane does not chain scrolling into the other pane or the page;
- both panes expose a visible, usable scrollbar;
- keyboard focus can enter either pane and scroll it;
- mobile returns to one natural document flow: source first, then tasks, with no nested scroll containers.

Implementation guidance:

```css
.layout { height: min(860px, calc(100dvh - 32px)); }
.source, .task-list {
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  scrollbar-gutter: stable;
}
```

The exact CSS may differ, but the rendered behavior may not.

## Required rendered tasks

### Task 1 — Graph evidence pair

The student clicks two points directly in the graph.

Required behavior:

- one click toggles a point;
- maximum two selected points;
- a clearly documented third click may replace the oldest point;
- each selected point has an individual remove control;
- selected points are also listed in text;
- hit target is at least 44 × 44 px;
- Enter and Space activate focused points;
- graph geometry never randomizes;
- the correct pair is order-insensitive.

Expected points:

```text
P = €2, Q = 600
P = €8, Q = 300
```

### Task 2 — Claim strength for interpolation

Question: what may the redaction say about `P = €5`?

Correct standard:

> approximately 450 tickets, as an interpolation between observed points.

The evaluator must reject:

- exact-observation language;
- “nothing can be said”;
- nearest-point substitution;
- any hidden answer-giving explanation printed before selection.

### Task 3 — Evidence-based answer repair

Show three answer-function rows:

1. source values;
2. interpretation of the 50% comparison;
3. bounded conclusion.

One click selects a full sentence for a row. Clicking another sentence replaces it. Show the assembled answer immediately.

Do not replace this with one textarea.

## Shared-engine targets

Implement or extend reusable task families:

- `graph_evidence_pair_selector`;
- `graph_claim_strength_choice`;
- `graph_evidence_answer_builder`.

Reuse existing families only when rendered behavior remains faithful to the exemplar. Generic reuse is not a reason to remove graph interaction or answer-function structure.

## General UI and layout framework

Use:

```text
reasoning-graph-113-golden-exemplar-v2-ui-framework.md
```

Critical rules:

- graph as interactive evidence source;
- source-left / task-right desktop layout with independent pane scrolling;
- source-before-task mobile layout with normal page scrolling;
- three short tasks;
- one-click normal actions;
- local repair;
- spatial graph stability;
- minimum 44 px point hit targets;
- observed / interpolated / unsupported distinctions;
- final answer preview by reasoning function;
- no exact wording for estimates;
- no universal or causal overclaim.

## Required negative fixtures

Use:

```text
reasoning-graph-113-golden-exemplar-v2-negative-fixtures.json
```

At minimum fail:

- decorative graph;
- graph-construction-only degradation;
- tiny point targets;
- randomized graph geometry;
- select-then-slot point interaction;
- clear-all-only repair;
- visible IDs or correctness tags;
- exact interpolation wording;
- universal rule from one interval;
- causal overclaim;
- generic textarea-only final answer;
- answer-giving goal text.

## Required rendered proof

Capture and inspect:

- desktop light initial state;
- Task 1 one-point and two-point states;
- Task 1 wrong and correct feedback;
- Task 2 wrong exact-language state and correct estimate state;
- Task 3 partial, wrong and correct assembled answers;
- mobile dark graph/task state;
- keyboard focus and Enter/Space graph-point activation;
- proof that graph geometry and text-card positions remain stable after clicks;
- proof that the headline is visible before the graph in the initial source viewport;
- scroll-isolation proof: wheel/touch scrolling each desktop pane leaves the other pane scroll position unchanged, including at the pane boundary.

Initial screenshots and task-family presence are not sufficient.

## Required specialist review questions

### Teacher-learning-quality reviewer

- Does the game test graph interpretation rather than graph mechanics?
- Is interpolation correctly framed as an estimate?
- Does the final answer stay within the source evidence?

### Student-experience reviewer

- Can a student select, replace and remove evidence with one obvious action?
- Are graph points easy to activate without precision frustration?
- Is the route understandable without reading implementation notes?

### Visual/interaction reviewer

- Is the graph readable in light/dark and desktop/mobile views?
- Are selected points and the evidence segment unmistakable?
- Is the headline immediately discoverable before the graph?
- Can source and questions be scrolled independently without scroll chaining?
- Does the source remain usable while tasks are completed?

### Testing/regression reviewer

- Do wrong endpoints fail?
- Does exact interpolation language fail?
- Do universal and causal overclaims fail?
- Are graph geometry and card order stable during interaction?

### Lead reviewer

The lead must compare generated interaction states directly with the prototype. Passing schemas, files, task-family names and initial screenshots is not proof of exemplar fidelity.

## Rollout lesson

The three paragraph exemplars now cover common reasoning families:

```text
choice reasoning
reference-value reasoning
graph-evidence reasoning
```

Before wider rollout, codify the shared product grammar separately from paragraph-specific reasoning grammar. Teams may reuse layout and interaction principles, but they must re-derive the mental operation for each paragraph.

## Status

Until generated fidelity and specialist review pass:

```text
hold_for_reasoning_113_graph_exemplar_review
```
