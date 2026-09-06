const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{spawnSync,execFileSync}=require('child_process');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const baseP='aee047221564fad762df59754a849d3f08ce069b',baseL='bbc4adf5af47187d5e394efd8079f906e9914023';
const headP='180b19bf577da25138233d270ca72c9e0b01eb84',headL='180b02b915343f2f02d594b9e674a77eefa9aa39';
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-R2-';
const paths=(cwd,base,head)=>execFileSync('git',['diff','--name-only','-z',base,head],{cwd,encoding:'utf8'}).split('\0').filter(Boolean).sort();
const ownP=['operational-plan.md','probes.js','evidence.json','command-log.jsonl','command-log.md','result.md'].map(s=>prefix+s).sort();
const ownL=['Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.4 Gemengde opgaven/2.1.4-textbook-plan.md'];
assert.deepEqual(paths(root,baseP,headP),ownP);assert.deepEqual(paths(lessons,baseL,headL),ownL);
const comparisons=[];
for(const [label,lane,base,head,cwd] of [
 ['own-platform-evidence-only','shared',baseP,headP,root],
 ['genuine-complete-platform-candidate','shared','6eb34debb2210a2a4fa6718a13eaeefcacedc8f8',headP,root],
 ['own-canonical-lesson-plan','textbook',baseL,headL,lessons],
 ['genuine-complete-lesson-candidate','textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',headL,lessons]
]) {
 const args=['build-scripts/workflows/check-paragraph-lane-scope.js','--lane',lane,'--base',base,'--head',head,'--cwd',cwd,'--json'];
 const result=spawnSync(process.execPath,args,{cwd:root,encoding:'utf8',maxBuffer:20*1024*1024});
 assert.equal(result.error,undefined);const parsed=JSON.parse(result.stdout);
 comparisons.push({label,lane,base,head,cwd,argv:[process.execPath,...args],exit_code:result.status,result:parsed,stderr:result.stderr});
 assert.equal(parsed.categories.unknown.length,0);
 if(label!=='own-platform-evidence-only'){assert.equal(result.status,0,label);assert.equal(parsed.ok,true,label);}
}
const evidence={schema_version:1,status:'PASS_STRICT_OWN_SCOPE',task:'BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN',actor:'paragraph_214_builder',role:'original214planAuthor',platform_payload:headP,lesson_payload:headL,strict_own:{platform:ownP,lessons:ownL},comparisons,waiver:false,fake_source_anchor:false,production_release:false,scope_tail:['scope.js','scope.json','publication.md'].map(s=>prefix+s),terminal_index_tail:['reports/github-agent-index-platform.json','reports/github-agent-index-platform.md','reports/github-agent-index-lessen.json','reports/github-agent-index-lessen.md']};
fs.writeFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-R2-scope.json'),JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:evidence.status,own_platform:ownP.length,own_lessons:ownL.length,comparisons:comparisons.map(c=>({label:c.label,exit_code:c.exit_code,ok:c.result.ok,unknown:c.result.categories.unknown.length,failures:c.result.failures}))},null,2));
