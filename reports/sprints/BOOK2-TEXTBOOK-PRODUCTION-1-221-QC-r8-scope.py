"""Run whole-candidate committed scopes and a separate exact specialist-delta audit."""
import importlib.util,json,sys
from pathlib import Path
spec=importlib.util.spec_from_file_location('qc_runner',Path(__file__).with_name('BOOK2-TEXTBOOK-PRODUCTION-1-221-QC-r8-run.py'))
r=importlib.util.module_from_spec(spec);spec.loader.exec_module(r)
heads={repo:r.run(['git','rev-parse','HEAD'],cwd=root).stdout.decode().strip() for repo,root in [('platform',r.ROOT),('lessons',r.LESSONS)]}
results={'heads':heads,'generic_scopes':[],'strict_own_delta':{}}
for repo,base,lane in [('platform','199772e2aa586fce0f71b647ed5188e568dba2e5','shared'),('lessons','4c4cd7d0c1d2e5242c818399a96dce3e26013e9c','textbook')]:
    argv=['node','build-scripts/workflows/check-paragraph-lane-scope.js','--lane',lane,'--base',base,'--head',heads[repo],'--json']
    if repo=='lessons':argv+=['--cwd',str(r.LESSONS)]
    result=r.run(argv,required=False)
    results['generic_scopes'].append({'repo':repo,'base':base,'head':heads[repo],'exit_code':result.returncode,'output':r.decode(result.stdout)})
for repo,root,base in [('platform',r.ROOT,'3ddef86ba5549c62b5bb3ec70ea9c820bec1bb4b'),('lessons',r.LESSONS,'144938f325d875b5ca055f5bb0951c450af59842')]:
    names=r.run(['git','diff','--name-only','-z',base,heads[repo]],cwd=root).stdout.decode('utf-8').strip('\x00').split('\x00')
    if repo=='platform': assert all(n.startswith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-QC-r8-') for n in names)
    else: assert names==[(r.PAR/'2.2.1-quality-ref.yaml').relative_to(r.LESSONS).as_posix()]
    results['strict_own_delta'][repo]={'base':base,'head':heads[repo],'files':names,'PASS':True}
old=json.loads((r.E/'before.json').read_text(encoding='utf-8'));now=r.snapshot()
changed=[p for p in old if old[p]!=now[p]]
q=(r.PAR/'2.2.1-quality-ref.yaml').relative_to(r.LESSONS).as_posix()
assert changed==[q]
before=r.run(['git','show','144938f325d875b5ca055f5bb0951c450af59842:'+q],cwd=r.LESSONS,content_bytes=True).stdout.decode('utf-8')
after=(r.LESSONS/q).read_text(encoding='utf-8')
assert before.split('partA:',1)[0]==after.split('partA:',1)[0]
assert '\ncompanion:' not in before and '\ncompanion:' not in after
results['quality_ref']={'raw_sha256':r.sha((r.LESSONS/q).read_bytes()),'lf_sha256':r.sha(after.encode('utf-8')),'only_partA_changed':True,'companion_absence_preserved':True,'all_other_lesson_files_unchanged':True}
r.put('committed-scope.json',results)
assert all(x['exit_code']==0 for x in results['generic_scopes']),results
print(json.dumps({'status':'PASS','heads':heads,'quality_ref':results['quality_ref']}))
