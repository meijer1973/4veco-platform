"""Verify the finite follow-up delta, original link geometry and printed output."""
from pathlib import Path
import argparse
import importlib
import json
import re
import sys
import tempfile
import unicodedata

import fitz
from bs4 import BeautifulSoup
from books34_followups_common import (PLATFORM,EDITION,BASE,REVISION,CHAPTERS,PUBLICATIONS,
    CONTRACT,require,sha,write_json,original,guard,target_check,authenticate)
from books34_signed_common import navigation, pdf_delta
from verify_exercise_routes import books34_pdf

OLD_TEACHER_NOTE='**Tijd opnieuw begroten:** de vijf bestaande conflicten blijven open. Ook de overige theorieparagrafen missen een onderbouwde volledige begroting: begeleide inoefening ontbrak in de eerdere totalen. De individuele lespagina’s maken dit zichtbaar; plan aanvullende lestijd zonder oefeningen of doelen te schrappen.'
NEW_TEACHER_NOTE='**Tijdsadvies:** reserveer voorlopig twee lessen van 55 minuten per theorieparagraaf voor de volledige normale route. Bij de vijf bekende conflicten is extra uitloop nodig in de planning. Dit is een aanbeveling, geen gemeten tijd of bewezen 110-minutenfit. De lespagina’s geven een flexibele verdeling; pas die aan de klas aan zonder oefeningen of doelen te schrappen. Gemengde paragrafen houden hun eigen structuur.'


def clean(text):
    return re.sub(r'\s|[•●]', '',unicodedata.normalize('NFKC',text))


def link_signature(link,doc=None,offset=0):
    """Independent expected signature: source named destinations use resolve_link."""
    value={k:v for k,v in link.items() if k not in ('xref','id','nameddest')}
    if link['kind']==fitz.LINK_NAMED:
        page,x,y=doc.resolve_link('#nameddest='+link['nameddest'])
        require(0<=page<len(doc),'Unresolved source destination')
        value={'kind':fitz.LINK_GOTO,'from':link['from'],'page':page,'to':fitz.Point(x,y),'zoom':link.get('zoom',0)}
    if value['kind']==fitz.LINK_GOTO:value['page']+=offset
    return {k:[round(n,3) for n in v] if isinstance(v,(fitz.Rect,fitz.Point)) else v for k,v in value.items()}


def all_links(doc):
    return [[link_signature(link,doc) for link in page.get_links()] for page in doc]


def navigation_check(lessons):
    root=lessons/EDITION
    mapping=json.loads((root/'curriculum/book-page-map-v3.json').read_text(encoding='utf-8'))
    expected_counts={'3.1':28,'3.2':0,'3.3':19,'4.1':0,'4.2':28,'4.3':24}
    results=[]
    for b in ('3','4'):
        filename=f'books/book-{b}/output/Boek_{b}_Compleet_v3.pdf'
        with fitz.open(root/filename) as final, fitz.open(stream=original(lessons,EDITION+'/'+filename),filetype='pdf') as old:
            require(len(old)==len(final) and old.get_toc()==final.get_toc(),'Student pagination/bookmarks changed')
            chapter_pages=set()
            for c,info in mapping[b]['chapters'].items():
                start=info['student_offset']
                source=root/f'books/book-{b}/chapters/{c}/output/Boek_{b}_H{c[-1]}_Leerling_v3_bookpages.pdf'
                with fitz.open(source) as chapter:
                    total=0
                    for local,page in enumerate(chapter):
                        expected=[link_signature(link,chapter,start) for link in page.get_links()]
                        actual=[link_signature(link) for link in final[start+local].get_links()]
                        require(actual==expected,f'Lost, duplicated or displaced link {c} p{local+1}')
                        if local==0:require(len(expected)==expected_counts[c],'Unexpected opening annotation count '+c)
                        total+=len(expected);chapter_pages.add(start+local)
                    results.append({'chapter':c,'opening_page':start+1,'opening_annotations':expected_counts[c],
                                    'all_chapter_annotations_preserved':total,'rectangles_and_destination_coordinates_checked':True})
            for i in range(len(final)):
                if i not in chapter_pages:
                    require(all_links_page(old,i)==all_links_page(final,i),'Unrelated navigation changed '+filename+f' p{i+1}')
                require(old[i].get_text()==final[i].get_text(),'Student text changed '+filename+f' p{i+1}')
                require(old[i].get_pixmap().samples==final[i].get_pixmap().samples,'Student pixels changed '+filename+f' p{i+1}')
    require(sum(r['opening_annotations'] for r in results)==99,'Expected 99 chapter-opening annotations')
    return results


def all_links_page(doc,index):
    return [link_signature(link,doc) for link in doc[index].get_links()]


