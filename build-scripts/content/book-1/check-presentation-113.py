"""Check the saved §1.1.3 classroom PPTX against its numeric authoring contract.

HOW TO ADAPT: use this only for presentation-113.mjs, second edition 2026.
Pass FINAL.pptx and its private build/geometry.json; visual review is separate.
"""
import json
import posixpath
import sys
from pathlib import Path
from zipfile import ZipFile
from lxml import etree as ET

NS = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
PPTX, GEOMETRY = map(Path, sys.argv[1:3])
z = ZipFile(PPTX)
geom = json.loads(GEOMETRY.read_text(encoding='utf8'))
slides = {i: ET.fromstring(z.read(f'ppt/slides/slide{i}.xml')) for i in range(1, 30)}

def check(condition, message):
    if not condition:
        raise AssertionError(message)

def overview(i):
    result = []
    for shape in slides[i].findall('.//p:sp', NS):
        name = shape.find('p:nvSpPr/p:cNvPr', NS).get('name')
        if name in ('phase', 'slide-number'):
            continue
        result.append((name, shape.xpath('.//a:t/text()', namespaces=NS),
                       ET.tostring(shape.find('p:spPr/a:xfrm', NS))))
    return result

check(overview(1) == overview(16) == overview(29), 'Overview text/geometry mismatch')
note_count = 0
for name in z.namelist():
    if name.startswith('ppt/notesSlides/notesSlide') and name.endswith('.xml'):
        root = ET.fromstring(z.read(name))
        content = ' '.join(root.xpath('.//a:t/text()', namespaces=NS))
        for label in ('Vraag:', 'Uitleg:', 'Misvatting:', 'Overgang:', 'Bron:', 'tweede editie 2026'):
            check(label in content, f'{name}: missing {label}')
        sizes = [int(v) for v in root.xpath('.//a:rPr/@sz | .//a:defRPr/@sz', namespaces=NS)]
        check(sizes and min(sizes) >= 1400, 'Notes font under 14 pt')
        note_count += 1
check(note_count == 29, 'Missing slide notes')

expected_main = {
    3: [([0, 200], [0, 0])],
    4: [([180], [3]), ([140], [7]), ([100], [11])],
    5: [([180, 140, 100], [3, 7, 11])],
    6: [([180, 140, 100], [3, 7, 11]), ([0, 150, 150], [6, 6, 0])],
    13: [([1, 4, 6], [12, 30, 42])],
    21: [([100, 70, 40], [2, 5, 8])],
    22: [([100, 70, 40], [2, 5, 8]), ([0, 80, 80], [4, 4, 0])],
}
chart_count = 0
for g in (g for g in geom if g['type'] == 'scatter'):
    i = g['slide']
    chart_ref = slides[i].find('.//c:chart', NS)
    relid = chart_ref.get(f"{{{NS['r']}}}id")
    rels = ET.fromstring(z.read(f'ppt/slides/_rels/slide{i}.xml.rels'))
    target = next(x.get('Target') for x in rels if x.get('Id') == relid)
    name = posixpath.normpath(posixpath.join('ppt/slides', target)).lstrip('/')
    root = ET.fromstring(z.read(name))
    scatter = root.find('.//c:scatterChart', NS)
    actual = []
    for series in scatter.findall('c:ser', NS):
        x = [float(v) for v in series.xpath('c:xVal//c:pt/c:v/text()', namespaces=NS)]
        y = [float(v) for v in series.xpath('c:yVal//c:pt/c:v/text()', namespaces=NS)]
        actual.append((x, y))
        if g['stage'] != 'points':
            check(series.find('c:smooth', NS).get('val') == '0', f'Smoothed chart on slide {i}')
    check(actual == expected_main[i], f'Slide {i} chart data mismatch: {actual}')
    for axis in root.findall('.//c:valAx', NS):
        orient = axis.find('c:axPos', NS).get('val')
        key = 'x' if orient == 'b' else 'y'
        check(float(axis.find('c:scaling/c:min', NS).get('val')) == 0, f'Slide {i}: nonzero origin')
        check(float(axis.find('c:scaling/c:max', NS).get('val')) == g[key+'max'], f'Slide {i}: axis max')
        check(float(axis.find('c:majorUnit', NS).get('val')) == g[key+'step'], f'Slide {i}: tick step')
    chart_count += 1
check(chart_count == 7, 'Expected seven native charts')

polygons = 0
for g in (g for g in geom if g['type'] == 'area'):
    name = 'plattegrond-driehoek' if g['triangle'] else 'plattegrond-rechthoek'
    shapes = slides[g['slide']].xpath(f'.//p:sp[p:nvSpPr/p:cNvPr[@name="{name}"]]', namespaces=NS)
    check(len(shapes) == 1, f'Slide {g["slide"]}: polygon missing')
    shape = shapes[0]
    transform = shape.find('p:spPr/a:xfrm', NS)
    off, ext = transform.find('a:off', NS), transform.find('a:ext', NS)
    ox, oy = float(off.get('x')) / 9525, float(off.get('y')) / 9525
    width, height = float(ext.get('cx')) / 9525, float(ext.get('cy')) / 9525
    poly = shape.find('p:spPr/a:custGeom/a:pathLst/a:path', NS)
    pw, ph = float(poly.get('w')), float(poly.get('h'))
    points = poly.xpath('a:moveTo/a:pt | a:lnTo/a:pt', namespaces=NS)
    drawn = [(ox + float(q.get('x')) / pw * width,
              oy + float(q.get('y')) / ph * height) for q in points]
    v, plot = g['values'], g['plot']
    expected_values = (3, 10, 2, 5) if g['slide'] in (11, 12) else (2, 8, 4, 8)
    check(tuple(v[k] for k in ('left', 'right', 'bottom', 'top')) == expected_values,
          'Changed semantic area coordinates')
    l, r, b, t = expected_values
    vertices = [(l, b), (r, b), (l, t)] if g['triangle'] else [(l, b), (r, b), (r, t), (l, t)]
    expected = [(plot['x'] + x/v['maxX']*plot['w'],
                 plot['y'] + plot['h'] - y/v['maxY']*plot['h']) for x, y in vertices]
    check(len(drawn) == len(expected), 'Wrong polygon vertex count')
    check(all(abs(a-c) < .01 and abs(b-d) < .01 for (a,b),(c,d) in zip(drawn,expected)),
          f'Slide {g["slide"]}: polygon geometry mismatch')
    polygons += 1
check(polygons == 8, 'Expected eight native area polygons')

table_count = sum(len(s.findall('.//a:tbl', NS)) for s in slides.values())
print(json.dumps({'ok': True, 'slides': 29, 'teacherNotes': note_count,
                  'overviewSlides': [1, 16, 29], 'nativeCharts': chart_count,
                  'nativeTables': table_count, 'checkedPolygons': polygons}, indent=2))
