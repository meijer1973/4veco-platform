"""Negative coverage for stale teacher front material and source boundaries."""
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
import sys
import tempfile
import unittest
import fitz
from markdown_it import MarkdownIt
import verify_books34_followups as verify


def pdf(second):
    doc=fitz.open()
    for text in ('Header',second):
        page=doc.new_page();page.insert_text((40,60),text)
    return doc.tobytes()


class TeacherFront(unittest.TestCase):
    def check(self,html_note='new note',pdf_note='new note',book_note='new note'):
        md=MarkdownIt().render
        html=lambda note:'<section class="page">Header</section><section class="page">'+md(note).strip()+'</section>'
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp)
            for b in ('3','4'):
                matter=root/f'edities/books34-v3/books/book-{b}/book-matter/output'
                matter.mkdir(parents=True)
                (matter/'front-teacher.html').write_text(html(html_note),encoding='utf-8')
                (matter/'front-teacher.pdf').write_bytes(pdf(pdf_note))
                book=root/f'edities/books34-v3/books/book-{b}/output';book.mkdir()
                (book/f'Boek_{b}_Compleet_Docenteninformatie_v3.pdf').write_bytes(pdf(book_note))
            original=lambda lessons,path:html('old note').encode() if path.endswith('.html') else pdf('old note')
            with (patch.dict(sys.modules,{'render':SimpleNamespace(render_md=md)}),
                  patch.object(verify,'original',original),
                  patch.object(verify,'OLD_TEACHER_NOTE','old note'),patch.object(verify,'NEW_TEACHER_NOTE','new note')):
                return verify.teacher_front(root)

    def test_current_source_pdf_and_complete_front_pass(self):
        self.assertEqual(len(self.check()),2)

    def test_stale_front_html_is_rejected(self):
        with self.assertRaisesRegex(ValueError,'teacher front HTML'):self.check(html_note='old note')

    def test_correct_html_cannot_bless_stale_pdf(self):
        with self.assertRaisesRegex(ValueError,'teacher front PDF text'):self.check(pdf_note='old note')

    def test_current_front_pdf_cannot_bless_stale_complete_book(self):
        with self.assertRaisesRegex(ValueError,'complete teacher front text'):self.check(book_note='old note')


if __name__=='__main__':unittest.main()
