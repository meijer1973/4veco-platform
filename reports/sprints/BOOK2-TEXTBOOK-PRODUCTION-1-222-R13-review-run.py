"""Independent bounded paragraph diagnostics; no automated visual acceptance."""
import datetime, hashlib, json, os, re, subprocess, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
assert ROOT == Path('C:/wt/book2-222-r13-review-20260905/4veco-platform')
E = ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-R13-review-evidence'
E.mkdir(exist_ok=True)
LESSONS = ROOT.parent/'4veco-lessen'
REL = Path('Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet')
PAR = LESSONS/REL
PY = 'C:/Python314/python.exe'
BASE = 'ed3f15849303ba0ed1c87763c2535f3233656160'
LB = '800c3540b15787aecec2e782e6da9b960664cadb'
OLD = 'ca05ec784838617f7a11c0b33d0b53e1a2fb7f29'
OLDL = '6362d2596b20c3e28184d8b6a1a74cb6c901d7f0'
def sha(data): return hashlib.sha256(data).hexdigest()
def put(name,data): (E/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def decode(data):
    try: return data.decode('utf-8')
    except UnicodeDecodeError: return data.decode('cp1252')
def run(argv,cwd=ROOT,required=True,env=None,content_bytes=False):
    start=datetime.datetime.now(datetime.timezone.utc).isoformat()
    r=subprocess.run(argv,cwd=cwd,env={**os.environ,**(env or {})},capture_output=True)
    item=dict(argv=argv,cwd=str(cwd),environment_overrides=env or {},path_policy='inherited unchanged',started=start,
      ended=datetime.datetime.now(datetime.timezone.utc).isoformat(),exit_code=r.returncode,
      stdout='[content bytes bound by SHA256]' if content_bytes else decode(r.stdout),stderr=decode(r.stderr),
      stdout_sha256=sha(r.stdout),stderr_sha256=sha(r.stderr))
    with (E/'commands.jsonl').open('a',encoding='utf-8',newline='\n') as f: f.write(json.dumps(item,ensure_ascii=False)+'\n')
    print(json.dumps(dict(argv=argv,exit_code=r.returncode),ensure_ascii=True),flush=True)
    if required: assert r.returncode==0,item
    return r
def blob(base,path,cwd=ROOT): return run(['git','show',base+':'+str(path).replace('\\','/')],cwd,content_bytes=True).stdout
def snapshot(): return {str(p.relative_to(LESSONS)).replace('\\','/'):sha(p.read_bytes()) for p in PAR.rglob('*') if p.is_file()}
def manifest():
    sys.path.insert(0,str(ROOT/'build-scripts/content/book-2/222'))
    from check_render import relocate_manifest
    return relocate_manifest(json.loads((ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-build-r13.json').read_text(encoding='utf-8')),LESSONS)
if __name__=='__main__':
    mode=sys.argv[1]
    if mode=='pass0':
        from bs4 import BeautifulSoup
        import xml.etree.ElementTree as ET
        data=manifest(); bindings={}; images=[]
        for s in data['input_sources']:
            p=Path(s['path']); assert p.is_relative_to(ROOT); assert sha(p.read_bytes())==s['sha256']; bindings[str(p)]=s['sha256']
        for d in data['documents']:
            for k,h in [('source_md','source_sha256'),('source_html','html_sha256'),('source_pdf','pdf_sha256')]:
                p=Path(d[k]); assert p.is_relative_to(PAR); assert sha(p.read_bytes())==d[h]; bindings[str(p)]=d[h]
            for a in d['assets']:
                p=Path(a['path']); assert p.is_relative_to(PAR); assert sha(p.read_bytes())==a['sha256']; bindings[str(p)]=a['sha256']
            proof=Path(d['proof_directory']); assert proof.is_relative_to(ROOT)
            p=proof/'manifest.json'; m=json.loads(p.read_text(encoding='utf-8')); bindings[str(p)]=sha(p.read_bytes())
            assert m['inspection_status']=='PENDING' and m['pages_inspected']==[] and m['pdf_sha256']==d['pdf_sha256']
            for name in m['rendered_pages']:
                p=proof/name; assert sha(p.read_bytes())==m['page_sha256'][p.name]; bindings[str(p)]=sha(p.read_bytes())
            md=Path(d['source_md']).read_text(encoding='utf-8')
            for path in re.findall(r'!\[[^\]]*\]\(([^)]+)\)',md): assert (PAR/path).is_file(),path
            soup=BeautifulSoup(Path(d['source_html']).read_text(encoding='utf-8'),'html.parser')
            for img in soup.find_all('img'):
                assert img.get('src','').startswith('data:image/png;base64,') and img.get('alt')
                images.append(dict(edition=Path(d['source_html']).stem,alt=img['alt'],length=len(img['alt'])))
        for p in [PAR/'build_pdf.py',PAR/'2.2.2-textbook-plan.md',PAR.parent/'_chapter-plan.md']:
            assert p.is_file(); bindings[str(p)]=sha(p.read_bytes())
        sys.path.insert(0,str(ROOT/'build-scripts/content/book-2'))
        import b2_222 as b
        target=b.target_record(); assert b.lf_hash(PAR/'2.2.2-textbook-plan.md')==b.PLAN_HASH and b.lf_hash(PAR.parent/'_chapter-plan.md')==b.CHAPTER_HASH
        assert sha((PAR/'2.2.2-review.md').read_bytes())=='d8c01a53362386143557666e1b6a9d3157a166d69330fba56a0ac48e7a88a9e1'
        put('pass0.json',dict(status='PASS',bindings=bindings,actual_image_alts=images,target=target))
        put('before.json',snapshot()); put('diagnostic-manifest.json',data)
    elif mode=='build':
        assert json.loads((E/'pass0.json').read_text(encoding='utf-8'))['status']=='PASS'
        run([PY,'build-scripts/content/book-2/222/test_source.py','-v'])
        run([PY,'build-scripts/content/book-2/b2_222.py','--lesson-root',str(LESSONS),'--manifest',str(E/'full-build.json')])
        run([PY,'build-scripts/content/book-2/222/check_render.py','--lesson-root',str(LESSONS),'--manifest',str(E/'diagnostic-manifest.json'),'--rebuild','--output',str(E/'render-check.json')])
        assert snapshot()==json.loads((E/'before.json').read_text(encoding='utf-8')); put('after-rebuild.json',snapshot())
    elif mode=='pages':
        for kind in ('paragraaf','opgaven','antwoorden'):
            folder=E/kind; folder.mkdir(exist_ok=True)
            run(['pdftoppm','-r','150','-png',str(PAR/f'2.2.2 Elasticiteit en omzet – {kind}.pdf'),str(folder/'page')])
        for n in (2,3,4,6):
            run(['pdftoppm','-r','150','-gray','-png','-f',str(n),'-l',str(n),'-singlefile',str(PAR/'2.2.2 Elasticiteit en omzet – paragraaf.pdf'),str(E/f'gray-p{n}')])
    elif mode in ('gates-before','gates-after'):
        for profile in ('student-web','publisher-print'):
            r=run(['node','scripts/validate-paragraph.js','--mode','part-a','--profile',profile,str(PAR)],required=mode=='gates-after')
            if mode=='gates-before': assert r.returncode==1 and 'FAIL' in decode(r.stdout)
        run(['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.2.2'])
        run(['node','build-scripts/workflows/check-book2-target-authority-remediation.js','--durable'])
    elif mode=='scope':
        ph=decode(run(['git','rev-parse','HEAD']).stdout).strip(); lh=decode(run(['git','rev-parse','HEAD'],LESSONS).stdout).strip()
        record=dict(platform_head=ph,lesson_head=lh,comparisons=[])
        for cwd,base,lane,head in [(ROOT,OLD,'shared',ph),(LESSONS,OLDL,'textbook',lh)]:
            argv=['node','build-scripts/workflows/check-paragraph-lane-scope.js','--lane',lane,'--base',base,'--head',head,'--json']
            if cwd==LESSONS: argv+=['--cwd',str(LESSONS)]
            r=run(argv); record['comparisons'].append(json.loads(decode(r.stdout)))
        for cwd,base in [(ROOT,BASE),(LESSONS,LB)]:
            paths=decode(run(['git','-c','core.quotepath=false','diff','--name-only',base,'HEAD'],cwd).stdout).splitlines()
            if cwd==ROOT: assert all(p.startswith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-R13-review') or p.startswith('reports/github-agent-index-') for p in paths),paths
            else: assert paths==[str(REL/'2.2.2-review.md').replace('\\','/')],paths
            record[str(cwd)+'_own_delta']=paths
        put('committed-scope.json',record)
    else: raise ValueError(mode)
