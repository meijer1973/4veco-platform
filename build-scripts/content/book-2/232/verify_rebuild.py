"""HOW TO ADAPT: §232 namespace reservation, byte/ZIP/pixel custody and grayscale.
No inspection/acceptance is supplied by these mechanical commands.
"""
from pathlib import Path,PurePosixPath
import argparse
import hashlib
import json
import re
import sys
from zipfile import ZipFile
from PIL import Image
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import b2_232 as b

def load(path):return json.loads(Path(path).read_text(encoding='utf-8'))
def save(path,obj):
    with Path(path).open('x',encoding='utf-8',newline='\n') as f:json.dump(obj,f,ensure_ascii=False,indent=2);f.write('\n')
def rgb(path):
    with Image.open(path) as im:return {'size':list(im.size),'rgb_sha256':b.sha(im.convert('RGB').tobytes()),'raw_sha256':b.sha(Path(path).read_bytes())}

def archives(folder):
    result=[]
    for kind,count in zip(b.KINDS,[25,13,13]):
        source=folder/f'{b.STEM} – {kind}.md';stems=set(re.findall(r'_assets/([^\s/)]+)\.svg',source.read_text(encoding='utf-8')))
        expected={source.with_suffix(ext).name for ext in ['.md','.html','.pdf']}|{'_assets/'+stem+ext for stem in stems for ext in ['.svg','.png']}
        with ZipFile(source.with_suffix('.zip')) as z:
            names=z.namelist()
            if len(names)!=count or len(set(names))!=count or set(names)!=expected or names!=sorted(names):raise ValueError('Exact ZIP membership/order '+kind)
            if z.testzip() is not None:raise ValueError('ZIP CRC')
            members=[]
            for info in z.infolist():
                p=PurePosixPath(info.filename)
                if p.is_absolute() or '..' in p.parts or '\\' in info.filename or ':' in info.filename or info.is_dir():raise ValueError('Unsafe ZIP member')
                if info.date_time!=(1980,1,1,0,0,0):raise ValueError('Nonfixed ZIP time')
                raw=z.read(info)
                if raw!=(folder/info.filename).read_bytes():raise ValueError('Stale ZIP member')
                members.append({'name':info.filename,'sha256':b.sha(raw),'crc32':f'{info.CRC:08x}'})
            result.append({'kind':kind,'count':count,'members':members})
    return result

def validate_manifest(manifest):
    folder=Path(manifest['paragraph_folder'])
    if folder.resolve()!=(b.ROOT.parent/'4veco-lessen'/b.LESSON_REL).resolve():raise ValueError('Actual paired folder required')
    if manifest['packet']!=b.snapshot(folder) or len(manifest['packet'])!=41:raise ValueError('41 native byte freshness')
    b.gate.verify_current(b.ROOT.parent/'4veco-lessen');source=b.gate.verify_source(manifest['source_commit'])
    if source!=manifest['source_files']:raise ValueError('Whole source binding')
    if manifest['plan_sha256']!=b.PLAN_HASH or manifest['target_record_sha256']!=b.TARGET_HASH:raise ValueError('Plan/target binding')
    pages={};proofs={}
    for kind,record in zip(b.KINDS,manifest['documents']):
        for field,h in [('source_md','source_sha256'),('source_html','html_sha256'),('source_pdf','pdf_sha256')]:
            if b.sha(Path(record[field]).read_bytes())!=record[h]:raise ValueError('Stale document '+field)
        directory=Path(record['proof_directory']);m=load(directory/'manifest.json')
        if (m['inspection_status'],m['pages_inspected'],m['visible_student_defects'],m['inspected_at_normal_reading_scale'])!=('PENDING',[],None,False):raise ValueError('Mutated generation verdict')
        current={p.name:rgb(p) for p in sorted((directory/'pages').glob('page-*.png'))}
        if {n:r['raw_sha256'] for n,r in current.items()}!=m['page_sha256']:raise ValueError('Incomplete/changed raw page proof')
        pages[kind]=current;proofs[str(directory/'manifest.json')]=b.sha((directory/'manifest.json').read_bytes())
    return {'folder':str(folder),'packet':manifest['packet'],'archives':archives(folder),'pages':pages,'pending_proofs':proofs}

