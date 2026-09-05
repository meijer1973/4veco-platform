"""Bounded automated evidence only. Never supplies independent/visual approval."""
import hashlib
import io
import json
import math
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from zipfile import ZipFile
from bs4 import BeautifulSoup
from PIL import Image, ImageChops
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
PREFIX = "BOOK2-TEXTBOOK-PRODUCTION-1-211-ALT"
sys.path.insert(0, str(ROOT / "build-scripts/content/book-2"))
import b2_211 as b
from print_pipeline import build_document, verify_record_freshness

LESSONS = ROOT.parent / "4veco-lessen"
BASE = "e1170dfc450400040339f96d18e43c0b60bd029d"
PLATFORM_BASE = "441b7e7013c74fb80da55d88f84223d233bac6a8"
FOLDER = LESSONS / b.LESSON_REL
REPORT = ROOT / "reports/sprints"
BUILD = json.loads((REPORT / f"{PREFIX}-build-r4.json").read_text(encoding="utf-8"))

def sha(data):
    return hashlib.sha256(data).hexdigest()

def previous(path, root=LESSONS, ref=BASE):
    return subprocess.check_output(["git", "show", f"{ref}:{path.relative_to(root).as_posix()}"], cwd=root)

def normalized(data):
    return " ".join(data.split())

def tree(tag):
    if isinstance(tag, str):
        return normalized(tag)
    return [tag.name, dict(tag.attrs), [tree(c) for c in tag.children if not isinstance(c, str) or c.strip()]]

