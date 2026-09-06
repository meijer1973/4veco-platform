"""HOW TO ADAPT: real §232 source/DOM/ink/PDF checks; optional gated rebuild.
No mechanical result replaces complete personal page and figure inspection.
"""
from pathlib import Path
from fractions import Fraction as F
import argparse
import base64
import json
import math
import re
import sys
import xml.etree.ElementTree as ET
import fitz
from PIL import Image,ImageFont
from bs4 import BeautifulSoup
from weasyprint import HTML
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import b2_232 as b
from verify_rebuild import load,save,validate_manifest,parity
from test_source import images,verify_content

def contrast(a,c):
    def lum(s):
        vals=[int(s[i:i+2],16)/255 for i in (1,3,5)];v=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in vals]
        return sum(x*y for x,y in zip(v,[.2126,.7152,.0722]))
    x,y=sorted([lum(a),lum(c)]);return (y+.05)/(x+.05)

def heading_text(soup):
    return [' '.join(h.get_text(' ',strip=True).split()) for h in soup.find_all('h2')]

def header_words_complete(words,fragments):
    return all(any(word in fragment for fragment in fragments) for word in words)

def svg_check(path,spec,model):
    root=ET.fromstring(path.read_text(encoding='utf-8'));ns={'s':'http://www.w3.org/2000/svg'}
    if root.attrib.get('viewBox')!='0 0 1200 900' or root.attrib.get('role')!='img' or root.attrib.get('aria-labelledby')!='title desc':raise ValueError('Accessible SVG canvas')
    if root.find('s:title',ns).text!=spec['alt'] or root.find('s:desc',ns).text!=spec['caption']:raise ValueError('Meaningful title/full caption')
    elems={e.attrib.get('id'):e for e in root.iter() if e.attrib.get('id')}
    font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',40);boxes=[]
    for e in root.findall('s:text',ns):
        if float(e.attrib['font-size'])!=40 or e.attrib.get('font-family')!='Arial' or e.attrib.get('font-weight')!='400':raise ValueError('Exact native type')
        if contrast(e.attrib['fill'],'#F7FAFC')<4.5:raise ValueError('Text contrast')
        value=''.join(e.itertext());x=float(e.attrib['x']);y=float(e.attrib['y']);advance=font.getlength(value)
        if e.attrib.get('text-anchor')=='middle':x-=advance/2
        elif e.attrib.get('text-anchor')=='end':x-=advance
        bb=font.getbbox(value,anchor='ls');box=[x+bb[0],y+bb[1],x+bb[2],y+bb[3]]
        if 'transform' in e.attrib:
            if e.attrib['transform']!='rotate(-90 55 450)':raise ValueError('Unplanned text transform')
            points=[(55+(yy-450),450-(xx-55)) for xx,yy in [(box[0],box[1]),(box[0],box[3]),(box[2],box[1]),(box[2],box[3])]]
            box=[min(x for x,y in points),min(y for x,y in points),max(x for x,y in points),max(y for x,y in points)]
        if box[0]<12 or box[1]<12 or box[2]>1188 or box[3]>888:raise ValueError('Clipped native text '+e.attrib['id'])
        boxes.append({'id':e.attrib['id'],'text':value,'bbox':box})
    for row in boxes:
        if row['id'] not in ['cs-label','ps-label']:continue
        backdrop=elems.get(row['id']+'-background')
        if backdrop is None or backdrop.attrib.get('fill')!='#F7FAFC' or any('opacity' in k for k in backdrop.attrib):raise ValueError('Opaque area-label background')
        r=backdrop.attrib;x=float(r['x']);y=float(r['y']);w=float(r['width']);h=float(r['height']);box=row['bbox']
        if min(box[0]-x,box[1]-y,x+w-box[2],y+h-box[3])<12:raise ValueError('Pattern/label ink clearance below12px')
    for i,one in enumerate(boxes):
        for two in boxes[i+1:]:
            x,y=one['bbox'],two['bbox']
            distance=max(x[0]-y[2],y[0]-x[2],x[1]-y[3],y[1]-x[3])
            if distance<12:raise ValueError('Native text clearance below12px '+one['id']+'/'+two['id'])
    if model:
        m=model;X=lambda q:float(F(180)+F(900)*F(str(q))/F(str(m['qmax'])));Y=lambda p:float(F(720)-F(540)*F(str(p))/F(str(m['pmax'])))
        expected={'demand':(X(0),Y(m['a']),X(m['qmax']),Y(m['a']-m['b']*m['qmax']))}
        if spec['stage']!='demand':expected['supply']=(X(0),Y(m['c']),X(m['qmax']),Y(m['c']+m['d']*m['qmax']))
        for key,values in expected.items():
            e=elems[key]
            if any(abs(float(e.attrib[k])-v)>1e-5 for k,v in zip(['x1','y1','x2','y2'],values)):raise ValueError('Curve endpoint mismatch')
            if e.attrib['stroke-width']!='4':raise ValueError('Curve stroke')
        if 'supply' in elems and (elems['supply'].attrib['stroke']!='#1E8449' or elems['supply'].attrib.get('stroke-dasharray')!='20 12' or any('opacity' in k for k in elems['supply'].attrib)):raise ValueError('Opaque accessible noncolor supply')
        bare=spec['stage'] in ('bare','demand')
        if bare and any(n in elems for n in ['equilibrium','price','quantity','cs-fill','ps-fill']):raise ValueError('Student answer marking leak')
        if not bare:
            Q=F(str(m['a']-m['c']))/(F(str(m['b']))+F(str(m['d'])));P=F(str(m['a']))-F(str(m['b']))*Q
            e=elems['equilibrium']
            if abs(float(e.attrib['cx'])-X(Q))>1e-5 or abs(float(e.attrib['cy'])-Y(P))>1e-5:raise ValueError('Wrong E')
            for key,vertices in [('cs',[(0,m['a']),(0,P),(Q,P)]),('ps',[(0,P),(0,m['c']),(Q,P)])]:
                if key+'-fill' not in elems:continue
                actual=[[float(x) for x in pair.split(',')] for pair in elems[key+'-fill'].attrib['points'].split()]
                expected_points=[[X(q),Y(p)] for q,p in vertices]
                if any(abs(v-w)>1e-5 for ap,ep in zip(actual,expected_points) for v,w in zip(ap,ep)):raise ValueError('Wrong surplus polygon')
                box=next(x['bbox'] for x in boxes if x['id']==key+'-label')
                # Signed half-planes: an outside box must not pass on distance.
                x0,y0=expected_points[0];x1,y1=expected_points[1];x2,y2=expected_points[2]
                direction=1 if (x1-x0)*(y2-y0)-(y1-y0)*(x2-x0)>0 else -1
                background=elems[key+'-label-background'].attrib
                rx,ry,rw,rh=[float(background[n]) for n in ['x','y','width','height']]
                corners=[(x,y,12) for x,y in [(box[0],box[1]),(box[0],box[3]),(box[2],box[1]),(box[2],box[3])]]
                corners += [(x,y,2) for x,y in [(rx,ry),(rx+rw,ry),(rx,ry+rh),(rx+rw,ry+rh)]]
                for x,y,minimum in corners:
                    for k in range(3):
                        ax,ay=expected_points[k];bx,by=expected_points[(k+1)%3]
                        d=direction*((bx-ax)*(y-ay)-(by-ay)*(x-ax))/math.hypot(by-ay,bx-ax)
                        if d<minimum:raise ValueError('Area label ink/background margin '+key)
        for row in boxes:
            if row['id'] not in ['demand-label','supply-label','e-label','cs-label','ps-label']:continue
            box=fitz.Rect(row['bbox']);box.x0-=14;box.x1+=14;box.y0-=14;box.y1+=14
            for key,values in expected.items():
                x1,y1,x2,y2=values
                # A linear segment intersects a rectangle if any sampled point
                # lies inside; dense samples plus independent corner distances.
                for j in range(2001):
                    t=j/2000
                    if fitz.Point(x1+t*(x2-x1),y1+t*(y2-y1)) in box:raise ValueError('Label/curve ink collision '+row['id']+'/'+key)
    return {'stem':spec['stem'],'text':boxes,'supply_contrast':contrast('#1E8449','#F7FAFC'),'geometry':'PASS'}

