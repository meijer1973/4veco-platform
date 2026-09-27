"""Finite Books 3/4 retrieval revision; no curriculum or historical promotion."""
from pathlib import Path
import hashlib
import json
import re
import subprocess
import os
import sys
import importlib.metadata

import fitz
from bs4 import BeautifulSoup

HERE = Path(__file__).resolve().parent
PLATFORM = HERE.parents[1]
CONTRACT = json.loads((HERE / 'books34-signed-contract.json').read_text(encoding='utf-8'))
BASE = CONTRACT['lessons_main']
EDITION = 'edities/books34-v3'
REVISION = 'books34-signed-retrieval-20260926'
PUBLICATIONS = {row['path'] for row in CONTRACT['content_dependent_publication_derivatives_29']}
PINS = set(CONTRACT['source_pin_records_to_refresh_20'])
METADATA = {'README.md', 'build/build_all.py', 'SIGNED-RETRIEVAL-2026-09-26.md',
            'checks/signed-retrieval-build.json', 'checks/signed-retrieval-verification.json',
            'checks/signed-retrieval-environment.json'}
BASELINE_RECEIPT = '.books34-signed-baseline.json'


def require(condition, message):
    if not condition:
        raise ValueError(message)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def write_json(file, value):
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')


def original(lessons, file):
    return subprocess.check_output(['git', 'show', BASE+':'+file], cwd=lessons)


def edition_hashes(lessons):
    return {p.relative_to(lessons/EDITION).as_posix(): sha(p.read_bytes())
            for p in sorted((lessons/EDITION).rglob('*')) if p.is_file() and '__pycache__' not in p.parts}


def tool_hashes():
    names = ['books34-signed-contract.json', 'books34_signed_common.py', 'rebuild_books34_signed.py',
             'books34_assemble.py', 'books34_records.py', 'requirements-exercise-routes.txt']
    return {name: sha((HERE/name).read_bytes()) for name in names}


def environment():
    config = os.environ.get('FONTCONFIG_FILE')
    fonts = Path(config).parent/'fonts' if config else None
    return {'python': sys.version, 'platform': sys.platform,
            'packages': {name: importlib.metadata.version(name) for name in
                         ('weasyprint', 'PyMuPDF', 'beautifulsoup4', 'pydyf', 'fonttools')},
            'fontconfig_sha256': sha(Path(config).read_bytes()) if config else None,
            'fonts': {p.name: sha(p.read_bytes()) for p in sorted(fonts.rglob('*')) if p.is_file()}
                     if fonts and fonts.is_dir() else {},
            'native_dlls': {p.name: sha(p.read_bytes()) for p in sorted(Path(os.environ['WEASYPRINT_DLL_DIRECTORIES']).glob('*.dll'))}
                           if os.environ.get('WEASYPRINT_DLL_DIRECTORIES') else {}}


def baseline_receipt(lessons):
    return {'revision': REVISION, 'baseline_lesson_commit': BASE, 'input_guard_passed': True,
            'source_hashes': {row['path']: row['baseline_sha256'] for row in CONTRACT['source_bindings']},
            'tools': tool_hashes(), 'environment': environment(), 'outputs': edition_hashes(lessons)}


def authenticate_baseline(comparison, lessons):
    require(comparison is not None and comparison.is_dir(), 'Missing rebuilt baseline')
    require(comparison.resolve() != lessons.resolve() and not comparison.samefile(lessons),
            'Baseline and revision must use distinct roots')
    sources(comparison, baseline=True)
    receipt_file = comparison/BASELINE_RECEIPT
    require(receipt_file.is_file(), 'Missing builder-owned baseline receipt')
    receipt = json.loads(receipt_file.read_text(encoding='utf-8'))
    require(receipt == baseline_receipt(comparison), 'Stale baseline outputs/tools/environment receipt')
    return {'baseline_lesson_commit': BASE, 'receipt_sha256': sha(receipt_file.read_bytes()),
            'output_files': len(receipt['outputs']), 'sources_authenticated': 6,
            'same_environment': True, 'builder_tools_match': True}


def input_guard(lessons, baseline=False, git_root=None):
    repository = git_root or lessons
    raw = subprocess.check_output(['git', 'ls-tree', '-r', '-z', BASE, '--', EDITION], cwd=repository).decode('utf-8')
    expected = {row.split('\t')[1][len(EDITION)+1:]: row.split('\t')[0].split()[2] for row in raw.split('\0') if row}
    allowed = set() if baseline else PUBLICATIONS | PINS | METADATA | {'curriculum/book-page-map-v3.json'} | {
        row['path'][len(EDITION)+1:] for row in CONTRACT['source_bindings']}
    actual = {p.relative_to(lessons/EDITION).as_posix(): p for p in (lessons/EDITION).rglob('*') if p.is_file() and '__pycache__' not in p.parts}
    require(set(expected)-set(actual) == set(), 'Removed edition input')
    for name, file in actual.items():
        if name in allowed:
            continue
        data = file.read_bytes()
        blob = hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
        require(expected.get(name) == blob, 'Unlisted edition input '+name)


