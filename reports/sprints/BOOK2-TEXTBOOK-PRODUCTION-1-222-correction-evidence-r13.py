"""Bounded R12/R13 snapshot and mechanical delta proof; never review acceptance."""
import argparse
import hashlib
import json
import re
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path

from bs4 import BeautifulSoup, Tag
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'build-scripts/content/book-2'))
import b2_222 as b
sys.path.insert(0, str(b.CONTENT))
from check_render import relocate_manifest

PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-222-'
CAPTION = ('Concert: de nieuwe rechthoek is hoger maar kleiner van oppervlak. '
           'De gemeten interval-Ev is geen bewijs van de lokale classificatie bij elke prijs.')
ALT = 'Omzetrechthoeken van het concert: na de prijsstijging is de omzet lager, ondanks interval-Ev = −0,8.'
PAIRS = [
    ('b) Schaatsbaan: %ΔP = (11 − 10) / 10 × 100% = +10%;\n'
     '%ΔQ = (95 − 100) / 100 × 100% = −5%.',
     'b) Schaatsbaan: %ΔQ = (95 − 100) / 100 × 100% = −5%;\n'
     '%ΔP = (11 − 10) / 10 × 100% = +10%.'),
    ('Badmintonhal: %ΔP = (9 − 10) / 10 × 100% = −10%;\n'
     '%ΔQ = (120 − 100) / 100 × 100% = +20%.',
     'Badmintonhal: %ΔQ = (120 − 100) / 100 × 100% = +20%;\n'
     '%ΔP = (9 − 10) / 10 × 100% = −10%.')]


def sha(value):
    return hashlib.sha256(value).hexdigest()


def filehash(path):
    return sha(path.read_bytes())


def norm(value):
    return re.sub(r'\s+', ' ', value).strip()


def tree(node):
    if not isinstance(node, Tag):
        return norm(str(node)) or None
    attrs = dict(node.attrs)
    if 'src' in attrs:
        attrs['src'] = sha(attrs['src'].encode())
    children = [tree(child) for child in node.children]
    return [node.name, attrs, [child for child in children if child is not None]]


def domhash(soup):
    return sha(json.dumps(tree(soup), ensure_ascii=False, sort_keys=True).encode())


def html_info(path):
    soup = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
    figures = [{'alt': im.get('alt'), 'caption': norm(im.find_parent('figure').figcaption.get_text()),
                'caption_attrs': im.find_parent('figure').figcaption.attrs}
               for im in soup.find_all('img')]
    return {'dom_sha256': domhash(soup), 'figures': figures}


def snapshot(lesson):
    dest = lesson / b.LESSON_REL
    sources = [b.ROOT / 'build-scripts/content/book-2/b2_222.py',
               b.ROOT / 'build-scripts/content/book-2/print_pipeline.py',
               *[b.CONTENT / name for name in ('theory.md', 'exercises.md', 'answers.md',
                                              'target-answers.md', 'test_source.py', 'check_render.py')]]
    return {
        'source_sha256': {str(p.relative_to(ROOT)): filehash(p) for p in sources},
        'lesson_sha256': {str(p.relative_to(lesson)): filehash(p) for p in dest.rglob('*') if p.is_file()},
        'authored_text': {name: (b.CONTENT / name).read_text(encoding='utf-8') for name in ('answers.md', 'exercises.md')},
        'html': {kind: html_info(dest / f'{b.STEM} – {kind}.html') for kind in ('paragraaf', 'opgaven', 'antwoorden')},
        'svg_titles': {p.name: ET.fromstring(p.read_text(encoding='utf-8')).find('{http://www.w3.org/2000/svg}title').text
                       for p in (dest / '_assets').glob('*.svg')},
    }


def capture_before(lesson):
    assert not list((ROOT / 'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1').glob('222-*-r13'))
    assert not (ROOT / 'reports/sprints' / f'{PREFIX}build-r13.json').exists()
    result = snapshot(lesson)
    paths = [p for p in (ROOT / 'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1').glob('222-*/**/*') if p.is_file()]
    paths += [p for p in (ROOT / 'reports/sprints').glob(f'{PREFIX}*')
              if p.is_file() and 'correction' not in p.name and 'CORRECTION' not in p.name]
    paths += [ROOT / p for p in ('references/authored/course-target-exercises.json',
               'references/authored/book-outlines/book-2-outline.md',
               'references/authored/book-outlines/book-2-outline.meta.json')]
    result['preserved_platform_sha256'] = {str(p.relative_to(ROOT)): filehash(p) for p in paths}
    result['chapter_plan_sha256'] = filehash((lesson / b.LESSON_REL).parent / '_chapter-plan.md')
    result['platform_base'] = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()
    result['lesson_base'] = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=lesson, text=True).strip()
    return result


