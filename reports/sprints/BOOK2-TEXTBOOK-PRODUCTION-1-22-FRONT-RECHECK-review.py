"""Independent F22-FRONT-TITLE-01 recheck. Memory/stdout only; no native writes."""
from pathlib import Path
import base64, hashlib, json, re, subprocess, sys
sys.dont_write_bytecode=True
P=Path(__file__).resolve().parents[2]
L=Path('\\\\?\\'+str(P.parent/'4veco-lessen'))
sys.path.insert(0,str(P/'build-scripts/content/book-2'))
from bs4 import BeautifulSoup
import tinycss2, print_pipeline
from weasyprint import HTML
sha=lambda b:hashlib.sha256(b).hexdigest()
git=lambda *a:subprocess.check_output(['git',*a],cwd=P)
read=lambda f:(P/f).read_bytes()
J=lambda f:json.loads(read(f))
prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-22-FRONT-RECHECK-'
prior='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-22-CONSISTENCY-REVIEW-'
root='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-22-FRONT-ROOT-'
prep='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-22-ASSEMBLY-PREP-'
front='build-scripts/content/book-2/22/front.html';style='build-scripts/content/book-2/22/front.css';layout=prep+'layout.py'
expected={front:'0b0c0a528b6ca4b2b6af988dc5c6ac28ae4f85faba383c4e0ef0f513cd477c9d',style:'8d6380da0cf23bb07f19ac040ac06ec8bf6c1e486e16fcbc78b67de9034dcab4',layout:'f0474d728d23e760753416c8c5268f480bf4c5fb2ce4578f1e2651c11014cbde',root+'checks-r1.json':'79ff1d29aa9ebac87fc2ef04807678e4f81dd3a9ba5891747d2a993741ad2f68',root+'r1-layout-process.json':'2328a253c1bf59e0b980fb14aafd38f539485ce56527358f7cf30d09094ed8bf',prior+'report.md':'75587b17e5526d3af96ee2dc85fa66c724df5f77b6828afa88965b36cbef2024',prior+'review-r4-process.json':'5d3cef248dcc80df6c74bdf05059f0514662aea0f62a975b1d34bad24fe7a317'}
for f,h in expected.items():assert sha(read(f))==h and read(f)==git('show','HEAD:'+f),f
old=git('show','30e42c450774d3600d9fe1f14002eefae670a8b0:'+front)
wrong=b'Inkomenselasticiteit en kruiselingse elasticiteit';correct=b'Inkomenselasticiteit en kruislingse elasticiteit'
assert old.count(wrong)==1 and read(front)==old.replace(wrong,correct)
assert read(front).replace(correct,wrong)==old
assert read(style)==git('show','30e42c450774d3600d9fe1f14002eefae670a8b0:'+style)
source_commit='cf97be21f580b2d32cf4085bd92a8546a6d4c74b'
source_paths=git('diff-tree','--no-commit-id','--name-only','-r','-z',source_commit).decode().split('\0')[:-1]
assert set(source_paths)=={front,layout,root+'imports.json'}
delta=git('diff',source_commit+'^',source_commit,'--',front,layout)
for f in [front,layout]:assert read(f)==git('show',source_commit+':'+f)

# Entire original reviewer evidence stays immutable, including failures.
original_head='4e3c99c313cc88c89ee50a055bbd97d21fac90a8'
files=git('diff','--name-only','-z','30e42c450774d3600d9fe1f14002eefae670a8b0',original_head).decode().split('\0')[:-1]
assert len(files)==31 and all(f.startswith(prior) for f in files)
for f in files:assert read(f)==git('show',original_head+':'+f)==git('show','HEAD:'+f)
processes=[]
process_paths=[f for f in files if f.endswith('-process.json')]+[f.as_posix().replace(P.as_posix()+'/', '') for f in (P/'reports/sprints').glob(Path(root).name+'*-process.json')]
for f in process_paths:
    v=J(f)
    for stream in ['stdout','stderr']:assert base64.b64decode(v[stream+'_base64']).decode()==v[stream]
    for s in v['sources']:
        assert sha(s['source_utf8'].encode())==s['sha256']
        assert git('show',v['controller_commit']+':'+s['path']).decode()==s['source_utf8']
    processes.append({'path':f,'sha256':sha(read(f)),'exit_code':v['exit_code'],'controller_commit':v['controller_commit'],'whole_source_raw_streams_exact':True})
historical=json.loads(J(prior+'review-r4-process.json')['stdout'])
assert historical['verdict']=='REVISE' and historical['finding']=='F22-FRONT-TITLE-01'
assert [len(historical[k]) for k in ['documents','figures','math_ledger','negative_cases','reference_counterexamples']]==[8,15,45,70,28]
for d in historical['documents']:
    f=L/d['path'];assert sha(f.read_bytes())==d['md_sha256'];assert sha(f.with_suffix('.html').read_bytes())==d['html_sha256']
