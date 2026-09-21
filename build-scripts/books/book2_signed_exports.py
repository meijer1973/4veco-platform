"""Current paragraph projections of Book 2's editable chapter manuscripts.

The received exporters remain historical. This exporter supports semantic
fixed-page components, nested figure assets and paragraph-local PDF links.
"""
import json
import os
from pathlib import Path
import re
import shutil
import sys
from pypdf import PdfReader,PdfWriter
from pypdf.generic import ArrayObject,DictionaryObject,NameObject,NumberObject,TextStringObject
from build_book2_chat import localize_links

EXERCISE_STARTS={'2.1.1':5,'2.1.2':13,'2.1.3':22,'2.1.4':29,
 '2.2.1':5,'2.2.2':12,'2.2.3':23,'2.2.4':30,
 '2.3.1':5,'2.3.2':13,'2.3.3':24,'2.3.4':31}
TITLES={
 '2.1.1':'Kostenstructuren','2.1.2':'Opbrengsten, winst en break-even','2.1.3':'Marginale kosten en marginale opbrengsten','2.1.4':'Gemengde opgaven',
 '2.2.1':'Prijselasticiteit','2.2.2':'Elasticiteit en omzet','2.2.3':'Inkomenselasticiteit en kruislingse elasticiteit','2.2.4':'Gemengde opgaven',
 '2.3.1':'Consumentensurplus','2.3.2':'Producentensurplus en totaal surplus','2.3.3':'Pareto-efficiëntie en welvaartsverlies','2.3.4':'Gemengde opgaven'}


def slice_pdf(source,destination,start,end):
    reader=PdfReader(source);localize_links(reader)
    # A reference-page bar can point outside an exercise-only/paragraph slice.
    # Retain that clickable area as an explicit relative link to its chapter,
    # rather than letting pypdf silently discard the missing destination.
    for page in reader.pages[start-1:end]:
        for ref in page.get('/Annots',[]):
            annotation=ref.get_object();action=annotation.get('/A')
            action=action.get_object() if action else None
            dest=annotation.get('/Dest') or (action.get('/D') if action and action.get('/S')=='/GoTo' else None)
            if not isinstance(dest,ArrayObject):continue
            target=reader.get_page_number(dest[0].get_object())
            if not start-1<=target<end:
                annotation.pop('/Dest',None)
                annotation[NameObject('/A')]=DictionaryObject({NameObject('/S'):NameObject('/GoToR'),
                    NameObject('/F'):TextStringObject(os.path.relpath(source,destination.parent).replace('\\','/')),
                    NameObject('/D'):ArrayObject([NumberObject(target),*dest[1:]])})
    writer=PdfWriter();writer.append(reader,pages=(start-1,end))
    writer.add_metadata({'/Title':destination.stem,'/Author':'4veco'})
    with destination.open('wb') as output:writer.write(output)


def export(folder,number,pages,student_name):
    # pathlib on Windows needs extended paths for nested Dutch export names.
    if sys.platform=='win32':folder=Path('\\\\?\\'+str(folder))
    chapter=folder/'output'/f'{student_name}.pdf'
    answer_pdf=folder/'output'/f'Boek_2_H{number}_Antwoorden.pdf'
    answer_source=next(folder.glob('*antwoorden.md'))
    answer_text=answer_source.read_text(encoding='utf8')
    import fitz
    with fitz.open(answer_pdf) as doc:
        starts={row[1].split()[0]:row[2] for row in doc.get_toc() if row[0]==1 and row[1].startswith(f'2.{number}.')}
        answer_count=len(doc)
    summary={}
    for pid,title in TITLES.items():
        if not pid.startswith(f'2.{number}.'):continue
        dest=folder/'paragrafen'/f'{pid} {title}';dest.mkdir(parents=True,exist_ok=True)
        selected=[(i,p)for i,p in enumerate(pages,1)if p['section']==pid]
        start,end=selected[0][0],selected[-1][0]
        all_text='\n\n'.join(p['body'] for _,p in selected)
        exercise_start=EXERCISE_STARTS[pid]
        exercise_text='\n\n'.join(p['body'] for i,p in selected if i>=exercise_start)
        ans=re.search(r'^# '+re.escape(pid)+r' [\s\S]*?(?=^# |\Z)',answer_text,re.M)
        if not ans:raise ValueError('Missing answer source '+pid)
        answer=ans.group().strip()+'\n'
        for kind,text,lo,hi in [('paragraaf',all_text,start,end),('opgaven',exercise_text,exercise_start,end)]:
            if kind=='paragraaf' and pid.endswith('.4'):continue
            (dest/f'{pid} {title} – {kind}.md').write_text(f'# {pid} {title}\n\n'+text,encoding='utf8',newline='\n')
            slice_pdf(chapter,dest/f'{pid} {title} – {kind}.pdf',lo,hi)
        (dest/f'{pid} {title} – antwoorden.md').write_text(answer,encoding='utf8',newline='\n')
        answer_start=starts[pid];answer_end=min([v-1 for v in starts.values() if v>answer_start]or[answer_count])
        slice_pdf(answer_pdf,dest/f'{pid} {title} – antwoorden.pdf',answer_start,answer_end)
        refs=set(re.findall(r'(?:src="|\]\()(_assets/[^"\)]+)',all_text+'\n'+answer))
        for reference in sorted(refs):
            for suffix in ('.svg','.png'):
                relative=Path(reference).with_suffix(suffix);src=folder/relative;dst=dest/relative
                if not src.is_file():raise FileNotFoundError(src)
                dst.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(src,dst)
        (dest/'build_pdf.py').write_text('''"""Rebuild native Book 2 sources through the owning platform workflow."""
from pathlib import Path
import subprocess,sys
lessons=Path(__file__).resolve().parents[7]
builder=lessons.parent/'4veco-platform/build-scripts/books/rebuild_book2_signed.py'
subprocess.run([sys.executable,'-X','utf8',str(builder),'--lesson-root',str(lessons),'--all'],check=True)
''',encoding='utf8',newline='\n')
        (dest/'LEESMIJ.md').write_text('Afgeleide export van de bewerkbare hoofdstukbron. Bewerk ../../manuscript/ en het hoofdstukbestand met antwoorden. Bouw via het platformscript rebuild_book2_signed.py. De PDF behoudt de doorlopende boekpaginanummers; de figuren blijven afzonderlijke SVG/PNG-bestanden. Verwijzingen buiten deze export openen de bijbehorende pagina in ../../output/; behoud daarom de mappenstructuur bij verspreiding.\n',encoding='utf8',newline='\n')
        summary[pid]={'chapter_pages':[start,end],'exercise_pages':[exercise_start,end],'answer_pages':[answer_start,answer_end],'exercise_count':len(set(re.findall(r'Opgave (\d+)',all_text))),'assets':sorted(refs)}
    (folder/'paragraph-exports.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n',encoding='utf8',newline='\n')
    manifest=[{'id':pid,'title':TITLES[pid],'student_pages':row['chapter_pages'],
               'exercise_pages':row['exercise_pages'],'theory':not pid.endswith('.4'),
               'assets':row['assets'],'folder':f'paragrafen/{pid} {TITLES[pid]}'}
              for pid,row in summary.items()]
    (folder/'paragrafen/manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8',newline='\n')
    print(f'H{number}: four native paragraph/answer projections exported')
