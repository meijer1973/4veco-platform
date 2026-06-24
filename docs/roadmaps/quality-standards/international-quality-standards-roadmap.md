# International Quality Standards Roadmap

Status: active internal overlay trial-planning roadmap
Repository: `4veco-platform`
Primary target path: `docs/roadmaps/quality-standards/international-quality-standards-roadmap.md`
Roadmap ID: `international-quality-standards-foundation`
Roadmap version: `v0.4-internal-overlay-trial-planning-human-review`
Sprint status: `GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1` current / internal-only overlay trial architecture planning packet for human review
Human owner: HCS / Marcel
Team mode: isolated worktree, internal analysis only, no country edition or external claim

## 0. Purpose

This roadmap defines a separate international quality-standards foundation
track after the Dutch internal/report-only system reached accepted
`CLOSE_INTERNAL_SYSTEM` closure on PR #124.

The goal is to determine whether 4veco can use a shared upper-secondary
economics product common core with explicit jurisdiction overlays for
countries and subnational systems outside the Netherlands.

The endpoint of this foundation track is not a country-compliant edition,
inspection approval, legal compliance, accreditation, public claim, school pack
trial, teacher/school-facing distribution, product route, Scale Gate,
diagnostics/mastery/PV, student/product use, personal-data processing, OP0,
PTA, summative, or inspection-readiness claim.

The endpoint is:

> 4veco has an internal, source-traceable foundation for deciding whether
> international economics quality work can proceed through a common core plus
> jurisdiction overlays, with all school-owned and competent-authority evidence
> boundaries still explicit.

