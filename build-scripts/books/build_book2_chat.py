"""Reassemble the delivered Book 2 edition without reflowing chapter pages.

HOW TO ADAPT: this builder owns the bounded chat-2026 assembly, not the generic
paragraph renderer. Content, cover data and chapter order live in the lesson
edition's assembly.json. Chapter PDFs remain the delivered, reviewed inputs.
Dependencies: pypdf, reportlab, PyMuPDF (see requirements-book2-chat.txt).
"""
from __future__ import annotations

import argparse
from hashlib import sha256
from io import BytesIO
import json
from pathlib import Path
import tempfile

import fitz
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ArrayObject, NameObject
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

BOOK = "Boek 2 - Kosten, opbrengsten, elasticiteit en surplus"
EDITION = Path(BOOK) / "edities/chat-2026"
NAVY, AXIS = "#1A5276", "#2D3748"
TK, TO, SUPPLY = "#E67E22", "#7B2D8E", "#1E8449"
CS, PS = "#85C1E9", "#82E0AA"


def file_record(root: Path, path: Path) -> dict:
    data = path.read_bytes()
    return {"path": path.relative_to(root).as_posix(), "bytes": len(data),
            "sha256": sha256(data).hexdigest()}


def localize_links(reader: PdfReader) -> None:
    """Resolve chapter-local names before pypdf combines destination name trees.

    Keep destination arrays and external URI/GoToR actions unchanged. A missing
    name is a source error, never a reason to emit a silently broken link.
    """
    destinations = reader.named_destinations

    def resolve(value):
        if isinstance(value, str):
            if value not in destinations:
                raise ValueError(f"Unresolved chapter destination: {value}")
            return ArrayObject(destinations[value].dest_array)
        return value

    for page in reader.pages:
        for reference in page.get("/Annots", []):
            annotation = reference.get_object()
            if "/Dest" in annotation:
                annotation[NameObject("/Dest")] = resolve(annotation["/Dest"])
            action = annotation.get("/A")
            if action is not None:
                action = action.get_object()
                if action.get("/S") == "/GoTo":
                    action[NameObject("/D")] = resolve(action["/D"])


def append_chapters(writer: PdfWriter, chapters: list[tuple[str, PdfReader]]) -> None:
    """Preserve page content and give exported named destinations unique names."""
    named = []
    for prefix, reader in chapters:
        offset = len(writer.pages)
        for name, destination in reader.named_destinations.items():
            page = reader.get_destination_page_number(destination)
            if page is None or not 0 <= page < len(reader.pages):
                raise ValueError(f"Invalid chapter destination: {name}")
            named.append((f"{prefix}-{name}", offset + page, destination.dest_array[1:]))
        localize_links(reader)
        writer.append(reader)
    # append() imports the source name trees too. Replace that merged tree with
    # the chapter-qualified destinations; all annotations already use arrays.
    names = writer.root_object.get("/Names")
    if names is not None:
        names.get_object().pop("/Dests", None)
    writer.root_object.pop("/Dests", None)
    for name, page, view in named:
        writer.add_named_destination_array(name, ArrayObject([
            writer.pages[page].indirect_reference, *view,
        ]))


class CoverDrawing:
    """Vector charts in the cover background's 1055 x 1491 design coordinates."""
    def __init__(self, pdf):
        self.pdf = pdf

    def text(self, x, y, value, size=16, color=AXIS, bold=False, align="left"):
        c = self.pdf
        c.setFillColor(HexColor(color))
        c.setFont("Helvetica-Bold" if bold else "Helvetica", size)
        method = {"left": c.drawString, "right": c.drawRightString,
                  "center": c.drawCentredString}[align]
        method(x, 1491 - y, str(value))

    def line(self, points, color=AXIS, width=2, fill=None, dash=None):
        c = self.pdf
        c.setStrokeColor(HexColor(color))
        c.setLineWidth(width)
        c.setDash(dash or [])
        p = c.beginPath()
        p.moveTo(points[0][0], 1491 - points[0][1])
        for x, y in points[1:]:
            p.lineTo(x, 1491 - y)
        if fill:
            p.close()
            c.setFillColor(HexColor(fill))
        c.drawPath(p, stroke=int(not fill), fill=int(bool(fill)))
        c.setDash([])

    def dot(self, x, y, radius=4):
        self.pdf.setFillColor(HexColor(AXIS))
        self.pdf.circle(x, 1491-y, radius, stroke=0, fill=1)


