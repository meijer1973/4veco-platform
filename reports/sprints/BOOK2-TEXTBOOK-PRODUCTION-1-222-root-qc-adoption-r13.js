// Exact pre-handoff specialist-adoption checkpoint; not an evergreen validator.
// HOW TO ADAPT: preserve this historical record and author a new explicit
// successor checkpoint. Binding evidence is not another personal visual review.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const {execFileSync}=require('child_process');
const yaml=require('js-yaml');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const pre='BOOK2-TEXTBOOK-PRODUCTION-1-222-R13-QC';
const report=s=>path.join(__dirname,pre+s);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const relocate=p=>{
  const n=p.replaceAll('\\','/'),prefix='C:/wt/book2-222-r13-qc-20260905/';
  assert(n.startsWith(prefix),p);
  const q=path.resolve(root,'..',n.slice(prefix.length));
  assert(q.startsWith(root+path.sep)||q.startsWith(lessons+path.sep));return q;
};
let checks=0;
const verify=(p,h)=>{assert.equal(sha(fs.readFileSync(p)),h,p);checks++;};
verify(report('-report.md'),'3360264597075311ce9081b1dcb0c852e28bcff243cc2207a0112998e4b72687');
verify(report('-evidence/exact-probes.json'),'05f3f111f6e5095dc1e3ca4499cfe956b38395e9ed8cb3e933f11967213ab316');
verify(report('-evidence/personal-inspection.md'),'f489c4de9a7b6e0cd15fdaab7c7a608a95ed112e5fab8c9e056bc187768874aa');
verify(report('-evidence/complete-route-check.json'),'e128a9c5c4921533141b830da050cc4d42b2a30583fc42ad5bdd18832283784e');
const full=json(report('-evidence/full-build.json')),probes=json(report('-evidence/exact-probes.json'));
assert.equal(probes.actor,'paragraph_221_r8_independent_review');assert.equal(probes.status,'PASS');
assert.equal(probes.bonus_model_followed_by_criteria.count,4);
for(const s of full.input_sources)verify(relocate(s.path),s.sha256);
for(const d of full.documents){
  for(const [p,h]of [['source_md','source_sha256'],['source_html','html_sha256'],['source_pdf','pdf_sha256']])verify(relocate(d[p]),d[h]);
  for(const a of d.assets)verify(relocate(a.path),a.sha256);
}
let pages=0;
for(const d of probes.documents){
  assert.equal(d.pdf_sha256,full.documents.find(x=>x.source_pdf.endsWith('– '+d.kind+'.pdf')).pdf_sha256);
  for(const p of d.page_bindings){
    verify(relocate(p.path),p.sha256);
    verify(path.join(root,'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1',`222-${d.kind}-${d.pdf_sha256.slice(0,12)}-r13`,'pages',`page-${String(p.page).padStart(3,'0')}.png`),p.sha256);pages++;
  }
}
assert.equal(pages,21);assert.equal(probes.grayscale.length,4);
for(const p of probes.grayscale)verify(relocate(p.path),p.sha256);
assert.equal(probes.figures.length,4);
for(const f of probes.figures){assert.equal(f.pixel_delta,0);assert.equal(f.raw_native_equal,true);verify(relocate(f.path),f.sha256);verify(report('-evidence/'+path.basename(f.path).replace('.png','-native.png')),f.sha256);}
const before=json(report('-evidence/before.json'));
assert.deepEqual(before,json(report('-evidence/after-rebuild.json')));
const rel='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/';
const qrel=rel+'2.2.2-quality-ref.yaml';
for(const [p,h]of Object.entries(before)){
  if(p===qrel){const old=execFileSync('git',['show','917115c8da631d65eefbdb1f15c13b2291cd9e1d:'+p],{cwd:lessons});assert.equal(sha(old),h);}
  else verify(path.join(lessons,p),h);
}
verify(path.join(lessons,qrel),'c7c42721dc7c352b65aaaa43be08641edc6723e63cc511820cf880403a558e5e');
const old=execFileSync('git',['show','917115c8da631d65eefbdb1f15c13b2291cd9e1d:'+qrel],{cwd:lessons});
const raw=fs.readFileSync(path.join(lessons,qrel));assert(raw.subarray(0,old.length).equals(old));
const a=yaml.load(old.toString()),b=yaml.load(raw.toString());
assert.deepEqual(Object.keys(b).filter(k=>!Object.hasOwn(a,k)).sort(),['partA','schema_version']);
for(const k of Object.keys(a))assert.deepEqual(b[k],a[k]);
assert.equal(b.partA.hard_fails_open,0);assert.deepEqual(b.partA.required_corrections,[]);
assert.equal(b.partA.specialist_verdict,'PASS WITH FLAGS');assert.equal(b.production_ready_with_flags,false);
assert(!fs.existsSync(path.join(lessons,rel+'2.2.2-textbook-handoff.md')));
const bindings=json(report('-evidence/pass0.json')).bindings;
for(const [p,h]of Object.entries(bindings))if(!p.endsWith('2.2.2-quality-ref.yaml'))verify(relocate(p),h);
console.log(JSON.stringify({result:'PASS',checks,pages,figures:4,grayscale:4,pdfs:3,only_current_QC_addition:true,legacy_byte_prefix_unchanged:true,root_handoff:'NOT_YET_CREATED',visual_claim:'Exact attributed specialist bindings; no fresh root view claimed.'},null,2));
