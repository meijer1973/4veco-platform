"""Regression controls for omitted saved-chart series in the §4.1.1 checker.

Run: python test-check-presentation-411.py FINAL.pptx
Uses copies of the saved artifact; never changes the supplied presentation.
"""
import posixpath
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET

DECK = Path(sys.argv.pop(1)).resolve()
CHECKER = Path(__file__).with_name('check-presentation-411.py')
NS = {'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}


class SavedSeriesInventory(unittest.TestCase):
    def check(self, deck):
        return subprocess.run([sys.executable, '-X', 'utf8', str(CHECKER), str(deck)],
                              capture_output=True, text=True, encoding='utf8')

    def mutate(self, operation):
        with tempfile.TemporaryDirectory(prefix='ppt411-series-') as directory:
            output = Path(directory) / 'mutant.pptx'
            with ZipFile(DECK) as source:
                slide = ET.fromstring(source.read('ppt/slides/slide24.xml'))
                chart_id = slide.find('.//c:chart', NS).get('{' + NS['r'] + '}id')
                rels = ET.fromstring(source.read('ppt/slides/_rels/slide24.xml.rels'))
                target = next(r.get('Target') for r in rels if r.get('Id') == chart_id)
                part = posixpath.normpath(posixpath.join('ppt/slides', target)).lstrip('/')
                chart = ET.fromstring(source.read(part))
                scatter = chart.find('.//c:scatterChart', NS)
                series = scatter.findall('c:ser', NS)
                operation(scatter, series)
                with ZipFile(output, 'w') as package:
                    for info in source.infolist():
                        package.writestr(info, ET.tostring(chart) if info.filename == part
                                         else source.read(info.filename))
            result = self.check(output)
            self.assertNotEqual(result.returncode, 0, result.stdout)
            self.assertIn('series inventory', result.stderr)

    def test_original_passes(self):
        result = self.check(DECK)
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_missing_equilibrium_markers_rejected(self):
        self.mutate(lambda parent, series: [parent.remove(s) for s in series[-2:]])

    def test_missing_guides_and_markers_rejected(self):
        self.mutate(lambda parent, series: [parent.remove(s) for s in series[3:]])

    def test_wrong_marker_identity_rejected(self):
        self.mutate(lambda parent, series: series[-1].find('c:tx/c:v', NS).__setattr__('text', 'E₀'))


if __name__ == '__main__':
    unittest.main()
