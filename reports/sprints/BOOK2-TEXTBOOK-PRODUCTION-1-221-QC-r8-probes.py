"""Independent exact-source/DOM/geometry/print probes; observations are separate."""
import ast, difflib, importlib.util, io, json, re, subprocess, sys, xml.etree.ElementTree as ET
from fractions import Fraction
from pathlib import Path
from bs4 import BeautifulSoup
from PIL import Image, ImageChops

spec=importlib.util.spec_from_file_location('qc_runner',Path(__file__).with_name('BOOK2-TEXTBOOK-PRODUCTION-1-221-QC-r8-run.py'))
r=importlib.util.module_from_spec(spec); spec.loader.exec_module(r)
ROOT,E,PAR,L=r.ROOT,r.E,r.PAR,r.LESSONS
PB='199772e2aa586fce0f71b647ed5188e568dba2e5'
LB='4c4cd7d0c1d2e5242c818399a96dce3e26013e9c'
def blob(root,ref,path): return r.run(['git','show',f'{ref}:{path}'],cwd=root,content_bytes=True).stdout
def norm(s): return ' '.join(s.split())
def rel(p,root): return p.relative_to(root).as_posix()
out={'reviewer':'paragraph_213_r6_independent_review','revision':'221 R8','mechanical_status':'PASS','visual_acceptance':'separate personally attributed report','html':[],'svg':[],'pages':[]}
oldalt='Vergelijk de procentuele reacties op dezelfde schaal.'
newalt='Procentuele prijs- en hoeveelheidsreacties op dezelfde schaal.'
oldtitle='Vergelijk de procentuele prijs- en hoeveelheidsveranderingen met teken'
newtitle='Procentuele prijs- en hoeveelheidsveranderingen met teken op één schaal'
for path,old,new in [('build-scripts/content/book-2/221/theory.md',')(_assets/2.2.1_fig_1.svg)',')(_assets/2.2.1_fig_1.svg)')]:
    before=blob(ROOT,PB,path).decode('utf-8'); now=(ROOT/path).read_text(encoding='utf-8')
    original=f'![{oldalt}](_assets/2.2.1_fig_1.svg)'
    assert before.count(original)==1
    assert before.replace(original,original+'{alt="'+newalt+'"}')==now
path='build-scripts/content/book-2/b2_221.py'
assert blob(ROOT,PB,path).decode('utf-8').replace(oldtitle,newtitle)==(ROOT/path).read_text(encoding='utf-8')
for path in ['build-scripts/content/book-2/221/'+n for n in ('exercises.md','answers.md','target-answers.md','check_render.py')]+['build-scripts/content/book-2/print_pipeline.py']:
    assert blob(ROOT,PB,path).decode('utf-8')==(ROOT/path).read_text(encoding='utf-8')
tp='build-scripts/content/book-2/221/test_source.py'
def tests(src): return {n.name:ast.dump(n,include_attributes=False) for n in ast.walk(ast.parse(src)) if isinstance(n,ast.FunctionDef) and n.name.startswith('test_')}
oldtests=tests(blob(ROOT,PB,tp).decode('utf-8')); newtests=tests((ROOT/tp).read_text(encoding='utf-8'))
assert len(oldtests)==10 and len(newtests)==12 and all(newtests[k]==v for k,v in oldtests.items())
out['source_delta']={'two_metadata_substitutions_only':True,'original_test_ASTs_unchanged':10,'new_tests':2}

