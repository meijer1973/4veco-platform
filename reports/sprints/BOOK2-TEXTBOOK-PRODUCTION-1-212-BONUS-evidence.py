"""Exact §212 R7 builder proof, never independent review or acceptance.

HOW TO ADAPT: this is an immutable task-specific verifier, not an evergreen
allowlist. A later source or predecessor correction requires new reviewed scope.
"""
import argparse
import base64
import io
import json
from pathlib import Path
import re
import subprocess
import sys
import unittest
from zipfile import ZipFile
from bs4 import BeautifulSoup, NavigableString, Tag
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[2]
LESSON = ROOT.parent / '4veco-lessen'
sys.path.insert(0, str(ROOT / 'build-scripts/content/book-2/212'))
import test_bonus as t
import test_metadata as m
b = t.b
FOLDER = LESSON / b.LESSON_REL
PBASE = t.BASE
LBASE = '917115c8da631d65eefbdb1f15c13b2291cd9e1d'
OUT = ROOT / 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence'
OLDPROOF = ROOT / 'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1'


def save(name, data):
    path = OUT / (name + '.json')
    if path.exists():
        raise ValueError('Immutable evidence already exists: ' + str(path))
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    print(json.dumps({'path': str(path), 'sha256': b.digest(path)}, ensure_ascii=True))


def old(repo, relative):
    return subprocess.check_output(['git', 'show', (LBASE if repo == LESSON else PBASE) + ':' + relative], cwd=repo)


def native():
    paths = [FOLDER / (b.STEM + ' – ' + kind + '.' + ext)
             for kind in ('paragraaf', 'opgaven', 'antwoorden') for ext in ('md', 'html', 'pdf', 'zip')]
    paths += [FOLDER / '_assets' / (name + '.' + ext) for name in b.asset_sources() for ext in ('svg', 'png')]
    assert len(paths) == 34
    return {p.relative_to(LESSON).as_posix(): b.digest(p) for p in paths}


def baseline():
    assert not list(OUT.glob('212-*-r7'))
    specifications = {
        ROOT: ['build-scripts/content/book-2/212', 'build-scripts/content/book-2/b2_212.py',
               'build-scripts/content/book-2/print_pipeline.py', 'scripts/validate-paragraph.js',
               'references/authored/course-target-exercises.json', 'references/authored/book-outlines',
               'references/owned/course-blueprint-pedagogical-boundaries.md'],
        LESSON: [b.LESSON_REL.as_posix(), (b.LESSON_REL.parent / '2.1.1 Kostenstructuren').as_posix(),
                 (b.LESSON_REL.parent / '_chapter-plan.md').as_posix(),
                 (b.LESSON_REL.parent.parent / '_book-plan.md').as_posix()],
    }
    inventory = []
    for repo, prefixes in specifications.items():
        ref = LBASE if repo == LESSON else PBASE
        paths = subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', '-z', ref, '--', *prefixes], cwd=repo).decode('utf-8').split('\0')
        for relative in filter(None, paths):
            path = repo / relative
            assert path.read_bytes() == old(repo, relative), relative
            inventory.append({'repo': 'lessons' if repo == LESSON else 'platform', 'path': relative, 'sha256': b.digest(path)})
    prior = list(OLDPROOF.glob('212-*-r6'))
    assert len(prior) == 3
    old_pages = {}
    for directory in prior:
        manifest = json.loads((directory / 'manifest.json').read_text(encoding='utf-8'))
        kind = directory.name.split('-')[1]
        pdf = FOLDER / (b.STEM + ' – ' + kind + '.pdf')
        assert b.digest(pdf) == manifest['pdf_sha256']
        for filename, sha in manifest['page_sha256'].items():
            assert b.digest(directory / 'pages' / filename) == sha
        old_pages[kind] = {'directory': str(directory), 'manifest_sha256': b.digest(directory / 'manifest.json'),
                           'pdf_sha256': b.digest(pdf), 'page_sha256': manifest['page_sha256']}
    assert sum(len(v['page_sha256']) for v in old_pages.values()) == 27
    save('baseline', {'platform_base': PBASE, 'lessons_base': LBASE, 'files': inventory, 'native34': native(), 'old_pages': old_pages})


