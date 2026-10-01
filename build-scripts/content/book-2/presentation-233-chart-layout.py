"""HOW TO ADAPT: align native XY plots with editable data-area polygons.

The authoring source records the exact plot fractions. PowerPoint needs an
explicit inner manual layout and straight segments for those coordinates.
This modifies only the candidate, before validation and final rendering.
"""
import sys
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from lxml import etree as E

path = Path(sys.argv[1])
ns = {'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart'}
tag = lambda x: '{' + ns['c'] + '}' + x
with ZipFile(path) as z:
    entries = [(i, z.read(i.filename)) for i in z.infolist()]
result = []
count = 0
for info, data in entries:
    if '/charts/' in info.filename and info.filename.endswith('.xml'):
        root = E.fromstring(data)
        plot = root.find('.//c:plotArea', ns)
        if plot is not None and plot.find('c:scatterChart', ns) is not None:
            count += 1
            layout = plot.find('c:layout', ns)
            if layout is None:
                layout = E.Element(tag('layout'))
                plot.insert(0, layout)
            layout.clear()
            manual = E.SubElement(layout, tag('manualLayout'))
            for name, value in [('layoutTarget','inner'), ('xMode','edge'), ('yMode','edge'),
                                ('wMode','factor'), ('hMode','factor'),
                                ('x','0.12'), ('y','0.06'), ('w','0.84'), ('h','0.82')]:
                E.SubElement(manual, tag(name), val=value)
            for ser in plot.findall('c:scatterChart/c:ser', ns):
                smooth = ser.find('c:smooth', ns)
                if smooth is None:
                    smooth = E.SubElement(ser, tag('smooth'))
                smooth.set('val', '0')
                name = ser.findtext('c:tx/c:v', namespaces=ns) or ''
                for label in ser.findall('c:dLbls/c:dLbl', ns):
                    position = label.find('c:dLblPos', ns)
                    if position is None:
                        position = E.Element(tag('dLblPos'))
                        # dLblPos follows txPr and precedes the show* fields.
                        first_show = next((i for i, child in enumerate(label)
                                           if E.QName(child).localname.startswith('show')), len(label))
                        label.insert(first_show, position)
                    position.set('val', 'ctr' if name in ['CS','PS','driehoek','rechthoek']
                                 else 'b' if name == 'E' or name.startswith('P =') else 't')
            data = E.tostring(root, xml_declaration=True, encoding='utf-8', standalone=True)
    result.append((info, data))
assert count == 10, f'Expected ten native XY charts, got {count}'
tmp = path.with_suffix('.layout.tmp')
with ZipFile(tmp, 'w', ZIP_DEFLATED) as z:
    for info, data in result:
        z.writestr(info, data)
tmp.replace(path)
print(f'Explicit inner plot layout and straight segments: {count} XY charts')
