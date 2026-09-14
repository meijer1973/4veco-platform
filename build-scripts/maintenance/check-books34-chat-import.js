#!/usr/bin/env node
'use strict';
// HOW TO ADAPT: finite Book 3/4 acceptance check. A different delivery needs
// independently reviewed identities. --require-paired fails if editions are absent.
const fs=require('fs'), path=require('path'), crypto=require('crypto');
const {execFileSync}=require('child_process');
const migration=require('../references/migrate-books34-selected-outlines');
const {readSelectedStructure,validateStructuralRecords}=require('../references/books34-selected-structure');
const {TRANSITIONS}=require('../references/books34-authority-transition');
const ROOT=path.resolve(__dirname,'../..'), LESSONS=path.resolve(ROOT,'../4veco-lessen');
const BOOKS={3:'Boek 3 - Overheidsingrijpen, concurrentie en internationale handel',4:'Boek 4 - Monopolie, marktfalen en arbeidsmarkt'};
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const canonical=b=>String(b).replace(/\r\n?/g,'\n');
const jsonHash=v=>sha(JSON.stringify(v));
const git=(root,args)=>execFileSync('git',args,{cwd:root,maxBuffer:32*1024*1024});
function verifyDeliveredFile(item,readBytes) {
 try {const bytes=readBytes(item.repository_path);return bytes.length===item.bytes && sha(bytes)===item.sha256;}
 catch {return false;}
}
function verify({root=ROOT,lessons=LESSONS,requirePaired=false,requireTracked=false}={}) {
 const failures=[],check=(ok,msg)=>{if(!ok)failures.push(msg);};
 const read=f=>fs.readFileSync(path.join(root,f));
 const registry=JSON.parse(read('references/authored/course-target-exercises.json'));
 failures.push(...validateStructuralRecords(registry,root));
 const previous=JSON.parse(read(migration.SNAPSHOT+'/course-target-exercises.json'));
 const rows=readSelectedStructure(root);
 check(canonical(read('references/owned/course-blueprint-v5.md'))===migration.buildV5(read(migration.SNAPSHOT+'/course-blueprint-v5.md'),rows),'Current v5 differs from owning structural migration');
 check(canonical(read('references/owned/course-blueprint-v6-three-year.md'))===migration.buildV6(read(migration.SNAPSHOT+'/course-blueprint-v6-three-year.md')),'Current v6 differs from owning bounded migration');
 check(jsonHash(registry.exercises.filter(r=>r.module<3))===jsonHash(previous.exercises.filter(r=>r.module<3)),'Book 1/2 target payload changed');
 check(jsonHash(registry.exercises.filter(r=>r.module>=3))===jsonHash(rows.map(row=>migration.buildRecord(row,previous))),'Current records differ from the bounded migration: history, scope, target or approval changed');
 for(const [file,[before,after]] of Object.entries(TRANSITIONS)) {
  check(sha(canonical(read(file)))===after,`Current authority identity changed: ${file}`);
  check(sha(canonical(read(migration.SNAPSHOT+'/'+path.basename(file))))===before,`Historical authority identity changed: ${file}`);
 }
 for(const [repo,base] of [[root,migration.PLATFORM_BASE],[lessons,migration.LESSON_BASE]]) {
  const reloc=JSON.parse(fs.readFileSync(path.join(repo,'archive/relocations.json')));
  const old=JSON.parse(git(repo,['show',base+':archive/relocations.json']));
  check(JSON.stringify(reloc.entries.slice(0,old.entries.length))===JSON.stringify(old.entries),'Existing archive relocation records changed');
  const additions=reloc.entries.slice(old.entries.length);
  if(repo===lessons && !additions.length && !requirePaired) continue;
  check(additions.length===(repo===root?5:1),'Wrong snapshot count');
  for(const entry of additions) {
   check(entry.kind==='snapshot' && entry.batch===migration.TASK && entry.source_commit===base,'Unexpected archive operation');
   const bytes=fs.readFileSync(path.join(repo,entry.archived_path));
   check(bytes.equals(git(repo,['show',base+':'+entry.original_path])),`Snapshot changed: ${entry.archived_path}`);
  }
 }
 for(const file of ['references/authored/book-outlines/book-2-outline.md','references/authored/book-outlines/book-2-outline.meta.json','build-scripts/maintenance/check-book2-chat-import.js']) check(read(file).equals(git(root,['show',migration.PLATFORM_BASE+':'+file])) || canonical(read(file))===canonical(git(root,['show',migration.PLATFORM_BASE+':'+file])),`Protected Book 2 file changed: ${file}`);
 const manifestPins=require('./books34-manifest-identities.json');
 let present=0;
 for(const book of [3,4]) {
  const manifestPath=path.join(lessons,BOOKS[book],'IMPORT_MANIFEST.json');
  if(!fs.existsSync(manifestPath)) {check(!requirePaired,`Book ${book}: paired edition missing`);continue;}
  present++;
  const raw=fs.readFileSync(manifestPath);check(sha(canonical(raw))===manifestPins[book],`Book ${book}: import manifest identity changed`);
  const manifest=JSON.parse(raw);
  check(manifest.files.length===(book===3?534:471) && manifest.paragraphs.length===(book===3?14:17) && manifest.pdf_roles.length===12,`Book ${book}: delivery inventory incomplete`);
  check(manifest.transport_only.length===(book===3?3:0) && manifest.actual_archive_moves.length===0,`Book ${book}: transport/archive disposition changed`);
  const tracked=requireTracked?new Map(git(lessons,['ls-files','--stage','-z','--',BOOKS[book]]).toString().split('\0').filter(Boolean).map(line=>{const [info,p]=line.split('\t');return [p,info.split(' ')];})):null;
  for(const item of manifest.files) {
   const p=path.resolve(lessons,item.repository_path);
   if(!p.startsWith(path.resolve(lessons)+path.sep)) {check(false,'Escaping manifest path');continue;}
   if(!fs.existsSync(p)){check(false,`Missing delivered file: ${item.repository_path}`);continue;}
   check(verifyDeliveredFile(item,()=>fs.readFileSync(p)),`Changed delivered bytes: ${item.repository_path}`);
   if(tracked)check(tracked.get(item.repository_path)?.[0]===item.mode && tracked.get(item.repository_path)?.[1]===item.git_blob,`Untracked/changed blob or mode: ${item.repository_path}`);
  }
  if(tracked) {
   const expected=new Set([...manifest.files.map(f=>f.repository_path),...['IMPORT_MANIFEST.json','README.md','edities/chat-2026/README.md','edities/chat-2026/BRONNEN.md'].map(f=>BOOKS[book]+'/'+f)]);
   check(tracked.size===expected.size && [...tracked.keys()].every(p=>expected.has(p)),`Book ${book}: unexpected tracked delivery file`);
  }
 }
 if(present)check(present===2 && canonical(fs.readFileSync(path.join(lessons,'course_blueprint_v5.md')))===canonical(read('references/owned/course-blueprint-v5.md')),'Paired current blueprint projection differs');
 const protectedRoots=git(lessons,['ls-tree','-z',migration.LESSON_BASE]).toString().split('\0').filter(Boolean).map(line=>line.split('\t')[1]).filter(p=>/^Boek [12] -/.test(p));
 for(const folder of [...protectedRoots,'archive/book-2-pre-chat-2026']) check(git(lessons,['diff',migration.LESSON_BASE,'--',folder]).length===0,`Protected lesson tree changed: ${folder}`);
 return {task:migration.TASK,passed:failures.length===0,paired_books:present,tracked_verified:requireTracked,failures};
}
if(require.main===module){try {const r=verify({requirePaired:process.argv.includes('--require-paired'),requireTracked:process.argv.includes('--require-tracked')});console.log(JSON.stringify(r,null,2));if(!r.passed)process.exitCode=1;}catch(e){console.error(e);process.exitCode=1;}}
module.exports={verify,verifyDeliveredFile};
