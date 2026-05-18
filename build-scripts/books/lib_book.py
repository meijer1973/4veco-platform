"""
Book assembly library: stitches chapter markdown + front/back matter + assets
into a single book PDF.

Does NOT rebuild chapters. Requires that every chapter referenced in the manifest
has already been assembled via econ-chapter-assembler (hoofdstuk.md + _assets/).

See skills/econ-book-builder.md for the design.
"""
from __future__ import annotations

import base64
import json
import os
import re
import shutil
import subprocess
import sys
from html import escape as html_escape
from html.parser import HTMLParser
from pathlib import Path

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
BOOK_CONTENT_START = "<!-- BOOK-CONTENT-START -->"
BOOK_CONTENT_END = "<!-- BOOK-CONTENT-END -->"

# ---------------------------------------------------------------------------
# Manifest loading + validation
# ---------------------------------------------------------------------------
def load_manifest(path: Path) -> dict:
    with path.open(encoding="utf-8") as f:
        manifest = json.load(f)

    for key in ("book", "chapters", "colofon"):
        if key not in manifest:
            raise ValueError(f"Manifest missing '{key}'")
    for k in ("nr", "title", "edition", "year"):
        if k not in manifest["book"]:
            raise ValueError(f"Manifest missing book.{k}")
    for k in ("jaar", "licentie"):
        if k not in manifest["colofon"]:
            raise ValueError(f"Manifest missing colofon.{k}")
    if not isinstance(manifest["chapters"], list) or not manifest["chapters"]:
        raise ValueError("Manifest 'chapters' must be a non-empty list")
    for chapter in manifest["chapters"]:
        if isinstance(chapter, str):
            continue
        if not isinstance(chapter, dict):
            raise ValueError("Manifest chapters must be strings or objects")
        if "nr" not in chapter:
            raise ValueError("Manifest chapter object missing 'nr'")
        mode = chapter.get("mode", "assembled")
        if mode not in ("assembled", "composed"):
            raise ValueError(f"Unsupported chapter mode for {chapter['nr']}: {mode}")
        if mode == "composed":
            if not chapter.get("title"):
                raise ValueError(f"Composed chapter {chapter['nr']} missing title")
            if not isinstance(chapter.get("paragraphs"), list) or not chapter["paragraphs"]:
                raise ValueError(f"Composed chapter {chapter['nr']} missing paragraphs")
    return manifest

# ---------------------------------------------------------------------------
# Chapter location
# ---------------------------------------------------------------------------
def find_chapter_folder(book_dir: Path, chapter_nr: str) -> Path:
    candidates = sorted(book_dir.glob(f"{chapter_nr} Hoofdstuk *"))
    if not candidates:
        raise FileNotFoundError(
            f"Chapter {chapter_nr} not found in {book_dir}.\n"
            f"Chapters for this book are expected at "
            f"<lessen-root>/Boek N - <title>/<chapter_nr> Hoofdstuk <name>/. "
            f"Run econ-chapter-builder for {chapter_nr} first "
            f"(or econ-testprep-builder + econ-chapter-assembler for a Chapter 5)."
        )
    if len(candidates) > 1:
        raise ValueError(
            f"Multiple chapter folders match {chapter_nr}: "
            f"{[str(c.name) for c in candidates]}"
        )
    return candidates[0]

def find_chapter_md(chapter_dir: Path) -> Path:
    candidates = [p for p in chapter_dir.glob("* – hoofdstuk.md")]
    if not candidates:
        raise FileNotFoundError(
            f"No 'hoofdstuk.md' in {chapter_dir}.\n"
            f"Run econ-chapter-assembler for this chapter first."
        )
    if len(candidates) > 1:
        raise ValueError(f"Multiple hoofdstuk.md in {chapter_dir}")
    return candidates[0]

def find_single_file(folder: Path, suffix: str) -> Path:
    candidates = sorted(p for p in folder.glob(f"*{suffix}") if p.is_file())
    if not candidates:
        raise FileNotFoundError(f"No '*{suffix}' file found in {folder}")
    if len(candidates) > 1:
        raise ValueError(f"Multiple '*{suffix}' files found in {folder}")
    return candidates[0]

def write_text_lf(path: Path, text: str) -> None:
    normalized = text.replace("\r\n", "\n").replace("\r", "\n")
    normalized = "\n".join(line.rstrip() for line in normalized.split("\n"))
    with path.open("w", encoding="utf-8", newline="\n") as f:
        f.write(normalized)

def strip_first_h1(md_text: str) -> str:
    lines = md_text.splitlines()
    for idx, line in enumerate(lines):
        if not line.strip():
            continue
        if line.startswith("# "):
            return "\n".join(lines[:idx] + lines[idx + 1:]).strip()
        return md_text.strip()
    return md_text.strip()

def renumber_visible_refs(md_text: str, source_nr: str, target_nr: str) -> str:
    """Renumber visible paragraph references without rewriting asset filenames."""
    if not source_nr or source_nr == target_nr:
        return md_text
    pattern = re.compile(rf"(?<!_assets/)\b{re.escape(source_nr)}\b")
    return pattern.sub(target_nr, md_text)

def apply_visible_renumbering(md_text: str, renumber_map: dict[str, str]) -> str:
    result = md_text
    for source_nr in sorted(renumber_map, key=len, reverse=True):
        result = renumber_visible_refs(result, source_nr, renumber_map[source_nr])
    return result

def apply_text_replacements(md_text: str, replacements: dict[str, str]) -> str:
    result = md_text
    for old, new in replacements.items():
        result = result.replace(old, new)
    return result

