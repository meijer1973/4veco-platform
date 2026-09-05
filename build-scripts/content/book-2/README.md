# Book 2 Part A production sources

This directory owns reproducible content/asset builders and shared print logic
for BOOK2-TEXTBOOK-PRODUCTION-1. Lesson wrappers are thin entrypoints; no Part B
output, Book 1 regeneration or target-authority mutation is performed here.

`print_pipeline.py` converts an exact authored Markdown path to self-contained
HTML and PDF with Pandoc 3.9.0.1 and WeasyPrint 68.1 (Python 3.14 validated).
It embeds paired SVG/PNG assets as PNG, requires alt text and local `_assets`
paths, strips Pandoc head styles, retains MathML and Dutch metadata, and uses
at least12pt body/table text. Short exercise blocks stay together; longer
source-rich tasks can split at safe paragraph/row boundaries. Chapter fronts
are excluded from exercise wrapping. Final rendering still requires inspection.

```powershell
python build-scripts/content/book-2/print_pipeline.py '<exact lesson Markdown path>'
python build-scripts/content/book-2/print_pipeline.py '<exact lesson Markdown path>' --proof-root reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1
python -m unittest discover -s build-scripts/content/book-2 -p 'test_print_pipeline.py' -v
```

Builders may import `build_document(Path(...))` and `render_proof(record, path)`.
Proof output records hashes and all Poppler page renders/contact sheet, but
inspection remains PENDING with no claimed defect count or accepted pages.
Use a fresh output-hash proof directory after regeneration; existing evidence
is not overwritten. Independent reviewers record actual page acceptance later.

Dependencies: Python, bs4, Pillow, pypdf, WeasyPrint, Pandoc and Poppler
pdftoppm. They are available in the local validated runtime; no dependency
upgrade is part of this task. The WeasyPrint68.1 default_url_fetcher emits a
known API-deprecation warning for future69.0; the supported pinned68.1 render
works and all remote resource loads are rejected. A future toolchain migration
needs its own regression check, not a silent upgrade here.
