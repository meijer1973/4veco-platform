"""Check the saved §3.2.4 deck against book questions and economic geometry.

Usage: python check-presentation-324.py FINAL.pptx BUILD/manifest.json LESSONS_ROOT
The companion chart_workbooks.py check verifies embedded workbook consistency.
"""
import hashlib
import html
import json
import posixpath
import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as E

P = 'http://schemas.openxmlformats.org/presentationml/2006/main'
A = 'http://schemas.openxmlformats.org/drawingml/2006/main'
C = 'http://schemas.openxmlformats.org/drawingml/2006/chart'
R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
NS = {'p': P, 'a': A, 'c': C}


def close(a, b, tol=1e-7):
    assert abs(a-b) <= tol, (a, b)


def normal(text):
    return ' '.join(html.unescape(text).split())


def main(pptx, manifest, lessons):
    doc = json.loads(Path(manifest).read_text(encoding='utf-8'))
    root = Path(lessons)
    for file, digest in doc['sourceFiles'].items():
        assert hashlib.sha256((root/doc['sourceEdition']/file).read_bytes()).hexdigest() == digest, file
    for file, digest in doc['additionalSourceFiles'].items():
        assert hashlib.sha256((root/file).read_bytes()).hexdigest() == digest, file
    checked_points = 0
    with zipfile.ZipFile(pptx) as z:
        slide_files = sorted((n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml', n)), key=lambda n: int(re.search(r'(\d+)\.xml', n)[1]))
        assert len(slide_files) == 19
        slides = [E.fromstring(z.read(f)) for f in slide_files]
        rendered_text = [' '.join(e.text or '' for e in s.findall('.//a:t', NS)) for s in slides]
        # Each complete actual target question must be present before solutions.
        book = (root/doc['sourceEdition']/'chapters/3.2/3.2.4 manuscript.md').read_text(encoding='utf-8')
        question_slides = normal(' '.join(rendered_text[8:10]))
        for part in 'abcde':
            question = re.search(r'<p data-question="35'+part+r'">(.*?)</p>', book, re.S)[1]
            question = normal(re.sub(r'<[^>]+>', '', question))
            assert question in question_slides, ('missing target question', part, question)
        assert '35a' in rendered_text[10]
        assert '12 = 0,04q + 4' not in ' '.join(rendered_text[6:10])
        # Overviews have the same wording and geometry; only phase, number,
        # emphasis and the notes may vary.
        def overview(slide):
            result=[]
            for shape in slide.findall('.//p:sp', NS):
                name=shape.find('p:nvSpPr/p:cNvPr', NS).get('name')
                if name in ('phase','slide-number'):
                    continue
                x=shape.find('p:spPr/a:xfrm', NS)
                result.append((name, tuple(tuple(e.attrib.items()) for e in x),
                               tuple(e.text for e in shape.findall('.//a:t', NS))))
            return result
        assert overview(slides[0]) == overview(slides[5]) == overview(slides[18])
        # All saved notes exist, contain teacher structure and use >=14pt.
        for number in range(1,20):
            n=E.fromstring(z.read(f'ppt/notesSlides/notesSlide{number}.xml'))
            nt=' '.join(e.text or '' for e in n.findall('.//a:t', NS))
            for heading in ['Vraag:', 'Uitleg:', 'Misvatting:', 'Overgang:', 'Bron:']:
                assert heading in nt, (number, heading)
            for e in n.iter():
                if 'sz' in e.attrib:
                    assert int(e.get('sz')) >= 1400
        for s in slides:
            for e in s.iter():
                if 'sz' in e.attrib:
                    assert int(e.get('sz')) >= 1400
        geometries=iter(doc['geometry'])
        chart_count=0
        for number,s in enumerate(slides,1):
            relfile=f'ppt/slides/_rels/slide{number}.xml.rels'
            rels={r.get('Id'):r.get('Target') for r in E.fromstring(z.read(relfile))}
            for frame in s.findall('.//p:graphicFrame',NS):
                ref=frame.find('.//c:chart',NS)
                if ref is None:
                    continue
                g=next(geometries); assert g['slide']==number
                chart_count+=1
                target=posixpath.normpath(posixpath.join('ppt/slides',rels[ref.get('{'+R+'}id')])).lstrip('/')
                ch=E.fromstring(z.read(target))
                assert ch.find('.//c:scatterChart',NS) is not None
                xfrm=frame.find('p:xfrm',NS)
                off=xfrm.find('a:off',NS); ext=xfrm.find('a:ext',NS)
                box=dict(left=int(off.get('x'))/9525,top=int(off.get('y'))/9525,width=int(ext.get('cx'))/9525,height=int(ext.get('cy'))/9525)
                for k,v in box.items(): close(v,g['box'][k],.001)
                manual=ch.find('.//c:plotArea/c:layout/c:manualLayout',NS)
                frac={k:float(manual.find('c:'+k,NS).get('val')) for k in 'xywh'}
                assert frac==g['frac']
                plot=dict(left=box['left']+frac['x']*box['width'],top=box['top']+frac['y']*box['height'],width=frac['w']*box['width'],height=frac['h']*box['height'])
                for series,expected in zip(ch.findall('.//c:scatterChart/c:ser',NS),g['series'],strict=True):
                    name=series.find('.//c:tx//c:v',NS).text
                    assert name==expected['name']
                    xs=[float(e.text) for e in series.findall('.//c:xVal//c:pt/c:v',NS)]
                    ys=[float(e.text) for e in series.findall('.//c:yVal//c:pt/c:v',NS)]
                    assert xs==expected['xValues'] and ys==expected['values']
                    for q,v in zip(xs,ys,strict=True):
                        checked_points+=1
                        assert -1e-8<=q<=g['maxQ']+1e-8 and -1e-8<=v<=g['maxP']+1e-8
                        if name=='V₀': close(v,12-.4*q)
                        elif name=='V₁': close(v,20-.4*q)
                        elif name=='A₀': close(v,4+.4*q)
                        elif name=='MK': close(v,2*g['a']*q+g['b'])
                        elif name=='GTK': close(v,g['a']*q+g['b']+g['c']/q)
                        elif name=='P = GO = MO': close(v,g['price'])
                    if name=='E-horizontaal': assert list(zip(xs,ys))==[(0,g['eq'][1]),tuple(g['eq'])]
                    if name=='E-verticaal': assert list(zip(xs,ys))==[(g['eq'][0],0),tuple(g['eq'])]
                    if name=='q gekozen': assert list(zip(xs,ys))==[(g['cut'],0),(g['cut'],g['price'])]
                if g['profit']:
                    shape=next(sp for sp in s.findall('.//p:sp',NS) if sp.find('p:nvSpPr/p:cNvPr',NS).get('name')=='profit-area')
                    xf=shape.find('p:spPr/a:xfrm',NS)
                    off=xf.find('a:off',NS);ext=xf.find('a:ext',NS)
                    q=g['cut'];gtk=g['a']*q+g['b']+g['c']/q
                    expected=[plot['left'],plot['top']+(g['maxP']-g['price'])/g['maxP']*plot['height'],q/g['maxQ']*plot['width'],(g['price']-gtk)/g['maxP']*plot['height']]
                    for actual,want in zip([int(off.get('x'))/9525,int(off.get('y'))/9525,int(ext.get('cx'))/9525,int(ext.get('cy'))/9525],expected):close(actual,want,.001)
                    close((g['price']-gtk)*q,200 if number==4 else 600)
        assert chart_count==7
        assert next(geometries,None) is None
        assert sum(len(s.findall('.//a:tbl',NS)) for s in slides)==6
        # Target arithmetic independently recomputed from the textbook functions.
        for demand,p0,q0 in [(30000,8,10000),(50000,12,20000)]:
            close((demand+10000)/5000,p0);close(2500*p0-10000,q0)
        close(.02*200**2+4*200+200,1800)
        close((12-(.02*200+4+200/200))*200,600)
        close((20000-10000)/10000*100,100)
    print(json.dumps({'passed':True,'slides':19,'nativeCharts':chart_count,'nativeTables':6,'checkedChartPoints':checked_points,'targetQuestions':'35a–e before solutions','overviewSlides':[1,6,19],'notesMinimumPt':14,'geometryTolerancePx':.001}))


if __name__ == '__main__':
    main(*sys.argv[1:])
