"""Owned independent paragraph-review diagnostics, never visual acceptance.

HOW TO ADAPT: create a new exact baseline and prefix; keep failed evidence and
historical native proof untouched. This file does not change source or gates.
"""
from pathlib import Path
import ast, base64, datetime, hashlib, json, math, os, re, subprocess, sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
assert ROOT == Path('C:/wt/book2-211-r5-review-20260905/4veco-platform')
L = ROOT.parent / '4veco-lessen'
REL = Path('Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren')
P = L / REL
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW'
E = ROOT / 'reports/sprints' / (PREFIX + '-evidence')
E.mkdir(exist_ok=True)
BASE = 'bac19f0f29d5493588a161f3182f33b731eee7d9'
LB = '45064bdfe0c1548f25f097eef648400382403cdf'
R4P = '2bf6260c5d4d799c5408f898d0dab126eff9e5ac'
R4L = '917115c8da631d65eefbdb1f15c13b2291cd9e1d'
R3P = '441b7e7013c74fb80da55d88f84223d233bac6a8'
R3L = 'e1170dfc450400040339f96d18e43c0b60bd029d'
PY = 'C:/Python314/python.exe'
sys.path.insert(0, str(ROOT / 'build-scripts/content/book-2'))
import b2_211 as b
from print_pipeline import build_document, verify_record_freshness

def sha(raw): return hashlib.sha256(raw).hexdigest()
def norm(s): return re.sub(r'\s+', ' ', s).strip()
def compact(s): return re.sub(r'\s+', '', s)
def dec(raw):
    try: return raw.decode('utf-8')
    except UnicodeDecodeError: return raw.decode('cp1252', errors='backslashreplace')
