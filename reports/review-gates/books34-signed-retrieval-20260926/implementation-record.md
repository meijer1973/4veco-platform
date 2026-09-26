# B34 signed retrieval implementation record

Author: codex-root. Date: 2026-09-26. Scope: the eight owner-specified wording
substitutions and their generated dependencies. The source specification is
transcribed in `build-scripts/books/books34-signed-contract.json`.

Baseline pair: platform `d88aa106d48ec9a7950a6c7eef6be3ead28c44ff`, lessons
`f6518f513d1f22f82922d4a8d3d3842c369b14f7`. Both main heads were rechecked.
The owned paired worktrees are under `C:\wt\book 2\b34-signed-20260926`,
branch `codex/b34-signed-retrieval-20260926`, owner codex-root.
Lesson candidate: `773d72a67baf2f312a961d39247045f6b172adaf` (PR58).
The platform candidate is the commit containing this record; its paired CI
selector pins that exact lesson commit.

## Changes and preservation

Six source files contain exactly eight replacements. Inverting those replacements
recovers the accepted baseline hashes. Four answer chapters render before
assembly; local student chapters 3.2/3.3, both book-page variants, both paragraph
exports and all three affected complete PDFs are refreshed. All 29 publication
paths are rebuilt; the eight page maps and global map remain byte-identical.
The owning record generator refreshes 19 answer hashes and two manuscript hashes.
All 31 target payloads, statuses and other fields remain unchanged.

The new manifest binds 1477 files and 54 changed paths. Its SHA256 is
`bf3d9c7cc804438037f31af618b85bfe4e67e14c74cef264bdd0e1ec8fab18df`.
Both predecessor manifests/pins and historical review packets remain unchanged.
The finite successor authenticates their fixed Git inventories, freezes every
other current file and verifies actual source hashes and staged bytes. Held PV,
Book 1, repaired Book 2, target approval/lifecycle and Part B are preserved.
The Part A ownership classifier adds only the new pin's finite paths.

## Local validation

All commands below completed successfully in the pinned rendering environment
described in the lesson `checks/signed-retrieval-environment.json` and owning
`build-scripts/books/BOOKS34-SIGNED.md`.

- `rebuild_books34_signed.py --baseline`: fresh Git-exported baseline, guarded
  before rendering; separate process; receipt binds all 819 resulting edition
  files, sources, tools, fonts, packages and native libraries.
- `rebuild_books34_signed.py --comparison-root …`: four explicit answer builds,
  current assembly/record generators, exports and preview. Equivalent regenerated
  dependencies outside the finite set are proven equal before restoring their
  accepted bytes; the new build report lists them.
- `verify_books34_signed.py --comparison-root …`: 598 existing structural checks,
  zero failures, 734 questions and 734 answers. All 29 publication paths and 13
  affected PDFs pass; 514 unedited pages are pixel-identical to the authenticated
  baseline. Exactly 20 pages contain approved text changes. All six complete-book
  assemblies pass for 452 body pages, including the existing answer/teacher footer
  transformation; 49 contents links, bookmarks, link rectangles/destinations and
  pagination are checked. Both paragraph exports match their source pages.
- `python -m unittest discover -s build-scripts/books -p test_books34_signed.py -v`:
  nine tests pass, including extra source text, wrong signed boundary, stale answer
  PDF, stale actual source pin, same-root comparison, revised baseline sources and
  tampered baseline output receipt rejection.
- Focused Jest: 41 tests pass across the new finite inventory, historical Book 2,
  route revision and route amendment suites. Another 33 tests pass in lane scope
  and paired paragraph CI, including unrelated/companion negative cases.
- Recorder reruns semantic publication verification before proposing the pin.
  `check-books34-v3-import.js --require-tracked` accepts the 1477-file successor.
  Actual 54 lesson changes pass the textbook lane check. YAML parsing and diff
  whitespace checks pass. Active chapter Markdown/HTML have no remaining matches
  for `absolute waarde`, `in absolute zin` or `|Ev|`.

The independent reviewer inspected every changed page at full size and all 58
changed/neighbour pages with Poppler. After the authenticated build, all 58 pages
were rerendered and matched the inspected pixels. Six current paragraph reviews,
their snapshot bindings and the independent production verifier results are in
this packet. The required platform and new exact-pair Actions runs are recorded
on the linked PRs, rather than asserted by this pre-CI local record.

## Limits and follow-ups

The three changed complete PDFs remain 132 / 74 / 68 pages. Existing navigation
is preserved; NAV1 stays open. TIMING34 is not newly resolved. Review also recorded
the pre-existing “Herhaling 20 en 21” heading above exercises 29/30 in chapter3.2
answers p.17 / complete answers p.51. It is outside the exact-eight changes.
This closes signed alignment of the six active sources and their derivatives
after current review/CI; it does not imply programme-wide alignment, new target
approval or merge authority.
