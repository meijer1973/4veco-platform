// Root plan adoption only: actual custody and independent arithmetic, no output build.
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),a=require('assert/strict'),crypto=require('crypto');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-214-plan-root';
const pb='0b15d6bfa75fa62e00e5945e16a7cd8f9a7f6bf6',lb='3199ff2ae89b39a472b48ee0818de5b1c191063a';
const source='0bcfb90a905d6a6c9d3a8bedeba9ae99349e1172',lh='30f57bfad2096c7afa507da48db9d82ee35a3c23';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),raw=n=>hash(fs.readFileSync(n));
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,maxBuffer:64*1024*1024});
const checks=[],eq=(n,x,y)=>{a.deepEqual(x,y,n);checks.push(n);};
function tree(cwd,ref){return new Map(git(cwd,'ls-tree','-r','-z',ref).toString().split('\0').filter(Boolean).map(s=>{const i=s.indexOf('\t');return[s.slice(i+1),s.slice(0,i).split(' ')[2]];}));}
const plan='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.4 Gemengde opgaven/2.1.4-textbook-plan.md';
const bytes=fs.readFileSync(path.join(L,plan)),text=bytes.toString('utf8');
eq('raw plan',hash(bytes),'a6f71553e887acdf7b94be5d411303660b9fad2ef8745cb25986636aa49b4cc4');
eq('LF plan',hash(text.replaceAll('\r\n','\n')),hash(bytes));
eq('exact author plan bytes',bytes,git(L,'show','180b02b915343f2f02d594b9e674a77eefa9aa39:'+plan));
const old=git(L,'show','bbc4adf5af47187d5e394efd8079f906e9914023:'+plan).toString().trimEnd().split('\n'),lines=text.trimEnd().split('\n');
eq('line counts',[old.length,lines.length],[621,621]);
const delta=lines.flatMap((s,i)=>s===old[i]?[]:[i+1]);
eq('exact original-author delta',delta,[3,276,518,519,520,524,525,547,550,551,552,591,592,593,594,595,596]);
const prior=tree(L,lb),current=tree(L,lh);
for(const [name,blob]of prior)eq('unchanged lesson '+name,current.get(name),blob);
eq('only one added lesson file',[...current.keys()].filter(n=>!prior.has(n)),[plan]);
eq('current lesson HEAD',git(L,'rev-parse','HEAD').toString().trim(),lh);
eq('clean lessons',git(L,'status','--porcelain').toString().trim(),'');
const sourceTree=tree(P,source),imports=[];
for(const [name,blob]of sourceTree)if(name.startsWith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-')){
  const original=git(P,'show',source+':'+name);eq('import bytes '+name,fs.readFileSync(path.join(P,name)),original);
  imports.push({path:name,commit:source,git_blob:blob,sha256:hash(original)});
}
eq('four complete nine-file author/reviewer evidence families',imports.length,36);
for(const [name,h]of[
 ['214-PLAN-REVIEW-result.md','db8f4ca1999abb705dc7612b4ad4341110371c444f98956792479e817b55c5fd'],
 ['214-PLAN-REVIEW-R2-result.md','35c868b0de2a5c06b6ba0acbcdddb622eb807f3ad23f07c7b1e8a311e84eed66'],
 ['214-PLAN-R2-evidence.json','16785369683bec0c48efa3b333e2fe87a0e91f0550a62b84db7c8125ad762264'],
 ['214-PLAN-REVIEW-R2-evidence.json','85a846734794903082f0cd74f2ca46e306efe25857a9a930ebee5e2521384e33']])eq(name,raw(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-'+name)),h);
const record=JSON.parse(fs.readFileSync(path.join(P,'references/authored/course-target-exercises.json'),'utf8')).exercises.find(r=>r.id==='2.1.4');
eq('complete frozen record',hash(JSON.stringify(record)),'fda623dc9a3620724bf9df22a3ef937fd26779fa49d4d2b0b7c6baa862753691');
// New root calculations, not replayed author/reviewer assertions.
const q=[0,20,40,45,55],tk=[100,150,200,220,275],to=q.map(n=>6*n);
eq('same-day receipts',to,[0,120,240,270,330]);
eq('signed total profits',to.map((v,i)=>v-tk[i]),[-100,-30,40,50,55]);
const mk=q.slice(1).map((v,i)=>(tk[i+1]-tk[i])/(v-q[i])),mo=q.slice(1).map((v,i)=>(to[i+1]-to[i])/(v-q[i]));
eq('unequal intervals',mk,[2.5,2.5,4,5.5]);eq('same interval MO',mo,[6,6,6,6]);
eq('normalized profit changes',mo.map((v,i)=>v-mk[i]),[3.5,3.5,2,.5]);
eq('all average rows',[20,40].map(n=>[100/n,2.5,(100+2.5*n)/n]),[[5,2.5,7.5],[2.5,2.5,5]]);
eq('first whole no-loss',[Math.floor(200/7),Math.round(200/7),Math.ceil(200/7),3.5*28-100,3.5*29-100],[28,29,29,-2,1.5]);
eq('nearest is not general no-loss',[Math.round(28.2),Math.ceil(28.2)],[28,29]);
const targetTK=[2600,2900,3250,3650],targetTO=[3500,4000,4500,5000];
eq('target BE and totals',[1200/(5-2),1200+2*400,5*400],[400,2000,2000]);
eq('target interval MK',targetTK.slice(1).map((v,i)=>(v-targetTK[i])/100),[3,3.5,4]);
eq('target interval MO',targetTO.slice(1).map((v,i)=>(v-targetTO[i])/100),[5,5,5]);
eq('target profit levels',targetTO.map((v,i)=>v-targetTK[i]),[900,1100,1250,1350]);
eq('target group gains',[5-3,5-3.5,5-4].map(n=>100*n),[200,150,100]);
eq('target GTK fraction',2600*7,700*26);
eq('bonus base/fee/price/both',[240-200,240-220,260-200,260-220],[40,20,60,40]);
eq('bonus same-interval changes',[(220-170)/20,(260-130)/20],[2.5,6.5]);
eq('closing GTK numerator equivalence',220*9,45*44);eq('closing MK',(220-200)/(45-40),4);
const budget=text.slice(text.indexOf('| Item | Read/select |'),text.indexOf('Core = orientation1'));
const timing=budget.split('\n').filter(s=>/^\|[^|]+\|[\d.]+\|/.test(s)).map(s=>s.split('|').slice(2,6).map(Number));
eq('all actual timing rows',timing.length,15);
for(const row of timing)eq('actual timing row',row[0]+row[1]+row[2],row[3]);
eq('whole core/support/all printed budgets',[timing.reduce((v,r)=>v+r[3],0),54+6,54+6+8+4],[54,60,72]);
eq('source font unit conversion',[34*72/96,40*72/96],[25.5,30]);
const placed=40*166*72/25.4/1200;a(placed>=12&&Math.abs(placed-15.685039370078742)<1e-10);
for(const s of ['build-scripts/content/book-2/b2_214.py','No current ink-fit PASS.','UNOBSERVED','WAIT_FOR_INDEPENDENT_214_PLAN_AND_CURRENT_212_213_ACCEPTED_SUCCESSORS_AND_ROOT_RELEASE'])a(text.includes(s),s);
eq('future builder absent',fs.existsSync(path.join(P,'build-scripts/content/book-2/b2_214.py')),false);
const commands=[];
for(const args of [
 ['build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','goal_design','--paragraph','2.1.4'],
 ['build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','specialist_review','--paragraph','2.1.4'],
 ['build-scripts/workflows/check-book2-target-authority-remediation.js','--durable'],
 ['build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1']]){
  const r=cp.spawnSync(process.execPath,args,{cwd:P,maxBuffer:32*1024*1024});
  const c={args,exit_code:r.status,stdout:r.stdout.toString('utf8'),stderr:r.stderr.toString('utf8'),stdout_base64:r.stdout.toString('base64'),stderr_base64:r.stderr.toString('base64')};commands.push(c);a.equal(r.status,0,JSON.stringify(c));
}
const output={status:'PASS',decision:'PLAN_ACCEPTED_WITH_FLAGS',root_production_release:'PENDING actual accepted212/213 and separate root release',platform_base:pb,source_evidence_commit:source,lessons_base:lb,lessons_head:lh,plan:{path:plan,sha256:hash(bytes),lines:621,changed_lines:delta},imports,old_lesson_files_unchanged:prior.size,checks,math:{q,tk,to,mk,mo,placed_pt:placed,timing},commands,rendered_proof:'NOT_RUN_PLAN_ONLY',classroom:'UNOBSERVED'};
fs.writeFileSync(path.join(__dirname,prefix+'-check.json'),JSON.stringify(output,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:output.status,decision:output.decision,plan:output.plan,imports:imports.length,old_lesson_files_unchanged:prior.size,checks:checks.length,commands:commands.map(c=>({args:c.args,exit_code:c.exit_code})),production_release:output.root_production_release},null,2));
