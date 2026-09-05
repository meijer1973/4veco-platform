# Sprint BOOK2-TEXTBOOK-PRODUCTION-1: Command Log

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

The active sprint-plan check passed, but the first active-bundle recheck at this
stage failed because the original baseline used a generic title and omitted
the prescribed Plan reference/Data integrity headings. Root read the validator
and corrected only that document structure and explicit protected-data statement,
preserving its historical starting facts, pending CI and five-hold snapshot.
The original failure is retained here; no retrospective initial PASS is claimed.
A current read-only diff from platform baseline96416b6b through9f269484 lists
no changes under references/machine or references/external. Final --complete
closure, result metadata, JSONL acceptance evidence and lead rounds remain
required after the full package is actually ready, not at this intermediate gate.

Structured JSONL command recording begins with the actual fresh executions
below through the existing sprint command runner. Earlier Markdown observations
remain historical tool evidence; no invented start/end timestamps or retrospective
JSONL successes are assigned to them. Final claimed acceptance commands will be
rerun through this runner against the completed package.
## node build-scripts/sprints/check-sprint-plan.js reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-plan.md

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T14:54:54.917Z`
- finished_at: `2026-09-05T14:54:55.018Z`
- duration_ms: `101`
- exit_code: `0`
- stdout_sha256: `f36649c10e9879f3cceca6cc9d020d6275032b0f7f505d4f7ecf4e7635d67e87`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint plan: reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-plan.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js BOOK2-TEXTBOOK-PRODUCTION-1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T14:54:55.049Z`
- finished_at: `2026-09-05T14:54:55.214Z`
- duration_ms: `165`
- exit_code: `0`
- stdout_sha256: `699bba7f2550eced00884bc621132de46fe5608c6b1baf7757bd06afbdbe896d`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: BOOK2-TEXTBOOK-PRODUCTION-1 planned/active

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T14:54:55.263Z`
- finished_at: `2026-09-05T14:54:55.921Z`
- duration_ms: `658`
- exit_code: `0`
- stdout_sha256: `ca7764da243c9b491670418ecc8585edfb9d1edc93a3f5078e1bf8cade732ebc`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard

```

### stderr excerpt

```text

```
## "C:\\Python314\\python.exe" build-scripts/content/book-2/221/test_source.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T15:20:47.708Z`
- finished_at: `2026-09-05T15:20:48.197Z`
- duration_ms: `489`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `31ad4ce4dea527f6fdcbe7b7030d19e996dc40a0c79ceaeecf5514a732de44a6`

### stdout excerpt

```text

```

### stderr excerpt

