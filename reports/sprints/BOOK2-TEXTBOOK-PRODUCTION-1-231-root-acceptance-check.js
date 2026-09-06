// HOW TO ADAPT: exact root-only acceptance transition after committed native proof.
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),a=require('assert/strict'),crypto=require('crypto'),yaml=require('js-yaml');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const rel='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus',D=path.join(L,rel);
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-231',E=path.join(__dirname,prefix+'-root-qc-evidence');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),raw=p=>hash(fs.readFileSync(p));
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,maxBuffer:64*1024*1024});
const before=git(L,'show','a907539349d9b7e97e8678b9099b45faa089edb7:'+rel+'/2.3.1-quality-ref.yaml');
a.equal(hash(before),'fa445ffe766131eb883fd54357952e3d8f21c4b14ad426aaf673567433df6bbf');
const current=fs.readFileSync(path.join(D,'2.3.1-quality-ref.yaml'));
a.equal(hash(current),'312ca25c21bf6428ded5162f2d299b8e73da25219fbb914cad88dcb8ca47820a');
a.equal(hash(Buffer.from(current.toString().replaceAll('\r\n','\n'))),hash(current));
const old=yaml.load(before.toString()),next=yaml.load(current.toString());
a.deepEqual(Object.keys(old),Object.keys(next));a.equal(next.schema_version,2);
a.deepEqual(Object.keys(old.partA),Object.keys(next.partA));
const allowed=new Set(['root_validation','root_acceptance','handoff_renewal','production_ready_with_flags']);
for(const key of Object.keys(old.partA))if(!allowed.has(key))a.deepEqual(next.partA[key],old.partA[key],key);
a.equal(next.partA.root_validation.status,'PASS');a.equal(next.partA.root_validation.verification_commit,'ea154615122f13710eb821b479d06259ab52e8d3');
a.equal(next.partA.root_acceptance.status,'ACCEPTED WITH FLAGS');a.equal(next.partA.root_acceptance.actor,'codex-root');
a.deepEqual(next.partA.root_acceptance.required_corrections,[]);a.equal(next.partA.production_ready,false);a.equal(next.partA.production_ready_with_flags,true);
const handPath=path.join(D,'2.3.1-textbook-handoff.md'),hand=fs.readFileSync(handPath,'utf8');
a.equal(raw(handPath),'69bdae1f9dd0efaace0a90db57e6ac0f17db627f93fdb333b48dafeb36eebe79');
a.deepEqual([...hand.matchAll(/^## (\d+)\. /gm)].map(m=>+m[1]),[1,2,3,4,5,6,7,8,9]);
for(const s of ['UNOBSERVED','NOT_COMMISSIONED','H-213-OPC2','A03','A05','A10','A40','12points','2/3/2/3/2','€900','19/11/17',hash(current)])a(hand.includes(s),s);
const baseline=json(path.join(E,'baseline.json'));let files=0;
for(const [name,h]of Object.entries(baseline.folder46))if(!name.endsWith('/2.3.1-quality-ref.yaml')){a.equal(raw(path.join(L,name)),h,name);files++;}
a.equal(files,45);
const native=json(path.join(E,'native',prefix+'-build-manifest-r20.json'));
for(const [name,h]of Object.entries(native.packet))a.equal(raw(path.join(D,name)),h,name);
for(const doc of native.documents)for(const key of ['source_sha256','html_sha256','pdf_sha256'])a(hand.includes(doc[key]),key);
for(const stem of ['fig_1','fig_2','fig_3','fig_4','we_1',...Array.from({length:10},(_,i)=>'ex_'+(i+1))])a(hand.includes('2.3.1_'+stem));
for(const row of baseline.imports)a.equal(raw(path.join(P,row.path)),row.sha256,row.path);
// Every committed pre-acceptance root evidence byte is immutable after adoption.
const evidencePaths=git(P,'ls-tree','-r','--name-only','-z','ea154615122f13710eb821b479d06259ab52e8d3','--','reports/sprints/'+prefix+'-root-qc-evidence').toString().split('\0').filter(Boolean);
for(const name of evidencePaths)a(fs.readFileSync(path.join(P,name)).equals(git(P,'show','ea154615122f13710eb821b479d06259ab52e8d3:'+name)),name);
const changed=git(L,'diff','--name-only','-z','a907539349d9b7e97e8678b9099b45faa089edb7').toString().split('\0').filter(Boolean);
const untracked=git(L,'ls-files','--others','--exclude-standard','-z').toString().split('\0').filter(Boolean);
a.deepEqual([...new Set([...changed,...untracked])].sort(),[rel+'/2.3.1-quality-ref.yaml',rel+'/2.3.1-textbook-handoff.md'].sort());
const commands=[];
for(const [name,args]of [
 ['student-web',['scripts/validate-paragraph.js','--mode','part-a','--profile','student-web',D]],
 ['publisher-print',['scripts/validate-paragraph.js','--mode','part-a','--profile','publisher-print',D]],
 ['currentness',['build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.3.1']],
 ['durable',['build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']],
 ['bundle',['build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1']]]) {
 const result=cp.spawnSync(process.execPath,args,{cwd:P,maxBuffer:64*1024*1024});
 const row={name,args,exit_code:result.status,stdout_base64:result.stdout.toString('base64'),stderr_base64:result.stderr.toString('base64'),stdout:result.stdout.toString('utf8'),stderr:result.stderr.toString('utf8')};
 commands.push(row);a.equal(result.status,0,JSON.stringify(row));
}
const record={status:'PASS',native_files_unchanged:42,old_lesson_files_unchanged:45,root_only_changed_fields:[...allowed],specialist_fields_unchanged:true,original_imports_unchanged:baseline.imports.length,committed_root_evidence_unchanged:evidencePaths.length,quality_ref_raw_sha256:hash(current),handoff_raw_sha256:raw(handPath),handoff_sections:9,commands};
fs.writeFileSync(path.join(__dirname,prefix+'-root-acceptance-check.json'),JSON.stringify(record,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({...record,commands:commands.map(c=>({name:c.name,exit_code:c.exit_code}))},null,2));
