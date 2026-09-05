"""Bounded §212 metadata evidence. Does not confer visual/review acceptance.

HOW TO ADAPT: intentionally fixed immutable bases and metadata allowlist;
new corrections need their own scope review and unique evidence prefix.
"""
import argparse
import base64
import hashlib
import json
import re
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path
from zipfile import ZipFile
from bs4 import BeautifulSoup, NavigableString, Tag
from PIL import Image, ImageChops

ROOT=Path(__file__).resolve().parents[2]
LESSON=ROOT.parent/'4veco-lessen'
sys.path.insert(0,str(ROOT/'build-scripts/content/book-2/212'))
import test_metadata as t
b=t.b
FOLDER=LESSON/b.LESSON_REL
PBASE=t.BASE
LBASE='a2bb4bcf199b8871eef21426f329efb6795e7dd8'
PREFIX='BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-'
OUT=ROOT/'reports/sprints'
PROOF=ROOT/'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1'

def sha(data):
    return hashlib.sha256(data).hexdigest()

def save(name,data):
    path=OUT/(PREFIX+name+'.json')
    if path.exists():
        raise ValueError(f'Evidence collision: {path}')
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    print(json.dumps({'path':str(path),'sha256':b.digest(path)},ensure_ascii=True))

def old(repo,path):
    return subprocess.check_output(['git','show',(LBASE if repo==LESSON else PBASE)+':'+path],cwd=repo)

def baseline():
    assert not list(PROOF.glob('212-*-r6'))
    paths=list(FOLDER.rglob('*'))+[FOLDER.parent/'_chapter-plan.md',FOLDER.parent.parent/'_book-plan.md']
    for sibling in ('2.1.1 Kostenstructuren','2.1.3 Marginale kosten en marginale opbrengsten'):
        paths+=list((FOLDER.parent/sibling).rglob('*'))
    for directory in (ROOT/'build-scripts/content/book-2/211',ROOT/'build-scripts/content/book-2/212',ROOT/'build-scripts/content/book-2/213'):
        paths+=list(directory.glob('*'))
    paths += [ROOT/'build-scripts/content/book-2'/name for name in ('b2_211.py','b2_212.py','b2_213.py','print_pipeline.py') if (ROOT/'build-scripts/content/book-2'/name).is_file()]
    paths += [ROOT/name for name in ('references/authored/course-target-exercises.json','references/authored/book-outlines/book-2-outline.md','references/authored/book-outlines/book-2-outline.meta.json','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-plan.md','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-review-corrections.md','reports/sprints/BOOK2-TARGET-INTEGRATION-1-owner-authorization.md','scripts/validate-paragraph.js','build-scripts/workflows/check-paragraph-lane-scope.js')]
    oldproof=list(PROOF.glob('212-*-r5'))
    assert len(oldproof)==3
    for directory in oldproof:
        paths+=list(directory.rglob('*'))
    records=[]
    for path in sorted(set(paths)):
        if not path.is_file() or '__pycache__' in path.parts:
            continue
        repo=LESSON if path.is_relative_to(LESSON) else ROOT
        records.append({'repo':'lessons' if repo==LESSON else 'platform','path':path.relative_to(repo).as_posix(),'sha256':b.digest(path)})
    save('baseline-r6',{'platform_base':PBASE,'lesson_base':LBASE,'snapshot':'Before nine source-alt insertions and five title substitutions; new failing regression file already present.','files':records,'r5_pages':sum(len(list(d.glob('pages/page-*.png'))) for d in oldproof),'zip_member_counts':{p.name:len(ZipFile(p).namelist()) for p in FOLDER.glob('*.zip')}})

def tree(node):
    if isinstance(node,NavigableString):
        text=re.sub(r'\s+',' ',str(node)).strip()
        return ['text',text] if text else None
    if isinstance(node,Tag):
        return [node.name,dict(sorted(node.attrs.items())),[value for child in node.children if (value:=tree(child)) is not None]]

