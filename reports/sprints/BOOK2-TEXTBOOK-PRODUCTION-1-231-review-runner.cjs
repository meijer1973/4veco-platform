// Independent review evidence runner; no pupil/authority edits.
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto');
const root=process.cwd(),prefix='BOOK2-TEXTBOOK-PRODUCTION-1-231-review',out=path.join(root,'reports/sprints');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(repo,...args)=>cp.execFileSync('git',['-C',repo,...args]);
const save=(name,value)=>fs.writeFileSync(path.join(out,`${prefix}-${name}.json`),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const stage=process.argv[2];
if(stage==='inspection-verified'){
 const j=JSON.parse(fs.readFileSync(path.join(out,`${prefix}-inspection.json`)));
 if(j.page_observations.length!==66||j.native_figure_observations.length!==15||j.additional_teaching_mutations.length!==4)throw Error('Inspection counts');
 for(const p of j.page_observations)if(sha(fs.readFileSync(path.join(root,p.path)))!==p.sha256)throw Error('Page hash');
 for(const p of j.native_figure_observations)if(sha(fs.readFileSync(p.png_path))!==p.png_sha256)throw Error('Native figure hash');
 const result={status:j.status,counts:j.counts,all66pagesAnd15NativeFiguresRehashed:true,record_sha256:sha(fs.readFileSync(path.join(out,`${prefix}-inspection.json`)))};save(stage,result);console.log(result);
}else if(stage.startsWith('profiles-')){
 const folder=path.resolve(root,'../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus');
 const results=['student-web','publisher-print'].map(profile=>{const args=['scripts/validate-paragraph.js','--mode','part-a','--profile',profile,folder];const result=cp.spawnSync(process.execPath,args,{cwd:root,encoding:'utf8'});return {command:process.execPath,args,status:result.status,stdout:result.stdout,stderr:result.stderr};});
 save(stage,{results,limitation:'Actual gates; missing QC is not waived and exit codes are preserved.'});results.forEach(r=>{console.log('Profile '+r.args[4]+' exit '+r.status);process.stdout.write(r.stdout);process.stderr.write(r.stderr);});
 process.exitCode=results.some(x=>x.status!==0)?1:0;
}else if(stage==='baseline'){
 const lesson=path.resolve(root,'../4veco-lessen');
 const folder='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus';
 const raw=git(lesson,'ls-files','-z',folder).toString('utf8').split('\0').filter(Boolean).map(p=>({path:p,sha256:sha(fs.readFileSync(path.join(lesson,p)))}));
 save('baseline',{lesson_head:git(lesson,'rev-parse','HEAD').toString().trim(),platform_head:git(root,'rev-parse','HEAD').toString().trim(),lesson_files:raw});console.log({lesson_files:raw.length});
}else if(stage==='scope-correspondence'){
 const assessment=JSON.parse(fs.readFileSync(path.join(out,`${prefix}-scope-assessment.json`)));
 const classifier=require(path.join(root,'build-scripts/workflows/check-paragraph-lane-scope.js'));
 const checks=assessment.rows.map(row=>{const revision=row.old_path.includes('r4/')?4:8;const record=JSON.parse(fs.readFileSync(path.join(out,`BOOK2-TEXTBOOK-PRODUCTION-1-231-reproduction-r${revision}.json`))).all_page_grayscale.find(x=>x.path.replaceAll('\\','/').endsWith(row.old_path));if(!record||record.sha256!==row.sha256)throw Error('Missing or mismatching old reproduction reference');const before=classifier.classifyPath(row.old_path),after=classifier.classifyPath(row.proposed_new_path);if(before.category!=='unknown'||after.category!=='review_evidence')throw Error('Unexpected category');return {...row,reproduction_sha256:record.sha256,source_pdf_sha256:record.source_pdf_sha256,original_category:before.category,proposed_category:after.category};});
 save('scope-correspondence',{status:'PASS_READ_ONLY_CORRESPONDENCE_NOT_SCOPE_PASS',checks});console.log({status:'PASS',all66_reproduction_hashes_match:true,all66_original_UNKNOWN:true,all66_proposed_review_evidence:true});
}else if(stage==='scope-assessment'){
 const subject='85fa4910a7e6bcac69b36c38bffdf6c0d10d0c68';
 const gap=JSON.parse(fs.readFileSync(path.join(out,'BOOK2-TEXTBOOK-PRODUCTION-1-231-production-classifier-gap-r1.json')));
 const classifier=require(path.join(root,'build-scripts/workflows/check-paragraph-lane-scope.js'));
 const paths=gap.actual_unknown_paths;
 if(paths.length!==66||new Set(paths).size!==66)throw Error('Expected exactly 66 original grayscale files');
 const rows=paths.map(old=>{
   const blob=git(root,'show',`${subject}:${old}`),actual=fs.readFileSync(path.join(root,old));
   if(!blob.equals(actual))throw Error(`Original Git/worktree mismatch ${old}`);
   const rel=old.split('/231-grayscale-')[1];
   const destination=`reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-adopted-evidence/grayscale-${rel}`;
   return {old_path:old,proposed_new_path:destination,source_commit:subject,source_git_blob:git(root,'rev-parse',`${subject}:${old}`).toString().trim(),bytes:blob.length,sha256:sha(blob)};
 });
 const files=git(root,'ls-tree','-r','--name-only',subject,'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1').toString().trim().split('\n');
 const manifests=files.filter(p=>/^.*\/231-(paragraaf|opgaven|antwoorden)-.*\/manifest\.json$/.test(p));
 const native=manifests.map(p=>{const raw=git(root,'show',`${subject}:${p}`),m=JSON.parse(raw);if(raw.toString().includes('231-grayscale'))throw Error(`Native grayscale reference ${p}`);if(m.inspection_status!=='PENDING'||m.pages_inspected.length||m.visible_student_defects!==null||m.inspected_at_normal_reading_scale!==false)throw Error('Unexpected accepted native manifest');return {path:p,sha256:sha(raw),pages:m.rendered_pages.length,all_paths_are_color:m.rendered_pages.every(x=>/^pages\/page-\d{3}\.png$/.test(x))};});
 const sprints=git(root,'ls-tree','-r','--name-only',subject,'reports/sprints').toString().trim().split('\n').filter(p=>p.includes('-231-')&&/\.(json|md|js|jsonl)$/.test(p));
 const refs=sprints.filter(p=>git(root,'show',`${subject}:${p}`).toString().includes('231-grayscale')).map(p=>({path:p,sha256:sha(git(root,'show',`${subject}:${p}`))}));
 const records=[4,8].map(r=>{const p=`reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-reproduction-r${r}.json`,v=JSON.parse(git(root,'show',`${subject}:${p}`));return {revision:r,keys:Object.keys(v),grayscale:v.grayscale||v.grayscale_pages};});
 const scope=JSON.parse(fs.readFileSync(path.join(out,'BOOK2-TEXTBOOK-PRODUCTION-1-231-production-scope-r1.json')));
 save('scope-assessment',{status:'READ_ONLY_ADOPTION_SUPPORTED_WITH_CONSTRAINTS_NOT_SCOPE_PASS',subject,classifier_sha256:sha(fs.readFileSync(path.join(root,'build-scripts/workflows/check-paragraph-lane-scope.js'))),classifier_exports:Object.keys(classifier),scope_baselines:Object.fromEntries(Object.entries(scope).filter(([k])=>k.endsWith('_base'))),original_grayscale_count:rows.length,rows,native_manifests:native,reference_files:refs,reproduction_records:records,constraints:['Keep original published builder commits and branch; no history rewrite','Keep every native color page and PENDING manifest byte-identical','Import exact 66 bytes at proposed supported path, absence-check each destination, verify SHA and Git blob and edition/page','Do not rewrite old reproduction/inspection/scope records: add explicit relocation resolution','Retain original FAIL and superseded r4 status; do not claim r4 current proof','Evaluate genuine complete candidate scope with genuine source baseline, not arbitrary metadata-only synthetic anchor','No classifier/exception change; proposed mapping here is not an executed correction']});
 console.log(JSON.stringify({status:'SUPPORTED_WITH_CONSTRAINTS',originals:rows.length,native_manifests:native.length,native_grayscale_references:0,reference_files:refs.map(x=>x.path),scope_baselines:Object.fromEntries(Object.entries(scope).filter(([k])=>k.endsWith('_base')))},null,2));
}else{
 const command=process.argv[3],args=process.argv.slice(4);if(!command)throw Error('Command required');
 const started=new Date().toISOString();const result=cp.spawnSync(command,args,{cwd:root,encoding:'utf8',maxBuffer:200*1024*1024,env:process.env});
 save(stage,{command,args,started,finished:new Date().toISOString(),status:result.status,stdout:result.stdout,stderr:result.stderr,error:result.error?.message});
 process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');process.exitCode=result.status??1;
}
