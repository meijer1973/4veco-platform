# BOOK-2-FOUNDATION-OUTLINE-1 Owner Review Resolution

Recorded: 2026-09-01
PR: #226
Reviewed head: `56b98478d43437895664a70efe6f57d8f82a453d`
Decision: `REVISE`

## Binding disposition

PR #226 remains draft and must not merge. Gate 0B-0 is not accepted. Gate
0B-1 approval, target mutation, lesson authoring, and paragraph production stay
blocked while the platform-only correction proceeds on the same PR.

## Blocking findings

| Finding | Required correction | State |
|---|---|---|
| Hold deadlock | Add action-scoped `open`/`released` lifecycle, explicit permitted actions, evidence-bearing release, and current-action evaluation. | corrected; specialists PASS; lead PASS WITH FLAGS |
| Duplicate semantic authority | Make Markdown canonical; reduce metadata to identity, freshness, compact target pins, reviews, workflow identity, and holds; reject semantic fields. | corrected; specialists PASS; lead PASS WITH FLAGS |
| Part A ownership contradiction | Create a dedicated Part A `template-textbook-paragraph-plan.md`; Part A owns `X.Y.Z-textbook-plan.md`, Part B only consumes it. | corrected; specialists PASS; lead PASS WITH FLAGS |
| Incomplete foundation check | Add all authority/chapter/target pins, five-way prerequisite classification, non-goals, prepares-for, model conditions, action-scoped holds, and a distinct verdict. | corrected; specialists PASS; lead PASS WITH FLAGS |
| Mastery overstatement | Replace mastery claims with curricular prior-teaching classifications. | corrected; specialists PASS; lead PASS WITH FLAGS |
| Stale owner packet | Refresh the live PR packet only after the final substantive head, exact CI, test totals, status, lesson baseline, and renewed verdicts are known. | in progress |

## Required proof before renewed owner review

- Mutations cover action scope, hold release evidence/effect, metadata semantic
  rejection, and Part A artifact ownership.
- Teacher, economics, sequencing, and lead reviews are rerun against the
  corrected substantive head; when performed by one agent, they are explicitly
  identified as role-based rather than independent.
- Focused and full validation pass, the lesson baseline remains unchanged, and
  exact-head remote CI passes.
- The live PR description records the exact current PR head and the exact
  reviewed substantive head without a self-referential in-repository SHA claim.

## Second owner revision — authority transition and scope enforcement

Recorded: 2026-09-01
Reviewed head: `32f861b0734566c548c0f4cb0bb9c6deeba4fd01`
Decision: `REVISE`

The owner accepted the Book 2 sequence, canonical Markdown authority, compact
metadata, Part A/Part B ownership, complete foundation fields, economic model
conditions, prior-learning classifications, and the self-reference-safe live
terminal packet. The owner found four remaining workflow blockers.

| Finding | Required correction | State at substantive head `46e2f83c894d4dec8a850bc90ca8326a7cea7c0a` |
|---|---|---|
| Holds block their own decisions | Separate resolution decisions/repairs from later approved use/integration and prove complete transitions. | corrected; three transition proofs pass; merge remains separately held |
| Lesson root scope is asymmetric | Use typed scopes and split Book 2 root from Chapter 2.3 planning. | corrected; schema and Chapter 2.1/2.3/§2.1.1 scope matrix pass |
| Human hold table can diverge | Parse and compare every projected lifecycle field. | corrected; seven independent field mutations pass |
| GitHub entrypoint routes to Part B | Route Part A and Part B to their own templates and explain checker order. | corrected; navigation mutations pass |

Non-blocking cleanup is also corrected: lead review round 3 now exists and is
named consistently, and chapter completion requires that no open hold block
the current completion action.

PR #226 remains draft and unmerged. No outline approval, goal/target approval,
target mutation, paragraph production, lesson authoring, or merge is recorded
by this correction. Exact-head CI and the renewed owner decision remain
pending after the evidence tail is pushed.
