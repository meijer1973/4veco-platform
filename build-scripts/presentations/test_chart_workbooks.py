"""Workbook/cache mutations, including optional real-deck regression coverage.

python test_chart_workbooks.py [--pptx FINAL.pptx]
Temporary mutations never modify the delivered presentation.
"""
from io import BytesIO
from pathlib import Path
from tempfile import TemporaryDirectory
from xml.etree import ElementTree as ET
from zipfile import ZipFile, ZIP_DEFLATED
import sys
import unittest

from chart_workbooks import C, S, R, NS, CHART_TYPE, check_presentation, reference_cells

REAL_DECK = None
if '--pptx' in sys.argv:
    index = sys.argv.index('--pptx')
    REAL_DECK = Path(sys.argv[index + 1])
    del sys.argv[index:index + 2]


def archive(parts):
    output = BytesIO()
    with ZipFile(output, 'w', ZIP_DEFLATED) as package:
        for name, data in parts.items():
            package.writestr(name, data)
    return output.getvalue()


def parts(data):
    with ZipFile(BytesIO(data)) as package:
        return {name: package.read(name) for name in package.namelist()}


def fixture():
    workbook = archive({
        'xl/workbook.xml': f'<workbook xmlns="{S}" xmlns:r="{R}"><sheets><sheet name="Chart Data" sheetId="1" r:id="s1"/></sheets></workbook>',
        'xl/_rels/workbook.xml.rels': f'<Relationships><Relationship Id="s1" Type="{R}/worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
        'xl/worksheets/sheet1.xml': f'<worksheet xmlns="{S}"><sheetData><row r="2"><c r="A2"><v>0</v></c><c r="B2"><v>250</v></c></row><row r="3"><c r="A3"><v>150</v></c><c r="B3"><v>550</v></c></row></sheetData></worksheet>',
    })
    def values(tag, col, first, second):
        return f'<c:{tag}><c:numRef><c:f>\'Chart Data\'!${col}$2:${col}$3</c:f><c:numCache><c:ptCount val="2"/><c:pt idx="0"><c:v>{first}</c:v></c:pt><c:pt idx="1"><c:v>{second}</c:v></c:pt></c:numCache></c:numRef></c:{tag}>'
    return archive({
        '[Content_Types].xml': f'<Types><Override PartName="/ppt/slides/charts/chart1.xml" ContentType="{CHART_TYPE}"/></Types>',
        'ppt/slides/charts/chart1.xml': f'<c:chartSpace xmlns:c="{C}" xmlns:r="{R}"><c:chart><c:plotArea><c:scatterChart><c:ser><c:tx><c:v>TK</c:v></c:tx>{values("xVal", "A", 0, 150)}{values("yVal", "B", 250, 550)}</c:ser></c:scatterChart></c:plotArea></c:chart><c:externalData r:id="book"/></c:chartSpace>',
        'ppt/slides/charts/_rels/chart1.xml.rels': f'<Relationships><Relationship Id="book" Type="{R}/package" Target="../../embeddings/data.xlsx"/></Relationships>',
        'ppt/embeddings/data.xlsx': workbook,
    })


def mutate(data, side, change):
    outer = parts(data)
    if side == 'workbook':
        name = next(name for name in outer if name.startswith('ppt/embeddings/') and name.endswith('.xlsx'))
        inner = parts(outer[name])
        part = next(name for name in inner if name.startswith('xl/worksheets/') and name.endswith('.xml'))
        root = ET.fromstring(inner[part])
        change(root)
        inner[part] = ET.tostring(root)
        outer[name] = archive(inner)
    else:
        part = next(name for name in outer if '/charts/' in name and name.endswith('.xml'))
        root = ET.fromstring(outer[part])
        change(root)
        outer[part] = ET.tostring(root)
    return archive(outer)


def change_workbook_value(root):
    root.find(".//s:c[@r='B2']/s:v", NS).text = '999'


def change_cache_value(root):
    root.find('.//c:yVal/c:numRef/c:numCache/c:pt/c:v', NS).text = '999'


