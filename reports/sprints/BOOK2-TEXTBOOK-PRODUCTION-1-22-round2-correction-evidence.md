# Chapter 2.2 planning: Round1 finding corrections

Date: 2026-09-05. Task: `BOOK2-TEXTBOOK-PRODUCTION-1-22`.
Author: elasticity_planning. Accountable integrator: codex-root.
Status: **corrections published for bounded independent recheck; not accepted**.

## Exact correction payload

The parent relayed the independent Round1 findings against lesson commit
`08e46af7066e367443d9a71944605e99688bda8d`. The chapter plan passed at its exact
hash below and required no correction. Both paragraph plans needed their
mandatory seven-column alignment table; §2.2.2 also claimed guided target-e
coverage that its questions did not actually supply. This author does not
substitute its own check for the requested independent recheck.

| Repository | Prior published head | Correction head |
|---|---|---|
| Lessons | `08e46af7066e367443d9a71944605e99688bda8d` | `10334028bbadd537fc3790281e90bebdfa827c1e` |
| Platform | `97ffe471a91bfa2d26392775da9ed0ac6fc64984` | Commit containing this report; supplied in final publication handoff |

Normal branch in both repositories: `agent/book2-elasticity-planning-20260905`.
The isolated paired worktrees remain under
`C:/wt/book2-elasticity-planning-20260905/`. Ownership locks remain
elasticity_planning / `BOOK2-TEXTBOOK-PRODUCTION-1-22`.

All paths in the table are lesson-repository relative. Hashes are full UTF-8
SHA-256 after CRLF/CR-to-LF normalization, without trimming.

| File | Version | Round1 hash | Correction hash |
|---|---|---|---|
| `Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/_chapter-plan.md` | `BOOK2-TEXTBOOK-PRODUCTION-1-22-plan-v1` | `3a9db97518b1948eb0967d94653a10c693a0ca001e20b41503b864fd4cc7c2f7` | Same; unchanged |
| `Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1-textbook-plan.md` | `BOOK2-TEXTBOOK-PRODUCTION-1-221-plan-v2` | `d23c72b8b9c14d2702c353e3f0402813b85891b2022e7607a93b6346049f7562` | `29096bdedced016376a5ddf8a22c973ec5d61e8ce4822f390c2b746becca3345` |
| `Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2-textbook-plan.md` | `BOOK2-TEXTBOOK-PRODUCTION-1-222-plan-v2` | `1422c4df142fa77cfa347179376766b75eee7c105071f926ec6beb012c20a805` | `6418491d45c43afdbd272c581bab12f8436ca1a84241663ba300e31b790825a8` |

## Finding responses

### 1. Mandatory alignment shape

Both plans now use the exact seven headers required by `econ-exercise-builder`:
`Lesson goal`, `Target subquestion/operation`, `Worked example`, `Start check`,
`Guided practice`, `Independent practice`, `Covered/gap`.

Goal and observable target operation are no longer merged in one column.
Each table has five data rows. §2.2.2 target e is split into its local-rule and
finite-interval limitation operations so neither can hide behind the other.
The Start column expressly distinguishes short retrieval/comprehension checks
from full target-operation practice. Both actual S1/S2 blocks remain byte-for-byte
unchanged after newline normalization, with the same 5.5-minute total.

### 2. Actual guided target-e practice in §2.2.2

The earlier G2a–d only practised revenue/classification/same-direction inference;
it did not substantiate the earlier local-rule/finite-limit coverage cell.
That original claim was a defect, not merely missing documentation.

| Operation | Stronger guided support | Faded guided question | Answer evidence |
|---|---|---|---|
| Local rule for both inelastic and elastic demand | G1f supplies the inelastic small-price-rise direction and a printed completion frame for the elastic direction and small-price-fall reversal | G2e removes filled directions, word bank and rule diagram; learner states both directions, unchanged-other-conditions restriction, local range and reversal | Inelastic: sufficiently small rise gives TO rise; elastic: TO fall; sufficiently small fall reverses directions, near the starting price under unchanged other conditions |
| Why an interval Ev cannot guarantee a finite TO result | G1g supplies the first explanation sentence plus “lokaal / beide producten” cues | G2f supplies only a fresh photo-print observation and question, with no completed products or explanation frame | P €2→€3; Q10→6 prints/week; given interval Ev−0.8. TO0=2×10=€20/week; TO1=3×6=€18/week. Interval classification does not establish local inelasticity throughout the step; direct products determine this observed fall |

The guided answer designs explicitly explain why, not only which direction.
G2e does not mislabel the earlier ±10% observations as automatically local/small.
The new finite case is not a new elasticity formula, a local-Ev calculation or
an alteration of frozen target e. T2, W1e and the independent I1e counterexample
remain in place unchanged. G1a–e now also have explicit labels corresponding to
their existing alignment references.

The exercise-builder and didactic skills caused the restored alignment shape,
explicit response scaffolds and deliberate removal of support. No student
markdown, asset, rendering, quality-ref or self-review was produced by this task.

