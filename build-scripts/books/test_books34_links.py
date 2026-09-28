"""Regression: named chapter links vanish during ordinary PyMuPDF insertion."""
import unittest
import fitz
from books34_links import insert_preserving_links


def chapter(name='overzicht', y=120):
    doc=fitz.open()
    doc.new_page(); doc.new_page()
    doc[0].insert_text((40,70),'Contents'); doc[1].insert_text((40,y),'Destination')
    doc[0].insert_link({'kind':fitz.LINK_GOTO,'from':fitz.Rect(40,80,220,100),'page':1,'to':fitz.Point(40,y)})
    doc=fitz.open(stream=doc.tobytes(),filetype='pdf')
    dest=f'[{doc.page_xref(1)} 0 R /XYZ 40 {doc[1].rect.height-y} 0]'
    doc.xref_set_key(doc.pdf_catalog(),'Names',f'<</Dests <</Names [({name}) {dest}]>>>>')
    xref=doc[0].get_links()[0]['xref']
    doc.xref_set_key(xref,'A','null'); doc.xref_set_key(xref,'Dest',f'({name})')
    return fitz.open(stream=doc.tobytes(),filetype='pdf')


class Links(unittest.TestCase):
    def test_old_insertion_loses_named_annotation(self):
        source=chapter(); result=fitz.open(); result.insert_pdf(source)
        self.assertEqual(len(source[0].get_links()),1)
        self.assertEqual(result[0].get_links(),[])

    def test_names_are_local_and_coordinates_are_transformed(self):
        result=fitz.open(); result.new_page()
        for y in (120,300):
            with chapter(y=y) as source: self.assertEqual(insert_preserving_links(result,source),1)
        result=fitz.open(stream=result.tobytes(),filetype='pdf')
        for start,y in ((1,120),(3,300)):
            links=result[start].get_links(); self.assertEqual(len(links),1)
            link=links[0]
            self.assertEqual(link['kind'],fitz.LINK_GOTO)
            self.assertEqual(link['page'],start+1)
            self.assertEqual(link['to'],fitz.Point(40,y))
            self.assertEqual(link['from'],fitz.Rect(40,80,220,100))

    def test_explicit_and_external_links_keep_geometry_and_offsets(self):
        source=fitz.open(); source.new_page(); source.new_page()
        source[0].insert_link({'kind':fitz.LINK_GOTO,'from':fitz.Rect(10,20,40,50),'page':1,'to':fitz.Point(21,42)})
        source[0].insert_link({'kind':fitz.LINK_URI,'from':fitz.Rect(10,60,40,90),'uri':'https://example.org/'})
        source=fitz.open(stream=source.tobytes(),filetype='pdf')
        result=fitz.open(); result.new_page(); insert_preserving_links(result,source)
        result=fitz.open(stream=result.tobytes(),filetype='pdf')
        links=result[1].get_links()
        self.assertEqual(len(links),2)
        self.assertEqual(links[0]['page'],2); self.assertEqual(links[0]['to'],fitz.Point(21,42))
        self.assertEqual(links[1]['uri'],'https://example.org/')
        self.assertEqual(links[1]['from'],fitz.Rect(10,60,40,90))

    def test_broken_named_link_fails_before_append(self):
        source=chapter(); source.xref_set_key(source.pdf_catalog(),'Names','null')
        source=fitz.open(stream=source.tobytes(),filetype='pdf')
        result=fitz.open(); result.new_page()
        with self.assertRaises((ValueError,RuntimeError)):
            insert_preserving_links(result,source)
        self.assertEqual(len(result),1)


if __name__=='__main__':unittest.main()
