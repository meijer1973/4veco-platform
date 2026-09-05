// Record actual immutable committed scope, not a synthetic source anchor.
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {execFileSync}=require('child_process');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const ph='994b6ec7eca2ef36fc522ac7862f7fdd24360d8c',lh='5e14325d70b6cc6aee643d9b57395c92b0904ffb';
const comparisons=[];
for(const [lane,base,head,cwd]of [['shared','6eb34debb2210a2a4fa6718a13eaeefcacedc8f8',ph,root],['textbook','25fbd9ba66f6ead59f512ec2eec1fd95159d834f',lh,lessons]]){
  const args=['build-scripts/workflows/check-paragraph-lane-scope.js','--lane',lane,'--base',base,'--head',head,'--json'];
  if(cwd===lessons)args.push('--cwd',lessons);
  const result=JSON.parse(execFileSync(process.execPath,args,{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024}));
  assert.equal(result.ok,true);assert.deepEqual(result.failures,[]);
  comparisons.push({lane,base,head,result});
}
const paths=execFileSync('git',['diff','--name-only','-z','3510fc4dd30c9c01f44111ecc022ae239e855758',ph],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-';
const own=new Set(['211-root-acceptance-r5-plan.md','211-root-acceptance-r5.md','211-root-qc-adoption-r5.js','211-root-qc-bindings-r5.json','211-acceptance-inventory-check-r5.js','211-acceptance-inventory-r5.json','output-manifest.md','command-log.md','command-log.jsonl'].map(x=>prefix+x));
assert.equal(paths.length,109);
for(const p of paths)assert(own.has(p)||p.startsWith(prefix+'211-R5-QC')||/^reports\/rendered-proof\/BOOK2-TEXTBOOK-PRODUCTION-1\/211-(paragraaf-9837e3a85f31|opgaven-97329415bacc|antwoorden-498b9a863eef)-r6\//.test(p),p);
const result={status:'PASS',platform_payload:ph,lesson_acceptance:lh,comparisons,strict_current_adoption_paths:paths,unknown:[],waiver:false};
fs.writeFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-211-root-publication-scope-r5.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:'PASS',platform_payload:ph,lesson_acceptance:lh,strict_current_adoption_paths:paths.length,comparisons:comparisons.map(c=>({lane:c.lane,base:c.base,head:c.head,counts:Object.fromEntries(Object.entries(c.result.categories).map(([k,v])=>[k,v.length]))})),waiver:false},null,2));
