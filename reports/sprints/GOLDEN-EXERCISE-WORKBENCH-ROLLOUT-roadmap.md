# Golden Exercise Workbench Rollout Roadmap

Generated: 2026-06-09

## Roadmap purpose

Turn the working `1.1.3` Golden Ticket implementation and the A96 answer-form exemplar into a governed exercise layout and interaction policy for the repository.

## Starting point

Current main has:

```text
positive implementation: 1.1.3 Golden Ticket route
positive conceptual exemplar: references/exemplars/1.1.3-exit-ticket/
positive answer-form exemplar: references/exemplars/a96-answer-form/
negative pure legacy pattern: et-page / #exit-ticket-app / legacy task-shell assets
negative hybrid pattern: mixed ge-* and et-* classes around old shell
```

The current generator still special-cases `1.1.3`; broad rollout requires policy extraction and then renderer generalization.

## Phase 1 -- Preparation

Sprint:

```text
GOLDEN-EXERCISE-WORKBENCH-PREP-1
```

Status:

```text
completed_pending_review
```

Goal:

```text
Create durable end-state, roadmap, ledger, metrics, review protocol, and goal sequence.
```

No implementation.

## Phase 2 -- Policy extraction

Goal run:

```text
GOLDEN-EXERCISE-POLICY-1
```

Outputs:

```text
references/ui/README.md
references/ui/layout-registry.md
references/ui/layout-registry.json
references/ui/interaction-policy.md
references/ui/interaction-policy.json
references/ui/exercise-workbench-policy.md
references/ui/shared-task-rollout-policy.md
```

Purpose:

```text
Make the Golden Exercise Workbench a named policy instead of a one-route exception.
```

Acceptance:

```text
external reviewers score policy clarity >= 8.5
anti-spec-gaming >= 9
```

## Phase 3 -- Exemplar promotion

Goal run:

```text
GOLDEN-EXEMPLAR-PROMOTION-1
```

Outputs:

```text
references/exemplars/exemplar-index.md
references/exemplars/exemplar-index.json
references/exemplars/implemented/1.1.3-golden-exercise-workbench/README.md
references/exemplars/implemented/1.1.3-golden-exercise-workbench/source-data-snapshot.json
references/exemplars/implemented/1.1.3-golden-exercise-workbench/generated-route-snapshot.html
references/exemplars/implemented/1.1.3-golden-exercise-workbench/screenshot-proof.md
references/exemplars/implemented/1.1.3-golden-exercise-workbench/no-legacy-proof.md
references/exemplars/implemented/1.1.3-golden-exercise-workbench/rollout-notes.md
```

Purpose:

```text
Make the actual repository-integrated Golden Ticket route easy for future agents to find and copy structurally.
```

## Phase 4 -- Checker hardening

Goal run:

```text
GOLDEN-EXERCISE-CHECKERS-1
```

Outputs:

```text
build-scripts/references/check-layout-registry.js
build-scripts/references/check-interaction-policy.js
build-scripts/sprints/check-golden-exercise-workbench.js
build-scripts/sprints/check-shared-task-ui-policy.js
```

Purpose:

```text
Turn policy into enforceable checks.
```

Minimum checker behavior:

```text
reject #exit-ticket-app on golden routes
reject legacy assets on golden routes
reject mixed ge-* / et-* classes
reject fake graph controls
reject answer-giving placeholders
reject formula token banks ordered as the answer
reject visually identical hidden-token traps
```

## Phase 5 -- Renderer generalization

Goal run:

```text
GOLDEN-EXERCISE-RENDERER-1
```

Purpose:

```text
Generalize Golden rendering beyond 1.1.3.
```

Target change:

```text
renderer selection becomes data-driven from layout.framework, not parNr === "1.1.3".
```

Boundary:

```text
Keep old renderer available for legacy routes.
Do not migrate multiple routes in this goal.
```

## Phase 6 -- First transfer proof

Goal run:

```text
EXIT-TICKET-WORKBENCH-112-1
```

Purpose:

```text
Migrate 1.1.2 exit ticket to Golden Exercise Workbench using A96 calculation answer-form rules.
```

Why 1.1.2:

```text
Best transfer target for formula, percentage, final answer, notation, and contextual conclusion.
```

Acceptance:

```text
desktop/mobile/dark proof
wrong/correct/completed states
A96 answer-form fidelity >= 8.5
no legacy assets
no target-equivalent completion claim
```

## Phase 7 -- Short-check variant

Goal run:

```text
SHORT-CHECK-WORKBENCH-POLICY-1
```

Purpose:

```text
Define advisory short-check variant of Golden Exercise Workbench.
```

Key difference:

```text
short checks may advise, hint, and route; they do not prove target-equivalence.
```

## Phase 8 -- Rollout ledger

Goal run:

```text
GOLDEN-EXERCISE-ROLLOUT-LEDGER-1
```

Outputs:

```text
references/ui/golden-exercise-rollout-ledger.md
references/ui/golden-exercise-rollout-ledger.json
```

Purpose:

```text
Track which surfaces use the policy and which proof states exist.
```

## First recommended implementation order

```text
1. 1.1.3 exit ticket -- implemented reference
2. 1.1.2 exit ticket -- first transfer proof
3. 1.1.1 exit ticket or short check -- choose by operation fit
4. first advisory short-check variant
5. graph/table practice
6. calculation practice
7. reasoning practice
8. mixed/exam-derived source exercise
```

## Roadmap guardrail

Do not broaden product authority during this rollout. Layout quality, interaction policy, and generated-output proof are not the same as student-use authorization or Scale Gate closure.
