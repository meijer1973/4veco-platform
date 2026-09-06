"""HOW TO ADAPT: new root-owned exact-payload proof; never overwrite old evidence.

The current root consumes only imported reviewed changes. Native routes execute
in child processes with inherited PATH. This creates no acceptance or new content.
"""
from pathlib import Path, PurePosixPath
from datetime import datetime, timezone
import argparse
import hashlib
import io
import json
import os
import re
import subprocess
import sys
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[2]
LESSONS = ROOT.parent / '4veco-lessen'
OUT = ROOT / 'reports/sprints'
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-root'
E = OUT / (PREFIX + '-evidence')
OLD = OUT / 'BOOK2-TEXTBOOK-PRODUCTION-1-212-R7-REVIEW-evidence'
REVIEW = OUT / 'BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-REVIEW-evidence'
PBASE = '572d1ea2ededaffd28afc44eeeca223252a58ec5'
LBASE = 'd4e1910d60964ee4b9ac97eefbf0e0ed202fc28f'
LROOT = '219a977e495abe43c17949e7d8996aab4176faa0'
ACCEPTED = '5e14325d70b6cc6aee643d9b57395c92b0904ffb'
COMMITS = ['97e1e51be8d2e5cf6aec8c403693eb6b166dc709', '8fc9957a8118079888f0503bcd066aec820aa315',
           '04969d33875ab2265b5101647e3584985ae91b87', '58134bf128281a692ece3c4b437aa2b495ad131a',
           'df80dd0058cc4f0ffd5ec168389337f48894c6a1', 'fe81a71d4647b04a67e2eac4ae9bb678c06ddc76']
GEN = 'build-scripts/content/book-2/b2_212.py'
SRC = 'build-scripts/content/book-2/212/'
STEM = '2.1.2 Opbrengsten, winst en break-even'
REL = Path('Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten') / STEM
DEST = LESSONS / REL
KINDS, COUNTS, ZCOUNTS = ['paragraaf', 'opgaven', 'antwoorden'], [14, 7, 6], [19, 11, 9]
SWAPS = [
    ('PRIOR_REVIEW_HASH', '92b4a9462caf8316274fb58f8beef5c850147c44e6bf80b9a28fad442d9dbe96', 'a75755c7c2e6cdffb2defcbb5403814cf854d87bfae9a8172dd768aadb5b8023'),
    ('PRIOR_QUALITY_HASH', '0dddb6e9d8f3a8da0e0f31e67dafabf53b99feb6ad86ce72039480dd7e12ea18', 'c85c44a53d46af87ad61500b83b0fd721fac43c97ffd1be3d512308158a4b9f5')]


def h(data):
    return hashlib.sha256(data).hexdigest()


def raw(path):
    return h(path.read_bytes())


def git(*args, cwd=ROOT):
    return subprocess.check_output(['git', *args], cwd=cwd)


def blob(commit, name, cwd=ROOT):
    return git('show', f'{commit}:{name}', cwd=cwd)


def read(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))


def save(name, value):
    E.mkdir(exist_ok=True)
    p = E / name
    with p.open('x', encoding='utf-8', newline='\n') as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write('\n')
    print(f'{name}: SHA256 {raw(p)}', flush=True)


def folder():
    return {p.relative_to(DEST).as_posix(): raw(p) for p in sorted(DEST.rglob('*'))
            if p.is_file() and '__pycache__' not in p.parts}


def sources():
    expected = blob(PBASE, GEN)
    for name, old, new in SWAPS:
        a, b = (f'{name} = "{value}"'.encode() for value in (old, new))
        assert expected.count(a) == 1 and b not in expected
        expected = expected.replace(a, b, 1)
    assert (ROOT / GEN).read_bytes() == expected
    unchanged = {}
    for rel in [SRC + n for n in ('theory.md', 'exercises.md', 'answers.md', 'target-answers.md', 'test_source.py', 'test_bonus.py', 'check_render.py')] + ['build-scripts/content/book-2/print_pipeline.py']:
        assert (ROOT / rel).read_bytes() == blob(PBASE, rel), rel
        unchanged[rel] = raw(ROOT / rel)
    for name in ['test_metadata.py', 'test_succession.py']:
        assert (ROOT / SRC / name).read_bytes() == blob('8fc9957a8118079888f0503bcd066aec820aa315', SRC + name)
    inputs = {}
    for name, value in [('2.1.1-review.md', SWAPS[0][2]), ('2.1.1-quality-ref.yaml', SWAPS[1][2]),
                        ('2.1.1-textbook-handoff.md', '0d14506e314a11fef0637cc66cf29036f174b94cafbf7fa5ede2eff88937500f')]:
        p = DEST.parent / '2.1.1 Kostenstructuren' / name
        rel = p.relative_to(LESSONS).as_posix()
        assert p.read_bytes() == blob(ACCEPTED, rel, LESSONS)
        assert raw(p) == h(p.read_text(encoding='utf-8-sig').replace('\r\n', '\n').replace('\r', '\n').encode()) == value
        inputs[rel] = value
    return {'whole_generator_sha256': h(expected), 'unchanged': unchanged, 'accepted211': inputs,
            'metadata_test_sha256': raw(ROOT / SRC / 'test_metadata.py'), 'successor_test_sha256': raw(ROOT / SRC / 'test_succession.py')}


