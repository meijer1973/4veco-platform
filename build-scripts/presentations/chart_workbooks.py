"""Compare saved native chart caches with their embedded editable workbook cells.

Usage: python chart_workbooks.py FINAL.pptx
Supports standard OOXML charts with simple A1 row/column references and constant
numeric/text cells. Unsupported data sources fail explicitly. No recalculation,
economic correctness or visual acceptance is claimed by this preservation check.
"""
from decimal import Decimal, InvalidOperation
from io import BytesIO
from pathlib import Path
from urllib.parse import unquote
from xml.etree import ElementTree as ET
from zipfile import ZipFile
import json
import posixpath
import re
import sys

C = 'http://schemas.openxmlformats.org/drawingml/2006/chart'
S = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
NS = {'c': C, 's': S}
CHART_TYPE = 'application/vnd.openxmlformats-officedocument.drawingml.chart+xml'


def require(condition, message):
    if not condition:
        raise ValueError(message)


def xml(package, part):
    require(part in package.namelist(), f'Missing package part: {part}')
    return ET.fromstring(package.read(part))


def target_part(package, owner, rid, kind):
    rels = posixpath.join(posixpath.dirname(owner), '_rels', posixpath.basename(owner) + '.rels')
    matches = [r for r in xml(package, rels) if r.get('Id') == rid]
    require(len(matches) == 1, f'{owner}: missing/duplicate relationship {rid}')
    rel = matches[0]
    require(rel.get('TargetMode', 'Internal') == 'Internal', f'{owner}: external workbook/worksheet is unsupported')
    require(rel.get('Type') == R + '/' + kind, f'{owner}: unsupported relationship type')
    target = unquote(rel.get('Target', ''))
    require(target and '\\' not in target and ':' not in target, f'{owner}: invalid relationship target')
    part = posixpath.normpath(target.lstrip('/') if target.startswith('/') else posixpath.join(posixpath.dirname(owner), target))
    require(not part.startswith('../') and part in package.namelist(), f'{owner}: missing/escaping target {part}')
    return part


def column_number(letters):
    result = 0
    for char in letters:
        result = result * 26 + ord(char) - 64
    return result


def column_name(number):
    result = ''
    while number:
        number, rem = divmod(number - 1, 26)
        result = chr(65 + rem) + result
    return result


def reference_cells(formula):
    match = re.fullmatch(r"(?:'((?:[^']|'')+)'|([^'!\[\]]+))!\$?([A-Z]+)\$?([1-9]\d*)(?::\$?([A-Z]+)\$?([1-9]\d*))?", formula or '')
    require(match is not None, f'Unsupported chart reference: {formula!r}')
    quoted, plain, col1, row1, col2, row2 = match.groups()
    sheet = quoted.replace("''", "'") if quoted is not None else plain
    require('[' not in sheet and ']' not in sheet, 'External chart reference is unsupported')
    c1, c2 = column_number(col1), column_number(col2 or col1)
    r1, r2 = int(row1), int(row2 or row1)
    require(1 <= c1 <= c2 <= 16384 and 1 <= r1 <= r2 <= 1048576, 'Invalid chart reference bounds')
    require(c1 == c2 or r1 == r2, 'Chart reference must be one row or column')
    require((c2 - c1 + 1) * (r2 - r1 + 1) <= 100000, 'Chart reference is too large')
    return sheet, [f'{column_name(c)}{r}' for r in range(r1, r2 + 1) for c in range(c1, c2 + 1)]


def workbook_cells(package):
    require(len(package.namelist()) == len(set(package.namelist())), 'Duplicate workbook ZIP entry')
    workbook = xml(package, 'xl/workbook.xml')
    strings = []
    if 'xl/sharedStrings.xml' in package.namelist():
        strings = [''.join(t.text or '' for t in si.findall('.//s:t', NS)) for si in xml(package, 'xl/sharedStrings.xml')]
    sheets = {}
    for sheet in workbook.findall('s:sheets/s:sheet', NS):
        name = sheet.get('name')
        require(name and name not in sheets, 'Missing/duplicate worksheet name')
        part = target_part(package, 'xl/workbook.xml', sheet.get('{' + R + '}id'), 'worksheet')
        cells = {}
        for cell in xml(package, part).findall('s:sheetData/s:row/s:c', NS):
            address = cell.get('r')
            require(address and address not in cells, f'{part}: missing/duplicate cell address')
            kind = cell.get('t', 'n')
            value = cell.findtext('s:v', default=None, namespaces=NS)
            formula = cell.find('s:f', NS) is not None
            if kind == 'inlineStr':
                value = ''.join(t.text or '' for t in cell.findall('s:is//s:t', NS))
            elif kind == 's':
                require(value is not None and value.isdigit() and int(value) < len(strings), f'{part}: invalid shared string')
                value = strings[int(value)]
            cells[address] = (kind, value, formula)
        sheets[name] = cells
    return sheets


