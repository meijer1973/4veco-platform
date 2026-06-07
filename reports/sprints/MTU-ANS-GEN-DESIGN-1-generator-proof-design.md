# MTU-ANS-GEN-DESIGN-1 Generator Proof Design

Generated: 2026-06-07

## Scope

This design classifies the answer-form/source-use MTUs `A80`, `A81`, and
`A96`-`A99` for later implementation. It does not implement generators and
does not expose these units in student-facing routes.

Design principle: answer-form MTUs are proof and repair scaffolds around an
underlying economic, calculation, graph/table, reasoning, or source operation.
They should not become shallow standalone skill-tree drills.

## Design Matrix

| Unit | Classification | Student Action | Interaction Or Proof Family | Validation Owner | Route Behavior | Later Rendered Proof Required | Stop Condition |
|---|---|---|---|---|---|---|---|
| `A80` | shared-task-shell proof design | Identify exactly the requested item, label, actor, source value, direction, or list length without adding extra reasoning. | `multi_select`, `matching_pairs`, `source_value_selection`, or short constructed response, depending on the underlying task. | Shared task-shell validator plus route-specific task checker. | Hidden from generic `ROUTE_SKILLS`; may appear only as an answer-form requirement inside a reviewed route task. | Desktop/mobile/dark screenshots showing concise-identification task, feedback, retry, and next action. | Stop if it becomes a generic quiz or if extra reasoning is required by the prompt. |
| `A81` | shared-task-shell modifier proof design | Select or cite a source observation with label, period, unit, or direction, then connect it to the underlying answer form. | `source_value_selection` plus `source_chain_builder`, paired with an underlying answer-form task such as `A96`, `A97`, `A98`, `A99`, or `A80`. | Source-context/task-shell checker and answer-form route checker. | Never standalone; hidden from generic `ROUTE_SKILLS`; may appear only as source-use modifier metadata in a reviewed route. | Desktop/mobile/dark screenshots showing source context, selected source value, chain to answer form, feedback, retry, and next action. | Stop if `A81` is treated as complete proof without an underlying answer form. |
| `A96` | shared-task-shell proof design | Show formula or rule, substitute labelled values, show intermediate work, give final answer with unit/notation, and write a short contextual conclusion. | `calculation_work` with unit/notation fields and optional `formula_builder` support. | Calculation-work validator plus domain-specific task checker. | Hidden from generic `ROUTE_SKILLS`; may appear only inside reviewed calculation/check/exit-ticket tasks. | Desktop/mobile/dark screenshots showing work capture, unit/notation fields, conclusion feedback, retry, and next action. | Stop if final-answer-only calculation is accepted or if units/notation are optional when required. |
| `A97` | shared-task-shell proof design | Build a causal chain toward a given conclusion and explicitly return to that conclusion. | `structured_reasoning`, `step_ordering`, `sentence_builder`, or constructed response with reviewed causal criteria. | Reasoning route checker plus answer-form criteria checker. | Hidden from generic `ROUTE_SKILLS`; may appear only as answer-form scaffold in a reviewed reasoning/practice/check route. | Desktop/mobile/dark screenshots showing given conclusion, chain construction, feedback, retry, and next action. | Stop if the task allows opinion-only text or changes the given conclusion. |
| `A98` | shared-task-shell proof design | Choose the direction or yes/no outcome first, then explain the mechanism that makes that direction follow. | `two_tier_choice` for direction-plus-reason practice, or `structured_reasoning` / constructed response for richer proof. | Reasoning route checker plus answer-form criteria checker. | Hidden from generic `ROUTE_SKILLS`; may appear only as answer-form scaffold in a reviewed reasoning/practice/check route. | Desktop/mobile/dark screenshots showing direction choice, mechanism explanation, feedback, retry, and next action. | Stop if the answer can pass without an explicit direction choice. |
| `A99` | held pending live evidence | Give a concrete context-fitting example, explain the relevant feature, and link it back to the question. | Later `sentence_builder` or constructed-response proof only after a live 1.1.x or exam-derived evidence case is selected. | Future route-specific checker after evidence selection. | Remains hidden and generator-blocked; no generic route exposure. | Later evidence must include a live example-answer task, rendered screenshots, feedback states, and reviewer evidence. | Stop until a reviewed live evidence case exists; do not implement from generic examples alone. |

## Unit Details

### A80

- Classification: shared-task-shell proof design.
- Student action: concise identification or list construction only.
- Underlying dependency: the content/source unit that supplies the item being
  identified.
- Validation owner: route-specific shared task-shell checker.
- Route behavior: answer-form requirement inside a task, not generic route row.
- Later proof: rendered route proof with plausible distractors and no
  answer-giving scaffold.
- Stop condition: reject if a prompt needs explanation, calculation, or source
  chain rather than concise identification.

### A81

- Classification: shared-task-shell modifier proof design.
- Student action: use a source observation and connect it to another answer
  form.
- Underlying dependency: one of `A80`, `A96`, `A97`, `A98`, `A99`, or a future
  reviewed graph/classification answer form.
- Validation owner: source-context checker plus answer-form checker.
- Route behavior: modifier metadata only, not standalone route row.
- Later proof: rendered source context, source-value/chain interaction,
  underlying answer form task, feedback, retry, and next action.
- Stop condition: reject any standalone A81 proof claim.

### A96

- Classification: shared-task-shell proof design.
- Student action: calculation work plus unit/notation and conclusion.
- Underlying dependency: calculation/content unit such as percentages,
  indexcijfers, graph values, or formula substitution.
- Validation owner: calculation-work checker and domain route checker.
- Route behavior: answer-form requirement inside calculation tasks.
- Later proof: rendered work capture, unit/notation field, conclusion feedback,
  retry, and next action.
- Stop condition: reject final-answer-only tasks.

### A97

- Classification: shared-task-shell proof design.
- Student action: causal chain to a given conclusion.
- Underlying dependency: content/reasoning units that supply the mechanism.
- Validation owner: reasoning route checker and answer-form criteria checker.
- Route behavior: answer-form scaffold inside reasoning tasks.
- Later proof: rendered chain construction or constructed response with given
  conclusion preserved.
- Stop condition: reject opinion-only answers or changed conclusions.

### A98

- Classification: shared-task-shell proof design.
- Student action: choose direction/outcome, then explain why that direction
  follows.
- Underlying dependency: content/reasoning/graph unit that determines the
  direction.
- Validation owner: reasoning route checker and answer-form criteria checker.
- Route behavior: answer-form scaffold inside reasoning or check tasks.
- Later proof: rendered direction-first task with feedback and retry.
- Stop condition: reject answers without an explicit direction choice.

### A99

- Classification: held pending live evidence.
- Student action: context-fitting example plus fit explanation.
- Underlying dependency: a live paragraph or exam-derived prompt that actually
  asks for example-based explanation.
- Validation owner: future route-specific checker after evidence selection.
- Route behavior: remains generator-blocked and hidden.
- Later proof: rendered live example-answer task and reviewer evidence.
- Stop condition: do not implement from generic examples alone.

## Product Boundary

This design does not authorize diagnostics, adaptive routing, mastery,
sequencing, target-equivalent proof, Scale Gate 1, product-route adoption, or
student/product use. Later implementation must prove rendered route behavior
and preserve the difference between local practice, advisory short checks, and
target-equivalent exit tickets.
