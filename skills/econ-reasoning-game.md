---
name: econ-reasoning-game
description: "Build or repair paragraph reasoning games by deriving paragraph-specific reasoning grammar, selecting a golden archetype, composing shared task-shell actions, adding negative fixtures, and requiring rendered interaction-state review."
pipeline: "Part B producer; inherits econ-companion-artifacts"
governed_by: "GOAL-REASONING-GOLDEN-FAMILY-1"
---

# Economics Reasoning Game Skill

## Governing Rule

```text
copy product grammar
re-derive reasoning grammar
```

The reasoning structure is the interface. Build the game from the paragraph's reasoning operation, not from the legacy reasoning engine's mode list.

This skill inherits `skills/econ-companion-artifacts.md`. If this skill conflicts with umbrella student-facing rules, the umbrella wins.

## Read First

- `AGENTS.md`
- `BUILD-PARAGRAPH.md`
- `skills/econ-companion-artifacts.md`
- `skills/reasoning-game-checklist.json`
- `skills/reasoning-game-archetypes.json`
- `references/exemplars/product-excellence/reasoning-games/manifest.json`
- `references/exemplars/product-excellence/reasoning-games/family-standard.md`
- `references/exemplars/product-excellence/reasoning-games/reasoning-archetype-decision-tree.md`
- the paragraph plan, textbook/source material, target exercise record, relevant MTUs, and known misconceptions

## Phase 1: Target Brief

Before designing UI, write:

```markdown
reasoning target:
central misconception:
source/evidence type:
required answer form:
prior knowledge:
what the game must not test:
candidate reasoning archetype:
selected golden exemplar(s):
why the selected interaction fits:
```

Stop if the brief names content only, such as percentages or graphs, instead of an operation such as choosing the reference value, bounding a claim, or explaining a causal mechanism.

## Phase 2: Archetype

Use the decision tree and select one of the reviewed archetypes when it fits:

- causal mechanism;
- choice and evidence;
- reference value and claim repair;
- graph evidence and epistemic scope.

A new archetype is allowed only with a written reason why the four existing families do not fit.

## Phase 3: One Coherent Loop

Default to two to four tasks, usually three. Each task must prepare the next, and the final task must build an exam-usable answer. Do not add a mode picker or unrelated mini-game set.

## Phase 4: Shared Student Actions

For every task, record:

```markdown
student action:
response shape:
order matters?:
maximum selections:
local repair:
randomization:
meaningful distractors:
evaluator:
feedback operation:
next route:
```

Use shared task-shell actions when they preserve the intended action:

- evidence selection: `multi_select`, `source_value_selection`, or `graph_evidence_selector`;
- chain construction: `step_ordering`, `source_chain_builder`, `cloze_tile_select`, or `sentence_builder`;
- final answer assembly: `functional_answer_builder`;
- graph-source reasoning: `graph_evidence_selector`, not graph construction;
- source-heavy layouts: `dual_pane_source_task_workspace` through the reasoning composer.

Record a shared-engine blocker rather than degrading a reasoning task into ordinary multiple choice or a textarea.

## Phase 5: UI Standard

Required:

- source-left/task-right desktop when source retrieval matters;
- source-before-task mobile;
- prominent non-answer-giving goal;
- task-defining claim before evidence;
- one click per normal action;
- visible selected state;
- local removal or replacement;
- stable positions after interaction;
- no visible IDs, roles, or correctness tags;
- meaningful touch targets;
- keyboard and focus behavior;
- visible final answer preview;
- feedback after attempt and a next route.

Use independent pane scrolling only when both panes are long enough that keeping one fixed reduces working-memory load.

## Phase 6: Distractors

Every distractor must come from a likely misconception and keep an internal rationale. Do not show that rationale before an attempt. Reject random nonsense distractors.

## Phase 7: Negative Fixtures First

At minimum, test:

- answer-giving goal;
- visible internal metadata;
- correct-only choices;
- fixed-position answer leakage;
- unnecessary two-click interaction;
- clear-all-only repair;
- reshuffle after click;
- generic multiple-choice degradation;
- generic textarea-only degradation;
- graph construction replacing graph reasoning;
- decorative graph;
- tiny graph targets;
- missing final answer preview;
- missing next route;
- paragraph-specific misconception failures.

## Phase 8: Rendered Proof

Required proof:

- initial desktop light;
- partial state;
- wrong/retry state;
- repaired/correct state;
- final assembled answer;
- next action;
- mobile dark;
- keyboard focus;
- special behavior such as graph hit targets or independent scrolling.

Source contracts and initial screenshots are insufficient.

## Phase 9: Review

Required specialist reviews:

- teacher learning quality;
- student experience;
- visual/interaction;
- accessibility when interaction or source visuals change;
- testing/regression;
- lead synthesis after corrections.

The lead must compare rendered states with the selected golden exemplar and answer whether the game is difficult because of economics rather than UI.

## Hard Fails

Return `REVISE` when:

- the game is primarily a calculation drill;
- the game is primarily graph drawing;
- a flowchart is used when order is not the reasoning target;
- one textarea hides a structured answer operation;
- ordinary multiple choice replaces a richer action;
- the goal reveals the answer;
- internal metadata is visible;
- wrong answers are impossible;
- local repair is absent;
- positions change after clicking;
- interaction-state proof is absent;
- the agent cannot explain why the mechanic fits the target reasoning.

## Delivery

Provide:

1. target brief;
2. selected exemplar and adaptation rationale;
3. source data;
4. shared task-family disposition;
5. generated route or gallery page;
6. negative fixtures;
7. rendered proof manifest;
8. specialist reviews;
9. two-round lead synthesis;
10. explicit authority boundaries and next action.
