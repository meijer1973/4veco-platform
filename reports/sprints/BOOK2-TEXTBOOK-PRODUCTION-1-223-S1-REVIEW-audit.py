"""HOW TO ADAPT: independent fixed-payload review; never broaden its exact pins.

Reviewer-only source/evidence auditor and native reproduction driver. All output
is exclusive under this review prefix. No canonical source or decision writes.
"""
import argparse
from contextlib import ExitStack
import hashlib
import io
import json
import os
from pathlib import Path, PurePosixPath
import re
import subprocess
import sys
from unittest.mock import patch
import zipfile

ROOT = Path(__file__).resolve().parents[2]
PBASE = '3510fc4dd30c9c01f44111ecc022ae239e855758'
PREVIEW = '51c2f5132a2dd964490ddec89b6e926d90240dbd'
LBASE = '25fbd9ba66f6ead59f512ec2eec1fd95159d834f'
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-REVIEW'
OUT = ROOT / 'reports/sprints'
PROOF = OUT / (PREFIX + '-evidence')
LESSONS = ROOT.parent / '4veco-lessen'
LONG_LESSONS = Path('\\\\?\\' + str(LESSONS)) if os.name == 'nt' else LESSONS
sys.path.insert(0, str(ROOT / 'build-scripts/content/book-2'))
import b2_223 as builder
DEST = LONG_LESSONS / builder.LESSON_REL
KINDS = ['paragraaf', 'opgaven', 'antwoorden']
COUNTS = [15, 10, 7]
ZCOUNTS = [11, 5, 3]
GENERATOR = 'build-scripts/content/book-2/b2_223.py'
PAIRS = {
    '2.2.1-textbook-handoff.md': ('216e139a6297b59cfb8e62f43eb3a79eb16efc1861e5fc989ad15562a4deb24c', '3a3357f0f1487fcc8376e5c9717f80d181f2d71c6069f647c6fa7ab71377f811'),
    '2.2.1-review.md': ('24995a4d0e5d82327434be1dd94c789275728bdce840c6a7b5d63b59035258eb', '19bfa448b3c0f80732f2fa77617eb2772880747082fb683c8cd3852c74a96c63'),
    '2.2.1-quality-ref.yaml': ('b6f1b389d11c20665577414c17e5ae49962083812d9d1bf474d16231db749508', '4f0c77e9ae5769bb85c9c32dfa019049f6bccd323dfd0152b7eabf95897879fa'),
    '2.2.1 Prijselasticiteit – paragraaf.md': ('e7e4287645c26c3b79406a556c05a4c90dd10e10e3605b409b89a123df7fa281', 'ae61910c6306ff6af9d52a57db060083ca64facadc4424f1d4a96708d71974db'),
}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def blob(root, ref, name):
    return subprocess.check_output(['git', 'show', f'{ref}:{name}'], cwd=root)


def save(label, obj):
    path = OUT / f'{PREFIX}-{label}.json'
    with path.open('x', encoding='utf-8', newline='\n') as stream:
        json.dump(obj, stream, ensure_ascii=False, indent=2)
        stream.write('\n')
    return path


def read(label):
    return json.loads((OUT / f'{PREFIX}-{label}.json').read_text(encoding='utf-8'))


def inventory():
    return {p.relative_to(DEST).as_posix(): sha(p.read_bytes()) for p in sorted(DEST.rglob('*'))
            if p.is_file() and '__pycache__' not in p.parts}


def exact_generator():
    expected = blob(ROOT, PBASE, GENERATOR)
    for name, (old, new) in PAIRS.items():
        before, after = (f'"{name}": "{value}"'.encode() for value in (old, new))
        assert expected.count(before) == 1 and after not in expected
        expected = expected.replace(before, after, 1)
    assert (ROOT / GENERATOR).read_bytes() == expected
    assert sha(expected) == '5b18047a04ecd093a6d469fe5d69c049351f9c5ed21c3ad1b2aa336107d9f57c'
    return sha(expected)


