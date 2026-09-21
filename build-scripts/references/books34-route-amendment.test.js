// Regression cases derived from the independent route-amendment review probes.
'use strict';
const fs = require('fs'), path = require('path'), assert = require('assert'), crypto = require('crypto');
const platform = path.resolve(__dirname, '../..');
const m = require(path.join(platform, 'build-scripts/references/migrate-books34-v3'));
const amendment = require(path.join(platform, 'build-scripts/references/books34-route-amendment'));
const selected = require(path.join(platform, 'build-scripts/references/books34-selected-structure'));
const fixture = fs.mkdtempSync(path.join(require('os').tmpdir(), 'route-amendment-'));
afterAll(() => fs.rmSync(fixture, {recursive: true, force: true}));
const files = [3,4].flatMap(b => [
  `${m.TRANSPORT}/outlines/book-${b}-outline-v3.md`,
  `${m.OUTLINES}/book-${b}-outline.md`,
  `${m.OUTLINES}/book-${b}-outline.meta.json`,
]);
const originals = Object.fromEntries(files.map(f => [f, fs.readFileSync(path.join(platform,f))]));
function reset() { for (const [f,bytes] of Object.entries(originals)) { const out=path.join(fixture,f); fs.mkdirSync(path.dirname(out),{recursive:true}); fs.writeFileSync(out,bytes); } }
function editText(f,from,to) {const p=path.join(fixture,f),s=fs.readFileSync(p,'utf8');assert(s.includes(from));fs.writeFileSync(p,s.replace(from,to));}
function editMeta(book,change) {const p=path.join(fixture,m.OUTLINES,`book-${book}-outline.meta.json`),meta=JSON.parse(fs.readFileSync(p));change(meta);fs.writeFileSync(p,JSON.stringify(meta));}
beforeEach(reset);
const read=()=>selected.readSelectedStructure(fixture,m.REVISION);
test('Current selection equals exactly the 31 received structural rows',()=> {
  const expected=[3,4].flatMap(b=>m.parseOutline(originals[`${m.TRANSPORT}/outlines/book-${b}-outline-v3.md`],b));
  assert.deepStrictEqual(read(),expected); assert.equal(expected.length,31);
});
test('Unrelated current prose edit is rejected',()=> {
  editText(`${m.OUTLINES}/book-3-outline.md`,'Working design rules','Altered design rules');assert.throws(read,/unexpected current route amendment/);
});
test('Structural row edit plus refreshed current hash is rejected',()=> {
  const f=`${m.OUTLINES}/book-3-outline.md`; const current=read()[0];
  editText(f,current.title,current.title+' changed');
  editMeta(3,x=>x.current_sha256=m.sha(fs.readFileSync(path.join(fixture,f))));
  assert.throws(read,/unexpected current route amendment/);
});
test('Edited received transport is rejected',()=> {
  editText(`${m.TRANSPORT}/outlines/book-3-outline-v3.md`,'Working design rules','Altered design rules');assert.throws(read,/byte identity mismatch/);
});
test('Unknown amendment revision is rejected',()=> {editMeta(3,x=>x.pedagogical_amendment.revision='future-unreviewed');assert.throws(read,/stale route-amendment metadata/);});
test('Changed contract pointer is rejected',()=> {editMeta(3,x=>x.pedagogical_amendment.contract+='-changed');assert.throws(read,/stale route-amendment metadata/);});
test('Stale current hash is rejected',()=> {editMeta(3,x=>x.current_sha256='0'.repeat(64));assert.throws(read,/stale route-amendment metadata/);});
test('Removing amendment metadata does not admit current prose',()=> {editMeta(3,x=>delete x.pedagogical_amendment);assert.throws(read,/byte identity mismatch/);});
test('Changed paragraph metadata is rejected',()=> {editMeta(3,x=>x.paragraphs[0].title+=' changed');assert.throws(read,/Stale\/mixed outline metadata/);});
test('Changed chapter counts are rejected',()=> {editMeta(4,x=>x.chapters[0].paragraph_count+=1);assert.throws(read,/Stale\/mixed outline metadata/);});
test('New target approval is rejected',()=> {editMeta(3,x=>x.target_approval='approved');assert.throws(read,/Stale\/mixed outline metadata/);});
test('New companion acceptance is rejected',()=> {editMeta(3,x=>x.companion_acceptance='approved');assert.throws(read,/Stale\/mixed outline metadata/);});
test('Unknown structural revision is rejected',()=> {assert.throws(()=>selected.readSelectedStructure(fixture,'unreviewed'),/Unknown structural revision/);});
