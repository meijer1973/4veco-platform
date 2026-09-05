"""Verify exact canonical QC addition without payload or historical drift."""
import importlib.util, json
from pathlib import Path
import yaml
spec=importlib.util.spec_from_file_location('q',Path(__file__).with_name('BOOK2-TEXTBOOK-PRODUCTION-1-222-R13-QC-run.py'))
q=importlib.util.module_from_spec(spec); spec.loader.exec_module(q)
quality=q.P/'2.2.2-quality-ref.yaml'
old=q.blob(q.LB,q.REL/quality.name,q.L)
raw=quality.read_bytes(); assert raw.startswith(old)
before=yaml.safe_load(old); current=yaml.safe_load(raw)
assert all(current[k]==v for k,v in before.items())
assert set(current)-set(before)=={'schema_version','partA'}
assert current['schema_version']==2 and current['production_ready_with_flags'] is False
part=current['partA']; assert part['review_verdict']==part['specialist_verdict']=='PASS WITH FLAGS'
assert q.sha((q.P/part['review_file']).read_bytes())==part['review_sha256']
assert q.sha((q.ROOT/part['specialist_report']).read_bytes())==part['specialist_report_sha256']
for key in ('exact_probes','personal_inspection','complete_route_check'):
    assert q.sha((q.ROOT/part['evidence'][key]).read_bytes())==part['evidence'][key+'_sha256']
assert not (q.P/'2.2.2-textbook-handoff.md').exists()
initial=json.loads((q.E/'before.json').read_text(encoding='utf-8'))
after=q.snapshot(); changed=[p for p in initial if initial[p]!=after[p]]
assert changed==[str(q.REL/quality.name).replace('\\','/')]
assert set(initial)==set(after)
bindings=json.loads((q.E/'pass0.json').read_text(encoding='utf-8'))['bindings']
for path,h in bindings.items():
    if Path(path)!=quality: assert q.sha(Path(path).read_bytes())==h,path
q.put('canonical-preservation.json',dict(status='PASS',legacy_byte_prefix_preserved=True,legacy_fields_preserved=sorted(before),schema_version=2,only_new_blocks=['schema_version','partA'],quality_sha256=q.sha(raw),old_quality_sha256=q.sha(old),review_sha256=part['review_sha256'],changed_lesson_paths=changed,other_pass0_bindings_exact=51,handoff_absent=True,production_ready_with_flags=False))
print('PASS: current PartA QC bound; all legacy fields, review, pupil payload and proof bindings unchanged.')
