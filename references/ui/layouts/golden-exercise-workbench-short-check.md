# Golden Exercise Workbench Short-Check Variant

Status: governed advisory variant specification for `SHORT-CHECK-WORKBENCH-POLICY-1`.

This file defines how a short check may use the Golden Exercise Workbench without inheriting exit-ticket authority. It is a policy and layout specification. It does not migrate a real route, change generated lesson output, or claim that any short check is ready for student/product use.

## Variant Identity

```text
layout.framework: golden_exercise_workbench
surface_type: advisory_short_check
variant_id: golden_advisory_short_check_v1
machine_contract: references/ui/layouts/golden-exercise-workbench-short-check.json
```

`golden_advisory_short_check_v1` is a surface variant specification. It is not the current renderer selector, and it must not be treated as evidence that a route has been migrated.

## Purpose

Advisory short checks help a student and teacher see a local next move before the full exit-ticket proof. They may be shorter and may focus on one part of an operation chain, but they still use the Golden Workbench quality bar:

```text
source/context first where source-dependent
clear task cards
student-visible operations
local feedback after attempt
mobile and dark-mode proof before rendered adoption
no legacy shell
```

## Required Distinction

| Dimension | Exit ticket | Advisory short check |
| --- | --- | --- |
| Authority | target-equivalent candidate | advisory |
| Operation proof | same-level operation-chain proof | may be partial-skill rather than full target chain |
| Teaching flow | no hint-heavy teaching flow | route advice allowed |
| Hints | no hint-heavy learning path | local hints allowed only hidden/collapsible or after attempt |
| Completion wording | completion language held unless approved | no completion-language claim |
| Proof states | proof states required | proof states required before rendered adoption, but never as target-equivalent proof |

## Allowed Short-Check Behavior

Advisory short checks may:

```text
name the local route or skill to revisit
offer local repair feedback after an attempt
show hidden or collapsible hints
reveal a hint only after an attempt
focus on a partial skill or short operation slice
use a lighter task sequence than a full exit ticket
link to practice or recovery routes
```

The advice must remain local. It can say what to try next in the current task or route, but it must not classify the student or make product-authority claims.

## Forbidden Claims

Advisory short checks must not claim:

```text
target-equivalent proof
paragraph completion
mastery
diagnostics
grading
automatic sequencing
summative use
student/product use
PV
Scale Gate 1
```

They also must not replace an exit ticket or be used as the only proof that a paragraph target has been met.

## Layout Contract

A rendered advisory short check that opts into the Golden Workbench must still use:

```text
header.ge-topbar
main.ge-page[data-golden-ticket-root]
.ge-hero
.ge-workbench
.ge-source-card when source-dependent
.ge-task-card
.ge-step-list
.ge-feedback
golden-ticket-layout.css
golden-ticket-layout.js
golden-ticket-graph.js only when graph controls need it
```

It must not use:

```text
#exit-ticket-app
main.et-page
header.et-topbar
task-shell.css
exit-ticket.css
skill-map-route.css
task-shell-ui.js as visible shell
exit-ticket-ui.js as visible shell
mixed ge-* and et-* classes
```

## Interaction Contract

Each short-check candidate must declare its intended operation chain. The chain may be narrower than an exit ticket, but the student-visible control still has to match the intended action.

Feedback must be:

```text
local to the relevant operation
visible only after attempt, except for hidden/collapsible hints
neutral and non-summative
route-oriented where recovery is useful
stable in the layout
```

Hints must be:

```text
hidden/collapsible before attempt, or
shown after an attempt as local repair help
```

Hard locking should normally be avoided. It is allowed only when a later step genuinely depends on an earlier step, with disabled controls, aria-disabled state, and a visible reason.

## Required Data Contract

A future rendered short-check candidate should declare:

```text
surface_type: advisory_short_check
layout.framework: golden_exercise_workbench
targetEquivalent.candidate: false
targetEquivalent.gateApproved: false
targetEquivalent.completionLanguageEligible: false
advisory.intent
contextBlocks when source-dependent
task operation chain
task-family controls
hint policy
feedback after attempt
practice/recovery route advice where useful
authority flags set to false
proof states collected before rendered adoption
```

If a short-check surface needs source material, the source must remain first-class and close to the task. Route advice must not push the source below the active task on mobile.

## Proof Before Rendered Adoption

Before a real short check is migrated, the route-specific proof must include:

```text
desktop initial state
mobile initial state
dark-mode state
wrong/retry feedback state
correct/local-success feedback state
after-interaction state for the relevant controls
hidden/collapsible hint state when hints exist
route/reload proof
no-legacy DOM proof
negative fixture rejection when checkers exist
authority boundary proof
```

The proof must explicitly state that the short check remains advisory and does not provide target-equivalent completion evidence.

## Review Targets

```text
exit-ticket/short-check distinction >= 9.0
advisory-copy safety >= 9.0
layout transferability >= 8.5
future-agent usability >= 8.5
no metric below 8.0
```

If a future implementation cannot preserve these distinctions, stop and record a blocker rather than weakening the policy.
