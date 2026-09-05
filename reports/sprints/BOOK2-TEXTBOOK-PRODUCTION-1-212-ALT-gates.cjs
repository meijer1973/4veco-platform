// HOW TO ADAPT: fixed bounded §212 command recorder; no acceptance promotion.
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const root=path.resolve(__dirname,'../..');
const prefix=path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-command-log');
const py='C:/Python314/python.exe';
const folder=path.resolve(root,'../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even');
const evidence='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-evidence.py';
const mode=process.argv[2];
const runs=[];
function add(exe,args,expected=0,cwd=root){runs.push({exe,args,expected,cwd});}
const n=(...a)=>add('node',a);
const p=(...a)=>add(py,a);
if(mode==='baseline'){
  p(evidence,'baseline');
  n('build-scripts/workflows/check-book-outline-currentness.js');
  n('build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.1.2');
  n('build-scripts/workflows/check-book2-target-authority-remediation.js','--durable');
  n('build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1');
  p('build-scripts/content/book-2/212/test_source.py');
  p('build-scripts/content/book-2/212/check_render.py','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-baseline-render-r5.json');
  add(py,['build-scripts/content/book-2/212/test_metadata.py'],1);
}else if(mode==='build'){
  p('build-scripts/content/book-2/b2_212.py','--lesson-root','../4veco-lessen','--proof-root','reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1','--proof-suffix','r6','--manifest','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-build-r6.json');
}else if(mode==='verify'){
  p('build-scripts/content/book-2/212/test_source.py');
  p('build-scripts/content/book-2/212/test_metadata.py');
  p('build-scripts/content/book-2/212/check_render.py','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-ALT-render-check-r6.json');
  p(evidence,'verify');
  p(evidence,'print_rebuild');
  p(evidence,'grayscale');
  n('scripts/validate-paragraph.js','--mode','part-a','--profile','student-web',folder);
  n('scripts/validate-paragraph.js','--mode','part-a','--profile','publisher-print',folder);
  n('build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.1.2');
  n('build-scripts/workflows/check-book2-target-authority-remediation.js','--durable');
  n('build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1');
}else if(mode==='prepublish'){
  add('git',['fetch','--prune','origin']);
  add('git',['fetch','--prune','origin'],0,path.resolve(root,'../4veco-lessen'));
  n('build-scripts/review-gates/check-governance-freshness.js');
  n('build-scripts/ci/check-agent-worktree-safety.js','--check','--task','book2-212-alt-correction-20260905','--agent','paragraph_212_alt_builder','--require-prefix','codex/,agent/');
  add('node',[path.join(root,'build-scripts/ci/check-agent-worktree-safety.js'),'--check','--task','book2-212-alt-correction-20260905','--agent','paragraph_212_alt_builder','--require-prefix','codex/,agent/'],0,path.resolve(root,'../4veco-lessen'));
  add('git',['diff','--check']);
  add('git',['diff','--check'],0,path.resolve(root,'../4veco-lessen'));
}else if(mode==='scope'){
  const phead=cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
  const lhead=cp.execFileSync('git',['rev-parse','HEAD'],{cwd:path.resolve(root,'../4veco-lessen'),encoding:'utf8'}).trim();
  n('build-scripts/workflows/check-paragraph-lane-scope.js','--lane','shared','--base','798cacfeeb40e4e0ba54d26f2b040cbdeec327a9','--head',phead);
  n('build-scripts/workflows/check-paragraph-lane-scope.js','--cwd','../4veco-lessen','--lane','textbook','--base','a2bb4bcf199b8871eef21426f329efb6795e7dd8','--head',lhead);
}else throw new Error('Use baseline, build, verify or scope');
let unexpected=false;
for(const cmd of runs){
  const begin=new Date().toISOString();
  const result=cp.spawnSync(cmd.exe,cmd.args,{cwd:cmd.cwd,encoding:'utf8',maxBuffer:32*1024*1024,env:{...process.env,PYTHONIOENCODING:'utf-8'}});
  const row={mode,started_at:begin,ended_at:new Date().toISOString(),...cmd,exit:result.status,stdout:result.stdout||'',stderr:result.stderr||'',error:result.error?.message||null};
  fs.appendFileSync(prefix+'.jsonl',JSON.stringify(row)+'\n');
  const passed=row.exit===cmd.expected;
  fs.appendFileSync(prefix+'.md',`\n### ${begin}: ${mode}\n\nCommand: ${JSON.stringify([cmd.exe,...cmd.args])}\n\nExit: ${row.exit}. Expected: ${cmd.expected}. ${passed?'Matched expected outcome.':'Unexpected outcome; see JSONL.'}\n`);
  console.log(JSON.stringify({mode,command:cmd.args,exit:row.exit,expected:cmd.expected}));
  if(!passed){unexpected=true;console.log((row.stderr+'\n'+row.stdout).slice(-6000));break;}
}
process.exitCode=unexpected?1:0;
