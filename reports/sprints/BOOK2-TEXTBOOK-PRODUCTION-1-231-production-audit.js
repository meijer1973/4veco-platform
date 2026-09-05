// Read-only actual-commit/raw-byte audit. JSON stdout is captured by the native recorder.
const fs=require('fs'),path=require('path'),cp=require('child_process'),assert=require('assert/strict'),crypto=require('crypto');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const sourcePayload='278322ac0c69c558550842156aa40af360b9433e';
const lessonPayload='384d9967a124fcc917a2eea3fe549829919cbeb7';
const base='3abef1a17131e36aa7047e461900c014dca73642',lessonBase='4fe0d742a3cd3c02ac1aaf6311dccc540970e2f5';
const head=process.argv[2];assert(/^[a-f0-9]{40}$/.test(head),'pass exact committed evidence/candidate head');
const run=(exe,args,cwd=root,encoding='utf8')=>{const r=cp.spawnSync(exe,args,{cwd,encoding,maxBuffer:128*1024*1024});return {exe,args,cwd,exit_code:r.status,stdout:r.stdout,stderr:r.stderr};};
const git=(args,cwd=root)=>{const r=run('git',args,cwd);assert.equal(r.exit_code,0,r.stderr);return r.stdout.trim();};
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const relative=(p,cwd=root)=>path.relative(cwd,p).replace(/\\/g,'/');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-';
const grant='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-plan-r2-root-continuation.md';
const paragraph='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus/';
const sourcePaths=['answers.md','assets.js','check_render.py','exercises.md','target-answers.md','test_source.py','theory.md','verify_rebuild.py'].map(p=>'build-scripts/content/book-2/231/'+p).concat(['build-scripts/content/book-2/b2_231.py',prefix+'production-plan.md',grant]).sort();
const changed=(a,b,cwd=root)=>git(['-c','core.quotepath=false','diff','--name-only',a,b],cwd).split('\n').filter(Boolean).sort();
assert.deepEqual(changed(base,sourcePayload),sourcePaths);
const manifest=read(path.join(root,prefix+'build-manifest-r8.json'));
const inspection=read(path.join(root,prefix+'builder-personal-inspection-r8.json'));
const reproduction=read(path.join(root,prefix+'reproduction-r8.json'));
assert.equal(manifest.inspection_status,'PENDING');
assert.equal(reproduction.status,'PASS');
assert.equal(inspection.kind,'BUILDER_PERSONAL_INSPECTION_NOT_INDEPENDENT_QC');
assert.equal(inspection.color_pages.length,33);assert.equal(inspection.grayscale_pages.length,33);
assert.equal(inspection.actual_png_assets.length,15);
const lessonPaths=Object.keys(reproduction.artifacts).map(p=>paragraph+p).concat(paragraph+'build_pdf.py').sort();
assert.equal(lessonPaths.length,43);assert.deepEqual(changed(lessonBase,lessonPayload,lessons),lessonPaths);
assert.equal(git(['rev-parse','HEAD'],lessons),lessonPayload);
assert.equal(git(['status','--porcelain'],lessons),'');
const indexes=['reports/github-agent-index-lessen.json','reports/github-agent-index-lessen.md','reports/github-agent-index-platform.json','reports/github-agent-index-platform.md','reports/url-index.md'];
const own=changed(base,head);
const unexpected=own.filter(p=>!sourcePaths.includes(p)&&!p.startsWith(prefix)&&!p.startsWith('reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/231-')&&!indexes.includes(p));
assert.deepEqual(unexpected,[]);
const rawCheck=(p,expected,cwd,commit)=>{
 const actual=hash(fs.readFileSync(p));assert.equal(actual,expected,p+' working bytes');
 const rel=relative(p,cwd),r=run('git',['show',commit+':'+rel],cwd,null);assert.equal(r.exit_code,0,String(r.stderr));
 const committed=hash(r.stdout);assert.equal(committed,expected,p+' committed blob bytes');
 return {path:rel,sha256:actual,committed_blob_sha256:committed,commit};
};
const rawSources=manifest.input_sources.map(x=>rawCheck(x.path,x.sha256,root,sourcePayload));
const rawPacket=Object.entries(reproduction.artifacts).map(([p,h])=>rawCheck(path.join(lessons,paragraph,p),h,lessons,lessonPayload));
rawPacket.push(rawCheck(manifest.thin_wrapper.path,manifest.thin_wrapper.sha256,lessons,lessonPayload));
const viewed=[...inspection.color_pages,...inspection.grayscale_pages];
const rawViewed=viewed.map(p=>rawCheck(p.path,p.sha256,root,head));
const pending=Object.entries(inspection.native_pending_manifests).map(([p,h])=>{
 const bytes=rawCheck(p,h,root,head),v=read(p);assert.equal(v.inspection_status,'PENDING');assert.deepEqual(v.pages_inspected,[]);return bytes;
});
const buildManifest=rawCheck(path.join(root,prefix+'build-manifest-r8.json'),inspection.build_manifest.sha256,root,head);
const canonicalPlan=paragraph+'2.3.1-textbook-plan.md';
assert.equal(hash(fs.readFileSync(path.join(lessons,canonicalPlan),'utf8').replace(/\r\n/g,'\n')),'60d6a743681e1361478395a591b7c82e44acf8c4587a93c4cc842b036cf017b1');
assert.equal(git(['diff',lessonBase,lessonPayload,'--',canonicalPlan],lessons),'');
const completePlatformBase=git(['rev-parse','origin/main']),completeLessonBase=git(['rev-parse','origin/main'],lessons);
git(['merge-base','--is-ancestor',completePlatformBase,head]);git(['merge-base','--is-ancestor',completeLessonBase,lessonPayload],lessons);
const configs=[
 ['owned_production_candidate',['--lane','shared','--base',base,'--head',head,'--json']],
 ['owned_lesson_packet',['--cwd',lessons,'--lane','textbook','--base',lessonBase,'--head',lessonPayload,'--json']],
 ['actual_complete_platform_candidate',['--lane','shared','--base',completePlatformBase,'--head',head,'--json']],
 ['actual_complete_lesson_candidate',['--cwd',lessons,'--lane','textbook','--base',completeLessonBase,'--head',lessonPayload,'--json']],
];
const native=configs.map(([label,args])=>{const r=run('node',['build-scripts/workflows/check-paragraph-lane-scope.js',...args]);assert.equal(r.exit_code,0,r.stdout+r.stderr);return {label,...r,result:JSON.parse(r.stdout)};});
const defaultWhitespace=run('git',['diff','--check',base,head]);
assert.equal(defaultWhitespace.exit_code,0,defaultWhitespace.stdout);
// JSONL preserves raw Windows stdout; its derived Markdown presentation is normalized before each publication.
git(['-c','core.whitespace=cr-at-eol','diff','--check',base,head]);git(['diff','--check',lessonBase,lessonPayload],lessons);
console.log(JSON.stringify({
 kind:'ACTUAL_COMMITTED_PRODUCTION_SCOPE_AND_RAW_IDENTITY',date:'2026-09-06',builder:'paragraph_231_builder',
 source_payload:sourcePayload,lesson_payload:lessonPayload,platform_subject:head,
 owned_platform_base:base,owned_lesson_base:lessonBase,complete_platform_base:completePlatformBase,complete_lesson_base:completeLessonBase,
 status:'PASS',owned_source_paths:sourcePaths,owned_platform_paths:own,owned_lesson_paths:lessonPaths,
 raw_sources:rawSources,raw_lesson_packet_and_wrapper:rawPacket,all66_personally_viewed_pages:rawViewed,
 immutable_native_pending_manifests:pending,immutable_build_manifest:buildManifest,
 canonical_plan_unchanged:true,whitespace:defaultWhitespace,independent_QC:'PENDING_NOT_SELF_APPROVED',native,
 interpretation:'All actual owned production paths are bounded to paragraph231, unique evidence/proof and the explicitly authorized exact root grant. Native narrow shared lane now has real approved source and passes; historical plan-only evidence-lane FAIL is not relabelled. Both complete native baselines are the fetched actual origin/main and include inherited work fully in the native results. No fake source, exception or waiver.',
 current_head_CI:'NOT_RUN_BY_BUILDER_ROOT_INTEGRATION_PENDING'
},null,2));
