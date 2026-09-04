# BOOK2-TARGET-AUTHORITY-REMEDIATION-1 Planning Review

Date: 2026-09-04  
Reviewer: independent planning-review agent (`planning_review`)  
Verdict: `PASS_WITH_CORRECTIONS`

Implementation remained paused until all blocking findings below were reflected
in the plan and alignment matrix.

| Finding | Required correction | Resolution before implementation |
|---|---|---|
| Candidate governance was underspecified, including released §2.1.1 and `--require-approved`. | Define exact candidate fields/lifecycle, preserve historical approvals, add Issue #229 holds, and test structural-pass versus approved/integration-fail. | Exact nine-field `candidate_binding`, package hash, statuses, successor hold, expected-failure harness, and lifecycle mutations are specified. |
| The `Ei` decision left the approved outline contradictory. | Correct the semantic outline truthfully or add a narrow supersession hold. | The plan adds `H-229-EI-SUPERSESSION`, identifies the two stale statements, keeps approved semantics immutable, and blocks approved use/integration/production pending owner decision. |
| §2.3.3 omitted definition and `Qd`/`Qs`/transaction operations. | Make all operations visible and answered. | The matrix now asks for the definition and records `Qd=40`, `Qs=100`, actual transactions `40`, and the allocation rule. |
| §2.3.4 violated the 4–6-question/base-graph contract. | Reduce to six, supply a graph, combine calculation/shading, map fairness. | The matrix specifies six questions, supplied base graph, combined lost-surplus task, and explicit efficiency/fairness goal. |
| The matrix was not fully bidirectional (§2.2.3 and §2.1.4). | Add function-derived elasticities, exact evidence, operation metadata, and representation meaning. | The matrix includes `Ei≈0.769`, `Ek≈0.0256`, named goods, supplied representation work, and a per-operation evidence contract. |
| Independent verification and correct post-draft lifecycle were absent. | Add a finished-artifact verifier and review the published draft head. | The plan now sequences verification, local checks, draft publication, exact-head lead rounds, correction commit, exact-head CI, and PR-readiness. |
| Workload proof was absent. | Add per-record action/timing budgets. | The matrix contains theory 8–12-minute and mixed 18–25-minute estimates. |
| Checker/CI wiring path was not authorized. | Authorize exact paths conditionally or prove existing discovery. | `package.json` and platform CI are conditionally allowed only for focused-test discovery. |

Nonblocking recommendations were accepted: forbidden-term checks are scoped to
student-facing candidate fields; `Ei=0` and `Ei=1` receive boundary fixtures;
all non-Book-2 records and all machine units except `A17` are hash-compared.

Final planning-gate decision: `PASS_TO_IMPLEMENTATION`. This is not target,
outline, merge, or lesson-authoring approval.
