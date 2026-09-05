"""One-task independent §212 R7 evidence; not acceptance or reusable allowlists."""
import ast
import base64
import hashlib
import io
import json
import re
import subprocess
import sys
import tempfile
import unittest.mock as mock
from fractions import Fraction as F
from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup, NavigableString, Tag
from PIL import Image
sys.stdout.reconfigure(encoding='utf-8',errors='backslashreplace')
sys.stderr.reconfigure(encoding='utf-8',errors='backslashreplace')

ROOT = Path(__file__).resolve().parents[2]
LESSON = ROOT.parent / '4veco-lessen'
sys.path.insert(0, str(ROOT / 'build-scripts/content/book-2'))
import b2_212 as b
import print_pipeline as pp
OUT = ROOT / 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-R7-REVIEW-evidence'
FOLDER = LESSON / b.LESSON_REL
PBASE = '2bf6260c5d4d799c5408f898d0dab126eff9e5ac'
LBASE = '917115c8da631d65eefbdb1f15c13b2291cd9e1d'
ORIGINAL = '798cacfeeb40e4e0ba54d26f2b040cbdeec327a9'
PHEAD = 'be806c2900b74807ff6c6efb7debde3a15fdc95f'
LHEAD = '6139336793edd9e79037fbae1be1586a5cc3a2ba'
KINDS = ('paragraaf', 'opgaven', 'antwoorden')
ADDITION = ('**Beoordelingscriteria:**\n\n'
 '- Je onderbouwt dat de winst in beide grafieken bij Q = 30 gelijk is: € 30 per avond.\n'
 '- Je verklaart de halve papierafstand met de verticale schaal van 150 naar 300 euro, niet met veranderde winst.\n'
 '- Je vergelijkt grootheden, eenheden, periode, Q, schaal en TO/TK-bedragen; millimeters alleen zijn onvoldoende.\n\n')

def sha(data):
    return hashlib.sha256(data).hexdigest()

def old(repo, ref, relative):
    return subprocess.check_output(['git', 'show', ref + ':' + str(relative).replace('\\','/')], cwd=repo)

def save(name, value):
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / name
    if path.exists():
        raise ValueError('Evidence exists; choose a new record: ' + str(path))
    if isinstance(value, bytes):
        path.write_bytes(value)
    else:
        path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
    print(json.dumps({'saved':str(path), 'sha256':b.digest(path)}))

def native():
    paths = [FOLDER / f'{b.STEM} – {k}.{e}' for k in KINDS for e in ('md','html','pdf','zip')]
    paths += [FOLDER/'_assets'/f'{n}.{e}' for n in b.asset_sources() for e in ('svg','png')]
    assert len(paths)==34
    return {p.relative_to(LESSON).as_posix():b.digest(p) for p in paths}

def run(label, command, cwd=ROOT, expected=0):
    result = subprocess.run(command, cwd=cwd, capture_output=True, text=True, encoding='utf-8', errors='replace')
    save('command-'+label+'.json', {'argv':command,'cwd':str(cwd),'expected_exit':expected,
         'exit':result.returncode,'stdout':result.stdout,'stderr':result.stderr})
    print(result.stdout[-5000:]); print(result.stderr[-2000:])
    assert result.returncode==expected, (label,result.returncode)

def baseline():
    assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT).decode().strip()==PHEAD
    assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=LESSON).decode().strip()==LHEAD
    before = native()
    for rel, digest in before.items():
        assert digest==sha(old(LESSON,LHEAD,rel))
    review=FOLDER/'2.1.2-review.md'
    save('old-canonical-review.md',review.read_bytes())
    guards={}
    for p in [review,FOLDER/'2.1.2-quality-ref.yaml',FOLDER/'2.1.2-handoff.json',
              FOLDER/'2.1.2-textbook-plan.md',FOLDER.parent/'_chapter-plan.md',
              *(FOLDER.parent/'2.1.1 Kostenstructuren').glob('*')]:
        if p.is_file(): guards[p.relative_to(LESSON).as_posix()]={'raw':b.digest(p),'lf':b.lf_hash(p) if p.suffix in ('.md','.yaml','.json') else None}
    # Scan every extant Book 2 worktree report proof, not just this branch.
    found=[]
    for pair in Path('C:/wt').glob('book2*'):
        reports=pair/'4veco-platform/reports'
        if reports.is_dir():
            found.extend(str(p) for p in reports.rglob('212-*-r*') if p.is_dir() and re.fullmatch(r'212-(paragraaf|opgaven|antwoorden)-[0-9a-f]+-r[1-9][0-9]*',p.name))
    revisions={int(re.search(r'-r(\d+)$',p).group(1)) for p in found}
    suffix='r'+str(max(revisions|{0})+1)
    save('baseline.json',{'platform':PHEAD,'lessons':LHEAD,'native34':before,'protected_lesson_files':guards,
         'existing_proof_directories':sorted(found),'selected_fresh_suffix':suffix})

