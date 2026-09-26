'use strict';
// Bounded chapter-owned paragraph evidence; native closure/target approval unchanged.
const fs=require('fs'),path=require('path');
const r=require('./books34-signed-revision'),prior=require('./exercise-route-revision');
const {verdict}=require('../../scripts/lib/part-a-review-evidence');
const OUTPUT='reports/review-gates/books34-signed-retrieval-20260926';
const IDS=['3.1.1','3.1.5','3.2.3','3.3.3','4.1.2','4.1.5'];
function snapshots(doc,hash){
  return IDS.map(id=>{
    const prefix=r.EDITION+'/books/book-'+id[0];
    const files=doc.files.filter(row=>row.path.startsWith(prefix+'/chapters/'+id.slice(0,3)+'/')
      ||row.path.startsWith(prefix+'/output/')||row.path.startsWith(prefix+'/book-matter/')
      ||row.path.startsWith(r.EDITION+'/curriculum/')||row.path.startsWith(r.EDITION+'/outlines/')
      ||[r.EDITION+'/SOURCE_OWNERSHIP.md',r.EDITION+'/SIGNED-RETRIEVAL-2026-09-26.md'].includes(row.path));
    const snapshot={schema_version:'edition-paragraph-review-v1',paragraph:id,revision:r.REVISION,
      scope:'Bounded signed retrieval revision; not a native paragraph-records.js closure or target approval',
      baseline_lesson_commit:r.BASE,edition_manifest_sha256:hash,
      hash_contract:'Lesson edition files: exact bytes; platform inputs: UTF-8 with LF',platform_inputs:doc.platform_inputs,files};
    return {id,snapshot,digest:prior.sha(JSON.stringify(snapshot))};
  });
}
function run({check=false,root=r.ROOT,lessons=path.resolve(root,'../4veco-lessen')}={}){
  const verified=r.verify({root,lessons});if(!verified.passed)throw Error(JSON.stringify(verified));
  const bytes=fs.readFileSync(path.join(lessons,r.MANIFEST)),rows=snapshots(JSON.parse(bytes),prior.sha(bytes)),folder=path.join(root,OUTPUT);
  if(!check)fs.mkdirSync(folder,{recursive:true});
  for(const {id,snapshot,digest} of rows){
    const file=path.join(folder,id+'-textbook-review-manifest.json');
    if(!check)fs.writeFileSync(file,JSON.stringify(snapshot,null,2)+'\n');
    else{
      if(JSON.stringify(JSON.parse(fs.readFileSync(file)))!==JSON.stringify(snapshot))throw Error('Stale scoped snapshot '+id);
      const review=fs.readFileSync(path.join(folder,id+'-review.md'),'utf8');
      if(!['PASS','PASS WITH FLAGS'].includes(verdict(review)))throw Error('No passing scoped verdict '+id);
      const bindings=[...review.matchAll(/^Review manifest SHA256: `([a-f0-9]{64})`\s*$/gm)];
      if(bindings.length!==1||bindings[0][1]!==digest)throw Error('Stale independent binding '+id);
      if(!review.includes('bounded signed retrieval revision')||!review.includes('not a native paragraph-records.js closure'))throw Error('Missing scope boundary '+id);
    }
  }
  if(!check)fs.writeFileSync(path.join(folder,'review-manifest-index.json'),JSON.stringify(rows.map(({id,digest})=>({paragraph:id,digest})),null,2)+'\n');
  return {paragraphs:rows.length,mode:check?'verified independent bindings':'snapshot only; independent review required'};
}
if(require.main===module){try{console.log(JSON.stringify(run({check:process.argv.includes('--check')})));}catch(error){console.error(error.message);process.exitCode=1;}}
module.exports={OUTPUT,IDS,snapshots,run};
