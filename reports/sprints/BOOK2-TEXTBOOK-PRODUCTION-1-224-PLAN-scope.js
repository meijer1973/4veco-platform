/* Exact own committed payload scope; no worktree mutation outside this report. */
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {execFileSync,spawnSync}=require('child_process');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-224-PLAN';
const PBASE='35e0bebb75cc3987c43dd8f480e1b444bd877f4a',LBASE='219a977e495abe43c17949e7d8996aab4176faa0';
const plan='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.4 Gemengde opgaven elasticiteit/2.2.4-textbook-plan.md';
const git=(cwd,args)=>execFileSync('git',args,{cwd,encoding:'utf8'}).trim();
const phead=git(P,['rev-parse','HEAD']),lhead=git(L,['rev-parse','HEAD']);
const changed=(cwd,base,head)=>git(cwd,['diff','--name-only','-z',base,head]).split('\0').filter(Boolean);
const ppaths=changed(P,PBASE,phead),lpaths=changed(L,LBASE,lhead);
assert.ok(ppaths.length>0);
assert.ok(ppaths.every(x=>x.startsWith(`reports/sprints/${prefix}-`)),ppaths.join('\n'));
assert.deepEqual(lpaths,[plan]);
const native=(cwd,lane,base,head)=>{
 const args=['build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',base,'--head',head,'--json'];
 const run=spawnSync(process.execPath,args,{cwd:P,encoding:'utf8',maxBuffer:5*1024*1024});
 return {args,exit_code:run.status,stdout:run.stdout,stderr:run.stderr};
};
const report={platform_base:PBASE,platform_payload:phead,lesson_base:LBASE,lesson_payload:lhead,
 strict_owned_paths:'PASS',platform_paths:ppaths,lesson_paths:lpaths,
 platform_native_shared:native(P,'shared',PBASE,phead),lesson_native_textbook:native(L,'textbook',LBASE,lhead),
 boundary:'An evidence-only platform native FAIL is retained verbatim, not waived by an invented anchor. Separate strictly owned actual paths are the task-scope proof. No source/target/native output, review/QC/handoff or PR change.'};
assert.equal(report.lesson_native_textbook.exit_code,0);
fs.writeFileSync(path.join(__dirname,`${prefix}-scope.json`),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
