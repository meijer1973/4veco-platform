"""Regenerate only the five repaired answer PNGs from their existing SVG sources."""
from pathlib import Path
import json
import cairosvg
ROOT=Path(__file__).resolve().parents[1]
for row in json.loads((ROOT/'checks/figure-label-contract.json').read_text(encoding='utf-8')):
    cairosvg.svg2png(bytestring=(ROOT/row['svg']).read_bytes(),write_to=str(ROOT/row['png']),output_width=row['png_size'][0],output_height=row['png_size'][1])
print('Regenerated five answer PNGs from their current SVGs.')
