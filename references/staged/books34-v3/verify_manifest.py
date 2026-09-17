"""Check the exact downloaded delivery before building or changing it.
Only reads package files. Rebuilt PDFs can differ in binary metadata; use
build/compare_rebuild.py for text/render reproduction rather than renewing this manifest.
"""
from pathlib import Path
import json,hashlib,sys
root=Path(__file__).resolve().parent
manifest=json.loads((root/'MANIFEST.sha256.json').read_text(encoding='utf-8'))
failed=[]
for row in manifest['files']:
 p=root/row['path']
 if not p.is_file():failed.append(row['path']+': missing');continue
 if p.stat().st_size!=row['bytes'] or hashlib.sha256(p.read_bytes()).hexdigest()!=row['sha256']:failed.append(row['path']+': changed')
print(f"Delivery integrity: {len(manifest['files'])} files; {len(failed)} failures")
if failed:print('\n'.join(failed));sys.exit(1)
