---
name: econ-chapter-assembler
description: "Assembles individual textbook paragraphs and consolidation exercises into a complete chapter PDF with a front page. The front page contains the chapter title, table of contents, lesson goals, and a short introduction. Use this skill when the user wants to combine paragraphs into a chapter, create a chapter PDF, build a hoofdstuk, or assemble lesmateriaal into a single document. Trigger when the user mentions hoofdstuk samenstellen, chapter assembler, paragrafen samenvoegen, or chapter PDF. Always use in combination with econ-pdf-builder (styling/export) and the paragraph/consolidation output files."
---

# Economics Chapter Assembler

Assembles completed paragraph markdown files and consolidation exercises into a single chapter PDF with a front page. This skill does not create content — it wraps existing output from `econ-textbook-paragraph` and `econ-consolidation-builder` into one document.

**Companion skills:**
- `econ-textbook-paragraph` → provides `X.Y.Z [Name] – paragraaf.md` + `_assets/` per theory paragraph
- `econ-consolidation-builder` → provides `X.Y.Z [Name] – opgaven.md` + `_assets/` for the consolidation paragraph
- `econ-pdf-builder` → styling and PDF export pipeline
- `econ-exercise-builder` → provides `X.Y.Z [Name] – antwoorden.md` per paragraph (assembled separately as answer booklet)

---

## PART 1: CHAPTER STRUCTURE

### 1.1 What goes in a chapter

```
┌─────────────────────────────────────────────┐
│ FRONT PAGE (1 page)                         │
│   Chapter number and title                  │
│   Table of contents (paragraph titles)      │
│   Lesson goals (all paragraphs combined)    │
│   Short introduction (3–5 sentences)        │
├─────────────────────────────────────────────┤
│ §X.Y.1 — Theory paragraph 1                │
│   (from X.Y.1 – paragraaf.md)               │
├─────────────────────────────────────────────┤
│ §X.Y.2 — Theory paragraph 2                │
│   (from X.Y.2 – paragraaf.md)               │
├─────────────────────────────────────────────┤
│ §X.Y.3 — Theory paragraph 3                │
│   (from X.Y.3 – paragraaf.md)               │
├─────────────────────────────────────────────┤
│ §X.Y.4 — Consolidatie                       │
│   (from X.Y.4 – opgaven.md)                 │
└─────────────────────────────────────────────┘
```

Exception: Book 1 Chapter 4 has 4 theory paragraphs + consolidation (§1.4.1–§1.4.5).

### 1.2 What does NOT go in the chapter PDF

- Answer models → assembled separately as an answer booklet
- Begeleide inoefening → separate documents per paragraph
- Test preparation → Chapter 5 is its own document
- Difficulty ratings, time estimates → teacher-facing, never in student output

---

## PART 2: FRONT PAGE DESIGN

### 2.1 Content

The front page contains exactly four elements, in this order:

**1. Chapter header**
```
Hoofdstuk X — [Title]
```

**2. Inhoudsopgave (table of contents)**
```
§X.Y.1  [Paragraph 1 title]
§X.Y.2  [Paragraph 2 title]
§X.Y.3  [Paragraph 3 title]
§X.Y.4  Consolidatie / Gemengde opgaven
```

**3. Leerdoelen (lesson goals)**

All lesson goals from all theory paragraphs in the chapter, combined into a single list. Drawn from the blueprint paragraph specs. Deduplicate if goals overlap across paragraphs.

Format:
```
Na dit hoofdstuk kun je:
• [goal from §1]
• [goal from §1]
• [goal from §2]
• ...
```

**4. Introductie (catchy headline + short description)**

A short, engaging heading that hooks the student (question or provocative statement), followed by 3–5 sentences describing what the student will learn and why it matters. Problem-first: start with a question or situation, then explain what tools this chapter provides. Connect to what came before if this is not the first chapter.

Example:
```
## Waarom koop jij niet vijf broodjes?

Waarom koop je drie broodjes bij de bakker, maar niet vijf? En 
waarom koopt iedereen ineens meer boter als margarine in het nieuws 
komt? In dit hoofdstuk leer je hoe consumenten hun koopbeslissing 
nemen op basis van betalingsbereidheid, welke factoren de vraag 
beïnvloeden, en hoe je individuele vraaglijnen samenvoegt tot een 
collectieve vraaglijn.
```

### 2.2 Front page as raw HTML

The front page is written as **raw HTML** (not markdown), wrapped in a `<div class="chapter-front">`. This prevents Pandoc and the exercise-wrapping step from breaking the front page structure.