def baseline():
    original_paths = {}
    for commit in COMMITS:
        for name in git('diff-tree', '--no-commit-id', '--no-renames', '--name-only', '-r', '-z', commit).split(b'\0'):
            if name:
                original_paths[name.decode()] = commit
    imported = []
    for name, commit in sorted(original_paths.items()):
        value = blob(commit, name)
        assert (ROOT / name).read_bytes() == value, name
        imported.append({'path': name, 'commit': commit, 'git_blob': git('rev-parse', f'{commit}:{name}').decode().strip(), 'sha256': h(value)})
    current = folder()
    assert git('rev-parse', 'HEAD', cwd=LESSONS).decode().strip() == LROOT
    assert git('status', '--porcelain', cwd=LESSONS) == b''
    for name, value in current.items():
        assert value == h(blob(LBASE, (REL / name).as_posix(), LESSONS))
    native = [f'{STEM} – {kind}.{ext}' for kind in KINDS for ext in ['md', 'html', 'pdf', 'zip']]
    native += [name for name in current if name.startswith('_assets/') and name.endswith(('.svg', '.png'))]
    assert len(native) == 34 and len(set(native)) == 34
    old_binding = read(OLD / 'inspection-binding.json')
    assert old_binding['result'] == 'PASS_WITH_FLAGS'
    assert len(old_binding['native34']) == 34
    for name, value in old_binding['native34'].items():
        assert raw(LESSONS / name) == value
    history = {}
    for entry in old_binding['personally_viewed_pages']:
        kind = entry['edition']
        p = OLD / Path(entry['directory']).name
        m = read(p / 'manifest.json')
        assert raw(p / 'manifest.json') == entry['manifest_sha256']
        assert m['inspection_status'] == 'PENDING' and m['pages_inspected'] == []
        assert m['page_sha256'] == entry['pages']
        for name, value in entry['pages'].items():
            assert raw(p / 'pages' / name) == value
        history[kind] = {'directory': p.relative_to(ROOT).as_posix(), 'manifest_sha256': entry['manifest_sha256'], 'pages': entry['pages']}
    assert sum(len(x['pages']) for x in history.values()) == 27
    supplement = read(OUT / 'BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-evidence/inherited-proof-supplement.json')['files']
    assert len(supplement) == 171
    for name, hashes in supplement.items():
        assert raw(ROOT / name) == hashes['raw_sha256'] and h(blob(PBASE, name)) == hashes['git_blob_sha256']
    imported_pages, imported_manifests = 0, 0
    for rec in imported:
        if not rec['path'].endswith('/manifest.json'):
            continue
        path = ROOT / rec['path']
        m = read(path)
        kind = next(k for k in KINDS if path.parent.name.startswith('212-' + k + '-'))
        assert m['inspection_status'] == 'PENDING' and m['pages_inspected'] == []
        assert m['page_sha256'] == history[kind]['pages']
        for name, value in m['page_sha256'].items():
            assert raw(path.parent / 'pages' / name) == value
            imported_pages += 1
        imported_manifests += 1
    assert imported_pages == 189 and imported_manifests == 21  # diagnostic r7 plus six valid native routes
    inspection = read(REVIEW / 'independent-inspection.json')
    assert inspection['actor'] == 'paragraph_212_successor_delta_review'
    assert len(inspection['pages']) == 3 and len(inspection['figures']) == 11
    for rec in inspection['pages']:
        assert rec['personally_viewed'] and rec['observation']
        assert raw(ROOT / rec['current']) == raw(ROOT / rec['old']) == rec['sha256']
    for rec in inspection['figures']:
        assert rec['personally_viewed'] and rec['observation'] and raw(LESSONS / rec['path']) == rec['sha256']
    probes = read(REVIEW / 'independent-negative-probes.json')
    assert probes['result'] == 'PASS' and len(probes['probes']) == 9
    assert all(r['result'] == 'REJECTED' for r in probes['probes'])
    assert all(r.get('side_effect_calls', []) == [] for r in probes['probes'])
    save('baseline.json', {'pass': True, 'platform': git('rev-parse', 'HEAD').decode().strip(), 'lessons': LROOT,
                          'imports': imported, 'source_binding': sources(), 'paragraph_files': current, 'native_files': native,
                          'history': history, 'inherited171': supplement, 'imported_pending_manifests': imported_manifests,
                          'imported_page_count_including_diagnostic': imported_pages, 'valid_imported_page_count': 162,
                          'independent_negative_probes': 9, 'historical_personal_pages': 27, 'delta_personal_pages': 3,
                          'delta_personal_figures': 11, 'root_new_personal_views': 0, 'acceptance': 'PENDING'})


