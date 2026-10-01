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
LABEL_ORDER = ('dLbl', 'numFmt', 'spPr', 'txPr', 'dLblPos',
               'showLegendKey', 'showVal', 'showCatName', 'showSerName',
               'showPercent', 'showBubbleSize', 'separator',
               'showLeaderLines', 'leaderLines', 'extLst')


def insert_before_successors(parent, name, successors):
    """Insert optional chart children in the ECMA-376 schema sequence."""
    node = ET.Element(f'{{{C}}}{name}')
    tags = {f'{{{C}}}{successor}' for successor in successors}
    for index, child in enumerate(parent):
        if child.tag in tags:
            parent.insert(index, node)
            return node
    parent.append(node)
    return node


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
                smooth = insert_before_successors(series, 'smooth', ('extLst',))
            smooth.set('val', '0')
            labels = series.find('c:dLbls', NS)
            # CT_DLbls chooses either delete or the formatting/display branch.
            # Preserve an authored delete branch instead of creating both.
            if labels is not None and labels.find('c:delete', NS) is None:
                for name in ('showLegendKey', 'showVal', 'showCatName',
                             'showSerName', 'showPercent', 'showBubbleSize'):
                    node = labels.find(f'c:{name}', NS)
                    if node is None:
                        node = insert_before_successors(
                            labels, name, LABEL_ORDER[LABEL_ORDER.index(name) + 1:])
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
