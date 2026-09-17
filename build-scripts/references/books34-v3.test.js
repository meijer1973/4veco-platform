'use strict';
const fs=require('fs'),os=require('os'),path=require('path'),{execFileSync}=require('child_process');
const m=require('./migrate-books34-v3'),{validate}=require('../../scripts/check-course-target-exercises-v5');
const {lookupParagraph,validateStructuralRecords}=require('./books34-selected-structure');
const {consumeTarget}=require('./target-source-consumer');
const v2=require('./books34-v2-structure');
const {targetChunks}=require('../rag/build-chunks');
const current=()=>JSON.parse(fs.readFileSync(path.join(m.ROOT,m.REGISTRY)));
let temp;
beforeAll(()=>{temp=fs.mkdtempSync(path.join(os.tmpdir(),'books34-v3-test-'));});
afterAll(()=>{if(temp&&path.resolve(temp).startsWith(path.resolve(os.tmpdir())+path.sep)&&path.basename(temp).startsWith('books34-v3-test-'))fs.rmSync(temp,{recursive:true});});
test.each([
 ['unknown revision',d=>d.structure_revision='unknown'],
 ['unversioned record',d=>delete d.exercises[24].source_identity.revision],
 ['mixed revision',d=>d.exercises[24].structure_revision=m.PREVIOUS],
 ['old 4.1 count',d=>d.exercises=d.exercises.filter(r=>r.id!=='4.1.5')],
 ['old 4.3 count',d=>d.exercises.push({...d.exercises.at(-1),id:'4.3.6'})],
 ['empty context',d=>d.exercises[24].target_exercise.context=''],
 ['missing source locator',d=>delete d.exercises[24].source_locator],
 ['changed Book 1',d=>d.exercises[0].paragraph_title='Changed'],
 ['changed Book 2',d=>d.exercises[12].target_exercise.context='Changed'],
 ['false final approval',d=>d.exercises[24].record_status='reviewed_final'],
 ['missing blueprint ref',d=>delete d.exercises[24].source_ref],
 ['wrong outline',d=>d.exercises[24].source_identity.outline='wrong.md']
])('v3 rejects %s',(name,mutate)=>{const d=current();mutate(d);expect(validate(d).length).toBeGreaterThan(0);});
test('canonical v5 validator passes and requires actual paragraph anchors',()=>{
 expect(validate(current())).toEqual([]);
 expect(JSON.parse(fs.readFileSync(path.join(m.ROOT,m.V6.replace('.md','.meta.json')))).current_year_1_structure_revision).toBe(m.REVISION);
 const fixture=path.join(temp,'no-anchor');fs.mkdirSync(path.join(fixture,'references/owned'),{recursive:true});
 fs.writeFileSync(path.join(fixture,m.V5),fs.readFileSync(path.join(m.ROOT,m.V5),'utf8').replace('§3.2.2 -','§missing -'));
 expect(validate(current(),fixture).some(e=>e.includes('3.2.2')&&e.includes('anchor'))).toBe(true);
});
test('historical v2 structure validates its archived inputs but not v3 targets',()=>{
 const root=path.join(m.ROOT,m.SNAPSHOT),data=JSON.parse(fs.readFileSync(path.join(root,m.REGISTRY)));
 expect(v2.validateStructuralRecords(data,root)).toEqual([]);
 expect(v2.lookupParagraph('4.1.1',root).title).toMatch(/monopolie/i);
 expect(v2.validateStructuralRecords(current(),root).length).toBeGreaterThan(0);
 expect(()=>lookupParagraph('4.1.1',m.PREVIOUS)).toThrow();
 expect(()=>lookupParagraph('4.1.1')).toThrow();
 expect(validateStructuralRecords({...data,structure_revision:'unrecognised'}).length).toBeGreaterThan(0);
});
test.each(['missing','unknown','mixed'])('normal retrieval rejects %s revision',fault=>{
 const d=current();if(fault==='missing')delete d.exercises[24].structure_revision;
 if(fault==='unknown')d.structure_revision='unknown';if(fault==='mixed')d.exercises[24].source_identity.revision=m.PREVIOUS;
 expect(()=>targetChunks(d)).toThrow(/revision/);
});
test.each(['missing student','source hash','missing figure','figure hash','unconsumed figure','empty context'])('normal consumer rejects %s',fault=>{
 const r=current().exercises.find(r=>r.id==='4.3.2');
 if(fault==='missing student')r.source_pin.student_file='missing.md';
 if(fault==='source hash')r.source_pin.student_manuscript_sha256='0'.repeat(64);
 if(fault==='missing figure'){const old=r.target_exercise.figures[0].path;r.target_exercise.context_html=r.target_exercise.context_html.replace(old,'missing.svg');r.target_exercise.figures[0].path='missing.svg';}
 if(fault==='figure hash')r.target_exercise.figures[0].sha256='0'.repeat(64);
 if(fault==='unconsumed figure')r.target_exercise.context_html=r.target_exercise.context_html.replace(/<img\b[^>]*>/g,'');
 if(fault==='empty context')r.target_exercise.context='';
 expect(()=>consumeTarget(r)).toThrow();
});
test('normal retrieval export retains all 55 targets, formulas, table structure and 26 source-figure uses',()=>{
 const output=path.join(temp,'chunks.jsonl');
 execFileSync(process.execPath,['build-scripts/rag/build-chunks.js','--output',output],{cwd:m.ROOT,stdio:'pipe'});
 const targets=fs.readFileSync(output,'utf8').trim().split('\n').map(JSON.parse).filter(c=>c.source_type==='target_exercise');
 expect(targets).toHaveLength(55);
 const get=id=>targets.find(c=>c.entity_ids.includes(id));
 const derivative=get('3.2.2');
 for(const value of ['0,04q² + 4q + 400','kg per week','euro per week','200 kg'])expect(derivative.text).toContain(value);
 const labour=get('4.3.2');
 for(const value of ['5.000','3.000','500 werklozen','1.500','Lᵥ = 240 − 10w','Lₐ = −40 + 10w','20 uur per week'])expect(labour.text).toContain(value);
 expect(labour.target.context_html).toContain('data:image/svg+xml;base64,');
 expect(labour.target.context_html).toContain('Benoem het berekende evenwicht');
 const selected=targets.filter(c=>c.structure_revision===m.REVISION);
 expect(selected).toHaveLength(31);
 expect(selected.reduce((n,c)=>n+c.target.figures_consumed.length,0)).toBe(26);
 expect(selected.every(c=>c.curriculum_authority===false)).toBe(true);
 const table=selected.find(c=>c.target.tables_consumed>0);expect(table.target.context_html).toMatch(/<table[ >]/);expect(table.target.context_html).toMatch(/<td[ >]/);
 const source=get('3.3.4');expect(source.target.context_html).toContain('Bron A');expect(source.text).toContain('REGENJASSEN IN NERIN');expect(source.text).toContain('Bron A');expect(source.text).toContain('Bron B');
 expect(selected.every(c=>c.target.sources.length>0&&c.target.subquestions.length>0)).toBe(true);
 for(const id of ['3.2.2','4.3.2','4.3.1','3.3.4']){
  const query=JSON.parse(execFileSync(process.execPath,['build-scripts/rag/query.js','--index',output,'--paragraph',id,'--revision',m.REVISION,'--json'],{cwd:m.ROOT,encoding:'utf8',maxBuffer:8*1024*1024}));
  const result=query.results.find(c=>c.source_type==='target_exercise'&&c.entity_ids.includes(id));
  expect(result.target).toEqual(get(id).target);expect(result.pending_review).toBe(true);expect(result.curriculum_authority).toBe(false);
 }
},30000);
