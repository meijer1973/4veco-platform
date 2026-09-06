"""Independent technical delta controller. HOW TO ADAPT: require a new work order.
Only this review prefix is writable; never execute historical evidence writers.
Native children keep the inherited PATH and normal cwd/entrypoint.
"""
from pathlib import Path
from contextlib import ExitStack
from tempfile import TemporaryDirectory
from unittest.mock import patch
from fractions import Fraction as F
import argparse, datetime, hashlib, importlib.util, json, os, re, subprocess, sys

ROOT = Path(__file__).resolve().parents[2]
LESSONS = ROOT.parent / '4veco-lessen'
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-213-S1-REVIEW'
OUT = ROOT / 'reports/sprints' / (PREFIX + '-evidence')
PROOF = OUT / 'proofs'
PBASE = 'c96f126738b5e45d0d1c74e68efc35b7bd33c5dc'
LBASE = '42996c60b4a93843dfe8488b8e5a3ea704871667'
ORIGINAL = '50db4c5da142812f47bf02219e393447caedecfb'
BRANCH = 'agent/book2-213-s1-review-20260906'
PYTHON = 'C:/Python314/python.exe'
INDEXES = {f'reports/github-agent-index-{repo}.{ext}' for repo in ('platform','lessen') for ext in ('json','md')}
AUTHOR_CONTROLLER = ROOT / 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-S1-run.py'
spec = importlib.util.spec_from_file_location('inspected_author_controller', AUTHOR_CONTROLLER)
d = importlib.util.module_from_spec(spec); spec.loader.exec_module(d)
b = d.succession.b
GEN = d.GENERATOR
FOLDER = LESSONS / b.LESSON_REL

def sha(raw): return hashlib.sha256(raw).hexdigest()
def raw(path): return Path(path).read_bytes()
def lf(value): return value.decode('utf-8-sig').replace('\r\n','\n').replace('\r','\n').encode()
def git(root,*args): return subprocess.check_output(['git',*args],cwd=root)
def blob(root,ref,name): return git(root,'show',ref+':'+name)
def save(name,value):
    OUT.mkdir(exist_ok=True)
    with (OUT/name).open('x',encoding='utf-8',newline='\n') as stream:
        stream.write(json.dumps(value,ensure_ascii=False,indent=2)+'\n')

def command(argv,name,cwd=ROOT,allow_failure=False,env=None):
    before=datetime.datetime.now(datetime.timezone.utc).isoformat()
    run=subprocess.run(list(map(str,argv)),cwd=cwd,capture_output=True,env=env)
    value=dict(argv=list(map(str,argv)),cwd=str(cwd),started_at=before,
        finished_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),exit_code=run.returncode,
        stdout=run.stdout.decode('utf-8',errors='replace'),stderr=run.stderr.decode('utf-8',errors='replace'),
        stdout_sha256=sha(run.stdout),stderr_sha256=sha(run.stderr),
        inherited_path_sha256=sha(os.environ.get('PATH','').encode()),environment_overrides=None if env is None else {k:v for k,v in env.items() if os.environ.get(k)!=v})
    save(name,value); print(name,run.returncode,flush=True)
    if run.returncode and not allow_failure: raise RuntimeError('Failed command retained: '+name)
    return value