def verify():
    before=json.loads((OUT/(PREFIX+'baseline-r6.json')).read_text(encoding='utf-8'))
    build=json.loads((OUT/(PREFIX+'build-r6.json')).read_text(encoding='utf-8'))
    assert build['inspection_status']=='PENDING'
    changes=[]
    inventory=[]
    for record in before['files']:
        repo=LESSON if record['repo']=='lessons' else ROOT
        current=b.digest(repo/record['path'])
        inventory.append({**record,'after_sha256':current,'changed':current!=record['sha256']})
        if current!=record['sha256']:
            changes.append((record['repo'],record['path']))
    allowed={('platform','build-scripts/content/book-2/b2_212.py')}
    allowed|={('platform','build-scripts/content/book-2/212/'+n) for n in t.SOURCES}
    allowed|={('lessons',(b.LESSON_REL/(b.STEM+' – '+kind+'.'+ext)).as_posix()) for kind in ('paragraaf','opgaven','antwoorden') for ext in ('md','html','zip')}
    allowed|={('lessons',(b.LESSON_REL/'_assets'/(name+'.svg')).as_posix()) for name in t.TITLES}
    assert set(changes)==allowed, changes
    metadata,dom_delta,zip_results,page_results,pixels,titles=[],[],[],[],[],[]
    for record in build['documents']:
        kind=Path(record['source_pdf']).stem.rsplit(' – ',1)[1]
        markdown=Path(record['source_md'])
        previous_md=old(LESSON,markdown.relative_to(LESSON).as_posix()).decode('utf-8')
        assert markdown.read_text(encoding='utf-8')==t.source_replacement(previous_md)
        previous_html=old(LESSON,Path(record['source_html']).relative_to(LESSON).as_posix()).decode('utf-8')
        expected=BeautifulSoup(previous_html,'html.parser')
        actual=BeautifulSoup(Path(record['source_html']).read_text(encoding='utf-8'),'html.parser')
        beforefigs,afterfigs=expected.find_all('figure'),actual.find_all('figure')
        names=[name for _,name,_ in t.IMAGE.findall(markdown.read_text(encoding='utf-8'))]
        assert len(names)==len(beforefigs)==len(afterfigs)
        for name,of,nf in zip(names,beforefigs,afterfigs):
            old_caption=re.sub(r'\s+',' ',of.figcaption.get_text(' ',strip=True)).strip()
            new_caption=re.sub(r'\s+',' ',nf.figcaption.get_text(' ',strip=True)).strip()
            assert old_caption==new_caption,(kind,name,'caption')
            previous_caption_html=str(of.figcaption)
            if name in t.ALTS:
                assert of.img['alt']==old_caption
                assert nf.img['alt']==t.ALTS[name]
                assert of.figcaption.attrs=={'aria-hidden':'true'} and nf.figcaption.attrs=={}
                of.img['alt']=t.ALTS[name]
                del of.figcaption['aria-hidden']
                dom_delta.append({'edition':kind,'asset':name,'img.alt.before':old_caption,'img.alt.after':nf.img['alt'],'figcaption.aria-hidden':{'before':'true','after':None},'caption_html_before':previous_caption_html,'caption_html_after':str(nf.figcaption),'normalized_caption_equal':True})
            assert len(nf.img['alt'])<=120
            assert t.noun_first(nf.img['alt'])
            png=FOLDER/'_assets'/(name+'.png')
            assert base64.b64decode(nf.img['src'].split(',',1)[1])==png.read_bytes()
            metadata.append({'edition':kind,'asset':name,'alt':nf.img['alt'],'characters':len(nf.img['alt']),'full_caption':new_caption})
        assert tree(expected)==tree(actual),(kind,'unexpected normalized DOM difference')
        pdf=Path(record['source_pdf'])
        assert pdf.read_bytes()==old(LESSON,pdf.relative_to(LESSON).as_posix()),(kind,'PDF bytes')
        proof=Path(record['proof_directory'])
        prior=PROOF/proof.name.replace('-r6','-r5')
        nm=json.loads((proof/'manifest.json').read_text(encoding='utf-8'))
        om=json.loads((prior/'manifest.json').read_text(encoding='utf-8'))
        assert nm['inspection_status']=='PENDING' and nm['pages_inspected']==[]
        assert nm['page_sha256']==om['page_sha256']
        for relative in nm['rendered_pages']:
            assert (prior/relative).read_bytes()==(proof/relative).read_bytes()
            page_results.append({'edition':kind,'page':relative,'sha256':b.digest(proof/relative),'byte_identical_to_r5':True})
        zp=pdf.with_suffix('.zip')
        with ZipFile(zp) as archive:
            members=archive.namelist()
            expected_set={markdown.name,pdf.name,pdf.with_suffix('.html').name}|{f'_assets/{name}.{ext}' for name in names for ext in ('svg','png')}
            assert len(members)==len(set(members)) and set(members)==expected_set
            assert len(members)=={'paragraaf':19,'opgaven':11,'antwoorden':9}[kind]
            assert archive.testzip() is None
            member_results=[]
            for name in members:
                data=archive.read(name)
                assert data==(FOLDER/name).read_bytes()
                historical=old(LESSON,(b.LESSON_REL/name).as_posix())
                changed=data!=historical
                assert changed==(name.endswith(('.md','.html')) or name in {f'_assets/{n}.svg' for n in t.TITLES})
                member_results.append({'name':name,'sha256':sha(data),'r5_sha256':sha(historical),'changed':changed})
            zip_results.append({'edition':kind,'members':member_results,'member_count':len(members),'sha256':b.digest(zp),'all_members_equal_current_files':True})
    for name,source in b.asset_sources().items():
        svg=FOLDER/'_assets'/(name+'.svg')
        historical=old(LESSON,svg.relative_to(LESSON).as_posix()).decode('utf-8')
        wanted=historical.replace(name+': TK en TO',t.TITLES[name]) if name in t.TITLES else historical
        assert source==svg.read_text(encoding='utf-8')==wanted,(name,'drawing changed')
        title=ET.fromstring(source).find('{http://www.w3.org/2000/svg}title').text
        titles.append({'asset':name,'title':title,'changed':name in t.TITLES})
        with tempfile.TemporaryDirectory(prefix='book2-212-alt-png-') as scratch:
            fresh=Path(scratch)/'fresh.png'
            subprocess.run([sys.executable,'-m','cairosvg',str(svg),'-o',str(fresh),'-s','2'],check=True)
            png=svg.with_suffix('.png')
            assert png.read_bytes()==fresh.read_bytes()==old(LESSON,png.relative_to(LESSON).as_posix())
            with Image.open(png) as a,Image.open(fresh) as c:
                assert a.size==c.size
                assert all(lo==hi==0 for lo,hi in ImageChops.difference(a.convert('RGBA'),c.convert('RGBA')).getextrema())
            pixels.append({'asset':name,'sha256':b.digest(png),'byte_equal':True,'max_pixel_channel_delta':0})
    assert len(page_results)==27 and len(pixels)==11 and len(dom_delta)==12
    save('mechanical-r6',{'status':'PASS','visual_acceptance':'NOT_SUPPLIED','protected_and_changed_inventory':inventory,'exact_changed_baseline_files':sorted(allowed),'all_actual_alts':metadata,'actual_normalized_dom_delta':dom_delta,'all_svg_titles':titles,'native_svg_png_parity':pixels,'all27pages':page_results,'all3pdfs_byte_identical_to_r5':True,'all_caption_words_punctuation_preserved':True,'zip_parity':zip_results,'independent_review_and_QC':'PENDING'})

