# GOAL-IQS-OVERLAY-ARCHITECTURE-1 Lead Architecture Review

Status: PASS WITH FLAGS
Date: 2026-06-22
Reviewer: lead architecture subagent

## Product End-State And Original Spec

- Product end-state:
  `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec:
  `archive/sprints/GOAL-IQS-OVERLAY-ARCHITECTURE-1/GOAL-IQS-OVERLAY-ARCHITECTURE-1-sprint-plan.md`

## Non-Negotiable Requirements

- Use REV-STD-1.
- Cite product end-state and the original sprint/gate spec.
- Name non-negotiable requirements.
- Include a core-requirement checklist.
- Classify findings.
- Include `blocks`, `does_not_block`, and `proof_required_to_close` for
  carried issues.
- PASS WITH FLAGS may not carry a missing core requirement.
- Produce exactly four descriptors: England, Flanders, Bavaria/Germany, and
  California/United States.
- Preserve exact source and output allowlists.
- Preserve deterministic currentness and refusal checks.
- Preserve blocked authority for country editions, evidence packs,
  teacher/school-facing output, public output, package/CI product integration,
  dashboard gates, quality-ref or Scale Gate integration, product-route
  adoption, diagnostics/mastery/PV, student/product use, personal-data
  processing, compliance, approval, OP0, PTA, summative, accreditation, and
  inspection-readiness claims.

## Core-Requirement Checklist

| Requirement | Status | proof_required_to_close |
|---|---|---|
| Descriptor schema names required fields | passed | Lead architecture reviewer confirmed |
| Four descriptors: England, Flanders, Bavaria/Germany, California/US | passed | Lead architecture reviewer confirmed |
| Official-source allowlists per descriptor | passed | Lead architecture reviewer confirmed |
| Curriculum vs assessment gaps separated | passed | Lead architecture reviewer confirmed |
| Book 1 1.2/1.3 crosswalk route-local only | passed | Lead architecture reviewer confirmed |
| School-owned boundaries preserved | passed | Lead architecture reviewer confirmed |
| Accessibility/inclusion terminology non-compliance only | passed | Lead architecture reviewer confirmed |
| Refusal and stop cases enforced | passed | Lead architecture reviewer confirmed |
| Exactly one decision selected | passed | Lead architecture reviewer confirmed |
| Roadmap/index/sprint records updated | passed with freshness flag | Rebase current `main`, rerun validation, confirm CI and mergeability |

## Findings

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| Schema/generator/checker/report contract is coherent. `OUTPUT_PATHS`, blocked authority flags, refusal parsing, currentness checks, required descriptor ids/fields, report checks, and classification negative test are present. | `core_requirement_met` | Nothing for architecture review. | Human review of the internal packet. | Keep `node build-scripts/inspection/check-international-overlay-architecture.js` green. |
| Schema is top-level shallow; nested authority constraints are mostly enforced by checker logic rather than JSON Schema alone. | `minor_carry_flag` | Reliance on schema alone for direct machine consumption or expanded automation. | Current manual internal architecture packet. | Harden nested schema before any use beyond manual internal review. |
| Branch was behind `origin/main` by 4 commits at the time of review. | `freshness_required` | Final PR/human-review readiness. | Local architecture content review. | Rebase or merge current `main`, rerun validation, confirm green CI and mergeability. |
| Downstream authority remains blocked in descriptor, report, and roadmap outputs. | `scale_blocker` | Country editions, evidence packs, teacher/school-facing output, public output, package/CI product integration, dashboard gates, quality-ref or Scale Gate integration, product-route adoption, diagnostics/mastery/PV, student/product use, personal-data processing, compliance, approval, OP0, PTA, summative, accreditation, and inspection-readiness claims. | Internal architecture decision and possible later selected-jurisdiction deepening planning after human approval. | Separate human-authorized local implementation gate with source, teacher/economics, legal/privacy, accessibility/inclusion, and quality-inspection review. |

## Reviewer Validation

```text
node build-scripts/inspection/check-international-overlay-architecture.js
PASS

node build-scripts/inspection/build-international-overlay-architecture.js --check
PASS

npx.cmd jest build-scripts/inspection/check-international-overlay-architecture.test.js --runInBand
PASS

node build-scripts/references/check-roadmap-version-index.js
PASS

npm.cmd run check:scope-language
PASS

node build-scripts/reports/validate-report-json.js
PASS

node build-scripts/sprints/emit-url-index.js --check
PASS

git diff --check
PASS
```

The reviewer observed an initial PowerShell `npx.ps1` execution-policy failure;
the equivalent `npx.cmd` run passed.
