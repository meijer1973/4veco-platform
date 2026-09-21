"""Native reconstruction entry point for the bounded 2026-09-21 Book 2 revision.

Received renderers remain immutable. Current component/figure implementation
lives here in platform; all authored text and figures live in lesson sources.
"""
from pathlib import Path
import argparse
import importlib
import json
import os
import re
import sys

from book2_native_theory import CSS, page_body, render_figures
from build_book2_chat import EDITION
from book2_signed_exports import export

PLATFORM=Path(__file__).resolve().parents[2]


def chapter(lessons,number,derivatives=False):
    folder=lessons/EDITION/'bronnen'/f'H{number}'
    render_figures(folder)
    sys.path.insert(0,str(folder))
    renderer=importlib.import_module('build')
    renderer.CSS+='\n.route{padding:4pt 9pt;margin:4pt 0 5pt;line-height:1.15;}\n'+CSS
    html=[]
    for i,p in enumerate(renderer.PAGES,1):
        native=p.get('native_layout')=='theory-20260921'
        if native:body=page_body(p['body'],i,number,renderer.render_markdown)
        else:
            heading='' if i==1 or re.search(r'^# ',p['body'],re.M) else f'<div class="page-title">{p["section"]} · {p["title"]}</div>'
            body=heading+renderer.render_markdown(p['body'])
        global_page=i+{1:2,2:36,3:72}[number]
        html.append(f'<section id="book2-page-{global_page}" class="page'+(' native-page' if native else '')+f'" data-designed-page="{i}">'+body+'</section>')
    out=renderer.embedded_html('\n'.join(html),f'Boek 2 · Hoofdstuk 2.{number}')
    # Preserve the stable filenames owned by this edition and its exporter.
    names={1:'Boek_2_H1_Kosten_en_opbrengsten',2:'Boek_2_H2_Elasticiteit',3:'Boek_2_H3_Surplus_en_welvaart'}
    name=names[number]
    (folder/'output'/f'{name}.html').write_text(out,encoding='utf8',newline='\n')
    from weasyprint import HTML
    document=HTML(string=out,base_url=str(folder)).render()
    from book2_native_checks import check_layout
    check_layout(document)
    page_map=[]
    for n,page in enumerate(document.pages,1):
        markers=set()
        for box in page._page_box.descendants():
            element=getattr(box,'element',None)
            if element is not None and element.get('data-designed-page'):markers.add(element.get('data-designed-page'))
        page_map.append({'pdf_page':n,'designed_pages':sorted(markers,key=int)})
    expected={1:34,2:36,3:38}[number]
    if len(document.pages)!=expected or any(row['designed_pages']!=[str(row['pdf_page'])] for row in page_map):
        raise ValueError(f'H{number} page allocation overflow: {page_map}')
    document.write_pdf(folder/'output'/f'{name}.pdf')
    (folder/'output/page_map.json').write_text(json.dumps(page_map,indent=2)+'\n',encoding='utf8',newline='\n')
    combined=next(folder.glob('*hoofdstuk.md'))
    combined.write_text('\n\n<div class="page-break"></div>\n\n'.join(p['body'] for p in renderer.PAGES),encoding='utf8',newline='\n')
    print(f'H{number}: {len(document.pages)} native pages, allocation PASS')
    if derivatives:
        answer_pages=importlib.import_module('build_answers').build_answers()
        if answer_pages!={1:20,2:18,3:17}[number]:raise ValueError('Answer page allocation changed')
        importlib.import_module('build_teacher').build_teacher()
        export(folder,number,renderer.PAGES,name)
        # Historical chapter writers use the host newline convention. Normalize
        # derived text here, without changing their preserved source programs.
        for generated in (folder/'output').iterdir():
            if generated.suffix in ('.html','.json'):
                generated.write_text(generated.read_text(encoding='utf8'),encoding='utf8',newline='\n')


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--lesson-root',type=Path,default=PLATFORM.parent/'4veco-lessen')
    mode=parser.add_mutually_exclusive_group(required=True)
    mode.add_argument('--chapter',type=int,choices=(1,2,3))
    mode.add_argument('--all',action='store_true')
    mode.add_argument('--assemble',action='store_true',help='Validate the existing source/chapter record and assemble; does not refresh provenance')
    parser.add_argument('--derivatives',action='store_true')
    args=parser.parse_args()
    os.environ['PYTHONDONTWRITEBYTECODE']='1';sys.dont_write_bytecode=True
    lessons=args.lesson_root.resolve()
    if args.chapter:chapter(lessons,args.chapter,args.derivatives)
    else:
        if args.all:
            import subprocess
            for number in (1,2,3):
                subprocess.run([sys.executable,'-X','utf8',str(__file__),'--lesson-root',str(lessons),'--chapter',str(number),'--derivatives'],check=True)
        from assemble_book2_signed import record_chapters,build
        if args.all:record_chapters(lessons/EDITION)
        build(lessons/EDITION)


if __name__=='__main__':main()
