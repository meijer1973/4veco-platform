"""Independent review diagnostics; only this review pair is writable."""
from pathlib import Path
from fractions import Fraction
import hashlib, json, re, sys
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[3]
assert ROOT.parent.name == 'book2-213-r5-qc-20260905'
sys.path.insert(0, str(ROOT/'build-scripts/content/book-2'))
import b2_213 as candidate
DEST = Path('\\\\?\\'+str(ROOT.parent/'4veco-lessen'))/candidate.LESSON_REL
OUT = Path(__file__).parent
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()

def emit(name, data):
    path = OUT/name
    assert not path.exists(), 'Fresh evidence only'
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')
    print(json.dumps(data, ensure_ascii=True, indent=2))

def pass_zero():
    refs=[]
    for md in DEST.glob('*.md'):
        for link in re.findall(r'!\[[^\]]*\]\(([^)]+)\)',md.read_text(encoding='utf-8-sig')):
            p=md.parent/link
            assert p.is_file(), (md,link)
            assert p.resolve().is_relative_to((DEST/'_assets').resolve())
            refs.append(p.stem)
    assets=list((DEST/'_assets').iterdir())
    for p in assets:
        assert p.with_suffix('.png' if p.suffix=='.svg' else '.svg').is_file(),str(p)
    required=[DEST/f'{candidate.STEM} – {kind}{ext}' for kind in ('paragraaf','opgaven','antwoorden') for ext in ('.md','.html','.pdf','.zip')]
    required.append(DEST/'build_pdf.py')
    assert all(p.is_file() for p in required)
    assert all(p.stat().st_size>10000 for p in required if p.suffix=='.pdf')
    result={'reviewer':'paragraph_213_r5_specialist_qc','pass':'0','result':'PASS',
      'missing':[], 'unpaired':[], 'naming_flags':[p.name for p in assets if not re.fullmatch(r'2\.1\.3_(fig|we|ex|mc)_\d+\.(svg|png)',p.name)],
      'orphan_flags':[p.name for p in assets if p.stem not in refs],
      'assets':{p.name:sha(p) for p in assets},'required_files':{p.name:sha(p) for p in required}}
    emit('specialist-pass0-r5.json',result)

def arithmetic():
    # Entered independently from printed source amounts, not candidate.CASES.
    cases={
      'fotohouders':([0,10,20],[20,50,100],[0,80,160]),
      'Lus':([0,2,4,6],[12,16,20,24],[0,12,24,36]),
      'Bout':([0,2,4,6],[8,12,24,44],[0,24,48,72]),
      'flessen':([0,2,4],[8,12,20],[0,12,24]),
      'patches':([0,3,6],[9,15,21],[0,15,30]),
      'onderzetters':([0,2,6],[10,14,38],[0,16,48]),
      'Draad':([0,4,8,12],[20,24,28,32],[0,20,40,60]),
      'Kaft':([0,4,8,12],[12,28,76,156],[0,96,192,288]),
      'Linea':([0,10,20,30],[200,230,260,290],[0,80,160,240]),
      'Curva':([0,5,10,15],[100,125,200,325],[0,150,300,450]),
      'organizer_basis':([2,6],[14,22],[12,36]),
      'organizer_A':([2,6],[24,32],[12,36]),
      'organizer_B':([2,6],[14,22],[14,42]),
      'organizer_beide':([2,6],[24,32],[14,42])}
    results={}
    for name,(q,tk,to) in cases.items():
        profits=[r-c for c,r in zip(tk,to)]; rows=[]
        for i in range(1,len(q)):
            dq=q[i]-q[i-1]; dc=tk[i]-tk[i-1]; dr=to[i]-to[i-1]
            mk=Fraction(dc,dq); mo=Fraction(dr,dq)
            bridge=Fraction(profits[i]-profits[i-1],dq)
            assert bridge==mo-mk
            rows.append({'interval':[q[i-1],q[i]],'right_endpoint':q[i], 'delta_Q':dq,'delta_TK':dc,'delta_TO':dr,'MK':str(mk),'MO':str(mo),'profit_change_per_extra_product':str(bridge)})
        results[name]={'profits':profits,'intervals':rows}
    bonus={name:[str(Fraction(t[1]-t[0],4)),str(Fraction(t[2]-t[1],8))] for name,t in [('K',[20,32,56]),('L',[20,40,56])]}
    emit('specialist-arithmetic-r5.json',{'reviewer':'paragraph_213_r5_specialist_qc','result':'PASS','cases':results,'bonus_MK':bonus,
      'start1':{'TK':18+2*4,'TO':5*4,'GTK':str(Fraction(26,4)),'profit':20-26},
      'closing':{str(q):{'TK':15+2*q,'TO':7*q,'profit':7*q-(15+2*q),'GTK':str(Fraction(15+2*q,q))} for q in (3,6)},
      'manual_conclusion':'Independent diagnostic recomputation from source amounts; manual review judgment is recorded separately, not supplied by this script.'})

