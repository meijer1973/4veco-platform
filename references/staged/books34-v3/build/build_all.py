"""Rebuild this local delivery, not either live repository.

Use the pinned environment and fonts in BUILD_ENVIRONMENT.md. The received
manifest must be checked BEFORE rebuilding; it is never automatically renewed.
"""
from pathlib import Path
import subprocess, sys
ROOT=Path(__file__).resolve().parents[1]
commands=[
    ['build/rasterize_answer_labels.py'],
    ['build/render.py','--kinds','student,answer,teacher'],
    ['build/assemble.py'],
    ['build/records.py'],
    ['build/export_paragraphs.py'],
    ['build/render_outlines.py'],
    ['build/preview_targets.py'],
    ['build/check_math.py'],
    ['build/verify.py'],
    ['build/check_repairs.py'],
    ['-m','unittest','discover','-s','tests','-v'],
]
for args in commands:
    print('RUN',*args,flush=True)
    subprocess.run([sys.executable,*args],cwd=ROOT,check=True)
print('All repaired v3 outputs rebuilt and checked. No repository or approval was changed.')
