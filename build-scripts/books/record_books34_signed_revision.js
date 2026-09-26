'use strict';
// Recorder, never approval. Recheck real sources/PDFs before proposing a pin.
const fs=require('fs'),path=require('path'),os=require('os'),{execFileSync}=require('child_process');
const r=require('./books34-signed-revision'), prior=require('./exercise-route-revision'), book2=require('./book2-signed-revision');
const args=process.argv.slice(2), value=(key,fallback)=>args.includes(key)?args[args.indexOf(key)+1]:fallback;
const lessons=path.resolve(value('--lesson-root',path.join(r.ROOT,'../4veco-lessen')));
const comparison=value('--comparison-root');
if(!comparison)throw Error('A same-environment baseline is required before recording reviewed outputs');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'b34-record-'));
try {
  execFileSync(value('--python','python'),['-X','utf8',path.join(r.ROOT,'build-scripts/books/verify_books34_signed.py'),
    '--lesson-root',lessons,'--comparison-root',path.resolve(comparison),'--report',path.join(temp,'verification.json')],
    {stdio:'inherit',env:{...process.env,PYTHONDONTWRITEBYTECODE:'1',PYTHONUTF8:'1'}});
  const predecessors=r.predecessor(lessons),base=r.tree(lessons,r.BASE,[...prior.ROOTS,book2.PROJECTION]);
  const doc={revision:r.REVISION,baseline_lesson_commit:r.BASE,
    scope:'Exactly eight retrieval/answer wording replacements; explicit answer rebuild and dependent publications. No target, lifecycle, PV, timing, navigation or Part B promotion.',
    predecessors,approved_source_replacements:r.contract.source_edits,
    platform_inputs:r.INPUTS.map(file=>({path:file,sha256_lf:prior.sha(prior.text(fs.readFileSync(path.join(r.ROOT,file))))})),
    files:book2.inventory(lessons).map(file=>{const data=fs.readFileSync(path.join(lessons,file));return {path:file,bytes:data.length,sha256:prior.sha(data),baseline_git_blob:base.get(file)||null};})};
  const bytes=Buffer.from(JSON.stringify(doc,null,2)+'\n');
  fs.writeFileSync(path.join(lessons,r.MANIFEST),bytes);
  const pin={revision:r.REVISION,manifest_sha256:prior.sha(bytes),revision_paths:r.changedPaths(lessons)};
  r.verifyManifest(lessons,bytes,pin);
  fs.writeFileSync(path.join(r.ROOT,r.PIN_FILE),JSON.stringify(pin,null,2)+'\n');
  console.log(JSON.stringify({files:doc.files.length,changed:pin.revision_paths.length,manifest_sha256:pin.manifest_sha256}));
} finally {fs.rmSync(temp,{recursive:true,force:true});}
