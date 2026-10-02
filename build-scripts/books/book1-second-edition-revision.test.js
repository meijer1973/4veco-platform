'use strict';
const fs=require('fs'),os=require('os'),path=require('path'),{execFileSync}=require('child_process');
const r=require('./book1-second-edition-revision');
test('scope protects other books, held evidence and first-edition companion files',()=>{
 for(const file of ['Boek 2 - test/README.md','edities/books34-v3/books/book-3/a.md',r.BOOK+'/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1/a.pptx','book2-notation-revision.json'])expect(r.allowed(file,'lessons')).toBe(false);
 expect(r.allowed(r.EDITION+'/bronnen/H1/Antwoorden.md','lessons')).toBe(true);
 expect(r.allowed('references/authored/course-target-exercises.json','platform')).toBe(false);
 expect(r.allowed('build-scripts/books/book2-notation-revision-pin.json','platform')).toBe(false);
});

test('only disposable trusted-bundle navigation refreshes may differ from committed evidence',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'book1-navigation-'));
 const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
 const oldMode=process.env.FOURVECO_INDEX_VIEW_MODE,oldBranch=process.env.FOURVECO_PLATFORM_SOURCE_BRANCH;
 const file='reports/github-agent-index-platform.json',target=path.join(root,file);
 try{
  git('init','-q');git('config','user.email','test@example.invalid');git('config','user.name','Test');git('config','core.autocrlf','false');
  fs.mkdirSync(path.dirname(target));fs.writeFileSync(target,'accepted\n');git('add','.');git('commit','-qm','base');const base=git('rev-parse','HEAD');
  const check=()=>r.checkRows(root,base,[],new Set(),'platform',true);
  fs.writeFileSync(target,'trusted generated navigation\n');
  delete process.env.FOURVECO_INDEX_VIEW_MODE;delete process.env.FOURVECO_PLATFORM_SOURCE_BRANCH;
  expect(check).toThrow('changed-path');
  process.env.FOURVECO_INDEX_VIEW_MODE='complete-only';process.env.FOURVECO_PLATFORM_SOURCE_BRANCH='compatibility/bundle-final/platform';
  expect(check).not.toThrow();
  fs.unlinkSync(target);expect(check).toThrow('changed-path');fs.writeFileSync(target,'trusted generated navigation\n');
  const original=fs.lstatSync.bind(fs);
  const spy=jest.spyOn(fs,'lstatSync').mockImplementation(p=>p===target?{isFile:()=>true,isSymbolicLink:()=>true}:original(p));
  expect(check).toThrow('changed-path');spy.mockRestore();
  fs.writeFileSync(path.join(root,'reports/unknown.json'),'unreviewed');expect(check).toThrow('changed-path');fs.unlinkSync(path.join(root,'reports/unknown.json'));
  fs.writeFileSync(path.join(root,'reports/github-agent-index-lessen.json'),'untracked advisory');expect(check).toThrow('changed-path');fs.unlinkSync(path.join(root,'reports/github-agent-index-lessen.json'));
  fs.writeFileSync(target,'accepted\n');
  git('update-index','--chmod=+x',file);expect(check).toThrow('changed-path');
  git('commit','-qm','unreviewed navigation mode');expect(check).toThrow('changed-path');
  git('update-index','--chmod=-x',file);git('commit','-qm','restore mode');
  fs.writeFileSync(target,'trusted generated navigation\n');expect(check).not.toThrow();
  git('add',file);expect(check).toThrow('changed-path');
  git('commit','-qm','unreviewed navigation');expect(check).toThrow('changed-path');
 }finally{
  if(oldMode===undefined)delete process.env.FOURVECO_INDEX_VIEW_MODE;else process.env.FOURVECO_INDEX_VIEW_MODE=oldMode;
  if(oldBranch===undefined)delete process.env.FOURVECO_PLATFORM_SOURCE_BRANCH;else process.env.FOURVECO_PLATFORM_SOURCE_BRANCH=oldBranch;
  jest.restoreAllMocks();fs.rmSync(root,{recursive:true,force:true});
 }
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
