"""Independent read-only repository checks; only review fixtures/evidence are written."""
from pathlib import Path
import hashlib
import json
import runpy
import subprocess
import sys
import types
import fitz

BASE = Path(__file__).resolve().parent.parent
PLATFORM = BASE / '4veco-platform'
LESSONS = BASE / '4veco-lessen'
REVIEW = BASE / 'review'
RECEIVED = PLATFORM / 'references/staged/books34-v3'
CURRENT = LESSONS / 'edities/books34-v3'
results = []

for old in sorted((RECEIVED / 'curriculum/targets').glob('*.json')):
    before = json.loads(old.read_text(encoding='utf8'))
    after = json.loads((CURRENT / 'curriculum/targets' / old.name).read_text(encoding='utf8'))
    allowed = {'lesson_route', 'source_pin'}
    assert all(before.get(k) == after.get(k) for k in (set(before) | set(after)) - allowed), old.name
    assert {k:v for k,v in before['source_pin'].items() if k != 'student_manuscript_sha256'} == {k:v for k,v in after['source_pin'].items() if k != 'student_manuscript_sha256'}, old.name
    assert before['target_payload_sha256'] == after['target_payload_sha256'], old.name
results.append({'check':'31 target payloads preserved; only route and student manuscript pins changed', 'passed':True})

for p in sorted((CURRENT / 'books').glob('*/chapters/*/Antwoorden.md')):
    assert p.read_bytes() == (RECEIVED / p.relative_to(CURRENT)).read_bytes(), str(p)
results.append({'check':'six B3/B4 central answer manuscripts byte-identical', 'passed':True})

edition = LESSONS / 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/edities/chat-2026'
for h in range(1,4):
    folder = edition / 'bronnen' / f'H{h}'
    for p in [*folder.glob('*antwoorden.md'), *folder.glob('output/*Antwoorden.pdf')]:
        old = subprocess.run(['git','show','e2843b47c828784ab594d004cef461cea929717f:' + p.relative_to(LESSONS).as_posix()],cwd=LESSONS,capture_output=True,check=True).stdout
        assert old == p.read_bytes(), str(p)
results.append({'check':'three B2 central answers and three reused answer chapter PDFs byte-identical', 'passed':True})

# Run the actual assembler function with controlled renderer results. It must
# reject drift before writing any assembly. No repository build is executed.
fixture = REVIEW / 'build-overflow-fixture'
(fixture / 'curriculum').mkdir(parents=True, exist_ok=True)
(fixture / 'books/book-3/book-matter').mkdir(parents=True, exist_ok=True)
(fixture / 'curriculum/chapter-config.json').write_text(json.dumps({'3.1':{'path':'books/book-3/chapters/3.1','title':'Probe'}}),encoding='utf8')
render = types.ModuleType('render')
render.ROOT = fixture
render.chunks = lambda *args: []
render.build_pages = lambda *args: None
content = types.ModuleType('content')
content.chapter_data = lambda *args: {'pages':[{'local_page':1}],'paragraphs':{},'targets':{}}
sys.modules['render'] = render
sys.modules['content'] = content
for label, rendered in [('overflow reported', {'pages':2,'overflow':[{'pdf_page':2}]}), ('page count drift without overflow flag', {'pages':2,'overflow':[]})]:
    render.build_chapter = lambda *args, value=rendered: [value]
    module = runpy.run_path(str(PLATFORM / 'build-scripts/books/books34_assemble.py'),run_name='independent_review')
    try:
        module['main']()
    except RuntimeError as exc:
        assert str(exc) == 'Book-page chapter overflow 3.1', str(exc)
    else:
        raise AssertionError('Final book-page render not rejected: ' + label)
    results.append({'check':'final chapter render rejects ' + label,'passed':True})

sys.path.insert(0, str(PLATFORM / 'build-scripts/books'))
from build_book2_chat import file_record, revision_inputs
binding_root = REVIEW / 'book2-binding-fixture'
binding_root.mkdir(exist_ok=True)
chapter_names = [f'chapters/{kind}-{n}.pdf' for kind in ('student','answer','teacher') for n in (1,2,3)]
for name in chapter_names:
    p = binding_root / name
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_bytes(b'Bound fixture bytes, no rendering is performed.')
manuscript = binding_root / 'bronnen/H1/manuscript/test.md'
manuscript.parent.mkdir(parents=True, exist_ok=True)
manuscript.write_text('Source fixture',encoding='utf8')
config = binding_root / 'assembly.json'
config.write_text(json.dumps({'bundles':[{'chapters':chapter_names}]}),encoding='utf8')
binding = {'revision':'exercise-routes-20260921','sources':[file_record(binding_root,manuscript),file_record(binding_root,config)],'chapters':{name:file_record(binding_root,binding_root/name) for name in chapter_names}}
binding_path = binding_root / 'route-chapter-inputs.json'
def check_binding(value):
    binding_path.write_text(json.dumps(value),encoding='utf8')
    return revision_inputs(binding_root)
assert check_binding(binding) == binding
for label, change, expected in [
    ('unknown revision', lambda v:v.update(revision='unknown'), 'Unknown chapter revision'),
    ('missing chapter', lambda v:v['chapters'].pop(chapter_names[0]), 'exactly the nine assembly chapters'),
    ('duplicate source', lambda v:v['sources'].append(v['sources'][0]), 'duplicate chapter source'),
    ('missing manuscript', lambda v:v['sources'].pop(0), 'omits editable manuscripts'),
    ('unsafe path', lambda v:v['sources'][0].update(path='../outside.md'), 'Unsafe chapter revision path'),
    ('stale source hash', lambda v:v['sources'][0].update(sha256='0'*64), 'Stale chapter revision input'),
    ('stale chapter hash', lambda v:v['chapters'][chapter_names[0]].update(sha256='0'*64), 'Stale chapter revision input'),
]:
    value = json.loads(json.dumps(binding))
    change(value)
    try:
        check_binding(value)
    except ValueError as exc:
        assert expected in str(exc), str(exc)
    else:
        raise AssertionError('Binding accepted ' + label)
    results.append({'check':'Book 2 revision binding rejects ' + label,'passed':True})
check_binding(binding)

doc = fitz.open()
doc.new_page()
first = doc.tobytes(garbage=4, deflate=True)
second = doc.tobytes(garbage=4, deflate=True)
results.append({'check':'PyMuPDF default save regenerates PDF ID','different_bytes':first != second,'version':fitz.VersionBind})

paths = [PLATFORM / 'build-scripts/books' / x for x in ('rebuild_exercise_routes.py','books34_assemble.py','books34_records.py','build_book2_chat.py')]
paths.append(CURRENT / 'build/build_all.py')
hashes = {p.relative_to(BASE).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in paths}
evidence = {'scope':'interim build review; no repository writes or full render','results':results,'input_sha256':hashes}
(REVIEW / 'build-probe-results.json').write_text(json.dumps(evidence,indent=2)+'\n',encoding='utf8',newline='\n')
print(json.dumps(evidence,indent=2))