def tree(node):
    if isinstance(node, NavigableString):
        text = re.sub(r'\s+', ' ', str(node)).strip()
        return ['text', text] if text else None
    if isinstance(node, Tag):
        return [node.name, dict(sorted(node.attrs.items())), [v for c in node.children if (v := tree(c)) is not None]]


def verify():
    before = json.loads((OUT / 'baseline.json').read_text(encoding='utf-8'))
    built = json.loads((OUT / 'build-r7.json').read_text(encoding='utf-8'))
    assert built['inspection_status'] == 'PENDING'
    allowed = {('platform', 'build-scripts/content/book-2/212/answers.md'),
               ('platform', 'build-scripts/content/book-2/212/test_metadata.py')}
    allowed |= {('lessons', (b.LESSON_REL / (b.STEM + ' – antwoorden.' + ext)).as_posix()) for ext in ('md', 'html', 'pdf', 'zip')}
    changes, inventory = [], []
    for record in before['files']:
        path = (LESSON if record['repo'] == 'lessons' else ROOT) / record['path']
        changed = b.digest(path) != record['sha256']
        inventory.append({**record, 'after_sha256': b.digest(path), 'changed': changed})
        if changed:
            changes.append((record['repo'], record['path']))
    assert set(changes) == allowed, changes
    t.assert_exact_sources(unittest.TestCase(), {name: (b.CONTENT / name).read_text(encoding='utf-8') for name in t.SOURCES})
    # The ten original methods stay byte-exact; metadata permits only its one method's insertion.
    assert (b.CONTENT / 'test_source.py').read_bytes() == old(ROOT, 'build-scripts/content/book-2/212/test_source.py')
    previous_test = old(ROOT, 'build-scripts/content/book-2/212/test_metadata.py').decode('utf-8')
    expected_test = previous_test.replace("            self.assertEqual(actual, source_replacement(previous), name)",
        "            expected = source_replacement(previous)\n            if name == 'answers.md':\n                from test_bonus import insertion\n                expected = insertion(expected)\n            self.assertEqual(actual, expected, name)")
    assert (b.CONTENT / 'test_metadata.py').read_text(encoding='utf-8') == expected_test
    dom, zips, pages, visuals = [], [], [], []
    for record in built['documents']:
        md = Path(record['source_md']); kind = md.stem.rsplit(' – ', 1)[1]
        previous_md = old(LESSON, md.relative_to(LESSON).as_posix()).decode('utf-8')
        assert md.read_text(encoding='utf-8') == (t.insertion(previous_md) if kind == 'antwoorden' else previous_md)
        hp = Path(record['source_html'])
        prior = BeautifulSoup(old(LESSON, hp.relative_to(LESSON).as_posix()).decode('utf-8'), 'html.parser')
        current = BeautifulSoup(hp.read_text(encoding='utf-8'), 'html.parser')
        wrapper_delta = None
        if kind == 'antwoorden':
            heading = current.find('h2', id='denkertje-bonusopgave')
            wrapper = heading.find_next('div', class_='exercise')
            assert wrapper.find('strong').get_text() == 'Opgave 8'
            labels = [p for p in wrapper.find_all('p', recursive=False) if p.get_text(' ', strip=True) == 'Beoordelingscriteria:']
            assert len(labels) == 1
            listing = labels[0].find_next_sibling('ul')
            assert listing is not None
            expected_bullets = [line[2:] for line in t.BLOCK.splitlines() if line.startswith('- ')]
            assert [re.sub(r'\s+', ' ', li.get_text(' ', strip=True)) for li in listing.find_all('li', recursive=False)] == expected_bullets
            old_wrapper = prior.find('h2', id='denkertje-bonusopgave').find_next('div', class_='exercise')
            classes_before, classes_after = old_wrapper.get('class'), wrapper.get('class')
            if classes_before != classes_after:
                assert classes_before == ['exercise', 'exercise-short'] and classes_after == ['exercise']
                assert len(old_wrapper.get_text(' ', strip=True)) < 650 <= len(wrapper.get_text(' ', strip=True))
                wrapper['class'] = classes_before
                wrapper_delta = 'Native <650-character short-wrapper classification removed after exact added content; reversed solely for complete-DOM equality.'
            labels[0].decompose(); listing.decompose()
        assert tree(prior) == tree(current), (kind, 'unexplained complete DOM delta')
        dom.append({'edition': kind, 'complete_normalized_DOM_equal_after_exact_criteria_reversal': True, 'wrapper_delta': wrapper_delta})
        names = re.findall(r'_assets/(2\.1\.2_(?:fig|we|ex)_\d+)\.svg', md.read_text(encoding='utf-8'))
        with ZipFile(Path(record['source_pdf']).with_suffix('.zip')) as archive:
            expected = {md.name, md.with_suffix('.html').name, md.with_suffix('.pdf').name} | {f'_assets/{name}.{ext}' for name in names for ext in ('svg', 'png')}
            assert set(archive.namelist()) == expected and len(archive.namelist()) == len(expected) == {'paragraaf': 19, 'opgaven': 11, 'antwoorden': 9}[kind]
            assert archive.testzip() is None
            members = []
            for name in archive.namelist():
                data = archive.read(name)
                assert data == (FOLDER / name).read_bytes()
                changed = data != old(LESSON, (b.LESSON_REL / name).as_posix())
                assert changed == (kind == 'antwoorden' and name in {md.name, md.with_suffix('.html').name, md.with_suffix('.pdf').name})
                members.append({'name': name, 'sha256': b.digest(FOLDER / name), 'changed': changed})
            zips.append({'edition': kind, 'count': len(members), 'all_current_bytes': True, 'members': members})
        proof = Path(record['proof_directory'])
        manifest = json.loads((proof / 'manifest.json').read_text(encoding='utf-8'))
        assert manifest['inspection_status'] == 'PENDING' and not manifest['pages_inspected']
        assert b.digest(Path(record['source_pdf'])) == manifest['pdf_sha256']
        for name, sha in manifest['page_sha256'].items():
            assert b.digest(proof / 'pages' / name) == sha
            old_sha = before['old_pages'][kind]['page_sha256'].get(name)
            if kind != 'antwoorden':
                assert old_sha == sha
            pages.append({'edition': kind, 'file': str(proof / 'pages' / name), 'sha256': sha, 'old_sha256': old_sha, 'changed': sha != old_sha})
        current_soup = BeautifulSoup(hp.read_text(encoding='utf-8'), 'html.parser')
        for name, figure in zip(names, current_soup.find_all('figure'), strict=True):
            assert base64.b64decode(figure.img['src'].split(',', 1)[1]) == (FOLDER / '_assets' / (name + '.png')).read_bytes()
    for name in b.asset_sources():
        png = FOLDER / '_assets' / (name + '.png')
        prior = old(LESSON, png.relative_to(LESSON).as_posix())
        with Image.open(png) as current, Image.open(io.BytesIO(prior)) as old_image:
            assert all(lo == hi == 0 for lo, hi in ImageChops.difference(current.convert('RGBA'), old_image.convert('RGBA')).getextrema())
            gray = OUT / 'grayscale' / (name + '.png')
            if gray.exists():
                raise ValueError('Fresh gray proof collision')
            gray.parent.mkdir(parents=True, exist_ok=True)
            current.convert('L').save(gray)
        visuals.append({'asset': name, 'svg_sha256': b.digest(png.with_suffix('.svg')), 'png_sha256': b.digest(png), 'pixel_max_delta': 0, 'gray': str(gray), 'gray_sha256': b.digest(gray)})
    save('mechanical-r7', {'result': 'PASS', 'inspection': 'NOT_SUPPLIED_BY_SCRIPT', 'protected_inventory': inventory,
                          'exact_changes': sorted(changes), 'source_test_bodies_preserved': 10, 'metadata_other_test_bodies_preserved': 4,
                          'DOM': dom, 'ZIP': zips, 'pages': pages, 'figures': visuals, 'native34': native()})