def chapter_html_and_pdf(lessons,comparison=None):
    root=lessons/EDITION
    sys.path.insert(0,str(root/'build'))
    import render
    require(render.ROOT.resolve()==root.resolve(),'Wrong source render root')
    results=[]
    for c,kind in [(c,'teacher') for c in CHAPTERS]+[('3.2','answer')]:
        folder=root/f'books/book-{c[0]}/chapters/{c}'
        label='Docenteninformatie' if kind=='teacher' else 'Antwoorden'
        stem=f'Boek_{c[0]}_H{c[-1]}_{label}_v3'
        chunks=render.chunks(folder/(label+'.md'))
        html_path=folder/'output'/f'{stem}.html'
        soup=BeautifulSoup(html_path.read_text(encoding='utf-8'),'html.parser')
        sections=soup.select('section.page')
        require(len(sections)==len(chunks),'Chapter HTML section count '+c)
        css=(folder/'print.css').read_text(encoding='utf-8')+'\n.page-title{font-size:17pt;}\n'
        css+=('html{font-size:10.7pt;line-height:1.38;} .teacher table{font-size:9.4pt;}' if kind=='teacher' else 'html{font-size:10.8pt;line-height:1.36;}.formula{font-size:10pt;}')
        require(soup.style.string==css,'Unapproved chapter HTML styling '+c)
        pdf=html_path.with_suffix('.pdf')
        old_bytes=(comparison/pdf.relative_to(lessons)).read_bytes() if comparison else original(lessons,pdf.relative_to(lessons).as_posix())
        with fitz.open(pdf) as doc, fitz.open(stream=old_bytes,filetype='pdf') as old:
            require(len(doc)==len(chunks)==len(old),'Chapter pagination changed '+stem)
            old_navigation=navigation(old)
            if kind=='teacher':
                old_navigation['toc']=[[level,title.replace('Lestijd opnieuw begroten','Lestijd plannen'),page]
                                       for level,title,page in old_navigation['toc']]
            require(navigation(doc)==old_navigation,'Chapter navigation changed '+stem)
            changed=[]
            for i,(source,section,page) in enumerate(zip(chunks,sections,doc,strict=True)):
                require(section.get('data-section')==source['section'] and section.get('data-designed-page')==str(i+1),'Misassigned HTML page')
                expected=BeautifulSoup(render.render_md(source['body']),'html.parser')
                # Images in answer output are embedded; the source/asset guards
                # freeze them, while text comparison covers all answer bodies.
                actual=BeautifulSoup(str(section),'html.parser')
                title=actual.select_one('.page-title')
                if title:title.decompose()
                require(clean(actual.get_text())==clean(expected.get_text()),f'Stale HTML body {stem} p{i+1}')
                require(clean(section.get_text()) in clean(page.get_text()),f'PDF body omitted/stale {stem} p{i+1}')
                require(page.get_text()==old[i].get_text() or source['section'] in ('3.2.3',*CHAPTERS) or
                        ('Planningsadvies' in source['body'] and kind=='teacher'),f'Unexpected changed paragraph {stem} p{i+1}')
                if page.get_text()!=old[i].get_text():changed.append(i+1)
                elif comparison:require(page.get_pixmap().samples==old[i].get_pixmap().samples,f'Unchanged chapter pixels drift {stem} p{i+1}')
                for block in page.get_text('blocks'):
                    require(block[0]>=-1 and block[1]>=-1 and block[2]<=page.rect.width+1 and block[3]<=page.rect.height+1,'Text outside page')
            results.append({'chapter':c,'kind':kind,'pages':len(doc),'changed_pages':changed,'source_html_pdf_text_checked':True})
        mapping=json.loads(pdf.with_name(stem+'_page_map.json').read_text(encoding='utf-8'))
        require(all(p['pdf_page']==i and p['designed_pages']==[i] for i,p in enumerate(mapping,1)),'Teacher/answer overflow')
    return results


def timing(lessons):
    root=lessons/EDITION
    routes=json.loads((root/'curriculum/lesson-routes-v3.json').read_text(encoding='utf-8'))
    require((root/'curriculum/lesson-routes-v3.json').read_bytes()==original(lessons,EDITION+'/curriculum/lesson-routes-v3.json'),'Timing estimates or routes rewritten')
    import render
    coverage=[];heavy=[]
    for c in CHAPTERS:
        pages=render.chunks(root/f'books/book-{c[0]}/chapters/{c}/Docenteninformatie.md')
        for page in pages:
            pid=page['section']
            if pid not in routes:continue
            r=routes[pid]
            if r.get('route_exception'):
                require('Planningsadvies' not in page['body'],'Standard schedule invented for mixed paragraph')
                coverage.append({'paragraph':pid,'scope':'unchanged mixed-practice exception'})
                continue
            body=page['body']
            require('Planningsadvies (niet gemeten)' in body and 'twee lessen van 55 minuten' in body and
                    '110-minutenfit is niet aangetoond' in body,'Missing timing qualification '+pid)
            for phase in ('Startopgaven','Begeleide inoefening','Zelfstandige oefening','Doeloefening'):
                require(', '.join(r['normal_route'][phase]) in body,'Missing actual route exercises '+pid)
            require('samenvatting en overgangen' in body and 'feedback' in body,'Incomplete planning activities '+pid)
            if r['one_lesson_status']=='open_existing_timing_conflict':
                heavy.append(pid);require('extra uitloop' in body,'Missing heavy-paragraph buffer')
            coverage.append({'paragraph':pid,'scope':'teacher planning advice only','measured_minutes':None})
    require(len([r for r in coverage if 'measured_minutes' in r])==25,'Expected 25 recommendations')
    require(heavy==['3.1.2','3.1.3','3.1.5','4.2.4','4.2.5'],'Changed five heavy paragraphs')
    return {'coverage':coverage,'extra_buffer':heavy,'empirical_fit_claimed':False}


