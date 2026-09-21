"""Regression tests for semantic source recovery and actual positioned overflow."""
import json
from pathlib import Path
import re
import shutil
import tempfile
import unittest
from bs4 import BeautifulSoup
import fitz
from weasyprint import HTML
from book2_native_theory import CSS
from book2_native_checks import check_layout
from build_book2_chat import EDITION
from verify_book2_signed import verify_footer,verify_print
from assemble_book2_signed import source_paths,validate_inputs

LESSONS=Path(__file__).resolve().parents[3]/'4veco-lessen'

class NativeLayoutTests(unittest.TestCase):
    def render(self,text):
        return HTML(string='<style>'+CSS+'</style><section class="page native-page"><article class="native-theory">'+text+'</article></section>').render()

    def test_actual_child_overflow_fails_even_when_page_count_stays_one(self):
        source='<p class="native-text" data-layout-width="40" data-layout-height="20" style="left:54pt;top:50pt">Kosten</p>'
        check_layout(self.render(source))
        long=self.render(source.replace('Kosten','Kosten en opbrengsten '+('veel extra tekst '*12)))
        self.assertEqual(len(long.pages),1)
        with self.assertRaisesRegex(ValueError,'native text overflow'):check_layout(long)

    def test_native_text_edit_propagates_without_reference_pdf(self):
        source='<p class="native-text" style="left:54pt;top:50pt">Kosten 300</p>'
        before=self.render(source).write_pdf();after=self.render(source.replace('300','450')).write_pdf()
        self.assertNotEqual(before,after)
        self.assertIn('450',fitz.open(stream=after,filetype='pdf')[0].get_text())

    def test_displaced_text_is_rejected(self):
        for position in ('left:650pt;top:50pt','left:-200pt;top:50pt','left:54pt;top:900pt','left:54pt;top:-50pt'):
            with self.subTest(position=position):
                source=f'<p class="native-text" data-layout-width="40" data-layout-height="20" style="{position}">Kosten</p>'
                document=self.render(source)
                self.assertEqual(len(document.pages),1)
                with self.assertRaisesRegex(ValueError,'outside physical page'):check_layout(document)

    def test_reviewed_tables_fractions_and_caption_associations(self):
        pages={}
        for file in (LESSONS/EDITION/'bronnen').glob('H*/manuscript/*.md'):
            # The source is Markdown plus embedded HTML; parse each HTML island
            # separately so unrelated Markdown inequalities aren't HTML tags.
            for html in re.findall(r'<article class="native-theory"[\s\S]*?</article>',file.read_text(encoding='utf8')):
                article=BeautifulSoup(html,'html.parser').article
                pages[int(article['data-accepted-page'])]=article
        self.assertEqual(len(pages),43)
        def rows(n,index=0):return [[c.get_text(' ',strip=True)for c in row.select('th,td')]for row in pages[n].select('table')[index].select('tr')]
        self.assertEqual(len(pages[6].select('table')),1)
        self.assertEqual(len(pages[6].select('[role=math]')),6)
        self.assertEqual(len(pages[40].select('[role=math]')),2)
        self.assertEqual(len(rows(30)),5)
        self.assertEqual(rows(40)[0],['Waarde van Ev','Indeling','Reactie van Qv ten opzichte van P'])
        self.assertEqual(rows(41,1)[1],['KlimStudio','−0,5','−1 < −0,5 < 0','Prijsinelastisch'])
        self.assertEqual(rows(94)[-1],['Verandering','−€ 56','+€ 8','−€ 48'])
        self.assertEqual(rows(110)[0],['Begrip','Betekenis in dit hoofdstuk','Zie p.'])
        for page in pages.values():
            self.assertFalse(page.select('table [role=math]'))
            for caption in page.select('figcaption'):self.assertEqual(caption.parent.name,'figure')
        for n,ending in [(6,'gemiddelde kosten.'),(93,'driehoek.'),(94,'niemand.')]:
            self.assertTrue(pages[n].select_one('figcaption').get_text(' ',strip=True).endswith(ending))


class PrintNavigationTests(unittest.TestCase):
    def test_changed_extract_page_map_is_rejected_before_assembly(self):
        original=LESSONS/EDITION
        record=json.loads((original/'signed-chapter-inputs.json').read_text(encoding='utf8'))
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory)
            files=[*source_paths(original),original/'signed-chapter-inputs.json',
                   *(original/name for name in record['chapters'])]
            for source in files:
                target=root/source.relative_to(original)
                target.parent.mkdir(parents=True,exist_ok=True)
                shutil.copyfile(source,target)
            validate_inputs(root)
            page_map=root/'signed-page-map.json'
            rows=json.loads(page_map.read_text(encoding='utf8'))
            rows[0]['physical_page']+=1
            page_map.write_text(json.dumps(rows),encoding='utf8')
            with self.assertRaisesRegex(ValueError,'Stale/unsafe native input: signed-page-map.json'):
                validate_inputs(root)

    def test_wrong_printed_footer_is_rejected(self):
        doc=fitz.open();page=doc.new_page(width=595.2756,height=841.8898)
        page.insert_text((535,820),'35',fontsize=9)
        verify_footer(page,35)
        with self.assertRaisesRegex(ValueError,'Printed page number differs'):
            verify_footer(page,1)
        doc.close()

    def test_changed_contents_number_is_rejected(self):
        root=LESSONS/EDITION
        bundle=json.loads((root/'assembly.json').read_text(encoding='utf8'))['bundles'][0]
        with fitz.open(root/bundle['output']) as doc:
            verify_print(root,bundle,doc)
            page=doc[1]
            box=next(fitz.Rect(w[:4]) for w in page.get_text('words') if w[4]=='35' and w[0]>480)
            page.add_redact_annot(box,fill=(1,1,1));page.apply_redactions()
            page.insert_text((box.x0,box.y1-2),'37',fontsize=10)
            with self.assertRaisesRegex(ValueError,'Wrong contents page reference'):
                verify_print(root,bundle,doc)

if __name__=='__main__':unittest.main()
