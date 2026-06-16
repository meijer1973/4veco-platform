# SCALE-PROOF-3P-PREP-1 Evidence Map

Date: 2026-06-16

Status: current evidence inventory complete; product gate not ready

## Baseline

- Platform branch base after PR #72 and graph metadata repair:
  `a4838db18467833f550602eecd32ca9b943fbae9`
- Post-65 check-surface evidence baseline:
  `406f6358f477cfd50361855c45183da8c9f90990`
- Lesson main: `efc4fc2b194d7a43d072dcba89f755b02cf55574`

## Readiness Summary

| Evidence lane | Current status | Product-proof implication |
|---|---|---|
| First-three target registry | ready as source-registry target quality | `1.1.1`, `1.1.2`, and `1.1.3` are `reviewed_final`, but this does not prove rendered target-equivalent output. |
| `1.1.4` mixed target registry | ready as source-registry target quality | The chapter-1.1 mixed target is now `reviewed_final`, but no product/Scale authority follows. |
| Check-surface gate | closed with carried flags, post-65 evidence current | Usable as narrow check-surface evidence only. |
| Golden visual proof | partial rendered proof | Covers `1.1.2` exit, `1.1.2-korte-check`, and `1.1.3` exit visual/token repair. |
| `1.1.3` graph-exit proof | strong held candidate | Current proof covers graph construction, reading, source-claim control, repaired token IDs, mobile, and dark mode. |
| `1.1.3` graph/table metadata alignment | repaired | Platform source data and generated lesson output now use `A38/A45/A46`; target-equivalent flags remain held for closure retry. |
| `1.1.3` graph/table closure | held | Alignment repair passed, but `gateApproved:false`, `targetReadinessEvidence:false`, and `completionLanguageEligible:false` still require renewed human review. |
| Full first-three product path | not yet produced as a gate packet | Landing/link existence is visible, but full rendered student-path proof for Start, Leer, Oefen, skill map, practice, checks, feedback, and next action is still required. |

## Paragraph Evidence

| Paragraph | Target registry | Landing and route links | Advisory `Korte check` | Exit ticket | Rendered proof now available | Current authority |
|---|---|---|---|---|---|---|
| `1.1.1` | `reviewed_final`; skills `A43`, `B01`, `B02`; reviewed by `B1-MIGRATED-V5-TARGET-QUALITY-1` | Canonical lesson output has `index.html`, paragraaf, begeleide inoefening, opgaven, korte-check, and exit-ticket links. Some route tiles remain `in-preparation` by design. | Exists; four concept/advisory tasks for scarcity, means, opportunity cost, and "free is not free". | Held target-equivalent candidate with `gateApproved:false` and `completionLanguageEligible:false`. | Check-surface evidence exists; no current Golden visual proof comparable to `1.1.2`/`1.1.3` exists in this prep input set. | No completion, product, diagnostic, mastery, PV, Scale Gate, or student/product authority. |
| `1.1.2` | `reviewed_final`; skills `A38`, `A39`, `D31`; reviewed by `B1-MIGRATED-V5-TARGET-QUALITY-1` | Canonical lesson output has landing, learn/practice routes, korte-check, and exit-ticket links. | Golden advisory route exists; `targetEquivalent.candidate:false`; visual proof covers Golden root and advisory boundary. | Golden transfer candidate remains held with `candidate:true`, `gateApproved:false`, and `completionLanguageEligible:false`. | Golden visual proof covers `1.1.2-korte-check` and `1.1.2` exit ticket. | Historical exact-copy authority remains narrow; current Golden transfer still held pending review. |
| `1.1.3` | `reviewed_final`; registry skills `A38`, `A45`, `A46`; reviewed by `B1-MIGRATED-V5-TARGET-QUALITY-1` | Canonical lesson output has landing, graph route, learn/practice routes, korte-check, and exit-ticket links. | Exists and uses smoothie source/table context; source and generated metadata now use `A38/A45/A46`. | Strong held graph/table candidate; covers source/task workspace, table-to-graph construction, graph reading, and percentage claim control; source and generated metadata now use `A38/A45/A46`. | Post-65 graph-exit proof is current and repaired; Golden visual proof covers the exit-ticket mobile/token issue; alignment repair proof has landed. | Target-equivalent closure is blocked by held flags and missing renewed closure review. |

## Surface Details

| Surface | Evidence path | Readiness | Notes |
|---|---|---|---|
| `1.1.1` landing Check section | `review-packet.md`; canonical `1.1.1/index.html` | check-surface ready; product proof missing | Link/card existence is not enough for product closure. |
| `1.1.1-korte-check` | `source-data/book-1/exit-ticket/1.1.1-korte-check.json` | advisory ready for inventory | Advisory status must remain explicit. |
| `1.1.1-exit-ticket` | `source-data/book-1/exit-ticket/1.1.1-exit-ticket.json` | held candidate | Needs rendered target-equivalent review before completion language or product proof. |
| `1.1.2` landing Check section | `review-packet.md`; canonical `1.1.2/index.html` | check-surface ready; product proof missing | Full path evidence still needed. |
| `1.1.2-korte-check` | `golden-surface-visual-review-1-proof.json`; source data | advisory Golden proof ready | Does not prove target-equivalent performance. |
| `1.1.2-exit-ticket` | `golden-surface-visual-review-1-proof.json`; source data | held Golden candidate | Transfer remains `gateApproved:false`. |
| `1.1.3` landing Check section | `review-packet.md`; canonical `1.1.3/index.html` | check-surface ready; product proof missing | Full path evidence still needed. |
| `1.1.3-korte-check` | `source-data/book-1/exit-ticket/1.1.3-korte-check.json`; check-surface packet; alignment repair packet | advisory route useful; metadata aligned | Remains advisory and non-readiness evidence. |
| `1.1.3-exit-ticket` | `graph-exit-ux1-proof.json`; `B1-GRAPH-EVIDENCE-113-CLOSURE-1-result.md`; `B1-GRAPH-EVIDENCE-113-ALIGNMENT-REPAIR-1-result.md` | strong held candidate; not closed | Requires renewed human closure retry for `gateApproved`, `targetReadinessEvidence`, and completion-language eligibility. |

## Product-Proof Evidence Still Needed

Before a later `GATE-PRODUCT-3P` can be reviewed, the team needs current
rendered student-path proof for:

- landing route clarity for `1.1.1`, `1.1.2`, and `1.1.3`;
- Start, Leer, Oefen, skill-map/learn-path, normal practice, advisory short
  check, exit ticket, feedback, and next action;
- desktop, mobile, and dark-mode states where relevant;
- target-equivalent answer-form match against the reviewed source-registry
  targets;
- authority flags proving that held routes do not claim completion,
  diagnostics, mastery, PV, Scale Gate, or student/product use;
- renewed `1.1.3` graph/table closure review after the landed alignment repair
  decides whether `gateApproved`, `targetReadinessEvidence`, and
  completion-language eligibility can change or must remain held.