def apply_text_removals(md_text: str, removals: list[dict]) -> str:
    result = md_text
    for removal in removals:
        start = removal.get("start")
        end = removal.get("end")
        if not start:
            continue
        start_idx = result.find(start)
        if start_idx < 0:
            raise ValueError(f"Configured print removal start not found: {start}")
        if end:
            end_idx = result.find(end, start_idx + len(start))
            if end_idx < 0:
                raise ValueError(f"Configured print removal end not found after {start}: {end}")
            if removal.get("include_end", True):
                end_idx += len(end)
        else:
            end_idx = start_idx + len(start)
        result = result[:start_idx].rstrip() + "\n\n" + result[end_idx:].lstrip()
    return result

def render_composed_chapter_front_html(chapter_spec: dict) -> str:
    chapter_nr = str(chapter_spec["nr"])
    chapter_label = chapter_spec.get("chapter_label") or chapter_nr.split(".")[-1]
    title = chapter_spec["title"]
    rows = []
    for paragraph in chapter_spec.get("paragraphs", []):
        nr = paragraph["nr"]
        p_title = paragraph["title"]
        rows.append(f"<tr><td>{html_escape(nr)}</td><td>{html_escape(p_title)}</td></tr>")
    goals = "\n".join(
        f"<li>{html_escape(goal)}</li>"
        for goal in chapter_spec.get("learning_goals", [])
    )
    intro_title = chapter_spec.get("intro_title", title)
    intro_text = chapter_spec.get("intro_text", "")
    return f"""<div class="chapter-front">

<h1>Hoofdstuk {html_escape(str(chapter_label))} - {html_escape(title)}</h1>

<h2>Inhoud</h2>

<table>
<thead><tr><th>§</th><th>Onderwerp</th></tr></thead>
<tbody>
{chr(10).join(rows)}
</tbody>
</table>

<h2>Leerdoelen</h2>

<p>Na dit hoofdstuk kun je:</p>

<ul>
{goals}
</ul>

<h2>{html_escape(intro_title)}</h2>

<p>{html_escape(intro_text)}</p>

</div>
"""

def load_composed_paragraph_md(paragraph_spec: dict, book_output_dir: Path, platform_root: Path) -> tuple[str, list[Path]]:
    target_nr = paragraph_spec["nr"]
    title = paragraph_spec["title"]
    asset_sources: list[Path] = []

    if paragraph_spec.get("source_md"):
        source_md = platform_root / paragraph_spec["source_md"]
        if not source_md.exists():
            raise FileNotFoundError(f"Composed paragraph source not found: {source_md}")
        return source_md.read_text(encoding="utf-8"), asset_sources

    source_dir = book_output_dir / paragraph_spec["source_dir"]
    if not source_dir.is_dir():
        raise FileNotFoundError(f"Composed paragraph source folder not found: {source_dir}")
    asset_sources.append(source_dir)

    source_nr = paragraph_spec.get("source_nr", target_nr)
    renumber_map = paragraph_spec.get("renumber_refs") or {source_nr: target_nr}
    text_replacements = paragraph_spec.get("text_replacements") or {}
    text_removals = paragraph_spec.get("text_removals") or []
    include = paragraph_spec.get("include", ["paragraaf", "opgaven"])
    parts: list[str] = []

    if "paragraaf" in include:
        paragraaf = find_single_file(source_dir, "paragraaf.md")
        text = paragraaf.read_text(encoding="utf-8")
        text = apply_visible_renumbering(text, renumber_map)
        text = apply_text_replacements(text, text_replacements)
        text = apply_text_removals(text, text_removals)
        parts.append(text.strip())

    if "opgaven" in include:
        opgaven = find_single_file(source_dir, "opgaven.md")
        text = strip_first_h1(opgaven.read_text(encoding="utf-8"))
        text = apply_visible_renumbering(text, renumber_map)
        text = apply_text_replacements(text, text_replacements)
        text = apply_text_removals(text, text_removals)
        parts.append(f"## Opgaven\n\n{text}".strip())

    if not parts:
        raise ValueError(f"Composed paragraph {target_nr} has no included content")

    if not parts[0].lstrip().startswith("# "):
        parts.insert(0, f"# {target_nr} {title}")

    return "\n\n".join(parts), asset_sources

def compose_chapter_md(chapter_spec: dict, book_output_dir: Path, platform_root: Path) -> tuple[str, list[Path], str]:
    front = render_composed_chapter_front_html(chapter_spec)
    body_parts = [front]
    asset_sources: list[Path] = []
    for paragraph in chapter_spec.get("paragraphs", []):
        paragraph_md, paragraph_assets = load_composed_paragraph_md(paragraph, book_output_dir, platform_root)
        body_parts.append('<div style="break-before: page;"></div>')
        body_parts.append(paragraph_md)
        asset_sources.extend(paragraph_assets)
    return "\n\n".join(body_parts), asset_sources, chapter_spec["title"]

# ---------------------------------------------------------------------------
# Front matter (raw HTML)
# ---------------------------------------------------------------------------
def render_cover_html(book: dict) -> str:
    return (
        '<div class="book-cover">\n'
        '<div class="book-cover-inner">\n'
        f'<h1 class="book-title">{html_escape(book["title"])}</h1>\n'
        f'<p class="book-edition">{html_escape(book["edition"])} · {book["year"]}</p>\n'
        '</div>\n'
        '</div>'
    )

def render_colofon_html(book: dict, colofon: dict) -> str:
    return (
        '<div class="book-colofon">\n'
        '<p class="book-section-title">Colofon</p>\n'
        f'<p><strong>Titel:</strong> {html_escape(book["title"])}</p>\n'
        f'<p><strong>Editie:</strong> {html_escape(book["edition"])}, {colofon["jaar"]}</p>\n'
        f'<p><strong>Licentie:</strong> {html_escape(colofon["licentie"])}</p>\n'
        '<p class="book-colofon-note">Antwoorden en interactieve oefeningen vind '
        'je op de begeleidende website.</p>\n'
        '</div>'
    )

