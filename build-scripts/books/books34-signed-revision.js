'use strict';
// A finite successor, never a repin of the historical route or Book 2 promise.
const fs = require('fs'), path = require('path');
const {execFileSync} = require('child_process');
const prior = require('./exercise-route-revision');
const book2 = require('./book2-signed-revision');
const {safeFile} = require('../references/books34-v3-delivery');
const {gitBlob} = require('../lib/historical-paths');
const ROOT = path.resolve(__dirname, '../..');
const CONTRACT_FILE = 'build-scripts/books/books34-signed-contract.json';
const contract = JSON.parse(fs.readFileSync(path.join(ROOT, CONTRACT_FILE)));
const BASE = contract.lessons_main, PLATFORM_BASE = contract.platform_main;
const EDITION = 'edities/books34-v3';
const REVISION = 'books34-signed-retrieval-20260926';
const MANIFEST = 'books34-signed-revision.json';
const PIN_FILE = 'build-scripts/books/books34-signed-revision-pin.json';
const METADATA = ['README.md','build/build_all.py','SIGNED-RETRIEVAL-2026-09-26.md',
  'checks/signed-retrieval-build.json','checks/signed-retrieval-verification.json','checks/signed-retrieval-environment.json'];
const ALLOWED = new Set([MANIFEST, ...contract.source_bindings.map(r => r.path),
  ...contract.content_dependent_publication_derivatives_29.map(r => EDITION+'/'+r.path),
  ...contract.source_pin_records_to_refresh_20.map(f => EDITION+'/'+f),
  EDITION+'/curriculum/book-page-map-v3.json', ...METADATA.map(f => EDITION+'/'+f)]);
const INPUTS = [CONTRACT_FILE, ...['books34-signed-revision.js','record_books34_signed_revision.js',
  'books34_signed_common.py','rebuild_books34_signed.py','verify_books34_signed.py',
  'books34_assemble.py','books34_records.py','books34_verify.py','verify_exercise_routes.py',
  'requirements-exercise-routes.txt'].map(f => 'build-scripts/books/'+f),
  'build-scripts/maintenance/check-books34-v3-import.js'];