def command(name, argv, expected=0):
    start = datetime.now(timezone.utc).isoformat()
    run = subprocess.run(list(map(str, argv)), cwd=ROOT, capture_output=True)
    value = {'argv': list(map(str, argv)), 'cwd': str(ROOT), 'started': start,
             'ended': datetime.now(timezone.utc).isoformat(), 'exit_code': run.returncode,
             'stdout': run.stdout.decode('utf-8', errors='replace'), 'stderr': run.stderr.decode('utf-8', errors='replace'),
             'stdout_sha256': h(run.stdout), 'stderr_sha256': h(run.stderr), 'inherited_path': os.environ['PATH']}
    save(name + '.json', value)
    assert run.returncode == expected, f'{name}: exit {run.returncode}; full diagnostics retained'


def preserve():
    before = read(E / 'baseline.json')
    assert folder() == before['paragraph_files'] and sources() == before['source_binding']
    assert git('status', '--porcelain', cwd=LESSONS) == b''
    for rec in before['imports']:
        assert raw(ROOT / rec['path']) == rec['sha256']
    for name, value in before['inherited171'].items():
        assert raw(ROOT / name) == value['raw_sha256']
    return before


def reserve(mode):
    rows = []
    for line in git('worktree', 'list', '--porcelain').decode().splitlines():
        if not line.startswith('worktree '):
            continue
        report = Path(line[9:]) / 'reports'
        if not report.is_dir():
            continue
        for directory, children, files in os.walk(report):
            for child in children:
                match = re.fullmatch(r'212-.+-r([1-9][0-9]*)', child)
                if match:
                    rows.append({'path': str(Path(directory) / child), 'revision': int(match[1])})
            for file in files:
                p = Path(directory) / file
                if '212' not in str(p) or not re.search('attempt|reserv', file, re.I):
                    continue
                revisions = re.findall(r'(?:^|[-_])r([1-9][0-9]*)(?=[-_.]|$)', file)
                if not revisions and p.suffix == '.json':
                    revisions = re.findall(r'"(?:revision|proof_suffix|suffix)"\s*:\s*"r([1-9][0-9]*)"', p.read_text(encoding='utf-8-sig'))
                rows.extend({'path': str(p), 'revision': int(n)} for n in revisions)
    assert max(r['revision'] for r in rows) >= 15
    suffix = 'r' + str(max(r['revision'] for r in rows) + 1)
    save(mode + '-reservation.json', {'suffix': suffix, 'used': rows, 'python': sys.executable, 'inherited_path': os.environ['PATH']})
    return suffix


def parity(mode, manifest):
    from PIL import Image
    before = preserve()
    records = []
    for kind, count, zcount, rec in zip(KINDS, COUNTS, ZCOUNTS, manifest['documents']):
        assert rec['pdf_sha256'] == before['paragraph_files'][f'{STEM} – {kind}.pdf']
        with ZipFile(DEST / f'{STEM} – {kind}.zip') as archive:
            names = archive.namelist()
            assert len(names) == len(set(names)) == zcount and archive.testzip() is None
            members = []
            for info in archive.infolist():
                name = PurePosixPath(info.filename)
                assert not name.is_absolute() and '..' not in name.parts and ':' not in info.filename and '\\' not in info.filename
                assert info.date_time == (1980, 1, 1, 0, 0, 0) and archive.read(info.filename) == (DEST / info.filename).read_bytes()
                members.append({'name': info.filename, 'crc': info.CRC, 'sha256': h(archive.read(info.filename)), 'timestamp': info.date_time})
        directory = Path(rec['proof_directory'])
        m = read(directory / 'manifest.json')
        assert m['inspection_status'] == 'PENDING' and m['pages_inspected'] == []
        assert m['page_sha256'] == before['history'][kind]['pages'] and len(m['page_sha256']) == count
        pages = []
        for name, value in m['page_sha256'].items():
            fresh, old = directory / 'pages' / name, ROOT / before['history'][kind]['directory'] / 'pages' / name
            assert raw(fresh) == raw(old) == value
            with Image.open(fresh) as a, Image.open(old) as b:
                assert a.mode == b.mode and a.size == b.size and a.tobytes() == b.tobytes()
                pages.append({'name': name, 'sha256': value, 'pixels_sha256': h(a.tobytes()), 'size': a.size})
        records.append({'kind': kind, 'pdf_sha256': rec['pdf_sha256'], 'zip_members': members,
                        'directory': directory.relative_to(ROOT).as_posix(), 'manifest_sha256': raw(directory / 'manifest.json'), 'pages': pages})
    assets = []
    for name in before['native_files']:
        if name.endswith('.png'):
            with Image.open(DEST / name) as a, Image.open(io.BytesIO(blob(LBASE, (REL / name).as_posix(), LESSONS))) as b:
                assert a.mode == b.mode and a.size == b.size and a.tobytes() == b.tobytes()
                assets.append({'name': name, 'sha256': raw(DEST / name), 'pixels_sha256': h(a.tobytes())})
    assert len(assets) == 11
    save(mode + '-parity.json', {'pass': True, 'native_count': 34, 'whole_folder_count': len(before['paragraph_files']),
                               'pages': 27, 'documents': records, 'figures': assets, 'personal_review': 'NOT_INFERRED'})


