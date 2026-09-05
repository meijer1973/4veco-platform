"""Independent exact-candidate evidence; never changes reviewed materials."""
from pathlib import Path
from fractions import Fraction as F
import hashlib, json, re, subprocess, sys, zipfile, zlib
from bs4 import BeautifulSoup, NavigableString, Tag
import fitz

OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[2]
LESSONS = ROOT.parent/'4veco-lessen'
STEM = '2.1.3 Marginale kosten en marginale opbrengsten'
REL = Path('Boek 2 - Kosten, opbrengsten, elasticiteit en surplus')/'2.1 Hoofdstuk Kosten en opbrengsten'/STEM
FOLDER = LESSONS/REL
ASSETS = ['2.1.3_fig_1','2.1.3_fig_2','2.1.3_fig_3','2.1.3_fig_4','2.1.3_we_1','2.1.3_ex_1']
KINDS = ['paragraaf','opgaven','antwoorden']
PBASE = '984547a17c966d3749d08ef34b92747de21eacbf'
LBASE = '5d67998d1e1d1aa5497d59850b53aebc780eaa96'
def sha(b): return hashlib.sha256(b).hexdigest()
def old(repo, ref, path): return subprocess.check_output(['git','show',f'{ref}:{path.as_posix()}'],cwd=repo)
def emit(name, data):
    path = OUT/(name+'.json')
    assert not path.exists(), str(path)
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    print(json.dumps({'report':str(path),'result':'PASS'},ensure_ascii=True))
def paths():
    return [FOLDER/f'{STEM} – {k}{ext}' for k in KINDS for ext in ['.md','.html','.pdf','.zip']] + [FOLDER/'_assets'/f'{n}{ext}' for n in ASSETS for ext in ['.svg','.png']]
def pass0():
    assert ROOT.parent.name == 'book2-213-r7-review-20260905'
    files = paths()
    for p in files: assert p.is_file() and p.stat().st_size>0, str(p)
    for k in KINDS: assert (FOLDER/f'{STEM} – {k}.pdf').stat().st_size>10000
    refs=set()
    for k in KINDS:
        md=(FOLDER/f'{STEM} – {k}.md').read_text(encoding='utf-8')
        refs.update(re.findall(r'_assets/(2\.1\.3_[\w]+)\.(?:svg|png)',md))
    assert refs==set(ASSETS), refs
    actual={p.stem for p in (FOLDER/'_assets').glob('2.1.3_*.svg')}
    assert actual==refs
    emit('pass0',{'role':'independent paragraph reviewer','expected_artifacts':24,'asset_pairs':6,'missing':[],'orphans':[],'hashes':{p.relative_to(LESSONS).as_posix():sha(p.read_bytes()) for p in files}})
