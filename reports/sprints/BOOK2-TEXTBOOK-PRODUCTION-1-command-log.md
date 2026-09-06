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
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-specialist-adoption-check.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:25:50.193Z`
- finished_at: `2026-09-05T19:25:50.379Z`
- duration_ms: `186`
- exit_code: `0`
- stdout_sha256: `42237c1e2ff0d605fcf88a847876caca42a9e7823aba16ddcf6c8e9f9c5d4845`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS_FOR_ADOPTION_PROVENANCE_ONLY",
  "quality_acceptance": "WITHHELD",
  "specialist_verdict": "REVISE",
  "fresh_page_pairs": 29,
  "grayscale_bindings": 5,
  "exact_pdf_copy_and_generation_bindings": 3,
  "canonical_review_and_quality_unchanged": true,
  "personal_inspection_record": "BOOK2-TEXTBOOK-PRODUCTION-1-213-evidence/specialist-personal-inspection-r5.md",
  "no_capture_status_rewrite": true
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/221/test_source.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:26:16.278Z`
- finished_at: `2026-09-05T19:26:16.915Z`
- duration_ms: `637`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `4ac20fea79a4ae63c47c1357cb616efa3c8b0c34de0fa51731934ac6e763cddb`

### stdout excerpt

```text

```

### stderr excerpt

