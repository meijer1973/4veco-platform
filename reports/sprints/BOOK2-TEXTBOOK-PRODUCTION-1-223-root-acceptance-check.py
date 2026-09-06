"""Exact postacceptance metadata, output inventory and current-gate verification."""
import importlib.util
import json
from pathlib import Path
import re
import yaml

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('root223_adoption', ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-root-qc-check.py')
c = importlib.util.module_from_spec(spec)
spec.loader.exec_module(c)
n, q, B = c.n, c.q, c.B
V = '12c0d668c084789b73146f05db13aa7aaf337c63'
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-223-root-acceptance'
base = n.read('baseline')
q.PREFIX = n.PREFIX = PREFIX
qcname, handname = '2.2.3-quality-ref.yaml', '2.2.3-textbook-handoff.md'
qcpath, handpath = (B.LESSON_REL/qcname).as_posix(), (B.LESSON_REL/handname).as_posix()
oldbytes = n.blob(c.LIN,qcpath,n.LESSONS)
currentbytes = (n.DEST/qcname).read_bytes()
assert n.sha(oldbytes) == c.QC
assert n.sha(currentbytes) == '9cebc22fec47def140b8502dc6e5553cb10200e22a0cebae65a1c292a0693461'
old, current = yaml.safe_load(oldbytes), yaml.safe_load(currentbytes)
assert list(old) == list(current)
assert {k:v for k,v in old.items() if k!='partA'} == {k:v for k,v in current.items() if k!='partA'}
allowed = ['root_validation','root_acceptance','handoff_status','production_ready_with_flags']
assert list(old['partA']) == list(current['partA'])
for key, value in old['partA'].items():
    if key not in allowed:
        assert current['partA'][key] == value, key
part = current['partA']
assert part['root_validation']['status'] == 'PASS' and part['root_validation']['verification_commit'] == V
assert part['root_validation']['root_personal_views'] == 0
assert part['root_acceptance']['status'] == 'ACCEPTED WITH FLAGS'
assert part['root_acceptance']['actor'] == 'codex-root' and part['root_acceptance']['required_corrections'] == []
assert part['root_acceptance']['lineage_flag_closure']['status'] == 'CLOSED'
assert part['production_ready'] is False and part['production_ready_with_flags'] is True
assert part['handoff_status']['status'] == 'RENEWED' and part['handoff_status']['companion'] == 'NOT_COMMISSIONED'
handbytes = (n.DEST/handname).read_bytes()
assert n.sha(handbytes) == 'b2c79f67fd2c1aba0800f444db11b2e99240c623e44726086a3d061a01d35960'
hand = handbytes.decode()
assert re.findall(r'^## (\d+)\. ',hand,re.M) == list(map(str,range(1,10)))
for word in [V,n.sha(currentbytes),c.REVIEW,'NOT_COMMISSIONED','UNOBSERVED','F223-LINEAGE','A17/D11','A16/D12','A04','A38/A15','D27','3/2/4/4/3','11/5/3','390','420','392','10/13']:
    assert word in hand, word
for name in base['native_files']:
    assert n.sha((n.DEST/name).read_bytes()) == base['paragraph_files'][name]
    if not name.startswith('_assets/'):
        assert base['paragraph_files'][name] in hand, name
assert base['paragraph_files']['build_pdf.py'] in hand
for i in range(1,5):
    assert f'2.2.3_fig_{i}' in hand
lessons = {name:oid for name,oid in base['current_lesson_blobs'].items() if name != qcpath}
assert c.live_objects(n.LESSONS,lessons) == lessons
tracked_delta = n.git('diff','--name-only','-z',c.LIN,cwd=n.LESSONS).decode().split('\0')
untracked = n.git('ls-files','--others','--exclude-standard','-z',cwd=n.LESSONS).decode().split('\0')
assert set(filter(None,tracked_delta+untracked)) == {qcpath,handpath}
platform = c.tree(ROOT,V)
own_mutable = {'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-' + tail for tail in ['command-log.md','command-log.jsonl','output-manifest.md']}
immutable = {name:oid for name,oid in platform.items() if name not in own_mutable}
assert c.live_objects(ROOT,immutable) == immutable
for row in base['imports']:
    assert n.sha((ROOT/row['path']).read_bytes()) == row['raw_sha256']
c.r.custody()
c.a.source_binding()

manifest_path = n.OUT/'BOOK2-TEXTBOOK-PRODUCTION-1-output-manifest.md'
rows = []
for line in manifest_path.read_text(encoding='utf-8').splitlines():
    cells = [value.strip() for value in line.split('|')]
    if len(cells)==7 and cells[1].isdigit():
        rows.append({'number':int(cells[1]),'id':cells[2],'edition':cells[3],
                     'status':cells[4],'relative':cells[5].strip('`')})
assert [r['number'] for r in rows] == list(range(1,42))
assert len({r['relative'] for r in rows}) == 41
assert {key:sum(r['status']==key for r in rows) for key in 'ACLP'} == {'A':18,'C':3,'L':8,'P':12}
book = Path('Boek 2 - Kosten, opbrengsten, elasticiteit en surplus')
baseline_lesson = c.tree(n.LESSONS,'f09fd6e88edc5049b026b16b0158e7e188091d2d')
for row in rows:
    relative = (book/row['relative']).as_posix()
    path = n.LONG/relative
    assert path.is_file() == (row['status'] != 'P'), relative
    if row['status'] != 'P':
        row['raw_sha256'] = n.sha(path.read_bytes())
        current_blob = c.live_objects(n.LESSONS,[relative])[relative]
        assert current_blob == base['current_lesson_blobs'][relative]
        if row['status'] == 'L':
            assert current_blob == baseline_lesson[relative]
        if row['id'] == '2.2.3':
            assert row['status']=='A' and row['raw_sha256']==base['paragraph_files'][path.name]
q.gates('post')
n.save('check', {'status':'PASS','verification_commit':V,'root_only_changed_fields':allowed,
    'all_other_specialist_fields_exact':True,'quality_ref_raw_sha256':n.sha(currentbytes),
    'handoff_raw_sha256':n.sha(handbytes),'handoff_sections':9,'native_files_unchanged':20,
    'other_lesson_files_unchanged':len(lessons),'immutable_platform_files_unchanged':len(immutable),
    'imported_files_unchanged':len(base['imports']),'rows':rows,'counts':{'A':18,'C':3,'L':8,'P':12},
    'physical_PDFs':29,'old_legacy_blobs_exact':8,'current_accepted_and_candidate_blobs_exact':21,
    'six_current_gates':'PASS','production_ready':False,'production_ready_with_flags':True})
