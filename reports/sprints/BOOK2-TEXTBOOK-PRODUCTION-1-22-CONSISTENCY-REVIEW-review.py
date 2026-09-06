"""Independent bounded semantic/DOM/geometry review; stdout evidence only.

No author predicates are imported. Shared prepare_html is read-only in memory;
no build_document, write_pdf, rasterizer or assembly worker is invoked.
"""
from pathlib import Path
from fractions import Fraction as F
import base64, hashlib, json, re, sys, io
sys.dont_write_bytecode=True
P=Path(__file__).resolve().parents[2]
# Windows long-path prefix is DATA-only; script, cwd and runtime stay ordinary.
L=Path('\\\\?\\'+str(P.parent/'4veco-lessen'))
sys.path.insert(0,str(P/'build-scripts/content/book-2'))
from bs4 import BeautifulSoup
from PIL import Image, ImageChops
import tinycss2, print_pipeline
from weasyprint import HTML
sha=lambda b:hashlib.sha256(b).hexdigest()
pre='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-22-CONSISTENCY-REVIEW-'
baseline=json.loads((P/(pre+'baseline.json')).read_text(encoding='utf-8'))
inv=baseline['inventory']; records={x['id']:x['record'] for x in inv['targets']}
norm=lambda s:re.sub(r'\s+','',s)
def text(s):
    b=BeautifulSoup(s,'html.parser'); root=b.body or b
    for n in root.find_all(['style','script','title']):n.decompose()
    return root.get_text(' ',strip=True)
md={}; dom=[]; figures=[]; negatives=[]; probes=[]
for entry in inv['sources']:
    f=L/entry['path']; b=f.read_bytes(); assert sha(b)==entry['raw_sha256']
    s=b.decode('utf-8-sig'); md[f.name]=s
    candidate,assets=print_pipeline.prepare_html(s,f)
    h=f.with_suffix('.html'); actual=h.read_text(encoding='utf-8-sig')
    assert norm(text(candidate))==norm(text(actual)),f.name+' complete visible DOM'
    expected=BeautifulSoup(candidate,'html.parser'); actual_dom=BeautifulSoup(actual,'html.parser')
    ei=expected.find_all('img'); ai=actual_dom.find_all('img'); assert len(ei)==len(ai)
    imgs=[]
    for x,y in zip(ei,ai):
        assert x['src']==y['src'] and x.get('alt')==y.get('alt')
        assert 0<len(y.get('alt',''))<=120
        assert y['src'].startswith('data:image/png;base64,')
        decoded=base64.b64decode(y['src'].split(',',1)[1]); assert decoded[:8]==b'\x89PNG\r\n\x1a\n'
        imgs.append({'alt':y['alt'],'alt_characters':len(y['alt']),'png_sha256':sha(decoded)})
    captions=[c.get_text(' ',strip=True) for c in actual_dom.find_all('figcaption')]
    assert captions==[c.get_text(' ',strip=True) for c in expected.find_all('figcaption')]
    dom.append({'path':entry['path'],'md_sha256':sha(b),'html_sha256':sha(h.read_bytes()),'whole_visible_text_sha256':sha(norm(text(actual)).encode()),'whole_text_characters':len(text(actual)),'images':imgs,'captions':captions,'headings':[(x.name,x.get_text(' ',strip=True)) for x in actual_dom.find_all(re.compile('^h[1-6]$'))]})
    pid=f.name[:5]
    if 'antwoorden' not in f.name:
        r=records[pid]; t=r['target_exercise']; target=s.split('## Doeloefening',1)[1].split('## Denkertje',1)[0]
        for g in r['lesson_goals']: assert g in s
        for v in [t['context']]+[q['prompt'] for q in t['subquestions']]+[x['content'] for x in t.get('sources',[])]: assert v in target,v
        if pid!='2.2.4':
            assert len(re.findall(r'^## ',s,re.M))==7
            nums=[int(x) for x in re.findall(r'\*\*Opgave (\d+)\*\*',s)]
            assert nums==list(range(1,10 if pid!='2.2.3' else 13))
            assert '## Begeleide inoefening' in s and 'Heb je deze hulp niet nodig?' in s
        else:
            assert [int(n) for n in re.findall(r'\*\*Vraag \d+ \((\d+) punten\)',target)]==[2,2,2,4,2,2]
            for src in t['sources']:
                if 'rows' in src:
                    assert any([[x.get_text() for x in row.find_all(['th','td'])] for row in table.find_all('tr')]==[src['columns']]+src['rows'] for table in BeautifulSoup(target,'html.parser').find_all('table'))
        probes.append({'id':pid,'target_points':sum(q['points'] for q in t['subquestions']),'all_context_goals_sources_questions_exact':True})

