'use strict';
// Bounded successor: preserve the whole accepted pair outside explicit Book 1
// integration paths. Never refresh or weaken earlier signed receipts.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{execFileSync}=require('child_process');
const ROOT=path.resolve(__dirname,'../..');
const REVISION='book1-second-edition-20261002';
// Includes the independently merged Book 4 companions; they are frozen inputs,
// not files permitted to change in this Book 1 revision.
const BASE_P='6d010e98610b5f7d1288af322cd228e160d39ada',BASE_L='10b2bab1ab1dc9592f2ea1e967b6cc2cd7c281c2';
const HISTORICAL_P='d81db9558cc24d0671da1b2b9ecc5cdf1a092dde';
const BOOK='Boek 1 - Grondslagen, vraag en aanbod',EDITION=BOOK+'/edities/tweede-editie-2026';
const MANIFEST='references/owned/book1-second-edition-2026/revision.json',LESSON_MANIFEST=REVISION+'.json';
const PIN='build-scripts/books/book1-second-edition-pin.json';
const REVIEW='reports/review-gates/book1-second-edition-20261002/independent-review.md';
const HEAD='build-scripts/books/book1-second-edition-lesson-head.txt';
const P_EXACT=new Set(['AGENTS.md','docs/workflows/part-a-start.md','docs/workflows/textbook-paragraph-lane.md','skills/econ-paragraph-review.md','skills/econ-didactiek.md','skills/econ-exercise-builder.md','skills/econ-textbook-paragraph.md','references/authored/didactiek-principes.md','references/authored/vraagtypen-en-opgaveontwerp.md',
 'build-scripts/workflows/check-part-a-exercise-authoring-contract.js','build-scripts/workflows/check-part-a-exercise-authoring-contract.test.js',
 'build-scripts/rag/build-chunks.js','build-scripts/references/build-owned-content-graph.js','build-scripts/references/book1-edition.js','build-scripts/references/book1-edition.test.js','build-scripts/references/book1-authority-transition.js','build-scripts/workflows/check-book-outline-currentness.js',
 'build-scripts/content/book-1/presentation-v2-registry.js','build-scripts/books/build-book.py','build-scripts/platform/build-landing-page.js',
 'build-scripts/books/book-manifests/book-1.json','build-scripts/books/book-manifests/book-1-first-edition.json',
 'build-scripts/maintenance/check-classroom-edition.js','build-scripts/maintenance/check-classroom-notation.test.js','build-scripts/maintenance/check-books34-v3-import.js','build-scripts/workflows/check-paragraph-lane-scope.js',
 'build-scripts/books/book1-second-edition-revision.js','build-scripts/books/book1-second-edition-revision.test.js','docs/workflows/book1-second-edition.md','.github/workflows/paired-book1-second-edition-ci.yml','.github/workflows/paired-exercise-route-ci.yml',
 'build-scripts/maintenance/check-classroom-edition.test.js','build-scripts/references/books34-v3.test.js','build-scripts/workflows/paragraph-records.js','build-scripts/workflows/paragraph-records.test.js','build-scripts/ci/paired-paragraph-ci.test.js',
 'references/data/rag/chunk_index.jsonl','references/data/owned-content-graph.json','reports/json/owned-content-coverage.json','reports/owned-content-coverage.md']);
