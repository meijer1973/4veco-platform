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
