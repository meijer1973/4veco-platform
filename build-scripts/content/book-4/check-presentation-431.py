"""Check saved 4.3.1 chart geometry, overview parity and notes.

HOW TO ADAPT: change contracts only after reading the new paragraph and model.
Usage: python check-presentation-431.py FINAL.pptx FINAL.pdf
This checks actual saved XML/data, not visual layout or teaching effectiveness.
"""
import json
import re
import sys
from pathlib import Path
from zipfile import ZipFile
from lxml import etree as ET
from pypdf import PdfReader

NS = {'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart'}


def main():
    pptx, pdf = map(Path, sys.argv[1:3])
    with ZipFile(pptx) as z:
        def xml(name):
            return ET.fromstring(z.read(name))

        slide_names = sorted((n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml', n)),
                             key=lambda n: int(re.search(r'(\d+)\.xml', n)[1]))
        assert len(slide_names) == 25
        slides = [xml(n) for n in slide_names]
        assert len(PdfReader(pdf).pages) == 25
        notes = [xml(f'ppt/notesSlides/notesSlide{i}.xml') for i in range(1, 26)]
        for n in notes:
            content = ' '.join(n.xpath('//a:t/text()', namespaces=NS))
            for heading in ['Vraag:', 'Uitleg:', 'Misvatting:', 'Overgang:', 'Bron:']:
                assert heading in content
            sizes = [int(v) for v in n.xpath('//@sz')]
            assert sizes and min(sizes) >= 1400

        def overview(s):
            result = []
            for shape in s.findall('.//p:sp', NS):
                name = shape.find('p:nvSpPr/p:cNvPr', NS).get('name')
                content = ''.join(shape.xpath('.//a:t/text()', namespaces=NS))
                if name == 'phase' or content in ('1', '15', '25'):
                    continue
                transform = ET.tostring(shape.find('p:spPr/a:xfrm', NS))
                result.append((name, content, transform))
            return result
        assert overview(slides[0]) == overview(slides[14]) == overview(slides[24])
        table_count = sum(len(s.findall('.//a:tbl', NS)) for s in slides)
        assert table_count == 9
        chart_names = sorted(n for n in z.namelist() if re.fullmatch(r'ppt/(?:slides/)?charts/chart\d+\.xml', n))
        assert len(chart_names) == 3
        axes = []
        for ci, name in enumerate(chart_names):
            c = xml(name)
            data = {}
            for series in c.findall('.//c:scatterChart/c:ser', NS):
                name = ''.join(series.xpath('c:tx//c:v/text()', namespaces=NS))
                x = list(map(float, series.xpath('c:xVal//c:pt/c:v/text()', namespaces=NS)))
                y = list(map(float, series.xpath('c:yVal//c:pt/c:v/text()', namespaces=NS)))
                assert len(x) == len(y)
                data[name] = list(zip(x, y))
                assert series.find('c:smooth', NS).get('val') == '0'
            assert data['Arbeidsvraag oud'] == [(0, 30), (300, 0)]
            for x, y in data['Arbeidsvraag oud']:
                assert abs(y - (30 - .1*x)) < 1e-9
            assert data['Punt A'] == [(120, 18)]
            assert data['Hulplijn A'] == [(0, 18), (120, 18), (120, 0)]
            if ci == 1:
                assert data['Punt B'] == [(60, 24)]
                assert data['Hulplijn B'] == [(0, 24), (60, 24), (60, 0)]
            if ci == 2:
                assert data['Arbeidsvraag nieuw'] == [(0, 36), (360, 0)]
                for x, y in data['Arbeidsvraag nieuw']:
                    assert abs(y - (36 - .1*x)) < 1e-9
                assert data['Punt C'] == [(180, 18)]
                assert data['Verschuiving'] == [(120, 18), (180, 18)]
                assert data['Pijlpunt'] == [(168, 18.8), (180, 18), (168, 17.2)]
                assert data['Hulplijn C'] == [(120, 18), (180, 18), (180, 0)]
            axes.append([(a.find('c:scaling/c:min', NS).get('val'),
                          a.find('c:scaling/c:max', NS).get('val'),
                          a.find('c:majorUnit', NS).get('val'))
                         for a in c.findall('.//c:valAx', NS)])
        assert axes[0] == axes[1] == axes[2]
        assert set(axes[0]) == {('0', '360', '60'), ('0', '36', '6')}
    print(json.dumps({'ok': True, 'slides': 25, 'pdfPages': 25, 'notes': 25,
                      'nativeTables': table_count, 'nativeCharts': 3,
                      'overviewSlides': [1, 15, 25], 'geometry': 'curves, points, guides, arrow and identical axes PASS'}))


if __name__ == '__main__':
    main()
