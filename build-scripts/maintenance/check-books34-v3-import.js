'use strict';
// HOW TO ADAPT: new delivery/base identities require a separate bounded route.
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const m=require('../references/migrate-books34-v3');
const {validateStructuralRecords}=require('../references/books34-selected-structure');
const {consumeTarget,safeFile}=require('../references/target-source-consumer');
const {gitBlob}=require('../lib/historical-paths');
const BOOKS={3:'Boek 3 - Overheidsingrijpen, concurrentie en internationale handel',4:'Boek 4 - Monopolie, marktfalen en arbeidsmarkt'};
function verify({root=m.ROOT,lessons=path.resolve(root,'../4veco-lessen'),requireTracked=false}={}){
 const failures=[],check=(v,msg)=>{if(!v)failures.push(msg);},read=f=>fs.readFileSync(path.join(root,f));
 try{
  const registry=JSON.parse(read(m.REGISTRY));failures.push(...validateStructuralRecords(registry,root));
  const packageRoot=path.join(lessons,m.PACKAGE),bytes=fs.readFileSync(path.join(packageRoot,'MANIFEST.sha256.json'));
  check(m.sha(bytes)===m.MANIFEST_SHA,'Unexpected package manifest');
  if(m.sha(bytes)!==m.MANIFEST_SHA)return {passed:false,failures};
  const manifest=JSON.parse(bytes),allowed=new Set(['MANIFEST.sha256.json',...manifest.files.map(f=>f.path)]);
  check(allowed.size===814&&manifest.files.length===813,'Wrong package file count');
  for(const f of manifest.files){try{const b=fs.readFileSync(safeFile(packageRoot,f.path));check(b.length===f.bytes&&m.sha(b)===f.sha256,'Changed delivery '+f.path);}catch(e){failures.push(e.message);}}
  const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.relative(packageRoot,path.join(d,e.name)).replaceAll('\\','/')]);
  for(const f of walk(packageRoot))check(allowed.has(f),'Unexpected package file '+f);
  const planned=m.plan(packageRoot,root,lessons);
  for(const [file,b] of planned.outputs)check(file.startsWith(m.SNAPSHOT+'/')||[3,4].some(n=>file===`${m.OUTLINES}/book-${n}-outline.md`)?read(file).equals(b):m.text(read(file))===m.text(b),'Migration output mismatch '+file);
  for(const [file,b] of planned.lessonOutputs){const actual=fs.readFileSync(path.join(lessons,file));check(file.startsWith(m.SNAPSHOT+'/')?actual.equals(b):m.text(actual)===m.text(b),'Lesson projection mismatch '+file);}
  const bp=m.text(read(m.V5));
  for(const r of registry.exercises.filter(r=>r.module>=3)){check(bp.includes(`### §${r.id} - ${r.paragraph_title}`),'Missing v5 anchor '+r.id);try{consumeTarget(r,lessons);}catch(e){failures.push(r.id+': '+e.message);}}
  const git=(repo,args)=>execFileSync('git',args,{cwd:repo,encoding:'utf8',maxBuffer:64*1024*1024});
  for(const [repo,base,paths] of [[root,m.PLATFORM_BASE,['references/authored/book-outlines/book-2-outline.md','references/authored/book-outlines/book-2-outline.meta.json','build-scripts/maintenance/check-book2-chat-import.js','build-scripts/references/migrate-books34-selected-outlines.js']],[lessons,m.LESSON_BASE,[...git(lessons,['ls-tree','--name-only',m.LESSON_BASE]).trim().split('\n').filter(p=>/^Boek [12] -/.test(p)),...Object.values(BOOKS).flatMap(b=>[b+'/edities/chat-2026',b+'/IMPORT_MANIFEST.json'])]]])check(!git(repo,['diff',base,'--',...paths]).trim(),'Protected Book 1/2 or v2 history changed');
  const operational=new Set(['.gitattributes','AGENT_GITHUB_ENTRY.md','RESEARCH_AGENT_MAP.md','lessen-team-roadmap.md','course_blueprint_v5.md','archive/relocations.json','archive/index.json','archive/index.md',`${m.SNAPSHOT}/course_blueprint_v5.md`,...Object.values(BOOKS).map(b=>b+'/README.md')]);
  for(const f of git(lessons,['diff','--name-only','-z',m.LESSON_BASE]).split('\0').filter(Boolean))check(operational.has(f)||(f.startsWith(m.PACKAGE+'/')&&allowed.has(f.slice(m.PACKAGE.length+1))),'Outside finite lesson import scope '+f);
  if(requireTracked){
   const entries=git(lessons,['ls-files','--stage','-z','--',m.PACKAGE]).split('\0').filter(Boolean).map(row=>{const [info,file]=row.split('\t');const [mode,blob,stage]=info.split(' ');return {mode,blob,stage,file};});
   check(entries.length===814&&entries.every(e=>allowed.has(e.file.slice(m.PACKAGE.length+1))),'Package not fully tracked');
   for(const e of entries)check(e.mode==='100644'&&e.stage==='0'&&e.blob===gitBlob(fs.readFileSync(path.join(lessons,e.file))),'Staged bytes or mode differ '+e.file);
  }
 }catch(e){failures.push(e.message);}
 return {task:m.TASK,revision:m.REVISION,passed:!failures.length,tracked_verified:requireTracked,failures};
}
if(require.main===module){const r=verify({requireTracked:process.argv.includes('--require-tracked')});console.log(JSON.stringify(r,null,2));if(!r.passed)process.exitCode=1;}
module.exports={verify};