def bindings():
    original=json.loads((ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-build-r5.json').read_text(encoding='utf-8'))
    docs=[]; proofs=[]
    # Read only original records, map each recorded input into this owned pair.
    def relocate(value):
        s=value.replace('\\','/')
        marker='/book2-213-output-20260905/'
        assert marker in s, s
        return str(Path('\\\\?\\'+str(ROOT.parent))/s.split(marker,1)[1])
    for item in original['input_sources']:
        path=Path(relocate(item['path'])); assert sha(path)==item['sha256']
    for doc in original['documents']:
        changed=dict(doc)
        for key,pin in [('source_md','source_sha256'),('source_html','html_sha256'),('source_pdf','pdf_sha256')]:
            changed[key]=relocate(doc[key]); assert sha(Path(changed[key]))==doc[pin]
        changed['assets']=[{**a,'path':relocate(a['path'])} for a in doc['assets']]
        for a in changed['assets']: assert sha(Path(a['path']))==a['sha256']
        changed['zip']={**doc['zip'],'path':relocate(doc['zip']['path'])}
        assert sha(Path(changed['zip']['path']))==doc['zip']['sha256']
        proof=Path(relocate(doc['proof_directory'])); m=json.loads((proof/'manifest.json').read_text(encoding='utf-8'))
        assert m['pdf_sha256']==doc['pdf_sha256']
        assert m['inspection_status']=='PENDING' and m['pages_inspected']==[] and m['visible_student_defects'] is None
        for page in m['rendered_pages']: assert sha(proof/page)==m['page_sha256'][Path(page).name]
        proofs.append({'directory':str(proof),'pdf_sha256':m['pdf_sha256'],'page_sha256':m['page_sha256']})
        changed['proof_directory']=str(proof);docs.append(changed)
    original['documents']=docs
    original['relocation_note']='Independent diagnostic only; original immutable R5 manifests are unchanged. Every input/output/asset raw SHA reverified before use.'
    emit('specialist-relocated-build-r5.json',original)
    emit('specialist-proof-bindings-r5.json',{'reviewer':'paragraph_213_r5_specialist_qc','result':'PASS','proofs':proofs,'visual_inspection':'NOT_YET_SUPPLIED'})

def rebuild():
    # Keep ordinary platform cwd for Node. Only long lesson file paths use the
    # Windows extended prefix; no renderer, source or verification is patched.
    assert not str(ROOT).startswith('\\\\?\\'), 'Invoke this mode with ordinary script path'
    lesson=Path('\\\\?\\'+str(ROOT.parent/'4veco-lessen'))
    folder=lesson/candidate.LESSON_REL
    def snapshot():
        files=[folder/f'{candidate.STEM} – {k}{ext}' for k in ('paragraaf','opgaven','antwoorden') for ext in ('.md','.html','.pdf','.zip')]
        files += [folder/'_assets'/f'{name}{ext}' for name in candidate.ASSETS for ext in ('.svg','.png')]
        return {p.relative_to(folder).as_posix():sha(p) for p in files}
    before=snapshot()
    expected=json.loads((ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-rebuild-r5.json').read_text(encoding='utf-8'))['artifacts']
    assert before==expected, 'Input snapshot differs from exact candidate'
    built=candidate.build(lesson)
    after_full=snapshot(); assert after_full==before, 'Full generator drift'
    for k in ('paragraaf','opgaven','antwoorden'):
        candidate.zip_document(candidate.build_document(folder/f'{candidate.STEM} – {k}.md'))
    after_print=snapshot(); assert after_print==before, 'Print-only drift'
    emit('specialist-rebuild-r5.json',{'reviewer':'paragraph_213_r5_specialist_qc','result':'PASS',
      'python':sys.executable,'path_policy':'Inherited PATH; no MSYS prepend',
      'full_generator':'all 24 artifact files byte identical to exact published R5',
      'print_only':'all 24 artifact files byte identical to exact published R5',
      'before':before,'after_full':after_full,'after_print':after_print,
      'visual_inspection':'NOT_SUPPLIED_BY_THIS_SCRIPT'})


if __name__=='__main__':
    {'pass0':pass_zero,'math':arithmetic,'bindings':bindings,'rebuild':rebuild}[sys.argv[1]]()
