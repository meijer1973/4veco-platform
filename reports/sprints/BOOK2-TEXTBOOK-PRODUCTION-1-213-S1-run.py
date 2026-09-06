"""Bounded §213 S1 evidence controller. Never accepts or repairs pupil artifacts.

HOW TO ADAPT: commission a new immutable exact-pair work order. All evidence is
exclusive-create. Keep failures. Native children inherit PATH without reordering.
Pass --controller-ref as the exact separately committed controller payload.
"""
from pathlib import Path, PurePosixPath
from zipfile import ZipFile
import argparse
import datetime
import hashlib
import json
import os
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]
LESSONS = ROOT.parent / '4veco-lessen'
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-213-S1'
OUT = ROOT / 'reports/sprints' / (PREFIX + '-evidence')
PROOF = OUT / 'proofs'
PBASE = '50db4c5da142812f47bf02219e393447caedecfb'
LBASE = '42996c60b4a93843dfe8488b8e5a3ea704871667'
PYTHON = 'C:/Python314/python.exe'
BRANCH = 'agent/book2-213-succession-20260906'
STEM = '2.1.3 Marginale kosten en marginale opbrengsten'
REL = Path('Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten') / STEM
FOLDER = LESSONS / REL
KINDS = ('paragraaf', 'opgaven', 'antwoorden')
ASSETS = [f'2.1.3_fig_{n}' for n in range(1, 5)] + ['2.1.3_we_1', '2.1.3_ex_1']
NATIVE = [f'{STEM} – {k}.{e}' for k in KINDS for e in ('md', 'html', 'pdf', 'zip')] + [f'_assets/{n}.{e}' for n in ASSETS for e in ('svg', 'png')]
GENERATOR = 'build-scripts/content/book-2/b2_213.py'
TEST = 'build-scripts/content/book-2/213/test_succession.py'
TEST_SHA = '84645329260b663e563e0fb5ce745d0ca86327f557d7971f26dda028cd1f48df'
sys.path.insert(0, str(ROOT / 'build-scripts/content/book-2/213'))
import test_succession as succession


def sha(data):
    return hashlib.sha256(data).hexdigest()


def normal(path):
    text = str(path)
    return text[4:] if text.startswith('\\\\?\\') else text


def extended(path):
    value = str(Path(path).absolute())
    return Path(value if value.startswith('\\\\?\\') or os.name != 'nt' else '\\\\?\\' + value)


