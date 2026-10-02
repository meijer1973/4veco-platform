#!/usr/bin/env python3
"""Assemble the delivered Book 1 second-edition PDFs without reflow.

Requirements: PyMuPDF, reportlab, Pillow. Fonts are resolved locally, never bundled.
Inputs and their SHA-256 values are recorded in QA/input_hashes.json.
Preserves all supplied Book 1, second edition chapter PDFs; only navigation is edited.
Only navigation and page numbers are edited during PDF assembly.
"""
from __future__ import annotations
import os
import argparse, io, json, re, hashlib, subprocess, os
from pathlib import Path
from copy import deepcopy
from collections import defaultdict
import fitz
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from cover import draw_cover

ROOT=Path(os.environ['BOOK1_EDITION_ROOT'])
W,H=A4
LEFT=53.85827; RIGHT=544.25197; WIDTH=RIGHT-LEFT
INK='#183247'; BLUE='#17688f'; MUTED='#536777'; PALE='#f2f6f8'; RULE='#d5dfe5'
M=json.loads((ROOT/'manifest.json').read_text(encoding='utf8'))
CH=M['chapters']
GLOSS=json.loads((ROOT/'book_matter/glossary.json').read_text(encoding='utf8'))
FORMULAS=json.loads((ROOT/'book_matter/formulas.json').read_text(encoding='utf8'))
FONT_PATHS={}

def find_font(style: str)->str:
    names={'Regular':'Lato-Regular.ttf','Bold':'Lato-Bold.ttf','Heavy':'Lato-Heavy.ttf','Black':'Lato-Black.ttf','Italic':'Lato-Italic.ttf'}
    directories = [Path('/usr/share/fonts/truetype/lato')]
    if os.environ.get('LATO_FONT_DIR'):
        directories.insert(0, Path(os.environ['LATO_FONT_DIR']))
    if os.environ.get('WINDIR'):
        directories.append(Path(os.environ['WINDIR'])/'Fonts')
    if os.environ.get('LOCALAPPDATA'):
        directories.append(Path(os.environ['LOCALAPPDATA'])/'Microsoft/Windows/Fonts')
    directories += [Path.home()/'Library/Fonts',Path('/Library/Fonts')]
    for directory in directories:
        expected=directory/names[style]
        if expected.exists(): return str(expected)
    try:
        query='Lato' if style=='Regular' else 'Lato:style='+style
        path=subprocess.check_output(['fc-match','-f','%{file}',query],text=True).strip()
        if Path(path).exists(): return path
    except (OSError,subprocess.CalledProcessError): pass
    raise RuntimeError('Install the Lato family locally; no font files are distributed in this package.')

for style in ['Regular','Bold','Heavy','Black','Italic']:
    path=find_font(style); FONT_PATHS[style]=path
    pdfmetrics.registerFont(TTFont('Lato'+style,path))
pdfmetrics.registerFontFamily('LatoRegular',normal='LatoRegular',bold='LatoBold',italic='LatoItalic',boldItalic='LatoBold')
ST={
 'body':ParagraphStyle('body',fontName='LatoRegular',fontSize=11.3,leading=15.4,textColor=colors.HexColor(INK),spaceAfter=8),
 'small':ParagraphStyle('small',fontName='LatoRegular',fontSize=9.4,leading=12.5,textColor=colors.HexColor(MUTED),spaceAfter=6),
 'lead':ParagraphStyle('lead',fontName='LatoRegular',fontSize=14,leading=19,textColor=colors.HexColor(BLUE),spaceAfter=12),
 'h2':ParagraphStyle('h2',fontName='LatoBold',fontSize=14,leading=18,textColor=colors.HexColor(BLUE),spaceAfter=7),
 'formula':ParagraphStyle('formula',fontName='LatoRegular',fontSize=11.7,leading=18,textColor=colors.HexColor(INK),spaceAfter=4),
 'table':ParagraphStyle('table',fontName='LatoRegular',fontSize=10.2,leading=13.6,textColor=colors.HexColor(INK)),
 'toc':ParagraphStyle('toc',fontName='LatoRegular',fontSize=10.65,leading=14,textColor=colors.HexColor(INK)),
 'gloss':ParagraphStyle('gloss',fontName='LatoRegular',fontSize=10.8,leading=14.3,textColor=colors.HexColor(INK)),
}

def escape(t):
    return str(t).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')

def page_offsets(kind):
    n=4 if kind=='student' else 2
    offsets=[]; blanks=[]
    for ch in CH:
        if n%2: blanks.append(n); n+=1
        offsets.append(n)
        with fitz.open(ROOT/ch[kind]) as d:n+=len(d)
    return offsets,n,blanks

