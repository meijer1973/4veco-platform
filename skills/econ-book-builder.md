---
name: econ-book-builder
description: "Assembles completed chapters (hoofdstuk.md + _assets/) from 4veco-lessen into a single printable textbook PDF with cover, colofon, voorwoord, volledige inhoudsopgave, begrippenlijst, and formuleoverzicht. Stitch-only: does not rebuild chapters. Fails clearly if a chapter is missing. Note: Boek N and Module N are completely different products (different repos, different freeze status); this skill builds books, not modules. Use this skill when the user wants to build a boek, leerboek, or textbook PDF. Trigger when the user mentions boek bouwen, book builder, boek samenstellen, Boek N, build-book, or assemble textbook. Always use in combination with econ-chapter-assembler (prerequisite) and econ-pdf-builder (styling)."
pipeline: "Part A orchestrator"
---

# Economics Book Builder

Assembles completed chapters into a single printable book PDF. This skill sits one level above `econ-chapter-assembler`: it does NOT build chapters, it wraps them with book-level front and back matter and exports a combined PDF for print.

**Skill chain:**
```
paragraph   → econ-textbook-paragraph   → X.Y.Z – paragraaf.md + _assets/
chapter     → econ-chapter-assembler    → X.Y [Name] – hoofdstuk.md + .pdf + _assets/
book  (NEW) → econ-book-builder         → Boek N [Name] – boek.md + .pdf + _assets/
```

**Companion skills:**
- `econ-chapter-assembler` → must have run first for every chapter in the book
- `econ-pdf-builder` → same Pandoc + WeasyPrint pipeline
- `econ-testprep-builder` → prerequisite for Chapter 5 (toetsvoorbereiding) if that chapter is included
- Reads `references/authored/economie-terminologie.md` for the begrippenlijst

**The book has NO answers.** Answers live on the website (separate product). The answer booklet PDFs per chapter are ignored by this skill.

---

## PART 1: WHAT GOES IN A BOOK

```
┌─────────────────────────────────────────────┐
│ COVER PAGE                                  │
│   Book title, editie · jaar, school name    │
│   (NO module eyebrow, NO author)            │
├─────────────────────────────────────────────┤
│ COLOFON                                     │
│   Titel, editie, uitgever, copyright, contact│
├─────────────────────────────────────────────┤
│ VOORWOORD / HOE GEBRUIK JE DIT BOEK        │
│   (from book-N-voorwoord.md)                │
├─────────────────────────────────────────────┤
│ VOLLEDIGE INHOUDSOPGAVE                     │
│   All chapters + paragraphs                 │
├─────────────────────────────────────────────┤
│ Hoofdstuk 1  (chapter hoofdstuk.md as-is)   │
│   incl. its own front page                  │
├─────────────────────────────────────────────┤
│ Hoofdstuk 2 … N                             │
├─────────────────────────────────────────────┤
│ BEGRIPPENLIJST                              │
│   Alphabetical, filtered from terminology   │
├─────────────────────────────────────────────┤
│ FORMULE- EN BEGRIPOVERZICHT                 │
│   Per chapter, extracted from hoofdstuk.md  │
└─────────────────────────────────────────────┘
```

### 1.1 What does NOT go in the book

- Answer booklets (website-only)
- Per-paragraph `paragraaf.pdf`/`opgaven.pdf` (students use the chapter views)
- Difficulty ratings or time estimates
- Teacher-facing `toetsmatrijs` or `_chapter-plan.md`
- Index/register (out of scope for v1)

---

## PART 2: INPUT

### 2.1 Book manifest

One JSON file per book, at `build-scripts/books/book-manifests/book-N.json`:

```json
{
  "book": {
    "nr": 1,
    "title": "Markten begrijpen",
    "edition": "1e editie",
    "year": 2026
  },
  "chapters": ["1.1", "1.2", "1.3", "1.4", "1.5"],
  "voorwoord": "build-scripts/books/book-manifests/book-1-voorwoord.md",
  "colofon": {
    "jaar": 2026,
    "licentie": "MIT License"
  }
}
```

The builder validates the manifest and refuses to run if required fields are missing.

For print-edition cuts, a manifest chapter entry may be an object with
`"mode": "composed"`. This is used when the printed book needs a curated
chapter assembled from existing paragraph markdown plus print-only material
without deleting, renaming, or hand-patching the broader online lesson tree.
After using a print-cut manifest, run the matching print-scope validator.

