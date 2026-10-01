"""Paragraph-specific OOXML finishing: native labels at curve endpoints.

HOW TO ADAPT: label only named economic curves, never guide lines. Keep the
chart data/native object intact. Run before the shared presentation finalizer.
"""
import sys
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from lxml import etree as ET

C='http://schemas.openxmlformats.org/drawingml/2006/chart'
A='http://schemas.openxmlformats.org/drawingml/2006/main'
NS={'c':C,'a':A}
def sub(parent, ns, tag, **attrs):
    return ET.SubElement(parent, '{'+ns+'}'+tag, **attrs)

file=Path(sys.argv[1])
with ZipFile(file) as z:
    parts={n:z.read(n) for n in z.namelist()}
label_count=0
for name,data in list(parts.items()):
    if not ('/charts/chart' in name and name.endswith('.xml')):
        continue
    root=ET.fromstring(data)
    for ser in root.findall('.//c:scatterChart/c:ser',NS):
        label=''.join(ser.xpath('./c:tx//c:v/text()',namespaces=NS))
        if label not in ('V','A','A + t'):
            continue
        label_count+=1
        for existing in ser.findall('c:dLbls',NS): ser.remove(existing)
        labels=ET.Element('{'+C+'}dLbls')
        # dLbls precedes xVal/yVal in CT_ScatterSer.
        ser.insert(list(ser).index(ser.find('c:xVal',NS)),labels)
        dl=sub(labels,C,'dLbl');sub(dl,C,'idx',val='1')
        tx=sub(dl,C,'tx');rich=sub(tx,C,'rich');sub(rich,A,'bodyPr');sub(rich,A,'lstStyle')
        para=sub(rich,A,'p');run=sub(para,A,'r');rp=sub(run,A,'rPr',sz='1900',b='1')
        fill=sub(rp,A,'solidFill');sub(fill,A,'srgbClr',val='183247');sub(rp,A,'latin',typeface='Arial');sub(run,A,'t').text=label
        sub(dl,C,'dLblPos',val='t')
        sub(dl,C,'showLegendKey',val='0')
        for key in ('showLegendKey','showVal','showCatName','showSerName','showPercent','showBubbleSize'):
            sub(labels,C,key,val='0')
    parts[name]=ET.tostring(root,xml_declaration=True,encoding='UTF-8',standalone=True)
if label_count != 16:
    raise ValueError(f'Expected 16 curve labels across six charts, found {label_count}')
with ZipFile(file,'w',ZIP_DEFLATED) as z:
    for name,data in parts.items():z.writestr(name,data)
