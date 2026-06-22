# GOAL-IQS-SELECTED-DEEPENING-1 Sprint Plan

Status: implementation and review in progress
Date: 2026-06-22
Repository: `4veco-platform`

## Product End-State And Original Sprint/Gate Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Product vision: `../4veco-lessen/specifications/product-vision.md`
- Quality standards end-state: `docs/roadmaps/quality-standards/quality-standards-end-state.md`
- Controlling roadmap: `docs/roadmaps/quality-standards/international-quality-standards-roadmap.md`
- Accepted prior sprint decision: `reports/inspection-standards/international-overlay-architecture-decision.md`
- Original sprint/gate spec: human acceptance of `GOAL-IQS-OVERLAY-ARCHITECTURE-1` / PR #134, authorising selected-jurisdiction deepening only.

## Goal

Deliver an internal-only England and Flanders deep overlay readiness packet that closes the shallow-schema carry item before expanded machine consumption, deepens official-source descriptors, maps Book 1 Chapters 1.2 and 1.3 against exact local curriculum/assessment layers where possible, and recommends one governed next decision.

The allowed decision vocabulary is:

```text
PROCEED_TO_INTERNAL_OVERLAY_PROTOTYPE_PLANNING
LIMIT_DEEPENING_TO_ONE_JURISDICTION
RESEARCH_GAPS_BEFORE_PROTOTYPE_PLANNING
```

## Non-Negotiable Requirements

- Use REV-STD-1 in review packets, lead reviews, product-proof gates, and closure records.
- Cite the product end-state and original sprint/gate spec.
- Name non-negotiable requirements.
- Include a core-requirement checklist.
- Classify findings.
- Include `blocks`, `does_not_block`, and `proof_required_to_close` for carried issues.
- Do not carry a missing core requirement as PASS WITH FLAGS.
- Use official-source anchors and access dates.
- Bound England to a selected awarding-body path rather than all England awarding bodies.
- Bound Flanders to an exact upper-secondary pathway/goal family rather than all Belgium.
- Use explicit source and output allowlists only.
- Do not glob directories, scan generated lesson output, or infer implicit sources.
- Keep the work internal-only and outside localized textbook output, teacher/school-facing output, public output, evidence packs, package/CI product integration, dashboards, quality-ref, Scale Gate, product routes, diagnostics/mastery/PV, student/product use, personal data, compliance, approval, accreditation, OP0, PTA, summative, and inspection-readiness claims.

## Core-Requirement Checklist

| Requirement | Status | Proof required to close |
|---|---|---|
| Nested schema v1 has strict nested objects, required nested fields, enums, official URI constraints, date/date-text controls, unique source IDs, forbidden authority const false flags, and exact finding fields | implemented locally, validation pending | `references/schemas/international-jurisdiction-overlay.schema.v1.json`, fixtures, checker PASS |
| England deep descriptor covers Ofsted, DfE A-level economics, AQA 7136 as selected awarding body, AOs, command words, specimen/mark scheme boundary, and SEND terminology | implemented locally, review pending | `england.deepening.v1.json`, England authority/source review PASS |
| Flanders deep descriptor covers exact upper-secondary pathway, goal family, quality framework, assessment boundary, school/network limitation, and Dutch terminology differences | implemented locally, review pending | `flanders.deepening.v1.json`, Flanders authority/source review PASS |
| Book 1 1.2/1.3 deep crosswalks classify local topic/AO/goal fit, command words/task form/diagram conventions, mark-scheme expectations, terminology, context, and gaps | implemented locally, review pending | England/Flanders crosswalk Markdown/JSON, teacher/economics review PASS |
| Internal transformation contract separates unchanged content, substitutions, examples, institutions, currency/units, graphs, assessment-task replacements, citations, extension-only content, and excluded content | implemented locally, validation pending | `selected-jurisdiction-transformation-contract.md`, refusal checks PASS |
| Comparative readiness decision selects exactly one allowed decision and gives a reuse-estimate methodology | implemented locally, review pending | readiness comparison and decision reports |
| Forbidden authority remains blocked | implemented locally, validation pending | 30 refusal checks and false authority flags |
| Specialist reviews are complete and corrections are resolved | pending | specialist-gate results and correction log |
| Final PR is fresh, mergeable, and green | pending | PR proof, CI proof, final lead PASS |

## Review Workflow

Required intermediate reviews:

- Schema/architecture lead reviewer.
- England authority/source reviewer.
- Flanders authority/source reviewer.
- Teacher/economics reviewer.
- Legal/privacy/claims reviewer.
- Accessibility/inclusion reviewer.
- Final lead reviewer after corrections, validation, PR publication, freshness, mergeability, and CI proof.

## Blocked Work

```text
localized textbook output
country-compliant edition
teacher/school-facing output or distribution
public/external output or sharing
evidence-pack generation or deployment
package script or CI product invocation
dashboard gate
quality-ref integration
Scale Gate integration
product-route adoption
diagnostics/mastery/PV
student/product use
personal-data processing
compliance claim
approval claim
accreditation claim
OP0/basic-skills claim
PTA or summative validity claim
inspection-readiness claim
school-owned implementation evidence flow
```
