"""HOW TO ADAPT: one-shot exact root adoption, not an evergreen acceptance test.
Preserve historical runs; author a new checkpoint for any source/QC successor.
"""
from pathlib import Path, PurePosixPath
from datetime import datetime, timezone
from zipfile import ZipFile
import base64, hashlib, json, re, subprocess, sys, zlib
import yaml
from PIL import Image

P=Path(__file__).resolve().parents[2]
L=P.parent/'4veco-lessen'
PRE='BOOK2-TEXTBOOK-PRODUCTION-1-231'
E=P/'reports/sprints'/(PRE+'-root-qc-evidence')
Q=P/'reports/sprints'/(PRE+'-QC')
PY='C:/Python314/python.exe'
sys.path.insert(0,str(P/'build-scripts/content/book-2'))
import b2_231 as b
D=L/b.LESSON_REL
PROOF=P/'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1'
QC='2.3.1-quality-ref.yaml'
QCHASH='fa445ffe766131eb883fd54357952e3d8f21c4b14ad426aaf673567433df6bbf'
LCOMMIT='1c71e6a88af7f73dba4777734ee6f2495fae9f87'

def sha(v): return hashlib.sha256(v).hexdigest()
def raw(p): return sha(Path(p).read_bytes())
def read(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def save(name,data):
    E.mkdir(exist_ok=True)
    with (E/name).open('x',encoding='utf-8',newline='\n') as f:
        json.dump(data,f,ensure_ascii=False,indent=2); f.write('\n')
def git(repo,*args): return subprocess.check_output(['git',*args],cwd=repo)
def local(p):
    s=str(p).replace('\\','/')
    old='C:/wt/book2-231-qc-20260906/'
    assert s.startswith(old),s
    rest=s[len(old):]
    if rest.startswith('4veco-platform/'): return P/rest[len('4veco-platform/'):]
    assert rest.startswith('4veco-lessen/'),s
    return L/rest[len('4veco-lessen/'):]
def pixels(p):
    with Image.open(p) as im: return list(im.size),sha(im.convert('RGB').tobytes())
def run(name,args):
    assert not (E/(name+'.json')).exists()
    started=datetime.now(timezone.utc).isoformat()
    r=subprocess.run(args,cwd=P,capture_output=True,text=True,encoding='utf-8')
    save(name+'.json',{'args':args,'cwd':str(P),'started_at':started,'finished_at':datetime.now(timezone.utc).isoformat(),'exit_code':r.returncode,'stdout':r.stdout,'stderr':r.stderr})
    print(json.dumps({'command':name,'exit_code':r.returncode}),flush=True)
    assert r.returncode==0,r.stdout+r.stderr
    return r
def run_bytes(name,args):
    # Mixed Windows child-process encodings must never silently lose stdout.
    assert not (E/(name+'.json')).exists()
    started=datetime.now(timezone.utc).isoformat()
    r=subprocess.run(args,cwd=P,capture_output=True)
    streams={}
    for key,data in [('stdout',r.stdout),('stderr',r.stderr)]:
        try: decoded=data.decode('utf-8'); note='utf-8 strict'
        except UnicodeDecodeError as error:
            decoded=data.decode('utf-8',errors='backslashreplace'); note=str(error)+'; undecodable bytes escaped, exact raw base64 retained'
        streams[key]={'raw_base64':base64.b64encode(data).decode('ascii'),'sha256':sha(data),'byte_count':len(data),'decoded':decoded,'decoding':note}
    save(name+'.json',{'args':args,'cwd':str(P),'started_at':started,'finished_at':datetime.now(timezone.utc).isoformat(),'exit_code':r.returncode,**streams})
    print(json.dumps({'command':name,'exit_code':r.returncode,'stdout_bytes':len(r.stdout),'stderr_bytes':len(r.stderr)}),flush=True)
    assert r.returncode==0
    return r
def folder_snapshot():
    return {p.relative_to(L).as_posix():raw(p) for p in D.rglob('*') if p.is_file() and '__pycache__' not in p.parts}
def manifest(n): return E/'native'/f'{PRE}-build-manifest-r{n}.json'

def bindings():
    source=read(str(Q)+'-reservation-and-baseline.json')
    for r,h in source['native45'].items(): assert raw(L/r)==h,r
    # Seven root coordination files legitimately advanced in published f257.
    # Bind exact prior/current commits; no arbitrary mutation is ignored.
    root_coordination={*[f'reports/github-agent-index-{repo}.{ext}' for repo in ['platform','lessen'] for ext in ['md','json']],
        *['reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-'+name for name in ['command-log.md','command-log.jsonl','output-manifest.md']]}
    observed=set()
    for r,h in source['old_sources_and_history'].items():
        if r not in root_coordination: assert raw(P/r)==h,r
        else:
            observed.add(r)
            assert sha(git(P,'show','35e0bebb75cc3987c43dd8f480e1b444bd877f4a:'+r))==h
            published=git(P,'show','f257056d0a455c660ccb598cb4da734b36eefd80:'+r)
            assert git(P,'show','a72ae0eaa72d58365200350cf8206f38893d0b21:'+r)==published
            if '-command-log.' in r: assert (P/r).read_bytes().startswith(published),r
            else: assert (P/r).read_bytes()==published,r
    assert observed==root_coordination
    assert len(source['native45'])==45 and len(source['old_sources_and_history'])==7852
    assert raw(D/QC)==QCHASH
    qc=yaml.safe_load((D/QC).read_text(encoding='utf-8'))
    assert set(qc)=={'schema_version','partA'} and qc['schema_version']==2
    qa=qc['partA']; assert qa['specialist_qc']['hard_fails_open']==0
    assert qa['specialist_qc']['verdict']=='PASS WITH FLAGS'
    for key in ['root_validation','root_acceptance','handoff_renewal']: assert qa[key]=='PENDING'
    assert qa['production_ready'] is False and qa['production_ready_with_flags'] is False
    assert not (D/'2.3.1-textbook-handoff.md').exists()
    assert raw(Path(str(Q)+'-report.md'))=='cca0c93f3c699520d9cb70e9431ca9d1039e2e68f5a3924a73a398bfa316d117'
    assert raw(Path(str(Q)+'-personal-inspection-r17.json'))=='0617dd369111e6174bfd50854dbef3dd781f6e9b99cb5e2d45a6971a1f460339'
    obs=read(str(Q)+'-personal-inspection-r17.json')
    probes=read(str(Q)+'-probes-result.json')
    assert probes['status']=='PASS' and len(probes['guard_negatives'])==16
    assert obs['probes_result_raw_sha256']==raw(str(Q)+'-probes-result.json')
    assert obs['native_reproduction_raw_sha256']==raw(str(Q)+'-native-reproduction.json')
    assert obs['reviewer']=='paragraph_231_specialist_qc' and obs['personally_inspected_images']==96
    assert len(obs['pages'])==66 and len(obs['figures'])==15 and obs['visible_student_defects']==0
    keys=set()
    for row in obs['pages']:
        key=(row['kind'],row['page'],row['mode']); assert key not in keys; keys.add(key)
        assert row['personally_inspected'] and row['inspected_at_normal_reading_scale'] and row['visible_student_defects']==0
        assert len(row['observation'])>70 and raw(local(row['path']))==row['raw_sha256']
        assert pixels(local(row['path']))[0]==row['dimensions']
    expected={(kind,n,mode) for kind,count in zip(b.KINDS,[14,9,10]) for n in range(1,count+1) for mode in ['color','grayscale']}
    assert keys==expected
    for row in obs['figures']:
        assert raw(D/'_assets'/(row['stem']+'.svg'))==row['svg_raw_sha256']
        assert raw(D/'_assets'/(row['stem']+'.png'))==row['png_raw_sha256']
        assert raw(local(row['gray_path']))==row['gray_raw_sha256']
        assert row['personally_inspected_color'] and row['personally_inspected_grayscale'] and row['observation']
        assert pixels(D/'_assets'/(row['stem']+'.png'))==(row['dimensions'],row['rgb_sha256'])
    for m in obs['manifests']:
        assert raw(local(m['path']))==m['raw_sha256']
        for g in m['generation']:
            file=local(g['path']); assert raw(file)==g['raw_sha256']
            data=read(file)
            assert data['inspection_status']=='PENDING' and data['pages_inspected']==[]
            assert data['visible_student_defects'] is None and data['inspected_at_normal_reading_scale'] is False
            for name,h in data['page_sha256'].items(): assert raw(file.parent/'pages'/name)==h
    for r,h in probes['native_packet42'].items(): assert raw(D/r)==h
    assert len(probes['native_packet42'])==42
    for row in probes['raw_and_decoded_rgb_page_parity']:
        color=local(row['color_r17']); assert raw(color)==row['r14_r17_r18_r19_raw']
        assert pixels(color)==(row['dimensions'],row['rgb_sha256'])
    for row in source['old_pending_manifests']:
        data=read(P/row); assert data['inspection_status']=='PENDING' and data['pages_inspected']==[]
    moved=read(P/'reports/sprints'/(PRE+'-root-import-after.json'))['rows']; assert len(moved)==66
    for row in moved:
        assert raw(P/row['new_path'])==row['sha256']==sha(git(P,'show',row['source_commit']+':'+row['old_path']))
        assert not (P/row['old_path']).exists()
    return {'old_lesson_files':45,'old_sources_history_unchanged':7845,'root_coordination_exact_published_successors':7,'personal_images':96,'native_packet':42,'original_mapping':66,'old_pending':len(source['old_pending_manifests'])}

def baseline(head):
    assert re.fullmatch('[a-f0-9]{40}',head)
    paths=git(P,'diff','--name-only','-z','35e0bebb75cc3987c43dd8f480e1b444bd877f4a',head).decode().split('\0')
    imports=[]
    for name in filter(None,paths):
        assert name.startswith('reports/sprints/'+PRE+'-QC-') or re.fullmatch(r'reports/sprints/'+PRE+r'-build-(?:attempt|manifest)-r(?:17|18|19)\.json',name) or re.match(r'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/231-(?:paragraaf|opgaven|antwoorden)-[a-f0-9]{12}-r(?:17|18|19)/',name),name
        data=git(P,'show',head+':'+name); assert (P/name).read_bytes()==data,name
        imports.append({'path':name,'commit':head,'git_blob':git(P,'rev-parse',head+':'+name).decode().strip(),'sha256':sha(data)})
    changed=git(L,'diff','--name-only','-z','219a977e495abe43c17949e7d8996aab4176faa0',LCOMMIT).decode().split('\0')
    assert list(filter(None,changed))==[(b.LESSON_REL/QC).as_posix()]
    assert (D/QC).read_bytes()==git(L,'show',LCOMMIT+':'+(b.LESSON_REL/QC).as_posix())
    result=bindings(); folder=folder_snapshot(); assert len(folder)==46
    roots=[s[9:] for s in git(P,'worktree','list','--porcelain').decode().splitlines() if s.startswith('worktree ')]
    revisions=[]
    for root in roots:
        report=Path(root)/'reports'
        for sub in ['rendered-proof','sprints']:
            if not (report/sub).exists(): continue
            for f in (report/sub).rglob('*'):
                if not f.is_file(): continue
                relative=f.relative_to(Path(root)).as_posix()
                if '231' not in relative: continue
                for n in re.findall(r'(?:^|[-/])r([1-9][0-9]*)(?=[./-]|$)',relative): revisions.append({'root':root,'path':relative,'revision':int(n)})
                if 'reserv' in relative.lower() and f.suffix=='.json':
                    for n in re.findall(r'"r([1-9][0-9]*)"',f.read_text(encoding='utf-8-sig')): revisions.append({'root':root,'path':relative,'revision':int(n),'content':True})
    assert max(r['revision'] for r in revisions)==19
    save('baseline.json',{'source_platform':head,'source_lessons':LCOMMIT,'actual_platform':git(P,'rev-parse','HEAD').decode().strip(),'actual_lessons':git(L,'rev-parse','HEAD').decode().strip(),'imports':imports,'bindings':result,'folder46':folder,'registered_roots':roots,'revision_history':revisions,'reserved':['r20','r21','r22']})
    print(json.dumps({'PASS':True,'imports':len(imports),**result,'reserved':['r20','r21','r22']}),flush=True)

def parity(name,revisions):
    baseline=read(E/'baseline.json'); assert folder_snapshot()==baseline['folder46']
    result=bindings(); probe=read(str(Q)+'-probes-result.json'); pages=[]
    for n in revisions:
        m=read(manifest(n)); assert m['packet']==probe['native_packet42'] and m['inspection_status']=='PENDING'
        for item in m['input_sources']: assert raw(item['path'])==item['sha256']
        for kind,doc,count in zip(b.KINDS,m['documents'],[14,9,10]):
            proof=Path(doc['proof_directory']); generated=read(proof/'manifest.json')
            assert generated['inspection_status']=='PENDING' and generated['pages_inspected']==[]
            assert generated['visible_student_defects'] is None and generated['inspected_at_normal_reading_scale'] is False
            assert len(generated['page_sha256'])==count
            for page in range(1,count+1):
                old=next(r for r in probe['raw_and_decoded_rgb_page_parity'] if r['kind']==kind and r['page']==page)
                file=proof/'pages'/f'page-{page:03}.png'
                assert raw(file)==old['r14_r17_r18_r19_raw']==generated['page_sha256'][file.name]
                assert pixels(file)==(old['dimensions'],old['rgb_sha256'])
                pages.append({'revision':n,'kind':kind,'page':page,'sha256':raw(file),'rgb_sha256':old['rgb_sha256']})
    archives=[]
    for kind,expected in zip(b.KINDS,[19,11,17]):
        file=D/f'{b.STEM} – {kind}.zip'
        with ZipFile(file) as z:
            names=z.namelist(); assert len(names)==len(set(names))==expected and names==sorted(names) and z.testzip() is None
            for info in z.infolist():
                path=PurePosixPath(info.filename); assert not path.is_absolute() and '..' not in path.parts and '\\' not in info.filename and ':' not in info.filename
                value=z.read(info); assert value==(D/path).read_bytes() and len(value)==info.file_size and zlib.crc32(value)&0xffffffff==info.CRC
                assert info.date_time==(1980,1,1,0,0,0)
            archives.append({'kind':kind,'members':names,'sha256':raw(file)})
    for row in baseline['imports']: assert raw(P/row['path'])==row['sha256']
    save(name+'.json',{'status':'PASS','bindings':result,'revisions':revisions,'raw_rgb_pages':pages,'archives':archives,'folder46_unchanged':True,'imported_paths_unchanged':len(baseline['imports']),'root_personal_views_claimed':0})
    print(json.dumps({'status':'PASS','revisions':revisions,'pages':len(pages),'folder':46,'native':42}),flush=True)

mode=sys.argv[1]
if mode=='differences':
    source=read(str(Q)+'-reservation-and-baseline.json')
    differences=[]
    for rel,h in source['old_sources_and_history'].items():
        if raw(P/rel)!=h:
            differences.append({'path':rel,'specialist_baseline_sha256':h,'current_raw_sha256':raw(P/rel),'root_published_f257_sha256':sha(git(P,'show','f257056d0a455c660ccb598cb4da734b36eefd80:'+rel)),'source_baseline_35e0_sha256':sha(git(P,'show','35e0bebb75cc3987c43dd8f480e1b444bd877f4a:'+rel))})
    save('baseline-differences.json',{'diagnostic_only':True,'differences':differences})
    print(json.dumps(differences,indent=2))
elif mode=='baseline': baseline(sys.argv[2])
elif mode=='tests': run('tests-process',[PY,str(P/'build-scripts/content/book-2/231/test_source.py'),'--lesson-root',str(L)])
elif mode=='full':
    assert read(E/'baseline.json')['reserved']==['r20','r21','r22']
    (E/'native').mkdir(exist_ok=True)
    run('full-process',[PY,str(P/'build-scripts/content/book-2/b2_231.py'),'--lesson-root',str(L),'--proof-root',str(PROOF),'--proof-suffix','r20','--manifest',str(manifest(20))])
    parity('full-parity',[20])
elif mode=='verify':
    run('native-check-process',[PY,str(P/'build-scripts/content/book-2/231/check_render.py'),'--lesson-root',str(L),'--manifest',str(manifest(20))])
    run('reproduction-process',[PY,str(P/'build-scripts/content/book-2/231/verify_rebuild.py'),str(manifest(20)),str(E/'reproduction.json'),str(E/'grayscale-r20')])
    parity('reproduction-parity',[20,21,22])
elif mode=='gates':
    for profile in ['student-web','publisher-print']: run(profile+'-process',['node','scripts/validate-paragraph.js','--mode','part-a','--profile',profile,str(D)])
    run('currentness-process',['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','specialist_review','--paragraph','2.3.1'])
    run('durable-process',['node','build-scripts/workflows/check-book2-target-authority-remediation.js','--durable'])
    run('bundle-process',['node','build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1'])
elif mode=='gates-v2':
    for profile in ['student-web','publisher-print']: run_bytes(profile+'-v2-process',['node','scripts/validate-paragraph.js','--mode','part-a','--profile',profile,str(D)])
    run_bytes('currentness-v2-process',['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','specialist_review','--paragraph','2.3.1'])
    run_bytes('durable-v2-process',['node','build-scripts/workflows/check-book2-target-authority-remediation.js','--durable'])
    run_bytes('bundle-v2-process',['node','build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1'])
elif mode=='integrity': parity('final-integrity',[20,21,22])
else: raise ValueError(mode)