def dutch(value, decimals=0):
    return f"{value:,.{decimals}f}".replace(",", "_").replace(".", ",").replace("_", ".")


def cover_pdf(root: Path, data: dict) -> bytes:
    output = BytesIO()
    c = canvas.Canvas(output, pagesize=A4, invariant=1)
    c.drawImage(str(root / data["background"]), 0, 0, width=A4[0], height=A4[1])
    c.saveState()
    c.scale(A4[0] / 1055, A4[1] / 1491)
    d = CoverDrawing(c)
    costs = data["costs"]
    fixed, variable, price = costs["fixed"], costs["variable_per_unit"], costs["price"]
    quantities = costs["quantities"]
    x = lambda q: 94 + q * 1.4
    y = lambda euro: 745 - euro * 0.06
    d.text(52, 533, "Bedrag (€ totaal)", size=16)
    d.line([(94, 548), (94, 745), (341, 745)])
    d.line([(90, 556), (94, 548), (98, 556)])
    d.line([(333, 741), (341, 745), (333, 749)])
    for value in [0, 500, 1000, 2000, 3000]:
        d.line([(88, y(value)), (94, y(value))], width=1)
        d.text(83, y(value)+5, dutch(value), size=14, align="right")
    for q in quantities:
        d.line([(x(q), 745), (x(q), 751)], width=1)
        d.text(x(q), 769, q, size=14, align="center")
    d.text(341, 788, "Q (stuks)", size=14, align="right")
    d.line([(x(q), y(fixed + variable*q)) for q in [0, 150]], TK, 3)
    d.line([(x(q), y(price*q)) for q in [0, 150]], TO, 3)
    d.text(314, y(fixed+variable*150)+5, "TK", color=TK, bold=True)
    d.text(314, y(price*150)+5, "TO", color=TO, bold=True)
    q_break = fixed / (price-variable)
    d.dot(x(q_break), y(price*q_break))
    d.text(62, 809, f"TK = {fixed} + {variable}Q", size=15, color=TK)
    d.text(249, 809, f"TO = {price}Q", size=15, color=TO)
    left, top, col, row = 52, 825, 60, 26
    c.setFillColor(HexColor("#DCECF4"))
    c.roundRect(left, 1491-(top+34+4*row), col*5, 34+4*row, 6, fill=1, stroke=0)
    for i, (name, unit) in enumerate([
        ("Q", "(stuks)"), ("TK", "(€)"), ("GTK", "(€/stuk)"),
        ("TO", "(€)"), ("W", "(€)"),
    ]):
        d.text(left+col*(i+0.5), top+15, name, size=15, bold=True, align="center")
        d.text(left+col*(i+0.5), top+29, unit, size=12, align="center")
    for i, q in enumerate(quantities):
        total, revenue = fixed+variable*q, price*q
        average = "–" if q == 0 else dutch(total/q, 0 if (total/q).is_integer() else 2)
        values = [str(q), dutch(total), average, dutch(revenue), dutch(revenue-total)]
        d.line([(left, top+34+row*i), (left+5*col, top+34+row*i)], "#FFFFFF", 1)
        for j, value in enumerate(values):
            d.text(left+col*(j+0.5), top+34+row*i+18, value, size=14, align="center")
    # Conceptual linear market: P_v = 18-Q, P_a = 2+Q; Q*=8, P*=10.
    market = data["market"]
    a, b = market["demand_intercept"], market["demand_slope"]
    s, t = market["supply_intercept"], market["supply_slope"]
    q_star = (a-s)/(b+t)
    p_star = s+t*q_star
    mx = lambda q: 727+17*q
    my = lambda p: 817-14*p
    equilibrium = (mx(q_star), my(p_star))
    d.line([(mx(0), my(a)), (mx(0), my(p_star)), equilibrium], fill=CS)
    d.line([(mx(0), my(s)), (mx(0), my(p_star)), equilibrium], fill=PS)
    d.line([(mx(0), my(a)), (mx(15), my(a-b*15))], NAVY, 3)
    d.line([(mx(0), my(s)), (mx(15), my(s+t*15))], SUPPLY, 3)
    d.line([(727, 541), (727, 817), (1015, 817)])
    d.line([(723, 549), (727, 541), (731, 549)])
    d.line([(1007, 813), (1015, 817), (1007, 821)])
    d.line([(mx(0), my(p_star)), equilibrium, (mx(q_star), 817)], dash=[7, 5], width=1.6)
    d.dot(*equilibrium, radius=5)
    d.text(709, 539, "P (€/stuk)", size=17)
    d.text(715, 835, "0", size=16, align="right")
    d.text(714, my(p_star)+6, "P*", size=18, align="right")
    d.text(mx(q_star), 842, "Q*", size=18, align="center")
    d.text(1023, 842, "Q (stuks)", size=16, align="right")
    d.text(966, 569, "Aanbod", size=18, color=SUPPLY)
    d.text(970, 793, "Vraag", size=18, color=NAVY)
    d.text(736, 656, "Consumenten-", size=12)
    d.text(736, 671, "surplus", size=12)
    d.text(736, 701, "Producenten-", size=14)
    d.text(736, 718, "surplus", size=14)
    c.restoreState()
    c.showPage()
    c.save()
    return output.getvalue()