const L_EXACT=new Set(['AGENTS.md','index.html',BOOK+'/README.md',BOOK+'/index.html',BOOK+'/eerste-editie.html',...['md','html','pdf'].map(ext=>BOOK+'/Boek 1 Grondslagen, vraag en aanbod – boek.'+ext)]);
const EXCLUDED_P=new Set([MANIFEST,PIN,REVIEW,HEAD]);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(root,args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:128*1024*1024});
function allowed(file,repo){
 return repo==='platform' ? P_EXACT.has(file)||file.startsWith('build-scripts/books/book1_second_edition/')||file.startsWith('references/owned/book1-second-edition-2026/')||/^reports\/review-gates\/book1-second-edition-20261002\/1\.[123]\.[1234]-review\.md$/.test(file)
 : L_EXACT.has(file)||file.startsWith(EDITION+'/')||file.startsWith(BOOK+'/historisch/');
}
function changes(root,base,excluded=new Set()){
 return [...new Set((git(root,['diff','--name-only','-z',base])+git(root,['ls-files','--others','--exclude-standard','-z'])).split('\0').filter(f=>f&&!excluded.has(f)))].sort();
}
function safe(root,file){
 if(path.isAbsolute(file)||file.includes('\\')||file.split('/').some(p=>!p||p==='.'||p==='..'))throw Error('Unsafe inventory path '+file);
 const target=path.resolve(root,file);if(!target.startsWith(path.resolve(root)+path.sep))throw Error('Path escapes repository');
 if(fs.lstatSync(target).isSymbolicLink())throw Error('Symlink in edition inventory');return target;
}
function rows(root,files,repo){return files.map(file=>{
 if(!allowed(file,repo))throw Error('Outside bounded Book 1 '+repo+' scope: '+file);
 const bytes=fs.readFileSync(safe(root,file));return {path:file,bytes:bytes.length,sha256:sha(bytes)};
});}
function record({root=ROOT,lessons=path.resolve(root,'../4veco-lessen')}={}){
 const doc={revision:REVISION,platform_base:BASE_P,lessons_base:BASE_L,
  scope:'Book 1 second edition; first-edition history and Books 2–4 unchanged outside finite entry/instruction changes',
  approval:'Manifest is freshness evidence only; independent review and human merge authority are separate.',
  platform:rows(root,changes(root,BASE_P,EXCLUDED_P),'platform'),
  lessons:rows(lessons,changes(lessons,BASE_L,new Set([LESSON_MANIFEST])),'lessons')};
 const bytes=JSON.stringify(doc,null,2)+'\n';fs.writeFileSync(path.join(root,MANIFEST),bytes);fs.writeFileSync(path.join(lessons,LESSON_MANIFEST),bytes);
 fs.writeFileSync(path.join(root,PIN),JSON.stringify({revision:REVISION,manifest_sha256:sha(bytes)},null,2)+'\n');
 return {revision:REVISION,manifest_sha256:sha(bytes),platform_files:doc.platform.length,lesson_files:doc.lessons.length};
}
function checkRows(root,base,records,excluded,repo,requireTracked){
 if(JSON.stringify(changes(root,base,excluded))!==JSON.stringify(records.map(r=>r.path)))throw Error('Unreviewed '+repo+' changed-path inventory');
 for(const r of records){
  if(!allowed(r.path,repo))throw Error('Out-of-scope '+repo+' file '+r.path);
  const b=fs.readFileSync(safe(root,r.path));if(b.length!==r.bytes||sha(b)!==r.sha256)throw Error('Stale '+repo+' bytes '+r.path);
  if(requireTracked){const blob=execFileSync('git',['show',':'+r.path],{cwd:root,maxBuffer:128*1024*1024});if(!blob.equals(b))throw Error('Untracked/stale staged '+repo+' file '+r.path);}
 }
}
function historicalPair(root,lessons,requireTracked){
 const names=['book2-notation','book2-signed','books34-signed','books34-followups','exercise-route'];
 const known=names.map(name=>{
  try{return git(root,['show',HISTORICAL_P+':build-scripts/books/'+name+'-lesson-head.txt']).trim();}catch{return null;}
 }).filter(s=>/^[a-f0-9]{40}$/.test(s||''));
 const matched=known.find(sha=>changes(lessons,sha).length===0);
 if(!matched)throw Error('Unrecognized predecessor: exact accepted or historical lesson tree required');
 // Execute the original verifier in the accepted platform checkout, not by
 // relabelling a result from the new gate. It has its actual pins and history.
 const os=require('os'),parent=fs.mkdtempSync(path.join(os.tmpdir(),'book1-history-')),checkout=path.join(parent,'platform');
 try{
  git(root,['worktree','add','--detach',checkout,HISTORICAL_P]);
  const script="const path=require('path');const options={root:process.argv[1],lessons:process.argv[2],requireTracked:process.argv[3]==='true'};const result=require(path.join(options.root,'build-scripts/maintenance/check-classroom-edition.js')).verify(options);if(result.passed&&result.lesson_state==='exercise-route-revision'){const review=require(path.join(options.root,'build-scripts/books/exercise-route-review.js')).run({...options,check:true});result.historical_review={paragraphs:review.paragraphs,mode:review.mode};}process.stdout.write(JSON.stringify(result));";
  const result=JSON.parse(execFileSync(process.execPath,['-e',script,checkout,lessons,String(requireTracked)],{encoding:'utf8',maxBuffer:128*1024*1024,env:{...process.env,NODE_PATH:path.join(root,'node_modules')}}));
  return {...result,historical_verification:{platform:HISTORICAL_P,lessons:matched,mode:'original verifier in immutable accepted checkout'}};
 }finally{
  if(fs.existsSync(checkout))git(root,['worktree','remove',checkout]);
  // Empty, task-created parent only; no recursive filesystem removal.
  fs.rmdirSync(parent);
 }
}
function verify({root=ROOT,lessons=path.resolve(root,'../4veco-lessen'),requireTracked=false,requireReview=false}={}){
 const failures=[];let files=0,state=REVISION;
 try{
  const bytes=fs.readFileSync(path.join(root,MANIFEST)),doc=JSON.parse(bytes),pin=JSON.parse(fs.readFileSync(path.join(root,PIN)));
  if(doc.revision!==REVISION||pin.revision!==REVISION||doc.platform_base!==BASE_P||doc.lessons_base!==BASE_L||sha(bytes)!==pin.manifest_sha256)throw Error('Unknown/unpinned Book 1 successor');
  checkRows(root,BASE_P,doc.platform,EXCLUDED_P,'platform',requireTracked);
  if(fs.existsSync(path.join(lessons,LESSON_MANIFEST))){
   if(!fs.readFileSync(path.join(lessons,LESSON_MANIFEST)).equals(bytes))throw Error('Mixed edition repository pair');
   checkRows(lessons,BASE_L,doc.lessons,new Set([LESSON_MANIFEST]),'lessons',requireTracked);
   files=doc.lessons.length;
  }else{
   if(changes(lessons,BASE_L).length)return historicalPair(root,lessons,requireTracked);
   state='book1-second-edition-platform-with-accepted-predecessor';
  }
  if(requireReview){
   const text=fs.readFileSync(path.join(root,REVIEW),'utf8');
   if(!/^Verdict: PASS(?: with flags)?$/m.test(text)||!text.includes('Review manifest SHA256: `'+sha(bytes)+'`'))throw Error('Missing current independent edition review');
   for(const ch of [1,2,3])for(const p of [1,2,3,4]){
    const id=`1.${ch}.${p}`,snapshot=fs.readFileSync(path.join(lessons,EDITION,'qa/reviews',id+'-textbook-review-manifest.json'));
    const report=fs.readFileSync(path.join(root,path.dirname(REVIEW),id+'-review.md'),'utf8');
    if(!/^Verdict: PASS(?: with flags)?$/m.test(report)||!report.includes('Review manifest SHA256: `'+sha(snapshot)+'`'))throw Error('Missing current paragraph review '+id);
   }
  }
 }catch(error){failures.push(error.message);}
 return {revision:REVISION,state,lesson_state:state,files,passed:!failures.length,failures};
}
module.exports={ROOT,REVISION,BASE_P,BASE_L,BOOK,EDITION,MANIFEST,LESSON_MANIFEST,PIN,REVIEW,HEAD,allowed,changes,record,verify,checkRows,sha};
if(require.main===module){
 const result=process.argv.includes('--record')?record():verify({requireTracked:process.argv.includes('--require-tracked'),requireReview:process.argv.includes('--require-review')});
 console.log(JSON.stringify(result,null,2));if(result.passed===false)process.exitCode=1;
}
