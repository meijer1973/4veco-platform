"""HOW TO ADAPT: derive graph equations and expected artifacts from new sources.
Checks the saved PPTX's actual chart coordinates, not a disconnected drawing plan.
Usage: python check-presentation-315.py FINAL.pptx
"""
import json
import re
import sys
from fractions import Fraction
from pathlib import Path
from zipfile import ZipFile
from lxml import etree as ET

NS = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart'}


def close(a, b):
    assert abs(a-b) < 1e-8, (a, b)


with ZipFile(Path(sys.argv[1])) as z:
    slide_files = sorted((n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+.xml', n)),
                         key=lambda n: int(re.search(r'(\d+)\.xml', n)[1]))
    assert len(slide_files) == 25
    slide_xml = [ET.fromstring(z.read(n)) for n in slide_files]
    assert sum(len(r.findall('.//a:tbl', NS)) for r in slide_xml) == 4
    texts = [' '.join(r.xpath('//a:t/text()', namespaces=NS)) for r in slide_xml]
    assert all('Opgave 43' not in t for t in texts[1:14])
    for index, expected in [(17, 'Bereken het vrije evenwicht'), (18, 'twee berekende verschillen'),
                            (19, 'Q₀ = 60'), (21, '€ 640'), (23, 'De uitspraak is onjuist')]:
        assert expected in texts[index], (index+1, expected)

    def overview(number):
        rows = []
        for shape in slide_xml[number-1].findall('.//p:sp', NS):
            name = shape.find('p:nvSpPr/p:cNvPr', NS).get('name')
            text = '|'.join(shape.xpath('.//a:t/text()', namespaces=NS))
            if name == 'phase' or text == str(number):
                continue
            position = ET.tostring(shape.find('p:spPr/a:xfrm', NS))
            rows.append((name, text, position))
        return rows
    assert overview(1) == overview(15) == overview(25)
    notes = [ET.fromstring(z.read(n)) for n in z.namelist()
             if re.fullmatch(r'ppt/notesSlides/notesSlide\d+.xml', n)]
    assert len(notes) == 25
    for root in notes:
        body = ' '.join(root.xpath('//a:t/text()', namespaces=NS))
        assert all(s in body for s in ('Vraag:', 'Uitleg:', 'Misvatting:', 'Overgang:', 'Bron:'))
        assert all(int(v) >= 1400 for v in root.xpath('//@sz'))
    assert all(int(v) >= 1400 for root in slide_xml for v in root.xpath('//@sz'))

    chart_names = sorted((n for n in z.namelist() if '/charts/' in n and n.endswith('.xml')),
                         key=lambda n: int(re.search(r'(\d+)\.xml', n)[1]))
    assert len(chart_names) == 7
    checked = []
    for i, name in enumerate(chart_names):
        root = ET.fromstring(z.read(name))
        # First four charts use authored E; remaining three use textbook T.
        d, b, a, c, xmax, price = (24, .2, 6, .1, 120, 15) if i < 4 else (20, .1, 8, .1, 160, 16)
        q0=float(Fraction(d-a)/(Fraction(str(b))+Fraction(str(c))))
        p0=d-b*q0; qv=(d-price)/b; qa=(price-a)/c
        series = {}
        for s in root.findall('.//c:ser', NS):
            label = s.findtext('c:tx/c:v', namespaces=NS)
            x=[float(v) for v in s.xpath('c:xVal//c:pt/c:v/text()', namespaces=NS)]
            y=[float(v) for v in s.xpath('c:yVal//c:pt/c:v/text()', namespaces=NS)]
            assert len(x) == len(y) and len(x) >= 2
            assert s.find('c:smooth', NS).get('val') == '0'
            assert all(0 <= x0 <= xmax and 0 <= y0 <= 26 for x0, y0 in zip(x, y))
            series[label]=(x,y)
        expected = {'V', 'A'}
        if i == 0: expected.add('Vrij evenwicht')
        if i in (1, 2, 5): expected.update(['Pmin', 'Qv', 'Qa'])
        if i in (2, 5): expected.update(['U-rechthoek'] + [f'U-arcering {y}' for y in range(1, price)])
        if i in (3, 6): expected.update(['Quotum', 'Verkoopprijs op V'])
        assert set(series) == expected, (name, set(series), expected)
        for label, intercept, slope in [('V',d,-b),('A',a,c)]:
            for x,y in zip(*series[label]): close(y,intercept+slope*x)
        if 'Vrij evenwicht' in series:
            assert series['Vrij evenwicht'] == ([0,q0,q0],[p0,p0,0])
        if 'Pmin' in series:
            assert series['Pmin'] == ([0,xmax],[price,price])
            assert series['Qv'] == ([qv,qv],[0,price])
            assert series['Qa'] == ([qa,qa],[0,price])
        if 'U-rechthoek' in series:
            assert series['U-rechthoek'] == ([qv,qa,qa,qv,qv],[0,0,price,price,0])
            for label,(x,y) in series.items():
                if label.startswith('U-arcering'): assert x == [qv,qa] and y[0] == y[1] and 0 < y[0] < price
            close((qa-qv)*price,675 if i<4 else 640)
        if 'Quotum' in series:
            assert series['Quotum'] == ([qv,qv],[0,26])
            assert series['Verkoopprijs op V'] == ([0,qv],[price,price])
        axes=root.findall('.//c:valAx',NS)
        limits={a.find('c:axPos',NS).get('val'):(float(a.find('c:scaling/c:min',NS).get('val')),float(a.find('c:scaling/c:max',NS).get('val'))) for a in axes}
        assert limits == {'l':(0,26),'b':(0,xmax)}
        checked.append({'chart':i+1,'series':len(series),'coordinates':'PASS'})
print(json.dumps({'ok':True,'slides':25,'tables':4,'charts':checked,'notes':25,'overviewParity':[1,15,25]},indent=2))
