"""Own QC custody, actual command/scopes and paired index publication evidence.
Adapted from own prior234 F1 publication, not executed in a foreign worktree.
No historical log overwritten. Index tail is exactly four separate paths.
"""
import argparse, base64, hashlib, importlib.util, json, os, subprocess, sys
from pathlib import Path
P=Path(__file__).resolve().parents[2];L=P.parent/'4veco-lessen';PREFIX='BOOK2-TEXTBOOK-PRODUCTION-1-224-QC-CURRENT'
s=importlib.util.spec_from_file_location('pub224c',P/'reports/sprints'/(PREFIX+'-controller.py'));c=importlib.util.module_from_spec(s);s.loader.exec_module(c)
E=c.E;BRANCH='agent/book2-224-qc-current-20260906';TASK=PREFIX;CONTROLLER='c8d824dc58d2160b57f5c7b5b826aa67e5abeb11'
INDEXES={f'reports/github-agent-index-{r}.{e}' for r in ('platform','lessen') for e in ('json','md')}
def head(root):return c.git(root,'rev-parse','HEAD').decode().strip()
def names(root,*args):return [x.decode() for x in c.git(root,*args).split(b'\0') if x]
def environment():
    return {**os.environ,'PYTHONIOENCODING':'utf-8','PYTHONDONTWRITEBYTECODE':'1','FOURVECO_PLATFORM_ROOT':str(P),'FOURVECO_PLATFORM_SOURCE_REF':head(P),'FOURVECO_PLATFORM_SOURCE_BRANCH':BRANCH,'FOURVECO_LESSEN_ROOT':str(L),'FOURVECO_LESSEN_SOURCE_REF':head(L),'FOURVECO_LESSEN_SOURCE_BRANCH':BRANCH}
def run(label,argv,cwd=P,allowed=(0,),record=True):
    env=environment();sources=[]
    for arg in argv[1:]:
        path=Path(arg) if Path(arg).is_absolute() else cwd/arg
        if path.suffix in ('.py','.js','.cjs') and path.is_file():sources.append({'path':str(path),'raw_sha256':c.digest(path),'source_base64':base64.b64encode(c.raw(path)).decode()})
    started=c.now();r=subprocess.run(argv,cwd=cwd,env=env,capture_output=True)
    value={'label':label,'argv':argv,'cwd':str(cwd),'started':started,'finished':c.now(),'sources':sources,'environment':{k:v for k,v in env.items() if k.startswith('FOURVECO_') or k.startswith('PYTHON')},'inherited_PATH_sha256':c.sha(env.get('PATH','').encode()),'exit_code':r.returncode,'stdout_base64':base64.b64encode(r.stdout).decode(),'stderr_base64':base64.b64encode(r.stderr).decode(),'stdout':r.stdout.decode('utf8',errors='replace'),'stderr':r.stderr.decode('utf8',errors='replace')}
    if record:c.save(E/f'224-{label}-process.json',value)
    print(label+': '+str(r.returncode),flush=True)
    if r.returncode not in allowed:raise RuntimeError(label+' actual failure retained')
    return value
def custody():
    b=c.builder();baseline=c.read(E/'224-baseline.json');qc=(b.LESSON_REL/'2.2.4-quality-ref.yaml').as_posix();changed=[]
    for row in baseline['files']:
        value=c.digest(P.parent/row['repository']/row['path'])
        if value==row['raw_sha256']:continue
        assert row['repository']=='4veco-platform' and row['path'] in INDEXES or row['repository']=='4veco-lessen' and row['path']==qc,row['path']
        changed.append({**row,'current_sha256':value})
    pending=[]
    for root,base in [(P,c.PBASE),(L,c.LBASE)]:
        files=set(names(root,'diff','--name-only','-z',base))
        files.update(names(root,'ls-files','--others','--exclude-standard','-z'))
        for path in files:
            assert (root==P and (path.startswith('reports/sprints/'+PREFIX+'-') or path in INDEXES)) or (root==L and path==qc),path
        pending.append({'repository':root.name,'base':base,'head':head(root),'actual_paths':sorted(files)})
    c.guard(CONTROLLER);c.release_guard();c.native_guard()
    assert c.digest(L/b.LESSON_REL/'2.2.4-review.md')==baseline['canonical_review_sha256']
    assert not (L/b.LESSON_REL/'2.2.4-textbook-handoff.md').exists()
    return {'status':'PASS','baseline_files':len(baseline['files']),'preserved':len(baseline['files'])-len(changed),'allowed_changes':changed,'actual_strict_owned':pending,'unknown':0}
def claims(clean=False,record=True,label='claim'):
    for name,root in [('platform',P),('lessons',L)]:run(label+'-'+name,['node',str(P/'build-scripts/ci/check-agent-worktree-safety.js'),'--check','--task',TASK,'--agent',c.ACTOR,'--require-prefix','codex/,agent/',*(['--require-clean'] if clean else [])],cwd=root,record=record)
