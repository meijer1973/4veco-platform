"""Reproduce only the accepted Book 2 §2.1.1 Part A paper artifacts.

Content lives in 211/*.md; immutable goals/target/short answers come directly
from the registry. Shared formatting/proof stays in print_pipeline.py.
"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import subprocess
import sys
from pathlib import Path

from print_pipeline import build_document, digest, render_proof

ROOT = Path(__file__).resolve().parents[3]
CONTENT = Path(__file__).with_name("211")
LESSON_REL = Path("Boek 2 - Kosten, opbrengsten, elasticiteit en surplus") / "2.1 Hoofdstuk Kosten en opbrengsten" / "2.1.1 Kostenstructuren"
STEM = "2.1.1 Kostenstructuren"
TARGET_HASH = "143f1053c98766b77d9d9ce573a5c8e976980f900387159312c3238288d71710"
PLAN_HASH = "f46c7aa444ba6fef1f6f885b34bd52963fccac3cdc7b13b898eb6665219c4cd0"
CHAPTER_HASH = "ef3f872f5caa2de1359639983d8e4907a34cfcbc80a0309826cff07201e49116"
HEADINGS = ["Uitgewerkt voorbeeld", "Startopgaven", "Begeleide inoefening",
            "Zelfstandige oefening", "Doeloefening", "Denkertje / Bonusopgave",
            "Herhaling / Herhaling en interleaving"]
ORANGE, BLUE, PURPLE, INK = "#E67E22", "#1A5276", "#8E44AD", "#182b3a"


def lf_hash(path: Path) -> str:
    return hashlib.sha256(path.read_text(encoding="utf-8-sig").replace("\r\n", "\n").replace("\r", "\n").encode()).hexdigest()


def target_record() -> dict:
    registry = json.loads((ROOT / "references/authored/course-target-exercises.json").read_text(encoding="utf-8-sig"))
    matches = [record for record in registry["exercises"] if record["id"] == "2.1.1"]
    if len(matches) != 1:
        raise ValueError("Expected exactly one target record")
    record = matches[0]
    actual = hashlib.sha256(json.dumps(record, ensure_ascii=False, separators=(",", ":")).encode()).hexdigest()
    if actual != TARGET_HASH:
        raise ValueError(f"Frozen target changed: {actual}")
    return record


def table(columns: list[str], rows: list[list[str]]) -> str:
    if any(len(row) != len(columns) for row in rows):
        raise ValueError("Mismatched table widths")
    return "\n".join("| " + " | ".join(row) + " |" for row in [columns, ["---"] * len(columns), *rows])


def serialize_target(record: dict) -> str:
    target = record["target_exercise"]
    source = target["sources"][0]
    chunks = ["**Opgave 7**", target["context"],
              table(source["columns"], source["rows"]), source["content"]]
    chunks.extend(f"{q['label']}) **({q['points']} punten)** {q['prompt']}" for q in target["subquestions"])
    return "\n\n".join(chunks)


def serialize_target_answers(record: dict) -> str:
    source = (CONTENT / "target-answers.md").read_text(encoding="utf-8")
    for question in record["target_exercise"]["subquestions"]:
        label = question["label"]
        source = source.replace("{{ANSWER_" + label + "}}", record["short_answer_model"][label])
    return source


def documents(record: dict) -> dict[str, str]:
    exercises = (CONTENT / "exercises.md").read_text(encoding="utf-8")
    exercises = exercises.replace("{{TARGET}}", serialize_target(record))
    goals = "\n".join(f"{i}. {goal}" for i, goal in enumerate(record["lesson_goals"], 1))
    theory = (CONTENT / "theory.md").read_text(encoding="utf-8").replace("{{GOALS}}", goals)
    answers = (CONTENT / "answers.md").read_text(encoding="utf-8").replace("{{TARGET_ANSWERS}}", serialize_target_answers(record))
    result = {"paragraaf": theory.rstrip() + "\n\n" + exercises,
              "opgaven": f"# {STEM} – opgaven\n\n" + exercises,
              "antwoorden": answers}
    for kind, value in result.items():
        if "{{" in value or "}}" in value:
            raise ValueError(f"Unresolved placeholder in {kind}")
        # Pandoc otherwise converts a) into an ordered list displayed as 1.
        # Escape presentation syntax, never the frozen prompt or source cells.
        value = re.sub(r"^([a-z])\) ", r"\1\\) ", value, flags=re.M)
        # These three short calculation lines form one answer row, not three
        # unrelated bullets to distribute across a page boundary.
        value = re.sub(r"(?m)(^- GCK[^\n]*\n- GVK[^\n]*\n- GTK[^\n]*(?:\n|$))",
                       r'::: {style="break-inside: avoid"}\n\n\1\n:::\n', value)
        result[kind] = layout_tables(value)
    return result


def layout_tables(markdown: str) -> str:
    """Explicit paragraph-owned column geometry and blank-cell writing room."""
    def convert(match):
        rows = [[cell.strip() for cell in row.strip().strip("|").split("|")]
                for row in match.group().strip().splitlines()]
        columns, data = rows[0], rows[2:]
        classification = len(columns) == 3 and "reden" in columns[-1].lower()
        rubric = columns == ["Onderdeel", "Maximum", "Waar let je op?"]
        widths = [34, 23, 43] if classification else [18, 17, 65] if rubric else [100 / len(columns)] * len(columns)
        result = ['<table style="break-inside:avoid">', "<colgroup>"]
        result += [f'<col style="width:{width:g}%">' for width in widths]
        result += ["</colgroup>", "<thead><tr>" + "".join(f"<th>{html.escape(cell)}</th>" for cell in columns) + "</tr></thead>", "<tbody>"]
        for row in data:
            height = (' style="height:18mm"' if classification else ' style="height:12mm"') if any(not cell for cell in row) else ""
            result.append(f"<tr{height}>" + "".join(f"<td>{html.escape(cell)}</td>" for cell in row) + "</tr>")
        return "\n".join([*result, "</tbody>", "</table>"]) + "\n"
    return re.sub(r"(?m)^\|[^\n]+\|\r?\n\|(?:\s*:?-+:?\s*\|)+\r?\n(?:\|[^\n]+\|(?:\r?\n|$))+", convert, markdown)


def text(x: float, y: float, value: str, *, size: int = 22, color: str = INK,
         anchor: str = "start", bold: bool = False) -> str:
    # Chapter orange identifies cost marks, not low-contrast small text.
    # Dark direct labels remain legible in grayscale at final print size.
    if color == ORANGE:
        color = INK
    return f'<text x="{x:g}" y="{y:g}" font-size="{size}" fill="{color}" text-anchor="{anchor}" font-weight="{"700" if bold else "400"}">{html.escape(value)}</text>'


def line(x1: float, y1: float, x2: float, y2: float, color: str = INK,
         width: float = 2, dash: str = "") -> str:
    return f'<line x1="{x1:g}" y1="{y1:g}" x2="{x2:g}" y2="{y2:g}" stroke="{color}" stroke-width="{width:g}" stroke-dasharray="{dash}"/>'


def svg(body: str, height: int, title: str) -> str:
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="720" height="{height}" viewBox="0 0 720 {height}" role="img" aria-labelledby="title">'
            f'<title id="title">{html.escape(title)}</title>'
            f'<rect width="720" height="{height}" rx="8" fill="#F7FAFC"/>'
            f'<g font-family="Arial,DejaVu Sans,sans-serif">{body}</g></svg>\n')


def total_panel(y0: int, title: str, relations: tuple[str, ...]) -> str:
    # One transform for every graph mark. Only the approved Q40..80 domain.
    def coord(q: float, cost: float) -> tuple[float, float]:
        return 100 + (q - 40) / 40 * 450, y0 + 290 - cost / 300 * 200
    parts = [text(24, y0 + 31, title, size=25, bold=True),
             text(100, y0 + 64, "Totale kosten (euro per maand)", size=21),
             line(100, y0 + 85, 100, y0 + 290), line(100, y0 + 290, 550, y0 + 290),
             text(325, y0 + 349, "Q (posters per maand)", anchor="middle", size=22)]
    for cost in (0, 100, 200, 300):
        x, y = coord(40, cost)
        parts += [line(x - 5, y, x, y), text(x - 12, y + 7, str(cost), anchor="end", size=21)]
    for q in (40, 80):
        x, y = coord(q, 0)
        parts += [line(x, y, x, y + 5), text(x, y + 26, str(q), anchor="middle", size=21)]
    functions = {"TCK": (lambda q: 120, ORANGE, "9 5"),
                 "TVK": (lambda q: 2 * q, BLUE, "3 4"),
                 "TK": (lambda q: 120 + 2 * q, ORANGE, "")}
    for name in relations:
        fn, color, dash = functions[name]
        x1, y1 = coord(40, fn(40))
        x2, y2 = coord(80, fn(80))
        parts += [line(x1, y1, x2, y2, color, 3.5, dash),
                  f'<circle cx="{x1:g}" cy="{y1:g}" r="4" fill="{color}"/>',
                  f'<circle cx="{x2:g}" cy="{y2:g}" r="4" fill="{color}"/>',
                  text(x2 + 13, y2 + 7, f"{name} {fn(80)}", color=color, size=21, bold=True)]
    return "".join(parts)


def asset_sources() -> dict[str, str]:
    parts = [text(24, 32, "Van totale naar gemiddelde kosten", size=27, bold=True),
             text(360, 70, "Dezelfde maand, dezelfde positieve Q", anchor="middle")]
    for x, total, average, color in [(125, "TCK", "GCK", ORANGE), (360, "TVK", "GVK", BLUE), (595, "TK", "GTK", PURPLE)]:
        parts += [text(x, 125, total, size=32, anchor="middle", bold=True, color=ORANGE if total == "TK" else color),
                  text(x, 157, "euro/maand", size=22, anchor="middle"),
                  line(x, 173, x, 225, color, 3), line(x - 7, 215, x, 225, color, 3),
                  line(x + 7, 215, x, 225, color, 3),
                  text(x + 18, 207, "/ Q", size=22, color=color),
                  text(x, 267, average, size=32, anchor="middle", bold=True, color=color),
                  text(x, 300, "euro/poster", size=22, anchor="middle")]
    parts += [text(242, 125, "+", size=28, anchor="middle"), text(475, 125, "=", size=28, anchor="middle"),
              text(242, 267, "+", size=28, anchor="middle"), text(475, 267, "=", size=28, anchor="middle")]
    result = {"2.1.1_fig_1": svg("".join(parts), 330, "Totale kosten gedeeld door Q geven gemiddelde kosten")}
    result["2.1.1_fig_2"] = svg(total_panel(0, "Eerst TCK: 120 → 120", ("TCK",)), 366, "TCK bij 40 en 80 posters")
    result["2.1.1_fig_3"] = svg(
        total_panel(0, "A. Voeg TVK toe: 80 → 160", ("TCK", "TVK")) +
        line(24, 367, 696, 367, "#94a5ad") +
        total_panel(378, "B. Voeg TK toe: 200 → 280", ("TCK", "TVK", "TK")),
        744, "TVK en daarna TK toegevoegd op dezelfde schalen")
    parts = [text(24, 32, "Wat gebeurt er per poster?", size=27, bold=True),
             text(305, 79, "Q = 40", anchor="middle", bold=True),
             text(580, 79, "Q = 80", anchor="middle", bold=True)]
    for i, (name, a, b, reason, color) in enumerate([
        ("GCK", "€ 3,00", "€ 1,50", "dezelfde TCK / tweemaal Q", ORANGE),
        ("GVK", "€ 2,00", "€ 2,00", "hetzelfde bedrag per poster", BLUE),
        ("GTK", "€ 5,00", "€ 3,50", "GCK + GVK", PURPLE)]):
        y = 117 + i * 80
        parts += [text(30, y, name, bold=True, color=color, size=26),
                  text(305, y, a, anchor="middle", size=26), text(442, y, "→", anchor="middle", size=28),
                  text(580, y, b, anchor="middle", size=26),
                  text(305, y + 30, reason, size=20, color=color)]
    parts.append(text(24, 352, "Alle bedragen: euro per poster; één maand, zelfde capaciteit.", size=20))
    result["2.1.1_fig_4"] = svg("".join(parts), 372, "GCK halveert, GVK blijft gelijk, GTK halveert niet")
    parts = [text(24, 32, "Het fietsenatelier: kies de juiste teller", size=26, bold=True),
             text(24, 66, "Q is het aantal reparaties per maand.", size=22)]
    for x, label in [(60, "Q"), (185, "Kosten"), (345, "Constant"), (480, "Variabel"), (625, "Totaal")]:
        parts.append(text(x, 108, label, size=22, anchor="middle", bold=True))
    for y, q, kind, values in [
        (153, "100", "totaal", (200, 200, 400)), (197, "", "gemiddeld", (2, 2, 4)),
        (258, "200", "totaal", (200, 400, 600)), (302, "", "gemiddeld", (1, 2, 3))]:
        parts += [text(60, y, q, anchor="middle", bold=True),
                  text(185, y, kind, anchor="middle")]
        for x, value in zip((345, 480, 625), values):
            parts.append(text(x, y, str(value), anchor="middle", bold=True))
    parts += [line(24, 120, 696, 120, "#94a5ad"), line(24, 222, 696, 222, "#94a5ad"),
              text(24, 346, "Totalen: euro/maand. Gemiddelden: euro/reparatie.", size=21),
              text(24, 377, "Deel ieder totaal door de Q van diezelfde maand.", size=21, color=BLUE)]
    result["2.1.1_we_1"] = svg("".join(parts), 397, "Totalen en gemiddelden bij honderd en tweehonderd reparaties")
    parts = [text(24, 35, "Voorgedaan: huur € 120 per maand", size=26, bold=True),
             text(24, 80, "CONSTANT", color=ORANGE, bold=True, size=26),
             text(24, 117, "Meer badges? Het totale huurbedrag blijft € 120.", size=22),
             line(24, 141, 696, 141, "#94a5ad"),
             text(24, 180, "Maandbedrag → totaal", size=23, bold=True),
             text(24, 217, "Totaal / aantal badges → bedrag per badge", size=23),
             text(24, 255, "Deze maand, Q = 50–100, dezelfde capaciteit.", size=21)]
    result["2.1.1_ex_1"] = svg("".join(parts), 279, "Huur classificeren en totalen onderscheiden van kosten per badge")
    return result


def build(lesson_root: Path, proof_root: Path | None = None, *, sources_only: bool = False,
          proof_suffix: str = "") -> dict:
    if proof_suffix and not re.fullmatch(r"r[1-9][0-9]*", proof_suffix):
        raise ValueError("Proof suffix must be a revision such as r2")
    lesson_root = lesson_root.resolve(strict=True)
    destination = (lesson_root / LESSON_REL).resolve(strict=True)
    if destination.parent.parent.parent != lesson_root:
        raise ValueError("Unexpected paragraph output root")
    for filename, expected in [(destination / "2.1.1-textbook-plan.md", PLAN_HASH),
                               (destination.parent / "_chapter-plan.md", CHAPTER_HASH)]:
        if lf_hash(filename) != expected:
            raise ValueError(f"Reviewed plan pin differs: {filename}")
    for args in [
        ["node", "build-scripts/workflows/check-book-outline-currentness.js", "--require-approved",
         "--action", "paragraph_production", "--paragraph", "2.1.1"],
        ["node", "build-scripts/workflows/check-book2-target-authority-remediation.js", "--durable"],
    ]:
        subprocess.run(args, cwd=ROOT, check=True)
    record = target_record()
    asset_root = destination / "_assets"
    asset_root.mkdir(exist_ok=True)
    for name, source in asset_sources().items():
        svg_path = asset_root / f"{name}.svg"
        svg_path.write_text(source, encoding="utf-8", newline="\n")
        # CairoSVG and WeasyPrint use different native stacks on Windows.
        # A checked child process prevents shutdown-time DLL crashes and keeps
        # the SVG rasterization font environment identical for every rebuild.
        subprocess.run([sys.executable, "-m", "cairosvg", str(svg_path),
                        "-o", str(asset_root / f"{name}.png"), "-s", "2"], check=True)
    records = []
    for kind, markdown in documents(record).items():
        path = destination / f"{STEM} – {kind}.md"
        path.write_text(markdown.rstrip() + "\n", encoding="utf-8", newline="\n")
        if not sources_only:
            built = build_document(path)
            if proof_root:
                suffix = f"-{proof_suffix}" if proof_suffix else ""
                proof_dir = proof_root / f"211-{kind}-{built['pdf_sha256'][:12]}{suffix}"
                render_proof(built, proof_dir)
                built["proof_directory"] = str(proof_dir.resolve())
            records.append(built)
    inputs = [Path(__file__).resolve(), Path(__file__).with_name("print_pipeline.py"),
              *(CONTENT / name for name in ("theory.md", "exercises.md", "answers.md", "target-answers.md"))]
    return {"paragraph": "2.1.1", "target_record_sha256": TARGET_HASH,
            "plan_sha256": PLAN_HASH, "chapter_sha256": CHAPTER_HASH,
            "input_sources": [{"path": str(path), "sha256": digest(path)} for path in inputs],
            "inspection_status": "PENDING", "documents": records}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lesson-root", type=Path, default=ROOT.parent / "4veco-lessen")
    parser.add_argument("--proof-root", type=Path)
    parser.add_argument("--proof-suffix", default="", help="Fresh proof revision directory, e.g. r2")
    parser.add_argument("--sources-only", action="store_true")
    parser.add_argument("--manifest", type=Path, help="Write the exact build record, without review acceptance")
    args = parser.parse_args()
    record = build(args.lesson_root, args.proof_root, sources_only=args.sources_only,
                   proof_suffix=args.proof_suffix)
    if args.manifest:
        args.manifest.parent.mkdir(parents=True, exist_ok=True)
        args.manifest.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps(record, ensure_ascii=True, indent=2))


if __name__ == "__main__":
    main()