def build():
    initial=json.loads((OUT/'baseline.json').read_text(encoding='utf-8'))
    result=b.build(LESSON,OUT,proof_suffix=initial['selected_fresh_suffix'])
    assert native()==initial['native34']
    save('native-full-build.json',result)

def print_only():
    initial=json.loads((OUT/'baseline.json').read_text(encoding='utf-8'))
    records=[]
    for kind in KINDS:
        rec=pp.build_document(FOLDER/f'{b.STEM} – {kind}.md')
        rec['zip']=b.zip_document(rec)
        records.append(rec)
    assert native()==initial['native34']
    save('direct-print-only.json',{'result':'PASS','native34':native(),'documents':records})

def methods(source):
    return {n.name:(ast.dump(n,include_attributes=False),ast.get_source_segment(source,n))
            for c in ast.parse(source).body if isinstance(c,ast.ClassDef)
            for n in c.body if isinstance(n,ast.FunctionDef) and n.name.startswith('test_')}

def dom(node):
    if isinstance(node,NavigableString):
        v=re.sub(r'\s+',' ',str(node)).strip()
        return ('text',v) if v else None
    if isinstance(node,Tag):
        return (node.name,dict(sorted(node.attrs.items())),[v for ch in node.children if (v:=dom(ch)) is not None])

