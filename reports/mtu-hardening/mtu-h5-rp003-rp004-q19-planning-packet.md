# MTU-H5 RP-003/RP-004 Q19 Governed Planning Packet

Generated: 2026-06-09

Status: `q19_planning_packet_ready_for_three_agent_review_no_mutation_authorized`

## Scope

This packet prepares the q19 planning lane for `MTU-H5-RP-003` and
`MTU-H5-RP-004`. It keeps four things visible together:

- the graph/draw/teken answer-form gap;
- the source-annex gap;
- the graph-object gap;
- the procedure semantic-fit review for A42, D10, D13, and A81.

It does not close q19. It makes the blocked state reviewable and
machine-checkable without writing candidate storage, extracting source objects,
repairing the mapper, or touching protected references.

## Official Evidence

- Question PDF:
  `references/external/exams/vw-1022-a-25-1-o.pdf#page=8&question=19`
- Source figure PDF:
  `references/external/exams/vw-1022-a-25-1-o.pdf#page=9&source=figuur-1`
- Correction model:
  `references/external/exams/vw-1022-a-25-1-c.pdf#page=13-14&question=19`
- Question PDF SHA-256:
  `1b0f56fa3794e92584979e8407c4b8f61c59285047efe8ad1b25d7294bdd83fc`
- Correction PDF SHA-256:
  `d10773314c943fb2082dd81368f25ac41936855a3125435b52f0406c6f5fd617`

The official question uses the instruction word `teken`. The correction model
requires three market-shift elements with paired wage or inflation conclusions.
Two correct elements earn partial credit; one or zero earns no credit.

## Current Governance

- EX2 keeps `q19-source-annex-gap` and `q19-graph-object-gap` blocking.
- EX2 routes `q19-graph-op-1` to `A42` and `D10`, with `A45` weak support only.
- EX2 keeps `q19-reason-1` provisional with `D10` and `D13` partial support.
- EX5 accepts q19 extraction fields only as preconditions; extraction execution
  remains unauthorized.
- EX7 validators reject q19 records that hide blocking gaps or treat `A45` as
  primary support.

## Semantic Fit

`A42` supports graphical before/after shifts. `D10` supports market-shift
reasoning after a shock. `D13` partially supports cost, price, and inflation
reasoning. `A81` supports source use.

None of these is approved graph/draw/teken answer-form coverage. None makes the
source figure or worksheet reconstructable. `A45` is weak prerequisite support
only and must not become the primary q19 graph-shift unit.

## Operation Shape

The q19 correction model has three elements:

- `q19-step-1`: Curacao labor market demand shift right plus wage level rises.
- `q19-step-2`: Curacao goods/services market demand shift right plus Curacao
  inflation rises.
- `q19-step-3`: Aruban goods/services market demand shift right plus Aruba
  inflation rises.

The current live H5 validator should still emit the three q19
`ASSERT-ANSWER-FORM-MISSING` failures and the q19 procedure/source/graph
`review_required` hooks.

## Dry-Run Candidate Specs

The machine packet embeds:

- `EX_OP_Q19_MARKET_SHIFT_GRAPH_ROUTE`;
- `EX_OP_Q19_CHAINED_MARKET_INFLATION_REASONING`;
- `EX_ANS_GRAPH_DRAW_MARKET_SHIFT_DIRECTION`;
- a dry-run `source-annex-extraction-overlays` document for the q19 source
  figure, worksheet, and three market diagrams.

All embedded candidates are blocked by `q19-source-annex-gap` and
`q19-graph-object-gap`. The checker validates them through the EX7 dry-run
validation library and proves no persistent candidate or source-extraction
storage exists.

## Negative Guard

The accepted negative guard is the current live H5 q19 answer-form and review
surface:

- `q19-step-1:ASSERT-ANSWER-FORM-MISSING`
- `q19-step-2:ASSERT-ANSWER-FORM-MISSING`
- `q19-step-3:ASSERT-ANSWER-FORM-MISSING`
- `q19-source-annex-gap remains blocking`
- `q19-graph-object-gap remains blocking`
- `graph/draw/teken answer-form MTU or reviewed equivalent still needed`

Any future q19 repair must fail or review-block if it treats `A45` as primary
q19 support, hides the source/graph gaps, or claims graph/draw/teken
answer-form coverage without a reviewed equivalent.

## Proof To Close Later

- Source figure and worksheet are reconstructable or explicitly accepted with
  visible limitations.
- Graph objects expose axes, labels, curves, geometry, legend mapping, and
  student-action regions.
- A graph/draw/teken answer-form MTU or reviewed equivalent exists.
- A42, D10, D13, and A81 procedure fit is accepted or routed to a later MTU
  proposal.
- `A45` remains weak support only.
- q19 validator failures/review hooks clear only after the above evidence is
  visible.

## Boundary

No protected reference mutation, external-source mutation, machine-reference
mutation, authored target-exercise mutation, MTU minting/update/split/merge or
deprecation, operation registry mutation, answer-skill mutation, candidate
storage, candidate writes, source-annex extraction execution, graph-object
extraction execution, lesson output, PV, diagnostics, adaptive routing,
mastery, sequencing, AI, summative use, product-route readiness claim, or
student/product use is authorized.

Next state: `ready_for_three_agent_review`
