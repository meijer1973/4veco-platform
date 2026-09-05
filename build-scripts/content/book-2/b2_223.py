"""Reproduce the released §2.2.3 Part A payload; never imply independent acceptance."""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import subprocess
import sys
import zipfile
from pathlib import Path

from print_pipeline import build_document, digest, render_proof

ROOT = Path(__file__).resolve().parents[3]
CONTENT = Path(__file__).with_name("223")
STEM = "2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit"
TITLE = "2.2.3 Inkomenselasticiteit en kruislingse elasticiteit"
LESSON_REL = Path("Boek 2 - Kosten, opbrengsten, elasticiteit en surplus") / "2.2 Hoofdstuk Elasticiteit" / STEM
TARGET_HASH = "9a3a29bcedc16739b74b66b2bb8e136b37e86c7f5cfee3ee35ea37c4bdeed1c5"
PLAN_HASH = "dd2f91d0035829986076b7d5e96b43fa9c45f3d3698da1d159a955634fa01497"
CHAPTER_HASH = "3a9db97518b1948eb0967d94653a10c693a0ca001e20b41503b864fd4cc7c2f7"
PRIOR_PINS = {
    "2.2.1-textbook-handoff.md": "3a3357f0f1487fcc8376e5c9717f80d181f2d71c6069f647c6fa7ab71377f811",
    "2.2.1-review.md": "19bfa448b3c0f80732f2fa77617eb2772880747082fb683c8cd3852c74a96c63",
    "2.2.1-quality-ref.yaml": "4f0c77e9ae5769bb85c9c32dfa019049f6bccd323dfd0152b7eabf95897879fa",
    "2.2.1 Prijselasticiteit – paragraaf.md": "ae61910c6306ff6af9d52a57db060083ca64facadc4424f1d4a96708d71974db",
}
HEADINGS = ["Uitgewerkt voorbeeld", "Startopgaven", "Begeleide inoefening", "Zelfstandige oefening",
            "Doeloefening", "Denkertje / Bonusopgave", "Herhaling / Herhaling en interleaving"]
BLUE, INK, PALE = "#1A5276", "#182b3a", "#eef4f7"


def lf_hash(path: Path) -> str:
    return hashlib.sha256(path.read_text(encoding="utf-8-sig").replace("\r\n", "\n").replace("\r", "\n").encode()).hexdigest()


def target_record() -> dict:
    data = json.loads((ROOT / "references/authored/course-target-exercises.json").read_text(encoding="utf-8-sig"))
    records = [r for r in data["exercises"] if r["id"] == "2.2.3"]
    if len(records) != 1:
        raise ValueError("Expected exactly one §223 frozen target")
    record = records[0]
    actual = hashlib.sha256(json.dumps(record, ensure_ascii=False, separators=(",", ":")).encode()).hexdigest()
    if actual != TARGET_HASH:
        raise ValueError(f"Frozen target changed: {actual}")
    return record


def serialize_target(record: dict) -> str:
    target = record["target_exercise"]
    result = ["**Opgave 9**", target["context"]]
    for source in target["sources"]:
        result += [f"**Bron {source['id']}**", source["content"]]
    result += [f"{q['label']}) **({q['points']} punten)** {q['prompt']}" for q in target["subquestions"]]
    return "\n\n".join(result)


def format_tables(markdown: str) -> str:
    """Bounded paragraph-owned column geometry; shared CSS stays unchanged."""
    def convert(match):
        rows = [[c.strip() for c in line.strip().strip("|").split("|")]
                for line in match.group().strip().splitlines()]
        columns, data = rows[0], rows[2:]
        if len(columns) == 5:
            widths = [28, 14, 14, 19, 25]
        elif columns[0].startswith("Teller"):
            widths = [30, 28, 21, 21]
        elif columns[0] == "Situatie":
            widths = [34, 20, 20, 26]
        else:
            widths = [38, 14, 15, 33]
        if len(columns) != len(widths) or any(len(row) != len(columns) for row in data):
            raise ValueError("Unexpected §223 table shape")
        parts = ['<table style="break-inside:avoid">', '<colgroup>']
        parts += [f'<col style="width:{w}%">' for w in widths]
        parts += ['</colgroup>', '<thead><tr>' + ''.join(f'<th>{html.escape(c)}</th>' for c in columns) + '</tr></thead>', '<tbody>']
        parts += ['<tr>' + ''.join(f'<td>{html.escape(c)}</td>' for c in row) + '</tr>' for row in data]
        return '\n'.join([*parts, '</tbody></table>']) + '\n'
    return re.sub(r"(?m)^\|[^\n]+\|\r?\n\|(?:\s*:?-+:?\s*\|)+\r?\n(?:\|[^\n]+\|(?:\r?\n|$))+", convert, markdown)


