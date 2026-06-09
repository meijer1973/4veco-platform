# Golden Exercise Workbench Rollout Review Protocol

Generated: 2026-06-09

## Purpose

Create a review loop that pushes agents beyond minimal pass/fail work and reduces human micromanagement.

## Reviewer roles

Every major implementation goal must be reviewed by these roles:

1. Layout Contract Reviewer
2. Student Experience Reviewer
3. Teacher Learning Quality Reviewer
4. Shared Task Architecture Reviewer
5. Accessibility and Mobile Reviewer
6. Regression / CI / Repository Hygiene Reviewer
7. Lead Reviewer

## Review rule

The implementation agent may not be the final reviewer.

The lead reviewer must synthesize all role reviews and decide whether the result is good enough to reduce future human oversight.

## Required score threshold

```text
overall average >= 8.5
no category below 8.0
anti-spec-gaming >= 9.0
human-oversight reduction >= 9.0
lead verdict: PASS or PASS WITH MINOR FLAGS
````

If any score is below threshold, the `/goal` continues.

## Evidence required by reviewer type

### Layout Contract Reviewer

Must inspect:

```text
layout policy
generated route or exemplar
no-legacy checker
positive exemplar
negative fixtures
```

Must answer:

```text
Could a future agent still patch the old framework and pass?
```

### Student Experience Reviewer

Must inspect:

```text
rendered screenshots
mobile state
dark mode
wrong/correct feedback states
route links
student-facing labels
```

Must answer:

```text
Would a student know what to do now and next?
```

### Teacher Learning Quality Reviewer

Must inspect:

```text
operation chain
source/context handling
formula/graph/reasoning controls
answer-form proof
feedback language
```

Must answer:

```text
Does this check the real target operation or just produce interface activity?
```

### Shared Task Architecture Reviewer

Must inspect:

```text
task-family mapping
shared shell boundary
layout renderer boundary
generator/data contract
A96 transfer
```

Must answer:

```text
Can this policy scale to exit tickets, short checks, and practice surfaces without becoming a Frankenstein shell?
```

### Accessibility and Mobile Reviewer

Must inspect:

```text
keyboard/focus expectations
aria-disabled/disabled controls
mobile stack
dark-mode contrast expectations
labels and alt text
```

Must answer:

```text
Is the layout usable outside the desktop golden screenshot?
```

### Regression / CI / Repository Hygiene Reviewer

Must inspect:

```text
changed files
forbidden surfaces
generated-output policy
validators
negative fixtures
scope language
roadmap/index refreshes
```

Must answer:

```text
Is the work clean enough to merge without hidden churn?
```

### Lead Reviewer

Must synthesize:

```text
scores
blockers
quality flags
next-step recommendation
authority boundary
```

Must explicitly state:

```text
This reduces future human oversight because...
```

or:

```text
This still requires human micromanagement because...
```

## Verdict definitions

### PASS

All thresholds met. No blockers. Minor flags may remain if they do not weaken policy or rollout safety.

### PASS WITH MINOR FLAGS

All thresholds met. Flags are named and routed to later work.

### REVISE

At least one threshold is not met, or a quality issue would cause future agent confusion.

### FAIL

Legacy/hybrid framework path remains possible, product authority is overclaimed, generated output was hand-patched, or the result cannot be trusted.

## Non-negotiable fail triggers

```text
mixed ge-* and et-* classes accepted
#exit-ticket-app accepted for golden route
legacy task-shell/exit-ticket assets accepted for golden route
answer-giving placeholders allowed in proof/check surfaces
formula token bank ordered as the answer
visually identical hidden-token trap
fake graph slope/line-shape question
no after-interaction screenshot proof
target-equivalent or product-use overclaim
```