def source_contract():
    # Independently supplied full-byte substitutions, not expected values read from live source.
    pairs=[
      ('724a080619f2f072151edf20980071b3bef18cd60d1904c78f4aa906be8917c8','0d14506e314a11fef0637cc66cf29036f174b94cafbf7fa5ede2eff88937500f'),
      ('de2b8ed7dcc7a3c5c6eaac400892d2d37ac5212ccb3b9972fb004115a88c1fe2','4da6e5b4f0a70273d78c067f34484c8a5f6faf164b0f09c1559b9a73ff6611fe'),
      ('74ad2ed9c44d9aa05b6d6a680d5d273f2cad4b62e4bead5db303c006514238cd','79429b9f1750710baae46751a5792e4a02e7c177888a01f5ca3a15c4039a78f7'),
      ('e168e3c2b8698d12b699fbf60e7691fbbc8a15d61bd46a7988704d3c896c805c','73bd2a2447b38c9d95cbc3bd69b8037e0f46b7564655b4513009fd6707b7b07d'),
      ('f53521ed8812a4c8b8c33c1d66b34e0afe8425c1dffb1723f37771372b2baa09','9350d60fadee3494124f7b0593bc1efcf00db5ea292d0a19fc3f10518e11d1f8')]
    original=blob(ROOT,ORIGINAL,GEN)
    assert sha(original)=='6a45771783de221c3d65b32d423c1f7e90c90e84a79d30c4e175bba8836b056a'
    expected=original
    for old,new in pairs:
        assert expected.count(old.encode())==1 and new.encode() not in expected
        expected=expected.replace(old.encode(),new.encode())
    assert raw(ROOT/GEN)==expected==blob(ROOT,PBASE,GEN)
    assert sha(expected)=='87ce47b88520abbde45c18114816dae7630e31453c48e0c505c87b7e9b031ce4'
    preserved={}
    for name in d.succession.PRESERVED:
        assert lf(raw(ROOT/name))==blob(ROOT,ORIGINAL,name)
        preserved[name]=sha(raw(ROOT/name))
    d.verify_controller('8fd54c00665f02c96806a85d453f0bd69cdd8394')
    return dict(original_sha256=sha(original),candidate_sha256=sha(expected),five_once_only_literals=pairs,preserved=preserved)

def inventory(root,ref):
    rows={}
    for name in git(root,'ls-tree','-rz','--full-tree',ref).split(b'\0'):
        if not name: continue
        meta,path=name.split(b'\t',1); path=path.decode('utf-8'); data=raw(root/path)
        oid=meta.decode().split()[-1]
        obj=lambda v:hashlib.sha1(b'blob '+str(len(v)).encode()+b'\0'+v).hexdigest()
        assert obj(data)==oid or obj(lf(data))==oid,('Git/raw mismatch',path)
        rows[path]=dict(raw_sha256=sha(data),git_blob=oid)
    return rows

