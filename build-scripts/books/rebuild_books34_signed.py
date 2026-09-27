"""Rebuild the eight signed-retrieval substitutions with explicit answer renders.

Run a same-environment baseline first in a separate copied edition, then the
revision with --comparison-root pointing to that rebuilt baseline lesson root.
The immutable received libraries and existing platform assembly/record templates
are reused. Regenerated dependencies outside the finite content set are restored
only after exact text/pixel/navigation or text-byte equivalence is established.
"""
from pathlib import Path
import argparse
import importlib
import json
import os
import runpy
import sys

from books34_signed_common import (HERE, PLATFORM, CONTRACT, EDITION, REVISION, PUBLICATIONS,
                                   PINS, require, sources, targets, pdf_equal, sha, write_json, input_guard,
                                   BASELINE_RECEIPT, baseline_receipt, authenticate_baseline)


def build(lessons, report, baseline=False, comparison=None):
    root = lessons / EDITION
    authenticated = None if baseline else authenticate_baseline(comparison, lessons)
    sources(lessons, baseline)
    input_guard(lessons, baseline, PLATFORM.parent/'4veco-lessen' if baseline else lessons)
    for name in ('render.py', 'content.py', 'export_paragraphs.py', 'preview_targets.py'):
        require((root/'build'/name).read_bytes() == (PLATFORM/'references/staged/books34-v3/build'/name).read_bytes(),
                'Changed immutable received library '+name)
    sys.path.insert(0, str(root/'build'))
    renderer = importlib.import_module('render')
    require(renderer.ROOT.resolve() == root.resolve(), 'Wrong renderer root; use a separate process')
    before = {p.relative_to(root).as_posix(): p.read_bytes() for p in root.rglob('*') if p.is_file() and '__pycache__' not in p.parts}
    results, order = [], []
    for chapter in ('3.1', '3.2', '3.3', '4.1'):
        current = renderer.build_chapter(chapter, ('answer',))
        expected = {'3.1': 31, '3.2': 22, '3.3': 17, '4.1': 26}[chapter]
        require(current[0]['pages'] == expected, 'Changed answer pagination '+chapter)
        results.extend(current)
        order.append('answer:'+chapter)
    for chapter in ('3.2', '3.3'):
        current = renderer.build_chapter(chapter, ('student',))
        require(not current[0]['overflow'], 'Student overflow '+chapter)
        results.extend(current)
        order.append('student:'+chapter)
    order.append('assemble')
    runpy.run_path(str(HERE/'books34_assemble.py'), run_name='__main__')
    order.append('records')
    runpy.run_path(str(HERE/'books34_records.py'), run_name='__main__')
    runpy.run_path(str(root/'build/export_paragraphs.py'), run_name='__main__')
    runpy.run_path(str(root/'build/preview_targets.py'), run_name='__main__')
    pin_check = None if baseline else targets(lessons)
    retained = PUBLICATIONS | PINS | {'curriculum/book-page-map-v3.json'}
    regenerated, restored = [], []
    after = {p.relative_to(root).as_posix(): p for p in root.rglob('*') if p.is_file() and '__pycache__' not in p.parts}
    require(set(before) == set(after), 'Unexpected build inventory addition/removal')
    for name, file in after.items():
        if file.read_bytes() == before[name]:
            continue
        regenerated.append(name)
        if not baseline and name not in retained:
            expected = comparison / EDITION / name
            require(expected.is_file(), 'Missing same-environment dependency '+name)
            pages = None
            if file.suffix == '.pdf':
                pages = pdf_equal(expected, file)
            else:
                require(expected.read_bytes() == file.read_bytes(), 'Unexpected generated dependency text '+name)
            file.write_bytes(before[name])
            restored.append({'path': name, 'comparison': 'same-environment baseline', 'pixel_pages': pages,
                             'restored_sha256': sha(before[name])})
    if baseline:
        write_json(lessons/BASELINE_RECEIPT, baseline_receipt(lessons))
    write_json(report, {'revision': REVISION, 'baseline_reproduction': baseline, 'comparison_baseline': authenticated, 'order': order,
                       'explicit_chapter_builds': results, 'rebuilt_content_publications': sorted(PUBLICATIONS),
                       'byte_changed_by_build': sorted(regenerated), 'equivalent_dependencies_restored': restored,
                       'target_preservation': pin_check})


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--lesson-root', type=Path, default=PLATFORM.parent/'4veco-lessen')
    ap.add_argument('--report', type=Path, required=True)
    ap.add_argument('--baseline', action='store_true')
    ap.add_argument('--comparison-root', type=Path)
    args = ap.parse_args()
    if not args.baseline and not args.comparison_root:
        ap.error('--comparison-root required for a revision build')
    os.environ['PYTHONUTF8'] = '1'
    os.environ['PYTHONDONTWRITEBYTECODE'] = '1'
    sys.dont_write_bytecode = True
    build(args.lesson_root.resolve(), args.report, args.baseline,
          args.comparison_root.resolve() if args.comparison_root else None)
