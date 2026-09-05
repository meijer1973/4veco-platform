"""Independent exact transforms, actual DOM/page fidelity and arithmetic probes."""
import importlib.util, json, re, ast, math, base64, io, sys
from pathlib import Path
from fractions import Fraction as F
from bs4 import BeautifulSoup
from PIL import Image, ImageChops
from pypdf import PdfReader
import fitz
import xml.etree.ElementTree as ET

spec=importlib.util.spec_from_file_location('q',Path(__file__).with_name('BOOK2-TEXTBOOK-PRODUCTION-1-211-R5-QC-run.py'))
q=importlib.util.module_from_spec(spec); spec.loader.exec_module(q)
BLOCK="""**Beoordelingscriteria:**

- Je vergelijkt GVK = TVK/Q bij beide aantallen voor A en B, met euro per product als eenheid.
- Je weerlegt ‘altijd constant’ met B en koppelt A's gelijke GVK aan de gegeven € 1 aan variabele kosten per product.
- Je geeft een mogelijke verklaring voor B zonder vaste kosten toe te voegen en benoemt dat twee waarnemingen geen unieke kostenfunctie bepalen.

"""
CAPTION='Hetzelfde constante maandbedrag wordt over meer reparaties verdeeld; totalen en gemiddelden houden verschillende eenheden.'
ALT='Totalen en gemiddelden bij 100 en 200 reparaties met dezelfde constante maandkosten'
source={}; result=dict(status='PASS',automated_visual_acceptance=False,source=[],assets=[],documents=[])
for name in ('theory.md','exercises.md','answers.md','target-answers.md'):
    rel='build-scripts/content/book-2/211/'+name
    old=q.blob(q.R4P,rel); now=(q.ROOT/rel).read_bytes()
    expected=old.replace(b'## Herhaling / Herhaling en interleaving\n',BLOCK.encode()+b'## Herhaling / Herhaling en interleaving\n',1) if name=='answers.md' else old
    assert now==expected,name
    source[name]=now.decode('utf-8')
    result['source'].append(dict(path=rel,old_sha256=q.sha(old),new_sha256=q.sha(now),exact_fixed_insertion=name=='answers.md',unchanged=name!='answers.md'))
    r3=q.blob(q.R3P,rel)
    before_r5=now.replace(BLOCK.encode(),b'',1) if name=='answers.md' else now
    if name=='exercises.md':
        expected3=r3.replace(f'![{CAPTION}](_assets/2.1.1_we_1.svg)'.encode(),f'![{CAPTION}](_assets/2.1.1_we_1.svg){{alt="{ALT}"}}'.encode(),1)
        assert before_r5==expected3
    else: assert before_r5==r3,name
for rel in ('build-scripts/content/book-2/b2_211.py','build-scripts/content/book-2/print_pipeline.py','build-scripts/content/book-2/211/check_render.py','build-scripts/content/book-2/211/test_source.py'):
    assert (q.ROOT/rel).read_bytes()==q.blob(q.R4P,rel),rel
path='build-scripts/content/book-2/211/test_source.py'
def tests(raw): return {n.name:ast.dump(n,include_attributes=False) for n in ast.walk(ast.parse(raw.decode('utf-8'))) if isinstance(n,ast.FunctionDef) and n.name.startswith('test_')}
oldtests=tests(q.blob(q.R4P,path)); newtests=tests((q.ROOT/path).read_bytes())
bonus=tests((q.ROOT/'build-scripts/content/book-2/211/test_bonus.py').read_bytes())
assert len(oldtests)==13 and oldtests==newtests and len(bonus)==8
result['tests']=dict(old_bodies=13,old_AST_and_file_exact=True,new_tests=8,total=21,new_names=sorted(bonus))

