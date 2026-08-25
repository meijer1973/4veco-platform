import base64
import json
import tempfile
import unittest
from pathlib import Path

from lib_book import (
    BOOK_CSS,
    add_toc_anchors,
    embed_images,
    render_cover_html,
    strip_pandoc_stylesheets,
    wrap_exercises_simple,
)


class BookBuilderRegressionTests(unittest.TestCase):
    def test_cover_rendering_uses_escaped_decorative_image(self):
        html = render_cover_html({
            "title": "Vraag & aanbod",
            "edition": "1e editie",
            "year": 2026,
            "school": "Amstelveen College",
            "cover_image": '_assets/cover&art.png',
        })

        self.assertIn('class="book-cover-image"', html)
        self.assertIn('src="_assets/cover&amp;art.png"', html)
        self.assertIn('alt="" aria-hidden="true"', html)
        self.assertIn('class="book-cover-shade"', html)

    def test_markdown_and_html_images_are_embedded(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            asset_dir = Path(temp_dir)
            (asset_dir / "figure.png").write_bytes(b"figure")
            (asset_dir / "cover.png").write_bytes(b"cover")
            markdown = (
                "![Figure](_assets/figure.svg)\n"
                '<img class="book-cover-image" src="_assets/cover.png" alt="">'
            )

            embedded = embed_images(markdown, asset_dir)

        figure_b64 = base64.b64encode(b"figure").decode()
        cover_b64 = base64.b64encode(b"cover").decode()
        self.assertIn(f"data:image/png;base64,{figure_b64}", embedded)
        self.assertIn(f"data:image/png;base64,{cover_b64}", embedded)
        self.assertNotIn("_assets/figure.svg", embedded)
        self.assertNotIn("_assets/cover.png", embedded)

    def test_block_anchors_precede_markdown_headings(self):
        markdown = "# 1.1 Economisch denken\n\n# 1.1.2 Percentages\n"
        entry = {
            "anchor": "book-toc-chapter-1-1",
            "paragraphs": [{
                "nr": "1.1.2",
                "anchor": "book-toc-paragraph-1-1-2",
            }],
        }

        anchored = add_toc_anchors(markdown, entry)

        self.assertIn(
            '<div id="book-toc-chapter-1-1" class="book-toc-anchor"></div>\n# 1.1',
            anchored,
        )
        self.assertIn(
            '<div id="book-toc-paragraph-1-1-2" class="book-toc-anchor"></div>\n# 1.1.2',
            anchored,
        )
        self.assertNotIn("<span", anchored)

    def test_stylesheet_removal_is_independent_of_pandoc_comment(self):
        for style in (
            "<style>/* Default styles provided by pandoc. */ body { max-width: 36em; }</style>",
            "<style>body { max-width: 36em; padding: 50px; }</style>",
            '<style type="text/css">p { margin: 1em 0; }</style>',
        ):
            source = f"<html><head><meta charset=\"utf-8\">{style}</head><body><style>.keep {{}}</style><p>Text</p></body></html>"
            cleaned = strip_pandoc_stylesheets(source)
            self.assertNotIn("max-width", cleaned)
            self.assertNotIn("margin: 1em", cleaned)
            self.assertIn("<style>.keep {}</style>", cleaned)
            self.assertIn("<p>Text</p>", cleaned)

    def test_exercise_css_keeps_fitting_exercises_together(self):
        self.assertRegex(BOOK_CSS, r"\.exercise\s*\{[^}]*break-inside:\s*avoid")
        self.assertRegex(BOOK_CSS, r"\.exercise\s*\{[^}]*page-break-inside:\s*avoid")

    def test_exercise_wrapper_closes_at_each_content_boundary(self):
        source = (
            "<h1>Before</h1><h3>Theory</h3><p>Intro</p>"
            "<p><strong>Opgave 1</strong></p><p>Question</p>"
            "<h3>Denkertje</h3>"
            "<p><strong>Opgave 2</strong></p><p>Question</p>"
            "<h1>Next paragraph</h1><p>Text</p></body>"
        )
        wrapped = wrap_exercises_simple(source)
        self.assertEqual(2, wrapped.count('<div class="exercise">'))
        self.assertEqual(2, wrapped.count("</div>"))
        self.assertIn("Question</p></div><h1>Next paragraph", wrapped)
        self.assertNotIn("</div><h1>Before", wrapped)
        self.assertIn('<div class="exercise"><h3>Denkertje</h3>', wrapped)
        self.assertNotIn('<div class="exercise"><h3>Theory</h3>', wrapped)

    def test_toolchain_record_covers_reviewed_versions(self):
        record_path = Path(__file__).with_name("book-toolchain.json")
        record = json.loads(record_path.read_text(encoding="utf-8"))
        self.assertEqual("==3.9.0.1", record["pandoc"]["supported"])
        self.assertIn("3.1.3", record["pandoc"]["stylesheet_fixture_versions"])
        self.assertIn("3.9.0.1", record["pandoc"]["stylesheet_fixture_versions"])
        self.assertEqual("==68.1", record["weasyprint"]["supported"])


if __name__ == "__main__":
    unittest.main()
