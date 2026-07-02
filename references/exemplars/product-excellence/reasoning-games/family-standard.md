# Cross-exemplar reasoning-game product standard

## Status

Proposed canonical family standard derived from four human-calibrated golden
examples. This document separates reusable product grammar from
paragraph-specific reasoning grammar.

## Golden transfer rule

```text
copy product grammar
re-derive reasoning grammar
```

Product grammar means layout, interaction clarity, feedback grammar, local
repair, answer preview, and rendered proof. Reasoning grammar means the
paragraph-specific source, misconception, causal chain, evidence status,
reference value, or answer function.

## 1. Purpose

A reasoning game helps the student understand, construct and communicate the
economic logic behind a paragraph target. It must not become:

- a disguised calculation drill;
- a graph-drawing drill;
- a generic quiz;
- a language trap unrelated to the economics;
- an interface puzzle.

The student should find the economics challenging, not the controls.

## 2. Family invariants: product grammar

### 2.1 One coherent loop

A game normally uses two to four connected tasks. Three is the default. The
tasks form one reasoning route rather than unrelated game modes.

### 2.2 Layout

- Desktop: source-left / task-right when a source is needed.
- Mobile: source before tasks in natural page flow.
- Source-heavy desktop games: independently scrollable source and task panes.
- The task-defining claim or headline appears before the evidence display.
- The goal is prominent, concise and non-answer-giving.

### 2.3 Interaction

- One click performs one complete normal action.
- Order is imposed only when order is part of the economics.
- Selected items are visibly selected.
- One selected item can be removed or replaced locally.
- Card order may use stable shuffle once per session; it remains stable after interaction.
- Spatial data such as graphs never randomize.
- Wrong answers remain possible.
- Internal IDs, roles, correctness flags and MTU codes are invisible.

### 2.4 Reasoning content

- Distractors represent genuine misconceptions.
- Canonical, exam-usable economic terminology is used.
- Vague language is replaced by the actual mechanism.
- The final task exposes answer functions such as:
  evidence → interpretation → conclusion.
- The assembled answer is visible.
- A generic textarea may be offered as optional transfer, not as the only
  representation of a structured reasoning target.

### 2.5 Feedback

Feedback appears after an attempt and states:

1. what operation was checked;
2. which reasoning part is weak;
3. what to repair or practise;
4. the next route action.

It does not grade, diagnose, claim mastery, sequence automatically, or imply
summative status.

### 2.6 Accessibility and proof

- Touch targets are large enough for the action.
- All controls are keyboard accessible.
- Focus is visible.
- Light/dark and mobile behavior are reviewed.
- Proof includes interaction states, not only initial screenshots.

## 3. Paragraph-specific reasoning grammar

Before selecting a mechanic, write:

```text
reasoning target:
central misconception:
source/evidence:
required answer form:
what this game must not test:
```

Then classify the reasoning operation.

### Archetype A — causal mechanism

Use when the target is an ordered economic mechanism.

Typical route:

```text
source → causal chain → connector sentences → explanation
```

### Archetype B — choice and evidence

Use when the student must identify relevant facts and a best alternative, where
order is not the central skill.

Typical route:

```text
source evidence → choice classification → explanation
```

### Archetype C — reference value and claim repair

Use when the misconception concerns units, bases, denominators or the meaning of
a numerical difference.

Typical route:

```text
difference → meaning → reference → valid check → corrected claim
```

The reasoning game discusses why the calculation works. It is not the main
calculation practice surface.

### Archetype D — graph evidence and epistemic scope

Use when the student must distinguish observations, estimates and unsupported
claims.

Typical route:

```text
graph evidence → evidence status → bounded conclusion
```

The graph is evidence. The game does not primarily draw the graph.

## 4. Transfer rule

Copy:

- layout grammar;
- interaction clarity;
- feedback grammar;
- accessibility;
- review proof;
- local repair;
- answer-preview pattern.

Adapt:

- source;
- reasoning operation;
- misconception;
- distractors;
- task composition;
- answer functions;
- domain evaluator.

Never copy automatically:

- a flowchart;
- a three-row answer builder;
- connector words;
- a graph interaction;
- a card selector;
- the previous paragraph's task order.

## 5. Review standard

A reviewer must be able to explain:

- why this game mechanic fits this paragraph;
- what economic misconception each distractor represents;
- why the goal does not reveal the answer;
- why the UI challenge is lower than the reasoning challenge;
- how the game builds an exam-usable explanation;
- what would fail if the product regressed.