for entry in inv['assets']:
    if not entry['path'].endswith('.svg'):continue
    f=L/entry['path']; s=f.read_text(encoding='utf-8'); root=BeautifulSoup(s,'xml').svg
    png=f.with_suffix('.png'); im=Image.open(png).convert('RGB'); W,H=map(float,[root['width'],root['height']]); assert im.width/W==im.height/H
    bbox=ImageChops.difference(im,Image.new('RGB',im.size,'white')).getbbox(); assert bbox and bbox[0]>0 and bbox[1]>0 and bbox[2]<im.width and bbox[3]<im.height
    title=root.title.get_text(); assert 0<len(title)<=120
    values=[]
    for rect in root.find_all('rect'):
        if rect.has_attr('data-value'):
            v,scale,zero=map(float,[rect['data-value'],rect['data-scale'],rect['data-zero']]); assert abs(float(rect['width'])-abs(v)*scale)<1e-6
            assert abs(float(rect['x'])-(zero+min(v,0)*scale))<1e-6;values.append(v)
        if rect.has_attr('data-p'):
            p,q=map(float,[rect['data-p'],rect['data-q']]); sx=float(rect.get('data-sx',3));sy=float(rect.get('data-sy',16));oy=float(rect.get('data-origin-y',630))
            assert abs(float(rect['width'])-q*sx)<1e-6 and abs(float(rect['height'])-p*sy)<1e-6 and abs(float(rect['y'])-(oy-p*sy))<1e-6
            if rect.has_attr('data-to'):assert float(rect['data-to'])==p*q
            values.append({'P':p,'Q':q,'TO_derived':p*q})
    if f.stem=='2.2.3_fig_2':
        assert [(float(c['cx']),c.get('fill')) for c in root.find_all('circle')]==[(230,'#182b3a'),(500,'#182b3a'),(770,'#182b3a'),(365,'white'),(635,'white')]
        assert '0 < Ei < 1' in root.get_text() and 'geen categorie' in root.get_text()
    if f.stem in ['2.2.4_ex_1','2.2.4_ex_2']:
        assert not re.search(r'2000|2\.000|1\.760|1000|1\.000|900|−12%|−10%',root.get_text()),'source answer leakage'
    figures.append({'path':entry['path'],'svg_sha256':sha(f.read_bytes()),'png_sha256':sha(png.read_bytes()),'native_size':im.size,'ink_bbox':bbox,'title':title,'intrinsic_min_font_px':min(float(t['font-size']) for t in root.find_all('text') if t.get_text()),'verified_values':values,'chapter_placed_font':'NOT_RENDERED'})

front=P/'build-scripts/content/book-2/22/front.html'; cssfile=front.with_name('front.css'); fs=front.read_text(encoding='utf-8'); css=cssfile.read_text(encoding='utf-8')
goals=[g for n in range(1,4) for g in records[f'2.2.{n}']['lesson_goals']]
titles=[]
for n in range(1,5):
    name=next(k for k in md if k.startswith(f'2.2.{n}') and 'antwoorden' not in k)
    title=md[name].splitlines()[0][2:]; title=re.sub(r' – opgaven$','',title); titles.append(title)