def render_voorwoord_html(voorwoord_md_path: Path) -> str:
    if not voorwoord_md_path.exists():
        print(f"  Warning: voorwoord not found at {voorwoord_md_path} — using placeholder",
              file=sys.stderr)
        return (
            '<div class="book-voorwoord">\n'
            '<h1>Voorwoord</h1>\n'
            '<p><em>Voorwoord nog niet geschreven.</em></p>\n'
            '</div>'
        )
    md = voorwoord_md_path.read_text(encoding="utf-8")
    result = subprocess.run(
        ["pandoc", "--from=markdown", "--to=html5"],
        input=md.encode("utf-8"),
        capture_output=True,
    )
    if result.returncode != 0:
        raise RuntimeError(f"Pandoc failed on voorwoord: {result.stderr.decode()}")
    inner = result.stdout.decode("utf-8")
    return f'<div class="book-voorwoord">\n{inner}\n</div>'

def render_toc_html(toc_entries: list[dict]) -> str:
    parts = [
        '<div class="book-toc">',
        '<h1>Inhoudsopgave</h1>',
        '<table class="toc-table">',
        '<tbody>',
    ]
    for entry in toc_entries:
        parts.append(
            f'<tr class="toc-chapter"><td class="toc-nr">Hoofdstuk {html_escape(entry["chapter_nr"])}</td>'
            f'<td class="toc-title">{html_escape(entry["chapter_title"])}</td></tr>'
        )
        for p in entry.get("paragraphs", []):
            parts.append(
                f'<tr class="toc-paragraph"><td class="toc-nr">§{html_escape(p["nr"])}</td>'
                f'<td class="toc-title">{html_escape(p["title"])}</td></tr>'
            )
    parts.append('</tbody></table></div>')
    return "\n".join(parts)

# ---------------------------------------------------------------------------
# TOC extraction from chapter hoofdstuk.md
# ---------------------------------------------------------------------------
H1_CHAPTER_RE = re.compile(r"<h1>Hoofdstuk\s+\d+(?:\.\d+)?\s+[—-]\s+(.+?)</h1>")
TOC_ROW_RE = re.compile(r"<tr>\s*<td>\s*(\d+\.\d+\.\d+)\s*</td>\s*<td>\s*(.+?)\s*</td>\s*</tr>")

def extract_chapter_title(chapter_md_text: str, fallback: str) -> str:
    match = H1_CHAPTER_RE.search(chapter_md_text)
    return match.group(1).strip() if match else fallback

def extract_chapter_toc_rows(chapter_md_text: str) -> list[dict]:
    return [
        {"nr": nr, "title": title.strip()}
        for nr, title in TOC_ROW_RE.findall(chapter_md_text)
    ]

def build_toc_entries(chapter_pairs: list[tuple[str, Path, str, str]]) -> list[dict]:
    """chapter_pairs: [(chapter_nr, chapter_dir, hoofdstuk_md_text, fallback_title)]"""
    entries = []
    for chapter_nr, chapter_dir, md_text, fallback_title in chapter_pairs:
        title = extract_chapter_title(md_text, fallback=fallback_title)
        paragraphs = extract_chapter_toc_rows(md_text)
        entries.append({
            "chapter_nr": chapter_nr,
            "chapter_title": title,
            "paragraphs": paragraphs,
        })
    return entries

# ---------------------------------------------------------------------------
# Terminology: begrippenlijst driven by references/machine/begrippen.json
# ---------------------------------------------------------------------------
def load_begrippen(begrippen_json_path: Path) -> list[dict]:
    """Load the canonical term registry. Returns a list of live (non-deprecated)
    entries with the full schema preserved: id, term_nl, definition_nl, domain,
    abbreviation, synonyms_nl, formulas, syllabus_clause, etc."""
    with begrippen_json_path.open(encoding="utf-8") as f:
        data = json.load(f)
    entries = []
    for entry in data.get("terms", {}).values():
        if entry.get("deprecated"):
            continue
        entries.append(entry)
    return entries

def extract_begrippen(book_md_text: str, registry: list[dict]) -> list[dict]:
    """Return the subset of registry entries whose term_nl, abbreviation, or any
    synonym appears as a whole word in the book body. Sort alphabetically by
    term_nl (Dutch-collation safe)."""
    lowered_body = book_md_text.lower()
    matched: list[dict] = []
    seen_ids: set[str] = set()
    for entry in registry:
        term = entry.get("term_nl", "")
        if not term or len(term) < 3:
            continue
        if entry.get("id") in seen_ids:
            continue
        candidates = [term]
        abbrev = entry.get("abbreviation") or ""
        if abbrev and len(abbrev) >= 2:
            candidates.append(abbrev)
        for syn in entry.get("synonyms_nl") or []:
            if syn and len(syn) >= 3:
                candidates.append(syn)
        if any(_term_occurs(cand, lowered_body) for cand in candidates):
            seen_ids.add(entry["id"])
            matched.append(entry)
    matched.sort(key=lambda e: _sort_key(e["term_nl"]))
    return matched

def _term_occurs(term: str, lowered_body: str) -> bool:
    pattern = r"\b" + re.escape(term.lower()) + r"\b"
    return re.search(pattern, lowered_body) is not None

def _sort_key(s: str) -> str:
    return s.lower().replace("ë", "e").replace("ï", "i").replace("é", "e")

