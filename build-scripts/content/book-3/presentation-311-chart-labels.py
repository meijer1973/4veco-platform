"""HOW TO ADAPT: preserve explicit above-point positions for native chart labels.

The artifact exporter omits dLblPos. PowerPoint's default otherwise places
direct curve labels over their lines. Operates on the candidate before checks.
"""
import sys
from pathlib import Path
from zipfile import ZipFile
from lxml import etree as E

file = Path(sys.argv[1])
ns = {'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart'}
tag = lambda name: '{' + ns['c'] + '}' + name
with ZipFile(file) as z:
    parts = [(info, z.read(info.filename)) for info in z.infolist()]
out = []
count = 0
for info, data in parts:
    if '/charts/' in info.filename and info.filename.endswith('.xml'):
        root = E.fromstring(data)
        for label in root.findall('.//c:scatterChart/c:ser/c:dLbls/c:dLbl', ns):
            position = label.find('c:dLblPos', ns)
            if position is None:
                position = E.Element(tag('dLblPos'))
                idx = next((i for i, child in enumerate(label)
                            if E.QName(child).localname.startswith('show')), len(label))
                label.insert(idx, position)
            series_name = label.getparent().getparent().findtext('c:tx/c:v', namespaces=ns) or ''
            position.set('val', 'b' if series_name.startswith('Pp =') else 't')
            count += 1
        data = E.tostring(root, xml_declaration=True, encoding='UTF-8')
    out.append((info, data))
assert count == 24, f'Unexpected labeled point count: {count}'
with ZipFile(file, 'w') as z:
    for info, data in out:
        z.writestr(info, data)
print(f'Explicit label positions: {count}')