def rebuild():
    from print_pipeline import build_document
    before = native()
    full = b.build(LESSON)
    assert native() == before
    prints = []
    for kind in ('paragraaf', 'opgaven', 'antwoorden'):
        record = build_document(FOLDER / (b.STEM + ' – ' + kind + '.md'))
        record['zip'] = b.zip_document(record)
        prints.append(record)
    assert native() == before
    save('reproduction-r7', {'result': 'PASS', 'all34_full_native_identical': True, 'all34_print_only_identical': True,
                           'native34': before, 'full': full, 'print': prints})


def bind():
    mechanical = json.loads((OUT / 'mechanical-r7.json').read_text(encoding='utf-8'))
    reproduced = json.loads((OUT / 'reproduction-r7.json').read_text(encoding='utf-8'))
    assert native() == mechanical['native34'] == reproduced['native34']
    for row in mechanical['protected_inventory']:
        assert b.digest((LESSON if row['repo'] == 'lessons' else ROOT) / row['path']) == row['after_sha256']
    for row in mechanical['pages']:
        assert b.digest(Path(row['file'])) == row['sha256']
    for row in mechanical['figures']:
        assert b.digest(Path(row['gray'])) == row['gray_sha256']
        assert b.digest(FOLDER / '_assets' / (row['asset'] + '.png')) == row['png_sha256']
        assert b.digest(FOLDER / '_assets' / (row['asset'] + '.svg')) == row['svg_sha256']
    manifests = []
    for path in sorted(OUT.glob('212-*-r7/manifest.json')):
        manifest = json.loads(path.read_text(encoding='utf-8'))
        assert manifest['inspection_status'] == 'PENDING' and not manifest['pages_inspected']
        for name, sha in manifest['page_sha256'].items():
            assert b.digest(path.parent / 'pages' / name) == sha
        manifests.append({'path': path.relative_to(ROOT).as_posix(), 'sha256': b.digest(path), 'native_status': 'PENDING'})
    assert len(manifests) == 3
    assert len(mechanical['pages']) == 27 and len(mechanical['figures']) == 11
    changed_pages = [(row['edition'], Path(row['file']).name) for row in mechanical['pages'] if row['changed']]
    assert changed_pages == [('antwoorden', 'page-006.png')], changed_pages
    report = ROOT / 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-inspection.md'
    save('visual-binding-r7', {
        'result': 'PASS', 'role': 'builder_personal_inspection_not_independent_review_or_QC',
        'agent': 'paragraph_212_bonus_correction_builder', 'report': report.relative_to(ROOT).as_posix(),
        'report_sha256': b.digest(report), 'all_full_pages_personally_viewed': 27,
        'all_colour_figures_personally_viewed': 11, 'all_fresh_grayscale_figures_personally_viewed': 11,
        'changed_pages': changed_pages, 'native_manifests': manifests,
        'evidence': {name: b.digest(OUT / name) for name in ('baseline.json', 'build-r7.json', 'mechanical-r7.json', 'render-check-r7.json', 'reproduction-r7.json')},
        'helper_sha256': b.digest(Path(__file__)), 'native34': native(), 'pages': mechanical['pages'], 'figures': mechanical['figures'],
        'source_tests': {path.name: b.digest(path) for path in sorted(b.CONTENT.glob('test_*.py'))},
        'independent_review_and_QC': 'PENDING', 'classroom_timing': 'UNOBSERVED_54_67_77'})


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=('baseline', 'verify', 'rebuild', 'bind'))
    globals()[parser.parse_args().mode]()
