# Scoped layout repair for independent review

Requested outcome: keep `De procedure samengevat:` and its five-row procedure table together in §2.1.1 opgaven, preserving all content. Review this repair and pagination neighbours only; no whole-paragraph acceptance is requested.

Worktree pair: `layout/4veco-platform` at `85b0f347f3070e005eae3f35f0b11ce6eac71b4d`; `layout/4veco-lessen` starts at `0acaaa97443e5c4fee34f7da8a12ccd5db62d762`. Both branches: `codex/assessment-layout-20260913`; owner `assessment-layout`. No platform edits.

The paragraph is `Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren`.

Changed lesson files:

- `2.1.1 Kostenstructuren – opgaven.md`: four added lines group the existing label and table in a Pandoc Div with `break-inside: avoid`.
- `build_pdf.py`: three print-only selectors compact the group's margins and following separator so the rest of the exercise stays on page 2. The existing builder is retained because migrating this paragraph to the shared renderer would change unrelated layout. The HTML write now normalizes CRLF to LF to avoid Windows CRCRLF and failing diff hygiene.
- `2.1.1 Kostenstructuren – opgaven.html` and `.pdf`: regenerated with the existing builder, invoked using an absolute path. HTML line-ending/blank-line noise is mechanical; `check-content.py` establishes identical parsed body structure/content after removing only the new Div.
- `2.1.1 Kostenstructuren – opgaven.zip`: same 15 entries; only the above four existing payloads refreshed; every other payload identical.
- `2.1.1-textbook-review-manifest.json`: inventory only, not paragraph acceptance. Prior `2.1.1-review.md` and quality record remain unchanged and are not current acceptance evidence.

Final review manifest SHA256: `cbd8fe89d61d127c7eea31f075ba8d941945c0cc0a125874843548486389c7c0`.

Evidence in this run folder:

- `baseline-edition/` contains exact committed PDFs exported by the production reproduction command, current review NOT_PERFORMED.
- `baseline-page-1.png` through `baseline-page-5.png`; `final-page-1.png` through `final-page-5.png` are 1500 px Poppler renders. Final PDF bytes did not change after the LF correction.
- Page 1 changes only in the former label's bounding rectangle. Page 2 has the label and all five rows together, with questions 1A–D still on that page. Pages 3–5 are pixel-for-pixel identical at the captured resolution (`pixel-differences.json`) and have exactly identical extracted page text.
- `content-check.json`: authored Markdown unchanged apart from group markers; HTML body semantics unchanged apart from group; full PDF content preserved with page footers and extraction bullet ordering excluded; five pages retained.
- `archive-check.json`: all unaffected ZIP payloads identical, affected payloads equal current files, archive CRC check succeeds.
- `hygiene-lf.log`: `git diff --check` succeeds.
- Browser CUA inspected the final HTML at `http://127.0.0.1:8767/4veco-lessen/.../2.1.1%20Kostenstructuren%20%E2%80%93%20opgaven.html`: label, all rows and graph readable without overlap or raw markup. After LF correction only line endings changed, and PDF bytes stayed identical.

Initial self-check caught a new Opgave 4 orphan from the unadjusted group and an empty footer caused by relative runpy invocation. Both were corrected before this request. No reviewer verdict has been authored by the author.
