"""Actual payload and final-pair scope; no synthetic lane anchor or acceptance."""
from pathlib import Path
import argparse
import importlib.util
import json
import subprocess

RUNNER = Path(__file__).with_name('BOOK2-TEXTBOOK-PRODUCTION-1-213-S1-run.py')
spec = importlib.util.spec_from_file_location('own_controller', RUNNER)
d = importlib.util.module_from_spec(spec)
spec.loader.exec_module(d)
REF = '8fd54c00665f02c96806a85d453f0bd69cdd8394'
PMAIN = '96416b6b5bd57094576e9aba0a42d682584ec479'
LMAIN = 'f09fd6e88edc5049b026b16b0158e7e188091d2d'
INDEXES = {f'reports/github-agent-index-{repo}.{ext}' for repo in ('platform', 'lessen') for ext in ('json', 'md')}


def changed(root, base, head):
    return [n.decode('utf-8') for n in subprocess.check_output(['git', 'diff', '--name-only', '-z', base, head], cwd=root).split(b'\0') if n]


def run(head, label, indexes):
    d.verify_controller(REF)
    base = json.loads((d.OUT / 'baseline.json').read_text(encoding='utf-8'))
    paths = changed(d.ROOT, d.PBASE, head)
    source = {d.GENERATOR, d.TEST}
    allowed = lambda n: n in source or n.startswith('reports/sprints/' + d.PREFIX + '-') or (indexes and n in INDEXES)
    assert source.issubset(paths) and all(allowed(n) for n in paths)
    assert changed(d.LESSONS, d.LBASE, d.LBASE) == []
    inherited_counts = {}
    for repository, root in [('platform', d.ROOT), ('lessons', d.LESSONS)]:
        for name, binding in base['inherited'][repository].items():
            if repository == 'platform' and indexes and name in INDEXES:
                continue
            assert d.sha((root / name).read_bytes()) == binding['raw_sha256'], (repository, name)
        inherited_counts[repository] = len(base['inherited'][repository])
    assert d.native() == base['native'] and d.archives() == base['archives']
    assert not (d.FOLDER / '2.1.3-textbook-handoff.md').exists()
    scopes = []
    for repository, root, lane, own_base, main_base, current in [
            ('platform', d.ROOT, 'shared', d.PBASE, PMAIN, head),
            ('lessons', d.LESSONS, 'textbook', d.LBASE, LMAIN, d.LBASE)]:
        for kind, comparison in [('owned', own_base), ('complete', main_base)]:
            result = d.command(['node', 'build-scripts/workflows/check-paragraph-lane-scope.js',
                                '--cwd', d.normal(root), '--lane', lane, '--base', comparison,
                                '--head', current, '--json'],
                               f'{label}-{repository}-{kind}-native-scope.json', cwd=d.normal(d.ROOT), allow_failure=True)
            parsed = json.loads(result['stdout'])
            assert not parsed['categories']['unknown']
            # Empty lessons delta has no invented lane-owned anchor.
            if repository == 'lessons' and kind == 'owned':
                assert not any(parsed['categories'].values())
                assert result['exit_code'] in (0, 1)
            else:
                assert result['exit_code'] == 0 and parsed['ok']
            scopes.append(dict(repository=repository, kind=kind, base=comparison, head=current,
                               native_verdict='PASS' if parsed['ok'] else 'FAIL', unknown=0,
                               counts={key: len(values) for key, values in parsed['categories'].items()},
                               failures=parsed['failures']))
    whitespace = []
    for name, argv in [('native', ['git', 'diff', '--check', d.PBASE, head]),
                       ('cr-at-eol', ['git', '-c', 'core.whitespace=cr-at-eol', 'diff', '--check', d.PBASE, head]),
                       ('source', ['git', 'diff', '--check', d.PBASE, head, '--', 'build-scripts/'])]:
        result = d.command(argv, f'{label}-whitespace-{name}.json', cwd=d.normal(d.ROOT), allow_failure=True)
        if name != 'native':
            assert result['exit_code'] == 0
        whitespace.append(dict(mode=name, exit_code=result['exit_code']))
    new_files = []
    for name in paths:
        raw = (d.ROOT / name).read_bytes()
        committed = d.succession.blob(d.ROOT, head, name)
        assert raw == committed or d.succession.canonical(raw) == committed
        new_files.append(dict(path=name, raw_sha256=d.sha(raw), git_blob_sha256=d.sha(committed)))
    d.save(label + '-scope.json', dict(result='PASS', controller=d.verify_controller(REF),
           platform_base=d.PBASE, platform_head=head, lesson_base=d.LBASE, lesson_head=d.LBASE,
           owned_changed_paths=new_files, strict_owned_unknown=0, inherited_counts=inherited_counts,
           old_raw_preservation=True, allowed_index_tail=indexes, actual_scopes=scopes,
           whitespace=whitespace, native=d.native(), current_review_unchanged=True,
           stale_qc_unchanged=True, handoff_absent=True, no_independent_acceptance=True))
    print(label, 'PASS: exact payload, inherited raw preservation, genuine scopes0UNKNOWN')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--head', required=True)
    parser.add_argument('--label', required=True)
    parser.add_argument('--indexes', action='store_true')
    args = parser.parse_args()
    run(args.head, args.label, args.indexes)
