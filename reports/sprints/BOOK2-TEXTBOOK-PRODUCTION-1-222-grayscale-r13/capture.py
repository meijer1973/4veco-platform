"""Fresh full-page grayscale renders; capture only, not visual acceptance."""
import hashlib
import json
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent
PLATFORM = HERE.parents[2]
manifest = json.loads((HERE.parent / 'BOOK2-TEXTBOOK-PRODUCTION-1-222-build-r13.json').read_text(encoding='utf-8'))
document = manifest['documents'][0]
pdf = Path(document['source_pdf'])
assert hashlib.sha256(pdf.read_bytes()).hexdigest() == document['pdf_sha256']
rows = []
for page, figure in [(2, 'fig_1'), (3, 'fig_2'), (4, 'fig_3'), (6, 'we_1')]:
    prefix = HERE / f'paragraaf-page-{page:03d}'
    output = prefix.with_suffix('.png')
    assert not output.exists(), 'Grayscale evidence is immutable'
    subprocess.run(['pdftoppm', '-f', str(page), '-l', str(page), '-singlefile', '-gray',
                    '-png', '-r', '150', str(pdf), str(prefix)], check=True)
    rows.append({'page': page, 'figure': figure, 'path': str(output),
                 'sha256': hashlib.sha256(output.read_bytes()).hexdigest()})
record = {'source_pdf_sha256': document['pdf_sha256'], 'render_dpi': 150,
          'inspection_status': 'PENDING', 'pages': rows}
(HERE / 'capture.json').write_text(json.dumps(record, indent=2) + '\n', encoding='utf-8', newline='\n')
print(json.dumps(record))
