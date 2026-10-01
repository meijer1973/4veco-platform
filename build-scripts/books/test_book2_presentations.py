import copy,io,unittest,zipfile
from book2_presentation_checks import expected_text,pptx_content,compare_content

class PresentationRevisionChecks(unittest.TestCase):
    def test_page_numbers_only(self):
        self.assertEqual(expected_text('p. 59, 4–5; € 59; Ev = −1,5; 20 minuten','223'),'p. 60, 4–5; € 59; Ev = −1,5; 20 minuten')
        self.assertEqual(expected_text('p.74; p.92/95; pagina 19–22','234'),'p.75; p.93/96; pagina 19–22')

    def test_split_worked_example(self):
        self.assertEqual(expected_text('gedrukte pagina 19–22; gedrukte pagina 21–22; Linoprint p.22','213'),'gedrukte pagina 19–23; gedrukte pagina 21, 23; Linoprint p.22')

    def test_notation_is_bounded(self):
        self.assertEqual(expected_text('Qd = 40 − P; Qs = P − 10','233'),'Qv = 40 − P; Qa = P − 10')
        self.assertEqual(expected_text('Qd = 40 − P','221'),'Qd = 40 − P')

    def fixture(self):
        return {'slides':['P = 30; p. 45'],'notes':['gedrukte pagina 45'],'charts':[[('v','30')]],'tables':1}

    def test_authorized_change(self):
        before=self.fixture();after=copy.deepcopy(before)
        after['slides']=['P = 30; p. 46'];after['notes']=['gedrukte pagina 46']
        self.assertEqual(compare_content(before,after,'222')['slides'],1)

    def test_missed_dynamic_note_and_economic_change_fail(self):
        before=self.fixture();after=copy.deepcopy(before);after['slides']=['P = 30; p. 46']
        with self.assertRaisesRegex(ValueError,'notes'):compare_content(before,after,'222')
        after['notes']=['gedrukte pagina 46'];after['slides']=['P = 31; p. 46']
        with self.assertRaisesRegex(ValueError,'slides'):compare_content(before,after,'222')

    def test_chart_data_and_table_loss_fail(self):
        before=self.fixture();after=copy.deepcopy(before)
        after['slides']=['P = 30; p. 46'];after['notes']=['gedrukte pagina 46'];after['charts'][0][0]=('v','31')
        with self.assertRaisesRegex(ValueError,'chart data'):compare_content(before,after,'222')
        after['charts']=before['charts'];after['tables']=0
        with self.assertRaisesRegex(ValueError,'table count'):compare_content(before,after,'222')

    def test_chart_parts_need_not_have_numeric_names(self):
        data=io.BytesIO()
        with zipfile.ZipFile(data,'w') as z:
            z.writestr('[Content_Types].xml','<Types><Override PartName="/ppt/charts/chart-f2e.xml" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/></Types>')
            z.writestr('ppt/charts/chart-f2e.xml','<c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart"><c:v>30</c:v></c:chartSpace>')
        self.assertEqual(pptx_content(data.getvalue())['charts'],[[('v','30')]])

    def test_current_citation(self):
        old='https://github.com/meijer1973/4veco-lessen/blob/'+'0'*40+'/boek.pdf; revisie 21 september 2026'
        value=expected_text(old,'232')
        self.assertIn('/a8940a7a79e22857a3e306a91fe923c48c63e716/',value)
        self.assertIn('1 oktober 2026',value)

if __name__=='__main__':unittest.main()
