"""Root-only current212 verification. HOW TO ADAPT: a new bound phase, never old proof reuse.

No personal inspection or acceptance is inferred from a generator or hash.
"""
from pathlib import Path, PurePosixPath
from datetime import datetime, timezone
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

P=Path(__file__).resolve().parents[2]; L=P.parent/'4veco-lessen'
PREFIX='BOOK2-TEXTBOOK-PRODUCTION-1-212-root-qc'; E=P/'reports/sprints'/(PREFIX+'-evidence')
SPECIAL='BOOK2-TEXTBOOK-PRODUCTION-1-212-QC-CURRENT'; SE=P/'reports/sprints'/(SPECIAL+'-evidence')
BASE='c724f1ae2cee0f4bf089c5b9da2ebaa1f55e5d6b'; LB='d0d84a5f411c23141954090f3bc1d234e7e45cd3'
LH='301ce23aab7582bc0723e9a2319c57d39fec9578'; IMPORT='42a15f8ddaaf43acc2873b150f0deff7236840fd'
STEM='2.1.2 Opbrengsten, winst en break-even'
REL=Path('Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten')/STEM
D=L/REL; GEN='build-scripts/content/book-2/b2_212.py'; SRC='build-scripts/content/book-2/212/'
KINDS=['paragraaf','opgaven','antwoorden']; COUNTS=[14,7,6]; ZCOUNTS=[19,11,9]
ENV={**os.environ,'PYTHONIOENCODING':'utf-8'}

def h(b):return hashlib.sha256(b).hexdigest()
def raw(p):
    p=Path(p)
    if os.name=='nt' and not str(p).startswith('\\\\?\\'):p=Path('\\\\?\\'+str(p.resolve()))
    return h(p.read_bytes())