```text
............
----------------------------------------------------------------------
Ran 12 tests in 0.241s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/b2_221.py --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-root-build-r8.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:26:16.961Z`
- finished_at: `2026-09-05T19:26:23.630Z`
- duration_ms: `6669`
- exit_code: `0`
- stdout_sha256: `01c36a463644db8ea2e7319433f37bb53b10e47a71f5996868598ca017de8b57`
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
      "sha256": "da9dee7e7392c1ee880e9ea582ec94ecc5ff8a2a4b38694ecf7ee0eaa6ec70b2"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\print_pipeline.py",
      "sha256": "51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\221\\theory.md",
      "sha256": "2e5af204f2bb38226f793626d061b175527fe283808bcfa932a6883d19950ca4"
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
      "source_sha256": "ae61910c6306ff6af9d52a57db060083ca64facadc4424f1d4a96708d71974db",
      "source_html": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\2.2.1 Prijselasticiteit \u2013 paragraaf.html",
      "html_sha256": "ac568897e03adcc88aab6a8710771d189d1a6e4bb18b85e63fdc4b3d32a7140b",
      "source_pdf": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\2.2.1 Prijselasticiteit \u2013 paragraaf.pdf",
      "pdf_sha256": "98bf4923b4e3b8e49fa3b9d1b7daf71392c6c76ef8cea63aab12c44749cda1a6",
      "assets": [
        {
          "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.1 Prijselasticiteit\\_assets\\2.2.1_fig_1.svg",
          "sha256": "1abc7cc2a150318a84341bf89886543cd94e5fc63dd120cf18244e62032536b2"
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
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-root-r8-bindings.js --bind-proof-links

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:27:20.649Z`
- finished_at: `2026-09-05T19:27:20.890Z`
- duration_ms: `241`
- exit_code: `0`
- stdout_sha256: `9391b86f1ae76a4892a7687ecb21cb0a90d2d8c403384f8ddee80a9b37a1b3ba`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS_FOR_CANDIDATE_BINDINGS",
  "inventory_bindings": 61,
  "exact_edition_triples": 3,
  "own_prior_page_pairs": 20,
  "all_pdfs_identical": true,
  "exact_enumerated_native_html_delta": true,
  "alts": [
    {
      "alternative": "Procentuele prijs- en hoeveelheidsreacties op dezelfde schaal.",
      "characters": 62
    },
    {
      "alternative": "Dezelfde absolute-waardeschaal; twee verschillende classificaties.",
      "characters": 66
    },
    {
      "alternative": "Bowlplein: berekende percentages; klimhal: alleen de gemeten Ev.",
      "characters": 64
    },
    {
      "alternative": "Bowlplein: berekende percentages; klimhal: alleen de gemeten Ev.",
      "characters": 64
    }
  ],
  "independent_gates": "PENDING",
  "proof_links_written": true
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/221/check_render.py --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-root-build-r8.json --rebuild --output reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-root-render-check-r8.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:27:20.936Z`
- finished_at: `2026-09-05T19:27:27.343Z`
- duration_ms: `6407`
- exit_code: `0`
- stdout_sha256: `79b0259d9cd73bb1fd82e2969ec735871e067d9dc4d6d87b51c5b5e64275a008`
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
      "proof_directory": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\221-paragraaf-98bf4923b4e3-r8",
      "all_page_hashes_match": true
    },
    {
      "kind": "opgaven",
      "pdf_sha256": "a8119cc769c8f4d91a0d45c9ab2f25abc3875e57835d13c056adf6d35c6297af",
      "pages": 6,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": 12.221,
      "proof_directory": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\221-opgaven-a8119cc769c8-r8",
      "all_page_hashes_match": true
    },
    {
      "kind": "antwoorden",
      "pdf_sha256": "d4a7c139d49276e80c23f4eda1cfab7841d063b204d7a9bb70cd225a796e5b5d",
      "pages": 4,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": null,
      "proof_directory": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\221-antwoorden-d4a7c139d492-r8",
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
- started_at: `2026-09-05T19:27:46.983Z`
- finished_at: `2026-09-05T19:27:47.081Z`
- duration_ms: `98`
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
- started_at: `2026-09-05T19:27:47.127Z`
- finished_at: `2026-09-05T19:27:47.191Z`
- duration_ms: `64`
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
- started_at: `2026-09-05T19:29:47.339Z`
- finished_at: `2026-09-05T19:29:47.473Z`
- duration_ms: `134`
- exit_code: `1`
- stdout_sha256: `54d176173d8963e3341e15578d726438af52b4b29e6999cc3a0b809820785415`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: FAIL (shared)
- shared platform: 4
  - build-scripts/content/book-2/221/exercises.md
  - build-scripts/content/book-2/221/test_source.py
  - build-scripts/content/book-2/221/theory.md
  - build-scripts/content/book-2/b2_221.py
- generated index/report: 4
  - reports/github-agent-index-lessen.json
  - reports/github-agent-index-lessen.md
  - reports/github-agent-index-platform.json
  - reports/github-agent-index-platform.md
- review evidence: 168
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-
...[truncated 17778 chars]
```

### stderr excerpt

```text

```
## pwsh -NoProfile -File reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-relocate-specialist-proof.ps1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:31:17.145Z`
- finished_at: `2026-09-05T19:31:18.477Z`
- duration_ms: `1332`
- exit_code: `0`
- stdout_sha256: `b6e43fe4d6fa0087d3509d3e0e949910415b069c7654ca512a482bb58fb6efa3`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS",
  "operation": "byte-identical evidence relocation",
  "old_prefix": "reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-specialist-r5",
  "new_prefix": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-evidence/specialist-r5",
  "files": [
    {
      "relative": "antwoorden.pdf",
      "sha256": "aa3b6ccc9dbb0114854e835bc3a4ec01428f219eef82aba09ba9fd0949ce976a"
    },
    {
      "relative": "gray-10-10.png",
      "sha256": "3a0ad3a2dba523cfacb33c7c198c61ffa27352e1774aefe8c74d12d59a5f2d0d"
    },
    {
      "relative": "gray-2-02.png",
      "sha256": "004084b5fdd9e0d334b9fff765cc78abc8354c08f1786cb6d901e059ddcd419f"
    },
    {
      "relative": "gray-3-03.png",
      "sha256": "ad6d3fdd1bb7132efa6b95a685fa946966576595cb0918f6513d34088165b47a"
    },
    {
      "relative": "gray-5-05.png",
      "sha256": "f7bb3c55c9de61deb3af2a59bdeaa52c25ce1fd0a951fe5812d5c84ca72b9413"
    },
    {
      "relative": "gray-7-07.png",
      "sha256": "74448eeabc7213d0ace5df6b5ef3eca5c3200667fd1c9b26a8a741c8d23170c3"
    },
    {
      "relative": "opgaven.pdf",
      "sha256": "d12487671bd2f2cfe329f59bc9c48cfec5f03b871626c5c4016e88c2646d5f05"
    },
    {
      "relative": "paragraaf.pdf",
      "sha256": "534177c8280eddd4785dce1491856c33c96cd698ae558b5136bdb206a79c7024"
    },
    {
      "relative": "antwoorden\\page-1.png",
      "sha256": "259f34326468953ae3e18c09422336bdd21c43a4ad9f8a8e20445c64bf0ce5d8"
    },
    {
      "relative": "antwoorden\\page-2.png",
      "sha256": "83f082c2f1283879eb5a3c36f9cbe2676f6d0147e4610d657aa661ef85dfd7c2"
    },
    {
      "relative": "antwoorden\\page-3.png",
      "sha256": "8e2b6ab15c8e7955f3ed62c815886e8cb0e6aa1fcdcf56d93b2964cf8eda5f8b"
    },
    {
      "relative": "antwoorden\\page-4.png",
      "sha256": "dc982562e8d61b6fb4b6f442d867dd402e31dab263c9b812088f74741c33b5c6"
    },
    {
      "relative": "antwoorden\\page-5.png",
      "sha256": "bb5cbe33a820f077f37bdba8c2776bf8982ff987d800a651c7f1ef190eea6942"
    },
    {
      "relative": "antwoorden\\page-6.png",
      "sha256": "fabcaf97d2af683937c8eda443ab6e230d5e4899a0c0f12fa829d9bf1613499d"
    },
    {
      "relative": "opgaven\\page-1.png",
      "sha256": "8dce5752b8b6f223d9ec3334349cbd8426705b1b11d2ad616885a7237a4ff02a"
    },
    {
      "relative": "opgaven\\page-2.png",
      "sha256": "866955304c64cf0873b478645fc92e14ffe4b93801cc959cace9d2993d99e0fc"
    },
    {
      "relative": "opgaven\\page-3.png",
      "sha256": "1de08ce2987bd5c875622cbb41aeb0784dbbca9b41b54f1ce6ba75a325d77758"
    },
    {
      "relative": "opgaven\\page-4.png",
      "sha256": "d2bace9d4ce1eaddf56936a7327a676d3ba44a86fc54d26d2505a2f528d59f31"
    },
    {
      "relative": "opgaven\\page-5.png",
      "sha256": "b166b196ebe8a1426d452fc4bcf803b2084c8c41ed51dd4b1e5078ebc48320b6"
    },
    {
      "relative": "opgaven\\page-6.png",
      "sha256": "471e09af924065c761fded16c8c74c77e0d9aebd7d83ff395b6d12344cf3918f"
    },
    {
      "relative": "opgaven\\page-7.png",
      "sha256": "b6ef874b19f6630f3aaefc62ef4f3874ebdbc3f7049fe77d34e7f0ad79b70845"
    },
    {
      "relative": "opgaven\\page-8.png",
      "sha256": "da00760a5d51eca93a00da72bf6396f092b69d1239448f956a071bbc8b60c54a"
    },
    {
      "relative": "opgaven\\page-9.png",
      "sha256": "59ccfb6970899b936e17c94812a03806f05150fb9af4c258c36fe2b7050386f6"
    },
    {
      "relative": "paragraaf\\page-01.png",
      "sha256": "1b461934c3fd5c9519572a985379f753223be62288631675cfa9d084dc518ac6"
    },
    {
      "relative": "paragraaf\\page-02.png",
      "sha256": "f5b3b1f3fd2a80f8c98ef56bb892df648733b8b9e550dee8106dbc6673e881d4"
    },
    {
      "relative": "paragraaf\\page-03.png",
      "sha256": "259cbd5a05f47b70d00795813ac71750a421c17931fd269a8a17a8c78e130cc5"
    },
    {
      "relative": "paragraaf\\page-04.png",
      "sha256": "c65f51e3136c2d
...[truncated 1619 chars]
```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-specialist-adoption-check.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:31:18.541Z`
- finished_at: `2026-09-05T19:31:18.632Z`
- duration_ms: `91`
- exit_code: `0`
- stdout_sha256: `42237c1e2ff0d605fcf88a847876caca42a9e7823aba16ddcf6c8e9f9c5d4845`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS_FOR_ADOPTION_PROVENANCE_ONLY",
  "quality_acceptance": "WITHHELD",
  "specialist_verdict": "REVISE",
  "fresh_page_pairs": 29,
  "grayscale_bindings": 5,
  "exact_pdf_copy_and_generation_bindings": 3,
  "canonical_review_and_quality_unchanged": true,
  "personal_inspection_record": "BOOK2-TEXTBOOK-PRODUCTION-1-213-evidence/specialist-personal-inspection-r5.md",
  "no_capture_status_rewrite": true
}

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base e923a9bc20b90c8b4fc461b28a54d8e481e13440 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:32:06.054Z`
- finished_at: `2026-09-05T19:32:06.146Z`
- duration_ms: `92`
- exit_code: `0`
- stdout_sha256: `878b6a050ee0acfbee2709e8f943bb66d40b12f2a2a4fccbe5b8f0491a35ea37`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 4
  - build-scripts/content/book-2/221/exercises.md
  - build-scripts/content/book-2/221/test_source.py
  - build-scripts/content/book-2/221/theory.md
  - build-scripts/content/book-2/b2_221.py
- generated index/report: 4
  - reports/github-agent-index-lessen.json
  - reports/github-agent-index-lessen.md
  - reports/github-agent-index-platform.json
  - reports/github-agent-index-platform.md
- review evidence: 206
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-antwoorden-d4a7c139d492-r8/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r7/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-opgaven-a8119cc769c8-r8/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-paragraaf-98bf4923b4e3-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-
...[truncated 14555 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base 4d8cea1727865a9bf867078a3c26315d57016e72 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:32:06.192Z`
- finished_at: `2026-09-05T19:32:06.282Z`
- duration_ms: `90`
- exit_code: `0`
- stdout_sha256: `97b1b7a992cf9c1a3ef9387df87d664571c785ebeb2b15a353524d8f9faf0e35`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 11
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3-review.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – opgaven.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – opgaven.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – opgaven.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – paragraaf.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – paragraaf.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1 Prijselasticiteit – paragraaf.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1-review.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/_assets/2.2.1_fig_1.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2-review.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3-review.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js BOOK2-TEXTBOOK-PRODUCTION-1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:32:06.327Z`
- finished_at: `2026-09-05T19:32:06.503Z`
- duration_ms: `176`
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
## C:/Python314/python.exe build-scripts/content/book-2/213/test_source.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:33:57.249Z`
- finished_at: `2026-09-05T19:33:58.672Z`
- duration_ms: `1423`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `1446cac668b768e94960117ca0f5d7a018f8c11ba8cbaf1a686b15bb20c6aecf`

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
test_native_pandoc_short_alts_keep_full_captions (__main__.SourceTests.test_native_pandoc_short_alts_keep_full_captions) ... ok
test_original_long_alts_and_caption_loss_are_rejected (__main__.SourceTests.test_original_long_alts_and_caption_loss_are_rejected) ... ok
test_retrieval_combination_and_unequal_intervals (__main__.SourceTests.test_retrieval_combination_and_unequal_intervals) ... ok
test_six_assets_safe_geometry_large_type (__main__.SourceTests.test_six_assets_safe_geometry_large_type) ... ok
test_six_exact_noun_first_accessible_titles (__main__.SourceTests.test_six_exact_noun_first_accessible_titles) ... ok

----------------------------------------------------------------------
Ran 13 tests in 0.888s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/b2_213.py --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-root-build-r6.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:33:58.718Z`
- finished_at: `2026-09-05T19:34:07.309Z`
- duration_ms: `8591`
- exit_code: `0`
- stdout_sha256: `29f5d6c1c25a20e5b9953628965d5cba6757c4b38b8242688f5d00a7e73455bb`
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
      "sha256": "6a45771783de221c3d65b32d423c1f7e90c90e84a79d30c4e175bba8836b056a"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\print_pipeline.py",
      "sha256": "51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\213\\theory.md",
      "sha256": "df6e40009454bc43f4915fa3edbf8c613a888ebbd2d0b7b59414bd3f70b4d5e7"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\213\\exercises.md",
      "sha256": "bd16efcc6ac0ef9c2713b61587c8613fa353e98cc696e8a172ea931e11c35b32"
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
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-root-r6-bindings.js --derive-paths

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:35:12.942Z`
- finished_at: `2026-09-05T19:35:13.059Z`
- duration_ms: `117`
- exit_code: `0`
- stdout_sha256: `32e0e7f8ee7b83c328ecc31a501770d7e7fb438367c18d57688418cd07ff422b`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS_FOR_CANDIDATE_BINDINGS",
  "actual_artifacts": 24,
  "protected_input_bindings": 16,
  "owned_source_bindings": 3,
  "own_prior_page_pairs": 29,
  "pdfs_unchanged": 3,
  "all_four_edition_hashes_match": 3,
  "independent_gates": "PENDING",
  "path_only_baseline_derivative_written": true
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/213/verify_alt_delta.py r6 reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-root-delta-r6.json --before reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-root-before-native-r5.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:35:13.106Z`
- finished_at: `2026-09-05T19:35:13.906Z`
- duration_ms: `800`
- exit_code: `0`
- stdout_sha256: `826d3264bf719012a6c342317ef221a3c8d7331b05f1c1ed7c7ce69dec849730`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS",
  "changed_artifacts": [
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 paragraaf.md",
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 paragraaf.html",
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 paragraaf.zip",
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 opgaven.md",
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 opgaven.html",
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 opgaven.zip",
    "_assets/2.1.3_we_1.svg"
  ],
  "pdf_byte_identical": 3,
  "page_png_byte_identical": 29,
  "asset_png_byte_identical": 6,
  "svg_drawing_byte_identical": 6,
  "visible_html_and_full_captions": "exact normalized DOM and caption words in all three editions; only four alt occurrences and corresponding native aria-hidden removal, with whitespace reflow",
  "protected_inputs": "all exact raw SHA-256 equality",
  "zip_delta": "only two student MD/HTML pairs and their we1 SVG title; unchanged inventories/other CRC and member bytes",
  "visual_inspection": "NOT_SUPPLIED_BY_THIS_SCRIPT"
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/213/check_render.py reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-root-render-r6.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:35:13.946Z`
- finished_at: `2026-09-05T19:35:22.992Z`
- duration_ms: `9046`
- exit_code: `0`
- stdout_sha256: `703907fa0e287d22d5dababc7e7e135af3f7f6c1ffa3d05461da84ee3000c572`
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
      "html_sha256": "2f8d85e29fa7e734269f92b68510a9e21f196807c5c105fe7157e70d17f09f5b",
      "zip_sha256": "15ffc25da00d0f3bfc84f93224191a08c9ab31387f7dc873a8df85dc7b76b499",
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
      ],
      "actual_html_alternatives": [
        {
          "asset": "2.1.3_fig_1",
          "alt": "Dezelfde dag: de tabelstappen van 0 naar 10 en van 10 naar 20 fotohouders, met TK 20, 50 en 100 euro.",
          "length": 101,
          "caption": "Dezelfde dag: de tabelstappen van 0 naar 10 en van 10 naar 20 fotohouders, met TK 20, 50 en 100 euro.",
          "caption_attributes": {
            "aria-hidden": "true"
          }
        },
        {
          "asset": "2.1.3_fig_2",
          "alt": "Dezelfde kostentabel met delta TK 30 en 50 euro, telkens delta Q 10, en MK 3 en 5 euro bij de rechter eindpunten.",
          "length": 113,
          "caption": "Dezelfde kostentabel met delta TK 30 en 50 euro, telkens delta Q 10, en MK 3 en 5 euro bij de rechter eindpunten.",
          "caption_attributes": {
            "aria-hidden": "true"
          }
        },
        {
          "asset": "2.1.3_fig_3",
          "alt": "MO bij vaste prijs: 80 euro extra opbrengst voor 10 extra fotohouders in beide intervallen, dus 8 euro per houder.",
          "length": 114,
          "caption": "Bij dezelfde hoeveelheden 0, 10 en 20 zijn de opbrengsten 0, 80 en 160 euro. Beide intervallen leveren 80 euro extra voor 10 extra producten: MO is telkens 8.",
          "caption_attributes": {}
        },
        {
          "asset": "2.1.3_fig_4",
          "alt": "Winsttoename per extra fotohouder: 5 euro in interval 0�10 en 3 euro in interval 10�20, telkens MO min MK.",
          "length": 106,
          "caption": "Twee intervalkaarten: winst van min 20 naar 30 geeft 50 gedeeld door 10 is 5; winst van 30 naar 60 geeft 30 gedeeld door 10 is 3. Dit is telkens MO min MK.",
          "caption_attributes": {}
        },
        {
          "asset": "2.1.3_we_1",
          "alt": "Eindpuntrijen van Lus en Bout: MK 2/2/2 tegenover 2/6/10; MO steeds 6 en 12 euro per extra
...[truncated 7849 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/213/verify_rebuild.py reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-root-build-r6.json reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-root-rebuild-r6.json reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-root-grayscale-r6

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:35:23.046Z`
- finished_at: `2026-09-05T19:35:37.364Z`
- duration_ms: `14318`
- exit_code: `0`
- stdout_sha256: `fea3011b0644560054cb30372d6de266e4efee7599f618e060e19e4ebdfc3398`
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
  "source_manifest": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-213-root-build-r6.json",
  "source_manifest_sha256": "1bf1fa6746c642d1a5f596f0b2bc873ee26872c0cb27dbd118cdf0bdb09c16d9",
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
- started_at: `2026-09-05T19:36:09.744Z`
- finished_at: `2026-09-05T19:36:09.844Z`
- duration_ms: `100`
- exit_code: `0`
- stdout_sha256: `051b6dae7e939f0fc6a10af954c78e7d8b389c5f856fdd11d8839a2f6c8a4417`
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
  OK 2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.html (1263.7 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – opgaven.html (578.9 KB)
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
- started_at: `2026-09-05T19:36:09.904Z`
- finished_at: `2026-09-05T19:36:09.993Z`
- duration_ms: `89`
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
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-root-r6-bindings.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:38:07.206Z`
- finished_at: `2026-09-05T19:38:07.343Z`
- duration_ms: `137`
- exit_code: `0`
- stdout_sha256: `806c37e0a57983182a04c0f4b850815a458ce745fcdc3c2cbca54114524419f4`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS_FOR_CANDIDATE_BINDINGS",
  "actual_artifacts": 24,
  "protected_input_bindings": 16,
  "owned_source_bindings": 3,
  "own_prior_page_pairs": 29,
  "own_prior_grayscale_pairs": 5,
  "pdfs_unchanged": 3,
  "all_four_edition_hashes_match": 3,
  "independent_gates": "PENDING",
  "path_only_baseline_derivative_written": false
}

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-review-adoption-checkpoint.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:40:30.602Z`
- finished_at: `2026-09-05T19:40:31.277Z`
- duration_ms: `675`
- exit_code: `0`
- stdout_sha256: `72d9ed97183e20cf25a6b1b3a6c9c996ff34a5380291286fa1f8f8716638b172`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS",
  "platform_head": "016b526f15c3d1f7d5d64b6b883a3d36cbfc1bab",
  "lessons_head": "374c3b3487e7cdeb77ffbaf17fe96746b346fd14",
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
## C:/Python314/python.exe build-scripts/content/book-2/222/test_source.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:42:25.427Z`
- finished_at: `2026-09-05T19:42:26.359Z`
- duration_ms: `932`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `4393202d6bf007c2c0b59dcccc21c52433b15c751fa9e343c4819b62afffe2c5`

### stdout excerpt

```text

```

### stderr excerpt

```text
..............
----------------------------------------------------------------------
Ran 14 tests in 0.454s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/b2_222.py --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-root-build-r13.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:42:26.403Z`
- finished_at: `2026-09-05T19:42:32.311Z`
- duration_ms: `5908`
- exit_code: `0`
- stdout_sha256: `3ba8db6e9d1a9c49096d51f5f98a9363620f7667022cd39a2474becb79f903f2`
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
      "sha256": "81d1f326b0095eda29b1f939288e722f213a1fae03a5eb151af03881c3e88cde"
    },
    {
      "path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\build-scripts\\content\\book-2\\222\\answers.md",
      "sha256": "a66e33507be37f166416ec9c16088964902dcb7529d5d7c7d2c47989f15bd9c6"
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
      "source_sha256": "573ba54a818018ccd565142efd81a79db2558d901e809ab1c35bc1676d238fc0",
      "source_html": "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.2 Hoofdstuk Elasticiteit\\2.2.2 Elasticiteit en omzet\\2.2.2 Elasticiteit en omzet \u2013 paragraaf.html",
      "html_sha256": "e3da1a7be53db7677dba2f3379b4f665247cb6fc5e6a4c2676d00ba0fcf280c4",
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
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-root-r13-check.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:44:06.648Z`
- finished_at: `2026-09-05T19:44:11.111Z`
- duration_ms: `4463`
- exit_code: `0`
- stdout_sha256: `4b71ec85737591281730e19648c426c56431efff5b98255081890c01f4b89c99`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS",
  "output": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-222-root-delta-r13.json",
  "sha256": "813ebdb4b95a4c2efb74f4ee407b001c5287a9672800e4785bfacc7205435ca4",
  "preserved_history_file_count": 368,
  "page_transitions": 21,
  "changed_pages": [
    {
      "edition": "antwoorden",
      "page": "page-002.png",
      "before": "7bf2147b456b14e9af54a8e6c0ec4bb417828c0e7ddc97d22abb526024527f40",
      "after": "65ab004822fdc1eca242363f3b18c340e0cbace06ce03afbaf6545c4b6721043",
      "changed": true
    }
  ],
  "source_and_student_dom_delta": "Exact bounded change",
  "raster_tolerance": 0,
  "canonical_review": "FAIL unchanged",
  "root_manifest_sha256": "10819535226b09ea200eb9f37c4c14e1ce3e558ee5ffeab10d74f4539358dc46"
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/222/check_render.py --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-root-build-r13.json --rebuild --output reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-root-render-check-r13.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:44:11.160Z`
- finished_at: `2026-09-05T19:44:17.302Z`
- duration_ms: `6142`
- exit_code: `0`
- stdout_sha256: `0ef28ad2d237d45128b2f78c5c5f44750dc87dac467208ca2e15f138010b1c89`
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
      "proof_directory": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\222-paragraaf-36feb7873637-r13",
      "all_page_hashes_match": true
    },
    {
      "kind": "opgaven",
      "pdf_sha256": "0a251a4973b1b9b0c4abca30310a3e0bda888558e079fd4895319fc496614555",
      "pages": 6,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": 14.378,
      "proof_directory": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\222-opgaven-0a251a4973b1-r13",
      "all_page_hashes_match": true
    },
    {
      "kind": "antwoorden",
      "pdf_sha256": "61cbde67e81565150128187573a766fffc9bc1d01f3bd24cbe3dacb9ddeb52b2",
      "pages": 5,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": null,
      "proof_directory": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\222-antwoorden-61cbde67e815-r13",
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
- started_at: `2026-09-05T19:44:48.021Z`
- finished_at: `2026-09-05T19:44:48.108Z`
- duration_ms: `87`
- exit_code: `1`
- stdout_sha256: `0141f1718ad20e7c6a5760ddb924e0aed8eb92d6556682aa8cb78e6f080981a8`
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
  OK 2.2.2 Elasticiteit en omzet – paragraaf.html (400.8 KB)
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
- started_at: `2026-09-05T19:44:48.162Z`
- finished_at: `2026-09-05T19:44:48.243Z`
- duration_ms: `81`
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
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-review-adoption-checkpoint.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:46:18.944Z`
- finished_at: `2026-09-05T19:46:19.517Z`
- duration_ms: `573`
- exit_code: `0`
- stdout_sha256: `f6e191cf811593eb4b568510ae3c696e031423dc9cdd69fbdc694702dfa91fc8`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS",
  "platform_head": "fe609fabd8663f36778c5948209d3140df942adc",
  "lessons_head": "a2bb4bcf199b8871eef21426f329efb6795e7dd8",
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
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base 441b7e7013c74fb80da55d88f84223d233bac6a8 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:46:59.348Z`
- finished_at: `2026-09-05T19:46:59.440Z`
- duration_ms: `92`
- exit_code: `0`
- stdout_sha256: `a8d35373e85c4555b6cadcc7b95876019ffeebda993dc43ec32d3ce7f17e31be`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 10
  - build-scripts/content/book-2/213/alt_contract.py
  - build-scripts/content/book-2/213/check_render.py
  - build-scripts/content/book-2/213/exercises.md
  - build-scripts/content/book-2/213/test_source.py
  - build-scripts/content/book-2/213/theory.md
  - build-scripts/content/book-2/213/verify_alt_delta.py
  - build-scripts/content/book-2/222/answers.md
  - build-scripts/content/book-2/222/exercises.md
  - build-scripts/content/book-2/222/test_source.py
  - build-scripts/content/book-2/b2_213.py
- review evidence: 117
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-010.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-011.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-012.png
  - reports/re
...[truncated 7216 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base e1170dfc450400040339f96d18e43c0b60bd029d --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:46:59.507Z`
- finished_at: `2026-09-05T19:46:59.594Z`
- duration_ms: `87`
- exit_code: `0`
- stdout_sha256: `84da7a2eac379da86de6f7503dcbbb064af2a07b004cf7ff58a1f8030b42c5f9`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 14
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – opgaven.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – opgaven.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – opgaven.zip
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.zip
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/_assets/2.1.3_we_1.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – antwoorden.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – antwoorden.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – antwoorden.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – opgaven.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – opgaven.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – paragraaf.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2 Elasticiteit en omzet – paragraaf.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js BOOK2-TEXTBOOK-PRODUCTION-1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T19:46:59.632Z`
- finished_at: `2026-09-05T19:46:59.807Z`
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
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-current-review-succession.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:07:50.146Z`
- finished_at: `2026-09-05T20:07:50.265Z`
- duration_ms: `119`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `bb710b302a35130ba25d14d18c2b99226ad6538d784f293dcf67d359bffcac22`

### stdout excerpt

```text

```

### stderr excerpt

```text
C:\wt\book2-part-a-production-20260905\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-current-review-succession.js:17
  const normalized = p.replaceAll('\\', '/').replace(/^\/\/\?\//, '');
                       ^

TypeError: Cannot read properties of undefined (reading 'replaceAll')
    at relocate (C:\wt\book2-part-a-production-20260905\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-current-review-succession.js:17:24)
    at verifyExternal (C:\wt\book2-part-a-production-20260905\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-current-review-succession.js:27:48)
    at Object.<anonymous> (C:\wt\book2-part-a-production-20260905\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-current-review-succession.js:55:69)
    at Module._compile (node:internal/modules/cjs/loader:1804:14)
    at Object..js (node:internal/modules/cjs/loader:1936:10)
    at Module.load (node:internal/modules/cjs/loader:1525:32)
    at Module._load (node:internal/modules/cjs/loader:1327:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)

Node.js v24.13.1

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-current-review-succession.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:08:07.900Z`
- finished_at: `2026-09-05T20:08:08.107Z`
- duration_ms: `207`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `7bec30e190fb3e541c5ec48b5bba36ae17653a4c72ba3f984a5cab53ce80bd6e`

### stdout excerpt

```text

```

### stderr excerpt

```text
fatal: path 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3-textbook-handoff.md' does not exist in 'a2bb4bcf199b8871eef21426f329efb6795e7dd8'
node:child_process:964
    throw err;
    ^

Error: Command failed: git show a2bb4bcf199b8871eef21426f329efb6795e7dd8:Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3-textbook-handoff.md
fatal: path 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3-textbook-handoff.md' does not exist in 'a2bb4bcf199b8871eef21426f329efb6795e7dd8'

    at genericNodeError (node:internal/errors:985:15)
    at wrappedFn (node:internal/errors:539:14)
    at checkExecSyncError (node:child_process:925:11)
    at execFileSync (node:child_process:961:15)
    at Object.<anonymous> (C:\wt\book2-part-a-production-20260905\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-current-review-succession.js:96:15)
    at Module._compile (node:internal/modules/cjs/loader:1804:14)
    at Object..js (node:internal/modules/cjs/loader:1936:10)
    at Module.load (node:internal/modules/cjs/loader:1525:32)
    at Module._load (node:internal/modules/cjs/loader:1327:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14) {
  status: 128,
  signal: null,
  output: [
    null,
    Buffer(0) [Uint8Array] [],
    Buffer(239) [Uint8Array] [
      102,  97, 116,  97, 108,  58,  32, 112,  97, 116, 104,  32,
       39,  66, 111, 101, 107,  32,  50,  32,  45,  32,  75, 111,
      115, 116, 101, 110,  44,  32, 111, 112,  98, 114, 101, 110,
      103, 115, 116, 101, 110,  44,  32, 101, 108,  97, 115, 116,
      105,  99, 105, 116, 101, 105, 116,  32, 101, 110,  32, 115,
      117, 114, 112, 108, 117, 115,  47,  50,  46,  49,  32,  72,
      111, 111, 102, 100, 115, 116, 117, 107,  32,  75, 111, 115,
      116, 101, 110,  32, 101, 110,  32, 111, 112,  98, 114, 101,
      110, 103, 115, 116,
      ... 139 more items
    ]
  ],
  pid: 11268,
  stdout: Buffer(0) [Uint8Array] [],
  stderr: Buffer(239) [Uint8Array] [
    102,  97, 116,  97, 108,  58,  32, 112,  97, 116, 104,  32,
     39,  66, 111, 101, 107,  32,  50,  32,  45,  32,  75, 111,
    115, 116, 101, 110,  44,  32, 111, 112,  98, 114, 101, 110,
    103, 115, 116, 101, 110,  44,  32, 101, 108,  97, 115, 116,
    105,  99, 105, 116, 101, 105, 116,  32, 101, 110,  32, 115,
    117, 114, 112, 108, 117, 115,  47,  50,  46,  49,  32,  72,
    111, 111, 102, 100, 115, 116, 117, 107,  32,  75, 111, 115,
    116, 101, 110,  32, 101, 110,  32, 111, 112,  98, 114, 101,
    110, 103, 115, 116,
    ... 139 more items
  ]
}

Node.js v24.13.1

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-current-review-succession.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:08:26.484Z`
- finished_at: `2026-09-05T20:08:26.849Z`
- duration_ms: `365`
- exit_code: `0`
- stdout_sha256: `1e920b1b9b40a7f175e6661ea52b879ea73092d5de6c5f2bc551cee612d66216`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS",
  "platform_head": "ad1425b37d4a02ec187088e2fa885fd5226ad9d6",
  "lessons_head": "3745ef9757e6f10e5edd746dc4508ee73c596d6d",
  "fileChecks": 188,
  "reviewed_pages": 49,
  "grayscale_bindings": 8,
  "pdfs": 6,
  "canonical_review_transitions": 2,
  "quality_and_handoffs": "UNCHANGED",
  "visual_acceptance": "No new root page-view claim; observations remain attributed to the two distinct reviewers.",
  "next_gate": "Distinct current specialist QC, root handoff and final combined acceptance remain pending."
}

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:08:26.901Z`
- finished_at: `2026-09-05T20:08:27.580Z`
- duration_ms: `679`
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
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:08:42.994Z`
- finished_at: `2026-09-05T20:08:43.072Z`
- duration_ms: `78`
- exit_code: `0`
- stdout_sha256: `051b6dae7e939f0fc6a10af954c78e7d8b389c5f856fdd11d8839a2f6c8a4417`
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
  OK 2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.html (1263.7 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – opgaven.html (578.9 KB)
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
- started_at: `2026-09-05T20:08:43.125Z`
- finished_at: `2026-09-05T20:08:43.192Z`
- duration_ms: `67`
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
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:08:43.240Z`
- finished_at: `2026-09-05T20:08:43.312Z`
- duration_ms: `72`
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
- started_at: `2026-09-05T20:08:43.359Z`
- finished_at: `2026-09-05T20:08:43.423Z`
- duration_ms: `64`
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
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base 441b7e7013c74fb80da55d88f84223d233bac6a8 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:09:54.720Z`
- finished_at: `2026-09-05T20:09:54.824Z`
- duration_ms: `104`
- exit_code: `0`
- stdout_sha256: `65b947e6cb5b51067f7658ad7c81fdde85d12ae18a0329850ede2b366888d77b`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 10
  - build-scripts/content/book-2/213/alt_contract.py
  - build-scripts/content/book-2/213/check_render.py
  - build-scripts/content/book-2/213/exercises.md
  - build-scripts/content/book-2/213/test_source.py
  - build-scripts/content/book-2/213/theory.md
  - build-scripts/content/book-2/213/verify_alt_delta.py
  - build-scripts/content/book-2/222/answers.md
  - build-scripts/content/book-2/222/exercises.md
  - build-scripts/content/book-2/222/test_source.py
  - build-scripts/content/book-2/b2_213.py
- generated index/report: 4
  - reports/github-agent-index-lessen.json
  - reports/github-agent-index-lessen.md
  - reports/github-agent-index-platform.json
  - reports/github-agent-index-platform.md
- review evidence: 183
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-aa3b6ccc9dbb-r6/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r6/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r6/pages/page-010.png
  - reports/rendered-p
...[truncated 13050 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base a2bb4bcf199b8871eef21426f329efb6795e7dd8 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:09:54.905Z`
- finished_at: `2026-09-05T20:09:55.008Z`
- duration_ms: `103`
- exit_code: `0`
- stdout_sha256: `a452c59a353980c6465b0b2b321195ef03035c6b212fab00afbad69033b58303`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 2
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3-review.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1-review.md

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js BOOK2-TEXTBOOK-PRODUCTION-1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:09:55.061Z`
- finished_at: `2026-09-05T20:09:55.282Z`
- duration_ms: `221`
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
## C:/Python314/python.exe build-scripts/content/book-2/211/test_source.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:11:26.394Z`
- finished_at: `2026-09-05T20:11:26.825Z`
- duration_ms: `431`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `2e382bbd1ecd8779e69397393d4264cef0f8188effab52bf753946ee3cdd74bd`

### stdout excerpt

```text

```

### stderr excerpt

```text
.............
----------------------------------------------------------------------
Ran 13 tests in 0.070s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/211/check_render.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:11:26.866Z`
- finished_at: `2026-09-05T20:11:27.922Z`
- duration_ms: `1056`
- exit_code: `0`
- stdout_sha256: `7889867cbfea5292907ba549cf17b57a2165375757c9e82ec4ca1df9ab0fc14d`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "paragraph": "2.1.1",
  "automated_checks": [
    "all printed text including footer >=12pt",
    "all exercises present",
    "exact target context/prompts in HTML and PDF",
    "literal a-e plus4/3/3/3/4points",
    "exact supplied header/row cells",
    "four exact goals in paragraph PDF",
    "identical exercise HTML fragments"
  ],
  "documents": [
    {
      "kind": "paragraaf",
      "pages": 15,
      "minimum_printed_font_pt_including_footer": 12.0,
      "pdf_sha256": "9837e3a85f3129a5309a36b17fd1030702ba92fc7ef464af609cb878e4d2f8b0"
    },
    {
      "kind": "opgaven",
      "pages": 9,
      "minimum_printed_font_pt_including_footer": 12.0,
      "pdf_sha256": "97329415bacc150675a327ad31455b25b8e9e1b03012ef6b65dab10ab1f02953"
    },
    {
      "kind": "antwoorden",
      "pages": 7,
      "minimum_printed_font_pt_including_footer": 12.0,
      "pdf_sha256": "ffdf0905a980b6c89b64207e90873d79edbf192c86c2280f3394caa25693998a"
    }
  ],
  "visual_review_status": "NOT_SUPPLIED_BY_THIS_SCRIPT"
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-root-r4-check.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:12:43.715Z`
- finished_at: `2026-09-05T20:12:56.958Z`
- duration_ms: `13243`
- exit_code: `1`
- stdout_sha256: `19d745eb76517a7d5bb0d82394a87824752150f11b44e47845ac3c7dbb6f677e`
- stderr_sha256: `ab4abcd8b122db1b1e284b8698c3a6caefc03c08602b684a97967981651ba811`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.1
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{
  "full_rebuild_identical": true,
  "native_build_document_print_only_identical": true,
  "files": {
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 paragraaf.md": "de7abc910f6ec940eb329abd003085921f32409956ec1e0450bcc4a5454eb6b5",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 paragraaf.html": "10721f1ad745b8e1358ba354c5ded64a74367f5081eaf1c676ecb88dbe10e44b",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 paragraaf.pdf": "9837e3a85f3129a5309a36b17fd1030702ba92fc7ef464af609cb878e4d2f8b0",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 opgaven.md": "bacccc1c9b063c4c786f2749d31993d94eb671fdc5bf0a899fb123d89bc0558b",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 opgaven.html": "9e27b80089dee95fa4ac61a3f07baaf95ff3650518943a730db122befec2a6f8",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 opgaven.pdf": "97329415bacc150675a327ad31455b25b8e9e1b03012ef6b65dab10ab1f02953",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 antwoorden.md": "57cc1ef3b5c5ae6d912291f9746a7f535906bb85207678bab8fc63dadf82ebfb",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 antwoorden.html": "d4d3db3265820003a45e71955b9f3f2188a6036860fdcdc8fbbc49b944bfd0ca",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 antwoorden.pdf": "ffdf0905a980b6c89b64207e90873d79edbf192c86c2280f3394caa25693998a",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\_assets\\2.1.1_ex_1.png": "fc76afb4f507cf8e09a62a9cf7a209ded71b93f87c72b97803d95afc6678f24f",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\_assets\\2.1.1_ex_1.svg": "c2854b76d42ee1a2654f4e13886e5184b17119786bff71b7b908bedf4aae83e3",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\_assets\\2.1.1_fig_1.png": "21ca603069ffa83d885befa21696b1b0c7ea4a0f6fba8ed49021458000c8ba45",
    "C:\\wt\\book2-part-a-producti
...[truncated 2474 chars]
```

### stderr excerpt

```text
Traceback (most recent call last):
  File "C:\wt\book2-part-a-production-20260905\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-211-root-r4-check.py", line 62, in <module>
    module.audit()
    ~~~~~~~~~~~~^^
  File "C:\wt\book2-part-a-production-20260905\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-211-ALT-verify.py", line 147, in audit
    assert path.read_bytes() == previous(path), (path, "protected bytes changed")
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: (WindowsPath('C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten � opgaven.md'), 'protected bytes changed')

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-root-r4-check.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:13:49.234Z`
- finished_at: `2026-09-05T20:14:01.443Z`
- duration_ms: `12209`
- exit_code: `0`
- stdout_sha256: `0cd80d928bc95999735d10f4135657c844c38e295306d51dd1e6afd61c1afa55`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.1
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{
  "full_rebuild_identical": true,
  "native_build_document_print_only_identical": true,
  "files": {
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 paragraaf.md": "de7abc910f6ec940eb329abd003085921f32409956ec1e0450bcc4a5454eb6b5",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 paragraaf.html": "10721f1ad745b8e1358ba354c5ded64a74367f5081eaf1c676ecb88dbe10e44b",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 paragraaf.pdf": "9837e3a85f3129a5309a36b17fd1030702ba92fc7ef464af609cb878e4d2f8b0",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 opgaven.md": "bacccc1c9b063c4c786f2749d31993d94eb671fdc5bf0a899fb123d89bc0558b",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 opgaven.html": "9e27b80089dee95fa4ac61a3f07baaf95ff3650518943a730db122befec2a6f8",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 opgaven.pdf": "97329415bacc150675a327ad31455b25b8e9e1b03012ef6b65dab10ab1f02953",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 antwoorden.md": "57cc1ef3b5c5ae6d912291f9746a7f535906bb85207678bab8fc63dadf82ebfb",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 antwoorden.html": "d4d3db3265820003a45e71955b9f3f2188a6036860fdcdc8fbbc49b944bfd0ca",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 antwoorden.pdf": "ffdf0905a980b6c89b64207e90873d79edbf192c86c2280f3394caa25693998a",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\_assets\\2.1.1_ex_1.png": "fc76afb4f507cf8e09a62a9cf7a209ded71b93f87c72b97803d95afc6678f24f",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\_assets\\2.1.1_ex_1.svg": "c2854b76d42ee1a2654f4e13886e5184b17119786bff71b7b908bedf4aae83e3",
    "C:\\wt\\book2-part-a-production-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\_assets\\2.1.1_fig_1.png": "21ca603069ffa83d885befa21696b1b0c7ea4a0f6fba8ed49021458000c8ba45",
    "C:\\wt\\book2-part-a-producti
...[truncated 4930 chars]
```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:15:05.121Z`
- finished_at: `2026-09-05T20:15:05.197Z`
- duration_ms: `76`
- exit_code: `0`
- stdout_sha256: `1286d7f34eaaa3efba28d3c4565b694e750e601310c5b2c1077b8531e494be92`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.1 "Kostenstructuren"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.1 Kostenstructuren
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.1 Kostenstructuren – paragraaf.md
  OK opgaven.md: 2.1.1 Kostenstructuren – opgaven.md
  OK antwoorden.md: 2.1.1 Kostenstructuren – antwoorden.md
  OK 2.1.1 Kostenstructuren – paragraaf.html (710.4 KB)
  OK 2.1.1 Kostenstructuren – opgaven.html (245.1 KB)
  OK 2.1.1 Kostenstructuren – antwoorden.html (18.3 KB)
  OK 2.1.1 Kostenstructuren – paragraaf.pdf (518 KB)
  OK 2.1.1 Kostenstructuren – opgaven.pdf (188 KB)
  OK 2.1.1 Kostenstructuren – antwoorden.pdf (31 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 6 image refs all resolve
  OK _assets/: 6 SVGs, 6 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.1 "Kostenstructuren" PASSED all checks.


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:15:05.244Z`
- finished_at: `2026-09-05T20:15:05.308Z`
- duration_ms: `64`
- exit_code: `0`
- stdout_sha256: `f977ab456da0d2239f7aea063296f613f72130435d6db4b51b7dac122d3d7a6f`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.1 "Kostenstructuren"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.1 Kostenstructuren
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.1 Kostenstructuren – paragraaf.md
  OK opgaven.md: 2.1.1 Kostenstructuren – opgaven.md
  OK antwoorden.md: 2.1.1 Kostenstructuren – antwoorden.md
  OK 2.1.1 Kostenstructuren – paragraaf.pdf (518 KB)
  OK 2.1.1 Kostenstructuren – opgaven.pdf (188 KB)
  OK 2.1.1 Kostenstructuren – antwoorden.pdf (31 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 6 image refs all resolve
  OK _assets/: 6 SVGs, 6 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.1 "Kostenstructuren" PASSED all checks.


```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base 50656d50432fe7e91d53ea99b7fc73c8872b5eff --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:18:13.749Z`
- finished_at: `2026-09-05T20:18:13.870Z`
- duration_ms: `121`
- exit_code: `0`
- stdout_sha256: `0efd9846fbf9b03733aba145a9723feae1de0c0e2b85b50af38d941a717db1a4`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 3
  - build-scripts/content/book-2/211/exercises.md
  - build-scripts/content/book-2/211/test_source.py
  - build-scripts/content/book-2/b2_211.py
- review evidence: 65
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-ffdf0905a980-r4/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-ffdf0905a980-r4/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-ffdf0905a980-r4/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-ffdf0905a980-r4/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-ffdf0905a980-r4/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-ffdf0905a980-r4/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-ffdf0905a980-r4/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-ffdf0905a980-r4/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-ffdf0905a980-r4/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-010.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-011.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-012.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-013.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-014.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-para
...[truncated 2180 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base 3745ef9757e6f10e5edd746dc4508ee73c596d6d --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:18:13.960Z`
- finished_at: `2026-09-05T20:18:14.090Z`
- duration_ms: `130`
- exit_code: `0`
- stdout_sha256: `ec01a61c54e11358bc88149a7e82e5e8b47d39aa6c1b90433abc266bee910abe`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 5
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – opgaven.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – opgaven.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – paragraaf.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – paragraaf.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/_assets/2.1.1_fig_3.svg

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js BOOK2-TEXTBOOK-PRODUCTION-1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:18:14.143Z`
- finished_at: `2026-09-05T20:18:14.397Z`
- duration_ms: `254`
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
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.3.1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:21:44.778Z`
- finished_at: `2026-09-05T20:21:46.654Z`
- duration_ms: `1876`
- exit_code: `0`
- stdout_sha256: `17c621a2434015110c4cb7717f5a302b74ab68762f2574dbcdd25e8895ecce87`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.3.1

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.1.4

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:21:46.689Z`
- finished_at: `2026-09-05T20:21:48.611Z`
- duration_ms: `1922`
- exit_code: `0`
- stdout_sha256: `57311de082a3b7434c35c5dea51c7b8d062cac4cb4dfba01f762320479914dba`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.4

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-root-qc-adoption-r8.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:30:08.065Z`
- finished_at: `2026-09-05T20:30:08.261Z`
- duration_ms: `196`
- exit_code: `0`
- stdout_sha256: `2954b2170c955a06b2c1d74e24bbd0ad6e4ea7dcfdf91edc9b5343a1f732d5ec`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS",
  "checks": 93,
  "pages": 20,
  "grays": 3,
  "pdfs": 3,
  "exact_raster_pairs": 3,
  "reviewer": "paragraph_213_r6_independent_review",
  "current_specialist": "PASS WITH FLAGS",
  "root_handoff": "NOT_YET_UPDATED",
  "visual_acceptance": "No fresh root page-view claim; this binds the specialist personally attributed report."
}

```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:30:08.324Z`
- finished_at: `2026-09-05T20:30:08.490Z`
- duration_ms: `166`
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
- started_at: `2026-09-05T20:30:08.547Z`
- finished_at: `2026-09-05T20:30:08.617Z`
- duration_ms: `70`
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
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:33:45.565Z`
- finished_at: `2026-09-05T20:33:45.664Z`
- duration_ms: `99`
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
- started_at: `2026-09-05T20:33:45.715Z`
- finished_at: `2026-09-05T20:33:45.795Z`
- duration_ms: `80`
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
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.2.1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:33:45.844Z`
- finished_at: `2026-09-05T20:33:47.595Z`
- duration_ms: `1751`
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
- started_at: `2026-09-05T20:33:47.636Z`
- finished_at: `2026-09-05T20:33:48.217Z`
- duration_ms: `581`
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
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base 800c3540b15787aecec2e782e6da9b960664cadb --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:33:48.448Z`
- finished_at: `2026-09-05T20:33:48.593Z`
- duration_ms: `145`
- exit_code: `0`
- stdout_sha256: `0f809891ef1c65b8213704ac2d3f2711175ceed003f57f5eb78b7d8dbe3ef6b8`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 1
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1-textbook-handoff.md
- review evidence: 1
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1-quality-ref.yaml

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-acceptance-inventory-check.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:48:25.153Z`
- finished_at: `2026-09-05T20:48:25.556Z`
- duration_ms: `403`
- exit_code: `0`
- stdout_sha256: `12c9e14bb25118f38e106c956ce891fb88b141080db9ccb494aa6794cd4b508b`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS",
  "scope": "Exact §221 R8 root acceptance and41-PDF inventory checkpoint",
  "canonical_records": 3,
  "root_quality_fields_only": true,
  "lesson_changed_paths": [
    "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1-quality-ref.yaml",
    "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1-textbook-handoff.md"
  ],
  "counts": {
    "A": 3,
    "C": 15,
    "L": 8,
    "P": 15
  },
  "present": 26,
  "legacy_baseline_identical": 8,
  "current_pdf_hashes": 18,
  "handoff_current_md_pdf_bindings": 6,
  "book_final": false
}

```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js BOOK2-TEXTBOOK-PRODUCTION-1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:48:25.597Z`
- finished_at: `2026-09-05T20:48:25.922Z`
- duration_ms: `325`
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
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base 50656d50432fe7e91d53ea99b7fc73c8872b5eff --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:48:50.476Z`
- finished_at: `2026-09-05T20:48:50.606Z`
- duration_ms: `130`
- exit_code: `0`
- stdout_sha256: `e4d1e3a95dc507148d8aa7f575ef3fe806332f184ff3a7af61b825b468ed6050`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 3
  - build-scripts/content/book-2/211/exercises.md
  - build-scripts/content/book-2/211/test_source.py
  - build-scripts/content/book-2/b2_211.py
- generated index/report: 4
  - reports/github-agent-index-lessen.json
  - reports/github-agent-index-lessen.md
  - reports/github-agent-index-platform.json
  - reports/github-agent-index-platform.md
- review evidence: 110
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-ffdf0905a980-r4/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-ffdf0905a980-r4/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-ffdf0905a980-r4/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-ffdf0905a980-r4/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-ffdf0905a980-r4/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-ffdf0905a980-r4/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-ffdf0905a980-r4/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-ffdf0905a980-r4/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-ffdf0905a980-r4/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r4/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-010.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-011.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r4/pages/page-012.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9
...[truncated 6105 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base 800c3540b15787aecec2e782e6da9b960664cadb --head 6ccc48911a6239dee25cffb8f29e9f42db442f9e

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:48:50.653Z`
- finished_at: `2026-09-05T20:48:50.791Z`
- duration_ms: `138`
- exit_code: `0`
- stdout_sha256: `0f809891ef1c65b8213704ac2d3f2711175ceed003f57f5eb78b7d8dbe3ef6b8`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 1
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1-textbook-handoff.md
- review evidence: 1
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/2.2.1-quality-ref.yaml

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-root-r6-check.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:52:33.148Z`
- finished_at: `2026-09-05T20:53:04.232Z`
- duration_ms: `31084`
- exit_code: `0`
- stdout_sha256: `bac18fefc1e3ccf2c7aac31fd68f9987463a4c340980136fc0a7f3b78b193227`
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
{"path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-212-root-r6-baseline-r6.json", "sha256": "aee301c514d80717db6ebbc93c9335d7f13550462d4f598622e8127a25f5d4c3"}
{"path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-212-root-r6-build-r6.json", "sha256": "e331fef449745904d86143b2347b42e5e25bc384f4b93443cca40951326a6186"}
{"path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-212-root-r6-mechanical-r6.json", "sha256": "2bb5d0d01744a725f3cbcb84337d0bccef678542ec4daf16b1501ff5bfad8f96"}
{"path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-212-root-r6-print-rebuild-r6.json", "sha256": "941af6f392920d0ae1dba436bb918e1489090d323f31899713ec17ec81f99b6b"}
{"path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-212-root-r6-reproduction.json", "sha256": "b11eb47137851b23cf9c3fc331b782443018e16764cff267dcf4c2001aecb099"}
{
  "result": "PASS",
  "artifacts": 34,
  "pages_identical_to_r5": 27,
  "native_raster_pairs": 11,
  "zip_member_counts": [
    19,
    11,
    9
  ],
  "required_bonus_correction": "OPEN",
  "independent_review_QC_handoff": "PENDING"
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/212/test_source.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:53:24.027Z`
- finished_at: `2026-09-05T20:53:24.379Z`
- duration_ms: `352`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `d1a0e961db2d119b8f73abc1ec9ea8f73594383700f53dc72c68556205c392ea`

### stdout excerpt

```text

```

### stderr excerpt

```text
..........
----------------------------------------------------------------------
Ran 10 tests in 0.010s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/212/test_metadata.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:53:24.421Z`
- finished_at: `2026-09-05T20:53:24.985Z`
- duration_ms: `564`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `ffac1565fcb2eb6ccc9406ef0008635098ac41466128d9c5015e67b8d4e13c48`

### stdout excerpt

```text

```

### stderr excerpt

```text
.....
----------------------------------------------------------------------
Ran 5 tests in 0.251s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/212/check_render.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:53:25.027Z`
- finished_at: `2026-09-05T20:53:26.699Z`
- duration_ms: `1672`
- exit_code: `0`
- stdout_sha256: `7672806eec9e5533a0aa24e8537bd5ec2434f432a1f6ba5b912253a5b75a19fe`
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
      "html_sha256": "85eff0548ce75161a2935e2bb3d0bb470f30ec10e95996c670605574d89454b5",
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
      "html_sha256": "87c55209dd450e989476f2f9779feb88de9fac9bbc77a0805112a444ffb65a06",
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
      "html_sha256": "3bb83b2b2eb9b8349ed2553190a2d0288f8e75b1e0acaff06013a56f75ce971a",
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
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:53:26.749Z`
- finished_at: `2026-09-05T20:53:26.822Z`
- duration_ms: `73`
- exit_code: `0`
- stdout_sha256: `e5c3df4ef67fa06f1719b1bfcd9f8bb88d92b4811b02217ed40fecc6c39ddb01`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.2 "Opbrengsten, winst en break-even"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.2 Opbrengsten, winst en break-even
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.2 Opbrengsten, winst en break-even – paragraaf.md
  OK opgaven.md: 2.1.2 Opbrengsten, winst en break-even – opgaven.md
  OK antwoorden.md: 2.1.2 Opbrengsten, winst en break-even – antwoorden.md
  OK 2.1.2 Opbrengsten, winst en break-even – paragraaf.html (1336.0 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – opgaven.html (742.0 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – antwoorden.html (497.5 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – paragraaf.pdf (1009 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – opgaven.pdf (563 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – antwoorden.pdf (382 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 11 image refs all resolve
  OK _assets/: 11 SVGs, 11 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.2-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.2-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.2 "Opbrengsten, winst en break-even" PASSED all checks.


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:53:26.868Z`
- finished_at: `2026-09-05T20:53:26.931Z`
- duration_ms: `63`
- exit_code: `0`
- stdout_sha256: `e47cc14b57e5461a68b4359961322cc96025deb8716bd7b4ba253120eb694079`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.2 "Opbrengsten, winst en break-even"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.2 Opbrengsten, winst en break-even
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.2 Opbrengsten, winst en break-even – paragraaf.md
  OK opgaven.md: 2.1.2 Opbrengsten, winst en break-even – opgaven.md
  OK antwoorden.md: 2.1.2 Opbrengsten, winst en break-even – antwoorden.md
  OK 2.1.2 Opbrengsten, winst en break-even – paragraaf.pdf (1009 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – opgaven.pdf (563 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – antwoorden.pdf (382 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 11 image refs all resolve
  OK _assets/: 11 SVGs, 11 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.2-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.2-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.2 "Opbrengsten, winst en break-even" PASSED all checks.


```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-review-adoption-222r13-213r6.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T20:57:23.261Z`
- finished_at: `2026-09-05T20:57:23.552Z`
- duration_ms: `291`
- exit_code: `0`
- stdout_sha256: `47dc7b0f81e8a8204ad0b9860c0c4e247b385cb79cf47e854da95d638f9a0a80`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS for exact adoption assertions only",
  "checks": 179,
  "paragraph222": "Current R13 paragraph PASS WITH FLAGS; QC/handoff pending",
  "specialist213": "Current R6 REVISE; initial permissive PASS explicitly superseded; no lesson QC append adopted",
  "fresh_reviewer_page_files": 50,
  "grayscale_files": 9,
  "bonus_criteria_counts": {
    "211": 0,
    "212": 0,
    "213": 0,
    "221": 3,
    "222": 4,
    "223": 4
  },
  "required_bonus_corrections": [
    "211",
    "212",
    "213"
  ],
  "current_root213_rebuild": "NOT CLAIMED: old212 MD pin intentionally unchanged after212 R6 adoption",
  "book_final": false
}

```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:02:02.994Z`
- finished_at: `2026-09-05T21:02:03.079Z`
- duration_ms: `85`
- exit_code: `0`
- stdout_sha256: `327d7eadbdbcd4939f67f5c7fe2bba97a0d31383b2bce4bcd4a16c9fcfea72e3`
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
  OK 2.2.2 Elasticiteit en omzet – paragraaf.html (400.8 KB)
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
- started_at: `2026-09-05T21:02:03.126Z`
- finished_at: `2026-09-05T21:02:03.205Z`
- duration_ms: `79`
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
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.2.2

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:02:03.245Z`
- finished_at: `2026-09-05T21:02:05.156Z`
- duration_ms: `1911`
- exit_code: `0`
- stdout_sha256: `aa60a4cb23d1b92440304dd144a996965125533013bb34e25474645411d6cfe3`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.2

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:02:05.202Z`
- finished_at: `2026-09-05T21:02:05.775Z`
- duration_ms: `573`
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
- started_at: `2026-09-05T21:02:05.818Z`
- finished_at: `2026-09-05T21:02:05.989Z`
- duration_ms: `171`
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
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base a2f697cce2a939baa7834092bd73844da86bcb6c --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:02:27.929Z`
- finished_at: `2026-09-05T21:02:28.036Z`
- duration_ms: `107`
- exit_code: `0`
- stdout_sha256: `2a18a7c22b17c1f540ef4fb27f09223fdb745bf7ddf7ca0df83df601856cfd59`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 6
  - build-scripts/content/book-2/212/answers.md
  - build-scripts/content/book-2/212/exercises.md
  - build-scripts/content/book-2/212/target-answers.md
  - build-scripts/content/book-2/212/test_metadata.py
  - build-scripts/content/book-2/212/theory.md
  - build-scripts/content/book-2/b2_212.py
- review evidence: 172
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-010.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-011.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-012.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-013.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-014.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-baseline-r6.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-baseline-render-r5.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-build-r6.j
...[truncated 11711 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base 6ccc48911a6239dee25cffb8f29e9f42db442f9e --head ff658d865dca1ff2326527a8da22c04b7daeb49e

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:02:28.082Z`
- finished_at: `2026-09-05T21:02:28.168Z`
- duration_ms: `86`
- exit_code: `0`
- stdout_sha256: `f79f2766c89b6e25f2d75c606a45d0ccb2c9ee86591ccaa4884bf6ded7f8df82`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 15
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – antwoorden.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – antwoorden.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – antwoorden.zip
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – opgaven.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – opgaven.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – opgaven.zip
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – paragraaf.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – paragraaf.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – paragraaf.zip
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/_assets/2.1.2_ex_1.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/_assets/2.1.2_ex_3.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/_assets/2.1.2_ex_4.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/_assets/2.1.2_ex_5.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/_assets/2.1.2_we_1.svg
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2-review.md

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-planning-check.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:05:22.593Z`
- finished_at: `2026-09-05T21:05:32.126Z`
- duration_ms: `9533`
- exit_code: `0`
- stdout_sha256: `7745ccaa0cdbaa31a2c034517460333f1dd6c0064af6bdc0165143b3e6fc4865`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "kind": "planning_checks_only",
  "date": "2026-09-05",
  "builder": "paragraph_231_builder",
  "plan_path": "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus/2.3.1-textbook-plan.md",
  "plan_sha256_canonical_lf": "8d92ed823e96a773a378c74d707c2afa4cd8cb3ee3b8bcba08b217ee5883cac1",
  "source_pins": [
    {
      "repository": "lessons",
      "file": "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/_book-plan.md",
      "sha256_canonical_lf": "b6ae8e07e05337838dc38b2838a6e5db43b2e153569fa5bc490cf4bfeb8d7a76"
    },
    {
      "repository": "lessons",
      "file": "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/_chapter-plan.md",
      "sha256_canonical_lf": "e8a07bfe212a6ae817db99fecb93e86812e1d9e9af533b7ef21591bbb9025dc7"
    },
    {
      "repository": "platform",
      "file": "references/owned/course-blueprint-v6-three-year.md",
      "sha256_canonical_lf": "72fb1bc8c7b4843ac5cf4c29acfb9d117b6118eeaa1cd5fe5229604dfe412e6e"
    },
    {
      "repository": "platform",
      "file": "references/owned/course-blueprint-v5.md",
      "sha256_canonical_lf": "61130f10e7b8b6417641436f0995be090db04b11075d02878ae0a51c12b497c7"
    },
    {
      "repository": "platform",
      "file": "references/authored/course-target-exercises.json",
      "sha256_canonical_lf": "d3d7163ad82e0ddcf2f9ae1cbfa653335c96cb46762e8125bd594583f5d5885e"
    },
    {
      "repository": "platform",
      "file": "references/data/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1.candidates.json",
      "sha256_json_stringify_ordered_array": "914d1a39f18f8f9b7cf7fad938d2c42f9c2bc19671d94c24be151b1da0371310",
      "sha256_canonical_lf": "aba9f8f0408905820cc94ed49eb5f8deef4a5ed4aca66e42d1fb171c935d3675"
    }
  ],
  "target_record_sha256": "a385e00b2fffea168089c32f796668e51ae45cb325504644392f79b20bde8571",
  "exact_goals": 4,
  "target_points": [
    2,
    3,
    2,
    3,
    2
  ],
  "planned_image_alts": [
    {
      "stem": "`2.3.1_fig_1`",
      "alt": "Betalingsbereidheid en prijs van vier workshopdeelnemers.",
      "characters": 57
    },
    {
      "stem": "`2.3.1_fig_2`",
      "alt": "Assen en snijpunten van de vraag naar toegang tot de boekenbeurs.",
      "characters": 65
    },
    {
      "stem": "`2.3.1_fig_3`",
      "alt": "Vraaglijn en gegeven prijs van toegang tot de boekenbeurs.",
      "characters": 58
    },
    {
      "stem": "`2.3.1_fig_4`",
      "alt": "Consumentensurplus boven de prijslijn van de boekenbeurs.",
      "characters": 57
    },
    {
      "stem": "`2.3.1_we_1`",
      "alt": "Vraaglijn en consumentensurplus van museumbezoekers.",
      "characters": 52
    },
    {
      "stem": "`2.3.1_start_2`",
      "alt": "Vraaglijn en gegeven prijs van aquariumkaartjes.",
      "characters": 48
    },
    {
      "stem": "`2.3.1_guided_3`",
      "alt": "Vraaglijn met prijs, hoeveelheid, basis en hoogte van de tuintour.",
      "characters": 66
    },
    {
      "stem": "`2.3.1_guided_4`",
      "alt": "Assen en vraaglijn van een klimkennismaking zonder prijslijn.",
      "characters": 61
    },
    {
      "stem": "`2.3.1_answer_2`",
      "alt": "Consumentensurplus van aquariumbezoekers bij acht euro.",
      "characters": 55
    },
    {
      "stem": "`2.3.1_answer_3`",
      "alt": "Consumentensurplus van deelnemers aan de tuintour.",
      "characters": 50
    },
    {
      "stem": "`2.3.1_answer_4`",
      "alt": "Consumentensurplus van deelnemers aan de klimkennismaking.",
      "characters": 58
    },
    {
      "stem": "`2.3.1_answer_5`",
      "alt": "Vraaglijn en consumentensurplus van het bordspelmiddagbezoek.",
      "characters": 61
    },
    {
      "stem": "`2.3.1_answer_6`",
      "alt": "Vraaglijn en consumentensurplus van deelnemers aan de skateclinic.",
      "characters": 66
    },
    {
      "stem": "`2.3.1_answer_7`",
      "alt": "Vraaglijn en consumentensurplus van bezoekers aan het ta
...[truncated 8657 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base a2f697cce2a939baa7834092bd73844da86bcb6c --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:07:35.827Z`
- finished_at: `2026-09-05T21:07:35.953Z`
- duration_ms: `126`
- exit_code: `0`
- stdout_sha256: `0dbbcd717cc71169556c5154ff5573e680f8cd76e08caad30fa95dcec4928a37`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 6
  - build-scripts/content/book-2/212/answers.md
  - build-scripts/content/book-2/212/exercises.md
  - build-scripts/content/book-2/212/target-answers.md
  - build-scripts/content/book-2/212/test_metadata.py
  - build-scripts/content/book-2/212/theory.md
  - build-scripts/content/book-2/b2_212.py
- generated index/report: 4
  - reports/github-agent-index-lessen.json
  - reports/github-agent-index-lessen.md
  - reports/github-agent-index-platform.json
  - reports/github-agent-index-platform.md
- review evidence: 178
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-010.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-011.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-012.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-013.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-014.png
  - reports/sprints
...[truncated 12345 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base ff658d865dca1ff2326527a8da22c04b7daeb49e --head 917115c8da631d65eefbdb1f15c13b2291cd9e1d

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:07:36.010Z`
- finished_at: `2026-09-05T21:07:36.113Z`
- duration_ms: `103`
- exit_code: `0`
- stdout_sha256: `5fe924eb11f0c2f56f850c94ae5f5325800b27586815d2e3a31d77328a006076`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 1
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus/2.3.1-textbook-plan.md

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-root-qc-adoption-r13.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:21:46.065Z`
- finished_at: `2026-09-05T21:21:46.309Z`
- duration_ms: `244`
- exit_code: `0`
- stdout_sha256: `17746ec2df48c8f562ddaa16b709237f944d0e738ffa4032d8cdda777bd0cfe3`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS",
  "checks": 157,
  "pages": 21,
  "figures": 4,
  "grayscale": 4,
  "pdfs": 3,
  "only_current_QC_addition": true,
  "legacy_byte_prefix_unchanged": true,
  "root_handoff": "NOT_YET_CREATED",
  "visual_claim": "Exact attributed specialist bindings; no fresh root view claimed."
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/222/test_source.py -v

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:21:46.369Z`
- finished_at: `2026-09-05T21:21:47.319Z`
- duration_ms: `950`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `b792280e21e24bc61ca43a743ffde5c2182488564336380808cc527f65bbfe5d`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_all_four_assets_and_exact_revenue_geometry (__main__.Paragraph222Tests.test_all_four_assets_and_exact_revenue_geometry) ... ok
test_all_observed_calculations_exact_rational (__main__.Paragraph222Tests.test_all_observed_calculations_exact_rational) ... ok
test_all_svg_accessible_titles_are_short_noun_phrases (__main__.Paragraph222Tests.test_all_svg_accessible_titles_are_short_noun_phrases) ... ok
test_exact_frozen_target_and_goals (__main__.Paragraph222Tests.test_exact_frozen_target_and_goals) ... ok
test_exact_shared_exercise_route (__main__.Paragraph222Tests.test_exact_shared_exercise_route) ... ok
test_explanation_line_breaks_use_supported_pipeline_contract (__main__.Paragraph222Tests.test_explanation_line_breaks_use_supported_pipeline_contract) ... ok
test_frozen_registry_tamper_fails_closed (__main__.Paragraph222Tests.test_frozen_registry_tamper_fails_closed) ... ok
test_full_faded_local_and_interval_chain (__main__.Paragraph222Tests.test_full_faded_local_and_interval_chain) ... ok
test_local_conditions_and_no_numeric_small_cutoff (__main__.Paragraph222Tests.test_local_conditions_and_no_numeric_small_cutoff) ... ok
test_manifest_relocation_preserves_hashes_and_scope (__main__.Paragraph222Tests.test_manifest_relocation_preserves_hashes_and_scope) ... ok
test_native_pandoc_short_alts_preserve_full_caption (__main__.Paragraph222Tests.test_native_pandoc_short_alts_preserve_full_caption) ... ok
test_opgave4b_signed_quantity_then_price_then_ratio (__main__.Paragraph222Tests.test_opgave4b_signed_quantity_then_price_then_ratio) ... ok
test_safe_paths_and_deterministic_sources (__main__.Paragraph222Tests.test_safe_paths_and_deterministic_sources) ... ok
test_schematic_has_all_directions_and_conditions (__main__.Paragraph222Tests.test_schematic_has_all_directions_and_conditions) ... ok

----------------------------------------------------------------------
Ran 14 tests in 0.471s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/222/check_render.py --lesson-root ../4veco-lessen --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-build-r13.json --rebuild --output reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-root-qc-rebuild-r13.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:21:47.364Z`
- finished_at: `2026-09-05T21:21:55.313Z`
- duration_ms: `7949`
- exit_code: `0`
- stdout_sha256: `0ef28ad2d237d45128b2f78c5c5f44750dc87dac467208ca2e15f138010b1c89`
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
      "proof_directory": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\222-paragraaf-36feb7873637-r13",
      "all_page_hashes_match": true
    },
    {
      "kind": "opgaven",
      "pdf_sha256": "0a251a4973b1b9b0c4abca30310a3e0bda888558e079fd4895319fc496614555",
      "pages": 6,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": 14.378,
      "proof_directory": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\222-opgaven-0a251a4973b1-r13",
      "all_page_hashes_match": true
    },
    {
      "kind": "antwoorden",
      "pdf_sha256": "61cbde67e81565150128187573a766fffc9bc1d01f3bd24cbe3dacb9ddeb52b2",
      "pages": 5,
      "minimum_printed_text_pt_including_footer": 12.0,
      "minimum_placed_figure_label_pt": null,
      "proof_directory": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\rendered-proof\\BOOK2-TEXTBOOK-PRODUCTION-1\\222-antwoorden-61cbde67e815-r13",
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
- started_at: `2026-09-05T21:22:31.496Z`
- finished_at: `2026-09-05T21:22:31.574Z`
- duration_ms: `78`
- exit_code: `0`
- stdout_sha256: `327d7eadbdbcd4939f67f5c7fe2bba97a0d31383b2bce4bcd4a16c9fcfea72e3`
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
  OK 2.2.2 Elasticiteit en omzet – paragraaf.html (400.8 KB)
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
- started_at: `2026-09-05T21:22:31.621Z`
- finished_at: `2026-09-05T21:22:31.683Z`
- duration_ms: `62`
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
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.2.2

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:22:31.726Z`
- finished_at: `2026-09-05T21:22:33.581Z`
- duration_ms: `1855`
- exit_code: `0`
- stdout_sha256: `aa60a4cb23d1b92440304dd144a996965125533013bb34e25474645411d6cfe3`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.2

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:22:33.625Z`
- finished_at: `2026-09-05T21:22:34.187Z`
- duration_ms: `562`
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
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-acceptance-inventory-check.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:28:46.592Z`
- finished_at: `2026-09-05T21:28:46.980Z`
- duration_ms: `388`
- exit_code: `0`
- stdout_sha256: `f2f83315da10552f3a877b9d0b908187c8fe9ccce508046242a9ac632509a39d`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS",
  "canonical_records": 3,
  "root_fields_only": true,
  "lesson_changed_paths": [
    "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2-quality-ref.yaml",
    "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2-textbook-handoff.md"
  ],
  "handoff_sections": 9,
  "handoff_md_pdf_hashes": 6,
  "counts": {
    "A": 6,
    "C": 12,
    "L": 8,
    "P": 15
  },
  "present": 26,
  "current_pdf_hashes": 18,
  "book_complete": false
}

```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:28:47.029Z`
- finished_at: `2026-09-05T21:28:47.104Z`
- duration_ms: `75`
- exit_code: `0`
- stdout_sha256: `327d7eadbdbcd4939f67f5c7fe2bba97a0d31383b2bce4bcd4a16c9fcfea72e3`
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
  OK 2.2.2 Elasticiteit en omzet – paragraaf.html (400.8 KB)
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
- started_at: `2026-09-05T21:28:47.146Z`
- finished_at: `2026-09-05T21:28:47.211Z`
- duration_ms: `65`
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
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.2.2

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:28:47.256Z`
- finished_at: `2026-09-05T21:28:49.037Z`
- duration_ms: `1781`
- exit_code: `0`
- stdout_sha256: `aa60a4cb23d1b92440304dd144a996965125533013bb34e25474645411d6cfe3`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.2.2

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:28:49.072Z`
- finished_at: `2026-09-05T21:28:49.634Z`
- duration_ms: `562`
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
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base a2f697cce2a939baa7834092bd73844da86bcb6c --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:29:11.206Z`
- finished_at: `2026-09-05T21:29:11.317Z`
- duration_ms: `111`
- exit_code: `0`
- stdout_sha256: `048149961a24844afa458a7f41b368d2b1835962d3afa845d3befa5a172a6df3`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 6
  - build-scripts/content/book-2/212/answers.md
  - build-scripts/content/book-2/212/exercises.md
  - build-scripts/content/book-2/212/target-answers.md
  - build-scripts/content/book-2/212/test_metadata.py
  - build-scripts/content/book-2/212/theory.md
  - build-scripts/content/book-2/b2_212.py
- generated index/report: 4
  - reports/github-agent-index-lessen.json
  - reports/github-agent-index-lessen.md
  - reports/github-agent-index-platform.json
  - reports/github-agent-index-platform.md
- review evidence: 232
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-antwoorden-07a75d7b5b69-r6/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-opgaven-94ebe5d35207-r6/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-010.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-011.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-012.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-013.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/212-paragraaf-e94d42f66ab9-r6/pages/page-014.png
  - reports/sprints
...[truncated 16929 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base 917115c8da631d65eefbdb1f15c13b2291cd9e1d --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:29:11.365Z`
- finished_at: `2026-09-05T21:29:11.522Z`
- duration_ms: `157`
- exit_code: `0`
- stdout_sha256: `621ce24d06368c6b0028f1c395ca7ed631207ce1a0761a24560850d22fc07771`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 1
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2-textbook-handoff.md
- review evidence: 1
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/2.2.2-quality-ref.yaml

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-root-r7-check.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:34:13.441Z`
- finished_at: `2026-09-05T21:34:18.502Z`
- duration_ms: `5061`
- exit_code: `0`
- stdout_sha256: `933fa5a90f43820a399f930f3f579e4feaec6ee0643347a2b577d55e91dd1f3b`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS",
  "checks": 129,
  "artifacts": 24,
  "changed_artifacts": [
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 antwoorden.md",
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 antwoorden.html",
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 antwoorden.pdf",
    "2.1.3 Marginale kosten en marginale opbrengsten \u2013 antwoorden.zip"
  ],
  "unchanged_artifacts": 20,
  "exact_source_insertion": true,
  "complete_answer_DOM_reversal": true,
  "old13tests_byte_identical": true,
  "actual_pages": 30,
  "root_personally_viewed_answer_pages": 7,
  "unchanged_pupil_pages_from_root_prior_exact_transfer": 23,
  "current_root_print_only": "PASS: 24 exact artifacts",
  "current_root_full_generator": "NOT RUN: unchanged guard requires accepted212 source successor",
  "expected_historical212_md": "f53521ed8812a4c8b8c33c1d66b34e0afe8425c1dffb1723f37771372b2baa09",
  "actual_current212_md": "9350d60fadee3494124f7b0593bc1efcf00db5ea292d0a19fc3f10518e11d1f8",
  "original_pair_full_and_print_proof": "Published builder evidence bound exactly; independent R7 paragraph/QC still pending",
  "canonical_review_QC": "R6/legacy unchanged; no acceptance/handoff"
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/213/test_source.py -v

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:34:18.550Z`
- finished_at: `2026-09-05T21:34:19.817Z`
- duration_ms: `1267`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `94e38b66d56452de1221eb4b7b7598233892e3e77fe44b193d735a8d3839e00d`

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
test_native_pandoc_short_alts_keep_full_captions (__main__.SourceTests.test_native_pandoc_short_alts_keep_full_captions) ... ok
test_original_long_alts_and_caption_loss_are_rejected (__main__.SourceTests.test_original_long_alts_and_caption_loss_are_rejected) ... ok
test_retrieval_combination_and_unequal_intervals (__main__.SourceTests.test_retrieval_combination_and_unequal_intervals) ... ok
test_six_assets_safe_geometry_large_type (__main__.SourceTests.test_six_assets_safe_geometry_large_type) ... ok
test_six_exact_noun_first_accessible_titles (__main__.SourceTests.test_six_exact_noun_first_accessible_titles) ... ok

----------------------------------------------------------------------
Ran 13 tests in 0.792s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/213/test_bonus_contract.py -v

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:34:19.857Z`
- finished_at: `2026-09-05T21:34:20.280Z`
- duration_ms: `423`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `378357b36a13640d21cd6eff458282e4edea37d3992822fd4b72da908e4c684a`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_bad_position_count_and_coverage_are_rejected (__main__.BonusCriteriaTests.test_bad_position_count_and_coverage_are_rejected) ... ok
test_current_source_contains_bounded_criteria (__main__.BonusCriteriaTests.test_current_source_contains_bounded_criteria) ... ok
test_native_answer_html_preserves_three_criteria (__main__.BonusCriteriaTests.test_native_answer_html_preserves_three_criteria) ... ok
test_old_missing_block_negative_fixture_is_rejected (__main__.BonusCriteriaTests.test_old_missing_block_negative_fixture_is_rejected) ... ok

----------------------------------------------------------------------
Ran 4 tests in 0.112s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/213/check_render.py reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-root-native-r7.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:34:20.326Z`
- finished_at: `2026-09-05T21:34:29.469Z`
- duration_ms: `9143`
- exit_code: `0`
- stdout_sha256: `751e7a6bfea46577d1438a1238fd6100dea87e740f80ac51d0d1d3aeb8cba5a0`
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
      "html_sha256": "2f8d85e29fa7e734269f92b68510a9e21f196807c5c105fe7157e70d17f09f5b",
      "zip_sha256": "15ffc25da00d0f3bfc84f93224191a08c9ab31387f7dc873a8df85dc7b76b499",
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
      ],
      "actual_html_alternatives": [
        {
          "asset": "2.1.3_fig_1",
          "alt": "Dezelfde dag: de tabelstappen van 0 naar 10 en van 10 naar 20 fotohouders, met TK 20, 50 en 100 euro.",
          "length": 101,
          "caption": "Dezelfde dag: de tabelstappen van 0 naar 10 en van 10 naar 20 fotohouders, met TK 20, 50 en 100 euro.",
          "caption_attributes": {
            "aria-hidden": "true"
          }
        },
        {
          "asset": "2.1.3_fig_2",
          "alt": "Dezelfde kostentabel met delta TK 30 en 50 euro, telkens delta Q 10, en MK 3 en 5 euro bij de rechter eindpunten.",
          "length": 113,
          "caption": "Dezelfde kostentabel met delta TK 30 en 50 euro, telkens delta Q 10, en MK 3 en 5 euro bij de rechter eindpunten.",
          "caption_attributes": {
            "aria-hidden": "true"
          }
        },
        {
          "asset": "2.1.3_fig_3",
          "alt": "MO bij vaste prijs: 80 euro extra opbrengst voor 10 extra fotohouders in beide intervallen, dus 8 euro per houder.",
          "length": 114,
          "caption": "Bij dezelfde hoeveelheden 0, 10 en 20 zijn de opbrengsten 0, 80 en 160 euro. Beide intervallen leveren 80 euro extra voor 10 extra producten: MO is telkens 8.",
          "caption_attributes": {}
        },
        {
          "asset": "2.1.3_fig_4",
          "alt": "Winsttoename per extra fotohouder: 5 euro in interval 0�10 en 3 euro in interval 10�20, telkens MO min MK.",
          "length": 106,
          "caption": "Twee intervalkaarten: winst van min 20 naar 30 geeft 50 gedeeld door 10 is 5; winst van 30 naar 60 geeft 30 gedeeld door 10 is 3. Dit is telkens MO min MK.",
          "caption_attributes": {}
        },
        {
          "asset": "2.1.3_we_1",
          "alt": "Eindpuntrijen van Lus en Bout: MK 2/2/2 tegenover 2/6/10; MO steeds 6 en 12 euro per extra
...[truncated 7952 chars]
```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:37:00.151Z`
- finished_at: `2026-09-05T21:37:00.224Z`
- duration_ms: `73`
- exit_code: `0`
- stdout_sha256: `98bd0a69fe0a84b61cd2ed9635d378e905bb82e75b4279ce2e15b0986040379e`
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
  OK 2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.html (1263.7 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – opgaven.html (578.9 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.html (20.4 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.pdf (948 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – opgaven.pdf (442 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.pdf (34 KB)
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
- started_at: `2026-09-05T21:37:00.269Z`
- finished_at: `2026-09-05T21:37:00.341Z`
- duration_ms: `72`
- exit_code: `0`
- stdout_sha256: `dc454777bafb685d317d638022b0c33c1356f990582381e94a5320e8e78539ff`
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
  OK 2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.pdf (34 KB)
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
- started_at: `2026-09-05T21:37:00.384Z`
- finished_at: `2026-09-05T21:37:02.486Z`
- duration_ms: `2102`
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
- started_at: `2026-09-05T21:37:02.528Z`
- finished_at: `2026-09-05T21:37:03.101Z`
- duration_ms: `573`
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
- started_at: `2026-09-05T21:37:03.166Z`
- finished_at: `2026-09-05T21:37:03.493Z`
- duration_ms: `327`
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
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-r7-inventory-check.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:38:12.553Z`
- finished_at: `2026-09-05T21:38:12.660Z`
- duration_ms: `107`
- exit_code: `0`
- stdout_sha256: `b92b8d2d205a4eef89b747fc3f10005f54fd4621a2d3616725d7838863d27e2c`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS",
  "counts": {
    "A": 6,
    "C": 12,
    "L": 8,
    "P": 15
  },
  "present": 26,
  "current_pdf_hashes": 18,
  "paragraph213": "R7 candidate; old canonical review/QC preserved, no handoff",
  "book_complete": false
}

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base 5dd87192f242854d6db6af668a28c3e1c9677be3 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:38:13.105Z`
- finished_at: `2026-09-05T21:38:13.219Z`
- duration_ms: `114`
- exit_code: `0`
- stdout_sha256: `62530894262d442542fa0580d5fb7976a502e395e0dc121341394fc6c937c27c`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 2
  - build-scripts/content/book-2/213/answers.md
  - build-scripts/content/book-2/213/test_bonus_contract.py
- review evidence: 64
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-d96f21c3abed-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-d96f21c3abed-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-d96f21c3abed-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-d96f21c3abed-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-d96f21c3abed-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-d96f21c3abed-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-d96f21c3abed-r7/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-d96f21c3abed-r7/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-antwoorden-d96f21c3abed-r7/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r7/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r7/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r7/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r7/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-opgaven-d12487671bd2-r7/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r7/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r7/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r7/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r7/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r7/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r7/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r7/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r7/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r7/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r7/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r7/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r7/pages/page-010.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r7/pages/page-011.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r7/pages/page-012.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r7/pages/page-013.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/213-paragraaf-534177c8280e-r7/pages/page-014.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-BONUS-build-r7.json
  - reports/sprints/BOOK2-TE
...[truncated 2097 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base f338159502438a0833f3d94e4956eeb8b0812a6d --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:38:13.272Z`
- finished_at: `2026-09-05T21:38:13.357Z`
- duration_ms: `85`
- exit_code: `0`
- stdout_sha256: `d6cfc302e234738dba15d4f805656f60c96cebb771674f3713196ac98b49b3bb`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 4
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.zip

```

### stderr excerpt

```text

```
## C:/Python314/python.exe -m unittest discover -s build-scripts/content/book-2/211 -p test_source.py -v

- cwd: `C:\wt\book2-211-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:24:04.211Z`
- finished_at: `2026-09-05T21:24:04.914Z`
- duration_ms: `703`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `3155d13bb939287a790682a86c6f1f09d1a3fa97912292f8fd6618ca7e879f9c`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_accessible_svg_titles_are_concise_noun_first (test_source.SourceContractTests.test_accessible_svg_titles_are_concise_noun_first) ... ok
test_answer_coverage (test_source.SourceContractTests.test_answer_coverage) ... ok
test_canonical_exercise_source_shared (test_source.SourceContractTests.test_canonical_exercise_source_shared) ... ok
test_exact_four_goals (test_source.SourceContractTests.test_exact_four_goals) ... ok
test_figures_add_one_relationship_at_a_time (test_source.SourceContractTests.test_figures_add_one_relationship_at_a_time) ... ok
test_numeric_models_independently_recomputed (test_source.SourceContractTests.test_numeric_models_independently_recomputed) ... ok
test_proof_revision_rejects_path_components_before_any_write (test_source.SourceContractTests.test_proof_revision_rejects_path_components_before_any_write) ... ok
test_reproducible_sources_and_assets (test_source.SourceContractTests.test_reproducible_sources_and_assets) ... ok
test_six_assets_and_every_reference (test_source.SourceContractTests.test_six_assets_and_every_reference) ... ok
test_source_letters_are_not_pandoc_auto_lists (test_source.SourceContractTests.test_source_letters_are_not_pandoc_auto_lists) ... ok
test_target_exact_source_and_points (test_source.SourceContractTests.test_target_exact_source_and_points) ... ok
test_target_table_retains_every_frozen_cell (test_source.SourceContractTests.test_target_table_retains_every_frozen_cell) ... ok
test_worked_image_native_short_alt_keeps_entire_caption (test_source.SourceContractTests.test_worked_image_native_short_alt_keeps_entire_caption) ... ok

----------------------------------------------------------------------
Ran 13 tests in 0.208s

OK

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.1.1

- cwd: `C:\wt\book2-211-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:24:04.977Z`
- finished_at: `2026-09-05T21:24:06.910Z`
- duration_ms: `1933`
- exit_code: `0`
- stdout_sha256: `2588f67f1bb250f78fd94fc551099e1000c659528e8d3a89119566c3a55d52cd`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.1

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-211-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:24:06.954Z`
- finished_at: `2026-09-05T21:24:07.511Z`
- duration_ms: `557`
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
## C:/Python314/python.exe -m unittest discover -s build-scripts/content/book-2/211 -p test_bonus.py -v

- cwd: `C:\wt\book2-211-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:24:56.073Z`
- finished_at: `2026-09-05T21:24:58.667Z`
- duration_ms: `2594`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `b2255f893df4a82411a3e990dcc31be605332cd12616781e6f3c124de6a1a3a0`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_all_original_test_bodies_and_generator_remain_exact (test_bonus.BonusContractTests.test_all_original_test_bodies_and_generator_remain_exact) ... ok
test_changed_existing_model_answer_is_rejected (test_bonus.BonusContractTests.test_changed_existing_model_answer_is_rejected) ... ok
test_current_complete_sources_equal_exact_insertion (test_bonus.BonusContractTests.test_current_complete_sources_equal_exact_insertion) ... FAIL
test_extra_criterion_is_rejected (test_bonus.BonusContractTests.test_extra_criterion_is_rejected) ... ok
test_misplaced_block_is_rejected (test_bonus.BonusContractTests.test_misplaced_block_is_rejected) ... ok
test_missing_one_criterion_is_rejected (test_bonus.BonusContractTests.test_missing_one_criterion_is_rejected) ... ok
test_real_old_missing_block_is_rejected (test_bonus.BonusContractTests.test_real_old_missing_block_is_rejected) ... ok
test_unrelated_source_drift_is_rejected (test_bonus.BonusContractTests.test_unrelated_source_drift_is_rejected) ... ok

======================================================================
FAIL: test_current_complete_sources_equal_exact_insertion (test_bonus.BonusContractTests.test_current_complete_sources_equal_exact_insertion)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\wt\book2-211-bonus-correction-20260905\4veco-platform\build-scripts\content\book-2\211\test_bonus.py", line 55, in test_current_complete_sources_equal_exact_insertion
    require_exact_sources({name: (builder.CONTENT / name).read_text(encoding="utf-8")
    ~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                           for name in NAMES})
                           ^^^^^^^^^^^^^^^^^^^
  File "C:\wt\book2-211-bonus-correction-20260905\4veco-platform\build-scripts\content\book-2\211\test_bonus.py", line 50, in require_exact_sources
    raise AssertionError(f"Exact reviewed-base plus bonus insertion differs: {name}")
AssertionError: Exact reviewed-base plus bonus insertion differs: answers.md

----------------------------------------------------------------------
Ran 8 tests in 2.203s

FAILED (failures=1)

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-BONUS-evidence.py capture

- cwd: `C:\wt\book2-211-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:27:18.499Z`
- finished_at: `2026-09-05T21:27:19.552Z`
- duration_ms: `1053`
- exit_code: `0`
- stdout_sha256: `7f76725c132aa89db48e4f06c2da5a172426f00e927226dcbf1fe980e3bc9129`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{"baseline": "C:\\wt\\book2-211-bonus-correction-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-211-BONUS-baseline-r5.json", "files": 21, "sha256": "879a7c2731f15a57bc33cfaacd98ed47bff05b734ba051927a7ffb8b683ee372"}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe -m unittest discover -s build-scripts/content/book-2/211 -p "test_*.py" -v

- cwd: `C:\wt\book2-211-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:27:37.558Z`
- finished_at: `2026-09-05T21:27:40.307Z`
- duration_ms: `2749`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `2fa1ded14b23a86a1599820f132ea45193f865099e7b3af7276dde313668a9ce`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_all_original_test_bodies_and_generator_remain_exact (test_bonus.BonusContractTests.test_all_original_test_bodies_and_generator_remain_exact) ... ok
test_changed_existing_model_answer_is_rejected (test_bonus.BonusContractTests.test_changed_existing_model_answer_is_rejected) ... ok
test_current_complete_sources_equal_exact_insertion (test_bonus.BonusContractTests.test_current_complete_sources_equal_exact_insertion) ... ok
test_extra_criterion_is_rejected (test_bonus.BonusContractTests.test_extra_criterion_is_rejected) ... ok
test_misplaced_block_is_rejected (test_bonus.BonusContractTests.test_misplaced_block_is_rejected) ... ok
test_missing_one_criterion_is_rejected (test_bonus.BonusContractTests.test_missing_one_criterion_is_rejected) ... ok
test_real_old_missing_block_is_rejected (test_bonus.BonusContractTests.test_real_old_missing_block_is_rejected) ... ok
test_unrelated_source_drift_is_rejected (test_bonus.BonusContractTests.test_unrelated_source_drift_is_rejected) ... ok
test_accessible_svg_titles_are_concise_noun_first (test_source.SourceContractTests.test_accessible_svg_titles_are_concise_noun_first) ... ok
test_answer_coverage (test_source.SourceContractTests.test_answer_coverage) ... ok
test_canonical_exercise_source_shared (test_source.SourceContractTests.test_canonical_exercise_source_shared) ... ok
test_exact_four_goals (test_source.SourceContractTests.test_exact_four_goals) ... ok
test_figures_add_one_relationship_at_a_time (test_source.SourceContractTests.test_figures_add_one_relationship_at_a_time) ... ok
test_numeric_models_independently_recomputed (test_source.SourceContractTests.test_numeric_models_independently_recomputed) ... ok
test_proof_revision_rejects_path_components_before_any_write (test_source.SourceContractTests.test_proof_revision_rejects_path_components_before_any_write) ... ok
test_reproducible_sources_and_assets (test_source.SourceContractTests.test_reproducible_sources_and_assets) ... ok
test_six_assets_and_every_reference (test_source.SourceContractTests.test_six_assets_and_every_reference) ... ok
test_source_letters_are_not_pandoc_auto_lists (test_source.SourceContractTests.test_source_letters_are_not_pandoc_auto_lists) ... ok
test_target_exact_source_and_points (test_source.SourceContractTests.test_target_exact_source_and_points) ... ok
test_target_table_retains_every_frozen_cell (test_source.SourceContractTests.test_target_table_retains_every_frozen_cell) ... ok
test_worked_image_native_short_alt_keeps_entire_caption (test_source.SourceContractTests.test_worked_image_native_short_alt_keeps_entire_caption) ... ok

----------------------------------------------------------------------
Ran 21 tests in 2.361s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/b2_211.py --proof-root reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1 --proof-suffix r5 --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-BONUS-build-r5.json

- cwd: `C:\wt\book2-211-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:27:40.354Z`
- finished_at: `2026-09-05T21:27:54.863Z`
- duration_ms: `14509`
- exit_code: `0`
- stdout_sha256: `99b917d7cf772c53b1c369fff49ba946cd53a9e6e7cfa3f1e6b83d53ffb55a46`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.1
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{
  "paragraph": "2.1.1",
  "target_record_sha256": "143f1053c98766b77d9d9ce573a5c8e976980f900387159312c3238288d71710",
  "plan_sha256": "f46c7aa444ba6fef1f6f885b34bd52963fccac3cdc7b13b898eb6665219c4cd0",
  "chapter_sha256": "ef3f872f5caa2de1359639983d8e4907a34cfcbc80a0309826cff07201e49116",
  "input_sources": [
    {
      "path": "C:\\wt\\book2-211-bonus-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\b2_211.py",
      "sha256": "621b68dea3e3e77608ae2b294dc6d6c47e01b525c2ca8b203e683b101e8e3d4f"
    },
    {
      "path": "C:\\wt\\book2-211-bonus-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\print_pipeline.py",
      "sha256": "51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5"
    },
    {
      "path": "C:\\wt\\book2-211-bonus-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\211\\theory.md",
      "sha256": "c945ae6634ebbcd4b6411ccbaa8394c5abcc5a1a6b85326588a28a7629c79dfe"
    },
    {
      "path": "C:\\wt\\book2-211-bonus-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\211\\exercises.md",
      "sha256": "a5e82f2cf9d0b89b749dd7590d7023f9ce8a780ce48402365a7bef2c628dd4b9"
    },
    {
      "path": "C:\\wt\\book2-211-bonus-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\211\\answers.md",
      "sha256": "86bde131fb02951fda0731d4f56cd1c31128aa80f19176e4e75849a65401b4a7"
    },
    {
      "path": "C:\\wt\\book2-211-bonus-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\211\\target-answers.md",
      "sha256": "e7ddb5385e91f18c24ca856e99a7bbd21a8de57b660be5335ef4cc4650280e94"
    }
  ],
  "inspection_status": "PENDING",
  "documents": [
    {
      "source_md": "C:\\wt\\book2-211-bonus-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 paragraaf.md",
      "source_sha256": "de7abc910f6ec940eb329abd003085921f32409956ec1e0450bcc4a5454eb6b5",
      "source_html": "C:\\wt\\book2-211-bonus-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 paragraaf.html",
      "html_sha256": "10721f1ad745b8e1358ba354c5ded64a74367f5081eaf1c676ecb88dbe10e44b",
      "source_pdf": "C:\\wt\\book2-211-bonus-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\2.1.1 Kostenstructuren \u2013 paragraaf.pdf",
      "pdf_sha256": "9837e3a85f3129a5309a36b17fd1030702ba92fc7ef464af609cb878e4d2f8b0",
      "assets": [
        {
          "path": "C:\\wt\\book2-211-bonus-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\_assets\\2.1.1_fig_2.svg",
          "sha256": "bbf506bd1be95e272a9bd31a42143147f58dc545c5ff243ff8d026b0d4c6c66d"
        },
        {
          "path": "C:\\wt\\book2-211-bonus-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.1 Kostenstructuren\\_assets\\2.1.1_fig_2.png",
          "sha256": "74f1384715e922ca04d10aa2978b852a98511044c6478f40e4bb260f72e0f8a8"
        },
        {
          "path": "C:\\wt\\book2-211-bonus-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofd
...[truncated 7119 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/211/check_render.py

- cwd: `C:\wt\book2-211-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:28:19.994Z`
- finished_at: `2026-09-05T21:28:20.933Z`
- duration_ms: `939`
- exit_code: `0`
- stdout_sha256: `2f2f228314401c3705aa5341d9e4deef008f80215df96c09b079929040abd5de`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "paragraph": "2.1.1",
  "automated_checks": [
    "all printed text including footer >=12pt",
    "all exercises present",
    "exact target context/prompts in HTML and PDF",
    "literal a-e plus4/3/3/3/4points",
    "exact supplied header/row cells",
    "four exact goals in paragraph PDF",
    "identical exercise HTML fragments"
  ],
  "documents": [
    {
      "kind": "paragraaf",
      "pages": 15,
      "minimum_printed_font_pt_including_footer": 12.0,
      "pdf_sha256": "9837e3a85f3129a5309a36b17fd1030702ba92fc7ef464af609cb878e4d2f8b0"
    },
    {
      "kind": "opgaven",
      "pages": 9,
      "minimum_printed_font_pt_including_footer": 12.0,
      "pdf_sha256": "97329415bacc150675a327ad31455b25b8e9e1b03012ef6b65dab10ab1f02953"
    },
    {
      "kind": "antwoorden",
      "pages": 7,
      "minimum_printed_font_pt_including_footer": 12.0,
      "pdf_sha256": "498b9a863eef9c0feefd50e8a50e72aa41c626caaca79f0b98261b8b3104e5ce"
    }
  ],
  "visual_review_status": "NOT_SUPPLIED_BY_THIS_SCRIPT"
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-BONUS-evidence.py verify

- cwd: `C:\wt\book2-211-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:28:20.981Z`
- finished_at: `2026-09-05T21:28:26.589Z`
- duration_ms: `5608`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `56249676bce4c948beb71cb5ce01ae5e56decf86814b553dbcd67b707fd2301a`

### stdout excerpt

```text

```

### stderr excerpt

```text
Traceback (most recent call last):
  File "C:\wt\book2-211-bonus-correction-20260905\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-211-BONUS-evidence.py", line 198, in <module>
    {"capture": capture, "verify": verify, "rebuild": rebuild}[sys.argv[1]]()
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^
  File "C:\wt\book2-211-bonus-correction-20260905\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-211-BONUS-evidence.py", line 109, in verify
    assert [" ".join(li.get_text().split()) for li in criteria.find_all("li", recursive=False)] == wanted
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-BONUS-evidence.py verify

- cwd: `C:\wt\book2-211-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:28:55.882Z`
- finished_at: `2026-09-05T21:28:58.958Z`
- duration_ms: `3076`
- exit_code: `0`
- stdout_sha256: `a95a2b5888c21df1d2b00dc6a566a6bf3cc62f0648cf2f2a9ee718fcdcfbaeea`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{"evidence": "C:\\wt\\book2-211-bonus-correction-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-211-BONUS-mechanical-r5.json", "sha256": "67eb0db75d4eee6896b742696f452b503e84b8165dc6fa39a9d9b394a9070a79", "pages": {"paragraaf": 15, "opgaven": 9, "antwoorden": 7}}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-BONUS-evidence.py rebuild

- cwd: `C:\wt\book2-211-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:28:59.002Z`
- finished_at: `2026-09-05T21:29:10.051Z`
- duration_ms: `11049`
- exit_code: `0`
- stdout_sha256: `42bcf0cfa79d38627e3fa36931df7b166040f3434bacb06f5b8d14a594a33c95`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.1
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{"evidence": "C:\\wt\\book2-211-bonus-correction-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-211-BONUS-reproduction-r5.json", "sha256": "b1a1b02dd5088f75821ee0c6e229c602eb748c9a2436cdedc9d2c31adceee58f", "files": 21}

```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-211-bonus-correction-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren\""

- cwd: `C:\wt\book2-211-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:33:56.842Z`
- finished_at: `2026-09-05T21:33:57.004Z`
- duration_ms: `162`
- exit_code: `0`
- stdout_sha256: `b74a6f2fb87ffe97e119de1abbb595991f1c9f4b0f8d7b0e2812c58a6a10a9a8`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.1 "Kostenstructuren"
Path: C:\wt\book2-211-bonus-correction-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.1 Kostenstructuren
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.1 Kostenstructuren – paragraaf.md
  OK opgaven.md: 2.1.1 Kostenstructuren – opgaven.md
  OK antwoorden.md: 2.1.1 Kostenstructuren – antwoorden.md
  OK 2.1.1 Kostenstructuren – paragraaf.html (710.4 KB)
  OK 2.1.1 Kostenstructuren – opgaven.html (245.1 KB)
  OK 2.1.1 Kostenstructuren – antwoorden.html (18.8 KB)
  OK 2.1.1 Kostenstructuren – paragraaf.pdf (518 KB)
  OK 2.1.1 Kostenstructuren – opgaven.pdf (188 KB)
  OK 2.1.1 Kostenstructuren – antwoorden.pdf (31 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 6 image refs all resolve
  OK _assets/: 6 SVGs, 6 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.1 "Kostenstructuren" PASSED all checks.


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-211-bonus-correction-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren\""

- cwd: `C:\wt\book2-211-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:33:57.056Z`
- finished_at: `2026-09-05T21:33:57.138Z`
- duration_ms: `82`
- exit_code: `0`
- stdout_sha256: `9f42f8632b8126fae5222f2182f3337874a9ffbd859e30adeafdb3340c6d04d4`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.1 "Kostenstructuren"
Path: C:\wt\book2-211-bonus-correction-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.1 Kostenstructuren
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.1 Kostenstructuren – paragraaf.md
  OK opgaven.md: 2.1.1 Kostenstructuren – opgaven.md
  OK antwoorden.md: 2.1.1 Kostenstructuren – antwoorden.md
  OK 2.1.1 Kostenstructuren – paragraaf.pdf (518 KB)
  OK 2.1.1 Kostenstructuren – opgaven.pdf (188 KB)
  OK 2.1.1 Kostenstructuren – antwoorden.pdf (31 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 6 image refs all resolve
  OK _assets/: 6 SVGs, 6 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.1 "Kostenstructuren" PASSED all checks.


```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.1.1

- cwd: `C:\wt\book2-211-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:33:57.201Z`
- finished_at: `2026-09-05T21:33:59.174Z`
- duration_ms: `1973`
- exit_code: `0`
- stdout_sha256: `2588f67f1bb250f78fd94fc551099e1000c659528e8d3a89119566c3a55d52cd`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.1

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-211-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:33:59.216Z`
- finished_at: `2026-09-05T21:33:59.775Z`
- duration_ms: `559`
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
## C:/Python314/python.exe -m unittest discover -s build-scripts/content/book-2/211 -p "test_*.py" -v

- cwd: `C:\wt\book2-211-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:36:33.704Z`
- finished_at: `2026-09-05T21:36:36.334Z`
- duration_ms: `2630`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `c7f4b1d3ebe88051a89be62fef5f3b92b42b3356943fd4839bd0c3338ddc8823`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_all_original_test_bodies_and_generator_remain_exact (test_bonus.BonusContractTests.test_all_original_test_bodies_and_generator_remain_exact) ... ok
test_changed_existing_model_answer_is_rejected (test_bonus.BonusContractTests.test_changed_existing_model_answer_is_rejected) ... ok
test_current_complete_sources_equal_exact_insertion (test_bonus.BonusContractTests.test_current_complete_sources_equal_exact_insertion) ... ok
test_extra_criterion_is_rejected (test_bonus.BonusContractTests.test_extra_criterion_is_rejected) ... ok
test_misplaced_block_is_rejected (test_bonus.BonusContractTests.test_misplaced_block_is_rejected) ... ok
test_missing_one_criterion_is_rejected (test_bonus.BonusContractTests.test_missing_one_criterion_is_rejected) ... ok
test_real_old_missing_block_is_rejected (test_bonus.BonusContractTests.test_real_old_missing_block_is_rejected) ... ok
test_unrelated_source_drift_is_rejected (test_bonus.BonusContractTests.test_unrelated_source_drift_is_rejected) ... ok
test_accessible_svg_titles_are_concise_noun_first (test_source.SourceContractTests.test_accessible_svg_titles_are_concise_noun_first) ... ok
test_answer_coverage (test_source.SourceContractTests.test_answer_coverage) ... ok
test_canonical_exercise_source_shared (test_source.SourceContractTests.test_canonical_exercise_source_shared) ... ok
test_exact_four_goals (test_source.SourceContractTests.test_exact_four_goals) ... ok
test_figures_add_one_relationship_at_a_time (test_source.SourceContractTests.test_figures_add_one_relationship_at_a_time) ... ok
test_numeric_models_independently_recomputed (test_source.SourceContractTests.test_numeric_models_independently_recomputed) ... ok
test_proof_revision_rejects_path_components_before_any_write (test_source.SourceContractTests.test_proof_revision_rejects_path_components_before_any_write) ... ok
test_reproducible_sources_and_assets (test_source.SourceContractTests.test_reproducible_sources_and_assets) ... ok
test_six_assets_and_every_reference (test_source.SourceContractTests.test_six_assets_and_every_reference) ... ok
test_source_letters_are_not_pandoc_auto_lists (test_source.SourceContractTests.test_source_letters_are_not_pandoc_auto_lists) ... ok
test_target_exact_source_and_points (test_source.SourceContractTests.test_target_exact_source_and_points) ... ok
test_target_table_retains_every_frozen_cell (test_source.SourceContractTests.test_target_table_retains_every_frozen_cell) ... ok
test_worked_image_native_short_alt_keeps_entire_caption (test_source.SourceContractTests.test_worked_image_native_short_alt_keeps_entire_caption) ... ok

----------------------------------------------------------------------
Ran 21 tests in 2.218s

OK

```
## node build-scripts/sprints/check-sprint-bundle.js BOOK2-TEXTBOOK-PRODUCTION-1

- cwd: `C:\wt\book2-211-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:36:36.380Z`
- finished_at: `2026-09-05T21:36:36.693Z`
- duration_ms: `313`
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
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base 2bf6260c5d4d799c5408f898d0dab126eff9e5ac --head b19579e58bb6597a964dfe7d0a8ca1dcab199ed4

- cwd: `C:\wt\book2-211-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:38:02.274Z`
- finished_at: `2026-09-05T21:38:02.475Z`
- duration_ms: `201`
- exit_code: `0`
- stdout_sha256: `04a05855a6f221df011f5729f011196d45710cc64ccf4820a496c941f6d56d76`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 2
  - build-scripts/content/book-2/211/answers.md
  - build-scripts/content/book-2/211/test_bonus.py
- review evidence: 58
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-010.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-011.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-012.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-013.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-014.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-015.png
  - r
...[truncated 1729 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base 917115c8da631d65eefbdb1f15c13b2291cd9e1d --head 45064bdfe0c1548f25f097eef648400382403cdf

- cwd: `C:\wt\book2-211-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:38:02.534Z`
- finished_at: `2026-09-05T21:38:02.661Z`
- duration_ms: `127`
- exit_code: `0`
- stdout_sha256: `e74c202251b1d2845e308886ffdbaeefb39d7562e4ae0960c405c822e5a14cdb`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 3
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – antwoorden.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – antwoorden.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – antwoorden.pdf

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-root-r5-check.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:55:18.394Z`
- finished_at: `2026-09-05T21:55:33.738Z`
- duration_ms: `15344`
- exit_code: `0`
- stdout_sha256: `9065980f24c5c3525789b6989ff4c268a6a79b65c231fb3980e16a9b04b2d48e`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.1
Book 2 target authority remediation: PASS
- mode: durable frozen-package and lifecycle invariant
- exact candidate records: 12
- goal/question alignment and workload budgets: complete
- unrelated-record scope checks: delegated to the PR-scoped sprint guard
{"evidence": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-211-root-r5-mechanical-r5.json", "sha256": "c446923e3df6c3a1980d75d214467637a8d3afa70aa653e3cfc3bbe790c1fcd9", "pages": {"paragraaf": 15, "opgaven": 9, "antwoorden": 7}}
{"evidence": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-211-root-r5-reproduction-r5.json", "sha256": "b1a1b02dd5088f75821ee0c6e229c602eb748c9a2436cdedc9d2c31adceee58f", "files": 21}
{"result": "PASS", "full_and_print_native_files": 21, "pages": 31, "changed_pages": [["antwoorden", "pages/page-007.png"]], "binding": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-211-root-r5-binding.json"}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe -m unittest discover -s build-scripts/content/book-2/211 -p "test*.py" -v

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:55:41.017Z`
- finished_at: `2026-09-05T21:55:43.694Z`
- duration_ms: `2677`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `21e9d110b645e4415f4e7e9f67d49145e8b5eb3efdbafdcdcea05d6757e87cab`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_all_original_test_bodies_and_generator_remain_exact (test_bonus.BonusContractTests.test_all_original_test_bodies_and_generator_remain_exact) ... ok
test_changed_existing_model_answer_is_rejected (test_bonus.BonusContractTests.test_changed_existing_model_answer_is_rejected) ... ok
test_current_complete_sources_equal_exact_insertion (test_bonus.BonusContractTests.test_current_complete_sources_equal_exact_insertion) ... ok
test_extra_criterion_is_rejected (test_bonus.BonusContractTests.test_extra_criterion_is_rejected) ... ok
test_misplaced_block_is_rejected (test_bonus.BonusContractTests.test_misplaced_block_is_rejected) ... ok
test_missing_one_criterion_is_rejected (test_bonus.BonusContractTests.test_missing_one_criterion_is_rejected) ... ok
test_real_old_missing_block_is_rejected (test_bonus.BonusContractTests.test_real_old_missing_block_is_rejected) ... ok
test_unrelated_source_drift_is_rejected (test_bonus.BonusContractTests.test_unrelated_source_drift_is_rejected) ... ok
test_accessible_svg_titles_are_concise_noun_first (test_source.SourceContractTests.test_accessible_svg_titles_are_concise_noun_first) ... ok
test_answer_coverage (test_source.SourceContractTests.test_answer_coverage) ... ok
test_canonical_exercise_source_shared (test_source.SourceContractTests.test_canonical_exercise_source_shared) ... ok
test_exact_four_goals (test_source.SourceContractTests.test_exact_four_goals) ... ok
test_figures_add_one_relationship_at_a_time (test_source.SourceContractTests.test_figures_add_one_relationship_at_a_time) ... ok
test_numeric_models_independently_recomputed (test_source.SourceContractTests.test_numeric_models_independently_recomputed) ... ok
test_proof_revision_rejects_path_components_before_any_write (test_source.SourceContractTests.test_proof_revision_rejects_path_components_before_any_write) ... ok
test_reproducible_sources_and_assets (test_source.SourceContractTests.test_reproducible_sources_and_assets) ... ok
test_six_assets_and_every_reference (test_source.SourceContractTests.test_six_assets_and_every_reference) ... ok
test_source_letters_are_not_pandoc_auto_lists (test_source.SourceContractTests.test_source_letters_are_not_pandoc_auto_lists) ... ok
test_target_exact_source_and_points (test_source.SourceContractTests.test_target_exact_source_and_points) ... ok
test_target_table_retains_every_frozen_cell (test_source.SourceContractTests.test_target_table_retains_every_frozen_cell) ... ok
test_worked_image_native_short_alt_keeps_entire_caption (test_source.SourceContractTests.test_worked_image_native_short_alt_keeps_entire_caption) ... ok

----------------------------------------------------------------------
Ran 21 tests in 2.339s

OK

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:56:14.413Z`
- finished_at: `2026-09-05T21:56:14.510Z`
- duration_ms: `97`
- exit_code: `0`
- stdout_sha256: `4fc27f991b8fac500c91ffc07a09671a5d48514bac4a3a017c104007c2f36838`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.1 "Kostenstructuren"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.1 Kostenstructuren
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.1 Kostenstructuren – paragraaf.md
  OK opgaven.md: 2.1.1 Kostenstructuren – opgaven.md
  OK antwoorden.md: 2.1.1 Kostenstructuren – antwoorden.md
  OK 2.1.1 Kostenstructuren – paragraaf.html (710.4 KB)
  OK 2.1.1 Kostenstructuren – opgaven.html (245.1 KB)
  OK 2.1.1 Kostenstructuren – antwoorden.html (18.8 KB)
  OK 2.1.1 Kostenstructuren – paragraaf.pdf (518 KB)
  OK 2.1.1 Kostenstructuren – opgaven.pdf (188 KB)
  OK 2.1.1 Kostenstructuren – antwoorden.pdf (31 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 6 image refs all resolve
  OK _assets/: 6 SVGs, 6 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.1 "Kostenstructuren" PASSED all checks.


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:56:14.565Z`
- finished_at: `2026-09-05T21:56:14.663Z`
- duration_ms: `98`
- exit_code: `0`
- stdout_sha256: `f977ab456da0d2239f7aea063296f613f72130435d6db4b51b7dac122d3d7a6f`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.1 "Kostenstructuren"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.1 Kostenstructuren
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.1 Kostenstructuren – paragraaf.md
  OK opgaven.md: 2.1.1 Kostenstructuren – opgaven.md
  OK antwoorden.md: 2.1.1 Kostenstructuren – antwoorden.md
  OK 2.1.1 Kostenstructuren – paragraaf.pdf (518 KB)
  OK 2.1.1 Kostenstructuren – opgaven.pdf (188 KB)
  OK 2.1.1 Kostenstructuren – antwoorden.pdf (31 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 6 image refs all resolve
  OK _assets/: 6 SVGs, 6 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.1 "Kostenstructuren" PASSED all checks.


```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-sprint-bundle.js BOOK2-TEXTBOOK-PRODUCTION-1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:58:19.679Z`
- finished_at: `2026-09-05T21:58:19.882Z`
- duration_ms: `203`
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
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base 6eb34debb2210a2a4fa6718a13eaeefcacedc8f8 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:58:41.640Z`
- finished_at: `2026-09-05T21:58:41.782Z`
- duration_ms: `142`
- exit_code: `0`
- stdout_sha256: `ef4febc87c09b3f471b7524bf1b36ea4777d683b4e846e9816535f63c459e033`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 2
  - build-scripts/content/book-2/211/answers.md
  - build-scripts/content/book-2/211/test_bonus.py
- review evidence: 80
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-010.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-011.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-012.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-013.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-014.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-015.png
  - r
...[truncated 3581 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base 6a6c8183bd2e9b52d2898e587543f735e6e87299 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T21:58:41.863Z`
- finished_at: `2026-09-05T21:58:41.976Z`
- duration_ms: `113`
- exit_code: `0`
- stdout_sha256: `e74c202251b1d2845e308886ffdbaeefb39d7562e4ae0960c405c822e5a14cdb`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 3
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – antwoorden.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – antwoorden.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – antwoorden.pdf

```

### stderr excerpt

```text

```
## C:/Python314/python.exe -m unittest discover -s build-scripts/content/book-2/212 -p "test_*.py" -v

- cwd: `C:\wt\book2-212-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:24:25.864Z`
- finished_at: `2026-09-05T21:24:26.659Z`
- duration_ms: `795`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `2dd55573f3737b2fa5908097c0ae8bf3c8f20991cb4a0cfef5a728571510f4dc`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_five_context_titles_and_old_negative_fixtures (test_metadata.MetadataTests.test_five_context_titles_and_old_negative_fixtures) ... ok
test_nine_exact_native_insertions_and_unchanged_full_sources (test_metadata.MetadataTests.test_nine_exact_native_insertions_and_unchanged_full_sources) ... ok
test_original_failing_alt_fixtures_remain_negative (test_metadata.MetadataTests.test_original_failing_alt_fixtures_remain_negative) ... ok
test_short_alts_functional_and_bounded (test_metadata.MetadataTests.test_short_alts_functional_and_bounded) ... ok
test_unchanged_generator_outside_title_loop (test_metadata.MetadataTests.test_unchanged_generator_outside_title_loop) ... ok
test_eleven_assets_and_no_answer_leakage (test_source.SourceTests.test_eleven_assets_and_no_answer_leakage) ... ok
test_exact_arithmetic_geometry (test_source.SourceTests.test_exact_arithmetic_geometry) ... ok
test_font_and_contrast (test_source.SourceTests.test_font_and_contrast) ... ok
test_frozen_target_goals_points_answers (test_source.SourceTests.test_frozen_target_goals_points_answers) ... ok
test_no_letter_drift_or_online_dependencies (test_source.SourceTests.test_no_letter_drift_or_online_dependencies) ... ok
test_other_arithmetic_and_timing (test_source.SourceTests.test_other_arithmetic_and_timing) ... ok
test_progressive_graphs (test_source.SourceTests.test_progressive_graphs) ... ok
test_repeatable (test_source.SourceTests.test_repeatable) ... ok
test_single_exercise_source_and_headings (test_source.SourceTests.test_single_exercise_source_and_headings) ... ok
test_unsafe_proof_suffix_before_write (test_source.SourceTests.test_unsafe_proof_suffix_before_write) ... ok

----------------------------------------------------------------------
Ran 15 tests in 0.361s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/212/test_bonus.py BonusTests.test_current_exact_full_source_and_three_criteria -v

- cwd: `C:\wt\book2-212-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:25:28.643Z`
- finished_at: `2026-09-05T21:25:29.038Z`
- duration_ms: `395`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `ca41417d0ec28cf660fba9077ecac8596ba978c30487d1e5eee7f5cd1c16ea3c`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_current_exact_full_source_and_three_criteria (__main__.BonusTests.test_current_exact_full_source_and_three_criteria) ... FAIL

======================================================================
FAIL: test_current_exact_full_source_and_three_criteria (__main__.BonusTests.test_current_exact_full_source_and_three_criteria)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "C:\wt\book2-212-bonus-correction-20260905\4veco-platform\build-scripts\content\book-2\212\test_bonus.py", line 45, in test_current_exact_full_source_and_three_criteria
    assert_exact_sources(self, self.sources)
    ~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^
  File "C:\wt\book2-212-bonus-correction-20260905\4veco-platform\build-scripts\content\book-2\212\test_bonus.py", line 37, in assert_exact_sources
    testcase.assertEqual(sources[name], expected, name)
    ~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: '# 2.[5764 chars].\n\n## Herhaling / Herhaling en interleaving\[376 chars]e.\n' != '# 2.[5764 chars].\n\n**Beoordelingscriteria:**\n\n- Je onderbo[721 chars]e.\n'
Diff is 6690 characters long. Set self.maxDiff to None to see it. : answers.md

----------------------------------------------------------------------
Ran 1 test in 0.092s

FAILED (failures=1)

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence.py baseline

- cwd: `C:\wt\book2-212-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:27:46.702Z`
- finished_at: `2026-09-05T21:27:50.039Z`
- duration_ms: `3337`
- exit_code: `0`
- stdout_sha256: `475dc49a83816194868c2d6e856f2e63037d204e5f077d67a656a16fde49d143`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{"path": "C:\\wt\\book2-212-bonus-correction-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence\\baseline.json", "sha256": "560b928e69262c79f1afc3bb325df0e58f437c3b63d1c3393d1b8cd664b32001"}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe -m unittest discover -s build-scripts/content/book-2/212 -p "test_*.py" -v

- cwd: `C:\wt\book2-212-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:28:05.642Z`
- finished_at: `2026-09-05T21:28:07.526Z`
- duration_ms: `1884`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `f68b3a46300d0ca256bf7c8f45642372fc8cca5db397c1e3f80feaff61eef463`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_current_exact_full_source_and_three_criteria (test_bonus.BonusTests.test_current_exact_full_source_and_three_criteria) ... ok
test_missing_extra_and_misplaced_criteria_rejected (test_bonus.BonusTests.test_missing_extra_and_misplaced_criteria_rejected) ... ok
test_model_answer_and_unrelated_source_drift_rejected (test_bonus.BonusTests.test_model_answer_and_unrelated_source_drift_rejected) ... ok
test_five_context_titles_and_old_negative_fixtures (test_metadata.MetadataTests.test_five_context_titles_and_old_negative_fixtures) ... ok
test_nine_exact_native_insertions_and_unchanged_full_sources (test_metadata.MetadataTests.test_nine_exact_native_insertions_and_unchanged_full_sources) ... ok
test_original_failing_alt_fixtures_remain_negative (test_metadata.MetadataTests.test_original_failing_alt_fixtures_remain_negative) ... ok
test_short_alts_functional_and_bounded (test_metadata.MetadataTests.test_short_alts_functional_and_bounded) ... ok
test_unchanged_generator_outside_title_loop (test_metadata.MetadataTests.test_unchanged_generator_outside_title_loop) ... ok
test_eleven_assets_and_no_answer_leakage (test_source.SourceTests.test_eleven_assets_and_no_answer_leakage) ... ok
test_exact_arithmetic_geometry (test_source.SourceTests.test_exact_arithmetic_geometry) ... ok
test_font_and_contrast (test_source.SourceTests.test_font_and_contrast) ... ok
test_frozen_target_goals_points_answers (test_source.SourceTests.test_frozen_target_goals_points_answers) ... ok
test_no_letter_drift_or_online_dependencies (test_source.SourceTests.test_no_letter_drift_or_online_dependencies) ... ok
test_other_arithmetic_and_timing (test_source.SourceTests.test_other_arithmetic_and_timing) ... ok
test_progressive_graphs (test_source.SourceTests.test_progressive_graphs) ... ok
test_repeatable (test_source.SourceTests.test_repeatable) ... ok
test_single_exercise_source_and_headings (test_source.SourceTests.test_single_exercise_source_and_headings) ... ok
test_unsafe_proof_suffix_before_write (test_source.SourceTests.test_unsafe_proof_suffix_before_write) ... ok

----------------------------------------------------------------------
Ran 18 tests in 1.483s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/b2_212.py --lesson-root ../4veco-lessen --proof-root reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence --proof-suffix r7 --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/build-r7.json

- cwd: `C:\wt\book2-212-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:28:16.272Z`
- finished_at: `2026-09-05T21:28:33.930Z`
- duration_ms: `17658`
- exit_code: `0`
- stdout_sha256: `933472f36b05dcd162d12a4523b483bda164a721053a9379a5147135dd2e6c6c`
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
      "path": "C:\\wt\\book2-212-bonus-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\b2_212.py",
      "sha256": "079c1f40d750d7c23a2c24b1455a1c4820d9e8cf46467f36fe20f5c090363183"
    },
    {
      "path": "C:\\wt\\book2-212-bonus-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\print_pipeline.py",
      "sha256": "51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5"
    },
    {
      "path": "C:\\wt\\book2-212-bonus-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\212\\theory.md",
      "sha256": "c5c1ec88217f0e8910b05b5c968bab8e8cee8866db63e323681b6bb65e89e0b4"
    },
    {
      "path": "C:\\wt\\book2-212-bonus-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\212\\exercises.md",
      "sha256": "c03fc1f6939deeaae99753eab087dea82547626839849f0e52d494a8ec4ce533"
    },
    {
      "path": "C:\\wt\\book2-212-bonus-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\212\\answers.md",
      "sha256": "b67a0959f2fcba00d1399f26d51d866a2a40589b74f780384300eebd9ded8324"
    },
    {
      "path": "C:\\wt\\book2-212-bonus-correction-20260905\\4veco-platform\\build-scripts\\content\\book-2\\212\\target-answers.md",
      "sha256": "da0092dad52dfce100257565e6efa8768fd92f7fbd8c45c5c15fc0dfb222161d"
    }
  ],
  "inspection_status": "PENDING",
  "documents": [
    {
      "source_md": "C:\\wt\\book2-212-bonus-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.2 Opbrengsten, winst en break-even\\2.1.2 Opbrengsten, winst en break-even \u2013 paragraaf.md",
      "source_sha256": "9350d60fadee3494124f7b0593bc1efcf00db5ea292d0a19fc3f10518e11d1f8",
      "source_html": "C:\\wt\\book2-212-bonus-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.2 Opbrengsten, winst en break-even\\2.1.2 Opbrengsten, winst en break-even \u2013 paragraaf.html",
      "html_sha256": "85eff0548ce75161a2935e2bb3d0bb470f30ec10e95996c670605574d89454b5",
      "source_pdf": "C:\\wt\\book2-212-bonus-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.2 Opbrengsten, winst en break-even\\2.1.2 Opbrengsten, winst en break-even \u2013 paragraaf.pdf",
      "pdf_sha256": "e94d42f66ab9966a3a024cfef061c2084fcc1e2a6ef9e61e50c699c9155ce7a2",
      "assets": [
        {
          "path": "C:\\wt\\book2-212-bonus-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.2 Opbrengsten, winst en break-even\\_assets\\2.1.2_fig_1.svg",
          "sha256": "6c82fc3ad6ee7a3232d18fff7aab9c42a57a52d01c61dc353452c9b50bd7f81b"
        },
        {
          "path": "C:\\wt\\book2-212-bonus-correction-20260905\\4veco-lessen\\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\\2.1 Hoofdstuk Kosten en opbrengsten\\2.1.2 Opbrengsten, winst en break-even\\_assets\\2.1.2_fig_1.png",
          "sha256": "e0619fb4b4428f6fef46358908eeca81a846539a4ea40c8718edd7571e6aca02"
        },
        {
          "pat
...[truncated 13726 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence.py verify

- cwd: `C:\wt\book2-212-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:28:54.812Z`
- finished_at: `2026-09-05T21:28:57.912Z`
- duration_ms: `3100`
- exit_code: `0`
- stdout_sha256: `f76ffde11ccb558dec96bfd91c5823ac78d2d7876e0b1b05ab83a9c478d886aa`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{"path": "C:\\wt\\book2-212-bonus-correction-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence\\mechanical-r7.json", "sha256": "9098f1f6fca5de526a431ad3862f22de6668c7604d4968a0c2088a09b074fb7d"}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/212/check_render.py reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/render-check-r7.json

- cwd: `C:\wt\book2-212-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:28:57.962Z`
- finished_at: `2026-09-05T21:28:59.818Z`
- duration_ms: `1856`
- exit_code: `0`
- stdout_sha256: `b40d27954066429b90194dfb47be85c56d6f3c623101294917c41e3ad81e98bf`
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
      "html_sha256": "85eff0548ce75161a2935e2bb3d0bb470f30ec10e95996c670605574d89454b5",
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
      "html_sha256": "87c55209dd450e989476f2f9779feb88de9fac9bbc77a0805112a444ffb65a06",
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
      "pdf_sha256": "d55f1da66723cd6f932cbf0793ce79d8d4188d2d907244fd40cc6f6fbad5ac90",
      "html_sha256": "be02782985485caca268df98af897104d78feec9737032cd14803c978a318a82",
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
...[truncated 463 chars]
```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence.py rebuild

- cwd: `C:\wt\book2-212-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:29:09.480Z`
- finished_at: `2026-09-05T21:29:22.991Z`
- duration_ms: `13511`
- exit_code: `0`
- stdout_sha256: `abe8e84f5f9be827e416ecd315fd3dcbadedf2a7df4886ad8e299c9f6c9dabbb`
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
{"path": "C:\\wt\\book2-212-bonus-correction-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence\\reproduction-r7.json", "sha256": "df4686015ffed45778f9f3b5cb6d8a2ebd65393e493006d4782eca84e506b99b"}

```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-212-bonus-correction-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even\""

- cwd: `C:\wt\book2-212-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:36:57.172Z`
- finished_at: `2026-09-05T21:36:57.247Z`
- duration_ms: `75`
- exit_code: `0`
- stdout_sha256: `605e5681c355cca74c4f0cd4306f67896f5662849b60f6116a29c4194d3fbca8`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.2 "Opbrengsten, winst en break-even"
Path: C:\wt\book2-212-bonus-correction-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.2 Opbrengsten, winst en break-even
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.2 Opbrengsten, winst en break-even – paragraaf.md
  OK opgaven.md: 2.1.2 Opbrengsten, winst en break-even – opgaven.md
  OK antwoorden.md: 2.1.2 Opbrengsten, winst en break-even – antwoorden.md
  OK 2.1.2 Opbrengsten, winst en break-even – paragraaf.html (1336.0 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – opgaven.html (742.0 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – antwoorden.html (497.9 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – paragraaf.pdf (1009 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – opgaven.pdf (563 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – antwoorden.pdf (383 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 11 image refs all resolve
  OK _assets/: 11 SVGs, 11 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.2-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.2-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.2 "Opbrengsten, winst en break-even" PASSED all checks.


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-212-bonus-correction-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even\""

- cwd: `C:\wt\book2-212-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:36:57.290Z`
- finished_at: `2026-09-05T21:36:57.356Z`
- duration_ms: `66`
- exit_code: `0`
- stdout_sha256: `91794fea7b1433d0e527ae1afa8effcb5d9cd79b67f03e515276875591cd2de0`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.2 "Opbrengsten, winst en break-even"
Path: C:\wt\book2-212-bonus-correction-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.2 Opbrengsten, winst en break-even
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.2 Opbrengsten, winst en break-even – paragraaf.md
  OK opgaven.md: 2.1.2 Opbrengsten, winst en break-even – opgaven.md
  OK antwoorden.md: 2.1.2 Opbrengsten, winst en break-even – antwoorden.md
  OK 2.1.2 Opbrengsten, winst en break-even – paragraaf.pdf (1009 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – opgaven.pdf (563 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – antwoorden.pdf (383 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 11 image refs all resolve
  OK _assets/: 11 SVGs, 11 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.2-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.2-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.2 "Opbrengsten, winst en break-even" PASSED all checks.


```

### stderr excerpt

```text

```
## C:/Python314/python.exe -m unittest discover -s build-scripts/content/book-2/212 -p "test_*.py" -v

- cwd: `C:\wt\book2-212-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:36:57.401Z`
- finished_at: `2026-09-05T21:36:58.893Z`
- duration_ms: `1492`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `0b44c85e44f53d5b6d9a8f77c1ff9707c7cd47130e17f3cb9950ff4bb230ebd9`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_current_exact_full_source_and_three_criteria (test_bonus.BonusTests.test_current_exact_full_source_and_three_criteria) ... ok
test_missing_extra_and_misplaced_criteria_rejected (test_bonus.BonusTests.test_missing_extra_and_misplaced_criteria_rejected) ... ok
test_model_answer_and_unrelated_source_drift_rejected (test_bonus.BonusTests.test_model_answer_and_unrelated_source_drift_rejected) ... ok
test_five_context_titles_and_old_negative_fixtures (test_metadata.MetadataTests.test_five_context_titles_and_old_negative_fixtures) ... ok
test_nine_exact_native_insertions_and_unchanged_full_sources (test_metadata.MetadataTests.test_nine_exact_native_insertions_and_unchanged_full_sources) ... ok
test_original_failing_alt_fixtures_remain_negative (test_metadata.MetadataTests.test_original_failing_alt_fixtures_remain_negative) ... ok
test_short_alts_functional_and_bounded (test_metadata.MetadataTests.test_short_alts_functional_and_bounded) ... ok
test_unchanged_generator_outside_title_loop (test_metadata.MetadataTests.test_unchanged_generator_outside_title_loop) ... ok
test_eleven_assets_and_no_answer_leakage (test_source.SourceTests.test_eleven_assets_and_no_answer_leakage) ... ok
test_exact_arithmetic_geometry (test_source.SourceTests.test_exact_arithmetic_geometry) ... ok
test_font_and_contrast (test_source.SourceTests.test_font_and_contrast) ... ok
test_frozen_target_goals_points_answers (test_source.SourceTests.test_frozen_target_goals_points_answers) ... ok
test_no_letter_drift_or_online_dependencies (test_source.SourceTests.test_no_letter_drift_or_online_dependencies) ... ok
test_other_arithmetic_and_timing (test_source.SourceTests.test_other_arithmetic_and_timing) ... ok
test_progressive_graphs (test_source.SourceTests.test_progressive_graphs) ... ok
test_repeatable (test_source.SourceTests.test_repeatable) ... ok
test_single_exercise_source_and_headings (test_source.SourceTests.test_single_exercise_source_and_headings) ... ok
test_unsafe_proof_suffix_before_write (test_source.SourceTests.test_unsafe_proof_suffix_before_write) ... ok

----------------------------------------------------------------------
Ran 18 tests in 1.182s

OK

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.1.2

- cwd: `C:\wt\book2-212-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:36:58.936Z`
- finished_at: `2026-09-05T21:37:00.912Z`
- duration_ms: `1976`
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
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-212-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:37:00.954Z`
- finished_at: `2026-09-05T21:37:01.694Z`
- duration_ms: `740`
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
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence.py bind

- cwd: `C:\wt\book2-212-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:37:01.738Z`
- finished_at: `2026-09-05T21:37:02.229Z`
- duration_ms: `491`
- exit_code: `0`
- stdout_sha256: `70b535ccd1dc5c3a22fa3de862cdfdc189a6a7fefd32ef5d4cc8b46244772699`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{"path": "C:\\wt\\book2-212-bonus-correction-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence\\visual-binding-r7.json", "sha256": "ef9c433205c72a9e8da5b9804ed7e90a6518190bdbd489f2a76a611ec84b0eb1"}

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base 2bf6260c5d4d799c5408f898d0dab126eff9e5ac --head 95c8e20a603c31e813840ae9561266fe635b02d9

- cwd: `C:\wt\book2-212-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:41:32.456Z`
- finished_at: `2026-09-05T21:41:32.582Z`
- duration_ms: `126`
- exit_code: `0`
- stdout_sha256: `2ba47a178690fa1fcb1a510e872875d4622490ca2923ef53506d967a06016c40`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 3
  - build-scripts/content/book-2/212/answers.md
  - build-scripts/content/book-2/212/test_bonus.py
  - build-scripts/content/book-2/212/test_metadata.py
- review evidence: 56
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence.py
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-antwoorden-d55f1da66723-r7/contact-sheet.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-antwoorden-d55f1da66723-r7/manifest.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-antwoorden-d55f1da66723-r7/pages/page-001.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-antwoorden-d55f1da66723-r7/pages/page-002.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-antwoorden-d55f1da66723-r7/pages/page-003.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-antwoorden-d55f1da66723-r7/pages/page-004.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-antwoorden-d55f1da66723-r7/pages/page-005.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-antwoorden-d55f1da66723-r7/pages/page-006.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-opgaven-94ebe5d35207-r7/contact-sheet.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-opgaven-94ebe5d35207-r7/manifest.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-opgaven-94ebe5d35207-r7/pages/page-001.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-opgaven-94ebe5d35207-r7/pages/page-002.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-opgaven-94ebe5d35207-r7/pages/page-003.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-opgaven-94ebe5d35207-r7/pages/page-004.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-opgaven-94ebe5d35207-r7/pages/page-005.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-opgaven-94ebe5d35207-r7/pages/page-006.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-opgaven-94ebe5d35207-r7/pages/page-007.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/contact-sheet.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/manifest.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-001.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-002.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-003.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-004.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-005.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-006.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-007.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-008.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-009.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-010.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-011.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-012.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-013.png
  - reports/sp
...[truncated 1967 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --cwd ../4veco-lessen --lane textbook --base 917115c8da631d65eefbdb1f15c13b2291cd9e1d --head 6139336793edd9e79037fbae1be1586a5cc3a2ba

- cwd: `C:\wt\book2-212-bonus-correction-20260905\4veco-platform`
- started_at: `2026-09-05T21:41:32.643Z`
- finished_at: `2026-09-05T21:41:32.764Z`
- duration_ms: `121`
- exit_code: `0`
- stdout_sha256: `97f063f3648a3c3b8e6991b2d3a2be88a5307f9d75138fa25336e17ddc10ffa5`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 4
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – antwoorden.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – antwoorden.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – antwoorden.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – antwoorden.zip

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-root-r7-check.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:00:44.707Z`
- finished_at: `2026-09-05T22:01:04.372Z`
- duration_ms: `19665`
- exit_code: `0`
- stdout_sha256: `695ff743bc7985864c6ae15d9c5ba5e1c75d97e981eb9bbf5d4ff461d88502e2`
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
{"path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-212-root-r7-evidence\\mechanical-r7.json", "sha256": "59c542b045e09893122035f9b3d225cf74bdf2aac13bb24a3bcb6b818740251e"}
{"path": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-212-root-r7-evidence\\reproduction-r7.json", "sha256": "8df928bd7fce15900a81aa63bd4c38fdfe7041b01be790ea6379d5429188dec4"}
{"result": "PASS", "files": 34, "pages": 27, "changed_pages": [["antwoorden", "page-006.png"]], "binding_sha256": "5a16397cea897d70d4e304509f07aff3562eb33c1c059aecf4b9e63fddba0b3b"}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe -m unittest discover -s build-scripts/content/book-2/212 -p "test*.py" -v

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:01:10.110Z`
- finished_at: `2026-09-05T22:01:11.669Z`
- duration_ms: `1559`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `c775ae7c44a9bf48a06423288f217a6518dfe6b97973f1caa2eb481bc28f7f6e`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_current_exact_full_source_and_three_criteria (test_bonus.BonusTests.test_current_exact_full_source_and_three_criteria) ... ok
test_missing_extra_and_misplaced_criteria_rejected (test_bonus.BonusTests.test_missing_extra_and_misplaced_criteria_rejected) ... ok
test_model_answer_and_unrelated_source_drift_rejected (test_bonus.BonusTests.test_model_answer_and_unrelated_source_drift_rejected) ... ok
test_five_context_titles_and_old_negative_fixtures (test_metadata.MetadataTests.test_five_context_titles_and_old_negative_fixtures) ... ok
test_nine_exact_native_insertions_and_unchanged_full_sources (test_metadata.MetadataTests.test_nine_exact_native_insertions_and_unchanged_full_sources) ... ok
test_original_failing_alt_fixtures_remain_negative (test_metadata.MetadataTests.test_original_failing_alt_fixtures_remain_negative) ... ok
test_short_alts_functional_and_bounded (test_metadata.MetadataTests.test_short_alts_functional_and_bounded) ... ok
test_unchanged_generator_outside_title_loop (test_metadata.MetadataTests.test_unchanged_generator_outside_title_loop) ... ok
test_eleven_assets_and_no_answer_leakage (test_source.SourceTests.test_eleven_assets_and_no_answer_leakage) ... ok
test_exact_arithmetic_geometry (test_source.SourceTests.test_exact_arithmetic_geometry) ... ok
test_font_and_contrast (test_source.SourceTests.test_font_and_contrast) ... ok
test_frozen_target_goals_points_answers (test_source.SourceTests.test_frozen_target_goals_points_answers) ... ok
test_no_letter_drift_or_online_dependencies (test_source.SourceTests.test_no_letter_drift_or_online_dependencies) ... ok
test_other_arithmetic_and_timing (test_source.SourceTests.test_other_arithmetic_and_timing) ... ok
test_progressive_graphs (test_source.SourceTests.test_progressive_graphs) ... ok
test_repeatable (test_source.SourceTests.test_repeatable) ... ok
test_single_exercise_source_and_headings (test_source.SourceTests.test_single_exercise_source_and_headings) ... ok
test_unsafe_proof_suffix_before_write (test_source.SourceTests.test_unsafe_proof_suffix_before_write) ... ok

----------------------------------------------------------------------
Ran 18 tests in 1.200s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/212/check_render.py reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-root-native-r7.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:01:11.712Z`
- finished_at: `2026-09-05T22:01:13.385Z`
- duration_ms: `1673`
- exit_code: `0`
- stdout_sha256: `b40d27954066429b90194dfb47be85c56d6f3c623101294917c41e3ad81e98bf`
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
      "html_sha256": "85eff0548ce75161a2935e2bb3d0bb470f30ec10e95996c670605574d89454b5",
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
      "html_sha256": "87c55209dd450e989476f2f9779feb88de9fac9bbc77a0805112a444ffb65a06",
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
      "pdf_sha256": "d55f1da66723cd6f932cbf0793ce79d8d4188d2d907244fd40cc6f6fbad5ac90",
      "html_sha256": "be02782985485caca268df98af897104d78feec9737032cd14803c978a318a82",
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
...[truncated 463 chars]
```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:01:28.778Z`
- finished_at: `2026-09-05T22:01:28.858Z`
- duration_ms: `80`
- exit_code: `0`
- stdout_sha256: `e30cfd65afd4244a631f2f4aa071a299a8560a9e7ebddebaf72a6b2ff77c89c7`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.2 "Opbrengsten, winst en break-even"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.2 Opbrengsten, winst en break-even
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.2 Opbrengsten, winst en break-even – paragraaf.md
  OK opgaven.md: 2.1.2 Opbrengsten, winst en break-even – opgaven.md
  OK antwoorden.md: 2.1.2 Opbrengsten, winst en break-even – antwoorden.md
  OK 2.1.2 Opbrengsten, winst en break-even – paragraaf.html (1336.0 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – opgaven.html (742.0 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – antwoorden.html (497.9 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – paragraaf.pdf (1009 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – opgaven.pdf (563 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – antwoorden.pdf (383 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 11 image refs all resolve
  OK _assets/: 11 SVGs, 11 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.2-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.2-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.2 "Opbrengsten, winst en break-even" PASSED all checks.


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:01:28.911Z`
- finished_at: `2026-09-05T22:01:28.977Z`
- duration_ms: `66`
- exit_code: `0`
- stdout_sha256: `4983103bfafb1add446b1f5ddf2c38e05e50fd547a634aa1d83f070567c7a0cf`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.2 "Opbrengsten, winst en break-even"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.2 Opbrengsten, winst en break-even
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.2 Opbrengsten, winst en break-even – paragraaf.md
  OK opgaven.md: 2.1.2 Opbrengsten, winst en break-even – opgaven.md
  OK antwoorden.md: 2.1.2 Opbrengsten, winst en break-even – antwoorden.md
  OK 2.1.2 Opbrengsten, winst en break-even – paragraaf.pdf (1009 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – opgaven.pdf (563 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – antwoorden.pdf (383 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 11 image refs all resolve
  OK _assets/: 11 SVGs, 11 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.2-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.2-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.2 "Opbrengsten, winst en break-even" PASSED all checks.


```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-bonus-adoption-inventory-check.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:03:52.739Z`
- finished_at: `2026-09-05T22:03:52.820Z`
- duration_ms: `81`
- exit_code: `0`
- stdout_sha256: `c3870f5116da6af2ddc6727f3109c12c3065d5491c708c0ff7008c52dcb915b9`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS",
  "counts": {
    "A": 6,
    "C": 12,
    "L": 8,
    "P": 15
  },
  "present": 26,
  "current_pdf_hashes": 18,
  "canonical211212": "historical unchanged; no new acceptance",
  "book_complete": false
}

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base b7b584e9157929b1efa521af0101a0795f34d2d9 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:04:20.222Z`
- finished_at: `2026-09-05T22:04:20.348Z`
- duration_ms: `126`
- exit_code: `0`
- stdout_sha256: `5450c16f9d4b0e3552a805bb6f8fa7ab926817cf1740e3595ecdbf88666c837a`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 3
  - build-scripts/content/book-2/212/answers.md
  - build-scripts/content/book-2/212/test_bonus.py
  - build-scripts/content/book-2/212/test_metadata.py
- review evidence: 79
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence.py
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-antwoorden-d55f1da66723-r7/contact-sheet.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-antwoorden-d55f1da66723-r7/manifest.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-antwoorden-d55f1da66723-r7/pages/page-001.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-antwoorden-d55f1da66723-r7/pages/page-002.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-antwoorden-d55f1da66723-r7/pages/page-003.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-antwoorden-d55f1da66723-r7/pages/page-004.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-antwoorden-d55f1da66723-r7/pages/page-005.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-antwoorden-d55f1da66723-r7/pages/page-006.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-opgaven-94ebe5d35207-r7/contact-sheet.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-opgaven-94ebe5d35207-r7/manifest.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-opgaven-94ebe5d35207-r7/pages/page-001.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-opgaven-94ebe5d35207-r7/pages/page-002.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-opgaven-94ebe5d35207-r7/pages/page-003.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-opgaven-94ebe5d35207-r7/pages/page-004.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-opgaven-94ebe5d35207-r7/pages/page-005.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-opgaven-94ebe5d35207-r7/pages/page-006.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-opgaven-94ebe5d35207-r7/pages/page-007.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/contact-sheet.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/manifest.json
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-001.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-002.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-003.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-004.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-005.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-006.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-007.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-008.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-009.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-010.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-011.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-012.png
  - reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence/212-paragraaf-e94d42f66ab9-r7/pages/page-013.png
  - reports/sp
...[truncated 3934 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base 1432170d88341de6d8cd8b703a084f550a238251 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:04:20.408Z`
- finished_at: `2026-09-05T22:04:20.535Z`
- duration_ms: `127`
- exit_code: `0`
- stdout_sha256: `97f063f3648a3c3b8e6991b2d3a2be88a5307f9d75138fa25336e17ddc10ffa5`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 4
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – antwoorden.html
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – antwoorden.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – antwoorden.pdf
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – antwoorden.zip

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-plan-r2-root-adoption-check.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:08:00.183Z`
- finished_at: `2026-09-05T22:08:00.888Z`
- duration_ms: `705`
- exit_code: `0`
- stdout_sha256: `80f608eaa628d10a5bb05896b0ab9947a51f4ccb957ccf11730db753083e6eee`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS",
  "imported_platform_files": 12,
  "lesson_plan_only": true,
  "plan_sha256": "60d6a743681e1361478395a591b7c82e44acf8c4587a93c4cc842b036cf017b1",
  "native_names": 30,
  "independent_plan_decisions": "231 R2 and successor S1 PASS",
  "student_product_acceptance": false
}

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.3.1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:08:00.945Z`
- finished_at: `2026-09-05T22:08:02.927Z`
- duration_ms: `1982`
- exit_code: `0`
- stdout_sha256: `17c621a2434015110c4cb7717f5a302b74ab68762f2574dbcdd25e8895ecce87`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.3.1

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:08:02.979Z`
- finished_at: `2026-09-05T22:08:03.693Z`
- duration_ms: `714`
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
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base 6eb34debb2210a2a4fa6718a13eaeefcacedc8f8 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:08:38.253Z`
- finished_at: `2026-09-05T22:08:38.346Z`
- duration_ms: `93`
- exit_code: `0`
- stdout_sha256: `8cfcb620037507acc95ea89b00a8796b41b97d1c51c190433a28e0448e8b354a`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 5
  - build-scripts/content/book-2/211/answers.md
  - build-scripts/content/book-2/211/test_bonus.py
  - build-scripts/content/book-2/212/answers.md
  - build-scripts/content/book-2/212/test_bonus.py
  - build-scripts/content/book-2/212/test_metadata.py
- generated index/report: 4
  - reports/github-agent-index-lessen.json
  - reports/github-agent-index-lessen.md
  - reports/github-agent-index-platform.json
  - reports/github-agent-index-platform.md
- review evidence: 169
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-010.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-011.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraa
...[truncated 12488 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --cwd ../4veco-lessen --lane textbook --base 9da7c47b07144815f730ebbb9fd117805194ac6b --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:08:38.388Z`
- finished_at: `2026-09-05T22:08:38.473Z`
- duration_ms: `85`
- exit_code: `0`
- stdout_sha256: `5fe924eb11f0c2f56f850c94ae5f5325800b27586815d2e3a31d77328a006076`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 1
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus/2.3.1-textbook-plan.md

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-r5-r7-review-adoption-check.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:24:50.232Z`
- finished_at: `2026-09-05T22:24:54.304Z`
- duration_ms: `4072`
- exit_code: `0`
- stdout_sha256: `419bbc4eaa4c084c9c66bde2ed6a193ba20b81254460d409b17075502929b451`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS",
  "role": "root exact review adoption, not QC or fresh visual review",
  "base": {
    "platform": "6294118b9bfecc334800293a2883177fccb91e2a",
    "lessons": "d1bd891c052f8a2eed5cf08cc62b921218ebff6c"
  },
  "imports": {
    "platform": "0db3e8e40ccc4faeb69d1308d1104db5fe737916",
    "lessons": "25fbd9ba66f6ead59f512ec2eec1fd95159d834f"
  },
  "imported_file_counts": [
    61,
    57
  ],
  "binding_count": 269,
  "bindings": [
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/antwoorden/page-1.png",
      "sha256": "e64482170c9bf4117f064d72c81ccb73e5cb25220916188deb58867a0329a844",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/antwoorden/page-2.png",
      "sha256": "821d393d65e82843b8f4b9d62f0fe4e4c75c57a4909ec9c3ac127a502c250591",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/antwoorden/page-3.png",
      "sha256": "3aece13ce42a7ab19411768002f77629492a3be5c7865ec5732a9ffad3872b9a",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/antwoorden/page-4.png",
      "sha256": "db38f2c267dff1647809ec28072a022f55fbf4d4bd4c214844f4e3404b0e64a0",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/antwoorden/page-5.png",
      "sha256": "7c5579d04121743f7d9adee6140adf84dc5030e7da66c14c68948d5d3dcf2b51",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/antwoorden/page-6.png",
      "sha256": "46b66e9cf590e2fa7414ed0347c3c4fdfa8014232931b731a0077f0f84657fc0",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/antwoorden/page-7.png",
      "sha256": "36bedb4aa924e1990c8d5c61dd3a01710ff8c0a12d58e8ea65c132f31f2ab22b",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/before.json",
      "sha256": "be99ada17166b9eef13fcde442ace44376ec0364b68e45a2c96e418207860c61",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/commands.jsonl",
      "sha256": "fc32c03a188094bfb535abb67f7f6b9680cc2b7f774481d95c9ec6e9df9f8435",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/committed-scope-diagnostic.json",
      "sha256": "4fdbfd5cbbdca3c23f2b2197726b43139f454e653f2fad91bff7906c6542cf21",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/committed-scope.json",
      "sha256": "730fb347d63cf30a1abcf6c75ba3a7ba3206a6dda580e66d8a31218c600a1544",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/diagnostic-manifest.json",
      "sha256": "456f5ba7fcb2409eeb422b53f719170c93c583811b15f8d3f408e21db4d22da2",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TE
...[truncated 80515 chars]
```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:25:18.620Z`
- finished_at: `2026-09-05T22:25:18.719Z`
- duration_ms: `99`
- exit_code: `0`
- stdout_sha256: `4fc27f991b8fac500c91ffc07a09671a5d48514bac4a3a017c104007c2f36838`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.1 "Kostenstructuren"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.1 Kostenstructuren
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.1 Kostenstructuren – paragraaf.md
  OK opgaven.md: 2.1.1 Kostenstructuren – opgaven.md
  OK antwoorden.md: 2.1.1 Kostenstructuren – antwoorden.md
  OK 2.1.1 Kostenstructuren – paragraaf.html (710.4 KB)
  OK 2.1.1 Kostenstructuren – opgaven.html (245.1 KB)
  OK 2.1.1 Kostenstructuren – antwoorden.html (18.8 KB)
  OK 2.1.1 Kostenstructuren – paragraaf.pdf (518 KB)
  OK 2.1.1 Kostenstructuren – opgaven.pdf (188 KB)
  OK 2.1.1 Kostenstructuren – antwoorden.pdf (31 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 6 image refs all resolve
  OK _assets/: 6 SVGs, 6 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.1 "Kostenstructuren" PASSED all checks.


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:25:18.767Z`
- finished_at: `2026-09-05T22:25:18.837Z`
- duration_ms: `70`
- exit_code: `0`
- stdout_sha256: `f977ab456da0d2239f7aea063296f613f72130435d6db4b51b7dac122d3d7a6f`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.1 "Kostenstructuren"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.1 Kostenstructuren
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.1 Kostenstructuren – paragraaf.md
  OK opgaven.md: 2.1.1 Kostenstructuren – opgaven.md
  OK antwoorden.md: 2.1.1 Kostenstructuren – antwoorden.md
  OK 2.1.1 Kostenstructuren – paragraaf.pdf (518 KB)
  OK 2.1.1 Kostenstructuren – opgaven.pdf (188 KB)
  OK 2.1.1 Kostenstructuren – antwoorden.pdf (31 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 6 image refs all resolve
  OK _assets/: 6 SVGs, 6 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.1 "Kostenstructuren" PASSED all checks.


```

### stderr excerpt

```text

```
## node build-scripts/sprints/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.1.1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:25:18.890Z`
- finished_at: `2026-09-05T22:25:18.953Z`
- duration_ms: `63`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `bb40cbbda6fc9bf4de7ab58429ae88e8f52faa06e303e3e537b2673788c9248e`

### stdout excerpt

```text

```

### stderr excerpt

```text
node:internal/modules/cjs/loader:1451
  throw err;
  ^

Error: Cannot find module 'C:\wt\book2-part-a-production-20260905\4veco-platform\build-scripts\sprints\check-book-outline-currentness.js'
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
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.1.1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:25:51.138Z`
- finished_at: `2026-09-05T22:25:52.683Z`
- duration_ms: `1545`
- exit_code: `0`
- stdout_sha256: `2588f67f1bb250f78fd94fc551099e1000c659528e8d3a89119566c3a55d52cd`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.1

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.1.3

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:25:52.727Z`
- finished_at: `2026-09-05T22:25:54.362Z`
- duration_ms: `1635`
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
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:25:54.409Z`
- finished_at: `2026-09-05T22:25:54.476Z`
- duration_ms: `67`
- exit_code: `0`
- stdout_sha256: `98bd0a69fe0a84b61cd2ed9635d378e905bb82e75b4279ce2e15b0986040379e`
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
  OK 2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.html (1263.7 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – opgaven.html (578.9 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.html (20.4 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.pdf (948 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – opgaven.pdf (442 KB)
  OK 2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.pdf (34 KB)
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
- started_at: `2026-09-05T22:25:54.519Z`
- finished_at: `2026-09-05T22:25:54.582Z`
- duration_ms: `63`
- exit_code: `0`
- stdout_sha256: `dc454777bafb685d317d638022b0c33c1356f990582381e94a5320e8e78539ff`
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
  OK 2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.pdf (34 KB)
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
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:25:54.626Z`
- finished_at: `2026-09-05T22:25:55.161Z`
- duration_ms: `535`
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
- started_at: `2026-09-05T22:25:55.206Z`
- finished_at: `2026-09-05T22:25:55.375Z`
- duration_ms: `169`
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
## C:/Python314/python.exe -m unittest discover -s build-scripts/content/book-2/211 -p "test_*.py" -v

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:25:55.414Z`
- finished_at: `2026-09-05T22:25:57.777Z`
- duration_ms: `2363`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `9dcc9dda8d273a61229a5a9854ca45a7bf9eb034a2b45dd7f3c792653d9574bd`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_all_original_test_bodies_and_generator_remain_exact (test_bonus.BonusContractTests.test_all_original_test_bodies_and_generator_remain_exact) ... ok
test_changed_existing_model_answer_is_rejected (test_bonus.BonusContractTests.test_changed_existing_model_answer_is_rejected) ... ok
test_current_complete_sources_equal_exact_insertion (test_bonus.BonusContractTests.test_current_complete_sources_equal_exact_insertion) ... ok
test_extra_criterion_is_rejected (test_bonus.BonusContractTests.test_extra_criterion_is_rejected) ... ok
test_misplaced_block_is_rejected (test_bonus.BonusContractTests.test_misplaced_block_is_rejected) ... ok
test_missing_one_criterion_is_rejected (test_bonus.BonusContractTests.test_missing_one_criterion_is_rejected) ... ok
test_real_old_missing_block_is_rejected (test_bonus.BonusContractTests.test_real_old_missing_block_is_rejected) ... ok
test_unrelated_source_drift_is_rejected (test_bonus.BonusContractTests.test_unrelated_source_drift_is_rejected) ... ok
test_accessible_svg_titles_are_concise_noun_first (test_source.SourceContractTests.test_accessible_svg_titles_are_concise_noun_first) ... ok
test_answer_coverage (test_source.SourceContractTests.test_answer_coverage) ... ok
test_canonical_exercise_source_shared (test_source.SourceContractTests.test_canonical_exercise_source_shared) ... ok
test_exact_four_goals (test_source.SourceContractTests.test_exact_four_goals) ... ok
test_figures_add_one_relationship_at_a_time (test_source.SourceContractTests.test_figures_add_one_relationship_at_a_time) ... ok
test_numeric_models_independently_recomputed (test_source.SourceContractTests.test_numeric_models_independently_recomputed) ... ok
test_proof_revision_rejects_path_components_before_any_write (test_source.SourceContractTests.test_proof_revision_rejects_path_components_before_any_write) ... ok
test_reproducible_sources_and_assets (test_source.SourceContractTests.test_reproducible_sources_and_assets) ... ok
test_six_assets_and_every_reference (test_source.SourceContractTests.test_six_assets_and_every_reference) ... ok
test_source_letters_are_not_pandoc_auto_lists (test_source.SourceContractTests.test_source_letters_are_not_pandoc_auto_lists) ... ok
test_target_exact_source_and_points (test_source.SourceContractTests.test_target_exact_source_and_points) ... ok
test_target_table_retains_every_frozen_cell (test_source.SourceContractTests.test_target_table_retains_every_frozen_cell) ... ok
test_worked_image_native_short_alt_keeps_entire_caption (test_source.SourceContractTests.test_worked_image_native_short_alt_keeps_entire_caption) ... ok

----------------------------------------------------------------------
Ran 21 tests in 2.048s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/211/check_render.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:25:57.824Z`
- finished_at: `2026-09-05T22:25:58.657Z`
- duration_ms: `833`
- exit_code: `0`
- stdout_sha256: `2f2f228314401c3705aa5341d9e4deef008f80215df96c09b079929040abd5de`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "paragraph": "2.1.1",
  "automated_checks": [
    "all printed text including footer >=12pt",
    "all exercises present",
    "exact target context/prompts in HTML and PDF",
    "literal a-e plus4/3/3/3/4points",
    "exact supplied header/row cells",
    "four exact goals in paragraph PDF",
    "identical exercise HTML fragments"
  ],
  "documents": [
    {
      "kind": "paragraaf",
      "pages": 15,
      "minimum_printed_font_pt_including_footer": 12.0,
      "pdf_sha256": "9837e3a85f3129a5309a36b17fd1030702ba92fc7ef464af609cb878e4d2f8b0"
    },
    {
      "kind": "opgaven",
      "pages": 9,
      "minimum_printed_font_pt_including_footer": 12.0,
      "pdf_sha256": "97329415bacc150675a327ad31455b25b8e9e1b03012ef6b65dab10ab1f02953"
    },
    {
      "kind": "antwoorden",
      "pages": 7,
      "minimum_printed_font_pt_including_footer": 12.0,
      "pdf_sha256": "498b9a863eef9c0feefd50e8a50e72aa41c626caaca79f0b98261b8b3104e5ce"
    }
  ],
  "visual_review_status": "NOT_SUPPLIED_BY_THIS_SCRIPT"
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe -m unittest discover -s build-scripts/content/book-2/213 -p "test_*.py" -v

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:25:58.708Z`
- finished_at: `2026-09-05T22:26:00.094Z`
- duration_ms: `1386`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `c0d8879213fbfca64d74bf7ce0dafa4d0cf83d2c82f95a1881d7c45415957f63`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_bad_position_count_and_coverage_are_rejected (test_bonus_contract.BonusCriteriaTests.test_bad_position_count_and_coverage_are_rejected) ... ok
test_current_source_contains_bounded_criteria (test_bonus_contract.BonusCriteriaTests.test_current_source_contains_bounded_criteria) ... ok
test_native_answer_html_preserves_three_criteria (test_bonus_contract.BonusCriteriaTests.test_native_answer_html_preserves_three_criteria) ... ok
test_old_missing_block_negative_fixture_is_rejected (test_bonus_contract.BonusCriteriaTests.test_old_missing_block_negative_fixture_is_rejected) ... ok
test_altered_target_fails_closed (test_source.SourceTests.test_altered_target_fails_closed) ... ok
test_bad_prerequisite_stops_before_process_or_output_write (test_source.SourceTests.test_bad_prerequisite_stops_before_process_or_output_write) ... ok
test_common_exercise_source_and_no_live_or_timing_copy (test_source.SourceTests.test_common_exercise_source_and_no_live_or_timing_copy) ... ok
test_discrete_arithmetic_all_cases (test_source.SourceTests.test_discrete_arithmetic_all_cases) ... ok
test_exact_seven_exercise_headings (test_source.SourceTests.test_exact_seven_exercise_headings) ... ok
test_formula_totals_independently (test_source.SourceTests.test_formula_totals_independently) ... ok
test_frozen_target_and_native_cells (test_source.SourceTests.test_frozen_target_and_native_cells) ... ok
test_initial_and_completed_tables_match_case_values (test_source.SourceTests.test_initial_and_completed_tables_match_case_values) ... ok
test_native_pandoc_short_alts_keep_full_captions (test_source.SourceTests.test_native_pandoc_short_alts_keep_full_captions) ... ok
test_original_long_alts_and_caption_loss_are_rejected (test_source.SourceTests.test_original_long_alts_and_caption_loss_are_rejected) ... ok
test_retrieval_combination_and_unequal_intervals (test_source.SourceTests.test_retrieval_combination_and_unequal_intervals) ... ok
test_six_assets_safe_geometry_large_type (test_source.SourceTests.test_six_assets_safe_geometry_large_type) ... ok
test_six_exact_noun_first_accessible_titles (test_source.SourceTests.test_six_exact_noun_first_accessible_titles) ... ok

----------------------------------------------------------------------
Ran 17 tests in 0.911s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/213/check_render.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:26:00.144Z`
- finished_at: `2026-09-05T22:26:09.129Z`
- duration_ms: `8985`
- exit_code: `0`
- stdout_sha256: `751e7a6bfea46577d1438a1238fd6100dea87e740f80ac51d0d1d3aeb8cba5a0`
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
      "html_sha256": "2f8d85e29fa7e734269f92b68510a9e21f196807c5c105fe7157e70d17f09f5b",
      "zip_sha256": "15ffc25da00d0f3bfc84f93224191a08c9ab31387f7dc873a8df85dc7b76b499",
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
      ],
      "actual_html_alternatives": [
        {
          "asset": "2.1.3_fig_1",
          "alt": "Dezelfde dag: de tabelstappen van 0 naar 10 en van 10 naar 20 fotohouders, met TK 20, 50 en 100 euro.",
          "length": 101,
          "caption": "Dezelfde dag: de tabelstappen van 0 naar 10 en van 10 naar 20 fotohouders, met TK 20, 50 en 100 euro.",
          "caption_attributes": {
            "aria-hidden": "true"
          }
        },
        {
          "asset": "2.1.3_fig_2",
          "alt": "Dezelfde kostentabel met delta TK 30 en 50 euro, telkens delta Q 10, en MK 3 en 5 euro bij de rechter eindpunten.",
          "length": 113,
          "caption": "Dezelfde kostentabel met delta TK 30 en 50 euro, telkens delta Q 10, en MK 3 en 5 euro bij de rechter eindpunten.",
          "caption_attributes": {
            "aria-hidden": "true"
          }
        },
        {
          "asset": "2.1.3_fig_3",
          "alt": "MO bij vaste prijs: 80 euro extra opbrengst voor 10 extra fotohouders in beide intervallen, dus 8 euro per houder.",
          "length": 114,
          "caption": "Bij dezelfde hoeveelheden 0, 10 en 20 zijn de opbrengsten 0, 80 en 160 euro. Beide intervallen leveren 80 euro extra voor 10 extra producten: MO is telkens 8.",
          "caption_attributes": {}
        },
        {
          "asset": "2.1.3_fig_4",
          "alt": "Winsttoename per extra fotohouder: 5 euro in interval 0�10 en 3 euro in interval 10�20, telkens MO min MK.",
          "length": 106,
          "caption": "Twee intervalkaarten: winst van min 20 naar 30 geeft 50 gedeeld door 10 is 5; winst van 30 naar 60 geeft 30 gedeeld door 10 is 3. Dit is telkens MO min MK.",
          "caption_attributes": {}
        },
        {
          "asset": "2.1.3_we_1",
          "alt": "Eindpuntrijen van Lus en Bout: MK 2/2/2 tegenover 2/6/10; MO steeds 6 en 12 euro per extra
...[truncated 7952 chars]
```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-r5-r7-review-adoption-check.js reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-r5-r7-review-adoption-bindings.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:27:57.224Z`
- finished_at: `2026-09-05T22:28:01.063Z`
- duration_ms: `3839`
- exit_code: `0`
- stdout_sha256: `419bbc4eaa4c084c9c66bde2ed6a193ba20b81254460d409b17075502929b451`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS",
  "role": "root exact review adoption, not QC or fresh visual review",
  "base": {
    "platform": "6294118b9bfecc334800293a2883177fccb91e2a",
    "lessons": "d1bd891c052f8a2eed5cf08cc62b921218ebff6c"
  },
  "imports": {
    "platform": "0db3e8e40ccc4faeb69d1308d1104db5fe737916",
    "lessons": "25fbd9ba66f6ead59f512ec2eec1fd95159d834f"
  },
  "imported_file_counts": [
    61,
    57
  ],
  "binding_count": 269,
  "bindings": [
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/antwoorden/page-1.png",
      "sha256": "e64482170c9bf4117f064d72c81ccb73e5cb25220916188deb58867a0329a844",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/antwoorden/page-2.png",
      "sha256": "821d393d65e82843b8f4b9d62f0fe4e4c75c57a4909ec9c3ac127a502c250591",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/antwoorden/page-3.png",
      "sha256": "3aece13ce42a7ab19411768002f77629492a3be5c7865ec5732a9ffad3872b9a",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/antwoorden/page-4.png",
      "sha256": "db38f2c267dff1647809ec28072a022f55fbf4d4bd4c214844f4e3404b0e64a0",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/antwoorden/page-5.png",
      "sha256": "7c5579d04121743f7d9adee6140adf84dc5030e7da66c14c68948d5d3dcf2b51",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/antwoorden/page-6.png",
      "sha256": "46b66e9cf590e2fa7414ed0347c3c4fdfa8014232931b731a0077f0f84657fc0",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/antwoorden/page-7.png",
      "sha256": "36bedb4aa924e1990c8d5c61dd3a01710ff8c0a12d58e8ea65c132f31f2ab22b",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/before.json",
      "sha256": "be99ada17166b9eef13fcde442ace44376ec0364b68e45a2c96e418207860c61",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/commands.jsonl",
      "sha256": "fc32c03a188094bfb535abb67f7f6b9680cc2b7f774481d95c9ec6e9df9f8435",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/committed-scope-diagnostic.json",
      "sha256": "4fdbfd5cbbdca3c23f2b2197726b43139f454e653f2fad91bff7906c6542cf21",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/committed-scope.json",
      "sha256": "730fb347d63cf30a1abcf6c75ba3a7ba3206a6dda580e66d8a31218c600a1544",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW-evidence/diagnostic-manifest.json",
      "sha256": "456f5ba7fcb2409eeb422b53f719170c93c583811b15f8d3f408e21db4d22da2",
      "role": "exact published review evidence"
    },
    {
      "repository": "4veco-platform",
      "path": "reports/sprints/BOOK2-TE
...[truncated 80515 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base 6eb34debb2210a2a4fa6718a13eaeefcacedc8f8 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:28:17.790Z`
- finished_at: `2026-09-05T22:28:17.928Z`
- duration_ms: `138`
- exit_code: `0`
- stdout_sha256: `06ea4fb939040756cd6329f78865c52319c8f84fbd131c6f6adcdcc8186b2503`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 5
  - build-scripts/content/book-2/211/answers.md
  - build-scripts/content/book-2/211/test_bonus.py
  - build-scripts/content/book-2/212/answers.md
  - build-scripts/content/book-2/212/test_bonus.py
  - build-scripts/content/book-2/212/test_metadata.py
- generated index/report: 4
  - reports/github-agent-index-lessen.json
  - reports/github-agent-index-lessen.md
  - reports/github-agent-index-platform.json
  - reports/github-agent-index-platform.md
- review evidence: 291
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-010.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-011.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraa
...[truncated 23944 chars]
```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane textbook --cwd ../4veco-lessen --base d1bd891c052f8a2eed5cf08cc62b921218ebff6c --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:28:17.990Z`
- finished_at: `2026-09-05T22:28:18.105Z`
- duration_ms: `115`
- exit_code: `0`
- stdout_sha256: `f31129d2c51d82cf52cbb2f624d5a7afeefb6935fc5a4b7465e3d05c655a3e50`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (textbook)
- Part A textbook: 2
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1-review.md
  - Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3-review.md

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-remaining-dispatch-check.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:37:45.617Z`
- finished_at: `2026-09-05T22:37:45.728Z`
- duration_ms: `111`
- exit_code: `0`
- stdout_sha256: `54accf1090bfb5aad3a7d2019405327d951e225ea33e442c4f6e802154924282`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "result": "PASS",
  "task": "root coordination only; no pupil authoring, repin or acceptance",
  "work_order_sha256": "5a943ff17c1b9f20d98366cbfa9e2a0032f5d7a2f866f69ad0e6860cbbb4bcd5",
  "dispatch_plan_sha256": "084bf9b368e8b57d38421976ef18258ba725c044c3ff6e72ee588a650d623362",
  "accepted_221_inputs": [
    {
      "file": "2.2.1-textbook-handoff.md",
      "previous": "216e139a6297b59cfb8e62f43eb3a79eb16efc1861e5fc989ad15562a4deb24c",
      "accepted": "3a3357f0f1487fcc8376e5c9717f80d181f2d71c6069f647c6fa7ab71377f811",
      "raw_equals_LF": true
    },
    {
      "file": "2.2.1-review.md",
      "previous": "24995a4d0e5d82327434be1dd94c789275728bdce840c6a7b5d63b59035258eb",
      "accepted": "19bfa448b3c0f80732f2fa77617eb2772880747082fb683c8cd3852c74a96c63",
      "raw_equals_LF": true
    },
    {
      "file": "2.2.1-quality-ref.yaml",
      "previous": "b6f1b389d11c20665577414c17e5ae49962083812d9d1bf474d16231db749508",
      "accepted": "4f0c77e9ae5769bb85c9c32dfa019049f6bccd323dfd0152b7eabf95897879fa",
      "raw_equals_LF": true
    },
    {
      "file": "2.2.1 Prijselasticiteit – paragraaf.md",
      "previous": "e7e4287645c26c3b79406a556c05a4c90dd10e10e3605b409b89a123df7fa281",
      "accepted": "ae61910c6306ff6af9d52a57db060083ca64facadc4424f1d4a96708d71974db",
      "raw_equals_LF": true
    }
  ],
  "frozen_mixed_targets": {
    "2.1.4": "fda623dc9a3620724bf9df22a3ef937fd26779fa49d4d2b0b7c6baa862753691",
    "2.2.4": "4e0840ddf202ce4906ee05cd4dde97c0f3577885c34f0b9613ea18760aad7519",
    "2.3.4": "2ac151882b64b0d990ce5627ae35388d72eefde74c4e24562ef9a49a9355672c"
  },
  "points_each": 14,
  "new_theory": false,
  "independent_arithmetic": {
    "SmoothBox": {
      "qBE": 400,
      "normalProfit": 900,
      "GTK_exact": "26/7",
      "mk": [
        3,
        3.5,
        4
      ],
      "mo": [
        5,
        5,
        5
      ],
      "growth": [
        2,
        1.5,
        1
      ]
    },
    "StreamPlus": {
      "revenueOld": 500000,
      "revenueNew": 516000,
      "PremiumEi": "15/8",
      "BudgetEi": "-1/2",
      "Ek": "2/5",
      "Q": [
        14200,
        14400
      ]
    },
    "bicycles": {
      "qe": 40,
      "pe": 40,
      "cs": 800,
      "ps": 400,
      "restrictedCS": 600,
      "restrictedPS": 525,
      "loss": 75,
      "first_new_trade_WTP": 49,
      "first_new_trade_MC": 35.5
    }
  },
  "full_223_generation": "NOT_RUN: this is the pre-change work order; distinct builder must execute S1",
  "future_paragraph_plans": "Require their own distinct builder and independent review",
  "inventory_total": 41
}

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.2.3

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:37:45.790Z`
- finished_at: `2026-09-05T22:37:47.971Z`
- duration_ms: `2181`
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
- started_at: `2026-09-05T22:37:48.030Z`
- finished_at: `2026-09-05T22:37:48.672Z`
- duration_ms: `642`
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
- started_at: `2026-09-05T22:37:48.713Z`
- finished_at: `2026-09-05T22:37:48.899Z`
- duration_ms: `186`
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
## node build-scripts/workflows/check-paragraph-lane-scope.js --lane shared --base 6eb34debb2210a2a4fa6718a13eaeefcacedc8f8 --head HEAD

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:39:29.103Z`
- finished_at: `2026-09-05T22:39:29.210Z`
- duration_ms: `107`
- exit_code: `0`
- stdout_sha256: `f109e4fb4f346c52185c392445eb7477e3b482ec0ee481ac7dcbe20c722536dd`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Paragraph lane scope: PASS (shared)
- shared platform: 5
  - build-scripts/content/book-2/211/answers.md
  - build-scripts/content/book-2/211/test_bonus.py
  - build-scripts/content/book-2/212/answers.md
  - build-scripts/content/book-2/212/test_bonus.py
  - build-scripts/content/book-2/212/test_metadata.py
- generated index/report: 4
  - reports/github-agent-index-lessen.json
  - reports/github-agent-index-lessen.md
  - reports/github-agent-index-platform.json
  - reports/github-agent-index-platform.md
- review evidence: 295
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-antwoorden-498b9a863eef-r5/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-opgaven-97329415bacc-r5/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/contact-sheet.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/manifest.json
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-001.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-002.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-003.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-004.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-005.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-006.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-007.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-008.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-009.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-010.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraaf-9837e3a85f31-r5/pages/page-011.png
  - reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/211-paragraa
...[truncated 24260 chars]
```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-root-qc-adoption-r5.js reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-root-qc-bindings-r5.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:54:41.369Z`
- finished_at: `2026-09-05T22:54:44.574Z`
- duration_ms: `3205`
- exit_code: `0`
- stdout_sha256: `ba18ae0a85f98d8415d475bca4fe23f3ee93a244c3667cf71372dbef1fb51b89`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "status": "PASS",
  "checkpoint": "Pre-root-acceptance 211 R5 specialist adoption",
  "imported_paths": 100,
  "checks": 346,
  "native_files": 21,
  "pages": 31,
  "figures": 6,
  "root_prior_full_print_reproduction_rebound": true,
  "root_visual": "Prior own R5 answer7 plus30 exact prior pages; no new personal-view claim",
  "specialist_visual": "31 fresh full pages plus6 native figures and6 grays attributed in bound report",
  "root_acceptance": "PENDING"
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe -m unittest discover -s build-scripts/content/book-2/211 -p "test_*.py" -v

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:54:56.209Z`
- finished_at: `2026-09-05T22:54:58.589Z`
- duration_ms: `2380`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `7280fee9b67d5e6cddc75e283471e59a82578c21e43fddffb152a03345045566`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_all_original_test_bodies_and_generator_remain_exact (test_bonus.BonusContractTests.test_all_original_test_bodies_and_generator_remain_exact) ... ok
test_changed_existing_model_answer_is_rejected (test_bonus.BonusContractTests.test_changed_existing_model_answer_is_rejected) ... ok
test_current_complete_sources_equal_exact_insertion (test_bonus.BonusContractTests.test_current_complete_sources_equal_exact_insertion) ... ok
test_extra_criterion_is_rejected (test_bonus.BonusContractTests.test_extra_criterion_is_rejected) ... ok
test_misplaced_block_is_rejected (test_bonus.BonusContractTests.test_misplaced_block_is_rejected) ... ok
test_missing_one_criterion_is_rejected (test_bonus.BonusContractTests.test_missing_one_criterion_is_rejected) ... ok
test_real_old_missing_block_is_rejected (test_bonus.BonusContractTests.test_real_old_missing_block_is_rejected) ... ok
test_unrelated_source_drift_is_rejected (test_bonus.BonusContractTests.test_unrelated_source_drift_is_rejected) ... ok
test_accessible_svg_titles_are_concise_noun_first (test_source.SourceContractTests.test_accessible_svg_titles_are_concise_noun_first) ... ok
test_answer_coverage (test_source.SourceContractTests.test_answer_coverage) ... ok
test_canonical_exercise_source_shared (test_source.SourceContractTests.test_canonical_exercise_source_shared) ... ok
test_exact_four_goals (test_source.SourceContractTests.test_exact_four_goals) ... ok
test_figures_add_one_relationship_at_a_time (test_source.SourceContractTests.test_figures_add_one_relationship_at_a_time) ... ok
test_numeric_models_independently_recomputed (test_source.SourceContractTests.test_numeric_models_independently_recomputed) ... ok
test_proof_revision_rejects_path_components_before_any_write (test_source.SourceContractTests.test_proof_revision_rejects_path_components_before_any_write) ... ok
test_reproducible_sources_and_assets (test_source.SourceContractTests.test_reproducible_sources_and_assets) ... ok
test_six_assets_and_every_reference (test_source.SourceContractTests.test_six_assets_and_every_reference) ... ok
test_source_letters_are_not_pandoc_auto_lists (test_source.SourceContractTests.test_source_letters_are_not_pandoc_auto_lists) ... ok
test_target_exact_source_and_points (test_source.SourceContractTests.test_target_exact_source_and_points) ... ok
test_target_table_retains_every_frozen_cell (test_source.SourceContractTests.test_target_table_retains_every_frozen_cell) ... ok
test_worked_image_native_short_alt_keeps_entire_caption (test_source.SourceContractTests.test_worked_image_native_short_alt_keeps_entire_caption) ... ok

----------------------------------------------------------------------
Ran 21 tests in 2.052s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/211/check_render.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:54:58.636Z`
- finished_at: `2026-09-05T22:54:59.465Z`
- duration_ms: `829`
- exit_code: `0`
- stdout_sha256: `2f2f228314401c3705aa5341d9e4deef008f80215df96c09b079929040abd5de`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "paragraph": "2.1.1",
  "automated_checks": [
    "all printed text including footer >=12pt",
    "all exercises present",
    "exact target context/prompts in HTML and PDF",
    "literal a-e plus4/3/3/3/4points",
    "exact supplied header/row cells",
    "four exact goals in paragraph PDF",
    "identical exercise HTML fragments"
  ],
  "documents": [
    {
      "kind": "paragraaf",
      "pages": 15,
      "minimum_printed_font_pt_including_footer": 12.0,
      "pdf_sha256": "9837e3a85f3129a5309a36b17fd1030702ba92fc7ef464af609cb878e4d2f8b0"
    },
    {
      "kind": "opgaven",
      "pages": 9,
      "minimum_printed_font_pt_including_footer": 12.0,
      "pdf_sha256": "97329415bacc150675a327ad31455b25b8e9e1b03012ef6b65dab10ab1f02953"
    },
    {
      "kind": "antwoorden",
      "pages": 7,
      "minimum_printed_font_pt_including_footer": 12.0,
      "pdf_sha256": "498b9a863eef9c0feefd50e8a50e72aa41c626caaca79f0b98261b8b3104e5ce"
    }
  ],
  "visual_review_status": "NOT_SUPPLIED_BY_THIS_SCRIPT"
}

```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:55:17.680Z`
- finished_at: `2026-09-05T22:55:17.775Z`
- duration_ms: `95`
- exit_code: `0`
- stdout_sha256: `4fc27f991b8fac500c91ffc07a09671a5d48514bac4a3a017c104007c2f36838`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.1 "Kostenstructuren"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.1 Kostenstructuren
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.1 Kostenstructuren – paragraaf.md
  OK opgaven.md: 2.1.1 Kostenstructuren – opgaven.md
  OK antwoorden.md: 2.1.1 Kostenstructuren – antwoorden.md
  OK 2.1.1 Kostenstructuren – paragraaf.html (710.4 KB)
  OK 2.1.1 Kostenstructuren – opgaven.html (245.1 KB)
  OK 2.1.1 Kostenstructuren – antwoorden.html (18.8 KB)
  OK 2.1.1 Kostenstructuren – paragraaf.pdf (518 KB)
  OK 2.1.1 Kostenstructuren – opgaven.pdf (188 KB)
  OK 2.1.1 Kostenstructuren – antwoorden.pdf (31 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 6 image refs all resolve
  OK _assets/: 6 SVGs, 6 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.1 "Kostenstructuren" PASSED all checks.


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:55:17.829Z`
- finished_at: `2026-09-05T22:55:17.919Z`
- duration_ms: `90`
- exit_code: `0`
- stdout_sha256: `f977ab456da0d2239f7aea063296f613f72130435d6db4b51b7dac122d3d7a6f`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.1 "Kostenstructuren"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.1 Kostenstructuren
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.1 Kostenstructuren – paragraaf.md
  OK opgaven.md: 2.1.1 Kostenstructuren – opgaven.md
  OK antwoorden.md: 2.1.1 Kostenstructuren – antwoorden.md
  OK 2.1.1 Kostenstructuren – paragraaf.pdf (518 KB)
  OK 2.1.1 Kostenstructuren – opgaven.pdf (188 KB)
  OK 2.1.1 Kostenstructuren – antwoorden.pdf (31 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 6 image refs all resolve
  OK _assets/: 6 SVGs, 6 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.1 "Kostenstructuren" PASSED all checks.


```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.1.1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:55:17.968Z`
- finished_at: `2026-09-05T22:55:19.608Z`
- duration_ms: `1640`
- exit_code: `0`
- stdout_sha256: `2588f67f1bb250f78fd94fc551099e1000c659528e8d3a89119566c3a55d52cd`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.1

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T22:55:19.656Z`
- finished_at: `2026-09-05T22:55:20.211Z`
- duration_ms: `555`
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
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-acceptance-inventory-check-r5.js reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-acceptance-inventory-r5.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:01:04.299Z`
- finished_at: `2026-09-05T23:01:04.821Z`
- duration_ms: `522`
- exit_code: `0`
- stdout_sha256: `eccc42a851152f6fb5fc5780e08c0b495388e6746f81cbf5f7c082566584ee12`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "status": "PASS",
  "scope": "Current211 R5 root-only acceptance and41-PDF inventory",
  "canonical": {
    "2.1.1-review.md": "a75755c7c2e6cdffb2defcbb5403814cf854d87bfae9a8172dd768aadb5b8023",
    "2.1.1-quality-ref.yaml": "c85c44a53d46af87ad61500b83b0fd721fac43c97ffd1be3d512308158a4b9f5",
    "2.1.1-textbook-handoff.md": "0d14506e314a11fef0637cc66cf29036f174b94cafbf7fa5ede2eff88937500f"
  },
  "lesson_changed_paths": [
    "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1-quality-ref.yaml",
    "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1-textbook-handoff.md"
  ],
  "root_fields_only": true,
  "unchanged_paragraph_files": 25,
  "handoff_sections": 9,
  "handoff_document_hashes": 9,
  "pre_state_bindings_rechecked": 346,
  "counts": {
    "A": 9,
    "C": 9,
    "L": 8,
    "P": 15
  },
  "present": 26,
  "current_pdf_hashes": 18,
  "book_complete": false
}

```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:01:26.838Z`
- finished_at: `2026-09-05T23:01:26.896Z`
- duration_ms: `58`
- exit_code: `0`
- stdout_sha256: `4fc27f991b8fac500c91ffc07a09671a5d48514bac4a3a017c104007c2f36838`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.1 "Kostenstructuren"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.1 Kostenstructuren
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.1 Kostenstructuren – paragraaf.md
  OK opgaven.md: 2.1.1 Kostenstructuren – opgaven.md
  OK antwoorden.md: 2.1.1 Kostenstructuren – antwoorden.md
  OK 2.1.1 Kostenstructuren – paragraaf.html (710.4 KB)
  OK 2.1.1 Kostenstructuren – opgaven.html (245.1 KB)
  OK 2.1.1 Kostenstructuren – antwoorden.html (18.8 KB)
  OK 2.1.1 Kostenstructuren – paragraaf.pdf (518 KB)
  OK 2.1.1 Kostenstructuren – opgaven.pdf (188 KB)
  OK 2.1.1 Kostenstructuren – antwoorden.pdf (31 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 6 image refs all resolve
  OK _assets/: 6 SVGs, 6 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.1 "Kostenstructuren" PASSED all checks.


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:01:26.941Z`
- finished_at: `2026-09-05T23:01:27.002Z`
- duration_ms: `61`
- exit_code: `0`
- stdout_sha256: `f977ab456da0d2239f7aea063296f613f72130435d6db4b51b7dac122d3d7a6f`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.1 "Kostenstructuren"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.1 Kostenstructuren
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.1 Kostenstructuren – paragraaf.md
  OK opgaven.md: 2.1.1 Kostenstructuren – opgaven.md
  OK antwoorden.md: 2.1.1 Kostenstructuren – antwoorden.md
  OK 2.1.1 Kostenstructuren – paragraaf.pdf (518 KB)
  OK 2.1.1 Kostenstructuren – opgaven.pdf (188 KB)
  OK 2.1.1 Kostenstructuren – antwoorden.pdf (31 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 6 image refs all resolve
  OK _assets/: 6 SVGs, 6 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.1-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.1-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.1 "Kostenstructuren" PASSED all checks.


```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.1.1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:01:27.044Z`
- finished_at: `2026-09-05T23:01:28.581Z`
- duration_ms: `1537`
- exit_code: `0`
- stdout_sha256: `2588f67f1bb250f78fd94fc551099e1000c659528e8d3a89119566c3a55d52cd`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.1.1

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:01:28.617Z`
- finished_at: `2026-09-05T23:01:29.151Z`
- duration_ms: `534`
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
- started_at: `2026-09-05T23:01:29.195Z`
- finished_at: `2026-09-05T23:01:29.365Z`
- duration_ms: `170`
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
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-root-publication-scope-r5.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:03:20.467Z`
- finished_at: `2026-09-05T23:03:20.832Z`
- duration_ms: `365`
- exit_code: `0`
- stdout_sha256: `9ac9fe80f9694b4f1d981625ebdbb1720333961b846fc4385b8d165f3d0f09ba`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "status": "PASS",
  "platform_payload": "994b6ec7eca2ef36fc522ac7862f7fdd24360d8c",
  "lesson_acceptance": "5e14325d70b6cc6aee643d9b57395c92b0904ffb",
  "strict_current_adoption_paths": 109,
  "comparisons": [
    {
      "lane": "shared",
      "base": "6eb34debb2210a2a4fa6718a13eaeefcacedc8f8",
      "head": "994b6ec7eca2ef36fc522ac7862f7fdd24360d8c",
      "counts": {
        "partA_textbook": 0,
        "partB_companion": 0,
        "shared_platform": 5,
        "generated_indexes": 4,
        "review_evidence": 401,
        "unknown": 0
      }
    },
    {
      "lane": "textbook",
      "base": "25fbd9ba66f6ead59f512ec2eec1fd95159d834f",
      "head": "5e14325d70b6cc6aee643d9b57395c92b0904ffb",
      "counts": {
        "partA_textbook": 1,
        "partB_companion": 0,
        "shared_platform": 0,
        "generated_indexes": 0,
        "review_evidence": 1,
        "unknown": 0
      }
    }
  ],
  "waiver": false
}

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-review-adoption-r7-check.js reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-review-adoption-r7-bindings.json

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:08:10.841Z`
- finished_at: `2026-09-05T23:08:15.586Z`
- duration_ms: `4745`
- exit_code: `0`
- stdout_sha256: `acb59cc09de513348e802e1f1c1b048bdf116a19839a60849ac9e40e0cda7673`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "status": "PASS",
  "imported_paths": 132,
  "checks": 365,
  "native_files": 34,
  "protected_rows": 82,
  "succession": [
    {
      "path": "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – antwoorden.html",
      "old": "d4d3db3265820003a45e71955b9f3f2188a6036860fdcdc8fbbc49b944bfd0ca",
      "current": "b2e86d7bae4d1bdbb7cd47a55cd6e83254398618f0954fe3ce09cdb75927c916",
      "accepted_commit": "5e14325d70b6cc6aee643d9b57395c92b0904ffb"
    },
    {
      "path": "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – antwoorden.md",
      "old": "57cc1ef3b5c5ae6d912291f9746a7f535906bb85207678bab8fc63dadf82ebfb",
      "current": "f7572e3d4f2fc5bc092562eb06e76ebb0480fbbc8aa1ea01d3752a7251cbbdc9",
      "accepted_commit": "5e14325d70b6cc6aee643d9b57395c92b0904ffb"
    },
    {
      "path": "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – antwoorden.pdf",
      "old": "ffdf0905a980b6c89b64207e90873d79edbf192c86c2280f3394caa25693998a",
      "current": "498b9a863eef9c0feefd50e8a50e72aa41c626caaca79f0b98261b8b3104e5ce",
      "accepted_commit": "5e14325d70b6cc6aee643d9b57395c92b0904ffb"
    },
    {
      "path": "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1-quality-ref.yaml",
      "old": "0dddb6e9d8f3a8da0e0f31e67dafabf53b99feb6ad86ce72039480dd7e12ea18",
      "current": "c85c44a53d46af87ad61500b83b0fd721fac43c97ffd1be3d512308158a4b9f5",
      "accepted_commit": "5e14325d70b6cc6aee643d9b57395c92b0904ffb"
    },
    {
      "path": "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1-review.md",
      "old": "92b4a9462caf8316274fb58f8beef5c850147c44e6bf80b9a28fad442d9dbe96",
      "current": "a75755c7c2e6cdffb2defcbb5403814cf854d87bfae9a8172dd768aadb5b8023",
      "accepted_commit": "5e14325d70b6cc6aee643d9b57395c92b0904ffb"
    },
    {
      "path": "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/2.1.1-textbook-handoff.md",
      "old": "724a080619f2f072151edf20980071b3bef18cd60d1904c78f4aa906be8917c8",
      "current": "0d14506e314a11fef0637cc66cf29036f174b94cafbf7fa5ede2eff88937500f",
      "accepted_commit": "5e14325d70b6cc6aee643d9b57395c92b0904ffb"
    }
  ],
  "proof_pages_preserved": 54,
  "personally_inspected_by_reviewer": 27,
  "figures": 11,
  "current_212_QC": "PENDING",
  "current_212_handoff": "STALE_UNCHANGED",
  "combined_root_full_build": "NOT_RUN_TWO_OLD_211_PINS_PENDING_S1"
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe -m unittest discover -s build-scripts/content/book-2/212 -p "test_*.py" -v

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:08:15.637Z`
- finished_at: `2026-09-05T23:08:17.137Z`
- duration_ms: `1500`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `aa32323253aed9951dd39e87580af830de79b928116c28b1e213210cf9f39409`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_current_exact_full_source_and_three_criteria (test_bonus.BonusTests.test_current_exact_full_source_and_three_criteria) ... ok
test_missing_extra_and_misplaced_criteria_rejected (test_bonus.BonusTests.test_missing_extra_and_misplaced_criteria_rejected) ... ok
test_model_answer_and_unrelated_source_drift_rejected (test_bonus.BonusTests.test_model_answer_and_unrelated_source_drift_rejected) ... ok
test_five_context_titles_and_old_negative_fixtures (test_metadata.MetadataTests.test_five_context_titles_and_old_negative_fixtures) ... ok
test_nine_exact_native_insertions_and_unchanged_full_sources (test_metadata.MetadataTests.test_nine_exact_native_insertions_and_unchanged_full_sources) ... ok
test_original_failing_alt_fixtures_remain_negative (test_metadata.MetadataTests.test_original_failing_alt_fixtures_remain_negative) ... ok
test_short_alts_functional_and_bounded (test_metadata.MetadataTests.test_short_alts_functional_and_bounded) ... ok
test_unchanged_generator_outside_title_loop (test_metadata.MetadataTests.test_unchanged_generator_outside_title_loop) ... ok
test_eleven_assets_and_no_answer_leakage (test_source.SourceTests.test_eleven_assets_and_no_answer_leakage) ... ok
test_exact_arithmetic_geometry (test_source.SourceTests.test_exact_arithmetic_geometry) ... ok
test_font_and_contrast (test_source.SourceTests.test_font_and_contrast) ... ok
test_frozen_target_goals_points_answers (test_source.SourceTests.test_frozen_target_goals_points_answers) ... ok
test_no_letter_drift_or_online_dependencies (test_source.SourceTests.test_no_letter_drift_or_online_dependencies) ... ok
test_other_arithmetic_and_timing (test_source.SourceTests.test_other_arithmetic_and_timing) ... ok
test_progressive_graphs (test_source.SourceTests.test_progressive_graphs) ... ok
test_repeatable (test_source.SourceTests.test_repeatable) ... ok
test_single_exercise_source_and_headings (test_source.SourceTests.test_single_exercise_source_and_headings) ... ok
test_unsafe_proof_suffix_before_write (test_source.SourceTests.test_unsafe_proof_suffix_before_write) ... ok

----------------------------------------------------------------------
Ran 18 tests in 1.183s

OK

```
## C:/Python314/python.exe build-scripts/content/book-2/212/check_render.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:08:17.187Z`
- finished_at: `2026-09-05T23:08:18.864Z`
- duration_ms: `1677`
- exit_code: `0`
- stdout_sha256: `b40d27954066429b90194dfb47be85c56d6f3c623101294917c41e3ad81e98bf`
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
      "html_sha256": "85eff0548ce75161a2935e2bb3d0bb470f30ec10e95996c670605574d89454b5",
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
      "html_sha256": "87c55209dd450e989476f2f9779feb88de9fac9bbc77a0805112a444ffb65a06",
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
      "pdf_sha256": "d55f1da66723cd6f932cbf0793ce79d8d4188d2d907244fd40cc6f6fbad5ac90",
      "html_sha256": "be02782985485caca268df98af897104d78feec9737032cd14803c978a318a82",
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
...[truncated 463 chars]
```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:08:45.001Z`
- finished_at: `2026-09-05T23:08:45.081Z`
- duration_ms: `80`
- exit_code: `0`
- stdout_sha256: `e30cfd65afd4244a631f2f4aa071a299a8560a9e7ebddebaf72a6b2ff77c89c7`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.2 "Opbrengsten, winst en break-even"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.2 Opbrengsten, winst en break-even
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.2 Opbrengsten, winst en break-even – paragraaf.md
  OK opgaven.md: 2.1.2 Opbrengsten, winst en break-even – opgaven.md
  OK antwoorden.md: 2.1.2 Opbrengsten, winst en break-even – antwoorden.md
  OK 2.1.2 Opbrengsten, winst en break-even – paragraaf.html (1336.0 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – opgaven.html (742.0 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – antwoorden.html (497.9 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – paragraaf.pdf (1009 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – opgaven.pdf (563 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – antwoorden.pdf (383 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 11 image refs all resolve
  OK _assets/: 11 SVGs, 11 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.2-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.2-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.2 "Opbrengsten, winst en break-even" PASSED all checks.


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:08:45.128Z`
- finished_at: `2026-09-05T23:08:45.201Z`
- duration_ms: `73`
- exit_code: `0`
- stdout_sha256: `4983103bfafb1add446b1f5ddf2c38e05e50fd547a634aa1d83f070567c7a0cf`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.1.2 "Opbrengsten, winst en break-even"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.1 Hoofdstuk Kosten en opbrengsten\2.1.2 Opbrengsten, winst en break-even
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.1.2 Opbrengsten, winst en break-even – paragraaf.md
  OK opgaven.md: 2.1.2 Opbrengsten, winst en break-even – opgaven.md
  OK antwoorden.md: 2.1.2 Opbrengsten, winst en break-even – antwoorden.md
  OK 2.1.2 Opbrengsten, winst en break-even – paragraaf.pdf (1009 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – opgaven.pdf (563 KB)
  OK 2.1.2 Opbrengsten, winst en break-even – antwoorden.pdf (383 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 11 image refs all resolve
  OK _assets/: 11 SVGs, 11 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.1.2-review.md (verdict PASS WITH FLAGS)
  OK Quality ref: 2.1.2-quality-ref.yaml (valid)

==========================================
OK Paragraph 2.1.2 "Opbrengsten, winst en break-even" PASSED all checks.


```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.1.2

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:08:45.254Z`
- finished_at: `2026-09-05T23:08:46.921Z`
- duration_ms: `1667`
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
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:08:46.962Z`
- finished_at: `2026-09-05T23:08:47.500Z`
- duration_ms: `538`
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
- started_at: `2026-09-05T23:08:47.545Z`
- finished_at: `2026-09-05T23:08:47.716Z`
- duration_ms: `171`
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
## node -e "const {execFileSync}=require(\"child_process\"),a=require(\"assert/strict\");for(const [lane,base,head,cwd]of [[\"shared\",\"6eb34debb2210a2a4fa6718a13eaeefcacedc8f8\",\"2b757f911b7118ce09aeec5878133ea0dc34fa15\",null],[\"textbook\",\"5e14325d70b6cc6aee643d9b57395c92b0904ffb\",\"d4e1910d60964ee4b9ac97eefbf0e0ed202fc28f\",\"../4veco-lessen\"]]){const args=[\"build-scripts/workflows/check-paragraph-lane-scope.js\",\"--lane\",lane,\"--base\",base,\"--head\",head,\"--json\"];if(cwd)args.push(\"--cwd\",cwd);const r=JSON.parse(execFileSync(process.execPath,args,{encoding:\"utf8\",maxBuffer:12000000}));a.equal(r.ok,true);console.log(JSON.stringify({lane,base,head,ok:r.ok,counts:Object.fromEntries(Object.entries(r.categories).map(([k,v])=>[k,v.length])),failures:r.failures,warnings:r.warnings}));}"

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:10:56.839Z`
- finished_at: `2026-09-05T23:10:56.934Z`
- duration_ms: `95`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `a39bc801b5bd8cbc1dc5a3caf71dae4cabec0a92d59e02903e788624b69403c0`

### stdout excerpt

```text

```

### stderr excerpt

```text
[eval]:1
const

Unexpected token `<eof>`. Expected yield, an identifier, [ or {

SyntaxError: Unexpected end of input
    at makeContextifyScript (node:internal/vm:194:14)
    at compileScript (node:internal/process/execution:388:10)
    at evalTypeScript (node:internal/process/execution:260:22)
    at node:internal/main/eval_string:71:3

Node.js v24.13.1

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-review-adoption-r7-scope.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:11:26.582Z`
- finished_at: `2026-09-05T23:11:26.820Z`
- duration_ms: `238`
- exit_code: `0`
- stdout_sha256: `20277b2b506b380bf6c9a2074cbe27881e20f7058aefdddffeb5c4fb6207c486`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "status": "PASS",
  "own_paths": 140,
  "comparisons": [
    {
      "lane": "shared",
      "base": "6eb34debb2210a2a4fa6718a13eaeefcacedc8f8",
      "head": "2b757f911b7118ce09aeec5878133ea0dc34fa15",
      "counts": {
        "partA_textbook": 0,
        "partB_companion": 0,
        "shared_platform": 5,
        "generated_indexes": 4,
        "review_evidence": 541,
        "unknown": 0
      },
      "failures": [],
      "warnings": []
    },
    {
      "lane": "textbook",
      "base": "5e14325d70b6cc6aee643d9b57395c92b0904ffb",
      "head": "d4e1910d60964ee4b9ac97eefbf0e0ed202fc28f",
      "counts": {
        "partA_textbook": 1,
        "partB_companion": 0,
        "shared_platform": 0,
        "generated_indexes": 0,
        "review_evidence": 0,
        "unknown": 0
      },
      "failures": [],
      "warnings": []
    }
  ]
}

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-import-check.js prepare

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:31:15.979Z`
- finished_at: `2026-09-05T23:31:37.961Z`
- duration_ms: `21982`
- exit_code: `0`
- stdout_sha256: `807c5eb9c3f0e699d5e236cbf080c86602d225b00dcf7596a26ba74de1c6ff7c`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "status": "PASS",
  "phase": "prepare",
  "imports": 499,
  "gray": 66,
  "pending": 27,
  "root_selected_views": 6,
  "output": "reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-231-root-import-prepare.json",
  "sha256": "a5d70bf29c18163fa62d8d5b809511b87aa171f0bdfad8b2937a3e79d54ec8eb"
}

```

### stderr excerpt

```text

```
## pwsh -NoProfile -File reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-relocate.ps1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:31:50.347Z`
- finished_at: `2026-09-05T23:31:54.148Z`
- duration_ms: `3801`
- exit_code: `0`
- stdout_sha256: `00729722e243f1a0b21720447cb22695193de9c1fdc6c439faaa24a49af0a75c`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
PASS: exactly 66 byte-identical supplemental PNGs relocated inside the claimed root worktree; original builder history/files untouched.

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-import-check.js after

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:31:54.196Z`
- finished_at: `2026-09-05T23:32:13.173Z`
- duration_ms: `18977`
- exit_code: `0`
- stdout_sha256: `b0e2f65e22444b5343b62b4f11ac5b7b6b0d18b6c7487d88399a5c559cc34590`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "status": "PASS",
  "phase": "after",
  "imports": 499,
  "gray": 66,
  "pending": 27,
  "root_selected_views": 6,
  "output": "reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-231-root-import-after.json",
  "sha256": "b0fd3d453dc6e657705242e83822070351ba9c172b893eff2f799814d97e0a5a"
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe build-scripts/content/book-2/231/test_source.py

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:33:23.846Z`
- finished_at: `2026-09-05T23:33:25.326Z`
- duration_ms: `1480`
- exit_code: `0`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `971e4701579ee35b2ebe9e18088612b6647de69c2bd143c2dc6e94090f489ec1`

### stdout excerpt

```text

```

### stderr excerpt

```text
test_actual_native_name_regex_all30 (__main__.SourceTests.test_actual_native_name_regex_all30) ... ok
test_actual_svg_economic_geometry_and_roles (__main__.SourceTests.test_actual_svg_economic_geometry_and_roles) ... ok
test_actual_svg_labels_canvas_all_ink_boxes (__main__.SourceTests.test_actual_svg_labels_canvas_all_ink_boxes) ... ok
test_all_model_calculations_independent_fractions (__main__.SourceTests.test_all_model_calculations_independent_fractions) ... ok
test_all_task_numbers_and_no_device_or_time_metadata (__main__.SourceTests.test_all_task_numbers_and_no_device_or_time_metadata) ... ok
test_authority_guard_rejects_each_changed_pin_before_processes (__main__.SourceTests.test_authority_guard_rejects_each_changed_pin_before_processes) ... ok
test_bonus_model_then_exact_three_criteria_and_negative_fixtures (__main__.SourceTests.test_bonus_model_then_exact_three_criteria_and_negative_fixtures) ... ok
test_discrete_and_model_boundary (__main__.SourceTests.test_discrete_and_model_boundary) ... ok
test_every_actual_alt_caption_and_union (__main__.SourceTests.test_every_actual_alt_caption_and_union) ... ok
test_exact_headings_route_and_recap (__main__.SourceTests.test_exact_headings_route_and_recap) ... ok
test_fading_and_independent_surfaces (__main__.SourceTests.test_fading_and_independent_surfaces) ... ok
test_fresh_revision_and_immutable_attempt_guards (__main__.SourceTests.test_fresh_revision_and_immutable_attempt_guards) ... ok
test_frozen_goals_target_and_scoring (__main__.SourceTests.test_frozen_goals_target_and_scoring) ... ok
test_no_false_predecessor_acceptance_or_changed_plan (__main__.SourceTests.test_no_false_predecessor_acceptance_or_changed_plan) ... ok
test_print_margin_guard_rejects_body_in_footer_and_false_footer (__main__.SourceTests.test_print_margin_guard_rejects_body_in_footer_and_false_footer) ... ok

----------------------------------------------------------------------
Ran 15 tests in 0.870s

OK

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-import-scope.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:34:31.851Z`
- finished_at: `2026-09-05T23:34:32.459Z`
- duration_ms: `608`
- exit_code: `0`
- stdout_sha256: `2a236388b20378b1f1b255e8012704ba0a2d6ffdaac203ac37c8f740ad49b6cf`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "status": "PASS",
  "checks": [
    {
      "name": "root_import_platform",
      "exit_code": 0,
      "categories": {
        "partA_textbook": 0,
        "partB_companion": 0,
        "shared_platform": 9,
        "generated_indexes": 0,
        "review_evidence": 453,
        "unknown": 0
      }
    },
    {
      "name": "root_import_lessons",
      "exit_code": 0,
      "categories": {
        "partA_textbook": 43,
        "partB_companion": 0,
        "shared_platform": 0,
        "generated_indexes": 0,
        "review_evidence": 0,
        "unknown": 0
      }
    },
    {
      "name": "complete_platform",
      "exit_code": 0,
      "categories": {
        "partA_textbook": 0,
        "partB_companion": 0,
        "shared_platform": 78,
        "generated_indexes": 6,
        "review_evidence": 2538,
        "unknown": 0
      }
    },
    {
      "name": "complete_lessons",
      "exit_code": 0,
      "categories": {
        "partA_textbook": 201,
        "partB_companion": 0,
        "shared_platform": 0,
        "generated_indexes": 0,
        "review_evidence": 4,
        "unknown": 0
      }
    }
  ],
  "output": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-231-root-import-scope.json"
}

```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:36:28.318Z`
- finished_at: `2026-09-05T23:36:28.427Z`
- duration_ms: `109`
- exit_code: `1`
- stdout_sha256: `06a2bcb223facd75235657e5d2c1e7e254d6e17a42cba1a1ba72947eebf4c8b5`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.3.1 "Consumentensurplus"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.3 Hoofdstuk Surplus en welvaart\2.3.1 Consumentensurplus
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.3.1 Consumentensurplus – paragraaf.md
  OK opgaven.md: 2.3.1 Consumentensurplus – opgaven.md
  OK antwoorden.md: 2.3.1 Consumentensurplus – antwoorden.md
  OK 2.3.1 Consumentensurplus – paragraaf.html (1895.9 KB)
  OK 2.3.1 Consumentensurplus – opgaven.html (988.6 KB)
  OK 2.3.1 Consumentensurplus – antwoorden.html (1765.1 KB)
  OK 2.3.1 Consumentensurplus – paragraaf.pdf (1116 KB)
  OK 2.3.1 Consumentensurplus – opgaven.pdf (617 KB)
  OK 2.3.1 Consumentensurplus – antwoorden.pdf (1102 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 15 image refs all resolve
  OK _assets/: 15 SVGs, 15 PNGs

-- Part A QC artifacts --
  X MISSING Part A review report (2.3.1-review.md)
  X MISSING quality_ref (2.3.1-quality-ref.yaml)

==========================================
FAIL Paragraph 2.3.1 "Consumentensurplus" failed: 2 error(s), 0 warning(s).


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:36:28.484Z`
- finished_at: `2026-09-05T23:36:28.581Z`
- duration_ms: `97`
- exit_code: `1`
- stdout_sha256: `e000ec88c0fe14808c81bdf6c0145263776b724a667596a85f9346fba26cce1b`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.3.1 "Consumentensurplus"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.3 Hoofdstuk Surplus en welvaart\2.3.1 Consumentensurplus
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.3.1 Consumentensurplus – paragraaf.md
  OK opgaven.md: 2.3.1 Consumentensurplus – opgaven.md
  OK antwoorden.md: 2.3.1 Consumentensurplus – antwoorden.md
  OK 2.3.1 Consumentensurplus – paragraaf.pdf (1116 KB)
  OK 2.3.1 Consumentensurplus – opgaven.pdf (617 KB)
  OK 2.3.1 Consumentensurplus – antwoorden.pdf (1102 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 15 image refs all resolve
  OK _assets/: 15 SVGs, 15 PNGs

-- Part A QC artifacts --
  X MISSING Part A review report (2.3.1-review.md)
  X MISSING quality_ref (2.3.1-quality-ref.yaml)

==========================================
FAIL Paragraph 2.3.1 "Consumentensurplus" failed: 2 error(s), 0 warning(s).


```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.3.1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:36:28.637Z`
- finished_at: `2026-09-05T23:36:30.318Z`
- duration_ms: `1681`
- exit_code: `0`
- stdout_sha256: `17c621a2434015110c4cb7717f5a302b74ab68762f2574dbcdd25e8895ecce87`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.3.1

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:36:30.361Z`
- finished_at: `2026-09-05T23:36:30.914Z`
- duration_ms: `553`
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
- started_at: `2026-09-05T23:36:30.956Z`
- finished_at: `2026-09-05T23:36:31.136Z`
- duration_ms: `180`
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
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-inventory.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:45:02.560Z`
- finished_at: `2026-09-05T23:45:03.714Z`
- duration_ms: `1154`
- exit_code: `0`
- stdout_sha256: `21e04b8fd0bb3185528b4ec4b4eed38ac5301e69357dddb60ff5317d7eb65d47`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "status": "PASS",
  "counts": {
    "A": 9,
    "C": 12,
    "L": 8,
    "P": 12
  },
  "present": 29,
  "absent": 12,
  "current_pdf_hashes": 21,
  "legacy_exact": 8,
  "output": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-231-root-inventory.json"
}

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-review-check.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:48:31.496Z`
- finished_at: `2026-09-05T23:48:37.484Z`
- duration_ms: `5988`
- exit_code: `0`
- stdout_sha256: `48913f6b305faa1148981763fd6e7bd07332db03d6a5821e69c91f2cbc62599b`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "status": "PASS",
  "platform_imports": 186,
  "lesson_review": 1,
  "baseline_lesson_files": 44,
  "page_observations": 66,
  "native_figures": 15,
  "negative_probes": 23,
  "native_color_pages": 99,
  "output": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-231-root-review-bindings.json",
  "sha256": "84304abf537fafb037d6c9a9cdb27d6b9b571a2d828dbb077fbd6695030e505c"
}

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-reproduce.js full

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:48:44.825Z`
- finished_at: `2026-09-05T23:49:01.718Z`
- duration_ms: `16893`
- exit_code: `0`
- stdout_sha256: `dfac1f8185762b6365fffd8de08d119f8cff989deff7fa3e977fb99b085ae82c`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "mode": "full",
  "status": "PASS",
  "exit_code": 0,
  "output": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-231-root-full-process.json",
  "sha256": "c8b96bfae8be52bd95195e86d503c9f133dd9e4690aaf337cc1e53581abe5882"
}

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-reproduce.js native

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:50:23.488Z`
- finished_at: `2026-09-05T23:50:28.013Z`
- duration_ms: `4525`
- exit_code: `0`
- stdout_sha256: `23d1c024eab250d8eeb522bbf86195c624e119cd20232902a53bd1b0ff3d0fb4`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "mode": "native",
  "status": "PASS",
  "exit_code": 0,
  "output": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-231-root-native-process.json",
  "sha256": "5261d076ad4eb6e86a263c0a2eb4646535e5338aea21f4920a4a3d0fbcf4fb2d"
}

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-reproduce.js parity

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:50:28.069Z`
- finished_at: `2026-09-05T23:51:25.034Z`
- duration_ms: `56965`
- exit_code: `0`
- stdout_sha256: `6ffa69776409c6b6e05e2af015ed48b9006f5ec213155c558b7426ed996e158e`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "mode": "parity",
  "status": "PASS",
  "exit_code": 0,
  "output": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-231-root-parity-process.json",
  "sha256": "fcc3f240bbfb53b5c3090c3dd09e916f0b0bf09b2e65cc1bd445860151df7285"
}

```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile student-web "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:51:57.806Z`
- finished_at: `2026-09-05T23:51:57.896Z`
- duration_ms: `90`
- exit_code: `1`
- stdout_sha256: `7f259bdf99595a2fcf4f3277f3be8e9b2c29f2805517825cf3575699337b7958`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.3.1 "Consumentensurplus"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.3 Hoofdstuk Surplus en welvaart\2.3.1 Consumentensurplus
Mode: part-a
Profile: student-web

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.3.1 Consumentensurplus – paragraaf.md
  OK opgaven.md: 2.3.1 Consumentensurplus – opgaven.md
  OK antwoorden.md: 2.3.1 Consumentensurplus – antwoorden.md
  OK 2.3.1 Consumentensurplus – paragraaf.html (1895.9 KB)
  OK 2.3.1 Consumentensurplus – opgaven.html (988.6 KB)
  OK 2.3.1 Consumentensurplus – antwoorden.html (1765.1 KB)
  OK 2.3.1 Consumentensurplus – paragraaf.pdf (1116 KB)
  OK 2.3.1 Consumentensurplus – opgaven.pdf (617 KB)
  OK 2.3.1 Consumentensurplus – antwoorden.pdf (1102 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 15 image refs all resolve
  OK _assets/: 15 SVGs, 15 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.3.1-review.md (verdict PASS WITH FLAGS)
  X MISSING quality_ref (2.3.1-quality-ref.yaml)

==========================================
FAIL Paragraph 2.3.1 "Consumentensurplus" failed: 1 error(s), 0 warning(s).


```

### stderr excerpt

```text

```
## node scripts/validate-paragraph.js --mode part-a --profile publisher-print "\"C:/wt/book2-part-a-production-20260905/4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus\""

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:51:57.960Z`
- finished_at: `2026-09-05T23:51:58.058Z`
- duration_ms: `98`
- exit_code: `1`
- stdout_sha256: `b237bb942bcbfd5a0f710ec5eec4d5605dd9460252e232b6391a594023bb2f93`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text

Validating paragraph 2.3.1 "Consumentensurplus"
Path: C:\wt\book2-part-a-production-20260905\4veco-lessen\Boek 2 - Kosten, opbrengsten, elasticiteit en surplus\2.3 Hoofdstuk Surplus en welvaart\2.3.1 Consumentensurplus
Mode: part-a
Profile: publisher-print

-- Part A textbook files --
  OK Paragraph type: theory
  OK paragraaf.md: 2.3.1 Consumentensurplus – paragraaf.md
  OK opgaven.md: 2.3.1 Consumentensurplus – opgaven.md
  OK antwoorden.md: 2.3.1 Consumentensurplus – antwoorden.md
  OK 2.3.1 Consumentensurplus – paragraaf.pdf (1116 KB)
  OK 2.3.1 Consumentensurplus – opgaven.pdf (617 KB)
  OK 2.3.1 Consumentensurplus – antwoorden.pdf (1102 KB)
  OK build_pdf.py

-- Asset integrity --
  OK 15 image refs all resolve
  OK _assets/: 15 SVGs, 15 PNGs

-- Part A QC artifacts --
  OK Part A review: 2.3.1-review.md (verdict PASS WITH FLAGS)
  X MISSING quality_ref (2.3.1-quality-ref.yaml)

==========================================
FAIL Paragraph 2.3.1 "Consumentensurplus" failed: 1 error(s), 0 warning(s).


```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book-outline-currentness.js --require-approved --action paragraph_production --paragraph 2.3.1

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:51:58.124Z`
- finished_at: `2026-09-05T23:52:00.534Z`
- duration_ms: `2410`
- exit_code: `0`
- stdout_sha256: `17c621a2434015110c4cb7717f5a302b74ab68762f2574dbcdd25e8895ecce87`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
Book 2 outline currentness: PASS
- outline: references/authored/book-outlines/book-2-outline.md
- target pins: 12
- mode: approved-use
- paragraph scope: 2.3.1

```

### stderr excerpt

```text

```
## node build-scripts/workflows/check-book2-target-authority-remediation.js --durable

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:52:00.596Z`
- finished_at: `2026-09-05T23:52:01.384Z`
- duration_ms: `788`
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
- started_at: `2026-09-05T23:52:01.434Z`
- finished_at: `2026-09-05T23:52:01.671Z`
- duration_ms: `237`
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
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-final-check.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:54:00.545Z`
- finished_at: `2026-09-05T23:54:01.666Z`
- duration_ms: `1121`
- exit_code: `0`
- stdout_sha256: `9ef69efcb2114922feea7e276b6ba7a4aa5901ee1fe3a522dd50071118628b1f`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "status": "PASS_CANDIDATE_NOT_QC",
  "bindings": 919,
  "original_imports": 499,
  "review_imports": 186,
  "fresh_pending": 9,
  "fresh_color_pages": 99,
  "fresh_gray_pages": 33,
  "inventory": {
    "A": 9,
    "C": 12,
    "L": 8,
    "P": 12
  },
  "output": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-231-root-final-bindings.json",
  "sha256": "eeef8aa6a0f1cdc96c8e4b6ba4026dc2a8c2dbeee87253e3db5f65a5d8e6873b"
}

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-publication-scope.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:57:20.564Z`
- finished_at: `2026-09-05T23:57:22.224Z`
- duration_ms: `1660`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `06df065f0e151152e72638ad4a4ef34bd9a352f97081019502a8f798676c45a6`

### stdout excerpt

```text

```

### stderr excerpt

```text
node:assert:152
  throw new AssertionError(obj);
  ^

AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

2 !== 0

    at git (C:\wt\book2-part-a-production-20260905\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-root-publication-scope.js:6:109)
    at Object.<anonymous> (C:\wt\book2-part-a-production-20260905\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-root-publication-scope.js:16:1)
    at Module._compile (node:internal/modules/cjs/loader:1804:14)
    at Object..js (node:internal/modules/cjs/loader:1936:10)
    at Module.load (node:internal/modules/cjs/loader:1525:32)
    at Module._load (node:internal/modules/cjs/loader:1327:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
    at node:internal/main/run_main_module:33:47 {
  generatedMessage: true,
  code: 'ERR_ASSERTION',
  actual: 2,
  expected: 0,
  operator: 'strictEqual',
  diff: 'simple'
}

Node.js v24.13.1

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-publication-scope.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-05T23:59:02.754Z`
- finished_at: `2026-09-05T23:59:04.128Z`
- duration_ms: `1374`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `11e0b687f0daf8a8629e8ad6a2dcdde18ae90d408870aa565914e4334360f98f`

### stdout excerpt

```text

```

### stderr excerpt

```text
node:internal/assert/utils:77
    throw err;
    ^

AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

  a(diagnosticPaths.every(l=>l.startsWith(historicalLog+':')))

    at C:\wt\book2-part-a-production-20260905\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-root-publication-scope.js:21:318
    at Array.map (<anonymous>)
    at Object.<anonymous> (C:\wt\book2-part-a-production-20260905\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-root-publication-scope.js:21:3)
    at Module._compile (node:internal/modules/cjs/loader:1804:14)
    at Object..js (node:internal/modules/cjs/loader:1936:10)
    at Module.load (node:internal/modules/cjs/loader:1525:32)
    at Module._load (node:internal/modules/cjs/loader:1327:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5) {
  generatedMessage: true,
  code: 'ERR_ASSERTION',
  actual: false,
  expected: true,
  operator: '==',
  diff: 'simple'
}

Node.js v24.13.1

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-publication-scope.js

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T00:00:07.506Z`
- finished_at: `2026-09-06T00:00:10.599Z`
- duration_ms: `3093`
- exit_code: `0`
- stdout_sha256: `3f0f8f7e11cfbf698ea5d59e468b325a04fe1b3e3d7cc9cc574759d2d362e9cf`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{
  "status": "PASS",
  "strict_own_paths": 822,
  "checks": [
    {
      "name": "whole_root_231_platform",
      "exit_code": 0,
      "categories": {
        "partA_textbook": 0,
        "partB_companion": 0,
        "shared_platform": 9,
        "generated_indexes": 0,
        "review_evidence": 813,
        "unknown": 0
      }
    },
    {
      "name": "whole_root_231_lessons",
      "exit_code": 0,
      "categories": {
        "partA_textbook": 44,
        "partB_companion": 0,
        "shared_platform": 0,
        "generated_indexes": 0,
        "review_evidence": 0,
        "unknown": 0
      }
    },
    {
      "name": "complete_platform",
      "exit_code": 0,
      "categories": {
        "partA_textbook": 0,
        "partB_companion": 0,
        "shared_platform": 78,
        "generated_indexes": 6,
        "review_evidence": 2896,
        "unknown": 0
      }
    },
    {
      "name": "complete_lessons",
      "exit_code": 0,
      "categories": {
        "partA_textbook": 202,
        "partB_companion": 0,
        "shared_platform": 0,
        "generated_indexes": 0,
        "review_evidence": 4,
        "unknown": 0
      }
    }
  ],
  "output": "C:\\wt\\book2-part-a-production-20260905\\4veco-platform\\reports\\sprints\\BOOK2-TEXTBOOK-PRODUCTION-1-231-root-publication-scope.json"
}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-check.py baseline

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T00:19:10.564Z`
- finished_at: `2026-09-06T00:19:31.331Z`
- duration_ms: `20767`
- exit_code: `0`
- stdout_sha256: `d2f840eecbe435ef70734749d3ad060240f9429471fccd9ad708ac6af1334b2b`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
baseline: BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-baseline.json SHA256 c9b30e0e39a490708b929efaeeeb9ba9c4311888853f685b4fc25d058513ffe7

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-check.py tests

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T00:19:31.380Z`
- finished_at: `2026-09-06T00:19:32.655Z`
- duration_ms: `1275`
- exit_code: `0`
- stdout_sha256: `8759b6a61899959d0d7a9b52baa2046fda67989fb05dcdbe3298ca7635992b7f`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
tests: BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-tests.json SHA256 3742d4b48ccc8d1368af1f051b9326a29297ab5fb5d8ff532b173d7ea9974f19

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-check.py full

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T00:19:56.073Z`
- finished_at: `2026-09-06T00:20:14.393Z`
- duration_ms: `18320`
- exit_code: `0`
- stdout_sha256: `2afc5f817af2ef592b78d3e5812aab1dff3a1884138bf4db83c5576b8c72fdc7`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
full-reservation: BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-full-reservation.json SHA256 89bc47698891f67f36329da28fe170728d229b08fb1b2c08a6ce494b3d7ba0fa
full-process: BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-full-process.json SHA256 90330a8d93b8e2b672d33fcbb45296af40df0aff78628b59f3fb050d7900b717
full-parity: BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-full-parity.json SHA256 aebcd75e411c52fb30b7297f671df4c2cc7260d075f7ad446e426252177252bf

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-check.py thin

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T00:20:14.446Z`
- finished_at: `2026-09-06T00:20:32.371Z`
- duration_ms: `17925`
- exit_code: `0`
- stdout_sha256: `3e0d79f39e0f02aed90e992be4f3af7ae3740f695de1e98ec627c25b6a0dc610`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
thin-reservation: BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-thin-reservation.json SHA256 728d34506f4c7419d501b7e5f4299b6a0ca22d6db53008fc81ece2f1c6c92f0d
thin-process: BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-thin-process.json SHA256 53c295cd6b04fcbca04ee4846875eaea64a2b2b0e5d9cf9e71c427db7f52cdc7
thin-parity: BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-thin-parity.json SHA256 90840fd36988e1a5306444496051a56dee4658e3e99087295359845c40f270ef

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-check.py print

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T00:20:32.421Z`
- finished_at: `2026-09-06T00:20:46.037Z`
- duration_ms: `13616`
- exit_code: `0`
- stdout_sha256: `4882d59478142a6d60fb984c6be9c4f06a3294968b7499d3dc2a41007be1a685`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
print-reservation: BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-print-reservation.json SHA256 155e3997e0ce71374dc5e1069327043b91859c073669a083b01b766df7cd0749
print-manifest: BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-print-manifest.json SHA256 55843fedd57a16c9d52bb9fb624ef7883a129ec604f686d2420e97a1e362980a
print-parity: BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-print-parity.json SHA256 5017739de94858237143f828b006a9ec34f8c2e456218f867c3729b4806afabd

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-check.py native

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T00:20:46.088Z`
- finished_at: `2026-09-06T00:20:55.016Z`
- duration_ms: `8928`
- exit_code: `0`
- stdout_sha256: `0851a9857f7e02c12378a2d3e0bf08068c07e1425983b0cc5223256a991d2d85`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
native-process: BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-native-process.json SHA256 4e0383c4fb382f2f92e54e4c7469979481d09c568967a9fe725de7b8646253b9

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-check.py gates

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T00:20:55.061Z`
- finished_at: `2026-09-06T00:20:58.035Z`
- duration_ms: `2974`
- exit_code: `0`
- stdout_sha256: `91fb9ff900c041842355e7440fba379764a1816050703749483f7f72fb959468`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
student-web: BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-student-web.json SHA256 1feb9cb60679a66f19ae99e3474c425db54d088b27ffaee2e8523ac5bfea67be
publisher-print: BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-publisher-print.json SHA256 77a2c756146a7424d88fbc15ea1201f74da0dca8dbf7c932fd2c4bffc15f6b1a
currentness: BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-currentness.json SHA256 326816fff34c1c013b7e2ec5720c930498d92ca945974afc2ffce0526421ca47
durable: BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-durable.json SHA256 9ad0e38e08ae0dfe1286d0698e47a5d03887eb5b79eb12b2f5f5429fb0d64daf
bundle: BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-bundle.json SHA256 d40b4454df10c7662cc3850fa762d80df7807983626d1551e5e93b4a92769de5

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-check.py integrity

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T00:20:58.082Z`
- finished_at: `2026-09-06T00:20:58.864Z`
- duration_ms: `782`
- exit_code: `0`
- stdout_sha256: `c162200e96657257620fadc8dae2400926ecb6cbfa9756bd286746960407146d`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
final-integrity: BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-final-integrity.json SHA256 3ed4dab5f8fdb9fa62f3387c47341f95bec8a1e1ca536811f6002094d5a52ed1

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-scope.js f327653f7065f378581ba0f14ad1f38e3480fda6

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T00:25:11.975Z`
- finished_at: `2026-09-06T00:25:13.451Z`
- duration_ms: `1476`
- exit_code: `0`
- stdout_sha256: `8c01471d1c2d663f9f4d80af63942caed1766d476f06013d6717a113cded226f`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{"pass":true,"head":"f327653f7065f378581ba0f14ad1f38e3480fda6","owned_paths":430,"native_scopes":[{"label":"incremental-platform","ok":true},{"label":"complete-platform","ok":true},{"label":"complete-lessons","ok":true}],"whitespace":{"default_exit":0,"scoped_cr_at_eol_exit":0}}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-root-check.py baseline

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T00:32:50.412Z`
- finished_at: `2026-09-06T00:33:15.563Z`
- duration_ms: `25151`
- exit_code: `0`
- stdout_sha256: `718871058643c05c3fb4a2213c3a48bfa9ddd092638c85473a10fae790e1bff7`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
baseline.json: SHA256 e8512d282cef9fb0432af71edda46c8334bb21eb050cc9a2516acc9d32dabb28

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-root-check.py tests

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T00:33:15.615Z`
- finished_at: `2026-09-06T00:33:18.262Z`
- duration_ms: `2647`
- exit_code: `0`
- stdout_sha256: `f87bb4397c51897be52ff93d8003b07f734810a24a26faf5256f0552737f579f`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
tests.json: SHA256 27b8026847affdaa6dcd7e6bf2f631d42126f2129a6e9715f078fba05a95d226

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-root-check.py full

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T00:33:40.419Z`
- finished_at: `2026-09-06T00:34:15.252Z`
- duration_ms: `34833`
- exit_code: `0`
- stdout_sha256: `cb15dd6292c4dbcebd01edf8f55aa53d5401b283716e8e4baae7136ef4422ba9`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
full-reservation.json: SHA256 22a8b89fdde3e65c3021393dcd9a4fc46ec5063cd8e4930ecc3244a375bbd51b
full-process.json: SHA256 c1f0c0e61afacc4952b70b9a89dd7e4a84330d9388a8a42c23150f354ad37605
full-parity.json: SHA256 19fd44793e70a7e07056795d388fdbb98966c406405a0ac70f10d360d6711357

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-root-check.py thin

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T00:34:15.313Z`
- finished_at: `2026-09-06T00:34:44.099Z`
- duration_ms: `28786`
- exit_code: `0`
- stdout_sha256: `7ff9b6da4671119fe9bf3ad2584d89becb5bbd02baeff49b13346198acce701d`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
thin-reservation.json: SHA256 e1ee81be183fc8f2dd5a33f638970f81a555323078d8a55dad9e1b0fa02ba53f
thin-process.json: SHA256 fc07e51add6c52be758542e208688eac18d24185184c1c5552a0feedc76f94b6
thin-parity.json: SHA256 263c6a2282876de6fdd359f87e6a5020930fbcf4d4f371969a3d88538bd60822

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-root-check.py print

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T00:34:44.180Z`
- finished_at: `2026-09-06T00:35:06.840Z`
- duration_ms: `22660`
- exit_code: `0`
- stdout_sha256: `fef3d64c56d385449058194b52e7a77d513a7588a6d181fb0e5bea789c49d815`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
print-reservation.json: SHA256 5c13dc383cc04df930f930960af324b8a9819b51e08c38b2b7accc4d56bd50a1
print-process.json: SHA256 e56745956c62409d5b95dfeef1fabd77bdab3d026a07b69bcaa1c82b4b03211f
print-parity.json: SHA256 2c9dbac1a9593bb24fc1073c16136c95cef7e21b8421ad16aca180cad4b771dc

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-root-check.py gates

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T00:35:06.890Z`
- finished_at: `2026-09-06T00:35:12.265Z`
- duration_ms: `5375`
- exit_code: `0`
- stdout_sha256: `dde045de897a1b00f55afeecfa8e258ad5b4a528fa7b571ac4c1f60e4b4977b2`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
native-process.json: SHA256 cd3cf0b7b6f435ac504afc00bd92ffff028944004c641f52ee4281bf9aa9e970
student-web.json: SHA256 515abdf34b7fc5b49e6db454c2c4b3999e5a4acc95eae885a1e7d34ee0137839
publisher-print.json: SHA256 8abeb6cdbb1690ae7f8fb3807c1ec6059902d41826f57538351b68b902a6da83
currentness.json: SHA256 40978cefdbb2ed834be9f82d76c03dc4630b148a35b6fd8fd3ce46e66e9ac346
durable.json: SHA256 827e8c32bc9aacc516736a03f6a5acd714ecfe685c6e9ba63700b057ca7fcf30
bundle.json: SHA256 c87324eee043112fca2650622a8b6a13e94a98b2431963a870c30cbfc43e5483

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-root-check.py integrity

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T00:35:12.310Z`
- finished_at: `2026-09-06T00:35:13.010Z`
- duration_ms: `700`
- exit_code: `0`
- stdout_sha256: `d4017f2eaaf357f142db8155bfb7f2c7399da0344dac98bc3aeefa65b354b49e`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
final-integrity.json: SHA256 bca1c73c571f835a889e78239fc6eef030e8c4a9ac86f081056c75b747e3e1f4

```

### stderr excerpt

```text

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-root-scope.js 62e19b6ec0782d2bda8025102a4ca66dca136d41

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T00:39:25.515Z`
- finished_at: `2026-09-06T00:39:26.901Z`
- duration_ms: `1386`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `9bf4354e299d4f6a5c8b1c2474a9e5f0e81aa6638f5800c53372abe9f4ad73eb`

### stdout excerpt

```text

```

### stderr excerpt

```text
node:assert:152
  throw new AssertionError(obj);
  ^

AssertionError [ERR_ASSERTION]: Any non-CR whitespace must be separately investigated

2 !== 0

    at Object.<anonymous> (C:\wt\book2-part-a-production-20260905\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-root-scope.js:41:8)
    at Module._compile (node:internal/modules/cjs/loader:1804:14)
    at Object..js (node:internal/modules/cjs/loader:1936:10)
    at Module.load (node:internal/modules/cjs/loader:1525:32)
    at Module._load (node:internal/modules/cjs/loader:1327:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5)
    at node:internal/main/run_main_module:33:47 {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: 2,
  expected: 0,
  operator: 'strictEqual',
  diff: 'simple'
}

Node.js v24.13.1

```
## node reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-root-scope.js 62e19b6ec0782d2bda8025102a4ca66dca136d41

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T00:50:35.328Z`
- finished_at: `2026-09-06T00:50:37.474Z`
- duration_ms: `2146`
- exit_code: `0`
- stdout_sha256: `d1435674c1b5a78ec3bb496680e87079d3da5efecd670a333647ce1925b741fd`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{"pass":true,"head":"62e19b6ec0782d2bda8025102a4ca66dca136d41","owned_paths":439,"scopes":[{"label":"incremental-platform","counts":{"partA_textbook":0,"partB_companion":0,"shared_platform":3,"generated_indexes":0,"review_evidence":436,"unknown":0}},{"label":"complete-platform","counts":{"partA_textbook":0,"partB_companion":0,"shared_platform":80,"generated_indexes":6,"review_evidence":3759,"unknown":0}},{"label":"complete-lessons","counts":{"partA_textbook":202,"partB_companion":0,"shared_platform":0,"generated_indexes":0,"review_evidence":4,"unknown":0}}],"whitespace":{"default_exit":2,"scoped_cr_at_eol_exit":2,"default_diagnostics_preserved":true,"historicalWhitespacePaths":["reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-REVIEW-command-log.md","reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md"],"historicalBinding":{"path":"reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-command-log.md","commit":"04969d33875ab2265b5101647e3584985ae91b87","git_blob":"83ca631a13ffea2ced1a6b1adf35f8a9dcc3d866","sha256":"0b96e1b92b9e5e8f0913efa57487373723247f4363ac52b97e80bb73b30f04b1"},"all_other_paths_exit":0,"note":"Whole-diff whitespace FAIL remains; source and all nonhistorical paths PASS. Initial root zero-exit assumption failed before evidence write; actual imported log line519 is a retained prior diagnostic with a final space, exact original Git bytes. No global setting or native scope waiver."},"inventory":{"A":9,"C":12,"L":8,"P":12}}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-qc-check.py baseline 32cee7977e90da3aa77ce107e0e6e003eb9be370

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T01:00:42.518Z`
- finished_at: `2026-09-06T01:00:56.084Z`
- duration_ms: `13566`
- exit_code: `1`
- stdout_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- stderr_sha256: `f570e90b05f2b280dc15de35ecc99391445571c735ee1de164458f635214b046`

### stdout excerpt

```text

```

### stderr excerpt

```text
Traceback (most recent call last):
  File "C:\wt\book2-part-a-production-20260905\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-root-qc-check.py", line 172, in <module>
    if mode=='baseline': baseline(sys.argv[2])
                         ~~~~~~~~^^^^^^^^^^^^^
  File "C:\wt\book2-part-a-production-20260905\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-root-qc-check.py", line 123, in baseline
    result=bindings(); folder=folder_snapshot(); assert len(folder)==46
  File "C:\wt\book2-part-a-production-20260905\4veco-platform\reports\sprints\BOOK2-TEXTBOOK-PRODUCTION-1-231-root-qc-check.py", line 58, in bindings
    for r,h in source['old_sources_and_history'].items(): assert raw(P/r)==h,r
                                                                 ^^^^^^^^^^^
AssertionError: reports/github-agent-index-lessen.json

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-qc-check.py differences

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T01:01:57.712Z`
- finished_at: `2026-09-06T01:02:46.308Z`
- duration_ms: `48596`
- exit_code: `0`
- stdout_sha256: `38c077153eac343ee00baa11f1ffbfc887afb7a72e4bf2ed0edc0d4f28142f5d`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
[
  {
    "path": "reports/github-agent-index-lessen.json",
    "specialist_baseline_sha256": "82bfbb2e019dba092cccd9d3f91aa899cb91afdd9e9805e812145234ec0253cb",
    "current_raw_sha256": "47bbcaa84e8c297eca9163fd6a86d7794ecacc987c3caf8265690d7d3a704b4c",
    "root_published_f257_sha256": "47bbcaa84e8c297eca9163fd6a86d7794ecacc987c3caf8265690d7d3a704b4c",
    "source_baseline_35e0_sha256": "82bfbb2e019dba092cccd9d3f91aa899cb91afdd9e9805e812145234ec0253cb"
  },
  {
    "path": "reports/github-agent-index-lessen.md",
    "specialist_baseline_sha256": "61722a6a93c6ea6500fadb9dfcbbc4427c35cd56c968e65b05bcfc780031f205",
    "current_raw_sha256": "a414ceedaa50c4e8275f175b66774d301b169f1c635026af5cb1309bf64ae2b3",
    "root_published_f257_sha256": "a414ceedaa50c4e8275f175b66774d301b169f1c635026af5cb1309bf64ae2b3",
    "source_baseline_35e0_sha256": "61722a6a93c6ea6500fadb9dfcbbc4427c35cd56c968e65b05bcfc780031f205"
  },
  {
    "path": "reports/github-agent-index-platform.json",
    "specialist_baseline_sha256": "5c959f4dfdb5beb071d39892cd36e71e06995377c7c5353dc68b4b5b2d55171e",
    "current_raw_sha256": "9f537cc132c01ff2b38fb92ab9a465f445903940c2ca3acca82e89840765f1ee",
    "root_published_f257_sha256": "9f537cc132c01ff2b38fb92ab9a465f445903940c2ca3acca82e89840765f1ee",
    "source_baseline_35e0_sha256": "5c959f4dfdb5beb071d39892cd36e71e06995377c7c5353dc68b4b5b2d55171e"
  },
  {
    "path": "reports/github-agent-index-platform.md",
    "specialist_baseline_sha256": "41f5539b905be12510deab8e7e8f184c373f921f57a994e5d0e804edc42d835e",
    "current_raw_sha256": "8e9416133ce5073cd1b07659a802aca45487da4709f7261ae85554a9d1ca9ed7",
    "root_published_f257_sha256": "8e9416133ce5073cd1b07659a802aca45487da4709f7261ae85554a9d1ca9ed7",
    "source_baseline_35e0_sha256": "41f5539b905be12510deab8e7e8f184c373f921f57a994e5d0e804edc42d835e"
  },
  {
    "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.jsonl",
    "specialist_baseline_sha256": "ff73e24c59d4a8a4dfa3dc25cf2fc674ca945f1e7a7a7ba32eaedc52e21c443e",
    "current_raw_sha256": "b9098f1301bf672b6c9705a5758c5dbb12808a5c88f31dafbe9fdee4e9776a01",
    "root_published_f257_sha256": "cc853295d882b0752337dbb777d5930f425dd03ec502dfcaf9617d2e9b60f62c",
    "source_baseline_35e0_sha256": "ff73e24c59d4a8a4dfa3dc25cf2fc674ca945f1e7a7a7ba32eaedc52e21c443e"
  },
  {
    "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.md",
    "specialist_baseline_sha256": "844e6423f7c85b6f4e26ede6dd78b71bbcfc4db151e8af844d62c6e54af271cf",
    "current_raw_sha256": "e376ed592d879798cad024331e09f67c16778364b04114382ce376a93681f56f",
    "root_published_f257_sha256": "1af65bc266e3083f23d787c59ca68e9b598f21381f334e8ef6d808e826d3e383",
    "source_baseline_35e0_sha256": "844e6423f7c85b6f4e26ede6dd78b71bbcfc4db151e8af844d62c6e54af271cf"
  },
  {
    "path": "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-output-manifest.md",
    "specialist_baseline_sha256": "6a6191f0ed24e3e9363b30a44590acb9365e0b0c8d1d3bb97e20f49f3026c4e2",
    "current_raw_sha256": "c61bfeec8d898e382c729f3791b9cd71f76e81a45f902ae0b6be9b3c4c707b5e",
    "root_published_f257_sha256": "c61bfeec8d898e382c729f3791b9cd71f76e81a45f902ae0b6be9b3c4c707b5e",
    "source_baseline_35e0_sha256": "6a6191f0ed24e3e9363b30a44590acb9365e0b0c8d1d3bb97e20f49f3026c4e2"
  }
]

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-qc-check.py baseline 32cee7977e90da3aa77ce107e0e6e003eb9be370

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T01:04:49.421Z`
- finished_at: `2026-09-06T01:05:32.566Z`
- duration_ms: `43145`
- exit_code: `0`
- stdout_sha256: `332485d67b659a13bb8a9a56a427acfd8cb96f647520b1b272159a42187499c6`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{"PASS": true, "imports": 209, "old_lesson_files": 45, "old_sources_history_unchanged": 7845, "root_coordination_exact_published_successors": 7, "personal_images": 96, "native_packet": 42, "original_mapping": 66, "old_pending": 45, "reserved": ["r20", "r21", "r22"]}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-qc-check.py tests

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T01:05:52.302Z`
- finished_at: `2026-09-06T01:05:53.806Z`
- duration_ms: `1504`
- exit_code: `0`
- stdout_sha256: `b5bf2dc9130ed64195a92e033fced854281e368c3b25052fb22e3cd3500c583f`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{"command": "tests-process", "exit_code": 0}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-qc-check.py full

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T01:05:53.854Z`
- finished_at: `2026-09-06T01:06:16.636Z`
- duration_ms: `22782`
- exit_code: `0`
- stdout_sha256: `f281e111787c0f58511de94efc7405c882b49b443bbfec28efe10dbd1c5e7687`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{"command": "full-process", "exit_code": 0}
{"status": "PASS", "revisions": [20], "pages": 33, "folder": 46, "native": 42}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-qc-check.py verify

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T01:07:06.723Z`
- finished_at: `2026-09-06T01:08:04.947Z`
- duration_ms: `58224`
- exit_code: `0`
- stdout_sha256: `ac2aa43fa2cbebdaba40b6e2aef16556966dbd598a74221ff5f7f1ee8ea42c22`
- stderr_sha256: `571b008347b990394107ccfc01858edb98aa18f2d018303a08063d35cdcd1a9a`

### stdout excerpt

```text
{"command": "native-check-process", "exit_code": 0}
{"command": "reproduction-process", "exit_code": 0}
{"status": "PASS", "revisions": [20, 21, 22], "pages": 99, "folder": 46, "native": 42}

```

### stderr excerpt

```text
Exception in thread Thread-1 (_readerthread):
Traceback (most recent call last):
  File "C:\Python314\Lib\threading.py", line 1082, in _bootstrap_inner
    self._context.run(self.run)
    ~~~~~~~~~~~~~~~~~^^^^^^^^^^
  File "C:\Python314\Lib\threading.py", line 1024, in run
    self._target(*self._args, **self._kwargs)
    ~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Python314\Lib\subprocess.py", line 1613, in _readerthread
    buffer.append(fh.read())
                  ~~~~~~~^^
  File "<frozen codecs>", line 325, in decode
UnicodeDecodeError: 'utf-8' codec can't decode byte 0x80 in position 5858: invalid start byte

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-qc-check.py gates

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T01:08:05.006Z`
- finished_at: `2026-09-06T01:08:08.454Z`
- duration_ms: `3448`
- exit_code: `0`
- stdout_sha256: `cdaf90c6d05f122ce880a7ba4f1d99e09f5f89de1ee6db01318ab09e28ca8ea7`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{"command": "student-web-process", "exit_code": 0}
{"command": "publisher-print-process", "exit_code": 0}
{"command": "currentness-process", "exit_code": 0}
{"command": "durable-process", "exit_code": 0}
{"command": "bundle-process", "exit_code": 0}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-qc-check.py integrity

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T01:08:08.504Z`
- finished_at: `2026-09-06T01:08:17.453Z`
- duration_ms: `8949`
- exit_code: `0`
- stdout_sha256: `032bb8204a035398d6c952e4422610bb64e9f03209ca0efc9983225c0732c38a`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{"status": "PASS", "revisions": [20, 21, 22], "pages": 99, "folder": 46, "native": 42}

```

### stderr excerpt

```text

```
## C:/Python314/python.exe reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-qc-check.py gates-v2

- cwd: `C:\wt\book2-part-a-production-20260905\4veco-platform`
- started_at: `2026-09-06T01:10:00.959Z`
- finished_at: `2026-09-06T01:10:03.803Z`
- duration_ms: `2844`
- exit_code: `0`
- stdout_sha256: `8126482279a1ffc1204ff334e5061b4122e551c26c8c406d5707ee5b3a642b70`
- stderr_sha256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

### stdout excerpt

```text
{"command": "student-web-v2-process", "exit_code": 0, "stdout_bytes": 1191, "stderr_bytes": 0}
{"command": "publisher-print-v2-process", "exit_code": 0, "stdout_bytes": 1014, "stderr_bytes": 0}
{"command": "currentness-v2-process", "exit_code": 0, "stdout_bytes": 160, "stderr_bytes": 0}
{"command": "durable-v2-process", "exit_code": 0, "stdout_bytes": 257, "stderr_bytes": 0}
{"command": "bundle-v2-process", "exit_code": 0, "stdout_bytes": 61, "stderr_bytes": 0}

```

### stderr excerpt

```text

```
