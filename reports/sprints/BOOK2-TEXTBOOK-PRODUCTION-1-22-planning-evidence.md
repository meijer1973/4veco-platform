# Book 2 Chapter 2.2 teaching-plan preparation evidence

Date: 2026-09-05. Task: `BOOK2-TEXTBOOK-PRODUCTION-1-22`.
Author: elasticity_planning. Accountable integrator: codex-root.
Disposition: **drafts published for independent planning review; no acceptance or hold release**.

## Scope and immutable payload

This bounded subtask prepares the Chapter 2.2 plan and full §2.2.1/§2.2.2
textbook plans. It is `chapter_planning` / `goal_design`, with later
`specialist_review` and `goal_owner_decision` preparation; not `paragraph_production`.

Both isolated worktrees use normal branch `agent/book2-elasticity-planning-20260905`
and an ownership lock for elasticity_planning / `BOOK2-TEXTBOOK-PRODUCTION-1-22`.

| Repository | Worktree | Base | Reviewed-input candidate |
|---|---|---|---|
| Platform | `C:/wt/book2-elasticity-planning-20260905/4veco-platform` | `4b78edfaca8554937ef4abf3296ef2e4cd366be1` | The commit containing this report; supplied by the final publication handoff |
| Lessons | `C:/wt/book2-elasticity-planning-20260905/4veco-lessen` | `f09fd6e88edc5049b026b16b0158e7e188091d2d` | `08e46af7066e367443d9a71944605e99688bda8d` |

All lesson paths below are relative to the lesson repository; hashes are SHA-256
of full UTF-8 text after CRLF/CR-to-LF normalization, with no trimming.

| File | Plan version | Canonical-LF SHA-256 |
|---|---|---|
| `Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/_chapter-plan.md` | `BOOK2-TEXTBOOK-PRODUCTION-1-22-plan-v1` | `3a9db97518b1948eb0967d94653a10c693a0ca001e20b41503b864fd4cc7c2f7` |
| `Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1-textbook-plan.md` | `BOOK2-TEXTBOOK-PRODUCTION-1-221-plan-v1` | `d23c72b8b9c14d2702c353e3f0402813b85891b2022e7607a93b6346049f7562` |
| `Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2-textbook-plan.md` | `BOOK2-TEXTBOOK-PRODUCTION-1-222-plan-v1` | `1422c4df142fa77cfa347179376766b75eee7c105071f926ec6beb012c20a805` |

Both paragraph plans pin the exact chapter-plan hash above. The report holds the
chapter's own hash externally to avoid a self-referential digest. Only these
three lesson files changed: the existing chapter plan was refreshed and two new
textbook plans were added. The sole platform change in this child is this report.

No student markdown, HTML, PDF, asset, review, quality-ref or handoff was written.
No Book 1, Part B, registry, outline, metadata, historical approval, machine unit,
external reference or shared build tool was modified. Root owns combined indexes,
maps, sprint manifests, independent review and future integration; this child
creates no PR and performs no merge.

## Authority and preserved lineage

