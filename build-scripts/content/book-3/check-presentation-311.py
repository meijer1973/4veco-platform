"""Verify the saved §3.1.1 deck, including actual chart coordinates and notes.

HOW TO ADAPT: this is a paragraph-specific acceptance check, not a renderer.
Run with FINAL.pptx. The shared chart_workbooks.py separately checks workbooks.
"""
import json
import posixpath
import sys
from zipfile import ZipFile
from lxml import etree as E

NS={'c':'http://schemas.openxmlformats.org/drawingml/2006/chart',
    'a':'http://schemas.openxmlformats.org/drawingml/2006/main',
    'p':'http://schemas.openxmlformats.org/presentationml/2006/main',
    'r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
def close(a,b): assert abs(a-b)<1e-9,(a,b)
with ZipFile(sys.argv[1]) as z:
    def xml(n):return E.fromstring(z.read(n))
    def strings(root):return root.xpath('.//a:t/text()',namespaces=NS)
    def rels(n):
        part=posixpath.join(posixpath.dirname(n),'_rels',posixpath.basename(n)+'.rels')
        return {r.get('Id'):posixpath.normpath(posixpath.join(posixpath.dirname(n),r.get('Target'))).lstrip('/') for r in xml(part)}
    slide_paths=['ppt/slides/slide'+str(i)+'.xml' for i in range(1,25)]
    assert len(xml('ppt/presentation.xml').findall('p:sldIdLst/p:sldId',NS))==24
    slide_docs=[xml(n) for n in slide_paths]
    for n,root in zip(slide_paths,slide_docs):
        note_path=next(v for v in rels(n).values() if '/notesSlides/' in v)
        note=xml(note_path);txt=' '.join(strings(note))
        assert all(label in txt for label in ['Vraag:','Uitleg:','Misvatting:','Overgang:','Bron:'])
        sizes=[int(v) for v in note.xpath('//@sz')]
        assert sizes and min(sizes)>=1400
    overviews=[]
    for index in [0,13,23]:
        shapes=[]
        for sp in slide_docs[index].findall('.//p:sp',NS):
            name=sp.find('p:nvSpPr/p:cNvPr',NS).get('name')
            if name in ('phase','slide-number'):continue
            shapes.append((name,strings(sp),E.tostring(sp.find('.//a:xfrm',NS))))
        overviews.append(shapes)
    assert overviews[0]==overviews[1]==overviews[2]
    owners=[];native_tables=[];points=0;labels=0
    for i,(n,root) in enumerate(zip(slide_paths,slide_docs),1):
        if root.findall('.//a:tbl',NS):native_tables.append(i)
        for chartref in root.findall('.//c:chart',NS):
            owners.append(i);chart=xml(rels(n)[chartref.get('{'+NS['r']+'}id')])
            assert chart.find('.//c:scatterChart',NS) is not None
            v,a,t,maxq,maxp=(26,2,6,140,30) if i<14 else (20,2,3,100,22)
            q0=(v-a)/.3;p0=a+.1*q0;qt=(v-a-t)/.3;pc=v-.2*qt;pp=a+.1*qt
            for axis in chart.findall('.//c:valAx',NS):
                pos=axis.find('c:axPos',NS).get('val');sc=axis.find('c:scaling',NS)
                close(float(sc.find('c:min',NS).get('val')),0)
                close(float(sc.find('c:max',NS).get('val')),maxq if pos=='b' else maxp)
            for ser in chart.findall('.//c:scatterChart/c:ser',NS):
                name=''.join(ser.xpath('./c:tx//c:v/text()',namespaces=NS))
                xs=[float(n) for n in ser.xpath('./c:xVal//c:pt/c:v/text()',namespaces=NS)]
                ys=[float(n) for n in ser.xpath('./c:yVal//c:pt/c:v/text()',namespaces=NS)]
                assert len(xs)==len(ys)==2
                for x,y in zip(xs,ys):
                    points+=1
                    assert 0<=x<=maxq and 0<=y<=maxp
                    if name=='V':close(y,v-.2*x)
                    elif name=='A':close(y,a+.1*x)
                    elif name=='A + t':close(y,a+t+.1*x)
                expected={
                    'Hulplijn P₀':([0,q0],[p0,p0]),'Hulplijn Q₀':([q0,q0],[0,p0]),
                    'Hulplijn Pc':([0,qt],[pc,pc]),'Hulplijn Pp':([0,qt],[pp,pp]),
                    'Hulplijn Qt':([qt,qt],[0,pc]),'Belastingwig':([qt,qt],[pp,pc])}
                if name in expected:
                    for got,want in zip(xs+ys,expected[name][0]+expected[name][1]):close(got,want)
                if name in ('V','A','A + t'):
                    assert name in strings(ser.find('c:dLbls',NS));labels+=1
            if i==17:assert len(chart.findall('.//c:scatterChart/c:ser',NS))==2
    assert owners==[5,7,10,17,21,22]
    assert native_tables==[2,3,11,15,23]
    # Complete target questions precede the first target answer (slide 18).
    questions=' '.join(' '.join(strings(r)) for r in slide_docs[14:17])
    for text in ['Verschillende aanbieders','Pc = 20 − 0,20Q','Pp = 2 + 0,10Q',
                 'De verkopers dragen de belasting af.', 'andere marktomstandigheden blijven gelijk.',
                 'vrije evenwichtsprijs en -hoeveelheid','aanbod in kopersprijzen',
                 'verkopers na afdracht ontvangen','beide prijzen en de belastingwig',
                 'Beoordeel met de oude en nieuwe prijzen.']:
        assert text in questions,text
    assert 'Qt = 50' not in questions and '€ 7 per tas' not in questions
print(json.dumps({'ok':True,'slides':24,'notes':24,'overview_parity':[1,14,24],
                  'native_tables':native_tables,'native_charts':owners,'checked_chart_points':points,
                  'direct_curve_labels':labels,'target_questions_before_answers':True},indent=2))
