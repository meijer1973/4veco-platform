"""Focused Book 2 print regressions, including a real temporary PDF render."""
import base64
import tempfile
import unittest
from unittest.mock import patch
import subprocess
from pathlib import Path

from bs4 import BeautifulSoup
from PIL import Image
from pypdf import PdfReader

from print_pipeline import CSS, _embed_images, _protect_short_callouts, _wrap_exercises, build_document, prepare_html, render_proof, validate_source_html


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

    def test_only_short_text_callouts_are_kept_together(self):
        soup = BeautifulSoup('<blockquote class="warning"><p><strong>Let op</strong></p><p>Een korte voorwaarde.</p></blockquote>'
                             + '<blockquote><p>' + 'reading ' * 120 + '</p></blockquote>'
                             + '<blockquote><table><tr><td>Table</td></tr></table></blockquote>', "html.parser")
        _protect_short_callouts(soup)
        _protect_short_callouts(soup)
        blocks = soup.find_all("blockquote")
        self.assertEqual(blocks[0]["class"], ["warning", "callout-short"])
        self.assertNotIn("callout-short", blocks[1].get("class", []))
        self.assertNotIn("callout-short", blocks[2].get("class", []))

    def test_real_pdf_keeps_short_warning_label_with_body_at_page_boundary(self):
        self.source.write_text('<div style="height: 232mm;"></div>\n\n'
                               '> **Waarschuwingslabel**\n>\n'
                               '> Deze voorwaarde hoort bij het label en mag er niet van worden gescheiden. '
                               'Controleer de productieperiode en het productiegebied voordat je de kosten vergelijkt.\n', encoding="utf-8")
        record = build_document(self.source)
        pages = [page.extract_text() for page in PdfReader(record["source_pdf"]).pages]
        self.assertEqual(len(pages), 2)
        self.assertNotIn("Waarschuwingslabel", pages[0])
        self.assertIn("Waarschuwingslabel", pages[1])
        self.assertIn("Deze voorwaarde", pages[1])
        self.assertIn("kosten vergelijkt", " ".join(pages[1].split()))

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

    def test_raw_html_cannot_load_remote_resources_or_shrink_text(self):
        for fragment in [
            '<p style="background-image:url(https://example.invalid/a.png)">A</p>',
            '<video src="https://example.invalid/a.mp4"></video>',
            '<meta http-equiv="refresh" content="0;url=https://example.invalid/">',
            '<p style="font-size:6pt">A</p>', '<style>p{font-size:6pt}</style>',
            '<img alt="A" src="_assets/a.png" onerror="alert(1)">',
            '<p style="width:calc(100% - 4px)">A</p>',
            '<math mathsize="6pt"><mi>x</mi></math>',
            '<a href="javascript:alert(1)">A</a>',
        ]:
            with self.subTest(fragment=fragment), self.assertRaises(ValueError):
                validate_source_html(BeautifulSoup(fragment, "html.parser"))

    def test_bounded_structural_inline_css_and_anchors_remain_supported(self):
        validate_source_html(BeautifulSoup('<div class="page-break" style="break-before: page;"></div><table><colgroup><col style="width: 40%"></colgroup></table><a href="#p1">1</a>', "html.parser"))

    def test_real_prepare_rejects_ping_and_math_shrinking_attributes(self):
        for fragment in [
            '<a href="#x" ping="https://example.invalid/track">A</a>',
            '<math scriptsizemultiplier="0.1" scriptminsize="1pt"><mi>x</mi></math>',
            '<math scriptminsize="1pt"><mi>x</mi></math>',
        ]:
            with self.subTest(fragment=fragment), self.assertRaises(ValueError):
                prepare_html('# Kosten\n\n' + fragment + '\n', self.source)

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
        for field in ["source_sha256", "html_sha256", "pdf_sha256"]:
            stale = {**record, field: "0" * 64}
            with self.subTest(field=field), self.assertRaisesRegex(ValueError, "Stale proof input"):
                render_proof(stale, self.root / "stale-proof")
            self.assertFalse((self.root / "stale-proof").exists())
        stale = {**record, "assets": [{**record["assets"][0], "sha256": "0" * 64}]}
        with self.assertRaisesRegex(ValueError, "Stale proof asset"):
            render_proof(stale, self.root / "stale-asset")

    def test_input_change_during_capture_does_not_publish_manifest(self):
        self.pair()
        self.source.write_text('# Kosten\n\n![Cost diagram](_assets/2.1.1_fig_1.svg)\n', encoding="utf-8")
        record = build_document(self.source)
        real_run = subprocess.run
        paths = [record["source_md"], record["source_html"], record["source_pdf"], record["assets"][0]["path"]]
        for index, path in enumerate(paths):
            changed = Path(path)
            original = changed.read_bytes()
            destination = self.root / f"interrupted-{index}"
            def change_after_capture(*args, **kwargs):
                result = real_run(*args, **kwargs)
                changed.write_bytes(original + b"\n")
                return result
            try:
                with self.subTest(path=path), patch("print_pipeline.subprocess.run", side_effect=change_after_capture):
                    with self.assertRaisesRegex(ValueError, "Stale proof"):
                        render_proof(record, destination)
                    self.assertFalse((destination / "manifest.json").exists())
            finally:
                changed.write_bytes(original)

    def test_build_records_consumed_source_snapshot_not_later_bytes(self):
        self.source.write_text('# Original source\n', encoding="utf-8")
        real_prepare = prepare_html
        def mutate_after_read(*args, **kwargs):
            result = real_prepare(*args, **kwargs)
            self.source.write_text('# Changed source\n', encoding="utf-8")
            return result
        with patch("print_pipeline.prepare_html", side_effect=mutate_after_read):
            with self.assertRaisesRegex(ValueError, "Stale proof input: source_md"):
                build_document(self.source)

    def test_build_records_consumed_html_snapshot_not_later_disk_bytes(self):
        from weasyprint import HTML
        self.source.write_text('# Original source\n', encoding="utf-8")
        real_write = HTML.write_pdf
        html_path = self.source.with_suffix(".html")
        def mutate_during_render(renderer, *args, **kwargs):
            result = real_write(renderer, *args, **kwargs)
            html_path.write_text('<html><body>Changed HTML</body></html>', encoding="utf-8")
            return result
        with patch.object(HTML, "write_pdf", new=mutate_during_render):
            with self.assertRaisesRegex(ValueError, "Stale proof input: source_html"):
                build_document(self.source)

    def test_build_records_generated_pdf_bytes_not_mutated_disk_bytes(self):
        self.source.write_text('# Original source\n', encoding="utf-8")
        real_write = Path.write_bytes
        def mutate_pdf_write(path, data):
            result = real_write(path, data)
            if path.suffix == '.pdf':
                real_write(path, data + b'\nchanged')
            return result
        with patch.object(Path, "write_bytes", new=mutate_pdf_write):
            with self.assertRaisesRegex(ValueError, "Stale proof input: source_pdf"):
                build_document(self.source)


if __name__ == "__main__":
    unittest.main()