## Revised timing, not a compressed support claim

| Route element | Round1 | Correction |
|---|---:|---:|
| §2.2.1 Start | 5.5 | 5.5, unchanged |
| §2.2.1 complete core equation | 48.5 | 48.5, unchanged |
| §2.2.1 optional guided | 10 | 10, unchanged |
| §2.2.2 Start | 5.5 | 5.5, unchanged |
| §2.2.2 complete core equation | 51.5 | 51.5, unchanged |
| §2.2.2 G1 | 5 | 7: a–e 5, f 1, g 1 |
| §2.2.2 G2 | 5 | 8: a–d 5, e 1, f 2 |
| §2.2.2 optional guided total | 10 | 15 |
| §2.2.2 core plus all guided support | 61.5 | 66.5 |

The revised 15-minute support route is additional, not hidden in the 51.5-minute
core or Start. Teachers schedule continuation/homework when it is used. Bonus8
and closing review5 remain outside the core. These are author estimates to be
checked in the later actual solve-and-timing walkthrough and classroom observation,
not attainment or observed pacing claims. No target operation was removed.

## Checks actually executed

All checks were author checks on 2026-09-05, not independent recheck verdicts.

- `git fetch --prune origin` succeeded in both repositories; governance freshness
  passed against origin/main `96416b6b5bd57094576e9aba0a42d682584ec479`, with no
  differing policy entrypoints. Isolated worktree ownership check passed.
- `git diff --check` and staged equivalent passed. The lesson correction diff
  contains only the two paragraph-plan files. The chapter plan hash remains
  `3a9db97518b1948eb0967d94653a10c693a0ca001e20b41503b864fd4cc7c2f7`.
- A Node probe parsed both alignment blocks after masking escaped Markdown pipes:
  each header, separator and data row has exactly seven columns; both have five
  data rows. It verified all frozen goal/context/prompt strings and exact point
  rows against `references/authored/course-target-exercises.json` (9/11 points).
- The same probe compared S1/S2 in both plans to the prior commit and found them
  unchanged. It likewise compared §2.2.2 W1 through W1e and I1 including I1e to
  the prior commit and found those worked/independent blocks unchanged.
- New G2f recalculation: `%P=(3−2)/2×100=50%`, `%Q=(6−10)/10×100=−40%`,
  `Ev=−40/50=−0.8`, `TO0=20`, `TO1=18`, `%TO=−10%`. Calculating Ev/%TO here is
  author verification; the new printed question supplies Ev and asks the two
  TO products and explanation. The original 21 numerical chains were not edited.
- Timing sums recomputed: `7+8=15`, core `2+9+9+3+5.5+12+11=51.5`, full support
  route `51.5+15=66.5`. §2.2.1 core remains48.5.
- `node build-scripts/workflows/check-book-outline-currentness.js --require-approved
  --action goal_design --paragraph <2.2.1|2.2.2>` and corresponding
  `specialist_review` probes all passed.
- Corresponding `paragraph_production` probes both returned expected exit1:
  §2.2.1 blocked by H-221-PRIOR and H-22-ELASTIC-CONTRAST; §2.2.2 blocked by
  H-22-ELASTIC-CONTRAST. Neither hold was released.
- `node build-scripts/workflows/check-book2-target-authority-remediation.js --durable`
  passed: 12 exact frozen records and preserved lifecycle invariants.
- The isolated baseline `check-paragraph-lane-scope.js --cwd
  C:/wt/book2-elasticity-planning-20260905/4veco-lessen --lane textbook --base
  08e46af7066e367443d9a71944605e99688bda8d --head HEAD` still returned exit1:
  both canonical paragraph-plan paths are unknown to that baseline classifier.
  This is the already reported tooling gap. Root owns the separately reviewed
  correction and the current-tool rerun; this child neither changes that tooling
  nor relabels its failed result as PASS.

No full suite, independent review, exact new-head CI, student render or empirical
timing result is claimed. Platform changes are this correction report plus a
supersession pointer in the historical Round1 evidence file only.

## Lifecycle boundary and next action

The isolated platform code remains descended from `4b78edfaca8554937ef4abf3296ef2e4cd366be1`;
its five-open-hold matrices in the unchanged foundation sections describe that
pinned baseline. Root has reported subsequent combined-state releases of only
H-BOOK2-ROOT-PLAN and H-CHAPTER-23-PLAN, leaving H-213-OPC2, H-221-PRIOR and
H-22-ELASTIC-CONTRAST open. This child does not undo those releases, copy unknown
release evidence or use the older baseline as a reason to block unaffected work.
Root owns reconciling current lifecycle evidence and source pins in the exact
owner packet before any teaching-hold decision.

Next: independently recheck the two corrected alignment tables, actual G1f–g /
G2e–f target-e practice and revised support budget at the exact hashes above.
The chapter hash needs no corrective re-review because it is unchanged. After
any required corrections, the genuine exact-plan owner decision remains a
separate gate. No student production, hold release, PR or merge is performed here.
