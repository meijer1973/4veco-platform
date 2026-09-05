"""Owned independent specialist diagnostics; no automated visual acceptance."""
from pathlib import Path
import datetime, hashlib, json, os, re, subprocess, sys

ROOT = Path(__file__).resolve().parents[2]
assert ROOT == Path('C:/wt/book2-222-r13-qc-20260905/4veco-platform')
L = ROOT.parent/'4veco-lessen'
REL = Path('Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet')
P = L/REL
E = ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-R13-QC-evidence'
E.mkdir(exist_ok=True)
BASE = '0436a9fe8d8da3bd385add8ecd195d2c05ed2f10'
LB = '8cad0b8e99371f33692793f533782654776f6b68'
PY = 'C:/Python314/python.exe'
def sha(b): return hashlib.sha256(b).hexdigest()
def norm(s): return re.sub(r'\s+', ' ', s).strip()
def put(name, value):
    path=E/name
    assert not path.exists(), 'Do not overwrite evidence: '+name
    path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def dec(b):
    try: return b.decode('utf-8')
    except UnicodeDecodeError: return b.decode('cp1252',errors='backslashreplace')
def run(argv,cwd=ROOT,required=True,env=None,binary=False):
    t=datetime.datetime.now(datetime.timezone.utc).isoformat()
    r=subprocess.run(argv,cwd=cwd,env={**os.environ,**(env or {})},capture_output=True)
    row=dict(argv=list(map(str,argv)),cwd=str(cwd),environment_overrides=env or {},inherited_PATH=os.environ['PATH'],started=t,
        ended=datetime.datetime.now(datetime.timezone.utc).isoformat(),exit_code=r.returncode,
        stdout='[content bytes; exact SHA256 below]' if binary else dec(r.stdout),stderr=dec(r.stderr),
        stdout_sha256=sha(r.stdout),stderr_sha256=sha(r.stderr))
    with (E/'commands.jsonl').open('a',encoding='utf-8',newline='\n') as f: f.write(json.dumps(row,ensure_ascii=False)+'\n')
    print(json.dumps(dict(argv=row['argv'],exit_code=r.returncode)),flush=True)
    if required: assert r.returncode==0,row
    return r
