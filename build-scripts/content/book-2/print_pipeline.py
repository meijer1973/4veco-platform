"""Book 2 Part A Markdown -> self-contained HTML/PDF and unreviewed page proof.

Content/figures remain authored sources. This helper neither approves output nor
changes a target. Call build_document(Path(...)) from a paragraph builder, or run
this file with one or more exact Markdown paths. No folder-wide regeneration.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import json
import re
import shutil
import subprocess
from pathlib import Path
from urllib.parse import unquote, urlsplit

from bs4 import BeautifulSoup, Tag


CSS = """
@page {
  size: A4; margin: 20mm 20mm 21mm 24mm;
  @bottom-left { content: string(document-title); font: 9pt Arial, sans-serif; color: #555; }
  @bottom-right { content: counter(page) " / " counter(pages); font: 9pt Arial, sans-serif; color: #555; }
}
* { box-sizing: border-box; }
html { color: #182b3a; background: white; }
body { font-family: Arial, "DejaVu Sans", sans-serif; font-size: 12pt; line-height: 1.38; margin: 0; }
h1 { string-set: document-title content(); font-size: 21pt; line-height: 1.15; color: #1A5276; margin: 0 0 6mm; }
h2 { font-size: 16pt; line-height: 1.2; color: #1A5276; border-bottom: 0.5pt solid #a9bdca; padding-bottom: 2mm; margin: 7mm 0 3mm; }
h3 { font-size: 13pt; color: #1A5276; margin: 4mm 0 2mm; }
h1,h2,h3,h4 { break-after: avoid; }
p { margin: 0 0 2.5mm; orphans: 3; widows: 3; }
li { margin-bottom: 1mm; }
ul,ol { margin: 2mm 0 3mm; padding-left: 7mm; }
strong { font-weight: 700; }
blockquote,.recap,.summary { border-left: 3pt solid #1A5276; background: #eef4f7; margin: 3mm 0; padding: 3mm 4mm; }
table { width: 100%; border-collapse: collapse; font-size: 12pt; margin: 3mm 0; }
th,td { border: 0.5pt solid #94a5ad; padding: 2mm; vertical-align: top; overflow-wrap: anywhere; }
th { background: #eaf1f5; font-weight: 700; text-align: left; }
thead { display: table-header-group; }
tr { break-inside: avoid; }
figure { margin: 3mm 0 4mm; break-inside: avoid; }
img { max-width: 100%; height: auto; display: block; margin: 2mm auto; }
figcaption { font-size: 12pt; color: #304958; margin-top: 1mm; }
code { font-size: 12pt; font-family: "DejaVu Sans Mono", monospace; }
pre { white-space: pre-wrap; overflow-wrap: anywhere; }
math { font-size: 1em; }
.exercise { margin-bottom: 4mm; }
.exercise > p:first-child { break-after: avoid; }
.exercise-short { break-inside: avoid; }
.exercise p { margin-bottom: 2mm; }
.page-break { break-before: page; height: 0; }
.chapter-front { break-after: page; font-size: 12pt; }
.chapter-front table,.chapter-front p,.chapter-front li { font-size: 12pt; }
@media screen {
  body { max-width: 180mm; margin: 24px auto; padding: 18px; }
  img { object-fit: contain; }
}
"""


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _embed_images(soup: BeautifulSoup, source: Path) -> list[dict]:
    assets = {}
    for image in soup.find_all("img"):
        src = str(image.get("src", ""))
        if not str(image.get("alt", "")).strip():
            raise ValueError(f"Image needs meaningful alt text: {src}")
        if src.startswith("data:"):
            raise ValueError("Keep authored image references as local paired assets, not embedded data")
        parsed = urlsplit(src)
        if parsed.scheme or parsed.netloc or parsed.query or parsed.fragment:
            raise ValueError(f"Only local image references are accepted: {src}")
        original = (source.parent / unquote(parsed.path)).resolve()
        asset_root = (source.parent / "_assets").resolve()
        if not original.is_relative_to(asset_root):
            raise ValueError(f"Image must stay inside the document _assets directory: {src}")
        if original.suffix.lower() not in {".svg", ".png"}:
            raise ValueError(f"Book 2 print assets require SVG/PNG pairs: {src}")
        svg, png = original.with_suffix(".svg"), original.with_suffix(".png")
        for asset in (svg, png):
            if not asset.is_file():
                raise FileNotFoundError(f"Missing paired print asset: {asset}")
            assets[str(asset)] = {"path": str(asset), "sha256": digest(asset)}
        image["src"] = "data:image/png;base64," + base64.b64encode(png.read_bytes()).decode("ascii")
    return list(assets.values())


def _wrap_exercises(soup: BeautifulSoup) -> None:
    """Wrap direct sibling blocks; never consume structural headings/front matter."""
    for paragraph in list(soup.find_all("p")):
        if paragraph.find_parent(class_=["chapter-front", "exercise"]):
            continue
        first = paragraph.find("strong", recursive=False)
        if not first or not re.match(r"^Opgave\s+\d+\b", first.get_text(" ", strip=True), re.I):
            continue
        wrapper = soup.new_tag("div", attrs={"class": ["exercise"]})
        paragraph.insert_before(wrapper)
        node = paragraph
        while node is not None:
            next_node = node.next_sibling
            if node is not paragraph and isinstance(node, Tag):
                label = node.find("strong", recursive=False) if node.name == "p" else None
                new_exercise = label and re.match(r"^Opgave\s+\d+\b", label.get_text(" ", strip=True), re.I)
                if node.name in {"h1", "h2", "h3", "h4"} or new_exercise or "page-break" in node.get("class", []):
                    break
            wrapper.append(node.extract())
            node = next_node
        # Keep genuinely short blocks together. Long source-rich exercises may
        # split at paragraph/row boundaries instead of creating huge white gaps.
        if len(wrapper.get_text(" ", strip=True)) < 650 and not wrapper.find(["img", "table"]):
            wrapper["class"].append("exercise-short")


def prepare_html(markdown: str, source: Path, *, pandoc: str = "pandoc") -> tuple[str, list[dict]]:
    result = subprocess.run(
        [pandoc, "--from=markdown", "--to=html5", "--standalone", "--mathml",
         "--metadata", "lang=nl", "--metadata", f"pagetitle={source.stem}"],
        input=markdown, text=True, encoding="utf-8", capture_output=True, check=True,
    )
    soup = BeautifulSoup(result.stdout, "html.parser")
    if soup.head is None or soup.body is None:
        raise ValueError("Pandoc did not return a complete HTML document")
    for style in soup.head.find_all("style"):
        style.decompose()
    if soup.find(id="title-block-header"):
        raise ValueError("Duplicate Pandoc metadata title is forbidden")
    if soup.find(["script", "iframe", "object", "embed", "link"]):
        raise ValueError("Print source must not load scripts, embedded surfaces or external styles")
    assets = _embed_images(soup, source)
    _wrap_exercises(soup)
    style = soup.new_tag("style")
    style.string = CSS
    soup.head.append(style)
    soup.html["lang"] = "nl"
    return str(soup), assets


def build_document(source: Path, *, pandoc: str = "pandoc") -> dict:
    from weasyprint import HTML, default_url_fetcher
    source = source.resolve(strict=True)
    if source.suffix != ".md":
        raise ValueError("Expected an exact authored Markdown file")
    html, assets = prepare_html(source.read_text(encoding="utf-8-sig"), source, pandoc=pandoc)

    def local_fetcher(url, *args, **kwargs):
        if not url.startswith("data:image/png;base64,"):
            raise ValueError(f"Unexpected external PDF resource: {url}")
        return default_url_fetcher(url, *args, **kwargs)

    html_path, pdf_path = source.with_suffix(".html"), source.with_suffix(".pdf")
    html_path.write_text(html, encoding="utf-8", newline="\n")
    HTML(string=html, url_fetcher=local_fetcher).write_pdf(pdf_path)
    return {"source_md": str(source), "source_sha256": digest(source),
            "source_html": str(html_path), "html_sha256": digest(html_path),
            "source_pdf": str(pdf_path), "pdf_sha256": digest(pdf_path), "assets": assets}


def render_proof(record: dict, proof_dir: Path, *, pdftoppm: str = "pdftoppm", dpi: int = 150) -> dict:
    """Capture all pages; leave every inspection/acceptance field honestly pending."""
    from PIL import Image, ImageDraw
    from pypdf import PdfReader
    if proof_dir.exists() and any(proof_dir.iterdir()):
        raise ValueError("Proof destination is not empty; use a new output-hash directory")
    pages_dir = proof_dir / "pages"
    pages_dir.mkdir(parents=True, exist_ok=True)
    pdf = Path(record["source_pdf"])
    subprocess.run([pdftoppm, "-png", "-r", str(dpi), str(pdf), str(pages_dir / "page")],
                   capture_output=True, text=True, check=True)
    files = sorted(pages_dir.glob("page-*.png"), key=lambda p: int(p.stem.split("-")[-1]))
    expected = len(PdfReader(pdf).pages)
    if len(files) != expected or not files:
        raise ValueError(f"Expected {expected} pages; captured {len(files)}")
    normalized = []
    for index, path in enumerate(files, 1):
        destination = pages_dir / f"page-{index:03d}.png"
        if destination != path:
            if destination.exists():
                raise ValueError(f"Page normalization collision: {destination}")
            path.rename(destination)
        normalized.append(destination)
    cell_w, cell_h, columns = 300, 445, 3
    sheet = Image.new("RGB", (cell_w * columns, cell_h * ((expected + columns - 1) // columns)), "#d9e0e5")
    draw = ImageDraw.Draw(sheet)
    for index, path in enumerate(normalized):
        with Image.open(path) as page:
            page.thumbnail((cell_w - 16, cell_h - 34))
            x, y = (index % columns) * cell_w, (index // columns) * cell_h
            sheet.paste(page, (x + (cell_w - page.width) // 2, y + 8))
            draw.text((x + 12, y + cell_h - 22), f"Page {index + 1}", fill="#182b3a")
    sheet.save(proof_dir / "contact-sheet.png")
    manifest = {**record, "sprint_id": "BOOK2-TEXTBOOK-PRODUCTION-1",
                "artifact_id": proof_dir.name, "render_dpi": dpi,
                "rendered_pages": [p.relative_to(proof_dir).as_posix() for p in normalized],
                "page_sha256": {p.name: digest(p) for p in normalized},
                "contact_sheet": "contact-sheet.png", "pages_inspected": [],
                "inspection_status": "PENDING", "visible_student_defects": None,
                "inspected_at_normal_reading_scale": False, "warnings": []}
    (proof_dir / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return manifest


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("sources", type=Path, nargs="+")
    parser.add_argument("--proof-root", type=Path)
    parser.add_argument("--pandoc", default="pandoc")
    parser.add_argument("--pdftoppm", default="pdftoppm")
    args = parser.parse_args()
    if not shutil.which(args.pandoc):
        parser.error("Pandoc was not found")
    for source in args.sources:
        record = build_document(source, pandoc=args.pandoc)
        if args.proof_root:
            artifact = re.sub(r"[^a-z0-9.-]+", "-", source.stem.lower()).strip("-")
            destination = args.proof_root / f"{artifact}-{record['pdf_sha256'][:12]}"
            record = render_proof(record, destination, pdftoppm=args.pdftoppm)
        print(json.dumps(record, ensure_ascii=False))


if __name__ == "__main__":
    main()
