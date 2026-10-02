"""Per-paragraph current-file evidence for the imported fixed-page edition.

This is the equivalent inventory for manuscripts owned outside the paragraph
export directory. It confers no review verdict and never writes a review report.
Shared chapter inputs are deliberately bound in each relevant paragraph record.
"""
from pathlib import Path
import argparse,hashlib,json
ROOT=Path(__file__).resolve().parents[3]
def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--lessons',type=Path,required=True);parser.add_argument('--check',action='store_true');args=parser.parse_args()
    lessons=args.lessons.resolve();edition=lessons/'Boek 1 - Grondslagen, vraag en aanbod/edities/tweede-editie-2026'
    out=edition/'qa/reviews';out.mkdir(exist_ok=True)
    for n in range(1,4):
        ch=edition/'bronnen'/f'H{n}'
        exports=json.loads((ch/'QA/paragraph_exports.json').read_text(encoding='utf8'))
        for para in range(1,5):
            code=f'1.{n}.{para}'
            files=[('lessons',p) for p in ch.iterdir() if p.suffix in ['.md','.css','.json'] and not p.name.endswith('– hoofdstuk.md')]
            files+=[('lessons',p) for p in (ch/'_assets').iterdir() if p.is_file()]
            files+=[('lessons',edition/e['file']) for e in exports if e['paragraph']==code]
            files+=[('lessons',p) for p in (edition/'hoofdstukken'/f'H{n}').iterdir() if p.suffix in ['.html','.pdf']]
            files+=[('lessons',ch/'QA/lesson_minutes.json'),('lessons',edition/'README.md')]
            files+=[('platform',p) for p in (ROOT/'build-scripts/books/book1_second_edition').rglob('*.py')]
            files+=[('platform',ROOT/'references/owned/book1-second-edition-2026/targets.json'),('platform',ROOT/'skills/econ-exercise-builder.md')]
            inventory=[]
            for repo,file in sorted(set(files),key=lambda row:(row[0],str(row[1]))):
                b=file.read_bytes();normalized=file.suffix not in ['.pdf','.png']
                if normalized:b=b.decode('utf8').replace('\r\n','\n').encode('utf8')
                inventory.append({'repository':repo,'path':file.relative_to(lessons if repo=='lessons' else ROOT).as_posix(),'sha256':hashlib.sha256(b).hexdigest(),'hash_mode':'utf8_lf' if normalized else 'exact_bytes'})
            doc={'schema':'book1-fixed-page-part-a-review-v1','edition':'book1-second-edition-2026','paragraph':code,'scope':'Current Part A; shared chapter inputs included. No inherited review or Part B acceptance.','files':inventory}
            text=json.dumps(doc,ensure_ascii=False,indent=2)+'\n';file=out/(code+'-textbook-review-manifest.json')
            if args.check:
                if file.read_text(encoding='utf8')!=text:raise SystemExit('Stale paragraph inventory '+code)
            else:file.write_text(text,encoding='utf8',newline='\n')
            print(code,hashlib.sha256(text.encode('utf8')).hexdigest())
if __name__=='__main__':main()
