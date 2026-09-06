"""Independent 223 ALT delta / paragraph review evidence, exact owned inputs only.

HOW TO ADAPT: create a different task-owned checker and re-establish its custody.
Native command, rendering, ZIP/parity and global reservation primitives are
attributed to the completely read ALT/root helpers; they do not supply this
reviewer's independent custody, arithmetic, negative probes or personal views.
No pupil source correction, QC renewal, handoff or root acceptance is performed.
"""
import argparse
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import re
import tempfile
from contextlib import ExitStack
from fractions import Fraction as F
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-223-ALT-REVIEW'
PINPUT = '5c914aecb17cd47ee1aa1cf1cd8db13131f34827'
LINPUT = 'f52b039c00d16cf9ee59573b31cae39de96ce779'
ORIGINAL = '3510fc4dd30c9c01f44111ecc022ae239e855758'
QC = 'e4fc984c9cb28c6f03d0f3040136af73315ca916'
LQC = '6663532621e1347c12f691862ee85200665ad14f'
spec = importlib.util.spec_from_file_location('attributed_alt_primitives', ROOT / 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-ALT-check.py')
a = importlib.util.module_from_spec(spec)
spec.loader.exec_module(a)
n = a.n
a.PREFIX = n.PREFIX = PREFIX
n.PROOF = n.OUT / (PREFIX + '-evidence')
B = n.builder
SOURCE = 'build-scripts/content/book-2/'
CONTROLLER = SOURCE + '223/test_successor.py'
ALT_TEST = SOURCE + '223/test_alt_metadata.py'
FIXES = {
    SOURCE + '223/theory.md': (
        '![Figuur 2: Zoek eerst het teken van Ei en daarna het juiste gebied.](_assets/2.2.3_fig_2.svg)',
        'Ei-schaal: inferieur bij Ei<0, normaal bij 0<Ei<1 en luxe bij Ei>1; open grenspunten 0 en 1 zonder categorie.'),
    SOURCE + '223/exercises.md': (
        '![Figuur 4: Vergelijk afzonderlijke veranderingen steeds met dezelfde beginsituatie.](_assets/2.2.3_fig_4.svg)',
        "Drie scenario's: beginsituatie, alleen hoger inkomen en terug naar dezelfde basis voor alleen een hogere andere prijs."),
}
INSERTION = '''ALT_REPLACEMENTS = {
    "build-scripts/content/book-2/223/theory.md": (
        '![Figuur 2: Zoek eerst het teken van Ei en daarna het juiste gebied.](_assets/2.2.3_fig_2.svg)',
        'Ei-schaal: inferieur bij Ei<0, normaal bij 0<Ei<1 en luxe bij Ei>1; open grenspunten 0 en 1 zonder categorie.'),
    "build-scripts/content/book-2/223/exercises.md": (
        '![Figuur 4: Vergelijk afzonderlijke veranderingen steeds met dezelfde beginsituatie.](_assets/2.2.3_fig_4.svg)',
        "Drie scenario's: beginsituatie, alleen hoger inkomen en terug naar dezelfde basis voor alleen een hogere andere prijs."),
}


def expected_source(name):
    """Complete immutable original bytes plus only one fixed native alt attribute."""
    value = blob(ROOT, BASE, name)
    if name in ALT_REPLACEMENTS:
        image, alt = ALT_REPLACEMENTS[name]
        before = (image + '\\n').encode()
        after = (image + '{alt="' + alt + '"}\\n').encode()
        if value.count(before) != 1 or after in value:
            raise AssertionError(f"Nonunique or already evolved original image: {name}")
        value = value.replace(before, after, 1)
    return value


'''


def once(value, before, after):
    assert value.count(before) == 1 and after not in value, 'Missing/duplicate/already-evolved fixed anchor'
    return value.replace(before, after, 1)


def expected_sources():
    names = ['b2_223.py', 'print_pipeline.py', '223/check_render.py', '223/test_source.py',
             '223/theory.md', '223/exercises.md', '223/answers.md', '223/target-answers.md']
    result = {SOURCE + name: n.blob(ORIGINAL, SOURCE + name) for name in names}
    for name, pair in n.PAIRS.items():
        before, after = (f'"{name}": "{value}"'.encode() for value in pair)
        result[n.GEN] = once(result[n.GEN], before, after)
    assert n.sha(result[n.GEN]) == '5b18047a04ecd093a6d469fe5d69c049351f9c5ed21c3ad1b2aa336107d9f57c'
    for name, (image, alt) in FIXES.items():
        result[name] = once(result[name], (image + '\n').encode(), (image + '{alt="' + alt + '"}\n').encode())
    controller = n.blob(QC, CONTROLLER)
    for before, after in [
        (b'def required_inputs():', INSERTION.encode() + b'def required_inputs():'),
        (b'require_exact((ROOT / name).read_bytes(), blob(ROOT, BASE, name))', b'require_exact((ROOT / name).read_bytes(), expected_source(name))'),
        (b'            original = blob(ROOT, BASE, name)\n', b'            original = expected_source(name)\n'),
    ]:
        controller = once(controller, before, after)
    result[CONTROLLER] = controller
    # New guard has no immutable pre-existence: whole exact published blob and
    # externally assigned candidate hash, not a mutable self-generated file.
    result[ALT_TEST] = n.blob(PINPUT, ALT_TEST)
    assert n.sha(result[ALT_TEST]) == '314673ab7bf6652d1ba6c1c42ef6f10598ffead34d12785009c5ab77b0187f3d'
    assert n.sha(controller) == 'f2c3cb4773b6730a58d3720699202f80d8b5f8b22a779b2b8cddf664b491d927'
    return result


def custody(overrides=None):
    rows = []
    for name, expected in expected_sources().items():
        actual = (overrides or {}).get(name, (ROOT / name).read_bytes())
        assert actual == expected and n.sha(actual) == n.sha(expected), name
        rows.append({'path': name, 'raw_sha256': n.sha(actual), 'complete_expected_bytes_equal': True})
    return rows


def baseline():
    assert n.git('rev-parse', 'HEAD', cwd=n.LESSONS).decode().strip() == LINPUT
    assert not n.git('status', '--porcelain', cwd=n.LESSONS).strip()
    instructions = []
    previous = json.loads(Path('C:/wt/book2-214-plan-review-20260906/4veco-platform/reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-evidence.json').read_text(encoding='utf-8'))
    for old in previous['instructions']:
        path = (ROOT if old['repository'] == '4veco-platform' else n.LESSONS) / old['path']
        actual = n.sha(path.read_bytes())
        assert actual == old['raw_sha256'], 'Reread changed instruction before proceeding: ' + str(path)
        instructions.append({**old, 'current_raw_sha256': actual, 'personal_full_read_reused_unchanged': True})
    files = n.folder()
    assert len(files) == 25 and '2.2.3-textbook-handoff.md' not in files
    for name, digest in files.items():
        assert digest == n.sha(n.blob(LINPUT, (B.LESSON_REL / name).as_posix(), n.LESSONS))
    assert files['2.2.3-quality-ref.yaml'] == '6d93128f5cdcd363fc4a7e5a6e5d462162f130a18f4f01fd4656be22ef9e2586'
    assert files['2.2.3-review.md'] == '793c8460e7d20e8a2e40d7e8912c969c94a091e67fa25566c812264c8769539e'
    old = []
    for raw in n.git('ls-tree', '-r', '--name-only', '-z', PINPUT).split(b'\0'):
        name = raw.decode()
        if name.startswith('reports/') and '223' in name:
            data = (ROOT / name).read_bytes()
            assert data == n.blob(PINPUT, name), name
            old.append({'path': name, 'sha256': n.sha(data)})
    qc_paths = [r.decode() for r in n.git('ls-tree', '-r', '--name-only', '-z', QC).split(b'\0') if r and r.decode().startswith('reports/') and '223' in r.decode()]
    assert len(qc_paths) == 721
    for name in qc_paths:
        assert (ROOT / name).read_bytes() == n.blob(QC, name)
    history = {}
    for kind in n.KINDS:
        choices = list((n.OUT / 'BOOK2-TEXTBOOK-PRODUCTION-1-223-QC-evidence').glob(f'223-{kind}-*-r14'))
        assert len(choices) == 1
        history[kind] = choices[0].relative_to(ROOT).as_posix()
    inputs = []
    for path, expected in a.guard.required_inputs():
        data = path.read_bytes()
        assert data == n.blob(LQC, path.relative_to(n.LONG).as_posix(), n.LESSONS)
        assert B.lf_hash(path) == expected
        inputs.append({'path': path.relative_to(n.LONG).as_posix(), 'raw_sha256': n.sha(data), 'lf_sha256': expected})
    n.save('baseline', {'pass': True, 'platform_input': PINPUT, 'lessons_input': LINPUT,
        'operational_plan_commit': '2d3d3e1a4a5b679c14cb0955d22f7ba0bbad73fd', 'instructions': instructions,
        'new_personally_full_read': ['skills/econ-paragraph-review.md', '223 plan', 'all four 223 authored content files', 'full generator/pipeline/three tests/native checker/thin wrapper', 'original paragraph review and specialist QC and ALT report/helper'],
        'source_binding': custody(), 'paragraph_files': files, 'native_files': a.native_names(),
        'old_evidence': old, 'preserved_original_QC_files': 721, 'history': history, 'six_inputs': inputs,
        'pass0': 'PASS: 25 files, 20 native, 4 complete SVG/PNG pairs; three editions and mandatory source inputs present',
        'root_acceptance': 'PENDING', 'distinct_specialist_QC': 'REVISE', 'handoff': 'ABSENT'})


def metadata():
    from bs4 import BeautifulSoup, NavigableString, Tag
    def semantic(node):
        if isinstance(node, NavigableString):
            value = ' '.join(str(node).split())
            return ('text', value) if value else None
        if isinstance(node, Tag):
            return (node.name, sorted((k, tuple(v) if isinstance(v, list) else v) for k, v in node.attrs.items()),
                    tuple(v for child in node.children if (v := semantic(child)) is not None))
        return None
    rows, changed = [], []
    for kind in n.KINDS:
        path = n.DEST / f'{B.STEM} – {kind}.md'
        old = a.input_blob(path.name)
        expected = old
        for image, alt in FIXES.values():
            anchor = (image + '\n').encode()
            if anchor in expected:
                expected = once(expected, anchor, (image + '{alt="' + alt + '"}\n').encode())
        assert path.read_bytes() == expected
        original_html = a.prepare_html(old.decode(), path)[0].replace('\r\n', '\n').replace('\r', '\n').encode()
        final_html = a.prepare_html(expected.decode(), path)[0].replace('\r\n', '\n').replace('\r', '\n').encode()
        assert original_html == a.input_blob(path.with_suffix('.html').name)
        assert final_html == path.with_suffix('.html').read_bytes()
        before, after = (BeautifulSoup(x, 'html.parser') for x in (original_html, final_html))
        assert before.get_text().split() == after.get_text().split()
        assert len(before.find_all('img')) == len(after.find_all('img'))
        local = []
        for index, (x, y) in enumerate(zip(before.find_all('img'), after.find_all('img')), 1):
            assert x['src'] == y['src']
            if x['alt'] != y['alt']:
                pairs = [(image, alt) for image, alt in FIXES.values() if image[2:image.index('](')] == x['alt']]
                assert len(pairs) == 1 and y['alt'] == pairs[0][1] and len(y['alt']) in (109, 118)
                oldcap, newcap = x.find_parent('figure').figcaption, y.find_parent('figure').figcaption
                assert oldcap.get_text().split() == newcap.get_text().split()
                assert oldcap['aria-hidden'] == 'true' and 'aria-hidden' not in newcap.attrs
                local.append({'image_index': index, 'before': x['alt'], 'after': y['alt'], 'characters': len(y['alt']),
                              'visible_caption': newcap.get_text(' ', strip=True), 'aria_hidden': 'true -> absent'})
                x['alt'] = y['alt']
                del oldcap['aria-hidden']
        assert semantic(before) == semantic(after), 'Unexpected element/attribute/text/image change'
        rows.append({'kind': kind, 'complete_old_and_new_native_HTML_bytes_equal': True, 'semantic_DOM_equal_after_only_explicit_accessibility_delta': True,
                     'old_md_sha256': n.sha(old), 'new_md_sha256': n.sha(expected), 'old_html_sha256': n.sha(original_html),
                     'new_html_sha256': n.sha(final_html), 'affected_images': local})
        changed.extend(local)
    assert len(changed) == 3
    files = n.folder()
    delta = [name for name, digest in files.items() if digest != n.sha(a.input_blob(name))]
    expected_delta = [f'{B.STEM} – {kind}.{ext}' for kind in ['paragraaf', 'opgaven'] for ext in ['md', 'html', 'zip']]
    assert sorted(delta) == sorted(expected_delta)
    n.save('independent-metadata', {'pass': True, 'sources': custody(), 'exact_six_native_changes': delta, 'documents': rows,
                                   'complete_visible_captions_unchanged': True, 'other_nodes_text_images_exact': True})


def negatives():
    expected = expected_sources()
    mutations = []
    # These fixtures do not touch the live workspace. Real complete bytes and
    # real SHA256, not patched hashes, enter the independent pre-build gate.
    for name, value in expected.items():
        trials = [('unrelated-append', value + b'\n# independent unrelated mutation\n')]
        if name in FIXES:
            image, alt = FIXES[name]
            trials += [('original-bad-caption-fallback', n.blob(ORIGINAL, name)),
                       ('full-caption-changed', value.replace(image.encode(), image.replace('Figuur', 'Ander onderschrift').encode(), 1)),
                       ('imperative', value.replace(alt.encode(), b'Vergelijk de drie situaties.', 1)),
                       ('long-alt', value.replace(alt.encode(), b'X' * 121, 1)),
                       ('empty-alt', value.replace(alt.encode(), b'', 1))]
        if name.endswith('.py'):
            trials.append(('guard/controller-weakening', value.replace(b'assert', b'not_assert', 1) if b'assert' in value else value + b'\ndef unchecked(): pass\n'))
        for mode, changed in trials:
            assert changed != value
            with patch.object(B, 'build') as build:
                try:
                    custody({name: changed})
                    B.build(n.LONG)
                except AssertionError:
                    pass
                else:
                    raise AssertionError('Independent source-custody gate accepted bad fixture')
                build.assert_not_called()
            mutations.append({'path': name, 'mode': mode, 'expected_sha256': n.sha(value), 'fixture_sha256': n.sha(changed), 'rejected_before_build': True})
    inputs, valid = [], False
    with tempfile.TemporaryDirectory(prefix='independent-223-alt-review-', dir='C:/wt') as temp:
        root = Path(temp).resolve()
        assert root.parent == Path('C:/wt').resolve()
        (root / B.LESSON_REL).mkdir(parents=True)
        copies = []
        for path, pin in a.guard.required_inputs():
            fixture = root / path.relative_to(n.LONG)
            fixture.parent.mkdir(parents=True, exist_ok=True)
            fixture.write_bytes(path.read_bytes())
            assert B.lf_hash(fixture) == pin
            copies.append((fixture, pin))
        class AuthorityReached(Exception): pass
        with patch.object(B.subprocess, 'run', side_effect=AuthorityReached) as process, patch.object(Path, 'mkdir') as mkdir:
            try: B.build(root)
            except AuthorityReached: valid = True
            process.assert_called_once()
            assert 'check-book-outline-currentness.js' in process.call_args.args[0][1]
            mkdir.assert_not_called()
        for target, pin in copies:
            original = target.read_bytes()
            for mode in ('missing', 'forged'):
                if mode == 'missing': target.unlink()
                else: target.write_bytes(original + b'\nIndependent forged prerequisite 2026-09-06\n')
                actual = B.lf_hash(target) if target.exists() else None
                assert actual != pin
                with ExitStack() as stack:
                    effects = [stack.enter_context(patch.object(obj, attr)) for obj, attr in (
                        (B.subprocess, 'run'), (Path, 'mkdir'), (Path, 'write_text'), (Path, 'write_bytes'),
                        (B, 'build_document'), (B, 'asset_sources'), (B, 'documents'), (B, 'zip_document'), (B, 'render_proof'))]
                    try: B.build(root)
                    except (ValueError, FileNotFoundError) as error:
                        assert isinstance(error, FileNotFoundError if mode == 'missing' else ValueError)
                    else: raise AssertionError('Forged or missing required input accepted')
                    assert all(e.call_count == 0 for e in effects)
                inputs.append({'path': target.relative_to(root).as_posix(), 'mode': mode, 'expected_lf_sha256': pin,
                               'real_fixture_lf_sha256': actual, 'lf_hash_unpatched': True, 'side_effect_calls': 0})
                target.write_bytes(original)
    anchors = []
    for name, (image, alt) in FIXES.items():
        original = n.blob(ORIGINAL, name)
        before, after = (image + '\n').encode(), (image + '{alt="' + alt + '"}\n').encode()
        for mode, fixture in [('missing', original.replace(before, b'', 1)), ('duplicate', original + before), ('already-transformed', expected[name])]:
            try: once(fixture, before, after)
            except AssertionError: anchors.append({'path': name, 'mode': mode, 'rejected': True})
            else: raise AssertionError('Bad fixed anchor accepted')
    n.save('independent-negative-probes', {'pass': True, 'valid_exact_inputs_reach_authority': valid,
        'source_controller_guard_mutations': mutations, 'actual_missing_forged_six_inputs': inputs,
        'unique_anchor_counterexamples': anchors, 'no_live_source_mutation': True, 'side_effects': 0})


def math_review():
    record = json.loads((ROOT / 'references/authored/course-target-exercises.json').read_text(encoding='utf-8-sig'))
    target = [r for r in record['exercises'] if r['id'] == '2.2.3']
    assert len(target) == 1
    target = target[0]
    assert n.sha(json.dumps(target, ensure_ascii=False, separators=(',', ':')).encode()) == '9a3a29bcedc16739b74b66b2bb8e136b37e86c7f5cfee3ee35ea37c4bdeed1c5'
    assert [q['points'] for q in target['target_exercise']['subquestions']] == [3, 2, 4, 4, 3]
    ratios = [(10,15,F(3,2)),(10,-5,F(-1,2)),(10,5,F(1,2)),(20,10,F(1,2)),(20,-4,F(-1,5)),(20,-5,F(-1,4)),
              (10,-2,F(-1,5)),(10,5,F(1,2)),(8,12,F(3,2)),(8,-4,F(-1,2)),(20,-8,F(-2,5)),
              (5,8,F(8,5)),(5,-2,F(-2,5)),(10,3,F(3,10)),(10,-4,F(-2,5)),(5,-3,F(-3,5)),(10,4,F(2,5)),(10,-6,F(-3,5))]
    for denominator, numerator, answer in ratios: assert F(numerator, denominator) == answer
    functions = []
    for label, fixed, coeff_y, coeff_z, y, y1, z, z1, expected, ei in [
        ('W3',40,F(5,1000),1,30000,36000,10,14,(200,230,204),F(3,4)),
        ('G2/O4',50,F(5,1000),F(1,2),20000,24000,20,24,(160,180,162),F(5,8)),
        ('G3/O5',90,F(4,1000),1,25000,30000,10,15,(200,220,205),F(1,2)),
        ('I2/O8',70,F(5,1000),1,20000,24000,10,14,(180,200,184),F(5,9)),
        ('target9d/e',80,F(1,100),F(1,2),30000,33000,20,24,(390,420,392),F(10,13)),
    ]:
        q = lambda income, other_price: fixed + coeff_z * other_price + coeff_y * income
        values = q(y,z), q(y1,z), q(y,z1)
        assert values == expected
        elasticity = ((values[1]-values[0])/values[0]) / F(y1-y,y)
        assert elasticity == ei
        assert q(F(y,12),z) != values[0] and q(y1,z1) != values[2]
        assert ((values[1]-values[0])/values[1]) / F(y1-y,y) != ei
        assert coeff_y != ei
        functions.append({'context': label, 'baseline_Yonly_reset_Pzonly': [str(v) for v in values], 'Ei_exact': str(ei),
                          'rejected_wrong_units_new_base_no_reset_coefficient_as_Ei': True})
    def category(e):
        return 'inferieur' if e < 0 else 'normaal' if 0 < e < 1 else 'luxe' if e > 1 else None
    assert [category(v) for v in [F(-1,2),0,F(1,2),1,F(3,2)]] == ['inferieur',None,'normaal',None,'luxe']
    assert F(-10,20) == F(-1,2) and 60-2*8 == 44 and (40-2*5+10,40-2*5+12)==(40,42)
    assert (210-200,205-200,215-200) == (10,5,15)
    assert F(15,200) / F(3000,30000) != F(10,200) / F(3000,30000)
    assert 2+11+8+2+6+14+11 == 54 and 54+15 == 69 and 69+8+4 == 81
    answers = (n.DEST / f'{B.STEM} – antwoorden.md').read_text(encoding='utf-8')
    for fragment in ['10/13', '0,77', '392', '390', '33.000', '30.000', 'Px=10', 'Pz=20']:
        assert fragment in answers, fragment
    docs = {kind:(n.DEST / f'{B.STEM} – {kind}.md').read_bytes() for kind in n.KINDS}
    generated = B.documents(target)
    for kind in n.KINDS:
        assert docs[kind] == (generated[kind].rstrip() + '\n').encode()
    n.save('independent-mathematics', {'pass': True, 'frozen_target': target, 'ratio_cases':len(ratios),
        'function_chains':functions, 'five_subtotals': [3,2,4,4,3], 'total_points':16,
        'Ei_boundaries_unlabelled': True, 'annual_Y_reset_old_base_and_dimensionless_ratios': True,
        'combined_change_counterexample_rejected':True, 'complete_native_MD_matches_full_sources_and_target_serialization':True,
        'bonus_full_answer_and_four_explicit_criteria_personally_checked':True,
        'closing': ['Ev=-0.5; Ei undefined with no income change', '40 -> 42 bookings/week, Px=5 fixed'],
        'route_minutes': {'core':54,'core_and_support':69,'all':81,'status':'UNOBSERVED'},
        'coverage_basis':'Reviewer personally read entire theory/exercises/answers/target answers/current target and complete plan; arithmetic is independently recomputed, not a transferred original test result.'})


def reproduce(mode):
    custody()
    assert n.folder() == n.read('baseline')['paragraph_files']
    a.reserve(mode)
    reservation = n.read(mode + '-reservation')
    assert reservation['unavailable_worktrees'] == [], 'Complete global scan required before generation'
    if mode != 'print':
        a.reproduce(mode)
    else:
        n.command('print-process', ['C:/Python314/python.exe', str(Path(__file__).resolve()), 'print-inner'])
        a.verify(mode)


def integrity():
    base = n.read('baseline')
    current = n.folder()
    assert set(current) == set(base['paragraph_files'])
    assert current['2.2.3-review.md'] == 'e603b62ba2d77e1c33db6aeeaeb24d9b41ec7a136f26020bc3b5081e0a2e56a4'
    for name, digest in current.items():
        if name != '2.2.3-review.md': assert digest == base['paragraph_files'][name], name
    for row in base['old_evidence']:
        assert n.sha((ROOT / row['path']).read_bytes()) == row['sha256'], row['path']
    assert not (n.DEST / '2.2.3-textbook-handoff.md').exists()
    for mode in ['full','thin','print']:
        for rec in n.read(mode + '-parity')['documents']:
            directory = ROOT / rec['proof_directory']
            assert n.sha((directory / 'manifest.json').read_bytes()) == rec['manifest_sha256']
            for page in rec['pages']:
                assert n.sha((directory / 'pages' / page['name']).read_bytes()) == page['raw_sha256']
    n.save('final-integrity', {'pass':True,'source_binding':custody(),'all25_current_files':current,
        'preserved_prior_evidence_files':len(base['old_evidence']),'preserved_original_QC_files':721,
        'canonical_review_sha256':current['2.2.3-review.md'],'canonical_QC_exact_REVISE':True,
        'all_old_pending_and_failed_evidence_preserved':True,'new_96_color_proof_pages_bound':True,
        'handoff':'ABSENT','distinct_specialist_renewal':'PENDING','root_acceptance':'PENDING'})


def bind_views():
    manual, parity, gray = n.read('observations'), n.read('full-parity'), n.read('grayscale')
    pages, figures = [], []
    for rec in parity['documents']:
        notes = manual['documents'][rec['kind']]
        assert len(notes) == len(rec['pages'])
        for index, (page, observations) in enumerate(zip(rec['pages'], notes), 1):
            color_path = ROOT / rec['proof_directory'] / 'pages' / page['name']
            grayscale = next(r for r in gray['rows'] if Path(r['path']).name == rec['kind'] + '-' + page['name'])
            assert n.sha(color_path.read_bytes()) == page['raw_sha256']
            assert n.sha((ROOT / grayscale['path']).read_bytes()) == grayscale['raw_sha256']
            assert len(observations) == 2 and all(observations)
            pages.append({'kind':rec['kind'],'page':index,
                'color':{'path':color_path.relative_to(ROOT).as_posix(),'raw_sha256':page['raw_sha256'],'personal_observation':observations[0]},
                'grayscale':{**grayscale,'personal_observation':observations[1]}})
    for rec, observations in zip(parity['figures'], manual['figures']):
        i = rec['number']
        grayrec = next(r for r in gray['rows'] if r['kind'] == 'figure' and r['number'] == i)
        assert n.sha((n.DEST / f'_assets/2.2.3_fig_{i}.png').read_bytes()) == rec['png_sha256']
        assert n.sha((ROOT / grayrec['path']).read_bytes()) == grayrec['raw_sha256']
        figures.append({**rec,'color_personal_observation':observations[0],'grayscale':{**grayrec,'personal_observation':observations[1]}})
    assert len(pages) == 32 and len(figures) == 4
    n.save('personal-inspection',{'actor':manual['actor'],'role':manual['role'],'method':manual['method'],
        'manual_observations_raw_sha256':n.sha((n.OUT / f'{PREFIX}-observations.json').read_bytes()),
        'pages':pages,'figures':figures,'personally_opened_full_color_pages':32,'personally_opened_full_grayscale_pages':32,
        'personally_opened_native_color_figures':4,'personally_opened_native_grayscale_figures':4,
        'visible_defects':[],'limits':manual['limits'],'generation_manifests_unchanged_PENDING':True})


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode',choices=['baseline','metadata','negatives','math','full','thin','print','print-inner','tests','native','grays','gates','post-gates','integrity','bind-views'])
    mode = parser.parse_args().mode
    if mode == 'baseline': baseline()
    elif mode == 'metadata': metadata()
    elif mode == 'negatives': negatives()
    elif mode == 'math': math_review()
    elif mode in ['full','thin','print']: reproduce(mode)
    elif mode == 'print-inner': a.print_inner()
    elif mode == 'tests': n.command('tests',['C:/Python314/python.exe','-m','unittest','discover','-s','build-scripts/content/book-2/223','-p','test_*.py','-v'])
    elif mode == 'native': n.command('native-process',['C:/Python314/python.exe','build-scripts/content/book-2/223/check_render.py','--lesson-root',str(n.LONG),'--manifest',str(n.OUT / f'{PREFIX}-full-manifest.json'),'--rebuild','--output',str(n.OUT / f'{PREFIX}-native-check.json')])
    elif mode == 'grays': a.grays()
    elif mode == 'bind-views': bind_views()
    elif mode == 'gates': n.gates()
    elif mode == 'post-gates':
        n.PREFIX = PREFIX + '-post-review'
        n.gates()
    else: integrity()
