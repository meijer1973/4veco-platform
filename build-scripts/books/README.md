# build-scripts/books/

Python pipeline for assembling printable textbook PDFs from completed chapter
outputs in `4veco-lessen/Boek N - <title>/`.

**Skill:** `skills/econ-book-builder.md` (canonical recipe)

## Layout

```
books/
├── build-book.py                      CLI entry point
├── lib_book.py                        Core library (manifest, assembly, PDF)
├── book-manifests/
│   ├── book-1.json                    Per-book configuration
│   └── book-1-voorwoord.md            Per-book preface content
└── README.md                          This file
```

## Usage

From the `4veco-platform` root:

```bash
python build-scripts/books/build-book.py --book 1
```

Output lands in `../4veco-lessen/Boek 1 - [title]/` as `.md`, `.html`, `.pdf`,
and a consolidated `_assets/`.

## Prerequisite

Every chapter listed in `book-manifests/book-N.json` must already have been
assembled via `econ-chapter-assembler` **inside** its book folder at
`<lessen-root>/Boek N - <title>/<chapter_nr> Hoofdstuk <name>/`. The builder
fails fast with a clear message if a chapter is missing.

For print cuts, the manifest may also contain a backwards-compatible
`"mode": "composed"` chapter object. A composed chapter stitches selected
paragraph `paragraaf.md`/`opgaven.md` files and optional print-only markdown
sources into the book PDF without deleting or renaming the broader online
lesson tree.

For Book 1 print-scope validation, run:

```bash
node scripts/check-book-print-scope.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
```

## Why Python (and not Node)?

The per-chapter `build_chapter.py` pipeline (Pandoc + WeasyPrint) is Python.
The book builder reuses that pipeline verbatim, so it stays in Python. The
Node scripts in `build-scripts/platform/` build game engines, not PDFs — they
are a separate world.
