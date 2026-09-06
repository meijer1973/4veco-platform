# §2.1.4 R2 plan-only payload and publication contract

Task `BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN`; actor `paragraph_214_builder`;
original plan-author role only. Root sole integrator. Owned branch in both
repositories: `agent/book2-214-production-20260906`.

## Exact committed payload

- Pre-edit operational plan P `8117b1a395bf772a38321367e0a8c11edeb7898f`.
- Author evidence payload P `180b19bf577da25138233d270ca72c9e0b01eb84`.
- Canonical R2 plan payload L `180b02b915343f2f02d594b9e674a77eefa9aa39`.
- Original published pair P `aee047221564fad762df59754a849d3f08ce069b` /
  L `bbc4adf5af47187d5e394efd8079f906e9914023`.

Plan:621 lines,17 bounded changed lines, raw/LF SHA-256
`a6f71553e887acdf7b94be5d411303660b9fad2ef8745cb25986636aa49b4cc4`.
R2 evidence raw SHA-256
`16785369683bec0c48efa3b333e2fe87a0e91f0550a62b84db7c8125ad762264`.
R2 actual scope raw SHA-256
`5160b2db578eda6f5cc5fea86a28703ac80ee5ab93aef077b728905bcc5b7442`.

## Actual committed scope checks

`BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-R2-scope.js` compared actual commits,
not a simulated list or a fabricated source anchor. Its complete parsed native
results and argv are preserved in the matching scope JSON.

| Comparison | Result |
|---|---|
| Own P from aee047… to180b19… | Strict own six R2 evidence/operational files PASS; native shared-lane FAIL retained,0UNKNOWN |
| Genuine complete P from6eb34debb2210a2a4fa6718a13eaeefcacedc8f8 to180b19… | Native shared-lane PASS,0UNKNOWN |
| Own L frombbc4ad… to180b02… | Exact one canonical plan path; native textbook lane PASS,0UNKNOWN |
| Genuine complete L fromf09fd6e88edc5049b026b16b0158e7e188091d2d to180b02… | Native textbook lane PASS,0UNKNOWN |

The own incremental platform FAIL is real: an evidence-only delta lacks a
shared-platform source change, and the native guard permits evidence only
beside lane-owned changes. No waiver, dummy source file or false PASS was
introduced. Genuine complete source-bearing candidates pass separately.

`emit-url-index.js` ran with the normal main-ref default and produced no
tracked change. A fresh normal fetch/prune in both repositories completed;
platform governance freshness PASS at origin/main
`96416b6b5bd57094576e9aba0a42d682584ec479`, no governance differences.
The lesson branch at this point is clean and one local commit ahead, not yet
claimed remotely published by this pre-tail document.

## Terminal publication procedure

This commit adds only R2 `scope.js`, `scope.json`, `publication.md`. The only
following file mutations are the normal four paired indexes:

- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-platform.md`
- `reports/github-agent-index-lessen.json`
- `reports/github-agent-index-lessen.md`

Generation/check uses the actual paired lesson root, lesson source ref
`180b02b915343f2f02d594b9e674a77eefa9aa39`, platform source ref HEAD at this
scope commit, and explicit source branch `agent/book2-214-production-20260906`
for both repositories. Commit only these four generated files as terminal
index tail. Run ownership/clean-tree checks for the existing actor/task, normal
pushes of both explicit branch refs, and verify exact remote heads/zero
divergence/clean pair before final handoff. Actual final terminal and scope
SHAs, push results and remote equivalence are reported after execution; this
file does not predict their hashes or claim unfinished publication succeeded.

## Review-only handoff

All118 retained author checks and41 R2 checks pass. All1,854 other lesson files
are raw-byte unchanged. Frozen target, all source/goals/models,54/60/72-minute
UNOBSERVED timing, chapter coverage and prerequisite pins remain unchanged.
F1/F2/A1 are corrected for distinct independent recheck by
`paragraph_224_builder`; this document cannot approve its own plan.

No pupil production, generator, artifacts, registry, legacy material, canonical
review, QC, handoff, root acceptance, PR or merge. Actual font/ink/gray/page
proof is NOT_RUN, and production release remains PENDING independent plan PASS,
actually accepted current §2.1.2/§2.1.3 successors and explicit root release.
