"""Independent specialist §224 custody/native evidence; no acceptance or repair.

Adapted with attribution from the fully read 224 REVIEW controller. Adds fixed
shared/self bindings, actual specialist/durable direct-print gates, a distinct
checker-rebuild route, strict published raw baseline, and QC-only custody.
Every attempt is exclusive; failed and PENDING artifacts are never rewritten.
Supply --controller-commit as the actual immutable commit of this whole file.
"""
from __future__ import annotations
import argparse, base64, hashlib, importlib, json, os, re, subprocess, sys, time
from datetime import datetime, timezone
from pathlib import Path

P=Path(__file__).resolve().parents[2]; L=P.parent/'4veco-lessen'
PREFIX='BOOK2-TEXTBOOK-PRODUCTION-1-224-QC-CURRENT'
E=P/'reports/sprints'/(PREFIX+'-evidence')
PBASE='143b8292363f3da6172ab1de9e58899df2b64dd3'
LBASE='f666bbb7dd258f1f01b38a20dd6ca3802848f8b7'
SOURCE='9acf684b78c42a5afbcb1253a7e9cd7711bdf7ab'
SELF='reports/sprints/'+PREFIX+'-controller.py'
SOURCES=['build-scripts/content/book-2/b2_224.py']+['build-scripts/content/book-2/224/'+n for n in ['answers.md','check_render.py','exercises.md','target-answers.md','test_source.py']]
SHARED='build-scripts/content/book-2/print_pipeline.py'
OLD_CONTROLLER='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-224-BUILD-controller.py'
BINDINGS='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-224-REVIEW-evidence/224-review-bindings.json'
ACTOR='paragraph_214_builder'

def now(): return datetime.now(timezone.utc).isoformat()
def sha(raw): return hashlib.sha256(raw).hexdigest()
def data(path):
    path=Path(path)
    return Path('\\\\?\\'+str(path.resolve())) if os.name=='nt' and not str(path).startswith('\\\\?\\') else path
