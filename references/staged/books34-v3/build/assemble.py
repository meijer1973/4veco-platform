"""Assemble complete edition books.

AUTHORING: chapter Markdown/SVG/CSS, book-matter/back.md and glossary.json.
GENERATED: book-matter/front.md and book-matter/print.css, whose templates and
style additions are below in this script. Never manually edit generated files.
See SOURCE_OWNERSHIP.md. Assembly does not overwrite back.md.
"""
from pathlib import Path
import json,re,html,fitz
from render import ROOT,chunks,build_pages,build_chapter
from content import chapter_data
CFG=json.loads((ROOT/'curriculum/chapter-config.json').read_text(encoding='utf-8'))
TITLES={'3':'Overheidsingrijpen, concurrentie en internationale handel','4':'Monopolie, marktfalen en arbeidsmarkt'}

def savepages(path,ps):
 path.write_text('\n\n'.join('<!-- PAGE '+json.dumps({'section':s,'title':t},ensure_ascii=False)+' -->\n\n'+b for s,t,b in ps),encoding='utf8', newline='\n')

def add_footer(page,bookno,localno=None,chapter=None):
 # Footers are outside body text. Preserve all chapter content above y=790.
 r=page.rect; page.add_redact_annot(fitz.Rect(25,r.height-39,r.width-25,r.height-18),fill=(1,1,1));page.apply_redactions()
 left=f'Hoofdstuk {chapter} · lokale pagina {localno}' if localno else 'Economie · 4 vwo'
 page.insert_text((54,r.height-27),left,fontsize=8,fontname='helv',color=(.32,.40,.47))
 page.insert_textbox(fitz.Rect(r.width-90,r.height-38,r.width-50,r.height-20),str(bookno),fontsize=9,fontname='helv',align=2,color=(.1,.2,.28))

def blank(doc):
 p=doc.new_page(width=595.2756,height=841.8898)
 p.insert_text((55,790),'Deze pagina is leeg voor dubbelzijdig afdrukken.',fontsize=8,color=(.4,.45,.5))

def toc_link(page,label,target):
 key=label.split(' ·')[0].strip()
 if re.fullmatch(r'\d\.\d(?:\.\d)?',key):
  rects=[fitz.Rect(w[:4]) for w in page.get_text('words') if w[4]==key]
 else:rects=page.search_for(label)
 for r in rects:
  page.insert_link({'kind':fitz.LINK_GOTO,'from':fitz.Rect(52,r.y0-1,542,r.y1+1),'page':target,'to':fitz.Point(0,0)})

