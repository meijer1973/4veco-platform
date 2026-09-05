"""Own bounded specialist diagnostic runner; never grants visual acceptance."""
import datetime, hashlib, json, os, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
assert ROOT == Path('C:/wt/book2-221-r8-qc-20260905/4veco-platform')
E = ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-QC-r8-evidence'
E.mkdir(exist_ok=True)
LESSONS = ROOT.parent/'4veco-lessen'
PAR = LESSONS/'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit'
PY = 'C:/Python314/python.exe'
LOG = E/'commands.jsonl'

def sha(data): return hashlib.sha256(data).hexdigest()
def put(name, data): (E/name).write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')
def decode(data):
    try: return data.decode('utf-8')
    except UnicodeDecodeError: return data.decode('cp1252')
def run(argv, cwd=ROOT, env=None, required=True, content_bytes=False):
    start = datetime.datetime.now(datetime.timezone.utc).isoformat()
    result = subprocess.run(argv, cwd=cwd, env={**os.environ, **(env or {})}, capture_output=True)
    record = dict(argv=argv, cwd=str(cwd), environment_overrides=env or {}, path_policy='inherited unchanged',
                  started=start, ended=datetime.datetime.now(datetime.timezone.utc).isoformat(), exit_code=result.returncode,
                  stdout='[Content bytes bound by SHA-256; not repeated in command log]' if content_bytes else decode(result.stdout),
                  stderr=decode(result.stderr), stdout_sha256=sha(result.stdout), stderr_sha256=sha(result.stderr))
    with LOG.open('a', encoding='utf-8', newline='\n') as f: f.write(json.dumps(record, ensure_ascii=False)+'\n')
    print(json.dumps(dict(argv=argv, exit_code=result.returncode), ensure_ascii=True), flush=True)
    if required: assert result.returncode == 0, record
    return result

def snapshot():
    return {str(p.relative_to(LESSONS)).replace('\\','/'):sha(p.read_bytes()) for p in PAR.rglob('*') if p.is_file()}

if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'prepare':
        assert not (E/'before.json').exists()
        put('before.json', snapshot())
        data = json.loads((ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-R8-diagnostic-manifest.json').read_text(encoding='utf-8'))
        def local(v):
            if isinstance(v,str): return v.replace('C:\\wt\\book2-221-r8-review-20260905',str(ROOT.parent)).replace('C:/wt/book2-221-r8-review-20260905',str(ROOT.parent))
            if isinstance(v,list): return [local(x) for x in v]
            if isinstance(v,dict): return {k:local(x) for k,x in v.items()}
            return v
        data=local(data)
        for s in data['input_sources']:
            p=Path(s['path']); assert p.is_relative_to(ROOT); assert sha(p.read_bytes())==s['sha256']
        for d in data['documents']:
            for key,h in [('source_md','source_sha256'),('source_html','html_sha256'),('source_pdf','pdf_sha256')]:
                p=Path(d[key]); assert p.is_relative_to(PAR); assert sha(p.read_bytes())==d[h]
            for a in d['assets']: assert sha(Path(a['path']).read_bytes())==a['sha256']
            assert Path(d['proof_directory']).is_relative_to(ROOT)
        put('diagnostic-manifest.json',data)
    elif mode == 'build':
        run([PY,'build-scripts/content/book-2/221/test_source.py','-v'])
        run([PY,'build-scripts/content/book-2/b2_221.py','--lesson-root',str(LESSONS),'--manifest',str(E/'full-build.json')])
        run([PY,'build-scripts/content/book-2/221/check_render.py','--lesson-root',str(LESSONS),'--manifest',str(E/'diagnostic-manifest.json'),'--rebuild','--output',str(E/'render-check.json')])
        assert snapshot()==json.loads((E/'before.json').read_text(encoding='utf-8'))
        put('after-rebuild.json',snapshot())
    elif mode == 'pages':
        for kind in ('paragraaf','opgaven','antwoorden'):
            target=E/kind; target.mkdir(exist_ok=True)
            run(['pdftoppm','-r','150','-png',str(PAR/f'2.2.1 Prijselasticiteit – {kind}.pdf'),str(target/'page')])
        for n in (2,3,5):
            run(['pdftoppm','-r','150','-gray','-png','-f',str(n),'-l',str(n),'-singlefile',str(PAR/'2.2.1 Prijselasticiteit – paragraaf.pdf'),str(E/f'gray-p{n}')])
    elif mode == 'gates':
        for profile in ('student-web','publisher-print'):
            run(['node','scripts/validate-paragraph.js','--mode','part-a','--profile',profile,str(PAR)])
        run(['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.2.1'])
        run(['node','build-scripts/workflows/check-book2-target-authority-remediation.js','--durable'])
    else: raise ValueError(mode)
