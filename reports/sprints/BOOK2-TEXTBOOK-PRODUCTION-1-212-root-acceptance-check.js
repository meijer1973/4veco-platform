// HOW TO ADAPT: new immutable phase bindings; never overwrite earlier proof.
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),a=require('assert/strict'),crypto=require('crypto'),yaml=require('js-yaml');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const rel='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even',D=path.join(L,rel);
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-212',E=path.join(__dirname,prefix+'-root-qc-evidence');
const V='14a62363855a4be3559288f1d962ac242c77c30d',LB='301ce23aab7582bc0723e9a2319c57d39fec9578';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),raw=p=>hash(fs.readFileSync(p));
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,maxBuffer:64*1024*1024});
const qp=rel+'/2.1.2-quality-ref.yaml',hp=rel+'/2.1.2-textbook-handoff.md';
const before=git(L,'show',LB+':'+qp),current=fs.readFileSync(path.join(L,qp));
a.equal(hash(before),'90e0fcf3dee8af8400948b45a6331bc3e4e66b1444dd02f7dbb604b85c1c57df');
a.equal(hash(current),'73bd2a2447b38c9d95cbc3bd69b8037e0f46b7564655b4513009fd6707b7b07d');
a.equal(hash(Buffer.from(current.toString().replaceAll('\r\n','\n'))),hash(current));
const old=yaml.load(before.toString()),next=yaml.load(current.toString());
a.deepEqual(Object.keys(old),Object.keys(next));
for(const k of Object.keys(old))if(k!=='partA')a.deepEqual(next[k],old[k]);
const allowed=['root_validation','root_acceptance','handoff_renewal','production_ready_with_flags'];
a.deepEqual(Object.keys(next.partA).filter(k=>!Object.hasOwn(old.partA,k)),['production_ready_with_flags']);
for(const k of Object.keys(old.partA))if(!allowed.includes(k)&&k!=='current_succession')a.deepEqual(next.partA[k],old.partA[k],k);
a.deepEqual(Object.keys(next.partA.current_succession),Object.keys(old.partA.current_succession));
for(const k of Object.keys(old.partA.current_succession))if(k!=='root_lineage_flag_closure')a.deepEqual(next.partA.current_succession[k],old.partA.current_succession[k],k);
a.equal(next.partA.current_succession.root_lineage_flag_closure.status,'CLOSED');
a.equal(next.partA.current_succession.root_lineage_flag_closure.verification_commit,V);
a.equal(next.partA.root_validation.status,'PASS');a.equal(next.partA.root_validation.verification_commit,V);
a.equal(next.partA.root_validation.personal_views,0);
a.equal(next.partA.root_acceptance.status,'ACCEPTED WITH FLAGS');a.equal(next.partA.root_acceptance.actor,'codex-root');
a.deepEqual(next.partA.root_acceptance.required_corrections,[]);
a.deepEqual(next.partA.root_acceptance.flags_retained,old.partA.flags.map(x=>x.id));
a.equal(next.partA.production_ready,false);a.equal(next.partA.production_ready_with_flags,true);
a.equal(next.partA.handoff_renewal.status,'RENEWED');a.equal(next.partA.handoff_renewal.companion,'NOT_COMMISSIONED');
const hand=fs.readFileSync(path.join(L,hp),'utf8');
a.equal(raw(path.join(L,hp)),'4da6e5b4f0a70273d78c067f34484c8a5f6faf164b0f09c1559b9a73ff6611fe');
a.deepEqual([...hand.matchAll(/^## (\d+)\. /gm)].map(m=>+m[1]),[1,2,3,4,5,6,7,8,9]);
for(const s of ['UNOBSERVED','NOT_COMMISSIONED','H-213-OPC2','A08','A07','A21','11 points','2/2/3/4','5000/7','19/11/9',hash(current),V])a(hand.includes(s),s);
const baseline=json(path.join(E,'baseline.json'));let oldLesson=0;
for(const [n,h]of Object.entries(baseline.all_lesson_files))if(![qp,hp].includes(n)){a.equal(raw(path.join(L,n)),h,n);oldLesson++;}
a.equal(oldLesson,1900);
let folder=0;for(const [n,h]of Object.entries(baseline.paragraph_files))if(!['2.1.2-quality-ref.yaml','2.1.2-textbook-handoff.md'].includes(n)){a.equal(raw(path.join(D,n)),h,n);folder++;}
a.equal(folder,38);
a(Array.isArray(baseline.native_files));a.equal(baseline.native_files.length,34);
for(const n of baseline.native_files)a.equal(raw(path.join(D,n)),baseline.paragraph_files[n],n);
for(const n of Object.keys(baseline.paragraph_files))if(/\.(?:md|html|pdf|zip)$/.test(n)&&!n.startsWith('_')&&!n.includes('-review')&&!n.includes('-textbook'))a(hand.includes(baseline.paragraph_files[n]),n);
for(const stem of ['fig_1','fig_2','fig_3','fig_4','we_1',...Array.from({length:6},(_,i)=>'ex_'+(i+1))])a(hand.includes('2.1.2_'+stem));
for(const row of baseline.imports)a.equal(raw(path.join(P,row.path)),row.sha256,row.path);
for(const [n,h]of Object.entries(baseline.historical212))a.equal(raw(path.join(P,n)),h,n);
for(const [n,h]of Object.entries(baseline.specialist_original_inputs))a.equal(raw(path.join(P,n)),h,n);
const evidencePaths=git(P,'ls-tree','-r','--name-only','-z',V,'--','reports/sprints/'+prefix+'-root-qc-evidence','reports/sprints/'+prefix+'-root-qc-check.py','reports/sprints/'+prefix+'-root-qc-result.md').toString().split('\0').filter(Boolean);
for(const n of evidencePaths)a(fs.readFileSync(path.join(P,n)).equals(git(P,'show',V+':'+n)),n);
const changed=git(L,'diff','--name-only','-z',LB).toString().split('\0').filter(Boolean);
const untracked=git(L,'ls-files','--others','--exclude-standard','-z').toString().split('\0').filter(Boolean);
a.deepEqual([...new Set([...changed,...untracked])].sort(),[qp,hp].sort());
const commands=[];
for(const [name,args]of [
 ['student-web',['scripts/validate-paragraph.js','--mode','part-a','--profile','student-web',D]],
 ['publisher-print',['scripts/validate-paragraph.js','--mode','part-a','--profile','publisher-print',D]],
 ...['paragraph_production','specialist_review'].map(action=>['currentness-'+action,['build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action',action,'--paragraph','2.1.2']]),
 ['durable',['build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']],
 ['bundle',['build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1']]]) {
 const started=new Date().toISOString(),r=cp.spawnSync(process.execPath,args,{cwd:P,maxBuffer:64*1024*1024});
 const row={name,args,started,ended:new Date().toISOString(),exit_code:r.status,stdout_base64:r.stdout.toString('base64'),stderr_base64:r.stderr.toString('base64'),stdout_sha256:hash(r.stdout),stderr_sha256:hash(r.stderr),stdout:r.stdout.toString('utf8'),stderr:r.stderr.toString('utf8')};
 commands.push(row);a.equal(r.status,0,JSON.stringify(row));
}
const record={status:'PASS',verification_commit:V,native_files_unchanged:34,old_other_paragraph_files_unchanged:38,old_other_lesson_files_unchanged:oldLesson,root_only_changed_fields:[...allowed,'current_succession.root_lineage_flag_closure'],specialist_other_fields_unchanged:true,original_imports_unchanged:baseline.imports.length,historical212files_unchanged:Object.keys(baseline.historical212).length,committed_root_evidence_unchanged:evidencePaths.length,quality_ref_raw_sha256:hash(current),handoff_raw_sha256:raw(path.join(L,hp)),handoff_sections:9,commands};
fs.writeFileSync(path.join(__dirname,prefix+'-root-acceptance-check.json'),JSON.stringify(record,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({...record,commands:commands.map(c=>({name:c.name,exit_code:c.exit_code}))},null,2));