def documents(record: dict) -> dict[str, str]:
    exercise = (CONTENT / "exercises.md").read_text(encoding="utf-8").replace("{{TARGET}}", serialize_target(record))
    goals = "\n".join(f"{n}. {goal}" for n, goal in enumerate(record["lesson_goals"], 1))
    theory = (CONTENT / "theory.md").read_text(encoding="utf-8").replace("{{GOALS}}", goals)
    target_answers = (CONTENT / "target-answers.md").read_text(encoding="utf-8")
    for label, answer in record["short_answer_model"].items():
        target_answers = target_answers.replace("{{ANSWER_" + label + "}}", answer)
    # d is a fully expanded exact-rational derivation, checked against every
    # mathematical/semantic assertion of its frozen short-answer entry in tests.
    answers = (CONTENT / "answers.md").read_text(encoding="utf-8").replace("{{TARGET_ANSWERS}}", target_answers)
    outputs = {"paragraaf": theory.rstrip() + "\n\n" + exercise,
               "opgaven": f"# {TITLE} – opgaven\n\n" + exercise,
               "antwoorden": answers}
    for kind, value in outputs.items():
        if "{{" in value or "}}" in value:
            raise ValueError(f"Unresolved source placeholder: {kind}")
        value = re.sub(r"^([a-z])\) ", r"\1\\) ", value, flags=re.M)
        value = format_tables(value)
        if kind in ("paragraaf", "opgaven"):
            # Keep each bounded support/source with the tasks it serves. The
            # long worked chain may span pages; none of its operations is cut.
            for pattern in [
                r'(?ms)(^## Startopgaven\n.*?)(?=^## Begeleide inoefening)',
                r'(?ms)(^## Begeleide inoefening\n.*?)(?=^\*\*Opgave 4\*\*)',
                r'(?ms)(^\*\*Opgave 4\*\*\n.*?)(?=^\*\*Opgave 5\*\*)',
                r'(?ms)(^\*\*Opgave 5\*\*\n.*?)(?=^## Zelfstandige oefening)',
                r'(?ms)(^## Zelfstandige oefening\n.*?)(?=^\*\*Opgave 7\*\*)',
                r'(?ms)(^\*\*Opgave 7\*\*\n.*?)(?=^## Doeloefening)',
                r'(?ms)(^## Doeloefening\n.*?)(?=^## Denkertje / Bonusopgave)',
                r'(?ms)(^## Denkertje / Bonusopgave\n.*)\Z',
                r'(?ms)(^### 2\. De prijs van een ander goed verandert\n.*?)(?=^### 3\.)',
            ]:
                value = re.sub(pattern, r'<div style="break-inside:avoid">\n\n\1\n</div>\n\n', value)
        else:
            # Keep each compact answer together; the detailed target occupies
            # two logical groups (a–c, d–e) at unchanged 12-point text.
            for pattern in [
                r'(?ms)(^\*\*Opgave 5\*\*\n.*?)(?=^## Zelfstandige oefening)',
                r'(?ms)(^\*\*Opgave 7\*\*\n.*?)(?=^\*\*Opgave 8\*\*)',
                r'(?ms)(^\*\*Opgave 8\*\*\n.*?)(?=^## Doeloefening)',
                r'(?ms)(^## Doeloefening\n.*?)(?=^d\\\) \*\*\(4 punten\)\*\*)',
                r'(?ms)(^d\\\) \*\*\(4 punten\)\*\*\n.*?)(?=^## Denkertje / Bonusopgave)',
                r'(?ms)(^## Denkertje / Bonusopgave\n.*)\Z',
            ]:
                value = re.sub(pattern, r'<div style="break-inside:avoid">\n\n\1\n</div>\n\n', value)
        outputs[kind] = value
    return outputs


def text(x, y, value, size=32, *, bold=False, anchor="start"):
    return (f'<text x="{x}" y="{y}" font-family="Arial, DejaVu Sans, sans-serif" '
            f'font-size="{size}" font-weight="{700 if bold else 400}" text-anchor="{anchor}" '
            f'fill="{INK}">{html.escape(value)}</text>')


def line(x1, y1, x2, y2, *, dashed=False):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{INK}" stroke-width="3"' + (' stroke-dasharray="8 5"' if dashed else '') + '/>'


def bar(zero, y, value, scale, *, quantity=False):
    return (f'<rect x="{zero + min(0, value) * scale:g}" y="{y}" width="{abs(value) * scale:g}" height="28" '
            f'fill="{"url(#quantity)" if quantity else BLUE}" stroke="{INK}" stroke-width="2" '
            f'data-value="{value}" data-scale="{scale}" data-zero="{zero}"/>')


