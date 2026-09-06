"""Read-only source/authority/native custody; own fresh JSON/gzip evidence only.

HOW TO ADAPT: fixed original commit/path bindings and explicitly attributed
personal views. Never run an author writer or regenerate a reviewed PDF.
"""
import argparse
import base64
import gzip
import hashlib
import io
import json
from pathlib import Path
import re
import subprocess
import sys
sys.dont_write_bytecode=True
P=Path(__file__).resolve().parents[2]
L=P.parent/'4veco-lessen'
OWN='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-ROOT-ADOPTION-'
AUTHOR='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-BUILD-CURRENT-'
OLD_P=Path('C:/wt/book2-214-build-current-20260906/4veco-platform')
OLD_L=OLD_P.parent/'4veco-lessen'
sys.path.insert(0,str(P/'build-scripts/content/book-2'))
import b2_214 as b
from PIL import Image
import fitz
sha=lambda value:hashlib.sha256(value).hexdigest()
raw=lambda filename:b.raw(Path(filename))
read=lambda filename:json.loads(raw(filename))
git=lambda root,*args:subprocess.check_output(['git',*args],cwd=root)

def rebase(filename):
    original=Path(filename)
    for old,current in [(OLD_P,P),(OLD_L,L)]:
        if original.is_relative_to(old):
            return current/original.relative_to(old)
    raise AssertionError('Foreign recorded artifact path: '+str(original))

def pixels(filename):
    with Image.open(io.BytesIO(raw(filename))) as image:
        rgb=image.convert('RGB')
        return list(rgb.size),sha(rgb.tobytes()),sha(rgb.convert('L').convert('RGB').tobytes())

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--attempt',required=True)
args=parser.parse_args()
assert re.fullmatch('[a-z0-9-]+',args.attempt)
dest=P/(OWN+'native-custody-'+args.attempt+'.json')
events=P/(OWN+'authority-'+args.attempt+'.json.gz')
assert not dest.exists() and not events.exists()
assert b.ROOT==P and b.SOURCE_COMMIT=='09e99f770b057d239e8d3d7c7e3185e830615cf7'
assert sha(raw(P/(AUTHOR+'native-parity.json')))=='b9beb3e07f87065aba87dd643fee1619c6c82e15d077168b64e14a980f15dd41'
assert sha(raw(P/(AUTHOR+'report.md')))=='46417eb156fb8d56742cc6cad73f17affd6225900af1ad59b5f3377b5d4bcf4b'
grant,manifest,env=b.authorize(L)
assert len(manifest['inputs'])==48
# Complete actual authority process history, losslessly retained once.
event_bytes=json.dumps(b.EVENTS,ensure_ascii=False,indent=2).encode()+b'\n'
with events.open('xb') as stream:
    with gzip.GzipFile(filename='',mode='wb',fileobj=stream,mtime=0) as packed:
        packed.write(event_bytes)
assert gzip.decompress(raw(events))==event_bytes
parity=read(P/(AUTHOR+'native-parity.json'))
assert parity['status']=='PASS' and parity['native_files']==15
source=[]
for row in parity['source']:
    data=raw(P/row['path'])
    assert sha(data)==row['sha256'] and len(data)==row['bytes']
    assert data==git(P,'show','a62bc517c5c13b4f93bf836ad5bd37b9843e7c55:'+row['path'])
    source.append(row)
assert len(source)==10
native={row['path']:row['sha256'] for row in parity['current_native']}
assert len(native)==15
for row in parity['current_native']:
    data=raw(L/row['path'])
    assert sha(data)==row['sha256'] and len(data)==row['bytes']
    assert data==git(L,'show','84f821a3cde2e525c54593d7f36ea86b2c53dff9:'+row['path'])
    assert data==git(L,'show','HEAD:'+row['path'])
checker=b.load_owned('check_render').check(L)
assert checker['status']=='PASS' and checker['errors']==[]
assert [len(row['pages']) for row in checker['pdfs']]==[9,11]
reference=None
runs=[]
for expected in parity['runs']:
    revision,route=expected['revision'],expected['route']
    assert (revision,route) in [('r42','full'),('r43','full'),('r44','thin'),('r45','direct'),('r46','checker')]
    runroot=P/(AUTHOR+revision+'-'+route)
    data=raw(runroot/'author-run.json')
    assert sha(data)==expected['author_run_sha256']
    record=json.loads(data)
    assert {r['path']:r['sha256'] for r in record['native']}==native
    assert record['namespace']['requested']>record['namespace']['highest']
    assert record['source_commit']==expected['source_commit']
    if revision!='r42':assert record['source_commit']==b.SOURCE_COMMIT
    node=[r for r in record['processes'] if Path(r['argv'][0]).stem=='node']
    assert len(node)==3 and all(r['exit_code']==0 for r in node)
    assert any('214-232-INPUT-ROOT-gate.cjs' in ' '.join(r['argv']) for r in node)
    assert any('paragraph_production' in r['argv'] for r in node)
    assert any('--durable' in r['argv'] for r in node)
    first_native=next((i for i,r in enumerate(record['processes']) if r['native_worker']),len(record['processes']))
    assert all(record['processes'].index(r)<first_native for r in node)
    if route=='direct':
        workers=[r for r in record['processes'] if r['native_worker']]
        assert len(workers)==1 and workers[0]['exit_code']==0
        assert workers[0]==expected['exact_unchanged_shared_child']
        argv=workers[0]['argv']
        assert len(argv)==6 and Path(argv[1])==OLD_P/'build-scripts/content/book-2/print_pipeline.py'
        assert Path(argv[-1])==OLD_P/(AUTHOR+revision+'-'+route) and argv[-2]=='--proof-root'
        assert argv[2].endswith(' – opgaven.md') and argv[3].endswith(' – antwoorden.md')
    pages=[]
    for proof in record['proofs']:
        assert proof['inspection_status']=='PENDING' and proof['pages_inspected']==[]
        assert Path(proof['artifact_id']).name==proof['artifact_id']
        folder=runroot/proof['artifact_id']
        assert read(folder/'manifest.json')==proof
        bound=next(m for m in expected['manifests'] if Path(m['path'])==(folder/'manifest.json').relative_to(P))
        assert sha(raw(folder/'manifest.json'))==bound['sha256']
        edition='antwoorden' if 'antwoorden' in proof['artifact_id'] else 'opgaven'
        for number,relative in enumerate(proof['rendered_pages'],1):
            assert relative==f'pages/page-{number:03d}.png'
            file=folder/relative
            h=sha(raw(file));assert h==proof['page_sha256'][file.name]
            size,rgb,gray=pixels(file)
            pages.append({'edition':edition,'page':number,'size':size,'file_sha256':h,'RGB_sha256':rgb,'gray_RGB_sha256':gray})
    pages.sort(key=lambda r:(r['edition'],r['page']))
    assert pages==expected['pages'] and len(pages)==20
    if reference is None:reference=pages
    assert pages==reference
    runs.append({'revision':revision,'route':route,'author_run_sha256':sha(data),'pages':20,'native_files':15,'current_raw_decoded_exact':True,'PENDING_preserved':True,'original_current_gates_before_native':True})
