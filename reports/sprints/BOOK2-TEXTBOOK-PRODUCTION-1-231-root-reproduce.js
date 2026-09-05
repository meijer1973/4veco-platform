// HOW TO ADAPT: fixed root §231 fresh-native reproduction, after published r11–13 adoption.
// Records actual subprocesses; never rewrites source, original proof or generated files.
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto'),a=require('assert/strict');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-';
const proofs='reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1';
const para='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus';
const python='C:/Python314/python.exe',mode=process.argv[2];a(['full','native','parity'].includes(mode));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const fileHash=p=>hash(fs.readFileSync(p));
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const original=read(path.join(root,prefix+'build-manifest-r8.json'));
const snapshot=()=>Object.fromEntries(Object.keys(original.packet).map(p=>[p,fileHash(path.join(lessons,para,p))]));
a.deepEqual(snapshot(),original.packet);
const manifest=path.join(root,prefix+'build-manifest-r14.json');
const originalProofs=[];
for(const d of fs.readdirSync(path.join(root,proofs)).filter(x=>/^231-(paragraaf|opgaven|antwoorden)-/.test(x))){
 const p=path.join(root,proofs,d,'manifest.json');if(fs.existsSync(p))originalProofs.push({path:p,sha256:fileHash(p)});
}
// The imported reviewer history must exist; no speculative revision seeding.
for(const n of [11,12,13])a(fs.existsSync(path.join(root,prefix+`build-manifest-r${n}.json`)),'Publish/adopt reviewer history first');
const allProofRoots=cp.spawnSync('git',['worktree','list','--porcelain'],{cwd:root,encoding:'utf8'});a.equal(allProofRoots.status,0);
const trees=allProofRoots.stdout.split('\n').filter(x=>x.startsWith('worktree ')).map(x=>x.slice(9).trim());
const used=[];
for(const tree of trees){
 const e=path.join(tree,'reports/sprints');if(!fs.existsSync(e))continue;
 for(const name of fs.readdirSync(e)){const m=/^BOOK2-TEXTBOOK-PRODUCTION-1-231-build-(?:manifest|attempt)-r(\d+)\.json$/.exec(name);if(m)used.push({tree,name,revision:Number(m[1])});}
}
if(mode==='full'){a.equal(Math.max(...used.map(x=>x.revision)),13);a(!fs.existsSync(manifest));}
else a(fs.existsSync(manifest));
const output=path.join(root,prefix+`root-${mode}-process.json`);a(!fs.existsSync(output));
let args;
if(mode==='full')args=['build-scripts/content/book-2/b2_231.py','--lesson-root',lessons,'--proof-root',path.join(root,proofs),'--proof-suffix','r14','--manifest',manifest];
if(mode==='native')args=['build-scripts/content/book-2/231/check_render.py','--lesson-root',lessons,'--manifest',manifest];
if(mode==='parity'){
 a.equal(Math.max(...used.map(x=>x.revision)),14);
 args=['build-scripts/content/book-2/231/verify_rebuild.py',manifest,path.join(root,prefix+'root-reproduction.json'),path.join(root,prefix+'root-reproduction-evidence/grayscale-r14')];
}
const start=new Date().toISOString();
const run=cp.spawnSync(python,args,{cwd:root,encoding:'utf8',maxBuffer:128*1024*1024});
const result={mode,python,args,started_at:start,finished_at:new Date().toISOString(),exit_code:run.status,signal:run.signal,error:run.error?String(run.error):null,stdout:run.stdout,stderr:run.stderr,status:'FAIL_UNTIL_CHECKED',snapshot_before:original.packet,registered_worktree_revisions:used};
try{
 a.equal(run.status,0,(run.stdout||'')+(run.stderr||''));a.deepEqual(snapshot(),original.packet);
 for(const p of originalProofs)a.equal(fileHash(p.path),p.sha256);
 const native=read(manifest);a.equal(native.inspection_status,'PENDING');a.deepEqual(native.packet,original.packet);
 for(const [i,d] of native.documents.entries()){
  a.equal(d.pdf_sha256,original.documents[i].pdf_sha256);
  const current=read(path.join(d.proof_directory,'manifest.json'));
  const priorPath=original.documents[i].proof_directory.replace(/\\/g,'/').split('/4veco-platform/')[1];
  const prior=read(path.join(root,priorPath,'manifest.json'));
  a.equal(current.inspection_status,'PENDING');a.deepEqual(current.pages_inspected,[]);a.deepEqual(current.page_sha256,prior.page_sha256);
  for(const [page,expected] of Object.entries(current.page_sha256))a.equal(fileHash(path.join(d.proof_directory,'pages',page)),expected);
 }
 if(mode==='native'){const check=JSON.parse(run.stdout);a.equal(check.status,'PASS');result.native_check=check;}
 if(mode==='parity'){
  const check=read(path.join(root,prefix+'root-reproduction.json'));a.equal(check.status,'PASS');a.equal(check.all42_raw_rebuilds,'IDENTICAL');a.equal(check.all_page_grayscale.length,33);a.equal(check.steps.length,3);
  result.native_reproduction_sha256=fileHash(path.join(root,prefix+'root-reproduction.json'));
 }
 result.status='PASS';result.native_files_identical=42;result.color_pages_identical=33;result.historical_pending_manifests_unchanged=originalProofs;
}catch(error){result.failure=String(error);throw error;}
finally{fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({mode,status:result.status,exit_code:run.status,output,sha256:fileHash(output)},null,2));}
