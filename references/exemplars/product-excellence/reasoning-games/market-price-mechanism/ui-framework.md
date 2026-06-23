# Reasoning Game UI/Layout Framework v3

This framework is explicit because agents should not infer product design rules from examples alone.

## Core principle

The reasoning structure is the interface. Students should build the economic explanation step by step.

## Layout rules

### 1. Source-left / task-right on desktop

Use a stable two-pane structure:

- left: compact source, non-answer-giving goal, key givens;
- right: interactive reasoning tasks.

### 2. Source-before-task on mobile

On mobile, show:

1. title and route;
2. non-answer-giving goal;
3. source;
4. tasks.

### 3. Goal: prominent but not answer-giving

The goal must be visible near the start of the source pane. It may not be hidden in small muted text at the bottom.

Good:

```text
Doel: Bouw een economische redenering over een mogelijke prijsverandering. Gebruik de bron, vraag en aanbod, en sluit af met een conclusie met richting.
```

Bad:

```text
Doel: Leg uit hoe stijgende vraag bij gelijk aanbod leidt tot schaarste/vraagoverschot en daardoor tot een hogere prijs.
```

The bad version gives away the answer chain before the student has played the game.

## Interaction rules

### 4. One coherent game loop

Use one clear loop:

```text
bron → keten → verbanden → toetszin
```

Avoid unrelated mini-games, timers, arcade elements, or multiple modes before the core reasoning loop is solved.

### 5. Flowchart first for causal reasoning

For cause-effect reasoning, use a visible flowchart or chain. The student should see the structure of the explanation.

### 6. No visible internal metadata on cards

Selectable cards may not display role labels or hidden identifiers such as:

```text
cause
mechanism
conclusion
vraag
aanbod
type: mechanisme
```

The answer slots may show the required answer structure, but the cards themselves must not reveal where they belong.

### 7. Plausible wrong answers must be possible

Every selection bank must include plausible distractors. A reasoning task is invalid if every available option is correct or if a single button always inserts the right answer.

### 8. Use concrete economic terms

Avoid vague labels such as:

```text
marktdruk
market pressure
```

Prefer concrete exam-ready wording:

```text
vraagoverschot
schaarste
aanbod blijft gelijk
vraag neemt toe
meer vraag dan aanbod
aanbodtekort
```

### 9. Connector tasks must form sentences

Connector rounds should train explanation writing. The connector must be placed in a sentence frame.

Good:

```text
Meer reizigers willen een huurfiets gebruiken; [daardoor] neemt de vraag naar huurfietsen toe.
```

Good:

```text
De vraag naar huurfietsen neemt toe, [terwijl] het aanbod op korte termijn gelijk blijft.
```

Bad:

```text
Vraag neemt toe → aanbod blijft gelijk
```

### 10. Connector-word policy

For this reasoning game, do not test subtle active distinction between `daardoor` and `waardoor`. That is a language-polish target, not the core economics target.

Use:

- `daardoor` for ordinary cause-effect links;
- `terwijl` for a simultaneous condition/contrast;
- `dus` for the conclusion.

Allow `daardoor` to be reused. Many causal chains require the same connector more than once.

If a future game includes both `daardoor` and `waardoor`, then either:

- the paragraph must explicitly target connector-language precision; or
- the evaluator must accept both where both preserve the economic logic.

### 11. Feedback after attempt only

Feedback may explain the weak link after the student attempts the task. It should not teach the full answer before the attempt.

Feedback should name the weak operation:

- oorzaak ontbreekt;
- vraagrichting is verkeerd;
- aanbodvoorwaarde ontbreekt;
- vraagoverschot/schaarste ontbreekt;
- conclusie heeft verkeerde richting;
- verbindingswoord past niet bij de zin.

Do not use grade, mastery, diagnostic, summative, pass/fail, adaptive-routing, PV, or product-readiness language.

## Reusable task-family guidance

### reasoning_flow_chain_builder

Required behavior:

- card bank with answer cards and distractors;
- no visible card role tags;
- neutral step slots;
- ordered response shape;
- evaluator for exact or reviewed-equivalent chain;
- feedback that names the first broken link.

### reasoning_connector_sentence_labeler

Required behavior:

- connector bank with distractors;
- support reusable connectors such as `daardoor`;
- sentence frames with one connector slot;
- inserted connector creates a proper Dutch sentence;
- evaluator checks connector choice per sentence;
- feedback distinguishes cause-effect connector, condition connector, and conclusion connector.

### reasoning_sentence_builder

Required behavior:

- answer slots for cause, mechanism, conclusion;
- fragment bank without visible role tags;
- distractor fragments with plausible economic language;
- optional free-writing box;
- evaluator checks that answer contains cause, mechanism, and conclusion direction.

## Review standard

A rendered reasoning game may not pass review unless the reviewer sees:

- a prominent but non-answer-giving goal;
- a compact source;
- a visible chain structure;
- cards without role/ID tags;
- complete-sentence connector rows;
- reusable `daardoor` where needed;
- concrete economic vocabulary;
- plausible wrong choices;
- feedback after attempt;
- mobile and dark-mode proof;
- interaction-state screenshots.
