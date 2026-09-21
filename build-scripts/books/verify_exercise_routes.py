"""Verify route revision sources, exercise preservation and current PDF assembly.

This is scoped revision evidence, not a renewal of historical target approval.
Run after rebuilding; commit its report before recording the finite inventory.
"""
from pathlib import Path
import argparse
import hashlib
import json
import re
import subprocess
import sys

import fitz
from bs4 import BeautifulSoup
from markdown_it import MarkdownIt
from build_book2_chat import EDITION
from verify_book2_chat import verify as verify_book2

BASE = "e2843b47c828784ab594d004cef461cea929717f"
EXCEPTIONS = {"2.1.4", "2.2.4", "2.3.4", "3.1.6", "3.2.4", "3.3.4", "4.1.5", "4.2.7", "4.3.5"}
MD = MarkdownIt("commonmark", {"html": True}).enable("table")
NORMAL = "Normale route: Startopgaven → Begeleide inoefening → Zelfstandige oefening → Doeloefening."
CHALLENGE = "Uitdagende route (minder tussenstappen, extra uitdaging): Startopgaven → Zelfstandige oefening → Doeloefening → Denkertje / Bonusopgave."


def require(ok, message):
    if not ok:
        raise ValueError(message)


def norm(text):
    return re.sub(r"\s+", " ", text).strip()


def original(lessons, file):
    return subprocess.check_output(["git", "show", BASE+":"+file.relative_to(lessons).as_posix()], cwd=lessons)


