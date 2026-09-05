"""Bounded §221 R8 mechanical evidence; never supplies visual/review acceptance."""
import argparse
import hashlib
import json
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path

from bs4 import BeautifulSoup
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[2]
LESSON = ROOT.parent / '4veco-lessen'
sys.path.insert(0, str(ROOT / 'build-scripts/content/book-2'))
import b2_221 as builder

PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-221-ALT-'
EVIDENCE = ROOT / 'reports/sprints'
PBASE = '199772e2aa586fce0f71b647ed5188e568dba2e5'
LBASE = '4c4cd7d0c1d2e5242c818399a96dce3e26013e9c'
CAPTION = 'Vergelijk de procentuele reacties op dezelfde schaal.'
ALT = 'Procentuele prijs- en hoeveelheidsreacties op dezelfde schaal.'
OLD_TITLE = 'Vergelijk de procentuele prijs- en hoeveelheidsveranderingen met teken'
TITLE = 'Procentuele prijs- en hoeveelheidsveranderingen met teken op één schaal'


def sha(data):
    return hashlib.sha256(data).hexdigest()


def save(name, result):
    path = EVIDENCE / (PREFIX + name + '.json')
    if path.exists():
        raise ValueError(f'Immutable evidence collision: {path}')
    path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    print(json.dumps({'record': str(path), 'sha256': builder.digest(path)}, indent=2))


def baseline():
    folder = LESSON / builder.LESSON_REL
    paths = list(folder.rglob('*')) + [folder.parent / '_chapter-plan.md']
    paths += [ROOT / 'build-scripts/content/book-2' / name for name in ('b2_221.py', 'print_pipeline.py')]
    paths += list((ROOT / 'build-scripts/content/book-2/221').glob('*'))
    paths += [ROOT / name for name in (
        'references/authored/course-target-exercises.json',
        'references/authored/book-outlines/book-2-outline.md',
        'references/authored/book-outlines/book-2-outline.meta.json',
        'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-22-owner-authorization.md',
        'reports/sprints/BOOK2-TARGET-INTEGRATION-1-owner-authorization.md')]
    proof = ROOT / 'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1'
    for directory in proof.glob('221-*-r7'):
        paths += list(directory.rglob('*'))
    records = []
    for path in sorted(set(paths)):
        if not path.is_file() or '__pycache__' in path.parts:
            continue
        repo = 'lessons' if path.is_relative_to(LESSON) else 'platform'
        records.append({'repo': repo, 'path': path.relative_to(LESSON if repo == 'lessons' else ROOT).as_posix(),
                        'sha256': builder.digest(path)})
    assert len(list(proof.glob('221-*-r7'))) == 3
    assert not list(proof.glob('221-*-r8'))
    save('baseline-r8', {'platform_base': PBASE, 'lesson_base': LBASE,
        'snapshot': 'Before two metadata edits; new regression tests already present and failing.',
        'files': records, 'zip_files_in_221': [str(p) for p in folder.rglob('*.zip')]})


def old(repo, relative):
    return subprocess.check_output(['git', 'show', (LBASE if repo == LESSON else PBASE) + ':' + relative], cwd=repo)