def mechanical():
    import fitz
    # Explicit expected full strings, independently anchored to the original.
    alts={
      '2.1.2_fig_1':'Theater: totale opbrengst per avond bij 0 tot 30 bezoekers.',
      '2.1.2_fig_2':'Theater: TO en TK op dezelfde assen; bij 10 bezoekers is de opbrengst lager dan de kosten.',
      '2.1.2_fig_3':'Theater: break-even bij 20 bezoekers; links verlies en rechts winst binnen het model.',
      '2.1.2_fig_4':'Theater: verticale winstafstand van 30 euro per avond bij 30 bezoekers, geen oppervlakte.',
      '2.1.2_ex_1':'Zeep: TK en TO, break-even bij 3⅓ stukken en 8 euro verticale winstafstand bij 6 stukken per dag.',
      '2.1.2_ex_2':'Bloempotten: assen en TK-lijn als steun voor het toevoegen van TO, break-even en winstafstand.',
      '2.1.2_ex_4':'Minigolf: TK, TO, break-even en zones; verticale winstafstand bij 20 bezoekers per dag.',
      '2.1.2_ex_5':'Bakkerij: TK en TO, break-even rond 714,29 broden en 200 euro verticale winstafstand bij 1.000 broden per maand.',
      '2.1.2_ex_6':'Theatermodel: dezelfde winst van 30 euro per avond op verticale schalen tot 150 en 300 euro.'}
    image_pattern=re.compile(r'!\[([^\]]+)\]\(_assets/(2\.1\.2_(?:fig|we|ex)_\d+)\.svg\)')
    source_contract=[]; inserted=0
    for name in ('theory.md','exercises.md','answers.md','target-answers.md'):
        rel='build-scripts/content/book-2/212/'+name
        original=old(ROOT,ORIGINAL,rel).decode()
        expected=image_pattern.sub(lambda m:m[0]+('{alt="'+alts[m[2]]+'"}' if m[2] in alts else ''),original)
        inserted+=expected.count('{alt="')
        r6=old(ROOT,PBASE,rel).decode()
        assert expected==r6, name
        if name=='answers.md':
            assert expected.count('## Herhaling / Herhaling en interleaving\n')==1
            expected=expected.replace('## Herhaling / Herhaling en interleaving\n',ADDITION+'## Herhaling / Herhaling en interleaving\n',1)
        actual=(ROOT/rel).read_text(encoding='utf-8')
        assert expected==actual, name
        source_contract.append({'file':name,'original_sha256':sha(original.encode()),'r6_sha256':sha(r6.encode()),'current_sha256':sha(actual.encode())})
    assert inserted==9
    original_test=old(ROOT,ORIGINAL,'build-scripts/content/book-2/212/test_source.py').decode()
    current_test=(b.CONTENT/'test_source.py').read_text(encoding='utf-8')
    om,cm=methods(original_test),methods(current_test)
    assert len(om)==10 and set(om)==set(cm)
    assert all(om[n][0]==cm[n][0] for n in om)
    r6metadata=old(ROOT,PBASE,'build-scripts/content/book-2/212/test_metadata.py').decode()
    currentmetadata=(b.CONTENT/'test_metadata.py').read_text(encoding='utf-8')
    oldblock="            self.assertEqual(actual, source_replacement(previous), name)"
    newblock="            expected = source_replacement(previous)\n            if name == 'answers.md':\n                from test_bonus import insertion\n                expected = insertion(expected)\n            self.assertEqual(actual, expected, name)"
    assert r6metadata.count(oldblock)==1 and currentmetadata==r6metadata.replace(oldblock,newblock,1)
    mm,nm=methods(r6metadata),methods(currentmetadata)
    unchanged=[n for n in mm if mm[n][1]==nm[n][1]]
    assert len(unchanged)==4
    assert len(methods((b.CONTENT/'test_bonus.py').read_text(encoding='utf-8')))==3
    titles={'2.1.2_we_1':'Kajakverhuur: TK, TO, break-even en verticale winstafstand per dag',
            '2.1.2_ex_1':'Zeep: TK, TO, break-even en verticale winstafstand per dag',
            '2.1.2_ex_3':'Bloempotten: TK, TO, break-even en verticale winstafstand per dag',
            '2.1.2_ex_4':'Minigolf: TK, TO, break-even en verticale winstafstand per dag',
            '2.1.2_ex_5':'Bakkerij: TK, TO, break-even en verticale winstafstand per maand'}
    gen_old=old(ROOT,ORIGINAL,'build-scripts/content/book-2/b2_212.py').decode()
    marker='    for name, fixed, variable, price, qmax, ymax, qticks, yticks, qunit, period, complete in cases:'
    insertion='    titles = {\n'+''.join(f'        "{k}": "{v}",\n' for k,v in titles.items())+'    }\n'
    gen_expected=gen_old.replace(marker,insertion+marker).replace('name + ": TK en TO" if complete else "Bloempotten: alleen TK"','titles[name] if complete else "Bloempotten: alleen TK"')
    assert Path(b.__file__).read_text(encoding='utf-8')==gen_expected
    before=json.loads((OUT/'baseline.json').read_text(encoding='utf-8'))
    assert native()==before['native34']
    changed=[rel for rel,h in native().items() if sha(old(LESSON,LBASE,rel))!=h]
    assert set(changed)=={(b.LESSON_REL/f'{b.STEM} – antwoorden.{e}').as_posix() for e in ('md','html','pdf','zip')}
    docs=b.documents(b.target_record()); archives=[]; image_metadata=[]; texts=[]; threshold=None
    for kind in KINDS:
        path=FOLDER/f'{b.STEM} – {kind}.md'
        assert path.read_bytes()==docs[kind].encode()
        assert kind=='antwoorden' or path.read_bytes()==old(LESSON,LBASE,path.relative_to(LESSON))
        if kind=='antwoorden':
            assert path.read_text(encoding='utf-8').replace(ADDITION,'',1)==old(LESSON,LBASE,path.relative_to(LESSON)).decode()
        soup=BeautifulSoup(path.with_suffix('.html').read_text(encoding='utf-8'),'html.parser')
        assert not soup.select('script,iframe,object,embed')
        refs=[]
        # Captions and actual embedded alt/title are checked, not source metadata only.
        captures=list(re.finditer(r'!\[([^\]]+)\]\(_assets/([^/)]+)\.svg\)(?:\{alt="([^"]+)"\})?',docs[kind]))
        images=soup.find_all('img')
        assert len(captures)==len(images)
        for capture,img in zip(captures,images):
            caption,name,alt=capture.groups(); refs.append(name)
            assert img['alt']==(alt or caption) and 30<len(img['alt'])<=120
            figure=img.find_parent('figure')
            assert figure and re.sub(r'\s+',' ',figure.find('figcaption').get_text(' ',strip=True))==caption
            embedded=base64.b64decode(img['src'].split(',',1)[1])
            # Print pipeline embeds PNG for reproducible image placement.
            assert embedded==(FOLDER/'_assets'/f'{name}.png').read_bytes()
            svg=ET.parse(FOLDER/'_assets'/f'{name}.svg').getroot()
            title=svg.find('{http://www.w3.org/2000/svg}title').text
            if name in titles: assert title==titles[name]
            image_metadata.append({'edition':kind,'asset':name,'actual_html_alt':img['alt'],'full_caption':caption,'native_svg_title':title,'embedded_png_sha256':sha(embedded)})
        expected_names={path.name,path.with_suffix('.html').name,path.with_suffix('.pdf').name}
        expected_names|={f'_assets/{name}.{ext}' for name in refs for ext in ('svg','png')}
        with ZipFile(path.with_suffix('.zip')) as z, ZipFile(io.BytesIO(old(LESSON,LBASE,path.with_suffix('.zip').relative_to(LESSON)))) as oz:
            assert z.testzip() is None and len(z.namelist())==len(set(z.namelist()))
            assert set(z.namelist())==expected_names and len(expected_names)=={'paragraaf':19,'opgaven':11,'antwoorden':9}[kind]
            assert set(oz.namelist())==expected_names
            members=[]; delta=[]
            for item in z.infolist():
                raw=z.read(item.filename)
                assert raw==(FOLDER/item.filename).read_bytes()
                if raw!=oz.read(item.filename): delta.append(item.filename)
                members.append({'name':item.filename,'crc':item.CRC,'bytes':len(raw),'sha256':sha(raw)})
            assert set(delta)==({path.name,path.with_suffix('.html').name,path.with_suffix('.pdf').name} if kind=='antwoorden' else set())
            archives.append({'edition':kind,'members':members,'changed_members':delta,'zip_sha256':b.digest(path.with_suffix('.zip'))})
        prior=BeautifulSoup(old(LESSON,LBASE,path.with_suffix('.html').relative_to(LESSON)).decode(),'html.parser')
        if kind=='antwoorden':
            heading=soup.find('h2',id='denkertje-bonusopgave')
            section=heading.find_next('div',class_='exercise')
            previous=prior.find('h2',id='denkertje-bonusopgave').find_next('div',class_='exercise')
            oldlen=len(previous.get_text(' ',strip=True));newlen=len(section.get_text(' ',strip=True))
            assert oldlen<650<=newlen and previous['class']==['exercise','exercise-short'] and section['class']==['exercise']
            label=section.find('strong',string='Beoordelingscriteria:').parent
            ul=label.find_next_sibling('ul')
            assert [re.sub(r'\s+',' ',li.get_text()).strip() for li in ul.find_all('li')]==[s[2:] for s in ADDITION.splitlines() if s.startswith('- ')]
            label.extract();ul.extract();section['class']=['exercise','exercise-short']
            threshold={'before_chars':oldlen,'after_chars':newlen,'threshold':650,'exact_class_transition':['exercise exercise-short','exercise']}
        assert dom(soup)==dom(prior),kind
        with fitz.open(path.with_suffix('.pdf')) as pdf, fitz.open(stream=old(LESSON,LBASE,path.with_suffix('.pdf').relative_to(LESSON)),filetype='pdf') as opdf:
            assert len(pdf)==len(opdf)=={'paragraaf':14,'opgaven':7,'antwoorden':6}[kind]
            for i,page in enumerate(pdf):
                text=page.get_text()
                if kind!='antwoorden' or i!=5: assert text==opdf[i].get_text()
                texts.append({'edition':kind,'page':i+1,'text':text})
    all_assets=[]
    for name,svg in b.asset_sources().items():
        source=FOLDER/'_assets'/f'{name}.svg';png=source.with_suffix('.png')
        rendered=subprocess.check_output([sys.executable,'-m','cairosvg','-','-s','2','-f','png'],input=svg.encode())
        assert source.read_bytes()==svg.encode() and rendered==png.read_bytes()
        gray=OUT/f'gray-{name}.png'
        assert not gray.exists()
        Image.open(png).convert('L').save(gray)
        all_assets.append({'asset':name,'svg_sha256':b.digest(source),'png_sha256':b.digest(png),'grayscale_path':str(gray),'grayscale_sha256':b.digest(gray)})
    proofs=[];page_changes=[]
    result=json.loads((OUT/'native-cli-r9.json').read_text(encoding='utf-8'))
    for record in result['documents']:
        directory=Path(record['proof_directory']);manifest=json.loads((directory/'manifest.json').read_text(encoding='utf-8'))
        kind=directory.name.split('-')[1]
        assert manifest['inspection_status']=='PENDING' and manifest['pages_inspected']==[]
        olddir=next((ROOT/'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1').glob(f'212-{kind}-*-r6'))
        om=json.loads((olddir/'manifest.json').read_text(encoding='utf-8'))
        for page,h in manifest['page_sha256'].items():
            assert b.digest(directory/'pages'/page)==h
            assert b.digest(olddir/'pages'/page)==om['page_sha256'][page]
            if h!=om['page_sha256'][page]:page_changes.append([kind,page])
        proofs.append({'edition':kind,'directory':str(directory),'manifest_sha256':b.digest(directory/'manifest.json'),'pages':manifest['page_sha256']})
    assert page_changes==[['antwoorden','page-006.png']],page_changes
    handoff=FOLDER/'2.1.2-textbook-handoff.md'
    assert handoff.read_bytes()==old(LESSON,LHEAD,handoff.relative_to(LESSON))
    assert b.lf_hash(handoff)=='de2b8ed7dcc7a3c5c6eaac400892d2d37ac5212ccb3b9972fb004115a88c1fe2'
    save('full-pdf-text.json',texts)
    save('mechanical.json',{'result':'PASS','visual_judgment':'NOT_SUPPLIED_BY_SCRIPT','source_contract':source_contract,
         'source_test_AST_methods_unchanged':sorted(omethod for omethod in methods(original_test)),
         'four_metadata_methods_byte_exact':unchanged,'one_exact_expected_source_evolution':True,'bonus_methods_added':3,
         'generator_full_expected_five_title_transform':True,'native34':native(),'r6_changed_native_files':changed,
         'html_threshold':threshold,'archives':archives,'embedded_image_metadata':image_metadata,'assets':all_assets,
         'proofs':proofs,'changed_pages_from_r6':page_changes,'handoff_unchanged_sha256':b.digest(handoff)})

