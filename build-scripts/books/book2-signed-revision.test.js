'use strict';
const fs=require('fs'),os=require('os'),path=require('path');
jest.mock('child_process',()=>({...jest.requireActual('child_process'),execFileSync:jest.fn()}));
const cp=require('child_process'),r=require('./book2-signed-revision'),prior=require('./exercise-route-revision');
const {gitBlob}=require('../lib/historical-paths');
let root,doc,tree;
beforeEach(()=>{
 root=fs.mkdtempSync(path.join(os.tmpdir(),'signed-revision-'));
 for(const prefix of prior.ROOTS){fs.mkdirSync(path.join(root,prefix),{recursive:true});fs.writeFileSync(path.join(root,prefix,'source.md'),'reviewed');}
 fs.writeFileSync(path.join(root,r.PROJECTION),'blueprint');fs.writeFileSync(path.join(root,prior.MANIFEST),'old-route');
 const files=r.inventory(root).map(file=>{const bytes=fs.readFileSync(path.join(root,file));return {path:file,bytes:bytes.length,sha256:prior.sha(bytes),baseline_git_blob:gitBlob(bytes)};});
 tree=files.map(row=>`100644 blob ${row.baseline_git_blob}\t${row.path}\0`).join('');
 cp.execFileSync.mockImplementation((cmd,args)=>{if(args[0]==='ls-tree')return Buffer.from(tree);if(args[0]==='show')return Buffer.from('old-route');throw Error('Unexpected git operation '+args);});
 doc={revision:r.REVISION,baseline_lesson_commit:r.BASE,files};
});
afterEach(()=>{fs.rmSync(root,{recursive:true,force:true});cp.execFileSync.mockReset();});
function check(pin){const bytes=Buffer.from(JSON.stringify(doc));return r.verifyManifest(root,bytes,{manifest_sha256:pin||prior.sha(bytes)});}
test('exact finite source inventory passes',()=>expect(check().files).toHaveLength(3));
test('review pin cannot be silently replaced',()=>expect(()=>check('0'.repeat(64))).toThrow(/Unreviewed/));
test.each(['unknown revision','wrong base','duplicate','outside inventory','false baseline','stale bytes'])('rejects %s',fault=>{
 if(fault==='unknown revision')doc.revision+='-other';if(fault==='wrong base')doc.baseline_lesson_commit='0'.repeat(40);
 if(fault==='duplicate')doc.files.push(doc.files[0]);if(fault==='outside inventory')doc.files[0].path='../outside';
 if(fault==='false baseline')doc.files[0].baseline_git_blob='0'.repeat(40);if(fault==='stale bytes')doc.files[0].sha256='0'.repeat(64);
 expect(()=>check()).toThrow();
});
test('even a refreshed manifest cannot authorize changing Book 3/4',()=>{
 const row=doc.files.find(x=>x.path.startsWith(prior.ROOTS[1]+'/'));const bytes=Buffer.from('rewritten');
 fs.writeFileSync(path.join(root,row.path),bytes);row.bytes=bytes.length;row.sha256=prior.sha(bytes);
 expect(()=>check()).toThrow(/Historical evidence/);
});
test('original route evidence stays immutable',()=>{fs.writeFileSync(path.join(root,prior.MANIFEST),'new-route');expect(()=>check()).toThrow(/Original route/);});
test('unlisted file fails without any manifest change',()=>{fs.writeFileSync(path.join(root,prior.ROOTS[0],'extra.md'),'extra');expect(()=>check()).toThrow(/inventory/);});