def expected_teacher_front(previous,render_md):
    before=render_md(OLD_TEACHER_NOTE).strip()
    after=render_md(NEW_TEACHER_NOTE).strip()
    require(previous.count(before)==1,'Missing predecessor teacher-front note')
    return previous.replace(before,after,1)


def teacher_front(lessons):
    import render
    results=[]
    for b in ('3','4'):
        name=f'{EDITION}/books/book-{b}/book-matter/output/front-teacher.html'
        actual=(lessons/name).read_text(encoding='utf-8')
        expected=expected_teacher_front(original(lessons,name).decode('utf-8'),render.render_md)
        require(actual==expected,'Stale/unapproved teacher front HTML '+b)
        sections=BeautifulSoup(actual,'html.parser').select('section.page')
        complete=f'{EDITION}/books/book-{b}/output/Boek_{b}_Compleet_Docenteninformatie_v3.pdf'
        with (fitz.open((lessons/name).with_suffix('.pdf')) as front,fitz.open(lessons/complete) as book,
                fitz.open(stream=original(lessons,complete),filetype='pdf') as previous):
            require(len(front)==len(sections)==2,'Teacher front pagination changed')
            require(navigation(book)==navigation(previous),'Teacher volume navigation changed')
            for i,section in enumerate(sections):
                require(clean(section.get_text()) in clean(front[i].get_text()),'Stale/omitted teacher front PDF text')
                require(front[i].get_text()==book[i].get_text(),'Stale complete teacher front text')
                require(front[i].get_pixmap().samples==book[i].get_pixmap().samples,'Changed complete teacher front pixels')
            results.append({'book':b,'source_html_pdf_text_checked':True,'assembled_front_pages':2,'navigation_preserved':True})
    return results


def verify(lessons,report,comparison=None):
    authenticated=authenticate(comparison,lessons) if comparison else None
    guard(lessons)
    targets=target_check(lessons)
    chapters=chapter_html_and_pdf(lessons,comparison)
    timetable=timing(lessons)
    fronts=teacher_front(lessons)
    links=navigation_check(lessons)
    deltas=[]
    with tempfile.TemporaryDirectory(prefix='b34-followups-') as temp:
        for name in sorted(PUBLICATIONS):
            if name.endswith('_page_map.json'):
                require((lessons/EDITION/name).read_bytes()==original(lessons,EDITION+'/'+name),'Changed local page map '+name)
            if name.endswith('.pdf') and 'Antwoorden' in name:
                old=Path(temp)/Path(name).name
                old.write_bytes((comparison/EDITION/name).read_bytes() if comparison else original(lessons,EDITION+'/'+name))
                delta=pdf_delta(old,lessons/EDITION/name,[{'old':'Herhaling 20 en 21','new':'Herhaling 29 en 30'}],pixels=bool(comparison))
                require(delta['changed_pages']==([51] if 'Compleet' in name else [17]),'Unexpected answer heading delta')
                deltas.append({'path':name,**delta})
        assembled=books34_pdf(lessons)
        validator=importlib.import_module('books34_verify')
        structural_path=Path(temp)/'structural.json'
        validator.main(structural_path)
        structural=json.loads(structural_path.read_text(encoding='utf-8'))
    result={'revision':REVISION,'baseline':BASE,'comparison':authenticated,'source_files':len(CONTRACT['source_bindings']),
            'publications':len(PUBLICATIONS),'target_preservation':targets,'chapters':chapters,'heading':deltas,
            'navigation':links,'timing':timetable,'teacher_front':fronts,'assembly':assembled,'structural':structural,
            'scope':'Bounded follow-up verification; no empirical timing, curriculum or target approval conferred.'}
    write_json(report,result)
    print(json.dumps({'result':'PASS','report':str(report),'publications':len(PUBLICATIONS),'annotations_restored':99,'teacher_recommendations':25}))
    return result


if __name__=='__main__':
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--lesson-root',type=Path,default=PLATFORM.parent/'4veco-lessen')
    ap.add_argument('--report',type=Path,required=True)
    ap.add_argument('--comparison-root',type=Path)
    args=ap.parse_args();sys.dont_write_bytecode=True
    verify(args.lesson_root.resolve(),args.report,args.comparison_root.resolve() if args.comparison_root else None)
