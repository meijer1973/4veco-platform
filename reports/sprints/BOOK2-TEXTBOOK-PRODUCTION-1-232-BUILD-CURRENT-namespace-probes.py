"""Actual namespace functions against disposable technical filesystem paths.
No pupil authority is created and no production success is asserted.
"""
from pathlib import Path
import json
import sys
import tempfile
sys.path.insert(0,str(Path(__file__).resolve().parents[2]/'build-scripts/content/book-2'))
import b2_232 as b

rows=[]
with tempfile.TemporaryDirectory(prefix='book2-232-namespace-probes-',dir='C:/wt') as name:
    root=Path(name)/'4veco-platform';sprints=root/'reports/sprints';sprints.mkdir(parents=True)
    revision='r42';source='a'*40;reservation=sprints/(b.gate.PREFIX+'reservation-'+revision+'.json')
    original={'revision':revision,'source_commit':source,'actor':'paragraph_231_specialist_qc','status':'RESERVED_UNUSED','global_scan':{'technical_fixture':True},'maximum_recorded_revision':41}
    def put(value):reservation.write_text(json.dumps(value),encoding='utf-8')
    def check():return b.gate.namespace_preflight(revision,reservation,source,root)
    def reject(label,call,reason):
        before={p.relative_to(root).as_posix():b.sha(p.read_bytes()) for p in root.rglob('*') if p.is_file()}
        try:call()
        except (ValueError,FileNotFoundError) as e:
            if reason not in str(e):raise AssertionError(label+' unexpected rejection '+str(e))
        else:raise AssertionError(label+' passed unexpectedly')
        after={p.relative_to(root).as_posix():b.sha(p.read_bytes()) for p in root.rglob('*') if p.is_file()}
        if before!=after:raise AssertionError(label+' changed fixture')
        rows.append({'case':label,'result':'REJECTED_BEFORE_EFFECTS','reason':reason})
    put(original);attempt,manifest,proof=check()
    for invalid in ['r0','r-1','../r42','r42/other','R42','r42.json']:
        reject('unsafe revision '+invalid,lambda:b.gate.namespace_preflight(invalid,reservation,source,root),'Explicit positive revision')
    reject('outside reservation',lambda:b.gate.namespace_preflight(revision,root.parent/'outside.json',source,root),'Wrong reservation path')
    for key,value in [('revision','r43'),('source_commit','b'*40),('actor','another_actor'),('status','STARTED'),('global_scan',None),('maximum_recorded_revision',42)]:
        changed={**original,key:value};put(changed);reject('forged '+key,check,'Wrong reservation identity' if key in ['revision','source_commit','actor','status'] else 'Reservation lacks fresh global history');put(original)
    for p in [attempt,manifest]:
        p.write_bytes(b'original consumed evidence\n');reject('consumed '+p.name,check,'Consumed namespace');p.unlink()
    occupied=proof/('232-opgaven-abcdef012345-'+revision);occupied.mkdir(parents=True)
    reject('occupied empty actual proof',check,'Occupied proof revision')
    payload=occupied/'proof.json';payload.write_bytes(b'original proof\n');reject('occupied populated actual proof',check,'Occupied proof revision');payload.unlink();occupied.rmdir()
    # Actual exclusive-open primitive used by the controller: no replacement.
    attempt.write_bytes(b'preserve first attempt\n')
    try:
        with attempt.open('x',encoding='utf-8') as f:f.write('overwrite')
    except FileExistsError:pass
    else:raise AssertionError('Atomic existing attempt not rejected')
    if attempt.read_bytes()!=b'preserve first attempt\n':raise AssertionError('Original attempt changed')
    rows.append({'case':'actual atomic attempt collision','result':'REJECTED_FIRST_BYTES_PRESERVED'})
    if root.parent.resolve().parent!=Path('C:/wt').resolve():raise ValueError('Unsafe technical fixture')
output=b.ROOT/'reports/sprints'/(b.gate.PREFIX+'namespace-probes.json')
with output.open('x',encoding='utf-8',newline='\n') as f:json.dump({'status':'PASS','cases':rows,'count':len(rows),'production_runs':0,'scope':'actual namespace functions and exclusive file primitive; not hostile-filesystem transaction proof'},f,indent=2);f.write('\n')
print(json.dumps({'status':'PASS','cases':len(rows)}))
