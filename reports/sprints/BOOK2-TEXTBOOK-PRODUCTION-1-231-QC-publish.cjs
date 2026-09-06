/* HOW TO ADAPT: scoped QC publication diagnostics. No PR, merge, source or
 * handoff mutation. Final mode prints evidence without dirtying terminal tail. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen'),Q=path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-231-QC');
const branch='agent/book2-231-qc-20260906', baseP='35e0bebb75cc3987c43dd8f480e1b444bd877f4a',baseL='219a977e495abe43c17949e7d8996aab4176faa0';
const stem='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus';
const quality=stem+'/2.3.1-quality-ref.yaml',checker='build-scripts/workflows/check-paragraph-lane-scope.js';
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const j=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:64*1024*1024}).trim();
const lines=s=>s.split(/\r?\n/).filter(Boolean);
const save=(s,v)=>fs.writeFileSync(Q+'-'+s+'.json',JSON.stringify(v,null,2)+'\n',{flag:'wx'});
function run(name,cwd,command,args,allowed=[0],record=true,env=process.env){
 const started_at=new Date().toISOString(),r=cp.spawnSync(command,args,{cwd,encoding:'utf8',maxBuffer:64*1024*1024,env});
 const o={name,cwd,command,args,started_at,finished_at:new Date().toISOString(),exit_code:r.status,stdout:r.stdout,stderr:r.stderr};
 if(record)save(name+'-process',o);
 console.log(JSON.stringify(o,null,2));assert(allowed.includes(r.status),name+' unexpected status');return o;
}
function ownP(s,allowIndex=false){return /^reports\/sprints\/BOOK2-TEXTBOOK-PRODUCTION-1-231-QC[-/.]/.test(s)||
 /^reports\/sprints\/BOOK2-TEXTBOOK-PRODUCTION-1-231-build-(attempt|manifest)-r(17|18|19)\.json$/.test(s)||
 /^reports\/rendered-proof\/BOOK2-TEXTBOOK-PRODUCTION-1\/231-(paragraaf|opgaven|antwoorden)-[a-f0-9]{12}-r(17|18|19)\//.test(s)||
 (allowIndex&&/^reports\/github-agent-index-(platform|lessen)\.(json|md)$/.test(s));}
function checks(record=true){
 for(const [name,cwd] of [['platform',P],['lessons',L]])
  run(name+'-claim-v2',cwd,'node',[path.join(P,'build-scripts/ci/check-agent-worktree-safety.js'),'--check','--task','BOOK2-TEXTBOOK-PRODUCTION-1-231-QC','--agent','paragraph_231_specialist_qc','--require-prefix','codex/,agent/'],[0],record);
}
const mode=process.argv[2];
if(mode==='prepare'){
 checks();
 run('governance-final',P,'node',['build-scripts/review-gates/check-governance-freshness.js']);
 const yaml=fs.readFileSync(path.join(L,quality),'utf8');
 assert.deepEqual(yaml.split(/\r?\n/).filter(s=>/^\S/.test(s)),['schema_version: 2','partA:']);
 for(const key of ['root_validation','root_acceptance','handoff_renewal'])assert(yaml.includes('  '+key+': "PENDING"'));
 for(const key of ['production_ready','production_ready_with_flags'])assert(yaml.includes('  '+key+': false'));
 const baseline=j(Q+'-reservation-and-baseline.json');
 for(const [s,h]of Object.entries(baseline.native45))assert.equal(hash(path.join(L,s)),h,s);
 for(const [s,h]of Object.entries(baseline.old_sources_and_history))assert.equal(hash(path.join(P,s)),h,s);
 const refs=[['review_file','review_raw_sha256',path.join(L,stem,'2.3.1-review.md')],
 ['inspection_file','inspection_raw_sha256',Q+'-personal-inspection-r17.json'],
 ['reproduction_file','reproduction_raw_sha256',Q+'-native-reproduction.json'],
 ['independent_probes_file','independent_probes_raw_sha256',Q+'-probes-result.json']];
 for(const [,key,file]of refs)assert.equal(yaml.match(new RegExp('\\s'+key+': "([a-f0-9]+)"'))[1],hash(file));
 const bindings={captured_at:new Date().toISOString(),platform_base:baseP,lessons_base:baseL,
  canonical_quality_ref:{path:quality,raw_sha256:hash(path.join(L,quality)),canonical_lf_sha256:crypto.createHash('sha256').update(yaml.replaceAll('\r\n','\n')).digest('hex')},
  report:{path:path.relative(P,Q+'-report.md').replaceAll('\\','/'),raw_sha256:hash(Q+'-report.md')},
  references:refs.map(([,,file])=>({path:file,raw_sha256:hash(file)})),unchanged_lesson45:45,unchanged_old_sources_reports:Object.keys(baseline.old_sources_and_history).length,
  source_authorship_changes:0,root_validation:'PENDING',root_acceptance:'PENDING',handoff_renewal:'PENDING'};
 save('final-bindings',bindings);
 assert.equal(git(P,'diff','--name-only'),'');assert.equal(git(L,'diff','--name-only'),'');
 const up=lines(git(P,'ls-files','--others','--exclude-standard')), ul=lines(git(L,'ls-files','--others','--exclude-standard'));
 assert(up.every(s=>ownP(s)),up.filter(s=>!ownP(s)).join('\n'));assert.deepEqual(ul,[quality]);
 for(let i=0;i<up.length;i+=30)git(P,'add','--',...up.slice(i,i+30));
 git(L,'add','--',quality);
 console.log(JSON.stringify({staged_platform:up.length,staged_lessons:ul.length,bindings},null,2));
}else if(mode==='scope'){
 const ph=git(P,'rev-parse','HEAD'),lh=git(L,'rev-parse','HEAD');
 const ownPlatform=lines(git(P,'-c','core.quotepath=false','diff','--name-only',baseP+'..'+ph));
 const ownLessons=lines(git(L,'-c','core.quotepath=false','diff','--name-only',baseL+'..'+lh));
 assert(ownPlatform.every(s=>ownP(s)));assert.deepEqual(ownLessons,[quality]);
 save('strict-own-scope',{status:'PASS',platform_base:baseP,platform_head:ph,lessons_base:baseL,lessons_head:lh,platform_paths:ownPlatform,lessons_paths:ownLessons,quality_blocks:['partA'],source_edits:0,unknown_paths:0});
 for(const [name,cwd,lane,base,head,allowed]of [
  ['own-platform',P,'shared',baseP,ph,[1]],['own-lessons',L,'textbook',baseL,lh,[0]],
  ['candidate-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',ph,[0]],
  ['candidate-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',lh,[0]]]){
  const r=run('scope-'+name,P,'node',[checker,'--cwd',cwd,'--lane',lane,'--base',base,'--head',head,'--json'],allowed);
  const result=JSON.parse(r.stdout);assert.equal(result.categories.unknown.length,0);
 }
}else if(mode==='format-own-log'){
 const file=Q+'-command-log.md',original=fs.readFileSync(file),jsonlHash=hash(Q+'-command-log.jsonl');
 fs.writeFileSync(Q+'-command-log-native-before-format.txt',original,{flag:'wx'});
 const formatted=original.toString('utf8').replaceAll('\r\n','\n').replaceAll('\r','\n').split('\n').map(s=>s.trimEnd()).join('\n');
 fs.writeFileSync(file,formatted);
 assert.equal(hash(Q+'-command-log.jsonl'),jsonlHash);
 save('command-log-formatting',{original_raw_sha256:hash(Q+'-command-log-native-before-format.txt'),formatted_markdown_sha256:hash(file),immutable_jsonl_sha256:jsonlHash,transformation:'Only own readable Markdown log CRLF to LF/trailing whitespace; original raw bytes archived, JSONL unchanged; no foreign evidence modified'});
}else if(mode==='final'){
 const env={...process.env,FOURVECO_LESSEN_ROOT:L,FOURVECO_LESSEN_SOURCE_REF:'HEAD',FOURVECO_LESSEN_SOURCE_BRANCH:branch};
 run('terminal-index-freshness',P,'node',['build-scripts/reports/check-agent-index-freshness.js'],[0],false,env);
 run('terminal-url-freshness',P,'node',['build-scripts/sprints/emit-url-index.js','--check'],[0],false);
 const result=[];
 for(const [name,cwd,base]of [['platform',P,baseP],['lessons',L,baseL]]){
  run(name+'-terminal-clean-claim',cwd,'node',[path.join(P,'build-scripts/ci/check-agent-worktree-safety.js'),'--check','--task','BOOK2-TEXTBOOK-PRODUCTION-1-231-QC','--agent','paragraph_231_specialist_qc','--require-prefix','codex/,agent/','--require-clean'],[0],false);
  assert.equal(git(cwd,'status','--porcelain'),'');assert.equal(git(cwd,'branch','--show-current'),branch);
  const head=git(cwd,'rev-parse','HEAD'),remote=git(cwd,'ls-remote','origin','refs/heads/'+branch).split(/\s+/)[0];
  assert.equal(head,remote);assert.equal(head,git(cwd,'rev-parse','origin/'+branch));
  const paths=lines(git(cwd,'-c','core.quotepath=false','diff','--name-only',base+'..'+head));
  assert(name==='platform'?paths.every(s=>ownP(s,true)):JSON.stringify(paths)===JSON.stringify([quality]));
  result.push({name,head,remote,clean:true,branch,strict_scope:'PASS',paths:paths.length});
 }
 const tail=lines(git(P,'diff','--name-only','HEAD^..HEAD'));assert.deepEqual(tail.sort(),['reports/github-agent-index-lessen.json','reports/github-agent-index-lessen.md','reports/github-agent-index-platform.json','reports/github-agent-index-platform.md']);
 console.log(JSON.stringify({terminal_pair:result,index_tail:tail,root_validation:'PENDING',root_acceptance:'PENDING',handoff_renewal:'PENDING'},null,2));
}else throw Error('Use prepare/scope/final');
