"""Regression coverage for the duplicate named destinations in Book 2."""
from io import BytesIO
from pathlib import Path
from tempfile import TemporaryDirectory
import copy
import json
import unittest

from pypdf import PdfReader, PdfWriter
from pypdf.generic import (ArrayObject, DictionaryObject, FloatObject,
                           NameObject, TextStringObject)

from build_book2_chat import append_chapters, localize_links, file_record, revision_inputs


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


class RevisionBindingTests(unittest.TestCase):
    def test_only_complete_current_source_and_chapter_bindings_are_accepted(self):
        with TemporaryDirectory() as tmp:
            root = Path(tmp)
            names = [f"chapters/{kind}-{n}.pdf" for kind in ("student", "answer", "teacher") for n in (1, 2, 3)]
            for name in names:
                file = root/name
                file.parent.mkdir(exist_ok=True)
                file.write_bytes(b"fixture")
            manuscript = root/"bronnen/H1/manuscript/test.md"
            manuscript.parent.mkdir(parents=True)
            manuscript.write_text("Source", encoding="utf-8")
            config = root/"assembly.json"
            config.write_text(json.dumps({"bundles": [{"chapters": names}]}), encoding="utf-8")
            binding = {"revision": "exercise-routes-20260921", "sources": [file_record(root, manuscript), file_record(root, config)],
                       "chapters": {name: file_record(root, root/name) for name in names}}
            def check(value):
                (root/"route-chapter-inputs.json").write_text(json.dumps(value), encoding="utf-8")
                return revision_inputs(root)
            self.assertEqual(check(binding), binding)
            mutations = [
                lambda v: v.update(revision="unknown"),
                lambda v: v["chapters"].pop(names[0]),
                lambda v: v["sources"].append(v["sources"][0]),
                lambda v: v["sources"].pop(0),
                lambda v: v["sources"][0].update(path="../outside.md"),
                lambda v: v["sources"][0].update(sha256="0"*64),
                lambda v: v["chapters"][names[0]].update(sha256="0"*64),
            ]
            for mutation in mutations:
                value = copy.deepcopy(binding)
                mutation(value)
                with self.subTest(value=value), self.assertRaises(ValueError):
                    check(value)


if __name__ == "__main__":
    unittest.main()
