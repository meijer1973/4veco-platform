"""Reexecute bounded correction proof on root; never supplies review acceptance."""
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-222-'
EVIDENCE = ROOT/'reports/sprints'
spec = importlib.util.spec_from_file_location('r13_proof', EVIDENCE/(PREFIX+'correction-evidence-r13.py'))
proof = importlib.util.module_from_spec(spec)
spec.loader.exec_module(proof)
lesson = ROOT.parent/'4veco-lessen'
output = EVIDENCE/(PREFIX+'root-delta-r13.json')
assert not output.exists(), 'Use a fresh root proof record'
before = json.loads((EVIDENCE/(PREFIX+'correction-before-r13.json')).read_text(encoding='utf-8'))
result = proof.prove_after(lesson, before)
changed = [p for p in result['page_transitions'] if p['changed']]
assert len(changed) == 1 and changed[0]['edition'] == 'antwoorden' and changed[0]['page'] == 'page-002.png'
assert changed[0]['before'] == '7bf2147b456b14e9af54a8e6c0ec4bb417828c0e7ddc97d22abb526024527f40'
assert changed[0]['after'] == '65ab004822fdc1eca242363f3b18c340e0cbace06ce03afbaf6545c4b6721043'
assert proof.filehash(lesson/proof.b.LESSON_REL/'2.2.2-review.md') == 'd8c01a53362386143557666e1b6a9d3157a166d69330fba56a0ac48e7a88a9e1'
published = proof.relocate_manifest(json.loads((EVIDENCE/(PREFIX+'build-r13.json')).read_text(encoding='utf-8')), lesson)
root_manifest = EVIDENCE/(PREFIX+'root-build-r13.json')
current = json.loads(root_manifest.read_text(encoding='utf-8'))
assert current['input_sources'] == published['input_sources']
for actual, reference in zip(current['documents'], published['documents']):
    assert 'proof_directory' not in actual
    assert actual == {key: value for key, value in reference.items() if key != 'proof_directory'}
    actual['proof_directory'] = reference['proof_directory']
root_manifest.write_text(json.dumps(current, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')
result['root_note'] = 'Actual root execution, exact published generation and immutable local proof links verified; canonical FAIL retained. No visual approval from script.'
output.write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')
print(json.dumps({'result':result['status'], 'output':str(output), 'sha256':proof.filehash(output), 'preserved_history_file_count':result['preserved_history_file_count'], 'page_transitions':len(result['page_transitions']), 'changed_pages':changed, 'source_and_student_dom_delta':'Exact bounded change', 'raster_tolerance':0, 'canonical_review':'FAIL unchanged', 'root_manifest_sha256':proof.filehash(root_manifest)}, indent=2))
