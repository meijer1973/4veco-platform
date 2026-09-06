'use strict';
// Root technical adoption; current specialist/paragraph acceptance is separate.
const fs=require('fs'),path=require('path'),cp=require('child_process'),a=require('assert/strict'),crypto=require('crypto');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen'),prefix='BOOK2-TEXTBOOK-PRODUCTION-1-213-S1-ROOT';
const BP='2b31eb371fc83858b03dad379a59db163b1349de',BL='9f9729a9b4a55805d9e24bf53f712f1b02f6e00a',old='50db4c5da142812f47bf02219e393447caedecfb';
const gen='build-scripts/content/book-2/b2_213.py',test='build-scripts/content/book-2/213/test_succession.py';
const rel='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten';
const commits=['4a554641292b6bc180b71f1d55bcdc83a35e591f','ff53e927a7da0d553c71a7fb914edfff276ba397','8fd54c00665f02c96806a85d453f0bd69cdd8394','8fc91b3aae7afc03b9e7b6d128b659b412547f9d','f57af0874238ef951b5b03a16ecd411f87224482',
 '362d5460abf58d1be241e58a695b784e9953b290','85e373b13e87442728def73946a9eab30577735a','d54e0ff0afc517a3910fdbd9a276ae03bdbf9bcd','1fb2be8bebb342585ecca835fe54b8648025cddb'];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,maxBuffer:128*1024*1024});