def check(manifest_path):
    manifest=load(manifest_path);custody=validate_manifest(manifest);folder=Path(custody['folder']);spec=b.describe();record=b.target_record()
    docs=b.documents(record,spec);verify_content(docs,record,spec)
    output=[]
    for kind,d in zip(b.KINDS,manifest['documents']):
        md=Path(d['source_md']).read_text(encoding='utf-8')
        if md!=docs[kind]:raise ValueError('Source serialization freshness')
        refs=images(md);soup=BeautifulSoup(Path(d['source_html']).read_text(encoding='utf-8'),'html.parser')
        if heading_text(soup)!=b.HEADINGS:raise ValueError('Rendered seven headings')
        figs=soup.find_all('figure')
        if len(figs)!=len(refs):raise ValueError('Figure count')
        for f,r in zip(figs,refs):
            image=f.find('img');cap=f.find('figcaption')
            if image.get('alt')!=r['alt'] or image.get('aria-hidden')=='true' or ' '.join(cap.get_text(' ',strip=True).split())!=r['caption']:raise ValueError('Actual short alt/full caption')
            if base64.b64decode(image['src'].split(',',1)[1])!=(folder/'_assets'/(r['stem']+'.png')).read_bytes():raise ValueError('Embedded asset byte identity')
        pdf=fitz.open(d['source_pdf']);pages=[]
        for i,page in enumerate(pdf,1):
            spans=[s for block in page.get_text('dict')['blocks'] if 'lines' in block for line in block['lines'] for s in line['spans'] if s['text'].strip()]
            if not spans or len(page.get_text().strip())<20:raise ValueError('Blank page')
            if any(s['size']<11.99 for s in spans):raise ValueError('Below12pt actual PDF type')
            for s in spans:
                box=fitz.Rect(s['bbox'])
                if box.x0<0 or box.y0<0 or box.x1>page.rect.width+.2 or box.y1>page.rect.height+.2:raise ValueError('PDF clipped text')
                if '\ufffd' in s['text'] or '\u25a1' in s['text']:raise ValueError('Broken glyph')
            pages.append({'page':i,'minimum_text_pt':min(s['size'] for s in spans),'text_characters':len(page.get_text())})
        layout=HTML(string=Path(d['source_html']).read_text(encoding='utf-8')).render();placements=[]
        for i,page in enumerate(layout.pages,1):
            for box in page._page_box.descendants():
                if type(box).__name__=='TableCellBox' and getattr(box,'element_tag',None)=='th':
                    words=re.findall(r'\w+', ''.join(box.element.itertext()))
                    fragments=[v.text for v in box.descendants() if type(v).__name__=='TextBox']
                    if not header_words_complete(words,fragments):raise ValueError('Mid-word table header break')
                if getattr(box,'element_tag',None)!='img':continue
                w,h=box.width*.75,box.height*.75
                if abs(w-166*72/25.4)>.2 or abs(h-124.5*72/25.4)>.2:raise ValueError('Wrong actual166mm placement')
                x,y=box.position_x*.75,box.position_y*.75
                if x<24*72/25.4-.2 or x+w>page.width*.75-20*72/25.4+.2 or y<20*72/25.4-.2 or y+h>page.height*.75-21*72/25.4+.2:raise ValueError('Image outside native print margins')
                placements.append({'page':i,'width_pt':w,'height_pt':h,'placed_font_pt':40*w/1200})
        if len(placements)!=len(refs):raise ValueError('Missing placed figures')
        output.append({'kind':kind,'pages':pages,'placements':placements})
    figures=[]
    for s in spec['specs']:
        figures.append(svg_check(folder/'_assets'/(s['stem']+'.svg'),s,spec['models'].get(s['model'])))
        with Image.open(folder/'_assets'/(s['stem']+'.png')) as image:
            if image.size!=(2400,1800):raise ValueError('Native PNG dimensions')
    return {'status':'PASS','manifest':str(manifest_path),'sha256':b.sha(Path(manifest_path).read_bytes()),'documents':output,'figures':figures,'personal_inspection':'NOT_PERFORMED_BY_SCRIPT','production_ready':False}

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--manifest',type=Path,required=True);p.add_argument('--output',type=Path,required=True)
    p.add_argument('--rebuild',action='store_true');p.add_argument('--revision');p.add_argument('--reservation',type=Path)
    p.add_argument('--execution-role',choices=list(b.gate.ROLES),default='author');a=p.parse_args()
    b.gate.evidence_path(a.output,b.gate.execution_identity(a.execution_role))
    if a.output.exists():raise ValueError('Fresh checker evidence required')
    try:
        result=check(a.manifest)
        if a.rebuild:
            if not a.revision or not a.reservation:raise ValueError('Fresh reserved checker rebuild required')
            old=load(a.manifest)
            rebuilt=b.build(b.ROOT.parent/'4veco-lessen',old['source_commit'],a.revision,a.reservation,execution_role=a.execution_role)
            new=Path(rebuilt['manifest_path'])
            result['rebuild']=parity([a.manifest,new]);result['rebuild_check']=check(new)
        save(a.output,result);print(json.dumps({'status':'PASS','documents':[{ 'kind':d['kind'],'pages':len(d['pages'])} for d in result['documents']],'figures':len(result['figures'])}))
    except Exception as e:
        save(a.output,{'status':'FAIL','error':str(e),'manifest':str(a.manifest),'personal_inspection':'NOT_PERFORMED_BY_SCRIPT'});raise
