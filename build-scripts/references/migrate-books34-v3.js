'use strict';
// HOW TO ADAPT: this migration is for one pinned delivery and two frozen bases.
// A later edition needs a new migration; never repin this historical input.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {execFileSync}=require('child_process');
const ROOT=path.resolve(__dirname,'../..');
const REVISION='book34-lesson-balance-v3-20260915', PREVIOUS='book34-chat-v2-20260914';
const TASK='BOOK34-V3-INTEGRATION-20260917', PACKAGE='edities/books34-v3';
const TRANSPORT='references/staged/books34-v3';
const PLATFORM_BASE='67374a9808d226f1be7e8fa73eb104312c075267', LESSON_BASE='a0548ff9937dfb3b788b8b0ed53bbf9bd4fe1c07';
const SNAPSHOT='archive/blueprints/book34-pre-v3-20260917', OUTLINES='references/authored/book-outlines';
const REGISTRY='references/authored/course-target-exercises.json', V5='references/owned/course-blueprint-v5.md', V6='references/owned/course-blueprint-v6-three-year.md';
const REVIEW='reports/reference-planning/BLUEPRINT-CHANGE-REVIEW-BOOK34-V3-20260917.md';
const MANIFEST_SHA='516d07d2d33326fd4d12cecc0a3b4a60693ff4b43a6a671dab508a72390db315';
const ZIP_SHA='5ef27d7537f36a4c6ddac9126dff1ed034593bb52ae375acaaab49f09c0bcb55';
const HASHES={3:'1539d9d50b11a89f87afd57e6ee3e6810e4f6dc680691f1230b6d8ef829ea5f2',4:'1a35d90b6171c82c879515f548cdbe30444438017827d2784b5bd8b119bd2dcd'};
const COUNTS={1:12,2:12,3:14,4:17};
const CHAPTERS={3:[['3.1','Overheidsingrijpen',6],['3.2','Volkomen concurrentie: productie en winst',4],['3.3','Internationale handel',4]],4:[['4.1','Van concurrentie naar monopolie',5],['4.2','Marktvormen en marktfalen',7],['4.3','Arbeidsmarkt',5]]};
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const text=b=>String(b).replace(/\r\n?/g,'\n');
const json=v=>Buffer.from(JSON.stringify(v,null,2)+'\n');
const before=(file,root=ROOT,base=PLATFORM_BASE)=>execFileSync('git',['show',base+':'+file],{cwd:root,maxBuffer:64*1024*1024});
const canonical=v=>Array.isArray(v)?'['+v.map(canonical).join(',')+']':v&&typeof v==='object'?'{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}':JSON.stringify(v);
const TARGET_LINK=`https://github.com/meijer1973/4veco-platform/blob/main/${TRANSPORT}/curriculum/targets/`;
const projectOutline=bytes=>Buffer.from(String(bytes).replaceAll('](../curriculum/targets/',`](${TARGET_LINK}`));
function parseOutline(bytes,book) {
 const original=Buffer.from(String(bytes).replaceAll(`](${TARGET_LINK}`,'](../curriculum/targets/'));
 if(sha(bytes)!==HASHES[book]&&!(sha(original)===HASHES[book]&&projectOutline(original).equals(bytes)))throw new Error(`Book ${book}: v3 outline byte identity mismatch`);
 const rows=[...text(bytes).matchAll(/^### (\d\.\d\.\d+) (.+)\n([\s\S]*?)(?=^###? |$(?![\s\S]))/gm)].map(m=>{
  const field=name=>{const v=m[3].match(new RegExp('\\*\\*'+name+':\\*\\* ([\\s\\S]*?)(?=\\n\\n|$)'));if(!v)throw new Error(m[1]+': missing '+name);return v[1];};
  return {id:m[1],title:m[2],kind:field('Role').startsWith('Consolidation')?'gemengde_opgaven':'theory',intended_learning:field('Intended learning'),retrieval_and_transfer:field('Retrieval and transfer'),proposed_target_brief:field('Target design brief'),boundary:field('Boundary and review focus'),source_path:`${OUTLINES}/book-${book}-outline.md`};
 });
 const ids=CHAPTERS[book].flatMap(([c,,n])=>Array.from({length:n},(_,i)=>`${c}.${i+1}`));
 if(JSON.stringify(rows.map(r=>r.id))!==JSON.stringify(ids))throw new Error(`Book ${book}: wrong v3 chapter/paragraph counts`);
 return rows;
}
function section(source,start,end,replacement) {
 const a=source.indexOf(start),b=source.indexOf(end,a+start.length);
 if(a<0||b<0)throw new Error('Missing bounded section '+start);
 return source.slice(0,a)+replacement+source.slice(b);
}
function buildV5(original,rows) {
 let out=text(original).replace(PREVIOUS,REVISION).replace('reports/reference-planning/BLUEPRINT-CHANGE-REVIEW-BOOK34-CHAT-20260914.md',REVIEW);
 const link=b=>`https://github.com/meijer1973/4veco-platform/blob/main/${OUTLINES}/book-${b}-outline.md`;
 out=section(out,'### Book 3 -','## Migration Notes',`### Book 3 - Overheidsingrijpen, concurrentie en internationale handel\n\nBook 3 retains 14 paragraphs (6+4+4): intervention, short-run price-taking firm decisions, then qualitative/source-led trade. The limited derivative is taught in 3.2.2; feasible output/profit choice in 3.2.3. Long-run entry/exit and zero economic profit are first assessed in Book 4. Trade does not require monopoly or formal labour productivity/unit-labour-cost calculations. Comparative advantage remains qualitative; no opportunity-cost-ratio algorithm or exchange-ratio bounds. [Adopted Book 3 outline](${link(3)}).\n\n### Book 4 - Monopolie, marktfalen en arbeidsmarkt\n\nBook 4 retains 17 paragraphs in 5+7+5. Chapter 4.1, Van concurrentie naar monopolie, starts with moved long-run competition (4.1.1), followed by monopoly and independent consolidation. Chapter 4.2 retains seven lessons; Chapter 4.3 retains five, ending with mixed labour practice in 4.3.5. The former v2 4.3.5 cao/vakbonden/agreement-policy lesson is deferred, with no later-year ID or time allocation yet. It is not a hidden prerequisite of the new mixed lesson. Tax/subsidy and price-floor methods transfer to externalities and minimum wages; formal productivity/unit-labour-cost calculations first occur in 4.3.1. [Adopted Book 4 outline](${link(4)}).\n\n`);
 const table=b=>`### Book ${b}\n\n| Paragraph | Kind | Title | Target status |\n|---|---|---|---|\n`+rows.filter(r=>r.id.startsWith(b+'.')).map(r=>`| ${r.id} | ${r.kind} | ${r.title} | candidate_review_ready |`).join('\n')+'\n\n';
 out=section(out,'### Book 3\n','## Paragraph Anchors',table(3)+table(4));
 const anchors=rows.map(r=>`### §${r.id} - ${r.title}\n\nSelected structure: ${REVISION}; [adopted outline](${link(r.id[0])}). Target status: candidate_review_ready; independent review remains pending; no inherited approval.\n\nIntended learning: ${r.intended_learning}\n\nRetrieval and transfer (design, not mastery evidence): ${r.retrieval_and_transfer}\n\nBoundary: ${r.boundary}\n`).join('\n');
 out=section(out,'### §3.1.1 -','## Web-Only Test Preparation',anchors+'\n');
 out=out.replace('- The selected v2 trade boundary replaces', '- The retained v2 trade boundary replaces').replaceAll('/blob/codex/import-books34-outlines-20260914/','/blob/main/');
 return out.replace('## Migration Notes\n','## Migration Notes\n\n- The version-qualified [v2-to-v3 migration](https://github.com/meijer1973/4veco-platform/blob/main/references/authored/book-outlines/paragraph-migration-v2-to-v3.csv) controls reused IDs. The 31 supplied targets are filled candidates, never automatic final approvals.\n- Student chapter caps are Book 3: 50/40/40; Book 4: 50/60/50 pages. The five lesson-time questions 3.1.2, 3.1.3, 3.1.5, 4.2.4 and 4.2.5 remain open. No timing certification is implied.\n');
}
function buildV6(original) {
 return text(original).replace(PREVIOUS,REVISION).replace('reports/reference-planning/BLUEPRINT-CHANGE-REVIEW-BOOK34-CHAT-20260914.md',REVIEW)
 .replace('Government intervention, perfect competition, international trade | Familiar market calculations followed by qualitative/source-led trade; no monopoly or formal labour prerequisite.','Government intervention, short-run perfect competition, international trade | Separate limited derivative and output/profit lessons, then qualitative/source-led trade; long-run competition is first assessed in Book 4.')
 .replace('Monopoly, market forms/failure, labour market | Monopoly to welfare, tax/subsidy transfer to externalities, actor/variable bridge and retained labour-equilibrium practice.','Long-run competition, monopoly, market failure, labour market | 5+7+5 lessons; entry/exit before monopoly; tax/subsidy transfer to externalities and retained labour equilibrium. Old cao/vakbonden lesson deferred pending later-year placement and time allocation.')
 .replace('Book 3 ends with trade; Book 4 starts with monopoly.','Book 3 ends with trade; Book 4 starts with long-run competition before monopoly. The v3 redistribution retains 55 Year 1 lessons and the 149/153 arithmetic projection.');
}
function prepareRegistry(previous,module,inputHash) {
 if(previous.structure_revision!==PREVIOUS||module.structure_revision!==REVISION)throw new Error('Unsupported migration revision');
 const result=structuredClone(previous), preserved=previous.exercises.filter(r=>r.module<3);
 if(preserved.length!==24)throw new Error('Expected 24 preserved records');
 result.exercises=[...structuredClone(preserved),...module.records.map(record=>{
  const r=structuredClone(record),pin=r.source_pin,outline=`${OUTLINES}/book-${r.module}-outline.md`;
  r.source_locator={repository:'meijer1973/4veco-lessen',package_root:PACKAGE,student_manuscript:`${PACKAGE}/${pin.student_file}`,answer_manuscript:`${PACKAGE}/${pin.answer_file}`,target_excerpt:`${PACKAGE}/curriculum/target-excerpts/${r.id}.md`,package_record:`${PACKAGE}/curriculum/targets/${r.id}.json`,outline_repository:'meijer1973/4veco-platform',outline_path:outline,asset_path_rule:'Resolve target/answer figure.path and context_html src against package_root in this repository'};
  return r;
 })];
 result.structure_revision=REVISION;result.expected_count_bearing_paragraphs=COUNTS;result.total_count_bearing_paragraphs=55;
 result._schema_doc.record_status='reviewed_final, candidate_review_ready, migrated_from_v4_needs_v5_review, or placeholder_needs_review. A populated candidate is not a placeholder and is not independently approved.';
 result.book34_package_migration={from_structure_revision:PREVIOUS,to_structure_revision:REVISION,lesson_package_root:PACKAGE,preserved_books12_canonical_sha256:sha(canonical(preserved)),candidate_count:31,approval_conferred:false,repository_migration_required:false,input_registry_sha256:inputHash,previous_registry_snapshot:`${SNAPSHOT}/${REGISTRY}`,source_commit:PLATFORM_BASE,integration_status:'prepared_in_pr'};
 return result;
}
function plan(inputs,root=ROOT,lessons=path.resolve(root,'../4veco-lessen')) {
 const outputs=new Map(),lessonOutputs=new Map(),read=f=>fs.readFileSync(path.join(inputs,f));
 if(sha(read('MANIFEST.sha256.json'))!==MANIFEST_SHA)throw new Error('Unexpected delivery manifest');
 const manifest=JSON.parse(read('MANIFEST.sha256.json'));
 for(const f of manifest.files){const b=read(f.path);if(b.length!==f.bytes||sha(b)!==f.sha256)throw new Error('Changed delivery '+f.path);}
 const rows=[3,4].flatMap(b=>parseOutline(read(`outlines/book-${b}-outline-v3.md`),b));
 const archived=[REGISTRY,V5,V5.replace('.md','.meta.json'),V6,V6.replace('.md','.meta.json'),...execFileSync('git',['ls-tree','-r','--name-only',PLATFORM_BASE,'--',OUTLINES],{cwd:root,encoding:'utf8'}).trim().split('\n')];
 const inventory=[];
 for(const f of archived){const b=before(f,root);outputs.set(`${SNAPSHOT}/${f}`,b);inventory.push({repository:'meijer1973/4veco-platform',path:f,snapshot:`${SNAPSHOT}/${f}`,source_commit:PLATFORM_BASE,sha256:sha(b)});}
 const old=before(REGISTRY,root),registry=prepareRegistry(JSON.parse(old),JSON.parse(read('curriculum/course-target-exercises-books34-v3.json')),sha(old));
 outputs.set(REGISTRY,json(registry));outputs.set(V5,Buffer.from(buildV5(before(V5,root),rows)));outputs.set(V6,Buffer.from(buildV6(before(V6,root))));
 for(const b of [3,4]){
  outputs.set(`${OUTLINES}/book-${b}-outline.md`,projectOutline(read(`outlines/book-${b}-outline-v3.md`)));
  outputs.set(`${OUTLINES}/book-${b}-outline.meta.json`,json({schema_version:1,source_id:`authored:book-${b}-outline`,book:b,version:'v3',structure_revision:REVISION,original_date:'2026-09-15',original_sha256:HASHES[b],current_status:'owner_selected_structural_baseline',selected_on:'2026-09-17',selection_task:TASK,integration_status:'prepared_in_pr',target_approval:'not_conferred',companion_acceptance:'not_conferred',current_source:`${OUTLINES}/book-${b}-outline.md`,change_review:REVIEW,selected_input_manifest:`${PACKAGE}/MANIFEST.sha256.json`,previous_snapshot:`${SNAPSHOT}/${OUTLINES}/book-${b}-outline.md`,paragraph_count:COUNTS[b],chapters:CHAPTERS[b].map(([id,title,n])=>({id,title,paragraph_count:n})),student_chapter_page_caps:b===3?[50,40,40]:[50,60,50],actual_student_chapter_pages:b===3?[48,34,38]:[48,60,44],paragraphs:rows.filter(r=>r.id.startsWith(b+'.'))}));
 }
 for(const b of [3,4]){
  const file=`${OUTLINES}/book-${b}-outline.meta.json`,meta=JSON.parse(outputs.get(file));
  meta.current_sha256=sha(outputs.get(`${OUTLINES}/book-${b}-outline.md`));
  meta.technical_projection='Only target-record hyperlinks resolve to the immutable platform transport, available before the lesson projection is activated. Original outline bytes and lesson content ownership remain unchanged.';
  outputs.set(file,json(meta));
 }
 for(const f of ['paragraph-migration-v2-to-v3.csv','book34-v3-decision-and-migration.md'])outputs.set(`${OUTLINES}/${f}`,read('outlines/'+f));
 for(const file of [V5,V6]){
  const mp=file.replace('.md','.meta.json'),meta=JSON.parse(before(mp,root));
  meta.structure_revision=REVISION;meta.structural_change_record=REVIEW;meta.previous_snapshot=`${SNAPSHOT}/${file}`;
  if(meta.current_year_1_structure_revision)meta.current_year_1_structure_revision=REVISION;
  outputs.set(mp,json(meta));
 }
 const lb=before('course_blueprint_v5.md',lessons,LESSON_BASE);
 lessonOutputs.set(`${SNAPSHOT}/course_blueprint_v5.md`,lb);lessonOutputs.set('course_blueprint_v5.md',outputs.get(V5));
 inventory.push({repository:'meijer1973/4veco-lessen',path:'course_blueprint_v5.md',snapshot:`${SNAPSHOT}/course_blueprint_v5.md`,source_commit:LESSON_BASE,sha256:sha(lb)});
 // These are additional versioned copies, not relocations of active paths.
 // Preserve the legacy one-source relocation registry for trusted-main readers;
 // the exact version-qualified snapshot manifest below owns their provenance.
 outputs.set('archive/relocations.json',before('archive/relocations.json',root,PLATFORM_BASE));
 lessonOutputs.set('archive/relocations.json',before('archive/relocations.json',lessons,LESSON_BASE));
 outputs.set(`${SNAPSHOT}/snapshot-manifest.json`,json({schema_version:1,task:TASK,files:inventory}));
 outputs.set(`${OUTLINES}/books34-v3-integration.json`,json({schema_version:1,task:TASK,revision:REVISION,delivery_id:manifest.delivery_id,platform_base:PLATFORM_BASE,lesson_base:LESSON_BASE,package_root:PACKAGE,received_zip_sha256:ZIP_SHA,manifest_sha256:MANIFEST_SHA,file_count:814,registry_input_sha256:sha(old),book12_records_sha256:sha(canonical(registry.exercises.filter(r=>r.module<3))),integration_status:'prepared_in_pr',target_approval:'not_conferred',authority_source_transitions:[V5,V6,REGISTRY].map(f=>({path:f,before_sha256:sha(text(before(f,root))),after_sha256:sha(text(outputs.get(f)))}))}));
 const evidencePath=`${OUTLINES}/books34-v3-integration.json`,evidence=JSON.parse(outputs.get(evidencePath));
 evidence.immutable_transport={repository:'meijer1973/4veco-platform',package_root:TRANSPORT,manifest_sha256:MANIFEST_SHA,file_count:814,
  content_owner_repository:'meijer1973/4veco-lessen',primary_for_target_retrieval:true,
  accepted_lesson_states:['legacy-v2-projection','v3-projection'],active_curriculum_in_both_states:REVISION};
 outputs.set(evidencePath,json(evidence));
 return {outputs,lessonOutputs,rows};
}
function apply(outputs,root,base) {
 for(const [f,b] of outputs){const dest=path.join(root,f);if(fs.existsSync(dest)&&!fs.readFileSync(dest).equals(b)){
  let old;try{old=before(f,root,base);}catch{throw new Error('Existing nonbaseline output '+f);}
  if(text(fs.readFileSync(dest))!==text(old))throw new Error('Concurrent edit '+f);
 }fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,b);}
}
if(require.main===module){const args=process.argv.slice(2),i=args.indexOf('--inputs');if(i<0)throw new Error('Required --inputs <package> [--apply]');const p=plan(path.resolve(args[i+1]));if(args.includes('--apply')){apply(p.outputs,ROOT,PLATFORM_BASE);apply(p.lessonOutputs,path.resolve(ROOT,'../4veco-lessen'),LESSON_BASE);}console.log(JSON.stringify({task:TASK,platform_files:p.outputs.size,lesson_files:p.lessonOutputs.size,paragraphs:p.rows.length,applied:args.includes('--apply')}));}
module.exports={ROOT,REVISION,PREVIOUS,TASK,PACKAGE,TRANSPORT,PLATFORM_BASE,LESSON_BASE,SNAPSHOT,OUTLINES,REGISTRY,V5,V6,REVIEW,MANIFEST_SHA,ZIP_SHA,HASHES,COUNTS,CHAPTERS,sha,text,json,canonical,before,parseOutline,prepareRegistry,buildV5,buildV6,plan};