def put(name, value):
    with (E / name).open('x', encoding='utf-8', newline='\n') as f:
        f.write(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
def run(argv, cwd=ROOT, required=True, binary=False):
    started = datetime.datetime.now(datetime.timezone.utc).isoformat()
    result = subprocess.run(list(map(str, argv)), cwd=cwd, capture_output=True)
    row = dict(argv=list(map(str, argv)), cwd=str(cwd), started=started,
               ended=datetime.datetime.now(datetime.timezone.utc).isoformat(),
               exit_code=result.returncode, inherited_PATH=os.environ['PATH'],
               stdout='[binary content]' if binary else dec(result.stdout), stderr=dec(result.stderr),
               stdout_sha256=sha(result.stdout), stderr_sha256=sha(result.stderr))
    with (E / 'commands.jsonl').open('a', encoding='utf-8', newline='\n') as f:
        f.write(json.dumps(row, ensure_ascii=False) + '\n')
    print(json.dumps(dict(argv=row['argv'], exit_code=result.returncode)), flush=True)
    if required: assert result.returncode == 0, row
    return result
def blob(ref, path, cwd=ROOT): return run(['git', 'show', ref + ':' + str(path).replace('\\','/')], cwd, binary=True).stdout
def snapshot(): return {str(p.relative_to(L)).replace('\\','/'): sha(p.read_bytes()) for p in P.rglob('*') if p.is_file()}
def relocate(value):
    if isinstance(value, dict): return {k: relocate(v) for k,v in value.items()}
    if isinstance(value, list): return [relocate(v) for v in value]
    if isinstance(value, str):
        for repo, root in [('4veco-platform', ROOT), ('4veco-lessen', L)]:
            token = '/' + repo + '/'
            s = value.replace('\\','/')
            if token in s and re.match(r'^[A-Za-z]:/', s): return str(root / s.split(token,1)[1])
    return value
def manifest(): return json.loads((E/'diagnostic-manifest.json').read_text(encoding='utf-8'))
def tree(node):
    if isinstance(node,str): return norm(node)
    return [node.name,dict(node.attrs),[tree(c) for c in node.children if not isinstance(c,str) or c.strip()]]

def pass0():
    from bs4 import BeautifulSoup
    old = ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-211-BONUS-build-r5.json'
    m = relocate(json.loads(old.read_text(encoding='utf-8')))
    bindings = {str(old): sha(old.read_bytes())}; native=set(); pages=[]; images=set()
    for s in m['input_sources']:
        p=Path(s['path']); assert p.is_relative_to(ROOT) and sha(p.read_bytes())==s['sha256']; bindings[str(p)]=s['sha256']
    for d in m['documents']:
        verify_record_freshness(d)
        for key,h in [('source_md','source_sha256'),('source_html','html_sha256'),('source_pdf','pdf_sha256')]:
            p=Path(d[key]); assert p.is_relative_to(P) and sha(p.read_bytes())==d[h]
            bindings[str(p)]=d[h]; native.add(str(p))
        for a in d['assets']:
            p=Path(a['path']); assert p.is_relative_to(P) and sha(p.read_bytes())==a['sha256']; native.add(str(p)); bindings[str(p)]=a['sha256']
        for relative in re.findall(r'!\[[^\]]*\]\(([^)]+)\)',Path(d['source_md']).read_text(encoding='utf-8')):
            p=P/relative; assert p.is_file() and p.with_suffix('.png').is_file(); images.add(p.stem)
        soup=BeautifulSoup(Path(d['source_html']).read_text(encoding='utf-8'),'html.parser')
        assert all(i.get('alt') and i['src'].startswith('data:image/png;base64,') for i in soup.find_all('img'))
        proof=Path(d['proof_directory']); assert proof.is_relative_to(ROOT)
        mp=proof/'manifest.json'; data=json.loads(mp.read_text(encoding='utf-8'))
        assert data['inspection_status']=='PENDING' and data['pages_inspected']==[] and data['pdf_sha256']==d['pdf_sha256']
        bindings[str(mp)]=sha(mp.read_bytes())
        for relative in data['rendered_pages']:
            p=proof/relative; assert sha(p.read_bytes())==data['page_sha256'][p.name]
            bindings[str(p)]=sha(p.read_bytes()); pages.append(str(p))
    assert len(native)==21 and len(pages)==31 and len(images)==6
    assert images=={p.stem for p in (P/'_assets').glob('*.svg')}=={p.stem for p in (P/'_assets').glob('*.png')}
    assert all(re.fullmatch(r'2\.1\.1_(fig|we|ex)_\d',n) for n in images)
    record=b.target_record(); assert len(record['lesson_goals'])==4
    assert [q['points'] for q in record['target_exercise']['subquestions']]==[4,3,3,3,4]
    assert b.lf_hash(P/'2.1.1-textbook-plan.md')==b.PLAN_HASH and b.lf_hash(P.parent/'_chapter-plan.md')==b.CHAPTER_HASH
    for p in [P/'build_pdf.py',P/'2.1.1-textbook-plan.md',P.parent/'_chapter-plan.md',P/'2.1.1-review.md',P/'2.1.1-quality-ref.yaml',P/'2.1.1-textbook-handoff.md']:
        bindings[str(p)]=sha(p.read_bytes())
    assert bindings[str(P/'2.1.1-review.md')]=='92b4a9462caf8316274fb58f8beef5c850147c44e6bf80b9a28fad442d9dbe96'
    archive=P/f'{b.STEM} – opgaven.zip'
    assert archive.read_bytes()==blob(R4L,archive.relative_to(L),L)
    assert not re.search(r'zipfile|make_archive|\.zip', (ROOT/'build-scripts/content/book-2/b2_211.py').read_text(encoding='utf-8'))
    put('pass0.json',dict(status='PASS',actor='paragraph_221_r8_independent_review',role='independent paragraph reviewer',platform_base=BASE,lessons_base=LB,bindings=bindings,native_files=sorted(native),pages=pages,target=record,target_record_sha256=b.TARGET_HASH,legacy_zip=dict(sha256=sha(archive.read_bytes()),unchanged=True,current_deliverable=False)))
    put('before.json',snapshot()); put('diagnostic-manifest.json',m)

def build():
    assert json.loads((E/'pass0.json').read_text(encoding='utf-8'))['status']=='PASS'
    run(['npm.cmd','ci','--ignore-scripts'])
    run([PY,'-m','unittest','discover','-s','build-scripts/content/book-2/211','-p','test_*.py','-v'])
    run([PY,'build-scripts/content/book-2/b2_211.py','--lesson-root',L,'--manifest',E/'full-build.json'])
    run([PY,'build-scripts/content/book-2/211/check_render.py'])
    assert snapshot()==json.loads((E/'before.json').read_text(encoding='utf-8')), 'full native drift'
    for d in manifest()['documents']: run([PY,'build-scripts/content/book-2/print_pipeline.py',d['source_md']])
    for d in manifest()['documents']: verify_record_freshness(d)
    assert snapshot()==json.loads((E/'before.json').read_text(encoding='utf-8')), 'print-only drift'
    put('rebuild.json',dict(full_native_identical=True,print_only_native_identical=True,native_file_count=21,all_paragraph_files=snapshot(),checker_has_rebuild_flag=False))

def captures():
    from PIL import Image
    for kind in ('paragraaf','opgaven','antwoorden'):
        dest=E/kind; dest.mkdir(exist_ok=True)
        run(['pdftoppm','-r','150','-png',P/f'{b.STEM} – {kind}.pdf',dest/'page'])
    for kind in ('native','grayscale'): (E/kind).mkdir(exist_ok=True)
    for svg in sorted((P/'_assets').glob('*.svg')):
        dest=E/'native'/svg.with_suffix('.png').name
        run([PY,'-m','cairosvg',svg,'-o',dest,'-s','2'])
        assert dest.read_bytes()==svg.with_suffix('.png').read_bytes()
        Image.open(dest).convert('L').save(E/'grayscale'/dest.name)

def gates():
    for profile in ('student-web','publisher-print'): run(['node','scripts/validate-paragraph.js','--mode','part-a','--profile',profile,P])
    for action in ('paragraph_production','specialist_review'): run(['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action',action,'--paragraph','2.1.1'])
    run(['node','build-scripts/workflows/check-book2-target-authority-remediation.js','--durable'])
    run(['node','build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1'])
    run(['git','diff','--check']); run(['git','diff','--check'],L)

def probes():
    run([PY, 'reports/sprints/' + PREFIX + '-probes.py', *sys.argv[2:]])

def preserve():
    old=blob(LB,REL/'2.1.1-review.md',L)
    assert old==(P/'2.1.1-review.md').read_bytes()
    with (E/'historical-R3-review-snapshot.md').open('xb') as f: f.write(old)
    put('history-binding.json',dict(repository='4veco-lessen',commit=LB,path=str(REL/'2.1.1-review.md'),raw_sha256=sha(old),snapshot='historical-R3-review-snapshot.md',reviewed_revision='R3',not_a_current_R5_verdict=True))

def final_checks():
    before=json.loads((E/'before.json').read_text(encoding='utf-8')); now=snapshot()
    differences=[p for p in sorted(set(before)|set(now)) if before.get(p)!=now.get(p)]
    assert differences==[str(REL/'2.1.1-review.md').replace('\\','/')],differences
    current=P/'2.1.1-review.md'; copy=ROOT/'reports/sprints'/f'{PREFIX}-report.md'
    assert current.read_bytes()==copy.read_bytes()
    bindings=json.loads((E/'pass0.json').read_text(encoding='utf-8'))['bindings']
    for path,h in bindings.items():
        if Path(path)!=current: assert sha(Path(path).read_bytes())==h,path
    original=E/'historical-R3-review-snapshot.md'
    assert sha(original.read_bytes())==bindings[str(current)]
    assert (E/'independent-probes.json').read_bytes()==(E/'independent-probes-recheck.json').read_bytes()
    for cwd in (ROOT,L): run(['git','fetch','--prune','origin'],cwd)
    run(['node','build-scripts/review-gates/check-governance-freshness.js'])
    for cwd in (ROOT,L):
        args=['node','build-scripts/ci/check-agent-worktree-safety.js','--check','--task','BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-REVIEW','--agent','paragraph_221_r8_independent_review','--require-prefix','codex/,agent/']
        if cwd==L: args+=['--worktree',str(L)]
        run(args)
    gates()
    put('final-preservation.json',dict(status='PASS',canonical_review_sha256=sha(current.read_bytes()),historical_review_sha256=sha(original.read_bytes()),only_lesson_difference=differences,all_other_paragraph_files_unchanged=True,all_other_pass0_bindings_unchanged=True,quality_ref_sha256=sha((P/'2.1.1-quality-ref.yaml').read_bytes()),handoff_sha256=sha((P/'2.1.1-textbook-handoff.md').read_bytes()),native_proofs_unmodified=True,current_QC_acceptance='NOT_SUPPLIED'))

def scope():
    ph=dec(run(['git','rev-parse','HEAD']).stdout).strip(); lh=dec(run(['git','rev-parse','HEAD'],L).stdout).strip()
    record=dict(platform_payload=ph,lesson_payload=lh,comparisons=[])
    for cwd,base,lane,head in [(ROOT,R4P,'shared',ph),(L,R4L,'textbook',lh),(ROOT,BASE,'shared',ph),(L,LB,'textbook',lh)]:
        args=['node','build-scripts/workflows/check-paragraph-lane-scope.js','--lane',lane,'--base',base,'--head',head,'--json']
        if cwd==L: args+=['--cwd',str(L)]
        record['comparisons'].append(json.loads(dec(run(args).stdout)))
    for cwd,base in [(ROOT,BASE),(L,LB)]:
        paths=dec(run(['git','-c','core.quotepath=false','diff','--name-only',base,'HEAD'],cwd).stdout).splitlines()
        if cwd==ROOT: assert paths and all(p.startswith('reports/sprints/'+PREFIX) for p in paths),paths
        else: assert paths==[str(REL/'2.1.1-review.md').replace('\\','/')],paths
        record[str(cwd)+'_own_paths']=paths
    put('committed-scope.json',record)

if __name__=='__main__': globals()[sys.argv[1]]()
