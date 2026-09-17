'use strict';
const fs=require('fs'),path=require('path');
const {validateStructuralRecords,lookupParagraph}=require('./books34-selected-structure');
const {TRANSITIONS,acceptsTransition}=require('./books34-authority-transition');
const {verify,verifyDeliveredFile}=require('../maintenance/check-books34-chat-import');
const {verify:verifyV3}=require('../maintenance/check-books34-v3-import');
const {REVISION}=require('./migrate-books34-v3');
const root=path.resolve(__dirname,'../..');
const current=()=>structuredClone(require('../../references/authored/course-target-exercises.json'));
test('delivery bytes reject missing files, same-size alteration and wrong PDF revision',()=>{
 const bytes=Buffer.from('selected revised PDF');
 const item={repository_path:'book.pdf',bytes:bytes.length,sha256:require('crypto').createHash('sha256').update(bytes).digest('hex')};
 expect(verifyDeliveredFile(item,()=>bytes)).toBe(true);
 expect(verifyDeliveredFile(item,()=>{throw new Error('ENOENT');})).toBe(false);
 expect(verifyDeliveredFile(item,()=>Buffer.from('Selected revised PDF'))).toBe(false);
 expect(verifyDeliveredFile(item,()=>Buffer.from('old unsuffixed PDF'))).toBe(false);
});
test('current v3 identity, complete preservation and paired checkout pass',()=>expect(verifyV3().failures).toEqual([]));
test('historical v2 verifier cannot approve v3 current roots',()=>expect(()=>verify()).toThrow());
test.each([
 ['old Book 4 count',d=>{d.expected_count_bearing_paragraphs['4']=16;}],
 ['missing revision',d=>{delete d.structure_revision;}],
 ['duplicate ID',d=>{d.exercises[25].id=d.exercises[24].id;}],
 ['old topic at reused ID',d=>{d.exercises.find(r=>r.id==='3.3.1').paragraph_title='Monopolie';}],
 ['new approval',d=>{d.exercises[24].record_status='reviewed_final';}],
 ['hidden approval evidence',d=>{d.exercises[24].review_evidence={status:'PASS'};}],
 ['inherited historical approval',d=>{d.exercises[24].historical_source_refs[0].inherits_approval=true;}],
 ['later labour prerequisite',d=>{d.exercises.find(r=>r.id==='3.3.1').structural_retrieval_plan+=' Require 4.3.1 first.';}],
 ['new seventh labour paragraph',d=>{d.exercises.push({...d.exercises.at(-1),id:'4.3.7'});}]
])('rejects %s',(name,mutate)=>{const d=current();mutate(d);expect(validateStructuralRecords(d).length).toBeGreaterThan(0);});
test('lookup uses current selected subjects and version identity',()=>{
 expect(lookupParagraph('3.3.1',REVISION).source_path).toContain('book-3-outline.md');
 expect(lookupParagraph('4.1.1',REVISION).title).toMatch(/langetermijn/i);
 expect(lookupParagraph('4.3.5',REVISION).kind).toBe('gemengde_opgaven');
 expect(()=>lookupParagraph('4.3.6',REVISION)).toThrow();
 expect(()=>lookupParagraph('4.1.1')).toThrow(/revision/);
});
test('Book 2 compatibility accepts only the exact three-source transition',()=>{
 const files=Object.fromEntries(Object.keys(TRANSITIONS).map(p=>[p,fs.readFileSync(path.join(root,p))]));
 for(const [file,[before]] of Object.entries(TRANSITIONS)) {
  expect(acceptsTransition(file,before,files)).toBe(true);
  expect(acceptsTransition(file,'unreviewed',files)).toBe(false);
  for(const changed of Object.keys(files))expect(acceptsTransition(file,before,{...files,[changed]:files[changed]+'\nUnreviewed edit'})).toBe(false);
 }
 const file='references/authored/course-target-exercises.json';const altered=current();altered.exercises[0].paragraph_title='Altered Book 1';
 expect(acceptsTransition(file,TRANSITIONS[file][0],{...files,[file]:JSON.stringify(altered)})).toBe(false);
});
