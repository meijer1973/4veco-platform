"""Reviewer-owned R3 inventory/provenance/math probes; never visual acceptance."""
import hashlib
import json
import re
from fractions import Fraction as F
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LESSONS = Path('\\\\?\\' + str(ROOT.parent / '4veco-lessen'))
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-223-REVIEW'
old = ROOT / 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-build-r3.json'
manifest = json.loads(old.read_text(encoding='utf-8'))

def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def relocate(value):
    if isinstance(value, dict):
        return {k: relocate(v) for k, v in value.items()}
    if isinstance(value, list):
        return [relocate(v) for v in value]
    if isinstance(value, str):
        return value.replace('C:\\wt\\book2-223-production-20260905\\4veco-platform', str(ROOT)).replace('C:\\wt\\book2-223-production-20260905\\4veco-lessen', str(LESSONS))
    return value

local = relocate(manifest)
checked = []
for source in local['input_sources']:
    assert sha(source['path']) == source['sha256'], source['path']
for doc in local['documents']:
    for pathkey, hashkey in [('source_md','source_sha256'), ('source_html','html_sha256'), ('source_pdf','pdf_sha256'), ('zip','zip_sha256')]:
        assert sha(doc[pathkey]) == doc[hashkey], doc[pathkey]
    assert Path(doc['source_pdf']).stat().st_size > 10000
    text = Path(doc['source_md']).read_text(encoding='utf-8')
    refs = re.findall(r'!\[[^\]]*\]\(([^)]+)\)', text)
    for ref in refs:
        for ext in ['.svg', '.png']:
            assert (Path(doc['source_md']).parent / ref).with_suffix(ext).is_file()
    for asset in doc['assets']:
        assert sha(asset['path']) == asset['sha256']
    proof = Path(doc['proof_directory'])
    observation = json.loads((proof/'manifest.json').read_text(encoding='utf-8'))
    assert observation['inspection_status'] == 'PENDING' and observation['pages_inspected'] == []
    assert observation['pdf_sha256'] == doc['pdf_sha256']
    assert observation['render_dpi'] == 150
    for page in observation['rendered_pages']:
        assert sha(proof/page) == observation['page_sha256'][Path(page).name]
    checked.append({'kind':Path(doc['source_pdf']).stem.rsplit(' – ',1)[1], 'pdf_sha256':doc['pdf_sha256'], 'pages':len(observation['rendered_pages']), 'manifest_sha256':sha(proof/'manifest.json')})
folder = Path(local['documents'][0]['source_md']).parent
assets = sorted(p.name for p in (folder/'_assets').iterdir())
assert assets == sorted(f'2.2.3_fig_{n}.{ext}' for n in range(1,5) for ext in ['svg','png'])
assert (folder/'build_pdf.py').is_file()
assert [x['pages'] for x in checked] == [15,10,7]
inspection_path = ROOT/'reports/sprints'/f'{PREFIX}-inspection.json'
if inspection_path.exists():
    inspection = json.loads(inspection_path.read_text(encoding='utf-8'))
    assert inspection['reviewer'] == 'paragraph_223_independent_review'
    assert inspection['revision'] == 'R3' and inspection['date'] == '2026-09-05'
    for record, actual in zip(inspection['documents'], checked):
        assert record['pdf_sha256'] == actual['pdf_sha256']
        assert record['generation_manifest_sha256'] == actual['manifest_sha256']
        assert len(record['pages']) == actual['pages']
        for n, page in enumerate(record['pages'],1):
            assert page['page'] == n and len(page['reviewer_observation']) > 40
            assert sha(ROOT/record['proof_directory']/page['path']) == page['sha256']

# Independent recomputation, not calls into the builder's arithmetic fixtures.
def pct(old_value, new_value):
    return F(new_value-old_value, old_value)*100

def quantity(a,b,c,d,x,z,y):
    return a-b*x+c*z+d*y

math_cases = {}
for name, data, expected in [
    ('worked', (80,2,F(1),F(5,1000),20,10,30000,36000,14), (200,230,204,F(3,4))),
    ('guided_4', (90,2,F(1,2),F(5,1000),20,20,20000,24000,24), (160,180,162,F(5,8))),
    ('guided_5', (120,2,F(1),F(4,1000),15,10,25000,30000,15), (200,220,205,F(1,2))),
    ('independent_8', (90,2,F(1),F(5,1000),10,10,20000,24000,14), (180,200,184,F(5,9))),
    ('target_9', (100,2,F(1,2),F(1,100),10,20,30000,33000,24), (390,420,392,F(10,13))),
]:
    a,b,c,d,x,z,y,new_y,new_z = data
    q0=quantity(a,b,c,d,x,z,y); qy=quantity(a,b,c,d,x,z,new_y); qz=quantity(a,b,c,d,x,new_z,y)
    ei=pct(q0,qy)/pct(y,new_y)
    assert (q0,qy,qz,ei)==expected
    math_cases[name]={'Q_old':str(q0),'Q_income':str(qy),'Q_reset_price':str(qz),'percent_Q':str(pct(q0,qy)),'percent_Y':str(pct(y,new_y)),'Ei_exact':str(ei)}
assert pct(10,12)==20 and pct(100,90)==-10 and pct(100,90)/pct(10,12)==F(-1,2)
assert 60-2*5==50 and 60-2*8==44
assert 40-2*5+10==40 and 40-2*5+12==42
ratios = [(15,10,F(3,2)),(-5,10,F(-1,2)),(5,10,F(1,2)),(10,20,F(1,2)),(-4,20,F(-1,5)),(-5,20,F(-1,4)),(-2,10,F(-1,5)),(12,8,F(3,2)),(-4,8,F(-1,2)),(-8,20,F(-2,5)),(8,5,F(8,5)),(-2,5,F(-2,5)),(3,10,F(3,10)),(-4,10,F(-2,5)),(-3,5,F(-3,5)),(4,10,F(2,5)),(-6,10,F(-3,5))]
assert all(F(q,base)==answer for q,base,answer in ratios)
assert 210-200==10 and 205-200==5 and 215-200==15
assert 3+2+4+4+3==16
out = {'reviewer':'paragraph_223_independent_review','candidate_platform':'8dc54d78a222cff2225d88aae8c7d23141953cc1','candidate_lessons':'b23e0056511fc5b9b10f0b8e6bbe130d2599c36b','pass_0':'PASS','documents':checked,'asset_inventory':assets,'independent_rational_cases':math_cases,'direct_ratio_checks':len(ratios),'visual_acceptance':'NOT_SUPPLIED_BY_THIS_SCRIPT','immutable_build_manifest_sha256':sha(old)}
(ROOT/'reports/sprints'/f'{PREFIX}-local-manifest.json').write_text(json.dumps(local,indent=2,ensure_ascii=False)+'\n',encoding='utf-8',newline='\n')
(ROOT/'reports/sprints'/f'{PREFIX}-probes.json').write_text(json.dumps(out,indent=2,ensure_ascii=False)+'\n',encoding='utf-8',newline='\n')
print(json.dumps(out,indent=2,ensure_ascii=True))
