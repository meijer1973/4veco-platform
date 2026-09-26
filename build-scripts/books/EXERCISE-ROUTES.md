# Current Books 2–4: exercise-route revision

Book 2 now uses [the native theory/signed build](BOOK2-SIGNED.md), which retains this route contract. Books 3/4 use [the bounded signed-retrieval successor](BOOKS34-SIGNED.md) for the eight later wording changes and explicit answer rebuilds. The route-only build below is the predecessor and preserves its original evidence contract.

The owner's 21 September 2026 request changes the Part A pedagogical contract.
Use [the canonical exercise contract](../../skills/econ-exercise-builder.md#21-the-routes-and-the-constraint)
for route membership, section roles and timing. This revision preserves questions,
answers, numbering, learning goals and the separate Part B workflow.

## Sources and build

Use adjacent owned `4veco-platform` and `4veco-lessen` worktrees. Book 2's editable
student sources are `Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/edities/chat-2026/bronnen/H*/manuscript/`.
Its central answer and teacher sources are in each H folder. Books 3/4 use
`edities/books34-v3/books/book-N/chapters/N.M/*.md`, chapter CSS and the owned
book-matter `back.md`. Never edit paragraph exports or generated book front matter.

Platform owns the current controller, book front matter, outline reading-copy
renderer and record templates. The lesson `build/build_all.py` is a thin wrapper.
Received render/content/export libraries are reused with checked receipt bytes;
received assembly/record templates remain historical and are not the current entry.

Install `build-scripts/books/requirements-exercise-routes.txt` in a virtual
environment. It retains the v3 renderer pins and adds the Book 2 assembly libraries. Provide Pango/Cairo and the
Lato/DejaVu fonts described by the lesson `BUILD_ENVIRONMENT.md`. On Windows set
`WEASYPRINT_DLL_DIRECTORIES` to the native library directory; a task-local
`FONTCONFIG_FILE` can select fonts without changing system settings. Keep the
environment and fonts outside the repositories. Use UTF-8 explicitly:

```text
python -X utf8 build-scripts/books/rebuild_exercise_routes.py --lesson-root ../4veco-lessen
python -X utf8 build-scripts/books/verify_exercise_routes.py --lesson-root ../4veco-lessen
node build-scripts/books/record_exercise_route_revision.js ../4veco-lessen
node build-scripts/maintenance/check-books34-v3-import.js
```

`--books 2` and `--books 34` rebuild either edition. The final command checks the
current revision plus immutable receipt/structural/target evidence. Stage the
complete package and repeat it with `--require-tracked` before committing.
Recording a manifest is not review: independently inspect the actual changes
before accepting its new platform SHA pin. PDF hashes bind a particular build;
environment, checkout paths and PDF identifiers can change hashes on rebuilding.
Text, rendered body pixels, pagination and link destinations are checked separately.

The controller rebuilds student and teacher chapters, paragraph exports, book
front matter, complete volumes and target records. Unchanged answer chapter PDFs
are reused and checked against unchanged answer sources by the preservation gate.
Book 2 also rejects changed answer inputs before building. An answer edit needs
an explicit answer rebuild and review; it cannot use this route-only shortcut.

## Evidence and timing

Historical `delivery-manifest.json`, `repair-manifest.json`, the v3 receipt,
provenance and previous review reports remain unchanged. The historical importer
is still available via `check-books34-v3-import.js --historical-import` and must
reject revised current bytes. Current acceptance uses the closed lesson
`exercise-route-revision.json`, its platform pin, revised source-bound Book 2
chapter/assembly manifests and `checks/route-revision-*.json`. Required platform
CI may also accept exactly lesson baseline `e2843b47` until the paired lesson PR
lands; that state is identified explicitly and does not certify revised outputs.

The source-preservation check compares all 43 paragraphs' exercises, goals,
figures, definitions and formulas with that baseline; it checks reused answers,
assets and all 31 target payloads. Assembly checks compare every inserted chapter
body with its current source PDF and verify contents destinations. For Books 3/4
answer and teacher volumes, the existing footer replacement normalizes PDF
drawing streams; the pixel check applies that same footer transform to an
in-memory source copy, with no image tolerance. Original body text remains exact. Inspect the
changed route, introduction, teacher and contents pages visually as well.

All 34 theory paragraphs include guided practice in their normal route. Their
older estimates omitted that phase and sometimes selected only part of independent
practice. No new complete 55-minute fit is claimed. Teacher pages preserve the
known lower bounds and missing estimates; future designs must budget the entire
normal route. The nine mixed-practice exceptions retain their actual sections.
See each edition's `ROUTE-REVISION-2026-09-21.md` for details. Existing target
approval status is unchanged; this is a scoped revision review, not fresh approval
of all curriculum or classroom timing.

## Imported paragraph review inventories

These editions keep manuscripts and render inputs in shared chapter folders.
The native `paragraph-records.js snapshot` command requires an `X.Y.Z Name`
folder and cannot inventory that structure. After recording the closed edition
manifest, run `node build-scripts/books/exercise-route-review.js`. It generates
43 explicit chapter-aware snapshots in `reports/review-gates/exercise-routes-20260921/`,
including actual paragraph exports, shared chapter sources, book outputs and
platform input pins. The whole-edition digest also prevents omitted additions
or deletions. Independent per-paragraph reports bind those snapshots; validate
with the same command plus `--check`. This is bounded route-revision evidence,
not native paragraph closure, a replacement for source approval, or new target
approval. Historical reports are never rebound.
