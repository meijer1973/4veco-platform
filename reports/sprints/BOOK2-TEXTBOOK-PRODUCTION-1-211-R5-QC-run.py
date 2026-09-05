"""Owned independent specialist QC diagnostics, never automated acceptance.
Adapted from read-only published R5 reviewer helper with exact own roots/subject.
Old source/DOM contracts retained; only current QC may become a successor.

HOW TO ADAPT: create a new exact baseline and prefix; keep failed evidence and
historical native proof untouched. This file does not change source or gates.
"""
from pathlib import Path
import ast, base64, datetime, hashlib, json, math, os, re, subprocess, sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
assert ROOT == Path('C:/wt/book2-211-r5-qc-20260906/4veco-platform')
L = ROOT.parent / '4veco-lessen'
REL = Path('Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren')
P = L / REL
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC'
E = ROOT / 'reports/sprints' / (PREFIX + '-evidence')
E.mkdir(exist_ok=True)
BASE = 'c84b5ccb03f6bc73e34d8c376368954cf363ca81'
LB = '3ccd6f68c848d1ab33e5c33fcac754ffbd7c0d99'
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
def manifest(): return json.loads((E/'full-build.json').read_text(encoding='utf-8'))
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
    assert bindings[str(P/'2.1.1-review.md')]=='a75755c7c2e6cdffb2defcbb5403814cf854d87bfae9a8172dd768aadb5b8023'
    archive=P/f'{b.STEM} – opgaven.zip'
    assert archive.read_bytes()==blob(R4L,archive.relative_to(L),L)
    assert not re.search(r'zipfile|make_archive|\.zip', (ROOT/'build-scripts/content/book-2/b2_211.py').read_text(encoding='utf-8'))
    put('pass0.json',dict(status='PASS',actor='paragraph_211_r5_specialist_qc',role='independent specialist QC',platform_base=BASE,lessons_base=LB,bindings=bindings,native_files=sorted(native),pages=pages,target=record,target_record_sha256=b.TARGET_HASH,legacy_zip=dict(sha256=sha(archive.read_bytes()),unchanged=True,current_deliverable=False)))
    put('before.json',snapshot()); put('diagnostic-manifest.json',m)

def build():
    assert json.loads((E/'pass0.json').read_text(encoding='utf-8'))['status']=='PASS'
    run(['npm.cmd','ci','--ignore-scripts'])
    run([PY,'-m','unittest','discover','-s','build-scripts/content/book-2/211','-p','test_*.py','-v'])
    proofroot=ROOT/'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1'
    used=[]; searched=[]
    listing=dec(run(['git','worktree','list','--porcelain']).stdout)
    for line in listing.splitlines():
        if not line.startswith('worktree '): continue
        folder=Path(line[9:])/'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1'
        if folder.is_dir():
            searched.append(str(folder))
            for item in folder.glob('211-*-r*'):
                match=re.search(r'-r([1-9][0-9]*)$',item.name)
                if match: used.append(int(match.group(1)))
    suffix='r'+str(max(used,default=0)+1)
    assert not list(proofroot.glob('211-*-'+suffix))
    put('fresh-proof-selection.json',dict(searched=searched,previous_revisions=sorted(set(used)),selected=suffix))
    run([PY,'build-scripts/content/book-2/b2_211.py','--lesson-root',L,'--proof-root',proofroot,'--proof-suffix',suffix,'--manifest',E/'full-build.json'])
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
    old=blob(LB,REL/'2.1.1-quality-ref.yaml',L)
    assert old==(P/'2.1.1-quality-ref.yaml').read_bytes()
    assert sha(old)=='0dddb6e9d8f3a8da0e0f31e67dafabf53b99feb6ad86ce72039480dd7e12ea18'
    with (E/'historical-QC-snapshot.yaml').open('xb') as f: f.write(old)
    put('history-binding.json',dict(repository='4veco-lessen',commit=LB,path=str(REL/'2.1.1-quality-ref.yaml'),raw_sha256=sha(old),snapshot='historical-QC-snapshot.yaml',not_a_current_R5_verdict=True))

def final_checks():
    before=json.loads((E/'before.json').read_text(encoding='utf-8')); now=snapshot()
    differences=[p for p in sorted(set(before)|set(now)) if before.get(p)!=now.get(p)]
    assert differences==[str(REL/'2.1.1-quality-ref.yaml').replace('\\','/')],differences
    current=P/'2.1.1-quality-ref.yaml'
    bindings=json.loads((E/'pass0.json').read_text(encoding='utf-8'))['bindings']
    for path,h in bindings.items():
        if Path(path)!=current: assert sha(Path(path).read_bytes())==h,path
    original=E/'historical-QC-snapshot.yaml'
    assert sha(original.read_bytes())==bindings[str(current)]
    for d in manifest()['documents']:
        verify_record_freshness(d)
        proof=Path(d['proof_directory']); data=json.loads((proof/'manifest.json').read_text(encoding='utf-8'))
        assert data['inspection_status']=='PENDING' and data['pages_inspected']==[]
        for name,h in data['page_sha256'].items(): assert sha((proof/'pages'/name).read_bytes())==h
    for cwd in (ROOT,L): run(['git','fetch','--prune','origin'],cwd)
    run(['node','build-scripts/review-gates/check-governance-freshness.js'])
    for cwd in (ROOT,L):
        args=['node','build-scripts/ci/check-agent-worktree-safety.js','--check','--task',PREFIX,'--agent','paragraph_211_r5_specialist_qc','--require-prefix','codex/,agent/']
        if cwd==L: args+=['--worktree',str(L)]
        run(args)
    gates()
    put('final-preservation.json',dict(status='PASS',canonical_quality_ref_sha256=sha(current.read_bytes()),historical_quality_ref_sha256=sha(original.read_bytes()),only_lesson_difference=differences,all_other_paragraph_files_unchanged=True,all_other_pass0_bindings_unchanged=True,review_sha256=sha((P/'2.1.1-review.md').read_bytes()),handoff_sha256=sha((P/'2.1.1-textbook-handoff.md').read_bytes()),native_proofs_unmodified=True,root_acceptance='PENDING'))

