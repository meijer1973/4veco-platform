const fs=require('fs'),{execFileSync}=require('child_process'),assert=require('assert/strict'),path=require('path');
const root=path.resolve(__dirname,'../..');
const ph='2b757f911b7118ce09aeec5878133ea0dc34fa15',lh='d4e1910d60964ee4b9ac97eefbf0e0ed202fc28f';
const result={status:'PASS',comparisons:[]};
for(const [lane,base,head,cwd]of [['shared','6eb34debb2210a2a4fa6718a13eaeefcacedc8f8',ph,null],['textbook','5e14325d70b6cc6aee643d9b57395c92b0904ffb',lh,'../4veco-lessen']]){
 const args=['build-scripts/workflows/check-paragraph-lane-scope.js','--lane',lane,'--base',base,'--head',head,'--json'];if(cwd)args.push('--cwd',cwd);
 const r=JSON.parse(execFileSync(process.execPath,args,{cwd:root,encoding:'utf8',maxBuffer:12*1024*1024}));assert.equal(r.ok,true);
 result.comparisons.push({lane,base,head,result:r});
}
const paths=execFileSync('git',['diff','--name-only','-z','b512fd64f6e621ecb5da6e7ba100ede6635628dc',ph],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
assert.equal(paths.length,140);
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-';
const own=['212-review-adoption-r7-plan.md','212-review-adoption-r7-check.js','212-review-adoption-r7-bindings.json','212-review-adoption-r7-result.md','212-successor-work-order.md','command-log.md','command-log.jsonl','output-manifest.md'].map(n=>prefix+n);
assert(paths.every(p=>own.includes(p)||p.startsWith(prefix+'212-R7-REVIEW-')));
result.strict_current_adoption_paths=paths;result.waiver=false;
fs.writeFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-212-review-adoption-r7-scope.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:'PASS',own_paths:paths.length,comparisons:result.comparisons.map(c=>({lane:c.lane,base:c.base,head:c.head,counts:Object.fromEntries(Object.entries(c.result.categories).map(([k,v])=>[k,v.length])),failures:c.result.failures,warnings:c.result.warnings}))},null,2));
