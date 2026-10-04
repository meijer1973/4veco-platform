"""Rebuild the finite saved-presentation delta from the accepted PPTX packages.

The owning author modules carry the same corrected notes. This derivative path
keeps all slide layouts, native charts, tables and embedded workbooks byte-exact;
only named notes, current source references and two source-figure rasters change.
Export the resulting PPTX with render-powerpoint.ps1 and review the saved PDF.
"""
from pathlib import Path
import argparse, hashlib, html, io, json, posixpath, re, subprocess, zipfile
from xml.etree import ElementTree as ET

HERE=Path(__file__).resolve().parent
NS={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}

def media_name(parts,slide):
    tree=ET.fromstring(parts[f'ppt/slides/slide{slide}.xml'])
    images=tree.findall('.//a:blip',NS);assert len(images)==1,'Expected a single source figure'
    rid=images[0].get('{'+NS['r']+'}embed')
    rels=ET.fromstring(parts[f'ppt/slides/_rels/slide{slide}.xml.rels'])
    target=next(el.get('Target') for el in rels if el.get('Id')==rid)
    # Accepted artifact-tool packages may store a package-root target without
    # its leading slash; also support standard slide-relative relationships.
    name=target.lstrip('/') if target.lstrip('/') in parts else posixpath.normpath('ppt/slides/'+target)
    assert name in parts and name.startswith('ppt/media/'),'Unknown source image relationship'
    return name

def make_parts(original,row,contract,image=None):
    with zipfile.ZipFile(io.BytesIO(original)) as z:parts={name:z.read(name) for name in z.namelist()}
    counts=[0]*len(row['notes'])
    for name,data in list(parts.items()):
        if not re.fullmatch(r'ppt/notesSlides/notesSlide\d+.xml',name):continue
        text=data.decode('utf8')
        for i,change in enumerate(row['notes']):
            old=html.escape(change['old'],quote=False);new=html.escape(change['new'],quote=False)
            counts[i]+=text.count(old);text=text.replace(old,new)
        text=text.replace(contract['prior_source_commit'],contract['source_commit'])
        parts[name]=text.encode('utf8')
    assert all(n==1 for n in counts),('Expected one old note fragment per correction',counts)
    if 'image' in row:
        assert image is not None
        parts[media_name(parts,row['image']['slide'])]=image
    return parts

def verify_parts(original,candidate,row,contract,expected_image_sha256=None):
    with zipfile.ZipFile(io.BytesIO(original)) as z:before={n:z.read(n) for n in z.namelist()}
    with zipfile.ZipFile(io.BytesIO(candidate)) as z:after={n:z.read(n) for n in z.namelist()}
    assert before.keys()==after.keys(),'Package membership changed'
    image=after[media_name(after,row['image']['slide'])] if 'image' in row else None
    if image is not None:
        assert expected_image_sha256 and hashlib.sha256(image).hexdigest()==expected_image_sha256,'Stale or unbound source image'
    expected=make_parts(original,row,contract,image)
    assert after==expected,'Unreviewed presentation body, chart, table, workbook or note mutation'
    for change in row['notes']:
        text=' '.join(' '.join(ET.fromstring(data).itertext()) for name,data in after.items() if re.fullmatch(r'ppt/notesSlides/notesSlide\d+.xml',name))
        assert change['new'] in text and change['old'] not in text
    changed=[name for name in after if after[name]!=before[name]]
    return {'changed_parts':changed,'native_charts_preserved':sum(bool(re.fullmatch(r'ppt/(?:slides/)?charts/chart\d+.xml',n)) for n in before),
            'native_tables_preserved':sum(len(ET.fromstring(data).findall('.//a:tbl',NS)) for name,data in before.items() if re.fullmatch(r'ppt/slides/slide\d+.xml',name)),
            'embedded_workbooks_preserved':sum(n.startswith('ppt/embeddings/') for n in before)}

def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--lessons',type=Path,required=True)
    ap.add_argument('--node-modules',type=Path,required=True);ap.add_argument('--output',type=Path,required=True);args=ap.parse_args()
    contract=json.loads((HERE/'textbook-maintenance-presentations.json').read_text(encoding='utf8'))
    args.output.mkdir(parents=True,exist_ok=True);rows=[]
    for row in contract['presentations']:
        original=subprocess.check_output(['git','show',contract['lesson_base']+':'+row['path']],cwd=args.lessons)
        image=None
        if 'image' in row:
            spec=row['image'];svg=args.lessons/spec['source']
            assert svg.read_bytes()==subprocess.check_output(['git','show',contract['source_commit']+':'+spec['source']],cwd=args.lessons),'Figure/source commit mismatch'
            code="const path=require('path');const sharp=require(require.resolve('sharp',{paths:[process.argv[1]]}));sharp(process.argv[2]).resize(JSON.parse(process.argv[3])).png().toBuffer().then(b=>process.stdout.write(b));"
            resize={k:spec[k] for k in ['width','height'] if k in spec}
            image=subprocess.check_output(['node','-e',code,str(args.node_modules.resolve()),str(svg.resolve()),json.dumps(resize)])
        parts=make_parts(original,row,contract,image);destination=args.output/Path(row['path']).name
        with zipfile.ZipFile(io.BytesIO(original)) as z,zipfile.ZipFile(destination,'w') as out:
            for info in z.infolist():out.writestr(info,parts[info.filename])
        evidence=verify_parts(original,destination.read_bytes(),row,contract,hashlib.sha256(image).hexdigest() if image else None)
        rows.append({'id':row['id'],'path':row['path'],'source_commit':contract['source_commit'],
                     'pptx_sha256':hashlib.sha256(destination.read_bytes()).hexdigest(),
                     'image_sha256':hashlib.sha256(image).hexdigest() if image else None,**evidence})
    (args.output/'repair-evidence.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf8',newline='\n')
    print(json.dumps(rows,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