const gs=(cwd,...args)=>git(cwd,...args).toString('utf8').trim(),names=(cwd,...args)=>git(cwd,...args).toString('utf8').split('\0').filter(Boolean);
const save=(n,v)=>fs.writeFileSync(path.join(__dirname,prefix+'-'+n+'.json'),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const read=n=>JSON.parse(fs.readFileSync(path.join(__dirname,prefix+'-'+n+'.json')));
function tree(cwd,ref){return new Map(names(cwd,'ls-tree','-r','-z',ref).map(s=>{const i=s.indexOf('\t');return[s.slice(i+1),s.slice(0,i).split(' ')[2]];}));}
function rawTree(cwd,files){const ns=[...files.keys()],actual=cp.execFileSync('git',['-c','core.longpaths=true','hash-object','--no-filters','--stdin-paths'],{cwd,input:ns.map(n=>JSON.stringify(n)).join('\n')+'\n',encoding:'utf8',maxBuffer:128*1024*1024}).trim().split(/\r?\n/);a.equal(actual.length,ns.length);ns.forEach((n,i)=>a.equal(actual[i],files.get(n),n));return ns.length;}
function command(label,argv,expected=0,cwd=P){const started=new Date().toISOString(),r=cp.spawnSync(argv[0],argv.slice(1),{cwd,env:{...process.env,PYTHONIOENCODING:'utf-8',PYTHONDONTWRITEBYTECODE:'1'},maxBuffer:128*1024*1024});
 const rec={argv,cwd,started,ended:new Date().toISOString(),inherited_PATH_sha256:hash(process.env.PATH||''),exit_code:r.status,stdout:r.stdout.toString('utf8'),stderr:r.stderr.toString('utf8'),stdout_base64:r.stdout.toString('base64'),stderr_base64:r.stderr.toString('base64')};save(label+'-process',rec);if(expected!==null)a.equal(r.status,expected,JSON.stringify(rec));return rec;}
function custody(){const b=read('baseline'),rows=[];
 for(const[cwd,key]of[[P,'platform'],[L,'lessons']]){const now=tree(cwd,'HEAD');for(const[n,blob]of b[key].tree)if(cwd!==P||n!==gen)a.equal(now.get(n),blob,n);rows.push({repository:key,inherited_files_checked:b[key].tree.length,generator_only_exception:cwd===P,actual_raw_git_exact:rawTree(cwd,now)});}
 for(const r of b.imports){a.equal(gs(P,'rev-parse','HEAD:'+r.path),r.git_blob,r.path);a.equal(hash(fs.readFileSync(path.join(P,r.path))),r.raw_sha256,r.path);}
 a.equal(gs(L,'rev-parse','HEAD'),BL);a.equal(gs(L,'status','--porcelain'),'');const allowed=new Set(b.imports.map(r=>r.path));a(names(P,'diff','--name-only','-z',BP,'HEAD').every(n=>allowed.has(n)||n.startsWith('reports/sprints/'+prefix+'-')));
 a.equal(hash(fs.readFileSync(path.join(L,rel,'2.1.3-review.md'))),'5064642034fac9763202d2424b87cef2f7cc909aaf3a6031b90d247ee44409c3');a.equal(hash(fs.readFileSync(path.join(L,rel,'2.1.3-quality-ref.yaml'))),'c96a4af45cfbf6c43ceda27ecf6dd231c75667ece58b378b9080975fe4be717f');a.equal(fs.existsSync(path.join(L,rel,'2.1.3-textbook-handoff.md')),false);
 return{rows,imported_files:b.imports.length,lesson_changes:0,canonical_review_unchanged:true,stale_qc_unchanged:true,handoff_absent:true};}
const mode=process.argv[2];
if(mode==='baseline'){
 a.equal(gs(P,'rev-parse','HEAD'),BP);a.equal(gs(L,'rev-parse','HEAD'),BL);a.equal(gs(L,'status','--porcelain'),'');const pt=tree(P,BP),lt=tree(L,BL);rawTree(P,pt);rawTree(L,lt);
 const original=git(P,'show',old+':'+gen);a.equal(hash(original),'6a45771783de221c3d65b32d423c1f7e90c90e84a79d30c4e175bba8836b056a');a(fs.readFileSync(path.join(P,gen)).equals(original));a(!pt.has(test));const imports=new Map(),changes=[];
 for(let i=0;i<commits.length;i++){const c=commits[i],ns=names(P,'diff-tree','--no-commit-id','--no-renames','--name-only','-r','-z',c);a(ns.length>0);for(const n of ns){a((i===1&&[gen,test].includes(n))||n.startsWith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-S1-'+(i<5?'':'REVIEW-')),n);a(n===gen||!pt.has(n),'Unexpected existing root path: '+n);const bytes=git(P,'show',c+':'+n);imports.set(n,{path:n,source_commit:c,git_blob:gs(P,'rev-parse',c+':'+n),raw_sha256:hash(bytes)});}changes.push({commit:c,paths:ns});}
 a.equal(imports.get(gen).raw_sha256,'87ce47b88520abbde45c18114816dae7630e31453c48e0c505c87b7e9b031ce4');a.equal(imports.get(test).raw_sha256,'84645329260b663e563e0fb5ce745d0ca86327f557d7971f26dda028cd1f48df');
 save('baseline',{platform:{head:BP,tree:[...pt]},lessons:{head:BL,tree:[...lt]},source_commits:changes,imports:[...imports.values()],no_foreign_indexes:true,no_lesson_import:true});console.log(JSON.stringify({status:'PASS',platform:pt.size,lessons:lt.size,imports:imports.size,commits:commits.length}));
}else if(mode==='import'){
 a.equal(gs(P,'rev-parse','HEAD'),BP);a.equal(gs(L,'rev-parse','HEAD'),BL);read('baseline');const mapping=[];
 for(const c of commits){const parent=gs(P,'rev-parse','HEAD');command('import-'+c.slice(0,8),['git','cherry-pick',c]);const adopted=gs(P,'rev-parse','HEAD');mapping.push({source:c,adopted_parent:parent,adopted});console.log(c+' -> '+adopted);}
 save('import-mapping',{mapping,lessons_unchanged:BL});console.log(JSON.stringify(custody()));
}else if(mode==='verify'){
 const before=custody(),testRun=command('23-tests',['C:/Python314/python.exe','-m','unittest','discover','-s','build-scripts/content/book-2/213','-p','test_*.py','-v']);a.match(testRun.stderr,/Ran 23 tests/);a.match(testRun.stderr,/\bOK\b/);
 const native=command('native-checker',['C:/Python314/python.exe','build-scripts/content/book-2/213/check_render.py']);const n=JSON.parse(native.stdout);a.equal(n.automated_result,'PASS');a.equal(n.raster_checks.length,6);a(n.raster_checks.every(r=>r.reraster_changed_pixels===0));
 const gates=[];for(const[name,args]of[
  ...['student-web','publisher-print'].map(profile=>[profile,['scripts/validate-paragraph.js','--mode','part-a','--profile',profile,path.join(L,rel)]]),
  ['currentness',['build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.1.3']],
  ['durable',['build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']],['bundle',['build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1']]])gates.push({name,exit:command(name,['node',...args]).exit_code});
 const e=path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-213-S1-REVIEW-evidence'),integrityBytes=fs.readFileSync(path.join(e,'final-integrity.json'));a.equal(hash(integrityBytes),'4855e79e4a9cce8764f308d536749c2a413b8090ef078723fc86c8dd9d256c23');const integrity=JSON.parse(integrityBytes);
 for(const[file,h]of Object.entries(integrity.evidence))a.equal(hash(fs.readFileSync(path.join(P,file))),h,file);
 for(const[file,h]of Object.entries(integrity.native))a.equal(hash(fs.readFileSync(path.join(L,rel,file))),h,file);a.equal(Object.keys(integrity.native).length,24);
 const probes=JSON.parse(fs.readFileSync(path.join(e,'independent-probes.json')));a.equal(probes.real_input_cases.length,17);a.equal(probes.real_input_cases.filter(r=>r.faults.length).length,16);a.equal(probes.controller_mutations.length,27);
 const pages=[];for(const[mode,revision]of[['full','r31'],['thin','r32'],['print','r33']]){const r=JSON.parse(fs.readFileSync(path.join(e,mode+'-'+revision+'-reproduction.json')));a.equal(r.result,'PASS');a.equal(r.pages.length,30);a.deepEqual(r.native,integrity.native);for(const p of r.pages){a.equal(p.decoded_rgb_changed_pixels,0);a.equal(hash(fs.readFileSync(path.join(P,p.current))),p.sha256);a.equal(hash(fs.readFileSync(path.join(P,p.previous))),p.sha256);}pages.push({mode,revision,pages_bound:30});}
 const after=custody();a.deepEqual(after,before);save('verification',{status:'PASS',root_actor:'codex-root',custody:after,actual_root_tests:23,actual_root_figure_reraster:6,gates,attributed_distinct_probes:{real_negative:16,valid_sentinel:1,controller_negative:27},attributed_exact_page_comparisons:pages,root_native_PDF_generation:0,root_personal_views:0,verdict:'TECHNICAL DELTA ADOPTED; DISTINCT CURRENT QC RELEASE AFTER PUBLICATION',root_paragraph_acceptance:'PENDING',production_ready:false});console.log(JSON.stringify({status:'PASS',...after,gates,pages}));
}else if(mode==='scopes'){
 const head=process.argv[3];a.match(head,/^[a-f0-9]{40}$/);a.equal(gs(P,'rev-parse','HEAD'),head);a.equal(gs(P,'status','--porcelain'),'');const exact=custody(),scopes=[];
 for(const[label,cwd,lane,b,h,expected]of[['increment-platform',P,'shared',BP,head,0],['unchanged-lessons',L,'textbook',BL,BL,1],['complete-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',head,0],['complete-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',BL,0]]){const r=command('scope-'+label,['node','build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',b,'--head',h,'--json'],expected),v=JSON.parse(r.stdout);a.equal(v.categories.unknown.length,0);scopes.push({label,exit:r.exit_code,ok:v.ok,counts:Object.fromEntries(Object.entries(v.categories).map(([k,rows])=>[k,rows.length]))});}
 const whitespace=[];for(const[label,args,expected]of[['increment',['diff','--check',BP,head],0],['complete',['diff','--check','96416b6b5bd57094576e9aba0a42d682584ec479',head],null]])whitespace.push({label,exit:command('whitespace-'+label,['git',...args],expected).exit_code});
 save('scope',{status:'PASS',head,lessons:BL,custody:exact,scopes,whitespace,no_foreign_normalization:true});console.log(JSON.stringify({status:'PASS',head,scopes,whitespace}));
}else throw Error('baseline/import/verify/scopes');