def inputs():
    return [(DEST / '2.2.3-textbook-plan.md', builder.PLAN_HASH),
            (DEST.parent / '_chapter-plan.md', builder.CHAPTER_HASH),
            *[(DEST.parent / '2.2.1 Prijselasticiteit' / n, p[1]) for n, p in PAIRS.items()]]


def check_source():
    result = {'generator': exact_generator(), 'unchanged_platform_files': {}, 'inputs': {}}
    for name in ['print_pipeline.py', '223/check_render.py', '223/test_source.py',
                 '223/theory.md', '223/exercises.md', '223/answers.md', '223/target-answers.md']:
        rel = 'build-scripts/content/book-2/' + name
        actual = (ROOT / rel).read_bytes()
        assert actual == blob(ROOT, PBASE, rel)
        result['unchanged_platform_files'][rel] = sha(actual)
    for path, value in inputs():
        rel = path.relative_to(LONG_LESSONS).as_posix()
        actual = path.read_bytes()
        assert actual == blob(LESSONS, LBASE, rel)
        assert builder.lf_hash(path) == value
        result['inputs'][rel] = {'raw': sha(actual), 'canonical_lf': value}
    assert builder.PRIOR_PINS == {n: pair[1] for n, pair in PAIRS.items()}
    return result


def baseline():
    result = check_source()
    files = inventory()
    for name, value in files.items():
        assert value == sha(blob(LESSONS, LBASE, (builder.LESSON_REL / name).as_posix()))
    assert len(files) == 25
    assert files['2.2.3-review.md'] == '793c8460e7d20e8a2e40d7e8912c969c94a091e67fa25566c812264c8769539e'
    assert files['2.2.3-quality-ref.yaml'] == '72b046c30f128448baf0b8794a538951e9c2105be1b62afee5be9cda3e4b1a77'
    assert '2.2.3-textbook-handoff.md' not in files
    native = [f'{builder.STEM} – {kind}.{ext}' for kind in KINDS for ext in ['md', 'html', 'pdf', 'zip']]
    native += [f'_assets/2.2.3_fig_{n}.{ext}' for n in range(1, 5) for ext in ['svg', 'png']]
    assert len(native) == 20 and set(native).issubset(files)
    result.update(platform_reviewed=PREVIEW, platform_original=PBASE, lessons=LBASE,
                  paragraph_inventory=files, native_files=native, historical={}, builder_evidence={})
    for kind, count in zip(KINDS, COUNTS):
        dirs = list((ROOT / 'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1').glob(f'223-{kind}-*-r3'))
        assert len(dirs) == 1
        directory = dirs[0]
        manifest = json.loads((directory / 'manifest.json').read_text(encoding='utf-8'))
        assert manifest['inspection_status'] == 'PENDING' and manifest['pages_inspected'] == []
        assert len(manifest['page_sha256']) == count
        for name, value in manifest['page_sha256'].items():
            assert sha((directory / 'pages' / name).read_bytes()) == value
        result['historical'][kind] = {'directory': directory.relative_to(ROOT).as_posix(),
                                     'manifest_sha256': sha((directory / 'manifest.json').read_bytes()),
                                     'page_sha256': manifest['page_sha256']}
    # Bind complete published S1 evidence without executing its hardcoded helpers.
    for path in sorted(OUT.glob('BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-*')):
        if path.is_file() and not path.name.startswith(PREFIX):
            rel = path.relative_to(ROOT).as_posix()
            assert path.read_bytes() == blob(ROOT, PREVIEW, rel)
            result['builder_evidence'][rel] = sha(path.read_bytes())
    for mode in ['full', 'thin-retry', 'print']:
        old = json.loads((OUT / f'BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-{mode}-manifest.json').read_text(encoding='utf-8'))
        for kind, doc in zip(KINDS, old['documents']):
            folder = ROOT / 'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1' / Path(doc['proof_directory']).name
            m = json.loads((folder / 'manifest.json').read_text(encoding='utf-8'))
            assert m['page_sha256'] == result['historical'][kind]['page_sha256']
            for name, value in m['page_sha256'].items():
                assert sha((folder / 'pages' / name).read_bytes()) == value
            result['builder_evidence'][str(folder.relative_to(ROOT) / 'manifest.json').replace('\\', '/')] = sha((folder / 'manifest.json').read_bytes())
    failed = json.loads((OUT / 'BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-thin-process.json').read_text(encoding='utf-8'))
    assert failed['exit_code'] != 0 and 'EISDIR' in failed['stderr']
    result['historical_thin_failure_preserved'] = failed['exit_code']
    result['pass'] = True
    save('baseline', result)
    print('PASS immutable baseline: four substitutions; 25 lesson files; all published S1 source/proof bindings')


