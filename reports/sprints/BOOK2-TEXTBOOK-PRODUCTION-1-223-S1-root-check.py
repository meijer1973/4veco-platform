"""HOW TO ADAPT: create a new exact-payload checker, never broaden this record.

Root-owned import bindings and native reproduction. All new evidence is exclusive;
foreign helpers/proof are read only. No pupil source or acceptance edits.
"""
import argparse
from datetime import datetime, timezone
import hashlib
import io
import json
import os
from pathlib import Path, PurePosixPath
import re
import subprocess
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'reports/sprints'
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root'
PROOF = OUT / (PREFIX + '-evidence')
LESSONS = ROOT.parent / '4veco-lessen'
LONG = Path('\\\\?\\' + str(LESSONS)) if os.name == 'nt' else LESSONS
LROOT = '219a977e495abe43c17949e7d8996aab4176faa0'
LBASE = '25fbd9ba66f6ead59f512ec2eec1fd95159d834f'
LORIGINAL = 'b23e0056511fc5b9b10f0b8e6bbe130d2599c36b'
PBASE = '3510fc4dd30c9c01f44111ecc022ae239e855758'
COMMITS = ['85c09a88190330036bc9fe9ac488762d8a8bb61a', '652d9e2fc9d70d80758413051a198cbb18393ad4',
           '40d7019f6cb82ef47d15f28a8f8103a6b8c60cba', 'c3158633b0cf09e4d242c786245b587419a34436',
           '90a4568861e98d3f16711e3776004b9334536af2', '81db87b6da66d6c6a2211009c4062f7923902f9d']
sys.path.insert(0, str(ROOT / 'build-scripts/content/book-2'))
import b2_223 as builder
DEST = LONG / builder.LESSON_REL
KINDS, COUNTS, ZCOUNTS = ['paragraaf', 'opgaven', 'antwoorden'], [15, 10, 7], [11, 5, 3]
GEN = 'build-scripts/content/book-2/b2_223.py'
PAIRS = {
    '2.2.1-textbook-handoff.md': ('216e139a6297b59cfb8e62f43eb3a79eb16efc1861e5fc989ad15562a4deb24c', '3a3357f0f1487fcc8376e5c9717f80d181f2d71c6069f647c6fa7ab71377f811'),
    '2.2.1-review.md': ('24995a4d0e5d82327434be1dd94c789275728bdce840c6a7b5d63b59035258eb', '19bfa448b3c0f80732f2fa77617eb2772880747082fb683c8cd3852c74a96c63'),
    '2.2.1-quality-ref.yaml': ('b6f1b389d11c20665577414c17e5ae49962083812d9d1bf474d16231db749508', '4f0c77e9ae5769bb85c9c32dfa019049f6bccd323dfd0152b7eabf95897879fa'),
    '2.2.1 Prijselasticiteit – paragraaf.md': ('e7e4287645c26c3b79406a556c05a4c90dd10e10e3605b409b89a123df7fa281', 'ae61910c6306ff6af9d52a57db060083ca64facadc4424f1d4a96708d71974db'),
}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def git(*args, cwd=ROOT):
    return subprocess.check_output(['git', *args], cwd=cwd)


def blob(ref, name, cwd=ROOT):
    return git('show', f'{ref}:{name}', cwd=cwd)


def save(label, data):
    path = OUT / f'{PREFIX}-{label}.json'
    with path.open('x', encoding='utf-8', newline='\n') as stream:
        json.dump(data, stream, ensure_ascii=False, indent=2)
        stream.write('\n')
    print(f'{label}: {path.name} SHA256 {sha(path.read_bytes())}', flush=True)


def read(label):
    return json.loads((OUT / f'{PREFIX}-{label}.json').read_text(encoding='utf-8'))


def folder():
    return {p.relative_to(DEST).as_posix(): sha(p.read_bytes()) for p in sorted(DEST.rglob('*'))
            if p.is_file() and '__pycache__' not in p.parts}