def front_contract(s):
    soup=BeautifulSoup(s,'html.parser'); root=soup.select_one('div.chapter-front'); assert root
    assert len(soup.find_all('div'))==1
    assert [x.get_text() for x in root.select('ul > li')]==goals,'goal order/content'
    assert [' '.join(c.get_text() for c in tr.find_all('td')) for tr in root.select('tbody tr')]==titles,'canonical pupil titles'
    assert [x.name for x in root.children if getattr(x,'name',None)]==['h1','h2','table','h2','p','ul','h2','p']
    assert root.h1.get_text()=='Hoofdstuk 2.2 — Elasticiteit'
    assert not soup.find(['a','img','script','iframe','style'])
    assert all(not any(a.startswith('on') or a in ['hidden','style'] for a in x.attrs) for x in soup.find_all(True))
    intro=root.find_all('p',recursive=False)[-1].get_text(); assert len(re.findall(r'[.?](?:\s|$)',intro))==4
    assert 'Levert dat meer omzet op?' in intro and 'andere factoren gelijk' in intro and 'die de gegevens werkelijk dragen' in intro
    return intro
def reject(label,fn):
    try:fn()
    except (AssertionError,ValueError):negatives.append(label)
    else:raise AssertionError('counterexample accepted: '+label)
reject('CURRENT_F1 canonical title differs from actual pupil H1',lambda:front_contract(fs))
# This is an in-memory expected repair fixture, NEVER an adopted source or verdict.
fixed=fs.replace('kruiselingse','kruislingse'); intro=front_contract(fixed)
for i,g in enumerate(goals):
    reject(f'goal {i+1} missing',lambda g=g:front_contract(fixed.replace('<li>'+g+'</li>','')))
    reject(f'goal {i+1} misleading meaning',lambda g=g:front_contract(fixed.replace(g,g.replace('Je kunt','Je beheerst altijd'))))
for title in titles:
    t=title[6:];reject('misleading title '+title,lambda t=t:front_contract(fixed.replace(t,'Ander onderwerp')))
reject('missing fixed-other-factors introduction',lambda:front_contract(fixed.replace('andere factoren gelijk','alle variabelen tegelijk')))
reject('hidden retained goals',lambda:front_contract(fixed.replace('<ul>','<ul hidden>')))
reject('external help requirement',lambda:front_contract(fixed.replace('</div>','<a href="https://invalid.example">Hulp</a></div>')))
def style_contract(s):
    rules=tinycss2.parse_stylesheet(s,skip_comments=True,skip_whitespace=True)
    for r in rules:
        assert r.type=='qualified-rule'
        for sel in tinycss2.serialize(r.prelude).split(','):assert re.fullmatch(r'\.chapter-front(?: (?:h1|h2|p|table|th|td|ul|li))?',sel.strip())
        for d in tinycss2.parse_declaration_list(r.content,skip_comments=True,skip_whitespace=True):
            assert d.type=='declaration' and not d.important
            assert d.lower_name in ['font-size','line-height','margin','padding','padding-bottom','padding-left','margin-bottom']
            vs=[v for v in d.value if v.type!='whitespace'];assert all(v.type in ['number','dimension'] and v.value>=0 for v in vs)
            if d.lower_name=='font-size':assert len(vs)==1 and vs[0].type=='dimension' and vs[0].lower_unit=='pt' and vs[0].value>=12
            if d.lower_name=='line-height':assert len(vs)==1 and vs[0].type=='number' and vs[0].value>=1.15
style_contract(css)
for label,bad in [('font unit px not pt',css.replace('12pt','12px')),('global secondary selector',css+'\np {font-size:12pt}'),('hidden text',css+'\n.chapter-front li {display:none}'),('negative inset',css+'\n.chapter-front p {margin:-2mm}'),('adjacent outside selector',css.replace('.chapter-front p','.chapter-front + p')),('lookalike class',css.replace('.chapter-front','.chapter-frontier')),('opaque important',css.replace('12pt','12pt !important')),('compressed leading',css.replace('1.18','1.0'))]:reject(label,lambda bad=bad:style_contract(bad))

