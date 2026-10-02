import os
"""Local arithmetic, structural, asset and rendered-PDF checks. Not a classroom study."""
from pathlib import Path
import json, re, math, ast, operator, hashlib, xml.etree.ElementTree as ET
from PIL import ImageFont
import fitz
from bs4 import BeautifulSoup
ROOT=Path(os.environ['BOOK1_CHAPTER_ROOT']); QA=ROOT/'QA';OUT=(ROOT.parent.parent/'hoofdstukken'/ROOT.name);CHECKS=[]
def test(name,ok,detail=None):CHECKS.append({'check':name,'pass':bool(ok),**({'detail':detail} if detail is not None else {})})
OPS={ast.Add:operator.add,ast.Sub:operator.sub,ast.Mult:operator.mul,ast.Div:operator.truediv,ast.Pow:operator.pow,ast.USub:operator.neg,ast.UAdd:operator.pos}
def calc(s):
    def rec(n):
        if isinstance(n,ast.Expression):return rec(n.body)
        if isinstance(n,ast.Constant) and isinstance(n.value,(int,float)):return n.value
        if isinstance(n,ast.BinOp) and type(n.op) in OPS:return OPS[type(n.op)](rec(n.left),rec(n.right))
        if isinstance(n,ast.UnaryOp) and type(n.op) in OPS:return OPS[type(n.op)](rec(n.operand))
        raise ValueError('Unsupported calculation')
    return rec(ast.parse(s,mode='eval'))
def close(x,y):return math.isclose(x,y,rel_tol=1e-8,abs_tol=2e-5)
E=json.loads((QA/'exercises.json').read_text(encoding='utf8'));figs=json.loads((QA/'figures.json').read_text(encoding='utf8'))
test('38 consecutive exercises',[e['number'] for e in E]==list(range(1,39)))
test('100 subquestions',sum(len(e['questions']) for e in E)==100)
test('Four target exercises',[e['number'] for e in E if e['kind']=='target']==[7,18,30,36])
for e in E:
    test(f'{e["number"]}: question/answer count',len(e['questions'])==len(e['answers']))
    for j,(answer,why) in enumerate(e['answers']):
        test(f'{e["number"]}{chr(97+j)}: complete answer',bool(answer.strip()))
        test(f'{e["number"]}{chr(97+j)}: explanation or bonus criteria',bool(why.strip()) or e['kind']=='bonus' and len(e['criteria'] or [])>=2)
for c in json.loads((QA/'numerical_cases.json').read_text(encoding='utf8')):
    got=calc(c['expression']);test('arithmetic '+c['label'],close(got,c['expected']),{'computed':got,'expected':c['expected']})
# Direct independent checks of the target quantities and formula inverses.
for name,expr,want in [('target111 alternative','3*70',210),('target112 pp','36/150*100-24/120*100',4),('target112 relative share','((36/150)/(24/120)-1)*100',20),('target113 inverse','8+2*12',32),('target114 interpolation','(140+100)/2',120),('target114 growth','(6/4.8-1)*100',25)]:
    test('cross-check '+name,close(calc(expr),want))
ns={'s':'http://www.w3.org/2000/svg'}
for f in figs:
    name=f['file'];path=ROOT/'_assets'/(name+'.svg');test(name+' SVG/PNG exist',path.exists() and path.with_suffix('.png').exists())
    root=ET.parse(path).getroot()
    test(name+' canvas',root.attrib['viewBox']==f'0 0 720 {f["height"]}')
    if f['type']=='chart':
        left,right,top,bottom=f['plot'];X=lambda x:left+x/f['xmax']*(right-left);Y=lambda y:bottom-y/f['ymax']*(bottom-top)
        circles=root.findall('.//s:circle[@data-role="data-point"]',ns)
        test(name+' point count',len(circles)==(0 if f['stage']=='axes' else len(f['points'])))
        for i,c in enumerate(circles):
            x,y=f['points'][i];test(name+f' point {i}',close(float(c.get('cx')),X(x)) and close(float(c.get('cy')),Y(y)))
        lines=root.findall('.//s:line[@data-role="data-line"]',ns)
        test(name+' segment count',len(lines)==(max(0,len(f['points'])-1) if f['stage'] in ['line','read'] else 0))
        for i,l in enumerate(lines):
            (x1,y1),(x2,y2)=f['points'][i:i+2]
            test(name+f' segment {i}',all(close(float(l.get(k)),v) for k,v in [('x1',X(x1)),('y1',Y(y1)),('x2',X(x2)),('y2',Y(y2))]))
        if f['reading']:
            x,y=f['reading'];c=root.find('.//s:circle[@data-role="reading-point"]',ns)
            test(name+' reading geometry',c is not None and close(float(c.get('cx')),X(x)) and close(float(c.get('cy')),Y(y)))
            on=False
            for (x1,y1),(x2,y2) in zip(f['points'],f['points'][1:]):
                cross=(x-x1)*(y2-y1)-(y-y1)*(x2-x1)
                if abs(cross)<1e-8 and min(x1,x2)-1e-8<=x<=max(x1,x2)+1e-8 and min(y1,y2)-1e-8<=y<=max(y1,y2)+1e-8:on=True
            test(name+' reading lies on segment',on)
    if f['type']=='area':
        pol=root.findall('.//s:polygon[@data-role="area"]',ns)
        for i,(obj,p) in enumerate(zip(f['panels'],pol)):
            left,right,top,bottom=obj['plot'];mx,my=obj['max'];XY=lambda t:(left+t[0]/mx*(right-left),bottom-t[1]/my*(bottom-top))
            got=[tuple(map(float,t.split(','))) for t in p.attrib['points'].split()];want=[XY(v) for v in obj['vertices']]
            test(name+f' polygon {i}',len(got)==len(want) and all(close(a,c) and close(b,d) for (a,b),(c,d) in zip(got,want)))
            v=obj['vertices'];area=abs(sum(v[j][0]*v[(j+1)%len(v)][1]-v[(j+1)%len(v)][0]*v[j][1] for j in range(len(v))))/2
            test(name+f' area {i}',close(area,obj['area']))
    # Conservative horizontal text extent check, using the local Lato font for labels.
    for ti,t in enumerate(root.findall('.//s:text',ns)):
        if t.get('transform'):continue
        text=''.join(t.itertext());size=float(t.get('font-size','17'));fontpath=str(Path(os.environ['LATO_FONT_DIR'])/('Lato-Bold.ttf' if t.get('font-weight')=='700' else 'Lato-Regular.ttf'))
        font=ImageFont.truetype(fontpath,round(size*4));width=font.getlength(text)/4;x=float(t.get('x','0'));anc=t.get('text-anchor','start');lo=x-(width/2 if anc=='middle' else width if anc=='end' else 0);hi=lo+width
        test(name+f' text {ti} viewport',lo>=-2 and hi<=722 and 0<=float(t.get('y','0'))<=f['height'],text)
