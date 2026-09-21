"""Regression coverage for the duplicate named destinations in Book 2."""
from io import BytesIO
import unittest

from pypdf import PdfReader, PdfWriter
from pypdf.generic import (ArrayObject, DictionaryObject, FloatObject,
                           NameObject, TextStringObject)

from build_book2_chat import append_chapters, localize_links


def chapter(action=False, destination="overzicht"):
    writer = PdfWriter()
    writer.add_blank_page(100, 100)
    writer.add_blank_page(100, 100)
    writer.add_named_destination("overzicht", 1)
    annotation = DictionaryObject({
        NameObject("/Type"): NameObject("/Annot"),
        NameObject("/Subtype"): NameObject("/Link"),
        NameObject("/Rect"): ArrayObject([FloatObject(n) for n in (5, 5, 90, 20)]),
    })
    if action:
        annotation[NameObject("/A")] = DictionaryObject({
            NameObject("/S"): NameObject("/GoTo"),
            NameObject("/D"): TextStringObject(destination),
        })
    else:
        annotation[NameObject("/Dest")] = TextStringObject(destination)
    writer.pages[0][NameObject("/Annots")] = ArrayObject([writer._add_object(annotation)])
    output = BytesIO()
    writer.write(output)
    return PdfReader(BytesIO(output.getvalue()))


class ChapterLinkTests(unittest.TestCase):
    def test_duplicate_names_stay_in_their_chapter_with_frontmatter(self):
        for action in (False, True):
            with self.subTest(action=action):
                writer = PdfWriter()
                writer.add_blank_page(100, 100)
                append_chapters(writer, [("h2", chapter(action)), ("h3", chapter(action))])
                output = BytesIO()
                writer.write(output)
                result = PdfReader(BytesIO(output.getvalue()))
                for opening, target in [(1, 2), (3, 4)]:
                    annotation = result.pages[opening]["/Annots"][0].get_object()
                    destination = annotation["/A"]["/D"] if action else annotation["/Dest"]
                    self.assertEqual(destination[0], result.pages[target].indirect_reference)
                self.assertEqual(set(result.named_destinations), {"h2-overzicht", "h3-overzicht"})
                self.assertEqual(result.get_destination_page_number(result.named_destinations["h3-overzicht"]), 4)

    def test_unknown_destination_stops_the_build(self):
        for action in (False, True):
            with self.subTest(action=action), self.assertRaisesRegex(ValueError, "Unresolved chapter"):
                localize_links(chapter(action, "missing"))

    def test_external_action_is_preserved(self):
        reader = chapter()
        annotation = reader.pages[0]["/Annots"][0].get_object()
        del annotation["/Dest"]
        external = DictionaryObject({NameObject("/S"): NameObject("/URI"),
                                     NameObject("/URI"): TextStringObject("https://example.com/")})
        annotation[NameObject("/A")] = external
        localize_links(reader)
        self.assertEqual(annotation["/A"], external)


if __name__ == "__main__":
    unittest.main()
