"""HOW TO ADAPT: immutable S1 review binding and actual-commit scope evidence.

Never reinterpret these fixed references as a new content or QC decision.
All generated evidence is exclusive and reviewer-owned; source stays untouched.
"""
import importlib.util
import json
from pathlib import Path
import subprocess
import sys

HERE = Path(__file__).resolve().parent
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-REVIEW'
spec = importlib.util.spec_from_file_location('independent_audit', HERE / (PREFIX + '-audit.py'))
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)
OLD_LESSONS = 'b23e0056511fc5b9b10f0b8e6bbe130d2599c36b'


def history(name):
    path = HERE / name
    rel = path.relative_to(audit.ROOT).as_posix()
    raw = path.read_bytes()
    assert raw == audit.blob(audit.ROOT, audit.PREVIEW, rel)
    return raw, {'path': rel, 'sha256': audit.sha(raw)}


def bind():
    sources = audit.check_source()
    baseline = audit.read('baseline')
    assert audit.inventory() == baseline['paragraph_inventory']
    old_raw, old_ref = history('BOOK2-TEXTBOOK-PRODUCTION-1-223-REVIEW-inspection.json')
    review_raw, review_ref = history('BOOK2-TEXTBOOK-PRODUCTION-1-223-independent-paragraph-review-r3.md')
    build_raw, build_ref = history('BOOK2-TEXTBOOK-PRODUCTION-1-223-build-r3.json')
    old = json.loads(old_raw)
    build = json.loads(build_raw)
    assert old['reviewer'] == 'paragraph_223_independent_review'
    assert len(build['input_sources']) == 6
    for rec in build['input_sources']:
        rel = 'build-scripts/' + rec['path'].replace('\\', '/').split('/build-scripts/')[1]
        assert audit.sha(audit.blob(audit.ROOT, audit.PBASE, rel)) == rec['sha256']
        if rel != audit.GENERATOR:
            assert audit.sha((audit.ROOT / rel).read_bytes()) == rec['sha256']
    for name in baseline['native_files']:
        assert audit.sha(audit.blob(audit.LESSONS, OLD_LESSONS,
                                  (audit.builder.LESSON_REL / name).as_posix())) == baseline['paragraph_inventory'][name]
    own = audit.read('inspection')
    assert own['reviewer'] == 'paragraph_223_successor_delta_review'
    assert len(own['pages']) == 3 and len(own['figures']) == 4
    rows, native_assets = [], {}
    for rec in build['documents']:
        for asset in rec['assets']:
            name = '_assets/' + asset['path'].replace('\\', '/').split('/')[-1]
            assert baseline['paragraph_inventory'][name] == asset['sha256']
            native_assets[name] = asset['sha256']
    assert len(native_assets) == 8
    for mode in ['full', 'thin', 'print']:
        current = audit.read(mode + '-parity')
        assert current['pass'] and current['page_count'] == 32
        count = 0
        for previous, fresh, bdoc in zip(old['documents'], current['editions'], build['documents']):
            assert previous['kind'] == fresh['kind']
            assert previous['pdf_sha256'] == fresh['pdf_sha256'] == bdoc['pdf_sha256']
            assert previous['generation_manifest_sha256'] == baseline['historical'][fresh['kind']]['manifest_sha256']
            assert previous['proof_directory'] == baseline['historical'][fresh['kind']]['directory']
            assert len(previous['pages']) == len(fresh['pages'])
            for page in previous['pages']:
                name = Path(page['path']).name
                assert page['reviewer_observation']
                assert page['sha256'] == fresh['pages'][name]['raw']
                assert audit.sha((audit.ROOT / fresh['proof_directory'] / 'pages' / name).read_bytes()) == page['sha256']
                count += 1
            if mode == 'full':
                sample, = [p for p in own['pages'] if p['kind'] == fresh['kind']]
                name = f"page-{sample['page']:03}.png"
                assert sample['sha256'] == fresh['pages'][name]['raw']
                rows.append({'kind': fresh['kind'], 'pdf_sha256': fresh['pdf_sha256'],
                             'fresh_manifest_sha256': fresh['manifest_sha256'],
                             'original_manifest_sha256': previous['generation_manifest_sha256'],
                             'fresh_page': fresh['proof_directory'] + '/pages/' + name,
                             'old_page': previous['proof_directory'] + '/pages/' + name,
                             'sha256': sample['sha256'], 'decoded_pixel': fresh['pages'][name]['pixel']})
        assert count == 32
        for fig in own['figures']:
            assert fig['sha256'] == native_assets[fig['path']] == current['native_figures'][fig['path']]['raw']
    rel221 = (audit.builder.LESSON_REL.parent / '2.2.1 Prijselasticiteit' /
              '2.2.1 Prijselasticiteit – paragraaf.md').as_posix()
    diff = subprocess.check_output(['git', 'diff', '--no-ext-diff', OLD_LESSONS, audit.LBASE,
                                    '--', rel221], cwd=audit.LESSONS).decode('utf-8')
    assert diff and audit.sha(audit.blob(audit.LESSONS, OLD_LESSONS, rel221)) == audit.PAIRS[Path(rel221).name][0]
    audit.save('binding', {'pass': True, 'original_inspection': old_ref, 'original_review': review_ref,
                          'original_build': build_ref, 'all_96_fresh_page_bindings': True,
                          'all_20_native_files_equal_original_reviewed_lesson_git': OLD_LESSONS,
                          'original_six_build_inputs_bound': True, 'sample_page_bindings': rows,
                          'four_figures': audit.read('full-parity')['native_figures'],
                          'own_inspection_sha256': audit.sha((HERE / (PREFIX + '-inspection.json')).read_bytes()),
                          'accepted_221_markdown_delta': diff, 'current_sources': sources})
    print('PASS original reviewer32-page binding, all96 fresh pages, original20 native bytes, own3 samples/four figures')


