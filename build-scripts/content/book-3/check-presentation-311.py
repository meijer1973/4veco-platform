"""HOW TO ADAPT: inspect the saved artifact, not just authoring constants.

Usage: python check-presentation-311.py FINAL.pptx LESSONS [FINAL.pdf]
Checks source hashes, native chart geometry against the inverse functions,
questions-before-answers, identical overview geometry and the notes floor.
Visual review and classroom effectiveness remain separate obligations.
"""
import hashlib
import html
import json
import posixpath
import re
import sys
from pathlib import Path
from zipfile import ZipFile
from lxml import etree as E

deck, lessons = Path(sys.argv[1]), Path(sys.argv[2])
manifest = json.loads(Path(__file__).with_name('presentation-311.manifest.json').read_text(encoding='utf-8'))
ns = {'a':'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p':'http://schemas.openxmlformats.org/presentationml/2006/main',
      'c':'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
for row in manifest['sourceFiles']:
    assert hashlib.sha256((lessons / row['path']).read_bytes()).hexdigest() == row['sha256'], row['path']

def normalize(s):
    return re.sub(r'[^\w]', '', html.unescape(s)).lower()

with ZipFile(deck) as z:
    def xml(name): return E.fromstring(z.read(name))
    slide_paths = sorted((n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml', n)),
                         key=lambda s:int(re.search(r'(\d+)\.xml',s).group(1)))
    assert len(slide_paths) == 27
    slides = [xml(n) for n in slide_paths]
    texts = [' '.join(s.xpath('.//a:t/text()', namespaces=ns)) for s in slides]
    notes = [n for n in z.namelist() if re.fullmatch(r'ppt/notesSlides/notesSlide\d+\.xml',n)]
    assert len(notes) == 27
    for name in notes:
        n = xml(name)
        t = ' '.join(n.xpath('.//a:t/text()', namespaces=ns))
        for label in ['Vraag:', 'Uitleg:', 'Misvatting:', 'Overgang:', 'Bron:']:
            assert label in t, (name,label)
        sizes = [int(v) for v in n.xpath('.//a:rPr/@sz | .//a:defRPr/@sz | .//a:endParaRPr/@sz',namespaces=ns)]
        assert sizes and min(sizes) >= 1400, (name,sizes)
    def overview_snapshot(slide):
        out = []
        for shape in slide.findall('.//p:sp',ns):
            t = ''.join(shape.xpath('.//a:t/text()',namespaces=ns))
            if t.startswith('Nu:') or t.isdigit(): continue
            geom = shape.find('p:spPr/a:xfrm',ns)
            out.append((t,E.tostring(geom) if geom is not None else None))
        return out
    assert overview_snapshot(slides[0]) == overview_snapshot(slides[15]) == overview_snapshot(slides[26])
    assert sum(len(s.findall('.//a:tbl',ns)) for s in slides) == 8
    assert sum(len(s.findall('.//c:chart',ns)) for s in slides) == 6
    for t in texts[3:15]: assert 'Uitlegvoorbeeld' in t
    # Full real target questions come directly from the current manuscript.
    manuscript = (lessons / manifest['sourceFiles'][0]['path']).read_text(encoding='utf-8')
    exercise = re.search(r'<div class="exercise target" id="opg7">(.*?)</div>',manuscript,re.S).group(1)
    questions = re.findall(r'<p><b>[a-e]\.</b>(.*?)</p>',exercise,re.S)
    assert len(questions) == 5
    question_text = normalize(' '.join(texts[17:19]))
    for question in questions:
        assert normalize(re.sub('<[^>]+>', '',question)) in question_text, question
    assert 'Opgave 7a' in texts[19]
    assert 'Pc = 20' in texts[16] and 'Pp = 2' in texts[16]
    models = [(30,.20,6,.10,6),(20,.20,2,.10,3)]
    expected = {6:(0,'free'),9:(0,'shift'),12:(0,'wedge'),19:(1,'base'),24:(1,'shift'),25:(1,'wedge')}
    geometries = []
    for number,(model_index,stage) in expected.items():
        slide = slides[number-1]
        chart = slide.find('.//c:chart',ns)
        rid = chart.get('{'+ns['r']+'}id')
        rels = xml(f'ppt/slides/_rels/slide{number}.xml.rels')
        target = next(r.get('Target') for r in rels if r.get('Id') == rid)
        chart_path = posixpath.normpath(posixpath.join('ppt/slides',target)).lstrip('/')
        chart_xml = xml(chart_path)
        a,b,c,d,t = models[model_index]
        q0=round((a-c)/(b+d),8);p0=round(a-b*q0,8)
        qt=round((a-c-t)/(b+d),8);pc=round(a-b*qt,8);pp=round(c+d*qt,8)
        assert abs(pc-pp-t)<1e-8
        series = {}
        for s in chart_xml.findall('.//c:scatterChart/c:ser',ns):
            name = s.findtext('c:tx/c:v',namespaces=ns)
            x = [float(v) for v in s.xpath('./c:xVal//c:pt/c:v/text()',namespaces=ns)]
            y = [float(v) for v in s.xpath('./c:yVal//c:pt/c:v/text()',namespaces=ns)]
            assert len(x)==len(y) and len(x)>0
            assert s.find('c:smooth',ns).get('val')=='0'
            if len(x)>1: series[name]=(x,y)
        for name,formula in [('V',lambda q:a-b*q),('A',lambda q:c+d*q)]:
            xs,ys=series[name]
            assert all(x>=0 and y>=0 and abs(y-formula(x))<1e-8 for x,y in zip(xs,ys))
        if stage in ['shift','wedge']:
            xs,ys=series['A + t']
            assert all(abs(y-(c+t+d*x))<1e-8 for x,y in zip(xs,ys))
        else: assert 'A + t' not in series
        if stage=='shift':
            xs,ys=series['verschuiving bij gelijke kopersprijs']
            assert abs(ys[0]-ys[1])<1e-8
            assert abs(xs[0]-(ys[0]-c)/d)<1e-8
            assert abs(xs[1]-(ys[1]-c-t)/d)<1e-8
            assert xs[1]<xs[0]
        if stage=='wedge':
            xs,ys=series['belastingwig']
            assert all(abs(x-qt)<1e-8 for x in xs)
            assert abs(min(ys)-pp)<1e-8 and abs(max(ys)-pc)<1e-8
            assert series['Pc hulplijn']==([0,qt],[pc,pc])
            assert series['Pp hulplijn']==([0,qt],[pp,pp])
            assert series['Qt hulplijn']==([qt,qt],[0,pp])
        if stage=='free':
            assert series['P₀ hulplijn']==([0,q0],[p0,p0])
            assert series['Q₀ hulplijn']==([q0,q0],[0,p0])
        axis_bounds = [x.xpath('./c:scaling/c:min/@val | ./c:scaling/c:max/@val',namespaces=ns)
                       for x in chart_xml.findall('.//c:valAx',ns)]
        geometries.append({'slide':number,'stage':stage,'model':model_index,'axes':axis_bounds})
    for model in [0,1]:
        bounds=[g['axes'] for g in geometries if g['model']==model]
        assert all(b==bounds[0] for b in bounds)
if len(sys.argv)>3:
    from pypdf import PdfReader
    pdf=PdfReader(sys.argv[3]);assert len(pdf.pages)==27
    for i,page in enumerate(pdf.pages):
        assert '3.1.1' in page.extract_text(),i+1
print(json.dumps({'ok':True,'slides':27,'notes':27,'tables':8,'charts':6,
                  'sourceHashes':len(manifest['sourceFiles']),'targetQuestions':5,
                  'overviewParity':True,'geometry':geometries},ensure_ascii=False,indent=2))
