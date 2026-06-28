# International Quality Standards Roadmap

Status: active local-expert/source-refresh gate roadmap
Repository: `4veco-platform`
Primary target path: `docs/roadmaps/quality-standards/international-quality-standards-roadmap.md`
Roadmap ID: `international-quality-standards-foundation`
Roadmap version: `v0.10-local-expert-review-request-packet-human-review`
Sprint status: `GOAL-IQS-LOCAL-EXPERT-REVIEW-REQUEST-PACKET-1` current / internal-only England/Flanders local expert review request packet for human review
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
- Accepted internal overlay trial-planning sprint:
  `archive/sprints/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1-sprint-plan.md`
- Accepted internal overlay trial-contract sprint:
  `archive/sprints/GOAL-IQS-INTERNAL-OVERLAY-TRIAL-CONTRACT-1/GOAL-IQS-INTERNAL-OVERLAY-TRIAL-CONTRACT-1-sprint-plan.md`
- Accepted internal no-output trial-simulation sprint:
  `archive/sprints/GOAL-IQS-INTERNAL-NO-OUTPUT-TRIAL-SIMULATION-1/GOAL-IQS-INTERNAL-NO-OUTPUT-TRIAL-SIMULATION-1-sprint-plan.md`
- Current local-expert/source-refresh gate sprint:
  `archive/sprints/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1-sprint-plan.md`
- Accepted bounded source-refresh packet sprint:
  `archive/sprints/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1-sprint-plan.md`
- Accepted source-refresh execution run sprint:
  `archive/sprints/GOAL-IQS-SOURCE-REFRESH-EXECUTION-PILOT-1/GOAL-IQS-SOURCE-REFRESH-EXECUTION-PILOT-1-sprint-plan.md`
- Current local expert review request packet sprint:
  `archive/sprints/GOAL-IQS-LOCAL-EXPERT-REVIEW-REQUEST-PACKET-1/GOAL-IQS-LOCAL-EXPERT-REVIEW-REQUEST-PACKET-1-sprint-plan.md`

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

## 6. Completed Internal Overlay Trial-Planning Scope

`GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1` was accepted and merged on
PR #145 and created:

- an internal overlay trial-planning contract;
- an internal trial plan in Markdown and JSON;
- a refusal matrix in Markdown and JSON;
- a planning decision report choosing exactly one of:
  `PROCEED_TO_INTERNAL_OVERLAY_TRIAL_CONTRACT_DRAFT`,
  `SOURCE_REFRESH_BEFORE_TRIAL_CONTRACT`, or
  `STOP_INTERNAL_OVERLAY_PROTOTYPE_TRACK`;
- a manual generator/checker and focused Jest tests;
- validation, specialist-review, final lead-review, PR proof, and
  human-review records;
- a decision selecting exactly one of:
  `PROCEED_TO_INTERNAL_OVERLAY_TRIAL_CONTRACT_DRAFT`,
  `SOURCE_REFRESH_BEFORE_TRIAL_CONTRACT`, or
  `STOP_INTERNAL_OVERLAY_PROTOTYPE_TRACK`.

It did not create trial runtime execution, localized overlay output,
localized textbook chapters, country editions, local implementation,
local exam-code implementation, teacher/school-facing output, public output,
evidence-pack deployment, package/CI product integration, dashboard gates,
quality-ref or Scale Gate integration, product routes, diagnostics/mastery/PV,
student/product use, personal-data processing, compliance, approval,
accreditation, OP0, PTA, summative, inspection-readiness, school-owned
evidence collection, support-sufficiency claims, accommodation-sufficiency
claims, automated source refresh, or local-expert substitution.

## 7. Completed Internal Overlay Trial-Contract Scope

`GOAL-IQS-INTERNAL-OVERLAY-TRIAL-CONTRACT-1` was accepted and merged on
PR #155 and created:

- a strict nested internal trial-contract schema;
- complete England and Flanders contracts for Book 1 Chapters 1.2 and 1.3;
- explicit source, output, freshness, transformation-action, blocker, and
  review-disposition bindings for every deep-crosswalk row;
- positive and negative fixtures proving refusal of source, freshness, missing
  row, implicit discovery, forbidden audience, personal-data, claim, support,
  accommodation, product-route, and Scale Gate failures;
