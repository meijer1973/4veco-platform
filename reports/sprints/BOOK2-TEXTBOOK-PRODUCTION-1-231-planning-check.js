// Read-only plan verification. This is planning evidence, not a paragraph builder.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cp = require('child_process');
const assert = require('assert/strict');
const platform = path.resolve(__dirname, '../..');
const lessons = path.resolve(platform, '../4veco-lessen');
const book = 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus';
const chapter = `${book}/2.3 Hoofdstuk Surplus en welvaart`;
const planPath = `${chapter}/2.3.1 Consumentensurplus/2.3.1-textbook-plan.md`;
const read = p => fs.readFileSync(p, 'utf8').replace(/\r\n?/g, '\n');
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const plan = read(path.join(lessons, planPath));
const registry = JSON.parse(read(path.join(platform, 'references/authored/course-target-exercises.json')));
const records = registry.exercises.filter(r => r.id === '2.3.1');
assert.equal(records.length, 1);
const target = records[0];
assert.equal(sha(JSON.stringify(target)), 'a385e00b2fffea168089c32f796668e51ae45cb325504644392f79b20bde8571');
assert.equal(target.lesson_goals.length, 4);
for (const goal of target.lesson_goals) assert(plan.includes(goal), `Missing exact goal: ${goal}`);
assert(plan.includes(target.target_exercise.context));
for (const q of target.target_exercise.subquestions) assert(plan.includes(q.prompt));
assert.deepEqual(target.target_exercise.subquestions.map(q => q.points), [2, 3, 2, 3, 2]);
const pins = [
  [lessons, `${book}/_book-plan.md`, 'b6ae8e07e05337838dc38b2838a6e5db43b2e153569fa5bc490cf4bfeb8d7a76'],
  [lessons, `${chapter}/_chapter-plan.md`, 'e8a07bfe212a6ae817db99fecb93e86812e1d9e9af533b7ef21591bbb9025dc7'],
  [platform, 'references/owned/course-blueprint-v6-three-year.md', '72fb1bc8c7b4843ac5cf4c29acfb9d117b6118eeaa1cd5fe5229604dfe412e6e'],
  [platform, 'references/owned/course-blueprint-v5.md', '61130f10e7b8b6417641436f0995be090db04b11075d02878ae0a51c12b497c7'],
  [platform, 'references/authored/course-target-exercises.json', 'd3d7163ad82e0ddcf2f9ae1cbfa653335c96cb46762e8125bd594583f5d5885e'],
].map(([root, file, expected]) => {
  const actual = sha(read(path.join(root, file))); assert.equal(actual, expected, file);
  return { repository: root === lessons ? 'lessons' : 'platform', file, sha256_canonical_lf: actual };
});
const packagePath = 'references/data/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1.candidates.json';
const packageText = read(path.join(platform, packagePath));
const packageHash = sha(JSON.stringify(JSON.parse(packageText)));
assert.equal(packageHash, '914d1a39f18f8f9b7cf7fad938d2c42f9c2bc19671d94c24be151b1da0371310');
pins.push({repository:'platform',file:packagePath,sha256_json_stringify_ordered_array:packageHash,sha256_canonical_lf:sha(packageText)});
const headings = ['Book foundation check', 'Authority, outline, chapter, and target pins', 'Canonical paragraph semantics', 'Open holds and current-action effect', 'Foundation verdict', 'Part A backward-design plan', 'Goals and target route', 'Exercise, explanation, and worked-example sequence', 'Textbook visuals and answer model', 'Part A review and Part B handoff'];
let previous = -1;
for (const h of headings) { const i = plan.indexOf(h); assert(i > previous, h); previous = i; }
const types = ['previously_taught_probably_secure', 'previously_taught_retrieval_required', 'previously_taught_not_secure_enough_to_assume', 'preview_or_familiarity_only', 'new_formal_learning'];
for (const type of types) assert(plan.includes(type));
const alts = plan.split('\n').filter(l => /^\| `2\.3\.1_(fig|we|start|guided|answer|target)/.test(l)).map(l => {
  const cells = l.split('|').map(c => c.trim());
  const alt = cells[3];
  assert(alt.length > 0 && alt.length <= 120, alt);
  assert(/^(Betalingsbereidheid|Assen|Vraaglijn|Consumentensurplus)\b/.test(alt), alt);
  return { stem: cells[1], alt, characters: alt.length };
});
assert.equal(alts.length, 15);
const models = [
 ['theory_book_fair',40,.5,10,60,900],['worked_museum',30,1,10,20,200],
 ['start_aquarium',24,.5,8,32,256],['guided_garden',30,.5,10,40,400],
 ['guided_climbing',24,.5,12,24,144],['guided_boardgame',20,.5,5,30,225],
 ['independent_skate',36,.5,12,48,576],['independent_language',28,.5,14,28,196],
 ['target_concert',50,.5,20,60,900]
].map(([id,a,b,p,qExpected,csExpected]) => {
  const q=(a-p)/b, cs=.5*q*(a-p), qMax=a/b;
  assert.equal(q,qExpected); assert.equal(cs,csExpected); assert.equal(a-b*q,p);
  const vertexQPrice=[[0,a],[0,p],[q,p]];
  const vertexPixels=vertexQPrice.map(([x,y])=>[80+600*x/qMax,310-265*y/a]);
  return {id, inverse_demand:{a,b},given_price:p,qd:q,qmax:qMax,cs_euros:cs,payment_euros:p*q,model_wtp_euros:p*q+cs,vertexQPrice,vertexPixels};
});
const coreParts = [2,9,7,2,4,3,8,7,10];
assert.equal(coreParts.reduce((a,b)=>a+b),52);
const initial=[18,14,10].reduce((sum,v)=>sum+v-10,0);
const changed=[14,10,6].reduce((sum,v)=>sum+v-6,0);
assert.equal(initial,12); assert.equal(changed,12);
assert(!plan.includes('10→8'));
const commands=[
 'npm.cmd run check:book-outline-currentness',
 'npm.cmd run check:book-outline-currentness -- --action specialist_review --paragraph 2.3.1',
 'npm.cmd run check:book-outline-currentness -- --require-approved',
 'npm.cmd run check:book-outline-currentness -- --require-approved --action paragraph_production --paragraph 2.3.1',
 'node build-scripts/workflows/check-book2-target-authority-remediation.js --durable',
 'git diff --check'
].map(command => {
 const r=cp.spawnSync(command,{cwd:platform,shell:true,encoding:'utf8'});
 return {command,exit_code:r.status,stdout:r.stdout,stderr:r.stderr};
});
const result={kind:'planning_checks_only',date:'2026-09-05',builder:'paragraph_231_builder',plan_path:planPath,plan_sha256_canonical_lf:sha(plan),source_pins:pins,target_record_sha256:sha(JSON.stringify(target)),exact_goals:4,target_points:[2,3,2,3,2],planned_image_alts:alts,planned_model_calculations:models,core_minutes:52,core_timing_status:'UNOBSERVED_ESTIMATE',bonus_discrete_cs:{initial,changed},commands,plan_selfcheck:'PASS',independent_plan_review:'PENDING',production:'NOT_STARTED',visual_inspection:'NOT_PERFORMED',classroom_attainment:'UNOBSERVED'};
console.log(JSON.stringify(result,null,2));
if(commands.some(r=>r.exit_code!==0))process.exitCode=1;
