# MTU-H5 Q3 Fixture Execution Authorization Packet

Status: `pending_explicit_q3_fixture_mutation_authorization_no_execution_performed`

Created: 2026-06-10

PR #27 merged the q3 execution-gate evidence and approved the fixture-only
execution surface in principle. It did not authorize immediate fixture
mutation. This packet prepares the next human decision: whether q3-only mutation
of `reports/mtu-hardening/mtu-h5-regression-fixture.json` is now authorized.

No q3 fixture mutation has been performed in this branch.

## Decision Needed

Approve, revise, or reject q3-only fixture mutation.

Exact approval text to use if approving:

```text
APPROVE q3-only fixture mutation for GATE-MTU-H5-q3-fixture-execution.
Authorized write surface: reports/mtu-hardening/mtu-h5-regression-fixture.json,
q3 record and q3-step-1/q3-step-2 fields only. Authorized execution: remove A15
from q3 mappings, retain A61/A96 support, retain A15 as forbidden, set q3
missing_mtu_expected false only with reviewed-equivalent refs, attach
EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON refs, attach
EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION refs for q3-step-2, keep scale and
incidence false, and preserve a negative A15 regression guard. No
protected-reference mutation, candidate storage, candidate writes, authored
target-exercise mutation, MTU mutation, operation-registry mutation,
answer-skill mutation, lesson output, PV, diagnostics, adaptive routing,
mastery, sequencing, student-facing AI, summative use, product-route readiness
claim, or student/product use is authorized.
```

## Allowed Surface If Approved

Only:

`reports/mtu-hardening/mtu-h5-regression-fixture.json`

Only q3:

`vw-1022-a-25-1-o:opgave-1:question-3`

Only operations:

- `q3-step-1`
- `q3-step-2`

## Future Patch Preview

If approval is recorded later, the execution patch should:

- remove `A15` from q3 record and q3 operation `mapped_mtu_ids`.
- retain `A61` and `A96` in q3 mappings and required IDs.
- retain `A96` as answer-form support.
- retain `A15` in `expected_forbidden_mtu_ids`.
- set `missing_mtu_expected` false for both q3 operations.
- attach `EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON` reviewed-equivalent operation refs.
- attach `EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION` refs for `q3-step-2`.
- replace the two q3 review-required hooks with reviewed-equivalent refs.
- keep scale-factor and incidence/pass-through expectations false.
- preserve a negative A15 regression guard.

## Required Proof After Approval

- the four current q3 failed assertions disappear.
- the two current q3 review-required markers disappear.
- q3 no longer maps `A15`.
- q3 retains `A61` and `A96`.
- q3 retains `A15` as forbidden.
- non-q3 governed failures remain visible.
- the Solo negative fixture still passes as fail-as-expected.
- reintroducing `A15` recreates q3 `ASSERT-OVER-TRIGGER` failures.
- no protected references, candidate storage, target exercises, lessons, PV,
  diagnostics, product routes, or student surfaces change.

## Human Review Packet

Start here:

`reports/review-gates/GATE-MTU-H5-q3-fixture-execution/review-packet.md`

Machine packet:

`reports/mtu-hardening/mtu-h5-q3-fixture-execution-authorization-packet.json`

Checker:

`build-scripts/references/check-mtu-h5-q3-fixture-execution-authorization-packet.js`

## Validation

```sh
node build-scripts/references/check-mtu-h5-q3-fixture-execution-authorization-packet.js
node build-scripts/references/check-mtu-h5-q3-execution-gate-packet.js
node build-scripts/references/check-mtu-h5-fu001-q3-execution-readiness-packet.js
node build-scripts/references/check-mtu-h5-mapping-regression.js --fixture reports/mtu-hardening/mtu-h5-regression-fixture.json --expect-fail --json
node build-scripts/reports/validate-report-json.js
node build-scripts/sprints/emit-url-index.js --check
npm run agent:index
npm run check:platform
```

`npm run agent:index` is a generator. Run it before final diff review and verify
the generated platform index lists this authorization packet, checker, and gate.

## Boundary

This packet is not execution authority. It prepares the exact authorization text
needed before the q3-only fixture mutation can be performed.
