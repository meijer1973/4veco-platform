"""Package actual committed scope results, keeping diagnostic failures explicit."""
from pathlib import Path
import hashlib, json, subprocess
OUT=Path(__file__).parent
ROOT=OUT.parents[2]
assert ROOT.parent.name=='book2-213-r6-review-20260905'
records=[json.loads(l) for l in (OUT/'command-log.jsonl').read_text(encoding='utf-8').splitlines()]
labels=('own-platform-scope','whole-platform-scope','own-lessons-scope','whole-lessons-scope')
scopes={r['label']:{'command':r['argv'],'exit_code':r['exit_code'],'result':json.loads(r['stdout'])} for r in records if r['label'] in labels}
assert set(scopes)==set(labels)
own=scopes['own-platform-scope']['result']
assert scopes['own-platform-scope']['exit_code']==1
assert own['failures']==['shared lane needs at least one shared platform change','generated index/report or review-evidence changes are allowed only with lane-owned changes']
assert len(own['categories']['review_evidence'])==19
assert all(not v for k,v in own['categories'].items() if k!='review_evidence')
assert all(p.startswith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-') for p in own['categories']['review_evidence'])
assert all(scopes[k]['exit_code']==0 and scopes[k]['result']['ok'] for k in labels[1:])
lesson=ROOT.parent/'4veco-lessen'
review=next(lesson.glob('Boek 2*/2.1 Hoofdstuk*/2.1.3 */2.1.3-review.md'))
raw=review.read_bytes()
result={'result':'PASS: explicit review-owned path audit and actual complete-candidate scopes; generic evidence-only diagnostic failure retained',
 'platform_payload_commit':'5765265dfa52e2bc4f938c835608095272bad463','lesson_payload_commit':'576c5f4bb919611466e4511d2b4938a8195f6972',
 'canonical_review_raw_sha256':hashlib.sha256(raw).hexdigest(),'canonical_review_lf_sha256':hashlib.sha256(raw.replace(b'\r\n',b'\n')).hexdigest(),
 'scope_results':scopes,'explicit_owned_path_audit':{'platform':'19 review_evidence paths only, all uniquely prefixed; zero unknown or other categories',
 'lessons':'exactly one canonical 2.1.3-review.md, native textbook scope PASS'},'waiver_or_manufactured_shared_source':False}
p=OUT/'committed-scope.json'; assert not p.exists()
p.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps({k:v for k,v in result.items() if k!='scope_results'},ensure_ascii=True,indent=2))
