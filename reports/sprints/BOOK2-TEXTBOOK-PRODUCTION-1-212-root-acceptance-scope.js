// HOW TO ADAPT: bind a new committed phase, never fabricate an anchor change.
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),a=require('assert/strict'),crypto=require('crypto');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen'),prefix='BOOK2-TEXTBOOK-PRODUCTION-1-212-root-acceptance';
const base='c724f1ae2cee0f4bf089c5b9da2ebaa1f55e5d6b',head='c4e4ef72755b710ec14dfd94fde566a82a71efd1';
const lb='d0d84a5f411c23141954090f3bc1d234e7e45cd3',lh='42996c60b4a93843dfe8488b8e5a3ea704871667';
const commands=[],hash=b=>crypto.createHash('sha256').update(b).digest('hex'),raw=p=>hash(fs.readFileSync(p));
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,maxBuffer:64*1024*1024});
function run(args,cwd=P,expected=0){const r=cp.spawnSync(args[0],args.slice(1),{cwd,maxBuffer:64*1024*1024}),row={args,cwd,exit_code:r.status,stdout:r.stdout.toString('utf8'),stderr:r.stderr.toString('utf8'),stdout_base64:r.stdout.toString('base64'),stderr_base64:r.stderr.toString('base64')};commands.push(row);if(expected!==null)a.equal(r.status,expected,JSON.stringify(row));return row;}
a.equal(run(['git','rev-parse','HEAD']).stdout.trim(),head);a.equal(run(['git','rev-parse','HEAD'],L).stdout.trim(),lh);a.equal(run(['git','status','--porcelain'],L).stdout.trim(),'');
const baseline=JSON.parse(fs.readFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-212-root-qc-evidence/baseline.json'),'utf8'));
const imports=new Map(baseline.imports.map(r=>[r.path,r]));a.equal(imports.size,270);
for(const r of imports.values()){a.equal(raw(path.join(P,r.path)),r.sha256,r.path);a(fs.readFileSync(path.join(P,r.path)).equals(git(P,'show',r.commit+':'+r.path)),r.path);}
const extras=new Set(['reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.md','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.jsonl','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-output-manifest.md']);
const changed=run(['git','diff','--name-only','--no-renames','-z',base,head]).stdout.split('\0').filter(Boolean),owned=[];
for(const n of changed){a(imports.has(n)||extras.has(n)||n.startsWith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-212-root-qc-')||n.startsWith('reports/sprints/'+prefix),n);const b=git(P,'show',head+':'+n);a(fs.readFileSync(path.join(P,n)).equals(b),n);owned.push({path:n,sha256:hash(b),imported:imports.has(n)});}
const canonical='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even';
const lpaths=run(['git','diff','--name-only','--no-renames','-z',lb,lh],L).stdout.split('\0').filter(Boolean);
a.deepEqual(lpaths.sort(),[canonical+'/2.1.2-quality-ref.yaml',canonical+'/2.1.2-textbook-handoff.md'].sort());
const scopes=[];
for(const[label,cwd,lane,b,h,expected]of[
 ['incremental-platform',P,'shared',base,head,1],['incremental-lessons',L,'textbook',lb,lh,0],
 ['complete-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',head,0],
 ['complete-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',lh,0]]){
 const r=JSON.parse(run(['node','build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',b,'--head',h,'--json'],P,expected).stdout);
 a.equal(r.categories.unknown.length,0);a.equal(r.ok,expected===0);if(expected===1)a.deepEqual(r.failures,['shared lane needs at least one shared platform change','generated index/report or review-evidence changes are allowed only with lane-owned changes']);scopes.push({label,result:r});
}
const white=run(['git','diff','--check',base,head]),cr=run(['git','-c','core.whitespace=cr-at-eol','diff','--check',base,head]);run(['git','diff','--check',lb,lh],L);
const whole=run(['git','diff','--check','96416b6b5bd57094576e9aba0a42d682584ec479',head],P,null);
const wholeCr=run(['git','-c','core.whitespace=cr-at-eol','diff','--check','96416b6b5bd57094576e9aba0a42d682584ec479',head],P,null);
const manifest=fs.readFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-output-manifest.md'),'utf8');
const rows=[...manifest.matchAll(/^\| (\d+) \| ([^|]+) \| ([^|]+) \| ([ACLP]) \| `([^`]+)` \|$/gm)];
a.equal(rows.length,41);a.equal(new Set(rows.map(m=>m[5])).size,41);a.deepEqual(rows.map(m=>Number(m[1])),Array.from({length:41},(_,i)=>i+1));
const hashes=new Map([...manifest.matchAll(/^\| ([^|]+) \/ ([^|]+) \| `([a-f0-9]{64})` \|/gm)].map(m=>[m[1].trim()+'/'+m[2].trim(),m[3]]));a.equal(hashes.size,21);
const counts={A:0,C:0,L:0,P:0},inventory=[];
for(const row of rows){const id=row[2].trim(),edition=row[3].trim(),status=row[4],rel='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/'+row[5],file=path.join(L,rel),present=fs.existsSync(file);counts[status]++;a.equal(present,status!=='P',rel);const digest=present?raw(file):null;if(status==='A'||status==='C')a.equal(digest,hashes.get(id+'/'+edition),rel);if(status==='L')a.equal(digest,hash(git(L,'show','f09fd6e88edc5049b026b16b0158e7e188091d2d:'+rel)),rel);if(present)a.equal(digest,hash(git(L,'show',lh+':'+rel)),rel);inventory.push({id,edition,status,path:rel,present,sha256:digest});}
a.deepEqual(counts,{A:15,C:6,L:8,P:12});
const result={status:'PASS',platform:{base,head},lessons:{base:lb,head:lh,changed:lpaths},strict_owned_paths:owned,scopes,whitespace:{incremental_default_exit:white.exit_code,incremental_cr_at_eol_exit:cr.exit_code,lessons_default_exit:0,complete_default_exit:whole.exit_code,complete_cr_at_eol_exit:wholeCr.exit_code,actual_historical_diagnostics_preserved:true,no_foreign_normalization:true},inventory_counts:counts,inventory,commands};
fs.writeFileSync(path.join(__dirname,prefix+'-scope.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:result.status,head,owned_paths:owned.length,scopes:scopes.map(s=>({label:s.label,ok:s.result.ok,counts:Object.fromEntries(Object.entries(s.result.categories).map(([k,v])=>[k,v.length]))})),whitespace:result.whitespace,inventory:counts},null,2));
