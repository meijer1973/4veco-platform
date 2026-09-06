"""Root exact-source adapter for fresh §224 reproduction, not a source repair.

HOW TO ADAPT: obtain a new root order and exact caller-pinned source commit.
Reuses unchanged specialist predicates; only actor/evidence destinations are
rebound. Every root positive additionally checks current production authority.
The generic print child is unchanged and not an independently authorized route.
"""
from pathlib import Path
from unittest.mock import patch
import argparse, hashlib, importlib.util, json, os, re, subprocess, sys, tempfile
sys.dont_write_bytecode=True
P=Path(__file__).resolve().parents[2];L=P.parent/'4veco-lessen'
PRE='BOOK2-TEXTBOOK-PRODUCTION-1-224-QC-ROOT';ORIGINAL='BOOK2-TEXTBOOK-PRODUCTION-1-224-QC-CURRENT'
E=P/'reports/sprints'/(PRE+'-evidence');COMMIT='c8d824dc58d2160b57f5c7b5b826aa67e5abeb11'
OWN=['reports/sprints/'+PRE+'-native.py','reports/sprints/'+PRE+'-check.cjs']
def git(ref,rel):return subprocess.check_output(['git','show',ref+':'+rel],cwd=P)
def load_module(name,rel):
    spec=importlib.util.spec_from_file_location(name,P/rel);module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module
for tail,pin in [('controller.py','f4cc0baca71685e1f3ba4eaa0d27820dfaf234cfe0a4884b1b8b1ed3cc440a94'),('checks.py','4a932b1ad6ec0dc271f4c239eb77434ddece12748aee99a6b6283e53168af1b5')]:
    rel='reports/sprints/'+ORIGINAL+'-'+tail
    assert hashlib.sha256((P/rel).read_bytes()).hexdigest()==pin
    assert (P/rel).read_bytes()==git(COMMIT,rel)
c=load_module('root224_original_controller','reports/sprints/'+ORIGINAL+'-controller.py')
k=load_module('root224_original_checks','reports/sprints/'+ORIGINAL+'-checks.py')
c.E=E;c.ACTOR='codex-root';k.E=E;k.c=c

def guard(commit):
    assert re.fullmatch(r'[0-9a-f]{40}',commit),'Exact caller source commit required'
    originals={rel:git(commit,rel) for rel in OWN}
    c.verify_bound_bytes(P,originals)
    bound=c.guard(COMMIT);c.release_guard();c.native_guard()
    return {'root_source_commit':commit,'root_files':[{'path:f,'raw_sha256':c.sha(v)} for f,v in originals.items()],'original_bound_files':bound}

def namespace(mode,revision):
    if mode not in ('full','thin','print') or not re.fullmatch(r'r[1-9][0-9]*',revision):raise ValueError('Invalid root route/revision')
    label='direct' if mode=='print' else mode
    if any(E.glob('224-*-'+revision)):raise ValueError('Existing proof revision')
    if os.path.lexists(E/f'224-{label}-{revision}-manifest.json'):raise ValueError('Existing manifest')
    if mode=='print':
        if os.path.lexists(E/f'224-direct-{revision}'):raise ValueError('Direct destination occupied')
        c.unused_direct_destination(revision)
    return label

def run(mode,revision,commit):
    source=guard(commit);label=namespace(mode,revision)
    reservation=E/f'224-reservation-{label}-{revision}.json'
    if c.read(reservation).get('revision')!=revision:raise ValueError('Reservation mismatch')
    c.command('root-approved-production',['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.2.4'],E/f'224-root-production-{label}-{revision}')
    guard(commit);namespace(mode,revision)
    c.save(E/f'224-root-source-{label}-{revision}.json',source)
    c.run(label,revision,mode,COMMIT)

def probes(commit):
    source=guard(commit);k.probes(COMMIT);rows=[]
    expected={rel:git(commit,rel) for rel in OWN}
    with tempfile.TemporaryDirectory(prefix='224-root-whole-',dir='C:/wt') as td:
        root=Path(td);assert root.resolve().parent==Path('C:/wt').resolve()
        for rel,value in expected.items():f=root/rel;f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(value)
        c.verify_bound_bytes(root,expected)
        for rel,value in expected.items():
            f=root/rel
            for mode in ('missing','forged'):
                f.unlink() if mode=='missing' else f.write_bytes(value+b'\n# forged\n')
                try:c.verify_bound_bytes(root,expected)
                except ValueError:rows.append({'file':rel,'mode':mode,'rejected':True})
                else:raise AssertionError('Whole root source accepted')
                f.write_bytes(value)
        for rel,value in expected.items():(root/rel).write_bytes(value+b'\n# synchronized\n')
        try:c.verify_bound_bytes(root,expected)
        except ValueError:rows.append({'mode':'combined-root-source-drift','rejected':True})
        else:raise AssertionError('Combined root source drift accepted')
    with tempfile.TemporaryDirectory(prefix='224-root-namespace-',dir='C:/wt') as td:
        evidence=Path(td);destination=evidence/'224-direct-r999'
        c.save(evidence/'224-reservation-direct-r999.json',{'revision':'r999'})
        for kind in ('empty-directory','populated-directory','file'):
            if kind=='file':destination.write_bytes(b'occupied')
            else:
                destination.mkdir()
                if kind=='populated-directory':(destination/'sentinel').write_bytes(b'preserve')
            with patch.dict(globals(),E=evidence),patch.object(c,'E',evidence),patch.object(c,'save',side_effect=AssertionError('premature write')) as sv,patch.object(c,'command',side_effect=AssertionError('premature Node/worker')) as cmd:
                try:run('print','r999',commit)
                except ValueError:rows.append({'namespace':kind,'real_root_run_entry':True,'rejected':True,'effects':0})
                else:raise AssertionError('Occupied root namespace accepted')
                sv.assert_not_called();cmd.assert_not_called()
            assert destination.resolve().parent==evidence.resolve()
            if kind=='file':destination.unlink()
            else:
                if kind=='populated-directory':(destination/'sentinel').unlink()
                destination.rmdir()
        with patch.dict(globals(),E=evidence),patch.object(c,'E',evidence):
            assert namespace('print','r999')=='direct'
            for invalid in ('r0','../r1','r1/../../outside'):
                try:namespace('print',invalid)
                except ValueError:rows.append({'invalid_revision':invalid,'rejected':True})
                else:raise AssertionError('Invalid revision accepted')
    guard(commit)
    c.save(E/'224-root-source-namespace-probes.json',{'status':'PASS','actor':'codex-root','source':source,'cases':rows,'root_personal_views':0,'native_writes':0,'attribution':'Actual root rerun of unchanged specialist109 input/21 whole-file probes plus5 root whole-file and6 root namespace negatives; technical fixtures only.'})
    print(json.dumps({'status':'PASS','additional_root_negatives':len(rows),'native_writes':0}))

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('action',choices=['guard','probes','gates','reserve','full','thin','print']);p.add_argument('--root-source-commit',required=True);p.add_argument('--revision');p.add_argument('--label');p.add_argument('--manifest',type=Path);a=p.parse_args()
    guard(a.root_source_commit)
    if a.action=='guard':print(json.dumps(guard(a.root_source_commit)))
    elif a.action=='probes':probes(a.root_source_commit)
    elif a.action=='gates':k.gates(a.label,a.manifest)
    elif a.action=='reserve':c.reserve(a.label,COMMIT)
    else:run(a.action,a.revision,a.root_source_commit)
