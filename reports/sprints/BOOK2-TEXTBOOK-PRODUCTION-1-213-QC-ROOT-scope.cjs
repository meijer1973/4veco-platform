'use strict';
// Exact committed root phase. HOW TO ADAPT: new immutable bases and owned paths.
const fs=require('fs'),path=require('path'),cp=require('child_process'),a=require('assert/strict'),crypto=require('crypto');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen'),prefix='BOOK2-TEXTBOOK-PRODUCTION-1-213-QC-ROOT';
const BP='cd2aaed18c4b539b46e5d12cfd760126731f784c',BL='167b833c88c5651327906ffdc322e44a9fcfc4a7';
const H=process.argv[2],LH=process.argv[3],V=process.argv[4];for(const h of [H,LH,V])a.match(h||'',/^[a-f0-9]{40}$/);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,maxBuffer:128*1024*1024});
const gs=(cwd,...args)=>git(cwd,...args).toString('utf8').trim(),names=(cwd,...args)=>git(cwd,...args).toString('utf8').split('\0').filter(Boolean);
const save=(name,value)=>fs.writeFileSync(path.join(__dirname,prefix+'-'+name+'.json'),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
function run(label,args,cwd=P,expected=null){const started=new Date().toISOString(),r=cp.spawnSync(args[0],args.slice(1),{cwd,maxBuffer:128*1024*1024}),out=r.stdout||Buffer.alloc(0),err=r.stderr||Buffer.alloc(0);const row={args,cwd,started,ended:new Date().toISOString(),exit_code:r.status,stdout:out.toString('utf8'),stderr:err.toString('utf8'),stdout_base64:out.toString('base64'),stderr_base64:err.toString('base64')};save(label+'-process',row);if(expected!==null)a.equal(r.status,expected);return row;}
a.equal(gs(P,'rev-parse','HEAD'),H);a.equal(gs(L,'rev-parse','HEAD'),LH);a.equal(gs(P,'status','--porcelain'),'');a.equal(gs(L,'status','--porcelain'),'');
const baseline=JSON.parse(fs.readFileSync(path.join(__dirname,prefix+'-baseline.json'))),post=JSON.parse(fs.readFileSync(path.join(__dirname,prefix+'-postaccept-check.json')));a.equal(post.status,'PASS');a.equal(post.verification_commit,V);
const imported=new Map(baseline.imports.map(r=>[r.path,r]));for(const r of imported.values())a.equal(hash(fs.readFileSync(path.join(P,r.path))),r.raw_sha256,r.path);
const manifest='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-output-manifest.md',owned=names(P,'diff','--name-only','--no-renames','-z',BP,H);
a(owned.every(n=>imported.has(n)||n===manifest||n.startsWith('reports/sprints/'+prefix+'-')));
for(const n of owned)a(fs.readFileSync(path.join(P,n)).equals(git(P,'show',H+':'+n)),n);
const rel='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten';
const expected=['2.1.3-quality-ref.yaml','2.1.3-textbook-handoff.md'].map(n=>rel+'/'+n);a.deepEqual(names(L,'diff','--name-only','-z',BL,LH).sort(),expected.sort());
a.equal(hash(fs.readFileSync(path.join(L,rel,'2.1.3-quality-ref.yaml'))),post.quality_ref_raw_sha256);a.equal(hash(fs.readFileSync(path.join(L,rel,'2.1.3-textbook-handoff.md'))),post.handoff_raw_sha256);
const scopes=[];for(const[label,cwd,lane,base,head,expectedExit]of[['adoption-platform',P,'shared',BP,H,1],['adoption-lessons',L,'textbook',BL,LH,0],['complete-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',H,0],['complete-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',LH,0]]){
 const r=run('scope-'+label,['node','build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',base,'--head',head,'--json'],P,expectedExit),j=JSON.parse(r.stdout);a.equal(j.categories.unknown.length,0);a.equal(j.ok,expectedExit===0);scopes.push({label,exit:r.exit_code,ok:j.ok,counts:Object.fromEntries(Object.entries(j.categories).map(([k,v])=>[k,v.length])),failures:j.failures});}
const whitespace=[];for(const[label,cwd,args,expectedExit]of[['adoption',P,['diff','--check',BP,H],null],['adoption-cr',P,['-c','core.whitespace=cr-at-eol','diff','--check',BP,H],null],['root-acceptance',P,['diff','--check',V,H],0],['lessons',L,['diff','--check',BL,LH],0],['whole',P,['diff','--check','96416b6b5bd57094576e9aba0a42d682584ec479',H],null]])whitespace.push({label,exit:run('whitespace-'+label,['git',...args],cwd,expectedExit).exit_code});
const counts={A:0,C:0,L:0,P:0};for(const row of post.inventory){counts[row.status]++;const f=path.join(L,'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus',row.relative);a.equal(fs.existsSync(f),row.status!=='P');if(row.status!=='P')a.equal(hash(fs.readFileSync(f)),row.raw_sha256);}
a.deepEqual(counts,{A:21,C:0,L:8,P:12});save('scope',{status:'PASS',platform:{base:BP,head:H},lessons:{base:BL,head:LH},preaccept_verification_commit:V,strict_owned_paths:owned,original_QC_files:imported.size,postaccept_check_raw_sha256:hash(fs.readFileSync(path.join(__dirname,prefix+'-postaccept-check.json'))),scopes,whitespace,counts,no_foreign_normalization:true});
console.log(JSON.stringify({status:'PASS',platform:H,lessons:LH,strict_owned_paths:owned.length,scopes,whitespace,counts}));
