'use strict';
// A new bounded successor; predecessor manifests and their acceptance pins stay sealed.
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const prior=require('./exercise-route-revision'), book2=require('./book2-signed-revision');
const signed=require('./books34-signed-revision');
const {safeFile}=require('../references/books34-v3-delivery');
const {gitBlob}=require('../lib/historical-paths');
const ROOT=path.resolve(__dirname,'../..'), EDITION='edities/books34-v3';
const CONTRACT_FILE='build-scripts/books/books34-followups-contract.json';
const contract=JSON.parse(fs.readFileSync(path.join(ROOT,CONTRACT_FILE)));
const BASE=contract.lessons_base, PLATFORM_BASE=contract.platform_base, REVISION=contract.revision;
const MANIFEST='books34-followups-revision.json', PIN_FILE='build-scripts/books/books34-followups-revision-pin.json';
const CHAPTERS=['3.1','3.2','3.3','4.1','4.2','4.3'];
const publications=[];
for(const c of CHAPTERS)for(const suffix of ['.html','.pdf','_page_map.json'])
  publications.push(`books/book-${c[0]}/chapters/${c}/output/Boek_${c[0]}_H${c[2]}_Docenteninformatie_v3${suffix}`);
for(const suffix of ['.html','.pdf','_page_map.json'])publications.push('books/book-3/chapters/3.2/output/Boek_3_H2_Antwoorden_v3'+suffix);
for(const b of ['3','4']) {
  for(const suffix of ['.html','.pdf','_page_map.json'])publications.push(`books/book-${b}/book-matter/output/front-teacher${suffix}`);
  for(const suffix of ['','_Docenteninformatie'])publications.push(`books/book-${b}/output/Boek_${b}_Compleet${suffix}_v3.pdf`);
}
publications.push('books/book-3/output/Boek_3_Compleet_Antwoorden_v3.pdf');
const pins=[...[1,2,3,4].map(n=>`curriculum/targets/3.2.${n}.json`),'curriculum/course-target-exercises-books34-v3.json'];
const metadata=['README.md','SOURCE_OWNERSHIP.md','FOLLOWUPS-2026-09-28.md','build/build_all.py','checks/followups-build.json','checks/followups-verification.json'];
const ALLOWED=new Set([MANIFEST,...contract.source_bindings.map(r=>r.path),...[...publications,...pins,...metadata].map(f=>EDITION+'/'+f)]);
const INPUTS=[CONTRACT_FILE,...['books34-followups-revision.js','record_books34_followups_revision.js',
  'books34_followups_common.py','rebuild_books34_followups.py','verify_books34_followups.py',
  'books34_followups_assemble.py','books34_links.py','books34_records.py','books34_verify.py',
  'verify_exercise_routes.py','requirements-exercise-routes.txt'].map(f=>'build-scripts/books/'+f),
  'build-scripts/maintenance/check-books34-v3-import.js',
  'build-scripts/workflows/check-paragraph-lane-scope.js',
  '.github/workflows/paired-books34-followups-ci.yml','build-scripts/books/books34-followups-review.js'];
const git=(repo,args)=>execFileSync('git',args,{cwd:repo,maxBuffer:256*1024*1024});
const assert=(value,message)=>{if(!value)throw Error(message);};

function history(lessons,root=ROOT) {
  const earlier=signed.predecessor(lessons,root);
  const bytes=git(lessons,['show',BASE+':'+signed.MANIFEST]);
  const pinBytes=git(root,['show',PLATFORM_BASE+':'+signed.PIN_FILE]);
  assert(fs.readFileSync(safeFile(lessons,signed.MANIFEST)).equals(bytes),'Signed predecessor manifest changed');
  assert(fs.readFileSync(safeFile(root,signed.PIN_FILE)).equals(pinBytes),'Signed predecessor pin changed');
  assert(prior.sha(bytes)===JSON.parse(pinBytes).manifest_sha256,'Unauthenticated signed predecessor');
  const doc=JSON.parse(bytes);
  for(const row of doc.platform_inputs) {
    // Only the current dispatcher changes; its old bytes stay bound to the
    // accepted Git commit, while INPUTS binds its reviewed replacement.
    const accepted=git(root,['show',PLATFORM_BASE+':'+row.path]);
    assert(prior.sha(prior.text(accepted))===row.sha256_lf,'False historical platform input '+row.path);
    if(row.path!=='build-scripts/maintenance/check-books34-v3-import.js')
      assert(prior.text(fs.readFileSync(safeFile(root,row.path)))===prior.text(accepted),'Sealed signed input changed '+row.path);
  }
  return [...earlier,{manifest:signed.MANIFEST,lesson_commit:BASE,sha256:prior.sha(bytes),files:doc.files.length}];
}

