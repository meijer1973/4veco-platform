"""Independent reviewer probes and unmodified native command evidence.

No source repair. Each fixture is a short temporary technical copy. The real
builder's rejecting entry is observed, not replaced with a successful stub.
"""
import argparse, base64, importlib.util, json, os, subprocess, sys, tempfile
from fractions import Fraction as F
from pathlib import Path
from unittest.mock import patch

P=Path(__file__).resolve().parents[2]; L=P.parent/'4veco-lessen'
PREFIX='BOOK2-TEXTBOOK-PRODUCTION-1-224-REVIEW'
E=P/'reports/sprints'/(PREFIX+'-evidence')
sys.path.insert(0,str(P/'build-scripts/content/book-2'))
import b2_224 as b
spec=importlib.util.spec_from_file_location('review_controller',P/'reports/sprints'/(PREFIX+'-controller.py'))
c=importlib.util.module_from_spec(spec);spec.loader.exec_module(c)

def save(name,obj):
    c.write_new(E/name,obj)

def probes():
    rows=[]
    def equal(name,value,expected,wrong=()):
        assert value==expected,(name,value,expected)
        assert all(value!=v for v in wrong),(name,'negative failed')
        rows.append({'case':name,'actual':str(value),'expected':str(expected),'wrong_alternatives_rejected':[str(x) for x in wrong]})
    pct=lambda a,z:100*(F(z)-F(a))/F(a)
    q=lambda y,pc=20:100-2*10+pc+F(5,1000)*y
    t=lambda y:12000-400*12+F(1,10)*y+300*10
    equal('A signed percentages',(pct(100,80),pct(20,22)),(-20,10),[(20,10),(-25,10)])
    equal('A elasticity',pct(100,80)/pct(20,22),-2,[F(-1,2),2])
    equal('A revenue',(20*100,22*80,pct(2000,1760)),(2000,1760,-12),[(2000,1760,-10)])
    equal('B revenue and interval elasticity',(10*100,15*60,pct(1000,900),pct(100,60)/pct(10,15)),(1000,900,-10,F(-4,5)))
    equal('B multiplicative factor',F(15,10)*F(60,100),F(9,10),[F(11,10),F(21,10)])
    equal('C Ei',F(5,10),F(1,2),[F(2),F(-1,2)])
    classify=lambda x:'inferieur' if x<0 else 'normaal' if 0<x<1 else 'luxe' if x>1 else None
    equal('Ei boundaries',[classify(x) for x in [F(-1,2),0,F(1,2),1,F(15,8)]],['inferieur',None,'normaal',None,'luxe'])
    equal('D correct other-price source',pct(200,180)/pct(20,24),F(-1,2),[pct(200,180)/pct(20,22),F(-2)])
    equal('E all four controlled rows',[q(20000),q(24000),q(20000,24),q(24000,24)],[200,220,204,224])
    equal('E income effect',q(24000)-q(20000),20,[24,4])
    equal('E Ei',pct(200,220)/pct(20000,24000),F(1,2),[F(5,1000)])
    equal('E reset reference',q(20000,24)-q(20000),4,[q(20000,24)-q(24000)])
    equal('Annual unit',[t(40000),t(42000)],[14200,14400],[[t(F(40000,12)),t(F(42000,12))]])
    equal('StreamPlus revenue',[10*50000,12*43000,12*43000-10*50000],[500000,516000,16000])
    equal('StreamPlus Ev',pct(50000,43000)/pct(10,12),F(-7,10),[F(7,10)])
    equal('StreamPlus Ei',[F(15,8),F(-4,8)],[F(15,8),F(-1,2)])
    equal('StreamPlus Ek',F(5)/pct(8,9),F(2,5),[F(5,8),F(5,2)])
    equal('Closing reverse base',pct(25,20),-20,[-25])
    equal('Closing Ev',F(-5,10),F(-1,2))
    try:F(-5,0)
    except ZeroDivisionError:pass
    else:raise AssertionError('Undefined Ei was accepted')
    budgets=[2.5,5,5,3,3.5,7,4,2.5,1.5,1.5,2,5,3,4,2.5,1.5]
    equal('Complete unobserved timing',[sum(budgets),sum(budgets)+10,sum(budgets)+18],[53.5,63.5,71.5])
    equal('Target/rehearsal points',[sum([2,2,2,4,2,2]),sum([4,4,2,2,6,2])],[14,20])
    raw=(P/b.RELEASE_PATH).read_bytes(); m=json.loads(raw)
    assert b.sha(raw)=='33c1473db0cbeec66e93557a72ab0586ccfcef29ba52b2a36148946c65598c7e'
    b.verify_committed_release(b.verify_current_release(L),L)
    negatives=[];positives=[]
    with tempfile.TemporaryDirectory(prefix='b224-review-neg-',dir='C:/wt') as temp:
        root=Path(temp);roots={k:root/k for k in ['4veco-platform','4veco-lessen']}
        for r in m['inputs']:
            dest=b.data_path(roots[r['repository']]/r['path']);dest.parent.mkdir(parents=True,exist_ok=True)
            dest.write_bytes(b.data_path(P.parent/r['repository']/r['path']).read_bytes())
        release=roots['4veco-platform']/b.RELEASE_PATH;release.parent.mkdir(parents=True,exist_ok=True);release.write_bytes(raw)
        def positive(label):
            assert len(b.verify_current_release(roots['4veco-lessen'],roots['4veco-platform'])['inputs'])==34
            positives.append(label)
        def reject(label):
            with patch.object(b,'ROOT',roots['4veco-platform']),patch.object(b.subprocess,'run',side_effect=AssertionError('premature subprocess')) as process,patch.object(Path,'mkdir',side_effect=AssertionError('premature mkdir')) as mkdir,patch.object(Path,'write_text',side_effect=AssertionError('premature text')) as wt,patch.object(Path,'write_bytes',side_effect=AssertionError('premature bytes')) as wb,patch.object(Path,'unlink',side_effect=AssertionError('premature removal')) as rm:
                try:b.build(roots['4veco-lessen'],root/'proof',proof_suffix='r999')
                except (ValueError,FileNotFoundError) as error:reason=str(error)
                else:raise AssertionError('Accepted invalid input '+label)
                for effect in [process,mkdir,wt,wb,rm]:effect.assert_not_called()
            negatives.append({'case':label,'rejected':True,'exception':reason,'effect_calls':0})
        positive('all exact current file fixture inputs')
        for i,r in enumerate(m['inputs']):
            dest=b.data_path(roots[r['repository']]/r['path']);original=dest.read_bytes()
            dest.unlink();reject(str(i)+' missing '+r['path']);dest.write_bytes(original)
            forged=original+b'\nindependent counterexample\n'
            dest.write_bytes(forged);reject(str(i)+' forged '+r['path'])
            changed=json.loads(raw);changed['inputs'][i]['raw_sha256']=b.sha(forged)
            release.write_bytes((json.dumps(changed)+'\n').encode());reject(str(i)+' synchronized manifest '+r['path'])
            dest.write_bytes(original);release.write_bytes(raw)
        for key,value in [('accountable_actor','paragraph_224_builder'),('decision','PENDING'),('inputs',[]),('inputs',m['inputs'][:-1])]:
            changed=json.loads(raw);changed[key]=value;release.write_bytes(json.dumps(changed).encode());reject('forged '+key+' '+str(len(str(value))));release.write_bytes(raw)
        release.unlink();reject('missing manifest');release.write_bytes(raw);positive('all exact inputs restored in temporary fixture only')
        assert not (root/'proof').exists()
    # Whole immutable guard is the author's actual controller predicate, with
    # complete originals obtained from fixed commits, never current candidate.
    source=c.source_guard();originals={r['path']:c.git(P,'show',r['commit']+':'+r['path']) for r in source}
    ac='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-224-BUILD-controller.py'
    originals[ac]=c.git(P,'show','0e2349ecf50e817482bf2f5c1d6d5aedc32c9323:'+ac)
    whole=[]
    with tempfile.TemporaryDirectory(prefix='b224-review-whole-',dir='C:/wt') as temp:
        root=Path(temp)
        for rel,old in originals.items():
            path=root/rel;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(old)
        c.verify_bound_bytes(root,originals)
        for rel,old in originals.items():
            path=root/rel
            for mode in ['missing','unrelated-byte-drift']:
                if mode=='missing':path.unlink()
                else:path.write_bytes(old+b'\n# drift\n')
                try:c.verify_bound_bytes(root,originals)
                except (ValueError,FileNotFoundError):pass
                else:raise AssertionError('Whole guard accepted '+rel)
                whole.append({'path':rel,'mode':mode,'rejected':True});path.write_bytes(old)
        for rel,old in originals.items():
            (root/rel).write_bytes(old+b'\n# synchronized source/test/controller drift\n')
        try:c.verify_bound_bytes(root,originals)
        except ValueError:whole.append({'mode':'all source/test/controller synchronized drift','rejected':True})
        else:raise AssertionError('Synchronized source accepted')
    result={'actor':'paragraph_231_specialist_qc','status':'PASS','math':rows,'timing_observed':False,'actual_build_entry_negatives':negatives,'positive_current_file_controls':positives,'whole_file_negatives':whole,'source_bindings':source,'fixtures_removed':True,'native_positive_controls':'Separate full/thin/direct actual routes, not these tripwires'}
    save('224-independent-probes.json',result);print(json.dumps({'math':len(rows),'actual_negatives':len(negatives),'whole_negatives':len(whole),'status':'PASS'}))

