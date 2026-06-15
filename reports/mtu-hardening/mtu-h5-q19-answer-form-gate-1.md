# MTU-H5 Q19 Answer-Form Gate 1

Status: `q19_answer_form_gate_ready_for_human_review_no_mutation_authorized`

This packet prepares a non-mutating q19 `teken` answer-form decision gate after
PR #69 wrote the q19 source/graph extraction overlay as partial blocked
evidence.

## Product End-State

MTU-H5 remains blocked from closure, product-route readiness, diagnostics, PV,
mastery, sequencing, lesson output, and student/product use until q19, q27, and
q15 blockers are resolved by reviewed evidence. This packet does not claim q19
closure or MTU-H5 closure.

## Current State

- q3 remains clean: `0 failed / 0 review_required`.
- q19 remains blocked: `3 failed / 20 review_required`.
- q27 remains carried: `3 failed / 5 review_required`.
- q15 remains carried: `0 failed / 4 review_required`.
- `references/data/exam-ingestion/source-annex-extraction-overlays.json`
  exists, but its five q19 records are still `partial_with_blocking_gap` and
  `blocked`.

## Decision Needed

Human review must decide whether q19 answer-form closure should proceed by:

- `approve_reviewed_equivalent_candidate_path`: prepare a later exact
  reviewed-equivalent answer-form execution gate using
  `EX_ANS_GRAPH_DRAW_MARKET_SHIFT_DIRECTION`;
- `require_new_mtu_governance_lane`: require protected MTU governance because
  reviewed-equivalent evidence is insufficient;
- `revise_before_any_downstream_write`;
- `reject_answer_form_lane`.

No option authorizes mutation in this PR.

## Answer-Form Evidence

The q19 question word is `teken`. The official correction model requires three
drawn market-shift elements plus price or wage direction:

| Operation | Required answer-model element | Current support | Missing answer-form candidate |
| --- | --- | --- | --- |
| `q19-step-1` | Curacao labor-market rightward demand shift plus wage-level rise | `A42`, `D10`, `A81` | `EX_ANS_GRAPH_DRAW_MARKET_SHIFT_DIRECTION` |
| `q19-step-2` | Curacao goods/services market rightward demand shift plus Curacao inflation rise; aggregate-supply shift alternative accepted | `A42`, `D10`, `D13`, `A81` | `EX_ANS_GRAPH_DRAW_MARKET_SHIFT_DIRECTION` |
| `q19-step-3` | Aruba goods/services market rightward demand shift plus Aruba inflation rise; aggregate-supply shift alternative accepted | `A42`, `D10`, `D13`, `A81` | `EX_ANS_GRAPH_DRAW_MARKET_SHIFT_DIRECTION` |

`A42`, `D10`, `D13`, and `A81` are support for graph-shift concepts, linked
market reasoning, source reading, and procedure work. They are not treated as
graph/draw/teken answer-form closure.

The official about-1-cm line-shift instruction is carried as a graph-drawing
spacing constraint for the `teken` answer form. It is not treated as a numeric
scale-factor MTU need, and it remains blocked by the q19 source-annex and
graph-object gaps until the worksheet limitations are reviewed.

## Non-Negotiables

- No q19 fixture mutation, mapper repair, candidate storage creation, candidate
  writes, protected-reference mutation, MTU mutation, lesson output, PV,
  diagnostics, product route, or student/product use is authorized.
- The source overlay remains partial blocked evidence, not closure evidence.
- q19 must remain `3 failed / 20 review_required` in this PR.
- A45 remains forbidden as primary q19 support.
- `full_graph_construction`, `calculus_route`, and `function_construction`
  remain forbidden q19 route tags.
- `PASS WITH FLAGS` may not carry a missing core requirement.

## Negative Guards

- A temporary q19 clone that pretends answer-form closure before human decision
  must be rejected by the answer-form gate checker.
- A temporary q19 clone that reintroduces A45 primary support must still trigger
  q19 over-trigger failures.
- The inherited Solo q1-q3 function-construction negative fixture must remain
  passed-as-expected.

## Review Packet

- Machine packet:
  `reports/mtu-hardening/mtu-h5-q19-answer-form-gate-1.json`
- Human packet:
  `reports/review-gates/GATE-MTU-H5-Q19-answer-form-gate-1/review-packet.md`
- Checker:
  `build-scripts/references/check-mtu-h5-q19-answer-form-gate-1.js`
