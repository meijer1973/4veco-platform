"""Supplemental independent completeness, history and preservation evidence."""
import importlib.util, json, re, ast
from pathlib import Path
from bs4 import BeautifulSoup
import fitz
spec=importlib.util.spec_from_file_location('q',Path(__file__).with_name('BOOK2-TEXTBOOK-PRODUCTION-1-222-R13-QC-run.py'))
q=importlib.util.module_from_spec(spec); spec.loader.exec_module(q)
def compact(x): return re.sub(r'\s+','',x)
result={'status':'PASS','documents':[],'contrast':[]}
old=json.loads((q.ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-build-r12.json').read_text(encoding='utf-8'))
new=q.manifest()
for d in new['documents']:
    pdf=Path(d['source_pdf']); kind=pdf.stem.rsplit(' – ',1)[1]
    dom=BeautifulSoup(Path(d['source_html']).read_text(encoding='utf-8'),'html.parser')
    extracted=compact(''.join(p.get_text() for p in fitz.open(pdf)))
    # Every rendered DOM text node, excluding style/title and generated images,
    # must occur in PDF text; image text is covered by the full figure inspection.
    body=dom.body
    pieces=[str(n) for n in body.find_all(string=True) if str(n).strip() and n.parent.name not in ('style','script')]
    missing=[x for x in pieces if compact(x) not in extracted]
    assert not missing,(kind,missing)
    o=next(x for x in old['documents'] if Path(x['source_pdf']).name==pdf.name)
    # Rebase old immutable proof by its owned reports/rendered-proof suffix only.
    op=Path(o['proof_directory']); op=q.ROOT/'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1'/op.name
    om=json.loads((op/'manifest.json').read_text(encoding='utf-8'))
    nm=json.loads((Path(d['proof_directory'])/'manifest.json').read_text(encoding='utf-8'))
    changes=[]
    for key,h in om['page_sha256'].items():
        assert q.sha((op/'pages'/key).read_bytes())==h
        nh=nm['page_sha256'][key]
        if h!=nh: changes.append(dict(page=key,old=h,new=nh))
    assert [x['page'] for x in changes]==(['page-002.png'] if kind=='antwoorden' else [])
    result['documents'].append(dict(kind=kind,complete_pdf_text_nodes=len(pieces),missing_nodes=0,old_pdf_sha256=o['pdf_sha256'],new_pdf_sha256=d['pdf_sha256'],changed_pages=changes))
path='build-scripts/content/book-2/222/test_source.py'
before=ast.parse(q.blob('ca05ec784838617f7a11c0b33d0b53e1a2fb7f29',path).decode('utf-8'))
after=ast.parse((q.ROOT/path).read_text(encoding='utf-8'))
def tests(tree): return {n.name:ast.dump(n,include_attributes=False) for n in ast.walk(tree) if isinstance(n,ast.FunctionDef) and n.name.startswith('test_')}
b,a=tests(before),tests(after)
assert len(b)==11 and len(a)==14 and all(a[k]==v for k,v in b.items())
result['source_test_preservation']=dict(original=11,current=14,original_AST_unchanged=True,new=sorted(set(a)-set(b)))
def luminance(c):
    rgb=[int(c[i:i+2],16)/255 for i in (1,3,5)]
    rgb=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in rgb]
    return sum(x*y for x,y in zip(rgb,(.2126,.7152,.0722)))
for fg,bg in [('#555555','#ffffff'),('#304958','#ffffff'),('#182b3a','#eef4f7'),('#182b3a','#eaf1f5')]:
    x,y=sorted((luminance(fg),luminance(bg))); ratio=(y+.05)/(x+.05)
    assert ratio>=4.5
    result['contrast'].append(dict(foreground=fg,background=bg,ratio=round(ratio,3)))
bindings=json.loads((q.E/'pass0.json').read_text(encoding='utf-8'))['bindings']
for path,h in bindings.items(): assert q.sha(Path(path).read_bytes())==h,path
result['pass0_bindings_still_exact_before_QC']=len(bindings)
result['handoff_exists']=(q.P/'2.2.2-textbook-handoff.md').exists()
q.put('complete-route-check.json',result)
print(json.dumps(result,ensure_ascii=True))
