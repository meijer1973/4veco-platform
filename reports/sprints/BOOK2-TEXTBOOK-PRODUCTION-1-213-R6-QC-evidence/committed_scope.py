"""Package genuine committed scopes after the explicit REVISE successor."""
import json, subprocess
import qc_probes as q
PHEAD='fb2c271fb3df22f43518463f446cae0d3685fc3b'
LHEAD='5d67998d1e1d1aa5497d59850b53aebc780eaa96'
labels=('own-platform-scope','whole-platform-scope','own-lessons-scope','whole-lessons-scope')
records=[json.loads(x) for x in (q.OUT/'command-log.jsonl').read_text(encoding='utf-8').splitlines()]
scopes={r['label']:{'argv':r['argv'],'exit_code':r['exit_code'],'result':json.loads(r['stdout'])} for r in records if r['label'] in labels}
assert set(scopes)==set(labels)
assert scopes['own-platform-scope']['exit_code']==1
assert scopes['own-platform-scope']['result']['failures']==[
 'shared lane needs at least one shared platform change',
 'generated index/report or review-evidence changes are allowed only with lane-owned changes']
assert scopes['own-lessons-scope']['exit_code']==1
assert scopes['own-lessons-scope']['result']['failures']==[
 'no changed paths to classify','textbook lane needs at least one Part A textbook change']
for name in ('whole-platform-scope','whole-lessons-scope'):
    assert scopes[name]['exit_code']==0 and scopes[name]['result']['ok']
def paths(repo,base,head):
    return [s for s in subprocess.check_output(['git','diff','--name-only','-z',base,head],cwd=repo).decode('utf-8').split('\0') if s]
owned=paths(q.ROOT,q.PBASE,PHEAD)
assert owned and all(p.startswith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-R6-QC-') for p in owned)
assert paths(q.LESSONS,q.LBASE,LHEAD)==[]
assert all(not v for k,v in scopes['own-platform-scope']['result']['categories'].items() if k!='review_evidence')
quality=q.DEST/'2.1.3-quality-ref.yaml'
assert quality.read_bytes()==q.blob(q.LESSONS,q.LBASE,quality.relative_to(q.LESSONS))
q.emit('committed-scope.json',{'scope_result':'Complete-candidate native scopes PASS; strict own evidence-only/net-zero audits PASS; diagnostic failures retained',
 'current_specialist_verdict':'REVISE','actor':q.ACTOR,'platform_payload_commit':PHEAD,'lessons_payload_commit':LHEAD,
 'current_quality_sha256':q.digest(quality),'quality_promoted':False,'handoff_present':False,'scope_results':scopes,
 'own_platform_paths':owned,'own_lessons_net_paths':[],'own_lesson_history':'QC append then explicit withdrawal, no history rewrite',
 'manufactured_lane_anchor_or_waiver':False})
