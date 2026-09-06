"""HOW TO ADAPT: owned read-only actual identities, real negative entrypoints,
and immutable cross-epoch custody. Never mutates foreign claims/inputs/proofs.
"""
from pathlib import Path
import argparse,json,subprocess,sys
sys.path.insert(0,str(Path(__file__).resolve().parents[2]/'build-scripts/content/book-2'))
import b2_232 as b
sys.path.insert(0,str(b.CONTENT))
import verify_rebuild as v
N='BOOK2-TEXTBOOK-PRODUCTION-1-232-REPRO-ROUTES-'
OLD='BOOK2-TEXTBOOK-PRODUCTION-1-232-BUILD-CURRENT-'
BASE='020def560795a0acab07dc11552b3e4abebf3d62'
LESSON='ea0dd35d4f919ac5b3aae533cd9f9022ffa62282'
def identities():
    records=[]
    for role,(_,_,pair,_) in b.gate.ROLES.items():
        p=Path('C:/wt')/pair/'4veco-platform'
        try:records.append({'role':role,'status':'READONLY_VALID_ACTUAL_CLAIMS','identity':b.gate.execution_identity(role,p)})
        except (ValueError,FileNotFoundError,subprocess.CalledProcessError) as e:
            if role!='specialist-qc':raise
            records.append({'role':role,'status':'FUTURE_UNCLAIMED_REJECTED','error':str(e)})
    v.save(b.ROOT/'reports/sprints'/(OUT+'actual-identities.json'),records)
    print(json.dumps(records,indent=2))
def negatives(source):
    folder=b.ROOT.parent/'4veco-lessen'/b.LESSON_REL;before=b.snapshot(folder)
    own=b.ROOT/'reports/sprints';records=[]
    paths_before={p.relative_to(b.ROOT).as_posix() for p in b.ROOT.rglob('*') if p.is_file() and N in p.name}
    for route in ('full','thin','direct'):
        entry=folder/'build_pdf.py' if route=='thin' else b.ROOT/'build-scripts/content/book-2/b2_232.py'
        for label,role,reservation in [('foreign-role','paragraph-review',own/(N+'absent.json')),
                                       ('cross-prefix','correction',own/(OLD+'reservation-r1000003.json')),
                                       ('missing-reservation','correction',own/(N+'reservation-r1000006.json'))]:
            argv=[sys.executable,str(entry),'--source-commit',source,'--revision','r1000006','--reservation',str(reservation),'--execution-role',role]
            if route=='direct':argv+=['--route','direct']
            result=subprocess.run(argv,cwd=b.ROOT,capture_output=True)
            if not result.returncode:raise AssertionError('Invalid real CLI accepted')
            error=result.stderr.decode('utf-8',errors='replace')
            expected={'foreign-role':'Wrong assigned platform worktree','cross-prefix':'Wrong execution-role evidence path','missing-reservation':'FileNotFoundError'}[label]
            if expected not in error:raise AssertionError('Wrong rejection reason '+error)
            records.append({'route':route,'case':label,'argv':argv,'cwd':str(b.ROOT),'exit_code':result.returncode,'stdout':result.stdout.decode('utf-8',errors='replace'),'stderr':error})
    if b.snapshot(folder)!=before:raise AssertionError('Native effect on rejection')
    paths_after={p.relative_to(b.ROOT).as_posix() for p in b.ROOT.rglob('*') if p.is_file() and N in p.name}
    if paths_before!=paths_after:raise AssertionError('Namespace output on rejection')
    v.save(own/(OUT+'negative-cli.json'),{'status':'PASS','cases':records,'native_byte_changes':0,'owned_namespace_file_changes':0})
    print('Nine actual full/thin/guarded-direct failures before native/namespace effects PASS')