def guards():
    initial=native(); failures=[]
    real_hash=b.lf_hash
    for name in ('2.1.1-review.md','2.1.1-quality-ref.yaml'):
        with mock.patch.object(b,'lf_hash',side_effect=lambda p: '0'*64 if Path(p).name==name else real_hash(p)), \
             mock.patch.object(b.subprocess,'run') as process, mock.patch.object(Path,'write_text') as write, \
             mock.patch.object(Path,'mkdir') as mkdir:
            try:b.build(LESSON,OUT/'guard-must-not-exist',proof_suffix='r999')
            except ValueError as error:
                assert 'Required accepted source differs' in str(error) and name in str(error)
                failures.append({'mutation':name,'rejected':str(error),'subprocess_calls':process.call_count,'write_calls':write.call_count,'mkdir_calls':mkdir.call_count})
            else:raise AssertionError('Forged prior was accepted')
            assert process.call_count==write.call_count==mkdir.call_count==0
    record=json.loads((OUT/'native-cli-r9.json').read_text(encoding='utf-8'))['documents'][0]
    directory=Path(record['proof_directory']);original=b.digest(directory/'manifest.json')
    with mock.patch.object(pp.subprocess,'run') as process:
        try:pp.render_proof(record,directory)
        except ValueError as error:failures.append({'mutation':'nonempty-native-proof','rejected':str(error),'subprocess_calls':process.call_count})
        else:raise AssertionError('Historical proof overwrite accepted')
        assert process.call_count==0
    assert native()==initial and b.digest(directory/'manifest.json')==original
    save('guards.json',{'result':'PASS','negative_probes':failures,'no_outputs_changed':True})