```html
<div class="chapter-front">

<h1>Hoofdstuk X — [Title]</h1>

<h2>Inhoud</h2>

<table>
<thead><tr><th>§</th><th>Onderwerp</th></tr></thead>
<tbody>
<tr><td>X.Y.1</td><td>[Paragraph 1 title]</td></tr>
<tr><td>X.Y.2</td><td>[Paragraph 2 title]</td></tr>
<tr><td>X.Y.3</td><td>[Paragraph 3 title]</td></tr>
<tr><td>X.Y.4</td><td>Consolidatie</td></tr>
</tbody>
</table>

<h2>Leerdoelen</h2>

<p>Na dit hoofdstuk kun je:</p>

<ul>
<li>[goal 1]</li>
<li>[goal 2]</li>
<li>[goal 3]</li>
</ul>

<h2>[Catchy headline — question or hook]</h2>

<p>[3–5 sentences, problem-first]</p>

</div>
```

**Why raw HTML?** The `wrap_exercises` function inserts `</div>` before every `<h2>` to control page breaks around exercises. If the front page were markdown, Pandoc converts it to `<h2>` tags that get split apart. Raw HTML inside a `.chapter-front` div stays intact when exercise wrapping is applied only to content *after* the front page div.

### 2.3 Front page styling

The front page uses the same base font size (11pt) as the rest of the document. Do not shrink fonts to fit — adjust margins and spacing instead. All four elements must fit on one page.

```css
/* Front page: chapter title prominent */
.chapter-front h1 {
  font-size: 24pt;
  color: #1A5276;
  border-bottom: 3px solid #1A5276;
  padding-bottom: 8px;
  margin-top: 0;
  margin-bottom: 14px;
}

/* Force front page to be exactly one page */
.chapter-front { break-after: page; }

.chapter-front p {
  font-size: 11pt;
  line-height: 1.4;
  margin: 0 0 8pt 0;
}

.chapter-front h2 {
  font-size: 14pt;
  margin-top: 14pt;
  margin-bottom: 6pt;
  padding-bottom: 4pt;
}

.chapter-front ul {
  font-size: 11pt;
  line-height: 1.35;
  margin: 0 0 8pt 0;
}

.chapter-front li {
  margin-bottom: 2pt;
}
```

---

## PART 3: ASSEMBLY PROCESS

### 3.1 Input files

The assembler expects paragraph folders **inside** the chapter folder:

```
X.Y Hoofdstuk [Name]/                              ← chapter folder (this is where build_chapter.py lives)
  X.Y.1 [Name]/X.Y.1 [Name] – paragraaf.md    + _assets/
  X.Y.2 [Name]/X.Y.2 [Name] – paragraaf.md    + _assets/
  X.Y.3 [Name]/X.Y.3 [Name] – paragraaf.md    + _assets/
  X.Y.4 [Name]/X.Y.4 [Name] – opgaven.md      + _assets/   (consolidation)
```

In `build_chapter.py`, use `MODULE = BASE` (not `BASE.parent`) since paragraphs are in the same directory.

Plus the blueprint paragraph specs for lesson goals and titles.

### 3.2 Assembly steps

```
1. Generate front page as raw HTML (see §2.2)
   (chapter title, table of contents, lesson goals, catchy intro)

2. Concatenate: front_page_html + page-break + §X.Y.1 paragraaf.md
   + page-break + §X.Y.2 paragraaf.md + page-break + §X.Y.3 paragraaf.md
   + page-break + §X.Y.4 opgaven.md (consolidation)

3. Rewrite asset paths in each paragraph:
   Replace paragraph-local paths (assets/ or _assets/) with _assets/

4. Collect all assets into a single _assets/ folder

5. Export to PDF:
   a. Embed images as base64 PNG
   b. Pandoc markdown → HTML5 (--standalone)
   c. Strip Pandoc default stylesheet (it conflicts with our CSS)
   d. Wrap exercises in divs — only AFTER the .chapter-front div
   e. Inject our CSS (base + front page styling)
   f. WeasyPrint → PDF
```

**Critical: exercise wrapping must skip the front page.** The `wrap_exercises` function inserts `</div>` before every `<h2>/<h3>`. If it runs on the front page HTML, it breaks the `.chapter-front` div. Split the HTML at the closing `</div>` of `.chapter-front` and only run exercise wrapping on the content after it.

### 3.3 Page break insertion

Insert a `<div style="break-before: page;"></div>` before each paragraph's content during concatenation:

```python
for paragraph in paragraphs:
    md = read_and_rewrite_assets(paragraph)
    parts.append(f'\n<div style="break-before: page;"></div>\n\n{md}')
```

### 3.4 Asset collection

