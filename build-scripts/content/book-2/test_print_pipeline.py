"""Focused Book 2 print regressions, including a real temporary PDF render."""
import base64
import tempfile
import unittest
from pathlib import Path

from bs4 import BeautifulSoup
from PIL import Image
from pypdf import PdfReader

from print_pipeline import CSS, _embed_images, _wrap_exercises, build_document, prepare_html, render_proof


class PrintPipelineTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="book2-print-test-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.source = self.root / "2.1.1 Test – paragraaf.md"
        self.assets = self.root / "_assets"
        self.assets.mkdir()

    def pair(self, name="2.1.1_fig_1"):
        (self.assets / f"{name}.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200"><rect width="600" height="200" fill="white"/></svg>', encoding="utf-8")
        Image.new("RGB", (600, 200), "white").save(self.assets / f"{name}.png")

    def test_svg_reference_requires_and_embeds_png_pair(self):
        self.pair()
        soup = BeautifulSoup('<img alt="Cost diagram" src="_assets/2.1.1_fig_1.svg">', "html.parser")
        assets = _embed_images(soup, self.source)
        self.assertEqual(len(assets), 2)
        self.assertTrue(soup.img["src"].startswith("data:image/png;base64,"))
        self.assertEqual(base64.b64decode(soup.img["src"].split(",", 1)[1]), (self.assets / "2.1.1_fig_1.png").read_bytes())

    def test_missing_pair_is_hard_failure(self):
        soup = BeautifulSoup('<img alt="Cost diagram" src="_assets/missing.svg">', "html.parser")
        with self.assertRaises(FileNotFoundError):
            _embed_images(soup, self.source)

    def test_remote_and_traversal_and_missing_alt_rejected(self):
        for src in ["https://example.com/image.png", "../secret.png", "file:///a.png", "data:image/png;base64,eA=="]:
            with self.subTest(src=src), self.assertRaises(ValueError):
                _embed_images(BeautifulSoup(f'<img alt="Diagram" src="{src}">', "html.parser"), self.source)
        with self.assertRaises(ValueError):
            _embed_images(BeautifulSoup('<img src="_assets/a.svg">', "html.parser"), self.source)

    def test_exercises_stop_at_heading_and_other_exercise(self):
        soup = BeautifulSoup('<body><p><strong>Opgave 1</strong></p><p>a) A.</p><p><strong>Opgave 2</strong></p><p>b) B.</p><h2>Doeloefening</h2><p>Outside.</p></body>', "html.parser")
        _wrap_exercises(soup)
        self.assertEqual(len(soup.select(".exercise")), 2)
        self.assertIsNone(soup.h2.find_parent(class_="exercise"))
        self.assertEqual(soup.select(".exercise")[0].get_text(" ", strip=True), "Opgave 1 a) A.")
        self.assertIn("exercise-short", soup.select(".exercise")[0]["class"])

    def test_front_matter_not_wrapped(self):
        soup = BeautifulSoup('<body><div class="chapter-front"><p><strong>Opgave 1</strong></p></div></body>', "html.parser")
        _wrap_exercises(soup)
        self.assertFalse(soup.select(".exercise"))

    def test_long_exercise_is_allowed_to_split(self):
        soup = BeautifulSoup('<body><p><strong>Opgave 1</strong></p><p>' + "reading " * 120 + '</p></body>', "html.parser")
        _wrap_exercises(soup)
        self.assertNotIn("exercise-short", soup.select(".exercise")[0]["class"])

    def test_pandoc_title_styles_math_and_dutch(self):
        html, assets = prepare_html("# Kosten\n\n$TK=500+0.8Q$\n", self.source)
        soup = BeautifulSoup(html, "html.parser")
        self.assertEqual(len(soup.find_all("h1")), 1)
        self.assertEqual(len(soup.head.find_all("style")), 1)
        self.assertNotIn("max-width: 36em", html)
        self.assertEqual(soup.html["lang"], "nl")
        self.assertIsNotNone(soup.find("math"))
        self.assertEqual(assets, [])

    def test_no_scripts_or_external_styles(self):
        with self.assertRaises(ValueError):
            prepare_html('# Cost\n\n<script src="https://example.com/a.js"></script>\n', self.source)

    def test_body_table_and_front_readability_floor(self):
        self.assertIn("font-size: 12pt", CSS)
        self.assertNotIn("11pt", CSS)
        self.assertNotIn("10pt", CSS)

    def test_real_pdf_and_proof_never_auto_approve(self):
        self.pair()
        self.source.write_text('# Kostenstructuren\n\nKosten per maand: € 500.\n\n![Schematische kostendiagram](_assets/2.1.1_fig_1.svg)\n\n## Startopgaven\n\n**Opgave 1**\n\na) Bereken 500 / 100.\n', encoding="utf-8")
        record = build_document(self.source)
        pdf = PdfReader(record["source_pdf"])
        self.assertEqual(len(pdf.pages), 1)
        self.assertIn("Kostenstructuren", pdf.pages[0].extract_text())
        proof = render_proof(record, self.root / "proof")
        self.assertEqual(proof["rendered_pages"], ["pages/page-001.png"])
        self.assertEqual(proof["inspection_status"], "PENDING")
        self.assertEqual(proof["pages_inspected"], [])
        self.assertIsNone(proof["visible_student_defects"])
        self.assertFalse(proof["inspected_at_normal_reading_scale"])
        with self.assertRaises(ValueError):
            render_proof(record, self.root / "proof")


if __name__ == "__main__":
    unittest.main()
