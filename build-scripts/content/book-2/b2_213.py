"""Reproduce the independently planned §213 Part A package, never acceptance."""
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
CONTENT = Path(__file__).with_name('213')
STEM = '2.1.3 Marginale kosten en marginale opbrengsten'
LESSON_REL = Path('Boek 2 - Kosten, opbrengsten, elasticiteit en surplus') / '2.1 Hoofdstuk Kosten en opbrengsten' / STEM
TARGET_HASH = 'df4b7d7b0326445b386ae570b43eb50fc9fc431707e3992e44394323f959c3ef'
PLAN_HASH = '4cf29ff1e70953f6d1f8399a65d63ad37031e6a129804ad555442bfb98624234'
CHAPTER_HASH = 'ef3f872f5caa2de1359639983d8e4907a34cfcbc80a0309826cff07201e49116'
HEADINGS = ['Uitgewerkt voorbeeld','Startopgaven','Begeleide inoefening','Zelfstandige oefening','Doeloefening','Denkertje / Bonusopgave','Herhaling / Herhaling en interleaving']
INK, BLUE, EDGE, BG = '#1F2937','#1A5276','#2D3748','#F7FAFC'
ASSETS = ['2.1.3_fig_1','2.1.3_fig_2','2.1.3_fig_3','2.1.3_fig_4','2.1.3_we_1','2.1.3_ex_1']
# Discrete cases from the accepted plan, not instantaneous functions.
CASES = {
    'holders': ([0,10,20],[20,50,100],[0,80,160]),
    'lus': ([0,2,4,6],[12,16,20,24],[0,12,24,36]),
    'bout': ([0,2,4,6],[8,12,24,44],[0,24,48,72]),
    'bottles': ([0,2,4],[8,12,20],[0,12,24]),
    'patches': ([0,3,6],[9,15,21],[0,15,30]),
    'coasters': ([0,2,6],[10,14,38],[0,16,48]),
    'draad': ([0,4,8,12],[20,24,28,32],[0,20,40,60]),
    'kaft': ([0,4,8,12],[12,28,76,156],[0,96,192,288]),
    'linea': ([0,10,20,30],[200,230,260,290],[0,80,160,240]),
    'curva': ([0,5,10,15],[100,125,200,325],[0,150,300,450]),
}

def interval_values(q,total):
    if len(q)!=len(total) or len(q)<2 or any(b<=a for a,b in zip(q,q[1:])):
        raise ValueError('Need matching totals and strictly increasing interval endpoints')
    return [Fraction(b-a,end-start) for start,end,a,b in zip(q,q[1:],total,total[1:])]

def lf_hash(path):
    return hashlib.sha256(Path(path).read_text(encoding='utf-8-sig').replace('\r\n','\n').replace('\r','\n').encode()).hexdigest()