### 2.2 Chapter outputs (prerequisite)

Chapters belonging to Boek N live **inside** the book folder at
`<lessen-root>/Boek N - <title>/`. For every `chapter_nr` in
`manifest.chapters`, the following must exist there:

```
<lessen-root>/Boek N - <title>/
  <chapter_nr> Hoofdstuk [Name]/
    <chapter_nr> [Name] – hoofdstuk.md
    _assets/
```

If any is missing, the builder fails with a clear message:

```
ERROR: Chapter 1.5 not found in <lessen-root>/Boek 1 - Grondslagen, vraag en aanbod/.
Run econ-chapter-builder for 1.5 first (or econ-testprep-builder + econ-chapter-assembler for a Chapter 5).
```

### 2.3 Voorwoord

The voorwoord is a short markdown file (0.5–1 page) written in Dutch for the student. Suggested structure:
- `# Voorwoord` (h1)
- One paragraph motivating the subject
- One paragraph explaining how the book is built (hoofdstukken, paragrafen, consolidatie, toetsvoorbereiding)
- Pointer to the website for answers and interactive exercises
- Good luck / succes

Keep it under 300 words so it fits on one page at 11pt.

---

## PART 3: ASSEMBLY PROCESS

```
1. Load and validate manifest (build-scripts/books/book-manifests/book-N.json)

2. Derive `book_dir = <lessen-root>/Boek <nr> - <title>/` from the manifest.

3. For each chapter_nr in manifest.chapters:
   a. Locate `<chapter_nr> Hoofdstuk *` folder inside book_dir
   b. Verify `<chapter_nr> [Name] – hoofdstuk.md` exists
   c. Abort with clear error if any is missing

4. Generate front matter as raw HTML:
   a. <div class="book-cover">   — cover with title, editie, jaar (no module eyebrow)
   b. <div class="book-colofon"> — colofon fields
   c. <div class="book-voorwoord">  — voorwoord.md converted to HTML inline
   d. <div class="book-toc">     — full book TOC (chapters + paragraphs), parsed from each
                                    chapter's front-page table

5. Concatenate (with <div style="break-before: page"></div> between sections):
   cover → colofon → voorwoord → toc →
   <!-- BOOK-CONTENT-START --> →
   chapter-1.md → chapter-2.md → ... → chapter-N.md →
   <!-- BOOK-CONTENT-END --> →
   begrippenlijst → formuleoverzicht

6. Rewrite image paths across all chapters to point to a single book _assets/ folder.
   Copy every chapter's _assets/ content into <book-dir>/_assets/ (deduplicated by filename —
   all chapter assets are already namespaced 1.2.3_fig_N.png).

7. Generate back matter as raw HTML:
   a. <div class="book-glossary">  — alphabetical begrippenlijst, filtered from
                                     references/authored/economie-terminologie.md by
                                     terms actually present in the assembled book
   b. <div class="book-formulas"> — formuleoverzicht per chapter, extracted from
                                    `> **Definitie: …**`, `> **Formule: …**`, and
                                    `> **Procedure: …**` headers in each chapter's hoofdstuk.md

8. Embed images as base64 PNG (same as chapter pipeline)

9. Pandoc markdown → HTML5 --standalone

10. Post-process HTML:
    a. Strip Pandoc default stylesheet
    b. Wrap exercises in <div class="exercise"> — ONLY in the content between the
       BOOK-CONTENT markers, and within that region skip <div class="chapter-front">
       regions (handled by a placeholder-swap pass)
    c. Rebalance table column widths
    d. Inject book CSS (base + .book-cover/.book-colofon/.book-voorwoord/.book-toc/
       .book-glossary/.book-formulas)

11. WeasyPrint → PDF (with fallback to headless Chrome, same as chapter builder)
```

### 3.1 Exercise wrapping must skip protected regions

The `wrap_exercises` step inserts `</div>` before every `<h2>`/`<h3>`. This will break the chapter front pages (`.chapter-front`) and any front/back matter that contains sub-headings. The builder must:

