"""Check saved §4.1.1 native graph data, notes and overview parity.

HOW TO ADAPT: change the independent model specifications and slide ownership
when authoring another paragraph. Run against the final PPTX, not a draft.
Visual inspection and chart_workbooks.py remain separate required checks.
Usage: python check-presentation-411.py FINAL.pptx
"""
import json
import math
import posixpath
import re
import sys
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET

NS = {k: 'http://schemas.openxmlformats.org/' + v for k, v in {
    'a': 'drawingml/2006/main', 'c': 'drawingml/2006/chart',
    'p': 'presentationml/2006/main',
    'r': 'officeDocument/2006/relationships'}.items()}


def close(actual, expected):
    assert math.isclose(actual, expected, abs_tol=1e-8), (actual, expected)


def values(series, coordinate):
    return [float(x.text) for x in series.findall(
        f'c:{coordinate}/c:numRef/c:numCache/c:pt/c:v', NS)]


def guide(series, q, price):
    xs, ys = values(series, 'xVal'), values(series, 'yVal')
    assert len(xs) == len(ys) == 3
    for actual, expected in zip(xs + ys, [0, q, q, price, price, 0]):
        close(actual, expected)


def slide_text(root):
    return '\n'.join(x.text or '' for x in root.findall('.//a:t', NS))


def overview(root):
    result = []
    for shape in root.findall('.//p:sp', NS):
        node = shape.find('p:nvSpPr/p:cNvPr', NS)
        if node.get('name') in ('phase', 'slide-number'):
            continue
        transform = shape.find('p:spPr/a:xfrm', NS)
        geometry = ET.tostring(transform) if transform is not None else b''
        result.append((node.get('name'), slide_text(shape), geometry))
    return result


def main():
    with ZipFile(Path(sys.argv[1])) as package:
        names = package.namelist()
        slide_names = sorted((n for n in names if re.fullmatch(r'ppt/slides/slide\d+.xml', n)),
                             key=lambda n: int(re.search(r'(\d+)\.xml', n).group(1)))
        assert len(slide_names) == 28
        roots = [ET.fromstring(package.read(n)) for n in slide_names]
        assert overview(roots[0]) == overview(roots[15]) == overview(roots[27])
        notes = [n for n in names if re.fullmatch(r'ppt/notesSlides/notesSlide\d+.xml', n)]
        assert len(notes) == 28
        for n in notes:
            note = ET.fromstring(package.read(n))
            content = slide_text(note)
            for marker in ['Vraag:', 'Uitleg:', 'Misvatting:', 'Overgang:', 'Bron:']:
                assert marker in content, (n, marker)
            for run in note.findall('.//a:rPr', NS):
                if run.get('sz') is not None:
                    assert int(run.get('sz')) >= 1400, n
        # Actual native object owners, not declared build counts.
        native_tables = [i + 1 for i, s in enumerate(roots) if s.findall('.//a:tbl', NS)]
        assert native_tables == [2, 3, 4, 10, 15, 17, 27]
        native_charts = {}
        for i, root in enumerate(roots, 1):
            for ref in root.findall('.//c:chart', NS):
                rel = ET.fromstring(package.read(f'ppt/slides/_rels/slide{i}.xml.rels'))
                target = next(x.get('Target') for x in rel
                              if x.get('Id') == ref.get('{' + NS['r'] + '}id'))
                chart_name = posixpath.normpath(posixpath.join('ppt/slides', target)).lstrip('/')
                native_charts[i] = ET.fromstring(package.read(chart_name))
        assert sorted(native_charts) == [5, 6, 7, 8, 11, 12, 13, 24, 25]
        points_checked = 0
        for number, root in native_charts.items():
            ss = root.findall('.//c:scatterChart/c:ser', NS)
            for s in ss:
                assert s.find('c:smooth', NS).get('val') == '0'
                assert len(values(s, 'xVal')) == len(values(s, 'yVal'))
                points_checked += len(values(s, 'xVal'))
            if number in [5, 8, 11, 13, 25]:
                a, b, c, capacity = (.02, 4, 200, 250) if number == 25 else (.05, 3, 45, 100)
                prices, q = {5: ([9], 60), 8: ([9, 6], 30), 11: ([5], 20),
                             13: ([5, 6], 30), 25: ([10, 8], 100)}[number]
                for x, y in zip(values(ss[0], 'xVal'), values(ss[0], 'yVal')):
                    close(y, 2*a*x+b)
                    assert 0 <= x <= capacity
                for x, y in zip(values(ss[1], 'xVal'), values(ss[1], 'yVal')):
                    close(y, a*x+b+c/x)
                    assert 0 < x <= capacity
                for series, price in zip(ss[2:], prices):
                    for y in values(series, 'yVal'):
                        close(y, price)
                close(2*a*q+b, prices[-1])
                assert q <= capacity
                guide(ss[-2], q, prices[-1])
                assert values(ss[-1], 'xVal') == [q]
                assert values(ss[-1], 'yVal') == [prices[-1]]
                if number in [8, 13, 25]:
                    close(q, math.sqrt(c/a))
                    close(prices[-1]*q, a*q*q+b*q+c)
            else:
                d, slope, b, a, capacity, n0, n1 = (
                    (16, .4, 4, .02, 250, 100, 200) if number == 24 else
                    (9, 1, 3, .05, 100, 200, 100) if number == 12 else
                    (15, 1, 3, .05, 100, 100, 300))
                after = number != 6
                for x, y in zip(values(ss[0], 'xVal'), values(ss[0], 'yVal')):
                    close(y, d-slope*x)
                for series, n in zip(ss[1:3] if after else ss[1:2], [n0, n1]):
                    for x, y in zip(values(series, 'xVal'), values(series, 'yVal')):
                        close(x*1000, n*(y-b)/(2*a))
                        assert x*1000 <= n*capacity + 1e-8
                eq = []
                for n in ([n0, n1] if after else [n0]):
                    q = (d-b)/(slope+2000*a/n)
                    price = d-slope*q
                    eq.append((q, price))
                offset = 3 if after else 2
                for series, (q, price) in zip(ss[offset:], eq):
                    guide(series, q, price)
                for series, (q, price) in zip(ss[offset+len(eq):], eq):
                    close(values(series, 'xVal')[0], q)
                    close(values(series, 'yVal')[0], price)
        # Questions all precede the first answer slide.
        assert 'capaciteit' in slide_text(roots[16])
        assert roots[17].findall('.//p:pic', NS)
        assert 'Lees de beginprijs af.' in slide_text(roots[18])
        assert 'Laat de kostencurven staan.' in slide_text(roots[18])
        assert 'Weerleg beide delen met de gegevens.' in slide_text(roots[19])
        assert 'Prijs en productie' in slide_text(roots[20])
    print(json.dumps({'ok': True, 'slides': 28, 'nativeTables': 7,
                      'nativeCharts': 9, 'chartPointsChecked': points_checked,
                      'overviewParity': [1, 16, 28], 'notes': 28,
                      'checks': ['functions and guides', 'supply aggregation and capacity',
                                 'long-run minimum and zero profit', 'straight scatter intent',
                                 'notes and 14pt floor', 'target ordering']}))


if __name__ == '__main__':
    main()