def svg(parts, height, description):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="{height}" viewBox="0 0 1000 {height}" role="img">'
            f'<title>{html.escape(description)}</title><defs><pattern id="quantity" width="8" height="8" patternUnits="userSpaceOnUse">'
            f'<rect width="8" height="8" fill="{INK}"/><path d="M0 8L8 0" stroke="white" stroke-width="1.5"/></pattern></defs>'
            f'<rect width="1000" height="{height}" fill="white"/>' + ''.join(parts) + '</svg>\n')


def asset_sources() -> dict[str, str]:
    assets = {}
    parts = [text(24, 42, "Het inkomen stijgt 10%; de vraag reageert anders", size=36, bold=True), line(540, 88, 540, 485)]
    for y, label, change in [(88, "Picknickmanden", 15), (225, "Lunchpakketten", -5), (362, "Schriften", 5)]:
        parts.append(text(24, y + 30, label, bold=True))
        for offset, name, value, quantity in [(44, "Y", 10, False), (92, "Qv", change, True)]:
            parts += [text(370, y + offset + 26, name), bar(540, y + offset, value, 18, quantity=quantity),
                      text(856, y + offset + 26, f'{"+" if value > 0 else "−"}{abs(value)}%', bold=True)]
    parts.append(line(450, 516, 810, 516))
    for value in (-5, 0, 5, 10, 15):
        x = 540 + value * 18
        label = f'{"+" if value > 0 else "−" if value < 0 else ""}{abs(value)}'
        parts += [line(x, 509, x, 523), text(x, 559, label, anchor="middle")]
    parts += [text(860, 559, "%"), text(24, 610, "Eén schaal. Links van nul: afname. Rechts: toename.")]
    assets["2.2.3_fig_1"] = svg(parts, 640, "Inkomens- en hoeveelheidsveranderingen op één getekende procentenschaal")

    parts = [text(24, 42, "Ei: behoud het teken en controleer de grenzen", size=36, bold=True), line(95, 160, 905, 160)]
    for n in (-1, 0, 1, 2):
        x = 365 + n * 270
        parts += [line(x, 152, x, 168), text(x, 209, str(n).replace('-', '−'), anchor="middle")]
    for n, label in [(-.5, "−0,5"), (.5, "0,5"), (1.5, "1,5")]:
        x = 365 + n * 270
        parts += [f'<circle cx="{x}" cy="160" r="8" fill="{INK}"/>', text(x, 120, label, anchor="middle", bold=True)]
    for n in (0, 1):
        x = 365 + n * 270
        parts += [f'<circle cx="{x}" cy="160" r="8" fill="white" stroke="{INK}" stroke-width="3"/>', line(x, 232, x, 340, dashed=True)]
    for x, label, rule in [(90, "Inferieur", "Ei < 0"), (393, "Normaal", "0 < Ei < 1"), (702, "Luxe", "Ei > 1")]:
        parts += [text(x, 277, label, bold=True), text(x, 324, rule)]
    parts += [text(24, 390, "Bij Ei = 0 en Ei = 1: hier geen categorie."), text(24, 438, "Ei heeft geen eenheid. Dit is géén |Ev|-schaal.")]
    assets["2.2.3_fig_2"] = svg(parts, 465, "Getekende Ei-schaal met open grenspunten nul en één zonder categorie")

    parts = [text(24, 42, "Ek: boven een hoeveelheid, onder een andere prijs", size=35, bold=True)]
    for y, good, change, result, relation in [(74, "digitale filmhuur", "+10%", "+0,5", "Substituten: twee manieren om een film te huren."),
                                              (353, "passende beschermhoezen", "−4%", "−0,2", "Complementen: filmschijf en passende hoes.")]:
        parts += [f'<rect x="24" y="{y}" width="952" height="249" fill="{PALE}" stroke="{INK}"/>',
                  text(50, y + 48, f"Teller: %ΔQ {good} = {change}"), line(50, y + 69, 950, y + 69),
                  text(50, y + 114, "Noemer: %ΔP filmschijfhuur = +20%"),
                  text(50, y + 170, f"Ek = {change} / +20% = {result}", bold=True), text(50, y + 220, relation, size=30)]
    parts += [text(24, 654, "De eigen prijzen van digitale huur en hoezen blijven gelijk."),
              text(24, 702, "Ook de overige omstandigheden blijven gelijk.")]
    assets["2.2.3_fig_3"] = svg(parts, 730, "Twee benoemde kruislingse verhoudingen bij dezelfde filmschijfhuurprijsstijging")

    parts = [text(24, 42, "Eén input wijzigen; steeds terug naar hetzelfde begin", size=35, bold=True)]
    for y, heading, values, roles in [
        (65, "Begin", ("Px = 20", "Pz = 10", "Y = 30.000", "Qx = 200"), ("", "", "", "")),
        (226, "Alleen het inkomen stijgt", ("Px = 20", "Pz = 10", "Y = 36.000", "Qx = 230"), ("gelijk", "gelijk", "verandert", "uitkomst")),
        (387, "Terug naar begin; alleen de andere prijs stijgt", ("Px = 20", "Pz = 14", "Y = 30.000", "Qx = 204"), ("gelijk", "verandert", "weer begin", "uitkomst")),
    ]:
        parts += [f'<rect x="24" y="{y}" width="952" height="142" fill="{PALE}" stroke="{INK}"/>', text(48, y + 38, heading, bold=True)]
        for x, value, role in zip((48, 263, 478, 760), values, roles):
            parts += [text(x, y + 83, value), text(x, y + 123, role, size=30)]
    parts += [text(24, 590, "Px en Pz: € per maand. Y: € per jaar."), text(24, 638, "Qx: abonnementen per maand. Overige omstandigheden gelijk.")]
    assets["2.2.3_fig_4"] = svg(parts, 667, "Drie functionele scenario's: begin, alleen inkomen, reset en alleen andere prijs")
    return assets


