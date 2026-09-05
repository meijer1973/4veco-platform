"""Automated source/render/ZIP/asset checks, never visual approval."""
from pathlib import Path
import json
import math
import re
import subprocess
import sys
import tempfile
from zipfile import ZipFile
from bs4 import BeautifulSoup
from PIL import Image, ImageChops
import fitz
from pypdf import PdfReader
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import b2_213 as b
import alt_contract as alt

def normalize(value): return re.sub(r'\s+',' ',value).strip()

def inspect():
    folder=b.ROOT.parent/'4veco-lessen'/b.LESSON_REL
    record=b.target_record(); docs=b.documents(record); fragments=[]; results=[]; raster_checks=[]; titles=[]
    for name,svg in b.asset_sources().items():
        path=folder/'_assets'/f'{name}.svg'
        assert path.read_text(encoding='utf-8')==svg,('source SVG drift',name)
        titles.append(alt.verify_title(name, path.read_text(encoding='utf-8')))
        with tempfile.TemporaryDirectory(prefix='213-png-parity-') as temp:
            png=Path(temp)/'rebuilt.png'
            subprocess.run([sys.executable,'-m','cairosvg',str(path),'-o',str(png),'-s','2'],check=True)
            with Image.open(png) as rebuilt, Image.open(path.with_suffix('.png')) as actual:
                assert rebuilt.size==actual.size and rebuilt.mode==actual.mode,('SVG/PNG geometry mismatch',name)
                delta=ImageChops.difference(rebuilt,actual)
                histogram=delta.convert('RGB').get_flattened_data()
                changed=sum(max(pixel)>0 for pixel in histogram)
                maximum=max(max(pixel) for pixel in delta.convert('RGB').get_flattened_data())
                # Paragraph SVG geometricPrecision avoids Windows default-hint
                # variation. No raster tolerance or exception is accepted here.
                assert maximum==0 and changed==0 and png.read_bytes()==path.with_suffix('.png').read_bytes(),(name,'raster drift',maximum,changed)
                raster_checks.append({'asset':name,'svg_raw_sha256':b.digest(path),'png_raw_sha256':b.digest(path.with_suffix('.png')),
                    'reraster_changed_pixels':changed,'maximum_channel_delta':maximum,'raster_comparison':'exact byte and pixel equality'})
    for kind in ('paragraaf','opgaven','antwoorden'):
        stem=folder/f'{b.STEM} – {kind}'; pdf_path=Path(str(stem)+'.pdf'); html_path=Path(str(stem)+'.html')
        assert Path(str(stem)+'.md').read_text(encoding='utf-8')==docs[kind],('MD/source drift',kind)
        soup=BeautifulSoup(html_path.read_text(encoding='utf-8'),'html.parser'); printed=[]
        alternatives=alt.verify_html(str(soup), kind, folder)
        def visit(text,cm,tm,font,size):
            if text.strip(): printed.append(size*math.sqrt(abs(cm[0]*cm[3]-cm[1]*cm[2])))
        pdf=PdfReader(pdf_path); text=normalize(' '.join(p.extract_text(visitor_text=visit) or '' for p in pdf.pages))
        assert min(printed)>=11.99,(kind,'text/footer size',min(printed))
        for i in range(1,10): assert f'Opgave {i}' in text,(kind,'missing exercise',i)
        if kind!='antwoorden':
            h=soup.find('h2',id='uitgewerkt-voorbeeld'); fragments.append(''.join(str(n) for n in [h,*h.next_siblings]))
            target=soup.find('h2',id='doeloefening').find_next('div',class_='exercise'); target_text=normalize(target.get_text(' ',strip=True))
            assert target.find('strong').get_text()=='Opgave 7'
            assert normalize(record['target_exercise']['context']) in target_text and normalize(record['target_exercise']['context']) in text
            tables=target.find_all('table'); assert len(tables)==2
            for source,table in zip(record['target_exercise']['sources'],tables):
                cells=[[c.get_text().strip() for c in row.find_all(['td','th'])] for row in table.find_all('tr')]
                assert cells==[source['columns'],*source['rows']],(kind,'target cell drift')
                assert normalize(source['content']) in target_text and normalize(source['content']) in text
                for row in source['rows']:
                    assert normalize(' '.join(row)) in text,(kind,'PDF target row',row)
            for q in record['target_exercise']['subquestions']:
                assert normalize(q['prompt']) in target_text and normalize(q['prompt']) in text
                assert f"{q['label']}) ({q['points']} punten)" in target_text
            assert not target.find('ol') and not target.find('img'),'target format/answer leakage'
        if kind=='paragraaf':
            for goal in record['lesson_goals']: assert normalize(goal) in text
        minimum_figure_pt=None; images=0; page_details=[]
        with fitz.open(pdf_path) as doc:
            for n,page in enumerate(doc,1):
                page_images=page.get_image_info()
                for item in page_images:
                    box=fitz.Rect(item['bbox']); images+=1; placed=box.width*80/item['width']
                    assert placed>=12,(kind,n,'placed label',placed)
                    minimum_figure_pt=placed if minimum_figure_pt is None else min(minimum_figure_pt,placed)
                    assert page.rect.contains(box),(kind,n,'image bounds',box)
                for block in page.get_text('dict')['blocks']:
                    if block['type']==0:
                        for ln in block['lines']:
                            for span in ln['spans']:
                                box=fitz.Rect(span['bbox'])
                                assert box.x0>=0 and box.x1<=page.rect.width+.1 and box.y0>=0 and box.y1<=page.rect.height+.1,(kind,n,'text bounds',span['text'])
                page_details.append({'page':n,'text_characters':len(page.get_text()),'images':len(page_images)})
        expected={Path(str(stem)+suffix).name for suffix in ('.md','.html','.pdf')}
        referenced=re.findall(r'!\[[^\]]*\]\(\./_assets/([^\)]+)\)',docs[kind])
        expected.update('_assets/'+str(Path(name).with_suffix(ext)) for name in referenced for ext in ('.svg','.png'))
        with ZipFile(Path(str(stem)+'.zip')) as archive:
            names=archive.namelist(); assert len(names)==len(set(names)) and set(names)==expected,(kind,'ZIP inventory')
            assert archive.testzip() is None
            for name in names:
                assert not name.startswith('/') and '..' not in Path(name).parts
                assert archive.read(name)==(folder/name).read_bytes(),(kind,'ZIP parity',name)
                assert archive.getinfo(name).date_time==(1980,1,1,0,0,0)
        results.append({'kind':kind,'pages':len(pdf.pages),'minimum_text_pt_including_footer':min(printed),
            'minimum_placed_figure_font_pt':minimum_figure_pt,'images':images,'pdf_sha256':b.digest(pdf_path),
            'html_sha256':b.digest(html_path),'zip_sha256':b.digest(Path(str(stem)+'.zip')),'page_geometry_checks':page_details,
            'actual_html_alternatives':alternatives})
    assert fragments[0]==fragments[1],'paired exercise HTML drift'
    return {'paragraph':'2.1.3','automated_result':'PASS','inspection_status':'NOT_SUPPLIED_BY_THIS_SCRIPT',
        'documents':results,'raster_checks':raster_checks,'svg_accessible_titles':titles,'checks':['frozen native tables, 10/6 blanks, Q0 dashes, 4/3/2/4/2 points, all target text and four goals',
        'paired exercise HTML and generated MD exact parity','all nine question IDs','12pt text/footer and actual placed labels',
        'page bounds smoke test','six source SVG/rerasterized PNG pairs','exact ZIP inventory, CRC, byte parity, no answer edition leaks',
        'all eight actual HTML image occurrences: six exact noun-first <=120-character alternatives, unchanged full captions, native distinct-caption semantics',
        'six exact noun-first SVG accessible titles and role/ID bindings']}

if __name__=='__main__':
    result=inspect()
    if len(sys.argv)>1:
        destination=Path(sys.argv[1])
        if destination.exists(): raise ValueError('Use a fresh result file')
        destination.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    print(json.dumps(result,ensure_ascii=False,indent=2))
