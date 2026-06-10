# Layout Registry

Status: central layout policy for Golden Exercise Workbench extraction.

## Registry Purpose

The layout registry names page-level UI contracts. A layout contract controls the generated shell, root DOM, allowed assets, mobile order, proof obligations, and forbidden legacy paths. It is stronger than visual preference and weaker than product-use approval.

## Registered Layouts

### `golden_exercise_workbench`

Status: governed policy extracted from the implemented `1.1.3` Golden Ticket route, with data-driven renderer selection.

Current implementation reference:

```text
source-data/book-1/exit-ticket/1.1.3-exit-ticket.json
build-scripts/platform/build-exit-ticket-shells.js
engines/golden-ticket-layout.js
engines/golden-ticket-graph.js
```

Current generator selector:

```text
data.layout.framework === "golden_exercise_workbench"
```

Current supported renderer variant:

```text
golden_graph_reading_claim_v1
```

This variant requires task-shell families:

```text
graph_construction_substitute
graph_reading
calculation_work_capture
graph spec from graph_construction_substitute
```

Routes that opt into `layout.framework: golden_exercise_workbench` but do not match a supported Golden variant must fail with a clear unsupported-variant error. They must not silently fall back to the legacy `et-page` / `#exit-ticket-app` shell.

## Required Shell

A Golden Exercise route must render as:

```text
html[data-theme]
body
  header.ge-topbar
    a.ge-back
    strong
    button.ge-theme-toggle
  main.ge-page[data-golden-ticket-root][data-source-key]
    .ge-hero
    .ge-workbench
    .ge-source-card
    .ge-task-card
    .ge-step-list
    .ge-feedback
```

Required assets:

```text
golden-ticket-layout.css
exit-ticket/{sourceKey}.js
golden-ticket-layout.js
golden-ticket-graph.js when graph construction or graph reading needs graph runtime
```

`golden-ticket-graph.js` is allowed only as Golden graph runtime, not as proof that a route may skip source/task layout.

## Forbidden Shell Contamination

A Golden route must not contain or depend on:

```text
#exit-ticket-app
main.et-page
header.et-topbar
task-shell.css
exit-ticket.css
skill-map-route.css
task-shell-ui.js as the visible page shell
exit-ticket-ui.js as the visible page shell
mixed ge-* and et-* classes in the same rendered Golden shell
```

Legacy routes may continue to use the legacy renderer. The prohibition applies when a route opts into `layout.framework: golden_exercise_workbench`.

## Layout Responsibilities

Desktop default:

```text
source/context card on the left
active task card on the right
route/recovery links secondary
feedback stable within the task side
```

Mobile default:

```text
hero
short route/recovery links when useful
source/context card
task steps
feedback
```

The source must stay close to the task. Do not put recovery navigation, route summaries, or generic status cards ahead of the source when the exercise depends on source material.

## Allowed Surface Types

Golden Exercise Workbench may be used for:

```text
target-equivalent exit-ticket candidates
advisory short checks
source-dependent practice
graph/table practice
calculation answer-form practice
reasoning or source-use practice
review-only labs
```

The surface type must be explicit because help, feedback, and authority language differ by surface.

## Current Positive and Negative Examples

Positive implementation:

```text
source-data/book-1/exit-ticket/1.1.3-exit-ticket.json
generated 1.1.3 Golden Ticket route
```

Positive answer-form exemplar:

```text
references/exemplars/a96-answer-form/
```

Positive conceptual check-surface exemplar:

```text
references/exemplars/1.1.3-exit-ticket/
```

Negative pure legacy pattern:

```text
et-page / #exit-ticket-app / task-shell.css / exit-ticket.css
```

Negative hybrid pattern:

```text
Golden classes wrapped around legacy shell assets or legacy root
```

## Proof Required Before Adoption

Initial screenshots are insufficient. A route claiming this layout must eventually produce:

```text
desktop initial state
mobile initial state
dark-mode state
wrong/retry feedback state
correct/completed state
after-interaction state for graph/formula/source/reasoning controls
route/reload proof
no-legacy DOM proof
negative fixture rejection when checkers exist
```

## Non-Authority

This registry does not authorize:

```text
student/product use
Scale Gate 1
target-equivalent completion language
diagnostics
mastery
automatic sequencing
summative use
broad migration
```
