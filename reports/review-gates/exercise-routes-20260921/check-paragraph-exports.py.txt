from pathlib import Path
import fitz,json,sys,subprocess,hashlib,re
root=Path(r'C:\wt\book 2\exercise-routes-20260921\4veco-lessen')
review=root.parent/'review'
inv=json.loads((review/'route-baseline-inventory.json').read_text(encoding='utf-8'))
def bytesof(p): return Path(chr(92)*2+'?'+chr(92)+str(p)).read_bytes()
records=[]
for p in inv['paragraphs']:
 pid=p['paragraph']; src=root/p['source']; c=pid[:3]
 if pid[0]=='2':
  folder=src.parent.parent; exports=next((folder/'paragrafen').glob(pid+' *'))
  if c!='2.3':
   m=json.loads((folder/'paragraph-exports.json').read_text(encoding='utf-8'))[pid];start,end=m['chapter_pages']
  else:
   m=next(x for x in json.loads((folder/'paragrafen/manifest.json').read_text(encoding='utf-8')) if x['id']==pid);start,end=m['student_pages']
  pdf=next(exports.glob('*'+('paragraaf.pdf' if p['kind']=='theory' else 'opgaven.pdf')))
  chapter=next(f for f in (folder/'output').glob('*.pdf') if 'Antwoorden' not in f.name and 'Docenten' not in f.name)
 else:
  folder=src.parent; pdf=folder/'paragraph-pdfs'/f'{pid}-leerling-v3.pdf';chapter=folder/'output'/f'Boek_{pid[0]}_H{pid[2]}_Leerling_v3.pdf'
  pages=[json.loads(x)['edition_page'] for x in re.findall(r'<!-- PAGE (.*?) -->',src.read_text(encoding='utf-8'))];start,end=min(pages),max(pages)
 with fitz.open(chapter) as doc,fitz.open(stream=bytesof(pdf),filetype='pdf') as excerpt:
  assert len(excerpt)==end-start+1,pid+' count'
  for j,page in enumerate(excerpt):
   old=doc[start-1+j]
   assert page.get_text()==old.get_text(),pid+' text'
   assert page.get_pixmap().samples==old.get_pixmap().samples,pid+' pixel'
  records.append({'id':pid,'source':p['source'],'export':pdf.relative_to(root).as_posix(),'sha256':hashlib.sha256(bytesof(pdf)).hexdigest(),'chapter_pages':[start,end],'verified_pages':len(excerpt)})
answer=[]
for f in (root/'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/edities/chat-2026/bronnen/H3/paragrafen').glob('*/*antwoorden.pdf'):
 oldbytes=subprocess.check_output(['git','show','e2843b47c828784ab594d004cef461cea929717f:'+f.relative_to(root).as_posix()],cwd=root)
 with fitz.open(stream=oldbytes,filetype='pdf') as old,fitz.open(stream=bytesof(f),filetype='pdf') as new:
  assert len(old)==len(new),f.name
  for i,p in enumerate(new):
   assert p.get_text()==old[i].get_text(),f.name+' text'
   clip=fitz.Rect(0,90,p.rect.width,p.rect.height) if i==0 else p.rect
   assert p.get_pixmap(clip=clip).samples==old[i].get_pixmap(clip=clip).samples,f.name+' body pixel'
  answer.append({'file':f.relative_to(root).as_posix(),'pages':len(new),'sha256':hashlib.sha256(bytesof(f)).hexdigest()})
result={'scope':'Read-only independent exported paragraph byte/content/pixel check; full size 72dpi PyMuPDF, exact pixels','paragraphs':records,'h3_answer_exports_baseline_comparison':answer}
(review/'paragraph-export-review.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps({'paragraphs':len(records),'pages':sum(x['verified_pages'] for x in records),'answer_exports':len(answer),'answer_pages':sum(x['pages'] for x in answer)}))
