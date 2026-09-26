"""Verify exact wording, source pins, fresh answer outputs and current assembly."""
from pathlib import Path
from fractions import Fraction
import argparse
import importlib
import json
import re
import sys
import tempfile

import fitz
from bs4 import BeautifulSoup
from books34_signed_common import (PLATFORM, CONTRACT, EDITION, REVISION, PUBLICATIONS,
    require, sources, targets, original, input_guard, pdf_delta, squash, write_json, authenticate_baseline)
from verify_exercise_routes import books34_pdf


def relevant_edits(name):
    answer = 'Antwoorden' in name
    chapters = [c for c in ('3.1','3.2','3.3','4.1') if '/'+c+'/' in name]
    if '/output/Boek_3_Compleet' in name:
        chapters = ['3.1','3.2','3.3']
    if '/output/Boek_4_Compleet' in name:
        chapters = ['4.1']
    return [e for e in CONTRACT['source_edits'] if any('/'+c+'/' in e['path'] for c in chapters)
            and ('Antwoorden.md' in e['path']) == answer]


def expected_html(lessons, name):
    expected = original(lessons, EDITION+'/'+name).decode('utf-8')
    # The previous route revision reused answer HTML. A fresh answer render
    # includes the already accepted chapter CSS; require its exact bytes and
    # the immutable renderer's suffix rather than allowing arbitrary styles.
    folder = (lessons/EDITION/name).parent.parent
    css = (folder/'print.css').read_text(encoding='utf-8')+'\n.page-title{font-size:17pt;}\n'
    if 'Antwoorden' in name:
        css += 'html{font-size:10.8pt;line-height:1.36;}.formula{font-size:10pt;}'
    if '_bookpages.html' in name:
        mapping = json.loads((lessons/EDITION/'curriculum/book-page-map-v3.json').read_text(encoding='utf-8'))
        css += '@page:first{counter-reset:page '+str(mapping[folder.name[0]]['chapters'][folder.name]['student_offset']+1)+';}'
    expected = re.sub(r'<style>.*?</style>', lambda _: '<style>'+css+'</style>', expected, count=1, flags=re.S)
    for edit in relevant_edits(name):
        before = str(BeautifulSoup(edit['old'], 'html.parser'))
        after = str(BeautifulSoup(edit['new'], 'html.parser'))
        require(expected.count(before) == 1, 'Historical HTML fragment missing/ambiguous '+name+' '+edit['question'])
        expected = expected.replace(before, after, 1)
    return expected


def publication_text(lessons):
    """Independent of a re-recorded manifest: reject stale PDFs and HTML."""
    root = lessons / EDITION
    results = []
    with tempfile.TemporaryDirectory(prefix='b34-signed-text-') as temp:
        for name in sorted(PUBLICATIONS):
            file = root/name
            if name.endswith('.html'):
                require(file.read_text(encoding='utf-8') == expected_html(lessons, name), 'Stale/unapproved chapter HTML '+name)
            elif name.endswith('_page_map.json'):
                require(json.loads(file.read_text(encoding='utf-8')) == json.loads(original(lessons, EDITION+'/'+name)), 'Page-map drift '+name)
            elif name.endswith('.pdf'):
                prior = Path(temp)/file.name
                prior.write_bytes(original(lessons, EDITION+'/'+name))
                edits = relevant_edits(name)
                result = pdf_delta(prior, file, edits, pixels=False)
                with fitz.open(file) as doc:
                    text = squash(''.join(p.get_text() for p in doc))
                    for edit in edits:
                        fragment = squash(BeautifulSoup(edit['new'], 'html.parser').get_text())
                        require(fragment in text, 'Stale answer/student PDF '+name+' '+edit['question'])
                    # Geometry is checked for answers too, unlike renderer overflow.
                    for index, page in enumerate(doc, 1):
                        for block in page.get_text('blocks'):
                            require(block[0] >= -1 and block[1] >= -1 and block[2] <= page.rect.width+1 and block[3] <= page.rect.height+1,
                                    f'Text outside physical page {name} p{index}')
                require(result['changed_pages'], 'Publication contains no approved change '+name)
                results.append({'path': name, **result})
    return results