OFF,S_END,_=page_offsets('student')
AOFF,A_END,A_BLANK=page_offsets('answers')
TOFF,T_END,T_BLANK=page_offsets('teacher')

def bp(ch:int,page:int)->int:return OFF[ch-1]+page

class Matter:
    """Fixed-page front matter and source-derived back matter, with measured flow."""
    def __init__(self,path,first_number=1,kind='student'):
        self.path=path;self.kind=kind;self.first=first_number;self.n=0;self.links=[];self.pages=[]
        self.c=canvas.Canvas(str(path),pagesize=A4,pageCompression=1)
        self.c.setTitle('Boek 1 — '+M['book']['title'])
        self.active=False;self.y=0
    def footer(self,number):
        c=self.c;c.setFillColor(colors.HexColor(MUTED));c.setFont('LatoRegular',8)
        c.drawString(LEFT,21,'Economie · 4 vwo')
        c.setFillColor(colors.HexColor(INK));c.setFont('LatoRegular',9)
        c.drawRightString(RIGHT,20.7,str(number))
    def new(self,title='',kicker='BOEK 1 · ECONOMIE · 4 VWO',footer=True):
        if self.active:self.c.showPage()
        self.active=True;self.n+=1;self.y=H-53
        number=self.first+self.n-1
        self.pages.append({'local_page':self.n,'book_page':number,'title':title})
        if footer:self.footer(number)
        if kicker:
            self.c.setFillColor(colors.HexColor(BLUE));self.c.setFont('LatoBold',9)
            self.c.drawString(LEFT,self.y,kicker);self.y-=32
        if title:
            self.c.setFillColor(colors.HexColor(INK));self.c.setFont('LatoHeavy',27)
            self.c.drawString(LEFT,self.y,title);self.y-=22
    def p(self,text,style='body',gap=5,indent=0,width=None):
        width=width or WIDTH-indent
        para=Paragraph(text,ST[style]);_,h=para.wrap(width,H)
        if self.y-h<52:raise RuntimeError(f'Overflow on matter page {self.n}: {text[:70]}')
        para.drawOn(self.c,LEFT+indent,self.y-h);self.y-=h+gap
        return h
    def heading(self,text):self.y-=8;self.p(escape(text),'h2',4)
    def box(self,title,body,note=None):
        pars=[Paragraph('<b>'+escape(title)+'</b>',ST['table']),Paragraph(body,ST['formula'])]
        if note:pars.append(Paragraph(note,ST['small']))
        table=Table([[p] for p in pars],colWidths=[WIDTH])
        table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),colors.HexColor(PALE)),('LINEBEFORE',(0,0),(0,-1),2.5,colors.HexColor(BLUE)),('LEFTPADDING',(0,0),(-1,-1),11),('RIGHTPADDING',(0,0),(-1,-1),11),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),4)]))
        _,h=table.wrap(WIDTH,H)
        if self.y-h<52:raise RuntimeError('Box overflow '+title)
        table.drawOn(self.c,LEFT,self.y-h);self.y-=h+10
    def table(self,head,rows,widths):
        data=[[Paragraph('<b>'+escape(x)+'</b>',ST['table']) for x in head]]
        data += [[Paragraph(str(x),ST['table']) for x in r] for r in rows]
        t=Table(data,colWidths=widths)
        t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor(PALE)),('LINEBELOW',(0,0),(-1,0),.8,colors.HexColor(MUTED)),('LINEBELOW',(0,1),(-1,-1),.45,colors.HexColor(RULE)),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
        _,h=t.wrap(WIDTH,H)
        if self.y-h<50:raise RuntimeError('Table overflow')
        t.drawOn(self.c,LEFT,self.y-h);self.y-=h+12
    def tocrow(self,text,page,level=0,extra=None):
        if level==0:
            self.y-=9
            self.c.setFillColor(colors.HexColor(PALE));self.c.rect(LEFT,self.y-24,WIDTH,29,fill=1,stroke=0)
            style=ParagraphStyle('ct',parent=ST['toc'],fontName='LatoBold',fontSize=12.2,leading=15,textColor=colors.HexColor(BLUE))
            pad=8
        else:style=ST['toc'];pad=10
        pp=Paragraph(escape(text),style);_,h=pp.wrap(WIDTH-pad-46,H)
        pp.drawOn(self.c,LEFT+pad,self.y-h)
        self.c.setFont('LatoBold' if level==0 else 'LatoRegular',10.65);self.c.setFillColor(colors.HexColor(INK))
        self.c.drawRightString(RIGHT-6,self.y-10.65,str(page))
        self.links.append({'page':self.n-1,'rect':[LEFT,H-self.y-3,RIGHT,H-self.y+h+4],'target':page-1})
        self.y-=max(h+7,28 if level==0 else 21)
        if extra:self.p(extra,'small',2,indent=pad)
        if self.y<47:raise RuntimeError('TOC overflow')
    def save(self):self.c.save();return self

