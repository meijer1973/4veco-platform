# SCALE-PROOF-3P-PREP-1 Plan

Date: 2026-06-16

Status: proof preparation only; not a product gate and not a closure record

## Goal

Prepare a first-three-paragraph product-proof inventory after PR #72 landed.
This sprint decides what evidence is ready, what remains blocked, and what
proof a later `GATE-PRODUCT-3P` packet would need.

This sprint does not close `SCALE-PROOF-3P`, does not start
`GATE-PRODUCT-3P`, and does not authorize Scale Gate 1.

## Product End-State And Original Spec

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`

End-state requirement used here: every paragraph route must be built backward
from a paragraph target exercise. A product-ready first-three route must have
inspectable landing, learn, practice, advisory check, target-equivalent exit
ticket, feedback, and next-action proof without overclaiming diagnostics,
mastery, completion, or student/product-use authority.

Original sprint/gate specs:

- `reports/sprints/CHECK-SHORT-EXIT-2-plan.md`
- `reports/sprints/CHECKSURFACE-GATE-RETRY-EXCELLENT-1-plan.md`
- `reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/gate-closure.md`
- `docs/roadmaps/golden-workbench/golden-workbench-rollout-roadmap.md`
- `references/reference-team-roadmap.md`

Current upstream evidence:

- PR #72 merge commit: `aa41b6275c621e00957bd8b394dacaf949b0ee01`
- Current platform branch base:
  `a4838db18467833f550602eecd32ca9b943fbae9`
- Platform evidence baseline in the post-65 addendum:
  `406f6358f477cfd50361855c45183da8c9f90990`
- Lesson baseline: `efc4fc2b194d7a43d072dcba89f755b02cf55574`
- `B1-GRAPH-EVIDENCE-113-ALIGNMENT-REPAIR-1` has landed on platform and
  lesson main: `1.1.3` metadata now aligns to `A38/A45/A46`, while
  target-equivalent authority remains held.

## Non-Negotiable Requirements

1. Use `REV-STD-1`: cite product end-state and original sprint/gate spec,
   name non-negotiables, include a core-requirement checklist, classify
   findings, and include `blocks`, `does_not_block`, and
   `proof_required_to_close`.
2. Treat the check-surface closure as narrow evidence only.
3. Treat target-registry `reviewed_final` status as source-registry evidence,
   not rendered target-equivalent proof.
4. Keep advisory `Korte check` surfaces advisory.
5. Keep exit-ticket target-equivalent authority held unless a later human
   review explicitly authorizes it.
6. Do not carry a missing core product requirement under `PASS WITH FLAGS`.
7. Do not authorize product-route adoption, diagnostics, mastery/sequencing,
   PV, Scale Gate 1, broad product use, or student/product use.
8. Do not mutate source data, generated lesson output, target registry data,
   machine references, or protected references in this prep sprint.

## Core-Requirement Checklist

| Requirement | Current prep status | Evidence | Consequence |
|---|---|---|---|
| Product end-state cited | met | Product and companion specs | Later review can compare proof against the right target. |
| Original specs cited | met | Check-surface plans, gate closure, roadmaps | Scope cannot silently expand into product adoption. |
| First-three target registry status inventoried | met | `course-target-exercises.json` | `1.1.1`, `1.1.2`, and `1.1.3` are `reviewed_final` for source-registry quality. |
| Check-surface closure inventoried | met | Gate closure and post-65 addendum | Current check-surface evidence is usable as input, not as product closure. |
| Generated route/link existence inventoried | met | Canonical lesson output index files | Link existence is evidence to inspect, not adoption authority. |
| Target-equivalent flags inventoried | met | Six source-data files | Current exit tickets remain held. |
| Known blockers named | met | B1 graph evidence closure and alignment-repair results, source data | `1.1.3` closure retry is required before product gate closure. |
| Downstream authority blocked | met | This packet and proof JSON | Scale/product authority cannot be inferred. |

## Work Products

- `reports/sprints/SCALE-PROOF-3P-PREP-1-plan.md`
- `reports/sprints/SCALE-PROOF-3P-PREP-1-evidence-map.md`
- `reports/sprints/SCALE-PROOF-3P-PREP-1-blocker-log.md`
- `reports/sprints/SCALE-PROOF-3P-PREP-1-result.md`
- `reports/json/scale-proof-3p-prep-1-proof.json`

## Out Of Scope

- Route migration.
- Generated lesson-output edits.
- Source-data repair.
- Target-registry mutation.
- Protected reference mutation.
- New screenshots or rendered proof capture.
- `GATE-PRODUCT-3P` closure.
- Scale Gate 1 readiness or closure.

## Validation Plan

- `node build-scripts/review-gates/check-gate-check-surface-excellent1-review-packet.js`
- `node build-scripts/sprints/check-golden-exercise-workbench.js`
- `node build-scripts/sprints/check-checksurface-policy-regression1.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `npm.cmd run check:scope-language`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `npm.cmd run check:platform`
- `git diff --check`

## Planned Decision Rule

This sprint may pass as preparation if the inventory is complete, authority
boundaries are explicit, and blockers are specific.

It must not claim `GATE-PRODUCT-3P` readiness if any core rendered
target-equivalent requirement is missing.