The root operational plan at the platform base records completion of authorized
PR231 merge `96416b6b5bd57094576e9aba0a42d682584ec479`, with exact post-merge
[main CI 33963305398](https://github.com/meijer1973/4veco-platform/actions/runs/33963305398)
and [owner payload authorization](https://github.com/meijer1973/4veco-platform/pull/231#issuecomment-5551428005).
That is baseline integration evidence, not CI or approval of these new drafts.

| Pin | Exact value |
|---|---|
| v6 / canonical-LF SHA-256 | `v6-three-year umbrella`; `72fb1bc8c7b4843ac5cf4c29acfb9d117b6118eeaa1cd5fe5229604dfe412e6e` |
| v5 / canonical-LF SHA-256 | `v5`; `61130f10e7b8b6417641436f0995be090db04b11075d02878ae0a51c12b497c7` |
| Outline version / status | `book-2-outline-v3-review-ready`; `approved_with_holds` |
| Outline semantic SHA-256 | `919c39f64dd212dba37b62902a5bb2e2ce6388c6020a0491e1621017ae2192a1` |
| Current registry canonical-LF SHA-256 | `d3d7163ad82e0ddcf2f9ae1cbfa653335c96cb46762e8125bd594583f5d5885e` |
| Frozen twelve-record package SHA-256 | `914d1a39f18f8f9b7cf7fad938d2c42f9c2bc19671d94c24be151b1da0371310` |
| Content-reviewed commit | `b614577f19c6e8a95c9981256aa125e56d26cd79` |
| Content/semantic decision commit | `6d6f42226987f9ef9977f46dbb869455a88c25e2` |
| Separate integration-grant commit | `6e35f4fe0aeaa448da9476469294ccd45775232d` |
| Target activation commit | `206c018478654db781cc879e7ea36adcd9ef600c` |

The exact [content/semantic decision](https://github.com/meijer1973/4veco-platform/blob/6d6f42226987f9ef9977f46dbb869455a88c25e2/reports/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1-owner-review-20260905.md)
and [separate integration grant](https://github.com/meijer1973/4veco-platform/blob/6e35f4fe0aeaa448da9476469294ccd45775232d/reports/sprints/BOOK2-TARGET-INTEGRATION-1-owner-authorization.md)
are distinct immutable decisions. Neither approves unseen teaching plans.

The historical outline and v5 cinema/petrol/empty-prior descriptions are not facts
about the current frozen §2.2.1 target. Its replacement already names Book 1
retrieval and Nova `Ev=-0.8` versus StreamNow `Ev=-2`. This preparation implements
that stronger replacement with explicit teaching; it proposes **no registry
normalization** and does not change the semantic outline. Chapter 2.2 preserves
the exact current Ei rule: `Ei<0` inferieur, `0<Ei<1` normaal, `Ei>1` luxe;
0 and 1 remain unlabeled and no noodzakelijk split is restored.

Released Chapter 2.2 target holds all retain `released_by=meijer1973`,
`released_on=2026-09-05`, the immutable integration-grant URL above,
`resolved_via=target_authority_integration` and activation commit above:

| Released hold / subject | Exact subject SHA-256 |
|---|---|
| H-229-221-CANDIDATE / 2.2.1 | `61b54bde03d60be241092479cfcea8820e8187220f8f454dc9fef5045c8ea288` |
| H-229-222-CANDIDATE / 2.2.2 | `8ce56143aef61b0e67aae5b179f6e5f3fe547192bc776a42c43101cb5a70fa2e` |
| H-229-223-CANDIDATE / 2.2.3 | `9a3a29bcedc16739b74b66b2bb8e136b37e86c7f5cfee3ee35ea37c4bdeed1c5` |
| H-229-224-CANDIDATE / 2.2.4 | `4e0840ddf202ce4906ee05cd4dde97c0f3577885c34f0b9613ea18760aad7519` |

H-OUTLINE-OWNER remains the historical 2026-09-02
[PR226 decision](https://github.com/meijer1973/4veco-platform/pull/226#issuecomment-5515033629),
reviewed head `2166cd074e1cb8d24f7908e9f792a996dbfd48e7`, subject hash
`69d803d2786e97bbd7519d2feed3ee29b79751b00a3c8a440432621927a13cde`.
H-229-EI-SUPERSESSION points to the separate content/semantic decision with
subject `book-2-ei-semantic-supersession`, current semantic hash above, reviewed
head `b614577f19c6e8a95c9981256aa125e56d26cd79`, decision
`approve_three_way_ei_unlabeled_zero_one`, and evidence SHA-256
`f67a8ec08d1ffe55d7ba22ac9767d18cba0e8eaba599c6e07f45c364b39071ff`.
H-MERGE-GOVERNANCE preserves the 2026-09-03
[PR226 merge decision](https://github.com/meijer1973/4veco-platform/pull/226#issuecomment-5521351557),
not a grant to merge this new payload. No historical evidence is rewritten.

## Required teaching-plan content

The plan template and relevant authoring skills caused the following concrete
design decisions; no skill-generated review acceptance is claimed:

- Every target operation is mapped to worked, start, guided and independent
  practice, with exact target wording and points retained. All seven future
  printed exercise headings, non-heading summary placement, printed support,
  faded guidance, neutral skip language and separate answer output are specified.
- Actual printed retrieval questions and answers replace generic prerequisite
  labels. The plans use all five prerequisite classifications and distinguish
  curricular encounter, modest design assumptions and observed learner security.
- Elastic and inelastic cases appear in instruction and practice. §2.2.1 G2
  contrasts equal absolute percentage price changes with different responses;
  its misconception wording was corrected before commit to match those data.
- §2.2.2 teaches the local rule separately from direct finite observations,
  includes a fully worked finite counterexample and an independent fresh one,
  and never treats an interval Ev as evidence of local inelasticity everywhere.
  No calculus, arc formula, optimization or target mutation is introduced.
- All future figures have named paired SVG/PNG specifications, exact numerical
  content and print-scaled 12pt labels. The root readability floor is preserved.
  Optional Inspectie mapping is omitted pending the root's protected-reference
  refresh; this plan makes no current legal/compliance claim.

Book 1 evidence is read-only at lesson base
`f09fd6e88edc5049b026b16b0158e7e188091d2d`:

| Prior | Actual curricular evidence | Registry record SHA-256 |
|---|---|---|
| A38 old-base percentage change | §1.1.2 `1.1.2 Percentages en indexcijfers – paragraaf.md`, lines15–53: formula, four steps, wrong-new-base warning | `2abda816f4f7f18c2eef5ff4b2a2742747e7aca3618d4a7a4d1e7ac63859e55b` |
| Demand movement/shift and substitutes | §1.2.2 `1.2.2 Vraagfactoren – paragraaf.md`, lines24–60 and86–92/158–170 | `dacffb4b374dfe650dbb7909471405d3cc182518421d8ec5cc70357c87620eae` |
| §2.1.2 TO and profit boundary for later §2.2.2 | Frozen target is design authority; new reviewed teaching/handoff still required, not silently inferred from old student output | `19b466dd6f7b541a3bb701d4de80ce13fe9ea58356313e24b23b21698093e1f9` |

Full Book 1 paths are printed in the paragraph plans. §2.2.2 likewise requires
the future reviewed §2.2.1 teaching/handoff before production. These checks do
not claim classroom mastery. A15/A38/D06/A85 were inspected read-only; broad
percentage-point metadata and D06's stale code remain visible limitations.
D25 is not claimed as local-rule coverage; the machine-unit gap stays explicit.

Both AGENTS, the Part A build workflow and template, chapter build workflow,
paragraph-lane contracts, product vision/end-state/core specifications,
`econ-textbook-paragraph`, `econ-exercise-builder`, `econ-didactiek`,
`econ-chapter-builder`, `economic-graph`, `econ-pdf-builder`,
`econ-quality-control`, `econ-paragraph-review`, pedagogical boundaries,
didactic principles, economic terminology, mathematical precision and school
overlay were read by this author. Quality/review skills supplied future gates,
not permission to self-review or produce quality-ref files. Part B work remains
outside this bounded task.

## Action gates: all five open holds preserved

The three plans contain scope, blocks, permits, resolution actions and current
effects; none of the following has release evidence from this task.

| Open hold | Current design effect | Production / later effect |
|---|---|---|
| H-221-PRIOR | `goal_design` and `specialist_review` permitted for §2.2.1; `goal_owner_decision` is a permitted resolution action | Blocks §2.2.1 approved_goal_use/paragraph_production until actual exact reviewed retrieval-plan owner decision, including normalization decision |
| H-22-ELASTIC-CONTRAST | Same design/review/decision permissions for §§2.2.1–2.2.2 | Blocks both paragraphs' approved_goal_use/paragraph_production until actual owner approval of exact reviewed instruction/practice contrasts |
| H-BOOK2-ROOT-PLAN | Does not block this goal_design; explicitly permits chapter_planning | Book readiness and whole-book assembly remain blocked; root owns repair |
| H-CHAPTER-23-PLAN | Outside Chapter 2.2; does not block these designs | Chapter 2.3 production and relevant whole-book actions remain governed separately |
| H-213-OPC2 | Outside paragraph/route scope here | Formal §2.1.3 output-choice teaching remains outside this project |

A checker PASS for `goal_owner_decision` means the decision action may be taken;
it is not that decision. Root can continue unaffected §2.1.1 work independently.

## Executed local checks

Checks below ran on 2026-09-05 against the immutable lesson candidate above and
the platform base, except the initial worktree claim before authoring. No full
test suite, student rendering, post-publication CI or independent plan review is
represented by these author checks.

| Command / probe | Actual result |
|---|---|
| `git fetch --prune origin` in both worktrees | PASS; fresh remote refs before commit/publication |
| `node build-scripts/ci/check-agent-worktree-safety.js --check --task BOOK2-TEXTBOOK-PRODUCTION-1-22 --agent elasticity_planning --require-prefix agent/` and same with `--worktree C:/wt/book2-elasticity-planning-20260905/4veco-lessen` | PASS: isolated branches, same owner/task; expected authored lesson dirt only before commit |
| `npm.cmd run check:governance-freshness` | PASS; origin/main `96416b6b5bd57094576e9aba0a42d682584ec479`; no differing governance entrypoints |
| `node build-scripts/workflows/check-book-outline-currentness.js` | PASS, 12 target pins |
| Same with `--require-approved` | PASS, approved outline; not teaching-plan approval |
| Same with `--action chapter_planning --chapter 2.2` | PASS |
| Same with `--require-approved --action goal_design --paragraph 2.2.1`, then 2.2.2 | Both PASS |
| Same with `--require-approved --action specialist_review --paragraph 2.2.1`, then 2.2.2 | Both PASS |
| Same with `--require-approved --action goal_owner_decision --paragraph 2.2.1`, then 2.2.2 | Both PASS; decision not supplied |
| Same with `--require-approved --action paragraph_production --paragraph 2.2.1` | Expected exit1: H-221-PRIOR and H-22-ELASTIC-CONTRAST block |
| Same with `--require-approved --action paragraph_production --paragraph 2.2.2` | Expected exit1: H-22-ELASTIC-CONTRAST blocks |
| `node build-scripts/workflows/check-book2-target-authority-remediation.js --durable` | PASS: 12 exact frozen records and lifecycle invariants; PR-scoped unrelated-record guard remains a separate root gate |
| Literal target/goal/points probe | PASS: §2.2.1 nine strings and9 points; §2.2.2 eleven strings and11 points; Markdown escaped pipes decoded only for comparison |
| SHA-256 recomputation | PASS: full chapter hash matches both paragraph pins; all three file hashes and seven relevant target/prior hashes match this report/plans |
| `git diff --check` / staged equivalent in both repos | PASS; no whitespace errors |
| `git diff --name-only f09fd6e88edc5049b026b16b0158e7e188091d2d HEAD` in lessons | Exactly the three declared lesson paths; no student, Book 1 or Part B changes |
| `node build-scripts/workflows/check-paragraph-lane-scope.js --cwd C:/wt/book2-elasticity-planning-20260905/4veco-lessen --lane textbook --base f09fd6e88edc5049b026b16b0158e7e188091d2d --head HEAD` | **FAIL in baseline tool**: all three canonical plan names classified unknown; no silent waiver or tool edit in this child |

Root reports the planning-path classifier gap is corrected in its separately
reviewed tooling (`20f9c26b`, included in root pipeline `763b0433`), with 24
targeted tests independently passing. This child has not cherry-picked that
tooling or claimed a rerun with it. Root must run the current checker on these
integrated paths before combined acceptance. The child diff itself is explicitly
enumerated above; the baseline classifier failure is preserved, not recast PASS.

### Recomputed arithmetic and timing

The author recalculated each chain in a read-only Node command using
`dp=(p1-p0)/p0*100`, `dq=(q1-q0)/q0*100`, `Ev=dq/dp`,
`TO0=p0*q0`, `TO1=p1*q1`, `dTO=(TO1-TO0)/TO0*100`.
All21 supplied expected Ev values match within `1e-9`; outputs below were
rechecked against the plan answer designs. This is author verification, not an
independent reviewer verdict. Revenue columns for §2.2.1 are technical sanity
checks only and add no revenue operation to that paragraph's student route.

| Case | %P | %Q | Ev | TO0 | TO1 | %TO |
|---|---:|---:|---:|---:|---:|---:|
| 221-T-fruit | 10 | -5 | -0.5 | 1000 | 1045 | 4.5 |
| 221-T-hire | 10 | -20 | -2 | 1000 | 880 | -12 |
| 221-W-bowl | 25 | -10 | -0.4 | 1600 | 1800 | 12.5 |
| 221-G1-repair | 10 | -5 | -0.5 | 2000 | 2090 | 4.5 |
| 221-G2-arcade | 20 | -30 | -1.5 | 1000 | 840 | -16 |
| 221-G2-swim | -20 | 10 | -0.5 | 1000 | 880 | -12 |
| 221-I-skate | 20 | -30 | -1.5 | 4000 | 3360 | -16 |
| Frozen Nova | 20 | -16 | -0.8 | 5000 | 5040 | 0.8 |
| Frozen StreamNow | 10 | -20 | -2 | 20000 | 17600 | -12 |
| 222-T-toy | 10 | -5 | -0.5 | 500 | 522.5 | 4.5 |
| 222-T-coffee | 10 | -20 | -2 | 500 | 440 | -12 |
| 222-W-pottery | 10 | -5 | -0.5 | 1000 | 1045 | 4.5 |
| 222-W-comic | 10 | -20 | -2 | 1000 | 880 | -12 |
| 222-W-finite | 50 | -40 | -0.8 | 1000 | 900 | -10 |
| 222-G1-museum | 10 | -5 | -0.5 | 400 | 418 | 4.5 |
| 222-G1-laser | 10 | -20 | -2 | 400 | 352 | -12 |
| 222-G2-ice | 10 | -5 | -0.5 | 1000 | 1045 | 4.5 |
| 222-G2-badminton | -10 | 20 | -2 | 1000 | 1080 | 8 |
| 222-I-dance | 20 | -10 | -0.5 | 2000 | 2160 | 8 |
| 222-I-puzzle | 20 | -40 | -2 | 2000 | 1440 | -28 |
| 222-I-finite | 50 | -40 | -0.8 | 2000 | 1800 | -10 |

The finite counterexample has an old-base interval ratio `-40%/+50%=-0.8`,
but direct TO falls10%. It is an explanation/practice of existing target e's
limitation, not a changed target or a claim contradicting the local rule.
For fixed old/new observations, direct products determine the revenue result.

Whole-lesson design sums include motivation, all instruction, worked example,
summary/transitions, Startopgaven, independent practice and the exact target:

- §2.2.1: `3+10+7+3+5.5+11+9=48.5` minutes.
- §2.2.2: `2+9+9+3+5.5+12+11=51.5` minutes, including the finite counterexample.

Guided support adds10 minutes per paragraph; it is not falsely included within
the55-minute claim. Optional bonus8 and closing review5 are outside the core.
Teachers schedule continuation/homework where needed; no target operation may
be removed to force a time estimate. Actual solve-and-timing walkthrough,
classroom pacing and attainment remain evidence needs after authoring.

## Handoff and remaining gates

Root should independently review the three exact lesson files for economics,
teacher usability, Dutch wording/student experience, prerequisite evidence and
whole-lesson feasibility, obtain corrections as needed, then prepare the exact
published owner-decision payload for the two teaching holds. No decision text
should be invented or attributed to the owner from the prior production grant.

Even after those decisions, §2.2.2 needs actual reviewed §2.1.2 and §2.2.1
teaching references, current production-action PASS and the normal paragraph
production/review/render gates. This child has not created student material,
released a hold, accepted its own plans, opened a PR or merged anything.
Combined indexes, exact-head CI, scope checks with current tooling, review
acceptance and any future authorized integration are root-owned follow-up work.