def make_student_front(path,gloss_start,formula_start):
    b=Matter(path)
    b.new(kicker='',footer=False)
    img=Image.open(ROOT/M['cover']);iw,ih=img.size;scale=min(W/iw,H/ih);dw,dh=iw*scale,ih*scale
    # The chosen image is wider than A4: contain it without cropping or distortion.
    b.c.setFillColor(colors.HexColor('#edf5f9'));b.c.rect(0,0,W,H,fill=1,stroke=0)
    b.c.drawImage(str(ROOT/M['cover']),(W-dw)/2,(H-dh)/2,width=dw,height=dh)
    draw_cover(b.c,json.loads((ROOT/'bronnen/omslag/data.json').read_text(encoding='utf8')),W,H,(iw,ih))
    b.c.setFillColor(colors.HexColor(BLUE));b.c.setFont('LatoBold',9)
    b.c.drawCentredString(W/2,22,'TWEEDE EDITIE · 2026')
    b.new('Colofon',kicker='BOEK 1 · GRONDSLAGEN, VRAAG EN AANBOD')
    b.p('Grondslagen, vraag en aanbod','lead',14)
    b.table(['Uitgave','Gegevens'],[
        ['Reeks','4veco · Economie'],['Boek en doelgroep','Boek 1 · 4 vwo'],
        ['Editie','Tweede editie · 2026'],
        ['Opbouw','Drie hoofdstukken, twaalf paragrafen'],
        ['Leerlinghoofdstukken','Drie hoofdstukken van elk 40 pagina’s, inclusief uitleg en oefeningen.'],
        ['Aanvullende delen','Een afzonderlijk antwoordboek en een afzonderlijke docentenhandleiding.'],
        ['Omslag','Illustratieve achtergrond met gecontroleerde, selecteerbare rekenvoorbeelden.']
    ],[128,WIDTH-128])
    b.heading('Over deze editie')
    b.p('Dit boek bundelt de drie hoofdstukken van de tweede editie. De uitleg, oefeningen, tabellen, grafieken en opgavennummers zijn behouden. De paginanummers en verwijzingen zijn aangepast aan de doorlopende boekpaginering.')
    b.p('De begrippenlijst en het formule- en aanpakoverzicht achterin zijn ontleend aan deze hoofdstukken. Ze zijn bedoeld om uitleg terug te vinden en een werkwijze te herhalen. De volledige uitleg en bronvoorwaarden staan steeds in het betreffende hoofdstuk.')
    b.heading('Bronnen en modellen')
    b.p('De situaties en getallen in de hoofdstukken zijn voor het onderwijs gemaakte voorbeelden. Een uitkomst hoort bij de voorwaarden in de bron. Ze beschrijft niet zonder meer actuele prijzen of werkelijk gemeten gedrag. De omslag is een afzonderlijke illustratie.','small')
    b.p('De hoofdstukverantwoording en de herkomst van het materiaal zijn opgenomen in de afzonderlijke docentenhandleiding en het bronpakket.','small')
    b.new('Voorwoord',kicker='BOEK 1 · TWEEDE EDITIE')
    b.p('Economisch leren kijken','lead',14)
    b.p('Je hebt tijd voor één activiteit, maar wilt er twee doen. Een winkel adverteert met een flinke prijsdaling. Een verkoper houdt producten over. Achter zulke situaties zitten keuzes en getallen. In dit boek leer je die stap voor stap onderzoeken.')
    b.p('In <b>hoofdstuk 1</b> leer je economisch denken en nauwkeurig rekenen. Je gebruikt percentages, indexcijfers, tabellen, grafieken en eenvoudige formules. <b>Hoofdstuk 2</b> gaat over de keuzes van kopers en de vraag naar producten. In <b>hoofdstuk 3</b> komen de verkopers erbij. Je onderzoekt het marktevenwicht en wat er verandert als koop- of verkoopplannen verschuiven.')
    b.heading('Zo gebruik je dit boek')
    b.p('Lees de uitleg en bestudeer het uitgewerkte voorbeeld. Begeleide inoefening hoort voor de meeste leerlingen bij de normale route. Je oefent met denkstappen en doet steeds meer zelf.')
    b.box('Normale route','Startopgaven → Begeleide inoefening → Zelfstandige oefening → Doeloefening',
          'Uitdagende route: Startopgaven → Zelfstandige oefening → Doeloefening → Denkertje / Bonusopgave. Heb je minder tussenstappen nodig en zoek je extra uitdaging, dan kun je deze route volgen. Beide routes leiden naar dezelfde doeloefening. Herhaling is aanvullend bij beide routes.')
    b.p('Elk hoofdstuk eindigt met gemengde opgaven. Daar kies je zelf de passende aanpak. Gebruik een schrift, ruitjespapier, potlood, liniaal en zo nodig een rekenmachine. Laat je berekening zien, vermeld de eenheid en leg uit wat je uitkomst betekent.')
    b.p('De antwoorden staan in een afzonderlijk antwoordboek. Zoek met het <b>hoofdstuknummer én het opgavenummer</b>: de nummering begint in elk hoofdstuk opnieuw. Met de inhoudsopgave en de naslag achterin vind je de uitleg terug.')
    b.p('Deze basis neem je mee naar Boek 2, waar kosten, opbrengsten, elasticiteit en surplus hun eigen uitleg krijgen.')
    b.new('Inhoud',kicker='BOEK 1 · TWEEDE EDITIE')
    b.p('Alle paginanummers verwijzen naar dit leerlingboek.','small',1)
    for i,ch in enumerate(CH):
        b.tocrow(ch['id']+'  '+ch['title'],OFF[i]+1)
        for para in ch['paragraphs']:b.tocrow(para['title'],OFF[i]+para['local_page'],1)
        b.tocrow('Hoofdstukoverzicht en begrippen',OFF[i]+39,1)
    b.tocrow('Begrippenlijst',gloss_start)
    b.tocrow('Formule- en aanpakoverzicht',formula_start)
    return b.save()


