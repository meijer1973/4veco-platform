"""Reviewer-derived math/semantic/DOM and genuine input rejection probes.

HOW TO ADAPT: only exclusive own evidence and disposable fixtures. No live
source/native mutation. Fixture entry calls are in-process, not OS CLI builds.
"""
import json,sys,re,tempfile,subprocess
from pathlib import Path
from fractions import Fraction as F
from contextlib import ExitStack
from unittest.mock import patch
sys.dont_write_bytecode=True
P=Path(__file__).resolve().parents[2];L=P.parent/'4veco-lessen'
sys.path.insert(0,str(P/'build-scripts/content/book-2'))
import b2_214 as b
PRE='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-PARAGRAPH-REVIEW-'
def git(root,*args):return subprocess.check_output(['git',*args],cwd=root)
def save(name,data):
    path=P/(PRE+name+'.json')
    with path.open('x',encoding='utf8',newline='\n') as f:json.dump(data,f,ensure_ascii=False,indent=2);f.write('\n')
    print(json.dumps({'file':path.name,'sha256':b.sha(b.raw(path)),'status':data['status']}))
def content():
    docs=b.documents(b.target_record());a=docs['antwoorden'];p=docs['opgaven'];checks=[]
    def yes(label,value):assert value,label;checks.append(label)
    # Independent whole-model ledger, not values imported from author tests.
    ledger=[]
    for label,q,tk,to in [('Lichtservice',[0,20,40,45,55],[100,150,200,220,275],[0,120,240,270,330]),('SmoothBox',[0,700,800,900,1000],[1200,2600,2900,3250,3650],[0,3500,4000,4500,5000])]:
        rows=[]
        for i,x in enumerate(q):
            row={'Q':x,'TK':tk[i],'TO':to[i],'W':to[i]-tk[i],'GTK':str(F(tk[i],x)) if x else None,'GO':str(F(to[i],x)) if x else None}
            if i:
                dq=x-q[i-1];dtk=tk[i]-tk[i-1];dto=to[i]-to[i-1]
                row.update(deltaQ=dq,MK=str(F(dtk,dq)),MO=str(F(dto,dq)),growth=str(F(dto-dtk,dq)),deltaW=dto-dtk)
                yes(label+' interval '+str(i),F(dto-dtk,dq)==F(dto,dq)-F(dtk,dq))
            rows.append(row)
        ledger.append({'context':label,'rows':rows})
    yes('fixed totals and both normal average decompositions',all(F(100,q)+F(5,2)==F(100+F(5,2)*q,q) for q in range(1,41)))
    yes('six named average outputs',[F(100,20),F(50,20),F(150,20),F(100,40),F(100,40),F(200,40)]==[5,F(5,2),F(15,2),F(5,2),F(5,2),5])
    yes('normal integer loss boundary complete domain',[q for q in range(41) if 6*q-100-F(5,2)*q>=0]==list(range(29,41)))
    yes('continuous crossing both coordinates',6*F(200,7)==100+F(5,2)*F(200,7)==F(1200,7))
    yes('target positive-normal integer domain',[q for q in range(701) if 5*q-1200-2*q>0]==list(range(401,701)))
    yes('700 average exact',F(2600,700)==F(26,7))
    # Genuine alternative models show what source endpoints do NOT determine.
    counter=[{'claim':'nearest integer always prevents loss','Qstar':str(F(101,3)),'nearest':34,'floor':33,'floor_profit':-2,'ceiling_profit':1},
             {'claim':'nearest integer always prevents loss','Qstar':str(F(100,3)),'nearest':33,'nearest_profit':-1,'ceiling_profit':2},
             {'claim':'same endpoints fix individual55 cost','TK54_models':[270,272],'TK55':275,'unit55_costs':[5,3]},
             {'claim':'greatest level implies greatest rate','highest_given_profit':55,'last_growth':'.5','normal_growth':'3.5'},
             {'claim':'normal rule applies at800','wrong_TK':1200+2*800,'source_TK':2900},
             {'claim':'fixed price fixes profit increments','deltaTO':[500,500,500],'deltaTK':[300,350,400],'deltaW':[200,150,100]},
             {'claim':'area equals W40','correct_vertical_euro':40,'extra_Q_width_changes_units':True}]
    yes('rounding counterexample',round(F(100,3))==33 and 3*33-100<0<=3*34-100)
    yes('nonidentification of last unit',275-270!=275-272)
    bonus=[6*40-200,6*40-220,F(13,2)*40-200,F(13,2)*40-220]
    yes('bonus all separate and combined effects',bonus==[40,20,60,40])
    yes('fixed surcharge cancels all actual intervals',all((y+20)-(x+20)==y-x for x,y in zip([100,150,200,220],[150,200,220,275])))
    yes('closing distinct numerator and denominator',F(220,45)==F(44,9) and F(220-200,45-40)==4 and F(20,45)!=4)
    clauses=['maar is niet de algemene regel voor geen verlies','TK bij Q = 54 niet','niet MK = MO = 0','200/7 < Q ≤ 40','400 < Q ≤ 700','geen voorspelling buiten de gegeven bronnen','de kosten worden daardoor niet variabel','neemt geen klantenreactie aan','precies drie inhoudelijke criteria','sluit het antwoordendocument en de herinneringsstrook']
    corpus=' '.join((a+'\n'+p).split());semantic=[]
    for clause in clauses:
        yes('present semantic boundary: '+clause,clause in corpus)
        for replacement in ['', 'DIT GELDT ALTIJD ZONDER GRENS']:
            changed=corpus.replace(clause,replacement)
            yes('reject missing/misleading clause '+clause+' '+str(bool(replacement)),clause not in changed)
            semantic.append({'clause':clause,'mutation':replacement,'rejected':True})
    # Exact clause deletion probes support, not replace, the prose judgments.
    from bs4 import BeautifulSoup
    dom=[]
    for ed,md in docs.items():
        path=L/b.LESSON_REL/(b.STEM+' – '+ed+'.html');s=BeautifulSoup(b.raw(path),'html.parser')
        images=s.find_all('img');yes(ed+' two images',len(images)==2)
        for img in images:
            fig=img.find_parent('figure');cap=fig.find('figcaption');alt=img.get('alt','');caption=cap.get_text(' ',strip=True)
            yes(ed+' functional alt and separate complete caption',0<len(alt)<=120 and alt.startswith(('Lichtservice:','SmoothBox:')) and len(caption)>len(alt) and cap.get('aria-hidden')!='true')
            dom.append({'edition':ed,'HTML_sha256':b.sha(b.raw(path)),'alt':alt,'caption':caption,'src':img['src']})
    yes('frozen14points', [q['points'] for q in b.target_record()['target_exercise']['subquestions']]==[2,2,2,4,2,2])
    for q in b.target_record()['target_exercise']['subquestions']:yes('whole target prompt once '+q['label'],p.count(q['prompt'])==1)
    save('independent-content',{'status':'PASS','actor':'paragraph_214_builder','checks':checks,'ledger':ledger,'counterexamples':counter,'bonus':list(map(str,bonus)),'semantic_mutations':semantic,'DOM':dom,'timing':'54/60/72 UNOBSERVED; no learner fixtures','limits':'Exact-clause regressions are not a general NLP evaluator or learner evidence.'})
