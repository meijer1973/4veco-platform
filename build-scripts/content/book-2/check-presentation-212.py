"""HOW TO ADAPT: validate the saved deck against the paragraph's source contract.

Usage: python check-presentation-212.py FINAL.pptx LESSON_REPOSITORY
Checks actual OOXML plot coordinates, notes, assignment parity and source hashes.
Visual inspection in PowerPoint remains required.
"""
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as E
import hashlib
import json
import math
import posixpath
import re
import sys

pptx, lessons = Path(sys.argv[1]), Path(sys.argv[2])
facts = json.loads(Path(__file__).with_name('presentation-212.manifest.json').read_text(encoding='utf-8-sig'))
ns = {'p':'http://schemas.openxmlformats.org/presentationml/2006/main',
      'a':'http://schemas.openxmlformats.org/drawingml/2006/main',
      'c':'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
def require(condition, message):
    if not condition:
        raise AssertionError(message)
def close(actual, expected):
    require(math.isclose(actual, expected, rel_tol=0, abs_tol=1e-8), f'{actual} != {expected}')
def content(root):
    return '\n'.join(t.text or '' for t in root.findall('.//a:t', ns))
for rel, digest in facts['sourceFiles'].items():
    actual = hashlib.sha256((lessons/facts['sourceEdition']/rel).read_bytes()).hexdigest()
    require(actual == digest, f'Stale source: {rel}')

with ZipFile(pptx) as z:
    slide_names = sorted((n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+.xml',n)), key=lambda n:int(re.search(r'(\d+)\.xml',n)[1]))
    require(len(slide_names)==28, 'Expected 28 slides')
    roots = [E.fromstring(z.read(n)) for n in slide_names]
    texts = [content(r) for r in roots]
    # Compare all overview shapes' text and box geometry, excluding phase/number.
    overview = []
    for number in (1,14,28):
        shapes=[]
        for shape in roots[number-1].findall('.//p:sp',ns):
            name=shape.find('p:nvSpPr/p:cNvPr',ns).get('name')
            tx=content(shape)
            if name=='phase' or tx==str(number):
                continue
            box=shape.find('p:spPr/a:xfrm',ns)
            shapes.append((name,tx,E.tostring(box)))
        overview.append(shapes)
        for phrase in ('Pagina 14','Opgaven 1 en 2','Basis: 3, 4 en 5','Zelfstandig: 6 en 7','Doelopgave: 8','Maken en nakijken'):
            require(phrase in texts[number-1],f'Overview {number} missing {phrase}')
    require(overview[0]==overview[1]==overview[2],'Overview text/geometry mismatch')
    require('a) Stel de functie voor TO op.' in texts[15] and 'b) Bereken de winst' in texts[15], 'Target a/b missing')
    require('c) Los algebraïsch TO = TK op.' in texts[16] and 'd) Teken TK en TO' in texts[16], 'Target c/d missing')
    require(all('Opgave 8a' not in t for t in texts[:17]),'Premature target answer')
    require('GO = TO / Q = 1,50Q / Q' in texts[17], 'GO derivation missing')
    for number, phrase in [(19,'−€ 150'),(20,'€ 200'),(21,'714,285714'),(22,'715'),(25,'1.071,43')]:
        require(phrase in texts[number-1],f'Slide {number} missing answer {phrase}')
    note_names=[n for n in z.namelist() if re.fullmatch(r'ppt/notesSlides/notesSlide\d+.xml',n)]
    require(len(note_names)==28,'Every slide needs notes')
    for n in note_names:
        root=E.fromstring(z.read(n)); tx=content(root)
        for label in ('Vraag:','Uitleg:','Misvatting:','Overgang:','Bron:'):
            require(label in tx,f'{n} missing {label}')
        for run in root.findall('.//a:rPr',ns):
            require(int(run.get('sz','1400'))>=1400,f'{n}: note font below 14 pt')
    chart_count=0
    for number in (9,10,11,24,25,26):
        stage=(number-9 if number<20 else number-24)+1
        f,v,p,cap,xmax,xstep,ymax,ystep=(250,2,5,150,180,30,800,200) if number<20 else (500,0.8,1.5,1000,1200,200,1800,300)
        chart_ref=roots[number-1].find('.//c:chart',ns)
        rid=chart_ref.get('{'+ns['r']+'}id')
        rels=E.fromstring(z.read(f'ppt/slides/_rels/slide{number}.xml.rels'))
        target=next(r.get('Target') for r in rels if r.get('Id')==rid)
        chartpath=posixpath.normpath(posixpath.join('ppt/slides',target)).lstrip('/')
        root=E.fromstring(z.read(chartpath)); chart_count+=1
        scatter=root.find('.//c:scatterChart',ns)
        require(scatter is not None,'Numeric horizontal axis requires scatter chart')
        for axis in root.findall('.//c:valAx',ns):
            horizontal=axis.find('c:axPos',ns).get('val')=='b'
            close(float(axis.find('c:scaling/c:min',ns).get('val')),0)
            close(float(axis.find('c:scaling/c:max',ns).get('val')),xmax if horizontal else ymax)
            close(float(axis.find('c:majorUnit',ns).get('val')),xstep if horizontal else ystep)
        found={}
        for ser in scatter.findall('c:ser',ns):
            name=''.join(ser.find('c:tx',ns).itertext())
            def values(tag):
                return [float(el.text) for el in ser.findall(f'c:{tag}//c:pt/c:v',ns)]
            xs,ys=values('xVal'),values('yVal'); found[name]=(xs,ys)
            require(len(xs)==len(ys)>0,'Missing chart points')
            if name in ('TK','TO'):
                require(xs==[0,cap],f'{number}: {name} must stop at capacity')
                for x,y in zip(xs,ys): close(y,f+v*x if name=='TK' else p*x)
                labels=ser.findall('c:dLbls/c:dLbl',ns)
                lab=next((x for x in labels if x.find('c:idx',ns).get('val')=='1'),None)
                require(lab is not None and lab.find('c:showSerName',ns).get('val')=='1','Missing editable endpoint label')
                hidden=next((x for x in labels if x.find('c:idx',ns).get('val')=='0'),None)
                require(hidden is not None and hidden.find('c:delete',ns).get('val')=='1','Unexpected origin data label')
            elif name=='Break-even':
                close(xs[0],f/(p-v)); close(ys[0],p*xs[0]); close(ys[0],f+v*xs[0])
            elif name=='Winstafstand':
                q=100 if number<20 else 1000
                require(xs==[q,q],'Profit segment must be vertical at specified Q')
                close(ys[0],f+v*q); close(ys[1],p*q)
            elif name=='Verliesafstand':
                require(xs==[50,50],'Loss segment must be vertical at Q=50')
                close(ys[0],p*50); close(ys[1],f+v*50)
        expected = {'TK'}
        if stage >= 2:
            expected.update(('TO', 'Break-even'))
        if stage == 3:
            expected.add('Winstafstand')
            if number < 20:
                expected.add('Verliesafstand')
        require(set(found) == expected,
                f'Slide {number}: expected series {sorted(expected)}, found {sorted(found)}')
    table_count=sum(len(r.findall('.//a:tbl',ns)) for r in roots)
    require(table_count==6,'Six editable tables expected')

print(json.dumps({'ok':True,'slides':28,'notes':28,'tables':table_count,'scatterCharts':chart_count,'overviewSlides':[1,14,28],'sourceHashes':len(facts['sourceFiles']),'graphCoordinateTolerance':1e-8,'pptxSha256':hashlib.sha256(pptx.read_bytes()).hexdigest()},indent=2))