def make_back(path):
    b=Matter(path,first_number=S_END+1)
    for i,e in enumerate(GLOSS):
        label=Paragraph('<b>'+escape(e['term'])+'</b>',ST['gloss']);lh=label.wrap(WIDTH-60,H)[1]
        pieces=[]
        for d in e['definitions']:
            prefix=('<b>1.'+str(d['chapter'])+':</b> ') if len(e['definitions'])>1 else ''
            pp=Paragraph(prefix+escape(d['text']),ST['gloss']);ph=pp.wrap(WIDTH-60,H)[1];pieces.append((pp,ph,d))
        needed=lh+3+sum(h+4 for _,h,_ in pieces)+12
        if i==0 or b.y-needed<60:
            b.new('Begrippenlijst' if i==0 else 'Begrippenlijst · vervolg',kicker='BOEK 1 · NASLAG · TWEEDE EDITIE')
            b.p('Formuleringen uit de hoofdstukken. Het paginanummer verwijst naar de oorspronkelijke begrippenlijst in dit boek.','small',10)
        label.drawOn(b.c,LEFT,b.y-lh);b.y-=lh+3
        for pp,ph,d in pieces:
            yy=b.y;pp.drawOn(b.c,LEFT,b.y-ph);b.y-=ph+4;pn=bp(d['chapter'],d['local_page'])
            b.c.setFillColor(colors.HexColor(BLUE));b.c.setFont('LatoBold',10);b.c.drawRightString(RIGHT,yy-10,str(pn))
            b.links.append({'page':b.n-1,'rect':[LEFT,H-yy-2,RIGHT,H-b.y+2],'target':pn-1})
        b.y-=8;b.c.setStrokeColor(colors.HexColor(RULE));b.c.setLineWidth(.4);b.c.line(LEFT,b.y+3,RIGHT,b.y+3)
    gp=b.n;fs=S_END+gp+1
    for f in FORMULAS:
        b.new(f['title'],kicker='BOEK 1 · FORMULE- EN AANPAKOVERZICHT · '+f['chapter'])
        b.p(f['intro'],'body',8)
        for box in f['boxes']:b.box(box['title'],box['formula'],box.get('note'))
        pn=bp(f['source_chapter'],f['source_page'])
        y0=b.y
        b.p('Ontleend aan '+f['source']+'. Zie p. '+str(pn)+' en de uitleg in het hoofdstuk.','small')
        b.links.append({'page':b.n-1,'rect':[LEFT,H-y0-2,RIGHT,H-b.y+2],'target':pn-1})
    return b.save(),gp,fs