def arithmetic():
    # Fresh calculations from independently transcribed problem data, not builder helpers.
    cases={
      'holders':([0,10,20],[20,50,100],[0,80,160],[3,5],[8,8],[-20,30,60]),
      'lus':([0,2,4,6],[12,16,20,24],[0,12,24,36],[2,2,2],[6,6,6],[-12,-4,4,12]),
      'bout':([0,2,4,6],[8,12,24,44],[0,24,48,72],[2,6,10],[12,12,12],[-8,12,24,28]),
      'bottles':([0,2,4],[8,12,20],[0,12,24],[2,4],[6,6],[-8,0,4]),
      'patches':([0,3,6],[9,15,21],[0,15,30],[2,2],[5,5],[-9,0,9]),
      'coasters':([0,2,6],[10,14,38],[0,16,48],[2,6],[8,8],[-10,2,10]),
      'draad':([0,4,8,12],[20,24,28,32],[0,20,40,60],[1,1,1],[5,5,5],[-20,-4,12,28]),
      'kaft':([0,4,8,12],[12,28,76,156],[0,96,192,288],[4,12,20],[24,24,24],[-12,68,116,132]),
      'linea':([0,10,20,30],[200,230,260,290],[0,80,160,240],[3,3,3],[8,8,8],[-200,-150,-100,-50]),
      'curva':([0,5,10,15],[100,125,200,325],[0,150,300,450],[5,15,25],[30,30,30],[-100,25,100,125])}
    results={}
    for name,(q,tk,to,ek,eo,ew) in cases.items():
        intervals=[(F(tk[i]-tk[i-1],q[i]-q[i-1]),F(to[i]-to[i-1],q[i]-q[i-1])) for i in range(1,len(q))]
        profits=[r-c for r,c in zip(to,tk)]
        assert [v[0] for v in intervals]==ek and [v[1] for v in intervals]==eo and profits==ew
        results[name]={'Q':q,'TK':tk,'TO':to,'MK':[str(v[0]) for v in intervals],'MO':[str(v[1]) for v in intervals],'profit':profits}
    assert 18+2*4==26 and 5*4==20 and F(26,4)==F(13,2)
    contrasts={}
    for n,c,r in [('base',[14,22],[12,36]),('fee',[24,32],[12,36]),('price',[14,22],[14,42]),('both',[24,32],[14,42])]:
        contrasts[n]={'MK':str(F(c[1]-c[0],4)),'MO':str(F(r[1]-r[0],4)),'profit_Q6':r[1]-c[1]}
    assert [contrasts[n]['MK'] for n in contrasts]==['2']*4
    assert [contrasts[n]['MO'] for n in contrasts]==['6','6','7','7'] and contrasts['both']['profit_Q6']==10
    assert F(12,4)==F(24,8)==3 and F(20,4)==5 and F(16,8)==2
    # Both completions preserve K's Q4=32 and Q12=56 but imply distinct fifth costs.
    completions=[{'TK4':32,'TK5':33,'TK12':56,'fifth_cost':1},{'TK4':32,'TK5':39,'TK12':56,'fifth_cost':7}]
    assert all(c['TK5']-c['TK4']==c['fifth_cost'] for c in completions)
    assert [15+2*q for q in [3,6]]==[21,27] and [7*q for q in [3,6]]==[21,42]
    emit('arithmetic',{'cases':results,'start1':{'TK':26,'TO':20,'GTK':'6.5','profit':-6},'organizer_contrasts':contrasts,'bonus':{'K_MK':[3,3],'L_MK':[5,2],'same_final_TK':56,'single_unit_countermodels':completions},'closing':{'Q':[3,6],'TK':[21,27],'TO':[21,42],'profit':[0,15],'GTK':['7','4.5']},'target_points':[4,3,2,4,2],'target_total':15})
def dom(node):
    if isinstance(node,NavigableString):
        value=' '.join(str(node).split())
        return value or None
    if isinstance(node,Tag): return [node.name,sorted((k,v) for k,v in node.attrs.items()),[x for c in node.children if (x:=dom(c)) is not None]]
