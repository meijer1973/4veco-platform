// Read-only exact specialist adoption checkpoint, before root handoff succession.
// HOW TO ADAPT: preserve this historical checkpoint; create explicit new lineage
// for a later accepted record. Hash parity is not a new visual review.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const {execFileSync}=require('child_process');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-221-QC-r8';
const report=s=>path.join(root,'reports/sprints',prefix+s);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const digest=p=>sha(fs.readFileSync(p));
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const relocate=p=>{
  const n=p.replaceAll('\\','/'),source='C:/wt/book2-221-r8-qc-20260905/';
  assert(n.startsWith(source));
  const rest=n.slice(source.length),result=path.resolve(root,'..',rest);
  assert(result.startsWith(root+path.sep)||result.startsWith(lessons+path.sep));
  return result;
};
let checks=0;
const verify=(p,h)=>{assert.equal(digest(p),h,p);checks++;};
const full=json(report('-evidence/full-build.json')),probes=json(report('-evidence/probes.json'));
verify(report('-report.md'),'c620016be78181d34631525779dfbe59b44fe5a2a698269dd00db4fe24d7c082');
verify(report('-evidence/probes.json'),'efbe7aa7235d9d3827aa4ed6d57a04f5785650d452f18bdaf21c365e1beedfb1');
verify(report('-evidence/render-check.json'),'8a2b31d02c77dacf84e538fea48a19b4f7370c4160d7e92a4128a8bcb4a78da7');
assert.equal(probes.reviewer,'paragraph_213_r6_independent_review');
assert.equal(probes.mechanical_status,'PASS');
for(const x of full.input_sources)verify(relocate(x.path),x.sha256);
for(const d of full.documents){
  for(const [p,h]of[['source_md','source_sha256'],['source_html','html_sha256'],['source_pdf','pdf_sha256']])verify(relocate(d[p]),d[h]);
  for(const a of d.assets)verify(relocate(a.path),a.sha256);
}
assert.equal(probes.pages.length,20);
for(const p of probes.pages){
  verify(path.join(root,p.fresh_capture),p.sha256);
  const native=path.join(root,'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1',`221-${p.edition}-${p.pdf_sha256.slice(0,12)}-r8`,'pages',`page-${String(p.page).padStart(3,'0')}.png`);
  verify(native,p.sha256);
  const d=full.documents.find(d=>d.source_pdf.endsWith('– '+p.edition+'.pdf'));
  assert(d);assert.equal(d.pdf_sha256,p.pdf_sha256);
}
for(const [n,h]of [[2,'fa6567b2b2274eaabc041f99b0a7c3f48260a0154fdc2f3ae114c68874236dc7'],[3,'2a1e5b16e0744177b2fd6684a27bd933b89ed4c2aad8bd12a006962e83dea476'],[5,'0e5cac18e99ddf243084531526f53de84923ced80e60a606bb05f1dd006b7dc4']])verify(report(`-evidence/gray-p${n}.png`),h);
for(const s of probes.svg){assert.equal(s.max_channel_delta,0);verify(report('-evidence/2.2.1_'+s.name+'-reraster.png'),s.png_sha256);}
const before=json(report('-evidence/before.json')),after=json(report('-evidence/after-rebuild.json'));
assert.deepEqual(before,after);
for(const [p,h]of Object.entries(before)){
  if(p.endsWith('2.2.1-quality-ref.yaml')){
    const old=execFileSync('git',['show','800c3540b15787aecec2e782e6da9b960664cadb:'+p],{cwd:lessons});
    assert.equal(sha(old),h);
    verify(path.join(lessons,p),'51a3840ef7c7d68986798608c79266f158b5f7a3a2ad7aa463e329ba8946db98');
  }else verify(path.join(lessons,p),h);
}
console.log(JSON.stringify({result:'PASS',checks,pages:20,grays:3,pdfs:3,exact_raster_pairs:3,reviewer:probes.reviewer,current_specialist:'PASS WITH FLAGS',root_handoff:'NOT_YET_UPDATED',visual_acceptance:'No fresh root page-view claim; this binds the specialist personally attributed report.'},null,2));
