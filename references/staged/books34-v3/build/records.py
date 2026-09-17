"""Generate version-qualified, populated target candidates from the actual edition.
This does not confer reviewed_final status or write into a repository.
"""
from pathlib import Path
import re,json,csv,hashlib,html
from bs4 import BeautifulSoup
from render import ROOT,chunks,render_md
from content import chapter_data
REV='book34-lesson-balance-v3-20260915'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def normtext(s):return BeautifulSoup(s,'html.parser').get_text(' ',strip=True)
def getfield(section,name):
 m=re.search(r'\*\*'+re.escape(name)+r':\*\*\s*(.*?)(?=\n\n\*\*|\n\n###|\Z)',section,re.S)
 return m[1].strip() if m else ''
def extract_context(qsource, folder):
 """Keep the complete source context; exclude only labelled question paragraphs.

 The plain-text field is usable by text-only clients. The parallel HTML field
 preserves table/figure structure; its asset URLs are relative to package root.
 """
 qt=BeautifulSoup(render_md(qsource),'html.parser')
 for ex in qt.select('.exercise'):
  for p in list(ex.find_all('p')):
   label=p.find('b',recursive=False)
   if label and re.match(r'^[a-z]\.',label.get_text(strip=True)):
    p.decompose()
 for img in qt.find_all('img'):
  local=(folder/img['src']).resolve()
  if not local.is_relative_to(ROOT.resolve()) or not local.is_file():
   raise ValueError('Unresolved context figure: '+str(local))
  img['src']=local.relative_to(ROOT).as_posix()
 context_html=str(qt)
 # Keep a readable row/column relationship in the text-only representation too.
 plain=BeautifulSoup(context_html,'html.parser')
 for table in plain.find_all('table'):
  rows=[' | '.join(cell.get_text(' ',strip=True) for cell in row.find_all(['th','td'])) for row in table.find_all('tr')]
  table.replace_with('\n'+'\n'.join(rows)+'\n')
 context=plain.get_text(' ',strip=True)
 return context,context_html

def payload_hash(source, context, context_html, subquestions, answers, support, figures, answer_figures):
 payload={'source':source,'context':context,'context_html':context_html,
          'subquestions':subquestions,'answers':answers,'support':support,
          'figures':figures,'answer_figures':answer_figures}
 return hashlib.sha256(json.dumps(payload,ensure_ascii=False,sort_keys=True).encode('utf-8')).hexdigest()

