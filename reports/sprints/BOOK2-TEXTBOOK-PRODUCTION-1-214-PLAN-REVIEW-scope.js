'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const{spawnSync,execFileSync}=require('child_process');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const pb='aee047221564fad762df59754a849d3f08ce069b',ph='d0845cbba07246c0efc6e306375e36a51ec234b5';
const lh='bbc4adf5af47187d5e394efd8079f906e9914023';
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-';
const git=(cwd,...args)=>execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:24*1024*1024});
const files=(cwd,base,head)=>git(cwd,'diff','--name-only','-z',base,head).split('\0').filter(Boolean).sort();
const expected=['operational-plan.md','probes.js','evidence.json','result.md','command-log.jsonl','command-log.md'].map(x=>prefix+x).sort();
assert.deepEqual(files(P,pb,ph),expected);
assert.deepEqual(files(L,lh,'HEAD'),[]);
const comparisons=[];
for(const [label,lane,root,base,head,expectedExit] of [
 ['actual-own-evidence-only','shared',P,pb,ph,1],
 ['genuine-complete-platform-candidate','shared',P,'6eb34debb2210a2a4fa6718a13eaeefcacedc8f8',ph,0],
 ['actual-own-unchanged-lessons','textbook',L,lh,lh,1],
 ['genuine-complete-canonical-plan-candidate','textbook',L,'d4e1910d60964ee4b9ac97eefbf0e0ed202fc28f',lh,0]
]){
 git(root,'merge-base','--is-ancestor',base,head);
 const argv=['build-scripts/workflows/check-paragraph-lane-scope.js','--lane',lane,'--cwd',root,'--base',base,'--head',head,'--json'];
 const run=spawnSync(process.execPath,argv,{cwd:P,encoding:'utf8',maxBuffer:24*1024*1024});
 assert.equal(run.error,undefined);const result=JSON.parse(run.stdout);
 comparisons.push({label,lane,cwd:P,target_cwd:root,base,head,argv,exit:run.status,result,stderr:run.stderr});
 assert.equal(run.status,expectedExit,label);assert.equal(result.ok,expectedExit===0,label);
}
const result={schema_version:1,status:'PASS_STRICT_OWN_PATHS_WITH_RETAINED_NATIVE_LIMITS',actor:'paragraph_224_builder',role:'independent214planreview',platform_base:pb,platform_payload:ph,lesson_base:lh,lesson_head:lh,own_platform_paths:expected,own_lesson_paths:[],comparisons,waiver:false,fake_anchor:false,review_verdict:'REVISE',production:false,scope_tail:['scope.js','scope.json','publication.md'].map(x=>prefix+x),later_index_tail:['reports/github-agent-index-platform.md','reports/github-agent-index-platform.json','reports/github-agent-index-lessen.md','reports/github-agent-index-lessen.json']};
fs.writeFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-scope.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:result.status,platform_paths:expected.length,lessons_changed:0,comparisons:comparisons.map(c=>({label:c.label,exit:c.exit,ok:c.result.ok,failures:c.result.failures,counts:Object.fromEntries(Object.entries(c.result.categories).map(([k,v])=>[k,v.length]))}))},null,2));
