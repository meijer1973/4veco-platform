"""Keep this deck's exact XY polylines straight in PowerPoint.

HOW TO ADAPT: call on the exported candidate before finalization, never on the
validated deliverable. Explicit defaults prevent Office from inventing labels
on unlabelled points or smoothing area boundaries. Chart data stays untouched.
"""
import sys
import zipfile
from pathlib import Path
from lxml import etree as ET

target = Path(sys.argv[1])
ns = {'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart'}
tag = lambda name: '{' + ns['c'] + '}' + name
with zipfile.ZipFile(target) as archive:
    entries = [(entry, archive.read(entry.filename)) for entry in archive.infolist()]
fixed = 0
with zipfile.ZipFile(target, 'w', zipfile.ZIP_DEFLATED) as archive:
    for entry, data in entries:
        if '/charts/' in entry.filename and entry.filename.endswith('.xml'):
            tree = ET.fromstring(data)
            for series in tree.findall('.//c:scatterChart/c:ser', ns):
                smooth = series.find('c:smooth', ns)
                if smooth is None:
                    smooth = ET.SubElement(series, tag('smooth'))
                smooth.set('val', '0')
                labels = series.find('c:dLbls', ns)
                if labels is not None:
                    for name in ['showLegendKey', 'showVal', 'showCatName', 'showSerName', 'showPercent', 'showBubbleSize', 'showLeaderLines']:
                        node = labels.find('c:' + name, ns)
                        if node is None:
                            node = ET.SubElement(labels, tag(name))
                        node.set('val', '0')
                fixed += 1
            data = ET.tostring(tree, xml_declaration=True, encoding='UTF-8', standalone=True)
        archive.writestr(entry, data)
assert fixed > 0, 'No scatter series found'
print(f'Explicit straight lines and label defaults: {fixed} series')
