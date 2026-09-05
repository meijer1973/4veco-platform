"""Check the actual committed review payload, not a fabricated source anchor."""
from pathlib import Path
import hashlib, json, subprocess, sys

OUT=Path(__file__).resolve().parent
ROOT=OUT.parents[2]
LESSONS=ROOT.parent/'4veco-lessen'
BASES=['0dafc7969eb9ca2c8b79e2de5332ad1ee2f1ef38','40e5e250ba7dcbc9efbb8165bfb9b426a1b43c99']
REVIEW='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/2.1.3-review.md'
def git(repo,*args): return subprocess.check_output(['git',*args],cwd=repo)
def sha(b): return hashlib.sha256(b).hexdigest()
def allowed(path):
    return path.startswith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-r7-review-evidence/') or path in ['reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-independent-review-plan-r7.md','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-paragraph-review-r7.md'] or any(path.startswith('reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/'+directory+'/') for directory in ['213-paragraaf-534177c8280e-r8','213-opgaven-d12487671bd2-r8','213-antwoorden-d96f21c3abed-r8'])
def run():
    output=OUT/'committed-scope.json'
    assert not output.exists()
    records=[]
    for repo,base in zip([ROOT,LESSONS],BASES):
        head=git(repo,'rev-parse','HEAD').decode().strip()
        changed=git(repo,'diff','--name-only','-z',base,head).decode().strip('\0').split('\0')
        assert changed and (all(allowed(p) for p in changed) if repo==ROOT else changed==[REVIEW])
        assert not git(repo,'diff','--name-only','--diff-filter=D',base,head)
        entries=[{'path':p,'blob_sha256':sha(git(repo,'show',f'{head}:{p}'))} for p in changed]
        records.append({'repo':repo.name,'branch':git(repo,'branch','--show-current').decode().strip(),'base':base,'head':head,'paths':entries})
    emit={'result':'PASS','strict_actual_review_payload':records,'not_authorized':['pupil content/assets','targets','plans','prerequisite pins','QC','handoff','root acceptance'],'current_canonical_review_sha256':sha((LESSONS/REVIEW).read_bytes())}
    output.write_text(json.dumps(emit,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    print(json.dumps({'result':'PASS','heads':[r['head'] for r in records],'path_counts':[len(r['paths']) for r in records]},ensure_ascii=True))
if __name__=='__main__':run()
