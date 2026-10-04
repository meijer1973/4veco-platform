"""Rebuild the bounded October textbook repairs through the owning renderers.

This builds sources and publication dependencies; it does not grant review or
curriculum authority. Use the same command on an external accepted-baseline copy
to distinguish renderer differences from this revision's page changes.
"""
from pathlib import Path
import argparse, importlib, json, os, runpy, subprocess, sys, shutil

HERE = Path(__file__).resolve().parent
BOOK1 = Path('Boek 1 - Grondslagen, vraag en aanbod/edities/tweede-editie-2026')

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--lessons', type=Path, required=True)
    ap.add_argument('--fonts', type=Path)
    ap.add_argument('--book', choices=['1', '34', 'all'], default='all')
    args = ap.parse_args()
    lessons = args.lessons.resolve()
    if args.book in ('1', 'all'):
        if args.fonts is None:
            ap.error('--fonts is required when rebuilding Book 1')
        subprocess.run([sys.executable, '-X', 'utf8', str(HERE/'book1_second_edition/rebuild.py'),
                        '--lessons', str(lessons), '--fonts', str(args.fonts.resolve())], check=True)
        # Refresh the compatibility PDF without overwriting the current
        # presentation navigation installed after the edition's first build.
        alias = lessons/'Boek 1 - Grondslagen, vraag en aanbod/Boek 1 Grondslagen, vraag en aanbod – boek.pdf'
        shutil.copyfile(lessons/BOOK1/'boek/Boek_1_Compleet_Tweede_editie.pdf', alias)
    if args.book in ('34', 'all'):
        root = lessons/'edities/books34-v3'
        sys.path.insert(0, str(root/'build'))
        renderer = importlib.import_module('render')
        assert renderer.ROOT.resolve() == root.resolve()
        rows = []
        # Answers are explicit dependencies, never silently reused after SVG or
        # answer-source corrections. Teacher sources in Books 3/4 are unchanged.
        for chapter, kinds in [('3.3', ('student',)), ('4.1', ('student', 'answer')),
                               ('4.3', ('student', 'answer'))]:
            rows += renderer.build_chapter(chapter, kinds)
        for row in rows:
            # Book 4 H3 answers use six flowing paragraph sections over sixteen
            # physical pages; section count is not a physical-page contract.
            expected = {'Boek_4_H1_Antwoorden_v3': 26,
                        'Boek_4_H3_Antwoorden_v3': 16}.get(row['stem'], row['designed_pages'])
            if row['pages'] != expected or row['overflow']:
                raise RuntimeError('Pagination drift: '+row['stem'])
        runpy.run_path(str(HERE/'books34_followups_assemble.py'), run_name='__main__')
        runpy.run_path(str(HERE/'books34_records.py'), run_name='__main__')
        runpy.run_path(str(root/'build/export_paragraphs.py'), run_name='__main__')
        runpy.run_path(str(root/'build/preview_targets.py'), run_name='__main__')
        print('Rebuilt student/answer chapters, book-page chapters, complete books, records and paragraph exports.')

if __name__ == '__main__':
    sys.dont_write_bytecode = True
    os.environ['PYTHONUTF8'] = '1'
    main()
