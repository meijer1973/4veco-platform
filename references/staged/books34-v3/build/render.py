"""Build the v3 edition from the packaged, editable manuscripts; never rerun v2 authors."""
from pathlib import Path
import re,json,base64,argparse,html
from markdown_it import MarkdownIt
from bs4 import BeautifulSoup
from weasyprint import HTML
ROOT=Path(__file__).resolve().parents[1]
MD=MarkdownIt('commonmark',{'html':True}).enable('table')
def chunks(path):
 a=re.split(r'<!-- PAGE (.*?) -->',path.read_text(encoding='utf8'),flags=re.S)
 return [dict(json.loads(a[i]),body=a[i+1].strip()) for i in range(1,len(a),2)]
def render_md(body):
 # Same bounded Markdown-in-HTML handling as the original chapter packages.
 pat=re.compile(r'(<div\b[^>]*>)([\s\S]*?)(</div>)')
 def f(m):
  inn=m[2]
  return m[1]+'\n'+MD.render(inn.strip())+'\n'+m[3] if '\n\n' in inn or re.search(r'^\|',inn,re.M) else m[0]
 body=re.sub(r'(</(?:div|a|p|figure)>)[ \t]*\n(?=[#|])',r'\1\n\n',body)
 return MD.render(pat.sub(f,body))
def build_pages(pages,folder,stem,title,kind='student',offset=0):
 folder=Path(folder);out=folder/'output';out.mkdir(exist_ok=True)
 css=(folder/'print.css').read_text(encoding='utf-8')
 # Updated paragraph heading doesn't need enormous repeated title atop a continued page.
 css+='\n.page-title{font-size:17pt;}\n'
 if kind=='answer':css+='html{font-size:10.8pt;line-height:1.36;}.formula{font-size:10pt;}'
 if kind=='teacher':css+='html{font-size:10.7pt;line-height:1.38;} .teacher table{font-size:9.4pt;}'
 if offset:css+=f'@page:first{{counter-reset:page {offset+1};}}'
 ps=[]
 for n,p in enumerate(pages,1):
  body=p['body']
  if kind=='student' and offset:
   body=re.sub(r'((?:pagina|p\.)\s+)(\d+)(?:([–−-])(\d+))?',lambda m:m[1]+str(int(m[2])+offset)+(m[3]+str(int(m[4])+offset) if m[3] else ''),body)
  if kind=='student' and offset and 'class="contents"' in body:
   body=re.sub(r'<span>(\d+)</span>',lambda m:'<span>'+str(int(m[1])+offset)+'</span>',body)
  head='' if n==1 or re.search(r'^# ',body,re.M) or body.lstrip().startswith('## ') else f'<div class="page-title">{html.escape(p["section"])} · {html.escape(p["title"])}</div>'
  ps.append(f'<section class="page {kind}" data-designed-page="{n}" data-section="{p["section"]}">{head}{render_md(body)}</section>')
 soup=BeautifulSoup('\n'.join(ps),'html.parser')
 for img in soup.find_all('img'):
  f=folder/img['src']
  if not f.is_file():raise FileNotFoundError(f)
  typ={'svg':'image/svg+xml','png':'image/png','jpg':'image/jpeg','jpeg':'image/jpeg'}.get(f.suffix[1:])
  if not typ:raise ValueError(f)
  img['src']='data:'+typ+';base64,'+base64.b64encode(f.read_bytes()).decode()
 text='<!doctype html><html lang="nl"><head><meta charset="utf-8"><title>'+html.escape(title)+'</title><style>'+css+'</style></head><body>'+str(soup)+'</body></html>'
 (out/(stem+'.html')).write_text(text,encoding='utf8', newline='\n')
 doc=HTML(string=text,base_url=str(folder)).render()
 doc.write_pdf(out/(stem+'.pdf'))
 pm=[];overflow=[]
 for i,pg in enumerate(doc.pages,1):
  ids=set();secs=set()
  for box in pg._page_box.descendants():
   el=getattr(box,'element',None)
   if el is not None and el.get('data-designed-page'):
    ids.add(int(el.get('data-designed-page')));secs.add(el.get('data-section'))
  pm.append(dict(pdf_page=i,designed_pages=sorted(ids),sections=sorted(secs)))
  if kind=='student' and ids!={i}:overflow.append(pm[-1])
 (out/(stem+'_page_map.json')).write_text(json.dumps(pm,indent=2,ensure_ascii=False), encoding='utf-8', newline='\n')
 print(stem,'pages',len(doc.pages),'designed',len(pages),'overflow',len(overflow),flush=True)
 if overflow:print('FIRST DRIFT',overflow[:5],flush=True)
 return dict(stem=stem,pages=len(doc.pages),designed_pages=len(pages),overflow=overflow)
def build_chapter(c,kinds=('student','answer'),offset=0):
 folder=ROOT/'books'/f'book-{c[0]}'/'chapters'/c
 results=[]
 for kind in kinds:
  pgs=[p for f in json.loads((folder/'chapter-order.json').read_text(encoding='utf-8')) for p in chunks(folder/f)] if kind=='student' else chunks(folder/('Antwoorden.md' if kind=='answer' else 'Docenteninformatie.md'))
  label={'student':'Leerling','answer':'Antwoorden','teacher':'Docenteninformatie'}[kind]
  stem=f'Boek_{c[0]}_H{c[2]}_{label}_v3'+('_bookpages' if offset else '')
  results.append(build_pages(pgs,folder,stem,f'Boek {c[0]} · Hoofdstuk {c} · {label} · v3',kind,offset))
 return results
if __name__=='__main__':
 ap=argparse.ArgumentParser();ap.add_argument('--chapters',default='3.1,3.2,3.3,4.1,4.2,4.3');ap.add_argument('--kinds',default='student,answer');a=ap.parse_args()
 res=[]
 for c in a.chapters.split(','):res.extend(build_chapter(c,a.kinds.split(',')))
 (ROOT/'checks'/('build-'+a.chapters.replace(',','_')+'.json')).write_text(json.dumps(res,indent=2), encoding='utf-8', newline='\n')
