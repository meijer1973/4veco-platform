"""Bind already completed personal observations; does not infer inspection."""
import importlib.util
import json
from pathlib import Path
from PIL import Image, ImageChops

HERE = Path(__file__).resolve().parent
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-223-QC-RENEWAL'
spec = importlib.util.spec_from_file_location('own_renewal', HERE / (PREFIX + '-check.py'))
c = importlib.util.module_from_spec(spec)
spec.loader.exec_module(c)
n = c.n
observations_path = HERE / (PREFIX + '-observations.json')
notes = json.loads(observations_path.read_text(encoding='utf-8'))
parity = n.read('full-parity')
gray = n.read('grayscale')
assert [len(notes[k]) for k in n.KINDS] == [15, 10, 7]
assert len(notes['figures']) == 4
rows = []
for document in parity['documents']:
    kind = document['kind']
    directory = c.ROOT / document['proof_directory']
    manifest = directory / 'manifest.json'
    assert n.sha(manifest.read_bytes()) == document['manifest_sha256']
    value = json.loads(manifest.read_text(encoding='utf-8'))
    assert value['inspection_status'] == 'PENDING' and value['pages_inspected'] == []
    for number, page in enumerate(document['pages'], 1):
        color = directory / 'pages' / page['name']
        graypath = n.PROOF / 'grayscale' / (kind + '-' + page['name'])
        g = next(x for x in gray['rows'] if x.get('kind') == kind and x.get('page') == page['name'])
        assert n.sha(color.read_bytes()) == page['raw_sha256']
        assert n.sha(graypath.read_bytes()) == g['raw_sha256']
        rows.append({'kind': kind, 'page': number, 'pdf_sha256': document['pdf_sha256'],
            'manifest_sha256': document['manifest_sha256'], 'color_path': color.relative_to(c.ROOT).as_posix(),
            'color_sha256': page['raw_sha256'], 'gray_path': graypath.relative_to(c.ROOT).as_posix(),
            'gray_sha256': g['raw_sha256'], 'fresh_personal_color_view': True, 'fresh_personal_gray_view': True,
            'observation': notes[kind][number-1], 'verdict': 'PASS'})
figures = []
for number in range(1, 5):
    relative = f'_assets/2.2.3_fig_{number}.png'
    color = n.DEST / relative
    graypath = n.PROOF / 'grayscale' / f'figure-{number}.png'
    g = next(x for x in gray['rows'] if x.get('kind') == 'figure' and x.get('number') == number)
    assert n.sha(color.read_bytes()) == parity['paragraph_files'][relative]
    assert n.sha(graypath.read_bytes()) == g['raw_sha256']
    rgb = Image.open(color).convert('RGB')
    ink = ImageChops.difference(rgb, Image.new('RGB', rgb.size, 'white')).getbbox()
    assert ink and 0 < ink[0] < ink[2] < rgb.width and 0 < ink[1] < ink[3] < rgb.height
    figures.append({'figure': number, 'lesson_path': (c.B.LESSON_REL / relative).as_posix(),
        'color_sha256': n.sha(color.read_bytes()), 'svg_sha256': n.sha(color.with_suffix('.svg').read_bytes()),
        'gray_path': graypath.relative_to(c.ROOT).as_posix(), 'gray_sha256': g['raw_sha256'],
        'native_size': list(rgb.size), 'actual_nonwhite_ink_bbox': list(ink),
        'fresh_personal_color_view': True, 'fresh_personal_gray_view': True,
        'observation': notes['figures'][number-1], 'verdict': 'PASS'})
assert len(rows) * 2 + len(figures) * 2 == 72
n.save('personal-inspection', {'pass': True, 'actor': notes['actor'], 'role': notes['role'],
    'date': notes['date'], 'method': notes['method'], 'observations_sha256': n.sha(observations_path.read_bytes()),
    'platform_input': c.PINPUT, 'lesson_input': c.LINPUT,
    'review_at_inspection_sha256': c.REVIEW,
    'review_noun_correction': 'Root has assigned distinct reviewer; proof and observations remain immutable. Final QC must bind separately to verified review-only successor.',
    'source_binding': c.a.source_binding(), 'full_parity_sha256': n.sha((HERE / (PREFIX + '-full-parity.json')).read_bytes()),
    'page_color_views': 32, 'page_gray_views': 32, 'figure_color_views': 4, 'figure_gray_views': 4,
    'transferred_old_views': 0, 'generation_manifests': 'PENDING unchanged, inspected arrays empty',
    'pages': rows, 'figures': figures, 'root_validation': 'PENDING', 'root_acceptance': 'PENDING',
    'production_ready': False, 'classroom_timing': 'UNOBSERVED'})
