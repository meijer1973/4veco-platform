'use strict';
// HOW TO ADAPT: dispatch only known editions; reused numeric IDs need a revision.
const fs=require('fs'),path=require('path');
const v2=require('./books34-v2-structure'),m=require('./migrate-books34-v3');
function revision(root=m.ROOT){return JSON.parse(fs.readFileSync(path.join(root,m.REGISTRY),'utf8')).structure_revision;}
function readSelectedStructure(root=m.ROOT,requested=revision(root)) {
 if(requested===v2.REVISION)return v2.readSelectedStructure(root);
 if(requested!==m.REVISION)throw new Error('Unknown structural revision '+requested);
 return [3,4].flatMap(b=>{
  const base=`${m.OUTLINES}/book-${b}-outline`,bytes=fs.readFileSync(path.join(root,base+'.md'));
  const meta=JSON.parse(fs.readFileSync(path.join(root,base+'.meta.json'),'utf8'));
  const rows=meta.pedagogical_amendment
    ? require('./books34-route-amendment').currentOutline(bytes,b,root)
    : m.parseOutline(bytes,b);
  if(meta.structure_revision!==requested||meta.current_status!=='owner_selected_structural_baseline'||meta.original_sha256!==m.HASHES[b]||meta.paragraph_count!==m.COUNTS[b]||meta.target_approval!=='not_conferred'||meta.companion_acceptance!=='not_conferred'||JSON.stringify(meta.paragraphs)!==JSON.stringify(rows)||JSON.stringify(meta.chapters)!==JSON.stringify(m.CHAPTERS[b].map(([id,title,n])=>({id,title,paragraph_count:n}))))throw new Error('Stale/mixed outline metadata: Book '+b);
  return rows;
 });
}
function lookupParagraph(id,requested,root=m.ROOT) {
 if(![m.PREVIOUS,m.REVISION].includes(requested))throw new Error('An explicit supported structure_revision is required for a Book 3/4 ID');
 if(requested!==revision(root))throw new Error('Requested revision is not active in this root; use its historical checkout');
 const row=readSelectedStructure(root,requested).find(r=>r.id===id);
 if(!row)throw new Error('No paragraph '+requested+':'+id);
 return {...row,structure_revision:requested,target_approval:'not_conferred'};
}
function validateStructuralRecords(data,root=m.ROOT) {
 if(data.structure_revision===m.PREVIOUS)return v2.validateStructuralRecords(data,root);
 const errors=[];
 if(data.structure_revision!==m.REVISION)return ['Unknown or missing structure_revision'];
 if(JSON.stringify(data.expected_count_bearing_paragraphs)!==JSON.stringify(m.COUNTS)||data.total_count_bearing_paragraphs!==55)errors.push('Expected 12/12/14/17 and total 55');
 let rows;try{rows=readSelectedStructure(root,m.REVISION);}catch(e){return [...errors,e.message];}
 const records=(data.exercises||[]).filter(r=>[3,4].includes(r.module));
 if(JSON.stringify(records.map(r=>r.id))!==JSON.stringify(rows.map(r=>r.id)))errors.push('Wrong v3 IDs/order/chapter counts (6+4+4 / 5+7+5)');
 for(const r of records){const spec=rows.find(x=>x.id===r.id);if(!spec)continue;
  if(r.paragraph_title!==spec.title||r.paragraph_kind!==spec.kind||r.introduces_new_theory!==(spec.kind==='theory'))errors.push(r.id+': wrong topic/kind');
  if(r.structure_revision!==m.REVISION||r.source_identity?.revision!==m.REVISION||r.source_identity?.paragraph_id!==r.id||r.source_identity?.outline!==spec.source_path||r.v5_migration?.structural_revision!==m.REVISION)errors.push(r.id+': mixed structural identity');
  if(r.record_status!=='candidate_review_ready'||r.target_exercise?.placeholder!==false||!r.target_exercise?.context?.trim()||!r.target_exercise?.context_html?.trim()||!r.target_exercise?.subquestions?.length||r.v5_migration?.review_required_before_final!==true||r.v5_migration?.source_status!=='candidate_review_ready'||r.review_evidence||r.target_quality_review||r.independent_review_status!=='not_conferred_by_authoring_package')errors.push(r.id+': filled candidate required; no final approval conferred');
  if(r.source_ref!==`${m.V5} §${r.id}`||r.structural_retrieval_plan!==spec.retrieval_and_transfer||r.structural_scope_boundary!==spec.boundary)errors.push(r.id+': altered source/scope/retrieval');
  if(r.source_locator?.package_root!==m.PACKAGE||r.source_locator?.repository!=='meijer1973/4veco-lessen')errors.push(r.id+': missing source locator');
  for(const ref of r.historical_source_refs||[])if(ref.revision!==m.PREVIOUS||ref.inherits_approval!==false||ref.target_equivalence!==false)errors.push(r.id+': invalid historical identity/approval');
 }
 try{const old=JSON.parse(fs.readFileSync(path.join(root,m.SNAPSHOT,m.REGISTRY)));if(m.canonical(data.exercises.filter(r=>r.module<3))!==m.canonical(old.exercises.filter(r=>r.module<3)))errors.push('Book 1/2 records changed');}catch(e){errors.push('Missing received-v2 registry snapshot: '+e.message);}
 return errors;
}
if(require.main===module){const args=process.argv.slice(2),i=args.indexOf('--revision'),r=i<0?null:args[i+1];if(!r)throw new Error('Required --revision <exact revision> [paragraph ID]');const id=args.find(a=>/^\d\.\d\.\d+$/.test(a));console.log(JSON.stringify(id?lookupParagraph(id,r):readSelectedStructure(m.ROOT,r),null,2));}
module.exports={...m,revision,readSelectedStructure,lookupParagraph,validateStructuralRecords};
