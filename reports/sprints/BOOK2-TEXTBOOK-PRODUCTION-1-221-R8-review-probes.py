"""Independent R8 paragraph diagnostics, never a visual or specialist verdict."""
import argparse
import ast
import hashlib
import json
import re
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
from fractions import Fraction
from pathlib import Path

from bs4 import BeautifulSoup
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
LESSONS = ROOT.parent / '4veco-lessen'
PREFIX = ROOT / 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-R8-'
PBASE = '199772e2aa586fce0f71b647ed5188e568dba2e5'
LBASE = '4c4cd7d0c1d2e5242c818399a96dce3e26013e9c'
PHEAD = 'b64e45a87011fff113c97dbb74e5f170b0bd7a65'
LHEAD = '8a71fa62e0894b06afde946292f9d71123699504'
sys.path.insert(0, str(ROOT / 'build-scripts/content/book-2'))
import b2_221 as builder
from print_pipeline import render_proof, verify_record_freshness

CAPTION = 'Vergelijk de procentuele reacties op dezelfde schaal.'
ALT = 'Procentuele prijs- en hoeveelheidsreacties op dezelfde schaal.'
OLD_TITLE = 'Vergelijk de procentuele prijs- en hoeveelheidsveranderingen met teken'
TITLE = 'Procentuele prijs- en hoeveelheidsveranderingen met teken op één schaal'


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def old(repo, rev, rel):
    return subprocess.check_output(['git', 'show', f'{rev}:{rel}'], cwd=repo)


def save(suffix, data):
    path = Path(str(PREFIX) + suffix)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n', encoding='utf-8', newline='\n')
    return path


def normalize(text):
    return ' '.join(text.split())


def remap(value):
    if isinstance(value, str):
        return value.replace('C:\\wt\\book2-short-alt-correction-20260905', str(ROOT.parent))
    if isinstance(value, list):
        return [remap(v) for v in value]
    if isinstance(value, dict):
        return {k: remap(v) for k, v in value.items()}
    return value