def main():
 results={}
 for b in ['3','4']:
  book=ROOT/'books'/f'book-{b}';matter=book/'book-matter';out=book/'output';out.mkdir(exist_ok=True)
  chaps=[b+'.1',b+'.2',b+'.3'];offset=4;mapping={};toc=[]
  for c in chaps:
   d=ROOT/CFG[c]['path'];a=chapter_data(d)
   mapping[c]={'student_start':offset+1,'student_end':offset+len(a['pages']),'student_offset':offset,'student_pages':len(a['pages']),'paragraphs':{}}
   toc.append((1,c+' · '+CFG[c]['title'],offset+1))
   for pid in a['paragraphs']:
    title=re.search(r'^### '+re.escape(pid)+r'\s+([^\n]+)',(ROOT/'outlines'/f'book-{b}-outline-v3.md').read_text(encoding='utf-8'),re.M)[1]
    page=next(p['local_page'] for p in a['pages'] if p['section']==pid)
    mapping[c]['paragraphs'][pid]={'title':title,'local_page':page,'book_page':offset+page,'target':a['targets'][pid]['exercise'],'target_book_pages':[offset+x for x in a['targets'][pid]['pages']]}
    toc.append((2,pid+' · '+title,offset+page))
   build_chapter(c,('student',),offset)
   offset+=len(a['pages'])
  # Book matter styling keeps the same font family and colour vocabulary, with calmer indexes.
  css=(ROOT/CFG[chaps[0]]['path']/'print.css').read_text(encoding='utf-8')
  css+=f'''\n@page{{@top-right{{content:"Boek {b} · editie v3";}}}}\n.glossary h3{{font-size:11.5pt;margin:8pt 0 3pt;}}\n.glossary p{{font-size:10.5pt;line-height:1.28;margin:0 0 5pt;}}\n.toc a{{display:flex;justify-content:space-between;gap:12pt; border-bottom:0.5pt solid #dce4e9;padding:5pt 0;font-size:10pt;line-height:1.18;}}\n.toc .chapter{{font-weight:800;color:#17688f;margin-top:8pt;font-size:11pt;}}\n'''
  (matter/'print.css').write_text(css, encoding='utf-8', newline='\n')
  bp=chunks(matter/'back.md');back_start=offset+1
  # back.md is authored content: do not overwrite it during assembly.
  for page in bp:
   if page['section']=='begrippen' and '<div class="glossary">' not in page['body']:
    page['body']='<div class="glossary">\n\n'+page['body']+'\n\n</div>'
  glossary_count=sum(p['section']=='begrippen' for p in bp)
  contents='<div class="toc">'
  for c in chaps:
   info=mapping[c];contents+=f'<a class="chapter"><span>{c} · {CFG[c]["title"]}</span><span>{info["student_start"]}</span></a>'
   for pid,v in info['paragraphs'].items():contents+=f'<a><span>{pid} · {v["title"]}</span><span>{v["book_page"]}</span></a>'
  contents+=f'<a class="chapter"><span>Begrippenlijst</span><span>{back_start}</span></a><a class="chapter"><span>Formules en werkwijzen</span><span>{back_start+glossary_count}</span></a></div>'
  seq=('Eerst onderzoek je overheidsingrijpen. Daarna scheid je twee stappen bij de prijsnemende onderneming: de afgeleide begrijpen en de beste haalbare productie kiezen. Het boek sluit af met internationale handel.' if b=='3' else 'Eerst onderzoek je hoe winst en verlies bij vrije toetreding kunnen veranderen. Daarna vergelijk je de prijsnemer met een monopolist. Je gebruikt die uitkomsten bij marktfalen en past bekende marktmethoden toe op arbeid.')
  boundary=('De formele aanpassing door toetreding en uittreding leer je aan het begin van Boek 4. Dit boek vraagt geen langetermijnberekening van het aantal bedrijven of een nulwinstuitkomst door toetreding.' if b=='3' else 'De arbeidsmarkt wordt behandeld met productiviteit, deelname, werkloosheid, evenwicht en minimumloon. De afzonderlijke behandeling van collectieve onderhandelingen en cao-beleid komt in een later leerjaar.')
  front=[('colofon','Colofon',f'''<div class="kicker">4VECO · ECONOMIE · 4 VWO</div>\n# Boek {b}<br>{TITLES[b]}\n\n**Editie v3 · september 2026**\n\nDeze editie volgt de gekozen v3-indeling van de boekenreeks. Uitleg, opgaven en grafieken zijn bedoeld voor gebruik op papier. Antwoorden en docenteninformatie worden apart meegeleverd.\n\n### Over de voorbeelden\nDe ondernemingen, landen en rekengegevens zijn geconstrueerde onderwijsvoorbeelden, tenzij een bron uitdrukkelijk anders vermeldt. Gebruik de voorwaarden die bij de opgave staan. Een uitkomst in een vereenvoudigd model is niet automatisch een voorspelling voor elke werkelijke markt.\n\n### Werken met dit boek\nReken met ongeronde tussenuitkomsten. Vermeld de relevante hoeveelheid, prijs, eenheid en periode. Geef bij een verklaring niet alleen een getal, maar ook het mechanisme en de gebruikte broninformatie.\n\n### Lezen en printen\nDe paginanummers lopen door het hele boek. De hoofdstukken en paragrafen staan in de inhoudsopgave. Print op A4, op werkelijke grootte en dubbelzijdig over de lange zijde.\n\n<div class="box"><b>De les en het oefenmateriaal</b><br>De docent geeft aan welke opgaven bij de kern van de les horen. Begeleide inoefening geeft extra steun bij dezelfde doelen. Bonus en herhaling zijn niet automatisch extra verplicht werk in dezelfde les.</div>'''),
 ('inleiding','Zo gebruik je het boek',f'''# Zo gebruik je dit boek\n\n{seq}\n\n### Elke paragraaf heeft een bestemming\nLees de leerdoelen en volg de uitleg en het uitgewerkte voorbeeld. In de Startopgaven haal je voorkennis op en controleer je de eerste begrippen. Daarna oefen je zonder uitgewerkte stappen en pas je de methode toe in de doeloefening.\n\n<div class="formula">Startopgaven → Zelfstandige oefening → Doeloefening</div>\n\nHeb je extra steun nodig? Gebruik de Begeleide inoefening. Keer daarna terug naar zelfstandig werk. Het doel is niet alleen het juiste antwoord herkennen, maar de bewerking zelf kunnen kiezen, uitvoeren en uitleggen.\n\n### Bekijk tekst en beeld samen\nLees steeds wat de assen meten. Een bedrag per product is niet een totaalbedrag. Een punt, lijn of oppervlakte heeft een betekenis die bij de bron hoort. Gebruik het plaatje om je berekening te controleren en andersom.\n\n### Gemengde opgaven\nHier combineer je eerder geleerde methoden. Je kiest zelf de juiste bron en aanpak. Er wordt geen nieuwe theorie verstopt in de afsluitende doelopgave.\n\n### De grens van dit boek\n{boundary}\n\n<div class="box"><b>Een onderbouwd antwoord</b><br>Kies de juiste bron en grootheid. Laat de noodzakelijke berekening zien. Controleer eenheden en grenzen. Sluit af met een conclusie die niet verder gaat dan de gegevens toelaten.</div>'''),
 ('inhoud','Inhoud', '# Inhoud\n\n'+contents)]
  savepages(matter/'front.md',front)
  fr=build_pages(chunks(matter/'front.md'),matter,'front','Boek '+b+' voorwerk','student',1)
  br=build_pages(bp,matter,'back','Boek '+b+' begrippen en werkwijzen','student',offset)
  if fr['pages']!=3 or fr['overflow'] or br['overflow']:raise RuntimeError('Book matter overflow '+b)
  doc=fitz.open();original=ROOT/'historical-inputs'/('Boek_3_Compleet_Herzien.pdf' if b=='3' else 'Boek_4_Compleet.pdf')
  with fitz.open(original) as cover:doc.insert_pdf(cover,from_page=0,to_page=0)
  with fitz.open(matter/'output/front.pdf') as fp:doc.insert_pdf(fp)
  for c in chaps:
   with fitz.open(ROOT/CFG[c]['path']/'output'/f'Boek_{b}_H{c[2]}_Leerling_v3_bookpages.pdf') as cp:doc.insert_pdf(cp)
  with fitz.open(matter/'output/back.pdf') as bk:doc.insert_pdf(bk)
  if len(doc)%2:blank(doc)
  tocfull=[[1,'Inleiding',3],[1,'Inhoud',4]]+[list(x) for x in toc]+[[1,'Begrippenlijst',back_start],[1,'Formules en werkwijzen',back_start+glossary_count]]
  doc.set_toc(tocfull)
  for level,label,pag in toc:toc_link(doc[3],label.split(' · ')[0],pag-1)
  toc_link(doc[3],'Begrippenlijst',back_start-1);toc_link(doc[3],'Formules en werkwijzen',back_start+glossary_count-1)
  doc.set_metadata({'title':f'Boek {b} — {TITLES[b]} — v3','author':'4veco','subject':'4 vwo economie; v3-lesindeling','keywords':'economie,4 vwo,v3'})
  doc.save(out/f'Boek_{b}_Compleet_v3.pdf',garbage=4,deflate=True);student_pages=len(doc);doc.close()
  # Assemble separate answer and teacher volumes, keeping explicit local locators as well as global pagination.
  volumes={}
  for kind,label in [('answer','Antwoorden'),('teacher','Docenteninformatie')]:
   idx=2;parts=[]
   for c in chaps:
    file=ROOT/CFG[c]['path']/'output'/f'Boek_{b}_H{c[2]}_{label}_v3.pdf';n=len(fitz.open(file))
    parts.append((c,file,idx+1,n));mapping[c][kind+'_start']=idx+1;mapping[c][kind+'_pages']=n;idx+=n+(n%2)
   rows='\n'.join(f'| {c} · {CFG[c]["title"]} | {st}–{st+n-1} | {mapping[c]["student_start"]}–{mapping[c]["student_end"]} |' for c,_,st,n in parts)
   body=f'''<div class="kicker">4VECO · BOEK {b} · EDITIE V3</div>\n# {label}<br>{TITLES[b]}\n\nDit bestand hoort bij het complete leerlingboek v3. De antwoorden en lesroutes volgen de nieuwe paragraafindeling. Gebruik geen v2-paginaverwijzing of oud nummer alsof dat automatisch dezelfde oefening aanduidt.\n\n### Nummering\nRechts onderaan staat het doorlopende paginanummer van dit deel. Links staat de lokale hoofdstukpagina. Verwijzingen binnen hoofdstukken naar leerlingpagina’s zijn lokaal; de tabel op de volgende pagina geeft de omzetting naar het complete leerlingboek.\n\n### Betekenis van de editie\nBoek 3 bevat 14 paragrafen en Boek 4 bevat 17 paragrafen. De beperkte afgeleide heeft een eigen les. Langetermijnevenwicht staat nu in §4.1.1; nieuwe §4.3.5 is gemengde oefening, niet de oude cao-les.\n\n<div class="box"><b>Afstemming</b><br>De nieuwe boeken en aangenomen outlines zijn de werkbasis. Het pakket bevat concrete doelrecords met vragen en antwoorden; er wordt geen onafhankelijke goedkeuring of gemeten lestijd voorgespiegeld.</div>'''
   table=f'''# Inhoud en paginaverwijzingen\n\n| Hoofdstuk | Pagina’s in dit deel | Leerlingboek v3 |\n|---|---:|---:|\n{rows}\n\n### Van hoofdstukpagina naar boekpagina\n'''
   for c in chaps:table+=f'**{c}:** leerlinghoofdstukpagina + {mapping[c]["student_offset"]} = pagina in het complete leerlingboek.\n\n'
   table+='Een lege pagina na een hoofdstuk houdt de volgende hoofdstukopening rechts bij dubbelzijdig afdrukken. De lege pagina voegt geen leerdoel of oefenopdracht toe.\n\n'
   if kind=='teacher':table+='**Bestaande tijdsconflicten:** §§3.1.2, 3.1.3, 3.1.5, 4.2.4 en 4.2.5 zijn door deze beperkte herindeling niet als één-les-klaar bewezen. De individuele lespagina’s laten het open oordeel zien.'
   pf=build_pages([{'section':'front','title':label,'body':body},{'section':'front','title':'Inhoud','body':table}],matter,'front-'+kind,'Boek '+b+' '+label,'teacher')
   if pf['pages']!=2:raise RuntimeError('Companion front overflow')
   vd=fitz.open(matter/'output'/('front-'+kind+'.pdf'));marks=[[1,'Inhoud en paginaverwijzingen',2]]
   for c,file,st,n in parts:
    with fitz.open(file) as part:vd.insert_pdf(part)
    marks.append([1,c+' · '+CFG[c]['title'],st])
    for j in range(n):add_footer(vd[st-1+j],st+j,j+1,c)
    # Reliable paragraph locators from the first unique current heading/source target.
    a=chapter_data(ROOT/CFG[c]['path'])
    for pid,pp in a['paragraphs'].items():
     needle=pid+' ·' if kind=='teacher' else 'Opgave '+a['targets'][pid]['exercise']
     found=next((st+j for j in range(n) if (pid+' ·' in vd[st-1+j].get_text() if kind=='teacher' else re.search(r'\b'+re.escape(needle)+r'\b',vd[st-1+j].get_text()))),st)
     marks.append([2,pid+' · '+mapping[c]['paragraphs'][pid]['title'],found])
    if n%2:blank(vd)
    toc_link(vd[1],c+' ·',st-1)
   vd.set_toc(marks);vd.set_metadata({'title':f'Boek {b} — {label} — v3','author':'4veco'})
   vd.save(out/f'Boek_{b}_Compleet_{label}_v3.pdf',garbage=4,deflate=True);volumes[kind]=len(vd);vd.close()
  results[b]={'student_pages':student_pages,**volumes,'chapters':mapping,'glossary_terms':len(json.loads((matter/'glossary.json').read_text(encoding='utf-8'))),'back_start':back_start,'formulas_start':back_start+glossary_count}
 (ROOT/'curriculum/book-page-map-v3.json').write_text(json.dumps(results,ensure_ascii=False,indent=2), encoding='utf-8', newline='\n')
 print(json.dumps({b:{k:v for k,v in z.items() if k!='chapters'} for b,z in results.items()},indent=2))
if __name__=='__main__':main()
