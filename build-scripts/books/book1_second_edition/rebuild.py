"""Build the owner-authorized Book 1 second edition from editable manuscripts.

No author generator is run, no first-edition file is modified and no review is
renewed by this command. Original delivery evidence is kept in received/.
"""
from pathlib import Path
import argparse, hashlib, json, os, subprocess, sys, tempfile

HERE = Path(__file__).resolve().parent

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--lessons', type=Path, required=True)
    parser.add_argument('--fonts', type=Path, required=True, help='Directory containing the Lato TTF family')
    parser.add_argument('--chapter', choices=['H1','H2','H3'], help='Build and validate only this chapter')
    args = parser.parse_args()
    edition = args.lessons.resolve()/'Boek 1 - Grondslagen, vraag en aanbod/edities/tweede-editie-2026'
    fonts = args.fonts.resolve()
    for style in ['Regular','Bold','Heavy','Black','Italic']:
        if not (fonts/f'Lato-{style}.ttf').is_file():
            parser.error(f'Missing Lato-{style}.ttf in {fonts}')
    env = {**os.environ, 'BOOK1_EDITION_ROOT':str(edition), 'LATO_FONT_DIR':str(fonts), 'PYTHONUTF8':'1'}
    def run(script):
        subprocess.run([sys.executable,'-X','utf8',str(script)],env=env,check=True)
    # Bind editable inputs BEFORE rendering. Derived QA is deliberately excluded.
    inputs = sorted(p for p in (edition/'bronnen').rglob('*') if p.is_file()
        and (p.suffix in ['.md','.css','.svg','.png'] or p.name=='chapter-order.json')
        and not p.name.endswith('– hoofdstuk.md') and 'QA' not in p.parts)
    hashes={p.relative_to(edition).as_posix():digest(p) for p in inputs}
    for chapter in ([args.chapter] if args.chapter else ['H1','H2','H3']):
        env['BOOK1_CHAPTER_ROOT']=str(edition/'bronnen'/chapter)
        for name in ['build.py','validate.py']:
            run(HERE/'chapters'/chapter/name)
        run(HERE/'export_paragraphs.py')
    if args.chapter:
        return
    (edition/'qa/source_hashes.json').write_text(json.dumps(hashes,indent=2,ensure_ascii=False)+'\n',encoding='utf8', newline='\n')
    with tempfile.TemporaryDirectory(prefix='book1-second-edition-') as tmp:
        env['BOOK1_BUILD_TMP']=tmp
        for name in ['prepare_inputs.py','build_book.py','export_manuscript.py','validate_book.py']:
            run(HERE/'book'/name)
    if any(digest(edition/p)!=h for p,h in hashes.items()):
        raise RuntimeError('A build step changed an editable input')
    print('Built and validated the second edition; independent review is a separate gate.')

if __name__=='__main__':
    main()
