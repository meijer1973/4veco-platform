"""Read-only complete §232 source/native/author-view custody.

HOW TO ADAPT: explicit immutable epochs and in-memory artifact-path relocation.
No author writer, revision reservation, native rebuild or personal review.
"""
import argparse
import copy
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
OWN='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-ROOT-ADOPTION-'
AP='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-BUILD-CURRENT-'
CR='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-REPRO-ROUTES-'
SC='abe79fa532c8701d646fb19f129ad892004fb821'
OLD_SC='e0b47cab498102cd990e66318f5111602c32a6b6'
AL='ea0dd35d4f919ac5b3aae533cd9f9022ffa62282'
OLD_P='020def560795a0acab07dc11552b3e4abebf3d62'
sys.path.insert(0,str(P/'build-scripts/content/book-2'))
import b2_232 as b
sys.path.insert(0,str(P/'build-scripts/content/book-2/232'))
import verify_rebuild as v
import check_render as ck
from PIL import Image
raw=lambda p:b.gate.data_path(Path(p)).read_bytes()
load=lambda p:json.loads(raw(p))
sha=lambda data:hashlib.sha256(data).hexdigest()
git=lambda root,*args:subprocess.check_output(['git',*args],cwd=root)

def rebase(filename):
    p=Path(filename)
    if not p.is_absolute():
        p=(P/p).resolve()
        assert p.is_relative_to(P) or p.is_relative_to(L),p
        return p
    for base in ['book2-232-build-current-20260906','book2-232-repro-routes-20260906']:
        for repo,current in [('4veco-platform',P),('4veco-lessen',L)]:
            old=Path('C:/wt')/base/repo
            if p.is_relative_to(old):return current/p.relative_to(old)
    raise AssertionError('Unrecognized original artifact path: '+str(p))

def rgb(filename):
    data=raw(filename)
    with Image.open(io.BytesIO(data)) as image:
        return {'size':list(image.size),'rgb_sha256':sha(image.convert('RGB').tobytes()),'raw_sha256':sha(data)}

def relocate_manifest(original):
    """Only artifact locations; execution identity/source/history stay unchanged."""
    result=copy.deepcopy(original)
    for key in ['lesson_root','paragraph_folder','manifest_path','attempt_path','proof_root']:
        if key in result:result[key]=str(rebase(result[key]))
    for doc in result['documents']:
        for key in ['source_md','source_html','source_pdf','proof_directory']:doc[key]=str(rebase(doc[key]))
        for asset in doc['assets']:asset['path']=str(rebase(asset['path']))
        doc['zip']['path']=str(rebase(doc['zip']['path']))
    assert result['execution']==original['execution'] and result['source_files']==original['source_files']
    return result

def original_proof_checks(manifest):
    assert manifest['packet']==b.snapshot(L/b.LESSON_REL)
    assert (manifest['generation_status'],manifest['production_ready'],manifest['root_acceptance'],manifest['handoff'])==('PENDING',False,'PENDING','PENDING')
    assert len(manifest['source_files'])==11
    for row in manifest['source_files']:
        assert sha(git(P,'show',manifest['source_commit']+':'+row['path']))==row['sha256']
    assert manifest['root_release_sha256']=='9705ba935c9c9f79e3b5981ba3e9119da34cd37bf165adc57323f2c6365d3a18'
    assert manifest['plan_sha256']==b.PLAN_HASH and manifest['target_record_sha256']==b.TARGET_HASH
    assert len(manifest['preflight'])==3 and all(row['exit_code']==0 for row in manifest['preflight'])
    assert '214-232-INPUT-ROOT-gate.cjs' in ' '.join(manifest['preflight'][0]['argv'])
    assert 'paragraph_production' in manifest['preflight'][1]['argv']
    assert '--durable' in manifest['preflight'][2]['argv']
    pages={};proofs=[]
    for kind,doc in zip(b.KINDS,manifest['documents']):
        for field,h in [('source_md','source_sha256'),('source_html','html_sha256'),('source_pdf','pdf_sha256')]:assert sha(raw(rebase(doc[field])))==doc[h]
        for asset in doc['assets']:assert sha(raw(rebase(asset['path'])))==asset['sha256']
        assert sha(raw(rebase(doc['zip']['path'])))==doc['zip']['sha256']
        folder=rebase(doc['proof_directory']);record=load(folder/'manifest.json')
        assert (record['inspection_status'],record['pages_inspected'],record['visible_student_defects'],record['inspected_at_normal_reading_scale'])==('PENDING',[],None,False)
        for field in ['source_md','source_html','source_pdf','source_sha256','html_sha256','pdf_sha256','assets']:assert record[field]==doc[field]
        items=sorted((folder/'pages').glob('page-*.png'))
        assert record['rendered_pages']==['pages/'+p.name for p in items]
        current={p.name:rgb(p) for p in items}
        assert {n:r['raw_sha256'] for n,r in current.items()}==record['page_sha256']
        pages[kind]=current;proofs.append({'path':str((folder/'manifest.json').relative_to(P)),'sha256':sha(raw(folder/'manifest.json'))})
    assert [len(pages[k]) for k in b.KINDS]==[19,11,12]
    return pages,proofs

parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--attempt',required=True)
args=parser.parse_args();assert re.fullmatch('r[1-9][0-9]*',args.attempt)
destination=P/(OWN+'native-custody-'+args.attempt+'.json');assert not destination.exists()
assert b.ROOT==P
inputs=b.gate.verify_current(L);assert len(inputs['inputs'])==49
b.gate.verify_committed(inputs,L)
sources=b.gate.verify_source(SC);assert len(sources)==11
packet=b.snapshot(L/b.LESSON_REL);assert len(packet)==41
for relative,h in packet.items():
    name=(b.LESSON_REL/relative).as_posix();data=raw(L/name)
    assert sha(data)==h and data==git(L,'show',AL+':'+name) and data==git(L,'show','HEAD:'+name)
