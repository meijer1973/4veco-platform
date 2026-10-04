"""Authenticate the three repaired saved decks and their current source figures."""
from pathlib import Path
import argparse,hashlib,json,subprocess
from repair_textbook_maintenance_presentations import verify_parts

ROOT=Path(__file__).resolve().parents[2]
CONTRACT=ROOT/'build-scripts/books/textbook-maintenance-presentations.json'
EVIDENCE=ROOT/'reports/review-gates/textbook-maintenance-20261004/presentations.json'
sha=lambda f:hashlib.sha256(f.read_bytes()).hexdigest()

def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--lessons',type=Path,required=True);args=ap.parse_args()
    contract=json.loads(CONTRACT.read_text(encoding='utf8'));evidence=json.loads(EVIDENCE.read_text(encoding='utf8'))
    assert [x['id'] for x in evidence]==[x['id'] for x in contract['presentations']]
    for row,pin in zip(contract['presentations'],evidence):
        pptx=args.lessons/row['path'];pdf=pptx.with_suffix('.pdf')
        assert sha(pptx)==pin['pptx_sha256'] and sha(pdf)==pin['pdf_sha256'],'Stale presentation artifact '+row['id']
        original=subprocess.check_output(['git','show',contract['lesson_base']+':'+row['path']],cwd=args.lessons)
        result=verify_parts(original,pptx.read_bytes(),row,contract,pin['image_sha256'])
        for key,value in result.items():
            assert value==pin[key],('Stale saved-file evidence',row['id'],key)
        if 'image' in row:
            source=row['image']['source'];assert sha(args.lessons/source)==pin['image_source_sha256']
            assert (args.lessons/source).read_bytes()==subprocess.check_output(['git','show',contract['source_commit']+':'+source],cwd=args.lessons)
        # The owning full builders must tell the same current story.
        author=(ROOT/f'build-scripts/content/book-4/presentation-{row["id"]}.mjs').read_text(encoding='utf8')
        for change in row['notes']:
            assert change['new'] in author
        print(row['id']+': current notes, source image, native charts/tables/workbooks and publication hashes PASS')

if __name__=='__main__':main()
