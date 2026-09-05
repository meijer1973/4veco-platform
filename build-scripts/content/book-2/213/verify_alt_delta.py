"""Immutable before/after metadata-only proof; does not supply visual approval."""
from pathlib import Path
import argparse
import hashlib
import json
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from zipfile import ZipFile
from bs4 import BeautifulSoup
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import b2_213 as b
import alt_contract as alt
from verify_rebuild import snapshot


def sha(value):
    return hashlib.sha256(value).hexdigest()


def capture(revision):
    folder = b.ROOT.parent / '4veco-lessen' / b.LESSON_REL
    proofs = b.ROOT / 'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1'
    result = {'revision': revision, 'artifacts': snapshot(folder), 'html': {},
              'svg': {}, 'pages': {}, 'protected': {}, 'zip_members': {}}
    for kind in ('paragraaf', 'opgaven', 'antwoorden'):
        stem = folder / f'{b.STEM} – {kind}'
        soup = BeautifulSoup(Path(str(stem)+'.html').read_text(encoding='utf-8'), 'html.parser')
        images = soup.find_all('img')
        result['html'][kind] = {'alts': [i['alt'] for i in images],
            'captions': [str(c) for c in soup.find_all('figcaption')],
            'caption_words': [' '.join(c.get_text().split()) for c in soup.find_all('figcaption')],
            'caption_attributes': [dict(c.attrs) for c in soup.find_all('figcaption')],
            'visible_text_sha256': sha(soup.body.get_text().encode('utf-8'))}
        for image in images:
            del image['alt']
        result['html'][kind]['without_alt_sha256'] = sha(str(soup).encode('utf-8'))
        for caption in soup.find_all('figcaption'):
            caption.attrs.pop('aria-hidden', None)
        for node in list(soup.find_all(string=True)):
            node.replace_with(re.sub(r'\s+', ' ', str(node)))
        result['html'][kind]['native_dom_sha256'] = sha(str(soup).encode('utf-8'))
        with ZipFile(Path(str(stem)+'.zip')) as archive:
            result['zip_members'][kind] = {n: {'crc': archive.getinfo(n).CRC,
                'sha256': sha(archive.read(n))} for n in archive.namelist()}
        found = list(proofs.glob(f'213-{kind}-*-{revision}/manifest.json'))
        assert len(found) == 1, (kind, 'proof count', found)
        manifest = json.loads(found[0].read_text(encoding='utf-8'))
        assert manifest['inspection_status'] == 'PENDING' and manifest['pages_inspected'] == []
        actual = {p.name: b.digest(p) for p in (found[0].parent/'pages').glob('page-*.png')}
        assert actual == manifest['page_sha256'], (kind, 'page manifest drift')
        result['pages'][kind] = actual
    for name in b.ASSETS:
        path = folder/'_assets'/f'{name}.svg'
        svg = path.read_text(encoding='utf-8')
        title = ET.fromstring(svg).find('{http://www.w3.org/2000/svg}title').text
        result['svg'][name] = {'title': title,
            'without_title_sha256': sha(re.sub(r'<title\b[^>]*>.*?</title>', '', svg).encode('utf-8'))}
    protected = [p for p, _ in b.prerequisite_pins(folder)]
    protected += [folder.parent/'2.1.2 Opbrengsten, winst en break-even'/'2.1.2 Opbrengsten, winst en break-even – paragraaf.md']
    protected += [b.ROOT/p for p in ['references/authored/course-target-exercises.json',
        'references/authored/book-outlines/book-2-outline.md',
        'references/authored/book-outlines/book-2-outline.meta.json',
        'build-scripts/content/book-2/print_pipeline.py',
        'build-scripts/content/book-2/213/answers.md',
        'build-scripts/content/book-2/213/target-answers.md']]
    protected += [p for p in folder.glob('*') if p.is_file() and
                  (p.name.endswith(('-review.md', '-quality-ref.yaml', '-textbook-handoff.md')) or p.name == 'build_pdf.py')]
    result['protected'] = {str(p): b.digest(p) for p in protected}
    return result