def prove_after(lesson, before):
    result = snapshot(lesson)
    for relative, expected in before['preserved_platform_sha256'].items():
        assert filehash(ROOT / relative) == expected, relative
    assert filehash((lesson / b.LESSON_REL).parent / '_chapter-plan.md') == before['chapter_plan_sha256']
    for relative, expected in before['source_sha256'].items():
        if Path(relative).name not in ('answers.md', 'exercises.md', 'test_source.py'):
            assert filehash(ROOT / relative) == expected, relative
    expected_answers = before['authored_text']['answers.md']
    for old, new in PAIRS:
        assert expected_answers.count(old) == 1
        expected_answers = expected_answers.replace(old, new)
    assert result['authored_text']['answers.md'] == expected_answers
    old_figure = f'![{CAPTION}](_assets/2.2.2_we_1.svg)'
    assert before['authored_text']['exercises.md'].count(old_figure) == 1
    assert result['authored_text']['exercises.md'] == before['authored_text']['exercises.md'].replace(
        old_figure, old_figure + '{alt="' + ALT + '"}')
    del result['authored_text']
    dest = lesson / b.LESSON_REL
    dom_delta = {}
    for kind in ('paragraaf', 'opgaven'):
        old_info, new_info = before['html'][kind], result['html'][kind]
        assert len(old_info['figures']) == len(new_info['figures'])
        soup = BeautifulSoup((dest / f'{b.STEM} – {kind}.html').read_text(encoding='utf-8'), 'html.parser')
        for index, image in enumerate(soup.find_all('img')):
            old, new = old_info['figures'][index], new_info['figures'][index]
            assert new['caption'] == old['caption']
            assert 0 < len(new['alt']) <= 120
            assert new['alt'].startswith(('Oude omzet', 'Exacte oude', 'Schematisch overzicht', 'Omzetrechthoeken'))
            if old['alt'] == CAPTION:
                assert new['alt'] == ALT and new['caption'] == CAPTION
                assert old['caption_attrs'] == {'aria-hidden': 'true'}
                assert new['caption_attrs'] == {}
                image['alt'] = old['alt']
                image.find_parent('figure').figcaption['aria-hidden'] = 'true'
            else:
                assert new == old
        assert domhash(soup) == old_info['dom_sha256'], kind
        dom_delta[kind] = ['concert img.alt', 'concert figcaption aria-hidden=true removed',
                           'HTML source whitespace reflow only beyond these attributes']
        assert filehash(dest / f'{b.STEM} – {kind}.pdf') == before['lesson_sha256'][str((dest / f'{b.STEM} – {kind}.pdf').relative_to(lesson))]
    assert result['svg_titles'] == before['svg_titles']
    for title in result['svg_titles'].values():
        assert 0 < len(title) <= 120
        assert title.startswith(('Oude omzet', 'Twee aparte zaken', 'Schematische lokale omzetregel', 'Concert:'))
    for relative, expected in before['lesson_sha256'].items():
        if not Path(relative).name.startswith(b.STEM + ' – '):
            assert filehash(lesson / relative) == expected, relative
    with tempfile.TemporaryDirectory(prefix='222-r13-svg-proof-') as temp:
        for svg in (dest / '_assets').glob('*.svg'):
            generated = Path(temp) / svg.with_suffix('.png').name
            subprocess.run([sys.executable, '-m', 'cairosvg', str(svg), '-o', str(generated), '-s', '2'], check=True)
            assert filehash(generated) == filehash(svg.with_suffix('.png'))
            with Image.open(generated) as expected, Image.open(svg.with_suffix('.png')) as actual:
                assert ImageChops.difference(expected.convert('RGBA'), actual.convert('RGBA')).getbbox() is None
    old = relocate_manifest(json.loads((ROOT / 'reports/sprints' / f'{PREFIX}build-r12.json').read_text()), lesson)
    new = relocate_manifest(json.loads((ROOT / 'reports/sprints' / f'{PREFIX}build-r13.json').read_text()), lesson)
    transitions = []
    for old_doc, new_doc in zip(old['documents'], new['documents']):
        old_dir, new_dir = Path(old_doc['proof_directory']), Path(new_doc['proof_directory'])
        old_manifest = json.loads((old_dir / 'manifest.json').read_text())
        new_manifest = json.loads((new_dir / 'manifest.json').read_text())
        assert new_manifest['inspection_status'] == 'PENDING' and new_manifest['pages_inspected'] == []
        assert old_manifest['page_sha256'].keys() == new_manifest['page_sha256'].keys()
        for page in old_manifest['page_sha256']:
            old_hash, new_hash = filehash(old_dir / 'pages' / page), filehash(new_dir / 'pages' / page)
            assert old_hash == old_manifest['page_sha256'][page]
            assert new_hash == new_manifest['page_sha256'][page]
            transitions.append({'edition': new_dir.name.split('-')[1], 'page': page,
                                'before': old_hash, 'after': new_hash, 'changed': old_hash != new_hash})
    assert len(transitions) == 21
    result.update(status='PASS', boundary='Mechanical builder evidence only; independent rereview/QC pending.',
                  dom_delta=dom_delta, page_transitions=transitions, svg_png_tolerance=0,
                  preserved_history_file_count=len(before['preserved_platform_sha256']))
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=['before', 'after'])
    parser.add_argument('--lesson-root', type=Path, default=ROOT.parent / '4veco-lessen')
    args = parser.parse_args()
    output = ROOT / 'reports/sprints' / f'{PREFIX}correction-{args.mode}-r13.json'
    assert not output.exists(), 'Snapshot is immutable; choose a new explicit evidence file for a new experiment'
    if args.mode == 'before':
        result = capture_before(args.lesson_root.resolve())
    else:
        before = json.loads((output.parent / f'{PREFIX}correction-before-r13.json').read_text(encoding='utf-8'))
        result = prove_after(args.lesson_root.resolve(), before)
    output.write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n', encoding='utf-8', newline='\n')
    print(json.dumps({'output': str(output), 'sha256': filehash(output), 'status': result.get('status', 'SNAPSHOT'),
                      'page_changes': [p for p in result.get('page_transitions', []) if p['changed']]}))