def numeric(value, context):
    try:
        number = Decimal(value)
    except (InvalidOperation, TypeError):
        raise ValueError(f'{context}: invalid numeric value {value!r}') from None
    require(number.is_finite(), f'{context}: non-finite value')
    return number


def compare_reference(reference, sheets, context):
    numeric_ref = reference.tag == '{' + C + '}numRef'
    formula = reference.findtext('c:f', namespaces=NS)
    sheet, addresses = reference_cells(formula)
    require(sheet in sheets, f'{context}: missing worksheet {sheet}')
    cache = reference.find('c:numCache' if numeric_ref else 'c:strCache', NS)
    require(cache is not None, f'{context}: missing chart cache')
    count = cache.find('c:ptCount', NS)
    require(count is not None and count.get('val') == str(len(addresses)), f'{context}: chart range/cache count mismatch')
    points = {}
    for point in cache.findall('c:pt', NS):
        index = point.get('idx', '')
        require(index.isdigit() and int(index) < len(addresses) and int(index) not in points, f'{context}: invalid/duplicate cached point')
        points[int(index)] = point.findtext('c:v', namespaces=NS)
    for index, address in enumerate(addresses):
        kind, cell_value, formula_cell = sheets[sheet].get(address, ('n', None, False))
        label = f'{context}: {sheet}!{address}'
        require(not formula_cell, label + ': workbook formula needs evaluation; unsupported')
        cached = points.get(index)
        if cached is None or cell_value is None:
            require(cached is None and cell_value is None, label + ': chart/workbook blank mismatch')
        elif numeric_ref:
            require(kind == 'n', label + ': numeric chart references a non-numeric cell')
            require(numeric(cached, label) == numeric(cell_value, label), label + f': chart/workbook mismatch ({cached} vs {cell_value})')
        else:
            require(kind in ('inlineStr', 's', 'str'), label + ': text chart references a non-text cell')
            require(cached == cell_value, label + ': chart/workbook text mismatch')
    return len(addresses)


def check_presentation(file):
    report = {'ok': True, 'charts': 0, 'references': 0, 'cellsCompared': 0, 'workbooks': []}
    with ZipFile(file) as package:
        require(len(package.namelist()) == len(set(package.namelist())), 'Duplicate presentation ZIP entry')
        types = xml(package, '[Content_Types].xml')
        chart_parts = []
        for item in types:
            content_type = item.get('ContentType', '')
            if content_type == CHART_TYPE:
                chart_parts.append(unquote(item.get('PartName', '')).lstrip('/'))
            elif 'chartex' in content_type.lower():
                raise ValueError('Extended chart format is unsupported')
        require(len(chart_parts) == len(set(chart_parts)), 'Duplicate chart content type entry')
        # A missing content-type declaration must not silently skip a used chart.
        for rels in package.namelist():
            if not rels.endswith('.rels') or '/_rels/' not in rels:
                continue
            directory, name = rels.rsplit('/_rels/', 1)
            owner = posixpath.join(directory, name[:-5])
            for relation in xml(package, rels):
                if relation.get('Type') == R + '/chart':
                    used = target_part(package, owner, relation.get('Id'), 'chart')
                    require(used in chart_parts, f'{used}: missing chart content type')
        for part in chart_parts:
            root = xml(package, part)
            require(root.tag == '{' + C + '}chartSpace', f'{part}: unsupported chart format')
            external = root.findall('c:externalData', NS)
            require(len(external) == 1, f'{part}: one embedded editable workbook is required')
            workbook = target_part(package, part, external[0].get('{' + R + '}id'), 'package')
            with ZipFile(BytesIO(package.read(workbook))) as embedded:
                sheets = workbook_cells(embedded)
            require(root.find('.//c:multiLvlStrRef', NS) is None, f'{part}: multilevel categories are unsupported')
            series = root.findall('.//c:ser', NS)
            require(series, f'{part}: no chart series')
            for ser in series:
                fields = [child for child in ser if child.tag in {f'{{{C}}}{name}' for name in ('xVal', 'yVal', 'cat', 'val', 'bubbleSize')}]
                require(fields, f'{part}: series has no editable values')
                for field in fields:
                    require(len(field) == 1 and field[0].tag in ('{' + C + '}numRef', '{' + C + '}strRef'), f'{part}: values without workbook references are unsupported')
            references = root.findall('.//c:numRef', NS) + root.findall('.//c:strRef', NS)
            for reference in references:
                report['cellsCompared'] += compare_reference(reference, sheets, part)
            report['charts'] += 1
            report['references'] += len(references)
            report['workbooks'].append(workbook)
    report['workbooks'] = sorted(set(report['workbooks']))
    return report


if __name__ == '__main__':
    try:
        require(len(sys.argv) == 2, 'Usage: python chart_workbooks.py FINAL.pptx')
        print(json.dumps(check_presentation(Path(sys.argv[1])), indent=2))
    except (ValueError, KeyError, ET.ParseError) as error:
        print(json.dumps({'ok': False, 'error': str(error)}), file=sys.stderr)
        sys.exit(1)
