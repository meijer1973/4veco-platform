# §212 S1 — two accepted-input pins reproduced without pupil changes

2026-09-06; builder paragraph_212_successor_builder. This is implementation and
reproduction evidence, not paragraph review, specialist QC, root acceptance,
classroom validation, owner approval or a merge-readiness decision.

## Exact subject and authorization

Own separately claimed pair is
C:/wt/book2-212-succession-20260906/{4veco-platform,4veco-lessen}, both on
agent/book2-212-succession-20260906. Starting published platform is
572d1ea2ededaffd28afc44eeeca223252a58ec5; lessons is
d4e1910d60964ee4b9ac97eefbf0e0ed202fc28f. The lesson branch stays at that exact
commit; no lesson commit is required or created. The operational plan was
committed before source edits as97e1e51be8d2e5cf6aec8c403693eb6b166dc709.

The complete212-successor-work-order.md, S1 binding plan and independent R2,
current211 review/QC/root acceptance/handoff and current212 review/source/tests
were read. Accepted211 predecessor5e14325d70b6cc6aee643d9b57395c92b0904ffb is
carried unchanged in the lesson baseline. The work order permits exactly these
two full assignments in build-scripts/content/book-2/b2_212.py:

| Assignment | Old canonical-LF hash | Exact accepted successor |
|---|---|---|
|PRIOR_REVIEW_HASH|92b4a9462caf8316274fb58f8beef5c850147c44e6bf80b9a28fad442d9dbe96|a75755c7c2e6cdffb2defcbb5403814cf854d87bfae9a8172dd768aadb5b8023|
|PRIOR_QUALITY_HASH|0dddb6e9d8f3a8da0e0f31e67dafabf53b99feb6ad86ce72039480dd7e12ea18|c85c44a53d46af87ad61500b83b0fd721fac43c97ffd1be3d512308158a4b9f5|

Each old complete assignment occurs exactly once and is replaced once. No third
handoff input, hash allowlist, guard bypass or unrelated generator edit exists.
The complete final generator equals starting572d1ea2 plus exactly those swaps;
independently it equals798cacfeeb40e4e0ba54d26f2b040cbdeec327a9 plus the already
approved five-title transform and the same two swaps.

## Original contracts and new regressions

Only test_metadata.py::test_unchanged_generator_outside_title_loop gains the
eight-line fixed-literal expectation and once-each assertions after its existing
title transform. All other complete metadata methods and full-file bytes outside
that insertion remain unchanged. Full test_source.py and its ten tests, full
test_bonus.py and its three tests, all four pupil source files, nine alts,
eleven complete captions, eleven SVG/PNG pairs and bonus criteria are preserved.

The separate test_succession.py adds seven tests. Final discover runs25 tests
successfully:18 original tests plus7 new. The new tests compare the full
generator against both immutable bases and compare the entire metadata file
against its fixed eight-line insertion, in addition to unchanged method ASTs.
They exercise the actual existing whole-source/generator guards, rejecting old,
partial, unknown and unrelated fixtures. Each missing/wrong incoming review/QC
input is rejected before subprocess, mkdir, text/byte write or document build;
isolated mocks leave real211 records untouched. Valid actual inputs reach only
the first governance subprocess sentinel. Expectations are never read from the
candidate to determine an allowed hash or allowed source change.

## Native reproduction and immutable evidence

All evidence below uses the own prefix
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-evidence/.
Explicit C:/Python314/python.exe and inherited PATH were used, captured in each
reservation. Full, thin and direct-print native processes run in isolation.
The thin entrypoint is the unchanged lesson build_pdf.py. Print-only uses the
unchanged print_pipeline entrypoints on the already generated Markdown.

| Mode | Globally next-unused proof suffix | Native and archive result | Page result |
|---|---|---|---|
|Full native CLI|r10|34/34 raw identical; ZIP19/11/9|14/7/6 pages;27/27 PNG bytes and pixels identical|
|Thin lesson CLI|r11|34/34 raw identical; ZIP19/11/9|14/7/6 pages;27/27 PNG bytes and pixels identical|
|Direct print-only|r12|34/34 raw identical; ZIP19/11/9|14/7/6 pages;27/27 PNG bytes and pixels identical|

Every ZIP has unique member names, passing CRC checks, unchanged member order,
timestamps, CRCs and SHA256 values, and members equal current same-edition files.
The34 files are12 edition MD/HTML/PDF/ZIP and22 native assets. Nothing was restored
manually after generation; the lesson worktree remained clean after every mode.

The fixed page comparison source is the inherited PBASE path
reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-R7-REVIEW-evidence/
with212-paragraaf-e94d42f66ab9-r9,212-opgaven-94ebe5d35207-r9 and
212-antwoorden-d55f1da66723-r9. New valid proofs are exclusively under the own
evidence/proofs prefix. Every build and generation manifest remains immutable
PENDING; visual notes here do not rewrite those manifests or confer acceptance.

