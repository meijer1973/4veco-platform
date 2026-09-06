/* Original author R2 design-only regression/custody evidence. No pupil build. */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const assert = require('assert/strict'), vm = require('vm');
const {execFileSync} = require('child_process');
const root = path.resolve(__dirname,'../..'), lessons = path.resolve(root,'../4veco-lessen');
const prefix = 'BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-R2-';
const baseP = 'aee047221564fad762df59754a849d3f08ce069b';
const baseL = 'bbc4adf5af47187d5e394efd8079f906e9914023';
const reviewP = 'e6fbd0517b60eeabe6ec1a2b13e8289672140b8f';
const planPath = 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.4 Gemengde opgaven/2.1.4-textbook-plan.md';
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const git = (cwd,...args) => execFileSync('git',args,{cwd,maxBuffer:30*1024*1024});
const show = (ref,file) => git(root,'show',ref+':'+file);
const text = b => b.toString('utf8').replace(/\r\n/g,'\n');
const checks = [];
function check(name,fn) { fn(); checks.push({name,status:'PASS'}); }
const reportPath = 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-result.md';
const reportBytes = show(reviewP,reportPath);
check('exact independent review raw binding',()=>assert.equal(sha(reportBytes),'db8f4ca1999abb705dc7612b4ad4341110371c444f98956792479e817b55c5fd'));
const reviewEvidenceBytes = show(reviewP,'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-evidence.json');
const reviewEvidence = JSON.parse(reviewEvidenceBytes);
const planBytes = fs.readFileSync(path.join(lessons,planPath)), plan = text(planBytes);
const oldPlanBytes = git(lessons,'show',baseL+':'+planPath), oldPlan = text(oldPlanBytes);
check('original entire plan SHA',()=>assert.equal(sha(oldPlanBytes),'e36f2afe357b36e2db8a1efb360ca2bf32571fb6e2c10e3564ced875f4fcd323'));
const oldLines = oldPlan.trimEnd().split('\n'), newLines = plan.trimEnd().split('\n');
check('original and revised entire plan both 621 physical lines',()=>assert.deepEqual([oldLines.length,newLines.length],[621,621]));
const changedLines = oldLines.flatMap((s,i)=>s===newLines[i]?[]:[{line:i+1,before:s,after:newLines[i]}]);
const permitted = new Set([3,276,518,519,520,524,525,547,550,551,552,591,592,593,594,595,596]);
check('exact bounded 17-line delta only',()=>assert.deepEqual(changedLines.map(x=>x.line),[...permitted].sort((a,b)=>a-b)));
const rules = [
 ['F1 ceiling/inequality wording',s=>s.includes('requires3,50Q≥100, henceQ≥200/7 and the ceiling29.')],
 ['F1 floor distinction',s=>s.includes('The floor (rounded down) is28; ordinary nearest rounding also gives29 here, but is not the general no-loss rule.')],
 ['F1 no false nearest28',s=>!s.includes('not nearest28')],
 ['F1 both actual profit checks retained',s=>s.includes('At28:TO168,TK170,W−2; at29:TO174,TK172,50,W1,50 €/day.')],
 ['F2 real source units',s=>s.includes('≥40px=30pt at source (40×72/96)')],
 ['F2 correct placed point size',s=>s.includes('40×470.551181/1200=15.685039pt')],
 ['F2 no fabricated source guard PASS',s=>!s.includes('Source figure guard≥30 passes.')&&s.includes('actual guard and visual checks are NOT_RUN')],
 ['F2 actual ink remains pending',s=>s.includes('No current ink-fit PASS.')],
 ['F2 mandatory native and placed minima',s=>s.includes('Never shrink below40px/30pt at source or12pt placed')],
 ['F2 wrapping and ink budgets',s=>s.includes('Reserve16px outer ink margin,48px line spacing at40px')&&s.includes('at most2 lines')&&s.includes('each allow128px ink width')],
 ['F2 geometry failure requires new independent review',s=>s.includes('stop for an independently reviewed geometry revision')],
 ['A1 native builder resolved exactly',s=>s.includes('`build-scripts/content/book-2/b2_214.py`')&&!s.includes('`build-scripts/b2_214.py`')],
 ['A1 content path preserved',s=>s.includes('`build-scripts/content/book-2/214/`')],
 ['A1 full template matches chosen path',s=>s.includes('python build-scripts/content/book-2/b2_214.py --lesson-root <extended-absolute-lesson-root>')],
 ['A1 thin delegation matches chosen path',s=>s.includes("lesson_root.parent / '4veco-platform/build-scripts/content/book-2/b2_214.py'")&&s.includes("[sys.executable,str(builder),'--lesson-root',str(lesson_root),*sys.argv[1:]]")],
 ['A1 sibling import and direct-print command',s=>s.includes('from print_pipeline import build_document')&&s.includes('python build-scripts/content/book-2/print_pipeline.py <opgaven-md> <antwoorden-md>')],
 ['unchanged operation/timing/content sections',s=>newLines.slice(5,275).join('\n')===oldLines.slice(5,275).join('\n')&&newLines.slice(276,517).join('\n')===oldLines.slice(276,517).join('\n')&&newLines.slice(596).join('\n')===oldLines.slice(596).join('\n')]
];
rules.forEach(([name,fn])=>check(name,()=>assert.ok(fn(plan),name)));
check('F1 old wording is rejected by new rule',()=>assert.equal(rules[2][1](oldPlan),false));
check('F2 old source units are rejected by new rule',()=>assert.equal(rules[4][1](oldPlan),false));
check('A1 old path is rejected by new rule',()=>assert.equal(rules[11][1](oldPlan),false));
const be = 200/7, profit = q=>3.5*q-100;
check('actual floor nearest ceiling independently calculated',()=>assert.deepEqual([Math.floor(be),Math.round(be),Math.ceil(be)],[28,29,29]));
check('actual adjacent profits independently calculated',()=>assert.deepEqual([profit(28),profit(29)],[-2,1.5]));
const otherBE = 141/5, otherProfit = q=>3.5*q-(3.5*otherBE);
check('negative design counterexample: nearest is not general no-loss',()=>{assert.equal(Math.round(otherBE),28);assert.equal(Math.ceil(otherBE),29);assert.ok(otherProfit(28)<0);assert.ok(otherProfit(29)>0);});
check('source pixel units reject former 34px',()=>{assert.equal(34*72/96,25.5);assert.ok(34*72/96<30);assert.equal(40*72/96,30);});
const widthPt = 166*72/25.4, placedPt = 40*widthPt/1200;
check('placed 40px independent scale',()=>{assert.ok(Math.abs(placedPt-15.685039370078742)<1e-10);assert.ok(placedPt>=12);assert.equal((166/1200)*1050,145.25);});
check('128px side lanes and two 48px rows in 118px heading band',()=>{assert.equal(144-16,128);assert.equal(1184-1056,128);assert.ok(2*48<=134-16);assert.ok(2*48<=1034-850);});
// Attributed reuse of every original author assertion, not an independent review.
// Only the necessary two font constants change. Capture its output in memory;
// never execute its old exclusive-write path or alter any R1 evidence file.
const oldProbePath = 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-probes.js';
const oldProbeBytes = fs.readFileSync(path.join(root,oldProbePath));
check('original probes byte-preserved',()=>assert.equal(sha(oldProbeBytes),sha(show(baseP,oldProbePath))));
let source = text(oldProbeBytes), captured;
const substitutions = [['placedFont=34*widthPt/1200','placedFont=40*widthPt/1200'],['min_font_px:34','min_font_px:40']];
for(const [before,after] of substitutions){assert.equal(source.split(before).length,2);source=source.replace(before,after);}
const fsCapture = {...fs,writeFileSync:(file,data,options)=>{
 assert.equal(file,path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-evidence.json'));
 assert.equal(options.flag,'wx'); assert.equal(captured,undefined); captured=JSON.parse(data);
}};
vm.runInNewContext(source,{require:name=>name==='fs'?fsCapture:require(name),__dirname,console:{log:()=>{}}},{filename:prefix+'attributed-original-checks.js'});
check('all 118 original author checks retained and pass',()=>{assert.equal(captured.checks,118);assert.equal(captured.status,'PASS');});
check('reused checks use corrected font and same target/timing',()=>{assert.equal(captured.planned_geometry.min_font_px,40);assert.equal(captured.planned_geometry.min_placed_pt,placedPt);assert.deepEqual([captured.timing.core,captured.timing.supported,captured.timing.all_printed],[54,60,72]);assert.equal(captured.timing.status,'UNOBSERVED');});
const instructionBindings = reviewEvidence.instructions.map(item=>{
 const folder=item.repository==='4veco-platform'?root:lessons, bytes=fs.readFileSync(path.join(folder,item.path));
 assert.equal(sha(bytes),item.raw_sha256,'instruction drift: '+item.path);
 return {repository:item.repository,path:item.path,raw_sha256:sha(bytes),unchanged:true,read_basis:'previously personally read by this author; governance/PDF and correction-specific sections freshly reread'};
});
check('all 27 applicable instruction bytes unchanged',()=>assert.equal(instructionBindings.length,27));
const inventory = reviewEvidence.lesson_preservation;
check('complete independent lesson inventory pinned',()=>{assert.equal(inventory.baseline,baseL);assert.equal(inventory.count,1855);assert.equal(inventory.files.length,1855);});
const currentInventory = inventory.files.map(item=>{
 const raw=sha(fs.readFileSync(path.join(lessons,item.path)));
 if(item.path!==planPath) assert.equal(raw,item.raw_sha256,'unexpected lesson raw change: '+item.path);
 return {path:item.path,raw_sha256:raw,baseline_raw_sha256:item.raw_sha256,changed:raw!==item.raw_sha256};
});
check('1854 other lesson files raw-byte unchanged',()=>assert.deepEqual(currentInventory.filter(x=>x.changed).map(x=>x.path),[planPath]));
const lessonDiff = git(lessons,'diff','--name-only','-z',baseL).toString().split('\0').filter(Boolean);
check('whole tracked lesson delta only canonical plan',()=>assert.deepEqual(lessonDiff,[planPath]));
check('no untracked lesson outputs created',()=>assert.equal(git(lessons,'ls-files','--others','--exclude-standard').toString().trim(),''));
for(const futurePath of ['build-scripts/content/book-2/b2_214.py','build-scripts/content/book-2/214'])check('no future source created: '+futurePath,()=>assert.equal(fs.existsSync(path.join(root,futurePath)),false));
const oldEvidenceFiles = git(root,'ls-tree','-r','--name-only',baseP,'reports/sprints').toString().trim().split('\n').filter(p=>p.includes('BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-'));
const priorEvidenceBindings = oldEvidenceFiles.map(p=>{const bytes=fs.readFileSync(path.join(root,p));assert.equal(sha(bytes),sha(show(baseP,p)),p);return {path:p,raw_sha256:sha(bytes)};});
check('all original author logs/proofs preserved',()=>assert.ok(priorEvidenceBindings.length>=8));
const result = {schema_version:1,kind:'author_design_correction_evidence_only',status:'PASS_AUTHOR_CHECKS_ONLY',task:'BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN',actor:'paragraph_214_builder',role:'original214planAuthor',operational_commit:git(root,'rev-parse','HEAD').toString().trim(),input:{platform:baseP,lessons:baseL,review_platform:reviewP,review_report_path:reportPath,review_report_raw_sha256:sha(reportBytes),review_evidence_raw_sha256:sha(reviewEvidenceBytes)},plan:{path:planPath,original_raw_sha256:sha(oldPlanBytes),raw_sha256:sha(planBytes),lf_sha256:sha(plan),physical_lines:newLines.length,changed_lines:changedLines},checks,original_author_probe_reuse:{path:oldProbePath,raw_sha256:sha(oldProbeBytes),exact_substitutions:substitutions,output_interception:'in-memory only; original file preserved',evidence:captured},rounding:{continuous:be,floor:Math.floor(be),nearest:Math.round(be),ceiling:Math.ceil(be),profits:[profit(28),profit(29)],negative_design_case:{not_pupil_content:true,continuous:otherBE,nearest:Math.round(otherBE),ceiling:Math.ceil(otherBE),profits:[otherProfit(28),otherProfit(29)]}},typography:{source_px:40,source_pt:30,width_mm:166,width_pt:widthPt,placed_pt:placedPt,outer_margin_px:16,line_spacing_px:48,actual_ink_measurement:'NOT_RUN_PLAN_ONLY',rendered_visual_verdict:'NOT_RUN'},instructionBindings,priorEvidenceBindings,lesson_preservation:{baseline:baseL,count:currentInventory.length,unchanged:currentInventory.filter(x=>!x.changed).length,files:currentInventory},independent_recheck:'PENDING paragraph_224_builder',production_release:'PENDING plan PASS + actual accepted 212/213 + explicit root release',pupil_generation:false,current_full_ci:'NOT_RUN',classroom_timing:'UNOBSERVED'};
fs.writeFileSync(path.join(__dirname,prefix+'evidence.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:result.status,original_checks:captured.checks,r2_checks:checks.length,plan:result.plan.path,plan_sha256:sha(planBytes),plan_lines:newLines.length,changed_lines:changedLines.map(x=>x.line),unchanged_other_lesson_files:1854,placed_pt:placedPt,independent_recheck:result.independent_recheck},null,2));
