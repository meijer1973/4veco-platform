'use strict';
const fs=require('fs'),os=require('os'),path=require('path');
const r=require('./books34-followups-revision'),prior=require('./exercise-route-revision');
const {gitBlob}=require('../lib/historical-paths');
let root,rows,baseline;
beforeEach(()=>{
  root=fs.mkdtempSync(path.join(os.tmpdir(),'b34-followup-test-'));
  rows=[r.contract.source_bindings[0].path,prior.ROOTS[0]+'/protected.md'].sort().map(file=>{
    const data=Buffer.from('accepted');fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.writeFileSync(path.join(root,file),data);
    return {path:file,bytes:data.length,sha256:prior.sha(data),baseline_git_blob:gitBlob(data)};
  });baseline=new Map(rows.map(row=>[row.path,row.baseline_git_blob]));
});
afterEach(()=>fs.rmSync(root,{recursive:true,force:true}));
const check=()=>r.verifyFiles(root,rows,rows.map(row=>row.path),baseline);
test('closed unchanged inventory passes',()=>expect(check).not.toThrow());
test('a re-pinned protected Book2 file still fails',()=>{
  const row=rows.find(r=>r.path.startsWith(prior.ROOTS[0]+'/')),bytes=Buffer.from('unapproved');
  fs.writeFileSync(path.join(root,row.path),bytes);row.bytes=bytes.length;row.sha256=prior.sha(bytes);
  expect(check).toThrow(/Protected predecessor/);
});
test('new out-of-scope file cannot be blessed by a manifest',()=>{
  const name=prior.ROOTS[1]+'/unexpected.md',bytes=Buffer.from('unapproved');
  fs.writeFileSync(path.join(root,name),bytes);rows.push({path:name,bytes:bytes.length,sha256:prior.sha(bytes),baseline_git_blob:null});rows.sort((a,b)=>a.path.localeCompare(b.path));
  expect(check).toThrow(/Protected predecessor/);
});
test('a missing predecessor file cannot disappear from inventory',()=>{rows.pop();expect(check).toThrow(/Predecessor files removed/);});
test('baseline identities are not supplied by the candidate',()=>{rows[0].baseline_git_blob='0'.repeat(40);expect(check).toThrow(/False baseline/);});
test('stale bytes fail on an allowed publication/source too',()=>{fs.writeFileSync(path.join(root,rows[1].path),'stale');expect(check).toThrow(/Stale follow-up/);});
test('duplicate inventory is rejected',()=>{expect(()=>r.verifyFiles(root,[...rows,rows[0]],rows.map(row=>row.path),baseline)).toThrow(/inventory/);});
test('finite scope excludes student manuscripts, mixed practice, route budgets and old evidence',()=>{
  for(const name of ['edities/books34-v3/books/book-3/chapters/3.1/3.1.1 manuscript.md',
    'edities/books34-v3/curriculum/lesson-routes-v3.json','books34-signed-revision.json',
    'edities/books34-v3/checks/signed-retrieval-build.json', 'course_blueprint_v5.md'])expect(r.ALLOWED.has(name)).toBe(false);
  expect(r.publications).toHaveLength(32);
});
