"""Exact committed R7 payload scope (not a staged/future-head claim).

HOW TO ADAPT: pass an existing output filename only when expecting refusal;
new candidates need a fresh output filename and unchanged narrow allowlist.
"""
from pathlib import Path
import hashlib
import json
import subprocess
import sys
OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[2]
LESSONS = ROOT.parent/'4veco-lessen'
BRANCH = 'agent/book2-213-bonus-correction-20260905'
PBASE = '984547a17c966d3749d08ef34b92747de21eacbf'
LBASE = '5d67998d1e1d1aa5497d59850b53aebc780eaa96'
LEAF = 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/'
ANS = LEAF+'2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.'
SOURCE = {'build-scripts/content/book-2/213/answers.md','build-scripts/content/book-2/213/test_bonus_contract.py'}
PROOF = 'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/'
PROOF_DIRS = {'213-paragraaf-534177c8280e-r7','213-opgaven-d12487671bd2-r7','213-antwoorden-d96f21c3abed-r7'}
INDEX = {'reports/github-agent-index-platform.json','reports/github-agent-index-platform.md','reports/github-agent-index-lessen.json','reports/github-agent-index-lessen.md','reports/url-index.md'}
def git(repo,*argv):
    return subprocess.run(['git',*argv],cwd=repo,check=True,capture_output=True).stdout
def allowed(path):
    if path in SOURCE or path in INDEX or path.startswith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-BONUS-'): return True
    if path.startswith(PROOF): return path[len(PROOF):].split('/')[0] in PROOF_DIRS
    return False
records=[]
for repo,base,lane in [(ROOT,PBASE,'shared'),(LESSONS,LBASE,'textbook')]:
    head=git(repo,'rev-parse','HEAD').decode().strip()
    assert git(repo,'branch','--show-current').decode().strip()==BRANCH
    names=git(repo,'diff','--name-only','-z',base,head).decode('utf-8').rstrip('\0').split('\0')
    if repo==ROOT: assert all(allowed(path) for path in names),names
    else: assert set(names)=={ANS+ext for ext in ['md','html','pdf','zip']},names
    assert git(repo,'diff','--name-only',base,head,'--diff-filter=D')==b''
    records.append({'repo':repo.name,'branch':BRANCH,'base':base,'head':head,'lane':lane,
                    'paths':[{'path':path,'blob_sha256':hashlib.sha256(git(repo,'show',f'{head}:{path}')).hexdigest()} for path in names]})
result={'result':'PASS','exact_committed_scope':records,'lesson_source_branch':BRANCH,
        'lesson_source_sha':records[1]['head'],'target_plan_qc_handoff_changes':[],
        'scope_limit':'bounded author candidate; independent R7 review/QC and integration pending'}
output=OUT/sys.argv[1]
assert output.parent==OUT and not output.exists()
output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(json.dumps({'result':'PASS','platform_head':records[0]['head'],'lesson_head':records[1]['head'],'platform_paths':len(records[0]['paths']),'lesson_paths':len(records[1]['paths'])}))
