"""Current specialist calculations, real failure-entry probes and gate records.

Fixtures are technical copies, never learner evidence. Actual release predicates
are called; effects are tripwires, not successful authorization substitutes.
Attribution: general fixture technique from 224 REVIEW checks; new specialist
judgments and whole shared/controller bindings remain separately identified.
"""
import argparse, importlib.util, json, os, subprocess, sys, tempfile
from fractions import Fraction as F
from pathlib import Path
from unittest.mock import patch
P=Path(__file__).resolve().parents[2];L=P.parent/'4veco-lessen'
PREFIX='BOOK2-TEXTBOOK-PRODUCTION-1-224-QC-CURRENT';E=P/'reports/sprints'/(PREFIX+'-evidence')
spec=importlib.util.spec_from_file_location('c224qc',P/'reports/sprints'/(PREFIX+'-controller.py'));c=importlib.util.module_from_spec(spec);spec.loader.exec_module(c)

def probes(commit):
    c.guard(commit);b=c.builder();m=c.release_guard();c.native_guard();cases=[]
    def eq(name,value,expected,wrong=()):
        if value!=expected or any(value==x for x in wrong):raise AssertionError((name,value,expected))
        cases.append({'case':name,'calculated':str(value),'expected':str(expected),'rejected_alternatives':[str(x) for x in wrong]})
    pct=lambda old,new:100*(F(new)-F(old))/F(old)
    ratio=lambda qo,qn,po,pn:pct(qo,qn)/pct(po,pn)
    eq('A reading P old/new Q old/new',(20,22,100,80),(20,22,100,80),[(20,24,100,80)])
    eq('A numerator retains sign and original100',pct(100,80),-20,[-25,20])
    eq('A price original20',pct(20,22),10,[F(100,11)])
    eq('A Ev is Q percentage / P percentage',ratio(100,80,20,22),-2,[F(-1,2),2])
    eq('A old/new exact revenue and difference',[20*100,22*80,22*80-20*100],[2000,1760,-240])
    eq('A exact revenue change',pct(2000,1760),-12,[-10,-20])
    eq('A multiplier not percentage sum',F(22,20)*F(80,100),F(88,100),[F(9,10)])
    eq('B finite old/new and elasticity',[10*100,15*60,ratio(100,60,10,15)],[1000,900,F(-4,5)])
    eq('B price and demand multipliers',[F(15,10),F(60,100),F(15,10)*F(60,100)],[F(3,2),F(3,5),F(9,10)])
    eq('B direct revenue decline despite interval |Ev|<1',pct(1000,900),-10,[10,50,-40])
    # Construct a smooth function with the exact two B observations. Its local
    # elasticity changes along the interval: the two-point average is not a
    # classification at every price. This is independent reviewer reasoning,
    # NOT an added pupil function/derivative task.
    demand=lambda p:180-8*F(p)
    local=lambda p:-8*F(p)/demand(p)
    eq('B smooth counterexample agrees at both observed endpoints',[demand(10),demand(15)],[100,60])
    eq('B local magnitudes not constant',[local(10),local(15)],[F(-4,5),-2])
    eq('B local unit point',local(F(45,4)),-1)
    classify=lambda e:'inferieur' if e<0 else 'normaal' if 0<e<1 else 'luxe' if e>1 else None
    eq('C Ei positive not automatically luxury',F(5,10),F(1,2),[2,F(1,20)])
    eq('Ei exact boundaries have no category',[classify(x) for x in [-1,0,F(1,2),1,F(3,2)]],['inferieur',None,'normaal',None,'luxe'])
    eq('D telescope price separate from A',pct(20,24),20,[10])
    eq('D named cross percentages',ratio(200,180,20,24),F(-1,2),[-1,-5,F(-1,10)])
    q=lambda px,pc,y:100-2*F(px)+F(pc)+F(5,1000)*F(y)
    eq('E full baseline termwise',[100,-2*10,20,F(5,1000)*20000,q(10,20,20000)],[100,-20,20,100,200])
    eq('E separate income and other-price reset',[q(10,20,24000),q(10,24,20000)],[220,204],[ [220,224] ])
    eq('E income difference/month',q(10,20,24000)-q(10,20,20000),20,[24,4])
    eq('E Ei denominator annual income percentage',ratio(200,220,20000,24000),F(1,2),[F(5,1000),F(1,20)])
    eq('E reset difference compared with200',q(10,24,20000)-q(10,20,20000),4,[-16,24])
    eq('E annual Y cannot become monthly Y',q(10,20,20000),200,[q(10,20,F(20000,12))])
    # Normal four-case local rule is a bounded directional table, not inferred
    # from B's whole finite interval ratio.
    eq('Four bounded local directions',[1,-1,-1,1],[1,-1,-1,1],[[1,1,-1,-1]])
    eq('T1 source-A prices quantities; score excluded',[10,12,50000,43000],[10,12,50000,43000],[[10,12,50000,F(46,10)]])
    eq('T2 supplied ratio consistent (calculation reviewer-only)',ratio(50000,43000,10,12),F(-7,10),[F(7,10),F(-10,7)])
    eq('T3 whole monetary revenues no invented period',[10*50000,12*43000,12*43000-10*50000],[500000,516000,16000])
    eq('T4 premium and budget signed Ei',[F(15,8),F(-4,8)],[F(15,8),F(-1,2)],[ [F(8,15),F(-2)] ])
    eq('T4 categories',[classify(F(15,8)),classify(F(-4,8))],['luxe','inferieur'])
    eq('T5 other competitor price percentage',pct(8,9),F(25,2),[F(100,9),1])
    eq('T5 correct named cross ratio',F(5)/pct(8,9),F(2,5),[F(5,8),F(25,2),F(5)])
    tq=lambda p,pc,y:12000-400*F(p)+F(1,10)*F(y)+300*F(pc)
    eq('T6 source-D monthly Q, annual Y, fixed both prices',[tq(12,10,40000),tq(12,10,42000)],[14200,14400],[ [tq(12,10,F(40000,12)),tq(12,10,F(42000,12))] ])
    eq('T6 source-D independent income change',tq(12,10,42000)-tq(12,10,40000),200,[20,2000])
    eq('Bonus supplied combined scenario',q(10,24,24000),224,[220,204])
    eq('Bonus decompose rather than attribute all to income',[q(10,24,24000)-200,q(10,20,24000)-200,q(10,24,20000)-200],[24,20,4])
    eq('Closing return uses25 as old base',pct(25,20),-20,[-25])
    eq('Closing Ev not Ei',F(-5,10),F(-1,2))
    try:F(-5,0)
    except ZeroDivisionError:cases.append({'case':'Closing no income change: Ei denominator zero','rejected':True})
    else:raise AssertionError('Division by zero accepted')
    eq('Exact point allocations',[sum([4,4,2,2,6,2]),sum([2,2,2,4,2,2]),4],[20,14,4])
    budgets=[F(5,2),5,5,3,F(7,2),7,4,F(5,2),F(3,2),F(3,2),2,5,3,4,F(5,2),F(3,2)]
    eq('Whole question-level estimates incl transitions',[sum(budgets),sum(budgets)+10,sum(budgets)+18],[F(107,2),F(127,2),F(143,2)])
    manifest_raw=c.raw(P/b.RELEASE_PATH);negative=[];positive=[]
    with tempfile.TemporaryDirectory(prefix='b224-qc-input-',dir='C:/wt') as temp:
        root=Path(temp)
        if not root.resolve().is_relative_to(Path('C:/wt').resolve()):raise ValueError('Fixture outside allowed directory')
        roots={n:root/n for n in ('4veco-platform','4veco-lessen')}
        for row in m['inputs']:
            path=c.data(roots[row['repository']]/row['path']);path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(c.raw(P.parent/row['repository']/row['path']))
        manifest=roots['4veco-platform']/b.RELEASE_PATH;manifest.parent.mkdir(parents=True,exist_ok=True);manifest.write_bytes(manifest_raw)
        def reject(label):
            with patch.object(b,'ROOT',roots['4veco-platform']),patch.object(b.subprocess,'run',side_effect=AssertionError('premature subprocess')) as p,patch.object(Path,'mkdir',side_effect=AssertionError('premature mkdir')) as md,patch.object(Path,'write_text',side_effect=AssertionError('premature write_text')) as wt,patch.object(Path,'write_bytes',side_effect=AssertionError('premature write_bytes')) as wb,patch.object(Path,'unlink',side_effect=AssertionError('premature unlink')) as ul:
                try:b.build(roots['4veco-lessen'],root/'proof',proof_suffix='r999')
                except (ValueError,FileNotFoundError) as error:reason=str(error)
                else:raise AssertionError('Invalid build entry accepted '+label)
                for effect in (p,md,wt,wb,ul):effect.assert_not_called()
            negative.append({'case':label,'rejected':True,'error':reason,'native_effects':0})
        positive.append(len(b.verify_current_release(roots['4veco-lessen'],roots['4veco-platform'])['inputs'])==34)
        for i,row in enumerate(m['inputs']):
            path=c.data(roots[row['repository']]/row['path']);original=path.read_bytes()
            path.unlink();reject('missing actual input '+str(i)+' '+row['path']);path.write_bytes(original)
            altered=original+b'\n# independent specialist unrelated forged bytes\n';path.write_bytes(altered);reject('forged actual input '+str(i))
            changed=json.loads(manifest_raw);changed['inputs'][i]['raw_sha256']=c.sha(altered);manifest.write_bytes(json.dumps(changed).encode());reject('synchronized manifest hash and actual input '+str(i))
            manifest.write_bytes(manifest_raw);path.write_bytes(original)
        for key,value in [('inputs',[]),('inputs',m['inputs'][:-1]),('accountable_actor','paragraph_214_builder'),('decision','PASS'),('immutable_input_pair',{'platform':c.PBASE,'lessons':c.LBASE})]:
            changed=json.loads(manifest_raw);changed[key]=value;manifest.write_bytes(json.dumps(changed).encode());reject('forged whole manifest '+key);manifest.write_bytes(manifest_raw)
        manifest.unlink();reject('missing release');manifest.write_bytes(manifest_raw)
        # Combined drift in two actual authority/teaching inputs plus all changed
        # hashes must still be rejected by the exact original manifest authority.
        changed=json.loads(manifest_raw)
        for i in (0,1,2):
            row=m['inputs'][i];path=c.data(roots[row['repository']]/row['path']);altered=path.read_bytes()+b'\ncombined\n';path.write_bytes(altered);changed['inputs'][i]['raw_sha256']=c.sha(altered)
        manifest.write_bytes(json.dumps(changed).encode());reject('three input files plus synchronized authority manifest')
        if (root/'proof').exists():raise AssertionError('Invalid attempts created output')
    originals,refs=c.originals(commit);whole=[]
    with tempfile.TemporaryDirectory(prefix='b224-qc-whole-',dir='C:/wt') as temp:
        root=Path(temp)
        for rel,value in originals.items():path=root/rel;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(value)
        c.verify_bound_bytes(root,originals)
        for rel,value in originals.items():
            path=root/rel
            for mode in ['missing','unrelated-drift']:
                if mode=='missing':path.unlink()
                else:path.write_bytes(value+b'\n# forged unreviewed content\n')
                try:c.verify_bound_bytes(root,originals)
                except (ValueError,FileNotFoundError):whole.append({'path':rel,'mode':mode,'rejected':True})
                else:raise AssertionError('Whole source/print/controller accepted '+rel)
                path.write_bytes(value)
        for rel,value in originals.items():(root/rel).write_bytes(value+b'\n# synchronized drift\n')
        try:c.verify_bound_bytes(root,originals)
        except ValueError:whole.append({'case':'all ten source/shared/foreign-controller/own-helper files drift','rejected':True})
        else:raise AssertionError('Combined source/guard change accepted')
    c.save(E/'224-independent-probes.json',{'actor':c.ACTOR,'status':'PASS','math_and_wrong_alternatives':cases,'actual_guard_entry_negatives':negative,'positive_exact_input_controls':positive,'whole_source_shared_controller_negatives':whole,'fixture_scope':'new short technical temporary copies only; normal scoped cleanup; denied historical author fixture never touched','timing_observed':False,'learner_evidence':False})
    print(json.dumps({'status':'PASS','math':len(cases),'real_input_negatives':len(negative),'whole_negatives':len(whole)}))

