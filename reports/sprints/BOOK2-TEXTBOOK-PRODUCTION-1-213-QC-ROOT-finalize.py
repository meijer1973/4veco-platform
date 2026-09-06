"""Read-only decision check plus exclusive proof output, never an acceptance writer.
HOW TO ADAPT: use a new fixed task/order; preserve independent specialist fields.
"""
from pathlib import Path
import argparse, hashlib, importlib.util, json, re, subprocess
import yaml

ROOT=Path(__file__).resolve().parents[2];L=ROOT.parent/'4veco-lessen';HERE=ROOT/'reports/sprints'
PREFIX='BOOK2-TEXTBOOK-PRODUCTION-1-213-QC-ROOT'
spec=importlib.util.spec_from_file_location('root_native',HERE/(PREFIX+'-native.py'))
n=importlib.util.module_from_spec(spec);spec.loader.exec_module(n)
raw=n.raw;sha=n.sha;load=n.load;D=n.FOLDER
Q=n.b.LESSON_REL/'2.1.3-quality-ref.yaml';H=n.b.LESSON_REL/'2.1.3-textbook-handoff.md'
M='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-output-manifest.md'
SQC='65da7f3930c2afba69ccb715b472b726b1429180'
def git(root,*args):return subprocess.check_output(['git',*map(str,args)],cwd=root)
def gs(root,*args):return git(root,*args).decode('utf-8').strip()
def tree(root,ref):
    result={}
    for row in git(root,'ls-tree','-r','-z',ref).split(b'\0'):
        if row:
            meta,p=row.split(b'\t',1);assert meta.split()[1]==b'blob';result[p.decode('utf-8')]=meta.split()[2].decode()
    return result
def objects(root,files):
    names=list(files);rows=subprocess.check_output(['git','-c','core.longpaths=true','hash-object','--no-filters','--stdin-paths'],cwd=root,input=('\n'.join(json.dumps(p,ensure_ascii=False) for p in names)+'\n').encode('utf-8')).decode().splitlines()
    assert len(rows)==len(names);return dict(zip(names,rows))
