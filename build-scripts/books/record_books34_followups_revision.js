'use strict';
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const r=require('./books34-followups-revision'),prior=require('./exercise-route-revision');
const signed=require('./books34-signed-revision'),book2=require('./book2-signed-revision');
const args=process.argv.slice(2),value=(key,fallback)=>args.includes(key)?args[args.indexOf(key)+1]:fallback;
const lessons=path.resolve(value('--lesson-root',path.join(r.ROOT,'../4veco-lessen')));
const comparison=value('--comparison-root');
if(!comparison)throw Error('Builder-authenticated baseline required');
execFileSync(value('--python','python'),['-X','utf8',path.join(r.ROOT,'build-scripts/books/verify_books34_followups.py'),
  '--lesson-root',lessons,'--comparison-root',path.resolve(comparison),
  '--report',path.join(lessons,r.EDITION,'checks/followups-verification.json')],
  {stdio:'inherit',env:{...process.env,PYTHONUTF8:'1',PYTHONDONTWRITEBYTECODE:'1'}});
const base=signed.tree(lessons,r.BASE,[...prior.ROOTS,book2.PROJECTION]);
const doc={revision:r.REVISION,baseline_lesson_commit:r.BASE,
  scope:'NAV1 link preservation, one answer heading, and unmeasured teacher-facing planning advice for 25 theory paragraphs; exercise/target/route/curriculum/PV/Part B contents unchanged.',
  predecessors:r.history(lessons),
  platform_inputs:r.INPUTS.map(file=>({path:file,sha256_lf:prior.sha(prior.text(fs.readFileSync(path.join(r.ROOT,file))))})),
  files:book2.inventory(lessons).map(file=>{const data=fs.readFileSync(path.join(lessons,file));return {path:file,bytes:data.length,sha256:prior.sha(data),baseline_git_blob:base.get(file)||null};})};
const bytes=Buffer.from(JSON.stringify(doc,null,2)+'\n');
fs.writeFileSync(path.join(lessons,r.MANIFEST),bytes);
const pin={revision:r.REVISION,manifest_sha256:prior.sha(bytes),revision_paths:r.changedPaths(lessons)};
r.verifyManifest(lessons,bytes,pin);
fs.writeFileSync(path.join(r.ROOT,r.PIN_FILE),JSON.stringify(pin,null,2)+'\n');
console.log(JSON.stringify({files:doc.files.length,changed:pin.revision_paths.length,manifest_sha256:pin.manifest_sha256}));