def cross_epoch(current_path):
    current=v.validate_manifest(v.load(current_path));oldrel='reports/sprints/'+OLD+'native-r1000003.json'
    raw=b.gate.git_blobs(b.ROOT,[BASE+':'+oldrel])[0]
    if (b.ROOT/oldrel).read_bytes()!=raw:raise AssertionError('Original manifest changed')
    old=json.loads(raw);folder=b.ROOT.parent/'4veco-lessen'/b.LESSON_REL
    paths=b.packet_paths(folder)
    originals=b.gate.git_blobs(b.ROOT.parent/'4veco-lessen',[LESSON+':'+p.relative_to(b.ROOT.parent/'4veco-lessen').as_posix() for p in paths])
    for path,data in zip(paths,originals):
        if path.read_bytes()!=data:raise AssertionError('Native epoch drift '+str(path))
    if current['packet']!=old['packet']:raise AssertionError('Original41packet mismatch')
    pages={};proofs=[]
    for kind,doc in zip(b.KINDS,old['documents']):
        directory=b.ROOT/'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1'/Path(doc['proof_directory']).name
        proof=directory/'manifest.json';rel=proof.relative_to(b.ROOT).as_posix()
        oldraw=b.gate.git_blobs(b.ROOT,[BASE+':'+rel])[0]
        if proof.read_bytes()!=oldraw:raise AssertionError('Original pending proof modified')
        pm=json.loads(oldraw);values={p.name:v.rgb(p) for p in sorted((directory/'pages').glob('page-*.png'))}
        if {n:r['raw_sha256'] for n,r in values.items()}!=pm['page_sha256']:raise AssertionError('Original raw pages drift')
        pages[kind]=values;proofs.append({'path':rel,'sha256':b.sha(oldraw)})
    if pages!=current['pages']:raise AssertionError('Original42raw/RGB parity')
    bindingrel='reports/sprints/'+OLD+'personal-binding.json'
    binding=b.gate.git_blobs(b.ROOT,[BASE+':'+bindingrel])[0]
    if (b.ROOT/bindingrel).read_bytes()!=binding:raise AssertionError('Original personal binding drift')
    result={'status':'PASS','old_committed_platform':BASE,'old_committed_lesson':LESSON,'old_source_commit':old['source_commit'],
       'current_manifest':str(current_path),'current_manifest_sha256':b.sha(Path(current_path).read_bytes()),'native_files':41,
       'old_current_packet_equal':True,'raw_and_decoded_pages':42,'archives':current['archives'],'old_pending_proofs':proofs,
       'old_personal_binding_sha256':b.sha(binding),'original_author_views':112,'fresh_personal_views':0,
       'transfer_basis':'All old PDF/figure bytes identical to committed originals; no independent review credit.'}
    v.save(b.ROOT/'reports/sprints'/(OUT+'cross-epoch.json'),result);print(json.dumps({k:v for k,v in result.items() if k not in ('archives',)},indent=2))
def auxiliary_negatives(manifest):
    records=[];own=b.ROOT/'reports/sprints'
    for tool in ('checker','grayscale'):
        for case,role,prefix in [('cross-role','paragraph-review',N),('cross-prefix','correction',OLD)]:
            output=own/(prefix+'forbidden-auxiliary.json');directory=own/(N+'forbidden-grayscale')
            if output.exists() or directory.exists():raise AssertionError('Negative destinations already occupied')
            if tool=='checker':args=[str(b.CONTENT/'check_render.py'),'--manifest',manifest,'--output',str(output),'--execution-role',role]
            else:args=[str(b.CONTENT/'verify_rebuild.py'),'grayscale',manifest,str(directory),'--output',str(output),'--execution-role',role]
            argv=[sys.executable,*args];result=subprocess.run(argv,cwd=b.ROOT,capture_output=True)
            error=result.stderr.decode('utf-8',errors='replace')
            expected='Wrong assigned platform worktree' if case=='cross-role' else 'Wrong execution-role evidence path'
            if not result.returncode or expected not in error or output.exists() or directory.exists():raise AssertionError('Auxiliary boundary failure '+error)
            records.append({'tool':tool,'case':case,'argv':argv,'exit_code':result.returncode,'stderr':error,'output_created':False})
    v.save(own/(OUT+'auxiliary-negatives.json'),{'status':'PASS','cases':records});print('Four actual checker/grayscale role failures before output PASS')
