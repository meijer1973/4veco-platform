'use strict';
const fs=require('fs'),os=require('os'),path=require('path'),{execFileSync}=require('child_process');
const r=require('./book1-second-edition-revision');
test('scope protects other books, held evidence and first-edition companion files',()=>{
 for(const file of ['Boek 2 - test/README.md','edities/books34-v3/books/book-3/a.md',r.BOOK+'/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1/a.pptx','book2-notation-revision.json'])expect(r.allowed(file,'lessons')).toBe(false);
 expect(r.allowed(r.EDITION+'/bronnen/H1/Antwoorden.md','lessons')).toBe(true);
 expect(r.allowed('references/authored/course-target-exercises.json','platform')).toBe(false);
 expect(r.allowed('build-scripts/books/book2-notation-revision-pin.json','platform')).toBe(false);
});
test('byte mutations and undeclared additions fail despite an unchanged manifest',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'book1-boundary-'));
 const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
 try{
  git('init','-q');git('config','user.email','test@example.invalid');git('config','user.name','Test');git('config','core.autocrlf','false');
  const file='AGENTS.md';fs.writeFileSync(path.join(root,file),'old\n');git('add','.');git('commit','-qm','base');const base=git('rev-parse','HEAD');
  const bytes=Buffer.from('current\n');fs.writeFileSync(path.join(root,file),bytes);
  const rows=[{path:file,bytes:bytes.length,sha256:r.sha(bytes)}];
  expect(()=>r.checkRows(root,base,rows,new Set(),'platform',false)).not.toThrow();
  fs.writeFileSync(path.join(root,file),'corrupt\n');expect(()=>r.checkRows(root,base,rows,new Set(),'platform',false)).toThrow('Stale');
  fs.writeFileSync(path.join(root,file),bytes);fs.writeFileSync(path.join(root,'outside.md'),'extra');expect(()=>r.checkRows(root,base,rows,new Set(),'platform',false)).toThrow('changed-path');
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
