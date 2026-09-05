"""Reproduce only §2.2.2 Part A; frozen authority, owned sources and figures."""
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
CONTENT = Path(__file__).with_name("222")
LESSON_REL = Path("Boek 2 - Kosten, opbrengsten, elasticiteit en surplus") / "2.2 Hoofdstuk Elasticiteit" / "2.2.2 Elasticiteit en omzet"
STEM = "2.2.2 Elasticiteit en omzet"
TARGET_HASH = "8ce56143aef61b0e67aae5b179f6e5f3fe547192bc776a42c43101cb5a70fa2e"
PLAN_HASH = "6418491d45c43afdbd272c581bab12f8436ca1a84241663ba300e31b790825a8"
CHAPTER_HASH = "3a9db97518b1948eb0967d94653a10c693a0ca001e20b41503b864fd4cc7c2f7"
HEADINGS = ["Uitgewerkt voorbeeld", "Startopgaven", "Begeleide inoefening", "Zelfstandige oefening", "Doeloefening", "Denkertje / Bonusopgave", "Herhaling / Herhaling en interleaving"]
BLUE, INK, PALE = "#1A5276", "#182b3a", "#dce8ef"


def lf_hash(path: Path) -> str:
    return hashlib.sha256(path.read_text(encoding="utf-8-sig").replace("\r\n", "\n").replace("\r", "\n").encode()).hexdigest()


def target_record() -> dict:
    data = json.loads((ROOT / "references/authored/course-target-exercises.json").read_text(encoding="utf-8-sig"))
    records = [r for r in data["exercises"] if r["id"] == "2.2.2"]
    if len(records) != 1:
        raise ValueError("Expected one §222 target record")
    record = records[0]
    value = hashlib.sha256(json.dumps(record, ensure_ascii=False, separators=(",", ":")).encode()).hexdigest()
    if value != TARGET_HASH:
        raise ValueError(f"Frozen target changed: {value}")
    return record


def serialize_target(record: dict) -> str:
    target = record["target_exercise"]
    if target.get("sources"):
        raise ValueError("Frozen §222 target must remain prose-only")
    result = ["**Opgave 6**", target["context"]]
    result += [f"{q['label']}) **({q['points']} {'punt' if q['points'] == 1 else 'punten'})** {q['prompt']}" for q in target["subquestions"]]
    return "\n\n".join(result)


def format_tables(markdown: str) -> str:
    def convert(match):
        rows = [[cell.strip() for cell in line.strip().strip("|").split("|")] for line in match.group().strip().splitlines()]
        if any(len(row) != 3 for row in rows):
            raise ValueError("Unexpected §222 table shape")
        parts = ['<table style="break-inside:avoid">', '<colgroup>', '<col style="width:40%">', '<col style="width:30%">', '<col style="width:30%">', '</colgroup>', '<thead><tr>' + ''.join(f'<th>{html.escape(c)}</th>' for c in rows[0]) + '</tr></thead>', '<tbody>']
        parts += ['<tr>' + ''.join(f'<td>{html.escape(c)}</td>' for c in row) + '</tr>' for row in rows[2:]]
        return '\n'.join([*parts, '</tbody></table>']) + '\n'
    return re.sub(r"(?m)^\|[^\n]+\|\n\|(?:\s*:?-+:?\s*\|)+\n(?:\|[^\n]+\|(?:\n|$))+", convert, markdown)