def audit():
    result = {"builder": "paragraph_211_alt_builder", "visual_approval": "NOT_SUPPLIED_BY_SCRIPT",
              "platform_base": PLATFORM_BASE, "lessons_base": BASE,
              "assets": [], "documents": [], "protected": []}
    gray_root = REPORT / f"{PREFIX}-grayscale"
    gray_root.mkdir(exist_ok=True)
    for svg in sorted((FOLDER / "_assets").glob("*.svg")):
        raw, old = svg.read_bytes(), previous(svg)
        title = ET.fromstring(raw).find("{http://www.w3.org/2000/svg}title").text
        assert len(title) <= 120 and not title.startswith("Eerst ")
        strip_title = lambda value: re.sub(rb"<title[^>]*>.*?</title>", b"", value, flags=re.S)
        assert strip_title(raw) == strip_title(old), (svg.name, "drawing bytes changed")
        if svg.stem != "2.1.1_fig_3":
            assert raw == old
        png = svg.with_suffix(".png")
        png_raw, png_old = png.read_bytes(), previous(png)
        assert png_raw == png_old, (png.name, "PNG bytes changed")
        with Image.open(io.BytesIO(png_raw)) as current, Image.open(io.BytesIO(png_old)) as earlier:
            assert ImageChops.difference(current.convert("RGB"), earlier.convert("RGB")).getbbox() is None
            gray = gray_root / png.name
            current.convert("L").save(gray)
            size = current.size
        result["assets"].append({"name": svg.stem, "title": title, "title_chars": len(title),
                                  "svg_sha256": sha(raw), "old_svg_sha256": sha(old),
                                  "drawing_bytes_equal": True, "png_sha256": sha(png_raw),
                                  "png_bytes_equal": True, "pixel_difference_count": 0,
                                  "raster_size": size, "grayscale_sha256": b.digest(gray)})
    for kind, record, expected_pages in zip(("paragraaf", "opgaven", "antwoorden"), BUILD["documents"], (15, 9, 7)):
        verify_record_freshness(record)
        html_path = Path(record["source_html"])
        before = BeautifulSoup(previous(html_path).decode(), "html.parser")
        after = BeautifulSoup(html_path.read_text(encoding="utf-8"), "html.parser")
        assert normalized(before.body.get_text(" ")) == normalized(after.body.get_text(" ")), kind
        alts = []
        for oldfig, newfig in zip(before.find_all("figure"), after.find_all("figure")):
            oldimg, newimg = oldfig.img, newfig.img
            assert oldimg["src"] == newimg["src"]
            alts.append({"alt": newimg["alt"], "chars": len(newimg["alt"]),
                         "old_alt": oldimg["alt"], "old_chars": len(oldimg["alt"]),
                         "old_caption": oldfig.figcaption.get_text(),
                         "caption": newfig.figcaption.get_text(),
                         "old_caption_attributes": dict(oldfig.figcaption.attrs),
                         "caption_attributes": dict(newfig.figcaption.attrs)})
            assert len(newimg["alt"]) <= 120
            assert normalized(oldfig.figcaption.get_text()) == normalized(newfig.figcaption.get_text())
            if oldimg["alt"] != newimg["alt"]:
                assert oldimg["alt"].startswith("Hetzelfde constante maandbedrag")
                assert len(oldimg["alt"]) == 122 and len(newimg["alt"]) == 83
                assert oldfig.figcaption.attrs == {"aria-hidden": "true"}
                assert newfig.figcaption.attrs == {}
                # Remove only the two authorized DOM attribute differences.
                oldimg["alt"] = newimg["alt"]
                del oldfig.figcaption["aria-hidden"]
        assert tree(before) == tree(after), (kind, "unexpected normalized DOM delta")
        pdf = Path(record["source_pdf"])
        assert pdf.read_bytes() == previous(pdf), (kind, "PDF bytes changed")
        reader = PdfReader(pdf)
        assert len(reader.pages) == expected_pages
        printed_sizes, placements = [], []
        for number, page in enumerate(reader.pages, 1):
            def text_size(text, cm, tm, font, size):
                if text.strip():
                    printed_sizes.append(size * math.sqrt(abs(cm[0]*cm[3]-cm[1]*cm[2])))
            def image_size(op, args, cm, tm):
                if op == b"Do":
                    placements.append({"page": number, "width_pt": math.hypot(cm[0], cm[1]),
                                       "height_pt": math.hypot(cm[2], cm[3])})
            page.extract_text(visitor_text=text_size, visitor_operand_before=image_size)
        assert min(printed_sizes) >= 11.99
        svgs = [Path(a["path"]) for a in record["assets"] if a["path"].endswith(".svg")]
        assert len(svgs) == len(placements)
        for svg, placement in zip(svgs, placements):
            root = ET.fromstring(svg.read_bytes())
            sx = placement["width_pt"] / float(root.attrib["width"])
            sy = placement["height_pt"] / float(root.attrib["height"])
            assert abs(sx-sy) < .00001
            label_min = min(float(e.attrib["font-size"]) for e in root.iter() if e.tag.endswith("text")) * min(sx, sy)
            assert label_min >= 12
            placement.update(asset=svg.stem, minimum_placed_label_pt=label_min)
        proof = Path(record["proof_directory"])
        earlier = proof.with_name(proof.name.removesuffix("-r4") + "-r3")
        manifest = json.loads((proof / "manifest.json").read_text(encoding="utf-8"))
        previous_manifest = json.loads((earlier / "manifest.json").read_text(encoding="utf-8"))
        assert manifest["inspection_status"] == "PENDING"
        pages = []
        for page in manifest["rendered_pages"]:
            now, old = proof / page, earlier / page
            assert now.read_bytes() == old.read_bytes()
            assert b.digest(now) == manifest["page_sha256"][now.name] == previous_manifest["page_sha256"][now.name]
            with Image.open(now) as image, Image.open(old) as image_old:
                assert ImageChops.difference(image.convert("RGB"), image_old.convert("RGB")).getbbox() is None
            pages.append({"page": page, "sha256": b.digest(now), "R3_bytes_equal": True, "pixel_difference_count": 0})
        result["documents"].append({"kind": kind, "md_sha256": record["source_sha256"],
                                     "html_sha256": record["html_sha256"], "pdf_sha256": record["pdf_sha256"],
                                     "PDF_R3_bytes_equal": True, "visible_text_equal": True,
                                     "normalized_DOM_equal_after_two_metadata_changes": True,
                                     "image_alternatives": alts, "pages": pages,
                                     "minimum_printed_text_including_footer_pt": min(printed_sizes),
                                     "actual_figure_placements": placements,
                                     "manifest_sha256": b.digest(proof / "manifest.json")})
    # Canonical historical records/plans and adjacent paragraph pins are immutable.
    protected = [*FOLDER.glob("2.1.1-*.md"), FOLDER / "2.1.1-quality-ref.yaml", FOLDER.parent / "_chapter-plan.md"]
    protected += [p for p in FOLDER.parent.rglob("*") if p.is_file() and ("2.1.2 " in str(p) or "2.1.3 " in str(p)) and p.suffix in (".md", ".yaml", ".json")]
    for path in protected:
        assert path.read_bytes() == previous(path), (path, "protected bytes changed")
        result["protected"].append({"path": path.relative_to(LESSONS).as_posix(), "sha256": b.digest(path)})
    archive_path = FOLDER / f"{b.STEM} – opgaven.zip"
    with ZipFile(archive_path) as archive:
        result["legacy_zip"] = {"path": str(archive_path), "sha256": b.digest(archive_path), "unchanged_from_base": archive_path.read_bytes() == previous(archive_path),
                                "members": archive.namelist(), "CRC_error": archive.testzip(),
                                "builder_contract": "211 native builder and thin entrypoint have no ZIP support; not rebuilt or claimed current"}
    (REPORT / f"{PREFIX}-audit-r4.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps({"assets": len(result["assets"]), "pages": sum(len(d["pages"]) for d in result["documents"]),
                      "protected_files": len(result["protected"]), "legacy_zip": result["legacy_zip"],
                      "visual_approval": result["visual_approval"]}, ensure_ascii=False, indent=2))

def rebuild():
    tracked = [Path(r[k]) for r in BUILD["documents"] for k in ("source_md", "source_html", "source_pdf")]
    tracked += list((FOLDER / "_assets").glob("*"))
    original = {str(p): b.digest(p) for p in tracked}
    b.build(LESSONS)
    assert original == {str(p): b.digest(p) for p in tracked}, "full rebuild differs"
    for record in BUILD["documents"]:
        build_document(Path(record["source_md"]))
        verify_record_freshness(record)
    assert original == {str(p): b.digest(p) for p in tracked}, "native print-only rebuild differs"
    print(json.dumps({"full_rebuild_identical": True, "native_build_document_print_only_identical": True,
                      "files": original, "zip": "no native 211 ZIP build contract"}, indent=2))

if __name__ == "__main__":
    (rebuild if "--rebuild" in sys.argv else audit)()
