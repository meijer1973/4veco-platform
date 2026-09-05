# §2.1.1 R5 independent paragraph review — committed scope and publication

Date: 2026-09-06 (Europe/Amsterdam). Actor: `paragraph_221_r8_independent_review`.
Task: `BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW`.
Role: independent paragraph reviewer, not author, specialist QC or root integrator.

## Exact paired candidate

Both repositories use `agent/book2-211-r5-review-20260905` in the separately claimed
pair `C:/wt/book2-211-r5-review-20260905/{4veco-platform,4veco-lessen}`.

| Binding | Platform | Lessons |
| --- | --- | --- |
| Assigned published builder baseline | `bac19f0f29d5493588a161f3182f33b731eee7d9` | `45064bdfe0c1548f25f097eef648400382403cdf` |
| Committed review payload | `524cfc8cf12ef255840f568324c3d26210451de2` | `3ccd6f68c848d1ab33e5c33fcac754ffbd7c0d99` |
| Actual complete R5 candidate comparison base (R4) | `2bf6260c5d4d799c5408f898d0dab126eff9e5ac` | `917115c8da631d65eefbdb1f15c13b2291cd9e1d` |

The payload contains the personally completed review and its evidence. It does not
promote specialist QC, handoff, root production acceptance, PR readiness or CI.
The canonical lesson review and this platform's `...211-R5-REVIEW-report.md` are
byte-identical SHA-256
`a75755c7c2e6cdffb2defcbb5403814cf854d87bfae9a8172dd768aadb5b8023`.
The genuine verdict is **PASS WITH FLAGS**, limited to independent paragraph review.

## Actual committed checks

The scope checker passed against the complete committed candidate in each lane:

```text
node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base 2bf6260c5d4d799c5408f898d0dab126eff9e5ac --head 524cfc8cf12ef255840f568324c3d26210451de2 --json
node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --base 917115c8da631d65eefbdb1f15c13b2291cd9e1d --head 3ccd6f68c848d1ab33e5c33fcac754ffbd7c0d99 --json --cwd C:/wt/book2-211-r5-review-20260905/4veco-lessen
```

Both returned exit 0 and `ok: true`, with no exception. Separately, exact
`git diff --name-only` audits against the assigned builder baseline show all 58
platform payload paths belong to the unique
`reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW` prefix; the sole lesson
path is the canonical `2.1.1-review.md`. No source, PDF, assets, native proof,
canonical QC, handoff, shared helper, renderer, policy, target, plan, prerequisite
or dependent paragraph pin was changed by this reviewer.

`...211-R5-REVIEW-evidence/committed-scope.json` preserves the initial successful
whole-candidate checks and exact own paths. The additive
`committed-scope-diagnostic.json` also records the bounded expected diagnostic
below. Exact commands, exit codes, complete text outputs and SHA-256 bindings are
retained in the append-only owned `commands.jsonl`.

## Preserved failed scope probe

The first scope orchestration also applied the shared lane checker to the
reviewer-only evidence delta `bac19f0f...` to `524cfc8c...`. It returned exit 1,
correctly identifying exactly:

- `shared lane needs at least one shared platform change`
- `generated index/report or review-evidence changes are allowed only with lane-owned changes`

Its stdout SHA-256 is
`32bb31ed99ca3084349db758d4e6e2c9516939788a4f043f3187141b8788e8ab`.
This is a structural rejection of an evidence-only range, not a defect in the
complete R5 implementation candidate, which contains the builder's actual
answers and regression-test changes. No implementation file was padded to create
an artificial lane anchor. No waiver, scope policy or failure record was altered.

The owned orchestration was corrected to distinguish the checks: complete
candidate lane checks must exit 0; the evidence-only diagnostic is explicitly
required to exit 1 with exactly these two failures and no unknown/shared-platform
paths; the reviewer delta must independently pass the strict own-path audit.
The successful bounded rerun is preserved separately rather than overwriting the
original failed invocation. The earlier recorded HTML heading softwrap probe
failure is also preserved and explained in the substantive review report.

## Publication boundary and verification sequence

This scope/evidence tail follows the payload. A separate generated-index-only
tail will bind the platform source commit and explicit paired lesson HEAD
`3ccd6f68c848d1ab33e5c33fcac754ffbd7c0d99` on the branch above. The generator is
given `FOURVECO_LESSEN_ROOT`, `FOURVECO_LESSEN_SOURCE_REF=HEAD` and
`FOURVECO_LESSEN_SOURCE_BRANCH=agent/book2-211-r5-review-20260905`; this prevents a
default-main lesson map from masquerading as this reviewed pair.

Before final handoff, the terminal generated-only tail is to be checked for index
freshness, both final committed whole-candidate scopes, strict final own-path
boundaries (the unique evidence prefix plus the named generated report files),
clean diffs and worktree claims. Both branches are published by normal non-force
push, then exact remote SHAs and zero ahead/behind are checked. Final published
SHAs and actual terminal results are supplied to root in the handoff; they are
not pretended to exist at the time of this pre-publication report.

The old R3 review is preserved byte-for-byte in the uniquely named historical
snapshot. Historical canonical QC SHA-256
`0dddb6e9d8f3a8da0e0f31e67dafabf53b99feb6ad86ce72039480dd7e12ea18`
and historical handoff SHA-256
`724a080619f2f072151edf20980071b3bef18cd60d1904c78f4aa906be8917c8`
remain unchanged and are not current R5 acceptance. A distinct current specialist
QC and root adoption/acceptance remain pending. Timing 54/66/78 minutes remains
unobserved. The redundant orange contrast flag is bounded to the inspected
figures, not a blanket palette/role/accessibility waiver. No PR or merge is
created or authorized here, and no full-suite or remote current-head CI claim is
made.
