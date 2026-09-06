"""Source/DOM/layout preparation only: no PDF/HTML/PNG writes or visual PASS.

HOW TO ADAPT: change the exact source paths and raw pins through distinct review.
The native chapter builder must separately gate accepted inputs and production.
"""
from pathlib import Path
import hashlib, json, re, sys
sys.dont_write_bytecode = True
P=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(P/'build-scripts/content/book-2'))
from bs4 import BeautifulSoup
import tinycss2
import print_pipeline
from weasyprint import HTML

front=P/'build-scripts/content/book-2/22/front.html'
style=P/'build-scripts/content/book-2/22/front.css'
sha=lambda b:hashlib.sha256(b).hexdigest()
registry=json.loads((P/'references/authored/course-target-exercises.json').read_text(encoding='utf-8-sig'))
goals=[goal for row in registry['exercises'] if row['id'] in ('2.2.1','2.2.2','2.2.3') for goal in row['lesson_goals']]
source=front.read_text(encoding='utf-8');css=style.read_text(encoding='utf-8')
titles=['Prijselasticiteit','Elasticiteit en omzet','Inkomenselasticiteit en kruislingse elasticiteit','Gemengde opgaven elasticiteit']

# F22-FRONT-TITLE-01: pupil headings, not legacy folder spellings, govern.
# The already reviewed mixed title intentionally omits the registry's colon.
# This is an explicit existing presentation mapping, not a target rewrite.
inventory=json.loads((P/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-22-ASSEMBLY-PREP-baseline.json').read_text(encoding='utf-8'))['source_inventory']['inputs']
selected=[row for row in inventory if not row['path'].endswith(' – antwoorden.md')]
assert len(selected)==4
canonical_title_bindings=[]
title_fixtures=[]

def check_title_binding(i,md,frozen_title):
    ident=f'2.2.{i+1}'
    suffix=' – opgaven' if i==3 else ''
    assert re.findall(r'^# (.+)$',md,re.M)==[ident+' '+titles[i]+suffix]
    assert frozen_title==(titles[i] if i<3 else 'Gemengde opgaven: elasticiteit')

for i,row in enumerate(selected):
    filename=(P.parent/'4veco-lessen'/row['path']).resolve()
    # DATA-only long path; ordinary script path, cwd and inherited PATH remain.
    readable=Path('\\\\?\\'+str(filename)) if sys.platform=='win32' else filename
    data=readable.read_bytes()
    assert sha(data)==row['raw_sha256']
    record=next(v for v in registry['exercises'] if v['id']==f'2.2.{i+1}')
    md=data.decode('utf-8');frozen_title=record['paragraph_title']
    check_title_binding(i,md,frozen_title)
    canonical_title_bindings.append({'id':record['id'],'selected_MD':row['path'],'raw_sha256':sha(data),'pupil_title':titles[i],'frozen_title':frozen_title,'mapping':'exact' if i<3 else 'existing reviewed mixed display title omits colon'})
    title_fixtures.append((i,md,frozen_title))
def check_source(s):
    soup=BeautifulSoup(s,'html.parser'); print_pipeline.validate_source_html(soup)
    roots=[node for node in soup.contents if getattr(node,'name',None)]
    assert len(roots)==1 and roots[0].name=='div' and roots[0].get('class')==['chapter-front']
    root=roots[0]
    assert [node.name for node in root.children if getattr(node,'name',None)]==['h1','h2','table','h2','p','ul','h2','p']
    assert root.h1.get_text()=='Hoofdstuk 2.2 — Elasticiteit'
    assert [node.get_text() for node in root.find_all('h2')]==['Inhoud','Leerdoelen','Een hogere prijs: meer omzet?']
    assert [[v.get_text() for v in row.find_all('td')] for row in root.table.tbody.find_all('tr')]==[[f'2.2.{n}',t] for n,t in enumerate(titles,1)]
    assert [node.get_text() for node in root.ul.find_all('li',recursive=False)]==goals
    assert not soup.find(['img','a','script','iframe'])
    intro=root.find_all('p',recursive=False)[-1].get_text()
    assert len(re.findall(r'[.?](?:\s|$)',intro))==4
    for phrase in ['Levert dat meer omzet op?','procentuele veranderingen','andere factoren gelijk','die de gegevens werkelijk dragen']:
        assert phrase in intro
    assert not re.search(r'noodzakelijk goed|garandeert|altijd meer omzet|online|website|[0-9]+ minuten',root.get_text(),re.I)
    return {'goals':goals,'contents':titles,'intro':intro}
def check_css(s):
    rules=tinycss2.parse_stylesheet(s,skip_comments=True,skip_whitespace=True)
    assert rules and all(rule.type=='qualified-rule' for rule in rules)
    fonts=[]
    for rule in rules:
        selector=tinycss2.serialize(rule.prelude).strip()
        assert all(re.fullmatch(r'\.chapter-front(?: (?:h1|h2|p|table|th|td|ul|li))?',part.strip()) for part in selector.split(','))
        for d in tinycss2.parse_declaration_list(rule.content,skip_comments=True,skip_whitespace=True):
            assert d.type=='declaration' and not d.important
            assert d.lower_name in {'font-size','line-height','margin','padding-bottom','padding','padding-left','margin-bottom'}
            assert all(t.type in {'number','dimension','whitespace','ident'} for t in d.value)
            if d.lower_name=='font-size':
                meaningful=[t for t in d.value if t.type!='whitespace']
                assert len(meaningful)==1 and meaningful[0].type=='dimension' and meaningful[0].lower_unit=='pt' and meaningful[0].value>=12
                fonts.append({'selector':selector,'pt':meaningful[0].value})
            if d.lower_name=='line-height':
                meaningful=[t for t in d.value if t.type!='whitespace']
                assert len(meaningful)==1 and meaningful[0].type=='number' and meaningful[0].value>=1.15
    return fonts
content=check_source(source);fonts=check_css(css);negative=[]
def rejects(name,call):
    try:call()
    except (AssertionError,ValueError):negative.append(name)
    else:raise AssertionError('Negative was accepted: '+name)
for n,goal in enumerate(goals,1):
    rejects(f'missing exact goal {n}',lambda g=goal:check_source(source.replace('<li>'+g+'</li>','')))
    rejects(f'forged exact goal {n}',lambda g=goal:check_source(source.replace(g,g+' Altijd.')))
rejects('duplicate goal',lambda:check_source(source.replace('</ul>','<li>'+goals[0]+'</li></ul>')))
rejects('unbounded claim',lambda:check_source(source.replace('Levert dat meer omzet op?','Dit garandeert altijd meer omzet.')))
rejects('active HTML',lambda:check_source(source.replace('</div>','<script>x</script></div>')))
rejects('external support',lambda:check_source(source.replace('</div>','<a href="https://example.com">Hulp</a></div>')))
rejects('wrong chapter',lambda:check_source(source.replace('Hoofdstuk 2.2','Hoofdstuk 2.1')))
rejects('sub12pt',lambda:check_css(css.replace('12pt','11pt')))
rejects('global paragraph styling',lambda:check_css(css.replace('.chapter-front h1','h1')))
rejects('similar but unscoped class',lambda:check_css(css.replace('.chapter-front h1','.chapter-frontier h1')))
rejects('outside adjacent paragraph',lambda:check_css(css.replace('.chapter-front h1','.chapter-front + p')))
rejects('compressed line height',lambda:check_css(css.replace('1.18','0.8')))
rejects('legacy folder spelling is not pupil title',lambda:check_source(source.replace('Inkomenselasticiteit en kruislingse elasticiteit','Inkomenselasticiteit en kruiselingse elasticiteit')))
for i,md,frozen_title in title_fixtures:
    rejects(f'forged actual pupil H1 {i+1}',lambda i=i,md=md,t=frozen_title:check_title_binding(i,md.replace('# 2.2.','# 9.2.',1),t))
    rejects(f'forged frozen title {i+1}',lambda i=i,md=md,t=frozen_title:check_title_binding(i,md,t+' Onjuist'))
    rejects(f'forged front title {i+1}',lambda i=i:check_source(source.replace('<td>'+titles[i]+'</td>','<td>'+titles[i]+' Onjuist</td>')))
assert sha((P/'build-scripts/content/book-2/print_pipeline.py').read_bytes())=='51680fdffab6a62265857e19bce16a8c29010b7e1787a9c73c32ed7dcc5306e5'
# Isolated process-local front selector extension, not a shared source edit.
print_pipeline.CSS+='\n'+css
html,assets=print_pipeline.prepare_html(source,front)
assert assets==[]
document=HTML(string=html).render()
pages=[]
for number,page in enumerate(document.pages,1):
    boxes=[]
    for b in page._page_box.descendants():
        if hasattr(b,'text') and b.text.strip():
            pt=b.style['font_size']*.75
            assert pt>=12-1e-6,(b.text,pt)
            assert b.position_x>=0 and b.position_y>=0 and b.position_x+b.width<=page.width+1e-6 and b.position_y+b.height<=page.height+1e-6
            boxes.append({'text':b.text,'pt':pt,'x':b.position_x,'y':b.position_y,'width':b.width,'height':b.height})
    pages.append({'page':number,'width':page.width,'height':page.height,'text_boxes':boxes})
result={'status':'AUTHOR_FRONT_SOURCE_AND_IN_MEMORY_LAYOUT_CHECK','source_sha256':sha(front.read_bytes()),'style_sha256':sha(style.read_bytes()),'canonical_title_bindings':canonical_title_bindings,'content':content,'font_rules':fonts,'negative_cases':negative,'page_count':len(pages),'pages':pages,'native_files_written':0,'personal_views':0,'visual_verdict':'NOT_REVIEWED','assembly_release':False}
print(json.dumps(result,ensure_ascii=False,indent=2))
assert len(pages)==1,'Front must occupy one page; actual diagnostic retained'
