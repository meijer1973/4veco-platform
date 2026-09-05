"""Inspect actual §222 generated text, font sizes, assets and proof freshness.

Mechanical checks only. Every final page still needs independent visual review.
"""
import argparse
import json
import math
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

from bs4 import BeautifulSoup
from pypdf import PdfReader

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import b2_222 as builder
from print_pipeline import verify_record_freshness


def normalize(value):
    return re.sub(r'\s+', ' ', value).strip()


def relocate_manifest(manifest, lesson_root):
    """Rebase builder-owned paths for the integrator's paired worktree.

    The immutable on-disk manifest is not changed. Relative source locations
    and byte hashes remain the same; only the explicitly supplied checkout
    roots change for freshness/rebuild checks after adoption.
    """
    old_platform = Path(manifest['input_sources'][0]['path']).parents[3]
    roots = [(old_platform, builder.ROOT),
             (old_platform.parent/'4veco-lessen', lesson_root.resolve())]
    def visit(value):
        if isinstance(value, dict):
            return {key: visit(item) for key,item in value.items()}
        if isinstance(value, list):
            return [visit(item) for item in value]
        if isinstance(value, str):
            path = Path(value)
            for old,new in roots:
                if path.is_relative_to(old):
                    return str(new/path.relative_to(old))
        return value
    return visit(manifest)


