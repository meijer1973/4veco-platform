"""Check the opt-in chart repair without changing saved teaching data or labels."""
import importlib.util
from pathlib import Path
from tempfile import TemporaryDirectory
from zipfile import ZipFile
import subprocess
import sys
import unittest
from lxml import etree as ET

TOOL = Path(__file__).with_name('straight-scatter.py')
spec = importlib.util.spec_from_file_location('straight_scatter', TOOL)
repair = importlib.util.module_from_spec(spec)
spec.loader.exec_module(repair)
C = repair.C
NS = {'c': C, 'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'}


def fixture(style='line'):
    return f'''<c:chartSpace xmlns:c="{C}" xmlns:a="{NS['a']}">
      <c:chart><c:plotArea><c:scatterChart><c:scatterStyle val="{style}"/>
        <c:ser><c:idx val="0"/><c:order val="0"/>
          <c:dLbls><c:dLbl><c:idx val="1"/><c:tx><c:rich><a:p><a:r><a:t>A</a:t></a:r></a:p></c:rich></c:tx></c:dLbl><c:showVal val="1"/></c:dLbls>
          <c:xVal><c:numRef><c:f>Sheet1!$A$1:$A$3</c:f><c:numCache><c:ptCount val="3"/><c:pt idx="0"><c:v>40</c:v></c:pt><c:pt idx="1"><c:v>80</c:v></c:pt><c:pt idx="2"><c:v>80</c:v></c:pt></c:numCache></c:numRef></c:xVal>
          <c:yVal><c:numLit><c:ptCount val="3"/><c:pt idx="0"><c:v>0</c:v></c:pt><c:pt idx="1"><c:v>0</c:v></c:pt><c:pt idx="2"><c:v>16</c:v></c:pt></c:numLit></c:yVal>
          <c:smooth val="1"/>
        </c:ser>
      </c:scatterChart></c:plotArea></c:chart>
    </c:chartSpace>'''.encode()


class StraightScatterTests(unittest.TestCase):
    def test_right_angle_data_formulas_and_custom_labels_survive(self):
        source = fixture()
        result = repair.normalize(source)
        before, after = ET.fromstring(source), ET.fromstring(result)
        for expression in ['.//c:xVal', './/c:yVal', './/c:dLbl']:
            self.assertEqual(ET.tostring(before.find(expression, NS)),
                             ET.tostring(after.find(expression, NS)))
        self.assertEqual(after.find('.//c:ser/c:smooth', NS).get('val'), '0')
        self.assertEqual(after.find('.//c:dLbls/c:showVal', NS).get('val'), '0')
        self.assertEqual(after.find('.//c:dLbl//a:t', NS).text, 'A')
        self.assertEqual(result, repair.normalize(result))

    def test_deliberately_smooth_or_marker_charts_are_byte_preserved(self):
        for style in ['smooth', 'smoothMarker', 'marker']:
            with self.subTest(style=style):
                source = fixture(style)
                self.assertEqual(source, repair.normalize(source))

    def test_command_changes_only_eligible_chart_parts(self):
        with TemporaryDirectory() as tmp:
            file = Path(tmp)/'candidate.pptx'
            parts = {'ppt/charts/chart1.xml': fixture(),
                     'ppt/charts/chart2.xml': fixture('smooth'),
                     'ppt/embeddings/data.xlsx': b'preserve embedded workbook',
                     'ppt/slides/slide1.xml': b'preserve authored content',
                     'ppt/charts/_rels/chart1.xml.rels': b'preserve relationships'}
            with ZipFile(file, 'w') as package:
                for name, data in parts.items(): package.writestr(name, data)
            subprocess.run([sys.executable, str(TOOL), str(file)], check=True)
            with ZipFile(file) as package:
                self.assertEqual(set(package.namelist()), set(parts))
                for name, data in parts.items():
                    if name != 'ppt/charts/chart1.xml':
                        self.assertEqual(package.read(name), data)


if __name__ == '__main__':
    unittest.main()
