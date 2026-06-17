# B1-NORMAL-INFERIOR-TERM-DECISION-1 Plan

Status: implemented as REV-STD-1 governed authored-registry terminology decision

## Purpose

Resolve the carried `1.2.2` normal/inferior-good dependency from
`B1-MIGRATED-V5-TARGET-QUALITY-1`.

The decision lane asks whether Year 1 `1.2.2` requires students to actively
classify normal versus inferior goods, or whether the Year 1 target should stay
focused on term-light income-driven demand-shift reasoning.

## Required Citations

- Product end-state:
  `../4veco-lessen/specifications/product-end-state.md`
- Original target-quality sprint:
  `reports/sprints/B1-MIGRATED-V5-TARGET-QUALITY-1-plan.md`
- Prior review packet:
  `reports/reference-planning/B1-MIGRATED-V5-TARGET-QUALITY-1-review-packet.md`
- Current target registry:
  `references/authored/course-target-exercises.json`
- Prior mixed-target boundary:
  `reports/reference-planning/B1-PLACEHOLDER-REGISTRY-REPLACEMENT-1-review-packet.md`

Product end-state requirement used here: every paragraph is built backward from
a paragraph target exercise, and later target-equivalent proof must cover the
target operation chain at the same cognitive level with matching answer forms.

## Non-Negotiable Requirements

1. Cite product end-state and this sprint plan in the review packet.
2. Cite the original sprint/gate spec that created the carried flag.
3. Name non-negotiables and include a core-requirement checklist.
4. Classify findings using REV-STD-1 language.
5. Include `blocks`, `does_not_block`, and `proof_required_to_close` for
   carried issues.
6. Do not use `PASS WITH FLAGS` to carry a missing core requirement.
7. Do not edit `references/machine/*` or `references/external/*`.
8. Do not generate or alter lesson output under `../4veco-lessen`.
9. Do not introduce normal/inferior-good classification into `1.2.4`.
10. Do not claim Year 1 closure, CP-6 closure, Scale Gate authority,
    product-route adoption, diagnostics, mastery, PV, or student/product use.

## Scope

In scope:

- update the authored `1.2.2` target-registry record to remove the stale
  missing-unit flag;
- record the term-light decision boundary for `1.2.2`;
- preserve `1.2.4` as term-free mixed practice;
- publish a REV-STD-1 review packet and quality log.

Out of scope:

- machine/external reference edits;
- lesson-output generation;
- income-elasticity unit design;
- target-equivalent lesson proof;
- product-route, diagnostics, mastery, PV, Scale Gate, or student-use claims.

## Acceptance Criteria

- `1.2.2` no longer carries a normal/inferior-good missing-unit flag.
- `1.2.2` records that normal-good wording is allowed only as supplied context
  for an income-driven demand-shift operation.
- `1.2.4` remains term-free and introduces no new theory.
- REV-STD-1 artifacts are present and validate through
  `check:review-throughput`.
- Course-target, owned-content, report JSON, inventory, and diff checks pass.