| Evidence file | Raw SHA256 |
|---|---|
|baseline.json|d892edad0651b8fc1bc3c35e32e8455504d5da43f3a3258cf40d00c46351fbb5|
|inherited-proof-supplement.json|d133a3d507fcb4141cbd26de7c31593696043109fc5682986a457896ccde6770|
|full-r10-reproduction.json|03d63ca95c58b988e40c0f491db18751765cc6c915012116f7e64dd5ef7a8cd7|
|thin-r11-reproduction.json|eddd52d3c510cfb67d5be1c8cf9e1ac83a1cd79235d50cfcbbeb8774fe1240c0|
|print-r12-reproduction.json|6b7f959ac58322ab8d7b6604dfbe53d761c75516dab3f7100054957df8b81dec|
|pre-payload-audit-tests.json|504e1a281ac0c04d138104552e92cb4b51c2756df2881af307c9911bc108edc4|
|validation-native-checker.json|d00fef646dc0a433ecd78f21d31a9e51fa47520c4501445130ea50d5da7a1193|

Complete argv/cwd/time/exit/stdout/stderr and output hashes are preserved in the
separate command JSONs and own command-log.md/jsonl. No umbrella logs are edited.

### Retained diagnostic, not a successful reserved reproduction

The first native full command exited0 with identical native bytes, but my own
comparison helper failed on the wrong r9 path. Its initial suffix scan omitted
nested reviewer proof roots and selected a locally absent standard r7 although
r7 already existed elsewhere. This attempt is not a valid globally reserved
success. Its attempt-r7.json, full-r7-command.json, full-r7-build.json, complete
comparer failure in the command log and all three original standard-root r7
PENDING proof directories are retained unaltered. No original path was moved.

Only the own helper was corrected: it now scans every reports subtree across
registered worktrees, including nested reviewer proofs and reservations/attempts,
and uses the original r9 paths explicitly. The original baseline was not
rewritten. The separate supplement binds171 inherited212 proof files directly
to PBASE Git blobs and current raw hashes, including the formerly omitted roots.
Old proofs, current metadata and pupil source were never changed by this fix.

## Builder-only visual check and automated gates

I displayed every full-r10 page individually: paragraaf1–14, opgaven1–7 and
antwoorden1–6, then all11 current native PNGs (fig1–4, we1, ex1–6). Labels,
tables, captions, target questions and answer criteria are legible; no clipping,
overlap, missing figure or new page-break defect was observed. The theory's
same-scale progression, vertical profit distances, reduced-support TK-only
exercise and the paired150/300 bonus scales remain visible. Whitespace on the
standalone target page is retained. Complete page/hash paths are in the r10
reproduction file. No fresh grayscale review is claimed here.

The actual unchanged native checker passes exact target/goals/2-2-3-4 points,
all question IDs1–9, paired exercise HTML, page bounds and ZIP member checks.
Minimum body/footer text is12pt and placed figure text12.548030598958333pt.
Both Part A student-web and publisher-print profiles pass, as do approved212
production currentness, durable authority and active umbrella bundle. The latter
is planned/active, not complete. Profile schema success is not current QC.

Current212 review79429b9f1750710baae46751a5792e4a02e7c177888a01f5ca3a15c4039a78f7
is unchanged. QC e168e3c2b8698d12b699fbf60e7691fbbc8a15d61bd46a7988704d3c896c805c
and historical handoff de2b8ed7dcc7a3c5c6eaac400892d2d37ac5212ccb3b9972fb004115a88c1fe2
remain unchanged and are not made current by this builder. Plans, target registry,
outline authority and all unrelated paragraph/review artifacts remain unchanged.

## Publication sequence and next gate

Publish this source/evidence payload, run actual committed whole-candidate shared
scope and strict own-delta checks, commit that scope evidence, then regenerate
only maps/indexes using the explicit own lesson branch and HEAD atd4e1910.
The successor scope/publication record will bind the exact payload/scope/index
SHAs. Both branches receive normal pushes followed by clean remote-head equality.

Pre-finalization fetches succeeded; platform origin/main is
96416b6b5bd57094576e9aba0a42d682584ec479 and lesson origin/main is
f09fd6e88edc5049b026b16b0158e7e188091d2d. Current governance was not changed.
No commit-specific hosted platform-ci run or CI waiver is claimed: this bounded
branch has no PR and is an internal builder checkpoint, not a merge-ready packet.
Root owns combined integration and its CI gate; this report does not waive it.

Next: non-author integration-delta review of the published pair, then a distinct
current specialist QC pass and root acceptance. Classroom54/67/77 remains
unobserved; recap/range improvement is deferred, not silently implemented.
Part B, whole-book completion and future PR merges are not authorized here.
