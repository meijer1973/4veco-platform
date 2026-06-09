# Golden Exercise Workbench Policy

Status: governed policy for source-dependent exercise surfaces.

## Policy Statement

Golden Exercise Workbench is the governed default layout and interaction policy for source-dependent exercise surfaces that need high-quality student proof. It is a layout and interaction contract, not a style suggestion.

The implemented `1.1.3` Golden Ticket route is the current repository-compatible reference. The `references/exemplars/1.1.3-exit-ticket/` package is the conceptual graph/table check-surface exemplar. The `references/exemplars/a96-answer-form/` package is the canonical calculation and answer-form exemplar.

## What Counts as a Golden Exercise Route

A route counts as Golden Exercise only when all of these are true:

```text
source data explicitly opts into layout.framework: golden_exercise_workbench
generated shell uses header.ge-topbar
generated shell uses main.ge-page[data-golden-ticket-root]
visible sections use ge-* workbench structure
source/context is first-class
task operations are visible and sequenced
feedback is local and appears after attempt on proof/check surfaces
legacy root and visible legacy shell are absent
```

Partial Golden styling around the old shell is not enough.

## Direct Golden Route Root

Golden routes must use:

```text
header.ge-topbar
main.ge-page[data-golden-ticket-root]
```

They must not use:

```text
#exit-ticket-app
et-page
mixed ge-* and et-* shell classes
legacy task-shell CSS
legacy exit-ticket CSS
legacy visible shell scripts
```

Legacy renderers may remain for legacy routes. This policy does not remove them. It only forbids using them to render Golden routes.

## Source-First Layout

Source-dependent tasks use source-left/task-right on desktop and source-first/task-second on mobile.

Desktop:

```text
source/context card on the left
active task card on the right
route/recovery links secondary
feedback stable in the task area
```

Mobile:

```text
hero
route/recovery links if concise
source/context card
task steps
feedback
```

## Operation-Chain Rule

Every required cognitive operation should normally be visible as a UI section. The Workbench must make the student do the same kind of work the target expects.

Examples:

```text
graph construction -> graph reading -> claim/control
formula -> substitution -> final answer -> notation -> contextual conclusion
source value -> source chain -> answer form
claim -> mechanism -> evidence -> conclusion
```

Generic textareas, dropdown-only tasks, or correct-only selectors are not acceptable substitutes when the answer form is structured.

## Anti-Spec-Gaming Rule

An implementation fails if it can pass by:

```text
patching the old et/task-shell framework
using a legacy root with new colors
wrapping ge-* around et-* classes
showing a completed graph before graph work is assessed
leaking formulas or correct values before attempt
ordering formula tokens as the answer
using visually identical hidden tokens
locking independent questions as a style effect
showing feedback as pre-attempt teaching
claiming product authority from layout quality
```

## A96 Answer-Form Rule

The A96 exemplar supplies calculation and answer-form policy:

```text
formula or method action
substitution with labelled source values
final answer
unit or notation
contextual conclusion
```

Formula builders must use mixed token banks with plausible distractors. If a concept appears twice, the visible UI must make reuse clear. Hidden duplicate tokens with the same label but different correctness meanings are forbidden.

## 1.1.3 Graph/Table Rule

The implemented `1.1.3` route supplies graph/table policy:

```text
axis choices include plausible distractors
source table stays visible
point placement checks graph/table mapping
magnetic snapping or broad tolerance protects graph understanding
two distinct source points determine a straight line
line draws automatically when determined
graph reading asks interval before read-off value
proof includes after-graph construction state
```

Do not add a separate slope or line-shape question when the constructed points already determine the line.

## Feedback and Authority

Feedback is local, neutral, and non-summative. It may name the next practice route. It must not claim:

```text
diagnostics
mastery
grade
automatic sequencing
summative result
student-facing AI judgement
Scale Gate readiness
target-equivalent completion without gate approval
```

## Exit Tickets and Short Checks

Exit tickets and advisory short checks must remain separate.

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
may include route advice
may include local or collapsible hints
may include repair feedback
do not replace exit tickets
do not claim target-equivalent proof
```

## Rollout Boundary

This policy does not authorize:

```text
student/product use
Scale Gate 1
target-equivalent completion language
diagnostics
mastery
automatic sequencing
summative use
broad route migration
generated lesson output churn
```

Future goals must still prove route-specific quality and pass review thresholds before migration or adoption.

## Stop Conditions for Future Agents

Stop and record a blocker rather than weakening the policy if:

```text
the shared task engine cannot express a required operation
the renderer can only produce a legacy root
wrong alternatives cannot be made plausible
graph interaction would become pixel-precision instead of understanding
formula controls require invisible token distinctions
feedback copy would need prohibited authority language
proof cannot show after-interaction states
```
