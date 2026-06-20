# §1.1.2 reasoning-game golden exemplar — implementation handoff

## Purpose

Use this package as the product target for a new reasoning game for `1.1.2 Percentages en indexcijfers`.

The transfer lesson is deliberate: the §1.1.1 golden exemplar established a product grammar, not a fixed task mechanic. For §1.1.2, the natural reasoning operation is not scarcity evidence selection and not a causal flowchart. It is a **claim check**:

```text
numeric difference → meaning → reference value → two equivalent checks → repaired claim
```

The generated product must preserve the ease and flow of the §1.1.1 exemplar while changing the interaction to fit index reasoning.

## Product concept

Name: `Indexcheck: klopt de 6%-claim?`

Source:

| Jaar | Prijs | Index |
|---|---:|---:|
| 2024 | €50 | 100 |
| 2025 | €60 | 120 |
| 2026 | €63 | 126 |

Claim:

> Van 2025 naar 2026 werd het abonnement 6% duurder, want het indexcijfer steeg van 120 naar 126.

The correct reasoning is:

1. `126 − 120 = 6` is a change of **6 index points**.
2. The percentage change uses the old 2025 level as reference.
3. Price route: `(63 − 60) / 60 × 100 = 5%`.
4. Index route: `(126 − 120) / 120 × 100 = 5%`.
5. Therefore, the claim is wrong: 6 index points corresponds to a 5% price increase here.

## Required rendered tasks

### Task 1 — What does the 6 mean?

Use a single-click, replaceable choice. The student must distinguish:

- index-point difference;
- percentage change;
- euro difference;
- new index value.

Do not show visible IDs, semantic role tags, correctness badges, or pre-attempt explanations that reveal why an option is right or wrong.

### Task 2 — Choose two equivalent checks

The student selects exactly two formulas:

- one using prices;
- one using index figures.

Selection is order-free. One click toggles a card. Each selected formula can also be removed individually. Include plausible errors:

- divide by the new price;
- divide by the new index;
- divide by base-year index 100;
- treat subtraction as a percentage.

Randomize formula cards once when the game opens. Do not reshuffle after each click.

### Task 3 — Repair the claim

Use three visible answer-function rows:

1. verdict;
2. difference in index points;
3. percentage calculation and explanation.

A click selects the full sentence for that row. Clicking another sentence replaces it immediately. Show the assembled test answer below the choices.

Do not collapse the final reasoning into one generic textarea.

## Shared-engine targets

Implement or extend reusable families such as:

- `index_difference_classifier`;
- `parallel_calculation_selector`;
- `claim_repair_sentence_grid`.

Existing generic families may be reused only if the rendered behavior remains identical to the exemplar. Reuse is not a reason to weaken the interface.

## General transfer framework

### Copy the product grammar

- source-left / task-right on desktop;
- source before task on mobile;
- three short tasks with a visible route;
- one click per normal action;
- immediate visible selection state;
- individual repair;
- randomized distractors;
- feedback after checking;
- final assembled answer;
- neutral next-step language.

### Rebuild the reasoning grammar

Do not copy the §1.1.1 interaction merely because it worked there. Determine the paragraph's reasoning operation first:

- §1.1.1: identify scarcity and best foregone alternative;
- §1.1.2: distinguish units, choose a reference value, and verify a claim through equivalent routes.

The interaction archetype must follow that operation.

## Required regression tests

Use `reasoning-index-112-golden-exemplar-v1-negative-fixtures.json`.

At minimum, fail:

- `126 − 120 = 6%`;
- division by 126;
- division by basisjaar 100;
- correct-only formula bank;
- cards that reshuffle after a click;
- two-click assignment;
- clear-all-only repair;
- visible answer/role/ID tags;
- generic textarea-only degradation;
- answer-giving goal text;
- answer-giving explanations printed on selectable options.

## Required review proof

Capture:

- desktop light initial state;
- Task 1 selected and retry states;
- Task 2 partial selection, correct selection, and retry states;
- Task 3 assembled wrong and correct answers;
- mobile dark task and feedback states;
- keyboard focus proof;
- proof that card order remains stable after selection.

The lead reviewer must compare the generated product directly with the prototype. File existence, schema validation, and initial screenshots are insufficient.

## Status

Until generated fidelity and specialist review pass:

```text
hold_for_reasoning_112_golden_exemplar_review
```