def render_begrippenlijst_html(begrippen: list[dict]) -> str:
    if not begrippen:
        return (
            '<div class="book-glossary">\n'
            '<h1>Begrippenlijst</h1>\n'
            '<p><em>Geen begrippen gevonden.</em></p>\n'
            '</div>'
        )
    parts = ['<div class="book-glossary">', '<h1>Begrippenlijst</h1>', '<dl>']
    for b in begrippen:
        term = html_escape(b["term_nl"])
        abbrev = (b.get("abbreviation") or "").strip()
        dt = f'<dt>{term}'
        if abbrev:
            dt += f' <span class="term-abbrev">({html_escape(abbrev)})</span>'
        dt += '</dt>'
        parts.append(dt)

        definition = (b.get("definition_nl") or "").strip()
        if definition:
            parts.append(f'<dd>{html_escape(definition)}</dd>')
        else:
            parts.append('<dd class="term-todo"><em>(definitie volgt)</em></dd>')

        formulas = b.get("formulas") or []
        if formulas:
            rendered = " &middot; ".join(f'<code>{html_escape(f)}</code>' for f in formulas)
            parts.append(f'<dd class="term-formula">{rendered}</dd>')
    parts.append('</dl></div>')
    return "\n".join(parts)

# ---------------------------------------------------------------------------
# Formuleoverzicht extraction
# ---------------------------------------------------------------------------
FORMULA_BLOCKQUOTE_RE = re.compile(
    r"^>\s*\*\*(Definitie|Formule|Procedure):\s*([^*]+?)\*\*",
    re.MULTILINE,
)

def extract_formules(chapter_md_text: str) -> list[dict]:
    results = []
    for match in FORMULA_BLOCKQUOTE_RE.finditer(chapter_md_text):
        kind = match.group(1)
        title = match.group(2).strip().rstrip(":").strip()
        results.append({"kind": kind, "title": title})
    return results

def render_formuleoverzicht_html(per_chapter: list[dict]) -> str:
    parts = ['<div class="book-formulas">', '<h1>Formule- en begripoverzicht</h1>']
    for entry in per_chapter:
        parts.append(
            f'<p class="book-formulas-chapter">Hoofdstuk {html_escape(entry["chapter_nr"])} '
            f'— {html_escape(entry["chapter_title"])}</p>'
        )
        items = entry["items"]
        if not items:
            parts.append('<p><em>Geen formules of definities gevonden.</em></p>')
            continue
        parts.append('<ul class="book-formula-list">')
        for item in items:
            kind = html_escape(item["kind"])
            title = html_escape(item["title"])
            parts.append(
                f'<li><span class="book-kind book-kind-{kind.lower()}">{kind}</span> {title}</li>'
            )
        parts.append('</ul>')
    parts.append('</div>')
    return "\n".join(parts)

# ---------------------------------------------------------------------------
# Asset handling
# ---------------------------------------------------------------------------
ASSET_REF_RE = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")

def rewrite_chapter_asset_paths(md: str) -> str:
    """Normalize image paths within chapter markdown to point to <book>/_assets/."""
    def repl(match):
        alt, path = match.group(1), match.group(2)
        if path.startswith(("http://", "https://", "data:")):
            return match.group(0)
        filename = os.path.basename(path)
        return f"![{alt}](_assets/{filename})"
    return ASSET_REF_RE.sub(repl, md)

def collect_assets(chapter_dirs: list[Path], book_assets_dir: Path) -> int:
    book_assets_dir.mkdir(parents=True, exist_ok=True)
    copied = 0
    for chapter_dir in chapter_dirs:
        src = chapter_dir / "_assets"
        if not src.is_dir():
            continue
        for asset in src.iterdir():
            if not asset.is_file():
                continue
            dest = book_assets_dir / asset.name
            if dest.exists():
                continue
            shutil.copy2(asset, dest)
            copied += 1
    return copied

def verify_asset_refs(book_md_text: str, book_assets_dir: Path) -> list[str]:
    """Return list of missing-asset filenames referenced by the book markdown."""
    missing = []
    for match in ASSET_REF_RE.finditer(book_md_text):
        path = match.group(2)
        if path.startswith(("http://", "https://", "data:")):
            continue
        filename = os.path.basename(path)
        # Both .svg and .png variants need checking — we'll swap .svg→.png at embed time
        png_candidate = book_assets_dir / filename.replace(".svg", ".png")
        if not png_candidate.exists() and not (book_assets_dir / filename).exists():
            missing.append(filename)
    return missing

# ---------------------------------------------------------------------------
# PDF build helpers (ported from build_chapter.py)
# ---------------------------------------------------------------------------
def embed_images(md: str, asset_dir: Path) -> str:
    def replacer(match):
        alt = match.group(1)
        path = match.group(2)
        if path.startswith(("http://", "https://", "data:")):
            return match.group(0)
        filename = os.path.basename(path).replace(".svg", ".png")
        full = asset_dir / filename
        if full.exists():
            b64 = base64.b64encode(full.read_bytes()).decode()
            return f"![{alt}](data:image/png;base64,{b64})"
        print(f"  Warning: missing {full}", file=sys.stderr)
        return match.group(0)
    return ASSET_REF_RE.sub(replacer, md)

def wrap_exercises_simple(html: str) -> str:
    html = re.sub(
        r"<p><strong>(Opgave \d+)",
        r'</div><div class="exercise"><p><strong>\1',
        html,
    )
    html = html.replace('</div><div class="exercise">', '<div class="exercise">', 1)
    html = re.sub(r"(<h[23])", r"</div>\1", html)
    return html

CHAPTER_FRONT_OPEN_RE = re.compile(r'<div class="chapter-front">')
DIV_TAG_RE = re.compile(r"<(/?)div\b[^>]*>")

