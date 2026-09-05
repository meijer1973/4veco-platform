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
const previousPlanRun=cp.spawnSync('git',['show',`80977d94dcf3705841b6541b7cde1ee91dd767ee:${planPath}`],{cwd:lessons,encoding:'utf8'});
assert.equal(previousPlanRun.status,0);
const previousPlan=previousPlanRun.stdout.replace(/\r\n?/g,'\n');
const section=(text,start,end)=>text.slice(text.indexOf(start),text.indexOf(end));
assert.equal(section(plan,'## Book foundation check','## Part A backward-design plan'),section(previousPlan,'## Book foundation check','## Part A backward-design plan'),'Foundation/holds/prerequisites must remain unchanged');
assert.equal(section(plan,'## Part A backward-design plan','### Textbook visuals and answer model').replace('Core plus support is **64 minutes**; all items total **76–80 minutes**. ',''),section(previousPlan,'## Part A backward-design plan','### Textbook visuals and answer model'),'Economics/goals/target/exercises/bonus must remain unchanged except explicit total-time arithmetic');
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
const alts = plan.split('\n').filter(l => /^\| `2\.3\.1_(fig|we|ex)_/.test(l)).map(l => {
  const cells = l.split('|').map(c => c.trim());
  const alt = cells[3];
  assert(alt.length > 0 && alt.length <= 120, alt);
  assert(/^(Betalingsbereidheid|Assen|Vraaglijn|Consumentensurplus)\b/.test(alt), alt);
  return { stem: cells[1].replaceAll('`',''), role:cells[2], alt, characters: alt.length };
});
assert.equal(alts.length, 15);
assert.equal(new Set(alts.map(a=>a.stem)).size,15);
const nativePath='scripts/validate-paragraph.js';
const nativeText=read(path.join(platform,nativePath));
const nativeBaseline=cp.spawnSync('git',['show',`788145fbdbb8731c8dd7d836a07cf259932780e2:${nativePath}`],{cwd:platform,encoding:'utf8'});
assert.equal(nativeBaseline.status,0);
assert.equal(nativeText,nativeBaseline.stdout.replace(/\r\n?/g,'\n'));
const grammarStart=nativeText.indexOf('  const SURFACE_SUFFIX_SRC =');
const grammarEnd=nativeText.indexOf('  for (const base of referencedBases)',grammarStart);
assert(grammarStart>=0&&grammarEnd>grammarStart);
const grammar=nativeText.slice(grammarStart,grammarEnd);
const nativeRegex=new Function('parNr',grammar+'; return assetPattern;')('2.3.1');
const proposedNames=alts.flatMap(a=>['svg','png'].map(ext=>`${a.stem}.${ext}`));
assert.equal(proposedNames.length,30);
for(const file of proposedNames)assert(nativeRegex.test(file),file);
const roleMap=[['start_2','ex_1'],['guided_3','ex_2'],['guided_4','ex_3'],['answer_2','ex_4'],['answer_3','ex_5'],['answer_4','ex_6'],['answer_5','ex_7'],['answer_6','ex_8'],['answer_7','ex_9'],['target_answer','ex_10']];
for(const [oldStem,newStem]of roleMap){assert(plan.includes('`2.3.1_'+oldStem+'` | `2.3.1_'+newStem+'`'));assert(alts.some(a=>a.stem==='2.3.1_'+newStem));}
assert(alts.filter(a=>/^2\.3\.1_ex_(4|5|6|7|8|9|10)$/.test(a.stem)).every(a=>/answer/i.test(a.role)));
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
  const vertexPixels=vertexQPrice.map(([x,y])=>[160+880*x/qMax,650-450*y/a]);
  return {id, inverse_demand:{a,b},given_price:p,qd:q,qmax:qMax,cs_euros:cs,payment_euros:p*q,model_wtp_euros:p*q+cs,vertexQPrice,vertexPixels};
});
const coreParts = [2,9,7,2,4,3,8,7,10];
assert.equal(coreParts.reduce((a,b)=>a+b),52);
const initial=[18,14,10].reduce((sum,v)=>sum+v-10,0);
const changed=[14,10,6].reduce((sum,v)=>sum+v-6,0);
assert.equal(initial,12); assert.equal(changed,12);
assert(!plan.includes('10→8'));
assert(plan.includes('64 minutes')&&plan.includes('76–80 minutes'));
const metricCode=String.raw`import json
from PIL import ImageFont
f=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',40)
texts=['Consumentensurplus','Betalingsbereidheid','P (€ per kaartje)','Q (kaartjes)','100','20','18','14','10','6','8','4','Vraaglijn','P=20','CS','Betaling','(0, 50)   (100, 0)   (60, 20)','Basis: 40 kaartjes; hoogte: 20 €/kaartje','Deelnemer','Gekocht: 1, 2 en 3; niet gekocht: 4']
print(json.dumps({t:f.getbbox(t,anchor='ls') for t in texts},ensure_ascii=False))`;
const metricRun=cp.spawnSync('C:/Python314/python.exe',['-c',metricCode],{cwd:platform,encoding:'utf8',env:{...process.env,PYTHONIOENCODING:'utf-8'}});
assert.equal(metricRun.status,0,metricRun.stderr);
const metrics=JSON.parse(metricRun.stdout);
const box=(text,x,y,anchor='left')=>{const m=metrics[text];assert(m,text);const shift=anchor==='centre'?m[2]/2:anchor==='right'?m[2]:0;return [x+m[0]-shift,y+m[1],x+m[2]-shift,y+m[3]];};
const inside=(rect,bounds,gap=0)=>rect[0]>=bounds[0]+gap&&rect[1]>=bounds[1]+gap&&rect[2]<=bounds[2]-gap&&rect[3]<=bounds[3]-gap;
const fixedLabels=[
 ['title',box('Consumentensurplus',600,60,'centre'),[80,20,1120,80]],
 ['P_unit',box('P (€ per kaartje)',160,135),[160,95,1040,155]],
 ['max_Q_tick',box('100',1040,715,'centre'),[1000,680,1080,735]],
 ['Q_unit',box('Q (kaartjes)',600,775,'centre'),[160,745,1040,800]],
 ['target_coordinates',box('(0, 50)   (100, 0)   (60, 20)',600,845,'centre'),[80,810,1120,875]],
 ['guided_lengths',box('Basis: 40 kaartjes; hoogte: 20 €/kaartje',600,845,'centre'),[80,810,1120,875]],
 ['demand_label',box('Vraaglijn',441.6,299),[435,260,615,320]],
 ['discrete_title',box('Betalingsbereidheid',600,60,'centre'),[80,20,1120,80]],
 ['discrete_categories',box('Deelnemer',600,775,'centre'),[160,745,1040,800]],
 ['discrete_purchase_footer',box('Gekocht: 1, 2 en 3; niet gekocht: 4',600,845,'centre'),[80,810,1120,875]]
].map(([id,ink,reserved])=>{assert(inside(ink,reserved),id);return{id,ink,reserved};});
for(const [text,x,y,top]of [['18',280,233,245],['14',480,323,335],['10',680,413,425],['6',880,503,515]]){
 const ink=box(text,x,y,'centre');assert(inside(ink,[x-50,top-60,x+50,top-8]));fixedLabels.push({id:'WTP_'+text,ink,reserved:[x-50,top-60,x+50,top-8]});
}
for(const [text,x,y,top]of [['8',280,349,245],['4',480,394,335]]){
 const ink=box(text,x,y,'centre');assert(inside(ink,[x-50,top,x+50,425],8));fixedLabels.push({id:'bought_gap_'+text,ink,reserved:[x-50,top,x+50,425]});
}
const tickSteps=[[20,10],[5,5],[8,4],[10,5],[8,4],[10,5],[12,6],[14,7],[20,10]];
models.forEach((m,i)=>{const [qstep,pstep]=tickSteps[i];assert.equal(m.qmax%qstep,0);assert.equal(m.inverse_demand.a%pstep,0);assert.equal(m.qd%qstep,0);assert.equal(m.given_price%pstep,0);assert(880*qstep/m.qmax>=146);assert(450*pstep/m.inverse_demand.a>=75);m.tickSteps={q:qstep,p:pstep};});
const labelClearances=models.map(m=>{
 const ratio=m.qd/m.qmax,priceY=650-450*m.given_price/m.inverse_demand.a;
 const csBox=box('CS',160+880*.18*ratio,650-450*(m.given_price+.38*(m.inverse_demand.a-m.given_price))/m.inverse_demand.a,'centre');
 const demandAtRight=200+(csBox[2]-160)*450/880;
 assert(csBox[0]>=168&&csBox[2]<=160+880*ratio-8&&csBox[1]>=demandAtRight+8&&csBox[3]<=priceY-8,m.id+' CS box');
 const paymentBox=box('Betaling',160+880*.30*ratio,650-450*.45*m.given_price/m.inverse_demand.a,'centre');
 assert(inside(paymentBox,[160,priceY,160+880*ratio,650],8),m.id+' payment box');
 const priceBox=box('P=20',1060,priceY+14);assert(inside(priceBox,[1055,200,1180,650]),m.id+' price label');
 return{id:m.id,csBox,paymentBox,priceBox,cs_demand_clearance:csBox[1]-demandAtRight,cs_price_clearance:priceY-csBox[3]};
});
const layout={canvas:[1200,900],plot:[160,200,1040,650],source_font:'Arial regular 30pt',source_css_px:40,print_width_mm:166,print_height_mm:124.5,printed_font_pt:40*(166*72/25.4)/1200,minimum_width_mm_for_12pt:1200*12/40*25.4/72,font_file_raw_sha256:sha(fs.readFileSync('C:/Windows/Fonts/arial.ttf')),metrics,fixedLabels,labelClearances,probe_command:{exe:'C:/Python314/python.exe',args:['-c',metricCode],exit_code:metricRun.status,stdout:metricRun.stdout,stderr:metricRun.stderr},acceptance:'PLANNING_METRICS_ONLY; no SVG, PNG, HTML or PDF created or visually accepted'};
assert(layout.printed_font_pt>=12);assert.equal(layout.minimum_width_mm_for_12pt,127);
const requiredContract=['--lesson-root','--proof-root','--proof-suffix','--manifest','C:/Python314/python.exe','--profile student-web','--profile publisher-print','pages_inspected=[]','inspection_status=PENDING','visible_student_defects=null','raw SHA-256','CRC','all42 packet files','globally unused positive rN','reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/'];
for(const term of requiredContract)assert(plan.includes(term),term);
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
const result={kind:'planning_r2_correction_checks_only',date:'2026-09-05',builder:'paragraph_231_builder',plan_path:planPath,plan_sha256_canonical_lf:sha(plan),source_pins:pins,target_record_sha256:sha(JSON.stringify(target)),exact_goals:4,target_points:[2,3,2,3,2],planned_image_alts:alts,native_name_check:{validator:nativePath,unchanged_since:'788145fbdbb8731c8dd7d836a07cf259932780e2',validator_canonical_lf_sha256:sha(nativeText),actual_regex:nativeRegex.toString(),proposedNames,all30_pass:true,roleMap,student_answer_surface_check:'Plan roles only; actual MD/HTML reference checks mandatory after production'},planned_model_calculations:models,layout,core_minutes:52,core_plus_support_minutes:64,all_items_minutes:[76,80],core_timing_status:'UNOBSERVED_ESTIMATE',bonus_discrete_cs:{initial,changed},requiredContract,commands,plan_selfcheck:'PASS',independent_plan_review:'R2_RECHECK_PENDING; v1 REVISE preserved',production:'NOT_STARTED',visual_inspection:'NOT_PERFORMED',classroom_attainment:'UNOBSERVED'};
console.log(JSON.stringify(result,null,2));
if(commands.some(r=>r.exit_code!==0))process.exitCode=1;
