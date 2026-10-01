"""HOW TO ADAPT: validate the saved chart data against the lesson's equations.

Run with FINAL.pptx. This checks actual exported series, not builder variables.
Chart-workbook consistency and rendered readability remain separate checks.
"""
import hashlib
import json
import re
import sys
from collections import Counter
from pathlib import Path
from zipfile import ZipFile
from lxml import etree as E

NS = {'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main'}
def near(a, b):
    assert abs(a-b) < 1e-6, (a,b)

def values(series, axis):
    return [float(p.find('c:v',NS).text) for p in series.findall(f'c:{axis}//c:pt',NS)]

file = Path(sys.argv[1])
with ZipFile(file) as z:
    slide_files = sorted((f for f in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+.xml',f)),
                         key=lambda f: int(re.search(r'(\d+)\.xml',f)[1]))
    assert len(slide_files) == 22
    overview = []
    for i in (1,6,22):
        root = E.fromstring(z.read(f'ppt/slides/slide{i}.xml'))
        items = []
        for shape in root.findall('.//p:sp',NS):
            name = shape.find('p:nvSpPr/p:cNvPr',NS).get('name')
            if name in ('phase','slide-number'): continue
            items.append((name,tuple(shape.xpath('.//a:t/text()',namespaces=NS)),
                          E.tostring(shape.find('p:spPr/a:xfrm',NS))))
        overview.append(items)
    assert overview[0] == overview[1] == overview[2], 'Overview content/geometry differs'
    notes = [f for f in z.namelist() if re.fullmatch(r'ppt/notesSlides/notesSlide\d+.xml',f)]
    assert len(notes)==22
    for f in notes:
        root=E.fromstring(z.read(f)); text=' '.join(root.xpath('//a:t/text()',namespaces=NS))
        for header in ('Vraag:','Uitleg:','Misvatting:','Overgang:','Bron:'): assert header in text,(f,header)
        sizes=root.xpath('//@sz')
        assert sizes and all(int(x)>=1400 for x in sizes),f
        for run in root.findall('.//a:r',NS):
            if not run.findtext('a:t',default='',namespaces=NS).strip(): continue
            properties=run.find('a:rPr',NS)
            assert properties is not None and properties.get('sz') is not None,(f,'missing explicit notes run size')
            assert int(properties.get('sz'))>=1400,f
    chart_files=sorted((f for f in z.namelist() if re.search(r'/charts/chart\d+.xml$',f)),key=lambda f:int(re.search(r'chart(\d+)',f)[1]))
    assert len(chart_files)==6
    point_count=0
    for index,f in enumerate(chart_files,1):
        root=E.fromstring(z.read(f)); market=index in (2,4); authored=index==1
        xmax,ymax=(50,24) if market else (100,12) if authored else (250,24)
        axes=root.findall('.//c:valAx',NS)
        assert len(axes)==2
        maxima={ax.find('c:axPos',NS).get('val'):float(ax.find('c:scaling/c:max',NS).get('val')) for ax in axes}
        assert maxima=={'b':xmax,'l':ymax},(f,'axis orientation/bounds',maxima)
        assert all(float(ax.find('c:scaling/c:min',NS).get('val'))==0 for ax in axes)
        a,b,c=(.025,2,90) if authored else (.02,4,200)
        chosen,price,gtk=(80,6,5.125) if authored else (200,12,9)
        series_list=root.findall('.//c:scatterChart/c:ser',NS)
        # Require the complete semantic inventory, including finite GTK samples.
        # Deleting a curve or rectangle must not turn the check into a vacuous pass.
        if market:
            expected=Counter({('V₀',2):1,('V₁',2):1,('A₀',2):1,('V₀',1):1,('V₁',1):1,('A₀',1):1})
            if index==4: expected.update({('E1 hulplijnen',3):1,('E1 punt',1):1,('E₁',1):1})
        else:
            expected=Counter({('MK',2):1,('MK',1):1})
            if index!=5: expected.update({('GTK',92 if authored else 241):1,('GTK',1):1})
            if index!=3: expected.update({('P = GO = MO',2):1,('P = GO = MO',1):1,('q gekozen',2):1,(f'q = {chosen}',1):1})
            if index in (1,6): expected.update({('Winstrechthoek',5):1,('Arcering',2):19,('winst' if authored else '€ 600',1):1})
        actual=Counter((s.find('c:tx',NS).xpath('string()'),len(values(s,'xVal'))) for s in series_list)
        assert actual==expected,(f,'unexpected/missing chart series',actual-expected,expected-actual)
        for s in series_list:
            name=s.find('c:tx',NS).xpath('string()')
            xs,ys=values(s,'xVal'),values(s,'yVal'); assert xs and len(xs)==len(ys)
            point_count+=len(xs)
            assert s.find('c:smooth',NS).get('val')=='0'
            if name=='E1 punt': assert xs==[20] and ys==[12]
            if len(xs)==1: continue  # Text anchors are intentionally offset from curves.
            for x,y in zip(xs,ys):
                assert -1e-6<=x<=xmax+1e-6 and -1e-6<=y<=ymax+1e-6,(f,name,x,y)
                if name=='MK': near(y,2*a*x+b)
                if name=='GTK': assert x>0; near(y,a*x+b+c/x)
                if name=='V₀': near(y,12-.4*x)
                if name=='V₁': near(y,20-.4*x)
                if name=='A₀': near(y,4+.4*x)
                if name=='P = GO = MO': near(y,price)
                if name=='Arcering': assert 0<=x<=chosen and gtk-1e-6<=y<=price+1e-6
            if name=='Winstrechthoek':
                assert xs==[0,chosen,chosen,0,0] and ys==[gtk,gtk,price,price,gtk]
                near(chosen*(price-gtk),70 if authored else 600)
            if name=='q gekozen': assert xs==[chosen,chosen] and ys==[0,price]
            if name=='E1 hulplijnen': assert xs==[0,20,20] and ys==[12,12,0]
    native_tables=sum(len(E.fromstring(z.read(f)).findall('.//a:tbl',NS)) for f in slide_files)
    assert native_tables==9,native_tables

manifest=json.loads(Path(__file__).with_name('presentation-324.manifest.json').read_text(encoding='utf-8'))
lessons=Path(__file__).resolve().parents[4]/'4veco-lessen'
for row in manifest['sources']:
    assert hashlib.sha256((lessons/row['path']).read_bytes()).hexdigest()==row['sha256'],row['path']
print(json.dumps({'ok':True,'slides':22,'charts':6,'tables':native_tables,'chartPoints':point_count,
                  'overviews':[1,6,22],'notes':22,'sourceHashes':len(manifest['sources'])}))
