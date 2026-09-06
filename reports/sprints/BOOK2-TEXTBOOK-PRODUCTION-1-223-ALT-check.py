"""Exact §223 metadata author verification. Not independent review or acceptance.

Reuses only the previously read root command/gate primitives, with a new prefix.
Complete byte derivations and preservation checks below are specific to this delta.
Every evidence file is exclusive; failed commands/reservations are never rewritten.
"""
import argparse
import difflib
import importlib.util
import io
import json
import os
from pathlib import Path, PurePosixPath
import re
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[2]
PREFIX = 'BOOK2-TEXTBOOK-PRODUCTION-1-223-ALT'
PBASE = 'e4fc984c9cb28c6f03d0f3040136af73315ca916'
LBASE = '6663532621e1347c12f691862ee85200665ad14f'
spec = importlib.util.spec_from_file_location('root223_primitives', ROOT / 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root-check.py')
n = importlib.util.module_from_spec(spec)
spec.loader.exec_module(n)
n.PREFIX = PREFIX
n.PROOF = n.OUT / (PREFIX + '-evidence')
sys.path.insert(0, str(ROOT / 'build-scripts/content/book-2/223'))
import test_successor as guard
import test_alt_metadata as alt_tests
from bs4 import BeautifulSoup
from print_pipeline import prepare_html


def source_binding():
    rows = []
    names = [n.GEN, *guard.UNCHANGED, alt_tests.CONTROLLER,
             'build-scripts/content/book-2/223/check_render.py']
    for name in names:
        original = n.blob(PBASE, name)
        expected = (guard.expected_generator() if name == n.GEN else
                    alt_tests.expected_controller() if name == alt_tests.CONTROLLER else
                    guard.expected_source(name) if name in guard.UNCHANGED else original)
        actual = (ROOT / name).read_bytes()
        guard.require_exact(actual, expected)
        rows.append({'path': name, 'input_sha256': n.sha(original), 'candidate_sha256': n.sha(actual),
                     'complete_expected_bytes_equal': True, 'changed': original != actual})
    for path, expected in guard.required_inputs():
        assert n.builder.lf_hash(path) == expected
        assert path.read_bytes() == n.blob(LBASE, path.relative_to(n.LONG).as_posix(), n.LESSONS)
    return rows


def native_names():
    return ([f'{n.builder.STEM} – {kind}.{ext}' for kind in n.KINDS for ext in ['md', 'html', 'pdf', 'zip']]
            + [f'_assets/2.2.3_fig_{i}.{ext}' for i in range(1, 5) for ext in ['svg', 'png']])


def input_blob(name):
    return n.blob(LBASE, (n.builder.LESSON_REL / name).as_posix(), n.LESSONS)


def expected_md(kind):
    value = input_blob(f'{n.builder.STEM} – {kind}.md')
    for name, (image, alt) in guard.ALT_REPLACEMENTS.items():
        count = int(kind == 'paragraaf' or (kind == 'opgaven' and name.endswith('exercises.md')))
        before = (image + '\n').encode()
        after = (image + '{alt="' + alt + '"}\n').encode()
        assert value.count(before) == count and after not in value
        if count:
            value = value.replace(before, after, 1)
    return value


def baseline():
    assert n.git('rev-parse', 'HEAD', cwd=n.LESSONS).decode().strip() == LBASE
    assert not n.git('status', '--porcelain', cwd=n.LESSONS).strip()
    assert len(n.folder()) == 25
    for name, value in n.folder().items():
        assert value == n.sha(input_blob(name))
    old_evidence = []
    for raw in n.git('ls-tree', '-r', '--name-only', '-z', PBASE).split(b'\0'):
        name = raw.decode()
        if name.startswith('reports/') and ('223' in name):
            data = (ROOT / name).read_bytes()
            assert data == n.blob(PBASE, name)
            old_evidence.append({'path': name, 'sha256': n.sha(data)})
    histories = {}
    base = n.OUT / 'BOOK2-TEXTBOOK-PRODUCTION-1-223-QC-evidence'
    for kind in n.KINDS:
        choices = list(base.glob(f'223-{kind}-*-r14'))
        assert len(choices) == 1
        histories[kind] = choices[0].relative_to(ROOT).as_posix()
    n.save('baseline', {'pass': True, 'platform_input': PBASE, 'lesson_input': LBASE,
        'operational_plan_commit': '4592685f', 'source_binding': source_binding(),
        'paragraph_files': n.folder(), 'old_evidence': old_evidence, 'history': histories,
        'root_validation': 'PENDING', 'root_acceptance': 'PENDING', 'handoff_renewal': 'PENDING'})


def reserve(mode):
    roots = set()
    for repo in [ROOT, n.LESSONS]:
        roots.update(s[9:] for s in n.git('worktree', 'list', '--porcelain', cwd=repo).decode().splitlines()
                     if s.startswith('worktree '))
    seen, locations, unavailable = set(), [], []
    for root in sorted(roots):
        if not Path(root).is_dir():
            unavailable.append(root)
            continue
        for relative in ['reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1', 'reports/sprints']:
            base = Path(root) / relative
            if not base.is_dir():
                continue
            for directory, dirs, files in os.walk(base):
                for name in dirs:
                    match = re.fullmatch(r'223-.+-r([1-9][0-9]*)', name)
                    if match:
                        seen.add(int(match[1])); locations.append(str(Path(directory) / name))
                dirs[:] = [d for d in dirs if d not in ('pages', 'grayscale', '__pycache__', '.git')]
                for name in files:
                    if '223' in name and 'reservation' in name and name.endswith('.json'):
                        path = Path(directory) / name
                        data = json.loads(path.read_text(encoding='utf-8-sig'))
                        suffix = data.get('suffix')
                        if isinstance(suffix, str) and re.fullmatch(r'r[1-9][0-9]*', suffix):
                            seen.add(int(suffix[1:])); locations.append(str(path))
    assert seen and max(seen) >= 18
    suffix = f'r{max(seen) + 1}'
    n.save(mode + '-reservation', {'suffix': suffix, 'used': sorted(seen),
        'registered_worktrees': sorted(roots), 'unavailable_worktrees': unavailable,
        'observed_locations': sorted(set(locations)), 'proof_root': str(n.PROOF),
        'scan': 'recursive standard and nested sprint proof directories plus reservation JSON, both repositories'})
    print('RESERVED ' + mode + ' ' + suffix, flush=True)


def metadata_delta(kind):
    filename = f'{n.builder.STEM} – {kind}.md'
    path = n.DEST / filename
    oldmd, newmd = input_blob(filename), expected_md(kind)
    assert path.read_bytes() == newmd
    oldhtml = input_blob(path.with_suffix('.html').name)
    # Full immutable pipeline reproduction, not a current-hash allowlist.
    generated_old = prepare_html(oldmd.decode('utf-8'), path)[0].replace('\r\n', '\n').replace('\r', '\n').encode()
    assert generated_old == oldhtml, 'Original full native HTML must reproduce before deriving its delta'
    expected_html = prepare_html(newmd.decode('utf-8'), path)[0].replace('\r\n', '\n').replace('\r', '\n').encode()
    assert path.with_suffix('.html').read_bytes() == expected_html
    before, after = (BeautifulSoup(value, 'html.parser') for value in [oldhtml, expected_html])
    changes = []
    old_images, new_images = before.find_all('img'), after.find_all('img')
    assert len(old_images) == len(new_images)
    for index, (old, new) in enumerate(zip(old_images, new_images), 1):
        if old == new:
            continue
        matches = [(image, alt) for image, alt in guard.ALT_REPLACEMENTS.values()
                   if image[2:image.index('](')] == old.get('alt')]
        assert len(matches) == 1
        image, alt = matches[0]
        alt_tests.validate_functional_alt(new['alt'], alt)
        oldcaption = old.find_parent('figure').find('figcaption')
        newcaption = new.find_parent('figure').find('figcaption')
        assert oldcaption.get_text().split() == newcaption.get_text().split()
        assert oldcaption.get('aria-hidden') == 'true' and 'aria-hidden' not in newcaption.attrs
        changes.append({'image': index, 'before_alt': old['alt'], 'after_alt': alt, 'characters': len(alt),
                        'before_caption_html': str(oldcaption), 'after_caption_html': str(newcaption)})
        old['alt'] = alt
        del oldcaption['aria-hidden']
        oldcaption.string = newcaption.string
    assert str(before) == str(after), 'No other HTML DOM changes permitted'
    assert len(changes) == {'paragraaf': 2, 'opgaven': 1, 'antwoorden': 0}[kind]
    # Preserve a human-readable complete line diff without duplicating binary data URIs.
    def omit_binary(value):
        return re.sub(r'data:image/png;base64,[A-Za-z0-9+/=]+', 'data:image/png;base64,[UNCHANGED BINARY]', value.decode())
    html_diff = ''.join(difflib.unified_diff(omit_binary(oldhtml).splitlines(True), omit_binary(expected_html).splitlines(True),
                                         fromfile='input.html', tofile='candidate.html'))
    return {'kind': kind, 'md_before_sha256': n.sha(oldmd), 'md_after_sha256': n.sha(newmd),
            'html_before_sha256': n.sha(oldhtml), 'html_after_sha256': n.sha(expected_html),
            'complete_native_derivation_equal': True, 'changes': changes, 'html_line_diff_binary_omitted': html_diff}


def verify(mode):
    from PIL import Image
    from pypdf import PdfReader
    baseline = n.read('baseline')
    manifest = n.read(mode + '-manifest')
    source_binding()
    files = n.folder()
    assert set(files) == set(baseline['paragraph_files']) and len(files) == 25
    allowed = {f'{n.builder.STEM} – {kind}.{ext}' for kind in ['paragraaf', 'opgaven'] for ext in ['md', 'html', 'zip']}
    for name, value in files.items():
        if name not in allowed:
            assert value == baseline['paragraph_files'][name], name
    docs, deltas = [], []
    for kind, count, zcount, rec in zip(n.KINDS, n.COUNTS, n.ZCOUNTS, manifest['documents']):
        deltas.append(metadata_delta(kind))
        pdf = n.DEST / f'{n.builder.STEM} – {kind}.pdf'
        assert pdf.read_bytes() == input_blob(pdf.name) and n.sha(pdf.read_bytes()) == rec['pdf_sha256']
        assert len(PdfReader(pdf).pages) == count
        ziprows = []
        with zipfile.ZipFile(pdf.with_suffix('.zip')) as archive, zipfile.ZipFile(io.BytesIO(input_blob(pdf.with_suffix('.zip').name))) as original:
            names = archive.namelist()
            assert names == original.namelist() and len(names) == len(set(names)) == zcount and archive.testzip() is None
            for name in names:
                posix = PurePosixPath(name)
                assert not posix.is_absolute() and '..' not in posix.parts and ':' not in name and '\\' not in name
                data = archive.read(name)
                assert data == (n.DEST / name).read_bytes()
                if name not in allowed:
                    assert data == original.read(name)
                ziprows.append({'name': name, 'before_sha256': n.sha(original.read(name)), 'after_sha256': n.sha(data),
                                'crc': archive.getinfo(name).CRC})
        directory = Path(rec['proof_directory'])
        olddir = ROOT / baseline['history'][kind]
        proof = json.loads((directory / 'manifest.json').read_text(encoding='utf-8'))
        oldproof = json.loads((olddir / 'manifest.json').read_text(encoding='utf-8'))
        assert proof['inspection_status'] == 'PENDING' and proof['pages_inspected'] == []
        assert proof['page_sha256'] == oldproof['page_sha256'] and len(proof['page_sha256']) == count
        pages = []
        for name, value in proof['page_sha256'].items():
            current_path, old_path = directory / 'pages' / name, olddir / 'pages' / name
            assert current_path.read_bytes() == old_path.read_bytes() and n.sha(current_path.read_bytes()) == value
            with Image.open(current_path) as current, Image.open(old_path) as old:
                assert current.mode == old.mode and current.size == old.size and current.tobytes() == old.tobytes()
                pages.append({'name': name, 'raw_sha256': value, 'pixels_sha256': n.sha(current.tobytes()),
                              'size': current.size, 'gray_pixels_sha256': n.sha(current.convert('L').tobytes())})
        docs.append({'kind': kind, 'pdf_sha256': rec['pdf_sha256'], 'pages': pages, 'zip_members': ziprows,
                     'proof_directory': directory.relative_to(ROOT).as_posix(),
                     'manifest_sha256': n.sha((directory / 'manifest.json').read_bytes())})
    figures = []
    for i in range(1, 5):
        png = n.DEST / f'_assets/2.2.3_fig_{i}.png'
        svg = png.with_suffix('.svg')
        assert svg.read_bytes() == input_blob(f'_assets/{svg.name}')
        assert png.read_bytes() == input_blob(f'_assets/{png.name}')
        with Image.open(png) as current, Image.open(io.BytesIO(input_blob(f'_assets/{png.name}'))) as old:
            assert current.mode == old.mode and current.size == old.size and current.tobytes() == old.tobytes()
            figures.append({'number': i, 'svg_sha256': n.sha(svg.read_bytes()), 'png_sha256': n.sha(png.read_bytes()),
                            'pixels_sha256': n.sha(current.tobytes()), 'gray_pixels_sha256': n.sha(current.convert('L').tobytes())})
    n.save(mode + '-parity', {'pass': True, 'native_files': 20, 'paragraph_files': files,
        'whole_paragraph_files': 25, 'pages': 32, 'documents': docs, 'figures': figures,
        'complete_metadata_delta': deltas, 'personal_inspection': 'NOT_INFERRED',
        'root_validation': 'PENDING', 'root_acceptance': 'PENDING', 'handoff_renewal': 'PENDING'})


def reproduce(mode):
    suffix = n.read(mode + '-reservation')['suffix']
    manifest = n.OUT / f'{PREFIX}-{mode}-manifest.json'
    assert not manifest.exists()
    if mode == 'full':
        n.command('pdf-artifact-marker', ['node',
            'C:/Users/meije/.codex/plugins/cache/openai-primary-runtime/pdf/26.904.11930/skills/pdf/container_tools/mark_artifact_operation_started.mjs',
            '--operation-kind', 'edit', '--expected-output-count', '3', '--output-format', 'pdf'])
    if mode in ['full', 'thin']:
        script = ROOT / n.GEN if mode == 'full' else n.LESSONS / n.builder.LESSON_REL / 'build_pdf.py'
        n.command(mode + '-process', ['C:/Python314/python.exe', str(script), '--lesson-root', str(n.LONG),
            '--proof-root', str(n.PROOF), '--proof-suffix', suffix, '--manifest', str(manifest)])
    else:
        n.command('print-process', ['C:/Python314/python.exe', str(Path(__file__).resolve()), 'print-inner'])
    verify(mode)


def print_inner():
    # This process inherits the documented MSYS-first child PATH from command().
    suffix = n.read('print-reservation')['suffix']
    result = {'inspection_status': 'PENDING', 'documents': []}
    for kind in n.KINDS:
        rec = n.builder.build_document(n.DEST / f'{n.builder.STEM} – {kind}.md')
        n.builder.zip_document(rec)
        directory = n.PROOF / f"223-{kind}-{rec['pdf_sha256'][:12]}-{suffix}"
        assert not directory.exists()
        n.builder.render_proof(rec, directory)
        rec['proof_directory'] = str(directory)
        result['documents'].append(rec)
    n.save('print-manifest', result)


def integrity():
    baseline = n.read('baseline')
    assert n.folder() == n.read('full-parity')['paragraph_files']
    for row in baseline['old_evidence']:
        assert n.sha((ROOT / row['path']).read_bytes()) == row['sha256'], row['path']
    for mode in ['full', 'thin', 'print']:
        for rec in n.read(mode + '-parity')['documents']:
            directory = ROOT / rec['proof_directory']
            assert n.sha((directory / 'manifest.json').read_bytes()) == rec['manifest_sha256']
            for page in rec['pages']:
                assert n.sha((directory / 'pages' / page['name']).read_bytes()) == page['raw_sha256']
    for name in ['2.2.3-review.md', '2.2.3-quality-ref.yaml', '2.2.3-textbook-plan.md', 'build_pdf.py']:
        assert (n.DEST / name).read_bytes() == input_blob(name)
    assert not (n.DEST / '2.2.3-textbook-handoff.md').exists()
    n.save('final-integrity', {'pass': True, 'source_binding': source_binding(),
        'preserved_prior_evidence_files': len(baseline['old_evidence']), 'old_review_and_QC_exact': True,
        'new_proof_pages_exact': 96, 'handoff': 'ABSENT', 'production_ready': False,
        'root_validation': 'PENDING', 'root_acceptance': 'PENDING', 'handoff_renewal': 'PENDING'})


def grays():
    from PIL import Image
    destination = n.PROOF / 'grayscale'
    destination.mkdir(parents=True, exist_ok=False)
    rows = []
    for record in n.read('full-parity')['documents']:
        for page in record['pages']:
            source = ROOT / record['proof_directory'] / 'pages' / page['name']
            target = destination / (record['kind'] + '-' + page['name'])
            with Image.open(source) as image:
                gray = image.convert('L')
                assert n.sha(gray.tobytes()) == page['gray_pixels_sha256']
                gray.save(target)
            old = n.OUT / 'BOOK2-TEXTBOOK-PRODUCTION-1-223-QC-evidence/grayscale' / target.name
            assert old.read_bytes() == target.read_bytes()
            rows.append({'kind': record['kind'], 'page': page['name'], 'path': target.relative_to(ROOT).as_posix(),
                         'raw_sha256': n.sha(target.read_bytes()), 'old_QC_raw_equal': True})
    for i in range(1, 5):
        source = n.DEST / f'_assets/2.2.3_fig_{i}.png'
        target = destination / f'figure-{i}.png'
        with Image.open(source) as image:
            image.convert('L').save(target)
        old = n.OUT / 'BOOK2-TEXTBOOK-PRODUCTION-1-223-QC-evidence/grayscale' / target.name
        assert old.read_bytes() == target.read_bytes()
        rows.append({'kind': 'figure', 'number': i, 'path': target.relative_to(ROOT).as_posix(),
                     'raw_sha256': n.sha(target.read_bytes()), 'old_QC_raw_equal': True})
    n.save('grayscale', {'pass': True, 'rows': rows, 'personal_inspection': 'NOT_INFERRED'})


def bind_observations():
    observations = n.read('observations')
    parity = n.read('full-parity')
    pages = []
    for rec in parity['documents']:
        notes = observations['full_page_color_views'][rec['kind']]
        assert len(notes) == len(rec['pages'])
        for page, note in zip(rec['pages'], notes):
            pages.append({'kind': rec['kind'], 'path': rec['proof_directory'] + '/pages/' + page['name'],
                          'sha256': page['raw_sha256'], 'personal_observation': note})
    assert len(pages) == 32 and len(observations['native_color_figure_views']) == 4
    figures = [{**rec, 'personal_observation': note} for rec, note in
               zip(parity['figures'], observations['native_color_figure_views'])]
    grays = n.read('grayscale')['rows']
    viewed_grays = []
    for view in observations['personal_grayscale_views']:
        matches = [r for r in grays if Path(r['path']).name == view['path']]
        assert len(matches) == 1
        viewed_grays.append({**matches[0], 'personal_observation': view['observation']})
    n.save('personal-inspection', {'actor': observations['actor'], 'role': observations['role'],
        'manual_observations_sha256': n.sha((n.OUT / f'{PREFIX}-observations.json').read_bytes()),
        'pages': pages, 'figures': figures, 'grayscale_views': viewed_grays, 'limits': observations['limits'],
        'printed_defects_found': [], 'independent_review': 'PENDING', 'specialist_renewal': 'PENDING',
        'root_validation': 'PENDING', 'root_acceptance': 'PENDING', 'handoff_renewal': 'PENDING'})


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=['baseline', 'reserve-full', 'reserve-thin', 'reserve-print', 'full', 'thin',
        'print', 'print-inner', 'tests', 'native', 'gates', 'integrity', 'grays', 'bind-observations'])
    mode = parser.parse_args().mode
    if mode == 'baseline': baseline()
    elif mode.startswith('reserve-'): reserve(mode[8:])
    elif mode in ['full', 'thin', 'print']: reproduce(mode)
    elif mode == 'print-inner': print_inner()
    elif mode == 'tests':
        n.command('tests', ['C:/Python314/python.exe', '-m', 'unittest', 'discover', '-s', 'build-scripts/content/book-2/223', '-p', 'test_*.py', '-v'])
    elif mode == 'native':
        n.command('native-process', ['C:/Python314/python.exe', 'build-scripts/content/book-2/223/check_render.py',
            '--lesson-root', str(n.LONG), '--manifest', str(n.OUT / f'{PREFIX}-full-manifest.json'), '--rebuild',
            '--output', str(n.OUT / f'{PREFIX}-native-check.json')])
    elif mode == 'gates': n.gates()
    elif mode == 'grays': grays()
    elif mode == 'bind-observations': bind_observations()
    else: integrity()
