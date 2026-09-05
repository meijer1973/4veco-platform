# Book 2 textbook production command log

## 2026-09-05: Integration and clean production preparation

| Command/check | Result | Evidence/boundary |
|---|---|---|
| Trusted-main integrate:authorized-pr PR231, comment5551428005, dry-run | exit0, ready_to_merge | Reviewed head086e6b212edc9260fa34f050e9b01b02ec04b035 |
| Same lane, live | exit0, phase merged, post_merge_ci.ok true | Merge96416b6b5bd57094576e9aba0a42d682584ec479; run33963305398 SUCCESS |
| Fresh fetch in both repositories | exit0 | Platform96416b6b; lessonsf09fd6e |
| Unique paired worktree creation from origin/main | exit0 | codex/book2-part-a-production-20260905 |
| check:governance-freshness | exit0 PASS | No differing files against main96416b6b |
| check:agent-worktree-safety --claim, both repositories | exit0 PASS | codex-root / BOOK2-TEXTBOOK-PRODUCTION-1, clean |
| npm ci --ignore-scripts | exit0 |385 packages; eight reported dependency vulnerabilities; no upgrade |
| PDF artifact-operation marker | exit0 | create,41 expected PDF outputs; output not yet created |

No review or production PASS is inferred from tooling availability or CI in progress.

## Exact post-merge verification

`gh run view 33963305398 --repo meijer1973/4veco-platform --json status,conclusion,headSha`
returned completed/success for 96416b6b5bd57094576e9aba0a42d682584ec479.
The existing lane process completed exit0 with phase merged, no integration
descendants, valid unchanged payload lineage and exact post-merge CI success.
Run: https://github.com/meijer1973/4veco-platform/actions/runs/33963305398.

`node build-scripts/sprints/check-sprint-plan.js reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-plan.md`
passed exit0. Independent planning review round 1 requested two narrow
corrections; round 2 passed after both were implemented. No content authoring
had begun at that gate. Repeat plan validation and diff check passed exit0.

Fresh fetch and governance freshness again passed against main96416b6b.
Approved chapter_planning for chapter 2.1 passed exit0. Approved
paragraph_production for 2.1.1 and durable target authority checks passed exit0.

The QC freshness quick-check found the official 2026 framework has superseded
the local protected 2025 reference. Source:
https://www.onderwijsinspectie.nl/onderwerpen/onderzoekskader-2021-wat-is-er-veranderd/bijstelling-2026.
No protected reference was modified or falsely reverified. Optional Inspectie
mapping/current-compliance claims are omitted; external-reference refresh is
named follow-up. All product reviews remain mandatory.

## Reviewed foundation plans and two scoped hold releases

Lesson chapter21 plan commit7ad5dd19e1714bb68d48a55a11a032942a6615e4 passed
independent round2 after exact plan paths and the bounded213→214 profit-change
bridge were added. Root and chapter23 plans passed independent round1 and were
published in lesson9a428e3d15be2ff8931b5a6d859051599aa663a8. Exact reviewed
hashes and findings were published in platform77288fcbf6eddd58779052b66c97227076e1fcd9.
Both production branches were pushed successfully, not merged.

Only H-BOOK2-ROOT-PLAN and H-CHAPTER-23-PLAN were then released locally through
their existing repair actions, actual codex-root actor/date and the immutable
published review references. The canonical projection was regenerated using
the existing formatHoldProjectionRow function and applied only to those rows.

- Approved paragraph_production for211 and231: PASS exit0 after release.
- Durable frozen target/lifecycle authority: PASS exit0, exact12records.
- Semantic outline hash: unchanged919c39f64dd212dba37b62902a5bb2e2ce6388c6020a0491e1621017ae2192a1.
- test:book-outline-currentness:94tests PASS, suite exit0.
- Deliberate negative probes paragraph_production221 and whole_book_assembly:
  FAIL as required, exactly H-221-PRIOR and H-22-ELASTIC-CONTRAST still block.
- H-213-OPC2 remains open; historical approval and audit snapshot unchanged.

## Shared Book2 print tooling checks (pre-product)

