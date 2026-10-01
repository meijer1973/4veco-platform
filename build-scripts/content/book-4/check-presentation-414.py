"""HOW TO ADAPT: assert the new paragraph's actual saved chart equations and route.

Usage: python check-presentation-414.py FINAL.pptx
Checks package data, not classroom learning or the rendered appearance.
"""
import json
import re
import subprocess
import sys
from pathlib import Path
from zipfile import ZipFile
from lxml import etree as ET

NS = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main'}
file = Path(sys.argv[1])
def close(a, b):
    assert abs(a-b) < 0.00001, (a, b)
def values(series, tag):
    return [float(e.text) for e in series.findall(f'c:{tag}//c:pt/c:v', NS)]
def text(root):
    return '\n'.join(root.xpath('//a:t/text()', namespaces=NS))

with ZipFile(file) as z:
    slide_parts = [f'ppt/slides/slide{i}.xml' for i in range(1,28)]
    assert len([n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+.xml', n)]) == 27
    roots = [ET.fromstring(z.read(n)) for n in slide_parts]
    slide_text = [text(r) for r in roots]
    for i in range(1,28):
        note = ET.fromstring(z.read(f'ppt/notesSlides/notesSlide{i}.xml'))
        nt = text(note)
        for label in ('Vraag:', 'Uitleg:', 'Misvatting:', 'Overgang:', 'Bron:'):
            assert label in nt, (i, label)
        assert 'e734532a42b27732ac25ce990fc9448b12309d28' in nt
        sizes = note.xpath('//@sz')
        assert sizes and min(map(int, sizes)) >= 1400, (i, sizes)
    def overview(root):
        result = []
        for shape in root.findall('.//p:sp', NS):
            name = shape.find('p:nvSpPr/p:cNvPr', NS).get('name')
            content = '\n'.join(shape.xpath('.//a:t/text()', namespaces=NS))
            if name == 'phase' or content in ('1', '13', '27'):
                continue
            xf = shape.find('p:spPr/a:xfrm', NS)
            result.append((name, content, ET.tostring(xf)))
        return result
    assert overview(roots[0]) == overview(roots[12]) == overview(roots[26])
    for n in (0,12,26):
        for s in ('Pagina 41', '31 en 32', '33, 34 en 35', '36 en 37', 'Doelopgave: 38', 'Maken en nakijken'):
            assert s in slide_text[n]
    assert '0,125q² + 10q + 200' in slide_text[13]
    assert all(s in slide_text[15] for s in ('a. (2p)', 'b. (3p)', 'c. (1p)'))
    assert all(s in slide_text[16] for s in ('d. (3p)', 'e. (2p)', 'f. (2p)', 'q = 60'))
    assert 'MO = 40 − 0,50q' in slide_text[17]
    chart_parts = sorted((n for n in z.namelist() if re.search(r'/charts/chart\d+\.xml$', n)), key=lambda n: int(re.search(r'chart(\d+)',n)[1]))
    assert len(chart_parts) == 6
    total_points = 0
    for idx, part in enumerate(chart_parts):
        r = ET.fromstring(z.read(part))
        a,b,c,d,f,q,xmax = (36,.30,.15,9,90,30,50) if idx < 3 else (40,.25,.125,10,200,40,80)
        P=a-b*q; marginal=a-2*b*q; gtk=c*q+d+f/q
        axes = {axis.find('c:axPos',NS).get('val'):axis.find('c:scaling',NS)
                for axis in r.findall('.//c:valAx',NS)}
        assert set(axes) == {'b','l'}
        close(float(axes['b'].find('c:min',NS).get('val')),0)
        close(float(axes['b'].find('c:max',NS).get('val')),xmax)
        close(float(axes['l'].find('c:min',NS).get('val')),0)
        close(float(axes['l'].find('c:max',NS).get('val')),40)
        for ser in r.findall('.//c:scatterChart/c:ser', NS):
            assert ser.find('c:smooth', NS).get('val') == '0'
            name = ser.findtext('c:tx/c:v', namespaces=NS) or ser.findtext('c:tx//c:v', namespaces=NS)
            xs,ys = values(ser,'xVal'),values(ser,'yVal')
            assert len(xs)==len(ys) and len(xs)>0
            # Single-point text anchors are intentionally offset from curves.
            if len(xs)>1:
                total_points += len(xs)
                if name in ('GO = P','MO','MK','GTK'):
                    fn={'GO = P':lambda x:a-b*x,'MO':lambda x:a-2*b*x,'MK':lambda x:2*c*x+d,'GTK':lambda x:c*x+d+f/x}[name]
                    for x,y in zip(xs,ys): close(y,fn(x))
                elif name=='Hulplijn q':
                    assert xs==[q,q]; assert ys==[0,marginal]
                elif name=='Van MO/MK naar GO':
                    assert xs==[q,q]; assert ys==[marginal,P]
                elif name=='Hulplijn P':
                    assert xs==[0,q]; assert ys==[P,P]
                elif name=='Winstrechthoek':
                    assert xs==[0,q,q,0,0]; assert ys==[gtk,gtk,P,P,gtk]
                    close((P-gtk)*q,315)
                elif name=='Hulplijn gekozen q':
                    assert xs==[q,q]; assert ys==[0,gtk]
                else: raise AssertionError(name)
            if name=='Punt 1': assert xs==[q] and ys==[marginal]
            if name=='Punt 2': assert xs==[q] and ys==[P]
        if idx==3:
            assert not r.xpath('.//c:ser/c:tx/c:v[contains(text(),"Hulplijn")]',namespaces=NS)
    assert sum(len(r.findall('.//a:tbl',NS)) for r in roots)==7
subprocess.run([sys.executable,str(Path(__file__).resolve().parents[2]/'presentations/chart_workbooks.py'),str(file)],check=True)
print(json.dumps({'status':'PASS','slides':27,'notes':27,'tables':7,'charts':6,'equationAndGuidePoints':total_points,'overviewSlides':[1,13,27],'targetQuestions':[16,17],'firstTargetAnswer':18}))