def sources():
    expected = blob(PBASE, GEN)
    for name, (old, new) in PAIRS.items():
        before, after = (f'"{name}": "{v}"'.encode() for v in (old, new))
        assert expected.count(before) == 1 and after not in expected
        expected = expected.replace(before, after, 1)
    assert expected == (ROOT / GEN).read_bytes()
    assert sha(expected) == '5b18047a04ecd093a6d469fe5d69c049351f9c5ed21c3ad1b2aa336107d9f57c'
    rows = {GEN: sha(expected)}
    for name in ['print_pipeline.py', '223/check_render.py', '223/test_source.py',
                 '223/theory.md', '223/exercises.md', '223/answers.md', '223/target-answers.md']:
        rel = 'build-scripts/content/book-2/' + name
        assert (ROOT / rel).read_bytes() == blob(PBASE, rel)
        rows[rel] = sha((ROOT / rel).read_bytes())
    inputs = {}
    for name, (_, value) in PAIRS.items():
        p = DEST.parent / '2.2.1 Prijselasticiteit' / name
        rel = p.relative_to(LONG).as_posix()
        assert p.read_bytes() == blob('6ccc48911a6239dee25cffb8f29e9f42db442f9e', rel, LESSONS)
        assert builder.lf_hash(p) == sha(p.read_bytes()) == value
        inputs[rel] = value
    assert builder.PRIOR_PINS == {n: v[1] for n, v in PAIRS.items()}
    assert builder.lf_hash(DEST / '2.2.3-textbook-plan.md') == builder.PLAN_HASH
    assert builder.lf_hash(DEST.parent / '_chapter-plan.md') == builder.CHAPTER_HASH
    builder.target_record()
    return {'source_sha256': rows, 'accepted221_raw_and_lf': inputs}


