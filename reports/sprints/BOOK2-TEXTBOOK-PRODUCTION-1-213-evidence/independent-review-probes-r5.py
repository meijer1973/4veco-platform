"""Independent review diagnostics; only this review pair is writable."""
from pathlib import Path
from fractions import Fraction
import hashlib, json, re, sys
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[3]
assert ROOT.parent.name == 'book2-213-independent-review-20260905'
sys.path.insert(0, str(ROOT/'build-scripts/content/book-2'))
import b2_213 as candidate
DEST = ROOT.parent/'4veco-lessen'/candidate.LESSON_REL
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
    result={'reviewer':'paragraph_213_independent_review','pass':'0','result':'PASS',
      'missing':[], 'unpaired':[], 'naming_flags':[p.name for p in assets if not re.fullmatch(r'2\.1\.3_(fig|we|ex|mc)_\d+\.(svg|png)',p.name)],
      'orphan_flags':[p.name for p in assets if p.stem not in refs],
      'assets':{p.name:sha(p) for p in assets},'required_files':{p.name:sha(p) for p in required}}
    emit('independent-pass0-r5.json',result)

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
    emit('independent-arithmetic-r5.json',{'reviewer':'paragraph_213_independent_review','result':'PASS','cases':results,'bonus_MK':bonus,
      'start1':{'TK':18+2*4,'TO':5*4,'GTK':str(Fraction(26,4)),'profit':20-26},
      'closing':{str(q):{'TK':15+2*q,'TO':7*q,'profit':7*q-(15+2*q),'GTK':str(Fraction(15+2*q,q))} for q in (3,6)},
      'manual_conclusion':'All source/answer amounts and interval meanings match these independent exact-fraction calculations; no individual-product or optimum inference is licensed.'})