def main():
 C=ROOT/'curriculum';T=C/'targets';T.mkdir(exist_ok=True);E=C/'target-excerpts';E.mkdir(exist_ok=True)
 routes=json.loads((C/'lesson-routes-v3.json').read_text(encoding='utf-8'));page_map=json.loads((C/'book-page-map-v3.json').read_text(encoding='utf-8'))
 migration=list(csv.DictReader((ROOT/'outlines/paragraph-migration-v2-to-v3.csv').open(encoding='utf-8')));records=[];catalog=[]
 for folder in sorted((ROOT/'books').glob('*/chapters/*')):
  c=folder.name;b=c[0];a=chapter_data(folder)
  if any(a[k] for k in ['missing_answers','extra_answers','duplicate_questions','duplicate_answers','missing_assets']):raise ValueError('Bad content '+c)
  outline=(ROOT/'outlines'/f'book-{b}-outline-v3.md').read_text(encoding='utf-8')
  for pid,p in a['paragraphs'].items():
   t=a['targets'][pid];section=re.search(r'^### '+re.escape(pid)+r' ([^\n]+)\n(.*?)(?=^### \d|^## |\Z)',outline,re.S|re.M);title=section[1];spec=section[2]
   qsource=t['source_markdown'];context,context_html=extract_context(qsource,folder)
   figs=[]
   for src in re.findall(r'<img[^>]*src="([^\"]+)"',qsource):
    f=folder/src;figs.append({'path':f.relative_to(ROOT).as_posix(),'sha256':sha(f)})
   subs=[];answers={}
   for k in t['question_ids']:
    q=a['questions'][k];soup=BeautifulSoup(q['html'],'html.parser');first=soup.find('b')
    if first:first.decompose()
    pts=None
    for span in soup.find_all('span'):
     m=re.fullmatch(r'\((\d+)p\)',span.get_text(strip=True))
     if m:pts=int(m[1]);span.decompose()
    prompt=soup.get_text(' ',strip=True)
    subs.append({'label':q['label'],'points':pts,'prompt':prompt,'observable_operation':prompt,'source_question_id':k})
    answers[q['label']]=a['answers'][k]['text']
   # Tables/figures that follow target answer blocks are part of the original answer model.
   # Keep them separately; do not manufacture text answers from graph appearance.
   supports=[]
   for pg in chunks(folder/'Antwoorden.md'):
    soup=BeautifulSoup(render_md(pg['body']),'html.parser')
    for el in soup.select('.answer-block'):
     at=el.get('data-answer','');eid=el.get('id','')
     matches=(at==t['exercise'] or re.fullmatch(re.escape(t['exercise'])+'[a-z]',at) or eid in ['ans'+t['exercise'],'ans'+t['exercise']+'v'])
     if not matches:continue
     for sib in el.next_siblings:
      if getattr(sib,'name',None):
       if 'answer-block' in sib.get('class',[]) or sib.name in ['h1','h2','h3']:break
       if sib.name in ['table','figure']:supports.append(str(sib))
   supports=list(dict.fromkeys(supports))
   answerfigs=[]
   for src in re.findall(r'<img[^>]*src="([^\"]+)"','\n'.join(supports)):
    f=folder/src;answerfigs.append({'path':f.relative_to(ROOT).as_posix(),'sha256':sha(f)})
   old=[row for row in migration if row['new_id']==pid]
   disposition=old[0]['disposition'] if old else 'new'
   record={
    'id':pid,'module':int(b),'chapter':int(c[-1]),'paragraph':int(pid[-1]),'paragraph_title':title,
    'paragraph_kind':'gemengde_opgaven' if title.startswith('Gemengde') else 'theory','introduces_new_theory':not title.startswith('Gemengde'),
    'structure_revision':REV,'source_identity':{'revision':REV,'paragraph_id':pid,'edition':'books-'+b+'-v3','outline':f'references/authored/book-outlines/book-{b}-outline.md','package_outline':f'outlines/book-{b}-outline-v3.md'},
    'record_status':'candidate_review_ready','independent_review_status':'not_conferred_by_authoring_package',
    'target_exercise':{'placeholder':False,'exercise_number':t['exercise'],'context':context,'context_html':context_html,'context_html_base':'package_root','sources':[{'id':'printed-target-source','type':'markdown','content':qsource}],'figures':figs,'subquestions':subs},
    'short_answer_model':answers,'answer_model_support_html':supports,'answer_figures':answerfigs,
    'lesson_goals':[x.strip() for x in re.split(r'(?=Je kunt)', ' '.join(p['goals']).replace('Lesdoelen','').replace('Doel ','',1)) if x.strip()],
    'required_skills':[],'operation_specs':[{'local_operation_id':pid+'-'+q['label'],'description':q['observable_operation']} for q in subs],
    'prior_knowledge_assumed':[getfield(spec,'Retrieval and transfer')],'new_skills_introduced':[getfield(spec,'Intended learning')] if not title.startswith('Gemengde') else [],
    'exam_codes':[],'missing_units_flagged':['Canonical machine-skill/exam mapping is not inferred or minted by this authoring package.'],
    'scope_boundary':getfield(spec,'Boundary and review focus'),
    'source_ref':f'references/owned/course-blueprint-v5.md §{pid}',
    'structural_retrieval_plan':getfield(spec,'Retrieval and transfer'),
    'structural_scope_boundary':getfield(spec,'Boundary and review focus'),
    'source_pin':{'student_file':(folder/t['file']).relative_to(ROOT).as_posix(),'student_manuscript_sha256':sha(folder/t['file']),'answer_file':(folder/'Antwoorden.md').relative_to(ROOT).as_posix(),'answer_file_sha256':sha(folder/'Antwoorden.md'),'chapter_student_pages':t['pages'],'complete_book_pages':page_map[b]['chapters'][c]['paragraphs'][pid]['target_book_pages']},
    'lesson_route':routes[pid],'historical_source_refs':[{'revision':x['from_revision'],'paragraph_id':x['old_id'],'disposition':x['disposition'],'inherits_approval':False,'target_equivalence':False} for x in old],
    'v5_migration':{'source_status':'candidate_review_ready','review_required_before_final':True,'structural_revision':REV},
    'review_boundaries':['Author calculation/source checks are documented separately.','No independent target approval is inherited from an old numeric ID.','Classroom timing is not measured.']
   }
   record['target_payload_schema']='source-context-questions-answers-assets-v2'
   record['target_payload_sha256']=payload_hash(qsource,context,context_html,subs,answers,supports,figs,answerfigs)
   (T/f'{pid}.json').write_text(json.dumps(record,ensure_ascii=False,indent=2), encoding='utf-8', newline='\n')
   # The excerpts reference exact chapter assets; all referenced files ship in the package.
   excerpt='# '+pid+' · '+title+'\n\nRevision: `'+REV+'`. Exercise '+t['exercise']+'. Candidate: independent approval not conferred.\n\n'+qsource+'\n\n# Antwoorden\n\n'
   for k in t['question_ids']:excerpt+=a['answers'][k]['html']+'\n\n'
   excerpt+='\n'.join(supports)
   excerpt=re.sub(r'src="(_assets/[^\"]+)"',lambda m:'src="../../'+(folder/m[1]).relative_to(ROOT).as_posix()+'"',excerpt)
   (E/f'{pid}.md').write_text(excerpt, encoding='utf-8', newline='\n')
   records.append(record);catalog.append({'paragraph_id':pid,'title':title,'target':t['exercise'],'old_ids':';'.join(x['old_id'] for x in old),'disposition':disposition,'record_status':record['record_status'],'source':record['source_pin']['student_file'],'target_payload_sha256':record['target_payload_sha256'],'one_lesson_status':routes[pid]['one_lesson_status']})
 (C/'course-target-exercises-books34-v3.json').write_text(json.dumps({'schema_version':1,'description':'Books 3/4 target payload module; merge through local repository workflow without overwriting Books 1/2.','structure_revision':REV,'records':records},ensure_ascii=False,indent=2), encoding='utf-8', newline='\n')
 with (C/'target-catalog-v3.csv').open('w',newline='', encoding='utf-8') as f:w=csv.DictWriter(f,fieldnames=catalog[0].keys());w.writeheader();w.writerows(catalog)
 blueprint='# Books 3–4 — current v3 curriculum projection\n\nRevision: `'+REV+'`. This is the finished local-edition projection for coding-agent integration, not a live repository edit.\n\n'
 blueprint+='The owner-adopted v3 outlines and the delivered student/answer books control this scoped revision. The detailed target payloads are candidates for actual review, not empty placeholders or automatic approvals.\n\n## Counts and test boundaries\n\nYear 1 remains **12 + 12 + 14 + 17 = 55**. Book 3 stays 6+4+4; Book 4 becomes 5+7+5. The formal test-week rule remains one book per test week. Long-run entry/exit and normal remuneration are now first assessed with Book 4, not Book 3. Books 1 and 2 remain unchanged.\n\n'
 for b in ['3','4']:
  blueprint+='## Book '+b+'\n\n| Paragraph | Title | Target | Status |\n|---|---|---:|---|\n'
  for r in records:
   if r['module']==int(b):blueprint+=f'| {r["id"]} | {r["paragraph_title"]} | {r["target_exercise"]["exercise_number"]} | candidate_review_ready |\n'
  for r in records:
   if r['module']!=int(b):continue
   blueprint+=f'\n### §{r["id"]} - {r["paragraph_title"]}\n\n'
   blueprint+=f'Target: opgave {r["target_exercise"]["exercise_number"]}; status `candidate_review_ready`; revisie `{REV}`.\n\n'
   blueprint+='Lesdoelen: '+' '.join(r['lesson_goals'])+'\n\n'
   blueprint+='Voorkennis en transfer: '+r['structural_retrieval_plan']+'\n\n'
   blueprint+='Afbakening: '+r['structural_scope_boundary']+'\n\n'
   blueprint+='Exacte bron: `'+r['source_pin']['student_file']+'`. Bron- en doelidentiteiten: `curriculum/targets/'+r['id']+'.json`.\n'

 blueprint+='''\n## Deferred, not missing or secretly assessed\n\nFormer v2 §4.3.5 collective bargaining/cao/agreement-policy evaluation is outside the Year 1 teaching and assessment scope. Its original source is preserved in `historical-inputs/deferred-4.3.5`. No later-year numeric lesson, capacity or approval has been invented. The receiving curriculum must explicitly teach those goals before assuming them.\n\n## Three-year umbrella\n\nThe yearly and whole-course arithmetic does not change from the already selected 55-unit Year 1 baseline. Preserve the existing later-year counts and historical maturity figures. Update only the Book 3 short-run boundary, Book 4 opening, current labour scope and associated cross-references. The old lower-count historical model is not rewritten as if it had always contained v3.\n\n## Outstanding matters\n\nThe five existing timing conflicts at 3.1.2, 3.1.3, 3.1.5, 4.2.4 and 4.2.5 remain explicit. Other time estimates are not classroom proof. Target candidate review is distinct from the owner’s placement decision. Book 1 first edition remains the active classroom edition; its second edition is outside this package.\n'''
 (C/'blueprint-books34-v3.md').write_text(blueprint, encoding='utf-8', newline='\n')
 (C/'structure-v3.json').write_text(json.dumps({'revision':REV,'year_1_counts':{'1':12,'2':12,'3':14,'4':17},'chapter_counts':{'3.1':6,'3.2':4,'3.3':4,'4.1':5,'4.2':7,'4.3':5},'current_paragraph_ids':[r['id'] for r in records],'deferred_old_ids':[{'revision':'book34-chat-v2-20260914','id':'4.3.5','later_year_destination':None,'later_year_time_allocation':None}],'source_authority':'owner-adopted v3 outlines and actual local edition, within this explicit revision','target_approval':'not_automatic','live_repository_updated':False},indent=2), encoding='utf-8', newline='\n')
 print('Generated',len(records),'populated candidates;',sum(len(r['target_exercise']['subquestions']) for r in records),'target subquestions')
if __name__=='__main__':main()
