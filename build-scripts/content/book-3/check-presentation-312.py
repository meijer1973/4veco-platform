"""Verify the saved deck's economic chart geometry, notes and overview parity.

HOW TO ADAPT: replace the two analytical markets and slide map when adapting
this content. Run with the final PPTX; this reads actual cached OOXML points.
Workbook/reference consistency remains the shared chart_workbooks.py check.
"""
import json
import re
import sys
from pathlib import Path
from zipfile import ZipFile
from lxml import etree as ET

ns = {'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main'}
def close(a, b):
    assert abs(a-b) < 1e-6, (a, b)
def area(poly):
    return abs(sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(poly,poly[1:]+poly[:1])))/2
def inside(p, poly):
    crosses = [(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]) for a,b in zip(poly,poly[1:]+poly[:1])]
    return all(v >= -1e-6 for v in crosses) or all(v <= 1e-6 for v in crosses)
def vals(ser, axis):
    return [float(v.text) for v in ser.findall(f'c:{axis}Val//c:pt/c:v', ns)]

with ZipFile(sys.argv[1]) as z:
    chart_names = sorted((n for n in z.namelist() if re.search(r'/charts/chart\d+\.xml$', n)), key=lambda n:int(re.search(r'chart(\d+)', n).group(1)))
    assert len(chart_names) == 10
    chart_slides = [4,5,7,8,9,18,23,24,26,27]
    checked_points = 0
    for j, name in enumerate(chart_names):
        root = ET.fromstring(z.read(name))
        a,b,c,d,t,q0,p0,qt,pc,pp,xmax = (20,.3,4,.1,4,40,8,30,11,7,60) if j<5 else (20,.2,2,.1,3,60,8,50,10,7,100)
        mode = 'old' if j in [0,6] else 'base' if j==5 else 'new'
        q,cp,ppp = (q0,p0,p0) if mode=='old' else (qt,pc,pp)
        close(a-b*q0,p0);close(c+d*q0,p0);close(a-b*qt,pc);close(c+d*qt,pp);close(pc-pp,t)
        polygons = {'CS':[(0,cp),(q,cp),(0,a)],'PS':[(0,c),(q,ppp),(0,ppp)],'O':[(0,pp),(qt,pp),(qt,pc),(0,pc)],'W':[(qt,pp),(q0,p0),(qt,pc)]}
        expected_area = {'CS':.5*q*(a-cp),'PS':.5*q*(ppp-c),'O':t*qt,'W':.5*(q0-qt)*t}
        assert root.find('.//c:scatterStyle', ns).get('val') == 'line'
        actual_series = root.findall('.//c:ser', ns)
        for ser in actual_series:
            title = ser.findtext('c:tx/c:v', namespaces=ns)
            pts = list(zip(vals(ser,'x'),vals(ser,'y')))
            checked_points += len(pts)
            assert ser.find('c:smooth', ns).get('val') == '0'
            assert all(-1e-6 <= x <= xmax+1e-6 and -1e-6 <= y <= 22+1e-6 for x,y in pts)
            if title in ['V','A','A + t']:
                for x,y in pts: close(y, a-b*x if title=='V' else c+d*x+(t if title=='A + t' else 0))
            elif title == 'guide Q':
                assert pts == [(q,0),(q,cp)]
            elif title == 'guide Pc':
                assert pts == [(0,cp),(q,cp)]
            elif title == 'guide Pp':
                assert pts == [(0,pp),(q,pp)]
            elif title == 'guide Q0':
                assert pts == [(q0,0),(q0,p0)]
            elif title.endswith(' boundary'):
                key=title.split()[0]
                assert pts == polygons[key]+[polygons[key][0]]
                close(area(pts[:-1]),expected_area[key])
            elif title.endswith(' hatch'):
                key=title.split()[0]
                assert all(inside(pt,polygons[key]) for pt in pts), (title,pts)
                close(pts[0][1 if key=='W' else 0],pts[1][1 if key=='W' else 0])
            for labels in ser.findall('c:dLbls',ns):
                for tag in ['showVal','showCatName','showSerName','showLegendKey']:
                    assert labels.find('c:'+tag,ns).get('val') == '0'
        axes=root.findall('.//c:valAx',ns)
        assert len(axes)==2
        for axis in axes:
            close(float(axis.find('c:scaling/c:min',ns).get('val')),0)
            close(float(axis.find('c:scaling/c:max',ns).get('val')),xmax if axis.find('c:axPos',ns).get('val')=='b' else 22)
    slide_names=sorted((n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)), key=lambda n:int(re.search(r'slide(\d+)',n).group(1)))
    assert len(slide_names)==29
    native_tables = 0
    for name in slide_names:
        root=ET.fromstring(z.read(name));native_tables+=len(root.findall('.//a:tbl',ns))
        for prop in root.findall('.//*[@sz]'):
            assert int(prop.get('sz'))>=1400, (name,prop.get('sz'))
    notes=[n for n in z.namelist() if re.fullmatch(r'ppt/notesSlides/notesSlide\d+\.xml',n)]
    assert len(notes)==29
    for name in notes:
        root=ET.fromstring(z.read(name)); txt=' '.join(root.findall('.//a:t',ns)[i].text or '' for i in range(len(root.findall('.//a:t',ns))))
        for label in ['Vraag:','Uitleg:','Misvatting:','Overgang:','Bron:']: assert label in txt,(name,label)
        for prop in root.findall('.//*[@sz]'): assert int(prop.get('sz'))>=1400
    def overview(n):
        root=ET.fromstring(z.read(f'ppt/slides/slide{n}.xml')); shapes=[]
        for shape in root.findall('.//p:sp',ns):
            name=shape.find('p:nvSpPr/p:cNvPr',ns).get('name')
            txt=''.join(t.text or '' for t in shape.findall('.//a:t',ns))
            if name=='phase' or txt==str(n):continue
            geom=shape.find('p:spPr/a:xfrm',ns)
            shapes.append((name,txt,ET.tostring(geom).decode() if geom is not None else ''))
        return shapes
    assert overview(1)==overview(16)==overview(29)
    assert native_tables==10,native_tables
print(json.dumps({'ok':True,'slides':29,'notes':29,'native_tables':native_tables,'native_charts':10,'geometry_points_checked':checked_points,'overview_slides':[1,16,29],'chart_slides':chart_slides}))