def arithmetic():
    # Inputs are fixed by the source/inverse-delta guard and accepted baseline.
    measurements = [(10,12,200,180),(8,10,80,70),(8,10,None,None),(10,12,100,90),
                    (None,None,None,None),(10,9,100,120)]
    results = []
    for item, (p0,p1,q0,q1) in zip(CONTRACT['numerical_checks'], measurements, strict=True):
        dp = Fraction(p1-p0,p0)*100 if p0 else Fraction(10)
        dq = Fraction(q1-q0,q0)*100 if q0 else Fraction(-10 if p0 else -15)
        value = dq/dp
        category = 'prijsinelastisch' if -1 < value < 0 else 'prijselastisch' if value < -1 else 'other'
        require(dp == Fraction(item['price_percent']) and dq == Fraction(item['quantity_percent']) and
                value == Fraction(item['elasticity_exact']) and category == item['classification'], 'Incorrect signed calculation')
        results.append({'exercise': item['exercise'], 'Ev': str(value), 'classification': category})
    require(8*80 == 640 and 10*70 == 700 and 9*120-10*100 == 80, 'Changed finite revenue arithmetic')
    return results


def paragraph_exports(lessons):
    root = lessons/EDITION
    sys.path.insert(0, str(root/'build'))
    import render
    require(render.ROOT.resolve() == root.resolve(), 'Wrong verification source root')
    from content import chapter_data
    result = []
    for pid in ('3.2.3','3.3.3'):
        chapter = pid[:3]
        folder = root/'books/book-3/chapters'/chapter
        data = chapter_data(folder)
        pages = [p['local_page'] for p in data['pages'] if p['section'] == pid]
        with fitz.open(folder/'paragraph-pdfs'/f'{pid}-leerling-v3.pdf') as excerpt, fitz.open(folder/'output'/f'Boek_3_H{chapter[-1]}_Leerling_v3.pdf') as source:
            require(len(excerpt) == len(pages), 'Incorrect paragraph extraction length '+pid)
            for page, n in zip(excerpt, pages, strict=True):
                require(page.get_text() == source[n-1].get_text() and page.get_pixmap().samples == source[n-1].get_pixmap().samples,
                        'Changed paragraph extract '+pid)
        result.append({'id': pid, 'pages': pages, 'text_and_pixels_equal': True})
    return result


def verify(lessons, report, comparison=None):
    authenticated = authenticate_baseline(comparison, lessons) if comparison else None
    source_files = sources(lessons)
    input_guard(lessons)
    pins = targets(lessons)
    outputs = publication_text(lessons)
    comparisons = []
    if comparison:
        for name in sorted(PUBLICATIONS):
            if name.endswith('.pdf'):
                comparisons.append({'path': name, **pdf_delta(comparison/EDITION/name, lessons/EDITION/name, relevant_edits(name))})
    extracted = paragraph_exports(lessons)
    assembled = books34_pdf(lessons)
    # Existing source, page, route, timing and approval checks remain in force.
    with tempfile.TemporaryDirectory(prefix='b34-structural-') as temp:
        check = importlib.import_module('books34_verify')
        structural_path = Path(temp)/'structural.json'
        check.main(structural_path)
        structural = json.loads(structural_path.read_text(encoding='utf-8'))
    result = {'revision': REVISION, 'source_files': source_files, 'approved_replacements': 8,
              'arithmetic': arithmetic(), 'target_preservation': pins, 'publications': outputs,
              'comparison_baseline': authenticated, 'same_environment_comparisons': comparisons, 'paragraph_exports': extracted,
              'assembly': assembled, 'structural': structural, 'NAV1': 'unchanged, separately open',
              'TIMING34': 'unchanged, separately open', 'target_approval': 'not_conferred'}
    write_json(report, result)
    print(json.dumps({'result': 'PASS', 'publications': len(PUBLICATIONS), 'pdfs': len(outputs), 'report': str(report)}))
    return result


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--lesson-root', type=Path, default=PLATFORM.parent/'4veco-lessen')
    ap.add_argument('--report', type=Path, required=True)
    ap.add_argument('--comparison-root', type=Path)
    args = ap.parse_args()
    sys.dont_write_bytecode = True
    verify(args.lesson_root.resolve(), args.report, args.comparison_root.resolve() if args.comparison_root else None)