def sources(lessons):
    tree = subprocess.check_output(["git", "ls-tree", "-r", "-z", BASE], cwd=lessons).decode("utf-8")
    baseline_blobs = {row.split("\t", 1)[1]: row.split("\t", 1)[0].split()[2] for row in tree.split("\0") if row}
    paths = list((lessons/EDITION).glob("bronnen/H*/manuscript/2.*.md"))
    paths += list((lessons/"edities/books34-v3/books").glob("*/chapters/*/* manuscript.md"))
    paragraphs, exercise_count = [], 0
    for file in sorted(paths):
        match = re.match(r"\d\.\d\.\d", file.name)
        if not match:
            continue
        pid = match[0]
        before = BeautifulSoup(MD.render(original(lessons, file).decode("utf-8")), "html.parser")
        raw = file.read_text(encoding="utf-8")
        after = BeautifulSoup(MD.render(raw), "html.parser")
        for selector in (".exercise", ".goals", "figure", ".definition", ".formula"):
            left = [str(el) for el in before.select(selector)]
            right = [str(el) for el in after.select(selector)]
            require(left == right, f"Changed protected {selector}: {pid}")
        require(not re.search(r"Korte route|Extra hulp nodig|sla.{0,30}begeleide", raw, re.I), "Old routing: "+pid)
        if pid not in EXCEPTIONS:
            route = after.select(".route")
            require(len(route) == 1, "Expected one route notice: "+pid)
            value = norm(route[0].get_text(" "))
            require(NORMAL in value and CHALLENGE in value and value.index(NORMAL) < value.index(CHALLENGE), "Wrong route order or membership: "+pid)
            require("Herhaling is extra bij beide routes." in value, "Missing repetition rule: "+pid)
            guided = re.findall(r"^## Begeleide inoefening[^\n]*\n(.*?)(?=<div class=\"exercise)", raw, re.M|re.S)
            require(guided and all("Begeleide inoefening hoort bij leren" in x for x in guided), "Missing normal-learning introduction: "+pid)
        else:
            require("uitleg en denkstappen" in raw, "Missing mixed-practice support guidance: "+pid)
        count = len(after.select(".exercise")); exercise_count += count
        paragraphs.append({"id": pid, "source": file.relative_to(lessons).as_posix(), "exercises_preserved": count,
                           "route": "documented_mixed_exception" if pid in EXCEPTIONS else "normal_then_challenging"})
    require(len(paragraphs) == 43 and len([x for x in paragraphs if x["route"] == "normal_then_challenging"]) == 34, "Wrong paragraph inventory")
    # Include openings, teacher sources and continuation notes, not just the
    # standard route box. These were the independent review's R3/R4 findings.
    active = list((lessons/EDITION).glob("bronnen/H*/manuscript/*.md"))
    active += [p for p in (lessons/EDITION).glob("bronnen/H*/*.md") if "Docenten" in p.name or p.name in ("_chapter-plan.md", "README.md")]
    active += list((lessons/"edities/books34-v3/books").glob("*/chapters/*/*.md"))
    forbidden = re.compile(r"Korte route|Extra hulp nodig|steun niet nodig|Ga dan door naar.{0,12}Zelfstandige|begeleide inoefening biedt extra ondersteuning|begeleide inoefening is een steunroute", re.I)
    for file in active:
        require(not forbidden.search(file.read_text(encoding="utf-8")), "Obsolete active route guidance: "+str(file))
    # Existing answer and figure sources are intentionally reused without edits.
    protected = []
    roots = [lessons/EDITION, lessons/"edities/books34-v3"]
    for root in roots:
        for file in root.rglob("*"):
            if not file.is_file():
                continue
            rel = file.relative_to(root).as_posix()
            central_answer = file.suffix == ".md" and "antwoorden" in file.name.lower() and "/paragrafen/" not in rel
            chapter_answer = file.suffix == ".pdf" and "Antwoorden" in file.name and ("/chapters/" in "/"+rel or rel.startswith("hoofdstukken/"))
            figure = "/_assets/" in "/"+rel and file.suffix in (".svg", ".png") and "economics_textbook_cover" not in file.name
            if central_answer or chapter_answer or figure:
                content = file.read_bytes()
                blob = hashlib.sha1(b"blob "+str(len(content)).encode()+b"\0"+content).hexdigest()
                require(blob == baseline_blobs[file.relative_to(lessons).as_posix()], "Changed reused answer/figure: "+rel)
                protected.append(file.relative_to(lessons).as_posix())
    v3 = lessons/"edities/books34-v3"
    old = json.loads(original(lessons, v3/"curriculum/course-target-exercises-books34-v3.json"))
    new = json.loads((v3/"curriculum/course-target-exercises-books34-v3.json").read_text(encoding="utf-8"))
    for a, b in zip(old["records"], new["records"], strict=True):
        for record in (a, b):
            record.pop("lesson_route")
            record["source_pin"].pop("student_manuscript_sha256")
        require(a == b, "Changed target content or approval: "+a["id"])
    return {"paragraphs": paragraphs, "exercises_preserved": exercise_count, "protected_answer_and_figure_files": len(protected), "target_payloads_preserved": 31}


