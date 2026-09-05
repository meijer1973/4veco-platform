"""Exact adopted R7 candidate and native print-only proof, not full root rebuild.

HOW TO ADAPT: preserve this fixed checkpoint; a later accepted-prerequisite
transition requires a new explicit input/generation/review record.
"""
from pathlib import Path
import hashlib, json, re, subprocess, sys
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parents[2]
L=ROOT.parent/'4veco-lessen'
sys.path.insert(0,str(ROOT/'build-scripts/content/book-2'))
import b2_213 as b
from print_pipeline import build_document
F=L/b.LESSON_REL
E=ROOT/'reports/sprints'
PRE='BOOK2-TEXTBOOK-PRODUCTION-1-213-BONUS'
PBASE='5dd87192f242854d6db6af668a28c3e1c9677be3'
LBASE='f338159502438a0833f3d94e4956eeb8b0812a6d'
out=E/'BOOK2-TEXTBOOK-PRODUCTION-1-213-root-r7-check.json'
assert not out.exists(), 'Use a fresh exact checkpoint'
def sha(raw): return hashlib.sha256(raw).hexdigest()
def digest(p): return sha(p.read_bytes())
def blob(root,base,relative): return subprocess.check_output(['git','show',base+':'+relative],cwd=root)
def load(p): return json.loads(p.read_text(encoding='utf-8'))
def move(p):
    old=Path(p); prefix=Path('C:/wt/book2-213-bonus-correction-20260905')
    assert old.is_relative_to(prefix)
    result=ROOT.parent/old.relative_to(prefix)
    assert result.is_relative_to(ROOT) or result.is_relative_to(L)
    return result
checks=0
def verify(p,h):
    global checks
    assert digest(p)==h,(str(p),h,digest(p));checks+=1
manifest=load(E/(PRE+'-build-r7.json'))
delta=load(E/(PRE+'-evidence-r7/delta.json'))
rebuild=load(E/(PRE+'-evidence-r7/rebuild.json'))
verify(E/(PRE+'-result-r7.md'),'02dd47482106e127be2aaa075c7af4088c8787fa13540a3b1b62982ce978c9c5')
verify(E/(PRE+'-evidence-r7/delta.json'),'b0ed23104eddcf0e68127b5debd6557cdf3acab6b513f38ca027f477604f805c')
verify(E/(PRE+'-evidence-r7/rebuild.json'),'d9c5ac7201e0d3c620c0e8575ea6d907adab10d1d11d7f3dfe8d9cf9f67ce71d')
source=b.CONTENT/'answers.md'
old=blob(ROOT,PBASE,source.relative_to(ROOT).as_posix())
new=source.read_bytes()
label='**Beoordelingscriteria — een sterk antwoord:**'.encode()
closing='## Herhaling / Herhaling en interleaving'.encode()
prefix,tail=new.split(label); added,suffix=tail.split(closing)
insertion=label+added
assert prefix+closing+suffix==old
assert sha(insertion)==delta['source_insertion_sha256']
assert len(re.findall(rb'^- ',added,re.M))==3
for s in manifest['input_sources']: verify(move(s['path']),s['sha256'])
for p in manifest['prerequisites']:
    raw=move(p['path']).read_text(encoding='utf-8-sig').replace('\r\n','\n').replace('\r','\n').encode()
    assert sha(raw)==p['canonical_lf_sha256'];checks+=1
for record in delta['protected']:
    path=record['path'];base=ROOT if path.startswith(('build-scripts/','references/')) else L
    verify(base/path,record['after_sha256'])
for d in manifest['documents']:
    for key,h in [('source_md','source_sha256'),('source_html','html_sha256'),('source_pdf','pdf_sha256')]: verify(move(d[key]),d[h])
    verify(move(d['zip']['path']),d['zip']['sha256'])
    for a in d['assets']: verify(move(a['path']),a['sha256'])
    proof=move(d['proof_directory']); generation=load(proof/'manifest.json')
    assert generation['pdf_sha256']==d['pdf_sha256'] and generation['inspection_status']=='PENDING'
    assert generation['pages_inspected']==[]
    for name,h in generation['page_sha256'].items(): verify(proof/'pages'/name,h)
for d in delta['native_proofs']:
    for p in d['pages']: verify(ROOT/p['path'],p['sha256'])
for g in rebuild['grayscale_pages']: verify(move(g['path']),g['sha256'])
artifacts={name:digest(F/name) for name in rebuild['artifacts']}
assert len(artifacts)==24 and artifacts==rebuild['artifacts']
changed=[]
for name,h in artifacts.items():
    previous=blob(L,LBASE,(b.LESSON_REL/Path(name)).as_posix())
    if sha(previous)!=h: changed.append(name)
assert changed==[f'{b.STEM} – antwoorden.{e}' for e in ('md','html','pdf','zip')]
md=F/f'{b.STEM} – antwoorden.md'
assert md.read_bytes().replace(insertion,b'')==blob(L,LBASE,md.relative_to(L).as_posix())
html=F/f'{b.STEM} – antwoorden.html'
before=BeautifulSoup(blob(L,LBASE,html.relative_to(L).as_posix()),'html.parser')
after=BeautifulSoup(html.read_bytes(),'html.parser')
p=after.find('strong',string='Beoordelingscriteria — een sterk antwoord:').parent
listing=p.find_next_sibling('ul'); assert len(listing.find_all('li'))==3
p.decompose(); listing.decompose()
def tree(n):
    if not getattr(n,'name',None): return ' '.join(str(n).split()) or None
    return [n.name,dict(n.attrs),[v for c in n.children if (v:=tree(c)) is not None]]
assert tree(before)==tree(after)
oldTest=blob(ROOT,PBASE,'build-scripts/content/book-2/213/test_source.py')
assert (b.CONTENT/'test_source.py').read_bytes()==oldTest
prior=L/'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – paragraaf.md'
assert manifest['prior_paragraph_md_raw_sha256']=='f53521ed8812a4c8b8c33c1d66b34e0afe8425c1dffb1723f37771372b2baa09'
assert digest(prior)=='9350d60fadee3494124f7b0593bc1efcf00db5ea292d0a19fc3f10518e11d1f8'
assert digest(prior)!=manifest['prior_paragraph_md_raw_sha256']
# Deliberately do not call b.build: combined root has a known unaccepted incoming
# source successor. Print-only is a separate reproduction phase, never a claim
# that the unchanged full-generator prerequisite guard passed or was bypassed.
for kind in ('paragraaf','opgaven','antwoorden'):
    b.zip_document(build_document(F/f'{b.STEM} – {kind}.md'))
assert {name:digest(F/name) for name in artifacts}==artifacts
assert not (F/'2.1.3-textbook-handoff.md').exists()
result=dict(result='PASS',checks=checks,artifacts=24,changed_artifacts=changed,unchanged_artifacts=20,
    exact_source_insertion=True,complete_answer_DOM_reversal=True,old13tests_byte_identical=True,
    actual_pages=30,root_personally_viewed_answer_pages=7,unchanged_pupil_pages_from_root_prior_exact_transfer=23,
    current_root_print_only='PASS: 24 exact artifacts',current_root_full_generator='NOT RUN: unchanged guard requires accepted212 source successor',
    expected_historical212_md=manifest['prior_paragraph_md_raw_sha256'],actual_current212_md=digest(prior),
    original_pair_full_and_print_proof='Published builder evidence bound exactly; independent R7 paragraph/QC still pending',
    canonical_review_QC='R6/legacy unchanged; no acceptance/handoff')
out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(result,ensure_ascii=True,indent=2))
