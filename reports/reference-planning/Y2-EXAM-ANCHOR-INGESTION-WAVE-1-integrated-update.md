# Y2-EXAM-ANCHOR-INGESTION-WAVE-1 Integrated Update

Status: integrated Year 2 evidence-wave update

## Boundary

This update revises evidence status for the Year 2 map. It does not rewrite the
root map, freeze final paragraph counts, create target-registry records, mint
MTUs, mutate protected references, generate lessons, close official operations,
or authorize product/Scale/student use.

## Product End-State And Original Specs

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`

Original sprint/gate/source specs:

- `references/owned/course-blueprint-v6-three-year.md`
- `reports/reference-planning/Y2-ROOT-MAPPING-1-review-packet.md`
- `reports/reference-planning/Y2-ROOT-MAPPING-1-paragraph-candidate-matrix.md`
- `reports/reference-planning/Y2-ROOT-MAPPING-1-exam-anchor-backlog.md`
- `reports/sprints/Y2-EXAM-ANCHOR-INGESTION-WAVE-1-plan.md`

Structured overlay:

- `references/data/exam-ingestion/y2-exam-anchor-ingestion-wave-1.json`

## Candidate Disposition Improvements

| Candidate | Previous status in root map | Evidence-wave result | Production consequence |
|---|---|---|---|
| `Y2-B5-P09` | evidence needed | pension-model official anchor family reviewed | still no production status without target/MTU proof |
| `Y2-B5-P13` | evidence needed | pension source-case retrieval now has official case evidence | still no production status without target/MTU proof |
| `Y2-B6-P08` | evidence needed | housing/mortgage finance official anchor family reviewed | still no production status without target/MTU proof |
| `Y2-B6-P09` | evidence needed | housing-market constraints and price-signal case reviewed | still no production status without target/MTU proof |
| `Y2-B7-P09` | mapping ready | moral-hazard official anchor family reviewed | still no broad `OP-R1` closure |
| `Y2-B7-P10` | mapping ready | adverse-selection official anchor family reviewed | still no broad `OP-R1` closure |
| `Y2-B7-P11` | mapping ready | principal-agent official anchor family reviewed | still no broad `OP-R1` closure |
| `Y2-B8-P04` | evidence needed | self-binding Q16 follow-up reviewed | still no `OP-S1`/answer-skill closure |
| `Y2-B8-P14` | evidence needed | green-GDP official anchor reviewed through q22 | q23 macro boundary must stay separate |

## Proposed Paragraphs Supported By Actual Exam Evidence

Book 5:

- `Y2-B5-P08` to `Y2-B5-P11` have a coherent pension-model source family.
- `Y2-B5-P13` can use the pension case as source-case retrieval evidence.

Book 6:

- `Y2-B6-P08` and `Y2-B6-P09` have a housing finance and rent-market source
  family.
- `Y2-B6-P11` and `Y2-B6-P12` gain mixed calculation/source-case evidence.

Book 7:

- `Y2-B7-P09`, `Y2-B7-P10`, and `Y2-B7-P11` are supported by a single
  information-problem insurance family.
- `Y2-B7-P02` gains expected-premium calculation support, but not complete
  expected-value coverage.
- Q3 remains complementary evidence for `Y2-B7-P05` and `Y2-B7-P06`.

Book 8:

- `Y2-B8-P02` and `Y2-B8-P03` retain Q15 strategic evidence.
- `Y2-B8-P04` gains Q16 self-binding evidence.
- `Y2-B8-P14` gains q22 green-GDP support.
- `Y2-B8-P13` and `Y2-B8-P15` gain only partial bridge support; q23 belongs to
  later macro/monetary-policy review.

## Architecture Assumptions Confirmed

| Assumption | Result |
|---|---|
| Book 5 should include pensions, time, stock/flow, and intergenerational reasoning. | Confirmed by the pension-model case. |
| Book 6 should include housing and household finance as Year 2 finance application. | Confirmed by the housing-market case. |
| Book 7 should include risk and information problems beyond Q3. | Confirmed by the non-payment/credit-insurance case. |
| Book 8 strategic interaction should include Q15 plus self-binding follow-up. | Confirmed by Q15/Q16. |
| Book 8 growth bridge must be guarded against macro-policy overreach. | Confirmed by the q22/q23 split in the green-growth case. |

## Merge, Move, Split, Or Defer Recommendations

| Candidate | Recommendation | Reason |
|---|---|---|
| `Y2-B5-P06` | absorb into adjacent Book 5/6 bridge unless later evidence justifies a standalone paragraph | PR #121 approved the map but flagged this deferred candidate inside the count model. |
| `Y2-B6-P13` | keep deferred to later macro/monetary-policy scope | q23 reinforces that monetary-policy effectiveness should not become Book 6 or Book 8 production content. |
| `Y2-B8-P13` | split growth bridge from macro-policy execution | q22 supports green GDP; q23 brings IS-MB/monetary-policy effectiveness. |
| `Y2-B8-P14` | keep as green-GDP and sustainability-measurement anchor | q22 directly supports this placement. |
| `Y2-B8-P15` | keep as partial bridge only until a public-finance/debt source case is reviewed | q22 is not enough to close public-finance/debt coverage. |

## Revised Year 2 Anchor Coverage

| Book | Revised coverage |
|---|---|
| Book 5 | At least one reviewed official anchor family: pension/time/stock-flow source reasoning. |
| Book 6 | At least one reviewed official anchor family: housing finance and rent-market source/calc reasoning. |
| Book 7 | At least one reviewed official anchor family beyond Q3: risk/information/credit-insurance case. Q3 remains complementary insurance-threshold evidence. |
| Book 8 | Two reviewed official anchor families: strategic Q15/Q16 and green-GDP q22, with q23 routed to macro boundary review. |

## Remaining High-Priority Backlog

1. Target-exercise anchors for every selected family.
2. MTU/task-family support review without mutation.
3. Q3 parent/child or compound storage decision.
4. Q15/Q16 answer-skill approval.
5. Book 8 q23 monetary-policy boundary routing to Book 9/10.
6. Public-finance/debt official anchor beyond q22.
7. Q19 remains HOLD.

## Decision

The Year 2 architecture is materially better supported after this wave, but no
candidate receives production status. `mapping_ready` still means placement is
coherent; it does not mean official evidence, targets, MTUs, operations, or
answer skills are complete.