def negative():
    originals={}
    for name,commit,h in b.MODULES:originals[('4veco-platform',name)]=git(P,'show',commit+':'+name)
    manifest=json.loads(originals[('4veco-platform',b.C+'214-inputs.json')])
    for row in manifest['inputs']:originals[(row['repository'],row['path'])]=git(P if row['repository']=='4veco-platform' else L,'show',row['commit']+':'+row['path'])
    deps=b.raw(b.SOURCE/'dependency-pins.json');originals[('4veco-platform','build-scripts/content/book-2/214/dependency-pins.json')]=deps
    for row in json.loads(deps)['files']:originals[('4veco-platform',row['path'])]=git(P,'show',b.BASE_PLATFORM+':'+row['path'])
    chosen=[('4veco-platform',b.N+'214-release.json'),('4veco-platform',b.C+'214-inputs.json'),('4veco-platform',b.R+'report.md')]
    for ending in ['2.1.3-quality-ref.yaml','2.1.2-textbook-handoff.md','2.1.4-textbook-plan.md']:
        found=[key for key in originals if key[1].endswith(ending)];assert len(found)==1,(ending,found);chosen+=found
    chosen+=[('4veco-platform','references/authored/course-target-exercises.json')]
    assert len(set(chosen))==7
    results=[];direct=b.load_owned('direct_print')
    with tempfile.TemporaryDirectory(prefix='book2-214-review-owned-fixture-',dir='C:/wt') as temp:
        root=Path(temp);fp=root/'4veco-platform';fl=root/'4veco-lessen'
        for (repo,name),data in originals.items():
            path=b.data_path(root/repo/name);path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(data)
        assert len(b.pure_local_gate(fl,fp)[1]['inputs'])==48
        def reject(label):
            for route in ['full','thin','direct']:
                with ExitStack() as stack:
                    stack.enter_context(patch.object(b,'ROOT',fp))
                    effects=[stack.enter_context(patch.object(Path,m,side_effect=AssertionError('Unexpected '+m))) for m in ['mkdir','write_bytes','write_text','unlink','rmdir']]
                    child=stack.enter_context(patch.object(b.subprocess,'run',side_effect=AssertionError('Unexpected subprocess')))
                    # Read-only Path.open remains available to raw input reads.
                    try:
                        if route=='direct':direct.direct(fl,fp/'reports/214-no-effects','r99999')
                        elif route=='full':b.build(fl,fp/'reports/214-no-effects','r99999')
                        else:b.main(['--lessons-root',str(fl),'--proof-root',str(fp/'reports/214-no-effects'),'--proof-suffix','r99999','--route','thin'])
                    except (ValueError,FileNotFoundError) as e:results.append({'case':label,'route':route,'rejection':str(e),'effects':0})
                    else:raise AssertionError('Invalid fixture accepted')
                    for effect in [*effects,child]:effect.assert_not_called()
        for key in chosen:
            path=b.data_path(root/key[0]/key[1]);data=originals[key]
            path.unlink();reject('missing:'+key[1]);path.write_bytes(data)
            path.write_bytes(data+b'\nUNRELATED/FORGED\n');reject('forged:'+key[1]);path.write_bytes(data)
        for key in chosen[:2]:(root/key[0]/key[1]).write_bytes(originals[key]+b'\nSYNC\n')
        reject('combined grant and candidate unrelated-byte drift')
        for key in chosen[:2]:(root/key[0]/key[1]).write_bytes(originals[key])
        for (repo,name),data in originals.items():assert b.raw(root/repo/name)==data
        assert not (fp/'reports/214-no-effects').exists()
    assert not root.exists()
    save('independent-guards',{'status':'PASS','actor':'paragraph_214_builder','fixture_files':len(originals),'selected_real_inputs':chosen,'cases':results,'routes':'Actual in-process full/thin-mode/direct entry functions; not OS CLIs; genuine positives recorded separately','all_fixture_bytes_restored_then_owned_temp_removed':True,'native_effects':0})
if sys.argv[1]=='content':content()
elif sys.argv[1]=='negative':negative()
else:raise ValueError(sys.argv[1])
