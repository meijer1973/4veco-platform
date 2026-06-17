# MTU-H5 Q19 Source/Graph/Procedure/Reasoning Gate 1

Status:
`q19_source_graph_procedure_reasoning_gate_ready_for_human_review_no_mutation_authorized`

This packet prepares a current, non-mutating review gate for the remaining q19
surface after:

- PR #69 wrote the q19 source/graph overlay as partial blocked evidence.
- PR #81 executed the q19 answer-form reviewed-equivalent fixture update.

It does not mutate the fixture, source overlays, protected references, machine
references, target exercises, MTUs, candidates, lessons, PV, diagnostics,
product routes, or student/product surfaces.

## Product End-State

The canonical product end-state is
`../4veco-lessen/specifications/product-end-state.md`. MTU-H5 may not claim
closure, product-route readiness, diagnostics, PV, mastery, sequencing, lesson
output, or student/product use until q19, q27, and q15 blockers are resolved by
reviewed evidence.

## Current Live State

The live MTU-H5 report now says:

Current q19 live state: `0 failed / 17 review_required`.

| Surface | Failed | Review required | Status |
| --- | ---: | ---: | --- |
| q3 | 0 | 0 | clean |
| q19 | 0 | 17 | source/graph/procedure/reasoning review blocker |
| q27 | 3 | 5 | carried blocker |
| q15 | 0 | 4 | carried blocker |
| overall | 3 | 26 | failed diagnostic surface |

Historical q19 source/graph packets that mention `3 failed / 20 review_required`
are pre-answer-form historical evidence, not current live-count evidence.

## Remaining Q19 Surface

The remaining q19 review surface has 17 assertions:

- 11 procedure semantic-fit assertions for `A42`, `D10`, `D13`, and `A81`;
- 2 source-annex gap hooks;
- 2 graph-object gap hooks;
- 1 chained multi-market reasoning hook;
- 1 third graph-shift dependency hook.

The answer-form lane is no longer the blocker: PR #81 added the reviewed
equivalent `EX_ANS_GRAPH_DRAW_MARKET_SHIFT_DIRECTION` and removed only the
answer-form-needed hooks.

## Official Evidence Summary

Prompt locator:
`references/external/exams/vw-1022-a-25-1-o.pdf#page=8-9&question=19`

Correction model locator:
`references/external/exams/vw-1022-a-25-1-c.pdf#page=13-14&question=19`

The prompt asks for new demand and/or supply lines on three market diagrams and
for the wage/inflation directions. The correction model awards three elements:
Curacao labor market wage rises, Curacao inflation rises, and Aruba inflation
rises. For the second and third elements, correct aggregate-supply shifts are
also accepted.

The "about 1 cm" instruction is a graph-drawing spacing constraint, not a
numeric scale-factor MTU need.

## Current Source Overlay

`references/data/exam-ingestion/source-annex-extraction-overlays.json` exists
from PR #69 and contains five q19 records:

- `EX_SRC_Q19_SOURCE_FIGURE`
- `EX_SRC_Q19_UITWERKBIJLAGE`
- `EX_SRC_Q19_CURACAO_LABOR_MARKET_GRAPH`
- `EX_SRC_Q19_CURACAO_GOODS_MARKET_GRAPH`
- `EX_SRC_Q19_ARUBA_GOODS_MARKET_GRAPH`

All five must remain `partial_with_blocking_gap` and `blocked` unless a later
explicitly authorized source-overlay lane changes that status. This gate does
not change the overlay.

## Evidence Needed

Source-annex decision:
Reviewed source figure and worksheet reconstruction, or explicit reviewed
acceptance of current limitations while downstream tools keep the limitation
visible.

Graph-object decision:
All three graph objects must expose axes, market object, curve roles, geometry
or reviewed limitations, student-action regions, answer-model direction, and
aggregate-supply alternatives where applicable.

Procedure semantic-fit decision:
A reviewed operation/unit matrix must decide exact fit for `A42`, `D10`, `D13`,
and `A81` on each q19 operation.

Chained-market reasoning decision:
Review must decide whether `D10`/`D13`/`A81` are enough as reviewed-equivalent
support for the chain from Curacao labor demand to Curacao and Aruban inflation,
or whether a later operation-registry/MTU governance lane is still needed.

Third graph-shift decision:
Review must decide whether the Aruban graph-shift element is sufficiently
modeled under current partial overlays or remains blocked by source/graph
reconstruction.

## Decision Options

Valid human decisions:

- `approve_exact_procedure_semantic_fit_execution_gate`
- `approve_exact_source_graph_limitation_acceptance_gate`
- `approve_exact_chained_reasoning_reviewed_equivalent_gate`
- `keep_all_remaining_q19_hooks_blocked`
- `revise_this_gate_before_any_execution_planning`

Any approval only authorizes preparation of a later exact execution gate. This
packet itself authorizes no fixture mutation, source-overlay mutation, mapper
repair, candidate write, MTU change, lesson output, product route, or
student/product use.

## Negative Guards

- A temporary clone that removes all q19 remaining hooks and procedure review
  unit IDs without approval must be rejected.
- A temporary source-overlay clone marked reconstructable while blocking gaps
  remain must be rejected.
- A temporary fixture clone that reintroduces `A45` as q19 primary support must
  fail with q19 over-trigger assertions.
- The existing Solo q1-q3 function-construction over-trigger negative fixture
  must remain passed-as-expected.

## Review Packet

- Machine packet:
  `reports/mtu-hardening/mtu-h5-q19-source-graph-procedure-reasoning-gate-1.json`
- Human review packet:
  `reports/review-gates/GATE-MTU-H5-Q19-source-graph-procedure-reasoning-gate-1/review-packet.md`
- Checker:
  `build-scripts/references/check-mtu-h5-q19-source-graph-procedure-reasoning-gate-1.js`

Teacher, economist, and quality inspection agents must each be
`MORE_THAN_SATISFIED` before this packet should be sent for human review.

Second-round pre-human review results:

| Agent | Verdict | Summary |
| --- | --- | --- |
| teacher | `MORE_THAN_SATISFIED` | The q19 educational/evidence decision is clear, REV-STD-1 structure is present, q27/q15 are carried, and closure/product/student-use overclaims remain blocked. |
| economist | `MORE_THAN_SATISFIED` | The Curacao labor, wage/inflation, Curacao/Aruba goods-market, aggregate-supply alternative, 1 cm drawing, A42/D10/D13/A81, and A45 guard treatment is economically sound. |
| quality_inspection | `MORE_THAN_SATISFIED` | Counts, non-mutating authority boundary, historical non-live surfaces, negative guards, bundle URLs, URL index, and platform agent index are review-ready. |
