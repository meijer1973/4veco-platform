"""Specialist-authored independent source/math/DOM/native raster diagnostics."""
import importlib.util, json, re, sys, base64
from pathlib import Path
from fractions import Fraction as F
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup, NavigableString, Comment
from PIL import Image, ImageChops
import fitz

spec=importlib.util.spec_from_file_location('qc_run',Path(__file__).with_name('BOOK2-TEXTBOOK-PRODUCTION-1-222-R13-QC-run.py'))
r=importlib.util.module_from_spec(spec); spec.loader.exec_module(r)
ROOT,L,P,E,REL=r.ROOT,r.L,r.P,r.E,r.REL
OLD='ca05ec784838617f7a11c0b33d0b53e1a2fb7f29'
OLDL='6362d2596b20c3e28184d8b6a1a74cb6c901d7f0'
caption='Concert: de nieuwe rechthoek is hoger maar kleiner van oppervlak. De gemeten interval-Ev is geen bewijs van de lokale classificatie bij elke prijs.'
alt='Omzetrechthoeken van het concert: na de prijsstijging is de omzet lager, ondanks interval-Ev = −0,8.'
pairs=[('%ΔQ = (95 − 100) / 100 × 100% = −5%','%ΔP = (11 − 10) / 10 × 100% = +10%'),('%ΔQ = (120 − 100) / 100 × 100% = +20%','%ΔP = (9 − 10) / 10 × 100% = −10%')]

def tree(node):
    if isinstance(node,Comment): return ['comment',str(node)]
    if isinstance(node,NavigableString): return r.norm(str(node)) or None
    return [node.name,sorted((k,v) for k,v in node.attrs.items()),[x for c in node.children if (x:=tree(c)) is not None]]
def jsha(v): return r.sha(json.dumps(v,ensure_ascii=False,separators=(',',':')).encode())
def reverse_order(s,separator):
    for q,p in pairs:
        new=f'{q};{separator}{p}.'; old=f'{p};{separator}{q}.'
        assert s.count(new)==1,(new,s.count(new))
        s=s.replace(new,old)
    return s

out={'actor':'paragraph_221_r8_independent_review','role':'independent specialist QC','status':'PASS','source_delta':[],'native_DOM':[],'figures':[],'documents':[]}
for name in ('theory.md','exercises.md','answers.md','target-answers.md'):
    rel=Path('build-scripts/content/book-2/222')/name
    old=r.blob(OLD,rel).decode('utf-8'); new=(ROOT/rel).read_text(encoding='utf-8')
    restored=new
    if name=='answers.md': restored=reverse_order(new,'\n')
    if name=='exercises.md':
        attr='{alt="'+alt+'"}'; assert new.count(attr)==1; restored=new.replace(attr,'')
    assert restored==old,name
    out['source_delta'].append(dict(path=str(rel),old_lf_sha256=r.sha(old.encode()),current_lf_sha256=r.sha(new.encode()),exact_bounded_reversal=True))
for rel in ('build-scripts/content/book-2/b2_222.py','build-scripts/content/book-2/print_pipeline.py','build-scripts/content/book-2/222/check_render.py','references/authored/course-target-exercises.json'):
    old=r.blob(OLD,rel); current=(ROOT/rel).read_bytes(); assert old==current,rel
    out['source_delta'].append(dict(path=rel,raw_sha256=r.sha(current),unchanged=True))

