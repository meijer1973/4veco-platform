# Golden Exercise Workbench Rollout -- End-State Specification

Generated: 2026-06-09

Status: PROJECT END-STATE FOR GOLDEN EXERCISE WORKBENCH ROLLOUT

## End-state sentence

The Golden Exercise Workbench becomes the repository's governed default layout and interaction policy for source-dependent exercise surfaces, with the implemented `1.1.3` Golden Ticket route and the A96 answer-form exemplar serving as the two canonical examples for future exit tickets, short checks, and practice exercises.

## Product-level ambition

This project is successful only when future coding agents can build high-quality exercise surfaces from repository policy and exemplars without repeated human micromanagement.

The target is not "tests pass." The target is that external reviewers can say:

```text
This policy is clear enough, concrete enough, and enforceable enough that a new cold agent can build the next exercise to the same product standard without reinventing or patching the old framework.
```

## Non-negotiable product principles

### 1. Golden Exercise Workbench is a layout contract, not a style suggestion

A route using `layout.framework: "golden_exercise_workbench"` must render as a direct Golden route:

```text
header.ge-topbar
main.ge-page[data-golden-ticket-root]
.ge-hero
.ge-workbench
.ge-source-card
.ge-task-card
.ge-step-list
.ge-feedback
```

It must not render through:

```text
#exit-ticket-app
et-page
et-topbar
task-shell.css
exit-ticket.css
skill-map-route.css
task-shell-ui.js as visible shell
exit-ticket-ui.js as visible shell
mixed ge-* and et-* classes
```

Legacy renderers may continue for legacy routes, but they are not allowed to render Golden Exercise routes.

### 2. Source-dependent exercises use source/context first

If an exercise depends on a text, table, graph, figure, formula, or source excerpt, the source must be a first-class context object.

Desktop default:

```text
source/context card on the left
active task card on the right
route/recovery links secondary
```

Mobile default:

```text
hero
route/recovery if short enough
source/context card
task steps
feedback
```

### 3. Visible operation chain

Every required cognitive operation should normally have a visible UI section.

Examples:

```text
graph construction -> graph reading -> claim/control
formula/method -> substitution -> final answer -> notation -> contextual conclusion
source value -> source chain -> answer form
claim/direction -> mechanism -> evidence -> conclusion
```

Do not hide required operations inside one generic textarea unless the target is genuinely extended writing.

### 4. Task-family controls must match the student action

Use controls that match the operation:

```text
axis/point graph controls for graph construction
interval-first controls for graph reading
formula builders for formula structure
formula blanks for substitution
final answer + unit/notation fields for calculation
conclusion fields or choices for context direction
source-value and source-chain controls for source use
step ordering / sentence builder / claim-reason-evidence controls for reasoning
```

Do not use generic quiz variety as a substitute for operation proof.

### 5. No fake actions

A control is fake if the wrong action is impossible or irrelevant.

Forbidden examples:

```text
a line-shape question when the line is already determined by plotted points
a formula-builder token bank ordered so left-to-right clicking gives the answer
a token bank with no plausible distractors
visually identical correct tokens with different hidden IDs
a conclusion selector with only acceptable conclusions
source-value controls without source context
```

### 6. Locking / grey-out policy

Locking is allowed only when a later step genuinely depends on a previous step's output.

Allowed:

```text
graph reading locked until graph construction is complete
claim-control locked until required source/graph reading is complete
```

Forbidden:

```text
locking independent questions as a style effect
locking because the old framework has a wizard flow
locking without a visible reason
locking without disabled controls / aria-disabled state
```

A locked section must show the reason:

```text
Rond eerst het vorige onderdeel af.
```

### 7. Formula-builder policy

Formula token banks must:

```text
be deliberately mixed in order
include plausible distractors
avoid visually identical hidden-token traps
avoid answer-giving labels
permit reuse visibly if the same concept must appear twice
validate the visible operation, not invisible token trivia
```

Forbidden:

```text
two tokens both labelled "oude prijs" with different hidden IDs
left-to-right token order that forms the correct formula
distractors that are obviously irrelevant
formula card shown before attempt when formula knowledge is being assessed
```

### 8. Graph interaction policy

For graph/table tasks:

```text
axis choices must include plausible distractors
point placement should protect graph understanding, not pixel precision
magnetic snapping is allowed when the task checks interpretation rather than drawing precision
if a line is a mathematical consequence of two plotted points, draw it automatically
do not ask a separate fake slope/line-shape question
proof must include the state after graph construction, not just the initial empty graph
```

### 9. Feedback policy

Feedback must be:

```text
local to the relevant operation
visible only after an attempt on proof/check surfaces
neutral and non-summative
route-oriented where recovery is useful
stable in the layout
```

Feedback must not claim:

```text
diagnostics
mastery
grade
automatic sequencing
summative result
student-facing AI judgement
Scale Gate readiness
```

### 10. Exit-ticket versus short-check distinction

Exit tickets:

```text
target-equivalent proof candidates
same-level operation and answer-form proof
no hint-heavy learning flow
no target-equivalent completion language without gate approval
```

Short checks:

```text
advisory
may include local route advice
may include hidden/collapsible hints
may include repair feedback
do not replace exit tickets
do not claim target-equivalent proof
```

### 11. Proof standard

Initial screenshots are not enough.

Every Golden Exercise route must eventually prove:

```text
desktop initial state
mobile initial state
dark-mode state
wrong/retry feedback state
correct/completed state
after-interaction state for graph/formula/source/reasoning controls
route/reload proof
no-legacy DOM proof
negative fixture rejection
```

### 12. Exemplar hierarchy

There are two exemplar types:

```text
conceptual exemplar: what the product should feel like
repository-compatible exemplar: how the product is generated and validated in this repo
```

The implemented `1.1.3` route should become the repository-compatible Golden Exercise exemplar. The existing `1.1.3-exit-ticket` folder remains the conceptual exemplar. The A96 answer-form exemplar supplies calculation/answer-form operation-chain rules.

## Final project deliverables

The full project ends when these exist:

```text
references/ui/layout-registry.md
references/ui/layout-registry.json
references/ui/interaction-policy.md
references/ui/interaction-policy.json
references/ui/exercise-workbench-policy.md
references/ui/shared-task-rollout-policy.md
references/exemplars/exemplar-index.md
references/exemplars/exemplar-index.json
references/exemplars/implemented/1.1.3-golden-exercise-workbench/
references/ui/golden-exercise-rollout-ledger.md
references/ui/golden-exercise-rollout-ledger.json
generalized Golden Exercise checker
first transfer proof plan for 1.1.2
```

## Quality target

The policy package is not complete until independent reviewers score:

```text
overall: at least 8.5 / 10
layout clarity: at least 9 / 10
anti-spec-gaming strength: at least 9 / 10
shared-task integration: at least 8.5 / 10
didactic quality: at least 8.5 / 10
human-oversight reduction: at least 9 / 10
no category below 8 / 10
```

## Forbidden final claims

This project does not authorize:

```text
student/product use
Scale Gate 1
all exit tickets migrated
all short checks migrated
all practice surfaces migrated
target-equivalent completion language
diagnostics
mastery
automatic sequencing
summative use
```

Those require later gates or explicit human approval.
