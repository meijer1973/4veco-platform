# International Quality Standards Roadmap

Status: active foundation roadmap
Repository: `4veco-platform`
Primary target path: `docs/roadmaps/quality-standards/international-quality-standards-roadmap.md`
Roadmap ID: `international-quality-standards-foundation`
Roadmap version: `v0.1-foundation-human-review`
Sprint status: `GOAL-IQS-FOUNDATION-1` current / foundation packet for human review
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

## 3. Current Foundation Scope

`GOAL-IQS-FOUNDATION-1` may create:

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

It must not create country editions, country compliance claims, local exam-code
implementation, teacher/school-facing output, public output, evidence-pack
deployment, package/CI/dashboard/quality-ref/Scale Gate integration, product
routes, diagnostics/mastery/PV, student/product use, personal-data processing,
or school-owned evidence flows.

## 4. Architecture Direction

The foundation architecture has four layers:

1. Shared economics product core.
2. Jurisdiction curriculum and assessment overlay.
3. Jurisdiction source-evidence overlay.
4. School-owned and competent-authority evidence boundary.

The first layer may become a shared textbook/product architecture. The other
layers require source refresh, local expert review, and separate human approval
before any implementation.

## 5. Core-Requirement Checklist

| Requirement | Status | Proof required to close |
|---|---|---|
| Official-source profiles for all nine requested jurisdictions | current sprint | Generator/checker PASS and country/source reviewer verification |
| Common-core matrix distinguishes portable product evidence from local overlay needs | current sprint | `international-common-core.v0.json` and final lead PASS |
| Differences matrix names material divergences | current sprint | `international-commonalities-and-differences.md/json` |
| Overlay architecture has four bounded layers | current sprint | `international-overlay-architecture.md` and checker PASS |
| Book 1 portability check remains internal and bounded | current sprint | `international-book-portability-pilot.md/json` |
| Final decision selects exactly one allowed option | current sprint | `international-foundation-decision.md/json` and checker PASS |
| Forbidden authority remains blocked | current sprint | Refusal tests and false authority flags |
| Specialist reviews are completed and corrections closed | current sprint | Specialist gate record and final lead PASS |
| Human review happens before next implementation authority | current sprint | Human-review packet and PR proof |

## 6. Candidate Future Sprints

These rows are not implementation authority unless a later human review
explicitly approves them.

| Candidate sprint | Intended scope | Authorisation status |
|---|---|---|
| `GOAL-IQS-OVERLAY-DESCRIPTOR-1` | Define descriptor schema for one common core and local overlays without generating country editions. | not authorised |
| `GOAL-IQS-SOURCE-REFRESH-1` | Refresh sources and resolve source gaps for a selected subset of jurisdictions. | not authorised |
| `GOAL-IQS-LOCAL-EXPERT-GATE-1` | Require local subject/inspection/legal review before any local overlay implementation. | not authorised |
| `GOAL-IQS-BOOK1-PORTABILITY-2` | Deepen the Book 1 portability check after local overlay descriptors exist. | not authorised |

## 7. Explicitly Blocked Work

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
```

## 8. Current Recommended Next Step

Recommended next operational step:

```text
Review the GOAL-IQS-FOUNDATION-1 foundation packet after PR publication and
fresh CI are complete.
```

Human acceptance of `GOAL-IQS-FOUNDATION-1` may authorise only a later internal
architecture follow-up. It must not unlock country implementation, school or
public distribution, product routes, student/product use, personal-data
processing, compliance, approval, OP0, PTA, summative, or inspection-readiness
claims.
