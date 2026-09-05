// Exact211 R5/212 R7 checkpoint. HOW TO ADAPT: write a new checkpoint when
// canonical acceptance changes; do not weaken these historical assertions.
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
for(const [folder,id,review,qc,handoff] of [
 ['2.1.1 Kostenstructuren','2.1.1','92b4a9462caf8316274fb58f8beef5c850147c44e6bf80b9a28fad442d9dbe96','0dddb6e9d8f3a8da0e0f31e67dafabf53b99feb6ad86ce72039480dd7e12ea18','724a080619f2f072151edf20980071b3bef18cd60d1904c78f4aa906be8917c8'],
 ['2.1.2 Opbrengsten, winst en break-even','2.1.2','74ad2ed9c44d9aa05b6d6a680d5d273f2cad4b62e4bead5db303c006514238cd','e168e3c2b8698d12b699fbf60e7691fbbc8a15d61bd46a7988704d3c896c805c','de2b8ed7dcc7a3c5c6eaac400892d2d37ac5212ccb3b9972fb004115a88c1fe2']
]){
 const dir=path.join(lessons,book,'2.1 Hoofdstuk Kosten en opbrengsten',folder);
 for(const [suffix,expected]of [['-review.md',review],['-quality-ref.yaml',qc],['-textbook-handoff.md',handoff]])assert.equal(sha(path.join(dir,id+suffix)),expected);
}
console.log(JSON.stringify({result:'PASS',counts,present,current_pdf_hashes:hashes,canonical211212:'historical unchanged; no new acceptance',book_complete:false},null,2));