Python unittest test_print_pipeline.py:10tests PASS exit0, including temporary
real Pandoc/WeasyPrint PDF + Poppler page/contact-sheet generation. This is a
technical fixture, not a student artifact or visual acceptance. Proof manifest
correctly stays PENDING with no inspected pages or invented zero-defect claim.
Supported WeasyPrint68.1 emitted its known default_url_fetcher deprecation
warning for future69.0; no remote resources are used and no upgrade performed.

Lane-scope focused Jest:24tests PASS exit0. Exact Book2 root/chapter/paragraph
planning filenames are now recognized; wrong IDs, outside-book paths, ZIPs and
companion ownership remain rejected. No broad exception was added.

## Exemplar authoring and full platform regression

The independently reviewed §211 plan was integrated at lesson bf55c91 after
two review rounds (canonical LF SHA-256
f46c7aa444ba6fef1f6f885b34bd52963fccac3cdc7b13b898eb6665219c4cd0).
The assigned builder was then authorized for stage2, not self-acceptance or
independent quality-ref creation. Exact plan evidence is in the211-plan-review
report. Student files and rendered acceptance remain under review.

Full `npm.cmd run check:platform` completed exit0:110 suites passed,6 skipped;
1,869 tests passed,8 skipped (1,877 total),455.221 seconds. This ran against
the root platform through763b0433 before the later review-record commits and
the bounded short-callout patch. Diagnostic fixture failures printed by the
suite are expected negative tests, not failed suites.

Shared print patch5a830c82 adds bounded short warning/definition keep-together
behaviour. Python focused suite now19 tests PASS exit0, including a real
two-page boundary fixture; long/table callouts remain splittable. The first
test attempt failed only on a PDF line-wrap-sensitive assertion; normalized
whitespace corrected the test without altering the rendering expectation.
Independent patch review and final student-page acceptance remain separate.

## Owner-approved elasticity teaching transition

Independent elasticity Round2 PASS binds lesson10334028bbadd537fc3790281e90bebdfa827c1e;
root lesson79655211e8a947c826a3897fb07709ec0c1ed091 contains identical plan files.
The corrected root lane checker passed all7 current lesson planning paths.
Approved goal_owner_decision probes for221/222 both passed before the decision.

The owner explicitly approved the exact plans and both teaching-hold releases
in the active task on2026-09-05. The actual grant was published first at
platform26a330cd1b3a306a801366d119a64474eb7782ed in22-owner-authorization.md.
Only H-221-PRIOR and H-22-ELASTIC-CONTRAST were then set released via the
existing goal_owner_decision action, actual meijer1973 actor/date and that
immutable evidence reference. Their two Markdown projection rows were generated
by existing formatHoldProjectionRow and applied without semantic-outline edits.

- Approved paragraph_production221 and222: PASS exit0.
- Approved whole_book_assembly currentness: PASS exit0. This removes lifecycle
  holds only; actual paragraph/chapter review and output prerequisites remain.
- Durable frozen twelve-record authority: PASS exit0.
- Currentness focused suite:94 tests PASS exit0,15.747seconds.
- Negative formal_output_choice_teaching213: correctly FAIL on H-213-OPC2.
- Exact metadata diff probe: only the two authorized lifecycle entries differ;
  historical audit presence/approvals, previous repair releases and all target
  records remain unchanged. H-213-OPC2 is the only open hold and is out of scope.

No future PR merge or student-output acceptance follows from this plan decision.

## Independent follow-up checks and exemplar integration

Independent reviewer `correction_plan_review` reported PASS for the exact
two-hold release at e25a0cb0: only the authorized status/evidence fields and
projection rows differ; currentness and durable authority pass, and the
out-of-scope formal-output-choice negative remains closed. The same reviewer
independently passed the LF proof serializer (613b4ca9), full 12-point footer
floor (316d2f2d), and narrowly bounded rendered-proof classifier (8af296c5),
including 20 print tests and 25 lane tests. These checks do not accept content.

Root adopted the builder's five own §211 platform commits through
16c3b1c53b73a563084297190ba58d7bf1bed679 and three own lesson commits through
c37dfba8c68cbe86b3b12534e020fda6e2481ac5. Shared helper commits were not
duplicated. Root personally inspected all 31 final R3 pages at full-page
reading scale (15 paragraph, 9 exercises, 7 answers), including the opening
recall bridge, frozen target table, answer scoring, and all 12-point footers.
No additional visible defect was found. This root check is separate from the
two independent reviewers' reports and does not substitute for either gate.

