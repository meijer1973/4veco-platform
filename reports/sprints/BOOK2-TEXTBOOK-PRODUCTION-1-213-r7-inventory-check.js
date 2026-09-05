// Exact R7 adoption inventory; HOW TO ADAPT: create a new checkpoint, not
// relaxed old expectations. File presence/hashes do not constitute acceptance.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const book='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus';
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const text=fs.readFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-output-manifest.md'),'utf8');
const rows=text.split(/\r?\n/).filter(l=>/^\| \d+ \|/.test(l)).map(l=>l.split('|').slice(1,-1).map(v=>v.trim()));
assert.equal(rows.length,41);const counts={A:0,C:0,L:0,P:0},seen=new Set();let present=0,hashes=0;
for(const [n,id,kind,status,quoted]of rows){
  assert(Object.hasOwn(counts,status));counts[status]++;
  const rel=quoted.replace(/^`|`$/g,'');assert(!seen.has(rel));seen.add(rel);
  const file=path.join(lessons,book,rel);assert.equal(fs.existsSync(file),status!=='P');if(status!=='P')present++;
  if(['A','C'].includes(status)){assert(text.includes('| '+id+' / '+kind+' | `'+sha(file)+'` |'));hashes++;}
  if(status==='A')assert(['2.2.1','2.2.2'].includes(id));
}
assert.deepEqual(counts,{A:6,C:12,L:8,P:15});assert.equal(present,26);assert.equal(hashes,18);
const folder=path.join(lessons,book,'2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten');
assert.equal(sha(path.join(folder,'2.1.3-review.md')),'a70fd9571cea3afc5861d1b91dc99c102757767e0fb9d66da211602a90c82d66');
assert.equal(sha(path.join(folder,'2.1.3-quality-ref.yaml')),'c96a4af45cfbf6c43ceda27ecf6dd231c75667ece58b378b9080975fe4be717f');
assert(!fs.existsSync(path.join(folder,'2.1.3-textbook-handoff.md')));
console.log(JSON.stringify({result:'PASS',counts,present,current_pdf_hashes:hashes,paragraph213:'R7 candidate; old canonical review/QC preserved, no handoff',book_complete:false},null,2));