- Extract all `<div class="chapter-front">…</div>` regions, replace each with a unique placeholder token before running `wrap_exercises`, and restore them afterwards.
- Run `wrap_exercises` ONLY on the content between `<!-- BOOK-CONTENT-START -->` and `<!-- BOOK-CONTENT-END -->`.
- Design the book front/back matter to use only `<h1>` at top level (no `<h2>`/`<h3>` at top level of `.book-colofon`, `.book-voorwoord`, etc.).

---

## PART 4: FILE OUTPUT

Saved to `<lessen-root>/Boek N - [title]/`:

| File | Contents |
|------|----------|
| `Boek N [title] – boek.md` | Combined markdown (front matter HTML + all chapters + back matter HTML) |
| `Boek N [title] – boek.html` | Intermediate HTML for debugging |
| `Boek N [title] – boek.pdf` | Final book PDF for print |
| `_assets/` | All graphs and diagrams, deduplicated |

File naming: use en-dash (`–`), not hyphen. Same convention as chapter/paragraph output.

---

## PART 5: PRINT / GREYSCALE READINESS

The book uses the same base palette as the chapter pipeline (`#1A5276` blue, `#2D3748` body text). In greyscale print, headings convert to mid-grey and remain readable. Body text stays near-black. No `@media print` CSS overrides are applied — the school print workflow outputs in grey by default and the current palette survives this.

**Known limitation (follow-up):** SVG graphs inside chapters may use color that does not survive B/W photocopy. This is tracked as a separate QA task, not a blocker for v1.

---

## PART 6: EXTRACTION RULES

### 6.1 Begrippenlijst filtering

- Parse `references/authored/economie-terminologie.md` tables. Each row: `| # | Dutch term | abbrev | English | notes |` (columns may vary). The canonical term is column 2. Skip rows where term is `—` or a header row.
- If the term cell contains `/` (e.g., `prijselastische vraag / prijsinelastische vraag`), split on `/` and treat each side as a separate term.
- Strip Roman numerals at start (e.g., `I volkomen concurrentie` → `volkomen concurrentie`).
- For each term, check case-insensitive word-boundary presence in the assembled book markdown.
- Deduplicate, sort alphabetically (Dutch collation: treat case-insensitively, ignore diacritics).

### 6.2 Formuleoverzicht extraction

Walk each chapter's `hoofdstuk.md` and capture every blockquote starting with `> **Definitie:`, `> **Formule:`, or `> **Procedure:`. Take the first line as the title. Group by chapter.

If a chapter has no matches, emit an `<em>Geen formules of definities gevonden.</em>` placeholder rather than omitting the chapter.

---

## DECISION CHECKLIST

1. □ Manifest loaded and validated (book fields, chapters list, colofon)
2. □ Every chapter in `manifest.chapters` has `hoofdstuk.md` + `_assets/` — fail early if not
3. □ Voorwoord file exists (else placeholder + warning)
4. □ Cover omits "auteur" per project rule
5. □ Book front matter uses only `<h1>` at top level (no stray `<h2>`/`<h3>` that would break exercise wrapping)
6. □ Content between `<!-- BOOK-CONTENT-START -->` and `<!-- BOOK-CONTENT-END -->` receives exercise wrapping; front/back matter does not
7. □ Chapter `.chapter-front` regions stashed via placeholder during exercise wrapping
8. □ Assets deduplicated by filename into single book `_assets/`
9. □ Begrippenlijst alphabetized, only terms that appear in book body
10. □ Formuleoverzicht emits one section per chapter, in order
11. □ Page breaks between all book sections and before each chapter
12. □ No answer booklet merged in (antwoorden blijven op de website)
13. □ PDF produced via WeasyPrint (with headless-Chrome fallback)
14. □ **Blocking gate**: 0 missing assets, 0 missing chapters before writing PDF

---

## PART 7: RUN

```bash
# From the 4veco-platform root
python build-scripts/books/build-book.py --book 1

# Optional: override locations
python build-scripts/books/build-book.py --book 1 \
    --lessen-root "../4veco-lessen" \
    --platform-root "."
```

The output lands in `<lessen-root>/Boek 1 - [title]/`. Open the PDF and walk through: cover → colofon → voorwoord → inhoud → Hoofdstuk 1 opener → paragraph body … → Hoofdstuk N → begrippenlijst → formuleoverzicht.

---

*This skill assembles books. For chapter assembly, see `econ-chapter-assembler`. For paragraph content, see `econ-textbook-paragraph`. For PDF pipeline details, see `econ-pdf-builder`.*