def economics():
    import fitz
    ns={'s':'http://www.w3.org/2000/svg'}
    # Values transcribed from the questions, not computed by their generator.
    cases=[('Theatre',60,2,5,30,150,[0,10,20,30],F(20),20),
           ('Kayak',20,1,7,6,50,[2,3,4,6],F(10,3),4),
           ('Soap',10,1,4,6,30,[2,3,4,6],F(10,3),4),
           ('Pots',15,1,4,8,40,[3,4,5,8],F(5),5),
           ('Minigolf',40,1,4,20,80,[10,13,14,20],F(40,3),14),
           ('Bakery',500,F(4,5),F(3,2),1000,1600,[500,714,715,1000],F(5000,7),715)]
    calculations=[]
    expected_profits=[[-60,-30,0,30],[-8,-2,4,16],[-4,-1,2,8],[-6,-3,0,9],[-10,-1,2,20],[-150,F(-1,5),F(1,2),200]]
    for (name,f,v,p,qmax,ymax,qs,be,first),profits in zip(cases,expected_profits):
        assert F(f)/(p-v)==be
        assert p*be==f+v*be
        assert (p-v)*first-f>=0 and (p-v)*(first-1)-f<0
        rows=[]
        for q,expected in zip(qs,profits):
            to=p*q;tk=f+v*q;profit=to-tk
            assert profit==expected
            rows.append({'Q':q,'TO':str(to),'TK':str(tk),'profit':str(profit),'GO':str(to/q) if q else 'undefined'})
        calculations.append({'context':name,'break_even_Q':str(be),'break_even_total':str(p*be),'first_whole_without_loss':first,'rows':rows})
    assert 12+3*2==18 and F(18,2)==9 and 3*6==12+6==18
    assert 8*2==16 and F(16,2)==8 and 16-18==-2
    dance=[(p*10,f+10,p*10-(f+10)) for p,f in [(5,20),(6,20),(5,30),(6,30)]]
    assert dance==[(50,30,20),(60,30,30),(50,40,10),(60,40,20)]
    assert (24,3*6,24+3*6,F(24+3*6,6))==(24,18,42,7)
    geometry=[]
    specs={**{f'2.1.2_fig_{i}':(cases[0],i!=1,True,i>=3,i==4) for i in range(1,5)},
           '2.1.2_we_1':(cases[1],True,True,True,True),'2.1.2_ex_1':(cases[2],True,True,True,True),
           '2.1.2_ex_2':(cases[3],True,False,False,False),'2.1.2_ex_3':(cases[3],True,True,True,True),
           '2.1.2_ex_4':(cases[4],True,True,True,True),'2.1.2_ex_5':(cases[5],True,True,True,True)}
    def near(actual,expected):
        assert abs(float(actual)-float(expected))<.002,(actual,expected)
    def coordinates(line,expected):
        for key,value in zip(('x1','y1','x2','y2'),expected):near(line.get(key),value)
    for name,(case,tk,to,be,gap) in specs.items():
        _,fixed,variable,price,qmax,ymax,_,cross,_=case
        svg=ET.parse(FOLDER/'_assets'/f'{name}.svg').getroot()
        lines=svg.findall('.//s:line',ns)
        costs=[el for el in lines if el.get('stroke')=='#6F3611']
        revenues=[el for el in lines if el.get('stroke')=='#1A5276']
        circles=svg.findall('.//s:circle',ns)
        assert len(costs)==int(tk) and len(revenues)==int(to) and len(circles)==int(be)
        def xy(q,money):return (150+F(q,qmax)*620,445-F(money,ymax)*330)
        if tk:
            coordinates(costs[0],(*xy(0,fixed),*xy(qmax,fixed+variable*qmax)))
            assert costs[0].get('stroke-width')=='9' and costs[0].get('stroke-dasharray')=='24 14'
        if to:
            coordinates(revenues[0],(*xy(0,0),*xy(qmax,price*qmax)))
            assert revenues[0].get('stroke-width')=='7' and revenues[0].get('stroke-dasharray')==''
        if be:
            x,y=xy(cross,price*cross);near(circles[0].get('cx'),x);near(circles[0].get('cy'),y)
        vertical=[el for el in lines if el.get('stroke-width')=='4' and el.get('x1')==el.get('x2')]
        assert len(vertical)==int(gap)
        if gap:
            coordinates(vertical[0],(794,xy(qmax,price*qmax)[1],794,xy(qmax,fixed+variable*qmax)[1]))
        labels=svg.findall('.//s:text',ns)
        assert labels and {el.get('font-size') for el in labels}=={'30pt'}
        geometry.append({'asset':name,'TK_endpoint_money':str(fixed+variable*qmax) if tk else None,'TO_endpoint_money':str(price*qmax) if to else None,'break_even':str(cross) if be else None,'vertical_profit':str(price*qmax-fixed-variable*qmax) if gap else None,'all_labels_source_pt':30})
    bonus=ET.parse(FOLDER/'_assets/2.1.2_ex_6.svg').getroot()
    gaps=[el for el in bonus.findall('.//s:line',ns) if el.get('stroke-width')=='4' and el.get('x1')==el.get('x2')]
    assert len(gaps)==2
    coordinates(gaps[0],(1224,100,1224,136));coordinates(gaps[1],(1224,610,1224,628))
    assert F(36,18)==2 and 150-120==30
    # Actual physical placement in all PDF images, not merely declared SVG size.
    fonts=[]
    for kind in KINDS:
        with fitz.open(FOLDER/f'{b.STEM} – {kind}.pdf') as pdf:
            for n,page in enumerate(pdf,1):
                for item in page.get_image_info():
                    placed=(item['bbox'][2]-item['bbox'][0])*80/item['width']
                    assert placed>=12
                    fonts.append({'edition':kind,'page':n,'pixel_width':item['width'],'placed_text_pt':placed})
    assert abs(min(r['placed_text_pt'] for r in fonts)-12.548030598958333)<.0001
    registry=json.loads((ROOT/'references/authored/course-target-exercises.json').read_text(encoding='utf-8'))
    target=next(r for r in registry['exercises'] if r['id']=='2.1.2')
    assert sha(json.dumps(target,ensure_ascii=False,separators=(',',':')).encode())=='19b466dd6f7b541a3bb701d4de80ce13fe9ea58356313e24b23b21698093e1f9'
    assert [s['points'] for s in target['target_exercise']['subquestions']]==[2,2,3,4]
    assert len(target['lesson_goals'])==4
    save('economics.json',{'result':'PASS','full_target_record':target,'frozen_points':11,'cases':calculations,
         'start_candle':[18,9,6,16,8,-2],'dance_TO_TK_profit':dance,'closing_TCK_TVK_TK_GTK':[24,18,42,7],
         'geometry':geometry,'bonus':{'profit_both_euros_per_evening':30,'Q':30,'vertical_maxima':[150,300],'native_pixel_gaps':[36,18],'scale_length_ratio':2},
         'all_actual_pdf_image_fonts':fonts,'timing_core_estimated':54,'supported_estimated':67,'all_items_estimated':77,'classroom_observed':False})

