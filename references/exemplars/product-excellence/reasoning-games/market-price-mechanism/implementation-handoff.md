# Reasoning Flow Golden Exemplar v3 — implementation handoff

## Purpose

Use this package as the reference product for a new paragraph reasoning game. The game keeps one coherent loop:

```text
bron lezen → oorzaak-gevolgketen bouwen → verbindingswoorden in volledige zinnen plaatsen → toetszin maken
```

## What changed in v3

1. **The goal no longer gives away the answer**
   - The goal now says that students are building an economic reasoning about a possible price change.
   - It does not pre-state the full chain: rising demand + fixed supply + scarcity/vraagoverschot + higher price.

2. **No forced `daardoor`/`waardoor` distinction**
   - `waardoor` was removed from the assessed connector bank.
   - The game uses `daardoor` as the default cause-effect connector.
   - `daardoor` is reusable, because a reasoning chain often has more than one cause-effect link.

3. **Connector rows remain full sentences**
   - Each connector row still reads as a proper sentence after the word is inserted.
   - Examples:
     - `Er verdwijnen parkeerplaatsen bij het station; [daardoor] willen meer reizigers een huurfiets gebruiken.`
     - `Meer reizigers willen een huurfiets gebruiken; [daardoor] neemt de vraag naar huurfietsen toe.`
     - `De vraag naar huurfietsen neemt toe, [terwijl] het aanbod op korte termijn gelijk blijft.`

4. **The economic mechanism remains concrete**
   - The vague `market pressure` / `marktdruk` wording stays banned.
   - The preferred mechanism here is `vraagoverschot` or concrete wording such as `meer vraag dan aanbod`.

## Connector policy

For vwo economics reasoning, the primary target is the economic causal chain, not subtle active production of Dutch connector variants. `Daardoor` and `waardoor` can both be useful in written Dutch, but they differ grammatically. If a frame is built so that only one of them works, the task may become a language-trap rather than an economics-reasoning game.

Policy for this exemplar:

- use `daardoor` for ordinary cause-effect links;
- allow `daardoor` to be selected more than once;
- use `terwijl` for simultaneous contrast/condition, such as demand rising while supply stays fixed;
- use `dus` only for the final conclusion;
- do not assess `waardoor` unless the paragraph explicitly targets connector-language precision and the evaluator accepts all reviewed equivalent formulations.

## Required implementation target

The generated reasoning game must visibly show:

- source-left/task-right layout on desktop;
- source-before-task on mobile;
- prominent but non-answer-giving game goal near the source;
- one coherent game loop, not many modes;
- Round 1: card bank without role/ID tags, neutral flow slots, plausible distractors;
- Round 2: connector placement inside complete sentences, with reusable `daardoor`;
- Round 3: sentence builder without visible card metadata tags;
- feedback only after the attempt;
- next-practice route without grade, mastery, diagnostic, or summative language.

## Required shared task families

Implement reusable shared task families or extensions:

```text
reasoning_flow_chain_builder
reasoning_connector_sentence_labeler
reasoning_sentence_builder
```

Do not build this as a one-off hand-coded page.

## Non-negotiable rules

1. Do not show card role/ID tags on selectable cards.
2. Do not use vague concepts such as `marktdruk` / `market pressure`.
3. Do not write a goal that reveals the full answer chain.
4. Do not force the `daardoor`/`waardoor` distinction unless language precision is the explicit target.
5. Do not disable a connector that should be reusable.
6. Connector rows must become readable sentences.
7. Wrong answers must remain possible.
8. Feedback comes after the attempt.

## Required fixtures

Use `reasoning-flow-golden-exemplar-v3-negative-fixtures.json`.

The implementation must fail fixtures for:

- goal gives away full answer chain;
- `daardoor` not reusable;
- forced `waardoor` without explicit language target;
- visible role or internal-ID tags on selectable cards;
- vague `market pressure` / `marktdruk` wording;
- connector rows that do not become full sentences;
- hidden or low-contrast goal placement;
- correct-only connector bank;
- generic multiple-choice-only degradation;
- mode-overload degradation;
- conclusion-only answer.

## Required rendered proof

Before review, provide screenshots or browser proof for:

- initial desktop light state;
- Round 1 partial chain;
- Round 1 wrong feedback;
- Round 1 correct feedback;
- Round 2 with `daardoor` used twice;
- Round 2 wrong feedback;
- Round 3 sentence builder state;
- mobile dark initial state;
- mobile dark feedback state.

## Lead-review requirement

The lead reviewer must compare the generated implementation directly to `reasoning-flow-golden-exemplar-v3-prototype.html`.

Lead review must answer:

1. Does the goal orient the price-mechanism skill without giving away the answer chain?
2. Is `waardoor` absent from the assessed connector bank, or explicitly justified as a language target?
3. Can `daardoor` be reused?
4. Are selectable cards free of role/ID tags?
5. Is `market pressure` absent from student-facing text?
6. Do all connector rows become complete sentences?
7. Does the generated UI preserve the same layout discipline as the exemplar?
8. Are wrong answers possible?
9. Is feedback delayed until after an attempt?
10. Are screenshots interaction-state screenshots, not only initial-load screenshots?

Status until all are true:

```text
hold_for_reasoning_game_exemplar_fidelity_repair
```
