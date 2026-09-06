"""Independent exact-pair delta probes, immutable JSON evidence, no acceptance.

HOW TO ADAPT: write a new task and immutable subject; do not rerun fixed outputs.
Native builds are isolated; this file never restores generated lesson bytes.
"""
from pathlib import Path, PurePosixPath
from contextlib import ExitStack
from unittest.mock import patch
import argparse
import ast
import datetime
import hashlib
import json
import os
import re
import subprocess
import sys
from zipfile import ZipFile

P = Path(__file__).resolve().parents[2]
L = P.parent / '4veco-lessen'
BASE = '572d1ea2ededaffd28afc44eeeca223252a58ec5'
SUBJECT = '698699c2cbf4588907a00667f0268852114bd5ef'
LESSON = 'd4e1910d60964ee4b9ac97eefbf0e0ed202fc28f'
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-REVIEW'
E = P / 'reports/sprints' / (PREFIX + '-evidence')
OLD = P / 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-R7-REVIEW-evidence'
AUTHOR = P / 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-evidence'
REL = Path('Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even')
F = L / REL
STEM = '2.1.2 Opbrengsten, winst en break-even'
KINDS = ('paragraaf', 'opgaven', 'antwoorden')
PY = 'C:/Python314/python.exe'
GEN = 'build-scripts/content/book-2/b2_212.py'
SRC = 'build-scripts/content/book-2/212/'
SWAPS = (
 ('PRIOR_REVIEW_HASH', '92b4a9462caf8316274fb58f8beef5c850147c44e6bf80b9a28fad442d9dbe96', 'a75755c7c2e6cdffb2defcbb5403814cf854d87bfae9a8172dd768aadb5b8023'),
 ('PRIOR_QUALITY_HASH', '0dddb6e9d8f3a8da0e0f31e67dafabf53b99feb6ad86ce72039480dd7e12ea18', 'c85c44a53d46af87ad61500b83b0fd721fac43c97ffd1be3d512308158a4b9f5'),
)


