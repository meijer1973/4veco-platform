# MTU-H5 Q19 Source/Graph Extraction Execution Gate 1

Created: 2026-06-15

Status: `q19_source_graph_extraction_execution_gate_ready_for_human_review_no_execution_authorized`

## Scope

This is the exact, non-executing source/graph extraction execution gate after
`GATE-MTU-H5-Q19-source-graph-extraction-gate-1`.

It asks whether a later dedicated execution PR may create or update:

`references/data/exam-ingestion/source-annex-extraction-overlays.json`

This packet does not execute extraction and does not write that storage file.

The product end-state is unchanged: MTU-H5 cannot close, enter product routes,
or support diagnostics, PV, mastery, sequencing, lesson output, or
student/product use until q19, q27, and q15 blockers are resolved by reviewed
evidence.

## Non-Negotiables

- No source-annex extraction execution is performed or authorized by this
  packet.
- No graph-object extraction execution is performed or authorized by this
  packet.
- No q19 fixture mutation, mapper repair, candidate storage creation,
  candidate writes, protected-reference mutation, machine-reference mutation,
  external-source mutation, authored target-exercise mutation, MTU mutation,
  operation-registry mutation, answer-skill mutation, lesson output, PV,
  diagnostics, adaptive routing, mastery, sequencing, product-route readiness
  claim, or student/product use.
- q19 remains `3 failed / 20 review_required` until extraction evidence is
  actually written and reviewed in a later authorized execution lane.
- q3 remains clean.
- q27 and q15 remain carried MTU-H5 blockers.
- A45 remains forbidden as primary q19 support.
- `full_graph_construction`, `calculus_route`, and `function_construction`
  remain forbidden route tags for q19.
- The official aggregate-supply alternative for q19-step-2 and q19-step-3 must
  remain visible alongside the primary rightward demand-shift route.
- `references/data/exam-ingestion/source-annex-extraction-overlays.json`
  remains absent in this PR.

## Current Diagnostic State

- q3: 0 failed, 0 review_required
- q19: 3 failed, 20 review_required
- q27: 3 failed, 5 review_required
- q15: 0 failed, 4 review_required

q19 still has three `ASSERT-ANSWER-FORM-MISSING` failures for the instruction
word `teken`. It still carries `q19-source-annex-gap`,
`q19-graph-object-gap`, graph/draw/teken answer-form review, chained
multi-market reasoning review, third graph-shift review, and A42/D10/D13/A81
procedure semantic-fit review.

## Future Exact Write Surface

If human review approves this execution gate, a later dedicated execution PR may
propose writing only these records to
`references/data/exam-ingestion/source-annex-extraction-overlays.json`:

- `EX_SRC_Q19_SOURCE_FIGURE`
- `EX_SRC_Q19_UITWERKBIJLAGE`
- `EX_SRC_Q19_CURACAO_LABOR_MARKET_GRAPH`
- `EX_SRC_Q19_CURACAO_GOODS_MARKET_GRAPH`
- `EX_SRC_Q19_ARUBA_GOODS_MARKET_GRAPH`

That later PR must keep the write bounded to q19 source/graph extraction. Any
record that is still partial must keep `q19-source-annex-gap` and
`q19-graph-object-gap` visible rather than silently claiming reconstruction.

## Required Graph Fields

Every future graph object must include:

- source locator
- graph type
- axis labels
- axis units
- scale or tick marks
- curve labels
- reconstructable geometry or reviewed limitations
- legend mapping
- student-action regions
- extraction status
- review state
- blocking-gap ids

The contract-field spellings are `source_material_id`,
`source_page_or_locator`, `graph_type`, `axis_labels`, `axis_units`,
`scale_or_tick_marks`, `curve_or_series_labels`,
`coordinates_or_reconstructable_geometry`, `legend_mapping`,
`student_action_regions`, `extraction_status`, `review_state`, and
`blocking_gap_ids`.

## Required Source-Annex Fields

Every future source-annex object must include:

- source locator
- prompt reference
- worksheet regions
- required student marks
- extraction status
- review state
- blocking-gap ids

The contract-field spellings are `source_material_id`, `annex_type`,
`source_page_or_locator`, `prompt_reference`, `worksheet_regions`,
`required_student_marks`, `extraction_status`, `review_state`, and
`blocking_gap_ids`.

## Answer-Form Hooks

q19 requires graph/draw/teken answer-form evidence for three drawn market-shift
elements:

1. Curacao labor-market demand shift right plus wage direction.
2. Curacao goods/services-market demand shift right plus Curacao inflation
   direction.
3. Aruba goods/services-market demand shift right plus Aruba inflation
   direction.

A42, D10, D13, and A81 may be support/procedure evidence, but they do not close
the graph/draw/teken answer-form need by themselves. A45 remains weak
prerequisite support only and forbidden as primary q19 support.

The official correction model also accepts correct aggregate-supply shifts for
the second and third elements as an alternative to the primary rightward
demand-shift route. That caveat must stay visible in any future extraction or
answer-form gate so q19 is not narrowed to a demand-only reading.

## Negative Guards

The checker enforces three guards:

- A temporary dry-run source extraction document that marks q19 graph/source
  overlays reconstructable while blocking gaps remain must fail validation.
- A temporary A45 reintroduction fixture must still trigger q19
  `ASSERT-OVER-TRIGGER` failures.
- The existing Solo q1-q3 function-construction over-trigger negative fixture
  must remain passed as expected.

The real fixture, protected references, external sources, machine references,
target exercises, candidate stores, future extraction storage, and lesson
output are not mutated.

## Carried Issues

`q19-answer-form-gap`, `q19-source-annex-gap`, and `q19-graph-object-gap` block
q19 repair, MTU-H5 closure, and product-route readiness. They do not block
review of this non-executing source/graph extraction execution gate.

q27 and q15 remain carried MTU-H5 blockers and must close in separate lanes.

## Decision Needed

Human review should approve, revise, or reject whether a later exact q19
source/graph extraction execution PR may write the five named overlay records.

Approval of this packet would authorize only using it as the reviewed authority
basis for that later exact execution PR. It would not authorize execution in
this PR.

Next state: `ready_for_human_source_graph_extraction_execution_gate_review`
