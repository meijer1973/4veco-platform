"""Exact §213 S1 guard; does not alter or replace the original17 source tests.

HOW TO ADAPT: a later authorized succession needs a new immutable work order,
not a live-file expected value or relaxed predicate. Valid native success is
proved separately by unmocked full/thin/print routes, never by these sentinels.
"""
from contextlib import ExitStack
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch
import hashlib
import subprocess
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import b2_213 as b

PBASE = '50db4c5da142812f47bf02219e393447caedecfb'
LBASE = '42996c60b4a93843dfe8488b8e5a3ea704871667'
GENERATOR = 'build-scripts/content/book-2/b2_213.py'
BASE_SHA = '6a45771783de221c3d65b32d423c1f7e90c90e84a79d30c4e175bba8836b056a'
TRANSFORMS = (
    ('724a080619f2f072151edf20980071b3bef18cd60d1904c78f4aa906be8917c8', '0d14506e314a11fef0637cc66cf29036f174b94cafbf7fa5ede2eff88937500f'),
    ('de2b8ed7dcc7a3c5c6eaac400892d2d37ac5212ccb3b9972fb004115a88c1fe2', '4da6e5b4f0a70273d78c067f34484c8a5f6faf164b0f09c1559b9a73ff6611fe'),
    ('74ad2ed9c44d9aa05b6d6a680d5d273f2cad4b62e4bead5db303c006514238cd', '79429b9f1750710baae46751a5792e4a02e7c177888a01f5ca3a15c4039a78f7'),
    ('e168e3c2b8698d12b699fbf60e7691fbbc8a15d61bd46a7988704d3c896c805c', '73bd2a2447b38c9d95cbc3bd69b8037e0f46b7564655b4513009fd6707b7b07d'),
    ('f53521ed8812a4c8b8c33c1d66b34e0afe8425c1dffb1723f37771372b2baa09', '9350d60fadee3494124f7b0593bc1efcf00db5ea292d0a19fc3f10518e11d1f8'),
)
PRESERVED = [
    'build-scripts/content/book-2/print_pipeline.py',
    'references/authored/course-target-exercises.json',
    *['build-scripts/content/book-2/213/' + n for n in (
        'theory.md', 'exercises.md', 'answers.md', 'target-answers.md',
        'test_source.py', 'test_bonus_contract.py', 'alt_contract.py',
        'check_render.py', 'verify_alt_delta.py', 'verify_rebuild.py')],
]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def blob(root, ref, name):
    return subprocess.check_output(['git', 'show', ref + ':' + name], cwd=root)


def canonical(raw):
    return raw.decode('utf-8-sig').replace('\r\n', '\n').replace('\r', '\n').encode('utf-8')


def expected_generator():
    original = blob(b.ROOT, PBASE, GENERATOR)
    assert sha(original) == BASE_SHA, 'Immutable generator baseline mismatch'
    for old, new in TRANSFORMS:
        old, new = old.encode(), new.encode()
        assert original.count(old) == 1 and new not in original, 'Transform not once-only'
        original = original.replace(old, new)
    return original


def verify_generator(candidate):
    assert candidate == expected_generator(), 'Whole generator differs from exact five-literal succession'


def verify_preserved(name, candidate):
    assert canonical(candidate) == blob(b.ROOT, PBASE, name), 'Whole preserved source/guard drift'


def actual_inputs():
    lessons = b.ROOT.parent / '4veco-lessen'
    folder = lessons / b.LESSON_REL
    result = [(p.relative_to(lessons), h, 'lf') for p, h in b.prerequisite_pins(folder)]
    result.append((b.LESSON_REL.parent / '2.1.2 Opbrengsten, winst en break-even' /
                   '2.1.2 Opbrengsten, winst en break-even – paragraaf.md', TRANSFORMS[-1][1], 'raw'))
    return lessons, result


class ReachedRealGovernance(Exception):
    """Valid source gates reached first governance command; NOT build success."""