for kind in ('paragraaf','opgaven','antwoorden'):
    path=PAR/f'2.2.1 Prijselasticiteit – {kind}.html'
    before=blob(L,LB,rel(path,L)).decode('utf-8'); after=path.read_text(encoding='utf-8')
    a,b=BeautifulSoup(before,'html.parser'),BeautifulSoup(after,'html.parser')
    assert norm(a.get_text(' ',strip=True))==norm(b.get_text(' ',strip=True))
    assert [norm(x.get_text(' ',strip=True)) for x in a.find_all('figcaption')]==[norm(x.get_text(' ',strip=True)) for x in b.find_all('figcaption')]
    aa,bb=a.find_all(True),b.find_all(True); assert len(aa)==len(bb)
    changes=[]
    for i,(x,y) in enumerate(zip(aa,bb)):
        assert x.name==y.name
        if x.attrs!=y.attrs:
            changes.append({'tag_index':i,'tag':x.name,'before':{k:v for k,v in x.attrs.items() if y.attrs.get(k)!=v},'after':{k:v for k,v in y.attrs.items() if x.attrs.get(k)!=v}})
    if kind=='paragraaf':
        assert len(changes)==2
        assert changes[0]['tag']=='img' and changes[0]['before']=={'alt':oldalt} and changes[0]['after']=={'alt':newalt}
        assert changes[1]['tag']=='figcaption' and changes[1]['before']=={'aria-hidden':'true'} and changes[1]['after']=={}
        # Exact byte delta, not a broad whitespace/body exemption.
        oldcap=re.search(r'<figcaption[^>]*>.*?</figcaption>',before,re.S).group()
        newcap=re.search(r'<figcaption[^>]*>.*?</figcaption>',after,re.S).group()
        assert oldcap.startswith('<figcaption aria-hidden="true">') and newcap.startswith('<figcaption>')
        assert norm(BeautifulSoup(oldcap,'html.parser').get_text())==oldalt==norm(BeautifulSoup(newcap,'html.parser').get_text())
        assert before.count('alt="'+oldalt+'"')==1 and before.count(oldcap)==1
        assert before.replace('alt="'+oldalt+'"','alt="'+newalt+'"',1).replace(oldcap,newcap,1)==after
        out['exact_HTML_byte_edits']=[{'old_alt':oldalt,'new_alt':newalt},{'old_caption_markup':oldcap,'new_caption_markup':newcap}]
        a.img['alt']=newalt; del a.figcaption['aria-hidden']
        assert norm(str(a))==norm(str(b))
    else: assert before==after and not changes
    alts=[{'alt':x['alt'],'length':len(x['alt'])} for x in b.find_all('img')]
    assert len(alts)=={'paragraaf':3,'opgaven':1,'antwoorden':0}[kind]
    assert all(0<x['length']<=120 for x in alts)
    out['html'].append({'edition':kind,'changes':changes,'alts':alts,'captions':[norm(x.get_text(' ',strip=True)) for x in b.find_all('figcaption')],'full_caption_words_punctuation_equal':True})
    pdf=path.with_suffix('.pdf'); assert pdf.read_bytes()==blob(L,LB,rel(pdf,L))
    assert not re.search(r'\b(?:minuten|min\.|kernroute|companion|Part A|Part B|website|QR-code)\b',b.get_text(' ',strip=True),re.I)
    h=r.sha(pdf.read_bytes())
    current=ROOT/f'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-{kind}-{h[:12]}-r8'
    previous=ROOT/f'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/221-{kind}-{h[:12]}-r7'
    pm=json.loads((current/'manifest.json').read_text(encoding='utf-8'))
    assert pm['pages_inspected']==[] and pm['inspection_status']=='PENDING'
    pages=sorted((E/kind).glob('page-*.png'))
    assert len(pages)=={'paragraaf':10,'opgaven':6,'antwoorden':4}[kind]
    for n,p in enumerate(pages,1):
        src=current/'pages'/f'page-{n:03}.png'; old=previous/'pages'/src.name
        assert p.read_bytes()==src.read_bytes()==old.read_bytes()
        out['pages'].append({'edition':kind,'page':n,'fresh_capture':rel(p,ROOT),'sha256':r.sha(p.read_bytes()),'R7_R8_fresh_bytes_identical':True,'pdf_sha256':h})

