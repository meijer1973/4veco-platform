// Read-only subject checks; output is review evidence, not student-source logic.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const cp = require('child_process'), assert = require('assert/strict');
const root = path.resolve(__dirname, '../..'), lessons = path.resolve(root, '../4veco-lessen');
const book = 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus';
const chapter = `${book}/2.3 Hoofdstuk Surplus en welvaart`;
const subject = `${chapter}/2.3.1 Consumentensurplus/2.3.1-textbook-plan.md`;
const read = p => fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
const sha = v => crypto.createHash('sha256').update(v).digest('hex');
const run = (exe,args,cwd=root) => {
  const r=cp.spawnSync(exe,args,{cwd,encoding:'utf8',env:{...process.env,PYTHONIOENCODING:'utf-8'},maxBuffer:32*1024*1024});
  return {exe,args,cwd,exit:r.status,stdout:r.stdout,stderr:r.stderr};
};
const git = (ref,file) => {const r=run('git',['show',`${ref}:${file}`]);assert.equal(r.exit,0,r.stderr);return r.stdout.replace(/\r\n?/g,'\n');};
const plan=read(path.join(lessons,subject));
assert.equal(sha(plan),'8d92ed823e96a773a378c74d707c2afa4cd8cb3ee3b8bcba08b217ee5883cac1');
const pins=[
 [lessons,subject,'8d92ed823e96a773a378c74d707c2afa4cd8cb3ee3b8bcba08b217ee5883cac1'],
 [lessons,`${book}/_book-plan.md`,'b6ae8e07e05337838dc38b2838a6e5db43b2e153569fa5bc490cf4bfeb8d7a76'],
 [lessons,`${chapter}/_chapter-plan.md`,'e8a07bfe212a6ae817db99fecb93e86812e1d9e9af533b7ef21591bbb9025dc7'],
 [root,'references/owned/course-blueprint-v6-three-year.md','72fb1bc8c7b4843ac5cf4c29acfb9d117b6118eeaa1cd5fe5229604dfe412e6e'],
 [root,'references/owned/course-blueprint-v5.md','61130f10e7b8b6417641436f0995be090db04b11075d02878ae0a51c12b497c7'],
];
pins.push([root,'references/authored/course-target-exercises.json','d3d7163ad82e0ddcf2f9ae1cbfa653335c96cb46762e8125bd594583f5d5885e']);
const sourcePins=pins.map(([base,file,expected])=>{const actual=sha(read(path.join(base,file)));assert.equal(actual,expected,file);return {repository:base===root?'platform':'lessons',file,canonical_lf_sha256:actual};});
const registry=JSON.parse(read(path.join(root,'references/authored/course-target-exercises.json')));
const target=registry.exercises.filter(r=>r.id==='2.3.1');assert.equal(target.length,1);
const t=target[0];assert.equal(sha(JSON.stringify(t)),'a385e00b2fffea168089c32f796668e51ae45cb325504644392f79b20bde8571');
assert.equal(t.lesson_goals.length,4);for(const value of [...t.lesson_goals,t.target_exercise.context,...t.target_exercise.subquestions.map(q=>q.prompt)])assert(plan.includes(value),value);
assert.deepEqual(t.target_exercise.subquestions.map(q=>q.points),[2,3,2,3,2]);
const frozen=JSON.parse(read(path.join(root,'references/data/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1.candidates.json')));
assert.equal(frozen.length,12);assert.equal(sha(JSON.stringify(frozen)),'914d1a39f18f8f9b7cf7fad938d2c42f9c2bc19671d94c24be151b1da0371310');
const models=[['bookfair',40,.5,10,60,900],['museum',30,1,10,20,200],['retrieval',24,1,8,16,128],['aquarium',24,.5,8,32,256],['garden',30,.5,10,40,400],['climbing',24,.5,12,24,144],['boardgames',20,.5,5,30,225],['skate',36,.5,12,48,576],['cafe',28,.5,14,28,196],['concert',50,.5,20,60,900],['closing',18,.5,6,24,144]].map(([name,a,b,p,expectedQ,expectedCS])=>{
 const q=(a-p)/b, cs=q*(a-p)/2, qmax=a/b;assert.equal(q,expectedQ);assert.equal(cs,expectedCS);assert.equal(a-b*q,p);
 return {name,a,b,p,q,qmax,cs,payment:p*q,modelWTP:p*q+cs,cs_requested:!['retrieval','closing'].includes(name),pixels:[[0,a],[0,p],[q,p]].map(([Q,P])=>[80+600*Q/qmax,310-265*P/a])};
});
const assets=plan.split('\n').filter(l=>/^\| `2\.3\.1_/.test(l)).map(l=>{const c=l.split('|').map(s=>s.trim());return {stem:c[1].replaceAll('`',''),alt:c[3],alt_length:c[3].length};});
assert.equal(assets.length,15);assert.equal(new Set(assets.map(a=>a.stem)).size,15);
const native=/^2\.3\.1_(?:fig|ex|we|mc|news)_[A-Za-z0-9]+(?:_(?:slide|doc|summary|web_light|web_dark))?\.(svg|png)$/;
for(const a of assets){assert(a.alt_length<=120);assert(/^(Betalingsbereidheid|Assen|Vraaglijn|Consumentensurplus)\b/.test(a.alt));a.native_name_ok=native.test(a.stem+'.svg')&&native.test(a.stem+'.png');}
assert.equal(assets.filter(a=>!a.native_name_ok).length,10);
const rootSuccessor='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-successor-binding-plan.md';
const latest='13b7ac8e1a000878f50a3d70ce1017327820d8e2', originalR6='89a8fc34';
const testPath='build-scripts/content/book-2/212/test_metadata.py', genPath='build-scripts/content/book-2/b2_212.py';
const metadata=git(latest,testPath), originalMetadata=git(originalR6,testPath);assert.equal(metadata,originalMetadata);
const gen=git(latest,genPath), oldGen=git('798cacfeeb40e4e0ba54d26f2b040cbdeec327a9',genPath);
const titlePairs=[['2.1.2_we_1','Kajakverhuur: TK, TO, break-even en verticale winstafstand per dag'],['2.1.2_ex_1','Zeep: TK, TO, break-even en verticale winstafstand per dag'],['2.1.2_ex_3','Bloempotten: TK, TO, break-even en verticale winstafstand per dag'],['2.1.2_ex_4','Minigolf: TK, TO, break-even en verticale winstafstand per dag'],['2.1.2_ex_5','Bakkerij: TK, TO, break-even en verticale winstafstand per maand']];
const start='    for name, fixed, variable, price, qmax, ymax, qticks, yticks, qunit, period, complete in cases:';
const insertion='    titles = {\n'+titlePairs.map(([k,v])=>`        "${k}": "${v}",\n`).join('')+'    }\n';
const expected=oldGen.replace(start,insertion+start).replace('name + ": TK en TO" if complete else "Bloempotten: alleen TK"','titles[name] if complete else "Bloempotten: alleen TK"');
assert.equal(gen,expected);
const simulated=gen.replace(/(PRIOR_REVIEW_HASH = ")[a-f0-9]{64}/,'$1'+'a'.repeat(64));
assert.notEqual(simulated,gen);assert.notEqual(simulated,expected);
assert(metadata.includes('self.assertEqual(current,expected)'));assert(metadata.includes('self.assertEqual(actual, source_replacement(previous), name)'));
const assertionInteraction={root_ref:latest,original_r6_ref:originalR6,test_path:testPath,test_sha256:sha(metadata),root_and_original_test_identical:true,current_generator_equals_existing_exact_test_expectation:true,in_memory_single_pin_transition_fails_existing_exact_expectation:true,source_guard:'Four complete sources equal the historical source plus exact native alt insertions; a newly authorized bonus addition requires a separately specified exact expected successor. No lesson bytes or tests were mutated.'};
const py=String.raw`import sys,json,importlib
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path('build-scripts/content/book-2').resolve()))
out=[]
for name in ('b2_212','b2_213','b2_223'):
 b=importlib.import_module(name); dest=Path('../4veco-lessen').resolve()/b.LESSON_REL
 if name=='b2_212':
  prior=dest.parent/'2.1.1 Kostenstructuren'; pins=[(dest/'2.1.2-textbook-plan.md',b.PLAN_HASH),(dest.parent/'_chapter-plan.md',b.CHAPTER_HASH),(prior/'2.1.1-review.md',b.PRIOR_REVIEW_HASH),(prior/'2.1.1-quality-ref.yaml',b.PRIOR_QUALITY_HASH)]
 elif name=='b2_213': pins=b.prerequisite_pins(dest)
 else: pins=[(dest/'2.2.3-textbook-plan.md',b.PLAN_HASH),(dest.parent/'_chapter-plan.md',b.CHAPTER_HASH),*((dest.parent/'2.2.1 Prijselasticiteit'/n,h) for n,h in b.PRIOR_PINS.items())]
 for bad,_ in pins:
  mapping=dict(pins)
  with patch.object(b,'lf_hash',side_effect=lambda p:'bad' if p==bad else mapping[p]),patch.object(b.subprocess,'run') as proc,patch.object(Path,'write_text') as wt,patch.object(Path,'write_bytes') as wb,patch.object(Path,'mkdir') as mk:
   try: b.build(Path('../4veco-lessen').resolve());raise AssertionError('unexpected success')
   except ValueError as e: message=str(e)
   proc.assert_not_called();wt.assert_not_called();wb.assert_not_called();mk.assert_not_called()
  out.append({'generator':name,'tampered_in_memory':str(bad),'rejection':message,'subprocesses_and_output_writes':0})
 if name=='b2_213':
  with patch.object(b,'lf_hash',side_effect=lambda p:dict(pins)[p]),patch.object(b,'digest',return_value='bad'),patch.object(b.subprocess,'run') as proc,patch.object(Path,'write_text') as wt,patch.object(Path,'write_bytes') as wb,patch.object(Path,'mkdir') as mk:
   try:b.build(Path('../4veco-lessen').resolve());raise AssertionError('unexpected success')
   except ValueError as e:message=str(e)
   proc.assert_not_called();wt.assert_not_called();wb.assert_not_called();mk.assert_not_called()
  out.append({'generator':name,'tampered_in_memory':'separate raw 212 paragraph MD','rejection':message,'subprocesses_and_output_writes':0})
from PIL import ImageFont
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',40)
metrics={text:font.getbbox(text,anchor='ls') for text in ('Consumentensurplus','Q (kaartjes)','P (€ per kaartje)','100','20')}
print(json.dumps({'negative_guard_probes':out,'arial_30pt_40px_baseline_boxes':metrics},ensure_ascii=False))`;
const guardRun=run('C:/Python314/python.exe',['-c',py]);assert.equal(guardRun.exit,0,guardRun.stderr);
const diagnostics=JSON.parse(guardRun.stdout);assert.equal(diagnostics.negative_guard_probes.length,17);
const commands=[
 ['node',['build-scripts/workflows/check-book-outline-currentness.js']],
 ...['specialist_review','paragraph_production'].map(action=>['node',['build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action',action,'--paragraph','2.3.1']]),
 ['node',['build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']],
 ...['212','213','223'].map(id=>['C:/Python314/python.exe',[`build-scripts/content/book-2/b2_${id}.py`,'--help']]),
 ['git',['diff','--check']],
].map(([exe,args])=>run(exe,args));for(const c of commands)assert.equal(c.exit,0,c.stderr);
const result={date:'2026-09-05',reviewer:'paragraph_213_r6_independent_review',kind:'two_plan_reviews_no_student_output',sourcePins,target:t,frozen12_json_hash:sha(JSON.stringify(frozen)),assets,models,discrete:{opening_p10:{purchased:3,gaps:[8,4,0],cs:12,payment:30,wtp:42},bonus_p6_actual:{wtp:[14,10,6],gaps:[8,4,0],cs:12},bonus_p6_highest_three:{wtp:[18,14,10],gaps:[12,8,4],cs:24},closing:{purchased:2,gaps:[3,0],cs:3},triangle_retrieval_area:24},timing:{core_parts:[2,9,7,2,4,3,8,7,10],core:52,support:64,all:[76,80],observed:false},typography:{page_content_width_pt:166*72/25.4,source_width_px:720,final_12pt_requires_source_px:12*720/(166*72/25.4),source_30pt_is_css_px:40,final_30pt_if_full_width:40*(166*72/25.4)/720,bottom_zone_px:45,figure_acceptance:'NOT PERFORMED; planning metric diagnostic only'},successor_subject:{path:rootSuccessor,canonical_lf_sha256:sha(read(path.join(root,rootSuccessor)))},assertionInteraction,diagnostics,commands,paragraph_profile_validation:'NOT RUN: no newly authored student packet; direct existing naming contract checked',rendered_proof:'NOT APPLICABLE: no student-facing output changed',plan_review_decisions:'See separate human-readable reviewer reports; successful diagnostic execution is not plan PASS'};
fs.writeFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-231-plan-independent-checks.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({plan_hash:sha(plan),successor_hash:result.successor_subject.canonical_lf_sha256,assets:assets.length,invalid_names:assets.filter(a=>!a.native_name_ok).map(a=>a.stem),guard_probes:17,all_commands_passed:true,typography:result.typography},null,2));
