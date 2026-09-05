"""Exact-source assembly tests; fixtures grant no student-output acceptance."""
import tempfile
import unittest
from pathlib import Path

from PIL import Image

from chapter_pipeline import prepare_chapter, verify_chapter_inputs
from print_pipeline import digest


class ChapterPipelineTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="book2-chapter-test-")
        self.addCleanup(self.temp.cleanup)
        self.chapter = Path(self.temp.name) / "2.1 Hoofdstuk Kosten en opbrengsten"
        self.chapter.mkdir()
        self.spec = {"nr": "2.1", "title": "Kosten en opbrengsten",
                     "front_html": '<div class="chapter-front"><h1>Hoofdstuk 2.1</h1><p>Front.</p></div>',
                     "paragraphs": []}
        for index in range(1, 5):
            nr = f"2.1.{index}"
            folder_name = f"{nr} Test {index}"
            folder = self.chapter / folder_name
            folder.mkdir()
            paragraph = {"nr": nr, "folder": folder_name}
            kind = "opgaven" if index == 4 else "paragraaf"
            for output_kind, hash_key, label in ((kind, "student_sha256", "Student"),
                                                ("antwoorden", "answers_sha256", "Answer")):
                path = folder / f"{folder_name} – {output_kind}.md"
                path.write_text(f"# {folder_name}\n\n{label} marker {nr}.\n\n**Opgave 1**\n\nTask.\n", encoding="utf-8")
                paragraph[hash_key] = digest(path)
            if index < 4:
                (folder / f"{folder_name} – opgaven.md").write_text("DUPLICATE ROUTE MUST NOT APPEAR", encoding="utf-8")
            self.spec["paragraphs"].append(paragraph)

    def test_single_route_and_separate_answers_preserve_order(self):
        result = prepare_chapter(self.chapter, self.spec)
        self.assertEqual(len(result["inputs"]), 8)
        self.assertNotIn("DUPLICATE", result["student_md"])
        self.assertNotIn("Answer marker", result["student_md"])
        self.assertNotIn("Student marker", result["answers_md"])
        for index in range(1, 5):
            self.assertEqual(result["student_md"].count(f"Student marker 2.1.{index}"), 1)
            self.assertEqual(result["answers_md"].count(f"Answer marker 2.1.{index}"), 1)
        self.assertLess(result["student_md"].index("Student marker 2.1.1"), result["student_md"].index("Student marker 2.1.4"))

    def test_wrong_order_duplicate_or_unpinned_input_is_rejected(self):
        self.spec["paragraphs"][0]["student_sha256"] = "0" * 64
        with self.assertRaisesRegex(ValueError, "Unpinned or changed"):
            prepare_chapter(self.chapter, self.spec)
        self.spec["paragraphs"].reverse()
        with self.assertRaisesRegex(ValueError, "ordered, unique"):
            prepare_chapter(self.chapter, self.spec)

    def test_source_mutation_after_preflight_is_rejected(self):
        result = prepare_chapter(self.chapter, self.spec)
        Path(result["inputs"][0]["path"]).write_text("Changed", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "changed after preflight"):
            verify_chapter_inputs(result)

    def test_front_active_html_and_wrong_book_are_rejected(self):
        self.spec["front_html"] = '<div class="chapter-front"><script>alert(1)</script></div>'
        with self.assertRaisesRegex(ValueError, "Unsupported"):
            prepare_chapter(self.chapter, self.spec)
        self.spec["nr"] = "1.1"
        with self.assertRaisesRegex(ValueError, "exact Book 2"):
            prepare_chapter(self.chapter, self.spec)

    def test_assets_are_paired_namespaced_and_bound_to_original(self):
        paragraph = self.spec["paragraphs"][0]
        folder = self.chapter / paragraph["folder"]
        assets = folder / "_assets"
        assets.mkdir()
        svg = assets / "2.1.1_fig_1.svg"
        svg.write_text('<svg xmlns="http://www.w3.org/2000/svg"/>', encoding="utf-8")
        source = folder / f"{folder.name} – paragraaf.md"
        text = source.read_text(encoding="utf-8") + '\n![A labelled diagram](_assets/2.1.1_fig_1.svg)\n'
        source.write_text(text, encoding="utf-8")
        paragraph["student_sha256"] = digest(source)
        with self.assertRaisesRegex(FileNotFoundError, "Missing paired"):
            prepare_chapter(self.chapter, self.spec)
        Image.new("RGB", (10, 10), "white").save(svg.with_suffix(".png"))
        result = prepare_chapter(self.chapter, self.spec)
        self.assertEqual(len(result["assets"]), 2)
        self.assertEqual(result["assets"][0]["sha256"], digest(svg))
        svg.write_text("Changed", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "changed after preflight"):
            verify_chapter_inputs(result)


if __name__ == "__main__":
    unittest.main()
