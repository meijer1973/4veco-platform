# Sprint EXAM-SOURCE-AUTH-1: Planning Review

Generated: 2026-06-03

Reviewer: planning/review subagent `019e8f02-9dba-7b93-9846-fe6603ad41e8`

## Verdict

PASS WITH IMPLEMENTATION GUARDS.

The sprint may proceed as an authority-contract sprint. It must stay limited to
source-authority validation and may not perform reconstruction, runtime/context
rendering, task transformation, protected reference mutation, source-data
mutation, generated lesson output, product-route adoption, target-equivalent
proof, or Scale Gate authority.

## Required Corrections

No plan corrections were required before implementation.

## Required Checker/Evidence Guards

The checker must verify:

- selected overlay item is table-only: exactly one table, zero graphs, and zero
  figures;
- `sourceAuthority.kind === external_primary`;
- official prompt and correction PDF paths exist;
- overlay path and `table-1-zoohee-zorgverzekering` match;
- answer-model refs point to
  `references/external/exams/vw-1022-a-25-1-c.pdf#question-3`;
- EUR 649 threshold evidence exists in the overlay answer model;
- negative fixtures reject `official-style`, `exam-style`,
  `local review data`, `local official-style source`, and
  `reconstructed local source`.

## Evidence Inspected

- `reports/sprints/EXAM-SOURCE-AUTH-1-plan.md`
- `reports/sprints/EXAM-SOURCE-AUTH-1-baseline.md`
- `references/data/sprints/EXAM-SOURCE-AUTH-1.plan.json`
- `references/reference-team-roadmap.md`
- `references/data/exam-ingestion/exam-item-overlays.json`

## Scope Boundary

The plan correctly excludes reconstruction, runtime/context rendering, task
transformation, protected reference mutation, source-data mutation, generated
lesson output, product-route adoption, target-equivalent proof, and Scale Gate
authority.

## Next Action

Implement `EXAM-SOURCE-AUTH-1` exactly within the authority-contract scope and
retain the checker guard for table-only source material.
