"""Own read-only six-SVG accessible-name inventory; no source mutation."""
from pathlib import Path
import hashlib
import json
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[3]
assert ROOT.parent.name == 'book2-213-r5-qc-20260905'
sys.path.insert(0, str(ROOT / 'build-scripts/content/book-2'))
import b2_213 as b

folder = Path('\\\\?\\' + str(ROOT.parent / '4veco-lessen')) / b.LESSON_REL
assets = []
for path in sorted((folder / '_assets').glob('*.svg')):
    raw = path.read_bytes()
    svg = ET.fromstring(raw)
    title = svg.find('{http://www.w3.org/2000/svg}title')
    assert title is not None
    value = ''.join(title.itertext())
    labelledby = svg.get('aria-labelledby')
    assert svg.get('role') == 'img' and labelledby == title.get('id')
    assets.append({
        'asset': path.name, 'sha256': hashlib.sha256(raw).hexdigest(),
        'role': svg.get('role'), 'aria_labelledby': labelledby,
        'title_id': title.get('id'), 'title': value, 'characters': len(value),
        'over_120': len(value) > 120,
        'manual_noun_first_verdict': 'REVISE: imperative Vergelijk' if path.stem == '2.1.3_we_1' else 'PASS: noun phrase',
    })
assert len(assets) == 6
record = {
    'reviewer': 'paragraph_213_r5_specialist_qc',
    'scope': 'All six actual paragraph-local SVG role=img accessible titles, supplementary to complete HTML alt inventory',
    'finding': 'REVISE: we1 imperative-first accessible title; no additional SVG title violation identified',
    'long_description_note': 'Substantive native captions/tables/prose were personally reviewed separately and must remain. No claim of SVG standalone exhaustive long description or screen-reader user test.',
    'assets': assets,
}
out = Path(__file__).parent / 'specialist-svg-metadata-r5.json'
assert not out.exists()
out.write_text(json.dumps(record, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
print(json.dumps(record, ensure_ascii=True, indent=2))
