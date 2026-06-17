# Sprint TEXTBOOK-FIGURE-STANDARD-1: Diff Summary

Generated: 2026-06-17

## Product End-State And Spec

- Product end-state: future textbook work must inspect rendered
  student-facing output for readability/layout proof while preserving markdown
  and structured target records as content source of truth.
- Original sprint spec:
  `reports/sprints/TEXTBOOK-FIGURE-STANDARD-1-plan.md`.
- Upstream policy spec:
  `references/authored/textbook-rendered-page-acceptance-standard.md`.
- Review standard: REV-STD-1.

## Implementation Diff

- Added `references/authored/textbook-figure-standard.md`.
- Updated `references/authored/textbook-rendered-page-acceptance-standard.md`
  to cite the new figure standard and remove `TEXTBOOK-FIGURE-STANDARD-1` from
  the remaining follow-up list.
- Updated `docs/roadmaps/textbook/textbook-end-state.md` to add figure
  acceptance expectations.
- Updated `docs/roadmaps/textbook/textbook-production-roadmap.md` and
  `docs/roadmaps/textbook/sprint-ledger.md` to record the policy sprint and
  require the standard for future figure-heavy textbook work.
- Updated `docs/roadmaps/roadmap-version-index.md` and
  `docs/roadmaps/roadmap-version-index.json` to version the active textbook
  roadmap as `v1.4-textbook-figure-standard`.
- Updated `references/authored/README.md` to inventory the new standard.
- Updated `agents/lead-reviewer-agent.md` so textbook lead reviews inspect the
  figure standard when figures, graphs, SVG/PNG pairs, or placement are in
  scope.
- Added sprint plan, baseline, command logs, lead-review records, result, diff
  summary, and result JSON.

## Core Requirement Checklist

| Requirement | Evidence | Status |
|---|---|---|
| Figure standard exists | `references/authored/textbook-figure-standard.md` | met |
| Rendered-page proof remains final authority | figure standard Purpose and Proof Requirements | met |
| Source preflight is bounded | figure standard Source Asset Requirements and Proof Requirements | met |
| Graph/label/density/color/concordance rules exist | figure standard Economic Graph Conventions, Readability And Density, Figure To Text Integration | met |
| Blocking figure defects are named | figure standard Blocking Defects | met |
| PASS WITH FLAGS cannot carry missing core figure proof | figure standard Blocking Defects and plan Quality Standard | met |
| Workflow references cite the standard | roadmap, ledger, end-state, README, rendered-page standard, lead-review agent | met |
| No lesson content/generated output changed | command log and `../4veco-lessen` diff/status evidence | met |

## Boundary Diff

No files changed under `../4veco-lessen`, `references/machine/`,
`references/external/`, `source-data/`, generated lesson output, product routes,
diagnostics, mastery/sequencing, PV, Scale Gate 1, or student/product-use
surfaces.

## Carried Issues

No core requirement is carried. Rendered-proof automation and quality-ref schema
work remain separate follow-ups. They block automation/schema adoption, not the
figure-standard policy sprint.

