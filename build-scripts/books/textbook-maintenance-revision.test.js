const fs=require('fs'),path=require('path'),os=require('os'),{execFileSync}=require('child_process');
const v=require('./textbook-maintenance-revision');
const git=(root,...args)=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe']});
let root,base;
beforeEach(()=>{
  root=fs.mkdtempSync(path.join(os.tmpdir(),'textbook-maintenance-test-'));
  git(root,'init','-q');git(root,'config','user.name','Test');git(root,'config','user.email','test@example.invalid');git(root,'config','core.autocrlf','false');
  fs.writeFileSync(path.join(root,'source.md'),'accepted\n');git(root,'add','.');git(root,'commit','-qm','base');base=git(root,'rev-parse','HEAD').toString().trim();
});
afterEach(()=>{if(root&&path.basename(root).startsWith('textbook-maintenance-test-')&&path.dirname(root)===os.tmpdir())fs.rmSync(root,{recursive:true});});
function candidate(){const bytes=Buffer.from('revised\n');fs.writeFileSync(path.join(root,'source.md'),bytes);return [{path:'source.md',bytes:bytes.length,sha256:v.sha(bytes)}];}
function check(records,tracked=false){return v.checkRows(root,base,records,['source.md'],new Set(),tracked);}
test('bounds the exact changed bytes; freshness alone does not assert review',()=>{expect(()=>check(candidate())).not.toThrow();});
test('rejects an unlisted additional or deleted source',()=>{
  const records=candidate();fs.writeFileSync(path.join(root,'extra.md'),'new');expect(()=>check(records)).toThrow(/inventory/);
  fs.unlinkSync(path.join(root,'extra.md'));fs.unlinkSync(path.join(root,'source.md'));expect(()=>check(records)).toThrow();
});
test('rejects a stale hash and an allowed-looking file outside the finite scope',()=>{
  const records=candidate();fs.appendFileSync(path.join(root,'source.md'),'unreviewed');expect(()=>check(records)).toThrow(/Stale/);
  expect(()=>v.checkRows(root,base,candidate(),[],new Set(),false)).toThrow(/Outside finite/);
});
test('tracked verification requires the current commit and index, not just a working file',()=>{
  const records=candidate();expect(()=>check(records,true)).toThrow(/Stale staged/);
  git(root,'add','.');expect(()=>check(records,true)).toThrow(/Uncommitted/);
  git(root,'commit','-qm','candidate');expect(()=>check(records,true)).not.toThrow();
  fs.appendFileSync(path.join(root,'source.md'),'dirty');expect(()=>check(records,true)).toThrow(/Stale maintenance/);
});
test('a working restoration cannot conceal an unreviewed committed or staged path',()=>{
  fs.writeFileSync(path.join(root,'extra.md'),'committed');git(root,'add','.');git(root,'commit','-qm','extra');fs.unlinkSync(path.join(root,'extra.md'));
  expect(v.changed(root,base)).toContain('extra.md');expect(()=>check(candidate())).toThrow(/inventory/);
});
test('the finite scope rejects history, Book 2, authority, traversal and duplicate paths',()=>{
  const valid={revision:v.REVISION,platform_base:v.BASE_P,lessons_base:v.BASE_L,platform:['a.js'],lessons:['current.md'],attribute_paths:[]};
  expect(()=>v.checkContract(valid)).not.toThrow();
  for(const file of ['../escape','C:\\escape','x/historisch/old.pdf','x/received/receipt','Boek 2 - text/current.md','references/machine/registry.json'])
    expect(()=>v.checkContract({...valid,lessons:[file]})).toThrow();
  expect(()=>v.checkContract({...valid,platform:['a.js','a.js']})).toThrow(/duplicate/);
  expect(()=>v.checkContract({...valid,lessons_base:'0'.repeat(40)})).toThrow(/baseline/);
  expect(()=>v.checkContract({...valid,attribute_paths:['*.js']})).toThrow(/Unbounded/);
  expect(()=>v.checkContract({...valid,attribute_paths:['unlisted.js']})).toThrow(/Unbounded/);
  expect(v.expectedAttributes('old exact rule\n',['a.js'])).toBe('old exact rule\n\n# Exact-byte inputs for the bounded October textbook maintenance.\na.js -text\n');
});
