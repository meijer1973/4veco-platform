"""Reviewer-derived R13 exact deltas, all-page bindings and rational checks."""
import importlib.util, json, re, xml.etree.ElementTree as ET
from pathlib import Path
from fractions import Fraction as F
from bs4 import BeautifulSoup, NavigableString, Tag
from PIL import Image, ImageChops
spec=importlib.util.spec_from_file_location('runner',Path(__file__).with_name('BOOK2-TEXTBOOK-PRODUCTION-1-222-R13-review-run.py'))
r=importlib.util.module_from_spec(spec); spec.loader.exec_module(r)
norm=lambda s:re.sub(r'\s+',' ',s).strip()
result={'status':'PASS','visual_acceptance':'NOT_SUPPLIED_BY_THIS_SCRIPT','source_delta':{},'html':[],'assets':[],'pages':[],'arithmetic':[]}
caption='Concert: de nieuwe rechthoek is hoger maar kleiner van oppervlak. De gemeten interval-Ev is geen bewijs van de lokale classificatie bij elke prijs.'
alt='Omzetrechthoeken van het concert: na de prijsstijging is de omzet lager, ondanks interval-Ev = −0,8.'
pairs=[('b) Schaatsbaan: ','%ΔQ = (95 − 100) / 100 × 100% = −5%','%ΔP = (11 − 10) / 10 × 100% = +10%'),
       ('Badmintonhal: ','%ΔQ = (120 − 100) / 100 × 100% = +20%','%ΔP = (9 − 10) / 10 × 100% = −10%')]
def reorder(s,normalized=False):
    for label,q,p in pairs:
        old=f'{label}{p};\n{q}.'; new=f'{label}{q};\n{p}.'
        if normalized: old,new=norm(old),norm(new)
        assert s.count(old)==1,(label,s[:200]); s=s.replace(old,new)
    return s
for name in ('theory.md','exercises.md','answers.md','target-answers.md'):
    path=Path('build-scripts/content/book-2/222')/name
    old=r.blob(r.OLD,path).decode('utf-8'); new=(r.ROOT/path).read_text(encoding='utf-8')
    expected=old
    if name=='answers.md': expected=reorder(old)
    if name=='exercises.md':
        anchor=f'![{caption}](_assets/2.2.2_we_1.svg)'; assert old.count(anchor)==1
        expected=old.replace(anchor,anchor+'{alt="'+alt+'"}')
    assert expected==new,name
    result['source_delta'][name]={'old':r.sha(old.encode()),'new':r.sha(new.encode()),'exact_allowed_transformation':True}
for path in ['build-scripts/content/book-2/b2_222.py','build-scripts/content/book-2/print_pipeline.py','build-scripts/content/book-2/222/check_render.py','references/authored/course-target-exercises.json']:
    assert r.blob(r.OLD,path)==(r.ROOT/path).read_bytes(),path
    result['source_delta'][path]={'byte_identical_R12':True,'sha256':r.sha((r.ROOT/path).read_bytes())}
def tree(n,answer_old=False):
    if isinstance(n,NavigableString):
        s=norm(str(n))
        if answer_old:
            # Bold ratios split the two cases across distinct native text nodes.
            for label,q,p in pairs:
                before=norm(f'{label}{p};\n{q}.'); after=norm(f'{label}{q};\n{p}.')
                if before in s:
                    assert s.count(before)==1
                    s=s.replace(before,after)
        return s or None
    if isinstance(n,Tag): return [n.name,sorted(n.attrs.items()),[v for child in n.children if (v:=tree(child,answer_old)) is not None]]
for kind in ('paragraaf','opgaven','antwoorden'):
    path=r.REL/f'2.2.2 Elasticiteit en omzet – {kind}.html'
    old=BeautifulSoup(r.blob(r.OLDL,path,r.LESSONS),'html.parser')
    new=BeautifulSoup((r.LESSONS/path).read_bytes(),'html.parser')
    capsold=[norm(x.get_text()) for x in old.find_all('figcaption')]
    capsnew=[norm(x.get_text()) for x in new.find_all('figcaption')]
    assert capsold==capsnew
    delta=[]
    tagsold=old.find_all(True); tagsnew=new.find_all(True); assert len(tagsold)==len(tagsnew)
    for a,b in zip(tagsold,tagsnew):
        assert a.name==b.name
        if a.attrs!=b.attrs: delta.append({'tag':a.name,'old_attributes':{k:v for k,v in a.attrs.items() if b.attrs.get(k)!=v},'new_attributes':{k:v for k,v in b.attrs.items() if a.attrs.get(k)!=v}})
    if kind!='antwoorden':
        assert delta==[{'tag':'img','old_attributes':{'alt':caption},'new_attributes':{'alt':alt}},
                       {'tag':'figcaption','old_attributes':{'aria-hidden':'true'},'new_attributes':{}}],delta
        img=old.find('img',alt=caption); img['alt']=alt
        del img.find_parent('figure').figcaption['aria-hidden']
        assert len(caption)==147 and len(alt)==100
    else: assert delta==[] and len(new.find_all('br'))==3
    assert tree(old,kind=='antwoorden')==tree(new),kind
    actual=[dict(alt=x['alt'],length=len(x['alt'])) for x in new.find_all('img')]
    assert all(x['length']<=120 for x in actual)
    result['html'].append(dict(kind=kind,exact_attribute_delta=delta,all_captions=capsnew,all_actual_alts=actual,
      normalized_complete_DOM_equal_after_only_named_reversal=True,normalized_DOM_sha256=r.sha(json.dumps(tree(new),ensure_ascii=False).encode())))
