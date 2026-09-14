"""Read-only delivered PDF, source and navigation QA; no author/build recipes."""
from pathlib import Path
from urllib.parse import unquote
import re,json,hashlib,subprocess,os
from pypdf import PdfReader
import fitz
from PIL import Image,ImageOps,ImageDraw
import argparse
ap=argparse.ArgumentParser(description=__doc__)
ap.add_argument('--lessons',type=Path,required=True)
ap.add_argument('--output',type=Path,required=True)
ap.add_argument('--pdftoppm',type=Path,required=True)
args=ap.parse_args()
LESSONS=args.lessons.resolve();OUT=args.output.resolve();OUT.mkdir(parents=True,exist_ok=True)
POP=args.pdftoppm.resolve()

def safe(p): return Path('\\\\?\\'+str(p.resolve()).removeprefix('\\\\?\\')) if os.name=='nt' else p
result={'books':[],'renders':[]}
for book in [3,4]:
 mfile=next(LESSONS.glob(f'Boek {book}*/IMPORT_MANIFEST.json'));m=json.loads(mfile.read_text(encoding='utf-8'))
 files={f['repository_path']:f for f in m['files']}
 for f in m['files']:
  data=safe(LESSONS/f['repository_path']).read_bytes()
  assert hashlib.sha256(data).hexdigest()==f['sha256'],f['repository_path']
  assert len(data)==f['bytes']
 sources=[]
 for row in m['paragraphs']:
  p=LESSONS/row['repository_path'];text=p.read_text(encoding='utf-8')
  order=json.loads(p.with_name('chapter-order.json').read_text(encoding='utf-8'))
  assert p.name in order
  for name in order+['Antwoorden.md','Docenteninformatie.md']:assert p.with_name(name).is_file(),name
  links=re.findall(r'!\[[^\]]*\]\(([^)]+)\)|(?:src=["\'])([^"\']+)',text)
  for a,b in links:
   link=unquote(a or b).strip('<>')
   if not re.match(r'\w+://|data:',link): assert (p.parent/link).exists(),(p,link)
  sources.append({'id':row['id'],'chapter_order':True,'editable_answers_teacher':True,'asset_links':len(links)})
 for p in [mfile.parent/'README.md',mfile.parent/'edities/chat-2026/README.md',mfile.parent/'edities/chat-2026/BRONNEN.md']:
  for link in re.findall(r'\[[^\]]+\]\(([^)]+)\)',p.read_text(encoding='utf-8')):
   if not re.match(r'\w+://',link):assert safe(p.parent/unquote(link)).exists(),(p,link)
 pdfs=[]
 for role in m['pdf_roles']:
  p=LESSONS/role['repository_path'];pdf=PdfReader(str(p),strict=True)
  assert len(pdf.pages)==role['pages'],p
  # MuPDF handles the delivery's complex font streams much faster than
  # pypdf text extraction; pypdf still validates every page/content stream.
  with fitz.open(p) as document:texts=[page.get_text() for page in document]
  assert len(texts)==len(pdf.pages),(p,len(texts),len(pdf.pages))
  for page in pdf.pages:
   content=page.get_contents()
   if content:content.get_data()
  blank=[i+1 for i,t in enumerate(texts) if not t.strip()]
  pdfs.append({**role,'readable':True,'text_empty_pages':blank})
  if role['scope']=='complete' and role['role']=='student':
   pages={1,2,3,len(texts)}
   pages.update(i+1 for i,t in enumerate(texts[:12]) if 'Inhoud' in t)
   pages.update(blank[:2])
  elif role['scope']==f'{book}.1':
   pages={1,min(6,len(texts))}
   if book==3:
    for token in ['22A','40A','47A']:
     matched=[i+1 for i,t in enumerate(texts) if token in t and i>1]
     if role['role'] in ['student','answers']:assert matched,(role,token)
     if matched:pages.add(matched[0])
  elif role['role']=='student':pages={min(8,len(texts))}
  else:pages=set()
  if role['scope']=='complete':pages.update([p for p in blank if p>1][:1])
  for page in sorted(pages):
   label=f'b{book}-{role["scope"]}-{role["role"]}-p{page}'
   subprocess.run([str(POP),'-f',str(page),'-l',str(page),'-scale-to','1100','-png','-singlefile',str(p),str(OUT/label)],check=True,capture_output=True)
   result['renders'].append({'label':label,'path':label+'.png','pdf':role['repository_path'],'page':page})
 result['books'].append({'book':book,'preserved_files':len(files),'sources':sources,'pdfs':pdfs})
 print(f'Book {book}: {len(files)} preserved files, {len(sources)} sources, 12 PDFs PASS',flush=True)
(OUT/'delivery-qa.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
for start in range(0,len(result['renders']),6):
 rows=result['renders'][start:start+6];sheet=Image.new('RGB',(1200,1740),'#cccccc');draw=ImageDraw.Draw(sheet)
 for i,row in enumerate(rows):
  im=Image.open(OUT/row['path']).convert('RGB');im.thumbnail((585,540));x=(i%2)*600;y=(i//2)*580
  sheet.paste(im,(x+(600-im.width)//2,y+25));draw.text((x+10,y+5),row['label'],fill='black')
 sheet.save(OUT/f'contact-{start//6+1}.jpg')
print('QA and contact sheets complete',flush=True)