def probes():
    folder = LESSONS / builder.LESSON_REL
    refs = set()
    for kind in ('paragraaf', 'opgaven', 'antwoorden'):
        stem = builder.STEM + ' – ' + kind
        for ext in ('.md', '.html', '.pdf'):
            assert (folder/(stem+ext)).is_file(), folder/(stem+ext)
        assert (folder/(stem+'.pdf')).stat().st_size > 10000
        for caption, name in re.findall(r'!\[([^\]]*)\]\(([^)]+)\)', (folder/(stem+'.md')).read_text(encoding='utf-8')):
            assert caption and name.startswith('_assets/') and (folder/name).is_file()
            refs.add(Path(name).stem)
    assert refs == {'2.2.1_fig_1', '2.2.1_fig_2', '2.2.1_we_1'}
    assert {p.name for p in (folder/'_assets').iterdir()} == {n+ext for n in refs for ext in ('.svg', '.png')}
    assert (folder/'build_pdf.py').is_file()
    print('PASS 0: all nine editions, build wrapper, image references, three named SVG/PNG pairs; no orphans.', flush=True)

    # Exact source replacement proof, plus AST equality of all ten earlier tests.
    original_image = f'![{CAPTION}](_assets/2.2.1_fig_1.svg)'
    replacement_image = original_image + '{alt="' + ALT + '"}'
    for rel, before, after in [('build-scripts/content/book-2/b2_221.py', OLD_TITLE, TITLE),
                              ('build-scripts/content/book-2/221/theory.md', original_image, replacement_image)]:
        text = old(ROOT, PBASE, rel).decode('utf-8')
        assert text.count(before) == 1
        assert text.replace(before, after) == (ROOT/rel).read_text(encoding='utf-8')
    def tests(text):
        return {n.name: ast.dump(n) for n in ast.walk(ast.parse(text)) if isinstance(n, ast.FunctionDef) and n.name.startswith('test_')}
    old_tests = tests(old(ROOT, PBASE, 'build-scripts/content/book-2/221/test_source.py').decode('utf-8'))
    new_tests = tests((ROOT/'build-scripts/content/book-2/221/test_source.py').read_text(encoding='utf-8'))
    assert len(old_tests) == 10 and len(new_tests) == 12
    assert all(new_tests[k] == v for k, v in old_tests.items())

    unchanged = []
    def unchanged_file(repo, rel, baseline):
        actual = (repo/rel).read_bytes()
        assert actual == old(repo, baseline, rel), rel
        unchanged.append({'repository': repo.name, 'path': rel, 'raw_sha256': sha(actual), 'baseline': baseline})
    for rel in ('build-scripts/content/book-2/print_pipeline.py', 'build-scripts/content/book-2/221/check_render.py',
                'build-scripts/content/book-2/221/exercises.md', 'build-scripts/content/book-2/221/answers.md',
                'build-scripts/content/book-2/221/target-answers.md', 'references/authored/course-target-exercises.json',
                'references/authored/book-outlines/book-2-outline.md', 'references/authored/book-outlines/book-2-outline.meta.json',
                'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-22-owner-authorization.md',
                'reports/sprints/BOOK2-TARGET-INTEGRATION-1-owner-authorization.md'):
        unchanged_file(ROOT, rel, PBASE)
    for name in ('2.2.1-textbook-plan.md', '2.2.1-quality-ref.yaml', '2.2.1-textbook-handoff.md', '_paragraph-plan.md', 'build_pdf.py'):
        unchanged_file(LESSONS, (builder.LESSON_REL/name).as_posix(), LBASE)
    unchanged_file(LESSONS, (builder.LESSON_REL.parent/'_chapter-plan.md').as_posix(), LBASE)

    # Preserve the six R7 pupil-copy replacements exactly against the pre-R7 source.
    replacements = [
        ('Maak deze twee korte checks in ongeveer 5½ minuut. Controleer daarna je werk', 'Maak deze twee korte checks. Controleer daarna je werk'),
        ('Dit is de extra hulproute van ongeveer 10 minuten. Die komt boven op de kern;', 'Dit is de extra hulproute. Die komt boven op de korte route;'),
        ('conclusie. Richttijd: 11 minuten.', 'conclusie.'),
        ('Werk zelfstandig. Richttijd: 9 minuten. Totaal: 9 punten.', 'Werk zelfstandig. Totaal: 9 punten.'),
        ('Dit denkertje valt buiten de kernroute. Richttijd: 8 minuten.', 'Dit denkertje valt buiten de korte route.'),
        ('Deze herhaling valt buiten de kernroute en kan als huiswerk. Richttijd samen:\n5 minuten.', 'Deze herhaling valt buiten de korte route en kan als huiswerk.')]
    rel = 'build-scripts/content/book-2/221/exercises.md'
    former = old(ROOT, '92862e370fd997634aa505c24b74c773c05039f4', rel).decode('utf-8')
    for before, after in replacements:
        assert former.count(before) == 1
        former = former.replace(before, after)
    assert former == (ROOT/rel).read_text(encoding='utf-8')

    original_manifest = ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-build-r8.json'
    mapped = remap(json.loads(original_manifest.read_text(encoding='utf-8')))
    bindings, alternatives, pages = [], [], []
    for item in mapped['input_sources']:
        assert builder.digest(Path(item['path'])) == item['sha256']
        bindings.append(item)
    for record in mapped['documents']:
        verify_record_freshness(record)
        kind = Path(record['source_pdf']).stem.rsplit(' – ', 1)[1]
        for field in ('source_md', 'source_html', 'source_pdf'):
            path = Path(record[field])
            former = old(LESSONS, LBASE, path.relative_to(LESSONS).as_posix())
            if kind == 'paragraaf' and field in ('source_md', 'source_html'):
                text = former.decode('utf-8')
                if field == 'source_md':
                    assert text.count(original_image) == 1
                    assert text.replace(original_image, replacement_image) == path.read_text(encoding='utf-8')
                else:
                    prior = BeautifulSoup(text, 'html.parser')
                    actual = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
                    assert normalize(prior.body.get_text(' ', strip=True)) == normalize(actual.body.get_text(' ', strip=True))
                    assert normalize(prior.find('figure').figcaption.get_text(' ', strip=True)) == CAPTION
                    assert normalize(actual.find('figure').figcaption.get_text(' ', strip=True)) == CAPTION
                    old_caption = '<figcaption aria-hidden="true">Vergelijk de procentuele reacties op\ndezelfde schaal.</figcaption>'
                    new_caption = '<figcaption>Vergelijk de procentuele reacties op dezelfde\nschaal.</figcaption>'
                    assert text.count(f'alt="{CAPTION}"') == 1 and text.count(old_caption) == 1
                    expected = text.replace(f'alt="{CAPTION}"', f'alt="{ALT}"').replace(old_caption, new_caption)
                    assert expected == path.read_text(encoding='utf-8')
                    # After enumerating the only two attribute changes, DOM equality
                    # normalizes whitespace in text nodes only; no content is dropped.
                    prior.find('figure').img['alt'] = ALT
                    del prior.find('figure').figcaption['aria-hidden']
                    def dom(node):
                        if isinstance(node, str):
                            return normalize(node)
                        return [node.name, sorted((k, str(v)) for k, v in node.attrs.items()),
                                [d for child in node.children if (d := dom(child))]]
                    assert dom(prior) == dom(actual)
            else:
                assert former == path.read_bytes(), (kind, field)
        soup = BeautifulSoup(Path(record['source_html']).read_text(encoding='utf-8'), 'html.parser')
        assert len(soup.find_all('img')) == {'paragraaf': 3, 'opgaven': 1, 'antwoorden': 0}[kind]
        for image in soup.find_all('img'):
            alternative = image['alt']
            assert 0 < len(alternative) <= 120 and not re.match(r'^(Vergelijk|Bekijk|Zie|Afbeelding van)\b', alternative)
            alternatives.append({'edition': kind, 'alt': alternative, 'characters': len(alternative),
                                 'full_caption': normalize(image.parent.figcaption.get_text(' ', strip=True))})
        for field in ('source_md', 'source_html', 'source_pdf'):
            path = Path(record[field])
            text = ' '.join(p.extract_text() for p in PdfReader(path).pages) if field == 'source_pdf' else path.read_text(encoding='utf-8')
            assert not re.search(r'Richttijd|5½|\bminu(?:ut|ten)\b|kernroute', text, re.I)
        original_proof = Path(record['proof_directory'])
        pm = json.loads((original_proof/'manifest.json').read_text(encoding='utf-8'))
        prior_proof = original_proof.with_name(original_proof.name.replace('-r8', '-r7'))
        prior_pm = json.loads((prior_proof/'manifest.json').read_text(encoding='utf-8'))
        assert pm['page_sha256'] == prior_pm['page_sha256']
        fresh_dir = Path(str(PREFIX)+'proof')/kind
        fresh = render_proof(record, fresh_dir)
        assert fresh['page_sha256'] == pm['page_sha256']
        assert pm['inspection_status'] == 'PENDING' and pm['pages_inspected'] == []
        for page in pm['rendered_pages']:
            expected_hash = pm['page_sha256'][Path(page).name]
            assert builder.digest(original_proof/page) == builder.digest(prior_proof/page) == builder.digest(fresh_dir/page) == expected_hash
            pages.append({'edition': kind, 'page': page, 'fresh_path': str(fresh_dir/page), 'raw_sha256': expected_hash,
                          'published_r8_path': str(original_proof/page), 'same_r7_page_bytes': True})
        record['proof_directory'] = str(fresh_dir)
        bindings.append(record)

    figures = []
    for stem in sorted(refs):
        svg = folder/'_assets'/(stem+'.svg')
        previous = old(LESSONS, LBASE, svg.relative_to(LESSONS).as_posix()).decode('utf-8')
        assert previous.replace(OLD_TITLE, TITLE) == svg.read_text(encoding='utf-8')
        tree = ET.fromstring(svg.read_text(encoding='utf-8'))
        title = tree.find('{http://www.w3.org/2000/svg}title').text
        assert 0 < len(title) <= 120 and not re.match(r'^(Vergelijk|Bekijk|Zie|Afbeelding van)\b', title)
        bars = []
        for element in tree.iter():
            if 'data-value' in element.attrib:
                attrs = element.attrib
                value, scale, zero = (Fraction(attrs[k]) for k in ('data-value', 'data-scale', 'data-zero'))
                assert Fraction(attrs['width']) == abs(value)*scale
                assert Fraction(attrs['x']) == zero+min(value, 0)*scale
                bars.append({'value': str(value), 'scale': str(scale), 'zero': str(zero)})
        with tempfile.TemporaryDirectory(prefix='book2-221-r8-review-raster-') as directory:
            fresh = Path(directory)/'figure.png'
            subprocess.run([sys.executable, '-m', 'cairosvg', str(svg), '-o', str(fresh), '-s', '2'], check=True)
            assert fresh.read_bytes() == svg.with_suffix('.png').read_bytes()
        figures.append({'stem': stem, 'svg_sha256': builder.digest(svg), 'png_sha256': builder.digest(svg.with_suffix('.png')),
                        'title': title, 'characters': len(title), 'bars': bars, 'fresh_raster_exact': True})
    gray = []
    paragraph_pdf = mapped['documents'][0]['source_pdf']
    for number in (2, 3, 5):
        dest = Path(str(PREFIX)+f'grayscale-page-{number:03d}')
        subprocess.run(['pdftoppm', '-gray', '-png', '-r', '150', '-f', str(number), '-l', str(number),
                        '-singlefile', paragraph_pdf, str(dest)], check=True)
        gray.append({'page': number, 'path': str(dest.with_suffix('.png')), 'raw_sha256': builder.digest(dest.with_suffix('.png'))})

    target = builder.target_record()
    assert [q['points'] for q in target['target_exercise']['subquestions']] == [3, 2, 2, 2]
    math = []
    for name, q0, q1, p0, p1, expected in [
        ('Fruitbox',100,95,10,11,Fraction(-1,2)), ('Oefenruimte',100,80,10,11,Fraction(-2)),
        ('Bowlplein',200,180,8,10,Fraction(-2,5)), ('Reparatie',100,95,20,22,Fraction(-1,2)),
        ('Arcade',200,140,5,6,Fraction(-3,2)), ('Zwembad',200,220,5,4,Fraction(-1,2)),
        ('Skatehal',400,280,10,12,Fraction(-3,2)), ('Nova',500,420,10,12,Fraction(-4,5))]:
        dq, dp = Fraction(q1-q0,q0)*100, Fraction(p1-p0,p0)*100
        ev = dq/dp
        assert ev == expected
        math.append({'context': name, 'quantity_percent': str(dq), 'price_percent': str(dp), 'Ev': str(ev),
                     'classification': 'prijsinelastisch' if abs(ev)<1 else 'prijselastisch'})
    assert Fraction(22-20,20)*100 == 10 and Fraction(180-200,200)*100 == -10
    assert Fraction(25-20,20)*100 == 25 and Fraction(20-25,25)*100 == -20
    assert builder.lf_hash(folder/'2.2.1-textbook-plan.md') == builder.PLAN_HASH
    assert builder.lf_hash(folder.parent/'_chapter-plan.md') == builder.CHAPTER_HASH
    save('diagnostic-manifest.json', mapped)
    save('review-probes.json', {'status': 'PASS', 'reviewer': 'paragraph_221_r8_independent_review', 'pass0': 'PASS',
        'visual_acceptance': 'NOT_INFERRED', 'platform_input': PHEAD, 'lesson_input': LHEAD,
        'build_manifest_sha256': builder.digest(original_manifest), 'bindings': bindings, 'unchanged': unchanged,
        'old_tests_unchanged': 10, 'new_tests': 2, 'exact_six_timing_replacements': True,
        'exact_source_metadata_changes': ['native fig1 alt attribute', 'fig1 SVG title'],
        'exact_native_html_changes': ['first img alt', 'first figcaption aria-hidden removal', 'first figcaption soft-wrap'],
        'normalized_whole_visible_body_equal': True, 'normalized_DOM_equal_except_enumerated_attributes': True,
        'full_original_caption_unchanged': CAPTION, 'alternatives': alternatives, 'figures': figures, 'pages': pages,
        'grayscale': gray, 'target_record': target, 'independent_math': math, 'start_percentages': [10,-10],
        'closing_percentages': [25,-20], 'timing_estimates': [48.5,58.5,71.5], 'timing_observed': False,
        'zip_applicability': 'No ZIP in paragraph; not applicable'})
    print('PASS: exact native metadata/DOM/caption delta, all old tests retained, all20 fresh page bytes and three fresh PNG bytes equal, protected hashes and rational calculations.', flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.parse_args()
    probes()
