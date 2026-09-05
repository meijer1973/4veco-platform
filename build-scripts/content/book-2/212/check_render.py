"""Automatic rendered-source checks, not visual inspection or acceptance."""
from pathlib import Path
import json
import math
import re
import sys
from zipfile import ZipFile
from bs4 import BeautifulSoup
import fitz
from pypdf import PdfReader
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import b2_212 as b


def normalize(text):
    return re.sub(r'\s+',' ',text).strip()


def inspect():
    folder=b.ROOT.parent/'4veco-lessen'/b.LESSON_REL
    record=b.target_record(); fragments=[]; results=[]
    for kind in ('paragraaf','opgaven','antwoorden'):
        stem=folder/f'{b.STEM} – {kind}'
        pdf_path=Path(str(stem)+'.pdf'); html_path=Path(str(stem)+'.html')
        soup=BeautifulSoup(html_path.read_text(encoding='utf-8'),'html.parser')
        printed=[]
        def visit(text,cm,tm,font,size):
            if text.strip():
                printed.append(size*math.sqrt(abs(cm[0]*cm[3]-cm[1]*cm[2])))
        pdf=PdfReader(pdf_path)
        text=normalize(' '.join(p.extract_text(visitor_text=visit) or '' for p in pdf.pages))
        assert min(printed)>=11.99,(kind,'text size including footer',min(printed))
        for i in range(1,10):
            assert f'Opgave {i}' in text,(kind,'missing exercise',i)
        if kind in ('paragraaf','opgaven'):
            h=soup.find('h2',id='uitgewerkt-voorbeeld')
            fragments.append(''.join(str(n) for n in [h,*h.next_siblings]))
            target=soup.find('h2',id='doeloefening').find_next('div',class_='exercise')
            target_text=normalize(target.get_text(' ',strip=True))
            assert target.find('strong').get_text()=='Opgave 7'
            assert normalize(record['target_exercise']['context']) in target_text
            assert normalize(record['target_exercise']['context']) in text
            for q in record['target_exercise']['subquestions']:
                assert normalize(q['prompt']) in target_text
                assert normalize(q['prompt']) in text
                assert f"{q['label']}) ({q['points']} punten)" in target_text
            assert not target.find('ol'),'target letters became an automatic numeric list'
            assert not target.find('img'),'target answer leakage'
        if kind=='paragraaf':
            for goal in record['lesson_goals']:
                assert normalize(goal) in text
        minimum_figure_pt=100; images=0; page_details=[]
        with fitz.open(pdf_path) as doc:
            for n,page in enumerate(doc,1):
                page_images=page.get_image_info()
                for item in page_images:
                    box=fitz.Rect(item['bbox']); images+=1
                    # Every SVG label is40 CSSpx; raster export is2x.
                    placed=box.width*80/item['width']
                    assert placed>=12,(kind,n,'figure text',placed)
                    minimum_figure_pt=min(minimum_figure_pt,placed)
                    assert page.rect.contains(box),(kind,n,'image outside page',box)
                for block in page.get_text('dict')['blocks']:
                    if block['type']==0:
                        for ln in block['lines']:
                            for span in ln['spans']:
                                box=fitz.Rect(span['bbox'])
                                assert box.x0>=0 and box.x1<=page.rect.width+.1 and box.y0>=0 and box.y1<=page.rect.height+.1,(kind,n,'text outside page',span['text'])
                page_details.append({'page':n,'text_characters':len(page.get_text()),'images':len(page_images)})
        with ZipFile(Path(str(stem)+'.zip')) as archive:
            assert archive.testzip() is None
            for name in archive.namelist():
                assert archive.read(name)==(folder/name).read_bytes(),(kind,'stale ZIP item',name)
        results.append({'kind':kind,'pages':len(pdf.pages),'minimum_text_pt_including_footer':min(printed),
            'minimum_placed_figure_font_pt':minimum_figure_pt,'images':images,'pdf_sha256':b.digest(pdf_path),
            'html_sha256':b.digest(html_path),'page_geometry_checks':page_details})
    assert fragments[0]==fragments[1],'paired exercise HTML drift'
    return {'paragraph':'2.1.2','automated_result':'PASS','inspection_status':'NOT_SUPPLIED_BY_THIS_SCRIPT',
            'documents':results,'checks':['exact target text/goals/2-2-3-4 points','same exercise HTML source',
            'all 1–9 question IDs','all text including footer at least12pt','placed figure text at least12pt',
            'page-bounds smoke test','ZIP members equal current outputs']}


if __name__=='__main__':
    result=inspect()
    if len(sys.argv)>1:
        Path(sys.argv[1]).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    print(json.dumps(result,ensure_ascii=False,indent=2))
