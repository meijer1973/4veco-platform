# B1-GRAPH-EVIDENCE-113-ALIGNMENT-REPAIR-1 Review Packet

Date: 2026-06-15

Verdict: PASS FOR ALIGNMENT REPAIR / CLOSURE RETRY REQUIRED.

This packet reviews the repair lane after PR #71 recorded that
`B1-GRAPH-EVIDENCE-113-CLOSURE-1` did not close. The repair aligns the `1.1.3`
source metadata to the reviewed-final target registry (`A38`, `A45`, `A46`) and
refreshes rendered graph/check-surface proof. It does not close
target-equivalent proof and does not authorize completion language.

## Product End-State And Original Spec

Product end-state: the first-three student path requires distinct advisory
`Korte check` and target-equivalent `Exit ticket` surfaces. The exit ticket must
require real student work, be rendered and inspectable, and keep product,
diagnostic, mastery, PV, and student-use authority held until reviewed.

Original sprint/gate spec:

- `reports/reference-planning/B1-MIGRATED-V5-TARGET-QUALITY-1-review-packet.md`
  names `A38`, `A45`, and `A46` as the reviewed-final `1.1.3` target mapping.
- `reports/sprints/CHECK-SHORT-EXIT-2-plan.md` defines the separate short-check
  and exit-ticket roles.
- `reports/sprints/CHECKSURFACE-GATE-RETRY-EXCELLENT-1-plan.md` and
  `reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/gate-closure.json`
  close check-surface evidence only, with downstream authority blocked.
- `reports/reference-planning/B1-GRAPH-EVIDENCE-113-CLOSURE-1-review-packet.md`
  classifies the stale `A38/A61/A63` metadata and held authority flags as the
  blockers for graph/table target-equivalent closure.

## Non-Negotiable Requirements

1. `1.1.3` source metadata must use `A38/A45/A46` consistently.
2. The graph/table task chain must still cover P vertical, Q horizontal,
   table-to-graph construction, graph reading/interpolation, and source-claim
   checking.
3. Advisory `Korte check` and target-equivalent `Exit ticket` roles must remain
   separate.
4. `gateApproved`, `targetReadinessEvidence`, and
   `completionLanguageEligible` must remain false until renewed human review.
5. Refreshed proof must cite rendered output and screenshots.
6. No Year 1, CP-6, Scale Gate, product-route, diagnostics, mastery, PV, or
   student/product-use authority may be inferred.

## Core-Requirement Checklist

| Core requirement | Status | Evidence | Notes |
|---|---|---|---|
| Reviewed-final target mapping cited | met | `references/authored/course-target-exercises.json` | Registry mapping is `A38/A45/A46`. |
| Exit-ticket source metadata aligned | met | `source-data/book-1/exit-ticket/1.1.3-exit-ticket.json` | `targetSkillIds`, `skillScopeIds`, `paragraphSkillIds`, and `targetExerciseSkillIds` all use `A38/A45/A46`. |
| Korte-check source metadata aligned | met | `source-data/book-1/exit-ticket/1.1.3-korte-check.json` | Advisory surface now cites the reviewed-final mapping while remaining non-readiness evidence. |
| Authority flags preserved | met | `1.1.3-exit-ticket.json`; `1.1.3-korte-check.json` | `gateApproved:false`, `targetReadinessEvidence:false`, and `completionLanguageEligible:false` remain held. |
| Rendered proof refreshed | met | `reports/json/graph-check-ux1-proof.json`; `reports/json/graph-exit-ux1-proof.json`; `reports/json/checksurface-113-exemplar-exit1-proof.json` | Proof was regenerated from current lesson output. |
| Graph/table operation chain preserved | met | refreshed graph/check proof | P vertical, Q horizontal, table-to-graph, graph reading/interpolation, and source-claim checking still pass. |
| Gate checker compatible with current landing output | met | `build-scripts/review-gates/check-gate-check-surface-excellent1-review-packet.js` | Checker now accepts both legacy `data-check-route` and current landing-v2 `data-tile-id` card selectors without changing the gate meaning. |
| Target-equivalent closure authorized | proof_required_to_close | next human review | This repair prepares `B1-GRAPH-EVIDENCE-113-CLOSURE-RETRY-1`; it does not close proof. |

## Findings

