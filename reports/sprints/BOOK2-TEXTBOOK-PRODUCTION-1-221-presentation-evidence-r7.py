"""Bounded R6/R7 evidence map, not a builder or independent approval.

Reads this task's base commits and current paired files. Writes only this
revision's evidence JSON; authored observations below were recorded after
paragraph_221_presentation_builder personally viewed all 20 R7 full pages.
"""
import hashlib
import json
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LESSON = ROOT.parent / '4veco-lessen'
PBASE = '92862e370fd997634aa505c24b74c773c05039f4'
LBASE = 'abe73479d900c1c3dd4cccb9c568305eb58c7a18'
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-221-'
sys.path.insert(0, str(ROOT / 'build-scripts/content/book-2'))
import b2_221 as builder
from bs4 import BeautifulSoup
from pypdf import PdfReader


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def old_bytes(root, base, relative):
    return subprocess.run(['git', 'show', f'{base}:{relative}'], cwd=root,
                          capture_output=True, check=True).stdout


def file_map(root, base, relative, expected_change=False):
    before, after = old_bytes(root, base, relative), (root / relative).read_bytes()
    changed = before != after
    assert changed == expected_change, (relative, 'unexpected byte change', changed)
    return {'repository': root.name, 'path': relative,
            'before_raw_sha256': sha(before), 'after_raw_sha256': sha(after),
            'changed': changed}


REPLACEMENTS = [
    ('Maak deze twee korte checks in ongeveer 5½ minuut. Controleer daarna je werk',
     'Maak deze twee korte checks. Controleer daarna je werk'),
    ('Dit is de extra hulproute van ongeveer 10 minuten. Die komt boven op de kern;',
     'Dit is de extra hulproute. Die komt boven op de korte route;'),
    ('conclusie. Richttijd: 11 minuten.', 'conclusie.'),
    ('Werk zelfstandig. Richttijd: 9 minuten. Totaal: 9 punten.',
     'Werk zelfstandig. Totaal: 9 punten.'),
    ('Dit denkertje valt buiten de kernroute. Richttijd: 8 minuten.',
     'Dit denkertje valt buiten de korte route.'),
    ('Deze herhaling valt buiten de kernroute en kan als huiswerk. Richttijd samen:\n5 minuten.',
     'Deze herhaling valt buiten de korte route en kan als huiswerk.'),
]


def apply_exact(text):
    for before, after in REPLACEMENTS:
        assert text.count(before) == 1, before
        text = text.replace(before, after)
    return text


OBSERVATIONS = {
    'paragraaf': [
        'Motivation, four goals, old-base retrieval and complete old/new table readable; table rows and footer unclipped.',
        'Signed percentage chart and caption match nearby calculations; formula and conditions box stays together; no label overlap.',
        'Sign/magnitude warning, both classifications and paired threshold chart readable; caption and footer separated.',
        'Bounded explanation and worked-example heading/context/steps1-2 readable; continuation into figure on next page coherent.',
        'Worked figure, steps3-5 and intact five-point recap readable; conditions, sign and forward link preserved.',
        'Short-route advice and Start1-2 complete; numeric Start estimate removed; neutral repair and teacher-check advice retained.',
        'Guided heading, nonnumeric extra-help advice, table, reminder and all task3 prompts together; no clipping.',
        'Faded task4 table/prompts and complete independent task5 fit; independent instruction ends at conclusie without time label; last prompt remains above footer.',
        'Target heading, visible total9, Nova/StreamNow context and all a-d prompts/3-2-2-2 points together; no time label or scaffold added.',
        'Bonus and closing headings, nonnumeric short-route/homework notes and all tasks7-9 readable; no missing questions or stranded heading.',
    ],
    'opgaven': [
        'Worked context and steps1-3 with complete signed/magnitude figure/caption readable; continuation to step4 coherent.',
        'Steps4-5, full five-point recap and Start1-2 remain complete; numeric Start label removed; task2 sits above footer without clipping.',
        'Guided task3 and printed old-base/sign reminder remain grouped; extra-help note uses korte route without numeric estimate.',
        'Task4 table and fading cue plus full independent task5 fit; changed conclusion instruction is nonnumeric; final d prompt clear above footer.',
        'Exact Nova/StreamNow target a-d, total9 and 3-2-2-2 points readable together; nine-minute label removed only.',
        'Bonus7 and closing8-9 complete; both notes use korte route, no numeric estimate; homework and conditional substitution prompt retained.',
    ],
    'antwoorden': [
        'Answer-after-attempt note, Start1-2 and guided3 steps1-4 readable; continued step5 begins next page coherently.',
        'Guided3 conclusion and arcade/pool full signed calculations/explanations followed by independent5 steps1-3 readable; no clipping.',
        'Independent5 classification/meaning/context and target6a-c including exact short answers/scoring readable; target6d continues next page as whole block.',
        'Target6d bounded marking explanation, bonus model/criteria and all closing8-9 answers readable; footer clear.',
    ],
}


