"""One-shot root §212 R6 adoption/reproduction, not visual/review acceptance.

HOW TO ADAPT: use a new explicit checkpoint for later revisions. The imported
builder verifier and its immutable bases/evidence stay unchanged on disk.
"""
import hashlib
import importlib.util
import json
import subprocess
import sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'reports/sprints'
ORIGINAL='BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-'
PREFIX='BOOK2-TEXTBOOK-PRODUCTION-1-212-root-r6-'
PBASE='a2f697cce2a939baa7834092bd73844da86bcb6c'
LBASE='6ccc48911a6239dee25cffb8f29e9f42db442f9e'
PAIR='C:/wt/book2-212-alt-correction-20260905/'
def sha(data): return hashlib.sha256(data).hexdigest()
def load(name): return json.loads((OUT/(ORIGINAL+name+'.json')).read_text(encoding='utf-8'))
def remap(value):
    if isinstance(value,str) and value.replace('\\','/').startswith(PAIR):
        result=ROOT.parent/value.replace('\\','/')[len(PAIR):]
        assert result.resolve().is_relative_to(ROOT.parent.resolve())
        return str(result)
    if isinstance(value,list): return [remap(x) for x in value]
    if isinstance(value,dict): return {k:remap(v) for k,v in value.items()}
    return value
for suffix in ('baseline-r6','build-r6','mechanical-r6','print-rebuild-r6','reproduction'):
    assert not (OUT/(PREFIX+suffix+'.json')).exists(),'Root checkpoint collision'
spec=importlib.util.spec_from_file_location('root_212_evidence',OUT/(ORIGINAL+'evidence.py'))
e=importlib.util.module_from_spec(spec);spec.loader.exec_module(e)
e.PBASE=PBASE;e.LBASE=LBASE;e.PREFIX=PREFIX
before=load('baseline-r6')
before['platform_base']=PBASE;before['lesson_base']=LBASE
before['snapshot']='Exact pre-adoption root Git snapshots; the newly introduced metadata regression is separately scoped, not claimed present in the base.'
for record in before['files']:
    repo=e.LESSON if record['repo']=='lessons' else ROOT
    ref=LBASE if record['repo']=='lessons' else PBASE
    listed=subprocess.check_output(['git','ls-tree','--name-only',ref,'--',record['path']],cwd=repo)
    if not listed:
        assert record['repo']=='platform' and record['path']=='build-scripts/content/book-2/212/test_metadata.py'
        assert e.b.digest(repo/record['path'])==record['sha256']
        record['introduced_regression_not_in_base']=True
    else:
        record['sha256']=sha(subprocess.check_output(['git','show',ref+':'+record['path']],cwd=repo))
e.save('baseline-r6',before)
manifest=remap(load('build-r6'))
for source in manifest['input_sources']:
    assert e.b.digest(Path(source['path']))==source['sha256']
artifacts={}
for doc in manifest['documents']:
    for key,h in [('source_md','source_sha256'),('source_html','html_sha256'),('source_pdf','pdf_sha256')]:
        artifacts[doc[key]]=doc[h]
    artifacts[doc['zip']['path']]=doc['zip']['sha256']
    for a in doc['assets']: artifacts[a['path']]=a['sha256']
assert len(artifacts)==34
for p,h in artifacts.items(): assert e.b.digest(Path(p))==h
# Full generator without a proof-root reproduces outputs but does not overwrite
# the builder's historical absolute-path proof manifests or page observations.
fresh=e.b.build(e.LESSON)
for p,h in artifacts.items(): assert e.b.digest(Path(p))==h,('full build',p)
e.save('build-r6',manifest)
e.verify()
e.print_rebuild()
for p,h in artifacts.items(): assert e.b.digest(Path(p))==h,('print build',p)
e.save('reproduction',{'result':'PASS','executed_by':'codex-root','platform_baseline':PBASE,'lesson_baseline':LBASE,'current_artifacts':len(artifacts),'full_and_print_byte_identical':True,'root_page_view_claim':'None: exact27page parity transfers previous root R5 observations; current independent gates still pending.','required_followup':'Missing bonus assessment-criteria block, separate from completed metadata correction.','fresh_full_build':fresh})
print(json.dumps({'result':'PASS','artifacts':len(artifacts),'pages_identical_to_r5':27,'native_raster_pairs':11,'zip_member_counts':[19,11,9],'required_bonus_correction':'OPEN','independent_review_QC_handoff':'PENDING'},indent=2))
