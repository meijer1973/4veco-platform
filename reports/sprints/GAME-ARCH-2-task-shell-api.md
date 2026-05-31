# Sprint GAME-ARCH-2: Task-Shell API

Generated: 2026-05-31

## Purpose

Define the canonical task-shell contract for shared practice and checkpoint
interactions.

Current implementation evidence:

- `engines/task-shell-engine.js` validates task data and evaluates local
  feedback.
- `engines/task-shell-ui.js` renders shared task families and feedback cards.
- Graph, math, reasoning, and exit-ticket wrappers already consume this shell
  in different ways.

## Task Object Shape

| Field | Type | Required | Owner | Purpose |
|---|---|---|---|---|
| `id` | string | yes | data builder/domain module | Stable task ID within route |
| `family` | string | yes | domain module | Task family from shared shell |
| `skillLabel` | string | yes | route/data builder | Student-facing skill label |
| `familyLabel` | string | no | task shell or data | Optional display override |
| `purpose` | string | no | domain module | Why this task matters |
| `prompt` | string | yes | domain module | Student-facing prompt |
| `interaction` | object | yes | task shell/domain module | Inputs/options/labels |
| `expected` | object | yes | domain module | Deterministic answer or self-check criteria |
| `feedback` | object | yes | task shell/domain module | Match/retry/self-check copy |
| `practiceRoute` | object | yes | route layer/domain module | Next practice link |
| `boundaryFlags` | object | generated | task shell | Local-only/product-boundary flags |

Student-facing text must pass blocked-term and internal-code checks. It may not
expose MTU IDs or proof/mastery/diagnostic language.

## Supported Families And Current Proof Status

| Family | Current shell support | Current route proof | Notes for GAME-ARCH-2 |
|---|---|---|---|
| `choice` | validated/rendered | runtime support; old checkpoint also has non-shell choices | Keep as shell family but avoid using choice-only checks for calculation/graph target proof |
| `numeric_input` | validated/rendered/evaluated | live math and graph practice | Keep as shared deterministic family |
| `calculation_work_capture` | validated/rendered/self-check | live math and graph practice | Keep as self-check or structured local feedback family |
| `final_answer_entry` | validated/rendered/evaluated | live math practice | Keep for calculation/index final answers |
| `unit_notation_field` | validated/rendered/evaluated | live math practice | Keep for percent/index/unit notation |
| `short_constructed_response` | validated/rendered/self-check | runtime support; target proof not published | Keep for future answer-form/checkpoint composition |
| `table_value_selection` | validated/rendered/evaluated | live graph practice | Keep as reference graph/table family |
| `graph_reading` | validated/rendered/evaluated | live graph practice | Keep as graph/table family |
| `point_placement` | validated/rendered/evaluated | live graph practice | Keep as graph construction substitute |
| `graph_construction_substitute` | validated/rendered/self-check | live graph practice | Keep until exact drawing interaction is reviewed |
| `structured_reasoning` | validated/rendered/self-check | live reasoning practice | Refactor around answer-form standards |

## Response Shape

The shared shell should collect responses by family:

| Family type | Response shape |
|---|---|
| choice/table selection | `{ value }` |
| numeric/graph reading/final answer/unit notation | `{ value }` |
| calculation work capture | `{ work, finalAnswer }` |
| point placement | `{ point: { x, y } }` or `{ x, y }` |
| short response / graph construction / structured reasoning | `{ value }` or text string |

Wrappers may collect DOM values, but they should pass these normalized shapes
to `TaskShellEngine.evaluateTask`.

## Feedback Result Shape

`TaskShellEngine.evaluateTask` should remain the common local result shape:

| Field | Meaning |
|---|---|
| `taskId` | Which task was checked |
| `family` | Task family |
| `state` | `matched`, `retry`, or `self_check` |
| `matched` | boolean or null for self-check |
| `feedbackTitle` | Neutral feedback title |
| `feedbackText` | Neutral feedback body |
| `practiceRoute` | Link to next local practice |
| `selfCheckCriteria` | Criteria for non-deterministic tasks |
| `boundaryFlags` | Product boundaries, all false |

## Focus And Accessibility Contract

The shell owns the default feedback region:

- `aria-live="polite"`;
- `role="status"`;
- focusable feedback region with `tabindex="-1"`;
- first input focus plan from `TaskShellEngine.focusPlan(task)`;
- no layout shift that hides feedback or the next action on mobile.

Wrappers may move focus to their own labelled feedback region only when they
preserve the same semantics.

## Extension Rule

A domain module may request a new task family only when the current families
cannot represent the student action. The request must name:

- task family name;
- student action;
- expected response shape;
- validation/evaluation owner;
- feedback owner;
- focus/keyboard requirements;
- product-boundary flags;
- route/checkpoint use case.

No engine should add a private task UI for an overlapping family already
covered by the shared shell.
