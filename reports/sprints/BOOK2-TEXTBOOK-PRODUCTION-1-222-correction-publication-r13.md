# §2.2.2 R13 correction publication evidence

2026-09-05. Actor paragraph_222_correction_builder, task
BOOK2-TEXTBOOK-PRODUCTION-1-222-CORRECTION. No independent acceptance.

The bounded source, regressions and builder proofs are platform payload
`06558852fb640f99e9df2d4fa4b70e2e91b9e60f`, based on
`ca05ec784838617f7a11c0b33d0b53e1a2fb7f29`. Its paired generated lesson payload is
`0fa09fb112b7e9d661a904dbf6d54b5e9ac7fbbc`, based on
`6362d2596b20c3e28184d8b6a1a74cb6c901d7f0`. Both branches are
`agent/book2-222-correction-20260905` in the dedicated same-named paired
worktree parent; both task claims match the actor and task.

At those exact payload commits the unchanged lane classifier passed:

- platform shared: three source/test files and 43 builder-evidence files;
- lessons textbook: seven generated MD/HTML/PDF files, only under §2.2.2.

Fresh post-payload approved-use §2.2.2 currentness and durable target-authority
checks passed. The actual command outputs are appended to the correction log.
Both repositories were fetched/pruned before committing; no other worktree,
branch, target, plan, review, QC or protected-reference edits were made.

The first staged whitespace check correctly stopped the platform commit because
the human-readable command-log excerpts contained Python CRLF line endings.
Only that Markdown log was mechanically normalized to LF and trailing spaces
removed. No command, exit status, failed result or JSONL raw-output hash was
removed or changed. The repeated staged diff check then passed and the payload
commit succeeded. This formatting repair does not alter the generation proofs.

The new regression run against R12 failed exactly the two reviewed defects and
remains in the log. The two ordinary final profiles still fail only for the
unchanged canonical review FAIL. All fourteen corrected source tests, twenty
shared print tests and 173 scoped workflow tests passed; exact rebuild and
21-page/full-figure/grayscale builder inspection are documented in the packet.

This record and the appended post-payload command evidence form an evidence-only
descendant of the payload. Deterministic GitHub indexes/URL index are refreshed
afterward as a separate generated-index tail, with the exact paired lesson
source ref. No dashboard refresh is required: no roadmap/dashboard source was
changed. Final clean-claim, index-freshness, scope and exact remote-head checks
are performed after that tail and returned to root.

Root should import source/output and builder evidence, not another task's
generated index tail; then assign distinct paragraph rereview and specialist QC.
Root owns accepted §221 successor linkage, current handoff and later integration.
No future PR merge, CI waiver, human-review readiness, observed timing or
whole-book completion is claimed by this publication.

## Publication diagnostic retained

The first index tail was `e85c7e1a139985c5f986619b90e556d1cdf5a290` and both
branches were pushed successfully. A post-tail freshness diagnostic was invoked
in a new shell without the paired lesson environment; it correctly failed by
comparing the candidate lesson commit against the default origin/main
`f09fd6e88edc5049b026b16b0158e7e188091d2d` and branch `origin/main`. This was a
caller configuration error, not an index-content or target defect. No index
checker or repository configuration was patched to conceal it.

The retry explicitly supplied FOURVECO_LESSEN_ROOT to this claimed pair,
FOURVECO_LESSEN_SOURCE_REF=HEAD and
FOURVECO_LESSEN_SOURCE_BRANCH=agent/book2-222-correction-20260905; it passed for
both exact candidate commits. The platform checker normally recognized its
generated-only parent tail. The retry is retained in the append-only command
log, and both remote refs matched the pushed heads. This added diagnostic record
is followed by a new deterministic index-only tail so final index source pins
cover the complete publication evidence. Root should skip both index-only tails
when adopting the bounded correction evidence into its own pair.