def negatives():
    check_source()
    results = []
    real_read = Path.read_text
    for target, expected in inputs():
        for mode in ['altered', 'missing']:
            reads = []
            def fixture(path, *args, **kwargs):
                reads.append(str(path))
                if path == target:
                    if mode == 'missing':
                        raise FileNotFoundError('Independent isolated fixture')
                    return real_read(path, *args, **kwargs) + '\nINDEPENDENT WRONG INPUT'
                return real_read(path, *args, **kwargs)
            with ExitStack() as stack:
                stack.enter_context(patch.object(Path, 'read_text', fixture))
                effects = {f'{getattr(obj, "__name__", "builder")}.{attr}': stack.enter_context(patch.object(obj, attr))
                           for obj, attr in [(subprocess, 'run'), (Path, 'mkdir'), (Path, 'write_text'),
                                             (Path, 'write_bytes'), (builder, 'asset_sources'), (builder, 'documents'),
                                             (builder, 'build_document'), (builder, 'zip_document'), (builder, 'render_proof')]}
                try:
                    builder.build(LONG_LESSONS)
                except (ValueError, FileNotFoundError) as error:
                    assert isinstance(error, FileNotFoundError if mode == 'missing' else ValueError)
                    assert str(target) in reads
                    for effect in effects.values():
                        effect.assert_not_called()
                    results.append({'input': str(target), 'mode': mode, 'error': type(error).__name__,
                                    'real_lf_hash_preserved': True, 'read_order': reads, 'side_effect_calls': 0})
                else:
                    raise AssertionError('Invalid fixture passed')
    assert len(results) == 12
    class Reached(Exception):
        pass
    with patch.object(subprocess, 'run', side_effect=Reached) as proc, patch.object(Path, 'mkdir') as mkdir:
        try:
            builder.build(LONG_LESSONS)
        except Reached:
            assert proc.call_count == 1
            assert proc.call_args.args[0][1] == 'build-scripts/workflows/check-book-outline-currentness.js'
            mkdir.assert_not_called()
        else:
            raise AssertionError('Valid inputs never reached authority')
    save('independent-negative-probes', {'pass': True, 'tests': results, 'valid_reaches_authority': True})
    print('PASS 12 real-hash wrong/missing fixtures stop before effects; valid input reaches authority')


def command(label, argv):
    from datetime import datetime, timezone
    start = datetime.now(timezone.utc).isoformat()
    completed = subprocess.run(argv, cwd=ROOT, capture_output=True, encoding='utf-8', errors='replace')
    result = {'command': argv, 'cwd': str(ROOT), 'start': start,
              'end': datetime.now(timezone.utc).isoformat(), 'path_first': os.environ['PATH'].split(os.pathsep)[0],
              'python': sys.executable, 'exit_code': completed.returncode,
              'stdout': completed.stdout, 'stderr': completed.stderr}
    save(label, result)
    print(f'{label}: exit {completed.returncode}')
    if completed.returncode:
        raise RuntimeError(f'{label} failed; full diagnostics retained')
    return result


