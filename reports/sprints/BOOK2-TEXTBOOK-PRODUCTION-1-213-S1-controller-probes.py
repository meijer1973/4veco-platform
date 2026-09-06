"""Non-native counterexamples against the actual committed S1 controller gates.

These injected candidate bytes test rejection predicates, not build success.
Real missing/forged prerequisite files are separately exercised by test_succession.
"""
from pathlib import Path
from unittest.mock import patch
import importlib.util
import json

HERE = Path(__file__).resolve()
RUNNER = HERE.with_name('BOOK2-TEXTBOOK-PRODUCTION-1-213-S1-run.py')
REF = '8fd54c00665f02c96806a85d453f0bd69cdd8394'
spec = importlib.util.spec_from_file_location('own_controller', RUNNER)
driver = importlib.util.module_from_spec(spec)
spec.loader.exec_module(driver)
original_read = Path.read_bytes


def probe(name, target, candidate, expected_message):
    target = target.resolve()
    actual = original_read(target)
    def substituted(path):
        return candidate if path.resolve() == target else original_read(path)
    with patch.object(Path, 'read_bytes', substituted):
        try:
            driver.verify_controller(REF)
        except AssertionError as error:
            assert expected_message in str(error), (name, str(error))
            rejection = str(error)
        else:
            raise AssertionError('Controller accepted counterexample: ' + name)
    assert original_read(target) == actual
    return dict(name=name, actual_path=str(target), actual_sha256=driver.sha(actual),
                counterexample_sha256=driver.sha(candidate), rejection=rejection,
                injection='candidate read bytes only; no real file changed', native_build_called=False)


def main():
    control = driver.verify_controller(REF)
    rows = []
    rows.append(probe('unrelated-controller-comment', RUNNER, RUNNER.read_bytes() + b'\n# drift\n', 'Full controller drift'))
    rows.append(probe('controller-guard-bypass', RUNNER, RUNNER.read_bytes().replace(b'assert current == expected', b'assert True or current == expected'), 'Full controller drift'))
    guard = driver.ROOT / driver.TEST
    rows.append(probe('succession-test-guard-drift', guard, guard.read_bytes() + b'\n# weakened guard\n', 'Full succession guard'))
    generator = driver.ROOT / driver.GENERATOR
    rows.append(probe('unrelated-generator-drift', generator, generator.read_bytes() + b'\n# drift\n', 'Whole generator'))
    for index, (_, new) in enumerate(driver.succession.TRANSFORMS, 1):
        forged = driver.sha(b'forged accepted input, synchronized with generator')
        rows.append(probe('synchronized-input-pin-' + str(index), generator,
                          generator.read_bytes().replace(new.encode(), forged.encode()), 'Whole generator'))
    for name in driver.succession.PRESERVED:
        path = driver.ROOT / name
        rows.append(probe('preserved-source-or-guard:' + name, path, path.read_bytes() + b'\n# drift\n', 'Whole preserved'))
    driver.save('controller-counterexamples.json', dict(result='PASS', controller=control, counterexamples=rows,
        positive=driver.verify_controller(REF), description='Actual immutable Git controller predicate, fixed entire succession test hash, fixed full generator five-replacement derivation and preserved full-source checks reject injected counterexample bytes. No fabricated successful native build.'))
    print('Controller counterexamples PASS:', len(rows))


if __name__ == '__main__':
    main()
