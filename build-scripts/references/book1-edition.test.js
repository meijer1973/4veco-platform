'use strict';
const fs=require('fs'),os=require('os'),path=require('path');
const e=require('./book1-edition');
const {targetChunks}=require('../rag/build-chunks');
test('current Book 1 uses twelve new source identities without inherited approval',()=>{
 const selected=e.selectedTargets({exercises:[{module:1,id:'1.1.1',record_status:'reviewed_final'},{module:2,id:'2.1.1'}]});
 expect(selected.exercises).toHaveLength(13);
 expect(selected.exercises.filter(r=>r.module===1).every(r=>r.record_id===e.REVISION+':'+r.id&&r.approval_inherited===false)).toBe(true);
 expect(selected.exercises.at(-1)).toEqual({module:2,id:'2.1.1'});
 expect(()=>e.lookup('1.1.1')).toThrow('Explicit supported');
});
test('RAG receives mixed-source tables and figures, not just question text',()=>{
 const data=e.selectedTargets({exercises:[]});
 const chunks=targetChunks(data);
 expect(chunks.every(c=>c.curriculum_authority===false&&c.edition_id===e.REVISION)).toBe(true);
 for(const code of ['1.1.4','1.2.4','1.3.4']){
  const r=data.exercises.find(r=>r.id===code),c=chunks.find(c=>c.record_id===e.REVISION+':'+code);
  for(const label of ['Bron A','Bron B','Bron C'])expect(c.text).toContain(label);
  expect(r.target_exercise.answer_html).toContain('Opgave');
 }
 const aula=chunks.find(c=>c.record_id.endsWith(':1.1.1'));
 expect(aula.text).toContain('70');expect(aula.text).toContain('90');
 const geometry=data.exercises.find(r=>r.id==='1.1.3').target_exercise;
 expect(geometry.source_assets.length).toBeGreaterThan(0);
 expect(geometry.context).toContain('geometry');
});
test('a mixed or inherited approval record fails closed',()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'book1-edition-'));
 try{
  const file=path.join(tmp,e.SOURCE);fs.mkdirSync(path.dirname(file),{recursive:true});
  const data=JSON.parse(fs.readFileSync(path.join(__dirname,'../..',e.SOURCE)));
  data.exercises[0].record_status='reviewed_final';fs.writeFileSync(file,JSON.stringify(data));
  expect(()=>e.selectedTargets({exercises:[]},tmp)).toThrow('Mixed Book 1');
 }finally{fs.rmSync(tmp,{recursive:true,force:true});}
});
test('legacy Book 1 source paths cannot supply current edition evidence',()=>{
 expect(e.isCurrentSource('../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk/1.1.1 opgaven.md')).toBe(false);
 expect(e.isCurrentSource('../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/edities/tweede-editie-2026/bronnen/H1/1.1.1 paragraaf.md')).toBe(true);
 const graph=JSON.parse(fs.readFileSync(path.join(__dirname,'../../references/data/owned-content-graph.json')));
 for(const edge of graph.edges.filter(r=>r.to.includes(e.REVISION)&&r.source_path.includes('4veco-lessen/')))
  expect(e.isCurrentSource(edge.source_path)).toBe(true);
 expect(graph.edges.filter(r=>r.to.includes(e.REVISION)&&r.source_path.includes('course-blueprint'))).toEqual([]);
});

test('only the finite edition inventory changes textbook lane ownership',()=>{
 const {classifyPath}=require('../workflows/check-paragraph-lane-scope');
 const base='Boek 1 - Grondslagen, vraag en aanbod/';
 expect(classifyPath(base+'edities/tweede-editie-2026/index.html').category).toBe('partA_textbook');
 expect(classifyPath(base+'1.1 Hoofdstuk/1.1.1 Test/index.html').category).toBe('partB_companion');
 expect(classifyPath(base+'edities/tweede-editie-2026/unreviewed.pdf').category).toBe('unknown');
});
test('Book 2 authority accepts only the exact Book 1 contract clarification',()=>{
 const t=require('./book1-authority-transition'),text=fs.readFileSync(path.join(__dirname,'../..',t.FILE),'utf8');
 expect(t.acceptsTransition(t.FILE,t.BEFORE,{[t.FILE]:text})).toBe(true);
 expect(t.acceptsTransition(t.FILE,t.BEFORE,{[t.FILE]:text+' changed rule'})).toBe(false);
 expect(t.acceptsTransition(t.FILE,'0'.repeat(64),{[t.FILE]:text})).toBe(false);
 expect(t.acceptsTransition('references/authored/course-target-exercises.json',t.BEFORE,{[t.FILE]:text})).toBe(false);
});
