"""Root acceptance evidence checks, never a QC/handoff writer.
HOW TO ADAPT: require a new exact subject, preserve specialist metadata and use
the actual published full/thin/direct routes, not hardcoded success markers.
"""
import argparse, hashlib, importlib.util, json, os, re, subprocess, sys
from pathlib import Path
from PIL import Image
import yaml
sys.dont_write_bytecode=True
P=Path(__file__).resolve().parents[2];L=P.parent/'4veco-lessen';PRE='BOOK2-TEXTBOOK-PRODUCTION-1-224-QC-ROOT';SOURCE='432a820c030aa9bd7477e7dfb334f6e07388839e'
spec=importlib.util.spec_from_file_location('root224native',P/'reports/sprints'/(PRE+'-native.py'));n=importlib.util.module_from_spec(spec);spec.loader.exec_module(n)
c=n.c;E=n.E;FOREIGN='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-224-QC-CURRENT-';OUT='reports/sprints/'+PRE+'-';b=c.builder();QC=(b.LESSON_REL/'2.2.4-quality-ref.yaml').as_posix();HAND=(b.LESSON_REL/'2.2.4-textbook-handoff.md').as_posix();M='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-output-manifest.md'
INDEXES={f'reports/github-agent-index-{r}.{e}' for r in ('platform','lessen') for e in ('json','md')}
def git(root,*args):return subprocess.check_output(['git',*args],cwd=root)
def head(root):return git(root,'rev-parse','HEAD').decode().strip()
def rawtree(root,ref,exclude=()):
    pairs=[]
    for row in git(root,'ls-tree','-r','-z',ref).split(b'\0'):
        if row:
            meta,name=row.split(b'\t',1);name=name.decode('utf8')
            if name not in exclude:pairs.append((name,meta.split()[-1].decode()))
    result=subprocess.run(['git','-c','core.longpaths=true','hash-object','--no-filters','--stdin-paths'],cwd=root,input=('\n'.join(json.dumps(name,ensure_ascii=False) for name,_ in pairs)+'\n').encode(),capture_output=True)
    assert result.returncode==0,result.stderr
    assert result.stdout.decode().splitlines()==[blob for _,blob in pairs]
    return {'ref':ref,'files':len(pairs),'excluded':sorted(exclude),'all_raw_Git_exact':True,'all_path_blob_sha256':c.sha(json.dumps(pairs,ensure_ascii=False).encode())}
def exact_routes():
    n.guard(SOURCE);routes=[]
    for label in ('full','thin','direct'):
        paths=[f for f in E.glob('224-'+label+'-r*-finished.json') if re.fullmatch('224-'+label+r'-r[1-9][0-9]*-finished\.json',f.name)];assert len(paths)==1,paths
        file=paths[0];revision=re.search(r'-(r[1-9][0-9]*)-finished',file.name)[1];v=c.read(file);assert v['status']=='PASS' and int(revision[1:])>13
        stem=E/f'224-{label}-{revision}';manifest=Path(str(stem)+'-manifest.json');j=c.read(manifest)
        assert c.digest(manifest)==v['manifest_sha256'];assert j['inspection_status']=='PENDING'
        assert c.pages(j)==v['pages'] and len(v['pages'])==20
        assert c.figure_pixels()==v['figure_pixels'] and v['native_files']==c.native_expected()
        for suffix in ('','-specialist','-durable'):
            base=str(stem)+suffix;finished=c.read(base+'-command-finished.json');assert finished['exit_code']==0
            assert c.digest(base+'-stdout.txt')==finished['stdout_sha256'] and c.digest(base+'-stderr.txt')==finished['stderr_sha256']
        prod=c.read(E/f'224-root-production-{label}-{revision}-command-finished.json');assert prod['exit_code']==0
        assert c.read(E/f'224-root-source-{label}-{revision}.json')==n.guard(SOURCE)
        routes.append({'label':label,'revision':revision,'manifest_sha256':c.digest(manifest),'finished_sha256':c.digest(file),'raw_RGB_pages':20,'native_files':15})
    assert len({r['revision'] for r in routes})==3
    return routes
