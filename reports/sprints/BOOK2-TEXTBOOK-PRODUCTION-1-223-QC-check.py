"""HOW TO ADAPT: copy to a new exact QC scope; never rewrite foreign evidence.

Reuses the fully read root mechanical verifier, with only own output destinations.
That reuse is attributed, not presented as independent implementation. Semantic,
mathematical and personal visual judgments are this specialist's separate work.
"""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-223-QC'
spec = importlib.util.spec_from_file_location('root223_verifier', ROOT / 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-check.py')
native = importlib.util.module_from_spec(spec)
spec.loader.exec_module(native)
native.PREFIX = PREFIX
native.PROOF = native.OUT / (PREFIX + '-evidence')


def metadata():
    from bs4 import BeautifulSoup
    rows = []
    for kind in native.KINDS:
        path = native.DEST / f'{native.builder.STEM} – {kind}.html'
        soup = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
        for number, tag in enumerate(soup.find_all('img'), 1):
            caption = tag.find_parent('figure').find('figcaption')
            value = tag.get('alt', '')
            imperative = any(v in value for v in ('Zoek eerst', 'Vergelijk afzonderlijke'))
            rows.append({'kind': kind, 'image': number, 'alt': value, 'characters': len(value),
                         'caption': caption.get_text(' ', strip=True),
                         'html_sha256': native.sha(path.read_bytes()),
                         'noun_first_functional_description': not imperative,
                         'finding': 'B223-ALT-01' if imperative else None})
    native.save('semantic-alt', {'actor': 'paragraph_214_builder', 'role': 'independent223specialistQC',
                'rows': rows, 'status': 'REVISE',
                'reason': 'Fig2 and fig4 actual HTML alternatives are imperative captions, not noun-first functional descriptions.',
                'required_fix': 'Author explicit concise noun-first alternatives, preserve full visible captions and mathematics; regenerate and independently review exact delta.'})


def grays():
    from PIL import Image
    manifest = native.read('full-manifest')
    dest = native.PROOF / 'grayscale'
    dest.mkdir(parents=True, exist_ok=False)
    rows = []
    for kind, record in zip(native.KINDS, manifest['documents']):
        directory = Path(record['proof_directory'])
        proof = json.loads((directory / 'manifest.json').read_text(encoding='utf-8'))
        for name in proof['rendered_pages']:
            source = directory / name
            target = dest / f'{kind}-{source.name}'
            with Image.open(source) as image:
                image.convert('L').save(target)
            rows.append({'kind': kind, 'source': source.relative_to(ROOT).as_posix(),
                         'source_sha256': native.sha(source.read_bytes()),
                         'grayscale': target.relative_to(ROOT).as_posix(),
                         'grayscale_sha256': native.sha(target.read_bytes())})
    for n in range(1, 5):
        source = native.DEST / f'_assets/2.2.3_fig_{n}.png'
        target = dest / f'figure-{n}.png'
        with Image.open(source) as image:
            image.convert('L').save(target)
        rows.append({'kind': 'figure', 'number': n, 'source': str(source),
                     'source_sha256': native.sha(source.read_bytes()),
                     'grayscale': target.relative_to(ROOT).as_posix(),
                     'grayscale_sha256': native.sha(target.read_bytes())})
    native.save('grayscale-binding', {'generated_only': True, 'personal_inspection': 'PENDING', 'rows': rows})


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=['baseline', 'metadata', 'tests', 'full', 'thin', 'print', 'native', 'gates', 'integrity', 'grays'])
    mode = parser.parse_args().mode
    if mode == 'baseline':
        native.baseline()
    elif mode == 'metadata':
        metadata()
    elif mode == 'tests':
        native.command('tests', [sys.executable, '-m', 'unittest', 'discover', '-s', 'build-scripts/content/book-2/223', '-p', 'test_*.py', '-v'])
    elif mode in ['full', 'thin', 'print']:
        native.reproduce(mode)
    elif mode == 'native':
        native.command('native-process', [sys.executable, 'build-scripts/content/book-2/223/check_render.py', '--lesson-root', str(native.LONG),
                       '--manifest', str(native.OUT / f'{PREFIX}-full-manifest.json'), '--rebuild',
                       '--output', str(native.OUT / f'{PREFIX}-native-check.json')])
    elif mode == 'gates':
        native.gates()
    elif mode == 'grays':
        grays()
    else:
        native.integrity()
