# Sprint `GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1`: Internal Overlay Trial Planning

Status: ready_for_human_review_after_required_gates
Date: 2026-06-24

## Goal

Create an internal-only planning packet for a later non-executing overlay
trial-contract draft for England and Flanders. The packet must bind to the
accepted selected-deepening decision, define exact input and output allowlists,
preserve source traceability, keep blocker display visible, and return for
human review before any later contract-draft authority.

## Context

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1-sprint-plan.md`
- Accepted selected-deepening decision: `PROCEED_TO_INTERNAL_OVERLAY_PROTOTYPE_PLANNING`
- Accepted decision source: `reports/inspection-standards/selected-jurisdiction-deepening-decision.md`
- Roadmap: `docs/roadmaps/quality-standards/international-quality-standards-roadmap.md`

The selected-deepening decision authorizes planning only. It does not authorize
runtime execution, localized lesson output, teacher/school-facing output,
public output, product-route adoption, Scale Gate, diagnostics/mastery/PV,
student/product use, personal-data processing, legal sufficiency, compliance,
approval, OP0, PTA, summative, or inspection-readiness claims.

## Quality Standard

The quality floor is a specification-bound, internal-only planning packet with
deterministic proof. It must cite the product end-state and original sprint
specification, keep all rendered output and student-facing use blocked, and
name any follow-up as a separate human-authorized sprint rather than implied
implementation authority.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
| --- | --- | --- | --- |
| `accepted_decision_bound` | The plan is bound to the accepted selected-deepening decision and does not reinterpret it as implementation authority. | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. | met_for_internal_planning |
| `input_allowlist` | The plan names an exact input allowlist from selected-deepening reports, crosswalks, descriptors, and transformation contract. | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. | met_for_internal_planning |
| `output_allowlist` | The plan names an exact output allowlist for planning records only. | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. | met_for_internal_planning |
| `no_output_boundary` | No localized chapters, generated lesson output, country edition, teacher/school-facing output, public output, or evidence pack is created or authorized. | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. | met_for_internal_planning |
| `prototype_scope` | The trial architecture is planning-only and manually invoked; it describes a later contract draft without runtime execution. | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. | met_for_internal_planning |
| `source_traceability` | Every later trial-contract question must point to selected-jurisdiction sources, crosswalk rows, and known gaps. | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. | met_for_internal_planning |
| `blocker_display` | Future trial-contract surfaces must visibly retain route-local-only status, school-owned evidence needs, forbidden inferences, and owner next action. | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. | met_for_internal_planning |
| `support_accommodation_boundary` | Future trial-contract rows must keep support sufficiency, accommodation sufficiency, individual adjustment, and support-record personal-data claims blocked. | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. | met_for_internal_planning |
| `refusal_stop_conditions` | Forbidden audiences, authority jumps, implicit discovery, integration requests, and compliance claims fail closed. | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. | met_for_internal_planning |
| `review_gates` | The plan requires specialist and final lead review before any later trial-contract draft can be returned. | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. | met_for_internal_planning |
| `human_review_stop` | The current sprint returns for human review and does not unlock implementation without a separate exact-head decision. | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. | met_for_internal_planning |

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
| --- | --- | --- |
| Add explicit support/accommodation blocker fields and refusal cases. | `include_now` | Included in this sprint after accessibility review. |
| Carry exact source-freshness fields into the later trial-contract draft. | `defer_named_follow_up` | Defer to `GOAL-IQS-INTERNAL-OVERLAY-TRIAL-CONTRACT-DRAFT-1` if human authorized. |
| Generate localized chapters, teacher packs, evidence packs, or product routes. | `reject_scope_creep` | Rejected as outside current authority. |

## Allowed paths

- `docs/inspection-standards/internal-overlay-prototype-planning-contract.md`
- `reports/inspection-standards/internal-overlay-prototype-plan.md`
- `reports/inspection-standards/internal-overlay-prototype-plan.json`
- `reports/inspection-standards/internal-overlay-prototype-refusal-matrix.md`
- `reports/inspection-standards/internal-overlay-prototype-refusal-matrix.json`
- `reports/inspection-standards/internal-overlay-prototype-planning-decision.md`
- `reports/inspection-standards/internal-overlay-prototype-planning-decision.json`
- `archive/sprints/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1-sprint-plan.md`

The generator may read only the exact input allowlist and may write only these
planning records. It must not write to `references/machine/`,
`references/external/`, generated lesson output, package integration,
dashboard gates, quality-ref routes, or product surfaces.

## Forbidden paths

- `references/machine/`
- `references/external/`
- `../4veco-lessen/generated/`
- `../4veco-lessen/books/`
- product-route, dashboard, quality-ref, Scale Gate, CI/package integration,
  teacher/school-facing, public, evidence-pack, student-use, personal-data, or
  compliance/approval surfaces

## Inputs

- `reports/inspection-standards/selected-jurisdiction-deepening-decision.json`
- `reports/inspection-standards/selected-jurisdiction-readiness-comparison.json`
- `reports/inspection-standards/england-book1-1.2-1.3-deep-crosswalk.json`
- `reports/inspection-standards/flanders-book1-1.2-1.3-deep-crosswalk.json`
- `references/data/inspection-standards/overlays/england.deepening.v1.json`
- `references/data/inspection-standards/overlays/flanders.deepening.v1.json`
- `docs/inspection-standards/selected-jurisdiction-transformation-contract.md`

## Outputs

- `docs/inspection-standards/internal-overlay-prototype-planning-contract.md`
- `reports/inspection-standards/internal-overlay-prototype-plan.md`
- `reports/inspection-standards/internal-overlay-prototype-plan.json`
- `reports/inspection-standards/internal-overlay-prototype-refusal-matrix.md`
- `reports/inspection-standards/internal-overlay-prototype-refusal-matrix.json`
- `reports/inspection-standards/internal-overlay-prototype-planning-decision.md`
- `reports/inspection-standards/internal-overlay-prototype-planning-decision.json`
- `archive/sprints/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1-sprint-plan.md`

## Operationalized sprint procedure

1. Generate the allowlisted internal planning packet and stop on any request
   for forbidden output, implicit discovery, runtime execution, support or
   compliance claims, product routes, or downstream authority.
2. Run deterministic validators and acceptance tests, including the generator
   currentness check, packet checker, focused Jest refusal tests, sprint-plan
   checker, roadmap/index checks, scope-language check, report JSON validation,
   line-ending check, diff hygiene, and platform tests.
3. Run specialist reviews for lead architecture, teacher/economics,
   legal/privacy, Dutch inspection/product boundary, accessibility/inclusion,
   and jurisdiction-source safety. Correct every blocker before final lead.
4. Open a PR only after validation is green, then run exact-head CI,
   branch-protection validation, and the PR Readiness Reviewer. The decision
   must route to human review before any later trial-contract draft authority.

## Acceptance tests

```bash
node build-scripts/inspection/build-internal-overlay-prototype-planning.js --check
node build-scripts/inspection/check-internal-overlay-prototype-planning.js
npx jest build-scripts/inspection/check-internal-overlay-prototype-planning.test.js --runInBand
node build-scripts/sprints/check-sprint-plan.js archive/sprints/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1-sprint-plan.md
node build-scripts/sprints/check-sprint-bundle.js reports/sprints/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1-result.json
node build-scripts/references/check-roadmap-version-index.js
npm run check:scope-language
npm run check:platform
```

## Proof Required to Close

Proof required to close must include review, validator, and test evidence,
specialist review results, correction records, final lead review, exact remote-head CI,
branch-protection checker output with `ok: true`, PR Readiness Reviewer route
output, route-appropriate owner authorization, and exact remote-head evidence.
Any new commit after readiness review requires a fresh route decision.

## Rollback plan

Revert only this sprint's generated planning packet, generator, checker,
focused tests, sprint records, and roadmap/index updates. Do not alter the
accepted selected-deepening artifacts or unrelated roadmap state.

## Human review required

Human review is required before accepting
`PROCEED_TO_INTERNAL_OVERLAY_TRIAL_CONTRACT_DRAFT`. Approval may authorize only a later
internal-only trial-contract draft sprint. It must not unlock runtime
execution, localized output, country editions, school/public output,
evidence packs, product-route adoption, Scale Gate, diagnostics/mastery/PV,
student/product use, personal-data processing, compliance, approval,
accreditation, OP0, PTA, summative, inspection-readiness, support sufficiency,
or accommodation sufficiency claims.