def bindings():
    original=json.loads((ROOT/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-build-r5.json').read_text(encoding='utf-8'))
    docs=[]; proofs=[]
    # Read only original records, map each recorded input into this owned pair.
    def relocate(value):
        s=value.replace('\\','/')
        marker='/book2-213-output-20260905/'
        assert marker in s, s
        return str(ROOT.parent/s.split(marker,1)[1])
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
    emit('independent-relocated-build-r5.json',original)
    emit('independent-proof-bindings-r5.json',{'reviewer':'paragraph_213_independent_review','result':'PASS','proofs':proofs,'visual_inspection':'NOT_YET_SUPPLIED'})

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
    emit('independent-rebuild-r5.json',{'reviewer':'paragraph_213_independent_review','result':'PASS',
      'python':sys.executable,'path_policy':'Inherited PATH; no MSYS prepend',
      'full_generator':'all 24 artifact files byte identical to exact published R5',
      'print_only':'all 24 artifact files byte identical to exact published R5',
      'before':before,'after_full':after_full,'after_print':after_print,
      'visual_inspection':'NOT_SUPPLIED_BY_THIS_SCRIPT'})

def record_personal_inspection():
    # These observations were entered by the independent reviewer AFTER viewing
    # all full-page images with view_image. This is not automatic acceptance.
    observations={
      'paragraaf':[
        'Four goals and finite same-day introduction legible; table fits intact below the prerequisite box.',
        'Both actual interval diagrams inspected: aligned endpoints and arrow direction, 30/10 and 50/10 distinguish differences from rates.',
        'Right-endpoint and Q0 warning visible; MO figure and fixed-price explanation remain together and readable.',
        'Signed profit table and the printed bridge use one interval and positive delta Q; minus signs and both examples readable.',
        'Both profit-change cards match 50/10=5 and 30/10=3. Explicit no-output-choice boundary precedes worked-example heading.',
        'Bout initial table and full Lus calculation chain readable. Lus completed values fit; Bout calculation paragraph ends cleanly.',
        'Bout completed table, Lus/Bout comparison figure and bounded meaning inspected. Three interval MKs match the table, no optimum inference.',
        'Complete five-point recap, operational self-check and paper route readable. Start1 remains intact with three prompts.',
        'Whole Start2 on one page: error correction, faded 2–4 bridge and causal explanation visible without answer leakage.',
        'Printed optional scaffold includes first-interval arrow, blank second fractions, table and all three prompts. Nothing clips.',
        'Unequal-width G4 and fixed/price-change G5 native tables are readable; clear separation between cases and between tasks.',
        'Both independent native tables, 10/6 blanks and all five prompts on one page; no computational templates remain.',
        'Frozen Linea/Curva native cells and Q0 dashes inspected. Both tables and a–c point labels fit without split rows.',
        'Target d–e continue at top; optional K/L bonus and closing retrieval clearly separated. Footer does not collide.'
      ],
      'opgaven':[
        'Standalone booklet begins with both initial worked-example tables and first two solved steps; readable footer.',
        'Fixed-price explanation and complete Lus/Bout tables legible; no cut row or isolated heading.',
        'Actual comparison figure, bounded meanings and all five recap points inspected; recap ends intact.',
        'Self-check and route lead to complete Start1/Start2 on one page; interval calculations not prefilled.',
        'Optional guided patch table and actual faded figure align; all prompts and footer clear.',
        'G4 unequal steps and G5 four-case comparison legible; case columns preserve their intended values.',
        'Independent Draad/Kaft task retains all target-equivalent blanks and five prompts; no answer table leakage.',
        'Both exact target tables and first three subquestions visible; ten and six blanks preserved.',
        'Final target questions, optional bonus and cumulative closing task intact, with unambiguous labels and units.'
      ],
      'antwoorden':[
        'Standalone navigation correctly points to the printed worked example; Start1/2 full answers and units legible; G3a begins with heading.',
        'G3/G4 completed tables and unequal denominator4 checked visually; G5a begins without clipped formula.',
        'Combined parameter explanation and Draad complete table readable; all Kaft interval numerators and denominators present.',
        'Kaft complete table and meaning precede target a/b. Linea loss signs, calculations and endpoint placements legible.',
        'Target c/d/e explanations and complete Curva table match exact fractional calculations; fixed price, not constant MK, explains MO.',
        '4/3/2/4/2 scoring table totals15. K/L unequal-width answers reject individual fifth-product inference; closing GTK/winst units clear.'
      ]}
    folders={'paragraaf':'213-paragraaf-534177c8280e-r5','opgaven':'213-opgaven-d12487671bd2-r5','antwoorden':'213-antwoorden-aa3b6ccc9dbb-r5'}
    docs=[]
    for kind,notes in observations.items():
        folder=ROOT/'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1'/folders[kind]
        manifest=json.loads((folder/'manifest.json').read_text(encoding='utf-8'))
        assert len(notes)==len(manifest['rendered_pages'])
        pages=[]
        for i,note in enumerate(notes,1):
            p=folder/'pages'/f'page-{i:03}.png'; assert sha(p)==manifest['page_sha256'][p.name]
            pages.append({'page':i,'file':p.relative_to(ROOT).as_posix(),'sha256':sha(p),'observation':note})
        docs.append({'kind':kind,'pdf_sha256':manifest['pdf_sha256'],'pages_inspected':pages})
    relocation=json.loads((OUT/'grayscale-relocation-r5.json').read_text(encoding='utf-8'))
    gray=[]
    for item in relocation['mappings']:
        p=ROOT/item['published_repository_path']; assert sha(p)==item['sha256']
        gray.append({'page':item['page'],'file':item['published_repository_path'],'sha256':sha(p),
          'observation':'Personally viewed full grayscale page. Direct labels, quantities, fractions, arrows or panel separator remain legible without color; no color-only meaning.'})
    emit('independent-personal-inspection-r5.json',{'reviewer':'paragraph_213_independent_review','date':'2026-09-05',
      'role':'distinct independent paragraph reviewer; not builder/specialist QC/root',
      'method':'Personally viewed each of all29 final full-page150dpi images with view_image, plus five grayscale pages covering all six actual figures; no inherited page-view claim.',
      'inspected_at_normal_reading_scale':True,'documents':docs,'grayscale':gray,'visible_student_defects':[],
      'paragraph_verdict':'PASS WITH FLAGS','flags':['Classroom54/66/78-minute estimates are unobserved; 54-minute core has one-minute margin.'],
      'limitations':['Not specialist QC, root handoff, CI, merge, learner attainment or whole-book acceptance.','Immutable builder generation manifests remain PENDING and unchanged.']})

if __name__=='__main__':
    {'pass0':pass_zero,'math':arithmetic,'bindings':bindings,'rebuild':rebuild,'record_personal_inspection':record_personal_inspection}[sys.argv[1]]()
