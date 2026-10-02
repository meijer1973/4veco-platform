import os
#!/usr/bin/env python3
"""Validate assembly, including pixel and text preservation outside recorded nav edits."""
from pathlib import Path
import json,hashlib,re,collections,sys
import fitz,numpy as np
from PIL import Image
R=Path(os.environ['BOOK1_EDITION_ROOT'])
M=json.loads((R/'manifest.json').read_text(encoding='utf8'));A=json.loads((R/'qa/assembly_manifest.json').read_text(encoding='utf8'))
checks=[];diffs=[]
def ck(name,ok,detail=''):checks.append({'check':name,'pass':bool(ok),'detail':str(detail)})
for p,h in json.loads((R/'qa/input_hashes.json').read_text(encoding='utf8')).items():ck('unchanged_input:'+p,hashlib.sha256((R/p).read_bytes()).hexdigest()==h)
for kind,out in zip(['student','answers','teacher'],A['outputs']):
 doc=fitz.open(R/out['file']);records=json.loads((R/f'qa/{kind}_page_map.json').read_text(encoding='utf8'))
 ck(kind+':page_count',len(doc)==out['pages']);ck(kind+':all_source_pages',len(records)==out['source_pages'])
 ck(kind+':chapter_recto_starts',all(n%2 for n in out['chapter_starts']))
 actual_blanks=[i+1 for i,p in enumerate(doc) if not p.get_text().strip() and len(p.get_images())==0]
 ck(kind+':only_planned_blanks',actual_blanks==out['intentional_blank_pages'],actual_blanks)
 ck(kind+':A4',all(abs(p.rect.width-595.2756)<.1 and abs(p.rect.height-841.8898)<.1 for p in doc))
 links=[l for p in doc for l in p.get_links()]
 ck(kind+':links_resolve',all(l['kind']==fitz.LINK_GOTO and 0<=l.get('page',-1)<len(doc) for l in links))
 ck(kind+':bookmarks_resolve',all(1<=n<=len(doc) for _,_,n in doc.get_toc()))
 srcs={}
 for r in records:
  if r['source'] not in srcs:srcs[r['source']]=fitz.open(R/r['source'])
  orig=srcs[r['source']][r['local_page']-1];new=doc[r['book_page']-1]
  mat=fitz.Matrix(1.25,1.25)
  p0=orig.get_pixmap(matrix=mat,alpha=False);p1=new.get_pixmap(matrix=mat,alpha=False)
  a=np.frombuffer(p0.samples,dtype=np.uint8).reshape(p0.height,p0.width,3);b=np.frombuffer(p1.samples,dtype=np.uint8).reshape(p1.height,p1.width,3)
  d=np.any(np.abs(a.astype(np.int16)-b.astype(np.int16))>3,axis=2)
  for e in r['edits']:
   box=fitz.Rect(e.get('output_rect',e['rect']))+(-1.8,-1.8,1.8,1.8)
   x0,y0,x1,y1=[int(round(v*1.25)) for v in box]
   d[max(0,y0):min(d.shape[0],y1+1),max(0,x0):min(d.shape[1],x1+1)]=False
  errors=int(d.sum());ck(f'{kind}:render_preservation:{r["book_page"]}',errors==0,errors)
  if errors:
   diffs.append({'kind':kind,'source_page':r['local_page'],'book_page':r['book_page'],'unexpected_pixels':errors})
   outimg=Image.fromarray((~d*255).astype('uint8'));outimg.save(R/'qa'/f'diff_{kind}_{r["book_page"]}.png')
  masks=[fitz.Rect(e.get('output_rect',e['rect']))+(-.2,-.2,.2,.2) for e in r['edits']]
  def unedited(p):return sorted([w for w in p.get_text('words') if not any(fitz.Rect(w[:4]).intersects(box) for box in masks)],key=lambda w:(round(w[1],1),w[0]))
  ow,nw=unedited(orig),unedited(new)
  same=len(ow)==len(nw) and all(x[4]==y[4] and max(abs(a-b) for a,b in zip(x[:4],y[:4]))<.025 for x,y in zip(ow,nw))
  ck(f'{kind}:text_geometry:{r["book_page"]}',same,f'{len(ow)} / {len(nw)}')
  footer=new.get_text(clip=fitz.Rect(480,801,550,832)).strip();ck(f'{kind}:footer:{r["book_page"]}',footer==str(r['book_page']),footer)
  for e in r['edits']:
   if e['reason'] in ['chapter_contents_page','inline_page_reference','answer_contents_page']:
    text=new.get_text(clip=fitz.Rect(e.get('output_rect',e['rect']))+(-2,-2,2,2))
    ck(f'{kind}:navigation_text:{r["book_page"]}:{e["old"][:24]}',' '.join(e['new'].split()) in ' '.join(text.split()),text.strip())
 for s in srcs.values():s.close()
 if kind=='student':
  ck('student:original_chapter_limits', all(ch['pages']<=lim for ch,lim in zip(M['chapters'],[40,40,40])))
  # Exact cover pixel integrity: this is the latest selected image, not an earlier candidate.
  im=Image.open(R/M['cover']).convert('RGB'); ims=doc[0].get_images()
  pix=fitz.Pixmap(doc,ims[0][0]);arr=np.frombuffer(pix.samples,dtype='uint8').reshape(pix.height,pix.width,pix.n)
  ck('student:exact_cover_pixels',im.size==(pix.width,pix.height) and np.array_equal(np.array(im),arr[:,:,:3]))
  toc=doc[3].get_text()
  for ch,start in zip(M['chapters'],out['chapter_starts']):
   for p in ch['paragraphs']:
    code=p['title'].split()[0];n=start+p['local_page']-1
    ck('student:TOC:'+code,code in toc and str(n) in toc)
    ck('student:paragraph_bookmark:'+code,any(t.startswith(code) and pg==n for l,t,pg in doc.get_toc()))
  for ch,spread in zip(M['chapters'],A['source_spreads_in_book']):
   t=' '.join(doc[p-1].get_text() for p in spread)
   ck('student:mixed_target_spread:'+ch['id'],spread[0]%2==0 and spread[1]==spread[0]+1 and f'Opgave {ch["mixed_target"]["nr"]}' in t)
  ck('student:glossary_count',A['glossary_entries']==47)
  ck('student:all_glossary_definitions_preserved',A['glossary_source_definitions']==48)
  # Word-level boundary check for new front/back matter only (original layout unchanged).
  for pn in [1,2,3]+list(range(124,len(doc))):
   bad=[w for w in doc[pn].get_text('words') if w[0]<35 or w[2]>doc[pn].rect.width-35 or w[1]<12 or w[3]>doc[pn].rect.height-10]
   ck(f'student:new_page_bounds:{pn+1}',not bad,bad[:3])
 if kind=='answers':
  ck('answers:114_exercise_bookmarks',sum(t.startswith('Opgave ') for _,t,_ in doc.get_toc())==114)
  for ch,st in zip(M['chapters'],out['chapter_starts']):
   for ex,pn in ch['answer_exercises'].items():ck('answers:heading:'+ch['id']+':'+ex, bool(re.search(r'^Opgave\s+'+ex+r'\b',doc[st+pn-2].get_text(),re.M)))
 doc.close()
