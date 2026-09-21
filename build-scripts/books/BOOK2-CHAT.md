# Book 2 chat edition: bounded assembly repairs

**Current Book 2 theory/signed revision:** follow [BOOK2-SIGNED.md](BOOK2-SIGNED.md).

**Historical route revision (21 September 2026):** follow
[EXERCISE-ROUTES.md](EXERCISE-ROUTES.md) to rebuild edited chapter manuscripts.
The commands and 180 unchanged historical pages below describe the earlier
cover/link repair. They are retained as historical reproduction evidence.
For current revised chapters, the assembler and verifier require the explicit
`--revised-chapters` option and source-bound revision manifests. Their page
comparisons then relate the current chapter PDFs to the current complete books.

The selected chat-2026 edition has complete chapter PDFs but did not include
its original book assembler. `build_book2_chat.py` supplies that missing route
for the defects reported on 18 September 2026. It does not rerender chapter
manuscripts or migrate them to the ordinary paragraph renderer.

From the platform worktree, with the lesson worktree adjacent:

```powershell
python -m pip install -r build-scripts/books/requirements-book2-chat.txt
python -m unittest discover -s build-scripts/books -p test_book2_chat.py -v
python build-scripts/books/build_book2_chat.py
python build-scripts/books/verify_book2_chat.py
```

Both commands accept `--lesson-root <path>` when necessary. Authoritative
assembly inputs are lesson `edities/chat-2026/assembly.json`, its cover
background and the nine delivered `hoofdstukken/*.pdf` files. Chapter checksums
must still match the original delivery manifest. The cover's curves, table,
surplus polygons and labels are PDF vectors; the shared PNG is their rendered
preview. Background artwork was edited using built-in ImageGen; the exact
accepted prompt is recorded alongside it in the lesson edition.

Local named links are resolved against each chapter before merging. All link
rectangles and view coordinates are retained; exported destination names gain
`h1-`, `h2-` or `h3-` prefixes. Both `/Dest` and `/A` GoTo actions are supported.
Unknown destinations stop the build. This fixes the duplicated `overzicht`
name at its assembly source without changing correctly linked chapter PDFs.

The verifier checks all untouched delivery hashes, all 180 chapter pages by
text and pixel equality, all 105 link annotations, all three page counts,
both overview destinations, identical covers, and the actual PDF paths/table
text/label bounds against the economic model. The regression suite exercises
duplicate names, unknown names and external actions. Inspect the final cover
and contents pages visually as well; automated checks are not content review.

`delivery-manifest.json` and the import-only `verify_files.py` remain historical.
The current `repair-manifest.json` binds assembly inputs and repaired outputs;
the new verifier applies those four replacements while checking the other
455 original files unchanged. It does not renew historical paragraph reviews,
change target approvals, or provide permission to merge or publish.

pypdf 6.13.2 logs `Annotation sizes differ: N vs. 0` while appending these
chapter links, before the annotations are restored by its merge path. The
post-build checks require every final annotation and destination to be present;
the warning is not treated as evidence of correct output.
