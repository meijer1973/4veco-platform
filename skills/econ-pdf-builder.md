---
name: econ-pdf-builder
description: "Converts markdown lesson materials to professionally styled PDF documents for economics education. Handles image embedding (base64), page break management, exercise wrapping, consistent CSS styling with domain colours, and the full pandoc + weasyprint pipeline. Use this skill whenever exporting any economics material (textbook paragraphs, tests, consolidation exercises, answer models) to PDF. Trigger when the user mentions PDF, exporteren, afdrukken, printen, or any request to produce a downloadable/printable version of lesson material. Always use in combination with the relevant content skill (econ-textbook-paragraph, econ-exercise-builder, etc.)."
---

# Economics PDF Builder

Converts markdown lesson materials to professionally styled, print-ready PDF documents. This skill handles the technical pipeline and styling — not the content. For content, see the relevant product skill.

---

## PART 1: PIPELINE OVERVIEW

```
paragraph.md (with ![](assets/file.svg) references)
      │
      ▼
  1. Embed images as base64 PNG into markdown
      │
      ▼
  2. Pandoc: markdown → standalone HTML5
     ⚠️ Do NOT use --metadata title (causes duplicate header)
      │
      ▼
  3. Post-process HTML:
     a. Wrap exercises in <div class="exercise">
     b. Inject CSS (styling + page breaks)
      │
      ▼
  4. Weasyprint: HTML → PDF
      │
      ▼
  paragraph.pdf
```

---

## PART 2: IMAGE EMBEDDING

### 2.1 Why base64?

Weasyprint resolves image paths relative to the HTML file or base_url. When generating HTML from pandoc in memory, relative paths break. Embedding images as base64 data URIs makes the HTML self-contained and avoids path issues.

### 2.2 SVG → PNG swap

Weasyprint handles PNG more reliably than SVG. Always swap `.svg` references to `.png` before embedding. The `economic-graph` skill already generates both formats.

### 2.3 Implementation

```python
import base64, re, os

def embed_images(md, asset_dir):
    """Replace image references with base64-embedded PNGs."""
    def replacer(match):
        alt = match.group(1)
        path = match.group(2).replace(".svg", ".png")
        full = os.path.join(asset_dir, os.path.basename(path))
        if os.path.exists(full):
            b64 = base64.b64encode(open(full, "rb").read()).decode()
            return f'![{alt}](data:image/png;base64,{b64})'
        return match.group(0)  # keep original if file missing
    return re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', replacer, md)
```

---

## PART 3: PANDOC CONVERSION

### 3.1 Command

```python
import subprocess

result = subprocess.run(
    ["pandoc", "--from=markdown", "--to=html5", "--standalone"],
    input=md_with_embedded_images,
    capture_output=True, text=True
)
html = result.stdout
```

### 3.2 Critical: no --metadata title

**Never use `--metadata title="..."`** when the markdown already has an `# H1` header. Pandoc generates a `<header id="title-block-header"><h1>` from the metadata AND renders the markdown `#` as a second `<h1>`. This produces a duplicate title in the PDF.

If pandoc warns about a missing title, ignore the warning — it only affects the HTML `<title>` tag which is invisible in PDF.

---

## PART 4: HTML POST-PROCESSING

### 4.1 Wrap exercises for page break control

Exercises in the markdown are just `**Opgave X**` paragraphs. Weasyprint cannot keep them together without a wrapping element. Wrap each exercise in a `<div class="exercise">`:

```python
import re

def wrap_exercises(html):
    """Wrap each Opgave block in a div for page-break control."""
    html = re.sub(
        r'<p><strong>(Opgave \d+)',
        r'</div><div class="exercise"><p><strong>\1',
        html
    )
    # Clean up the first stray </div>
    html = html.replace('</div><div class="exercise">',
                        '<div class="exercise">', 1)
    # Close last exercise div before next section header
    html = re.sub(r'(<h[23])', r'</div>\1', html)
    return html
```

### 4.2 Inject CSS

Insert the stylesheet before `</head>`. See Part 5 for the full CSS.

```python
html = html.replace("</head>", CSS_BLOCK + "</head>")
```

---

## PART 5: CSS STYLESHEET

```css
@page {
  size: A4;
  margin: 2.5cm;
}

body {
  font-family: 'DejaVu Sans', Arial, sans-serif;
  font-size: 11pt;
  line-height: 1.5;
  color: #2D3748;
  max-width: 100%;
}

/* === HEADINGS === */
h1 {
  font-size: 18pt;
  color: #1A5276;
  border-bottom: 2px solid #1A5276;
  padding-bottom: 6px;
  break-after: avoid;
}

h2 {
  font-size: 14pt;
  color: #1A5276;
  margin-top: 24px;
  break-after: avoid;
}

h3 {
  font-size: 12pt;
  color: #2D3748;
  margin-top: 18px;
  break-after: avoid;
}

/* Keep first paragraph with its heading */
h1 + p, h2 + p, h3 + p {
  break-before: avoid;
}

/* Orphan/widow control */
h1, h2, h3 {
  orphans: 3;
  widows: 3;
}

/* === DEFINITION / FORMULA / WARNING BOXES === */
blockquote {
  background: #F0F4F8;
  border-left: 4px solid #1A5276;
  padding: 12px 16px;
  margin: 16px 0;
  font-size: 10.5pt;
  break-inside: avoid;
}

blockquote strong:first-child {
  color: #1A5276;
}

/* === TABLES === */
table {
  border-collapse: collapse;
  width: 100%;
  margin: 12px 0;
  font-size: 10.5pt;
  break-inside: avoid;
}

th {
  background: #1A5276;
  color: white;
  padding: 8px 12px;
  text-align: left;
}

td {
  border: 1px solid #CBD5E0;
  padding: 6px 12px;
}

tr:nth-child(even) {
  background: #F7FAFC;
}

/* === IMAGES === */
img {
  max-width: 85%;
  display: block;
  margin: 16px auto;
  break-inside: avoid;
}

/* Keep images with their preceding paragraph */
p + figure, p + p > img {
  break-before: avoid;
}

/* === EXERCISES === */
.exercise {
  break-inside: avoid;
}

/* === MISC === */
code {
  background: #EDF2F7;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10pt;
}

hr {
  border: none;
  border-top: 1px solid #CBD5E0;
  margin: 24px 0;
}

em {
  color: #4A5568;
}
```