- an internal no-output trace in Markdown and JSON;
- a validation report in Markdown and JSON;
- a decision report choosing exactly one of:
  `PROCEED_TO_INTERNAL_NO_OUTPUT_TRIAL_SIMULATION`,
  `REVISE_TRIAL_CONTRACT`, or
  `STOP_INTERNAL_OVERLAY_PROTOTYPE_TRACK`;
- manual generator/checker scripts, focused Jest tests, validation records,
  specialist reviews, final lead review, PR proof, human-review records, and
  post-merge CI proof.

It must not create trial runtime execution, localized textbook paragraphs,
localized exercises, answer models, student-facing files, country editions,
local implementation, local exam-code implementation, teacher/school-facing
output, public output, evidence-pack deployment, package/CI product
integration, dashboard gates, quality-ref or Scale Gate integration, product
routes, diagnostics/mastery/PV, student/product use, personal-data processing,
compliance, approval, accreditation, OP0, PTA, summative,
inspection-readiness, school-owned evidence collection, support-sufficiency
claims, accommodation-sufficiency claims, automated source refresh, or
local-expert substitution.

## 8. Completed Internal No-Output Trial Simulation Scope

`GOAL-IQS-INTERNAL-NO-OUTPUT-TRIAL-SIMULATION-1` was accepted and merged on
PR #161 and created:

- a strict nested internal no-output trial-simulation schema;
- deterministic England and Flanders simulation reports over the accepted
  trial-contract rows;
- a combined internal simulation report, validation report, and decision
  report;
- positive and negative fixtures proving refusal of missing rows, unknown
  sources, localized output, student-facing output, runtime execution,
  teacher/school-facing output, public output, personal data, compliance
  claims, support/accommodation claims, product-route/Scale Gate requests,
  implicit discovery, source-refresh execution, and decision overclaims;
- manual generator/checker scripts and focused Jest tests;
- validation, specialist-review, final lead-review, PR proof, and human-review
  records.

It must retain every accepted row's route-local-only evidence status,
school-owned evidence need, forbidden inferences, accessibility/support
limitations, check-surface authority separation, owner next action, and proof
required to close.

It must not create trial runtime execution, source-refresh execution, local
expert substitution, localized textbook paragraphs, localized exercises,
localized answer models, localized assessment items, student-facing files,
country editions, local implementation, local exam-code implementation,
teacher/school-facing output, public output, evidence-pack deployment,
package/CI product integration, dashboard gates, quality-ref or Scale Gate
integration, product routes, diagnostics/mastery/PV, student/product use,
personal-data processing, compliance, approval, accreditation, OP0, PTA,
summative, inspection-readiness, school-owned evidence collection,
support-sufficiency claims, or accommodation-sufficiency claims.

The implemented decision selected
`PROCEED_TO_LOCAL_EXPERT_SOURCE_REFRESH_GATE_PLANNING`. It authorizes only this
later planning-only local-expert/source-refresh gate. It does not authorize
source refresh execution or local expert substitution.

## 9. Completed Local Expert Source Refresh Gate Scope

`GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1` was accepted and merged on
PR #163 and created:

- a strict internal local-expert/source-refresh gate schema;
- a local expert role contract covering allowed review scope, forbidden
  authority, source review, curriculum/assessment review, language/terminology
  review, accessibility/inclusion review, legal-claim boundary, school-owned
  evidence boundary, uncertainty handling, and required output format;
- England and Flanders jurisdiction gate docs;
- deterministic source-refresh protocol records for allowlisted official
  England and Flanders sources;
- internal source-refresh gate simulations for valid official source refresh
  request, stale source, source gap, non-official source, local expert
  uncertainty, attempted compliance claim, attempted localized output, and
  attempted school-facing output cases;
- positive and negative fixtures proving refusal of forbidden source, output,
  local expert substitution, source refresh execution, personal-data, support,
  compliance, and jurisdiction-overgeneralisation cases;
- a planning report and decision report choosing exactly one of:
  `PROCEED_TO_BOUNDED_SOURCE_REFRESH_PACKET`,
  `REVISE_LOCAL_EXPERT_SOURCE_GATE`, or `STOP_LOCAL_OVERLAY_TRACK`;
