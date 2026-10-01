"""HOW TO ADAPT: pin actual source/assignment facts and chart models for a new deck.

Checks the saved package, not the builder's in-memory geometry. Visual review
and independent teaching review remain separate requirements.
Usage: python check-presentation-314.py final.pptx final.pdf lesson-repo
"""
import hashlib
import json
import posixpath
import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as E

from pypdf import PdfReader

NS = {'a':'http://schemas.openxmlformats.org/drawingml/2006/main',
      'c':'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'p':'http://schemas.openxmlformats.org/presentationml/2006/main',
      'r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}


def normalize(s):
    return ''.join(s.split()).replace('−','-').replace('–','-')


def check(pptx, pdf, lessons):
    manifest=json.loads(Path(__file__).with_name('presentation-314.manifest.json').read_text(encoding='utf8'))
    for src in manifest['sources']:
        assert hashlib.sha256((lessons/src['path']).read_bytes()).hexdigest()==src['sha256'],src['path']
    with zipfile.ZipFile(pptx) as z:
        def xml(name): return E.fromstring(z.read(name))
        def texts(root): return ' '.join(n.text or '' for n in root.findall('.//a:t',NS))
        def rels(part):
            f=posixpath.join(posixpath.dirname(part),'_rels',posixpath.basename(part)+'.rels')
            return {r.get('Id'):posixpath.normpath(posixpath.join(posixpath.dirname(part),r.get('Target'))).lstrip('/') for r in xml(f)}
        slide_names=sorted((n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)),key=lambda x:int(re.search(r'(\d+)\.xml',x)[1]))
        assert len(slide_names)==24
        slide_roots=[xml(n) for n in slide_names]
        notes=[n for n in z.namelist() if re.fullmatch(r'ppt/notesSlides/notesSlide\d+\.xml',n)]
        assert len(notes)==24
        for n in notes:
            root=xml(n); t=texts(root)
            assert all(v in t for v in ['Vraag:','Uitleg:','Misvatting:','Overgang:','Bron:']),n
            sizes=[int(q.get('sz')) for q in root.iter() if q.get('sz')]
            assert sizes and min(sizes)>=1400,(n,sizes)
        def overview(root):
            result=[]
            for shape in root.findall('.//p:sp',NS):
                name=shape.find('p:nvSpPr/p:cNvPr',NS).get('name')
                if name in ['phase','slide-number']: continue
                geom=shape.find('p:spPr/a:xfrm',NS)
                result.append((name,texts(shape),E.tostring(geom)))
            return result
        assert overview(slide_roots[0])==overview(slide_roots[12])==overview(slide_roots[23])
        table_count=sum(len(r.findall('.//a:tbl',NS)) for r in slide_roots)
        assert table_count==9
        # Compare the actual numeric scatter-series caches to the economic model.
        chart_slides=[]; checked_points=0
        for number,(name,root) in enumerate(zip(slide_names,slide_roots),1):
            chart_refs=root.findall('.//c:chart',NS)
            for ref in chart_refs:
                chart_slides.append(number)
                cr=xml(rels(name)[ref.get('{'+NS['r']+'}id')])
                assert cr.find('.//c:scatterChart',NS) is not None
                # Intercepts, slopes, cap, axis maximum from separate model facts.
                iv,sv,ia,sa,cap,qmax,pmax=(24,-.25,4,.25,11,80,24) if number in [5,6,8] else (18,-.1,6,.1,10,160,24)
                q0=(iv-ia)/(sa-sv); p0=iv+sv*q0
                qa=(cap-ia)/sa; qv=(cap-iv)/sv
                def close(a,b): assert abs(a-b)<1e-9,(number,a,b)
                bounds={a.find('c:axPos',NS).get('val'):(float(a.find('c:scaling/c:min',NS).get('val')),float(a.find('c:scaling/c:max',NS).get('val'))) for a in cr.findall('.//c:valAx',NS)}
                assert bounds=={'b':(0,qmax),'l':(0,pmax)},(number,bounds)
                required={5:['V','A','Hulplijn P₀','Hulplijn Q₀','E₀'],
                          6:['V','A','Hulplijn P₀','Hulplijn Q₀','E₀','Maximumprijs'],
                          8:['V','A','Maximumprijs','Qa','Qv','Tekort','Aanbod','Vraag'],
                          16:['V','A'],
                          21:['V','A','Maximumprijs','Qa','Qv','Tekort','Aanbod','Vraag']}[number]
                seen=[]
                for ser in cr.findall('.//c:scatterChart/c:ser',NS):
                    sn=ser.find('c:tx/c:v',NS)
                    if sn is None: sn=ser.find('c:tx/c:strRef/c:strCache/c:pt/c:v',NS)
                    label=sn.text; seen.append(label)
                    xs=[float(n.text) for n in ser.findall('c:xVal/c:numRef/c:numCache/c:pt/c:v',NS)]
                    ys=[float(n.text) for n in ser.findall('c:yVal/c:numRef/c:numCache/c:pt/c:v',NS)]
                    assert xs and len(xs)==len(ys)
                    checked_points+=len(xs)
                    if label in ['V','A']:
                        a,b=(iv,sv) if label=='V' else (ia,sa)
                        assert xs==[0,qmax*.875,qmax],(number,label,xs)
                        for x,y in zip(xs,ys): close(y,a+b*x)
                    elif label=='Maximumprijs':
                        assert xs==[0,qmax]; [close(y,cap) for y in ys]
                    elif label=='Hulplijn P₀':
                        assert xs==[0,q0]; [close(y,p0) for y in ys]
                    elif label=='Hulplijn Q₀':
                        assert xs==[q0,q0] and ys==[0,p0]
                    elif label=='E₀': assert xs==[q0] and ys==[p0]
                    elif label in ['Qa','Qv']:
                        q=qa if label=='Qa' else qv
                        assert xs==[q,q] and ys==[0,cap]
                    elif label=='Tekort': assert xs==[qa,qv] and ys==[cap,cap]
                    elif label in ['Aanbod','Vraag']:
                        assert xs==[qa if label=='Aanbod' else qv] and ys==[cap]
                    else: raise AssertionError(label)
                assert seen==required,(number,seen,required)
        assert chart_slides==[5,6,8,16,21]
        assert checked_points==62
        target=json.loads((lessons/'edities/books34-v3/curriculum/targets/3.1.4.json').read_text(encoding='utf8'))
        question_text=normalize(' '.join(texts(r) for r in slide_roots[14:17]))
        for q in target['target_exercise']['subquestions']:
            assert normalize(q['prompt']) in question_text,q['label']
        pdf_pages=PdfReader(pdf).pages
        assert len(pdf_pages)==24
        for i,(root,page) in enumerate(zip(slide_roots,pdf_pages),1):
            # Shape and table text must all survive the PowerPoint PDF export.
            b=normalize(page.extract_text())
            assert all(normalize(t.text or '') in b for t in root.findall('.//a:t',NS)),i
        return {'ok':True,'slides':24,'notes':24,'minimumNotesPt':14,'overviewSlides':[1,13,24],
                'tables':table_count,'chartSlides':chart_slides,'chartPointsChecked':checked_points,
                'sourceHashesVerified':len(manifest['sources']),'completeTargetQuestions':'a–e',
                'pdfPages':len(pdf_pages),'pptxSha256':hashlib.sha256(pptx.read_bytes()).hexdigest(),
                'pdfSha256':hashlib.sha256(pdf.read_bytes()).hexdigest()}


if __name__=='__main__':
    print(json.dumps(check(*(Path(p) for p in sys.argv[1:])),ensure_ascii=False,indent=2))