### 5.1 Domain colour reference

The CSS uses the economics domain colour scheme:

| Element | Colour | Hex |
|---------|--------|-----|
| Headings, blockquote borders, table headers | Blue (domain D) | `#1A5276` |
| Body text, axes, labels | Dark charcoal | `#2D3748` |
| Italic / secondary text | Gray | `#4A5568` |
| Table even rows | Light gray | `#F7FAFC` |
| Blockquote background | Light blue-gray | `#F0F4F8` |
| Code background | Lighter gray | `#EDF2F7` |
| Table cell borders | Medium gray | `#CBD5E0` |
| HR lines | Medium gray | `#CBD5E0` |

### 5.2 Page break rules explained

| Rule | What it prevents |
|------|------------------|
| `h1, h2, h3 { break-after: avoid }` | Heading orphaned at bottom of page |
| `h2 + p { break-before: avoid }` | Empty section: heading on page 1, content on page 2 |
| `.exercise { break-inside: avoid }` | Exercise title on one page, content on the next |
| `blockquote { break-inside: avoid }` | Definition/formula box split across pages |
| `table { break-inside: avoid }` | Table split across pages |
| `orphans: 3; widows: 3` | Fewer than 3 lines left behind or carried forward |

**Limitation:** if a single exercise or table is longer than a full page, `break-inside: avoid` is ignored by the renderer. This is correct behaviour — it must break somewhere.

---

## PART 6: WEASYPRINT CONVERSION

```python
import weasyprint

weasyprint.HTML(string=html).write_pdf(output_path)
```

### 6.1 Installation

```bash
pip install weasyprint --break-system-packages
```

### 6.2 Fallback

If weasyprint is not available:
```bash
# Generate HTML first, then convert
pandoc input.md -o output.html --standalone
# Manual: open HTML in browser, print to PDF
```

---

## PART 7: COMPLETE BUILD SCRIPT

```python
import base64, re, os, subprocess
from pathlib import Path
import weasyprint

def build_pdf(md_path, output_path, asset_dir=None):
    """Build a styled PDF from a markdown file with image assets."""
    
    if asset_dir is None:
        asset_dir = os.path.join(os.path.dirname(md_path), "assets")
    
    # 1. Read markdown
    md = Path(md_path).read_text()
    
    # 2. Embed images as base64 PNG
    def embed(match):
        alt, path = match.group(1), match.group(2).replace(".svg", ".png")
        full = os.path.join(asset_dir, os.path.basename(path))
        if os.path.exists(full):
            b64 = base64.b64encode(open(full, "rb").read()).decode()
            return f'![{alt}](data:image/png;base64,{b64})'
        return match.group(0)
    md = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', embed, md)
    
    # 3. Pandoc markdown → HTML (no --metadata title!)
    result = subprocess.run(
        ["pandoc", "--from=markdown", "--to=html5", "--standalone"],
        input=md, capture_output=True, text=True
    )
    html = result.stdout
    
    # 4. Wrap exercises in divs
    html = re.sub(
        r'<p><strong>(Opgave \d+)',
        r'</div><div class="exercise"><p><strong>\1',
        html
    )
    html = html.replace('</div><div class="exercise">',
                        '<div class="exercise">', 1)
    html = re.sub(r'(<h[23])', r'</div>\1', html)
    
    # 5. Inject CSS
    css = "<style>" + Path(__file__).parent.joinpath(
        "economics_pdf.css"  # or inline the CSS from Part 5
    ).read_text() + "</style>"
    # If using inline CSS, replace the above with the CSS string from Part 5
    html = html.replace("</head>", css + "</head>")
    
    # 6. Export PDF
    weasyprint.HTML(string=html).write_pdf(output_path)
    print(f"PDF created: {output_path}")

# Usage:
# build_pdf("paragraph.md", "paragraph.pdf", "assets/")
```

---

## PART 8: STUDENT-FACING RULES

Content that must NOT appear in student-facing PDF output:

- Difficulty ratings (⬜ LIGHT / 🟨 MEDIUM / 🟥 HEAVY) — these are teacher-facing blueprint metadata
- Time estimates per exercise (e.g., *Geschatte tijd: 4 minuten*) — teacher planning information
- Internal cross-references to blueprint codes (e.g., "B1C2§3") unless used as paragraph numbering
- Scaffold level annotations — students see "Begeleide inoefening", not "Scaffold level 3"

---

## DECISION CHECKLIST — BEFORE EXPORTING

1. □ All SVGs rasterised to PNG in assets/ (check with `ls assets/*.png`)
2. □ No `--metadata title` in pandoc command
3. □ No difficulty ratings or time estimates in the markdown
4. □ All image references resolve (every `![...](assets/...)` has a matching file)
5. □ CSS injected with page break rules
6. □ Exercises wrapped in `<div class="exercise">`
7. □ Visual check: no orphaned headers, no split exercises, no broken tables

---

*This skill handles PDF export. For content creation, see the relevant product skill (econ-textbook-paragraph, econ-exercise-builder). For graph generation, see economic-graph.*