def documents(record: dict) -> dict[str, str]:
    exercise = (CONTENT / "exercises.md").read_text(encoding="utf-8").replace("{{TARGET}}", serialize_target(record))
    goals = "\n".join(f"{n}. {goal}" for n, goal in enumerate(record["lesson_goals"], 1))
    theory = (CONTENT / "theory.md").read_text(encoding="utf-8").replace("{{GOALS}}", goals)
    target_answers = (CONTENT / "target-answers.md").read_text(encoding="utf-8")
    for label, answer in record["short_answer_model"].items():
        target_answers = target_answers.replace("{{ANSWER_" + label + "}}", answer)
    answers = (CONTENT / "answers.md").read_text(encoding="utf-8").replace("{{TARGET_ANSWERS}}", target_answers)
    outputs = {"paragraaf": theory.rstrip() + "\n\n" + exercise, "opgaven": f"# {STEM} – opgaven\n\n" + exercise, "antwoorden": answers}
    for kind, value in outputs.items():
        if "{{" in value or "}}" in value:
            raise ValueError(f"Unresolved source placeholder: {kind}")
        value = re.sub(r"^([a-z])\) ", r"\1\\) ", value, flags=re.M)
        value = value.replace('___', r'\_\_\_')
        value = format_tables(value)
        if kind in ('paragraaf', 'opgaven'):
            # Paragraph-owned pagination: keep each support with its questions,
            # the finite counterexample intact, and the five-point recap whole.
            for pattern in [
                r'(?ms)(^De speelgoedwinkel verkocht eerst.*?\!\[.*?\]\(_assets/2\.2\.2_fig_1\.svg\)\n)',
                r'(?ms)(^Dezelfde prijsstijging.*?\!\[.*?\]\(_assets/2\.2\.2_fig_2\.svg\)\n)',
                r'(?ms)(^Een concertorganisator.*?)(?=^\*\*f —)',
                r'(?ms)(^> \*\*Onthouden\*\*.*?)(?=^## Startopgaven)',
                r'(?ms)(^## Begeleide inoefening.*?)(?=^\*\*Opgave 4\*\*)',
                r'(?ms)(^\*\*Opgave 4\*\*.*?)(?=^## Zelfstandige oefening)',
                r'(?ms)(^## Zelfstandige oefening.*?)(?=^## Doeloefening)',
                r'(?ms)(^## Doeloefening.*?)(?=^## Denkertje / Bonusopgave)',
                r'(?ms)(^## Denkertje / Bonusopgave.*)\Z',
            ]:
                value = re.sub(pattern, r'<div style="break-inside:avoid">\n\n\1\n</div>\n\n', value)
        if kind == 'antwoorden':
            # Supported structural breaks at three explanation line hazards;
            # no shared CSS override, authored word or frozen answer change.
            for phrase, replacement in (
                ('procentuele prijsverandering: |Ev|', 'procentuele prijsverandering:<br>\n|Ev|'),
                ('verbinding met |Ev|', '<br>\nverbinding met |Ev|'),
                ('dat iedere eindige stap met interval-|Ev|', '<br>\ndat iedere eindige stap met interval-|Ev|'),
            ):
                if value.count(phrase) != 1:
                    raise ValueError('Expected one owned explanation typography anchor')
                value = value.replace(phrase, replacement)
            value = re.sub(r'(?ms)(^[a-z]\\\) .*?)(?=^[a-z]\\\) |^## |^\*\*Opgave|\Z)',
                           r'<div style="break-inside:avoid">\n\n\1\n</div>\n\n', value)
        outputs[kind] = value
    return outputs


def text(x, y, value, size=24, *, bold=False, anchor="start"):
    return (f'<text x="{x:g}" y="{y:g}" font-family="Arial, DejaVu Sans, sans-serif" font-size="{size}" font-weight="{700 if bold else 400}" text-anchor="{anchor}" fill="{INK}">{html.escape(value)}</text>')


def line(x1, y1, x2, y2, *, dashed=False):
    return f'<line x1="{x1:g}" y1="{y1:g}" x2="{x2:g}" y2="{y2:g}" stroke="{INK}" stroke-width="2"' + (' stroke-dasharray="7 5"' if dashed else '') + '/>'


def rect(x, base_y, p, q, sx, sy, *, old=False):
    return (f'<rect x="{x:g}" y="{base_y-p*sy:g}" width="{q*sx:g}" height="{p*sy:g}" fill="{"none" if old else PALE}" stroke="{INK}" stroke-width="2.5" '
            + ('stroke-dasharray="8 5" ' if old else '')
            + f'data-p="{p}" data-q="{q}" data-to="{p*q:g}" data-sx="{sx}" data-sy="{sy}" data-origin-x="{x}" data-origin-y="{base_y}" data-state="{"old" if old else "new"}"/>')


