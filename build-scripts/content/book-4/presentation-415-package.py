"""HOW TO ADAPT: preserve explicit straight XY series in the saved OOXML package."""
import sys
import re
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from lxml import etree as E

target = Path(sys.argv[1])
ns = {'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart'}
with ZipFile(target) as z:
    files = {n: z.read(n) for n in z.namelist()}
for name, data in list(files.items()):
    if re.search(r'/charts/chart\d+\.xml$', name):
        root = E.fromstring(data)
        for ser in root.findall('.//c:scatterChart/c:ser', ns):
            smooth = ser.find('c:smooth', ns)
            if smooth is None:
                smooth = E.SubElement(ser, '{' + ns['c'] + '}smooth')
            smooth.set('val', '0')
        files[name] = E.tostring(root, xml_declaration=True, encoding='UTF-8', standalone=True)
with ZipFile(target, 'w', ZIP_DEFLATED) as z:
    for name, data in files.items():
        z.writestr(name, data)