def contents_pdf(config: dict, bundle: dict, counts: list[int]) -> bytes:
    output = BytesIO()
    c = canvas.Canvas(output, pagesize=A4, invariant=1)
    c.setTitle(bundle["title"])
    c.setFillColor(HexColor(NAVY))
    c.setFont("Helvetica-Bold", 24)
    c.drawString(71, 779, bundle["title"])
    c.setFont("Helvetica", 10)
    c.drawString(71, 757, bundle["subtitle"])
    c.setStrokeColor(HexColor("#83A5C8"))
    c.setLineWidth(0.8)
    c.roundRect(56, 51, 483, 675, 17, stroke=1, fill=0)
    page = 3
    for index, chapter in enumerate(config["chapters"]):
        top = 712-index*136
        c.setFillColor(HexColor("#E7F1F7"))
        c.roundRect(73, top-120, 448, 119, 9, stroke=0, fill=1)
        c.setFillColor(HexColor(NAVY))
        c.setFont("Helvetica-Bold", 14)
        c.drawString(85, top-9, chapter["title"])
        c.setFont("Helvetica", 8)
        c.drawRightString(505, top-9, f"PDF-pagina {page}")
        c.setFillColor(HexColor("#111111"))
        c.setFont("Helvetica", 8.5)
        c.drawString(85, top-26, chapter["description"] if bundle["kind"] == "student" else bundle["description"])
        if bundle["kind"] == "student":
            for number, title in enumerate(chapter["paragraphs"]):
                c.drawString(97, top-44-number*13, f"• 2.{index+1}.{number+1} {title}")
        page += counts[index]
    c.setFillColor(HexColor("#666666"))
    c.setFont("Helvetica", 8)
    c.drawString(71, 37, "PDF-pagina telt vanaf de omslag; de gedrukte paginanummers beginnen per hoofdstuk opnieuw.")
    c.showPage()
    c.save()
    return output.getvalue()


def revision_inputs(root: Path) -> dict:
    """Accept an explicit, source-bound chapter revision; never repin the receipt."""
    revision = json.loads((root / "route-chapter-inputs.json").read_text(encoding="utf-8"))
    if revision.get("revision") != "exercise-routes-20260921":
        raise ValueError("Unknown chapter revision")
    config = json.loads((root / "assembly.json").read_text(encoding="utf-8"))
    expected = {p for b in config["bundles"] for p in b["chapters"]}
    if set(revision["chapters"]) != expected:
        raise ValueError("Chapter revision must bind exactly the nine assembly chapters")
    sources = revision.get("sources", [])
    if not sources or len({r["path"] for r in sources}) != len(sources):
        raise ValueError("Missing or duplicate chapter source bindings")
    for record in [*sources, *revision["chapters"].values()]:
        path = root / record["path"]
        if not path.resolve().is_relative_to(root.resolve()) or ".." in Path(record["path"]).parts:
            raise ValueError("Unsafe chapter revision path")
        if file_record(root, path) != record:
            raise ValueError(f"Stale chapter revision input: {record['path']}")
    required = {p.relative_to(root).as_posix() for p in root.glob("bronnen/H*/manuscript/*.md")}
    if not required.issubset({r["path"] for r in sources}):
        raise ValueError("Chapter revision omits editable manuscripts")
    return revision