def target_record():
    records = json.loads((ROOT/'references/authored/course-target-exercises.json').read_text(encoding='utf-8-sig'))['exercises']
    matches = [r for r in records if r['id']=='2.1.3']
    if len(matches)!=1:
        raise ValueError('Expected exactly one §213 target')
    record = matches[0]
    if hashlib.sha256(json.dumps(record,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()!=TARGET_HASH:
        raise ValueError('Frozen §213 target changed')
    return record

def table(columns,rows):
    return '\n'.join(['| '+' | '.join(columns)+' |','|'+'---|'*len(columns),*['| '+' | '.join(row)+' |' for row in rows]])

def serialize_target(record):
    target = record['target_exercise']; parts = ['**Opgave 7**',target['context']]
    for source in target['sources']:
        if source['type']!='table':
            raise ValueError('Unexpected frozen source kind')
        parts += ['::: {style="break-inside: avoid"}',
                  '**'+{'tabel-linea':'Linea','tabel-curva':'Curva'}[source['id']]+'**',source['content'],
                  table(source['columns'],source['rows']),':::']
    parts += [f"{q['label']}) **({q['points']} punten)** {q['prompt']}" for q in target['subquestions']]
    return '\n\n'.join(parts)

def layout_tables(markdown):
    def convert(match):
        rows = [[c.strip() for c in row.strip().strip('|').split('|')] for row in match.group().strip().splitlines()]
        columns,data = rows[0],rows[2:]
        if any(len(row)!=len(columns) for row in data):
            raise ValueError('Table column mismatch')
        widths = [17,17,66] if columns==['Onderdeel','Maximum','Verdeling'] else [100/len(columns)]*len(columns)
        return '\n'.join(['<table style="break-inside:avoid">','<colgroup>',*[f'<col style="width:{w:g}%">' for w in widths],'</colgroup>',
            '<thead><tr>'+''.join(f'<th>{html.escape(c)}</th>' for c in columns)+'</tr></thead>','<tbody>',
            *['<tr>'+''.join(f'<td>{html.escape(c)}</td>' for c in row)+'</tr>' for row in data],'</tbody></table>'])+'\n'
    return re.sub(r'(?m)^\|[^\n]+\|\r?\n\|(?:\s*:?-+:?\s*\|)+\r?\n(?:\|[^\n]+\|(?:\r?\n|$))+',convert,markdown)

def documents(record):
    exercises = (CONTENT/'exercises.md').read_text(encoding='utf-8').replace('{{TARGET}}',serialize_target(record))
    theory = (CONTENT/'theory.md').read_text(encoding='utf-8').replace('{{GOALS}}','\n'.join(f'{i}. {g}' for i,g in enumerate(record['lesson_goals'],1)))
    target_answers = (CONTENT/'target-answers.md').read_text(encoding='utf-8')
    for key,value in record['short_answer_model'].items():
        target_answers = target_answers.replace('{{ANSWER_'+key+'}}',value)
    answers = (CONTENT/'answers.md').read_text(encoding='utf-8').replace('{{TARGET_ANSWERS}}',target_answers)
    result = {'paragraaf':theory.rstrip()+'\n\n'+exercises,'opgaven':f'# {STEM} — opgaven\n\n'+exercises,'antwoorden':answers}
    for kind,value in result.items():
        if '{{' in value or '}}' in value:
            raise ValueError(f'Unresolved placeholder: {kind}')
        value = value.replace('::: {style="break-inside: avoid"}', '<div style="break-inside: avoid">')
        value = re.sub(r'^:::$','</div>',value,flags=re.M)
        result[kind] = layout_tables(re.sub(r'^([a-z])\) ',r'\1\\) ',value,flags=re.M)).rstrip()+'\n'
    return result

def label(x,y,value,*,bold=False,color=INK,anchor='start'):
    # 30pt source type =40 CSSpx; actual PDF placement is checked separately.
    return f'<text x="{x}" y="{y}" font-size="30pt" fill="{color}" font-weight="{700 if bold else 400}" text-anchor="{anchor}">{html.escape(str(value))}</text>'

def line(x1,y1,x2,y2,*,arrow=False):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{EDGE}" stroke-width="4"'+(' marker-end="url(#arrow)"' if arrow else '')+'/>'

def frame(body,height,title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="{height}" viewBox="0 0 1200 {height}" role="img" aria-labelledby="title">'
        f'<title id="title">{html.escape(title)}</title><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L8,3 Z" fill="{EDGE}"/></marker></defs>'
        f'<rect width="1200" height="{height}" fill="{BG}"/><g font-family="Arial,DejaVu Sans,sans-serif" text-rendering="geometricPrecision">{body}</g></svg>\n')

def quantity_rows(*,revenue=False):
    body = label(40,50,'Fotohouders: dezelfde werkdag',bold=True)
    for y,name,values in [(130,'Q',[0,10,20]),(210,'TK (€)',[20,50,100])]+([(290,'TO (€)',[0,80,160])] if revenue else []):
        body += label(40,y,name,bold=True)+''.join(label(x,y,value,anchor='middle') for x,value in zip([350,700,1050],values))
    return body

def asset_sources():
    body = quantity_rows()+line(350,255,700,255,arrow=True)+line(700,295,1050,295,arrow=True)
    body += label(525,310,'0–10',anchor='middle')+label(875,350,'10–20',anchor='middle')
    sources = {'2.1.3_fig_1':frame(body,380,'Twee intervallen in de kostentabel; Q in fotohouders per dag, TK in euro per dag')}
    body = quantity_rows()
    for x,end,dtk,mk in [(40,700,30,3),(640,1050,50,5)]:
        body += line(x+220,330,end,245,arrow=True)+label(x,385,f'ΔTK = {dtk}; ΔQ = 10')+label(x,445,f'MK = {dtk}/10 = {mk}',bold=True)+label(x,505,'bij Q = '+('10' if end==700 else '20'))
    body += label(40,565,'MK: € per extra fotohouder binnen het interval')
    sources['2.1.3_fig_2']=frame(body,600,'MK berekend en geplaatst bij het rechter eindpunt; eerste en tweede interval')
    body = quantity_rows(revenue=True)
    for x,end in [(40,700),(640,1050)]:
        body += line(x+220,395,end,330,arrow=True)+label(x,450,'ΔTO = 80; ΔQ = 10',color=BLUE)+label(x,510,'MO = 80/10 = 8',bold=True,color=BLUE)
    body += label(40,580,'Vaste prijs € 8: MO = € 8 per extra fotohouder')
    sources['2.1.3_fig_3']=frame(body,615,'MO in dezelfde hoeveelheidstabel; vaste prijs per fotohouder')
    body = ''
    for y,name,start,end,dtk,growth,per in [(0,'0–10',-20,30,30,50,5),(310,'10–20',30,60,50,30,3)]:
        body += label(40,y+50,f'Interval {name}: ΔQ = 10',bold=True)
        body += label(40,y+110,f'Totale winst: {str(start).replace("-","−")} → {end} euro per dag')
        body += label(40,y+170,f'Δwinst = ΔTO − ΔTK = 80 − {dtk} = {growth} euro')
        body += label(40,y+230,f'Δwinst/ΔQ = {growth}/10 = 8 − {3 if per==5 else 5} = {per}')
        body += label(40,y+285,f'Dus € {per} winsttoename per extra fotohouder')
    body += line(40,307,1160,307)
    sources['2.1.3_fig_4']=frame(body,625,'Totale winst en gemiddelde winsttoename zijn verschillende grootheden')
    body = ''
    for y,name,tk,to,mk,mo in [(0,'Lus',[12,16,20,24],[0,12,24,36],[2,2,2],6),(360,'Bout',[8,12,24,44],[0,24,48,72],[2,6,10],12)]:
        body += label(40,y+48,f'{name}: Q = 0 / 2 / 4 / 6 per dag',bold=True)+label(40,y+103,'TK (€): '+' / '.join(map(str,tk)))
        body += label(40,y+155,'TO (€): '+' / '.join(map(str,to)),color=BLUE)+label(40,y+207,f'Eerste MK = ({tk[1]} − {tk[0]})/(2 − 0) = 2')
        body += label(40,y+259,f'Eerste MO = ({to[1]} − 0)/(2 − 0) = {mo}',color=BLUE)
        body += label(40,y+313,'Bij Q = 2 / 4 / 6: MK '+' / '.join(map(str,mk))+f'; MO steeds {mo}')
    body += line(40,348,1160,348)+label(40,735,'MK en MO: € per extra sleutelhanger in het interval')
    sources['2.1.3_we_1']=frame(body,765,'Drie eindpuntrijen van Lus en Bout; constante en stijgende MK')
    body = label(40,45,'Patches: van 0 naar 3, dan van 3 naar 6',bold=True)+label(40,95,'Eerste MK = (15 − 9)/(3 − 0) = 2')
    body += label(40,145,'Eerste MO = (15 − 0)/(3 − 0) = 5',color=BLUE)+line(100,163,100,212,arrow=True)+label(140,210,'Rij Q = 3: MK 2; MO 5; winst 15 − 15 = 0')
    body += line(40,240,1160,240)+label(40,290,'Nu interval 3–6: vul zelf in',bold=True)+label(40,345,'MK = (… − …)/(… − …) = …')
    body += label(40,400,'MO = (… − …)/(… − …) = …',color=BLUE)+label(40,450,'Rij Q = 6: MK …; MO …; winst …')
    body += label(40,510,'MK en MO: € per extra patch binnen het interval')
    sources['2.1.3_ex_1']=frame(body,540,'Eerste interval volledig gesteund; tweede interval met lege breuken en cellen')
    if list(sources)!=ASSETS:
        raise ValueError('Unplanned asset inventory')
    return sources

def zip_document(record):
    pdf = Path(record['source_pdf']); destination = pdf.with_suffix('.zip')
    files = [Path(record[k]) for k in ('source_md','source_html','source_pdf')]+[Path(a['path']) for a in record['assets']]
    with ZipFile(destination,'w',compression=ZIP_DEFLATED) as archive:
        for path in sorted(set(files)):
            info = ZipInfo(path.relative_to(pdf.parent).as_posix(),date_time=(1980,1,1,0,0,0)); info.compress_type = ZIP_DEFLATED
            archive.writestr(info,path.read_bytes())
    return {'path':str(destination),'sha256':digest(destination)}

def prerequisite_pins(destination):
    prior211 = destination.parent/'2.1.1 Kostenstructuren'; prior212 = destination.parent/'2.1.2 Opbrengsten, winst en break-even'
    return [(destination/'2.1.3-textbook-plan.md',PLAN_HASH),(destination.parent/'_chapter-plan.md',CHAPTER_HASH),
        (prior211/'2.1.1-textbook-handoff.md','724a080619f2f072151edf20980071b3bef18cd60d1904c78f4aa906be8917c8'),
        (prior212/'2.1.2-textbook-handoff.md','de2b8ed7dcc7a3c5c6eaac400892d2d37ac5212ccb3b9972fb004115a88c1fe2'),
        (prior212/'2.1.2-review.md','74ad2ed9c44d9aa05b6d6a680d5d273f2cad4b62e4bead5db303c006514238cd'),
        (prior212/'2.1.2-quality-ref.yaml','e168e3c2b8698d12b699fbf60e7691fbbc8a15d61bd46a7988704d3c896c805c')]

def build(lesson_root,proof_root=None,*,sources_only=False,proof_suffix=''):
    if proof_suffix and not re.fullmatch(r'r[1-9][0-9]*',proof_suffix):
        raise ValueError('Proof suffix must be a revision such as r2')
    lesson_root = Path(lesson_root).resolve(strict=True); destination = (lesson_root/LESSON_REL).resolve(strict=True)
    if destination.parent.parent.parent!=lesson_root:
        raise ValueError('Unexpected paragraph root')
    pins = prerequisite_pins(destination)
    for path,expected in pins:
        if lf_hash(path)!=expected:
            raise ValueError(f'Required accepted source differs: {path}')
    prior_md = destination.parent/'2.1.2 Opbrengsten, winst en break-even'/'2.1.2 Opbrengsten, winst en break-even – paragraaf.md'
    if digest(prior_md)!='f53521ed8812a4c8b8c33c1d66b34e0afe8425c1dffb1723f37771372b2baa09':
        raise ValueError('Accepted §212 paragraph source changed')
    for command in [
        ['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.1.3'],
        ['node','build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']]:
        subprocess.run(command,cwd=ROOT,check=True)
    record = target_record(); assets = destination/'_assets'; assets.mkdir(exist_ok=True)
    for name,source in asset_sources().items():
        path = assets/f'{name}.svg'; path.write_text(source,encoding='utf-8',newline='\n')
        subprocess.run([sys.executable,'-m','cairosvg',str(path),'-o',str(path.with_suffix('.png')),'-s','2'],check=True)
    records = []
    for kind,markdown in documents(record).items():
        path = destination/f'{STEM} – {kind}.md'; path.write_text(markdown,encoding='utf-8',newline='\n')
        if not sources_only:
            built = build_document(path); built['zip'] = zip_document(built)
            if proof_root:
                suffix = f'-{proof_suffix}' if proof_suffix else ''; directory = Path(proof_root)/f"213-{kind}-{built['pdf_sha256'][:12]}{suffix}"
                render_proof(built,directory); built['proof_directory'] = str(directory.resolve())
            records.append(built)
    inputs = [Path(__file__).resolve(),Path(__file__).with_name('print_pipeline.py'),*(CONTENT/name for name in ('theory.md','exercises.md','answers.md','target-answers.md'))]
    return {'paragraph':'2.1.3','target_record_sha256':TARGET_HASH,'plan_sha256':PLAN_HASH,'chapter_sha256':CHAPTER_HASH,
        'prerequisites':[{'path':str(p),'canonical_lf_sha256':h} for p,h in pins],'prior_paragraph_md_raw_sha256':digest(prior_md),
        'input_sources':[{'path':str(p),'sha256':digest(p)} for p in inputs],'inspection_status':'PENDING','documents':records}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--lesson-root',type=Path,default=ROOT.parent/'4veco-lessen'); parser.add_argument('--proof-root',type=Path)
    parser.add_argument('--proof-suffix',default=''); parser.add_argument('--sources-only',action='store_true'); parser.add_argument('--manifest',type=Path)
    args = parser.parse_args()
    if args.manifest and args.manifest.exists():
        raise ValueError('Refusing to overwrite a build manifest; choose a fresh revision')
    result = build(args.lesson_root,args.proof_root,sources_only=args.sources_only,proof_suffix=args.proof_suffix)
    if args.manifest:
        args.manifest.parent.mkdir(parents=True,exist_ok=True); args.manifest.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    print(json.dumps(result,ensure_ascii=True,indent=2))

if __name__=='__main__':
    main()
