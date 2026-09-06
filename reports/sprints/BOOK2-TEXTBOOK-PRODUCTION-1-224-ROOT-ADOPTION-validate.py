"""Root adoption checks: unchanged reviewer predicates, new root evidence only.

No native positive build, no inherited review claim, no lesson mutation.
"""
import argparse, base64, hashlib, importlib.util, json, os, subprocess, sys
from datetime import datetime, timezone
from pathlib import Path

P = Path(__file__).resolve().parents[2]
L = P.parent / '4veco-lessen'
N = 'BOOK2-TEXTBOOK-PRODUCTION-1-224-ROOT-ADOPTION'
E = P / 'reports/sprints' / (N + '-evidence')
REVIEW = '456969885a83b2627868e8d66a9f09396c815016'
REL = 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.4 Gemengde opgaven elasticiteit'

def sha(raw):
    return hashlib.sha256(raw).hexdigest()

def now():
    return datetime.now(timezone.utc).isoformat()

def save(name, value):
    E.mkdir(exist_ok=True)
    with (E / name).open('x', encoding='utf-8', newline='\n') as stream:
        stream.write(json.dumps(value, ensure_ascii=False, indent=2) + '\n')

def bound(relative, commit):
    raw = subprocess.run(['git', 'show', commit + ':' + relative], cwd=P, capture_output=True, check=True).stdout
    assert (P / relative).read_bytes() == raw, relative
    return {'path': relative, 'commit': commit, 'raw_sha256': sha(raw)}

def probes():
    prefix = 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-224-REVIEW-'
    bindings = [bound(prefix + n + '.py', REVIEW) for n in ['checks', 'controller']]
    paths = ['build-scripts/content/book-2/b2_224.py'] + ['build-scripts/content/book-2/224/' + n for n in ['answers.md', 'check_render.py', 'exercises.md', 'target-answers.md', 'test_source.py']]
    bindings += [bound(n, '9acf684b78c42a5afbcb1253a7e9cd7711bdf7ab') for n in paths]
    bindings += [bound('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-224-BUILD-controller.py', '0e2349ecf50e817482bf2f5c1d6d5aedc32c9323')]
    spec = importlib.util.spec_from_file_location('unchanged_224_review_checks', P / (prefix + 'checks.py'))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    started = now()
    def root_save(name, original):
        assert name == '224-independent-probes.json'
        assert original['actor'] == 'paragraph_231_specialist_qc'
        assert len(original['math']) == 21
        assert len(original['actual_build_entry_negatives']) == 107
        assert len(original['whole_file_negatives']) == 15
        save('root-reexecuted-reviewer-probes.json', {
            'actor': 'codex-root', 'started': started, 'finished': now(),
            'status': 'PASS', 'predicate_author': 'paragraph_231_specialist_qc',
            'adaptation': 'Only module.save destination redirected; complete source/test/controller bytes unchanged.',
            'whole_module_bindings': bindings, 'native_positive_reproduction': False,
            'independent_review_completed_by_this_execution': False,
            'unchanged_predicate_result': original})
    module.save = root_save
    module.probes()

def commands():
    manifest = 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-224-REVIEW-evidence/224-full-r7-manifest.json'
    assert sha((P / manifest).read_bytes()) == 'da637ff2e0701463c70db85ccb6a4d63ffbad813c3c4d38795e69dc49402b9fe'
    entries = [
        ('source-tests', [sys.executable, 'build-scripts/content/book-2/224/test_source.py']),
        ('native-checker-read-only', [sys.executable, 'build-scripts/content/book-2/224/check_render.py', '--lesson-root', str(L), '--manifest', manifest]),
        ('student-web', ['node', 'scripts/validate-paragraph.js', '--mode', 'part-a', '--profile', 'student-web', str(L / REL)]),
        ('publisher-print', ['node', 'scripts/validate-paragraph.js', '--mode', 'part-a', '--profile', 'publisher-print', str(L / REL)]),
        ('structural', ['node', 'build-scripts/workflows/check-book-outline-currentness.js']),
        ('approved-production', ['node', 'build-scripts/workflows/check-book-outline-currentness.js', '--require-approved', '--action', 'paragraph_production', '--paragraph', '2.2.4']),
        ('approved-specialist', ['node', 'build-scripts/workflows/check-book-outline-currentness.js', '--require-approved', '--action', 'specialist_review', '--paragraph', '2.2.4']),
        ('durable', ['node', 'build-scripts/workflows/check-book2-target-authority-remediation.js', '--durable']),
        ('bundle', ['node', 'build-scripts/sprints/check-sprint-bundle.js', 'BOOK2-TEXTBOOK-PRODUCTION-1'])]
    records = []
    env = dict(os.environ)
    env.update(PYTHONIOENCODING='utf-8', PYTHONDONTWRITEBYTECODE='1')
    for label, argv in entries:
        started = now()
        result = subprocess.run(argv, cwd=P, env=env, capture_output=True)
        row = {'actor': 'codex-root', 'label': label, 'argv': argv, 'cwd': str(P),
               'started': started, 'finished': now(), 'exit_code': result.returncode,
               'stdout': result.stdout.decode('utf-8', errors='replace'),
               'stderr': result.stderr.decode('utf-8', errors='replace'),
               'stdout_base64': base64.b64encode(result.stdout).decode(),
               'stderr_base64': base64.b64encode(result.stderr).decode()}
        save('command-' + label + '.json', row)
        records.append({'label': label, 'exit_code': result.returncode})
        print(json.dumps(records[-1]), flush=True)
        assert result.returncode == 0, label
    save('commands.json', {'status': 'PASS', 'actor': 'codex-root', 'commands': records,
                           'actual_positive_native_rebuild': False, 'personal_views': 0})

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('mode', choices=['probes', 'commands', 'commands-r2'])
    args = parser.parse_args()
    if args.mode == 'commands-r2':
        E = E / 'commands-r2'
    probes() if args.mode == 'probes' else commands()