def wrap_exercises_preserving_fronts(content_html: str) -> str:
    """Run wrap_exercises, but keep <div class="chapter-front">…</div> regions intact."""
    placeholders: dict[str, str] = {}
    out_parts: list[str] = []
    pos = 0
    while True:
        m = CHAPTER_FRONT_OPEN_RE.search(content_html, pos)
        if not m:
            out_parts.append(content_html[pos:])
            break
        out_parts.append(content_html[pos:m.start()])
        # Walk div tags to find the matching </div>
        depth = 1
        scan = m.end()
        while depth > 0:
            tag = DIV_TAG_RE.search(content_html, scan)
            if not tag:
                break
            if tag.group(1) == "/":
                depth -= 1
            else:
                depth += 1
            scan = tag.end()
        if depth != 0:
            # Malformed — bail out and keep remainder verbatim
            out_parts.append(content_html[m.start():])
            pos = len(content_html)
            break
        blob = content_html[m.start():scan]
        key = f"__CHAPTER_FRONT_PLACEHOLDER_{len(placeholders):04d}__"
        placeholders[key] = blob
        out_parts.append(key)
        pos = scan
    stripped = "".join(out_parts)
    wrapped = wrap_exercises_simple(stripped)
    for key, blob in placeholders.items():
        wrapped = wrapped.replace(key, blob)
    return wrapped

def wrap_exercises_in_book(html: str) -> str:
    """Only wrap exercises in the content region delimited by markers."""
    if BOOK_CONTENT_START not in html or BOOK_CONTENT_END not in html:
        # Fallback: wrap the whole document (defensive)
        return wrap_exercises_preserving_fronts(html)
    start = html.index(BOOK_CONTENT_START) + len(BOOK_CONTENT_START)
    end = html.index(BOOK_CONTENT_END)
    before = html[:start]
    middle = html[start:end]
    after = html[end:]
    return before + wrap_exercises_preserving_fronts(middle) + after

def rebalance_table_columns(html: str) -> str:
    class CellExtractor(HTMLParser):
        def __init__(self):
            super().__init__()
            self.tables: list[list[list[str]]] = []
            self.current_table: list[list[str]] | None = None
            self.current_row: list[str] | None = None
            self.current_cell: str | None = None
            self.in_cell = False

        def handle_starttag(self, tag, attrs):
            if tag == "table":
                self.current_table = []
            elif tag == "tr" and self.current_table is not None:
                self.current_row = []
            elif tag in ("td", "th") and self.current_row is not None:
                self.current_cell = ""
                self.in_cell = True

        def handle_endtag(self, tag):
            if tag in ("td", "th") and self.in_cell:
                self.current_row.append((self.current_cell or "").strip())
                self.current_cell = None
                self.in_cell = False
            elif tag == "tr" and self.current_row is not None:
                if self.current_row:
                    self.current_table.append(self.current_row)
                self.current_row = None
            elif tag == "table" and self.current_table is not None:
                self.tables.append(self.current_table)
                self.current_table = None

        def handle_data(self, data):
            if self.in_cell:
                self.current_cell = (self.current_cell or "") + data

    parser = CellExtractor()
    parser.feed(html)
    tables = list(re.finditer(r"<table[^>]*>.*?</table>", html, re.DOTALL))
    if len(tables) != len(parser.tables):
        return html
    offset = 0
    modified = 0
    for match, cells in zip(tables, parser.tables):
        if not cells or len(cells) < 2:
            continue
        ncols = max(len(row) for row in cells)
        if ncols < 2:
            continue
        max_lens = [0] * ncols
        for row in cells:
            for j, cell in enumerate(row):
                if j < ncols:
                    max_lens[j] = max(max_lens[j], len(cell))
        if sum(max_lens) == 0:
            continue
        raw = [max(l, 2) for l in max_lens]
        total_raw = sum(raw)
        widths = [max(8, round(r / total_raw * 100)) for r in raw]
        diff = 100 - sum(widths)
        if diff:
            widths[widths.index(max(widths))] += diff
        cols = "".join(f'\n<col style="width: {w}%" />' for w in widths)
        colgroup = f"<colgroup>{cols}\n</colgroup>\n"
        table_html = match.group()
        existing_cg = re.search(r"<colgroup>.*?</colgroup>\s*", table_html, re.DOTALL)
        if existing_cg:
            new_table = table_html[:existing_cg.start()] + colgroup + table_html[existing_cg.end():]
        else:
            tag_end = table_html.index(">") + 1
            new_table = table_html[:tag_end] + "\n" + colgroup + table_html[tag_end:]
        start = match.start() + offset
        end = match.end() + offset
        html = html[:start] + new_table + html[end:]
        offset += len(new_table) - len(table_html)
        modified += 1
    print(f"  Rebalanced columns on {modified} tables")
    return html

