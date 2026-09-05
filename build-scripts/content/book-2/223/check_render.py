"""Check the current §223 PDF payload mechanically; never issue visual acceptance."""
import argparse
import json
import math
import re
import sys
import unittest
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

from bs4 import BeautifulSoup
from pypdf import PdfReader

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import b2_223 as builder
from print_pipeline import verify_record_freshness
from test_source import check_answer_d, compact


def normalize(value):
    return re.sub(r'\s+',' ',value).strip()


def inspect(lesson_root: Path, manifest_path: Path, rebuild=False):
    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    assert manifest['inspection_status']=='PENDING'
    assert manifest['target_record_sha256']==builder.TARGET_HASH
    assert manifest['plan_sha256']==builder.PLAN_HASH
    for source in manifest['input_sources']:
        assert builder.digest(Path(source['path']))==source['sha256'], source['path']
    target = builder.target_record()
    results = {'paragraph':'2.2.3','automated_status':'PASS','visual_acceptance':'NOT_SUPPLIED_BY_THIS_SCRIPT','documents':[]}
    exercise_blocks = []
    for record in manifest['documents']:
        verify_record_freshness(record)
        pdf_path = Path(record['source_pdf'])
        kind = pdf_path.stem.rsplit(' – ',1)[1]
        soup = BeautifulSoup(Path(record['source_html']).read_text(encoding='utf-8'),'html.parser')
        assert not soup.find(['script','iframe','object','link'])
        assert not any(t in soup.get_text() for t in (':::','{{','Rubric','Y-only','3921 punt','3901 punt'))
        assert all(i['src'].startswith('data:image/png;base64,') and i.get('alt') for i in soup.find_all('img'))
        pdf = PdfReader(pdf_path)
        text_sizes, image_geometry, texts, page_map = [],[],[],[]
        for number,page in enumerate(pdf.pages,1):
            def visit_text(value,cm,tm,font,size):
                if value.strip():
                    text_sizes.append(size*math.sqrt(abs(cm[0]*cm[3]-cm[1]*cm[2])))
            def visit_op(op,args,cm,tm):
                if op==b'Do':
                    image_geometry.append((math.hypot(cm[0],cm[1]),math.hypot(cm[2],cm[3])))
            value = page.extract_text(visitor_text=visit_text,visitor_operand_before=visit_op) or ''
            assert len(normalize(value))>80,(kind,'near-empty page',number)
            assert '\ufffd' not in value
            texts.append(value)
            page_map.append({'page':number,'words':len(value.split()),'exercises':re.findall(r'Opgave (\d+)',value),
                             'opening':normalize(value)[:90]})
        text = normalize(' '.join(texts))
        assert min(text_sizes)>=11.99,(kind,min(text_sizes))
        for n in range(1,13):
            assert f'Opgave {n}' in text,(kind,n)
        svg_paths = [Path(a['path']) for a in record['assets'] if a['path'].endswith('.svg')]
        assert len(svg_paths)==len(image_geometry),(kind,len(svg_paths),len(image_geometry))
        placed_sizes = []
        for path,(width,height) in zip(svg_paths,image_geometry):
            root = ET.fromstring(path.read_text(encoding='utf-8'))
            sx,sy = width/float(root.attrib['width']),height/float(root.attrib['height'])
            assert abs(sx-sy)<.00001,'Distorted aspect ratio'
            placed_sizes += [float(e.attrib['font-size'])*min(sx,sy) for e in root.iter() if e.tag.endswith('text')]
        assert min(placed_sizes,default=12)>=12,(kind,min(placed_sizes))
        assert [normalize(h.get_text()) for h in soup.find_all('h2')]==(builder.HEADINGS if kind!='antwoorden' else builder.HEADINGS[1:])
        if kind in ('paragraaf','opgaven'):
            first=soup.find('h2',id='uitgewerkt-voorbeeld')
            exercise_blocks.append(''.join(str(n) for n in [first,*first.next_siblings]))
            section=soup.find('section',id='doeloefening')
            assert section is not None
            local=normalize(section.get_text(' ',strip=True))
            assert not section.find(['img','table','ol'])
            for literal in [target['target_exercise']['context'],*[s['content'] for s in target['target_exercise']['sources']],*[q['prompt'] for q in target['target_exercise']['subquestions']]]:
                assert normalize(literal) in local,literal
                assert compact(literal) in compact(text),literal
            for q in target['target_exercise']['subquestions']:
                assert f"{q['label']}) ({q['points']} punten)" in local
        if kind=='paragraaf':
            for goal in target['lesson_goals']:
                assert normalize(goal) in text
        if kind=='antwoorden':
            for label,answer in target['short_answer_model'].items():
                if label!='d':
                    assert compact(answer) in compact(text),label
            check_answer_d(unittest.TestCase(),text,target['short_answer_model']['d'])
        archive=Path(record['zip'])
        assert builder.digest(archive)==record['zip_sha256']
        expected={pdf_path.name,pdf_path.with_suffix('.md').name,pdf_path.with_suffix('.html').name}
        expected.update(Path(a['path']).relative_to(pdf_path.parent).as_posix() for a in record['assets'])
        with zipfile.ZipFile(archive) as package:
            assert set(package.namelist())==expected
            assert len(package.namelist())==len(expected)
            for member in package.infolist():
                assert member.date_time==(1980,1,1,0,0,0)
                assert package.read(member.filename)==(pdf_path.parent/member.filename).read_bytes()
        proof_dir=Path(record['proof_directory'])
        proof=json.loads((proof_dir/'manifest.json').read_text(encoding='utf-8'))
        assert proof['inspection_status']=='PENDING' and proof['pages_inspected']==[]
        assert proof['pdf_sha256']==record['pdf_sha256']
        assert len(proof['rendered_pages'])==len(pdf.pages)
        for relative in proof['rendered_pages']:
            path=proof_dir/relative
            assert builder.digest(path)==proof['page_sha256'][path.name]
        results['documents'].append({'kind':kind,'pdf_sha256':record['pdf_sha256'],'pages':len(pdf.pages),
            'minimum_printed_text_pt_including_footer':round(min(text_sizes),3),
            'minimum_placed_figure_label_pt':round(min(placed_sizes),3) if placed_sizes else None,
            'proof_directory':str(proof_dir),'all_page_hashes_match':True,'zip_members':sorted(expected),'page_map':page_map})
    assert exercise_blocks[0]==exercise_blocks[1],'Exercise HTML editions differ'
    if rebuild:
        second=builder.build(lesson_root)
        assert manifest['input_sources']==second['input_sources']
        for before,after in zip(manifest['documents'],second['documents']):
            for field in ('source_sha256','html_sha256','pdf_sha256','assets','zip_sha256'):
                assert before[field]==after[field],('non-identical rebuild',field)
        results['byte_identical_rebuild']=True
    results['checks']=['exact frozen goals/context/three sources/a–e/3+2+4+4+3 points',
        'every short-answer entry, including exact-rational expanded d and rounded-model equivalence',
        'identical exercise HTML editions; isolated deterministic ZIPs',
        'every PDF text/placed figure label meets 12-point floor; no aspect distortion',
        'all source/asset/page hashes current; generation manifests still honestly PENDING']
    return results


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--lesson-root',type=Path,default=builder.ROOT.parent/'4veco-lessen')
    parser.add_argument('--manifest',type=Path,required=True)
    parser.add_argument('--rebuild',action='store_true')
    parser.add_argument('--output',type=Path)
    args=parser.parse_args()
    result=inspect(args.lesson_root,args.manifest,args.rebuild)
    serialized=json.dumps(result,ensure_ascii=False,indent=2)+'\n'
    if args.output:
        args.output.write_text(serialized,encoding='utf-8',newline='\n')
    print(json.dumps(result,ensure_ascii=True,indent=2))