for a in J(prior+'baseline.json')['inventory']['assets']:assert sha((L/a['path']).read_bytes())==a['raw_sha256']
for f in ['references/authored/course-target-exercises.json','references/authored/didactiek-principes.md','references/authored/economic_mathematical_precision_reference.md','references/authored/economie-terminologie.md','references/external/amstelveencollege_quality_standards.md','agents/teacher-learning-quality-review-agent.md','agents/student-experience-review-agent.md']:
    assert read(f)==git('show','30e42c450774d3600d9fe1f14002eefae670a8b0:'+f)

# Independent current-title and complete-front contract, not author predicates.
registry=J('references/authored/course-target-exercises.json')['exercises']
reg={r['id']:r for r in registry if r['id'].startswith('2.2.')}
goals=[g for i in range(1,4) for g in reg[f'2.2.{i}']['lesson_goals']]
inv=J(prep+'baseline.json')['source_inventory']['inputs']; md=[]
for entry in inv:
    data=(L/entry['path']).read_bytes();assert sha(data)==entry['raw_sha256']
    if not entry['path'].endswith(' – antwoorden.md'):md.append(data.decode())
assert len(md)==4
fs=read(front).decode();css=read(style).decode()
canonical=['Prijselasticiteit','Elasticiteit en omzet','Inkomenselasticiteit en kruislingse elasticiteit','Gemengde opgaven elasticiteit']
def contract(s,documents=md,records=reg):
    assert len(documents)==4 and set(records)=={f'2.2.{i}' for i in range(1,5)}
    soup=BeautifulSoup(s,'html.parser');r=soup.select_one('div.chapter-front');assert r
    assert len(soup.find_all('div'))==1
    assert [x.name for x in r.children if getattr(x,'name',None)]==['h1','h2','table','h2','p','ul','h2','p']
    assert r.h1.get_text()=='Hoofdstuk 2.2 — Elasticiteit'
    assert [x.get_text() for x in r.find_all('h2')]==['Inhoud','Leerdoelen','Een hogere prijs: meer omzet?']
    assert [x.get_text() for x in r.select('ul > li')]==goals
    assert [[x.get_text() for x in tr.find_all('td')] for tr in r.select('tbody tr')]==[[f'2.2.{i+1}',canonical[i]] for i in range(4)]
    for i,d in enumerate(documents):
        ident=f'2.2.{i+1}';suffix=' – opgaven' if i==3 else ''
        assert re.findall(r'^# (.+)$',d,re.M)==[ident+' '+canonical[i]+suffix]
        assert records[ident]['paragraph_title']==(canonical[i] if i<3 else 'Gemengde opgaven: elasticiteit')
    assert not soup.find(['a','img','script','iframe','style'])
    assert all(not any(k.startswith('on') or k in ['hidden','style'] for k in x.attrs) for x in soup.find_all(True))
    intro=r.find_all('p',recursive=False)[-1].get_text()
    assert len(re.findall(r'[.?](?:\s|$)',intro))==4
    assert 'Levert dat meer omzet op?' in intro and 'andere factoren gelijk' in intro and 'die de gegevens werkelijk dragen' in intro
contract(fs)
negatives=[]
def reject(label,fn):
    try:fn()
    except (AssertionError,ValueError,KeyError):negatives.append(label)
    else:raise AssertionError('counterexample accepted: '+label)
reject('exact previous defect',lambda:contract(old.decode()))
reject('all front/title occurrences wrong together',lambda:contract(fs.replace('kruislingse','kruiselingse'),[s.replace('kruislingse','kruiselingse') for s in md],{k:{**v,'paragraph_title':v['paragraph_title'].replace('kruislingse','kruiselingse')} for k,v in reg.items()}))
for i,title in enumerate(canonical):
    reject(f'missing front row {i+1}',lambda i=i,title=title:contract(fs.replace(f'<tr><td>2.2.{i+1}</td><td>{title}</td></tr>','')))
    docs=md.copy();docs[i]=docs[i].replace('# 2.2.','# 9.2.',1)
    reject(f'actual H1 mismatched {i+1}',lambda docs=docs:contract(fs,docs))
    wrongreg={k:dict(v) for k,v in reg.items()};wrongreg[f'2.2.{i+1}']['paragraph_title']+=' Ander onderwerp'
    reject(f'frozen title changed {i+1}',lambda wrongreg=wrongreg:contract(fs,md,wrongreg))
    reject(f'front assigned to wrong paragraph {i+1}',lambda i=i:contract(fs.replace(f'<td>2.2.{i+1}</td>', '<td>2.1.1</td>')))
