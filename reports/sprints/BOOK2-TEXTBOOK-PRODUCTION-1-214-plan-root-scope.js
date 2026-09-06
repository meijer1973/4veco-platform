// New exact root214 plan payload, not a rewrite of historical scope evidence.
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),a=require('assert/strict'),crypto=require('crypto');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen'),prefix='BOOK2-TEXTBOOK-PRODUCTION-1-214-plan-root';
const base='0b15d6bfa75fa62e00e5945e16a7cd8f9a7f6bf6',lb='3199ff2ae89b39a472b48ee0818de5b1c191063a',lh='30f57bfad2096c7afa507da48db9d82ee35a3c23',head=process.argv[2];
a.match(head,/^[a-f0-9]{40}$/);const commands=[];
function run(args,cwd=P,expected=0){const r=cp.spawnSync(args[0],args.slice(1),{cwd,maxBuffer:64*1024*1024});const c={args,cwd,exit_code:r.status,stdout:r.stdout.toString('utf8'),stderr:r.stderr.toString('utf8'),stdout_base64:r.stdout.toString('base64'),stderr_base64:r.stderr.toString('base64')};commands.push(c);if(expected!==null)a.equal(r.status,expected,JSON.stringify(c));return c;}
const check=JSON.parse(fs.readFileSync(path.join(__dirname,prefix+'-check.json'),'utf8')),imports=new Map(check.imports.map(r=>[r.path,r]));
const extras=new Set(['reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.md','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.jsonl']);
a.equal(run(['git','rev-parse','HEAD']).stdout.trim(),head);a.equal(run(['git','rev-parse','HEAD'],L).stdout.trim(),lh);a.equal(run(['git','status','--porcelain'],L).stdout.trim(),'');
const changed=run(['git','diff','--name-only','--no-renames','-z',base,head]).stdout.split('\0').filter(Boolean);
for(const n of changed)a(imports.has(n)||extras.has(n)||n.startsWith('reports/sprints/'+prefix+'-'),n);
for(const r of imports.values())a.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(P,r.path))).digest('hex'),r.sha256,r.path);
const scopes=[];
for(const[label,cwd,lane,b,h,expected]of[
 ['incremental-platform',P,'shared',base,head,1],['complete-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',head,0],
 ['incremental-lessons',L,'textbook',lb,lh,0],['complete-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',lh,0]]){
 const r=JSON.parse(run(['node','build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',b,'--head',h,'--json'],P,expected).stdout);
 a.equal(r.ok,expected===0);a.equal(r.categories.unknown.length,0);
 if(expected===1)a.deepEqual(r.failures,['shared lane needs at least one shared platform change','generated index/report or review-evidence changes are allowed only with lane-owned changes']);
 scopes.push({label,result:r});
}
const white=run(['git','diff','--check',base,head],P,null),cr=run(['git','-c','core.whitespace=cr-at-eol','diff','--check',base,head],P,null);
const historical=[...new Set([...white.stdout.matchAll(/^(.+?):\d+: (?:trailing whitespace|new blank line at EOF)\.?$/gm)].map(m=>m[1]))];
if(white.exit_code!==0)a(historical.length>0);
for(const n of historical){a(imports.has(n)&&n.endsWith('-command-log.md'),n);const r=imports.get(n),original=cp.execFileSync('git',['show',r.commit+':'+n],{cwd:P,maxBuffer:32*1024*1024});a(fs.readFileSync(path.join(P,n)).equals(original),n);}
run(['git','diff','--check',base,head,'--','.',...historical.map(n=>':(exclude)'+n)]);run(['git','diff','--check',lb,lh],L);
const wholeWhite=run(['git','diff','--check','96416b6b5bd57094576e9aba0a42d682584ec479',head],P,null);
const result={status:'PASS',actual_payload:head,base,lessons:{base:lb,head:lh},strict_owned_paths:changed,imports:check.imports,scopes,whitespace:{incremental_default_exit:white.exit_code,incremental_cr_at_eol_exit:cr.exit_code,historical,all_other_incremental_exit:0,lesson_exit:0,whole_default_exit:wholeWhite.exit_code,all_actual_diagnostics_preserved:true},commands};
fs.writeFileSync(path.join(__dirname,prefix+'-scope.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:result.status,head,owned_paths:changed.length,scopes:scopes.map(s=>({label:s.label,ok:s.result.ok,counts:Object.fromEntries(Object.entries(s.result.categories).map(([k,v])=>[k,v.length]))})),whitespace:result.whitespace},null,2));
