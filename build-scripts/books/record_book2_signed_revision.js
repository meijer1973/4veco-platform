'use strict';
// Final-build recorder, not approval: review the exact inventory and pin diff.
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const r=require('./book2-signed-revision'),prior=require('./exercise-route-revision');
const root=r.ROOT,lessons=path.resolve(process.argv[2]||path.join(root,'../4veco-lessen'));
const inputs=[
  ...['assemble_book2_signed.py','book2_native_checks.py','book2_native_theory.py','book2_signed_exports.py','book2_print.py',
    'rebuild_book2_signed.py','verify_book2_signed.py','verify_book2_figures.py','book2-signed-revision.js',
    'build_book2_chat.py','verify_book2_chat.py','requirements-exercise-routes.txt'].map(f=>'build-scripts/books/'+f),
  'references/authored/economic_mathematical_precision_reference.md',
  'references/authored/book2-signed-20260921-authority.json',
  'reports/review-gates/book2-theory-signed-20260921/accepted-navigation-comparison.json',
  'reports/review-gates/book2-print-review-20260921/navigation-delta.json',
];
const base=r.baseline(lessons);
const doc={revision:r.REVISION,baseline_lesson_commit:r.BASE,scope:'43 native theory/reference pages, bounded signed-elasticity wording, continuous printed pagination and generated theory extract; existing route overlay preserved. No lifecycle promotion, Book 3/4 or Part B change.',
  platform_inputs:inputs.map(file=>({path:file,sha256_lf:prior.sha(prior.text(fs.readFileSync(path.join(root,file))))})),
  files:r.inventory(lessons).map(file=>{const bytes=fs.readFileSync(path.join(lessons,file));return {path:file,bytes:bytes.length,sha256:prior.sha(bytes),baseline_git_blob:base.get(file)||null};})};
const bytes=JSON.stringify(doc,null,2)+'\n';fs.writeFileSync(path.join(lessons,r.MANIFEST),bytes);
const git=args=>execFileSync('git',args,{cwd:lessons,encoding:'utf8',maxBuffer:64*1024*1024});
const changes=git(['diff','--name-only','-z',r.BASE])+git(['ls-files','--others','--exclude-standard','-z']);
const revision_paths=[...new Set(changes.split('\0').filter(Boolean))].sort();
if(revision_paths.some(p=>p!==r.MANIFEST&&p!==r.PROJECTION&&!p.startsWith(r.BOOK+'/')))throw Error('Out-of-scope lesson change');
fs.writeFileSync(path.join(root,r.PIN_FILE),JSON.stringify({revision:r.REVISION,manifest_sha256:prior.sha(bytes),revision_paths},null,2)+'\n');
console.log(JSON.stringify({files:doc.files.length,changed:revision_paths.length,manifest_sha256:prior.sha(bytes)}));
