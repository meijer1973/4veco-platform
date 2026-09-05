// Read-only exact root adoption checkpoint. Not a current-root rebuild or final QA.
// HOW TO ADAPT: preserve these fixed verdict/media bindings; future corrections
// need a new checkpoint and genuine review, not expanded accepted-hash lists.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const {execFileSync}=require('child_process');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-',book='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus';
const p222=book+'/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/';
const p213=book+'/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const report=n=>path.join(__dirname,prefix+n);
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
let checks=0;
function verify(p,h){assert.equal(sha(fs.readFileSync(p)),h,p);checks++;}
function remap(p,pair){const n=p.replaceAll('\\','/');assert(n.startsWith(pair));const r=path.resolve(root,'..',n.slice(pair.length));assert(r.startsWith(root+path.sep)||r.startsWith(lessons+path.sep));return r;}
const j222=n=>read(report('222-R13-review-evidence/'+n+'.json'));
const pair222='C:/wt/book2-222-r13-review-20260905/';
const probes=j222('exact-probes'),pass0=j222('pass0');
verify(report('222-R13-review-evidence/exact-probes.json'),'e3ed4ce5d362de460b371bdcf63190eba2ea7e321369ebf7f3fdc675c2393a29');
verify(report('222-R13-review-evidence/render-check.json'),'830cbc4b25372cf47e0cb5326cdb53dc539af3aeaf30485cd32d866b363c567c');
assert.equal(probes.status,'PASS');assert.equal(pass0.status,'PASS');
for(const [p,h]of Object.entries(pass0.bindings))verify(remap(p,pair222),h);
assert.equal(probes.pages.length,21);assert.equal(probes.grayscale.length,4);assert.equal(probes.assets.length,4);
for(const x of [...probes.pages,...probes.grayscale])verify(path.join(root,x.path),x.sha256);
for(const a of probes.assets){
  verify(path.join(lessons,p222,'_assets',a.name),a.svg_sha256);
  verify(path.join(lessons,p222,'_assets',a.name.replace('.svg','.png')),a.png_sha256);
  assert.equal(a.pixel_maximum_delta,0);assert.equal(a.native_byte_equal,true);
}
assert.deepEqual(j222('before'),j222('after-rebuild'));
for(const [p,h]of Object.entries(j222('before')))if(!p.endsWith('2.2.2-review.md'))verify(path.join(lessons,p),h);
verify(path.join(lessons,p222,'2.2.2-review.md'),'9122a962d5108565a631d6cd51b1945ab0ddb1ef78c2b979cca15ac59010f01a');
assert.equal(sha(execFileSync('git',['show','591bfed06838b716bc1881bb435fec10dbbb09ac:'+p222+'2.2.2-review.md'],{cwd:lessons})),'d8c01a53362386143557666e1b6a9d3157a166d69330fba56a0ac48e7a88a9e1');
const pair213='C:/wt/book2-213-r6-qc-20260905/';
const i213=read(report('213-R6-QC-evidence/personal-inspection-bindings.json'));
verify(report('213-R6-QC-evidence/personal-inspection.md'),i213.personal_record_sha256);
verify(report('213-R6-QC-disposition-successor.md'),'0ea14f249e35f3f56781c57ca2ad82abae2aacecf628063c5d2b03dd9c38663e');
let pages213=0;
for(const d of i213.documents){
  verify(path.join(lessons,p213,'2.1.3 Marginale kosten en marginale opbrengsten – '+d.edition+'.pdf'),d.pdf_sha256);
  for(const p of d.fresh_pages){verify(remap(p.path,pair213),p.sha256);pages213++;}
}
assert.equal(pages213,29);assert.equal(i213.grayscale_personally_viewed.length,5);assert.equal(i213.figures_personally_viewed.length,6);
for(const p of [...i213.grayscale_personally_viewed,...i213.figures_personally_viewed])verify(remap(p.path,pair213),p.sha256);
for(const p of read(report('213-R6-QC-evidence/bindings.json')).checks)if(p.path)verify(remap(p.path,pair213),p.hash);else{assert(p.proof);verify(path.join(remap(p.proof,pair213),'manifest.json'),p.manifest_sha256);}
const full213=read(report('213-R6-QC-evidence/relocated-build.json'));
for(const d of full213.documents)for(const [k,h]of [['source_md','source_sha256'],['source_html','html_sha256'],['source_pdf','pdf_sha256']])verify(remap(d[k],pair213),d[h]);
verify(path.join(lessons,p213,'2.1.3-quality-ref.yaml'),'c96a4af45cfbf6c43ceda27ecf6dd231c75667ece58b378b9080975fe4be717f');
verify(path.join(lessons,p213,'2.1.3-review.md'),'a70fd9571cea3afc5861d1b91dc99c102757767e0fb9d66da211602a90c82d66');
assert(!fs.existsSync(path.join(lessons,p213,'2.1.3-textbook-handoff.md')));
assert.equal(execFileSync('git',['diff','--name-only','576c5f4bb919611466e4511d2b4938a8195f6972','5d67998d1e1d1aa5497d59850b53aebc780eaa96'],{cwd:lessons,encoding:'utf8'}),'');
const bonuses={};
for(const id of ['211','212','213','221','222','223']){
  const s=fs.readFileSync(path.join(root,'build-scripts/content/book-2',id,'answers.md'),'utf8').split('## Denkertje / Bonusopgave')[1].split('## Herhaling')[0];
  bonuses[id]=(s.match(/^- /gm)||[]).length;
}
assert.deepEqual(bonuses,{211:0,212:0,213:0,221:3,222:4,223:4});
console.log(JSON.stringify({result:'PASS for exact adoption assertions only',checks,paragraph222:'Current R13 paragraph PASS WITH FLAGS; QC/handoff pending',specialist213:'Current R6 REVISE; initial permissive PASS explicitly superseded; no lesson QC append adopted',fresh_reviewer_page_files:50,grayscale_files:9,bonus_criteria_counts:bonuses,required_bonus_corrections:['211','212','213'],current_root213_rebuild:'NOT CLAIMED: old212 MD pin intentionally unchanged after212 R6 adoption',book_final:false},null,2));