def specialist_views():
    path=P/(FOREIGN+'evidence/224-personal-inspection.json');assert c.digest(path)=='cb932ac10a5035e75e1e9aac10d975de4b205adc886da690559d8b658e9328de'
    j=c.read(path);assert j['actor']=='paragraph_214_builder' and j['actual_independent_views']==48 and j['transferred_prior_views']==0 and len(j['views'])==24
    fullpaths=[f for f in E.glob('224-full-r*-finished.json') if re.fullmatch(r'224-full-r[1-9][0-9]*-finished\.json',f.name)];assert len(fullpaths)==1
    full=c.read(fullpaths[0])['pages'];lookup={(r['kind'],r['page']):r for r in full};rows=[]
    for row in j['views']:
        assert row['color_personally_inspected'] and row['grayscale_personally_inspected'] and row['visible_student_defects']==0 and row['personal_observation']
        if 'page' in row:current=Path(lookup[(row['kind'],row['page'])]['path'])
        else:current=L/b.LESSON_REL/'_assets'/f"2.2.4_ex_{row['figure']}.png"
        assert c.digest(current)==row['raw_sha256']
        rel=row['gray_path'].replace('\\','/').split('/4veco-platform/',1)[1];assert rel.startswith(FOREIGN+'evidence/') and '..' not in Path(rel).parts
        gray=P/rel;assert c.digest(gray)==row['gray_sha256']
        with Image.open(c.data(current)) as im,Image.open(c.data(gray)) as gm:
            assert im.convert('L').convert('RGB').tobytes()==gm.convert('RGB').tobytes()
        rows.append({'source':str(current),'specialist_gray_path':rel,'raw_sha256':row['raw_sha256'],'gray_sha256':row['gray_sha256'],'decoded_gray_equal_root_color_conversion':True})
    return {'actor':j['actor'],'attributed_personal_views':48,'root_personal_views':0,'whole_record_sha256':c.digest(path),'matched':rows}
def preaccept():
    routes=exact_routes();views=specialist_views();probes=c.read(E/'224-independent-probes-r2.json');assert probes['status']=='PASS'
    assert len(probes['actual_guard_entry_negatives'])==109 and len(probes['whole_source_shared_controller_negatives'])==21 and len(probes['math_and_wrong_alternatives'])==40
    own=c.read(E/'224-root-source-namespace-probes.json');assert own['status']=='PASS' and len(own['cases'])==11
    assert c.read(E/'224-gates-pre.json')['status']=='PASS'
    for command in c.read(E/'224-gates-pre.json')['commands']:assert command['exit_code']==0
    # Root owns this read-only current-custody execution, including exact imports.
    result,execution=c.command('root-custody',['node',str(P/(OUT+'check.cjs')),'custody'],E/'224-preaccept-custody')
    assert execution['exit_code']==0
    assert c.digest(L/QC)=='b54386dcbd4ede38afd24f37a6a751d65054ace1807474240ff723b3123e08ca' and not (L/HAND).exists()
    baseline=c.read(P/(OUT+'baseline.json'));assert c.digest(P/M)==baseline['output_manifest']['raw_sha256']
    c.save(P/(OUT+'preaccept-integrity.json'),{'status':'PASS','actor':'codex-root','P':head(P),'L':head(L),'root_source_commit':SOURCE,'source':n.guard(SOURCE),'native':c.native_expected(),'release':c.release_guard(),'routes':routes,'specialist_views':views,'custody':json.loads(result.stdout),'raw_current_tracked':{'platform':rawtree(P,head(P)),'lessons':rawtree(L,head(L))},'independent_imports_sha256':c.digest(P/(OUT+'verification.json')),'root_native_routes':3,'root_raw_RGB_pages':60,'root_personal_views':0,'production_ready':False,'decision_eligible':'INTERNAL_ACCEPTANCE_WITH_FLAGS_NOT_FINAL_STUDENT_OR_MERGE_RELEASE'})
    print('PASS: exact15native,3 routes/60rawRGBpages,48attributed specialist views,109+21+11real negatives')
