# B1-GRAPH-EVIDENCE-113-CLOSURE-RETRY-1 Review Packet

Date: 2026-06-16

Verdict: HUMAN_REVIEW_RECORDED / FLAG IMPLEMENTATION REQUIRED.

This packet starts the renewed human review for `1.1.3` graph/table
target-equivalent evidence. The prior closure attempt held because source
metadata still used stale `A38/A61/A63` and the target-equivalent authority
flags remained false. The alignment repair bundle has now merged, so the stale
metadata blocker is repaired. Human review has now decided the held flags.

This packet records the human decision. It does not mutate source data or
generated lesson output. A follow-up implementation lane must update the source
flags and regenerate output before the repository state reflects the decision.

## Product End-State And Original Spec

Product end-state: the first-three student path requires distinct advisory
`Korte check` and target-equivalent `Exit ticket` surfaces. A
target-equivalent exit ticket must require real student work, be rendered and
inspectable, avoid answer-giving scaffolds, and keep product, diagnostics,
mastery, PV, Scale Gate, and student/product-use authority held until separate
human gates authorize it.

Original sprint/gate spec:

- `reports/reference-planning/B1-MIGRATED-V5-TARGET-QUALITY-1-review-packet.md`
  marks `1.1.3` reviewed-final for target-registry quality with
  `A38/A45/A46`.
- `reports/sprints/CHECK-SHORT-EXIT-2-plan.md` defines separate advisory
  short-check and target-equivalent exit-ticket roles.
- `reports/sprints/CHECKSURFACE-GATE-RETRY-EXCELLENT-1-plan.md` and
  `reports/review-gates/GATE-CHECK-SURFACE-EXCELLENT-1-first-three-check-surfaces-review/gate-closure.json`
  close check-surface evidence only and block downstream authority.
- `reports/reference-planning/B1-GRAPH-EVIDENCE-113-CLOSURE-1-review-packet.md`
  holds closure because metadata was stale and authority flags were false.
- `reports/reference-planning/B1-GRAPH-EVIDENCE-113-ALIGNMENT-REPAIR-1-review-packet.md`
  records the metadata repair and states that closure retry is still required.

## Non-Negotiable Requirements

1. The reviewed-final target mapping is `A38/A45/A46`.
2. Student-facing evidence must cover P vertical, Q horizontal,
   table-to-graph construction, graph reading/interpolation, and source-claim
   checking.
3. Platform source metadata and generated lesson output must agree.
4. Advisory `Korte check` and target-equivalent `Exit ticket` roles must remain
   separate.
5. Human review must explicitly record the decision for `gateApproved`,
   `targetReadinessEvidence`, and `completionLanguageEligible`.
6. Source authority flags must remain unchanged in this decision packet.
7. No Year 1, CP-6, Scale Gate, product-route, diagnostics, mastery, PV, or
   student/product-use authority may be inferred.

## Human Review Decision

Human review decision for `B1-GRAPH-EVIDENCE-113-CLOSURE-RETRY-1`:

| Flag | Decision | Reason |
|---|---|---|
| `gateApproved` | approve `true` | The refreshed `1.1.3` exit ticket covers the reviewed-final `A38/A45/A46` graph/table target chain: P vertical, Q horizontal, table-to-graph construction, graph reading/interpolation, and source-claim checking. |
| `targetReadinessEvidence` | approve `true` | The exit ticket requires real student work at target level and is supported by current rendered proof. |
| `completionLanguageEligible` | keep `false` | Completion language and downstream product authority remain separate gates. |

The advisory `Korte check` remains advisory and non-target-readiness evidence.
This decision authorizes a follow-up source-data/generated-output
implementation lane only.

## Core-Requirement Checklist

| Core requirement | Status | Evidence | Notes |
|---|---|---|---|
| Target-registry mapping is reviewed-final | met | `references/authored/course-target-exercises.json` | `1.1.3` maps to `A38/A45/A46`. |
| Exit-ticket source metadata aligned | met | `source-data/book-1/exit-ticket/1.1.3-exit-ticket.json` | `targetSkillIds`, `skillScopeIds`, `paragraphSkillIds`, and `targetExerciseSkillIds` use `A38/A45/A46`. |
| Korte-check source metadata aligned | met | `source-data/book-1/exit-ticket/1.1.3-korte-check.json` | Advisory surface also uses `A38/A45/A46` while remaining non-readiness evidence. |
| Generated lesson output merged | met | Lesson PR #17, merge commit `efc4fc2` | Generated `1.1.3` JS output matches repaired platform metadata. |
| P vertical and Q horizontal | met | `graph_construction_substitute`; `reports/json/graph-exit-ux1-proof.json` | The accepted path uses Q on x-axis and P on y-axis. |
| Table-to-graph construction | met | `pq-grafiek-construeren` task; screenshots | Two distinct table points produce a decreasing line in the same workspace. |
| Graph reading/interpolation | met | `interpolatie-225` task | Student must choose the EUR 2.00 to EUR 2.50 interval and read Q around 225. |
| Source-claim checking | met | `claim-50-procent-controleren` task | Student must choose interval, enter old/new Q, build the formula, enter percentage, and choose a conclusion. |
| Rendered proof refreshed | met | `reports/json/graph-exit-ux1-proof.json`; `reports/json/graph-check-ux1-proof.json`; screenshots | Current proof records desktop, mobile, dark mode, retry, and completed-held states. |
| Human decision on authority flags | met | This packet; PR #77 human review verdict | `gateApproved:true` and `targetReadinessEvidence:true` are approved for implementation; `completionLanguageEligible:false` remains held. |
| Source flags implemented | proof_required_to_close | `source-data/book-1/exit-ticket/1.1.3-exit-ticket.json` | Source data still has held flags until `B1-GRAPH-EVIDENCE-113-FLAG-IMPLEMENTATION-1`. |
| Downstream authority separated | met | packet boundary | This packet does not authorize Year 1, CP-6, Scale Gate, product-route, diagnostics, mastery, PV, or student/product use. |

