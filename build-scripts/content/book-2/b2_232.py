"""HOW TO ADAPT: gated native §232 Part A production, not shared rendering.

Full, thin and direct routes require the same immutable 49-input release,
caller-pinned complete source, current action/durable checks and fresh revision.
The unchanged shared print CLI remains a generic primitive, not this gate.
"""
from pathlib import Path
import argparse
import hashlib
import html
import importlib.util
import json
import os
import re
import subprocess
import sys
import zipfile

ROOT=Path(__file__).resolve().parents[3]
CONTENT=Path(__file__).with_name('232')
_spec=importlib.util.spec_from_file_location('b232_gate',CONTENT/'gate.py')
gate=importlib.util.module_from_spec(_spec);_spec.loader.exec_module(gate)
STEM='2.3.2 Producentensurplus en totaal surplus'
LESSON_REL=Path('Boek 2 - Kosten, opbrengsten, elasticiteit en surplus')/'2.3 Hoofdstuk Surplus en welvaart'/STEM
KINDS=['paragraaf','opgaven','antwoorden']
HEADINGS=['Uitgewerkt voorbeeld','Startopgaven','Begeleide inoefening','Zelfstandige oefening','Doeloefening','Denkertje / Bonusopgave','Herhaling / Herhaling en interleaving']
ASSETS=['2.3.2_fig_'+str(i) for i in range(1,7)]+['2.3.2_we_1']+['2.3.2_ex_'+str(i) for i in range(1,8)]
TARGET_HASH='54ce45a0cb044532717fe0cbbb6cfeae75e76b2656861bfea0d3821afc1843ce'
PLAN_HASH='d0781ffb6d2966209c3a160309316ce92ebc0455fa51d4235ccc6840afa58935'
sha=gate.sha

def target_record():
    rows=json.loads((ROOT/'references/authored/course-target-exercises.json').read_text(encoding='utf-8'))['exercises']
    matches=[r for r in rows if r['id']=='2.3.2']
    if len(matches)!=1:raise ValueError('Exactly one target required')
    record=matches[0]
    if sha(json.dumps(record,ensure_ascii=False,separators=(',',':')).encode())!=TARGET_HASH:raise ValueError('Frozen target changed')
    return record

def describe():
    return json.loads(gate.command(['node',CONTENT/'assets.js','--describe'])['stdout'])

def figure(spec):
    return f'![{spec["caption"]}](_assets/{spec["stem"]}.svg){{alt="{spec["alt"]}" width=166mm}}'

def serialize_target(record,specs):
    t=record['target_exercise'];parts=[t['context']]
    for src in t['sources']:
        parts += ['**'+('Basisgrafiek' if src['id']=='basisgrafiek' else 'Marginale vergelijking')+'**',src['content']]
        if src['id']=='basisgrafiek':parts.append(figure(specs['ex_4']))
        if src.get('type')=='table':
            parts.append('\n'.join(['| '+' | '.join(src['columns'])+' |','| '+' | '.join('---' for _ in src['columns'])+' |']+['| '+' | '.join(row)+' |' for row in src['rows']]))
    parts += [f"{q['label']}) **({q['points']} punten)** {q['prompt']}" for q in t['subquestions']]
    return '\n\n'.join(parts)

def tables(markdown):
    def convert(match):
        rows=[[c.strip() for c in line.strip().strip('|').split('|')] for line in match.group().strip().splitlines()]
        headers,data=rows[0],rows[2:];count=len(headers)
        if any(len(row)!=count for row in data):raise ValueError('Irregular table')
        widths=([24,38,38] if headers[0].startswith('Q') else [40,30,30]) if count==3 else [34,34,16,16]
        if len(widths)!=count:raise ValueError('Unplanned table width')
        return '<table style="break-inside:avoid"><colgroup>'+''.join(f'<col style="width:{w}%">' for w in widths)+'</colgroup><thead><tr>'+''.join('<th>'+html.escape(c)+'</th>' for c in headers)+'</tr></thead><tbody>\n'+'\n'.join('<tr>'+''.join('<td>'+html.escape(c)+'</td>' for c in row)+'</tr>' for row in data)+'\n</tbody></table>\n'
    return re.sub(r'(?m)^\|[^\n]+\|\n\|(?:\s*:?-+:?\s*\|)+\n(?:\|[^\n]+\|(?:\n|$))+',convert,markdown)