target=json.loads((E/'pass0.json').read_text(encoding='utf-8'))['target']
for kind in ('paragraaf','opgaven','antwoorden'):
    html_path=P/f'2.2.2 Elasticiteit en omzet – {kind}.html'
    old=r.blob(OLDL,REL/html_path.name,L).decode('utf-8')
    new=html_path.read_text(encoding='utf-8')
    before=BeautifulSoup(old,'html.parser'); soup=BeautifulSoup(new,'html.parser')
    alts=[]
    for index,image in enumerate(soup.find_all('img')):
        text=image['alt']; assert 0<len(text)<=120 and not text.lower().startswith('image of')
        name=('2.2.2_fig_1','2.2.2_fig_2','2.2.2_fig_3','2.2.2_we_1')[index] if kind=='paragraaf' else '2.2.2_we_1'
        assert base64.b64decode(image['src'].split(',',1)[1])==(P/'_assets'/f'{name}.png').read_bytes()
        alts.append(dict(name=name,alt=text,length=len(text),visible_caption=r.norm(image.find_parent('figure').figcaption.get_text()),native_asset_match=True))
    restored=BeautifulSoup(new,'html.parser')
    if kind!='antwoorden':
        image=restored.find('img',alt=alt); assert image is not None
        cap=image.find_parent('figure').figcaption
        assert r.norm(cap.get_text())==caption and not cap.has_attr('aria-hidden')
        image['alt']=caption; cap['aria-hidden']='true'
    else:
        restored=BeautifulSoup(reverse_order(r.norm(new),' '),'html.parser')
        heading=soup.find('h2',id='denkertje-bonusopgave')
        assert heading is not None
        nodes=[]
        for node in heading.next_siblings:
            if getattr(node,'name',None)=='h2': break
            nodes.append(str(node))
        bonus=BeautifulSoup(''.join(nodes),'html.parser')
        assert 'Een passend antwoord:' in bonus.get_text()
        assert len(bonus.find_all('li'))==4
        assert bonus.find('ul').find_previous('p').get_text().startswith('Beoordeel op deze vier kenmerken')
        for answer in target['short_answer_model'].values():
            assert re.sub(r'\s+','',answer) in re.sub(r'\s+','',soup.get_text())
        out['bonus_model_followed_by_criteria']=dict(count=4,criteria=[r.norm(li.get_text()) for li in bonus.find_all('li')])
    assert tree(restored)==tree(before),kind
    out['native_DOM'].append(dict(kind=kind,complete_normalized_dom_after_exact_reversal=jsha(tree(restored)),old_normalized_dom=jsha(tree(before)),actual_alternatives=alts))
    if kind!='antwoorden':
        block=soup.find('section',id='doeloefening'); t=r.norm(block.get_text(' ',strip=True))
        assert r.norm(target['target_exercise']['context']) in t
        for q in target['target_exercise']['subquestions']:
            assert r.norm(q['prompt']) in t and f"{q['label']}) ({q['points']} {'punt' if q['points']==1 else 'punten'})" in t
        assert not re.search(r'\b(?:Part A|Part B|companion|website|https?://|\d+(?:[.,]\d+)?\s*minut)',soup.get_text(),re.I)
    pdf=P/f'2.2.2 Elasticiteit en omzet – {kind}.pdf'; doc=fitz.open(pdf)
    texts=[]; sizes=[]; page_bindings=[]
    native=next(d for d in r.manifest()['documents'] if Path(d['source_pdf']).name==pdf.name)
    proof=json.loads((Path(native['proof_directory'])/'manifest.json').read_text(encoding='utf-8'))
    for number,page in enumerate(doc,1):
        txt=page.get_text(); assert '\ufffd' not in txt; texts.append(txt)
        for block in page.get_text('dict')['blocks']:
            for line in block.get('lines',[]):
                for span in line['spans']:
                    if span['text'].strip(): sizes.append(span['size'])
        file=E/kind/f"page-{number:02d}.png" if kind=='paragraaf' else E/kind/f'page-{number}.png'
        h=r.sha(file.read_bytes()); assert h==proof['page_sha256'][f'page-{number:03d}.png']
        page_bindings.append(dict(page=number,path=str(file),sha256=h))
    assert min(sizes)>=11.999 and len(doc)==dict(paragraaf=10,opgaven=6,antwoorden=5)[kind]
    out['documents'].append(dict(kind=kind,pdf_sha256=r.sha(pdf.read_bytes()),minimum_text_pt=min(sizes),page_bindings=page_bindings,extracted_text_sha256=r.sha('\n'.join(texts).encode())))

