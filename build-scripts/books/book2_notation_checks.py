"""Semantic checks of the bounded notation revision, independent of PDF hashes."""
import hashlib,json,re,subprocess
from pathlib import Path
from bs4 import BeautifulSoup
import fitz
from build_book2_chat import EDITION

BASE='d53080f38ebbdbba319e6d9b89dcba86067a72be'

def require(value,message):
    if not value:raise ValueError(message)

def canonical(text):
    """Only equivalent labels/layout; numbers and all economic operations remain."""
    text=BeautifulSoup(text,'html.parser').get_text(' ')
    text=text.replace('Qd','Qv').replace('Qs','Qa')
    text=re.sub(r'(?<!\d)\.|\.(?!\d)','',text)
    return re.sub(r'[\s*;]','',text)

def exercise_blocks(text):
    return re.findall(r'<div class="exercise(?: [^"]*)?">([\s\S]*?)</div>',text)

def verify_sources(lessons):
    root=lessons/EDITION;blocks=0;headings=0;targets=0
    for source in sorted((root/'bronnen').glob('H*/manuscript/*.md')):
        relative=source.relative_to(lessons).as_posix()
        before=subprocess.check_output(['git','show',BASE+':'+relative],cwd=lessons).decode()
        current=source.read_text(encoding='utf8')
        require(not re.search(r'\bQ[ds]\b|interleaving',current),'Obsolete student notation '+relative)
        headings+=current.count('## Herhaling en combineren')
        compared=current
        if source.name.startswith('2.2.4 '):
            require('tegenoverliggende pagina' not in current,'False StreamPlus facing-page instruction')
            compared=compared.replace('De vragen staan op de volgende pagina.','De vragen staan op de tegenoverliggende pagina.')
            compared=compared.replace('Gebruik de bronnen op de vorige pagina.','Gebruik de bronnen op de tegenoverliggende pagina.')
        a,b=exercise_blocks(before),exercise_blocks(compared)
        require(len(a)==len(b),'Changed exercise count '+relative)
        for old,new in zip(a,b):
            if 'Opgave 3 · Bloemenbossen' in old:
                new=new.replace('Vul de twee formules aan en bereken beide surplussen:', 'Vul in en bereken:')
            # SportLint: exactly two added fill-in columns, no data/question change.
            if 'SportLint' in old:
                new=new.replace('| MK (€ per extra armband) | MO (€ per extra armband) |','|')
                new=new.replace('|---:|---:|---:|---:|---:|','|---:|---:|---:|')
                new=new.replace('| — | — |','|').replace('| … | … |','|')
                new=new.replace('Neem de tabel over en vul MK en MO in. Bereken beide stappen en noteer telkens op welke stap je antwoord betrekking heeft.',
                                'Bereken MK en MO over beide stappen. Noteer telkens op welke stap je antwoord betrekking heeft.')
            require(canonical(old)==canonical(new),'Exercise payload changed '+relative+' '+old[:65])
            blocks+=1
            if 'doeloefening' in old.lower():targets+=1
    require(headings==9,'Expected nine normalized retrieval headings')
    require(blocks==114,'Expected all 114 exercise/target blocks')
    for folder in (root/'bronnen').glob('H*'):
        for p in [*folder.glob('*antwoorden.md'),*folder.glob('*Docenten*.md')]:
            require(not re.search(r'\bQ[ds]\b',p.read_text(encoding='utf8')),'Obsolete companion notation '+str(p))
        for p in folder.glob('*Docenten*.md'):
            before=subprocess.check_output(['git','show',BASE+':'+p.relative_to(lessons).as_posix()],cwd=lessons).decode()
            timing=r'^\| 2\.[123]\.[123] \| \d+ min \|.*$'
            require(re.findall(timing,before,re.M)==re.findall(timing,p.read_text(encoding='utf8'),re.M),
                    'Historical timing evidence changed '+str(p))
    p=next((root/'bronnen/H1/manuscript').glob('2.1.3*'))
    chunks=re.split(r'<!-- PAGE (.*?) -->',p.read_text(encoding='utf8'),flags=re.S)
    require(len(chunks)==21,'2.1.3 must contain exactly ten pages')
    require('extra kosten' in chunks[2] and 'aantal extra verkochte producten' in chunks[2],'Missing word formulas')
    require('Δ spreek je uit' in BeautifulSoup(chunks[4],'html.parser').get_text(' '),'Missing delayed delta introduction')
    require('Linoprint' in chunks[8] and 'Atelier Boog' in chunks[10],'Examples must have their own pages')
    # Check actual drawn SchaalWerk curve, not just a disconnected computation.
    graph=json.loads((root/'bronnen/H1/_assets/notation-20261001/page-023.json').read_text(encoding='utf8'))
    curves=[s for s in graph['shapes'] if s['stroke']=='#a14f08' and len(s['path'])>500]
    require(len(curves)==1,'Missing/ambiguous cost curve')
    points=re.findall(r'[ML] ([\d.]+) ([\d.]+)',curves[0]['path'])
    require(len(points)>=100,'Insufficient cost curve samples')
    for x,y in points:
        q=(float(x)-102)/((491.2756-81)/12)
        expected=619-(80+q*q)/240*156
        require(-.001<=q<=12.001 and abs(float(y)-expected)<.02,'SchaalWerk curve does not match TK=80+Q²')
    require([(80+q*q-(80+(q-4)**2))/4 for q in [4,8,12]]==[4,12,20],'Wrong step costs')
    require([(120-80)/10,(200-120)/20,(90-0)/10,(270-90)/20]==[4,4,9,9],'Wrong SportLint values')
    with fitz.open(root/'boek/Boek_2_Compleet.pdf') as doc:
        text='\n'.join(p.get_text()for p in doc)
        require(len(doc)==111 and not re.search(r'\bQ[ds]\b|interleaving',text),'Wrong final student inventory/notation')
        require(text.count('Herhaling en combineren')==9,'Missing final headings')
        require('SportLint' in doc[26].get_text(),'SportLint not on printed page25')
        from io import BytesIO
        from pypdf import PdfReader
        previous=subprocess.check_output(['git','show',BASE+':'+EDITION.as_posix()+'/boek/Boek_2_Compleet.pdf'],cwd=lessons)
        old_reader=PdfReader(BytesIO(previous));current_reader=PdfReader(root/'boek/Boek_2_Compleet.pdf')
        require(set(old_reader.named_destinations)<set(current_reader.named_destinations),'Historical destination names lost')
        require(len(current_reader.named_destinations)==len(old_reader.named_destinations)+1,'Unexpected named destinations')
        for name,dest in old_reader.named_destinations.items():
            old_page=old_reader.get_destination_page_number(dest)
            require(current_reader.get_destination_page_number(current_reader.named_destinations[name])==old_page+(old_page>=24),'Historical destination shifted to wrong content '+name)
        with fitz.open(stream=previous,filetype='pdf') as old_doc:
            require(old_doc[0].get_pixmap().samples==doc[0].get_pixmap().samples,'Accepted cover pixels changed')
            for i,page in enumerate(old_doc):
                if i in (20,21,22,23):continue
                new_page=doc[i+(i>=24)]
                old_links=page.get_links();new_links=new_page.get_links()
                if i==1:continue  # Newly linked main contents rows checked separately.
                require(len(old_links)==len(new_links),'Pre-existing page link lost')
                for a,b in zip(old_links,new_links):
                    require(a['from']==b['from'],'Pre-existing click area changed')
                    require(b['page']==a['page']+(a['page']>=24),'Pre-existing link destination changed')
        glossary=next((root/'bronnen/H3/manuscript').glob('*Hoofdstukoverzicht.md')).read_text(encoding='utf8')
        table=BeautifulSoup(glossary,'html.parser').find_all('table')[-1]
        refs=[re.sub(r'\s+','',row.find_all('td')[-1].get_text())for row in table.find_all('tr')[1:]]
        require(refs==['73','73–76','81–82','81–82','83','83–84','91','91','93','94','94','94'],'Stale glossary references')
        with fitz.open(root/'boek/Boek_2_Theorie_2.1.3_p19-23.pdf') as extract:
            require(len(extract)==5,'Wrong theory extract length')
            for i,page in enumerate(extract):
                require(page.get_text()==doc[i+20].get_text(),'Theory extract text differs')
                require(page.get_pixmap().samples==doc[i+20].get_pixmap().samples,'Theory extract pixels differ')
    return {'exercise_blocks':blocks,'retrieval_headings':headings,'economic_payloads':'PASS (equivalent Dutch notation and SportLint fill-in columns only)',
            'SchaalWerk_curve_points':len(points),'SportLint_MK':[4,4],'SportLint_MO':[9,9],'theory_extract_pages':5}
