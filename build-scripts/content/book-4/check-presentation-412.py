"""Validate saved §4.1.2 classroom objects and graph mathematics.

HOW TO ADAPT: change the independent equation/domain contracts and expected
owner slides for another paragraph. This complements, never replaces, visual
and source-content review. Usage: python check-presentation-412.py FINAL.pptx
"""
import json
import posixpath
import re
import sys
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET

NS = {'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
CHART_SLIDES = [5, 6, 8, 10, 11, 15, 20, 21]
TABLE_SLIDES = [2, 3, 4, 7, 12, 19, 23]


def values(series, tag):
    return [float(v.text) for v in series.findall(f'c:{tag}//c:pt/c:v', NS)]


def text(node):
    return '\n'.join(t.text or '' for t in node.findall('.//a:t', NS))


def check(file):
    points_checked = 0
    tables, charts, overview, axes = [], [], [], {}
    with ZipFile(file) as z:
        slide_paths = sorted((s for s in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml', s)),
                             key=lambda s: int(re.search(r'(\d+)\.xml', s)[1]))
        assert len(slide_paths) == 24
        for number, part in enumerate(slide_paths, 1):
            root = ET.fromstring(z.read(part))
            if root.findall('.//a:tbl', NS):
                tables.append(number)
            for prop in root.findall('.//a:rPr', NS):
                if 'sz' in prop.attrib:
                    assert int(prop.get('sz')) >= 1400, (number, 'small text')
            note = ET.fromstring(z.read(f'ppt/notesSlides/notesSlide{number}.xml'))
            nt = text(note)
            assert all(s in nt for s in ['Vraag:', 'Uitleg:', 'Misvatting:', 'Overgang:', 'Bron:'])
            for prop in note.findall('.//a:rPr', NS):
                if 'sz' in prop.attrib:
                    assert int(prop.get('sz')) >= 1400
            if number in [1, 13, 24]:
                stable = []
                for shape in root.findall('.//p:sp', NS):
                    name = shape.find('p:nvSpPr/p:cNvPr', NS).get('name')
                    if name == 'phase' or text(shape) == str(number):
                        continue
                    geometry = shape.find('p:spPr/a:xfrm', NS)
                    stable.append((name, text(shape), ET.tostring(geometry)))
                overview.append(stable)
            chart_node = root.find('.//c:chart', NS)
            if chart_node is None:
                continue
            charts.append(number)
            rels = ET.fromstring(z.read(f'ppt/slides/_rels/slide{number}.xml.rels'))
            target = next(r.get('Target') for r in rels if r.get('Id') == chart_node.get('{'+NS['r']+'}id'))
            resolved = target.lstrip('/') if target.startswith('/') else posixpath.normpath(posixpath.join('ppt/slides', target))
            chart = ET.fromstring(z.read(resolved))
            assert chart.find('.//c:scatterChart', NS) is not None
            axes[number] = [(a.find('c:scaling/c:min', NS).get('val'), a.find('c:scaling/c:max', NS).get('val'))
                            for a in chart.findall('.//c:valAx', NS)]
            for si, series in enumerate(chart.findall('.//c:ser', NS)):
                assert series.find('c:smooth', NS).get('val') == '0'
                xs, ys = values(series, 'xVal'), values(series, 'yVal')
                assert len(xs) == len(ys) > 0
                assert all(v >= 0 for v in xs+ys)
                if si == 0 or (number == 11 and si == 1):
                    intercept, slope, domain = ((6, 0, 50) if number == 5 else
                                               (24, .1, 240) if number in [15, 20, 21] else
                                               (36, .25, 144) if number == 11 and si == 1 else
                                               (30, .25, 120))
                    assert min(xs) == 0 and max(xs) == domain
                    for x, y in zip(xs, ys):
                        assert abs(y - (intercept-slope*x)) < 1e-9, (number, x, y)
                        points_checked += 1
                    assert series.findall('.//c:dLbl/c:tx', NS), (number, 'missing direct label')
                else:
                    # Guides are axis-aligned and meet the actual demand curves.
                    assert all(x1 == x2 or y1 == y2 for x1,x2,y1,y2 in zip(xs,xs[1:],ys,ys[1:])), number
                    hits = [(x,y) for x,y in zip(xs,ys) if x>0 and y>0]
                    a,b = ((24,.1) if number in [15,20,21] else (30,.25))
                    assert any(abs(y-(a-b*x))<1e-9 or (number==11 and abs(y-(36-.25*x))<1e-9)
                               for x,y in hits), (number, xs, ys)
        assert tables == TABLE_SLIDES
        assert charts == CHART_SLIDES
        assert overview[0] == overview[1] == overview[2], 'overview text/geometry mismatch'
        assert axes[6] == axes[8] == axes[10] == axes[11], 'teaching axes differ'
        assert axes[15] == axes[20] == axes[21], 'target axes differ'
    return {'status':'PASS', 'slides':24, 'tables':tables, 'charts':charts,
            'equationPointsChecked':points_checked, 'overviewParity':True,
            'notesFloorPt':14, 'straightScatter':True}


if __name__ == '__main__':
    print(json.dumps(check(Path(sys.argv[1])), indent=2))