def raw(path): return data(path).read_bytes()
def digest(path): return sha(raw(path))
def git(root,*args): return subprocess.run(['git',*args],cwd=root,capture_output=True,check=True).stdout
def save(path,value):
    path=Path(path);path.parent.mkdir(parents=True,exist_ok=True)
    with path.open('x',encoding='utf-8',newline='\n') as f:f.write(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
def save_raw(path,value):
    with Path(path).open('xb') as f:f.write(value)
def read(path): return json.loads(raw(path))
def verify_bound_bytes(root,expected):
    for path,value in expected.items():
        if not data(root/path).is_file() or raw(root/path)!=value:raise ValueError('Whole bound bytes differ: '+path)
def originals(commit):
    refs={s:SOURCE for s in SOURCES}
    refs.update({SHARED:PBASE,OLD_CONTROLLER:'0e2349ecf50e817482bf2f5c1d6d5aedc32c9323',SELF:commit})
    return {p:git(P,'show',ref+':'+p) for p,ref in refs.items()},refs
def guard(commit):
    values,refs=originals(commit);verify_bound_bytes(P,values)
    if sha(values[SHARED])!='51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5':raise ValueError('Shared comparator changed')
    return [{'path':p,'commit':refs[p],'raw_sha256':sha(v)} for p,v in values.items()]
def builder():
    sys.path.insert(0,str(P/'build-scripts/content/book-2'))
    return importlib.import_module('b2_224')
def native_expected():
    if digest(P/BINDINGS)!='643b29ce1bc932ef6752544665cad6cfdde08a6ba2f6280c0ef3d1fd84c475b6':raise ValueError('Reviewer binding drift')
    return read(P/BINDINGS)['native_files']
def native_guard():
    for row in native_expected():
        if digest(L/row['path'])!=row['sha256']:raise ValueError('Published native drift: '+row['path'])
def release_guard():
    b=builder();release=b.verify_current_release(L);b.verify_committed_release(release,L)
    return release
def command(label,argv,stem):
    env=dict(os.environ);env.update(PYTHONIOENCODING='utf-8',PYTHONDONTWRITEBYTECODE='1')
    started={'created':now(),'actor':ACTOR,'label':label,'argv':argv,'cwd':str(P),
             'python':sys.executable,'python_version':sys.version,'PATH':os.environ.get('PATH',''),
             'PATH_sha256':sha(os.environ.get('PATH','').encode()),'child_overrides':{'PYTHONIOENCODING':'utf-8','PYTHONDONTWRITEBYTECODE':'1'}}
    save(str(stem)+'-started.json',started);t=time.monotonic()
    r=subprocess.run(argv,cwd=P,env=env,capture_output=True)
    save_raw(str(stem)+'-stdout.txt',r.stdout);save_raw(str(stem)+'-stderr.txt',r.stderr)
    result={'finished':now(),'label':label,'exit_code':r.returncode,'seconds':time.monotonic()-t,'stdout_sha256':sha(r.stdout),'stderr_sha256':sha(r.stderr),'PATH_unchanged':started['PATH_sha256']==sha(os.environ.get('PATH','').encode())}
    save(str(stem)+'-command-finished.json',result)
    if r.returncode:raise RuntimeError(label+' failed; exact stdout/stderr retained at '+str(stem))
    return r,result
def init(commit):
    bound=guard(commit);release=release_guard();native_guard();b=builder();rows=[]
    for name,root,base in [('4veco-platform',P,PBASE),('4veco-lessen',L,LBASE)]:
        for entry in git(root,'ls-tree','-rz',base).split(b'\0'):
            if not entry:continue
            meta,path=entry.split(b'\t',1);path=path.decode('utf8');blob=meta.split()[-1].decode();value=raw(root/path)
            if hashlib.sha1(b'blob '+str(len(value)).encode()+b'\0'+value).hexdigest()!=blob:raise ValueError('Initial baseline drift '+path)
            rows.append({'repository':name,'path':path,'git_blob':blob,'raw_sha256':sha(value)})
    prior=read(P/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-224-BUILD-baseline.json')['instructions']
    for row in prior:
        if digest(P.parent/row['repository']/row['path'])!=row['raw_sha256']:raise ValueError('Instruction drift '+row['path'])
    qc=L/b.LESSON_REL/'2.2.4-quality-ref.yaml'
    save(E/'224-baseline.json',{'actor':ACTOR,'role':'independent224specialistQC','created':now(),'bases':{'platform':PBASE,'lessons':LBASE},'whole_bound_files':bound,'files':rows,'instructions':prior,'release':release,'release_sha256':b.RELEASE_HASH,'native_files':native_expected(),'old_flat_QC':{'commit':LBASE,'path':str(qc.relative_to(L)),'raw_sha256':digest(qc)},'canonical_review_sha256':digest(L/b.LESSON_REL/'2.2.4-review.md'),'handoff_exists':(L/b.LESSON_REL/'2.2.4-textbook-handoff.md').exists()})
    save_raw(E/'224-old-flat-quality-ref.yaml',raw(qc))
    adoption=read(P/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-224-ROOT-ADOPTION-verification.json')
    for row in adoption['imported_paths']:
        if digest(P.parent/row['repository']/row['path'])!=row['raw_sha256']:raise ValueError('Root imported evidence drift '+row['path'])
    save(E/'224-root-import-custody.json',{'status':'PASS','records':len(adoption['imported_paths']),'unique_paths':len(set((r['repository'],r['path']) for r in adoption['imported_paths'])),'root_verification_sha256':digest(P/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-224-ROOT-ADOPTION-verification.json'),'root_native_was_not_run':True})
    print(json.dumps({'files':len(rows),'source_guard':len(bound),'inputs':len(release['inputs']),'baseline':digest(E/'224-baseline.json')}))
def reserve(label,commit):
    guard(commit);release_guard();native_guard();registered=set();matches=[];maximum=0
    for root in (P,L):
        for line in git(root,'worktree','list','--porcelain').decode('utf8').splitlines():
            if line.startswith('worktree '):registered.add(line[9:])
    for worktree in sorted(registered):
        folder=Path(worktree)/'reports'
        if not folder.is_dir():continue
        for directory,dirs,files in os.walk(data(folder)):
            rel=str(directory).replace('\\','/')
            for name in [*dirs,*files]:
                full=rel+'/'+name
                if '224' not in full:continue
                for found in re.findall(r'(?:^|[-_/])r([1-9][0-9]*)(?=[-_. /]|$)',full):
                    maximum=max(maximum,int(found));matches.append({'worktree':worktree,'path':full,'revision':int(found)})
    revision='r'+str(maximum+1)
    save(E/f'224-reservation-{label}-{revision}.json',{'actor':ACTOR,'created':now(),'label':label,'revision':revision,'maximum_prior':maximum,'registered_worktrees':sorted(registered),'matches':matches})
    print(json.dumps({'revision':revision,'max_prior':maximum,'worktrees':len(registered)}))
def figure_pixels():
    from PIL import Image
    b=builder();rows=[]
    for n in range(1,5):
        path=L/b.LESSON_REL/'_assets'/f'2.2.4_ex_{n}.png'
        with Image.open(data(path)) as im:
            im=im.convert('RGB');rows.append({'figure':n,'raw_sha256':digest(path),'rgb_sha256':sha(im.tobytes()),'size':list(im.size)})
    return rows
def pages(manifest):
    from PIL import Image
    rows=[]
    for kind,record in zip(('opgaven','antwoorden'),manifest['documents']):
        folder=Path(record['proof_directory']);proof=read(folder/'manifest.json')
        if proof['pages_inspected'] or proof['inspection_status']!='PENDING':raise ValueError('PENDING proof changed')
        if len(proof['rendered_pages'])!=10:raise ValueError('Expected ten actual pages')
        for i,rel in enumerate(proof['rendered_pages'],1):
            path=folder/rel
            if digest(path)!=proof['page_sha256'][path.name]:raise ValueError('Page proof changed')
            with Image.open(data(path)) as im:
                im=im.convert('RGB');rows.append({'kind':kind,'page':i,'path':str(path),'raw_sha256':digest(path),'rgb_sha256':sha(im.tobytes()),'size':list(im.size)})
    return rows
def run(label,revision,mode,commit,comparator=None):
    bound=guard(commit);release=release_guard();native_guard();b=builder()
    reservation=E/f'224-reservation-{label}-{revision}.json'
    if read(reservation)['revision']!=revision:raise ValueError('Reservation mismatch')
    stem=E/f'224-{label}-{revision}';manifest=Path(str(stem)+'-manifest.json')
    if manifest.exists():raise ValueError('Manifest attempt exists')
    save(str(stem)+'-preflight.json',{'created':now(),'bound_files':bound,'release_inputs':release['inputs'],'release_commit':b.RELEASE_COMMIT,'release_sha256':b.RELEASE_HASH,'native':native_expected(),'reservation_sha256':digest(reservation),'mode':mode})
    for gate,argv in [('specialist',['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','specialist_review','--paragraph','2.2.4']),('durable',['node','build-scripts/workflows/check-book2-target-authority-remediation.js','--durable'])]:
        command(gate,argv,str(stem)+'-'+gate)
    guard(commit);release_guard();native_guard()
    folder=L/b.LESSON_REL
    if mode in ('print','checker'):
        for kind,source in b.documents(b.target_record()).items():
            if raw(folder/f'{b.STEM} – {kind}.md')!=(source.rstrip()+'\n').encode():raise ValueError('Source derivation drift')
        for name,source in b.asset_sources().items():
            if raw(folder/'_assets'/(name+'.svg'))!=source.encode():raise ValueError('SVG derivation drift')
    if mode in ('full','thin'):
        argv=[sys.executable,str(P/'build-scripts/content/book-2/b2_224.py' if mode=='full' else folder/'build_pdf.py'),'--lesson-root',str(L),'--proof-root',str(E),'--proof-suffix',revision,'--manifest',str(manifest)]
    elif mode=='print':
        argv=[sys.executable,str(P/SHARED),*[str(folder/f'{b.STEM} – {k}.md') for k in ('opgaven','antwoorden')],'--proof-root',str(E/f'224-direct-{revision}')]
    else:
        if comparator is None:raise ValueError('Genuine checker requires original manifest')
        argv=[sys.executable,str(P/'build-scripts/content/book-2/224/check_render.py'),'--lesson-root',str(L),'--manifest',str(comparator),'--rebuild']
    result,execution=command(mode,argv,stem)
    if mode=='print':
        documents=[json.loads(line) for line in result.stdout.decode('utf8').splitlines() if line.startswith('{')]
        if len(documents)!=2:raise ValueError('Two direct records required')
        for row in documents:row['proof_directory']=str(E/f'224-direct-{revision}'/row['artifact_id'])
        save(manifest,{'inspection_status':'PENDING','actual_route':'unchanged direct print worker after explicit specialist/durable gates','documents':documents,'native_files':native_expected()})
    if mode=='checker':
        from print_pipeline import render_proof
        native_guard();documents=[]
        for row in read(comparator)['documents']:
            record={k:v for k,v in row.items() if k in ['source_md','source_sha256','source_html','html_sha256','source_pdf','pdf_sha256','assets']}
            # Original comparator paths belong to this own current pair.
            proof=E/f'224-checker-{Path(record["source_md"]).stem.split(" – ")[-1]}-{revision}'
            render_proof(record,proof);record['proof_directory']=str(proof);documents.append(record)
        save(manifest,{'inspection_status':'PENDING','actual_route':'genuine check_render.py --rebuild; subsequent read-only Poppler proof, not a replacement build','documents':documents,'native_files':native_expected()})
    status='PASS';error=None
    try:
        guard(commit);release_guard();native_guard();page_rows=pages(read(manifest));figures=figure_pixels()
        original_pages=read(P/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-224-REVIEW-evidence/224-parity.json')['page_sets'][0]
        norm=lambda rows:[{k:v for k,v in r.items() if k!='path'} for r in rows]
        if norm(page_rows)!=norm(original_pages):raise ValueError('Published original raw/RGB page comparator differs')
    except Exception as exc:status='FAIL';error=repr(exc);page_rows=[];figures=[]
    save(str(stem)+'-finished.json',{'status':status,'error':error,'execution':execution,'manifest_sha256':digest(manifest),'pages':page_rows,'figure_pixels':figures,'native_files':native_expected()})
    print(json.dumps({'status':status,'mode':mode,'revision':revision,'manifest_sha256':digest(manifest),'pages':len(page_rows),'error':error}),flush=True)
    if status!='PASS':raise SystemExit(1)
def views(manifest):
    from PIL import Image
    b=builder();out=E/'224-personal-views';out.mkdir(exist_ok=False);rows=pages(read(manifest))
    for n in range(1,5):
        path=L/b.LESSON_REL/'_assets'/f'2.2.4_ex_{n}.png';rows.append({'figure':n,'path':str(path),'raw_sha256':digest(path)})
    for row in rows:
        name=f"{row['kind']}-{row['page']:03d}" if 'page' in row else 'figure-'+str(row['figure'])
        path=out/(name+'-gray.png')
        with Image.open(data(row['path'])) as im:im.convert('L').convert('RGB').save(path)
        row.update(gray_path=str(path),gray_sha256=digest(path),personal_observation='NOT_YET_RECORDED')
    save(E/'224-view-inventory.json',{'manifest_sha256':digest(manifest),'views':rows,'actual_views_required':48});print(json.dumps({'items':len(rows),'views':48}))
def custody(label):
    baseline=read(E/'224-baseline.json');b=builder();changes=[]
    indexes={f'reports/github-agent-index-{n}.{e}' for n in ['platform','lessen'] for e in ['json','md']}
    qc=(b.LESSON_REL/'2.2.4-quality-ref.yaml').as_posix()
    for row in baseline['files']:
        path=P.parent/row['repository']/row['path'];actual=digest(path) if data(path).is_file() else None
        if actual==row['raw_sha256']:continue
        if not ((row['repository']=='4veco-platform' and row['path'] in indexes) or (row['repository']=='4veco-lessen' and row['path']==qc)):raise ValueError('Unowned baseline drift '+row['path'])
        changes.append({**row,'current_sha256':actual})
    native_guard();release_guard()
    save(E/f'224-custody-{label}.json',{'status':'PASS','baseline_files':len(baseline['files']),'preserved':len(baseline['files'])-len(changes),'allowed_changes':changes})
    print(json.dumps({'status':'PASS','preserved':len(baseline['files'])-len(changes),'changes':len(changes)}))

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('action',choices=['init','reserve','run','views','custody']);ap.add_argument('--controller-commit',required=True);ap.add_argument('--label');ap.add_argument('--revision');ap.add_argument('--mode',choices=['full','thin','print','checker']);ap.add_argument('--manifest',type=Path);a=ap.parse_args()
    guard(a.controller_commit)
    if a.action=='init':init(a.controller_commit)
    elif a.action=='reserve':reserve(a.label,a.controller_commit)
    elif a.action=='run':run(a.label,a.revision,a.mode,a.controller_commit,a.manifest)
    elif a.action=='views':views(a.manifest)
    else:custody(a.label)
