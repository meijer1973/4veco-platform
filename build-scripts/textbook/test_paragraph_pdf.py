"""Run: python -m unittest discover -s build-scripts/textbook -p 'test_*.py'.
Requires Pandoc, WeasyPrint and pypdf. Renders an actual regression fixture.
"""
from pathlib import Path
import tempfile
import unittest
from paragraph_pdf import build, render_html

FIXTURE = '''# Kosten: € 12 × 2

## Opgave 1

a. Bereken de totale kosten.

| Productie | Kosten |
|---|---|
| 2 | € 24 |

b. Leg het verschil uit.
c. Controleer je antwoord.

**Onthoud**

- Totale kosten veranderen.
- Vaste kosten blijven gelijk.

Bekijk de figuur hieronder en vergelijk de lijnen.

![Kostenlijnen](_assets/9.9.1_fig_1.svg)
'''


class ParagraphPdfTest(unittest.TestCase):
    def test_unsupported_math_cannot_silently_publish_literal_tex(self):
        with self.assertRaisesRegex(ValueError, 'Pandoc conversion requires attention'):
            render_html(r'$GTK = \unsupportedmacro{TK}{q}$', 'Unsupported formula')

    def test_utf8_lists_and_table(self):
        markup = render_html(FIXTURE, 'Titel "Kosten"')
        self.assertIn('€ 12 × 2', markup)
        self.assertIn('start="2"', markup)
        self.assertIn('type="a"', markup)
        self.assertIn('<ul>', markup)
        self.assertIn('class="figure-context"', markup)
        self.assertIn('Titel &quot;Kosten&quot;', markup)

    def test_rendered_pdf_preserves_text_and_figure_instruction(self):
        from pypdf import PdfReader
        with tempfile.TemporaryDirectory() as temp:
            folder = Path(temp) / '9.9.1 Test'; folder.mkdir()
            assets = folder / '_assets'; assets.mkdir()
            (assets / '9.9.1_fig_1.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" width="500" height="260"><rect width="500" height="260" fill="#edf3f6"/><path d="M40 20V220H460 M40 210L430 40" fill="none" stroke="#174c66" stroke-width="3"/></svg>', encoding='utf-8')
            source = folder / '9.9.1 Test – paragraaf.md'
            source.write_text(FIXTURE, encoding='utf-8')
            outputs = build(folder)
            self.assertEqual(len(outputs), 2)
            pages = PdfReader(source.with_suffix('.pdf')).pages
            text = '\n'.join(page.extract_text() for page in pages)
            for value in ['€ 12 × 2', 'a.', 'b.', 'c.', 'Totale kosten veranderen.', 'Vaste kosten blijven gelijk.']:
                self.assertIn(''.join(value.split()), ''.join(text.split()))
            self.assertEqual(len(pages), 1)

    def test_missing_image_fails_without_publishing_incomplete_pdf(self):
        with tempfile.TemporaryDirectory() as temp:
            folder = Path(temp) / '9.9.1 Test'; folder.mkdir()
            source = folder / '9.9.1 Test – paragraaf.md'
            source.write_text('# Test\n\n![Missing](missing.svg)', encoding='utf-8')
            with self.assertRaisesRegex(ValueError, 'Missing or forbidden'):
                build(folder)
            self.assertFalse(source.with_suffix('.pdf').exists())

    def test_figure_instruction_stays_with_figure_after_pagination(self):
        from pypdf import PdfReader
        with tempfile.TemporaryDirectory() as temp:
            folder = Path(temp) / '9.9.1 Test'; folder.mkdir()
            assets = folder / '_assets'; assets.mkdir()
            (assets / '9.9.1_fig_1.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" width="500" height="360"><rect width="500" height="360" fill="#edf3f6"/></svg>', encoding='utf-8')
            source = folder / '9.9.1 Test – paragraaf.md'
            filler = '\n\n'.join('Deze alinea bespreekt vaste en variabele kosten. ' * 7 for _ in range(16))
            source.write_text(FIXTURE.replace('Bekijk de figuur', filler + '\n\nBekijk de figuur'), encoding='utf-8')
            build(folder)
            pages = [page.extract_text() for page in PdfReader(source.with_suffix('.pdf')).pages]
            self.assertGreater(len(pages), 1)
            page = next(text for text in pages if 'Bekijk de figuur' in text)
            self.assertIn('Kostenlijnen', page)


if __name__ == '__main__':
    unittest.main()