def svg(parts, height, description):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="720" height="{height}" viewBox="0 0 720 {height}" role="img"><title>{html.escape(description)}</title><rect width="720" height="{height}" fill="white"/>' + ''.join(parts) + '</svg>\n')


def comparison_panel(x, title, subtitle, p0, p1, q0, q1, sy, unit='stuk', plural='stuks', base=315):
    sx = 2.2
    parts = [text(x-42, 43, title, bold=True), text(x-42, 76, subtitle, size=22), text(x-42, 111, f'P (€ per {unit})', size=22),
             rect(x, base, p1, q1, sx, sy), rect(x, base, p0, q0, sx, sy, old=True), line(x, base, x+245, base), line(x, base, x, 126)]
    for p in sorted({0, p0, p1}):
        y = base - p*sy
        parts += [line(x-5, y, x+5, y)]
    parts += [text(x-12, base+8, '0', size=22, anchor='end'), text(x+q1*sx/2, base-p1*sy-12, str(p1).replace('.', ','), size=22, anchor='middle')]
    for q in (0, q0):
        xx = x + q*sx
        parts += [line(xx, base-5, xx, base+5), text(xx, base+30, str(q), size=22, anchor='middle')]
    parts += [text(x+110, base+63, f'Q ({plural} per week)', size=22, anchor='middle')]
    return parts


def asset_sources() -> dict[str, str]:
    assets = {}
    x, base, sx, sy = 110, 298, 4.7, 33
    parts = [text(24, 35, 'Speelgoedwinkel: oude omzet', bold=True, size=28), text(24, 77, 'P (€ per spel)', size=24), rect(x, base, 5, 100, sx, sy), line(x, base, 650, base), line(x, base, x, 93), text(320, 209, 'TO = 5 × 100', bold=True), text(320, 245, '€ 500 per week', bold=True)]
    for p in (0, 5):
        y = base-p*sy
        parts += [line(x-5,y,x+5,y), text(x-14,y+8,str(p),anchor='end')]
    for q in (0,50,100):
        xx=x+q*sx
        parts += [line(xx,base-5,xx,base+5),text(xx,base+33,str(q),anchor='middle')]
    parts += [text(380,381,'Q (spellen per week)',anchor='middle')]
    assets['2.2.2_fig_1'] = svg(parts,406,'Oude omzet als exacte rechthoek met prijs5 en afzet100')
    parts = comparison_panel(65,'Speelgoedwinkel','Nieuw: P = 5,50; Q = 95',5,5.5,100,95,25,base=275)
    parts += comparison_panel(425,'Koffiekiosk','Nieuw: P = 5,50; Q = 80',5,5.5,100,80,25,base=275)
    parts += [text(24,375,'TO: € 500 → € 522,50/week',bold=True,size=22),text(384,375,'TO: € 500 → € 440/week',bold=True,size=22), line(24,409,78,409,dashed=True),text(94,417,'Oude rand: P = 5; Q = 100. Vulling: nieuw.',size=22)]
    assets['2.2.2_fig_2'] = svg(parts,437,'Twee aparte zaken met gelijke schalen; oude rand en nieuwe omzetrechthoek')
    parts = [text(24,31,'LOKAAL: rond één uitgangsprijs',bold=True,size=27), text(24,64,'Voldoende kleine verandering; andere omstandigheden gelijk.',size=22), line(360,83,360,216)]
    for x,title,up,down in [(24,'Prijsinelastisch','P ↑  →  TO ↑','P ↓  →  TO ↓'),(389,'Prijselastisch','P ↑  →  TO ↓','P ↓  →  TO ↑')]:
        parts += [text(x,109,title,bold=True),text(x,157,up,bold=True,size=28),text(x,200,down,bold=True,size=28)]
    parts += [line(24,221,696,221),text(24,256,'Lokale regel; bij gegeven oude/nieuwe P en Q:',size=24),text(24,291,'bereken TO vóór en na.',size=24,bold=True)]
    assets['2.2.2_fig_3'] = svg(parts,315,'Schematische lokale omzetregel; beide prijsrichtingen en voorwaardelijke grens')
    parts = comparison_panel(65,'Concert: vóór','P = 10; Q = 100',10,10,100,100,11,'ticket','tickets')
    parts += comparison_panel(425,'Concert: na','P = 15; Q = 60',10,15,100,60,11,'ticket','tickets')
    parts += [text(24,415,'TO = € 1.000/week',bold=True,size=22),text(384,415,'TO = € 900/week',bold=True,size=22), text(24,456,'Interval-Ev = −0,8, maar TO daalt met 10%.',size=24,bold=True), text(24,492,'Prijsfactor 1,5 × afzetfactor 0,6 = omzetfactor 0,9.',size=22), text(24,528,'Stippelrand: oude omzet. Geen vraagcurve gegeven.',size=22)]
    assets['2.2.2_we_1'] = svg(parts,550,'Concert: voor en na op dezelfde schalen; interval-Ev vervangt de productcontrole niet')
    return assets