for path in sorted((r.PAR/'_assets').glob('*.svg')):
    assert r.blob(r.OLDL,path.relative_to(r.LESSONS),r.LESSONS)==path.read_bytes()
    png=path.with_suffix('.png'); assert r.blob(r.OLDL,png.relative_to(r.LESSONS),r.LESSONS)==png.read_bytes()
    svg=ET.fromstring(path.read_bytes()); title=svg.find('{http://www.w3.org/2000/svg}title').text; assert len(title)<=120
    fresh=r.E/(path.stem+'-native.png'); r.run([r.PY,'-m','cairosvg',str(path),'-o',str(fresh),'-s','2'])
    assert fresh.read_bytes()==png.read_bytes()
    a=Image.open(fresh).convert('RGBA'); b=Image.open(png).convert('RGBA'); assert a.size==b.size and ImageChops.difference(a,b).getbbox() is None
    geometry=[]
    for el in svg.iter():
        if 'data-to' not in el.attrib: continue
        d=el.attrib; p,q,sx,sy,x,y=[F(d[k]) for k in ['data-p','data-q','data-sx','data-sy','data-origin-x','data-origin-y']]
        assert F(d['data-to'])==p*q and F(d['width'])==q*sx and F(d['height'])==p*sy and F(d['x'])==x and F(d['y'])==y-p*sy
        geometry.append(d)
    if path.stem.endswith(('fig_2','we_1')): assert len({(x['data-sx'],x['data-sy']) for x in geometry})==1
    result['assets'].append(dict(name=path.name,title=title,title_length=len(title),svg_sha256=r.sha(path.read_bytes()),png_sha256=r.sha(png.read_bytes()),native_byte_equal=True,pixel_maximum_delta=0,exact_rectangle_geometry=geometry))
oldmanifest=json.loads(r.blob(r.OLD,'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-build-r12.json'))
newmanifest=r.manifest()
for od,nd in zip(oldmanifest['documents'],newmanifest['documents']):
    kind=Path(nd['source_pdf']).stem.rsplit(' – ',1)[1]
    opath=Path(od['proof_directory']); parts=opath.parts; relative=Path(*parts[parts.index('reports'):])/'manifest.json'
    om=json.loads(r.blob(r.OLD,relative)); nm=json.loads((Path(nd['proof_directory'])/'manifest.json').read_text(encoding='utf-8'))
    for i,original in enumerate(nm['rendered_pages'],1):
        files=sorted((r.E/kind).glob('page-*.png')); fresh=files[i-1]; h=r.sha(fresh.read_bytes())
        assert h==nm['page_sha256'][Path(original).name]
        oldhash=om['page_sha256'][Path(om['rendered_pages'][i-1]).name]
        assert (h!=oldhash)==(kind=='antwoorden' and i==2)
        result['pages'].append(dict(kind=kind,page=i,path=str(fresh.relative_to(r.ROOT)),sha256=h,R12_sha256=oldhash,changed=h!=oldhash))
assert len(result['pages'])==21
result['grayscale']=[dict(page=n,path=str((r.E/f'gray-p{n}.png').relative_to(r.ROOT)),sha256=r.sha((r.E/f'gray-p{n}.png').read_bytes())) for n in [2,3,4,6]]
# Independently enumerated from the complete texts, with exact decimal fractions.
rows=[('toy','5','5.5',100,95,'522.5','4.5','-.5'),('coffee','5','5.5',100,80,'440','-12','-2'),
 ('pottery','10','11',100,95,'1045','4.5','-.5'),('comic','10','11',100,80,'880','-12','-2'),
 ('concert','10','15',100,60,'900','-10','-.8'),('museum','4','4.4',100,95,'418','4.5','-.5'),
 ('laser','4','4.4',100,80,'352','-12','-2'),('skate','10','11',100,95,'1045','4.5','-.5'),
 ('badminton','10','9',100,120,'1080','8','-2'),('photo','2','3',10,6,'18','-10','-.8'),
 ('dance','10','12',200,180,'2160','8','-.5'),('puzzle','10','12',200,120,'1440','-28','-2'),
 ('charity','20','30',100,60,'1800','-10','-.8'),('Nova','10','12',500,420,'5040','.8','-.8'),
 ('StreamNow','20','22',1000,800,'17600','-12','-2')]
for name,p0,p1,q0,q1,total,pct,ev in rows:
    p0,p1=F(p0),F(p1); to0=p0*q0; to1=p1*q1; dq=F(q1-q0,q0)*100; dp=(p1-p0)/p0*100
    assert to1==F(total) and (to1-to0)/to0*100==F(pct) and dq/dp==F(ev) and p1/p0*F(q1,q0)==to1/to0
    result['arithmetic'].append(dict(context=name,TOold=str(to0),TOnew=str(to1),quantity_percentage=str(dq),price_percentage=str(dp),TO_percentage=pct,Ev=ev,period='month' if name=='StreamNow' else 'week'))
assert 8*300==2400 and F(2520-2400,2400)*100==5 and F(50-40,40)*100==25
result['retrieval']={'bicycle_TO':2400,'bicycle_TO_percent':5,'closing_P_percent':25}
result['timing']={'core':51.5,'support':66.5,'all':79.5,'observed':False}
r.put('exact-probes.json',result)
print('PASS: exact source/DOM/caption, 4 SVG titles and zero native raster delta, 21 page transitions, 15 rational contexts')