def build(root: Path, revised: bool = False) -> list[Path]:
    config = json.loads((root / "assembly.json").read_text(encoding="utf-8"))
    delivery = json.loads((root / "delivery-manifest.json").read_text(encoding="utf-8"))
    original = {r["path"]: r for r in delivery["files"]}
    if revised:
        original = revision_inputs(root)["chapters"]
    # Default reproduction retains the historical byte check. A revision must
    # explicitly bind new chapter inputs to the current editable sources.
    for bundle in config["bundles"]:
        for source in bundle["chapters"]:
            if file_record(root, root/source) != original[source]:
                # Delivery records can have extra provenance fields.
                current = file_record(root, root/source)
                if any(current[k] != original[source][k] for k in current):
                    raise ValueError(f"Chapter changed from delivery baseline: {source}")
    cover = cover_pdf(root, config["cover"])
    outputs = []
    with tempfile.TemporaryDirectory(prefix="book2-assembly-") as tmp:
        staging = Path(tmp)
        image_path = staging / "economics_textbook_cover_costs_and_surplus.png"
        with fitz.open(stream=cover, filetype="pdf") as document:
            document[0].get_pixmap(matrix=fitz.Matrix(2, 2)).save(str(image_path))
        pending = [(image_path, root/config["cover"]["preview"])]
        for bundle in config["bundles"]:
            chapters = [(f"h{i+1}", PdfReader(root/p)) for i, p in enumerate(bundle["chapters"])]
            counts = [len(reader.pages) for _, reader in chapters]
            if counts != bundle["page_counts"]:
                raise ValueError(f"Unexpected chapter page counts: {counts}")
            writer = PdfWriter()
            writer.append(PdfReader(BytesIO(cover)))
            writer.append(PdfReader(BytesIO(contents_pdf(config, bundle, counts))))
            append_chapters(writer, chapters)
            writer.add_metadata({"/Title": bundle["title"], "/Author": "4veco",
                                 "/Subject": "Boek 2 · chatuitgave 2026 · correcties 2026-09-20"})
            target = staging / Path(bundle["output"]).name
            writer.write(target)
            if len(PdfReader(target).pages) != sum(counts)+2:
                raise ValueError("Assembly page count changed")
            pending.append((target, root/bundle["output"]))
        for source, destination in pending:
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(source.read_bytes())
            outputs.append(destination)
    manifest = {
        "scope": "B2-01 through B2-04 assembly/cover repair; original delivery-manifest remains historical",
        "baseline_lesson_commit": config["baseline_lesson_commit"],
        "builder": "4veco-platform/build-scripts/books/build_book2_chat.py",
        "files": [file_record(root, path) for path in [
            root/"assembly.json", root/config["cover"]["background"], *outputs,
        ]],
    }
    if revised:
        manifest["scope"] = "Exercise-route revision; historical delivery and repair evidence retained"
        manifest["chapter_inputs_sha256"] = file_record(root, root/"route-chapter-inputs.json")["sha256"]
    (root / ("route-assembly-manifest.json" if revised else "repair-manifest.json")).write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2)+"\n", encoding="utf-8", newline="\n")
    return outputs


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lesson-root", type=Path,
                        default=Path(__file__).resolve().parents[3]/"4veco-lessen")
    parser.add_argument("--revised-chapters", action="store_true",
                        help="Use source-bound route-chapter-inputs.json; preserve historical repair manifest")
    args = parser.parse_args()
    for output in build(args.lesson_root.resolve()/EDITION, revised=args.revised_chapters):
        print(output)


if __name__ == "__main__":
    main()
