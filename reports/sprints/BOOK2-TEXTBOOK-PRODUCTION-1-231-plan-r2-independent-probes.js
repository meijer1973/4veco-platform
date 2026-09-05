// Read-only R2 plan review evidence. Does not build lessons or modify subjects.
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto'),assert=require('assert/strict');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const read=p=>fs.readFileSync(p,'utf8').replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const run=(exe,args,cwd=root)=>{const p=cp.spawnSync(exe,args,{cwd,encoding:'utf8',env:{...process.env,PYTHONIOENCODING:'utf-8'},maxBuffer:32*1024*1024});return{exe,args,cwd,exit:p.status,stdout:p.stdout,stderr:p.stderr};};
const git=(ref,file,cwd=root)=>{const r=run('git',['show',`${ref}:${file}`],cwd);assert.equal(r.exit,0,r.stderr);return r.stdout.replace(/\r\n?/g,'\n');};
const subject='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus/2.3.1-textbook-plan.md';
const plan=read(path.join(lessons,subject)),old=git('80977d94dcf3705841b6541b7cde1ee91dd767ee',subject,lessons);
assert.equal(plan,git('4fe0d742a3cd3c02ac1aaf6311dccc540970e2f5',subject,lessons));
assert.equal(sha(plan),'60d6a743681e1361478395a591b7c82e44acf8c4587a93c4cc842b036cf017b1');
const slice=(text,a,b)=>text.split(a)[1].split(b)[0];
assert.equal(slice(plan,'## Book foundation check','## Part A backward-design plan'),slice(old,'## Book foundation check','## Part A backward-design plan'));
const timingSentence='Core plus support is **64 minutes**; all items total **76–80 minutes**. ';
assert.equal(plan.split(timingSentence).length,2);
assert.equal(slice(plan,'## Part A backward-design plan','### Textbook visuals and answer model').replace(timingSentence,''),slice(old,'## Part A backward-design plan','### Textbook visuals and answer model'));
assert.equal(slice(plan,'#### Answer-model contract','### Part A review and Part B handoff'),slice(old,'#### Answer-model contract','### Part A review and Part B handoff'));
const newRows=plan.split('\n').filter(x=>/^\| `2\.3\.1_(?:fig|we|ex)_/.test(x)).map(x=>x.split('|').slice(1,-1).map(y=>y.trim()));
const oldRows=old.split('\n').filter(x=>/^\| `2\.3\.1_/.test(x)).map(x=>x.split('|').slice(1,-1).map(y=>y.trim()));
assert.equal(newRows.length,15);assert.equal(oldRows.length,15);
const names=newRows.map(r=>r[0].replaceAll('`',''));assert.equal(new Set(names).size,15);
for(let i=0;i<15;i++)assert.deepEqual(newRows[i].slice(1),oldRows[i].slice(1));
for(const row of newRows){assert(row[2].length<=120);assert(/^(Betalingsbereidheid|Assen|Vraaglijn|Consumentensurplus)\b/.test(row[2]));}
assert.equal([2,9,7,2,4,3,8,7,10].reduce((a,b)=>a+b),52);assert.equal(52+12,64);assert.equal(64+8+4,76);assert.equal(64+10+6,80);
const validator=read(path.join(root,'scripts/validate-paragraph.js'));
const grammar=validator.slice(validator.indexOf('  const SURFACE_SUFFIX_SRC ='),validator.indexOf('  for (const base of referencedBases)',validator.indexOf('  const SURFACE_SUFFIX_SRC =')));
const nativeRegex=new Function('parNr',grammar+'; return assetPattern;')('2.3.1');
const files=names.flatMap(n=>['svg','png'].map(ext=>n+'.'+ext));for(const file of files)assert(nativeRegex.test(file),file);
assert.equal(files.length,30);assert.equal(new Set(files).size,30);
const registry=JSON.parse(read(path.join(root,'references/authored/course-target-exercises.json')));
const t=registry.exercises.find(x=>x.id==='2.3.1');assert.equal(sha(JSON.stringify(t)),'a385e00b2fffea168089c32f796668e51ae45cb325504644392f79b20bde8571');
assert.equal(t.lesson_goals.length,4);assert.deepEqual(t.target_exercise.subquestions.map(q=>q.points),[2,3,2,3,2]);
for(const text of [...t.lesson_goals,t.target_exercise.context,...t.target_exercise.subquestions.map(q=>q.prompt)])assert(plan.includes(text));
const prior=JSON.parse(read(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-231-plan-independent-checks.json')));
for(const p of prior.sourcePins.filter(p=>p.file!==subject)){const r=p.repository==='platform'?root:lessons;assert.equal(sha(read(path.join(r,p.file))),p.canonical_lf_sha256,p.file);}
const frozen=JSON.parse(read(path.join(root,'references/data/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1.candidates.json')));assert.equal(frozen.length,12);assert.equal(sha(JSON.stringify(frozen)),prior.frozen12_json_hash);
const models=[['bookfair',40,.5,10,60,900,20,10],['museum',30,1,10,20,200,5,5],['aquarium',24,.5,8,32,256,8,4],['garden',30,.5,10,40,400,10,5],['climbing',24,.5,12,24,144,8,4],['boardgame',20,.5,5,30,225,10,5],['skate',36,.5,12,48,576,12,6],['cafe',28,.5,14,28,196,14,7],['concert',50,.5,20,60,900,20,10]].map(([id,a,b,p,Q,CS,qstep,pstep])=>{
 assert.equal((a-p)/b,Q);assert.equal(Q*(a-p)/2,CS);assert.equal(a-b*Q,p);
 return{id,a,b,p,Q,CS,qmax:a/b,payment:p*Q,qstep,pstep};
});
const metricCode=String.raw`import json
from PIL import ImageFont
f=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',40)
labels=['Consumentensurplus','Betalingsbereidheid','P (€ per kaartje)','Q (kaartjes)','Vraaglijn','CS','Betaling','(0, 50)   (100, 0)   (60, 20)','Basis: 40 kaartjes; hoogte: 20 €/kaartje','Deelnemer','Gekocht: 1, 2 en 3; niet gekocht: 4']
labels+=list(map(str,range(101)))+['P='+str(i) for i in (5,8,10,12,14,20)]
print(json.dumps({t:f.getbbox(t,anchor='ls') for t in labels}))`;
const fontRun=run('C:/Python314/python.exe',['-c',metricCode]);assert.equal(fontRun.exit,0,fontRun.stderr);const metrics=JSON.parse(fontRun.stdout);
const box=(text,x,y,anchor='left')=>{const r=metrics[text];assert(r,text);const shift=anchor==='center'?r[2]/2:anchor==='right'?r[2]:0;return[x+r[0]-shift,y+r[1],x+r[2]-shift,y+r[3]];};
const inside=(r,b,gap=0)=>r[0]>=b[0]+gap&&r[1]>=b[1]+gap&&r[2]<=b[2]-gap&&r[3]<=b[3]-gap;
const fixed=[['title','Consumentensurplus',600,60,'center',[80,20,1120,80]],['discrete_title','Betalingsbereidheid',600,60,'center',[80,20,1120,80]],['P_unit','P (€ per kaartje)',160,135,'left',[160,95,1040,155]],['Q_unit','Q (kaartjes)',600,775,'center',[160,745,1040,800]],['coordinates','(0, 50)   (100, 0)   (60, 20)',600,845,'center',[80,810,1120,875]],['guided_support','Basis: 40 kaartjes; hoogte: 20 €/kaartje',600,845,'center',[80,810,1120,875]],['demand','Vraaglijn',441.6,299,'left',[435,260,615,320]],['categories','Deelnemer',600,775,'center',[160,745,1040,800]],['bought_footer','Gekocht: 1, 2 en 3; niet gekocht: 4',600,845,'center',[80,810,1120,875]]].map(([id,text,x,y,anchor,reserved])=>{const ink=box(text,x,y,anchor);assert(inside(ink,reserved),id);return{id,text,ink,reserved};});
const modelLayout=models.map(m=>{
 const x=q=>160+880*q/m.qmax,y=p=>650-450*p/m.a;
 assert.equal(m.Q%m.qstep,0);assert.equal(m.p%m.pstep,0);
 const qTicks=[],pTicks=[];for(let q=0;q<=m.qmax;q+=m.qstep){const ink=box(String(q),x(q),715,'center');assert(inside(ink,[80,680,1120,735]));qTicks.push({q,ink});}
 for(let p=0;p<=m.a;p+=m.pstep){const ink=box(String(p),130,y(p)+14,'right');assert(inside(ink,[40,180,130,680]));pTicks.push({p,ink});}
 const qGaps=qTicks.slice(1).map((v,i)=>v.ink[0]-qTicks[i].ink[2]);assert(Math.min(...qGaps)>5);
 const pGaps=pTicks.slice(1).map((v,i)=>pTicks[i].ink[1]-v.ink[3]);assert(Math.min(...pGaps)>5);
 const demand=box('Vraaglijn',441.6,299);const demandClear=200+(demand[0]-160)*450/880-demand[3];assert(demandClear>=37);
 const price=box('P='+m.p,1060,y(m.p)+14);assert(inside(price,[1055,200,1180,650]));
 const cs=box('CS',x(.18*m.Q),y(m.p+.38*(m.a-m.p)),'center');
 const csClear={left:cs[0]-160,right:x(m.Q)-cs[2],demand:cs[1]-(200+(cs[2]-160)*450/880),price:y(m.p)-cs[3]};assert(Object.values(csClear).every(v=>v>=8));
 const payment=box('Betaling',x(.30*m.Q),y(.45*m.p),'center');assert(inside(payment,[160,y(m.p),x(m.Q),650],8));
 return{...m,demand_endpoints:[[160,200],[1040,650]],intersection:[x(m.Q),y(m.p)],cs_vertices:[[160,200],[160,y(m.p)],[x(m.Q),y(m.p)]],qTicks,pTicks,q_min_gap:Math.min(...qGaps),p_min_gap:Math.min(...pGaps),demand_label_clearance:demandClear,price,cs,csClear,payment};
});
const bars=[18,14,10,6].map((wtp,i)=>{const x=280+200*i,top=650-450*wtp/20,ink=box(String(wtp),x,top-12,'center');assert(inside(ink,[x-50,top-60,x+50,top-8]));return{wtp,x,top,ink};});
const gaps=[['8',280,349,245],['4',480,394,335]].map(([text,x,y,top])=>{const ink=box(text,x,y,'center');assert(inside(ink,[x-50,top,x+50,425],8));return{text,ink};});
const rootPlanPath='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-successor-binding-plan.md',rootRef='6eb34debb2210a2a4fa6718a13eaeefcacedc8f8';
const rootPlan=git(rootRef,rootPlanPath);assert.equal(rootPlan,git('bdf0c0b3983fa6f776a505a6cab541e748a63dfd',rootPlanPath));assert.equal(sha(read(path.join(root,rootPlanPath))),'a1817d2396ca255a0fd42fa05b42a49b1117cc9333791d9b14ba1fcdc1fd9133');
for(const term of ['exact whole-file expectations','ten212/test_source.py','old long-alt negative fixtures','exactly two literal substitutions','No arbitrary accepted-hash list','Any unrelated generator','stop and obtain a bounded','Four canonical-LF hashes; paragraph MD raw SHA256','All four canonical-LF via lf_hash, including MD'])assert(rootPlan.includes(term),term);
const compatibilityCode=String.raw`import ast,json,subprocess,sys,types,unittest
from pathlib import Path
root=Path.cwd();sys.path.insert(0,str(root/'build-scripts/content/book-2'))
ref='be806c2900b74807ff6c6efb7debde3a15fdc95f';old='89a8fc34f7c017b10af86d6b058bf6ba21328367'
def show(ref,name):return subprocess.check_output(['git','show',ref+':build-scripts/content/book-2/'+name],cwd=root).decode('utf-8').replace('\r\n','\n')
bonus=types.ModuleType('test_bonus');bonus.__file__=str(root/'build-scripts/content/book-2/212/test_bonus.py');exec(compile(show(ref,'212/test_bonus.py'),bonus.__file__,'exec'),bonus.__dict__);sys.modules['test_bonus']=bonus
meta=types.ModuleType('review_metadata');meta.__file__=str(root/'build-scripts/content/book-2/212/test_metadata.py');exec(compile(show(ref,'212/test_metadata.py'),meta.__file__,'exec'),meta.__dict__)
sources={name:show(ref,'212/'+name) for name in bonus.SOURCES}
test=bonus.BonusTests();test.sources=sources
for name in ('test_current_exact_full_source_and_three_criteria','test_missing_extra_and_misplaced_criteria_rejected','test_model_answer_and_unrelated_source_drift_rejected'):getattr(test,name)()
count=0
for name in meta.SOURCES:
 expected=meta.source_replacement(meta.original('build-scripts/content/book-2/212/'+name))
 if name=='answers.md':expected=bonus.insertion(expected)
 assert expected==sources[name],name
 count+=sources[name].count('{alt="')
assert count==9
def tests(src):
 tree=ast.parse(src)
 return {n.name:ast.dump(n,include_attributes=False) for cls in tree.body if isinstance(cls,ast.ClassDef) for n in cls.body if isinstance(n,ast.FunctionDef) and n.name.startswith('test_')}
oldtests=tests(show(old,'212/test_source.py'));newtests=tests(show(ref,'212/test_source.py'));assert len(oldtests)==10 and oldtests==newtests
om=tests(show(old,'212/test_metadata.py'));nm=tests(show(ref,'212/test_metadata.py'));changes=[n for n in om if om[n]!=nm[n]];assert changes==['test_nine_exact_native_insertions_and_unchanged_full_sources']
oldmeta=show(old,'212/test_metadata.py');oldline='            self.assertEqual(actual, source_replacement(previous), name)';newline="            expected = source_replacement(previous)\n            if name == 'answers.md':\n                from test_bonus import insertion\n                expected = insertion(expected)\n            self.assertEqual(actual, expected, name)"
assert oldmeta.count(oldline)==1 and show(ref,'212/test_metadata.py')==oldmeta.replace(oldline,newline,1)
prior=meta.original('build-scripts/content/book-2/b2_212.py');start='    for name, fixed, variable, price, qmax, ymax, qticks, yticks, qunit, period, complete in cases:'
insert='    titles = {\n'+''.join(f'        "{key}": "{value}",\n' for key,value in meta.TITLES.items())+'    }\n'
expected=prior.replace(start,insert+start).replace('name + ": TK en TO" if complete else "Bloempotten: alleen TK"','titles[name] if complete else "Bloempotten: alleen TK"')
assert expected==show(ref,'b2_212.py')
assert expected+'\n# unrelated\n'!=expected
print(json.dumps({'read_only_published_212_ref':ref,'original_ten_source_test_AST_preserved':True,'metadata_full_file_exact_allowed_substitution_only':True,'metadata_test_count':len(nm),'metadata_test_AST_changes':changes,'nine_alt_insertions':count,'complete_source_expected_transform_match':True,'generator_entire_existing_expectation_match':True,'actual_pure_bonus_expectation_tests':3,'no_student_acceptance':True}))`;
const compatibilityRun=run('C:/Python314/python.exe',['-c',compatibilityCode]);assert.equal(compatibilityRun.exit,0,compatibilityRun.stderr);
const commands=[['node',['build-scripts/workflows/check-book-outline-currentness.js']],...['specialist_review','paragraph_production'].map(a=>['node',['build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action',a,'--paragraph','2.3.1']]),['node',['build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']],['git',['diff','--check']]].map(([exe,args])=>run(exe,args));commands.forEach(c=>assert.equal(c.exit,0,c.stderr));
const result={date:'2026-09-06',timezone:'Europe/Amsterdam',reviewer:'paragraph_213_r6_independent_review',subject:{lessons:'4fe0d742a3cd3c02ac1aaf6311dccc540970e2f5',platform:'0bfff71873abb4d8754839d81b95773e53dfe6ff',path:subject,canonical_lf_sha256:sha(plan)},preservation:{foundation_exact:true,full_goal_task_bonus_section_exact_except_explicit_total_time_sentence:true,full_answer_contract_exact:true,all15_role_alt_economic_geometry_descriptions_exact:true,target_record_sha256:sha(JSON.stringify(t)),frozen12_sha256:sha(JSON.stringify(frozen))},asset_names:{grammar:nativeRegex.toString(),files,all30_valid:true,planned_alts:newRows.map(r=>({stem:r[0],alt:r[2],characters:r[2].length}))},typography:{font_path:'C:/Windows/Fonts/arial.ttf',font_raw_sha256:sha(fs.readFileSync('C:/Windows/Fonts/arial.ttf')),canvas:[1200,900],source_px:40,content_width_mm:166,printed_font_pt:40*166*72/25.4/1200,minimum_width_mm_for_12pt:127,fixed,modelLayout,discrete:{bars,gaps,price_y:425},actual_figures_rendered:false,font_command:fontRun},timing:{core:52,core_with_support:64,all:[76,80],observation:'UNOBSERVED'},separate_successor_subject:{ref:rootRef,path:rootPlanPath,canonical_lf_sha256:sha(rootPlan),correction_blob_identical:true,not_imported:true,compatibility:JSON.parse(compatibilityRun.stdout),compatibility_command:compatibilityRun},commands,boundary:'Plan review only. No sources/generators/canonical decisions changed; no student PDF/asset created; no production authorization.'};
fs.writeFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-231-plan-r2-independent-checks.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({plan_hash:sha(plan),successor_hash:sha(rootPlan),native_names:files.length,source_font_pt:30,final_figure_font_pt:result.typography.printed_font_pt,nine_model_box_checks:true,unchanged_economic_sections:true,compatibility:result.separate_successor_subject.compatibility,commands:commands.map(c=>c.exit)},null,2));
