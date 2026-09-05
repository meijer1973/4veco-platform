// Exact §222 R13 root acceptance checkpoint, not an evergreen book validator.
// HOW TO ADAPT: retain this fixed historical record and create a successor.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const {execFileSync}=require('child_process'),yaml=require('js-yaml');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const book='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus';
const rel=book+'/2.2 Hoofdstuk Elasticiteit/2.2.2 Elasticiteit en omzet/';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFileSync(p,'utf8');
const canonical={
  '2.2.2-review.md':'9122a962d5108565a631d6cd51b1945ab0ddb1ef78c2b979cca15ac59010f01a',
  '2.2.2-quality-ref.yaml':'b15a630aa9f328816deaafd23f437a497ddfb03702a8151f705756b2d43fb432',
  '2.2.2-textbook-handoff.md':'135e1db69db4ee43e9cba735a50ff0e67e22987afd7b7c13ece2158651b56c82'
};
for(const [name,h]of Object.entries(canonical))assert.equal(sha(fs.readFileSync(path.join(lessons,rel,name))),h,name);
const original=yaml.load(execFileSync('git',['show','7f65869b17a1b24fc47a68064fc60fcd72050422:'+rel+'2.2.2-quality-ref.yaml'],{cwd:lessons,encoding:'utf8'}));
const current=yaml.load(read(path.join(lessons,rel,'2.2.2-quality-ref.yaml')));
assert.equal(current.partA.production_ready_with_flags,true);assert.equal(current.partA.root_acceptance.actor,'codex-root');
delete current.partA.production_ready_with_flags;delete current.partA.root_acceptance;
assert.deepEqual(current,original,'Only two named root acceptance fields differ');
const changes=execFileSync('git',['diff','--name-only','-z','7f65869b17a1b24fc47a68064fc60fcd72050422','f338159502438a0833f3d94e4956eeb8b0812a6d'],{cwd:lessons,encoding:'utf8'}).split('\0').filter(Boolean).sort();
assert.deepEqual(changes,[rel+'2.2.2-quality-ref.yaml',rel+'2.2.2-textbook-handoff.md'].sort());
const handoff=read(path.join(lessons,rel,'2.2.2-textbook-handoff.md'));
for(const kind of ['paragraaf','opgaven','antwoorden'])for(const ext of ['md','pdf']){
  const h=sha(fs.readFileSync(path.join(lessons,rel,'2.2.2 Elasticiteit en omzet – '+kind+'.'+ext)));
  assert(handoff.includes(h),kind+'.'+ext);
}
assert.equal((handoff.match(/^## [1-9]\. /gm)||[]).length,9);
for(const filename of ['222-root-acceptance-r13.md','222-R13-review-report.md','222-R13-QC-report.md'])assert(fs.existsSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-'+filename)));
const manifest=read(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-output-manifest.md'));
const rows=manifest.split(/\r?\n/).filter(l=>/^\| \d+ \|/.test(l)).map(l=>l.split('|').slice(1,-1).map(s=>s.trim()));
assert.equal(rows.length,41);const counts={A:0,C:0,L:0,P:0},paths=new Set();let present=0,pdfHashes=0;
for(const [n,id,kind,status,quoted]of rows){
  assert(Object.hasOwn(counts,status));counts[status]++;
  const p=quoted.replace(/^`|`$/g,'');assert(!paths.has(p));paths.add(p);
  const file=path.join(lessons,book,p);assert.equal(fs.existsSync(file),status!=='P',p);if(status!=='P')present++;
  if(status==='A')assert(['2.2.1','2.2.2'].includes(id));
  if(status==='L')assert.equal(sha(fs.readFileSync(file)),sha(execFileSync('git',['show','f09fd6e88edc5049b026b16b0158e7e188091d2d:'+book+'/'+p],{cwd:lessons,maxBuffer:20*1024*1024})));
  if(status==='A'||status==='C'){assert(manifest.includes('| '+id+' / '+kind+' | `'+sha(fs.readFileSync(file))+'` |'));pdfHashes++;}
}
assert.deepEqual(counts,{A:6,C:12,L:8,P:15});assert.equal(present,26);assert.equal(pdfHashes,18);
console.log(JSON.stringify({result:'PASS',canonical_records:3,root_fields_only:true,lesson_changed_paths:changes,handoff_sections:9,handoff_md_pdf_hashes:6,counts,present,current_pdf_hashes:pdfHashes,book_complete:false},null,2));