All paragraph assets are already namespaced (e.g., `1.2.1_fig_1.png`, `1.2.3_ex_2.png`), so no renaming is needed. Collect into a single `_assets/` folder:

```python
import shutil, glob

def collect_assets(chapter_dir, output_dir):
    """Collect all paragraph assets into one folder."""
    os.makedirs(f"{output_dir}/_assets", exist_ok=True)
    for asset in sorted(glob.glob(f"{chapter_dir}/*/_assets/*")):
        shutil.copy(asset, f"{output_dir}/_assets/")
```

---

## PART 4: ANSWER BOOKLET

### 4.1 Separate document

Answers are assembled into a separate PDF — never mixed into the chapter PDF. Students get the chapter PDF; the answer booklet is for self-checking or teacher use.

### 4.2 Answer booklet structure

```
# Antwoorden Hoofdstuk X — [Title]

## §X.Y.1 — [Paragraph 1 title]
[contents of X.Y.1 – antwoorden.md]

## §X.Y.2 — [Paragraph 2 title]
[contents of X.Y.2 – antwoorden.md]

## §X.Y.3 — [Paragraph 3 title]
[contents of X.Y.3 – antwoorden.md]

## §X.Y.4 — Consolidatie
[contents of X.Y.4 – antwoorden.md]
```

### 4.3 Assembly

Same process as the chapter PDF: concatenate answer files, insert page breaks, export via `econ-pdf-builder`.

---

## PART 5: FILE OUTPUT

### 5.1 Output files

Saved to `<output-folder>/X.Y Hoofdstuk [Name]/` (e.g., `1.2 Hoofdstuk Vraag en aanbod/`):

| File | Contents |
|------|----------|
| `X.Y [Name] – hoofdstuk.md` | Combined markdown (front page HTML + all paragraphs) |
| `X.Y [Name] – hoofdstuk.html` | Intermediate HTML (for debugging/inspection) |
| `X.Y [Name] – hoofdstuk.pdf` | Final chapter PDF for students |
| `X.Y [Name] – antwoorden.md` | Combined answer booklet markdown |
| `X.Y [Name] – antwoorden.html` | Intermediate HTML |
| `X.Y [Name] – antwoorden.pdf` | Answer booklet PDF |
| `_assets/` | All graphs and diagrams from all paragraphs |
| `build_chapter.py` | Reproducible build script (chapter-specific) |

File naming: use en-dash (–), not hyphen (-). See `econ-textbook-paragraph` §1.3 for the full convention.

### 5.2 File naming for books

When chapters are later assembled into books, the chapter files follow:

```
<output-folder>/1.1 Hoofdstuk [Name]/1.1 [Name] – hoofdstuk.pdf
<output-folder>/1.2 Hoofdstuk [Name]/1.2 [Name] – hoofdstuk.pdf
<output-folder>/1.3 Hoofdstuk [Name]/1.3 [Name] – hoofdstuk.pdf
<output-folder>/1.4 Hoofdstuk [Name]/1.4 [Name] – hoofdstuk.pdf
<output-folder>/1.5 Hoofdstuk [Name]/   (Chapter 5 — test preparation, separate skill)
```

---

## DECISION CHECKLIST

1. □ All paragraph markdown files exist (§1, §2, §3, §4/consolidation)
2. □ **Asset completeness verified per paragraph:**
  - 2a. □ For each paragraph: extract all image refs from `.md` files → verify each file exists in the paragraph's `_assets/`
  - 2b. □ After collecting into chapter `_assets/`: re-verify all refs in the assembled chapter `.md` resolve against chapter `_assets/`
3. □ Front page written as raw HTML in `<div class="chapter-front">`
4. □ Front page order: title → table of contents → lesson goals → introduction with catchy headline
5. □ Front page fits on one page at 11pt (same font size as body text)
6. □ Lesson goals drawn from blueprint — no new goals invented
7. □ Introduction has engaging headline (question or hook), connects to prior chapter if applicable
8. □ Page breaks inserted before each paragraph header
9. □ Pandoc default stylesheet stripped before injecting custom CSS
10. □ Exercise wrapping applied only after `.chapter-front` div (not inside it)
11. □ No difficulty ratings, time estimates, or teacher-facing metadata
12. □ Answer booklet assembled separately
13. □ PDF exported via WeasyPrint (with `@page` support for footers and page counters)
14. □ Visual check: front page fits on one page, no orphaned headers, exercises intact
15. □ **BLOCKING GATE: Do not generate PDF until 0 asset errors. A chapter with missing images is not a chapter.**

---

*This skill assembles chapters. For paragraph content, see `econ-textbook-paragraph`. For consolidation content, see `econ-consolidation-builder`. For PDF export, see `econ-pdf-builder`.*