def make_answer_front(path):
    b=Matter(path,kind='answers')
    b.new('Antwoorden',kicker='BOEK 1 · TWEEDE EDITIE · GEZAMENLIJK ANTWOORDBOEK')
    b.p('Grondslagen, vraag en aanbod','lead',14)
    b.p('Dit antwoordboek bundelt de uitwerkingen bij de drie hoofdstukken van de tweede editie. Opgavennummers, berekeningen, toelichtingen, beoordelingscriteria en oplossingsfiguren zijn behouden.')
    b.table(['Hoofdstuk','Opgaven','Aantal'],[[c['id']+' '+c['title'],'1–38','38'] for c in CH],[280,95,WIDTH-375])
    b.heading('Vergelijk je aanpak')
    b.p('Maak eerst een eigen poging. Controleer daarna niet alleen het laatste getal, maar ook de gegevens, de gekozen methode, de eenheid en de uitleg. Gebruik bij een grafiekvraag de bijbehorende oplossingsfiguur.')
    b.box('Zo vind je de uitwerking','Hoofdstuknummer + opgavenummer',
          'De nummering begint per hoofdstuk opnieuw. Opgave 7 in hoofdstuk 1.1 is een andere opgave dan opgave 7 in hoofdstuk 1.2. Iedere opgave heeft in de PDF een eigen bladwijzer.')
    b.p('De hoofdstukken vermelden hun eigen afrondingsafspraken. Bij uitlegvragen kan een andere formulering juist zijn wanneer de betekenis klopt en de bron de conclusie ondersteunt.')
    b.p('Dit antwoordboek heeft eigen doorlopende paginanummers. De paginanummers in het leerlingboek zijn dus anders. Ook de inhoudstabellen in de oorspronkelijke antwoordhoofdstukken verwijzen nu naar dit complete antwoordboek.','small')
    b.new('Inhoud',kicker='BOEK 1 · ANTWOORDEN · TWEEDE EDITIE')
    for i,ch in enumerate(CH):
        b.tocrow(ch['id']+'  '+ch['title'],AOFF[i]+1)
        for p in ch['paragraphs']:
            b.tocrow(p['title'],AOFF[i]+p['answer_local_page'],1,
                     f'Opgaven {p["exercise_first"]}–{p["exercise_last"]}')
    return b.save()


def make_teacher_front(path):
    b=Matter(path,kind='teacher')
    b.new('Docenteninformatie',kicker='BOEK 1 · TWEEDE EDITIE · GEZAMENLIJKE HANDLEIDING')
    b.p('Grondslagen, vraag en aanbod','lead',12)
    b.p('Deze bundel bevat de drie hoofdstukhandleidingen van de tweede editie. De normale oefenroute omvat begeleide inoefening. De docentplanning rekent met de volledige route; de tijden zijn ontwerpschattingen die nog in de klas moeten worden getoetst. Leerdoelen en opgaven zijn behouden.')
    for i,ch in enumerate(CH):b.tocrow(ch['id']+'  '+ch['title'],TOFF[i]+1)
    b.heading('Drie afzonderlijke uitgaven')
    b.table(['Uitgave','Inhoud'],[
        ['Leerlingboek','Omslag, colofon, voorwoord, volledige inhoud, drie hoofdstukken, begrippenlijst en formule- en aanpakoverzicht.'],
        ['Antwoordboek','Uitwerkingen bij 114 opgaven; eigen paginering en opgavenbladwijzers.'],
        ['Docenteninformatie','Deze assemblagenotities en bijgewerkte hoofdstukhandleidingen van 8, 8 en 9 pagina’s.']
    ],[130,WIDTH-130])
    b.p('Dit is de nieuwe tweede editie. De eerder gedrukte eerste editie is niet aangepast of als vervangend hoofdstuk gebruikt. De drie leerlinghoofdstukken behouden ieder hun 40 pagina’s.','small')
    b.p('De bundelcontrole betreft volledigheid, paginering, verwijzingen en behoud van hoofdstuktekst en figuren. De docentplanning is bijgewerkt voor de complete oefenroutes. Alle tijdsramingen blijven ontwerpschattingen; de assemblagecontrole is geen klassentest. De onafhankelijke inhoudsreview staat afzonderlijk bij de huidige editie.','small')
    b.new('Paginering en verantwoording',kicker='BOEK 1 · ASSEMBLAGENOTITIES')
    b.p('Verwijzingen naar leerlingpagina’s in de onderstaande hoofdstukhandleidingen behouden hun lokale hoofdstuknummering. Gebruik deze omzetting voor het complete leerlingboek.','body',8)
    b.table(['Hoofdstuk','Leerlingboek','Omzetting'],[
        [ch['id']+' '+ch['title'],f'{OFF[i]+1}–{OFF[i]+40}',f'Lokaal + {OFF[i]}'] for i,ch in enumerate(CH)
    ],[245,105,WIDTH-350])
    b.p('De gemengde doelopgaven hebben bronnen op lokale p. 36 en vragen op p. 37. Deze blijven tegenover elkaar staan: <b>40–41, 80–81 en 120–121</b> in het complete leerlingboek.','small')
    b.heading('Wat bij de bundeling is veranderd')
    b.p('Alle leerling- en antwoordpagina’s blijven aanwezig. De hoofdstukbronnen bevatten de nieuwe route, docentplanning en enkele expliciete modelvoorwaarden. Bij het samenvoegen veranderen alleen paginanummers, inhoudstabellen en klikbestemmingen. Twee verwijzingen in hoofdstuk 1.3 wijzen nu naar boekpagina 101 en 111, in plaats van lokale pagina 17 en 27.','small')
    b.p('De gezamenlijke begrippenlijst behoudt alle 48 oorspronkelijke formuleringen onder 47 alfabetisch geordende termen. De twee formuleringen van ceteris paribus blijven herkenbaar per hoofdstuk. Het formule- en aanpakoverzicht selecteert en herordent uitsluitend al behandelde stof.','small')
    b.heading('De gekozen omslag')
    b.p('De illustratieve achtergrond is opnieuw bewerkt. De drie rekenpanelen zijn als selecteerbare tekst en vectorlijnen toegevoegd. De indexgrafiek gebruikt dezelfde fictieve prijzen als de tabel. Bij vraag wordt een hogere eigen prijs gekoppeld aan een kleinere gevraagde hoeveelheid, ceteris paribus. De marktlijnen snijden bij P = € 3 en Q = 30.','small')
    b.heading('Gebruikte richtlijnen')
    b.p('De repositorybestanden RESEARCH_AGENT_MAP.md (beide repositories), skills/econ-book-builder.md, skills/econ-pdf-builder.md en skills/econ-chapter-assembler.md zijn geraadpleegd. De book-builder bepaalt de voor- en naslagstructuur. Om de geleverde hoofdstukken exact te behouden, gebruikt deze bundeling PDF-samenvoeging in plaats van heropmaak van de hoofdstukken. De antwoorden blijven in een afzonderlijke papieren uitgave.','small')
    b.p('Er zijn geen ongegeven school-, contact-, uitgever- of licentiegegevens toegevoegd. Bronidentiteiten, paginaomzetting, onafhankelijke review en controlelog horen bij de repository-editie. Het oorspronkelijke bronpakket blijft afzonderlijk als historische ontvangst bewaard.','small')
    return b.save()