def inventory():
    rows=[]
    for line in c.raw(P/M).decode().splitlines():
        cells=[x.strip() for x in line.split('|')]
        if len(cells)==7 and cells[1].isdigit():rows.append({'number':int(cells[1]),'id':cells[2],'edition':cells[3],'status':cells[4],'path':cells[5].strip('`')})
    assert [r['number'] for r in rows]==list(range(1,42)) and len({r['path'] for r in rows})==41
    counts={x:sum(r['status']==x for r in rows) for x in 'ACLP'};assert counts=={'A':23,'C':0,'L':6,'P':12}
    before=c.read(P/(OUT+'baseline.json'));lookup={r['path']:r['sha256'] for r in before['all_existing_PDFs']};old=[]
    for line in __import__('base64').b64decode(before['output_manifest']['raw_base64']).decode().splitlines():
        cells=[x.strip() for x in line.split('|')]
        if len(cells)==7 and cells[1].isdigit():old.append({'number':int(cells[1]),'id':cells[2],'edition':cells[3],'status':cells[4],'path':cells[5].strip('`')})
    for prior,row in zip(old,rows):
        assert row==({**prior,'status':'A'} if prior['id']=='2.2.4' else prior)
        rel='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/'+row['path'];file=L/rel
        assert c.data(file).exists()==(row['status']!='P')
        if row['status']!='P':
            assert c.digest(file)==lookup[rel]
            if row['status']=='L':assert c.raw(file)==git(L,'show','f09fd6e88edc5049b026b16b0158e7e188091d2d:'+rel)
    return {'counts':counts,'physical':len(lookup),'rows':rows}
def postaccept(verification):
    assert re.fullmatch(r'[a-f0-9]{40}',verification)
    path=OUT+'preaccept-integrity.json';pre=c.read(P/path);assert c.raw(P/path)==git(P,'show',verification+':'+path) and pre['status']=='PASS'
    old=yaml.safe_load(git(L,'show','cdc3630256b99d4a49cd001151892b0009e824c5:'+QC));current=yaml.safe_load(c.raw(L/QC));assert list(old)==list(current)==['schema_version','partA']
    allowed={'root_validation','root_acceptance','handoff','production_ready_with_flags'};assert set(current['partA'])==set(old['partA'])|{'production_ready_with_flags'}
    for key,value in old['partA'].items():
        if key not in allowed:assert current['partA'][key]==value,key
    q=current['partA'];assert q['production_ready'] is False and q['production_ready_with_flags'] is True
    assert q['root_validation']['status']=='PASS' and q['root_validation']['verification_commit']==verification and q['root_validation']['evidence_raw_sha256']==c.digest(P/path) and q['root_validation']['root_personal_views']==0
    assert q['root_acceptance']['status']=='ACCEPTED WITH FLAGS' and q['root_acceptance']['actor']=='codex-root' and q['root_acceptance']['required_corrections']==[]
    assert q['handoff']['status']=='CREATED' and q['handoff']['companion']=='NOT_COMMISSIONED'
    hand=c.raw(L/HAND).decode();assert re.findall(r'^## (\d+)\. ',hand,re.M)==list(map(str,range(1,10)))
    for token in [verification,c.digest(L/QC),q['review_raw_sha256'],'NOT_COMMISSIONED','UNOBSERVED','53.5/63.5/71.5','2/2/2/4/2/2']:assert token in hand,token
    for row in pre['native']:
        assert c.digest(L/row['path'])==row['sha256']
        if '/_assets/' not in row['path']:assert row['sha256'] in hand,row['path']
    assert exact_routes()==pre['routes'] and specialist_views()==pre['specialist_views'] and n.guard(SOURCE)==pre['source']
    imports=c.read(P/(OUT+'verification.json'))['imports']
    for row in imports:
        if row['repository']=='platform':assert c.digest(P/row['path'])==row['raw_sha256']
    state=inventory();custody={'platform':rawtree(P,verification,INDEXES|{M}),'lessons':rawtree(L,pre['L'],{QC})}
    names=(git(L,'diff','--name-only','-z',pre['L'])+git(L,'ls-files','--others','--exclude-standard','-z')).decode().split('\0');assert set(filter(None,names))=={QC,HAND}
    n.k.gates('post',next(E.glob('224-full-r*-manifest.json')))
    c.save(P/(OUT+'postaccept-check.json'),{'status':'PASS','verification_commit':verification,'root_only_fields':sorted(allowed),'other_specialist_metadata_exact':True,'quality_ref_sha256':c.digest(L/QC),'handoff_sha256':c.digest(L/HAND),'handoff_sections':9,'inventory':state,'custody':custody,'root_native_routes':3,'root_raw_RGB_pages':60,'root_personal_views':0,'specialist_personal_views_attributed':48,'production_ready':False,'production_ready_with_flags':True})
    print('PASS root-only acceptance,9-section handoff,41rows23A/0C/6L/12P,29PDFbytes unchanged')
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('action',choices=['preaccept','postaccept']);parser.add_argument('--verification-commit');args=parser.parse_args()
    preaccept() if args.action=='preaccept' else postaccept(args.verification_commit)
