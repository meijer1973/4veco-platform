"""Check actual PPTX graph coordinates, areas, hatching, notes and overview parity.

HOW TO ADAPT: derive market data and slide map from the new paragraph; this reads
the saved OOXML caches, rather than verifying a separate unused computation.
Run chart_workbooks.py separately for the referenced workbook cells.
"""
import json
import re
import sys
from zipfile import ZipFile
from lxml import etree as ET

NS = {'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main'}
def close(a, b):
    assert abs(a-b) < 1e-6, (a, b)
def area(poly):
    return abs(sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(poly,poly[1:]+poly[:1])))/2
def inside(point, poly):
    v=[(b[0]-a[0])*(point[1]-a[1])-(b[1]-a[1])*(point[0]-a[0]) for a,b in zip(poly,poly[1:]+poly[:1])]
    return all(x>=-1e-6 for x in v) or all(x<=1e-6 for x in v)
def values(ser, axis):
    return [float(v.text) for v in ser.findall(f'c:{axis}Val//c:pt/c:v', NS)]
def text(root):
    return ' '.join(t.text or '' for t in root.findall('.//a:t', NS))

with ZipFile(sys.argv[1]) as z:
    charts=sorted((n for n in z.namelist() if re.search(r'/charts/chart\d+\.xml$',n)),key=lambda n:int(re.search(r'chart(\d+)',n).group(1)))
    chart_slides=[5,6,7,8,9,11,13,14,19,22,23,24,25,28,29]
    assert len(charts)==len(chart_slides)
    checked=0
    for index,name in enumerate(charts):
        a,b,c,d,tck,qm,pm,qe,pe,xmax,ymax = (96,1,24,1,144,24,72,36,60,60,100) if index<8 else (80,.5,20,.5,200,40,60,60,50,100,80)
        close(a-2*b*qm,c+d*qm);close(a-b*qm,pm);close(a-b*qe,pe);close(c+d*qe,pe)
        mk=c+d*qm
        cs=.5*qm*(a-pm); ps=qm*(pm-mk)+.5*qm*(mk-c)
        loss=.5*(qe-qm)*(pm-mk)
        close(cs+ps,1152 if index<8 else 1600)
        close(ps-tck,720 if index<8 else 1000)
        close(loss,144 if index<8 else 200)
        polys={'CS':[(0,pm),(qm,pm),(0,a)],'PS':[(0,c),(qm,mk),(qm,pm),(0,pm)],'CSe':[(0,pe),(qe,pe),(0,a)],'PSe':[(0,c),(qe,pe),(0,pe)],'O':[(0,pe),(qm,pe),(qm,pm),(0,pm)],'W':[(qm,mk),(qe,pe),(qm,pm)]}
        areas={'CS':cs,'PS':ps,'CSe':.5*qe*(a-pe),'PSe':.5*qe*(pe-c),'O':qm*(pm-pe),'W':loss}
        guides={'Qm':[(qm,0),(qm,pm)],'Pm':[(0,pm),(qm,pm)],'Qe':[(qe,0),(qe,pe)],'Pe':[(0,pe),(qe,pe)],'PS split':[(0,mk),(qm,mk)],'MK at Qm':[(0,mk),(qm,mk)],'M point':[(qm,pm)],'E point':[(qe,pe)]}
        root=ET.fromstring(z.read(name))
        assert root.find('.//c:scatterStyle',NS).get('val')=='line'
        for ser in root.findall('.//c:ser',NS):
            title=ser.findtext('c:tx/c:v',namespaces=NS)
            pts=list(zip(values(ser,'x'),values(ser,'y')));checked+=len(pts)
            assert ser.find('c:smooth',NS).get('val')=='0'
            assert all(-1e-6<=x<=xmax+1e-6 and -1e-6<=y<=ymax+1e-6 for x,y in pts),(title,pts)
            if title in ['Vraag = GO','MK','MO'] and len(pts)>1:
                for x,y in pts:close(y,a-b*x if title=='Vraag = GO' else c+d*x if title=='MK' else a-2*b*x)
            elif title in guides:assert pts==guides[title],(title,pts)
            elif title.endswith(' boundary'):
                key=title.split()[0];assert pts==polys[key]+[polys[key][0]],(title,pts);close(area(pts[:-1]),areas[key])
            elif title.endswith(' hatch'):
                key=title.split()[0];assert all(inside(pt,polys[key]) for pt in pts),(title,pts)
                close(pts[0][1 if key=='W' else 0],pts[1][1 if key=='W' else 0])
            for labels in ser.findall('c:dLbls',NS):
                for tag in ['showVal','showCatName','showSerName','showLegendKey']:assert labels.find('c:'+tag,NS).get('val')=='0'
        for ax in root.findall('.//c:valAx',NS):
            close(float(ax.find('c:scaling/c:min',NS).get('val')),0)
            close(float(ax.find('c:scaling/c:max',NS).get('val')),xmax if ax.find('c:axPos',NS).get('val')=='b' else ymax)
    slides=sorted((n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)),key=lambda n:int(re.search(r'slide(\d+)',n).group(1)))
    assert len(slides)==31
    native_tables=0
    for name in slides:
        root=ET.fromstring(z.read(name));native_tables+=len(root.findall('.//a:tbl',NS))
        for prop in root.findall('.//*[@sz]'):assert int(prop.get('sz'))>=1400,(name,prop.get('sz'))
    assert native_tables==8,native_tables
    notes=[n for n in z.namelist() if re.fullmatch(r'ppt/notesSlides/notesSlide\d+\.xml',n)]
    assert len(notes)==31
    for name in notes:
        root=ET.fromstring(z.read(name));txt=text(root)
        for label in ['Vraag:','Uitleg:','Misvatting:','Overgang:','Bron:']:assert label in txt,(name,label)
        for prop in root.findall('.//*[@sz]'):assert int(prop.get('sz'))>=1400,(name,prop.get('sz'))
    def overview(number):
        root=ET.fromstring(z.read(f'ppt/slides/slide{number}.xml'));shapes=[]
        for shape in root.findall('.//p:sp',NS):
            name=shape.find('p:nvSpPr/p:cNvPr',NS).get('name');txt=text(shape)
            if name=='phase' or txt==str(number):continue
            geom=shape.find('p:spPr/a:xfrm',NS)
            shapes.append((name,txt,ET.tostring(geom).decode() if geom is not None else ''))
        return shapes
    assert overview(1)==overview(17)==overview(31)
    question_text=' '.join(text(ET.fromstring(z.read(f'ppt/slides/slide{i}.xml'))) for i in [20,21])
    for phrase in ['Bereken Qm en Pm','arceer CS en PS','en de winst','TS in beide situaties','basis en hoogte','blijvende sessies','beter én eerlijker']:assert phrase in question_text,phrase
print(json.dumps({'ok':True,'slides':31,'notes':31,'native_tables':native_tables,'native_charts':len(charts),'geometry_points_checked':checked,'overview_slides':[1,17,31],'chart_slides':chart_slides}))