def sources(lessons, baseline=False):
    checked = []
    for row in CONTRACT['source_bindings']:
        data = (lessons / row['path']).read_bytes()
        require(sha(data) == row['baseline_sha256' if baseline else 'proposed_sha256'], 'Unapproved source bytes: '+row['path'])
        if not baseline:
            restored = data.decode('utf-8')
            for edit in reversed(CONTRACT['source_edits']):
                if edit['path'] == row['path']:
                    require(restored.count(edit['new']) == 1, 'Missing/duplicate approved wording: '+edit['question'])
                    restored = restored.replace(edit['new'], edit['old'], 1)
            require(sha(restored.encode('utf-8')) == row['baseline_sha256'], 'Non-wording source delta')
        checked.append(row['path'])
    return checked


def targets(lessons):
    root = lessons / EDITION
    combined_path = EDITION+'/curriculum/course-target-exercises-books34-v3.json'
    previous = json.loads(original(lessons, combined_path))
    current = json.loads((lessons / combined_path).read_text(encoding='utf-8'))
    expected = json.loads(json.dumps(previous))
    refreshed_answers, refreshed_manuscripts = [], []
    for record in expected['records']:
        pid = record['id']
        if 'curriculum/targets/'+pid+'.json' in PINS:
            record['source_pin']['answer_file_sha256'] = sha((root / record['source_pin']['answer_file']).read_bytes())
            refreshed_answers.append(pid)
        if pid in ('3.2.3', '3.3.3'):
            record['source_pin']['student_manuscript_sha256'] = sha((root / record['source_pin']['student_file']).read_bytes())
            refreshed_manuscripts.append(pid)
        individual = json.loads((root / ('curriculum/targets/'+pid+'.json')).read_text(encoding='utf-8'))
        require(individual == record, 'Changed/stale target record '+pid)
        for field, source in [('answer_file_sha256', 'answer_file'), ('student_manuscript_sha256', 'student_file')]:
            require(individual['source_pin'][field] == sha((root / individual['source_pin'][source]).read_bytes()), 'Source pin does not match actual file '+pid)
    require(current == expected, 'Changed target payload/status/combined projection')
    require(len(refreshed_answers) == 19 and len(refreshed_manuscripts) == 2, 'Unexpected pin inventory')
    return {'targets_preserved': 31, 'answer_pins': refreshed_answers, 'manuscript_pins': refreshed_manuscripts}


def navigation(doc):
    def value(v):
        if isinstance(v, (fitz.Rect, fitz.Point)):
            return list(v)
        return v
    return {'toc': doc.get_toc(), 'links': [[{k: value(v) for k, v in link.items() if k not in ('xref', 'id')}
                                          for link in page.get_links()] for page in doc]}


def pdf_equal(before, after):
    with fitz.open(before) as left, fitz.open(after) as right:
        require(len(left) == len(right), 'Changed dependency pagination '+str(after))
        require(navigation(left) == navigation(right), 'Changed dependency navigation '+str(after))
        for index, (a, b) in enumerate(zip(left, right, strict=True), 1):
            require(a.rect == b.rect and a.get_text() == b.get_text(), f'Changed dependency text {after} p{index}')
            require(a.get_pixmap().samples == b.get_pixmap().samples, f'Changed dependency pixels {after} p{index}')
        return len(left)


def squash(text):
    return re.sub(r'\s+', '', text)


def pdf_delta(before, after, edits, pixels=True):
    """Require unchanged characters after inverse edits, and exact other pixels."""
    replacements = [(squash(BeautifulSoup(e['new'], 'html.parser').get_text()),
                     squash(BeautifulSoup(e['old'], 'html.parser').get_text())) for e in edits]
    with fitz.open(before) as left, fitz.open(after) as right:
        require(len(left) == len(right), 'Changed pagination '+str(after))
        require(navigation(left) == navigation(right), 'Changed navigation '+str(after))
        changed = []
        for index, (a, b) in enumerate(zip(left, right, strict=True), 1):
            old, new = squash(a.get_text()), squash(b.get_text())
            restored = new
            if old != new:
                for replacement, previous in replacements:
                    if previous in old:
                        restored = restored.replace(replacement, previous)
            require(restored == old, f'Unapproved PDF text delta {after} p{index}')
            if old != new:
                changed.append(index)
            elif pixels:
                require(a.get_pixmap().samples == b.get_pixmap().samples, f'Changed unedited pixels {after} p{index}')
        return {'pages': len(left), 'changed_pages': changed, 'unchanged_pixel_pages': len(left)-len(changed) if pixels else None,
                'navigation_preserved': True, 'pixel_comparison': 'same-environment baseline' if pixels else 'not_claimed_against_historical_render_environment'}
