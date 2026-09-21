"""Printed pagination and the generated theory extract for the current edition."""
from io import BytesIO
import json
from pathlib import Path
import fitz
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from build_book2_chat import NAVY, file_record

EXTRACT = 'boek/Boek_2_Theorie_43_Herziene_Paginas.pdf'
EXTRACT_MAP = 'boek/Boek_2_Theorie_43_Herziene_Paginas.json'


def settings(root):
    config = json.loads((root/'print-pagination.json').read_text(encoding='utf8'))
    if config != {'schema_version': 1, 'front_matter_pages': 2, 'first_printed_page': 1}:
        raise ValueError('Unreviewed print numbering convention')
    return config


def start_page(root, kind, chapter):
    config = json.loads((root/'assembly.json').read_text(encoding='utf8'))
    bundle = next(b for b in config['bundles'] if b['kind'] == kind)
    return settings(root)['first_printed_page'] + sum(bundle['page_counts'][:chapter-1])


def page_css(root, kind, chapter):
    return '\n@page:first {counter-reset:page '+str(start_page(root, kind, chapter))+';}\n'


def contents_rows(root, bundle):
    config = json.loads((root/'assembly.json').read_text(encoding='utf8'))
    navigation = json.loads((root/'signed-navigation.json').read_text(encoding='utf8'))
    rows = []
    for index, chapter in enumerate(config['chapters'], 1):
        top = 712-(index-1)*136
        rows.append({'chapter': index, 'kind': 'chapter', 'title': chapter['title'],
                     'page': start_page(root, bundle['kind'], index), 'y': top-9})
        if bundle['kind'] == 'student':
            for number, title in enumerate(chapter['paragraphs'], 1):
                pid = f'2.{index}.{number}'
                targets = [p for level, name, p in navigation['student_bookmarks']
                           if level == 3 and name.startswith(pid+' ')]
                if len(targets) != 1:
                    raise ValueError('Missing/ambiguous contents target '+pid)
                rows.append({'chapter': index, 'kind': 'paragraph', 'title': pid+' '+title,
                             'page': targets[0]-settings(root)['front_matter_pages'],
                             'y': top-44-(number-1)*13})
    return rows


def contents_pdf(root, bundle):
    config = json.loads((root/'assembly.json').read_text(encoding='utf8'))
    output = BytesIO()
    c = canvas.Canvas(output, pagesize=A4, invariant=1)
    c.setTitle(bundle['title'])
    c.setFillColor(HexColor(NAVY))
    c.setFont('Helvetica-Bold', 24)
    c.drawString(71, 779, bundle['title'])
    c.setFont('Helvetica', 10)
    c.drawString(71, 757, bundle['subtitle'])
    c.setStrokeColor(HexColor('#83A5C8'))
    c.setLineWidth(.8)
    c.roundRect(56, 51, 483, 675, 17, stroke=1, fill=0)
    rows = contents_rows(root, bundle)
    for index, chapter in enumerate(config['chapters']):
        top = 712-index*136
        c.setFillColor(HexColor('#E7F1F7'))
        c.roundRect(73, top-120, 448, 119, 9, stroke=0, fill=1)
        for row in (r for r in rows if r['chapter'] == index+1):
            heading = row['kind'] == 'chapter'
            c.setFillColor(HexColor(NAVY if heading else '#111111'))
            c.setFont('Helvetica-Bold' if heading else 'Helvetica', 14 if heading else 8.5)
            c.drawString(85 if heading else 97, row['y'], row['title'])
            c.setFont('Helvetica-Bold' if heading else 'Helvetica', 10 if heading else 8.5)
            c.drawRightString(505, row['y'], str(row['page']))
            if heading:
                c.setFillColor(HexColor('#111111'))
                c.setFont('Helvetica', 8.5)
                c.drawString(85, top-26, chapter['description'] if bundle['kind'] == 'student' else bundle['description'])
    c.showPage()
    c.save()
    return output.getvalue()


def refresh_source_map(root):
    path = root/'signed-page-map.json'
    rows = json.loads(path.read_text(encoding='utf8'))
    for row in rows:
        row['printed_page'] = row['physical_page']-settings(root)['front_matter_pages']
        row['source_sha256'] = file_record(root, root/row['source'])['sha256']
    path.write_text(json.dumps(rows, ensure_ascii=False, indent=2)+'\n', encoding='utf8', newline='\n')


def build_extract(root, student_path):
    rows = json.loads((root/'signed-page-map.json').read_text(encoding='utf8'))
    if len(rows) != 43 or len({r['physical_page'] for r in rows}) != 43:
        raise ValueError('Incomplete theory extract map')
    extract = fitz.open()
    with fitz.open(student_path) as source:
        for row in rows:
            if file_record(root, root/row['source'])['sha256'] != row['source_sha256']:
                raise ValueError('Stale extract source map')
            page = row['physical_page']-1
            extract.insert_pdf(source, from_page=page, to_page=page, links=False, annots=False)
    extract.set_metadata({'title': 'Boek 2 - 43 herziene theoriepagina’s', 'author': '4veco'})
    extract.save(root/EXTRACT, garbage=4, deflate=True)
    extract.close()
    record = {'source_pdf': file_record(root, student_path), 'extract_pdf': file_record(root, root/EXTRACT),
              'navigation': 'Leesextract met boekpaginanummers; gebruik het complete boek voor klikbare verwijzingen.',
              'pages': [dict(extract_page=i, **row) for i, row in enumerate(rows, 1)]}
    (root/EXTRACT_MAP).write_text(json.dumps(record, ensure_ascii=False, indent=2)+'\n', encoding='utf8', newline='\n')
    return [root/EXTRACT, root/EXTRACT_MAP]
