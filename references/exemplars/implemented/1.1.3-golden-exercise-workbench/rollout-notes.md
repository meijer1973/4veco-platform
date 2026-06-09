# Rollout Notes

Status: implementation-reference notes for `GOLDEN-EXEMPLAR-PROMOTION-1`.

## What Was Promoted

This package promotes the implemented `1.1.3` Golden Ticket route as the repository-compatible Golden Exercise Workbench exemplar.

It preserves:

```text
current source-data contract
current generated route shell
current no-legacy shell evidence
links to the conceptual 1.1.3 exemplar
links to the A96 answer-form exemplar
```

## What Was Not Changed

This goal did not:

```text
migrate 1.1.2
migrate 1.1.1
migrate short checks
migrate graph/table practice
generalize renderer selection
remove legacy renderers
edit generated lesson output
claim student/product use
claim Scale Gate 1
claim target-equivalent completion language
claim diagnostics, mastery, automatic sequencing, or summative use
```

## Relationship To Conceptual Exemplar

The conceptual exemplar remains:

```text
references/exemplars/1.1.3-exit-ticket/
```

Do not delete or replace it. It explains product intent, prototype decisions, and review expectations.

The implemented exemplar is:

```text
references/exemplars/implemented/1.1.3-golden-exercise-workbench/
```

It shows how the current repository actually expresses that product intent through source data and generated HTML.

## Relationship To A96

The A96 answer-form exemplar remains:

```text
references/exemplars/a96-answer-form/
```

Use it when a Golden Exercise route requires calculation/formula answer-form structure:

```text
formula or method action
substitution with source values
final answer
unit or notation
contextual conclusion
no visually identical hidden-token trap
```

## Next Goal

After this promotion, proceed to:

```text
GOLDEN-EXERCISE-CHECKERS-1
```

Checker hardening should turn the policy and exemplar rules into enforceable negative fixtures:

```text
reject legacy roots/assets on Golden routes
reject mixed ge-* and et-* shell contamination
reject answer-giving placeholders
reject formula token banks ordered as the answer
reject visually identical hidden-token traps
reject fake graph slope/line-shape questions
require after-interaction proof
```

## Remaining Review Flags

The implemented exemplar package is useful for future-agent orientation. It still needs later proof work before product adoption:

```text
allowed screenshot capture path
desktop/mobile/dark rendered screenshots
wrong/correct feedback screenshots
after-graph and after-formula interaction screenshots
teacher-learning quality review
student-experience review
lead synthesis
```