# ---------------------------------------------------------------------------
# CSS
# ---------------------------------------------------------------------------
BOOK_CSS = """<style>
@page {
  size: A4;
  margin: 2cm 2.2cm 2.2cm 3.2cm;
  @bottom-left   { content: string(book-title); font-family: Arial, sans-serif; font-size: 9pt; color: #555; }
  @bottom-center { content: counter(page) " / " counter(pages); font-family: Arial, sans-serif; font-size: 9pt; color: #555; }
}

/* Suppress running footer on the cover */
@page cover { @bottom-left { content: ""; } @bottom-center { content: ""; } }
.book-cover { page: cover; }

body {
  font-family: Arial, 'DejaVu Sans', sans-serif;
  font-size: 11pt;
  line-height: 1.45;
  color: #1a1a1a;
  max-width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  string-set: book-title attr(data-book-title);
}

p { margin: 0 0 10pt 0; }

/* ==========================================================================
   BOOK-LEVEL FRONT MATTER
   ========================================================================== */

/* Cover */
.book-cover {
  break-after: page;
  height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.book-cover-inner { max-width: 80%; }
.book-cover .book-eyebrow {
  font-size: 13pt;
  color: #1A5276;
  letter-spacing: 0.5pt;
  text-transform: uppercase;
  margin: 0 0 18pt 0;
}
.book-cover .book-title {
  font-size: 36pt;
  color: #1A5276;
  border: none;
  padding: 0;
  margin: 0 0 24pt 0;
  line-height: 1.15;
  font-weight: bold;
}
.book-cover .book-edition {
  font-size: 13pt;
  color: #555;
  margin: 0 0 36pt 0;
}
.book-cover .book-school {
  font-size: 14pt;
  color: #1A5276;
  margin: 0;
  font-weight: bold;
}

/* Colofon */
.book-colofon {
  break-after: page;
  padding-top: 35vh;
  font-size: 10.5pt;
  color: #333;
}
.book-colofon .book-section-title {
  font-size: 14pt;
  color: #1A5276;
  font-weight: bold;
  margin: 0 0 12pt 0;
  border-bottom: 1px solid #1A5276;
  padding-bottom: 4pt;
}
.book-colofon p { margin: 0 0 6pt 0; }
.book-colofon .book-colofon-note {
  margin-top: 18pt;
  font-style: italic;
  color: #555;
}

/* Voorwoord */
.book-voorwoord {
  break-after: page;
}
.book-voorwoord h1 {
  font-size: 22pt;
  color: #1A5276;
  border-bottom: 2px solid #1A5276;
  padding-bottom: 6pt;
  margin: 0 0 16pt 0;
}
.book-voorwoord p { margin: 0 0 10pt 0; font-size: 11pt; line-height: 1.5; }

/* Inhoudsopgave */
.book-toc {
  break-after: page;
}
.book-toc h1 {
  font-size: 22pt;
  color: #1A5276;
  border-bottom: 2px solid #1A5276;
  padding-bottom: 6pt;
  margin: 0 0 16pt 0;
}
.book-toc .toc-table {
  border-collapse: collapse;
  width: 100%;
  margin: 0;
  font-size: 11pt;
}
.book-toc .toc-table td {
  border: none;
  padding: 2pt 6pt;
  background: transparent;
}
.book-toc tr.toc-chapter td {
  font-weight: bold;
  color: #1A5276;
  padding-top: 10pt;
  border-top: 1px solid #ccc;
  font-size: 12pt;
  background: transparent;
}
.book-toc tr.toc-paragraph td.toc-nr {
  width: 60pt;
  padding-left: 18pt;
  color: #555;
}
.book-toc tr.toc-paragraph td.toc-title { color: #333; }

/* ==========================================================================
   BOOK-LEVEL BACK MATTER
   ========================================================================== */

.book-glossary {
  break-before: page;
}
.book-glossary h1,
.book-formulas h1 {
  font-size: 22pt;
  color: #1A5276;
  border-bottom: 2px solid #1A5276;
  padding-bottom: 6pt;
  margin: 0 0 16pt 0;
}
.book-glossary dl { margin: 0; font-size: 10.5pt; line-height: 1.35; }
.book-glossary dt {
  font-weight: bold;
  color: #1A5276;
  margin-top: 8pt;
  break-after: avoid;
}
.book-glossary dd {
  margin: 0 0 4pt 0;
  padding-left: 18pt;
  color: #222;
}
.book-glossary dt .term-abbrev {
  color: #555;
  font-weight: normal;
  font-size: 10pt;
}
.book-glossary dd.term-formula {
  font-size: 10pt;
  color: #2F6B2F;
  margin-top: -2pt;
}
.book-glossary dd.term-formula code {
  background: #EFF6EC;
  color: #2F6B2F;
  padding: 0 4pt;
  border-radius: 3px;
  font-size: 10pt;
}
.book-glossary dd.term-todo {
  color: #888;
  font-style: italic;
}

.book-formulas {
  break-before: page;
}
.book-formulas .book-formulas-chapter {
  font-weight: bold;
  color: #1A5276;
  font-size: 12pt;
  margin: 14pt 0 6pt 0;
  break-after: avoid;
  border-bottom: 1px solid #bbb;
  padding-bottom: 3pt;
}
.book-formulas .book-formula-list {
  list-style: none;
  padding: 0;
  margin: 0 0 12pt 0;
  font-size: 10.5pt;
}
.book-formulas .book-formula-list li {
  margin: 0 0 4pt 0;
  padding-left: 0;
}
.book-formulas .book-kind {
  display: inline-block;
  min-width: 66pt;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 9pt;
  letter-spacing: 0.3pt;
  padding: 1pt 5pt;
  margin-right: 6pt;
  border-radius: 3px;
}
.book-formulas .book-kind-definitie { background: #E8F1F8; color: #1A5276; }
.book-formulas .book-kind-formule   { background: #EFF6EC; color: #2F6B2F; }
.book-formulas .book-kind-procedure { background: #F8F1E8; color: #8A5A00; }

/* ==========================================================================
   CHAPTER-LEVEL (inherited from chapter pipeline)
   ========================================================================== */

/* Chapter front page */
.chapter-front { break-after: page; }
.chapter-front h1 {
  font-size: 24pt;
  color: #1A5276;
  border-bottom: 3px solid #1A5276;
  padding-bottom: 8px;
  margin-top: 0;
  margin-bottom: 14px;
}
.chapter-front p { font-size: 11pt; line-height: 1.4; margin: 0 0 8pt 0; }
.chapter-front h2 { font-size: 14pt; margin-top: 14pt; margin-bottom: 6pt; padding-bottom: 4pt; }
.chapter-front ul { font-size: 11pt; line-height: 1.35; margin: 0 0 8pt 0; }
.chapter-front li { margin-bottom: 2pt; }

/* Headings (in-chapter) */
h1 {
  font-size: 18pt;
  font-weight: bold;
  color: #1A5276;
  border-bottom: 1.5px solid #1A5276;
  padding-bottom: 5pt;
  margin-top: 0;
  margin-bottom: 18pt;
  break-after: avoid;
}
h2 {
  font-size: 14pt;
  font-weight: bold;
  color: #1A5276;
  border-bottom: 1px solid #999;
  padding-bottom: 4pt;
  margin-top: 22pt;
  margin-bottom: 12pt;
  break-after: avoid;
}
h3 {
  font-size: 12pt;
  font-weight: bold;
  color: #1a1a1a;
  margin-top: 16pt;
  margin-bottom: 6pt;
  break-after: avoid;
}
h1 + p, h2 + p, h3 + p { break-before: avoid; }
h1, h2, h3 { orphans: 3; widows: 3; }

/* Boxes */
blockquote {
  background: #F4F7FA;
  border-left: 3px solid #1A5276;
  padding: 8pt 12pt;
  margin: 12pt 0;
  font-size: 10.5pt;
  line-height: 1.4;
  break-inside: avoid;
}
blockquote p { margin: 0 0 6pt 0; }
blockquote p:last-child { margin-bottom: 0; }
blockquote strong:first-child { color: #1A5276; }

/* Tables */
table {
  border-collapse: collapse;
  width: 100%;
  margin: 12pt 0;
  font-size: 10.5pt;
  break-inside: avoid;
}
th {
  background: #EDF0F3;
  color: #1a1a1a;
  font-weight: bold;
  padding: 3pt 6pt;
  text-align: left;
  border: 1px solid #999;
}
td { border: 1px solid #999; padding: 2pt 6pt; }
tr:nth-child(even) td { background: #FAFBFC; }

/* Images */
figure { margin: 14pt 0; break-inside: avoid; text-align: center; }
figure img { max-width: 100%; width: 100%; display: block; margin: 0 auto; }
figcaption { font-weight: bold; font-size: 10.5pt; color: #1a1a1a; text-align: left; margin-top: 6pt; }
img { max-width: 100%; width: 100%; display: block; margin: 14pt auto; break-inside: avoid; }
p + figure, p + p > img { break-before: avoid; }

/* Exercises */
.exercise { margin-bottom: 14pt; orphans: 2; widows: 2; }
.exercise > p:first-child { break-after: avoid; page-break-after: avoid; }
.exercise p { margin: 0 0 1pt 0; }

/* Misc */
code { background: #EDF2F7; padding: 1pt 5pt; border-radius: 3px; font-family: 'Consolas', 'DejaVu Sans Mono', monospace; font-size: 10pt; }
hr { border: none; border-top: 1px solid #BBB; margin: 18pt 0; }
em { color: #444; }
ul, ol { margin: 0 0 10pt 0; padding-left: 20pt; }
ol[type="a"] { list-style-type: lower-alpha; }
li { margin-bottom: 4pt; }
</style>"""

