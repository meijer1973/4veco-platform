"""One-shot root223 adoption custody and reproduction, not personal specialist review.

Fully read ALT, independent review and renewal controllers provide attributed
source/DOM/native/reservation primitives. Their historical entrypoints are not
run. This new root prefix, exact imports and baseline own every new record.
"""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-223-root-qc'
spec = importlib.util.spec_from_file_location('attributed_223_renewal', ROOT / 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-QC-RENEWAL-check.py')
q = importlib.util.module_from_spec(spec)
spec.loader.exec_module(q)
r, a, n, B = q.r, q.a, q.n, q.B
q.PREFIX = r.PREFIX = a.PREFIX = n.PREFIX = PREFIX
n.PROOF = n.OUT / (PREFIX + '-evidence')
PBASE = 'e2ac9632eee88bd19b0a4e483ed88bb1e27f006f'
LBASE = '42996c60b4a93843dfe8488b8e5a3ea704871667'
PIN = 'a150152a9d3222bbf60f6c4320b8df6e1af0ae0d'
LIN = '82c2794da5d84de0d1e9f050944a2c1dd5069047'
LCANDIDATE = 'fdce41899984a2c64efb88eb6da103181ddd6721'
REVIEW = '56883966bb05a60b395e6d53d9228d4e801072818c00b8634dd2c60a1de3121f'
QC = '880508d4ae80f80afe4dbf567f34fa37fe607fca88fb8ea595be21b7d7e3f566'
COMMITS = '''0da50b96b3ee925f6aed29ebf8e3257ce75e48ef
4b3ab937db88252e11026037ddbc4e94aed0344d
5c3f79ac90019defe66efe92c764158c098ece23
4592685f169f3ff5dc748ff7d8d4ede4b8bc4d05
637505b6e1fe34fea8dac9ba854112f3b336393e
9c6370f3382a43c8e018156ce11309255f18fc40
2d3d3e1a4a5b679c14cb0955d22f7ba0bbad73fd
96d44b7943761f9726fda085f80e93c7e20c1818
b77911881702508e059781f62469631bf83baa26
3b895475e54f72239d85daaf4967567001038644
e2f0165cdfac453ca4cc0746164214186f834b6b
f49314d347a87ca7b4da0c46b5d2f6d3b32dfd8d
5dc6214387a29d9721e8172e070e9611356e2ac6
e32256cd6cb3a883d9fe4f596663f463f65166c8
668e7da2e17ec146375d2e90c97560b7566b184f
2505889d6ac7d852eb6d0d9bff157fd51ed8d290'''.split()


def tree(repo, ref):
    result = {}
    for row in n.git('ls-tree', '-r', '-z', ref, cwd=repo).split(b'\0'):
        if row:
            info, name = row.split(b'\t', 1)
            mode, kind, oid = info.decode().split()
            assert kind == 'blob', (ref, name)
            result[name.decode()] = oid
    return result


def live_objects(repo, paths):
    # Actual raw bytes, no attributes/clean filters; Git itself handles Windows
    # long paths. JSON quoting preserves spaces and unusual path characters.
    names = list(paths)
    data = ''.join(json.dumps(name, ensure_ascii=False) + '\n' for name in names).encode()
    proc = subprocess.run(['git', '-c', 'core.longpaths=true', 'hash-object', '--no-filters', '--stdin-paths'],
                          cwd=repo, input=data, capture_output=True)
    assert proc.returncode == 0, proc.stderr.decode(errors='replace')
    values = proc.stdout.decode().splitlines()
    assert len(values) == len(names)
    return dict(zip(names, values))


def bound_json(label, digest):
    path = n.OUT / (label + '.json')
    data = path.read_bytes()
    assert n.sha(data) == digest, label
    return json.loads(data)


def baseline():
    assert n.git('rev-parse', 'HEAD').decode().strip() == PIN
    assert n.git('rev-parse', 'HEAD', cwd=n.LESSONS).decode().strip() == LIN
    assert not n.git('status', '--porcelain', cwd=n.LESSONS).strip()
    pold, lold = tree(ROOT, PBASE), tree(n.LESSONS, LBASE)
    pnow, lnow = tree(ROOT, PIN), tree(n.LESSONS, LIN)
    plive, llive = live_objects(ROOT, pnow), live_objects(n.LESSONS, lnow)
    assert plive == pnow and llive == lnow
    assert set(pold) <= set(pnow) and set(lold) == set(lnow)
    pdelta = [name for name, oid in pold.items() if pnow[name] != oid]
    assert set(pdelta) == {'build-scripts/content/book-2/223/' + name for name in
                         ['theory.md', 'exercises.md', 'test_successor.py']}
    ldelta = [name for name, oid in lold.items() if lnow[name] != oid]
    expected_l = [f'{B.STEM} – {kind}.{ext}' for kind in ['paragraaf', 'opgaven'] for ext in ['md','html','zip']]
    expected_l += ['2.2.3-review.md', '2.2.3-quality-ref.yaml']
    assert set(ldelta) == {(B.LESSON_REL / name).as_posix() for name in expected_l}
    records = {}
    for commit in COMMITS:
        for raw in n.git('diff-tree', '--no-commit-id', '--no-renames', '--name-only', '-r', '-z', commit).split(b'\0'):
            if raw:
                records[raw.decode()] = commit
    imported = []
    for name, commit in records.items():
        data = n.blob(commit, name)
        actual = (ROOT / name).read_bytes()
        assert actual == data and pnow[name] == n.git('rev-parse', f'{commit}:{name}').decode().strip()
        imported.append({'path':name,'source_commit':commit,'git_blob':pnow[name],'raw_sha256':n.sha(data)})
    files = n.folder()
    assert len(files) == 25 and '2.2.3-textbook-handoff.md' not in files
    for name, digest in files.items():
        assert digest == n.sha(n.blob(LCANDIDATE, (B.LESSON_REL / name).as_posix(), n.LESSONS))
    assert files['2.2.3-review.md'] == REVIEW and files['2.2.3-quality-ref.yaml'] == QC
    history = {}
    for kind in n.KINDS:
        paths = list((n.OUT / 'BOOK2-TEXTBOOK-PRODUCTION-1-223-QC-RENEWAL-evidence').glob(f'223-{kind}-*-r25'))
        assert len(paths) == 1
        history[kind] = paths[0].relative_to(ROOT).as_posix()
    n.save('baseline', {'pass':True,'platform_before':PBASE,'lesson_before':LBASE,
        'platform_imported':PIN,'lesson_imported':LIN,'source_candidate_lesson':LCANDIDATE,
        'imports':imported,'whole_preexisting_platform_blobs':pold,'whole_preexisting_lesson_blobs':lold,
        'current_platform_blobs':pnow,'current_lesson_blobs':lnow,'allowed_old_platform_delta':pdelta,
        'allowed_old_lesson_delta':ldelta,'paragraph_files':files,'native_files':a.native_names(),
        'history':history,'source_binding':r.custody(),'attributed_source_gate':a.source_binding(),
        'root_new_personal_views':0,'root_acceptance':'PENDING'})


def evidence():
    inspection = bound_json('BOOK2-TEXTBOOK-PRODUCTION-1-223-QC-RENEWAL-personal-inspection',
        'f986311af79081ddbb3edf68032958a0d4fd03af4f2470d89ea43bd58cf1b0b5')
    assert inspection['actor'] == 'paragraph_214_builder'
    assert len(inspection['pages']) == 32 and len(inspection['figures']) == 4
    for rec in inspection['pages']:
        assert rec['observation'] and rec['fresh_personal_color_view'] and rec['fresh_personal_gray_view']
        for prefix in ['color','gray']:
            assert n.sha((ROOT / rec[prefix + '_path']).read_bytes()) == rec[prefix + '_sha256']
    for rec in inspection['figures']:
        assert rec['observation'] and rec['fresh_personal_color_view'] and rec['fresh_personal_gray_view']
        assert n.sha((n.LONG / rec['lesson_path']).read_bytes()) == rec['color_sha256']
        assert n.sha((ROOT / rec['gray_path']).read_bytes()) == rec['gray_sha256']
    paragraph = bound_json('BOOK2-TEXTBOOK-PRODUCTION-1-223-ALT-REVIEW-personal-inspection',
        'fd688a004dcb7e4e939205122a5726f4517ed873589cc18296a35f6ac4b23c42')
    assert paragraph['actor'] == 'paragraph_224_builder'
    assert len(paragraph['pages']) == 32 and len(paragraph['figures']) == 4
    for rec in paragraph['pages']:
        for key in ['color','grayscale']:
            view = rec[key]
            assert view['personal_observation']
            assert n.sha((ROOT / view['path']).read_bytes()) == view['raw_sha256']
    for rec in paragraph['figures']:
        assert rec['color_personal_observation'] and rec['grayscale']['personal_observation']
        assert n.sha((n.DEST / f"_assets/2.2.3_fig_{rec['number']}.png").read_bytes()) == rec['png_sha256']
        assert n.sha((ROOT / rec['grayscale']['path']).read_bytes()) == rec['grayscale']['raw_sha256']
    mathematics = bound_json('BOOK2-TEXTBOOK-PRODUCTION-1-223-QC-RENEWAL-independent-mathematics',
        '3419a88c5e4241cc3ef8e4fb0947f895ade2dbf4fdf2f367a8c7eefccd66cd9a')
    assert mathematics['pass'] and mathematics['total_points'] == 16
    from fractions import Fraction as F
    assert (100-2*10+F(1,2)*20+F(1,100)*30000,
            100-2*10+F(1,2)*20+F(1,100)*33000,
            100-2*10+F(1,2)*24+F(1,100)*30000) == (390,420,392)
    assert F(420-390,390)/F(33000-30000,30000) == F(10,13)
    assert (F(8,5),F(-3,5),F(4,10),F(-6,10)) == (F(8,5),F(-3,5),F(2,5),F(-3,5))
    successor = q.exact_review_successor()
    metadata = [a.metadata_delta(kind) for kind in n.KINDS]
    n.save('evidence-binding', {'pass':True,'specialist_actor':inspection['actor'],
        'paragraph_actor':paragraph['actor'],'distinct_attributed_views':144,'root_personal_views':0,
        'review_successor':successor,'current_QC_sha256':QC,'metadata':metadata,
        'target_arithmetic_root_recomputed':True,'specialist_full_math_bound':True})


def strict():
    assert n.folder() == n.read('baseline')['paragraph_files']
    r.custody()
    a.source_binding()


def reproduce(mode):
    strict()
    suffix = q.reserve(mode)
    assert int(suffix[1:]) > 27
    manifest = n.OUT / f'{PREFIX}-{mode}-manifest.json'
    assert not manifest.exists()
    if mode in ['full','thin']:
        # Keep entrypoint/__file__/Node cwd normal. Only the lesson-root data
        # argument uses the extended prefix, matching the specialist's argv.
        script = ROOT / n.GEN if mode == 'full' else n.LESSONS / B.LESSON_REL / 'build_pdf.py'
        q.command(mode + '-process', [q.PY,str(script),'--lesson-root',str(n.LONG),
            '--proof-root',str(n.PROOF),'--proof-suffix',suffix,'--manifest',str(manifest)])
    else:
        q.command('print-process', [q.PY,str(Path(__file__).resolve()),'print-inner'])
    strict()
    a.verify(mode)


def final():
    strict()
    base = n.read('baseline')
    logs = {'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.' + ext for ext in ['md','jsonl']}
    immutable = {name:oid for name,oid in base['current_platform_blobs'].items() if name not in logs}
    assert live_objects(ROOT, immutable) == immutable
    log_growth = []
    for name in sorted(logs):
        old, current = n.blob(PIN, name), (ROOT/name).read_bytes()
        assert current.startswith(old) and len(current) > len(old)
        log_growth.append({'path':name,'original_bytes':len(old),'current_bytes':len(current),
                           'original_prefix_byte_exact':True})
    assert live_objects(n.LESSONS, base['current_lesson_blobs']) == base['current_lesson_blobs']
    proofs = []
    for mode in ['full','thin','print']:
        recs = n.read(mode + '-parity')['documents']
        assert sum(len(rec['pages']) for rec in recs) == 32
        for rec in recs:
            directory = ROOT / rec['proof_directory']
            assert n.sha((directory/'manifest.json').read_bytes()) == rec['manifest_sha256']
            m = json.loads((directory/'manifest.json').read_bytes())
            assert m['inspection_status'] == 'PENDING' and m['pages_inspected'] == []
            for page in rec['pages']:
                assert n.sha((directory/'pages'/page['name']).read_bytes()) == page['raw_sha256']
            proofs.append({'path':rec['proof_directory'],'manifest_sha256':rec['manifest_sha256']})
    assert not n.git('status','--porcelain',cwd=n.LESSONS).strip()
    n.save('final-integrity', {'pass':True,'imports':len(base['imports']),
        'preserved_current_platform_files':len(immutable),'own_append_only_recorder_logs':log_growth,
        'preserved_current_lesson_files':len(base['current_lesson_blobs']),
        'native_files':20,'all_three_paths_raw_and_96_rendered_page_parity':True,
        'new_generation_proofs':proofs,'distinct_reviewers_views':144,'root_personal_views':0,
        'root_acceptance':'PENDING','handoff':'ABSENT','current_review_sha256':REVIEW,'current_QC_sha256':QC})


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=['baseline','evidence','tests','negatives','full','thin','print','print-inner','native','gates','final'])
    mode = parser.parse_args().mode
    if mode == 'baseline': baseline()
    elif mode == 'evidence': evidence()
    elif mode == 'tests': q.command('tests',[q.PY,'-m','unittest','discover','-s','build-scripts/content/book-2/223','-p','test_*.py','-v'])
    elif mode == 'negatives': r.negatives()
    elif mode in ['full','thin','print']: reproduce(mode)
    elif mode == 'print-inner': a.print_inner()
    elif mode == 'native':
        strict()
        q.command('native-process',[q.PY,'build-scripts/content/book-2/223/check_render.py','--lesson-root',str(n.LONG),
            '--manifest',str(n.OUT/f'{PREFIX}-full-manifest.json'),'--rebuild','--output',str(n.OUT/f'{PREFIX}-native-check.json')])
        strict()
    elif mode == 'gates': q.gates()
    else: final()