# Enumerate actual SVG metadata, complete drawing bytes, native raster parity.
asset_hashes={}; ns={'s':'http://www.w3.org/2000/svg'}
for svg in sorted((q.P/'_assets').glob('*.svg')):
    raw=svg.read_bytes(); earlier=q.blob(q.R3L,svg.relative_to(q.L),q.L)
    root=ET.fromstring(raw); title=root.find('s:title',ns).text
    assert root.get('role')=='img' and root.get('aria-labelledby')=='title' and 0<len(title)<=120
    assert re.sub(br'<title[^>]*>.*?</title>',b'',raw)==re.sub(br'<title[^>]*>.*?</title>',b'',earlier)
    assert raw==q.blob(q.R4L,svg.relative_to(q.L),q.L)
    if svg.stem=='2.1.1_fig_3':
        assert title=='TVK en daarna TK toegevoegd op dezelfde schalen'
        assert raw==earlier.replace(b'Eerst TVK toevoegen en daarna TK op dezelfde schalen',title.encode())
    else: assert raw==earlier
    png=svg.with_suffix('.png'); native=q.E/'native'/png.name; gray=q.E/'grayscale'/png.name
    assert png.read_bytes()==q.blob(q.R3L,png.relative_to(q.L),q.L)==native.read_bytes()
    assert ImageChops.difference(Image.open(png).convert('RGB'),Image.open(native).convert('RGB')).getbbox() is None
    asset_hashes[q.sha(png.read_bytes())]=svg
    result['assets'].append(dict(asset=svg.stem,svg_sha256=q.sha(raw),png_sha256=q.sha(png.read_bytes()),native_sha256=q.sha(native.read_bytes()),native_pixel_delta=0,grayscale_sha256=q.sha(gray.read_bytes()),title=title,title_chars=len(title),minimum_source_font=min(float(t.get('font-size')) for t in root.findall('.//s:text',ns))))

