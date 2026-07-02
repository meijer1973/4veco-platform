# THREE-YEAR-BLUEPRINT-MATURITY-BUNDLE-1 Evidence-Wave Overlay

Status: Year 3 official evidence-wave overlay for planning maturity

## Product End-State And Original Specs

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`

Original sprint/gate/source specs:

- `references/owned/course-blueprint-v6-three-year.md`
- `reports/reference-planning/Y3-MACRO-SPINE-MAPPING-1-evidence-routing.md`
- `references/external/exam-questions.json`
- `reports/reference-planning/EXAM-OPERATION-SPINE-ANCHOR-1-anchor-matrix.md`

## Boundary

This overlay records enough official evidence state to test the Year 3
architecture. It does not mutate external sources, create extracted source
annex objects, close official operation rows, create target exercises, mint
MTUs, or authorize lessons/product use.

## Selected Families

| Family | Official locators | Point state | Prompt/source state | Correction-model state | Operation decomposition | Answer-form decomposition | Candidate mapping | Target/MTU state | Blocker and proof required |
|---|---|---|---|---|---|---|---|---|---|
| Book 9 fiscal/output-gap | `vw-1022-a-24-2-o:q6-q15`; correction `vw-1022-a-24-2-c`; exam PDF pages 4-8 | 20 points across q6-q15 | prompts and source locators recorded in `exam-questions.json`; `Schuiven met schuld` and `Beleidsdilemma` cover budget balance, stabilizers, debt, output gap, IS-MB-GA adjustment | correction model locator recorded; point-by-point decomposition still needs governed extraction | `OP-K1`, `OP-H1`, `OP-G3`, `OP-ANS2`, `OP-ANS3` | calculation with conclusion; source-supported fiscal explanation; curve/adjustment explanation | `Y3-B9-P07` to `Y3-B9-P13`; `Y3-B10-P03`, `Y3-B10-P05`, `Y3-B10-P13` as boundary support | target anchors missing; MTU/task-family route unreviewed | blocks Book 9 production and broad OP closure; proof: prompt/source/correction/point extraction, target comparison, MTU/task-family review |
| Book 10 q23/q24 monetary effectiveness | `vw-1022-a-25-1-o:q23-q24`; correction `vw-1022-a-25-1-c`; exam PDF page 11 | 4 points | q23 asks whether monetary policy became more/less effective after changed IS slope; q24 asks policy direction and new real equilibrium rate | correction locator recorded; full point allocation must be extracted before closure | `OP-MP1`, `OP-K1`, `OP-ANS3` | slope/effectiveness explanation; policy-rate direction explanation | `Y3-B10-P04`, `Y3-B10-P06`; q22 remains Book 8 green-GDP support | no target anchor; no mirrored skill ids in q23 overlay | blocks q23/q24 production; does not block Book 10 architecture; proof: source figure/correction steps, target anchor, MTU/task-family review |
| IS-MB-GA drawing/adjustment | `vw-1022-a-23-2-o:q21-q24` and `vw-1022-a-23-1-o:q20-q24`; corrections `vw-1022-a-23-2-c`, `vw-1022-a-23-1-c` | 18 points across the selected questions | prompts cover multiplier, output gap, GA adjustment, IS/MB/GA drawing, Keynesian/monetarist adjustment | correction locators recorded; graph-object and point-allocation extraction required | `OP-K1`, `OP-MP1`, `OP-G2`, `OP-G3`, `OP-ANS1`, `OP-ANS3` | calculation; curve drawing; compare-and-explain; model-adjustment chain | `Y3-B9-P03` to `Y3-B9-P06`; `Y3-B10-P03`, `Y3-B10-P13`, `Y3-B10-P14` | target anchors missing; graph/task-family proof missing | blocks graph/model production; proof: worksheet/figure reconstruction, correction steps, answer-form and graph-task review |
| Monetary/open-economy and trilemma | `vw-1022-a-24-2-o:q27-q28`; `vw-1022-a-25-2-o:q12-q16`; correction PDFs `vw-1022-a-24-2-c`, `vw-1022-a-25-2-c` | 13 points across selected questions | prompts cover capital controls, same-rate fixed-exchange problems, remittance channel, current account, fixed-rate defense | correction locators recorded; detailed decomposition still needed | `OP-MP1`, `OP-LT1`, `OP-F1`, `OP-H1`, `OP-ANS2`, `OP-ANS3` | trilemma explanation; exchange-rate policy mechanism; calculation and source-supported current-account answer | `Y3-B10-P07` to `Y3-B10-P12`; `Y3-B11-M07` | targets missing; open-economy task family unreviewed | blocks Book 10 open-economy production; proof: source/correction extraction, target comparison, MTU/task-family review |
| Book 11 full-paper protocol evidence | full papers `vw-1022-a-25-1-o`, `vw-1022-a-25-2-o`, `vw-1022-a-24-2-o` plus corrections | complete official papers available | full papers provide mixed-source, mixed-operation, timed practice evidence | correction models available but not decomposed into a Book 11 scoring protocol yet | `OP-ANS1`, `OP-ANS2`, `OP-ANS3` plus domain rows | command-word plan; point-allocation map; error log; repair answer; retest answer | `Y3-B11-M01` to `Y3-B11-M13` | not target paragraphs; no Book 11 repair MTU/task family minted | blocks Book 11 product use; proof: paper selection rubric, correction-model decomposition, error-log schema, repair/retest protocol review |

## Q19 Boundary

Q19 remains exact HOLD. It blocks only:

- the Q19-specific source/graph reconstruction route;
- the Q19 multi-market graph/PV chain;
- Q19-dependent MTU-H5 closure;
- lesson handoff that relies on Q19 evidence.

Q19 does not block:

- Book 10 architecture;
- q23/q24 monetary-policy evidence;
- other IS-MB-GA evidence families;
- other open-economy evidence ingestion.

## Decision

The Year 3 evidence state is complete at planning level: every selected family
has known prompt/source/correction, operation, answer-form, target, MTU, and
blocker status. No selected family is production-ready.
