"""Released independent specialist execution; source and prior evidence immutable.
HOW TO ADAPT: obtain a new exact release. Reuses personally inspected distinct
review source predicates and real probes, with only their writer/check redirected
in memory to this owned evidence namespace. No historical script is patched.
"""
from pathlib import Path
from unittest.mock import patch
import argparse, datetime, hashlib, importlib.util, json, os, subprocess, sys

ROOT=Path(__file__).resolve().parents[2]
LESSONS=ROOT.parent/'4veco-lessen'
PREFIX='BOOK2-TEXTBOOK-PRODUCTION-1-213-QC-CURRENT'
OUT=ROOT/'reports/sprints'/f'{PREFIX}-evidence'
PROOF=OUT/'proofs'
PYTHON='C:/Python314/python.exe'
BRANCH='agent/book2-213-qc-current-20260906'
INDEXES={f'reports/github-agent-index-{r}.{e}' for r in ('platform','lessen') for e in ('json','md')}
def raw(p): return Path(p).read_bytes()
def sha(v): return hashlib.sha256(v).hexdigest()
def load(p): return json.loads(raw(p))
def git(root,*args): return subprocess.check_output(['git',*map(str,args)],cwd=root)
def save(name,value):
    OUT.mkdir(exist_ok=True)
    with (OUT/name).open('x',encoding='utf-8',newline='\n') as f: f.write(json.dumps(value,ensure_ascii=False,indent=2)+'\n')

REVIEW=ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-S1-REVIEW-check.py'
assert raw(REVIEW)==git(ROOT,'show','85e373b13e87442728def73946a9eab30577735a:'+REVIEW.relative_to(ROOT).as_posix())
assert sha(raw(ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-S1-REVIEW-result.md'))=='a2a03966e3d5b8de9dced4a178a0632dfe1b162867b9444db228140796d7c689'
spec=importlib.util.spec_from_file_location('reviewed_s1',REVIEW)
v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v)
d=v.d;b=v.b;FOLDER=v.FOLDER
QC=b.LESSON_REL/'2.1.3-quality-ref.yaml'

def command(argv,name,cwd=ROOT,allowed=(0,)):
    start=datetime.datetime.now(datetime.timezone.utc).isoformat()
    env={**os.environ,'PYTHONIOENCODING':'utf-8','PYTHONDONTWRITEBYTECODE':'1'}
    r=subprocess.run(list(map(str,argv)),cwd=cwd,capture_output=True,env=env)
    result=dict(argv=list(map(str,argv)),cwd=str(cwd),started_at=start,finished_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),exit_code=r.returncode,
      stdout=r.stdout.decode('utf-8'),stderr=r.stderr.decode('utf-8'),stdout_sha256=sha(r.stdout),stderr_sha256=sha(r.stderr),
      inherited_path_sha256=sha(os.environ.get('PATH','').encode()),child_overrides={'PYTHONIOENCODING':'utf-8','PYTHONDONTWRITEBYTECODE':'1'})
    save(name,result);print(name,r.returncode,flush=True)
    assert r.returncode in allowed,('Actual failure preserved',name)
    return result