class SuccessionTests(unittest.TestCase):
    def test_exact_whole_generator_and_five_once_only_operations(self):
        current = (b.ROOT / GENERATOR).read_bytes()
        verify_generator(current)
        for old, new in TRANSFORMS:
            self.assertNotIn(old.encode(), current)
            self.assertEqual(current.count(new.encode()), 1)

    def test_all_original_sources_and_original17_test_bodies_remain_exact(self):
        for name in PRESERVED:
            with self.subTest(path=name):
                verify_preserved(name, (b.ROOT / name).read_bytes())
        lessons, _ = actual_inputs()
        name = (b.LESSON_REL / 'build_pdf.py').as_posix()
        self.assertEqual(canonical((lessons / name).read_bytes()), blob(lessons, LBASE, name))

    def test_exact_actual_seven_inputs_match_published_accepted_pair(self):
        lessons, inputs = actual_inputs()
        self.assertEqual(len(inputs), 7)
        for name, expected, mode in inputs:
            with self.subTest(path=str(name)):
                data = (lessons / name).read_bytes()
                self.assertEqual(sha(canonical(data) if mode == 'lf' else data), expected)
                self.assertEqual(canonical(data), blob(lessons, LBASE, name.as_posix()))

    def test_unrelated_generator_guard_and_synchronized_drift_rejected(self):
        expected = expected_generator()
        mutants = [expected + b'\n# unrelated drift\n',
                   expected.replace(b'raise ValueError', b'print', 1)]
        for old, new in TRANSFORMS:
            mutants.append(expected.replace(new.encode(), old.encode()))
            mutants.append(expected.replace(new.encode(), b'0' * 64))
            mutants.append(expected + b'\n# ' + new.encode())
        for _, new in TRANSFORMS:
            forged = sha(b'forged accepted source; synchronized hash')
            mutants.append(expected.replace(new.encode(), forged.encode()))
        for i, candidate in enumerate(mutants):
            with self.subTest(mutation=i), self.assertRaisesRegex(AssertionError, 'Whole generator'):
                verify_generator(candidate)
        for name in PRESERVED:
            with self.subTest(guard=name), self.assertRaisesRegex(AssertionError, 'Whole preserved'):
                verify_preserved(name, blob(b.ROOT, PBASE, name) + b'\n# unauthorized guard/source change\n')

    def _fixture(self, folder):
        lessons, inputs = actual_inputs()
        root = Path(folder)
        (root / b.LESSON_REL).mkdir(parents=True)
        for relative, _, _ in inputs:
            destination = root / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes((lessons / relative).read_bytes())
        return root, inputs

    def _run_guarded(self, root, expected_error):
        before = {p.relative_to(root).as_posix(): sha(p.read_bytes())
                  for p in root.rglob('*') if p.is_file()}
        with ExitStack() as stack:
            processes = stack.enter_context(patch.object(b.subprocess, 'run', side_effect=ReachedRealGovernance))
            writes = [stack.enter_context(patch.object(Path, method, side_effect=AssertionError('Native file sideeffect before gate')))
                      for method in ('mkdir', 'write_text', 'write_bytes')]
            with self.assertRaises(expected_error):
                b.build(root)
            if expected_error is ReachedRealGovernance:
                self.assertEqual(processes.call_count, 1)
                self.assertEqual(processes.call_args.args[0][1], 'build-scripts/workflows/check-book-outline-currentness.js')
            else:
                processes.assert_not_called()
            for write in writes:
                write.assert_not_called()
        after = {p.relative_to(root).as_posix(): sha(p.read_bytes())
                 for p in root.rglob('*') if p.is_file()}
        self.assertEqual(before, after)

    def test_fourteen_real_missing_and_forged_inputs_stop_before_native_sideeffects(self):
        _, inputs = actual_inputs()
        for index in range(7):
            for fault in ('missing', 'forged'):
                with self.subTest(input=str(inputs[index][0]), fault=fault), TemporaryDirectory(prefix='b213-s1-negative-') as temporary:
                    root, copied = self._fixture(temporary)
                    destination = root / copied[index][0]
                    if fault == 'missing':
                        destination.unlink()
                    else:
                        destination.write_bytes(destination.read_bytes() + b'\nFORGED ACCEPTANCE\n')
                    self._run_guarded(root, FileNotFoundError if fault == 'missing' else ValueError)

    def test_valid_real_inputs_reach_governance_only_not_a_fake_successful_build(self):
        with TemporaryDirectory(prefix='b213-s1-valid-gate-') as temporary:
            root, _ = self._fixture(temporary)
            self._run_guarded(root, ReachedRealGovernance)


if __name__ == '__main__':
    unittest.main(verbosity=2)