def scopes(record=True,label='scope'):
    rows=[]
    for name,root,lane,base in [('owned-platform',P,'shared',c.PBASE),('owned-lessons',L,'textbook',c.LBASE),('complete-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479'),('complete-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d')]:
        r=run(label+'-'+name,['node','build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',str(root),'--lane',lane,'--base',base,'--head',head(root),'--json'],allowed=(0,1),record=record);v=json.loads(r['stdout'])
        assert len(v['categories']['unknown'])==0
        if name.startswith('complete'):assert r['exit_code']==0,v['failures']
        rows.append({'name':name,'base':base,'head':head(root),'exit_code':r['exit_code'],'ok':v['ok'],'failures':v['failures'],'category_counts':{k:len(x) for k,x in v['categories'].items()}})
    result={'strict_owned':custody(),'native_scopes':rows}
    if record:c.save(E/f'224-{label}.json',result)
    return result
def integrity(label):
    result=custody();bindings=[];gitrows=[]
    for root in (P,L):
        n=0
        for entry in c.git(root,'ls-tree','-rz','HEAD').split(b'\0'):
            if not entry:continue
            meta,path=entry.split(b'\t',1);value=c.raw(root/path.decode())
            assert hashlib.sha1(b'blob '+str(len(value)).encode()+b'\0'+value).hexdigest()==meta.split()[-1].decode(),path
            n+=1
        gitrows.append({'repository':root.name,'head':head(root),'raw_git_blobs':n})
    for path in sorted(set(names(P,'ls-files','-z'))|set(names(P,'ls-files','--others','--exclude-standard','-z'))):
        if path.startswith('reports/sprints/'+PREFIX+'-'):bindings.append({'path':path,'raw_sha256':c.digest(P/path),'bytes':len(c.raw(P/path))})
    qc=L/c.builder().LESSON_REL/'2.2.4-quality-ref.yaml';result.update(repositories=gitrows,own_evidence=bindings,QC_raw_sha256=c.digest(qc),report_raw_sha256=c.digest(P/'reports/sprints'/(PREFIX+'-result.md')),root_acceptance='PENDING',handoff='ABSENT',production_ready=False)
    c.save(E/f'224-{label}.json',result);print(json.dumps({'status':'PASS','own_bindings':len(bindings),'QC':result['QC_raw_sha256'],'report':result['report_raw_sha256']}))
ap=argparse.ArgumentParser();ap.add_argument('action',choices=['command','command-any','stage','claims','scopes','integrity','indexes','final']);ap.add_argument('args',nargs='*');a=ap.parse_args()
if a.action in ('command','command-any'):run(a.args[0],a.args[1:],allowed=(0,1,2) if a.action=='command-any' else (0,))
elif a.action=='claims':claims()
elif a.action=='scopes':scopes(label=a.args[0] if a.args else 'scope')
elif a.action=='integrity':integrity(a.args[0])
elif a.action=='stage':
    custody();claims(record=False)
    for root in (P,L):
        pending=set(names(root,'diff','--name-only','-z'))|set(names(root,'diff','--cached','--name-only','-z'))|set(names(root,'ls-files','--others','--exclude-standard','-z'))
        pending=sorted(pending-INDEXES) if root==P else sorted(pending)
        for i in range(0,len(pending),20):c.git(root,'add','--',*pending[i:i+20])
        assert subprocess.run(['git','diff','--cached','--check'],cwd=root,capture_output=True).returncode==0
elif a.action=='indexes':
    run('indexes',['node','--require','./reports/sprints/'+PREFIX+'-index-runtime.cjs','build-scripts/reports/github-agent-index.js'],record=False)
    run('url-check',['node','build-scripts/sprints/emit-url-index.js','--check'],record=False)
    run('NUL-inventory',['node','reports/sprints/'+PREFIX+'-index-runtime.cjs','verify'],record=False)
elif a.action=='final':
    claims(clean=True,record=False,label='final-claim');run('freshness',['node','build-scripts/reports/check-agent-index-freshness.js'],record=False);run('NUL-current',['node','reports/sprints/'+PREFIX+'-index-runtime.cjs','verify'],record=False)
    pair=[]
    for root in (P,L):
        assert not c.git(root,'status','--porcelain').strip();assert c.git(root,'branch','--show-current').decode().strip()==BRANCH
        remote=c.git(root,'ls-remote','origin','refs/heads/'+BRANCH).decode().split()[0];assert head(root)==remote==c.git(root,'rev-parse','origin/'+BRANCH).decode().strip()
        pair.append({'repository':root.name,'head':head(root),'remote':remote,'clean':True})
    assert set(names(P,'diff','--name-only','-z','HEAD^..HEAD'))==INDEXES
    print(json.dumps({'status':'PASS','pair':pair,'scope':scopes(record=False,label='final-scope'),'custody':custody(),'four_index_only_tail':True,'root_acceptance':'PENDING','production_ready':False}))