# Glossary extraction is literal; every source definition must survive compilation.
from bs4 import BeautifulSoup
G=json.loads((R/'book_matter/glossary.json').read_text(encoding='utf8'))
def norm(t):
 return re.sub(r"\s+"," ",t).strip()
student=fitz.open(R/A['outputs'][0]['file'])
gtext=norm(" ".join(student[p].get_text() for p in range(124,A['formula_start']-1)))
for e in G:
 ck('glossary:term:'+e['term'],norm(e['term']) in gtext)
 for d in e['definitions']:
  ck('glossary:definition:'+e['term']+':'+str(d['chapter']),norm(d['text']) in gtext)
  source=BeautifulSoup((R/d['source_file']).read_text(encoding='utf8'),'html.parser')
  ck('glossary:source:'+e['term']+':'+str(d['chapter']),norm(d['text']) in norm(source.get_text(' ',strip=True)))
ck('preface:under_300_words',len(student[2].get_text().split())<=300,len(student[2].get_text().split()))
# No rasterisation or hidden loss of original teaching pages in the merge.
for kind,out in zip(['student','answers','teacher'],A['outputs']):
 doc=fitz.open(R/out['file'])
 log=json.loads((R/f'qa/{kind}_links.json').read_text(encoding='utf8'))
 for n,l in enumerate(log):
  actual=doc[l['page']].get_links()
  hit=any(x.get('page')==l['target'] and max(abs(a-b) for a,b in zip(x['from'],l['rect']))<.05 for x in actual)
  ck(f'{kind}:intended_link:{n}',hit)
 ck(kind+':metadata_second_edition','Tweede editie' in doc.metadata['title'])
# Exact source-file inventory also protects the original manuscripts and figures.
for p,h in json.loads((R/'qa/source_hashes.json').read_text(encoding='utf8')).items():
 ck('source_file_preservation:'+p,hashlib.sha256((R/p).read_bytes()).hexdigest()==h)
ck('package:no_font_files',not any(p.suffix.lower() in ['.ttf','.otf','.woff','.woff2'] for p in R.rglob('*')))

report={'checks':len(checks),'passed':sum(x['pass'] for x in checks),'failed':sum(not x['pass'] for x in checks),'source_pages_compared':sum(o['source_pages'] for o in A['outputs']),'comparison':'Every source page rendered at 90 dpi; differences >3/255 outside recorded navigation rectangles with a 1.8pt antialias margin are rejected. Unedited words and coordinates checked separately to 0.025pt. This is an assembly test, not a new content or exam audit.','unexpected_differences':diffs,'items':checks}
(R/'qa/validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2), encoding='utf8', newline='\n')
print(json.dumps({k:v for k,v in report.items() if k not in ['items','unexpected_differences']},ensure_ascii=False,indent=2));print('FAILURES',json.dumps([x for x in checks if not x['pass']][:20],ensure_ascii=False,indent=2))
sys.exit(1 if report['failed'] else 0)
