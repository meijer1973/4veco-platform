'use strict';
// HOW TO ADAPT: owned author evidence only. Never dispatch root evidence writers.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),a=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const N='BOOK2-TEXTBOOK-PRODUCTION-1-214-BUILD-CURRENT',BR='agent/book2-214-build-current-20260906';
const BP='bc49af3353bf0ba3a061b2ef3e5ddec3c3a72abb',BL='f666bbb7dd258f1f01b38a20dd6ca3802848f8b7';
const roots={'4veco-platform':P,'4veco-lessen':L};
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,maxBuffer:128*1024*1024});
const read=(root,p)=>fs.readFileSync(path.join(root,p));
const write=(s,v)=>fs.writeFileSync(path.join(__dirname,N+'-'+s+'.json'),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const tree=(root,ref)=>git(root,'ls-tree','-r','-z',ref).toString('utf8').split('\0').filter(Boolean).map(s=>{const at=s.indexOf('\t'),meta=s.slice(0,at).split(' ');return {path:s.slice(at+1),mode:meta[0],git_blob:meta[2]};});
const env=()=>({...process.env,NODE_PATH:'C:/wt/book2-part-a-production-20260905/4veco-platform/node_modules',PYTHONIOENCODING:'utf-8',PYTHONDONTWRITEBYTECODE:'1',FOURVECO_PLATFORM_ROOT:P,FOURVECO_LESSEN_ROOT:L,FOURVECO_PLATFORM_SOURCE_REF:git(P,'rev-parse','HEAD').toString().trim(),FOURVECO_LESSEN_SOURCE_REF:git(L,'rev-parse','HEAD').toString().trim(),FOURVECO_PLATFORM_SOURCE_BRANCH:BR,FOURVECO_LESSEN_SOURCE_BRANCH:BR});
function run(label,exe,args,cwd=P){const start=new Date().toISOString(),r=cp.spawnSync(exe,args,{cwd,env:env(),maxBuffer:128*1024*1024});const x={label,argv:[exe,...args],cwd,start,finish:new Date().toISOString(),exit_code:r.status,error:r.error?.message||null,stdout:r.stdout?.toString('utf8')||'',stderr:r.stderr?.toString('utf8')||'',stdout_base64:r.stdout?.toString('base64')||'',stderr_base64:r.stderr?.toString('base64')||''};write(label+'-process',x);console.log(JSON.stringify({label,exit_code:r.status,error:x.error}));return x;}
function baseline(){
 const x={actor:'paragraph_224_builder',role:'paragraph214NativeAuthor',task:N,branch:BR,operational_commit:'71287955762a7b1635ca3cbb14a315bac241349e',repositories:{},instructions:[],accepted_inputs:[],release_modules:[]};
 for(const[repo,ref]of [['4veco-platform',BP],['4veco-lessen',BL]]){const root=roots[repo],rows=tree(root,ref);for(const r of rows){const b=read(root,r.path);r.raw_sha256=hash(b);r.bytes=b.length;const h=crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');a.equal(h,r.git_blob,r.path);}x.repositories[repo]={baseline:ref,files:rows.length,rows};console.log(JSON.stringify({repository:repo,baseline:ref,prior_raw_files:rows.length,all_git_blobs_equal:true}));}
 const priorPath='C:/wt/book2-234-plan-review-20260906/4veco-platform/reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN-REVIEW-baseline.json',prior=JSON.parse(fs.readFileSync(priorPath));
 x.prior_personal_instruction_evidence={path:priorPath,raw_sha256:hash(fs.readFileSync(priorPath)),attribution:'Same actual actor, previously fully personally read; unchanged bytes verified, not substitute author interpretation.'};
 for(const r of prior.instructions){const h=hash(read(roots[r.repository],r.path));a.equal(h,r.raw_sha256,r.path);x.instructions.push({...r,current_raw_sha256:h});}
 const C='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-232-PRODUCTION-RELEASE-',R='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-232-INPUT-ROOT-';
 const rows=[[R+'214-release.json','5870a7a4c2d5dc9b170f385b976b0a49953b9be6','f7752aa314f6db0cd8fd2eb076547b96f0624986e96553395e765adeb93dead6'],[R+'gate.cjs','5870a7a4c2d5dc9b170f385b976b0a49953b9be6','4f3c2ab8a5e877697952f7c951fdc712ff08d2f13c966a1ca86394690314fe5d'],[C+'214-inputs.json','9c6d8a7c1ee98b91a67f6d560beb8534f5dbde56','8adf329ff71e912335baa11d1e78a28afb8eb807de52306ffd867e35c7f0f376'],[C+'check.cjs','9c6d8a7c1ee98b91a67f6d560beb8534f5dbde56','927a4d012404b4e00cabfe793e9db45e22fae0660b968a3e97b6c007851c4f4b']];
 for(const[p,commit,h]of rows){const b=read(P,p);a.equal(hash(b),h,p);a(b.equals(git(P,'show',commit+':'+p)),p);x.release_modules.push({path:p,commit,raw_sha256:h,raw_git_equal:true});}
 const manifest=JSON.parse(read(P,C+'214-inputs.json'));a.equal(manifest.inputs.length,48);for(const r of manifest.inputs){const b=read(roots[r.repository],r.path);a.equal(hash(b),r.raw_sha256,r.path);a.equal(hash(b.toString('utf8').replace(/\r\n?/g,'\n')),r.canonical_lf_sha256,r.path);a(b.equals(git(roots[r.repository],'show',r.commit+':'+r.path)),r.path);x.accepted_inputs.push({...r,current_git_equal:true});}
 const base=manifest.output_contract.lesson_directory,st='2.1.4 Gemengde opgaven';x.selected_native_paths=[...['opgaven','antwoorden'].flatMap(ed=>['md','html','pdf'].map(ext=>base+'/'+st+' – '+ed+'.'+ext)),...Array.from({length:4},(_,i)=>['svg','png'].map(ext=>base+'/_assets/2.1.4_ex_'+(i+1)+'.'+ext)).flat(),base+'/build_pdf.py'];a.equal(x.selected_native_paths.length,15);
 x.native_exclusions=x.repositories['4veco-lessen'].rows.filter(r=>r.path.startsWith(base+'/')&&!x.selected_native_paths.includes(r.path));
 const reg=JSON.parse(read(P,'references/authored/course-target-exercises.json')),target=reg.exercises.filter(r=>r.id==='2.1.4');a.equal(target.length,1);a.equal(hash(JSON.stringify(target[0])),'fda623dc9a3620724bf9df22a3ef937fd26779fa49d4d2b0b7c6baa862753691');x.target=target[0];
 x.runtime={node:process.execPath,version:process.version,inherited_path:process.env.PATH||process.env.Path,python314:'C:/Users/meije/AppData/Local/Programs/Python/Python314/python.exe'};x.status='PASS';x.native_generation=0;write('baseline',x);console.log(JSON.stringify({status:'PASS',inputs:48,instructions:x.instructions.length,native_contract:15,legacy_exclusions:x.native_exclusions.length,target_sha256:hash(JSON.stringify(x.target))}));
}
if(process.argv[2]==='baseline')baseline();
else if(process.argv[2]==='gates'){for(const[label,args]of [['release',['reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-232-INPUT-ROOT-gate.cjs','214']],['structural',['build-scripts/workflows/check-book-outline-currentness.js']],['production',['build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.1.4']],['durable',['build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']],['bundle',['build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1']]])a.equal(run(label,process.execPath,args).exit_code,0,label);}
else if(process.argv[2]==='runtime'){
 const r=run('actual-runtime','C:/Python314/python.exe',['-c','import sys,json,os,shutil; print(json.dumps({"executable":sys.executable,"version":sys.version,"PATH":os.environ["PATH"],"pandoc":shutil.which("pandoc"),"pdftoppm":shutil.which("pdftoppm")}))']);a.equal(r.exit_code,0);const v=JSON.parse(r.stdout);a.equal(v.executable.toLowerCase().replaceAll('\\','/'),'c:/python314/python.exe');write('runtime-correction',{actual:v,executable_sha256:hash(fs.readFileSync(v.executable)),supersedes_only:'baseline.runtime.python314 was an unverified guessed location, not an executed binary. Actual successful runtime above is authoritative; baseline raw file/input custody is unaffected.',retained_diagnostic:'Read-only Get-Command python3 was not found; actual python, pandoc, pdftoppm and node resolved. No install, native build or PATH modification.'});
}
else if(process.argv[2]==='command'){
 const [label,exe,...args]=process.argv.slice(3);const r=run(label,exe,args);process.exitCode=r.exit_code||0;
}
else if(process.argv[2]==='capture-r40'){
 const base=JSON.parse(read(P,'reports/sprints/'+N+'-baseline.json')),rows=[];
 const dir=path.join(__dirname,N+'-r40-failed-raw');fs.mkdirSync(dir);
 for(const rel of base.selected_native_paths.filter(p=>/2\.1\.4_ex_1\.(svg|png)$/.test(p))){const bytes=read(L,rel),target=path.join(dir,path.basename(rel));fs.writeFileSync(target,bytes,{flag:'wx'});a(fs.readFileSync(target).equals(bytes));rows.push({source:rel,evidence:path.relative(P,target).replaceAll('\\','/'),bytes:bytes.length,sha256:hash(bytes)});}
 write('r40-failure-capture',{status:'RETAINED_ACTUAL_NATIVE_FAILURE',rows,reason:'Sharp density96 expanded natural raster above1200x1050; actual dimensions guard rejected after firstSVG/PNG, before pupil MD/HTML/PDF. Preserve these failed bytes; explicit1200x1050 resampling is owned native conversion, no font-floor or plan waiver.',native_attempt_process:hash(read(P,'reports/sprints/'+N+'-native-full-r40-process.json')),limitation:'r40 retained terminal process records final child failure, not every earlier successful gate stdout. Future owned controller prints full event trail on failure. No fabricated earlier event log.',historical_whitespace:'39ca053f source commit check reported four new blank EOF lines; own current source removes them, historical shell diagnostic remains factual.'});
}
else if(process.argv[2]==='snapshot'){
 const revision=process.argv[3];a.match(revision,/^r[0-9]+$/);const base=JSON.parse(read(P,'reports/sprints/'+N+'-baseline.json'));
 const dir=path.join(__dirname,N+'-'+revision+'-retained-native');fs.mkdirSync(dir);const rows=[];
 for(const rel of base.selected_native_paths){const b=read(L,rel),dest=path.join(dir,path.basename(rel));fs.writeFileSync(dest,b,{flag:'wx'});a(fs.readFileSync(dest).equals(b));rows.push({source:rel,evidence:path.relative(P,dest).replaceAll('\\','/'),bytes:b.length,sha256:hash(b)});}
 write(revision+'-retained-native',{revision,rows,status:'INTERMEDIATE_NATIVE_BYTES_RETAINED_NOT_VISUAL_ACCEPTANCE',reason:'All source/output and image bytes retained before source-level layout revision; no restore-copy to canonical output.'});
}
else if(process.argv[2]==='custody'){
 const label=process.argv[3];a.match(label,/^[a-z0-9-]+$/);const baseline=JSON.parse(read(P,'reports/sprints/'+N+'-baseline.json'));const results={};
 for(const[repo,root]of Object.entries(roots)){
  const except=repo==='4veco-platform'?['reports/github-agent-index-platform.json','reports/github-agent-index-platform.md','reports/github-agent-index-lessen.json','reports/github-agent-index-lessen.md']:baseline.selected_native_paths;
  const checked=[];for(const row of baseline.repositories[repo].rows){if(except.includes(row.path))continue;a.equal(hash(read(root,row.path)),row.raw_sha256,row.path);checked.push({path:row.path,raw_sha256:row.raw_sha256});}
  const diff=git(root,'diff','--name-only','-z',baseline.repositories[repo].baseline,'HEAD').toString().split('\0').filter(Boolean),dirty=git(root,'status','--porcelain=v1','-z','--untracked-files=all').toString().split('\0').filter(Boolean).map(x=>x.slice(3));
  const allowed=p=>repo==='4veco-platform'?(p==='build-scripts/content/book-2/b2_214.py'||p.startsWith('build-scripts/content/book-2/214/')||p.startsWith('reports/sprints/'+N+'-')||except.includes(p)):except.includes(p);
  for(const p of [...diff,...dirty])a(allowed(p),'Out-of-scope '+repo+':'+p);
  results[repo]={head:git(root,'rev-parse','HEAD').toString().trim(),baseline:baseline.repositories[repo].baseline,prior_files:baseline.repositories[repo].rows.length,preserved:checked.length,checked,diff,dirty,strict_owned_paths:true};
 }
 write(label+'-custody',{status:'PASS',repositories:results,baseline_sha256:hash(read(P,'reports/sprints/'+N+'-baseline.json'))});console.log(JSON.stringify({status:'PASS',preserved:Object.fromEntries(Object.entries(results).map(([r,x])=>[r,x.preserved]))}));
}
else throw Error('Expected baseline, gates, command, snapshot or custody');
