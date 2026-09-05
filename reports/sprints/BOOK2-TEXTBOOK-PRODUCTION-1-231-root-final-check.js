// HOW TO ADAPT: post-rebuild root candidate integrity and inventory, before QC.
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto'),a=require('assert/strict');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-',para='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus/';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),fh=p=>hash(fs.readFileSync(p)),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const original=read(prefix+'root-import-after.json'),review=read(prefix+'root-review-bindings.json');
let bindings=0;
for(const p of original.imports){a.equal(fh(path.join(p.lesson_path?lessons:root,p.lesson_path||p.adopted_path)),p.sha256);bindings++;}
for(const p of review.imported_platform){a.equal(fh(path.join(root,p.path)),p.sha256);bindings++;}
a.equal(fh(path.join(lessons,para+'2.3.1-review.md')),review.canonical_review_sha256);bindings++;
const pending=[],packet=read(prefix+'build-manifest-r8.json').packet;
for(const n of [14,15,16]){
 const m=read(prefix+`build-manifest-r${n}.json`);a.equal(m.inspection_status,'PENDING');a.deepEqual(m.packet,packet);
 for(const p of m.input_sources){a.equal(fh(p.path),p.sha256);bindings++;}
 a.equal(fh(m.thin_wrapper.path),m.thin_wrapper.sha256);
 for(const d of m.documents){const f=path.join(d.proof_directory,'manifest.json'),p=JSON.parse(fs.readFileSync(f,'utf8'));a.equal(p.inspection_status,'PENDING');a.deepEqual(p.pages_inspected,[]);a.equal(p.visible_student_defects,null);a.equal(p.inspected_at_normal_reading_scale,false);for(const [page,h]of Object.entries(p.page_sha256)){a.equal(fh(path.join(d.proof_directory,'pages',page)),h);bindings++;}pending.push({path:path.relative(root,f),sha256:fh(f),pages:Object.keys(p.page_sha256).length});}
}
a.equal(pending.length,9);a.equal(pending.reduce((s,p)=>s+p.pages,0),99);
const processes=['full','native','parity'].map(kind=>{const p=prefix+`root-${kind}-process.json`,r=read(p);a.equal(r.status,'PASS');a.equal(r.exit_code,0);return {kind,path:p,sha256:fh(path.join(root,p)),started_at:r.started_at,finished_at:r.finished_at};});
const reproduction=read(prefix+'root-reproduction.json');a.equal(reproduction.status,'PASS');a.equal(reproduction.all_page_grayscale.length,33);
for(const p of reproduction.all_page_grayscale){a.equal(fh(p.path),p.sha256);bindings++;}
for(const [p,h]of Object.entries(packet)){a.equal(fh(path.join(lessons,para,p)),h);bindings++;}
const profiles=['student-web','publisher-print'].map(profile=>{const args=['scripts/validate-paragraph.js','--mode','part-a','--profile',profile,path.join(lessons,para)];const r=cp.spawnSync(process.execPath,args,{cwd:root,encoding:'utf8'});a.equal(r.status,1);a(r.stdout.includes('verdict PASS WITH FLAGS'));a(r.stdout.includes('MISSING quality_ref'));a(r.stdout.includes('1 error(s), 0 warning(s)'));return {profile,args,exit_code:r.status,stdout:r.stdout,stderr:r.stderr,interpretation:'Only missing independent specialist QC; not waived'};});
const inventory=read(prefix+'root-inventory.json');a.deepEqual(inventory.counts,{A:9,C:12,L:8,P:12});
for(const p of inventory.rows){const f=path.join(lessons,'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus',p.path);a.equal(fs.existsSync(f),p.present);if(p.present){a.equal(fh(f),p.sha256);bindings++;}}
const manifest=fs.readFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-output-manifest.md'),'utf8');
const currentRows=manifest.split('\n').filter(l=>/^\|\s*\d+\s*\|/.test(l)).map(l=>{const c=l.split('|').map(x=>x.trim());return {number:Number(c[1]),id:c[2],edition:c[3],status:c[4],path:c[5].split(String.fromCharCode(96)).join('')};});
a.deepEqual(currentRows,inventory.rows.map(({number,id,edition,status,path})=>({number,id,edition,status,path})));
const result={status:'PASS_CANDIDATE_NOT_QC',bindings,all_original499_and_review186_bindings_preserved:true,canonical_review_sha256:review.canonical_review_sha256,root_processes:processes,root_pending_manifests:pending,root_grayscale_pages:33,all42_native_bytes_unchanged:true,profiles,inventory:{counts:inventory.counts,present:29,absent:12,original_checkpoint_sha256:fh(path.join(root,prefix+'root-inventory.json')),current_manifest_sha256:hash(manifest)},limits:['Original author scope FAIL preserved; adopted actual native scope separate','Paragraph review PASS WITH FLAGS; specialist QC and root acceptance/handoff pending','Timing52/64/76–80 UNOBSERVED; no classroom, full CI or merge claim']};
const out=path.join(root,prefix+'root-final-bindings.json');fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({status:result.status,bindings,original_imports:499,review_imports:186,fresh_pending:9,fresh_color_pages:99,fresh_gray_pages:33,inventory:result.inventory.counts,output:out,sha256:fh(out)},null,2));
