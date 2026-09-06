// Exact committed acceptance payload; preserve every historical diagnostic.
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),a=require('assert/strict'),crypto=require('crypto');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-231-root-acceptance';
const base='f257056d0a455c660ccb598cb4da734b36eefd80',head=process.argv[2];
const lb='219a977e495abe43c17949e7d8996aab4176faa0',lh='3199ff2ae89b39a472b48ee0818de5b1c191063a';
const commands=[],hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const raw=n=>hash(fs.readFileSync(n));
a.match(head,/^[0-9a-f]{40}$/);
function run(args,cwd=P,expected=0){
  const r=cp.spawnSync(args[0],args.slice(1),{cwd,maxBuffer:64*1024*1024});
  const row={args,cwd,exit_code:r.status,stdout:r.stdout.toString('utf8'),stderr:r.stderr.toString('utf8'),stdout_base64:r.stdout.toString('base64'),stderr_base64:r.stderr.toString('base64')};
  commands.push(row);if(expected!==null)a.equal(r.status,expected,JSON.stringify(row));return row;
}
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,maxBuffer:64*1024*1024});
a.equal(run(['git','rev-parse','HEAD']).stdout.trim(),head);
a.equal(run(['git','rev-parse','HEAD'],L).stdout.trim(),lh);
a.equal(run(['git','status','--porcelain'],L).stdout.trim(),'');
const baseline=JSON.parse(fs.readFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-231-root-qc-evidence/baseline.json'),'utf8'));
const imported=new Map(baseline.imports.map(r=>[r.path,r]));a.equal(imported.size,209);
for(const row of imported.values()){
  a.equal(raw(path.join(P,row.path)),row.sha256,row.path);
  a(fs.readFileSync(path.join(P,row.path)).equals(git(P,'show',row.commit+':'+row.path)),row.path);
}
const extras=new Set(['reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.md','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.jsonl','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-output-manifest.md']);
const changed=run(['git','diff','--name-only','--no-renames','-z',base,head]).stdout.split('\0').filter(Boolean);
const owned=[];
for(const name of changed){
  const own=name.startsWith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-root-qc-')||name.startsWith('reports/sprints/'+prefix)||/^reports\/rendered-proof\/BOOK2-TEXTBOOK-PRODUCTION-1\/231-(?:paragraaf|opgaven|antwoorden)-[0-9a-f]{12}-r(?:20|21|22)\//.test(name);
  a(imported.has(name)||extras.has(name)||own,name);
  const bytes=git(P,'show',head+':'+name);a(fs.readFileSync(path.join(P,name)).equals(bytes),name);
  owned.push({path:name,sha256:hash(bytes),imported:imported.has(name)});
}
const canonical='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus';
const lpaths=run(['git','diff','--name-only','--no-renames','-z',lb,lh],L).stdout.split('\0').filter(Boolean);
a.deepEqual(lpaths.sort(),[canonical+'/2.3.1-quality-ref.yaml',canonical+'/2.3.1-textbook-handoff.md'].sort());
const scopes=[];
for(const [label,cwd,lane,b,h,expected]of[
  ['incremental-platform',P,'shared',base,head,1],
  ['incremental-lessons',L,'textbook',lb,lh,0],
  ['complete-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',head,0],
  ['complete-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',lh,0]]){
  const cmd=run(['node','build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',b,'--head',h,'--json'],P,expected);
  const result=JSON.parse(cmd.stdout);a.equal(result.categories.unknown.length,0,label);
  a.equal(result.ok,expected===0,label);
  if(expected===1)a.deepEqual(result.failures,['shared lane needs at least one shared platform change','generated index/report or review-evidence changes are allowed only with lane-owned changes']);
  scopes.push({label,result});
}
const white=run(['git','diff','--check',base,head],P,null);
const cr=run(['git','-c','core.whitespace=cr-at-eol','diff','--check',base,head],P,null);
const archive='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-QC-command-log-native-before-format.txt';
a.equal(white.exit_code,2);a.equal(cr.exit_code,0);
const whitespacePaths=[...new Set([...white.stdout.matchAll(/^(.+?):\d+: (?:trailing whitespace|new blank line at EOF)\.?$/gm)].map(m=>m[1]))];
a.deepEqual(whitespacePaths,[archive]);a(imported.has(archive));
run(['git','diff','--check',base,head,'--','.',':(exclude)'+archive]);
run(['git','diff','--check',lb,lh],L);
// Preserve complete-candidate diagnostics too; no false whole-diff PASS.
const completeWhite=run(['git','diff','--check','96416b6b5bd57094576e9aba0a42d682584ec479',head],P,null);
const completeCr=run(['git','-c','core.whitespace=cr-at-eol','diff','--check','96416b6b5bd57094576e9aba0a42d682584ec479',head],P,null);
const manifest=fs.readFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-output-manifest.md'),'utf8');
const rows=[...manifest.matchAll(/^\| (\d+) \| ([^|]+) \| ([^|]+) \| ([ACLP]) \| `([^`]+)` \|$/gm)];
a.equal(rows.length,41);a.equal(new Set(rows.map(m=>m[5])).size,41);
const hashes=new Map([...manifest.matchAll(/^\| ([^|]+) \/ ([^|]+) \| `([a-f0-9]{64})` \|/gm)].map(m=>[m[1].trim()+'/'+m[2].trim(),m[3]]));
a.equal(hashes.size,21);
const counts={A:0,C:0,L:0,P:0},inventory=[];
for(const row of rows){
  const id=row[2].trim(),edition=row[3].trim(),status=row[4],rel='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/'+row[5],file=path.join(L,rel),present=fs.existsSync(file);
  counts[status]++;a.equal(present,status!=='P',rel);
  const digest=present?raw(file):null;
  if(status==='A'||status==='C')a.equal(digest,hashes.get(id+'/'+edition),rel);
  if(status==='L')a.equal(digest,hash(git(L,'show','f09fd6e88edc5049b026b16b0158e7e188091d2d:'+rel)),rel);
  if(present)a.equal(digest,hash(git(L,'show',lh+':'+rel)),rel);
  inventory.push({id,edition,status,path:rel,present,sha256:digest});
}
a.deepEqual(counts,{A:12,C:9,L:8,P:12});
const output={status:'PASS',platform:{base,head},lessons:{base:lb,head:lh,changed:lpaths},strict_owned_paths:owned,scopes,whitespace:{incremental_default_exit:white.exit_code,incremental_cr_at_eol_exit:cr.exit_code,exact_historical_archive:imported.get(archive),all_other_incremental_paths_exit:0,complete_default_exit:completeWhite.exit_code,complete_cr_at_eol_exit:completeCr.exit_code,diagnostics_preserved:true,no_global_config_change:true},inventory_counts:counts,inventory,commands};
fs.writeFileSync(path.join(__dirname,prefix+'-scope.json'),JSON.stringify(output,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:output.status,head,owned_paths:owned.length,scopes:scopes.map(s=>({label:s.label,ok:s.result.ok,counts:Object.fromEntries(Object.entries(s.result.categories).map(([k,v])=>[k,v.length]))})),whitespace:output.whitespace,inventory:counts},null,2));
