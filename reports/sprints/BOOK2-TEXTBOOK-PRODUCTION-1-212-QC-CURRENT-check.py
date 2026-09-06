"""Bounded independent QC instrumentation; never source repair or acceptance.

HOW TO ADAPT: use new actor/task/pair/prefix and an exclusive evidence folder;
do not overwrite historical reports or run this helper against another pair.
"""
from pathlib import Path, PurePosixPath
from datetime import datetime, timezone
from fractions import Fraction as F
import argparse
import base64
import hashlib
import importlib.util
import io
import json
import os
import re
import subprocess
import sys
from zipfile import ZipFile

P = Path(__file__).resolve().parents[2]
L = P.parent / '4veco-lessen'
E = P / 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-QC-CURRENT-evidence'
PBASE = 'f257056d0a455c660ccb598cb4da734b36eefd80'
LBASE = '219a977e495abe43c17949e7d8996aab4176faa0'
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-212-QC-CURRENT'
ACTOR, ROLE = 'paragraph_214_builder', 'independent212specialistQC'
STEM = '2.1.2 Opbrengsten, winst en break-even'
REL = Path('Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten') / STEM
D = L / REL
KINDS, COUNTS, ZCOUNTS = ['paragraaf','opgaven','antwoorden'], [14,7,6], [19,11,9]
SRC = 'build-scripts/content/book-2/212/'
GEN = 'build-scripts/content/book-2/b2_212.py'
PY = 'C:/Python314/python.exe'
# Root clarified that the MSYS-FIRST instruction in the dispatch was carried
# from paragraph 223. Paragraph 212's actual original r16-r18 renderer used
# inherited PATH. Failed r19 and both backend diagnostics remain immutable.
ENV = {**os.environ, 'PYTHONIOENCODING':'utf-8'}
GOOD_FULL = 'full-r2'

