import os
#!/usr/bin/env python3
"""Export source-derived reading manuscripts and exact PDF page maps.

The fixed-page print master is assembled by build_book.py from the supplied PDFs.
These manuscripts are convenient combined reading/editing references, not a
claim that a new automatic Markdown reflow will reproduce the print master.
"""
from pathlib import Path
from bs4 import BeautifulSoup
import json,re,html,csv
import fitz
R=Path(os.environ['BOOK1_EDITION_ROOT']);M=json.loads((R/'manifest.json').read_text(encoding='utf8'));A=json.loads((R/'qa/assembly_manifest.json').read_text(encoding='utf8'))
S=fitz.open(R/A['outputs'][0]['file']);X=R/'book_matter'
# Front-matter reading files derived from the actual new pages.
for page,title in [(1,'Colofon'),(2,'Voorwoord')]:
 lines=S[page].get_text().splitlines()
 if lines and lines[-1]==str(page+1):lines=lines[:-1]
 lines=[x for x in lines if x not in ['Economie · 4 vwo',str(page+1),title] and not x.startswith('BOEK 1')]
 (X/(title+'.md')).write_text('# '+title+'\n\n'+'\n'.join(lines)+'\n', encoding='utf8', newline='\n')
rows=['# Inhoud\n','| Onderdeel | Pagina |','|---|---:|']
for c,st in zip(M['chapters'],A['outputs'][0]['chapter_starts']):
 rows.append(f'| **{c["id"]} {c["title"]}** | **{st}** |')
 for p in c['paragraphs']:rows.append(f'| {p["title"]} | {st+p["local_page"]-1} |')
 rows.append(f'| Hoofdstukoverzicht en begrippen | {st+38} |')
rows+=['| Begrippenlijst | 125 |','| Formule- en aanpakoverzicht | 129 |']
(X/'Inhoud.md').write_text('\n'.join(rows)+'\n', encoding='utf8', newline='\n')
gloss=['# Begrippenlijst\n','Formuleringen letterlijk overgenomen uit de drie hoofdstukbegrippenlijsten.\n']
for e in json.loads((X/'glossary.json').read_text(encoding='utf8')):
 gloss.append('## '+e['term']+'\n')
 for d in e['definitions']:
  pn=4+40*(d['chapter']-1)+d['local_page']
  gloss.append(d['text']+f' — hoofdstuk 1.{d["chapter"]}, p. {pn}.\n')
(X/'Begrippenlijst.md').write_text('\n'.join(gloss), encoding='utf8', newline='\n')
form=['# Formule- en aanpakoverzicht\n']
for f in json.loads((X/'formulas.json').read_text(encoding='utf8')):
 form+=['## '+f['chapter']+' · '+f['title']+'\n',f['intro']+'\n']
 for b in f['boxes']:
  form+=['### '+b['title']+'\n',b['formula']+'\n',b.get('note','')+'\n']
 form.append('Bron: '+f['source']+'.\n')
(X/'Formule_en_aanpakoverzicht.md').write_text('\n'.join(form), encoding='utf8', newline='\n')
# Namespace chapter anchors and asset paths in the derived combined manuscript.
chapters=[]
for c,st in zip(M['chapters'],A['outputs'][0]['chapter_starts']):
 src=R/c['source_dir'];file=next(src.glob('* – hoofdstuk.md'));txt=file.read_text(encoding='utf8');offset=st-1
 # Only existing chapter TOC number spans and explicit local page references change.
 def toc(m):
  return re.sub(r'(<span>)(\d+)(</span>)',lambda n:n[1]+str(int(n[2])+offset)+n[3],m[0])
 txt=re.sub(r'<div class="contents">.*?</div>',toc,txt,flags=re.S)
 txt=re.sub(r'\bpagina (17|27)\b',lambda m:'pagina '+str(int(m[1])+offset),txt) if c['nr']==3 else txt
 txt=re.sub(r'(id="|href="#)([^"\s]+)',lambda m:m[1]+f'h{c["nr"]}-'+m[2],txt)
 txt=txt.replace('_assets/',c['source_dir']+'/_assets/')
 chapters.append(f'\n<div id="chapter-{c["id"]}"></div>\n\n'+txt)
front='\n\n'.join((X/f).read_text(encoding='utf8') for f in ['Colofon.md','Voorwoord.md','Inhoud.md'])
combined='# Boek 1 — Grondslagen, vraag en aanbod\n\nTweede editie · 2026\n\n![Gekozen omslag](bronnen/omslag/achtergrond.png)\n\n'+front+'\n\n<!-- CHAPTERS START -->\n'+''.join(chapters)+'\n<!-- CHAPTERS END -->\n\n'+(X/'Begrippenlijst.md').read_text(encoding='utf8')+'\n\n'+(X/'Formule_en_aanpakoverzicht.md').read_text(encoding='utf8')
(R/'Boek 1 Grondslagen, vraag en aanbod – boek.md').write_text(combined, encoding='utf8', newline='\n')
# Page maps are plain CSV, not spreadsheets, and match the final PDFs.
with (R/'qa/page_conversion.csv').open('w',newline='') as file:
 writer=csv.writer(file);writer.writerow(['volume','source_file','local_page','combined_page'])
 for kind in ['student','answers','teacher']:
  for row in json.loads((R/f'qa/{kind}_page_map.json').read_text(encoding='utf8')):writer.writerow([kind,row['source'],row['local_page'],row['book_page']])
print('Reading manuscripts and exact page conversion exported.')
