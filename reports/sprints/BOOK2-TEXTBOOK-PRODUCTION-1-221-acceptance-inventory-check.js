// Read-only R8 internal-acceptance checkpoint, not an evergreen book validator.
// HOW TO ADAPT: create a new explicit checkpoint for future gate transitions;
// preserve this historical exact evidence and never relax its expected hashes.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const {execFileSync}=require('child_process');
const yaml=require('js-yaml');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const book='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus';
const par=book+'/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit/';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFileSync(p,'utf8');
const report=n=>path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-'+n);
const expected={
  '2.2.1-review.md':'19bfa448b3c0f80732f2fa77617eb2772880747082fb683c8cd3852c74a96c63',
  '2.2.1-quality-ref.yaml':'4f0c77e9ae5769bb85c9c32dfa019049f6bccd323dfd0152b7eabf95897879fa',
  '2.2.1-textbook-handoff.md':'3a3357f0f1487fcc8376e5c9717f80d181f2d71c6069f647c6fa7ab71377f811'
};
for(const [name,h]of Object.entries(expected))assert.equal(sha(fs.readFileSync(path.join(lessons,par,name))),h,name);
const quality=yaml.load(read(path.join(lessons,par,'2.2.1-quality-ref.yaml')));
const prior=yaml.load(execFileSync('git',['show','b38b8cf8d68cd86537831dc3ee27e4a1e203f7db:'+par+'2.2.1-quality-ref.yaml'],{cwd:lessons,encoding:'utf8'}));
assert.equal(quality.partA.production_ready_with_flags,true);
assert(quality.partA.root_acceptance);
assert.match(quality.partA.handoff_status,/Root internal Part A R8 acceptance/);
for(const key of ['production_ready_with_flags','handoff_status','root_acceptance']){
  delete quality.partA[key];delete prior.partA[key];
}
assert.deepEqual(quality,prior,'Only named root acceptance fields may differ');
assert(fs.existsSync(report('221-root-acceptance-r8.md')));
const manifest=read(report('output-manifest.md'));
const rows=manifest.split(/\r?\n/).filter(l=>/^\| \d+ \|/.test(l)).map(l=>l.split('|').slice(1,-1).map(x=>x.trim()));
assert.equal(rows.length,41);
const counts={A:0,C:0,L:0,P:0};let present=0,legacy=0,pdfHashes=0;
const planned=new Set();
for(const [number,id,edition,status,quoted]of rows){
  assert(Object.hasOwn(counts,status));counts[status]++;
  const rel=quoted.replace(/^`|`$/g,'');assert(!planned.has(rel));planned.add(rel);
  const file=path.join(lessons,book,rel),exists=fs.existsSync(file);
  assert.equal(exists,status!=='P',rel);if(exists)present++;
  if(status==='A')assert.equal(id,'2.2.1');
  if(status==='L'){
    const old=execFileSync('git',['show','f09fd6e88edc5049b026b16b0158e7e188091d2d:'+book+'/'+rel],{cwd:lessons,maxBuffer:20*1024*1024});
    assert.equal(sha(fs.readFileSync(file)),sha(old),rel);legacy++;
  }
  if(status==='A'||status==='C'){
    const h=sha(fs.readFileSync(file));assert(manifest.includes('| '+id+' / '+edition+' | `'+h+'` |'),rel);pdfHashes++;
  }
}
assert.deepEqual(counts,{A:3,C:15,L:8,P:15});assert.equal(present,26);assert.equal(legacy,8);assert.equal(pdfHashes,18);
const handoff=read(path.join(lessons,par,'2.2.1-textbook-handoff.md'));
for(const edition of ['paragraaf','opgaven','antwoorden'])for(const extension of ['md','pdf']){
  const h=sha(fs.readFileSync(path.join(lessons,par,'2.2.1 Prijselasticiteit – '+edition+'.'+extension)));
  assert(handoff.includes(h),edition+'.'+extension);
}
const changes=execFileSync('git',['diff','--name-only','-z','800c3540b15787aecec2e782e6da9b960664cadb','6ccc48911a6239dee25cffb8f29e9f42db442f9e'],{cwd:lessons,encoding:'utf8'}).split('\0').filter(Boolean).sort();
assert.deepEqual(changes,[par+'2.2.1-quality-ref.yaml',par+'2.2.1-textbook-handoff.md'].sort());
console.log(JSON.stringify({result:'PASS',scope:'Exact §221 R8 root acceptance and41-PDF inventory checkpoint',canonical_records:3,root_quality_fields_only:true,lesson_changed_paths:changes,counts,present,legacy_baseline_identical:legacy,current_pdf_hashes:pdfHashes,handoff_current_md_pdf_bindings:6,book_final:false},null,2));
