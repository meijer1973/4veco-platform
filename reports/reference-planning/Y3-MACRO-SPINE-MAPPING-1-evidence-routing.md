# Y3-MACRO-SPINE-MAPPING-1 Evidence Routing

Status: initial official-evidence routing and ingestion backlog

## Boundary

This packet routes official evidence for Year 3 planning. It does not mutate
`references/external/*`, does not create source extraction records, does not
close operation rows, and does not authorize target, MTU, lesson, product,
Scale, diagnostics, mastery, PV, summative, or student/product use.

## Product End-State And Original Specs

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`

Original sprint/gate/source specs:

- `references/owned/course-blueprint-v6-three-year.md`
- `reports/reference-planning/EXAM-OPERATION-SPINE-ANCHOR-1-anchor-matrix.md`
- `reports/reference-planning/EXAM-ANCHOR-ATOMIC-CLOSURE-BUNDLE-1-atomic-status.md`
- `reports/reference-planning/Y2-EXAM-ANCHOR-INGESTION-WAVE-1-integrated-update.md`
- `references/external/exam-questions.json`
- `reports/sprints/Y3-MACRO-SPINE-MAPPING-1-plan.md`

## Routed Evidence Families

| Route | Official family | Year 3 placement | Evidence role | Status |
|---|---|---|---|---|
| q23 monetary effectiveness | `vw-1022-a-25-1-o:q23` from `Groen ontgroeien` | `Y3-B10-P04` | IS-curve slope and monetary-policy effectiveness | partial official evidence; not closure |
| q24 monetary policy direction | `vw-1022-a-25-1-o:q24` from `Groen ontgroeien` | `Y3-B10-P06` | rate choice to return to old equilibrium | backlog candidate |
| Fiscal/output-gap family | `vw-1022-a-24-2-o:q6-q15`, especially `Schuiven met schuld` and `Beleidsdilemma` | Book 9 and Book 10 boundary | budget balance, automatic stabilizers, output gap, IS-MB-GA adjustment | priority ingestion backlog |
| Keynesian/IS-MB-GA family | `vw-1022-a-23-2-o:q21-q24` `Vertrouwen` | Book 9 P03-P06 and Book 10 P03/P13/P14 | Keynesian cross, output gap, GA curve, model drawing, adjustment views | priority ingestion backlog |
| Fiscal-monetary model family | `vw-1022-a-23-1-o:q20-q24` `Belastingverhoging` | Book 9 P03/P08 and Book 10 P02/P14 | multiplier, fiscal effect, IS slope, monetary response | priority ingestion backlog |
| Monetary/open-economy family | `vw-1022-a-24-2-o:q27-q28` `Trilemma` | Book 10 P09/P12 | fixed exchange rates, capital mobility, independent rate policy | priority ingestion backlog |
| Exchange-rate and fixed-rate family | `vw-1022-a-23-1-o:q25-q29`, `vw-1022-a-25-2-o:q16` | Book 10 P07-P10 | exchange-rate market, fixed-rate defense, capital-flow constraint | priority ingestion backlog |
| Full-paper practice | `vw-1022-a-25-1-o`, `vw-1022-a-25-2-o`, `vw-1022-a-24-2-o` full exam PDFs | Book 11 M09/M11 | timed paper practice and correction-model discipline | paper-selection backlog, not target closure |
| Answer-construction evidence | Q3/Q15 atomic packets, PR #122 q7-q11/q12-q15/q15-q16/q22-q23 traces | Book 11 M01-M04 | prompt decomposition, point allocation, calculate/explain/evaluate answer forms | design input only |

## Backlog Priorities

1. Ingest `vw-1022-a-24-2-o:q6-q15` as the first Book 9 fiscal/output-gap
   evidence packet.
2. Ingest `vw-1022-a-25-1-o:q23-q24` as the first Book 10 q23 follow-up,
   preserving q22 as Book 8 green-GDP support.
3. Ingest one IS-MB-GA model family from `vw-1022-a-23-2-o:q21-q24` or
   `vw-1022-a-23-1-o:q20-q24`.
4. Ingest one monetary/open-economy family from `vw-1022-a-24-2-o:q27-q28` or
   `vw-1022-a-25-2-o:q12-q16`.
5. Define a Book 11 full-paper selection protocol before any timed-paper cycle
   is treated as product evidence.

## Q19 HOLD

Q19 remains on exact HOLD. It blocks the Q19-specific source/graph
reconstruction route, the Q19 multi-market graph/PV chain, MTU-H5 closure that
depends on Q19, and lesson handoff that relies on that evidence. This Year 3
map may cite Q19 only as held evidence and must not use it to close `OP-G3`,
`OP-LT1`, `OP-MP1`, or `OP-ANS3`.

Q19 does not block Book 10 architecture, q23/q24 monetary-policy evidence,
other IS-MB-GA evidence families, or other open-economy evidence ingestion.

## Decision

The initial routing is enough to test the Year 3 spine, but it is not enough to
claim official evidence closure for Book 9, Book 10, Book 11, `OP-K1`,
`OP-MP1`, or any answer-form row.
