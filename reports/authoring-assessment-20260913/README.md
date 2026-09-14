# Authoring assessment — portable evidence

This is **experimental, nonproduction evidence** from the September 13, 2026 assessment plus separate September 14 local closure repairs. Packaging copied existing evidence and committed bytes; it did not create content, reviews or new renders.

[assessment.md](assessment.md), [protocol.md](protocol.md) and [measurement-summary.json](measurement-summary.json) are verbatim historical snapshots. Their original timings, commits, failures and limits remain unchanged. Later dated closure entries are outside the timed assessment. The [September 14 closure](closure-20260914.md) records the completed scope and limits, including the [actual-browser review](reviewer/browser-20260914/review-addendum.md). [Download the approved short AGENTS-first access instructions](Content-maps-of-the-repositories.txt). This branch is for review and is not proposed for integration or student deployment.

## Final local outputs

Common lessons baseline: `0acaaa97443e5c4fee34f7da8a12ccd5db62d762`. Original paired platform: `85b0f347f3070e005eae3f35f0b11ce6eac71b4d`. The three cases are separate alternatives, not sequential revisions.

| Case | Final lesson commit | Changed paths |
|---|---|---:|
| [Exercise](exercise/completion.md) | `d00d6209e6413a0b2889719145be9e97a673632c` | 15 |
| [Layout](layout/completion.md) | `0eaaa18a64a3bd3bcd3203d703c6664a7428440d` | 5 |
| [Paragraph](paragraph/completion.md) | `5c5ebf387550c636f665f7ced4f08b10315b831c` | 22 |

Each case retains its actual `task-prompt.md`, completion, independent review, events, measurements, scoped checks, meaningful command logs and dated closure addendum. `changes.patch` is actual `git diff --binary --full-index --no-ext-diff --no-textconv --no-renames <baseline> <final>` output. `changed-files.json` records paths/hashes; `output/<repository-relative-path>` contains committed final files. Fourteen unchanged local SVG/PNG inputs were also included for portable Markdown/render references. Other repository context remains available at the pinned commits.

Quick access:

- Exercise: [prompt](exercise/task-prompt.md), [actual diff](exercise/changes.patch), [final files](exercise/output), [review](exercise/independent-review.md).
- Layout: [prompt](layout/task-prompt.md), [actual diff](layout/changes.patch), [final files](layout/output), [review](layout/independent-review.md).
- Paragraph: [prompt](paragraph/task-prompt.md), [actual diff](paragraph/changes.patch), [final files](paragraph/output), [review](paragraph/independent-review.md).

## Saved review proof

- Exercise: `renders/` contains the sixteen affected/neighbour pages before and after; `html-offline-review/` contains final static-HTML results/images.
- Layout: baseline/final five-page images, original `final-html-summary.png`, preservation and pixel records.
- Paragraph: original reviewed `qa-pages-final/spread-*.jpg` and all twenty-five latest page PNGs in `qa-pages-repair-v2/`.
- Reviewer: [geometry result](reviewer/paragraph-geometry-check.json) and final offline screen-media HTML proof in `reviewer/paragraph-html-screen-final/`. These are offline review surfaces, not browser screenshots or additional delivery PDFs.

Corrected convenience ZIPs are preserved at `exercise/closure-20260914/`, `layout/closure-20260914/` and `paragraph/closure-20260914/delivery/`. Their verification records accompany them. They are external assessment artifacts; tracked legacy ZIPs were restored to baseline during closure.

## Paths, inventory and limits

Original relative report links remain intact. For historical Windows paths, replace `C:/wt/reorganize 2/authoring-assessment-20260913/` with this directory. Map `<case>/4veco-lessen/<path>` to `<case>/output/<path>` when included; otherwise consult the pinned repository. Platform paths refer to the pinned platform commit. [path-map.json](path-map.json) gives individual mappings; original records were not rewritten.

[inventory.json](inventory.json) lists **344 payload files / 45,501,657 bytes (43.39 MiB)**, excluding this README and packaging metadata. [packaging-summary.json](packaging-summary.json) lists largest files and omitted noisy logs. Largest: chapter HTML 4,582,811 bytes; paragraph patch 3,462,916; chapter PDF 2,767,191. Actual packaging Git commands are in [packaging-commands.json](packaging-commands.json).

No whole repositories, `.git`, `node_modules`, credential files, old access attachment, obsolete stitched browser captures or unused render candidates are included. The completed browser and cleanup-platform additions are covered by [the final inventory](inventory-final.json). The [maintenance review](independent-review.md) covers the separate [PR #247](https://github.com/meijer1973/4veco-platform/pull/247). Existing review scopes and full-paragraph baseline limits remain explicit in the original reports and closure addenda.