def h(data): return hashlib.sha256(data).hexdigest()
def raw(p): return h(Path(p).read_bytes())
def git(*args,cwd=P): return subprocess.check_output(['git',*args],cwd=cwd)
def read(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def save(name,value):
    path=E/name
    path.parent.mkdir(parents=True,exist_ok=True)
    with path.open('x',encoding='utf-8',newline='\n') as f:
        json.dump(value,f,ensure_ascii=False,indent=2); f.write('\n')
    print(name,raw(path),flush=True)
def blob(commit,path,cwd=P): return git('show',f'{commit}:{path}',cwd=cwd)
def folder(): return {p.relative_to(D).as_posix():raw(p) for p in sorted(D.rglob('*')) if p.is_file() and '__pycache__' not in p.parts}
def load_builder():
    sys.path.insert(0,str(P/'build-scripts/content/book-2'))
    import b2_212
    return b2_212
def command(name,argv,expected=0):
    path=E/(name+'.json'); assert not path.exists()
    started=datetime.now(timezone.utc).isoformat()
    result=subprocess.run(list(map(str,argv)),cwd=P,env=ENV,capture_output=True)
    save(name+'.json',{'argv':list(map(str,argv)),'cwd':str(P),'actor':ACTOR,'role':ROLE,
        'started':started,'finished':datetime.now(timezone.utc).isoformat(),'exit_code':result.returncode,
        'process_path':ENV['PATH'],'stdout':result.stdout.decode('utf-8',errors='replace'),
        'stderr':result.stderr.decode('utf-8',errors='replace'),'stdout_raw_sha256':h(result.stdout),'stderr_raw_sha256':h(result.stderr)})
    assert result.returncode==expected,(name,result.returncode)
def tracked(repo): return [s.decode() for s in git('ls-files','-z',cwd=repo).split(b'\0') if s]
def baseline():
    assert git('branch','--show-current').decode().strip()=='agent/book2-212-qc-20260906'
    assert git('rev-parse','HEAD',cwd=L).decode().strip()==LBASE
    assert git('status','--porcelain',cwd=L)==b''
    E.mkdir(exist_ok=False)
    # Execute the complete published root S1 contract without modifying it or
    # writing any of its historical evidence. These are rerun contract checks,
    # not inherited personal inspection or an independent acceptance judgment.
    name=P/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-root-check.py'
    spec=importlib.util.spec_from_file_location('readonly_root_s1_contract',name)
    module=importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
    module.E=E/'rerun-root-contract'
    module.baseline()
    native=[f'{STEM} – {kind}.{ext}' for kind in KINDS for ext in ('md','html','pdf','zip')]
    native += [n for n in folder() if n.startswith('_assets/') and n.endswith(('.svg','.png'))]
    assert len(native)==34 and len(folder())==40
    lesson_hashes={n:raw(L/n) for n in tracked(L)}
    report_names=[n for n in tracked(P) if n.startswith('reports/') and '212' in n and not n.startswith('reports/sprints/'+PREFIX)]
    history={n:raw(P/n) for n in report_names}
    inputs=[GEN,'build-scripts/content/book-2/print_pipeline.py',*['build-scripts/content/book-2/212/'+n for n in ('theory.md','exercises.md','answers.md','target-answers.md','test_source.py','test_metadata.py','test_succession.py','test_bonus.py','check_render.py')],
            'references/authored/course-target-exercises.json','references/authored/book-outlines/book-2-outline.md','references/authored/book-outlines/book-2-outline.meta.json']
    save('baseline.json',{'actor':ACTOR,'role':ROLE,'platform_base':PBASE,'lesson_base':LBASE,
        'operational_commit':git('rev-parse','HEAD').decode().strip(),'folder40':folder(),'native34':native,
        'all_initial_lesson_files':lesson_hashes,'historical212files':history,'platform_inputs':{n:raw(P/n) for n in inputs},
        'root_contract_sha256':raw(name),'root_contract_rerun_sha256':raw(module.E/'baseline.json')})
def preserve(allow_qc=False, failed_r19_prebuild=False):
    before=read(E/'baseline.json')
    failed={}
    if failed_r19_prebuild:
        diagnostic=E/'full-r19-reproduction-failure.json'
        assert raw(diagnostic)=='338274b4310d1261c010573704bdd8ee09c15c2e94b1ed7af9a1025278c87433'
        failure=read(diagnostic); assert failure['changed_count']==20
        failed={r['path']:r['new_sha256'] for r in failure['folder40'] if not r['equal']}
    for n,value in before['platform_inputs'].items(): assert raw(P/n)==value,n
    for n,value in before['historical212files'].items(): assert raw(P/n)==value,n
    qc=(REL/'2.1.2-quality-ref.yaml').as_posix()
    for n,value in before['all_initial_lesson_files'].items():
        if allow_qc and n==qc: continue
        assert raw(L/n)==failed.get(n,value),n
    assert set(tracked(L))==set(before['all_initial_lesson_files'])
    return before
def reserve(mode):
    rows=[]
    for line in git('worktree','list','--porcelain').decode().splitlines():
        if not line.startswith('worktree '): continue
        root=Path(line[9:])/'reports'
        if not root.is_dir(): continue
        for directory,children,files in os.walk(root):
            for child in children:
                m=re.fullmatch(r'212-.+-r([1-9][0-9]*)',child)
                if m: rows.append({'path':str(Path(directory)/child),'revision':int(m[1]),'kind':'directory'})
            for file in files:
                path=Path(directory)/file
                if '212' not in str(path) or not re.search(r'attempt|reserv',file,re.I): continue
                nums=re.findall(r'(?:^|[-_])r([1-9][0-9]*)(?=[-_.]|$)',file)
                if path.suffix=='.json':
                    try: nums+=re.findall(r'"(?:revision|proof_suffix|suffix)"\s*:\s*"r([1-9][0-9]*)"',path.read_text(encoding='utf-8-sig'))
                    except UnicodeError: pass
                rows.extend({'path':str(path),'revision':int(n),'kind':'attempt_or_reservation'} for n in nums)
    maximum=max(r['revision'] for r in rows); assert maximum>=18
    suffix='r'+str(maximum+1)
    save(mode+'-reservation.json',{'suffix':suffix,'max_consumed':maximum,'registered_and_nested_scan':rows})
    return suffix
def parity(mode,manifest):
    from PIL import Image
    before=preserve(); inherited=read(E/'rerun-root-contract/baseline.json')
    rows=[]
    for kind,count,zcount,record in zip(KINDS,COUNTS,ZCOUNTS,manifest['documents']):
        proof=Path(record['proof_directory']); m=read(proof/'manifest.json')
        assert m['inspection_status']=='PENDING' and m['pages_inspected']==[]
        assert len(m['page_sha256'])==count and m['page_sha256']==inherited['history'][kind]['pages']
        pages=[]
        for name,value in m['page_sha256'].items():
            current=proof/'pages'/name
            old=P/inherited['history'][kind]['directory']/'pages'/name
            assert raw(current)==raw(old)==value
            with Image.open(current) as a,Image.open(old) as b:
                assert a.mode==b.mode and a.size==b.size and a.tobytes()==b.tobytes()
                pages.append({'path':current.relative_to(P).as_posix(),'sha256':value,'pixels_sha256':h(a.tobytes()),'size':a.size})
        with ZipFile(D/f'{STEM} – {kind}.zip') as archive:
            names=archive.namelist(); assert len(names)==len(set(names))==zcount and archive.testzip() is None
            expected={f'{STEM} – {kind}.{ext}' for ext in ('md','html','pdf')}
            # Windows extended-path syntax is an invocation representation,
            # not a different artifact root. Normalize only that exact prefix.
            expected|={Path(p['path'].removeprefix('\\\\?\\')).relative_to(D).as_posix() for p in record['assets']}
            assert set(names)==expected
            members=[]
            for member in archive.infolist():
                n=PurePosixPath(member.filename)
                assert not n.is_absolute() and '..' not in n.parts and ':' not in member.filename and '\\' not in member.filename
                assert member.date_time==(1980,1,1,0,0,0)
                assert archive.read(member)==(D/member.filename).read_bytes()
                members.append({'name':member.filename,'sha256':h(archive.read(member)),'crc':member.CRC,'timestamp':member.date_time})
        rows.append({'kind':kind,'manifest_path':(proof/'manifest.json').relative_to(P).as_posix(),
            'manifest_sha256':raw(proof/'manifest.json'),'pages':pages,'zip_members':members})
    figures=[]
    for name in before['native34']:
        if not name.endswith('.png'):continue
        with Image.open(D/name) as a,Image.open(io.BytesIO(blob(LBASE,(REL/name).as_posix(),L))) as b:
            assert a.mode==b.mode and a.size==b.size and a.tobytes()==b.tobytes()
            figures.append({'path':(REL/name).as_posix(),'sha256':raw(D/name),'pixels_sha256':h(a.tobytes()),'size':a.size})
    save(mode+'-parity.json',{'pass':True,'native34':{n:raw(D/n) for n in before['native34']},'initial_folder_count':40,
        'all_other_lesson_bytes_unchanged':True,'documents':rows,'figures':figures,'personal_inspection':'NOT_INFERRED'})
def build(mode):
    # Only root-authorized full-r2 may consume the exact failed-r19 outputs.
    # Every source and other file remains original; postbuild parity is strict.
    preserve(failed_r19_prebuild=mode==GOOD_FULL)
    suffix=reserve(mode); manifest=E/(mode+'-manifest.json'); assert not manifest.exists()
    if mode=='print': argv=[PY,__file__,'print-worker','--suffix',suffix,'--manifest',manifest]
    else:
        script=D/'build_pdf.py' if mode=='thin' else P/GEN
        argv=[PY,script,'--lesson-root','\\\\?\\'+str(L).replace('/','\\'),'--proof-root',E/'proofs','--proof-suffix',suffix,'--manifest',manifest]
    command(mode+'-process',argv); parity(mode,read(manifest))
def worker(suffix,manifest):
    b=load_builder(); documents=[]
    for kind in KINDS:
        record=b.build_document(D/f'{STEM} – {kind}.md'); record['zip']=b.zip_document(record)
        directory=E/'proofs'/f"212-{kind}-{record['pdf_sha256'][:12]}-{suffix}"
        assert not directory.exists(); b.render_proof(record,directory); record['proof_directory']=str(directory)
        documents.append(record)
    with manifest.open('x',encoding='utf-8',newline='\n') as f:
        json.dump({'inspection_status':'PENDING','documents':documents},f,ensure_ascii=False,indent=2); f.write('\n')
def grays():
    from PIL import Image
    before=preserve(); manifest=read(E/(GOOD_FULL+'-parity.json')); records=[]
    for doc in manifest['documents']:
        for page in doc['pages']:
            original=P/page['path']; out=E/'grayscale-pages'/doc['kind']/original.name
            out.parent.mkdir(parents=True,exist_ok=True); assert not out.exists()
            with Image.open(original) as im: im.convert('L').save(out)
            records.append({'kind':doc['kind'],'original':page['path'],'original_sha256':raw(original),'gray':out.relative_to(P).as_posix(),'gray_sha256':raw(out)})
    figures=[]
    for rec in manifest['figures']:
        original=L/rec['path']; out=E/'grayscale-figures'/original.name
        out.parent.mkdir(parents=True,exist_ok=True); assert not out.exists()
        with Image.open(original) as im: im.convert('L').save(out)
        figures.append({'original':rec['path'],'original_sha256':raw(original),'gray':out.relative_to(P).as_posix(),'gray_sha256':raw(out)})
    save('grayscale-binding.json',{'pages':records,'figures':figures,'personal_inspection':'NOT_YET_RECORDED'})
def gates(prefix=''):
    command(prefix+'native-check-process',[PY,SRC+'check_render.py',E/(prefix+'native-check.json')])
    for profile in ('student-web','publisher-print'):
        command(prefix+profile,['node','scripts/validate-paragraph.js','--mode','part-a','--profile',profile,D])
    for action in ('paragraph_production','specialist_review'):
        command(prefix+'currentness-'+action,['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action',action,'--paragraph','2.1.2'])
    command(prefix+'durable',['node','build-scripts/workflows/check-book2-target-authority-remediation.js','--durable'])
    command(prefix+'active-bundle',['node','build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1'])
    preserve(allow_qc=True)

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode',choices=['baseline','tests','full','full-r2','verify-full-r2','thin','print','rebuild','print-worker','grays','gates','integrity'])
    parser.add_argument('--suffix'); parser.add_argument('--manifest',type=Path); args=parser.parse_args()
    if args.mode=='baseline': baseline()
    elif args.mode=='tests': command('tests',[PY,'-m','unittest','discover','-s',SRC,'-p','test_*.py','-v'])
    elif args.mode in ('full','full-r2','thin','print','rebuild'): build(args.mode)
    elif args.mode=='print-worker': worker(args.suffix,args.manifest)
    elif args.mode=='verify-full-r2': parity(GOOD_FULL,read(E/(GOOD_FULL+'-manifest.json')))
    elif args.mode=='grays': grays()
    elif args.mode=='gates': gates()
    else:
        before=preserve(allow_qc=True)
        for mode in (GOOD_FULL,'thin','print','rebuild'):
            proof=read(E/(mode+'-parity.json'))
            for doc in proof['documents']:
                assert raw(P/doc['manifest_path'])==doc['manifest_sha256']
                for page in doc['pages']: assert raw(P/page['path'])==page['sha256']
        save('final-integrity.json',{'pass':True,'historical212files':len(before['historical212files']),
             'unchanged_other_lesson_files':len(before['all_initial_lesson_files'])-1,'native_files':34,
             'new_pending_manifests':12,'fresh_reproduced_page_pngs':108,'root_acceptance':'PENDING','handoff':'STALE_UNCHANGED'})
