# Golden Exercise Workbench Rollout Quality Metrics

Generated: 2026-06-09

## Purpose

Prevent specification gaming. Passing tests is required but insufficient.

Each major sprint/goal must be scored by reviewers using these metrics.

## Score scale

```text
10 = excellent, future agents can use it with little human oversight
9 = strong, only minor polish needed
8 = acceptable, but still has visible risk
7 = revise required
6 or below = fail for this project
```

## Required threshold

```text
overall average: >= 8.5
no individual metric below 8.0
anti-spec-gaming strength: >= 9.0
human-oversight reduction: >= 9.0
```

If the threshold is not met, the goal must continue.

## Metric 1 -- Layout contract clarity

Questions:

```text
Can a cold agent identify the correct page structure?
Are source card, task card, route strip, feedback, mobile stack, and dark-mode requirements explicit?
Are legacy and hybrid layouts clearly forbidden?
```

Target:

```text
>= 9.0
```

## Metric 2 -- Anti-spec-gaming strength

Questions:

```text
Could an agent still pass by patching the old et/task-shell framework?
Are negative fixtures preserved?
Are no-legacy checks concrete?
Are screenshot states required?
```

Target:

```text
>= 9.0
```

## Metric 3 -- Didactic operation-chain quality

Questions:

```text
Does the policy force visible cognitive operations?
Does it distinguish source action, method, substitution, answer, notation, and conclusion where relevant?
Does it avoid generic textarea capture for structured answer forms?
```

Target:

```text
>= 8.5
```

## Metric 4 -- Shared-task integration

Questions:

```text
Are graph, calculation, formula, source, and reasoning task families mapped to concrete controls?
Does A96 become transferable policy rather than an isolated exemplar?
Does the policy say when the shared task shell is reused and when the workbench owns layout?
```

Target:

```text
>= 8.5
```

## Metric 5 -- Student usability

Questions:

```text
Would a student know what to do now and next?
Are controls clear, non-clunky, and not fake?
Are locks/grey-outs used only for real dependencies?
Is feedback visible and local?
```

Target:

```text
>= 8.5
```

## Metric 6 -- Teacher learning quality

Questions:

```text
Does the policy support actual economic thinking and answer construction?
Does it avoid mechanical noise?
Does it preserve target-exercise and exam-style operation chains?
```

Target:

```text
>= 8.5
```

## Metric 7 -- Accessibility and mobile

Questions:

```text
Are mobile order and card structure specified?
Are locked states accessible?
Are controls labelled?
Is dark mode proof required?
```

Target:

```text
>= 8.0
```

## Metric 8 -- Rollout safety

Questions:

```text
Is rollout staged?
Are exit tickets separated from short checks?
Are product-use and completion-language claims blocked?
Is the first transfer target named?
```

Target:

```text
>= 8.5
```

## Metric 9 -- Human-oversight reduction

Questions:

```text
Will this reduce future human correction?
Are end-state, policies, registries, examples, checkers, and reviewer rubrics sufficient?
Can a new agent continue from the repository without chat context?
```

Target:

```text
>= 9.0
```

## Reviewer result format

```json
{
  "reviewer": "Layout Contract Reviewer",
  "metric_scores": {
    "layout_contract_clarity": 9,
    "anti_spec_gaming_strength": 9,
    "didactic_operation_chain_quality": 8.5,
    "shared_task_integration": 8.5,
    "student_usability": 8.5,
    "teacher_learning_quality": 8.5,
    "accessibility_mobile": 8,
    "rollout_safety": 9,
    "human_oversight_reduction": 9
  },
  "overall": 8.8,
  "verdict": "PASS WITH MINOR FLAGS",
  "blocking_issues": [],
  "quality_flags": [],
  "required_corrections": [],
  "evidence_paths": []
}
```
