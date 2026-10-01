"""Check saved §4.2.4 charts against economics, notes and repeated overviews.

HOW TO ADAPT: use the new paragraph's models and intended slide roles. This is
an output check, not a substitute for source/content and rendered-slide review.
Usage: python check-presentation-424.py FINAL.pptx BUILD/manifest.json
"""
import json
import posixpath
import sys
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET

NS = {'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
manifest = json.loads(Path(sys.argv[2]).read_text(encoding='utf-8'))


def close(a, b):
    assert abs(a - b) < 1e-6, (a, b)


def values(ser, axis):
    return [float(v.text) for v in ser.findall(f'c:{axis}//c:pt/c:v', NS)]


with ZipFile(sys.argv[1]) as z:
    checked = 0
    for g in manifest['graphs']:
        slide = ET.fromstring(z.read(f"ppt/slides/slide{g['slide']}.xml"))
        rid = slide.find('.//c:chart', NS).get(f"{{{NS['r']}}}id")
        rels = ET.fromstring(z.read(f"ppt/slides/_rels/slide{g['slide']}.xml.rels"))
        target = next(r.get('Target') for r in rels if r.get('Id') == rid)
        chart = ET.fromstring(z.read(posixpath.normpath(posixpath.join('ppt/slides', target)).lstrip('/')))
        actual = chart.findall('.//c:scatterChart/c:ser', NS)
        assert len(actual) == len(g['series'])
        m = g['model']
        a, b, d = m['a'], m['b'], m['d']
        q0, qe = (a-b)/2, (a-b-d)/2
        for s, contract in zip(actual, g['series']):
            x, y = values(s, 'xVal'), values(s, 'yVal')
            assert len(x) == len(y) == len(contract['xValues'])
            for v, e in zip(x, contract['xValues']): close(v, e)
            for v, e in zip(y, contract['values']): close(v, e)
            assert s.find('c:smooth', NS).get('val') == '0'
            name = contract['name']
            for q, price in zip(x, y):
                assert 0 <= q <= m['maxQ'] and 0 <= price <= m['maxP']
                if name == 'V': close(price, a-q)
                elif name == 'A': close(price, b+q)
                elif name == 'M': close(price, b+d+q)
            if name == 'E0': close(x[0], q0); close(y[0], a-q0)
            if name == 'Ee': close(x[0], qe); close(y[0], a-qe)
            if name == 'arcering':
                close(x[0], x[1]); assert qe < x[0] < q0
                close(y[0], a-x[0]); close(y[1], b+d+x[1])
            if name == 'verliesgrens':
                assert x == [qe, q0, q0, qe]
                assert y == [a-qe, a-q0, b+d+q0, a-qe]
                area = abs(sum(x[i]*y[(i+1)%4]-x[(i+1)%4]*y[i] for i in range(4)))/2
                close(area, 64 if m['key'] == 'coating' else 100)
            if name == 'belastingwig':
                assert x == [qe]*3
                close(y[0], b+qe); close(y[-1], a-qe); close(y[-1]-y[0], d)
            if name == 'aanbodverschuiving':
                close(y[0], y[1]); close(y[0], b+x[0]); close(y[1], b+d+x[1]); assert x[1] < x[0]
            if name == 'Q0-hulplijn': assert x == [q0, q0]; close(y[1], a-q0)
            if name == 'Qe-hulplijn': assert x == [qe, qe]; close(y[1], a-qe)
            checked += len(x)
        axes = chart.findall('.//c:valAx', NS)
        bounds = {ax.find('c:axPos', NS).get('val'): (float(ax.find('c:scaling/c:min', NS).get('val')), float(ax.find('c:scaling/c:max', NS).get('val'))) for ax in axes}
        assert bounds == {'b': (0, m['maxQ']), 'l': (0, m['maxP'])}, bounds

    # Stable names isolate phase emphasis from content/geometry equality.
    overviews = []
    for number in manifest['overviews']:
        root = ET.fromstring(z.read(f'ppt/slides/slide{number}.xml'))
        contents = {}
        for shape in root.findall('.//p:sp', NS):
            name = shape.find('p:nvSpPr/p:cNvPr', NS).get('name')
            if name.startswith(('route-', 'overview-')):
                contents[name] = (''.join(t.text or '' for t in shape.findall('.//a:t', NS)),
                                  ET.tostring(shape.find('p:spPr/a:xfrm', NS)).decode())
        overviews.append(contents)
    assert overviews[0] == overviews[1] == overviews[2]
    for number in range(1, 27):
        root = ET.fromstring(z.read(f'ppt/notesSlides/notesSlide{number}.xml'))
        note = ''.join(t.text or '' for t in root.findall('.//a:t', NS))
        assert all(k in note for k in ['Vraag:', 'Uitleg:', 'Misvatting:', 'Overgang:', 'Bron:'])
        sizes = [int(n.get('sz')) for n in root.iter() if n.get('sz')]
        assert sizes and min(sizes) >= 1400
    for spec in manifest['slides']:
        root = ET.fromstring(z.read(f"ppt/slides/slide{spec['number']}.xml"))
        actual_title = ''.join(n.text or '' for n in root.find('.//p:sp', NS).findall('.//a:t', NS))
        assert actual_title == spec['title'], (spec['number'], actual_title)
    assert max(s['number'] for s in manifest['slides'] if s['kind'] == 'target-question') < min(s['number'] for s in manifest['slides'] if s['kind'] == 'target-answer')

print(json.dumps({'ok': True, 'charts': len(manifest['graphs']), 'checked_coordinate_pairs': checked,
                  'overview_slides': manifest['overviews'], 'notes': 26, 'target_question_order': 'pass'}))
