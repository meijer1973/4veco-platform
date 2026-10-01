'use strict';
// A separately reviewed successor. Earlier pins, inventories and validators stay sealed.
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const prior=require('./exercise-route-revision'),book2=require('./book2-signed-revision');
const signed=require('./books34-signed-revision'),followups=require('./books34-followups-revision');
const {safeFile}=require('../references/books34-v3-delivery');
const {gitBlob}=require('../lib/historical-paths');
const ROOT=path.resolve(__dirname,'../..'),BASE='9b8304d5031cafac936a56281e144573a25fbbc9';
const PREVIOUS_BASE='d53080f38ebbdbba319e6d9b89dcba86067a72be';
const PLATFORM_BASE='34464fb6091f721f7a87e8d1bb3165f758770799';
const REVISION='book2-notation-20261001',EDITION=prior.ROOTS[0];
// R3 authorizes this one current entry document, not the rest of the book root.
const ENTRY=EDITION.split('/edities/')[0]+'/README.md';
const ROOTS=[...prior.ROOTS,book2.PROJECTION,ENTRY];
const inventory=lessons=>[...book2.inventory(lessons),ENTRY].sort();
const MANIFEST='book2-notation-revision.json',PIN_FILE='build-scripts/books/book2-notation-revision-pin.json';
const CONTRACT_FILE='build-scripts/books/book2-notation-contract.json';
const INPUTS=[CONTRACT_FILE,...['book2-notation-revision.js','record_book2_notation_revision.js','book2-notation-review.js',
 'rebuild_book2_notation.py','assemble_book2_notation.py','book2_notation_print.py','book2_notation_exports.py',
 'book2_notation_checks.py','book2_print_compatibility.py','verify_book2_notation.py','requirements-exercise-routes.txt'].map(f=>'build-scripts/books/'+f),
 'skills/econ-textbook-paragraph.md','build-scripts/maintenance/check-books34-v3-import.js',
 'build-scripts/workflows/check-paragraph-lane-scope.js','.github/workflows/paired-book2-notation-ci.yml',
 '.gitattributes','build-scripts/books/book2-notation-checkout.test.js'];
const git=(repo,args)=>execFileSync('git',args,{cwd:repo,maxBuffer:256*1024*1024});
const assert=(yes,message)=>{if(!yes)throw Error(message);};
const contract=(root=ROOT)=>JSON.parse(fs.readFileSync(safeFile(root,CONTRACT_FILE)));
function blobRecords(repo,oids){
 const unique=[...new Set(oids)],result=new Map();
 for(let i=0;i<unique.length;i+=32){
  const batch=unique.slice(i,i+32),data=execFileSync('git',['cat-file','--batch'],{cwd:repo,input:batch.join('\n')+'\n',maxBuffer:256*1024*1024});
  let position=0;
  for(const oid of batch){
   const end=data.indexOf(10,position),[actual,type,size]=data.subarray(position,end).toString().split(' ');
   assert(actual===oid&&type==='blob','Missing accepted blob '+oid);
   const bytes=data.subarray(end+1,end+1+Number(size));result.set(oid,{bytes:bytes.length,sha256:prior.sha(bytes)});position=end+2+Number(size);
  }
 }
 return result;
}
function protectedPath(file){
 if(!file.startsWith(EDITION+'/'))return ![MANIFEST,ENTRY].includes(file);
 const relative=file.slice(EDITION.length+1);
 return /^(signed-|route-|delivery-manifest|repair-manifest|print-pagination|CORRECTIES|SIGNED-|ROUTE-)/.test(relative)
  || /^boek\/Boek_2_Theorie_43_/.test(relative)
  || / – presentatie\.(pdf|pptx)$/.test(relative)
  || /\/evidence\/2\.[123]\.\d+-presentation\.md$/.test(relative)
  || /^bronnen\/H[123]\/[^/]+\.py$/.test(relative)
  || /^bronnen\/H[123]\/(_assets\/theory-20260921\/|QA\/)/.test(relative);
}
function changedPaths(lessons){return [...new Set((String(git(lessons,['diff','--name-only','-z',BASE]))+String(git(lessons,['ls-files','--others','--exclude-standard','-z']))).split('\0').filter(Boolean))].sort();}

