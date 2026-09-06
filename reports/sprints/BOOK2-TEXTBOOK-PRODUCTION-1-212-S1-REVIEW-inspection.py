"""Bind actual independent view_image inspection; preserve native PENDING manifests."""
import importlib.util
import io
from pathlib import Path

from PIL import Image, ImageChops

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('probes', HERE / 'BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-REVIEW-probes.py')
p = importlib.util.module_from_spec(spec)
spec.loader.exec_module(p)

FIGURES = {
    'fig_1': 'TO origin, units per evening, blue line and axis labels clear.',
    'fig_2': 'Same axes add TK, dashed distinction and intersection remain clear.',
    'fig_3': 'BE leader, loss and profit zones readable and unambiguous.',
    'fig_4': 'Vertical EUR30 gap at Q30 is a distance, not an area; labels clear.',
    'we_1': 'Rental/day BE intersection and EUR16 vertical gap readable.',
    'ex_1': 'Soap/day labels, BE and EUR8 bracket remain clear.',
    'ex_2': 'TK-only jars/day scaffold intact; open plotting space retained.',
    'ex_3': 'Jars/day full model, BE and EUR9 vertical gap readable.',
    'ex_4': 'Minigolf/day full model, BE and EUR20 gap readable.',
    'ex_5': 'Bakery/month full model, BE and EUR200 gap readable; 1000 scale clear.',
    'ex_6': 'Both scale panels readable: same EUR30 gap, distinct 150/300 axes.'
}
PAGES = {
    'paragraaf': 'Theatre gap figure and full caption, distance-not-area warning, bounded model text and whole-unit subsection readable with no clipping or overlap.',
    'opgaven': 'Continuation 5c/d, independent minigolf 6a-d and entire bakery target 7a-d (2/2/3/4 points) clear; target not split and no answer scaffold.',
    'antwoorden': 'Complete bonus 8a/b scale reasoning and three criteria; closing 9 TCK24/TVK18/TK42/GTK7 and unit explanation clear and unclipped.'
}

p.preserve()
rows = []
for name, observation in FIGURES.items():
    path = p.F / '_assets' / ('2.1.2_' + name + '.png')
    current = path.read_bytes()
    original = p.blob(p.LESSON, path.relative_to(p.L), cwd=p.L)
    assert current == original
    with Image.open(io.BytesIO(current)) as a, Image.open(io.BytesIO(original)) as b:
        assert a.size == b.size and ImageChops.difference(a.convert('RGB'), b.convert('RGB')).getbbox() is None
        rows.append(dict(path=path.relative_to(p.L).as_posix(), original_ref=p.LESSON,
                         sha256=p.h(current), rgb_sha256=p.h(a.convert('RGB').tobytes()),
                         size=list(a.size), pixel_difference=False, personally_viewed=True,
                         observation=observation))

pages = []
for kind, observation in PAGES.items():
    records = p.read(p.E / 'full-r13-comparison.json')['pages']
    row = next(r for r in records if r['kind'] == kind and r['current'].endswith('/page-006.png'))
    a, b = p.P / row['current'], p.P / row['old']
    assert a.read_bytes() == b.read_bytes()
    with Image.open(a) as x, Image.open(b) as y:
        assert x.size == y.size and ImageChops.difference(x.convert('RGB'), y.convert('RGB')).getbbox() is None
        pages.append(dict(**row, rgb_sha256=p.h(x.convert('RGB').tobytes()), size=list(x.size),
                          personally_viewed=True, observation=observation))

manifests = []
for mode, revision in [('full','r13'), ('thin','r14'), ('print','r15')]:
    build = p.E / f'{mode}-{revision}-build.json'
    data = p.read(build)
    assert data['inspection_status'] == 'PENDING'
    for doc in data['documents']:
        path = Path(doc['proof_directory']) / 'manifest.json'
        proof = p.read(path)
        assert proof['inspection_status'] == 'PENDING' and proof['pages_inspected'] == []
        manifests.append(dict(path=path.relative_to(p.P).as_posix(), sha256=p.raw(path),
                              inspection_status='PENDING', pages_inspected=[]))

records = {}
for path in sorted(p.E.glob('*.json')):
    records[path.name] = p.raw(path)
p.save('independent-inspection.json', dict(result='PASS', actor='paragraph_212_successor_delta_review',
    scope='Dependency-only delta review; not a replacement full economics/didactics review or specialist QC.',
    method='Personally viewed fresh r13 page6 per edition and all11 current native figures with view_image; programmatic raw/RGB equality binds them to reviewed pixels.',
    native_manifests_preserved=True, source_subject=p.SUBJECT, lesson_subject=p.LESSON,
    figures=rows, pages=pages, proof_manifests=manifests, evidence_sha256=records))
p.preserve()
print('Independent inspection bound: 3 representative pages and 11 figures; all 9 native proof manifests remain PENDING.')