- manual generator/checker scripts and focused Jest tests;
- validation, specialist-review, final lead-review, PR proof, and human-review
  records.

It must not execute source refresh, contact or substitute local experts,
produce localized paragraphs, localized exercises, answer models, localized
assessment items, student-facing files, teacher/school-facing output, public
output, evidence packs, runtime behavior, package/CI product integration,
dashboard gates, quality-ref or Scale Gate integration, product routes,
diagnostics/mastery/PV, student/product use, personal-data processing,
compliance, approval, accreditation, OP0, PTA, summative validity,
inspection-readiness, support-sufficiency, or accommodation-sufficiency claims.

The implemented decision selected `PROCEED_TO_BOUNDED_SOURCE_REFRESH_PACKET`.
It authorizes only this later bounded source-refresh packet. It does not
authorize source-refresh execution, local expert contact, or local expert
substitution.

## 10. Completed Bounded Source Refresh Packet Scope

`GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1` was accepted and merged on
PR #167 and created:

- a strict bounded source-refresh packet schema;
- a packet contract with explicit source and output allowlists;
- exact England and Flanders source-refresh inventories using only the
  selected-deepening and gate allowlisted official sources;
- a refresh-state model covering `unchanged`, `updated_same_source`,
  `replaced_by_official_successor`, `official_source_unavailable`,
  `candidate_gap_found`, `out_of_scope_source_found`,
  `requires_local_expert_interpretation`, and
  `requires_human_owner_decision`;
- England and Flanders bounded packet docs;
- a local expert review request template that forbids legal, compliance,
  approval, inspection-readiness, school-evidence, student/product-use, and
  support/accommodation sufficiency claims;
- deterministic source-refresh simulations for official unchanged, official
  updated, successor, unavailable, non-official source, whole-UK, all-Belgium,
  expert-substitution, legal/compliance overclaim, support/accommodation
  sufficiency overclaim, localized-output, and personal-data cases;
- positive and negative fixtures proving refusal of forbidden source,
  execution, expert contact/substitution, output, personal-data, claim,
  jurisdiction-overgeneralisation, hidden-discovery, state-model, and template
  failures;
- a planning report and decision report choosing exactly one source-refresh
  execution option, revise-packet option, or stop-track option;
- manual generator/checker scripts and focused Jest tests;
- validation, specialist-review, final lead-review, PR proof, and human-review
  records.

It must not execute source refresh, run a source-refresh execution run,
contact or substitute local experts, produce localized paragraphs, localized
exercises, answer models, localized assessment items, student-facing files,
teacher/school-facing output, public output, country editions, evidence packs,
runtime behavior, package/CI product integration, dashboard gates, quality-ref
or Scale Gate integration, product routes, diagnostics/mastery/PV,
student/product use, personal-data processing, compliance, approval,
accreditation, OP0, PTA, summative validity, inspection-readiness,
support-sufficiency, accommodation-sufficiency, accessibility/legal
sufficiency, or school-owned evidence claims.

The implemented decision selected `PROCEED_TO_SOURCE_REFRESH_EXECUTION_PILOT`.
It authorised only this later bounded official-source refresh run.
It did not authorise unbounded source refresh, automated source refresh,
local expert contact, local expert substitution, localized output, runtime
execution, teacher/school-facing or public output, product routes, Scale Gate,
diagnostics/mastery/PV, student/product use, personal-data processing,
compliance, approval, accreditation, OP0, PTA, summative,
inspection-readiness, support-sufficiency, accommodation-sufficiency, or
accessibility/legal sufficiency claims.

## 11. Completed Source Refresh Execution Scope

`GOAL-IQS-SOURCE-REFRESH-EXECUTION-PILOT-1` was accepted and merged on
PR #169 and created:

- an internal-only bounded official-source refresh run for England
  and Flanders;
- per-source refresh results using only the accepted source-state vocabulary;
- England and Flanders source-refresh execution reports in Markdown and JSON;
- a delta/impact analysis that maps changed or uncertain source states to
  Book 1 Chapters 1.2/1.3, terminology, assessment, accessibility/support,
  school-owned evidence, legal/privacy boundaries, and later local-expert
  questions;
