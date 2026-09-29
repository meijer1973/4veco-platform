"""Mutation checks using the actual saved deck, without changing its bytes.

Usage: python test-presentation-212-checker.py FINAL.pptx LESSON_REPOSITORY
"""
from pathlib import Path
from tempfile import TemporaryDirectory
from zipfile import ZipFile, ZIP_DEFLATED
from xml.etree import ElementTree as E
import json
import re
import subprocess
import sys

source, lessons = map(Path, sys.argv[1:3])
checker = Path(__file__).with_name('check-presentation-212.py')
ns = {'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart'}

def check(file):
    return subprocess.run([sys.executable, str(checker), str(file), str(lessons)],
                          capture_output=True, text=True, encoding='utf-8')

baseline = check(source)
assert baseline.returncode == 0, baseline.stderr
results = {'unchanged_deck_passes': True}
with TemporaryDirectory(prefix='presentation-212-checker-') as temp:
    for series_name in ('Break-even', 'Verliesafstand'):
        mutated = Path(temp) / (series_name + '.pptx')
        removed = 0
        with ZipFile(source) as zin, ZipFile(mutated, 'w', ZIP_DEFLATED) as zout:
            for info in zin.infolist():
                data = zin.read(info.filename)
                if re.search(r'/charts/chart\d+\.xml$', info.filename):
                    root = E.fromstring(data)
                    for scatter in root.findall('.//c:scatterChart', ns):
                        for series in scatter.findall('c:ser', ns):
                            if ''.join(series.find('c:tx', ns).itertext()) == series_name:
                                scatter.remove(series)
                                removed += 1
                    data = E.tostring(root, encoding='utf-8', xml_declaration=True)
                zout.writestr(info, data)
        assert removed > 0, f'Mutation did not remove {series_name}'
        result = check(mutated)
        assert result.returncode != 0 and 'expected series' in result.stderr, result.stderr
        results[f'missing_{series_name}_rejected'] = True
print(json.dumps(results, indent=2))