## 1. Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Product vision: `../4veco-lessen/specifications/product-vision.md`
- Quality standards end-state:
  `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- Dutch closure basis:
  `archive/sprints/GOAL-DQS-CLOSURE-1A/GOAL-DQS-CLOSURE-1A-human-review-packet.md`
- Original sprint/gate spec:
  `archive/sprints/GOAL-IQS-FOUNDATION-1/GOAL-IQS-FOUNDATION-1-authorisation-note.md`
- International foundation sprint:
  `archive/sprints/GOAL-IQS-FOUNDATION-1/GOAL-IQS-FOUNDATION-1-sprint-plan.md`
- Accepted overlay-architecture sprint:
  `archive/sprints/GOAL-IQS-OVERLAY-ARCHITECTURE-1/GOAL-IQS-OVERLAY-ARCHITECTURE-1-sprint-plan.md`
- Accepted selected-deepening sprint:
  `archive/sprints/GOAL-IQS-SELECTED-DEEPENING-1/GOAL-IQS-SELECTED-DEEPENING-1-sprint-plan.md`
- Current internal overlay trial-planning sprint:
  `archive/sprints/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1-sprint-plan.md`

## 2. Non-Negotiable Requirements

- Use REV-STD-1 for review packets, lead reviews, product-proof gates, and any
  later Scale Gate preparation.
- Cite product end-state and this roadmap in each human-review packet.
- Include a core-requirement checklist.
- Classify findings and carried issues.
- Include `blocks`, `does_not_block`, and `proof_required_to_close`.
- PASS WITH FLAGS may not carry a missing core requirement.
- Use official-source anchors for each jurisdiction wherever possible.
- Represent subnational/federal governance precisely:
  Flanders is not all Belgium, England is not the whole UK, Germany requires
  KMK plus Land overlays, Spain requires autonomous-community overlays, and
  the United States has federal context plus state/local/accountability
  examples, not a national inspection regime.
- Keep all compliance, approval, public, school-facing, product-route,
  Scale Gate, diagnostics/mastery/PV, student-use, personal-data, OP0, PTA,
  summative, and inspection-readiness authority blocked.

## 3. Completed Foundation Scope

`GOAL-IQS-FOUNDATION-1` was accepted after PR #131 and created:

- official-source authority profiles for the Netherlands, Flanders, England,
  Germany, France, Italy, Spain, Poland, and the United States;
- an international common-core model;
- an overlay architecture;
- a commonalities/differences report;
- a bounded Book 1 Chapters 1.2 and 1.3 portability check;
- a foundation decision choosing exactly one of:
  `PROCEED_WITH_COMMON_CORE_AND_OVERLAYS`,
  `LIMIT_TO_SELECTED_JURISDICTIONS`, or
  `RESEARCH_GAPS_BEFORE_ARCHITECTURE`;
- manual generator/checker scripts and refusal tests;
- validation, specialist-review, final lead-review, and human-review records.

It did not create country editions, country compliance claims, local exam-code
implementation, teacher/school-facing output, public output, evidence-pack
deployment, package/CI/dashboard/quality-ref/Scale Gate integration, product
routes, diagnostics/mastery/PV, student/product use, personal-data processing,
or school-owned evidence flows.

## 4. Completed Overlay-Architecture Scope

`GOAL-IQS-OVERLAY-ARCHITECTURE-1` was accepted after PR #134 and created:

- an internal jurisdiction overlay descriptor schema;
- explicit v0 overlay descriptors for England, Flanders, Bavaria/Germany, and
  California/United States;
- internal descriptor-contract and governance-rule documentation;
- a Book 1 Chapters 1.2/1.3 overlay crosswalk;
- an archetype report;
- an architecture decision selecting
  `PROCEED_TO_SELECTED_JURISDICTION_DEEPENING`;
- manual generator/checker scripts and refusal tests;
- validation, specialist-review, final lead-review, PR proof, and human-review
  records.

It did not create country editions, local implementation, local exam-code
implementation, teacher/school-facing output, public output, evidence-pack
deployment, package/CI product integration, dashboard gates, quality-ref or
Scale Gate integration, product routes, diagnostics/mastery/PV,
student/product use, personal-data processing, compliance, approval,
accreditation, OP0, PTA, summative, inspection-readiness, or school-owned
evidence flows.

## 5. Completed Selected-Deepening Scope

`GOAL-IQS-SELECTED-DEEPENING-1` was accepted and merged on PR #136 and created:

- a nested `international-jurisdiction-overlay.schema.v1.json` with positive
  and negative fixtures;
- England and Flanders deepening descriptors only;
- exact Book 1 Chapters 1.2 and 1.3 deep crosswalks for England and Flanders;
- internal transformation specifications for unchanged content,
  substitutions, extensions, exclusions, citations, and assessment-task
  replacement boundaries;
- a comparative readiness report and decision choosing exactly one of:
  `PROCEED_TO_INTERNAL_OVERLAY_PROTOTYPE_PLANNING`,
  `LIMIT_DEEPENING_TO_ONE_JURISDICTION`, or
  `RESEARCH_GAPS_BEFORE_PROTOTYPE_PLANNING`;
- manual generator/checker scripts, positive and negative schema fixtures,
  refusal tests, validation records, specialist reviews, final lead review,
  PR proof, and human-review records.

It did not create localized textbook chapters, country editions, local
implementation, local exam-code implementation, teacher/school-facing output,
public output, evidence-pack deployment, package/CI product integration,
dashboard gates, quality-ref or Scale Gate integration, product routes,
diagnostics/mastery/PV, student/product use, personal-data processing,
compliance, approval, accreditation, OP0, PTA, summative,
inspection-readiness, or school-owned evidence flows.

## 6. Current Internal Overlay Trial-Planning Scope

`GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1` may create:

- an internal overlay trial-planning contract;
- an internal trial plan in Markdown and JSON;
- a refusal matrix in Markdown and JSON;
- a planning decision report choosing exactly one of:
  `PROCEED_TO_INTERNAL_OVERLAY_TRIAL_CONTRACT_DRAFT`,
  `SOURCE_REFRESH_BEFORE_TRIAL_CONTRACT`, or
  `STOP_INTERNAL_OVERLAY_PROTOTYPE_TRACK`;
- a manual generator/checker and focused Jest tests;
- validation, specialist-review, final lead-review, PR proof, and
  human-review records.

It must not create trial runtime execution, localized overlay output,
localized textbook chapters, country editions, local implementation,
local exam-code implementation, teacher/school-facing output, public output,
evidence-pack deployment, package/CI product integration, dashboard gates,
quality-ref or Scale Gate integration, product routes, diagnostics/mastery/PV,
student/product use, personal-data processing, compliance, approval,
accreditation, OP0, PTA, summative, inspection-readiness, school-owned
evidence collection, support-sufficiency claims, accommodation-sufficiency
claims, automated source refresh, or local-expert substitution.

## 7. Architecture Direction

The current architecture preserves four layers:

1. Shared economics product core.
2. Jurisdiction curriculum and assessment overlay.
3. Jurisdiction source-evidence overlay.
4. School-owned and competent-authority evidence boundary.

The first layer may become a shared textbook/product architecture. The other
layers require source refresh, local expert review, and separate human approval
before any implementation.

## 8. Core-Requirement Checklist

| Requirement | Status | Proof required to close |
|---|---|---|
| Official-source profiles for all nine foundation jurisdictions | closed | PR #131 accepted and merged |
| Common-core matrix distinguishes portable product evidence from local overlay needs | closed | `international-common-core.v0.json` and PR #131 final lead PASS |
| Descriptor schema names required overlay fields and blocks implicit discovery | closed | `international-jurisdiction-overlay.schema.json`, PR #134 accepted and merged |
| England, Flanders, Bavaria/Germany, and California/United States descriptors cover four governance archetypes | closed | Descriptor JSON, country/source reviews, and PR #134 final lead PASS |
| Book 1 Chapters 1.2/1.3 crosswalk remains internal and route-local | closed | `book1-1.2-1.3-overlay-crosswalk.md/json` and PR #134 teacher/economics review |
| Final overlay decision selects exactly one allowed option | closed | `international-overlay-architecture-decision.md/json` selected `PROCEED_TO_SELECTED_JURISDICTION_DEEPENING` |
| Nested descriptor schema v1 closes shallow-schema carry item before expanded machine consumption | closed | `international-jurisdiction-overlay.schema.v1.json`, fixtures, PR #136 accepted and merged |
| England and Flanders deep descriptors use official-source allowlists and precise jurisdiction boundaries | closed | `england.deepening.v1.json`, `flanders.deepening.v1.json`, source reviews, PR #136 accepted and merged |
| Book 1 Chapters 1.2/1.3 deep crosswalks classify exact local fit, gaps, and transformation needs | closed | England/Flanders deep crosswalk Markdown/JSON and teacher/economics review |
| Transformation contract remains internal and excludes localized lesson output | closed | `selected-jurisdiction-transformation-contract.md` and refusal tests |
| Comparative readiness decision selects exactly one allowed option | closed | Selected-jurisdiction readiness comparison and decision reports selected `PROCEED_TO_INTERNAL_OVERLAY_PROTOTYPE_PLANNING` |
| Internal planning packet binds to accepted selected-deepening decision | current sprint | `internal-overlay-prototype-plan.md/json` and checker PASS |
| Internal planning packet uses exact input and output allowlists | current sprint | Generator/checker output allowlist and input allowlist checks |
| Trial planning preserves no-output, no-runtime, no-product-route, and no-school-facing boundaries | current sprint | Refusal matrix and false blocked-authority flags |
| Future trial contract field families preserve source traceability and blocker display | current sprint | `internal-overlay-prototype-planning-contract.md` |
| Planning decision selects exactly one allowed option | current sprint | `internal-overlay-prototype-planning-decision.md/json` |
| Specialist reviews and final lead review are completed before human review | current sprint | Specialist gate record and final lead PASS |
| Human review happens before any later trial-contract draft authority | current sprint | PR freshness, CI, PR Readiness Reviewer, and human review |

## 9. Candidate Future Sprints

These rows are not implementation authority unless a later human review
explicitly approves them.

| Candidate sprint | Intended scope | Authorisation status |
|---|---|---|
| `GOAL-IQS-INTERNAL-OVERLAY-TRIAL-CONTRACT-DRAFT-1` | If the human owner accepts `PROCEED_TO_INTERNAL_OVERLAY_TRIAL_CONTRACT_DRAFT`, draft a non-executing internal trial contract with schema/fixture boundaries only. | not authorised until human acceptance |
| `GOAL-IQS-SOURCE-REFRESH-1` | Refresh sources and resolve source gaps for a selected subset of jurisdictions. | not authorised |
| `GOAL-IQS-LOCAL-EXPERT-GATE-1` | Require local subject/inspection/legal review before any local overlay implementation. | not authorised |
| `GOAL-IQS-BOOK1-PORTABILITY-2` | Deepen the Book 1 portability check after local overlay descriptors exist. | not authorised |

## 10. Explicitly Blocked Work

```text
country-compliant edition
inspectorate approval claim
legal compliance claim
school pack trial
teacher/school-facing output or distribution
public/external output or sharing
evidence-pack deployment
package script or CI invocation
dashboard gate
quality-ref integration
Scale Gate integration
product-route adoption
diagnostics/mastery/PV
student/product use
personal-data processing
complete OP0/basic-skills claim
PTA or summative validity claim
inspection-readiness claim
school-owned implementation evidence flow
support-sufficiency claim
accommodation-sufficiency claim
trial runtime execution
localized overlay output generation
fixture-to-product promotion
automated source refresh
local expert substitution
```

## 11. Current Recommended Next Step

Recommended next operational step:

```text
Review the GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1 planning packet after
specialist reviews, final lead review, PR publication, branch freshness, and
green CI are complete.
```

Human acceptance of `GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1` may
authorise only a later internal trial-contract draft sprint. It must not
unlock trial runtime execution, country implementation, localized textbook
or overlay output, school or public distribution, product routes, Scale Gate,
diagnostics/mastery/PV, student/product use, personal-data processing,
compliance, approval, accreditation, OP0, PTA, summative, or
inspection-readiness, support-sufficiency, or accommodation-sufficiency
claims.
