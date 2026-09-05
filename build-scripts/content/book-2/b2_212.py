"""Reproduce the independently planned §212 paper package, never acceptance.

Paragraph-owned content/geometry only; reviewed shared print_pipeline owns
formatting and immutable PENDING page capture. No legacy review is rewritten.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import html
import json
import re
import subprocess
import sys
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

from print_pipeline import build_document, digest, render_proof

ROOT = Path(__file__).resolve().parents[3]
CONTENT = Path(__file__).with_name("212")
LESSON_REL = Path("Boek 2 - Kosten, opbrengsten, elasticiteit en surplus") / "2.1 Hoofdstuk Kosten en opbrengsten" / "2.1.2 Opbrengsten, winst en break-even"
STEM = "2.1.2 Opbrengsten, winst en break-even"
TARGET_HASH = "19b466dd6f7b541a3bb701d4de80ce13fe9ea58356313e24b23b21698093e1f9"
PLAN_HASH = "5e1d318dd1b841467ca297d67956304d1861e3eb68d1df56cc4d32f6434d34a4"
CHAPTER_HASH = "ef3f872f5caa2de1359639983d8e4907a34cfcbc80a0309826cff07201e49116"
PRIOR_REVIEW_HASH = "92b4a9462caf8316274fb58f8beef5c850147c44e6bf80b9a28fad442d9dbe96"
PRIOR_QUALITY_HASH = "0dddb6e9d8f3a8da0e0f31e67dafabf53b99feb6ad86ce72039480dd7e12ea18"
HEADINGS = ["Uitgewerkt voorbeeld", "Startopgaven", "Begeleide inoefening",
            "Zelfstandige oefening", "Doeloefening", "Denkertje / Bonusopgave",
            "Herhaling / Herhaling en interleaving"]
INK, BLUE, COST, ORANGE, BG = "#1F2937", "#1A5276", "#6F3611", "#E67E22", "#F7FAFC"


def lf_hash(path):
    return hashlib.sha256(Path(path).read_text(encoding="utf-8-sig").replace("\r\n", "\n").replace("\r", "\n").encode()).hexdigest()


def target_record():
    records = json.loads((ROOT / "references/authored/course-target-exercises.json").read_text(encoding="utf-8-sig"))["exercises"]
    matches = [r for r in records if r["id"] == "2.1.2"]
    if len(matches) != 1:
        raise ValueError("Expected exactly one §212 target")
    r = matches[0]
    if hashlib.sha256(json.dumps(r, ensure_ascii=False, separators=(",", ":")).encode()).hexdigest() != TARGET_HASH:
        raise ValueError("Frozen §212 target changed")
    return r


def serialize_target(record):
    target = record["target_exercise"]
    body = "\n\n".join(["**Opgave 7**", target["context"], *[
        f"{q['label']}) **({q['points']} punten)** {q['prompt']}" for q in target["subquestions"]]])
    return '::: {style="break-inside: avoid"}\n\n' + body + '\n\n:::'


def layout_tables(markdown):
    """Paragraph-owned widths only; no CSS typography overrides."""
    def convert(match):
        rows = [[c.strip() for c in row.strip().strip("|").split("|")] for row in match.group().strip().splitlines()]
        columns, data = rows[0], rows[2:]
        if any(len(row) != len(columns) for row in data):
            raise ValueError("Table column mismatch")
        if columns == ["Onderdeel", "Maximum", "Verdeling"]:
            widths = [17, 17, 66]
        elif columns[0].startswith("Geval"):
            widths = [34, 22, 22, 22]
        else:
            widths = [100 / len(columns)] * len(columns)
        return "\n".join(['<table style="break-inside:avoid">', '<colgroup>',
            *[f'<col style="width:{w:g}%">' for w in widths], '</colgroup>',
            '<thead><tr>' + ''.join(f'<th>{html.escape(c)}</th>' for c in columns) + '</tr></thead>',
            '<tbody>', *['<tr>' + ''.join(f'<td>{html.escape(c)}</td>' for c in row) + '</tr>' for row in data],
            '</tbody></table>']) + "\n"
    return re.sub(r"(?m)^\|[^\n]+\|\r?\n\|(?:\s*:?-+:?\s*\|)+\r?\n(?:\|[^\n]+\|(?:\r?\n|$))+", convert, markdown)


def documents(record):
    exercises = (CONTENT / "exercises.md").read_text(encoding="utf-8").replace("{{TARGET}}", serialize_target(record))
    goals = "\n".join(f"{i}. {g}" for i, g in enumerate(record["lesson_goals"], 1))
    theory = (CONTENT / "theory.md").read_text(encoding="utf-8").replace("{{GOALS}}", goals)
    target_answers = (CONTENT / "target-answers.md").read_text(encoding="utf-8")
    for key, value in record["short_answer_model"].items():
        target_answers = target_answers.replace("{{ANSWER_" + key + "}}", value)
    answers = (CONTENT / "answers.md").read_text(encoding="utf-8").replace("{{TARGET_ANSWERS}}", target_answers)
    result = {"paragraaf": theory.rstrip() + "\n\n" + exercises,
              "opgaven": f"# {STEM} - opgaven\n\n" + exercises, "antwoorden": answers}
    for kind, value in result.items():
        if "{{" in value or "}}" in value:
            raise ValueError(f"Unresolved source placeholder: {kind}")
        result[kind] = layout_tables(re.sub(r"^([a-z])\) ", r"\1\\) ", value, flags=re.M)).rstrip() + "\n"
    return result


def label(x, y, value, *, anchor="start", bold=False, color=INK):
    # 30pt SVG source type =40 CSS pixels. Full-width placement is checked
    # again against actual PDF image transforms, not assumed from this guard.
    return (f'<text x="{x:g}" y="{y:g}" font-size="30pt" fill="{color}" '
            f'text-anchor="{anchor}" font-weight="{700 if bold else 400}">{html.escape(str(value))}</text>')


def line(x1, y1, x2, y2, *, color=INK, width=3, dash=""):
    return f'<line x1="{x1:g}" y1="{y1:g}" x2="{x2:g}" y2="{y2:g}" stroke="{color}" stroke-width="{width:g}" stroke-dasharray="{dash}"/>'


def frame(body, height, title, width=1000):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title">'
            f'<title id="title">{html.escape(title)}</title><rect width="{width}" height="{height}" fill="{BG}"/>'
            f'<g font-family="Arial,DejaVu Sans,sans-serif">{body}</g></svg>\n')


def graph(*, fixed, variable, price, qmax, ymax, qticks, yticks, qunit, period,
          show_tk=True, show_to=True, crossing=False, gap=False, y0=0, panel_label="", compact=False):
    """One coordinate transform for strokes, points and vertical differences."""
    left, right = (200, 1200) if compact else (150, 770)
    top, bottom = (y0 + 100, y0 + 280) if compact else (y0 + 115, y0 + 445)
    def xy(q, amount):
        return left + float(q) / qmax * (right-left), bottom - float(amount) / ymax * (bottom-top)
    parts = []
    if panel_label:
        parts.append(label(26, y0 + 43, panel_label, bold=True))
    parts.append(label(left, y0 + 91, f"{'TK en TO' if show_tk else 'TO'} (€ per {period})"))
    for amount in yticks:
        x, y = xy(0, amount)
        parts += [line(left, y, right, y, color="#D5DDE3", width=1.5),
                  label(x - 19, y + 13, f"{amount:,}".replace(",", "."), anchor="end")]
    parts += [line(left, top, left, bottom, width=3.5), line(left, bottom, right, bottom, width=3.5)]
    for q in qticks:
        x, y = xy(q, 0)
        parts += [line(x, y, x, y + 8), label(x, y + 52, f"{q:,}".replace(",", "."), anchor="middle")]
    parts += [label((left+right)/2, bottom + 103, f"Q ({qunit} per {period})", anchor="middle")]
    if show_tk:
        a, b = xy(0, fixed), xy(qmax, fixed + variable*qmax)
        parts += [line(*a, *b, color=COST, width=9, dash="24 14"),
                  line(*a, *b, color=ORANGE, width=2, dash="24 14")]
        lx, ly = xy(qmax*.055, fixed + variable*qmax*.055)
        parts.append(label(lx, ly - 22, "TK", bold=True, color=COST))
    if show_to:
        a, b = xy(0, 0), xy(qmax, price*qmax)
        parts.append(line(*a, *b, color=BLUE, width=7))
        lx, ly = xy(qmax*.78, price*qmax*.78)
        parts.append(label(lx, ly - 20, "TO", bold=True, color=BLUE))
    if crossing:
        qbe = Fraction(str(fixed)) / (Fraction(str(price))-Fraction(str(variable)))
        x, y = xy(qbe, Fraction(str(price))*qbe)
        parts += [f'<circle cx="{x:g}" cy="{y:g}" r="8" fill="{INK}"/>',
                  line(x-80, y-50, x-8, y-7, width=2.5), label(x-86, y-57, "BE", anchor="end", bold=True),
                  label(170, y0+607, "TO < TK: verlies"), label(595, y0+607, "TO > TK: winst")]
    if gap:
        x, yt = xy(qmax, price*qmax)
        _, yk = xy(qmax, fixed+variable*qmax)
        parts += [line(x+24, yt, x+24, yk, width=4), line(x+10, yt, x+38, yt, width=4),
                  line(x+10, yk, x+38, yk, width=4),
                  label(x+60, (yt+yk)/2+14, "€ " + f"{price*qmax-fixed-variable*qmax:g}".replace(".", ","), bold=True)]
    return "".join(parts)


def asset_sources():
    theatre = dict(fixed=60, variable=2, price=5, qmax=30, ymax=150, qticks=(0,10,20,30), yticks=(0,50,100,150), qunit="bezoekers", period="avond")
    sources = {"2.1.2_fig_1": frame(graph(**theatre, show_tk=False), 630, "Theater: eerst de totale opbrengst"),
               "2.1.2_fig_2": frame(graph(**theatre), 630, "Theater: voeg de totale kosten toe"),
               "2.1.2_fig_3": frame(graph(**theatre, crossing=True), 630, "Theater: break-even en zones"),
               "2.1.2_fig_4": frame(graph(**theatre, crossing=True, gap=True), 630, "Theater: verticale winstafstand bij Q30")}
    cases = [
        ("2.1.2_we_1", 20, 1, 7, 6, 50, (0,2,4,6), (0,10,20,30,40,50), "verhuringen", "dag", True),
        ("2.1.2_ex_1", 10, 1, 4, 6, 30, (0,2,4,6), (0,10,20,30), "stukken zeep", "dag", True),
        ("2.1.2_ex_2", 15, 1, 4, 8, 40, (0,2,4,6,8), (0,10,20,30,40), "potten", "dag", False),
        ("2.1.2_ex_3", 15, 1, 4, 8, 40, (0,2,4,6,8), (0,10,20,30,40), "potten", "dag", True),
        ("2.1.2_ex_4", 40, 1, 4, 20, 80, (0,5,10,15,20), (0,20,40,60,80), "bezoekers", "dag", True),
        ("2.1.2_ex_5", 500, .8, 1.5, 1000, 1600, (0,250,500,750,1000), (0,400,800,1200,1600), "broden", "maand", True),
    ]
    for name, fixed, variable, price, qmax, ymax, qticks, yticks, qunit, period, complete in cases:
        sources[name] = frame(graph(fixed=fixed, variable=variable, price=price, qmax=qmax, ymax=ymax,
            qticks=qticks, yticks=yticks, qunit=qunit, period=period,
            show_to=complete, crossing=complete, gap=complete), 630, name + ": TK en TO" if complete else "Bloempotten: alleen TK")
    lower = {**theatre, "ymax": 300, "yticks": (0,100,200,300)}
    sources["2.1.2_ex_6"] = frame(graph(**theatre, gap=True, panel_label="A. Verticale schaal tot 150", compact=True) +
        line(26, 410, 1474, 410, color="#94A5AD") + graph(**lower, gap=True, y0=420, panel_label="B. Verticale schaal tot 300", compact=True),
        830, "Hetzelfde theatermodel en winstbedrag op twee verschillende verticale schalen", width=1500)
    return sources


def zip_document(record):
    pdf = Path(record["source_pdf"])
    destination = pdf.with_suffix(".zip")
    files = [Path(record[k]) for k in ("source_md", "source_html", "source_pdf")] + [Path(a["path"]) for a in record["assets"]]
    with ZipFile(destination, "w", compression=ZIP_DEFLATED) as archive:
        for path in sorted(set(files)):
            relative = path.relative_to(pdf.parent).as_posix()
            info = ZipInfo(relative, date_time=(1980,1,1,0,0,0))
            info.compress_type = ZIP_DEFLATED
            archive.writestr(info, path.read_bytes())
    return {"path": str(destination), "sha256": digest(destination)}


def build(lesson_root, proof_root=None, *, sources_only=False, proof_suffix=""):
    if proof_suffix and not re.fullmatch(r"r[1-9][0-9]*", proof_suffix):
        raise ValueError("Proof suffix must be a revision such as r2")
    lesson_root = Path(lesson_root).resolve(strict=True)
    destination = (lesson_root / LESSON_REL).resolve(strict=True)
    if destination.parent.parent.parent != lesson_root:
        raise ValueError("Unexpected paragraph root")
    prior = destination.parent / "2.1.1 Kostenstructuren"
    for path, expected in [(destination/"2.1.2-textbook-plan.md",PLAN_HASH),
        (destination.parent/"_chapter-plan.md",CHAPTER_HASH), (prior/"2.1.1-review.md",PRIOR_REVIEW_HASH),
        (prior/"2.1.1-quality-ref.yaml",PRIOR_QUALITY_HASH)]:
        if lf_hash(path) != expected:
            raise ValueError(f"Required accepted source differs: {path}")
    for command in [
        ["node","build-scripts/workflows/check-book-outline-currentness.js","--require-approved","--action","paragraph_production","--paragraph","2.1.2"],
        ["node","build-scripts/workflows/check-book2-target-authority-remediation.js","--durable"]]:
        subprocess.run(command, cwd=ROOT, check=True)
    record = target_record()
    assets = destination / "_assets"
    assets.mkdir(exist_ok=True)
    for name, source in asset_sources().items():
        path = assets / f"{name}.svg"
        path.write_text(source, encoding="utf-8", newline="\n")
        subprocess.run([sys.executable,"-m","cairosvg",str(path),"-o",str(path.with_suffix(".png")),"-s","2"],check=True)
    records = []
    for kind, markdown in documents(record).items():
        path = destination / f"{STEM} – {kind}.md"
        path.write_text(markdown, encoding="utf-8", newline="\n")
        if not sources_only:
            built = build_document(path)
            built["zip"] = zip_document(built)
            if proof_root:
                suffix = f"-{proof_suffix}" if proof_suffix else ""
                directory = Path(proof_root) / f"212-{kind}-{built['pdf_sha256'][:12]}{suffix}"
                render_proof(built,directory)
                built["proof_directory"] = str(directory.resolve())
            records.append(built)
    inputs = [Path(__file__).resolve(),Path(__file__).with_name("print_pipeline.py"),
              *(CONTENT/name for name in ("theory.md","exercises.md","answers.md","target-answers.md"))]
    return {"paragraph":"2.1.2","target_record_sha256":TARGET_HASH,"plan_sha256":PLAN_HASH,
            "chapter_sha256":CHAPTER_HASH,"input_sources":[{"path":str(p),"sha256":digest(p)} for p in inputs],
            "inspection_status":"PENDING","documents":records}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lesson-root",type=Path,default=ROOT.parent/"4veco-lessen")
    parser.add_argument("--proof-root",type=Path)
    parser.add_argument("--proof-suffix",default="")
    parser.add_argument("--sources-only",action="store_true")
    parser.add_argument("--manifest",type=Path)
    args = parser.parse_args()
    result = build(args.lesson_root,args.proof_root,sources_only=args.sources_only,proof_suffix=args.proof_suffix)
    if args.manifest:
        args.manifest.parent.mkdir(parents=True,exist_ok=True)
        args.manifest.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8",newline="\n")
    print(json.dumps(result,ensure_ascii=True,indent=2))


if __name__ == "__main__":
    main()
