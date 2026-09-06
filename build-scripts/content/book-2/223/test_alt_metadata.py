"""B223-ALT-01 author regressions; independent review and QC remain separate."""
import re
import tempfile
import unittest
from contextlib import ExitStack
from pathlib import Path
from unittest.mock import patch

from bs4 import BeautifulSoup
import test_successor as guard
from print_pipeline import prepare_html

ALT_BASE = "e4fc984c9cb28c6f03d0f3040136af73315ca916"
CONTROLLER = "build-scripts/content/book-2/223/test_successor.py"
# Fixed literal insertion, deliberately independent of the live controller's text.
CONTROLLER_INSERTION = '''ALT_REPLACEMENTS = {
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


def expected_controller():
    value = guard.blob(guard.ROOT, ALT_BASE, CONTROLLER)
    changes = (
        (b"def required_inputs():", CONTROLLER_INSERTION.encode() + b"def required_inputs():"),
        (b"require_exact((ROOT / name).read_bytes(), blob(ROOT, BASE, name))",
         b"require_exact((ROOT / name).read_bytes(), expected_source(name))"),
        (b"            original = blob(ROOT, BASE, name)\n",
         b"            original = expected_source(name)\n"),
    )
    for before, after in changes:
        if value.count(before) != 1 or after in value:
            raise AssertionError("Controller derivation requires each exact original once")
        value = value.replace(before, after, 1)
    return value


def validate_functional_alt(alt, expected):
    if not 1 <= len(alt) <= 120 or alt != expected:
        raise AssertionError("Not the exact reviewed-candidate functional short alternative")
    if re.match(r"(?:Figuur\s+\d+:\s*)?(?:Zoek|Vergelijk|Bereken|Bekijk)\b", alt):
        raise AssertionError("Imperative is not a functional short alternative")


class AltMetadata223Tests(unittest.TestCase):
    def test_complete_controller_is_only_fixed_three_operation_delta(self):
        guard.require_exact((guard.ROOT / CONTROLLER).read_bytes(), expected_controller())

    def test_unrelated_controller_and_original_test_changes_are_rejected(self):
        for expected in (expected_controller(), guard.blob(guard.ROOT, guard.BASE,
                        "build-scripts/content/book-2/223/test_source.py")):
            for changed in (expected + b"\n", expected.replace(b"self.assert", b"self.not_assert", 1)):
                self.assertNotEqual(changed, expected)
                with self.assertRaises(AssertionError):
                    guard.require_exact(changed, expected)

    def test_exact_two_complete_source_transformations_and_other_files_unchanged(self):
        self.assertEqual(set(guard.ALT_REPLACEMENTS), {
            "build-scripts/content/book-2/223/theory.md",
            "build-scripts/content/book-2/223/exercises.md"})
        for name in guard.UNCHANGED:
            guard.require_exact((guard.ROOT / name).read_bytes(), guard.expected_source(name))
        guard.require_exact((guard.ROOT / guard.GENERATOR).read_bytes(), guard.expected_generator())

    def test_original_bad_alts_full_caption_drift_and_unrelated_source_mutations_fail(self):
        for name, (image, alt) in guard.ALT_REPLACEMENTS.items():
            expected = guard.expected_source(name)
            old = guard.blob(guard.ROOT, guard.BASE, name)
            for changed in (old, expected + b"\n", expected.replace(image.encode(),
                            image.replace("Figuur", "Gewijzigde figuur").encode(), 1),
                            expected.replace(alt.encode(), b"Bekijk de figuur.", 1),
                            expected.replace(alt.encode(), b"X" * 121, 1)):
                self.assertNotEqual(changed, expected)
                with self.assertRaises(AssertionError):
                    guard.require_exact(changed, expected)

    def test_source_derivation_rejects_missing_duplicate_and_already_transformed_anchor(self):
        for name, (image, alt) in guard.ALT_REPLACEMENTS.items():
            original = guard.blob(guard.ROOT, guard.BASE, name)
            anchor = (image + "\n").encode()
            for fixture in (original.replace(anchor, b"", 1), original + anchor,
                            guard.expected_source(name)):
                with patch.object(guard, "blob", return_value=fixture), self.assertRaises(AssertionError):
                    guard.expected_source(name)

    def test_functional_alts_reject_long_imperative_empty_and_original_caption(self):
        for _, (image, alt) in guard.ALT_REPLACEMENTS.items():
            validate_functional_alt(alt, alt)
            caption = image[2:image.index("](")]
            for bad in (caption, "Zoek het teken.", "Vergelijk de situaties.", "X" * 121, ""):
                with self.assertRaises(AssertionError):
                    validate_functional_alt(bad, alt)

    def test_native_pandoc_alts_preserve_complete_visible_captions(self):
        source = guard.LESSONS / guard.builder.LESSON_REL / (guard.builder.STEM + " – paragraaf.md")
        for _, (image, alt) in guard.ALT_REPLACEMENTS.items():
            before = BeautifulSoup(prepare_html(image, source)[0], "html.parser")
            after = BeautifulSoup(prepare_html(image + '{alt="' + alt + '"}', source)[0], "html.parser")
            validate_functional_alt(after.img["alt"], alt)
            self.assertEqual(before.figcaption.get_text().split(), after.figcaption.get_text().split())
            self.assertEqual(before.figcaption["aria-hidden"], "true")
            self.assertNotIn("aria-hidden", after.figcaption.attrs)
            before.img["alt"] = alt
            del before.figcaption["aria-hidden"]
            before.figcaption.string = after.figcaption.string
            self.assertEqual(str(before), str(after))

    def test_real_hash_missing_and_forged_six_inputs_fail_before_side_effects(self):
        actual_inputs = guard.required_inputs()
        with tempfile.TemporaryDirectory(prefix="b223-alt-", dir="C:/wt") as temp:
            fixture_root = Path(temp).resolve()
            self.assertEqual(fixture_root.parent, Path("C:/wt").resolve())
            destination = fixture_root / guard.builder.LESSON_REL
            destination.mkdir(parents=True)
            copies = []
            for real, expected in actual_inputs:
                fixture = fixture_root / real.relative_to(guard.LESSONS)
                fixture.parent.mkdir(parents=True, exist_ok=True)
                fixture.write_bytes(real.read_bytes())
                self.assertEqual(guard.builder.lf_hash(fixture), expected)
                copies.append(fixture)
            for target in copies:
                original = target.read_bytes()
                for mode in ("missing", "forged"):
                    if mode == "missing":
                        target.unlink()
                    else:
                        target.write_bytes(original + b"\nforged fixture\n")
                    with self.subTest(path=str(target), mode=mode), ExitStack() as stack:
                        effects = [stack.enter_context(patch.object(obj, attr)) for obj, attr in (
                            (guard.builder.subprocess, "run"), (Path, "mkdir"), (Path, "write_text"),
                            (Path, "write_bytes"), (guard.builder, "build_document"),
                            (guard.builder, "asset_sources"), (guard.builder, "documents"),
                            (guard.builder, "zip_document"), (guard.builder, "render_proof"))]
                        with self.assertRaises(FileNotFoundError if mode == "missing" else ValueError):
                            guard.builder.build(fixture_root)
                        for effect in effects:
                            effect.assert_not_called()
                    target.write_bytes(original)


if __name__ == "__main__":
    unittest.main()
