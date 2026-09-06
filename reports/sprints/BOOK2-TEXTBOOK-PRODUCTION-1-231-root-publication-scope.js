// HOW TO ADAPT: exact committed integrated §231 root candidate, no scope exceptions.
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),a=require('assert/strict');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const head='06b99d84cfb030388af1be1ef1d2a43dfe36d813',lesson='219a977e495abe43c17949e7d8996aab4176faa0';
const git=(args,cwd=root)=>{const r=cp.spawnSync('git',args,{cwd,encoding:'utf8',maxBuffer:64*1024*1024});a.equal(r.status,0,r.stderr);return r.stdout.trim();};
const own=git(['diff','--name-only','-z','572d1ea2ededaffd28afc44eeeca223252a58ec5',head]).split('\0').filter(Boolean);
const extra=['reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.jsonl','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.md','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-output-manifest.md','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-plan-work-order.md'];
a(own.every(p=>p.startsWith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-')||/^reports\/rendered-proof\/BOOK2-TEXTBOOK-PRODUCTION-1\/231-(paragraaf|opgaven|antwoorden)-[a-f0-9]{12}-r\d+\//.test(p)||p.startsWith('build-scripts/content/book-2/231/')||p==='build-scripts/content/book-2/b2_231.py'||extra.includes(p)));
const checks=[
 ['whole_root_231_platform',['--lane','shared','--base','572d1ea2ededaffd28afc44eeeca223252a58ec5','--head',head]],
 ['whole_root_231_lessons',['--cwd',lessons,'--lane','textbook','--base','d4e1910d60964ee4b9ac97eefbf0e0ed202fc28f','--head',lesson]],
 ['complete_platform',['--lane','shared','--base','96416b6b5bd57094576e9aba0a42d682584ec479','--head',head]],
 ['complete_lessons',['--cwd',lessons,'--lane','textbook','--base','f09fd6e88edc5049b026b16b0158e7e188091d2d','--head',lesson]]
].map(([name,args])=>{const command=['build-scripts/workflows/check-paragraph-lane-scope.js',...args,'--json'];const r=cp.spawnSync(process.execPath,command,{cwd:root,encoding:'utf8',maxBuffer:128*1024*1024});const result=JSON.parse(r.stdout);a.equal(r.status,0,r.stderr+r.stdout);a.equal(result.categories.unknown.length,0);a.equal(result.exception.present,false);return {name,command,exit_code:r.status,stdout:r.stdout,stderr:r.stderr,result};});
const historicalLog='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-REVIEW-command-log.md';
const historicalWhitespacePaths=[historicalLog,'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-review-probes-result.json'];
const whitespace=[
 ['default_complete_import',['diff','--check','572d1ea2ededaffd28afc44eeeca223252a58ec5',head]],
 ['cr_at_eol_complete_import',['-c','core.whitespace=cr-at-eol','diff','--check','572d1ea2ededaffd28afc44eeeca223252a58ec5',head]],
 ['all_other_paths',['diff','--check','572d1ea2ededaffd28afc44eeeca223252a58ec5',head,'--','.',...historicalWhitespacePaths.map(p=>':(exclude)'+p)]]
].map(([name,args])=>{const r=cp.spawnSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:64*1024*1024});if(name==='all_other_paths')a.equal(r.status,0,r.stdout+r.stderr);else{a.notEqual(r.status,0);const diagnosticPaths=r.stdout.split(/\r?\n/).filter(l=>/^[^+][^:]+:\d+: trailing whitespace\.$/.test(l));a(diagnosticPaths.length>0);const allowed=name==='cr_at_eol_complete_import'?[historicalLog]:historicalWhitespacePaths;a(diagnosticPaths.every(l=>allowed.some(p=>l.startsWith(p+':'))));}return {name,args,exit_code:r.status,stdout:r.stdout,stderr:r.stderr};});
// Both exact imported evidence files remain byte-identical to published blobs.
for(const p of historicalWhitespacePaths){const original=cp.spawnSync('git',['show','90200f386eebb469c30d515df4f16e585faa3def:'+p],{cwd:root,maxBuffer:64*1024*1024});a.equal(original.status,0);a(fs.readFileSync(path.join(root,p)).equals(original.stdout));}
git(['diff','--check','d4e1910d60964ee4b9ac97eefbf0e0ed202fc28f',lesson],lessons);
const out=path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-231-root-publication-scope.json');
fs.writeFileSync(out,JSON.stringify({status:'PASS',platform:head,lessons:lesson,strict_own_paths:own,checks,whitespace,historicalWhitespacePaths,historical_whitespace_note:'Whole-diff default FAIL concerns immutable reviewer command-log Windows stdout/stderr and CRLF probes-result.json. cr-at-eol still FAILS only for spaces after const in a preserved failed command excerpt. All other imported/source/root paths PASS; both original Git blobs retained. No global whitespace setting, native-scope exception or CI success claim.',limits:'Actual corrected candidate scope, not waiver of original builder failure, specialist QC, root acceptance or CI'},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:'PASS',strict_own_paths:own.length,checks:checks.map(x=>({name:x.name,exit_code:x.exit_code,categories:Object.fromEntries(Object.entries(x.result.categories).map(([k,v])=>[k,v.length]))})),output:out},null,2));
