# Sprint EX-2: Lead Review Assignment

Generated: 2026-05-22

## Review Request

Review the completed EX-2 closure bundle as a human-reviewed exam-to-MTU
mapping gate.

## Scope

Confirm that EX-2:

- records the human GATE-EX2 answer set after the full question list was shown;
- closes `GATE-EX2-exam-to-mtu-mapping` as `pass_with_conditions`;
- treats the closure as classification and routing evidence only;
- records q3 `A61` as support while keeping `q3-calc-1` as
  `operation_registry_need`;
- keeps `A15` marked stale/incorrect for q3;
- records q3 and q15 answer-model wording as `answer_skill_need`;
- keeps q19 blocked by `q19-source-annex-gap` and `q19-graph-object-gap`;
- adds q19 `A42` as a graph-shift candidate while keeping `D10` support and
  downgrading `A45` to weak support;
- accepts q15 `D27`, `F03`, and `F09` for content coverage only;
- authorizes EX-3 dashboard/reporting work only;
- does not mutate `references/external/`, `references/machine/`, authored
  target exercises, owned blueprints, or lesson output;
- does not authorize unit minting, operation-registry mutation, answer-skill
  mutation, target-exercise promotion, placeholder finalization, CP-6 closure,
  Year-1 closure, diagnostics, adaptive routing, mastery, sequencing,
  student-facing AI, summative use, PV projection, PV machine promotion, or
  student-facing output.

## Primary Files

- `reports/sprints/EX-2-plan.md`
- `reports/sprints/EX-2-baseline.md`
- `reports/sprints/EX-2-planning-review.md`
- `references/data/sprints/EX-2.plan.json`
- `references/data/sprints/EX-2.result.json`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/review-packet.md`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/review-packet.json`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/mapping-candidates.md`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/mapping-candidates.json`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/human-interview.md`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/human-interview.json`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.md`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.json`
- `build-scripts/references/check-exam-to-mtu-mapping-gate.js`
- `reports/sprints/EX-2-result.md`
- `reports/sprints/EX-2-diff-summary.md`

## Validation Evidence

Passed before lead review:

```bash
node build-scripts/references/check-exam-to-mtu-mapping-gate.js
node build-scripts/review-gates/validate-gate.js reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.json
```

## Expected Verdict

Return `PASS`, `PASS WITH FLAGS`, or `REVISE`.

If `REVISE`, name exact required corrections. If `PASS WITH FLAGS`, name
residual risks that should remain visible.