function history(lessons,root=ROOT){
 const entries=[[prior.MANIFEST,prior.PIN_FILE],[book2.MANIFEST,book2.PIN_FILE],[signed.MANIFEST,signed.PIN_FILE],[followups.MANIFEST,followups.PIN_FILE]];
 const result=[];
 for(const [manifest,pinFile] of entries){
  const old=git(lessons,['show',BASE+':'+manifest]),pin=git(root,['show',PLATFORM_BASE+':'+pinFile]);
  assert(fs.readFileSync(safeFile(lessons,manifest)).equals(old),'Historical manifest changed '+manifest);
  assert(fs.readFileSync(safeFile(root,pinFile)).equals(pin),'Historical pin changed '+pinFile);
  assert(prior.sha(old)===JSON.parse(pin).manifest_sha256,'Unauthenticated historical manifest '+manifest);
  const doc=JSON.parse(old);
  // Authenticate every old platform input against its accepted Git snapshot.
  // Current tools may only differ where the new INPUTS explicitly binds them.
  for(const row of doc.platform_inputs){
   const accepted=git(root,['show',PLATFORM_BASE+':'+row.path]);
   if(!INPUTS.includes(row.path))assert(prior.text(fs.readFileSync(safeFile(root,row.path)))===prior.text(accepted),'Sealed platform input changed '+row.path);
  }
  result.push({manifest,sha256:prior.sha(old),files:doc.files.length});
 }
 const previous=JSON.parse(git(lessons,['show',BASE+':'+followups.MANIFEST]));
 const tree=signed.tree(lessons,BASE,[...prior.ROOTS,book2.PROJECTION]),blobs=blobRecords(lessons,tree.values());
 // The accepted main also contains separate classroom publications. Authenticate
 // the old sealed inventory and bind those already accepted additions separately.
 const additions=require('../maintenance/check-classroom-edition').partitionInventory([...tree.keys()].sort(),previous.files.map(r=>r.path));
 for(const row of previous.files){const actual=blobs.get(tree.get(row.path));assert(actual.bytes===row.bytes&&actual.sha256===row.sha256,'False accepted predecessor '+row.path);}
 result.push({accepted_classroom_commit:BASE,files:additions.map(file=>({path:file,...blobs.get(tree.get(file))}))});
 return result;
}

function verifyFiles(lessons,rows,actual,baseline,allowed){
 assert(JSON.stringify(rows.map(r=>r.path))===JSON.stringify(actual),'Unexpected current file inventory');
 const remaining=new Map(baseline);
 for(const row of rows){
  const bytes=fs.readFileSync(safeFile(lessons,row.path)),old=remaining.get(row.path)||null;
  assert(row.baseline_git_blob===old,'False baseline blob '+row.path);
  assert(bytes.length===row.bytes&&prior.sha(bytes)===row.sha256,'Stale current bytes '+row.path);
  if(!allowed.has(row.path)||protectedPath(row.path))assert(gitBlob(bytes)===old,'Protected predecessor changed '+row.path);
  remaining.delete(row.path);
 }
 assert(!remaining.size,'Historical file removed');
}

