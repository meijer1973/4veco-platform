"""Independent review probes. Technical fixtures only; no educational authority.
HOW TO ADAPT: use a new review label/output namespace; never rebind this evidence.
"""
from __future__ import annotations
import ast, contextlib, hashlib, json, os, runpy, shutil, subprocess, sys, tempfile, unittest, zipfile
from pathlib import Path
from unittest.mock import patch
P=Path(__file__).resolve().parents[2]
L=P.parent/'4veco-lessen'
PREFIX='BOOK2-TEXTBOOK-PRODUCTION-1-BOOK-PROOF-REVIEW'
OUT=P/'reports/sprints'
PAYLOAD='e5edeb270120bc9ae041673267adddcd5575766f'
BASE='8bd4bd66fa0352a770f5069c50ee1bbdf2f651bd'
sys.path[:0]=[str(P/'build-scripts/content/book-2'),str(P/'build-scripts/books')]
import book_pipeline as bp
import lib_book
import test_book_pipeline as original_fixtures
from print_pipeline import digest
from PIL import Image
from pypdf import PdfReader

rows=[]
def need(ok,message):
    if not ok: raise AssertionError(message)
def passed(name,**data): rows.append({'probe':name,'status':'PASS',**data})
def snapshot(root): return {p.relative_to(root).as_posix():digest(p) for p in root.rglob('*') if p.is_file()}
def save(label,obj):
    with (OUT/(PREFIX+'-'+label+'.json')).open('x',encoding='utf8',newline='\n') as f: json.dump(obj,f,ensure_ascii=False,indent=2);f.write('\n')
@contextlib.contextmanager
def fixture():
    f=original_fixtures.BookPipelineTests()
    f.setUp()
    try: yield f
    finally: f.doCleanups()
def dest(f,name):return f.platform/'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1'/name
def rejection(fn,pattern=None):
    try:fn()
    except (ValueError,FileNotFoundError,subprocess.CalledProcessError) as error:
        if pattern:need(pattern in str(error),str(error))
        return type(error).__name__+': '+str(error)
    raise AssertionError('Expected fail-closed rejection')
real_run=subprocess.run
def gates(args,**kwargs):
    if args[0]=='node':return subprocess.CompletedProcess(args,0)
    return real_run(args,**kwargs)

def source_bindings():
    files=['build-scripts/books/build-book.py','build-scripts/books/lib_book.py','build-scripts/content/book-2/book_pipeline.py','build-scripts/content/book-2/test_book_proof_namespace.py']
    bindings=[]
    for s in files:
        original=subprocess.check_output(['git','show',PAYLOAD+':'+s],cwd=P)
        current=(P/s).read_bytes()
        need(current.replace(b'\r\n',b'\n')==original.replace(b'\r\n',b'\n'),'Exact source binding '+s)
        bindings.append({'path':s,'raw_sha256':hashlib.sha256(current).hexdigest(),'git_sha256':hashlib.sha256(original).hexdigest()})
    old=subprocess.check_output(['git','show',BASE+':build-scripts/books/lib_book.py'],cwd=P).decode()
    now=(P/'build-scripts/books/lib_book.py').read_text(encoding='utf8')
    need(old[:old.index('def build_book(')]==now[:now.index('def build_book(')],'All other common functions/CSS unchanged')
    need(old[old.index('    versions = detect_toolchain_versions()',old.index('def build_book(')):]==now[now.index('    versions = detect_toolchain_versions()',now.index('def build_book(')):],'Exact legacy branch preserved')
    oldbp=ast.parse(subprocess.check_output(['git','show',BASE+':build-scripts/content/book-2/book_pipeline.py'],cwd=P))
    nowbp=ast.parse((P/'build-scripts/content/book-2/book_pipeline.py').read_bytes())
    oldfunc={n.name:ast.dump(n) for n in oldbp.body if isinstance(n,ast.FunctionDef) and n.name!='build_book'}
    newfunc={n.name:ast.dump(n) for n in nowbp.body if isinstance(n,ast.FunctionDef) and n.name not in ['build_book','_unused_proof_root']}
    need(oldfunc==newfunc,'Original preparation/authority-input helpers unchanged')
    originals=['build-scripts/content/book-2/'+s for s in ['print_pipeline.py','chapter_pipeline.py','test_print_pipeline.py','test_chapter_pipeline.py','test_book_pipeline.py']]+['build-scripts/books/test_lib_book.py','build-scripts/books/lib_book.test.js']
    need(subprocess.check_output(['git','diff','--name-only',BASE,PAYLOAD,'--',*originals],cwd=P)==b'','Original sources/tests modified')
    passed('Exact four payload files and all original preparation/default/Book1/test bytes',bindings=bindings,originals=originals)
    return bindings

