'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const{spawnSync,execFileSync}=require('child_process');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const pb='e6fbd0517b60eeabe6ec1a2b13e8289672140b8f',ph='a3013e64bb2e7cea4c6fb5d6903dcf97b7f6ed85';
const lb='bbc4adf5af47187d5e394efd8079f906e9914023',lh='fdfa286e2984ceaccf9c65939ad9a2f1f1e0eb84';
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-R2-';
const authorPrefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-R2-';
const git=(cwd,...args)=>execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:24*1024*1024});
const files=(cwd,base,head)=>git(cwd,'diff','--name-only','-z',base,head).split('\0').filter(Boolean).sort();
const own=['operational-plan.md','probes.js','evidence.json','result.md','command-log.jsonl','command-log.md'].map(x=>prefix+x).sort();
const adopted=['operational-plan.md','probes.js','evidence.json','result.md','command-log.jsonl','command-log.md','scope.js','scope.json','publication.md'].map(x=>authorPrefix+x).sort();
assert.deepEqual(files(P,pb,ph),[...own,...adopted].sort());
const lesson=['Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.4 Gemengde opgaven/2.1.4-textbook-plan.md'];
assert.deepEqual(files(L,lb,lh),lesson);assert.deepEqual(files(L,'180b02b915343f2f02d594b9e674a77eefa9aa39',lh),[]);
const comparisons=[];
for(const[label,lane,root,base,head,expectedExit]of[
 ['actual-R2-evidence-only-platform','shared',P,pb,ph,1],
 ['genuine-complete-platform-candidate','shared',P,'6eb34debb2210a2a4fa6718a13eaeefcacedc8f8',ph,0],
 ['actual-R2-canonical-plan-adoption','textbook',L,lb,lh,0],
 ['genuine-complete-canonical-plan-candidate','textbook',L,'d4e1910d60964ee4b9ac97eefbf0e0ed202fc28f',lh,0]
]){
 git(root,'merge-base','--is-ancestor',base,head);
 const argv=['build-scripts/workflows/check-paragraph-lane-scope.js','--lane',lane,'--cwd',root,'--base',base,'--head',head,'--json'];
 const r=spawnSync(process.execPath,argv,{cwd:P,encoding:'utf8',maxBuffer:24*1024*1024});assert.equal(r.error,undefined);
 const result=JSON.parse(r.stdout);comparisons.push({label,lane,cwd:P,target_cwd:root,base,head,argv,exit:r.status,result,stderr:r.stderr});
 assert.equal(r.status,expectedExit,label);assert.equal(result.ok,expectedExit===0,label);
}
const result={schema_version:1,status:'PASS_STRICT_OWN_AND_IMPORTED_CUSTODY',actor:'paragraph_224_builder',role:'independent214planreview',platform_base:pb,platform_payload:ph,lesson_base:lb,lesson_payload:lh,own_review_paths:own,adopted_author_paths:adopted,adopted_lesson_paths:lesson,independent_lesson_authorship:[],comparisons,waiver:false,fake_anchor:false,review_verdict:'PASS_WITH_FLAGS',production_release:false,scope_tail:['scope.js','scope.json','publication.md'].map(x=>prefix+x),later_index_tail:['reports/github-agent-index-platform.md','reports/github-agent-index-platform.json','reports/github-agent-index-lessen.md','reports/github-agent-index-lessen.json']};
fs.writeFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-R2-scope.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:result.status,own_review:own.length,adopted_author:adopted.length,lesson:1,comparisons:comparisons.map(c=>({label:c.label,exit:c.exit,ok:c.result.ok,failures:c.result.failures,counts:Object.fromEntries(Object.entries(c.result.categories).map(([k,v])=>[k,v.length]))}))},null,2));