Root's focused Python checks after adoption passed: 20 print, 6 chapter, and
11 §211 source tests. The known future-WeasyPrint-69 deprecation warning was
observed; no upgrade was made.

### Superseded first-draft proof retention

The first-draft generated manifests used raw CRLF bytes. Their old builder
inspection records pin those exact bytes; normalizing them retrospectively
would falsify their provenance. The fixed generator and R2/R3 manifests use LF.
Root removed only these three superseded first-draft directories from its
current integration tree after resolving and checking each exact path:

- `211-antwoorden-9fce79c5c66c`
- `211-opgaven-111c7436dedc`
- `211-paragraaf-e136b26a4fcb`

All are under `reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/`. Their
complete unchanged 40-file evidence remains recoverable at root commit
379624a7 and the published builder commit
a1077e8c9c98c783db178fa2e2862f2c8de9a93d. Historical first-draft paths in the
builder reports must be read at those commits, not as current acceptance.
The R2 history, all R3 proof, student sources/assets/PDFs, and other worktrees
remain untouched. No whitespace-rule waiver or proof-byte rewrite was used.

## Accepted §211 internal exemplar and next paragraph gate

Independent paragraph review by correction_plan_review: PASS WITH FLAGS on
exact platform16c3b1c5 / lessonc37dfba8 R3 payload. Independent specialist QC by
elasticity_planning: PASS WITH FLAGS on the same bytes; all 31 pages personally
inspected, all calculations independently checked, no open core defect.
Root recorded the actual paragraph review and adopted only the specialist's
new commits b5ce54a1/daa2e19f and lesson quality-only8191e77c. Inherited June
acceptance was replaced, not reused. The canonical verdict block was added
without changing the judgment; five Markdown hard-break spaces from the source
review were removed after the whitespace check identified them.

Current lesson handoff head: 7d46d26e54e96e05aa295e6dcfab22f57a2f270e.
Root reran student-web and publisher-print Part A profiles: both PASS, parsing
the explicit PASS WITH FLAGS verdict and valid schema-v2 quality reference.
The integrated shared platform and textbook lesson lanes both PASS, including
all three independent inspection.json files. This resolves the isolated older
QC baseline's disclosed classifier limitation without an exception or waiver.
Root also remapped the canonical R3 manifest paths to its integrated pair and
rehashed all 56 MD/HTML/PDF/asset/page entries: PASS. Review hash matches the
quality record exactly:92b4a9462caf8316274fb58f8beef5c850147c44e6bf80b9a28fad442d9dbe96.

The internal exemplar gate is complete. The 54-minute core remains an estimate,
not observed classroom pacing; the optional supported route needs 66 minutes.
The orange-stroke enhancement is non-blocking only for these exact redundant
representations. No future essential-curve task inherits that judgment.

§212 is assigned to separate paragraph_212_builder in paired worktrees
C:/wt/book2-212-production-20260905/, branch agent/book2-212-production-20260905,
claimed as BOOK2-TEXTBOOK-PRODUCTION-1-212. Its initial authority is planning
only: exact template/alignment/visual/timing plan plus stage-1 evidence. Student
authoring waits for the independent plan gate. Approved currentness212 PASS.

Book tooling independently passed Round2 at d6583627 after the structural
anchor correction; the book-pipeline-review report records actual findings and
44 independently passing focused tests. No chapter/book output exists yet.
The full combined package, exact-head CI, paired PRs and final owner gate are
still pending; §211 is not being handed off as project completion.

## Parallel §221 assignment and integrated regression

Root assigned §221 to distinct paragraph_221_builder in the paired worktrees
`C:/wt/book2-221-production-20260905/`, branch
`agent/book2-221-production-20260905`, claimed as
`BOOK2-TEXTBOOK-PRODUCTION-1-221`. The assignment starts from platform
0e940acb7d1f1811da3d5627d0466affb7767c0e and lessons
7d46d26e54e96e05aa295e6dcfab22f57a2f270e. The already independently reviewed,
owner-approved §221 plan is unchanged; the external two-hold release governs
its historical pending wording. The builder confirmed approved paragraph
currentness and durable twelve-record authority before authoring.