def zip_document(record: dict) -> None:
    pdf = Path(record["source_pdf"])
    archive = pdf.with_suffix(".zip")
    paths = {pdf, pdf.with_suffix(".md"), pdf.with_suffix(".html")}
    for asset in record["assets"]:
        paths.add(Path(asset["path"]))
    with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED) as package:
        for path in sorted(paths):
            info = zipfile.ZipInfo(path.relative_to(pdf.parent).as_posix(), date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            package.writestr(info, path.read_bytes())
    record.update(zip=str(archive), zip_sha256=digest(archive))


def build(lesson_root: Path, proof_root: Path | None = None, *, sources_only=False, proof_suffix="") -> dict:
    if proof_suffix and not re.fullmatch(r"r[1-9][0-9]*", proof_suffix):
        raise ValueError("Proof suffix must be a revision such as r2")
    lesson_root = lesson_root.resolve(strict=True)
    destination = (lesson_root / LESSON_REL).resolve(strict=True)
    if destination.parent.parent.parent != lesson_root:
        raise ValueError("Unexpected §223 paragraph output root")
    for path, expected in [(destination / "2.2.3-textbook-plan.md", PLAN_HASH), (destination.parent / "_chapter-plan.md", CHAPTER_HASH),
                           *((destination.parent / "2.2.1 Prijselasticiteit" / name, pin) for name, pin in PRIOR_PINS.items())]:
        if lf_hash(path) != expected:
            raise ValueError(f"Reviewed input pin differs: {path}")
    for command in [["node", "build-scripts/workflows/check-book-outline-currentness.js", "--require-approved", "--action", "paragraph_production", "--paragraph", "2.2.3"],
                    ["node", "build-scripts/workflows/check-book2-target-authority-remediation.js", "--durable"]]:
        subprocess.run(command, cwd=ROOT, check=True)
    record = target_record()
    assets = destination / "_assets"
    assets.mkdir(exist_ok=True)
    for name, source in asset_sources().items():
        path = assets / f"{name}.svg"
        path.write_text(source, encoding="utf-8", newline="\n")
        subprocess.run([sys.executable, "-m", "cairosvg", str(path), "-o", str(path.with_suffix(".png")), "-s", "2"], check=True)
    records = []
    for kind, markdown in documents(record).items():
        path = destination / f"{STEM} – {kind}.md"
        path.write_text(markdown.rstrip() + "\n", encoding="utf-8", newline="\n")
        if not sources_only:
            built = build_document(path)
            zip_document(built)
            if proof_root:
                suffix = f"-{proof_suffix}" if proof_suffix else ""
                proof_dir = proof_root / f"223-{kind}-{built['pdf_sha256'][:12]}{suffix}"
                render_proof(built, proof_dir)
                built["proof_directory"] = str(proof_dir.resolve())
            records.append(built)
    sources = [Path(__file__).resolve(), Path(__file__).with_name("print_pipeline.py"),
               *(CONTENT / name for name in ("theory.md", "exercises.md", "answers.md", "target-answers.md"))]
    return {"paragraph": "2.2.3", "target_record_sha256": TARGET_HASH, "plan_sha256": PLAN_HASH,
            "chapter_sha256": CHAPTER_HASH, "accepted_221_lf_pins": PRIOR_PINS,
            "input_sources": [{"path": str(path), "sha256": digest(path)} for path in sources],
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
