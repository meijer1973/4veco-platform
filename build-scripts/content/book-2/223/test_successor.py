"""Exact S1 succession regressions; not an independent review or QC verdict."""
import hashlib
import os
import subprocess
import sys
import unittest
from contextlib import ExitStack
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import b2_223 as builder

BASE = "3510fc4dd30c9c01f44111ecc022ae239e855758"
LESSON_BASE = "25fbd9ba66f6ead59f512ec2eec1fd95159d834f"
GENERATOR = "build-scripts/content/book-2/b2_223.py"
ROOT = builder.ROOT
LESSONS = (ROOT.parent / "4veco-lessen").resolve()
if os.name == "nt":
    LESSONS = Path("\\\\?\\" + str(LESSONS))
REPLACEMENTS = {
    "2.2.1-textbook-handoff.md": ("216e139a6297b59cfb8e62f43eb3a79eb16efc1861e5fc989ad15562a4deb24c", "3a3357f0f1487fcc8376e5c9717f80d181f2d71c6069f647c6fa7ab71377f811"),
    "2.2.1-review.md": ("24995a4d0e5d82327434be1dd94c789275728bdce840c6a7b5d63b59035258eb", "19bfa448b3c0f80732f2fa77617eb2772880747082fb683c8cd3852c74a96c63"),
    "2.2.1-quality-ref.yaml": ("b6f1b389d11c20665577414c17e5ae49962083812d9d1bf474d16231db749508", "4f0c77e9ae5769bb85c9c32dfa019049f6bccd323dfd0152b7eabf95897879fa"),
    "2.2.1 Prijselasticiteit – paragraaf.md": ("e7e4287645c26c3b79406a556c05a4c90dd10e10e3605b409b89a123df7fa281", "ae61910c6306ff6af9d52a57db060083ca64facadc4424f1d4a96708d71974db"),
}
UNCHANGED = ["build-scripts/content/book-2/print_pipeline.py",
             *[f"build-scripts/content/book-2/223/{name}" for name in
               ("test_source.py", "theory.md", "exercises.md", "answers.md", "target-answers.md")]]


def blob(root, ref, name):
    return subprocess.check_output(["git", "show", f"{ref}:{name}"], cwd=root)


def expected_generator():
    value = blob(ROOT, BASE, GENERATOR)
    for name, (old, new) in REPLACEMENTS.items():
        before = f'"{name}": "{old}"'.encode()
        after = f'"{name}": "{new}"'.encode()
        if value.count(before) != 1 or after in value:
            raise AssertionError(f"Nonunique or already evolved original literal: {name}")
        value = value.replace(before, after, 1)
    return value


def require_exact(actual, expected):
    if actual != expected:
        raise AssertionError("Whole bytes differ from exact immutable expectation")


ALT_REPLACEMENTS = {
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
        before = (image + '\n').encode()
        after = (image + '{alt="' + alt + '"}\n').encode()
        if value.count(before) != 1 or after in value:
            raise AssertionError(f"Nonunique or already evolved original image: {name}")
        value = value.replace(before, after, 1)
    return value


def required_inputs():
    destination = LESSONS / builder.LESSON_REL
    return [(destination / "2.2.3-textbook-plan.md", builder.PLAN_HASH),
            (destination.parent / "_chapter-plan.md", builder.CHAPTER_HASH),
            *[(destination.parent / "2.2.1 Prijselasticiteit" / name, new)
              for name, (_, new) in REPLACEMENTS.items()]]


class Successor223Tests(unittest.TestCase):
    def test_exact_four_literal_whole_generator_transition(self):
        require_exact((ROOT / GENERATOR).read_bytes(), expected_generator())

    def test_complete_original_seven_tests_and_four_sources_and_helper_immutable(self):
        for name in UNCHANGED:
            with self.subTest(path=name):
                require_exact((ROOT / name).read_bytes(), expected_source(name))

    def test_unrelated_generator_changes_are_rejected(self):
        expected = expected_generator()
        for changed in (expected + b"\n", expected.replace(b"def lf_hash", b"def weakened_hash", 1),
                        expected.replace(b'"#1A5276"', b'"#123456"', 1)):
            self.assertNotEqual(changed, expected)
            with self.assertRaises(AssertionError):
                require_exact(changed, expected)

    def test_unrelated_source_and_original_test_mutations_are_rejected(self):
        for name in UNCHANGED:
            original = expected_source(name)
            with self.subTest(path=name), self.assertRaises(AssertionError):
                require_exact(original + b"\n# unrelated change\n", original)

    def test_actual_accepted_inputs_match_exact_published_lesson_git_bytes(self):
        self.assertEqual(builder.PRIOR_PINS, {n: pair[1] for n, pair in REPLACEMENTS.items()})
        for path, expected in required_inputs():
            with self.subTest(path=str(path)):
                self.assertEqual(builder.lf_hash(path), expected)
                require_exact(path.read_bytes(), blob(LESSONS, LESSON_BASE, path.relative_to(LESSONS).as_posix()))

    def test_each_altered_or_unknown_input_fails_before_every_side_effect(self):
        real_hash = builder.lf_hash
        for target, _ in required_inputs():
            for mode in ("altered", "unknown"):
                visited = []

                def guarded_hash(path):
                    visited.append(path)
                    if path == target:
                        if mode == "unknown":
                            raise FileNotFoundError(f"Isolated missing-input fixture: {path}")
                        return hashlib.sha256(path.read_bytes() + b"\nchanged fixture").hexdigest()
                    return real_hash(path)

                with self.subTest(path=str(target), mode=mode), ExitStack() as stack:
                    stack.enter_context(patch.object(builder, "lf_hash", side_effect=guarded_hash))
                    effects = [stack.enter_context(patch.object(obj, attr)) for obj, attr in (
                        (builder.subprocess, "run"), (Path, "mkdir"), (Path, "write_text"),
                        (Path, "write_bytes"), (builder, "build_document"),
                        (builder, "asset_sources"), (builder, "documents"), (builder, "zip_document"),
                        (builder, "render_proof"))]
                    error = FileNotFoundError if mode == "unknown" else ValueError
                    with self.assertRaises(error):
                        builder.build(LESSONS)
                    self.assertIn(target, visited)
                    for effect in effects:
                        effect.assert_not_called()

    def test_valid_inputs_advance_to_existing_first_authority_subprocess(self):
        class ReachedAuthority(Exception):
            pass
        with patch.object(builder, "lf_hash", wraps=builder.lf_hash) as hashes, \
             patch.object(builder.subprocess, "run", side_effect=ReachedAuthority) as process, \
             patch.object(Path, "mkdir") as mkdir, patch.object(Path, "write_text") as write:
            with self.assertRaises(ReachedAuthority):
                builder.build(LESSONS)
            self.assertEqual(hashes.call_count, 6)
            process.assert_called_once()
            self.assertIn("build-scripts/workflows/check-book-outline-currentness.js", process.call_args.args[0])
            mkdir.assert_not_called()
            write.assert_not_called()


if __name__ == "__main__":
    unittest.main()