# Selected actual source clauses are challenged independently of full-byte pins.
clauses=[('221p','Gebruik voor beide percentages de oude waarde als noemer.'),('221p','Vergelijk die grootte met **1**, niet het negatieve getal zelf.'),('221p','geen conclusies die de vier\nwaarnemingen bewijzen'),('222p','Een gemeten\n> Ev over een hele prijsstap hoeft niet overal langs die stap gelijk te zijn.'),('222p','Heb je oude en nieuwe P en Q? Bereken dan altijd beide omzetten rechtstreeks.'),('222p','De prijsfactor is 1,5 en de afzetfactor 0,6:'),('223p','Bij **Ei=0** en **Ei=1** kennen we hier geen categorie toe'),('223p','**Ek = %ΔQv van X / %ΔP van Z**. Noem altijd beide goederen.'),('223p','Je deelt Y dus niet door 12.'),('223a','Herstel eerst Y=30.000 en houd Px=10 vast.'),('224o','Bron E beschrijft een afzonderlijk regionaal'),('224a','Een controleberekening van Ev is niet gevraagd.'),('224a','geen extra Ei- of Ek-berekening en geen Pc-verandering gevraagd.'),('224a','minstens twee bronnen'),('224a','precies de twee genoemde niet-bewezen conclusies')]
short={k[:5].replace('.','')+('a' if 'antwoorden' in k else 'o' if 'opgaven' in k else 'p'):v for k,v in md.items()}
for label,clause in clauses:
    assert clause in short[label],(label,clause)
    for kind,replacement in [('missing',''),('misleading','Deze uitspraak geldt altijd zonder voorwaarden.')]:
        mutant=short[label].replace(clause,replacement)
        reject(label+' '+kind+' '+clause[:45],lambda mutant=mutant,clause=clause: (_ for _ in ()).throw(AssertionError()) if clause not in mutant else None)

ledger=[]
def pct(old,new):return (F(str(new))-F(str(old)))/F(str(old))*100
cases=[('fruitbox',10,11,100,95),('oefenruimte',10,11,100,80),('Bowlplein',8,10,200,180),('fietsreparatie',20,22,100,95),('arcade',5,6,200,140),('zwembad',5,4,200,220),('skatehal',10,12,400,280),('Nova 221/222',10,12,500,420),('speelgoed',5,5.5,100,95),('koffie',5,5.5,100,80),('atelier/schaatsbaan',10,11,100,95),('stripbeurs',10,11,100,80),('concert/verrekijker',10,15,100,60),('museum',4,4.4,100,95),('laser',4,4.4,100,80),('badminton',10,9,100,120),('fotoclub',2,3,10,6),('dans',10,12,200,180),('puzzel',10,12,200,120),('benefiet',20,30,100,60),('StreamNow',20,22,1000,800),('vulpen',10,12,100,90),('telescoop',20,22,100,80),('StreamPlus',10,12,50000,43000)]
for name,p0,p1,q0,q1 in cases:
    dp,dq=pct(p0,p1),pct(q0,q1); ev=dq/dp; t0,t1=F(str(p0))*q0,F(str(p1))*q1;dt=(t1-t0)/t0*100
    assert (1+dp/100)*(1+dq/100)==t1/t0
    ledger.append({'case':name,'inputs':[p0,p1,q0,q1],'P_percent':str(dp),'Q_percent':str(dq),'Ev':str(ev),'TO':[str(t0),str(t1)],'TO_percent':str(dt)})
    assert dt!=dp+dq,'cross-product term cannot disappear for these cases'
    assert dq/dp!=dp/dq,'inverted ratio must differ in these selected cases'
