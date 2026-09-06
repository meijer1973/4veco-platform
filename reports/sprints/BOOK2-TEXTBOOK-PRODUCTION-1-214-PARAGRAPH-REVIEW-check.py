"""Independent §214 review evidence. No source repair or acceptance.

HOW TO ADAPT: original source is immutable; fresh named reports only. Native
routes are real CLI children in the inherited runtime. All parity is strict.
"""
import argparse, hashlib, io, json, os, re, subprocess, sys, datetime
from pathlib import Path
sys.dont_write_bytecode=True
P=Path(__file__).resolve().parents[2];L=P.parent/'4veco-lessen'
PRE='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-PARAGRAPH-REVIEW-'
A='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-BUILD-CURRENT-'
BP='5cd6a5ac7a04cf452172f3f1a68c71c0ad4f7237';BL='3bc9e81828dcc57932dc871825aaa4cf4a975fe1'
BR='agent/book2-214-paragraph-review-20260906'
sys.path.insert(0,str(P/'build-scripts/content/book-2'))
import b2_214 as b
sha=b.sha;raw=b.raw
def js(p):return json.loads(raw(p))
def git(root,*argv,input=None):return subprocess.check_output(['git',*argv],cwd=root,input=input)
def save(name,data):
    p=P/(PRE+name+'.json')
    with p.open('x',encoding='utf-8',newline='\n') as f:json.dump(data,f,ensure_ascii=False,indent=2);f.write('\n')
    print(json.dumps({'record':p.name,'sha256':sha(raw(p)),'status':data.get('status')}))
def env():
    e=dict(os.environ)
    e.update(PYTHONDONTWRITEBYTECODE='1',PYTHONIOENCODING='utf-8')
    for kind,root in [('PLATFORM',P),('LESSEN',L)]:
        assert git(root,'branch','--show-current').decode().strip()==BR
        e.update({f'FOURVECO_{kind}_ROOT':str(root),f'FOURVECO_{kind}_SOURCE_REF':git(root,'rev-parse','HEAD').decode().strip(),f'FOURVECO_{kind}_SOURCE_BRANCH':BR})
    return e
def native_exact():
    rows=js(P/(A+'native-parity.json'))['current_native']
    assert len(rows)==15
    for r in rows:
        data=raw(L/r['path']);assert sha(data)==r['sha256'] and len(data)==r['bytes'],r['path']
        assert data==git(L,'show',BL+':'+r['path']),r['path']
    return rows
def custody(name):
    result=[]
    for root,ref in [(P,BP),(L,BL)]:
        stream=git(root,'ls-tree','-r','-z',ref)
        tree={v.split(b'\t',1)[1].decode():v.split(b'\t',1)[0].split()[2].decode() for v in stream.split(b'\0') if v}
        excluded={n for n in tree if root==P and n in ['repo-file-index.json','repo-file-index.md','cross-repo-file-index.json','cross-repo-file-index.md']}
        if root==L:excluded|={b.LESSON_REL+'/2.1.4-review.md'}
        names=sorted(set(tree)-excluded)
        lines=('\n'.join(json.dumps(n,ensure_ascii=False) for n in names)+'\n').encode()
        actual=git(root,'-c','core.longpaths=true','hash-object','--no-filters','--stdin-paths',input=lines).decode().splitlines()
        assert len(actual)==len(names)
        differences=[n for n,h in zip(names,actual) if h!=tree[n]]
        assert not differences,differences
        result.append({'repository':root.name,'base':ref,'files':len(names),'tree_NUL_sha256':sha(stream),'excluded':sorted(excluded),'filename_and_expected_blob_digest':sha(json.dumps([(n,tree[n]) for n in names],ensure_ascii=False,separators=(',',':')).encode()),'actual_blob_sequence_sha256':sha(('\n'.join(actual)+'\n').encode()),'all_prior_raw_Git_exact':True})
    native=native_exact()
    manifest=P/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-output-manifest.md'
    assert sha(raw(manifest))=='0417edf8efc7e1f9169d5456b52216801ea8138a28a521fc6dea5e041c94b372'
    save(name,{'status':'PASS','actor':'paragraph_214_builder','custody':result,'native':native,'root_output_manifest_sha256':sha(raw(manifest)),'root_acceptance':'PENDING'})
def preflight():
    native=native_exact();docs=b.documents(b.target_record());b.verify_native_derivation(L,docs,b.load_owned('figures').asset_sources(),require_png=True)
    base=L/b.LESSON_REL
    refs=[]
    for ed,md in docs.items():
        found=re.findall(r'!\[[^\]]*\]\(([^)]+)\)',md)
        assert len(found)==2
        for rel in found:
            p=base/rel;assert p.exists() and p.with_suffix('.png').exists()
            assert re.fullmatch('2[.]1[.]4_ex_[1-4][.]svg',p.name)
        refs.extend(found)
    assert len(set(refs))==4
    all_assets=[str(p.relative_to(base)) for p in (base/'_assets').iterdir() if p.is_file()]
    commissioned=set(refs)|{n.replace('.svg','.png') for n in refs}
    legacy=[n for n in all_assets if n.replace('\\','/') not in commissioned]
    save('pass0',{'status':'PASS','selected_native_count':len(native),'selected_MD_refs':refs,'all_selected_pairs_complete':True,'legacy_excluded_assets':legacy,'scope':'Approved two-edition15-file current contract; no legacy promotion/deletion'})
def scan(rev,route):
    dest=P/(PRE+rev+'-'+route)
    n=b.namespace_check(dest,rev)
    save('scan-next-'+route,{'status':'PASS','namespace':n,'actor':'paragraph_214_builder','task':'BOOK2-TEXTBOOK-PRODUCTION-1-214-PARAGRAPH-REVIEW','branch':BR})
