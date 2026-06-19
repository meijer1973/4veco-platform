# EXAM-ANCHOR-ATOMIC-CLOSURE-BUNDLE-1 Atomic Status

Status: atomic official-exam anchor disposition

## Boundary

This status packet decomposes Q3, Q15, and Q19 into narrow atomic candidates. It
does not close broad operation rows and does not write operation-candidate,
answer-skill-candidate, external, machine, authored, target, or lesson storage.

## Product End-State And Original Specs

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`

Original sprint/gate/source specs:

- `reports/reference-planning/EXAM-ANCHOR-Q3-Q15-Q19-REPAIR-1-review-packet.md`
- `references/data/exam-ingestion/operation-answer-skill-contract.json`
- `reports/mtu-hardening/mtu-h5-q19-source-graph-reasoning-package-1.md`

## Atomic Candidates

| Atomic candidate | Evidence | Disposition | Broad row consequence |
|---|---|---|---|
| `Q3-ATOM-ANNUAL-PREMIUM-DEDUCTIBLE-COST-COMPARISON` | Q3 prompt, table `table-1-zoohee-zorgverzekering`, correction step `q3-step-1` | candidate ready for human review | Does not close `OP-R1` |
| `Q3-ATOM-BREAK_EVEN-THRESHOLD-CALCULATION` | `q3-calc-1`, threshold `EUR 649`, A61 table support, A15 rejected | candidate ready for human review | Does not close `OP-ANS2` or full insurance row |
| `Q3-ANS-THRESHOLD-CONCLUSION-UNIT-DIRECTION` | `q3-answer-1`, correction step `q3-step-2`, point rule `q3-pr-2` | answer-skill candidate ready for human review | Does not close command/point-allocation row |
| `Q15-ATOM-DOMINANT-STRATEGY-REASONING` | `q15-step-1`, D27/F03 content support | candidate ready for human review | Does not close `OP-S1` |
| `Q15-ATOM-MUTUALLY-WORSE-PRISONERS-DILEMMA-CONCLUSION` | `q15-step-2`, F09 content support | candidate ready for human review | Does not close `OP-S1` |
| `Q15-ANS-TWO-LINK-CORRECTION-MODEL-EXPLANATION` | `q15-answer-1`, D27/F03/F09 content support, A97 answer-form support | answer-skill candidate ready for human review | Does not close `OP-ANS3` |
| `Q19-HOLD-SOURCE-GRAPH-RECONSTRUCTION` | source-annex extraction storage, Q19 hold package, six review hooks | hold | Blocks `OP-G3`, `OP-LT1`, `OP-MP1`, `OP-ANS3` |

## Metadata Dispositions

Q3:

- The atomic status rejects `A15` for the annual threshold calculation.
- `A61` remains source-table support only.
- No mutation to `references/external/exam-questions.json` is performed.

Q15:

- Recommended required-skill review outcome: `D27`, `F03`, and `F09` as content
  support, with `q15-answer-1` still separate.
- No mutation to `references/external/exam-questions.json` is performed.

Q19:

- Source-annex extraction storage exists only as blocked candidate evidence.
- Every Q19 graph/source record remains `partial_with_blocking_gap` and
  `blocked`.
- Execution authority remains false.

## Core-Requirement Checklist

| Requirement | Status | Evidence | Consequence |
|---|---|---|---|
| Product end-state cited | met | this packet | REV-STD-1 citation requirement met |
| Original specs cited | met | this packet | Scope tied to PR #109 and existing contracts |
| Atomic Q3 candidates named | met | table above | Q3 can move to human atomic review |
| Atomic Q15 candidates named | met | table above | Q15 can move to human atomic review |
| Q19 decisively held | met | table above | Q19 source/graph blockers remain visible |
| Broad rows kept blocked | met | table above | No overclaiming |
| Protected mutation avoided | met | boundary | Storage writes remain blocked |
| Downstream authority false | met | review packet | Product and Scale gates remain blocked |

## Carried Issues

`Q3-ATOMIC-A15`: stale Q3 `A15` reliance.

- blocks: Q3 operation closure and any broad-row insurance closure.
- does_not_block: atomic Q3 human review with `A15` rejected.
- proof_required_to_close: governed mapper/reference repair that removes or
  replaces stale A15 reliance after atomic route approval.

`Q15-ATOMIC-METADATA`: Q15 required-skill metadata gap.

- blocks: Q15 metadata closure and broad-row game-theory closure.
- does_not_block: atomic answer-skill review with D27/F03/F09 support.
- proof_required_to_close: governed metadata repair or reviewed decision to keep
  metadata external record unchanged.

`Q19-ATOMIC-HOLD`: Q19 source/graph reconstruction.

- blocks: Q19 closure, MTU-H5 closure, graph/PV adoption, lesson handoff, and
  affected broad operation rows.
- does_not_block: using Q19 as exact blocker evidence.
- proof_required_to_close: reconstructable source figure, worksheet, axes,
  units, curve geometry, source locators, and checker/gate authority.