FZ_FONTS={s:fitz.Font(fontfile=p) for s,p in FONT_PATHS.items()}
def fontstyle(name):
    n=name.lower()
    if 'italic' in n:return 'Italic'
    if 'ultra' in n or 'black' in n:return 'Black'
    if 'heavy' in n:return 'Heavy'
    if 'bold' in n:return 'Bold'
    return 'Regular'
def rgb(num):return (((num>>16)&255)/255,((num>>8)&255)/255,(num&255)/255)
def line_records(p):return [l for b in p.get_text('dict')['blocks'] for l in b.get('lines',[]) if l['spans']]

def remove_glyph_runs(page,ops):
    """Empty only the original TJ arrays at the recorded text origins.

    The supplied PDFs use explicit Tm matrices in CSS coordinates (0.75 pt/px).
    Keep all other stream bytes, including font state and drawing operators.
    Abort unless exactly one one-span text run matches each planned edit.
    """
    counts=[0]*len(ops)
    for op in ops:
        if len(op['line']['spans'])!=1:raise RuntimeError('Unexpected multi-font navigation run')
    for xref in page.get_contents():
        old=page.parent.xref_stream(xref)
        matrix=rb'1 0 0 -1 ([\d.+-]+) ([\d.+-]+) Tm'
        pattern=rb'('+matrix+rb')(.*?)(?=(?:'+matrix+rb')|\bET\b)'
        def sub(m):
            x,y=float(m[2])*.75,float(m[3])*.75
            for k,op in enumerate(ops):
                sx,sy=op['line']['spans'][0]['origin']
                if abs(x-sx)<.04 and abs(y-sy)<.04:
                    arrays=re.findall(rb'\[.*?\]\s*TJ',m[4],re.S)
                    if len(arrays)!=1:raise RuntimeError('Navigation text does not use a single TJ array')
                    counts[k]+=1
                    return m[1]+re.sub(rb'\[.*?\]\s*TJ',b'[] TJ',m[4],count=1,flags=re.S)
            return m[0]
        new=re.sub(pattern,sub,old,flags=re.S)
        if new!=old:page.parent.update_stream(xref,b'q\n'+new+b'\nQ\n')
    if counts!=[1]*len(ops):raise RuntimeError(f'Nonunique/missing navigation run: {page.number}, {counts}')

def place_ops(page,ops):
    if not ops:return
    remove_glyph_runs(page,ops)
    for op in ops:
        sp=op['line']['spans'][0];font=FZ_FONTS[fontstyle(sp['font'])];text=op['new'];size=sp['size']
        width=font.text_length(text,fontsize=size)
        x=op['line']['bbox'][2]-width if op.get('right_aligned') else sp['origin'][0]
        y=sp['origin'][1]
        if x+width>RIGHT+1:raise RuntimeError('Navigation text exceeds page body')
        tw=fitz.TextWriter(page.rect);tw.append((x,y),text,font=font,fontsize=size);tw.write_text(page,color=rgb(sp['color']))
        op['output_rect']=list(fitz.Rect(op['rect'])|fitz.Rect(x,y-font.ascender*size,x+width,y-font.descender*size))
        op['method']='empty exact original TJ run; append same-size text'