def reserve(mode):
    roots = [Path(s[9:]) for s in subprocess.check_output(['git', 'worktree', 'list', '--porcelain'], cwd=ROOT).decode().splitlines()
             if s.startswith('worktree ')]
    seen = set()
    for root in roots:
        native = root / 'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1'
        if native.exists():
            for path in native.glob('223-*-r*'):
                m = re.search(r'-r(\d+)$', path.name)
                if m:
                    seen.add(int(m[1]))
        reports = root / 'reports/sprints'
        if reports.exists():
            for path in reports.glob('*223*reservation*.json'):
                data = json.loads(path.read_text(encoding='utf-8-sig'))
                if re.fullmatch(r'r[1-9][0-9]*', str(data.get('suffix', ''))):
                    seen.add(int(data['suffix'][1:]))
            for directory in reports.glob('*223*evidence'):
                for path in directory.glob('223-*-r*'):
                    m = re.search(r'-r(\d+)$', path.name)
                    if m:
                        seen.add(int(m[1]))
    suffix = f'r{max(seen, default=0) + 1}'
    save(mode + '-reservation', {'suffix': suffix, 'registered_worktrees': len(roots), 'used_revisions': sorted(seen),
                                 'proof_root': str(PROOF), 'exclusive': True})
    return suffix


def parity(mode, manifest):
    from PIL import Image
    before = read('baseline')
    assert inventory() == before['paragraph_inventory']
    rows = []
    for kind, count, zcount, rec in zip(KINDS, COUNTS, ZCOUNTS, manifest['documents']):
        pdf = DEST / f'{builder.STEM} – {kind}.pdf'
        assert sha(pdf.read_bytes()) == rec['pdf_sha256'] == before['paragraph_inventory'][pdf.name]
        with zipfile.ZipFile(pdf.with_suffix('.zip')) as package:
            names = package.namelist()
            assert len(names) == len(set(names)) == zcount and package.testzip() is None
            for name in names:
                p = PurePosixPath(name)
                assert not p.is_absolute() and '..' not in p.parts and ':' not in name and '\\' not in name
                assert package.read(name) == (DEST / name).read_bytes()
        old = ROOT / before['historical'][kind]['directory']
        directory = Path(rec['proof_directory'])
        proof = json.loads((directory / 'manifest.json').read_text(encoding='utf-8'))
        assert proof['inspection_status'] == 'PENDING' and proof['pages_inspected'] == []
        assert proof['page_sha256'] == before['historical'][kind]['page_sha256'] and len(proof['page_sha256']) == count
        pages = {}
        for name, expected in proof['page_sha256'].items():
            current = directory / 'pages' / name
            assert sha(current.read_bytes()) == expected
            with Image.open(current) as new, Image.open(old / 'pages' / name) as previous:
                assert new.size == previous.size and new.mode == previous.mode and new.tobytes() == previous.tobytes()
                pages[name] = {'raw': expected, 'pixel': sha(new.tobytes()), 'size': new.size, 'mode': new.mode}
        rows.append({'kind': kind, 'pdf_sha256': rec['pdf_sha256'], 'zip_members': names,
                     'proof_directory': directory.relative_to(ROOT).as_posix(),
                     'manifest_sha256': sha((directory / 'manifest.json').read_bytes()), 'pages': pages})
    assets = {}
    for n in range(1, 5):
        name = f'_assets/2.2.3_fig_{n}.png'
        original = blob(LESSONS, LBASE, (builder.LESSON_REL / name).as_posix())
        with Image.open(DEST / name) as a, Image.open(io.BytesIO(original)) as b:
            assert a.size == b.size and a.mode == b.mode and a.tobytes() == b.tobytes()
            assets[name] = {'raw': sha(original), 'pixels': sha(a.tobytes()), 'size': a.size}
    save(mode + '-parity', {'pass': True, 'native_equal': 20, 'full_folder_equal': 25, 'page_count': 32,
                           'editions': rows, 'native_figures': assets, 'personal_inspection': 'SEPARATE'})
    print(f'PASS {mode}: 20 raw native files, 25 folder files, ZIP11/5/3, 32 page hashes/pixels and four figures')