# ---------------------------------------------------------------------------
# Main build
# ---------------------------------------------------------------------------
def assemble_book_md(manifest: dict, lessen_root: Path, platform_root: Path):
    """Return (book_md_text, chapter_dirs, book_title_full, book_output_dir)."""
    book = manifest["book"]
    colofon = manifest["colofon"]

    book_title = book["title"]
    book_title_full = f"Boek {book['nr']} {book_title}"
    book_output_dir = lessen_root / f"Boek {book['nr']} - {book_title}"

    # 1. Locate chapters inside the book folder + load hoofdstuk.md
    chapter_data: list[tuple[str, Path, str, str]] = []
    asset_sources: list[Path] = []
    for chapter_spec in manifest["chapters"]:
        if isinstance(chapter_spec, str):
            chapter_nr = chapter_spec
            chapter_dir = find_chapter_folder(book_output_dir, chapter_nr)
            md_path = find_chapter_md(chapter_dir)
            md_text = md_path.read_text(encoding="utf-8")
            chapter_data.append((chapter_nr, chapter_dir, md_text, chapter_dir.name))
            asset_sources.append(chapter_dir)
            print(f"  Loaded chapter {chapter_nr}: {chapter_dir.name}")
        else:
            chapter_nr = str(chapter_spec["nr"])
            mode = chapter_spec.get("mode", "assembled")
            if mode == "assembled":
                folder = chapter_spec.get("folder")
                chapter_dir = (
                    book_output_dir / folder
                    if folder
                    else find_chapter_folder(book_output_dir, chapter_nr)
                )
                md_path = find_chapter_md(chapter_dir)
                md_text = md_path.read_text(encoding="utf-8")
                fallback_title = chapter_spec.get("title") or chapter_dir.name
                chapter_data.append((chapter_nr, chapter_dir, md_text, fallback_title))
                asset_sources.append(chapter_dir)
                print(f"  Loaded chapter {chapter_nr}: {chapter_dir.name}")
            elif mode == "composed":
                md_text, composed_asset_sources, fallback_title = compose_chapter_md(
                    chapter_spec,
                    book_output_dir,
                    platform_root,
                )
                chapter_data.append((chapter_nr, book_output_dir, md_text, fallback_title))
                asset_sources.extend(composed_asset_sources)
                print(f"  Composed chapter {chapter_nr}: {fallback_title}")
            else:
                raise ValueError(f"Unsupported chapter mode for {chapter_nr}: {mode}")

    # 2. Front matter
    toc_entries = build_toc_entries(chapter_data)
    cover_html = render_cover_html(book)
    colofon_html = render_colofon_html(book, colofon)

    voorwoord_path = platform_root / manifest.get("voorwoord", "")
    voorwoord_html = render_voorwoord_html(voorwoord_path)

    toc_html = render_toc_html(toc_entries)

    # 3. Body: chapter markdowns with rewritten asset paths
    body_parts: list[str] = [BOOK_CONTENT_START]
    for chapter_nr, chapter_dir, md_text, fallback_title in chapter_data:
        body_parts.append('<div style="break-before: page;"></div>')
        body_parts.append(rewrite_chapter_asset_paths(md_text))
    body_parts.append(BOOK_CONTENT_END)

    # 4. Back matter needs the assembled book text to know which terms to include
    # Build a "raw body" (with asset paths) for term scanning.
    raw_body = "\n\n".join(md for _, _, md, _ in chapter_data)

    begrippen_json_path = platform_root / "references" / "machine" / "begrippen.json"
    if begrippen_json_path.exists():
        registry = load_begrippen(begrippen_json_path)
        begrippen = extract_begrippen(raw_body, registry)
        excluded_glossary_terms = {
            str(term).strip().lower()
            for term in manifest.get("glossary_exclude_terms", [])
        }
        if excluded_glossary_terms:
            begrippen = [
                b for b in begrippen
                if str(b.get("id", "")).strip().lower() not in excluded_glossary_terms
                and str(b.get("term_nl", "")).strip().lower() not in excluded_glossary_terms
            ]
    else:
        print(f"  Warning: begrippen registry not found at {begrippen_json_path}",
              file=sys.stderr)
        begrippen = []
    glossary_html = render_begrippenlijst_html(begrippen)

    per_chapter_formules = []
    for (chapter_nr, chapter_dir, md_text, fallback_title), entry in zip(chapter_data, toc_entries):
        per_chapter_formules.append({
            "chapter_nr": chapter_nr,
            "chapter_title": entry["chapter_title"],
            "items": extract_formules(md_text),
        })
    formulas_html = render_formuleoverzicht_html(per_chapter_formules)

    # 5. Stitch
    sep = '<div style="break-before: page;"></div>'
    book_md = "\n\n".join([
        cover_html,
        sep,
        colofon_html,
        sep,
        voorwoord_html,
        sep,
        toc_html,
        "\n\n".join(body_parts),
        sep,
        glossary_html,
        sep,
        formulas_html,
    ])

    return book_md, asset_sources, book_title_full, book_output_dir, book