def print_rebuild():
    from print_pipeline import build_document
    records=[]
    for kind in ('paragraaf','opgaven','antwoorden'):
        md=FOLDER/(b.STEM+' – '+kind+'.md')
        paths=[md.with_suffix(ext) for ext in ('.md','.html','.pdf','.zip')]
        previous={str(p):b.digest(p) for p in paths}
        record=build_document(md)
        record['zip']=b.zip_document(record)
        assert {str(p):b.digest(p) for p in paths}==previous
        records.append(record)
    save('print-rebuild-r6',{'result':'PASS','all3md_html_pdf_zip_byte_identical':True,'records':records,'visual_acceptance':'NOT_SUPPLIED'})

def grayscale():
    results=[]
    for kind,page in (('paragraaf',5),('opgaven',7),('antwoorden',5)):
        pdf=FOLDER/(b.STEM+' – '+kind+'.pdf')
        prefix=OUT/(PREFIX+f'grayscale-{kind}-p{page:03d}-r6')
        if list(OUT.glob(prefix.name+'*.png')):
            raise ValueError('Grayscale collision')
        subprocess.run(['pdftoppm','-f',str(page),'-l',str(page),'-gray','-png','-r','150',str(pdf),str(prefix)],check=True,capture_output=True)
        pngs=list(OUT.glob(prefix.name+'*.png'))
        assert len(pngs)==1
        results.append({'edition':kind,'page':page,'source_pdf_sha256':b.digest(pdf),'path':str(pngs[0]),'sha256':b.digest(pngs[0])})
    save('grayscale-r6',{'captures':results,'inspection':'PENDING'})

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode',choices=('baseline','verify','print_rebuild','grayscale'))
    globals()[parser.parse_args().mode]()
