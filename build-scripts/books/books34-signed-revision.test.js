'use strict';
const fs=require('fs'),os=require('os'),path=require('path');
const r=require('./books34-signed-revision'), prior=require('./exercise-route-revision');
const {gitBlob}=require('../lib/historical-paths');
let root,files,baseline;
beforeEach(()=>{
  root=fs.mkdtempSync(path.join(os.tmpdir(),'b34-inventory-'));
  const allowed=r.contract.source_bindings[0].path,protectedFile=prior.ROOTS[0]+'/protected.md';
  files=[allowed,protectedFile].sort().map(file=>{
    const data=Buffer.from('accepted');fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.writeFileSync(path.join(root,file),data);
    return {path:file,bytes:data.length,sha256:prior.sha(data),baseline_git_blob:gitBlob(data)};
  });
  baseline=new Map(files.map(row=>[row.path,row.baseline_git_blob]));
});
afterEach(()=>fs.rmSync(root,{recursive:true,force:true}));
const check=()=>r.verifyFiles(root,files,files.map(row=>row.path),baseline);
test('finite unchanged inventory is accepted',()=>expect(check).not.toThrow());
test('refreshed manifest cannot admit a protected Book 2 edit',()=>{
  const row=files.find(row=>row.path.startsWith(prior.ROOTS[0]+'/')),data=Buffer.from('unapproved');
  fs.writeFileSync(path.join(root,row.path),data);row.bytes=data.length;row.sha256=prior.sha(data);
  expect(check).toThrow(/Protected predecessor/);
});
test('refreshed manifest cannot admit a new out-of-scope file',()=>{
  const file=prior.ROOTS[1]+'/unexpected.md',data=Buffer.from('extra');fs.writeFileSync(path.join(root,file),data);
  files.push({path:file,bytes:data.length,sha256:prior.sha(data),baseline_git_blob:null});files.sort((a,b)=>a.path.localeCompare(b.path));
  expect(check).toThrow(/Protected predecessor/);
});
test('a removed predecessor cannot be hidden by a new manifest',()=>{files.pop();expect(check).toThrow(/Predecessor files removed/);});
test('a new baseline blob cannot bless protected changes',()=>{files[0].baseline_git_blob='0'.repeat(40);expect(check).toThrow(/False predecessor blob/);});
test('stale output bytes fail even inside allowed paths',()=>{fs.writeFileSync(path.join(root,files[1].path),'stale');expect(check).toThrow(/Stale successor file/);});
test('duplicates or changed closed inventory fail',()=>{expect(()=>r.verifyFiles(root,[...files,files[0]],files.map(row=>row.path),baseline)).toThrow(/inventory/);});