# Manuscript contract and links.
files=json.loads((ROOT/'chapter-order.json').read_text(encoding='utf8'));student='\n'.join((ROOT/f).read_text(encoding='utf8') for f in files)
heads=['Uitgewerkt voorbeeld','Startopgaven','Begeleide inoefening','Zelfstandige oefening','Doeloefening','Denkertje / Bonusopgave','Herhaling en combineren']
for f in files[1:4]:
    body=(ROOT/f).read_text(encoding='utf8');actual=re.findall(r'^## (.+)$',body,re.M);test(f+' canonical headings',actual==heads,actual)
    test(f+' paper route','Normale route: Startopgaven → Begeleide inoefening → Zelfstandige oefening → Doeloefening.' in body and 'Uitdagende route: Startopgaven → Zelfstandige oefening → Doeloefening → Denkertje / Bonusopgave.' in body and 'Begeleide inoefening hoort bij leren: je oefent met denkstappen en doet steeds meer zelf.' in body)
    test(f+' summary before start',body.index('Samenvatting')<body.index('## Startopgaven') and body.index('Samenvatting')>body.index('## Uitgewerkt voorbeeld'))
for f in files+['Antwoorden.md','Docenteninformatie.md']:
    text=(ROOT/f).read_text(encoding='utf8');soup=BeautifulSoup(text,'html.parser')
    for im in soup.find_all('img'):test(f+' references '+im.get('src'),(ROOT/im.get('src')).exists())
test('No answer figure in student text',not re.search(r'_assets/[^" ]*_ans_',student))
test('No device dependence in student copy',not re.search(r'(ga naar (de )?website|scan de qr|online uitleg|\bPart A\b|\bPart B\b)',student,re.I))
# Rendered page structure, text presence and bounds.
STEMS=[('Boek_1_H1_Economisch_denken_en_rekenen_Tweede_editie',40),('Boek_1_H1_Antwoorden_Tweede_editie',20),('Boek_1_H1_Docenteninformatie_Tweede_editie',8)]
for stem,expected in STEMS:
    with fitz.open(OUT/(stem+'.pdf')) as d:
        test(stem+' page count',len(d)==expected)
        mapping=json.loads((QA/(stem+'_page_map.json')).read_text(encoding='utf8'));test(stem+' no designed-page spill',all(x['designed_pages']==[x['pdf_page']] for x in mapping))
        for i,pg in enumerate(d):
            text=pg.get_text();test(stem+f' page {i+1} has text',len(text.strip())>70)
            test(stem+f' page {i+1} glyphs','\ufffd' not in text and '\u25a0' not in text)
            spans=[s for b in pg.get_text('dict')['blocks'] if 'lines'in b for l in b['lines'] for s in l['spans']]
            bad=[s['text'] for s in spans if s['bbox'][0]<5 or s['bbox'][1]<0 or s['bbox'][2]>pg.rect.width-4 or s['bbox'][3]>pg.rect.height]
            test(stem+f' page {i+1} text bounds',not bad,bad)
        if 'Economisch' in stem:
            txt='\n'.join(p.get_text() for p in d)
            found=set(map(int,re.findall(r'Opgave (\d+)\s*·',txt)));test('All student exercise headings in PDF',found==set(range(1,39)))
            test('Facing sources and target', 'Bron A' in d[35].get_text() and 'Opgave 36' in d[36].get_text())
            test('Continuous footer numbers',all(str(i+1) in p.get_text()[-100:] for i,p in enumerate(d)))
        if 'Antwoorden' in stem:
            found=set(map(int,re.findall(r'Opgave (\d+)\s*·','\n'.join(p.get_text() for p in d))))
            test('All answer exercise headings in PDF',found==set(range(1,39)))
            test('38 answer bookmarks',len(d.get_toc())==38)
# Actual lesson arithmetic is checked explicitly.
lessons=json.loads((QA/'lesson_minutes.json').read_text(encoding='utf8'))
for le in lessons:test(le['paragraph']+' complete route estimate',sum(le['components'].values())==le['total'] and (not le['normal_route'] or le['components']['begeleid']>0))
report={'scope':'Local content/build checks. Manual visual review recorded separately; no classroom or independent-review claim.','total_checks':len(CHECKS),'passed':sum(x['pass'] for x in CHECKS),'failed':sum(not x['pass'] for x in CHECKS),'checks':CHECKS}
(QA/'validation_report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2), encoding='utf8', newline='\n')
print({k:v for k,v in report.items() if k!='checks'})
for x in CHECKS:
    if not x['pass']:print('FAIL:',x)
raise SystemExit(1 if report['failed'] else 0)