changed_pages=[]; allalts=[]
for d in q.manifest()['documents']:
    pdf=Path(d['source_pdf']); hp=Path(d['source_html']); md=Path(d['source_md']); kind=pdf.stem.rsplit(' – ',1)[1]
    soup=BeautifulSoup(hp.read_text(encoding='utf-8'),'html.parser')
    r4=BeautifulSoup(q.blob(q.R4L,hp.relative_to(q.L),q.L).decode('utf-8'),'html.parser')
    r3=BeautifulSoup(q.blob(q.R3L,hp.relative_to(q.L),q.L).decode('utf-8'),'html.parser')
    image_rows=[]
    for image in soup.find_all('img'):
        png=base64.b64decode(image['src'].split(',',1)[1]); svg=asset_hashes[q.sha(png)]
        alt=image['alt']; caption=image.find_parent('figure').figcaption
        assert 0<len(alt)<=120 and not alt.lower().startswith('image of')
        item=dict(asset=svg.stem,alt=alt,alt_chars=len(alt),caption=q.norm(caption.get_text()),figcaption_attributes=dict(caption.attrs))
        if svg.stem=='2.1.1_we_1': assert alt==ALT and item['caption']==CAPTION and 'aria-hidden' not in caption.attrs
        image_rows.append(item); allalts.append(item)
    # Every actual native body text node must occur in exact PDF text.
    extracted=q.compact(''.join(p.get_text() for p in fitz.open(pdf)))
    nodes=[str(n) for n in soup.body.find_all(string=True) if str(n).strip() and n.parent.name not in ('style','script')]
    missing=[n for n in nodes if q.compact(n) not in extracted]
    assert not missing,(kind,missing)
    assert not re.search(r'\b(?:minuten|minuut|Part A|Part B|website|online|companion|MO\s*=\s*MK|marginale kosten|optimalis\w*)\b',soup.body.get_text(' '),re.I)
    if kind=='antwoorden':
        assert md.read_bytes().replace(BLOCK.encode(),b'',1)==q.blob(q.R4L,md.relative_to(q.L),q.L)
        label=next(p for p in soup.find_all('p') if p.get_text(strip=True)=='Beoordelingscriteria:')
        ul=label.find_next_sibling('ul'); lis=ul.find_all('li',recursive=False)
        expected=[line[2:].replace("A's","A’s") for line in BLOCK.splitlines() if line.startswith('- ')]
        assert len(lis)==3 and [q.norm(li.get_text()) for li in lis]==expected
        exercise=label.find_parent('div',class_='exercise')
        assert exercise.find('strong').get_text()=='Opgave 8'
        beforelabel=' '.join(str(n) for n in label.previous_siblings)
        assert 'kostencurve' in beforelabel and 'waarnemingen' in beforelabel and 'c)' in beforelabel
        assert q.norm(ul.find_next('h2').get_text())=='Herhaling / Herhaling en interleaving'
        result['bonus_criteria']=expected
        label.decompose(); ul.decompose()
    else:
        assert all(path.read_bytes()==q.blob(q.R4L,path.relative_to(q.L),q.L) for path in (md,hp,pdf))
    assert q.tree(soup)==q.tree(r4),kind+' full R4 DOM unexpected delta'
    if kind!='antwoorden':
        oldimages=r3.find_all('img'); newimages=soup.find_all('img')
        assert len(oldimages)==len(newimages)
        changed=0
        for oldimage,newimage in zip(oldimages,newimages):
            if newimage['alt']==ALT:
                assert len(oldimage['alt'])==122
                assert oldimage.find_parent('figure').figcaption.get('aria-hidden')=='true'
                assert q.norm(oldimage.find_parent('figure').figcaption.get_text())==CAPTION
                newimage['alt']=oldimage['alt']; newimage.find_parent('figure').figcaption['aria-hidden']='true'; changed+=1
        assert changed==1
    assert q.tree(soup)==q.tree(r3),kind+' full R3 DOM unexpected delta'
    proof=Path(d['proof_directory']); native_manifest=json.loads((proof/'manifest.json').read_text(encoding='utf-8'))
    oldpdf=q.blob(q.R4L,pdf.relative_to(q.L),q.L)
    oldproof=proof.parent/f'211-{kind}-{q.sha(oldpdf)[:12]}-r4'
    oldmanifest=json.loads((oldproof/'manifest.json').read_text(encoding='utf-8'))
    assert oldmanifest['pdf_sha256']==q.sha(oldpdf)
    fresh=sorted((q.E/kind).glob('page-*.png'),key=lambda p:int(p.stem.split('-')[-1]))
    assert len(fresh)==len(native_manifest['rendered_pages'])==len(oldmanifest['rendered_pages'])
    pages=[]
    for i,p in enumerate(fresh,1):
        name=f'page-{i:03}.png'; old=oldproof/'pages'/name
        assert q.sha(p.read_bytes())==native_manifest['page_sha256'][name]
        assert q.sha(old.read_bytes())==oldmanifest['page_sha256'][name]
        bbox=ImageChops.difference(Image.open(p).convert('RGB'),Image.open(old).convert('RGB')).getbbox()
        if bbox: changed_pages.append((kind,i))
        else: assert p.read_bytes()==old.read_bytes()
        pages.append(dict(page=i,path=str(p.relative_to(q.ROOT)),sha256=q.sha(p.read_bytes()),R4_sha256=q.sha(old.read_bytes()),byte_equal=p.read_bytes()==old.read_bytes(),pixel_delta_bbox=bbox))
    sizes=[]; placements=[]
    reader=PdfReader(pdf)
    for i,page in enumerate(reader.pages,1):
        def text_size(text,cm,tm,font,size):
            if text.strip(): sizes.append(size*math.sqrt(abs(cm[0]*cm[3]-cm[1]*cm[2])))
        def image_size(op,args,cm,tm):
            if op==b'Do': placements.append(dict(page=i,width_pt=math.hypot(cm[0],cm[1]),height_pt=math.hypot(cm[2],cm[3])))
        page.extract_text(visitor_text=text_size,visitor_operand_before=image_size)
    assert min(sizes)>=11.99
    assets=[Path(a['path']) for a in d['assets'] if a['path'].endswith('.svg')]
    assert len(placements)==len(assets)
    for placement,svg in zip(placements,assets):
        r=ET.fromstring(svg.read_bytes()); x=placement['width_pt']/float(r.get('width')); y=placement['height_pt']/float(r.get('height'))
        assert abs(x-y)<.00001
        minimum=min(float(t.get('font-size')) for t in r.findall('.//s:text',ns))*min(x,y)
        assert minimum>=12; placement.update(asset=svg.stem,minimum_label_pt=minimum)
    result['documents'].append(dict(kind=kind,pdf_sha256=q.sha(pdf.read_bytes()),md_sha256=q.sha(md.read_bytes()),html_sha256=q.sha(hp.read_bytes()),minimum_pdf_text_pt=min(sizes),text_nodes_complete=len(nodes),pages=pages,placements=placements,images=image_rows,R4_full_DOM_after_exact_insertion_reversal=True,R3_full_DOM_after_enumerated_metadata_reversal=True))