def read(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def git(*args,cwd=P):return subprocess.check_output(['git',*args],cwd=cwd)
def blob(ref,name,cwd=P):return git('show',ref+':'+name,cwd=cwd)
def save(name,value):
    p=E/name;p.parent.mkdir(parents=True,exist_ok=True)
    with p.open('x',encoding='utf-8',newline='\n') as f:json.dump(value,f,ensure_ascii=False,indent=2);f.write('\n')
    print(name,raw(p),flush=True)
def tracked(cwd):return [n.decode() for n in git('ls-files','-z',cwd=cwd).split(b'\0') if n]
def folder():return {p.relative_to(D).as_posix():raw(p) for p in sorted(D.rglob('*')) if p.is_file() and '__pycache__' not in p.parts}
def sources():
    # Only this pure complete-byte source check is reused. No old baseline,
    # native writer, destination, fixed-head checker or personal verdict is run.
    p=P/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-root-check.py'
    spec=importlib.util.spec_from_file_location('s1_pure_source_check',p)
    m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
    return m.sources()
def baseline():
    assert git('rev-parse','HEAD',cwd=L).decode().strip()==LH
    assert git('status','--porcelain',cwd=L)==b''
    changed=[n.decode() for n in git('diff','--name-only','-z',LB,LH,cwd=L).split(b'\0') if n]
    assert changed==[(REL/'2.1.2-quality-ref.yaml').as_posix()]
    if E.exists():
        assert {p.name for p in E.iterdir()}=={'initial-baseline-diagnostic.md'}
    else:E.mkdir(exist_ok=False)
    imported=[]
    names=[n.decode() for n in git('ls-tree','-r','-z','--name-only',IMPORT).split(b'\0') if n]
    for n in names:
        if n.startswith('reports/sprints/'+SPECIAL+'-'):
            b=blob(IMPORT,n);assert (P/n).read_bytes()==b,n
            imported.append({'path':n,'commit':IMPORT,'git_blob':git('rev-parse',IMPORT+':'+n).decode().strip(),'sha256':h(b)})
    assert len(imported)==270
    final=read(SE/'final-integrity.json');personal=read(SE/'personal-inspection.json');old=read(SE/'baseline.json')
    assert raw(SE/'final-integrity.json')=='0cc32a6093665d5cf1fac7bdbca2b7403e437c76a4c5f6d02505c41c0ba0c9a7'
    assert raw(SE/'personal-inspection.json')=='df9979e3d8ef99981a0490b756cf1c0290b9cb7c1972cb7fa4d0f825b6f06247'
    assert raw(D/'2.1.2-quality-ref.yaml')==final['qc_sha256']=='90e0fcf3dee8af8400948b45a6331bc3e4e66b1444dd02f7dbb604b85c1c57df'
    for n,value in final['evidence_raw_hashes'].items():assert raw(SE/n)==value,n
    assert personal['actor']=='paragraph_214_builder' and personal['actual_views']==76
    assert len(personal['all_color_and_grayscale_pages'])==27 and len(personal['all_color_and_grayscale_figures'])==11
    for kind in ['pages','figures']:
        for r in personal['all_color_and_grayscale_'+kind]:
            original=(P if kind=='pages' else L)/r['original']
            assert raw(original)==r['original_sha256'] and raw(P/r['gray'])==r['gray_sha256']
            assert r['personal_color_and_grayscale_observation']
    assert len(final['all_new_pending_manifests'])==15
    for r in final['all_new_pending_manifests']:
        p=P/r['path'];m=read(p);assert raw(p)==r['sha256']
        assert m['inspection_status']=='PENDING' and m['pages_inspected']==[]
        assert m['page_sha256']==r['page_sha256']
        for n,value in m['page_sha256'].items():assert raw(p.parent/'pages'/n)==value
    for n,value in old['platform_inputs'].items():assert raw(P/n)==value,n
    for n,value in old['historical212files'].items():assert raw(P/n)==value,n
    current=folder();assert len(current)==40
    for n,value in old['folder40'].items():
        if n!='2.1.2-quality-ref.yaml':assert current[n]==value,n
    original=read(P/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-root-evidence/baseline.json')
    native=old['native34'];assert len(native)==34
    save('baseline.json',{'base':BASE,'lesson_base':LB,'lesson_head':LH,'imports':imported,
        'source_binding':sources(),'paragraph_files':current,'native_files':native,'history':original['history'],
        'specialist_original_inputs':old['platform_inputs'],'historical212':old['historical212files'],
        'all_lesson_files':{n:raw(L/n) for n in tracked(L)},'specialist_personal_views':76,'root_personal_views':0,
        'specialist_qc':final['qc_sha256'],'root_acceptance':'PENDING','handoff':'STALE_UNCHANGED'})
def preserve():
    b=read(E/'baseline.json');assert folder()==b['paragraph_files'];assert sources()==b['source_binding']
    assert set(tracked(L))==set(b['all_lesson_files'])
    for n,v in b['all_lesson_files'].items():assert raw(L/n)==v,n
    for r in b['imports']:assert raw(P/r['path'])==r['sha256'],r['path']
    for n,v in b['historical212'].items():assert raw(P/n)==v,n
    for n,v in b['specialist_original_inputs'].items():assert raw(P/n)==v,n
    assert git('status','--porcelain',cwd=L)==b''
    return b
def command(name,argv):
    argv=list(map(str,argv));started=datetime.now(timezone.utc).isoformat()
    r=subprocess.run(argv,cwd=P,env=ENV,capture_output=True)
    save(name+'.json',{'argv':argv,'cwd':str(P),'started':started,'ended':datetime.now(timezone.utc).isoformat(),
        'exit_code':r.returncode,'inherited_path':ENV['PATH'],'stdout':r.stdout.decode('utf-8',errors='replace'),
        'stderr':r.stderr.decode('utf-8',errors='replace'),'stdout_base64':base64.b64encode(r.stdout).decode(),
        'stderr_base64':base64.b64encode(r.stderr).decode(),'stdout_sha256':h(r.stdout),'stderr_sha256':h(r.stderr)})
    assert r.returncode==0,(name,r.returncode)
def reserve(mode):
    seen=[]
    for line in git('worktree','list','--porcelain').decode().splitlines():
        if not line.startswith('worktree '):continue
        reports=Path(line[9:])/'reports'
        if not reports.is_dir():continue
        for directory,dirs,files in os.walk(reports):
            for n in dirs:
                m=re.fullmatch(r'212-.+-r([1-9][0-9]*)',n)
                if m:seen.append({'path':str(Path(directory)/n),'revision':int(m[1])})
            for n in files:
                p=Path(directory)/n;rel=p.relative_to(reports).as_posix()
                if not re.search(r'(?:^|[/_-])212(?:[/_.-]|$)',rel) or not re.search(r'attempt|reserv',n,re.I):continue
                nums=re.findall(r'(?:^|[-_])r([1-9][0-9]*)(?=[-_.]|$)',n)
                if p.suffix=='.json':nums+=re.findall(r'"(?:revision|proof_suffix|suffix)"\s*:\s*"r([1-9][0-9]*)"',p.read_text(encoding='utf-8-sig'))
                seen.extend({'path':str(p),'revision':int(i)} for i in nums)
    maximum=max(r['revision'] for r in seen);assert maximum>=23
    suffix='r'+str(maximum+1);save(mode+'-reservation.json',{'suffix':suffix,'maximum_consumed':maximum,'scan':seen});return suffix
def parity(mode,manifest):
    from PIL import Image
    b=preserve();docs=[]
    assert len(manifest['documents'])==3
    for kind,count,zcount,rec in zip(KINDS,COUNTS,ZCOUNTS,manifest['documents']):
        assert rec['pdf_sha256']==b['paragraph_files'][f'{STEM} – {kind}.pdf']
        directory=Path(rec['proof_directory']);m=read(directory/'manifest.json')
        assert m['inspection_status']=='PENDING' and m['pages_inspected']==[]
        assert m['page_sha256']==b['history'][kind]['pages'] and len(m['page_sha256'])==count
        pages=[]
        for name,value in m['page_sha256'].items():
            p=directory/'pages'/name;old=P/b['history'][kind]['directory']/'pages'/name
            assert raw(p)==raw(old)==value
            with Image.open(p) as x,Image.open(old) as y:
                assert x.size==y.size and x.convert('RGB').tobytes()==y.convert('RGB').tobytes()
                pages.append({'name':name,'sha256':value,'rgb_sha256':h(x.convert('RGB').tobytes())})
        with ZipFile(D/f'{STEM} – {kind}.zip') as archive:
            names=archive.namelist();assert len(names)==len(set(names))==zcount and archive.testzip() is None
            expected={f'{STEM} – {kind}.{ext}' for ext in ('md','html','pdf')}
            expected|={Path(r['path'].removeprefix('\\\\?\\')).relative_to(D).as_posix() for r in rec['assets']}
            assert set(names)==expected
            members=[]
            for info in archive.infolist():
                n=PurePosixPath(info.filename);assert not n.is_absolute() and '..' not in n.parts and ':' not in info.filename and '\\' not in info.filename
                assert info.date_time==(1980,1,1,0,0,0) and archive.read(info.filename)==(D/info.filename).read_bytes()
                members.append({'name':info.filename,'sha256':h(archive.read(info.filename)),'crc':info.CRC,'timestamp':info.date_time})
        docs.append({'kind':kind,'directory':directory.relative_to(P).as_posix(),'manifest_sha256':raw(directory/'manifest.json'),'pages':pages,'zip_members':members})
    figures=[]
    for name in b['native_files']:
        if not name.endswith('.png'):continue
        with Image.open(D/name) as x,Image.open(io.BytesIO(blob(LB,(REL/name).as_posix(),L))) as y:
            assert x.size==y.size and x.convert('RGB').tobytes()==y.convert('RGB').tobytes()
            figures.append({'name':name,'sha256':raw(D/name),'rgb_sha256':h(x.convert('RGB').tobytes())})
    assert len(figures)==11
    save(mode+'-parity.json',{'pass':True,'native_files':34,'folder_files':40,'page_count':27,'documents':docs,'figures':figures,'personal_inspection':'NOT_INFERRED'})
def worker(suffix,manifest):
    sys.path.insert(0,str(P/'build-scripts/content/book-2'));import b2_212 as b
    records=[]
    for kind in KINDS:
        rec=b.build_document(D/f'{STEM} – {kind}.md');rec['zip']=b.zip_document(rec)
        directory=E/'proofs'/f"212-{kind}-{rec['pdf_sha256'][:12]}-{suffix}"
        assert not directory.exists();b.render_proof(rec,directory);rec['proof_directory']=str(directory);records.append(rec)
    with manifest.open('x',encoding='utf-8',newline='\n') as f:json.dump({'inspection_status':'PENDING','documents':records},f,ensure_ascii=False,indent=2);f.write('\n')
def reproduce(mode):
    preserve();suffix=reserve(mode);manifest=E/(mode+'-manifest.json');assert not manifest.exists()
    if mode=='print':argv=[sys.executable,__file__,'print-worker','--suffix',suffix,'--manifest',manifest]
    else:argv=[sys.executable,D/'build_pdf.py' if mode=='thin' else P/GEN,'--lesson-root',L,'--proof-root',E/'proofs','--proof-suffix',suffix,'--manifest',manifest]
    command(mode+'-process',argv);parity(mode,read(manifest))
def gates():
    command('native-check-process',[sys.executable,SRC+'check_render.py',E/'native-check.json'])
    for profile in ['student-web','publisher-print']:command(profile,['node','scripts/validate-paragraph.js','--mode','part-a','--profile',profile,D])
    for action in ['paragraph_production','specialist_review']:command('currentness-'+action,['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action',action,'--paragraph','2.1.2'])
    command('durable',['node','build-scripts/workflows/check-book2-target-authority-remediation.js','--durable'])
    command('bundle',['node','build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1']);preserve()
def integrity():
    b=preserve()
    for mode in ['full','thin','print']:
        for r in read(E/(mode+'-parity.json'))['documents']:
            directory=P/r['directory'];assert raw(directory/'manifest.json')==r['manifest_sha256']
            for page in r['pages']:assert raw(directory/'pages'/page['name'])==page['sha256']
    save('final-integrity.json',{'pass':True,'imported_files':len(b['imports']),'historical212files':len(b['historical212']),
        'lesson_files_unchanged':len(b['all_lesson_files']),'native_files':34,'fresh_pending_manifests':9,'fresh_page_raw_rgb_matches':81,
        'specialist_personal_views':76,'root_personal_views':0,'root_acceptance':'PENDING','handoff':'STALE_UNCHANGED'})
if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('mode',choices=['baseline','tests','full','thin','print','print-worker','gates','integrity']);parser.add_argument('--suffix');parser.add_argument('--manifest',type=Path);args=parser.parse_args()
    if args.mode=='baseline':baseline()
    elif args.mode=='tests':command('tests',[sys.executable,'-m','unittest','discover','-s',SRC,'-p','test_*.py','-v'])
    elif args.mode in ['full','thin','print']:reproduce(args.mode)
    elif args.mode=='print-worker':worker(args.suffix,args.manifest)
    elif args.mode=='gates':gates()
    else:integrity()
