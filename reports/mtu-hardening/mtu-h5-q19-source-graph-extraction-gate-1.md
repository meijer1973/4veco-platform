# MTU-H5 Q19 Source/Graph Extraction Gate 1

Created: 2026-06-15

Status: `q19_source_graph_extraction_gate_ready_for_human_review_no_execution_authorized`

## Scope

This is the non-mutating q19 source/graph extraction gate approved after
`GATE-MTU-H5-Q19-repair-gate-1`. It prepares the evidence and review questions
for a later exact execution gate. It does not execute extraction.

The product end-state is unchanged: MTU-H5 cannot close, enter product routes,
or support diagnostics, PV, mastery, sequencing, lesson output, or
student/product use until q19, q27, and q15 blockers are resolved by reviewed
evidence.

## Non-Negotiables

- No source-annex extraction execution.
- No graph-object extraction execution.
- No q19 fixture mutation, mapper repair, candidate storage, candidate writes,
  protected-reference mutation, machine-reference mutation, external-source
  mutation, authored target-exercise mutation, MTU mutation, operation-registry
  mutation, answer-skill mutation, lesson output, PV, diagnostics, adaptive
  routing, mastery, sequencing, product-route readiness claim, or
  student/product use.
- q19 remains `3 failed / 20 review_required` until reviewed source/graph and
  answer-form evidence exists.
- A45 remains forbidden as primary q19 support.
- The future extraction surface must expose the source figure, uitwerkbijlage,
  three graph objects, and required q19 extraction-contract fields or keep the
  blocking gaps visible.

## Current Diagnostic State

- q3: clean after q3 fixture execution
- q19: 3 failed, 20 review_required
- q27: 3 failed, 5 review_required
- q15: 0 failed, 4 review_required

q19 still has three `ASSERT-ANSWER-FORM-MISSING` failures for the instruction
word `teken`. It also still carries `q19-source-annex-gap`,
`q19-graph-object-gap`, graph/draw/teken answer-form review, chained
multi-market reasoning review, third graph-shift review, and A42/D10/D13/A81
procedure semantic-fit review.

## Extraction Surface To Review

The later extraction execution gate, if approved separately, must cover exactly
these q19 source/graph materials:

- `EX_SRC_Q19_SOURCE_FIGURE`
- `EX_SRC_Q19_UITWERKBIJLAGE`
- `EX_SRC_Q19_CURACAO_LABOR_MARKET_GRAPH`
- `EX_SRC_Q19_CURACAO_GOODS_MARKET_GRAPH`
- `EX_SRC_Q19_ARUBA_GOODS_MARKET_GRAPH`

For graph objects, the review must require source locator, graph type, axis
labels, axis units, scale or tick marks, curve labels, reconstructable geometry
or reviewed limitations, legend mapping, student-action regions, extraction
status, review state, and blocking-gap ids.

For source-annex objects, the review must require source locator, prompt
reference, worksheet regions, required student marks, extraction status, review
state, and blocking-gap ids.

## Answer-Form Hooks

q19 requires graph/draw/teken answer-form evidence for three drawn
market-shift elements:

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
target exercises, candidate stores, and lesson output are not mutated.

## Carried Issues

`q19-answer-form-gap`, `q19-source-annex-gap`, and `q19-graph-object-gap` block
q19 repair, MTU-H5 closure, and product-route readiness. They do not block
review of this non-mutating source/graph extraction gate.

q27 and q15 remain carried MTU-H5 blockers and must close in separate lanes.

## Decision Needed

Human review should approve, revise, or reject this non-mutating q19
source/graph extraction gate as the correct precondition before any future
extraction execution or q19 fixture/mapper repair.

Approval of this packet would authorize only using it as evidence for a later
exact q19 source/graph extraction execution gate proposal. It would not
authorize execution.

Next state: `ready_for_human_source_graph_extraction_gate_review`