def early_paths():
    with fixture() as f:
        prefix=f.platform/'reports/sprints'
        for name,p in [('outside',Path(f.temp.name)/'escape'),('broad platform',f.platform/'reports'),
            ('broad standard root',dest(f,'unused').parent),('wrong task',prefix/'WRONG-r1'),
            ('prefix lookalike',prefix/'BOOK2-TEXTBOOK-PRODUCTION-10-r1'),
            ('traversal escape',dest(f,'x')/'../../../../escape')]:
            before=snapshot(Path(f.temp.name))
            with patch.object(bp,'prepare_book') as prep,patch.object(bp,'build_document') as build:
                error=rejection(lambda:bp.build_book(f.manifest,f.lessons,f.platform,proof_root=p))
                prep.assert_not_called();build.assert_not_called()
            need(snapshot(Path(f.temp.name))==before,name+' mutated input');passed('Early path rejection: '+name,error=error)
        for name,kind in [('empty','dir'),('populated','populated'),('plain-file','file')]:
            p=dest(f,name);p.parent.mkdir(parents=True,exist_ok=True)
            if kind=='dir':p.mkdir()
            elif kind=='populated':p.mkdir();(p/'original.txt').write_text('ORIGINAL EVIDENCE',encoding='utf8')
            elif kind=='file':p.write_bytes(b'ORIGINAL FILE')
            before=snapshot(Path(f.temp.name))
            with patch.object(bp,'prepare_book') as prep:
                error=rejection(lambda:bp.build_book(f.manifest,f.lessons,f.platform,proof_root=p),'already exists');prep.assert_not_called()
            need(snapshot(Path(f.temp.name))==before,'Occupied evidence changed');passed('Occupied '+name,error=error)
        # Native symbolic links require a Windows privilege absent on this host;
        # original r1 WinError1314 is preserved. This is a contract simulation,
        # not a claim that a native dangling symlink was created or inspected.
        p=dest(f,'dangling-link-contract');original_is_symlink=Path.is_symlink
        with patch.object(Path,'is_symlink',new=lambda q:True if q==p else original_is_symlink(q)),patch.object(bp,'prepare_book') as prep:
            error=rejection(lambda:bp.build_book(f.manifest,f.lessons,f.platform,proof_root=p),'already exists');prep.assert_not_called()
        passed('Dangling-symlink contract (SIMULATED; native WinError1314 retained)',error=error)
        outside=Path(f.temp.name)/'outside';outside.mkdir()
        link=dest(f,'linked-parent')
        junction=real_run(['cmd.exe','/c','mklink','/J',str(link),str(outside)],capture_output=True,text=True,check=True)
        need(link.is_junction(),'Expected real Windows directory junction')
        with patch.object(bp,'prepare_book') as prep:
            error=rejection(lambda:bp.build_book(f.manifest,f.lessons,f.platform,proof_root=link/'fresh'),'platform task evidence');prep.assert_not_called()
        need(not(outside/'fresh').exists(),'Junction escape wrote');passed('Resolved native parent directory-junction escape',error=error,junction_stdout=junction.stdout)
        for p in [dest(f,'accepted'),prefix/'BOOK2-TEXTBOOK-PRODUCTION-1-REVIEW/r1']:
            before=snapshot(Path(f.temp.name));need(bp._unused_proof_root(p,f.platform)==p.resolve(),'Allowed path rejected')
            need(not p.exists() and snapshot(Path(f.temp.name))==before,'Validation writes');passed('Allowed path validation is read-only',path=str(p))
        previous=Path.cwd()
        try:
            os.chdir(f.platform);relative=Path('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-REVIEW/relative')
            need(bp._unused_proof_root(relative,f.platform)==(f.platform/relative).resolve(),'Relative cwd semantics')
        finally:os.chdir(previous)
        passed('Relative path uses caller cwd without changing global runtime')

