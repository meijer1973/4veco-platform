'use strict';
// Fixed root plan adoption. No pupil production and no foreign-helper writes.
const fs=require('fs'),path=require('path'),cp=require('child_process'),a=require('assert/strict'),crypto=require('crypto');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen'),prefix='BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-ROOT';
const BP='a6452bdb94424ceef891de2a24e34a8295715326',BL='8a3d4018ad6a5082449a17c59f991cbdc93fbb62';
const rel='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.2 Producentensurplus en totaal surplus/2.3.2-textbook-plan.md';
const PCs=['99d9803c9946e184b9d386c28edef22aeeaab972','bb44cc15976b631289d83e7a344db829ed109e56','3d6f64700590e14bb132355a168dcc7b24318901',
 '69649b3eff09f42a51f9cfded8328d5e3e410401','07209895b0d4b9253df51774520adf5c003e6008','049c52976e749f233fe654618c9657f01aa988f4',
 '8a9113d4801f9c2d71b28e9e3b144a5485893858','2be84d80f7ab2dfa793ce8b2dc3742a438d4517e','17e04cea7ca688618149c2e50b8ec62ad55c80d8','30a65abe8a2c572c09aa8dc1086c40c5e16b641f',
 '9eefd24484ad7f69eb9c032328de23fedf650c5a','476ea399641631c6333c29c6153cd85d471dc78f','15ce2b4bb0ddaa7ce326f1c18d288895598d6fc2'];
