// Fixed current paragraph-review adoption; not a successor-pin/full-root-build claim.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const {execFileSync}=require('child_process');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-', rp=prefix+'212-R7-REVIEW-',e=path.join(__dirname,rp+'evidence');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=p=>fs.readFileSync(p),json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const git=(cwd,args)=>execFileSync('git',args,{cwd,maxBuffer:32*1024*1024});
const names=(cwd,a,b)=>git(cwd,['diff','--name-only','-z',a,b]).toString('utf8').split('\0').filter(Boolean);
const imported='7886564699250f18ce5b3221d649d62e6ed1243c',reviewL='91645da0247f793a8b6b19ae94a92c6bd8fee282';
const oldP='b512fd64f6e621ecb5da6e7ba100ede6635628dc',accepted211='5e14325d70b6cc6aee643d9b57395c92b0904ffb';
const bindings=[];
function check(file,h){assert.equal(sha(read(file)),h,file);bindings.push({path:path.relative(root,file).replaceAll('\\','/'),sha256:h});}
const importedPaths=names(root,'be806c2900b74807ff6c6efb7debde3a15fdc95f',imported);
assert.equal(importedPaths.length,132);
for(const f of importedPaths){assert(f.startsWith('reports/sprints/'+rp),f);check(path.join(root,f),sha(git(root,['show',imported+':'+f])));}
assert.deepEqual(names(root,oldP,'8e00eee0252993bee69f94a3ebb1414e03b8ef49').sort(),[...importedPaths,'reports/sprints/'+prefix+'212-review-adoption-r7-plan.md'].sort());
const bindingFile=path.join(e,'inspection-binding.json');check(bindingFile,'d23a42b13b3ae436f80e327ee33746eba56a570aa9bbb099448e6dc12a00ff1c');
const b=json(bindingFile);assert.equal(b.result,'PASS_WITH_FLAGS');assert.equal(b.actual_agent,'/root/paragraph_213_r7_independent_review');
assert.equal(b.specialist_QC,'PENDING');assert.equal(b.combined_root_full_build,'NOT_CLAIMED');
check(path.join(lessons,b.canonical_review),'79429b9f1750710baae46751a5792e4a02e7c177888a01f5ca3a15c4039a78f7');
assert.deepEqual(read(path.join(lessons,b.canonical_review)),git(lessons,['show',reviewL+':'+b.canonical_review]));
assert.deepEqual(names(lessons,accepted211,'HEAD'),[b.canonical_review]);
check(path.join(e,'old-canonical-review.md'),'74ad2ed9c44d9aa05b6d6a680d5d273f2cad4b62e4bead5db303c006514238cd');
const priorRoot='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/';
const successor={
 '2.1.1 Kostenstructuren – antwoorden.html':'b2e86d7bae4d1bdbb7cd47a55cd6e83254398618f0954fe3ce09cdb75927c916',
 '2.1.1 Kostenstructuren – antwoorden.md':'f7572e3d4f2fc5bc092562eb06e76ebb0480fbbc8aa1ea01d3752a7251cbbdc9',
 '2.1.1 Kostenstructuren – antwoorden.pdf':'498b9a863eef9c0feefd50e8a50e72aa41c626caaca79f0b98261b8b3104e5ce',
 '2.1.1-review.md':'a75755c7c2e6cdffb2defcbb5403814cf854d87bfae9a8172dd768aadb5b8023',
 '2.1.1-quality-ref.yaml':'c85c44a53d46af87ad61500b83b0fd721fac43c97ffd1be3d512308158a4b9f5',
 '2.1.1-textbook-handoff.md':'0d14506e314a11fef0637cc66cf29036f174b94cafbf7fa5ede2eff88937500f'
};
const succession=[];
for(const r of b.protected_unchanged){
 const repo=r.repo==='lessons'?lessons:root;
 const key=r.path.startsWith(priorRoot)?r.path.slice(priorRoot.length):'';
 if(r.repo==='lessons'&&Object.hasOwn(successor,key)){
  assert.equal(sha(git(lessons,['show',b.candidate_lessons+':'+r.path])),r.sha256);
  assert.equal(sha(git(lessons,['show',accepted211+':'+r.path])),successor[key]);
  check(path.join(repo,r.path),successor[key]);succession.push({path:r.path,old:r.sha256,current:successor[key],accepted_commit:accepted211});
 }else check(path.join(repo,r.path),r.sha256);
}
assert.equal(succession.length,6);
for(const [f,h]of Object.entries(b.reports))check(path.join(root,f),h);
for(const [f,h]of Object.entries(b.native34))check(path.join(lessons,f),h);
assert.equal(Object.keys(b.native34).length,34);
for(const [f,h]of Object.entries(b.evidence))check(path.join(e,f),h);
for(const [f,r]of Object.entries(b.commands)){check(path.join(e,f),r.sha256);assert.equal(json(path.join(e,f)).exit,r.exit);}
let allPages=0,viewed=0;
for(const r of b.native_manifests){
 const file=path.join(root,r.path);check(file,r.sha256);const m=json(file);
 assert.equal(m.inspection_status,'PENDING');assert.deepEqual(m.pages_inspected,[]);
 for(const [n,h]of Object.entries(m.page_sha256)){check(path.join(path.dirname(file),'pages',n),h);allPages++;if(r.personally_viewed)viewed++;}
}
assert.equal(allPages,54);assert.equal(viewed,27);
for(const a of b.figures){
 const n=a.grayscale_path.replaceAll('\\','/'),start='C:/wt/book2-212-r7-review-20260906/4veco-platform/';
 assert(n.startsWith(start));check(path.join(root,n.slice(start.length)),a.grayscale_sha256);
}
assert.equal(b.figures.length,11);
const cli=json(path.join(e,'command-native-cli-r9.json'));assert.equal(cli.exit,0);
assert.equal(json(path.join(e,'command-native-full.json')).exit,3221225477);
const printed=json(path.join(e,'direct-print-only.json'));assert.equal(printed.result,'PASS');assert.deepEqual(printed.native34,b.native34);
const result={status:'PASS',imported_paths:importedPaths.length,checks:bindings.length,native_files:34,protected_rows:b.protected_unchanged.length,succession,proof_pages_preserved:allPages,personally_inspected_by_reviewer:viewed,figures:11,current_212_QC:'PENDING',current_212_handoff:'STALE_UNCHANGED',combined_root_full_build:'NOT_RUN_TWO_OLD_211_PINS_PENDING_S1',bindings};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({...result,bindings:undefined},null,2));