def build(lesson_root: Path, proof_root: Path | None = None, *, sources_only=False, proof_suffix="") -> dict:
    if proof_suffix and not re.fullmatch(r"r[1-9][0-9]*", proof_suffix):
        raise ValueError("Proof suffix must be a revision such as r2")
    lesson_root = lesson_root.resolve(strict=True)
    destination = (lesson_root / LESSON_REL).resolve(strict=True)
    if destination.parent.parent.parent != lesson_root:
        raise ValueError("Unexpected §222 output root")
    for path, expected in [(destination / '2.2.2-textbook-plan.md', PLAN_HASH), (destination.parent / '_chapter-plan.md', CHAPTER_HASH)]:
        if lf_hash(path) != expected:
            raise ValueError(f"Reviewed plan pin differs: {path}")
    for command in [['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.2.2'], ['node','build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']]:
        subprocess.run(command,cwd=ROOT,check=True)
    record = target_record()
    assets = destination / '_assets'
    assets.mkdir(exist_ok=True)
    for name, source in asset_sources().items():
        path = assets / f'{name}.svg'
        path.write_text(source,encoding='utf-8',newline='\n')
        subprocess.run([sys.executable,'-m','cairosvg',str(path),'-o',str(path.with_suffix('.png')),'-s','2'],check=True)
    records=[]
    for kind, markdown in documents(record).items():
        path = destination / f'{STEM} – {kind}.md'
        path.write_text(markdown.rstrip()+'\n',encoding='utf-8',newline='\n')
        if not sources_only:
            built = build_document(path)
            if proof_root:
                suffix=f'-{proof_suffix}' if proof_suffix else ''
                proof_dir=proof_root/f"222-{kind}-{built['pdf_sha256'][:12]}{suffix}"
                render_proof(built,proof_dir)
                built['proof_directory']=str(proof_dir.resolve())
            records.append(built)
    sources=[Path(__file__).resolve(),Path(__file__).with_name('print_pipeline.py'), *(CONTENT/name for name in ('theory.md','exercises.md','answers.md','target-answers.md'))]
    return {'paragraph':'2.2.2','target_record_sha256':TARGET_HASH,'plan_sha256':PLAN_HASH, 'chapter_sha256':CHAPTER_HASH,'input_sources':[{'path':str(p),'sha256':digest(p)} for p in sources], 'inspection_status':'PENDING','documents':records}


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--lesson-root',type=Path,default=ROOT.parent/'4veco-lessen')
    parser.add_argument('--proof-root',type=Path)
    parser.add_argument('--proof-suffix',default='')
    parser.add_argument('--sources-only',action='store_true')
    parser.add_argument('--manifest',type=Path)
    args=parser.parse_args()
    result=build(args.lesson_root,args.proof_root,sources_only=args.sources_only,proof_suffix=args.proof_suffix)
    if args.manifest:
        args.manifest.parent.mkdir(parents=True,exist_ok=True)
        args.manifest.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    print(json.dumps(result,ensure_ascii=True,indent=2))


if __name__=='__main__':
    main()