def parity(paths):
    all_records=[validate_manifest(load(p)) for p in paths];first=all_records[0]
    for other in all_records[1:]:
        if first['packet']!=other['packet'] or first['pages']!=other['pages'] or first['archives']!=other['archives']:raise ValueError('Native/raw/RGB/member parity failure')
    return {'status':'PASS','manifests':[{'path':str(p),'sha256':b.sha(Path(p).read_bytes())} for p in paths],
            'native_files':41,'all_raw_and_decoded_pages':sum(len(x) for x in first['pages'].values()),'routes':len(paths),'first_pending_proofs':first['pending_proofs'],'archives':first['archives'],'pages':first['pages']}

def reserve(source_commit):
    b.gate.verify_current(b.ROOT.parent/'4veco-lessen');b.gate.verify_source(source_commit)
    scan=b.gate.global_scan();revision='r'+str(scan['maximum']+1)
    destination=b.ROOT/'reports/sprints'/(b.gate.PREFIX+'reservation-'+revision+'.json')
    save(destination,{'actor':'paragraph_231_specialist_qc','status':'RESERVED_UNUSED','revision':revision,'source_commit':source_commit,'maximum_recorded_revision':scan['maximum'],'global_scan':scan})
    print(json.dumps({'reservation':str(destination),'revision':revision,'maximum':scan['maximum'],'registered_worktrees':len(scan['registered_worktrees'])}));return destination

def grayscale(manifest_path,directory):
    manifest=load(manifest_path);checked=validate_manifest(manifest)
    if directory.exists():raise ValueError('Fresh supplemental grayscale only')
    expected=b.ROOT/'reports/sprints'
    if expected.resolve() not in directory.resolve().parents or not directory.name.startswith(b.gate.PREFIX):raise ValueError('Owned supported supplemental path required')
    directory.mkdir();result=[]
    for kind,record in zip(b.KINDS,manifest['documents']):
        dest=directory/kind;dest.mkdir()
        command=b.gate.command(['pdftoppm','-gray','-png','-r','150',record['source_pdf'],dest/'page'])
        files=sorted(dest.glob('page-*.png'),key=lambda p:int(p.stem.split('-')[-1]))
        if len(files)!=len(checked['pages'][kind]):raise ValueError('Grayscale count')
        for i,p in enumerate(files,1):
            normalized=dest/f'page-{i:03d}.png'
            if p!=normalized:p.rename(normalized)
            result.append({'kind':kind,'page':i,'path':str(normalized),**rgb(normalized)})
    dest=directory/'figures';dest.mkdir()
    for stem in b.ASSETS:
        source=Path(manifest['paragraph_folder'])/'_assets'/(stem+'.png');output=dest/(stem+'.png')
        with Image.open(source) as im:im.convert('L').save(output)
        result.append({'kind':'native-figure','stem':stem,'path':str(output),**rgb(output)})
    return {'manifest':str(manifest_path),'sha256':b.sha(Path(manifest_path).read_bytes()),'items':result,'personal_inspection':'NOT_PERFORMED_BY_SCRIPT'}

if __name__=='__main__':
    p=argparse.ArgumentParser();sub=p.add_subparsers(dest='mode',required=True)
    s=sub.add_parser('reserve');s.add_argument('--source-commit',required=True)
    s=sub.add_parser('parity');s.add_argument('--output',type=Path,required=True);s.add_argument('manifests',type=Path,nargs='+')
    s=sub.add_parser('grayscale');s.add_argument('manifest',type=Path);s.add_argument('directory',type=Path);s.add_argument('--output',type=Path,required=True)
    a=p.parse_args()
    if a.mode=='reserve':reserve(a.source_commit)
    elif a.mode=='parity':save(a.output,parity(a.manifests));print('Native, safe CRC ZIP, raw and RGB page parity PASS')
    else:save(a.output,grayscale(a.manifest,a.directory));print('Fresh grayscale generated; no personal inspection asserted')