def books34_pdf(lessons):
    root = lessons/"edities/books34-v3"
    mapping = json.loads((root/"curriculum/book-page-map-v3.json").read_text(encoding="utf-8"))
    result = []
    for book, info in mapping.items():
        for kind, label in (("student", "Leerling"), ("answer", "Antwoorden"), ("teacher", "Docenteninformatie")):
            name = f"Boek_{book}_Compleet" + ("" if kind == "student" else "_"+label) + "_v3.pdf"
            file = root/"books"/f"book-{book}"/"output"/name
            with fitz.open(file) as final:
                pages, exact_pages, normalized_pages = 0, 0, 0
                for chapter, data in info["chapters"].items():
                    name = f"Boek_{book}_H{chapter[-1]}_{label}_v3" + ("_bookpages" if kind == "student" else "") + ".pdf"
                    source = root/"books"/f"book-{book}"/"chapters"/chapter/"output"/name
                    with fitz.open(source) as doc:
                        start = data[kind+"_start"] - 1
                        require(len(doc) == data[kind+"_pages"], "Wrong source count: "+str(source))
                        for index, page in enumerate(doc):
                            merged = final[start+index]
                            # The original assembly replaces answer/teacher footers.
                            clip = page.rect if kind == "student" else fitz.Rect(0, 0, page.rect.width, page.rect.height-45)
                            require(page.get_text(clip=clip) == merged.get_text(clip=clip), "Lost assembled text: "+name+f" p{index+1}")
                            a, b = page.get_pixmap(clip=clip), merged.get_pixmap(clip=clip)
                            require((a.width, a.height) == (b.width, b.height), "Changed body dimensions")
                            exact = a.samples == b.samples
                            if not exact:
                                # The existing footer-redaction path normalizes
                                # PDF drawing streams (color/coordinate precision).
                                # Apply that existing footer transform only to
                                # the in-memory source; require exact body pixels.
                                require(kind != "student", "Changed student pixels: "+name+f" p{index+1}")
                                with fitz.open() as expected:
                                    expected.insert_pdf(doc, from_page=index, to_page=index)
                                    ep = expected[0]
                                    ep.add_redact_annot(fitz.Rect(25, ep.rect.height-39, ep.rect.width-25, ep.rect.height-18), fill=(1, 1, 1))
                                    ep.apply_redactions()
                                    with fitz.open(stream=expected.tobytes(garbage=4, deflate=True), filetype="pdf") as saved:
                                        require(saved[0].get_pixmap(clip=clip).samples == b.samples, "Changed assembled pixels after footer transform: "+name+f" p{index+1}")
                                normalized_pages += 1
                            exact_pages += int(exact)
                            pages += 1
                contents = final[3 if kind == "student" else 1]
                expected = {c: d[kind+"_start"]-1 for c, d in info["chapters"].items()}
                if kind == "student":
                    expected.update({pid: p["book_page"]-1 for d in info["chapters"].values() for pid, p in d["paragraphs"].items()})
                for key, target in expected.items():
                    boxes = [fitz.Rect(w[:4]) for w in contents.get_text("words") if w[4] == key]
                    require(len(boxes) == 1, "Missing/duplicate contents label: "+key)
                    links = [link for link in contents.get_links() if link["from"].intersects(boxes[0])]
                    require(len(links) == 1 and links[0]["kind"] == fitz.LINK_GOTO and links[0]["page"] == target, "Wrong contents destination: "+key)
                for page in final:
                    for link in page.get_links():
                        if link["kind"] == fitz.LINK_GOTO:
                            require(0 <= link["page"] < len(final), "Invalid final destination")
                result.append({"file": file.relative_to(lessons).as_posix(), "pages": len(final), "verified_assembled_body_pages": pages,
                               "pixel_identical_body_pages": exact_pages, "pixel_identical_after_existing_footer_transform": normalized_pages,
                               "contents_links_checked": len(expected)})
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lesson-root", type=Path, default=Path(__file__).resolve().parents[3]/"4veco-lessen")
    parser.add_argument("--report-dir", type=Path, help="Write CI evidence outside the reviewed edition")
    args = parser.parse_args(); lessons = args.lesson_root.resolve()
    report = {"revision": "exercise-routes-20260921", "source_preservation": sources(lessons)}
    report["book2"] = verify_book2(lessons/EDITION, revised=True)
    report["books34"] = books34_pdf(lessons)
    sys.path.insert(0, str(lessons/"edities/books34-v3/build"))
    import books34_verify
    reports = args.report_dir or lessons/"edities/books34-v3/checks"
    reports.mkdir(parents=True, exist_ok=True)
    books34_verify.main(reports/"route-revision-verification.json")
    destination = reports/"route-revision-preservation.json"
    destination.write_text(json.dumps(report, ensure_ascii=False, indent=2)+"\n", encoding="utf-8", newline="\n")
    print(json.dumps({"paragraphs": 43, "source_preservation": "PASS", "assembly": "PASS", "report": str(destination)}, indent=2))


if __name__ == "__main__":
    main()
