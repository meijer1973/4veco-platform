// HOW TO ADAPT: fixed exact §231 independent-review import checkpoint; no old helper reruns.
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto'),a=require('assert/strict');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-',rprefix=prefix+'review-';
const pbase='85fa4910a7e6bcac69b36c38bffdf6c0d10d0c68',phead='90200f386eebb469c30d515df4f16e585faa3def';
const lbase='384d9967a124fcc917a2eea3fe549829919cbeb7',lhead='4cac756277f39ff789c77b4c7e9c5b29abe3ecf3';
const para='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus/';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),fhash=p=>hash(fs.readFileSync(p));
const git=(args,cwd=root,binary=false)=>{const r=cp.spawnSync('git',args,{cwd,encoding:binary?null:'utf8',maxBuffer:128*1024*1024});a.equal(r.status,0,String(r.stderr));return binary?r.stdout:r.stdout.trim();};
const paths=(b,h,cwd=root)=>git(['diff','--name-only','-z',b,h],cwd).split('\0').filter(Boolean).sort();
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const imported=paths(pbase,phead),record=[];
a.deepEqual(paths('c704ffa467ff725590d945a06eae89e2184b673c','HEAD'),imported);
for(const p of imported){a(p.startsWith(rprefix)||p.startsWith(prefix+'REVIEW-command-log.')||/^reports\/sprints\/BOOK2-TEXTBOOK-PRODUCTION-1-231-build-(attempt|manifest)-r(11|12|13)\.json$/.test(p)||/^reports\/rendered-proof\/BOOK2-TEXTBOOK-PRODUCTION-1\/231-(paragraaf|opgaven|antwoorden)-[a-f0-9]{12}-r(11|12|13)\//.test(p));const expected=hash(git(['show',phead+':'+p],root,true));a.equal(fhash(path.join(root,p)),expected);record.push({path:p,sha256:expected,original_commit:phead});}
const review=para+'2.3.1-review.md';a.deepEqual(paths(lbase,lhead,lessons),[review]);a.deepEqual(paths('cf8a5fa5c3dcdb672d4231e0d97df535f1000abe','HEAD',lessons),[review]);
a.equal(fhash(path.join(lessons,review)),'8f86129b14ef508e16f41d918299da7af2422655ff14fc9ba91b68a9b66e8943');a.equal(hash(git(['show',lhead+':'+review],lessons,true)),fhash(path.join(lessons,review)));
const baseline=read(rprefix+'baseline.json');a.equal(baseline.lesson_files.length,44);
for(const r of baseline.lesson_files)a.equal(fhash(path.join(lessons,r.path)),r.sha256);
const mapping=read(prefix+'root-import-after.json').rows;
const resolve=p=>{const n=p.replace(/\\/g,'/');if(n.includes('/4veco-lessen/'))return path.join(lessons,n.split('/4veco-lessen/')[1]);const rel=n.includes('/4veco-platform/')?n.split('/4veco-platform/')[1]:n;return path.join(root,mapping.find(r=>r.old_path===rel)?.new_path||rel);};
const inspection=read(rprefix+'inspection.json');a.equal(fhash(path.join(root,rprefix+'inspection.json')),'d761966ebae2e5bb9310a40523a64f24b7c16b8d298be2edcff9aa0d53319a68');
a.equal(inspection.status,'PASS_SUBSTANTIVE_RENDER_REVIEW');a.equal(inspection.page_observations.length,66);a.equal(inspection.native_figure_observations.length,15);a.equal(inspection.additional_teaching_mutations.length,4);
for(const p of inspection.page_observations){a(p.personally_read_completely&&p.personally_inspected_at_normal_reading_scale);a.deepEqual(p.visible_student_defects,[]);a.equal(fhash(resolve(p.path)),p.sha256);}
for(const p of inspection.native_figure_observations){a(p.personally_inspected_native_png);a.equal(fhash(resolve(p.png_path)),p.png_sha256);a.equal(fhash(resolve(p.svg_path)),p.svg_sha256);}
const probes=read(rprefix+'probes-result.json');a.equal(probes.status,'PASS');a.equal(probes.independent_mutations_rejected,19);a.equal(probes.actual_svg_count,15);a.equal(probes.independent_exact_CS_polygon_checks,10);
for(const p of [...probes.probes,...inspection.additional_teaching_mutations])a.equal(p.result,'REJECTED_AS_REQUIRED');
const reproduction=read(rprefix+'reproduction-result.json');a.equal(reproduction.status,'PASS');a.equal(reproduction.steps.length,3);a.equal(reproduction.all_page_grayscale.length,33);a.equal(Object.keys(reproduction.artifacts).length,42);
for(const [p,h]of Object.entries(reproduction.artifacts))a.equal(fhash(path.join(lessons,para,p)),h);
for(const p of reproduction.all_page_grayscale)a.equal(fhash(resolve(p.path)),p.sha256);
let pageCount=0;const pending=[];
for(const n of [11,12,13]){
 const name=prefix+`build-manifest-r${n}.json`,m=read(name);a.equal(m.inspection_status,'PENDING');a.deepEqual(m.packet,reproduction.artifacts);
 if(n===11)a.equal(fhash(path.join(root,name)),'48adc24c1a4b31ae9c0edb20ff48764b2f2c498aa63e7df3c0e58141124ea0b3');
 for(const p of m.input_sources)a.equal(fhash(resolve(p.path)),p.sha256);
 for(const d of m.documents){const file=resolve(d.proof_directory+'/manifest.json'),proof=JSON.parse(fs.readFileSync(file,'utf8'));a.equal(proof.inspection_status,'PENDING');a.deepEqual(proof.pages_inspected,[]);a.equal(proof.visible_student_defects,null);a.equal(proof.inspected_at_normal_reading_scale,false);for(const [p,h]of Object.entries(proof.page_sha256)){a.equal(fhash(path.join(path.dirname(file),'pages',p)),h);pageCount++;}pending.push({path:path.relative(root,file),sha256:fhash(file)});}
}
a.equal(pageCount,99);a.equal(pending.length,9);
const assessment=read(rprefix+'scope-assessment.json'),correspondence=read(rprefix+'scope-correspondence.json');a.equal(assessment.rows.length,66);a.equal(assessment.native_manifests.length,27);a.equal(correspondence.checks.length,66);
for(const row of assessment.rows){const actual=mapping.find(x=>x.old_path===row.old_path);a(actual);a.equal(actual.new_path,row.proposed_new_path);a.equal(actual.sha256,row.sha256);a.equal(actual.source_git_blob,row.source_git_blob);a.equal(fhash(path.join(root,actual.new_path)),row.sha256);}
for(const p of assessment.native_manifests)a.equal(fhash(path.join(root,p.path)),p.sha256);
const tests=read(rprefix+'source-tests.json');a.equal(tests.status,0);
const render=read(rprefix+'render-check.json');a.equal(render.status,0);a.equal(JSON.parse(render.stdout).status,'PASS');
const profiles=read(rprefix+'profiles-final.json');for(const r of profiles.results){a.equal(r.status,1);a(r.stdout.includes('PASS WITH FLAGS'));a(r.stdout.includes('MISSING quality_ref'));a(!r.stdout.includes('MISSING Part A review'));}
const out=path.join(root,prefix+'root-review-bindings.json');
fs.writeFileSync(out,JSON.stringify({status:'PASS',source_platform:phead,source_lessons:lhead,adopted_platform:git(['rev-parse','HEAD']),adopted_lessons:git(['rev-parse','HEAD'],lessons),canonical_review_sha256:fhash(path.join(lessons,review)),imported_platform:record,baseline_lesson_files_unchanged:44,personal_color_and_gray_pages:66,personal_native_figures:15,negative_probes:23,fresh_native_pending:pending,fresh_color_pages:pageCount,original66_mapping_matches_independent_assessment:true,original27_native_manifests_unchanged:true,limits:'Paragraph PASS WITH FLAGS only; original scope FAIL preserved; no QC, root acceptance, handoff or current CI'},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:'PASS',platform_imports:record.length,lesson_review:1,baseline_lesson_files:44,page_observations:66,native_figures:15,negative_probes:23,native_color_pages:pageCount,output:out,sha256:fhash(out)},null,2));
