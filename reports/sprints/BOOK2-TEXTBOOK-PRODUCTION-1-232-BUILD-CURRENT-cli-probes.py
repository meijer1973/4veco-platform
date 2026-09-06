"""Task-local actual thin CLI probes with physical immutable input copies.
No live lesson input or native output is modified; no mocked gate predicate.
"""
from pathlib import Path
import json
import os
import subprocess
import sys
sys.path.insert(0,str(Path(__file__).resolve().parents[2]/'build-scripts/content/book-2/232'))
from test_inputs import InputTests
import b2_232 as b

P=b.ROOT;N=b.gate.PREFIX
output=P/'reports/sprints'/(N+(sys.argv[1] if len(sys.argv)>1 else 'cli-probes')+'.json')
if output.parent!=P/'reports/sprints' or not output.name.startswith(N):raise ValueError('Own evidence path only')
if output.exists():raise ValueError('Fresh CLI evidence only')
InputTests.setUpClass();T=InputTests
wrapper=T.l/b.LESSON_REL/'build_pdf.py';wrapper.write_text(b.wrapper(),encoding='utf-8',newline='\n')
rows=[]
def run(label,entry='thin',required=''):
    args=[sys.executable,str(wrapper)] if entry=='thin' else [sys.executable,str(T.p/'build-scripts/content/book-2/b2_232.py'),'--lesson-root',str(T.l)]
    args+=['--source-commit',T.source_commit,'--revision','r999999','--reservation',str(T.p/'never-authorized.json')]
    if entry=='direct':args+=['--route','direct']
    env={**os.environ,'PYTHONDONTWRITEBYTECODE':'1','PYTHONIOENCODING':'utf-8'}
    v=subprocess.run(args,cwd=T.p,env=env,capture_output=True)
    stdout=v.stdout.decode('utf-8',errors='replace');stderr=v.stderr.decode('utf-8',errors='replace')
    if v.returncode==0 or (required and required not in stderr):raise AssertionError(label+' wrong rejection '+stderr)
    if any(p.exists() for p in b.packet_paths(T.l/b.LESSON_REL) if p.name!='build_pdf.py'):raise AssertionError('Native output written by invalid CLI')
    if list((T.p/'reports/sprints').glob(N+'attempt-*.json')):raise AssertionError('Namespace consumed by invalid CLI')
    rows.append({'label':label,'entrypoint':entry,'argv':args,'cwd':str(T.p),'exit_code':v.returncode,'stdout':stdout,'stderr':stderr,'native_output_count':0,'namespace_consumed':False})

try:
    candidate=T.p/(b.gate.C+'232-inputs.json');grant=T.p/(b.gate.N+'232-release.json')
    for row in T.manifest['inputs']:
        p=(T.p if row['repository']=='4veco-platform' else T.l)/row['path'];f=b.gate.data_path(p);original=T.originals[p]
        try:
            f.unlink();run('missing '+row['path'],required='FileNotFoundError')
            changed=original+b'\nFORGED_ACTUAL_FILE\n';f.write_bytes(changed);run('forged '+row['path'],required='Actual accepted input changed:')
            bad=json.loads(json.dumps(T.manifest));r=next(r for r in bad['inputs'] if r['path']==row['path'] and r['repository']==row['repository']);r['raw_sha256']=b.sha(changed)
            raw=json.dumps(bad).encode();candidate.write_bytes(raw);g=json.loads(T.originals[grant]);g['candidate']['raw_sha256']=b.sha(raw);grant.write_bytes(json.dumps(g).encode())
            run('synchronized '+row['path'],required='Whole immutable authority changed:')
        finally:f.write_bytes(original);candidate.write_bytes(T.originals[candidate]);grant.write_bytes(T.originals[grant])
    for name in list(b.gate.PINS)+b.gate.SOURCE_FILES:
        p=T.p/name;f=b.gate.data_path(p);original=T.originals[p]
        try:
            f.write_bytes(original+b'\n# FORGED WHOLE CONTROLLER OR SOURCE\n')
            # JS is not loaded: fixed raw identity must reject before Node.
            # Appended comment remains valid Python for actual controller cases.
            expected='Whole immutable authority changed:' if name in b.gate.PINS else 'Whole source differs from caller commit:'
            if name.endswith('assets.js'):expected='Whole source differs from caller commit:'
            run('whole source '+name,required=expected)
        finally:f.write_bytes(original)
    target=T.manifest['inputs'][2];p=T.l/target['path'];raw=T.originals[p]
    try:
        p.write_bytes(raw+b'\nFORGED_PLAN\n')
        run('actual full CLI invalid accepted plan','full','Actual accepted input changed:')
        run('actual direct orchestrator CLI invalid accepted plan','direct','Actual accepted input changed:')
    finally:p.write_bytes(raw)
    qc=next(r for r in T.manifest['inputs'] if r['path'].endswith('2.1.3-quality-ref.yaml'))
    p=T.l/qc['path'];raw=T.originals[p]
    try:
        changed=raw.replace(b'actor: "paragraph_231_specialist_qc"',b'actor: "forged_qc_identity"',1)
        if changed==raw:raise AssertionError('Actual QC identity field not found')
        p.write_bytes(changed);run('actual wrong QC actor before Node',required='Actual accepted input changed:')
        bad=json.loads(json.dumps(T.manifest));r=next(r for r in bad['inputs'] if r['path']==qc['path']);r['raw_sha256']=b.sha(changed)
        candidate.write_bytes(json.dumps(bad).encode());g=json.loads(T.originals[grant]);g['candidate']['raw_sha256']=b.sha(candidate.read_bytes());grant.write_bytes(json.dumps(g).encode())
        run('synchronized wrong QC actor candidate and grant',required='Whole immutable authority changed:')
    finally:p.write_bytes(raw);candidate.write_bytes(T.originals[candidate]);grant.write_bytes(T.originals[grant])
    for key,value in [('decision','CANDIDATE_ONLY'),('accountable_actor','forged_owner')]:
        try:
            g=json.loads(T.originals[grant]);g[key]=value;grant.write_bytes(json.dumps(g).encode());run('whole root grant '+key,required='Whole immutable authority changed:')
        finally:grant.write_bytes(T.originals[grant])
    status='PASS'
except Exception as e:
    status='FAIL';rows.append({'error':str(e)});raise
finally:
    source={n:b.sha((P/n).read_bytes()) for n in b.gate.SOURCE_FILES}
    output.write_text(json.dumps({'status':status,'source_commit':T.source_commit,'source':source,'fixture':str(T.fixture),'cases':rows,'actual_cli_cases':len([r for r in rows if 'entrypoint' in r]),'live_mutations':0,'native_success_claim':False},ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    InputTests.tearDownClass()
    print(json.dumps({'status':status,'cases':len(rows),'output':str(output)}))