def delta():
    src=Path('build-scripts/content/book-2/213/answers.md')
    before=old(ROOT,PBASE,src); after=(ROOT/src).read_bytes()
    match=re.search(rb'\*\*Beoordelingscriteria.*?\n\n(?=## Herhaling)',after,re.S)
    assert match, 'bounded criteria insertion'
    added=match.group(); assert after.replace(added,b'',1)==before
    assert len(re.findall(rb'^- ',added,re.M))==3
    protected=[]
    for p in [Path('build-scripts/content/book-2/b2_213.py'),Path('build-scripts/content/book-2/print_pipeline.py')]+[Path('build-scripts/content/book-2/213')/n for n in ['theory.md','exercises.md','target-answers.md','test_source.py','check_render.py','verify_rebuild.py','alt_contract.py']]+[Path('references/authored')/n for n in ['course-target-exercises.json','book-outlines/book-2-outline.md','book-outlines/book-2-outline.meta.json']]:
        raw=(ROOT/p).read_bytes(); assert raw==old(ROOT,PBASE,p), str(p)
        protected.append({'path':p.as_posix(),'sha256':sha(raw)})
    changes=[]; allfiles=[]
    for p in paths():
        rel=p.relative_to(LESSONS); raw=p.read_bytes(); previous=old(LESSONS,LBASE,rel)
        if raw!=previous: changes.append(p.name)
        allfiles.append({'path':rel.as_posix(),'before_sha256':sha(previous),'sha256':sha(raw),'equal':raw==previous})
    assert set(changes)=={f'{STEM} – antwoorden{ext}' for ext in ['.md','.html','.pdf','.zip']}
    md=FOLDER/f'{STEM} – antwoorden.md'
    assert md.read_bytes().replace(added,b'',1)==old(LESSONS,LBASE,md.relative_to(LESSONS))
    h=FOLDER/f'{STEM} – antwoorden.html'
    new=BeautifulSoup(h.read_bytes(),'html.parser'); previous=BeautifulSoup(old(LESSONS,LBASE,h.relative_to(LESSONS)),'html.parser')
    label=new.find('strong',string=lambda s:s and s.startswith('Beoordelingscriteria'))
    p=label.find_parent('p'); ul=p.find_next_sibling('ul'); assert len(ul.find_all('li',recursive=False))==3
    assert p.find_previous_sibling().get_text().startswith('c)')
    p.decompose(); ul.decompose(); assert dom(new)==dom(previous), 'complete DOM reverse delta'
    zips=[]
    for k,count in zip(KINDS,[15,7,3]):
        z=FOLDER/f'{STEM} – {k}.zip'
        with zipfile.ZipFile(z) as archive:
            assert len(archive.infolist())==count and archive.testzip() is None
            members=[]
            for i in archive.infolist():
                raw=archive.read(i); assert raw==(FOLDER/i.filename).read_bytes()
                assert i.CRC==zlib.crc32(raw) and i.date_time==(1980,1,1,0,0,0)
                assert not i.filename.startswith('/') and '..' not in Path(i.filename).parts
                members.append({'name':i.filename,'sha256':sha(raw),'crc32':i.CRC})
            zips.append({'kind':k,'sha256':sha(z.read_bytes()),'members':members})
    pdf=FOLDER/f'{STEM} – antwoorden.pdf'
    current=fitz.open(pdf); prior=fitz.open(stream=old(LESSONS,LBASE,pdf.relative_to(LESSONS)),filetype='pdf')
    assert len(current)==7 and len(prior)==6
    for i in range(5):
        a=current[i].get_pixmap(matrix=fitz.Matrix(1.5,1.5),clip=fitz.Rect(0,0,current[i].rect.width,current[i].rect.height-45)).samples
        b=prior[i].get_pixmap(matrix=fitz.Matrix(1.5,1.5),clip=fitz.Rect(0,0,prior[i].rect.width,prior[i].rect.height-45)).samples
        assert a==b, f'answer body page{i+1}'
    assert 'Beoordelingscriteria' in current[5].get_text() and 'Opgave 9' in current[6].get_text()
    found=[]
    for i,page in enumerate(current):
        for t in page.find_tables().tables:
            rows=t.extract()
            if t.col_count==6 and ['8','28','40','12','1','5'] in rows:
                # PyMuPDF includes surrounding paragraph-border boxes in this finder.
                # Isolate the actual header + four body rows, checking all 30 cells.
                start=rows.index(['Q','TK','TO','winst','MK','MO'])
                block=rows[start:start+5]
                assert block==[['Q','TK','TO','winst','MK','MO'],['0','20','0','−20','—','—'],['4','24','20','−4','1','5'],['8','28','40','12','1','5'],['12','32','60','28','1','5']]
                cells=[cell for row in t.rows[start:start+5] for cell in row.cells]
                assert len(cells)==30 and all(cell is not None for cell in cells)
                for row in t.rows[start:start+5]:
                    assert len({round(cell[0],2) for cell in row.cells})==6
                found.append({'page':i+1,'columns':6,'actual_table_rows':block,'cells':cells,'extractor_wrapper_row_count':t.row_count})
    assert len(found)==1
    emit('delta',{'platform_before':PBASE,'lessons_before':LBASE,'source_insertion_bytes':len(added),'source_insertion_sha256':sha(added),'three_criteria_only':True,'complete_DOM_reverse_delta':True,'first_five_answer_page_bodies_pixel_equal':True,'protected':protected,'artifact_deltas':allfiles,'zip_parity':zips,'Draad':found})

