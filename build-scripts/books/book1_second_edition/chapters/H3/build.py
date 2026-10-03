import os
"""Render the editable Markdown page manuscripts. This does not regenerate authored text."""
from pathlib import Path
from markdown_it import MarkdownIt
from weasyprint import HTML
from weasyprint.text.fonts import FontConfiguration
from bs4 import BeautifulSoup
import re,json,base64
import fitz
ROOT=Path(os.environ['BOOK1_CHAPTER_ROOT']);OUT=(ROOT.parent.parent/'hoofdstukken'/ROOT.name);OUT.mkdir(parents=True,exist_ok=True)
MD=MarkdownIt('commonmark',{'html':True}).enable('table')
CSS=(ROOT/'print.css').read_text(encoding='utf8')
for style,weight,slant in [('Regular',400,'normal'),('Bold',700,'normal'),('Heavy',800,'normal'),('Black',900,'normal'),('Italic',400,'italic')]:
    encoded=base64.b64encode((Path(os.environ['LATO_FONT_DIR'])/('Lato-'+style+'.ttf')).read_bytes()).decode()
    CSS+=f'@font-face{{font-family:Lato;src:url(data:font/ttf;base64,{encoded});font-weight:{weight};font-style:{slant};}}'
def page_chunks(path):
    seq=re.split(r'<!-- PAGE (.*?) -->',path.read_text(encoding='utf8'),flags=re.S)
    for i in range(1,len(seq),2):
        obj=json.loads(seq[i]);obj['body']=seq[i+1].strip();yield obj

def render(pages,stem,title,kind='student'):
    parts=[]
    for i,pg in enumerate(pages,1):
        body=pg['body'].lstrip()
        has_head=(i==1 or body.startswith(('## ','# ','<h1','<p class="kicker"','<div class="page-title"')))
        head='' if has_head else f'<div class="page-title">{pg["section"]} · {pg["title"]}</div>'
        parts.append(f'<section class="page {kind}" data-designed-page="{i}">'+head+MD.render(body)+'</section>')
    soup=BeautifulSoup('\n'.join(parts),'html.parser')
    for img in soup.find_all('img'):
        f=ROOT/img['src']
        if not f.exists():raise FileNotFoundError(f)
        img['src']='data:image/svg+xml;base64,'+base64.b64encode(f.read_bytes()).decode()
    extra='' if kind=='student' else ('html{font-size:10.8pt;line-height:1.37;}' if kind=='answer' else 'html{font-size:10.7pt;line-height:1.38;}')
    html=f'<!doctype html><html lang="nl"><head><meta charset="utf-8"><title>{title}</title><style>{CSS}{extra}</style></head><body>{soup}</body></html>'
    (OUT/(stem+'.html')).write_text(html, encoding='utf8', newline='\n')
    doc=HTML(string=html,base_url=str(ROOT)).render(font_config=FontConfiguration())
    doc.write_pdf(OUT/(stem+'.pdf'))
    mappings=[]
    for n,page in enumerate(doc.pages,1):
        design=set()
        for b in page._page_box.descendants():
            e=getattr(b,'element',None)
            if e is not None and e.get('data-designed-page'): design.add(int(e.get('data-designed-page')))
        mappings.append({'pdf_page':n,'designed_pages':sorted(design)})
    (ROOT/'QA'/(stem+'_page_map.json')).write_text(json.dumps(mappings,indent=2), encoding='utf8', newline='\n')
    with fitz.open(OUT/(stem+'.pdf')) as pdf:
        toc=[]
        if kind=='student':
            for name,des in [('Inhoud · Aanbod en marktevenwicht',1),('1.3.1 Aanbod en aanbodfactoren',2),('1.3.2 Marktevenwicht: prijs en hoeveelheid',12),('1.3.3 Verschuivingen en nieuw evenwicht',24),('1.3.4 Gemengde opgaven',34),('Hoofdstukoverzicht',39),('Begrippen en vervolg',40)]:
                dest=next(m['pdf_page'] for m in mappings if des in m['designed_pages']);toc.append([1,name,dest])
        else:
            seen=set()
            for n,pg in enumerate(pdf,1):
                txt=pg.get_text()
                for m in re.finditer(r'Opgave (\d+)\s*[·—–]',txt):
                    if m[1] not in seen:toc.append([1,f'Opgave {m[1]}',n]);seen.add(m[1])
        if toc:pdf.set_toc(toc)
        for pg in pdf:
            for link in pg.get_links():
                if link.get('nameddest') and link.get('page',-1)>=0:pg.update_link({'xref':link['xref'],'kind':fitz.LINK_GOTO,'from':link['from'],'page':link['page'],'to':fitz.Point(0,0)})
        pdf.set_metadata({'title':title,'author':'','subject':'Economie · 4 vwo · Boek 1, tweede editie','keywords':'aanbod, marktevenwicht, evenwichtsprijs, verschuivingen','creator':'4veco local chapter build'})
        temp=OUT/(stem+'.nav.pdf');pdf.save(temp,garbage=4,deflate=True)
    temp.replace(OUT/(stem+'.pdf'))
    drift=[m for m in mappings if m['designed_pages']!=[m['pdf_page']]]
    print(stem,':',len(doc.pages),'pages for',len(pages),'planned. Drift:',[(x['pdf_page'],x['designed_pages']) for x in drift][:30])
    return not drift

def main():
    filenames=json.loads((ROOT/'chapter-order.json').read_text(encoding='utf8'))
    pages=[p for f in filenames for p in page_chunks(ROOT/f)]
    (ROOT/'1.3 Aanbod en marktevenwicht – hoofdstuk.md').write_text('\n\n'.join((ROOT/f).read_text(encoding='utf8') for f in filenames), encoding='utf8', newline='\n')
    ok=render(pages,'Boek_1_H3_Aanbod_en_marktevenwicht_Tweede_editie','Boek 1 · Hoofdstuk 3 · Aanbod en marktevenwicht · Tweede editie')
    for f,stem,t,k in [('Antwoorden.md','Boek_1_H3_Antwoorden_Tweede_editie','Antwoorden · Boek 1 hoofdstuk 3 · Tweede editie','answer'),('Docenteninformatie.md','Boek_1_H3_Docenteninformatie_Tweede_editie','Docenteninformatie · Boek 1 hoofdstuk 3 · Tweede editie','teacher')]:
        if (ROOT/f).exists():
            ok=render(list(page_chunks(ROOT/f)),stem,t,k) and ok
        else:
            raise FileNotFoundError(ROOT/f)
    if not ok:raise SystemExit(2)
if __name__=='__main__':main()