function verifyManifest(lessons,bytes,pin,{root=ROOT,requireTracked=false}={}){
 const doc=JSON.parse(bytes),c=contract(root),allowed=new Set(c.revision_paths);
 assert(prior.sha(bytes)===pin.manifest_sha256,'Unreviewed notation manifest');
 assert(doc.revision===REVISION&&doc.baseline_lesson_commit===BASE,'Wrong notation revision/base');
 assert(JSON.stringify(doc.predecessors)===JSON.stringify(history(lessons,root)),'False historical evidence');
 assert(c.lessons_base===BASE&&c.platform_base===PLATFORM_BASE,'Wrong contract bases');
 assert(c.revision_paths.every(p=>[MANIFEST,ENTRY].includes(p)||p.startsWith(EDITION+'/')),'Contract exceeds Book 2 scope');
 assert(c.source_bindings.some(row=>row.path===ENTRY),'Missing bounded entry-document binding');
 const actual=inventory(lessons),base=signed.tree(lessons,BASE,ROOTS);
 verifyFiles(lessons,doc.files,actual,base,allowed);
 const changes=changedPaths(lessons);
 assert(JSON.stringify(changes)===JSON.stringify([...allowed].sort()),'Outside finite notation revision');
 assert(JSON.stringify(changes)===JSON.stringify(pin.revision_paths),'Unreviewed changed paths');
 for(const row of c.source_bindings){
  assert(prior.sha(git(lessons,['show',BASE+':'+row.path]))===row.baseline_sha256,'False source ancestry '+row.path);
  assert(prior.sha(fs.readFileSync(safeFile(lessons,row.path)))===row.proposed_sha256,'Unreviewed editable source '+row.path);
 }
 assert(JSON.stringify(doc.platform_inputs.map(r=>r.path))===JSON.stringify(INPUTS),'Wrong platform input inventory');
 for(const row of doc.platform_inputs)assert(prior.sha(prior.text(fs.readFileSync(safeFile(root,row.path))))===row.sha256_lf,'Stale notation tool '+row.path);
 if(requireTracked){
  const entries=new Map(String(git(lessons,['ls-files','--stage','-z'])).split('\0').filter(Boolean).map(row=>{const [info,file]=row.split('\t');return[file,info.split(' ')];}));
  for(const file of [...actual,MANIFEST]){const row=entries.get(file);assert(row&&row[0]==='100644'&&row[2]==='0'&&row[1]===gitBlob(fs.readFileSync(safeFile(lessons,file))),'Untracked/stale staged file '+file);}
 }
 return doc;
}

function verify({root=ROOT,lessons=path.resolve(root,'../4veco-lessen'),requireTracked=false}={}){
 const failures=[];let doc;
 try{const pin=JSON.parse(fs.readFileSync(safeFile(root,PIN_FILE)));assert(pin.revision===REVISION,'Wrong notation pin');doc=verifyManifest(lessons,fs.readFileSync(safeFile(lessons,MANIFEST)),pin,{root,requireTracked});}catch(e){failures.push(e.message);}
 return {revision:REVISION,state:REVISION,files:doc?.files.length||0,passed:!failures.length,failures};
}

function acceptedBaseline({root=ROOT,lessons=path.resolve(root,'../4veco-lessen'),requireTracked=false}={}){
 const failures=[];let count=0;
 try{
  history(lessons,root);
  const doc=JSON.parse(git(lessons,['show',BASE+':'+followups.MANIFEST]));
  const base=signed.tree(lessons,BASE,ROOTS),actual=inventory(lessons);
  // Preserve the exact historical pair as well as the exact accepted main with
  // classroom additions. Neither arbitrary additions nor partial sets qualify.
  const previous=signed.tree(lessons,PREVIOUS_BASE,ROOTS);
  assert([[...doc.files.map(r=>r.path),ENTRY].sort(),[...previous.keys()].sort(),[...base.keys()].sort()]
    .some(files=>JSON.stringify(actual)===JSON.stringify(files)),'Changed accepted inventory');
  for(const file of actual)assert(gitBlob(fs.readFileSync(safeFile(lessons,file)))===base.get(file),'Changed accepted bytes '+file);
  if(requireTracked)assert(!String(git(lessons,['diff','--name-only']))&&!String(git(lessons,['diff','--cached','--name-only'])),'Dirty baseline index');
  count=actual.length;
 }catch(e){failures.push(e.message);}
 return {revision:followups.REVISION,state:followups.REVISION,evidence:'Exact accepted predecessor; no notation revision claim',files:count,passed:!failures.length,failures};
}
module.exports={ROOT,BASE,PLATFORM_BASE,REVISION,EDITION,ENTRY,ROOTS,inventory,MANIFEST,PIN_FILE,CONTRACT_FILE,INPUTS,contract,protectedPath,changedPaths,history,verifyFiles,verifyManifest,verify,acceptedBaseline};