- a decision report choosing exactly one of:
  `PROCEED_TO_LOCAL_EXPERT_REVIEW_REQUEST_PACKET`,
  `REVISE_SOURCE_REFRESH_RESULTS`, or
  `STOP_LOCAL_OVERLAY_TRACK`;
- positive and negative fixtures proving refusal of non-official source
  promotion, hidden discovery, source refresh without allowlists, local expert
  substitution, legal/compliance overclaims, support/accommodation sufficiency
  overclaims, localized output, teacher/school-facing output, public output,
  personal data, whole-UK claims, all-Belgium claims, and unavailable-source
  overclaims;
- manual generator/checker scripts and focused Jest tests;
- validation, specialist-review, final lead-review, PR proof, human-review
  records, governed integration proof, and post-merge CI proof.

It must not contact or substitute local experts, use non-official or hidden
sources, run source refresh outside the explicit allowlists, produce localized
paragraphs, localized exercises, answer models, localized assessment items,
student-facing files, teacher/school-facing output, public output, country
editions, evidence packs, runtime behavior, package/CI product integration,
dashboard gates, quality-ref or Scale Gate integration, product routes,
diagnostics/mastery/PV, student/product use, personal-data processing,
compliance, approval, accreditation, OP0, PTA, summative validity,
inspection-readiness, support-sufficiency, accommodation-sufficiency,
accessibility/legal sufficiency, or school-owned evidence claims.

The implemented decision selected
`PROCEED_TO_LOCAL_EXPERT_REVIEW_REQUEST_PACKET`. It authorizes only this
current internal request-packet sprint. It must not itself contact local
experts or substitute local expert judgment.

## 12. Current Local Expert Review Request Packet Scope

`GOAL-IQS-LOCAL-EXPERT-REVIEW-REQUEST-PACKET-1` may create:

- an internal-only local expert review request contract for England and
  Flanders;
- request and response schemas for later expert input capture;
- England and Flanders request packets using only the accepted
  source-refresh execution results;
- request simulations and positive/negative fixtures proving refusal of
  legal advice, compliance proof, localized output, exam-ready exercise
  generation, school-owned evidence collection, student/personal data,
  local-expert authority substitution, hidden uncertainty, whole-UK
  overclaim, and all-Belgium overclaim cases;
- a decision report choosing exactly one of:
  `PROCEED_TO_LOCAL_EXPERT_CONTACT_PILOT`,
  `REVISE_LOCAL_EXPERT_REVIEW_REQUEST_PACKET`, or
  `STOP_LOCAL_OVERLAY_TRACK`;
- manual generator/checker scripts and focused Jest tests;
- validation, specialist-review, final lead-review, PR proof, and
  human-review records.

It must not contact experts, send requests, substitute expert judgment,
produce localized paragraphs, localized exercises, answer models, localized
assessment items, student-facing files, teacher/school-facing output, public
output, country editions, evidence packs, runtime behavior, package/CI
product integration, dashboard gates, quality-ref or Scale Gate integration,
product routes, diagnostics/mastery/PV, student/product use, personal-data
processing, compliance, approval, accreditation, OP0, PTA, summative validity,
inspection-readiness, support-sufficiency, accommodation-sufficiency,
accessibility/legal sufficiency, or school-owned evidence claims.

The implemented decision may select only whether to proceed to a later,
separately authorized local expert contact pilot. It must not itself contact
local experts, send request packets, or treat simulated expert responses as
expert evidence.

## 13. Architecture Direction

The current architecture preserves four layers:

1. Shared economics product core.
2. Jurisdiction curriculum and assessment overlay.
3. Jurisdiction source-evidence overlay.
4. School-owned and competent-authority evidence boundary.

The first layer may become a shared textbook/product architecture. The other
layers require source refresh, local expert review, and separate human approval
before any implementation.

