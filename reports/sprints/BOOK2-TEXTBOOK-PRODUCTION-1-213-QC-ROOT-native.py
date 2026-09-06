"""Root-only reproduction of the fully published current specialist subject.
HOW TO ADAPT: obtain a new committed order and own exact custody baseline.
Reuses unchanged, personally read S1 source/ZIP/scanner/pixel predicates. Only
the probe custody callback and exclusive evidence writer are rebound in memory;
the historical controllers and their original predicates remain unchanged.
"""
from pathlib import Path
from unittest.mock import patch
import argparse, datetime, hashlib, importlib.util, json, os, subprocess

ROOT=Path(__file__).resolve().parents[2]
LESSONS=ROOT.parent/'4veco-lessen'
PREFIX='BOOK2-TEXTBOOK-PRODUCTION-1-213-QC-ROOT'
HERE=ROOT/'reports/sprints'
OUT=HERE/(PREFIX+'-evidence')
PROOF=OUT/'proofs'
PYTHON='C:/Python314/python.exe'
REVIEW=HERE/'BOOK2-TEXTBOOK-PRODUCTION-1-213-S1-REVIEW-check.py'
raw=lambda p:Path(p).read_bytes()
sha=lambda b:hashlib.sha256(b).hexdigest()
load=lambda p:json.loads(raw(p))
assert raw(REVIEW)==subprocess.check_output(['git','show','85e373b13e87442728def73946a9eab30577735a:'+REVIEW.relative_to(ROOT).as_posix()],cwd=ROOT)
spec=importlib.util.spec_from_file_location('unchanged_distinct_s1',REVIEW)
v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v)
d=v.d;b=v.b;FOLDER=v.FOLDER
EXPECTED=load(HERE/'BOOK2-TEXTBOOK-PRODUCTION-1-213-QC-CURRENT-evidence/execution-baseline.json')

def save(name,value):
    OUT.mkdir(exist_ok=True)
    with (OUT/name).open('x',encoding='utf-8',newline='\n') as f:
        f.write(json.dumps(value,ensure_ascii=False,indent=2)+'\n')

def command(argv,name,cwd=ROOT):
    start=datetime.datetime.now(datetime.timezone.utc).isoformat()
    r=subprocess.run(list(map(str,argv)),cwd=cwd,capture_output=True,env={**os.environ,'PYTHONIOENCODING':'utf-8','PYTHONDONTWRITEBYTECODE':'1'})
    save(name,dict(argv=list(map(str,argv)),cwd=str(cwd),started_at=start,finished_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),exit_code=r.returncode,
      stdout=r.stdout.decode('utf-8'),stderr=r.stderr.decode('utf-8'),stdout_sha256=sha(r.stdout),stderr_sha256=sha(r.stderr),inherited_PATH_sha256=sha(os.environ.get('PATH','').encode())))
    print(name,r.returncode,flush=True)
    assert r.returncode==0,('Actual failure retained',name)
    return r

def inputs():
    rows=[]
    for rel,expected,mode in d.succession.actual_inputs()[1]:
        data=raw(LESSONS/rel)
        assert sha(v.lf(data) if mode=='lf' else data)==expected
        rows.append(dict(path=rel.as_posix(),mode=mode,expected=expected,raw_sha256=sha(data)))
    assert len(rows)==7 and rows==EXPECTED['inputs']
    return rows

def custody():
    v.source_contract()
    original=load(HERE/'BOOK2-TEXTBOOK-PRODUCTION-1-213-QC-CURRENT-baseline.json')['inherited_path']
    assert os.environ.get('PATH','')==original,'Original inherited PATH changed'
    proof=subprocess.check_output(['node',str(HERE/(PREFIX+'-check.cjs')),'custody'],cwd=ROOT)
    result=json.loads(proof)
    inputs();assert d.native()==EXPECTED['native'] and d.archives()==EXPECTED['archives']
    return result

def probes():
    before=custody()
    with patch.object(v,'check',custody),patch.object(v,'save',save):v.probes()
    command([PYTHON,HERE/'BOOK2-TEXTBOOK-PRODUCTION-1-213-QC-CURRENT-math-preparation.py'],'math-rerun.json')
    assert custody()==before
    save('source-input-binding.json',dict(result='PASS',source=v.source_contract(),inputs=inputs(),native=d.native(),archives=d.archives(),custody=before,
      attribution='Root actual execution of unchanged distinct S1 implementation; only check/writer rebound',root_personal_views=0))

def reserve():
    custody()
    with patch.object(d,'save',save):revision=d.reserve()
    assert int(revision[1:])>36
    print('NEXT_RESERVED='+revision,flush=True)

def build(mode,revision):
    before=custody();reservation=OUT/('reservation-'+revision+'.json')
    assert int(revision[1:])>36 and load(reservation)['revision']==revision
    manifest=OUT/f'{mode}-{revision}-build.json'
    assert not manifest.exists()
    save(f'{mode}-{revision}-started.json',dict(mode=mode,revision=revision,reservation_sha256=sha(raw(reservation)),started_at=datetime.datetime.now(datetime.timezone.utc).isoformat()))
    if mode=='print':argv=[PYTHON,__file__,'print-worker','--revision',revision,'--manifest',manifest]
    else:
        argv=[PYTHON,ROOT/d.GENERATOR if mode=='full' else FOLDER/'build_pdf.py','--proof-root',PROOF,'--proof-suffix',revision,'--manifest',manifest]
        if mode=='full':argv+=['--lesson-root',LESSONS]
    command(argv,f'{mode}-{revision}-command.json')
    result=load(manifest);assert result['inspection_status']=='PENDING'
    assert custody()==before
    pages=d.compare_pages(result)
    save(f'{mode}-{revision}-reproduction.json',dict(result='PASS',mode=mode,revision=revision,build_manifest_sha256=sha(raw(manifest)),native=d.native(),archives=d.archives(),pages=pages,
      custody=before,root_personal_views=0,root_acceptance='PENDING',source_unchanged=True))
    print(mode,revision,'PASS 24native/ZIP15,7,3/30raw and RGB pages',flush=True)

def print_worker(revision,manifest):
    custody();rows=inputs();assert load(OUT/('reservation-'+revision+'.json'))['revision']==revision;assert not Path(manifest).exists()
    for name,argv in [('currentness',['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.1.3']),
      ('durable',['node','build-scripts/workflows/check-book2-target-authority-remediation.js','--durable'])]:command(argv,f'print-{revision}-prewrite-{name}.json')
    records=[]
    for kind in d.KINDS:
        record=b.build_document(FOLDER/f'{b.STEM} – {kind}.md');record['zip']=b.zip_document(record)
        directory=PROOF/f"213-{kind}-{record['pdf_sha256'][:12]}-{revision}"
        b.render_proof(record,directory);record['proof_directory']=str(directory);records.append(record)
    with Path(manifest).open('x',encoding='utf-8',newline='\n') as f:
        f.write(json.dumps(dict(inspection_status='PENDING',inputs=rows,documents=records),ensure_ascii=False,indent=2)+'\n')

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('mode');parser.add_argument('--revision');parser.add_argument('--manifest');args=parser.parse_args()
    if args.mode=='probes':probes()
    elif args.mode=='reserve':reserve()
    elif args.mode=='print-worker':print_worker(args.revision,args.manifest)
    elif args.mode in ('full','thin','print'):build(args.mode,args.revision)
    else:raise ValueError('Only probes/reserve/full/thin/print/print-worker')
