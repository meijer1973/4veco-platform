"""Bound root adoption check. HOW TO ADAPT: new names, never overwrite past evidence."""
from pathlib import Path, PurePosixPath
from datetime import datetime, timezone
import base64, hashlib, io, json, os, subprocess, sys
from zipfile import ZipFile
from PIL import Image
P=Path(__file__).resolve().parents[2];L=P.parent/'4veco-lessen';R=P/'reports/sprints'
PREFIX='BOOK2-TEXTBOOK-PRODUCTION-1-BOOK-PROOF-ROOT';REVIEW='BOOK2-TEXTBOOK-PRODUCTION-1-BOOK-PROOF-REVIEW'
BASE='50db4c5da142812f47bf02219e393447caedecfb';LH='42996c60b4a93843dfe8488b8e5a3ea704871667'
SOURCE='e5edeb270120bc9ae041673267adddcd5575766f';IMPORT='10f29c9169205492b64ac9f2f30c127aa5325416'
def h(b):return hashlib.sha256(b).hexdigest()
def raw(p):return h(Path('\\\\?\\'+str(Path(p).resolve())).read_bytes())
def git(*args,cwd=P):return subprocess.check_output(['git',*args],cwd=cwd)
def read(name):return json.loads((R/(REVIEW+'-'+name+'.json')).read_bytes())
def save(name,obj):
    with (R/(PREFIX+'-'+name+'.json')).open('x',encoding='utf8',newline='\n') as f:json.dump(obj,f,ensure_ascii=False,indent=2);f.write('\n')
    print(name,raw(R/(PREFIX+'-'+name+'.json')),flush=True)
def run(name,args,env=None):
    started=datetime.now(timezone.utc).isoformat();r=subprocess.run(args,cwd=P,env=env,capture_output=True)
    rec={'argv':list(map(str,args)),'cwd':str(P),'started':started,'ended':datetime.now(timezone.utc).isoformat(),'exit_code':r.returncode,
        'stdout':r.stdout.decode('utf8',errors='replace'),'stderr':r.stderr.decode('utf8',errors='replace'),'stdout_base64':base64.b64encode(r.stdout).decode(),'stderr_base64':base64.b64encode(r.stderr).decode(),'stdout_sha256':h(r.stdout),'stderr_sha256':h(r.stderr)}
    save(name,rec);assert r.returncode==0,(name,r.returncode);return rec
