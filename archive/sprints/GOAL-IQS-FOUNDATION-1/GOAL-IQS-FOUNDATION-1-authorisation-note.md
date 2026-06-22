# GOAL-IQS-FOUNDATION-1 Authorisation Note

Status: original sprint/gate specification
Date: 2026-06-21
Sprint: `GOAL-IQS-FOUNDATION-1`

## Product End-State And Original Spec

- Product end-state baseline:
  `../4veco-lessen/specifications/product-end-state.md`
- Product vision baseline:
  `../4veco-lessen/specifications/product-vision.md`
- Original human instruction: after accepting and merging
  GOAL-DQS-CLOSURE-1A under `CLOSE_INTERNAL_SYSTEM`, begin
  `GOAL-IQS-FOUNDATION-1 International Quality Standards Common Core and
  Overlay Foundation`.
- Governing roadmap created for this sprint:
  `docs/roadmaps/quality-standards/international-quality-standards-roadmap.md`

The product end-state baseline remains the canonical sibling lesson repository
path. This note is therefore the stable review pointer for the sprint's
product-end-state and original-spec proof without relying on agent-local
machine paths.

## Non-Negotiable Requirements

- Use REV-STD-1 for review packets, lead reviews, product-proof gates, and any
  later Scale Gate preparation.
- Cite product end-state and this original sprint/gate specification.
- Name non-negotiable requirements.
- Include a core-requirement checklist.
- Classify findings using only REV-STD-1 classification values:
  `core_requirement_met`, `quality_improvement_available`,
  `minor_carry_flag`, `scale_blocker`, and `core_spec_failure`.
- Include `blocks`, `does_not_block`, and `proof_required_to_close`.
- PASS WITH FLAGS may not carry a missing core requirement.
- Use official-source authority profiles for the requested jurisdictions.
- Represent subnational and federal governance precisely.
- Keep every forbidden authority flag false and visible.

## Core-Requirement Checklist

| Requirement | Status | proof_required_to_close |
|---|---|---|
| PR #124 accepted and merged before GOAL-IQS starts | met | PR #124 merge record and `origin/main` refresh |
| Dutch closure remains `CLOSE_INTERNAL_SYSTEM` only | met | DQS closure packet and ledger update |
| International work uses a separate roadmap | met | `international-quality-standards-roadmap.md` |
| Official-source foundation covers nine jurisdictions | required | IQS checker and authority/source reviewer |
| Common core is separated from local overlays | required | Generated common-core and overlay architecture |
| Book 1 portability check stays internal | required | Generated portability report and teacher/economics review |
| Compliance, approval, inspection-readiness, OP0, PTA, summative, public, school-facing, product-route, Scale Gate, student-use, and personal-data authority remain blocked | required | False authority flags, refusal tests, and legal/privacy review |
| Final foundation decision chooses exactly one allowed option | required | IQS checker and final lead review |
| Human review happens before follow-up authority | required | PR and human-review packet |

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| GOAL-IQS is authorised only after the Dutch internal/report-only system was accepted and merged. | `core_requirement_met` | Starting before PR #124 merge. | Internal international foundation work after merge. | PR #124 merged and branch refreshed onto current main. |
| The product end-state file is external to this platform-only worktree. | `minor_carry_flag` | Treating a missing sibling path as unreviewed product authority. | Citing the canonical main-checkout path as an immutable baseline. | Keep this authorisation note in the review packet. |
| International authority remains internal-only. | `scale_blocker` | Country editions, public/school-facing output, product routes, Scale Gate, student/product-use, personal data, compliance, approval, OP0, PTA, summative, and inspection-readiness claims. | Internal common-core and overlay foundation analysis. | False authority flags and refusal tests remain green. |

## Forbidden Authority

```text
country-compliant edition
inspectorate approval claim
legal compliance claim
inspection-readiness claim
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
school-owned implementation evidence flow
```