for name,values,scales in [('fig_1',[10,-5,10,-20],[8]*4),('fig_2',[.5,2],[115]*2),('we_1',[25,-10,.4,1.5],[8,8,180,180])]:
    path=PAR/'_assets'/f'2.2.1_{name}.svg'; now=path.read_bytes(); before=blob(L,LB,rel(path,L))
    assert (before.decode('utf-8').replace(oldtitle,newtitle).encode('utf-8') if name=='fig_1' else before)==now
    tree=ET.fromstring(now); title=tree.find('{http://www.w3.org/2000/svg}title').text
    assert len(title)<=120
    bars=[x.attrib for x in tree.iter() if 'data-value' in x.attrib]
    assert [float(x['data-value']) for x in bars]==values and [float(x['data-scale']) for x in bars]==scales
    for x in bars:
        v,s,z=(float(x[k]) for k in ('data-value','data-scale','data-zero'))
        assert float(x['width'])==abs(v)*s and float(x['x'])==z+min(v,0)*s
    output=E/f'2.2.1_{name}-reraster.png'
    r.run([r.PY,'-m','cairosvg',str(path),'-o',str(output),'-s','2'])
    png=path.with_suffix('.png')
    assert output.read_bytes()==png.read_bytes()==blob(L,LB,rel(png,L))
    diff=ImageChops.difference(Image.open(output).convert('RGBA'),Image.open(png).convert('RGBA'))
    assert all(ext==(0,0) for ext in diff.getextrema())
    out['svg'].append({'name':name,'title':title,'title_length':len(title),'svg_sha256':r.sha(now),'png_sha256':r.sha(png.read_bytes()),'bar_values':values,'scales':scales,'max_channel_delta':0})

out['arithmetic']=[]
for name,p0,p1,q0,q1,expected in [('fruit',10,11,100,95,Fraction(-1,2)),('rehearsal',10,11,100,80,-2),('Bowlplein',8,10,200,180,Fraction(-2,5)),('repair',20,22,100,95,Fraction(-1,2)),('arcade',5,6,200,140,Fraction(-3,2)),('pool',5,4,200,220,Fraction(-1,2)),('Skatehal',10,12,400,280,Fraction(-3,2)),('Nova',10,12,500,420,Fraction(-4,5))]:
    dq=Fraction(q1-q0,q0)*100; dp=Fraction(p1-p0,p0)*100; ev=dq/dp; assert ev==expected
    out['arithmetic'].append(dict(context=name,dQpercent=str(dq),dPpercent=str(dp),Ev=str(ev),classification='elastic' if abs(ev)>1 else 'inelastic'))
assert Fraction(22-20,20)*100==10 and Fraction(180-200,200)*100==-10
assert Fraction(25-20,20)*100==25 and Fraction(20-25,25)*100==-20
def luminance(h):
    s=[int(h[i:i+2],16)/255 for i in (1,3,5)]; c=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in s]
    return sum(a*b for a,b in zip(c,(.2126,.7152,.0722)))
out['contrast']={}
for name,fg,bg in [('ink_white','#182b3a','#ffffff'),('ink_callout','#182b3a','#eef4f7'),('ink_table','#182b3a','#eaf1f5'),('blue_white','#1a5276','#ffffff'),('footer_white','#555555','#ffffff'),('caption_white','#304958','#ffffff')]:
    x,y=sorted([luminance(fg),luminance(bg)]); ratio=(y+.05)/(x+.05); assert ratio>=4.5
    out['contrast'][name]=round(ratio,3)
out['protected_lesson_files']={str(p.relative_to(PAR)):r.sha(p.read_bytes()) for p in [PAR/'2.2.1-review.md',PAR/'2.2.1-quality-ref.yaml',PAR/'2.2.1-textbook-handoff.md',PAR/'2.2.1-textbook-plan.md']}
out['zip']='not applicable: no221ZIP contract or file'
r.put('probes.json',out)
print(json.dumps({'status':'PASS','pages':len(out['pages']),'svg':len(out['svg']),'actual_alts':sum(len(x['alts']) for x in out['html'])}))
