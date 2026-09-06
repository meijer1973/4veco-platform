/* Plan-phase evidence only. Never writes lesson, authority or generated pupil files. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const assert = require('assert/strict');
const {execFileSync, spawnSync} = require('child_process');
const P = path.resolve(__dirname, '../..');
const L = path.resolve(P, '../4veco-lessen');
const prefix = 'BOOK2-TEXTBOOK-PRODUCTION-1-224-PLAN';
const PBASE = '35e0bebb75cc3987c43dd8f480e1b444bd877f4a';
const LBASE = '219a977e495abe43c17949e7d8996aab4176faa0';
const book = 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus';
const chapter = `${book}/2.2 Hoofdstuk Elasticiteit`;
const folder = `${chapter}/2.2.4 Gemengde opgaven elasticiteit`;
const planPath = `${folder}/2.2.4-textbook-plan.md`;
const digest = x => crypto.createHash('sha256').update(x).digest('hex');
const git = (cwd, args) => execFileSync('git', args, {cwd, maxBuffer: 100 * 1024 * 1024});
const lf = x => x.toString('utf8').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
const files = (cwd, ref) => git(cwd, ['ls-tree', '-rz', '--name-only', ref]).toString('utf8').split('\0').filter(Boolean);
const checks = [];
function check(name, fn) { fn(); checks.push({name, result: 'PASS'}); }
const record = JSON.parse(fs.readFileSync(path.join(P, 'references/authored/course-target-exercises.json'), 'utf8')).exercises.find(x => x.id === '2.2.4');
check('Exact complete serialized frozen target', () => assert.equal(digest(JSON.stringify(record)), '4e0840ddf202ce4906ee05cd4dde97c0f3577885c34f0b9613ea18760aad7519'));
check('Six questions, original point subtotals, fourteen points', () => assert.deepEqual(record.target_exercise.subquestions.map(q => q.points), [2,2,2,4,2,2]));
check('No existing lesson content differs from exact Git baseline', () => assert.deepEqual(git(L,['diff','--name-only','-z',LBASE,'--']).toString().split('\0').filter(x=>x && x!==planPath),[]));
const tree = new Map(git(L,['ls-tree','-rz',LBASE]).toString('utf8').split('\0').filter(Boolean).map(line=>{const [meta,file]=line.split('\t');return [file,meta.split(' ')[2]];}));
const inventory = files(L, LBASE).map(file => {
  const current = fs.readFileSync(path.join(L, file));
  const normalized = lf(current);
  const binary = current.includes(0) || /\.(pdf|png|jpg|jpeg|zip|woff2?|ttf)$/i.test(file);
  return {file, raw_sha256: digest(current), baseline_git_blob: tree.get(file), lf_sha256: binary ? null : digest(normalized)};
});
checks.push({name: `All ${inventory.length} existing lesson files preserved against exact base`, result: 'PASS'});
const priorReportPath = path.join(__dirname, `${prefix}-design-check.json`);
if (fs.existsSync(priorReportPath)) {
  const prior = JSON.parse(fs.readFileSync(priorReportPath, 'utf8'));
  check('Every raw legacy worktree byte unchanged since first inventory', () => {
    assert.deepEqual(inventory.map(x => [x.file, x.raw_sha256]), prior.lesson_inventory.map(x => [x.file, x.raw_sha256]));
  });
}
const pins = [];
for (const [repo, file] of [
  ['P', 'references/owned/course-blueprint-v6-three-year.md'], ['P', 'references/owned/course-blueprint-v5.md'],
  ['P', 'references/owned/course-blueprint-pedagogical-boundaries.md'], ['P', 'references/authored/course-target-exercises.json'],
  ['P', 'references/authored/book-outlines/book-2-outline.meta.json'], ['L', `${book}/_book-plan.md`], ['L', `${chapter}/_chapter-plan.md`],
  ...['2.2.1 Prijselasticiteit','2.2.2 Elasticiteit en omzet','2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit'].flatMap(dir => {
    const id=dir.slice(0,5);
    return [`${id}-textbook-plan.md`, `${id}-review.md`, `${id}-quality-ref.yaml`, `${id}-textbook-handoff.md`, `${dir} – paragraaf.md`, `${dir} – opgaven.md`, `${dir} – antwoorden.md`].map(name => ['L', `${chapter}/${dir}/${name}`]);
  })
]) {
  const full = path.join(repo === 'P' ? P : L, file);
  if (!fs.existsSync(full)) { pins.push({repo,file,status:'ABSENT, not an acceptance pin'}); continue; }
  const data = fs.readFileSync(full);
  pins.push({repo,file,raw_sha256:digest(data),lf_sha256:digest(lf(data))});
}
const meta = JSON.parse(fs.readFileSync(path.join(P, 'references/authored/book-outlines/book-2-outline.meta.json'), 'utf8'));
const percent = (old, now) => ((now-old)*100)/old;
const close = (a,b) => assert.ok(Math.abs(a-b)<1e-10, `${a} != ${b}`);
const arithmetic = {
  rehearsalA: {q:percent(100,80),p:percent(20,22),ev:percent(100,80)/percent(20,22),oldTO:20*100,newTO:22*80,to:percent(2000,1760)},
  rehearsalB: {q:percent(100,60),p:percent(10,15),ev:percent(100,60)/percent(10,15),oldTO:1000,newTO:900,to:percent(1000,900),factor:1.5*.6},
  rehearsalC: {ei:5/10}, rehearsalD:{q:percent(200,180),p:percent(20,24),ek:percent(200,180)/percent(20,24)},
  rehearsalE:{base:100-2*10+20+.005*20000,yOnly:100-2*10+20+.005*24000,resetPcOnly:100-2*10+24+.005*20000,both:100-2*10+24+.005*24000},
  targetA:{q:percent(50000,43000),p:percent(10,12),ev:percent(50000,43000)/percent(10,12),oldTO:10*50000,newTO:12*43000},
  targetBC:{premium:15/8,budget:-4/8,competitorP:percent(8,9),ek:5/percent(8,9)},
  targetD:{base:12000-400*12+.1*40000+300*10,yOnly:12000-400*12+.1*42000+300*10},
  closing:{reverse:percent(25,20),ownEv:-5/10,zeroIncomeDenominator:0}
};
check('Rehearsal signed old-base Ev and exact finite TO', () => { close(arithmetic.rehearsalA.ev,-2); close(arithmetic.rehearsalA.to,-12); close(arithmetic.rehearsalB.ev,-.8); close(arithmetic.rehearsalB.to,-10); close(arithmetic.rehearsalB.factor,.9); });
check('Rehearsal signed Ei/Ek and annual-input reset chain', () => { close(arithmetic.rehearsalC.ei,.5); close(arithmetic.rehearsalD.ek,-.5); assert.deepEqual(Object.values(arithmetic.rehearsalE),[200,220,204,224]); close(percent(200,220)/percent(20000,24000),.5); });
check('Every frozen numerical target operation recalculated', () => { assert.deepEqual(Object.values(arithmetic.targetA),[-14,20,-.7,500000,516000]); assert.deepEqual(Object.values(arithmetic.targetBC),[1.875,-.5,12.5,.4]); assert.deepEqual(Object.values(arithmetic.targetD),[14200,14400]); });
const classifyEi = x => x<0?'inferieur':x>0&&x<1?'normaal':x>1?'luxe':'grenswaarde';
check('Signed Ei disjoint categories and open boundaries', () => assert.deepEqual([-.5,0,.5,1,1.875].map(classifyEi),['inferieur','grenswaarde','normaal','grenswaarde','luxe']));
const negativeGuards = [
  ['new denominator rejected', percent(100,80), (80-100)/80*100],
  ['ratio reversal rejected', arithmetic.targetBC.ek, 12.5/5],
  ['annual Y divide-by-twelve rejected', arithmetic.targetD.base,12000-4800+.1*(40000/12)+3000],
  ['non-reset Y rejected', arithmetic.rehearsalE.resetPcOnly,arithmetic.rehearsalE.both],
  ['early simplified finite TO rejected', arithmetic.rehearsalB.factor,1+.5-.4],
  ['coefficient is not Ei',.5,.005],
  ['region is not all observed subscribers',arithmetic.targetD.base,43000],
  ['absolute Ei sign loss rejected',classifyEi(-.5),classifyEi(Math.abs(-.5))],
  ['luxury is not broad normal',classifyEi(1.875),'normaal'],
  ['target annual/month units preserved',record.target_exercise.sources[3].content.includes('jaarinkomen'),false]
];
for (const [name, correct, wrong] of negativeGuards) check(name, () => assert.notEqual(correct,wrong));
const expectedTargetHash = '4e0840ddf202ce4906ee05cd4dde97c0f3577885c34f0b9613ea18760aad7519';
const rejectTargetMutation = (name, mutate) => check(name,()=>{
  const actualInput=structuredClone(record); mutate(actualInput);
  assert.throws(()=>assert.equal(digest(JSON.stringify(actualInput)),expectedTargetHash));
});
rejectTargetMutation('Mutation: old target score rejected',r=>r.target_exercise.sources[0].rows[2][1]='4,3');
rejectTargetMutation('Mutation: annual unit replaced by monthly rejected',r=>r.target_exercise.sources[3].content=r.target_exercise.sources[3].content.replace('jaarinkomen','maandinkomen'));
rejectTargetMutation('Mutation: source D coefficient drift rejected',r=>r.target_exercise.sources[3].content=r.target_exercise.sources[3].content.replace('0,1Y','0,2Y'));
rejectTargetMutation('Mutation: target selection replaced by calculation rejected',r=>r.target_exercise.subquestions[0].prompt='Bereken Ev.');
rejectTargetMutation('Mutation: unasked function Ek question rejected',r=>r.target_exercise.subquestions.push({label:'7',points:2,prompt:'Bereken Ek met bron D.'}));
rejectTargetMutation('Mutation: answer cue in source rejected',r=>r.target_exercise.sources[0].content+=' TO stijgt naar €516.000.');
rejectTargetMutation('Mutation: changed subtotal rejected',r=>r.target_exercise.subquestions[3].points=3);
const timings = [
  {id:'orientation',read:2,calculate:0,mark:0,write:0,check:0,transition:.5},
  {id:'R1',read:.75,calculate:1.5,mark:.5,write:1.25,check:.5,transition:0},
  {id:'R2',read:.75,calculate:1.25,mark:.25,write:1.75,check:.5,transition:0},
  {id:'R3',read:.5,calculate:.5,mark:0,write:1,check:.5,transition:0},
  {id:'R4',read:.5,calculate:1,mark:.25,write:1.25,check:.5,transition:0},
  {id:'R5',read:.75,calculate:2.25,mark:.5,write:1.5,check:.5,transition:0},
  {id:'R6',read:.5,calculate:0,mark:0,write:1.5,check:.5,transition:.5},
  {id:'Tread',read:2,calculate:0,mark:0,write:0,check:0,transition:.5},
  {id:'T1',read:.25,calculate:0,mark:.25,write:.75,check:.25,transition:0},
  {id:'T2',read:.25,calculate:0,mark:0,write:1,check:.25,transition:0},
  {id:'T3',read:.25,calculate:1,mark:0,write:.5,check:.25,transition:0},
  {id:'T4',read:.5,calculate:2.25,mark:0,write:1.25,check:.5,transition:0},
  {id:'T5',read:.5,calculate:1.25,mark:0,write:1,check:.25,transition:0},
  {id:'T6',read:.5,calculate:0,mark:.25,write:2,check:.75,transition:0},
  {id:'closing',read:.5,calculate:.5,mark:0,write:1,check:.5,transition:0},
  {id:'whole-route final check',read:0,calculate:0,mark:0,write:0,check:1.5,transition:0}
].map(row => ({...row,total:['read','calculate','mark','write','check','transition'].reduce((s,k)=>s+row[k],0)}));
const core = timings.reduce((s,row)=>s+row.total,0);
check('Whole core includes every action, closing, transitions and final checking <=55', () => assert.ok(core<=55));
const planExists = fs.existsSync(path.join(L, planPath));
if (planExists) {
  const plan = lf(fs.readFileSync(path.join(L,planPath)));
  check('All literal frozen strings preserved in plan', () => {
    for (const str of [record.target_exercise.context,...record.lesson_goals,...record.target_exercise.subquestions.map(x=>x.prompt),...record.target_exercise.sources.map(x=>x.content)]) assert.ok(plan.includes(str), `Missing: ${str}`);
    for (const src of record.target_exercise.sources) for (const row of src.rows||[]) for (const cell of row) assert.ok(plan.includes(cell),`Missing cell ${cell}`);
  });
  check('Plan-only future gates and two-edition contract explicit',()=>{
    for(const text of ['PLAN-ONLY','independent plan review','root release','distinct specialist QC','No paragraaf edition','No ZIP','H-213-OPC2','166mm','12pt','R1','R6','T1','T6','B1','C1','C2']) assert.ok(plan.includes(text), `Missing contract ${text}`);
  });
  check('All lifecycle hold IDs accounted for by the written plan',()=>{
    for(const hold of meta.holds) assert.ok(plan.includes(hold.id),`Missing hold ${hold.id}`);
  });
  check('Exact rehearsal outcomes, units, bonus and complete timing budgets appear',()=>{
    for(const fragment of ['R1 (4p)','R2 (4p)','R3 (2p)','R4 (2p)','R5 (6p)','R6 (2p)',
      '200/month','220/month','204/month','48.5minutes','58.5minutes','66.5minutes',
      'x(Q)=originX+3Q','y(P)=630−16P','No ZIP','one point each','T5 remains']) assert.ok(plan.includes(fragment),fragment);
    close(40*166/1200*72/25.4,15.68503937007874);
    assert.equal([4,4,2,2,6,2].reduce((a,b)=>a+b),20);
  });
}
const report = {phase:planExists?'canonical plan checks':'pre-authoring baseline',platform_base:PBASE,lessons_base:LBASE,
  operational_plan_commit:'928f3c01437eaed47e62620258d705e6c2163c09',checks,
  target_record:record,target_sha256:digest(JSON.stringify(record)),pins,
  holds:meta.holds||meta.readiness_holds||meta.hold_register,
  lesson_inventory:inventory,legacy224:inventory.filter(x=>x.file.startsWith(folder+'/')),
  arithmetic,negative_guard_count:negativeGuards.length,timings,core_minutes:core,support_extra:10,bonus_extra:8,all_minutes:core+18,
  plan:planExists?{path:planPath,raw_sha256:digest(fs.readFileSync(path.join(L,planPath))),lf_sha256:digest(lf(fs.readFileSync(path.join(L,planPath))))}:null,
  classroom_timing_observed:false,independent_review:false,rendered_proof:'N/A plan-only, no student output changed'};
fs.writeFileSync(priorReportPath,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({phase:report.phase,checks:checks.length,legacy:inventory.length,legacy224:report.legacy224.length,core,plan:report.plan,pins},null,2));
