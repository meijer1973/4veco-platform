// Post-payload committed scope evidence. Never substitutes working-tree scope.
const fs=require('fs'),path=require('path'),cp=require('child_process'),assert=require('assert/strict');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const base='788145fbdbb8731c8dd7d836a07cf259932780e2',lessonBase='80977d94dcf3705841b6541b7cde1ee91dd767ee';
const main='96416b6b5bd57094576e9aba0a42d682584ec479';
const payload=process.argv[2];assert(/^[a-f0-9]{40}$/.test(payload),'pass exact committed payload');
const run=(exe,args,cwd=root)=>{const r=cp.spawnSync(exe,args,{cwd,encoding:'utf8',maxBuffer:64*1024*1024});return {exe,args,cwd,exit:r.status,stdout:r.stdout,stderr:r.stderr};};
const checked=(args,cwd=root)=>{const r=run('git',args,cwd);assert.equal(r.exit,0,r.stderr);return r.stdout.trim();};
const paths=checked(['diff','--name-only',base,payload]).split('\n').filter(Boolean);
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-';
const expected=['231-plan-independent-review-plan.md','231-plan-independent-probes.js','231-plan-independent-checks.json','231-plan-independent-review.md','successor-binding-independent-review.md','231-plan-independent-scope.js'].map(p=>prefix+p).sort();
assert.deepEqual(paths.sort(),expected);
assert.equal(checked(['rev-parse','HEAD'],lessons),lessonBase);
assert.equal(checked(['status','--porcelain'],lessons),'');
assert.equal(checked(['diff','--name-only',lessonBase,'HEAD'],lessons),'');
checked(['merge-base','--is-ancestor',main,payload]);
const lessonMain=checked(['rev-parse','origin/main'],lessons);
checked(['merge-base','--is-ancestor',lessonMain,lessonBase],lessons);
const configurations=[
 {name:'own_narrow_evidence_only',args:['--lane','shared','--base',base,'--head',payload,'--json'],expectedExit:1},
 {name:'complete_actual_platform_candidate',args:['--lane','shared','--base',main,'--head',payload,'--json'],expectedExit:0},
 {name:'complete_actual_lesson_candidate_unchanged_by_reviewer',args:['--cwd',lessons,'--lane','textbook','--base',lessonMain,'--head',lessonBase,'--json'],expectedExit:0},
];
const native=configurations.map(c=>{const r=run('node',['build-scripts/workflows/check-paragraph-lane-scope.js',...c.args]);assert.equal(r.exit,c.expectedExit,r.stdout+r.stderr);const result=JSON.parse(r.stdout);if(c.name==='own_narrow_evidence_only'){assert.deepEqual(result.categories.shared_platform,[]);assert.deepEqual(result.categories.unknown,[]);}return {name:c.name,...r,result};});
const result={date:'2026-09-05',reviewer:'paragraph_213_r6_independent_review',kind:'actual_post_payload_committed_scope',payload,lesson_head:lessonBase,own_base:base,complete_platform_base:main,complete_lesson_base:lessonMain,strict_own_path_audit:{result:'PASS',exact_paths:paths},lesson_scope:{result:'UNCHANGED',committed_diff:[],working_tree_status:[]},native,interpretation:'Narrow evidence-only shared lane FAIL is retained honestly. Whole-candidate PASS does not relabel it. No source filler, exception or waiver was added. Scope helper/evidence and generated indexes are not pupil or acceptance work.'};
fs.writeFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-231-plan-independent-scope.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({payload,lesson_head:lessonBase,own_paths:paths.length,native:native.map(n=>({name:n.name,exit:n.exit,ok:n.result.ok,failures:n.result.failures,categories:Object.fromEntries(Object.entries(n.result.categories).map(([k,v])=>[k,v.length]))}))},null,2));