def gates_and_collisions():
    for denied_index in [1,2]:
        with fixture() as f:
            before=snapshot(Path(f.temp.name));calls=[]
            def deny(args,**kwargs):
                if args[0]=='node':
                    calls.append(args)
                    if len(calls)==denied_index:raise subprocess.CalledProcessError(23,args)
                    return subprocess.CompletedProcess(args,0)
                return real_run(args,**kwargs)
            with patch.object(bp.subprocess,'run',side_effect=deny),patch.object(bp,'build_document') as build:
                error=rejection(lambda:bp.build_book(f.manifest,f.lessons,f.platform,proof_root=dest(f,'deny')));build.assert_not_called()
            need(len(calls)==denied_index and snapshot(Path(f.temp.name))==before and not dest(f,'deny').exists(),'Denied gate wrote')
            passed('Denied actual gate slot '+str(denied_index),calls=calls,error=error)
    for change in ['manifest','front','chapter']:
        with fixture() as f:
            p=dest(f,'input-drift');book_before=snapshot(f.book)
            changed=f.manifest if change=='manifest' else f.platform/f.spec['matter']['boek']['front']['path'] if change=='front' else f.book/'2.1 Hoofdstuk Kosten en opbrengsten/2.1 Kosten en opbrengsten – hoofdstuk.md'
            def mutate(args,**kwargs):
                if args[0]=='node':
                    changed.write_bytes(changed.read_bytes()+b'\nCHANGED DURING AUTHORITY\n')
                    return subprocess.CompletedProcess(args,0)
                return real_run(args,**kwargs)
            with patch.object(bp.subprocess,'run',side_effect=mutate),patch.object(bp,'build_document') as build:
                error=rejection(lambda:bp.build_book(f.manifest,f.lessons,f.platform,proof_root=p),'changed after preflight');build.assert_not_called()
            need(not p.exists(),'Stale input reserved namespace')
            need(not list(f.book.glob('Boek 2*')),'Stale input wrote aggregate')
            passed('Input drift during authority: '+change,error=error)
    for collision in ['preflight-empty','preflight-file','atomic']:
        with fixture() as f:
            p=dest(f,collision);p.parent.mkdir(parents=True);before=snapshot(f.book);real_mkdir=Path.mkdir
            def run(args,**kwargs):
                if args[0]=='node':
                    if collision=='preflight-empty':p.mkdir(exist_ok=True)
                    if collision=='preflight-file':p.write_bytes(b'COMPETING OWNER')
                    return subprocess.CompletedProcess(args,0)
                return real_run(args,**kwargs)
            def mkdir(target,*args,**kwargs):
                if target==p and collision=='atomic':real_mkdir(target)
                return real_mkdir(target,*args,**kwargs)
            with patch.object(bp.subprocess,'run',side_effect=run),patch.object(Path,'mkdir',new=mkdir),patch.object(bp,'build_document') as build:
                error=rejection(lambda:bp.build_book(f.manifest,f.lessons,f.platform,proof_root=p));build.assert_not_called()
            need(snapshot(f.book)==before,'Collision changed book')
            if collision=='preflight-file':need(p.read_bytes()==b'COMPETING OWNER','Competing owner overwritten')
            passed('Collision before aggregate writes: '+collision,error=error)
    with fixture() as f:
        p=dest(f,'render-failed')
        with patch.object(bp.subprocess,'run',side_effect=gates),patch.object(bp,'build_document',side_effect=ValueError('INJECTED RENDER FAILURE')):
            error=rejection(lambda:bp.build_book(f.manifest,f.lessons,f.platform,proof_root=p),'INJECTED RENDER FAILURE')
        need(p.exists(),'Failed renderer did not consume namespace');after=snapshot(Path(f.temp.name))
        with patch.object(bp,'prepare_book') as prep:
            rejection(lambda:bp.build_book(f.manifest,f.lessons,f.platform,proof_root=p),'already exists');prep.assert_not_called()
        need(snapshot(Path(f.temp.name))==after,'Retry altered failed capture');passed('Failed renderer consumes namespace; retry rejects without writes',error=error)