def baseline():
    records = {}
    for commit in COMMITS:
        for raw in git('diff-tree', '--no-commit-id', '--no-renames', '--name-only', '-r', '-z', commit).split(b'\0'):
            if raw:
                records[raw.decode()] = commit
    imported = []
    for rel, commit in sorted(records.items()):
        original = blob(commit, rel)
        assert (ROOT / rel).read_bytes() == original, rel
        imported.append({'path': rel, 'commit': commit, 'git_blob': git('rev-parse', f'{commit}:{rel}').decode().strip(),
                         'sha256': sha(original)})
    actual = folder()
    assert len(actual) == 25 and '2.2.3-textbook-handoff.md' not in actual
    assert git('rev-parse', 'HEAD', cwd=LESSONS).decode().strip() == LROOT
    assert not git('status', '--porcelain', cwd=LESSONS).strip()
    for name, value in actual.items():
        rel = (builder.LESSON_REL / name).as_posix()
        assert value == sha(blob(LBASE, rel, LESSONS)) == sha(blob(LROOT, rel, LESSONS))
    native = [f'{builder.STEM} – {kind}.{ext}' for kind in KINDS for ext in ['md', 'html', 'pdf', 'zip']]
    native += [f'_assets/2.2.3_fig_{n}.{ext}' for n in range(1, 5) for ext in ['svg', 'png']]
    assert len(native) == 20
    for name in native:
        assert actual[name] == sha(blob(LORIGINAL, (builder.LESSON_REL / name).as_posix(), LESSONS))
    history = {}
    for kind, count in zip(KINDS, COUNTS):
        paths = list((ROOT / 'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1').glob(f'223-{kind}-*-r3'))
        assert len(paths) == 1
        path = paths[0]
        manifest = json.loads((path / 'manifest.json').read_text(encoding='utf-8'))
        assert manifest['inspection_status'] == 'PENDING' and manifest['pages_inspected'] == []
        assert len(manifest['page_sha256']) == count
        for name, value in manifest['page_sha256'].items():
            assert sha((path / 'pages' / name).read_bytes()) == value
        history[kind] = {'directory': path.relative_to(ROOT).as_posix(), 'manifest_sha256': sha((path / 'manifest.json').read_bytes()),
                         'pages': manifest['page_sha256']}
    pages = 0
    for path in [ROOT / rec['path'] for rec in imported if rec['path'].endswith('/manifest.json')]:
        m = json.loads(path.read_text(encoding='utf-8'))
        assert m['inspection_status'] == 'PENDING' and m['pages_inspected'] == []
        kind = next(k for k in KINDS if path.parent.name.startswith('223-' + k + '-'))
        assert m['page_sha256'] == history[kind]['pages']
        for name, value in m['page_sha256'].items():
            assert sha((path.parent / 'pages' / name).read_bytes()) == value
            pages += 1
    assert pages == 192
    reviewprefix = 'BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-REVIEW'
    probes = json.loads((OUT / f'{reviewprefix}-independent-negative-probes.json').read_text(encoding='utf-8'))
    assert probes['pass'] and probes['valid_reaches_authority'] and len(probes['tests']) == 12
    assert all(r['real_lf_hash_preserved'] and r['side_effect_calls'] == 0 for r in probes['tests'])
    inspection = json.loads((OUT / f'{reviewprefix}-inspection.json').read_text(encoding='utf-8'))
    assert len(inspection['pages']) == 3 and len(inspection['figures']) == 4
    for rec in inspection['pages']:
        assert rec['sha256'] == history[rec['kind']]['pages'][f"page-{rec['page']:03}.png"] and rec['observation']
    for rec in inspection['figures']:
        assert rec['sha256'] == actual[rec['path']] and rec['observation']
    old = json.loads((OUT / 'BOOK2-TEXTBOOK-PRODUCTION-1-223-REVIEW-inspection.json').read_text(encoding='utf-8'))
    assert sum(len(r['pages']) for r in old['documents']) == 32
    for rec in old['documents']:
        for page in rec['pages']:
            assert page['reviewer_observation'] and page['sha256'] == history[rec['kind']]['pages'][Path(page['path']).name]
    failed = json.loads((OUT / 'BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-thin-process.json').read_text(encoding='utf-8'))
    assert failed['exit_code'] != 0 and 'EISDIR' in failed['stderr']
    save('baseline', {'pass': True, 'platform_head': git('rev-parse', 'HEAD').decode().strip(), 'lessons': LROOT,
                     'imports': imported, 'source_binding': sources(), 'paragraph_files': actual, 'native_files': native,
                     'history': history, 'imported_pending_pages': pages, 'independent_real_hash_probes': 12,
                     'original_personal_pages': 32, 'delta_personal_pages': 3, 'delta_personal_figures': 4,
                     'root_new_personal_views': 0, 'specialist_qc': 'PENDING', 'root_acceptance': 'PENDING'})


def command(label, argv, *, expected=0):
    env = dict(os.environ)
    env['PATH'] = 'C:/msys64/mingw64/bin' + os.pathsep + env['PATH']
    started = datetime.now(timezone.utc).isoformat()
    proc = subprocess.run(argv, cwd=ROOT, env=env, capture_output=True, encoding='utf-8', errors='replace')
    record = {'command': argv, 'cwd': str(ROOT), 'started': started, 'ended': datetime.now(timezone.utc).isoformat(),
              'path_first': env['PATH'].split(os.pathsep)[0], 'exit_code': proc.returncode,
              'stdout': proc.stdout, 'stderr': proc.stderr, 'expected_exit': expected}
    save(label, record)
    assert proc.returncode == expected, f'{label} exit {proc.returncode}; complete diagnostics retained'
    return proc.stdout