def h(data): return hashlib.sha256(data).hexdigest()
def raw(path): return h(path.read_bytes())
def read(path): return json.loads(path.read_text(encoding='utf-8'))
def git(*args, cwd=P): return subprocess.check_output(['git', *args], cwd=cwd)
def blob(ref, name, cwd=P): return git('show', ref + ':' + str(name).replace('\\','/'), cwd=cwd)
def save(name, data):
    E.mkdir(parents=True, exist_ok=True)
    with (E / name).open('x', encoding='utf-8', newline='\n') as out:
        out.write(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def cmd(name, argv, expected=0):
    start = datetime.datetime.now(datetime.timezone.utc).isoformat()
    run = subprocess.run(list(map(str, argv)), cwd=P, capture_output=True)
    data = dict(argv=list(map(str, argv)), cwd=str(P), started_at=start,
                finished_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
                exit_code=run.returncode, stdout=run.stdout.decode('utf-8', errors='replace'),
                stderr=run.stderr.decode('utf-8', errors='replace'),
                stdout_sha256=h(run.stdout), stderr_sha256=h(run.stderr))
    save(name + '.json', data)
    print(name, 'exit', run.returncode, flush=True)
    if expected is not None: assert run.returncode == expected, (name, run.returncode)
    return data


def native():
    names = [f'{STEM} – {k}.{x}' for k in KINDS for x in ('md','html','pdf','zip')]
    names += [p.relative_to(F).as_posix() for p in sorted((F/'_assets').iterdir()) if p.suffix in ('.svg','.png')]
    assert len(names) == len(set(names)) == 34
    return {n:raw(F/n) for n in names}


def archives():
    data = {}
    for kind, count in zip(KINDS, (19,11,9)):
        with ZipFile(F/f'{STEM} – {kind}.zip') as z:
            names = z.namelist()
            assert len(names) == len(set(names)) == count and z.testzip() is None
            items = []
            for i in z.infolist():
                name = PurePosixPath(i.filename)
                assert not name.is_absolute() and '..' not in name.parts
                assert '\\' not in i.filename and ':' not in i.filename and not i.is_dir()
                assert name.suffix in ('.svg','.png','.md','.html','.pdf')
                assert i.filename.startswith('_assets/') or i.filename.startswith(f'{STEM} – {kind}.')
                data_bytes = z.read(i.filename)
                assert data_bytes == (F/i.filename).read_bytes()
                items.append(dict(name=i.filename, crc=i.CRC, size=i.file_size,
                                  sha256=h(data_bytes), timestamp=list(i.date_time)))
            data[kind] = items
    return data


def tracked_bindings(ref, roots, cwd=P):
    rows = {}
    for entry in git('ls-tree','-rz','--full-tree',ref,*roots,cwd=cwd).split(b'\0'):
        if not entry: continue
        info, name = entry.split(b'\t',1)
        name = name.decode('utf-8')
        data = git('cat-file','blob',info.split()[2].decode(),cwd=cwd)
        actual = (cwd/name).read_bytes()
        # Git checkout EOL is not a generated-byte claim; record both explicitly.
        assert actual == data or actual.replace(b'\r\n',b'\n') == data, name
        rows[name] = dict(raw_sha256=h(actual), git_sha256=h(data))
    return rows


def bind():
    assert git('rev-parse','HEAD',cwd=L).decode().strip() == LESSON
    assert git('status','--porcelain',cwd=L) == b''
    gen_before = blob(BASE,GEN).decode()
    expected = gen_before
    for name,old,new in SWAPS:
        a,b = f'{name} = "{old}"', f'{name} = "{new}"'
        assert expected.count(a) == 1 and expected.count(b) == 0
        expected = expected.replace(a,b,1)
    assert (P/GEN).read_text(encoding='utf-8') == expected
    source_changes = git('diff','--name-only',BASE,SUBJECT,'--','build-scripts').decode().splitlines()
    assert set(source_changes) == {GEN,SRC+'test_metadata.py',SRC+'test_succession.py'}
    for name in ('theory.md','exercises.md','answers.md','target-answers.md','test_source.py','test_bonus.py'):
        assert (P/SRC/name).read_bytes() == blob(BASE,SRC+name)
    before = ast.parse(blob(BASE,SRC+'test_metadata.py').decode())
    after = ast.parse((P/SRC/'test_metadata.py').read_text(encoding='utf-8'))
    def nodes(tree):
        return {n.name:ast.dump(n,include_attributes=False) for n in ast.walk(tree)
                if isinstance(n,ast.FunctionDef) and n.name != 'test_unchanged_generator_outside_title_loop'}
    assert nodes(before) == nodes(after)
    assert len([n for n in nodes(before) if n.startswith('test_')]) == 4
    old_method = next(n for n in ast.walk(before) if isinstance(n,ast.FunctionDef) and n.name == 'test_unchanged_generator_outside_title_loop')
    new_method = next(n for n in ast.walk(after) if isinstance(n,ast.FunctionDef) and n.name == old_method.name)
    assert len(new_method.body) == len(old_method.body)+8
    assert [ast.dump(n) for n in new_method.body[:-9]] == [ast.dump(n) for n in old_method.body[:-1]]
    assert ast.dump(new_method.body[-1]) == ast.dump(old_method.body[-1])
    predecessor = F.parent/'2.1.1 Kostenstructuren'
    for name,expected_hash in [('2.1.1-review.md',SWAPS[0][2]),('2.1.1-quality-ref.yaml',SWAPS[1][2]),
        ('2.1.1-textbook-handoff.md','0d14506e314a11fef0637cc66cf29036f174b94cafbf7fa5ede2eff88937500f')]:
        data = blob('5e14325d70b6cc6aee643d9b57395c92b0904ffb',(predecessor/name).relative_to(L),cwd=L)
        assert data == (predecessor/name).read_bytes() and h(data) == expected_hash
    for name,value in [('2.1.2-review.md','79429b9f1750710baae46751a5792e4a02e7c177888a01f5ca3a15c4039a78f7'),
        ('2.1.2-quality-ref.yaml','e168e3c2b8698d12b699fbf60e7691fbbc8a15d61bd46a7988704d3c896c805c'),
        ('2.1.2-textbook-handoff.md','de2b8ed7dcc7a3c5c6eaac400892d2d37ac5212ccb3b9972fb004115a88c1fe2')]:
        assert raw(F/name) == value
    platform = tracked_bindings(SUBJECT,['build-scripts/content/book-2','references/authored','references/owned','reports/sprints','reports/rendered-proof'])
    # Exclude no inherited evidence: every subject reports file is included.
    supplement = read(AUTHOR/'inherited-proof-supplement.json')['files']
    assert len(supplement) == 171
    for name,values in supplement.items():
        assert raw(P/name) == values['raw_sha256'] and h(blob(BASE,name)) == values['git_blob_sha256']
    lessons = tracked_bindings(LESSON,[REL.as_posix(),predecessor.relative_to(L).as_posix()],cwd=L)
    for mode,rev in [('full','r10'),('thin','r11'),('print','r12')]:
        manifest=read(AUTHOR/f'{mode}-{rev}-build.json')
        proof=read(AUTHOR/f'{mode}-{rev}-reproduction.json')
        assert proof['result']=='PASS' and proof['raw_native']==native()
        assert read(AUTHOR/f'{mode}-{rev}-command.json')['exit_code']==0
        assert raw(AUTHOR/f'{mode}-{rev}-build.json') == proof['build_manifest_sha256']
        assert len(proof['pages'])==27
        for row in proof['pages']:
            assert raw(P/row['current'])==raw(P/row['old'])==row['sha256']
        for doc in manifest['documents']:
            directory = P / Path(doc['proof_directory']).relative_to(Path('C:/wt/book2-212-succession-20260906/4veco-platform'))
            pm=read(directory/'manifest.json')
            assert pm['inspection_status']=='PENDING' and pm['pages_inspected']==[]
            for filename,digest in pm['page_sha256'].items(): assert raw(directory/'pages'/filename)==digest
    save('initial-bindings.json',dict(result='PASS',subject=SUBJECT,base=BASE,lessons_head=LESSON,
         platform=platform,lessons=lessons,native=native(),archives=archives(),inherited_proof_count=171,
         generator_sha256=raw(P/GEN),source_changes=source_changes))
    print('Independent immutable subject, predecessor, builder proof and native bindings PASS.',flush=True)


def preserve():
    initial=read(E/'initial-bindings.json')
    for root,key in [(P,'platform'),(L,'lessons')]:
        for name,values in initial[key].items(): assert raw(root/name)==values['raw_sha256'],name
    assert native()==initial['native'] and archives()==initial['archives']
    assert git('status','--porcelain',cwd=L)==b''
    return initial


def negatives():
    sys.path[:0]=[str(P/'build-scripts/content/book-2'),str(P/SRC)]
    import b2_212 as b
    import test_metadata as m
    original_read=Path.read_text
    original_open=Path.open
    rows=[]
    for name in ('2.1.1-review.md','2.1.1-quality-ref.yaml'):
        for problem in ('missing','wrong'):
            calls=[]
            target=F.parent/'2.1.1 Kostenstructuren'/name
            def reader(p,*args,**kwargs):
                if p==target:
                    if problem=='missing': raise FileNotFoundError(str(p))
                    return original_read(p,*args,**kwargs)+'\nUntrusted revision\n'
                return original_read(p,*args,**kwargs)
            def guard(label):
                def fail(*args,**kwargs):
                    calls.append(label)
                    raise AssertionError('Unexpected side effect: '+label)
                return fail
            def opener(p,mode='r',*args,**kwargs):
                if any(x in mode for x in ('w','a','x','+')): return guard('open_for_write')()
                return original_open(p,mode,*args,**kwargs)
            with ExitStack() as st:
                st.enter_context(patch.object(Path,'read_text',reader))
                st.enter_context(patch.object(Path,'open',opener))
                for label,owner,key in [('subprocess',b.subprocess,'run'),('mkdir',Path,'mkdir'),
                    ('write_text',Path,'write_text'),('write_bytes',Path,'write_bytes'),('document',b,'build_document')]:
                    st.enter_context(patch.object(owner,key,guard(label)))
                try: b.build(L,proof_suffix='r999')
                except (ValueError,FileNotFoundError) as error: observed=type(error).__name__
                else: raise AssertionError('Invalid dependency accepted')
            assert not calls
            rows.append(dict(input=name,problem=problem,result='REJECTED',exception=observed,side_effect_calls=calls))
    # Existing whole-file guards exercised against actual perturbed reads.
    mutations={GEN:blob(SUBJECT,GEN).decode()+'\n# Unauthorized scope drift\n'}
    mutations.update({SRC+name:blob(BASE,SRC+name).decode()+'\nUnauthorized text\n' for name in ('theory.md','exercises.md','answers.md','target-answers.md')})
    for name,fixture in mutations.items():
        def reader(p,*args,**kwargs): return fixture if p==P/name else original_read(p,*args,**kwargs)
        with patch.object(Path,'read_text',reader):
            try:
                method='test_unchanged_generator_outside_title_loop' if name==GEN else 'test_nine_exact_native_insertions_and_unchanged_full_sources'
                getattr(m.MetadataTests(method),method)()
            except AssertionError: pass
            else: raise AssertionError('Drift accepted: '+name)
        rows.append(dict(path=name,fixture_sha256=h(fixture.encode()),result='REJECTED'))
    preserve()
    save('independent-negative-probes.json',dict(result='PASS',probes=rows,real_records_unchanged=True))
    print('Nine independent negative read probes PASS; no real file mutation.',flush=True)


def reserve(mode):
    rows=[]
    for line in git('worktree','list','--porcelain').decode().splitlines():
        if not line.startswith('worktree '): continue
        report=Path(line[9:])/'reports'
        if not report.is_dir(): continue
        for directory,children,files in os.walk(report):
            for child in children:
                match=re.fullmatch(r'212-.+-r([1-9][0-9]*)',child)
                if match: rows.append(dict(path=str(Path(directory)/child),revision=int(match[1])))
            for file in files:
                path=Path(directory)/file
                if '212' not in str(path) or not re.search('attempt|reserv',file,re.I): continue
                revisions=re.findall(r'(?:^|[-_])r([1-9][0-9]*)(?=[-_.]|$)',file)
                if not revisions and path.suffix=='.json':
                    revisions=re.findall(r'"(?:revision|proof_suffix|suffix)"\s*:\s*"r([1-9][0-9]*)"',path.read_text(encoding='utf-8'))
                rows.extend(dict(path=str(path),revision=int(n)) for n in revisions)
    revision='r'+str(max([12]+[r['revision'] for r in rows])+1)
    save('reservation-'+revision+'.json',dict(mode=mode,revision=revision,used=rows,python=PY,path=os.environ['PATH']))
    return revision


def reproduction(mode):
    preserve()
    revision=reserve(mode)
    destination=E/'proofs'
    manifest=E/f'{mode}-{revision}-build.json'
    assert not manifest.exists()
    if mode=='print': argv=[PY,__file__,'print-worker','--revision',revision,'--manifest',manifest]
    else:
        script=P/GEN if mode=='full' else F/'build_pdf.py'
        argv=[PY,script,'--proof-root',destination,'--proof-suffix',revision,'--manifest',manifest]
        if mode=='full': argv+=['--lesson-root',L]
    cmd(f'{mode}-{revision}-command',argv)
    preserve()
    current=read(manifest)
    assert current['inspection_status']=='PENDING'
    from PIL import Image, ImageChops
    pages=[]
    for kind,doc,count in zip(KINDS,current['documents'],(14,7,6)):
        old=OLD/f"212-{kind}-{doc['pdf_sha256'][:12]}-r9"
        fresh=Path(doc['proof_directory'])
        pm=read(fresh/'manifest.json')
        assert pm['inspection_status']=='PENDING' and pm['pages_inspected']==[]
        before=sorted((old/'pages').glob('page-*.png'))
        after=sorted((fresh/'pages').glob('page-*.png'))
        assert len(before)==len(after)==count
        for a,z in zip(before,after):
            assert a.read_bytes()==z.read_bytes()
            with Image.open(a) as x,Image.open(z) as y:
                assert x.size==y.size and ImageChops.difference(x.convert('RGB'),y.convert('RGB')).getbbox() is None
            pages.append(dict(kind=kind,old=a.relative_to(P).as_posix(),current=z.relative_to(P).as_posix(),sha256=raw(z),pixel_difference=False))
    save(f'{mode}-{revision}-comparison.json',dict(result='PASS',mode=mode,revision=revision,
        manifest_sha256=raw(manifest),native=native(),archives=archives(),pages=pages))
    print(f'{mode} {revision}: all34 bytes, ZIP19/11/9 and27 raw/pixel pages identical.',flush=True)


def print_worker(revision,manifest):
    sys.path.insert(0,str(P/'build-scripts/content/book-2'))
    import b2_212 as b
    docs=[]
    for kind in KINDS:
        record=b.build_document(F/f'{STEM} – {kind}.md')
        record['zip']=b.zip_document(record)
        directory=E/'proofs'/f"212-{kind}-{record['pdf_sha256'][:12]}-{revision}"
        b.render_proof(record,directory)
        record['proof_directory']=str(directory)
        docs.append(record)
    with Path(manifest).open('x',encoding='utf-8',newline='\n') as output:
        output.write(json.dumps(dict(inspection_status='PENDING',documents=docs),ensure_ascii=False,indent=2)+'\n')


def validate():
    jobs=[('25-tests',[PY,'-m','unittest','discover','-s',SRC,'-p','test_*.py','-v']),
          ('native-checker',[PY,SRC+'check_render.py']),
          ('student-web',['node','scripts/validate-paragraph.js','--mode','part-a','--profile','student-web',F]),
          ('publisher-print',['node','scripts/validate-paragraph.js','--mode','part-a','--profile','publisher-print',F]),
          ('currentness',['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.1.2']),
          ('durable',['node','build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']),
          ('active-bundle',['node','build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1'])]
    for name,argv in jobs: cmd(name,argv)
    preserve()


if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('mode',choices=['bind','negative','full','thin','print','print-worker','validate','preserve'])
    parser.add_argument('--revision'); parser.add_argument('--manifest')
    args=parser.parse_args()
    if args.mode=='bind': bind()
    elif args.mode=='negative': negatives()
    elif args.mode=='validate': validate()
    elif args.mode=='preserve': preserve(); print('Immutable source/evidence/native preservation PASS.')
    elif args.mode=='print-worker': print_worker(args.revision,args.manifest)
    else: reproduction(args.mode)
