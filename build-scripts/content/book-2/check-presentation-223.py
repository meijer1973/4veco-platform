"""HOW TO ADAPT: verify source questions against saved slides, then inspect renders.

Usage: python check-presentation-223.py FINAL.pptx LESSON_REPOSITORY
Checks package content and provenance, not classroom effectiveness or visual quality.
"""
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as E
from fractions import Fraction
import hashlib
import html
import json
import os
import re
import sys


def accessible(path):
    path = Path(path).resolve()
    return Path('\\\\?\\' + str(path)) if os.name == 'nt' else path


def normalize(value):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', value))).strip()


ns = {'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'}


def content(root):
    return '\n'.join(t.text or '' for t in root.findall('.//a:t', ns))


facts = json.loads(Path(__file__).with_name('presentation-223.manifest.json').read_text(encoding='utf-8'))
edition = Path(sys.argv[2]) / facts['sourceEdition']
for rel, digest in facts['sourceFiles'].items():
    assert hashlib.sha256(accessible(edition / rel).read_bytes()).hexdigest() == digest, f'Stale source: {rel}'
source_path = next(p for p in facts['sourceFiles'] if '/manuscript/' in p)
source = accessible(edition / source_path).read_text(encoding='utf-8')
target = source.split('## Doeloefening')[1].split('</div>')[0]
questions = re.findall(r'^[a-e]\) .+$', target, re.M)
assert len(questions) == 5

with ZipFile(accessible(sys.argv[1])) as z:
    roots = [E.fromstring(z.read(f'ppt/slides/slide{i}.xml')) for i in range(1, 29)]
    assert len([n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+.xml', n)]) == 28
    texts = [content(r) for r in roots]
    question_block = normalize('\n'.join(texts[16:21]))
    for q in questions:
        assert normalize(q) in question_block, f'Missing source question: {q}'
    for value in ['390', '420', '392', '+0,77']:
        assert not re.search(rf'(?<!\d){re.escape(value)}(?!\d)', question_block), f'Answer exposed: {value}'
    overview = []
    for number in (1, 16, 28):
        shapes = []
        for shape in roots[number-1].findall('.//p:sp', ns):
            name = shape.find('p:nvSpPr/p:cNvPr', ns).get('name')
            if name in ('phase', 'slide-number'):
                continue
            shapes.append((name, content(shape), E.tostring(shape.find('p:spPr/a:xfrm', ns))))
        overview.append(shapes)
        for phrase in ('Pagina 59', 'Opgaven 1 en 2', 'Basis: 3, 4 en 5', 'Zelfstandig: 6 en 7', 'Doelopgave: 8', 'Maken en nakijken'):
            assert phrase in texts[number-1]
    assert overview[0] == overview[1] == overview[2], 'Overview text or geometry differs'
    table_count = sum(len(r.findall('.//a:tbl', ns)) for r in roots)
    assert table_count == 15
    assert not any(re.fullmatch(r'ppt/charts/chart\d+.xml', n) for n in z.namelist())
    for i in range(1, 29):
        note = E.fromstring(z.read(f'ppt/notesSlides/notesSlide{i}.xml'))
        for label in ('Vraag:', 'Uitleg:', 'Misvatting:', 'Overgang:', 'Bron:', facts['sourceCommit']):
            assert label in content(note), f'Slide {i}: incomplete notes'
        for run in note.findall('.//a:rPr', ns):
            assert int(run.get('sz', '1400')) >= 1400
        for run in roots[i-1].findall('.//a:rPr', ns):
            assert int(run.get('sz', '1400')) >= 1400
    for i in (4, 7, 8, 9, 10, 11, 12, 14, 15):
        assert 'Uitlegvoorbeeld — niet uit het boek' in texts[i-1]
        assert 'fictief' in content(E.fromstring(z.read(f'ppt/notesSlides/notesSlide{i}.xml')))

# Recompute all authored and target results independently from the given inputs.
f = lambda px, pz, y: 160 - 4*px + 2*pz + Fraction(2, 100)*y
g = lambda px, pz, y: 100 - 2*px + Fraction(5, 10)*pz + Fraction(1, 100)*y
assert [f(15,25,15000), f(15,25,18000), f(15,30,15000)] == [450,510,460]
assert ((f(15,25,18000)-450)/450) / Fraction(3000,15000) == Fraction(2,3)
assert [g(10,20,30000), g(10,20,33000), g(10,24,30000)] == [390,420,392]
assert ((g(10,20,33000)-390)/390) / Fraction(3000,30000) == Fraction(10,13)
assert [Fraction(a,b) for a,b in [(12,8),(2,8),(-4,8),(-4,-8),(12,-8)]] == [Fraction(3,2),Fraction(1,4),Fraction(-1,2),Fraction(1,2),Fraction(-3,2)]
assert [Fraction(a,b) for a,b in [(8,5),(-3,5),(4,10),(-6,10)]] == [Fraction(8,5),Fraction(-3,5),Fraction(2,5),Fraction(-3,5)]

# Bind the recalculated answers to the saved output, not just to reference math.
def dutch(value, decimals=1):
    return f'{float(value):+.{decimals}f}'.replace('.', ',').replace('-', '−')


for number, numerator, denominator in ((22,8,5),(22,-3,5),(23,4,10),(23,-6,10)):
    expression = f'{numerator:+d}% / {denominator:+d}% = {dutch(Fraction(numerator,denominator))}'.replace('-', '−')
    assert expression in texts[number-1], f'Slide {number}: wrong saved ratio {expression}'
for number, expected in ((24,g(10,20,30000)),(24,g(10,20,33000)),(26,g(10,24,30000))):
    assert f'= {int(expected)}' in texts[number-1], f'Slide {number}: wrong saved function result'
assert f'Ei = 7,692307…% / 10% ≈ {dutch(Fraction(10,13),2)}' in texts[24]
assert '(420 − 390) / 390 × 100%' in texts[24]
assert '(33.000 − 30.000) / 30.000 × 100%' in texts[24]
assert 'Px = 10 en Y = 30.000 blijven gelijk' in texts[25]
print(json.dumps({'ok':True,'slides':28,'notes':28,'nativeTables':table_count,'nativeCharts':0,'sourceQuestions':5,'overviewParity':True,'sourceHashes':len(facts['sourceFiles']),'arithmetic':'pass'}, indent=2))
