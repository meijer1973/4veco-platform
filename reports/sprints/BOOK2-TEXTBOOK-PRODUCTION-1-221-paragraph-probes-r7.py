"""Independent bounded R7 diagnostics; no visual acceptance is inferred here."""
import hashlib
import json
import re
import subprocess
import sys
from fractions import Fraction
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LESSONS = ROOT.parent / '4veco-lessen'
sys.path.insert(0, str(ROOT / 'build-scripts/content/book-2'))
import b2_221
from bs4 import BeautifulSoup
from pypdf import PdfReader

PREFIX = ROOT / 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-'
PBASE = '92862e370fd997634aa505c24b74c773c05039f4'
LBASE = 'abe73479d900c1c3dd4cccb9c568305eb58c7a18'

def digest(data):
    return hashlib.sha256(data).hexdigest()

def old(repo, rev, rel):
    return subprocess.run(['git', 'show', f'{rev}:{rel}'], cwd=repo,
                          check=True, capture_output=True).stdout

def write(suffix, data):
    Path(str(PREFIX) + suffix).write_text(json.dumps(data, ensure_ascii=False,
        indent=2) + '\n', encoding='utf-8', newline='\n')

def local(value):
    if isinstance(value, str):
        return value.replace('C:\\wt\\book2-221-presentation-20260905', str(ROOT.parent))
    if isinstance(value, list):
        return [local(x) for x in value]
    if isinstance(value, dict):
        return {k: local(v) for k, v in value.items()}
    return value