function changedPaths(lessons) {
  return [...new Set((String(git(lessons,['diff','--name-only','-z',BASE]))+String(git(lessons,['ls-files','--others','--exclude-standard','-z']))).split('\0').filter(Boolean))].sort();
}

function verifyFiles(lessons,rows,actual,baseline) {
  const left=new Map(baseline);
  assert(Array.isArray(rows)&&JSON.stringify(rows.map(r=>r.path))===JSON.stringify(actual),'Unexpected follow-up inventory');
  for(const row of rows) {
    const bytes=fs.readFileSync(safeFile(lessons,row.path)), blob=left.get(row.path)||null;
    assert(row.baseline_git_blob===blob,'False baseline identity '+row.path);
    assert(row.bytes===bytes.length&&row.sha256===prior.sha(bytes),'Stale follow-up bytes '+row.path);
    if(!ALLOWED.has(row.path))assert(gitBlob(bytes)===blob,'Protected predecessor changed '+row.path);
    left.delete(row.path);
  }
  assert(!left.size,'Predecessor files removed');
}

function sourcesAndTargets(lessons) {
  for(const row of contract.source_bindings) {
    const bytes=fs.readFileSync(safeFile(lessons,row.path));
    assert(prior.sha(bytes)===row.proposed_sha256,'Unapproved source '+row.path);
    let restored=bytes.toString();
    for(const edit of [...contract.source_edits].reverse().filter(e=>e.path===row.path)) {
      assert(restored.split(edit.new).length===2,'Ambiguous source replacement '+row.path);
      restored=restored.replace(edit.new,edit.old);
    }
    assert(prior.sha(restored)===row.baseline_sha256,'Non-contract source delta '+row.path);
    assert(prior.sha(git(lessons,['show',BASE+':'+row.path]))===row.baseline_sha256,'False source baseline '+row.path);
  }
  const file=EDITION+'/curriculum/course-target-exercises-books34-v3.json';
  const expected=JSON.parse(git(lessons,['show',BASE+':'+file]));
  for(const record of expected.records) {
    if(record.id.startsWith('3.2.'))record.source_pin.answer_file_sha256=prior.sha(fs.readFileSync(safeFile(lessons,EDITION+'/'+record.source_pin.answer_file)));
    const actual=JSON.parse(fs.readFileSync(safeFile(lessons,EDITION+'/curriculum/targets/'+record.id+'.json')));
    assert(JSON.stringify(actual)===JSON.stringify(record),'Changed target/route/status '+record.id);
    for(const [hash,source] of [['answer_file_sha256','answer_file'],['student_manuscript_sha256','student_file']])
      assert(actual.source_pin[hash]===prior.sha(fs.readFileSync(safeFile(lessons,EDITION+'/'+actual.source_pin[source]))),'False source pin '+record.id);
  }
  assert(JSON.stringify(JSON.parse(fs.readFileSync(safeFile(lessons,file))))===JSON.stringify(expected),'Changed combined targets');
}

