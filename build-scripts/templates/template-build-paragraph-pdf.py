"""Copy to the lesson paragraph as build_pdf.py. No renderer snippets to adapt."""
import os
from pathlib import Path
import runpy
import sys

folder = Path(__file__).resolve().parent
platform = os.environ.get('PLATFORM_ROOT')
if not platform:
    lesson = next((parent for parent in folder.parents if (parent / 'AGENTS.md').is_file()), None)
    if lesson is None:
        raise SystemExit('Set PLATFORM_ROOT to the paired platform checkout')
    platform = lesson.parent / '4veco-platform'
sys.argv = [str(Path(platform) / 'build-scripts/textbook/paragraph_pdf.py'), str(folder)]
runpy.run_path(sys.argv[0], run_name='__main__')
