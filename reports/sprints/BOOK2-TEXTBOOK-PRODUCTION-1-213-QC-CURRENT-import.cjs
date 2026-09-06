'use strict';
// HOW TO ADAPT: exact root-authorized evidence imports only; no source mutation.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),c=require('node:crypto'),assert=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen'),prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-QC-CURRENT-';
const originals=['362d5460abf58d1be241e58a695b784e9953b290','85e373b13e87442728def73946a9eab30577735a','d54e0ff0afc517a3910fdbd9a276ae03bdbf9bcd','1fb2be8bebb342585ecca835fe54b8648025cddb'];
const git=(root,...args)=>cp.execFileSync('git',args,{cwd:root,maxBuffer:256*1024*1024});
const sha=b=>c.createHash('sha256').update(b).digest('hex');
const save=(name,x)=>fs.writeFileSync(path.join(P,prefix+name+'.json'),JSON.stringify(x,null,2)+'\n',{flag:'wx'});
function inventory(root){return git(root,'ls-tree','-rz','HEAD').toString('utf8').split('\0').filter(Boolean).map(row=>{const [meta,name]=row.split('\t'),raw=fs.readFileSync(path.join(root,name));return {path:name,git_blob:meta.split(' ')[2],raw_sha256:sha(raw),bytes:raw.length};});}
if(process.argv[2]==='import'){
 for(const root of [P,L])assert.equal(git(root,'status','--porcelain').length,0);
 const before={platform_head:git(P,'rev-parse','HEAD').toString().trim(),lessons_head:git(L,'rev-parse','HEAD').toString().trim(),repositories:[{root:P,rows:inventory(P)},{root:L,rows:inventory(L)}]};
 assert.equal(before.lessons_head,'42996c60b4a93843dfe8488b8e5a3ea704871667');save('preimport-custody',before);
 const mappings=[],imports=[];
 for(const original of originals){
  const rows=git(P,'diff-tree','--no-commit-id','--name-status','-r',original).toString().trim().split('\n');
  for(const row of rows){const [status,f]=row.split('\t');assert.equal(status,'A');assert(f.startsWith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-S1-REVIEW-'));assert(!fs.existsSync(path.join(P,f)));imports.push(f);}
  const r=cp.spawnSync('git',['cherry-pick',original],{cwd:P,encoding:'utf8',maxBuffer:64*1024*1024});save('import-'+original.slice(0,8),{command:['git','cherry-pick',original],cwd:P,exit:r.status,stdout:r.stdout,stderr:r.stderr});assert.equal(r.status,0);
  mappings.push({original,local:git(P,'rev-parse','HEAD').toString().trim()});
 }
 const incoming=imports.map(f=>{const raw=fs.readFileSync(path.join(P,f)),blob=git(P,'show',originals.at(-1)+':'+f);assert(raw.equals(blob),'import bytes '+f);return {path:f,raw_sha256:sha(raw),git_blob:git(P,'rev-parse',originals.at(-1)+':'+f).toString().trim()};});
 let n=0;for(const r of before.repositories)for(const row of r.rows){assert.equal(sha(fs.readFileSync(path.join(r.root,row.path))),row.raw_sha256,row.path);n++;}
 save('import-mapping',{status:'PASS',mappings,incoming,preimport_raw_unchanged:n,source_delta:false,lesson_delta:false,root_release_payload:'f63c00bbda0ee96e956c15deb00b2e59f84dff25'});console.log(JSON.stringify({mappings,imports:incoming.length,preimport_raw_unchanged:n},null,2));
}else throw Error('import only');