reject('invented colon mapping in 223',lambda:contract(fs.replace('en kruislingse','en: kruislingse')))
reject('unrequested colon added to224 front',lambda:contract(fs.replace('Gemengde opgaven elasticiteit','Gemengde opgaven: elasticiteit')))
reject('duplicate second H1',lambda:contract(fs,[md[0]+'\n# Tweede titel\n']+md[1:]))
for i,g in enumerate(goals):
    reject(f'missing actual goal {i+1}',lambda g=g:contract(fs.replace('<li>'+g+'</li>','')))
reject('hidden retained goals',lambda:contract(fs.replace('<ul>','<ul hidden>')))
reject('duplicated goal',lambda:contract(fs.replace('</ul>','<li>'+goals[0]+'</li></ul>')))
reject('unsupported certainty',lambda:contract(fs.replace('die de gegevens werkelijk dragen','die altijd waar zijn')))
def css_contract(s):
    rules=tinycss2.parse_stylesheet(s,skip_comments=True,skip_whitespace=True);assert rules
    for r in rules:
        assert r.type=='qualified-rule'
        assert all(re.fullmatch(r'\.chapter-front(?: (?:h1|h2|p|table|th|td|ul|li))?',x.strip()) for x in tinycss2.serialize(r.prelude).split(','))
        for d in tinycss2.parse_declaration_list(r.content,skip_comments=True,skip_whitespace=True):
            assert d.type=='declaration' and not d.important
            assert d.lower_name in ['font-size','line-height','margin','padding','padding-bottom','padding-left','margin-bottom']
            vs=[v for v in d.value if v.type!='whitespace'];assert all(v.type in ['number','dimension'] and v.value>=0 for v in vs)
            if d.lower_name=='font-size':assert len(vs)==1 and vs[0].type=='dimension' and vs[0].lower_unit=='pt' and vs[0].value>=12
            if d.lower_name=='line-height':assert len(vs)==1 and vs[0].type=='number' and vs[0].value>=1.15
css_contract(css)
for name,bad in [('12px instead of12pt',css.replace('12pt','12px')),('global p rule',css+'\np{font-size:12pt}'),('hidden content',css+'\n.chapter-front p{display:none}'),('negative margin',css+'\n.chapter-front p{margin:-2mm}'),('outside adjacent selector',css.replace('.chapter-front h1','.chapter-front + h1')),('forced importance',css.replace('12pt','12pt !important'))]:reject(name,lambda bad=bad:css_contract(bad))
assert sha(read('build-scripts/content/book-2/print_pipeline.py'))=='51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5'
print_pipeline.CSS+='\n'+css
html,assets=print_pipeline.prepare_html(fs,P/front);assert not assets
doc=HTML(string=html).render();pages=[]
for n,page in enumerate(doc.pages,1):
    boxes=[]
    for b in page._page_box.descendants():
        if hasattr(b,'text') and b.text.strip():
            pt=b.style['font_size']*.75;assert pt>=12-1e-6
            assert min(b.position_x,b.position_y)>=0 and b.position_x+b.width<=page.width+1e-6 and b.position_y+b.height<=page.height+1e-6
            boxes.append({'text':b.text,'pt':pt,'x':b.position_x,'y':b.position_y,'width':b.width,'height':b.height})
    pages.append({'page':n,'width':page.width,'height':page.height,'text_boxes':boxes})
author=json.loads(J(prefix+'author-r1-process.json')['stdout'])
root_actual=json.loads(J(root+'r1-layout-process.json')['stdout'])
assert author==root_actual and len(author['negative_cases'])==47 and len(doc.pages)==1
assert pages==author['pages']
assert len(pages[0]['text_boxes'])==43 and author['native_files_written']==0
print(json.dumps({'verdict':'PASS','finding_closed':'F22-FRONT-TITLE-01','front_sha256':expected[front],'css_sha256':expected[style],'layout_sha256':expected[layout],'source_delta_sha256':sha(delta),'complete_source_delta_utf8':delta.decode(),'exact_reversible_single_front_change':True,'prior_review':{'verdict':'REVISE','files':31,'raw_sha256':expected[prior+'report.md'],'attributed_figures':15,'attributed_documents':8,'attributed_math':45,'fresh_full_chapter_review':False},'bound_processes':processes,'independent_counterexamples':negatives,'author_actual_cases':author['negative_cases'],'author_current_output_equals_root_record':True,'canonical_titles':canonical,'twelve_goals':goals,'memory_layout':{'pages':pages,'minimum_pt':min(b['pt'] for b in pages[0]['text_boxes'])},'lesson_writes':0,'native_writes':0,'personal_chapter_views':0,'assembly_input_release':False},ensure_ascii=False,indent=2))
