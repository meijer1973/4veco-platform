"""Check the saved classroom artifact, including its actual native XY data.

Usage: python check-presentation-432.py FINAL.pptx FINAL.pdf
Requires pypdf from the installed presentation runtime.
Visual/content inspection remains required separately.
"""
import json
import posixpath
import re
import sys
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET

from pypdf import PdfReader

NS = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}


def check(pptx, pdf):
    def near(a, b):
        assert abs(a - b) < 0.000001, (a, b)

    with ZipFile(pptx) as z:
        slide_paths = sorted((n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+.xml', n)),
                             key=lambda n: int(re.search(r'(\d+)\.xml', n)[1]))
        assert len(slide_paths) == 25
        texts = []
        table_owners, chart_owners = [], []
        overview = []
        chart_records = []
        for i, name in enumerate(slide_paths, 1):
            root = ET.fromstring(z.read(name))
            texts.append('\n'.join(t.text or '' for t in root.findall('.//a:t', NS)))
            if root.findall('.//a:tbl', NS):
                table_owners.append(i)
            for el in root.findall('.//*[@sz]'):
                assert int(el.attrib['sz']) >= 1400, (i, el.attrib)
            notes = ET.fromstring(z.read(f'ppt/notesSlides/notesSlide{i}.xml'))
            nt = '\n'.join(t.text or '' for t in notes.findall('.//a:t', NS))
            assert all(s in nt for s in ['Vraag:', 'Uitleg:', 'Misvatting:', 'Overgang:', 'Bron:'])
            sizes = [int(e.attrib['sz']) for e in notes.findall('.//*[@sz]')]
            assert sizes and min(sizes) >= 1400
            if i in [1, 15, 25]:
                items = []
                for shape in root.findall('.//p:sp', NS):
                    label = shape.find('./p:nvSpPr/p:cNvPr', NS).attrib['name']
                    if label == 'phase' or label.isdigit():
                        continue
                    txt = '\n'.join(t.text or '' for t in shape.findall('.//a:t', NS))
                    geom = ET.tostring(shape.find('./p:spPr/a:xfrm', NS))
                    items.append((label, txt, geom))
                overview.append(items)
            for chart in root.findall('.//c:chart', NS):
                chart_owners.append(i)
                relid = chart.attrib['{' + NS['r'] + '}id']
                rels = ET.fromstring(z.read(f'ppt/slides/_rels/slide{i}.xml.rels'))
                target = next(r.attrib['Target'] for r in rels if r.attrib['Id'] == relid)
                name = posixpath.normpath(posixpath.join('ppt/slides', target)).lstrip('/')
                cr = ET.fromstring(z.read(name))
                assert cr.find('.//c:scatterChart', NS) is not None
                model = (180, 6, -36, 6, 6, 30, 72, 18, 160, 32) if i < 16 else (240, 10, -40, 10, 4, 24, 100, 14, 240, 28)
                a, b, c, d, lo, hi, qty, wage, xmax, ymax = model
                curves, guides, point = [], [], False
                for ser in cr.findall('.//c:scatterChart/c:ser', NS):
                    sn = ''.join(t.text or '' for t in ser.findall('./c:tx//c:v', NS))
                    xs = [float(t.text) for t in ser.findall('./c:xVal//c:pt/c:v', NS)]
                    ys = [float(t.text) for t in ser.findall('./c:yVal//c:pt/c:v', NS)]
                    sm = ser.find('./c:smooth', NS)
                    assert sm is not None and sm.attrib['val'] == '0'
                    if sn in ['Lᵥ', 'Lₐ'] and len(xs) == 2:
                        curves.append(sn)
                        for x, y in zip(xs, ys):
                            near(x, a - b * y if sn == 'Lᵥ' else c + d * y)
                            assert lo <= y <= hi and 0 <= x <= xmax
                        near(min(ys), lo)
                        near(max(ys), hi)
                    elif sn == 'loonhulplijn':
                        assert xs == [0, qty] and ys == [wage, wage]
                        guides.append(sn)
                    elif sn == 'hoeveelheidhulplijn':
                        assert xs == [qty, qty] and ys == [0, wage]
                        guides.append(sn)
                    elif sn == 'evenwicht':
                        assert xs == [qty] and ys == [wage]
                        point = True
                assert curves == (['Lᵥ'] if i == 9 else ['Lᵥ', 'Lₐ'])
                assert point == (i in [12, 23])
                assert len(guides) == (2 if point else 0)
                axis = cr.findall('.//c:valAx', NS)
                ranges = [(float(v.find('./c:scaling/c:min', NS).attrib['val']),
                           float(v.find('./c:scaling/c:max', NS).attrib['val'])) for v in axis]
                assert sorted(ranges) == sorted([(0, xmax), (0, ymax)])
                chart_records.append({'slide': i, 'curves': curves, 'equilibrium': point, 'domain': [lo, hi]})
        assert overview[0] == overview[1] == overview[2]
        assert table_owners == [2, 3, 4, 5, 7, 8, 13, 16, 24]
        assert chart_owners == [9, 10, 12, 19, 23]
        questions = ' '.join(texts[15:19])
        for phrase in ['5.000', '3.000', '500', '1.500', '20 uur per week',
                       'geen zoekproblemen of loonafspraken', 'bruto- en netto-',
                       'Markeer E', 'Waarom vervangt de modeluitkomst de regiotelling niet?']:
            assert phrase in questions, phrase
        assert '3.500' not in questions and '100 personen' not in questions
        assert '3.500' in texts[19] and '70%' in texts[20] and '60%' in texts[20]
        assert '100 personen' in texts[21] and '€ 14 per uur' in texts[21]
        assert 'E = (100; 14)' in texts[22]
        assert 'Werkgevers' in texts[23] and 'Huishoudens' in texts[23]
        pdfdoc = PdfReader(pdf)
        assert len(pdfdoc.pages) == 25
        for i, page in enumerate(pdfdoc.pages):
            assert abs(float(page.mediabox.width) - 1200) < 0.1
            assert abs(float(page.mediabox.height) - 675) < 0.1
            assert '4.3.2' in page.extract_text(), i + 1
        return {'ok': True, 'slides': 25, 'notesWithRequiredFieldsAnd14ptFloor': 25,
                'nativeTableSlides': table_owners, 'nativeChartSlides': chart_owners,
                'graphs': chart_records, 'overviewParity': True, 'targetQuestionBeforeAnswer': True,
                'pdfPages': 25}


if __name__ == '__main__':
    print(json.dumps(check(Path(sys.argv[1]), Path(sys.argv[2])), ensure_ascii=False, indent=2))
