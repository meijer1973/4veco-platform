// HOW TO ADAPT: fixed §231 adoption checkpoint; read all originals, write new proof only.
// Never rewrites imported manifests, source, native packet or historical diagnostics.
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto'),a=require('assert/strict');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const originalRoot='C:/wt/book2-231-production-20260905/4veco-platform';
const originalLessons='C:/wt/book2-231-production-20260905/4veco-lessen';
const pbase='3abef1a17131e36aa7047e461900c014dca73642',psha='85fa4910a7e6bcac69b36c38bffdf6c0d10d0c68';
const lbase='4fe0d742a3cd3c02ac1aaf6311dccc540970e2f5',lsha='384d9967a124fcc917a2eea3fe549829919cbeb7';
const rootLbase='d4e1910d60964ee4b9ac97eefbf0e0ed202fc28f';
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-';
const para='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus/';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const fileHash=p=>hash(fs.readFileSync(p));
function git(args,cwd=root,binary=false){const r=cp.spawnSync('git',args,{cwd,encoding:binary?null:'utf8',maxBuffer:128*1024*1024});a.equal(r.status,0,String(r.stderr));return binary?r.stdout:r.stdout.trim();}
const blob=(ref,p,cwd=root)=>git(['show',ref+':'+p],cwd,true);
const changed=(b,h,cwd=root)=>git(['diff','--name-only','-z',b,h],cwd).split('\0').filter(Boolean).sort();
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const phase=process.argv[2];a(['prepare','after'].includes(phase));
const classifier=require('../../build-scripts/workflows/check-paragraph-lane-scope.js');
const classifierPath='build-scripts/workflows/check-paragraph-lane-scope.js';
a.equal(fileHash(path.join(root,classifierPath)),'4859543247573f65f5c1ad4f4f373af37c63d91b43fc900ed6702acfb9ce7f51');
a.equal(git(['rev-parse','HEAD'],originalRoot),psha);
a.equal(git(['rev-parse','HEAD'],originalLessons),lsha);
a.equal(git(['status','--porcelain'],originalRoot),'');a.equal(git(['status','--porcelain'],originalLessons),'');
const gap=json(path.join(root,prefix+'production-classifier-gap-r1.json'));
const gray=gap.actual_unknown_paths.slice().sort();a.equal(gray.length,66);a.equal(new Set(gray).size,66);
const rows=gray.map(old=>{
 const m=/^reports\/rendered-proof\/BOOK2-TEXTBOOK-PRODUCTION-1\/231-grayscale-r(4|8)\/(paragraaf|opgaven|antwoorden)\/page-(\d{3})\.png$/.exec(old);a(m,old);
 const dest=prefix+`adopted-evidence/grayscale-r${m[1]}/${m[2]}/page-${m[3]}.png`;
 const original=blob(psha,old),expected=hash(original);
 a.equal(fileHash(path.join(originalRoot,old)),expected);
 a.equal(classifier.classifyPath(old).category,'unknown');a.equal(classifier.classifyPath(dest).category,'review_evidence');
 if(phase==='prepare'){a(!fs.existsSync(path.join(root,dest)));a.equal(fileHash(path.join(root,old)),expected);}
 else {a(!fs.existsSync(path.join(root,old)));a.equal(fileHash(path.join(root,dest)),expected);}
 return {source_commit:psha,old_path:old,new_path:dest,source_git_blob:git(['rev-parse',psha+':'+old]),sha256:expected,bytes:original.length,edition:m[2],page:Number(m[3]),revision:'r'+m[1],status:m[1]==='4'?'SUPERSEDED_BUILDER_CAPTURE':'FINAL_BUILDER_CAPTURE'};
});
const mapping=new Map(rows.map(r=>[r.old_path,r.new_path]));
const imports=changed(pbase,psha).filter(p=>!/^reports\/github-agent-index-(lessen|platform)\.(json|md)$/.test(p));
const grant='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-plan-r2-root-continuation.md';
a(imports.every(p=>p.startsWith('build-scripts/content/book-2/231/')||p==='build-scripts/content/book-2/b2_231.py'||p.startsWith(prefix)||p.startsWith('reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/231-')||p===grant));
const checks=[];
for(const p of imports){const dest=phase==='after'?(mapping.get(p)||p):p,expected=hash(blob(psha,p));a.equal(fileHash(path.join(root,dest)),expected,p);checks.push({old_path:p,adopted_path:dest,sha256:expected,source_commit:psha});}
const lessonPaths=changed(lbase,lsha,lessons);a.equal(lessonPaths.length,43);a(lessonPaths.every(p=>p.startsWith(para)));
a.deepEqual(changed(rootLbase,'HEAD',lessons),lessonPaths);
for(const p of lessonPaths){const expected=hash(blob(lsha,p,lessons));a.equal(fileHash(path.join(lessons,p)),expected,p);checks.push({lesson_path:p,sha256:expected,source_commit:lsha});}
const resolveOriginal=p=>{
 const n=p.replace(/\\/g,'/');
 if(n.startsWith(originalRoot+'/')){const rel=n.slice(originalRoot.length+1);return path.join(root,phase==='after'?(mapping.get(rel)||rel):rel);}
 if(n.startsWith(originalLessons+'/'))return path.join(lessons,n.slice(originalLessons.length+1));
 throw Error('Unexpected original absolute prefix: '+p);
};
const manifest=json(path.join(root,prefix+'build-manifest-r8.json'));
a.equal(manifest.inspection_status,'PENDING');a.equal(Object.keys(manifest.packet).length,42);
for(const [name,expected] of Object.entries(manifest.packet))a.equal(fileHash(path.join(lessons,para,name)),expected);
for(const r of manifest.input_sources)a.equal(fileHash(resolveOriginal(r.path)),r.sha256,r.path);
for(const r of manifest.authority_pins){const bytes=fs.readFileSync(resolveOriginal(r.path));const value=r.contract==='raw'?bytes:bytes.toString('utf8').replace(/^\uFEFF/,'').replace(/\r\n/g,'\n').replace(/\r/g,'\n');a.equal(hash(value),r.sha256,r.path);}
a.equal(fileHash(resolveOriginal(manifest.thin_wrapper.path)),manifest.thin_wrapper.sha256);
const pending=[];
for(const p of imports.filter(p=>p.startsWith('reports/rendered-proof/')&&p.endsWith('/manifest.json'))){
 const data=json(path.join(root,p));a.equal(data.inspection_status,'PENDING');a.deepEqual(data.pages_inspected,[]);a(!JSON.stringify(data).includes('grayscale'));
 for(const [name,expected] of Object.entries(data.page_sha256))a.equal(fileHash(path.join(root,path.dirname(p),'pages',name)),expected);
 pending.push({path:p,sha256:fileHash(path.join(root,p)),pages:Object.keys(data.page_sha256).length});
}
a.equal(pending.length,27);
const grayCorrespondence=[];
for(const rev of [4,8]){const r=json(path.join(root,prefix+`reproduction-r${rev}.json`));a.equal(r.status,'PASS');a.equal(r.all_page_grayscale.length,33);
 for(const rec of r.all_page_grayscale){a.equal(fileHash(resolveOriginal(rec.path)),rec.sha256);const row=rows.find(x=>rec.path.replace(/\\/g,'/').endsWith('/'+x.old_path));a(row);a.equal(row.sha256,rec.sha256);grayCorrespondence.push({old_path:row.old_path,new_path:row.new_path,source_pdf_sha256:rec.source_pdf_sha256,sha256:rec.sha256});}
}
const personal=json(path.join(root,prefix+'builder-personal-inspection-r8.json'));
a.equal(personal.kind,'BUILDER_PERSONAL_INSPECTION_NOT_INDEPENDENT_QC');a.equal(personal.color_pages.length,33);a.equal(personal.grayscale_pages.length,33);a.equal(personal.actual_png_assets.length,15);
for(const p of [...personal.color_pages,...personal.grayscale_pages])a.equal(fileHash(resolveOriginal(p.path)),p.sha256);
const views=[['paragraaf',2],['paragraaf',4],['paragraaf',13],['opgaven',4],['opgaven',8],['antwoorden',10]].map(([edition,page])=>{
 const doc=manifest.documents[['paragraaf','opgaven','antwoorden'].indexOf(edition)];
 const png=doc.proof_directory.replace(/\\/g,'/')+'/pages/page-'+String(page).padStart(3,'0')+'.png';
 return {edition,page,source_pdf_sha256:doc.pdf_sha256,original_png:png,sha256:fileHash(resolveOriginal(png)),personally_viewed_by:'codex-root',scope:'LIMITED_ROOT_OBSERVATION_NOT_FULL_INDEPENDENT_REVIEW'};
});
const out=path.join(root,prefix+`root-import-${phase}.json`);a(!fs.existsSync(out));
const result={status:'PASS',phase,original_platform:psha,original_lessons:lsha,root_platform_at_check:git(['rev-parse','HEAD']),root_lessons_at_check:git(['rev-parse','HEAD'],lessons),rows,imports:checks,original_native_pending_manifests:pending,grayscale_reproduction_correspondence:grayCorrespondence,root_personal_selected_pages:views,limitations:['Original builder scope FAIL remains true for original paths','Original author path-dependent audit is historical, not portable','r4 superseded; r8 final builder snapshot','No canonical review, specialist QC, acceptance or current CI asserted']};
fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:result.status,phase,imports:checks.length,gray:rows.length,pending:pending.length,root_selected_views:views.length,output:path.relative(root,out),sha256:fileHash(out)},null,2));