## Findings

| ID | Classification | Finding | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|---|
| B1GE113CR-001 | core_requirement_met | The stale metadata blocker is repaired: `1.1.3` source data now uses `A38/A45/A46`. | Nothing for metadata alignment | Human review of closure | N/A |
| B1GE113CR-002 | core_requirement_met | Refreshed proof shows the graph/table operation chain: P vertical, Q horizontal, table-to-graph construction, graph reading/interpolation, and source-claim checking. | Nothing for evidence assembly | Human review of authority flags | Human reviewer may inspect current proof JSON and screenshots. |
| B1GE113CR-003 | core_requirement_met | Lesson generated output has merged after the platform repair and matches the repaired metadata. | Nothing for generated-output availability | Human review of closure | N/A |
| B1GE113CR-004 | human_decision_recorded | Human review approves `gateApproved:true` and `targetReadinessEvidence:true`, while keeping `completionLanguageEligible:false`. | Source-data state matching the decision; generated lesson output matching the decision | Merging this decision packet | `B1-GRAPH-EVIDENCE-113-FLAG-IMPLEMENTATION-1` mutates source data, regenerates lesson output, and refreshes proof. |
| B1GE113CR-005 | scale_blocker | Check-surface and graph/table evidence do not authorize downstream product authority. | Scale Gate 1; product-route adoption; diagnostics; mastery; PV; student/product use | Human review of `1.1.3` graph/table target-equivalent proof | Separate downstream product-proof gates after target-equivalent proof closes, if it closes. |
| B1GE113CR-006 | advisory_boundary | The `Korte check` remains advisory and non-target-readiness evidence. | Any claim that advisory check performance proves target readiness | Keeping the short check available for route advice | Only the exit ticket can be considered for target-equivalent proof. |

## Evidence Reviewed

- `references/authored/course-target-exercises.json`
- `source-data/book-1/exit-ticket/1.1.3-korte-check.json`
- `source-data/book-1/exit-ticket/1.1.3-exit-ticket.json`
- `reports/json/checksurface-113-exemplar-exit1-proof.json`
- `reports/json/graph-check-ux1-proof.json`
- `reports/json/graph-exit-ux1-proof.json`
- `reports/sprints/CHECKSURFACE-113-EXEMPLAR-REVIEW-1-screenshots/manifest.json`
- `reports/sprints/GRAPH-CHECK-UX-1-screenshots/desktop-initial.png`
- `reports/sprints/GRAPH-CHECK-UX-1-screenshots/desktop-wrong-retry.png`
- `reports/sprints/GRAPH-EXIT-UX-1-screenshots/desktop-wrong-retry.png`
- `reports/sprints/GRAPH-EXIT-UX-1-screenshots/mobile-dark-completed-held.png`
- Platform PR #76, merge commit `2d8a16a4`.
- Lesson PR #17, merge commit `efc4fc2`.

## Checks Run

- `node build-scripts/sprints/check-checksurface-113-exemplar-exit1.js`
- `node build-scripts/sprints/check-graph-exit-ux1.js`
- `node build-scripts/sprints/check-graph-check-ux1.js`
- `node build-scripts/review-gates/check-gate-check-surface-excellent1-review-packet.js`
- `node build-scripts/sprints/check-checksurface-policy-regression1.js`
- `node build-scripts/sprints/check-check-surface-pregate1.js`
- `node scripts/check-course-target-exercises-v5.js`
- `npm.cmd run check:review-throughput -- reports/review-gates/B1-GRAPH-EVIDENCE-113-CLOSURE-RETRY-1/review-packet.json`
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
- platform exact conflict-marker scan:
  `rg -n "^(<<<<<<< .+|=======|>>>>>>> .+)$" .` returned no matches
- lesson exact conflict-marker scan:
  `rg -n "^(<<<<<<< .+|=======|>>>>>>> .+)$" .` returned no matches
- `npm.cmd run check:platform`

`check:platform` passed all active Jest suites; stdout still includes known
fixture-quality diagnostics from existing test data.

## Decision

Human review records this decision:

- `gateApproved`: approve `true`.
- `targetReadinessEvidence`: approve `true`.
- `completionLanguageEligible`: keep `false`.

This packet does not mutate source data or generated lesson output. The next
implementation sprint is `B1-GRAPH-EVIDENCE-113-FLAG-IMPLEMENTATION-1`.

No downstream authority may be inferred from this closure retry.