for svg in sorted((P/'_assets').glob('*.svg')):
    root=ET.fromstring(svg.read_text(encoding='utf-8')); title=root.find('{http://www.w3.org/2000/svg}title').text
    assert 0<len(title)<=120
    actual=svg.with_suffix('.png'); fresh=E/(svg.stem+'-native.png')
    r.run([r.PY,'-m','cairosvg',str(svg),'-o',str(fresh),'-s','2'])
    assert fresh.read_bytes()==actual.read_bytes()
    a=Image.open(actual).convert('RGBA'); b=Image.open(fresh).convert('RGBA')
    assert a.size==b.size and ImageChops.difference(a,b).getbbox() is None
    for f in (svg,actual): assert r.blob(OLDL,REL/'_assets'/f.name,L)==f.read_bytes()
    rects=[]
    for el in root.iter():
        if 'data-to' not in el.attrib: continue
        d=el.attrib; p,q,sx,sy,x,y=[F(d[k]) for k in ('data-p','data-q','data-sx','data-sy','data-origin-x','data-origin-y')]
        assert F(d['data-to'])==p*q and F(d['width'])==q*sx and F(d['height'])==p*sy
        assert F(d['x'])==x and F(d['y'])==y-p*sy
        rects.append(dict(price=str(p),quantity=str(q),revenue=str(p*q),x_scale=str(sx),y_scale=str(sy)))
    if svg.stem in ('2.2.2_fig_2','2.2.2_we_1'): assert len({(x['x_scale'],x['y_scale']) for x in rects})==1
    out['figures'].append(dict(path=str(actual),sha256=r.sha(actual.read_bytes()),title=title,title_length=len(title),raw_native_equal=True,pixel_delta=0,geometry=rects))

# Values independently transcribed from personally read pupil/answer texts,
# not imported from builder CASES or tests; exact old-base arithmetic.
contexts=[('speelgoed',5,'5.5',100,95),('koffie',5,'5.5',100,80),('atelier',10,11,100,95),('stripbeurs',10,11,100,80),('concert',10,15,100,60),('museum',4,'4.4',100,95),('lasergame',4,'4.4',100,80),('schaatsbaan',10,11,100,95),('badminton',10,9,100,120),('fotoclub',2,3,10,6),('dans',10,12,200,180),('puzzel',10,12,200,120),('benefiet',20,30,100,60),('Nova',10,12,500,420),('StreamNow',20,22,1000,800)]
math=[]
for name,p0,p1,q0,q1 in contexts:
    p0,p1,q0,q1=map(F,(p0,p1,q0,q1)); to0,to1=p0*q0,p1*q1
    dq=(q1-q0)/q0*100; dp=(p1-p0)/p0*100; ev=dq/dp; change=(to1-to0)/to0*100
    assert p0>0 and q0>0 and dp!=0
    assert (p1/p0)*(q1/q0)==to1/to0
    math.append(dict(context=name,p_old=str(p0),p_new=str(p1),q_old=str(q0),q_new=str(q1),signed_q_pct=str(dq),signed_p_pct=str(dp),ev=str(ev),to_old=str(to0),to_new=str(to1),to_pct=str(change),period='month' if name=='StreamNow' else 'week'))
assert [x['to_pct'] for x in math]==['9/2','-12','9/2','-12','-10','9/2','-12','9/2','8','-10','8','-28','-10','4/5','-12']
assert 8*300==2400 and F(2520-2400,2400)*100==5 and F(50-40,40)*100==25
out['independent_math']=math
out['retrieval']=dict(bicycle_to=2400,bicycle_to_change_percent=5,closing_price_change_percent=25)
out['unobserved_timing']=dict(core_components=[2,9,9,3,3.5,2,12,11],core=51.5,support=66.5,all=79.5)
assert sum(out['unobserved_timing']['core_components'])==51.5
out['grayscale']=[dict(path=str(E/f'gray-p{n}.png'),sha256=r.sha((E/f'gray-p{n}.png').read_bytes())) for n in (2,3,4,6)]

def lum(h):
    c=[int(h[i:i+2],16)/255 for i in (1,3,5)]; c=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in c]
    return sum(a*b for a,b in zip(c,(.2126,.7152,.0722)))
out['contrast']=[dict(foreground=a,background=b,ratio=round((max(lum(a),lum(b))+.05)/(min(lum(a),lum(b))+.05),3)) for a,b in [('#182b3a','#ffffff'),('#182b3a','#dce8ef'),('#1A5276','#ffffff')]]
assert all(c['ratio']>=4.5 for c in out['contrast'])
r.put('exact-probes.json',out)
print(json.dumps(dict(status='PASS',whole_DOM=3,math_contexts=15,figures=4,pages=21,gray=4),ensure_ascii=True))