def custody(qc=False,indexes=False):
    v.source_contract()
    baseline=load(ROOT/'reports/sprints'/f'{PREFIX}-preimport-custody.json')
    preparation=load(ROOT/'reports/sprints'/f'{PREFIX}-baseline.json')
    assert os.environ.get('PATH','')==preparation['inherited_path'],'Original inherited PATH changed'
    total=0
    for repo in baseline['repositories']:
        root=Path(repo['root'])
        assert git(root,'branch','--show-current').decode().strip()==BRANCH
        for row in repo['rows']:
            if indexes and root==ROOT and row['path'] in INDEXES: continue
            if qc and root==LESSONS and row['path']==QC.as_posix(): continue
            assert sha(raw(root/row['path']))==row['raw_sha256'],('Prior raw drift',row['path'])
            total+=1
    incoming=load(ROOT/'reports/sprints'/f'{PREFIX}-import-mapping.json')
    for row in incoming['incoming']: assert sha(raw(ROOT/row['path']))==row['raw_sha256'],row['path']
    assert d.native()==load(ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-r7-review-evidence/rebuild.json')['artifacts']
    d.archives()
    assert not (FOLDER/'2.1.3-textbook-handoff.md').exists()
    for row in preparation['instructions']:
        root=ROOT if row['repository'] in ('4veco-platform','platform') else LESSONS
        assert sha(raw(root/row['path']))==row['raw_sha256'],('Instruction drift',row['path'])
    return dict(prior_raw_files=total,exact_imported_files=len(incoming['incoming']),native_files=24,canonical_QC_exception=qc,index_exception=indexes)

def inputs():
    rows=[]
    for relative,expected,mode in d.succession.actual_inputs()[1]:
        data=raw(LESSONS/relative)
        assert sha(v.lf(data) if mode=='lf' else data)==expected
        rows.append(dict(path=relative.as_posix(),mode=mode,expected=expected,raw_sha256=sha(data)))
    assert len(rows)==7
    return rows

def snapshot():
    evidence={'result':'RELEASED_EXECUTION_BASELINE','custody':custody(),'inputs':inputs(),'native':d.native(),'archives':d.archives(),
      'root_payload':'f63c00bbda0ee96e956c15deb00b2e59f84dff25','root_scope':'59a8e78fa4eebf7d74d9cdf07259c7686855f1bd',
      'root_terminal':'2f643a3d45a70a37648c3f22b551e3865e032d19','root_lessons':'9f9729a9b4a55805d9e24bf53f712f1b02f6e00a',
      'review_imports':load(ROOT/'reports/sprints'/f'{PREFIX}-import-mapping.json')['mappings'],
      'native_PDF_generation':0,'personal_views':0,'root_acceptance':'PENDING','production_ready':False}
    old=raw(LESSONS/QC);assert sha(old)=='c96a4af45cfbf6c43ceda27ecf6dd231c75667ece58b378b9080975fe4be717f'
    OUT.mkdir(exist_ok=True)
    with (OUT/'legacy-quality-ref-original.yaml').open('xb') as f:f.write(old)
    evidence['legacy_qc_raw_sha256']=sha(old)
    save('execution-baseline.json',evidence);print(evidence['custody'],flush=True)

def probes():
    custody();inputs()
    with patch.object(v,'check',custody),patch.object(v,'save',save):v.probes()
    command([PYTHON,ROOT/'reports/sprints'/f'{PREFIX}-math-preparation.py'],'actual-math-rerun.json')
    custody()

def reserve():
    custody()
    with patch.object(d,'save',save): revision=d.reserve()
    assert int(revision[1:])>33
    print('NEXT_RESERVED='+revision,flush=True)

def build(mode,revision):
    custody();inputs()
    reservation=OUT/f'reservation-{revision}.json'
    assert reservation.is_file() and int(revision[1:])>33
    assert load(reservation)['revision']==revision
    manifest=OUT/f'{mode}-{revision}-build.json'
    assert not manifest.exists()
    save(f'{mode}-{revision}-started.json',dict(mode=mode,revision=revision,started_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),reservation_sha256=sha(raw(reservation))))
    if mode=='print':argv=[PYTHON,__file__,'print-worker','--revision',revision,'--manifest',manifest]
    else:
        argv=[PYTHON,ROOT/d.GENERATOR if mode=='full' else FOLDER/'build_pdf.py','--proof-root',PROOF,'--proof-suffix',revision,'--manifest',manifest]
        if mode=='full':argv+=['--lesson-root',LESSONS]
    command(argv,f'{mode}-{revision}-command.json')
    result=load(manifest);assert result['inspection_status']=='PENDING'
    c=custody();pages=d.compare_pages(result)
    save(f'{mode}-{revision}-reproduction.json',dict(result='PASS',mode=mode,revision=revision,native=d.native(),archives=d.archives(),pages=pages,
      build_manifest_sha256=sha(raw(manifest)),custody=c,personal_inspection_claimed=False))
    print(mode,revision,'PASS24 native/ZIP15,7,3/30 raw and RGB pages',flush=True)