def md_to_pdf(book_md: str, book_output_dir: Path, book_title_full: str, book: dict):
    book_output_dir.mkdir(parents=True, exist_ok=True)
    assets_dir = book_output_dir / "_assets"

    # 1. Embed images
    md_embedded = embed_images(book_md, assets_dir)

    # 2. Pandoc → HTML
    result = subprocess.run(
        ["pandoc", "--from=markdown", "--to=html5", "--standalone"],
        input=md_embedded.encode("utf-8"),
        capture_output=True,
    )
    if result.returncode != 0:
        raise RuntimeError(f"Pandoc error: {result.stderr.decode()}")
    html = result.stdout.decode("utf-8")

    # 3. Strip Pandoc default stylesheet
    html = re.sub(
        r"<style>\s*/\* Default styles provided by pandoc.*?</style>",
        "",
        html,
        flags=re.DOTALL,
    )

    # 4. Wrap exercises (only in content region; skip chapter-front and book-* divs)
    html = wrap_exercises_in_book(html)

    # 5. Rebalance tables
    html = rebalance_table_columns(html)

    # 6. Inject CSS + book-title for running footer
    html = html.replace("</head>", BOOK_CSS + "</head>")
    html = html.replace(
        "<body>",
        f'<body data-book-title="{html_escape(book_title_full)}">',
        1,
    )

    html_path = book_output_dir / f"{book_title_full} – boek.html"
    write_text_lf(html_path, html)
    print(f"HTML saved: {html_path.name}")

    pdf_path = book_output_dir / f"{book_title_full} – boek.pdf"
    try:
        import weasyprint  # type: ignore
        weasyprint.HTML(string=html).write_pdf(str(pdf_path))
        print(f"PDF saved: {pdf_path.name}")
        return
    except Exception as e:
        print(f"Weasyprint unavailable ({type(e).__name__}: {e}). Trying headless Chrome…",
              file=sys.stderr)

    chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    if os.path.exists(chrome):
        result = subprocess.run(
            [
                chrome,
                "--headless",
                "--disable-gpu",
                "--no-pdf-header-footer",
                f"--print-to-pdf={os.path.abspath(pdf_path)}",
                "file:///" + os.path.abspath(html_path).replace("\\", "/"),
            ],
            capture_output=True,
            text=True,
        )
        if pdf_path.exists():
            print(f"PDF saved via headless Chrome: {pdf_path.name}")
        else:
            print(f"Chrome PDF generation failed: {result.stderr}", file=sys.stderr)
    else:
        print(f"No PDF engine available. HTML saved at: {html_path}", file=sys.stderr)

def build_book(manifest_path: Path, lessen_root: Path, platform_root: Path):
    print(f"=== Loading manifest: {manifest_path.name} ===")
    manifest = load_manifest(manifest_path)

    print(f"\n=== Assembling book ===")
    book_md, asset_sources, book_title_full, book_output_dir, book = assemble_book_md(
        manifest, lessen_root, platform_root
    )

    print(f"\n=== Collecting assets into {book_output_dir.name}/_assets/ ===")
    book_output_dir.mkdir(parents=True, exist_ok=True)
    copied = collect_assets(asset_sources, book_output_dir / "_assets")
    print(f"  Copied {copied} new assets")

    missing = verify_asset_refs(book_md, book_output_dir / "_assets")
    if missing:
        print(f"\nERROR: {len(missing)} unresolved asset reference(s):", file=sys.stderr)
        for m in sorted(set(missing))[:20]:
            print(f"  - {m}", file=sys.stderr)
        sys.exit(1)

    md_path = book_output_dir / f"{book_title_full} – boek.md"
    write_text_lf(md_path, book_md)
    print(f"\nMarkdown saved: {md_path.name}")

    print(f"\n=== Building PDF ===")
    md_to_pdf(book_md, book_output_dir, book_title_full, book)

    print(f"\n=== Done ===\nBook output: {book_output_dir}")