def prepare_source(ch,kind,offset):
    doc=fitz.open(ROOT/ch[kind]);record=[];alllinks=[]
    for i,page in enumerate(doc):
        for link in page.get_links():
            if link.get('page',-1)>=0:alllinks.append({'page':offset+i,'rect':list(link['from']),'target':offset+link['page']})
            if link.get('xref',0):page.delete_link(link)
        ops=[]
        for line in line_records(page):
            full=''.join(s['text'] for s in line['spans']);box=line['bbox'];reason=None;right=False;new=None
            if re.fullmatch(r'\d+',full.strip()) and box[1]>800 and box[0]>500:
                reason='continuous_page_number';new=str(offset+i+1);right=True
            elif kind=='student' and i==0 and re.fullmatch(r'\d+',full.strip()) and box[0]>510 and box[1]<790:
                reason='chapter_contents_page';new=str(int(full)+offset);right=True
            elif kind=='answers' and i==0 and ch['nr'] in [1,2] and re.fullmatch(r'\d+',full.strip()) and 200<box[1]<290 and 380<box[0]<500:
                reason='answer_contents_page';new=str(int(full)+offset)
                alllinks.append({'page':offset+i,'rect':[box[0]-4,box[1]-2,box[0]+40,box[3]+2],'target':offset+int(full)-1})
            elif kind=='student' and re.search(r'\bpagina\s+\d+',full):
                reason='inline_page_reference';new=re.sub(r'(\bpagina\s+)(\d+)',lambda m:m[1]+str(int(m[2])+offset),full)
                target=int(re.search(r'\bpagina\s+(\d+)',new)[1])-1
                alllinks.append({'page':offset+i,'rect':list(box),'target':target})
            if reason:
                ops.append({'rect':list(box),'line':line,'reason':reason,'old':full,'new':new,'right_aligned':right})
        expected=1+(len(ch['intro_entries']) if kind=='student' and i==0 else 0)+(4 if kind=='answers' and i==0 and ch['nr'] in [1,2] else 0)+(2 if kind=='student' and ch['nr']==3 and i==34 else 0)
        if len(ops)!=expected:raise RuntimeError(f'Unexpected edit count {ch["id"]}/{kind}/{i+1}: {len(ops)} vs {expected}')
        place_ops(page,ops)
        record.append({'source':ch[kind],'local_page':i+1,'book_page':offset+i+1,'edits':[{k:v for k,v in op.items() if k!='line'} for op in ops]})
    return doc,record,alllinks


def add_links(doc,links):
    seen=set()
    for l in links:
        key=(l['page'],tuple(round(x,2) for x in l['rect']),l['target'])
        if key in seen:continue
        seen.add(key)
        if not 0<=l['target']<len(doc):raise RuntimeError('Invalid destination '+str(l))
        doc[l['page']].insert_link({'kind':fitz.LINK_GOTO,'from':fitz.Rect(l['rect']),'page':l['target'],'to':fitz.Point(0,0),'zoom':0})


