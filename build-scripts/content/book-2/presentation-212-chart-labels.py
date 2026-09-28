"""HOW TO ADAPT: add editable endpoint labels to TK and TO scatter series.

The runtime API cannot select one point for a data label. OOXML can. Preserve
the native chart and its literal numerical data; never flatten the plot.
"""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from lxml import etree as E
import sys
import re

src = Path(sys.argv[1])
tmp = src.with_suffix('.labels.pptx')
ns = {'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'}
def child(parent, name, **attrs):
    prefix, local = name.split(':')
    return E.SubElement(parent, '{'+ns[prefix]+'}'+local, **attrs)

count = 0
with ZipFile(src) as z, ZipFile(tmp, 'w', ZIP_DEFLATED) as out:
    for info in z.infolist():
        data = z.read(info.filename)
        if re.search(r'/charts/chart\d+\.xml$', info.filename):
            root = E.fromstring(data)
            for ser in root.findall('.//c:scatterChart/c:ser', ns):
                name = ''.join(ser.xpath('./c:tx//c:v/text()', namespaces=ns))
                if name not in ('TK', 'TO'):
                    continue
                count += 1
                for old in ser.findall('c:dLbls', ns):
                    ser.remove(old)
                labels = E.Element('{'+ns['c']+'}dLbls')
                # Series child order: dPt, dLbls, trendline, errBars, xVal, yVal.
                xval = ser.find('c:xVal', ns)
                ser.insert(ser.index(xval), labels)
                hidden = child(labels, 'c:dLbl')
                child(hidden, 'c:idx', val='0')
                child(hidden, 'c:delete', val='1')
                label = child(labels, 'c:dLbl')
                child(label, 'c:idx', val='1')
                child(label, 'c:dLblPos', val='r')
                child(label, 'c:showLegendKey', val='0')
                child(label, 'c:showVal', val='0')
                child(label, 'c:showCatName', val='0')
                child(label, 'c:showSerName', val='1')
                txpr = child(labels, 'c:txPr')
                child(txpr, 'a:bodyPr'); child(txpr, 'a:lstStyle')
                para = child(txpr, 'a:p'); props = child(para, 'a:pPr')
                run = child(props, 'a:defRPr', sz='2100', b='1')
                fill = child(run, 'a:solidFill')
                child(fill, 'a:srgbClr', val='A94D16' if name=='TK' else '17658A')
                child(run, 'a:latin', typeface='Arial')
                child(para, 'a:endParaRPr', lang='nl-NL')
                child(labels, 'c:showLegendKey', val='0')
                child(labels, 'c:showVal', val='0')
                child(labels, 'c:showCatName', val='0')
                child(labels, 'c:showSerName', val='0')
                child(labels, 'c:showPercent', val='0')
                child(labels, 'c:showBubbleSize', val='0')
                child(labels, 'c:showLeaderLines', val='0')
            data = E.tostring(root, xml_declaration=True, encoding='UTF-8', standalone=True)
        out.writestr(info, data)
if count != 10:
    tmp.unlink()
    raise ValueError(f'Expected 10 curve labels across six charts, found {count}')
tmp.replace(src)