def reserve(mode):
    seen, locations = set(), []
    roots = [Path(s[9:]) for s in git('worktree', 'list', '--porcelain').decode().splitlines() if s.startswith('worktree ')]
    for root in roots:
        for base in [root / 'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1', root / 'reports/sprints']:
            if not base.exists():
                continue
            candidates = list(base.glob('223-*-r*'))
            if base.name == 'sprints':
                for d in base.glob('*223*evidence'):
                    if d.is_dir():
                        candidates += list(d.glob('223-*-r*'))
                for p in base.glob('*223*reservation*.json'):
                    data = json.loads(p.read_text(encoding='utf-8-sig'))
                    suffix = str(data.get('suffix', ''))
                    if re.fullmatch(r'r[1-9][0-9]*', suffix):
                        seen.add(int(suffix[1:]))
                        locations.append(str(p))
            for p in candidates:
                match = re.search(r'-r(\d+)$', p.name)
                if match:
                    seen.add(int(match[1]))
                    locations.append(str(p))
    assert max(seen) >= 10
    suffix = f'r{max(seen) + 1}'
    save(mode + '-reservation', {'suffix': suffix, 'used': sorted(seen), 'registered_worktrees': len(roots),
                                 'observed_locations': sorted(set(locations)), 'proof_root': str(PROOF)})
    return suffix


def parity(mode, manifest):
    from PIL import Image
    original = read('baseline')
    assert folder() == original['paragraph_files']
    rows = []
    for kind, count, zcount, rec in zip(KINDS, COUNTS, ZCOUNTS, manifest['documents']):
        pdf = DEST / f'{builder.STEM} – {kind}.pdf'
        assert sha(pdf.read_bytes()) == rec['pdf_sha256'] == original['paragraph_files'][pdf.name]
        with zipfile.ZipFile(pdf.with_suffix('.zip')) as archive:
            names = archive.namelist()
            assert len(names) == len(set(names)) == zcount and archive.testzip() is None
            for name in names:
                posix = PurePosixPath(name)
                assert not posix.is_absolute() and '..' not in posix.parts and ':' not in name and '\\' not in name
                assert archive.read(name) == (DEST / name).read_bytes()
        directory = Path(rec['proof_directory'])
        olddir = ROOT / original['history'][kind]['directory']
        proof = json.loads((directory / 'manifest.json').read_text(encoding='utf-8'))
        assert proof['inspection_status'] == 'PENDING' and proof['pages_inspected'] == []
        assert proof['page_sha256'] == original['history'][kind]['pages'] and len(proof['page_sha256']) == count
        pages = []
        for name, value in proof['page_sha256'].items():
            assert sha((directory / 'pages' / name).read_bytes()) == value
            with Image.open(directory / 'pages' / name) as current, Image.open(olddir / 'pages' / name) as old:
                assert current.mode == old.mode and current.size == old.size and current.tobytes() == old.tobytes()
                pages.append({'name': name, 'raw_sha256': value, 'pixels_sha256': sha(current.tobytes()), 'size': current.size})
        rows.append({'kind': kind, 'pdf_sha256': rec['pdf_sha256'], 'zip_members': names,
                     'directory': directory.relative_to(ROOT).as_posix(), 'manifest_sha256': sha((directory / 'manifest.json').read_bytes()),
                     'pages': pages})
    assets = {}
    for n in range(1, 5):
        name = f'_assets/2.2.3_fig_{n}.png'
        with Image.open(DEST / name) as current, Image.open(io.BytesIO(blob(LORIGINAL, (builder.LESSON_REL / name).as_posix(), LESSONS))) as old:
            assert current.mode == old.mode and current.size == old.size and current.tobytes() == old.tobytes()
            assets[name] = {'raw_sha256': sha((DEST / name).read_bytes()), 'pixels_sha256': sha(current.tobytes())}
    save(mode + '-parity', {'pass': True, 'native_files': 20, 'whole_paragraph_files': 25, 'pages': 32,
                           'documents': rows, 'figures': assets, 'personal_inspection': 'NOT_INFERRED'})