def build(kind,front,back=None,glossary_pages=0):
    offsets,end,blanks=page_offsets(kind)
    result=fitz.open();result.insert_pdf(fitz.open(front.path),links=False)
    links=deepcopy(front.links);audit=[];allblanks=[]
    if kind=='student':outlines=[[1,'Omslag',1],[1,'Colofon',2],[1,'Voorwoord',3],[1,'Inhoud',4]]
    else:outlines=[[1,'Leeswijzer',1],[1,'Inhoud' if kind=='answers' else 'Paginering en verantwoording',2]]
    for n,ch in enumerate(CH):
        while len(result)<offsets[n]:result.new_page(width=W,height=H);allblanks.append(len(result))
        src,records,sl=prepare_source(ch,kind,offsets[n]);result.insert_pdf(src,links=False)
        audit.extend(records);links.extend(sl);outlines.append([1,ch['id']+' '+ch['title'],offsets[n]+1])
        if kind=='student':
            for para in ch['paragraphs']:outlines.append([2,para['title'],offsets[n]+para['local_page']])
            outlines.extend([[2,'Hoofdstukoverzicht',offsets[n]+39],[2,'Begrippen hoofdstuk '+ch['id'],offsets[n]+40]])
        elif kind=='answers':
            for p in ch['paragraphs']:
                outlines.append([2,p['title'],offsets[n]+p['answer_local_page']])
                for ex in range(p['exercise_first'],p['exercise_last']+1):
                    outlines.append([3,'Opgave '+str(ex),offsets[n]+ch['answer_exercises'][str(ex)]])
        else:
            with fitz.open(ROOT/ch[kind]) as orig:
                for j,p in enumerate(orig):
                    if j==0:continue
                    lines=p.get_text().splitlines()
                    title=next((t for t in lines if len(t)>10 and not t.startswith(('BOEK','4veco'))),'Pagina '+str(j+1))
                    outlines.append([2,title,offsets[n]+j+1])
        src.close()
    if back:
        assert len(result)==S_END
        result.insert_pdf(fitz.open(back.path),links=False)
        links.extend([{**l,'page':l['page']+S_END} for l in back.links])
        outlines.append([1,'Begrippenlijst',S_END+1])
        outlines.append([1,'Formule- en aanpakoverzicht',S_END+glossary_pages+1])
        for i,f in enumerate(FORMULAS):outlines.append([2,f['title'],S_END+glossary_pages+i+1])
    if len(result)%2:result.new_page(width=W,height=H);allblanks.append(len(result))
    add_links(result,links);result.set_toc(outlines)
    result.set_metadata({'title':'Boek 1 — '+({'student':'','answers':'Antwoorden — ','teacher':'Docenteninformatie — '}[kind])+M['book']['title']+' — Tweede editie','subject':'Tweede editie · 4 vwo · Economisch denken en rekenen · Vraag · Aanbod en marktevenwicht','author':'','keywords':'4veco, economie, 4 vwo, Boek 1, tweede editie','creator':'4veco · assembly from supplied second-edition chapters','producer':'PyMuPDF + ReportLab'})
    result.set_page_labels([{'startpage':0,'prefix':'','style':'D','firstpagenum':1}])
    result.xref_set_key(result.pdf_catalog(),'PageLayout','/TwoPageRight')
    result.xref_set_key(result.pdf_catalog(),'Lang','(nl-NL)')
    result.xref_set_key(result.pdf_catalog(),'PageMode','/UseOutlines')
    result.subset_fonts()
    output=ROOT/'boek'/M['files'][kind]
    result.save(output,garbage=4,deflate=True)
    (ROOT/f'qa/{kind}_page_map.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2), encoding='utf8', newline='\n')
    (ROOT/f'qa/{kind}_links.json').write_text(json.dumps(links,ensure_ascii=False,indent=2), encoding='utf8', newline='\n')
    summary={'file':output.relative_to(ROOT).as_posix(),'pages':len(result),'source_pages':sum(len(fitz.open(ROOT/ch[kind])) for ch in CH),'chapter_starts':[o+1 for o in offsets],'intentional_blank_pages':allblanks,'internal_links':sum(len(p.get_links()) for p in result),'bookmarks':len(outlines),'recorded_edits':sum(len(a['edits']) for a in audit)}
    result.close();return summary


def main():
    for f,h in json.loads((ROOT/'qa/input_hashes.json').read_text(encoding='utf8')).items():
        if hashlib.sha256((ROOT/f).read_bytes()).hexdigest()!=h:raise RuntimeError('Input changed: '+f)
    tmp=Path(os.environ['BOOK1_BUILD_TMP']);tmp.mkdir(parents=True,exist_ok=True)
    back,gp,fs=make_back(tmp/'back.pdf')
    front=make_student_front(tmp/'front.pdf',S_END+1,fs)
    a=make_answer_front(tmp/'answers_front.pdf');t=make_teacher_front(tmp/'teacher_front.pdf')
    assert (front.n,a.n,t.n)==(4,2,2)
    summaries=[build('student',front,back,gp),build('answers',a),build('teacher',t)]
    manifest={'outputs':summaries,'glossary_entries':len(GLOSS),'glossary_source_definitions':sum(len(g['definitions']) for g in GLOSS),'glossary_pages':gp,'formula_pages':len(FORMULAS),'book_chapter_pages':120,'instructional_paragraphs':12,'exercise_total':114,'formula_start':fs,'source_spreads_in_book':[[p+OFF[i] for p in ch['mixed_target']['local_spread']] for i,ch in enumerate(CH)],'book_guidance':'skills/econ-book-builder.md: cover, colophon, preface, full contents, chapters, glossary, formula overview; answers kept separate','guidance_adaptations':'Rebuild editable second-edition manuscripts and assemble with continuous pagination. Corrected native cover diagrams; supported normal route and honest teacher planning. Preserve first-edition evidence separately. Source and review evidence are distinct.'}
    (ROOT/'qa/assembly_manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2), encoding='utf8', newline='\n')
    (ROOT/'book_matter/page_map.json').write_text(json.dumps({'front':front.pages,'back':back.pages,'answers':a.pages,'teacher':t.pages},ensure_ascii=False,indent=2), encoding='utf8', newline='\n')
    print(json.dumps(manifest,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