const git = (repo, args, options={}) => execFileSync('git', args, {cwd:repo,maxBuffer:256*1024*1024,...options});
const assert = (value, message) => {if (!value) throw Error(message);};
function tree(repo, ref, paths=[]) {
  return new Map(String(git(repo,['ls-tree','-r','-z',ref,'--',...paths])).split('\0').filter(Boolean).map(row=>{
    const [info,file] = row.split('\t'), [mode,type,blob] = info.split(' ');
    assert(mode==='100644' && type==='blob','Unsupported baseline mode '+file);
    return [file,blob];
  }));
}
function blobRecords(repo, blobs) {
  const values=[...new Set(blobs)], result=new Map();
  for(let start=0;start<values.length;start+=32) {
    const batch=values.slice(start,start+32), data=git(repo,['cat-file','--batch'],{input:batch.join('\n')+'\n'});
    let position=0;
    for(const oid of batch) {
      const end=data.indexOf(10,position), [actual,type,size]=data.subarray(position,end).toString().split(' ');
      assert(actual===oid && type==='blob','Missing historical blob '+oid);
      const content=data.subarray(end+1,end+1+Number(size));
      result.set(oid,{bytes:content.length,sha256:prior.sha(content)});
      position=end+2+Number(size);
    }
  }
  return result;
}
function predecessor(lessons, root=ROOT) {
  const result=[];
  for(const [name,pinFile,ref] of [[prior.MANIFEST,prior.PIN_FILE,book2.BASE],[book2.MANIFEST,book2.PIN_FILE,BASE]]) {
    const bytes=git(lessons,['show',ref+':'+name]), pinBytes=fs.readFileSync(safeFile(root,pinFile));
    assert(pinBytes.equals(git(root,['show',PLATFORM_BASE+':'+pinFile])),'Historical platform pin changed '+pinFile);
    assert(fs.readFileSync(safeFile(lessons,name)).equals(bytes),'Historical manifest changed '+name);
    const pin=JSON.parse(pinBytes), doc=JSON.parse(bytes);
    assert(prior.sha(bytes)===pin.manifest_sha256,'Unaccepted predecessor manifest '+name);
    const files=tree(lessons,ref,[...prior.ROOTS,...(name===book2.MANIFEST?[book2.PROJECTION]:[])]);
    const records=blobRecords(lessons,files.values());
    assert(JSON.stringify([...files.keys()].sort())===JSON.stringify(doc.files.map(r=>r.path).sort()),'Predecessor inventory mismatch '+name);
    for(const row of doc.files) {
      const actual=records.get(files.get(row.path));
      assert(actual.bytes===row.bytes && actual.sha256===row.sha256,'Unaccepted predecessor bytes '+row.path);
    }
    // Preserve the accepted platform input bytes, including PV and old verifiers.
    for(const row of doc.platform_inputs) {
      assert(prior.text(fs.readFileSync(safeFile(root,row.path)))===prior.text(git(root,['show',PLATFORM_BASE+':'+row.path])),
        'Historical platform input changed '+row.path);
    }
    result.push({manifest:name,lesson_commit:ref,sha256:prior.sha(bytes),files:doc.files.length});
  }
  const pv='references/data/procedure-visual/procedure-templates.json';
  assert(fs.readFileSync(safeFile(root,pv)).equals(git(root,['show',PLATFORM_BASE+':'+pv])),'Held PV templates changed');
  return result;
}
function sourceAndPins(lessons) {
  for(const row of contract.source_bindings) {
    const content=fs.readFileSync(safeFile(lessons,row.path));
    assert(prior.sha(content)===row.proposed_sha256,'Unapproved source change '+row.path);
    let original=String(content);
    for(const edit of contract.source_edits.filter(e=>e.path===row.path).reverse()) {
      assert(original.split(edit.new).length===2,'Missing/duplicate approved fragment '+edit.question);
      original=original.replace(edit.new,edit.old);
    }
    assert(prior.sha(original)===row.baseline_sha256,'Source inverse differs '+row.path);
  }
  const file=EDITION+'/curriculum/course-target-exercises-books34-v3.json';
  const expected=JSON.parse(git(lessons,['show',BASE+':'+file]));
  const pins=new Set(contract.source_pin_records_to_refresh_20);
  for(const record of expected.records) {
    if(pins.has('curriculum/targets/'+record.id+'.json'))record.source_pin.answer_file_sha256=prior.sha(fs.readFileSync(safeFile(lessons,EDITION+'/'+record.source_pin.answer_file)));
    if(['3.2.3','3.3.3'].includes(record.id))record.source_pin.student_manuscript_sha256=prior.sha(fs.readFileSync(safeFile(lessons,EDITION+'/'+record.source_pin.student_file)));
    const current=JSON.parse(fs.readFileSync(safeFile(lessons,EDITION+'/curriculum/targets/'+record.id+'.json')));
    assert(JSON.stringify(current)===JSON.stringify(record),'Changed/stale target '+record.id);
    for(const [key,fileKey] of [['answer_file_sha256','answer_file'],['student_manuscript_sha256','student_file']])
      assert(current.source_pin[key]===prior.sha(fs.readFileSync(safeFile(lessons,EDITION+'/'+current.source_pin[fileKey]))),'False source pin '+record.id);
  }
  assert(JSON.stringify(JSON.parse(fs.readFileSync(safeFile(lessons,file))))===JSON.stringify(expected),'Changed combined target payload');
  const map=EDITION+'/curriculum/book-page-map-v3.json';
  assert(fs.readFileSync(safeFile(lessons,map)).equals(git(lessons,['show',BASE+':'+map])),'Changed global pagination');
}
function changedPaths(lessons) {
  return [...new Set((String(git(lessons,['diff','--name-only','-z',BASE]))+String(git(lessons,['ls-files','--others','--exclude-standard','-z']))).split('\0').filter(Boolean))].sort();
}
function verifyFiles(lessons, files, actual, baseline) {
  const base=new Map(baseline);
  assert(Array.isArray(files) && JSON.stringify(actual)===JSON.stringify(files.map(r=>r.path)),'Unexpected successor inventory');
  for(const row of files) {
    const data=fs.readFileSync(safeFile(lessons,row.path)), blob=base.get(row.path)||null;
    assert(row.baseline_git_blob===blob,'False predecessor blob '+row.path);
    assert(row.bytes===data.length && row.sha256===prior.sha(data),'Stale successor file '+row.path);
    if(!ALLOWED.has(row.path))assert(gitBlob(data)===blob,'Protected predecessor changed '+row.path);
    base.delete(row.path);
  }
  assert(base.size===0,'Predecessor files removed');
}
function verifyManifest(lessons, bytes, pin, {root=ROOT,requireTracked=false}={}) {
  assert(prior.sha(bytes)===pin.manifest_sha256,'Unreviewed Books 3/4 successor manifest');
  const doc=JSON.parse(bytes), actual=book2.inventory(lessons), base=tree(lessons,BASE,[...prior.ROOTS,book2.PROJECTION]);
  assert(doc.revision===REVISION && doc.baseline_lesson_commit===BASE,'Unknown successor/base');
  assert(JSON.stringify(doc.approved_source_replacements)===JSON.stringify(contract.source_edits),'Unapproved source-replacement contract');
  assert(JSON.stringify(doc.predecessors)===JSON.stringify(predecessor(lessons,root)),'False predecessor evidence');
  verifyFiles(lessons,doc.files,actual,base);
  const changes=changedPaths(lessons);
  assert(changes.every(f=>ALLOWED.has(f)),'Out-of-scope successor change: '+changes.filter(f=>!ALLOWED.has(f)).join(', '));
  assert(JSON.stringify(changes)===JSON.stringify(pin.revision_paths),'Unreviewed changed-path inventory');
  assert(JSON.stringify(doc.platform_inputs.map(r=>r.path))===JSON.stringify(INPUTS),'Unexpected platform inputs');
  for(const row of doc.platform_inputs)assert(prior.sha(prior.text(fs.readFileSync(safeFile(root,row.path))))===row.sha256_lf,'Stale successor platform input '+row.path);
  sourceAndPins(lessons);
  if(requireTracked) {
    const paths=[...actual,MANIFEST,prior.MANIFEST,book2.MANIFEST];
    const entries=new Map(String(git(lessons,['ls-files','--stage','-z','--',...prior.ROOTS,book2.PROJECTION,MANIFEST,prior.MANIFEST,book2.MANIFEST])).split('\0').filter(Boolean).map(row=>{
      const [info,file]=row.split('\t');return [file,info.split(' ')];
    }));
    assert(entries.size===paths.length,'Successor is not fully tracked');
    for(const file of paths) {
      const e=entries.get(file);
      assert(e && e[0]==='100644' && e[2]==='0' && e[1]===gitBlob(fs.readFileSync(safeFile(lessons,file))),'Staged successor bytes differ '+file);
    }
  }
  return doc;
}
function verify({root=ROOT,lessons=path.resolve(root,'../4veco-lessen'),requireTracked=false}={}) {
  const failures=[];let doc;
  try {
    const pin=JSON.parse(fs.readFileSync(safeFile(root,PIN_FILE)));
    assert(pin.revision===REVISION,'Unknown successor pin');
    doc=verifyManifest(lessons,fs.readFileSync(safeFile(lessons,MANIFEST)),pin,{root,requireTracked});
  }catch(error){failures.push(error.message);}
  return {revision:REVISION,state:REVISION,files:doc?.files.length||0,passed:failures.length===0,failures};
}
if(require.main===module){const result=verify({requireTracked:process.argv.includes('--require-tracked')});console.log(JSON.stringify(result,null,2));if(!result.passed)process.exitCode=1;}
module.exports={ROOT,BASE,PLATFORM_BASE,EDITION,REVISION,MANIFEST,PIN_FILE,INPUTS,ALLOWED,contract,tree,predecessor,sourceAndPins,changedPaths,verifyFiles,verifyManifest,verify};
