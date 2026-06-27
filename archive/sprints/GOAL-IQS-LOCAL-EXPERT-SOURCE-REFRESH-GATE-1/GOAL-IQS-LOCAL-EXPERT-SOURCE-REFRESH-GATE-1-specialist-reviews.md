# GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1 Specialist Reviews

Status: All specialist blockers closed; ready for final lead review.
Date: 2026-06-26

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Product end-state checkout note: cross-repo citation resolved through the paired `4veco-lessen` checkout used for human review; this platform packet does not copy lesson-repo product state.
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1-sprint-plan.md`
- Selected decision under review: `PROCEED_TO_BOUNDED_SOURCE_REFRESH_PACKET`

## Non-Negotiable Requirements

- REV-STD-1 citations and classified findings are required.
- The accepted no-output decision boundary is preserved.
- No source refresh execution is authorized.
- No local expert substitution or contact is authorized.
- Explicit input, output, and official-source allowlists are required.
- England and Flanders jurisdiction gates are required.
- Simulations must stay internal-only and no-output.
- Forbidden audiences, claims, product routes, Scale Gate, diagnostics/mastery/PV, personal data, support/accommodation sufficiency, individual/reasonable-adjustment, learner/support-record, compliance, and inspection-readiness claims remain blocked.
- `blocks`, `does_not_block`, and `proof_required_to_close` must be present for carried findings.
- PASS WITH FLAGS may not carry a missing core requirement.

## Core-Requirement Checklist

| Requirement | Status | Proof |
| --- | --- | --- |
| Strict schema models actual packet shapes | closed | Schema now defines plan, simulation, decision, source protocol, role contract, jurisdiction gate, no-output, accessibility, and decision objects; checker validates reports and positive fixtures against it. |
| Required review records enforced | closed for specialist record | Checker requires both manual review records; this file closes the specialist record requirement, and the final lead record is the next required artifact. |
| England exact source allowlist enforced | closed | Checker compares source IDs, official URLs, roles, access dates, allowed use, and forbidden inference against the deepening descriptor allowlist. |
| England boundary simulation coverage | closed | England simulation now covers DfE, Ofsted, representative AQA, not-all-awarding-bodies, SEND/accessibility, and England-only/not-whole-UK boundaries. |
| Flanders source-authority design | closed | Flanders source-authority reviewer passed Onderwijsdoelen, OK-framework, study-direction, school-network, assessment-status, and Flanders-only boundaries. |
| Flanders accessibility/inclusion boundary | closed | Flanders gate now includes accessibility/inclusion and learner-support boundary language plus copied overlay accessibility and school-owned evidence records. |
| Adjustment and learner/support-record refusals | closed | Generator, schema, checker, CLI refusals, and negative fixtures cover individual adjustment, reasonable adjustment, learner/support-record, and support-record personal-data claims. |
| Teacher/economics mapping boundary | closed | Teacher/economics review passed Book 1 1.2/1.3 concept mapping and no-output/no-localized-content boundaries. |
| Legal/privacy boundary | closed | Legal/privacy review passed legal advice, compliance, personal-data, public/school output, and authority-claim refusals. |

## Specialist Results

| Reviewer | Initial Result | Repair | Re-Review Result |
| --- | --- | --- | --- |
| Schema/architecture lead | Held on strict schema and review-record enforcement | Added concrete schema definitions, schema-instance validation, exact source allowlist checks, and manual review-record enforcement | Prior schema blocker closed; only final lead record remains as next artifact |
| England authority/source reviewer | Held on England source allowlist enforcement and coverage | Added exact England source protocol enforcement and DfE/Ofsted/AQA/SEND/England-only boundary-focus cases | Prior England blockers closed |
| Flanders authority/source reviewer | Flanders substance passed; held on review-record enforcement | Checker now requires manual review records; Flanders accessibility/source boundary strengthened | Flanders substance remains passed |
| Teacher/economics reviewer | Passed | No repair required | Passed |
| Legal/privacy reviewer | Passed with final-readiness carry flags | No legal/privacy repair required; refusal coverage widened for adjustment/support-record claims | Passed |
| Accessibility/inclusion reviewer | Held on Flemish inclusion and machine-blocked adjustment/support-record claims | Added Flanders inclusion/learner-support boundary, overlay accessibility evidence records, explicit flags, CLI refusals, negative fixtures, and checker assertions | Prior accessibility blockers closed |

## Classified Findings

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| Specialist substantive blockers are closed. | `core_requirement_met` | Nothing in specialist scope. | Final lead review and exact-head PR readiness. | Keep generator, checker, focused Jest, roadmap index, scope-language, governance wording, diff hygiene, and platform validation green. |
| The packet remains internal-only and no-output. | `scale_blocker` | Source refresh execution, local expert substitution, localized/student/teacher/school/public output, evidence packs, product-route adoption, Scale Gate, diagnostics/mastery/PV, student/product use, personal-data processing, support/accommodation sufficiency, individual/reasonable adjustment, learner/support-record, compliance, approval, accreditation, OP0, PTA, summative validity, and inspection-readiness claims. | Final lead review of the internal gate design. | Separate reviewed sprint and explicit owner authorization before any downstream authority. |
| Final lead review is the next required artifact. | `minor_carry_flag` | Human-review readiness until final lead review and exact-head validation pass. | Specialist closure. | Add `GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1-final-lead-review.md`, rerun focused validation green, then open a fresh PR. |
