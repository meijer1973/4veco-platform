"""Check the saved §4.3.3 package, actual chart coordinates and overview parity.

HOW TO ADAPT: derive mathematical contracts from the new source/teaching example,
then update owner slides. This complements, and does not replace, visual review.
Usage: python check-presentation-433.py FINAL.pptx
"""
import json
import posixpath
import re
import sys
from pathlib import Path
from zipfile import ZipFile
from lxml import etree as ET

NS = {'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
z = ZipFile(Path(sys.argv[1]))
slides = {int(re.search(r'slide(\d+)', name)[1]): ET.fromstring(z.read(name))
          for name in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml', name)}
assert sorted(slides) == list(range(1, 29))

def content(root):
    return '\n'.join(root.xpath('.//a:t/text()', namespaces=NS))

def overview(root):
    result = []
    for shape in root.findall('.//p:sp', NS):
        name = shape.find('p:nvSpPr/p:cNvPr', NS).get('name')
        if name == 'phase' or name in ('1', '16', '28'):
            continue
        transform = shape.find('p:spPr/a:xfrm', NS)
        result.append((name, content(shape), ET.tostring(transform)))
    return result

assert overview(slides[1]) == overview(slides[16]) == overview(slides[28])
for number in range(1, 29):
    note = ET.fromstring(z.read(f'ppt/notesSlides/notesSlide{number}.xml'))
    text = content(note)
    assert all(label in text for label in ['Vraag:', 'Uitleg:', 'Misvatting:', 'Overgang:', 'Bron:'])
    sizes = note.xpath('.//a:rPr/@sz | .//a:defRPr/@sz', namespaces=NS)
    assert sizes and min(map(int, sizes)) >= 1400
    sizes = slides[number].xpath('.//a:rPr/@sz | .//a:defRPr/@sz', namespaces=NS)
    assert sizes and min(map(int, sizes)) >= 1400

table_slides = [n for n, root in slides.items() if root.findall('.//a:tbl', NS)]
assert table_slides == [3, 4, 5, 6, 7, 14, 18, 27]
chart_slides, point_count = [], 0
for number, root in slides.items():
    chart = root.find('.//c:chart', NS)
    if chart is None:
        continue
    chart_slides.append(number)
    rels = ET.fromstring(z.read(f'ppt/slides/_rels/slide{number}.xml.rels'))
    rel = next(r for r in rels if r.get('Id') == chart.get('{'+NS['r']+'}id'))
    part = posixpath.normpath(posixpath.join('ppt/slides', rel.get('Target'))).lstrip('/')
    data = ET.fromstring(z.read(part))
    actual = {}
    for series in data.findall('.//c:scatterChart/c:ser', NS):
        name = series.find('c:tx/c:v', NS).text
        x = [float(v) for v in series.xpath('c:xVal//c:pt/c:v/text()', namespaces=NS)]
        y = [float(v) for v in series.xpath('c:yVal//c:pt/c:v/text()', namespaces=NS)]
        assert len(x) == len(y)
        actual[name] = list(zip(x, y))
        assert series.find('c:smooth', NS).get('val') == '0'
        point_count += len(x)
    if number < 20:
        old, new, slope, supply, low, high = 220, 180, 10, -20, 2, 18
        e0, e1, fixed = (100, 12), (80, 10), 60
        xmax, ymax = 200, 20
    else:
        old, new, slope, supply, low, high = 180, 144, 6, -12, 2, 24
        e0, e1, fixed = (84, 16), (66, 13), 48
        xmax, ymax = 180, 30
    for name, intercept, sign in [('Arbeidsvraag oud', old, -1),
                                   ('Arbeidsvraag nieuw', new, -1),
                                   ('Arbeidsaanbod', supply, 1)]:
        if name not in actual:
            assert name == 'Arbeidsvraag nieuw' and number == 8
            continue
        pts = actual[name]
        assert sorted(y for x, y in pts) == [low, high]
        assert all(abs(x - (intercept + sign*slope*y)) < 1e-8 for x, y in pts)
    for name, expected in [('E0', e0), ('E1', e1)]:
        if name in actual:
            assert actual[name] == [expected]
            for axis, pts in [('horizontaal', [(0, expected[1]), expected]),
                              ('verticaal', [(expected[0], 0), expected])]:
                assert actual[f'{name} {axis}'] == pts
    if number in (13, 26):
        assert actual['aanbodoverschot'] == [(fixed, e0[1]), e0]
        assert actual['vraag vast loon'] == [(fixed, 0), (fixed, e0[1])]
        assert actual['aanbod vast loon'] == [(e0[0], 0), e0]
        assert e0[0] - fixed == (40 if number == 13 else 36)
    if number == 9:
        assert actual['vraagverschuiving'] == [(160, 6), (120, 6)]
        assert actual['pijlpunt'][1] == (120, 6)
    if number == 20:
        assert 'E0' not in actual and 'E1' not in actual and 'aanbodoverschot' not in actual
    axes = data.findall('.//c:valAx', NS)
    assert {a.find('c:axPos', NS).get('val'): float(a.find('c:scaling/c:max', NS).get('val'))
            for a in axes} == {'b': xmax, 'l': ymax}
    assert all(a.find('c:scaling/c:min', NS).get('val') == '0' for a in axes)

assert chart_slides == [8, 9, 11, 13, 20, 24, 26]
questions = ' '.join(content(slides[n]) for n in range(17, 21))
assert all(s in questions for s in ['2.700', '300 werklozen', '120 vacatures',
    '180 − 6w', '144 − 6w', '−12 + 6w', '€ 2 ≤ w ≤ € 24', '25a', '25b', '25c',
    'Markeer het oude en nieuwe evenwicht', 'loon dat € 16 blijft'])
assert '66 personen' not in questions and '36 personen' not in questions and '10%' not in questions
print(json.dumps({'ok': True, 'slides': 28, 'notesWith14ptFloor': 28,
                  'overviewSlides': [1,16,28], 'nativeTables': len(table_slides),
                  'nativeCharts': len(chart_slides), 'actualChartPointsChecked': point_count,
                  'targetQuestionsBeforeAnswers': True}, indent=2))