function verifyManifest(lessons,bytes,pin,{root=ROOT,requireTracked=false}={}) {
  assert(prior.sha(bytes)===pin.manifest_sha256,'Unreviewed follow-up manifest');
  const doc=JSON.parse(bytes), actual=book2.inventory(lessons), baseline=signed.tree(lessons,BASE,[...prior.ROOTS,book2.PROJECTION]);
  assert(doc.revision===REVISION&&doc.baseline_lesson_commit===BASE,'Wrong follow-up/base');
  assert(JSON.stringify(doc.predecessors)===JSON.stringify(history(lessons,root)),'False historical evidence');
  verifyFiles(lessons,doc.files,actual,baseline);
  const changes=changedPaths(lessons);
  assert(changes.every(f=>ALLOWED.has(f)),'Outside follow-up scope: '+changes.filter(f=>!ALLOWED.has(f)).join(', '));
  assert(JSON.stringify(changes)===JSON.stringify(pin.revision_paths),'Unreviewed changed-path list');
  assert(JSON.stringify(doc.platform_inputs.map(r=>r.path))===JSON.stringify(INPUTS),'Wrong platform inventory');
  for(const row of doc.platform_inputs)
    assert(prior.sha(prior.text(fs.readFileSync(safeFile(root,row.path))))===row.sha256_lf,'Stale follow-up tool '+row.path);
  sourcesAndTargets(lessons);
  if(requireTracked) {
    const names=[...actual,MANIFEST,prior.MANIFEST,book2.MANIFEST,signed.MANIFEST];
    const entries=new Map(String(git(lessons,['ls-files','--stage','-z','--',...prior.ROOTS,book2.PROJECTION,MANIFEST,prior.MANIFEST,book2.MANIFEST,signed.MANIFEST])).split('\0').filter(Boolean).map(row=>{const [info,file]=row.split('\t');return [file,info.split(' ')];}));
    assert(entries.size===names.length,'Follow-up inventory not fully tracked');
    for(const file of names) {
      const row=entries.get(file);
      assert(row&&row[0]==='100644'&&row[2]==='0'&&row[1]===gitBlob(fs.readFileSync(safeFile(lessons,file))),'Staged bytes differ '+file);
    }
  }
  return doc;
}

function acceptedSignedBaseline({root=ROOT,lessons=path.resolve(root,'../4veco-lessen'),requireTracked=false}={}) {
  // Required platform CI still pairs with lesson main until the companion PR
  // merges. Accept exactly the reviewed signed tree, never a changed PDF or
  // a freshly re-pinned predecessor under the new dispatcher.
  const failures=[];let count=0;
  try {
    history(lessons,root);
    const doc=JSON.parse(git(lessons,['show',BASE+':'+signed.MANIFEST]));
    const actual=book2.inventory(lessons);
    assert(JSON.stringify(actual)===JSON.stringify(doc.files.map(r=>r.path)),'Changed accepted signed inventory');
    for(const row of doc.files) {
      const bytes=fs.readFileSync(safeFile(lessons,row.path));
      assert(bytes.length===row.bytes&&prior.sha(bytes)===row.sha256,'Changed accepted signed baseline '+row.path);
    }
    assert(changedPaths(lessons).length===0,'Changes outside accepted signed baseline');
    if(requireTracked)assert(!String(git(lessons,['diff','--name-only']))&&!String(git(lessons,['diff','--cached','--name-only'])),'Dirty accepted signed index');
    count=doc.files.length;
  }catch(error){failures.push(error.message);}
  return {revision:signed.REVISION,state:signed.REVISION,evidence:'Exact accepted merged predecessor; no follow-up claim',files:count,passed:!failures.length,failures};
}

function verify({root=ROOT,lessons=path.resolve(root,'../4veco-lessen'),requireTracked=false}={}) {
  const failures=[];let doc;
  try {
    const pin=JSON.parse(fs.readFileSync(safeFile(root,PIN_FILE)));
    assert(pin.revision===REVISION,'Wrong follow-up pin');
    doc=verifyManifest(lessons,fs.readFileSync(safeFile(lessons,MANIFEST)),pin,{root,requireTracked});
  }catch(error){failures.push(error.message);}
  return {revision:REVISION,state:REVISION,files:doc?.files.length||0,passed:!failures.length,failures};
}

module.exports={ROOT,EDITION,BASE,PLATFORM_BASE,REVISION,MANIFEST,PIN_FILE,INPUTS,ALLOWED,contract,publications,history,changedPaths,verifyFiles,sourcesAndTargets,verifyManifest,acceptedSignedBaseline,verify};
