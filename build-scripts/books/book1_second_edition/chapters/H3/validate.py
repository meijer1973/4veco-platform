import os
"""Local checks of authored numbers, actual SVG geometry, coverage and rendered PDFs.
This is not a classroom trial, an external peer review or the repository CI suite.
"""
from pathlib import Path
import ast, operator, json, math, re, hashlib, xml.etree.ElementTree as ET
from collections import Counter
import fitz
from PIL import Image
R=Path(os.environ['BOOK1_CHAPTER_ROOT'])
CHECKS=[]
def check(name,condition,detail=''):
    CHECKS.append({'check':name,'pass':bool(condition),'detail':detail})
def close(a,b): return abs(a-b)<1e-4
OPS={ast.Add:operator.add,ast.Sub:operator.sub,ast.Mult:operator.mul,ast.Div:operator.truediv,ast.Pow:operator.pow}
def calc(node):
    if isinstance(node,ast.Expression):return calc(node.body)
    if isinstance(node,ast.Constant) and isinstance(node.value,(int,float)):return node.value
    if isinstance(node,ast.BinOp) and type(node.op) in OPS:return OPS[type(node.op)](calc(node.left),calc(node.right))
    if isinstance(node,ast.UnaryOp) and isinstance(node.op,ast.USub):return -calc(node.operand)
    raise ValueError('Unsupported numerical expression')
def read(name):return json.loads((R/'QA'/name).read_text(encoding='utf8'))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()

