"""Per-case evidence for real missing/forged inputs; no fake build success."""
from pathlib import Path
from tempfile import TemporaryDirectory
import importlib.util

RUNNER = Path(__file__).with_name('BOOK2-TEXTBOOK-PRODUCTION-1-213-S1-run.py')
spec = importlib.util.spec_from_file_location('own_controller', RUNNER)
d = importlib.util.module_from_spec(spec)
spec.loader.exec_module(d)
REF = '8fd54c00665f02c96806a85d453f0bd69cdd8394'
d.verify_controller(REF)
test = d.succession.SuccessionTests()
_, inputs = d.succession.actual_inputs()
results = []
for index, (relative, expected, semantic) in enumerate(inputs):
    for fault in ('missing', 'forged'):
        with TemporaryDirectory(prefix='b213-s1-evidence-') as temporary:
            root, copied = test._fixture(temporary)
            path = root / relative
            original = path.read_bytes()
            if fault == 'missing':
                path.unlink()
                candidate_hash = None
                expected_exception = FileNotFoundError
            else:
                path.write_bytes(original + b'\nFORGED ACCEPTANCE\n')
                candidate_hash = d.sha(path.read_bytes())
                expected_exception = ValueError
            existing = {p.relative_to(root).as_posix(): d.sha(p.read_bytes())
                        for p in root.rglob('*') if p.is_file()}
            test._run_guarded(root, expected_exception)
            after = {p.relative_to(root).as_posix(): d.sha(p.read_bytes())
                     for p in root.rglob('*') if p.is_file()}
            assert existing == after
            results.append(dict(input=relative.as_posix(), hash_semantic=semantic,
                expected_hash=expected, original_raw_sha256=d.sha(original), fault=fault,
                actual_fixture_exists=path.exists(), forged_raw_sha256=candidate_hash,
                exception=expected_exception.__name__, native_process_calls=0,
                output_mkdir_calls=0, output_write_calls=0, other_fixture_files_unchanged=True,
                before_after_file_bindings=existing, result='PASS'))
assert len(results) == 14
d.save('real-input-counterexamples.json', dict(result='PASS', controller=d.verify_controller(REF),
       probe_source_sha256=d.sha(Path(__file__).read_bytes()), cases=results,
       fixture_semantics='Seven real copied current prerequisite files; exactly one deleted or forged per case; actual build gate reads, no hash-function stubs; no native success claimed.'))
print('14 real per-input missing/forged counterexamples PASS')