def tracked(root):return [n.decode() for n in git('ls-files','-z',cwd=root).split(b'\0') if n]
def main():
    assert git('rev-parse','HEAD',cwd=L).decode().strip()==LH and git('status','--porcelain',cwd=L)==b''
    lessons={n:raw(L/n) for n in tracked(L)}
    imported=[]
    for n in git('ls-tree','-r','--name-only','-z',IMPORT,'--','reports/sprints').split(b'\0'):
        if not n:continue
        name=n.decode()
        if not name.startswith('reports/sprints/'+REVIEW+'-'):continue
        b=git('show',IMPORT+':'+name);assert raw(P/name)==h(b),name
        imported.append({'path':name,'commit':IMPORT,'sha256':h(b),'git_blob':git('rev-parse',IMPORT+':'+name).decode().strip()})
    assert len(imported)==32
    assert raw(R/(REVIEW+'-report.md'))=='7f3c8f5b0cd6057641e0c6237bf4b0f09787d19dc1570cbb5d58fae9b6a359f0'
    probes=read('probes-result');dispatch=read('dispatch-race-result');native=read('native-result')
    assert probes['reviewed_payload']==dispatch['reviewed_payload']==SOURCE
    assert len(probes['probes'])==25 and len(dispatch['probes'])==8
    assert all(r['status']=='PASS' for r in probes['probes']+dispatch['probes'])
    for r in probes['source_bindings']:
        assert raw(P/r['path'])==r['raw_sha256']==r['git_sha256']==h(git('show',SOURCE+':'+r['path']))
    for name,count in [('original-namespace',10),('original-pipelines',39),('original-common',7)]:
        r=read(name+'-process');assert r['exit_code']==0 and 'Ran '+str(count)+' tests' in r['stderr'] and '\nOK\n' in r['stderr'].replace('\r\n','\n')
    firstFailure=read('independent-probes-r1-process');assert firstFailure['exit_code']!=0 and 'WinError 1314' in firstFailure['stderr']
    assert any('SIMULATED' in r['probe'] for r in probes['probes'])
    for name in ['independent-probes-r2','dispatch-race-r1','foundation','durable','bundle']:assert read(name+'-process')['exit_code']==0
    archive=R/native['archive'];assert raw(archive)==native['archive_sha256']=='9fe93063368d98dc1d958930ee78bc13657fccbef1e932e454c42e4a90f7c63a'
    first='platform/reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/independent-r1/'
    second='platform/reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-INDEPENDENT/r2/'
    with ZipFile(archive) as z:
        names=z.namelist();assert len(names)==len(set(names))==len(native['member_bytes'])==50 and z.testzip() is None
        for n,value in native['member_bytes'].items():
            p=PurePosixPath(n);assert not p.is_absolute() and '..' not in p.parts and ':' not in n and '\\' not in n
            assert h(z.read(n))==value,n
        for n,value in native['all_original_inputs_preserved'].items():assert h(z.read(n))==value,n
        for n,value in native['first_proof_unchanged'].items():assert h(z.read(first+n))==value,n
        assert native['first_records']==native['second_records'] and len(native['first_records'])==2
        for r in native['first_records']:
            assert r['inspection_status']=='PENDING' and r['pages_inspected']==[] and r['visible_student_defects'] is None and r['inspected_at_normal_reading_scale'] is False
            assert len(r['rendered_pages'])==len(r['page_sha256'])==5
            for root in [first,second]:assert json.loads(z.read(root+r['artifact_id']+'/manifest.json'))==r
            for key,hkey in [('source_md','source_sha256'),('source_html','html_sha256'),('source_pdf','pdf_sha256')]:
                n=Path(r[key]).relative_to(native['original_fixture_root']).as_posix();assert h(z.read(n))==r[hkey]
            for item in r['assets']+r['assembly_inputs']:
                n=Path(item['path']).relative_to(native['original_fixture_root']).as_posix();assert h(z.read(n))==item['sha256']
        assert len(native['page_parity'])==10
        for r in native['page_parity']:
            n=r['artifact']+'/'+r['page'];x=z.read(first+n);y=z.read(second+n);assert x==y and h(x)==r['raw_sha256']
            with Image.open(io.BytesIO(x)) as xi,Image.open(io.BytesIO(y)) as yi:
                assert xi.size==yi.size and xi.convert('RGB').tobytes()==yi.convert('RGB').tobytes()
                assert h(xi.convert('RGB').tobytes())==r['decoded_rgb_sha256']
        assert len(native['native_six_files_unchanged'])==6
        for n,value in native['native_six_files_unchanged'].items():assert h(z.read(Path(n).relative_to(native['original_fixture_root']).as_posix()))==value
    save('custody',{'status':'PASS','review_payload':SOURCE,'imports':imported,'source_bindings':probes['source_bindings'],'independent_check_groups':33,'archive_members':50,'pending_manifests':4,'raw_rgb_page_pairs':10,'native_documents':6,'lesson_files':lessons,'root_personal_views':0})
    env={**os.environ,'PYTHONIOENCODING':'utf-8','PYTHONDONTWRITEBYTECODE':'1','PATH':'C:/msys64/mingw64/bin;C:/Python314;'+os.environ['PATH']}
    for name,args,count in [('namespace',['-m','unittest','discover','-s','build-scripts/content/book-2','-p','test_book_proof_namespace.py','-v'],10),('pipelines',['-m','unittest','discover','-s','build-scripts/content/book-2','-p','test_*pipeline.py','-v'],39),('common',['build-scripts/books/test_lib_book.py','-v'],7)]:
        r=run(name,['C:/Python314/python.exe',*args],env);assert 'Ran '+str(count)+' tests' in r['stderr'] and '\nOK\n' in r['stderr'].replace('\r\n','\n')
    for name,args in [('foundation',['build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','whole_book_assembly']),('durable',['build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']),('bundle',['build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1'])]:run(name,['node',*args])
    assert {n:raw(L/n) for n in tracked(L)}==lessons and git('status','--porcelain',cwd=L)==b''
    for r in imported:assert raw(P/r['path'])==r['sha256']
    changed=[n.decode() for n in git('diff','--name-only','-z',BASE).split(b'\0') if n]
    assert all(n.startswith('reports/sprints/'+REVIEW+'-') or n.startswith('reports/sprints/'+PREFIX+'-') or n in ['reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.md','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.jsonl'] for n in changed)
    save('result',{'status':'PASS_ROOT_TECHNICAL_ADOPTION_CHECK','source_payload':SOURCE,'import_count':len(imported),'root_native_tests':56,'independent_groups':33,'archived_raw_rgb_pairs':10,'lesson_files_unchanged':len(lessons),'historical_source_proof_git_diff_unchanged':True,'root_personal_views':0,'student_assembly_acceptance':'NOT_GRANTED','fullCI':'PENDING'})
if __name__=='__main__':main()
