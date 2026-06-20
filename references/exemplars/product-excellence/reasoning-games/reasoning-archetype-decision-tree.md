# Reasoning Archetype Decision Tree

Use this before selecting task families or copying a prototype mechanic.

## 1. Identify The Target Operation

Choose the dominant reasoning operation in the paragraph target.

| Question | Archetype | Golden exemplar |
| --- | --- | --- |
| Does the student need to explain how one economic change causes another through a chain? | Causal mechanism | `reasoning-market-price-mechanism-v3` |
| Does the student need to use source facts to choose between alternatives or identify opportunity cost? | Choice and evidence | `reasoning-1.1.1-choice-compass-v1` |
| Does the student need to repair a numerical/index claim by using the right reference value and unit? | Reference value and claim repair | `reasoning-1.1.2-index-check-v1` |
| Does the student need to inspect graph/table values and bound a claim without overclaiming? | Graph evidence and epistemic scope | `reasoning-1.1.3-graph-editorial-v2` |

## 2. Re-Derive The Reasoning Grammar

Write the reasoning grammar as a chain of student operations. Examples:

- `source change -> causal chain -> connector sentences -> bounded answer`
- `source facts -> scarcity evidence -> best forgone alternative -> explanation`
- `difference -> unit -> reference value -> equivalent checks -> repaired claim`
- `graph points -> observation or estimate -> bounded conclusion`

The grammar must be paragraph-specific. Do not reuse the exemplar's answer chain unless the source target is actually the same.

## 3. Choose Shared Student Actions

Promote action families, not paragraph names.

- Evidence selection: use `multi_select`, `source_value_selection`, or `graph_evidence_selector`.
- Chain construction: use `step_ordering`, `source_chain_builder`, or `cloze_tile_select` with reusable connectors.
- Answer assembly: use `functional_answer_builder` when final answer functions must be visible.
- Graph-source reasoning: use `graph_evidence_selector`; do not substitute graph construction or a decorative graph.
- Long source plus tasks: use the dual-pane composer layout; on mobile, source precedes tasks in natural flow.

## 4. Reject Weak Fits

Stop and redesign if any of these are true:

- The goal reveals the answer chain.
- The interaction can be passed by recognizing visible roles, IDs, or correctness tags.
- The final task is a generic textarea with no visible answer function.
- The graph is decorative, too small to target, or replaced by graph construction.
- Repair requires clearing the entire task.
- The task set is a mode picker or unrelated mini-game bundle.
- The student sees only calculation or only multiple choice when the target is reasoning.

## 5. Required Proof

Every accepted reasoning-game transfer needs initial, partial, wrong/retry, repaired/correct, answer-preview, mobile, dark-theme, and keyboard/focus proof where applicable. Graph tasks also need target-size and scroll-isolation proof.