def scope():
    ph=dec(run(['git','rev-parse','HEAD']).stdout).strip(); lh=dec(run(['git','rev-parse','HEAD'],L).stdout).strip()
    record=dict(platform_payload=ph,lesson_payload=lh,comparisons=[])
    # Lane validation requires a complete lane-owned candidate; an evidence-only
    # reviewer delta is separately constrained by the exact own-path audit below.
    for cwd,base,lane,head in [(ROOT,R4P,'shared',ph),(L,R4L,'textbook',lh)]:
        args=['node','build-scripts/workflows/check-paragraph-lane-scope.js','--lane',lane,'--base',base,'--head',head,'--json']
        if cwd==L: args+=['--cwd',str(L)]
        record['comparisons'].append(json.loads(dec(run(args).stdout)))
    diagnostic=run(['node','build-scripts/workflows/check-paragraph-lane-scope.js','--lane','shared','--base',BASE,'--head',ph,'--json'],required=False)
    rejected=json.loads(dec(diagnostic.stdout))
    assert diagnostic.returncode==1 and rejected['ok'] is False
    assert rejected['failures']==[
        'shared lane needs at least one shared platform change',
        'generated index/report or review-evidence changes are allowed only with lane-owned changes']
    assert rejected['categories']['shared_platform']==[] and rejected['categories']['unknown']==[]
    record['expected_evidence_only_rejection']=dict(exit_code=diagnostic.returncode,result=rejected,meaning='Evidence-only delta is not a standalone shared implementation candidate; strict own-path audit follows. No waiver or fake lane anchor.')
    for cwd,base in [(ROOT,BASE),(L,LB)]:
        paths=dec(run(['git','-c','core.quotepath=false','diff','--name-only',base,'HEAD'],cwd).stdout).splitlines()
        if cwd==ROOT:
            proofprefixes=[str(Path(d['proof_directory']).relative_to(ROOT)).replace('\\','/')+'/' for d in manifest()['documents']]
            assert paths and all(p.startswith('reports/sprints/'+PREFIX) or any(p.startswith(prefix) for prefix in proofprefixes) for p in paths),paths
        else: assert paths==[str(REL/'2.1.1-quality-ref.yaml').replace('\\','/')],paths
        record[str(cwd)+'_own_paths']=paths
    put(sys.argv[2] if len(sys.argv)>2 else 'committed-scope.json',record)

def publication_checks():
    raw=run(['git','diff','--check',BASE,'HEAD'],required=False)
    assert raw.returncode==2,raw.returncode
    errors=[line for line in dec(raw.stdout).splitlines() if ': trailing whitespace.' in line]
    assert errors and all(line.startswith('reports/sprints/'+PREFIX+'-command-log.md:') for line in errors),errors
    log=ROOT/'reports/sprints'/f'{PREFIX}-command-log.md'
    assert b'\r\n' in log.read_bytes()
    for cwd,base in [(ROOT,BASE),(L,LB)]:
        run(['git','-c','core.whitespace=blank-at-eol,blank-at-eof,space-before-tab,cr-at-eol','diff','--check',base,'HEAD'],cwd)
    final=json.loads((E/'final-preservation.json').read_text(encoding='utf-8'))
    current=P/'2.1.1-quality-ref.yaml'
    assert sha(current.read_bytes())==final['canonical_quality_ref_sha256']
    report=ROOT/'reports/sprints'/f'{PREFIX}-report.md'
    assert 'specialist_report_sha256: "'+sha(report.read_bytes())+'"' in current.read_text(encoding='utf-8')
    for d in manifest()['documents']: verify_record_freshness(d)
    put('publication-checks.json',dict(status='PASS',default_whitespace_exit=raw.returncode,default_whitespace_findings=errors,diagnosis='Native recorder preserves child CRLF in Markdown excerpts; CR-at-EOL-aware check retains all other whitespace rules and passes. Evidence bytes/history are not normalized or removed.',report_sha256=sha(report.read_bytes()),quality_ref_sha256=sha(current.read_bytes()),native_outputs_still_exact=True))

if __name__=='__main__': globals()[sys.argv[1]]()
