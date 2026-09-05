"""Measure full and print-only reproducibility; never assert visual approval."""
from pathlib import Path
import argparse
import json
import subprocess
import sys
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import b2_213 as b
from print_pipeline import build_document, digest

def snapshot(folder):
    paths=[folder/f'{b.STEM} – {kind}{ext}' for kind in ('paragraaf','opgaven','antwoorden') for ext in ('.md','.html','.pdf','.zip')]
    paths += [folder/'_assets'/f'{name}{ext}' for name in b.ASSETS for ext in ('.svg','.png')]
    return {p.relative_to(folder).as_posix():digest(p) for p in paths}

def verify(manifest_path,output,grayscale):
    if output.exists() or grayscale.exists():
        raise ValueError('Use fresh evidence paths')
    manifest=json.loads(manifest_path.read_text(encoding='utf-8')); folder=b.ROOT.parent/'4veco-lessen'/b.LESSON_REL
    original=snapshot(folder)
    for document in manifest['documents']:
        for key,pin in [('source_md','source_sha256'),('source_html','html_sha256'),('source_pdf','pdf_sha256')]:
            assert digest(Path(document[key]))==document[pin]
        assert digest(Path(document['zip']['path']))==document['zip']['sha256']
        for asset in document['assets']: assert digest(Path(asset['path']))==asset['sha256']
    b.build(b.ROOT.parent/'4veco-lessen')
    full=snapshot(folder); assert full==original,'Full generator rerun is not byte identical'
    for kind in ('paragraaf','opgaven','antwoorden'):
        b.zip_document(build_document(folder/f'{b.STEM} – {kind}.md'))
    printed=snapshot(folder); assert printed==original,'Print-only rerun is not byte identical'
    gray=[]; grayscale.mkdir(parents=True)
    paragraph=Path(manifest['documents'][0]['source_pdf'])
    for page in [2,3,5,7,10]:
        prefix=grayscale/f'page-{page:03}'
        subprocess.run(['pdftoppm','-f',str(page),'-l',str(page),'-singlefile','-r','150','-gray','-png',str(paragraph),str(prefix)],check=True)
        path=prefix.with_suffix('.png'); gray.append({'page':page,'path':str(path.resolve()),'sha256':digest(path)})
    result={'paragraph':'2.1.3','source_manifest':str(manifest_path.resolve()),'source_manifest_sha256':digest(manifest_path),
            'full_generator_rebuild':'PASS: all 24 artifact files byte identical',
            'print_only_rebuild':'PASS: all 24 artifact files byte identical',
            'artifacts':original,'grayscale_pdf_sha256':digest(paragraph),'grayscale_pages':gray,
            'visual_inspection':'NOT_SUPPLIED_BY_THIS_SCRIPT'}
    output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    print(json.dumps({k:v for k,v in result.items() if k not in ('artifacts','grayscale_pages')},ensure_ascii=True,indent=2))

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('manifest',type=Path); parser.add_argument('output',type=Path); parser.add_argument('grayscale',type=Path)
    args=parser.parse_args(); verify(args.manifest,args.output,args.grayscale)