def documents(record,specification):
    specs={s['suffix']:s for s in specification['specs']}
    exercise=(CONTENT/'exercises.md').read_text(encoding='utf-8')
    worked=exercise.split('\n## Startopgaven\n')[0]
    theory=(CONTENT/'theory.md').read_text(encoding='utf-8')
    answer=(CONTENT/'answers.md').read_text(encoding='utf-8').replace('{{WORKED}}',worked)
    target_answers=(CONTENT/'target-answers.md').read_text(encoding='utf-8')
    for k,v in record['short_answer_model'].items():target_answers=target_answers.replace('{{ANSWER_'+k+'}}',v)
    answer=answer.replace('{{TARGET_ANSWERS}}',target_answers)
    raw={'paragraaf':theory+'\n\n'+exercise,'opgaven':'# '+STEM+' — opgaven\n\n'+exercise,'antwoorden':answer}
    out={}
    for kind,text in raw.items():
        text=text.replace('{{GOALS}}','\n'.join(f'{i}. {g}' for i,g in enumerate(record['lesson_goals'],1))).replace('{{TARGET}}',serialize_target(record,specs))
        for suffix,spec in specs.items():text=text.replace('{{FIG_'+suffix+'}}',figure(spec))
        if '{{' in text or '}}' in text:raise ValueError('Unresolved native placeholder')
        text=re.sub(r'(?m)^([a-e])\)',r'\1\\)',text)
        out[kind]=tables(text).rstrip()+'\n'
    return out

def wrapper():
    return '''"""Thin paired §232 native delegate; all author gates remain mandatory."""
from pathlib import Path
import subprocess
import sys
root=Path(__file__).resolve().parents[3]
if any(a=="--lesson-root" or a.startswith("--lesson-root=") for a in sys.argv[1:]):
    raise SystemExit("Duplicate lesson-root override forbidden")
builder=root.parent/"4veco-platform/build-scripts/content/book-2/b2_232.py"
raise SystemExit(subprocess.call([sys.executable,str(builder),"--lesson-root",str(root),*sys.argv[1:]],cwd=builder.parents[3]))
'''

def packet_paths(folder):
    return [folder/f'{STEM} – {kind}.{ext}' for kind in KINDS for ext in ['md','html','pdf','zip']]+[folder/'_assets'/(stem+ext) for stem in ASSETS for ext in ['.svg','.png']]+[folder/'build_pdf.py']

def snapshot(folder):
    return {p.relative_to(folder).as_posix():sha(gate.data_path(p).read_bytes()) for p in packet_paths(folder)}