archives=v.archives(L/b.LESSON_REL);assert [a['count'] for a in archives]==[25,13,13]
final_parity=load(P/(CR+'final-parity.json'));assert sha(raw(P/(CR+'final-parity.json')))=='23d5d29424b156e304833336f2a675d4f9e1b185be8642cfe5c97deae0237011'
old_parity=load(P/(AP+'parity-four-final.json'))
assert old_parity['pages']==final_parity['pages'] and old_parity['archives']==archives==final_parity['archives']
runs=[];current_manifest_path=None;mapped=None
for prefix,revisions,epoch in [(AP,range(1000003,1000007),OLD_SC),(CR,range(1000011,1000015),SC)]:
    parity=old_parity if prefix==AP else final_parity
    for number in revisions:
        file=P/(prefix+'native-r'+str(number)+'.json');manifest=load(file)
        expected=next(row for row in parity['manifests'] if Path(row['path']).name==file.name)
        assert sha(raw(file))==expected['sha256']
        assert manifest['source_commit']==epoch and manifest['revision']=='r'+str(number)
        pages,proofs=original_proof_checks(manifest)
        assert pages==final_parity['pages']
        if prefix==CR:
            mapped=relocate_manifest(manifest)
            actual=v.validate_manifest(mapped)
            assert actual['pages']==pages and actual['archives']==archives and actual['packet']==packet
            current_manifest_path=file
        runs.append({'revision':manifest['revision'],'route':manifest['route'],'source_commit':epoch,'manifest_sha256':sha(raw(file)),'pages':42,'all_native_raw_and_page_raw_RGB_equal':True,'PENDING_proofs':proofs})
assert len(runs)==8 and mapped is not None
cross=load(P/(CR+'final-cross-epoch.json'))
assert sha(raw(P/(CR+'final-cross-epoch.json')))=='82fc087279c401e1934ca71a2476828c19bf2de02838fad71b28882477ccce49'
assert cross['old_pending_proofs']==runs[0]['PENDING_proofs'] and cross['archives']==archives
assert cross['old_committed_platform']==OLD_P and cross['old_committed_lesson']==AL
# Unchanged checker receives only a read-only path-relocated in-memory manifest.
# No CLI is invoked, no author/root output namespace is forged, no proof is rewritten.
old_loader=ck.load
def readonly_load(p):
    assert Path(p)==current_manifest_path
    return copy.deepcopy(mapped)
ck.load=readonly_load
try:checker=ck.check(current_manifest_path)
finally:ck.load=old_loader
assert checker['status']=='PASS' and len(checker['figures'])==14
assert [len(d['pages']) for d in checker['documents']]==[19,11,12]
gray=[]
for name in [AP+'grayscale-corrected.json',CR+'grayscale-final.json']:
    evidence=load(P/name);assert len(evidence['items'])==56
    rows=[]
    for row in evidence['items']:
        actual=rgb(rebase(row['path']))
        assert actual=={k:row[k] for k in actual}
        rows.append({'identity':row['kind']+'/'+str(row.get('page',row.get('stem'))),**actual})
    gray.append({'record':name,'sha256':sha(raw(P/name)),'rows':rows})
assert gray[0]['rows']==gray[1]['rows']
gray_parity=load(P/(CR+'final-gray-parity.json'))
assert sha(raw(P/(CR+'final-gray-parity.json')))=='55f4078b6e4966b720898094b8b9641be888e56bc6bec8f46bfe4356c190013b'
assert gray_parity['rows']==gray[0]['rows']
binding_path=P/(AP+'personal-binding.json');binding=load(binding_path)
assert sha(raw(binding_path))=='0d75d838d53f70ef4b419224d3bf165d77d8bd162449f86cef6949875ee335eb'
assert binding['actor']=='paragraph_231_specialist_qc' and binding['source_commit']==OLD_SC
assert binding['native_packet']==packet and len(binding['records'])==112
for row in binding['records']:
    actual=rgb(rebase(row['path']));assert actual['raw_sha256']==row['raw_sha256'] and row['personal_observation']
    if 'decoded_rgb_sha256' in row:assert actual['rgb_sha256']==row['decoded_rgb_sha256']
    if 'svg_sha256' in row:assert sha(raw(rebase(row['path']).with_suffix('.svg')))==row['svg_sha256']
for row in binding['evidence']:assert sha(raw(P/row['path']))==row['raw_sha256']
assert packet==b.snapshot(L/b.LESSON_REL)
result={'status':'PASS','actor':'codex-root','role':'read_only_candidate_adoption_not_acceptance','source_commit':SC,'source':sources,'inputs':49,'native_files':41,'packet':packet,'archives':archives,'runs':runs,'stored_page_comparisons':336,'current_source_DOM_ink_checker':checker,'gray_records':gray,'attributed_author_views':112,'root_personal_views':0,'root_native_runs':0,'source_path_relocation':'in_memory_artifact_locations_only; original execution/source/claims and every file unchanged','independent_review':'PENDING','specialist_QC':'PENDING','root_acceptance':'PENDING','handoff':'PENDING','production_ready':False}
with destination.open('x',encoding='utf-8',newline='\n') as stream:json.dump(result,stream,ensure_ascii=False,indent=2);stream.write('\n')
print(json.dumps({'status':'PASS','source':11,'inputs':49,'native':41,'stored_pages':336,'checker_pages':42,'figures':14,'grayscale_comparisons':112,'attributed_author_views':112,'root_personal_views':0,'root_native_runs':0}))
