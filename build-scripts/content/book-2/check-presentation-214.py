"""HOW TO ADAPT: verify saved native charts against the new book's operations.

Usage: python check-presentation-214.py FINAL.pptx LESSON_REPOSITORY
This checks saved data, source hashes and structure; visually inspect every slide.
"""
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as E
import hashlib
import json
import posixpath
import re
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'presentations'))
from chart_workbooks import check_presentation

pptx, lessons = Path(sys.argv[1]), Path(sys.argv[2])
facts = json.loads(Path(__file__).with_name('presentation-214.manifest.json').read_text(encoding='utf-8'))
ns = {'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'c': 'http://schemas.openxmlformats.org/drawingml/2006/chart',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}

def require(ok, message):
    if not ok:
        raise AssertionError(message)

def content(root):
    return '\n'.join(t.text or '' for t in root.findall('.//a:t', ns))

def normalize(text):
    return re.sub(r'\s+', ' ', text.translate(str.maketrans({'‘': '"', '’': '"', '“': '"', '”': '"'}))).strip()

for rel, digest in facts['sourceFiles'].items():
    require(hashlib.sha256((lessons / facts['sourceEdition'] / rel).read_bytes()).hexdigest() == digest,
            f'Stale source: {rel}')

with ZipFile(pptx) as z:
    names = sorted((n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+.xml', n)),
                   key=lambda n: int(re.search(r'(\d+)\.xml', n)[1]))
    require(len(names) == 24, 'Slide count changed: recheck the sequence')
    roots = [E.fromstring(z.read(n)) for n in names]
    texts = [content(r) for r in roots]
    overview = []
    for number in (1, 8, 24):
        shapes = []
        for shape in roots[number-1].findall('.//p:sp', ns):
            name = shape.find('p:nvSpPr/p:cNvPr', ns).get('name')
            if name in ('phase', 'slide-number'):
                continue
            shapes.append((name, content(shape), E.tostring(shape.find('p:spPr/a:xfrm', ns))))
        overview.append(shapes)
        for phrase in ('Pagina 29', 'Opgave 1', 'Opgaven 1–7', 'Doel: 5', 'Bonus / denkertje: 6', 'Herhaling: 7', 'Maken en nakijken'):
            require(phrase in texts[number-1], f'Overview missing {phrase}')
    require(overview[0] == overview[1] == overview[2], 'Overview text/geometry mismatch')

    src = (lessons / facts['sourceEdition'] / 'bronnen/H1/manuscript/2.1.4 Gemengde opgaven – opgaven.md').read_text(encoding='utf-8')
    target = src.split('<b>Opgave 5 · SmoothBox — vervolg</b>')[1].split('</div>')[0]
    questions = re.findall(r'(?m)^([a-f])\) (.+)$', target)
    require(len(questions) == 6, 'Expected six actual source subquestions')
    question_slides = normalize(' '.join(texts[11:14]))
    for letter, question in questions:
        require(normalize(question) in question_slides, f'Incomplete source question {letter}')
    require('TK = 1.200 + 2Q' not in ' '.join(texts[:14]), 'Target answer before all questions')
    for number, phrases in {15:['TK = 1.200 + 2Q','TO = 5Q','4.000 bezoekers'],
                            16:['400','€ 2.000'],17:['€ 900 per dag','€ 3,71 per lunchbox'],
                            18:['(800 − 700) = 3,00','(900 − 800) = 3,50','(1.000 − 900) = 4,00'],
                            19:['400 < Q ≤ 1.000','401 t/m 1.000'],
                            21:['€ 3,00','€ 2,00','€ 1,50','€ 1,00'],
                            22:['€ 200','€ 150','€ 100','De uitspraak is onjuist.']}.items():
        for phrase in phrases:
            require(phrase in texts[number-1], f'Slide {number}: missing {phrase}')
    notes = [n for n in z.namelist() if re.fullmatch(r'ppt/notesSlides/notesSlide\d+.xml', n)]
    require(len(notes) == 24, 'Notes missing')
    for name in notes:
        root = E.fromstring(z.read(name))
        for label in ('Vraag:', 'Uitleg:', 'Misvatting:', 'Overgang:', 'Bron:'):
            require(label in content(root), f'{name}: missing {label}')
        for run in root.findall('.//a:rPr', ns):
            require(int(run.get('sz', '1400')) >= 1400, f'{name}: small notes')
    table_count = sum(len(r.findall('.//a:tbl', ns)) for r in roots)
    require(table_count == 10, f'Expected 10 native tables, found {table_count}')
    for root in roots:
        for run in root.findall('.//a:rPr', ns):
            require(int(run.get('sz', '1400')) >= 1400, 'Small slide text')

    chart_count = 0
    for number in (7, 11, 19, 20):
        ref = roots[number-1].find('.//c:chart', ns)
        rels = E.fromstring(z.read(f'ppt/slides/_rels/slide{number}.xml.rels'))
        target = next(r.get('Target') for r in rels if r.get('Id') == ref.get('{'+ns['r']+'}id'))
        file = posixpath.normpath(posixpath.join('ppt/slides', target)).lstrip('/')
        root = E.fromstring(z.read(file)); chart_count += 1
        scatter = root.find('.//c:scatterChart', ns)
        require(scatter is not None, 'Numeric horizontal axis requires XY chart')
        for axis in root.findall('.//c:valAx', ns):
            horizontal = axis.find('c:axPos', ns).get('val') == 'b'
            maxima = (150, 800) if number == 7 else (1200, 5500)
            require(float(axis.find('c:scaling/c:min', ns).get('val')) == 0, 'Axis zero changed')
            require(float(axis.find('c:scaling/c:max', ns).get('val')) == maxima[0 if horizontal else 1], 'Axis scale mismatch')
        found = {}
        for ser in scatter.findall('c:ser', ns):
            name = ''.join(ser.find('c:tx', ns).itertext())
            xs = [float(v.text) for v in ser.findall('c:xVal//c:pt/c:v', ns)]
            ys = [float(v.text) for v in ser.findall('c:yVal//c:pt/c:v', ns)]
            found[name] = (xs, ys)
            if name in ('TO', 'TK', 'TK vrijdag', 'TK zaterdag'):
                labels = ser.findall('c:dLbls/c:dLbl', ns)
                require(len(labels) == len(xs), 'Every point needs explicit label visibility')
                for label in labels:
                    idx = int(label.find('c:idx', ns).get('val'))
                    if idx < len(xs)-1:
                        require(label.find('c:delete', ns).get('val') == '1', 'Unexpected intermediate label')
                    else:
                        require(label.find('c:showSerName', ns).get('val') == '1', 'Missing endpoint label')
        if number == 7:
            require(found == {'TO':([0,120],[0,720]),'TK':([0,120],[240,480]),'Winstafstand':([90,90],[420,540])}, 'FotoFun coordinates do not match its functions and €120 segment')
        else:
            require(found['TO'] == ([0,1000],[0,5000]), 'TO = 5Q must stop at capacity')
            require(found['TK vrijdag'] == ([0,1000],[1200,3200]), 'Friday TK = 1200 + 2Q incorrect')
            require(found['TK zaterdag'] == ([700,800,900,1000],[2600,2900,3250,3650]), 'Saturday must show only given table points')
            if number > 11:
                require(found['Break-even'] == ([400],[2000]), 'Intersection incorrect')
                require(found['Hulplijn Q'] == ([400,400],[0,2000]), 'Vertical guide incorrect')
                require(found['Hulplijn bedrag'] == ([0,400],[2000,2000]), 'Horizontal guide incorrect')
            else:
                require(set(found) == {'TO','TK vrijdag','TK zaterdag'}, 'Source graph exposes answer')
            if number == 20:
                require(found['Winstafstand'] == ([700,700],[2600,3500]), '€900 profit segment incorrect')

workbooks = check_presentation(pptx)
require(workbooks['ok'], 'Chart/workbook inconsistency')
print(json.dumps({'ok': True, 'slides': 24, 'notes': 24, 'nativeTables': table_count,
                  'nativeCharts': chart_count, 'sourceSubquestions': len(questions),
                  'overviewParity': True, 'workbooks': workbooks}, indent=2))
