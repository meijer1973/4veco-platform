"""Reproduce only §2.2.1 Part A from its exact approved teaching plan.

Frozen goals, target and short answers are serialized, never independently
re-authored. Paragraph content/geometry are owned here; print_pipeline supplies
only the common rendering and pending-proof APIs.
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
CONTENT = Path(__file__).with_name("221")
LESSON_REL = Path("Boek 2 - Kosten, opbrengsten, elasticiteit en surplus") / "2.2 Hoofdstuk Elasticiteit" / "2.2.1 Prijselasticiteit"
STEM = "2.2.1 Prijselasticiteit"
TARGET_HASH = "61b54bde03d60be241092479cfcea8820e8187220f8f454dc9fef5045c8ea288"
PLAN_HASH = "29096bdedced016376a5ddf8a22c973ec5d61e8ce4822f390c2b746becca3345"
CHAPTER_HASH = "3a9db97518b1948eb0967d94653a10c693a0ca001e20b41503b864fd4cc7c2f7"
HEADINGS = ["Uitgewerkt voorbeeld", "Startopgaven", "Begeleide inoefening",
            "Zelfstandige oefening", "Doeloefening", "Denkertje / Bonusopgave",
            "Herhaling / Herhaling en interleaving"]
BLUE, INK, PALE = "#1A5276", "#182b3a", "#eef4f7"


def lf_hash(path: Path) -> str:
    return hashlib.sha256(path.read_text(encoding="utf-8-sig").replace("\r\n", "\n").replace("\r", "\n").encode()).hexdigest()


def target_record() -> dict:
    data = json.loads((ROOT / "references/authored/course-target-exercises.json").read_text(encoding="utf-8-sig"))
    records = [record for record in data["exercises"] if record["id"] == "2.2.1"]
    if len(records) != 1:
        raise ValueError("Expected one §221 target record")
    record = records[0]
    value = hashlib.sha256(json.dumps(record, ensure_ascii=False, separators=(",", ":")).encode()).hexdigest()
    if value != TARGET_HASH:
        raise ValueError(f"Frozen target changed: {value}")
    return record


def serialize_target(record: dict) -> str:
    target = record["target_exercise"]
    if target.get("sources"):
        raise ValueError("Frozen §221 target must remain prose-only")
    result = ["**Opgave 6**", target["context"]]
    result += [f"{q['label']}) **({q['points']} punten)** {q['prompt']}" for q in target["subquestions"]]
    return "\n\n".join(result)


def documents(record: dict) -> dict[str, str]:
    exercise = (CONTENT / "exercises.md").read_text(encoding="utf-8").replace("{{TARGET}}", serialize_target(record))
    goals = "\n".join(f"{n}. {goal}" for n, goal in enumerate(record["lesson_goals"], 1))
    theory = (CONTENT / "theory.md").read_text(encoding="utf-8").replace("{{GOALS}}", goals)
    target_answers = (CONTENT / "target-answers.md").read_text(encoding="utf-8")
    for label, answer in record["short_answer_model"].items():
        target_answers = target_answers.replace("{{ANSWER_" + label + "}}", answer)
    answers = (CONTENT / "answers.md").read_text(encoding="utf-8").replace("{{TARGET_ANSWERS}}", target_answers)
    outputs = {"paragraaf": theory.rstrip() + "\n\n" + exercise,
               "opgaven": f"# {STEM} – opgaven\n\n" + exercise,
               "antwoorden": answers}
    for kind, value in outputs.items():
        if "{{" in value or "}}" in value:
            raise ValueError(f"Unresolved source placeholder: {kind}")
        # Preserve literal a–d, not Pandoc's automatic list numbering.
        value = re.sub(r"^([a-z])\) ", r"\1\\) ", value, flags=re.M)
        value = format_tables(value)
        if kind in ("paragraaf", "opgaven"):
            # Keep each printed source/support with its own questions; preserve
            # the exact same content in both editions, without smaller type.
            for pattern in [
                r'(?ms)(^## Startopgaven\n.*?)(?=^## Begeleide inoefening)',
                r'(?ms)(^## Begeleide inoefening\n.*?)(?=^\*\*Opgave 4\*\*)',
                r'(?ms)(^\*\*Opgave 4\*\*\n.*?)(?=^## Zelfstandige oefening)',
                r'(?ms)(^## Zelfstandige oefening\n.*?)(?=^## Doeloefening)',
                r'(?ms)(^## Doeloefening\n.*?)(?=^## Denkertje / Bonusopgave)',
                r'(?ms)(^## Denkertje / Bonusopgave\n.*)\Z',
            ]:
                value = re.sub(pattern, r'<div style="break-inside:avoid">\n\n\1\n</div>\n\n', value)
        outputs[kind] = value
    return outputs


def format_tables(markdown: str) -> str:
    """Own bounded 221 column widths; never modify shared print CSS."""
    def convert(match):
        rows = [[cell.strip() for cell in line.strip().strip("|").split("|")]
                for line in match.group().strip().splitlines()]
        columns, data = rows[0], rows[2:]
        widths = [43, 17, 17, 23] if len(columns) == 4 else [50, 25, 25]
        if len(columns) != len(widths) or any(len(row) != len(columns) for row in data):
            raise ValueError("Unexpected §221 table shape")
        parts = ['<table style="break-inside:avoid">', '<colgroup>']
        parts += [f'<col style="width:{width}%">' for width in widths]
        parts += ['</colgroup>', '<thead><tr>' + ''.join(f'<th>{html.escape(c)}</th>' for c in columns) + '</tr></thead>', '<tbody>']
        parts += ['<tr>' + ''.join(f'<td>{html.escape(c)}</td>' for c in row) + '</tr>' for row in data]
        return '\n'.join([*parts, '</tbody></table>']) + '\n'
    return re.sub(r"(?m)^\|[^\n]+\|\r?\n\|(?:\s*:?-+:?\s*\|)+\r?\n(?:\|[^\n]+\|(?:\r?\n|$))+", convert, markdown)


def text(x, y, value, size=24, *, bold=False, anchor="start", color=INK):
    return (f'<text x="{x}" y="{y}" font-family="Arial, DejaVu Sans, sans-serif" '
            f'font-size="{size}" font-weight="{700 if bold else 400}" text-anchor="{anchor}" '
            f'fill="{color}">{html.escape(value)}</text>')


def line(x1, y1, x2, y2, *, dashed=False):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{INK}" stroke-width="2"' + (' stroke-dasharray="8 5"' if dashed else '') + '/>'


def bar(zero, y, value, scale, *, quantity=False):
    width = abs(value) * scale
    x = zero + min(0, value) * scale
    return (f'<rect x="{x:g}" y="{y}" width="{width:g}" height="25" '
            f'fill="{"url(#quantity)" if quantity else BLUE}" stroke="{INK}" stroke-width="2" '
            f'data-value="{value}" data-scale="{scale}" data-zero="{zero}"/>')


def svg(parts, height, description):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="720" height="{height}" viewBox="0 0 720 {height}" role="img">'
            f'<title>{html.escape(description)}</title><defs><pattern id="quantity" width="8" height="8" patternUnits="userSpaceOnUse">'
            f'<rect width="8" height="8" fill="{INK}"/><path d="M0 8L8 0" stroke="white" stroke-width="1.5"/></pattern></defs>'
            f'<rect width="720" height="{height}" fill="white"/>' + ''.join(parts) + '</svg>\n')


def magnitude_axis(y, zero=190, scale=190):
    parts = [line(zero, y, zero + 2 * scale, y)]
    for n in (0, 1, 2):
        x = zero + n * scale
        parts += [line(x, y - 5, x, y + 5), text(x, y + 30, str(n), size=22, anchor="middle")]
    parts += [text(605, y + 7, "|Ev|", size=24), line(zero + scale, y - 55, zero + scale, y, dashed=True)]
    return parts


def asset_sources() -> dict[str, str]:
    assets = {}
    parts = [text(24, 32, "Dezelfde prijsstijging, een andere reactie", size=27, bold=True),
             line(460, 80, 460, 320)]
    for title_y, label, values in [(72, "Fruitbox", (10, -5)), (218, "Oefenruimte", (10, -20))]:
        parts.append(text(24, title_y, label, size=25, bold=True))
        for offset, name, value, quantity in [(22, "Prijs", values[0], False), (66, "Hoeveelheid", values[1], True)]:
            y = title_y + offset
            parts += [text(24, y + 22, name, size=23), bar(460, y, value, 8, quantity=quantity),
                      text(594, y + 22, f'{"+" if value > 0 else "−"}{abs(value)}%', size=24, bold=True)]
    parts.append(line(300, 337, 540, 337))
    for value in (-20, -10, 0, 10):
        x = 460 + value * 8
        label = f'{"+" if value > 0 else "−" if value < 0 else ""}{abs(value)}'
        parts += [line(x, 332, x, 342), text(x, 368, label, size=22, anchor="middle")]
    parts += [text(580, 368, "%", size=24), text(24, 406, "Links: afname. Rechts: toename. Eén procentenschaal.", size=22)]
    assets["2.2.1_fig_1"] = svg(parts, 430, "Procentuele prijs- en hoeveelheidsveranderingen met teken op één schaal")
    parts = [text(24, 32, "Het teken geeft richting; |Ev| geeft de grootte", size=26, bold=True), line(360, 58, 360, 391)]
    for left, label, signed, magnitude, condition, classification, meaning in [
        (24, "Fruitbox", "−0,5", .5, "0,5 < 1", "prijsinelastisch", "minder sterk dan P."),
        (386, "Oefenruimte", "−2", 2, "2 > 1", "prijselastisch", "sterker dan P.")]:
        zero, scale = left + 10, 115
        parts += [text(left, 78, label, size=26, bold=True), text(left, 114, f'Ev = {signed}', size=24),
                  bar(zero, 146, magnitude, scale), line(zero, 190, zero + 2 * scale, 190)]
        for n in (0, 1, 2):
            x = zero + n * scale
            parts += [line(x, 185, x, 195), text(x, 226, str(n), size=22, anchor="middle")]
        parts += [line(zero + scale, 135, zero + scale, 190, dashed=True), text(left + 267, 195, '|Ev|', size=23),
                  text(left, 272, condition, size=26, bold=True), text(left, 308, classification, size=25, bold=True),
                  text(left, 347, 'Qv reageert procentueel', size=22), text(left, 380, meaning, size=22)]
    assets["2.2.1_fig_2"] = svg(parts, 406, "Twee vergelijkbare absolute-waardeschalen met grens één")
    parts = [text(24, 32, "A. Bowlplein: berekende reactie", size=27, bold=True), line(280, 62, 280, 153)]
    for y, name, value, quantity in [(73, "Prijs", 25, False), (117, "Hoeveelheid", -10, True)]:
        parts += [text(24, y + 22, name, size=23), bar(280, y, value, 8, quantity=quantity),
                  text(558, y + 22, f'{"+" if value > 0 else "−"}{abs(value)}%', bold=True)]
    parts += [line(200, 166, 480, 166)]
    for value in (-10, 0, 25):
        x = 280 + value * 8
        label = f'{"+" if value > 0 else "−" if value < 0 else ""}{abs(value)}'
        parts += [line(x, 161, x, 171), text(x, 199, label, size=22, anchor="middle")]
    parts += [text(538, 199, "%", size=24), text(24, 240, "Ev = −10% / +25% = −0,4", size=26, bold=True),
              line(24, 259, 696, 259), text(24, 291, "B. Vergelijk de absolute waarden", size=27, bold=True)]
    for y, label, signed, magnitude in [(310, "Bowlplein", "−0,4", .4), (375, "Klimhal", "−1,5", 1.5)]:
        parts += [text(24, y + 22, label, size=24, bold=True), bar(330, y, magnitude, 180),
                  text(180, y + 22, f'Ev = {signed}', size=22)]
    parts += [line(330, 419, 600, 419)]
    for value, label in [(0, "0"), (1, "1"), (1.5, "1,5")]:
        x = 330 + value * 180
        parts += [line(x, 414, x, 424), text(x, 452, label, size=22, anchor="middle")]
    parts += [line(510, 305, 510, 419, dashed=True), text(646, 424, "|Ev|", size=24),
              text(24, 489, "Klimhal: alleen Ev gegeven, geen losse percentages.", size=22)]
    assets["2.2.1_we_1"] = svg(parts, 511, "De berekende Bowlpleinreactie en de gegeven klimhalratio, zonder verzonnen percentages")
    return assets


def build(lesson_root: Path, proof_root: Path | None = None, *, sources_only=False, proof_suffix="") -> dict:
    if proof_suffix and not re.fullmatch(r"r[1-9][0-9]*", proof_suffix):
        raise ValueError("Proof suffix must be a revision such as r2")
    lesson_root = lesson_root.resolve(strict=True)
    destination = (lesson_root / LESSON_REL).resolve(strict=True)
    if destination.parent.parent.parent != lesson_root:
        raise ValueError("Unexpected §221 paragraph output root")
    for path, expected in [(destination / "2.2.1-textbook-plan.md", PLAN_HASH), (destination.parent / "_chapter-plan.md", CHAPTER_HASH)]:
        if lf_hash(path) != expected:
            raise ValueError(f"Reviewed plan pin differs: {path}")
    for command in [["node", "build-scripts/workflows/check-book-outline-currentness.js", "--require-approved", "--action", "paragraph_production", "--paragraph", "2.2.1"],
                    ["node", "build-scripts/workflows/check-book2-target-authority-remediation.js", "--durable"]]:
        subprocess.run(command, cwd=ROOT, check=True)
    record = target_record()
    assets = destination / "_assets"
    assets.mkdir(exist_ok=True)
    for name, source in asset_sources().items():
        path = assets / f"{name}.svg"
        path.write_text(source, encoding="utf-8", newline="\n")
        # Isolate CairoSVG's Windows native stack from the WeasyPrint process.
        subprocess.run([sys.executable, "-m", "cairosvg", str(path), "-o", str(path.with_suffix(".png")), "-s", "2"], check=True)
    records = []
    for kind, markdown in documents(record).items():
        path = destination / f"{STEM} – {kind}.md"
        path.write_text(markdown.rstrip() + "\n", encoding="utf-8", newline="\n")
        if not sources_only:
            built = build_document(path)
            if proof_root:
                suffix = f"-{proof_suffix}" if proof_suffix else ""
                proof_dir = proof_root / f"221-{kind}-{built['pdf_sha256'][:12]}{suffix}"
                render_proof(built, proof_dir)
                built["proof_directory"] = str(proof_dir.resolve())
            records.append(built)
    sources = [Path(__file__).resolve(), Path(__file__).with_name("print_pipeline.py"),
               *(CONTENT / name for name in ("theory.md", "exercises.md", "answers.md", "target-answers.md"))]
    return {"paragraph": "2.2.1", "target_record_sha256": TARGET_HASH, "plan_sha256": PLAN_HASH,
            "chapter_sha256": CHAPTER_HASH, "input_sources": [{"path": str(path), "sha256": digest(path)} for path in sources],
            "inspection_status": "PENDING", "documents": records}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lesson-root", type=Path, default=ROOT.parent / "4veco-lessen")
    parser.add_argument("--proof-root", type=Path)
    parser.add_argument("--proof-suffix", default="")
    parser.add_argument("--sources-only", action="store_true")
    parser.add_argument("--manifest", type=Path)
    args = parser.parse_args()
    result = build(args.lesson_root, args.proof_root, sources_only=args.sources_only, proof_suffix=args.proof_suffix)
    if args.manifest:
        args.manifest.parent.mkdir(parents=True, exist_ok=True)
        args.manifest.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps(result, ensure_ascii=True, indent=2))


if __name__ == "__main__":
    main()
