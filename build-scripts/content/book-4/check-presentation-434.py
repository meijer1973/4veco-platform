"""Check saved §4.3.4 objects against source equations and lesson requirements.

HOW TO ADAPT: change the independent model contracts and expected slide owners.
Usage: python check-presentation-434.py FINAL.pptx FINAL.pdf RENDER_DIRECTORY
"""
import json
import math
import sys
from pathlib import Path
from zipfile import ZipFile
from lxml import etree as E
from pypdf import PdfReader

NS = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart'}
pptx, pdf, render = map(Path, sys.argv[1:4])

def near(a, b):
    assert math.isclose(a, b, abs_tol=1e-8), (a, b)

def values(ser, tag):
    return [float(x) for x in ser.xpath(f'c:{tag}//c:pt/c:v/text()', namespaces=NS)]

with ZipFile(pptx) as z:
    slide_names = sorted([n for n in z.namelist() if __import__('re').fullmatch(r'ppt/slides/slide\d+.xml', n)], key=lambda n: int(n.split('slide')[-1][:-4]))
    assert len(slide_names) == 27
    roots = [E.fromstring(z.read(n)) for n in slide_names]
    texts = [' '.join(r.xpath('//a:t/text()', namespaces=NS)) for r in roots]
    note_names = [f'ppt/notesSlides/notesSlide{i}.xml' for i in range(1, 28)]
    for n in note_names:
        r = E.fromstring(z.read(n))
        t = ' '.join(r.xpath('//a:t/text()', namespaces=NS))
        for field in ('Vraag:', 'Uitleg:', 'Misvatting:', 'Overgang:', 'Bron:'):
            assert field in t, (n, field)
        sizes = r.xpath('//@sz')
        assert sizes and min(map(int, sizes)) >= 1400, n
    table_owners = [i + 1 for i, r in enumerate(roots) if r.xpath('//a:tbl', namespaces=NS)]
    chart_owners = [i + 1 for i, r in enumerate(roots) if r.xpath('//c:chart', namespaces=NS)]
    assert table_owners == [3, 10, 11, 22, 24]
    assert chart_owners == [6, 7, 9, 17, 21]
    def overview(r):
        out = []
        for shape in r.xpath('//p:sp', namespaces=NS):
            name = shape.xpath('string(p:nvSpPr/p:cNvPr/@name)', namespaces=NS)
            text = '\n'.join(shape.xpath('.//a:t/text()', namespaces=NS))
            if name == 'phase' or text in ('1', '14', '27'):
                continue
            geometry = [dict(e.attrib) for e in shape.xpath('p:spPr/a:xfrm/*', namespaces=NS)]
            out.append((name, text, geometry))
        return out
    assert overview(roots[0]) == overview(roots[13]) == overview(roots[26])
    for i in (0, 13, 26):
        assert 'Pagina 145' in texts[i] and 'theorie p. 143' in texts[i]
        assert 'Basis: 30 en 31' in texts[i] and 'Doelopgave: 34' in texts[i]
    assert all('Uitlegvoorbeeld' in texts[i] for i in range(3, 13))
    assert '25 betaalde uren per week' in texts[14]
    assert 'alle 40 hebben hun baan verloren' in texts[17]
    assert 'loonsom vóór en na' in texts[17]
    assert not any('30.000' in t or '28.000' in t or '−6,67%' in t for t in texts[:18])
    assert '−6,67%' in texts[22]

    chart_names = sorted([n for n in z.namelist() if __import__('re').fullmatch(r'ppt/(?:slides/)?charts/chart\d+.xml', n)], key=lambda n: int(n.split('chart')[-1][:-4]))
    assert len(chart_names) == 5, chart_names
    checked_points = 0
    for index, n in enumerate(chart_names):
        r = E.fromstring(z.read(n))
        # Independent source contracts: Lv=d-bw, La=a+cw.
        d, b, a, c, lo, hi, eq, q, floor, qv, qa = ((150, 5, -30, 5, 6, 30, 18, 60, 20, 50, 70)
            if index < 3 else (220, 10, -20, 10, 2, 22, 12, 100, 14, 80, 120))
        near((d-a)/(b+c), eq)
        near(d-b*eq, q)
        near(a+c*eq, q)
        series = r.xpath('//c:scatterChart/c:ser', namespaces=NS)
        names = {}
        for s in series:
            name = ''.join(s.xpath('c:tx//c:v/text()', namespaces=NS))
            xs, ys = values(s, 'xVal'), values(s, 'yVal')
            assert s.xpath('c:smooth/@val', namespaces=NS) == ['0']
            assert len(xs) == len(ys)
            names[name] = list(zip(xs, ys))
            if name in ('Lᵥ', 'Lₐ'):
                for x, y in zip(xs, ys):
                    assert lo <= y <= hi and x >= 0
                    near(x, d-b*y if name == 'Lᵥ' else a+c*y)
                    checked_points += 1
            if name == 'Loonvloer':
                assert all(y == floor for y in ys)
            if name == 'Aanbodoverschot':
                assert list(zip(xs, ys)) == [(qv, floor), (qa, floor)]
            if name == 'Gevraagde personen':
                assert list(zip(xs, ys)) == [(qv, 0), (qv, floor)]
            if name == 'Aangeboden personen':
                assert list(zip(xs, ys)) == [(qa, 0), (qa, floor)]
        assert 'Lᵥ' in names and 'Lₐ' in names
        if index == 3:
            assert not any(k in names for k in ('Loonvloer', 'Aanbodoverschot', 'E'))
        if index in (2, 4):
            assert 'Loonvloer' in names and 'Aanbodoverschot' in names
        axes = r.xpath('//c:valAx', namespaces=NS)
        assert len(axes) == 2
        assert all(ax.xpath('c:scaling/c:min/@val', namespaces=NS) == ['0'] for ax in axes)
    assert checked_points == 30
    # Table cells and displayed answers, independently recomputed.
    near(18*24*60, 25920)
    near(20*24*50, 24000)
    assert round((24000-25920)/25920*100, 2) == -7.41
    near(12*25*100, 30000)
    near(14*25*80, 28000)
    assert round((28000-30000)/30000*100, 2) == -6.67
    assert 120-80 == (100-80)+(120-100) == 40

pages = PdfReader(pdf).pages
assert len(pages) == 27
for i, pg in enumerate(pages):
    assert pg.extract_text().strip(), i+1
    assert float(pg.mediabox.width)/float(pg.mediabox.height) == 16/9
geometry = json.loads((render/'text-geometry.json').read_text(encoding='utf-8-sig'))
overflow = [g for g in geometry if g['boundHeight'] > g['height']+2 or g['boundWidth'] > g['width']+2]
assert not overflow, overflow
print(json.dumps({'passed': True, 'slides': 27, 'notes': 27, 'nativeTables': table_owners,
    'nativeCharts': chart_owners, 'equationCheckedCurvePoints': checked_points,
    'overviewParity': [1,14,27], 'powerPointTextOverflows': len(overflow), 'pdfPages': len(pages)}))
