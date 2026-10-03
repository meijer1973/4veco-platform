import os
#!/usr/bin/env python3
"""Read the supplied second-edition chapters; never substitute first-edition files."""
from pathlib import Path
import re,json,hashlib,unicodedata
from bs4 import BeautifulSoup
import fitz
R=Path(os.environ['BOOK1_EDITION_ROOT'])
TITLES=['Economisch denken en rekenen','Vraag','Aanbod en marktevenwicht']
ENDS=['Economisch_denken_en_rekenen','Vraag','Aanbod_en_marktevenwicht']
M={'book':{'nr':1,'title':'Grondslagen, vraag en aanbod','edition':'Tweede editie','year':2026},'cover':'bronnen/omslag/achtergrond.png','chapters':[],'files':{'student':'Boek_1_Compleet_Tweede_editie.pdf','answers':'Boek_1_Compleet_Antwoorden_Tweede_editie.pdf','teacher':'Boek_1_Compleet_Docenteninformatie_Tweede_editie.pdf'}}
G={}
for nr,(title,end) in enumerate(zip(TITLES,ENDS),1):
 S=R/'bronnen'/f'H{nr}'
 intro=BeautifulSoup((S/'Voorblad.md').read_text(encoding='utf8'),'html.parser')
 ch={'nr':nr,'id':f'1.{nr}','title':title,'student':f'hoofdstukken/H{nr}/Boek_1_H{nr}_{end}_Tweede_editie.pdf','answers':f'hoofdstukken/H{nr}/Boek_1_H{nr}_Antwoorden_Tweede_editie.pdf','teacher':f'hoofdstukken/H{nr}/Boek_1_H{nr}_Docenteninformatie_Tweede_editie.pdf','paragraphs':[],'intro_entries':[],'source_dir':S.relative_to(R).as_posix()}
 for a in intro.select('.contents a'):
  span=a.select_one('b span') or a.select_one('span')
  pn=int(span.text.strip());span.extract();t=a.select_one('b').get_text(' ',strip=True)
  t=re.sub(r'\s+',' ',t).replace(' · ',' ').strip()
  if re.fullmatch(r'1\.\d\.\d',t):t=a.get_text(' ',strip=True)
  e={'title':t,'local_page':pn}
  ch['intro_entries'].append(e)
  if re.match(r'1\.\d\.\d',t):ch['paragraphs'].append(e)
 with fitz.open(R/ch['student']) as d:
  ch['pages']=len(d)
  assert ch['pages']==40
  ch['original_bookmarks']=d.get_toc()
 for kind in ['student','answers']:
  with fitz.open(R/ch[kind]) as d:
   loc={}
   for i,p in enumerate(d):
    for line in p.get_text().splitlines():
     m=re.match(r'^Opgave\s+(\d+[A-Z]?)\b',line)
     if m and m.group(1) not in loc: loc[m.group(1)]=i+1
   ch[kind+'_exercises']=loc
 assert set(ch['student_exercises'])==set(ch['answers_exercises'])==set(map(str,range(1,39))),nr
 ch['answer_exercises']=ch.pop('answers_exercises')
 # Exercise membership is derived from printed start pages, not a guess based on counts.
 for k,para in enumerate(ch['paragraphs']):
  start=para['local_page'];stop=ch['paragraphs'][k+1]['local_page'] if k<3 else 39
  ex=[int(n) for n,pn in ch['student_exercises'].items() if start<=pn<stop]
  para['exercise_first']=min(ex);para['exercise_last']=max(ex)
  para['answer_local_page']=ch['answer_exercises'][str(min(ex))]
 overview=S/'Hoofdstukoverzicht.md';soup=BeautifulSoup(overview.read_text(encoding='utf8'),'html.parser')
 entries=soup.select('.glossary-columns .term p')
 assert len(entries)==16,(nr,len(entries))
 for p in entries:
  b=p.find(['b','strong']);term=b.get_text(' ',strip=True);b.extract()
  definition=p.get_text(' ',strip=True);key=term.casefold()
  if key not in G:G[key]={'term':term,'definitions':[]}
  G[key]['definitions'].append({'text':definition,'chapter':nr,'local_page':40,'source_file':overview.relative_to(R).as_posix()})
 ch['mixed_target']={'nr':36 if nr==1 else 37,'local_spread':[36,37]}
 M['chapters'].append(ch)
(R/'manifest.json').write_text(json.dumps(M,ensure_ascii=False,indent=2), encoding='utf8', newline='\n')
G=sorted(G.values(),key=lambda e:unicodedata.normalize('NFKD',e['term'].casefold()))
(R/'book_matter/glossary.json').write_text(json.dumps(G,ensure_ascii=False,indent=2), encoding='utf8', newline='\n')
inputs=[R/M['cover'],R/'bronnen/omslag/data.json']+[R/c[k] for c in M['chapters'] for k in ['student','answers','teacher']]
hashes={p.relative_to(R).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in inputs}
(R/'qa/input_hashes.json').write_text(json.dumps(hashes,indent=2), encoding='utf8', newline='\n')
print('Glossary',len(G),'terms;',sum(len(e['definitions']) for e in G),'source definitions')
for c in M['chapters']:print(c['id'],c['paragraphs'])