def blob(base,path,cwd=ROOT): return run(['git','show',base+':'+str(path).replace('\\','/')],cwd,binary=True).stdout
def snapshot(): return {str(p.relative_to(L)).replace('\\','/'):sha(p.read_bytes()) for p in P.rglob('*') if p.is_file()}
def manifest():
    sys.path.insert(0,str(ROOT/'build-scripts/content/book-2/222'))
    from check_render import relocate_manifest
    return relocate_manifest(json.loads((ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-build-r13.json').read_text(encoding='utf-8')),L)

def pass0():
    from bs4 import BeautifulSoup
    m=manifest(); bindings={}; pages=[]
    for s in m['input_sources']:
        p=Path(s['path']); assert p.is_relative_to(ROOT) and sha(p.read_bytes())==s['sha256']; bindings[str(p)]=s['sha256']
    for d in m['documents']:
        for key,h in [('source_md','source_sha256'),('source_html','html_sha256'),('source_pdf','pdf_sha256')]:
            p=Path(d[key]); assert p.is_relative_to(P) and sha(p.read_bytes())==d[h]; bindings[str(p)]=d[h]
        for a in d['assets']:
            p=Path(a['path']); assert p.is_relative_to(P) and sha(p.read_bytes())==a['sha256']; bindings[str(p)]=a['sha256']
        proof=Path(d['proof_directory']); assert proof.is_relative_to(ROOT)
        p=proof/'manifest.json'; data=json.loads(p.read_text(encoding='utf-8')); bindings[str(p)]=sha(p.read_bytes())
        assert data['inspection_status']=='PENDING' and data['pages_inspected']==[] and data['pdf_sha256']==d['pdf_sha256']
        for rel in data['rendered_pages']:
            p=proof/rel; assert sha(p.read_bytes())==data['page_sha256'][p.name]
            bindings[str(p)]=sha(p.read_bytes()); pages.append(str(p))
        md=Path(d['source_md']).read_text(encoding='utf-8')
        for rel in re.findall(r'!\[[^\]]*\]\(([^)]+)\)',md): assert (P/rel).is_file()
        for img in BeautifulSoup(Path(d['source_html']).read_text(encoding='utf-8'),'html.parser').find_all('img'):
            assert img.get('alt') and img['src'].startswith('data:image/png;base64,')
    assert len(pages)==21
    for p in [P/'build_pdf.py',P/'2.2.2-textbook-plan.md',P.parent/'_chapter-plan.md',P/'2.2.2-review.md',P/'2.2.2-quality-ref.yaml']:
        bindings[str(p)]=sha(p.read_bytes())
    assert bindings[str(P/'2.2.2-review.md')]=='9122a962d5108565a631d6cd51b1945ab0ddb1ef78c2b979cca15ac59010f01a'
    data=json.loads((ROOT/'references/authored/course-target-exercises.json').read_text(encoding='utf-8-sig'))
    target=next(r for r in data['exercises'] if r['id']=='2.2.2')
    h=sha(json.dumps(target,ensure_ascii=False,separators=(',',':')).encode())
    assert h=='8ce56143aef61b0e67aae5b179f6e5f3fe547192bc776a42c43101cb5a70fa2e'
    assert [q['points'] for q in target['target_exercise']['subquestions']]==[2,2,2,2,2,1]
    for p,expected in [(P/'2.2.2-textbook-plan.md','6418491d45c43afdbd272c581bab12f8436ca1a84241663ba300e31b790825a8'),(P.parent/'_chapter-plan.md','3a9db97518b1948eb0967d94653a10c693a0ca001e20b41503b864fd4cc7c2f7')]:
        assert sha(p.read_text(encoding='utf-8-sig').encode())==expected
    put('pass0.json',dict(status='PASS',actor='paragraph_221_r8_independent_review',role='specialist QC',platform_base=BASE,lesson_base=LB,bindings=bindings,target=target,target_hash=h))
    put('before.json',snapshot()); put('diagnostic-manifest.json',m)

def build():
    assert json.loads((E/'pass0.json').read_text(encoding='utf-8'))['status']=='PASS'
    run(['npm.cmd','ci','--ignore-scripts'])
    run([PY,'build-scripts/content/book-2/222/test_source.py','-v'])
    run([PY,'build-scripts/content/book-2/b2_222.py','--lesson-root',str(L),'--manifest',str(E/'full-build.json')])
    run([PY,'build-scripts/content/book-2/222/check_render.py','--lesson-root',str(L),'--manifest',str(E/'diagnostic-manifest.json'),'--rebuild','--output',str(E/'render-check.json')])
    assert snapshot()==json.loads((E/'before.json').read_text(encoding='utf-8'))
    put('after-rebuild.json',snapshot())

def pages():
    for kind in ('paragraaf','opgaven','antwoorden'):
        dest=E/kind; dest.mkdir(exist_ok=True)
        run(['pdftoppm','-r','150','-png',str(P/f'2.2.2 Elasticiteit en omzet – {kind}.pdf'),str(dest/'page')])
    for n in (2,3,4,6):
        run(['pdftoppm','-r','150','-gray','-png','-f',str(n),'-l',str(n),'-singlefile',str(P/'2.2.2 Elasticiteit en omzet – paragraaf.pdf'),str(E/f'gray-p{n}')])

def gates():
    for profile in ('student-web','publisher-print'):
        run(['node','scripts/validate-paragraph.js','--mode','part-a','--profile',profile,str(P)])
    for action in ('specialist_review','paragraph_production'):
        run(['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action',action,'--paragraph','2.2.2'])
    run(['node','build-scripts/workflows/check-book2-target-authority-remediation.js','--durable'])

def scope():
    ph=dec(run(['git','rev-parse','HEAD']).stdout).strip(); lh=dec(run(['git','rev-parse','HEAD'],L).stdout).strip()
    record=dict(platform_head=ph,lesson_head=lh,comparisons=[])
    for cwd,base,lane,head in [(ROOT,'ca05ec784838617f7a11c0b33d0b53e1a2fb7f29','shared',ph),(L,'6362d2596b20c3e28184d8b6a1a74cb6c901d7f0','textbook',lh)]:
        args=['node','build-scripts/workflows/check-paragraph-lane-scope.js','--lane',lane,'--base',base,'--head',head,'--json']
        if cwd==L: args+=['--cwd',str(L)]
        record['comparisons'].append(json.loads(dec(run(args).stdout)))
    for cwd,base in [(ROOT,BASE),(L,LB)]:
        paths=dec(run(['git','-c','core.quotepath=false','diff','--name-only',base,'HEAD'],cwd).stdout).splitlines()
        if cwd==ROOT: assert all(p.startswith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-R13-QC') or p.startswith('reports/github-agent-index-') for p in paths),paths
        else: assert paths==[str(REL/'2.2.2-quality-ref.yaml').replace('\\','/')] or paths==[],paths
        record[str(cwd)+'_own_delta']=paths
    put('committed-scope.json',record)

if __name__=='__main__':
    globals()[sys.argv[1]]()
