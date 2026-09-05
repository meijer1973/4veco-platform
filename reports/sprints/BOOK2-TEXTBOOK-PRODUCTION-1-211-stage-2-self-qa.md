# §2.1.1 Stage 2 — builder evidence, not independent acceptance

Date: 2026-09-05. Builder: `released_pin_analysis`.
Task: `BOOK2-TEXTBOOK-PRODUCTION-1-211`.
Both isolated repositories use branch `agent/book2-211-production-20260905`.

## Authority and scope

Production follows the independently accepted paragraph plan at lesson commit
`e680d6171968ec1d8a14132796c0c9df6ded0d30`, canonical LF SHA-256
`f46c7aa444ba6fef1f6f885b34bd52963fccac3cdc7b13b898eb6665219c4cd0`.
Chapter21 version `book2-part-a-21-v1` is pinned to root lesson commit
`7ad5dd19e1714bb68d48a55a11a032942a6615e4`, canonical LF SHA-256
`ef3f872f5caa2de1359639983d8e4907a34cfcbc80a0309826cff07201e49116`.
PR231 merged as `96416b6b5bd57094576e9aba0a42d682584ec479`; parent verified
main CI33963305398 SUCCESS before authoring permission.
The target record remains byte-exact SHA-256
`143f1053c98766b77d9d9ce573a5c8e976980f900387159312c3238288d71710`.
All four goals, bakery context, classification-table cells, a–e prompts,
4/3/3/3/4 points and literal short answer models are serialized directly from
that frozen record. Expanded teaching answers supplement, never replace it.

The Part A skills listed in stage1 and the PDF skill were personally applied:
native paired SVG/PNG, platform source builder, all-page PDF inspection,
independent review separation and a body/table readability floor of 12 pt.
No target/goal/registry, Part B, plan, root/chapter, index/map, ZIP, review or
quality-reference change is included. Parent owns integration and new QC.

## Deliverable and source route

`build-scripts/content/book-2/b2_211.py` consumes four Markdown source templates
under `build-scripts/content/book-2/211/`, checks both reviewed plan hashes and
current approved paragraph-production authority, then emits three Markdown,
three self-contained HTML and three PDF files plus six SVG/PNG pairs.
The lesson `build_pdf.py` is only a thin call into this platform builder.
One exercise source is shared by paragraph and exercise editions; their final
exercise HTML fragments are byte-identical. No output was hand-patched.

Root owns `print_pipeline.py`. Authorized root helper revisions through
`5a830c82` are present; parent reported independent helper review PASS.
All assets are native geometry, with labels at least 20 SVG units at 720-wide
viewBox (over 12 pt at final content width), direct labels and non-color cues.
The staged total-cost graphic adds TVK then TK in successive panels. Orange
curve text uses dark ink for contrast; GTK remains purple.

## Final artifacts and canonical visual proof

Canonical root: `reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/`.
Each artifact directory contains all individual 150 dpi pages, contact sheet,
the exact source/HTML/PDF/asset/page-hash manifest, and a separately attributed
`builder-inspection.json`. The generated manifest remains PENDING independent
inspection. Builder records are not independent review or student-use approval.

| Edition | Pages individually inspected | Artifact directory | PDF SHA-256 |
|---|---|---|---|
| Paragraph | 1–15 | `211-paragraaf-e136b26a4fcb` | `e136b26a4fcb3dd8367dc4933fbc726b3aff405f0ea8a9e396ffc260d56011b0` |
| Exercises | 1–9 | `211-opgaven-111c7436dedc` | `111c7436dedc8d2d126894d90c10009d4e77c8f8f774b83b707012921f9e2308` |
| Answers | 1–7 | `211-antwoorden-9fce79c5c66c` | `9fce79c5c66cf2ac05ea2ecad6ef3a121ae244cc2fbb684bb8400d336425c4e2` |

Every full page image was inspected at reading scale, not just contact-sheet
thumbnails. Final recapture comparison found 30 of 31 page PNGs byte-identical
to the individually inspected draft; only paragraph page5 changed (TK label
color) and was inspected again. No remaining visible clipping, overlap,
unreadable table cells, broken glyphs, severed short warning label/body or
misleading graph endpoint was found by this builder. Target questions and all
eight blank classification cells fit together on paragraph14/exercises8.
Full tables are kept intact; long exercises can continue onto following pages.