def reproduce(mode):
    sources()
    assert folder() == read('baseline')['paragraph_files']
    suffix = reserve(mode)
    manifest = OUT / f'{PREFIX}-{mode}-manifest.json'
    assert not manifest.exists()
    if mode in ['full', 'thin']:
        script = ROOT / GEN if mode == 'full' else LESSONS / builder.LESSON_REL / 'build_pdf.py'
        command(mode + '-process', [sys.executable, str(script), '--lesson-root', str(LONG),
                                   '--proof-root', str(PROOF), '--proof-suffix', suffix, '--manifest', str(manifest)])
        result = json.loads(manifest.read_text(encoding='utf-8'))
    else:
        os.environ['PATH'] = 'C:/msys64/mingw64/bin' + os.pathsep + os.environ['PATH']
        result = {'inspection_status': 'PENDING', 'documents': []}
        for kind in KINDS:
            rec = builder.build_document(DEST / f'{builder.STEM} – {kind}.md')
            builder.zip_document(rec)
            directory = PROOF / f"223-{kind}-{rec['pdf_sha256'][:12]}-{suffix}"
            assert not directory.exists()
            builder.render_proof(rec, directory)
            rec['proof_directory'] = str(directory)
            result['documents'].append(rec)
        save('print-manifest', result)
    parity(mode, result)


def gates():
    for profile in ['student-web', 'publisher-print']:
        command(profile, ['node', 'scripts/validate-paragraph.js', '--mode', 'part-a', '--profile', profile, str(DEST)])
    command('currentness', ['node', 'build-scripts/workflows/check-book-outline-currentness.js', '--require-approved', '--action', 'paragraph_production', '--paragraph', '2.2.3'])
    command('durable', ['node', 'build-scripts/workflows/check-book2-target-authority-remediation.js', '--durable'])
    command('bundle', ['node', 'build-scripts/sprints/check-sprint-bundle.js', 'BOOK2-TEXTBOOK-PRODUCTION-1'])


def integrity():
    original = read('baseline')
    assert folder() == original['paragraph_files']
    assert sources() == original['source_binding']
    for rec in original['imports']:
        assert sha((ROOT / rec['path']).read_bytes()) == rec['sha256'], rec['path']
    for kind, rec in original['history'].items():
        assert sha((ROOT / rec['directory'] / 'manifest.json').read_bytes()) == rec['manifest_sha256']
    for mode in ['full', 'thin', 'print']:
        for rec in read(mode + '-parity')['documents']:
            assert sha((ROOT / rec['directory'] / 'manifest.json').read_bytes()) == rec['manifest_sha256']
            for page in rec['pages']:
                assert sha((ROOT / rec['directory'] / 'pages' / page['name']).read_bytes()) == page['raw_sha256']
    assert not git('status', '--porcelain', cwd=LESSONS).strip()
    save('final-integrity', {'pass': True, 'imported_files': len(original['imports']), 'all25_lesson_files_exact': True,
                             'all_imported_and_old_and_new_proof_exact': True, 'root_acceptance': 'PENDING',
                             'specialist_qc': 'PENDING', 'handoff': 'ABSENT'})


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=['baseline', 'tests', 'full', 'thin', 'print', 'native', 'gates', 'integrity'])
    mode = parser.parse_args().mode
    if mode == 'baseline':
        baseline()
    elif mode == 'tests':
        command('tests', [sys.executable, '-m', 'unittest', 'discover', '-s', 'build-scripts/content/book-2/223', '-p', 'test_*.py', '-v'])
    elif mode in ['full', 'thin', 'print']:
        reproduce(mode)
    elif mode == 'native':
        command('native-process', [sys.executable, 'build-scripts/content/book-2/223/check_render.py', '--lesson-root', str(LONG),
                                  '--manifest', str(OUT / f'{PREFIX}-full-manifest.json'), '--rebuild',
                                  '--output', str(OUT / f'{PREFIX}-native-check.json')])
    elif mode == 'gates':
        gates()
    else:
        integrity()