| ID | Classification | Finding | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|---|
| B1GE113AR-001 | core_requirement_met | `1.1.3` source metadata now aligns to the reviewed-final `A38/A45/A46` target mapping. | Nothing for metadata alignment | Renewed closure review | N/A |
| B1GE113AR-002 | core_requirement_met | Rendered graph/check proof was refreshed from generated `1.1.3` output and validators pass. | Nothing for repair proof | Human review of closure | N/A |
| B1GE113AR-003 | core_requirement_met | The repair preserves held authority flags and advisory/exit-ticket separation. | Nothing for scope safety | Publishing this repair packet | N/A |
| B1GE113AR-004 | proof_required_to_close | Human review has not yet authorized `gateApproved`, `targetReadinessEvidence`, or completion-language eligibility. | Graph/table target-equivalent closure; Year 1 closure; CP-6 closure | Metadata repair merge; proof review preparation | Run `B1-GRAPH-EVIDENCE-113-CLOSURE-RETRY-1` and decide the held flags explicitly. |
| B1GE113AR-005 | scale_blocker | Downstream product authority remains blocked. | Scale Gate 1; product-route adoption; diagnostics; mastery; PV; student/product use | This repair lane and companion generated-output publication | Separate downstream product-proof gates after target-equivalent proof closes. |
| B1GE113AR-006 | checker_compatibility | The check-surface gate packet checker accepted only the older `data-check-route` landing selector. Current landing-v2 output uses `data-tile-id`, so the checker now accepts both while still requiring advisory and exit cards. | Nothing after checker update | Current-main validation of repaired `1.1.3` output | Keep selector compatibility narrow to card presence only. |

## Evidence Reviewed

- `references/authored/course-target-exercises.json`
- `source-data/book-1/exit-ticket/1.1.3-korte-check.json`
- `source-data/book-1/exit-ticket/1.1.3-exit-ticket.json`
- `reports/json/checksurface-113-exemplar-exit1-proof.json`
- `reports/json/graph-check-ux1-proof.json`
- `reports/json/graph-exit-ux1-proof.json`
- `reports/sprints/CHECKSURFACE-113-EXEMPLAR-REVIEW-1-screenshots/manifest.json`
- `reports/sprints/GRAPH-CHECK-UX-1-screenshot-manifest.md`
- `reports/sprints/GRAPH-EXIT-UX-1-screenshot-manifest.md`
- Companion generated lesson output branch:
  `codex/b1-graph-evidence-113-alignment-output-1-20260615` in
  `meijer1973/4veco-lessen`.
- Companion lesson-output PR:
  `https://github.com/meijer1973/4veco-lessen/pull/17`.

## Checks Run

- `node build-scripts/sprints/check-checksurface-113-exemplar-exit1.js`
- `node build-scripts/sprints/capture-graph-check-ux1-screenshots.js`
- `node build-scripts/sprints/capture-graph-exit-ux1-screenshots.js`
- `node build-scripts/sprints/capture-checksurface-113-exemplar-review1-screenshots.js`
- `node build-scripts/sprints/check-graph-exit-ux1.js`
- `node build-scripts/sprints/check-graph-check-ux1.js`
- `node build-scripts/review-gates/check-gate-check-surface-excellent1-review-packet.js`
- `node build-scripts/sprints/check-checksurface-policy-regression1.js`
- `node build-scripts/sprints/check-check-surface-pregate1.js`
- `node scripts/check-course-target-exercises-v5.js`
- `npm.cmd run check:review-throughput -- reports/review-gates/B1-GRAPH-EVIDENCE-113-ALIGNMENT-REPAIR-1/review-packet.json`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/rag/validate-chunks.js`
- `node build-scripts/references/check-source-document-registry.js`
- `node build-scripts/references/check-source-manifest.js`
- `node build-scripts/references/check-document-inventory.js`
- `node build-scripts/references/check-mtu-evidence-layer.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/ci/check-evidence-line-endings.js`
- `npm.cmd run check:scope-language`
- `git diff --check`
- `git -C ..\4veco-lessen diff --check`
- platform and lesson conflict-marker scans
- `npm.cmd run check:platform`

## Decision

The metadata/proof mismatch from PR #71 is repaired. Do not close graph/table
target-equivalent proof in this PR. The correct next action is
`B1-GRAPH-EVIDENCE-113-CLOSURE-RETRY-1`, where human review decides whether the
held flags can change.
