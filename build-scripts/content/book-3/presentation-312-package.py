"""HOW TO ADAPT: preserve straight native XY paths and only explicit point labels.

Artifact Tool currently omits the per-series smoothing/default-label flags.
Stamp those OOXML properties before finalization; do not change coordinates.
"""
import sys
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from lxml import etree as ET

target = Path(sys.argv[1])
C = 'http://schemas.openxmlformats.org/drawingml/2006/chart'
A = 'http://schemas.openxmlformats.org/drawingml/2006/main'
ns = {'c': C}
def flag(parent, name, value):
    node = parent.find('c:' + name, ns)
    if node is None:
        node = ET.SubElement(parent, '{' + C + '}' + name)
    node.set('val', value)

with ZipFile(target) as z:
    entries = [(i, z.read(i.filename)) for i in z.infolist()]
out = []
for info, data in entries:
    if '/charts/' in info.filename and info.filename.endswith('.xml'):
        tree = ET.fromstring(data)
        for scatter in tree.findall('.//c:scatterChart', ns):
            flag(scatter, 'scatterStyle', 'line')
            for ser in scatter.findall('c:ser', ns):
                flag(ser, 'smooth', '0')
                labels = ser.find('c:dLbls', ns)
                if labels is not None:
                    name = ser.findtext('c:tx/c:v', namespaces=ns)
                    for label in labels.findall('c:dLbl', ns):
                        background = ET.Element('{' + C + '}spPr')
                        ET.SubElement(ET.SubElement(background, '{' + A + '}solidFill'), '{' + A + '}srgbClr', val='FFFFFF')
                        ET.SubElement(ET.SubElement(background, '{' + A + '}ln'), '{' + A + '}noFill')
                        tx_style = label.find('c:txPr', ns)
                        label.insert(list(label).index(tx_style), background)
                    if name in ['guide Q', 'guide Pc', 'guide Pp']:
                        for label in labels.findall('c:dLbl', ns):
                            pos = ET.Element('{' + C + '}dLblPos', val='b' if name == 'guide Pp' else 't')
                            first_flag = label.find('c:showLegendKey', ns)
                            label.insert(list(label).index(first_flag), pos)
                    for tag in ['showLegendKey', 'showVal', 'showCatName', 'showSerName', 'showPercent', 'showBubbleSize']:
                        flag(labels, tag, '0')
        data = ET.tostring(tree, xml_declaration=True, encoding='UTF-8', standalone=True)
    out.append((info, data))
with ZipFile(target, 'w', ZIP_DEFLATED) as z:
    for info, data in out:
        z.writestr(info, data)
