# Book 2 unused proof namespaces — author result

Date: 2026-09-06. Author: codex-root. Source baseline platform
8bd4bd66fa0352a770f5069c50ee1bbdf2f651bd; unchanged lesson baseline/head
30f57bfad2096c7afa507da48db9d82ee35a3c23. Operational plan was committed first
at 2d7e4a7231bcc78f2feb35b0057feea3e01f365d.

## Result and limits

AUTHOR TECHNICAL PASS; DISTINCT INDEPENDENT TOOLING REVIEW PENDING.
No actual book manifest, chapter/book matter, lesson, paragraph renderer,
protected reference, approval or frozen target was edited. No student assembly
was produced or approved. Existing default Book 1/Book 2 API calls and the
omitted-option CLI path remain unchanged. The old default Book 2 proof location
still has its historical collision behavior: independent captures must use the
new explicit option, after the separate review gate passes.

The Book 2 builder now validates an explicit unused task-evidence location
before preparation, revalidates after the original source and authority checks,
and reserves the directory with exclusive mkdir before aggregate output writes.
An occupied location, including an empty directory, is rejected. Containment is
resolved against the platform task-evidence directories. A later failed render
consumes the location; it must not be recycled. Original per-artifact hash names
and PENDING inspection records remain intact. This is not a claim of an
adversarial filesystem transaction across every possible symlink race.

The existing CLI and common book dispatcher forward `--proof-root` only when
provided. Explicit use with the legacy non-Book-2 profile is rejected before the
legacy renderer. A future, independently authorized real build can select an
unused absolute location such as
`C:/wt/book2-part-a-production-20260905/4veco-platform/reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/book-root-r1`.
That example is not reserved or executed here. Relative values use the caller's
working directory; an absolute path is preferred for reproducible invocations.

## Actual verification

All seven commands below ran through the root sprint command recorder. Their
actual arguments, times, exit codes, output excerpts and full-stream SHA-256
digests are retained in the umbrella command-log JSONL/Markdown. The exact
records are also selected into the payload-bound scope result; excerpts are
not misrepresented as complete captured streams.

1. `C:/Python314/python.exe -m unittest discover -s build-scripts/content/book-2 -p test_book_proof_namespace.py -v`:
   10 PASS, 8.422 seconds of test runtime. Starts 2026-09-06T02:01:25.722Z.
2. `C:/Python314/python.exe -m unittest discover -s build-scripts/content/book-2 -p test_*pipeline.py -v`:
   39 original tests PASS (13 book, 6 chapter, 20 print), 13.985 seconds.
3. `node node_modules/jest/bin/jest.js --runInBand build-scripts/books/lib_book.test.js`:
   one Jest wrapper PASS, including all seven original common-book Python tests.
4. `C:/Python314/python.exe build-scripts/books/build-book.py --help`: PASS;
   existing options and new explicit proof-root option are available.
5. Approved outline currentness, action `whole_book_assembly`: PASS. This proves
   foundation currentness only, not nonexistent chapter-source acceptance.
6. Durable Book 2 authority guard: PASS, all twelve targets.
7. Active umbrella sprint-bundle check: PASS; not the terminal `--complete` gate.

Total: 56 Python regression tests plus their one Jest wrapper; no test failed.
This is targeted local verification, not the current full suite or hosted CI.
Existing WeasyPrint fetcher-deprecation warnings occurred in native fixtures;
no library/runtime change is included in this patch.

The ten new tests cover empty/populated occupation, scope/traversal rejection,
denied authority, stale inputs, a competing preflight reservation, an exclusive
mkdir collision, failed-render consumption, CLI/common-dispatch compatibility,
and two actual native temporary-fixture builds at distinct locations. In the
last test Pandoc, WeasyPrint and Poppler run normally; only fixture Node authority
subprocesses are stubbed. Six MD/HTML/PDF files, all rendered-page raw bytes and
decoded RGB pixels, and copied SVG/PNG assets match exactly. Both separate
records remain PENDING with no inspected pages, and the first proof is intact.
These technical fixtures are not lessons, economic diagrams or visual approval.

## Scope and next gate

The companion one-shot scope checker binds the actual committed payload,
exact four source paths, all selected command records and unchanged lesson
head. It runs genuine source-bearing incremental and complete platform scope,
and complete lesson scope. An unchanged lesson increment is recorded as such,
not presented as a native empty-diff lane PASS. Default whitespace diagnostics
from the complete historical platform series are preserved separately; new
source/report whitespace must pass without changing old evidence.

Publish the payload and its actual scope evidence on the normal paired branch,
refresh the four paired indexes, verify clean exact remote heads, then obtain
a distinct independent tooling review before real book use. Paragraph
production can continue through its own gates meanwhile. Final aggregate
source review, all-page visual inspection, full CI, lead review and paired PR
readiness remain outstanding. No future PR merge is authorized.
