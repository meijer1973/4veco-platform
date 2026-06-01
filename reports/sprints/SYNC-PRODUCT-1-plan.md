# Sprint SYNC-PRODUCT-1: Product Proof Roadmap Alignment

Generated: 2026-06-01

## Goal

Align the platform and lesson roadmaps, and the stable product specifications
where necessary, around the product-quality hardening sequence before Scale
Gate 1. The alignment must make explicit that the first three paragraphs need
coherent student-visible product proof, not isolated engine progress.

## Context

The user provided the next-period sprint package after `L1.7B-Q2-D31-STRUCT`.
Current specs already require visible routes, shared skill-map route layer,
shared task-type shell, operational UI proof, and target-equivalent exit-ticket
semantics. The new package sharpens the next execution path:

- every paragraph must eventually have both a short/advisory check and a
  separate target-equivalent exit ticket;
- short checks may support learning with hidden/clickable hints and route
  advice;
- exit tickets are same-level proof tasks and must not become hint-heavy
  learning exercises;
- non-exit practice games need clickable route affordances;
- the skill map must become a first-class student product surface;
- reasoning task types must be brought into the unified exercise standard;
- dual coding must become an explicit task-quality decision;
- Scale Gate 1 stays blocked until a three-paragraph product proof and human
  product readiness review close.

## Quality Standard

Quality floor: the roadmap/spec update must satisfy the product-end-state
specification within this roadmap-only scope and must not downscope the
supplied package into a vague future intention. It must name the sprint
sequence, preserve product-boundary blocks, cite the stable product specs as
acceptance baselines, and prevent Scale Gate 1 from treating partial
implementation, engine architecture, advisory checks, or the reviewed `1.1.2`
local completion copy as broad product proof. Rendered output and
student-facing product changes are explicitly out of scope for this sprint;
the proof here is roadmap/spec traceability plus validators showing that
future rendered-output and student-facing proof are required before scale.
Missing implementation work must be named as follow-up sprints or blockers.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Roadmaps name short check plus target-equivalent exit-ticket requirement. | Product Proof Track rows in both roadmaps. | Validator/lead review confirms rows exist and preserve distinction. | planned |
| Roadmaps block Scale Gate 1 until first-three-paragraph product proof. | Revised Scale Gate 1 and immediate-next-sprint language. | Lead review checks no bypass route remains. | planned |
| Specs preserve full product intent. | Minimal spec amendments for both-check requirement, hint policy, route affordance, skill-map product surface, dual-coding task policy, and three-paragraph proof. | Lead review checks no contradiction with existing SPEC-ET-1/GATE-L1.7B-Q2 boundaries. | planned |
| No implementation or product authority. | Sprint metadata and roadmap rows mark planning/audit/contract only unless later sprint explicitly implements. | Scope-language and lead review. | planned |

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Add a deterministic evidence checker for the Product Proof Track sequence and Scale Gate 1 blockers. | include_now | Needed so the roadmap/spec sync is enforceable instead of prose-only. |
| Rewrite all future sprint plans from the supplied package in full detail now. | defer_named_follow_up | SYNC-PRODUCT-1 should insert and align the sequence; each sprint still needs its own operational plan before execution. |
| Start task-shell, route-affordance, skill-map, reasoning, or exit-ticket implementation while syncing the roadmap. | reject_scope_creep | This sprint authorizes roadmap/spec alignment only and must not create generated output or product authority. |

## Allowed paths

- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `references/reference-team-roadmap.md`
- `build-scripts/sprints/check-sync-product1-evidence.js`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- sprint logs and metadata for `SYNC-PRODUCT-1`
- generated repository-map, URL-index, and dashboard artifacts

## Forbidden paths

- No generated lesson output.
- No engine implementation.
- No source exit-ticket data writes.
- No protected reference mutation under `references/machine/` or
  `references/external/`.
- No target-exercise registry field writes.
- No candidate storage creation or candidate writes.
- No diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  product-wide use.
- Do not import, stage, move, or edit `knowledge/exit-ticket-game-1.1.1.zip`.

## Inputs

- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `references/reference-team-roadmap.md`
- `reports/sprints/L1.7B-Q2-D31-STRUCT-result.md`

## Outputs

- Updated lesson roadmap with Product Proof Track Before Scale Gate 1.
- Updated platform/reference roadmap mirroring platform-owned parts and
  tracking cross-repo dependencies.
- Minimal stable spec updates where the new package is stronger than the
  current wording.
- Sprint records:
  - `reports/sprints/SYNC-PRODUCT-1-plan.md`
  - `reports/sprints/SYNC-PRODUCT-1-baseline.md`
  - `reports/sprints/SYNC-PRODUCT-1-result.md`
  - `reports/sprints/SYNC-PRODUCT-1-diff-summary.md`
  - lead-review assignment, round-1, corrections, and round-2 logs
  - `references/data/sprints/SYNC-PRODUCT-1.plan.json`
  - `references/data/sprints/SYNC-PRODUCT-1.result.json`
- Deterministic evidence checker:
  - `build-scripts/sprints/check-sync-product1-evidence.js`

## Operationalized sprint procedure

1. Record baseline from the current product specs and roadmaps.
2. Run planning review against this plan before edits beyond the sprint logs.
3. Update the stable specs only where the new package adds sharper product
   standards not yet explicit.
4. Add Product Proof Track rows to both roadmaps.
5. Update Scale Gate 1 / immediate-next-sprint language so it points to the
   new sequence and blocks bypass.
6. Refresh repository maps/indexes and run relevant validators.
7. Run structural lead-review round 1, correction pass, and round 2.
8. Commit and push platform plus lesson-roadmap/spec changes.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/SYNC-PRODUCT-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js SYNC-PRODUCT-1
node build-scripts/sprints/check-sync-product1-evidence.js
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/SYNC-PRODUCT-1-result.md
node build-scripts/sprints/check-sprint-bundle.js SYNC-PRODUCT-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close: both roadmaps contain the Product Proof Track sequence,
Scale Gate 1 remains blocked behind three-paragraph product proof and human
product readiness review, specs explicitly preserve both-check and hint-policy
distinctions, lead-review round 2 returns PASS or PASS WITH FLAGS, and platform
plus lesson commits are pushed.

## Rollback plan

Before commit, revert only the roadmap/spec/sprint-artifact/index files changed
by this sprint. After commit, revert the platform and lesson commits together
so cross-repo roadmap/spec state remains aligned.

## Human review required

No new human review gate is required for this roadmap/spec synchronization.
The user directly authorized the supplied next-period plan. Future product
readiness still requires `GATE-PRODUCT-3P` before Scale Gate 1.
