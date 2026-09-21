"""Assemble the bounded native revision; keep all historical receipts intact."""
from io import BytesIO
import json
from pathlib import Path
import shutil

import fitz
from pypdf import PdfReader,PdfWriter
from weasyprint import HTML
from build_book2_chat import cover_pdf,contents_pdf,append_chapters,file_record

REVISION='book2-theory-signed-20260921'

def write_json(file,value):
    file.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf8',newline='\n')

def source_paths(root):
    sources={root/name for name in ('assembly.json','signed-cover-panel.html','signed-cover-source.json','_assets/signed-cover-background.png','signed-navigation.json')}
    for folder in (root/'bronnen').glob('H*'):
        sources.update((folder/'manuscript').glob('*.md'))
        sources.update(folder.glob('*.py'))
        sources.update(folder.glob('*antwoorden.md'))
        sources.update(folder.glob('*Docenten*.md'))
        sources.add(folder/'chapter-order.json')
        sources.update(p for p in (folder/'_assets').rglob('*') if p.is_file())
    return sorted(sources)

def record_chapters(root):
    config=json.loads((root/'assembly.json').read_text(encoding='utf8'))
    for bundle in config['bundles']:
        for number,name in enumerate(bundle['chapters'],1):
            source=root/f'bronnen/H{number}/output'/Path(name).name
            if len(PdfReader(source).pages)!=bundle['page_counts'][number-1]:raise ValueError('Chapter pagination changed')
            shutil.copyfile(source,root/name)
    record={'revision':REVISION,'sources':[file_record(root,p)for p in source_paths(root)],
        'chapters':{name:file_record(root,root/name)for b in config['bundles']for name in b['chapters']}}
    write_json(root/'signed-chapter-inputs.json',record)

def validate_inputs(root):
    config=json.loads((root/'assembly.json').read_text(encoding='utf8'))
    inputs=json.loads((root/'signed-chapter-inputs.json').read_text(encoding='utf8'))
    expected={p for b in config['bundles']for p in b['chapters']}
    if inputs.get('revision')!=REVISION or set(inputs['chapters'])!=expected:raise ValueError('Unknown/incomplete chapter revision')
    if [r['path']for r in inputs['sources']]!=[p.relative_to(root).as_posix()for p in source_paths(root)]:raise ValueError('Source inventory changed')
    for r in [*inputs['sources'],*inputs['chapters'].values()]:
        p=root/r['path']
        if not p.resolve().is_relative_to(root.resolve()) or file_record(root,p)!=r:raise ValueError('Stale/unsafe native input: '+r['path'])
    return config

def build(root):
    config=validate_inputs(root)
    # Both PDFs are rendered here from owned editable sources. No supplied or
    # previous complete PDF participates in generating the current cover.
    cover_source=json.loads((root/'signed-cover-source.json').read_text(encoding='utf8'))
    if file_record(root,root/cover_source['background'])['sha256']!=cover_source['sha256']:raise ValueError('Accepted clean cover source changed')
    cover=PdfReader(BytesIO(cover_pdf(root,{**config['cover'],'background':cover_source['background']})))
    overlay=PdfReader(BytesIO(HTML(filename=str(root/'signed-cover-panel.html')).write_pdf()))
    cover.pages[0].merge_page(overlay.pages[0])
    cover_writer=PdfWriter();cover_writer.add_page(cover.pages[0]);buffer=BytesIO();cover_writer.write(buffer)
    cover_bytes=buffer.getvalue()
    navigation=json.loads((root/'signed-navigation.json').read_text(encoding='utf8'))
    outputs=[];pending={}
    for bundle in config['bundles']:
        writer=PdfWriter();writer.append(PdfReader(BytesIO(cover_bytes)))
        writer.append(PdfReader(BytesIO(contents_pdf(config,bundle,bundle['page_counts']))))
        append_chapters(writer,[(f'h{i+1}',PdfReader(root/p))for i,p in enumerate(bundle['chapters'])])
        if bundle['kind']=='student':
            writer.root_object.pop('/Outlines',None)
            parents={}
            for level,title,page in navigation['student_bookmarks']:
                parents[level]=writer.add_outline_item(title,page-1,parent=parents.get(level-1))
        writer.add_metadata({'/Title':bundle['title'],'/Author':'4veco','/Subject':'Boek 2 · native theorie en getekende prijselasticiteit · 2026-09-21'})
        output=root/bundle['output'];buffer=BytesIO();writer.write(buffer);pending[output]=buffer.getvalue();outputs.append(output)
    preview=root/config['cover']['preview']
    with fitz.open(stream=cover_bytes,filetype='pdf') as pdf:pending[preview]=pdf[0].get_pixmap(matrix=fitz.Matrix(2,2)).tobytes('png')
    outputs.append(preview)
    for file,content in pending.items():
        temp=file.with_suffix(file.suffix+'.tmp');temp.write_bytes(content);temp.replace(file)
    write_json(root/'signed-assembly-manifest.json',{'revision':REVISION,
        'chapter_inputs_sha256':file_record(root,root/'signed-chapter-inputs.json')['sha256'],
        'files':[file_record(root,p)for p in outputs]})
    for p in outputs:print(p)
    return outputs
