# Sprint TASK-FAMILY-SENTENCE-1: Planning Review

Generated: 2026-06-01

Reviewer: planning/review subagent `019e83f8-6c36-7de2-80cf-7ad4ed87838a`

Verdict: PASS.

## Evidence reviewed

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-contract.md`
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-result.md`
- `reports/sprints/TASK-FAMILY-SENTENCE-1-plan.md`
- `reports/sprints/TASK-FAMILY-SENTENCE-1-baseline.md`
- `references/data/sprints/TASK-FAMILY-SENTENCE-1.plan.json`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`

## Reviewer checklist

The plan is acceptable because it requires:

- runtime-only shared task-shell implementation with report-fixture proof;
- exact response shape `{ "tokens": ["tokenId"] }`;
- exact expected shape with `kind: "sentence_builder"`, canonical
  `tokens`, and reviewed `acceptedSequences`;
- strict token-bank validation with ids, labels, kinds, distractor metadata,
  ordering semantics, default no-reuse behavior, and no unknown tokens;
- deterministic exact sequence matching rather than fuzzy semantic checking;
- wrapper collection for exit-ticket, skilltree, and graph task-shell surfaces;
- rendered fixture, proof JSON, custom checker, lead-review assignment,
  round-1 review, correction log, and round-2 recheck;
- explicit forbidden scope for protected references, source data, generated
  lesson output, target-equivalent reliance, product authority, and the
  unrelated `knowledge/exit-ticket-game-1.1.1.zip`.

## Required implementation controls

The implementation must stop or return to planning if:

- raw token arrays match instead of the strict `{ tokens: [...] }` shape;
- word-bank construction becomes quiz variety rather than causal or
  answer-form construction;
- accepted sequences imply fuzzy or semantic evaluation without a reviewed
  domain evaluator;
- keyboard add/remove/reorder controls cannot be made usable through the
  shared task shell;
- any wrapper needs a bespoke feedback or state model;
- generated lesson output, source-data adoption, or target-equivalent claims
  enter the sprint.

## Initial validator evidence

Run before implementation:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-SENTENCE-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-SENTENCE-1
```

The implementation may proceed only after both commands pass.