def native():
    with fixture() as f:
        assets=f.book/'2.1 Hoofdstuk Kosten en opbrengsten/_assets';assets.mkdir()
        svg=assets/'2.1.1_fig_1.svg'
        svg.write_text('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="#17365d"/></svg>',encoding='utf8')
        Image.new('RGB',(120,80),'#17365d').save(svg.with_suffix('.png'))
        source=assets.parent/'2.1 Kosten en opbrengsten – hoofdstuk.md'
        source.write_text(source.read_text(encoding='utf8')+'\n![Technical fixture only](_assets/2.1.1_fig_1.svg)\n',encoding='utf8')
        f.spec['chapters'][0]['hoofdstuk_sha256']=digest(source)
        f.spec['chapters'][0]['asset_sha256']['hoofdstuk']={p.name:digest(p) for p in assets.iterdir()};f.save()
        inputs=snapshot(Path(f.temp.name));gatecalls=[]
        def run(args,**kwargs):
            if args[0]=='node':gatecalls.append(args);return subprocess.CompletedProcess(args,0)
            return real_run(args,**kwargs)
        firstroot=dest(f,'independent-r1');secondroot=f.platform/'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-INDEPENDENT/r2'
        with patch.object(bp.subprocess,'run',side_effect=run):
            first=bp.build_book(f.manifest,f.lessons,f.platform,proof_root=firstroot)
            outputbytes={r[k]:Path(r[k]).read_bytes() for r in first for k in ['source_md','source_html','source_pdf']}
            originalproof=snapshot(firstroot)
            second=bp.build_book(f.manifest,f.lessons,f.platform,proof_root=secondroot)
        need(len(gatecalls)==4,'Exactly two original fixture authority calls per build')
        need(snapshot(firstroot)==originalproof,'First proof changed');need(first==second,'Distinct namespaces changed records')
        need(all(Path(p).read_bytes()==b for p,b in outputbytes.items()),'Native output drift')
        need(all(digest(Path(f.temp.name)/p)==sha for p,sha in inputs.items()),'Native build changed original inputs')
        page_rows=[]
        for left,right in zip(first,second):
            need(left['inspection_status']=='PENDING' and left['pages_inspected']==[] and left['visible_student_defects'] is None and left['inspected_at_normal_reading_scale'] is False,'Invented visual acceptance')
            need(len(left['rendered_pages'])==len(PdfReader(left['source_pdf']).pages),'Incomplete page capture')
            for root in [firstroot,secondroot]:
                need(json.loads((root/left['artifact_id']/'manifest.json').read_bytes())==left,'Manifest mismatch')
            for relative in left['rendered_pages']:
                x=firstroot/left['artifact_id']/relative;y=secondroot/right['artifact_id']/relative
                with Image.open(x) as a,Image.open(y) as b:
                    need(a.size==b.size and a.convert('RGB').tobytes()==b.convert('RGB').tobytes(),'Decoded pixels differ')
                    pixelsha=hashlib.sha256(a.convert('RGB').tobytes()).hexdigest()
                need(digest(x)==digest(y),'Raw page bytes differ');page_rows.append({'artifact':left['artifact_id'],'page':relative,'raw_sha256':digest(x),'decoded_rgb_sha256':pixelsha})
            # Byte-exact contact sheet copies are evidence, not image edits.
            shutil.copyfile(firstroot/left['artifact_id']/'contact-sheet.png',OUT/(PREFIX+'-'+left['artifact_id']+'-contact.png'))
        for p in assets.iterdir():need(digest(p)==digest(f.book/'_assets'/p.name),'Asset copies drift')
        archive=OUT/(PREFIX+'-native-fixture.zip')
        member_hashes=snapshot(Path(f.temp.name))
        with zipfile.ZipFile(archive,'x',compression=zipfile.ZIP_DEFLATED) as z:
            for name in sorted(member_hashes):z.write(Path(f.temp.name)/name,name)
        with zipfile.ZipFile(archive) as z:
            need(z.testzip() is None and len(z.namelist())==len(set(z.namelist()))==len(member_hashes),'Archive integrity')
            for name,sha in member_hashes.items():need(not Path(name).is_absolute() and '..' not in Path(name).parts and hashlib.sha256(z.read(name)).hexdigest()==sha,'Safe byte-exact member')
        result={'original_fixture_root':f.temp.name,'archive':archive.name,'archive_sha256':digest(archive),'member_bytes':member_hashes,'mapping':'Archive members are paths relative to original_fixture_root; embedded manifests retain original absolute fixture paths unchanged. No real lesson authority.',
                'first_records':first,'second_records':second,'first_proof_unchanged':originalproof,'native_six_files_unchanged':{p:hashlib.sha256(b).hexdigest() for p,b in outputbytes.items()},'page_parity':page_rows,'fixture_node_gate_calls':gatecalls,'all_original_inputs_preserved':inputs,'temp_fixture_cleanup':'TemporaryDirectory cleanup runs after evidence archive completion'}
        save('native-result',result);passed('Actual native double-build different permitted roots, exact six files/assets/all pages/first proof',pages=len(page_rows),archive=archive.name)

def main():
    binding=source_bindings();early_paths();gates_and_collisions();native()
    save('probes-result',{'reviewer':'paragraph_231_specialist_qc','reviewed_payload':PAYLOAD,'status':'PASS_TECHNICAL_PROBES','probes':rows,'source_bindings':binding,'real_lesson_edits':0,'root_acceptance':'PENDING','student_visual_acceptance':'NOT_ASSESSED','fullCI':'PENDING'})
    print(json.dumps({'status':'PASS_TECHNICAL_PROBES','count':len(rows),'probes':[r['probe'] for r in rows]},indent=2))
if __name__=='__main__':main()
