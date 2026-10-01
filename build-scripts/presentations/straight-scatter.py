"""Make straight scatter intent explicit for PowerPoint before finalization.

HOW TO ADAPT: call only for authored scatterStyle=line/lineMarker charts.
PowerPoint otherwise smooths multi-point series and invents labels for points
without an override in a partially labeled series. Data and custom labels stay.
"""
import sys
from pathlib import Path
from zipfile import ZipFile
from lxml import etree as ET

C = 'http://schemas.openxmlformats.org/drawingml/2006/chart'
NS = {'c': C}


def normalize(data):
    root = ET.fromstring(data)
    changed = False
    for chart in root.findall('.//c:scatterChart', NS):
        style = chart.find('c:scatterStyle', NS)
        if style is None or style.get('val') not in ('line', 'lineMarker'):
            continue
        for series in chart.findall('c:ser', NS):
            smooth = series.find('c:smooth', NS)
            if smooth is None:
                smooth = ET.SubElement(series, f'{{{C}}}smooth')
            smooth.set('val', '0')
            labels = series.find('c:dLbls', NS)
            if labels is not None:
                for name in ('showLegendKey', 'showVal', 'showCatName',
                             'showSerName', 'showPercent', 'showBubbleSize'):
                    node = labels.find(f'c:{name}', NS)
                    if node is None:
                        node = ET.SubElement(labels, f'{{{C}}}{name}')
                    node.set('val', '0')
            changed = True
    return ET.tostring(root, xml_declaration=True, encoding='UTF-8') if changed else data


def main():
    file = Path(sys.argv[1])
    with ZipFile(file) as src:
        parts = [(info, normalize(src.read(info.filename))
                  if '/charts/' in info.filename and info.filename.endswith('.xml')
                  else src.read(info.filename)) for info in src.infolist()]
    with ZipFile(file, 'w') as dst:
        for info, data in parts:
            dst.writestr(info, data)


if __name__ == '__main__':
    main()
