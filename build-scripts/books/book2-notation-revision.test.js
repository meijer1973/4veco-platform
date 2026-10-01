'use strict';
const fs=require('fs'),os=require('os'),path=require('path');
const r=require('./book2-notation-revision'),prior=require('./exercise-route-revision'),{gitBlob}=require('../lib/historical-paths');
let root,rows,base,allowed;
beforeEach(()=>{
 root=fs.mkdtempSync(path.join(os.tmpdir(),'book2-notation-'));
 rows=[r.EDITION+'/bronnen/H1/manuscript/page.md','edities/books34-v3/protected.md'].sort().map(file=>{
  const bytes=Buffer.from('accepted');fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.writeFileSync(path.join(root,file),bytes);
  return {path:file,bytes:bytes.length,sha256:prior.sha(bytes),baseline_git_blob:gitBlob(bytes)};
 });base=new Map(rows.map(row=>[row.path,row.baseline_git_blob]));allowed=new Set([rows[0].path]);
});
afterEach(()=>fs.rmSync(root,{recursive:true,force:true}));
const check=()=>r.verifyFiles(root,rows,rows.map(row=>row.path),base,allowed);
test('closed unchanged inventory passes',()=>expect(check).not.toThrow());
test('a re-pinned Book3 file is still protected, even if added to allowed paths',()=>{
 const row=rows[1],bytes=Buffer.from('unapproved');fs.writeFileSync(path.join(root,row.path),bytes);row.bytes=bytes.length;row.sha256=prior.sha(bytes);allowed.add(row.path);
 expect(check).toThrow(/Protected predecessor/);
});
test('missing historical file cannot disappear from inventory',()=>{rows.pop();expect(check).toThrow(/Historical file removed/);});
test('false baseline identity fails',()=>{rows[0].baseline_git_blob='0'.repeat(40);expect(check).toThrow(/False baseline/);});
test('stale allowed source bytes fail',()=>{fs.writeFileSync(path.join(root,rows[0].path),'changed');expect(check).toThrow(/Stale current/);});
test('duplicate inventory fails',()=>expect(()=>r.verifyFiles(root,[...rows,rows[0]],rows.map(row=>row.path),base,allowed)).toThrow(/inventory/));
test.each(['signed-chapter-inputs.json','signed-page-map.json','route-assembly-manifest.json','delivery-manifest.json',
 'boek/Boek_2_Theorie_43_Herziene_Paginas.pdf','bronnen/H1/build.py','bronnen/H3/_assets/theory-20260921/page-092.json',
 'bronnen/H1/paragrafen/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – presentatie.pdf',
 'bronnen/H1/paragrafen/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – presentatie.pptx',
 'bronnen/H1/paragrafen/2.1.1 Kostenstructuren/evidence/2.1.1-presentation.md'])('old evidence cannot be re-pinned: %s',file=>expect(r.protectedPath(r.EDITION+'/'+file)).toBe(true));
test('current manuscripts and new figure sources remain writable',()=>{
 expect(r.protectedPath(rows[0].path)).toBe(false);
 expect(r.protectedPath(r.EDITION+'/bronnen/H1/_assets/notation-20261001/page-023.json')).toBe(false);
});
test('entry-document exception is confined to the one authorized README',()=>{
 expect(r.protectedPath(r.ENTRY)).toBe(false);
 expect(r.protectedPath(r.ENTRY.replace('README.md','IMPORT_REPORT.md'))).toBe(true);
 expect(r.protectedPath('Boek 1 - Schaarste/README.md')).toBe(true);
});