assert len(runs)==5
for edition in checker['pdfs']:
    for page in edition['pages']:
        ref=next(r for r in reference if r['edition']==edition['edition'] and r['page']==page['page'])
        assert page['raw_RGB_sha256']==ref['RGB_sha256']
        assert [page['width'],page['height']]==ref['size']
views=read(P/(AUTHOR+'r42-views.json'))
assert sha(raw(P/(AUTHOR+'r42-views.json')))==parity['visual_evidence']['views_sha256']
assert sha(raw(P/(AUTHOR+'visual-r42.md')))==parity['visual_evidence']['observations_sha256']
assert len(views['pages'])==20 and len(views['figures'])==4
for row in [*views['pages'],*views['figures']]:
    for mode in ['color','gray']:
        file=rebase(row[mode]);assert sha(raw(file))==row[mode+'_file_sha256']
        size,rgb,gray=pixels(file);assert rgb==row[mode+'_RGB_sha256']
        if mode=='color':assert gray==row['gray_RGB_sha256']
    if 'edition' in row:
        ref=next(r for r in reference if r['edition']==row['edition'] and r['page']==row['page'])
        assert row['color_RGB_sha256']==ref['RGB_sha256'] and row['gray_RGB_sha256']==ref['gray_RGB_sha256']
log=P/(AUTHOR+'source-probes-r3-process.json.gz')
assert sha(raw(log))=='1f7d1c4808f530a0a265b08f935756c7fc9dd328b2bb6556aaf72fe1f0cb9296'
digest=hashlib.sha256();length=0
with gzip.open(b.data_path(log),'rb') as stream:
    while chunk:=stream.read(1024*1024):digest.update(chunk);length+=len(chunk)
assert length==302044775 and digest.hexdigest()=='062d65ff80c22026cd5d1eb26072523100bef75e86fe66de073f6212f3bc8576'
with gzip.open(b.data_path(log),'rt',encoding='utf-8') as stream:process=json.load(stream)
assert process['exit_code']==0 and re.search(r'Ran 13 tests in [0-9.]+s',process['stderr'])
assert process['stderr'].rstrip().endswith('OK')
for key in ['stdout','stderr']:
    assert base64.b64decode(process[key+'_base64']).decode('utf-8')==process[key]
ledgers=[json.loads(line) for line in process['stdout'].splitlines() if line.startswith('{')]
inputs=next(r for r in ledgers if 'actual_routes' in r)
controller=next(r for r in ledgers if 'whole_source_files' in r)
assert inputs['actual_routes']==3 and inputs['unique_committed_fixture_files']==75
assert inputs['missing_forged_cases']+inputs['synchronized_inputs']+inputs['partial_identity']==603
assert inputs['native_effects']==0 and inputs['restored_all_fixture_bytes']
assert len(controller['cases'])==78 and controller['no_native_effects'] and controller['restored_all']
assert all(r['native_effects']==0 for r in controller['cases'])
result={'status':'PASS','actor':'codex-root','role':'candidate_adoption_readonly_verification','source':source,'native':parity['current_native'],'actual_input_count':48,'authority_process_count':len(b.EVENTS),'authority_evidence':{'path':str(events.relative_to(P)),'gzip_sha256':sha(raw(events)),'raw_sha256':sha(event_bytes)},'author_runs':runs,'stored_page_comparisons':100,'current_PDF_decoded_pages':20,'native_checker':checker,'attributed_personal_views':48,'root_personal_views':0,'original_source_tests':{'tests':13,'raw_input_cases':603,'source_controller_cases':78,'log_gzip_sha256':sha(raw(log)),'decompressed_sha256':digest.hexdigest(),'decompressed_bytes':length,'lossless':True},'root_native_rebuilds':0,'independent_review':'PENDING','specialist_QC':'PENDING','root_acceptance':'PENDING'}
with dest.open('x',encoding='utf-8',newline='\n') as stream:json.dump(result,stream,ensure_ascii=False,indent=2);stream.write('\n')
print(json.dumps({'status':'PASS','source':10,'native':15,'stored_pages':100,'current_PDF_pages':20,'attributed_author_views':48,'root_personal_views':0,'source_tests':13,'original_negatives':681,'no_native_rebuild':True}))