def failed_native():
    folder=b.ROOT.parent/'4veco-lessen'/b.LESSON_REL
    old=json.loads(b.gate.git_blobs(b.ROOT,[BASE+':reports/sprints/'+OLD+'native-r1000003.json'])[0])
    current=b.snapshot(folder);changed=[]
    for name,record in current.items():
        if record!=old['packet'][name]:
            raw=(folder/name).read_bytes();import base64
            changed.append({'path':name,'sha256':b.sha(raw),'original':old['packet'][name],'bytes_base64':base64.b64encode(raw).decode('ascii')})
    v.save(b.ROOT/'reports/sprints'/(N+'failed-direct-native.json'),{'revision':'r1000009','current_packet':current,'changed_native':changed,'restoration_performed':False,'next_step':'Source-controlled fresh native generation only.'})
    print(json.dumps({'changed':[r['path'] for r in changed],'base64_failed_bytes_preserved':True,'restoration_performed':False}))
def orphan():
    import base64
    lessons=b.ROOT.parent/'4veco-lessen';raw=subprocess.run(['git','ls-files','--others','--exclude-standard','-z'],cwd=lessons,capture_output=True,check=True).stdout
    names=[n.decode('utf-8') for n in raw.split(b'\0') if n]
    expected=(b.LESSON_REL/(b.STEM+' \ufffd paragraaf.zip')).as_posix()
    if names!=[expected]:raise AssertionError('Unexpected lesson extras '+repr(names))
    file=lessons/names[0];data=file.read_bytes()
    if file.resolve().parent!=(lessons/b.LESSON_REL).resolve() or len(data)!=22 or data[:4]!=b'PK\x05\x06':raise AssertionError('Wrong orphan target')
    result={'path':str(file.resolve()),'relative_path':expected,'raw_sha256':b.sha(data),'bytes_base64':base64.b64encode(data).decode(),
       'length':22,'origin':'Own failed guarded-direct r1000009; an empty ZIP under replacement-character filename.',
       'planned_native_files_changed':0,'recoverable_from_this_record':True,'deletion':'Only the fully resolved verified own22-byte orphan, no recursion/restoration.'}
    v.save(b.ROOT/'reports/sprints'/(N+'orphan-cleanup.json'),result)
    file.unlink()
    if file.exists():raise AssertionError('Orphan remains')
    print(json.dumps(result))
def gray_parity(current_path):
    oldrel='reports/sprints/'+OLD+'grayscale-corrected.json'
    raw=b.gate.git_blobs(b.ROOT,[BASE+':'+oldrel])[0]
    if (b.ROOT/oldrel).read_bytes()!=raw:raise AssertionError('Old gray record drift')
    old=json.loads(raw);current=v.load(current_path)
    key=lambda r:r['kind']+'/'+str(r.get('stem',r.get('page')))
    previous={key(r):r for r in old['items']};now={key(r):r for r in current['items']}
    if len(now)!=56 or set(now)!=set(previous):raise AssertionError('All56 gray images required')
    rows=[]
    for name,record in now.items():
        actual=v.rgb(record['path']);prior=previous[name]
        parts=Path(prior['path']).parts;relative=Path(*parts[parts.index('reports'):]);oldfile=b.ROOT/relative
        if b.sha(oldfile.read_bytes())!=prior['raw_sha256']:raise AssertionError('Old gray file drift')
        if actual!={k:prior[k] for k in ['size','rgb_sha256','raw_sha256']}:raise AssertionError('Gray epoch/pixel drift '+name)
        if any(record[k]!=actual[k] for k in actual):raise AssertionError('Stale new gray record')
        rows.append({'identity':name,**actual})
    v.save(b.ROOT/'reports/sprints'/(OUT+'gray-parity.json'),{'status':'PASS','old_commit':BASE,'old_record_sha256':b.sha(raw),'new_record_sha256':b.sha(Path(current_path).read_bytes()),'count':56,'rows':rows,'fresh_personal_views':0})
    print('All56 old/new grayscale raw and decoded images identical; no new personal views')
p=argparse.ArgumentParser();p.add_argument('mode',choices=['identities','negatives','cross-epoch','auxiliary-negatives','failed-native','orphan','gray-parity']);p.add_argument('input',nargs='?');p.add_argument('--tag',default='');a=p.parse_args();OUT=N+a.tag
if a.mode=='identities':identities()
elif a.mode=='negatives':negatives(a.input)
elif a.mode=='cross-epoch':cross_epoch(a.input)
elif a.mode=='auxiliary-negatives':auxiliary_negatives(a.input)
elif a.mode=='failed-native':failed_native()
elif a.mode=='orphan':orphan()
else:gray_parity(a.input)