def native(rev,route):
    n=js(P/(PRE+'scan-next-'+route+'.json'))['namespace'];dest=Path(n['proof_root'])
    assert n['requested']==int(rev[1:])
    assert not dest.exists() and not Path(n['reservation']).exists()
    # Original generator performs a second global scan immediately before reserve.
    native_exact();e=env();anchor=git(P,'rev-parse','HEAD').decode().strip()
    common=['--lessons-root',str(L),'--proof-root',str(dest),'--proof-suffix',rev]
    if route=='full':argv=[sys.executable,'-B','build-scripts/content/book-2/b2_214.py',*common]
    elif route=='thin':argv=[sys.executable,'-B',str(L/b.LESSON_REL/'build_pdf.py'),'--platform-root',str(P),*common]
    elif route=='direct':argv=[sys.executable,'-B','build-scripts/content/book-2/214/direct_print.py',*common]
    else:argv=[sys.executable,'-B','build-scripts/content/book-2/214/check_render.py',*common,'--rebuild','--output',str(P/(PRE+'native-check-'+rev+'.json'))]
    invocation={'actor':'paragraph_214_builder','task':'BOOK2-TEXTBOOK-PRODUCTION-1-214-PARAGRAPH-REVIEW','controller_commit':anchor,'argv':argv,'cwd':str(P),'PATH':e['PATH'],'PATH_inherited_unchanged':True,'paired':{k:v for k,v in e.items() if k.startswith('FOURVECO_')},'start':datetime.datetime.now(datetime.timezone.utc).isoformat()}
    save('invocation-before-'+route,invocation)
    r=subprocess.run(argv,cwd=P,env=e,capture_output=True)
    save('process-'+rev,{**invocation,'exit_code':r.returncode,'stdout':r.stdout.decode('utf-8','replace'),'stderr':r.stderr.decode('utf-8','replace'),'finish':datetime.datetime.now(datetime.timezone.utc).isoformat()})
    assert r.returncode==0
    native_exact()
    current=js(dest/'author-run.json');reference=js(P/(A+'native-parity.json'))['runs'][0]['pages']
    from PIL import Image
    pages=[]
    for proof in current['proofs']:
        assert proof['inspection_status']=='PENDING' and proof['pages_inspected']==[]
        folder=dest/proof['artifact_id'];assert js(folder/'manifest.json')==proof
        ed='antwoorden' if 'antwoorden' in proof['artifact_id'] else 'opgaven'
        for i,rel in enumerate(proof['rendered_pages'],1):
            f=folder/rel;data=raw(f)
            with Image.open(io.BytesIO(data)) as im:
                rgb=im.convert('RGB');pages.append({'edition':ed,'page':i,'size':list(rgb.size),'file_sha256':sha(data),'RGB_sha256':sha(rgb.tobytes()),'gray_RGB_sha256':sha(rgb.convert('L').convert('RGB').tobytes())})
    pages.sort(key=lambda x:(x['edition'],x['page']));assert pages==reference
    if route=='checker':assert js(P/(PRE+'native-check-'+rev+'.json'))==js(P/(A+'native-check-r46.json'))
    save('parity-'+rev,{'status':'PASS','actor':'paragraph_214_builder','route':route,'native_files':15,'pages':pages,'author_run_sha256':sha(raw(dest/'author-run.json')),'original_native_role_string':current['role'],'role_boundary':'Unchanged primitive native proof class, not author identity or reviewer acceptance','PENDING_preserved':True,'same_engine_checker':route=='checker'})
def views(rev,route):
    from PIL import Image
    dest=P/(PRE+rev+'-'+route);record=js(dest/'author-run.json');out=P/(PRE+'views');assert not out.exists();out.mkdir()
    rows=[]
    for proof in record['proofs']:
        ed='antwoorden' if 'antwoorden' in proof['artifact_id'] else 'opgaven'
        for i,rel in enumerate(proof['rendered_pages'],1):rows.append({'kind':'page','edition':ed,'page':i,'color':str(dest/proof['artifact_id']/rel),'gray':str(out/f'{ed}-{i:02d}-gray.png')})
    for i in range(1,5):rows.append({'kind':'figure','figure':i,'color':str(L/b.LESSON_REL/'_assets'/f'2.1.4_ex_{i}.png'),'gray':str(out/f'figure-{i}-gray.png')})
    for row in rows:
        with Image.open(io.BytesIO(raw(row['color']))) as im:
            rgb=im.convert('RGB');gray=rgb.convert('L').convert('RGB');gray.save(row['gray'])
            row.update(color_RGB_sha256=sha(rgb.tobytes()),gray_RGB_sha256=sha(gray.tobytes()),size=list(rgb.size))
        row.update(color_sha256=sha(raw(row['color'])),gray_sha256=sha(raw(row['gray'])))
    save('view-inventory',{'status':'READY_FOR_PERSONAL_INSPECTION_NOT_VERDICT','rows':rows,'actual_views_yet':0})
parser=argparse.ArgumentParser();parser.add_argument('mode');parser.add_argument('--name');parser.add_argument('--revision');parser.add_argument('--route');args=parser.parse_args()
if args.mode=='custody':custody(args.name)
elif args.mode=='pass0':preflight()
elif args.mode=='scan':scan(args.revision,args.route)
elif args.mode=='native':native(args.revision,args.route)
elif args.mode=='views':views(args.revision,args.route)
else:raise ValueError(args.mode)