Builder iteration corrected automatic a–e renumbering by Pandoc, inadequate
blank-cell writing space, split three-calculation lists, a slash-ambiguous
worked graphic (now a two-quantity matrix), figure-caption order, and expanded
target calculation steps. A Windows CairoSVG/WeasyPrint shutdown access
violation was isolated: CairoSVG now runs in a checked child interpreter.
Both final builds exit cleanly with code0; there is no ignored native crash.

## Commands and observed checks

Commands run from the isolated platform root with `C:/Python314/python.exe`,
Pandoc3.9.0.1, WeasyPrint68.1 and Poppler on PATH.

| Check | Observed result |
|---|---|
| `git fetch --prune origin` in both repositories | Exit0; no behind/diverged state |
| `npm.cmd run check:governance-freshness` | PASS; origin/main96416b6b, no differing policy files |
| Worktree safety `--check` for both with exact task/agent | PASS; owned scoped output dirt only |
| `python -m unittest discover -s build-scripts/content/book-2/211 -p test_source.py -v` | 10 tests PASS |
| `python -m unittest discover -s build-scripts/content/book-2 -p test_print_pipeline.py -v` | 19 tests PASS, including actual PDF boundary fixture |
| `python build-scripts/content/book-2/b2_211.py --proof-root reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1 --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-build-final.json` | Exit0; all31 pages captured |
| Same builder without proof, `--manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-build-rebuild.json` | Exit0; all9 MD/HTML/PDF,12 assets,6 input-source hashes identical |
| `python build-scripts/content/book-2/211/check_render.py` | PASS actual minimum body font12.0pt in all3 PDFs; exact target/points/goals/table and shared exercise HTML |
| Shared helper `verify_record_freshness` on all3 final records after rebuild | PASS consumed MD/HTML/PDF and every paired asset |
| Approved currentness `--action paragraph_production --paragraph 2.1.1` in both builds | PASS |
| Target authority remediation `--durable` in both builds | PASS all12 exact candidates |
| Paragraph validator `--mode part-a --profile student-web` | Structural PASS, with stale-QC caveat below |
| Same validator `--profile publisher-print` | Structural PASS, with stale-QC caveat below |

The validator reads inherited legacy `2.1.1-review.md` and quality-ref and
prints their old status. These files are unchanged and MUST NOT be used as
acceptance for this payload. New paragraph/economics/teacher/visual and QC
review are explicitly pending. No full platform-suite result is claimed here.
The optional outdated Inspectie mapping is omitted, not asserted as compliance.

Superseded untracked exploratory proof directories under reports/sprints and
the first draft manifest are not canonical evidence and are excluded from the
payload. A scoped cleanup command was blocked by execution policy before it
ran; no files were removed. Parent is informed of those remaining local drafts.

## Timing and next gate

Post-commit scope diagnostic: lesson textbook lane PASS for the22 output files
from e680d61 to a1251bf. Platform textbook lane FAIL for7bd7e23→a1077e8c:
the211 source namespace is classified shared-platform and40 canonical proof
files are classified unknown. Parent must add exact scoped routing/tests or a
reviewed lane exception in the integration branch. The builder has not edited
the shared classifier or waived this gate. Plain platform diff-check also flags
the shared helper's CRLF JSON manifests; `git -c core.whitespace=cr-at-eol diff
--cached --check` passed. Those generated bytes were preserved to retain the
recorded manifest-hash binding; parent is informed. Lesson plain diff-check PASS.

Payload commits pushed: initial platform source726ca4fadb48c111dce3aa2906ce5b1c1ddc759f,
final platform source/proof a1077e8c9c98c783db178fa2e2862f2c8de9a93d,
lesson a1251bfd2aad9d984d2d40db7b7e28c5ec1538fe. Later evidence-only additions
do not change these source/output hashes or constitute acceptance.

The separate `BOOK2-TEXTBOOK-PRODUCTION-1-211-timing-walkthrough.md` records a
54-minute core, 12-minute guided expansion (66 total), 8-minute bonus and
4-minute closing retrieval outside the core. This is a design walkthrough,
not a measured learner trial. Start honestly samples prerequisites, not a full
target retest. Teacher review must judge feasibility and support decisions.

Next: parent integrates exact paired commits, assigns independent paragraph
review and specialist QC against these source/output hashes, replaces legacy
review references only through that gate, and owns repository-map publication.
Any corrections must regenerate all affected outputs and refresh proof; this
builder record does not permit bypassing those gates or Part B production.