def main():
    folder = LESSONS / b2_221.LESSON_REL
    # Pass 0 precedes all substantive diagnostic passes.
    refs = set()
    for kind in ('paragraaf', 'opgaven', 'antwoorden'):
        path = folder / f'2.2.1 Prijselasticiteit – {kind}.md'
        for ext in ('.md', '.html', '.pdf'):
            assert path.with_suffix(ext).is_file(), path.with_suffix(ext)
        assert path.with_suffix('.pdf').stat().st_size > 10000
        for alt, name in re.findall(r'!\[([^\]]*)\]\(([^)]+)\)', path.read_text(encoding='utf-8')):
            assert alt.strip() and name.startswith('_assets/')
            asset = folder / name
            assert asset.is_file()
            refs.add(asset.stem)
    # Worked figure uses HTML width; inspect it as well, without counting inline images.
    for path in folder.glob('* – *.md'):
        for tag in BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser').find_all('img'):
            assert tag.get('alt') and tag['src'].startswith('_assets/')
            assert (folder / tag['src']).is_file()
            refs.add(Path(tag['src']).stem)
    assert refs == {'2.2.1_fig_1', '2.2.1_fig_2', '2.2.1_we_1'}, refs
    expected = {f'{stem}{ext}' for stem in refs for ext in ('.svg', '.png')}
    assert {p.name for p in (folder/'_assets').iterdir() if p.is_file()} == expected
    assert (folder/'build_pdf.py').is_file()
    print('PASS 0: all document sets, thin builder, references and exactly three paired assets')

    replacements = [
        ('Maak deze twee korte checks in ongeveer 5½ minuut. Controleer daarna je werk', 'Maak deze twee korte checks. Controleer daarna je werk'),
        ('Dit is de extra hulproute van ongeveer 10 minuten. Die komt boven op de kern;', 'Dit is de extra hulproute. Die komt boven op de korte route;'),
        ('conclusie. Richttijd: 11 minuten.', 'conclusie.'),
        ('Werk zelfstandig. Richttijd: 9 minuten. Totaal: 9 punten.', 'Werk zelfstandig. Totaal: 9 punten.'),
        ('Dit denkertje valt buiten de kernroute. Richttijd: 8 minuten.', 'Dit denkertje valt buiten de korte route.'),
        ('Deze herhaling valt buiten de kernroute en kan als huiswerk. Richttijd samen:\n5 minuten.', 'Deze herhaling valt buiten de korte route en kan als huiswerk.'),
    ]
    source = 'build-scripts/content/book-2/221/exercises.md'
    prior = old(ROOT, PBASE, source)
    assert digest(prior) == 'e5b37d2b3171a24da7bef24c82695c9ac469632039f4c310a09162653698e562'
    result = prior.decode('utf-8')
    for before, after in replacements:
        assert result.count(before) == 1
        result = result.replace(before, after)
    assert result.encode('utf-8') == (ROOT/source).read_bytes()

    manifest_path = Path(str(PREFIX)+'build-r7.json')
    original = json.loads(manifest_path.read_text(encoding='utf-8'))
    mapped = local(original)
    checked = []
    def check(path, expected_hash=None, baseline=None, repo=ROOT):
        raw = path.read_bytes()
        if expected_hash:
            assert digest(raw) == expected_hash, path
        if baseline:
            assert raw == old(repo, baseline, path.relative_to(repo).as_posix()), path
        checked.append({'path': str(path), 'raw_sha256': digest(raw),
                        'unchanged_from': baseline})
    for entry in mapped['input_sources']:
        p = Path(entry['path'])
        check(p, entry['sha256'], PBASE if p.name != 'exercises.md' else None)
    for name in ('test_source.py', 'check_render.py'):
        check(ROOT/f'build-scripts/content/book-2/221/{name}', baseline=PBASE)
    for name in ('references/authored/course-target-exercises.json',
                 'references/authored/book-outlines/book-2-outline.md',
                 'references/authored/book-outlines/book-2-outline.meta.json',
                 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-22-owner-authorization.md',
                 'reports/sprints/BOOK2-TARGET-INTEGRATION-1-owner-authorization.md'):
        check(ROOT/name, baseline=PBASE)
    for name in ('2.2.1-textbook-plan.md', '2.2.1-quality-ref.yaml',
                 '2.2.1-textbook-handoff.md', 'build_pdf.py'):
        check(folder/name, baseline=LBASE, repo=LESSONS)
    check(folder.parent/'_chapter-plan.md', baseline=LBASE, repo=LESSONS)
    proof = []
    for rec in mapped['documents']:
        kind = Path(rec['source_pdf']).stem.rsplit(' – ', 1)[1]
        for key, hkey in [('source_md','source_sha256'), ('source_html','html_sha256'), ('source_pdf','pdf_sha256')]:
            check(Path(rec[key]), rec[hkey], LBASE if kind=='antwoorden' else None, LESSONS)
        for asset in rec['assets']:
            check(Path(asset['path']), asset['sha256'], LBASE, LESSONS)
        proofdir = Path(rec['proof_directory'])
        pm = json.loads((proofdir/'manifest.json').read_text(encoding='utf-8'))
        assert pm['inspection_status']=='PENDING' and pm['pages_inspected']==[]
        assert pm['pdf_sha256']==rec['pdf_sha256'] and pm['render_dpi']==150
        assert len(pm['rendered_pages'])==len(PdfReader(rec['source_pdf']).pages)
        for page in pm['rendered_pages']:
            check(proofdir/page, pm['page_sha256'][Path(page).name])
        proof.append({'kind':kind, 'proof_directory':str(proofdir),
                      'manifest_raw_sha256':digest((proofdir/'manifest.json').read_bytes()),
                      'pdf_sha256':rec['pdf_sha256'], 'page_sha256':pm['page_sha256']})
        for key in ('source_md','source_html','source_pdf'):
            path = Path(rec[key])
            if key=='source_pdf':
                text = ' '.join(p.extract_text() for p in PdfReader(path).pages)
            elif key=='source_html':
                text = BeautifulSoup(path.read_text(encoding='utf-8'),'html.parser').get_text(' ')
            else:
                text=path.read_text(encoding='utf-8')
            assert not re.search(r'Richttijd|5½|\bminu(?:ut|ten)\b|kernroute',text,re.I), key
    assert b2_221.lf_hash(folder/'2.2.1-textbook-plan.md')==b2_221.PLAN_HASH
    assert b2_221.lf_hash(folder.parent/'_chapter-plan.md')==b2_221.CHAPTER_HASH
    b2_221.target_record()
    # Independent fractions from observed old/new values, not answer parsing.
    cases = [('fruitbox',10,11,100,95,Fraction(-1,2)),
             ('oefenruimte',10,11,100,80,Fraction(-2)),
             ('Bowlplein',8,10,200,180,Fraction(-2,5)),
             ('reparatie',20,22,100,95,Fraction(-1,2)),
             ('arcade',5,6,200,140,Fraction(-3,2)),
             ('zwembad',5,4,200,220,Fraction(-1,2)),
             ('Skatehal',10,12,400,280,Fraction(-3,2)),
             ('Nova',10,12,500,420,Fraction(-4,5))]
    math = []
    for name,p0,p1,q0,q1,ev in cases:
        dp,dq=Fraction(p1-p0,p0)*100,Fraction(q1-q0,q0)*100
        assert dq/dp==ev
        math.append({'context':name, 'price_percent':str(dp), 'quantity_percent':str(dq), 'Ev':str(ev)})
    assert Fraction(25-20,20)*100==25 and Fraction(20-25,25)*100==-20
    write('paragraph-diagnostic-manifest-r7.json', mapped)
    write('paragraph-probes-r7.json', {'status':'PASS', 'reviewer':'paragraph_221_r7_independent_review',
        'visual_acceptance':'NOT_INFERRED', 'pass0':'PASS', 'exact_six_replacements':True,
        'build_manifest_raw_sha256':digest(manifest_path.read_bytes()), 'checks':checked,
        'proofs':proof, 'independent_rational_cases':math,
        'closing_percentages':[25,-20], 'timing_observed':False})
    print(f'PASS: exact six replacements; {len(checked)} raw hashes; protected inputs; 8 rational cases; all page hashes')

if __name__=='__main__':
    main()
