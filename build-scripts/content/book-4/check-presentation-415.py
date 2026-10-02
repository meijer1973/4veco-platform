"""HOW TO ADAPT: validate saved chart geometry against independently derived economics.

Usage: python check-presentation-415.py FINAL.pptx [POWERPOINT-RENDER-DIR]
This verifies artifact facts, not classroom effectiveness.
"""
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from zipfile import ZipFile

NS = {'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main'}

def ordered(names, pattern):
    return sorted((n for n in names if re.search(pattern, n)),
                  key=lambda n: int(re.search(r'(\d+)\.xml$', n)[1]))

def close(a, b):
    assert abs(a - b) < 1e-7, (a, b)

def text(root):
    return ' '.join(t.text or '' for t in root.findall('.//a:t', NS))

with ZipFile(sys.argv[1]) as z:
    slide_names = ordered(z.namelist(), r'^ppt/slides/slide\d+\.xml$')
    assert len(slide_names) == 25
    slides = [ET.fromstring(z.read(n)) for n in slide_names]
    notes = ordered(z.namelist(), r'^ppt/notesSlides/notesSlide\d+\.xml$')
    assert len(notes) == 25
    for n in notes:
        root = ET.fromstring(z.read(n))
        assert all(label in text(root) for label in ['Vraag:', 'Uitleg:', 'Misvatting:', 'Overgang:', 'Bron:'])
        sizes = [int(e.get('sz')) for e in root.iter() if e.get('sz')]
        assert sizes and min(sizes) >= 1400
    def overview(root):
        out = []
        for shape in root.findall('.//p:sp', NS):
            name = shape.find('p:nvSpPr/p:cNvPr', NS).get('name')
            txt = text(shape)
            if name == 'phase' or txt.isdigit():
                continue
            out.append((name, txt, ET.tostring(shape.find('p:spPr/a:xfrm', NS))))
        return out
    assert overview(slides[0]) == overview(slides[6]) == overview(slides[24])
    chart_names = ordered(z.namelist(), r'/charts/chart\d+\.xml$')
    assert len(chart_names) == 4
    for i, n in enumerate(chart_names):
        root = ET.fromstring(z.read(n))
        a,b,c,d,q,xmax,ymax,stage = (26,.25,.125,5,28,40,30,2) if i == 0 else (32,.2,.1,8,40,80,32,[0,0,1,2][i])
        axes = root.findall('.//c:valAx', NS)
        assert sorted(float(e.find('c:scaling/c:max', NS).get('val')) for e in axes) == sorted([xmax,ymax])
        assert all(float(e.find('c:scaling/c:min', NS).get('val')) == 0 for e in axes)
        ss = {}
        for s in root.findall('.//c:scatterChart/c:ser', NS):
            name = s.findtext('c:tx/c:v', namespaces=NS)
            xs = [float(v.text) for v in s.findall('.//c:xVal//c:pt/c:v', NS)]
            ys = [float(v.text) for v in s.findall('.//c:yVal//c:pt/c:v', NS)]
            assert len(xs) == len(ys)
            assert s.find('c:smooth', NS).get('val') == '0'
            for x,y in zip(xs,ys):
                assert 0 <= x <= xmax and 0 <= y <= ymax
                if name == 'GO = P': close(y,a-b*x)
                if name == 'MO': close(y,a-2*b*x)
                if name == 'MK': close(y,d+2*c*x)
            ss[name]=(xs,ys)
        close(q,(a-d)/(2*b+2*c))
        if stage == 0:
            assert set(ss) == {'GO = P','MO','MK'}
        if stage >= 1:
            assert ss['q-hulplijn'] == ([q,q],[0,a-b*q if stage==2 else a-2*b*q])
            assert ss['MO = MK'] == ([q],[a-2*b*q])
        if stage == 2:
            assert ss['P-hulplijn'] == ([0,q],[a-b*q,a-b*q])
            assert ss['Prijs op GO'] == ([q],[a-b*q])
    # Use the real source subquestion text, allowing only whitespace normalization.
    lesson_root = Path(__file__).resolve().parents[4] / '4veco-lessen'
    manuscript = lesson_root / 'edities/books34-v3/books/book-4/chapters/4.1/4.1.5 manuscript.md'
    import html
    src = manuscript.read_text(encoding='utf8')
    for letter in 'abcdef':
        raw = re.search(r'<p data-question="45'+letter+r'">(.*?)</p>', src).group(1)
        raw = html.unescape(re.sub('<[^>]+>','',raw))
        normalized = ' '.join(raw.split())
        assert normalized in ' '.join(text(slides[11+'abcdef'.index(letter)//2]).split()), letter
    assert not any('€ 360' in text(s) for s in slides[:14])
    all_sizes = [int(e.get('sz')) for s in slides for e in s.iter() if e.get('sz')]
    assert min(all_sizes) >= 1400
    table_count = sum(len(s.findall('.//a:tbl', NS)) for s in slides)
    assert table_count == 5
    result = {'ok':True,'slides':25,'notes':25,'nativeTables':table_count,'nativeCharts':4,
              'overviewParity':[1,7,25],'completeQuestionsBeforeAnswers':True,
              'chartGeometry':'saved XY endpoints, guides, axes, explicit straight lines'}
    if len(sys.argv)>2:
        geom=json.loads((Path(sys.argv[2])/'text-geometry.json').read_text(encoding='utf-8-sig'))
        overflow=[(e['slide'],e['name']) for e in geom if e['boundHeight']>e['height']+2 or e['boundWidth']>e['width']+2]
        assert not overflow, overflow
        result['powerPointTextOverflow']=0
    print(json.dumps(result,ensure_ascii=False,indent=2))