def main():
    for n in read('numerical_cases.json'):
        actual=calc(ast.parse(n['expression'],mode='eval'))
        check('Arithmetic: '+n['label'],close(actual,n['expected']),f"actual={actual}; expected={n['expected']}")
    # Independent calculations from the functions specified in the teaching cases.
    # Entries: name, demand intercept/slope, supply intercept/slope, expected price/quantity.
    models=[
        ('broodjes',120,-10,-20,10,7,50),('drinkflessen',80,-5,-20,5,10,30),
        ('lunchboxen',60,-5,-10,5,7,25),('posters',90,-5,-30,10,8,50),
        ('schriften',140,-10,-20,10,8,60),('fietsmanden',120,-4,-30,6,15,60),
        ('bekers',150,-10,-30,5,12,30),('helmen oud',80,-4,-16,4,12,32),
        ('helmen vraag nieuw',96,-4,-16,4,14,40),('helmen aanbod nieuw',80,-4,-32,4,14,24),
        ('aardbeien oud',40,-2,-8,2,12,16),('aardbeien nieuw',40,-2,-16,2,14,12),
        ('plantenvoeding oud',60,-3,-12,3,12,24),('plantenvoeding nieuw',72,-3,-12,3,14,30),
        ('notitieblokken oud',100,-5,-20,5,12,40),('notitieblokken nieuw',100,-5,-40,5,14,30),
        ('reparatiesets oud',96,-4,-16,4,14,40),('reparatiesets nieuw',112,-4,-16,4,16,48),
        ('speelgoed oud',120,-6,-24,6,12,48),('speelgoed nieuw',120,-6,-12,6,11,54),
        ('kabels oud',100,-5,-20,5,12,40),('kabels nieuw',120,-5,-20,5,14,50),
        ('lampjes',90,-5,-30,10,8,50),('tenten oud',120,-4,-24,8,12,72),
        ('tenten nieuw',120,-4,-12,8,11,76),('tassen oud',180,-10,-20,10,10,80),
        ('tassen nieuw',180,-10,-60,10,12,60)]
    for name,da,db,sa,sb,p0,q0 in models:
        p=(da-sa)/(sb-db);qd=da+db*p;qs=sa+sb*p
        check('Market: '+name,close(p,p0) and close(qd,q0) and close(qs,q0),f'P={p}, Qv={qd}, Qa={qs}')
    (R/'QA/market_models.json').write_text(json.dumps(models,ensure_ascii=False,indent=2), encoding='utf8', newline='\n')
    ex=read('exercises.json');tar=read('target_exercises.json');figs=read('figures.json')
    check('Exercise numbers 1–38', [e['number'] for e in ex]==list(range(1,39)))
    check('Ninety subquestions',sum(len(e['questions']) for e in ex)==90)
    check('Four target exercises', [e['number'] for e in tar]==[9,20,31,37])
    for e in ex:
        check(f"Answers for exercise {e['number']}",len(e['questions'])==len(e['answers']) and all(len(a)>15 for a in e['answers']))
        if e['kind']=='bonus':
            check(f"Bonus criteria {e['number']}",e['criteria'] and 2<=len(e['criteria'])<=4)
        else:check(f"Why in exercise {e['number']}",all('Waarom:' in a for a in e['answers']))
        if e['answer_figure']:check(f"Answer figure {e['number']}",(R/'_assets'/(e['answer_figure']+'.svg')).exists())
    headings=['Uitgewerkt voorbeeld','Startopgaven','Begeleide inoefening','Zelfstandige oefening','Doeloefening','Denkertje / Bonusopgave','Herhaling en combineren']
    for ref in ['1.3.1','1.3.2','1.3.3']:
        f=next(R.glob(ref+' *paragraaf.md'));text=f.read_text(encoding='utf8');pos=[text.find('## '+h) for h in headings]
        check('Canonical order '+ref,all(x>=0 for x in pos) and pos==sorted(pos))
        check('Summary before start '+ref,pos[0]<text.find('Samenvatting §'+ref)<pos[1])
        check('Paper routes '+ref,'Normale route: Startopgaven → Begeleide inoefening → Zelfstandige oefening → Doeloefening.' in text and 'Uitdagende route: Startopgaven → Zelfstandige oefening → Doeloefening → Denkertje / Bonusopgave.' in text and 'Begeleide inoefening hoort bij leren: je oefent met denkstappen en doet steeds meer zelf.' in text)
    allmd='\n'.join((R/f).read_text(encoding='utf8') for f in json.loads((R/'chapter-order.json').read_text(encoding='utf8')))
    refs=re.findall(r'src="_assets/([^\"]+)"',allmd)
    check('26 student figures',len(refs)==26 and len(set(refs))==26)
    check('11 solution figures',len([f for f in figs if f['kind']=='answer'])==11)
    for ref in refs:check('Student asset '+ref,(R/'_assets'/ref).exists())
    for fm in figs:
        name=fm['name'];path=R/'_assets'/(name+'.svg');root=ET.parse(path).getroot()
        check('SVG viewport '+name,list(map(float,root.attrib['viewBox'].split()))==[0,0,720,fm['height']])
        with Image.open(path.with_suffix('.png')) as im:check('PNG aspect '+name,abs(im.width/im.height-720/fm['height'])<.002)
        # All unrotated text anchors are inside the viewport. Width is checked visually.
        for t in root.iter('{http://www.w3.org/2000/svg}text'):
            check('Text anchor '+name+': '+(''.join(t.itertext()))[:35],0<float(t.attrib['x'])<720 and 0<float(t.attrib['y'])<fm['height'])
        if fm.get('type')=='linear':
            pl=fm['plot'];sx=(pl['ex']-pl['ox'])/pl['xmax'];sy=(pl['by']-pl['top'])/pl['ymax']
            X=lambda q:pl['ox']+q*sx;Y=lambda p:pl['by']-p*sy
            curves={v['name']:v for v in fm['curves']}
            for curve in fm['curves']:
                if not curve['drawn']:continue
                ln=next(n for n in root.iter() if n.attrib.get('data-curve')==curve['name'])
                for k,price in [(1,curve['p_lo']),(2,curve['p_hi'])]:
                    q=curve['a']+curve['b']*price
                    check(f"SVG endpoint {name}/{curve['name']}/{k}",close(float(ln.attrib[f'x{k}']),X(q)) and close(float(ln.attrib[f'y{k}']),Y(price)) and -1e-8<=q<=pl['xmax']+1e-8 and curve['domain'][0]-1e-8<=price<=curve['domain'][1]+1e-8)
            for m in fm['marks']:
                ci=next(n for n in root.iter() if n.attrib.get('data-point')==str(m['id']));cv=curves[m['curve']]
                check(f"SVG marker {name}/{m['id']}",close(m['q'],cv['a']+cv['b']*m['p']) and close(float(ci.attrib['cx']),X(m['q'])) and close(float(ci.attrib['cy']),Y(m['p'])))
                if m['guides']:
                    for key,expected in [('h',(pl['ox'],Y(m['p']),X(m['q']),Y(m['p']))),('v',(X(m['q']),Y(m['p']),X(m['q']),pl['by']))]:
                        ln=next(n for n in root.iter() if n.attrib.get('data-guide')==key+str(m['id']))
                        check(f"SVG guide {name}/{key}{m['id']}",all(close(float(ln.attrib[a]),v) for a,v in zip(['x1','y1','x2','y2'],expected)))
            if name=='1.3.2_ans_20':check('Cup answer graph respects source upper price 15',curves['A']['domain'][1]==15 and curves['V']['domain'][1]==15)
        elif fm.get('type')=='geometry':
            pg=next(n for n in root.iter() if n.attrib.get('data-polygon')=='triangle');xy=[tuple(map(float,x.split(','))) for x in pg.attrib['points'].split()];pl=fm['plot']
            world=[((x-pl['ox'])/pl['sx'],(pl['by']-y)/pl['sy']) for x,y in xy]
            area=abs(sum(x*world[(i+1)%3][1]-world[(i+1)%3][0]*y for i,(x,y) in enumerate(world)))/2
            check('Actual SVG triangle area',close(area,16) and all(close(a,c) and close(b,d) for (a,b),(c,d) in zip(world,fm['polygon'])))
    stems=[('Boek_1_H3_Aanbod_en_marktevenwicht_Tweede_editie',40),('Boek_1_H3_Antwoorden_Tweede_editie',21),('Boek_1_H3_Docenteninformatie_Tweede_editie',9)]
    texts={};overflows=[]
    for stem,n in stems:
        d=fitz.open((R.parent.parent/'hoofdstukken'/R.name)/(stem+'.pdf'));check('PDF page count '+stem,len(d)==n)
        maps=read(stem+'_page_map.json');check('No layout overflow '+stem,all(x['designed_pages']==[x['pdf_page']] for x in maps))
        text='\n'.join(p.get_text() for p in d);texts[stem]=text
        check('No replacement glyph '+stem,'\ufffd' not in text and '\u25a0' not in text)
        for i,p in enumerate(d,1):
            check(f'Nonblank {stem}/{i}',len(p.get_text().strip())>100)
            for b in p.get_text('dict')['blocks']:
                if b['type']!=0:continue
                for l in b['lines']:
                    for s in l['spans']:
                        x0,y0,x1,y1=s['bbox']
                        if x0<1 or y0<1 or x1>p.rect.width-1 or y1>p.rect.height-1:overflows.append([stem,i,s['text'],s['bbox']])
        for item in d.get_toc():check('Bookmark '+stem+' '+item[1],1<=item[2]<=len(d))
        for p in d:
            for link in p.get_links():
                if link['kind']==fitz.LINK_GOTO:check('Internal link '+stem,0<=link.get('page',-1)<len(d))
    check('No text outside physical page',not overflows,overflows)
    student=texts[stems[0][0]];answers=texts[stems[1][0]]
    for e in ex:
        number=e['number'];check(f'Exercise rendered {number}',re.search(rf'Opgave {number}\s*·',student) is not None)
        check(f'Answer rendered {number}',re.search(rf'Opgave {number}\s*·',answers) is not None)
    with fitz.open((R.parent.parent/'hoofdstukken'/R.name)/(stems[0][0]+'.pdf')) as d:
        check('Facing target sources/questions 36–37','Bron A' in d[35].get_text() and 'Opgave 37' in d[36].get_text())
    for le in read('lesson_minutes.json'):check(le['paragraph']+' complete route estimate',sum(le['components'].values())==le['total'] and (not le['normal_route'] or le['components']['begeleid']>0))
    check('Outline provenance unchanged',sha(R/'sources/book-1-outline-second-edition-v1.md')==json.loads((R/'sources/source-register.json').read_text(encoding='utf8'))['outline']['sha256'])
    bad=[x for x in CHECKS if not x['pass']]
    result={'scope':'local arithmetic, figure geometry, exercise coverage and PDF structure; no classroom validation or independent external review','checks':len(CHECKS),'passed':len(CHECKS)-len(bad),'failed':len(bad),'failures':bad,'results':CHECKS}
    (R/'QA/validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2), encoding='utf8', newline='\n')
    print(f"Local checks: {len(CHECKS)-len(bad)}/{len(CHECKS)} passed; failures: {len(bad)}")
    for b in bad:print(b)
    if bad:raise SystemExit(1)
if __name__=='__main__':main()
