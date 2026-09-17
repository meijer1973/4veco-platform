'use strict';
// Current structural lookup for the two fixed owner-selected outlines.
// This is structural identity, never target-quality or production approval.
const fs = require('fs');
const path = require('path');
const { REVISION, COUNTS, HASHES, CHAPTERS, parseOutline } = require('./migrate-books34-selected-outlines');
const ROOT = path.resolve(__dirname,'../..');
function readSelectedStructure(root=ROOT) {
  return [3,4].flatMap(book=>{
    const base=`references/authored/book-outlines/book-${book}-outline`;
    const rows=parseOutline(fs.readFileSync(path.join(root,base+'.md')),book);
    const meta=JSON.parse(fs.readFileSync(path.join(root,base+'.meta.json'),'utf8'));
    if(meta.structure_revision!==REVISION || meta.current_status!=='owner_selected_structural_baseline'
      || meta.original_sha256!==HASHES[book] || meta.paragraph_count!==COUNTS[book]
      || meta.target_approval!=='not_conferred' || meta.companion_acceptance!=='not_conferred'
      || JSON.stringify(meta.paragraphs)!==JSON.stringify(rows)) throw new Error(`Book ${book}: selected outline adoption is stale or altered`);
    return rows;
  });
}
function lookupParagraph(id,root=ROOT) {
  const row=readSelectedStructure(root).find(row=>row.id===id);
  if(!row) throw new Error(`No selected Book 3/4 paragraph: ${id}`);
  return {...row,structure_revision:REVISION,target_approval:'not_conferred'};
}
function validateStructuralRecords(data,root=ROOT) {
  const errors=[];
  if(data.structure_revision!==REVISION) errors.push(`structure_revision must be ${REVISION}`);
  if(JSON.stringify(data.expected_count_bearing_paragraphs)!==JSON.stringify(COUNTS) || data.total_count_bearing_paragraphs!==55) errors.push('current structural metadata must be 12/12/14/17, total 55');
  let rows;
  try { rows=readSelectedStructure(root); } catch(e) {return [...errors,e.message];}
  const selected=(Array.isArray(data.exercises)?data.exercises:[]).filter(r=>r.module===3 || r.module===4);
  if(JSON.stringify(selected.map(r=>r.id))!==JSON.stringify(rows.map(r=>r.id))) errors.push('Book 3/4 record IDs/order must match the exact selected outline');
  const byId=new Map(rows.map(r=>[r.id,r]));
  for(const record of selected) {
    const spec=byId.get(record.id); if(!spec) continue;
    if(record.paragraph_title!==spec.title || record.paragraph_kind!==spec.kind) errors.push(`${record.id}: topic/kind does not match selected outline`);
    if(record.structure_revision!==REVISION || record.source_identity?.revision!==REVISION
      || record.source_identity?.paragraph_id!==record.id || record.source_identity?.outline!==spec.source_path) errors.push(`${record.id}: missing version-qualified structural identity`);
    if(record.record_status!=='placeholder_needs_review' || record.target_exercise?.placeholder!==true
      || record.v5_migration?.review_required_before_final!==true || record.review_evidence || record.target_quality_review) errors.push(`${record.id}: structural adoption cannot promote target approval`);
    if(record.structural_retrieval_plan!==spec.retrieval_and_transfer || record.structural_scope_boundary!==spec.boundary) errors.push(`${record.id}: selected dependency/scope boundary changed`);
    for(const ref of record.historical_source_refs||[]) if(ref.inherits_approval!==false || ref.target_equivalence!==false) errors.push(`${record.id}: historical identity must not transfer approval/equivalence`);
  }
  return errors;
}
if(require.main===module) {
  const id=process.argv[2];
  console.log(JSON.stringify(id?lookupParagraph(id):readSelectedStructure().map(({id,title,kind})=>({id,title,kind})),null,2));
}
module.exports={REVISION,COUNTS,HASHES,CHAPTERS,readSelectedStructure,lookupParagraph,validateStructuralRecords};
