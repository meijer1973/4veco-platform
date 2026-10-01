"""Check saved §4.2.7 geometry, native objects, notes and overview parity.

HOW TO ADAPT: change the equation contracts and slide ownership for a new deck.
Usage: python check-presentation-427.py FINAL.pptx BUILD/manifest.json
Visual/content review and chart_workbooks.py remain separate checks.
"""
import json
import sys
from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as E

NS = {'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart'}
manifest = json.loads(Path(sys.argv[2]).read_text(encoding='utf8'))
z = ZipFile(sys.argv[1])


def root(name):
    return E.fromstring(z.read(name))


def xy_shape(shape):
    x = shape.find('p:spPr/a:xfrm', NS)
    off, ext = x.find('a:off', NS), x.find('a:ext', NS)
    return tuple(float(n) / 9525 for n in
                 [off.get('x'), off.get('y'), ext.get('cx'), ext.get('cy')])


def close(actual, expected, tolerance=0.02):
    assert len(actual) == len(expected)
    assert all(abs(a-b) < tolerance for a, b in zip(actual, expected)), (actual, expected)


def named_shapes(number):
    r = root(f'ppt/slides/slide{number}.xml')
    return {s.find('p:nvSpPr/p:cNvPr', NS).get('name'): s
            for s in r.findall('.//p:sp', NS)}


def texts(r):
    return ''.join(t.text or '' for t in r.findall('.//a:t', NS))


assert len(manifest['slides']) == 23
assert manifest['overviewSlides'] == [1, 6, 23]
overview = []
for number in manifest['overviewSlides']:
    overview.append({name: (texts(s), xy_shape(s)) for name, s in named_shapes(number).items()
                     if name not in ['phase', 'slide-number']})
assert overview[0] == overview[1] == overview[2], 'Overview content or geometry differs'

for i in range(1, 24):
    notes = root(f'ppt/notesSlides/notesSlide{i}.xml')
    body = texts(notes)
    for field in ['Vraag:', 'Uitleg:', 'Misvatting:', 'Overgang:', 'Bron:']:
        assert field in body, (i, field)
    sizes = [int(n.get('sz')) for n in notes.iter() if n.get('sz')]
    assert sizes and min(sizes) >= 1400, (i, sizes)

for number in manifest['nativeTableSlides']:
    assert root(f'ppt/slides/slide{number}.xml').find('.//a:tbl', NS) is not None

for index, g in enumerate(manifest['geometry'], 1):
    r = root(f'ppt/slides/charts/chart{index}.xml')
    slide = root(f"ppt/slides/slide{g['slide']}.xml")
    frame = next(f for f in slide.findall('.//p:graphicFrame', NS)
                 if f.find('.//c:chart', NS) is not None)
    xf = frame.find('p:xfrm', NS)
    off, ext = xf.find('a:off', NS), xf.find('a:ext', NS)
    close([float(n)/9525 for n in [off.get('x'), off.get('y'), ext.get('cx'), ext.get('cy')]],
          [g['box'][k] for k in ['left', 'top', 'width', 'height']])
    for axis in r.findall('.//c:valAx', NS):
        pos = axis.find('c:axPos', NS).get('val')
        scaling = axis.find('c:scaling', NS)
        close([float(scaling.find('c:min', NS).get('val'))], [0])
        close([float(scaling.find('c:max', NS).get('val'))],
              [g['maxQ'] if pos == 'b' else g['maxP']])
    series = r.findall('.//c:scatterChart/c:ser', NS)
    assert len(series) == len(g['series'])
    for ser, spec in zip(series, g['series']):
        xs = [float(v.text) for v in ser.findall('c:xVal//c:pt/c:v', NS)]
        ys = [float(v.text) for v in ser.findall('c:yVal//c:pt/c:v', NS)]
        close(xs, spec['xValues']); close(ys, spec['values'])
        assert ser.find('c:smooth', NS).get('val') == '0'
        name = spec['name']
        fn = None
        if g['kind'] == 'A':
            fn = {'Vraag = GO': lambda q: 70-q, 'MO': lambda q: 70-2*q,
                  'MK': lambda q: 10+q}.get(name)
        else:
            fn = {'Vraag': lambda q: 60-q, 'A = MK privé': lambda q: q,
                  'MK maatschappelijk': lambda q: q+20}.get(name)
        if fn:
            close(ys, [fn(q) for q in xs])
    m = r.find('.//c:manualLayout', NS)
    for key, value in g['frac'].items():
        close([float(m.find('c:'+key, NS).get('val'))], [value])
    inner = g['plot']
    X = lambda q: inner['left'] + q/g['maxQ']*inner['width']
    Y = lambda price: inner['top'] + (1-price/g['maxP'])*inner['height']
    shapes = named_shapes(g['slide'])
    if g['loss']:
        sp = shapes['area-welvaartsverlies']
        left, top, width, height = xy_shape(sp)
        path = sp.find('p:spPr/a:custGeom/a:pathLst/a:path', NS)
        points = [(left+float(pt.get('x'))/float(path.get('w'))*width,
                   top+float(pt.get('y'))/float(path.get('h'))*height)
                  for pt in path.findall('.//a:pt', NS)]
        assert len(points) == 3
        for actual, qp in zip(points, [(20, 50), (30, 40), (20, 30)]):
            close(actual, [X(qp[0]), Y(qp[1])])
        for h in g['hatches']:
            # Every hatch stops on MK below 40 or on demand above 40.
            price = h['v']; end = price-10 if price <= 40 else 70-price
            close(xy_shape(shapes['hatch-loss-'+str(price).removesuffix('.0')]),
                  [X(20), Y(price), X(end)-X(20), 0])
    if g['shift']:
        close(xy_shape(shapes['horizontal-shift-arrow']), [X(40), Y(60), X(60)-X(40), 0])
        assert 'shift-arrowhead' in shapes
        assert g['shift']['oldQ'] == g['shift']['price']
        assert g['shift']['newQ'] + 20 == g['shift']['price']

assert 70-2*20 == 10+20 and 70-20 == 50
assert 50*20-(100+10*20+0.5*20**2) == 500
assert .5*20*(70-50) == 200
assert 20*(50-30)+.5*20*(30-10) == 600
assert 900-800 == .5*(30-20)*(50-30) == 100
assert 60-20 == 20+20 and 20*20 == 400
assert 200+200+400-400-300 == 100
print(json.dumps({'ok': True, 'slides': 23, 'nativeCharts': 5,
                  'nativeTables': len(manifest['nativeTableSlides']),
                  'overviewParity': True, 'notesFloorPt': 14,
                  'savedEquationGeometry': 'passed'}, indent=2))