functions=[('tekenles',80,-2,1,'0.005',20,10,30000,36000,14,[200,230,204]),('naaicursus',90,-2,'0.5','0.005',20,20,20000,24000,24,[160,180,162]),('keramiek',120,-2,1,'0.004',15,10,25000,30000,15,[200,220,205]),('taal',90,-2,1,'0.005',10,10,20000,24000,14,[180,200,184]),('fitness target',100,-2,'0.5','0.01',10,20,30000,33000,24,[390,420,392]),('Sterrenplek',100,-2,1,'0.005',10,20,20000,24000,24,[200,220,204]),('region StreamPlus',12000,-400,300,'0.1',12,10,40000,42000,None,[14200,14400,None])]
for name,a,b,c,d,x,z,y,y1,z1,expected in functions:
    a,b,c,d,x,z,y,y1=map(lambda v:F(str(v)),[a,b,c,d,x,z,y,y1]); f=lambda Y,Z:a+b*x+c*Z+d*Y
    q,qy,qz=f(y,z),f(y1,z),f(y,F(str(z1))) if z1 is not None else None
    assert [q,qy,qz]==expected
    e=(qy-q)/q/((y1-y)/y)
    assert e!=d and f(y/12,z)!=q
    if z1 is not None:assert f(y1,F(str(z1)))!=qz
    ledger.append({'case':name,'Q':[str(q),str(qy),str(qz)],'Ei_derived':str(e),'target_Ei_required':name!='region StreamPlus','fixed':'own and other price for Y; original Y and own price after reset','annual_income_preserved':True})
ratio_cases=[('maaltijd',8,5,F(8,5)),('noedel',-3,5,F(-3,5)),('thee/koffie',4,10,F(2,5)),('filter/koffie',-6,10,F(-3,5)),('Premium',15,8,F(15,8)),('Budget',-4,8,F(-1,2)),('StreamPlus/concurrent',5,F(25,2),F(2,5)),('filter/telescoop',-10,20,F(-1,2)),('cacao',12,8,F(3,2)),('budgetcacao',-4,8,F(-1,2)),('controller',-8,20,F(-2,5))]
for name,q,d,e in ratio_cases:assert F(q)/d==e;ledger.append({'case':name,'ratio':f'{q}/{d}','result':str(e)})
def ei(e):return 'inferieur' if e<0 else 'normaal' if 0<e<1 else 'luxe' if e>1 else 'grens'
assert [ei(F(x)) for x in ['-0.5','0','0.5','1','1.875']]==['inferieur','grens','normaal','grens','luxe']
ledger += [{'case':'base reversal','rise':str(pct(20,25)),'fall':str(pct(25,20))},{'case':'combined model','baseline':200,'Y_only':220,'Pc_only':204,'both':224,'income_is_20_not_24':True},{'case':'profit counterexample','TO':[5000,5040],'TK':[4000,4100],'profit':[1000,940],'higher_TO_not_higher_profit':True}]
assert sha((P/'build-scripts/content/book-2/print_pipeline.py').read_bytes())=='51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5'
print_pipeline.CSS+='\n'+css
html,assets=print_pipeline.prepare_html(fs,front);assert not assets
document=HTML(string=html).render();boxes=[]
for i,page in enumerate(document.pages,1):
    for b in page._page_box.descendants():
        if hasattr(b,'text') and b.text.strip():
            pt=b.style['font_size']*.75; assert pt>=12-1e-6
            assert b.position_x>=0 and b.position_y>=0 and b.position_x+b.width<=page.width+1e-6 and b.position_y+b.height<=page.height+1e-6
            boxes.append({'page':i,'text':b.text,'pt':pt,'box':[b.position_x,b.position_y,b.width,b.height]})
assert len(document.pages)==1
print(json.dumps({'verdict':'REVISE','finding':'F22-FRONT-TITLE-01','front_sha256':sha(front.read_bytes()),'css_sha256':sha(cssfile.read_bytes()),'canonical_titles':titles,'goals':goals,'intro':intro,'documents':dom,'target_checks':probes,'figures':figures,'negative_cases':negatives,'math_ledger':ledger,'layout_memory_only':{'pages':1,'boxes':boxes,'minimum_pt':min(b['pt'] for b in boxes)},'native_writes':0,'personal_chapter_views':0,'assembly_release':False},ensure_ascii=False,indent=2))
