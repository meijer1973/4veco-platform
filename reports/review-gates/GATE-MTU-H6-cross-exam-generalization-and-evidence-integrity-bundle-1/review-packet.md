# GATE-MTU-H6 Cross-Exam Generalization And Evidence Integrity Bundle 1

Status: `pending human review`

Review standard: `REV-STD-1`

## Product End-State

This review can approve only an MTU-H6 evidence-integrity/generalization review candidate. It does not close MTU-H6 and does not authorize Scale Gate 1, product-route readiness, diagnostics, PV, mastery, sequencing, lesson output, summative use, or student/product use.

## Original Sprint/Gate Spec

After MTU-H5 closure, MTU-H6 must test whether H5 mapping rules generalize to fresh official cross-exam evidence while preserving operation decomposition, required/forbidden MTUs, answer-form/misconception/scale/procedure hooks, explicit negative fixtures, and stronger evidence-reference integrity.

## Non-Negotiable Requirements

- Fresh sample relative to MTU-H5.
- Local official/reference evidence only.
- Rendered official pages content-addressed by source PDF hash, PNG hash, page, and dimensions.
- JSON fragment anchors must resolve.
- Required MTUs must be live and actually mapped.
- Forbidden MTUs/routes must be covered by negative fixtures.
- Review-required gaps must not be reported as closure.
- No product, student, diagnostic, PV, lesson, target-exercise, candidate-write, source-overlay, external-source, machine-reference, or MTU mutation authority.

## Core Requirement Checklist

| Requirement | Status | Evidence |
|---|---:|---|
| Fresh sample | met | VWO/HAVO 2023-2024 records; H5 q3/q15/q19/q27 excluded. |
| Rendered official evidence | met | 13 content-addressed rendered pages in the H6 manifest. |
| Operation decomposition | met | Seven official correction-model operation records. |
| Answer-form/misconception/scale/procedure hooks | proof_required | Hooks are present; q4 and q23 remain answer-form review items. |
| Negative regression | met | q18 stale A15 and q10 missing incidence fail as expected. |
| Evidence-reference integrity | met | New resolver validates JSON anchors and synthetic exam-question anchors. |
| Authority boundary | met | All authority flags are false. |
| No false closure | met | Status is `review_required`, not closure. |

## Findings

### h6-generalization-partial-pass

Classification: `core_requirement_met`

Five of seven fresh cross-exam records pass under H5-style decomposition with stricter evidence refs.

Blocks: none.

Does not block: human review of this H6 review candidate; merge of checker/evidence-integrity scaffolding if validation passes.

Proof required to close: run the H6 checker and confirm report status `review_required` with five passed records, two review-required records, and zero failed records.

### q4-q23-answer-form-gaps

Classification: `proof_required`

q4 graph shading and q23 macro graph drawing need answer-form/equivalent decisions before H6 full closure.

Blocks: MTU-H6 full closure; unqualified cross-exam generalization claim; product-route adoption.

Does not block: human review of this bounded evidence-integrity packet; non-product checker hardening.

Proof required to close: approve graph-shading/arceer and macro teken answer-form evidence, or explicitly defer them to a later answer-form governance lane.

### negative-guards-present

Classification: `core_requirement_met`

The package includes negative fixtures for stale A15 over-trigger and missing incidence/pass-through mapping.

Blocks: none.

Does not block: human review of this H6 review candidate.

Proof required to close: checker must show both negative fixtures fail as expected.

### authority-boundary-preserved

Classification: `non_authorization_boundary`

The package is checker/report/evidence work only and grants no product or mutation authority.

Blocks: Scale Gate 1; product-route readiness; diagnostics; PV; lesson output; student/product use.

Does not block: review of the H6 evidence-integrity package.

Proof required to close: separate downstream review must explicitly grant any product or student-use authority.

## Review Packet

Start with:

- `reports/mtu-hardening/mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.md`
- `reports/mtu-hardening/mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.json`
- `reports/mtu-hardening/mtu-h6-cross-exam-generalization-fixture.json`
- `reports/mtu-hardening/mtu-h6-cross-exam-generalization-report.json`
- `build-scripts/references/check-mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.js`
- `build-scripts/references/lib/evidence-reference-resolver.js`

Then inspect the rendered official evidence under:

`reports/mtu-hardening/mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1-evidence/`

## Validation

```bash
node --check build-scripts/references/lib/evidence-reference-resolver.js
node --check build-scripts/references/check-mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.js
node build-scripts/references/check-mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.js
node build-scripts/reports/validate-report-json.js
node build-scripts/sprints/emit-url-index.js --check
npm run agent:index
npm run check:platform
git diff --check
```