def commands(manifest):
    commands=[
      ['source-tests',[sys.executable,'build-scripts/content/book-2/224/test_source.py']],
      ['native-checker',[sys.executable,'build-scripts/content/book-2/224/check_render.py','--lesson-root',str(L),'--manifest',str(manifest),'--rebuild']],
      ['student-web',['node','scripts/validate-paragraph.js','--mode','part-a','--profile','student-web',str(L/b.LESSON_REL)]],
      ['publisher-print',['node','scripts/validate-paragraph.js','--mode','part-a','--profile','publisher-print',str(L/b.LESSON_REL)]],
      ['structural',['node','build-scripts/workflows/check-book-outline-currentness.js']],
      ['approved',['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.2.4']],
      ['durable',['node','build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']],
      ['bundle',['node','build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1']]]
    records=[];env=dict(os.environ);env['PYTHONIOENCODING']='utf-8';env['PYTHONDONTWRITEBYTECODE']='1'
    for label,argv in commands:
        r=subprocess.run(argv,cwd=P,env=env,capture_output=True)
        row={'label':label,'argv':argv,'cwd':str(P),'exit_code':r.returncode,'stdout':r.stdout.decode('utf8',errors='replace'),'stderr':r.stderr.decode('utf8',errors='replace'),'stdout_base64':base64.b64encode(r.stdout).decode(),'stderr_base64':base64.b64encode(r.stderr).decode()}
        save('224-command-'+label+'.json',row);records.append({'label':label,'exit_code':r.returncode});print(json.dumps(records[-1]),flush=True)
    save('224-commands.json',records)
    if any(r['exit_code'] for r in records):raise SystemExit(1)

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('action',choices=['probes','commands']);ap.add_argument('--manifest',type=Path);a=ap.parse_args()
    probes() if a.action=='probes' else commands(a.manifest)
