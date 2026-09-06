"""Source-independent current §223 specialist renewal; no root acceptance.

Mechanical native/DOM/parity primitives are attributed to fully read ALT/root
controllers. Current baseline, strict full-byte custody, revision reservations,
independent mathematics and personal inspection remain separate evidence.
"""
import argparse
import datetime
import importlib.util
import json
import os
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-223-QC-RENEWAL'
PINPUT = 'b3773c9b2a085ff83e82d7e71384ef10337d7c9c'
LINPUT = 'a52206c0cc9e2578b57e285909c77134bb47657e'
OLDQC = '6d93128f5cdcd363fc4a7e5a6e5d462162f130a18f4f01fd4656be22ef9e2586'
REVIEW = 'e603b62ba2d77e1c33db6aeeaeb24d9b41ec7a136f26020bc3b5081e0a2e56a4'
REVIEW_SUCCESSOR = '56883966bb05a60b395e6d53d9228d4e801072818c00b8634dd2c60a1de3121f'
NOUN_P = 'f49314d347a87ca7b4da0c46b5d2f6d3b32dfd8d'
NOUN_L = '6ba3bbdff3de31261b63d71ee992b33b07bce50d'
spec = importlib.util.spec_from_file_location('attributed_alt_review', ROOT / 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-ALT-REVIEW-check.py')
r = importlib.util.module_from_spec(spec)
spec.loader.exec_module(r)
a, n, B = r.a, r.n, r.B
r.PREFIX = a.PREFIX = n.PREFIX = PREFIX
n.PROOF = n.OUT / (PREFIX + '-evidence')
PY = 'C:/Python314/python.exe'
QCNAME = '2.2.3-quality-ref.yaml'


def command(label, argv, expected=0):
    env = os.environ.copy()
    env['PATH'] = 'C:/msys64/mingw64/bin' + os.pathsep + env['PATH']
    started = datetime.datetime.now(datetime.timezone.utc).isoformat()
    proc = subprocess.run(argv, cwd=ROOT, env=env, capture_output=True, encoding='utf-8', errors='replace')
    n.save(label, {'argv': list(map(str, argv)), 'cwd': str(ROOT), 'child_PATH': env['PATH'],
        'profile': '223 Python314 MSYS-FIRST child only; no parent/global environment mutation',
        'started_utc': started, 'finished_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'exit_code': proc.returncode, 'expected_exit': expected, 'stdout': proc.stdout, 'stderr': proc.stderr})
    assert proc.returncode == expected, (label, proc.returncode, proc.stderr[-1500:])


n.command = command


def tree_names(repo, ref):
    return [s.decode() for s in n.git('ls-tree', '-r', '--name-only', '-z', ref, cwd=repo).split(b'\0') if s]


def baseline():
    assert n.git('rev-parse', 'HEAD', cwd=n.LESSONS).decode().strip() == LINPUT
    assert not n.git('status', '--porcelain', cwd=n.LESSONS).strip()
    assert n.sha((n.DEST / QCNAME).read_bytes()) == OLDQC
    assert n.sha((n.DEST / '2.2.3-review.md').read_bytes()) == REVIEW
    assert len(n.folder()) == 25
    lesson_files = {}
    for name in tree_names(n.LESSONS, LINPUT):
        data = (n.LONG / name).read_bytes()
        assert data == n.blob(LINPUT, name, n.LESSONS), name
        lesson_files[name] = n.sha(data)
    old_evidence = []
    instructions = []
    for name in tree_names(ROOT, PINPUT):
        if name.startswith('reports/') and '223' in name:
            data = (ROOT / name).read_bytes()
            assert data == n.blob(PINPUT, name), name
            old_evidence.append({'path': name, 'sha256': n.sha(data)})
        if (name == 'AGENTS.md' or name.startswith(('skills/', 'agents/', 'references/')) or
                name in ['BUILD-PARAGRAPH.md', 'BUILD-CHAPTER.md', 'build-scripts/README.md']):
            data = (ROOT / name).read_bytes()
            assert data == n.blob(PINPUT, name)
            assert data == n.blob('f257056d0a455c660ccb598cb4da734b36eefd80', name)
            instructions.append({'path': name, 'sha256': n.sha(data)})
    histories = {}
    for kind in n.KINDS:
        choices = list((n.OUT / 'BOOK2-TEXTBOOK-PRODUCTION-1-223-ALT-REVIEW-evidence').glob(f'223-{kind}-*-r22'))
        assert len(choices) == 1
        histories[kind] = choices[0].relative_to(ROOT).as_posix()
    n.save('original-QC-snapshot', {'raw_sha256': OLDQC, 'lesson_commit': LINPUT,
        'path': (B.LESSON_REL / QCNAME).as_posix(), 'exact_text': (n.DEST / QCNAME).read_bytes().decode()})
    n.save('baseline', {'pass': True, 'platform_input': PINPUT, 'lesson_input': LINPUT,
        'operational_plan_commit': '5dc6214387a29d9721e8172e070e9611356e2ac6',
        'paragraph_files': n.folder(), 'all_lesson_input_files': lesson_files,
        'old_evidence': old_evidence, 'history': histories,
        'instruction_identity_rebound_to_prior_personal_reads': instructions,
        'source_binding_attributed_guard': a.source_binding(),
        'source_binding_attributed_independent_controller': r.custody(),
        'target_record': B.target_record(), 'review_sha256': REVIEW,
        'root_validation': 'PENDING', 'root_acceptance': 'PENDING', 'handoff_renewal': 'PENDING'})


def reserve(mode):
    roots = set()
    for repo in [ROOT, n.LESSONS]:
        roots.update(line[9:] for line in n.git('worktree', 'list', '--porcelain', cwd=repo).decode().splitlines() if line.startswith('worktree '))
    seen, locations, unavailable = set(), [], []
    def consume(value, location):
        for matched in re.findall(r'(?<![A-Za-z0-9])r([1-9][0-9]*)(?![A-Za-z0-9])', value):
            seen.add(int(matched)); locations.append(location)
    for root in sorted(roots):
        if not Path(root).is_dir():
            unavailable.append(root)
            continue
        for rel in ['reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1', 'reports/sprints']:
            base = Path(root) / rel
            if not base.is_dir():
                continue
            for directory, dirs, files in os.walk(base):
                for name in dirs:
                    if name.startswith('223-'):
                        consume(name, str(Path(directory) / name))
                dirs[:] = [d for d in dirs if d not in ('pages', 'grayscale', '__pycache__', '.git')]
                for name in files:
                    if '223' not in name:
                        continue
                    path = Path(directory) / name
                    consume(name, str(path))
                    if name.endswith('.json') and any(term in name for term in ('reservation', 'attempt', 'process', 'invocation')):
                        value = json.loads(path.read_text(encoding='utf-8-sig'))
                        # Actual process argv and reserved suffixes, not prose about earlier comparisons.
                        for key in ('suffix', 'proof_suffix', 'argv', 'command'):
                            if key in value:
                                consume(json.dumps(value[key]), str(path))
    assert seen and max(seen) >= 24 and not unavailable, unavailable
    suffix = f'r{max(seen) + 1}'
    n.save(mode + '-reservation', {'suffix': suffix, 'used': sorted(seen), 'registered_worktrees': sorted(roots),
        'unavailable_worktrees': unavailable, 'observed_locations': sorted(set(locations)),
        'proof_root': str(n.PROOF), 'scan': 'both registered repositories; recursive standard/nested proofs, every 223 filename and recorded actual attempted argv/reservations'})
    return suffix


def strict_native():
    original = n.read('baseline')['paragraph_files']
    for name in a.native_names():
        data = (n.DEST / name).read_bytes()
        assert data == n.blob(LINPUT, (B.LESSON_REL / name).as_posix(), n.LESSONS), name
        assert n.sha(data) == original[name], name


def reproduce(mode):
    strict_native()
    a.source_binding()
    suffix = reserve(mode)
    manifest = n.OUT / f'{PREFIX}-{mode}-manifest.json'
    assert not manifest.exists()
    if mode == 'full':
        command('pdf-artifact-marker', ['node', 'C:/Users/meije/.codex/plugins/cache/openai-primary-runtime/pdf/26.904.11930/skills/pdf/container_tools/mark_artifact_operation_started.mjs',
            '--operation-kind', 'edit', '--expected-output-count', '3', '--output-format', 'pdf'])
    if mode in ['full', 'thin']:
        script = ROOT / n.GEN if mode == 'full' else n.LESSONS / B.LESSON_REL / 'build_pdf.py'
        command(mode + '-process', [PY, str(script), '--lesson-root', str(n.LONG), '--proof-root', str(n.PROOF),
            '--proof-suffix', suffix, '--manifest', str(manifest)])
    else:
        command('print-process', [PY, str(Path(__file__).resolve()), 'print-inner'])
    strict_native()
    a.verify(mode)


def native():
    strict_native()
    command('native-process', [PY, 'build-scripts/content/book-2/223/check_render.py', '--lesson-root', str(n.LONG),
        '--manifest', str(n.OUT / f'{PREFIX}-full-manifest.json'), '--rebuild',
        '--output', str(n.OUT / f'{PREFIX}-native-check.json')])
    strict_native()
    n.save('native-postrebuild-parity', {'pass': True, 'all20_native_raw_bytes_match_ALT_review_input': True,
        'source_binding': a.source_binding(), 'rendered_checker': 'actual additional builder rebuild; no new proof revision requested'})


def metadata():
    deltas = [a.metadata_delta(kind) for kind in n.KINDS]
    changed = [name for name in a.native_names() if (n.DEST / name).read_bytes() != a.input_blob(name)]
    assert set(changed) == {f'{B.STEM} – {kind}.{ext}' for kind in ['paragraaf', 'opgaven'] for ext in ['md', 'html', 'zip']}
    n.save('metadata', {'pass': True, 'native_six_file_delta_from_original_QC': changed, 'actual_HTML_changes': deltas,
        'current_review_sha256': n.sha((n.DEST / '2.2.3-review.md').read_bytes()),
        'independence': 'ALT source and separate review authored by other actors; DOM derivation primitives attributed',
        'functional_semantics': 'Ei scale is noun-first, describes signed intervals and open 0/1; scenario description names isolated income, original reset and isolated other price. Printed complete captions remain visible and unhidden.'})


def gates(label=''):
    lead = (label + '-') if label else ''
    for profile in ['student-web', 'publisher-print']:
        command(lead + profile, ['node', 'scripts/validate-paragraph.js', '--mode', 'part-a', '--profile', profile, str(n.DEST)])
    for action in ['paragraph_production', 'specialist_review']:
        command(lead + action + '-currentness', ['node', 'build-scripts/workflows/check-book-outline-currentness.js', '--require-approved', '--action', action, '--paragraph', '2.2.3'])
    command(lead + 'durable', ['node', 'build-scripts/workflows/check-book2-target-authority-remediation.js', '--durable'])
    command(lead + 'bundle', ['node', 'build-scripts/sprints/check-sprint-bundle.js', 'BOOK2-TEXTBOOK-PRODUCTION-1'])


def exact_review_successor():
    relative = (B.LESSON_REL / '2.2.3-review.md').as_posix()
    old = n.blob(LINPUT, relative, n.LESSONS)
    actual = (n.LONG / relative).read_bytes()
    before, after = b'+30 meals/month', b'+30 subscriptions/month'
    assert n.sha(old) == REVIEW and old.count(before) == 1
    assert actual == old.replace(before, after, 1)
    assert actual.count(after) == 1 and actual.replace(after, before, 1) == old
    assert actual == n.blob(NOUN_L, relative, n.LESSONS)
    assert n.sha(actual) == REVIEW_SUCCESSOR
    assert n.git('diff', '--name-only', LINPUT, NOUN_L, cwd=n.LESSONS).decode().strip() == relative
    imported = []
    for name in tree_names(ROOT, NOUN_P):
        if name.startswith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-ALT-REVIEW-NOUN-'):
            data = (ROOT / name).read_bytes()
            assert data == n.blob(NOUN_P, name), name
            imported.append({'path': name, 'sha256': n.sha(data)})
    assert len(imported) == 23
    return {'old_sha256': REVIEW, 'new_sha256': REVIEW_SUCCESSOR, 'lesson_source_commit': NOUN_L,
        'platform_source_commits': ['3b895475e54f72239d85daaf4967567001038644', 'e2f0165cdfac453ca4cc0746164214186f834b6b', NOUN_P],
        'line': 135, 'from': before.decode(), 'to': after.decode(), 'exact_full_byte_replacement_and_reverse': True,
        'imported_reports': imported, 'authorization': 'root explicit bounded reviewer-only import after own operational note e32256cd',
        'not_specialist_or_root_acceptance': True}


def successor():
    value = exact_review_successor()
    strict_native()
    immutable = {}
    for label in ['original-QC-snapshot', 'baseline', 'metadata', 'independent-mathematics', 'personal-inspection',
                  'full-parity', 'thin-parity', 'print-parity', 'native-check', 'pre-QC-integrity']:
        immutable[label] = n.sha((n.OUT / (PREFIX + '-' + label + '.json')).read_bytes())
    assert immutable['personal-inspection'] == 'f986311af79081ddbb3edf68032958a0d4fd03af4f2470d89ea43bd58cf1b0b5'
    assert immutable['independent-mathematics'] == '3419a88c5e4241cc3ef8e4fb0947f895ade2dbf4fdf2f367a8c7eefccd66cd9a'
    n.save('review-successor', {'pass': True, 'review_successor': value, 'unaltered_own_evidence': immutable,
        'original_input': {'platform': PINPUT, 'lessons': LINPUT}, 'source_binding': a.source_binding(),
        'native_rebuild_for_noun': False, 'fresh_reopened_views_for_noun': 0,
        'current_specialist_QC_before_renewal': n.sha((n.DEST / QCNAME).read_bytes()),
        'handoff': 'ABSENT', 'root_acceptance': 'PENDING'})


def integrity(label):
    baseline = n.read('baseline')
    strict_native()
    qcpath = (B.LESSON_REL / QCNAME).as_posix()
    reviewpath = (B.LESSON_REL / '2.2.3-review.md').as_posix()
    changed = []
    for name, value in baseline['all_lesson_input_files'].items():
        actual = n.sha((n.LONG / name).read_bytes())
        if actual != value:
            assert name in [qcpath, reviewpath], name
            if name == reviewpath:
                exact_review_successor()
            changed.append({'path': name, 'before_sha256': value, 'after_sha256': actual})
    for row in baseline['old_evidence']:
        assert n.sha((ROOT / row['path']).read_bytes()) == row['sha256'], row['path']
    proofs = []
    for mode in ['full', 'thin', 'print']:
        for rec in n.read(mode + '-parity')['documents']:
            directory = ROOT / rec['proof_directory']
            assert n.sha((directory / 'manifest.json').read_bytes()) == rec['manifest_sha256']
            proof = json.loads((directory / 'manifest.json').read_text(encoding='utf-8'))
            assert proof['pages_inspected'] == [] and proof['inspection_status'] == 'PENDING'
            for page in rec['pages']:
                assert n.sha((directory / 'pages' / page['name']).read_bytes()) == page['raw_sha256']
            proofs.append({'mode': mode, 'path': rec['proof_directory'], 'manifest_sha256': rec['manifest_sha256']})
    assert not (n.DEST / '2.2.3-textbook-handoff.md').exists()
    import yaml
    old_text = n.read('original-QC-snapshot')['exact_text']
    current_text = (n.DEST / QCNAME).read_bytes().decode()
    assert old_text.split('partA:', 1)[0] == current_text.split('partA:', 1)[0]
    old_yaml, current_yaml = yaml.safe_load(old_text), yaml.safe_load(current_text)
    assert {k:v for k,v in old_yaml.items() if k != 'partA'} == {k:v for k,v in current_yaml.items() if k != 'partA'}
    part = current_yaml['partA']
    assert current_yaml['schema_version'] == 2
    assert part['paragraph_review_sha256'] == REVIEW_SUCCESSOR
    assert part['specialist_reviewer'] == 'paragraph_214_builder'
    assert part['specialist_role'] == 'independent223specialistQCRenewal'
    assert part['specialist_verdict'] == 'PASS WITH FLAGS'
    assert part['unresolved_blockers'] == 0 and part['blockers'] == []
    assert not part['production_ready'] and not part['production_ready_with_flags']
    assert part['root_validation'] == part['root_acceptance'] == 'PENDING'
    assert part['timing']['observed'] is False
    for key in ['specialist_evidence', 'mathematics_evidence', 'review_successor_evidence']:
        assert n.sha((ROOT / part[key]).read_bytes()) == part[key + '_sha256']
    succession = exact_review_successor()
    if (n.OUT / (PREFIX + '-review-successor.json')).exists():
        for item, sha in n.read('review-successor')['unaltered_own_evidence'].items():
            assert n.sha((n.OUT / (PREFIX + '-' + item + '.json')).read_bytes()) == sha, item
    n.save(label, {'pass': True, 'native_files': 20, 'lesson_input_files': len(baseline['all_lesson_input_files']),
        'only_lesson_delta': changed, 'canonical_review_unchanged': n.sha((n.LONG / reviewpath).read_bytes()) == REVIEW,
        'canonical_review_exact_authorized_successor': succession,
        'current_QC_sha256': n.sha((n.DEST / QCNAME).read_bytes()),
        'schema2_legacy_fields_exact': True, 'specialist_binding_and_root_limits_checked': True,
        'preserved_prior_223_evidence_files': len(baseline['old_evidence']), 'new_proofs': proofs,
        'source_binding': a.source_binding(), 'handoff': 'ABSENT', 'production_ready': False,
        'root_validation': 'PENDING', 'root_acceptance': 'PENDING', 'handoff_renewal': 'PENDING'})


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=['baseline', 'metadata', 'tests', 'full', 'thin', 'print', 'print-inner', 'native', 'grays', 'gates', 'integrity', 'successor'])
    parser.add_argument('--label', default='final-integrity')
    args = parser.parse_args()
    if args.mode == 'baseline': baseline()
    elif args.mode == 'metadata': metadata()
    elif args.mode == 'tests': command('tests', [PY, '-m', 'unittest', 'discover', '-s', 'build-scripts/content/book-2/223', '-p', 'test_*.py', '-v'])
    elif args.mode in ['full', 'thin', 'print']: reproduce(args.mode)
    elif args.mode == 'print-inner': a.print_inner()
    elif args.mode == 'native': native()
    elif args.mode == 'grays': a.grays()
    elif args.mode == 'gates': gates(args.label)
    elif args.mode == 'successor': successor()
    else: integrity(args.label)
