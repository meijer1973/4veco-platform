"""Exact non-promoted current specialist state; prior PASS history is immutable."""
from pathlib import Path
import json
import qc_probes as q
quality=q.DEST/'2.1.3-quality-ref.yaml'
assert q.blob(q.LESSONS,q.LBASE,quality.relative_to(q.LESSONS))==quality.read_bytes()
protected=json.loads((q.OUT/'protected-baseline.json').read_text(encoding='utf-8'))
for pin in protected['pins']:
    assert q.sha(Path(pin['path']).read_bytes().replace(b'\r\n',b'\n'))==pin['sha256'],pin
initial=json.loads((q.OUT/'pass0.json').read_text(encoding='utf-8'))
for name,h in initial['files'].items(): assert q.digest(q.DEST/name)==h
for name,h in initial['assets'].items(): assert q.digest(q.DEST/'_assets'/name)==h
assert not (q.DEST/'2.1.3-textbook-handoff.md').exists()
report=q.ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-R6-QC-disposition-successor.md'
assert report.is_file()
q.emit('withdrawal-verification.json',{'result':'REVISE: R6-QC-F1 missing required bonus criteria block','actor':q.ACTOR,
    'current_disposition_sha256':q.digest(report),'initial_PASS_platform_commit':'1b7be114ab64efd38d5e23d75c7cfa2f1e5edab5',
    'initial_QC_lesson_commit':'0fa54a0d278d7c0be7a315bbabf741bd1d735240',
    'canonical_QC_raw_sha256':q.digest(quality),'canonical_QC_state':'exact original legacy record, not current acceptance',
    'canonical_review_raw_sha256':q.digest(q.DEST/'2.1.3-review.md'),'all_protected_pins_exact':True,
    'all_source_output_asset_hashes_exact':True,'handoff':'absent','earlier_verification':'retained as historical withdrawn state',
    'unmet_required_deliverables':1,'source_correction_by_this_reviewer':False})