def verify(before, after):
    assert before['protected'] == after['protected'], 'Protected input drift'
    assert before['pages'] == after['pages'], 'Rendered page-byte drift'
    changes = [name for name, digest in before['artifacts'].items() if after['artifacts'][name] != digest]
    expected = {f'{b.STEM} – {kind}{ext}' for kind in ('paragraaf','opgaven') for ext in ('.md','.html','.zip')}
    expected.add('_assets/2.1.3_we_1.svg')
    assert set(changes) == expected, ('Unexpected artifact delta', changes)
    for kind, html in before['html'].items():
        for key in ('caption_words', 'native_dom_sha256'):
            assert html[key] == after['html'][kind][key], (kind, key, 'visible/structural drift')
        changed_indices = [i for i, old in enumerate(html['alts']) if old != after['html'][kind]['alts'][i]]
        assert changed_indices == {'paragraaf': [2,3,4], 'opgaven': [0], 'antwoorden': []}[kind]
        # Read original attributes from immutable raw caption strings. The first
        # supplemental snapshot retained mutable attrs references; normalization
        # emptied that diagnostic field, but raw captions remained exact.
        original_attrs = [dict(BeautifulSoup(c, 'html.parser').figcaption.attrs) for c in html['captions']]
        for i, attrs in enumerate(original_attrs):
            expected_attrs = dict(attrs)
            if i in changed_indices:
                assert expected_attrs.pop('aria-hidden') == 'true'
            assert expected_attrs == after['html'][kind]['caption_attributes'][i], (kind, i, 'caption attribute drift')
        oldzip, newzip = before['zip_members'][kind], after['zip_members'][kind]
        assert set(oldzip) == set(newzip), (kind, 'ZIP inventory drift')
        member_changes = {n for n in oldzip if oldzip[n] != newzip[n]}
        allowed = {f'{b.STEM} – {kind}{ext}' for ext in ('.md','.html')} | {'_assets/2.1.3_we_1.svg'}
        assert member_changes == (allowed if kind != 'antwoorden' else set()), (kind, member_changes)
    for name, svg in before['svg'].items():
        assert svg['without_title_sha256'] == after['svg'][name]['without_title_sha256'], (name, 'drawing drift')
        if name != '2.1.3_we_1':
            assert svg == after['svg'][name], (name, 'unrelated title drift')
    return {'result': 'PASS', 'changed_artifacts': changes,
        'pdf_byte_identical': 3, 'page_png_byte_identical': sum(map(len, after['pages'].values())),
        'asset_png_byte_identical': 6, 'svg_drawing_byte_identical': 6,
        'visible_html_and_full_captions': 'exact normalized DOM and caption words in all three editions; only four alt occurrences and corresponding native aria-hidden removal, with whitespace reflow',
        'protected_inputs': 'all exact raw SHA-256 equality',
        'zip_delta': 'only two student MD/HTML pairs and their we1 SVG title; unchanged inventories/other CRC and member bytes',
        'visual_inspection': 'NOT_SUPPLIED_BY_THIS_SCRIPT'}


def verify_owned_source_scope():
    base = '199772e2aa586fce0f71b647ed5188e568dba2e5'
    results = []
    for relative, names in [('build-scripts/content/book-2/213/theory.md', alt.CORRECTED[:2]),
                            ('build-scripts/content/book-2/213/exercises.md', alt.CORRECTED[2:]),
                            ('build-scripts/content/book-2/b2_213.py', ())]:
        old = subprocess.run(['git', 'show', f'{base}:{relative}'], cwd=b.ROOT,
                             check=True, capture_output=True).stdout
        new = (b.ROOT/relative).read_bytes()
        old_text = old.decode('utf-8').replace('\r\n', '\n')
        new_text = new.decode('utf-8').replace('\r\n', '\n')
        if names:
            candidate = new_text
            for name in names:
                attribute = '{alt="'+alt.SHORT_ALTS[name]+'"}'
                assert candidate.count(attribute) == 1, (relative, name, 'attribute count')
                candidate = candidate.replace(attribute, '')
            assert candidate == old_text, (relative, 'non-alt source drift')
        else:
            old_title = 'Vergelijk de drie eindpuntrijen van Lus en Bout; constante en stijgende MK'
            assert old_text.count(old_title) == 1
            assert old_text.replace(old_title, alt.TITLES['2.1.3_we_1']) == new_text, 'Generator changed beyond we1 title'
        results.append({'path': relative, 'base_commit': base, 'old_git_blob_sha256': sha(old),
                        'new_raw_sha256': sha(new), 'exact_permitted_delta': 'PASS'})
    return results


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('revision', choices=('r5','r6'))
    parser.add_argument('output', type=Path)
    parser.add_argument('--before', type=Path)
    args = parser.parse_args()
    if args.output.exists():
        raise ValueError('Use a fresh immutable evidence file')
    result = capture(args.revision)
    if args.before:
        result['comparison'] = verify(json.loads(args.before.read_text(encoding='utf-8')), result)
        result['owned_source_scope'] = verify_owned_source_scope()
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')
    print(json.dumps(result.get('comparison', {'snapshot': str(args.output), 'artifacts': len(result['artifacts']),
        'pages': sum(map(len, result['pages'].values()))}), ensure_ascii=True, indent=2))