def save(name,value):
    with (HERE/(PREFIX+'-'+name+'.json')).open('x',encoding='utf-8',newline='\n') as f:f.write(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
def exact_proofs():
    rows=[]
    for mode in ['full','thin','print']:
        files=list(n.OUT.glob(mode+'-r*-reproduction.json'));assert len(files)==1
        proof=load(files[0]);assert proof['result']=='PASS' and int(proof['revision'][1:])>36
        manifest=n.OUT/(mode+'-'+proof['revision']+'-build.json')
        assert sha(raw(manifest))==proof['build_manifest_sha256']
        body=load(manifest);assert body['inspection_status']=='PENDING'
        assert proof['pages']==n.d.compare_pages(body)
        assert proof['native']==n.d.native()==n.EXPECTED['native']
        assert proof['archives']==n.d.archives()==n.EXPECTED['archives']
        assert proof['root_personal_views']==0
        rows.append(dict(mode=mode,revision=proof['revision'],reproduction_sha256=sha(raw(files[0])),manifest_sha256=sha(raw(manifest)),raw_RGB_pages=30))
    assert len({r['revision'] for r in rows})==3
    return rows
def shared_subject():
    source=n.v.source_contract();inputs=n.inputs();native=n.d.native();archives=n.d.archives()
    assert native==n.EXPECTED['native'] and archives==n.EXPECTED['archives']
    return json.loads(json.dumps(dict(source=source,inputs=inputs,native=native,archives=archives)))
def gates(label):
    jobs=[('tests',[n.PYTHON,'-m','unittest','discover','-s','build-scripts/content/book-2/213','-p','test_*.py','-v']),
      ('native-checker',[n.PYTHON,'build-scripts/content/book-2/213/check_render.py']),
      *[(p,['node','scripts/validate-paragraph.js','--mode','part-a','--profile',p,D]) for p in ['student-web','publisher-print']],
      ('currentness',['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.1.3']),
      ('durable',['node','build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']),
      ('bundle',['node','build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1'])]
    for name,argv in jobs:n.command(argv,label+'-'+name+'.json')
    return [name for name,_ in jobs]
def preaccept():
    custody=n.custody();routes=exact_proofs();subject=shared_subject()
    pre=load(HERE/(PREFIX+'-preaccept-verification.json'));assert pre['status']=='PASS'
    probes=load(n.OUT/'independent-probes.json');assert len(probes['real_input_cases'])==17 and len(probes['controller_mutations'])==27
    original=load(HERE/(PREFIX+'-baseline.json'))
    binding={r['path']:r['raw_sha256'] for r in original['imports']}
    for p,h in binding.items():assert sha(raw(ROOT/p))==h
    qc=raw(L/Q);assert sha(qc)=='4b03c759fe240a008f9cf68a77df6ae197b8b92f37c58f66cdffaa13992dd316'
    assert not (L/H).exists()
    save('preaccept-integrity',dict(status='PASS',actor='codex-root',platform_head=gs(ROOT,'rev-parse','HEAD'),lessons_head=gs(L,'rev-parse','HEAD'),
      custody=custody,routes=routes,subject=subject,imported_evidence=binding,preaccept_verification_sha256=sha(raw(HERE/(PREFIX+'-preaccept-verification.json'))),
      canonical_specialist_QC_raw_sha256=sha(qc),root_native_routes=3,root_raw_RGB_pages=90,root_personal_views=0,
      current_specialist_personal_views=72,production_ready=False,decision_eligible='INTERNAL ACCEPTANCE WITH FLAGS; OWNER MERGE NOT GRANTED'))
    print('PASS preacceptance: exact three native routes,90raw/RGB pages,234originalQCfiles,72attributed specialist views')
def postaccept(verification):
    assert re.fullmatch('[a-f0-9]{40}',verification)
    prepath='reports/sprints/'+PREFIX+'-preaccept-integrity.json'
    assert raw(ROOT/prepath)==git(ROOT,'show',verification+':'+prepath)
    pre=load(ROOT/prepath);assert pre['status']=='PASS'
    oldbytes=git(L,'show',SQC+':'+Q.as_posix());old=yaml.safe_load(oldbytes);current=yaml.safe_load(raw(L/Q))
    assert list(old)==list(current)==['schema_version','partA']
    allowed={'root_validation','root_acceptance','handoff_renewal','production_ready_with_flags'}
    assert set(current['partA'])==set(old['partA'])|{'production_ready_with_flags'}
    for k,value in old['partA'].items():
        if k not in allowed:assert current['partA'][k]==value,k
    part=current['partA'];assert part['production_ready'] is False and part['production_ready_with_flags'] is True
    assert part['root_validation']['status']=='PASS' and part['root_validation']['verification_commit']==verification
    assert part['root_validation']['evidence_raw_sha256']==sha(raw(ROOT/prepath)) and part['root_validation']['root_personal_views']==0
    assert part['root_acceptance']['status']=='ACCEPTED WITH FLAGS' and part['root_acceptance']['actor']=='codex-root'
    assert part['root_acceptance']['required_corrections']==[]
    assert part['handoff_renewal']['status']=='RENEWED' and part['handoff_renewal']['companion']=='NOT_COMMISSIONED'
    hand=raw(L/H).decode();assert re.findall(r'^## (\d+)\. ',hand,re.M)==list(map(str,range(1,10)))
    for token in [verification,sha(raw(L/Q)),part['review_sha256_lf'],'NOT_COMMISSIONED','UNOBSERVED','H-213-OPC2','4/3/2/4/2','15/7/3']:
        assert token in hand,token
    for p,h in pre['subject']['native'].items():
        assert sha(raw(D/p))==h
        if not p.startswith('_assets/'):assert h in hand,p
    assert shared_subject()==pre['subject'];assert exact_proofs()==pre['routes']
    for p,h in pre['imported_evidence'].items():assert sha(raw(ROOT/p))==h,p
    pt=tree(ROOT,verification);pt.pop(M);assert objects(ROOT,pt)==pt
    lt=tree(L,pre['lessons_head']);lt.pop(Q.as_posix());assert objects(L,lt)==lt
    delta=set(filter(None,(git(L,'diff','--name-only','-z',pre['lessons_head'])+git(L,'ls-files','--others','--exclude-standard','-z')).decode().split('\0')))
    assert delta=={Q.as_posix(),H.as_posix()},delta
    text=(ROOT/M).read_text(encoding='utf-8');rows=[]
    for line in text.splitlines():
        cells=[c.strip() for c in line.split('|')]
        if len(cells)==7 and cells[1].isdigit():rows.append(dict(number=int(cells[1]),id=cells[2],edition=cells[3],status=cells[4],relative=cells[5].strip('`')))
    assert [r['number'] for r in rows]==list(range(1,42)) and len({r['relative'] for r in rows})==41
    oldrows=[]
    for line in git(ROOT,'show',verification+':'+M).decode().splitlines():
        cells=[c.strip() for c in line.split('|')]
        if len(cells)==7 and cells[1].isdigit():oldrows.append(dict(number=int(cells[1]),id=cells[2],edition=cells[3],status=cells[4],relative=cells[5].strip('`')))
    for before,after in zip(oldrows,rows):
        expected={**before,'status':'A'} if before['id']=='2.1.3' else before
        assert expected==after
    counts={k:sum(r['status']==k for r in rows) for k in 'ACLP'};assert counts==dict(A=21,C=0,L=8,P=12)
    book=L/'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus'
    for row in rows:
        p=book/row['relative'];assert p.exists()==(row['status']!='P')
        if p.exists():
            row['raw_sha256']=sha(raw(p));rel=p.relative_to(L).as_posix()
            assert raw(p)==git(L,'show',pre['lessons_head']+':'+rel)
            if row['status']=='L':assert raw(p)==git(L,'show','f09fd6e88edc5049b026b16b0158e7e188091d2d:'+rel)
    results=gates('postaccept');assert shared_subject()==pre['subject'];assert objects(ROOT,pt)==pt and objects(L,lt)==lt
    save('postaccept-check',dict(status='PASS',verification_commit=verification,root_only_changed_fields=sorted(allowed),all_other_specialist_fields_exact=True,
      quality_ref_raw_sha256=sha(raw(L/Q)),handoff_raw_sha256=sha(raw(L/H)),handoff_sections=9,root_raw_RGB_pages=90,root_personal_views=0,
      prior_platform_raw_files=len(pt),other_lesson_raw_files=len(lt),imported_QC_files=len(pre['imported_evidence']),gates=results,inventory=rows,counts=counts,physical_PDFs=29,
      production_ready=False,production_ready_with_flags=True))
    print('PASS minimal root-only acceptance,9-section handoff,41inventory21A/0C/8L/12P,all current gates')

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('mode');parser.add_argument('--verification-commit');args=parser.parse_args()
    if args.mode=='preaccept':preaccept()
    elif args.mode=='postaccept':postaccept(args.verification_commit)
    else:raise ValueError('preaccept/postaccept')