def verify():
    before = json.loads((EVIDENCE / (PREFIX + 'baseline-r8.json')).read_text(encoding='utf-8'))
    build = json.loads((EVIDENCE / (PREFIX + 'build-r8.json')).read_text(encoding='utf-8'))
    assert build['inspection_status'] == 'PENDING'
    folder = LESSON / builder.LESSON_REL
    changes = []
    inventory = []
    for record in before['files']:
        repo = LESSON if record['repo'] == 'lessons' else ROOT
        current = builder.digest(repo / record['path'])
        inventory.append({**record, 'after_sha256': current, 'changed': current != record['sha256']})
        if current != record['sha256']:
            changes.append((record['repo'], record['path']))
    allowed = {
        ('platform', 'build-scripts/content/book-2/b2_221.py'),
        ('platform', 'build-scripts/content/book-2/221/theory.md'),
        ('platform', 'build-scripts/content/book-2/221/test_source.py'),
        ('lessons', (builder.LESSON_REL / (builder.STEM + ' – paragraaf.md')).as_posix()),
        ('lessons', (builder.LESSON_REL / (builder.STEM + ' – paragraaf.html')).as_posix()),
        ('lessons', (builder.LESSON_REL / '_assets/2.2.1_fig_1.svg').as_posix()),
    }
    assert set(changes) == allowed, changes
    replacement = {
        'build-scripts/content/book-2/b2_221.py': (OLD_TITLE, TITLE),
        'build-scripts/content/book-2/221/theory.md':
            (f'![{CAPTION}](_assets/2.2.1_fig_1.svg)', f'![{CAPTION}](_assets/2.2.1_fig_1.svg){{alt="{ALT}"}}'),
    }
    for relative, (a, b) in replacement.items():
        source = old(ROOT, relative).decode('utf-8')
        assert source.count(a) == 1
        assert source.replace(a, b) == (ROOT / relative).read_text(encoding='utf-8')
    assert before['zip_files_in_221'] == [] and not list(folder.rglob('*.zip'))
    alternatives, titles, pixels, pages = [], [], [], []
    for record in build['documents']:
        kind = Path(record['source_pdf']).stem.rsplit(' – ', 1)[1]
        for extension in ('md', 'html', 'pdf'):
            path = folder / (builder.STEM + ' – ' + kind + '.' + extension)
            previous = old(LESSON, path.relative_to(LESSON).as_posix())
            if kind == 'paragraaf' and extension in ('md', 'html'):
                a, b = replacement['build-scripts/content/book-2/221/theory.md'] if extension == 'md' else (f'alt="{CAPTION}"', f'alt="{ALT}"')
                assert previous.decode('utf-8').count(a) == 1
                expected = previous.decode('utf-8').replace(a, b)
                if extension == 'html':
                    # Actual Pandoc native-alt behavior: caption is no longer
                    # hidden as a duplicate alternative; source wrapping shifts.
                    # Enumerate exact bytes, do not loosen the DOM comparison.
                    old_caption = '<figcaption aria-hidden="true">Vergelijk de procentuele reacties op\ndezelfde schaal.</figcaption>'
                    new_caption = '<figcaption>Vergelijk de procentuele reacties op dezelfde\nschaal.</figcaption>'
                    assert expected.count(old_caption) == 1
                    expected = expected.replace(old_caption, new_caption)
                assert expected == path.read_text(encoding='utf-8'), (kind, extension)
            else:
                assert previous == path.read_bytes(), (kind, extension)
        soup = BeautifulSoup(Path(record['source_html']).read_text(encoding='utf-8'), 'html.parser')
        for figure in soup.find_all('figure'):
            alt, caption = figure.img['alt'], ' '.join(figure.figcaption.get_text(' ', strip=True).split())
            assert 0 < len(alt) <= 120 and not alt.startswith(('Vergelijk', 'Bekijk', 'Zie', 'Afbeelding van'))
            alternatives.append({'edition': kind, 'alt': alt, 'characters': len(alt), 'full_caption': caption})
        if kind == 'paragraaf':
            assert soup.find('figure').img['alt'] == ALT
            assert ' '.join(soup.find('figure').figcaption.get_text(' ', strip=True).split()) == CAPTION
        new_dir = Path(record['proof_directory'])
        old_dir = new_dir.parent / new_dir.name.replace('-r8', '-r7')
        new_manifest = json.loads((new_dir / 'manifest.json').read_text(encoding='utf-8'))
        old_manifest = json.loads((old_dir / 'manifest.json').read_text(encoding='utf-8'))
        assert new_manifest['inspection_status'] == 'PENDING' and new_manifest['pages_inspected'] == []
        assert new_manifest['page_sha256'] == old_manifest['page_sha256']
        for relative in new_manifest['rendered_pages']:
            assert (old_dir / relative).read_bytes() == (new_dir / relative).read_bytes()
            pages.append({'edition': kind, 'page': relative, 'sha256': builder.digest(new_dir / relative), 'unchanged_bytes': True})
    for stem, source in builder.asset_sources().items():
        svg = folder / '_assets' / (stem + '.svg')
        assert svg.read_text(encoding='utf-8') == source
        title = ET.fromstring(source).find('{http://www.w3.org/2000/svg}title').text
        assert 0 < len(title) <= 120 and not title.startswith(('Vergelijk', 'Bekijk', 'Zie', 'Afbeelding van'))
        titles.append({'asset': stem, 'title': title, 'characters': len(title)})
        previous = old(LESSON, svg.relative_to(LESSON).as_posix()).decode('utf-8')
        assert previous.replace(OLD_TITLE, TITLE) == source
        with tempfile.TemporaryDirectory(prefix='book2-221-alt-parity-') as directory:
            regenerated = Path(directory) / 'figure.png'
            subprocess.run([sys.executable, '-m', 'cairosvg', str(svg), '-o', str(regenerated), '-s', '2'], check=True)
            png = svg.with_suffix('.png')
            with Image.open(png) as actual, Image.open(regenerated) as fresh:
                assert actual.size == fresh.size
                extrema = ImageChops.difference(actual.convert('RGBA'), fresh.convert('RGBA')).getextrema()
                assert all(low == high == 0 for low, high in extrema), extrema
            assert png.read_bytes() == regenerated.read_bytes()
            pixels.append({'asset': stem, 'png_sha256': builder.digest(png), 'max_channel_delta': 0, 'byte_equal': True})
    save('mechanical-r8', {'status': 'PASS', 'visual_acceptance': 'NOT_SUPPLIED',
        'inventory': inventory, 'exact_changes': sorted(allowed), 'all_html_alternatives': alternatives,
        'all_svg_titles': titles, 'asset_rerasterization': pixels, 'all_twenty_pages': pages,
        'all_three_pdfs_byte_unchanged': True, 'all_full_figcaption_words_and_punctuation_preserved': True,
        'exact_html_changes': ['first img alt', 'native removal of first figcaption aria-hidden=true',
                               'first figcaption source soft-wrap moved; every word and punctuation unchanged'],
        'zip_applicability': 'No ZIP files in §221 baseline or final; not applicable',
        'independent_review_and_specialist_QC': 'PENDING'})


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=('baseline', 'verify'))
    globals()[parser.parse_args().mode]()
