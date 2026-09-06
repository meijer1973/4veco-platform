'use strict';
// HOW TO ADAPT: explicit own task/prefix/bases. Read-only plan review, no build.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const PREFIX='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-F1-REVIEW';
const BP='c725c37d2081f6ac7846b8e172dcd7590f6611e9',BL='266881cb2d9e7f078192a2a3bab230f9bfc4176e';
const REL='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.2 Producentensurplus en totaal surplus/2.3.2-textbook-plan.md';
const indexes=['platform','lessen'].flatMap(r=>['json','md'].map(e=>`reports/github-agent-index-${r}.${e}`));
const bytes=(root,file)=>fs.readFileSync(path.join(root,file));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(root,...args)=>cp.execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:128*1024*1024}).trim();
const names=(root,...args)=>git(root,...args).split('\0').filter(Boolean);
const save=(label,value)=>fs.writeFileSync(path.join(P,PREFIX+'-'+label+'.json'),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
function command(label,cwd,argv,expected=0){
 const env={...process.env,PYTHONIOENCODING:'utf-8',PYTHONDONTWRITEBYTECODE:'1'};
 const started=new Date().toISOString(),r=cp.spawnSync(argv[0],argv.slice(1),{cwd,env,encoding:'utf8',maxBuffer:128*1024*1024});
 const record={argv,cwd,started_utc:started,finished_utc:new Date().toISOString(),child_environment:{PYTHONIOENCODING:'utf-8',PYTHONDONTWRITEBYTECODE:'1',PATH:'inherited unchanged; no native rendering'},exit_code:r.status,stdout:r.stdout,stderr:r.stderr};
 save(label+'-process',record);console.log(label+': '+r.status);assert.equal(r.status,expected,JSON.stringify(record));
}
const mode=process.argv[2];
if(mode==='baseline'){
 assert.equal(git(L,'rev-parse','HEAD'),BL);assert.equal(git(L,'status','--porcelain'),'');
 assert.equal(sha(bytes(L,REL)),'d0781ffb6d2966209c3a160309316ce92ebc0455fa51d4235ccc6840afa58935');
 const previousOwnP='b3773c9b2a085ff83e82d7e71384ef10337d7c9c',previousOwnL='a52206c0cc9e2578b57e285909c77134bb47657e';
 const candidates=JSON.parse(bytes(P,'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-F1-baseline.json')).instructions;
 const extra=['agents/visual-qa-agent.md','agents/accessibility-agent.md','docs/workflows/paragraph-quality-ref-schema-v2.md'];
 for(const f of extra)if(!candidates.some(x=>x.path===f))candidates.push({repository:'4veco-platform',path:f});
 const instructions=candidates.map(v=>{
  const root=v.repository==='4veco-platform'?P:L,base=root===P?previousOwnP:previousOwnL;
  const old=cp.execFileSync('git',['show',base+':'+v.path],{cwd:root,maxBuffer:16*1024*1024});
  const current=bytes(root,v.path);assert(current.equals(old),'Read complete changed instruction before execution: '+v.path);
  return {repository:v.repository,path:v.path,raw_sha256:sha(current),same_as_prior_personally_read_input:base,
    reading_attribution:'This actor\'s own preceding 223/212/214 mandatory reads; current review/didactic/precision/boundary/template/AGENTS and scoped 232 material freshly reread. No attribution of author instruction reading.'};
 });
 const preservation=[['platform',P,BP],['lessons',L,BL]].map(([repository,root,base])=>({repository,base,files:names(root,'ls-tree','-r','--name-only','-z',base).map(f=>{const b=bytes(root,f);return {path:f,bytes:b.length,sha256:sha(b)};})}));
 const history=preservation[0].files.filter(v=>v.path.startsWith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-')&&v.path.endsWith('.json'));
 const expected={review:'9f9c69c0bce19dc42d5f958bd665a5fcde8fa5d65be638cf34b37e043803c875',author:'7466ad47ad561264e907d04141c8672c8f2633d2f9bb8735fe79e3e86dd4ea78',delta:'61edb07d33a0b50ef58904fd689685d90f47e586f537b17d831e848b39dd3d5a'};
 for(const [name,file]of [['review','232-PLAN-REVIEW-report.md'],['author','232-PLAN-F1-report.md'],['delta','232-PLAN-F1-allowed-delta.json']])assert.equal(sha(bytes(P,'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-'+file)),expected[name]);
 save('baseline',{pass:true,platform_input:BP,lessons_input:BL,operational_commit:'9eefd24484ad7f69eb9c032328de23fedf650c5a',instructions,preservation,history,expected,lesson_changes_allowed:[],rendered_generation:false});
 console.log(JSON.stringify({instructions:instructions.length,prior_files:preservation.map(x=>({repository:x.repository,count:x.files.length})),historical_json:history.length}));
}else if(mode==='command'){
 command(process.argv[3],P,process.argv.slice(4));
}else if(mode==='gates'){
 const tag=process.argv[3]||'current';
 command(tag+'-structural',P,['node','build-scripts/workflows/check-book-outline-currentness.js']);
 command(tag+'-goal-design',P,['node','build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','goal_design','--paragraph','2.3.2']);
 command(tag+'-durable',P,['node','build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']);
 command(tag+'-bundle',P,['node','build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1']);
 command(tag+'-governance',P,['node','build-scripts/review-gates/check-governance-freshness.js']);
 for(const [name,cwd]of [['platform',P],['lessons',L]])command(tag+'-claim-'+name,cwd,['node',path.join(P,'build-scripts/ci/check-agent-worktree-safety.js'),'--check','--task','BOOK2-TEXTBOOK-PRODUCTION-1-232-F1-REVIEW','--agent','paragraph_214_builder','--require-prefix','codex/,agent/']);
}else if(mode==='custody'){
 const b=JSON.parse(bytes(P,PREFIX+'-baseline.json'));let checked=0;
 for(const repo of b.preservation){const root=repo.repository==='platform'?P:L;for(const f of repo.files){if(root===P&&indexes.includes(f.path))continue;assert.equal(sha(bytes(root,f.path)),f.sha256,f.path);checked++;}}
 assert.equal(git(L,'status','--porcelain'),'');assert.equal(git(L,'rev-parse','HEAD'),BL);
 const current=[...new Set([...names(P,'diff','--name-only','-z',BP),...names(P,'ls-files','--others','--exclude-standard','-z')])];
 assert(current.every(f=>f.startsWith(PREFIX+'-')||indexes.includes(f)),current.filter(f=>!f.startsWith(PREFIX+'-')&&!indexes.includes(f)));
 console.log(JSON.stringify({pass:true,raw_input_files_preserved:checked,lesson_changes:0,historical_json_preserved:b.history.length,only_platform_changes_own_or_four_indexes:true,rendered_generation:false}));
}else throw Error('baseline/command/gates/custody');
