# Exemplar Index

Status: created for `GOLDEN-EXEMPLAR-PROMOTION-1`.

This index separates conceptual exemplars from repository-compatible implemented exemplars. Future agents should use both: conceptual exemplars explain the product standard, while implemented exemplars show how the current repository actually generates and validates the surface.

## Exemplar Types

```text
conceptual exemplar: product standard, prototype, policy extract, and handoff guidance
implemented exemplar: committed source snapshot, generated route snapshot, proof notes, and rollout boundary
answer-form exemplar: reusable answer-form policy for calculation/formula work
```

## Canonical Entries

| ID | Type | Path | Use |
| --- | --- | --- | --- |
| `1.1.1-golden-presentation` | conceptual exemplar | `references/exemplars/1.1.1-golden-presentation/` | Presentation route, layout, notes, didactic sequence, web-first design, and PPTX derivative guidance. |
| `1.1.3-exit-ticket-conceptual` | conceptual exemplar | `references/exemplars/1.1.3-exit-ticket/` | Product-quality guidance for graph/table exit-ticket design. |
| `1.1.3-golden-exercise-workbench` | implemented exemplar | `references/exemplars/implemented/1.1.3-golden-exercise-workbench/` | Repository-compatible Golden shell/layout, source-left/task-right, graph/table interaction, and route/no-legacy reference. Not a formula-token reference. |
| `a96-answer-form` | answer-form exemplar | `references/exemplars/a96-answer-form/` | Calculation/formula answer-form policy, especially visible formula, substitution, notation, conclusion, and hidden-token-trap prevention. |

## How To Use This Index

For a new Golden Exercise route:

```text
1. Read references/ui/README.md.
2. Read the implemented 1.1.3 Golden Exercise Workbench exemplar.
3. Read the conceptual 1.1.3 exit-ticket exemplar for product intent.
4. Read A96 when formula, calculation, notation, contextual conclusion, or formula-token policy is part of the task.
5. Record blockers instead of weakening the operation chain.
```

Do not treat an exemplar as product-use approval. Exemplars preserve implementation and review evidence; they do not authorize Scale Gate 1, diagnostics, mastery, automatic sequencing, summative use, or target-equivalent completion language.

For a new Golden Presentation route:

```text
1. Read references/presentation/README.md.
2. Read references/exemplars/1.1.1-golden-presentation/.
3. Use the semantic slide-role route before choosing layouts.
4. Treat web-first output as the design source.
5. Generate PPTX only as a derivative after web review.
6. Record blockers instead of accepting weak presentation work as production quality.
```

Formula-token boundary: the implemented `1.1.3` source snapshot has local formula-token clarity for its percentage-change task, but it remains a route/workbench exemplar rather than the formula-builder policy exemplar. Future calculation/formula policy work must use `references/exemplars/a96-answer-form/` for reusable-token rules, hidden-token-trap policy, and A96-level formula proof.

## Current Rollout Position

Only `1.1.3` is currently promoted as an implemented Golden Exercise Workbench reference. `1.1.2` is now a controlled Golden Workbench transfer candidate through `golden_calculation_structured_v1`, but it is not promoted as an implemented exemplar and it does not authorize target-equivalent completion language.
