"""Boundaries for the combined navigation, teacher advice and heading repair."""
from pathlib import Path
import hashlib
import json
import subprocess
import sys

from books34_signed_common import require, sha, write_json, environment, pdf_equal

HERE=Path(__file__).resolve().parent
PLATFORM=HERE.parents[1]
EDITION='edities/books34-v3'
CONTRACT=json.loads((HERE/'books34-followups-contract.json').read_text(encoding='utf-8'))
BASE=CONTRACT['lessons_base']
REVISION=CONTRACT['revision']
CHAPTERS=('3.1','3.2','3.3','4.1','4.2','4.3')
SOURCES={r['path'] for r in CONTRACT['source_bindings']}
PUBLICATIONS=set()
for c in CHAPTERS:
    for suffix in ('.html','.pdf','_page_map.json'):
        PUBLICATIONS.add(f'books/book-{c[0]}/chapters/{c}/output/Boek_{c[0]}_H{c[-1]}_Docenteninformatie_v3'+suffix)
for suffix in ('.html','.pdf','_page_map.json'):
    PUBLICATIONS.add('books/book-3/chapters/3.2/output/Boek_3_H2_Antwoorden_v3'+suffix)
for b in ('3','4'):
    for suffix in ('.html','.pdf','_page_map.json'):
        PUBLICATIONS.add(f'books/book-{b}/book-matter/output/front-teacher'+suffix)
    PUBLICATIONS.update({f'books/book-{b}/output/Boek_{b}_Compleet_v3.pdf',f'books/book-{b}/output/Boek_{b}_Compleet_Docenteninformatie_v3.pdf'})
PUBLICATIONS.add('books/book-3/output/Boek_3_Compleet_Antwoorden_v3.pdf')
PINS={f'curriculum/targets/3.2.{i}.json' for i in range(1,5)}|{'curriculum/course-target-exercises-books34-v3.json'}
META={'README.md','SOURCE_OWNERSHIP.md','FOLLOWUPS-2026-09-28.md','build/build_all.py',
      'checks/followups-build.json','checks/followups-verification.json'}
ALLOWED=SOURCES|{EDITION+'/'+x for x in PUBLICATIONS|PINS|META}
RECEIPT='.books34-followups-baseline.json'


def git(lessons,*args):
    return subprocess.check_output(['git',*args],cwd=lessons)


def original(lessons,path):
    return git(lessons,'show',BASE+':'+path)


def baseline_tree(lessons):
    return {r.split('\t')[1]:r.split('\t')[0].split()[2] for r in
            git(lessons,'ls-tree','-r','-z',BASE,'--',EDITION).decode().split('\0') if r}


def files(lessons):
    return {p.relative_to(lessons).as_posix():p for p in (lessons/EDITION).rglob('*')
            if p.is_file() and '__pycache__' not in p.parts}


def guard(lessons,baseline=False,repository=None):
    tree=baseline_tree(repository or lessons); actual=files(lessons)
    require(not set(tree)-set(actual),'Removed predecessor file')
    for name,file in actual.items():
        if not baseline and name in ALLOWED:continue
        data=file.read_bytes()
        blob=hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
        require(tree.get(name)==blob,'Unlisted/changed input '+name)
    for row in CONTRACT['source_bindings']:
        data=(lessons/row['path']).read_bytes()
        require(sha(data)==row['baseline_sha256' if baseline else 'proposed_sha256'],'Unreviewed source '+row['path'])
        if not baseline:
            text=data.decode()
            for edit in reversed(CONTRACT['source_edits']):
                if edit['path']==row['path']:
                    require(text.count(edit['new'])==1,'Ambiguous source delta '+row['path'])
                    text=text.replace(edit['new'],edit['old'],1)
            require(sha(text.encode())==row['baseline_sha256'],'Non-contract source delta')


def tools():
    return {f:sha((HERE/f).read_bytes()) for f in ('rebuild_books34_followups.py','books34_followups_common.py',
        'books34-followups-contract.json','books34_followups_assemble.py','books34_assemble.py',
        'books34_links.py','books34_records.py','requirements-exercise-routes.txt')}


def receipt(lessons):
    return {'revision':REVISION,'baseline':BASE,'tools':tools(),'environment':environment(),
            'files':{name:sha(file.read_bytes()) for name,file in sorted(files(lessons).items())}}


def authenticate(comparison,lessons):
    require(comparison and comparison.resolve()!=lessons.resolve(),'Distinct rebuilt baseline required')
    data=(comparison/RECEIPT).read_bytes()
    require(json.loads(data)==receipt(comparison),'Stale baseline receipt, tools or environment')
    for row in CONTRACT['source_bindings']:
        require(sha((comparison/row['path']).read_bytes())==row['baseline_sha256'],'Baseline source not accepted')
    return {'commit':BASE,'receipt_sha256':sha(data),'same_environment':True}


def target_check(lessons):
    path=EDITION+'/curriculum/course-target-exercises-books34-v3.json'
    expected=json.loads(original(lessons,path)); count=0
    for record in expected['records']:
        if record['id'].startswith('3.2.'):
            record['source_pin']['answer_file_sha256']=sha((lessons/EDITION/record['source_pin']['answer_file']).read_bytes());count+=1
        current=json.loads((lessons/EDITION/'curriculum/targets'/f'{record["id"]}.json').read_text(encoding='utf-8'))
        require(current==record,'Changed payload/route/status or stale pin '+record['id'])
        for key,source in [('answer_file_sha256','answer_file'),('student_manuscript_sha256','student_file')]:
            require(record['source_pin'][key]==sha((lessons/EDITION/record['source_pin'][source]).read_bytes()),'Source mismatch '+record['id'])
    require(json.loads((lessons/path).read_text(encoding='utf-8'))==expected,'Changed combined target file')
    require(count==4,'Expected four chapter answer pins')
    return {'targets_preserved':len(expected['records']),'answer_pins_refreshed':count,'routes_and_null_timings_preserved':True}