const LCs=['9daf4b8a9696fcdce1d485d85dbc0c59b7b6dbe6','266881cb2d9e7f078192a2a3bab230f9bfc4176e'];
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,maxBuffer:128*1024*1024});
const gs=(cwd,...args)=>git(cwd,...args).toString('utf8').trim(),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const names=(cwd,...args)=>git(cwd,...args).toString('utf8').split('\0').filter(Boolean);
const save=(name,value)=>fs.writeFileSync(path.join(__dirname,prefix+'-'+name+'.json'),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const read=name=>JSON.parse(fs.readFileSync(path.join(__dirname,prefix+'-'+name+'.json')));
function tree(cwd,ref){return new Map(names(cwd,'ls-tree','-r','-z',ref).map(s=>{const i=s.indexOf('\t');return[s.slice(i+1),s.slice(0,i).split(' ')[2]];}));}
function rawTree(cwd,files){const ns=[...files.keys()],actual=cp.execFileSync('git',['-c','core.longpaths=true','hash-object','--no-filters','--stdin-paths'],{cwd,input:ns.map(n=>JSON.stringify(n)).join('\n')+'\n',encoding:'utf8',maxBuffer:128*1024*1024}).trim().split(/\r?\n/);a.equal(actual.length,ns.length);ns.forEach((n,i)=>a.equal(actual[i],files.get(n),n));return ns.length;}
function command(label,argv,expected=0,cwd=P){const start=new Date().toISOString(),r=cp.spawnSync(argv[0],argv.slice(1),{cwd,env:{...process.env,PYTHONIOENCODING:'utf-8',PYTHONDONTWRITEBYTECODE:'1'},maxBuffer:128*1024*1024});
 const rec={argv,cwd,started:start,ended:new Date().toISOString(),exit_code:r.status,stdout:r.stdout.toString('utf8'),stderr:r.stderr.toString('utf8'),stdout_base64:r.stdout.toString('base64'),stderr_base64:r.stderr.toString('base64')};save(label+'-process',rec);if(expected!==null)a.equal(r.status,expected,JSON.stringify(rec));return rec;}
function custody(){const b=read('baseline'),result=[];
 for(const[row,cwd]of[[b.platform,P],[b.lessons,L]]){const now=tree(cwd,'HEAD');for(const[n,blob]of row.tree)a.equal(now.get(n),blob,'Existing file changed: '+n);result.push({repository:path.basename(cwd),prior_files_unchanged:row.tree.length,actual_raw_tracked_exact:rawTree(cwd,now)});}
 for(const row of b.imported_platform_files){a.equal(gs(P,'rev-parse','HEAD:'+row.path),row.git_blob,row.path);a.equal(hash(fs.readFileSync(path.join(P,row.path))),row.raw_sha256,row.path);}
 const plan=fs.readFileSync(path.join(L,rel));a.equal(hash(plan),'d0781ffb6d2966209c3a160309316ce92ebc0455fa51d4235ccc6840afa58935');a(plan.equals(git(L,'show',LCs[1]+':'+rel)));
 const pdelta=names(P,'diff','--name-only','-z',BP,'HEAD'),allowed=new Set(b.imported_platform_files.map(r=>r.path));a(pdelta.every(n=>allowed.has(n)||n.startsWith('reports/sprints/'+prefix+'-')));
 a.deepEqual(names(L,'diff','--name-only','-z',BL,'HEAD'),[rel]);return {result,imported_files_exact:allowed.size,plan_raw_sha256:hash(plan)};}
const mode=process.argv[2];
if(mode==='baseline'){
 a.equal(gs(P,'rev-parse','HEAD'),BP);a.equal(gs(L,'rev-parse','HEAD'),BL);a.equal(gs(L,'status','--porcelain'),'');
 const pt=tree(P,BP),lt=tree(L,BL);rawTree(P,pt);rawTree(L,lt);a(!lt.has(rel));const files=new Map(),commits=[];
 for(let i=0;i<PCs.length;i++){const c=PCs[i],paths=names(P,'diff-tree','--no-commit-id','--name-only','--no-renames','-r','-z',c);a(paths.length>0);
  const allowed='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-'+(i<3?'232-PLAN-':i<6?'232-PLAN-REVIEW-':i<10?'232-PLAN-F1-':'232-F1-REVIEW-');
  for(const n of paths){a(n.startsWith(allowed),n);a(!pt.has(n),'Root collision: '+n);const bytes=git(P,'show',c+':'+n);files.set(n,{path:n,source_commit:c,git_blob:gs(P,'rev-parse',c+':'+n),raw_sha256:hash(bytes)});}
  commits.push({source_commit:c,paths});}
 for(const c of LCs)a.deepEqual(names(L,'diff-tree','--no-commit-id','--name-only','--no-renames','-r','-z',c),[rel]);
 save('baseline',{platform:{head:BP,tree:[...pt]},lessons:{head:BL,tree:[...lt]},platform_commits:commits,lesson_commits:LCs,imported_platform_files:[...files.values()],excluded_all_foreign_indexes:true});
 console.log(JSON.stringify({status:'PASS',platform:pt.size,lessons:lt.size,commits:commits.length,imported_files:files.size}));
}else if(mode==='import'){
 const b=read('baseline');a.equal(gs(P,'rev-parse','HEAD'),BP);a.equal(gs(L,'rev-parse','HEAD'),BL);const mapping=[];
 for(const[cwd,commits]of[[P,PCs],[L,LCs]])for(const c of commits){const before=gs(cwd,'rev-parse','HEAD');command('import-'+path.basename(cwd)+'-'+c.slice(0,8),['git','cherry-pick',c],0,cwd);const adopted=gs(cwd,'rev-parse','HEAD');mapping.push({repository:path.basename(cwd),source_commit:c,adopted_parent:before,adopted_commit:adopted});console.log(path.basename(cwd)+' '+c+' -> '+adopted);}
 save('import-mapping',{mapping,original_platform_input:b.platform.head,original_lessons_input:b.lessons.head});
 console.log(JSON.stringify(custody()));
}else if(mode==='verify'){
 const original=read('baseline');a.equal(original.platform.head,BP);const before=custody();
 const book='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus',c23=book+'/2.3 Hoofdstuk Surplus en welvaart',p213=book+'/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten';
 const pins=[[book+'/_book-plan.md','b6ae8e07e05337838dc38b2838a6e5db43b2e153569fa5bc490cf4bfeb8d7a76'],
  [c23+'/_chapter-plan.md','e8a07bfe212a6ae817db99fecb93e86812e1d9e9af533b7ef21591bbb9025dc7'],
  [c23+'/2.3.1 Consumentensurplus/2.3.1-review.md','8f86129b14ef508e16f41d918299da7af2422655ff14fc9ba91b68a9b66e8943'],
  [c23+'/2.3.1 Consumentensurplus/2.3.1-quality-ref.yaml','312ca25c21bf6428ded5162f2d299b8e73da25219fbb914cad88dcb8ca47820a'],
  [c23+'/2.3.1 Consumentensurplus/2.3.1-textbook-handoff.md','69bdae1f9dd0efaace0a90db57e6ac0f17db627f93fdb333b48dafeb36eebe79'],
  [p213+'/2.1.3-review.md','5064642034fac9763202d2424b87cef2f7cc909aaf3a6031b90d247ee44409c3'],
  [p213+'/2.1.3-quality-ref.yaml','c96a4af45cfbf6c43ceda27ecf6dd231c75667ece58b378b9080975fe4be717f']];
 for(const[n,h]of pins)a.equal(hash(fs.readFileSync(path.join(L,n))),h,n);a.equal(fs.existsSync(path.join(L,p213,'2.1.3-textbook-handoff.md')),false);
 save('current-prerequisite-boundary',{pins: pins.map(([file,raw_sha256])=>({file,raw_sha256})),current213_handoff_absent:true,plan_adoption_not_production_release:true});
 const author=command('F1-author-current',['C:/Python314/python.exe','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-F1-check.py']);a.equal(JSON.parse(author.stdout).negative_count,96);
 const review=command('F1-independent-current',['C:/Python314/python.exe','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-F1-REVIEW-check.py']);a.equal(JSON.parse(review.stdout).checks_count,166);a.equal(JSON.parse(review.stdout).negative_count,37);
 const gates=[];for(const[name,args]of[
  ['structural',['build-scripts/workflows/check-book-outline-currentness.js']],
  ['goal-design',['build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','goal_design','--paragraph','2.3.2']],
  ['durable',['build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']],
  ['bundle',['build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1']]])gates.push({name,exit:command(name,['node',...args]).exit_code});
 const after=custody();a.deepEqual(after,before);save('verification',{status:'PASS',actor:'codex-root',custody:after,attributed_author_negative_count:96,attributed_distinct_review_assertions:166,attributed_distinct_review_negative_count:37,gates,verdict:'PLAN PASS ADOPTED',production_release:'PENDING ACTUAL ACCEPTED213 MANIFEST AND INDEPENDENT RELEASE REVIEW',pupil_or_rendered_acceptance:false});console.log(JSON.stringify({status:'PASS',...after,gates}));
}else if(mode==='scopes'){
 const head=process.argv[3];a.match(head,/^[a-f0-9]{40}$/);a.equal(gs(P,'rev-parse','HEAD'),head);a.equal(gs(P,'status','--porcelain'),'');a.equal(gs(L,'status','--porcelain'),'');
 const exact=custody(),lh=gs(L,'rev-parse','HEAD'),scopes=[];
 for(const[label,cwd,lane,b,h,expected]of[
  ['increment-platform',P,'shared',BP,head,1],['increment-lessons',L,'textbook',BL,lh,0],
  ['complete-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',head,0],
  ['complete-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',lh,0]]){
  const r=command('scope-'+label,['node','build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',b,'--head',h,'--json'],expected);const v=JSON.parse(r.stdout);a.equal(v.categories.unknown.length,0);a.equal(v.ok,expected===0);scopes.push({label,exit:r.exit_code,ok:v.ok,counts:Object.fromEntries(Object.entries(v.categories).map(([k,rows])=>[k,rows.length]))});
 }
 const mapping=read('import-mapping').mapping,preResult=mapping.filter(r=>r.repository==='4veco-platform').at(-1).adopted_commit;
 const whitespace=[];for(const[label,cwd,args,expected]of[
  ['adoption-default',P,['diff','--check',BP,head],null],['adoption-cr',P,['-c','core.whitespace=cr-at-eol','diff','--check',BP,head],null],
  ['root-only',P,['diff','--check',preResult,head],0],['lessons',L,['diff','--check',BL,lh],0],
  ['complete-default',P,['diff','--check','96416b6b5bd57094576e9aba0a42d682584ec479',head],null]])whitespace.push({label,exit:command('whitespace-'+label,['git',...args],expected,cwd).exit_code});
 save('scope',{status:'PASS',platform:{base:BP,head},lessons:{base:BL,head:lh},strict_custody:exact,scopes,whitespace,no_foreign_normalization:true});console.log(JSON.stringify({status:'PASS',head,scopes,whitespace}));
}else throw Error('baseline/import/verify/scopes');
