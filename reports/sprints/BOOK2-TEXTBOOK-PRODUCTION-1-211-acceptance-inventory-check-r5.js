// Fixed root R5 acceptance checkpoint; create a separate successor for later work.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const {execFileSync}=require('child_process'),yaml=require('js-yaml');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-',book='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus';
const rel=book+'/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren/';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFileSync(p),text=p=>fs.readFileSync(p,'utf8');
const git=(cwd,args)=>execFileSync('git',args,{cwd,maxBuffer:32*1024*1024});
const originalCommit='1fb8ce8555983dcb24a6192cc0a6a85ecc8c1c14';
const canonical={
  '2.1.1-review.md':'a75755c7c2e6cdffb2defcbb5403814cf854d87bfae9a8172dd768aadb5b8023',
  '2.1.1-quality-ref.yaml':'c85c44a53d46af87ad61500b83b0fd721fac43c97ffd1be3d512308158a4b9f5',
  '2.1.1-textbook-handoff.md':'0d14506e314a11fef0637cc66cf29036f174b94cafbf7fa5ede2eff88937500f'
};
for(const [name,h]of Object.entries(canonical)){
  const raw=read(path.join(lessons,rel,name));assert.equal(sha(raw),h,name);
  assert.equal(sha(raw.toString('utf8').replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n')),h);
}
const original=yaml.load(git(lessons,['show',originalCommit+':'+rel+'2.1.1-quality-ref.yaml']).toString('utf8'));
const current=yaml.load(text(path.join(lessons,rel,'2.1.1-quality-ref.yaml')));
const expected=structuredClone(original);
Object.assign(expected.partA,{
  root_validation:'PASS',root_acceptance:'ACCEPTED WITH FLAGS',handoff_renewal:'COMPLETE',
  handoff_status:'Current R5 handoff; unchanged_handoff_sha256 identifies the superseded historical snapshot',
  production_ready_with_flags:true,root_decision:current.partA.root_decision
});
assert.equal(current.partA.root_decision.actor,'codex-root');
assert.equal(current.partA.root_decision.adopted_specialist_lesson_commit,originalCommit);
assert.equal(current.partA.root_decision.specialist_quality_ref_sha256_before_root_fields,'0a48d356def16b38ba5cf473c735cb83ec9ca15fde245e6461a955e487fc19a1');
assert.deepEqual(current,expected,'Only four named root state fields and two attributed root additions');
assert.equal(sha(read(path.join(root,current.partA.root_decision.adoption_bindings))),current.partA.root_decision.adoption_bindings_sha256);
assert(fs.existsSync(path.join(root,current.partA.root_decision.report)));
const changes=git(lessons,['diff','--name-only','-z',originalCommit]).toString('utf8').split('\0').filter(Boolean).sort();
assert.deepEqual(changes,[rel+'2.1.1-quality-ref.yaml',rel+'2.1.1-textbook-handoff.md'].sort());
const handoff=text(path.join(lessons,rel,'2.1.1-textbook-handoff.md'));
assert.equal((handoff.match(/^## [1-9]\. /gm)||[]).length,9);
for(const n of Object.keys(canonical).filter(n=>n!=='2.1.1-textbook-handoff.md'))assert(handoff.includes(canonical[n]),n);
for(const kind of ['paragraaf','opgaven','antwoorden'])for(const ext of ['md','html','pdf']){
  assert(handoff.includes(sha(read(path.join(lessons,rel,'2.1.1 Kostenstructuren – '+kind+'.'+ext)))),kind+'.'+ext);
}
const before=JSON.parse(text(path.join(__dirname,prefix+'211-R5-QC-evidence/before.json')));
let unchanged=0;
for(const [f,h]of Object.entries(before)){
  if(f.endsWith('2.1.1-quality-ref.yaml')||f.endsWith('2.1.1-textbook-handoff.md'))continue;
  assert.equal(sha(read(path.join(lessons,f))),h,f);unchanged++;
}
// Rebind all imported proof/source/native records from the successful pre-state,
// except the two intentionally renewed canonical files.
const pre=JSON.parse(text(path.join(__dirname,prefix+'211-root-qc-bindings-r5.json')));
for(const b of pre.bindings){
  if(b.file.startsWith('../4veco-lessen/')&&(b.file.endsWith('2.1.1-quality-ref.yaml')||b.file.endsWith('2.1.1-textbook-handoff.md')))continue;
  assert.equal(sha(read(path.resolve(root,b.file))),b.sha256,b.file);
}
const manifest=text(path.join(__dirname,prefix+'output-manifest.md'));
const rows=manifest.split(/\r?\n/).filter(l=>/^\| \d+ \|/.test(l)).map(l=>l.split('|').slice(1,-1).map(s=>s.trim()));
assert.equal(rows.length,41);const counts={A:0,C:0,L:0,P:0},paths=new Set();let present=0,pdfHashes=0;
for(const [n,id,kind,status,quoted]of rows){
  assert(Object.hasOwn(counts,status));counts[status]++;const f=quoted.replace(/^`|`$/g,'');
  assert(!paths.has(f));paths.add(f);const file=path.join(lessons,book,f);
  assert.equal(fs.existsSync(file),status!=='P',f);if(status!=='P')present++;
  if(status==='A')assert(['2.1.1','2.2.1','2.2.2'].includes(id));
  if(status==='L')assert.equal(sha(read(file)),sha(git(lessons,['show','f09fd6e88edc5049b026b16b0158e7e188091d2d:'+book+'/'+f])));
  if(status==='A'||status==='C'){assert(manifest.includes('| '+id+' / '+kind+' | `'+sha(read(file))+'` |'));pdfHashes++;}
}
assert.deepEqual(counts,{A:9,C:9,L:8,P:15});assert.equal(present,26);assert.equal(pdfHashes,18);
const result={status:'PASS',scope:'Current211 R5 root-only acceptance and41-PDF inventory',canonical,lesson_changed_paths:changes,root_fields_only:true,unchanged_paragraph_files:unchanged,handoff_sections:9,handoff_document_hashes:9,pre_state_bindings_rechecked:pre.bindings.length,counts,present,current_pdf_hashes:pdfHashes,book_complete:false};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(result,null,2));
