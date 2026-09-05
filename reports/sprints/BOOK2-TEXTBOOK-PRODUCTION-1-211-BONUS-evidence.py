"""Bounded §211 R5 evidence. No independent or visual acceptance is supplied.

HOW TO ADAPT: use a new reviewed baseline/proof prefix; never overwrite this
historical checkpoint or broaden the exact insertion/changed-file contract.
"""
import hashlib
import io
import json
import math
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from bs4 import BeautifulSoup
from PIL import Image, ImageChops
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "build-scripts/content/book-2"))
sys.path.insert(0, str(ROOT / "build-scripts/content/book-2/211"))
import b2_211 as b
import test_bonus as contract
from print_pipeline import build_document, verify_record_freshness

LESSONS = ROOT.parent / "4veco-lessen"
BASE = "917115c8da631d65eefbdb1f15c13b2291cd9e1d"
FOLDER = LESSONS / b.LESSON_REL
REPORT = ROOT / "reports/sprints"
PREFIX = "BOOK2-TEXTBOOK-PRODUCTION-1-211-BONUS"
EVIDENCE = REPORT / f"{PREFIX}-evidence"
BUILD_PATH = REPORT / f"{PREFIX}-build-r5.json"


def sha(data):
    return hashlib.sha256(data).hexdigest()


def previous(path, root=LESSONS, ref=BASE):
    return subprocess.check_output(["git", "show", f"{ref}:{path.relative_to(root).as_posix()}"], cwd=root)