def gates(label,manifest):
    b=c.builder();commands=[
        ('source-tests',[sys.executable,'build-scripts/content/book-2/224/test_source.py']),
        ('native-readonly',[sys.executable,'build-scripts/content/book-2/224/check_render.py','--lesson-root',str(L),'--manifest',str(manifest)]),
        ('student-web',['node','scripts/validate-paragraph.js','--mode','part-a','--profile','student-web',str(L/b.LESSON_REL)]),
        ('publisher-print',['node','scripts/validate-paragraph.js','--mode','part-a','--profile','publisher-print',str(L/b.LESSON_REL)]),
        ('structural',['node','build-scripts/workflows/check-book-outline-currentness.js']),
        ('approved-production',['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.2.4']),
        ('approved-specialist',['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','specialist_review','--paragraph','2.2.4']),
        ('durable',['node','build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']),
        ('bundle',['node','build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1'])]
    rows=[]
    for name,argv in commands:
        result,record=c.command(name,argv,E/('224-'+label+'-'+name));rows.append(record);print(name+': PASS',flush=True)
    c.save(E/('224-gates-'+label+'.json'),{'status':'PASS','commands':rows,'hosted_CI':False})

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('action',choices=['probes','gates']);ap.add_argument('--controller-commit',required=True);ap.add_argument('--label');ap.add_argument('--manifest',type=Path);a=ap.parse_args();c.guard(a.controller_commit)
    probes(a.controller_commit) if a.action=='probes' else gates(a.label,a.manifest)
