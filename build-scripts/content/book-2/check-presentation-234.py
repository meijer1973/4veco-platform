"""Verify the saved §2.3.4 PPTX, including actual chart/area geometry.

HOW TO ADAPT: replace the independent mathematical contracts and slide owners
for the new lesson. This reads final OOXML, not the author's geometry manifest.
Usage: python check-presentation-234.py FINAL.pptx [--lessons PATH]
"""
import argparse
import hashlib
import json
import pathlib
import posixpath
import re
import xml.etree.ElementTree as ET
import zipfile

NS = {
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
}
EMU = 9525


def text(root):
    return ' '.join(n.text or '' for n in root.findall('.//a:t', NS))


def normalized(value):
    return re.sub(r'\s+', '', value)


def geometry(shape):
    x = shape.find('p:spPr/a:xfrm', NS)
    assert all(x.get(attr, '0') in ['0', 'false'] for attr in ['rot', 'flipH', 'flipV'])
    o, e = x.find('a:off', NS), x.find('a:ext', NS)
    return [float(o.get('x')) / EMU, float(o.get('y')) / EMU,
            float(e.get('cx')) / EMU, float(e.get('cy')) / EMU]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pptx', type=pathlib.Path)
    ap.add_argument('--lessons', type=pathlib.Path, default=pathlib.Path('../4veco-lessen'))
    args = ap.parse_args()
    author = json.loads(pathlib.Path(__file__).with_name('presentation-234.manifest.json').read_text(encoding='utf-8'))
    edition = args.lessons / author['sourceEdition']
    for name, expected in author['sourceFiles'].items():
        assert hashlib.sha256((edition / name).read_bytes()).hexdigest() == expected, name

    with zipfile.ZipFile(args.pptx) as z:
        names = sorted([n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml', n)],
                       key=lambda n: int(re.search(r'(\d+)\.xml', n).group(1)))
        assert len(names) == 22
        roots = {i + 1: ET.fromstring(z.read(n)) for i, n in enumerate(names)}
        slide_text = {i: text(r) for i, r in roots.items()}
        for i in roots:
            notes = ET.fromstring(z.read(f'ppt/notesSlides/notesSlide{i}.xml'))
            assert all(label in text(notes) for label in ['Vraag:', 'Uitleg:', 'Misvatting:', 'Overgang:', 'Bron:'])
            assert author['sourceCommit'] in text(notes)
            assert all(float(n.get('sz')) >= 1400 for n in notes.iter() if n.get('sz'))
            assert all(float(n.get('sz')) >= 1400 for n in roots[i].iter() if n.get('sz'))

        def overview(i):
            out = []
            for s in roots[i].findall('.//p:sp', NS):
                name = s.find('p:nvSpPr/p:cNvPr', NS).get('name')
                if name not in ['phase', 'slide-number']:
                    out.append((name, text(s), geometry(s)))
            return out
        assert overview(1) == overview(6) == overview(22)
        assert 'Opgaven 1, 2, 3, 4, 5, 6, 7' in slide_text[1]
        assert all('Uitlegvoorbeeld — niet uit het boek' in slide_text[i] for i in [3, 4, 5])

        manuscript = (edition / 'bronnen/H3/manuscript/2.3.4 Gemengde opgaven – opgaven.md').read_text(encoding='utf-8')
        question_section = manuscript.split('**Opgave 3 · Huurfietsen op een eiland — vragen**')[1].split('</div>')[0]
        qs = re.findall(r'^\d\) (.+)$', question_section, re.M)
        assert len(qs) == 6
        displayed = normalized(slide_text[11] + slide_text[12])
        assert all(normalized(q) in displayed for q in qs), 'Missing or altered target question'

        # Independent economic contracts. Vertices are in (Q,P) units.
        v = lambda q: 80 - q
        a = lambda q: 20 + .5 * q
        qe, pe, cap, price = (80 - 20) / 1.5, 40, 30, 45
        expected_areas = {
            14: {'area-CS': [(0, pe), (0, v(0)), (qe, pe)],
                 'area-PS': [(0, a(0)), (0, pe), (qe, pe)]},
            16: {'area-CS-rectangle': [(0, price), (0, v(cap)), (cap, v(cap)), (cap, price)],
                 'area-CS-triangle': [(0, v(cap)), (0, v(0)), (cap, v(cap))]},
            17: {'area-PS-rectangle': [(0, a(cap)), (0, price), (cap, price), (cap, a(cap))],
                 'area-PS-triangle': [(0, a(0)), (0, a(cap)), (cap, a(cap))]},
            19: {'area-loss': [(cap, a(cap)), (cap, v(cap)), (qe, pe)]},
        }
        chart_owners, table_owners, areas = [], [], []
        for i, root in roots.items():
            if root.findall('.//a:tbl', NS):
                table_owners.append(i)
            frames = [f for f in root.findall('.//p:graphicFrame', NS) if f.find('.//c:chart', NS) is not None]
            if not frames:
                continue
            assert len(frames) == 1
            chart_owners.append(i)
            frame = frames[0]
            rid = frame.find('.//c:chart', NS).get('{' + NS['r'] + '}id')
            rels = ET.fromstring(z.read(f'ppt/slides/_rels/slide{i}.xml.rels'))
            target = next(r.get('Target') for r in rels if r.get('Id') == rid)
            chart_path = target.lstrip('/') if target.startswith('/') else posixpath.normpath('ppt/slides/' + target)
            chart = ET.fromstring(z.read(chart_path))
            assert all(float(n.get('sz')) >= 1400 for n in chart.iter() if n.get('sz'))
            assert chart.find('.//c:scatterChart', NS) is not None
            axes = chart.findall('.//c:valAx', NS)
            assert len(axes) == 2
            assert all(ax.find('c:scaling/c:min', NS).get('val') == '0' for ax in axes)
            assert all(ax.find('c:scaling/c:max', NS).get('val') == '80' for ax in axes)
            assert all(ax.find('c:scaling/c:orientation', NS) is None or
                       ax.find('c:scaling/c:orientation', NS).get('val') == 'minMax' for ax in axes)
            layout = chart.find('.//c:plotArea/c:layout/c:manualLayout', NS)
            assert layout.find('c:layoutTarget', NS).get('val') == 'inner'
            for mode, expected in [('xMode', 'edge'), ('yMode', 'edge'), ('wMode', 'factor'), ('hMode', 'factor')]:
                assert layout.find('c:' + mode, NS).get('val') == expected
            xf = frame.find('p:xfrm', NS)
            assert all(xf.get(attr, '0') in ['0', 'false'] for attr in ['rot', 'flipH', 'flipV'])
            off, ext = xf.find('a:off', NS), xf.find('a:ext', NS)
            cx, cy = float(ext.get('cx')) / EMU, float(ext.get('cy')) / EMU
            left = float(off.get('x')) / EMU + cx * float(layout.find('c:x', NS).get('val'))
            top = float(off.get('y')) / EMU + cy * float(layout.find('c:y', NS).get('val'))
            width = cx * float(layout.find('c:w', NS).get('val'))
            height = cy * float(layout.find('c:h', NS).get('val'))
            series = {}
            for ser in chart.findall('.//c:scatterChart/c:ser', NS):
                name = ser.find('c:tx/c:v', NS)
                if name is None:
                    name = ser.find('c:tx/c:strRef/c:strCache/c:pt/c:v', NS)
                vals = []
                for axis in ['xVal', 'yVal']:
                    pts = ser.findall(f'c:{axis}/c:numRef/c:numCache/c:pt', NS)
                    if not pts:
                        pts = ser.findall(f'c:{axis}/c:numLit/c:pt', NS)
                    vals.append([float(pt.find('c:v', NS).text) for pt in pts])
                assert len(vals[0]) == len(vals[1])
                xy = list(zip(*vals))
                # Two-point segments cannot be curved by PowerPoint defaults.
                assert len(xy) <= 2, (i, name.text, 'Unexpected multi-point interpolation')
                series[name.text] = xy
            assert series['V'] == [(0, v(0)), (80, v(80))]
            assert series['A = MK'] == [(0, a(0)), (80, a(80))]
            if i in [13, 14, 19]:
                assert series['Pe'] == [(0, pe), (qe, pe)]
                assert series['Qe'] == [(qe, pe), (qe, 0)]
                assert series['E'] == [(qe, pe)]
            if i in [16, 17, 19]:
                assert series['Transactieprijs'] == [(0, price), (80, price)]
                assert series['Boekingsgrens'] == [(cap, 0), (cap, 80)]
            for sp in root.findall('.//p:sp', NS):
                name = sp.find('p:nvSpPr/p:cNvPr', NS).get('name')
                if not name.startswith('area-'):
                    continue
                l, t, w, h = geometry(sp)
                path = sp.find('p:spPr/a:custGeom/a:pathLst/a:path', NS)
                points = path.findall('a:moveTo/a:pt', NS) + path.findall('a:lnTo/a:pt', NS)
                actual_px = [(l + float(pt.get('x')) / float(path.get('w')) * w,
                              t + float(pt.get('y')) / float(path.get('h')) * h) for pt in points]
                expected = expected_areas[i][name]
                assert len(expected) == len(actual_px)
                for (q, price_value), (x, y) in zip(expected, actual_px):
                    assert abs(x - (left + q / 80 * width)) <= 1.5
                    assert abs(y - (top + (1 - price_value / 80) * height)) <= 1.5
                actual_units = [((x-left)/width*80, (1-(y-top)/height)*80) for x, y in actual_px]
                area = abs(sum(x * actual_units[(j+1) % len(actual_units)][1] - actual_units[(j+1) % len(actual_units)][0] * y
                               for j, (x, y) in enumerate(actual_units))) / 2
                areas.append({'slide': i, 'shape': name, 'area_euro': round(area, 6)})
        assert chart_owners == [9, 13, 14, 16, 17, 19]
        assert len(areas) == 7
        assert all(abs(r['area_euro'] - expected) < .01 for r, expected in
                   zip(areas, [800, 400, 150, 450, 300, 225, 75])), areas
        assert 8 * (26-20) + .5 * 8 * (42-26) == 112
        assert 8 * (20-14) + .5 * 8 * (14-6) == 80
        assert 216 - (112+80) == .5*(12-8)*(26-14) == 24
        assert 49-45 == 4 and 45-35.5 == 9.5
        print(json.dumps({'ok': True, 'slides': 22, 'notes': 22, 'overviewSlides': [1, 6, 22],
                          'targetQuestions': 6, 'sourceHashes': len(author['sourceFiles']),
                          'chartSlides': chart_owners, 'tableSlides': table_owners,
                          'actualPolygonAreas': areas}, indent=2))


if __name__ == '__main__':
    main()