def main():
    build = json.loads((ROOT / 'reports/sprints' / f'{PREFIX}build-r7.json').read_text(encoding='utf-8'))
    assert build['inspection_status'] == 'PENDING'
    source_rel = 'build-scripts/content/book-2/221/exercises.md'
    old_source = old_bytes(ROOT, PBASE, source_rel)
    assert sha(old_source) == 'e5b37d2b3171a24da7bef24c82695c9ac469632039f4c310a09162653698e562'
    assert apply_exact(old_source.decode('utf-8')).encode('utf-8') == (ROOT / source_rel).read_bytes()
    inputs = [file_map(ROOT, PBASE, Path(x['path']).relative_to(ROOT).as_posix(),
                       Path(x['path']).name == 'exercises.md') for x in build['input_sources']]
    for name in ('test_source.py', 'check_render.py'):
        inputs.append(file_map(ROOT, PBASE, f'build-scripts/content/book-2/221/{name}'))
    authority = [file_map(ROOT, PBASE, path) for path in (
        'references/authored/course-target-exercises.json',
        'references/authored/book-outlines/book-2-outline.md',
        'references/authored/book-outlines/book-2-outline.meta.json',
        'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-22-owner-authorization.md',
        'reports/sprints/BOOK2-TARGET-INTEGRATION-1-owner-authorization.md')]
    folder = LESSON / builder.LESSON_REL
    for path in [folder.parent/'_chapter-plan.md', *(folder/name for name in (
        '2.2.1-textbook-plan.md', '2.2.1-review.md', '2.2.1-quality-ref.yaml',
        '2.2.1-textbook-handoff.md', 'build_pdf.py'))]:
        authority.append(file_map(LESSON, LBASE, path.relative_to(LESSON).as_posix()))
    assert builder.lf_hash(folder/'2.2.1-textbook-plan.md') == builder.PLAN_HASH
    assert builder.lf_hash(folder.parent/'_chapter-plan.md') == builder.CHAPTER_HASH
    builder.target_record()
    outputs, assets, page_maps = [], {}, []
    old_build = json.loads(old_bytes(ROOT, PBASE, f'reports/sprints/{PREFIX}build-r6.json'))
    old_by_kind = {Path(x['source_pdf']).stem.rsplit(' – ', 1)[1]: x for x in old_build['documents']}
    proof_root = ROOT / 'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1'
    for record in build['documents']:
        kind = Path(record['source_pdf']).stem.rsplit(' – ', 1)[1]
        for field in ('source_md', 'source_html', 'source_pdf'):
            relative = Path(record[field]).relative_to(LESSON).as_posix()
            outputs.append(file_map(LESSON, LBASE, relative, kind != 'antwoorden'))
        if kind != 'antwoorden':
            old_md = old_bytes(LESSON, LBASE, Path(record['source_md']).relative_to(LESSON).as_posix()).decode('utf-8')
            assert apply_exact(old_md) == Path(record['source_md']).read_text(encoding='utf-8')
        pdf_text = re.sub(r'\s+', ' ', ' '.join(p.extract_text() for p in PdfReader(record['source_pdf']).pages))
        html_text = re.sub(r'\s+', ' ', BeautifulSoup(Path(record['source_html']).read_text(encoding='utf-8'), 'html.parser').get_text(' '))
        for text in (pdf_text, html_text, Path(record['source_md']).read_text(encoding='utf-8')):
            assert not re.search(r'Richttijd|5½|\bminu(?:ut|ten)\b|kernroute', text, re.I)
        for a in record['assets']:
            relative = Path(a['path']).relative_to(LESSON).as_posix()
            assets[relative] = file_map(LESSON, LBASE, relative)
        current_dir = Path(record['proof_directory'])
        old_dir = proof_root / (f"221-{kind}-{old_by_kind[kind]['pdf_sha256'][:12]}-r6")
        current = json.loads((current_dir/'manifest.json').read_text(encoding='utf-8'))
        old = json.loads((old_dir/'manifest.json').read_text(encoding='utf-8'))
        assert current['render_dpi'] == 150 and current['inspection_status'] == 'PENDING'
        assert current['pages_inspected'] == [] and current['visible_student_defects'] is None
        assert len(current['rendered_pages']) == len(OBSERVATIONS[kind]) == len(old['rendered_pages'])
        pages = []
        for number, relative in enumerate(current['rendered_pages'], 1):
            old_page, new_page = old_dir/relative, current_dir/relative
            before, after = builder.digest(old_page), builder.digest(new_page)
            assert before == old['page_sha256'][old_page.name]
            assert after == current['page_sha256'][new_page.name]
            pages.append({'page': number, 'before_raw_sha256': before,
                'after_raw_sha256': after, 'changed': before != after,
                'current_page': new_page.relative_to(ROOT).as_posix(),
                'personally_viewed_full_page': True,
                'observation': OBSERVATIONS[kind][number-1],
                'builder_visible_defects_found': []})
        page_maps.append({'kind': kind, 'pdf_sha256': record['pdf_sha256'],
            'manifest_raw_sha256': builder.digest(current_dir/'manifest.json'),
            'proof_directory': current_dir.relative_to(ROOT).as_posix(), 'pages': pages})
    geometry = []
    for stem, source in builder.asset_sources().items():
        assert (folder/'_assets'/f'{stem}.svg').read_text(encoding='utf-8') == source
        root = ET.fromstring(source)
        for e in root.iter():
            if 'data-value' not in e.attrib:
                continue
            value, scale, zero = [float(e.attrib[key]) for key in ('data-value', 'data-scale', 'data-zero')]
            assert float(e.attrib['x']) == zero + min(0, value)*scale
            assert float(e.attrib['width']) == abs(value)*scale
            geometry.append({'asset': stem, 'value': value, 'scale': scale,
                             'zero': zero, 'x': float(e.attrib['x']), 'width': float(e.attrib['width'])})
    result = {'paragraph': '2.2.1', 'revision': 'r7', 'finding': 'B2-TIME-PRINT-01',
        'builder': 'paragraph_221_presentation_builder',
        'base_platform': PBASE, 'base_lessons': LBASE,
        'exact_six_replacements_only': True, 'replacement_pairs': REPLACEMENTS,
        'input_sources': inputs, 'authority_and_historical_records': authority,
        'canonical_outputs': outputs, 'assets': list(assets.values()),
        'page_change_map_and_builder_observations': page_maps,
        'all_three_pngs_personally_viewed': True,
        'asset_observations': 'All three PNGs viewed separately after all20pages. Direct signed and magnitude labels, hatching, threshold1, captions and given-only Klimhal condition clear. No clipped/overlapping label found. SVG generator read in full and exact10bar origins/widths checked.',
        'proportional_geometry': geometry,
        'inspection_basis': 'Fresh personal full-page views of all20currentR7pages; no inherited reviewer page acceptance or hash-only visual transfer.',
        'independent_r7_paragraph_review': 'PENDING', 'independent_r7_specialist_qc': 'PENDING',
        'canonical_r6_review_quality_handoff': 'UNMODIFIED_HISTORICAL_R6_ONLY',
        'generation_manifests': 'PENDING_UNMODIFIED',
        'timing_observed': False, 'timing_estimates_unchanged': {'core':48.5,'guided_extra':10,'bonus_extra':8,'closing_extra':5,'all':71.5}}
    destination = ROOT/'reports/sprints'/f'{PREFIX}builder-inspection-r7.json'
    destination.write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')
    print(json.dumps({'status':'PASS','evidence':str(destination),
        'changed_pages':{d['kind']:[p['page'] for p in d['pages'] if p['changed']] for d in page_maps},
        'unchanged_sources':len(inputs)-1,'unchanged_assets':len(assets),
        'personally_viewed_pages':sum(len(d['pages']) for d in page_maps)}, indent=2))


if __name__ == '__main__':
    main()
