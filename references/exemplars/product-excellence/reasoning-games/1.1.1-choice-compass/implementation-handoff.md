# §1.1.1 Reasoning Game Golden Exemplar — implementation handoff

## Purpose

Use this package as a fresh replacement direction for the paragraph reasoning game.

This is not a patched flowchart. The previous attempt was challenging because the controls were confusing: too many ordered steps, too much slot micromanagement, unclear clearing, and insufficient transfer of the one-click interaction model. This version changes the product grammar.

The paragraph target is **schaarste, keuze, alternatieve kosten, and economisch denken**. The game should therefore feel like a **choice compass**, not like a price-mechanism chain.

## Product target

The rendered game must have one coherent loop:

```text
bron lezen → bewijs voor schaarste selecteren → beste opgegeven alternatief kiezen → toetsantwoord bouwen
```

The student should think about economics, not about how to operate the controls.

## Required rendered tasks

### Task 1 — Vind het bewijs voor schaarste

- Select two source-evidence cards.
- Order does not matter.
- One click toggles a card.
- Selected evidence is visible in a tray.
- Each selected card can be removed individually.
- Card order is randomized.
- No visible card IDs, roles, or answer tags.

This replaces the failed six-step flowchart. For §1.1.1, six steps are too much for the first reasoning move.

### Task 2 — Pak de alternatieve kosten

- Fixed choice: Eva kiest bijles geven.
- Student chooses the best alternative she gives up.
- Wrong options remain possible:
  - chosen alternative;
  - lower-value alternative;
  - sum of non-chosen alternatives.
- The game must explicitly reject “add all non-chosen alternatives”.

### Task 3 — Bouw je toetsantwoord

- Student selects three answer fragments.
- One click fills the next empty line.
- Each line can be cleared individually.
- The evaluator checks the set of required ideas, not brittle hidden order.
- Correct answer must contain:
  - scarcity from limited time / impossible combination;
  - opportunity cost as studying with value €30;
  - explanation that film is not added because only the best forgone alternative counts.

## Required shared task-family direction

Implement reusable task families or extensions:

```text
scarcity_evidence_selector
opportunity_cost_choice
reasoning_fragment_answer_builder
```

These should be shared-task-shell families, not one-off hard-coded pages.

## Non-negotiable UI rules

1. Do not use visible ID/role tags on cards.
2. Do not create six-step ordered flows for an introductory reasoning game.
3. Do not make students perform two clicks when one click can express the action.
4. Every selected item must be individually removable.
5. Randomize card-bank order.
6. Wrong answers must be possible.
7. The UI challenge must never exceed the economics challenge.
8. Avoid generic textarea-only degradation.
9. Avoid generic multiple-choice-only degradation.
10. Feedback appears after attempt and names the weak economics idea.

## Lead-review standard

The lead reviewer must compare the generated game against this prototype and answer:

1. Is Task 1 genuinely easier to play than the old flowchart?
2. Is the first task order-free where order is irrelevant?
3. Does one click perform the main student action in all tasks?
4. Can the student clear one selected item without resetting the whole task?
5. Are there visible card IDs or hidden-answer labels?
6. Does the game test §1.1.1 economics rather than price-mechanism content?
7. Does Task 3 avoid a convoluted form?
8. Is the challenge economic reasoning, not UI decoding?

Status until this is true:

```text
hold_for_reasoning_111_choice_compass_review
```