def print_worker(revision,manifest):
    custody();rows=inputs();assert (OUT/f'reservation-{revision}.json').is_file();assert not Path(manifest).exists()
    for name,argv in [('currentness',['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.1.3']),
      ('durable',['node','build-scripts/workflows/check-book2-target-authority-remediation.js','--durable'])]:command(argv,f'print-{revision}-prewrite-{name}.json')
    records=[]
    for kind in d.KINDS:
        record=b.build_document(FOLDER/f'{b.STEM} – {kind}.md');record['zip']=b.zip_document(record)
        directory=PROOF/f"213-{kind}-{record['pdf_sha256'][:12]}-{revision}"
        b.render_proof(record,directory);record['proof_directory']=str(directory);records.append(record)
    with Path(manifest).open('x',encoding='utf-8',newline='\n') as f:f.write(json.dumps(dict(inspection_status='PENDING',inputs=rows,documents=records),ensure_ascii=False,indent=2)+'\n')

def validate(label,qc=False):
    custody(qc);inputs()
    jobs=[('tests',[PYTHON,'-m','unittest','discover','-s',ROOT/'build-scripts/content/book-2/213','-p','test_*.py','-v']),
      ('native-checker',[PYTHON,ROOT/'build-scripts/content/book-2/213/check_render.py',OUT/f'{label}-native-result.json']),
      *[(p,['node','scripts/validate-paragraph.js','--mode','part-a','--profile',p,FOLDER]) for p in ('student-web','publisher-print')],
      ('currentness',['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.1.3']),
      ('durable',['node','build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']),
      ('bundle',['node','build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1'])]
    for name,argv in jobs:command(argv,f'{label}-{name}.json')
    save(f'{label}-binding.json',dict(result='PASS',custody=custody(qc),inputs=inputs(),native=d.native(),root_acceptance='PENDING',production_ready=False))

def grayscale(revision):
    from PIL import Image
    custody(); rows=[]
    for kind,hash12,count in [('paragraaf','534177c8280e',14),('opgaven','d12487671bd2',9),('antwoorden','d96f21c3abed',7)]:
        for n in range(1,count+1):
            rows.append((PROOF/f'213-{kind}-{hash12}-{revision}/pages/page-{n:03d}.png',f'gray/{kind}-{n:03d}.png','full_page',kind,n))
    rows += [(FOLDER/'_assets'/f'{name}.png',f'gray/asset-{name}.png','native_figure',name,None) for name in d.ASSETS]
    result=[]
    for source,target,role,kind,n in rows:
        target=OUT/target;target.parent.mkdir(exist_ok=True);assert not target.exists()
        with Image.open(source) as im:
            gray=im.convert('L');gray.save(target);dimensions=list(im.size)
        result.append(dict(role=role,kind=kind,page=n,color_path=source.relative_to(ROOT).as_posix() if source.is_relative_to(ROOT) else str(source),
          color_sha256=sha(raw(source)),gray_path=target.relative_to(ROOT).as_posix(),gray_sha256=sha(raw(target)),dimensions=dimensions,personally_viewed=False))
    assert len(result)==36
    save('inspection-view-inventory.json',dict(revision=revision,entries=result,required_personal_views=72,personal_views_recorded=0))
    custody();print('36 exact color/gray pairs prepared; ZERO personal views claimed',flush=True)

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('mode');p.add_argument('--revision');p.add_argument('--manifest');p.add_argument('--label',default='current');p.add_argument('--qc',action='store_true');a=p.parse_args()
    if a.mode=='snapshot':snapshot()
    elif a.mode=='probes':probes()
    elif a.mode=='reserve':reserve()
    elif a.mode=='print-worker':print_worker(a.revision,a.manifest)
    elif a.mode=='validate':validate(a.label,a.qc)
    elif a.mode=='grayscale':grayscale(a.revision)
    elif a.mode=='check':print(custody(a.qc,True))
    elif a.mode in ('full','thin','print'):build(a.mode,a.revision)
    else:raise ValueError('Unknown bounded execution mode')
