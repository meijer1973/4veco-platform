# Books 3/4 v3 integration result

Follow-up: the [review corrections and finite transport bridge](BOOK34-V3-REVIEW-FOLLOWUP-20260917.md) supersede this initial merge-order discussion. Original package and rendering evidence below remains valid.

Status: prepared in paired PRs; no merge, deployment or publication. Bundle: `BOOK34-V3-INTEGRATION-20260917`.

The repaired supplied edition is imported at lesson `edities/books34-v3/`: all 814 files, searchable sources, 31 paragraph PDFs, chapter output and six complete volumes. No delivered byte is changed. Existing v2 editions/manifests and Books 1–2 are preserved. Book-root READMEs select v3 for this proposed integration and retain explicit historical v2 links.

The active platform outlines, adoption metadata, v5 registry/anchors, v6 Year 1 metadata and lesson blueprint now agree on `book34-lesson-balance-v3-20260915`: Book 3 6+4+4, Book 4 5+7+5, Year 1 total 55. Limited differentiation and profit choice are separate lessons; long-run competition moves to 4.1.1; the former cao/vakbonden lesson is deferred. Exactly 24 Book 1/2 target records remain semantically identical. All 31 Book 3/4 targets are populated candidates requiring independent review.

The [bounded change review](../reference-planning/BLUEPRINT-CHANGE-REVIEW-BOOK34-V3-20260917.md) records scope and authority. [Pinned migration evidence](../../references/authored/book-outlines/books34-v3-integration.json) records the actual input bases and delivery hashes. Snapshots preserve the previous registry, outlines, adoption records and blueprint bytes with exact commits. The version-qualified snapshot manifest records each original path, exact commit and raw SHA256. The legacy relocation registry remains unchanged, so trusted-main readers never confuse a new snapshot with a move or redirect current reads.

Platform canonical outlines only rebase their 31 target-record hyperlinks to the actual lesson repository. Original outline bytes remain in the delivery and their hashes remain distinct from current projected outline hashes. No teaching text was revised.

## Verification

- Received manifest: 813 listed files, zero failures; the original manifest itself is the 814th file and is separately pinned. The repaired ZIP's hash is recorded separately from the older ZIP identity inside its provenance.
- Current v3 paired acceptance passes, including tracked package bytes, source/figure paths and hashes, exact migration output, all 24 preserved records, canonical blueprint references/anchors, immutable Books 1–2 and original v2 delivery.
- Historical v2 checker `--require-paired --require-tracked` passes in separate checkouts at platform `67374a9808d226f1be7e8fa73eb104312c075267` and lesson `a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07`. It rejects current v3 roots; historical checks are not v3 approval.
- A native Windows rebuild in a separate copy passes 598 edition, 99 selected maths and 320 repair checks, plus 24 package unit tests. An initial attempt used a Noto Sans fallback and failed; installing the specified Lato 2.015 for this task resolved it without changing supplied source or checks.
- Six rebuilt volumes have the same page counts (132/74/22 and 166/68/28) and identical extracted text on all 490 pages. Exact raster comparison fails on 326 pages (164 identical), so cross-platform pixel reproduction is **not** claimed. Four inspected side-by-side samples show heading-rendering differences without sampled content loss or clipping. Supplied PDFs, not local rebuilds, are imported.
- Existing Book 2 outline and durable target-authority checks pass. The old Issue 229 sprint-only scope guard is not applicable to this Book 3/4 PR; its unchanged durable checks remain required.
- The normal retrieval exporter and query retain all targets and the source contract, including derivative formula/capacity/units (3.2.2), population/functions/graph (4.3.2), a table (4.3.1) and a separate source page (3.3.4). All 26 source-figure uses are consumed. Reused IDs require an explicit revision, and candidates remain pending review in query output.
- Negative tests reject unknown/mixed/missing revisions, old chapter counts, empty context, lost sources/figures, altered hashes, missing v5 anchors/refs, Book 1/2 changes and false final approval.
- Initial broad tests exposed the new snapshot-version case and stale legacy fixtures. The corrected affected suites pass. Final full-suite and exact-head CI outcomes are reported in the paired PRs and task handoff; they are not inferred from this initial local record.

Evidence: [local checks and environment](BOOK34-V3-INTEGRATION-20260917-qa/local-checks.json), [all-page comparison](BOOK34-V3-INTEGRATION-20260917-qa/rebuild-comparison.json), [environment](BOOK34-V3-INTEGRATION-20260917-qa/build-environment.txt), and [independent technical review](BOOK34-V3-INTEGRATION-20260917-review.md). The review is technical integration review, not target-quality approval.

## Commands and consumer

```text
npm.cmd run check:books34-structure -- --require-tracked
node scripts/check-course-target-exercises-v5.js
npm.cmd run lookup:books34-outline -- --revision book34-lesson-balance-v3-20260915 4.1.1
node build-scripts/rag/build-chunks.js
node build-scripts/rag/query.js --paragraph 4.3.2 --revision book34-lesson-balance-v3-20260915 --json
```

The historical v2 checker must run at its matching historical platform/lesson roots. Ordinary per-paragraph production checks are not a substitute for this finite received-package import; the unchanged package sources, shipped reproduction tools and archive projections are checked by the bounded import route. The platform shared-lane scope check remains applicable to platform changes.

## Remaining decisions and integration status

Independent target review, the five timing questions (3.1.2, 3.1.3, 3.1.5, 4.2.4, 4.2.5), and later-year cao/vakbonden placement with explicit time allocation remain open. Companion acceptance and publication are separate. Book 1 stays frozen.

The proposed pair requires a new trusted-main compatibility run with the exact live bases and candidate heads. A valid merge order needs a green final pair and a green intermediate state. The required platform job continues to use lesson main. No validator is relaxed to turn an incompatible intermediate state green; any unsupported order remains a reported blocker. This task has no merge authorization.

Task branch in both repositories: `codex/books34-v3-integration-20260917`; worktree owner: `codex-root`. Paired task worktrees are under `C:/wt/book integration/books34-v3-20260917/`. Exact committed/pushed heads and PR URLs are recorded in the final handoff.
