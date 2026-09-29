"""§2.2.2: ensure the native XY revenue rectangles use straight segments.

HOW TO ADAPT: replace the data/axis contracts for another paragraph. This is
an explicit PowerPoint compatibility repair: the exporter omits c:smooth,
which PowerPoint interpreted as smoothed lines despite scatterStyle=line.
Run with --fix on the candidate and without it to verify the saved final.
"""
import argparse
import json
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from lxml import etree as ET

parser = argparse.ArgumentParser()
parser.add_argument('pptx', type=Path)
parser.add_argument('--fix', action='store_true')
args = parser.parse_args()
ns = {'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart'}
q = lambda name: '{' + ns['c'] + '}' + name
with ZipFile(args.pptx) as z:
    entries = [(i, z.read(i.filename)) for i in z.infolist()]
rectangles = [([0, 160, 160, 0, 0], [0, 0, 30, 30, 0]),
              ([0, 152, 152, 0, 0], [0, 0, 33, 33, 0])]
chart_count, series_count = 0, 0
new_entries = []
for info, data in entries:
    if '/charts/' in info.filename and info.filename.endswith('.xml'):
        root = ET.fromstring(data)
        scatter = root.find('.//c:scatterChart', ns)
        if scatter is not None:
            chart_count += 1
            assert scatter.find('c:scatterStyle', ns).get('val') == 'line'
            series = scatter.findall('c:ser', ns)
            assert len(series) == chart_count
            for idx, ser in enumerate(series):
                x = [float(v) for v in ser.xpath('./c:xVal//c:pt/c:v/text()', namespaces=ns)]
                y = [float(v) for v in ser.xpath('./c:yVal//c:pt/c:v/text()', namespaces=ns)]
                assert (x, y) == rectangles[idx], (info.filename, x, y)
                # Every segment is vertical or horizontal, with exact area P*Q.
                assert all(x[i] == x[i+1] or y[i] == y[i+1] for i in range(4))
                assert max(x) * max(y) == [4800, 5016][idx]
                smooth = ser.find('c:smooth', ns)
                if args.fix:
                    if smooth is None:
                        smooth = ET.SubElement(ser, q('smooth'))
                    smooth.set('val', '0')
                assert smooth is not None and smooth.get('val') == '0'
                series_count += 1
            axes = root.findall('.//c:valAx', ns)
            ranges = [(float(a.find('c:scaling/c:min', ns).get('val')),
                       float(a.find('c:scaling/c:max', ns).get('val'))) for a in axes]
            assert sorted(ranges) == [(0, 40), (0, 200)], ranges
            data = ET.tostring(root, xml_declaration=True, encoding='utf-8', standalone=True)
    new_entries.append((info, data))
assert (chart_count, series_count) == (2, 3)
if args.fix:
    tmp = args.pptx.with_suffix('.straight-segments.tmp')
    with ZipFile(tmp, 'w', ZIP_DEFLATED) as z:
        for info, data in new_entries:
            z.writestr(info, data)
    tmp.replace(args.pptx)
print(json.dumps({'ok': True, 'charts': chart_count, 'rectangles': series_count,
                  'axes': {'Q': [0, 200], 'P': [0, 40]}, 'areas': [4800, 5016],
                  'straightSegments': True, 'fixed': args.fix}))