def scope(head):
    import re
    assert re.fullmatch('[0-9a-f]{40}', head)
    records = []
    def command(argv, cwd=audit.ROOT, expected=0):
        process = subprocess.run(argv, cwd=cwd, capture_output=True, encoding='utf-8', errors='replace')
        rec = {'command': argv, 'cwd': str(cwd), 'exit_code': process.returncode,
               'stdout': process.stdout, 'stderr': process.stderr, 'expected_exit': expected}
        records.append(rec)
        assert process.returncode == expected, rec
        return process.stdout
    assert command(['git', 'rev-parse', 'HEAD']).strip() == head
    changed = command(['git', 'diff', '--name-status', audit.PREVIEW, head])
    rows = [line.split('\t') for line in changed.splitlines()]
    assert rows and all(status == 'A' and name.startswith('reports/sprints/' + PREFIX + '-')
                        for status, name in rows)
    narrow = json.loads(command(['node', 'build-scripts/workflows/check-paragraph-lane-scope.js',
                                 '--lane', 'shared', '--base', audit.PREVIEW, '--head', head, '--json'], expected=1))
    assert not narrow['ok']
    whole = json.loads(command(['node', 'build-scripts/workflows/check-paragraph-lane-scope.js',
                                '--lane', 'shared', '--base', audit.PBASE, '--head', head, '--json']))
    assert whole['ok']
    command(['git', 'diff', '--check', audit.PREVIEW, head])
    command(['git', 'diff', '--check', audit.PBASE, head])
    assert command(['git', 'rev-parse', 'HEAD'], cwd=audit.LESSONS).strip() == audit.LBASE
    assert not command(['git', 'diff', '--name-status', audit.LBASE, 'HEAD'], cwd=audit.LESSONS).strip()
    assert not command(['git', 'status', '--porcelain'], cwd=audit.LESSONS).strip()
    audit.save('scope', {'pass': True, 'actual_payload_head': head, 'strict_own_prefix_only': True,
                        'strict_own_changed_files': len(rows), 'lesson_head': audit.LBASE,
                        'native_narrow_result': 'FAIL expected: evidence-only range has no shared source',
                        'native_complete_candidate_result': 'PASS genuine S1 source-bearing range',
                        'commands': records})
    print(f'PASS actual {head}: {len(rows)} own evidence paths; honest narrow FAIL; genuine whole source PASS; lesson clean unchanged')


if __name__ == '__main__':
    if sys.argv[1] == 'binding':
        bind()
    elif sys.argv[1] == 'scope':
        scope(sys.argv[2])
    else:
        raise ValueError('binding or scope <full payload SHA> required')
