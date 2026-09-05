# §2.1.1 R2 correction — builder evidence

Date2026-09-05; builder `released_pin_analysis`. Independent approval is not
claimed. Root authorized the minor Dutch answer correction and helper613b4ca9.

Source `211/answers.md` now says `bij iedere extra badge`, replacing `bij ieder
extra badge` in Opgave3a. No economics, target, goal, points or plan changed.
Root helper613b4ca9 was cherry-picked as24dd7e75; proof manifests now serialize
with stable LF. No manifests were hand-patched. The211 builder has a bounded
`--proof-suffix r2` option to capture into fresh directories without overwriting
old proof; traversal/invalid revision strings fail before any output write.

## Canonical supersession mapping

All paths below are under `reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1`.

| Prior artifact | Current R2 artifact | Page inspection |
|---|---|---|
|211-paragraaf-e136b26a4fcb|211-paragraaf-e136b26a4fcb-r2|All15 page hashes identical; actual R1 builder inspection carried forward|
|211-opgaven-111c7436dedc|211-opgaven-111c7436dedc-r2|All9 page hashes identical; actual R1 builder inspection carried forward|
|211-antwoorden-9fce79c5c66c|211-antwoorden-979cba5ed213-r2|Pages2–7 identical; changed page1 individually re-inspected at full150dpi reading scale|

Each new `builder-inspection.json` binds its new exact LF manifest SHA-256,
lists carried/re-inspected pages and explicitly keeps independent review PENDING.
Old manifests/inspection records remain immutable historical snapshots, not
current-answer proof. Old local exploratory drafts were left untouched as root
requested; no further cleanup was attempted.

Final answer PDF SHA-256:
`979cba5ed213ad2cc452e5931751e1903975d59a915e5ca16135eb56ed4c0234`.
Answer Markdown:
`57cc1ef3b5c5ae6d912291f9746a7f535906bb85207678bab8fc63dadf82ebfb`.
Answer HTML:
`9ad6028cee1c352056985b9f9f6842e30a9b48e21abdb80690d3d7bde4d9a99c`.
Paragraph/exercise PDFs remain e136b26a4fcb… and111c7436dedc… exactly.

## Observed validation

- Full clean builder with `--proof-root reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1 --proof-suffix r2 --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-build-r2.json`: exit0;31 pages.
- Second clean builder without proof, manifest `BOOK2-TEXTBOOK-PRODUCTION-1-211-build-r2-rebuild.json`: exit0. All9 MD/HTML/PDF files,12 assets and6 input-source hashes match R2 capture exactly.
- Source tests11 PASS, including5 invalid proof-suffix cases; shared helper tests19 PASS in this isolated branch (parent's larger20-test report is not claimed here).
- Actual rendered check PASS:12.0pt minimum body in all PDFs, four exact goals, exact frozen target prompts/cells/17points and identical shared exercise HTML.
- Approved paragraph-production currentness and durable12-record authority PASS in both builds.

Only answer page1 needed renewed visual inspection: no clipping, overlap or
new layout defect found. All target numerics and answer steps are unchanged.
Independent reviewers have been told the exact new answer and proof hashes.
Reviewer's additional minor prior-knowledge-reminder flag is referred to root;
this round does not silently add unrequested paragraph content.

Next gate remains root-owned independent paragraph/QC review and final scoped
platform classifier integration. No review.md, quality-ref or acceptance state
was authored by this builder.
