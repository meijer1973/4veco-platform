"""Compare a clean local rebuild with the delivered six complete volumes.
Usage: python build/compare_rebuild.py /path/to/clean/package
PDF metadata/compression bytes may differ; text and every rendered page must match.
"""
from pathlib import Path
import sys,json,hashlib,fitz
P=Path(__file__).resolve().parents[1]
Q=Path(sys.argv[1]).resolve()
results=[];failures=[];total=0
for f in sorted((P/'books').glob('*/output/*.pdf')):
 rel=f.relative_to(P);g=Q/rel
 a=fitz.open(f);b=fitz.open(g);ok=len(a)==len(b);pg=[]
 if not ok:failures.append(str(rel)+': page count')
 for n in range(min(len(a),len(b))):
  ta=a[n].get_text();tb=b[n].get_text()
  pa=a[n].get_pixmap(matrix=fitz.Matrix(1.1,1.1),alpha=False);pb=b[n].get_pixmap(matrix=fitz.Matrix(1.1,1.1),alpha=False)
  ha=hashlib.sha256(pa.samples).hexdigest();hb=hashlib.sha256(pb.samples).hexdigest()
  same=ta==tb and (pa.width,pa.height)==(pb.width,pb.height) and ha==hb
  if not same:failures.append(f'{rel}: page {n+1}')
  pg.append({'page':n+1,'same_text':ta==tb,'same_pixels':ha==hb,'render_sha256':ha})
 total+=len(a);results.append({'file':str(rel),'pages':len(a),'page_count_matches':ok,'pages_equal':all(x['same_text'] and x['same_pixels'] for x in pg),'page_checks':pg})
 a.close();b.close()
record={'method':'Independent clean directory, regenerated chapter/book PDFs from packaged current manuscripts. Text plus RGB raster equality at 79.2 dpi in PyMuPDF, all pages of six complete volumes. Same installed software/fonts; not a cross-platform Windows reproduction claim.','files':len(results),'pages_compared':total,'failures':failures,'results':results}
(P/'checks/rebuild-comparison.json').write_text(json.dumps(record,indent=2), encoding='utf-8', newline='\n')
print('Clean rebuild comparison:',len(results),'volumes,',total,'pages,',len(failures),'differences')
if failures:print('\n'.join(failures));raise SystemExit(1)