```text
.........
----------------------------------------------------------------------
Ran 9 tests in 0.064s

OK

```
## "C:\\Python314\\python.exe" build-scripts/content/book-2/b2_221.py --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-root-rebuild.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T15:20:49.001Z`
- finished_at: `2026-09-05T15:20:54.733Z`
- duration_ms: `5732`
- exit_code: `0`
- stdout_sha256: `b2c590ba445b2f53d3b2f59f5fac909c4787e2fd6e704c9f94d77959bbd5e1d5`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.1
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{
  "paragraph": "2.2.1",
  "target_record_sha256": "61b54bde03d60be241092479cfcea8820e8187220f8f454dc9fef5045c8ea288",
  "plan_sha256": "29096bdedced016376a5ddf8a22c973ec5d61e8ce4822f390c2b746becca3345",
  "chapter_sha256": "3a9db97518b1948eb0967d94653a10c693a0ca001e20b41503b864fd4cc7c2f7",
  "input_sources": [
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\b2_221.py",
      "sha256": "5102e16b5b86b0b6ec56a7b8ebfd4fcfbc36add33d11c90176ed8b4f39fcc56f"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\print_pipeline.py",
      "sha256": "51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\221\\theory.md",
      "sha256": "ae0b4c44bcc1d2bbff25fbfa8f26fffe24b6f6d26fcd37f6d0028284c686477e"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\221\\exercises.md",
      "sha256": "29d3667c7ae24ded113eb327628a425f32c366c283c7120fe89f696b5284ae0a"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\221\\answers.md",
      "sha256": "583e083e66cfdbd14aee442da7fab1c19aa3fc999dcfe53f63d965e291198c1a"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\221\\target-answers.md",
      "sha256": "59a17da108763172e5f590fca927a448fe12b07d5b5ff113b9ec7a82c80954b5"
    }
  ],
  "inspection_status": "PENDING",
  "documents": [
    {
      "source_md": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\2.2.1 Prijselasticiteit \u2013 paragraaf.md",
      "source_sha256": "064cf4ecb7945fc986962100acae438d744138ecf7519fe565860af5cecd61e4",
      "source_html": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\2.2.1 Prijselasticiteit \u2013 paragraaf.html",
      "html_sha256": "65ecae182fe7d29c24c4d605e3d8193479e37bfb56821563dc441dc5c837b229",
      "source_pdf": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\2.2.1 Prijselasticiteit \u2013 paragraaf.pdf",
      "pdf_sha256": "e493735b1dce12fc6135769b73c2e08f63fdecc7b84f041ddd0c456b9348fe6d",
      "assets": [
        {
          "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\_assets\\2.2.1_fig_1.svg",
          "sha256": "609c6ffad43818ad4c887d882bbd2bc4e1c23dc1dd0c41e50559e4fbc24ad8cb"
        },
        {
          "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\_assets\\2.2.1_fig_1.png",
          "sha256": "6f4009fe29fb88f442257e658fe6433809020ba824d17ee275a08701f37d0704"
        },
        {
          "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\_assets\\2.2.1_fig_2.svg",

...[truncated 3742 chars]
```

### stderr excerpt

```text

```
## "C:\\Python314\\python.exe" build-scripts/content/book-2/221/check_render.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T15:22:00.556Z`
- finished_at: `2026-09-05T15:22:01.367Z`
- duration_ms: `811`
- exit_code: `0`
- stdout_sha256: `bda64c6e869342b9f5cdd8faec3f64ca9676350dafa5b0205aecb5d31024a1a4`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "paragraph": "2.2.1",
  "visual_acceptance": "NOT_SUPPLIED_BY_THIS_SCRIPT",
  "automated_status": "PASS",
  "documents": [
    {
      "kind": "paragraaf",
      "pdf_sha256": "e493735b1dce12fc6135769b73c2e08f63fdecc7b84f041ddd0c456b9348fe6d",
      "pages": 10,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": 12.221,
      "proof_directory": "C:\\wt\\book2-221-production-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\221-paragraaf-e493735b1dce-r5",
      "all_page_hashes_match": true
    },
    {
      "kind": "opgaven",
      "pdf_sha256": "48af0e7d2f6fbd10b9f2ca19182e36fa1da8b125e045aba4111aa377e0087a82",
      "pages": 6,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": 12.221,
      "proof_directory": "C:\\wt\\book2-221-production-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\221-opgaven-48af0e7d2f6f-r5",
      "all_page_hashes_match": true
    },
    {
      "kind": "antwoorden",
      "pdf_sha256": "d4a7c139d49276e80c23f4eda1cfab7841d063b204d7a9bb70cd225a796e5b5d",
      "pages": 4,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": null,
      "proof_directory": "C:\\wt\\book2-221-production-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\221-antwoorden-d4a7c139d492-r5",
      "all_page_hashes_match": true
    }
  ],
  "checks": [
    "exact frozen goals/context/a-d/3+2+2+2points/short answers",
    "one exercise HTML definition in both editions",
    "no leaked fences or active resources",
    "every printed text/font and placed figure label meets12pt floor",
    "all assets and all rendered page hashes fresh; manifests honestly pending"
  ]
}


```

### stderr excerpt

```text

```

## Published §221 candidate, §213 plan and independent assignments

Root adopted the clean, published §221 builder payload as platform
b5769b75/1e14df2b and lessons dd01bbd, then adopted the planning-only §213
payload as platform 669bc50f and lessons fed59b6. The §213 plan remains
canonical LF hash 4cf29ff1e70953f6d1f8399a65d63ad37031e6a129804ad555442bfb98624234.
Root read it in full, including the seven-column operation alignment, exact
tables and bounded C21 profit-change bridge. No §213 production is released.

Non-author `paragraph_221_review` received the exact builder heads and all
twenty final R5 pages for independent paragraph review. Separate specialist QC
will follow. `correction_plan_review` received the exact §213 plan for independent
planning review, plus read-only consistency review of the current roadmap and
baseline/protocol repair. Its first turn hit model capacity after substantial
checks; root requested continuation from those checks, without recording a
final PASS from an unfinished review.

Root's full §221 read, twenty-page visual check, nine source tests, identical
rebuild, 43 raw hash comparisons and three immutable proof-manifest hash checks
are recorded in `BOOK2-TEXTBOOK-PRODUCTION-1-221-root-verification.md`. The
fresh machine command executions above are actual JSONL-backed observations.
The builder-path render checker is explicitly distinguished from root raw-byte
equivalence; no script-generated visual verdict is claimed.

The §212 builder is finishing final rendered QA in its own worktrees. Its
superseded untracked captures are retained as local unaccepted history, excluded
from publication; root did not authorize broad cleanup or source changes.
§212 paragraph review/QC and reviewed handoff still precede §213 teaching and
§222 teaching. No new target, hold transition, owner decision or merge occurred.
## node build-scripts/workflows/check-paragraph-lane-scope.js --cwd ../4veco-lessen --lane textbook --base origin/main --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T15:25:18.216Z`
- finished_at: `2026-09-05T15:25:18.406Z`
- duration_ms: `190`
- exit_code: `0`
- stdout_sha256: `3b99e6d6501b588287c702765311849bb4a34c2386c8eb458a228a735f1d0dfe`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 49
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – antwoorden.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – antwoorden.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – antwoorden.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – opgaven.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – opgaven.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – opgaven.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – paragraaf.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – paragraaf.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – paragraaf.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1-review.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1-textbook-handoff.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1-textbook-plan.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_ex_1.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_ex_1.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_fig_1.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_fig_1.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_fig_2.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_fig_2.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_fig_3.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_fig_3.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_fig_4.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_fig_4.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_we_1.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_we_1.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/build_pdf.py
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2-textbook-plan.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3-t
...[truncated 3095 chars]
```

### stderr excerpt

```text

```
## node node_modules/jest/bin/jest.js --runInBand --runTestsByPath build-scripts/workflows/check-paragraph-lane-scope.test.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T15:42:16.608Z`
- finished_at: `2026-09-05T15:42:36.373Z`
- duration_ms: `19765`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `66593809b6f74a29b9cff1bf7935e50ab3ea2348d2190fbe06db6e2a2c3401e2`

### stdout excerpt

```text

```

### stderr excerpt

```text
Test Suites: 1 passed, 1 total
Tests:       27 passed, 27 total
Snapshots:   0 total
Time:        7.344 s
Ran all test suites within paths "build-scripts/workflows/check-paragraph-lane-scope.test.js".

```
## "C:\\Python314\\python.exe" build-scripts/content/book-2/212/test_source.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T15:47:21.442Z`
- finished_at: `2026-09-05T15:47:21.991Z`
- duration_ms: `549`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `1cdcbef91ef85765b2d6be85d1236db6b7b72ae479d3e37349c2025ea114bfed`

### stdout excerpt

```text

```

### stderr excerpt

```text
..........
----------------------------------------------------------------------
Ran 10 tests in 0.068s

OK

```
## "C:\\Python314\\python.exe" build-scripts/content/book-2/b2_212.py --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-root-rebuild-r5.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T15:47:22.046Z`
- finished_at: `2026-09-05T15:47:32.589Z`
- duration_ms: `10543`
- exit_code: `0`
- stdout_sha256: `a7900804c33dd23ea4a57d9ca086ec4383d0be13c7bd7842fb4deb76d63f191a`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.2
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{
  "paragraph": "2.1.2",
  "target_record_sha256": "19b466dd6f7b541a3bb701d4de80ce13fe9ea58356313e24b23b21698093e1f9",
  "plan_sha256": "5e1d318dd1b841467ca297d67956304d1861e3eb68d1df56cc4d32f6434d34a4",
  "chapter_sha256": "ef3f872f5caa2de1359639983d8e4907a34cfcbc80a0309826cff07201e49116",
  "input_sources": [
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\b2_212.py",
      "sha256": "34425535295be0ca88a01f0113bc282bf810e850ee678f9eb3dc1964786efc3a"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\print_pipeline.py",
      "sha256": "51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\212\\theory.md",
      "sha256": "06e5e35f2b2107197f46393ef07906eab009cf1ee6013c9f419fb33b9816b9ee"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\212\\exercises.md",
      "sha256": "06e25b424b9ff7d3ae124d4896c2df418ae4c71d3fdba89997ccc82b02e39fd9"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\212\\answers.md",
      "sha256": "c377d0d5209acc3fdc168a29d90ab525b5a8edd4d4b20b3adbac5423f8796cc4"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\212\\target-answers.md",
      "sha256": "085fcfa5599e53bb89b1dee386b9ce69983f6dfb330495822b4e73e46bf0a615"
    }
  ],
  "inspection_status": "PENDING",
  "documents": [
    {
      "source_md": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.2 Opbrengsten, winst en break-even\\2.1.2 Opbrengsten, winst en break-even \u2013 paragraaf.md",
      "source_sha256": "f53521ed8812a4c8b8c33c1d66b34e0afe8425c1dffb1723f37771372b2baa09",
      "source_html": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.2 Opbrengsten, winst en break-even\\2.1.2 Opbrengsten, winst en break-even \u2013 paragraaf.html",
      "html_sha256": "be9a3618444b65cc3aa5c2a33b94a81c5cbe864da7e7ea8fea63d746a60ef006",
      "source_pdf": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.2 Opbrengsten, winst en break-even\\2.1.2 Opbrengsten, winst en break-even \u2013 paragraaf.pdf",
      "pdf_sha256": "e94d42f66ab9966a3a024cfef061c2084fcc1e2a6ef9e61e50c699c9155ce7a2",
      "assets": [
        {
          "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.2 Opbrengsten, winst en break-even\\_assets\\2.1.2_fig_1.svg",
          "sha256": "6c82fc3ad6ee7a3232d18fff7aab9c42a57a52d01c61dc353452c9b50bd7f81b"
        },
        {
          "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.2 Opbrengsten, winst en break-even\\_assets\\2.1.2_fig_1.png",
          "sha256": "e0619fb4b4428f6fef46358908eeca81a846539a4ea40c8718edd7571e6aca02"
        },
        {
          "path": "C:\\wt\\book2-part-a-product
...[truncated 13025 chars]
```

### stderr excerpt

```text

```
## "C:\\Python314\\python.exe" build-scripts/content/book-2/221/test_source.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T15:47:32.635Z`
- finished_at: `2026-09-05T15:47:33.052Z`
- duration_ms: `417`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `e1f4453ed9ca5550b5f9dbbde0ad82a7dc54b65112ebdc1e69a7cd94b187b339`

### stdout excerpt

```text

```

### stderr excerpt

```text
..........
----------------------------------------------------------------------
Ran 10 tests in 0.038s

OK

```
## "C:\\Python314\\python.exe" build-scripts/content/book-2/b2_221.py --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-root-rebuild-r6.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T15:47:33.096Z`
- finished_at: `2026-09-05T15:47:38.529Z`
- duration_ms: `5433`
- exit_code: `0`
- stdout_sha256: `020f14cc90755f0dee4f45103047094c5563bc31de18c1dff28be0c96e9a45b5`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.1
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{
  "paragraph": "2.2.1",
  "target_record_sha256": "61b54bde03d60be241092479cfcea8820e8187220f8f454dc9fef5045c8ea288",
  "plan_sha256": "29096bdedced016376a5ddf8a22c973ec5d61e8ce4822f390c2b746becca3345",
  "chapter_sha256": "3a9db97518b1948eb0967d94653a10c693a0ca001e20b41503b864fd4cc7c2f7",
  "input_sources": [
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\b2_221.py",
      "sha256": "5102e16b5b86b0b6ec56a7b8ebfd4fcfbc36add33d11c90176ed8b4f39fcc56f"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\print_pipeline.py",
      "sha256": "51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\221\\theory.md",
      "sha256": "d5ee20513a9e2222f3003b3659c9d395a49a706a3fb4191eef501afa33eae5d5"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\221\\exercises.md",
      "sha256": "e5b37d2b3171a24da7bef24c82695c9ac469632039f4c310a09162653698e562"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\221\\answers.md",
      "sha256": "583e083e66cfdbd14aee442da7fab1c19aa3fc999dcfe53f63d965e291198c1a"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\221\\target-answers.md",
      "sha256": "59a17da108763172e5f590fca927a448fe12b07d5b5ff113b9ec7a82c80954b5"
    }
  ],
  "inspection_status": "PENDING",
  "documents": [
    {
      "source_md": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\2.2.1 Prijselasticiteit \u2013 paragraaf.md",
      "source_sha256": "e7e4287645c26c3b79406a556c05a4c90dd10e10e3605b409b89a123df7fa281",
      "source_html": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\2.2.1 Prijselasticiteit \u2013 paragraaf.html",
      "html_sha256": "f9da8b42643393549f5a936daf390f52285e452c2c879e3c29f1c2a48f8170ae",
      "source_pdf": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\2.2.1 Prijselasticiteit \u2013 paragraaf.pdf",
      "pdf_sha256": "aafd07e6bb88dcb8833569f2c4d01809d6fcdc0f879d0c7a39c810dfabdbc440",
      "assets": [
        {
          "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\_assets\\2.2.1_fig_1.svg",
          "sha256": "609c6ffad43818ad4c887d882bbd2bc4e1c23dc1dd0c41e50559e4fbc24ad8cb"
        },
        {
          "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\_assets\\2.2.1_fig_1.png",
          "sha256": "6f4009fe29fb88f442257e658fe6433809020ba824d17ee275a08701f37d0704"
        },
        {
          "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\_assets\\2.2.1_fig_2.svg",

...[truncated 3742 chars]
```

### stderr excerpt

```text

```
## "C:\\Python314\\python.exe" build-scripts/content/book-2/212/check_render.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T15:47:38.580Z`
- finished_at: `2026-09-05T15:47:40.306Z`
- duration_ms: `1726`
- exit_code: `0`
- stdout_sha256: `46d6ff88fea7de7eed43a86d0897ba3c16d2ed94543ea9da80feb89f0c857661`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "paragraph": "2.1.2",
  "automated_result": "PASS",
  "inspection_status": "NOT_SUPPLIED_BY_THIS_SCRIPT",
  "documents": [
    {
      "kind": "paragraaf",
      "pages": 14,
      "minimum_text_pt_including_footer": 12.0,
      "minimum_placed_figure_font_pt": 12.548030598958333,
      "images": 8,
      "pdf_sha256": "e94d42f66ab9966a3a024cfef061c2084fcc1e2a6ef9e61e50c699c9155ce7a2",
      "html_sha256": "be9a3618444b65cc3aa5c2a33b94a81c5cbe864da7e7ea8fea63d746a60ef006",
      "page_geometry_checks": [
        {
          "page": 1,
          "text_characters": 2167,
          "images": 0
        },
        {
          "page": 2,
          "text_characters": 675,
          "images": 1
        },
        {
          "page": 3,
          "text_characters": 967,
          "images": 0
        },
        {
          "page": 4,
          "text_characters": 897,
          "images": 1
        },
        {
          "page": 5,
          "text_characters": 781,
          "images": 1
        },
        {
          "page": 6,
          "text_characters": 1064,
          "images": 1
        },
        {
          "page": 7,
          "text_characters": 1733,
          "images": 0
        },
        {
          "page": 8,
          "text_characters": 840,
          "images": 1
        },
        {
          "page": 9,
          "text_characters": 1683,
          "images": 0
        },
        {
          "page": 10,
          "text_characters": 1256,
          "images": 1
        },
        {
          "page": 11,
          "text_characters": 1097,
          "images": 1
        },
        {
          "page": 12,
          "text_characters": 1355,
          "images": 0
        },
        {
          "page": 13,
          "text_characters": 829,
          "images": 0
        },
        {
          "page": 14,
          "text_characters": 1208,
          "images": 1
        }
      ]
    },
    {
      "kind": "opgaven",
      "pages": 7,
      "minimum_text_pt_including_footer": 12.0,
      "minimum_placed_figure_font_pt": 12.548030598958333,
      "images": 4,
      "pdf_sha256": "94ebe5d35207f6c605ca294a9e5bdccfa8c1a10e6717955e21abb3606a60406a",
      "html_sha256": "69e45f51c2c5690235e1d68f54dadf76818e190b9e10a96afbcfb50c2f71eb85",
      "page_geometry_checks": [
        {
          "page": 1,
          "text_characters": 1824,
          "images": 0
        },
        {
          "page": 2,
          "text_characters": 1025,
          "images": 1
        },
        {
          "page": 3,
          "text_characters": 1949,
          "images": 0
        },
        {
          "page": 4,
          "text_characters": 962,
          "images": 1
        },
        {
          "page": 5,
          "text_characters": 850,
          "images": 1
        },
        {
          "page": 6,
          "text_characters": 1774,
          "images": 0
        },
        {
          "page": 7,
          "text_characters": 1216,
          "images": 1
        }
      ]
    },
    {
      "kind": "antwoorden",
      "pages": 6,
      "minimum_text_pt_including_footer": 12.0,
      "minimum_placed_figure_font_pt": 18.8220458984375,
      "images": 3,
      "pdf_sha256": "07a75d7b5b69344d38d5da9e5f2e0a3b964d86cc64c383b37809f8263fb33192",
      "html_sha256": "767bf8ee21be2b67676e0a80558d7bbe373cc7cab8c8ac0c96a0056f7228f221",
      "page_geometry_checks": [
        {
          "page": 1,
          "text_characters": 2019,
          "images": 0
        },
        {
          "page": 2,
          "text_characters": 959,
          "images": 1
        },
        {
          "page": 3,
          "text_characters": 1708,
          "images": 0
        },
        {
          "page": 4,
          "text_characters": 1345,
          "images": 1
        },
        {
          "page": 5,
          "text_characte
...[truncated 462 chars]
```

### stderr excerpt

```text

```
## "C:\\Python314\\python.exe" build-scripts/content/book-2/221/check_render.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T15:47:40.353Z`
- finished_at: `2026-09-05T15:47:41.124Z`
- duration_ms: `771`
- exit_code: `0`
- stdout_sha256: `d56b1a0553763bb6ee8251c598f4f3ee1ff1353049c7600fee4cbb3af0e0c12c`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "paragraph": "2.2.1",
  "visual_acceptance": "NOT_SUPPLIED_BY_THIS_SCRIPT",
  "automated_status": "PASS",
  "documents": [
    {
      "kind": "paragraaf",
      "pdf_sha256": "aafd07e6bb88dcb8833569f2c4d01809d6fcdc0f879d0c7a39c810dfabdbc440",
      "pages": 10,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": 12.221,
      "proof_directory": "C:\\wt\\book2-221-production-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\221-paragraaf-aafd07e6bb88-r6",
      "all_page_hashes_match": true
    },
    {
      "kind": "opgaven",
      "pdf_sha256": "e9def67106ce56f06ff5247bb3d56fe17dcd4297e65ab95ba6942453759761ee",
      "pages": 6,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": 12.221,
      "proof_directory": "C:\\wt\\book2-221-production-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\221-opgaven-e9def67106ce-r6",
      "all_page_hashes_match": true
    },
    {
      "kind": "antwoorden",
      "pdf_sha256": "d4a7c139d49276e80c23f4eda1cfab7841d063b204d7a9bb70cd225a796e5b5d",
      "pages": 4,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": null,
      "proof_directory": "C:\\wt\\book2-221-production-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\221-antwoorden-d4a7c139d492-r6",
      "all_page_hashes_match": true
    }
  ],
  "checks": [
    "exact frozen goals/context/a-d/3+2+2+2points/short answers",
    "one exercise HTML definition in both editions",
    "no leaked fences or active resources",
    "every printed text/font and placed figure label meets12pt floor",
    "all assets and all rendered page hashes fresh; manifests honestly pending"
  ]
}


```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-plan.js reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-plan.md

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T16:18:09.701Z`
- finished_at: `2026-09-05T16:18:09.795Z`
- duration_ms: `94`
- exit_code: `0`
- stdout_sha256: `f36649c10e9879f3cceca6cc9d020d6275032b0f7f505d4f7ecf4e7635d67e87`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint plan: reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-plan.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js BOOK2-TEXTBOOK-PRODUCTION-1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T16:18:09.839Z`
- finished_at: `2026-09-05T16:18:10.003Z`
- duration_ms: `164`
- exit_code: `0`
- stdout_sha256: `699bba7f2550eced00884bc621132de46fe5608c6b1baf7757bd06afbdbe896d`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: BOOK2-TEXTBOOK-PRODUCTION-1 planned/active

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --cwd ../4veco-lessen --lane textbook --base origin/main --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T16:18:10.047Z`
- finished_at: `2026-09-05T16:18:10.189Z`
- duration_ms: `142`
- exit_code: `0`
- stdout_sha256: `83b4176a7a8b9702e896b5db9806a5624b055495422d45239797fc9f4416d8d6`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 84
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – antwoorden.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – antwoorden.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – antwoorden.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – opgaven.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – opgaven.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – opgaven.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – paragraaf.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – paragraaf.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – paragraaf.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1-review.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1-textbook-handoff.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1-textbook-plan.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_ex_1.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_ex_1.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_fig_1.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_fig_1.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_fig_2.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_fig_2.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_fig_3.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_fig_3.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_fig_4.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_fig_4.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_we_1.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_we_1.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/build_pdf.py
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – antwoorden.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, wi
...[truncated 8933 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T16:20:17.415Z`
- finished_at: `2026-09-05T16:20:19.555Z`
- duration_ms: `2140`
- exit_code: `0`
- stdout_sha256: `15d04f485b29072d4e5de572b6c4a351847ecdcbb8a7157ad9576e854d0de1a5`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T16:20:19.613Z`
- finished_at: `2026-09-05T16:20:20.239Z`
- duration_ms: `626`
- exit_code: `0`
- stdout_sha256: `ca7764da243c9b491670418ecc8585edfb9d1edc93a3f5078e1bf8cade732ebc`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard

```

### stderr excerpt

```text

```
## npm.cmd test -- --runInBand

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T16:24:34.888Z`
- finished_at: `2026-09-05T16:32:11.198Z`
- duration_ms: `456310`
- exit_code: `0`
- stdout_sha256: `18fa34aca6face4ceb5d841bce119e012c5c97c0248a3fc22be306e01bfa6d3b`
- stderr_sha256: `c8a67778c17889f485618741b1df4de84c8ddb40be448aeee15c9d70497ac057`

### stdout excerpt

```text

> 4veco-platform@1.0.0 test
> jest --runInBand


```

### stderr excerpt

```text
Cannot parse chapter folder name: bad-name
Expected format: "X.Y Hoofdstuk Name"
  ⚠ Orphaned asset: 9.9.1_fig_1.svg
  ✗ MISSING review report (X.Y.Z-review.md)
  ⚠ No _chapter-plan.md
  ⚠ Orphaned asset: 9.9.1_fig_1.svg
  ✗ quality_ref reports missing assets: 9.9.1-quality-ref.yaml
  ⚠ No _chapter-plan.md
  ⚠ Orphaned asset: 9.9.1_fig_1.svg
  ✗ Part A review verdict is FAIL: 9.9.1-review.md
  ⚠ No _chapter-plan.md
  ⚠ Orphaned asset: 9.9.1_fig_1.svg
  ⚠ No _chapter-plan.md
  ✗ Non-compliant asset name: B9C9S1_fig_1.svg (must match X.Y.Z_{type}_{number}.ext)
  ✗ Asset prefix mismatch: B9C9S1_fig_1.svg does not start with 9.9.1_
  ✗ Non-compliant asset name: B9C9S1_fig_1.png (must match X.Y.Z_{type}_{number}.ext)
  ✗ Asset prefix mismatch: B9C9S1_fig_1.png does not start with 9.9.1_
  ⚠ No _chapter-plan.md
  ✗ Chapter asset wrong prefix: B9C9S1_fig_1.png (expected 9.9.*)
  ✗ Chapter asset wrong prefix: B9C9S1_fig_1.svg (expected 9.9.*)
  ⚠ No _chapter-plan.md
  ✗ Chapter aggregate asset differs from paragraph source: 9.9.1_fig_1.svg
  ⚠ Orphaned asset: 9.5.1_fig_1.svg
  ⚠ Orphaned asset: 9.5.1_mc_1.svg
  ⚠ No _chapter-plan.md
  ⚠ Orphaned asset: 9.5.4_fig_1.svg
  ⚠ No _chapter-plan.md
  ✗ MISSING toetsmatrijs.md
  ✗ Expected 3 PDFs, found 2
  ⚠ Orphaned asset: 9.5.4_fig_1.svg
  ⚠ No _chapter-plan.md
  ✗ MISSING samenvatting.md
  ✗ Expected 2 PDFs, found 1
  ⚠ Orphaned asset: 9.5.1_fig_1.svg
  ⚠ No _chapter-plan.md
  ⚠ Orphaned asset: 9.5.1_mc_1.svg
  ⚠ No _chapter-plan.md
  ⚠ Orphaned asset: 9.9.4_ex_1.svg
  ⚠ No _chapter-plan.md

Test Suites: 6 skipped, 110 passed, 110 of 116 total
Tests:       8 skipped, 1872 passed, 1880 total
Snapshots:   0 total
Time:        455.386 s
Ran all test suites.

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.1.2

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T16:42:11.386Z`
- finished_at: `2026-09-05T16:42:13.575Z`
- duration_ms: `2189`
- exit_code: `0`
- stdout_sha256: `436ef043a9db2fbcc091f49bcb00a0f4247450f7a7d48882bd5a2495677c1691`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.2

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.2.1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T16:42:13.633Z`
- finished_at: `2026-09-05T16:42:15.782Z`
- duration_ms: `2149`
- exit_code: `0`
- stdout_sha256: `22e6d7011adc86ff0a4c90a5788d18f685df79c7a434e74f5bebe4f4bac25692`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.1

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T16:42:15.824Z`
- finished_at: `2026-09-05T16:42:16.378Z`
- duration_ms: `554`
- exit_code: `0`
- stdout_sha256: `ca7764da243c9b491670418ecc8585edfb9d1edc93a3f5078e1bf8cade732ebc`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard

```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/223/test_source.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T17:48:39.213Z`
- finished_at: `2026-09-05T17:48:39.685Z`
- duration_ms: `472`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `980d70e0b97b819ff7c7e2171d8605a09245f287cda76fab272f8c1e5dbeb0a6`

### stdout excerpt

```text

```

### stderr excerpt

```text
.......
----------------------------------------------------------------------
Ran 7 tests in 0.014s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/b2_223.py --lesson-root ../4veco-lessen --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-root-rebuild-r3.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T17:48:39.729Z`
- finished_at: `2026-09-05T17:48:45.645Z`
- duration_ms: `5916`
- exit_code: `1`
- stdout_sha256: `de21d17d94c7a65f403fc334ba1dad932f5cf6545dbe5d5b5d5bf488b3701c4e`
- stderr_sha256: `e32b38f33c607ca7df090746dc9923909e854780c8e9aa0f2771ac736bd348a6`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.3
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard

```

### stderr excerpt

```text
Traceback (most recent call last):
  File "C:\wt\book2-part-a-production-20260905\4veco-platform\build-scripts\content\book-2\b2_223.py", line 284, in <module>
    main()
    ~~~~^^
  File "C:\wt\book2-part-a-production-20260905\4veco-platform\build-scripts\content\book-2\b2_223.py", line 276, in main
    result = build(args.lesson_root, args.proof_root, sources_only=args.sources_only, proof_suffix=args.proof_suffix)
  File "C:\wt\book2-part-a-production-20260905\4veco-platform\build-scripts\content\book-2\b2_223.py", line 252, in build
    built = build_document(path)
  File "C:\wt\book2-part-a-production-20260905\4veco-platform\build-scripts\content\book-2\print_pipeline.py", line 237, in build_document
    html_path.write_bytes(html_bytes)
    ~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^
  File "C:\Python314\Lib\pathlib\__init__.py", line 796, in write_bytes
    with self.open(mode='wb') as f:
         ~~~~~~~~~^^^^^^^^^^^
  File "C:\Python314\Lib\pathlib\__init__.py", line 771, in open
    return io.open(self, mode, buffering, encoding, errors, newline)
           ~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
FileNotFoundError: [Errno 2] No such file or directory: 'C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit\\2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit � paragraaf.html'

```
## C:/Python314/python.exe build-scripts/content/book-2/b2_223.py --lesson-root "\\\\?\\C:\\wt\\book2-part-a-production-20260905\\4veco-lessen" --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-root-rebuild-r3.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T17:49:28.163Z`
- finished_at: `2026-09-05T17:49:37.253Z`
- duration_ms: `9090`
- exit_code: `0`
- stdout_sha256: `0f044878343521872f70ddc5735a9d59cf9cbdb5dc433fee10b60d610de86407`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.3
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{
  "paragraph": "2.2.3",
  "target_record_sha256": "9a3a29bcedc16739b74b66b2bb8e136b37e86c7f5cfee3ee35ea37c4bdeed1c5",
  "plan_sha256": "dd2f91d0035829986076b7d5e96b43fa9c45f3d3698da1d159a955634fa01497",
  "chapter_sha256": "3a9db97518b1948eb0967d94653a10c693a0ca001e20b41503b864fd4cc7c2f7",
  "accepted_221_lf_pins": {
    "2.2.1-textbook-handoff.md": "216e139a6297b59cfb8e62f43eb3a79eb16efc1861e5fc989ad15562a4deb24c",
    "2.2.1-review.md": "24995a4d0e5d82327434be1dd94c789275728bdce840c6a7b5d63b59035258eb",
    "2.2.1-quality-ref.yaml": "b6f1b389d11c20665577414c17e5ae49962083812d9d1bf474d16231db749508",
    "2.2.1 Prijselasticiteit \u2013 paragraaf.md": "e7e4287645c26c3b79406a556c05a4c90dd10e10e3605b409b89a123df7fa281"
  },
  "input_sources": [
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\b2_223.py",
      "sha256": "4eb2760f56d6e39e2d1b5412517e06e65ba5e06553d2edbcc5087df723c770c4"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\print_pipeline.py",
      "sha256": "51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\223\\theory.md",
      "sha256": "8835a4d94097bff54aaf2f58308f4adbd7ac49005aee443f352fcecdb9a38048"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\223\\exercises.md",
      "sha256": "0a7a48bdb65bd0182c757e3af4edc734327d953319df422fe852648ae9823d1c"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\223\\answers.md",
      "sha256": "d68a20c6e494430327c583ba097e28902b32b29599fec9d775e8b1e5a6bf72cc"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\223\\target-answers.md",
      "sha256": "f122a7109e59dbb2ee80201e30002f846356a97fa7286d11abfaf8b496e14996"
    }
  ],
  "inspection_status": "PENDING",
  "documents": [
    {
      "source_md": "\\\\?\\C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit\\2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit \u2013 paragraaf.md",
      "source_sha256": "062b78d54c064e6dbb3765b8da77575da50fedcde6777551e10fb5842a14ebac",
      "source_html": "\\\\?\\C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit\\2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit \u2013 paragraaf.html",
      "html_sha256": "258bae1f6e974376a3b43230e3c894ec60450f5a6b9b37d98bda8f0cfe0cf996",
      "source_pdf": "\\\\?\\C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit\\2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit \u2013 paragraaf.pdf",
      "pdf_sha256": "88020dbfa6b7c0d235bc294d0cc43754679258363445805925688c028296f5bb",
      "assets": [
        {
          "path": "\\\\?\\C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.3 Inkomenselasticiteit en k
...[truncated 7023 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/b2_223.py --lesson-root "\\\\?\\C:\\wt\\book2-part-a-production-20260905\\4veco-lessen" --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-root-rebuild-r3-msys.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T17:50:09.069Z`
- finished_at: `2026-09-05T17:50:16.140Z`
- duration_ms: `7071`
- exit_code: `0`
- stdout_sha256: `1dd5ef2449141a547aa3b8146033e2d9a9f43280431183d1f486e4fec2fecba8`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.3
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{
  "paragraph": "2.2.3",
  "target_record_sha256": "9a3a29bcedc16739b74b66b2bb8e136b37e86c7f5cfee3ee35ea37c4bdeed1c5",
  "plan_sha256": "dd2f91d0035829986076b7d5e96b43fa9c45f3d3698da1d159a955634fa01497",
  "chapter_sha256": "3a9db97518b1948eb0967d94653a10c693a0ca001e20b41503b864fd4cc7c2f7",
  "accepted_221_lf_pins": {
    "2.2.1-textbook-handoff.md": "216e139a6297b59cfb8e62f43eb3a79eb16efc1861e5fc989ad15562a4deb24c",
    "2.2.1-review.md": "24995a4d0e5d82327434be1dd94c789275728bdce840c6a7b5d63b59035258eb",
    "2.2.1-quality-ref.yaml": "b6f1b389d11c20665577414c17e5ae49962083812d9d1bf474d16231db749508",
    "2.2.1 Prijselasticiteit \u2013 paragraaf.md": "e7e4287645c26c3b79406a556c05a4c90dd10e10e3605b409b89a123df7fa281"
  },
  "input_sources": [
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\b2_223.py",
      "sha256": "4eb2760f56d6e39e2d1b5412517e06e65ba5e06553d2edbcc5087df723c770c4"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\print_pipeline.py",
      "sha256": "51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\223\\theory.md",
      "sha256": "8835a4d94097bff54aaf2f58308f4adbd7ac49005aee443f352fcecdb9a38048"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\223\\exercises.md",
      "sha256": "0a7a48bdb65bd0182c757e3af4edc734327d953319df422fe852648ae9823d1c"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\223\\answers.md",
      "sha256": "d68a20c6e494430327c583ba097e28902b32b29599fec9d775e8b1e5a6bf72cc"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\223\\target-answers.md",
      "sha256": "f122a7109e59dbb2ee80201e30002f846356a97fa7286d11abfaf8b496e14996"
    }
  ],
  "inspection_status": "PENDING",
  "documents": [
    {
      "source_md": "\\\\?\\C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit\\2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit \u2013 paragraaf.md",
      "source_sha256": "062b78d54c064e6dbb3765b8da77575da50fedcde6777551e10fb5842a14ebac",
      "source_html": "\\\\?\\C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit\\2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit \u2013 paragraaf.html",
      "html_sha256": "3b1725338d2cdb16edf616da76516b699d97055cf74cdfaca076eeaf94f2cc08",
      "source_pdf": "\\\\?\\C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit\\2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit \u2013 paragraaf.pdf",
      "pdf_sha256": "ca27f8bd6cbb3b596e5621280d76631c5561134e9e53c3556725c313fdf8aecb",
      "assets": [
        {
          "path": "\\\\?\\C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.3 Inkomenselasticiteit en k
...[truncated 7023 chars]
```

### stderr excerpt

```text

```
## node ../4veco-lessen/scripts/validate-paragraph.js --paragraph 2.2.3 --mode part-a --profile student-web

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T17:51:57.884Z`
- finished_at: `2026-09-05T17:51:57.972Z`
- duration_ms: `88`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `eecd688dd12211745b5fcac6c7ac5ceb2446894e244741f39f57e6ad00f7641d`

### stdout excerpt

```text

```

### stderr excerpt

```text
node:internal/modules/cjs/loader:1451
  throw err;
  ^

Error: Cannot find module 'C:\wt\book2-part-a-production-20260905\4veco-lessen\scripts\validate-paragraph.js'
    at Module._resolveFilename (node:internal/modules/cjs/loader:1448:15)
    at defaultResolveImpl (node:internal/modules/cjs/loader:1059:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1064:22)
    at Module._load (node:internal/modules/cjs/loader:1234:25)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
    at node:internal/main/run_main_module:33:47 {
  code: 'MODULE_NOT_FOUND',
  requireStack: []
}

Node.js v24.13.1

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit"

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:00:19.361Z`
- finished_at: `2026-09-05T18:00:19.427Z`
- duration_ms: `66`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `ecade51e3156d6270b753199aeebe4a91ca38cd4e97bcd2817cbdadb6f9dfcd5`

### stdout excerpt

```text

```

### stderr excerpt

```text
Unexpected argument: 2
Usage: node scripts/validate-paragraph.js [--mode auto|part-a|part-b|complete] [--profile student-web|legacy-full|office|publisher-print] <paragraph-folder-path>

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:00:45.423Z`
- finished_at: `2026-09-05T18:00:45.534Z`
- duration_ms: `111`
- exit_code: `0`
- stdout_sha256: `45d1a2467069a69b9207c58bb2732b19b684e3b7d76cd9bba498410961d0791f`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.2.3 "Inkomenselasticiteit en kruiselingse elasticiteit"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – paragraaf.md
  OK opgaven.md: 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – opgaven.md
  OK antwoorden.md: 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – antwoorden.md
  OK 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – paragraaf.html (768.2 KB)
  OK 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – opgaven.html (246.7 KB)
  OK 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – antwoorden.html (16.3 KB)
  OK 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – paragraaf.pdf (590 KB)
  OK 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – opgaven.pdf (203 KB)
  OK 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – antwoorden.pdf (28 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 4 image refs all resolve
  OK _assets/: 4 SVGs, 4 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.2.3-review.md (verdict PASS)
  OK Quality ref: 2.2.3-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.2.3 "Inkomenselasticiteit en kruiselingse elasticiteit" PASSED all checks.


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:00:45.594Z`
- finished_at: `2026-09-05T18:00:45.685Z`
- duration_ms: `91`
- exit_code: `0`
- stdout_sha256: `a145b49f4c558e8653eadc5d2e5c1c021cabdd2338d833d5c9b4c5f19eb8dbad`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.2.3 "Inkomenselasticiteit en kruiselingse elasticiteit"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – paragraaf.md
  OK opgaven.md: 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – opgaven.md
  OK antwoorden.md: 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – antwoorden.md
  OK 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – paragraaf.pdf (590 KB)
  OK 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – opgaven.pdf (203 KB)
  OK 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – antwoorden.pdf (28 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 4 image refs all resolve
  OK _assets/: 4 SVGs, 4 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.2.3-review.md (verdict PASS)
  OK Quality ref: 2.2.3-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.2.3 "Inkomenselasticiteit en kruiselingse elasticiteit" PASSED all checks.


```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.2.3

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:01:58.327Z`
- finished_at: `2026-09-05T18:02:00.000Z`
- duration_ms: `1673`
- exit_code: `0`
- stdout_sha256: `f2edc181a31a887b06085b9665804897dfbcdb3c974cf7e92ce34ee80801f822`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.3

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:02:00.046Z`
- finished_at: `2026-09-05T18:02:00.591Z`
- duration_ms: `545`
- exit_code: `0`
- stdout_sha256: `ca7764da243c9b491670418ecc8585edfb9d1edc93a3f5078e1bf8cade732ebc`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base 92862e370fd997634aa505c24b74c773c05039f4 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:02:00.631Z`
- finished_at: `2026-09-05T18:02:00.715Z`
- duration_ms: `84`
- exit_code: `0`
- stdout_sha256: `b11f71b004d8dd3c1fde6d9ba27c46006a759d1a1631b93826e5349429fcd06c`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 7
  - build-scripts/content/book-2/223/answers.md
  - build-scripts/content/book-2/223/check_render.py
  - build-scripts/content/book-2/223/exercises.md
  - build-scripts/content/book-2/223/target-answers.md
  - build-scripts/content/book-2/223/test_source.py
  - build-scripts/content/book-2/223/theory.md
  - build-scripts/content/book-2/b2_223.py
- review evidence: 43
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-antwoorden-30cd682358c5-r3/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-antwoorden-30cd682358c5-r3/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-antwoorden-30cd682358c5-r3/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-antwoorden-30cd682358c5-r3/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-antwoorden-30cd682358c5-r3/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-antwoorden-30cd682358c5-r3/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-antwoorden-30cd682358c5-r3/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-antwoorden-30cd682358c5-r3/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-antwoorden-30cd682358c5-r3/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-opgaven-50cf2bbeaa19-r3/pages/page-010.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/pages/page-010.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-ca27f8bd6cbb-r3/pages/page-011.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-paragraaf-c
...[truncated 693 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base abe73479d900c1c3dd4cccb9c568305eb58c7a18 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:02:00.754Z`
- finished_at: `2026-09-05T18:02:00.846Z`
- duration_ms: `92`
- exit_code: `0`
- stdout_sha256: `31b744f5ee0f7651ed534a7272d194f0ed3a3621c7ee7dd91fad7a8d3e4f9f14`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 21
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – antwoorden.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – antwoorden.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – antwoorden.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – antwoorden.zip
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – opgaven.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – opgaven.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – opgaven.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – opgaven.zip
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – paragraaf.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – paragraaf.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – paragraaf.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – paragraaf.zip
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/_assets/2.2.3_fig_1.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/_assets/2.2.3_fig_1.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/_assets/2.2.3_fig_2.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/_assets/2.2.3_fig_2.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/_assets/2.2.3_fig_3.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/_assets/2.2.3_fig_3.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/_assets/2.2.3_fig_4.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/_assets/2.2.3_fig_4.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofds
...[truncated 86 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/222/test_source.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:06:48.537Z`
- finished_at: `2026-09-05T18:06:49.327Z`
- duration_ms: `790`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `691660bd5122409151caf09996615822cea472a559d55ff79c047003a5a824b7`

### stdout excerpt

```text

```

### stderr excerpt

```text
...........
----------------------------------------------------------------------
Ran 11 tests in 0.298s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/222/check_render.py --rebuild --output reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-root-render-check-r12.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:06:49.373Z`
- finished_at: `2026-09-05T18:06:56.966Z`
- duration_ms: `7593`
- exit_code: `1`
- stdout_sha256: `c0519c4117d841b433a2f111811475da24172dd55e75e8e222306dff65070657`
- stderr_sha256: `615b3d4b2c27f9df11165eea6a658f56ee51cfbdfdcd52f80aed42f43386f51f`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.2
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard

```

### stderr excerpt

```text
Traceback (most recent call last):
  File "C:\wt\book2-part-a-production-20260905\4veco-platform\build-scripts\content\book-2\222\check_render.py", line 159, in <module>
    result = inspect(args.lesson_root, args.manifest, args.rebuild)
  File "C:\wt\book2-part-a-production-20260905\4veco-platform\build-scripts\content\book-2\222\check_render.py", line 143, in inspect
    assert before[field] == after[field], ('non-identical rebuild', field)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: ('non-identical rebuild', 'html_sha256')

```
## C:/Python314/python.exe build-scripts/content/book-2/b2_222.py --lesson-root ../4veco-lessen --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-root-rebuild-r12.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:07:14.263Z`
- finished_at: `2026-09-05T18:07:20.033Z`
- duration_ms: `5770`
- exit_code: `0`
- stdout_sha256: `00f761dbe1c13a8067e68c7c26669759bd9ea23f58fc3013ff1e772147c2530e`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.2
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{
  "paragraph": "2.2.2",
  "target_record_sha256": "8ce56143aef61b0e67aae5b179f6e5f3fe547192bc776a42c43101cb5a70fa2e",
  "plan_sha256": "6418491d45c43afdbd272c581bab12f8436ca1a84241663ba300e31b790825a8",
  "chapter_sha256": "3a9db97518b1948eb0967d94653a10c693a0ca001e20b41503b864fd4cc7c2f7",
  "input_sources": [
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\b2_222.py",
      "sha256": "42012511d3c77569f4aa6c30df6465eb77c8d204d8596a14a16ef453446bcafe"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\print_pipeline.py",
      "sha256": "51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\222\\theory.md",
      "sha256": "0c68b499e315644e3518df743d793917882b45fdef9c83b2949d6939a0d8bbee"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\222\\exercises.md",
      "sha256": "961e0bbd1607920a085bddf82b556cd1083fc4bb6f7241324ad2d20ae5f7cc26"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\222\\answers.md",
      "sha256": "ab186995c8e92772751f66fae30d9db2202d23d5bb06181b70bb073ce2c0cadb"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\222\\target-answers.md",
      "sha256": "40ae9de6c220e0d2bde4b6771ea0807b5544be2506f724a0c2a566562be386fe"
    }
  ],
  "inspection_status": "PENDING",
  "documents": [
    {
      "source_md": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.2 Elasticiteit en omzet\\2.2.2 Elasticiteit en omzet \u2013 paragraaf.md",
      "source_sha256": "a46510e08b516daca029504a25d9a710c99f16d583de64221b86e5ff6374e83c",
      "source_html": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.2 Elasticiteit en omzet\\2.2.2 Elasticiteit en omzet \u2013 paragraaf.html",
      "html_sha256": "1189050643f3728df42ed07b820a66eb0b1ae85e2b411c33332a622670a99c5e",
      "source_pdf": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.2 Elasticiteit en omzet\\2.2.2 Elasticiteit en omzet \u2013 paragraaf.pdf",
      "pdf_sha256": "36feb7873637d0e71af50d4930a789e3a8ada6ec77cc377b09e2af179c3ae98c",
      "assets": [
        {
          "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.2 Elasticiteit en omzet\\_assets\\2.2.2_fig_1.svg",
          "sha256": "a0aa6c793a59a731377d8b035b5a96fc8c064c61745843326947c6f4b95440c0"
        },
        {
          "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.2 Elasticiteit en omzet\\_assets\\2.2.2_fig_1.png",
          "sha256": "bd9668804b5d22b9fe6d6fe8832376b4f8ba978c8042fb38d6e18fb1d88cd07e"
        },
        {
          "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.2 Elasticiteit en
...[truncated 4498 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/222/check_render.py --rebuild --output reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-root-render-check-r12.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:07:20.077Z`
- finished_at: `2026-09-05T18:07:26.411Z`
- duration_ms: `6334`
- exit_code: `0`
- stdout_sha256: `6eb63b2279634517b4b0b6d198c94d7e910e2d29fca11c4aacbc9c7911e50dd0`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.2
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{
  "paragraph": "2.2.2",
  "visual_acceptance": "NOT_SUPPLIED_BY_THIS_SCRIPT",
  "automated_status": "PASS",
  "documents": [
    {
      "kind": "paragraaf",
      "pdf_sha256": "36feb7873637d0e71af50d4930a789e3a8ada6ec77cc377b09e2af179c3ae98c",
      "pages": 10,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": 14.378,
      "proof_directory": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\222-paragraaf-36feb7873637-r12",
      "all_page_hashes_match": true
    },
    {
      "kind": "opgaven",
      "pdf_sha256": "0a251a4973b1b9b0c4abca30310a3e0bda888558e079fd4895319fc496614555",
      "pages": 6,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": 14.378,
      "proof_directory": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\222-opgaven-0a251a4973b1-r12",
      "all_page_hashes_match": true
    },
    {
      "kind": "antwoorden",
      "pdf_sha256": "b68d0429a9d739d0587f7a1c95ca922e188061b4821920b1d0f6459766adc6ab",
      "pages": 5,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": null,
      "proof_directory": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\222-antwoorden-b68d0429a9d7-r12",
      "all_page_hashes_match": true
    }
  ],
  "byte_identical_rebuild": true,
  "checks": [
    "exact frozen goals/context/a-f/2+2+2+2+2+1points/short answers",
    "one exercise HTML definition in both editions",
    "no leaked fences or active resources",
    "every printed text/font and placed figure label meets12pt floor",
    "all assets and all rendered page hashes fresh; manifests honestly pending"
  ]
}


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:08:15.987Z`
- finished_at: `2026-09-05T18:08:16.048Z`
- duration_ms: `61`
- exit_code: `0`
- stdout_sha256: `040d1d917c0e94609fb9e7d73bbeabefe795c4221f4e894ffbe661e296961d21`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.2.2 "Elasticiteit en omzet"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.2 Elasticiteit en omzet
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.2.2 Elasticiteit en omzet – paragraaf.md
  OK opgaven.md: 2.2.2 Elasticiteit en omzet – opgaven.md
  OK antwoorden.md: 2.2.2 Elasticiteit en omzet – antwoorden.md
  OK 2.2.2 Elasticiteit en omzet – paragraaf.html (400.9 KB)
  OK 2.2.2 Elasticiteit en omzet – opgaven.html (140.1 KB)
  OK 2.2.2 Elasticiteit en omzet – antwoorden.html (16.6 KB)
  OK 2.2.2 Elasticiteit en omzet – paragraaf.pdf (313 KB)
  OK 2.2.2 Elasticiteit en omzet – opgaven.pdf (119 KB)
  OK 2.2.2 Elasticiteit en omzet – antwoorden.pdf (26 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 4 image refs all resolve
  OK _assets/: 4 SVGs, 4 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.2.2-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.2.2-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.2.2 "Elasticiteit en omzet" PASSED all checks.


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:08:16.089Z`
- finished_at: `2026-09-05T18:08:16.163Z`
- duration_ms: `74`
- exit_code: `0`
- stdout_sha256: `9b22c97f888573b97769294368390ceecd914985baec73c3cc6452228a85d0f3`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.2.2 "Elasticiteit en omzet"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.2 Elasticiteit en omzet
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.2.2 Elasticiteit en omzet – paragraaf.md
  OK opgaven.md: 2.2.2 Elasticiteit en omzet – opgaven.md
  OK antwoorden.md: 2.2.2 Elasticiteit en omzet – antwoorden.md
  OK 2.2.2 Elasticiteit en omzet – paragraaf.pdf (313 KB)
  OK 2.2.2 Elasticiteit en omzet – opgaven.pdf (119 KB)
  OK 2.2.2 Elasticiteit en omzet – antwoorden.pdf (26 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 4 image refs all resolve
  OK _assets/: 4 SVGs, 4 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.2.2-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.2.2-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.2.2 "Elasticiteit en omzet" PASSED all checks.


```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base 33e6310d4d08fd37e8c3b89bbae7a9ed21476bbe --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:08:56.693Z`
- finished_at: `2026-09-05T18:08:56.848Z`
- duration_ms: `155`
- exit_code: `0`
- stdout_sha256: `fd789087931f18bee7ba7da11612c9b0208b4a879cacd0e319b52c48a665966d`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 7
  - build-scripts/content/book-2/222/answers.md
  - build-scripts/content/book-2/222/check_render.py
  - build-scripts/content/book-2/222/exercises.md
  - build-scripts/content/book-2/222/target-answers.md
  - build-scripts/content/book-2/222/test_source.py
  - build-scripts/content/book-2/222/theory.md
  - build-scripts/content/book-2/b2_222.py
- review evidence: 358
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r3/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r3/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r3/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r3/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r3/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r3/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r3/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r4/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r4/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r4/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r4/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r4/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r4/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r4/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r5/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r5/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r5/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r5/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r5/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r5/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r5/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r6/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r6/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r6/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r6/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r6/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r6/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r6/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/222-antwoorden-37a4f5017eab-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2
...[truncated 32660 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base 1146bd026cc1652bf3c389ca78e10fec34361ab5 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:08:56.908Z`
- finished_at: `2026-09-05T18:08:57.019Z`
- duration_ms: `111`
- exit_code: `0`
- stdout_sha256: `3e7026643361f946eb4af5d444633f0b85b8113eeb46bbdb37e553263fcb8efa`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 18
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – antwoorden.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – antwoorden.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – antwoorden.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – opgaven.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – opgaven.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – opgaven.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – paragraaf.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – paragraaf.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – paragraaf.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/_assets/2.2.2_fig_1.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/_assets/2.2.2_fig_1.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/_assets/2.2.2_fig_2.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/_assets/2.2.2_fig_2.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/_assets/2.2.2_fig_3.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/_assets/2.2.2_fig_3.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/_assets/2.2.2_we_1.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/_assets/2.2.2_we_1.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/build_pdf.py

```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/213/test_source.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:14:27.592Z`
- finished_at: `2026-09-05T18:14:28.182Z`
- duration_ms: `590`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `ae2773adcba0c21df2d2b4b464d194d8355d9163df01431392586428b9b85df4`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_altered_target_fails_closed (__main__.SourceTests.test_altered_target_fails_closed) ... ok
test_bad_prerequisite_stops_before_process_or_output_write (__main__.SourceTests.test_bad_prerequisite_stops_before_process_or_output_write) ... ok
test_common_exercise_source_and_no_live_or_timing_copy (__main__.SourceTests.test_common_exercise_source_and_no_live_or_timing_copy) ... ok
test_discrete_arithmetic_all_cases (__main__.SourceTests.test_discrete_arithmetic_all_cases) ... ok
test_exact_seven_exercise_headings (__main__.SourceTests.test_exact_seven_exercise_headings) ... ok
test_formula_totals_independently (__main__.SourceTests.test_formula_totals_independently) ... ok
test_frozen_target_and_native_cells (__main__.SourceTests.test_frozen_target_and_native_cells) ... ok
test_initial_and_completed_tables_match_case_values (__main__.SourceTests.test_initial_and_completed_tables_match_case_values) ... ok
test_retrieval_combination_and_unequal_intervals (__main__.SourceTests.test_retrieval_combination_and_unequal_intervals) ... ok
test_six_assets_safe_geometry_large_type (__main__.SourceTests.test_six_assets_safe_geometry_large_type) ... ok

----------------------------------------------------------------------
Ran 10 tests in 0.089s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/213/check_render.py reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-root-render-check-r5.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:14:28.227Z`
- finished_at: `2026-09-05T18:14:37.979Z`
- duration_ms: `9752`
- exit_code: `0`
- stdout_sha256: `42defb673528207d4ce5f1d11e94a020d85d2fed951601680c7f7f3feeec4515`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "paragraph": "2.1.3",
  "automated_result": "PASS",
  "inspection_status": "NOT_SUPPLIED_BY_THIS_SCRIPT",
  "documents": [
    {
      "kind": "paragraaf",
      "pages": 14,
      "minimum_text_pt_including_footer": 12.0,
      "minimum_placed_figure_font_pt": 15.685038248697916,
      "images": 6,
      "pdf_sha256": "534177c8280eddd4785dce1491856c33c96cd698ae558b5136bdb206a79c7024",
      "html_sha256": "fe608ea795c9d3a7d72ceccd2f7a3ad2b04aa17d424fb05621ba2d6294c525ca",
      "zip_sha256": "0dcad970f5684f644dd85fb720bb53b771303cb6586c27a71757c7d1f01010a0",
      "page_geometry_checks": [
        {
          "page": 1,
          "text_characters": 1437,
          "images": 0
        },
        {
          "page": 2,
          "text_characters": 990,
          "images": 2
        },
        {
          "page": 3,
          "text_characters": 1535,
          "images": 1
        },
        {
          "page": 4,
          "text_characters": 1604,
          "images": 0
        },
        {
          "page": 5,
          "text_characters": 988,
          "images": 1
        },
        {
          "page": 6,
          "text_characters": 1357,
          "images": 0
        },
        {
          "page": 7,
          "text_characters": 828,
          "images": 1
        },
        {
          "page": 8,
          "text_characters": 1434,
          "images": 0
        },
        {
          "page": 9,
          "text_characters": 757,
          "images": 0
        },
        {
          "page": 10,
          "text_characters": 969,
          "images": 1
        },
        {
          "page": 11,
          "text_characters": 1384,
          "images": 0
        },
        {
          "page": 12,
          "text_characters": 1058,
          "images": 0
        },
        {
          "page": 13,
          "text_characters": 1066,
          "images": 0
        },
        {
          "page": 14,
          "text_characters": 1496,
          "images": 0
        }
      ]
    },
    {
      "kind": "opgaven",
      "pages": 9,
      "minimum_text_pt_including_footer": 12.0,
      "minimum_placed_figure_font_pt": 15.685038248697916,
      "images": 2,
      "pdf_sha256": "d12487671bd2f2cfe329f59bc9c48cfec5f03b871626c5c4016e88c2646d5f05",
      "html_sha256": "aa186c16833da51c8db0f6f9f866de2ba8957768b85932adce5fab0a761c5c3c",
      "zip_sha256": "89dc2596334fe8fcb5f11e058e785303493ec1e99c7735f8bc55611f419d9a12",
      "page_geometry_checks": [
        {
          "page": 1,
          "text_characters": 1319,
          "images": 0
        },
        {
          "page": 2,
          "text_characters": 891,
          "images": 0
        },
        {
          "page": 3,
          "text_characters": 1352,
          "images": 1
        },
        {
          "page": 4,
          "text_characters": 1502,
          "images": 0
        },
        {
          "page": 5,
          "text_characters": 977,
          "images": 1
        },
        {
          "page": 6,
          "text_characters": 1392,
          "images": 0
        },
        {
          "page": 7,
          "text_characters": 1066,
          "images": 0
        },
        {
          "page": 8,
          "text_characters": 1074,
          "images": 0
        },
        {
          "page": 9,
          "text_characters": 1504,
          "images": 0
        }
      ]
    },
    {
      "kind": "antwoorden",
      "pages": 6,
      "minimum_text_pt_including_footer": 12.0,
      "minimum_placed_figure_font_pt": null,
      "images": 0,
      "pdf_sha256": "aa3b6ccc9dbb0114854e835bc3a4ec01428f219eef82aba09ba9fd0949ce976a",
      "html_sha256": "63f33b13456bd1cc044760f67ff3d7267d337df05adc863a07b7b2373041e1f7",
      "zip_sha256": "0cfc714beb45b3ec087d0c891c28223e8431ba3e549abe9ec81dafba41494010",
      "page_geometry_checks": [

...[truncated 3258 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/b2_213.py --lesson-root ../4veco-lessen --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-root-build-r5.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:14:38.026Z`
- finished_at: `2026-09-05T18:14:46.779Z`
- duration_ms: `8753`
- exit_code: `0`
- stdout_sha256: `819fbd0b6264e80f7b9c998e08611709e0e89d472273f9025203d5007408affa`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.3
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{
  "paragraph": "2.1.3",
  "target_record_sha256": "df4b7d7b0326445b386ae570b43eb50fc9fc431707e3992e44394323f959c3ef",
  "plan_sha256": "4cf29ff1e70953f6d1f8399a65d63ad37031e6a129804ad555442bfb98624234",
  "chapter_sha256": "ef3f872f5caa2de1359639983d8e4907a34cfcbc80a0309826cff07201e49116",
  "prerequisites": [
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.3 Marginale kosten en marginale opbrengsten\\2.1.3-textbook-plan.md",
      "canonical_lf_sha256": "4cf29ff1e70953f6d1f8399a65d63ad37031e6a129804ad555442bfb98624234"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\_chapter-plan.md",
      "canonical_lf_sha256": "ef3f872f5caa2de1359639983d8e4907a34cfcbc80a0309826cff07201e49116"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1-textbook-handoff.md",
      "canonical_lf_sha256": "724a080619f2f072151edf20980071b3bef18cd60d1904c78f4aa906be8917c8"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.2 Opbrengsten, winst en break-even\\2.1.2-textbook-handoff.md",
      "canonical_lf_sha256": "de2b8ed7dcc7a3c5c6eaac400892d2d37ac5212ccb3b9972fb004115a88c1fe2"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.2 Opbrengsten, winst en break-even\\2.1.2-review.md",
      "canonical_lf_sha256": "74ad2ed9c44d9aa05b6d6a680d5d273f2cad4b62e4bead5db303c006514238cd"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.2 Opbrengsten, winst en break-even\\2.1.2-quality-ref.yaml",
      "canonical_lf_sha256": "e168e3c2b8698d12b699fbf60e7691fbbc8a15d61bd46a7988704d3c896c805c"
    }
  ],
  "prior_paragraph_md_raw_sha256": "f53521ed8812a4c8b8c33c1d66b34e0afe8425c1dffb1723f37771372b2baa09",
  "input_sources": [
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\b2_213.py",
      "sha256": "f6cd4c95f8ef8e0939f832d06f66fb099e986f9a6c02f1f9d66aaccba757caca"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\print_pipeline.py",
      "sha256": "51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\213\\theory.md",
      "sha256": "f0d9051bfb2d2babb481e351dc8757a4336707d26d7adda945cc3f8a4b97cba9"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\213\\exercises.md",
      "sha256": "813c0abc3b6e755092f31d04e837d0f77d8dbb53100d09d6cda7a3ca0971be7b"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\213\\answers.md",
      "sha256": "d7a6960674cd09c8ac43782c0503351c2a42b3ac656c2e792c69207ebc51ca50"
    },
    {
      "path": "C:\\wt
...[truncated 10671 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/213/verify_rebuild.py reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-root-build-r5.json reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-root-rebuild-r5.json reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-root-grayscale-r5

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:15:11.344Z`
- finished_at: `2026-09-05T18:15:25.066Z`
- duration_ms: `13722`
- exit_code: `0`
- stdout_sha256: `55ac832e95e843a9c6216f2ce1af1b472a4739df39abfc3832769898692887d7`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.3
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{
  "paragraph": "2.1.3",
  "source_manifest": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-213-root-build-r5.json",
  "source_manifest_sha256": "903bc12762886f65aef729590a1fce1f17c314e7e0e5cb9efe476acfc6701eed",
  "full_generator_rebuild": "PASS: all 24 artifact files byte identical",
  "print_only_rebuild": "PASS: all 24 artifact files byte identical",
  "grayscale_pdf_sha256": "534177c8280eddd4785dce1491856c33c96cd698ae558b5136bdb206a79c7024",
  "visual_inspection": "NOT_SUPPLIED_BY_THIS_SCRIPT"
}

```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:22:44.479Z`
- finished_at: `2026-09-05T18:22:44.573Z`
- duration_ms: `94`
- exit_code: `0`
- stdout_sha256: `f7391d90e7a0a9f1ebb2919c26913da95757345f4ca3898919260631acdeefd7`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.3 "Marginale kosten en marginale opbrengsten"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.3 Marginale kosten en marginale opbrengsten
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.md
  OK opgaven.md: 2.1.3 Marginale kosten en marginale opbrengsten – opgaven.md
  OK antwoorden.md: 2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.md
  OK 2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.html (1263.9 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – opgaven.html (579.0 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.html (19.7 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.pdf (948 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – opgaven.pdf (442 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.pdf (32 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 6 image refs all resolve
  OK _assets/: 6 SVGs, 6 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.3-review.md (no explicit verdict, no FAIL markers)
  OK Quality ref: 2.1.3-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.3 "Marginale kosten en marginale opbrengsten" PASSED all checks.


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:22:44.635Z`
- finished_at: `2026-09-05T18:22:44.729Z`
- duration_ms: `94`
- exit_code: `0`
- stdout_sha256: `f6b2b73d81a829e6aaaece112293115472caec2237bd53dddeb668365d637adf`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.3 "Marginale kosten en marginale opbrengsten"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.3 Marginale kosten en marginale opbrengsten
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.md
  OK opgaven.md: 2.1.3 Marginale kosten en marginale opbrengsten – opgaven.md
  OK antwoorden.md: 2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.md
  OK 2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.pdf (948 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – opgaven.pdf (442 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.pdf (32 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 6 image refs all resolve
  OK _assets/: 6 SVGs, 6 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.3-review.md (no explicit verdict, no FAIL markers)
  OK Quality ref: 2.1.3-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.3 "Marginale kosten en marginale opbrengsten" PASSED all checks.


```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base a1a4ee999f0e3f2a123772bad8d23c5764205821 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:23:25.260Z`
- finished_at: `2026-09-05T18:23:25.378Z`
- duration_ms: `118`
- exit_code: `0`
- stdout_sha256: `b95a1d9c44d94eaee453cb1b85abd99b71dc443a8018ec63f5bf7eb5eee47471`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 8
  - build-scripts/content/book-2/213/answers.md
  - build-scripts/content/book-2/213/check_render.py
  - build-scripts/content/book-2/213/exercises.md
  - build-scripts/content/book-2/213/target-answers.md
  - build-scripts/content/book-2/213/test_source.py
  - build-scripts/content/book-2/213/theory.md
  - build-scripts/content/book-2/213/verify_rebuild.py
  - build-scripts/content/book-2/b2_213.py
- review evidence: 90
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r4/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r4/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r4/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r4/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r4/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r4/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r4/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r4/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r5/builder-inspection.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r5/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r5/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r5/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r5/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r5/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r5/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r5/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r5/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-c26577450388-r4/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-c26577450388-r4/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-c26577450388-r4/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-c26577450388-r4/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-c26577450388-r4/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-c26577450388-r4/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-c26577450388-r4/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-c26577450388-r4/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-c26577450388-r4/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-c26577450388-r4/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-c26577450388-r4/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r5/builder-inspection.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r5/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r5/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r5/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r5/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r5/pages/page-003.png
  - reports/r
...[truncated 5314 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base 1dbdb0b30643c3a0c217fcd1c41de419a6ff4ee5 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:23:25.429Z`
- finished_at: `2026-09-05T18:23:25.546Z`
- duration_ms: `117`
- exit_code: `0`
- stdout_sha256: `34292cf5c25f879927ad67d1d26114717d0322ca2afb840ff7bb5de1153b3ee5`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 25
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.zip
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – opgaven.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – opgaven.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – opgaven.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – opgaven.zip
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.zip
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/_assets/2.1.3_ex_1.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/_assets/2.1.3_ex_1.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/_assets/2.1.3_fig_1.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/_assets/2.1.3_fig_1.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/_assets/2.1.3_fig_2.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/_assets/2.1.3_fig_2.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/_assets/2.1.3_fig_3.png
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/_assets/2.1.3_fig_3.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/_ass
...[truncated 671 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/221/test_source.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:27:06.669Z`
- finished_at: `2026-09-05T18:27:07.024Z`
- duration_ms: `355`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `463b130b4eaabcfbe0589e98832500207243b1003b9014e1d2cacb61c897215e`

### stdout excerpt

```text

```

### stderr excerpt

```text
..........
----------------------------------------------------------------------
Ran 10 tests in 0.009s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/b2_221.py --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-root-build-r7.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:27:07.074Z`
- finished_at: `2026-09-05T18:27:12.812Z`
- duration_ms: `5738`
- exit_code: `0`
- stdout_sha256: `a6a06a0acec24f696484b5e2d6ab9ad33f74f095b6f9cd5954333a5bb2a0e418`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.1
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{
  "paragraph": "2.2.1",
  "target_record_sha256": "61b54bde03d60be241092479cfcea8820e8187220f8f454dc9fef5045c8ea288",
  "plan_sha256": "29096bdedced016376a5ddf8a22c973ec5d61e8ce4822f390c2b746becca3345",
  "chapter_sha256": "3a9db97518b1948eb0967d94653a10c693a0ca001e20b41503b864fd4cc7c2f7",
  "input_sources": [
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\b2_221.py",
      "sha256": "5102e16b5b86b0b6ec56a7b8ebfd4fcfbc36add33d11c90176ed8b4f39fcc56f"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\print_pipeline.py",
      "sha256": "51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\221\\theory.md",
      "sha256": "d5ee20513a9e2222f3003b3659c9d395a49a706a3fb4191eef501afa33eae5d5"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\221\\exercises.md",
      "sha256": "d94e8f00ca51e6c33792216f6f59d60e95e4cdbf5d4ef10f918d030ef719fa8b"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\221\\answers.md",
      "sha256": "583e083e66cfdbd14aee442da7fab1c19aa3fc999dcfe53f63d965e291198c1a"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\221\\target-answers.md",
      "sha256": "59a17da108763172e5f590fca927a448fe12b07d5b5ff113b9ec7a82c80954b5"
    }
  ],
  "inspection_status": "PENDING",
  "documents": [
    {
      "source_md": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\2.2.1 Prijselasticiteit \u2013 paragraaf.md",
      "source_sha256": "54e3be72a523ba19f5ed9affdd96004bdda73ce11d49b292bfbe0fd4b9ac2430",
      "source_html": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\2.2.1 Prijselasticiteit \u2013 paragraaf.html",
      "html_sha256": "9e47df0cf7f34317434ea53d8317ae14919e2eadc7da9da87aedc69598bdfbc1",
      "source_pdf": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\2.2.1 Prijselasticiteit \u2013 paragraaf.pdf",
      "pdf_sha256": "98bf4923b4e3b8e49fa3b9d1b7daf71392c6c76ef8cea63aab12c44749cda1a6",
      "assets": [
        {
          "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\_assets\\2.2.1_fig_1.svg",
          "sha256": "609c6ffad43818ad4c887d882bbd2bc4e1c23dc1dd0c41e50559e4fbc24ad8cb"
        },
        {
          "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\_assets\\2.2.1_fig_1.png",
          "sha256": "6f4009fe29fb88f442257e658fe6433809020ba824d17ee275a08701f37d0704"
        },
        {
          "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\_assets\\2.2.1_fig_2.svg",

...[truncated 3742 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/221/check_render.py --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-root-build-r7.json --rebuild --output reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-root-render-check-r7.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:27:38.585Z`
- finished_at: `2026-09-05T18:27:44.861Z`
- duration_ms: `6276`
- exit_code: `0`
- stdout_sha256: `3280bd90c2a62e0a66ddad68e88fd104fea44e1a3574afccd9b075f56c9f2dd1`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.1
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{
  "paragraph": "2.2.1",
  "visual_acceptance": "NOT_SUPPLIED_BY_THIS_SCRIPT",
  "automated_status": "PASS",
  "documents": [
    {
      "kind": "paragraaf",
      "pdf_sha256": "98bf4923b4e3b8e49fa3b9d1b7daf71392c6c76ef8cea63aab12c44749cda1a6",
      "pages": 10,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": 12.221,
      "proof_directory": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\221-paragraaf-98bf4923b4e3-r7",
      "all_page_hashes_match": true
    },
    {
      "kind": "opgaven",
      "pdf_sha256": "a8119cc769c8f4d91a0d45c9ab2f25abc3875e57835d13c056adf6d35c6297af",
      "pages": 6,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": 12.221,
      "proof_directory": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\221-opgaven-a8119cc769c8-r7",
      "all_page_hashes_match": true
    },
    {
      "kind": "antwoorden",
      "pdf_sha256": "d4a7c139d49276e80c23f4eda1cfab7841d063b204d7a9bb70cd225a796e5b5d",
      "pages": 4,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": null,
      "proof_directory": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\221-antwoorden-d4a7c139d492-r7",
      "all_page_hashes_match": true
    }
  ],
  "byte_identical_rebuild": true,
  "checks": [
    "exact frozen goals/context/a-d/3+2+2+2points/short answers",
    "one exercise HTML definition in both editions",
    "no leaked fences or active resources",
    "every printed text/font and placed figure label meets12pt floor",
    "all assets and all rendered page hashes fresh; manifests honestly pending"
  ]
}


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:28:01.303Z`
- finished_at: `2026-09-05T18:28:01.388Z`
- duration_ms: `85`
- exit_code: `0`
- stdout_sha256: `274e68f12f250b71740b750bf5676685a72b7c4ddba79ffe21d7e90608d01632`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.2.1 "Prijselasticiteit"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.1 Prijselasticiteit
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.2.1 Prijselasticiteit – paragraaf.md
  OK opgaven.md: 2.2.1 Prijselasticiteit – opgaven.md
  OK antwoorden.md: 2.2.1 Prijselasticiteit – antwoorden.md
  OK 2.2.1 Prijselasticiteit – paragraaf.html (302.2 KB)
  OK 2.2.1 Prijselasticiteit – opgaven.html (120.1 KB)
  OK 2.2.1 Prijselasticiteit – antwoorden.html (12.8 KB)
  OK 2.2.1 Prijselasticiteit – paragraaf.pdf (241 KB)
  OK 2.2.1 Prijselasticiteit – opgaven.pdf (104 KB)
  OK 2.2.1 Prijselasticiteit – antwoorden.pdf (23 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 3 image refs all resolve
  OK _assets/: 3 SVGs, 3 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.2.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.2.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.2.1 "Prijselasticiteit" PASSED all checks.


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:28:01.444Z`
- finished_at: `2026-09-05T18:28:01.516Z`
- duration_ms: `72`
- exit_code: `0`
- stdout_sha256: `484f1ff8a20ff23bace5e86b50d1d3625a12cff87ab7b87b3d13c13200f76daf`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.2.1 "Prijselasticiteit"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.1 Prijselasticiteit
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.2.1 Prijselasticiteit – paragraaf.md
  OK opgaven.md: 2.2.1 Prijselasticiteit – opgaven.md
  OK antwoorden.md: 2.2.1 Prijselasticiteit – antwoorden.md
  OK 2.2.1 Prijselasticiteit – paragraaf.pdf (241 KB)
  OK 2.2.1 Prijselasticiteit – opgaven.pdf (104 KB)
  OK 2.2.1 Prijselasticiteit – antwoorden.pdf (23 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 3 image refs all resolve
  OK 2 companion asset(s) declared in _paragraph-plan.md
  OK _assets/: 3 SVGs, 3 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.2.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.2.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.2.1 "Prijselasticiteit" PASSED all checks.


```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base e923a9bc20b90c8b4fc461b28a54d8e481e13440 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:28:34.424Z`
- finished_at: `2026-09-05T18:28:34.511Z`
- duration_ms: `87`
- exit_code: `0`
- stdout_sha256: `5d268a752df295f3066f77597a0e8902b66b0bca3a5bbd6ed0516a6e6c7e0e7e`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 1
  - build-scripts/content/book-2/221/exercises.md
- review evidence: 33
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-010.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-build-r7.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-builder-inspection-r7.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-paired-scope-r7.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-presentation-builder-execution-r7.md
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-presentation-builder-plan.md
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-presentation-evidence-r7.py
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-render-check-r7.json

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base 4d8cea1727865a9bf867078a3c26315d57016e72 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:28:34.555Z`
- finished_at: `2026-09-05T18:28:34.647Z`
- duration_ms: `92`
- exit_code: `0`
- stdout_sha256: `774e398f44fd4790adaf1989f008da679b5a2c2fd4ae677bf6bc5a2d25938086`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 6
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – opgaven.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – opgaven.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – opgaven.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – paragraaf.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – paragraaf.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – paragraaf.pdf

```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:36:43.701Z`
- finished_at: `2026-09-05T18:36:43.813Z`
- duration_ms: `112`
- exit_code: `0`
- stdout_sha256: `274e68f12f250b71740b750bf5676685a72b7c4ddba79ffe21d7e90608d01632`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.2.1 "Prijselasticiteit"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.1 Prijselasticiteit
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.2.1 Prijselasticiteit – paragraaf.md
  OK opgaven.md: 2.2.1 Prijselasticiteit – opgaven.md
  OK antwoorden.md: 2.2.1 Prijselasticiteit – antwoorden.md
  OK 2.2.1 Prijselasticiteit – paragraaf.html (302.2 KB)
  OK 2.2.1 Prijselasticiteit – opgaven.html (120.1 KB)
  OK 2.2.1 Prijselasticiteit – antwoorden.html (12.8 KB)
  OK 2.2.1 Prijselasticiteit – paragraaf.pdf (241 KB)
  OK 2.2.1 Prijselasticiteit – opgaven.pdf (104 KB)
  OK 2.2.1 Prijselasticiteit – antwoorden.pdf (23 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 3 image refs all resolve
  OK _assets/: 3 SVGs, 3 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.2.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.2.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.2.1 "Prijselasticiteit" PASSED all checks.


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:36:43.880Z`
- finished_at: `2026-09-05T18:36:44.043Z`
- duration_ms: `163`
- exit_code: `0`
- stdout_sha256: `484f1ff8a20ff23bace5e86b50d1d3625a12cff87ab7b87b3d13c13200f76daf`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.2.1 "Prijselasticiteit"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.1 Prijselasticiteit
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.2.1 Prijselasticiteit – paragraaf.md
  OK opgaven.md: 2.2.1 Prijselasticiteit – opgaven.md
  OK antwoorden.md: 2.2.1 Prijselasticiteit – antwoorden.md
  OK 2.2.1 Prijselasticiteit – paragraaf.pdf (241 KB)
  OK 2.2.1 Prijselasticiteit – opgaven.pdf (104 KB)
  OK 2.2.1 Prijselasticiteit – antwoorden.pdf (23 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 3 image refs all resolve
  OK 2 companion asset(s) declared in _paragraph-plan.md
  OK _assets/: 3 SVGs, 3 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.2.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.2.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.2.1 "Prijselasticiteit" PASSED all checks.


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:36:44.112Z`
- finished_at: `2026-09-05T18:36:44.219Z`
- duration_ms: `107`
- exit_code: `0`
- stdout_sha256: `88f73d2b074229f721e5c7de8753f4469d2d80a82b9097b52b5c18584cde7901`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.2.3 "Inkomenselasticiteit en kruiselingse elasticiteit"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – paragraaf.md
  OK opgaven.md: 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – opgaven.md
  OK antwoorden.md: 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – antwoorden.md
  OK 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – paragraaf.html (768.2 KB)
  OK 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – opgaven.html (246.7 KB)
  OK 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – antwoorden.html (16.3 KB)
  OK 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – paragraaf.pdf (590 KB)
  OK 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – opgaven.pdf (203 KB)
  OK 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – antwoorden.pdf (28 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 4 image refs all resolve
  OK _assets/: 4 SVGs, 4 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.2.3-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.2.3-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.2.3 "Inkomenselasticiteit en kruiselingse elasticiteit" PASSED all checks.


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:36:44.288Z`
- finished_at: `2026-09-05T18:36:44.356Z`
- duration_ms: `68`
- exit_code: `0`
- stdout_sha256: `27c04bfcc053e612501308c0f501a39a4382df68cc33785942dc4c96de5fa2b3`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.2.3 "Inkomenselasticiteit en kruiselingse elasticiteit"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – paragraaf.md
  OK opgaven.md: 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – opgaven.md
  OK antwoorden.md: 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – antwoorden.md
  OK 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – paragraaf.pdf (590 KB)
  OK 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – opgaven.pdf (203 KB)
  OK 2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – antwoorden.pdf (28 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 4 image refs all resolve
  OK _assets/: 4 SVGs, 4 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.2.3-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.2.3-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.2.3 "Inkomenselasticiteit en kruiselingse elasticiteit" PASSED all checks.


```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base e923a9bc20b90c8b4fc461b28a54d8e481e13440 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:36:44.398Z`
- finished_at: `2026-09-05T18:36:44.487Z`
- duration_ms: `89`
- exit_code: `0`
- stdout_sha256: `2d9174f93b5612cde9e106e86d0f6effc80311710dc004190e67d4a62be66186`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 1
  - build-scripts/content/book-2/221/exercises.md
- review evidence: 63
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-010.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-R7-REVIEW-command-log.jsonl
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-R7-REVIEW-command-log.md
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-build-r7.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-builder-inspection-r7.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-paired-scope-r7.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-paragraph-diagnostic-manifest-r7.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-paragraph-gates-r7.js
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-paragraph-inspection-r7.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-paragraph-probes-r7.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-paragraph-probes-r7.py
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-paragraph-rebuild-default-runtime-r7.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-paragraph-render-check-r7.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-paragraph-review-r7-plan.md
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-paragraph-review-r7.md
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-paragraph-scope-r7.json
  - reports/spr
...[truncated 1658 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base 4d8cea1727865a9bf867078a3c26315d57016e72 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:36:44.529Z`
- finished_at: `2026-09-05T18:36:44.611Z`
- duration_ms: `82`
- exit_code: `0`
- stdout_sha256: `40432a16d2cfd16537380cac016ae2990986fff5652486e66d6d92981c73d66c`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 8
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – opgaven.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – opgaven.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – opgaven.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – paragraaf.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – paragraaf.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – paragraaf.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1-review.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3-review.md

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-review-adoption-checkpoint.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:47:42.678Z`
- finished_at: `2026-09-05T18:47:43.204Z`
- duration_ms: `526`
- exit_code: `0`
- stdout_sha256: `b3764f12d25bcf2b9e362b7e014acf0291610fe983141a8e041476441fb0f632`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS",
  "platform_head": "5f1a9ee2400badc4fc586440c0a7ff5b9a88bbfe",
  "lessons_head": "4c4cd7d0c1d2e5242c818399a96dce3e26013e9c",
  "planned_unique_pdfs": 41,
  "present": 26,
  "status_counts": {
    "A": 6,
    "C": 12,
    "L": 8,
    "P": 15
  },
  "baseline_identical_legacy_pdfs": 8,
  "fresh_pdf_pins": 18,
  "frozen_records": 12,
  "fresh_independent_page_bindings": 81,
  "generation_manifests": 9,
  "independent_213_gray_bindings": 5,
  "canonical_review_pins": 3,
  "limitation": "Read-only hash/provenance check; separate personally attributed reviews/QC/handoffs govern acceptance. No current full-suite/CI/merge claim."
}

```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:48:15.044Z`
- finished_at: `2026-09-05T18:48:15.141Z`
- duration_ms: `97`
- exit_code: `0`
- stdout_sha256: `28d989c490b8a35e5dab4fbe539f8e74f4488f6b6e776505d617477bbd67cffb`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.3 "Marginale kosten en marginale opbrengsten"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.3 Marginale kosten en marginale opbrengsten
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.md
  OK opgaven.md: 2.1.3 Marginale kosten en marginale opbrengsten – opgaven.md
  OK antwoorden.md: 2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.md
  OK 2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.html (1263.9 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – opgaven.html (579.0 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.html (19.7 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.pdf (948 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – opgaven.pdf (442 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.pdf (32 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 6 image refs all resolve
  OK _assets/: 6 SVGs, 6 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.3-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.3-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.3 "Marginale kosten en marginale opbrengsten" PASSED all checks.


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:48:15.196Z`
- finished_at: `2026-09-05T18:48:15.290Z`
- duration_ms: `94`
- exit_code: `0`
- stdout_sha256: `73b8964a614af70c644b2c7a7af7a4ff68863297c6c5168a42a18bc520babe9d`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.3 "Marginale kosten en marginale opbrengsten"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.3 Marginale kosten en marginale opbrengsten
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.md
  OK opgaven.md: 2.1.3 Marginale kosten en marginale opbrengsten – opgaven.md
  OK antwoorden.md: 2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.md
  OK 2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.pdf (948 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – opgaven.pdf (442 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.pdf (32 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 6 image refs all resolve
  OK _assets/: 6 SVGs, 6 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.3-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.3-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.3 "Marginale kosten en marginale opbrengsten" PASSED all checks.


```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.1.3

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:48:15.342Z`
- finished_at: `2026-09-05T18:48:17.248Z`
- duration_ms: `1906`
- exit_code: `0`
- stdout_sha256: `48277b0f2fe486714ff2c591064559f0bbbbe9bb1bcfa1353c2feef3efe14b35`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.3

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:48:17.289Z`
- finished_at: `2026-09-05T18:48:17.832Z`
- duration_ms: `543`
- exit_code: `0`
- stdout_sha256: `ca7764da243c9b491670418ecc8585edfb9d1edc93a3f5078e1bf8cade732ebc`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js BOOK2-TEXTBOOK-PRODUCTION-1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:48:17.871Z`
- finished_at: `2026-09-05T18:48:18.054Z`
- duration_ms: `183`
- exit_code: `0`
- stdout_sha256: `699bba7f2550eced00884bc621132de46fe5608c6b1baf7757bd06afbdbe896d`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: BOOK2-TEXTBOOK-PRODUCTION-1 planned/active

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-review-adoption-checkpoint.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:53:52.713Z`
- finished_at: `2026-09-05T18:53:53.399Z`
- duration_ms: `686`
- exit_code: `0`
- stdout_sha256: `92feed7e9c9087cca0b26795d6814f62db4e88245e698de49116e425034bdf5c`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS",
  "platform_head": "5f1a9ee2400badc4fc586440c0a7ff5b9a88bbfe",
  "lessons_head": "4c4cd7d0c1d2e5242c818399a96dce3e26013e9c",
  "planned_unique_pdfs": 41,
  "present": 26,
  "status_counts": {
    "C": 18,
    "L": 8,
    "P": 15
  },
  "baseline_identical_legacy_pdfs": 8,
  "fresh_pdf_pins": 18,
  "frozen_records": 12,
  "fresh_independent_page_bindings": 81,
  "generation_manifests": 9,
  "independent_213_gray_bindings": 5,
  "canonical_review_pins": 3,
  "limitation": "Read-only hash/provenance check; separate personally attributed reviews/QC/handoffs govern acceptance. No current full-suite/CI/merge claim."
}

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-short-alt-preflight.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:53:53.462Z`
- finished_at: `2026-09-05T18:53:53.569Z`
- duration_ms: `107`
- exit_code: `0`
- stdout_sha256: `e977bcef8fdf69f18b68094dec1a2abe1ac48d914939c9c2f185ae5dcfc2994b`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "mode": "diagnostic not acceptance",
  "standard": "agents/accessibility-agent.md: short alt <=120 characters and noun-first; complete descriptions must remain accessible",
  "results": [
    {
      "id": "2.1.1",
      "file": "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – antwoorden.html",
      "alternatives": []
    },
    {
      "id": "2.1.1",
      "file": "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – opgaven.html",
      "alternatives": [
        {
          "text": "Hetzelfde constante maandbedrag wordt over meer reparaties verdeeld; totalen en gemiddelden houden verschillende eenheden.",
          "characters": 122,
          "over_120": true
        },
        {
          "text": "De huurregel is voorgedaan. Maak daarna onderscheid tussen maandbedrag en bedrag per badge.",
          "characters": 91,
          "over_120": false
        }
      ]
    },
    {
      "id": "2.1.1",
      "file": "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – paragraaf.html",
      "alternatives": [
        {
          "text": "Figuur 1. De constante maandkosten blijven binnen Q = 40–80 gelijk.",
          "characters": 67,
          "over_120": false
        },
        {
          "text": "Figuur 2. Paneel A voegt TVK toe; paneel B voegt daarna TK toe, op dezelfde schalen.",
          "characters": 84,
          "over_120": false
        },
        {
          "text": "Figuur 3. Kies eerst het juiste totaal en deel daarna door dezelfde positieve Q.",
          "characters": 80,
          "over_120": false
        },
        {
          "text": "Figuur 4. Alleen het constante deel per poster halveert; het variabele deel blijft hier gelijk.",
          "characters": 95,
          "over_120": false
        },
        {
          "text": "Hetzelfde constante maandbedrag wordt over meer reparaties verdeeld; totalen en gemiddelden houden verschillende eenheden.",
          "characters": 122,
          "over_120": true
        },
        {
          "text": "De huurregel is voorgedaan. Maak daarna onderscheid tussen maandbedrag en bedrag per badge.",
          "characters": 91,
          "over_120": false
        }
      ]
    },
    {
      "id": "2.1.2",
      "file": "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – antwoorden.html",
      "alternatives": [
        {
          "text": "Opgave 4: de zelf toegevoegde TO-lijn kruist TK bij (5; 20). Bij acht potten is de verticale winstafstand € 9 per dag.",
          "characters": 118,
          "over_120": false
        },
        {
          "text": "Opgave 6: een zelfstandig gemaakte grafiek bevat twee benoemde assen, twee gelabelde lijnen, break-even, zones en de verticale winstafstand bij Q = 20.",
          "characters": 151,
          "over_120": true
        },
        {
          "text": "De doeloefening: het snijpunt ligt ongeveer bij (714,29; 1.071,43). Bij Q = 1.000 verbindt een verticale afstand de hoogten 1.300 en 1.500; dat verschil is € 200 per maand.",
          "characters": 172,
          "over_120": true
        }
      ]
    },
    {
      "id": "2.1.2",
      "file": "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – opgaven.html",
      "alternatives": [
        {
          "text": "Het volledige voorbeeld: TK en TO kruisen bij (3⅓; 23⅓). Het verticale verschil bij zes verhuringen is € 16 per dag.",
          "characters": 116,
          "over_120": false
        },
        {
          "text": "Volledige steun bij zeep: het snijpunt ligt bij (3⅓; 13⅓). Bij
...[truncated 10240 chars]
```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js BOOK2-TEXTBOOK-PRODUCTION-1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:53:53.623Z`
- finished_at: `2026-09-05T18:53:53.841Z`
- duration_ms: `218`
- exit_code: `0`
- stdout_sha256: `699bba7f2550eced00884bc621132de46fe5608c6b1baf7757bd06afbdbe896d`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: BOOK2-TEXTBOOK-PRODUCTION-1 planned/active

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base e923a9bc20b90c8b4fc461b28a54d8e481e13440 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:54:12.587Z`
- finished_at: `2026-09-05T18:54:12.673Z`
- duration_ms: `86`
- exit_code: `0`
- stdout_sha256: `3d0231108c7a63e9670b90969f90d54fcaa672c0abde9e8b2ea50bc8385e8490`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 1
  - build-scripts/content/book-2/221/exercises.md
- review evidence: 80
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-010.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-221-223-review-adoption.md
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-evidence/independent-arithmetic-r5.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-evidence/independent-pass0-r5.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-evidence/independent-personal-inspection-r5.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-evidence/independent-proof-bindings-r5.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-evidence/independent-publication-checks-r5.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-evidence/independent-rebuild-r5.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-evidence/independent-relocated-build-r5.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-evidence/independent-render-check-r5.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-evidence/independent-review-probes-r5.py
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-paragraph-review-plan-r5.md
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-paragraph-review-r5.md
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-R7-REVIEW-command-log.jsonl
  - reports/sprints/BOOK2-TEXTBO
...[truncated 3091 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base 4d8cea1727865a9bf867078a3c26315d57016e72 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:54:12.715Z`
- finished_at: `2026-09-05T18:54:12.802Z`
- duration_ms: `87`
- exit_code: `0`
- stdout_sha256: `a407b1015bc6860258d1b208278908b29089b68149d3afea1c37e839332ccf61`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 9
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3-review.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – opgaven.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – opgaven.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – opgaven.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – paragraaf.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – paragraaf.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – paragraaf.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1-review.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3-review.md

```

### stderr excerpt

```text

```
## npm.cmd test -- --runInBand

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T18:56:06.948Z`
- finished_at: `2026-09-05T19:03:50.386Z`
- duration_ms: `463438`
- exit_code: `0`
- stdout_sha256: `18fa34aca6face4ceb5d841bce119e012c5c97c0248a3fc22be306e01bfa6d3b`
- stderr_sha256: `ef24089261d7e370c4f44953144b7bb0a82949a65e635b1a37d6155df187be50`

### stdout excerpt

```text

> 4veco-platform@1.0.0 test
> jest --runInBand


```

### stderr excerpt

```text
Cannot parse chapter folder name: bad-name
Expected format: "X.Y Hoofdstuk Name"
  ⚠ Orphaned asset: 9.9.1_fig_1.svg
  ✗ MISSING review report (X.Y.Z-review.md)
  ⚠ No _chapter-plan.md
  ⚠ Orphaned asset: 9.9.1_fig_1.svg
  ✗ quality_ref reports missing assets: 9.9.1-quality-ref.yaml
  ⚠ No _chapter-plan.md
  ⚠ Orphaned asset: 9.9.1_fig_1.svg
  ✗ Part A review verdict is FAIL: 9.9.1-review.md
  ⚠ No _chapter-plan.md
  ⚠ Orphaned asset: 9.9.1_fig_1.svg
  ⚠ No _chapter-plan.md
  ✗ Non-compliant asset name: B9C9S1_fig_1.svg (must match X.Y.Z_{type}_{number}.ext)
  ✗ Asset prefix mismatch: B9C9S1_fig_1.svg does not start with 9.9.1_
  ✗ Non-compliant asset name: B9C9S1_fig_1.png (must match X.Y.Z_{type}_{number}.ext)
  ✗ Asset prefix mismatch: B9C9S1_fig_1.png does not start with 9.9.1_
  ⚠ No _chapter-plan.md
  ✗ Chapter asset wrong prefix: B9C9S1_fig_1.png (expected 9.9.*)
  ✗ Chapter asset wrong prefix: B9C9S1_fig_1.svg (expected 9.9.*)
  ⚠ No _chapter-plan.md
  ✗ Chapter aggregate asset differs from paragraph source: 9.9.1_fig_1.svg
  ⚠ Orphaned asset: 9.5.1_fig_1.svg
  ⚠ Orphaned asset: 9.5.1_mc_1.svg
  ⚠ No _chapter-plan.md
  ⚠ Orphaned asset: 9.5.4_fig_1.svg
  ⚠ No _chapter-plan.md
  ✗ MISSING toetsmatrijs.md
  ✗ Expected 3 PDFs, found 2
  ⚠ Orphaned asset: 9.5.4_fig_1.svg
  ⚠ No _chapter-plan.md
  ✗ MISSING samenvatting.md
  ✗ Expected 2 PDFs, found 1
  ⚠ Orphaned asset: 9.5.1_fig_1.svg
  ⚠ No _chapter-plan.md
  ⚠ Orphaned asset: 9.5.1_mc_1.svg
  ⚠ No _chapter-plan.md
  ⚠ Orphaned asset: 9.9.4_ex_1.svg
  ⚠ No _chapter-plan.md

Test Suites: 6 skipped, 110 passed, 110 of 116 total
Tests:       8 skipped, 1872 passed, 1880 total
Snapshots:   0 total
Time:        462.528 s
Ran all test suites.

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-corrective-review-bindings.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:06:18.791Z`
- finished_at: `2026-09-05T19:06:18.911Z`
- duration_ms: `120`
- exit_code: `0`
- stdout_sha256: `e12880d2bd5cd3571ccfd813a1c86ab37321b324bbadf45b476d23db5a6c89be`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS_FOR_ADOPTION_PROVENANCE_ONLY",
  "quality_acceptance": "WITHHELD",
  "current_221_qc": "REVISE",
  "current_222_paragraph": "FAIL",
  "required_findings": 3,
  "fresh_page_hashes": 41,
  "exact_pdf_and_generation_manifest_bindings": 6,
  "grayscale_bindings": 5,
  "canonical_222_raw_sha256": "d8c01a53362386143557666e1b6a9d3157a166d69330fba56a0ac48e7a88a9e1",
  "canonical_222_exact_original_commit": "be754856f6b6c2cb1cbe1d6abedbe93c2637b8b1",
  "no_source_output_qc_handoff_mutation": true
}

```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:06:51.060Z`
- finished_at: `2026-09-05T19:06:51.143Z`
- duration_ms: `83`
- exit_code: `1`
- stdout_sha256: `a3e2109d7595466b191cd645463d544a144b4b571bd1e3887d598570bc9bd813`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.2.2 "Elasticiteit en omzet"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.2 Elasticiteit en omzet
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.2.2 Elasticiteit en omzet – paragraaf.md
  OK opgaven.md: 2.2.2 Elasticiteit en omzet – opgaven.md
  OK antwoorden.md: 2.2.2 Elasticiteit en omzet – antwoorden.md
  OK 2.2.2 Elasticiteit en omzet – paragraaf.html (400.9 KB)
  OK 2.2.2 Elasticiteit en omzet – opgaven.html (140.1 KB)
  OK 2.2.2 Elasticiteit en omzet – antwoorden.html (16.6 KB)
  OK 2.2.2 Elasticiteit en omzet – paragraaf.pdf (313 KB)
  OK 2.2.2 Elasticiteit en omzet – opgaven.pdf (119 KB)
  OK 2.2.2 Elasticiteit en omzet – antwoorden.pdf (26 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 4 image refs all resolve
  OK _assets/: 4 SVGs, 4 PNGs

-- Part A QC artifacts --
  X Part A review verdict is FAIL: 2.2.2-review.md
  OK Quality ref: 2.2.2-quality-ref.yaml (valid)

==========================================
FAIL Paragraph 2.2.2 "Elasticiteit en omzet" failed: 1 error(s), 0 warning(s).


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:06:51.190Z`
- finished_at: `2026-09-05T19:06:51.268Z`
- duration_ms: `78`
- exit_code: `1`
- stdout_sha256: `2b9994f5a959310bf2b2614a5b30700e4da024cd611b35c641b5d679f4bcede7`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.2.2 "Elasticiteit en omzet"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.2 Hoofdstuk Elasticiteit\2.2.2 Elasticiteit en omzet
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.2.2 Elasticiteit en omzet – paragraaf.md
  OK opgaven.md: 2.2.2 Elasticiteit en omzet – opgaven.md
  OK antwoorden.md: 2.2.2 Elasticiteit en omzet – antwoorden.md
  OK 2.2.2 Elasticiteit en omzet – paragraaf.pdf (313 KB)
  OK 2.2.2 Elasticiteit en omzet – opgaven.pdf (119 KB)
  OK 2.2.2 Elasticiteit en omzet – antwoorden.pdf (26 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 4 image refs all resolve
  OK _assets/: 4 SVGs, 4 PNGs

-- Part A QC artifacts --
  X Part A review verdict is FAIL: 2.2.2-review.md
  OK Quality ref: 2.2.2-quality-ref.yaml (valid)

==========================================
FAIL Paragraph 2.2.2 "Elasticiteit en omzet" failed: 1 error(s), 0 warning(s).


```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:06:51.319Z`
- finished_at: `2026-09-05T19:06:51.931Z`
- duration_ms: `612`
- exit_code: `0`
- stdout_sha256: `ca7764da243c9b491670418ecc8585edfb9d1edc93a3f5078e1bf8cade732ebc`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js BOOK2-TEXTBOOK-PRODUCTION-1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:08:16.681Z`
- finished_at: `2026-09-05T19:08:16.856Z`
- duration_ms: `175`
- exit_code: `0`
- stdout_sha256: `699bba7f2550eced00884bc621132de46fe5608c6b1baf7757bd06afbdbe896d`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
OK sprint bundle: BOOK2-TEXTBOOK-PRODUCTION-1 planned/active

```

### stderr excerpt

```text

```
