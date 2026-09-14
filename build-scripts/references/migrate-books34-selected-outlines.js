#!/usr/bin/env node
'use strict';
/**
 * BOOK34-CHAT-IMPORT-OUTLINES-1: versioned authored/owned-source migration.
 * HOW TO ADAPT: this fixed migration is bound to the reviewed pre-change source
 * commit and selected outline hashes. Do not repurpose it for target approval.
 * Use --inputs <handoff-package> --apply; default is a read-only plan.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '../..');
const LESSONS = path.resolve(ROOT, '../4veco-lessen');
const REVISION = 'book34-chat-v2-20260914';
const TASK = 'BOOK34-CHAT-IMPORT-OUTLINES-1';
const PLATFORM_BASE = '7f1393d1f9db365ca5e129c0f2728844be47e08a';
const LESSON_BASE = 'e1712a214a6e2e11dd36758f033ea35f0264f584';
const OUTLINES = 'references/authored/book-outlines';
const SNAPSHOT = 'archive/blueprints/book34-pre-chat-2026';
const REGISTRY = 'references/authored/course-target-exercises.json';
const V5 = 'references/owned/course-blueprint-v5.md';
const V6 = 'references/owned/course-blueprint-v6-three-year.md';
const COUNTS = { 1: 12, 2: 12, 3: 14, 4: 17 };
const HASHES = {
  3: '4e558b63d8eb954de935ad366170f6373f533eae14f90633a89be0036c973217',
  4: '3bfb4350bb1f990a8ea559272263e8ef35e1b72bd0cbc86b59c9aa6ad4fc0899',
};
const CHAPTERS = {
  3: [['3.1','Overheidsingrijpen',6],['3.2','Volkomen concurrentie',4],['3.3','Internationale handel',4]],
  4: [['4.1','Monopolie',4],['4.2','Marktvormen en marktfalen',7],['4.3','Arbeidsmarkt',6]],
};
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const canonicalHash = value => sha(JSON.stringify(value));
const git = (root, args) => execFileSync('git', args, {cwd:root, maxBuffer:16*1024*1024});
const before = (file, root=ROOT, commit=PLATFORM_BASE) => git(root, ['show', `${commit}:${file}`]);
const text = bytes => bytes.toString('utf8').replace(/\r\n?/g,'\n');
const json = value => Buffer.from(JSON.stringify(value,null,2)+'\n');
const replaceRequired = (source, old, next) => {
  if (!source.includes(old)) throw new Error(`Missing source fragment: ${old.slice(0,80)}`);
  return source.replace(old,next);
};

function parseOutline(bytes, book) {
  if (sha(bytes) !== HASHES[book]) throw new Error(`Wrong selected Book ${book} outline`);
  const source = text(bytes);
  const matches = [...source.matchAll(/^### ([34]\.\d\.\d+) (.+)\n([\s\S]*?)(?=^### |^## |$(?![\s\S]))/gm)];
  const paragraphs = matches.map(m => {
    const fields = Object.fromEntries([...m[3].matchAll(/^\*\*([^*]+):\*\* ([\s\S]*?)(?=\n\n\*\*|\n*$)/gm)].map(f=>[f[1],f[2].trim()]));
    return {id:m[1], title:m[2], kind:fields.Role?.startsWith('Consolidation')?'gemengde_opgaven':'theory',
      intended_learning:fields['Intended learning'], retrieval_and_transfer:fields['Retrieval and transfer'],
      proposed_target_brief:fields['Proposed target brief'], boundary:fields['Boundary and review focus'],
      source_path:`${OUTLINES}/book-${book}-outline.md`};
  });
  const expected=CHAPTERS[book].flatMap(([id,,count])=>Array.from({length:count},(_,i)=>`${id}.${i+1}`));
  if (JSON.stringify(paragraphs.map(p=>p.id))!==JSON.stringify(expected)) throw new Error(`Wrong Book ${book} outline IDs`);
  for (const p of paragraphs) if (!p.intended_learning || !p.retrieval_and_transfer || !p.boundary) throw new Error(`Incomplete outline: ${p.id}`);
  return paragraphs;
}

function historicalMappings(id) {
  if (/^3\.[12]\./.test(id)) return [{id,disposition:'retain_structure_no_target_equivalence_claim'}];
  if (id.startsWith('4.1.')) return [{id:id.replace('4.1.','3.3.'),disposition:'monopoly_chapter_move'}];
  if (id.startsWith('4.2.')) return [{id:id.replace('4.2.','4.1.'),disposition:'market_failure_chapter_move'}];
  if (id==='3.3.1') return ['4.3.1','4.3.2'].map(id=>({id,disposition:'qualitative_overlap_only_no_numerical_advantage_or_exchange_ratio'}));
  if (id.startsWith('3.3.')) return [];
  const map={'4.3.1':['4.2.1'],'4.3.2':['4.2.2','4.2.3'],'4.3.3':['4.2.4','4.2.3'],'4.3.4':['4.2.5','4.2.3'],'4.3.5':['4.2.6'],'4.3.6':['4.2.7','4.2.3']};
  return (map[id]||[]).map(old=>({id:old,disposition:old==='4.2.3'?'absorbed_equilibrium_operation':'labour_move_or_expansion_no_target_equivalence_claim'}));
}

function buildRecord(p, oldRegistry) {
  const [module,chapter,paragraph]=p.id.split('.').map(Number);
  const historical = historicalMappings(p.id).map(ref=>{
    const index=oldRegistry.exercises.findIndex(r=>r.id===ref.id);
    if (index<0) throw new Error(`Missing old target ${ref.id}`);
    return {...ref, source_revision:'live-v5-before-BOOK34-CHAT-IMPORT-OUTLINES-1',
      source_commit:PLATFORM_BASE, path:`${SNAPSHOT}/course-target-exercises.json`,
      json_pointer:`/exercises/${index}`, record_sha256:canonicalHash(oldRegistry.exercises[index]),
      target_equivalence:false, inherits_approval:false};
  });
  return {id:p.id,module,chapter,paragraph,paragraph_title:p.title,paragraph_kind:p.kind,
    introduces_new_theory:p.kind!=='gemengde_opgaven',record_status:'placeholder_needs_review',
    source_ref:`${V5} §${p.id}`, structure_revision:REVISION,
    source_identity:{revision:REVISION,paragraph_id:p.id,outline:p.source_path},
    difficulty:'PLACEHOLDER',placeholder_reason:'Owner-selected structural record; target exercise is not approved by structural adoption.',
    target_exercise:{placeholder:true,context:`Structural placeholder for ${p.id}; the selected outline supplies a proposed brief, not a reviewed target.`,subquestions:[]},
    lesson_goals:[p.intended_learning],required_skills:[],prior_knowledge_assumed:[],new_skills_introduced:[],exam_codes:[],
    missing_units_flagged:['book34_selected_structure_target_review_pending'],
    structural_retrieval_plan:p.retrieval_and_transfer,structural_scope_boundary:p.boundary,
    historical_source_refs:historical,
    v5_migration:{source_status:'placeholder_needs_review',review_required_before_final:true,structural_revision:REVISION}};
}

function buildV5(original, paragraphs) {
  let out=text(original);
  out=replaceRequired(out,'Version: v5','Version: v5\nStructural revision: `'+REVISION+'`\nChange review: `reports/reference-planning/BLUEPRINT-CHANGE-REVIEW-BOOK34-CHAT-20260914.md`');
  out=replaceRequired(out,'v5 target-exercise registry has 54 count-bearing records.','The original v5 registry had 54 records; the selected Book 3/4 structural revision now has 55.');
  out=replaceRequired(out,'| Book 4 | 16 |','| Book 4 | 17 |');
  const start=out.indexOf('### Book 3 -'), end=out.indexOf('## Migration Notes');
  out=out.slice(0,start)+`### Book 3 - Overheidsingrijpen, concurrentie en internationale handel\n\nBook 3 has 14 paragraphs (6+4+4): intervention, perfect competition, then explanation/source-led trade. Trade does not require monopoly or formal labour productivity/unit-labour-cost calculations. Comparative advantage is qualitative; no calculated opportunity-cost ratios, specialisation-table algorithm or exchange-ratio bounds. World-price quantities, trade gaps and a short tariff-revenue chain transfer familiar methods. Full selected specification: [Book 3 outline](https://github.com/meijer1973/4veco-platform/blob/codex/import-books34-outlines-20260914/references/authored/book-outlines/book-3-outline.md), with current [adoption metadata](https://github.com/meijer1973/4veco-platform/blob/codex/import-books34-outlines-20260914/references/authored/book-outlines/book-3-outline.meta.json).\n\n### Book 4 - Monopolie, marktfalen en arbeidsmarkt\n\nBook 4 has 17 paragraphs (4+7+6): monopoly, market forms/failure, then labour. Tax/subsidy methods transfer to externalities; price floors transfer to minimum wages. Teach the employer/household, wage and labour-unit bridge. Formal productivity/unit-labour-cost calculations first occur in 4.3.1. Old standalone labour equilibrium is absorbed into 4.3.2 (baseline), 4.3.3 (shifts), 4.3.4 (minimum wage) and 4.3.6 (independent mixed practice). No seventh labour paragraph is added. Full selected specification: [Book 4 outline](https://github.com/meijer1973/4veco-platform/blob/codex/import-books34-outlines-20260914/references/authored/book-outlines/book-4-outline.md), with current [adoption metadata](https://github.com/meijer1973/4veco-platform/blob/codex/import-books34-outlines-20260914/references/authored/book-outlines/book-4-outline.meta.json).\n\n`+out.slice(end);
  out=replaceRequired(out,'- Protectionism beyond the two retained trade paragraphs is parked until the trade/macro boundary is reviewed.','- The selected v2 trade boundary replaces the old two-paragraph trade block. The [version-qualified migration](https://github.com/meijer1973/4veco-platform/blob/codex/import-books34-outlines-20260914/references/authored/book-outlines/migration-live-v5-to-v2.csv) records partial overlap and absorbed operations; numerical IDs alone never establish target equivalence.');
  const table=book=>'### Book '+book+'\n\n| Paragraph | Kind | Title | Target status |\n|---|---|---|---|\n'+paragraphs.filter(p=>p.id.startsWith(book+'.')).map(p=>`| ${p.id} | ${p.kind} | ${p.title} | placeholder_needs_review |`).join('\n')+'\n\n';
  out=out.slice(0,out.indexOf('### Book 3\n'))+table(3)+table(4)+out.slice(out.indexOf('## Paragraph Anchors'));
  const anchors=paragraphs.map(p=>`### §${p.id} - ${p.title}\n\nSelected structure: ${REVISION}; [original outline](${p.source_path.replace('references/','../')}). Target status: placeholder_needs_review; no inherited approval.\n\nIntended learning: ${p.intended_learning}\n\nRetrieval and transfer (design, not mastery evidence): ${p.retrieval_and_transfer}\n\nBoundary: ${p.boundary}\n`).join('\n');
  out=out.slice(0,out.indexOf('### §3.1.1 -'))+anchors+'\n'+out.slice(out.indexOf('## Web-Only Test Preparation'));
  return out.replace('count toward 12/12/14/16','count toward 12/12/14/17')
    .replaceAll('(../authored/book-outlines/', '(https://github.com/meijer1973/4veco-platform/blob/codex/import-books34-outlines-20260914/references/authored/book-outlines/');
}

function buildV6(original) {
  let out=text(original);
  out=replaceRequired(out,'Version: v6-three-year umbrella','Version: v6-three-year umbrella\nCurrent Year 1 structural revision: `'+REVISION+'`\nChange review: `reports/reference-planning/BLUEPRINT-CHANGE-REVIEW-BOOK34-CHAT-20260914.md`');
  out=replaceRequired(out,'- The final planning count model is 148 count-bearing lessons and 152 scheduled\n  modules/cycles overall.','- The original frozen planning model remains historical evidence at 148 count-bearing lessons and 152 scheduled modules/cycles. The selected Year 1 revision projects 149/153 arithmetically, with Books 5-11 unchanged; it is not a new maturity approval.');
  out=replaceRequired(out,'It covers Books 1-4, 54 count-bearing records, and web-only test prep.','Its selected Book 3/4 structural revision covers Books 1-4, 55 count-bearing records, and web-only test prep.');
  out=replaceRequired(out,'| 3 | Year 1, test week 3 | Government intervention and market structures | Multi-step diagrams, policy instruments, correction-model discipline. |','| 3 | Year 1, test week 3 | Government intervention, perfect competition, international trade | Familiar market calculations followed by qualitative/source-led trade; no monopoly or formal labour prerequisite. |');
  out=replaceRequired(out,'| 4 | Year 1, test week 4 | Market failure, labour market, trade basics | Cumulative micro cases, labour/trade/welfare integration. |','| 4 | Year 1, test week 4 | Monopoly, market forms/failure, labour market | Monopoly to welfare, tax/subsidy transfer to externalities, actor/variable bridge and retained labour-equilibrium practice. |');
  out=replaceRequired(out,'These are the accepted planning counts for the frozen three-year baseline. They\nset the book-level production model;', 'These are the historical accepted counts of the original frozen maturity baseline, retained unchanged as evidence. Current Year 1 uses 12/12/14/17 (55); with all later years unchanged the arithmetic projection is 149/153. These historical counts retain the original production model;');
  // Label historical table notes so no reader treats old Book 4=16 as current.
  out=out.replaceAll('Fixed by active v5.','Original frozen v5 snapshot; current Year 1 revision is listed below.');
  out=replaceRequired(out,'Books 1-4 are inherited from v5:', 'Current Books 1-4 are inherited from the selected v5 structural revision:');
  out=replaceRequired(out,'- Book 4: 16 count-bearing paragraphs.','- Book 4: 17 count-bearing paragraphs.\n\nYear 1 total: 55. Book 3 ends with trade; Book 4 starts with monopoly. The frozen metadata model remains historical; `current_planning_projection` carries the arithmetic 149/153 update. Structural adoption does not approve target exercises or alter the frozen Years 2/3, Book 11, Q19 or production-critical-path decisions.');
  return out;
}

function plan(inputs) {
  const outputs=new Map(), lessonOutputs=new Map();
  const oldRegistry=JSON.parse(before(REGISTRY));
  const paragraphs=[];
  for (const book of [3,4]) {
    const bytes=fs.readFileSync(path.join(inputs,`outlines/book-${book}-outline-v2.md`));
    const rows=parseOutline(bytes,book); paragraphs.push(...rows);
    outputs.set(`${OUTLINES}/book-${book}-outline.md`,bytes);
    outputs.set(`${OUTLINES}/book-${book}-outline.meta.json`,json({schema_version:1,
      source_id:`authored:book-${book}-outline`,book,version:'v2',structure_revision:REVISION,
      original_date:'2026-09-06',original_sha256:HASHES[book],original_status:'revised outline proposal',
      current_status:'owner_selected_structural_baseline',selected_on:'2026-09-14',selection_task:TASK,
      integration_status:'prepared_in_pr',target_approval:'not_conferred',companion_acceptance:'not_conferred',
      current_source:`${OUTLINES}/book-${book}-outline.md`,change_review:'reports/reference-planning/BLUEPRINT-CHANGE-REVIEW-BOOK34-CHAT-20260914.md',
      selected_input_manifest:`${OUTLINES}/books34-input-manifest.json`,
      title_aliases:book===3?['Overheidsingrijpen, concurrentie en internationale handel','Overheidsingrijpen, volkomen concurrentie en internationale handel']:['Monopolie, marktfalen en arbeidsmarkt'],
      original_page_assumption:40,actual_student_chapter_pages:book===3?[48,38,38]:[38,60,50],
      original_proposal_companions_not_supplied:['sources-and-scope.md','integration-handoff-v2.md','paragraph-migration-v1-to-v2.csv'],
      migration_aid:'migration-live-v5-to-v2.csv is newly prepared against live v5, not the historical v1-to-v2 attachment or target equivalence proof.',
      paragraph_count:rows.length,chapters:CHAPTERS[book].map(([id,title,count])=>({id,title,paragraph_count:count})),paragraphs:rows}));
  }
  for (const [source,dest] of [['input-manifest.json','books34-input-manifest.json'],['outlines/migration-live-v5-to-v2.csv','migration-live-v5-to-v2.csv'],['outlines/selected-paragraphs.csv','selected-paragraphs.csv']]) outputs.set(`${OUTLINES}/${dest}`,fs.readFileSync(path.join(inputs,source)));
  const snapshotFiles=[V5,V5.replace('.md','.meta.json'),V6,V6.replace('.md','.meta.json'),REGISTRY];
  const relocations=JSON.parse(before('archive/relocations.json'));
  for (const file of snapshotFiles) {
    const bytes=before(file), archived=`${SNAPSHOT}/${path.posix.basename(file)}`;
    outputs.set(archived,bytes);
    const blob=git(ROOT,['rev-parse',`${PLATFORM_BASE}:${file}`]).toString().trim();
    relocations.entries.push({kind:'snapshot',original_path:file,archived_path:archived,original_blob:blob,final_blob:blob,source_commit:PLATFORM_BASE,topic:'book34-structural-baseline',batch:TASK,current_consumers:[file],live_follow_up:file});
  }
  outputs.set('archive/relocations.json',json(relocations));
  outputs.set(`${SNAPSHOT}/README.md`,Buffer.from(`# Pre-Book 3/4 structural migration\n\nExact source snapshots at platform commit ${PLATFORM_BASE}. These preserve the old chapter identities, all target payloads/evidence, and the frozen maturity model. They are historical; current sources retain their original live paths with explicit revision ${REVISION}. No target approval transfers to a different ID/topic. No original source was deleted.\n`));
  const lessonRelocations=JSON.parse(before('archive/relocations.json',LESSONS,LESSON_BASE));
  const lessonOriginal='course_blueprint_v5.md', lessonArchived=`${SNAPSHOT}/${lessonOriginal}`;
  const lessonBlob=git(LESSONS,['rev-parse',`${LESSON_BASE}:${lessonOriginal}`]).toString().trim();
  lessonOutputs.set(lessonArchived,before(lessonOriginal,LESSONS,LESSON_BASE));
  lessonRelocations.entries.push({kind:'snapshot',original_path:lessonOriginal,archived_path:lessonArchived,original_blob:lessonBlob,final_blob:lessonBlob,source_commit:LESSON_BASE,topic:'book34-structural-baseline',batch:TASK,current_consumers:[lessonOriginal],live_follow_up:lessonOriginal});
  lessonOutputs.set('archive/relocations.json',json(lessonRelocations));
  const registry={...oldRegistry,structure_revision:REVISION,expected_count_bearing_paragraphs:COUNTS,total_count_bearing_paragraphs:55,
    previous_structural_registry:{path:`${SNAPSHOT}/course-target-exercises.json`,source_commit:PLATFORM_BASE,revision:'live-v5-before-BOOK34-CHAT-IMPORT-OUTLINES-1'},
    exercises:[...oldRegistry.exercises.filter(r=>r.module<3),...paragraphs.map(p=>buildRecord(p,oldRegistry))]};
  outputs.set(REGISTRY,json(registry));
  const v5=Buffer.from(buildV5(before(V5),paragraphs));outputs.set(V5,v5);lessonOutputs.set(lessonOriginal,v5);
  const v5meta=JSON.parse(before(V5.replace('.md','.meta.json')));
  Object.assign(v5meta,{structure_revision:REVISION,paragraph_counts:COUNTS,total_count_bearing_paragraphs:55,
    structural_change_record:'reports/reference-planning/BLUEPRINT-CHANGE-REVIEW-BOOK34-CHAT-20260914.md',previous_snapshot:`${SNAPSHOT}/course-blueprint-v5.md`,
    selected_book_outlines:[`${OUTLINES}/book-3-outline.meta.json`,`${OUTLINES}/book-4-outline.meta.json`]});
  outputs.set(V5.replace('.md','.meta.json'),json(v5meta));
  outputs.set(V6,Buffer.from(buildV6(before(V6))));
  const v6meta=JSON.parse(before(V6.replace('.md','.meta.json')));
  v6meta.year_1_counts_from_v5=COUNTS;
  v6meta.current_year_1_structure_revision=REVISION;
  v6meta.structural_change_record='reports/reference-planning/BLUEPRINT-CHANGE-REVIEW-BOOK34-CHAT-20260914.md';
  v6meta.final_planning_count_model_scope='Unchanged historical maturity evidence; use current_planning_projection for the selected Year 1 revision.';
  v6meta.current_planning_projection={...structuredClone(v6meta.final_planning_count_model),status:'arithmetic_projection_of_owner_selected_year_1_revision_not_new_maturity_approval',count_bearing_total:149,scheduled_total:153};
  for (const key of ['count_bearing_by_book','scheduled_by_book']) v6meta.current_planning_projection[key]['4']=17;
  for (const key of ['count_bearing_by_year','scheduled_by_year']) v6meta.current_planning_projection[key]['1']=55;
  outputs.set(V6.replace('.md','.meta.json'),json(v6meta));
  const between=(value,start,end)=>value.slice(value.indexOf(start),value.indexOf(end,value.indexOf(start)));
  const oldV5=text(before(V5)), nextV5=text(v5);
  const slices=[['book_intents','### Book 1 -','### Book 3 -'],['contents','### Book 1\n','### Book 3\n'],['anchors','### §1.1.1 -','### §3.1.1 -'],['core_decisions','## Core Decisions','## What Changed From v4']];
  const preserved=slices.map(([name,start,end])=>{
    const oldSlice=between(oldV5,start,end), nextSlice=between(nextV5,start,end);
    if (!oldSlice || oldSlice!==nextSlice) throw new Error(`Book 1/2 semantic slice changed: ${name}`);
    return {scope:name,sha256:sha(oldSlice)};
  });
  const oldRecords=oldRegistry.exercises.filter(r=>r.module<3);
  if(canonicalHash(oldRecords)!==canonicalHash(registry.exercises.filter(r=>r.module<3))) throw new Error('Book 1/2 target records changed');
  const laterHeading='## Year 2 Final Planning Scope';
  const oldLater=text(before(V6)).split(laterHeading)[1], nextLater=text(outputs.get(V6)).split(laterHeading)[1];
  if(!oldLater || oldLater!==nextLater) throw new Error('Frozen later-year source changed');
  outputs.set(`${OUTLINES}/books34-structure-change.json`,json({schema_version:1,task:TASK,rule:'BLUEPRINT-CHANGE-REVIEW',revision:REVISION,
    owner_decision:'execute_supplied_selected_structure_and_import; no merge or target approval',decision_date:'2026-09-14',
    platform_base:PLATFORM_BASE,lesson_base:LESSON_BASE,book12_target_records_sha256:canonicalHash(oldRecords),preserved_book12_blueprint_slices:preserved,
    preserved_v6_years_2_3_suffix_sha256:sha(oldLater),preserved_frozen_planning_model_sha256:canonicalHash(v6meta.final_planning_count_model),
    authority_source_transitions:[V5,V6,REGISTRY].map(file=>({path:file,before_sha256:sha(text(before(file))),after_sha256:sha(text(outputs.get(file))),snapshot:`${SNAPSHOT}/${path.posix.basename(file)}`})),
    current_counts:COUNTS,current_year1_total:55,frozen_historical_totals:[148,152],current_arithmetic_projection:[149,153],target_promotions:0}));
  return {outputs,lessonOutputs,paragraphs};
}

function apply(outputs,root,base) {
  for (const [file,bytes] of outputs) {
    const dest=path.join(root,file);
    if (fs.existsSync(dest)) {
      const current=fs.readFileSync(dest);
      if (current.equals(bytes)) continue;
      let baseline;
      try { baseline=before(file,root,base); } catch { throw new Error(`Existing non-baseline output: ${file}`); }
      if (text(current)!==text(baseline)) throw new Error(`Unexpected source changes: ${file}`);
    }
    fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes);
  }
}

function main() {
  const i=process.argv.indexOf('--inputs');
  if(i<0 || !process.argv[i+1]) throw new Error('Required: --inputs <handoff-package> [--apply]');
  const result=plan(path.resolve(process.argv[i+1]));
  if(process.argv.includes('--apply')) {apply(result.outputs,ROOT,PLATFORM_BASE);apply(result.lessonOutputs,LESSONS,LESSON_BASE);}
  console.log(JSON.stringify({task:TASK,revision:REVISION,applied:process.argv.includes('--apply'),platform_paths:[...result.outputs.keys()],lesson_paths:[...result.lessonOutputs.keys()],paragraphs:result.paragraphs.length,target_promotions:0},null,2));
}
if(require.main===module) main();
module.exports={REVISION,TASK,PLATFORM_BASE,LESSON_BASE,OUTLINES,SNAPSHOT,COUNTS,HASHES,CHAPTERS,parseOutline,historicalMappings,buildRecord,buildV5,buildV6,plan};