def reproduce(mode):
    check_source()
    assert Path(sys.executable).resolve() == Path('C:/Python314/python.exe').resolve()
    assert os.environ['PATH'].split(os.pathsep)[0].replace('\\', '/').lower() == 'c:/msys64/mingw64/bin'
    assert inventory() == read('baseline')['paragraph_inventory']
    suffix = reserve(mode)
    manifest_path = OUT / f'{PREFIX}-{mode}-manifest.json'
    assert not manifest_path.exists()
    if mode in ['full', 'thin']:
        script = ROOT / GENERATOR if mode == 'full' else LESSONS / builder.LESSON_REL / 'build_pdf.py'
        command(mode + '-process', [sys.executable, str(script), '--lesson-root', str(LONG_LESSONS),
                                   '--proof-root', str(PROOF), '--proof-suffix', suffix, '--manifest', str(manifest_path)])
        manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    else:
        rows = []
        for kind in KINDS:
            rec = builder.build_document(DEST / f'{builder.STEM} – {kind}.md')
            builder.zip_document(rec)
            directory = PROOF / f"223-{kind}-{rec['pdf_sha256'][:12]}-{suffix}"
            assert not directory.exists()
            builder.render_proof(rec, directory)
            rec['proof_directory'] = str(directory)
            rows.append(rec)
        manifest = {'inspection_status': 'PENDING', 'documents': rows}
        save('print-manifest', manifest)
    parity(mode, manifest)


def gates():
    for profile in ['student-web', 'publisher-print']:
        command(profile, ['node', 'scripts/validate-paragraph.js', '--mode', 'part-a', '--profile', profile, str(DEST)])
    command('currentness', ['node', 'build-scripts/workflows/check-book-outline-currentness.js', '--require-approved',
                           '--action', 'paragraph_production', '--paragraph', '2.2.3'])
    command('durable', ['node', 'build-scripts/workflows/check-book2-target-authority-remediation.js', '--durable'])
    command('bundle', ['node', 'build-scripts/sprints/check-sprint-bundle.js', 'BOOK2-TEXTBOOK-PRODUCTION-1'])


def final_integrity():
    baseline = read('baseline')
    assert inventory() == baseline['paragraph_inventory']
    sources = check_source()
    assert sources['unchanged_platform_files'] == baseline['unchanged_platform_files']
    for rel, value in baseline['builder_evidence'].items():
        assert sha((ROOT / rel).read_bytes()) == value
    for kind, old in baseline['historical'].items():
        assert sha((ROOT / old['directory'] / 'manifest.json').read_bytes()) == old['manifest_sha256']
    for mode in ['full', 'thin', 'print']:
        data = read(mode + '-parity')
        for row in data['editions']:
            folder = ROOT / row['proof_directory']
            assert sha((folder / 'manifest.json').read_bytes()) == row['manifest_sha256']
            for name, hashes in row['pages'].items():
                assert sha((folder / 'pages' / name).read_bytes()) == hashes['raw']
    assert not (DEST / '2.2.3-textbook-handoff.md').exists()
    save('final-integrity', {'pass': True, '25_paragraph_files_unchanged': True,
                             'source_inputs': sources, 'all_original_and_fresh_proof_unchanged': True})
    print('PASS final integrity; canonical review/QC and absent handoff unchanged')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=['baseline', 'negatives', 'tests', 'full', 'thin', 'print', 'native', 'gates', 'integrity'])
    args = parser.parse_args()
    if args.mode == 'baseline':
        baseline()
    elif args.mode == 'negatives':
        negatives()
    elif args.mode == 'tests':
        command('tests', [sys.executable, '-m', 'unittest', 'discover', '-s', 'build-scripts/content/book-2/223', '-p', 'test_*.py', '-v'])
    elif args.mode in ['full', 'thin', 'print']:
        reproduce(args.mode)
    elif args.mode == 'native':
        command('native-process', [sys.executable, 'build-scripts/content/book-2/223/check_render.py', '--lesson-root', str(LONG_LESSONS),
                                  '--manifest', str(OUT / f'{PREFIX}-full-manifest.json'), '--rebuild',
                                  '--output', str(OUT / f'{PREFIX}-native-check.json')])
    elif args.mode == 'gates':
        gates()
    else:
        final_integrity()
