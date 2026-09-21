'use strict';
// Exact source/output successor to the reviewed exercise-route edition.
// A new revision requires a new reviewed inventory and platform pin.
const fs=require('fs'),path=require('path');
const {execFileSync}=require('child_process');
const prior=require('./exercise-route-revision');
const {safeFile}=require('../references/books34-v3-delivery');
const {gitBlob}=require('../lib/historical-paths');
const ROOT=path.resolve(__dirname,'../..');
const REVISION='book2-theory-signed-20260921';
const BASE='fdad5d8f62b7e12618e6a3b8d344c407c259ed35';
const MANIFEST='book2-signed-revision.json';
const PIN_FILE='build-scripts/books/book2-signed-revision-pin.json';
const BOOK=prior.ROOTS[0];
const PROJECTION='course_blueprint_v5.md';
const inventory=lessons=>[...prior.inventory(lessons),PROJECTION].sort();
const git=(root,args)=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
function baseline(lessons) {
  return new Map(String(git(lessons,['ls-tree','-r','-z',BASE,'--',...prior.ROOTS,PROJECTION])).split('\0').filter(Boolean).map(row=>{
    const [info,file]=row.split('\t');return [file,info.split(' ')[2]];
  }));
}
function historical(file) {
  if(file===PROJECTION)return false;
  const name=file.slice(BOOK.length+1);
  return !file.startsWith(BOOK+'/') || /^bronnen\/H[123]\/[^/]+\.py$/.test(name)
    || /^(delivery-manifest|repair-manifest|route-chapter-inputs|route-assembly-manifest)\.json$/.test(name)
    || /^(CORRECTIES|ROUTE-REVISION)/.test(name);
}
function verifyManifest(lessons,bytes,pin,{requireTracked=false}={}) {
  if(prior.sha(bytes)!==pin.manifest_sha256)throw Error('Unreviewed Book 2 content manifest');
  const doc=JSON.parse(bytes);
  if(doc.revision!==REVISION || doc.baseline_lesson_commit!==BASE)throw Error('Unknown native revision/base');
  const actual=inventory(lessons),rows=doc.files;
  if(!Array.isArray(rows)||new Set(rows.map(r=>r.path)).size!==rows.length||JSON.stringify(actual)!==JSON.stringify(rows.map(r=>r.path)))throw Error('Unexpected native revision inventory');
  const base=baseline(lessons);
  for(const row of rows) {
    const bytes=fs.readFileSync(safeFile(lessons,row.path));
    if(bytes.length!==row.bytes||prior.sha(bytes)!==row.sha256)throw Error('Stale native revision file '+row.path);
    const before=base.get(row.path)||null;
    if(row.baseline_git_blob!==before)throw Error('False historical identity '+row.path);
    if(historical(row.path)&&gitBlob(bytes)!==before)throw Error('Historical evidence/Book 3/4 changed '+row.path);
    base.delete(row.path);
  }
  if(base.size)throw Error('Historical files removed');
  if(!fs.readFileSync(safeFile(lessons,prior.MANIFEST)).equals(git(lessons,['show',`${BASE}:${prior.MANIFEST}`])))throw Error('Original route manifest changed');
  if(requireTracked) {
    const entries=new Map(String(git(lessons,['ls-files','--stage','-z','--',...prior.ROOTS,PROJECTION,MANIFEST,prior.MANIFEST])).split('\0').filter(Boolean).map(row=>{
      const [info,file]=row.split('\t');return [file,info.split(' ')];
    }));
    if(entries.size!==rows.length+2)throw Error('Native revision not fully tracked');
    for(const file of [...actual,MANIFEST,prior.MANIFEST]) {
      const entry=entries.get(file);
      if(!entry||entry[0]!=='100644'||entry[2]!=='0'||entry[1]!==gitBlob(fs.readFileSync(safeFile(lessons,file))))throw Error('Staged native bytes differ '+file);
    }
  }
  return doc;
}
function verify({root=ROOT,lessons=path.resolve(root,'../4veco-lessen'),requireTracked=false}={}) {
  const failures=[];let doc;
  try {
    const pin=JSON.parse(fs.readFileSync(path.join(root,PIN_FILE)));
    if(pin.revision!==REVISION)throw Error('Unknown platform native revision');
    doc=verifyManifest(lessons,fs.readFileSync(safeFile(lessons,MANIFEST)),pin,{requireTracked});
    if(!require('../workflows/book2-signed-authority').matchesFile('references/owned/course-blueprint-v5.md',fs.readFileSync(safeFile(lessons,PROJECTION))))throw Error('Stale signed blueprint projection');
    for(const row of doc.platform_inputs)if(prior.sha(prior.text(fs.readFileSync(safeFile(root,row.path))))!==row.sha256_lf)throw Error('Stale platform native input '+row.path);
    const changed=String(git(lessons,['diff','--name-only','-z',BASE]))+String(git(lessons,['ls-files','--others','--exclude-standard','-z']));
    const allowed=new Set(pin.revision_paths);
    for(const file of changed.split('\0').filter(Boolean))if(!allowed.has(file))throw Error('Outside finite Book 2 revision '+file);
  }catch(error){failures.push(error.message);}
  return {revision:REVISION,state:REVISION,files:doc?.files.length||0,passed:!failures.length,failures};
}
if(require.main===module) {
  const result=verify({requireTracked:process.argv.includes('--require-tracked')});
  console.log(JSON.stringify(result,null,2));if(!result.passed)process.exitCode=1;
}
module.exports={ROOT,REVISION,BASE,MANIFEST,PIN_FILE,BOOK,PROJECTION,inventory,baseline,historical,verifyManifest,verify};