assert changed_pages==[('antwoorden',7)]
result['changed_pages']=changed_pages

# Recalculate from the question givens with exact rational arithmetic, not floats
# or the builder's answer tables. Full explanatory judgments remain in review.
models=[]
for name,fixed,unit,qs in [('posters',120,F(2),(40,80)),('fietsen',200,F(2),(100,200)),('badges',150,F(1),(50,100)),('boekenleggers',80,F(2),(40,80)),('stickers',240,F(3,5),(400,800)),('bakkerij',500,F(4,5),(500,1000))]:
    rows=[]
    for number in qs:
        values=(F(fixed),unit*number,F(fixed)+unit*number,F(fixed,number),unit,(F(fixed)+unit*number)/number)
        assert values[3]+values[4]==values[5]
        rows.append(dict(Q=number,TCK=str(values[0]),TVK=str(values[1]),TK=str(values[2]),GCK=str(values[3]),GVK=str(values[4]),GTK=str(values[5])))
    models.append(dict(context=name,rows=rows,total_unit='euro per maand',average_unit='euro per relevant product'))
assert 220+2*100==420 and 200+F(22,10)*100==420 and 220+F(22,10)*100==440
assert F(440,100)==F(22,5)
result['independent_math']=dict(models=models,contract=dict(baseline=400,A_alone=420,B_alone=420,both=440,GTK='22/5',effects='reinforce: +20 +20'),start_budget=[30+2*10,30+2*20,str(F(50,10))],bonus_GVK=dict(A=['1','1'],B=[str(F(200,100)),str(F(500,200))]),closing=[45+3*15,45+3*30,str(F(90,15)),str(F(135,30))])
# Actual plotted line endpoints: derive inverse transform and compare functions.
geometry=[]
for name,y0,relations in [('2.1.1_fig_2',0,('TCK',)),('2.1.1_fig_3',0,('TCK','TVK')),('2.1.1_fig_3',378,('TCK','TVK','TK'))]:
    r=ET.fromstring((q.P/'_assets'/f'{name}.svg').read_bytes())
    lines=[l for l in r.findall('.//s:line',ns) if l.get('stroke-width')=='3.5' and y0+85<=float(l.get('y1'))<=y0+290]
    assert len(lines)==len(relations)
    for relation,l in zip(relations,lines):
        points=[]
        for n in (1,2):
            x=float(l.get(f'x{n}')); y=float(l.get(f'y{n}')); quantity=40+(x-100)/450*40; cost=(y0+290-y)/200*300
            expected=120 if relation=='TCK' else 2*quantity if relation=='TVK' else 120+2*quantity
            assert abs(cost-expected)<.001 and quantity in (40,80)
            points.append(dict(Q=quantity,cost=cost))
        geometry.append(dict(asset=name,panel_y0=y0,relation=relation,points=points,dash=l.get('stroke-dasharray')))
result['geometry']=geometry
def luminance(c):
    rgb=[int(c[i:i+2],16)/255 for i in (1,3,5)]
    return sum((x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4)*w for x,w in zip(rgb,(.2126,.7152,.0722)))
result['contrast']=[]
for fg,bg in [('#E67E22','#F7FAFC'),('#182b3a','#F7FAFC'),('#1A5276','#F7FAFC'),('#8E44AD','#F7FAFC'),('#555555','#ffffff'),('#304958','#ffffff')]:
    lo,hi=sorted((luminance(fg),luminance(bg))); ratio=(hi+.05)/(lo+.05)
    if fg!='#E67E22': assert ratio>=4.5
    result['contrast'].append(dict(foreground=fg,background=bg,ratio=ratio))
for p,h in json.loads((q.E/'pass0.json').read_text(encoding='utf-8'))['bindings'].items(): assert q.sha(Path(p).read_bytes())==h,p
q.put('independent-probes-recheck.json' if sys.argv[1:]==['recheck'] else 'independent-probes.json',result)
print(json.dumps(dict(status='PASS',source_files=4,tests=21,pages=31,changed_pages=changed_pages,figures=6,actual_alts=len(allalts),complete_body_nodes=sum(d['text_nodes_complete'] for d in result['documents']),minimum_figure_label=min(x['minimum_label_pt'] for d in result['documents'] for x in d['placements']))))
