"""HOW TO ADAPT: paragraph-local repair for explicit XY label defaults and straight lines.

The runtime omits per-series label defaults and smoothing flags. PowerPoint then
shows every data point and rounds right-angle guides. Preserve the editable chart
data and explicit rich labels; repair the package before finalization, never after.
The fixed inner plot coordinates align the native, editable profit rectangles
and hatching with the same economic coordinates on every progressive graph.
"""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from lxml import etree as E
import sys

C = 'http://schemas.openxmlformats.org/drawingml/2006/chart'
A = 'http://schemas.openxmlformats.org/drawingml/2006/main'
NS = {'c': C, 'a': A}
src = Path(sys.argv[1])
tmp = src.with_suffix('.xy.pptx')
with ZipFile(src) as package, ZipFile(tmp, 'w', ZIP_DEFLATED) as out:
    for info in package.infolist():
        data = package.read(info.filename)
        if '/charts/' in info.filename and info.filename.endswith('.xml'):
            root = E.fromstring(data)
            for area in root.findall('.//c:plotArea', NS):
                layout = area.find('c:layout', NS)
                if layout is None:
                    layout = E.Element(f'{{{C}}}layout')
                    area.insert(0, layout)
                else:
                    layout.clear()
                manual = E.SubElement(layout, f'{{{C}}}manualLayout')
                for key, value in [('layoutTarget','inner'),('xMode','edge'),('yMode','edge'),('wMode','factor'),('hMode','factor'),('x','.10'),('y','.05'),('w','.85'),('h','.79')]:
                    E.SubElement(manual, f'{{{C}}}{key}', val=value)
            for chart in root.findall('.//c:scatterChart', NS):
                for series in chart.findall('c:ser', NS):
                    smooth = series.find('c:smooth', NS)
                    if smooth is None:
                        smooth = E.SubElement(series, f'{{{C}}}smooth')
                    smooth.set('val', '0')
                    labels = series.find('c:dLbls', NS)
                    if labels is not None:
                        for label in labels.findall('c:dLbl', NS):
                            content = ''.join(label.xpath('.//a:t/text()', namespaces=NS))
                            pos = 'b' if content == 'GTK' else 't'
                            if content.startswith('E'):
                                pos = 'r'
                            position = E.Element(f'{{{C}}}dLblPos', val=pos)
                            # OOXML requires position before show* flags.
                            idx = next((i for i, node in enumerate(label) if E.QName(node).localname.startswith('show')), len(label))
                            label.insert(idx, position)
                        for flag in ('showLegendKey', 'showVal', 'showCatName', 'showSerName', 'showPercent', 'showBubbleSize', 'showLeaderLines'):
                            node = labels.find(f'c:{flag}', NS)
                            if node is None:
                                node = E.SubElement(labels, f'{{{C}}}{flag}')
                            node.set('val', '0')
            data = E.tostring(root, xml_declaration=True, encoding='UTF-8', standalone=True)
        out.writestr(info, data)
tmp.replace(src)