class ChartWorkbookTests(unittest.TestCase):
    def setUp(self):
        self.temp = TemporaryDirectory(prefix='chart-workbook-test-')
        self.addCleanup(self.temp.cleanup)
        self.deck = Path(self.temp.name) / 'test.pptx'

    def check(self, data):
        self.deck.write_bytes(data)
        return check_presentation(self.deck)

    def test_matching_numeric_cells(self):
        result = self.check(fixture())
        self.assertEqual((result['charts'], result['references'], result['cellsCompared']), (1, 2, 4))

    def test_changed_workbook_without_cache_change_fails(self):
        with self.assertRaisesRegex(ValueError, 'chart/workbook mismatch'):
            self.check(mutate(fixture(), 'workbook', change_workbook_value))

    def test_changed_cache_without_workbook_change_fails(self):
        with self.assertRaisesRegex(ValueError, 'chart/workbook mismatch'):
            self.check(mutate(fixture(), 'cache', change_cache_value))

    def test_missing_populated_cache_point_fails(self):
        def remove(root):
            cache = root.find('.//c:yVal/c:numRef/c:numCache', NS)
            cache.remove(cache.find('c:pt', NS))
        with self.assertRaisesRegex(ValueError, 'blank mismatch'):
            self.check(mutate(fixture(), 'cache', remove))

    def test_missing_populated_cell_fails(self):
        def remove(root):
            cell = root.find(".//s:c[@r='B2']", NS)
            cell.remove(cell.find('s:v', NS))
        with self.assertRaisesRegex(ValueError, 'blank mismatch'):
            self.check(mutate(fixture(), 'workbook', remove))

    def test_duplicate_cached_index_fails(self):
        def duplicate(root):
            cache = root.find('.//c:yVal/c:numRef/c:numCache', NS)
            cache.append(ET.fromstring(ET.tostring(cache.find('c:pt', NS))))
        with self.assertRaisesRegex(ValueError, 'duplicate cached point'):
            self.check(mutate(fixture(), 'cache', duplicate))

    def test_workbook_formula_is_not_claimed_as_recalculated(self):
        def formula(root):
            ET.SubElement(root.find(".//s:c[@r='B2']", NS), '{' + S + '}f').text = '999'
        with self.assertRaisesRegex(ValueError, 'formula needs evaluation'):
            self.check(mutate(fixture(), 'workbook', formula))

    def test_wrong_worksheet_reference_fails(self):
        def wrong(root):
            root.find('.//c:yVal/c:numRef/c:f', NS).text = "'Missing'!$B$2:$B$3"
        with self.assertRaisesRegex(ValueError, 'missing worksheet'):
            self.check(mutate(fixture(), 'cache', wrong))

    def test_wrong_range_length_fails(self):
        def wrong(root):
            root.find('.//c:yVal/c:numRef/c:f', NS).text = "'Chart Data'!$B$2:$B$4"
        with self.assertRaisesRegex(ValueError, 'count mismatch'):
            self.check(mutate(fixture(), 'cache', wrong))

    def test_external_workbook_fails(self):
        data = parts(fixture())
        name = 'ppt/slides/charts/_rels/chart1.xml.rels'
        root = ET.fromstring(data[name]); root[0].set('TargetMode', 'External')
        data[name] = ET.tostring(root)
        with self.assertRaisesRegex(ValueError, 'external workbook'):
            self.check(archive(data))

    def test_missing_used_chart_declaration_is_not_silently_skipped(self):
        data = parts(fixture())
        data['[Content_Types].xml'] = '<Types/>'
        data['ppt/slides/_rels/slide1.xml.rels'] = f'<Relationships><Relationship Id="chart" Type="{R}/chart" Target="charts/chart1.xml"/></Relationships>'
        with self.assertRaisesRegex(ValueError, 'missing chart content type'):
            self.check(archive(data))

    def test_shared_text_categories_and_their_mutation(self):
        data = parts(fixture())
        name = 'ppt/slides/charts/chart1.xml'
        root = ET.fromstring(data[name])
        field = root.find('.//c:xVal', NS); field.tag = '{' + C + '}cat'
        ref = field[0]; ref.tag = '{' + C + '}strRef'
        cache = ref.find('c:numCache', NS); cache.tag = '{' + C + '}strCache'
        for point, text in zip(cache.findall('c:pt/c:v', NS), ['small', 'large']):
            point.text = text
        data[name] = ET.tostring(root)
        inner = parts(data['ppt/embeddings/data.xlsx'])
        root = ET.fromstring(inner['xl/worksheets/sheet1.xml'])
        for address, index in [('A2', '0'), ('A3', '1')]:
            cell = root.find(f".//s:c[@r='{address}']", NS)
            cell.set('t', 's'); cell.find('s:v', NS).text = index
        inner['xl/worksheets/sheet1.xml'] = ET.tostring(root)
        inner['xl/sharedStrings.xml'] = f'<sst xmlns="{S}"><si><t>small</t></si><si><t>large</t></si></sst>'
        data['ppt/embeddings/data.xlsx'] = archive(inner)
        self.assertTrue(self.check(archive(data))['ok'])
        inner['xl/sharedStrings.xml'] = inner['xl/sharedStrings.xml'].replace('small', 'changed')
        data['ppt/embeddings/data.xlsx'] = archive(inner)
        with self.assertRaisesRegex(ValueError, 'text mismatch'):
            self.check(archive(data))

    def test_quoted_sheet_names_and_horizontal_ranges(self):
        self.assertEqual(reference_cells("'Teacher''s data'!$B$2:$D$2"), ("Teacher's data", ['B2', 'C2', 'D2']))
        self.assertEqual(reference_cells('Data!AA12'), ('Data', ['AA12']))
        for formula in ('[external.xlsx]Data!A1', 'Data!A1:B2', 'NamedRange', 'SUM(Data!A1:A2)'):
            with self.assertRaises(ValueError):
                reference_cells(formula)

    @unittest.skipUnless(REAL_DECK, 'Pass --pptx to run real-deck mutations')
    def test_real_deck_and_both_independent_mutations(self):
        original = REAL_DECK.read_bytes()
        result = self.check(original)
        self.assertGreater(result['charts'], 0)
        for side, change in [('workbook', change_workbook_value), ('cache', change_cache_value)]:
            with self.subTest(side=side), self.assertRaisesRegex(ValueError, 'chart/workbook mismatch'):
                self.check(mutate(original, side, change))
        self.assertEqual(original, REAL_DECK.read_bytes())


if __name__ == '__main__':
    unittest.main()
