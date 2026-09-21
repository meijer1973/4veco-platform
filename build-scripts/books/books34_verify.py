"""Current edition checks, based on the received validator.

Run through verify_exercise_routes.py; keep historical evidence unchanged.
"""
from pathlib import Path
import re,json,hashlib,unicodedata,fitz,sys,subprocess
from bs4 import BeautifulSoup
from content import chapter_data
from render import ROOT,chunks

def normal(text):
 return re.sub(r'[^a-z0-9]', '',unicodedata.normalize('NFKD',text).lower())

def main(report_path=None):
 failures=[];warnings=[];checks=[];counts={}
 def ck(name,ok,detail=None):
  checks.append({'name':name,'pass':bool(ok),'detail':detail})
  if not ok:failures.append(name)
 cfg=json.loads((ROOT/'curriculum/chapter-config.json').read_text(encoding='utf-8'));bookmap=json.loads((ROOT/'curriculum/book-page-map-v3.json').read_text(encoding='utf-8'))
 module=json.loads((ROOT/'curriculum/course-target-exercises-books34-v3.json').read_text(encoding='utf-8'));records={r['id']:r for r in module['records']}
 ck('31 unique populated targets',len(records)==31)
 allids=[];questions=0;answers=0;exercise_count=0
 for c,config in cfg.items():
  folder=ROOT/config['path'];a=chapter_data(folder);allids+=list(a['paragraphs']);questions+=len(a['questions']);answers+=len(a['answers']);exercise_count+=sum(len(x['exercises']) for x in a['paragraphs'].values())
  for key in ['missing_answers','extra_answers','duplicate_questions','duplicate_answers','missing_assets']:ck(c+' '+key,not a[key],a[key])
  for kind,label in [('student','Leerling'),('answer','Antwoorden'),('teacher','Docenteninformatie')]:
   fp=folder/'output'/f'Boek_{c[0]}_H{c[2]}_{label}_v3.pdf';doc=fitz.open(fp);text='\n'.join(p.get_text() for p in doc);nt=normal(text)
   ck(c+' '+kind+' valid PDF',len(doc)>0 and not doc.is_encrypted)
   hs=BeautifulSoup(fp.with_suffix('.html').read_text(encoding='utf-8'),'html.parser')
   anchorids={x['id'] for x in hs.select('[id]')}
   brokenanchors=sorted({x['href'] for x in hs.select('a[href]') if x['href'].startswith('#') and x['href'][1:] not in anchorids})
   ck(c+' '+kind+' local HTML anchors resolve',not brokenanchors,brokenanchors)
   if kind=='student':ck(c+' page ceiling',len(doc)<=config['student_page_limit'],[len(doc),config['student_page_limit']])
   # Source-ending checks detect missing question/answer text while tolerating PDF layout whitespace.
   misses=[]
   for k,v in (a['questions'].items() if kind=='student' else a['answers'].items() if kind=='answer' else []):
    nv=normal(v['text'])
    if nv and (nv[:60] not in nt or nv[-60:] not in nt):misses.append(k)
   ck(c+' '+kind+' source endpoint text coverage',not misses,misses)
   raw=[];outside=[]
   for i,p in enumerate(doc):
    for line in p.get_text().splitlines():
     if re.match(r'^\s*\|.*\|\s*$',line):raw.append([i+1,line[:90]])
    for bl in p.get_text('blocks'):
     if bl[0]<-1 or bl[1]<-1 or bl[2]>p.rect.width+1 or bl[3]>p.rect.height+1:outside.append(i+1)
   ck(c+' '+kind+' no raw table markup',not raw,raw)
   ck(c+' '+kind+' text within page',not outside,sorted(set(outside)))
   doc.close()
  for pid,target in a['targets'].items():
   r=records[pid];ck(pid+' target number',r['target_exercise']['exercise_number']==target['exercise'])
   ck(pid+' question membership',set(target['question_ids'])==set(q['source_question_id'] for q in r['target_exercise']['subquestions']))
   ck(pid+' manuscript hash',r['source_pin']['student_manuscript_sha256']==hashlib.sha256((folder/target['file']).read_bytes()).hexdigest())
   ck(pid+' answers hash',r['source_pin']['answer_file_sha256']==hashlib.sha256((folder/'Antwoorden.md').read_bytes()).hexdigest())
   ck(pid+' no fabricated final status',r['record_status']=='candidate_review_ready' and not r['target_exercise']['placeholder'])
   if len(target['pages'])==2:ck(pid+' facing target pages',target['pages'][0]%2==0 and target['pages'][1]==target['pages'][0]+1,target['pages'])
  counts[c]={'paragraphs':len(a['paragraphs']),'questions':len(a['questions']),'answers':len(a['answers'])}
 ck('31 IDs agree with records',set(allids)==set(records));ck('Book3 14 / Book4 17',sum(p.startswith('3.') for p in allids)==14 and sum(p.startswith('4.') for p in allids)==17)
 for b,book in bookmap.items():
  f=ROOT/'books'/f'book-{b}'/'output'/f'Boek_{b}_Compleet_v3.pdf';d=fitz.open(f)
  ck('Book '+b+' student count',len(d)==book['student_pages'])
  ck('Book '+b+' no duplicate contents link rectangles',len(d[3].get_links())==len({tuple(round(x,1) for x in l['from']) for l in d[3].get_links()}))
  ck('Book '+b+' paragraph bookmarks',sum(level==2 for level,_,_ in d.get_toc())==(14 if b=='3' else 17))
  for c,v in book['chapters'].items():
   ck(c+' opens recto',v['student_start']%2==1)
   for j in range(v['student_pages']):
    pg=v['student_start']-1+j;tail=d[pg].get_text().splitlines()[-1].strip()
    ck(c+' continuous footer '+str(j+1),tail==str(pg+1),tail if tail!=str(pg+1) else None)
   # Intro numeric chapter locators were translated together with running page numbers.
  links=[l for p in d for l in p.get_links() if l['kind']==fitz.LINK_GOTO]
  ck('Book '+b+' valid internal link destinations',all(0<=l['page']<len(d) for l in links),len(links))
  ck('Book '+b+' even page count',len(d)%2==0)
  d.close()
 # Scope protections apply to current source, not the retained historical inputs.
 b3='\n'.join((ROOT/'books/book-3/chapters'/c/f'{pid} manuscript.md').read_text(encoding='utf-8') for c in ['3.1','3.2','3.3'] for pid in records if pid.startswith(c))
 ck('Book3 no old three-moment capstone',not any(x in b3 for x in ['Kweekkorrels op drie momenten','Na verloop van tijd kunnen bedrijven vrij toetreden']))
 b43='\n'.join((ROOT/'books/book-4/chapters/4.3'/f'{pid} manuscript.md').read_text(encoding='utf-8') for pid in records if pid.startswith('4.3.'))
 ck('No active labour agreement target',not re.search(r'\bcao\b|\bvakbonden\b',b43,re.I))
 ba=(ROOT/'books/book-4/chapters/4.3/Antwoorden.md').read_text(encoding='utf-8')
 ck('Labour answer contents describes current 41 exercises', 'bij de 41 opgaven' in ba and '4.3.6 Gemengde' not in ba and 'Vakbonden' not in ba)
 ck('New derivatives target has no optimisation request',not re.search(r'winstmaximal|MO = MK',records['3.2.2']['target_exercise']['sources'][0]['content'],re.I))
 ck('Old labour institutional source preserved',(ROOT/'historical-inputs/deferred-4.3.5/4.3.5 manuscript-v2.md').is_file())
 ck('No font binaries distributed',not any(p.suffix.lower() in ['.ttf','.otf','.woff','.woff2'] for p in ROOT.rglob('*') if p.is_file()))
 # Check complete book matter too, not only source chapter pages.
 for fp in sorted((ROOT/'books').glob('*/output/*.pdf')):
  doc=fitz.open(fp);t='\n'.join(p.get_text() for p in doc)
  raw=[(i+1,line) for i,p in enumerate(doc) for line in p.get_text().splitlines() if '**' in line or line.startswith('### ')]
  out=[i+1 for i,p in enumerate(doc) for bl in p.get_text('blocks') if bl[0]<-1 or bl[1]<-1 or bl[2]>p.rect.width+1 or bl[3]>p.rect.height+1]
  ck(fp.stem+' no raw emphasis/heading markup',not raw,raw)
  ck(fp.stem+' all text within physical page',not out,sorted(set(out)))
  doc.close()
 routes=json.loads((ROOT/'curriculum/lesson-routes-v3.json').read_text(encoding='utf-8'))
 expectedopen={'3.1.2','3.1.3','3.1.5','4.2.4','4.2.5'}
 ck('Existing timing conflicts remain explicit',{k for k,v in routes.items() if v['one_lesson_status']=='open_existing_timing_conflict'}==expectedopen)
 ck('Theory timing includes guided practice without a false55 certificate',all(v.get('route_exception') or (v['total_minutes'] is None and 'Begeleide inoefening' in v['normal_route'] and 'Begeleide inoefening' in v['minutes']) for v in routes.values()))
 report={'scope':'Local author checks of current v3 edition; independent target approval and classroom measurement are not claimed.','checks':len(checks),'failures':failures,'warnings':warnings,'questions':questions,'answers':answers,'exercises':exercise_count,'targets':len(records),'chapter_counts':counts,'results':checks}
 (report_path or ROOT/'checks/route-revision-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2), encoding='utf-8', newline='\n')
 print('Verification:',len(checks),'checks;',len(failures),'failures;',questions,'questions;',answers,'answers')
 if failures:print('\n'.join(failures));raise SystemExit(1)
if __name__=='__main__':main()
