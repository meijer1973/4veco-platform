'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm'),assert=require('assert/strict');
const{execFileSync}=require('child_process');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-R2-';
const oldP='e6fbd0517b60eeabe6ec1a2b13e8289672140b8f',oldL='bbc4adf5af47187d5e394efd8079f906e9914023';
const authorP='ea626efc49353cf07395ee73a4855eb17f511685',authorL='180b02b915343f2f02d594b9e674a77eefa9aa39';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(cwd,...args)=>execFileSync('git',args,{cwd,maxBuffer:32*1024*1024});
const read=(root,file)=>fs.readFileSync(path.join(root,file));
const lf=b=>b.toString('utf8').replace(/\r\n/g,'\n');
const checks=[];const eq=(name,a,b)=>{assert.deepEqual(a,b,name);checks.push({name,status:'PASS'});};
const yes=(name,x)=>{assert.ok(x,name);checks.push({name,status:'PASS'});};
const prior=JSON.parse(read(P,'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-evidence.json'));
const file=prior.plan.path,before=lf(git(L,'show',oldL+':'+file)),bytes=read(L,file),after=lf(bytes);
eq('Exact raw R2 plan',sha(bytes),'a6f71553e887acdf7b94be5d411303660b9fad2ef8745cb25986636aa49b4cc4');
eq('Exact LF R2 plan',sha(after),sha(bytes));eq('Adopted lesson exact author bytes',sha(bytes),sha(git(L,'show',authorL+':'+file)));
const oldLines=before.trimEnd().split('\n'),newLines=after.trimEnd().split('\n');
eq('Complete unchanged line counts',[oldLines.length,newLines.length],[621,621]);
const delta=oldLines.flatMap((text,i)=>text===newLines[i]?[]:[{line:i+1,before:text,after:newLines[i]}]);
eq('Exact seventeen-line delta',delta.map(x=>x.line),[3,276,518,519,520,524,525,547,550,551,552,591,592,593,594,595,596]);
eq('F1 entire question and model otherwise unchanged',newLines[275],oldLines[275].replace('First whole no-loss29, not nearest28.','First whole no-loss requires3,50Q≥100, henceQ≥200/7 and the ceiling29. The floor (rounded down) is28; ordinary nearest rounding also gives29 here, but is not the general no-loss rule.'));
eq('Floor nearest ceiling and neighbor profits',[Math.floor(200/7),Math.round(200/7),Math.ceil(200/7),3.5*28-100,3.5*29-100],[28,29,29,-2,1.5]);
yes('Counterexample disproves nearest as general rule',Math.round(141/5)===28&&Math.ceil(141/5)===29&&28<141/5&&29>141/5);
eq('Exact source CSS pixel/point conversion',[34*72/96,40*72/96],[25.5,30]);
const typography={source_px:40,source_pt:40*72/96,placed_pt:40*(166*72/25.4)/1200,width_mm:166,height_mm:1050*166/1200,actual_ink:'NOT_RUN',rendered_acceptance:'NOT_RUN'};
yes('Final-size numerical floor',typography.placed_pt>=12&&Math.abs(typography.placed_pt-15.685039370078742)<1e-10);
yes('Source minima and pending real ink are explicit',after.includes('≥40px=30pt at source (40×72/96)')&&after.includes('No current ink-fit PASS.')&&after.includes('actual guard and visual checks are NOT_RUN'));
yes('No old source-guard PASS assertion',!after.includes('Source figure guard≥30 passes.'));
eq('Planned side lanes and two-row height budgets',[144-16,1184-1056,134-16,1034-850],[128,128,118,184]);
yes('Two48px lines fit height budgets but glyph widths remain unmeasured',2*48<=118&&2*48<=184&&after.includes('stop for an independently reviewed geometry revision'));
const chosen='build-scripts/content/book-2/b2_214.py';
yes('Root-selected native builder only',after.includes('`'+chosen+'`')&&!after.includes('`build-scripts/b2_214.py`'));
yes('Full and thin path contract consistent',after.includes('python '+chosen+' --lesson-root <extended-absolute-lesson-root>')&&after.includes("lesson_root.parent / '4veco-platform/"+chosen+"'")&&after.includes("[sys.executable,str(builder),'--lesson-root',str(lesson_root),*sys.argv[1:]]"));
const print=lf(read(P,'build-scripts/content/book-2/print_pipeline.py'));
yes('Existing native direct-print positional sources/proof flag support proposed command',print.includes('parser.add_argument("sources", type=Path, nargs="+")')&&print.includes('parser.add_argument("--proof-root", type=Path)')&&after.includes('python build-scripts/content/book-2/print_pipeline.py <opgaven-md> <antwoorden-md> --proof-root <third-unused-proof-root>'));
yes('Existing native sibling import matches proposed builder',lf(read(P,'build-scripts/content/book-2/b2_213.py')).includes('from print_pipeline import build_document')&&after.includes('from print_pipeline import build_document'));
eq('No unbuilt source created',[fs.existsSync(path.join(P,chosen)),fs.existsSync(path.join(P,'build-scripts/content/book-2/214'))],[false,false]);
const inventory=prior.lesson_preservation.files.map(item=>{const current=sha(read(L,item.path));if(item.path!==file)assert.equal(current,item.raw_sha256,item.path);return{...item,r2_raw_sha256:current,changed:current!==item.raw_sha256};});
eq('Only plan changed among all1855 lesson files',inventory.filter(x=>x.changed).map(x=>x.path),[file]);
eq('Whole adopted lesson tree equals author tree',git(L,'diff','--name-only',authorL,'HEAD').toString().trim(),'');
eq('No untracked lesson output',git(L,'ls-files','--others','--exclude-standard').toString().trim(),'');
const imports=git(P,'diff','--name-only','aee047221564fad762df59754a849d3f08ce069b','ecdb53ae7b1edd7a7783d17ce9c64bbd85b89a86').toString().trim().split('\n');
const authorCustody=imports.map(p=>{const raw=sha(read(P,p));assert.equal(raw,sha(git(P,'show',authorP+':'+p)),p);return{path:p,raw_sha256:raw};});
eq('Exactly nine author evidence imports, no index tail',imports.length,9);
const oldEvidence=git(P,'ls-tree','-r','--name-only',oldP,'reports/sprints').toString().trim().split('\n').filter(p=>p.includes('BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-'));
const priorCustody=oldEvidence.map(p=>{const raw=sha(read(P,p));assert.equal(raw,sha(git(P,'show',oldP+':'+p)),p);return{path:p,raw_sha256:raw};});
yes('All old author/reviewer evidence and failed logs byte-preserved',priorCustody.length>=18);
const instructionCustody=prior.instructions.map(r=>{const raw=sha(read(r.repository==='4veco-platform'?P:L,r.path));assert.equal(raw,r.raw_sha256,r.path);return{path:r.path,repository:r.repository,raw_sha256:raw};});
eq('All27 personally read instruction bytes unchanged',instructionCustody.length,27);
// Rerun this reviewer's original complete independent mathematics in memory.
// Alter only the exact input/expected-plan pins, resolved F1/F2 predicates and
// the selected source-font parameter. Intercept its exclusive JSON write.
const originalPath='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-probes.js';
const original=lf(read(P,originalPath));
const substitutions=[
 ["lb='bbc4adf5af47187d5e394efd8079f906e9914023'","lb='180b02b915343f2f02d594b9e674a77eefa9aa39'"],
 ["'e36f2afe357b36e2db8a1efb360ca2bf32571fb6e2c10e3564ced875f4fcd323'","'a6f71553e887acdf7b94be5d411303660b9fad2ef8745cb25986636aa49b4cc4'"],
 ["yes('F1 reproducible candidate wording defect',plan.includes('First whole no-loss29, not nearest28.'));","yes('F1 erroneous wording removed',!plan.includes('First whole no-loss29, not nearest28.'));"],
 ['source_px:34,source_css_pt:34*72/96','source_px:40,source_css_pt:40*72/96'],
 ['placed_pt:34*(166*72/25.4)/1200','placed_pt:40*(166*72/25.4)/1200'],
 ["yes('F2 source-unit guard assertion is false',typography.source_css_pt<typography.source_guard_pt&&plan.includes('Source figure guard≥30 passes.'));","yes('F2 source-unit guard fixed without false measured PASS',typography.source_css_pt>=typography.source_guard_pt&&!plan.includes('Source figure guard≥30 passes.'));"],
 ["review_verdict:'REVISE'","review_verdict:'PASS_WITH_FLAGS'"]
];
let adapted=original;
for(const [a,b]of substitutions){assert.equal(adapted.split(a).length,2,a);adapted=adapted.replace(a,b);}
let replay;
vm.runInNewContext(adapted,{require:n=>n==='fs'?{...fs,writeFileSync:(p,data,o)=>{assert.equal(p,path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW-evidence.json'));assert.equal(o.flag,'wx');assert.equal(replay,undefined);replay=JSON.parse(data);}}:require(n),__dirname,process,structuredClone,console:{log:()=>{}}},{filename:prefix+'bounded-independent-replay.js'});
eq('All100 independent original assertions rerun',replay.checks.length,100);
eq('All17 independent counterexamples rerun',replay.negative_design_probes.length,17);
eq('All original complete exercise arithmetic preserved',replay.arithmetic,prior.arithmetic);
eq('All original actual timing rows preserved',replay.timing,prior.timing);
eq('All original source/answer assets and geometry preserved',[replay.assets,replay.geometry],[prior.assets,prior.geometry]);
eq('All exact frozen target fields preserved',[replay.record,replay.record_sha256],[prior.record,prior.record_sha256]);
eq('Actual prerequisite binding bytes and honest pending state unchanged',[replay.bindings,replay.pending],[prior.bindings,prior.pending]);
const authorEvidence=read(P,'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-R2-evidence.json');
eq('Exact author evidence inspected/bound',sha(authorEvidence),'16785369683bec0c48efa3b333e2fe87a0e91f0550a62b84db7c8125ad762264');
const result={schema_version:1,actor:'paragraph_224_builder',role:'independent214planreview',verdict:'PASS_WITH_FLAGS',operational_commit:'219938dcbf05ee0c08813ffce50841ef6e4d37b4',original_review_head:oldP,author_input:{platform:authorP,lessons:authorL},adopted:{platform:'5f06e87d7309fcda05f521d5dc2e0007a7648ec7',lessons:'fdfa286e2984ceaccf9c65939ad9a2f1f1e0eb84'},plan:{path:file,raw_sha256:sha(bytes),lf_sha256:sha(after),physical_lines:621,delta},checks,typography,author_evidence_raw_sha256:sha(authorEvidence),authorCustody,priorCustody,instructionCustody,lesson_preservation:{count:inventory.length,unchanged:1854,files:inventory},independent_original_replay:{source_raw_sha256:sha(read(P,originalPath)),substitutions,write_interception:'in-memory only; old evidence unmodified',checks:replay.checks,negative_design_probes:replay.negative_design_probes,arithmetic:replay.arithmetic,timing:replay.timing,assets:replay.assets,geometry:replay.geometry,bindings:replay.bindings,pending:replay.pending,record_sha256:replay.record_sha256},pupil_production:false,rendered_proof:'NOT_RUN_PLAN_ONLY',root_release:'PENDING actual accepted212/213 plus explicit root decision',current_full_ci:'NOT_RUN'};
fs.writeFileSync(path.join(__dirname,prefix+'evidence.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({verdict:result.verdict,r2_checks:checks.length,replayed_independent_checks:replay.checks.length,replayed_counterexamples:replay.negative_design_probes.length,plan_sha256:sha(bytes),lines:621,changed_lines:delta.length,other_lesson_files_unchanged:1854,placed_pt:typography.placed_pt},null,2));