def candidate_evidence():
    """Read every builder JSON record and verify its complete referent inventory.

    Relocate only the known builder worktree prefix for read-only verification;
    do not execute its hard-path one-shot helper or inherit its visual verdict.
    """
    evidence=ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence'
    records={p.name:json.loads(p.read_text(encoding='utf-8')) for p in evidence.glob('*.json')}
    def local(path):
        value=str(path).replace('\\','/')
        prefix='C:/wt/book2-212-bonus-correction-20260905/'
        assert value.startswith(prefix),value
        return ROOT.parent/value[len(prefix):]
    baseline=records['baseline.json']; mechanical=records['mechanical-r7.json']; binding=records['visual-binding-r7.json']
    assert baseline['platform_base']==PBASE and baseline['lessons_base']==LBASE
    inventory=[]
    for before,after in zip(baseline['files'],mechanical['protected_inventory'],strict=True):
        assert all(after[k]==v for k,v in before.items())
        repo=LESSON if before['repo']=='lessons' else ROOT
        ref=LBASE if repo==LESSON else PBASE
        assert sha(old(repo,ref,before['path']))==before['sha256']
        assert b.digest(repo/before['path'])==after['after_sha256']
        assert after['changed']==(before['sha256']!=after['after_sha256'])
        inventory.append(after)
    assert records['build-r7.json']['inspection_status']=='PENDING'
    assert mechanical['result']==records['reproduction-r7.json']['result']==binding['result']=='PASS'
    assert records['reproduction-r7.json']['all34_full_native_identical'] and records['reproduction-r7.json']['all34_print_only_identical']
    assert native()==mechanical['native34']==records['reproduction-r7.json']['native34']==binding['native34']
    assert binding['independent_review_and_QC']=='PENDING'
    assert binding['role']=='builder_personal_inspection_not_independent_review_or_QC'
    assert b.digest(ROOT/binding['report'])==binding['report_sha256']
    assert b.digest(ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence.py')==binding['helper_sha256']
    for name,digest in binding['evidence'].items():assert b.digest(evidence/name)==digest
    for name,digest in binding['source_tests'].items():assert b.digest(b.CONTENT/name)==digest
    for row in mechanical['pages']:
        assert b.digest(local(row['file']))==row['sha256']
        assert row['changed']==(row['sha256']!=row['old_sha256'])
    for row in mechanical['figures']:
        assert b.digest(local(row['gray']))==row['gray_sha256']
        for ext in ('png','svg'):assert b.digest(FOLDER/'_assets'/f"{row['asset']}.{ext}")==row[ext+'_sha256']
    for row in binding['native_manifests']:
        path=ROOT/row['path'];manifest=json.loads(path.read_text(encoding='utf-8'))
        assert b.digest(path)==row['sha256'] and manifest['inspection_status']=='PENDING' and manifest['pages_inspected']==[]
        for name,digest in manifest['page_sha256'].items():assert b.digest(path.parent/'pages'/name)==digest
    assert binding['pages']==mechanical['pages'] and binding['figures']==mechanical['figures']
    for record in [records['build-r7.json'],records['reproduction-r7.json']['full']]:
        for source in record['input_sources']:assert b.digest(local(source['path']))==source['sha256']
        assert record['target_record_sha256']=='19b466dd6f7b541a3bb701d4de80ce13fe9ea58356313e24b23b21698093e1f9'
    all_docs=records['build-r7.json']['documents']+records['reproduction-r7.json']['full']['documents']+records['reproduction-r7.json']['print']
    for doc in all_docs:
        for pathkey,hashkey in [('source_md','source_sha256'),('source_html','html_sha256'),('source_pdf','pdf_sha256')]:
            assert b.digest(local(doc[pathkey]))==doc[hashkey]
        assert b.digest(local(doc['zip']['path']))==doc['zip']['sha256']
        for asset in doc['assets']:assert b.digest(local(asset['path']))==asset['sha256']
    for archive in mechanical['ZIP']:
        for member in archive['members']:assert b.digest(FOLDER/member['name'])==member['sha256']
    assert records['render-check-r7.json']==json.loads((OUT/'native-render-corrected.json').read_text(encoding='utf-8'))
    save('candidate-evidence-audit.json',{'result':'PASS','builder_visual_judgment_inherited':False,
        'entire_json_records_read':{name:{'sha256':b.digest(evidence/name),'keys':list(record)} for name,record in records.items()},
        'protected_inventory':inventory,'changes':mechanical['exact_changes'],'DOM':mechanical['DOM'],
        'all_builder_document_source_output_assets_verified':len(all_docs),
        'all_builder_pages_verified':len(mechanical['pages']),'all_builder_figures_verified':len(mechanical['figures']),
        'builder_proofs_still_pending':True,'builder_independent_acceptance_still_pending':True})


def bind_inspection():
    baseline=json.loads((OUT/'baseline.json').read_text(encoding='utf-8'))
    mechanical=json.loads((OUT/'mechanical.json').read_text(encoding='utf-8'))
    candidate=json.loads((OUT/'candidate-evidence-audit.json').read_text(encoding='utf-8'))
    review=FOLDER/'2.1.2-review.md'
    assert b.digest(OUT/'old-canonical-review.md')=='74ad2ed9c44d9aa05b6d6a680d5d273f2cad4b62e4bead5db303c006514238cd'
    assert native()==baseline['native34']==mechanical['native34']
    protected=[]
    for row in candidate['protected_inventory']:
        repo=LESSON if row['repo']=='lessons' else ROOT
        path=repo/row['path']
        if path==review:continue
        assert b.digest(path)==row['after_sha256'],str(path)
        protected.append({'repo':row['repo'],'path':row['path'],'sha256':b.digest(path)})
    for name,digest in [('2.1.2-quality-ref.yaml','e168e3c2b8698d12b699fbf60e7691fbbc8a15d61bd46a7988704d3c896c805c'),
        ('2.1.2-textbook-handoff.md','de2b8ed7dcc7a3c5c6eaac400892d2d37ac5212ccb3b9972fb004115a88c1fe2')]:
        assert b.digest(FOLDER/name)==b.lf_hash(FOLDER/name)==digest
    refs=set()
    for kind in KINDS:
        refs.update(re.findall(r'_assets/(2\.1\.2_(?:fig|we|ex)_\d+)\.svg',(FOLDER/f'{b.STEM} – {kind}.md').read_text(encoding='utf-8')))
    assert refs==set(b.asset_sources()) and len(refs)==11
    assert {p.name for p in (FOLDER/'_assets').iterdir()}=={f'{name}.{ext}' for name in refs for ext in ('svg','png')}
    manifests=[]
    for path in sorted(OUT.glob('212-*-r*/manifest.json')):
        data=json.loads(path.read_text(encoding='utf-8'))
        assert data['inspection_status']=='PENDING' and data['pages_inspected']==[]
        for name,digest in data['page_sha256'].items():assert b.digest(path.parent/'pages'/name)==digest
        if path.parent.name.endswith('-r9'):
            record=next(p for p in mechanical['proofs'] if p['edition']==path.parent.name.split('-')[1])
            assert b.digest(path)==record['manifest_sha256'] and data['page_sha256']==record['pages']
        manifests.append({'path':path.relative_to(ROOT).as_posix(),'sha256':b.digest(path),'inspection_status':'PENDING','personally_viewed':path.parent.name.endswith('-r9')})
    assert len(manifests)==6
    for asset in mechanical['assets']:
        assert b.digest(Path(asset['grayscale_path']))==asset['grayscale_sha256']
        for ext in ('svg','png'):assert b.digest(FOLDER/'_assets'/f"{asset['asset']}.{ext}")==asset[ext+'_sha256']
    reports={}
    for suffix in ('plan.md','result.md','inspection.md','probes.py'):
        path=ROOT/f'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-R7-REVIEW-{suffix}'
        reports[path.relative_to(ROOT).as_posix()]=b.digest(path)
    commands={p.name:{'sha256':b.digest(p),'exit':json.loads(p.read_text(encoding='utf-8'))['exit']} for p in OUT.glob('command-*.json')}
    save('inspection-binding.json',{'result':'PASS_WITH_FLAGS','role':'independent_paragraph_review_not_QC_or_root_acceptance',
        'claim_alias':'paragraph_212_r7_independent_review','actual_agent':'/root/paragraph_213_r7_independent_review',
        'candidate_platform':PHEAD,'candidate_lessons':LHEAD,'canonical_review':review.relative_to(LESSON).as_posix(),
        'canonical_review_raw_sha256':b.digest(review),'canonical_review_lf_sha256':b.lf_hash(review),
        'reports':reports,'native34':native(),'protected_unchanged':protected,
        'personal_inspection_counts':{'fresh_full_r9_pages':27,'native_colour_figures':11,'fresh_grayscale_figures':11},
        'personal_inspection_source':'human-readable independently authored inspection.md; not inferred from script',
        'native_manifests':manifests,'personally_viewed_pages':mechanical['proofs'],'figures':mechanical['assets'],
        'evidence':{p.name:b.digest(p) for p in OUT.glob('*.json') if not p.name.startswith('command-')},'commands':commands,
        'specialist_QC':'PENDING','handoff':'STALE_UNTOUCHED','classroom_timing':'UNOBSERVED_54_67_77',
        'combined_root_full_build':'NOT_CLAIMED','full_Jest_and_current_CI':'NOT_RUN'})


if __name__=='__main__':
    action=sys.argv[1]
    if action=='run':
        run(sys.argv[2],sys.argv[3:])
    else:
        globals()[action]()
