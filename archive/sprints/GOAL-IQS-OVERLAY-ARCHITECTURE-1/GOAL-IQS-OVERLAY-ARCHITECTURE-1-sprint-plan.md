# GOAL-IQS-OVERLAY-ARCHITECTURE-1 Sprint Plan

Status: execution packet for human-review PR
Date: 2026-06-22
Repository: `4veco-platform`

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- International roadmap:
  `docs/roadmaps/quality-standards/international-quality-standards-roadmap.md`
- Foundation decision:
  `reports/inspection-standards/international-foundation-decision.md`
- Triggering human decision:
  PR #131 accepted `GOAL-IQS-FOUNDATION-1A`; PR #131 merged with
  post-merge validation green.

## Non-Negotiable Requirements

- Use REV-STD-1 for review packets, lead reviews, product-proof gates, and any
  later Scale Gate preparation.
- Cite product end-state and the original sprint/gate spec.
- Include a core-requirement checklist.
- Classify findings with `blocks`, `does_not_block`, and
  `proof_required_to_close`.
- PASS WITH FLAGS may not carry a missing core requirement.
- Produce an explicit jurisdiction overlay descriptor schema.
- Produce exactly four internal pilot descriptors:
  England, Flanders, Bavaria/Germany, and California/United States.
- Produce a Book 1 Chapters 1.2/1.3 crosswalk and architecture decision.
- Use explicit per-scope source and output allowlists.
- Do not use directory globbing, implicit source discovery, or generated
  lesson-output scanning.
- Do not create country editions, evidence packs, teacher/school-facing output,
  public output, package/CI product integration, dashboard gates, quality-ref or
  Scale Gate integration, product-route adoption, diagnostics/mastery/PV,
  student/product use, personal-data processing, compliance, approval, OP0, PTA,
  summative, accreditation, or inspection-readiness claims.

## Core-Requirement Checklist

| Requirement | Status | proof_required_to_close |
|---|---|---|
| Descriptor schema names required fields and blocks implicit discovery | required | Checker PASS and lead architecture review |
| England descriptor covers the national inspectorate plus qualification-content archetype | required | Country/source review and legal/claims review |
| Flanders descriptor covers the subnational quality-framework archetype | required | Country/source review and Dutch quality-inspection review |
| Bavaria/Germany descriptor covers KMK plus Land governance | required | Country/source review and legal/claims review |
| California/United States descriptor covers state standards plus federal accountability context | required | Country/source review and legal/claims review |
| Book 1 Chapters 1.2/1.3 crosswalk is route-local only | required | Teacher/economics review and checker PASS |
| Accessibility/inclusion terminology stays local and non-compliance | required | Accessibility/inclusion review |
| Final decision selects exactly one allowed option | required | Checker PASS and final lead review |
| All downstream authority remains blocked | required | Refusal tests, report boundary flags, final lead review |

## Implementation Outputs

```text
references/schemas/international-jurisdiction-overlay.schema.json

references/data/inspection-standards/overlays/england.v0.json
references/data/inspection-standards/overlays/flanders.v0.json
references/data/inspection-standards/overlays/bavaria.v0.json
references/data/inspection-standards/overlays/california.v0.json

docs/inspection-standards/international-overlay-descriptor-contract.md
docs/inspection-standards/international-overlay-governance-rules.md

reports/inspection-standards/international-overlay-archetype-pilot.md
reports/inspection-standards/international-overlay-archetype-pilot.json
reports/inspection-standards/book1-1.2-1.3-overlay-crosswalk.md
reports/inspection-standards/book1-1.2-1.3-overlay-crosswalk.json
reports/inspection-standards/international-overlay-architecture-decision.md
reports/inspection-standards/international-overlay-architecture-decision.json
```

## Review Workflow

- Country/source reviewers check descriptor boundaries and official-source
  allowlists.
- Teacher/economics reviewer checks Book 1 crosswalk quality and concept
  placement.
- Legal/privacy reviewer checks audience, claims, accountability, accreditation,
  personal-data, and downstream authority boundaries.
- Dutch quality-inspection reviewer checks product/school boundary and
  inspection-language safety for Flanders and shared governance wording.
- Accessibility/inclusion reviewer checks local terminology and prevents
  compliance claims.
- Lead architecture reviewer checks schema, generator/checker, output allowlist,
  and architecture coherence.
- Final lead reviewer checks the complete implementation, validation proof,
  specialist corrections, PR freshness, mergeability, and CI.

## Decision Options

```text
PROCEED_TO_SELECTED_JURISDICTION_DEEPENING
REVISE_OVERLAY_SCHEMA
RESEARCH_GAPS_BEFORE_PILOT_EXPANSION
```

## Still Blocked

```text
country edition generation
evidence-pack generation
teacher/school-facing output
public/external output
package or CI product integration
dashboard gates
quality-ref or Scale Gate integration
product-route adoption
diagnostics/mastery/PV
student/product use
personal-data processing
compliance, approval, OP0, PTA, summative, accreditation, or inspection-readiness claims
```
