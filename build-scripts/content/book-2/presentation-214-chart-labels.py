"""HOW TO ADAPT: place native endpoint labels on the named economic series.

OOXML supports individual point labels, which the artifact-tool API does not
expose. This modifies the editable chart, without drawing a replacement image.
"""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from lxml import etree as E
import re
import sys

src = Path(sys.argv[1])
tmp = src.with_suffix('.labels.pptx')
ns = {'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'}
colors = {'TO': '17658A', 'TK': 'A94D16', 'TK vrijdag': 'A94D16', 'TK zaterdag': '20665B'}

def child(parent, name, **attrs):
    prefix, local = name.split(':')
    return E.SubElement(parent, '{' + ns[prefix] + '}' + local, **attrs)

count = 0
with ZipFile(src) as z, ZipFile(tmp, 'w', ZIP_DEFLATED) as out:
    for info in z.infolist():
        data = z.read(info.filename)
        if re.search(r'/charts/chart\d+\.xml$', info.filename):
            root = E.fromstring(data)
            for ser in root.findall('.//c:scatterChart/c:ser', ns):
                name = ''.join(ser.xpath('./c:tx//c:v/text()', namespaces=ns))
                if name not in colors:
                    continue
                count += 1
                points = ser.findall('./c:xVal//c:pt', ns)
                for old in ser.findall('c:dLbls', ns):
                    ser.remove(old)
                labels = E.Element('{' + ns['c'] + '}dLbls')
                xval = ser.find('c:xVal', ns)
                ser.insert(ser.index(xval), labels)
                for i in range(len(points)):
                    label = child(labels, 'c:dLbl')
                    child(label, 'c:idx', val=str(i))
                    if i != len(points) - 1:
                        child(label, 'c:delete', val='1')
                        continue
                    child(label, 'c:dLblPos', val='r')
                    for flag in ['showLegendKey', 'showVal', 'showCatName']:
                        child(label, 'c:' + flag, val='0')
                    child(label, 'c:showSerName', val='1')
                txpr = child(labels, 'c:txPr')
                child(txpr, 'a:bodyPr'); child(txpr, 'a:lstStyle')
                para = child(txpr, 'a:p'); props = child(para, 'a:pPr')
                run = child(props, 'a:defRPr', sz='2100', b='1')
                fill = child(run, 'a:solidFill')
                child(fill, 'a:srgbClr', val=colors[name])
                child(run, 'a:latin', typeface='Arial')
                child(para, 'a:endParaRPr', lang='nl-NL')
                for flag in ['showLegendKey', 'showVal', 'showCatName', 'showSerName', 'showPercent', 'showBubbleSize', 'showLeaderLines']:
                    child(labels, 'c:' + flag, val='0')
            data = E.tostring(root, xml_declaration=True, encoding='UTF-8', standalone=True)
        out.writestr(info, data)
if count != 8:
    tmp.unlink()
    raise ValueError(f'Expected 8 economic curve labels across 3 charts, found {count}')
tmp.replace(src)