## 14. Core-Requirement Checklist

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
| Internal planning packet binds to accepted selected-deepening decision | closed | PR #145 accepted and merged |
| Internal planning packet uses exact input and output allowlists | closed | Generator/checker output allowlist and input allowlist checks |
| Trial planning preserves no-output, no-runtime, no-product-route, and no-school-facing boundaries | closed | Refusal matrix and false blocked-authority flags |
| Future trial contract field families preserve source traceability and blocker display | closed | `internal-overlay-prototype-planning-contract.md` |
| Planning decision selects exactly one allowed option | closed | `internal-overlay-prototype-planning-decision.md/json` selected `PROCEED_TO_INTERNAL_OVERLAY_TRIAL_CONTRACT_DRAFT` |
| Specialist reviews and final lead review are completed before human review | closed | PR #145 final lead PASS and human acceptance |
| Human review happens before any later trial-contract draft authority | closed | PR #145 readiness proof, owner authorization, merge, and post-merge CI |
| Internal trial contract schema covers authority, source, scope, transformation, blocker, review, freshness, no-output, refusal, and closure fields | closed | PR #155 accepted, merged, and post-merge CI passed |
| England and Flanders contracts bind all Book 1 1.2/1.3 crosswalk rows | closed | `england-internal-overlay-trial-contract.md/json`, `flanders-internal-overlay-trial-contract.md/json`, checker PASS, and PR #155 accepted |
| Contract rows use strict transformation-action vocabulary | closed | `check-internal-overlay-trial-contract.js`, focused Jest PASS, and PR #155 accepted |
| No-output trace excludes localized paragraphs, exercises, answer models, and student-facing files | closed | `internal-overlay-no-output-trial-trace.md/json`, checker PASS, and PR #155 accepted |
| Positive and negative fixtures prove source, freshness, row, discovery, audience, personal-data, claim, support/accommodation, product, and Scale Gate refusals | closed | `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/**`, checker PASS, and PR #155 accepted |
| Trial-contract decision selects exactly one allowed option | closed | `internal-overlay-trial-contract-decision.md/json` selected `PROCEED_TO_INTERNAL_NO_OUTPUT_TRIAL_SIMULATION`; PR #155 accepted and merged |
| Specialist reviews and final lead review are completed before human review | closed | Specialist records, final lead PASS, exact-head readiness, and PR #155 human acceptance |
| Human review happens before any no-output trial simulation authority | closed | PR #155 governed integration, merge, and post-merge CI |
| Internal no-output simulation schema covers accepted contract lineage, source policy, row simulation, retained blocker display, no-output flags, refusal conditions, and finding classification | closed | PR #161 accepted, governed integration completed, and post-merge CI passed |
| England and Flanders simulations bind all accepted trial-contract rows | closed | `england-internal-no-output-trial-simulation.md/json`, `flanders-internal-no-output-trial-simulation.md/json`, checker PASS, PR #161 accepted |
| Simulation rows retain route-local-only status, school-owned evidence needs, forbidden inferences, accessibility/support limitations, check-surface separation, owner next action, and proof required to close | closed | Simulation JSON rows, checker PASS, and PR #161 accepted |
| No-output simulation excludes runtime execution, source refresh execution, local expert substitution, localized output, student-facing files, teacher/school-facing output, public output, evidence packs, and personal-data fields | closed | No-output flags, fixtures, checker PASS, and PR #161 accepted |
| Positive and negative fixtures prove missing-row, unknown-source, output, runtime, audience, personal-data, claim, product/Scale Gate, implicit-discovery, source-refresh, and overclaim refusals | closed | `references/data/inspection-standards/fixtures/internal-no-output-trial-simulation/**`, checker PASS, and PR #161 accepted |
| Simulation decision selects exactly one allowed option | closed | `internal-no-output-trial-simulation-decision.md/json` selects `PROCEED_TO_LOCAL_EXPERT_SOURCE_REFRESH_GATE_PLANNING`; PR #161 accepted |
| Specialist reviews and final lead review are completed before human review | closed | PR #161 specialist records, final lead PASS, exact-head readiness, payload authorization, and governed integration |
| Human review happens before any local-expert/source-refresh gate planning authority | closed | PR #161 human payload authorization and governed integration |
| Local expert role contract defines allowed scope and forbidden authority | closed | PR #163 accepted, governed integration completed, and post-merge CI passed |
| Source-refresh protocol distinguishes unchanged, updated, replaced, unavailable, gap, and outside-scope conditions | closed | `local-expert-source-refresh-gate-plan.md/json`, jurisdiction simulations, checker PASS, and PR #163 accepted |
| England gate covers DfE, Ofsted, AQA boundary, SEND/accessibility, and England-only/not-whole-UK limits | closed | `england-local-expert-source-gate.md`, England simulation checker PASS, and PR #163 accepted |
| Flanders gate covers Onderwijsdoelen, OK framework, study-direction/school-network, assessment-status, and Flanders-only/not-all-Belgium limits | closed | `flanders-local-expert-source-gate.md`, Flanders simulation checker PASS, and PR #163 accepted |
| Gate simulation refuses forbidden source, output, expert-substitution, personal-data, support, compliance, and jurisdiction-overgeneralisation cases | closed | `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/**`, checker PASS, and PR #163 accepted |
| Local-expert/source-refresh gate decision selects exactly one allowed option | closed | `local-expert-source-refresh-gate-decision.md/json` selects `PROCEED_TO_BOUNDED_SOURCE_REFRESH_PACKET`; PR #163 accepted |
| Specialist reviews and final lead review are completed before human review | closed | PR #163 specialist records, final lead PASS, exact-head readiness, payload authorization, governed integration, and post-merge CI |
| Human review happens before any bounded source-refresh packet authority | closed | PR #163 human payload authorization and governed integration |
| Bounded packet source inventory uses only allowlisted official England and Flanders sources | closed | `england-bounded-source-refresh-simulation.md/json`, `flanders-bounded-source-refresh-simulation.md/json`, checker PASS, and PR #167 accepted and merged |
| Refresh-state model includes all required states and closure fields | closed | `bounded-source-refresh-packet-contract.md`, plan JSON, jurisdiction simulations, checker PASS, and PR #167 accepted and merged |
| England packet covers DfE, Ofsted EIF, Ofsted operating guide, selected AQA boundary, SEND/accessibility, and England-only/not-whole-UK limits | closed | `england-bounded-source-refresh-packet.md`, England simulation checker PASS, and PR #167 accepted and merged |
| Flanders packet covers Onderwijsdoelen, OK framework, assessment-status, study-direction/school-network, accessibility/support, and Flanders-only/not-all-Belgium limits | closed | `flanders-bounded-source-refresh-packet.md`, Flanders simulation checker PASS, and PR #167 accepted and merged |
| Local expert review request template forbids legal, compliance, approval, inspection-readiness, school-evidence, student/product-use, and support/accommodation sufficiency claims | closed | `local-expert-review-request-template.md`, plan JSON, checker PASS, and PR #167 accepted and merged |
| Bounded packet simulations and fixtures refuse forbidden source, execution, expert, output, personal-data, claim, jurisdiction-overclaim, hidden-discovery, state-model, and template failures | closed | `references/data/inspection-standards/fixtures/bounded-source-refresh-packet/**`, checker PASS, and PR #167 accepted and merged |
| Bounded source-refresh packet decision selects exactly one allowed option | closed | `bounded-source-refresh-packet-decision.md/json` selected `PROCEED_TO_SOURCE_REFRESH_EXECUTION_PILOT`; PR #167 accepted and merged |
| Specialist reviews and final lead review are completed before human review | closed | PR #167 specialist records, final lead PASS, exact-head readiness, payload authorization, governed integration, and post-merge CI |
| Human review happens before any source-refresh execution-run authority | closed | PR #167 human payload authorization and governed integration |
| Source-refresh execution run uses only allowlisted official England and Flanders source rows | closed | `england-source-refresh-execution-results.md/json`, `flanders-source-refresh-execution-results.md/json`, checker PASS, specialist review, final lead review, exact-head PR readiness, green CI, human review, PR #169 governed integration, and post-merge CI |
| Every allowlisted England and Flanders source has exactly one classified refresh result | closed | Execution result JSON, checker PASS, specialist review, final lead review, exact-head PR readiness, green CI, human review, PR #169 governed integration, and post-merge CI |
| Changed or uncertain source states map to local-expert questions and impact fields without substituting local expert judgment | closed | `source-refresh-delta-impact-analysis.md/json`, checker PASS, specialist review, final lead review, exact-head PR readiness, green CI, human review, PR #169 governed integration, and post-merge CI |
| Negative fixtures refuse non-official sources, hidden discovery, no-allowlist refresh, local expert substitution, forbidden audiences, forbidden claims, personal data, jurisdiction overclaims, and unavailable-source overclaims | closed | `references/data/inspection-standards/fixtures/source-refresh-execution-pilot/**`, checker PASS, focused Jest PASS, specialist review, final lead review, exact-head PR readiness, green CI, human review, PR #169 governed integration, and post-merge CI |
| Source-refresh execution run decision selects exactly one allowed option | closed | `source-refresh-execution-pilot-decision.md/json` selected `PROCEED_TO_LOCAL_EXPERT_REVIEW_REQUEST_PACKET`; PR #169 accepted and merged |
| Specialist reviews and final lead review are completed before human review | closed | PR #169 specialist records, final lead PASS, exact-head readiness, payload authorization, governed integration, and post-merge CI |
| Human review happens before any local expert review request packet authority | closed | PR #169 human payload authorization and governed integration |
| Local expert review request schemas define allowed request fields, expected response fields, forbidden fields, authority boundaries, and no-contact proof | current sprint | `local-expert-review-request.schema.v1.json`, `local-expert-review-response.schema.v1.json`, checker PASS, specialist review, final lead review, exact-head PR readiness, green CI, and human review |
| England and Flanders request packets use only accepted source-refresh execution results and preserve jurisdiction boundaries | current sprint | `england-local-expert-review-request-packet.md/json`, `flanders-local-expert-review-request-packet.md/json`, checker PASS, specialist review, final lead review, exact-head PR readiness, green CI, and human review |
| Simulations and negative fixtures refuse contact, legal/compliance claims, localized output, school-owned evidence, student/personal data, hidden uncertainty, expert-authority substitution, whole-UK overclaim, and all-Belgium overclaim cases | current sprint | `local-expert-review-request-simulation.md/json`, `references/data/inspection-standards/fixtures/local-expert-review-request-packet/**`, checker PASS, focused Jest PASS, specialist review, final lead review, exact-head PR readiness, green CI, and human review |
| Local expert review request packet decision selects exactly one allowed option | current sprint | `local-expert-review-request-decision.md/json` selects one of the allowed request-packet decisions |
| Specialist reviews and final lead review are completed before human review | current sprint | Required before this PR can return for human review |
| Human review happens before any local expert contact-stage authority | current sprint | PR freshness, CI, PR Readiness Reviewer, branch protection, and human review |