def worker(suffix, manifest):
    sys.path.insert(0, str(ROOT / 'build-scripts/content/book-2'))
    import b2_212 as builder
    records = []
    for kind in KINDS:
        rec = builder.build_document(DEST / f'{STEM} – {kind}.md')
        rec['zip'] = builder.zip_document(rec)
        directory = E / 'proofs' / f"212-{kind}-{rec['pdf_sha256'][:12]}-{suffix}"
        assert not directory.exists()
        builder.render_proof(rec, directory)
        rec['proof_directory'] = str(directory)
        records.append(rec)
    with manifest.open('x', encoding='utf-8', newline='\n') as stream:
        json.dump({'inspection_status': 'PENDING', 'documents': records}, stream, ensure_ascii=False, indent=2)
        stream.write('\n')


def reproduce(mode):
    preserve()
    suffix = reserve(mode)
    manifest = E / (mode + '-manifest.json')
    assert not manifest.exists()
    if mode == 'print':
        args = [sys.executable, __file__, 'print-worker', '--suffix', suffix, '--manifest', manifest]
    else:
        script = ROOT / GEN if mode == 'full' else DEST / 'build_pdf.py'
        args = [sys.executable, script, '--lesson-root', LESSONS, '--proof-root', E / 'proofs', '--proof-suffix', suffix, '--manifest', manifest]
    command(mode + '-process', args)
    parity(mode, read(manifest))


def gates():
    command('native-process', [sys.executable, SRC + 'check_render.py', E / 'native-check.json'])
    for profile in ['student-web', 'publisher-print']:
        command(profile, ['node', 'scripts/validate-paragraph.js', '--mode', 'part-a', '--profile', profile, DEST])
    command('currentness', ['node', 'build-scripts/workflows/check-book-outline-currentness.js', '--require-approved', '--action', 'paragraph_production', '--paragraph', '2.1.2'])
    command('durable', ['node', 'build-scripts/workflows/check-book2-target-authority-remediation.js', '--durable'])
    command('bundle', ['node', 'build-scripts/sprints/check-sprint-bundle.js', 'BOOK2-TEXTBOOK-PRODUCTION-1'])
    preserve()


def integrity():
    before = preserve()
    for mode in ['full', 'thin', 'print']:
        for rec in read(E / (mode + '-parity.json'))['documents']:
            directory = ROOT / rec['directory']
            assert raw(directory / 'manifest.json') == rec['manifest_sha256']
            for page in rec['pages']:
                assert raw(directory / 'pages' / page['name']) == page['sha256']
    save('final-integrity.json', {'pass': True, 'imported_files': len(before['imports']), 'inherited_proof_files': 171,
                                 'paragraph_files': len(before['paragraph_files']), 'new_pending_manifests': 9, 'new_pages_exact': 81,
                                 'root_acceptance': 'PENDING', 'specialist_qc': 'PENDING', 'handoff': 'STALE_UNCHANGED'})


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=['baseline', 'tests', 'full', 'thin', 'print', 'print-worker', 'gates', 'integrity'])
    parser.add_argument('--suffix')
    parser.add_argument('--manifest', type=Path)
    args = parser.parse_args()
    if args.mode == 'baseline':
        baseline()
    elif args.mode == 'tests':
        command('tests', [sys.executable, '-m', 'unittest', 'discover', '-s', SRC, '-p', 'test_*.py', '-v'])
    elif args.mode in ['full', 'thin', 'print']:
        reproduce(args.mode)
    elif args.mode == 'print-worker':
        worker(args.suffix, args.manifest)
    elif args.mode == 'gates':
        gates()
    else:
        integrity()