def zip_document(record):
    source=Path(record['source_md']);folder=source.parent
    members={source,source.with_suffix('.html'),source.with_suffix('.pdf')}|{Path(a['path']) for a in record['assets']}
    archive=source.with_suffix('.zip')
    with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
        for p in sorted(members,key=lambda p:p.relative_to(folder).as_posix()):
            name=p.relative_to(folder).as_posix()
            if '..' in Path(name).parts or '\\' in name or ':' in name:raise ValueError('Unsafe archive member')
            info=zipfile.ZipInfo(name,(1980,1,1,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16
            z.writestr(info,p.read_bytes(),compress_type=zipfile.ZIP_DEFLATED,compresslevel=9)
    record['zip']={'path':str(archive),'sha256':sha(archive.read_bytes()),'members':len(members)}

def build(lesson_root,source_commit,revision,reservation,route='full'):
    # Real immutable inputs are inspected before any read-only Node or author command.
    verified=gate.preflight(lesson_root,source_commit,ROOT)
    attempt,manifest_path,proof_root=gate.namespace_preflight(revision,reservation,source_commit,ROOT)
    scan=gate.global_scan(ROOT,exclude=[reservation])
    if gate.revision_occupied(revision,scan,ROOT):
        raise ValueError('Revision occupied in registered global history')
    folder=lesson_root/LESSON_REL
    if not folder.is_dir():raise ValueError('Approved paragraph folder missing')
    if route not in ('full','direct'):raise ValueError('Unknown native route')
    if route=='direct' and any(not p.is_file() for p in packet_paths(folder)):
        raise ValueError('Direct route requires the complete prior native packet')
    for p in packet_paths(folder):
        if p.exists() and (not p.is_file() or p.is_symlink()):raise ValueError('Unsafe output '+str(p))
    state={'revision':revision,'source_commit':source_commit,'route':route,'runtime':sys.executable,'cwd':os.getcwd(),
           'argv':sys.argv,'inherited_path':os.environ.get('PATH'),'checks':verified['checks'],
           'global_namespace_scan':scan,'status':'STARTED'}
    # Atomic exclusive attempt consumption, after every read-only gate and before worker effects.
    with attempt.open('x',encoding='utf-8',newline='\n') as f:json.dump(state,f,ensure_ascii=False,indent=2);f.write('\n')
    from print_pipeline import build_document,render_proof
    before=snapshot(folder) if route=='direct' else None
    spec=describe();native=documents(target_record(),spec)
    if route=='full':
        gate.command(['node',CONTENT/'assets.js',folder/'_assets'])
        (folder/'build_pdf.py').write_text(wrapper(),encoding='utf-8',newline='\n')
        for kind,value in native.items():(folder/f'{STEM} – {kind}.md').write_text(value,encoding='utf-8',newline='\n')
        records=[build_document(folder/f'{STEM} – {kind}.md') for kind in KINDS]
        child=None
    else:
        for kind,value in native.items():
            if (folder/f'{STEM} – {kind}.md').read_bytes()!=value.encode():raise ValueError('Direct source mismatch')
        argv=[sys.executable,ROOT/'build-scripts/content/book-2/print_pipeline.py',*[folder/f'{STEM} – {kind}.md' for kind in KINDS]]
        child=gate.command(argv);raw=child['stdout'];decoder=json.JSONDecoder();records=[]
        while raw.strip():
            raw=raw.lstrip();value,end=decoder.raw_decode(raw);records.append(value);raw=raw[end:]
        if len(records)!=3:raise ValueError('Shared direct CLI record count')
    for kind,record in zip(KINDS,records):
        zip_document(record)
        proof=proof_root/f'232-{kind}-{record["pdf_sha256"][:12]}-{revision}'
        proof.mkdir(parents=True,exist_ok=False)
        render_proof(record,proof);record['proof_directory']=str(proof)
    final=snapshot(folder)
    if before is not None and before!=final:raise ValueError('Direct native byte parity failure')
    # Recheck authority and authored bytes after all effects; no false complete manifest on drift.
    gate.verify_current(lesson_root,ROOT);gate.verify_source(source_commit,ROOT)
    manifest={'paragraph':'2.3.2','lesson_root':str(lesson_root),'paragraph_folder':str(folder),'route':route,'revision':revision,
              'source_commit':source_commit,'source_files':verified['source'],'root_release_sha256':gate.PINS[gate.N+'232-release.json'],
              'plan_sha256':PLAN_HASH,'target_record_sha256':TARGET_HASH,'documents':records,'packet':final,
              'preflight':verified['checks'],'direct_child':child,'generation_status':'PENDING','production_ready':False,
              'root_validation':'PENDING','root_acceptance':'PENDING','handoff':'PENDING','timing':{'core':54,'support':74,'bonus':83,'all':88,'observed':False}}
    with manifest_path.open('x',encoding='utf-8',newline='\n') as f:json.dump(manifest,f,ensure_ascii=False,indent=2);f.write('\n')
    print(json.dumps({'manifest':str(manifest_path),'revision':revision,'route':route,'native_files':len(final),'pdfs':[r['pdf_sha256'] for r in records]},ensure_ascii=False))
    return manifest

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--lesson-root',type=Path,default=ROOT.parent/'4veco-lessen')
    p.add_argument('--source-commit',required=True);p.add_argument('--revision',required=True);p.add_argument('--reservation',type=Path,required=True)
    p.add_argument('--route',choices=['full','direct'],default='full');a=p.parse_args()
    build(a.lesson_root.resolve(),a.source_commit,a.revision,a.reservation.resolve(),a.route)
if __name__=='__main__':main()
