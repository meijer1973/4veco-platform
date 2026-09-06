// Exact committed phase scope. Invocation binds the actual payload HEAD.
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),a=require('assert/strict'),crypto=require('crypto');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-223-root-acceptance';
const base='e2ac9632eee88bd19b0a4e483ed88bb1e27f006f',head=process.argv[2];
const lb='42996c60b4a93843dfe8488b8e5a3ea704871667',lh='8a3d4018ad6a5082449a17c59f991cbdc93fbb62';
const verification='12c0d668c084789b73146f05db13aa7aaf337c63';
a.match(head,/^[a-f0-9]{40}$/);
const commands=[],hash=b=>crypto.createHash('sha256').update(b).digest('hex'),raw=p=>hash(fs.readFileSync(p));
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,maxBuffer:128*1024*1024});
function run(args,cwd=P,expected=0){const started=new Date().toISOString(),r=cp.spawnSync(args[0],args.slice(1),{cwd,maxBuffer:128*1024*1024});
 const row={args,cwd,started,ended:new Date().toISOString(),exit_code:r.status,stdout:r.stdout.toString('utf8'),stderr:r.stderr.toString('utf8'),stdout_base64:r.stdout.toString('base64'),stderr_base64:r.stderr.toString('base64')};
 commands.push(row);if(expected!==null)a.equal(r.status,expected,JSON.stringify(row));return row;}
a.equal(git(P,'rev-parse','HEAD').toString().trim(),head);
a.equal(git(L,'rev-parse','HEAD').toString().trim(),lh);
a.equal(git(L,'status','--porcelain').toString().trim(),'');
const baseline=JSON.parse(fs.readFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-223-root-qc-baseline.json'),'utf8'));
const imports=new Map(baseline.imports.map(r=>[r.path,r]));a.equal(imports.size,867);
for(const r of imports.values())a.equal(raw(path.join(P,r.path)),r.raw_sha256,r.path);
const extras=new Set(['reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.md','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.jsonl','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-output-manifest.md']);
const changed=git(P,'diff','--name-only','--no-renames','-z',base,head).toString().split('\0').filter(Boolean),owned=[];
for(const n of changed){a(imports.has(n)||extras.has(n)||n.startsWith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-root-qc-')||n.startsWith('reports/sprints/'+prefix),n);
 const b=git(P,'show',head+':'+n);a(fs.readFileSync(path.join(P,n)).equals(b),n);owned.push({path:n,sha256:hash(b),imported:imports.has(n)});}
const rel='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit';
const expectedLessons=['2.2.3-quality-ref.yaml','2.2.3-review.md','2.2.3-textbook-handoff.md',...['paragraaf','opgaven'].flatMap(k=>['md','html','zip'].map(ext=>'2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit – '+k+'.'+ext))].map(n=>rel+'/'+n);
const lpaths=git(L,'diff','--name-only','--no-renames','-z',lb,lh).toString().split('\0').filter(Boolean);
a.deepEqual(lpaths.sort(),expectedLessons.sort());
const scopes=[];
for(const[label,cwd,lane,b,h,expected]of[
 ['whole-adoption-platform',P,'shared',base,head,0],['whole-adoption-lessons',L,'textbook',lb,lh,0],
 ['root-acceptance-only-platform',P,'shared',verification,head,1],
 ['complete-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',head,0],
 ['complete-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',lh,0]]) {
 const result=JSON.parse(run(['node','build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',b,'--head',h,'--json'],P,expected).stdout);
 a.equal(result.categories.unknown.length,0);a.equal(result.ok,expected===0);
 if(expected===1)a.deepEqual(result.failures,['shared lane needs at least one shared platform change','generated index/report or review-evidence changes are allowed only with lane-owned changes']);
 scopes.push({label,result});
}
const white=run(['git','diff','--check',base,head],P,null),cr=run(['git','-c','core.whitespace=cr-at-eol','diff','--check',base,head],P,null);
const ownWhite=run(['git','diff','--check',verification,head]),lwhite=run(['git','diff','--check',lb,lh],L);
const whole=run(['git','diff','--check','96416b6b5bd57094576e9aba0a42d682584ec479',head],P,null);
const wholeCr=run(['git','-c','core.whitespace=cr-at-eol','diff','--check','96416b6b5bd57094576e9aba0a42d682584ec479',head],P,null);
const manifest=fs.readFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-output-manifest.md'),'utf8');
const rows=[...manifest.matchAll(/^\| (\d+) \| ([^|]+) \| ([^|]+) \| ([ACLP]) \| `([^`]+)` \|$/gm)];
a.equal(rows.length,41);a.equal(new Set(rows.map(m=>m[5])).size,41);
const hashes=new Map([...manifest.matchAll(/^\| ([^|]+) \/ ([^|]+) \| `([a-f0-9]{64})` \|/gm)].map(m=>[m[1].trim()+'/'+m[2].trim(),m[3]]));a.equal(hashes.size,21);
const counts={A:0,C:0,L:0,P:0},inventory=[];
for(const row of rows){const id=row[2].trim(),edition=row[3].trim(),status=row[4],relative='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/'+row[5],file=path.join(L,relative),present=fs.existsSync(file);
 counts[status]++;a.equal(present,status!=='P');const digest=present?raw(file):null;
 if(status==='A'||status==='C')a.equal(digest,hashes.get(id+'/'+edition));
 if(status==='L')a.equal(digest,hash(git(L,'show','f09fd6e88edc5049b026b16b0158e7e188091d2d:'+relative)));
 if(present)a.equal(digest,hash(git(L,'show',lh+':'+relative)));
 inventory.push({id,edition,status,path:relative,present,sha256:digest});}
a.deepEqual(counts,{A:18,C:3,L:8,P:12});
const result={status:'PASS',platform:{base,head},lessons:{base:lb,head:lh,changed:lpaths},strict_owned_paths:owned,scopes,
 whitespace:{adoption_default_exit:white.exit_code,adoption_cr_at_eol_exit:cr.exit_code,root_acceptance_only_exit:ownWhite.exit_code,lessons_exit:lwhite.exit_code,complete_default_exit:whole.exit_code,complete_cr_at_eol_exit:wholeCr.exit_code,no_foreign_normalization:true},inventory_counts:counts,inventory,commands};
fs.writeFileSync(path.join(__dirname,prefix+'-scope.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:'PASS',head,owned_paths:owned.length,scopes:scopes.map(s=>({label:s.label,ok:s.result.ok,counts:Object.fromEntries(Object.entries(s.result.categories).map(([k,v])=>[k,v.length]))})),whitespace:result.whitespace,counts},null,2));
