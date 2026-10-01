"""HOW TO ADAPT: supply a saved PPTX and validate its actual chart coordinates.

This is scoped to the 3.3.3 classroom model, not a general textbook validator.
Usage: python check-presentation-333.py FINAL.pptx
"""
import json
import re
import sys
import xml.etree.ElementTree as ET
from zipfile import ZipFile

NS = {'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main'}

def close(a, b):
    assert abs(a-b) < 1e-6, (a, b)

def series(root):
    out = []
    for s in root.findall('.//c:ser', NS):
        title = s.findtext('c:tx/c:v', namespaces=NS)
        x = [float(v.text) for v in s.findall('.//c:xVal//c:pt/c:v', NS)]
        y = [float(v.text) for v in s.findall('.//c:yVal//c:pt/c:v', NS)]
        assert len(x) == len(y)
        out.append((title, x, y))
    return out

with ZipFile(sys.argv[1]) as z:
    chart_names = sorted((n for n in z.namelist() if re.search(r'/charts/chart\d+\.xml$', n)),
                         key=lambda n: int(re.search(r'chart(\d+)', n)[1]))
    assert len(chart_names) == 6
    stages = ['free', 'tariff', 'revenue', 'no-import', 'given', 'revenue']
    for i, file in enumerate(chart_names):
        root = ET.fromstring(z.read(file))
        a, c, pw, tariff, xmax, ymax = (50, 10, 18, 4, 100, 60) if i < 4 else (80, 0, 20, 10, 160, 80)
        if i == 3:
            tariff = 16
        price = 30 if i == 3 else pw + tariff
        qa, qv = (price-c)/.5, (a-price)/.5
        assert root.find('.//c:scatterChart', NS) is not None
        axes = root.findall('.//c:valAx', NS)
        assert sorted(float(e.find('c:scaling/c:max', NS).get('val')) for e in axes) == sorted([xmax, ymax])
        assert all(float(e.find('c:scaling/c:min', NS).get('val')) == 0 for e in axes)
        ss = series(root)
        for name, xs, ys in ss:
            if len(xs) == 1:  # labels are intentionally offset, not model points
                continue
            assert len(xs) == 2, 'Every actual line is straight, without smoothing overshoot'
            for x, y in zip(xs, ys):
                assert 0 <= x <= xmax and 0 <= y <= ymax
                if name == 'V': close(y, a-.5*x)
                if name == 'A': close(y, c+.5*x)
                if name == 'Pw': close(y, pw)
                if name == 'Pw + t': close(y, pw+tariff)
            if name == 'Arcering opbrengst':
                assert xs == [qa, qv] and ys[0] == ys[1] and pw < ys[0] < price
        if stages[i] == 'revenue':
            by_name = {n: (xs, ys) for n, xs, ys in ss}
            assert by_name['Opbrengst ondergrens'] == ([qa, qv], [pw, pw])
            assert by_name['Opbrengst bovengrens'] == ([qa, qv], [price, price])
            assert by_name['Opbrengst linkergrens'] == ([qa, qa], [pw, price])
            assert by_name['Opbrengst rechtergrens'] == ([qv, qv], [pw, price])
            close((qv-qa)*(price-pw), 128 if i == 2 else 400)
        if stages[i] == 'given':
            assert not any('Opbrengst' in n or 'Arcering' in n for n, _, _ in ss)
    slide_files = sorted((n for n in z.namelist() if re.search(r'(^|/)slides/slide\d+\.xml$', n)),
                         key=lambda n: int(re.search(r'slide(\d+)\.xml', n)[1]))
    assert len(slide_files) == 24
    note_files = [n for n in z.namelist() if re.search(r'notesSlides/notesSlide\d+\.xml$', n)]
    assert len(note_files) == 24
    for file in note_files:
        root = ET.fromstring(z.read(file))
        txt = ' '.join(t.text or '' for t in root.findall('.//a:t', NS))
        assert all(label in txt for label in ['Vraag:', 'Uitleg:', 'Misvatting:', 'Overgang:', 'Bron:'])
        sizes = [int(e.get('sz')) for e in root.iter() if e.get('sz')]
        assert sizes and min(sizes) >= 1400
    def overview(file):
        root = ET.fromstring(z.read(file))
        result = []
        for shape in root.findall('.//p:sp', NS):
            name = shape.find('p:nvSpPr/p:cNvPr', NS).get('name')
            txt = '\n'.join(t.text or '' for t in shape.findall('.//a:t', NS))
            if name == 'phase' or txt.isdigit(): continue
            geometry = ET.tostring(shape.find('p:spPr/a:xfrm', NS))
            result.append((name, txt, geometry))
        return result
    assert overview(slide_files[0]) == overview(slide_files[13]) == overview(slide_files[23])
    tables = sum(len(ET.fromstring(z.read(n)).findall('.//a:tbl', NS)) for n in slide_files)
    print(json.dumps({'ok': True, 'slides': 24, 'notes': 24, 'charts': 6, 'tables': tables,
                      'overviewParity': [1, 14, 24], 'geometry': 'actual saved XY data, axes, straight edges, hatching and rectangle areas'}))