def inspect(lesson_root: Path, manifest_path: Path, rebuild=False):
    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    manifest = relocate_manifest(manifest, lesson_root)
    assert manifest['inspection_status'] == 'PENDING'
    for source in manifest['input_sources']:
        assert builder.digest(Path(source['path'])) == source['sha256'], source['path']
    results = {'paragraph': '2.2.2', 'visual_acceptance': 'NOT_SUPPLIED_BY_THIS_SCRIPT',
               'automated_status': 'PASS', 'documents': []}
    target = builder.target_record()
    fragments = []
    for record in manifest['documents']:
        verify_record_freshness(record)
        kind = Path(record['source_pdf']).stem.rsplit(' – ', 1)[1]
        soup = BeautifulSoup(Path(record['source_html']).read_text(encoding='utf-8'), 'html.parser')
        assert ':::' not in soup.get_text(), 'Raw Markdown fence leaked into print'
        assert not soup.find(['script', 'iframe', 'object', 'link'])
        for image in soup.find_all('img'):
            assert image['src'].startswith('data:image/png;base64,')
            assert image.get('alt')
        pdf = PdfReader(record['source_pdf'])
        font_sizes, image_geometry, texts = [], [], []
        for number, page in enumerate(pdf.pages, 1):
            def visit_text(text, cm, tm, font, size):
                if text.strip():
                    font_sizes.append(size * math.sqrt(abs(cm[0]*cm[3]-cm[1]*cm[2])))
            def visit_op(op, args, cm, tm):
                if op == b'Do':
                    image_geometry.append((math.hypot(cm[0], cm[1]), math.hypot(cm[2], cm[3])))
            value = page.extract_text(visitor_text=visit_text, visitor_operand_before=visit_op) or ''
            assert len(normalize(value)) > 80, (kind, 'blank or near-empty page', number)
            assert '\ufffd' not in value and ':::' not in value
            assert not re.search(r'\|\s*\n\s*Ev\||\|Ev\s*\n\s*\|', value), (kind, number, 'split absolute-elasticity token')
            texts.append(value)
        text = normalize(' '.join(texts))
        assert min(font_sizes) >= 11.99, (kind, min(font_sizes))
        for n in range(1, 10):
            assert f'Opgave {n}' in text, (kind, n)
        # Measure actual placement of each>=22px label on its720px SVG canvas.
        svg_paths = [Path(a['path']) for a in record['assets'] if a['path'].endswith('.svg')]
        assert len(svg_paths) == len(image_geometry)
        placed_sizes = []
        for path, (width, height) in zip(svg_paths, image_geometry):
            root = ET.fromstring(path.read_text(encoding='utf-8'))
            sx, sy = width/float(root.attrib['width']), height/float(root.attrib['height'])
            assert abs(sx-sy) < 0.00001, 'Distorted figure aspect ratio'
            placed_sizes += [float(e.attrib['font-size'])*min(sx,sy) for e in root.iter() if e.tag.endswith('text')]
        minimum_asset_font = min(placed_sizes, default=None)
        if minimum_asset_font is not None:
            assert minimum_asset_font >= 12, (kind, minimum_asset_font)
        if kind in ('paragraaf', 'opgaven'):
            assert 'dat de vraag ___. Als oude en nieuwe P en Q gegeven zijn, ___.' in text, 'Guided completion blanks disappeared'
            assert [normalize(h.get_text()) for h in soup.find_all('h2')] == builder.HEADINGS
            first = soup.find('h2', id='uitgewerkt-voorbeeld')
            fragments.append(''.join(str(n) for n in [first, *first.next_siblings]))
            h = next(h for h in soup.find_all('h2') if normalize(h.get_text()) == 'Doeloefening')
            block = h.parent
            assert block.name == 'section' and block.get('id') == 'doeloefening'
            assert block.find('strong').get_text() == 'Opgave 6'
            local = normalize(block.get_text(' ', strip=True))
            assert not block.find(['img', 'table', 'ol'])
            assert normalize(target['target_exercise']['context']) in local
            assert normalize(target['target_exercise']['context']) in text
            for q in target['target_exercise']['subquestions']:
                assert normalize(q['prompt']) in local
                assert normalize(q['prompt']) in text
                assert f"{q['label']}) ({q['points']} {'punt' if q['points'] == 1 else 'punten'})" in local
        if kind == 'paragraaf':
            for goal in target['lesson_goals']:
                assert normalize(goal) in text
        if kind == 'antwoorden':
            assert len(soup.find_all('br')) == 3
            for answer in target['short_answer_model'].values():
                # A PDF line break may occur inside the compact frozen ratio,
                # e.g. directly after '/'; ignore layout whitespace only.
                assert re.sub(r'\s+', '', answer) in re.sub(r'\s+', '', text), answer
        proof_dir = Path(record['proof_directory'])
        proof = json.loads((proof_dir/'manifest.json').read_text(encoding='utf-8'))
        assert proof['inspection_status'] == 'PENDING' and proof['pages_inspected'] == []
        assert proof['pdf_sha256'] == record['pdf_sha256']
        assert len(proof['rendered_pages']) == len(pdf.pages)
        for relative in proof['rendered_pages']:
            path = proof_dir/relative
            assert builder.digest(path) == proof['page_sha256'][path.name]
        assert b'\r' not in (proof_dir/'manifest.json').read_bytes()
        results['documents'].append({'kind': kind, 'pdf_sha256': record['pdf_sha256'], 'pages': len(pdf.pages),
            'minimum_printed_text_pt_including_footer': round(min(font_sizes), 3),
            'minimum_placed_figure_label_pt': round(minimum_asset_font, 3) if minimum_asset_font else None,
            'proof_directory': str(proof_dir), 'all_page_hashes_match': True})
    assert fragments[0] == fragments[1], 'Exercise HTML editions differ'
    if rebuild:
        second = builder.build(lesson_root)
        assert manifest['input_sources'] == second['input_sources']
        for before, after in zip(manifest['documents'], second['documents']):
            for field in ('source_sha256', 'html_sha256', 'pdf_sha256', 'assets'):
                assert before[field] == after[field], ('non-identical rebuild', field)
        results['byte_identical_rebuild'] = True
    results['checks'] = ['exact frozen goals/context/a-f/2+2+2+2+2+1points/short answers',
        'one exercise HTML definition in both editions', 'no leaked fences or active resources',
        'every printed text/font and placed figure label meets12pt floor',
        'all assets and all rendered page hashes fresh; manifests honestly pending']
    return results


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--lesson-root', type=Path, default=builder.ROOT.parent/'4veco-lessen')
    parser.add_argument('--manifest', type=Path, default=builder.ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-build-r12.json')
    parser.add_argument('--rebuild', action='store_true')
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    result = inspect(args.lesson_root, args.manifest, args.rebuild)
    serialized = json.dumps(result, ensure_ascii=False, indent=2)+'\n'
    if args.output:
        args.output.write_text(serialized, encoding='utf-8', newline='\n')
    print(serialized)