def save(name, value):
    OUT.mkdir(exist_ok=True)
    with (OUT / name).open('x', encoding='utf-8', newline='\n') as stream:
        stream.write(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def command(argv, name, cwd=ROOT, *, allow_failure=False):
    started = datetime.datetime.now(datetime.timezone.utc).isoformat()
    run = subprocess.run(list(map(str, argv)), cwd=cwd, capture_output=True)
    result = dict(argv=list(map(str, argv)), cwd=str(cwd), started_at=started,
                  finished_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
                  exit_code=run.returncode, stdout=run.stdout.decode('utf-8', errors='replace'),
                  stderr=run.stderr.decode('utf-8', errors='replace'),
                  stdout_sha256=sha(run.stdout), stderr_sha256=sha(run.stderr),
                  inherited_path_sha256=sha(os.environ.get('PATH', '').encode()))
    save(name, result)
    print(name, 'exit', run.returncode, flush=True)
    if run.returncode and not allow_failure:
        raise RuntimeError(f'{name} failed; full failure retained, no restoration')
    return result


def native():
    assert len(NATIVE) == len(set(NATIVE)) == 24
    return {n: sha((FOLDER / n).read_bytes()) for n in NATIVE}


def archives():
    result = {}
    for kind, count in zip(KINDS, (15, 7, 3)):
        with ZipFile(FOLDER / f'{STEM} – {kind}.zip') as archive:
            assert len(archive.namelist()) == len(set(archive.namelist())) == count
            assert archive.testzip() is None
            rows = []
            for info in archive.infolist():
                name = PurePosixPath(info.filename)
                assert not name.is_absolute() and '..' not in name.parts
                assert '\\' not in info.filename and ':' not in info.filename
                raw = archive.read(info.filename)
                assert raw == (FOLDER / info.filename).read_bytes()
                assert info.date_time == (1980, 1, 1, 0, 0, 0)
                rows.append(dict(name=info.filename, crc=info.CRC, size=info.file_size, sha256=sha(raw)))
            result[kind] = rows
    return result


def git_inventory(root, ref):
    result = {}
    listing = subprocess.check_output(['git', 'ls-tree', '-rz', '--full-tree', ref], cwd=root)
    for item in listing.split(b'\0'):
        if not item:
            continue
        meta, name = item.split(b'\t', 1)
        mode, kind, git_sha = meta.decode().split()
        assert kind == 'blob', ('Unexpected tracked non-file', name)
        name = name.decode('utf-8')
        raw = (root / name).read_bytes()
        compared = raw
        if root == ROOT and name == GENERATOR:
            succession.verify_generator(raw)
            compared = succession.blob(ROOT, PBASE, GENERATOR)
        actual_object = lambda value: hashlib.sha1(b'blob ' + str(len(value)).encode() + b'\0' + value).hexdigest()
        mode_compared = 'raw'
        if actual_object(compared) != git_sha:
            compared = succession.canonical(compared)
            mode_compared = 'canonical_utf8_lf'
        assert actual_object(compared) == git_sha, ('Inherited Git-byte drift', name)
        result[name] = dict(raw_sha256=sha(raw), git_blob_sha1=git_sha,
                            git_blob_sha256=sha(compared), git_comparison=mode_compared)
    return result


def verify_controller(ref):
    assert re.fullmatch(r'[0-9a-f]{40}', ref)
    path = Path(__file__).relative_to(ROOT).as_posix()
    expected = succession.blob(ROOT, ref, path)
    current = Path(__file__).read_bytes()
    assert current == expected, 'Full controller drift against independently supplied immutable commit'
    assert sha((ROOT / TEST).read_bytes()) == TEST_SHA, 'Full succession guard changed'
    succession.verify_generator((ROOT / GENERATOR).read_bytes())
    for n in succession.PRESERVED:
        succession.verify_preserved(n, (ROOT / n).read_bytes())
    return dict(ref=ref, path=path, raw_sha256=sha(current), test_sha256=TEST_SHA,
                generator_sha256=sha((ROOT / GENERATOR).read_bytes()))


def snapshot(ref):
    control = verify_controller(ref)
    assert subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=LESSONS).decode().strip() == LBASE
    assert not subprocess.check_output(['git', 'status', '--porcelain'], cwd=LESSONS)
    for root in (ROOT, LESSONS):
        assert subprocess.check_output(['git', 'branch', '--show-current'], cwd=root).decode().strip() == BRANCH
    inherited = {'platform': git_inventory(ROOT, PBASE), 'lessons': git_inventory(LESSONS, LBASE)}
    reviewed = json.loads((ROOT / 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-r7-review-evidence/rebuild.json').read_text(encoding='utf-8-sig'))
    assert native() == reviewed['artifacts'], 'Native candidate not exact currently reviewed R7'
    assert not (FOLDER / '2.1.3-textbook-handoff.md').exists()
    inputs = []
    for relative, expected, mode in succession.actual_inputs()[1]:
        raw = (LESSONS / relative).read_bytes()
        assert sha(succession.canonical(raw) if mode == 'lf' else raw) == expected
        inputs.append(dict(path=relative.as_posix(), raw_sha256=sha(raw), lf_sha256=sha(succession.canonical(raw)), mode=mode))
    save('baseline.json', dict(platform_base=PBASE, lesson_base=LBASE, control=control,
         inherited=inherited, native=native(), archives=archives(), inputs=inputs,
         interpreter=PYTHON, inherited_path=os.environ.get('PATH', ''),
         snapshot_order='After exact five source substitutions, before native sideeffects. Original full generator reconstructed from fixed PBASE; all other inherited files match PBASE/LBASE Git blobs and captured raw bytes.',
         current_review_sha256=sha((FOLDER / '2.1.3-review.md').read_bytes()),
         stale_qc_sha256=sha((FOLDER / '2.1.3-quality-ref.yaml').read_bytes()), handoff_absent=True))
    print('Baseline exact:', {k: len(v) for k, v in inherited.items()}, '24 native, ZIP15/7/3', flush=True)


def check(ref, *, indexes=False):
    verify_controller(ref)
    base = json.loads((OUT / 'baseline.json').read_text(encoding='utf-8'))
    assert base['control']['generator_sha256'] == verify_controller(ref)['generator_sha256']
    assert os.environ.get('PATH', '') == base['inherited_path'], 'Inherited PATH changed'
    allowed_indexes = {'reports/github/agent-index.json', 'reports/github/agent-index.md',
                       'reports/github/repository-map.json', 'reports/github/repository-map.md'} if indexes else set()
    for repository, root in [('platform', ROOT), ('lessons', LESSONS)]:
        for name, binding in base['inherited'][repository].items():
            if repository == 'platform' and name in allowed_indexes:
                continue
            assert sha((root / name).read_bytes()) == binding['raw_sha256'], ('Inherited raw-byte drift', repository, name)
    assert native() == base['native'], 'Native byte drift; STOP, no restore-copy'
    assert archives() == base['archives'], 'Archive drift'
    assert not (FOLDER / '2.1.3-textbook-handoff.md').exists()
    assert subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=LESSONS).decode().strip() == LBASE
    assert not subprocess.check_output(['git', 'status', '--porcelain'], cwd=LESSONS)
    return base


def reserve():
    roots = set()
    for anchor in (ROOT, LESSONS):
        listing = subprocess.check_output(['git', 'worktree', 'list', '--porcelain'], cwd=anchor).decode('utf-8')
        roots.update(line[9:] for line in listing.splitlines() if line.startswith('worktree '))
    used, errors = [], []
    for registered in sorted(roots):
        reports = extended(registered) / 'reports'
        if not reports.exists():
            continue
        for directory, children, files in os.walk(reports, onerror=lambda e: errors.append(str(e))):
            for name in children + files:
                path = Path(directory) / name
                if '213' not in str(path):
                    continue
                matches = re.findall(r'(?:^|[-_])r([1-9][0-9]*)(?=[-_.]|$)', name)
                is_attempt = bool(re.search(r'attempt|reserv', str(path), re.I))
                if name in files and is_attempt and path.suffix == '.json':
                    value = path.read_text(encoding='utf-8-sig')
                    matches += re.findall(r'"(?:revision|proof_suffix|suffix)"\s*:\s*"r([1-9][0-9]*)"', value)
                if name in children or is_attempt:
                    for number in sorted(set(matches)):
                        used.append(dict(path=normal(path), revision=int(number), kind='directory' if name in children else 'attempt_or_reservation'))
    assert not errors, errors
    revision = 'r' + str(max([r['revision'] for r in used], default=0) + 1)
    # Exclusive own reservation after complete scan; no shared worktree writes.
    save('reservation-' + revision + '.json', dict(state='RESERVED_EXCLUSIVELY', revision=revision,
         registered_worktrees=sorted(roots), all_nested_used=used, scan_errors=errors,
         original_path_sha256=sha(os.environ.get('PATH', '').encode())))
    print('Reserved', revision, 'across', len(roots), 'registered trees;', len(used), 'existing records', flush=True)
    return revision


def compare_pages(manifest):
    from PIL import Image, ImageChops
    rows = []
    for kind, document, count in zip(KINDS, manifest['documents'], (14, 9, 7)):
        old = ROOT / 'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1' / f"213-{kind}-{document['pdf_sha256'][:12]}-r8"
        new = Path(document['proof_directory'])
        for directory in (old, new):
            proof = json.loads((directory / 'manifest.json').read_text(encoding='utf-8-sig'))
            assert proof['inspection_status'] == 'PENDING' and proof['pages_inspected'] == []
            assert proof['pdf_sha256'] == document['pdf_sha256']
        old_pages, new_pages = sorted((old / 'pages').glob('page-*.png')), sorted((new / 'pages').glob('page-*.png'))
        assert len(old_pages) == len(new_pages) == count
        for a, z in zip(old_pages, new_pages):
            assert a.read_bytes() == z.read_bytes(), ('Page raw bytes', kind, a.name)
            with Image.open(a) as before, Image.open(z) as after:
                assert before.size == after.size
                assert ImageChops.difference(before.convert('RGB'), after.convert('RGB')).getbbox() is None
                dimensions = list(after.size)
            rows.append(dict(kind=kind, previous=a.relative_to(ROOT).as_posix(), current=z.relative_to(ROOT).as_posix(),
                             sha256=sha(z.read_bytes()), dimensions=dimensions, decoded_rgb_changed_pixels=0))
    assert len(rows) == 30
    return rows


def build(mode, ref):
    check(ref)
    revision = reserve()
    manifest = OUT / f'{mode}-{revision}-build.json'
    assert not manifest.exists()
    if mode == 'print':
        argv = [PYTHON, __file__, 'print-worker', '--controller-ref', ref, '--revision', revision, '--manifest', manifest]
    else:
        builder = ROOT / GENERATOR if mode == 'full' else FOLDER / 'build_pdf.py'
        argv = [PYTHON, builder, '--proof-root', PROOF, '--proof-suffix', revision, '--manifest', manifest]
        if mode == 'full':
            argv += ['--lesson-root', LESSONS]
    command(argv, f'{mode}-{revision}-command.json')
    result = json.loads(manifest.read_text(encoding='utf-8'))
    assert result['inspection_status'] == 'PENDING'
    check(ref)
    pages = compare_pages(result)
    save(f'{mode}-{revision}-reproduction.json', dict(result='PASS', mode=mode, revision=revision,
         manifest=manifest.relative_to(ROOT).as_posix(), manifest_sha256=sha(manifest.read_bytes()),
         native=native(), archives=archives(), pages=pages, controller=verify_controller(ref),
         whole_inherited_raw_preserved=True, independent_acceptance=False))
    print(mode, revision, 'PASS:24 raw native, ZIP15/7/3,30 raw/RGB pages unchanged', flush=True)


def print_worker(ref, revision, manifest):
    check(ref)
    assert (OUT / ('reservation-' + revision + '.json')).is_file()
    b = succession.b
    for path, expected in b.prerequisite_pins(FOLDER):
        assert b.lf_hash(path) == expected
    records = []
    for kind in KINDS:
        record = b.build_document(FOLDER / f'{STEM} – {kind}.md')
        record['zip'] = b.zip_document(record)
        directory = PROOF / f"213-{kind}-{record['pdf_sha256'][:12]}-{revision}"
        b.render_proof(record, directory)
        record['proof_directory'] = str(directory)
        records.append(record)
    with Path(manifest).open('x', encoding='utf-8', newline='\n') as stream:
        stream.write(json.dumps(dict(inspection_status='PENDING', documents=records), ensure_ascii=False, indent=2) + '\n')


def validate(ref, label):
    check(ref)
    jobs = [
        ('focused-tests', [PYTHON, '-m', 'unittest', 'discover', '-s', ROOT / 'build-scripts/content/book-2/213', '-p', 'test_*.py', '-v']),
        ('native-checker', [PYTHON, ROOT / 'build-scripts/content/book-2/213/check_render.py']),
        ('student-web', ['node', 'scripts/validate-paragraph.js', '--mode', 'part-a', '--profile', 'student-web', FOLDER]),
        ('publisher-print', ['node', 'scripts/validate-paragraph.js', '--mode', 'part-a', '--profile', 'publisher-print', FOLDER]),
        ('currentness', ['node', 'build-scripts/workflows/check-book-outline-currentness.js', '--require-approved', '--action', 'paragraph_production', '--paragraph', '2.1.3']),
        ('durable', ['node', 'build-scripts/workflows/check-book2-target-authority-remediation.js', '--durable']),
        ('active-bundle', ['node', 'build-scripts/sprints/check-sprint-bundle.js', 'BOOK2-TEXTBOOK-PRODUCTION-1'])]
    for name, argv in jobs:
        command(argv, f'{label}-{name}.json')
    check(ref)
    save(label + '-binding.json', dict(result='PASS', control=verify_controller(ref), native=native(),
         original17_unchanged=True, new_succession_tests=6, current_review_unchanged=True,
         stale_qc_unchanged=True, handoff_absent=True, no_independent_acceptance=True))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('mode', choices=['snapshot', 'check', 'full', 'thin', 'print', 'print-worker', 'validate'])
    parser.add_argument('--controller-ref', required=True)
    parser.add_argument('--revision')
    parser.add_argument('--manifest')
    parser.add_argument('--label', default='validation')
    args = parser.parse_args()
    if args.mode == 'snapshot':
        snapshot(args.controller_ref)
    elif args.mode == 'check':
        check(args.controller_ref)
        print('All inherited files, current24 native, review/QC/handoff unchanged')
    elif args.mode == 'validate':
        validate(args.controller_ref, args.label)
    elif args.mode == 'print-worker':
        print_worker(args.controller_ref, args.revision, args.manifest)
    else:
        build(args.mode, args.controller_ref)
