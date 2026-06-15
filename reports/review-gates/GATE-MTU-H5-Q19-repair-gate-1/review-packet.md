# GATE-MTU-H5 Q19 Repair Gate 1 Review Packet

Status: `pending_human_review`

Created: 2026-06-12

This gate reviews the proposed q19 repair sequence after PR #51. It does not
authorize execution by itself.

## Review Decision Needed

Decide whether q19 must proceed next to a non-mutating source/graph extraction
gate before any q19 fixture, mapper, candidate, protected-reference, or product
route work.

Decision phrase: `source/graph extraction gate` before q19 fixture or mapper
repair.

Valid human decisions:

- approve `approve_source_graph_extraction_gate_first`
- revise the q19 repair gate before the next gate
- reject `source_graph_extraction_gate_first`

If approving the next gate, approval must keep q19 fixture mutation,
source-annex extraction execution, graph-object extraction execution,
candidate writes, protected references, lessons, diagnostics, PV, product
routes, and student/product use unauthorized unless separately stated.

## Review These Files

- `reports/mtu-hardening/mtu-h5-q19-repair-gate-1.md`
- `reports/mtu-hardening/mtu-h5-q19-repair-gate-1.json`
- `build-scripts/references/check-mtu-h5-q19-repair-gate-1.js`
- `reports/mtu-hardening/mtu-h5-regression-report.json`
- `reports/mtu-hardening/mtu-h5-regression-report.md`
- `reports/mtu-hardening/mtu-h5-post-q3-evidence-refresh-1.json`
- `reports/mtu-hardening/mtu-h5-rp003-rp004-q19-planning-packet.json`
- `reports/review-gates/GATE-MTU-H5-RP003-RP004-q19-planning-packet/gate-closure.json`
- `reports/mtu-hardening/mtu-h5-regression-fixture.json`
- `build-scripts/references/check-mtu-h5-mapping-regression.js`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.json#q19`
- `reports/review-gates/GATE-EX5-operation-answer-skill-contract/gate-closure.json#q19`

## Questions For Human Review

- Does the packet correctly preserve the current q19 3 failed / 20
  review_required diagnostic state?
- Does it correctly reject fixture-only q19 repair as premature?
- Does it correctly identify source-annex extraction review as necessary before
  q19 repair?
- Does it correctly identify graph-object extraction review as necessary before
  q19 repair?
- Does it correctly keep graph/draw/teken answer-form coverage unresolved?
- Does it correctly keep A45 forbidden as primary q19 support?
- Does the temporary A45 negative guard prove over-trigger regression without
  mutating the real fixture?
- Does it avoid protected-reference, candidate-storage, authored-target-exercise,
  lesson, product-route, PV, diagnostics, and student/product-use authority?

## Review Threshold

The teacher, economist, and quality-inspection reviewers must all be
`MORE_THAN_SATISFIED`.

## Validation

```sh
node build-scripts/references/check-mtu-h5-q19-repair-gate-1.js
node build-scripts/references/check-mtu-h5-rp003-rp004-q19-planning-packet.js
node build-scripts/references/build-mtu-h5-regression-report.js --check
node build-scripts/references/check-mtu-h5-mapping-regression.js --fixture reports/mtu-hardening/mtu-h5-regression-fixture.json --expect-fail --json
node build-scripts/reports/validate-report-json.js
node build-scripts/sprints/emit-url-index.js --check
npm run agent:index
npm run check:platform
```

## Boundary

No q19 fixture mutation, q19 mapper repair execution, q19 source-annex
extraction execution, q19 graph-object extraction execution, candidate storage
creation, candidate writes, protected-reference mutation, machine-reference
mutation, external-source mutation, MTU minting/update/split/merge/deprecation,
operation-registry mutation, answer-skill mutation, authored target-exercise
mutation, lesson output, PV, diagnostics, adaptive routing, mastery,
sequencing, student-facing AI, summative use, product-route readiness claim, or
student/product use is authorized by this packet.