def snapshot():
    assert git(ROOT,'branch','--show-current').decode().strip()==BRANCH
    assert git(LESSONS,'branch','--show-current').decode().strip()==BRANCH
    assert git(LESSONS,'rev-parse','HEAD').decode().strip()==LBASE
    assert not git(LESSONS,'status','--porcelain')
    reviewed=json.loads(raw(ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-r7-review-evidence/rebuild.json'))
    assert d.native()==reviewed['artifacts']
    author=json.loads(raw(ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-S1-evidence/baseline.json'))
    assert os.environ.get('PATH','')==author['inherited_path'],'Original inherited PATH mismatch'
    rows=[]
    for relative,expected,mode in d.succession.actual_inputs()[1]:
        data=raw(LESSONS/relative)
        assert sha(lf(data) if mode=='lf' else data)==expected
        assert lf(data)==blob(LESSONS,LBASE,relative.as_posix())
        rows.append(dict(path=relative.as_posix(),raw_sha256=sha(data),lf_sha256=sha(lf(data)),mode=mode))
    assert len(rows)==7 and not (FOLDER/'2.1.3-textbook-handoff.md').exists()
    assert sha(raw(FOLDER/'2.1.3-review.md'))=='5064642034fac9763202d2424b87cef2f7cc909aaf3a6031b90d247ee44409c3'
    assert sha(raw(FOLDER/'2.1.3-quality-ref.yaml'))=='c96a4af45cfbf6c43ceda27ecf6dd231c75667ece58b378b9080975fe4be717f'
    save('baseline.json',dict(platform=PBASE,lessons=LBASE,source_contract=source_contract(),
        inherited={'platform':inventory(ROOT,PBASE),'lessons':inventory(LESSONS,LBASE)},
        native=d.native(),archives=d.archives(),inputs=rows,inherited_path=os.environ.get('PATH',''),
        interpreter=PYTHON,canonical_review_unchanged=True,stale_qc_unchanged=True,handoff_absent=True))
    print('Exact baseline and five-literal derivation saved',flush=True)

def check(indexes=False):
    data=json.loads(raw(OUT/'baseline.json'))
    source_contract()
    assert os.environ.get('PATH','')==data['inherited_path']
    for key,root in [('platform',ROOT),('lessons',LESSONS)]:
        for name,record in data['inherited'][key].items():
            if indexes and key=='platform' and name in INDEXES: continue
            assert sha(raw(root/name))==record['raw_sha256'],('Original raw drift',key,name)
    assert d.native()==data['native'] and d.archives()==data['archives']
    assert not (FOLDER/'2.1.3-textbook-handoff.md').exists()
    assert not git(LESSONS,'status','--porcelain')
    return data

def probes():
    check(); cases=[]; _,inputs=d.succession.actual_inputs()
    class PositiveGate(Exception): pass
    def filemap(root): return {p.relative_to(root).as_posix():sha(raw(p)) for p in root.rglob('*') if p.is_file()}
    scenarios=[(str(i)+'-'+fault,[(i,fault)]) for i in range(7) for fault in ('missing','forged')]
    scenarios += [('all-seven-forged',[(i,'forged') for i in range(7)]),('accepted211-missing-and212-forged',[(2,'missing'),(3,'forged')]),('valid-gate',[])]
    for name,faults in scenarios:
        with TemporaryDirectory(prefix='b213-review-input-') as tmp:
            root=Path(tmp); (root/b.LESSON_REL).mkdir(parents=True)
            for relative,_,_ in inputs:
                path=root/relative; path.parent.mkdir(parents=True,exist_ok=True); path.write_bytes(raw(LESSONS/relative))
            faultrows=[]
            for i,fault in faults:
                path=root/inputs[i][0]
                if fault=='missing': path.unlink()
                else: path.write_bytes(raw(path)+b'\nIndependent forged acceptance, not owner evidence.\n')
                faultrows.append(dict(path=inputs[i][0].as_posix(),fault=fault,mutant_sha256=sha(raw(path)) if path.exists() else None))
            before=filemap(root)
            with ExitStack() as stack:
                calls=stack.enter_context(patch.object(b.subprocess,'run',side_effect=PositiveGate))
                effects=[stack.enter_context(patch.object(Path,m,side_effect=AssertionError('Premature output write'))) for m in ('mkdir','write_bytes','write_text')]
                try: b.build(root)
                except (FileNotFoundError,ValueError,PositiveGate) as error:
                    exception=type(error).__name__
                    assert bool(faults)==(not isinstance(error,PositiveGate))
                    if faults:
                        first_index,first_fault=min(faults)
                        assert isinstance(error,FileNotFoundError if first_fault=='missing' else ValueError)
                        if first_fault=='forged':
                            assert ('Required accepted source differs' if first_index<6 else 'Accepted §212 paragraph source changed') in str(error)
                else: raise AssertionError('Invalid successful native claim')
                assert calls.call_count==(0 if faults else 1)
                if not faults: assert calls.call_args.args[0][1]=='build-scripts/workflows/check-book-outline-currentness.js'
                assert all(e.call_count==0 for e in effects)
            assert filemap(root)==before
            cases.append(dict(name=name,faults=faultrows,exception=exception,process_calls=0 if faults else 1,output_calls=0,fixture_files_unchanged=True,actual_successful_build=False))
    # Exercise the actual controller with misleading combinations of actual file-read bytes.
    actual_read=Path.read_bytes; candidate=actual_read(ROOT/GEN); mutants=[]
    def reject(name,changes):
        def altered(path): return changes.get(path.resolve(),actual_read(path))
        with patch.object(Path,'read_bytes',altered):
            try: d.verify_controller('8fd54c00665f02c96806a85d453f0bd69cdd8394')
            except AssertionError as e: reason=str(e)
            else: raise AssertionError('Controller accepted '+name)
        mutants.append(dict(name=name,changes={str(p.relative_to(ROOT)):sha(v) for p,v in changes.items()},rejection=reason,semantics='injected full read bytes, not file writes or native success'))
    reject('unrelated-generator-comment',{(ROOT/GEN).resolve():candidate+b'\n# unrelated\n'})
    reject('early-return-source-bypass',{(ROOT/GEN).resolve():candidate.replace(b'    pins = prerequisite_pins(destination)',b'    return {}\n    pins = prerequisite_pins(destination)')})
    for i,(old,new) in enumerate(source_contract()['five_once_only_literals']):
        reject('stale-pin-'+str(i),{(ROOT/GEN).resolve():candidate.replace(new.encode(),old.encode())})
        reject('forged-pin-'+str(i),{(ROOT/GEN).resolve():candidate.replace(new.encode(),sha(b'forged incoming'+str(i).encode()).encode())})
    combined=candidate
    for i,(_,new) in enumerate(source_contract()['five_once_only_literals']):
        combined=combined.replace(new.encode(),sha(b'synchronized forged file'+str(i).encode()).encode())
    reject('all-five-synchronized-pins',{(ROOT/GEN).resolve():combined})
    for name in d.succession.PRESERVED:
        reject('preserved-'+name,{(ROOT/name).resolve():actual_read(ROOT/name)+b'\n# independent drift\n'})
    reject('controller-and-guard-combined',{AUTHOR_CONTROLLER.resolve():actual_read(AUTHOR_CONTROLLER).replace(b'assert current == expected',b'assert True or current == expected'),(ROOT/d.TEST).resolve():actual_read(ROOT/d.TEST)+b'\n# drift\n'})
    reject('guard-and-generator-combined',{(ROOT/d.TEST).resolve():actual_read(ROOT/d.TEST)+b'\n# drift\n',(ROOT/GEN).resolve():candidate+b'\n# drift\n'})
    # Independent arithmetic uses supplied table literals, not interval_values().
    math=[]
    for name,q,tk,to in [('holders',[0,10,20],[20,50,100],[0,80,160]),('lus',[0,2,4,6],[12,16,20,24],[0,12,24,36]),('bout',[0,2,4,6],[8,12,24,44],[0,24,48,72]),('bottles',[0,2,4],[8,12,20],[0,12,24]),('patches',[0,3,6],[9,15,21],[0,15,30]),('coasters',[0,2,6],[10,14,38],[0,16,48]),('draad',[0,4,8,12],[20,24,28,32],[0,20,40,60]),('kaft',[0,4,8,12],[12,28,76,156],[0,96,192,288]),('linea',[0,10,20,30],[200,230,260,290],[0,80,160,240]),('curva',[0,5,10,15],[100,125,200,325],[0,150,300,450])]:
        profit=[r-c for r,c in zip(to,tk)]; mk=[F(tk[i]-tk[i-1],q[i]-q[i-1]) for i in range(1,len(q))]; mo=[F(to[i]-to[i-1],q[i]-q[i-1]) for i in range(1,len(q))]
        growth=[F(profit[i]-profit[i-1],q[i]-q[i-1]) for i in range(1,len(q))]
        assert growth==[r-c for r,c in zip(mo,mk)]
        math.append(dict(context=name,Q=q,TK=tk,TO=to,profit=profit,MK=list(map(str,mk)),MO=list(map(str,mo)),profit_growth_per_extra=list(map(str,growth))))
    save('independent-probes.json',dict(result='PASS',source=source_contract(),real_input_cases=cases,controller_mutations=mutants,math=math,
        bonus=dict(K=['12/4=3','24/8=3'],L=['20/4=5','16/8=2'],fifth_unit_counterexample='TK5=33 or39 gives1 or7 while TK4=32 and TK12=56; interval average cannot identify single increment'),timing='54/66/78 UNOBSERVED',no_acceptance=True))
    check(); print('Independent cases',len(cases),'controller negatives',len(mutants),'PASS',flush=True)

def reserve():
    # Reviewed author's scanner only calls save at the end; redirect that writer
    # in memory to this exclusive reviewer namespace, never a historical path.
    with patch.object(d,'save',save): return d.reserve()

def build(mode):
    check(); revision=reserve(); manifest=OUT/f'{mode}-{revision}-build.json'
    if mode=='print': argv=[PYTHON,__file__,'print-worker','--revision',revision,'--manifest',manifest]
    else:
        argv=[PYTHON,ROOT/GEN if mode=='full' else FOLDER/'build_pdf.py','--proof-root',PROOF,'--proof-suffix',revision,'--manifest',manifest]
        if mode=='full': argv+=['--lesson-root',LESSONS]
    command(argv,f'{mode}-{revision}-command.json')
    result=json.loads(raw(manifest)); assert result['inspection_status']=='PENDING'
    check(); pages=d.compare_pages(result)
    save(f'{mode}-{revision}-reproduction.json',dict(result='PASS',mode=mode,revision=revision,native=d.native(),archives=d.archives(),pages=pages,build_manifest_sha256=sha(raw(manifest)),all_prior_raw_unchanged=True,full_personal_inspection=False))
    print(mode,revision,'PASS24 native/30 raw RGB',flush=True)

def print_worker(revision,manifest):
    check(); assert (OUT/f'reservation-{revision}.json').exists(); records=[]
    for path,expected in b.prerequisite_pins(FOLDER): assert b.lf_hash(path)==expected
    for kind in d.KINDS:
        record=b.build_document(FOLDER/f'{b.STEM} – {kind}.md'); record['zip']=b.zip_document(record)
        directory=PROOF/f"213-{kind}-{record['pdf_sha256'][:12]}-{revision}"
        b.render_proof(record,directory); record['proof_directory']=str(directory); records.append(record)
    with Path(manifest).open('x',encoding='utf-8',newline='\n') as stream: stream.write(json.dumps(dict(inspection_status='PENDING',documents=records),ensure_ascii=False,indent=2)+'\n')

def validate(label):
    check()
    jobs=[('tests',[PYTHON,'-m','unittest','discover','-s',ROOT/'build-scripts/content/book-2/213','-p','test_*.py','-v']),
      ('native-checker',[PYTHON,ROOT/'build-scripts/content/book-2/213/check_render.py']),
      *[(p,['node','scripts/validate-paragraph.js','--mode','part-a','--profile',p,FOLDER]) for p in ['student-web','publisher-print']],
      ('currentness',['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.1.3']),
      ('durable',['node','build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']),
      ('bundle',['node','build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1'])]
    for name,argv in jobs: command(argv,label+'-'+name+'.json')
    data=check(); save(label+'-binding.json',dict(result='PASS',native=d.native(),source=source_contract(),inherited_counts={k:len(v) for k,v in data['inherited'].items()},review_unchanged=True,stale_qc_unchanged=True,handoff_absent=True))

if __name__=='__main__':
    p=argparse.ArgumentParser(); p.add_argument('mode'); p.add_argument('--revision'); p.add_argument('--manifest'); p.add_argument('--label',default='final'); a=p.parse_args()
    if a.mode=='snapshot': snapshot()
    elif a.mode=='check': check(indexes=True); print('Whole original custody PASS')
    elif a.mode=='probes': probes()
    elif a.mode=='validate': validate(a.label)
    elif a.mode=='print-worker': print_worker(a.revision,a.manifest)
    else: build(a.mode)
