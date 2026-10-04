"""Audit the saved second-edition 1.2.1 deck. HOW TO ADAPT: change expected
source manifest, slide ownership and equation-derived chart cases together.
This checks authored package data; visual/teaching review remains separate.
Usage: python check-presentation-121.py FINAL.pptx [render/text-geometry.json]
"""
import hashlib
import json
import sys
from pathlib import Path
from zipfile import ZipFile
from lxml import etree as ET

HERE = Path(__file__).resolve().parent
PLATFORM = HERE.parents[2]
LESSONS = PLATFORM.parent / '4veco-lessen'
NS = {'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart'}


def check(file, geometry=None):
    provenance = json.loads((HERE / 'presentation-121.tweede-editie-2026.manifest.json').read_text(encoding='utf8'))
    for item in provenance['sources']:
        assert hashlib.sha256((LESSONS / item['path']).read_bytes()).hexdigest() == item['sha256'], item['path']
    with ZipFile(file) as z:
        slides = [ET.fromstring(z.read(f'ppt/slides/slide{i}.xml')) for i in range(1, 26)]
        assert len([x for x in z.namelist() if x.startswith('ppt/slides/slide') and x.endswith('.xml')]) == 25
        table_owners = [i for i, s in enumerate(slides, 1) if s.findall('.//a:tbl', NS)]
        chart_owners = [i for i, s in enumerate(slides, 1) if s.findall('.//c:chart', NS)]
        assert table_owners == [4, 5, 7, 10, 14, 19, 20, 22, 24]
        assert chart_owners == [11, 12, 13, 23]

        def overview(s):
            items = []
            for shape in s.findall('.//p:sp', NS):
                name = shape.find('p:nvSpPr/p:cNvPr', NS).get('name')
                if name == 'phase':
                    continue
                txt = '|'.join(shape.xpath('.//a:t/text()', namespaces=NS))
                if txt.isdecimal():
                    continue
                xform = shape.find('p:spPr/a:xfrm', NS)
                items.append((name, txt, ET.tostring(xform) if xform is not None else None))
            return items

        assert overview(slides[0]) == overview(slides[14]) == overview(slides[24])
        for i in range(1, 26):
            note = ET.fromstring(z.read(f'ppt/notesSlides/notesSlide{i}.xml'))
            txt = ' '.join(note.xpath('.//a:t/text()', namespaces=NS))
            for key in ['Vraag:', 'Uitleg:', 'Misvatting:', 'Overgang:', 'Bron:', 'tweede editie 2026']:
                assert key in txt, (i, key)
            sizes = [int(x) for x in note.xpath('.//@sz')]
            assert sizes and min(sizes) >= 1400, (i, sizes)
        chart_files = sorted(x for x in z.namelist() if '/charts/chart' in x and x.endswith('.xml'))
        expected = [
            [([0], [8]), ([24], [0])],
            [([0, 24], [8, 0])],
            [([0, 24], [8, 0]), ([0, 18, 18], [2, 2, 0]), ([18], [2]), ([0, 6, 6], [6, 6, 0]), ([6], [6])],
            [([0, 20], [5, 0]), ([0, 12, 12], [2, 2, 0]), ([12], [2]), ([0, 8, 8], [3, 3, 0]), ([8], [3])]
        ]
        for index, name in enumerate(chart_files):
            chart = ET.fromstring(z.read(name))
            drawn = []
            for series in chart.findall('.//c:ser', NS):
                xs = [float(x) for x in series.xpath('./c:xVal//c:pt/c:v/text()', namespaces=NS)]
                ys = [float(x) for x in series.xpath('./c:yVal//c:pt/c:v/text()', namespaces=NS)]
                drawn.append((xs, ys))
                assert series.find('c:smooth', NS).get('val') == '0'
            assert drawn == expected[index], (index, drawn)
            axes = {}
            for axis in chart.findall('.//c:valAx', NS):
                axes[axis.find('c:axPos', NS).get('val')] = tuple(float(axis.find('c:scaling/c:' + key, NS).get('val')) for key in ['min', 'max'])
            assert axes['b'] == (0, 20 if index == 3 else 24)
            assert axes['l'] == (0, 5 if index == 3 else 8)
            # Check curve and control-point coordinates against the economic equation.
            a, b = (20, 4) if index == 3 else (24, 3)
            for j, (xs, ys) in enumerate(drawn):
                if index < 2 or j in (0, 2, 4):
                    assert all(abs(q - (a - b * price)) < 1e-9 for q, price in zip(xs, ys))
        for i in range(15, 18):
            txt = ' '.join(slides[i].xpath('.//a:t/text()', namespaces=NS))
            assert '3,50' not in txt and '12 liter' not in txt

    if geometry:
        boxes = json.loads(Path(geometry).read_text(encoding='utf-8-sig'))
        overflow = [b for b in boxes if b['boundHeight'] > b['height'] + 1 or b['boundWidth'] > b['width'] + 1]
        assert not overflow, overflow
    return {'ok': True, 'slides': 25, 'tables': len(table_owners), 'charts': len(chart_owners), 'overviewParity': True,
            'notesMinimumPt': 14, 'sourceHashesPreserved': len(provenance['sources']), 'graphGeometry': 'equations, guides, axes and straight segments checked'}


if __name__ == '__main__':
    print(json.dumps(check(Path(sys.argv[1]), sys.argv[2] if len(sys.argv) > 2 else None), ensure_ascii=False, indent=2))
