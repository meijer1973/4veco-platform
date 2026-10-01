"""HOW TO ADAPT: assert saved native chart data against independent model formulas.

Usage: python check-presentation-411.py <final.pptx>
Complements rendered review; does not certify classroom timing or source approval.
"""
import json
import math
import posixpath
import sys
from pathlib import Path
from zipfile import ZipFile
from lxml import etree as E

NS = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
R = 'http://schemas.openxmlformats.org/package/2006/relationships'


def check(filename):
    count = points = 0
    with ZipFile(filename) as z:
        slide_xml = [n for n in z.namelist() if __import__('re').fullmatch(r'ppt/slides/slide\d+\.xml', n)]
        assert len(slide_xml) == 29
        overviews = []
        for number in range(1, 30):
            root = E.fromstring(z.read(f'ppt/slides/slide{number}.xml'))
            text = root.xpath('//a:t/text()', namespaces=NS)
            notes = E.fromstring(z.read(f'ppt/notesSlides/notesSlide{number}.xml'))
            note_text = '\n'.join(notes.xpath('//a:t/text()', namespaces=NS))
            assert all(x in note_text for x in ['Vraag:', 'Uitleg:', 'Misvatting:', 'Overgang:', 'Bron:'])
            assert all(int(v) >= 1400 for v in notes.xpath('//@sz'))
            if number in [1, 16, 29]:
                # Exclude current phase/slide number. Content and geometry match.
                shapes = []
                for sp in root.xpath('//p:sp', namespaces=NS):
                    texts = sp.xpath('.//a:t/text()', namespaces=NS)
                    if not texts or texts[0].startswith('Nu:') or texts == [str(number)]:
                        continue
                    shapes.append((texts, E.tostring(sp.find('p:spPr/a:xfrm', NS))))
                overviews.append(shapes)
            if number in [18, 25]:
                assert 'capaciteit' in note_text and 'P14' in note_text
            refs = root.xpath('//c:chart/@r:id', namespaces=NS)
            if not refs:
                continue
            assert len(refs) == 1
            rels = E.fromstring(z.read(f'ppt/slides/_rels/slide{number}.xml.rels'))
            target = next(e.get('Target') for e in rels if e.get('Id') == refs[0])
            chart_path = target.lstrip('/') if target.startswith('/') else posixpath.normpath(posixpath.join('ppt/slides', target))
            chart = E.fromstring(z.read(chart_path))
            is_market = number in [7, 8, 13, 18, 25]
            is_target = number in [18, 19, 25, 26]
            after = number in [8, 10, 13, 14, 25, 26]
            count += 1
            seen = set()
            for ser in chart.xpath('//c:scatterChart/c:ser', namespaces=NS):
                assert ser.find('c:smooth', NS).get('val') == '0'
                name = ''.join(ser.xpath('c:tx//c:v/text()', namespaces=NS))
                xs = list(map(float, ser.xpath('c:xVal//c:numCache/c:pt/c:v/text()', namespaces=NS)))
                ys = list(map(float, ser.xpath('c:yVal//c:numCache/c:pt/c:v/text()', namespaces=NS)))
                assert len(xs) == len(ys) and xs
                seen.add(name)
                expected = None
                if is_market:
                    if name == 'V':
                        expected = lambda x: (16 - .4*x) if is_target else (15 - .1*x)
                    elif name in ['A₀', 'A₁']:
                        b = 4 if is_target else 1
                        slope = (.2 if after and name == 'A₁' else .4) if is_target else (.075 if name == 'A₁' else .04 if number == 13 else .25)
                        expected = lambda x, b=b, slope=slope: b + slope*x
                    elif 'hulplijn' in name:
                        q, price = ((20, 8) if name.startswith('E₁') else (15, 10)) if is_target else ((80, 7) if name.startswith('E₁') else (100, 5) if number == 13 else (40, 11))
                        assert xs == [0, q, q] and ys == [price, price, 0]
                else:
                    a,b,c = (.02,4,200) if is_target else (.1,1,90)
                    if name == 'MK': expected = lambda x: 2*a*x+b
                    if name == 'GTK':
                        assert min(xs) > 0
                        expected = lambda x: a*x+b+c/x
                    if name.startswith('P₀'):
                        expected = lambda x: 10 if is_target else 5 if number == 14 else 11
                    if name.startswith('P₁'):
                        expected = lambda x: 8 if is_target else 7
                    if name == 'gekozen q':
                        q, price = (100,8) if is_target else (50,11) if number == 9 else (30,7)
                        assert xs == [q,q] and ys == [0,price]
                if expected:
                    for x,y in zip(xs,ys):
                        assert math.isclose(y, expected(x), abs_tol=1e-7), (number,name,x,y,expected(x))
                        points += 1
            if number == 18: assert seen == {'V', 'A₀'}
            if number == 19: assert seen == {'MK', 'GTK', 'P₀ = GO = MO'}
        assert overviews[0] == overviews[1] == overviews[2]
        assert count == 10
        assert len([n for n in z.namelist() if n.startswith('ppt/embeddings/') and n.endswith('.xlsx')]) == 10
    # Independent numeric checks of the lesson's displayed results.
    for a,b,c,price,q,profit in [(.1,1,90,11,50,160),(.1,1,90,7,30,0),(.1,1,90,5,20,-50),(.02,4,200,10,150,250),(.02,4,200,8,100,0)]:
        assert math.isclose(2*a*q+b,price)
        assert math.isclose(price*q-(a*q*q+b*q+c),profit,abs_tol=1e-8)
    print(json.dumps({'ok':True,'slides':29,'nativeCharts':count,'equationPointsChecked':points,'notes':29,'overviewParity':True}))


if __name__ == '__main__':
    check(Path(sys.argv[1]))