def write_new(name, value):
    path = REPORT / f"{PREFIX}-{name}.json"
    with path.open("x", encoding="utf-8", newline="\n") as stream:
        stream.write(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
    return path


def native_files():
    files = [FOLDER / f"{b.STEM} – {kind}.{ext}" for kind in ("paragraaf", "opgaven", "antwoorden")
             for ext in ("md", "html", "pdf")]
    return files + sorted((FOLDER / "_assets").glob("*"))


def capture():
    assert not EVIDENCE.exists(), "fresh evidence destination required"
    EVIDENCE.mkdir()
    files = native_files()
    assert len(files) == 21
    source = b.CONTENT / "answers.md"
    raw = source.read_bytes()
    result = {"platform_base": contract.BASE, "lessons_base": BASE,
              "original_answer_source_raw_sha256": sha(raw),
              "original_answer_source_lf_sha256": b.lf_hash(source),
              "original_crlf_count": raw.count(b"\r\n"),
              "files": {str(p.relative_to(LESSONS)): b.digest(p) for p in files},
              "legacy_zip_sha256": b.digest(FOLDER / f"{b.STEM} – opgaven.zip")}
    path = write_new("baseline-r5", result)
    print(json.dumps({"baseline": str(path), "files": len(files), "sha256": b.digest(path)}))


def tree(node):
    if isinstance(node, str):
        return " ".join(node.split())
    return [node.name, dict(node.attrs), [tree(c) for c in node.children if not isinstance(c, str) or c.strip()]]


def verify():
    build = json.loads(BUILD_PATH.read_text(encoding="utf-8"))
    contract.require_exact_sources({n: (b.CONTENT / n).read_text(encoding="utf-8") for n in contract.NAMES})
    result = {"builder": "paragraph_211_bonus_correction_builder", "platform_base": contract.BASE,
              "lessons_base": BASE, "visual_acceptance": "NOT_SUPPLIED_BY_SCRIPT", "assets": [], "documents": []}
    for directory in (EVIDENCE / "grayscale", EVIDENCE / "native"):
        directory.mkdir(exist_ok=True)
    for svg in sorted((FOLDER / "_assets").glob("*.svg")):
        png = svg.with_suffix(".png")
        assert svg.read_bytes() == previous(svg) and png.read_bytes() == previous(png)
        native = EVIDENCE / "native" / png.name
        if not native.exists():
            subprocess.run([sys.executable, "-m", "cairosvg", str(svg), "-o", str(native), "-s", "2"], check=True)
        assert native.read_bytes() == png.read_bytes(), (png.name, "native PNG differs")
        gray = EVIDENCE / "grayscale" / png.name
        with Image.open(png) as im:
            expected_gray = io.BytesIO()
            im.convert("L").save(expected_gray, format="PNG")
        if gray.exists():
            assert gray.read_bytes() == expected_gray.getvalue(), "Existing owned retry evidence differs"
        else:
            gray.write_bytes(expected_gray.getvalue())
        result["assets"].append({"asset": svg.stem, "svg_sha256": b.digest(svg), "png_sha256": b.digest(png),
                                  "native_sha256": b.digest(native), "native_pixel_delta": 0,
                                  "grayscale": str(gray.relative_to(ROOT)), "grayscale_sha256": b.digest(gray)})
    for kind, record in zip(("paragraaf", "opgaven", "antwoorden"), build["documents"]):
        verify_record_freshness(record)
        md, hp, pdf = [Path(record[k]) for k in ("source_md", "source_html", "source_pdf")]
        before = BeautifulSoup(previous(hp).decode("utf-8"), "html.parser")
        after = BeautifulSoup(hp.read_text(encoding="utf-8"), "html.parser")
        if kind == "antwoorden":
            assert md.read_text(encoding="utf-8").replace(contract.BLOCK, "", 1) == previous(md).decode("utf-8")
            labels = [p for p in after.find_all("p") if p.get_text(strip=True) == "Beoordelingscriteria:"]
            assert len(labels) == 1
            label = labels[0]
            criteria = label.find_next_sibling("ul")
            assert criteria and len(criteria.find_all("li", recursive=False)) == 3
            # Pandoc's native smart typography changes A's to A’s. Derive the
            # exact expected three-item DOM from this fixed block, not by
            # relaxing punctuation or ignoring arbitrary student text.
            native_block = subprocess.run(["pandoc", "--from=markdown", "--to=html5"],
                                          input=contract.BLOCK, text=True, encoding="utf-8",
                                          capture_output=True, check=True)
            wanted = [" ".join(li.get_text().split()) for li in
                      BeautifulSoup(native_block.stdout, "html.parser").ul.find_all("li", recursive=False)]
            assert [" ".join(li.get_text().split()) for li in criteria.find_all("li", recursive=False)] == wanted
            assert label.find_parent("div", class_="exercise").find("strong").get_text() == "Opgave 8"
            label.decompose()
            criteria.decompose()
        else:
            assert all(path.read_bytes() == previous(path) for path in (md, hp, pdf))
        assert tree(before) == tree(after), (kind, "unexpected full DOM delta")
        proof = Path(record["proof_directory"])
        manifest = json.loads((proof / "manifest.json").read_text(encoding="utf-8"))
        assert manifest["inspection_status"] == "PENDING" and manifest["pages_inspected"] == []
        old_sha = sha(previous(pdf))
        old_proof = proof.parent / f"211-{kind}-{old_sha[:12]}-r4"
        old_manifest = json.loads((old_proof / "manifest.json").read_text(encoding="utf-8"))
        page_rows = []
        for page in manifest["rendered_pages"]:
            current, old = proof / page, old_proof / page
            assert b.digest(current) == manifest["page_sha256"][current.name]
            same = False
            bbox = None
            if old.exists():
                assert b.digest(old) == old_manifest["page_sha256"][old.name]
                same = current.read_bytes() == old.read_bytes()
                with Image.open(current) as im, Image.open(old) as earlier:
                    bbox = ImageChops.difference(im.convert("RGB"), earlier.convert("RGB")).getbbox()
                assert same == (bbox is None)
            page_rows.append({"page": page, "path": str(current.relative_to(ROOT)), "sha256": b.digest(current),
                              "R4_exists": old.exists(), "R4_bytes_equal": same, "pixel_delta_bbox": bbox})
        sizes, placements = [], []
        reader = PdfReader(pdf)
        for number, page in enumerate(reader.pages, 1):
            def text_size(text, cm, tm, font, size):
                if text.strip():
                    sizes.append(size * math.sqrt(abs(cm[0]*cm[3]-cm[1]*cm[2])))
            def image_size(op, args, cm, tm):
                if op == b"Do":
                    placements.append({"page": number, "width_pt": math.hypot(cm[0], cm[1]),
                                       "height_pt": math.hypot(cm[2], cm[3])})
            page.extract_text(visitor_text=text_size, visitor_operand_before=image_size)
        assert min(sizes) >= 11.99
        svgs = [Path(a["path"]) for a in record["assets"] if a["path"].endswith(".svg")]
        assert len(svgs) == len(placements)
        for svg, placement in zip(svgs, placements):
            element = ET.fromstring(svg.read_bytes())
            sx, sy = placement["width_pt"] / float(element.attrib["width"]), placement["height_pt"] / float(element.attrib["height"])
            assert abs(sx - sy) < .00001
            minimum = min(float(e.attrib["font-size"]) for e in element.iter() if e.tag.endswith("text")) * min(sx, sy)
            assert minimum >= 12
            placement.update(asset=svg.stem, minimum_placed_label_pt=minimum)
        result["documents"].append({"kind": kind, "md_sha256": b.digest(md), "html_sha256": b.digest(hp),
                                     "pdf_sha256": b.digest(pdf), "R4_pdf_sha256": old_sha,
                                     "full_DOM_equal_after_exact_criteria_removal": True,
                                     "pages": page_rows, "old_page_count": len(old_manifest["rendered_pages"]),
                                     "minimum_printed_text_pt": min(sizes), "placements": placements,
                                     "manifest_sha256": b.digest(proof / "manifest.json")})
    expected_changed = {str((b.LESSON_REL / f"{b.STEM} – antwoorden.{ext}").as_posix()) for ext in ("md", "html", "pdf")}
    changed = set(subprocess.check_output(["git", "-c", "core.quotepath=false", "diff", "--name-only", BASE], cwd=LESSONS).decode("utf-8").splitlines())
    assert changed == expected_changed, changed
    result["exact_lesson_changed_paths"] = sorted(changed)
    protected = [*FOLDER.glob("2.1.1-*.md"), FOLDER / "2.1.1-quality-ref.yaml", FOLDER / "build_pdf.py",
                 FOLDER.parent / "_chapter-plan.md", FOLDER.parent.parent / "_book-plan.md"]
    result["protected"] = []
    for path in protected:
        assert path.read_bytes() == previous(path)
        result["protected"].append({"path": str(path.relative_to(LESSONS)), "sha256": b.digest(path)})
    archive = FOLDER / f"{b.STEM} – opgaven.zip"
    assert archive.read_bytes() == previous(archive)
    result["legacy_zip"] = {"sha256": b.digest(archive), "unchanged": True, "current_deliverable": False,
                            "reason": "No native 211 ZIP contract; historical archive excluded"}
    path = write_new("mechanical-r5", result)
    print(json.dumps({"evidence": str(path), "sha256": b.digest(path),
                      "pages": {d["kind"]: len(d["pages"]) for d in result["documents"]}}))


def rebuild():
    build = json.loads(BUILD_PATH.read_text(encoding="utf-8"))
    files = native_files()
    before = {str(p.relative_to(LESSONS)): b.digest(p) for p in files}
    b.build(LESSONS)
    assert before == {str(p.relative_to(LESSONS)): b.digest(p) for p in files}, "full native reproduction differs"
    for record in build["documents"]:
        build_document(Path(record["source_md"]))
        verify_record_freshness(record)
    assert before == {str(p.relative_to(LESSONS)): b.digest(p) for p in files}, "native print-only reproduction differs"
    path = write_new("reproduction-r5", {"native_full_identical": True, "native_print_only_identical": True,
                                        "files": before, "ZIP_contract": "not applicable"})
    print(json.dumps({"evidence": str(path), "sha256": b.digest(path), "files": len(files)}))


if __name__ == "__main__":
    {"capture": capture, "verify": verify, "rebuild": rebuild}[sys.argv[1]]()