## 15. Candidate Future Sprints

These rows are not implementation authority unless a later human review
explicitly approves them.

| Candidate sprint | Intended scope | Authorisation status |
|---|---|---|
| `GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1` | If the human owner accepts the request-packet decision, run a separately governed contact-stage run for contacting local experts from the accepted packet only. | not authorised |
| `GOAL-IQS-SOURCE-REFRESH-1` | Broader source refresh and source-gap resolution for selected jurisdictions after any reviewed execution run. | not authorised |
| `GOAL-IQS-LOCAL-EXPERT-GATE-1` | Require local subject/inspection/legal review before any local overlay implementation. | not authorised |
| `GOAL-IQS-BOOK1-PORTABILITY-2` | Deepen the Book 1 portability check after local overlay descriptors exist. | not authorised |

## 16. Explicitly Blocked Work

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
localized textbook paragraph generation
localized exercise generation
localized answer-model generation
student-facing file generation
fixture-to-product promotion
automated source refresh
source refresh outside explicit allowlists
local expert substitution
local expert contact
unbounded source-refresh execution run
hidden source discovery
```

## 17. Current Recommended Next Step

Recommended next operational step:

```text
Review the GOAL-IQS-LOCAL-EXPERT-REVIEW-REQUEST-PACKET-1 packet after
specialist reviews, final lead review, PR publication, branch freshness, branch
protection, PR Readiness Reviewer, and green CI are complete.
```

Human acceptance of `GOAL-IQS-LOCAL-EXPERT-REVIEW-REQUEST-PACKET-1` may
authorise only a later separately governed local expert contact-stage run. It must
not itself contact local experts, send request packets, substitute local
experts, unlock trial runtime execution, country implementation, localized
textbook or overlay output, localized exercises, answer models, assessment
items, student-facing files, school or public distribution, product routes,
Scale Gate, diagnostics/mastery/PV, student/product use, personal-data
processing, compliance, approval, accreditation, OP0, PTA, summative,
inspection-readiness, support-sufficiency, accommodation-sufficiency, or
accessibility/legal sufficiency claims.
