# GATE-MTU-H5 Q3 Fixture Execution Review Packet

Status: `pending_human_review`

Created: 2026-06-10

This gate asks for the explicit authorization required before q3-only mutation
of `reports/mtu-hardening/mtu-h5-regression-fixture.json` may happen.

This packet does not perform the mutation.

## Exact Approval Text

Use this text if approving:

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

## Must Review

- `reports/mtu-hardening/mtu-h5-q3-fixture-execution-authorization-packet.md`
- `reports/mtu-hardening/mtu-h5-q3-fixture-execution-authorization-packet.json`
- `build-scripts/references/check-mtu-h5-q3-fixture-execution-authorization-packet.js`
- `reports/mtu-hardening/mtu-h5-q3-execution-gate-packet.md`
- `reports/mtu-hardening/mtu-h5-q3-execution-gate-packet.json`
- `reports/review-gates/GATE-MTU-H5-q3-execution/review-packet.json`
- `reports/mtu-hardening/mtu-h5-regression-fixture.json`
- `build-scripts/references/check-mtu-h5-mapping-regression.js`
- `reports/mtu-hardening/mtu-h5-fu001-q3-execution-readiness-packet.json`
- `reports/mtu-hardening/mtu-h5-rp001-rp002-q3-repair-packet.json`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.json#q3`
- `reports/review-gates/GATE-EX5-operation-answer-skill-contract/gate-closure.json#q3`

## Review Questions

- Is q3-only fixture mutation now explicitly authorized?
- Is the allowed write surface limited to
  `reports/mtu-hardening/mtu-h5-regression-fixture.json`?
- Is the allowed mutation limited to the q3 record and q3-step-1/q3-step-2
  fields?
- Does the approval keep `A15` forbidden while removing `A15` from q3 mappings?
- Does the approval require `A61`/`A96` retention?
- Does the approval require reviewed-equivalent operation and answer-skill refs?
- Does the approval keep all protected, candidate, target-exercise, lesson,
  product, and student-use surfaces blocked?

## Review Threshold

Teacher, economist, and quality-inspection reviewers must all be
`MORE_THAN_SATISFIED`.

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

## Boundary

No q3 fixture mutation, mapper repair, candidate storage, candidate writes,
protected-reference mutation, machine-reference mutation, authored target
exercise mutation, MTU mutation, operation-registry mutation, answer-skill
mutation, lesson output, PV, diagnostics, adaptive routing, mastery, sequencing,
student-facing AI, summative use, product-route readiness claim, or
student/product use is authorized by this packet.
