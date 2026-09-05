"""§211 R5 exact bonus insertion, not a review or an acceptance grant.

HOW TO ADAPT: a later authorized source change needs its own reviewed exact
transformation. Never strip arbitrary lists or accept unrelated source drift.
"""
import subprocess
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import b2_211 as builder

BASE = "2bf6260c5d4d799c5408f898d0dab126eff9e5ac"
SOURCE_REL = "build-scripts/content/book-2/211/"
NAMES = ("theory.md", "exercises.md", "answers.md", "target-answers.md")
ANCHOR = "## Herhaling / Herhaling en interleaving\n"
BLOCK = """**Beoordelingscriteria:**

- Je vergelijkt GVK = TVK/Q bij beide aantallen voor A en B, met euro per product als eenheid.
- Je weerlegt ‘altijd constant’ met B en koppelt A's gelijke GVK aan de gegeven € 1 aan variabele kosten per product.
- Je geeft een mogelijke verklaring voor B zonder vaste kosten toe te voegen en benoemt dat twee waarnemingen geen unieke kostenfunctie bepalen.

"""


def previous(relative):
    return subprocess.run(["git", "show", f"{BASE}:{relative}"], cwd=builder.ROOT,
                          capture_output=True, check=True).stdout.decode("utf-8")


def baseline_sources():
    return {name: previous(SOURCE_REL + name) for name in NAMES}


def expected_sources():
    sources = baseline_sources()
    assert sources["answers.md"].count(ANCHOR) == 1
    assert "Beoordelingscriteria" not in sources["answers.md"]
    sources["answers.md"] = sources["answers.md"].replace(ANCHOR, BLOCK + ANCHOR, 1)
    return sources


def require_exact_sources(sources):
    expected = expected_sources()
    if set(sources) != set(expected):
        raise AssertionError("Exact four-source inventory differs")
    for name in NAMES:
        if sources[name] != expected[name]:
            raise AssertionError(f"Exact reviewed-base plus bonus insertion differs: {name}")


class BonusContractTests(unittest.TestCase):
    def test_current_complete_sources_equal_exact_insertion(self):
        require_exact_sources({name: (builder.CONTENT / name).read_bytes().decode("utf-8")
                               for name in NAMES})

    def test_real_old_missing_block_is_rejected(self):
        with self.assertRaisesRegex(AssertionError, "answers.md"):
            require_exact_sources(baseline_sources())

    def test_extra_criterion_is_rejected(self):
        altered = expected_sources()
        altered["answers.md"] = altered["answers.md"].replace(ANCHOR, "- Extra criterium.\n\n" + ANCHOR)
        with self.assertRaisesRegex(AssertionError, "answers.md"):
            require_exact_sources(altered)

    def test_missing_one_criterion_is_rejected(self):
        altered = expected_sources()
        bullet = next(line for line in BLOCK.splitlines(keepends=True) if line.startswith("- "))
        altered["answers.md"] = altered["answers.md"].replace(bullet, "", 1)
        with self.assertRaisesRegex(AssertionError, "answers.md"):
            require_exact_sources(altered)

    def test_misplaced_block_is_rejected(self):
        altered = baseline_sources()
        altered["answers.md"] = altered["answers.md"].replace("**Opgave 8**\n", BLOCK + "**Opgave 8**\n", 1)
        with self.assertRaisesRegex(AssertionError, "answers.md"):
            require_exact_sources(altered)

    def test_changed_existing_model_answer_is_rejected(self):
        altered = expected_sources()
        altered["answers.md"] = altered["answers.md"].replace("GVK = 500/200", "GVK = 500/100", 1)
        self.assertNotEqual(altered, expected_sources())
        with self.assertRaisesRegex(AssertionError, "answers.md"):
            require_exact_sources(altered)

    def test_unrelated_source_drift_is_rejected(self):
        for name in NAMES:
            altered = expected_sources()
            altered[name] += "\nOngevraagde toevoeging.\n"
            with self.subTest(name=name), self.assertRaisesRegex(AssertionError, name):
                require_exact_sources(altered)

    def test_all_original_test_bodies_and_generator_remain_exact(self):
        for relative in (SOURCE_REL + "test_source.py", "build-scripts/content/book-2/b2_211.py",
                         "build-scripts/content/book-2/print_pipeline.py", SOURCE_REL + "check_render.py"):
            self.assertEqual((builder.ROOT / relative).read_text(encoding="utf-8"), previous(relative))


if __name__ == "__main__":
    unittest.main()