def bindings():
    sys.path.insert(0,str(ROOT/'build-scripts/content/book-2'))
    from print_pipeline import render_proof
    manifest_path=OUT/'relocated-build.json'
    manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
    assert manifest['inspection_status']=='PENDING'
    docs=[]
    for kind,count,doc in zip(KINDS,[14,9,7],manifest['documents']):
        directory=Path(doc['proof_directory']); proof=directory/'manifest.json'
        raw=proof.read_bytes(); m=json.loads(raw)
        assert m['inspection_status']=='PENDING' and m['pages_inspected']==[] and not m['inspected_at_normal_reading_scale']
        assert len(m['rendered_pages'])==count
        pages=[]
        for p in m['rendered_pages']:
            path=directory/p; actual=sha(path.read_bytes()); assert actual==m['page_sha256'][path.name]
            pages.append({'path':path.relative_to(ROOT).as_posix(),'sha256':actual})
        for key,pin in [('source_md','source_sha256'),('source_html','html_sha256'),('source_pdf','pdf_sha256')]: assert sha(Path(doc[key]).read_bytes())==doc[pin]
        try: render_proof(doc,directory)
        except ValueError as error: assert str(error)=='Proof destination is not empty; use a new output-hash directory'
        else: raise AssertionError('nonempty proof guard missing')
        assert proof.read_bytes()==raw
        docs.append({'kind':kind,'source_md_sha256':doc['source_sha256'],'source_html_sha256':doc['html_sha256'],'source_pdf_sha256':doc['pdf_sha256'],'zip_sha256':doc['zip']['sha256'],'manifest_path':proof.relative_to(ROOT).as_posix(),'manifest_sha256':sha(raw),'native_inspection_status':'PENDING','nonempty_destination_guard':'PASS','personally_viewed_pages':pages})
    rebuild=json.loads((OUT/'rebuild.json').read_text(encoding='utf-8'))
    for item in rebuild['grayscale_pages']: assert sha(Path(item['path']).read_bytes())==item['sha256']
    protected={}
    for p in [FOLDER/'2.1.3-textbook-plan.md',FOLDER.parent/'_chapter-plan.md',FOLDER/'build_pdf.py',FOLDER/'2.1.3-quality-ref.yaml']:
        raw=p.read_bytes(); assert raw==old(LESSONS,'40e5e250ba7dcbc9efbb8165bfb9b426a1b43c99',p.relative_to(LESSONS)); protected[p.relative_to(LESSONS).as_posix()]=sha(raw)
    assert not (FOLDER/'2.1.3-textbook-handoff.md').exists()
    for item in manifest['prerequisites']:
        p=Path(item['path']); raw=p.read_bytes(); lf=p.read_text(encoding='utf-8-sig').replace('\r\n','\n').replace('\r','\n').encode()
        assert sha(lf)==item['canonical_lf_sha256']; protected[p.relative_to(LESSONS).as_posix()]=sha(raw)
    baseline=json.loads((OUT/'pass0.json').read_text(encoding='utf-8'))
    assert all(sha((LESSONS/path).read_bytes())==pin for path,pin in baseline['hashes'].items())
    for item in manifest['input_sources']: assert sha(Path(item['path']).read_bytes())==item['sha256']
    emit('personal-bindings',{'reviewer':'paragraph_213_r7_independent_review','date':'2026-09-06','platform_candidate':'0dafc7969eb9ca2c8b79e2de5332ad1ee2f1ef38','lesson_candidate':'40e5e250ba7dcbc9efbb8165bfb9b426a1b43c99','observations_path':str(OUT/'personal-inspection.md'),'observations_sha256':sha((OUT/'personal-inspection.md').read_bytes()),'relocated_manifest_sha256':sha(manifest_path.read_bytes()),'documents':docs,'grayscale_personally_viewed':rebuild['grayscale_pages'],'standalone_figures_personally_viewed':[{'path':str(FOLDER/'_assets'/f'{n}.png'),'sha256':sha((FOLDER/'_assets'/f'{n}.png').read_bytes())} for n in ASSETS],'protected':protected,'prerequisites':manifest['prerequisites'],'native_source_bindings':manifest['input_sources'],'all24_outputs_equal_pass0':True,'handoff_absent':True})

if __name__=='__main__':
    {'pass0':pass0,'arithmetic':arithmetic,'delta':delta,'bindings':bindings}[sys.argv[1]]()
