const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{spawnSync,execFileSync}=require('child_process');
const root=path.resolve(__dirname,'../..'),lessonRoot=path.resolve(root,'../4veco-lessen');
const ph='f698b856513dc01e7a6633500d805d413b21a032',lh='bbc4adf5af47187d5e394efd8079f906e9914023';
const pb='572d1ea2ededaffd28afc44eeeca223252a58ec5',lb='d4e1910d60964ee4b9ac97eefbf0e0ed202fc28f';
const comparisons=[];
for(const [label,lane,base,head,cwd] of [
 ['own-platform-evidence-only','shared',pb,ph,root],
 ['genuine-complete-platform-candidate','shared','6eb34debb2210a2a4fa6718a13eaeefcacedc8f8',ph,root],
 ['own-canonical-lesson-plan','textbook',lb,lh,lessonRoot]
]) {
 const args=['build-scripts/workflows/check-paragraph-lane-scope.js','--lane',lane,'--base',base,'--head',head,'--cwd',cwd,'--json'];
 const r=spawnSync(process.execPath,args,{cwd:root,encoding:'utf8',maxBuffer:20*1024*1024});
 assert.equal(r.error,undefined);
 const result=JSON.parse(r.stdout);comparisons.push({label,lane,base,head,cwd,argv:args,exit_code:r.status,result,stderr:r.stderr});
 if(label!=='own-platform-evidence-only'){assert.equal(r.status,0);assert.equal(result.ok,true);}
}
const paths=(cwd,base,head)=>execFileSync('git',['diff','--name-only','-z',base,head],{cwd,encoding:'utf8'}).split('\0').filter(Boolean).sort();
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-';
const exactPlatform=['plan.md','command-log.jsonl','command-log.md','evidence.json','probes.js','result.md'].map(s=>prefix+s).sort();
const exactLesson=['Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.4 Gemengde opgaven/2.1.4-textbook-plan.md'];
assert.deepEqual(paths(root,pb,ph),exactPlatform);assert.deepEqual(paths(lessonRoot,lb,lh),exactLesson);
const result={schema_version:1,status:'PASS_STRICT_OWN_SCOPE',task:'BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN',actor:'paragraph_214_builder',platform_payload:ph,lesson_payload:lh,strict_own:{platform:exactPlatform,lessons:exactLesson},comparisons,waiver:false,fake_source_anchor:false,production_release:false,subsequent_scope_tail:['scope.js','scope.json','publication.md'].map(s=>prefix+s),subsequent_index_tail:['AGENT_GITHUB_ENTRY.md','RESEARCH_AGENT_MAP.md','RESEARCH_AGENT_MAP_REFERENCES.md','reports/url-index.md']};
fs.writeFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-scope.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:result.status,own_platform:exactPlatform.length,own_lessons:exactLesson.length,comparisons:comparisons.map(c=>({label:c.label,exit:c.exit_code,ok:c.result.ok,failures:c.result.failures,counts:Object.fromEntries(Object.entries(c.result.categories).map(([k,v])=>[k,v.length]))}))},null,2));