Independent reviewer correction_plan_review passed the §211 handoff at exact
lesson head 7d46d26e: all nine output hashes, three proof-manifest hashes and
review/quality binding match the accepted R3 payload. Timing and contrast flags,
bounded registry mappings, duplicate-route avoidance and the distinction between
technical companion eligibility and authorization remain explicit.

The same reviewer independently confirmed the parallelism: §221's actual
prerequisites are printed Book 1 old-base percentages, demand-factor distinctions
and substitutes, not unfinished §212. §211 was accepted first. §222 still waits
for independently reviewed §221 and §212 teaching/handoffs; parallel §221 does
not release that content dependency. Each paragraph retains a distinct builder
and independent plan/content/visual review gates.

At integrated platform head 0e940acb, `npm.cmd run check:platform` completed
successfully (exit 0): 110 passed / 6 skipped suites, 1,870 passed / 8 skipped
tests, 1,878 total, 437.344 seconds. Expected negative-fixture diagnostics are
not failures. The 44 focused Python print/chapter/book/legacy checks are separate
local checks, not represented as part of this Jest suite or remote CI. Exact
final-head branch CI remains pending.

## §212 plan acceptance and bounded §213 preparation

Root adopted the published §212 planning-only lesson commit48690ee5 as654c5e4
and platform stage-1 evidence ca0b8c81/74368c6c as9bffd4bd/44f9f6a0. The
independent correction_plan_review verdict is PASS on that exact plan, no
required correction. The separate 212-plan-review report records the actual
checks and root's production release conditional on importing the accepted
§211 quality/handoff bindings and rerunning foundation preflight. Legacy §212
student material remains unaccepted until fresh production and review.

While §212 and §221 continue, root created paired worktrees
`C:/wt/book2-213-production-20260905/`, branch
`agent/book2-213-production-20260905`, from platform44f9f6a0 and lesson654c5e4.
Distinct paragraph_213_builder is assigned planning only under
BOOK2-TEXTBOOK-PRODUCTION-1-213: one §213 textbook plan and one stage-1 report.
No §213 student production is permitted until independent plan acceptance and
reviewed §212 teaching/handoff, followed by root release. H-213-OPC2 remains
open and outside the agreed interval-MK/MO scope; no optimization teaching is
being authorized through advance planning.

## Current roadmap reconciliation and additional technical checks

Root updated the live textbook roadmap/ledger and matching version-index
projections to the actual combined production state. The full prior roadmap
is preserved under docs/roadmaps/outdated as v1.20; canonical LF content was
compared with the prior Git blob and is identical (SHA-256
66c9e1d04ea9c633422a409ecfef253a9d6bdefa8a1e3db031d7fd0e8e26ef90).
Historical rows remain intact and are labelled as historical decisions, not
renewed acceptance or current blockers. Version-index validation PASS (153
entries); internal dashboard generation completed, changing only its timestamp
because its existing source selection does not include the textbook roadmap.
No dashboard source-selection or governance change was made.

Additional local focused regression: 20 print + 6 chapter + 13 book = 39 PASS
in 15.061 seconds, plus 7 existing book-library tests PASS in 0.022 seconds.
The new test-only lifecycle delta separately passed independent review at
81923e55, as recorded in the book-pipeline-review report. These 46 checks are
local Python checks, separate from platform Jest and required remote CI.

Both coordinated lane checks passed after §212 plan adoption. Paired candidate
agent indexes pass with explicit lesson HEAD/branch parameters. The global
URL index retains the standard main-URL generator policy; an initial task-branch
retarget was corrected with the standard generator, not a checker exception.

Required platform CI always checks against lesson main; it must not silently
consume this same-named candidate lesson branch. Final publication is therefore
a cross_repo_bundle with immutable paired payloads and all three supported
compatibility states. Candidate-pair local index freshness is not represented
as default main-compatibility or remote CI. The existing trusted lesson-first
generated-index refresh remains available at a later separately authorized
integration gate; no workflow, bypass, merge or CI waiver is introduced here.
