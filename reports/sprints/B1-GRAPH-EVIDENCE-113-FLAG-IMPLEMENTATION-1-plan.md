# B1-GRAPH-EVIDENCE-113-FLAG-IMPLEMENTATION-1 Plan

Date: 2026-06-16

## Product End-State And Source Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Companion core spec: `../4veco-lessen/specifications/companion-core-specifications.md`
- Original gate packet: `reports/review-gates/B1-GRAPH-EVIDENCE-113-CLOSURE-RETRY-1/review-packet.json`
- Original human-review packet: `reports/reference-planning/B1-GRAPH-EVIDENCE-113-CLOSURE-RETRY-1-review-packet.md`
- Source implementation target: `source-data/book-1/exit-ticket/1.1.3-exit-ticket.json`

## Scope

Implement the recorded human-review decision for the `1.1.3` graph/table
target-equivalent exit ticket:

- `gateApproved: true`
- `metadataAlignment.targetReadinessEvidence: true`
- `targetEquivalent.completionLanguageEligible: false`

Regenerate the paired Book 1 lesson output so generated `shared/exit-ticket`
data matches source.

## Non-Negotiable Requirements

- Mutate only the governed `1.1.3` target-equivalent exit-ticket authority
  flags and directly necessary validator/test expectations.
- Keep `1.1.3-korte-check` advisory and non-target-readiness.
- Keep `completionLanguageEligible:false`.
- Do not authorize Year 1 closure, CP-6 closure, Scale Gate 1, product-route
  adoption, diagnostics, mastery, PV, or student/product use.
- Regenerate lesson output through the platform generator only.
- Keep generated lesson output paired through a same-named lesson branch.

## Core-Requirement Checklist

| Requirement | Planned proof |
|---|---|
| Human decision implemented exactly | Source diff and generated lesson data diff |
| Completion language held | Source flag, engine progress test, policy regression check |
| Advisory short check remains advisory | `check-graph-check-ux1.js` |
| Graph/table operation chain unchanged | `check-graph-exit-ux1.js` and focused Jest tests |
| Generated output refreshed | `build-exit-ticket-shells.js` and lesson diff |
| Downstream authority held | REV-STD-1 review packet and result notes |

## Stop Conditions

- Any generated output changes beyond the expected `1.1.3-exit-ticket` data
  must be inspected and justified before commit.
- Any validator requiring `completionLanguageEligible:true` for `1.1.3` stops
  the sprint; that authority is not granted.
- Any scope-language checker warning about product, diagnostic, mastery, PV,
  Scale Gate, or student/product authority stops the sprint.

## Planned Validation

- Focused Jest tests for exit-ticket engine/UI and Golden Workbench rendering.
- `node build-scripts/sprints/check-checksurface-113-exemplar-exit1.js`
- `node build-scripts/sprints/check-graph-exit-ux1.js`
- `node build-scripts/sprints/check-graph-check-ux1.js`
- `node build-scripts/sprints/check-checksurface-policy-regression1.js`
- Repository report/reference validators after evidence regeneration.
- `npm.cmd run check:platform`
