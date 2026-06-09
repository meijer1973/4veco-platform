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
| `1.1.3-exit-ticket-conceptual` | conceptual exemplar | `references/exemplars/1.1.3-exit-ticket/` | Product-quality guidance for graph/table exit-ticket design. |
| `1.1.3-golden-exercise-workbench` | implemented exemplar | `references/exemplars/implemented/1.1.3-golden-exercise-workbench/` | Repository-compatible Golden Exercise Workbench reference generated from current committed artifacts. |
| `a96-answer-form` | answer-form exemplar | `references/exemplars/a96-answer-form/` | Calculation/formula answer-form policy, especially visible formula, substitution, notation, conclusion, and hidden-token-trap prevention. |

## How To Use This Index

For a new Golden Exercise route:

```text
1. Read references/ui/README.md.
2. Read the implemented 1.1.3 Golden Exercise Workbench exemplar.
3. Read the conceptual 1.1.3 exit-ticket exemplar for product intent.
4. Read A96 when formula, calculation, notation, or contextual conclusion is part of the task.
5. Record blockers instead of weakening the operation chain.
```

Do not treat an exemplar as product-use approval. Exemplars preserve implementation and review evidence; they do not authorize Scale Gate 1, diagnostics, mastery, automatic sequencing, summative use, or target-equivalent completion language.

## Current Rollout Position

Only `1.1.3` is currently promoted as an implemented Golden Exercise Workbench reference. The next transfer target remains `1.1.2`; that migration is not part of this exemplar promotion package.
