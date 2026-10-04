import copy,io,tempfile,unittest,zipfile
from pathlib import Path
from verify_textbook_maintenance import graph_check
from repair_textbook_maintenance_presentations import make_parts,verify_parts

class RegressionChecks(unittest.TestCase):
    def test_extrapolation_and_incorrect_equation_are_rejected(self):
        with tempfile.TemporaryDirectory() as root:
            file=Path(root)/'example.svg'
            valid='<svg><line data-curve="vraag" x1="82" y1="88.142857" x2="494.5" y2="243.857143"/></svg>'
            def check(s):file.write_text(s);graph_check(Path(root),'example',240,28,(4,24),{'vraag':(240,-10)})
            check(valid)
            for bad in [valid.replace('494.5','577'),valid.replace('243.857143','250'),valid.replace('88.142857','80')]:
                with self.assertRaises(AssertionError):check(bad)
    def test_saved_deck_rejects_extra_body_or_native_data_mutation(self):
        def package(parts):
            data=io.BytesIO()
            with zipfile.ZipFile(data,'w') as z:
                for name,text in parts.items():z.writestr(name,text)
            return data.getvalue()
        before=package({'ppt/notesSlides/notesSlide1.xml':'<root>old note</root>',
                        'ppt/slides/slide1.xml':'<root>original body</root>',
                        'ppt/charts/chart1.xml':'<root>42</root>',
                        'ppt/embeddings/book.xlsx':b'original workbook'})
        row={'notes':[{'old':'old note','new':'current note'}]};contract={'prior_source_commit':'old-sha','source_commit':'new-sha'}
        parts=make_parts(before,row,contract);verify_parts(before,package(parts),row,contract)
        for name in parts:
            bad=copy.deepcopy(parts);bad[name]+=b'changed'
            with self.assertRaises(AssertionError):verify_parts(before,package(bad),row,contract)
    def test_missing_or_repeated_note_repair_is_rejected(self):
        def package(s):
            data=io.BytesIO()
            with zipfile.ZipFile(data,'w') as z:z.writestr('ppt/notesSlides/notesSlide1.xml',s)
            return data.getvalue()
        row={'notes':[{'old':'old','new':'new'}]};contract={'prior_source_commit':'base','source_commit':'current'}
        for s in ['absent','old old']:
            with self.assertRaises(AssertionError):make_parts(package(s),row,contract)

if __name__=='__main__':unittest.main()
